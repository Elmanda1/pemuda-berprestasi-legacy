<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. bukti_transfer
        Schema::create('bukti_transfer', function (Blueprint $table) {
            $table->integer('id_bukti_transfer')->autoIncrement();
            $table->integer('id_dojang');
            $table->integer('id_pelatih');
            $table->string('bukti_transfer_path', 255);
            $table->timestamp('created_at', 3)->useCurrent();

            $table->foreign('id_dojang')->references('id_dojang')->on('tb_dojang')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_pelatih')->references('id_pelatih')->on('tb_pelatih')->onDelete('cascade')->onUpdate('cascade');
        });

        // 2. tb_certificate
        Schema::create('tb_certificate', function (Blueprint $table) {
            $table->integer('id_certificate')->autoIncrement();
            $table->string('certificate_number', 10)->unique();
            $table->integer('id_atlet');
            $table->integer('id_peserta_kompetisi');
            $table->integer('id_kompetisi');
            $table->string('medal_status', 20)->comment('GOLD, SILVER, BRONZE, PARTICIPANT');
            $table->timestamp('generated_at', 3)->useCurrent();

            $table->foreign('id_atlet')->references('id_atlet')->on('tb_atlet')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_peserta_kompetisi')->references('id_peserta_kompetisi')->on('tb_peserta_kompetisi')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_kompetisi')->references('id_kompetisi')->on('tb_kompetisi')->onDelete('cascade')->onUpdate('cascade');
        });

        // 3. tb_antrian
        Schema::create('tb_antrian', function (Blueprint $table) {
            $table->integer('id_antrian')->autoIncrement();
            $table->integer('id_lapangan');
            $table->integer('bertanding');
            $table->integer('persiapan');
            $table->integer('pemanasan');

            $table->foreign('id_lapangan')->references('id_lapangan')->on('tb_lapangan')->onDelete('cascade')->onUpdate('cascade');
        });

        // 4. tb_match_audit
        Schema::create('tb_match_audit', function (Blueprint $table) {
            $table->integer('id_audit')->autoIncrement();
            $table->integer('id_match');
            $table->integer('id_user');
            $table->string('aksi', 100);
            $table->longText('payload')->nullable(); // Check constraint json_valid ignored in standard Laravel schema, handled by app logic or DB raw
            $table->timestamp('created_at', 3)->useCurrent();

            $table->foreign('id_match')->references('id_match')->on('tb_match')->onUpdate('cascade');
        });

        // 5. tb_audit_log
        Schema::create('tb_audit_log', function (Blueprint $table) {
            $table->integer('id_log')->autoIncrement();
            $table->integer('id_user');
            $table->string('tabel', 100);
            $table->string('aksi', 100);
            $table->longText('data_lama')->nullable();
            $table->longText('data_baru')->nullable();
            $table->timestamp('created_at', 3)->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_audit_log');
        Schema::dropIfExists('tb_match_audit');
        Schema::dropIfExists('tb_antrian');
        Schema::dropIfExists('tb_certificate');
        Schema::dropIfExists('bukti_transfer');
    }
}
