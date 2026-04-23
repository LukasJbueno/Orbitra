import { useState } from 'react';
import { EVENT_TYPES } from '../../services/api';
import './EventCard.css';

const REMINDER_OPTIONS = [
  { value: '', label: 'Sin recordatorio' },
  { value: '1h', label: '1 hora antes' },
  { value: '1d', label: '1 día antes' },
  { value: '3d', label: '3 días antes' },
  { value: '1w', label: '1 semana antes' },
];

export default function EventCard({
  event,
  subscribed,
  reminder,
  onSubscribe,
  onUnsubscribe,
  onReminderChange,
  showActions = true,
}) {
  const [localReminder, setLocalReminder] = useState(reminder || '');
  const typeInfo = EVENT_TYPES[event.type] || { label: event.type, color: '#888' };

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleReminderChange = (e) => {
    const val = e.target.value;
    setLocalReminder(val);
    onReminderChange?.(event.id, val || null);
  };

  return (
    <div className="event-card">
      <div
        className="event-card__color-bar"
        style={{ backgroundColor: typeInfo.color }}
      />
      <div className="event-card__body">
        <div className="event-card__header">
          <span className="event-card__name">{event.name}</span>
          <span
            className="badge"
            style={{ backgroundColor: typeInfo.color + '22', color: typeInfo.color }}
          >
            {typeInfo.label}
          </span>
        </div>
        <div className="event-card__date">
          📅 {formattedDate} · 🕐 {formattedTime}
        </div>
        <p className="event-card__description">{event.description}</p>

        {showActions && (
          <div className="event-card__actions">
            {!subscribed ? (
              <button
                className="btn btn--primary btn--small"
                onClick={() => onSubscribe?.(event.id)}
              >
                ⭐ Suscribirse
              </button>
            ) : (
              <>
                <button
                  className="btn btn--danger btn--small"
                  onClick={() => onUnsubscribe?.(event.id)}
                >
                  Desuscribirse
                </button>
                <div className="event-card__reminder">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={!!localReminder}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setLocalReminder('');
                          onReminderChange?.(event.id, null);
                        } else {
                          setLocalReminder('1d');
                          onReminderChange?.(event.id, '1d');
                        }
                      }}
                    />
                    <span className="toggle-slider" />
                  </label>
                  {localReminder && (
                    <select value={localReminder} onChange={handleReminderChange}>
                      {REMINDER_OPTIONS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
