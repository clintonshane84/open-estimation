<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Lists;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mytodo\Helpers\ParamHelper;

class ListController extends Controller
{
    private static $respJson = array(
        "status" => "Success",
        "message" => "No results",
        "data" => ""
    );
    
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
            $respJson["data"] = Lists::select("*")
            ->where("user_id", "=", Auth::user()->id)
            ->get()
            ->toJson();
            $respJson["message"] = "Successfully fetched all list records";
        } catch(\Exception $e){
            $respJson["status"] = "Error";
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
        $respJson["message"] = "No record inserted";
        $respJson["status"] = "Error";
        try {
            $params = $request->all();
            $keys = ["name"];
            $params = array_intersect_key($params, array_flip($keys));
            if (empty($params) === false) {
                $name = $params["name"];
                if (empty($name) === false) {
                    $l = new Lists();
                    $l->name = $name;
                    $l->user_id = Auth::user()->id;
                    if ($l->save() === true) {
                        $l = Lists::where("id", "=", $l->id)
                        ->get()[0];
                        $respJson["status"] = "Success";
                        $respJson["message"] = "Created new record successfully with id: $l->id";
                        $respJson["data"] = $l->toJson();
                    } else {
                        throw new \Exception("Failed to insert record");
                    }
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

    /**
     * Display the specified resource.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function get(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = "No record found";
        $respJson["status"] = Constants::STATUS_SUCCESS;
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if ($id !== false) {
            try {
                $result = Lists::where("id", "=", $id)
                ->limit(1)
                ->get();
                if ($result->isEmpty() === false) {
                    $respJson["message"] = "Fetched record successfully with id: $id";
                    $respJson["data"] = json_encode($result[0]);
                }
            } catch(\Exception $e){
                $respJson["status"] = "Error";
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
        $respJson["message"] = "No record updated";
        $respJson["status"] = "Error";
        try {
            $params = $request->all();
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false) {
                $result = Lists::where("id", "=", $id)
                ->limit(1)
                ->get();
                if ($result->isEmpty() === true)
                    throw new \Exception("Could not find the task record for id: $id");
                    $l = $result[0];
                    $l->wrapArray($params);
                if ($l->update() === true) {
                    $l = Lists::where("id", "=", $id)
                    ->limit(1)
                    ->get()[0];
                    $respJson["status"] = "Success";
                    $respJson["message"] = "Updated record successfully with id: $id";
                    $respJson["data"] = $l->toJson();
                } else {
                    throw new \Exception("Failed to insert record with id: $id");
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  string $id
     * @return \Illuminate\Http\Response
     */
    public function delete(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = sprintf(Constants::MSG_RECORD_DELETE, $id);
        $respJson["status"] = Constants::STATUS_ERROR;
        try {
            // Validate our id
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false || $id === 0) {
                $result = DB::table("lists")->where("id", "=", $id)
                ->delete();
                if ($result) {
                    $respJson["status"] = Constants::STATUS_SUCCESS;
                    $respJson["message"] = sprintf(Constants::MSG_RECORD_DELETE, $id);
                    $respJson["data"] = json_encode(["id" => $id]);
                } else {
                    throw new \Exception(sprintf(Constants::MSG_ERROR, $id));
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
