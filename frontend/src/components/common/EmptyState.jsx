import './EmptyState.css';

export const EmptyState = ({ 
  icon = '📭', 
  title = 'Aucun élément', 
  message = 'Il n\'y a rien à afficher pour le moment.',
  action = null 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
};

