import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──────────────────────────────────────────────────────
// Permite peticiones desde el bucket S3 y desde localhost en dev
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // Permite sin origin (curl, Postman) y los orígenes configurados
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido → ${origin}`));
  },
}));

app.use(express.json());

// ── Rutas API ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Arranque ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Orbitra API corriendo en http://localhost:${PORT}`);
});
