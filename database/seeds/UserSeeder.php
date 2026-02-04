<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database with default users.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->command->info('Ensuring default users exist...');

        // 1. Ensure Penyelenggara exists (Favors existing one)
        $penyelenggara = DB::table('tb_penyelenggara')->first();
        if (!$penyelenggara) {
            $penyelenggaraId = DB::table('tb_penyelenggara')->insertGetId([
                'nama_penyelenggara' => 'Pengda TKD DKI Jakarta',
                'email' => 'pengda@tkd-dki.com',
                'no_telp' => '021-12345678',
            ]);
        } else {
            $penyelenggaraId = $penyelenggara->id_penyelenggara;
        }

        // 2. Ensure Kompetisi exists (Favors existing one)
        $kompetisi = DB::table('tb_kompetisi')->first();
        if (!$kompetisi) {
            $kompetisiId = DB::table('tb_kompetisi')->insertGetId([
                'nama_event' => 'Pemuda Berprestasi Championship VI',
                'id_penyelenggara' => $penyelenggaraId,
                'tanggal_mulai' => '2026-11-22 08:00:00',
                'tanggal_selesai' => '2026-11-26 21:00:00',
                'lokasi' => 'GOR Cendrawasih, Jakarta',
                'status' => 'PENDAFTARAN',
                'primary_color' => '#990D35',
                'secondary_color' => '#F5B700',
                'template_type' => 'default',
                'show_antrian' => 1,
                'show_navbar' => 1,
            ]);
        } else {
            $kompetisiId = $kompetisi->id_kompetisi;
        }

        // 3. Ensure Admin Akun exists
        $adminAkun = DB::table('tb_akun')->where('email', 'adminkompetisi@example.com')->first();
        if (!$adminAkun) {
            $adminAkunId = DB::table('tb_akun')->insertGetId([
                'email' => 'adminkompetisi@example.com',
                'password_hash' => Hash::make('sa12345'),
                'role' => 'ADMIN_KOMPETISI',
            ]);
        } else {
            $adminAkunId = $adminAkun->id_akun;
            DB::table('tb_akun')->where('id_akun', $adminAkunId)->update(['role' => 'ADMIN_KOMPETISI']);
        }

        // 4. Ensure Admin Kompetisi relation
        $adminKompRel = DB::table('tb_admin_kompetisi')->where('id_akun', $adminAkunId)->first();
        if (!$adminKompRel) {
            DB::table('tb_admin_kompetisi')->insert([
                'id_akun' => $adminAkunId,
                'id_kompetisi' => $kompetisiId,
                'nama' => 'Admin Kompetisi'
            ]);
        }

        // 5. Sample Dojang (Check if any exists, if for seed, use email)
        $dojang = DB::table('tb_dojang')->first();
        if (!$dojang) {
            $dojangId = DB::table('tb_dojang')->insertGetId([
                'nama_dojang' => 'Dojang Contoh',
                'alamat' => 'Jakarta',
                'no_telp' => '08112233445',
                'email' => 'dojang@example.com',
                'created_at' => Carbon::now(),
            ]);
        } else {
            $dojangId = $dojang->id_dojang;
        }

        // 6. Pelatih Akun
        $pelatihAkun = DB::table('tb_akun')->where('email', 'pelatih@example.com')->first();
        if (!$pelatihAkun) {
            $pelatihAkunId = DB::table('tb_akun')->insertGetId([
                'email' => 'pelatih@example.com',
                'password_hash' => Hash::make('sa12345'),
                'role' => 'PELATIH',
            ]);
        } else {
            $pelatihAkunId = $pelatihAkun->id_akun;
            DB::table('tb_akun')->where('id_akun', $pelatihAkunId)->update(['role' => 'PELATIH']);
        }

        // 7. Pelatih relation
        $pelatihRel = DB::table('tb_pelatih')->where('id_akun', $pelatihAkunId)->first();
        if (!$pelatihRel) {
            DB::table('tb_pelatih')->insert([
                'id_akun' => $pelatihAkunId,
                'id_dojang' => $dojangId,
                'nama_pelatih' => 'Pelatih Contoh',
                'no_telp' => '08198765432',
                'nik' => '1234567890123456',
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Default users verified/created and linked to existing data!');
    }
}
