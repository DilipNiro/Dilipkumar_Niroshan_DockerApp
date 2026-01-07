export default function UserList({ users, onEdit, onDelete, loading, error }) {
  if (loading) {
    return (
      <section className="users-section">
        <h2>Users List</h2>
        <div className="loading">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="users-section">
        <h2>Users List</h2>
        <div className="error">{error}</div>
      </section>
    );
  }

  if (users.length === 0) {
    return (
      <section className="users-section">
        <h2>Users List</h2>
        <div className="empty-state">
          <p>No users yet. Add your first user using the form above!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="users-section">
      <h2>Users List</h2>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name || 'No name'}</h3>
              <p>{user.email}</p>
              <p className="user-meta">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="user-actions">
              <button className="btn btn-edit" onClick={() => onEdit(user)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => onDelete(user.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
