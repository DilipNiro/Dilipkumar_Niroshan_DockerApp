import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService.js';
import { api } from '../services/api.js';
import { AdminDashboard } from '../components/admin/AdminDashboard.jsx';
import { MovieTable } from '../components/admin/MovieTable.jsx';
import { MovieForm } from '../components/admin/MovieForm.jsx';
import { UserTable } from '../components/admin/UserTable.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { userService } from '../services/userService.js';
import './AdminPage.css';

export const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalWatchlists: 0
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Uniquement pour les films maintenant
  const [view, setView] = useState('dashboard'); // 'dashboard', 'movies', 'users'

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate]);

  const loadStats = async (moviesCount = 0) => {
    try {
      const [usersData, watchlistsData] = await Promise.all([
        userService.getAll().catch(() => []),
        api.get('/watchlist').catch(() => [])
      ]);
      
      setStats({
        totalMovies: moviesCount,
        totalUsers: usersData.length || 0,
        totalWatchlists: watchlistsData.length || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [moviesData, usersData] = await Promise.all([
        movieService.getAll(),
        userService.getAll().catch(() => [])
      ]);
      
      setMovies(moviesData);
      setUsers(usersData);
      
      await loadStats(moviesData.length);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateMovie = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  const handleSubmitMovie = async (movieData) => {
    try {
      if (editingMovie) {
        await movieService.update(editingMovie.id, movieData);
      } else {
        await movieService.create(movieData);
      }
      setShowForm(false);
      setEditingMovie(null);
      await loadData();
    } catch (err) {
      throw new Error('Erreur lors de l\'enregistrement du film');
    }
  };

  const handleDeleteMovie = (movie) => {
    setDeleteConfirm(movie);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await movieService.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadData();
    } catch (err) {
      setError('Erreur lors de la suppression du film');
      setDeleteConfirm(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  if (loading && movies.length === 0) {
    return (
      <div className="admin-page">
        <div className="admin-page__loading">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Administration</h1>
        <div className="admin-page__tabs">
          <button
            className={`admin-page__tab ${view === 'dashboard' ? 'admin-page__tab--active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            Tableau de bord
          </button>
          <button
            className={`admin-page__tab ${view === 'movies' ? 'admin-page__tab--active' : ''}`}
            onClick={() => setView('movies')}
          >
            Films
          </button>
          <button
            className={`admin-page__tab ${view === 'users' ? 'admin-page__tab--active' : ''}`}
            onClick={() => setView('users')}
          >
            Utilisateurs
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={loadData}
          onClose={() => setError(null)}
        />
      )}

      {view === 'dashboard' && (
        <AdminDashboard
          stats={stats}
          onViewMovies={() => setView('movies')}
          onViewUsers={() => setView('users')}
        />
      )}

      {view === 'movies' && (
        <div className="admin-page__movies">
          <div className="admin-page__movies-header">
            <h2 className="admin-page__section-title">Gestion des films</h2>
            <button
              className="admin-page__create-button"
              onClick={handleCreateMovie}
            >
              + Ajouter un film
            </button>
          </div>

          {showForm && (
            <div className="admin-page__form-section">
              <MovieForm
                movie={editingMovie}
                onSubmit={handleSubmitMovie}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          {!showForm && (
            <MovieTable
              movies={movies}
              onEdit={handleEditMovie}
              onDelete={handleDeleteMovie}
              loading={loading}
            />
          )}
        </div>
      )}

      {view === 'users' && (
        <div className="admin-page__users">
          <div className="admin-page__users-header">
            <h2 className="admin-page__section-title">Gestion des utilisateurs</h2>
          </div>
          <UserTable
            users={users}
            loading={loading}
          />
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Supprimer le film"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.title}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

