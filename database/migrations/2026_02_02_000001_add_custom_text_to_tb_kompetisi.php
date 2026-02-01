<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCustomTextToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            // Hero Section Fields
            $table->string('hero_title', 255)->nullable();
            $table->text('hero_description')->nullable();
            
            // About Section Fields
            $table->text('about_description')->nullable();
            $table->string('about_director_name', 255)->nullable();
            $table->string('about_director_title', 255)->nullable();
            
            // Contact Section Fields
            $table->text('contact_description')->nullable();
            $table->string('contact_venue_name', 255)->nullable();
        });

        // Seed default data
        DB::table('tb_kompetisi')->update([
            'hero_title' => 'Sriwijaya International',
            'hero_description' => 'Kompetisi taekwondo internasional bergengsi yang menggabungkan tradisi dan inovasi, menghadirkan standar kompetisi kelas dunia untuk para atlet berprestasi.',
            'about_description' => 'Salam hormat Sabum, Sabumnim dan orang tua Atlet Taekwondo Indonesia. Tahun ini Pengurus Pengprov TISS mengadakan event Sriwijaya Internasional Championship 2025 Dimana semua itu dapat terwujud dengan adanya kerjasama dan dukungan dari seluruh pihak, para insan Taekwondoin Sumatera Selatan, KONI Sumatera Selatan dan Pemerintah Provinsi Sumatera Selatan. Pelaksanaan event kejuaraan ini bertempat di GOR RANAU JSC PALEMBANG Untuk itu kami mengundang semua untuk bergabung pada kegiatan tersebut. Semoga dengan diadakannya event ini, dapat menjadi tolak ukur para atlet-atlet muda, serta dapat memenuhi harapan Insan Taekwondo, agar Atlet dapat dipandang di kancah Nasional dan Internasional nantinya. Aamiin.',
            'about_director_name' => 'Hj. Meilinda, S.Sos.,M.M',
            'about_director_title' => 'Ketua Panitia Kejuaraan Sriwijaya',
            'contact_description' => 'Berikut adalah detail informasi mengenai kontak dan lokasi pertandingan. Jangan takut untuk menghubungi tim kami kapan saja. Kami siap memberikan informasi detail Sriwijaya Competition 2025 serta panduan menuju ke lokasi pertandingan',
            'contact_venue_name' => 'GOR Jakabaring (Gor Ranau JSC), Palembang',
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
            $table->dropColumn([
                'hero_title',
                'hero_description',
                'about_description',
                'about_director_name',
                'about_director_title',
                'contact_description',
                'contact_venue_name'
            ]);
        });
    }
}
