/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name list.js
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */

// Initiliaze the tasks module
mytodo.waitForMe(() => {
    mytodo.apis.lists = {
        /**
         * Fetch the task records and load into the page
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        getAll: function () {
            return mytodo.handlers.ajax.get("/api/list/all");
        },
        /**
         * Fetch the task records and load into the page
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        insert: function (name) {
            var cForm = new FormData();
            cForm.append("name", name);
            return mytodo.handlers.ajax.post.form(cForm, "/api/list/new");
        },
        /**
         * Using the given todo object attempt to update the record
         * 
         * @function mytodo.handlers.vue.tasks.update
         * @memberto mytodo
         * @return Promise
         */
        update: function (fdata) {
            return mytodo.handlers.ajax.put.form(fdata, "/api/list/update/" + fdata.get("id"));
        },
        /**
         * Using the given todo object attempt to delete the record
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        delete: function (id) {
            return mytodo.handlers.ajax.delete("/api/list/delete/" + id);
        }
    };
    // Setup our main app
    Vue.component("todo-lists", {
        props: ["items", "csrf", "tasks", "dialog", "app"],
        delimiters: ["${", "}"],
        methods: {
            /**
             * Vue Lists component update a record
             * 
             * @function mytodo.handlers.vue.tasks.update
             * @memberof mytodo
             * @param Object
             * @return Promise
             */
            update: function (item, f) {
                if (f && mytodo.helper.types.isString(f)) {
                    var el = document.getElementById("list-" + f + "-" + item.id);
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
             * Vue Lists component create new record method
             * 
             * @function mytodo.handlers.vue.tasks.create
             * @memberof mytodo
             * @param string
             *            lbl
             * @return Promise
             */
            create: function (lbl) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.tasks.insert((!mytodo.helper.types.isString(lbl) || !lbl) ? "List Item " + this.generateId() : lbl)
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        var o = mytodo.factory.make("lists");
                        for (var i in rd) {
                            var val = rd[i];
                            if (val !== undefined) {
                                if (Object.keys(rd).find(element => element === i) !== undefined) {
                                    o[i] = val;
                                }
                            }
                        }
                        mytodo.handlers.vue.$data.lists.push(o);
                    }
                });
            },
            /**
             * Vue Lists component delete a record
             * 
             * @function mytodo.handlers.vue.tasks.delete
             * @memberof mytodo
             * @param Object
             *            params
             * @return Promise
             */
            remove: function (item) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.lists.delete(item.id);
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        if (rd.hasOwnProperty("id")) {
                            var found = -1,
                                data = mytodo.handlers.vue.$data.lists;
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
             * Generate a number for a new list item based off the highest determined id
             * from the list and increment it by 1
             * 
             * @function generateId
             * @memberof mytodo
             * @return number|null
             */
            generateId: function () {
                var d = mytodo.handlers.vue.$data.lists;
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
        template: '<div class="flex-lists"><div v-for="item in items" :key="item.name" class="flex-list-child"><div class="t-list-header"><input :id="\'list-name-\' + item.id" type="text" :value="item.name" v-on:change="update(item, \'name\')"></input></div class="todo-task-toolbar"><div><button type="button" title="Create New Task" class="btn fas fa-plus-circle" v-on:click="app.handlers.vue.createTask(item)"></button><button type="button" title="Delete List" class="btn fas fa-trash" v-on:click="remove(item)"></button></div><div></div><todo-tasks :items="tasks" :list_id="item.id" :csrf="csrf" :dialog="dialog" :app="app"></todo-tasks></div></div>'
    });
}, mytodo, mytodo.allprops);