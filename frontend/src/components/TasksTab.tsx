import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task } from '../types';
import { TaskModal } from './TaskModal';
import '../styles/TasksTab.css';

export const TasksTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAllTasks,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fef3c7';
      case 'in_progress':
        return '#dbeafe';
      case 'done':
        return '#d1fae5';
      default:
        return '#f1f5f9';
    }
  };

  if (isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage all tasks and assignments</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddTask}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Task
        </button>
      </div>

      <div className="tasks-table-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks created yet. Click "Add Task" to create your first task.</p>
          </div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="task-title">{task.name}</td>
                  <td className="task-description">{task.description}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{task.assignedTo.name}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEditTask(task)}
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete"
                        disabled={deleteTaskMutation.isPending}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <TaskModal task={editingTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

