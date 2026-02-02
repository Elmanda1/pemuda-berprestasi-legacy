<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddCustomizableFieldsForFaq extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->json('faq_data')->nullable();
        });

        // Seed with current hardcoded defaults from faq.tsx
        $defaultFaq = [
            [
                "title" => "Pendaftaran & Persyaratan",
                "description" => "Informasi lengkap mengenai proses pendaftaran, syarat peserta, dan dokumen yang diperlukan",
                "questions" => [
                    [
                        "question" => "Kapan periode pendaftaran dibuka dan ditutup?",
                        "answer" => "Pendaftaran dibuka mulai 1 Agustus 2025 dan ditutup pada 8 November 2025, atau lebih cepat jika kuota sudah terpenuhi."
                    ],
                    [
                        "question" => "Apa saja persyaratan umum untuk peserta?",
                        "answer" => "Peserta harus sehat jasmani & rohani, merupakan taekwondoin di bawah naungan PBTI, tidak sedang menjalani sanksi, melampirkan rekomendasi Pengprov/MNA (untuk WNA), BPJS (WNI) atau asuransi (WNA), fotokopi akta kelahiran, sertifikat taekwondo, pas foto 3x4 (2 lembar), dan surat keterangan sehat (khusus prestasi)."
                    ],
                    [
                        "question" => "Berapa biaya pendaftaran untuk kejuaraan ini?",
                        "answer" => "Biaya pendaftaran adalah Rp 500.000/atlet untuk WNI dan Rp 1.000.000/atlet untuk WNA."
                    ],
                    [
                        "question" => "Bagaimana cara melakukan pembayaran pendaftaran?",
                        "answer" => "Pembayaran dilakukan ke Bank Sumsel Babel dengan rekening a.n Panitia UKT Pengprov TISS No. 19309010367. Konfirmasi pembayaran dikirim melalui nomor panitia (Jeje: 0853-7844-1489)."
                    ]
                ]
            ],
            [
                "title" => "Kategori & Kompetisi",
                "description" => "Detail mengenai kategori pertandingan yang tersedia dan aturan penilaian",
                "questions" => [
                    [
                        "question" => "Apa saja kategori usia yang dipertandingkan?",
                        "answer" => "Kategori usia meliputi: Super Pra-Cadet (5–8 tahun, kelahiran 2017–2020), Pra-Cadet (9–11 tahun, kelahiran 2014–2016), Cadet (12–14 tahun, kelahiran 2011–2013), Junior (15–17 tahun, kelahiran 2008–2010), dan Senior (18 tahun ke atas, kelahiran 2007 atau sebelumnya)."
                    ],
                    [
                        "question" => "Apa saja jenis kompetisi yang tersedia?",
                        "answer" => "Kompetisi terdiri dari Kyorugi (pemula & prestasi), Poomsae (recognized dan freestyle, individu putra/putri), serta kategori beregu sesuai ketentuan."
                    ],
                    [
                        "question" => "Bagaimana sistem penilaian yang digunakan?",
                        "answer" => "Kyorugi pemula menggunakan DSS (Digital Scoring System), kyorugi prestasi menggunakan aturan WT Competition Rules, sedangkan Poomsae (pemula & prestasi) menggunakan sistem gugur (battle)."
                    ],
                    [
                        "question" => "Apakah atlet bisa mengikuti lebih dari satu kategori?",
                        "answer" => "Ya, atlet dapat bertanding di Kyorugi dan Poomsae sekaligus, dengan mendapatkan 2 ID card."
                    ]
                ]
            ],
            [
                "title" => "Teknis & Fasilitas",
                "description" => "Informasi mengenai lokasi, jadwal, fasilitas, dan akomodasi",
                "questions" => [
                    [
                        "question" => "Di mana lokasi penyelenggaraan kejuaraan?",
                        "answer" => "Kejuaraan akan dilaksanakan di GOR Ranau Jakabaring Sport City (JSC) Palembang, Sumatera Selatan."
                    ],
                    [
                        "question" => "Kapan jadwal pertandingan berlangsung?",
                        "answer" => "Pertandingan berlangsung pada 22–26 November 2025. Penimbangan atlet dilakukan 21 November 2025 (10.00–15.00 WIB), dilanjutkan dengan Technical Meeting pada pukul 15.30 WIB."
                    ],
                    [
                        "question" => "Apa saja fasilitas untuk peserta di venue?",
                        "answer" => "Tersedia area pemanasan, dukungan medis, shuttle bus di kawasan JSC, serta akses transportasi umum seperti Transmusi, LRT, Grab, dan Gojek."
                    ],
                    [
                        "question" => "Apakah ada rekomendasi penginapan untuk peserta?",
                        "answer" => "Ya, panitia merekomendasikan beberapa hotel dekat venue seperti Wyndham Opi Hotel (1,8 km), Opi Indah Hotel (1,7 km), Ayola Sentosa Palembang (5,1 km), dan Ibis Palembang Sanggar (5,2 km)."
                    ]
                ]
            ],
            [
                "title" => "Penghargaan & Hadiah",
                "description" => "Detail mengenai penghargaan, medali, dan hadiah pembinaan",
                "questions" => [
                    [
                        "question" => "Apa penghargaan untuk juara umum kategori prestasi?",
                        "answer" => "Juara Umum 1: Rp 30.000.000 + piala, piagam, dan hadiah sponsor. Juara Umum 2: Rp 15.000.000. Juara Umum 3: Rp 7.500.000."
                    ],
                    [
                        "question" => "Apa penghargaan untuk juara umum kategori pemula?",
                        "answer" => "Juara Umum 1: Rp 15.000.000, Juara Umum 2: Rp 10.000.000, Juara Umum 3: Rp 5.000.000, beserta piala, piagam, dan hadiah sponsor."
                    ],
                    [
                        "question" => "Apakah ada penghargaan individu?",
                        "answer" => "Ya, atlet terbaik di setiap kategori (Pracadet, Cadet, Junior, Senior, dan Poomsae) akan mendapatkan uang pembinaan Rp 1.000.000 serta piagam penghargaan."
                    ]
                ]
            ]
        ];

        DB::table('tb_kompetisi')->update([
            'faq_data' => json_encode($defaultFaq)
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
            $table->dropColumn('faq_data');
        });
    }
}
