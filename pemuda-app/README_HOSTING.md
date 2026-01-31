# Panduan Migrasi Shared Hosting (CPanel)

Dokumen ini berisi langkah-langkah untuk mendeploy aplikasi **Pemuda Berprestasi** ke Shared Hosting.

## 1. Persiapan Database
- Saya sudah mengekstraksi database terakhir ke file: `pemuda_mvp_export.sql` (di root folder project).
- **Langkah di CPanel:**
  1. Masuk ke **MySQL Databases**.
  2. Buat database baru (misal: `u12345_pemuda`).
  3. Buat user database baru dan hubungkan ke database tersebut dengan hak akses penuh (ALL PRIVILEGES).
  4. Masuk ke **phpMyAdmin**, pilih database baru tersebut, dan klik **Import**. Pilih file `pemuda_mvp_export.sql`.

## 2. Struktur Folder Hosting
Struktur folder di hosting disarankan seperti ini:
```bash
/home/username/
├── pemuda-app/        # Letakkan semua file Laravel DI SINI (kecuali folder public)
└── public_html/       # Isi folder /public Laravel dipindahkan ke sini
```

### Langkah Upload:
1. Kompres semua folder project (kecuali `node_modules`, `docker`, `.git`).
2. Upload ke root hosting (di atas `public_html`), lalu extract ke folder `pemuda-app`.
3. Pindahkan **isi** dari folder `pemuda-app/public/*` ke dalam folder `public_html/`.

## 3. Konfigurasi `.env`
Edit file `.env` di dalam folder `pemuda-app/` dan sesuaikan:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://nama-domain-anda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=u12345_pemuda
DB_USERNAME=u12345_user
DB_PASSWORD=password_anda_yang_baru
```

## 4. Menghubungkan Folder Public
Karena folder `public` sekarang berada di `public_html`, kita perlu mengarahkan Laravel:
1. Edit file `public_html/index.php`.
2. Cari baris ini dan sesuaikan path-nya:
```php
require __DIR__.'/../pemuda-app/vendor/autoload.php';
$app = require_once __DIR__.'/../pemuda-app/bootstrap/app.php';
```

## 5. Storage Symlink
Di Shared Hosting biasanya tidak bisa `php artisan storage:link`. Gunakan script PHP ini (buat file `link.php` di `public_html`):
```php
<?php
symlink('/home/username/pemuda-app/storage/app/public', '/home/username/public_html/storage');
echo "Symlink created!";
?>
```
Lalu panggil `domain.com/link.php` dari browser.

---
**Catatan Penting:**
- Pastikan versi PHP di hosting minimal **7.4**.
- Jika muncul error 500, cek log di `storage/logs/laravel.log`.
