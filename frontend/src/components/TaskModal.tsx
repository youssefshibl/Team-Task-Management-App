import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { authApi } from '../api/auth';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { SearchableSelect } from './SearchableSelect';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignedTo: '',
  });
  const [error, setError] = useState('');

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: authApi.getMembers,
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save the current overflow style
    const originalOverflow = document.body.style.overflow;
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Restore scrolling when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (task) {
      // Ensure we set the assignedTo ID correctly
      const assignedToId = task.assignedTo?.id || '';
      
      setFormData({
        name: task.name || '',
        description: task.description || '',
        assignedTo: assignedToId,
      });
    } else {
      // Reset form when creating new task
      setFormData({
        name: '',
        description: '',
        assignedTo: '',
      });
    }
    setError(''); // Clear any previous errors
  }, [task]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create task');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update task');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.description.trim() || !formData.assignedTo) {
      setError('All fields are required');
      return;
    }

    if (task) {
      updateMutation.mutate({
        id: task.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData as CreateTaskRequest);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="task-name">Task Name *</label>
            <input
              id="task-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="task-description">Description *</label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="task-assigned">Assign To *</label>
            <SearchableSelect
              id="task-assigned"
              options={members}
              value={formData.assignedTo}
              onChange={(value) => setFormData({ ...formData, assignedTo: value })}
              placeholder="Select a team member"
              required
            />
            {task && !formData.assignedTo && members.length > 0 && (
              <small style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                Note: Previously assigned user may not be in the members list
              </small>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

