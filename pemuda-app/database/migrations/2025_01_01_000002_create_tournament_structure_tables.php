<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTournamentStructureTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. tb_kategori_event
        Schema::create('tb_kategori_event', function (Blueprint $table) {
            $table->integer('id_kategori_event')->autoIncrement();
            $table->string('nama_kategori', 150);
        });

        // 2. tb_kelompok_usia
        Schema::create('tb_kelompok_usia', function (Blueprint $table) {
            $table->integer('id_kelompok')->autoIncrement();
            $table->string('nama_kelompok', 100);
            $table->integer('usia_min');
            $table->integer('usia_max');
        });

        // 3. tb_kelas_berat
        Schema::create('tb_kelas_berat', function (Blueprint $table) {
            $table->integer('id_kelas_berat')->autoIncrement();
            $table->integer('id_kelompok');
            $table->double('batas_min');
            $table->double('batas_max');
            $table->string('nama_kelas', 100);
            $table->enum('jenis_kelamin', ['LAKI_LAKI', 'PEREMPUAN']);

            $table->foreign('id_kelompok')->references('id_kelompok')->on('tb_kelompok_usia')->onUpdate('cascade');
        });

        // 4. tb_kelas_poomsae
        Schema::create('tb_kelas_poomsae', function (Blueprint $table) {
            $table->integer('id_poomsae')->autoIncrement();
            $table->integer('id_kelompok');
            $table->string('nama_kelas', 50);
            $table->enum('jenis_kelamin', ['LAKI_LAKI', 'PEREMPUAN'])->nullable();

            $table->unique(['id_kelompok', 'nama_kelas', 'jenis_kelamin'], 'tb_kelas_poomsae_id_kelompok_nama_kelas_jenis_kelamin_key');
            $table->foreign('id_kelompok')->references('id_kelompok')->on('tb_kelompok_usia')->onUpdate('cascade');
        });

        // 5. tb_kelas_kejuaraan
        Schema::create('tb_kelas_kejuaraan', function (Blueprint $table) {
            $table->integer('id_kelas_kejuaraan')->autoIncrement();
            $table->integer('id_kategori_event');
            $table->integer('id_kelompok')->nullable();
            $table->integer('id_kelas_berat')->nullable();
            $table->integer('id_poomsae')->nullable();
            $table->integer('id_kompetisi');
            $table->enum('cabang', ['POOMSAE', 'KYORUGI']);
            $table->string('poomsae_type', 50)->nullable();
            $table->enum('jenis_kelamin', ['LAKI_LAKI', 'PEREMPUAN'])->nullable();
            $table->enum('bracket_status', ['not_created', 'created', 'in_progress', 'completed'])->default('not_created');

            $table->foreign('id_kategori_event')->references('id_kategori_event')->on('tb_kategori_event')->onUpdate('cascade');
            $table->foreign('id_kelas_berat')->references('id_kelas_berat')->on('tb_kelas_berat')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_kelompok')->references('id_kelompok')->on('tb_kelompok_usia')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('id_kompetisi')->references('id_kompetisi')->on('tb_kompetisi')->onUpdate('cascade');
            $table->foreign('id_poomsae')->references('id_poomsae')->on('tb_kelas_poomsae')->onDelete('set null')->onUpdate('cascade');
        });

        // 6. tb_bagan
        Schema::create('tb_bagan', function (Blueprint $table) {
            $table->integer('id_bagan')->autoIncrement();
            $table->integer('id_kompetisi');
            $table->integer('id_kelas_kejuaraan');

            $table->foreign('id_kelas_kejuaraan')->references('id_kelas_kejuaraan')->on('tb_kelas_kejuaraan')->onUpdate('cascade');
            $table->foreign('id_kompetisi')->references('id_kompetisi')->on('tb_kompetisi')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_bagan');
        Schema::dropIfExists('tb_kelas_kejuaraan');
        Schema::dropIfExists('tb_kelas_poomsae');
        Schema::dropIfExists('tb_kelas_berat');
        Schema::dropIfExists('tb_kelompok_usia');
        Schema::dropIfExists('tb_kategori_event');
    }
}
