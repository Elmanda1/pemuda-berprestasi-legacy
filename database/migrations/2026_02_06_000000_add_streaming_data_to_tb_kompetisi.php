<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStreamingDataToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     * 
     * Adds streaming_data JSON column to support multi-stream feature.
     * Stores YouTube/streaming URLs with titles for live broadcast display.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->json('streaming_data')->nullable()->after('faq_data');
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
            $table->dropColumn('streaming_data');
        });
    }
}
