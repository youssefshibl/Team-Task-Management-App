import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@chakra-ui/react';
import { tasksApi } from '../api/tasks';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { SearchableMemberSelect } from '../components/SearchableMemberSelect';
import { Pagination } from '../components/Pagination';
import '../styles/MemberDashboard.css';

const DEFAULT_LIMIT = 30;

export const MemberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedLeader, setSelectedLeader] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['assigned-tasks', currentPage],
    queryFn: () => tasksApi.getAssignedTasks(currentPage, DEFAULT_LIMIT),
  });

  const { data: leaders = [] } = useQuery({
    queryKey: ['leaders'],
    queryFn: authApi.getLeaders,
  });

  const tasks = data?.tasks || [];
  const pagination = data?.pagination;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedLeader]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'done' }) =>
      tasksApi.updateTaskStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-tasks'] });
    },
  });

  const handleStatusChange = (taskId: string, status: 'pending' | 'in_progress' | 'done') => {
    updateStatusMutation.mutate({ id: taskId, status });
  };

  // Filter tasks by status and team leader (client-side filtering on paginated results)
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    const matchesLeader = !selectedLeader || task.assignedBy.id === selectedLeader;
    return matchesStatus && matchesLeader;
  });

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

  return (
    <div className="member-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>My Tasks</h1>
            <p>Welcome back, {user?.name}!</p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="leader-filter">Filter by Team Leader:</label>
            <Box>
              <SearchableMemberSelect
                members={leaders}
                selectedMemberId={selectedLeader}
                onSelect={setSelectedLeader}
                placeholder="All Leaders"
              />
            </Box>
          </div>
          {(selectedStatus || selectedLeader) && (
            <div className="filter-info">
              Showing {filteredTasks.length} of {tasks.length} tasks on this page
            </div>
          )}
          {(selectedStatus || selectedLeader) && (
            <button
              className="btn btn-secondary btn-clear-filters"
              onClick={() => {
                setSelectedStatus('');
                setSelectedLeader('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks assigned to you yet.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>
                  No tasks found
                  {selectedStatus && ` with status "${selectedStatus.replace('_', ' ')}"`}
                  {selectedStatus && selectedLeader && ' and'}
                  {selectedLeader && ` assigned by "${leaders.find((l) => l.id === selectedLeader)?.name || 'selected leader'}"`}
                  .
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedStatus('');
                    setSelectedLeader('');
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {filteredTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.name}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <p>
                      <strong>Assigned by:</strong> {task.assignedBy.name}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="task-actions">
                    <label htmlFor={`status-${task.id}`}>Update Status:</label>
                    <select
                      id={`status-${task.id}`}
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as 'pending' | 'in_progress' | 'done'
                        )
                      }
                      disabled={updateStatusMutation.isPending}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {pagination && pagination.totalPages > 1 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                    total={pagination.total}
                    limit={pagination.limit}
                  />
                </div>
              )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

