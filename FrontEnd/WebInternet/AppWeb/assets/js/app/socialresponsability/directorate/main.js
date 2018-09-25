(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (directorate) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);                        
                        this.$btnAddMembers = null;
                        this.$btnQuitMembers = null;
                        this.$tblResultMembers = null;
                        this.$txtStartDateSearch = null;
                        this.$txtStartDateEndSearch = null;
                        this.$txtEndDateSearch = null;
                        this.$txtEndDateEndSearch = null;
                        this.$ddlEntitySearch = null;
                        this.$ddlLevelInfluenceSearch = null;
                        this.$ddlRegistryOfficeSearch = null;
                        this.$chkIsCurrent = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                        this.$txaComment = null;
                        this.$txtFoja = null;
                        this.$txtGrantDate = null;
                        this.$txtCertificate = null;
                        this.$txtResolution=null;
                        this.$ddlEntity = null;
                        this.$ddlLevelInfluence = null;
                        this.$ddlRegistryOffice = null;                        
                        this.formMembers = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Añadir Miembros",
                                width: '650',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });                            
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/directorate/formmembers", function () {
                                thiss.$ddlSettlerMember = thiss.$divPopup.find("#ddlSettlerMember");
                                thiss.$ddlLevelInfluencelMember = thiss.$divPopup.find("#ddlLevelInfluencelMember");
                                thiss.$ddlPositionMember = thiss.$divPopup.find("#ddlPositionMember");
                                thiss.$txaCommentMember = thiss.$divPopup.find("#txaCommentMember");
                                thiss.$btnSaveMember = thiss.$divPopup.find("#btnSaveMember");
                                com.jtm.helper.DropDownList.fill({ url: com.jtm.Server.contextPath + "socialresponsability/settler/searchbyentities", ddl: thiss.$ddlSettlerMember, data: { id: thiss.$ddlEntity.int32() } });
                                thiss.$btnSaveMember.off("click");
                                thiss.$btnSaveMember.on("click", function (e) {
                                    thiss.saveMember();
                                });
                            });
                        };
                        this.deleteMembers = function () {
                            var thiss = this;
                            var entityId = thiss.$tblResultMembers.find(">tbody>tr").attr("data-entityid");
                            var settlerIds = [];
                            thiss.$tblResultMembers.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');                                
                                settlerIds.push($tr.attr('data-settlerid'));                      
                            });                            
                            var options = {
                                data: { id: thiss.$hdnId.int32(), settlerIds: settlerIds, entityId: entityId },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (settlerIds.length === 0) {
                                    alert('Seleccione al menos un miembro.');
                                    return false;
                                } else
                                    return true;
                            }                            
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/directorate/deletemembers', options, function () { thiss.searchMembers(); });
                        };
                        this.saveMember = function () {
                            var thiss = this;
                            var item = {
                                settler: { id: thiss.$ddlSettlerMember.int32() },
                                entity: { id: thiss.$ddlEntity.int32() },
                                id: thiss.$hdnId.int32(),//directorate
                                comment: thiss.$txaCommentMember.val(),
                                position: { id: thiss.$ddlPositionMember.int32() },
                                levelInfluence: { id: thiss.$ddlLevelInfluencelMember.int32() },
                            };
                            var options = {
                                data: item,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/directorate/savemember', options, function () {
                                thiss.searchMembers();
                                thiss.$divPopup.dialog('close');                                
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                //if $txaCommentMember.string() === '') {
                                //    success = false;
                                //    message = 'Ingrese el Cargo.';
                                //    $txaCommentMember.focus();
                                //}                     
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchMembers = function () {
                            var thiss = this;
                            thiss.$tblResultMembers.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/directorate/searchmembers', {
                                data: { id: thiss.$hdnId.int32(), }
                            }, function (items) {
                                thiss.fillMembers(items, thiss.$tblResultMembers);
                            });
                        };
                        this.fillMembers = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-entityid="' + item.entity.id + '"  data-settlerid="' + item.settler.id + '" >';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';                               
                                html += '<td>' + item.entity.name + '</td>';
                                html += '<td>' + item.settler.name + '</td>';
                                html += '<td>' + item.position.name + '</td>';
                                html += '<td>' + item.levelInfluence.name + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find('>tbody').html(html);
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                    }
                    Main.TBLRESULTMEMBERS = '#tblResultMembers';
                    Main.BTNADDMEMBERS = '#btnAddMembers';
                    Main.BTNQUITMEMBERS = '#btnQuitMembers';
                    Main.prototype.domConfig = function () {
                        var thiss = this;                       
                        this.$ddlEntitySearch = this.$main.find("#ddlEntitySearch");
                        this.$ddlLevelInfluenceSearch = this.$main.find("#ddlLevelInfluenceSearch");
                        this.$ddlRegistryOfficeSearch = this.$main.find("#ddlRegistryOfficeSearch");
                        _super.prototype.domConfig.call(this);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        this.$txtStartDateSearch = this.$main.find("#txtStartDateSearch");
                        this.$txtStartDateEndSearch = this.$main.find("#txtStartDateEndSearch");
                        this.$txtEndDateSearch = this.$main.find("#txtEndDateSearch");
                        this.$txtEndDateEndSearch = this.$main.find("#txtEndDateEndSearch");
                        thiss.datePicker(thiss.$txtStartDateSearch);
                        thiss.datePicker(thiss.$txtStartDateEndSearch);
                        thiss.datePicker(thiss.$txtEndDateSearch);
                        thiss.datePicker(thiss.$txtEndDateEndSearch);                        
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$chkIsCurrent = thiss.$form.find("#chkIsCurrent");
                            thiss.$txtStartDate = thiss.$form.find("#txtStartDate");
                            thiss.$txtEndDate = thiss.$form.find("#txtEndDate");
                            thiss.$txaComment = thiss.$form.find("#txaComment");
                            thiss.$txtFoja = thiss.$form.find("#txtFoja");
                            thiss.$txtGrantDate = thiss.$form.find("#txtGrantDate");
                            thiss.$txtCertificate = thiss.$form.find('#txtCertificate');
                            thiss.$txtResolution = thiss.$form.find('#txtResolution');
                            thiss.$ddlEntity = thiss.$form.find("#ddlEntity");
                            thiss.$ddlLevelInfluence = thiss.$form.find("#ddlLevelInfluence");
                            thiss.$ddlRegistryOffice = thiss.$form.find("#ddlRegistryOffice");
                            thiss.datePicker(thiss.$txtStartDate);
                            thiss.datePicker(thiss.$txtEndDate);
                            thiss.datePicker(thiss.$txtGrantDate);
                            thiss.$tblResultMembers = thiss.$form.find(Main.TBLRESULTMEMBERS);
                            thiss.$btnAddMembers = thiss.$form.find(Main.BTNADDMEMBERS);
                            thiss.$btnQuitMembers = thiss.$form.find(Main.BTNQUITMEMBERS);
                            thiss.$btnAddMembers.off("click");
                            thiss.$btnAddMembers.on("click", function (e) {
                                thiss.formMembers();
                            });
                            thiss.$btnQuitMembers.off("click");
                            thiss.$btnQuitMembers.on("click", function (e) {
                                thiss.deleteMembers();
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
                            thiss.$chkIsCurrent.prop("checked", item.isCurrent);
                            thiss.$txtStartDate.val(item.startDate);
                            thiss.$txtEndDate.val(item.endDate);
                            thiss.$txaComment.val(item.comment);
                            thiss.$txtFoja.val(item.publicRecord.foja);
                            thiss.$txtGrantDate.val(item.publicRecord.grantDate);
                            thiss.$txtCertificate.val(item.publicRecord.certificate);
                            thiss.$txtResolution.val(item.publicRecord.resolution);
                            thiss.$ddlEntity.val(item.entity.id);
                            thiss.$ddlLevelInfluence.val(item.levelInfluence.id === null ? 0 : item.levelInfluence.id);
                            thiss.$ddlRegistryOffice.val(item.registryOffice.id === null ? 0 : item.registryOffice.id);
                            thiss.searchMembers();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "startDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "endDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "entity.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "levelInfluence.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "registryOffice.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.val(),
                            isCurrent: thiss.$chkIsCurrent.boolean(),
                            startDate: thiss.$txtStartDate.date(),
                            endDate: thiss.$txtEndDate.date(),
                            comment: thiss.$txaComment.val(),
                            publicRecord: { foja: thiss.$txtFoja.val(), grantDate: thiss.$txtGrantDate.val(), certificate: thiss.$txtCertificate.val(), resolution: thiss.$txtResolution.val() },
                            entity: { id: thiss.$ddlEntity.int32() },
                            levelInfluence: { id: thiss.$ddlLevelInfluence.int32() },
                            registryOffice: { id: thiss.$ddlRegistryOffice.int32() },
                            state: thiss.$chkState.boolean()
                        };                        
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtName.val() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                thiss.$txtName.focus();
                            } else if (thiss.$txtStartDate.val() === '') {
                                success = false;
                                message = 'Ingrese fecha inicio.';
                                thiss.$txtStartDate.val();
                            } else if (thiss.$txtEndDate.val() === '') {
                                success = false;
                                message = 'Ingrese fecha fin.';
                                thiss.$txtEndDate.focus();
                            } else if (thiss.$ddlEntity.int32() === 0) {
                                success = false;
                                message = 'Seleccione una comunidad u otro.';
                                thiss.$ddlEntity.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }                       
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            name: thiss.$txtNameSearch.val(),
                            startDate: thiss.$txtStartDateSearch.date(),
                            startDateEnd: thiss.$txtStartDateEndSearch.date(),
                            endDate: thiss.$txtEndDateSearch.date(),
                            endDateEnd: thiss.$txtEndDateEndSearch.date(),
                            entity: { id: thiss.$ddlEntitySearch.int32() },
                            levelInfluence: { id: thiss.$ddlLevelInfluenceSearch.int32() },
                            registryOffice: { id: thiss.$ddlRegistryOfficeSearch.int32() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                directorate.Main = Main;
            })(socialresponsability.directorate || (socialresponsability.directorate = {}));
            var directorate = socialresponsability.directorate;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.directorate.Main.execute();