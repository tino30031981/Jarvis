(function (com) {
    (function (jtm) {
        (function (socialresponsability) {            
            (function (riskpopulation) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$btnAddMembers = null;
                        this.$btnQuitMembers = null;
                        this.$tblResultMembers = null;
                        this.$txtEvaluationDateSearch = null;
                        this.$txtEvaluationDateEndSearch = null;
                        this.$ddlConditionRiskPopulationSearch = null;
                        this.$ddlCommitmentLevelSearch = null;
                        this.$ddlPrioritySearch = null;
                        this.$txtEvaluationDate = null;
                        this.$ddlEntity = null;
                        this.$ddlConditionRiskPopulation = null;
                        this.$ddlCommitmentLevel = null;
                        this.$ddlPriority = null;
                        this.$txaComment = null;
                        this.formMembers = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Añadir Miembros",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/riskpopulation/formmembers", function () {
                                thiss.$ddlSettlerMember = thiss.$divPopup.find("#ddlSettlerMember");
                                thiss.$txtStartDateMember = thiss.$divPopup.find("#txtStartDateMember");
                                thiss.$txtEndDateMember = thiss.$divPopup.find("#txtEndDateMember");
                                thiss.$txtStartObservationMember = thiss.$divPopup.find("#txtStartObservationMember");
                                thiss.$txtEndObservationMember = thiss.$divPopup.find("#txtEndObservationMember");
                                thiss.$btnSaveMember = thiss.$divPopup.find("#btnSaveMember");
                                com.jtm.helper.DropDownList.fill({ url: com.jtm.Server.contextPath + "socialresponsability/settler/searchbyentities", ddl: thiss.$ddlSettlerMember, data: { id: thiss.$ddlEntity.int32() } });
                                thiss.datePicker(thiss.$txtStartDateMember);
                                thiss.datePicker(thiss.$txtEndDateMember);
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
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/riskpopulation/deletemembers', options, function () { thiss.searchMembers(); });
                        };
                        this.saveMember = function () {
                            var thiss = this;
                            var item = {
                                settler: { id: thiss.$ddlSettlerMember.int32() },
                                entity: { id: thiss.$ddlEntity.int32() },
                                id: thiss.$hdnId.int32(),//riskPopulation
                                startDate: thiss.$txtStartDateMember.val(),
                                endDate: thiss.$txtEndDateMember.val(),
                                startObservation: thiss.$txtStartObservationMember.val(),
                                endObservation: thiss.$txtEndObservationMember.val(),
                            };
                            var options = {
                                data: item,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/riskpopulation/savemember', options, function () {
                                thiss.searchMembers();
                                thiss.$divPopup.dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$ddlSettlerMember.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un Poblador.';
                                    $txaCommentMember.focus();
                                }                     
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
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/riskpopulation/searchmembers', {
                                data: { id: thiss.$hdnId.int32(), }
                            }, function (items) {
                                thiss.fillMembers(items, thiss.$tblResultMembers);
                            });
                        };
                        this.fillMembers = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            console.log(items);
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-entityid="' + item.entity.id + '"  data-settlerid="' + item.settler.id + '" >';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.entity.name + '</td>';
                                html += '<td>' + item.settler.name + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
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
                        this.$ddlConditionRiskPopulationSearch = this.$main.find("#ddlConditionRiskPopulationSearch");
                        this.$ddlCommitmentLevelSearch = this.$main.find("#ddlCommitmentLevelSearch");
                        this.$ddlPrioritySearch = this.$main.find("#ddlPrioritySearch");                        
                        _super.prototype.domConfig.call(this);
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        this.$txtEvaluationDateSearch = this.$main.find("#txtEvaluationDateSearch");
                        this.$txtEvaluationDateEndSearch = this.$main.find("#txtEvaluationDateEndSearch");
                        thiss.datePicker(thiss.$txtEvaluationDateSearch);
                        thiss.datePicker(thiss.$txtEvaluationDateEndSearch);
                        console.log("4");
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$txtEvaluationDate = thiss.$form.find("#txtEvaluationDate");
                            thiss.$ddlEntity = thiss.$form.find("#ddlEntity");
                            thiss.$ddlConditionRiskPopulation = thiss.$form.find("#ddlConditionRiskPopulation");
                            thiss.$ddlCommitmentLevel = thiss.$form.find("#ddlCommitmentLevel");
                            thiss.$ddlPriority = thiss.$form.find("#ddlPriority");
                            thiss.$txaComment = thiss.$form.find('#txaComment');                            
                            thiss.datePicker(thiss.$txtEvaluationDate);
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
                            thiss.$txtEvaluationDate.val(item.evaluationDate);
                            thiss.$txaComment.val(item.comment);
                            thiss.$ddlEntity.val(item.entity.id);
                            thiss.$ddlConditionRiskPopulation.val(item.conditionRiskPopulation.id === null ? 0 : item.conditionRiskPopulation.id);
                            thiss.$ddlCommitmentLevel.val(item.commitmentLevel.id === null ? 0 : item.commitmentLevel.id);
                            thiss.$ddlPriority.val(item.priority.id === null ? 0 : item.priority.id);
                            thiss.searchMembers();
                        });                        
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "evaluationDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "conditionRiskPopulation.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "commitmentLevel.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "priority.name",
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
                            evaluationDate: thiss.$txtEvaluationDate.date(),
                            comment: thiss.$txaComment.val(),
                            entity: { id: thiss.$ddlEntity.int32() },
                            conditionRiskPopulation: { id: thiss.$ddlConditionRiskPopulation.int32() },
                            commitmentLevel: { id: thiss.$ddlCommitmentLevel.int32() },
                            priority: { id: thiss.$ddlPriority.int32() },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtEvaluationDate.val() === '') {
                                success = false;
                                message = 'Ingrese fecha de evaluación.';
                                thiss.$txtEvaluationDate.focus();
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
                            evaluationDate: thiss.$txtEvaluationDateSearch.date(),
                            evaluationDateEnd: thiss.$txtEvaluationDateEndSearch.date(),
                            conditionRiskPopulation: { id: thiss.$ddlConditionRiskPopulationSearch.int32() },
                            commitmentLevel: { id: thiss.$ddlCommitmentLevelSearch.int32() },
                            priority: { id: thiss.$ddlPrioritySearch.int32() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                riskpopulation.Main = Main;
            })(socialresponsability.riskpopulation || (socialresponsability.riskpopulation = {}));
            var riskpopulation = socialresponsability.riskpopulation;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.riskpopulation.Main.execute();