import { MovieCard } from './MovieCard.jsx';
import { LoadingSpinner } from '../common/LoadingSpinner.jsx';
import { ErrorMessage } from '../common/ErrorMessage.jsx';
import './MovieGrid.css';

export const MovieGrid = ({
  movies,
  watchlistMovieIds = [],
  onMovieClick,
  onAddToWatchlist,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="movie-grid__loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-grid__error">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid__empty">
        <div className="movie-grid__empty-icon">🎬</div>
        <h3>Aucun film trouvé</h3>
        <p>Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={onMovieClick}
          onAddToWatchlist={onAddToWatchlist}
          isInWatchlist={watchlistMovieIds.includes(movie.id)}
          showAddButton={!!onAddToWatchlist}
        />
      ))}
    </div>
  );
};
