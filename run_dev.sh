#!/bin/bash
echo "🛑 Stopping existing containers..."
docker stop pemuda-app pemuda-db pemuda-pma 2>/dev/null
docker rm pemuda-app pemuda-db pemuda-pma 2>/dev/null
docker network create pemuda-net 2>/dev/null

echo "🗄️ Starting Database (Port 3307)..."
docker run -d --name pemuda-db --network pemuda-net -p 3307:3306 \
  -e MYSQL_DATABASE=pemuda_mvp \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:5.7

echo "🗃️ Starting phpMyAdmin (Port 8080)..."
docker run -d --name pemuda-pma --network pemuda-net -p 8080:80 \
  -e PMA_HOST=pemuda-db \
  phpmyadmin/phpmyadmin

echo "🏗️ Building App..."
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

echo "⏳ Waiting for DB..."
sleep 15

echo "🔄 Running Migrations..."
docker exec pemuda-app php artisan migrate --force

echo "📥 Importing Data..."
docker exec -i pemuda-db mysql -u root -proot pemuda_mvp < pemuda-db.sql

echo "✅ Done! App running at http://localhost:8000"
