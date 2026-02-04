<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTemplateTypeToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            // Check if column exists to avoid errors on re-run
            if (!Schema::hasColumn('tb_kompetisi', 'template_type')) {
                $table->string('template_type')->default('default')->nullable()->after('status');
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
            if (Schema::hasColumn('tb_kompetisi', 'template_type')) {
                $table->dropColumn('template_type');
            }
        });
    }
}
