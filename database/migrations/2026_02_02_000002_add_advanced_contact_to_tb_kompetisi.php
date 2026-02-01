<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddAdvancedContactToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->string('contact_phone_1')->nullable();
            $table->string('contact_phone_2')->nullable();
            $table->string('contact_instagram')->nullable();
            $table->text('contact_gmaps_url')->nullable();
        });

        // Seed with current hardcoded defaults
        DB::table('tb_kompetisi')->update([
            'contact_phone_1' => '081377592090',
            'contact_phone_2' => '085922124908',
            'contact_instagram' => 'sumsel_taekwondo',
            'contact_gmaps_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.2808245295255!2d104.7919914!3d-3.0190341000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b9da396d2b289%3A0xcc3623bbbb92bd93!2sGOR%20Jakabaring!5e0!3m2!1sen!2sid!4v1757524240866!5m2!1sen!2sid',
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
            $table->dropColumn(['contact_phone_1', 'contact_phone_2', 'contact_instagram', 'contact_gmaps_url']);
        });
    }
}
