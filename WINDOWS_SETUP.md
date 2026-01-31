# Panduan Setup Development (Windows)

Dokumen ini berisi cara menjalankan project ini di komputer Windows Anda.
Ada 2 cara, silakan pilih salah satu:
1.  **Cara Mudah (Tanpa Docker)**: Menggunakan XAMPP atau Laragon.
2.  **Cara Canggih (Docker)**: Menggunakan Docker Desktop (Lingkungan sama persis dengan server).

---

## Opsi 1: Cara Mudah (XAMPP / Laragon)

Cocok jika Anda sudah terbiasa dengan XAMPP.

### 1. Persiapan Tools
Pastikan di komputer Anda sudah terinstall:
-   **PHP 7.4** atau **PHP 8.0**
-   **Composer** (Download di [getcomposer.org](https://getcomposer.org))
-   **Node.js LTS** (Download di [nodejs.org](https://nodejs.org))
-   **MySQL** (Bawaan XAMPP)

### 2. Setup Project
1.  Buka terminal (Powershell / Git Bash), masuk ke folder project.
2.  Masuk ke sub-folder aplikasi:
    ```bash
    cd pemuda-app
    ```
3.  Install library PHP:
    ```bash
    composer install
    ```
4.  Copy file settingan:
    ```bash
    cp .env.example .env
    ```
5.  Edit file `.env` (buka dengan Notepad/VSCode), sesuaikan database:
    ```ini
    DB_DATABASE=nama_database_anda
    DB_USERNAME=root
    DB_PASSWORD=
    ```
6.  Generate Key aplikasi:
    ```bash
    php artisan key:generate
    ```
7.  Setting Database:
    Buat database baru di phpMyAdmin sesuai `DB_DATABASE` di atas, lalu jalankan:
    ```bash
    php artisan migrate
    ```

### 3. Menjalankan Aplikasi
Anda butuh **2 Terminal** yang jalan bersamaan:

**Terminal 1 (Server PHP):**
```bash
cd pemuda-app
php artisan serve
```
*Aplikasi akan jalan di http://127.0.0.1:8000*

**Terminal 2 (Frontend Assets):**
```bash
cd pemuda-app
npm install
npm run watch
```
*Ini berguna agar CSS/JS otomatis terupdate saat Anda edit code.*

---

## Opsi 2: Menggunakan Docker (Rekomendasi)

Jika Anda ingin lingkungan yang lebih rapi tanpa install PHP/MySQL di Windows.

1.  Pastikan **Docker Desktop** sudah jalan.
2.  Masuk ke folder aplikasi:
    ```bash
    cd pemuda-app
    ```
3.  Copy file env:
    ```bash
    cp .env.example .env
    ```
4.  Jalankan container:
    ```bash
    docker-compose up -d --build
    ```
5.  Jalankan perintah awal (hanya sekali):
    ```bash
    # Install Composer dependencies
    docker-compose exec app composer install

    # Generate Key
    docker-compose exec app php artisan key:generate

    # Migrate Database
    docker-compose exec app php artisan migrate
    ```
6.  Akses web di `http://localhost:8000`

---

## FAQ

**Q: Saya pakai Supabase, apakah perlu setting DB lokal?**
A: Boleh! Cukup ganti isi `.env` di bagian `DB_HOST`, `DB_PORT`, dll dengan kredensial Supabase Anda. Itu hanya berpengaruh di laptop Anda, tidak akan merusak server production.

**Q: Perintah `npm run watch` error "package.json not found"?**
A: Pastikan Anda menjalankan perintah itu DI DALAM folder `pemuda-app`, bukan di folder luar.
