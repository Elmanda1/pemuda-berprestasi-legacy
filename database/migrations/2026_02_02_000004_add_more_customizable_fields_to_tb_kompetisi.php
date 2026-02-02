<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddMoreCustomizableFieldsToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->string('event_year')->nullable();
            $table->string('about_director_slogan')->nullable();
            $table->text('registration_description')->nullable();
            $table->json('registration_steps')->nullable();
        });

        // Seed with current hardcoded defaults
        DB::table('tb_kompetisi')->update([
            'event_year' => '2025',
            'about_director_slogan' => '“SALAM TAEKWONDO INDONESIA PROVINSI SUMATERA SELATAN”',
            'registration_description' => 'Ikuti langkah-langkah berikut untuk mendaftar sebagai peserta Sriwijaya Competition 2025 dengan mudah dan efisien.',
            'registration_steps' => json_encode([
                [
                    'number' => 1,
                    'title' => 'Buat Akun',
                    'desc' => 'Daftar di website resmi kejuaraan dengan mengisi informasi pribadi dan data tim secara lengkap.',
                ],
                [
                    'number' => 2,
                    'title' => 'Login dan Pilih Kategori',
                    'desc' => 'Masuk menggunakan akun yang sudah terdaftar lalu pilih kategori lomba sesuai kelompok usia dan kemampuan.',
                ],
                [
                    'number' => 3,
                    'title' => 'Unggah Dokumen',
                    'desc' => 'Upload dokumen yang dibutuhkan seperti kartu identitas, foto, dan bukti pembayaran.',
                ],
                [
                    'number' => 4,
                    'title' => 'Konfirmasi & Selesai',
                    'desc' => 'Periksa kembali data yang telah diisi, lalu konfirmasi pendaftaran untuk mendapatkan nomor peserta.',
                ],
            ]),
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->dropColumn(['event_year', 'about_director_slogan', 'registration_description', 'registration_steps']);
        });
    }
}
