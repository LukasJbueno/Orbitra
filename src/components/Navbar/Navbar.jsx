import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        🌌 <span>Orbitra</span>
      </Link>

      <div className="navbar__links">
        <NavLink to="/calendar">Calendario</NavLink>
        {!user && <NavLink to="/login">Iniciar Sesión</NavLink>}
        {!user && <NavLink to="/register">Crear Cuenta</NavLink>}
        {user && <NavLink to="/profile">Mi Perfil</NavLink>}
      </div>

      {user && (
        <div className="navbar__user">
          <span>{user.name}</span>
          <button className="btn btn--small btn--outline" onClick={logout}>
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}
