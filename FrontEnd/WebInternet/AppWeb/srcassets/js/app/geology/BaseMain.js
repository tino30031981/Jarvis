var com;
(function (com) {
    (function (jtm) {
        (function (geology) {
            var BaseMain = (function (_super) {
                __extends(BaseMain, _super);
                function BaseMain() {
                    _super.call(this);
                    this.$txtXSample = null;
                    this.$txtYSample = null;
                    this.$txtParameterRow = null;
                    this.$txtParameterColumn = null;
                    this.$txtSampleRow = null;
                    this.$txtSampleColumn = null;
                    this.$btnPointSample = null;
                    this.$btnUploadMassive = null;
                    this.$btnSaveMassive = null;
                    this.$btnFormatMassive = null;
                    this.$btnAddSampleMassive = null;
                    this.$btnAddParameter = null;
                    this.$ddlSpatialReferenceSample = null;
                    this.$ddlSampleMassive = null;
                    this.$ddlMineralMasive = null;
                    this.$tableMassive = null;
                    this.$filFileMassive = null;
                    this.$smlMassiveName = null;
                    this.isSurface = null;
                    this.sampleViewer = null;
                    this.sampleFormViewer = null;
                    this.capturePoint = function (geometry) {
                        var thiss = this;
                        if (thiss.$ddlSpatialReferenceSample.int32() === 0) {
                            alert('Primero debe seleccionar el sistema referencial');
                        } else {
                            var coordinates = [geometry.x, geometry.y];
                            coordinates = thiss.project(coordinates, geometry.spatialReference.id, thiss.$ddlSpatialReferenceSample.int32());
                            if (thiss.$ddlSpatialReferenceSample.int32() === BaseMain.SRIDDEFAULTGPS) {
                                thiss.$txtXSample.val(coordinates[0]);
                                thiss.$txtYSample.val(coordinates[1]);
                            } else {
                                thiss.$txtXSample.val(coordinates[0].toFixed(thiss.config.number.decimalCount));
                                thiss.$txtYSample.val(coordinates[1].toFixed(thiss.config.number.decimalCount));
                            }
                        }
                    };
                    this.formSample = function (id, title) {
                        var thiss = this;
                        if (thiss.$hdnId.int32() === 0) { alert(BaseMain.NEWELEMENTID); return; }
                        thiss.$divPopup.dialog({
                            title: title,
                            width: '100%',
                            resizable: false,
                            modal: true,
                            closeOnEscape: true,
                            autoempty: true,
                            close: function (dialog) {
                            }
                        });
                        thiss.loadView(thiss.$divPopup, thiss.urls.formSample, function () {
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + 'geology/sampletype/searchbyissurface',
                                ddl: '#ddlSampleTypeSample',
                                data: { isSurface: thiss.isSurface },
                                callback: null
                            });
                            thiss.$txtXSample = thiss.$main.find("#txtXSample");
                            thiss.$txtYSample = thiss.$main.find("#txtYSample");
                            thiss.$btnPointSample = thiss.$main.find('#btnPointSample');
                            thiss.$ddlSpatialReferenceSample = thiss.$main.find('#ddlSpatialReferenceSample');
                            thiss.sampleFormViewer.load(thiss.$divPopup, {
                                $hdnId: thiss.$hdnId
                            });
                            thiss.datePicker('#txtDateSample');
                            thiss.$txtXSample.numeric();
                            thiss.$txtYSample.numeric();
                            thiss.$btnPointSample.off('click');
                            thiss.$btnPointSample.on('click', function (e) {
                                thiss.sampleFormViewer.capturePoint({}, function (geometry) {
                                    thiss.capturePoint(geometry);
                                });
                            });
                            jQuery('#txtAMSample').numeric({ negative: false, decimalPlaces: 3 });
                            jQuery('#txtAVSample').numeric({ negative: false, decimalPlaces: 3 });
                            jQuery('#txtAltitudeSample').numeric({ negative: false, decimalPlaces: 3 });
                            jQuery('#txtCourseSample').numeric({ negative: false, decimalPlaces: 3 });
                            jQuery('#txtBuzSample').numeric({ negative: false, decimalPlaces: 3 });
                            if (id > 0)
                                thiss.detailSample(id);
                            jQuery('#btnSaveSample').off("click");
                            jQuery('#btnSaveSample').on("click", function (e) {
                                thiss.saveSample();
                            });
                            jQuery("#btnOpenFileDocumentSample").off("click")
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
                            });
                        });
                    };
                    this.saveSample = function () {
                        var thiss = this;
                        var item = {
                            id: jQuery("#hdnIdSample").int32(),
                            sampling: { id: this.$hdnId.int32() },
                            sampleType: { id: jQuery("#ddlSampleTypeSample").int32() },
                            date: jQuery("#txtDateSample").date(),
                            channel: jQuery("#txtChannelSample").int32(),
                            sampleNumber: jQuery("#txtSampleNumberSample").val(),
                            aM: jQuery("#txtAMSample").number(),
                            aV: jQuery("#txtAVSample").number(),
                            spatialReference: { id: thiss.$ddlSpatialReferenceSample.int32() },
                            coordinate: { x: thiss.$txtXSample.number(), y: thiss.$txtYSample.number() },
                            altitude: jQuery("#txtAltitudeSample").number(),
                            course: jQuery("#txtCourseSample").number(),
                            buz: jQuery("#txtBuzSample").number(),
                            description: jQuery('#txtDescriptionSample').val(),
                            state: jQuery('#chkStateSample').boolean()
                        };
                        var options = {
                            data: item,
                            validate: validate
                        };
                        this.saveConfig(thiss.urls.saveSample, options, function () {
                            jQuery('#divPopup').dialog('close');
                            thiss.searchSamples();
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$hdnId.int32() === 0) {
                                success = false;
                                message = Main.NEWELEMENTID;
                            } else if (thiss.$ddlSpatialReferenceSample.int32() === 0) {
                                success = false;
                                message = 'Seleccione el sistema referencial.';
                                thiss.$ddlSpatialReferenceSample.focus();
                            } else if (jQuery('#txtDateSample').val() === "") {
                                success = false;
                                message = 'Seleccione la fecha.';
                                jQuery('#txtDateSample').focus();
                            } else if (thiss.isSurface && jQuery('#txtChannelSample').val() === "") {
                                success = false;
                                message = 'Ingrese el canal.';
                                jQuery('#txtChannelSample').focus();
                            } else if (jQuery('#ddlSampleTypeSample').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de muestra.';
                                jQuery('#ddlSampleTypeSample').focus();
                            } else if (jQuery('#txtSampleNumberSample').val() === "") {
                                success = false;
                                message = 'Ingrese el número de la muestra.';
                                jQuery('#txtSampleNumberSample').focus();
                            } else if (jQuery('#txtAMSample').val() === "") {
                                success = false;
                                message = 'Ingrese valor para AM.';
                                jQuery('#txtAMSample').focus();
                            } else if (jQuery('#txtAVSample').val() === "") {
                                success = false;
                                message = 'Ingrese valor para AV.';
                                jQuery('#txtAVSample').focus();
                            } else if (thiss.$txtXSample.val() === '') {
                                success = false;
                                message = 'Ingrese el eje X.';
                                thiss.$txtXSample.focus();
                            } else if (thiss.$txtYSample.val() === '') {
                                success = false;
                                message = 'Ingrese el eje Y.';
                                thiss.$txtYSample.focus();
                            } else if (jQuery('#txtAltitudeSample').string() === '') {
                                success = false;
                                message = 'Ingrese la altitud.';
                                jQuery('#txtAltitudeSample').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    this.detailSample = function (id) {
                        var thiss = this;
                        var options = {
                            data: { sampleId: id }
                        };
                        this.detailConfig(thiss.urls.detailSample, options, function (data) {
                            var item = data.item;
                            jQuery('#hdnIdSample').val(item.id);
                            thiss.$ddlSpatialReferenceSample.val(item.spatialReference.id);
                            jQuery('#txtDateSample').val(item.date);
                            jQuery('#txtChannelSample').val(item.channel);
                            jQuery('#ddlSampleTypeSample').val(item.sampleType.id);
                            jQuery('#txtSampleNumberSample').val(item.sampleNumber);
                            jQuery('#txtAMSample').val(item.am);
                            jQuery('#txtAVSample').val(item.av);
                            jQuery('#txtAltitudeSample').val(item.altitude);
                            jQuery('#txtCourseSample').val(item.course);
                            jQuery('#txtBuzSample').val(item.buz);
                            jQuery('#txtDescriptionSample').val(item.description);
                            jQuery('#txtDescriptionSample').val(item.description);
                            jQuery('#chkStateSample').prop("checked", item.state);
                            thiss.$txtXSample.val((item.coordinate.x).toFixed(thiss.config.number.decimalCount));
                            thiss.$txtYSample.val((item.coordinate.y).toFixed(thiss.config.number.decimalCount));
                            thiss.sampleFormViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + 'geology/sample/searchdistricts', item.id, null);
                        });
                    };
                    this.deleteSamples = function () {
                        var thiss = this;
                        var sampleIds = com.jtm.helper.Table.getItems("#tbdResultSamples", true, false);
                        var options = {
                            data: { id: thiss.$hdnId.int32(), sampleIds: sampleIds },
                            isJson: false,
                            validate: validate
                        };
                        function validate() {
                            if (sampleIds.length === 0) {
                                alert('Seleccione al menos una muestra.');
                                return false;
                            } else if (thiss.$hdnId.int32() === 0) {
                                alert(BaseMain.NEWELEMENTID);
                                return false;
                            }
                            else
                                return true;
                        }
                        thiss.deleteConfig(thiss.urls.deleteSamples, options, function () { thiss.searchSamples(); });
                    };
                    this.searchSamples = function () {
                        var thiss = this;
                        if (this.$hdnId.int32() === 0) return;
                        var options = {
                            url: thiss.urls.searchSamples,
                            data: { id: thiss.$hdnId.int32() },
                            validate: validate
                        };
                        thiss.ajax(options, function (data) {
                            thiss.fillSamples(data.items, '#tblResultSamples', "#divTotalSample");
                            thiss.sampleViewer.addFeatures(data.featuresList);
                        });
                        function validate() { return true; }
                    };
                    this.fillSamples = function (items, tbl, div) {
                        var thiss = this;
                        var html = '';
                        jQuery.each(items, function (i, item) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                            html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.date + '</td>';
                            html += '<td>' + item.channel + '</td>';
                            html += '<td>' + item.sampleType.name + '</td>';
                            html += '<td>' + item.sampleNumber + '</td>';
                            html += '<td>' + (item.coordinate.x).toFixed(thiss.config.number.decimalCount) + '</td>';
                            html += '<td>' + (item.coordinate.y).toFixed(thiss.config.number.decimalCount) + '</td>';
                            html += '<td>' + item.altitude + '</td>';
                            html += '<td>' + item.course + '</td>';
                            html += '<td>' + item.buz + '</td>';
                            html += '<td>' + item.spatialReference.name + '</td>';
                            html += '</tr>';
                        });
                        jQuery(tbl + '>tbody').html(html);
                        jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                        com.jtm.helper.Table.highlightRow(tbl);
                    };
                    this.fillDocumentsSample = function () {
                        var thiss = this;
                        var html = "";
                        var files = $("#filFileDocumentSample")[0].files;
                        for (var i = 0; i < files.length; i++) {
                            html += "<input type='text' value=" + files[i].name + " class='form-control' />";
                        }
                        jQuery('#divDocumentSample').append(html);
                    };
                    this.saveDocumentsSample = function () {
                        var thiss = this;
                        var files = $("#filFileDocumentSample")[0].files;
                        var options = {};
                        thiss.saveConfig(thiss.urls.saveDocumentsSample, options, function () { });
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
                        thiss.searchConfig(com.jtm.Server.contextPath + 'geology/data/searchfile', options, function (items) {
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
                        thiss.saveConfig(com.jtm.Server.contextPath + 'geology/data/savemassive', options, function () {
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
                            thiss.searchConfig(thiss.urls.searchSamples, { data: { id: thiss.$hdnId.int32() } }, function (items) {
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
                BaseMain.prototype.uiConfig = function () {
                };
                BaseMain.prototype.initConfig = function () {
                    var thiss = this;
                    _super.prototype.initConfig.call(this);
                    thiss.isSurface = (jQuery('#hdnIsSurfaceSearch').string() === "1") ? true : false;
                    thiss.$divPopup = thiss.$main.find('#divPopup');
                    thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    thiss.datePicker('#txtStartDateSearch');
                    thiss.datePicker('#txtEndDateSearch');
                    jQuery("#ddlMiningProjectSearch").off("change");
                    jQuery("#ddlMiningProjectSearch").on("change", function () {
                        var miningProjectId = jQuery('#ddlMiningProjectSearch').int32();
                        com.jtm.helper.DropDownList.fill({
                            url: com.jtm.Server.contextPath + 'geology/sector/searchbyminingproject',
                            ddl: '#ddlSectorSearch',
                            data: {
                                miningProjectId: miningProjectId,
                                isSurface: thiss.isSurface
                            },
                            callback: null
                        });
                    });
                };
                BaseMain.prototype.form = function (url, id, options) {
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
                        thiss.datePicker('#txtStartDate');
                        thiss.datePicker('#txtEndDate');
                        thiss.datePicker('#txtDate');
                        thiss.$txtParameterRow.numeric({ negative: false, decimalPlaces: 0 });
                        thiss.$txtParameterColumn.numeric({ negative: false, decimalPlaces: -1 });
                        thiss.$txtSampleRow.numeric({ negative: false });
                        thiss.$txtSampleColumn.numeric({ negative: false });
                        jQuery("#ddlMiningProject").off("change");
                        jQuery("#ddlMiningProject").on("change", function () {
                            var miningProjectId = jQuery('#ddlMiningProject').int32();
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/detail', {
                                data: { id: miningProjectId }
                            }, function (item) {
                                jQuery('#txtMiningProjectResponsable').val(item.responsable);
                            });
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + 'geology/sector/searchbyminingproject',
                                ddl: '#ddlSector',
                                data: {
                                    miningProjectId: miningProjectId,
                                    isSurface: thiss.isSurface
                                },
                                callback: null
                            });
                        });
                        jQuery('#btnAddSample').off("click");
                        jQuery('#btnAddSample').on("click", function (e) {
                            thiss.formSample(0, "Agregar Muestra");
                        });
                        jQuery('#btnUpdateSample').off("click");
                        jQuery('#btnUpdateSample').on("click", function (e) {
                            var id = thiss.getElementID('#tblResultSamples');
                            if (id > 0)
                                thiss.formSample(id, "Editar Muestra");
                            else
                                alert('Debes seleccionar una muestra.');
                        });
                        jQuery('#btnQuitSamples').off("click");
                        jQuery('#btnQuitSamples').on("click", function (e) {
                            thiss.deleteSamples();
                        });
                        thiss.sampleViewer.build('#mapFormSample');
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
                BaseMain.prototype.detail = function (url, id, options) {
                    var thiss = this;
                    _super.prototype.detail.call(this, null, id, null, function (data) {
                        var item = data.item;
                        thiss.$hdnId.val(item.id);
                        jQuery('#ddlMiningProject').val(item.miningProject.id);
                        jQuery('#ddlMiningProject').trigger("change");
                        jQuery('#ddlSector').val(item.sector.id);
                        jQuery('#txtStartDate').val(item.startDate);
                        jQuery('#txtEndDate').val(item.endDate);
                        jQuery('#txtReference').val(item.reference);
                        jQuery('#chkState').prop("checked", item.state);
                        thiss.searchSamples();
                    });
                };
                BaseMain.prototype.search = function (url, options, callback) {
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
                        field: "totalSamples",
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
                BaseMain.prototype.parameters = function () {
                    var thiss = this;
                    return {
                        isSurface: thiss.isSurface,
                        miningProject: { id: jQuery('#ddlMiningProjectSearch').int32(), responsable: jQuery('#txtMiningProjectResponsableSearch').val() },
                        startDate: jQuery('#txtStartDateSearch').val(),
                        endDate: jQuery('#txtEndDateSearch').val(),
                        reference: jQuery('#txtReferenceSearch').val(),
                        sector: { id: jQuery('#ddlSectorSearch').int32() },
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
                BaseMain.prototype.save = function (url, data, options) {
                    var thiss = this;
                    options = options || {};
                    options.validate = validate;
                    data = {
                        id: this.$hdnId.int32(),
                        isSurface: thiss.isSurface,
                        startDate: jQuery("#txtStartDate").val(),
                        endDate: jQuery("#txtEndDate").val(),
                        reference: jQuery("#txtReference").val(),
                        miningProject: { id: jQuery("#ddlMiningProject").int32() },
                        sector: { id: jQuery("#ddlSector").int32() },
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
                        } else if (jQuery('#txtStartDate').string() === '') {
                            success = false;
                            message = 'Seleccione la fecha de inicio.';
                            jQuery('#txtStartDate').focus();
                        } else if (jQuery('#txtEndDate').string() === '') {
                            success = false;
                            message = 'Seleccione la fecha de término.';
                            jQuery('#txtEndDate').focus();
                        }
                        if (message !== '')
                            alert(message);
                        return success;
                    }
                };
                BaseMain.prototype.searchDistricts = function (url, id, options) {
                    var thiss = this;
                    thiss.searchConfig(url, {
                        isJson: false, data: { id: id }
                    }, function (items) {
                        if (items.length === 0) return;
                        var html = "";
                        items.forEach(function (item) {
                            html += item.province.department.name + '/' + item.province.name + '/' + item.name + ', ';
                        });
                        thiss.$main.find('#txtUbigeoSample').val(html.substring(0, html.length - 2));
                    });
                };
                return BaseMain;
            })(jtm.geometry.BaseGeometry);
            geology.BaseMain = BaseMain;
        })(jtm.geology || (jtm.geology = {}));
        var geology = jtm.geology;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));