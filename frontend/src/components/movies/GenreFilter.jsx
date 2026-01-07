import { useState, useEffect } from 'react';
import { genreService } from '../../services/genreService.js';
import './GenreFilter.css';

export const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  const [genres, setGenres] = useState(['Tous']);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const allGenres = await genreService.getAll();
        const genreNames = ['Tous', ...allGenres.map(g => g.name)];
        setGenres(genreNames);
      } catch (err) {
        console.error('Error loading genres:', err);
        // Fallback to default genres
        setGenres([
          'Tous',
          'Action',
          'Comedy',
          'Drama',
          'Horror',
          'Science Fiction',
          'Thriller',
          'Crime',
          'Romance',
          'Adventure',
          'Fantasy'
        ]);
      }
    };
    loadGenres();
  }, []);

  return (
    <div className="genre-filter">
      <div className="genre-filter__label">Filtrer par genre :</div>
      <div className="genre-filter__options">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-filter__button ${selectedGenre === genre || (genre === 'Tous' && !selectedGenre) ? 'genre-filter__button--active' : ''}`}
            onClick={() => onGenreChange(genre === 'Tous' ? '' : genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

