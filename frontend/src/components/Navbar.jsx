import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Store Rating Platform</div>
      <div className="navbar-links">
        {user?.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
        {user?.role === 'user' && <Link to="/stores">Stores</Link>}
        {user?.role === 'owner' && <Link to="/owner">My Store</Link>}
        {user && <Link to="/update-password">Change Password</Link>}
        {user ? (
          <>
            <span className="navbar-user">{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}