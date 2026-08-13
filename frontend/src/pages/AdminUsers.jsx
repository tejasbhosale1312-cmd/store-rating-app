import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', email: '', password: '', address: '', role: 'user' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  function loadUsers() {
    const params = { ...filters, sortBy, order };
    api.get('/admin/users', { params })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'));
  }

  useEffect(loadUsers, [sortBy, order]);

  function handleFilterSubmit(e) {
    e.preventDefault();
    loadUsers();
  }

  function toggleSort(field) {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/users', form);
      setForm(emptyForm);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setFormError(errs ? errs.map((x) => x.msg).join(', ') : err.response?.data?.message || 'Failed to create user');
    }
  }

  async function viewDetail(id) {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setDetail(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user');
    }
  }

  return (
    <div className="page">
      <h2>Manage Users</h2>
      {error && <div className="error">{error}</div>}

      <form className="filter-bar" onSubmit={handleFilterSubmit}>
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
        <button type="submit">Filter</button>
        <button type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </form>

      {showForm && (
        <form className="inline-form" onSubmit={handleCreate}>
          {formError && <div className="error">{formError}</div>}
          <input placeholder="Name (20-60 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="owner">Store Owner</option>
          </select>
          <button type="submit">Create</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')}>Name</th>
            <th onClick={() => toggleSort('email')}>Email</th>
            <th onClick={() => toggleSort('address')}>Address</th>
            <th onClick={() => toggleSort('role')}>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td><button onClick={() => viewDetail(u.id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {detail && (
        <div className="detail-panel">
          <h3>User Detail</h3>
          <p><strong>Name:</strong> {detail.name}</p>
          <p><strong>Email:</strong> {detail.email}</p>
          <p><strong>Address:</strong> {detail.address}</p>
          <p><strong>Role:</strong> {detail.role}</p>
          {detail.role === 'owner' && <p><strong>Store Rating:</strong> {detail.rating || 'No ratings yet'}</p>}
          <button onClick={() => setDetail(null)}>Close</button>
        </div>
      )}
    </div>
  );
}