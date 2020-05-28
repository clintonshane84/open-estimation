<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Tasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mytodo\Helpers\ParamHelper;

class TaskController extends Controller
{
    private static $respJson = array(
        "status" => "Success",
        "message" => "No results",
        "data" => ""
    );
    
    private $id;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $respJson = self::$respJson;
        try {
            $respJson["data"] = Tasks::select("*")
            ->where("user_id", "=", Auth::id())
            ->get()
            ->toJson();
            $respJson["message"] = Constants::MSG_STATUS;
            $respJson["status"] = Constants::STATUS_SUCCESS;
        } catch(\Exception $e){
            $respJson["status"] = Constants::STATUS_ERROR;
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $respJson = self::$respJson;
        $respJson["message"] = Constants::MSG_NO_ACTION;
        $respJson["status"] = Constants::STATUS_ERROR;
        try {
            $params = $request->all();
            $keys = ["label", "list_id"];
            $params = array_intersect_key($params, array_flip($keys));
            if (empty($params) === false) {
                $label = (string) filter_var($params["label"], FILTER_SANITIZE_STRING);
                $list_id = (int) filter_var($params["list_id"], FILTER_VALIDATE_INT);
                $user_id = (int) filter_var($params["label"], FILTER_VALIDATE_INT);
                if (empty($label) === false) {
                    $task = new Tasks();
                    $task->label = $label;
                    $task->list_id = $list_id;
                    $task->user_id = Auth::id();
                    if ($task->save() === true) {
                        $task = Tasks::where("id", "=", $task->id)
                        ->get()[0];
                        $respJson["status"] = Constants::STATUS_SUCCESS;
                        $respJson["message"] = sprintf(Constants::MSG_RECORD_CREATE, $task->id);
                        $respJson["data"] = $task->toJson();
                    } else {
                        throw new \Exception(Constants::MSG_ERROR);
                    }
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = Constants::STATUS_ERROR;
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function get(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = Constants::MSG_RECORD_NOT_FOUND;
        $respJson["status"] = Constants::STATUS_SUCCESS;
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if ($id !== false) {
            try {
                $result = Tasks::where(["id", "=", $id],["user_id", "=", $this->id])
                ->limit(1)
                ->get();
                if ($result->isEmpty() === false) {
                    $respJson["message"] = sprintf(Constants::MSG_STATUS, $id);
                    $respJson["data"] = json_encode($result[0]);
                }
            } catch(\Exception $e){
                $respJson["status"] = Constants::STATUS_ERROR;
                $respJson["message"] = $e->getMessage();
                $respJson["line"] = strval($e->getLine());
                $respJson["trace"] = $e->getTraceAsString();
            }
        }
        return response()->json($respJson);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  string                    $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        //
        $respJson = self::$respJson;
        $respJson["message"] = Constants::MSG_NO_ACTION;
        $respJson["status"] = Constants::STATUS_ERROR;
        try {
            $params = $request->all();
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false) {
                $result = Tasks::where("id", "=", $id)
                ->limit(1)
                ->get();
                if ($result->isEmpty() === true)
                    throw new \Exception(sprintf(Constants::MSG_RECORD_NOT_FOUND, $id));
                $task = $result[0];
                $task->wrapArray($params);
                if ($task->update() === true) {
                    $task = Tasks::where("id", "=", $id)
                    ->limit(1)
                    ->get()[0];
                    $respJson["status"] = Constants::STATUS_SUCCESS;
                    $respJson["message"] = sprintf(Constants::MSG_RECORD_UPDATE, $id);
                    $respJson["data"] = $task->toJson();
                } else {
                    throw new \Exception(Constants::MSG_ERROR);
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = Constants::STATUS_ERROR;
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string $id
     * @return \Illuminate\Http\Response
     */
    public function delete(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = Constants::MSG_NO_ACTION;
        $respJson["status"] = Constants::STATUS_ERROR;
        try {
            // Validate our id
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false || $id === 0) {
                $result = DB::table("tasks")->where("id", "=", $id)
                ->delete();
                if ($result) {
                    $respJson["status"] = Constants::STATUS_SUCCESS;
                    $respJson["message"] = sprintf(Constants::MSG_RECORD_DELETE, $id);
                    $respJson["data"] = json_encode(["id" => $id]);
                } else {
                    throw new \Exception(Constants::MSG_ERROR);
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }
}
