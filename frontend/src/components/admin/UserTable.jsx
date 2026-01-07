import { useState } from 'react';
import './UserTable.css';

export const UserTable = ({
  users,
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

  const sortedUsers = [...users].sort((a, b) => {
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

  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'user-table__badge--admin' : 'user-table__badge--user';
  };

  if (loading) {
    return (
      <div className="user-table__loading">
        <p>Chargement...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-table__empty">
        <p>Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th 
              className="user-table__th user-table__th--sortable" 
              onClick={() => handleSort('id')}
            >
              ID {getSortIcon('id')}
            </th>
            <th 
              className="user-table__th user-table__th--sortable" 
              onClick={() => handleSort('name')}
            >
              Nom {getSortIcon('name')}
            </th>
            <th 
              className="user-table__th user-table__th--sortable" 
              onClick={() => handleSort('email')}
            >
              Email {getSortIcon('email')}
            </th>
            <th 
              className="user-table__th user-table__th--sortable" 
              onClick={() => handleSort('role')}
            >
              Rôle {getSortIcon('role')}
            </th>
            <th 
              className="user-table__th user-table__th--sortable" 
              onClick={() => handleSort('createdAt')}
            >
              Date de création {getSortIcon('createdAt')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id} className="user-table__row">
              <td className="user-table__td">{user.id}</td>
              <td className="user-table__td user-table__td--name">
                {user.name || 'Sans nom'}
              </td>
              <td className="user-table__td user-table__td--email">
                {user.email}
              </td>
              <td className="user-table__td">
                <span className={`user-table__badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="user-table__td">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

