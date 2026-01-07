import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
