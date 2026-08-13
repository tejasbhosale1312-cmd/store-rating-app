import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/stores');
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.map((x) => x.msg).join(', ') : err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        <label>Name (20-60 characters)</label>
        <input name="name" value={form.name} onChange={handleChange} required minLength={20} maxLength={60} />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        <label>Address (max 400 characters)</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} />
        <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} maxLength={16} />
        <button type="submit">Create Account</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}