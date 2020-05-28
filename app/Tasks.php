<?php

namespace App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use App\Models\Extensions\TraitEnum;

class Tasks extends Model
{
    use TraitEnum;
    public $timestamps = false;
    public static $fields = ["id", "label", "complete", "description", "due_date", "priority"];
    public static function getAll() {
        return DB::table("tasks")->select(DB::raw("id, label, description, due_date, complete, priority"))
        ->orderBy("complete", "desc")
        ->orderBy("label", "asc")
        ->get();
    }
    
    /**
     * Wrap a single dimensional array containing key value
     * pairs representing the properties of the tasks model
     * 
     * @param array $params
     * @return Tasks (chainable)
     */
    public function wrapArray(array $params) : Tasks {
        $matches = array_intersect_key($params, array_flip(self::$fields));
        if (empty($matches) === false) {
            foreach($matches as $k => $v) {
                if ($v !== null) {
                    $this->$k = $v;
                }
            }
        }
        return $this;
    }
}
