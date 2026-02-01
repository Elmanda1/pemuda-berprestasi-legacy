# Pemuda Berprestasi New

Panduan singkat menjalankan project ini di local environment (Linux).

## 🛠 Prerequisites
Pastikan sudah terinstall:
- **Docker** & **Docker Compose**
- **Node.js** & **NPM**

## 🚀 Cara Menjalankan (Quick Start)

### 1. Setup Backend & Database
Gunakan script wrapper `d` untuk menjalankan Docker container.

```bash
# 1. Jalankan Container (App + Database)
./d up
```
*Tunggu beberapa saat sampai server berjalan.*

### 2. Setup Dependencies & Database (Hanya saat pertama kali)
Jika baru pertama kali clone atau reset:

```bash
# Install PHP Dependencies
./d composer install

# Generate App Key (jika error 500/key missing)
./d artisan key:generate

# Migrasi Database & Seed Data
./d artisan migrate:fresh --seed
```

### 3. Setup Frontend
Buka terminal baru (tab baru) untuk menjalankan frontend assets.

```bash
# Install JS Dependencies
npm install

# Compile & Watch Assets (Auto-update saat edit file)
npm run watch
```

---

## ℹ️ Akses Aplikasi
- **Web**: [http://localhost:8000](http://localhost:8000)
- **Database Host**: `pemuda-db` (untuk config .env)
- **Database Port**: `3306`
- **Username/Pass**: `root` / `root`

## ⌨️ Cheat Sheet Command `./d`
Script `./d` menggantikan command docker yang panjang.

| Command | Fungsi | Ekuivalen |
| :--- | :--- | :--- |
| `./d up` | Nyalakan server | `docker run ...` |
| `./d artisan [cmd]` | Jalankan artisan | `php artisan [cmd]` |
| `./d composer [cmd]` | Jalankan composer | `composer [cmd]` |
| `./d rebuild` | Rebuild image docker | `docker build ...` |

### Contoh Penggunaan:
```bash
# Buat controller baru
./d artisan make:controller TestController

# Install paket composer baru
./d composer require laravel/ui
```
