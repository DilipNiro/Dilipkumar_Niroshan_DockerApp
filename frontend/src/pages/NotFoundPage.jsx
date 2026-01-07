import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <h2>Page non trouvée</h2>
      <p style={{ color: '#666', margin: '16px 0 32px' }}>
        La page que vous cherchez n'existe pas.
      </p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
};
