<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DefaultCompetitionTextSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $hero_title = "Sriwijaya International";
        $hero_description = "Kompetisi taekwondo internasional bergengsi yang menggabungkan tradisi dan inovasi, menghadirkan standar kompetisi kelas dunia untuk para atlet berprestasi.";
        $about_description = "Salam hormat Sabum, Sabumnim dan orang tua Atlet Taekwondo Indonesia. Tahun ini Pengurus Pengprov TISS mengadakan event Sriwijaya Internasional Championship 2025 Dimana semua itu dapat terwujud dengan adanya kerjasama dan dukungan dari seluruh pihak, para insan Taekwondoin Sumatera Selatan, KONI Sumatera Selatan dan Pemerintah Provinsi Sumatera Selatan. Pelaksanaan event kejuaraan ini bertempat di GOR RANAU JSC PALEMBANG Untuk itu kami mengundang semua untuk bergabung pada kegiatan tersebut. Semoga dengan diadakannya event ini, dapat menjadi tolak ukur para atlet-atlet muda, serta dapat memenuhi harapan Insan Taekwondo, agar Atlet dapat dipandang di kancah Nasional dan Internasional nantinya. Aamiin.";
        $about_director_name = "Hj. Meilinda, S.Sos.,M.M";
        $about_director_title = "Ketua Panitia Kejuaraan Sriwijaya";
        $contact_description = "Berikut adalah detail informasi mengenai kontak dan lokasi pertandingan. Jangan takut untuk menghubungi tim kami kapan saja. Kami siap memberikan informasi detail Sriwijaya Competition 2025 serta panduan menuju ke lokasi pertandingan";
        $contact_venue_name = "GOR Jakabaring (Gor Ranau JSC), Palembang";

        DB::table('tb_kompetisi')->update([
            'hero_title' => $hero_title,
            'hero_description' => $hero_description,
            'about_description' => $about_description,
            'about_director_name' => $about_director_name,
            'about_director_title' => $about_director_title,
            'contact_description' => $contact_description,
            'contact_venue_name' => $contact_venue_name,
        ]);
    }
}
