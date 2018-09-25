(function (com) {
    (function (jtm) {
        (function (admin) {
            (function (user) {
                var Index = (function (_super) {
                    __extends(Index, _super);
                    function Index() {
                        _super.call(this);
                        this.prefix = "adm";
                        this.searchMiningProjects = function () {
                            var thiss = this;
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + "admin/office/searchminingprojects",
                                ddl: thiss.$ddlMiningProject,
                                data: { id: thiss.$ddlOffice1.int32() }
                            });
                        };
                        this.searchUserOfficeMiningProjects = function () {
                            var thiss = this;
                            var options = {
                                data: {
                                    officeId: thiss.$ddlOffice1.int32(),
                                    id: thiss.$hdnId.int32()
                                }, validate: true, isJson: false
                            };
                            function validate() {
                                if (thiss.$ddloffice1.int32() == 0) {
                                    alert('Seleccione al menos un Area');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'admin/user/searchofficeminingprojects', options, function (items) {
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
                                thiss.$tblResultMiningProjects.find('>tbody').html(html);
                                thiss.$tblResultMiningProjects.find('>caption>span').html(thiss.$tblResultMiningProjects.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultMiningProjects);
                            });
                        };
                        this.deleteMiningProjects = function () {
                            var thiss = this;
                            var miningProjectIds = com.jtm.helper.Table.getItems(thiss.$tblResultMiningProjects, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningProjectIds: miningProjectIds, officeId: thiss.$ddlOffice1.int32() },
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
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'admin/user/deleteofficeminingprojects', options, function () { thiss.searchUserOfficeMiningProjects(); });
                        };
                        this.saveMiningProject = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningProjectId: thiss.$ddlMiningProject.int32(), officeId: thiss.$ddlOffice1.int32() },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (thiss.$ddlMiningProject.int32() == 0) {
                                    alert('Seleccione un proyecto minero');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.saveConfig(com.jtm.Server.contextPath + 'admin/user/saveofficeminingproject', options, function () { thiss.searchUserOfficeMiningProjects(); });
                        };
                        this.searchRoles = function () {
                            var thiss = this;
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + "admin/office/searchroles",
                                ddl: thiss.$ddlRoles,
                                data: { id: thiss.$ddlOffice2.int32(), }                                
                            });
                        };
                        this.searchUserOfficeRole = function () {
                            var thiss = this;
                            var options = {
                                data: {
                                    officeId: thiss.$ddlOffice2.int32(),
                                    id: thiss.$hdnId.int32()
                                }, validate: true, isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'admin/user/searchofficeroles', options, function (items) {
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
                                thiss.$tblResultRoles.find('>tbody').html(html);
                                thiss.$tblResultRoles.find('>caption>span').html(thiss.$tblResultRoles.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultRoles);
                            });
                        };
                        this.deleteOfficeRoles = function () {
                            var thiss = this;
                            var roleIds = com.jtm.helper.Table.getItems(thiss.$tblResultRoles, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), roleIds: roleIds, officeId: thiss.$ddlOffice2.int32() },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (roleIds.length === 0) {
                                    alert('Seleccione al menos un Rol');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'admin/user/deleteofficeroles', options, function () { thiss.searchUserOfficeRole(); });
                        };
                        this.saveOfficeRole = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32(), roleId: thiss.$ddlRoles.int32(), officeId: thiss.$ddlOffice2.int32() },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (thiss.$ddlRoles.int32() == 0) {
                                    alert('Seleccione un rol');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.saveConfig(com.jtm.Server.contextPath + 'admin/user/saveofficerole', options, function () { thiss.searchUserOfficeRole(); });
                        };
                    }

                    Index.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$txtUserName = thiss.$form.find("#txtUserName");
                            thiss.$txtFirstName = thiss.$form.find("#txtFirstName");
                            thiss.$txtLastName = thiss.$form.find("#txtLastName");
                            thiss.$txtMaidenName = thiss.$form.find("#txtMaidenName");
                            thiss.$ddlOffice1 = thiss.$form.find("#ddlOffice1");
                            thiss.$ddlMiningProject = thiss.$form.find("#ddlMiningProject");
                            thiss.$tblResultMiningProjects = thiss.$form.find("#tblResultMiningProjects");
                            thiss.$ddlOffice2 = thiss.$form.find("#ddlOffice2");
                            thiss.$ddlRoles = thiss.$form.find("#ddlRoles");
                            thiss.$tblResultRoles = thiss.$form.find("#tblResultRoles");
                            thiss.$btnAddMiningProject = thiss.$form.find("#btnAddMiningProject")
                            thiss.$btnDeleteMiningProjects = thiss.$form.find("#btnDeleteMiningProjects")
                            thiss.$btnAddRole = thiss.$form.find("#btnAddRole")
                            thiss.$btnDeleteRoles = thiss.$form.find("#btnDeleteRoles")
                            thiss.$ddlOffice1.off("change");
                            thiss.$ddlOffice1.on("change", function (e) {
                                thiss.searchMiningProjects();
                                thiss.searchUserOfficeMiningProjects();
                            });
                            thiss.$btnAddMiningProject.off("click");
                            thiss.$btnAddMiningProject.on("click", function (e) {
                                thiss.saveMiningProject();
                            });
                            thiss.$btnDeleteMiningProjects.off("click");
                            thiss.$btnDeleteMiningProjects.on("click", function (e) {
                                thiss.deleteMiningProjects();
                            });
                            thiss.$ddlOffice2.off("change");
                            thiss.$ddlOffice2.on("change", function (e) {
                                thiss.searchRoles();
                                thiss.searchUserOfficeRole();
                            });
                            thiss.$btnAddRole.off("click");
                            thiss.$btnAddRole.on("click", function (e) {
                                thiss.saveOfficeRole();
                            });
                            thiss.$btnDeleteRoles.off("click");
                            thiss.$btnDeleteRoles.on("click", function (e) {
                                thiss.deleteOfficeRoles();
                            });
                        };
                        _super.prototype.form.call(this, com.jtm.Server.contextPath + "admin/user/form2", id, options);
                    };
                    Index.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txtUserName.val(item.userName);
                            thiss.$txtFirstName.val(item.firstName);
                            thiss.$txtLastName.val(item.lastName);
                            thiss.$txtMaidenName.val(item.maidenName);
                            //thiss.$ddlOffice1.val(item.office.id);
                            //thiss.$ddlOffice1.trigger("change");
                            //thiss.$ddlMiningProject.val(item.office.id);
                            //thiss.$ddlMiningProject.trigger("change");
                            //thiss.$ddlOffice2.val(item.office.id);
                            //thiss.$ddlOffice2.trigger("change");
                        });
                    };
                    Index.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: 'userName',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: 'role.name',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'stateName',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Index.prototype.parameters = function () {
                        return {
                            userName: jQuery('#txtUserNameSearch').string(),
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Index.execute = function () {
                        var client = new Index();
                        client.load();
                    };
                    return Index;
                })(jtm.Master);
                user.Index = Index;
            })(admin.user || (admin.user = {}));
            var user = admin.user;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.user.Index.execute();