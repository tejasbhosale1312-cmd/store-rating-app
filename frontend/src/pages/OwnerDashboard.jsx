import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <div className="page"><div className="error">{error}</div></div>;
  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h2>{data.store.name}</h2>
      <p>{data.store.address}</p>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.averageRating || '—'}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.raters.length}</div>
          <div className="stat-label">Total Raters</div>
        </div>
      </div>

      <h3>Users who rated your store</h3>
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Rating</th></tr>
        </thead>
        <tbody>
          {data.raters.map((r) => (
            <tr key={r.userId}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}