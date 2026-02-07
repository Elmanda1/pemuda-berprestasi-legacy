<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLandingCustomizationToTbPenyelenggara extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_penyelenggara', function (Blueprint $table) {
            $table->string('landing_title', 255)->nullable();
            $table->text('landing_subtitle')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_penyelenggara', function (Blueprint $table) {
            $table->dropColumn(['landing_title', 'landing_subtitle']);
        });
    }
}
