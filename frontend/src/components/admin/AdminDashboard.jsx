import { useState } from 'react';
import './AdminDashboard.css';

export const AdminDashboard = ({
  stats,
  onViewMovies,
  onViewUsers
}) => {
  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard__title">Tableau de bord</h2>
      
      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-icon">🎬</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{stats.totalMovies || 0}</div>
            <div className="admin-dashboard__stat-label">Films</div>
          </div>
          <button 
            className="admin-dashboard__stat-action"
            onClick={onViewMovies}
          >
            Voir les films →
          </button>
        </div>

        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-icon">👥</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{stats.totalUsers || 0}</div>
            <div className="admin-dashboard__stat-label">Utilisateurs</div>
          </div>
          <button 
            className="admin-dashboard__stat-action"
            onClick={onViewUsers}
          >
            Voir les utilisateurs →
          </button>
        </div>

        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-icon">📋</div>
          <div className="admin-dashboard__stat-content">
            <div className="admin-dashboard__stat-value">{stats.totalWatchlists || 0}</div>
            <div className="admin-dashboard__stat-label">Watchlists</div>
          </div>
        </div>
      </div>
    </div>
  );
};

