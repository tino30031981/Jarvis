/// <reference path="Main.js" />
(function (com) {
    (function (jtm) {
        (function (admin) {
            (function (office) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "adm";
                        this.formRole = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Agregar Roles",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "admin/office/formrole", function () {
                                thiss.$tblResultRole2 = thiss.$divPopup.find("#tblResultRole2");
                                thiss.$txtNameSearchRole = thiss.$divPopup.find("#txtNameSearchRole");
                                thiss.$btnSaveRoles = thiss.$divPopup.find("#btnSaveRoles");
                                thiss.$btnSearchRoles = thiss.$divPopup.find("#btnSearchRoles");
                                thiss.$btnSaveRoles.off("click");
                                thiss.$btnSaveRoles.on("click", function (e) {
                                    thiss.saveRoles();
                                });
                                thiss.$btnSearchRoles.off("click");
                                thiss.$btnSearchRoles.on("click", function (e) {
                                    search();
                                });
                            });
                            function search() {
                                thiss.$tblResultRole2.find('>tbody').empty();
                                var data = {
                                    officeId: thiss.$hdnId.int32(),
                                    name: thiss.$txtNameSearchRole.string()
                                };
                                var parametersExist = com.jtm.helper.Table.getItems(thiss.$tblResultRole, false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'admin/role/searchforoffice', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    thiss.fillRoles(items, thiss.$tblResultRole2, parametersExist);
                                });
                            }
                        };
                        this.saveRoles = function () {
                            var thiss = this;
                            var roleIds = com.jtm.helper.Table.getItems(thiss.$tblResultRole2, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), roleIds: roleIds },
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'admin/office/saveroles', options, function (response) {
                                if (response.success) {
                                    thiss.searchRoles();
                                    thiss.$divPopup.dialog('close');
                                }
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (roleIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un rol.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchRoles = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'admin/office/searchroles', { data: { id: thiss.$hdnId.int32() } }, function (items) {
                                console.log(items);
                                thiss.fillRoles(items, thiss.$tblResultRole);
                            });
                        };
                        this.deleteRoles = function () {
                            var thiss = this;
                            var roleIds = com.jtm.helper.Table.getItems(thiss.$tblResultRole, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), roleIds: roleIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (roleIds.length === 0) {
                                    alert('Seleccione al menos un rol');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'admin/office/deleteroles', options, function () { thiss.searchRoles(); });
                        };
                        this.fillRoles = function (items, $tbl, parametersExist) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" >';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find('>tbody').html(html);
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                            if (parametersExist !== undefined) {
                                parametersExist.forEach(function (id) {
                                    $tbl.find('>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formMiningProject = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Agregar Proyecto Minero",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "admin/office/formminingproject", function () {
                                thiss.$txtCodeSearchMiningProject = thiss.$divPopup.find("#txtCodeSearchMiningProject");
                                thiss.$txtNameSearchMiningProject = thiss.$divPopup.find("#txtNameSearchMiningProject");
                                thiss.$btnSaveMiningProjects = thiss.$divPopup.find("#btnSaveMiningProjects");
                                thiss.$btnSearchMiningProjects = thiss.$divPopup.find("#btnSearchMiningProjects");
                                thiss.$tblResultMiningProject2 = thiss.$divPopup.find("#tblResultMiningProject2");
                                thiss.$btnSaveMiningProjects.off("click");
                                thiss.$btnSaveMiningProjects.on("click", function (e) {
                                    thiss.saveMiningProjects();
                                });
                                thiss.$btnSearchMiningProjects.off("click");
                                thiss.$btnSearchMiningProjects.on("click", function (e) {
                                    search();
                                });
                            });
                            function search() {
                                thiss.$tblResultMiningProject2.find('>tbody').empty();
                                var data = {
                                    officeId: thiss.$hdnId.int32(),
                                    code: thiss.$txtCodeSearchMiningProject.string(),
                                    name: thiss.$txtNameSearchMiningProject.string()
                                };
                                var parametersExist = com.jtm.helper.Table.getItems(thiss.$tblResultMiningProject, false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/searchforoffice', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    thiss.fillMiningProjects(items, thiss.$tblResultMiningProject2, parametersExist);
                                });
                            }
                        };
                        this.saveMiningProjects = function () {
                            var thiss = this;
                            var miningProjectIds = com.jtm.helper.Table.getItems(thiss.$tblResultMiningProject2, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningProjectIds: miningProjectIds },
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'admin/office/saveminingprojects', options, function (response) {
                                if (response.success) {
                                    thiss.searchMiningProjects();
                                    thiss.$divPopup.dialog('close');
                                }
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (miningProjectIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un proyecto minero.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchMiningProjects = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'admin/office/searchminingprojects', { data: { id: thiss.$hdnId.int32() } }, function (items) {
                                console.log(items);
                                thiss.fillMiningProjects(items, thiss.$tblResultMiningProject);
                            });
                        };
                        this.deleteMiningProjects = function () {
                            var thiss = this;
                            var miningProjectIds = com.jtm.helper.Table.getItems(thiss.$tblResultMiningProject, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningProjectIds: miningProjectIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (miningProjectIds.length === 0) {
                                    alert('Seleccione al menos un proyecto minero');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'admin/office/deleteminingprojects', options, function () { thiss.searchMiningProjects(); });
                        };
                        this.fillMiningProjects = function (items, $tbl, parametersExist) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" >';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find('>tbody').html(html);
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                            if (parametersExist !== undefined) {
                                parametersExist.forEach(function (id) {
                                    $tbl.find('>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                    }
                    Main.TBLRESULTROLE = '#tblResultRole';
                    Main.TBLMININGPROJECT = '#tblResultMiningProject';
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        var options = {};
                        options.callback = function () {
                            thiss.$btnAddRole = thiss.$form.find("#btnAddRole");
                            thiss.$btnDeleteRoles = thiss.$form.find("#btnDeleteRoles");
                            thiss.$btnAddMiningProject = thiss.$form.find("#btnAddMiningProject");
                            thiss.$btnDeleteMiningProject = thiss.$form.find("#btnDeleteMiningProjects");
                            thiss.$tblResultRole = thiss.$form.find(Main.TBLRESULTROLE);
                            thiss.$tblResultMiningProject = thiss.$form.find(Main.TBLMININGPROJECT);
                            thiss.$divPopup = thiss.$form.find("#divPopup");
                            thiss.$btnAddRole.off("click");
                            thiss.$btnAddRole.on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formRole();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            thiss.$btnDeleteRoles.off("click");
                            thiss.$btnDeleteRoles.on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteRoles();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            thiss.$btnAddMiningProject.off("click");
                            thiss.$btnAddMiningProject.on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formMiningProject();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            thiss.$btnDeleteMiningProject.off("click");
                            thiss.$btnDeleteMiningProject.on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteMiningProjects();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txtName.val(item.name);
                            thiss.$txaDescription.val(item.description);
                            thiss.$chkState.prop("checked", item.state);
                            thiss.searchRoles();
                            thiss.searchMiningProjects();
                        });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                office.Main = Main;
            })(admin.office || (admin.office = {}));
            var office = admin.office;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.office.Main.execute();