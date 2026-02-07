<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFeaturesCustomizationToTbPenyelenggara extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_penyelenggara', function (Blueprint $table) {
            $table->string('landing_features_title', 255)->nullable();
            $table->string('landing_feature_1_title', 255)->nullable();
            $table->text('landing_feature_1_desc')->nullable();
            $table->string('landing_feature_2_title', 255)->nullable();
            $table->text('landing_feature_2_desc')->nullable();
            $table->string('landing_feature_3_title', 255)->nullable();
            $table->text('landing_feature_3_desc')->nullable();
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
            $table->dropColumn([
                'landing_features_title',
                'landing_feature_1_title',
                'landing_feature_1_desc',
                'landing_feature_2_title',
                'landing_feature_2_desc',
                'landing_feature_3_title',
                'landing_feature_3_desc'
            ]);
        });
    }
}
