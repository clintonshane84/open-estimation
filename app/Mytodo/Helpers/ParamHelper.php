<?php
/**
 * A set of common functions used with HTTP request params
 *  
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */
namespace App\Mytodo\Helpers;

class ParamHelper {
    /**
     * Using $params from an HTTP request filter out
     * any key value pairs that are not in the expected
     * $keys list
     * 
     * @param array $params
     * @param array $keys
     * @return array
     */
    public static function filterMatch(array $params, array $keys) : array {
        if (self::isNotEmpty([$params, $keys]) === true) {
            return array_intersect_key($params, array_flip($keys));
        }
        return [];
    }
    /**
     * Check if a list of values is empty using the empty()
     * PHP core method
     * 
     * @param array $values
     * @return bool
     */
    public static function isNotEmpty(array $values) : bool {
        $result = false;
        if (empty($values) === false) {
            $result = true;
            foreach($values as $k => $v) {
                $result = (bool)(empty($v) === false && $result);
            }
        }
        return $result;
    }
}
?>