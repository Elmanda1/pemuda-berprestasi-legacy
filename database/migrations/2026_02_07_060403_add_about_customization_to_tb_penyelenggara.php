<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAboutCustomizationToTbPenyelenggara extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_penyelenggara', function (Blueprint $table) {
            $table->string('landing_about_title', 255)->nullable();
            $table->text('landing_about_content')->nullable();
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
            $table->dropColumn(['landing_about_title', 'landing_about_content']);
        });
    }
}
