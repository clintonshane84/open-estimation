/*
 * This is our bootstrap loader
 * 
 * @name app.js
 * @namespace mytodo
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */

// Set dialog defaults for alertify
if (alertify !== undefined || alertify !== null) {
    alertify.defaults.transition = "slide";
    alertify.defaults.theme.ok = "btn btn-primary";
    alertify.defaults.theme.cancel = "btn btn-danger";
    alertify.defaults.theme.input = "form-control";
}

// Initialize our main object
var mytodo = {
    allprops: ["objs", "helper", "handlers", "factory", "apis"],
    "apis": {},
    "csrfToken" : window.Laravel.csrfToken
};

/*
 * Our applications waitForMe method() to ensure everything
 * is loaded and ready before executing unless the request
 * times out
 * 
 * @function waitForMe
 * @param function cb
 * @param array props
 */
mytodo.waitForMe = (cb, obj, props) => {
    if (Object.prototype.toString.call(cb) === "[object Function]" &&
        Object.prototype.toString.call(obj) === "[object Object]" &&
        Object.prototype.toString.call(props) === "[object Array]") {
        var timeStart = Date.now();
        var keys = Object.keys(obj);
        while (true) {
            if (props.every((i) => {
                return keys.includes(i);
            })) {
                cb();
                break;
            } else if (((Date.now() - timeStart) / 1000) < 10) {
                break;
            }
        }
    }
}

mytodo.helper = {
    "types": {
        "isString": function (val) {
            if (Object.prototype.toString.call(val) === "[object String]")
                return true;
            return false;
        },
        "isArray": function (val) {
            if (Object.prototype.toString.call(val) === "[object Array]")
                return true;
            return false;
        },
        "isObject": function (val) {
            if (Object.prototype.toString.call(val) === "[object Object]")
                return true;
            return false;
        }
    },
    "objs": {
        "cloneObj": function (o) {
            return Object.create(o);
        }
    }
};

mytodo.factory = {
    "make": function (name) {
        if (mytodo.helper.types.isString(name)) {
            if (mytodo.objs.hasOwnProperty(name)) {
                return Object.assign({}, mytodo.objs[name]);
            }
        }
        return undefined;
    },
    "makeFormData": function (params) {
        var fd = new FormData();
        if (params) {
            for (var i in params) {
                fd.append(i, params[i]);
            }
        }
        return fd;
    }
};

mytodo.objs = {
    tasks: {
        id: null,
        list_id: null,
        user_id: null,
        label: "",
        complete: false,
        description: "",
        priority: 0,
        due_date: null,
        showOptions: false
    },
    lists: {
        id: null,
        user_id: null,
        label: "",
        hide: false
    }
};

mytodo.handlers = {
    "vue": {},
    "dialogs": {
        "alertify" : {
            "success": function (msg) {
                if (msg && mytodo.helper.types.isString(msg))
                    alertify.success(msg);
            },
            "error": function (msg) {
                if (msg && mytodo.helper.types.isString(msg))
                    alertify.error(msg);
            },
            "alert": {
                "open": function (msg) {
                    if (msg && mytodo.helper.types.isString(msg))
                        alertify.alert().set('message', msg).showModal();
                },
                "close": function () {
                    alertify.alert().close();
                }
            },
            "prompt": {
                "open": function (title, msg, ok, no) {
                    if (mytodo.helper.types.isString(title) && title && mytodo.helper.types.isString(msg) && msg) {
                        console.log("prompt open");
                        alertify.prompt(title, msg, "", function (evt, value) {
                            ok(evt, value);
                        }, function () {
                            no()
                        });
                    }
                },
                "close": function () {
                    alertify.prompt().close();
                }
            },
            "notify": {
                "open": function (msg, status) {
                    alertify.notify(msg, 'success', 5, function () {});
                },
                "close": function () {
                    alertify.notify().close();
                }
            },
            "confirm": {
                "open": function (title, msg) {
                    if (msg && mytodo.helper.types.isString(msg) &&
                        mytodo.helper.types.isString(title)) {
                        alertify.confirm(title, msg, function () {
                            alertify.success('Ok')
                        }, function () {
                            alertify.error('Cancel')
                        });
                    }
                },
                "close": function () {
                    alertify.confirm().close();
                }
            }
        }
    },
    "ajax": {
        standardAjaxHandler: async (cb) => {
            try {
                response = await cb();
                if (response !== null) {
                    await mytodo.handlers.ajax.notifications.notify(response);
                    return response;
                } else {
                    throw new Error("No response found");
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        post: {
            /**
             * Create a record using the POST HTTP method
             * and the FormData object
             * 
             * @param FormData fd
             * @param string url
             * @param method = "POST"
             * return Promise
             */
            form: function (fd, url) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: "POST",
                        url: url,
                        processData: false,
                        contentType: false,
                        enctype: "multipart/form-data",
                        cache: false,
                        data: fd,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        success: function (response, status, jqXHR) {
                            resolve(jqXHR);
                        }
                    }).fail(function (jqXHR, textStatus) {
                        reject(jqXHR);
                    });
                });
            }
        },
        put: {
            /**
             * Update a record using the POST method but
             * injecting the method as a HTTP Query parameter
             * Takes the FormData and sets the contentType to
             * multipart/form-data to update records
             * 
             * @function mytodo.handlers.ajax.put.form
             * @param FormData fd
             * @param string url
             * @return Promise
             */
            form: function (fd, url) {
                var connectorchar = (url.search(/\?/) !== -1) ? "&" : "?";
                return mytodo.handlers.ajax.post.form(fd, url + connectorchar + "_method=PUT");
            }
        },
        /**
         * Send a GET HTTP request used for reading data
         * 
         * @function mytodo.handlers.ajax.get
         * @param FormData fd
         * @param string url
         * @return Promise
         */
        get: function (url, method = "GET") {
            return new Promise((resolve, reject) => {
                method = (method.search(/^GET|DELETE$/i) !== -1) ? method.toUpperCase() : "GET";
                $.ajax({
                    type: method,
                    url: url,
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (response, status, jqXHR) {
                        resolve(jqXHR);
                    }
                }).fail(function (jqXHR, textStatus) {
                    reject(jqXHR);
                });
            });
        },
        /**
         * Send a DELETE HTTP request used for deleting records
         * from the server
         * 
         * @function mytodo.handlers.ajax.delete
         * @param string url
         * @return Promise
         */
        delete: function (url) {
            return this.get(url, "DELETE");
        },
        "notifications": {
            notify: function (jqXHR) {
                return new Promise(function (resolve, reject) {
                    try {
                        var msg, alertState = "danger";

                        if (jqXHR.hasOwnProperty("status")) {
                            var st = jqXHR.status.toLowerCase();
                            if (st == "success") {
                                alertState = st;
                            } else {
                                alertState = "danger";
                            }
                        }

                        if (jqXHR.hasOwnProperty("message")) {
                            msg = jqXHR.message;
                        }

                        mytodo.handlers.dialogs.alertify.notify.open(msg, alertState);
                        resolve(jqXHR);
                    } catch (err) {
                        reject(err);
                    }
                });
            },
            convert: {
                "xhr": {
                    toerror: function (jqXHR) {
                        var msg = "An error has occured: ";
                        if (jqXHR !== null) {

                            if (jqXHR.hasOwnProperty("status")) {
                                msg += jqXHR.status;
                            }

                            if (jqXHR.hasOwnProperty("statusText")) {
                                msg = (msg) ? msg + " " + jqXHR.statusText :
                                    jqXHR.statusText;
                            }

                            if (jqXHR.hasOwnProperty("responseJSON")) {
                                if (jqXHR.responseJSON.hasOwnProperty("message")) {
                                    msg = (msg) ? msg + ", Message: " +
                                        jqXHR.responseJSON.message :
                                        jqXHR.responseJSON.message;
                                }

                                if (jqXHR.responseJSON.hasOwnProperty("file")) {
                                    msg = (msg) ? msg + ", File: " +
                                        jqXHR.responseJSON.file :
                                        jqXHR.responseJSON.file;
                                }

                                if (jqXHR.responseJSON.hasOwnProperty("line")) {
                                    msg = (msg) ? msg + ", Line: " +
                                        jqXHR.responseJSON.line :
                                        jqXHR.responseJSON.line;
                                }

                                if (jqXHR.responseJSON.hasOwnProperty("exception")) {
                                    msg = (msg) ? msg + ", Exception: " +
                                        jqXHR.responseJSON.exception :
                                        jqXHR.responseJSON.exception;
                                }
                            }
                        }
                        return msg;
                    }
                }
            }
        }
    }
};