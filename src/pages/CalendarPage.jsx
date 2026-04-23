import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getEvents,
  subscribeToEvent,
  unsubscribeFromEvent,
  getUserSubscriptions,
  updateReminder,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import EventCard from '../components/EventCard/EventCard';
import EventFilter from '../components/EventFilter/EventFilter';
import './CalendarPage.css';

export default function CalendarPage() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calendar'); // 'calendar' | 'list'
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(new Date().getMonth());
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const evts = await getEvents();
        setEvents(evts);
        if (user) {
          const subs = await getUserSubscriptions(user.id);
          setSubscriptions(subs);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (filters.length > 0) {
      filtered = filtered.filter((e) => filters.includes(e.type));
    }
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, filters]);

  const yearEvents = useMemo(
    () => filteredEvents.filter((e) => new Date(e.date).getFullYear() === year),
    [filteredEvents, year],
  );

  const monthEvents = useMemo(
    () => yearEvents.filter((e) => new Date(e.date).getMonth() === month),
    [yearEvents, month],
  );

  const subMap = useMemo(() => {
    const m = {};
    subscriptions.forEach((s) => {
      m[s.eventId] = s;
    });
    return m;
  }, [subscriptions]);

  const handleSubscribe = useCallback(
    async (eventId) => {
      if (!user) return;
      const sub = await subscribeToEvent(user.id, eventId);
      const event = events.find((e) => e.id === eventId);
      setSubscriptions((prev) => [...prev, { ...sub, event }]);
    },
    [user, events],
  );

  const handleUnsubscribe = useCallback(
    async (eventId) => {
      if (!user) return;
      await unsubscribeFromEvent(user.id, eventId);
      setSubscriptions((prev) => prev.filter((s) => s.eventId !== eventId));
    },
    [user],
  );

  const handleReminderChange = useCallback(
    async (eventId, reminder) => {
      if (!user) return;
      await updateReminder(user.id, eventId, reminder);
      setSubscriptions((prev) =>
        prev.map((s) => (s.eventId === eventId ? { ...s, reminder } : s)),
      );
    },
    [user],
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const displayEvents = view === 'calendar' ? monthEvents : yearEvents;

  return (
    <div className="calendar-page">
      <h1>🔭 Calendario Astronómico</h1>

      <EventFilter selected={filters} onChange={setFilters} />

      {/* Controls */}
      <div className="calendar-controls">
        <div className="calendar-controls__nav">
          <button className="btn btn--small btn--outline" onClick={() => {
            if (view === 'calendar') {
              if (month === 0) { setMonth(11); setYear((y) => y - 1); }
              else setMonth((m) => m - 1);
            } else {
              setYear((y) => y - 1);
            }
          }}>
            ◀
          </button>
          <h2>
            {view === 'calendar'
              ? `${['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][month]} ${year}`
              : year}
          </h2>
          <button className="btn btn--small btn--outline" onClick={() => {
            if (view === 'calendar') {
              if (month === 11) { setMonth(0); setYear((y) => y + 1); }
              else setMonth((m) => m + 1);
            } else {
              setYear((y) => y + 1);
            }
          }}>
            ▶
          </button>
        </div>

        <div className="calendar-controls__view">
          <button
            className={view === 'calendar' ? 'active' : ''}
            onClick={() => setView('calendar')}
          >
            📅 Calendario
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            📋 Lista
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <CalendarGrid
          year={year}
          month={month}
          events={filteredEvents}
        />
      )}

      {/* Event list */}
      {displayEvents.length === 0 ? (
        <div className="empty-state">
          <h3>No hay eventos</h3>
          <p>No se encontraron eventos astronómicos para este período.</p>
        </div>
      ) : (
        <div className="event-list">
          {displayEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              subscribed={!!subMap[ev.id]}
              reminder={subMap[ev.id]?.reminder}
              onSubscribe={user ? handleSubscribe : undefined}
              onUnsubscribe={user ? handleUnsubscribe : undefined}
              onReminderChange={user ? handleReminderChange : undefined}
              showActions={!!user}
            />
          ))}
        </div>
      )}

      {!user && (
        <div className="empty-state" style={{ paddingTop: '1rem' }}>
          <p>Inicia sesión para suscribirte a eventos y activar recordatorios.</p>
        </div>
      )}
    </div>
  );
}
