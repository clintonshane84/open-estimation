<?php
namespace App\Http\Controllers\Api;

class Constants {
    public const STATUS_SUCCESS = "Success";
    public const STATUS_ERROR = "Error";
    public const MSG_STATUS = "Your query ran successfully";
    public const MSG_ERROR = "An error occured";
    public const MSG_RECORD_NOT_FOUND = "No record was found for ID: %s";
    public const MSG_RECORD_DELETE = "Successfully deleted record with ID: %s";
    public const MSG_RECORD_CREATE = "Successfully inserted record with ID: %s";
    public const MSG_RECORD_UPDATE = "Successfully updated record with ID: %s";
    public const MSG_NO_ACTION = "No actions where performed for your query";
}