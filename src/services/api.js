const MOCK_EVENTS = [
  {
    id: 1,
    name: 'Eclipse Solar Total',
    date: '2026-08-12T17:45:00',
    description: 'Eclipse solar total visible desde el norte de España y partes de África.',
    type: 'eclipse',
  },
  {
    id: 2,
    name: 'Lluvia de Meteoros Perseidas',
    date: '2026-08-12T02:00:00',
    description: 'Pico de actividad de las Perseidas, hasta 100 meteoros por hora.',
    type: 'meteor-shower',
  },
  {
    id: 3,
    name: 'Luna Llena de Lobo',
    date: '2026-01-03T22:03:00',
    description: 'Primera luna llena del año, tradicionalmente llamada Luna de Lobo.',
    type: 'lunar-phase',
  },
  {
    id: 4,
    name: 'Conjunción Júpiter-Saturno',
    date: '2026-02-16T06:30:00',
    description: 'Júpiter y Saturno se alinean en el cielo nocturno.',
    type: 'conjunction',
  },
  {
    id: 5,
    name: 'Equinoccio de Primavera',
    date: '2026-03-20T14:46:00',
    description: 'Inicio astronómico de la primavera en el hemisferio norte.',
    type: 'equinox-solstice',
  },
  {
    id: 6,
    name: 'Eclipse Lunar Parcial',
    date: '2026-03-03T11:33:00',
    description: 'Eclipse parcial de luna visible desde América y Europa.',
    type: 'eclipse',
  },
  {
    id: 7,
    name: 'Lluvia de Meteoros Líridas',
    date: '2026-04-22T04:00:00',
    description: 'Lluvia de meteoros de las Líridas con hasta 20 meteoros por hora.',
    type: 'meteor-shower',
  },
  {
    id: 8,
    name: 'Superluna',
    date: '2026-05-26T11:14:00',
    description: 'Luna llena en su punto más cercano a la Tierra (perigeo).',
    type: 'lunar-phase',
  },
  {
    id: 9,
    name: 'Solsticio de Verano',
    date: '2026-06-21T04:24:00',
    description: 'Día más largo del año en el hemisferio norte.',
    type: 'equinox-solstice',
  },
  {
    id: 10,
    name: 'Oposición de Saturno',
    date: '2026-07-18T08:00:00',
    description: 'Saturno se encuentra más cerca de la Tierra y es visible toda la noche.',
    type: 'conjunction',
  },
  {
    id: 11,
    name: 'Lluvia de Meteoros Gemínidas',
    date: '2026-12-14T02:00:00',
    description: 'Una de las lluvias de meteoros más intensas del año, hasta 120 meteoros/hora.',
    type: 'meteor-shower',
  },
  {
    id: 12,
    name: 'Solsticio de Invierno',
    date: '2026-12-21T20:50:00',
    description: 'Noche más larga del año en el hemisferio norte.',
    type: 'equinox-solstice',
  },
  {
    id: 13,
    name: 'Luna Nueva',
    date: '2026-04-17T11:52:00',
    description: 'Luna nueva: momento ideal para observar estrellas y objetos de cielo profundo.',
    type: 'lunar-phase',
  },
  {
    id: 14,
    name: 'Oposición de Marte',
    date: '2026-11-19T12:00:00',
    description: 'Marte alcanza su máximo brillo y cercanía a la Tierra.',
    type: 'conjunction',
  },
  {
    id: 15,
    name: 'Equinoccio de Otoño',
    date: '2026-09-22T22:05:00',
    description: 'Inicio astronómico del otoño en el hemisferio norte.',
    type: 'equinox-solstice',
  },
  {
    id: 16,
    name: 'Lluvia de Meteoros Oriónidas',
    date: '2026-10-21T04:00:00',
    description: 'Lluvia de meteoros asociada al cometa Halley, ~20 meteoros/hora.',
    type: 'meteor-shower',
  },
];

// En desarrollo Vite proxy redirige '/api' → localhost:3001
// En producción se usa VITE_API_URL apuntando a la EC2
const API_BASE = import.meta.env.VITE_API_URL || '/api';

let subscriptions = [];

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en la petición');
  return data;
}

export async function getEvents() {
  await delay();
  return [...MOCK_EVENTS];
}

export async function getEventById(id) {
  await delay();
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) throw new Error('Evento no encontrado');
  return { ...event };
}

export async function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function subscribeToEvent(userId, eventId, reminder = null) {
  await delay();
  const existing = subscriptions.find(
    (s) => s.userId === userId && s.eventId === eventId,
  );
  if (existing) {
    existing.reminder = reminder;
    return { ...existing };
  }
  const sub = { userId, eventId, reminder, subscribedAt: new Date().toISOString() };
  subscriptions.push(sub);
  return { ...sub };
}

export async function unsubscribeFromEvent(userId, eventId) {
  await delay();
  subscriptions = subscriptions.filter(
    (s) => !(s.userId === userId && s.eventId === eventId),
  );
  return { success: true };
}

export async function getUserSubscriptions(userId) {
  await delay();
  const userSubs = subscriptions.filter((s) => s.userId === userId);
  return userSubs.map((s) => {
    const event = MOCK_EVENTS.find((e) => e.id === s.eventId);
    return { ...s, event };
  });
}

export async function updateReminder(userId, eventId, reminder) {
  await delay();
  const sub = subscriptions.find(
    (s) => s.userId === userId && s.eventId === eventId,
  );
  if (!sub) throw new Error('Suscripción no encontrada');
  sub.reminder = reminder;
  return { ...sub };
}

export const EVENT_TYPES = {
  eclipse: { label: 'Eclipse', color: '#e74c3c' },
  'meteor-shower': { label: 'Lluvia de Meteoros', color: '#3498db' },
  'lunar-phase': { label: 'Fase Lunar', color: '#f1c40f' },
  conjunction: { label: 'Conjunción', color: '#9b59b6' },
  'equinox-solstice': { label: 'Equinoccio/Solsticio', color: '#2ecc71' },
};
