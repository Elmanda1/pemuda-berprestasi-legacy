<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Import Full SQL Dump (Schema + Data)
        $path = database_path('seeds/dump.sql');

        if (file_exists($path)) {
            $this->command->info('Importing SQL Dump...');
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::unprepared(file_get_contents($path));
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->command->info('SQL Dump Imported Successfully!');

            // Run additional seeders
            $this->call(TutorialSeeder::class);
            $this->call(CustomRolesSeeder::class);
        } else {
            $this->command->error('SQL Dump file not found at: ' . $path);
        }
    }
}
