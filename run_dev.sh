#!/bin/bash
# Exit on error
set -e

echo "🛑 Stopping and cleaning up existing containers..."
docker stop pemuda-app pemuda-db pemuda-pma 2>/dev/null || true
docker rm pemuda-app pemuda-db pemuda-pma 2>/dev/null || true
docker network create pemuda-net 2>/dev/null || true

echo "🗄️ Starting Database (Port 3307)..."
docker run -d --name pemuda-db --network pemuda-net -p 3307:3306 \
  -e MYSQL_DATABASE=pemuda_mvp \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:5.7

echo "🗃️ Starting phpMyAdmin (Port 8080)..."
docker run -d --name pemuda-pma --network pemuda-net -p 8080:80 \
  -e PMA_HOST=pemuda-db \
  phpmyadmin/phpmyadmin

echo "🏗️ Building App Image..."
docker build -t pemuda-local .

echo "🚀 Starting App (Port 8000)..."
docker run -d --name pemuda-app --network pemuda-net -p 8000:8000 \
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
# Better readiness check
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

echo "🔄 Initializing Application Data..."

echo "📥 Importing Data from SQL Dump (@[pemuda-db.sql])..."
docker exec -i pemuda-db mysql -u root -proot pemuda_mvp -e "SET FOREIGN_KEY_CHECKS=0;"
docker exec -i pemuda-db mysql -u root -proot pemuda_mvp < pemuda-db.sql || echo "⚠️ Warning: SQL import finished with some notes."
docker exec -i pemuda-db mysql -u root -proot pemuda_mvp -e "SET FOREIGN_KEY_CHECKS=1;"

echo "🛠️ Running Missing Migrations..."
docker exec pemuda-app php artisan migrate --force

echo "🌱 Running Seeders (Users & Access Normalization)..."
docker exec pemuda-app composer dump-autoload --quiet
docker exec pemuda-app php artisan db:seed --class=UserSeeder --force
docker exec pemuda-db mysql -u root -proot pemuda_mvp -e "UPDATE tb_akun SET role = UPPER(role);"

echo "✨ Optimization..."
docker exec pemuda-app php artisan cache:clear

echo "✅ Done! App running at http://localhost:8000"
echo "   Admin Login: adminkompetisi@example.com / sa12345"
