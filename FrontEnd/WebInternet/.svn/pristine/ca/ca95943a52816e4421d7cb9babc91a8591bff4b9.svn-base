(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (pay) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "sp";
                        this.$filFile = null;
                        this.processFile = function () {
                            var thiss = this;
                            var options = {
                                data: {},
                                attachments: [{ id: "filFile", file: thiss.$filFile[0].files[0] }],
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/pay/search', options, function (items) {
                                thiss.$filFile.val("");
                                thiss.fillResult(items);
                            });
                            function validate() {
                                if (thiss.$filFile.val() === "") {
                                    alert('Seleccione un archivo excel');
                                    return false;
                                }
                                else
                                    return true;
                            }
                        };
                        this.fillResult = function (items) {
                            var thiss = this;
                            thiss.$table.find('>tbody').empty();
                            if (items === undefined || items === null) return;
                            if (items.length === 0) return;
                            jQuery('#divTotalResult>span').html(items.length);
                            writeBody();
                            function writeBody() {
                                var html = '';
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    html += '<tr class="' + (item.miningConcession.id === null ? 'gh-error' : '') + '" '+'>';
                                    html += '<td><button type="button" class="btn btnDelete" id="btnDelete' + i + '"><i class="glyphicon glyphicon-remove-sign"></i></button></td>';
                                    html += '<td data-miningconcessionid="' + (item.miningConcession.id || 0) + '">';
                                    html += '<span>' + item.miningConcession.code + '</span>';
                                    html += '</td>';
                                    html += '<td>' + item.miningConcession.name + '</td>';
                                    html += '<td>' + (item.year !== "" ? item.year : '&nbsp;') + '</td>';
                                    html += '<td data-currencytypeid="' + (item.currencyType.id || 0) + '">';
                                    html += '<span>' + (item.currencyType.id !== null ? item.currencyType.name : '&nbsp;') + '</span>';
                                    html += '</td>';
                                    html += '<td data-conceptid="' + (item.concept.id || 0) + '">';
                                    html += '<span>' + (item.concept.id !== null ? item.concept.name : "&nbsp;") + '</span>';
                                    html += '</td>';
                                    html += '<td>' + (item.amountPaid !== "" ? item.amountPaid : + '&nbsp;') + '</td>';
                                    html += "</tr>";
                                }
                                thiss.$table.find('>tbody').append(html);
                            }
                            thiss.$table.find('>tbody').off('click');
                            thiss.$table.find('>tbody').on('click', '.btnDelete', function (e) {
                                if (confirm("¿Esta seguro de eliminar el registro?")) {
                                    var $tr = $(this).closest('tr');
                                    $tr.remove();
                                }
                            });
                        };
                        this.saveMassive = function () {
                            var thiss = this;
                            var pays = [];
                            thiss.$table.find('>tbody>tr').toArray().forEach(function (tr) {
                                if (jQuery(tr).hasClass("gh-error") === true) return;
                                pays.push({
                                    id: 0,
                                    miningConcession: { id: jQuery(tr).find('td:eq(1)').attr('data-miningconcessionid') },
                                    year: jQuery(tr).find("td:eq(3)").text(),
                                    currencyType: { id: jQuery(tr).find('td:eq(4)').attr('data-currencytypeid') },
                                    concept: { id: jQuery(tr).find('td:eq(5)').attr('data-conceptid') },
                                    amountPaid: jQuery(tr).find("td:eq(6)").text(),
                                    individualCost: (jQuery(tr).find('td:eq(5)').attr('data-conceptid') == 1) ? jQuery('#txtIndividualCostValidities').number() : jQuery('#txtIndividualCostPenalties').number()
                                });
                            });
                            validateConcession();
                            function validateConcession() {
                                var i = 0;
                                pays.forEach(function (pay) {
                                    if (pay.miningConcession.id === "0")
                                        i++;
                                });
                                if (i > 0)
                                    toastr.info('Contiene ' + i + ' concession que no ha guardado en su base de datos.');
                            }
                            var item = {
                                financialEntity: { id: jQuery('#ddlFinancialEntity').int32() },
                                receiptDate: jQuery('#txtReceiptDate').date(),
                                receiptNumber: jQuery('#txtReceiptNumber').val(),
                                pays: pays
                            };
                            var options = {
                                data: { item: JSON.stringify(item) },
                                isJson: false,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'miningconcession/pay/savemassive', options, function () {
                                thiss.$table.find('>tbody').empty();
                                thiss.$filFile.val("");
                                jQuery('#divTotalResult>span').html(thiss.$table.find('>tbody>tr').length);
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#ddlFinancialEntity').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione la entidad financiera.';
                                    jQuery('#ddlFinancialEntity').focus();
                                } else if (jQuery('#txtReceiptDate').val() === "") {
                                    success = false;
                                    message = 'Ingrese la fecha de recibo.';
                                    jQuery('#txtReceiptDate').focus();
                                } else if (jQuery('#txtReceiptNumber').val() === "") {
                                    success = false;
                                    message = 'Ingrese el numero de recibo.';
                                    jQuery('#txtReceiptNumber').focus();
                                } else if (pays.length === 0) {
                                    success = false;
                                    message = 'No contiene ningun pago correcto.';
                                }
                                pays.forEach(function (pay) {
                                    if (pay.currencyType.id === "0") {
                                        success = false;
                                        message = 'No se ha ingresado ningun tipo de moneda.';
                                    }
                                    if (pay.concept.id === "0") {
                                        success = false;
                                        message = 'No se ha ingresado ningun concepto.';
                                    }
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.formFormat = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Formato de Archivo",
                                width: '650',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/pay/formformat", function () {
                                var $img = jQuery('#imgFormat');
                                $img.attr("src", com.jtm.Server.contextPath + 'assets/img/formats/pay.png');
                            });
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        this.$filFile = thiss.$main.find("#filFile");
                        thiss.datePicker('#txtReceiptDate');
                        _super.prototype.initConfig.call(this);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnUpload').off("click");
                        jQuery('#btnUpload').on("click", function (e) {
                            thiss.$filFile.trigger("click");
                        });
                        thiss.$filFile.off("change");
                        thiss.$filFile.on("change", function (e) {
                            if (e.originalEvent.target.files.length) {
                                e.preventDefault();
                                e.stopPropagation();
                                thiss.processFile();
                            }
                        });
                        jQuery("#btnSave").off("click")
                        jQuery("#btnSave").on("click", function (e) {
                            thiss.saveMassive();
                        });
                        jQuery("#btnFormat").off("click")
                        jQuery("#btnFormat").on("click", function (e) {
                            thiss.formFormat();
                        });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                pay.Main = Main;
            })(miningconcession.pay || (miningconcession.pay = {}));
            var miningconcession = miningconcession.pay;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.pay.Main.execute();