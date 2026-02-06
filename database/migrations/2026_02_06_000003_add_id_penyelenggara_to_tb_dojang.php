<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddIdPenyelenggaraToTbDojang extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_dojang', function (Blueprint $table) {
            $table->integer('id_penyelenggara')->nullable()->after('nama_dojang');
            $table->foreign('id_penyelenggara')->references('id_penyelenggara')->on('tb_penyelenggara')->onUpdate('cascade')->onDelete('set null');
        });

        // Link existing dojangs to the first penyelenggara if any
        $firstPenyelenggara = DB::table('tb_penyelenggara')->first();
        if ($firstPenyelenggara) {
            DB::table('tb_dojang')->whereNull('id_penyelenggara')->update(['id_penyelenggara' => $firstPenyelenggara->id_penyelenggara]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_dojang', function (Blueprint $table) {
            $table->dropForeign(['id_penyelenggara']);
            $table->dropColumn('id_penyelenggara');
        });
    }
}
