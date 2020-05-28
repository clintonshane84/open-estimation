<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("users")->delete();
        User::create(array(
            "name" => "Developer",
            "email" => "clintonshanewright@gmail.com",
            "password" => Hash::make("awesome1"),
        ));
    }
}
