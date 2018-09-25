(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (data) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "data";
                        this.$btnUpload = null;
                        this.$btnFormat = null;
                        this.$btnImport = null;
                        this.$ddlLegalFrame = null;
                        this.$ddlAgreement = null;
                        this.$ddlActivity = null;
                        this.$ddlStation = null;
                        this.$ddlLegalFrameSearch = null;
                        this.$ddlAgreementSearch = null;
                        this.$ddlActivitySearch = null;
                        this.$ddlStationSearch = null;
                        this.$divTotalResultData = null;
                        this.$tblResultData = null;
                        this.$tblParameter = null;
                        this.$filFile = null;
                        this.fillDropDownList = function (ddlLegalFrame, ddlAgreement, ddlActivity, ddlStation, isWithStation) {
                            var thiss = this;
                            ddlLegalFrame = ddlLegalFrame || thiss.$ddlLegalFrameSearch;
                            ddlAgreement = ddlAgreement || thiss.$ddlAgreementSearch;
                            ddlActivity = ddlActivity || thiss.$ddlActivitySearch;
                            ddlStation = ddlStation || thiss.$ddlStationSearch;
                            isWithStation = (typeof isWithStation === "boolean") ? isWithStation : true;
                            ddlLegalFrame.off("change");
                            ddlLegalFrame.on("change", function (e) {
                                ddlActivity.empty();
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "environment/agreement/searchbylegalframe",
                                    ddl: ddlAgreement,
                                    data: { id: jQuery(this).int32() },
                                    callback: function (id) {
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "environment/activity/searchbyagreement",
                                            ddl: ddlActivity,
                                            data: { id: id }
                                        });
                                        if (isWithStation === true) {
                                            com.jtm.helper.DropDownList.fill({
                                                url: com.jtm.Server.contextPath + "environment/station/searchbyagreement",
                                                ddl: ddlStation,
                                                data: { agreementId: id }
                                            });
                                        }
                                    }
                                });
                            });
                            ddlLegalFrame.trigger("change");
                        };
                        this.processFile = function (file) {
                            var thiss = this;
                            var item = {
                                legalFrameId: thiss.$ddlLegalFrame.int32(),
                                agreementId: thiss.$ddlAgreement.int32()
                            };
                            var options = {
                                data: item,
                                attachments: [{ id: "filFile", file: file }],
                                isJson: false,
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/data/searchfile', options, function (items) {
                                thiss.$filFile.val("");
                                thiss.fillResult(items);
                            });
                            function validate() {
                                if (thiss.$filFile.val() === "") {
                                    alert('Seleccione un archivo excel');
                                    return false;
                                } else if (thiss.$ddlLegalFrame.int32() === 0) {
                                    alert('Seleccione un IGA / Licencia');
                                    return false;
                                } else if (thiss.$ddlAgreement.int32() === 0) {
                                    alert('Seleccione un compromiso');
                                    return false;
                                } else if (thiss.$ddlActivity.int32() === 0) {
                                    alert('Seleccione una actividad');
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.fillResult = function (items) {
                            var thiss = this;
                            thiss.cleanTable(thiss.$tblResultData);
                            if (items === undefined || items === null) return;
                            if (items.length === 0) return;
                            var column = 4;
                            writeHeader();
                            writeBody();
                            thiss.$tblResultData.find('>caption>span').html(thiss.$tblResultData.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultData);
                            function writeHeader() {
                                if (items[0] === null) return;
                                if (items[0].headers === null) return;
                                thiss.$tblResultData.append("<thead></thead>");
                                thiss.$tblResultData.find('>thead').append("<tr></tr>");
                                thiss.$tblResultData.find('>thead>tr').append("<th><input type='checkbox'/></th>");
                                items[0].headers.forEach(function (header, i) {
                                    if (i < column)
                                        thiss.$tblResultData.find('>thead>tr').append("<th>" + header.parameter.name + "</th>");
                                    else if (header.parameter.id === null)
                                        thiss.$tblResultData.find('>thead>tr').append('<th data-parameterid="0" class="gh-error"><button type="button" class="btn btn-sm btnParameter"><i class="glyphicon glyphicon-plus-sign"></i></button> ' + header.parameter.name + '</th>');
                                    else
                                        thiss.$tblResultData.find('>thead>tr').append("<th data-parameterid='" + header.parameter.id + "'>" + header.parameter.name + "</th>");
                                });
                            }
                            function writeBody() {
                                thiss.$tblResultData.append("<tbody></tbody>");
                                items.forEach(function (item, i) {
                                    if (item.datas.length === 0) return;
                                    thiss.$tblResultData.find('>tbody').append("<tr></tr>");
                                    thiss.$tblResultData.find('>tbody>tr:last').append("<td><input type='checkbox'/></td>");
                                    if (item.station.id === null) {
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td data-stationid="0" class="gh-error"><button type="button" class="btn btn-sm btnStation"><i class="glyphicon glyphicon-plus-sign"></i></button> ' + item.station.code + '</td>');
                                    } else {
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td data-stationid= "' + item.station.id + '">' + item.station.code + '</td>');
                                    }
                                    thiss.$tblResultData.find('>tbody>tr:last').append('<td data-stationid= "' + item.station.id + '">' + item.sample.code + '</td>');
                                    thiss.$tblResultData.find('>tbody>tr:last').append('<td data-stationid= "' + item.station.id + '">' + item.date + '</td>');
                                    thiss.$tblResultData.find('>tbody>tr:last').append('<td data-stationid= "' + item.station.id + '">' + item.hour + '</td>');
                                    item.datas.forEach(function (data) {
                                        thiss.$tblResultData.find('>tbody>tr:last').append("<td>" + '<span id="spnValue"> ' + data.value + '</span> ' + '<span id="spnOperator"> ' + data.operator + '</span> ' + "</td>");
                                    });
                                });
                            }
                            thiss.$tblResultData.find('>tbody').off('click', '>tr .btnStation');
                            thiss.$tblResultData.find('>tbody').on('click', '>tr .btnStation', function (e) {
                                thiss.formAddStation($(this).closest('td'));
                            });
                            thiss.$tblResultData.find('>thead').off('click', '.btnParameter');
                            thiss.$tblResultData.find('>thead').on('click', '.btnParameter', function (e) {
                                thiss.formAddParameter($(this).closest('th'));
                            });
                        };
                        this.cleanTable = function ($tbl) {
                            $tbl.find('>thead').remove();
                            $tbl.find('>tbody').remove();
                            $tbl.find('>tfoot').remove();
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                        };
                        this.saveMassive = function () {
                            var thiss = this;
                            if (thiss.$tblResultData.find('>tbody>tr').length === 0) {
                                toastr.info("No hay elementos para grabar");
                                return;
                            }
                            var datas = [];
                            var datas2 = null;
                            var parameters = thiss.$tblResultData.find('>thead>tr>th[data-parameterid]').toArray();
                            var $tr = null;
                            thiss.$tblResultData.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');
                                values = $tr.find("td #spnValue");
                                operators = $tr.find("td #spnOperator");
                                datas2 = [];
                                parameters.forEach(function (parameter, i) {
                                    value = jQuery(values[i]).text();
                                    operator = jQuery(operators[i]).text();
                                    datas2.push({ parameter: { id: $(parameter).attr('data-parameterid') }, value: value, operator: operator });
                                });
                                datas.push({
                                    activity: { id: thiss.$ddlActivity.int32() },
                                    station: { id: $tr.find('td:eq(1)').attr('data-stationid') },
                                    sample: { code: $tr.find('td:eq(2)').text() },
                                    date: $tr.find('td:eq(3)').text(),
                                    hour: $tr.find('td:eq(4)').text(),
                                    datas: datas2
                                });
                            });
                            var options = {
                                data: { items: datas },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/data/savemassive', options, function () {
                                thiss.cleanTable(thiss.$tblResultData);
                                thiss.$filFile.val("");
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (datas.length === 0) {
                                    success = false;
                                    message = 'No ha seleccionado ningun dato.';
                                }
                                if (thiss.$ddlActivity.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione una actividad.';
                                }
                                datas.forEach(function (data) {
                                    if (data.station.id == 0) {
                                        success = false;
                                        message = 'No se ha ingresado alguna estación.';
                                    }
                                    else if (data.datas.length === 0) {
                                        success = false;
                                        message = 'No contiene ningun parametro.';
                                    }
                                    data.datas.forEach(function (data2) {
                                        if (data2.parameter.id == 0) {
                                            success = false;
                                            message = 'El parametro contiene un error.';
                                        }
                                    });
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteMassive = function () {
                            var thiss = this;
                            if (thiss.$tblResultData.find('>tbody>tr').length === 0 || thiss.$tblResultData.find('>tbody input:checkbox:checked').length === 0) {
                                toastr.info("No hay elementos para eliminar");
                                return;
                            }
                            var $tr = null;
                            thiss.$tblResultData.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');
                                $tr.remove();
                            });
                            thiss.$tblResultData.find('>caption>span').html(thiss.$tblResultData.find('>tbody>tr').length);
                        };
                        this.formAddStation = function ($obj) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Añadir Estación",
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/data/formaddstation", function () {
                                thiss.$ddlStationMassive = thiss.$divPopup.find('#ddlStationMassive');
                                thiss.$btnAddStationMassive = thiss.$divPopup.find('#btnAddStationMassive');
                                thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchstation', { data: { id: thiss.$ddlAgreement.int32() } }, function (items) {
                                    items.forEach(function (item) {
                                        thiss.$ddlStationMassive.append('<option value="' + item.id + '">' + item.code + '</option>');
                                    });
                                });
                                thiss.$btnAddStationMassive.off('click');
                                thiss.$btnAddStationMassive.on('click', function (e) {
                                    var existParameter = false;
                                    var $tds = thiss.$tblResultData.find('>tbody>tr').toArray();
                                    for (var i = 0; i < $tds.length; i++) {
                                        if (Number(jQuery($tds[i]).find('td:eq(1)').attr('data-stationid')) == thiss.$ddlStationMassive.find(':selected').int32()) {
                                            alert('La estacion seleccionado ya se encuentra en su lista de estaciones');
                                            existParameter = true;
                                            break;
                                        }
                                    }
                                    if (!existParameter) {
                                        $obj.removeClass("gh-error");
                                        $obj.attr('data-stationid', thiss.$ddlStationMassive.find(':selected').int32());
                                        $obj.html(thiss.$ddlStationMassive.find(':selected').text());
                                        thiss.$divPopup.dialog('close');
                                    }
                                });
                            });
                        };
                        this.formAddParameter = function ($obj) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Añadir Parametro",
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/data/formaddparameter", function () {
                                thiss.$ddlParameterMasive = thiss.$divPopup.find('#ddlParameterMassive');
                                thiss.$btnAddParameter = thiss.$divPopup.find('#btnAddParameter');
                                thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchparameters', { data: { id: thiss.$ddlAgreement.int32() } }, function (items) {
                                    items.forEach(function (item, i) {
                                        thiss.$ddlParameterMasive.append('<option value="' + item.id + '" data-symbol="' + (item.symbol === "" ? '' : item.symbol) + '" >' + item.name + '</option>');
                                    });
                                });
                                thiss.$btnAddParameter.off('click');
                                thiss.$btnAddParameter.on('click', function (e) {
                                    var existParameter = false;
                                    var $ths = thiss.$tblResultData.find('>thead>tr>th').toArray();
                                    for (var i = 0; i < $ths.length; i++) {
                                        if (Number(jQuery($ths[i]).attr('data-parameterid')) === thiss.$ddlParameterMasive.find(':selected').int32()) {
                                            alert('El parametro seleccionado ya se encuentra en su lista de parametro');
                                            existParameter = true;
                                            break;
                                        }
                                    }
                                    if (!existParameter) {
                                        $obj.removeClass("gh-error");
                                        $obj.attr('data-parameterid', thiss.$ddlParameterMasive.find(':selected').int32());
                                        $obj.html(thiss.$ddlParameterMasive.find(':selected').attr('data-symbol'));
                                        thiss.$divPopup.dialog('close');
                                    }
                                });
                            });
                        };
                        this.formFormat = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Formato de Archivo",
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/data/formformat", function () {
                                var $img = thiss.$divPopup.find('#imgFormat');
                                $img.attr("src", com.jtm.Server.contextPath + 'assets/img/formats/data.png');
                            });
                        };
                        this.fillTableResult = function (items) {
                            var thiss = this;
                            thiss.cleanTable(thiss.$table);
                            if (items === null || items.length === 0) return;
                            if (items[0] === null || items[0].headers === null || items[0].headers.length === 0) return;
                            if (items[0] === null || items[0].footers === null || items[0].footers.length === 0) return;
                            var cssMaximum = items[0].footers[0].code;
                            var cssMinimum = items[0].footers[1].code;
                            var cssDefault = "#FFFFFF";
                            writeHeader();
                            writeBody();
                            writeFooter();
                            thiss.$table.find('>caption>span').html(thiss.$table.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$table);
                            function writeHeader() {
                                thiss.$table.append("<thead></thead>");
                                thiss.$table.find('>thead').append("<tr></tr>");
                                thiss.$table.find('>thead>tr').append("<th>Estación</th>");
                                thiss.$table.find('>thead>tr').append("<th>Muestra</th>");
                                thiss.$table.find('>thead>tr').append("<th>Fecha</th>");
                                thiss.$table.find('>thead>tr').append("<th>Hora</th>");
                                items[0].headers.forEach(function (header, i) {
                                    thiss.$table.find('>thead>tr').append("<th>" + header.parameter.name + " (" + header.parameter.symbol + ") </th>");
                                });
                            }
                            function writeBody() {
                                thiss.$table.append("<tbody></tbody>");
                                items.forEach(function (item, i) {
                                    if (item.datas.length === 0) return;
                                    thiss.$table.find('>tbody').append('<tr data-uniqueid=' + item.station.id + ' data-stationid=' + item.station.id + ' data-activityid=' + item.activity.id + ' data-date=' + item.date + '></tr>');
                                    thiss.$table.find('>tbody>tr:last').append('<td>' + item.station.code + '</td>');
                                    thiss.$table.find('>tbody>tr:last').append('<td>' + item.sample.code + '</td>');
                                    thiss.$table.find('>tbody>tr:last').append('<td>' + item.date + '</td>');
                                    thiss.$table.find('>tbody>tr:last').append('<td>' + item.hour + '</td>');
                                    item.datas.forEach(function (data) {
                                        //thiss.$table.find('>tbody>tr:last').append("<td style='background-color:" + evaluate(data.value, data.parameter.maximumValue, data.parameter.minimumValue) + "'>" + data.value + "</td>");
                                        thiss.$table.find('>tbody>tr:last').append("<td>" + data.value + "</td>");
                                    });
                                });
                            }
                            function writeFooter() {
                                thiss.$table.append("<tfoot></tfoot>");
                                items[0].footers.forEach(function (footer, i) {
                                    thiss.$table.find('>tfoot').append("<tr style='background-color:" + footer.code + "'></tr>");
                                    thiss.$table.find('>tfoot>tr:last').append("<td colspan='4' class='text-right'>  " + footer.name + " </td>");
                                    footer.datas.forEach(function (data) {
                                        thiss.$table.find('>tfoot>tr:last').append("<td>" + (data.value === 0 ? '' : data.value) + "</td>");
                                    });
                                });
                                thiss.$table.find('>tfoot').append("<tr></tr>");
                                thiss.$table.find('>tfoot>tr:last').append("<td colspan='4' class='text-right'>Valor Mínimo</td>");
                                items[0].headers.forEach(function (item, i) {
                                    thiss.$table.find('>tfoot>tr:last').append("<td></td>");
                                });
                                thiss.$table.find('>tfoot').append("<tr></tr>");
                                thiss.$table.find('>tfoot>tr:last').append("<td colspan='4' class='text-right'>Valor Máximo</td>");
                                items[0].headers.forEach(function (item, i) {
                                    thiss.$table.find('>tfoot>tr:last').append("<td></td>");
                                });
                                thiss.$table.find('>tfoot').append("<tr></tr>");
                                thiss.$table.find('>tfoot>tr:last').append("<td colspan='4' class='text-right'>Promedio</td>");
                                items[0].headers.forEach(function (item, i) {
                                    thiss.$table.find('>tfoot>tr:last').append("<td></td>");
                                });
                                thiss.$table.find('>tfoot').append("<tr></tr>");
                                thiss.$table.find('>tfoot>tr:last').append("<td colspan='4' class='text-right'><button id='btnRestore' class='btn'><i class='glyphicon glyphicon-refresh'></i> Restaurar Lim. defecto</button></td>");
                                items[0].headers.forEach(function (item, i) {
                                    thiss.$table.find('>tfoot>tr:last').append("<td parameter=" + item.parameter.id + " legalstandard=" + item.parameter.legalStandard.id + " position='" + (i + 1) + "'> " + fillList(item.legalStandards, "legalstandards") + "</td>");
                                });
                            }
                            function fillList(items, attr) {
                                var html = '';
                                html += '<select class="form-control ' + attr + '">';
                                items.forEach(function (item) {
                                    html += '<option value="' + item.id + '">' + item.name + '</option>';
                                });
                                html += '</select>';
                                return html;
                            }
                            function evaluate(value, maximumValue, minimunValue) {
                                var css = "";
                                if (maximumValue < value) css = cssMaximum;
                                else if (minimunValue > value) css = cssMinimum;
                                else css = cssDefault;
                                return css;
                            }
                            function searchMinimumAndMaximum($td) {
                                var id = $td.attr('parameter');
                                var legalStandardId = $td.find(':selected').int32();
                                thiss.detailConfig(com.jtm.Server.contextPath + 'environment/parameter/searchminimumandmaximum', {
                                    data: { id: id, legalStandardId: legalStandardId }, isJson: false
                                }, function (data) {
                                    if (data === null || data.item === null) return;
                                    var value = null;
                                    thiss.$table.find('>tbody>tr').toArray().forEach(function (tr) {
                                        value = $(tr).find('>td:eq(' +($td.index() + 3) + ')').text();
                                        $(tr).find('>td:eq(' + ($td.index() + 3) + ')')[0].style.setProperty('background-color', evaluate(value, data.item.maximumValue, data.item.minimumValue));
                                    });
                                    thiss.$table.find('>tfoot>tr:nth-child(1) td:eq(' + $td.index() + ')').text(data.item.maximumValue === 0 ? '' : data.item.maximumValue);
                                    thiss.$table.find('>tfoot>tr:nth-child(2) td:eq(' + $td.index() + ')').text(data.item.minimumValue === 0 ? '' : data.item.minimumValue);
                                });
                            }
                            thiss.$table.find('>tfoot>tr .legalstandards').off("change");
                            thiss.$table.find('>tfoot>tr .legalstandards').on("change", function (e) {
                                searchMinimumAndMaximum($(this).closest('td'));
                            });
                            thiss.$table.find('>tfoot>tr #btnRestore').off("click");
                            thiss.$table.find('>tfoot>tr #btnRestore').on("click", function (e) {
                                $(this).closest('tr').find('>td').toArray().forEach(function (td) {
                                    td = jQuery(td);
                                    td.find('select').val(td.attr('legalstandard'));
                                });
                                thiss.$table.find('>tfoot>tr .legalstandards').trigger("change");
                            });
                            thiss.$table.find('>tfoot>tr #btnRestore').trigger("click");
                            thiss.calculate();
                        };
                        this.calculate = function () {
                            var thiss = this;
                            var values = null;
                            var position = 3;
                            thiss.$table.find('>thead>tr>th').toArray().forEach(function (th, i) {
                                if (i <= position) return;
                                values = [];
                                thiss.$table.find('>tbody>tr').toArray().forEach(function (tr) {
                                    values.push(parseInt($(tr).find('>td:eq(' + i + ')').text()));
                                });
                                //console.log(values.reduce(function (a, b) { return a + b; }));
                                thiss.$table.find('>tfoot>tr:nth-child(3) td:eq(' + (i - position) + ')').text(values.min());
                                thiss.$table.find('>tfoot>tr:nth-child(4) td:eq(' + (i - position) + ')').text(values.max());
                                thiss.$table.find('>tfoot>tr:nth-child(5) td:eq(' + (i - position) + ')').text((values.reduce(function (a, b) { return a + b; }, 0) / values.length));
                            });
                        };
                        this.searchParameters = function () {
                            var thiss = this;
                            thiss.$tblParameter.find('>tbody').empty();
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/data/searchparameters', {
                                data: {
                                    item: {
                                        activity: {
                                            id: thiss.$ddlActivity.int32(),
                                            agreement: {
                                                id: thiss.$ddlAgreement.int32()
                                            }
                                        },
                                        station: {
                                            id: thiss.$ddlStation.int32()
                                        },
                                        date: thiss.$txtDate.date()
                                    }
                                },
                                isJson: false,
                                validate: validate()
                            }, function (items) {
                                if (items === undefined || items === null) return;
                                var html = '';
                                var viewControl = '';
                                items.forEach(function (item, i) {
                                    viewControl = (item.value > 0) ? ' value=' + item.value + '' : ' value="0" ';
                                    html += '<tr data-uniqueid="' + item.parameter.id + '" data-index="' + i + '" data-symbol="' + item.parameter.symbol + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.parameter.id + '" name="chk' + item.parameter.id + '" value="' + item.parameter.id + '" ' + (item.value > 0 ? ' checked="checked"' : '') + '/></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.parameter.name + '</td>';                                    
                                    html += '<td><input  type="text" maxlength="6" class="form-control text-right value" id="txt' + item.parameter.id + '"' + viewControl + '></td>';
                                    html += '<td>' + item.parameter.minimumValue + '</td>';
                                    html += '<td>' + item.parameter.maximumValue + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblParameter.find('>tbody').html(html);
                                thiss.$tblParameter.find('>caption>span').html(thiss.$tblParameter.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblParameter);
                            });
                            function validate() {
                                if (thiss.$ddlAgreement.int32() === 0) {
                                    alert('Seleccione un compromiso.');
                                    return false;
                                } else if (thiss.$ddlActivity.int32() === 0) {
                                    alert('Seleccione una actividad.');
                                    return false;
                                } else if (thiss.$ddlStation.int32() === 0) {
                                    alert('Seleccione una estacion.');
                                    return false;
                                } else if (thiss.$txtDate.val() === "") {
                                    alert('Ingrese una fecha.');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.saveMassive2 = function () {
                            var thiss = this;
                            if (thiss.$tblParameter.find('>tbody>tr').length === 0) {
                                toastr.info("No hay elementos para grabar");
                                return;
                            }
                            var datas = [];
                            var datas2 = [];
                            var $tr = null;
                            thiss.$tblParameter.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');
                                datas2.push({
                                    parameter: {
                                        id: $tr.attr('data-uniqueid')
                                    },
                                    value: $tr.find("td .value").val(),
                                    operator: $tr.find("td .value").val()
                                });
                            });
                            datas.push({
                                activity: {
                                    id: thiss.$ddlActivity.int32()
                                },
                                station: {
                                    id: thiss.$ddlStation.int32()
                                },
                                sample: {
                                    code: thiss.$txtSampleCode.val()
                                },
                                date: thiss.$txtDate.date(),
                                hour: thiss.$txtHour.val(),
                                datas: datas2
                            });
                            var options = {
                                data: {
                                    items: datas
                                },
                                isJson: false,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/data/savemassive', options, function () {
                                thiss.searchParameters();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (datas.length === 0) {
                                    success = false;
                                    message = 'No ha seleccionado ningun dato.';
                                } else if (thiss.$ddlActivity.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione una actividad.';
                                } else if (thiss.$ddlStation.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione una estacion.';
                                } else if (thiss.$txtSampleCode.val() === "") {
                                    success = false;
                                    message = 'Ingrese un código.';
                                }
                                datas.forEach(function (data) {
                                    if (data.station.id === 0) {
                                        success = false;
                                        message = 'No se ha seleccionado alguna estación.';
                                    }
                                    else if (data.datas.length === 0) {
                                        success = false;
                                        message = 'No contiene ningun parametro.';
                                    }
                                    data.datas.forEach(function (data2) {
                                        if (data2.parameter.id === 0) {
                                            success = false;
                                            message = 'El parametro es incorrecto.';
                                        }
                                        else if (data2.value == 0) {
                                            success = false;
                                            message = 'El parametro no contiene valor.';
                                        }
                                    });
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.downloadData = function () {
                            var thiss = this;
                            var name = "Datos";
                            if (thiss.$table.find('>tbody>tr').length > 0) {
                                com.jtm.helper.Table.toSpreadSheet(thiss.$table, name, name);
                            }
                            else
                                toastr.info("No hay registros para descargar");
                        };
                    }
                    Main.BTNIMPORT = "#btnImport";
                    Main.BTNUPLOAD = "#btnUpload";
                    Main.BTNFORMAT = "#btnFormat";
                    Main.BTNDELETEDATA = "#btnDeleteData";
                    Main.TXTDATE = "#txtDate";
                    Main.TXTHOUR = "#txtHour";
                    Main.TXTSAMPLECODE = "#txtSampleCode";
                    Main.TXTDATESEARCH = "#txtDateSearch";
                    Main.TXTENDDATESEARCH = "#txtDateEndSearch";
                    Main.DDLLEGALFRAMESEARCH = "#ddlLegalFrameSearch";
                    Main.DDLAGREEMENTSEARCH = "#ddlAgreementSearch";
                    Main.DDLACTIVITYSEARCH = "#ddlActivitySearch";
                    Main.DDLSTATIONSEARCH = "#ddlStationSearch";
                    Main.DDLLEGALFRAME = "#ddlLegalFrame";
                    Main.DDLAGREEMENT = "#ddlAgreement";
                    Main.DDLACTIVITY = "#ddlActivity";
                    Main.DDLSTATION = "#ddlStation";
                    Main.TBLRESULTDATA = "#tblResultData";
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$btnImport = this.$main.find(Main.BTNIMPORT);
                        this.$ddlLegalFrameSearch = this.$main.find(Main.DDLLEGALFRAMESEARCH);
                        this.$ddlAgreementSearch = this.$main.find(Main.DDLAGREEMENTSEARCH);
                        this.$ddlActivitySearch = this.$main.find(Main.DDLACTIVITYSEARCH);
                        this.$ddlStationSearch = this.$main.find(Main.DDLSTATIONSEARCH);
                        this.$txtDateSearch = this.$main.find(Main.TXTDATESEARCH);
                        this.$txtEndDateSearch = this.$main.find(Main.TXTENDDATESEARCH);
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.fillDropDownList();
                        thiss.datePicker(thiss.$txtDateSearch);
                        thiss.datePicker(thiss.$txtEndDateSearch);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        options = options || {};
                        options.urlForm = String.isNullOrWhiteSpace(options.urlForm) === true ? com.jtm.System.urlForm : options.urlForm;
                        options.urlSave = String.isNullOrWhiteSpace(options.urlSave) === true ? com.jtm.System.urlSave : options.urlSave;
                        options.urlDelete = String.isNullOrWhiteSpace(options.urlDelete) === true ? com.jtm.System.urlDelete : options.urlDelete;
                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.search();
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.clean();
                        });
                        thiss.$btnInsert.off("click");
                        thiss.$btnInsert.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.form(options.urlForm, 0);
                        });
                        thiss.$btnUpdate.off("click");
                        thiss.$btnUpdate.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.form(options.urlForm, -1);
                        });
                        thiss.$btnDelete.off("click");
                        thiss.$btnDelete.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.delete(options.urlDelete, 0);
                        });
                        thiss.$btnImport.off("click");
                        thiss.$btnImport.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formMassive(null, 0);
                        });
                        thiss.$btnDownload.off("click");
                        thiss.$btnDownload.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.downloadData();
                        });
                    };
                    Main.prototype.clean = function () {
                        var thiss = this;
                        thiss.cleanTable(thiss.$table);
                        thiss.$ddlLegalFrameSearch.trigger('change');
                        _super.prototype.clean.call(this);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$ddlLegalFrame = thiss.$form.find(Main.DDLLEGALFRAME);
                            thiss.$ddlAgreement = thiss.$form.find(Main.DDLAGREEMENT);
                            thiss.$ddlActivity = thiss.$form.find(Main.DDLACTIVITY);
                            thiss.$ddlStation = thiss.$form.find(Main.DDLSTATION);
                            thiss.$txtSampleCode = thiss.$form.find(Main.TXTSAMPLECODE);
                            thiss.$txtDate = thiss.$form.find(Main.TXTDATE);
                            thiss.$txtHour = thiss.$form.find(Main.TXTHOUR);
                            thiss.$tblParameter = thiss.$form.find(Main.TBLRESULTDATA);
                            thiss.$btnSearchParameter = thiss.$form.find('#btnSearchParameter');
                            thiss.datePicker(thiss.$txtDate);
                            thiss.fillDropDownList(thiss.$ddlLegalFrame, thiss.$ddlAgreement, thiss.$ddlActivity, thiss.$ddlStation, true);
                            thiss.$btnSave.off("click");
                            thiss.$btnSave.on("click", function (e) {
                                thiss.saveMassive2();
                            });
                            thiss.$btnSearchParameter.off("click");
                            thiss.$btnSearchParameter.on("click", function (e) {
                                thiss.searchParameters();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.formMassive = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$btnDeleteData = thiss.$form.find(Main.BTNDELETEDATA);
                            thiss.$btnUpload = thiss.$form.find(Main.BTNUPLOAD);
                            thiss.$btnFormat = thiss.$form.find(Main.BTNFORMAT);
                            thiss.$ddlLegalFrame = thiss.$form.find(Main.DDLLEGALFRAME);
                            thiss.$ddlAgreement = thiss.$form.find(Main.DDLAGREEMENT);
                            thiss.$ddlActivity = thiss.$form.find(Main.DDLACTIVITY);
                            thiss.$tblResultData = thiss.$form.find(Main.TBLRESULTDATA);
                            thiss.$filFile = thiss.$form.find("#filFile");
                            thiss.$btnFormat.off("click")
                            thiss.$btnFormat.on("click", function (e) {
                                thiss.formFormat();
                            });
                            thiss.$btnUpload.off("click");
                            thiss.$btnUpload.on("click", function (e) {
                                thiss.$filFile.trigger("click");
                            });
                            thiss.$filFile.off("change");
                            thiss.$filFile.on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    thiss.processFile(e.originalEvent.target.files[0]);
                                }
                            });
                            thiss.$btnSave.off("click")
                            thiss.$btnSave.on("click", function (e) {
                                thiss.saveMassive();
                            });
                            thiss.$btnDeleteData.off("click")
                            thiss.$btnDeleteData.on("click", function (e) {
                                thiss.deleteMassive();
                            });
                            thiss.fillDropDownList(thiss.$ddlLegalFrame, thiss.$ddlAgreement, thiss.$ddlActivity, null, false);
                        };
                        _super.prototype.form.call(this, com.jtm.Server.contextPath + 'environment/data/formmassive', id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        options = {
                            data: {
                                id: id,
                                stationId: thiss.$table.find('>tbody>tr.selected').attr('data-stationid'),
                                activityId: thiss.$table.find('>tbody>tr.selected').attr('data-activityid'),
                                date: thiss.$table.find('>tbody>tr.selected').attr('data-date')
                            },
                            isJson: false
                        };
                        thiss.detailConfig(url, options, function (data) {
                            var item = data.item;
                            thiss.$ddlLegalFrame.val(item.activity.agreement.legalFrame.id);
                            thiss.$ddlLegalFrame.trigger("change");
                            thiss.$ddlAgreement.val(item.activity.agreement.id);
                            thiss.$ddlAgreement.trigger("change");
                            thiss.$ddlActivity.val(item.activity.id);
                            thiss.$ddlStation.val(item.station.id);
                            thiss.$txtSampleCode.val(item.sample.code);
                            thiss.$txtDate.val(item.date);
                            thiss.$txtHour.val(item.hour);
                            thiss.searchParameters();
                        });
                    };
                    Main.prototype.search = function () {
                        var thiss = this;
                        var item = thiss.parameters();
                        thiss.searchConfig(com.jtm.Server.contextPath + 'environment/data/search',
                        {
                            data: item,
                            isJson: false,
                            validate: validate()
                        }, function (items) {
                            thiss.fillTableResult(items);
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$ddlLegalFrameSearch.int32() === 0) {
                                success = false;
                                message = 'Seleccione un IGA / Licencia.';
                                thiss.$ddlLegalFrameSearch.focus();
                            } else if (thiss.$ddlAgreementSearch.int32() === 0) {
                                success = false;
                                message = "Seleccione un compromiso.";
                                thiss.$ddlAgreementSearch.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            activity: {
                                id: thiss.$ddlActivitySearch.int32(),
                                agreement: { id: thiss.$ddlAgreementSearch.int32() }
                            },
                            station: { id: thiss.$ddlStationSearch.int32() },
                            startDate: thiss.$txtDateSearch.date(),
                            endDate: thiss.$txtEndDateSearch.date()
                        };
                    };
                    Main.prototype.delete = function (url, id, options, callback) {
                        var thiss = this;
                        options = {
                            data: {
                                stationId: thiss.$table.find('>tbody>tr.selected').attr('data-stationid'),
                                activityId: thiss.$table.find('>tbody>tr.selected').attr('data-activityid'),
                                date: thiss.$table.find('>tbody>tr.selected').attr('data-date'),
                            },
                            isJson: false,
                            validate: validate()
                        };
                        this.deleteConfig(url, options, callback);
                        function validate() {
                            if (thiss.$table.find('>tbody>tr.selected').length === 0) {
                                alert("Seleccione una fila");
                                return false;
                            }
                            else return true;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                data.Main = Main;
            })(environment.data || (environment.data = {}));
            var environment = environment.data;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.data.Main.execute();