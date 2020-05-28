<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->mediumIncrements("id");
            $table->string("label", 191);
            $table->unsignedMediumInteger("list_id");
            $table->unsignedMediumInteger("user_id");
            $table->text("description")->nullable(true);
            $table->datetime("due_date")->nullable(true);
            $table->boolean("complete")->default(0);
            $table->unsignedTinyInteger("priority")->default(0);
            $table->timestamps(false);
            $table->foreign("list_id")->references("id")->on("lists");
            $table->foreign("user_id")->references("id")->on("users");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
