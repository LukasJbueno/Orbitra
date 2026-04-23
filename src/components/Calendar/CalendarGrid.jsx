import { useMemo } from 'react';
import { EVENT_TYPES } from '../../services/api';
import './Calendar.css';

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function CalendarGrid({ year, month, events, onEventClick }) {
  const today = new Date();

  const { days, blanks } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday = 0
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const blanks = Array.from({ length: startDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return { days, blanks };
  }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const d = new Date(ev.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    return map;
  }, [events, year, month]);

  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {MONTH_NAMES[month]} {year}
      </h2>
      <div className="calendar-grid">
        {DAY_NAMES.map((d) => (
          <div key={d} className="calendar-grid__header">{d}</div>
        ))}

        {blanks.map((i) => (
          <div key={`b-${i}`} className="calendar-grid__day calendar-grid__day--empty" />
        ))}

        {days.map((day) => {
          const dayEvents = eventsByDay[day] || [];
          return (
            <div
              key={day}
              className={`calendar-grid__day ${isToday(day) ? 'calendar-grid__day--today' : ''}`}
            >
              <div className="calendar-grid__day-number">{day}</div>
              {dayEvents.map((ev) => {
                const color = EVENT_TYPES[ev.type]?.color || '#888';
                return (
                  <div
                    key={ev.id}
                    className="calendar-grid__event-name"
                    style={{ backgroundColor: color + '25', color }}
                    onClick={() => onEventClick?.(ev)}
                    title={ev.name}
                  >
                    {ev.name}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { MONTH_NAMES };
