import { useState, useEffect } from 'react';
import { genreService } from '../../services/genreService.js';
import './MovieForm.css';

export const MovieForm = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    image: '',
    genres: [],
    duration: 120,
    director: '',
    rating: 0
  });
  const [availableGenres, setAvailableGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await genreService.getAll();
        setAvailableGenres(genres);
      } catch (err) {
        console.error('Error loading genres:', err);
        // Fallback to default genres if API fails
        setAvailableGenres([
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
          { id: 3, name: 'Drama' },
          { id: 4, name: 'Horror' },
          { id: 5, name: 'Science Fiction' },
          { id: 6, name: 'Thriller' },
          { id: 7, name: 'Crime' },
          { id: 8, name: 'Romance' },
          { id: 9, name: 'Adventure' },
          { id: 10, name: 'Fantasy' }
        ]);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    if (movie) {
      // Extract genre names from movie.genres array
      const genreNames = movie.genres 
        ? movie.genres.map(mg => mg.genre?.name || mg.genre || mg).filter(Boolean)
        : movie.genre 
          ? [movie.genre] 
          : [];
      
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        year: movie.year || new Date().getFullYear(),
        image: movie.image || '',
        genres: genreNames,
        duration: movie.duration || 120,
        director: movie.director || '',
        rating: movie.rating || 0
      });
    }
  }, [movie]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.genres || formData.genres.length === 0) {
      newErrors.genres = 'Au moins un genre est requis';
    }

    if (!formData.director.trim()) {
      newErrors.director = 'Le réalisateur est requis';
    }

    if (formData.year < 1800 || formData.year > new Date().getFullYear() + 5) {
      newErrors.year = 'Année invalide';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'La durée doit être positive';
    }

    if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'La note doit être entre 0 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'duration' || name === 'rating' 
        ? (value === '' ? '' : Number(value))
        : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGenreToggle = (genreName) => {
    setFormData(prev => {
      const currentGenres = prev.genres || [];
      const isSelected = currentGenres.includes(genreName);
      const newGenres = isSelected
        ? currentGenres.filter(g => g !== genreName)
        : [...currentGenres, genreName];
      
      return {
        ...prev,
        genres: newGenres
      };
    });
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="movie-form__row">
        <div className="movie-form__field">
          <label className="movie-form__label">
            Titre <span className="movie-form__required">*</span>
          </label>
          <input
            type="text"
            name="title"
            className={`movie-form__input ${errors.title ? 'movie-form__input--error' : ''}`}
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors.title && <span className="movie-form__error">{errors.title}</span>}
        </div>

        <div className="movie-form__field">
          <label className="movie-form__label">
            Année <span className="movie-form__required">*</span>
          </label>
          <input
            type="number"
            name="year"
            className={`movie-form__input ${errors.year ? 'movie-form__input--error' : ''}`}
            value={formData.year}
            onChange={handleChange}
            min="1800"
            max={new Date().getFullYear() + 5}
            required
          />
          {errors.year && <span className="movie-form__error">{errors.year}</span>}
        </div>
      </div>

      <div className="movie-form__field">
        <label className="movie-form__label">
          Genres <span className="movie-form__required">*</span>
        </label>
        <div className={`movie-form__genres ${errors.genres ? 'movie-form__genres--error' : ''}`}>
          {availableGenres.map(genre => {
            const genreName = typeof genre === 'string' ? genre : genre.name;
            const isSelected = formData.genres.includes(genreName);
            return (
              <label key={genreName} className="movie-form__genre-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGenreToggle(genreName)}
                />
                <span className="movie-form__genre-label">{genreName}</span>
              </label>
            );
          })}
        </div>
        {errors.genres && <span className="movie-form__error">{errors.genres}</span>}
      </div>

      <div className="movie-form__row">

        <div className="movie-form__field">
          <label className="movie-form__label">
            Réalisateur <span className="movie-form__required">*</span>
          </label>
          <input
            type="text"
            name="director"
            className={`movie-form__input ${errors.director ? 'movie-form__input--error' : ''}`}
            value={formData.director}
            onChange={handleChange}
            required
          />
          {errors.director && <span className="movie-form__error">{errors.director}</span>}
        </div>
      </div>

      <div className="movie-form__row">
        <div className="movie-form__field">
          <label className="movie-form__label">
            Durée (minutes)
          </label>
          <input
            type="number"
            name="duration"
            className={`movie-form__input ${errors.duration ? 'movie-form__input--error' : ''}`}
            value={formData.duration}
            onChange={handleChange}
            min="1"
          />
          {errors.duration && <span className="movie-form__error">{errors.duration}</span>}
        </div>

        <div className="movie-form__field">
          <label className="movie-form__label">
            Note (0-10)
          </label>
          <input
            type="number"
            name="rating"
            step="0.1"
            className={`movie-form__input ${errors.rating ? 'movie-form__input--error' : ''}`}
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
          />
          {errors.rating && <span className="movie-form__error">{errors.rating}</span>}
        </div>
      </div>

      <div className="movie-form__field">
        <label className="movie-form__label">
          URL de l'image
        </label>
        <input
          type="url"
          name="image"
          className="movie-form__input"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="movie-form__field">
        <label className="movie-form__label">
          Description <span className="movie-form__required">*</span>
        </label>
        <textarea
          name="description"
          className={`movie-form__input movie-form__textarea ${errors.description ? 'movie-form__input--error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          rows="5"
          required
        />
        {errors.description && <span className="movie-form__error">{errors.description}</span>}
      </div>

      <div className="movie-form__actions">
        {onCancel && (
          <button
            type="button"
            className="movie-form__button movie-form__button--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="movie-form__button movie-form__button--submit"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : movie ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

