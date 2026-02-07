<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameAdminRoleToAdminPenyelenggaraInTbAkun extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('tb_akun')->where('role', 'ADMIN')->update(['role' => 'ADMIN_PENYELENGGARA']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('tb_akun')->where('role', 'ADMIN_PENYELENGGARA')->update(['role' => 'ADMIN']);
    }
}
