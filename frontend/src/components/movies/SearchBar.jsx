import { useState } from 'react';
import './SearchBar.css';

export const SearchBar = ({ onSearch, placeholder = 'Rechercher un film...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <span className="search-bar__icon">🔍</span>
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

