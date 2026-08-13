import { useState } from 'react';
import api from '../api/axios';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.put('/auth/update-password', { currentPassword, newPassword });
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.map((x) => x.msg).join(', ') : err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <label>New Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} maxLength={16} />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}