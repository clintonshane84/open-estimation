/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name tasks.js
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */

// Initiliaze the tasks module
mytodo.waitForMe(function () {
    // Setup our Task API calls
    mytodo.apis.tasks = {
        /**
         * Fetch the task records and load into the page
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        getAll: function () {
            return mytodo.handlers.ajax.get("/api/task/all");
        },
        insert: function (lbl, list_id) {
            var cForm = new FormData();
            cForm.append("label", lbl);
            cForm.append("list_id", list_id);
            return mytodo.handlers.ajax.post.form(cForm, "/api/task/new");
        },
        /**
         * Using the given todo object attempt to update the record
         * 
         * @function mytodo.handlers.vue.tasks.update
         * @memberto mytodo
         * @return Promise
         */
        update: function (fdata) {
            return mytodo.handlers.ajax.put.form(fdata, "/api/task/update/" + fdata.get("id"));
        },
        /**
         * Using the given todo object attempt to delete the record
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        delete: function (id) {
            return mytodo.handlers.ajax.delete("/api/task/delete/" + id);
        }
    }
    // Setup our Vue components for Tasks
    Vue.component("todo-tasks", {
        props: ["items", "list_id", "csrf", "dialog", "app"],
        delimiters: ["${", "}"],
        methods: {
            /**
             * Toggle the complete checkbox for a task
             * 
             * @function mytodo.handlers.vue.tasks.checkbox
             * @memberto mytodo
             * @param Object item
             */
            checkbox: function (item) {
                item.complete = !item.complete;
                mytodo.apis.tasks.update(mytodo.factory.makeFormData({
                    "id": item.id,
                    "complete": ((item.complete) ? 1 : 0)
                }));
            },
            /**
             * Vue Tasks component update a record
             * 
             * @function mytodo.handlers.vue.tasks.edit
             * @param Object
             */
            edit: function (item) {
                if (item) {
                    mytodo.handlers.dialogs.default.loadRecord(item);
                    mytodo.handlers.dialogs.default.open();
                }
            },
            /**
             * Vue Tasks component update a record
             * 
             * @function mytodo.handlers.vue.tasks.update
             * @memberof mytodo
             * @param Object
             * @return Promise
             */
            update: function (item, f) {
                if (item) {
                    var el = document.getElementById("task-" + f + "-" + item.id);
                    if (el) {
                        item[f] = el.value;
                        var data = {
                            "id": item.id
                        };
                        data[f] = item[f];
                        mytodo.apis.tasks.update(mytodo.factory.makeFormData(data));
                    }
                }
            },
            /**
             * Vue Tasks component create a record
             * 
             * @param Object item
             * @return Promise
             */
            create: function (item) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.tasks.insert(item.label, list_id);
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        var o = mytodo.factory.make("tasks");

                        for (var i in rd) {
                            var val = rd[i];
                            if (val !== undefined) {
                                if (Object.keys(rd).find(element => element === i) !== undefined) {
                                    o[i] = val;
                                }
                            }
                        }
                        mytodo.handlers.vue.$data.tasks.push(o);
                    }
                });
            },
            /**
             * Vue Tasks component delete a record
             * 
             * @function mytodo.handlers.vue.tasks.delete
             * @memberof mytodo
             * @param Object
             *            params
             * @return Promise
             */
            remove: function (item) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    console.log("dump id");
                    console.log(item.id);
                    return mytodo.apis.tasks.delete(item.id);
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        if (rd.hasOwnProperty("id")) {
                            var found = -1,
                                data = mytodo.handlers.vue.$data.tasks;
                            for (var i in data) {
                                if (data[i].id == rd.id) {
                                    found = i;
                                    break;
                                }
                            }
                            if (found !== -1) {
                                data.splice(found, 1);
                            }
                        }
                    }
                });
            },
            /**
             * Generate a number for a new task item based off the highest determined id
             * from the list and increment it by 1
             * 
             * @function generateId
             * @memberof mytodo
             * @return number|null
             */
            generateId: function () {
                var d = mytodo.handlers.vue.$data.tasks;
                if (d.length > 0) {
                    var elId = d[0].id;
                    for (var di in d) {
                        elId = (elId < d[di].id) ? d[di].id : elId;
                    }
                    return ++elId;
                }
                return null;
            }
        },
        template: '<div class="t-list-container"><li v-for="item in items" :key="item.label" v-if="item.list_id == list_id"><form v-bind:id="\'form-\' + item.id" method="post" enctype="multipart/form-data" class="col-md-12"><input type="hidden" name="_token" :value="csrf"><div class="row"><div class="col-sm-8 col-md-8 col-xs-8"><input :id="\'task-label-\'+ item.id" :value="item.label" v-on:change="update(item, \'label\')"></div><div class="col-sm-4 col-md-4 col-xs-4 pull-right"><div class="form-group"><label :for="\'task-complete-\' + item.id">Completed</label><input :id="\'task-complete-\' + item.id" type="checkbox" class="btn btn-sm btn-primary" v-on:click="checkbox(item)" :checked="item.complete"></input></div></div></div><div class="row pull-right m-t-1"><div class="btn-group p-r-1"><button type="button" class="btn btn-sm btn-primary" :id="\'task-edit-\' + item.id" v-on:click="edit(item)" title="Edit Task"><span class="fas fa-edit"></span></button></div><div class="btn-group"><button type="button" class="btn btn-sm btn-danger" :id="\'task-delete-\' + item.id" v-on:click="remove(item)"title="Delete Task"><span class="fas fa-trash"></span></button></div></div></form></li></div>'
    });
}, mytodo, mytodo.allprops);