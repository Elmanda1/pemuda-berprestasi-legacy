<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsAndMatchesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. tb_atlet
        Schema::create('tb_atlet', function (Blueprint $table) {
            $table->integer('id_atlet')->autoIncrement();
            $table->string('nama_atlet', 150);
            $table->dateTime('tanggal_lahir', 3);
            $table->double('berat_badan');
            $table->double('tinggi_badan');
            $table->enum('jenis_kelamin', ['LAKI_LAKI', 'PEREMPUAN']);
            $table->integer('id_dojang');
            $table->integer('id_pelatih_pembuat');
            $table->string('akte_kelahiran', 255)->nullable();
            $table->string('pas_foto', 255)->nullable();
            $table->string('sertifikat_belt', 255)->nullable();
            $table->string('ktp', 255)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('provinsi', 100);
            $table->integer('umur')->nullable();
            $table->string('alamat', 191)->nullable();
            $table->string('belt', 191);
            $table->string('nik', 191);
            $table->string('no_telp', 191)->nullable();

            $table->foreign('id_dojang')->references('id_dojang')->on('tb_dojang')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_pelatih_pembuat')->references('id_pelatih')->on('tb_pelatih')->onUpdate('cascade');
        });

        // 2. tb_peserta_kompetisi
        Schema::create('tb_peserta_kompetisi', function (Blueprint $table) {
            $table->integer('id_peserta_kompetisi')->autoIncrement();
            $table->integer('id_atlet')->nullable();
            $table->integer('id_kelas_kejuaraan');
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');
            $table->tinyInteger('is_team')->default(0);
            $table->double('penimbangan1')->nullable();
            $table->double('penimbangan2')->nullable();

            $table->foreign('id_atlet')->references('id_atlet')->on('tb_atlet')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_kelas_kejuaraan')->references('id_kelas_kejuaraan')->on('tb_kelas_kejuaraan')->onUpdate('cascade');
        });

        // 3. tb_peserta_tim
        Schema::create('tb_peserta_tim', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('id_peserta_kompetisi');
            $table->integer('id_atlet');

            $table->unique(['id_peserta_kompetisi', 'id_atlet'], 'tb_peserta_tim_id_peserta_kompetisi_id_atlet_key');
            $table->foreign('id_peserta_kompetisi')->references('id_peserta_kompetisi')->on('tb_peserta_kompetisi')->onUpdate('cascade');
            $table->foreign('id_atlet')->references('id_atlet')->on('tb_atlet')->onUpdate('cascade');
        });

        // 4. tb_drawing_seed
        Schema::create('tb_drawing_seed', function (Blueprint $table) {
            $table->integer('id_seed')->autoIncrement();
            $table->integer('id_bagan');
            $table->integer('id_peserta_kompetisi');
            $table->integer('seed_num');

            $table->foreign('id_bagan')->references('id_bagan')->on('tb_bagan')->onUpdate('cascade');
            $table->foreign('id_peserta_kompetisi')->references('id_peserta_kompetisi')->on('tb_peserta_kompetisi')->onUpdate('cascade');
        });

        // 5. tb_match
        Schema::create('tb_match', function (Blueprint $table) {
            $table->integer('id_match')->autoIncrement();
            $table->integer('id_bagan');
            $table->integer('ronde');
            $table->integer('position')->nullable();
            $table->string('stage_name', 191)->nullable();
            $table->integer('id_peserta_a')->nullable();
            $table->integer('id_peserta_b')->nullable();
            $table->integer('skor_a')->default(0);
            $table->integer('skor_b')->default(0);
            $table->integer('id_venue')->nullable();
            $table->dateTime('tanggal_pertandingan', 3)->nullable();
            $table->integer('nomor_antrian')->nullable();
            $table->string('nomor_lapangan', 10)->nullable();
            $table->string('nomor_partai', 50)->nullable();
            $table->integer('hari')->nullable();
            $table->integer('id_lapangan')->nullable();

            $table->foreign('id_bagan')->references('id_bagan')->on('tb_bagan')->onUpdate('cascade');
            $table->foreign('id_peserta_a')->references('id_peserta_kompetisi')->on('tb_peserta_kompetisi')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_peserta_b')->references('id_peserta_kompetisi')->on('tb_peserta_kompetisi')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_venue')->references('id_venue')->on('tb_venue')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_lapangan')->references('id_lapangan')->on('tb_lapangan')->onDelete('set null')->onUpdate('cascade');
        });

        // 6. tb_jadwal_pertandingan
        Schema::create('tb_jadwal_pertandingan', function (Blueprint $table) {
            $table->integer('id_jadwal')->autoIncrement();
            $table->integer('id_lapangan');
            $table->integer('id_bagan');
            $table->integer('antrean')->nullable();
            $table->dateTime('waktu_mulai', 3)->nullable();
            $table->dateTime('waktu_selesai', 3)->nullable();

            $table->foreign('id_lapangan')->references('id_lapangan')->on('tb_lapangan')->onUpdate('cascade');
            $table->foreign('id_bagan')->references('id_bagan')->on('tb_bagan')->onUpdate('cascade');
        });

        // 7. tb_lapangan_kelas
        Schema::create('tb_lapangan_kelas', function (Blueprint $table) {
            $table->integer('id_lapangan_kelas')->autoIncrement();
            $table->integer('id_lapangan');
            $table->integer('id_kelas_kejuaraan');
            $table->integer('urutan')->nullable();

            $table->unique(['id_lapangan', 'id_kelas_kejuaraan'], 'tb_lapangan_kelas_id_lapangan_id_kelas_kejuaraan_key');
            $table->foreign('id_lapangan')->references('id_lapangan')->on('tb_lapangan')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_kelas_kejuaraan')->references('id_kelas_kejuaraan')->on('tb_kelas_kejuaraan')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_lapangan_kelas');
        Schema::dropIfExists('tb_jadwal_pertandingan');
        Schema::dropIfExists('tb_match');
        Schema::dropIfExists('tb_drawing_seed');
        Schema::dropIfExists('tb_peserta_tim');
        Schema::dropIfExists('tb_peserta_kompetisi');
        Schema::dropIfExists('tb_atlet');
    }
}
