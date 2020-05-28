<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ListController;

/*
 * |--------------------------------------------------------------------------
 * | API Routes
 * |--------------------------------------------------------------------------
 * |
 * | Here is where you can register API routes for your application. These
 * | routes are loaded by the RouteServiceProvider within a group which
 * | is assigned the "api" middleware group. Enjoy building your API!
 * |
 */
$contr = new TaskController();
$lcontr = new ListController();
Route::middleware(["auth:web"])->group(function () use ($contr, $lcontr) {
    // <== TASK OBJECT ==>

    // Get a all tasks belonging to the session user
    Route::get("task/all", function () use ($contr) {
        return $contr->index();
    });
    // Create a new task
    Route::post("task/new", function (Request $request) use ($contr) {
        return $contr->create($request);
    });

    // Update a task
    Route::put("task/update/{id}", function ($id, Request $request) use ($contr) {
        return $contr->update($id, $request);
    });
    // Delete a task
    Route::delete("task/delete/{id}", function ($id) use ($contr) {
        return $contr->delete($id);
    });

    // Get a single task by id
    Route::get("task/{id}", function ($id) use ($contr) {
        return $contr->get($id);
    });

    // <== LIST OBJECT ==>

    // Get a all lists belonging to the session user
    Route::get("/list/all", function () use ($lcontr) {
        return $lcontr->index();
    });

    // Get a single by id
    Route::get("list/{id}", function ($id) use ($lcontr) {
        return $lcontr->get($id);
    });
    // Create a new list
    Route::post("list/new", function (Request $request) use ($lcontr) {
        return $lcontr->create($request);
    });

    // Update a list
    Route::put("list/update/{id}", function ($id, Request $request) use ($lcontr) {
        return $lcontr->update($id, $request);
    });
    // Delete a list
    Route::delete("list/delete/{id}", function ($id) use ($lcontr) {
        return $lcontr->delete($id);
    });
});