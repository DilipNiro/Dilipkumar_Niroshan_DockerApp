import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { movieService } from '../services/movieService.js';
import { watchlistService } from '../services/watchlistService.js';
import { MovieGrid } from '../components/movies/MovieGrid.jsx';
import { MovieDetailModal } from '../components/movies/MovieDetailModal.jsx';
import { SearchBar } from '../components/movies/SearchBar.jsx';
import { GenreFilter } from '../components/movies/GenreFilter.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './HomePage.css';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genre: ''
  });

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAll(filters);
      setMovies(data);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadWatchlist = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await watchlistService.getAll();
      const movieIds = data.map(item => item.movieId);
      setWatchlistMovieIds(movieIds);
    } catch (err) {
      console.error('Error loading watchlist:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleGenreChange = (genre) => {
    setFilters(prev => ({ ...prev, genre }));
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToWatchlist = async (movieId) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour ajouter des films à votre watchlist');
      return;
    }

    try {
      await watchlistService.add(movieId);
      await loadWatchlist();
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout à la watchlist');
    }
  };

  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1 className="home-page__title">Catalogue de Films</h1>
        <p className="home-page__subtitle">Découvrez notre collection de films</p>
      </div>

      <div className="home-page__filters">
        <SearchBar onSearch={handleSearch} />
        <GenreFilter 
          selectedGenre={filters.genre} 
          onGenreChange={handleGenreChange} 
        />
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={loadMovies}
        />
      )}

      <MovieGrid
        movies={movies}
        watchlistMovieIds={watchlistMovieIds}
        onMovieClick={handleMovieClick}
        onAddToWatchlist={isAuthenticated ? handleAddToWatchlist : null}
        loading={loading}
        error={null}
      />

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToWatchlist={isAuthenticated ? handleAddToWatchlist : null}
          isInWatchlist={watchlistMovieIds.includes(selectedMovie.id)}
          showAddButton={isAuthenticated}
        />
      )}
    </div>
  );
};
