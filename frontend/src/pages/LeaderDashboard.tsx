import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UsersTab } from '../components/UsersTab';
import { TasksTab } from '../components/TasksTab';
import '../styles/LeaderDashboard.css';

type Tab = 'users' | 'tasks';

export const LeaderDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  return (
    <div className="leader-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Task Manager</h2>
          <p className="user-info">{user?.name}</p>
          <span className="role-badge">Team Lead</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users
          </button>

          <button
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
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
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Tasks
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary btn-full" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'tasks' && <TasksTab />}
      </main>
    </div>
  );
};

