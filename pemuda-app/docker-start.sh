#!/bin/bash

# Warna
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== DOCKER STARTUP SCRIPT (Pemuda Berprestasi) ===${NC}"

# 1. Stop & Remove Old Containers (termasuk yang error path)
echo "1. Membersihkan container lama..."
docker stop pemuda-web pemuda-app pemuda-db 2>/dev/null
docker rm pemuda-web pemuda-app pemuda-db 2>/dev/null

# 2. Network Setup
echo "2. Menyiapkan Network..."
docker network create app-network 2>/dev/null

# 3. Database
echo "3. Menyalakan Database (MySQL 5.7)..."
docker run -d \
  --name pemuda-db \
  --network app-network \
  -e MYSQL_DATABASE=pemuda_db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_USER=pemuda \
  -v dbdata:/var/lib/mysql \
  mysql:5.7

# 4. App (PHP 7.4)
echo "4. Menyalakan Aplikasi Backend (PHP 7.4)..."
# Build dulu kalau belum ada image
docker build -t pemuda-app .

docker run -d \
  --name pemuda-app \
  --network app-network \
  -v "$(pwd)":/var/www \
  pemuda-app

# 5. Web Server (Nginx)
echo "5. Menyalakan Web Server (Nginx)..."
docker run -d \
  --name pemuda-web \
  --network app-network \
  -p 8000:80 \
  -v "$(pwd)":/var/www \
  -v "$(pwd)/docker/nginx/conf.d/":/etc/nginx/conf.d/ \
  nginx:alpine

echo -e "${GREEN}=== SELESAI! ===${NC}"
echo "Website jalan di: http://localhost:8000"
echo "Database Host: pemuda-db"
echo "Username: pemuda | Password: secret"
echo ""
echo "Gunakan script './d' untuk menjalankan perintah artisan."
