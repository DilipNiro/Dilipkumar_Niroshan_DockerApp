import { useState } from 'react';
import './MovieTable.css';

export const MovieTable = ({
  movies,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getMovieImage = (movie) => {
    return movie.image || '/images/its-movie-time-vector.jpg';
  };

  const handleImageError = (e) => {
    e.target.src = '/images/its-movie-time-vector.jpg';
  };

  if (loading) {
    return (
      <div className="movie-table__loading">
        <p>Chargement...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-table__empty">
        <p>Aucun film trouvé</p>
      </div>
    );
  }

  return (
    <div className="movie-table-wrapper">
      <table className="movie-table">
        <thead>
          <tr>
            <th className="movie-table__th movie-table__th--image">Image</th>
            <th 
              className="movie-table__th movie-table__th--sortable" 
              onClick={() => handleSort('title')}
            >
              Titre {getSortIcon('title')}
            </th>
            <th 
              className="movie-table__th movie-table__th--sortable" 
              onClick={() => handleSort('genre')}
            >
              Genre {getSortIcon('genre')}
            </th>
            <th 
              className="movie-table__th movie-table__th--sortable" 
              onClick={() => handleSort('year')}
            >
              Année {getSortIcon('year')}
            </th>
            <th 
              className="movie-table__th movie-table__th--sortable" 
              onClick={() => handleSort('rating')}
            >
              Note {getSortIcon('rating')}
            </th>
            <th className="movie-table__th movie-table__th--actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMovies.map((movie) => (
            <tr key={movie.id} className="movie-table__row">
              <td className="movie-table__td movie-table__td--image">
                <img
                  src={getMovieImage(movie)}
                  alt={movie.title}
                  className="movie-table__image"
                  onError={handleImageError}
                />
              </td>
              <td className="movie-table__td movie-table__td--title">
                <strong>{movie.title}</strong>
                <div className="movie-table__meta">
                  {movie.director} • {movie.duration} min
                </div>
              </td>
              <td className="movie-table__td">
                <div className="movie-table__badges">
                  {movie.genres && movie.genres.length > 0 ? (
                    movie.genres.map((mg, idx) => {
                      const genreName = mg.genre?.name || mg.genre || mg;
                      return (
                        <span key={idx} className="movie-table__badge">
                          {genreName}
                        </span>
                      );
                    })
                  ) : movie.genre ? (
                    <span className="movie-table__badge">{movie.genre}</span>
                  ) : (
                    <span className="movie-table__badge">-</span>
                  )}
                </div>
              </td>
              <td className="movie-table__td">{movie.year}</td>
              <td className="movie-table__td">
                <div className="movie-table__rating">
                  <span className="movie-table__stars">
                    {'★'.repeat(Math.round(movie.rating / 2))}
                    {'☆'.repeat(5 - Math.round(movie.rating / 2))}
                  </span>
                  <span className="movie-table__rating-value">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </td>
              <td className="movie-table__td movie-table__td--actions">
                <button
                  className="movie-table__button movie-table__button--edit"
                  onClick={() => onEdit(movie)}
                  aria-label="Modifier"
                >
                  ✏️
                </button>
                <button
                  className="movie-table__button movie-table__button--delete"
                  onClick={() => onDelete(movie)}
                  aria-label="Supprimer"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

