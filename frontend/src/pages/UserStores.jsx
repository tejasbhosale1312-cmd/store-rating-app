import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function loadStores() {
    api.get('/stores', { params: search })
      .then((res) => setStores(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }

  useEffect(loadStores, []);

  function handleSearch(e) {
    e.preventDefault();
    loadStores();
  }

  async function rate(storeId, value) {
    setError('');
    setMessage('');
    try {
      await api.post(`/stores/${storeId}/rating`, { value });
      setMessage('Rating submitted.');
      loadStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  }

  return (
    <div className="page">
      <h2>Stores</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <form className="filter-bar" onSubmit={handleSearch}>
        <input placeholder="Search by name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input placeholder="Search by address" value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} />
        <button type="submit">Search</button>
      </form>

      <div className="store-grid">
        {stores.map((s) => (
          <div className="store-card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.address}</p>
            <p>Overall Rating: {s.overallRating || 'No ratings yet'}</p>
            <p>Your Rating: {s.myRating || 'Not rated'}</p>
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  className={s.myRating === v ? 'active' : ''}
                  onClick={() => rate(s.id, v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}