import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalStores}</div>
            <div className="stat-label">Total Stores</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalRatings}</div>
            <div className="stat-label">Total Ratings</div>
          </div>
        </div>
      )}
      <div className="admin-links">
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/stores">Manage Stores</Link>
      </div>
    </div>
  );
}