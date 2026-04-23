import { EVENT_TYPES } from '../../services/api';
import './EventFilter.css';

export default function EventFilter({ selected, onChange }) {
  const types = Object.entries(EVENT_TYPES);

  const toggle = (key) => {
    if (selected.includes(key)) {
      onChange(selected.filter((s) => s !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="event-filter">
      <button
        className={`event-filter__chip ${selected.length === 0 ? 'event-filter__chip--active' : ''}`}
        onClick={() => onChange([])}
      >
        Todos
      </button>
      {types.map(([key, val]) => (
        <button
          key={key}
          className={`event-filter__chip ${selected.includes(key) ? 'event-filter__chip--active' : ''}`}
          onClick={() => toggle(key)}
          style={
            selected.includes(key)
              ? { borderColor: val.color, color: val.color, background: val.color + '18' }
              : {}
          }
        >
          {val.label}
        </button>
      ))}
    </div>
  );
}
