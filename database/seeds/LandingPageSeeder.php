<?php

use Illuminate\Database\Seeder;

class LandingPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $penyelenggara = \App\Models\Penyelenggara::first();
        
        if ($penyelenggara) {
            $penyelenggara->update([
                'landing_title' => "Welcome to the Arena",
                'landing_subtitle' => "Tempat di mana semangat kompetisi bertemu dengan prestasi luar biasa. Bergabunglah dalam pertandingan taekwondo dengan standar internasional.",
                'landing_about_title' => "Embrace the Spirit of Competition",
                'landing_about_content' => "Platform terdepan untuk kompetisi taekwondo internasional yang menghubungkan atlet berprestasi dari seluruh dunia dalam satu arena digital. Kami menghadirkan pengalaman kompetisi yang fair, transparan, dan berkualitas tinggi dengan sistem penilaian yang modern dan terstandarisasi internasional.",
                'landing_features_title' => "Keunggulan Platform Kami",
                'landing_feature_1_title' => "Standar Internasional",
                'landing_feature_1_desc' => "Sistem penilaian dan aturan pertandingan yang sepenuhnya mengadopsi standar World Taekwondo (WT).",
                'landing_feature_2_title' => "Teknologi Modern",
                'landing_feature_2_desc' => "Manajemen pertandingan real-time dengan interface digital yang intuitif dan responsif.",
                'landing_feature_3_title' => "Komunitas Global",
                'landing_feature_3_desc' => "Menghubungkan praktisi taekwondo, pelatih, dan atlet dari berbagai penjuru dalam satu platform.",
            ]);
        } else {
            \App\Models\Penyelenggara::create([
                'nama_penyelenggara' => 'Admin Penyelenggara',
                'email' => 'admin@penyelenggara.com',
                'no_telp' => '08123456789',
                'alamat' => 'Jl. Taekwondo No. 1',
                'landing_title' => "Welcome to the Arena",
                'landing_subtitle' => "Tempat di mana semangat kompetisi bertemu dengan prestasi luar biasa. Bergabunglah dalam pertandingan taekwondo dengan standar internasional.",
                'landing_about_title' => "Embrace the Spirit of Competition",
                'landing_about_content' => "Platform terdepan untuk kompetisi taekwondo internasional yang menghubungkan atlet berprestasi dari seluruh dunia dalam satu arena digital. Kami menghadirkan pengalaman kompetisi yang fair, transparan, dan berkualitas tinggi dengan sistem penilaian yang modern dan terstandarisasi internasional.",
                'landing_features_title' => "Keunggulan Platform Kami",
                'landing_feature_1_title' => "Standar Internasional",
                'landing_feature_1_desc' => "Sistem penilaian dan aturan pertandingan yang sepenuhnya mengadopsi standar World Taekwondo (WT).",
                'landing_feature_2_title' => "Teknologi Modern",
                'landing_feature_2_desc' => "Manajemen pertandingan real-time dengan interface digital yang intuitif dan responsif.",
                'landing_feature_3_title' => "Komunitas Global",
                'landing_feature_3_desc' => "Menghubungkan praktisi taekwondo, pelatih, dan atlet dari berbagai penjuru dalam satu platform.",
            ]);
        }
    }
}
