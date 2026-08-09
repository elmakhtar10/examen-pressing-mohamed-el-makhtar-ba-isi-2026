<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $gestionnaireRole = Role::create(['name' => 'Gestionnaire']);
        $clientRole = Role::create(['name' => 'Client']);

        User::create([
            'name'     => 'Gestionnaire LIC',
            'email'    => 'admin@pressing.com',
            'password' => Hash::make('passer123'),
            'phone'    => '770000000',
            'role_id'  => $gestionnaireRole->id,
        ]);
    }
}
