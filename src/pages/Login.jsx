import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/calendar');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page stars-bg">
      <form className="auth-form card" onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta de Orbitra</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            required
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Entrar'}
        </button>

        <div className="auth-form__footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>

        <div className="auth-form__footer" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          Demo: demo@orbitra.com / demo1234
        </div>
      </form>
    </div>
  );
}
