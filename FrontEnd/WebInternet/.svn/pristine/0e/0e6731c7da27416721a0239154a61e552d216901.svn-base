(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningstandard) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$tblResult = null;
                        this.$btnSearch = null;
                        this.$btnCalculate = null;
                        this.$lblValidityLastYear1 = null;
                        this.$lblValidityLastYear2 = null;
                        this.$lblValidityCurrentYear1 = null;
                        this.$lblValidityCurrentYear2 = null;
                        this.$lblPenalityLastYear = null;
                        this.$lblPenalityCurrentYear = null;
                        this.$lblTotalDollars = null;
                        this.$lblTotalPen = null;
                        this.$ddlHolder = null;

                        this.parseoFloat = function (item) {
                            return parseFloat(item.text().replace("US", "").replace("$", "").replace("-", "").replace(",", "").replace('S/.', "").trim())
                        };
                        this.searchPaysOfficial = function () {
                            var thiss = this;
                            if (thiss.$tblResult.find("tbody").length === 0)
                                thiss.$tblResult.append("<tbody></tbody>");
                            thiss.$tblResult.find(">tbody").empty();
                            var options = {};
                            options.isJson = false;
                            options.data = { holderId: thiss.$ddlHolder.val() };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningstandard/searchminingconcessionsbyholder', options, function (items) {
                                if (items.length > 0) {
                                    $tbd = thiss.$tblResult.find(">tbody");
                                    var html = "";
                                    for (var i = 0; i < items.length ; i++) {
                                        items[i].code = items[i].code || '';
                                        html = '<tr data-uniqueid="' + items[i].code + '">';
                                        html += '<td><input type="checkbox" id="chk' + items[i].code + '" name="chk' + items[i].code + '" value="' + items[i].code + '" /></td>';
                                        html += '<td>' + (items[i].code || '') + '</td>';
                                        html += '<td>' + (items[i].name || '') + '</td>';
                                        html += '<td>' + (items[i].itemValidity.itemLastYear.saldo) + '</td>';
                                        html += '<td>' + (items[i].itemPenality.itemLastYear.saldo) + '</td>';
                                        html += '<td>' + (items[i].itemValidity.itemCurrentYear.saldo) + '</td>';
                                        html += '<td>' + (items[i].itemPenality.itemCurrentYear.saldo) + '</td>';
                                        html += '</tr>';
                                        $tbd.append(html);
                                    }
                                    com.jtm.helper.Table.highlightRow(thiss.$tblResult);
                                }
                            });
                        };
                        this.calculate = function () {
                            var thiss = this;
                            var validityCurrentYear1 = 0, validityCurrentYear2 = 0, validityLastYear1 = 0, validityLastYear2 = 0, penalityCurrentYear = 0, penalityLastYear = 0;
                            thiss.$tblResult.find('>tbody input:checkbox:checked').toArray().forEach(function (item) {
                                if ($(item).length > 0) {
                                    var tr = $(item).closest('tr').find('td');
                                    if (($(tr[3]).text()).indexOf("$") >= 0)
                                        validityLastYear1 += thiss.parseoFloat($(tr[3]));
                                    else if (($(tr[2]).text()).indexOf('S/.') >= 0)
                                        validityLastYear2 += thiss.parseoFloat($(tr[3]));
                                    if (($(tr[5]).text()).indexOf("$") >= 0)
                                        validityCurrentYear1 += thiss.parseoFloat($(tr[5]));
                                    else if (($(tr[5]).text()).indexOf('S/.') >= 0)
                                        validityCurrentYear2 += thiss.parseoFloat($(tr[5]));

                                    penalityLastYear += thiss.parseoFloat($(tr[4]));
                                    penalityCurrentYear += thiss.parseoFloat($(tr[6]));
                                }
                            });
                            thiss.$lblValidityLastYear1.text("US$ " + validityLastYear1.toFixed(2));
                            thiss.$lblValidityLastYear2.text("S/. " + validityLastYear2.toFixed(2));
                            thiss.$lblValidityCurrentYear1.text("US$ " + validityCurrentYear1.toFixed(2));
                            thiss.$lblValidityCurrentYear2.text("S/. " + validityCurrentYear2.toFixed(2));
                            thiss.$lblPenalityLastYear.text("US$ " + penalityLastYear.toFixed(2));
                            thiss.$lblPenalityCurrentYear.text("US$ " + penalityCurrentYear.toFixed(2));
                            thiss.$lblTotalDollars.text((validityLastYear1 + validityCurrentYear1 + penalityLastYear + penalityCurrentYear).toFixed(2));
                            thiss.$lblTotalPen.text((validityLastYear2 + validityCurrentYear2).toFixed(2));

                            if (thiss.$lblTotalDollars.text() == "0.00" && thiss.$lblTotalPen.text() == "0.00")
                                alert("Primero realice una busqueda o seleccione 1 o más registros");
                        };
                        this.generateReport = function () {
                            var thiss = this;
                            var year = (new Date).getFullYear();
                            var yearOld = year - 1;
                            var formats = '';
                            var years = [];
                            years.push(year);
                            years.push(yearOld);
                            thiss.$tblResult.find('>tbody input:checkbox:checked').toArray().forEach(function (chk) {
                                var tds = $(chk).closest('tr').find('td');
                                for (var y = 0; y < years.length ; y++) {
                                    format = '';
                                    if ($(tds[3]).text() != "0.00" && years[y] == yearOld) {
                                        format += $(tds[1]).text() + ',';
                                        format += $(tds[2]).text() + ",";
                                        if (($(tds[3]).text()).indexOf("$") >= 0) {
                                            format += years[y] + ',002,001,' + thiss.parseoFloat($(tds[3]));
                                        }
                                        else if (($(tds[3]).text()).indexOf("S/") >= 0) {
                                            format += years[y] + ',001,001,' + thiss.parseoFloat($(tds[3]));
                                        }
                                    }
                                    else if ($(tds[4]).text() != "0.00" && years[y] == yearOld) {
                                        format += $(tds[1]).text() + ',';
                                        format += $(tds[2]).text() + ",";
                                        if (($(tds[4]).text()).indexOf("$") >= 0) {
                                            format += years[y] + ',002,002,' + thiss.parseoFloat($(tds[4]));
                                        }
                                    }
                                    if ($(tds[5]).text() != "0.00" && years[y] == year) {
                                        format += $(tds[1]).text() + ',';
                                        format += $(tds[2]).text() + ",";
                                        if (($(tds[5]).text()).indexOf("$") >= 0) {
                                            format += years[y] + ',002,001,' + thiss.parseoFloat($(tds[5]));
                                        }
                                        else if (($(tds[5]).text()).indexOf("S/") >= 0) {
                                            format += years[y] + ',001,001,' + thiss.parseoFloat($(tds[5]));
                                        }
                                    }
                                    else if ($(tds[6]).text() != "0.00" && years[y] == year) {
                                        format += $(tds[1]).text() + ',';
                                        format += $(tds[2]).text() + ",";
                                        if (($(tds[6]).text()).indexOf("$") >= 0) {
                                            format += years[y] + ',002,002,' + thiss.parseoFloat($(tds[6]));
                                        }
                                    }
                                    if (!String.isNullOrWhiteSpace(format))
                                        formats += format + ';';
                                }
                            });
                            if (formats != '')
                                thiss.downloadConfig(com.jtm.Server.contextPath + 'miningconcession/miningstandard/formdownload', formats);
                            else
                                alert("Selección almenos un registro");
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        this.$filFile = thiss.$main.find("#filFile");
                        this.$tblResult = thiss.$main.find('#tblResult');
                        this.$btnSearch = thiss.$main.find('#btnSearch');
                        this.$btnCalculate = thiss.$main.find('#btnCalculate');
                        this.$btnReport = thiss.$main.find('#btnReport');
                        this.$lblValidityLastYear1 = thiss.$main.find('#lblValidityLastYear1');
                        this.$lblValidityLastYear2 = thiss.$main.find('#lblValidityLastYear2');
                        this.$lblValidityCurrentYear1 = thiss.$main.find('#lblValidityCurrentYear1');
                        this.$lblValidityCurrentYear2 = thiss.$main.find('#lblValidityCurrentYear2');
                        this.$lblPenalityLastYear = thiss.$main.find('#lblPenalityLastYear');
                        this.$lblPenalityCurrentYear = thiss.$main.find('#lblPenalityCurrentYear');
                        this.$lblTotalDollars = thiss.$main.find('#lblTotalDollars');;
                        this.$lblTotalPen = thiss.$main.find('#lblTotalPen');;
                        this.$ddlHolder = thiss.$main.find('#ddlHolder');
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;

                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function (e) {
                            thiss.searchPaysOfficial();
                        });
                        thiss.$btnCalculate.off("click");
                        thiss.$btnCalculate.on("click", function (e) {
                            thiss.calculate();
                        });
                        thiss.$btnReport.off("click");
                        thiss.$btnReport.on("click", function (e) {
                            thiss.generateReport();
                        });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                miningstandard.Main = Main;
            })(miningconcession.miningstandard || (miningconcession.miningstandard = {}));
            var miningconcession = miningconcession.miningstandard;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningstandard.Main.execute();