# Setup Guide (Docker)

This is the recommended way to run the project, as it ensures **PHP 7.4** is used regardless of your local machine's PHP version.

## Prerequisites
-   **Docker**
-   **Docker Compose**

## Quick Start

1.  **Configure Environment**
    Copy `.env.example` to `.env` (if you haven't already).
    *I have already configured `.env` for Docker with default credentials.*

2.  **Start Containers**
    This will build the images and start PHP 7.4, Nginx, and MySQL.
    ```bash
    docker-compose up -d --build
    ```

3.  **Install Dependencies (via Docker)**
    Run composer inside the container:
    ```bash
    docker-compose exec app composer install
    ```

4.  **Setup Application**
    Generate key and run migrations:
    ```bash
    docker-compose exec app php artisan key:generate
    docker-compose exec app php artisan migrate
    ```

5.  **Access Application**
    The API is running at: `http://localhost:8000`

## Useful Commands

-   **Stop containers**: `docker-compose down`
-   **View logs**: `docker-compose logs -f`
-   **Run artisan command**: `docker-compose exec app php artisan [command]`
-   **Access shell**: `docker-compose exec app bash`
