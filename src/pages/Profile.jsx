import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserSubscriptions,
  unsubscribeFromEvent,
  updateReminder,
} from '../services/api';
import EventCard from '../components/EventCard/EventCard';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const subs = await getUserSubscriptions(user.id);
        setSubscriptions(subs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const handleUnsubscribe = useCallback(
    async (eventId) => {
      await unsubscribeFromEvent(user.id, eventId);
      setSubscriptions((prev) => prev.filter((s) => s.eventId !== eventId));
    },
    [user.id],
  );

  const handleReminderChange = useCallback(
    async (eventId, reminder) => {
      await updateReminder(user.id, eventId, reminder);
      setSubscriptions((prev) =>
        prev.map((s) => (s.eventId === eventId ? { ...s, reminder } : s)),
      );
    },
    [user.id],
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>👤 Mi Perfil</h1>
      <p className="profile-page__subtitle">
        Gestiona tu cuenta y suscripciones
      </p>

      <section className="profile-section card">
        <h2>📋 Información</h2>
        <dl className="profile-info">
          <dt>Nombre</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </dl>
      </section>

      <section className="profile-section">
        <h2>⭐ Eventos Suscritos ({subscriptions.length})</h2>

        {subscriptions.length === 0 ? (
          <div className="empty-state card">
            <h3>Sin suscripciones</h3>
            <p>Explora el calendario y suscríbete a los eventos que te interesen.</p>
          </div>
        ) : (
          <div className="profile-subscriptions">
            {subscriptions.map((sub) => (
              <EventCard
                key={sub.eventId}
                event={sub.event}
                subscribed
                reminder={sub.reminder}
                onUnsubscribe={handleUnsubscribe}
                onReminderChange={handleReminderChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
