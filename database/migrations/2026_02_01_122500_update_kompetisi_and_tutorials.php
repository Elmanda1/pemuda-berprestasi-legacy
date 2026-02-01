<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateKompetisiAndTutorials extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update tb_kompetisi
        Schema::table('tb_kompetisi', function (Blueprint $blueprint) {
            if (!Schema::hasColumn('tb_kompetisi', 'poster_image')) {
                $blueprint->string('poster_image')->nullable();
            }
            if (!Schema::hasColumn('tb_kompetisi', 'show_antrian')) {
                $blueprint->boolean('show_antrian')->default(true);
            }
            if (!Schema::hasColumn('tb_kompetisi', 'show_navbar')) {
                $blueprint->boolean('show_navbar')->default(true);
            }
        });

        // Create tb_tutorial if not exists
        if (!Schema::hasTable('tb_tutorial')) {
            Schema::create('tb_tutorial', function (Blueprint $table) {
                $table->id('id_tutorial');
                $table->unsignedBigInteger('id_kompetisi')->nullable();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('video_id');
                $table->string('thumbnail')->nullable();
                $table->string('icon_type')->default('Video');
                $table->timestamps();

                $table->foreign('id_kompetisi')
                    ->references('id_kompetisi')
                    ->on('tb_kompetisi')
                    ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_tutorial');
        Schema::table('tb_kompetisi', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['poster_image', 'show_antrian', 'show_navbar']);
        });
    }
}
