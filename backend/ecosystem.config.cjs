// Configuración de PM2 para el backend de Orbitra
module.exports = {
  apps: [
    {
      name: 'orbitra-backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
