# Panduan Docker (Untuk Pemula)

Docker adalah alat untuk memastikan aplikasi berjalan di "Komputer Kecil" (Container) yang lingkungannya sudah disetting pas (PHP 7.4, MySQL 5.7, dll).
Jadi Anda tidak perlu install PHP/MySQL di laptop Anda, cukup install Docker saja.

## 1. Cara Menjalankan Aplikasi
Karena di komputer Anda perintah `docker-compose` belum ada, saya buatkan script shortcut.

1.  Buka terminal di folder `pemuda-app`.
2.  Jalankan script start:
    ```bash
    bash docker-start.sh
    ```
    *Script ini akan mematikan docker lama yang error, lalu menyalakan yang baru dengan settingan yang benar.*

3.  Tunggu sebentar, lalu buka browser: http://localhost:8000

## 2. Cara Menjalankan Perintah (Artisan/Composer)
Kalau pakai Docker, Anda tidak bisa ketik `php artisan` langsung di terminal biasa. Anda harus "masuk" ke dockernya dulu.

**Cara Cepat:**
Gunakan script `d` (shortcut) yang saya buatkan:

*   **Jalanin Artisan:**
    ```bash
    ./d artisan migrate
    ./d artisan key:generate
    ```
    *(Mirip `php artisan ...` cuma ganti depannya jadi `./d`)*

*   **Jalanin Composer:**
    ```bash
    ./d composer install
    ```

*   **Masuk ke Terminal Docker:**
    ```bash
    ./d shell
    ```

## 3. Mematikan Aplikasi
Jika sudah selesai coding:
```bash
bash docker-stop.sh
```

---
**PENTING UNTUK WINDOWS USER:**
Jika teman Anda pakai Windows, script `.sh` ini mungkin tidak jalan langsung (kecuali pakai Git Bash).
Di Windows, biasanya `docker-compose` sudah otomatis terinstall saat install Docker Desktop, jadi mereka cukup ketik: `docker-compose up`.
