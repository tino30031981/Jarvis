(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (negotiation) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$ddlEntitySearch = null;
                        this.$ddlNegotiationStatusSearch = null;
                        this.$ddlEmployeeSearch = null;
                        this.$ddlRequirementSearch = null;
                        this.$chkToRelocateSearch = null;
                        this.$ddlEntity = null;
                        this.searchLegalEvaluations = function () {
                            var thiss = this;
                            thiss.$tblResultLegalEvaluations.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchlegalevaluations', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillLegalEvaluations(items, thiss.$tblResultLegalEvaluations);
                            });
                        };
                        this.fillLegalEvaluations = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + item.code + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + item.registryDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + item.levelEvaluationStatus.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + item.area.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-legalevaluationid= "' + item.id + '">' + item.targetDate + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formLegalEvaluation = function (idLegalEvaluation, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '70%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formlegalevaluation", function () {
                                thiss.$btnSaveLegalEvaluation = thiss.$divPopup.find('#btnSaveLegalEvaluation');
                                thiss.$hdnIdLegalEvaluation = thiss.$divPopup.find('#hdnIdLegalEvaluation');
                                thiss.$txtCodeLegalEvaluation = thiss.$divPopup.find('#txtCodeLegalEvaluation');
                                thiss.$txtRegistryDateLegalEvaluation = thiss.$divPopup.find('#txtRegistryDateLegalEvaluation');
                                thiss.$txtTargetDateLegalEvaluation = thiss.$divPopup.find('#txtTargetDateLegalEvaluation');
                                thiss.$txaRecommendationLegalEvaluation = thiss.$divPopup.find('#txaRecommendationLegalEvaluation');
                                thiss.$txaCommentLegalEvaluation = thiss.$divPopup.find('#txaCommentLegalEvaluation');
                                thiss.$ddlAreaLegalEvaluation = thiss.$divPopup.find('#ddlAreaLegalEvaluation');
                                thiss.$ddlLevelEvaluationStatusLegalEvaluation = thiss.$divPopup.find('#ddlLevelEvaluationStatusLegalEvaluation');
                                thiss.$chkTracingLegalEvaluation = thiss.$divPopup.find('#chkTracingLegalEvaluation');
                                thiss.datePicker(thiss.$txtRegistryDateLegalEvaluation);
                                thiss.datePicker(thiss.$txtTargetDateLegalEvaluation);
                                if (idLegalEvaluation > 0)
                                    thiss.detailLegalEvaluation(idLegalEvaluation);
                                thiss.$btnSaveLegalEvaluation.off("click");
                                thiss.$btnSaveLegalEvaluation.on("click", function (e) {
                                    thiss.saveLegalEvaluations();
                                });
                            });
                        };
                        this.saveLegalEvaluations = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdLegalEvaluation.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                code: thiss.$txtCodeLegalEvaluation.val(),
                                registryDate: thiss.$txtRegistryDateLegalEvaluation.date(),
                                targetDate: thiss.$txtTargetDateLegalEvaluation.date(),
                                recommendation: thiss.$txaRecommendationLegalEvaluation.val(),
                                comment: thiss.$txaCommentLegalEvaluation.val(),
                                area: { id: thiss.$ddlAreaLegalEvaluation.int32() },
                                levelEvaluationStatus: { id: thiss.$ddlLevelEvaluationStatusLegalEvaluation.int32() },
                                tracing: thiss.$chkTracingLegalEvaluation.boolean(),
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/legalevaluation/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchLegalEvaluations();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtCodeLegalEvaluation.val() === '') {
                                    success = false;
                                    message = 'Ingrese un código.';
                                    thiss.$txtCodeLegalEvaluation.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailLegalEvaluation = function (idLegalEvaluation) {
                            var thiss = this;
                            var options = {
                                data: { id: idLegalEvaluation },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/legalevaluation/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdLegalEvaluation.val(item.id);
                                thiss.$txtCodeLegalEvaluation.val(item.code);
                                thiss.$txtRegistryDateLegalEvaluation.val(item.registryDate);
                                thiss.$txtTargetDateLegalEvaluation.val(item.targetDate);
                                thiss.$txaRecommendationLegalEvaluation.val(item.recommendation);
                                thiss.$txaCommentLegalEvaluation.val(item.comment);
                                thiss.$ddlAreaLegalEvaluation.val(item.area.id);
                                thiss.$ddlLevelEvaluationStatusLegalEvaluation.val(item.levelEvaluationStatus.id === null ? 0 : item.levelEvaluationStatus.id);
                                thiss.$chkTracingLegalEvaluation.prop("checked", item.tracing);
                            });
                        };
                        this.deleteLegalEvaluations = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var legalEvaluationsIds = com.jtm.helper.Table.getItems(thiss.$tblResultLegalEvaluations, true, false);
                            var options = {
                                data: { legalEvaluationsIds: legalEvaluationsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deletelegalevaluations', options, function () { thiss.searchLegalEvaluations(); });
                            function validate() {
                                if (legalEvaluationsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.searchActivities = function () {
                            var thiss = this;
                            thiss.$tblResultActivities.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchactivities', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillActivities(items, thiss.$tblResultActivities);
                            });
                        };
                        this.fillActivities = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + item.date + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + item.activityType.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + item.place + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + item.reason + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-activityid= "' + item.id + '">' + item.summary + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formActivity = function (idActivity, title) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '80%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formactivity", function () {
                                thiss.$btnSaveActivity = thiss.$divPopup.find('#btnSaveActivity');
                                thiss.$hdnIdActivity = thiss.$divPopup.find('#hdnIdActivity');
                                thiss.$txtDateActivity = thiss.$divPopup.find('#txtDateActivity');
                                thiss.$txtReasonActivity = thiss.$divPopup.find('#txtReasonActivity');
                                thiss.$txtPlaceActivity = thiss.$divPopup.find('#txtPlaceActivity');
                                thiss.$txtProposalActivity = thiss.$divPopup.find('#txtProposalActivity');
                                thiss.$txaSummaryActivity = thiss.$divPopup.find('#txaSummaryActivity');
                                thiss.$txtCounterProposalActivity = thiss.$divPopup.find('#txtCounterProposalActivity');
                                thiss.$txtSignatureDateActivity = thiss.$divPopup.find('#txtSignatureDateActivity');
                                thiss.$txtNextStepActivity = thiss.$divPopup.find('#txtNextStepActivity');
                                thiss.$txtNextMeetingDateActivity = thiss.$divPopup.find('#txtNextMeetingDateActivity');
                                thiss.$txaDescriptionDocumentActivity = thiss.$divPopup.find('#txaDescriptionDocumentActivity');
                                thiss.$ddlActivityTypeActivity = thiss.$divPopup.find('#ddlActivityTypeActivity');
                                thiss.datePicker(thiss.$txtDateActivity);
                                thiss.datePicker(thiss.$txtSignatureDateActivity);
                                thiss.datePicker(thiss.$txtNextMeetingDateActivity);
                                if (idActivity > 0)
                                    thiss.detailActivity(idActivity);
                                thiss.$btnSaveActivity.off("click");
                                thiss.$btnSaveActivity.on("click", function (e) {
                                    thiss.saveActivities();
                                });
                            });
                        };
                        this.saveActivities = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdActivity.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                date: thiss.$txtDateActivity.date(),
                                reason: thiss.$txtReasonActivity.val(),
                                place: thiss.$txtPlaceActivity.val(),
                                proposal: thiss.$txtProposalActivity.val(),
                                summary: thiss.$txaSummaryActivity.val(),
                                counterproposal: thiss.$txtCounterProposalActivity.val(),
                                signaturedate: thiss.$txtSignatureDateActivity.date(),
                                nextstep: thiss.$txtNextStepActivity.val(),
                                nextmeetingdate: thiss.$txtNextMeetingDateActivity.date(),
                                descriptiondocument: thiss.$txaDescriptionDocumentActivity.val(),
                                activityType: { id: thiss.$ddlActivityTypeActivity.int32() },
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/activity/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchActivities();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtReasonActivity.val() === '') {
                                    success = false;
                                    message = 'Ingrese una motivo.';
                                    thiss.$txtReasonActivity.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailActivity = function (idActivity) {
                            var thiss = this;
                            var options = {
                                data: { id: idActivity },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/activity/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdActivity.val(item.id);
                                thiss.$txtDateActivity.val(item.date);
                                thiss.$txtReasonActivity.val(item.reason);
                                thiss.$txtPlaceActivity.val(item.place);
                                thiss.$txtProposalActivity.val(item.proposal);
                                thiss.$txaSummaryActivity.val(item.summary);
                                thiss.$txtCounterProposalActivity.val(item.counterProposal);
                                thiss.$txtSignatureDateActivity.val(item.signatureDate);
                                thiss.$txtNextStepActivity.val(item.nextStep);
                                thiss.$txtNextMeetingDateActivity.val(item.nextMeetingDate);
                                thiss.$txaDescriptionDocumentActivity.val(item.descriptionDocument);
                                thiss.$ddlActivityTypeActivity.val(item.activityType.id === null ? 0 : item.activityType.id);
                            });
                        };
                        this.deleteActivities = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var activitiesIds = com.jtm.helper.Table.getItems(thiss.$tblResultActivities, true, false);
                            var options = {
                                data: { activitiesIds: activitiesIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deleteactivities', options, function () { thiss.searchActivities(); });
                            function validate() {
                                if (activitiesIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.searchCommissionCompanies = function () {
                            var thiss = this;
                            thiss.$tblResultCommissionCompanies.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchcommissioncompanies', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillCommissionCompanies(items, thiss.$tblResultCommissionCompanies);
                            });
                        };
                        this.fillCommissionCompanies = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + item.employee.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + item.startDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + item.endDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + item.observation + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissioncompanyid= "' + item.id + '">' + item.levelInfluence.name + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formCommissionCompany = function (idCommissionCompany, title) {
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formcommissioncompany", function () {
                                thiss.$btnSaveCommissionCompany = thiss.$divPopup.find('#btnSaveCommissionCompany');
                                thiss.$hdnIdCommissionCompany = thiss.$divPopup.find('#hdnIdCommissionCompany');
                                thiss.$txtStartDateCommissionCompany = thiss.$divPopup.find('#txtStartDateCommissionCompany');
                                thiss.$txtEndDateCommissionCompany = thiss.$divPopup.find('#txtEndDateCommissionCompany');
                                thiss.$txaObservationCommissionCompany = thiss.$divPopup.find('#txaObservationCommissionCompany');
                                thiss.$ddlEmployeeCommissionCompany = thiss.$divPopup.find('#ddlEmployeeCommissionCompany');
                                thiss.$ddlLevelInfluenceCommissionCompany = thiss.$divPopup.find('#ddlLevelInfluenceCommissionCompany');
                                thiss.datePicker(thiss.$txtStartDateCommissionCompany);
                                thiss.datePicker(thiss.$txtEndDateCommissionCompany);
                                if (idCommissionCompany > 0)
                                    thiss.detailCommissionCompany(idCommissionCompany);
                                thiss.$btnSaveCommissionCompany.off("click");
                                thiss.$btnSaveCommissionCompany.on("click", function (e) {
                                    thiss.saveCommissionCompanies();
                                });
                            });
                        };
                        this.saveCommissionCompanies = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdCommissionCompany.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                startDate: thiss.$txtStartDateCommissionCompany.date(),
                                endDate: thiss.$txtEndDateCommissionCompany.date(),
                                observation: thiss.$txaObservationCommissionCompany.val(),
                                employee: { id: thiss.$ddlEmployeeCommissionCompany.int32() },
                                levelInfluence: { id: thiss.$ddlLevelInfluenceCommissionCompany.int32() },
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/commissioncompany/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchCommissionCompanies();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$ddlEmployeeCommissionCompany.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un empleado.';
                                    thiss.$ddlEmployeeCommissionCompany.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailCommissionCompany = function (idCommissionCompany) {
                            var thiss = this;
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), employeeId: idCommissionCompany },
                                isJson: false,
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/commissioncompany/detail2', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdCommissionCompany.val(item.employee.id);
                                thiss.$txtStartDateCommissionCompany.val(item.startDate);
                                thiss.$txtEndDateCommissionCompany.val(item.endDate);
                                thiss.$txaObservationCommissionCompany.val(item.observation);
                                thiss.$ddlEmployeeCommissionCompany.prop('disabled', true);
                                thiss.$ddlEmployeeCommissionCompany.val(item.employee.id);
                                thiss.$ddlLevelInfluenceCommissionCompany.val(item.levelInfluence.id);
                            });
                        };
                        this.deleteCommissionCompanies = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var commissionCompaniesIds = com.jtm.helper.Table.getItems(thiss.$tblResultCommissionCompanies, true, false);
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), employeesIds: commissionCompaniesIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deletecommissioncompanies', options, function () { thiss.searchCommissionCompanies(); });
                            function validate() {
                                if (commissionCompaniesIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.searchCoordinations = function () {
                            var thiss = this;
                            thiss.$tblResultCoordinations.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchcoordinations', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillCoordinations(items, thiss.$tblResultCoordinations);
                            });
                        };
                        this.fillCoordinations = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + item.date + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + item.activityType.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + item.recommendation + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + item.nextStep + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-coordinationid= "' + item.id + '">' + item.nextMeetingDate + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formCoordination = function (idCoordination, title) {
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formcoordination", function () {
                                thiss.$btnSaveCoordination = thiss.$divPopup.find('#btnSaveCoordination');
                                thiss.$hdnIdCoordination = thiss.$divPopup.find('#hdnIdCoordination');
                                thiss.$txtDateCoordination = thiss.$divPopup.find('#txtDateCoordination');
                                thiss.$txtNextMeetingDateCoordination = thiss.$divPopup.find('#txtNextMeetingDateCoordination');
                                thiss.$txtNextStepCoordination = thiss.$divPopup.find('#txtNextStepCoordination');
                                thiss.$txaRecommendationCoordination = thiss.$divPopup.find('#txaRecommendationCoordination');
                                thiss.$ddlActivityTypeCoordination = thiss.$divPopup.find('#ddlActivityTypeCoordination');
                                thiss.datePicker(thiss.$txtDateCoordination);
                                thiss.datePicker(thiss.$txtNextMeetingDateCoordination);
                                if (idCoordination > 0)
                                    thiss.detailCoordination(idCoordination);
                                thiss.$btnSaveCoordination.off("click");
                                thiss.$btnSaveCoordination.on("click", function (e) {
                                    thiss.saveCoordinations();
                                });
                            });
                        };
                        this.saveCoordinations = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdCoordination.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                date: thiss.$txtDateCoordination.date(),
                                nextmeetingdate: thiss.$txtNextMeetingDateCoordination.date(),
                                nextstep: thiss.$txtNextStepCoordination.val(),
                                recommendation: thiss.$txaRecommendationCoordination.val(),
                                activityType: { id: thiss.$ddlActivityTypeCoordination.int32() },
                                state: true
                            };
                            var options = {
                                data: { id: thiss.$hdnId.int32(), item},
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/savecoordination', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchCoordinations();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtDateCoordination.val() === '') {
                                    success = false;
                                    message = 'Ingrese una fecha.';
                                    thiss.$txtDateCoordination.focus();
                                } else if (thiss.$ddlActivityTypeCoordination.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un tipo actividad.';
                                    thiss.$ddlActivityTypeCoordination.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailCoordination = function (idCoordination) {
                            var thiss = this;
                            var options = {
                                data: { id: idCoordination },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/coordination/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdCoordination.val(item.id);
                                thiss.$txtDateCoordination.val(item.date);
                                thiss.$txtNextMeetingDateCoordination.val(item.nextMeetingDate);
                                thiss.$txtNextStepCoordination.val(item.nextStep);
                                thiss.$txaRecommendationCoordination.val(item.recommendation);
                                thiss.$ddlActivityTypeCoordination.val(item.activityType.id);
                            });
                        };
                        this.deleteCoordinations = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var coordinationsIds = com.jtm.helper.Table.getItems(thiss.$tblResultCoordinations, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), coordinationsIds: coordinationsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deletecoordinations', options, function () { thiss.searchCoordinations(); });
                            function validate() {
                                if (coordinationsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.searchRelevantActors = function () {
                            var thiss = this;
                            thiss.$tblResultRelevantActors.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchrelevantactors', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillRelevantActors(items, thiss.$tblResultRelevantActors);
                            });
                        };
                        this.fillRelevantActors = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + item.settler.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + item.startDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + item.observation + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + item.position.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-relevantactorid= "' + item.id + '">' + item.levelInfluence.name + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formRelevantActor = function (idRelevantActor, title) {
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formrelevantactor", function () {
                                thiss.$btnSaveRelevantActor = thiss.$divPopup.find('#btnSaveRelevantActor');
                                thiss.$hdnIdRelevantActor = thiss.$divPopup.find('#hdnIdRelevantActor');
                                thiss.$txtStartDateRelevantActor = thiss.$divPopup.find('#txtStartDateRelevantActor');
                                thiss.$txaObservationRelevantActor = thiss.$divPopup.find('#txaObservationRelevantActor');
                                thiss.$ddlSettlerRelevantActor = thiss.$divPopup.find('#ddlSettlerRelevantActor');
                                thiss.$ddlPositionRelevantActor = thiss.$divPopup.find('#ddlPositionRelevantActor');
                                thiss.$ddlLevelInfluenceRelevantActor = thiss.$divPopup.find('#ddlLevelInfluenceRelevantActor');
                                thiss.datePicker(thiss.$txtStartDateRelevantActor);
                                if (idRelevantActor > 0)
                                    thiss.detailRelevantActor(idRelevantActor);
                                thiss.$btnSaveRelevantActor.off("click");
                                thiss.$btnSaveRelevantActor.on("click", function (e) {
                                    thiss.saveRelevantActors();
                                });
                            });
                        };
                        this.saveRelevantActors = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdRelevantActor.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                startDate: thiss.$txtStartDateRelevantActor.date(),
                                observation: thiss.$txaObservationRelevantActor.val(),
                                settler: { id: thiss.$ddlSettlerRelevantActor.int32() },
                                position: { id: thiss.$ddlPositionRelevantActor.int32() },
                                levelInfluence: { id: thiss.$ddlLevelInfluenceRelevantActor.int32() },
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/commission/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchRelevantActors();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtStartDateRelevantActor.val() === '') {
                                    success = false;
                                    message = 'Ingrese una fecha.';
                                    thiss.$txtStartDateRelevantActor.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailRelevantActor = function (idRelevantActor) {
                            var thiss = this;
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), settlerId: idRelevantActor },
                                isJson: false,
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/commission/detail2', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdRelevantActor.val(item.settler.id);
                                thiss.$txtStartDateRelevantActor.val(item.startDate);
                                thiss.$txaObservationRelevantActor.val(item.observation);
                                thiss.$ddlSettlerRelevantActor.prop('disabled', true);
                                thiss.$ddlSettlerRelevantActor.val(item.settler.id);
                                thiss.$ddlPositionRelevantActor.val(item.position.id);
                                thiss.$ddlLevelInfluenceRelevantActor.val(item.levelInfluence.id);
                            });
                        };
                        this.deleteRelevantActors = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var relevantActorsIds = com.jtm.helper.Table.getItems(thiss.$tblResultRelevantActors, true, false);
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), settlersIds: relevantActorsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deletecommissions', options, function () { thiss.searchRelevantActors(); });
                            function validate() {
                                if (relevantActorsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.searchCommissionNegotiators = function () {
                            var thiss = this;
                            thiss.$tblResultCommissionNegotiators.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/searchcommissionnegotiators', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillCommissionNegotiators(items, thiss.$tblResultCommissionNegotiators);
                            });
                        };
                        this.fillCommissionNegotiators = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + item.settler.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + item.startDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + item.endDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + item.position.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-commissionnegotiatorid= "' + item.id + '">' + item.levelInfluence.name + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formCommissionNegotiator = function (idCommissionNegotiator, title) {
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/negotiation/formcommissionnegotiator", function () {
                                thiss.$btnSaveCommissionNegotiator = thiss.$divPopup.find('#btnSaveCommissionNegotiator');
                                thiss.$hdnIdCommissionNegotiator = thiss.$divPopup.find('#hdnIdCommissionNegotiator');
                                thiss.$txtStartDateCommissionNegotiator = thiss.$divPopup.find('#txtStartDateCommissionNegotiator');
                                thiss.$txtEndDateCommissionNegotiator = thiss.$divPopup.find('#txtEndDateCommissionNegotiator');
                                thiss.$txaObservationCommissionNegotiator = thiss.$divPopup.find('#txaObservationCommissionNegotiator');
                                thiss.$ddlSettlerCommissionNegotiator = thiss.$divPopup.find('#ddlSettlerCommissionNegotiator');
                                thiss.$ddlPositionCommissionNegotiator = thiss.$divPopup.find('#ddlPositionCommissionNegotiator');
                                thiss.$ddlLevelInfluenceCommissionNegotiator = thiss.$divPopup.find('#ddlLevelInfluenceCommissionNegotiator');
                                thiss.datePicker(thiss.$txtStartDateCommissionNegotiator);
                                thiss.datePicker(thiss.$txtEndDateCommissionNegotiator);
                                if (idCommissionNegotiator > 0)
                                    thiss.detailCommissionNegotiator(idCommissionNegotiator);
                                thiss.$btnSaveCommissionNegotiator.off("click");
                                thiss.$btnSaveCommissionNegotiator.on("click", function (e) {
                                    thiss.saveCommissionNegotiators();
                                });
                            });
                        };
                        this.saveCommissionNegotiators = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnIdCommissionNegotiator.int32(),
                                negotiation: { id: thiss.$hdnId.int32() },
                                startDate: thiss.$txtStartDateCommissionNegotiator.date(),
                                endDate: thiss.$txtEndDateCommissionNegotiator.date(),
                                observation: thiss.$txaObservationCommissionNegotiator.val(),
                                settler: { id: thiss.$ddlSettlerCommissionNegotiator.int32() },
                                position: { id: thiss.$ddlPositionCommissionNegotiator.int32() },
                                levelInfluence: { id: thiss.$ddlLevelInfluenceCommissionNegotiator.int32() },
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/commission/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchCommissionNegotiators();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtStartDateCommissionNegotiator.val() === '') {
                                    success = false;
                                    message = 'Ingrese una fecha inicio.';
                                    thiss.$txtStartDateCommissionNegotiator.focus();
                                } else if (thiss.$txtEndDateCommissionNegotiator.val() === '') {
                                    success = false;
                                    message = 'Ingrese una fecha fin.';
                                    thiss.$txtEndDateCommissionNegotiator.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailCommissionNegotiator = function (idCommissionNegotiator) {
                            var thiss = this;
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), settlerId: idCommissionNegotiator },
                                isJson: false,
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/commission/detail2', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdCommissionNegotiator.val(item.settler.id);
                                thiss.$txtStartDateCommissionNegotiator.val(item.startDate);
                                thiss.$txtEndDateCommissionNegotiator.val(item.endDate);
                                thiss.$txaObservationCommissionNegotiator.val(item.observation);
                                thiss.$ddlSettlerCommissionNegotiator.prop('disabled', true);
                                thiss.$ddlSettlerCommissionNegotiator.val(item.settler.id);
                                thiss.$ddlPositionCommissionNegotiator.val(item.position.id);
                                thiss.$ddlLevelInfluenceCommissionNegotiator.val(item.levelInfluence.id);
                            });
                        };
                        this.deleteCommissionNegotiators = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var commissionNegotiatorsIds = com.jtm.helper.Table.getItems(thiss.$tblResultCommissionNegotiators, true, false);
                            var options = {
                                data: { negotiationId: thiss.$hdnId.int32(), settlersIds: commissionNegotiatorsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/negotiation/deletecommissions', options, function () { thiss.searchCommissionNegotiators(); });
                            function validate() {
                                if (commissionNegotiatorsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                    }
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        thiss.$ddlEntitySearch = thiss.$main.find("#ddlEntitySearch");
                        thiss.$ddlNegotiationStatusSearch = thiss.$main.find("#ddlNegotiationStatusSearch");
                        thiss.$ddlEmployeeSearch = thiss.$main.find("#ddlEmployeeSearch");
                        thiss.$ddlRequirementSearch = thiss.$main.find("#ddlRequirementSearch");
                        thiss.$chkToRelocateSearch = thiss.$main.find("#chkToRelocateSearch");
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$ddlEntity = thiss.$form.find('#ddlEntity');
                            thiss.$ddlNegotiationStatus = thiss.$form.find('#ddlNegotiationStatus');
                            thiss.$ddlEmployee = thiss.$form.find('#ddlEmployee');
                            thiss.$ddlRequirement = thiss.$form.find('#ddlRequirement');
                            thiss.$chkToRelocate = thiss.$form.find('#chkToRelocate');
                            thiss.$txaComment = thiss.$form.find('#txaComment');
                            thiss.$btnAddLegalEvaluation = thiss.$form.find('#btnAddLegalEvaluation');
                            thiss.$btnEditLegalEvaluation = thiss.$form.find('#btnEditLegalEvaluation');
                            thiss.$btnQuitLegalEvaluations = thiss.$form.find('#btnQuitLegalEvaluations');
                            thiss.$btnAddActivity = thiss.$form.find('#btnAddActivity');
                            thiss.$btnEditActivity = thiss.$form.find('#btnEditActivity');
                            thiss.$btnQuitActivities = thiss.$form.find('#btnQuitActivities');
                            thiss.$btnAddCommissionCompany = thiss.$form.find('#btnAddCommissionCompany');
                            thiss.$btnEditCommissionCompany = thiss.$form.find('#btnEditCommissionCompany');
                            thiss.$btnQuitCommissionCompanies = thiss.$form.find('#btnQuitCommissionCompanies');
                            thiss.$btnAddCoordination = thiss.$form.find('#btnAddCoordination');
                            thiss.$btnEditCoordination = thiss.$form.find('#btnEditCoordination');
                            thiss.$btnQuitCoordinations = thiss.$form.find('#btnQuitCoordinations');
                            thiss.$btnAddRelevantActor = thiss.$form.find('#btnAddRelevantActor');
                            thiss.$btnEditRelevantActor = thiss.$form.find('#btnEditRelevantActor');
                            thiss.$btnQuitRelevantActors = thiss.$form.find('#btnQuitRelevantActors');
                            thiss.$btnAddCommissionNegotiator = thiss.$form.find('#btnAddCommissionNegotiator');
                            thiss.$btnEditCommissionNegotiator = thiss.$form.find('#btnEditCommissionNegotiator');
                            thiss.$btnQuitCommissionNegotiators = thiss.$form.find('#btnQuitCommissionNegotiators');
                            thiss.$tblResultLegalEvaluations = thiss.$form.find('#tblResultLegalEvaluations');
                            thiss.$tblResultActivities = thiss.$form.find('#tblResultActivities');
                            thiss.$tblResultCommissionCompanies = thiss.$form.find('#tblResultCommissionCompanies');
                            thiss.$tblResultCoordinations = thiss.$form.find('#tblResultCoordinations');
                            thiss.$tblResultRelevantActors = thiss.$form.find('#tblResultRelevantActors');
                            thiss.$tblResultCommissionNegotiators = thiss.$form.find('#tblResultCommissionNegotiators');
                            thiss.$btnAddLegalEvaluation.off("click");
                            thiss.$btnAddLegalEvaluation.on("click", function (e) {
                                thiss.formLegalEvaluation(0, "Añadir Evaluación Legal");
                            });
                            thiss.$btnEditLegalEvaluation.off("click");
                            thiss.$btnEditLegalEvaluation.on("click", function (e) {
                                var idLegalEvaluation = thiss.getElementID(thiss.$tblResultLegalEvaluations);
                                if (idLegalEvaluation > 0)
                                    thiss.formLegalEvaluation(idLegalEvaluation, "Editar Evaluación Legal");
                                else
                                    toastr.info('Debes seleccionar una Evaluación Legal.');
                            });
                            thiss.$btnQuitLegalEvaluations.off("click");
                            thiss.$btnQuitLegalEvaluations.on("click", function (e) {
                                thiss.deleteLegalEvaluations();
                            });
                            thiss.$btnAddActivity.off("click");
                            thiss.$btnAddActivity.on("click", function (e) {
                                thiss.formActivity(0, "Añadir Actividad");
                            });
                            thiss.$btnEditActivity.off("click");
                            thiss.$btnEditActivity.on("click", function (e) {
                                var idActivity = thiss.getElementID(thiss.$tblResultActivities);
                                if (idActivity > 0)
                                    thiss.formActivity(idActivity, "Editar Actividad");
                                else
                                    toastr.info('Debes seleccionar una Actividad.');
                            });
                            thiss.$btnQuitActivities.off("click");
                            thiss.$btnQuitActivities.on("click", function (e) {
                                thiss.deleteActivities();
                            });
                            thiss.$btnAddCommissionCompany.off("click");
                            thiss.$btnAddCommissionCompany.on("click", function (e) {
                                thiss.formCommissionCompany(0, "Añadir Comisión Compañía");
                            });
                            thiss.$btnEditCommissionCompany.off("click");
                            thiss.$btnEditCommissionCompany.on("click", function (e) {
                                var idCommissionCompany = thiss.getElementID(thiss.$tblResultCommissionCompanies);
                                if (idCommissionCompany > 0)
                                    thiss.formCommissionCompany(idCommissionCompany, "Editar Comisión Compañía");
                                else
                                    toastr.info('Debes seleccionar una Comisión Compañía.');
                            });
                            thiss.$btnQuitCommissionCompanies.off("click");
                            thiss.$btnQuitCommissionCompanies.on("click", function (e) {
                                thiss.deleteCommissionCompanies();
                            });
                            thiss.$btnAddCoordination.off("click");
                            thiss.$btnAddCoordination.on("click", function (e) {
                                thiss.formCoordination(0, "Añadir Coordinación");
                            });
                            thiss.$btnEditCoordination.off("click");
                            thiss.$btnEditCoordination.on("click", function (e) {
                                var idCoordination = thiss.getElementID(thiss.$tblResultCoordinations);
                                if (idCoordination > 0)
                                    thiss.formCoordination(idCoordination, "Editar Coordinación");
                                else
                                    toastr.info('Debes seleccionar una Coordinación.');
                            });
                            thiss.$btnQuitCoordinations.off("click");
                            thiss.$btnQuitCoordinations.on("click", function (e) {
                                thiss.deleteCoordinations();
                            });
                            thiss.$btnAddRelevantActor.off("click");
                            thiss.$btnAddRelevantActor.on("click", function (e) {
                                thiss.formRelevantActor(0, "Añadir Actor Relevante");
                            });
                            thiss.$btnEditRelevantActor.off("click");
                            thiss.$btnEditRelevantActor.on("click", function (e) {
                                var idRelevantActor = thiss.getElementID(thiss.$tblResultRelevantActors);
                                if (idRelevantActor > 0)
                                    thiss.formRelevantActor(idRelevantActor, "Editar Actor Relevante");
                                else
                                    toastr.info('Debes seleccionar una Actor Relevante.');
                            });
                            thiss.$btnQuitRelevantActors.off("click");
                            thiss.$btnQuitRelevantActors.on("click", function (e) {
                                thiss.deleteRelevantActors();
                            });
                            thiss.$btnAddCommissionNegotiator.off("click");
                            thiss.$btnAddCommissionNegotiator.on("click", function (e) {
                                thiss.formCommissionNegotiator(0, "Añadir Comisión Negociadora");
                            });
                            thiss.$btnEditCommissionNegotiator.off("click");
                            thiss.$btnEditCommissionNegotiator.on("click", function (e) {
                                var idCommissionNegotiator = thiss.getElementID(thiss.$tblResultCommissionNegotiators);
                                if (idCommissionNegotiator > 0)
                                    thiss.formCommissionNegotiator(idCommissionNegotiator, "Editar Comisión Negociadora");
                                else
                                    toastr.info('Debes seleccionar una Comisión Negociadora.');
                            });
                            thiss.$btnQuitCommissionNegotiators.off("click");
                            thiss.$btnQuitCommissionNegotiators.on("click", function (e) {
                                thiss.deleteCommissionNegotiators();
                            });
                            //thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                            //    urlSave: com.jtm.Server.contextPath + "socialresponsability/negotiation/savedocument",
                            //    urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                            //    urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                            //    urlSearch: com.jtm.Server.contextPath + "socialresponsability/negotiation/searchdocuments",
                            //    $hdnId: thiss.$hdnId
                            //});
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txaComment.val(item.comment);
                            thiss.$ddlEntity.val(item.interestGroup.id);
                            thiss.$ddlNegotiationStatus.val(item.negotiationStatus.id);
                            thiss.$ddlEmployee.val(item.employee.id);
                            thiss.$ddlRequirement.val(item.requirement.id);
                            thiss.$chkToRelocate.prop("checked", item.toRelocate);
                            thiss.$chkState.prop("checked", item.state);
                            thiss.searchLegalEvaluations();
                            thiss.searchActivities();
                            thiss.searchCommissionCompanies();
                            thiss.searchCoordinations();
                            thiss.searchRelevantActors();
                            thiss.searchCommissionNegotiators();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "interestGroup.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "negotiationStatus.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "employee.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "requirement.code",
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
                            comment: thiss.$txaComment.val(),
                            interestGroup: { id: thiss.$ddlEntity.int32() },
                            property: { id: 0 },
                            negotiationStatus: { id: thiss.$ddlNegotiationStatus.int32() },
                            employee: { id: thiss.$ddlEmployee.int32() },
                            requirement: { id: thiss.$ddlRequirement.int32() },
                            toRelocate: thiss.$chkToRelocate.boolean(),
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$ddlEntity.int32() === 0) {
                                success = false;
                                message = 'Seleccione el grupo interes.';
                                thiss.$ddlEntity.focus();
                            } else if (thiss.$ddlNegotiationStatus.int32() === 0) {
                                success = false;
                                message = 'Seleccione el estado.';
                                thiss.$ddlNegotiationStatus.focus();
                            } else if (thiss.$ddlEmployee.int32() === 0) {
                                success = false;
                                message = 'Seleccione el responsable.';
                                thiss.$ddlEmployee.focus();
                            } else if (thiss.$ddlRequirement.int32() === 0) {
                                success = false;
                                message = 'Seleccione el requerimiento.';
                                thiss.$ddlRequirement.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            interestGroup: { id: thiss.$ddlEntitySearch.int32() },
                            negotiationStatus: { id: thiss.$ddlNegotiationStatusSearch.int32() },
                            employee: { id: thiss.$ddlEmployeeSearch.int32() },
                            requirement: { id: thiss.$ddlRequirementSearch.int32() },
                            toRelocate: thiss.$chkToRelocateSearch.boolean(),
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                negotiation.Main = Main;
            })(socialresponsability.negotiation || (socialresponsability.negotiation = {}));
            var negotiation = socialresponsability.negotiation;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.negotiation.Main.execute();