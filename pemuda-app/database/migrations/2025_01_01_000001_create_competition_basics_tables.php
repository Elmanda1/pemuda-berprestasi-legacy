<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompetitionBasicsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. tb_kompetisi
        Schema::create('tb_kompetisi', function (Blueprint $table) {
            $table->integer('id_kompetisi')->autoIncrement();
            $table->integer('id_penyelenggara');
            $table->dateTime('tanggal_mulai', 3);
            $table->dateTime('tanggal_selesai', 3);
            $table->string('nama_event', 255);
            $table->string('lokasi', 255);
            $table->enum('status', ['PENDAFTARAN', 'SEDANG_DIMULAI', 'SELESAI']);
            $table->timestamp('created_at', 3)->useCurrent();
            $table->text('deskripsi')->nullable();
            $table->string('poster_image', 255)->nullable();
            $table->timestamp('updated_at', 3)->useCurrent();
            $table->string('website_url', 500)->nullable();

            $table->foreign('id_penyelenggara')->references('id_penyelenggara')->on('tb_penyelenggara')->onUpdate('cascade');
        });

        // 2. tb_admin_kompetisi
        Schema::create('tb_admin_kompetisi', function (Blueprint $table) {
            $table->integer('id_admin_kompetisi')->autoIncrement();
            $table->integer('id_kompetisi');
            $table->string('nama', 191);
            $table->integer('id_akun');

            $table->foreign('id_akun')->references('id_akun')->on('tb_akun')->onUpdate('cascade');
            $table->foreign('id_kompetisi')->references('id_kompetisi')->on('tb_kompetisi')->onUpdate('cascade');
        });

        // 3. tb_venue
        Schema::create('tb_venue', function (Blueprint $table) {
            $table->integer('id_venue')->autoIncrement();
            $table->integer('id_kompetisi');
            $table->string('nama_venue', 150);
            $table->string('lokasi', 255)->nullable();

            $table->foreign('id_kompetisi')->references('id_kompetisi')->on('tb_kompetisi')->onUpdate('cascade');
        });

        // 4. tb_lapangan
        Schema::create('tb_lapangan', function (Blueprint $table) {
            $table->integer('id_lapangan')->autoIncrement();
            $table->integer('id_kompetisi');
            $table->string('nama_lapangan', 100);
            $table->dateTime('tanggal', 3);

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
        Schema::dropIfExists('tb_lapangan');
        Schema::dropIfExists('tb_venue');
        Schema::dropIfExists('tb_admin_kompetisi');
        Schema::dropIfExists('tb_kompetisi');
    }
}
