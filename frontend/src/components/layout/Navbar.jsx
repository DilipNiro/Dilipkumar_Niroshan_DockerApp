import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 MovieApp
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                Films
              </Link>
              <Link to="/watchlist" className="nav-link">
                Ma Watchlist
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <div className="user-menu">
                <span className="user-name">{user?.email}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Connexion
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
