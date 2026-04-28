#!/bin/bash
# =============================================================
#  Script de configuración para EC2 (Amazon Linux 2023)
#  Despliega frontend + backend en un solo proceso Node.js
#  Ejecutar como: bash setup-ec2.sh
# =============================================================
set -e

echo "=== 1. Actualizando paquetes del sistema ==="
sudo dnf update -y

echo "=== 2. Instalando Node.js 20 LTS ==="
sudo dnf install -y nodejs npm

echo "=== 3. Instalando PM2 globalmente ==="
sudo npm install -g pm2

echo "=== 4. Creando directorio de la app ==="
mkdir -p ~/orbitra
cd ~/orbitra

echo "=== 5. Archivos esperados en ~/orbitra/ ==="
echo "     Copia el proyecto completo con:"
echo "     scp -i tu-clave.pem -r ./* ec2-user@<EC2_IP>:~/orbitra/"
echo "     (incluyendo dist/ ya compilado y backend/)"

echo "=== 6. Instalando dependencias del backend ==="
cd ~/orbitra/backend
npm install --omit=dev

echo "=== 7. Iniciando con PM2 ==="
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup | tail -1 | sudo bash

echo ""
echo "✓ App completa en http://<EC2_IP>:3001"
echo "✓ Logs: pm2 logs orbitra-backend"
