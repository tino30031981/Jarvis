(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mc";
                        //this.procedure = null;                        
                        this.tracing = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        /*this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;*/
                        this.formPay = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                //position: [(x - 550) / 2, y - 100],
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/formpay", function () {
                                thiss.datePicker('#txtReceiptDatePay');
                                jQuery('#txtAmountPaidPay').numeric({
                                    negative: false,
                                    decimalPlaces: 2
                                });
                                jQuery('#chkStatePay').prop("checked", true);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'general/currencytype/list', {}, function (items) {
                                    var html = '';
                                    jQuery.each(items, function (i, item) {
                                        html += '<option value="' + item.id + '" data-symbol="' + (item.symbol === null ? '' : item.symbol) + '" >' + item.name + '</option>';
                                    });
                                    jQuery("#ddlCurrencyTypePay").html(html);
                                });
                                jQuery('#ddlCurrencyTypePay').off("change");
                                jQuery('#ddlCurrencyTypePay').on("change", function () {
                                    jQuery('.symbol').text(jQuery('#ddlCurrencyTypePay option:selected').attr("data-symbol"));
                                });
                                if (id > 0) {
                                    thiss.detailPay(id);
                                }
                                jQuery('#btnSavePay').off("click");
                                jQuery('#btnSavePay').on("click", function (e) {
                                    thiss.savePay();
                                });
                            });
                        };
                        this.savePay = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdPay').int32(),
                                year: jQuery('#ddlYearPay').int32(),
                                receiptNumber: jQuery('#txtReceiptNumberPay').string(),
                                receiptDate: jQuery("#txtReceiptDatePay").date(),
                                amountPaid: jQuery('#txtAmountPaidPay').number(),
                                financialEntity: { id: jQuery('#ddlFinancialEntityPay').int32() },
                                currencyType: { id: jQuery('#ddlCurrencyTypePay').int32() },
                                miningConcession: { id: thiss.$hdnId.int32() },
                                concept: { id: jQuery('#ddlConceptPay').int32() },
                                description: jQuery('#txaDescriptionPay').string(),
                                state: jQuery('#chkState').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/pay/save', options, function () {
                                thiss.searchPays(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#ddlFinancialEntityPay').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione la entidad financiera.';
                                    jQuery('#ddlFinancialEntityPay').focus();
                                } else if (jQuery('#ddlCurrencyTypePay').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione la moneda.';
                                    jQuery('#ddlCurrencyTypePay').focus();
                                } else if (jQuery('#ddlYearPay').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el año.';
                                    jQuery('#ddlYearPay').focus();
                                } else if (jQuery('#txtReceiptNumberPay').string() === '') {
                                    success = false;
                                    message = 'Ingrese el número de recibo.';
                                    jQuery('#txtReceiptNumberPay').focus();
                                } else if (jQuery('#txtReceiptDatePay').date() === null) {
                                    success = false;
                                    message = 'Ingrese una la fecha del recibo.';
                                    jQuery('#txtReceiptDatePay').focus();
                                } else if (jQuery('#txtAmountPaidPay').decimal() === 0) {
                                    success = false;
                                    message = 'Ingrese el pago efectivo.';
                                    jQuery('#txtAmountPaidPay').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deletePays = function () {
                            var thiss = this;
                            var itemsValidities = com.jtm.helper.Table.getItems("#tbdResultValidities", true, true);
                            var itemsPenalties = com.jtm.helper.Table.getItems("#tbdResultPenalties", true, true);
                            var itemsPay = [];
                            jQuery.each(itemsValidities, function (i, item) {
                                itemsPay.push({ id: item.id });
                            });
                            jQuery.each(itemsPenalties, function (i, item) {
                                itemsPay.push({ id: item.id });
                            });
                            var item = {
                                Pays: itemsPay
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (item.length === 0) {
                                    alert('Seleccione al menos un pago.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/deletepays', options, function () { thiss.searchPays(); });
                        };
                        this.searchPays = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchpays', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.fillPays(item.validities, '#tblResultValidities', '#tblResultPenalties');
                                thiss.fillPays(item.penalties, '#tblResultPenalties', '#tblResultValidities');
                                jQuery('#divTotalPay > span').html(jQuery('#tbdResultValidities>tr').length + jQuery('#tbdResultPenalties>tr').length);
                            });

                        };
                        this.fillPays = function (items, tbl, tblToggle) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td class="text-right">' + item.year + '</td>';
                                html += '<td>' + item.currencyType.name + '</td>';
                                html += '<td>' + item.miningConcession.netArea + '</td>';
                                html += '<td class="text-right">' + item.individualCost.toFixed(2) + '</td>';
                                html += '<td class="text-right">' + item.amountDebt + '</td>';
                                html += '<td class="text-right">' + item.amountPaid + '</td>';
                                html += '<td>' + item.receiptDate + '</td>';
                                html += '<td>' + item.receiptNumber + '</td>';
                                html += '<td>' + item.financialEntity.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            com.jtm.helper.Table.highlightRow(tbl, function () {
                                jQuery(tblToggle + ' > tbody > tr').removeClass("gh-selected").removeClass("selected");
                            });
                        };
                        this.searchInvestment = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchInvestment', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.fillInvestment(item, '#tblResultInvestments', "#divTotalInvestments");
                            });
                        };
                        this.fillInvestment = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + item.year + '</td>';
                                html += '<td>' + item.investmentType.name + '</td>';
                                html += '<td>' + item.amountInvestd + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.formInvestment = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                //position: [(x - 550) / 2, y - 100],
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/forminvestment", function () {
                                jQuery('#txtAmountInvestd').numeric({
                                    negative: false,
                                    decimalPlaces: 2
                                });
                                jQuery('#chkStateSearchInvestment').prop("checked", true);
                                if (id > 0) {
                                    thiss.detailInvestment(id);
                                }
                                jQuery('#btnSaveInvestment').off("click");
                                jQuery('#btnSaveInvestment').on("click", function (e) {
                                    thiss.saveInvestment();
                                });
                            });
                        };
                        this.saveInvestment = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdInvestment').int32(),
                                investmentType: {
                                    id: jQuery('#ddlInvestmentType').int32()
                                },
                                miningConcession: {
                                    id: thiss.$hdnId.int32()
                                },
                                year: jQuery("#ddlYearInvestment").val(),
                                amountInvestd: jQuery('#txtAmountInvestd').number(),
                                description: jQuery('#txaDescriptionInvestment').string(),
                                state: jQuery('#chkStateSearchInvestment').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/investment/save', options, function () {
                                thiss.searchInvestment(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#ddlInvestmentType').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el tipo de inversión.';
                                    jQuery('#ddlInvestmentType').focus();
                                } else if (jQuery('#ddlYearInvestment').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el año de Inversión.';
                                    jQuery('#ddlYearInvestment').focus();
                                } else if (jQuery('#txtAmountInvestd').decimal() === 0) {
                                    success = false;
                                    message = 'Ingrese el monto Invertido.';
                                    jQuery('#txtAmountInvestd').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteInvestment = function () {
                            var thiss = this;
                            var items = com.jtm.helper.Table.getItems("#tbdResultInvestments", true, true);
                            var item = {
                                Investments: items
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (item.length === 0) {
                                    alert('Seleccione al menos un pago.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/deleteInvestment', options, function () { thiss.searchInvestment(); });
                        };
                        this.detailInvestment = function (id) {
                            var thiss = this;
                            function validate() {
                                return true;
                            }
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'miningconcession/investment/detail', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdInvestment').val(item.id);
                                jQuery('#ddlYearInvestment').val(item.year);
                                jQuery('#txtAmountInvestd').val(item.amountInvestd);
                                jQuery('#ddlInvestmentType').val(item.investmentType.id);
                                jQuery('#txaDescriptionInvestment').val(item.description);
                                jQuery('#chkStateInvestment').prop("checked", item.state);
                            });
                        };
                        this.detailPay = function (id) {
                            var thiss = this;
                            function validate() {
                                return true;
                            }
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'miningconcession/pay/detail', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdPay').val(item.id);
                                jQuery('#ddlConceptPay').val(item.concept.id);
                                jQuery('#ddlConceptPay').attr("disabled", true);
                                jQuery('#ddlFinancialEntityPay').val(item.financialEntity.id);
                                jQuery('#ddlCurrencyTypePay').val(item.currencyType.id);
                                jQuery('#ddlYearPay').val(item.year);
                                jQuery('#txtReceiptNumberPay').val(item.receiptNumber);
                                jQuery('#txtReceiptDatePay').val(item.receiptDate);
                                jQuery('#txtAmountPaidPay').val(item.amountPaid);
                                jQuery('#txaDescriptionPay').val(item.description);
                                jQuery('#chkStatePay').prop("checked", item.state);
                                jQuery('#ddlCurrencyTypePay').trigger("change");
                            });
                        };
                        this.formMineral = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar minerales",
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/formminerals", function () {
                                jQuery('#btnSearchMineral').off("click");
                                jQuery('#btnSearchMineral').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveMineral').off("click");
                                jQuery('#btnSaveMineral').on("click", function (e) {
                                    thiss.saveMinerals();
                                });
                            });
                            function search() {
                                jQuery('#tbdResultMinerals2').empty();
                                var data = {
                                    name: jQuery('#txtNameSearchMineral').string(),
                                    mineralType: { id: jQuery('#ddlMineralType').int32() }
                                };
                                var itemsExist = com.jtm.helper.Table.getItems("#tbdResultMinerals", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'general/mineral/searchbymineraltype', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    thiss.fillMinerals(items, '#tblResultMinerals2', "#divTotalMineral2", itemsExist);
                                });
                            }
                        };
                        this.saveMinerals = function () {
                            var thiss = this;
                            var mineralIds = com.jtm.helper.Table.getItems("#tbdResultMinerals2", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), mineralIds: mineralIds },
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/saveminerals', options, function () {
                                thiss.searchMinerals(); jQuery('#divPopup').dialog('close');
                                jQuery('#ddlMineralType').attr('disabled', ((jQuery('#tbdResultMinerals tr').length > 0) ? true : false));
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (mineralIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un mineral.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteMinerals = function () {
                            var thiss = this;
                            var mineralIds = com.jtm.helper.Table.getItems("#tbdResultMinerals", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), mineralIds: mineralIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (mineralIds.length === 0) {
                                    alert('Seleccione al menos un mineral.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/deleteminerals', options,
                                function () {
                                    thiss.searchMinerals();
                                    jQuery('#ddlMineralType').attr('disabled', ((jQuery('#tbdResultMinerals tr').length > 0) ? true : false));
                                });
                        };
                        this.searchMinerals = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchminerals', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillMinerals(items, '#tblResultMinerals', "#divTotalMineral");
                            });
                        };
                        this.fillMinerals = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.mineralType.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (itemsExist !== undefined) {
                                itemsExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formHolder = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar titulares",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/formholders", function () {
                                jQuery('#btnSearchHolder').off("click");
                                jQuery('#btnSearchHolder').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveHolder').off("click");
                                jQuery('#btnSaveHolder').on("click", function (e) {
                                    thiss.saveHolders();
                                });
                            });
                            function search() {
                                jQuery('#tbdResultHolders2').empty();
                                var data = {
                                    item: {
                                        name: jQuery('#txtNameSearchHolder').string(),
                                        holderType: { id: jQuery('#ddlHolderTypeSearchHolder').int32() },
                                        holderGroup: { id: jQuery('#ddlHolderGroupSearchHolder').int32() }
                                    },
                                    id: thiss.$hdnId.int32()
                                };
                                thiss.searchConfig(com.jtm.Server.contextPath + 'society/holder/searchbyminingconcession', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    jQuery('#tbdResultHolders2').off('click', 'tr > td input:checkbox');
                                    jQuery('#tbdResultHolders2').on('click', 'tr > td input:checkbox', function (e) {
                                        if (jQuery(this).prop('checked')) {
                                            jQuery(this).closest('tr').find('input:text').attr("disabled", false);
                                        } else {
                                            jQuery(this).closest('tr').find('input:text').attr("disabled", true);
                                            jQuery(this).closest('tr').find('input:text').val(0);
                                        }
                                    });
                                    thiss.fillHolders(items, '#tblResultHolders2', "#divTotalHolder2", true);
                                });
                            }
                        };
                        this.saveHolders = function () {
                            var thiss = this;
                            var itemsHolder = [];
                            jQuery('#tbdResultHolders2 input:checkbox:checked').each(function () {
                                itemsHolder.push({
                                    id: jQuery(this).val(),
                                    percent: jQuery(this).closest('tr').find(".percent").val()
                                });
                            });
                            var item = { id: thiss.$hdnId.int32(), holders: itemsHolder };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/saveholders', options, function (response) {
                                if (response.success) {
                                    thiss.searchHolders();
                                    jQuery('#divPopup').dialog('close');
                                }
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (itemsHolder.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un titular.';
                                }
                                var total = 0;
                                itemsHolder.forEach(function (itemHolder) {
                                    if (itemHolder.percent === "0") {
                                        success = false;
                                        message = 'Debe ingresar porcentaje mayor a cero para el titular seleccionado.';
                                    }
                                    total += parseFloat(itemHolder.percent);
                                });
                                if (success === true && total !== 100) {
                                    success = false;
                                    message = 'El porcentaje total debe ser igual a 100%.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteHolders = function () {
                            var thiss = this;
                            var holderIds = com.jtm.helper.Table.getItems("#tbdResultHolders", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), holderIds: holderIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (holderIds.length === 0) {
                                    alert('Seleccione al menos un titular.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/deleteholders', options, function () { thiss.searchHolders(); });
                        };
                        this.searchHolders = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchholders', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillHolders(items, '#tblResultHolders', "#divTotalHolder", false);
                            });
                        };
                        this.fillHolders = function (items, tbl, div, typeView) {
                            var html = '';
                            var viewControl = '';
                            jQuery.each(items, function (i, item) {
                                viewControl = (typeView === true && item.percent > 0) ? ' checked="checked"' : '';
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"' + viewControl + ' /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.holderGroup.name + '</td>';
                                if (typeView === false)
                                    html += '<td>' + item.percent + '</td>';
                                else {
                                    viewControl = (item.percent > 0 ? ' value="' + item.percent + '"' : ' value="0" disabled="false"');
                                    html += '<td><input type="text" maxlength="6" class="form-control text-right percent" id="txt' + item.id + '"' + viewControl + '></td>';
                                }
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            jQuery(tbl + '>tbody>tr input:text').numeric({ negative: false, decimalPlaces: 2 });
                        };
                        this.formOperator = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar Operador",
                                width: '470',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/formoperator", function () {
                                jQuery('#btnSaveOperator').off("click");
                                jQuery('#btnSaveOperator').on("click", function (e) {
                                    thiss.saveOperator();
                                });
                                jQuery('#ddlHolderGroupOperator').off("change");
                                jQuery('#ddlHolderGroupOperator').on("change", function () {
                                    thiss.searchConfig(com.jtm.Server.contextPath + 'society/holder/searchbyholdergroup', {
                                        data: { id: jQuery('#ddlHolderGroupOperator').int32() }
                                    }, function (items) {
                                        var html = '';
                                        jQuery.each(items, function (i, item) {
                                            html += '<option value="' + item.id + '" >' + item.name + '</option>';
                                        });
                                        jQuery("#ddlHolderOperator").html(html);
                                    });
                                });
                            });
                        };
                        this.saveOperator = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnId.int32(),
                                holder: {
                                    id: jQuery('#ddlHolderOperator').int32(),
                                    year: jQuery('#ddlYearOperator').int32()
                                }
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/saveoperator', options, function () {
                                thiss.searchOperators();
                                jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#ddlHolderGroupOperator').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un Grupo Titular.';
                                } else if (jQuery('#ddlHolderOperator').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un Titular.';
                                } else if (jQuery('#ddlYearOperator').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione un Año.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteOperators = function () {
                            var thiss = this;
                            var operatorIds = com.jtm.helper.Table.getItems("#tbdResultOperators", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), operatorIds: operatorIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (operatorIds.length === 0) {
                                    alert('Seleccione al menos un operador.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/deleteoperators', options, function () { thiss.searchOperators(); });
                        };
                        this.searchOperators = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchoperators', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillOperators(items, '#tblResultOperators', "#divTotalOperator");
                            });
                        };
                        this.fillOperators = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.year + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.searchCoordinatesOld = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchcoordinatesold', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.fillCoordinatesOld(item.coordinates, '#tblResultCoordinatesOld', "#divTotalCoordinatesOld");
                                jQuery('#txtAreaOld').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                                jQuery('#txtLengthOld').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                                var zone = '';
                                if (item.spatialReference.id === 24877)
                                    zone = '17S';
                                else if (item.spatialReference.id === 24878)
                                    zone = '18S';
                                else if (item.spatialReference.id === 24878)
                                    zone = '19S';
                                jQuery('#divTitleCoordinatesOld').text('Coordenadas Anteriores - PSAD56 ' + zone);
                            });
                        };
                        this.fillCoordinatesOld = function (items, tbl, div) {
                            var thiss = this;
                            if (items === undefined || items === null || !(items instanceof Array)) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                item.vertex = i;
                                html += '<tr id="' + i + '">';
                                html += '<td class="text-right">' + (item.vertex + 1) + '</td>';
                                html += '<td class="text-right tdX" style="vnd.ms-excel.numberformat:0.00">' + item.x.toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '<td class="text-right tdY" style="vnd.ms-excel.numberformat:0.00">' + item.y.toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                        };
                        this.formMiningRequest = function () {
                            var thiss = this;
                            thiss.loadView(thiss.$form, com.jtm.Server.contextPath + "miningconcession/miningconcession/formminingrequest", function () {
                                thiss.$main.hide();
                                thiss.$form.show();
                                thiss.buildClose();
                                jQuery('#btnSearchMiningRequest').off("click");
                                jQuery('#btnSearchMiningRequest').on("click", function (e) {
                                    thiss.searchMiningRequest();
                                });
                                jQuery('#btnSaveFromMiningRequest').off("click");
                                jQuery('#btnSaveFromMiningRequest').on("click", function (e) {
                                    thiss.saveFromMiningRequest();
                                });
                                jQuery('#btnCleanMiningRequest').off("click");
                                jQuery('#btnCleanMiningRequest').on("click", function (e) {
                                    jQuery('#txtNameMiningRequestSearch').val('')
                                    jQuery('#tbdResultMiningRequests').empty();
                                });
                            });
                        };
                        this.searchMiningRequest = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/searchforminingconcession', { data: { name: jQuery('#txtNameMiningRequestSearch').string() }, isJson: false }, function (items) {
                                thiss.fillMiningRequest(items, '#tblResultMiningRequests', "#divTotalMiningRequest");
                                thiss.datePicker('.formulationdate');
                            });
                        };
                        this.fillMiningRequest = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td><input type="text" maxlength="11" class="form-control code" id="txt' + item.id + '"></td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td><input type="text" class="form-control formulationdate" id="txt' + item.id + '"></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.saveFromMiningRequest = function () {
                            var thiss = this;
                            var itemsMain = [];
                            jQuery('#tbdResultMiningRequests input:checkbox:checked').each(function () {
                                itemsMain.push({
                                    id: jQuery(this).int32(),
                                    code: jQuery(this).closest('tr').find(".code").val(),
                                    formulationDate: jQuery(this).closest('tr').find(".formulationdate").date()
                                });
                            });
                            var items = { items: itemsMain };
                            var options = {
                                data: items,
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/savefromminingrequest', options, function (response) {
                                if (response.success) {
                                    thiss.searchMiningRequest();
                                }
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (itemsMain.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un Petitorio.';
                                }
                                itemsMain.forEach(function (itemMain) {
                                    if (itemMain.code === "") {
                                        success = false;
                                        message = 'Debes Ingresar un código';
                                    } else if (itemMain.formulationDate === '' || itemMain.formulationDate === null || itemMain.formulationDate === undefined) {
                                        success = false;
                                        message = 'Debes Ingresar la fecha de formulación';
                                    }
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        /*this.formMiningCadaster = function () {
                            var thiss = this;
                            thiss.loadView(thiss.$form, com.jtm.Server.contextPath + "miningconcession/miningconcession/formminingcadaster", function () {
                                thiss.$main.hide();
                                thiss.$form.show();
                                thiss.buildClose();
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: "#ddlServerSearch",
                                    items: thiss.config.module.soaps
                                });
                                jQuery('#ddlServerSearch').val(thiss.config.module.defaultsoap);
                                jQuery('#btnSearchMiningCadaster').off("click");
                                jQuery('#btnSearchMiningCadaster').on("click", function (e) {
                                    thiss.searchMiningCadaster();
                                });
                                jQuery('#btnSaveFromMiningCadaster').off("click");
                                jQuery('#btnSaveFromMiningCadaster').on("click", function (e) {
                                    thiss.saveFromMiningCadaster();
                                });
                                jQuery('#btnCleanMiningCadaster').off("click");
                                jQuery('#btnCleanMiningCadaster').on("click", function (e) {
                                    jQuery('#txtNameMiningCadasterSearch').val('');
                                    jQuery('#txtCodeMiningCadasterSearch').val('');
                                    jQuery('#txtHolderNameMiningCadasterSearch').val('');
                                    jQuery('#ddlServerSearch').val(thiss.config.module.defaultsoap);
                                    jQuery('#tbdResultMiningCadasters').empty();
                                });
                            });
                        };*/
                        /*this.searchMiningCadaster = function () {
                            var thiss = this;
                            var id = jQuery('#ddlServerSearch').string();
                            var services = thiss.config.module.soaps.find2("id", id);
                            var item = {
                                name: jQuery('#txtNameMiningCadasterSearch').val(),
                                code: jQuery('#txtCodeMiningCadasterSearch').val(),
                                holder: {
                                    name: jQuery('#txtHolderNameMiningCadasterSearch').val()
                                }
                            };
                            var options = {
                                data: {
                                    url: services.url,
                                    layerId: Number(services.layerId),
                                    item: JSON.stringify(item)
                                },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningcadaster/searchsoap', options, function (items) {
                                thiss.fillMiningCadaster(items, '#tblResultMiningCadasters', "#divTotalMiningCadaster");
                            });
                        };*/
                        this.fillMiningCadaster = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.formulationDate + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        /*this.saveFromMiningCadaster = function () {
                            var thiss = this;
                            var ids = com.jtm.helper.Table.getItems("#tbdResultMiningCadasters", true, false);
                            var id = jQuery('#ddlServerSearch').string();
                            var service = thiss.config.module.soaps.find2("id", id);
                            var item = {
                                url: service.url,
                                layerId: Number(service.layerId),
                                ids: ids
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/savefromminingcadaster', options, function (response) {
                                if (response.success) {
                                    thiss.searchMiningRequest();
                                }
                            });
                            function validate() {
                                if (ids.length === 0) {
                                    alert('Seleccione al menos una Concesión.');
                                    return false;
                                }
                                else
                                    return true;
                            }
                        };*/
                        /* this.searchAlerts = function () {
                             var thiss = this;
                             var options = {
                                 data: { id: thiss.$hdnId.int32() },
                                 isJson: false
                             };
                             thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchalerts', options, function (items) {
                                 thiss.fillAlerts(items);
                             });
                         };
                         this.fillAlerts = function (items) {
                             var thiss = this;
                             var html = '';
                             items.forEach(function (item, i) {
                                 html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                 html += '<td>' + (i + 1) + '</td>';
                                 html += '<td>' + item.name + '</td>';
                                 html += '<td>' + item.description + '</td>';
                                 html += '<td>' + item.startDate + '</td>';
                                 html += '<td>' + item.endDate + '</td>';
                                 html += '<td>' + item.rule + '</td>';
                                 html += '</tr>';
                             });
                             thiss.$tblResultAlerts.find('>tbody').html(html);
                             thiss.$divTotalAlert.find('>span').html(thiss.$tblResultAlerts.find('>tbody>tr').length);
                             com.jtm.helper.Table.highlightRow(thiss.$tblResultAlerts);
                         };*/
                        /*
                        this.searchProcedureDocuments = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchprocedures', options, function (items) {
                                thiss.fillProcedureDocuments(items);
                            });
                            thiss.$btnShowHide.off('click');
                            thiss.$btnShowHide.on('click', function (e, isClosed) {
                                var state = typeof isClosed === "boolean" ? isClosed : $(this).find('>i').hasClass(Main.UPLOADSHOW);
                                if (state) {
                                    $(this).find('>i').removeClass(Main.UPLOADSHOW).addClass(Main.UPLOADHIDE);
                                    thiss.$divRequirementDocuments.find('>.panel-body').hide();
                                }
                                else {
                                    $(this).find('>i').removeClass(Main.UPLOADHIDE).addClass(Main.UPLOADSHOW);
                                    thiss.$divRequirementDocuments.find('>.panel-body').show();
                                }
                            });
                            thiss.$btnShowHide.trigger('click', false);
                        };
                        this.fillProcedureDocuments = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                if (item.document.id !== null) {
                                    html += '<li id="' + item.id + '" class="list-group-item">';
                                    html += '<span class="glyphicon glyphicon-folder-close">';
                                    html += '<a href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank">' + item.name + '</a>';
                                    html += '</span>';
                                    html += '</li>';
                                }
                            });
                            thiss.$ulDocumentProcedure.html(html);
                            thiss.$ulDocumentProcedure.find('>li').off('dblclick');
                            thiss.$ulDocumentProcedure.find('>li').on('dblclick', function (e) {
                                thiss.searchRequirements($(this).attr('id'));
                            });
                            thiss.$divProcedureDocuments.find('>.panel-body').css('position', 'relative');
                            thiss.$divRequirementDocuments.css({ 'position': 'absolute', 'bottom': '0', 'right': '0' });
                        };
                        this.searchRequirements = function (id) {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/requirement/searchbyprocedure', { data: { id: id, moduleId: thiss.$hdnId.int32() }, isJson: false }, function (items) {
                                thiss.fillRequirementDocuments(items);
                            });
                        };
                        this.fillRequirementDocuments = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                if (item.document.id !== null) {
                                    html += '<li id="' + item.id + '" class="list-group-item">';
                                    html += '<span class="glyphicon glyphicon-folder-close">';
                                    html += '<a href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank">' + item.name + '</a>';
                                    html += '</span>';
                                    html += '</li>';
                                }
                            });
                            thiss.$divRequirementDocuments.show();
                            thiss.$divRequirementDocuments.find('>.panel-body>ul').html(html);
                            thiss.$btnShowHide.trigger('click', false);
                        };*/

                        this.searchPermissions = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/permission/Searchbyminingconcession',
                                { data: { miningConcessionId: thiss.$hdnId.int32() } }, function (items) {
                                    thiss.fillPermissions(items, '#tblResultPermissions', "#divTotalPermission");
                                });
                        };
                        this.fillPermissions = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.type + '</td>';
                                html += '<td>' + item.generatingEntity + '</td>';
                                html += '<td>' + item.approvedResolution + '</td>';
                                html += '<td>' + item.dateApprovedResolution + '</td>';
                                html += '<td>' + item.expirationDate + '</td>';
                                html += '<td>' + item.document.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (itemsExist !== undefined) {
                                itemsExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                    }
                    //Main.UPLOADSHOW = "glyphicon-triangle-bottom";
                    //Main.UPLOADHIDE = "glyphicon-triangle-top";
                   /* Main.prototype.mapLayer = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.mapLayer.call(this, jsonFile, options, function () {
                           
                        });
                    };*/
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            /*jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "general/baseprocedure.js");
                            jQuery.getScript(thiss.js.path + "uea/uea/procedure.js", function (data, textStatus, jqxhr) {
                                thiss.procedure = getInstance();
                                thiss.procedure.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });*/
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "miningconcession/miningconcession/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnRecord').off("click");
                        jQuery('#btnRecord').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0)
                                thiss.formRecord(com.jtm.Server.contextPath + "miningconcession/miningconcession/formrecord", id, { code: code });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                        /*
                        jQuery('#btnProcedure').off("click");
                        jQuery('#btnProcedure').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.procedure.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });*/
                        jQuery('#btnResolution').off("click");
                        jQuery('#btnResolution').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            console.log(code);
                            if (code !== 0)
                                thiss.formResolution(com.jtm.Server.contextPath + "miningconcession/miningconcession/formresolutionofficial", id, { code: code });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnPay').off("click");
                        jQuery('#btnPay').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0)
                                thiss.formPayOfficial(com.jtm.Server.contextPath + "miningconcession/miningconcession/formpayofficial", id, { code: code });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnUpdatePays').off('click');
                        jQuery('#btnUpdatePays').on('click', function (e) {
                            //thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/updatepays');
                            //thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/updateminingcadasternational');
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/updateminingconcession');
                            /*var item = {};
                            item.dateSend = "2018-04-01";
                            item.dateEnd = "2018-04-05";
                            var options = {
                                data: {
                                    item: item
                                }
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'general/notification/listnotification',options);
                            */

                            /*  var options = {
                                  data: { id: 1 }
                              };
                              thiss.searchConfig(com.jtm.Server.contextPath + 'general/notification/notificationdetail', options, function (item) {
                                  
                              });*/
                        });
                        jQuery('#btnMiningRequest').off("click");
                        jQuery('#btnMiningRequest').on("click", function (e) {
                            thiss.formMiningRequest();
                        });
                        /*jQuery('#btnMiningCadaster').off("click");
                        jQuery('#btnMiningCadaster').on("click", function (e) {
                            thiss.formMiningCadaster();
                        });*/
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'miningconcession/folder/delete',
                                urlForm: com.jtm.Server.contextPath + "miningconcession/folder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'miningconcession/folder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "miningconcession/folder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "miningconcession/folder/formfolder"
                            });
                        });
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker('#txtFormulationDateStartSearch');
                        thiss.datePicker('#txtFormulationDateEndSearch');
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "miningconcession/miningconcession/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "miningconcession/miningconcession/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.datePicker('#txtTitleDate');
                            thiss.datePicker('#txtFormulationDate');
                            thiss.datePicker('#txtTitleRegistrationDate');
                            thiss.datePicker('#txtExtinctionDateOld');
                            thiss.datePicker('#txtCoordinateRegistrationDate');
                            thiss.datePicker('#txtInclusionDate');
                            thiss.datePicker('#txtDateOrigin');
                            //thiss.$tblResultAlerts = thiss.$form.find('#tblResultAlerts');
                            //thiss.$divTotalAlert = thiss.$form.find('#divTotalAlert');
                            //thiss.$divProcedureDocuments = thiss.$form.find('#divProcedureDocuments');
                            //thiss.$ulDocumentProcedure = thiss.$divProcedureDocuments.find('#ulDocumentProcedure');
                            //thiss.$divRequirementDocuments = thiss.$divProcedureDocuments.find('>.panel-body>.panel-default');
                            //thiss.$btnShowHide = thiss.$divProcedureDocuments.find('#btnShowHide');
                            //thiss.$divRequirementDocuments.hide();
                            jQuery('#txtAreaTitle').numeric({ negative: false, decimalPlaces: 4 });
                            jQuery('#txtNetArea').numeric({ negative: false, decimalPlaces: 4 });
                            jQuery('#txtFormulationArea').numeric({ negative: false, decimalPlaces: 2 });
                            jQuery('#txtInstalledCapacity').numeric({ negative: false, decimalPlaces: 2 });
                            jQuery('#btnAddPay').off("click");
                            jQuery('#btnAddPay').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formPay(0, "Agregar Pago");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnUpdatePay').off("click");
                            jQuery('#btnUpdatePay').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0) {
                                    var id = thiss.getElementID('#tblResultValidities');
                                    if (id === 0)
                                        id = thiss.getElementID('#tblResultPenalties');
                                    if (id > 0)
                                        thiss.formPay(id, "Editar Pago");
                                    else
                                        alert('Debes seleccionar un pago de vigencia o penalidad.');
                                }
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitPays').off("click");
                            jQuery('#btnQuitPays').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deletePays();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnAddMineral').off("click");
                            jQuery('#btnAddMineral').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formMineral();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitMinerals').off("click");
                            jQuery('#btnQuitMinerals').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteMinerals();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnAddHolder').off("click");
                            jQuery('#btnAddHolder').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formHolder();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitHolders').off("click");
                            jQuery('#btnQuitHolders').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteHolders();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnAddOperator').off("click");
                            jQuery('#btnAddOperator').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formOperator();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitOperators').off("click");
                            jQuery('#btnQuitOperators').on("click", function (e) {
                                thiss.deleteOperators();
                            });
                            jQuery('#btnAddInvestment').off("click");
                            jQuery('#btnAddInvestment').on("click", function (e) {
                                thiss.formInvestment();
                            });
                            jQuery('#btnUpdateInvestment').off("click");
                            jQuery('#btnUpdateInvestment').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0) {
                                    var id = thiss.getElementID('#tblResultInvestments');
                                    if (id > 0)
                                        thiss.formInvestment(id, "Editar Pago");
                                    else
                                        alert('Debes seleccionar una inversión.');
                                }
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitInvestment').off("click");
                            jQuery('#btnQuitInvestment').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteInvestment();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            //thiss.searchProcedures();
                            /*thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "miningconcession/miningconcession/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "miningconcession/miningconcession/searchdocuments",
                                $hdnId: thiss.$hdnId
                            });*/
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            console.log(item.id);
                            console.log(thiss.$hdnId.val());
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txtNetArea').val(item.netArea);
                            jQuery('#txtFormulationArea').val(item.formulationArea);
                            jQuery('#txtFormulationHour').val(item.formulationHour);
                            jQuery('#txtAreaTitle').val(item.title === null ? '' : (item.title.area).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtTitleDate').val(item.title === null ? '' : item.title.date);
                            jQuery('#txtTitleDate').datepicker("update", item.title === null ? '' : item.title.date);
                            jQuery('#txtTitleResolution').val(item.title === null ? '' : item.title.resolution);
                            jQuery('#txtTitleRegistrationDate').val(item.title === null ? '' : item.title.enrollmentDate);
                            jQuery('#txtTitleRegistrationDate').datepicker("update", item.title === null ? '' : item.title.enrollmentDate);
                            jQuery('#txtFile').val(item.publicRecord === null ? '' : item.publicRecord.file);
                            jQuery('#txtPlace').val(item.publicRecord === null ? '' : item.publicRecord.place);
                            jQuery('#txtFormulationDate').val(item.formulationDate);
                            jQuery('#txtFormulationDate').datepicker("update", item.formulationDate);
                            jQuery('#txtCoordinateRegistrationDate').val(item.coordinate2 === null ? '' : item.coordinate2.enrollmentDate);
                            jQuery('#txtCoordinateRegistrationDate').datepicker("update", item.coordinate2 === null ? '' : item.coordinate2.enrollmentDate);
                            jQuery('#txtDateOrigin').val(item.dateOrigin);
                            jQuery('#txtDateOrigin').datepicker("update", item.dateOrigin);
                            jQuery('#txtElectronicCertificate').val(item.electronicCertificate);
                            jQuery('#txtCodeOld').val(item.miningConcessionOld === null ? '' : item.miningConcessionOld.code);
                            jQuery('#txtNameOld').val(item.miningConcessionOld === null ? '' : item.miningConcessionOld.name);
                            jQuery('#txtHolderOld').val(item.miningConcessionOld === null ? '' : item.miningConcessionOld.holder);
                            jQuery('#txtExtinctionCausalOld').val(item.miningConcessionOld === null ? '' : item.miningConcessionOld.extinctionCausal);
                            jQuery('#txtExtinctionDateOld').val(item.miningConcessionOld === null ? '' : item.miningConcessionOld.extinctionDate);
                            jQuery('#txtExtinctionDateOld').datepicker("setDates", item.miningConcessionOld === null ? '' : item.miningConcessionOld.extinctionDate);
                            jQuery('#txtInstalledCapacity').val(item.installedCapacity);
                            jQuery('#ddlMineralType').val(item.mineralType === null ? 0 : item.mineralType.id);
                            jQuery('#ddlOrigin').val(item.origin === null ? 0 : item.origin.id);
                            jQuery('#ddlType').val(item.type === null ? 0 : item.type.id);
                            jQuery('#ddlSituation').val(item.situation === null ? 0 : item.situation.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit === null ? 0 : item.miningUnit.id);
                            jQuery('#ddlCondition').val(item.condition === null ? 0 : item.condition.id);
                            jQuery('#txaObservationCondition').val(item.observationCondition);
                            jQuery('#ddlStateManagement').val(item.stateManagement === null ? 0 : item.stateManagement.id);
                            jQuery('#ddlRegistryOffice').val(item.registryOffice === null ? 0 : item.registryOffice.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference === null ? 0 : item.spatialReference.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                            jQuery('#txtNameUea').val(item.uea === null ? '' : item.uea.name);
                            jQuery('#txtCodeUea').val(item.uea === null ? '' : item.uea.code);
                            jQuery('#txtInclusionDate').val(item.ueaInclusion === null ? '' : item.ueaInclusion.date);
                            jQuery('#txtInclusionResolution').val(item.ueaInclusion === null ? '' : item.ueaInclusion.resolution);
                            jQuery('#txtNameMP').val(item.miningProject === null ? '' : item.miningProject.name);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "miningconcession/miningconcession/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "miningconcession/miningconcession/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "miningconcession/miningconcession/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "miningconcession/miningconcession/searchtowncenters", item.id, null);
                            thiss.searchPays();
                            thiss.searchInvestment();
                            thiss.searchMinerals();
                            thiss.searchHolders();
                            thiss.searchOperators();
                            thiss.searchCoordinatesOld();
                            thiss.searchPermissions();
                            $('#btnAddPermission').hide();
                            $('#btnEditPermission').hide();
                            $('#btnDeletePermission').hide();
                            //thiss.searchAlerts();
                            //thiss.searchProcedureDocuments();
                            if (jQuery('#tbdResultMinerals > tr').length > 0)
                                jQuery('#ddlMineralType').attr('disabled', true);
                            //thiss.formAttachment.search(item.id);

                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                        });
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
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "situation.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "stateManagement.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "formulationDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "formulationArea",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "title.area",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "netArea",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }
                        ];
                        _super.prototype.search.call(this, url, options, function (data) {
                            data.items.forEach(function (item) {
                                thiss.$table.find('>tbody>tr[data-uniqueid="' + item.id + '"]').attr("data-uniquecode", item.code);
                            });
                        });
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            holder: {
                                id: jQuery('#ddlHolderSearch').int32(),
                                holderGroup: {
                                    id: jQuery('#ddlHolderGroupSearch').int32()
                                }
                            },
                            electronicCertificate: jQuery('#txtElectronicCertificateSearch').string(),
                            title: { resolution: jQuery('#txtTitleResolutionSearch').string() },
                            mineralType: {
                                id: jQuery('#ddlMineralTypeSearch').int32()
                            },
                            situation: {
                                id: jQuery('#ddlSituationSearch').int32()
                            },
                            miningUnit: {
                                id: jQuery('#ddlMiningUnitSearch').int32()
                            },
                            condition: {
                                id: jQuery('#ddlConditionSearch').int32()
                            },
                            district: {
                                id: jQuery('#ddlDistrictSearch').string() === null ? "0" : jQuery('#ddlDistrictSearch').string(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').string(),
                                    department: {
                                        id: jQuery('#ddlDepartmentSearch').string()
                                    }
                                }
                            },
                            nationalCartography: {
                                id: jQuery('#ddlNationalCartographySearch').string()
                            },
                            hydrographicBasin: {
                                id: jQuery('#ddlHydrographicBasinSearch').string()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReferenceSearch').int32()
                            },
                            stateManagement: {
                                id: jQuery('#ddlStateManagementSearch').int32()
                            },
                            formulationDateStar: jQuery('#txtFormulationDateStartSearch').date(),
                            formulationDateEnd: jQuery('txtFormulationDateEndSearch').date(),
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtName').string(),
                            observation: jQuery('#txaObservation').string(),
                            description: jQuery('#txaDescription').string(),
                            netArea: jQuery('#txtNetArea').number(),
                            formulationArea: jQuery('#txtFormulationArea').number(),
                            title: {
                                area: jQuery('#txtAreaTitle').number(),
                                date: jQuery("#txtTitleDate").date(),
                                resolution: jQuery("#txtTitleResolution").string(),
                                enrollmentDate: jQuery("#txtTitleRegistrationDate").date()
                            },
                            publicRecord: {
                                file: jQuery('#txtFile').string(),
                                place: jQuery('#txtPlace').string()
                            },
                            coordinate2: {
                                enrollmentDate: jQuery("#txtCoordinateRegistrationDate").date()
                            },
                            miningconcessionold: {
                                code: jQuery('#txtCodeOld').number(),
                                name: jQuery("#txtNameOld").string(),
                                holder: jQuery("#txtHolderOld").string(),
                                extinctioncausal: jQuery("#txtExtinctionCausalOld").string()
                                //,
                                //extinctiondate: jQuery("#txtExtinctionDateOld").date()
                            },
                            formulationDate: jQuery("#txtFormulationDate").date(),
                            formulationHour: jQuery("#txtFormulationHour").string(),
                            dateOrigin: jQuery("#txtDateOrigin").date(),
                            electronicCertificate: jQuery("#txtElectronicCertificate").string(),
                            installedCapacity: jQuery('#txtInstalledCapacity').number(),
                            mineralType: {
                                id: jQuery('#ddlMineralType').int32()
                            },
                            origin: {
                                id: jQuery('#ddlOrigin').int32()
                            },
                            type: {
                                id: jQuery('#ddlType').int32()
                            },
                            situation: {
                                id: jQuery('#ddlSituation').int32()
                            },
                            miningUnit: {
                                id: jQuery('#ddlMiningUnit').int32()
                            },
                            condition: {
                                id: jQuery('#ddlCondition').int32()
                            },
                            observationCondition: jQuery("#txaObservationCondition").string(),
                            stateManagement: {
                                id: jQuery('#ddlStateManagement').int32()
                            },
                            registryOffice: {
                                id: jQuery('#ddlRegistryOffice').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#txtFormulationDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha de formulación.';
                                jQuery('#txtFormulationDate').focus();
                            } else if (jQuery('#txtFormulationHour').string() === '') {
                                success = false;
                                message = 'Ingrese la Hora de formulación.';
                                jQuery('#txtFormulationHour').focus();
                            } else if (jQuery('#ddlType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo.';
                                jQuery('#ddlType').focus();
                            } else if (jQuery('#ddlMineralType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de mineral.';
                                jQuery('#ddlMineralType').focus();
                            } else if (jQuery('#ddlCondition').int32() === 0) {
                                success = false;
                                message = 'Seleccione la condición.';
                                jQuery('#ddlCondition').focus();
                            } else if (jQuery('#ddlStateManagement').int32() === 0) {
                                success = false;
                                message = 'Seleccione el estado de gestión.';
                                jQuery('#ddlStateManagement').focus();
                            } else if (jQuery('#ddlOrigin').int32() === 0) {
                                success = false;
                                message = 'Seleccione el origen.';
                                jQuery('#ddlOrigin').focus();
                            } else if (jQuery('#ddlSituation').int32() === 0) {
                                success = false;
                                message = 'Seleccione la situación.';
                                jQuery('#ddlSituation').focus();
                            } else if (jQuery('#ddlMiningUnit').int32() === 0) {
                                success = false;
                                message = 'Seleccione la unidad minera.';
                                jQuery('#ddlMiningUnit').focus();
                                //} else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                //    success = false;
                                //    message = 'Seleccione el sistema referencial.';
                                //    jQuery('#ddlSpatialReference').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.miningconcession.BaseMain);
                miningconcession.Main = Main;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.Main.execute();