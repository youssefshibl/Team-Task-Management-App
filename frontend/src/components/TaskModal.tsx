import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { authApi } from '../api/auth';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

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

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        assignedTo: task.assignedTo.id,
      });
    }
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
            <select
              id="task-assigned"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              required
            >
              <option value="">Select a team member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
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

