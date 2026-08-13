import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  function loadStores() {
    const params = { ...filters, sortBy, order };
    api.get('/admin/stores', { params })
      .then((res) => setStores(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }

  useEffect(loadStores, [sortBy, order]);

  function handleFilterSubmit(e) {
    e.preventDefault();
    loadStores();
  }

  function toggleSort(field) {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...form, ownerId: form.ownerId ? Number(form.ownerId) : null };
      await api.post('/admin/stores', payload);
      setForm(emptyForm);
      setShowForm(false);
      loadStores();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setFormError(errs ? errs.map((x) => x.msg).join(', ') : err.response?.data?.message || 'Failed to create store');
    }
  }

  return (
    <div className="page">
      <h2>Manage Stores</h2>
      {error && <div className="error">{error}</div>}

      <form className="filter-bar" onSubmit={handleFilterSubmit}>
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button type="submit">Filter</button>
        <button type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Store'}
        </button>
      </form>

      {showForm && (
        <form className="inline-form" onSubmit={handleCreate}>
          {formError && <div className="error">{formError}</div>}
          <input placeholder="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Store Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input placeholder="Owner User ID (optional)" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} />
          <button type="submit">Create</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')}>Name</th>
            <th onClick={() => toggleSort('email')}>Email</th>
            <th onClick={() => toggleSort('address')}>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.dataValues?.avgRating ?? s.avgRating ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}