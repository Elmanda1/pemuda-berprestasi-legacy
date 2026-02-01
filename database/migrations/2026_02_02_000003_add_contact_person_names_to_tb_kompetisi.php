<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddContactPersonNamesToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->string('contact_person_name_1')->nullable();
            $table->string('contact_person_name_2')->nullable();
        });

        // Seed with current hardcoded defaults
        DB::table('tb_kompetisi')->update([
            'contact_person_name_1' => 'Rora',
            'contact_person_name_2' => 'Rizka',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->dropColumn(['contact_person_name_1', 'contact_person_name_2']);
        });
    }
}
