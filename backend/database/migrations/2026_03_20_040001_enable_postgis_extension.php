<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') return;

        try {
            DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        } catch (\Exception $e) {
            // PostGIS not installed on this system — spatial features will be unavailable.
            // Install PostGIS via Stack Builder (PostgreSQL Application Stack Builder)
            // then re-run: php artisan migrate
            Log::warning('[PostGIS] Extension not available: ' . $e->getMessage());
            echo "\n  [WARNING] PostGIS extension not available. Spatial features disabled.\n";
            echo "  To install: Open 'Stack Builder' from the PostgreSQL start menu and install PostGIS.\n\n";
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') return;

        try {
            DB::statement('DROP EXTENSION IF EXISTS postgis');
        } catch (\Exception $e) {
            Log::warning('[PostGIS] Could not drop extension: ' . $e->getMessage());
        }
    }
};
