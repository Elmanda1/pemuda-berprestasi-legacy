<?php


use Illuminate\Database\Seeder;
use App\Models\Tutorial;

class TutorialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tutorials = [
            [
                'title' => "Registrasi Dojang dan Pelatih",
                'description' => "Pelajari cara mendaftarkan dojang dan pelatih dalam sistem dengan mudah dan cepat",
                'video_id' => "blgvr3mGq_0",
                'icon_type' => 'FileText'
            ],
            [
                'title' => "Registrasi Atlet",
                'description' => "Tutorial lengkap untuk mendaftarkan atlet baru ke dalam sistem kompetisi",
                'video_id' => "pcggSEjz3-A",
                'icon_type' => 'User'
            ],
            [
                'title' => "Registrasi Kompetisi",
                'description' => "Panduan lengkap mendaftarkan kompetisi dalam sistem manajemen",
                'video_id' => "3iqZ_c_u000",
                'icon_type' => 'Award'
            ],
            [
                'title' => "Tutorial Mengambil Sertifikat Atlet",
                'description' => "Pelajari cara mengambil sertifikat atlet Anda dengan mudah melalui panduan video ini.",
                'video_id' => "F43jH1sotQY",
                'icon_type' => 'Award'
            ]
        ];

        foreach ($tutorials as $tut) {
            Tutorial::updateOrCreate(
                ['video_id' => $tut['video_id']],
                $tut
            );
        }
    }
}
