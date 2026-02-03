<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddTimelineDataFieldToTbKompetisi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_kompetisi', function (Blueprint $table) {
            $table->json('timeline_data')->nullable();
        });

        // Seed with current hardcoded defaults from timeline.tsx
        $defaultTimeline = [
            [
                "event" => "Registrasi",
                "time" => "1 Agustus - 8 November 2025",
                "side" => "left",
                "month" => "Agustus - November",
            ],
            [
                "event" => "Penimbangan",
                "time" => "21 November 2025 10.00 - 15.00",
                "side" => "right",
                "month" => "November",
            ],
            [
                "event" => "Technical Meeting",
                "time" => "21 November 2025 15.30 - selesai",
                "side" => "left",
                "month" => "November",
            ],
            [
                "event" => "Pertandingan",
                "time" => "22 -26 November 2025",
                "side" => "right",
                "month" => "November",
            ],
        ];

        DB::table('tb_kompetisi')->update([
            'timeline_data' => json_encode($defaultTimeline)
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
            $table->dropColumn('timeline_data');
        });
    }
}
