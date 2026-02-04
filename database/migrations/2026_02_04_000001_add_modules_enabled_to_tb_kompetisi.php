<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddModulesEnabledToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            if (!Schema::hasColumn('tb_kompetisi', 'modules_enabled')) {
                $table->json('modules_enabled')->nullable()->after('template_type');
            }
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
            if (Schema::hasColumn('tb_kompetisi', 'modules_enabled')) {
                $table->dropColumn('modules_enabled');
            }
        });
    }
}
