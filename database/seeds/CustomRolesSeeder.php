<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('Creating/Verifying Custom Roles (SUPER_ADMIN & ADMIN PENYELENGGARA)...');

        // 1. SUPER_ADMIN
        $superAdminEmail = 'superadmin@example.com';
        $superAdminPassword = 'superadmin123';
        $superAdminRole = 'SUPER_ADMIN';

        $superUser = DB::table('tb_akun')->where('email', $superAdminEmail)->first();
        if (!$superUser) {
            $idSuper = DB::table('tb_akun')->insertGetId([
                'email' => $superAdminEmail,
                'password_hash' => Hash::make($superAdminPassword),
                'role' => $superAdminRole,
            ]);
            $this->command->info("Created SUPER_ADMIN user: $superAdminEmail");
        } else {
            $idSuper = $superUser->id_akun;
            DB::table('tb_akun')->where('id_akun', $idSuper)->update(['role' => $superAdminRole]);
            $this->command->info("Verified SUPER_ADMIN user: $superAdminEmail");
        }

        // Ensure SUPER_ADMIN has profile in tb_super_admin
        if (!DB::table('tb_super_admin')->where('id_akun', $idSuper)->exists()) {
            DB::table('tb_super_admin')->insert([
                'nama' => 'Super Admin',
                'id_akun' => $idSuper,
            ]);
            $this->command->info("Created profile for SUPER_ADMIN in tb_super_admin");
        }
        
        // Remove SUPER_ADMIN from tb_admin_penyelenggara if it exists there
        DB::table('tb_admin_penyelenggara')->where('id_akun', $idSuper)->delete();

        // 2. ADMIN (Admin Penyelenggara)
        $adminEmail = 'admin@example.com';
        $adminPassword = 'admin123';
        $adminRole = 'ADMIN';

        $adminUser = DB::table('tb_akun')->where('email', $adminEmail)->first();
        if (!$adminUser) {
            $idAdmin = DB::table('tb_akun')->insertGetId([
                'email' => $adminEmail,
                'password_hash' => Hash::make($adminPassword),
                'role' => $adminRole,
            ]);
            $this->command->info("Created ADMIN user: $adminEmail");
        } else {
            $idAdmin = $adminUser->id_akun;
            DB::table('tb_akun')->where('id_akun', $idAdmin)->update(['role' => $adminRole]);
            $this->command->info("Verified ADMIN user: $adminEmail");
        }

        // Link to 1 Penyelenggara
        $penyelenggara = DB::table('tb_penyelenggara')->first();
        if (!$penyelenggara) {
            $idPenyelenggara = DB::table('tb_penyelenggara')->insertGetId([
                'nama_penyelenggara' => 'Penyelenggara Default',
                'email' => 'contact@penyelenggara.com',
            ]);
            $this->command->info("Created default penyelenggara");
        } else {
            $idPenyelenggara = $penyelenggara->id_penyelenggara;
        }

        // Profile in tb_admin_penyelenggara
        $adminProfile = DB::table('tb_admin_penyelenggara')->where('id_akun', $idAdmin)->first();
        if (!$adminProfile) {
            DB::table('tb_admin_penyelenggara')->insert([
                'id_akun' => $idAdmin,
                'id_penyelenggara' => $idPenyelenggara,
                'nama' => 'Admin Penyelenggara'
            ]);
            $this->command->info("Created profile for ADMIN in tb_admin_penyelenggara and linked to penyelenggara ID: $idPenyelenggara");
        } else {
            DB::table('tb_admin_penyelenggara')->where('id_akun', $idAdmin)->update([
                'id_penyelenggara' => $idPenyelenggara,
                'nama' => 'Admin Penyelenggara'
            ]);
            $this->command->info("Updated ADMIN profile in tb_admin_penyelenggara with penyelenggara ID: $idPenyelenggara");
        }

        // Remove ADMIN from tb_super_admin if it exists there
        DB::table('tb_super_admin')->where('id_akun', $idAdmin)->delete();
    }
}
