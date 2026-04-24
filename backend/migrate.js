/**
 * Script de migración: crea la base de datos y la tabla de usuarios.
 * Ejecutar con: node migrate.js
 */
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function migrate() {
  // Conexión inicial sin base de datos para poder crearla si no existe
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  const dbName = process.env.DB_NAME;

  console.log(`→ Creando base de datos '${dbName}' si no existe...`);
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await conn.query(`USE \`${dbName}\`;`);

  console.log('→ Creando tabla users...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(100)  NOT NULL,
      email         VARCHAR(255)  NOT NULL UNIQUE,
      password_hash VARCHAR(255)  NOT NULL,
      created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✓ Migración completada correctamente.');
  await conn.end();
}

migrate().catch((err) => {
  console.error('✗ Error en la migración:', err.message);
  process.exit(1);
});
