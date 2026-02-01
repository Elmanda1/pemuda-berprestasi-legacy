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
            DB::unprepared(file_get_contents($path));
            $this->command->info('SQL Dump Imported Successfully!');

            // Run additional seeders
            $this->call(TutorialSeeder::class);
        } else {
            $this->command->error('SQL Dump file not found at: ' . $path);
        }
    }
}
