<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Tasks;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table("tasks")->delete();
        Tasks::create(array(
            "label" => "My First Task",
            "description" => "This task was automatically created as demo data",
            "list_id" => 1,
            "user_id" => 1,
        ));
    }
}
