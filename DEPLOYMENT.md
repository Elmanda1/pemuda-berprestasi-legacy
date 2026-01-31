# Panduan Deployment Otomatis (GitHub Actions)

Saya telah menambahkan workflow otomatis di `.github/workflows/deploy.yml`. 
Sekarang, setiap kali Anda push ke branch `production`, GitHub akan otomatis mengupload file ke hosting Anda.

## Prasyarat (Wajib Dilakukan Sekali)

Agar GitHub bisa login ke hosting Anda, Anda perlu menambahkan "Secrets" di repository GitHub ini.

1. Buka Repository ini di GitHub.
2. Masuk ke **Settings** > **Secrets and variables** > **Actions**.
3. Klik tombol **New repository secret**.
4. Tambahkan 3 secret berikut:

| Name | Value (Isi dengan data hosting Anda) |
| :--- | :--- |
| `FTP_SERVER` | Alamat IP atau domain FTP (contoh: `ftp.namadomain.com` atau IP server) |
| `FTP_USERNAME` | Username FTP / CPanel Anda |
| `FTP_PASSWORD` | Password FTP / CPanel Anda |

## Cara Kerja
1. Anda edit code di lokal.
2. Commit dan Push ke branch `production`.
3. GitHub akan menjalankan:
   - `composer install` (untuk install library PHP).
   - Upload folder `pemuda-app` ke `/pemuda-app` di hosting.
   - Upload folder `public_html` ke `/public_html` di hosting.

## Troubleshooting
Jika deploy gagal, buka tab **Actions** di GitHub untuk melihat error log-nya.
