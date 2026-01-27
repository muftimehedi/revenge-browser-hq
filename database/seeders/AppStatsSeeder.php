<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppStatsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('app_stats')->insertOrIgnore([
            'app_name' => 'revenge_browser',
            'download_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
