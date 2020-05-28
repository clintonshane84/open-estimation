/*
 * Initializes the VueJS app
 * 
 * @name final.js
 * @namespace mytodo
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */
mytodo.waitForMe(() => {
    mytodo.handlers.vue = new Vue({
        el: "#list-app",
        data: {
            lists: [],
            tasks: [],
            app : mytodo,
            csrf: mytodo.csrfToken,
            dialogm : mytodo.handlers.dialogs
        },
        delimiters: ["${", "}"],
        methods: {
            /**
             * Vue Lists component delete a record
             * 
             * @function mytodo.handlers.vue.tasks.delete
             * @memberof mytodo
             * @param Object
             *            params
             * @return Promise
             */
            createTask: function (item) {
                return mytodo.handlers.dialogs.alertify.prompt.open('Label', 'Create New Task', (evt, value) => {
                    mytodo.apis.tasks.insert(value, item.id).then((res) => {
                        if (res.hasOwnProperty("data")) {
                            var rd = JSON.parse(res.data);
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
                    }, (rej) => {
                        
                    })

                },
                     () => {mytodo.handlers.dialogs.alertify.error('Cancelled')}
                );
            },
            createList : function(name) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.lists.insert(name);
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
            /*
             * Runs all the available api calls to fetch the data for the
             * objects we need asynchronously
             * 
             * @function load
             */
            load: async () => {
                var d = [];
                for (i in mytodo.handlers.vue.$data) {
                    if (mytodo.helper.types.isArray((mytodo.handlers.vue.$data[i])))
                        d.push(i);
                }
                // Using Promise.all run all the api calls for the objects available in var d
                const status = await Promise.all(d.map(async name => await mytodo.handlers.vue.loadData(name)));
            },
            /*
             * Runs all the available api calls to fetch the data for the
             * objects we need asynchronously
             * 
             * @function load
             * @param string n
             * @return Promise
             */
            loadData: function (n) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis[n].getAll();
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        mytodo.handlers.vue.$data[n] = [];
                        if (rd.length > 0) {
                            for (var i in rd) {
                                var t = rd[i];
                                var o = mytodo.factory.make(i);
                                o = JSON.parse(JSON.stringify(t));
                                mytodo.handlers.vue.$data[n].push(o);
                            }
                        }
                    }
                });
            }
        }
    });
    (() => {
        mytodo.handlers.vue.load();
    })();
}, mytodo, mytodo.allprops);