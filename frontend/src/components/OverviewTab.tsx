import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import '../styles/OverviewTab.css';

export const OverviewTab: React.FC = () => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: tasksApi.getStatistics,
  });

  if (isLoading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (!statistics) {
    return <div className="empty-state">No statistics available</div>;
  }

  const { pending, in_progress, done, total } = statistics;

  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="overview-tab">
      <div className="tab-header">
        <h1>Overview</h1>
        <p>Task statistics and insights</p>
      </div>

      <div className="statistics-grid">
        <div className="stat-card stat-card-total">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
          </div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{total}</p>
            <p className="stat-label">All tasks created</p>
          </div>
        </div>

        <div className="stat-card stat-card-pending">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{pending}</p>
            <p className="stat-label">
              {getPercentage(pending)}% of total
            </p>
          </div>
        </div>

        <div className="stat-card stat-card-progress">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">{in_progress}</p>
            <p className="stat-label">
              {getPercentage(in_progress)}% of total
            </p>
          </div>
        </div>

        <div className="stat-card stat-card-done">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{done}</p>
            <p className="stat-label">
              {getPercentage(done)}% of total
            </p>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="progress-section">
          <h2>Task Status Distribution</h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar-segment progress-pending"
              style={{ width: `${getPercentage(pending)}%` }}
              title={`Pending: ${pending} tasks`}
            >
              {getPercentage(pending) > 5 && (
                <span className="progress-label">{getPercentage(pending)}%</span>
              )}
            </div>
            <div
              className="progress-bar-segment progress-in-progress"
              style={{ width: `${getPercentage(in_progress)}%` }}
              title={`In Progress: ${in_progress} tasks`}
            >
              {getPercentage(in_progress) > 5 && (
                <span className="progress-label">{getPercentage(in_progress)}%</span>
              )}
            </div>
            <div
              className="progress-bar-segment progress-done"
              style={{ width: `${getPercentage(done)}%` }}
              title={`Done: ${done} tasks`}
            >
              {getPercentage(done) > 5 && (
                <span className="progress-label">{getPercentage(done)}%</span>
              )}
            </div>
          </div>
          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#fef3c7' }}></span>
              <span>Pending ({pending})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#dbeafe' }}></span>
              <span>In Progress ({in_progress})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#d1fae5' }}></span>
              <span>Done ({done})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

