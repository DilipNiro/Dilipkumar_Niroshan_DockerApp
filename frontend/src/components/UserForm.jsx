import { useState, useEffect } from 'react';

export default function UserForm({ onSubmit, editingUser, onCancel }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingUser) {
      setEmail(editingUser.email);
      setName(editingUser.name || '');
    } else {
      setEmail('');
      setName('');
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Email is required');
      return;
    }
    onSubmit({ email: email.trim(), name: name.trim() });
  };

  return (
    <section className="form-section">
      <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
