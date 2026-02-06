<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class RefactorAdminTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Rename tb_admin to tb_admin_penyelenggara
        if (Schema::hasTable('tb_admin')) {
            DB::statement('ALTER TABLE tb_admin RENAME TO tb_admin_penyelenggara');
            DB::statement('ALTER TABLE tb_admin_penyelenggara CHANGE id_admin id_admin_penyelenggara INT NOT NULL AUTO_INCREMENT');

            Schema::table('tb_admin_penyelenggara', function (Blueprint $table) {
                // Add id_penyelenggara for the new role structure
                $table->integer('id_penyelenggara')->nullable()->after('id_akun');
                $table->foreign('id_penyelenggara')->references('id_penyelenggara')->on('tb_penyelenggara')->onUpdate('cascade')->onDelete('set null');
            });
        }

        // 2. Create tb_super_admin
        Schema::create('tb_super_admin', function (Blueprint $table) {
            $table->integer('id_super_admin')->autoIncrement();
            $table->integer('id_akun');
            $table->string('nama', 150);

            $table->foreign('id_akun')->references('id_akun')->on('tb_akun')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_super_admin');

        if (Schema::hasTable('tb_admin_penyelenggara')) {
            Schema::table('tb_admin_penyelenggara', function (Blueprint $table) {
                $table->dropForeign(['id_penyelenggara']);
                $table->dropColumn('id_penyelenggara');
            });

            DB::statement('ALTER TABLE tb_admin_penyelenggara CHANGE id_admin_penyelenggara id_admin INT NOT NULL AUTO_INCREMENT');
            DB::statement('ALTER TABLE tb_admin_penyelenggara RENAME TO tb_admin');
        }
    }
}
