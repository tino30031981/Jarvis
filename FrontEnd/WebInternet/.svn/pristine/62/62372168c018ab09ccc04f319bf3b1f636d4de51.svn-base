(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (agreement) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$txtReceptionDateSearch = null;
                        this.$txtReceptionDateEndSearch = null;
                        this.$txtTargetDateSearch = null;
                        this.$txtTargetDateEndSearch = null;
                        this.$txtReceptionDate = null;
                        this.$txtTargetDate = null;
                        this.$txtCodeSearch = null;
                        this.$txtSignatureDateSearch = null;
                        this.$txtSignatureDateEndSearch = null;
                        this.$ddlAgreementTypeSearch = null;
                        this.$ddlNegotiationSearch = null;
                        this.$ddlCurrencyTypeSearch = null;
                        this.$txtCode = null;
                        this.$txtManualArea = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                        this.$txtSignatureDate = null;
                        this.$txtPlace = null;
                        this.$txtTotalAmount = null;
                        this.$ddlAgreementType = null;
                        this.$ddlCurrencyType = null;
                        this.$ddlNegotiation = null;
                        this.$ddlRegistryOffice = null;
                        this.$txaObjective = null;
                        this.$txaDescription = null;
                        this.$txaComment = null;
                        this.$chkByTerritorialLand = null;
                        this.searchParticipants = function () {
                            var thiss = this;
                            thiss.$tblResultParticipants.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/searchparticipants', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillParticipants(items, thiss.$tblResultParticipants);
                            });
                        };
                        this.fillParticipants = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.idParticipant + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.idParticipant + '" name="chk' + item.idParticipant + '" value="' + item.idParticipant + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.idParticipant + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.idParticipant + '">' + item.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.idParticipant + '">' + item.signatureParticipant + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formParticipant = function (idParticipant, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '40%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/agreement/formparticipant", function () {
                                //thiss.$hdnIdParticipant = thiss.$divPopup.find('#hdnIdParticipant');
                                thiss.$ddlSettlerParticipant = thiss.$divPopup.find('#ddlSettlerParticipant');
                                thiss.$btnSaveParticipant = thiss.$divPopup.find('#btnSaveParticipant');
                                thiss.$chkSignatureParticipant = thiss.$divPopup.find('#chkSignatureParticipant');
                                if (idParticipant > 0)
                                    thiss.detailParticipant(idParticipant);
                                thiss.$btnSaveParticipant.off("click");
                                thiss.$btnSaveParticipant.on("click", function (e) {
                                    thiss.saveParticipants();
                                });
                            });
                        };
                        this.saveParticipants = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var item = {
                                id: thiss.$hdnId.int32(),
                                idParticipant: thiss.$ddlSettlerParticipant.int32(),
                                signatureParticipant: thiss.$chkSignatureParticipant.boolean(),
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/saveparticipants', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchParticipants();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$ddlSettlerParticipant.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un comunero/poblador.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailParticipant = function (idParticipant) {
                            var thiss = this;
                            var thiss = this;
                            var options = {
                                data: {
                                    id: thiss.$hdnId.int32(),
                                    idParticipant: idParticipant
                                },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/detailparticipant', options, function (data) {
                                var item = data.item;
                                thiss.$ddlSettlerParticipant.val(item.idParticipant === null ? 0 : item.idParticipant);
                                thiss.$chkSignatureParticipant.prop("checked", item.signatureParticipant);
                            });
                        };
                        this.deleteParticipants = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var participantsIds = com.jtm.helper.Table.getItems(thiss.$tblResultParticipants, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), participantsIds: participantsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/deleteparticipants', options, function () { thiss.searchParticipants(); });
                            function validate() {
                                if (participantsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };

                        this.searchObligations = function () {
                            var thiss = this;
                            thiss.$tblResultObligations.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/searchobligations', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillObligations(items, thiss.$tblResultObligations);
                            });
                        };
                        this.fillObligations = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.clause + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.startDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.endDate + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formObligation = function (idObligation, title) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '90%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/agreement/formobligation", function () {
                                thiss.$btnSaveObligation = thiss.$divPopup.find('#btnSaveObligation');
                                thiss.$hdnIdObligation = thiss.$divPopup.find('#hdnIdObligation');
                                thiss.$txaClauseObligation = thiss.$divPopup.find('#txaClauseObligation');
                                thiss.$txtStartDateObligation = thiss.$divPopup.find('#txtStartDateObligation');
                                thiss.$txtEndDateObligation = thiss.$divPopup.find('#txtEndDateObligation');
                                thiss.$txaDescriptionObligation = thiss.$divPopup.find('#txaDescriptionObligation');
                                thiss.$txaCommentObligation = thiss.$divPopup.find('#txaCommentObligation');
                                thiss.datePicker(thiss.$txtStartDateObligation);
                                thiss.datePicker(thiss.$txtEndDateObligation);
                                if (idObligation > 0)
                                    thiss.detailObligation(idObligation);
                                thiss.$btnSaveObligation.off("click");
                                thiss.$btnSaveObligation.on("click", function (e) {
                                    thiss.saveObligation();
                                })

                            });
                        };
                        this.saveObligation = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnIdObligation.int32(),
                                agreement: { id: thiss.$hdnId.int32() },
                                clause: thiss.$txaClauseObligation.val(),
                                startDate: thiss.$txtStartDateObligation.date(),
                                endDate: thiss.$txtEndDateObligation.date(),
                                description: thiss.$txaDescriptionObligation.val(),
                                comment: thiss.$txaCommentObligation.val(),
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: true,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/obligation/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchObligations();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txaClauseObligation.val() === '') {
                                    success = false;
                                    message = 'Ingrese clausula';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailObligation = function (idObligation) {
                            var thiss = this;
                            var options = {
                                data: { id: idObligation },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/obligation/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdObligation.val(item.id),
                                thiss.$txaClauseObligation.val(item.clause),
                                thiss.$txtStartDateObligation.val(item.startDate),
                                thiss.$txtEndDateObligation.val(item.endDate),
                                thiss.$txaDescriptionObligation.val(item.description),
                                thiss.$txaCommentObligation.val(item.comment)
                            });
                        };
                        this.deleteObligations = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var obligationsIds = com.jtm.helper.Table.getItems(thiss.$tblResultObligations, true, false);
                            var options = {
                                data: { obligationsIds: obligationsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/deleteobligations', options, function () { thiss.searchObligations(); });
                            function validate() {
                                if (obligationsIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                        };

                        this.searchCommitments = function () {
                            var thiss = this;
                            thiss.$tblResultCommitments.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/searchcommitments', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillCommitments(items, thiss.$tblResultCommitments);
                            });
                        };
                        this.fillCommitments = function (items, $tbl) {
                            if (items === undefined || items === null) return;
                            items.forEach(function (item, i) {
                                $tbl.find('>tbody').append('<tr data-uniqueid="' + item.id + '" data-index="' + i + '"></tr>');
                                $tbl.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"></td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + (i + 1) + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.code + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.clause + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.employee.name + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.startDate + '</td>');
                                $tbl.find('>tbody>tr:last').append('<td data-stationid= "' + item.id + '">' + item.endDate + '</td>');
                            });
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                        };
                        this.formCommitment = function (idCommitment, title) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '95%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/agreement/formcommitment", function () {
                                thiss.$btnSaveCommitment = thiss.$divPopup.find('#btnSaveCommitment');
                                thiss.$hdnIdCommitment = thiss.$divPopup.find('#hdnIdCommitment');
                                thiss.$txtCodeCommitment = thiss.$divPopup.find('#txtCodeCommitment');
                                thiss.$txtCodeAddendumCommitment = thiss.$divPopup.find('#txtCodeAddendumCommitment');
                                thiss.$txaClauseCommitment = thiss.$divPopup.find('#txaClauseCommitment');
                                thiss.$txtStartDateCommitment = thiss.$divPopup.find('#txtStartDateCommitment');
                                thiss.$txtEndDateCommitment = thiss.$divPopup.find('#txtEndDateCommitment');
                                thiss.$ddlEmployeeCommitment = thiss.$divPopup.find('#ddlEmployeeCommitment');
                                thiss.$ddlCurrencyTypeCommitment = thiss.$divPopup.find('#ddlCurrencyTypeCommitment');
                                thiss.$txaDescriptionCommitment = thiss.$divPopup.find('#txaDescriptionCommitment');
                                thiss.$txtSolCommitment = thiss.$divPopup.find('#txtSolCommitment');
                                thiss.$txtDollarCommitment = thiss.$divPopup.find('#txtDollarCommitment');
                                thiss.$txtExchangeRateCommitment = thiss.$divPopup.find('#txtExchangeRateCommitment');
                                thiss.$ddlEconomicFundCommitment = thiss.$divPopup.find('#ddlEconomicFundCommitment');
                                thiss.$ddlPreparatoryCommitment = thiss.$divPopup.find('#ddlPreparatoryCommitment');
                                thiss.$txtPhysicalCommitment = thiss.$divPopup.find('#txtPhysicalCommitment');
                                thiss.$txaCommentCommitment = thiss.$divPopup.find('#txaCommentCommitment');
                                thiss.datePicker(thiss.$txtStartDateCommitment);
                                thiss.datePicker(thiss.$txtEndDateCommitment);
                                thiss.$txtSolCommitment.keyup(function () { thiss.$txtDollarCommitment.val(thiss.$txtSolCommitment.val() * thiss.$txtExchangeRateCommitment.val()); });
                                thiss.$txtExchangeRateCommitment.keyup(function () { thiss.$txtDollarCommitment.val(thiss.$txtSolCommitment.val() * thiss.$txtExchangeRateCommitment.val()); });
                                if (idCommitment > 0)
                                    thiss.detailCommitment(idCommitment);
                                thiss.$btnSaveCommitment.off("click");
                                thiss.$btnSaveCommitment.on("click", function (e) {
                                    thiss.saveCommitment();
                                })

                            });
                        };
                        this.saveCommitment = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnIdCommitment.int32(),
                                agreement: { id: thiss.$hdnId.int32() },
                                code: thiss.$txtCodeCommitment.val(),
                                codeAddendumCommitment: thiss.$txtCodeAddendumCommitment.val(),
                                clause: thiss.$txaClauseCommitment.val(),
                                description: thiss.$txaDescriptionCommitment.val(),
                                startDate: thiss.$txtStartDateCommitment.date(),
                                endDate: thiss.$txtEndDateCommitment.date(),
                                financial: {
                                    sol: thiss.$txtSolCommitment.val(),
                                    dollar: thiss.$txtDollarCommitment.val(),
                                },
                                physical: thiss.$txtPhysicalCommitment.val(),
                                exchangeRate: thiss.$txtExchangeRateCommitment.val(),
                                comment: thiss.$txaCommentCommitment.val(),
                                currencyType: { id: thiss.$ddlCurrencyTypeCommitment.int32() },
                                employee: { id: thiss.$ddlEmployeeCommitment.int32() },
                                economicFund: { id: thiss.$ddlEconomicFundCommitment.int32() },
                                preparatoryCommitment: { id: thiss.$ddlPreparatoryCommitment.int32() },
                                state: true
                            };
                            var options = {
                                data: item,
                                isJson: true,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/commitment/save', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchCommitments();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtCodeCommitment.val() === '') {
                                    success = false;
                                    message = 'Ingrese código';
                                    thiss.$txtCodeCommitment.focus();
                                } else if (thiss.$txtStartDateCommitment.val() === '') {
                                    success = false;
                                    message = 'Ingrese fecha inicio';
                                    thiss.$txtStartDateCommitment.focus();
                                } else if (thiss.$ddlEmployeeCommitment.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione responsable.';
                                    thiss.$ddlEmployeeCommitment.focus();
                                } else if (thiss.$ddlCurrencyTypeCommitment.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione tipo de moneda.';
                                    thiss.$ddlCurrencyTypeCommitment.focus();
                                } else if (thiss.$ddlEconomicFundCommitment.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione tipo de fondo.';
                                    thiss.$ddlEconomicFundCommitment.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailCommitment = function (idCommitment) {
                            var thiss = this;
                            var options = {
                                data: { id: idCommitment },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/commitment/detail', options, function (data) {
                                var item = data.item;
                                console.log(item);
                                thiss.$hdnIdCommitment.val(item.id),
                                thiss.$txtCodeCommitment.val(item.code);
                                thiss.$txtCodeAddendumCommitment.val(item.codeAddendumCommitment);
                                thiss.$txaClauseCommitment.val(item.clause),
                                thiss.$txaDescriptionCommitment.val(item.description),
                                thiss.$txtStartDateCommitment.val(item.startDate),
                                thiss.$txtEndDateCommitment.val(item.endDate),
                                thiss.$txtSolCommitment.val(item.financial.sol),
                                thiss.$txtDollarCommitment.val(item.financial.dollar),
                                thiss.$txtPhysicalCommitment.val(item.physical),
                                thiss.$txtExchangeRateCommitment.val(item.exchangeRate),
                                thiss.$txaCommentCommitment.val(item.comment),
                                thiss.$ddlCurrencyTypeCommitment.val(item.currencyType.id),
                                thiss.$ddlEmployeeCommitment.val(item.employee.id),
                                thiss.$ddlEconomicFundCommitment.val(item.economicFund.id),
                                thiss.$ddlPreparatoryCommitment.val(item.preparatoryCommitment.id)
                            });
                        };
                        this.deleteCommitments = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var commitmentsIds = com.jtm.helper.Table.getItems(thiss.$tblResultCommitments, true, false);
                            var options = {
                                data: { commitmentsIds: commitmentsIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/agreement/deletecommitments', options, function () { thiss.searchCommitments(); });
                            function validate() {
                                if (commitmentsIds.length === 0) {
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
                        thiss.$txtCodeSearch = thiss.$main.find('#txtCodeSearch');
                        thiss.$txtSignatureDateSearch = thiss.$main.find('#txtSignatureDateSearch');
                        thiss.$txtSignatureDateEndSearch = thiss.$main.find('#txtSignatureDateEndSearch');
                        thiss.$ddlAgreementTypeSearch = thiss.$main.find('#ddlAgreementTypeSearch');
                        thiss.$ddlNegotiationSearch = thiss.$main.find('#ddlNegotiationSearch');
                        thiss.$ddlCurrencyTypeSearch = thiss.$main.find('#ddlCurrencyTypeSearch');
                        thiss.$ddlSpatialReferenceSearch = thiss.$main.find('#ddlSpatialReferenceSearch');
                        thiss.$ddlDepartmentSearch = thiss.$main.find('#ddlDepartmentSearch');
                        thiss.$ddlProvinceSearch = thiss.$main.find('#ddlProvinceSearch');
                        thiss.$ddlDistrictSearch = thiss.$main.find('#ddlDistrictSearch');
                        thiss.$ddlHydrographicBasinSearch = thiss.$main.find('#ddlHydrographicBasinSearch');
                        thiss.$ddlNationalCartographySearch = thiss.$main.find('#ddlNationalCartographySearch');
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(thiss.$txtSignatureDateSearch);
                        thiss.datePicker(thiss.$txtSignatureDateEndSearch);
                        thiss.fillPoliticalDivision(thiss.$ddlDepartmentSearch, thiss.$ddlProvinceSearch, thiss.$ddlDistrictSearch);
                        console.log("35");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$txtCode = thiss.$form.find('#txtCode');
                            thiss.$txtManualArea = thiss.$form.find('#txtManualArea');
                            thiss.$txtStartDate = thiss.$form.find('#txtStartDate');
                            thiss.$txtEndDate = thiss.$form.find('#txtEndDate');
                            thiss.$txtSignatureDate = thiss.$form.find('#txtSignatureDate');
                            thiss.$txtPlace = thiss.$form.find('#txtPlace');
                            thiss.$txtTotalAmount = thiss.$form.find('#txtTotalAmount');
                            thiss.$ddlAgreementType = thiss.$form.find('#ddlAgreementType');
                            thiss.$ddlCurrencyType = thiss.$form.find('#ddlCurrencyType');
                            thiss.$ddlNegotiation = thiss.$form.find('#ddlNegotiation');
                            thiss.$ddlRegistryOffice = thiss.$form.find('#ddlRegistryOffice');
                            thiss.$ddlSpatialReference = thiss.$form.find("ddlSpatialReference");
                            thiss.$txaObjective = thiss.$form.find('#txaObjective');
                            thiss.$txaDescription = thiss.$form.find('#txaDescription');
                            thiss.$txaComment = thiss.$form.find('#txaComment');
                            thiss.$chkByTerritorialLand = thiss.$form.find('#chkByTerritorialLand');
                            thiss.datePicker(thiss.$txtStartDate);
                            thiss.datePicker(thiss.$txtEndDate);
                            thiss.datePicker(thiss.$txtSignatureDate);
                            thiss.$btnAddObligation = thiss.$form.find('#btnAddObligation');
                            thiss.$btnEditObligation = thiss.$form.find('#btnEditObligation');
                            thiss.$btnQuitObligations = thiss.$form.find('#btnQuitObligations');
                            thiss.$btnAddCommitment = thiss.$form.find('#btnAddCommitment');
                            thiss.$btnEditCommitment = thiss.$form.find('#btnEditCommitment');
                            thiss.$btnQuitCommitments = thiss.$form.find('#btnQuitCommitments');
                            thiss.$btnAddParticipant = thiss.$form.find('#btnAddParticipant');
                            thiss.$btnEditParticipant = thiss.$form.find('#btnEditParticipant');
                            thiss.$btnQuitParticipants = thiss.$form.find('#btnQuitParticipants');
                            thiss.$tblResultParticipants = thiss.$form.find('#tblResultParticipants');
                            thiss.$tblResultObligations = thiss.$form.find('#tblResultObligations');
                            thiss.$tblResultCommitments = thiss.$form.find('#tblResultCommitments');
                            thiss.$btnAddObligation.off("click");
                            thiss.$btnAddObligation.on("click", function (e) {
                                thiss.formObligation(0, "Añadir Obligación");
                            });
                            thiss.$btnEditObligation.off("click");
                            thiss.$btnEditObligation.on("click", function (e) {
                                var idObligation = thiss.getElementID(thiss.$tblResultObligations);
                                if (idObligation > 0)
                                    thiss.formObligation(idObligation, "Editar Obligación");
                                else
                                    toastr.info('Debes seleccionar una obligación.');
                            });
                            thiss.$btnQuitObligations.off("click");
                            thiss.$btnQuitObligations.on("click", function (e) {
                                thiss.deleteObligations();
                            });

                            thiss.$btnAddCommitment.off("click");
                            thiss.$btnAddCommitment.on("click", function (e) {
                                thiss.formCommitment(0, "Añadir Compromiso");
                            });
                            thiss.$btnEditCommitment.off("click");
                            thiss.$btnEditCommitment.on("click", function (e) {
                                var idCommitment = thiss.getElementID(thiss.$tblResultCommitments);
                                if (idCommitment > 0)
                                    thiss.formCommitment(idCommitment, "Editar Compromiso");
                                else
                                    toastr.info('Debes seleccionar un compromiso.');
                            });
                            thiss.$btnQuitCommitments.off("click");
                            thiss.$btnQuitCommitments.on("click", function (e) {
                                thiss.deleteCommitments();
                            });

                            thiss.$btnAddParticipant.off("click");
                            thiss.$btnAddParticipant.on("click", function (e) {
                                thiss.formParticipant(0, "Añadir Participantes");
                            });
                            thiss.$btnEditParticipant.off("click");
                            thiss.$btnEditParticipant.on("click", function (e) {
                                var idParticipant = thiss.getElementID(thiss.$tblResultParticipants);
                                if (idParticipant > 0)
                                    thiss.formParticipant(idParticipant, "Editar participante");
                                else
                                    toastr.info('Debes seleccionar un participante.');
                            });
                            thiss.$btnQuitParticipants.off("click");
                            thiss.$btnQuitParticipants.on("click", function (e) {
                                thiss.deleteParticipants();
                            });
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/agreement/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/agreement/searchdocuments",
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
                            thiss.$txtManualArea.val(item.manualArea);
                            thiss.$txtStartDate.val(item.startDate);
                            thiss.$txtEndDate.val(item.endDate);
                            thiss.$txtSignatureDate.val(item.signatureDate);
                            thiss.$txtPlace.val(item.publicRecord.place);
                            thiss.$txtTotalAmount.val(item.totalAmount);
                            thiss.$ddlAgreementType.val(item.agreementType.id === null ? 0 : item.agreementType.id);
                            thiss.$ddlCurrencyType.val(item.currencyType.id === null ? 0 : item.currencyType.id);
                            thiss.$ddlNegotiation.val(item.negotiation.id === null ? 0 : item.negotiation.id);
                            thiss.$ddlRegistryOffice.val(item.registryOffice.id === null ? 0 : item.registryOffice.id);
                            thiss.$ddlSpatialReference.val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            thiss.$txaObjective.val(item.objective);
                            thiss.$txaDescription.val(item.description);
                            thiss.$txaComment.val(item.comment);
                            thiss.$chkByTerritorialLand.prop("checked", item.byTerritorialLand);
                            thiss.$chkState.prop("checked", item.state);
                            thiss.formViewer.$ddlSpatialReference.val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "socialresponsability/settler/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "socialresponsability/settler/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "socialresponsability/settler/searchnationalcartographies", item.id, null);
                            thiss.formAttachment.search(item.id);
                            thiss.searchParticipants();
                            thiss.searchObligations();
                            thiss.searchCommitments();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: 'code',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: "agreementType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "startDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "endDate",
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
                            code: thiss.$txtCode.val(),
                            manualArea: thiss.$txtManualArea.number(),
                            startDate: thiss.$txtStartDate.date(),
                            endDate: thiss.$txtEndDate.date(),
                            signatureDate: thiss.$txtSignatureDate.date(),
                            publicRecord: { place: thiss.$txtPlace.val() },
                            totalAmount: thiss.$txtTotalAmount.number(),
                            agreementType: { id: thiss.$ddlAgreementType.int32() },
                            currencyType: { id: thiss.$ddlCurrencyType.int32() },
                            negotiation: { id: thiss.$ddlNegotiation.int32() },
                            registryOffice: { id: thiss.$ddlRegistryOffice.int32() },
                            objective: thiss.$txaObjective.val(),
                            description: thiss.$txaDescription.val(),
                            comment: thiss.$txaComment.val(),
                            byTerritorialLand: thiss.$chkByTerritorialLand.boolean(),
                            spatialReference: {
                                id: thiss.$ddlSpatialReference.int32()
                            },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtCode.val() === '') {
                                success = false;
                                message = 'Ingrese código.';
                                thiss.$txtCode.focus();
                            } else if (thiss.$ddlAgreementType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo.';
                                thiss.$ddlAgreementType.focus();
                            } else if (thiss.$txtStartDate.date() === null) {
                                success = false;
                                message = 'Ingresa fecha de inicio.';
                                thiss.$txtStartDate.focus();
                            } else if (thiss.$txtEndDate.date() === null) {
                                success = false;
                                message = 'Ingresa fecha fin.';
                                thiss.$txtEndDate.focus();
                            } else if (thiss.$txtSignatureDate.date() === null) {
                                success = false;
                                message = 'Ingresa fecha de firma.';
                                thiss.$txtSignatureDate.focus();
                            } else if (thiss.$ddlCurrencyType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de moneda.';
                                thiss.$ddlCurrencyType.focus();
                            } else if (thiss.$txtTotalAmount.val() === '') {
                                success = false;
                                message = 'Ingrese monto total.';
                                thiss.$txtTotalAmount.focus();
                            } else if (thiss.$ddlNegotiation.int32() === 0) {
                                success = false;
                                message = 'Seleccione negociación.';
                                thiss.$ddlNegotiation.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            code: thiss.$txtCodeSearch.val(),
                            signatureDate: thiss.$txtSignatureDateSearch.date(),
                            signatureDateEnd: thiss.$txtSignatureDateEndSearch.date(),
                            agreementType: { id: thiss.$ddlAgreementTypeSearch.int32() },
                            negotiation: { id: thiss.$ddlNegotiationSearch.int32() },
                            currencyType: { id: thiss.$ddlCurrencyTypeSearch.int32() },
                            district: {
                                id: thiss.$ddlDistrictSearch.val(),
                                province: {
                                    id: thiss.$ddlProvinceSearch.val(),
                                    department: {
                                        id: thiss.$ddlDepartmentSearch.val()
                                    }
                                }
                            },
                            nationalCartography: { id: thiss.$ddlNationalCartographySearch.val() },
                            hydrographicBasin: { id: thiss.$ddlHydrographicBasinSearch.val() },
                            spatialReference: { id: thiss.$ddlSpatialReferenceSearch.int32() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                agreement.Main = Main;
            })(socialresponsability.agreement || (socialresponsability.agreement = {}));
            var agreement = socialresponsability.agreement;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.agreement.Main.execute();