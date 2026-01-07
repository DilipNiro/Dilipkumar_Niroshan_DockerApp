import './WatchlistFilters.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'WATCHLIST', label: 'À voir' },
  { value: 'WATCHING', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' }
];

export const WatchlistFilters = ({ 
  selectedStatus, 
  onStatusChange,
  searchTerm,
  onSearchChange 
}) => {
  return (
    <div className="watchlist-filters">
      <div className="watchlist-filters__search">
        <input
          type="text"
          className="watchlist-filters__search-input"
          placeholder="Rechercher dans ma watchlist..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="watchlist-filters__status">
        <label className="watchlist-filters__label">Filtrer par statut :</label>
        <div className="watchlist-filters__status-options">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`watchlist-filters__status-button ${selectedStatus === option.value ? 'watchlist-filters__status-button--active' : ''}`}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

