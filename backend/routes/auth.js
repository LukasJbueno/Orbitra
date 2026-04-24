import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();
const SALT_ROUNDS = 12;

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica de entrada
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'El formato del correo no es válido.' });
  }

  try {
    // Verificar si el correo ya existe
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña y guardar el usuario
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() };

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const dbUser = rows[0];
    const passwordMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

export default router;
