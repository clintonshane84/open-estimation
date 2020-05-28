<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Lists;

class ListsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table("lists")->delete();
        Lists::create(array(
            'name' => 'My First List',
            'user_id' => 1,
        ));
    }
}
