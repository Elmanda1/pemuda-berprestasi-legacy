# Pemuda Berprestasi - Backend API (Laravel 7)

This project is a migration of the `pemuda-berprestasi` Node.js/Express backend to PHP 7.4 and Laravel 7.

## Requirements
- PHP 7.4
- MySQL 5.7+ / MariaDB
- Composer

## Installation

1.  **Clone & Install Dependencies**
    ```bash
    git clone ...
    cd "Pemuda BerprestasiNew"
    composer install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and configure your database:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    
    Update `.env`:
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

3.  **Migrations**
    Run migrations to set up the database schema:
    ```bash
    php artisan migrate
    ```

## Project Structure

### Services
-   **BracketService (`app/Services/BracketService.php`)**: Handles tournament bracket generation, including:
    -   Power of 2 calculation
    -   BYE distribution (Interleaved Top/Bottom for mirrored brackets)
    -   Dojang Separation (Splitting same-dojang members into Left/Right pools)
    -   Stage naming (Final, Semi Final, Quarter Final, etc.)

### Controllers
| Controller | Description | Status |
| :--- | :--- | :--- |
| `AuthController` | Login, Logout, Me | ✅ Implemented |
| `PelatihController` | Profile management | ✅ Implemented |
| `DojangController` | Dojang management | ✅ Implemented |
| `AtletController` | Athlete CRUD & Stats | ✅ Implemented |
| `KompetisiController` | Event CRUD, Registration, Brackets | ✅ Implemented (Core) |
| `PertandinganController` | Match Info & Schedule | ✅ Implemented |
| `CertificateController` | Certificate Generation | ✅ Implemented |
| `KelasController` | Reference Data (Age, Weight, Poomsae) | ✅ Implemented |
| `BuktiTransferController` | Upload & List Proofs | ✅ Implemented |
| `LapanganController` | Venue & Field management | ⚠️ Basic / Placeholder |

### Routes
All API routes are defined in `routes/api.php` and are prefixed with `/api/v1`.

## Development Notes
-   **Authentication**: Uses custom `api_token` column in `tb_users`.
-   **File Storage**: Uploads are stored in `public/uploads` (for legacy compatibility).
-   **Validation**: Uses Laravel's `Validator` facade.

## Pending / To Do
-   **Complex Numbering**: `LapanganController@autoGenerateMatchNumbers` needs complex logic porting from `lapanganService.ts`.
-   **Audit Logs**: `auditLog` features are currently placeholders.
