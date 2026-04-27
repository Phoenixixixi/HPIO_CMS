<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StationModels;

class StationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stations = [
            [
                'station_code' => '1',
                'station_name' => 'Halim',
            ],
            [
                'station_code' => '2',
                'station_name' => 'Karawang',
            ],
            [
                'station_code' => '3',
                'station_name' => 'Padalarang',
            ],
            [
                'station_code' => '4',
                'station_name' => 'Tegalluar',
            ],
        ];

        foreach ($stations as $station) {
            StationModels::create($station);
        }
    }
}
