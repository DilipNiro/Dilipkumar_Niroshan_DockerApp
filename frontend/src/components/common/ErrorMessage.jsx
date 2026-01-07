import './ErrorMessage.css';

export const ErrorMessage = ({ message, onClose, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{message}</p>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="btn btn-secondary btn-sm">
            Réessayer
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="btn-close" aria-label="Fermer">
            ×
          </button>
        )}
      </div>
    </div>
  );
};
