/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name dialog.js
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */
mytodo.waitForMe(function () {
            mytodo.handlers.dialogs.default = {
                id: "modal-edit-task",
                record: null,
                close: function () {
                    var el = document.getElementById(this.id);
                    if (el) {
                        el.classList.remove("is-open");
                    }
                },
                open: function () {
                    var el = document.getElementById(this.id);
                    if (el) {
                        el.classList.remove("is-open");
                        el.classList.add("is-open");
                    }
                },
                resetForm: function() {
                    var els = document.querySelectorAll("#" + this.id + " input");
                    els.forEach((el) => {
                        el.value = null;
                    });
                },
                loadRecord: function (item) {
                    this.record = null;
                    if (mytodo.helper.types.isObject(item) && item) {
                        this.resetForm();
                        this.record = item;
                        var myId = item.id.toString();
                        if (item.id)
                            document.getElementById("edit-task-input-hidden-id").value = item.id;
                        if (item.list_id)
                            document.getElementById("edit-task-input-hidden-list-id").value = item.list_id;
                        if (item.label)
                            document.getElementById("edit-task-input-label").value = item.label;
                        if (item.due_date)
                            document.getElementById("edit-task-input-date").value = item.due_date;
                        if (item.priority)
                            document.getElementById("edit-task-input-priority").value = (item.priority) ? item.priority : document.getElementById("edit-task-input-priorit").value;
                        if (item.description)
                            document.getElementById("edit-task-input-description").value = item.description;

                    }
                },
                saveChanges: function () {
                    if (this.record !== null) {
                        var fd = new FormData();
                        var myId = this.record.id;
                        var item = this.record;
                        fd.append("id", myId);
                        var el = document.getElementById("edit-task-input-label");
                        if (el)
                            fd.append("label", (el.value && mytodo.helper.types.isString(el.value)) ? el.value : item.label);
                        el = document.getElementById("edit-task-input-date");
                        if (el)
                            fd.append("due_date", el.value);
                        el = document.getElementById("edit-task-input-priority");
                        if (el)
                            fd.append("priority", (!isNaN(el.value)) ? el.value : item.priority);
                        el = document.getElementById("edit-task-input-description");
                        if (el)
                            fd.append("description", (el.value && mytodo.helper.types.isString(el.value)) ? el.value : item.description);
                        var that = this;
                        mytodo.handlers.ajax.standardAjaxHandler(() => {
                            return mytodo.apis.tasks.update(fd);
                        }).then((resolved) => {
                            if (resolved.hasOwnProperty("data")) {
                                var rd = JSON.parse(resolved.data);
                                mytodo.handlers.vue.$data.tasks.forEach((i, index) => {
                                    if (i.id === rd.id) {
                                        var d = JSON.stringify(rd);
                                        Vue.set(mytodo.handlers.vue.tasks, index, JSON.parse(d))
                                    }
                                });
                                mytodo.handlers.vue.$forceUpdate();
                                that.close();
                                that.record = null;
                            }
                        });
                    }
                }
            }
            }, mytodo, mytodo.allprops);