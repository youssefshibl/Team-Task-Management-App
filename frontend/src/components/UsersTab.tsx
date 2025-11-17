import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import '../styles/UsersTab.css';

export const UsersTab: React.FC = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: authApi.getMembers,
  });

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h1>Team Members</h1>
        <p>View all team members</p>
      </div>

      <div className="users-grid">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No team members found.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

