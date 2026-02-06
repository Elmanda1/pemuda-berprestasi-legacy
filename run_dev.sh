#!/bin/bash
# Exit on error
set -e

# =================================================================
# PEMUDA BERPRESTASI - Development Environment Script
# =================================================================
# Script ini menggunakan Docker VOLUME untuk menyimpan data database
# secara PERMANEN. Data tidak akan hilang saat container di-restart.
# 
# SQL import dari pemuda-db.sql HANYA dilakukan saat pertama kali
# (database kosong). Setelah itu, data akan tetap ada.
# =================================================================

VOLUME_NAME="pemuda-dev-dbdata"
NETWORK_NAME="pemuda-net"

echo "🛑 Stopping existing containers (data TETAP tersimpan di volume)..."
docker stop pemuda-app pemuda-db pemuda-pma 2>/dev/null || true
docker rm pemuda-app pemuda-db pemuda-pma 2>/dev/null || true
docker network create $NETWORK_NAME 2>/dev/null || true

# Buat volume jika belum ada
if ! docker volume inspect $VOLUME_NAME &>/dev/null; then
    echo "📦 Creating persistent volume for database data..."
    docker volume create $VOLUME_NAME
    FIRST_RUN=true
else
    echo "✅ Using existing database volume (data preserved!)"
    FIRST_RUN=false
fi

echo "🗄️ Starting Database (Port 3307) with PERSISTENT storage..."
docker run -d --name pemuda-db --network $NETWORK_NAME -p 3307:3306 \
  -e MYSQL_DATABASE=pemuda_mvp \
  -e MYSQL_ROOT_PASSWORD=root \
  -v $VOLUME_NAME:/var/lib/mysql \
  mysql:5.7

echo "🗃️ Starting phpMyAdmin (Port 8080)..."
docker run -d --name pemuda-pma --network $NETWORK_NAME -p 8080:80 \
  -e PMA_HOST=pemuda-db \
  phpmyadmin/phpmyadmin

echo "🏗️ Building App Image..."
docker build -t pemuda-local .

echo "🚀 Starting App (Port 8000)..."
docker run -d --name pemuda-app --network $NETWORK_NAME -p 8000:8000 \
  -v "$(pwd)":/var/www \
  -e DB_CONNECTION=mysql \
  -e DB_HOST=pemuda-db \
  -e DB_PORT=3306 \
  -e DB_DATABASE=pemuda_mvp \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=root \
  -e PHP_CLI_SERVER_WORKERS=8 \
  pemuda-local php artisan serve --host=0.0.0.0 --port=8000

echo "⏳ Waiting for Database to be ready..."
MAX_RETRIES=30
COUNT=0
until docker exec pemuda-db mysqladmin ping -u root -proot --silent; do
    ((COUNT++))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database wait timeout!"
        exit 1
    fi
    echo "   (Attempt $COUNT/$MAX_RETRIES) Database is still starting up..."
    sleep 2
done
echo "Ready!"

# Cek apakah database sudah ada datanya (cek baris di tb_akun)
ROW_COUNT=$(docker exec pemuda-db mysql -u root -proot -N -e "SELECT COUNT(*) FROM tb_akun;" 2>/dev/null || echo "0")

if [ "$ROW_COUNT" = "0" ] || [ "$FIRST_RUN" = "true" ]; then
    echo "🔄 First run detected - Initializing Application Data..."
    
    echo "📥 Importing Data from SQL Dump (pemuda-db.sql)..."
    # Tunggu MySQL benar-benar siap menerima query
    sleep 3
    docker exec -i pemuda-db mysql -u root -proot pemuda_mvp -e "SET FOREIGN_KEY_CHECKS=0;"
    docker exec -i pemuda-db mysql -u root -proot pemuda_mvp < pemuda-db.sql || echo "⚠️ Warning: SQL import finished with some notes."
    docker exec -i pemuda-db mysql -u root -proot pemuda_mvp -e "SET FOREIGN_KEY_CHECKS=1;"
    
    echo "🛠️ Running Migrations..."
    docker exec pemuda-app php artisan migrate --force
    
    echo "🌱 Running Seeders (Users & Access Normalization)..."
    docker exec pemuda-app composer dump-autoload --quiet
    docker exec pemuda-app php artisan db:seed --class=UserSeeder --force
    docker exec pemuda-app php artisan db:seed --class=CustomRolesSeeder --force
    docker exec pemuda-db mysql -u root -proot pemuda_mvp -e "UPDATE tb_akun SET role = UPPER(role);"
else
    echo "📊 Database already contains data ($TABLE_COUNT tables) - Skipping import!"
    echo "🛠️ Running pending Migrations only..."
    docker exec pemuda-app php artisan migrate --force
fi

echo "✨ Optimization..."
docker exec pemuda-app php artisan cache:clear

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Done! App running at http://localhost:8000"
echo "   Admin Login: adminkompetisi@example.com / sa12345"
echo ""
echo "📌 CATATAN DOCKER:"
echo "   • Data database tersimpan di volume: $VOLUME_NAME"
echo "   • Data akan TETAP ADA meskipun container di-restart"
echo "   • Untuk RESET database dari awal, jalankan:"
echo "     docker volume rm $VOLUME_NAME"
echo "═══════════════════════════════════════════════════════════════"
