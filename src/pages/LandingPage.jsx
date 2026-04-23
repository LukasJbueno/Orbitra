import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const FEATURES = [
  {
    icon: '🔭',
    title: 'Eventos Astronómicos',
    description: 'Eclipses, lluvias de meteoros, fases lunares y más, organizados por año.',
  },
  {
    icon: '🔔',
    title: 'Recordatorios',
    description: 'Recibe alertas por email antes de cada evento que te interese.',
  },
  {
    icon: '📅',
    title: 'Calendario Interactivo',
    description: 'Vista por mes o lista, con filtros por tipo de evento.',
  },
  {
    icon: '👤',
    title: 'Tu Cuenta Personal',
    description: 'Suscríbete a eventos, gestiona tus preferencias y más.',
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing stars-bg">
      <section className="landing__hero">
        <div className="landing__icon">🌌</div>
        <h1 className="landing__title">
          Bienvenido a <span>Orbitra</span>
        </h1>
        <p className="landing__subtitle">
          Tu calendario astronómico personal. Explora los eventos más
          fascinantes del universo y nunca te pierdas un fenómeno celeste.
        </p>
        <div className="landing__actions">
          <Link to="/calendar" className="btn btn--primary">
            🔭 Explorar Calendario
          </Link>
          {!user && (
            <>
              <Link to="/register" className="btn btn--outline">
                Crear Cuenta
              </Link>
              <Link to="/login" className="btn btn--outline">
                Iniciar Sesión
              </Link>
            </>
          )}
          {user && (
            <Link to="/profile" className="btn btn--outline">
              Mi Perfil
            </Link>
          )}
        </div>
      </section>

      <section className="landing__features">
        <h2>¿Qué ofrece Orbitra?</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
