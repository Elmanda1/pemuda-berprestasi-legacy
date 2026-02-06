<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTipeKompetisiToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            // Adding tipe_kompetisi column, using string/enum logic
            // Assuming enum type support, or just string with default
            $table->enum('tipe_kompetisi', ['MASTER', 'TUNGGAL'])->default('TUNGGAL')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->dropColumn('tipe_kompetisi');
        });
    }
}
