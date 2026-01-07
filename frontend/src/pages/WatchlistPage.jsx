import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { watchlistService } from '../services/watchlistService.js';
import { WatchlistItem } from '../components/watchlist/WatchlistItem.jsx';
import { WatchlistFilters } from '../components/watchlist/WatchlistFilters.jsx';
import { MovieDetailModal } from '../components/movies/MovieDetailModal.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import './WatchlistPage.css';

export const WatchlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  const loadWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await watchlistService.getAll(filters.status || undefined);
      setWatchlistItems(data);
    } catch (err) {
      setError('Erreur lors du chargement de votre watchlist');
      console.error('Error loading watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters.status]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  useEffect(() => {
    let filtered = [...watchlistItems];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => {
        const titleMatch = item.movie.title?.toLowerCase().includes(searchLower);
        const directorMatch = item.movie.director?.toLowerCase().includes(searchLower);
        
        // Check genres (support both old and new format)
        let genreMatch = false;
        if (item.movie.genres && Array.isArray(item.movie.genres)) {
          genreMatch = item.movie.genres.some(mg => {
            const genreName = mg.genre?.name || mg.genre || mg;
            return typeof genreName === 'string' && genreName.toLowerCase().includes(searchLower);
          });
        } else if (item.movie.genre) {
          genreMatch = item.movie.genre.toLowerCase().includes(searchLower);
        }
        
        return titleMatch || directorMatch || genreMatch;
      });
    }

    setFilteredItems(filtered);
  }, [watchlistItems, filters.search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await watchlistService.updateStatus(id, newStatus);
      await loadWatchlist();
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleRemove = async (id) => {
    try {
      await watchlistService.remove(id);
      await loadWatchlist();
    } catch (err) {
      throw new Error('Erreur lors de la suppression');
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleStatusFilterChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({ ...prev, search }));
  };

  if (!isAuthenticated) {
    return (
      <div className="watchlist-page">
        <EmptyState
          icon="🔒"
          title="Connexion requise"
          message="Vous devez être connecté pour accéder à votre watchlist."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-page__loading">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-page__header">
        <h1 className="watchlist-page__title">Ma Watchlist</h1>
        <p className="watchlist-page__subtitle">
          {watchlistItems.length} film{watchlistItems.length > 1 ? 's' : ''} dans votre watchlist
        </p>
      </div>

      <WatchlistFilters
        selectedStatus={filters.status}
        onStatusChange={handleStatusFilterChange}
        searchTerm={filters.search}
        onSearchChange={handleSearchChange}
      />

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={loadWatchlist}
        />
      )}

      {filteredItems.length === 0 ? (
        <EmptyState
          icon="📭"
          title={watchlistItems.length === 0 ? "Votre watchlist est vide" : "Aucun résultat"}
          message={
            watchlistItems.length === 0
              ? "Commencez à ajouter des films à votre watchlist depuis le catalogue !"
              : "Aucun film ne correspond à vos critères de recherche."
          }
        />
      ) : (
        <div className="watchlist-page__items">
          {filteredItems.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
              onMovieClick={handleMovieClick}
            />
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isInWatchlist={true}
          showAddButton={false}
        />
      )}
    </div>
  );
};

