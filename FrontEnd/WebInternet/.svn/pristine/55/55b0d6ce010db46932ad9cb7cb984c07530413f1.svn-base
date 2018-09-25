(function (com) {
    (function (jtm) {
        (function (geology) {
            (function (diamantinedrilling) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "did";
                        this.$txtParameterRow = null;
                        this.$txtParameterColumn = null;
                        this.$txtSampleRow = null;
                        this.$txtSampleColumn = null;
                        this.$btnUploadMassive = null;
                        this.$btnSaveMassive = null;
                        this.$btnFormatMassive = null;
                        this.$btnAddSampleMassive = null;
                        this.$btnAddParameter = null;
                        this.$ddlSampleMassive = null;
                        this.$ddlMineralMasive = null;
                        this.$tableMassive = null;
                        this.$filFileMassive = null;
                        this.$smlMassiveName = null;
                        this.formSampleDiamantineDrilling = function (id, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + 'geology/diamantinedrilling/formsample', function () {
                                thiss.datePicker('#txtDateSampleDiamantineDrilling');
                                jQuery('#txtStartSampleDiamantineDrilling').numeric({ negative: false, decimalPlaces: 3 });
                                jQuery('#txtEndSampleDiamantineDrilling').numeric({ negative: false, decimalPlaces: 3 });
                                jQuery('#txtAMSampleDiamantineDrilling').numeric({ negative: false, decimalPlaces: 3 });
                                if (id > 0)
                                    thiss.detailSampleDiamantineDrilling(id);
                                jQuery('#btnSaveSampleDiamantineDrilling').off("click");
                                jQuery('#btnSaveSampleDiamantineDrilling').on("click", function (e) {
                                    thiss.saveSampleDiamantineDrilling();
                                });

                                /*jQuery("#btnOpenFileDocumentSample").off("click")
                                jQuery("#btnOpenFileDocumentSample").on("click", function (e) {
                                    jQuery("#filFileDocumentSample").trigger("click");
                                });
                                jQuery("#filFileDocumentSample").off("change");
                                jQuery("#filFileDocumentSample").on("change", function (e) {
                                    if (e.originalEvent.target.files.length) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        thiss.fillDocumentsSample();
                                    }
                                });
                                jQuery('#btnSaveFileDocumentSample').off("click");
                                jQuery('#btnSaveFileDocumentSample').on("click", function (e) {
                                    thiss.saveDocumentsSample();
                                });*/
                            });
                        };
                        this.saveSampleDiamantineDrilling = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery("#hdnIdSampleDiamantineDrilling").int32(),
                                sampling: { id: this.$hdnId.int32() },
                                date: jQuery("#txtDateSampleDiamantineDrilling").date(),
                                sampleNumber: jQuery("#txtSampleNumberSampleDiamantineDrilling").val(),
                                start: jQuery("#txtStartSampleDiamantineDrilling").number(),
                                end: jQuery("#txtEndSampleDiamantineDrilling").number(),
                                aM: jQuery("#txtAMSampleDiamantineDrilling").number(),
                                mineralization: jQuery('#txtMineralizationSampleDiamantineDrilling').val(),
                                state: jQuery('#chkStateSampleDiamantineDrilling').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'geology/diamantinedrilling/savesample', options, function () {
                                jQuery('#divPopup').dialog('close');
                                thiss.searchSampleDiamantineDrillings();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txtDateSampleDiamantineDrilling').val() === "") {
                                    success = false;
                                    message = 'Seleccione la fecha.';
                                    jQuery('#txtDateSampleDiamantineDrilling').focus();
                                } else if (jQuery('#txtSampleNumberSampleDiamantineDrilling').val() === "") {
                                    success = false;
                                    message = 'Ingrese el número de la muestra.';
                                    jQuery('#txtSampleNumberSampleDiamantineDrilling').focus();
                                } else if (jQuery('#txtStartSampleDiamantineDrilling').val() === "") {
                                    success = false;
                                    message = 'Ingrese valor para desde.';
                                    jQuery('#txtStartSampleDiamantineDrilling').focus();
                                } else if (jQuery('#txtEndSampleDiamantineDrilling').val() === "") {
                                    success = false;
                                    message = 'Ingrese valor para hasta.';
                                    jQuery('#txtEndSampleDiamantineDrilling').focus();
                                } else if (jQuery('#txtAMSampleDiamantineDrilling').val() === "") {
                                    success = false;
                                    message = 'Ingrese valor para A.M.';
                                    jQuery('#txtAMSampleDiamantineDrilling').focus();
                                } else if (jQuery('#txtMineralizationSampleDiamantineDrilling').string() === '') {
                                    success = false;
                                    message = 'Ingrese la mineralización.';
                                    jQuery('#txtMineralizationSampleDiamantineDrilling').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailSampleDiamantineDrilling = function (id) {
                            var thiss = this;
                            var options = {
                                data: { sampleDiamantineDrillingId: id }
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'geology/diamantinedrilling/detailsample', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdSampleDiamantineDrilling').val(item.id);
                                jQuery('#txtDateSampleDiamantineDrilling').val(item.date);
                                jQuery('#txtSampleNumberSampleDiamantineDrilling').val(item.sampleNumber);
                                jQuery('#txtStartSampleDiamantineDrilling').val(item.start);
                                jQuery('#txtEndSampleDiamantineDrilling').val(item.end);
                                jQuery('#txtAMSampleDiamantineDrilling').val(item.am);
                                jQuery('#txtMineralizationSampleDiamantineDrilling').val(item.mineralization);
                                jQuery('#chkStateSampleDiamantineDrilling').prop("checked", item.state);
                            });
                        };
                        this.deleteSampleDiamantineDrillings = function () {
                            var thiss = this;
                            var sampleDiamantineDrillingIds = com.jtm.helper.Table.getItems("#tbdResultSampleDiamantineDrillings", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), sampleDiamantineDrillingIds: sampleDiamantineDrillingIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (sampleDiamantineDrillingIds.length === 0) {
                                    alert('Seleccione al menos una muestra.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                }
                                else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'geology/diamantinedrilling/deletesamples', options, function () { thiss.searchSampleDiamantineDrillings(); });
                        };
                        this.searchSampleDiamantineDrillings = function () {
                            var thiss = this;
                            if (this.$hdnId.int32() === 0) return;
                            var options = {
                                url: com.jtm.Server.contextPath + 'geology/diamantinedrilling/searchsamples',
                                data: { id: thiss.$hdnId.int32() },
                                validate: validate
                            };
                            thiss.ajax(options, function (data) {
                                thiss.fillSampleDiamantineDrillings(data.items, '#tblResultSampleDiamantineDrillings', "#divTotalSampleDiamantineDrilling");
                            });
                            function validate() { return true; }
                        };
                        this.fillSampleDiamantineDrillings = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.date + '</td>';
                                html += '<td>' + item.sampleNumber + '</td>';
                                html += '<td>' + item.start + '</td>';
                                html += '<td>' + item.end + '</td>';
                                html += '<td>' + item.am + '</td>';
                                html += '<td>' + item.mineralization + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.processFile = function () {
                            var thiss = this;
                            thiss.$tableMassive.empty();
                            var item = {
                                samplingId: thiss.$hdnId.int32(),
                                parameterRow: thiss.$txtParameterRow.int32(),
                                parameterColumn: thiss.$txtParameterColumn.int32(),
                                sampleRow: thiss.$txtSampleRow.int32(),
                                sampleColumn: thiss.$txtSampleColumn.int32()
                            };
                            var options = {
                                data: item,
                                attachments: [{ id: "filFileMassive", file: thiss.$filFileMassive[0].files[0] }],
                                isJson: false,
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'geology/datadiamantinedrilling/searchfile', options, function (items) {
                                thiss.$filFileMassive.val("");
                                thiss.$smlMassiveName.html("");
                                thiss.fillResult(items);
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$filFileMassive.val() === "") {
                                    message = 'Seleccione un archivo excel';
                                    success = false;
                                }
                                else if (thiss.$hdnId.int32() === 0) {
                                    message = 'Debe guardar el formulario primero';
                                    success = false;
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.fillResult = function (items) {
                            var thiss = this;
                            if (items === undefined || items === null) return;
                            if (items.length === 0) return;
                            jQuery('#divTotalResultMassive>span').html(items.length);
                            writeHeader();
                            writeBody();
                            function writeHeader() {
                                if (items[0] === null) return;
                                if (items[0].headers === null) return;
                                var existParameter = true;
                                var id = 0;
                                thiss.$tableMassive.append("<thead></thead>");
                                thiss.$tableMassive.find('>thead').append("<tr></tr>");
                                thiss.$tableMassive.find('>thead>tr').append("<th></th>");
                                thiss.$tableMassive.find('>thead>tr').append("<th> Muestras </th>");
                                items[0].headers.forEach(function (header) {
                                    id = header.mineral.id || 0;
                                    if (id === 0) existParameter = false;
                                    if (existParameter === false) {
                                        thiss.$tableMassive.find('>thead>tr').append('<th data-parameter="' + id + '" class="gh-error"><button type="button" class="btn btnParameter"><i class="glyphicon glyphicon-plus-sign"></i></button> ' + header.mineral.symbol + '</th>');
                                        existParameter = true;
                                    } else
                                        thiss.$tableMassive.find('>thead>tr').append("<th data-parameter='" + id + "'>" + header.mineral.symbol + "</th>");
                                });
                            }
                            function writeBody() {
                                var existSample = true;
                                var sampleId = 0;
                                thiss.$tableMassive.append("<tbody></tbody>");
                                items.forEach(function (item, i) {
                                    if (item.datas.length === 0) return;
                                    sampleId = item.sample.id || 0;
                                    thiss.$tableMassive.find('>tbody').append('<tr id="' + sampleId + '"></tr>');
                                    thiss.$tableMassive.find('>tbody>tr:last').append('<td><button type="button" class="btn btnDelete"><i class="glyphicon glyphicon-remove-sign"></i></button></td>');
                                    if (sampleId === 0) existSample = false;
                                    if (existSample === false) {
                                        thiss.$tableMassive.find('>tbody>tr:last').append('<td data-samplenumber= "' + sampleId + '" class="gh-error"><button type="button" class="btn btnSample"><i class="glyphicon glyphicon-plus-sign"></i></button> ' + item.sample.sampleNumber + '</th>');
                                        existSample = true;
                                    } else
                                        thiss.$tableMassive.find('>tbody>tr:last').append('<td data-samplenumber= "' + sampleId + '">' + item.sample.sampleNumber + '</td>');
                                    item.datas.forEach(function (data) {
                                        thiss.$tableMassive.find('>tbody>tr:last').append("<td>" + data.value + "</td>");
                                    });
                                });
                            }
                            thiss.$tableMassive.find('>thead').off('click', '.btnParameter');
                            thiss.$tableMassive.find('>thead').on('click', '.btnParameter', function (e) {
                                thiss.formAddParameter($(this).closest('th'));
                            });
                            thiss.$tableMassive.find('>tbody').off('click', '>tr .btnSample');
                            thiss.$tableMassive.find('>tbody').on('click', '>tr .btnSample', function (e) {
                                thiss.formAddSample($(this).closest('td'));
                            });
                            thiss.$tableMassive.find('>tbody').off('click', '.btnDelete');
                            thiss.$tableMassive.find('>tbody').on('click', '.btnDelete', function (e) {
                                if (confirm("¿Esta seguro de eliminar el registro?")) {
                                    var $tr = $(this).closest('tr');
                                    $tr.remove();
                                }
                            });
                        };
                        this.validateElements = function () {
                            var thiss = this;
                            var success = true;
                            var message = '';
                            if (thiss.$txtParameterRow.int32() === 0) {
                                message = 'Ingrese una fila para el elemento';
                                success = false;
                            }
                            else if (thiss.$txtParameterColumn.int32() === 0) {
                                message = 'Ingrese una columna para el elemento';
                                success = false;
                            }
                            else if (thiss.$txtSampleRow.int32() === 0) {
                                message = 'Ingrese una fila para la muestra';
                                success = false;
                            }
                            else if (thiss.$txtSampleColumn.int32() === 0) {
                                message = 'Ingrese una columna para la muestra';
                                success = false;
                            }
                            else if (thiss.$txtSampleColumn.int32() >= thiss.$txtParameterColumn.int32()) {
                                message = 'La una columna del elemento no puede ser mayor a la columna de la muestra';
                                success = false;
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        };
                        this.saveMassive = function () {
                            var thiss = this;
                            var $parameters = thiss.$tableMassive.find('>thead>tr:first>th').toArray();
                            if (!validateRows())
                                return;
                            function validateRows() {
                                var success = true;
                                var i = 0;
                                var j = 0;
                                thiss.$tableMassive.find('>tbody>tr').toArray().forEach(function (tr) {
                                    if (jQuery(tr).find('td:eq(1)').hasClass("gh-error") === true)
                                        i++;
                                });
                                $parameters.forEach(function (th) {
                                    if (jQuery(th).hasClass('gh-error') === true)
                                        j++;
                                });
                                if (i > 0) {
                                    toastr.info('Contiene ' + i + ' muestra que no ha guardado en su base de datos.');
                                    success = false;
                                }
                                else if (j > 0) {
                                    toastr.info('Contiene ' + j + ' elementos que no ha guardado en su base de datos.');
                                    success = false;
                                }
                                return success;
                            }
                            var datas = [];
                            var data2 = null;
                            thiss.$tableMassive.find('>tbody>tr').toArray().forEach(function (tr, i) {
                                data2 = [];
                                if (jQuery(tr).find('td:eq(1)').hasClass("gh-error") === true) return;
                                jQuery(tr).find('>td').toArray().forEach(function (td, j) {
                                    if (jQuery($parameters[j]).attr('data-parameter') === undefined) return;
                                    if (j > 1)
                                        data2.push({ value: jQuery(td).text(), mineral: { id: jQuery($parameters[j]).attr('data-parameter') } });
                                });
                                datas.push({
                                    id: 0,
                                    sample: { id: jQuery(tr).find('td:eq(1)').attr('data-samplenumber') },
                                    datas: data2
                                });
                            });
                            var options = {
                                data: { items: datas },
                                isJson: false,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'geology/datadiamantinedrilling/savemassive', options, function () {
                                thiss.$tableMassive.empty();
                                thiss.$filFileMassive.val("");
                                jQuery('#divTotalResult>span').html(0);
                                thiss.resetValues();
                            });
                            function validate() {
                                console.log(datas);
                                var success = true;
                                var message = '';
                                datas.forEach(function (data) {
                                    if (data.sample.id === "0") {
                                        success = false;
                                        message = 'No se ha registrado algunas muestras.';
                                    }
                                    data.datas.forEach(function (data2) {
                                        console.log(data2.mineral.id);
                                        if (data2.mineral.id === "0") {
                                            success = false;
                                            message = 'No se ha ingresado algunos elementos.';
                                        }
                                    });
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.formAddSample = function ($obj) {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Añadir Muestra",
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "geology/data/formaddsample", function () {
                                thiss.$ddlSampleMassive = thiss.$main.find('#ddlSampleMassive');
                                thiss.$btnAddSampleMassive = thiss.$main.find('#btnAddSampleMassive');
                                thiss.searchConfig(com.jtm.Server.contextPath + 'geology/diamantinedrilling/searchsamples', { data: { id: thiss.$hdnId.int32() } }, function (items) {
                                    var html = '';
                                    items.forEach(function (item, i) {
                                        html += '<option value="' + item.id + '">' + item.sampleNumber + '</option>';
                                    });
                                    thiss.$ddlSampleMassive.html(html);
                                });
                                thiss.$btnAddSampleMassive.off('click');
                                thiss.$btnAddSampleMassive.on('click', function (e) {
                                    var existParameter = false;
                                    var $tds = thiss.$tableMassive.find('>tbody>tr').toArray();
                                    for (var i = 0; i < $tds.length; i++) {
                                        if (Number(jQuery($tds[i]).find('td:eq(1)').attr('data-samplenumber')) === thiss.$ddlSampleMassive.find(':selected').int32()) {
                                            alert('El parametro seleccionado ya se encuentra en su lista de parametro');
                                            existParameter = true;
                                            break;
                                        }
                                    }
                                    if (!existParameter) {
                                        $obj.removeClass("gh-error");
                                        $obj.attr('data-samplenumber', thiss.$ddlSampleMassive.find(':selected').int32());
                                        $obj.html(thiss.$ddlSampleMassive.find(':selected').text());
                                        jQuery('#divPopup').dialog('close');
                                    }
                                });
                            });
                        };
                        this.formAddParameter = function ($obj) {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Añadir Parametro",
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "geology/data/formaddparameter", function () {
                                thiss.$ddlMineralMasive = thiss.$main.find('#ddlMineralMassive');
                                thiss.$btnAddParameter = thiss.$main.find('#btnAddParameter');
                                thiss.searchConfig(com.jtm.Server.contextPath + 'general/mineral/list', {}, function (items) {
                                    var html = '';
                                    items.forEach(function (item, i) {
                                        html += '<option value="' + item.id + '" data-symbol="' + (item.symbol === "" ? '' : item.symbol) + '" >' + item.name + '</option>';
                                    });
                                    thiss.$ddlMineralMasive.html(html);
                                });
                                thiss.$btnAddParameter.off('click');
                                thiss.$btnAddParameter.on('click', function (e) {
                                    var existParameter = false;
                                    var $ths = thiss.$tableMassive.find('>thead>tr>th').toArray();
                                    for (var i = 0; i < $ths.length; i++) {
                                        if (Number(jQuery($ths[i]).attr('data-parameter')) === thiss.$ddlMineralMasive.find(':selected').int32()) {
                                            alert('El parametro seleccionado ya se encuentra en su lista de parametro');
                                            existParameter = true;
                                            break;
                                        }
                                    }
                                    if (!existParameter) {
                                        $obj.removeClass("gh-error");
                                        $obj.attr('data-parameter', thiss.$ddlMineralMasive.find(':selected').int32());
                                        $obj.html(thiss.$ddlMineralMasive.find(':selected').attr('data-symbol'));
                                        jQuery('#divPopup').dialog('close');
                                    }
                                });
                            });
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
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "geology/surfacesampling/formformat", function () {
                            });
                        };
                        this.resetValues = function () {
                            var thiss = this;
                            thiss.$txtParameterRow.val('1');
                            thiss.$txtParameterColumn.val('2');
                            thiss.$txtSampleColumn.val('1');
                            thiss.$txtParameterRow.trigger('keyup');
                        };
                    }
                    Main.prototype.uiConfig = function () {
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.$divPopup = thiss.$main.find('#divPopup');
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                        thiss.datePicker('#txtDrillStartDateSearch');
                        thiss.datePicker('#txtDrillEndDateSearch');
                        jQuery("#ddlMiningProjectSearch").off("change");
                        jQuery("#ddlMiningProjectSearch").on("change", function () {
                            var miningProjectId = jQuery('#ddlMiningProjectSearch').int32();
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + 'geology/sectordiamantinedrilling/searchbyminingproject',
                                ddl: '#ddlSectorSearch',
                                data: {
                                    miningProjectId: miningProjectId,
                                    isSurface: false
                                },
                                callback: null
                            });
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + 'geology/drill/searchbyminingproject',
                                ddl: '#ddlDrillSearch',
                                data: { miningProjectId: miningProjectId },
                                callback: null
                            });
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$smlMassiveName = thiss.$main.find("#smlMassiveName");
                            thiss.$btnUploadMassive = thiss.$main.find("#btnUploadMassive");
                            thiss.$btnFormatMassive = thiss.$main.find("#btnFormatMassive");
                            thiss.$btnSaveMassive = thiss.$main.find("#btnSaveMassive");
                            thiss.$filFileMassive = thiss.$main.find("#filFileMassive");
                            thiss.$tableMassive = thiss.$main.find("#tblResultMassive");
                            thiss.$txtParameterRow = thiss.$main.find("#txtParameterRow");
                            thiss.$txtParameterColumn = thiss.$main.find("#txtParameterColumn");
                            thiss.$txtSampleRow = thiss.$main.find("#txtSampleRow");
                            thiss.$txtSampleColumn = thiss.$main.find("#txtSampleColumn");
                            thiss.datePicker('#txtStartDateDrill');
                            thiss.datePicker('#txtEndDateDrill');
                            jQuery("#ddlMiningProject").off("change");
                            jQuery("#ddlMiningProject").on("change", function () {
                                var miningProjectId = jQuery('#ddlMiningProject').int32();
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/detail', {
                                    data: { id: miningProjectId }
                                }, function (item) {
                                    jQuery('#txtMiningProjectResponsable').val(item.responsable);
                                });
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + 'geology/sectordiamantinedrilling/searchbyminingproject',
                                    ddl: '#ddlSector',
                                    data: {
                                        miningProjectId: miningProjectId,
                                        isSurface: false
                                    },
                                    callback: null
                                });
                                jQuery("#txtXDrill").val("");
                                jQuery("#txtYDrill").val("");
                                jQuery("#txtCotaDrill").val("");
                                jQuery("#txtAzimuthDrill").val("");
                                jQuery("#txtInclinationDrill").val("");
                                jQuery("#txtStartDateDrill").val("");
                                jQuery("#txtEndDateDrill").val("");
                                jQuery("#txtHQDrill").val("");
                                jQuery("#txtNQDrill").val("");
                                jQuery("#txtLongitudeDrill").val("");
                                jQuery("#txtCompanyDrill").val("");
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + 'geology/drill/searchbyminingproject',
                                    ddl: '#ddlDrill',
                                    data: { miningProjectId: miningProjectId },
                                    callback: function (id) {
                                        thiss.searchConfig(com.jtm.Server.contextPath + 'geology/drill/detail', {
                                            data: { id: id }
                                        }, function (item) {
                                            jQuery('#txtXDrill').val((item.coordinate.x).toFixed(thiss.config.number.decimalCount));
                                            jQuery('#txtYDrill').val((item.coordinate.y).toFixed(thiss.config.number.decimalCount));
                                            jQuery('#txtCotaDrill').val(item.cota);
                                            jQuery('#txtAzimuthDrill').val(item.azimuth);
                                            jQuery('#txtInclinationDrill').val(item.inclination);
                                            jQuery('#txtStartDateDrill').val(item.startDate);
                                            jQuery('#txtEndDateDrill').val(item.endDate);
                                            jQuery('#txtHQDrill').val(item.hq);
                                            jQuery('#txtNQDrill').val(item.nq);
                                            jQuery('#txtLongitudeDrill').val(item.longitude);
                                            jQuery('#txtCompanyDrill').val(item.company);
                                        });
                                    }
                                });
                            });
                            jQuery('#btnAddSampleDiamantineDrilling').off("click");
                            jQuery('#btnAddSampleDiamantineDrilling').on("click", function (e) {
                                thiss.formSampleDiamantineDrilling(0, "Agregar Muestra");
                            });
                            jQuery('#btnUpdateSampleDiamantineDrilling').off("click");
                            jQuery('#btnUpdateSampleDiamantineDrilling').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultSampleDiamantineDrillings');
                                if (id > 0)
                                    thiss.formSampleDiamantineDrilling(id, "Editar Muestra");
                                else
                                    alert('Debes seleccionar una muestra.');
                            });
                            jQuery('#btnQuitSampleDiamantineDrillings').off("click");
                            jQuery('#btnQuitSampleDiamantineDrillings').on("click", function (e) {
                                thiss.deleteSampleDiamantineDrillings();
                            });

                            thiss.$btnUploadMassive.off("click");
                            thiss.$btnUploadMassive.on("click", function (e) {
                                if (thiss.validateElements())
                                    thiss.$filFileMassive.trigger("click");
                            });
                            thiss.$filFileMassive.off("change");
                            thiss.$filFileMassive.on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    thiss.$smlMassiveName.html(e.originalEvent.target.files[0].name);
                                    thiss.processFile();
                                }
                            });
                            thiss.$btnSaveMassive.off("click")
                            thiss.$btnSaveMassive.on("click", function (e) {
                                thiss.saveMassive();
                            });
                            thiss.$btnFormatMassive.off("click")
                            thiss.$btnFormatMassive.on("click", function (e) {
                                thiss.formFormat();
                            });
                            thiss.$txtParameterRow.on('keyup', function (e) {
                                thiss.$txtSampleRow.val(thiss.$txtParameterRow.int32() + 1);
                            });
                            thiss.$txtParameterRow.trigger('keyup');
                        }
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#ddlMiningProject').val(item.miningProject.id);
                            jQuery('#ddlMiningProject').trigger("change");
                            jQuery('#ddlSector').val(item.sector.id);
                            jQuery('#ddlDrill').val(item.drill.id);
                            jQuery('#ddlDrill').trigger("change");
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.searchSampleDiamantineDrillings();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "miningProject.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "miningProject.responsable",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "sector.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "drill.code",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "drill.startDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "drill.endDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "totalSampleDiamantineDrillings",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "stateName",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            miningProject: { id: jQuery('#ddlMiningProjectSearch').int32(), responsable: jQuery('#txtMiningProjectResponsableSearch').val() },
                            sector: { id: jQuery('#ddlSectorSearch').int32() },
                            drill: { id: jQuery('#ddlDrillSearch').int32() },
                            startDate: jQuery('#txtStartDateSearch').val(),
                            endDate: jQuery('#txtEndDateSearch').val(),
                            district: {
                                id: jQuery('#ddlDistrictSearch').string(),
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
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            drill: { id: jQuery("#ddlDrill").int32() },
                            sector: { id: jQuery("#ddlSector").int32() },
                            miningProject: { id: jQuery("#ddlMiningProject").int32() },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#ddlMiningProject').int32() === 0) {
                                success = false;
                                message = 'Seleccione el proyecto de explotación.';
                                jQuery('#ddlMiningProject').focus();
                            } else if (jQuery('#ddlSector').int32() === 0) {
                                success = false;
                                message = 'Seleccione el sector.';
                                jQuery('#ddlSector').focus();
                            } else if (jQuery('#ddlDrill').int32() === 0) {
                                success = false;
                                message = 'Seleccione el taladro.';
                                jQuery('#ddlDrill').focus();
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
                })(jtm.geometry.BaseGeometry);
                diamantinedrilling.Main = Main;
            })(geology.diamantinedrilling || (geology.diamantinedrilling = {}));
            var diamantinedrilling = geology.diamantinedrilling;
        })(jtm.geology || (jtm.geology = {}));
        var geology = jtm.geology;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geology.diamantinedrilling.Main.execute();