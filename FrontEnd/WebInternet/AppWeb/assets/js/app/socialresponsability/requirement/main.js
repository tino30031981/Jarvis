(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (directorate) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.formCoordination = function (id, title) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '60%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/requirement/formcoordination", function () {
                                thiss.$txtDateCoordination = thiss.$divPopup.find('#txtDateCoordination');
                                thiss.$txtNextStepCoordination = thiss.$divPopup.find('#txtNextStepCoordination');
                                thiss.$txtNextMeetingDateCoordination = thiss.$divPopup.find('#txtNextMeetingDateCoordination');
                                thiss.$txaRecommendationCoordination = thiss.$divPopup.find('#txaRecommendationCoordination');
                                thiss.$ddlActivityTypeCoordination = thiss.$divPopup.find("#ddlActivityTypeCoordination");
                                thiss.$hdnIdFormCoordination = thiss.$divPopup.find("#hdnIdFormCoordination");
                                thiss.$btnSaveCoordination = thiss.$divPopup.find('#btnSaveCoordination');
                                thiss.datePicker(thiss.$txtDateCoordination);
                                thiss.datePicker(thiss.$txtNextMeetingDateCoordination);
                                thiss.$btnSaveCoordination.off("click");
                                thiss.$btnSaveCoordination.on("click", function (e) {
                                    thiss.saveCoordination();
                                });
                                if (id > 0)
                                    thiss.detailCoordination(id);
                            });
                        };
                        this.deleteCoordinations = function () {
                            var thiss = this;
                            var coordinationIds = com.jtm.helper.Table.getItems(thiss.$tblResultCoordinations, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), coordinationIds: coordinationIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (coordinationIds.length === 0) {
                                    alert('Seleccione al menos una coordinación.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/requirement/deletecoordinations', options, function () { thiss.searchCoordinations(); });
                        };
                        this.saveCoordination = function () {
                            var thiss = this;
                            var item = {
                                date: thiss.$txtDateCoordination.date(),
                                nextStep: thiss.$txtNextStepCoordination.val(),
                                nextMeetingDate: thiss.$txtNextMeetingDateCoordination.date(),
                                recommendation: thiss.$txaRecommendationCoordination.val(),
                                activityType: { id: thiss.$ddlActivityTypeCoordination.int32() },
                                id: thiss.$hdnIdFormCoordination.int32()
                            };
                            var options = {
                                data: { id: thiss.$hdnId.int32(), item: item },
                                isJson: false,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/requirement/savecoordination', options, function () {
                                thiss.searchCoordinations();
                                thiss.$divPopup.dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtDateCoordination.val() === '') {
                                    success = false;
                                    message = 'Ingrese la fecha.';
                                    thiss.$txtDateCoordination.focus();
                                } else if (thiss.$ddlActivityTypeCoordination.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el tipo de actividad.';
                                    thiss.$ddlActivityTypeCoordination.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchCoordinations = function () {
                            var thiss = this;
                            thiss.$tblResultCoordinations.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/requirement/searchcoordinations', {
                                data: { id: thiss.$hdnId.int32(), }
                            }, function (items) {
                                console.log(items);
                                if (items === undefined || items === null || items.length === 0) return;
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.date + '</td>';
                                    html += '<td>' + item.activityType.name + '</td>';
                                    html += '<td>' + item.recommendation + '</td>';
                                    html += '<td>' + item.nextStep + '</td>';
                                    html += '<td>' + item.nextMeetingDate + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblResultCoordinations.find('>tbody').html(html);
                                thiss.$tblResultCoordinations.find('>caption>span').html(thiss.$tblResultCoordinations.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultCoordinations);
                            });
                        };
                        this.detailCoordination = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/coordination/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdFormCoordination.val(item.id);
                                thiss.$txtDateCoordination.val(item.date);
                                thiss.$txtNextStepCoordination.val(item.nextStep);
                                thiss.$txaRecommendationCoordination.val(item.recommendation);
                                thiss.$ddlActivityTypeCoordination.val(item.activityType.id === null ? 0 : item.activityType.id);
                                thiss.$txtNextMeetingDateCoordination.val(item.nextMeetingDate);
                            });
                        };
                        this.formParticipant = function () {
                            var thiss = this;
                            if (thiss.$hdnIdCoordination === 0) { alert('Debe seleccionar una fila de la coordinación'); return; }
                            thiss.$divPopup.dialog({
                                title: 'Añadir Participantes',
                                width: '40%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/coordination/formparticipant", function () {
                                thiss.$txaCommentParticipant = thiss.$divPopup.find('#txaCommentParticipant');
                                thiss.$ddlEmployeeParticipant = thiss.$divPopup.find("#ddlEmployeeParticipant");
                                thiss.$btnSaveParticipant = thiss.$divPopup.find('#btnSaveParticipant');
                                thiss.$btnSaveParticipant.off("click");
                                thiss.$btnSaveParticipant.on("click", function (e) {
                                    thiss.saveParticipant();
                                });
                            });
                        };
                        this.deleteParticipants = function () {
                            var thiss = this;
                            var participantIds = com.jtm.helper.Table.getItems(thiss.$tblResultParticipants, true, false);
                            var options = {
                                data: { id: thiss.$hdnIdCoordination.int32(), participantIds: participantIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (thiss.$hdnIdCoordination.int32() === 0) {
                                    alert('Debe seleccionar la coordinación.');
                                    return false;
                                } else if (participantIds.length === 0) {
                                    alert('Seleccione al menos un miembro.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/requirement/deletecoordinations', options, function () { thiss.searchParticipants(); });
                        };
                        this.saveParticipant = function () {
                            var thiss = this;
                            var item = {
                                comment: thiss.$txaCommentParticipant.val(),
                                employee: { id: thiss.$ddlEmployeeParticipant.int32() },
                                id: thiss.$hdnIdCoordination.int32()
                            };
                            console.log(item);
                            var options = {
                                data: { item: item },
                                isJson: false,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/coordination/saveparticipant', options, function () {
                                thiss.searchParticipants();
                                thiss.$divPopup.dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnIdCoordination.int32() === 0) {
                                    success = false;
                                    message = 'Debe seleccionar una coordinación.';
                                } else if (thiss.$ddlEmployeeParticipant.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el Responsable.';
                                    thiss.$ddlEmployeeParticipant.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchParticipants = function () {
                            var thiss = this;    
                            thiss.$tblResultParticipants.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            if (thiss.$hdnIdCoordination.int32() === 0) {
                                alert('No ha seleccionado una coordinación');
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/coordination/searchparticipants', {
                                data: { id: thiss.$hdnIdCoordination.int32() }, isJson: false
                            }, function (items) {
                                if (items === undefined || items === null || items.length === 0) {
                                    thiss.$tblResultParticipants.find('>caption>span').html(0);
                                    return;
                                }
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.employee.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.employee.id + '" value="' + item.employee.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.employee.name + '</td>';
                                    html += '<td>' + item.comment + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblResultParticipants.find('>tbody').html(html);
                                thiss.$tblResultParticipants.find('>caption>span').html(thiss.$tblResultParticipants.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultParticipants);
                            });
                        };
                    }
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$txtCodeSearch = this.$main.find("#txtCodeSearch");
                        this.$txtReceptionDateSearch = this.$main.find("#txtReceptionDateSearch");
                        this.$txtReceptionDateEndSearch = this.$main.find("#txtReceptionDateEndSearch");
                        this.$txtTargetDateSearch = this.$main.find("#txtTargetDateSearch");
                        this.$txtTargetDateEndSearch = this.$main.find("#txtTargetDateEndSearch");
                        this.$ddlActivityTypeSearch = this.$main.find("#ddlActivityTypeSearch");
                        this.$ddlEntitySearch = this.$main.find("#ddlEntitySearch");
                        this.$ddlPetitionerSearch = this.$main.find("#ddlPetitionerSearch");
                        this.$ddlMiningUnitSearch = this.$main.find("#ddlMiningUnitSearch");
                        this.$ddlDistrictSearch = this.$main.find("#ddlDistrictSearch");
                        this.$ddlProvinceSearch = this.$main.find("#ddlProvinceSearch");
                        this.$ddlDepartmentSearch = this.$main.find("#ddlDepartmentSearch");
                        this.$ddlNationalCartographySearch = this.$main.find("#ddlNationalCartographySearch");
                        this.$ddlHydrographicBasinSearch = this.$main.find("#ddlHydrographicBasinSearch");
                        this.$ddlSpatialReferenceSearch = this.$main.find("#ddlSpatialReferenceSearch");
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(thiss.$txtReceptionDateSearch);
                        thiss.datePicker(thiss.$txtReceptionDateEndSearch);
                        thiss.datePicker(thiss.$txtTargetDateSearch);
                        thiss.datePicker(thiss.$txtTargetDateEndSearch);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "socialresponsability/requirement/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "socialresponsability/requirement/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.$txtCode = thiss.$form.find("#txtCode");
                            thiss.$txtReceptionDate = thiss.$form.find("#txtReceptionDate");
                            thiss.$txtTargetDate = thiss.$form.find('#txtTargetDate');
                            thiss.$txtManualArea = thiss.$form.find('#txtManualArea');
                            thiss.$txtAuthorizedAmount = thiss.$form.find('#txtAuthorizedAmount');
                            thiss.$txaObservation = thiss.$form.find('#txaObservation');
                            thiss.$txaReason = thiss.$form.find('#txaReason');
                            thiss.$txaRecommendation = thiss.$form.find('#txaRecommendation');
                            thiss.$ddlActivityType = thiss.$form.find("#ddlActivityType");
                            thiss.$ddlEntity = thiss.$form.find("#ddlEntity");
                            thiss.$ddlPetitioner = thiss.$form.find("#ddlPetitioner");
                            thiss.$ddlProcessStatus = thiss.$form.find("#ddlProcessStatus");
                            thiss.$ddlPriority = thiss.$form.find("#ddlPriority");
                            thiss.$ddlCurrencyType = thiss.$form.find("#ddlCurrencyType");
                            thiss.$ddlNegotiationType = thiss.$form.find("#ddlNegotiationType");
                            thiss.$ddlMiningUnit = thiss.$form.find("#ddlMiningUnit");
                            thiss.$tblResultCoordinations = thiss.$form.find('#tblResultCoordinations');
                            thiss.$btnAddCoordination = thiss.$form.find('#btnAddCoordination');
                            thiss.$btnEditCoordination = thiss.$form.find('#btnEditCoordination');
                            thiss.$btnQuitCoordinations = thiss.$form.find('#btnQuitCoordinations');
                            thiss.$tblResultParticipants = thiss.$form.find('#tblResultParticipants');
                            thiss.$btnAddParticipant = thiss.$form.find('#btnAddParticipant');
                            thiss.$btnQuitParticipants = thiss.$form.find('#btnQuitParticipants');
                            thiss.$hdnIdCoordination = thiss.$form.find("#hdnIdCoordination");
                            thiss.datePicker(thiss.$txtReceptionDate);
                            thiss.datePicker(thiss.$txtTargetDate);
                            jQuery(thiss.$txtManualArea).numeric({ negative: false });
                            jQuery(thiss.$txtAuthorizedAmount).numeric({ negative: false, decimalPlaces: 2 });
                            thiss.$tblResultCoordinations.find('>tbody').off("dblclick", "> tr");
                            thiss.$tblResultCoordinations.find('>tbody').on("dblclick", "> tr", function (e) {
                                var id = jQuery(this).attr("data-uniqueid");
                                thiss.$hdnIdCoordination.val(id);
                                thiss.searchParticipants();
                            });
                            thiss.$btnAddCoordination.off("click");
                            thiss.$btnAddCoordination.on("click", function (e) {
                                thiss.formCoordination(0, "Añadir Coordinación");
                            });
                            thiss.$btnEditCoordination.off("click");
                            thiss.$btnEditCoordination.on("click", function (e) {
                                var id = thiss.getElementID(thiss.$tblResultCoordinations);
                                if (id > 0)
                                    thiss.formCoordination(id, "Editar Coordinación");
                                else
                                    toastr.info("Seleccione un elemento");
                            });
                            thiss.$btnQuitCoordinations.off("click");
                            thiss.$btnQuitCoordinations.on("click", function (e) {
                                thiss.deleteCoordinations();
                            });
                            thiss.$btnAddParticipant.off("click");
                            thiss.$btnAddParticipant.on("click", function (e) {
                                thiss.formParticipant();
                            });
                            thiss.$btnQuitParticipants.off("click");
                            thiss.$btnQuitParticipants.on("click", function (e) {
                                thiss.deleteParticipants();
                            });
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/requirement/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/requirement/searchdocuments",
                                $hdnId: thiss.$hdnId
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txtCode.val(item.code);
                            thiss.$txtReceptionDate.val(item.receptionDate);
                            thiss.$txtTargetDate.val(item.targetDate);
                            thiss.$txtManualArea.val(item.manualArea);
                            thiss.$txtAuthorizedAmount.val(item.authorizedAmount);
                            thiss.$txaObservation.val(item.observation);
                            thiss.$txaReason.val(item.reason);
                            thiss.$txaRecommendation.val(item.recommendation);
                            thiss.$ddlActivityType.val(item.activityType.id === null ? 0 : item.activityType.id);
                            thiss.$ddlProcessStatus.val(item.processStatus.id === null ? 0 : item.processStatus.id);
                            thiss.$ddlPetitioner.val(item.petitioner.id === null ? 0 : item.petitioner.id);
                            thiss.$ddlEntity.val(item.entity.id === null ? 0 : item.entity.id);
                            thiss.$ddlMiningUnit.val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            thiss.$ddlPriority.val(item.priority.id === null ? 0 : item.priority.id);
                            thiss.$ddlNegotiationType.val(item.negotiationType.id === null ? 0 : item.negotiationType.id);
                            thiss.$ddlCurrencyType.val(item.currencyType.id === null ? 0 : item.currencyType.id);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "socialresponsability/requirement/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "socialresponsability/requirement/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "socialresponsability/requirement/searchnationalcartographies", item.id, null);
                            thiss.searchCoordinations();
                            thiss.formAttachment.search(item.id);
                        });
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate();
                        data = {
                            id: thiss.$hdnId.int32(),
                            code: thiss.$txtCode.val(),
                            receptionDate: thiss.$txtReceptionDate.date(),
                            targetDate: thiss.$txtTargetDate.date(),
                            authorizedAmount: thiss.$txtAuthorizedAmount.val(),
                            manualArea: thiss.$txtManualArea.val(),
                            observation: thiss.$txaObservation.val(),
                            reason: thiss.$txaReason.val(),
                            recommendation: thiss.$txaRecommendation.val(),
                            activityType: { id: thiss.$ddlActivityType.int32() },
                            processStatus: { id: thiss.$ddlEntity.int32() },
                            petitioner: { id: thiss.$ddlPetitioner.int32() },
                            entity: { id: thiss.$ddlEntity.int32() },
                            miningUnit: { id: thiss.$ddlMiningUnit.int32() },
                            priority: { id: thiss.$ddlPriority.int32() },
                            negotiationType: { id: thiss.$ddlNegotiationType.int32() },
                            currencyType: { id: thiss.$ddlCurrencyType.int32() },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtCode.val() === '') {
                                success = false;
                                message = 'Ingrese el código.';
                                thiss.$txtCode.focus();
                            } else if (thiss.$ddlPetitioner.int32() === 0) {
                                success = false;
                                message = 'Seleccione el peticionario.';
                                thiss.$ddlPetitioner.focus();
                            } else if (thiss.$ddlMiningUnit.val() === '') {
                                success = false;
                                message = 'Seleccione la unidad minera.';
                                thiss.$ddlMiningUnit.focus();
                            } else if (thiss.$ddlEntity.int32() === 0) {
                                success = false;
                                message = 'Seleccione la comunidad.';
                                thiss.$ddlEntity.focus();
                            } else if (thiss.$txtAuthorizedAmount.val() === '') {
                                success = false;
                                message = 'Ingrese la monto.';
                                thiss.$txtAuthorizedAmount.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "code",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "receptionDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "targetDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "manualArea",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "activityType.name",
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
                            field: "currencyType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            code: thiss.$txtCodeSearch.val(),
                            targetDate: thiss.$txtTargetDateSearch.date(),
                            targetDateEnd: thiss.$txtTargetDateEndSearch.date(),
                            receptionDate: thiss.$txtReceptionDateSearch.date(),
                            receptionDateEnd: thiss.$txtReceptionDateEndSearch.date(),
                            activityType: { id: thiss.$ddlActivityTypeSearch.int32() },
                            entity: { id: thiss.$ddlEntitySearch.int32() },
                            petitioner: { id: thiss.$ddlPetitionerSearch.int32() },
                            miningUnit: { id: thiss.$ddlMiningUnitSearch.int32() },
                            district: {
                                id: thiss.$ddlDistrictSearch.val(),
                                province: {
                                    id: thiss.$ddlProvinceSearch.val(),
                                    department: {
                                        id: thiss.$ddlDepartmentSearch.val()
                                    }
                                }
                            },
                            nationalCartography: {
                                id: thiss.$ddlNationalCartographySearch.val()
                            },
                            hydrographicBasin: {
                                id: thiss.$ddlHydrographicBasinSearch.val()
                            },
                            spatialReference: {
                                id: thiss.$ddlSpatialReferenceSearch.int32()
                            },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                directorate.Main = Main;
            })(socialresponsability.directorate || (socialresponsability.directorate = {}));
            var directorate = socialresponsability.directorate;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.directorate.Main.execute();