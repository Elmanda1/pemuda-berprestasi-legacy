<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoreUsersTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. tb_akun
        Schema::create('tb_akun', function (Blueprint $table) {
            $table->integer('id_akun')->autoIncrement();
            $table->string('role', 50);
            $table->string('email', 255)->unique(); // Assuming unique from standard practice, though explicit key check might differ. 
            $table->string('password_hash', 255);
            // No timestamps in SQL dump for tb_akun
        });

        // 2. tb_dojang
        Schema::create('tb_dojang', function (Blueprint $table) {
            $table->integer('id_dojang')->autoIncrement();
            $table->string('nama_dojang', 150);
            $table->string('email', 255)->nullable();
            $table->string('no_telp', 15)->nullable();
            $table->string('founder', 150)->nullable();
            $table->string('negara', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kelurahan', 100)->nullable();
            $table->string('alamat', 200)->nullable();
            $table->timestamp('created_at', 3)->useCurrent();
            $table->timestamp('updated_at', 3)->nullable();
            $table->string('logo', 255)->nullable();
        });

        // 3. tb_penyelenggara
        Schema::create('tb_penyelenggara', function (Blueprint $table) {
            $table->integer('id_penyelenggara')->autoIncrement();
            $table->string('nama_penyelenggara', 150);
            $table->string('email', 255)->nullable();
            $table->string('no_telp', 15)->nullable();
        });

        // 4. tb_admin
        Schema::create('tb_admin', function (Blueprint $table) {
            $table->integer('id_admin')->autoIncrement();
            $table->string('nama', 150);
            $table->integer('id_akun');

            // Constraints
            $table->foreign('id_akun')->references('id_akun')->on('tb_akun')->onUpdate('cascade');
        });

        // 5. tb_pelatih
        Schema::create('tb_pelatih', function (Blueprint $table) {
            $table->integer('id_pelatih')->autoIncrement();
            $table->string('nama_pelatih', 150);
            $table->string('no_telp', 15)->nullable();
            $table->string('foto_ktp', 255)->nullable();
            $table->string('sertifikat_sabuk', 255)->nullable();
            $table->integer('id_akun')->unique();
            $table->integer('id_dojang');
            $table->enum('jenis_kelamin', ['LAKI_LAKI', 'PEREMPUAN'])->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('nik', 16)->unique();
            $table->string('provinsi', 100)->nullable();
            $table->dateTime('tanggal_lahir', 3)->nullable();
            $table->string('alamat', 100)->nullable();

            // Constraints
            $table->foreign('id_akun')->references('id_akun')->on('tb_akun')->onUpdate('cascade');
            $table->foreign('id_dojang')->references('id_dojang')->on('tb_dojang')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_pelatih');
        Schema::dropIfExists('tb_admin');
        Schema::dropIfExists('tb_penyelenggara');
        Schema::dropIfExists('tb_dojang');
        Schema::dropIfExists('tb_akun');
    }
}
