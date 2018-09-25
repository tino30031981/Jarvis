(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (agreement) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "agr";
                        this.$ddlLegalStandard = null;
                        this.$divPopupActivity = null;
                        this.$divParameters = null;
                        this.$divTotalParametersField = null;
                        this.$divTotalParametersLaboratory = null;
                        this.$tblParametersField = null;
                        this.$tblParametersLaboratory = null;
                        this.$btnUpload = null;
                        this.$btnFormat = null;
                        this.$btnImport = null;
                        this.$filFile = null;                        
                        this.formActivity = function (id, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '100%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/agreement/formactivity", function () {
                                thiss.$divPopupActivity = thiss.$divPopup.find('#divPopupActivity');
                                thiss.datePicker('#txtStartDateActivity');
                                thiss.datePicker('#txtEndDateActivity');
                                if (id > 0)
                                    thiss.detailActivity(id);
                                jQuery('#btnSaveActivity').off("click");
                                jQuery('#btnSaveActivity').on("click", function (e) {
                                    thiss.saveActivity();
                                });
                                jQuery("#btnOpenFileActivity").off("click")
                                jQuery("#btnOpenFileActivity").on("click", function (e) {
                                    jQuery("#filFileActivity").trigger("click");
                                });
                                jQuery("#filFileActivity").off("change");
                                jQuery("#filFileActivity").on("change", function () {
                                    jQuery("#smlNameActivity").html(jQuery('#filFileActivity')[0].files[0].name);
                                });
                                if (jQuery("#chkIsMonitoring").is(':checked') === true) {
                                    jQuery('#divCustody').removeClass('hidden');
                                    jQuery('#divEquipment').removeClass('hidden');
                                    if (id > 0) thiss.searchCustodys();
                                    jQuery('#btnAddCustody').off("click");
                                    jQuery('#btnAddCustody').on("click", function (e) {
                                        thiss.formCustody(0, "Agregar Custodia");
                                    });
                                    jQuery('#btnUpdateCustody').off("click");
                                    jQuery('#btnUpdateCustody').on("click", function (e) {
                                        var idCustody = thiss.getElementID('#tblResultCustodys');
                                        if (idCustody > 0)
                                            thiss.formCustody(idCustody, "Editar Custodia");
                                        else
                                            alert('Debes seleccionar una custodia.');
                                    });
                                    jQuery('#btnQuitCustodys').off("click");
                                    jQuery('#btnQuitCustodys').on("click", function (e) {
                                        thiss.deleteCustodys();
                                    });
                                    if (id > 0) thiss.searchEquipments();
                                    jQuery('#btnAddEquipment').off("click");
                                    jQuery('#btnAddEquipment').on("click", function (e) {
                                        thiss.formEquipment(0, "Agregar Equipo");
                                    });
                                    jQuery('#btnUpdateEquipment').off("click");
                                    jQuery('#btnUpdateEquipment').on("click", function (e) {
                                        var idEquipment = thiss.getElementID('#tblResultEquipments');
                                        if (idEquipment > 0)
                                            thiss.formEquipment(idEquipment, "Editar Equipo");
                                        else
                                            alert('Debes seleccionar un equipo.');
                                    });
                                    jQuery('#btnQuitEquipments').off("click");
                                    jQuery('#btnQuitEquipments').on("click", function (e) {
                                        thiss.deleteEquipments();
                                    });
                                };
                            });
                        };
                        this.saveActivity = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdActivity').int32(),
                                name: jQuery('#txtNameActivity').string(),
                                description: jQuery('#txaDescriptionActivity').string(),
                                agreement: { id: this.$hdnId.int32() },
                                provider: { id: jQuery('#ddlProviderActivity').int32() },
                                startDate: jQuery("#txtStartDateActivity").date(),
                                endDate: jQuery("#txtEndDateActivity").date(),
                                state: jQuery('#chkStateActivity').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileActivity", file: jQuery('#filFileActivity')[0].files[0] }]
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/saveactivity', options, function () {
                                thiss.searchActivitys(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txtNameActivity').val() === "") {
                                    success = false;
                                    message = 'Ingrese el nombre.';
                                    jQuery('#txtNameActivity').focus();
                                } else if (jQuery('#ddlProviderActivity').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el laboratorio.';
                                    jQuery('#ddlProviderActivity').focus();
                                } else if (jQuery('#txtStartDateActivity').val() === "") {
                                    success = false;
                                    message = 'Ingrese la fecha de inicio.';
                                    jQuery('#txtStartDateActivity').focus();
                                } else if (jQuery('#txtEndDateActivity').val() === "") {
                                    success = false;
                                    message = 'Ingrese la fecha final.';
                                    jQuery('#txtEndDateActivity').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteActivitys = function () {
                            var thiss = this;
                            var activityIds = com.jtm.helper.Table.getItems("#tbdResultActivitys", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), activityIds: activityIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (activityIds.length === 0) {
                                    alert('Seleccione al menos una actividad.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deleteactivitys', options, function () { thiss.searchActivitys(); });
                        };
                        this.searchActivitys = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchactivitys', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillActivitys(items, '#tblResultActivitys', "#divTotalActivity");
                            });
                        };
                        this.fillActivitys = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.provider.name + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.detailActivity = function (id) {
                            var thiss = this;
                            var options = {
                                data: { activityId: id }
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/agreement/detailactivity', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdActivity').val(item.id);
                                jQuery('#txtNameActivity').val(item.name);
                                jQuery('#ddlProviderActivity').val(item.provider.id);
                                jQuery('#txtStartDateActivity').val(item.startDate);
                                jQuery('#txtEndDateActivity').val(item.endDate);
                                jQuery('#txaDescriptionActivity').val(item.description);
                                jQuery('#chkStateActivity').prop("checked", item.state);
                                jQuery("#smlNameActivity").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.formCustody = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdActivity").int32() === 0) { alert("Debe guardar la ficha actividad primero"); return; }
                            jQuery('#divPopupActivity').dialog({
                                title: title,
                                width: '60%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                    //jQuery('#divEquipment').hide();
                                }
                            });
                            thiss.loadView('#divPopupActivity', com.jtm.Server.contextPath + "environment/agreement/formcustody", function () {
                                thiss.datePicker('#txtStartDateCustody');
                                jQuery('#txtStartTimeCustody').mask('00:00:00');
                                if (id > 0)
                                    thiss.detailCustody(id);
                                jQuery('#btnSaveCustody').off("click");
                                jQuery('#btnSaveCustody').on("click", function (e) {
                                    thiss.saveCustody();
                                });
                                jQuery("#btnOpenFileCustody").off("click")
                                jQuery("#btnOpenFileCustody").on("click", function (e) {
                                    jQuery("#filFileCustody").trigger("click");
                                });
                                jQuery("#filFileCustody").off("change");
                                jQuery("#filFileCustody").on("change", function () {
                                    jQuery("#smlNameCustody").html(jQuery('#filFileCustody')[0].files[0].name);
                                });
                            });
                        }
                        this.saveCustody = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdCustody').int32(),
                                code: jQuery('#txtCodeCustody').string(),
                                description: jQuery('#txaDescriptionCustody').string(),
                                startDate: jQuery("#txtStartDateCustody").date(),
                                startTime: jQuery("#txtStartTimeCustody").date(),
                                activity: { id: jQuery("#hdnIdActivity").int32() },
                                state: jQuery('#chkStateCustody').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileCustody", file: jQuery('#filFileCustody')[0].files[0] }]
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/savecustody', options, function () {
                                thiss.searchCustodys(); jQuery('#divPopupActivity').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#hdnIdActivity').int32() === 0) {
                                    success = false;
                                    message = 'Guarde la ficha actividad.';
                                } else if (jQuery('#txtCodeCustody').val() === "") {
                                    success = false;
                                    message = 'Ingrese el código.';
                                    jQuery('#txtCodeCustody').focus();
                                } else if (jQuery('#txtStartDateCustody').val() === "") {
                                    success = false;
                                    message = 'Seleccione la fecha de muestreo.';
                                    jQuery('#txtStartDateCustody').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteCustodys = function () {
                            var thiss = this;
                            var custodyIds = com.jtm.helper.Table.getItems("#tbdResultCustodys", true, false);
                            var options = {
                                data: { id: jQuery('#hdnIdActivity').int32(), custodyIds: custodyIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (custodyIds.length === 0) {
                                    alert('Seleccione al menos una custodia.');
                                    return false;
                                } else if (jQuery('#hdnIdActivity').val() === 0) {
                                    alert("Debe guardar la ficha actividad primero");
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deletecustodys', options, function () { thiss.searchCustodys(); });
                        };
                        this.searchCustodys = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchcustodys', {
                                data: { id: jQuery('#hdnIdActivity').int32() }
                            }, function (items) {
                                thiss.fillCustodys(items, '#tblResultCustodys', "#divTotalCustody");
                            });
                        };
                        this.fillCustodys = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.description + '</td>';
                                if (item.document == null)
                                    html += '<td></td>';
                                else
                                    html += '<td><a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + '</a></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.detailCustody = function (id) {
                            var thiss = this;
                            var options = {
                                data: { custodyId: id }
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/agreement/detailcustody', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdCustody').val(item.id);
                                jQuery('#txtCodeCustody').val(item.code);
                                jQuery('#txtStartDateCustody').val(item.startDate);
                                jQuery('#txtStartTimeCustody').val(item.startTime);
                                jQuery('#txaDescriptionCustody').val(item.description);
                                jQuery('#chkStateCustody').prop("checked", item.state);
                                jQuery("#smlNameCustody").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.formEquipment = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdActivity").int32() === 0) { alert("Debe guardar la ficha actividad primero"); return; }
                            jQuery('#divPopupActivity').dialog({
                                title: title,
                                width: '50%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                    //jQuery('#divCustody').hide();
                                }
                            });
                            thiss.loadView('#divPopupActivity', com.jtm.Server.contextPath + "environment/agreement/formequipment", function () {
                                jQuery("#ddlEquipmentEquipment").off("change");
                                jQuery("#ddlEquipmentEquipment").on("change", function () {
                                    var equipmentId = jQuery('#ddlEquipmentEquipment').int32();
                                    com.jtm.helper.DropDownList.fill({
                                        url: com.jtm.Server.contextPath + 'environment/agreement/searchcalibrations',
                                        ddl: '#ddlCalibrationEquipment',
                                        data: { id: equipmentId },
                                        fieldName: 'date',
                                        callback: null
                                    });
                                });
                                if (id > 0)
                                    thiss.detailEquipment(id);
                                jQuery('#btnSaveEquipment').off("click");
                                jQuery('#btnSaveEquipment').on("click", function (e) {
                                    thiss.saveEquipment();
                                });
                            });
                        }
                        this.saveEquipment = function () {
                            var thiss = this;
                            var options = {
                                data: {
                                    id: jQuery('#hdnIdActivity').int32(),
                                    equipmentId: jQuery('#hdnIdEquipment').int32(),
                                    equipmentId2: jQuery('#ddlEquipmentEquipment').int32(),
                                    calibrationId: jQuery('#ddlCalibrationEquipment').int32()
                                },
                                isJson: false,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/saveequipment', options, function () {
                                thiss.searchEquipments(); jQuery('#divPopupActivity').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#hdnIdActivity').int32() === 0) {
                                    success = false;
                                    message = 'Guarde la ficha actividad.';
                                } else if (jQuery('#ddlEquipmentEquipment').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el equipo.';
                                    jQuery('#ddlEquipmentEquipment').focus();
                                } else if (jQuery('#ddlCalibrationEquipment').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione la calibración.';
                                    jQuery('#ddlCalibrationEquipment').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteEquipments = function () {
                            var thiss = this;
                            var equipmentIds = com.jtm.helper.Table.getItems("#tbdResultEquipments", true, false);
                            var options = {
                                data: { id: jQuery('#hdnIdActivity').int32(), equipmentIds: equipmentIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (equipmentIds.length === 0) {
                                    alert('Seleccione al menos un equipo.');
                                    return false;
                                } else if (jQuery('#hdnIdActivity').val() === 0) {
                                    alert("Debe guardar la ficha actividad primero");
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deleteequipments', options, function () { thiss.searchEquipments(); });
                        };
                        this.searchEquipments = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchequipments', {
                                data: { id: jQuery('#hdnIdActivity').int32() }
                            }, function (items) {
                                thiss.fillEquipments(items, '#tblResultEquipments', "#divTotalEquipment");
                            });
                        };
                        this.fillEquipments = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.equipmentType.name + '</td>';
                                html += '<td>' + item.calibration.date + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.detailEquipment = function (id) {
                            var thiss = this;
                            var activityId = jQuery("#hdnIdActivity").int32();
                            var options = {
                                data: { id: activityId, equipmentId: id },
                                isJson: false
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/agreement/detailequipment', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdEquipment').val(item.id);
                                jQuery('#ddlEquipmentEquipment').val(item.id);
                                jQuery('#ddlEquipmentEquipment').trigger("change");
                                jQuery('#ddlCalibrationEquipment').val(item.calibration.id);
                            });
                        };
                        this.searchParameters = function () {
                            var thiss = this;
                            thiss.$tblParameters.find('>tbody').empty();                            
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchparameters', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillParameters(items, thiss.$tblParameters);
                            });
                        };
                        this.fillParameters = function (items, $tbl, parametersExist) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-legalstandardid=' + item.legalStandard.id + ' data-parameteranalysisid=' + item.parameterAnalysis.id + ' data-minimumvalue=' + item.minimumValue + ' data-maximumvalue=' + item.maximumValue + '>';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.legalStandard.number + '</td>';
                                html += '<td>' + item.minimumValue + '</td>';
                                html += '<td>' + item.maximumValue + '</td>';
                                html += '<td>' + item.parameterAnalysis.name + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find('>tbody').html(html);
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                            if (parametersExist !== undefined) {
                                parametersExist.forEach(function (id) {
                                    $tbl.find('>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formParameter = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0){
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            if (thiss.$ddlModel.int32() === 0) {
                                alert('Seleccione un modelo');
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: "Agregar Parametros",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/agreement/formparameter", function () {
                                thiss.$tblParameters2 = thiss.$divPopup.find(Main.TBLRESULTPARAMETERS2);
                                thiss.$btnSaveParameters = thiss.$form.find(Main.BTNSAVEPARAMETERS);
                                thiss.$btnSaveParameters.off("click");
                                thiss.$btnSaveParameters.on("click", function (e) {
                                    thiss.saveParameters();                                    
                                });
                                var parametersExist = com.jtm.helper.Table.getItems(thiss.$tblParameters, false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'environment/parameter/searchforagreement', {
                                    data: { modelId: thiss.$ddlModel.int32() },
                                    isJson: false
                                }, function (items) {
                                    thiss.fillParameters(items, thiss.$tblParameters2, parametersExist);
                                });
                            });
                        };
                        this.saveParameters = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0){
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var parameters = [];
                            var $tr = null;
                            thiss.$tblParameters2.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(jQuery(input).closest('tr'));
                                parameters.push({
                                    id: $tr.attr('data-uniqueid'),
                                    legalStandard: { id: $tr.attr('data-legalstandardid') },
                                    parameterAnalysis: { id: $tr.attr('data-parameteranalysisid') }
                                });
                            });
                            var item = {
                                id: thiss.$hdnId.int32(),
                                parameters: parameters
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/saveparameters', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchParameters();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (parameters.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un parametro';
                                }
                                parameters.forEach(function (parameter) {
                                    if (parameter.id == 0) {
                                        success = false;
                                        message = 'Seleccione el parametro.';
                                    }
                                    else if (parameter.legalStandard.id === 0) {
                                        success = false;
                                        message = 'Seleccione la norma legal.';
                                    }
                                    else if (parameter.parameterAnalysis.id === 0) {
                                        success = false;
                                        message = 'Seleccione Análsis Parametro.';
                                    }
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteParameters = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var parameterIds = com.jtm.helper.Table.getItems(thiss.$tblParameters, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), parameterIds: parameterIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (parameterIds.length === 0) {
                                    alert('Seleccione al menos una parametro.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deleteparameters', options, function () { thiss.searchParameters(); });
                        };
                        this.formStation = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar Estaciones",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/agreement/formstation", function () {
                                jQuery('#btnSearchStations').off("click");
                                jQuery('#btnSearchStations').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveStations').off("click");
                                jQuery('#btnSaveStations').on("click", function (e) {
                                    thiss.saveStations();
                                });
                            });
                            function search() {
                                jQuery('#tbdResultStations2').empty();
                                var data = {
                                    agreementId: thiss.$hdnId.int32(),
                                    code: jQuery('#txtCodeSearchStation').string(),
                                    name: jQuery('#txtNameSearchStation').string()
                                };                                
                                var stationsExist = com.jtm.helper.Table.getItems("#tbdResultStations", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'environment/station/searchforagreement', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    thiss.fillStations(items, '#tblResultStations2', "#divTotalStation2", stationsExist);
                                });
                            }
                        }
                        this.saveStations = function () {
                            var thiss = this;
                            var stationIds = com.jtm.helper.Table.getItems("#tbdResultStations2", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), stationIds: stationIds },
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/savestations', options, function (response) {
                                if (response.success) {
                                    thiss.searchStations();
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
                                if (stationIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos una estación.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteStations = function () {
                            var thiss = this;
                            var stationIds = com.jtm.helper.Table.getItems("#tbdResultStations", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), stationIds: stationIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (stationIds.length === 0) {
                                    alert('Seleccione al menos una estación.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deletestations', options, function () { thiss.searchStations(); });
                        };
                        this.searchStations = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchstations', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillStations(items, '#tblResultStations', "#divTotalStation");
                            });
                        };
                        this.fillStations = function (items, tbl, div, stationsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.stationClass.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (stationsExist !== undefined) {
                                stationsExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formInformationSource = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar Fuente Información",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/agreement/forminformationsource", function () {
                                jQuery('#btnSearchInformationSources').off("click");
                                jQuery('#btnSearchInformationSources').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveInformationSources').off("click");
                                jQuery('#btnSaveInformationSources').on("click", function (e) {
                                    thiss.saveInformationSources();
                                });
                            });
                            function search() {
                                jQuery('#tbdResultInformationSources2').empty();
                                var data = {
                                    agreementId: thiss.$hdnId.int32(),
                                    name: jQuery('#txtNameSearchInformationSource').string()
                                };                                
                                var InformationSourcesExist = com.jtm.helper.Table.getItems("#tbdResultInformationSources", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'general/informationsource/searchforagreement', {
                                    data: data,
                                    isJson: false
                                }, function (items) {
                                    thiss.fillInformationSources(items, '#tblResultInformationSources2', "#divTotalInformationSource2", InformationSourcesExist);
                                });
                            }
                        };
                        this.saveInformationSources = function () {
                            var thiss = this;
                            var informationSourceIds = com.jtm.helper.Table.getItems("#tbdResultInformationSources2", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), informationSourceIds: informationSourceIds },
                                isJson: false,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/agreement/saveinformationsources', options, function (response) {
                                if (response.success) {
                                    thiss.searchInformationSources();
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
                                if (informationSourceIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos una fuente información.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteInformationSources = function () {                            
                            var thiss = this;
                            var informationSourceIds = com.jtm.helper.Table.getItems("#tbdResultInformationSources", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), informationSourceIds: informationSourceIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (informationSourceIds.length === 0) {
                                    alert('Seleccione al menos una fuente información.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/agreement/deleteinformationsources', options, function () { thiss.searchInformationSources(); });
                        };
                        this.searchInformationSources = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchinformationsources', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillInformationSources(items, '#tblResultInformationSources', "#divTotalInformationSource");
                            });
                        };
                        this.fillInformationSources = function (items, tbl, div, InformationSourcesExist) {
                            var html = '';                            
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.description + '</td>';                                
                                html += '<td>' + item.informationSourceType.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (InformationSourcesExist !== undefined) {
                                InformationSourcesExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.processFile = function (file) {
                            var thiss = this;
                            var options = {
                                attachments: [{ id: "filFile", file: file }],
                                isJson: false,
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchfile', options, function (items) {
                                thiss.$filFile.val("");
                                thiss.fillResult(items);
                            });
                            function validate() {
                                if (thiss.$filFile.val() === "") {
                                    alert('Seleccione un archivo excel');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.fillResult = function (items) {
                            var thiss = this;
                            var number = 0, informationSourceName = "";
                            thiss.cleanTable(thiss.$tblResultData);
                            if (items == undefined || items == null) return;
                            if (items.length == 0) return;
                            writeBody();
                            thiss.$tblResultData.find('>caption>span').html(thiss.$tblResultData.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultData);
                            function writeBody() {
                                thiss.$tblResultData.append("<tbody></tbody>");                            
                                items.forEach(function (item, i) {
                                    //var rowspan = item.agreements.length;
                                    item.agreements.forEach(function (itemAgreement, k) {
                                        thiss.$tblResultData.find('>tbody').append("<tr></tr>");
                                        //if (k == 0) {
                                        //    thiss.$tblResultData.find('>tbody>tr:last').append("<td rowspan=" + rowspan + "><input type='checkbox'/></td>");
                                        //    thiss.$tblResultData.find('>tbody>tr:last').append('<td rowspan=' + rowspan + ' data-legalframeid= "' + item.id + '">' + (number += 1) + '</td>');
                                        //    thiss.$tblResultData.find('>tbody>tr:last').append('<td rowspan=' + rowspan + '>' + itemAgreement.legalFrame.name + '</td>');
                                        //}
                                        thiss.$tblResultData.find('>tbody>tr:last').append("<td><input type='checkbox'/></td>");
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td data-legalframeid= "' + item.id + '">' + (number += 1) + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.legalFrame.name + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.agreementOrigin.name + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.agreementType.name + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.name + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.periodTypeFrequency.name + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.periodTypeReport.name + '</td>');
                                        itemAgreement.informationSources.forEach(function (itemAgreementInformationSource) {
                                            informationSourceName += itemAgreementInformationSource.name + ", ";
                                        });
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + informationSourceName.substring(0, informationSourceName.length - 2) + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.reportDescription + '</td>');
                                        thiss.$tblResultData.find('>tbody>tr:last').append('<td>' + itemAgreement.legalFrame.informationSource.name + '</td>');
                                        informationSourceName = "";
                                    });
                                });
                            }
                        };
                        this.formFormat = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Formato de Archivo",
                                width: '950',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/data/formformat", function () {
                                var $img = thiss.$divPopup.find('#imgFormat');
                                $img.attr("src", com.jtm.Server.contextPath + 'assets/img/formats/agreement.png');
                            });
                        };
                        this.cleanTable = function ($tbl) {
                            //$tbl.find('>thead').remove();
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
                            var agreement = null;
                            var legalFrames = [];
                            var $tr = null;
                            var nameLegalFrame="";
                            thiss.$tblResultData.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');
                                var legalFrameId = $tr.find('td:eq(1)').attr('data-legalframeid');
                                var legalFramename = $tr.find('td:eq(2)').text();
                                var legalFrameInformationSourceName = $tr.find('td:eq(10)').text();
                                var rowspan = $tr.find('td:eq(1)').attr('rowspan');
                                var informationSourceName = "", informationSourcesName = [], informationSources = [];
                                informationSourceName = $tr.find('td:eq(8)').text();
                                //if (legalFrameId != undefined && rowspan != undefined) { informationSourceName = $tr.find('td:eq(8)').text(); } else { informationSourceName = $tr.find('td:eq(5)').text(); }
                                informationSourcesName = informationSourceName.split(", ");
                                informationSourcesName.forEach(function (informationSourceName2) {
                                    informationSources.push({
                                        id: 0,
                                        name: informationSourceName2
                                    });
                                });
                                //if (legalFrameId != undefined && rowspan != undefined) {
                                if (legalFramename != nameLegalFrame) {
                                    agreement = [];
                                    agreement.push({
                                        id: 0,
                                        agreementOrigin: { name: $tr.find('td:eq(3)').text() },
                                        agreementType: { name: $tr.find('td:eq(4)').text() },
                                        name: $tr.find('td:eq(5)').text(),
                                        periodTypeFrequency: { name: $tr.find('td:eq(6)').text() },
                                        periodTypeReport: { name: $tr.find('td:eq(7)').text() },
                                        informationSources: informationSources,
                                        reportDescription: $tr.find('td:eq(9)').text()
                                    });
                                    legalFrames.push({
                                        id: legalFrameId,
                                        name: legalFramename,
                                        informationSource: { id: 0, name: legalFrameInformationSourceName },
                                        agreements: agreement
                                    });
                                    nameLegalFrame = legalFramename;
                                } else {
                                    agreement.push({
                                        id: 0,
                                        agreementOrigin: { name: $tr.find('td:eq(3)').text() },
                                        agreementType: { name: $tr.find('td:eq(4)').text() },
                                        name: $tr.find('td:eq(5)').text(),
                                        periodTypeFrequency: { name: $tr.find('td:eq(6)').text() },
                                        periodTypeReport: { name: $tr.find('td:eq(7)').text() },
                                        informationSources: informationSources,
                                        reportDescription: $tr.find('td:eq(9)').text()
                                //        //agreementOrigin: { name: $tr.find('td:eq(0)').text() },
                                //        //agreementType: { name: $tr.find('td:eq(1)').text() },
                                //        //name: $tr.find('td:eq(2)').text(),
                                //        //periodTypeFrequency: { name: $tr.find('td:eq(3)').text() },
                                //        //periodTypeReport: { name: $tr.find('td:eq(4)').text() },
                                //        //informationSources: informationSources,
                                //        //reportDescription: $tr.find('td:eq(6)').text()
                                    });
                                }
                            });
                            //thiss.$tblResultData.find('>tbody>tr').toArray().forEach(function (tr) {                                
                            //    $tr = jQuery(tr);                                
                            //    var legalFrameId = $tr.find('td:eq(1)').attr('data-legalframeid');
                            //    var legalFamename = $tr.find('td:eq(2)').text();
                            //    var legalFrameInformationSourceName = $tr.find('td:eq(10)').text();
                            //    var rowspan = $tr.find('td:eq(1)').attr('rowspan');
                            //    var informationSourceName = "", informationSourcesName = [], informationSources = [];
                            //    if (legalFrameId != undefined && rowspan != undefined) { informationSourceName = $tr.find('td:eq(8)').text(); } else { informationSourceName = $tr.find('td:eq(5)').text(); }
                            //    informationSourcesName = informationSourceName.split(", ");
                            //    informationSourcesName.forEach(function (informationSourceName2) {
                            //        informationSources.push({
                            //            id: 0,
                            //            name: informationSourceName2
                            //        });
                            //    });
                            //    if (legalFrameId != undefined && rowspan != undefined) {
                            //        agreement = [];
                            //        agreement.push({
                            //            id: 0,
                            //            agreementOrigin: { name: $tr.find('td:eq(3)').text() },
                            //            agreementType: { name: $tr.find('td:eq(4)').text() },
                            //            name: $tr.find('td:eq(5)').text(),
                            //            periodTypeFrequency: { name: $tr.find('td:eq(6)').text() },
                            //            periodTypeReport: { name: $tr.find('td:eq(7)').text() },
                            //            informationSources: informationSources,
                            //            reportDescription: $tr.find('td:eq(9)').text()
                            //        });
                            //        legalFrames.push({
                            //            id: legalFrameId,
                            //            name: legalFamename,
                            //            informationSource: { id: 0, name: legalFrameInformationSourceName },
                            //            agreements: agreement
                            //        });
                            //    } else {
                            //        agreement.push({
                            //            id: 0,
                            //            agreementOrigin: { name: $tr.find('td:eq(0)').text() },
                            //            agreementType: { name: $tr.find('td:eq(1)').text() },
                            //            name: $tr.find('td:eq(2)').text(),
                            //            periodTypeFrequency: { name: $tr.find('td:eq(3)').text() },
                            //            periodTypeReport: { name: $tr.find('td:eq(4)').text() },
                            //            informationSources: informationSources,
                            //            reportDescription: $tr.find('td:eq(6)').text()
                            //        });
                            //    }
                            //});                            
                            var options = {
                                data: { items: legalFrames },
                                isJson: false,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/legalframe/SaveMassive', options, function () {
                                thiss.cleanTable(thiss.$tblResultData);
                                thiss.$filFile.val("");
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (legalFrames.length == 0) {
                                    success = false;
                                    toastr.info("No ha seleccionado ningun dato.");
                                    // message = 'No ha seleccionado ningun dato.';
                                    return;
                                }
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
                    }
                    Main.DDLTHEMATIC = '#ddlThematic';
                    Main.DDLMODEL = '#ddlModel';
                    Main.DIVPARAMETERS = '#divParameters';
                    Main.TBLRESULTPARAMETERS = '#tblResultParameters';
                    Main.TBLRESULTPARAMETERS2 = '#tblResultParameters2';
                    Main.BTNSAVEPARAMETERS = '#btnSaveParameters';
                    Main.BTNADDPARAMETERS = '#btnAddParameters';
                    Main.BTNQUITPARAMETERS = '#btnQuitParameters';

                    Main.TBLRESULTSTATIONS = '#tblResultStations';
                    Main.TBLRESULTSTATIONS2 = '#tblResultStations2';
                    Main.BTNSAVESTATIONS = '#btnSaveStations';
                    Main.BTNSEARCHSTATIONS = '#btnSearchStations';
                    Main.BTNADDSTATIONS = '#btnAddStations';
                    Main.BTNQUITSTATIONS = '#btnQuitStations';

                    Main.TBLRESULTINFORMATIONSOURCES = '#tblResultInformationSources';
                    Main.TBLRESULTINFORMATIONSOURCES2 = '#tblResultInformationSources2';
                    Main.BTNSAVEINFORMATIONSOURCES = '#btnSaveInformationSources';
                    Main.BTNSEARCHINFORMATIONSOURCES = '#btnSearchInformationSources';
                    Main.BTNADDINFORMATIONSOURCES = '#btnAddInformationSources';
                    Main.BTNQUITINFORMATIONSOURCES = '#btnQuitInformationSources';

                    Main.BTNIMPORT = "#btnImport";
                    Main.BTNUPLOAD = "#btnUpload";
                    Main.BTNFORMAT = "#btnFormat";
                    Main.BTNDELETEDATA = "#btnDeleteData";
                    Main.TBLRESULTDATA = "#tblResultData";
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$btnImport = this.$main.find(Main.BTNIMPORT);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                        thiss.$btnImport.off("click");
                        thiss.$btnImport.on("click", function (e) {
                            thiss.formMassive(null, 0);
                        });
                    };
                    Main.prototype.formMassive = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$btnDeleteData = thiss.$form.find(Main.BTNDELETEDATA);
                            thiss.$btnUpload = thiss.$form.find(Main.BTNUPLOAD);
                            thiss.$btnFormat = thiss.$form.find(Main.BTNFORMAT);
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
                        };
                        _super.prototype.form.call(this, com.jtm.Server.contextPath + 'environment/agreement/formmassive', id, options);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$ddlThematic = thiss.$form.find(Main.DDLTHEMATIC);
                            thiss.$ddlModel = thiss.$form.find(Main.DDLMODEL);
                            thiss.$tblParameters = thiss.$form.find(Main.TBLRESULTPARAMETERS);                            
                            thiss.$btnAddParameters = thiss.$form.find(Main.BTNADDPARAMETERS);
                            thiss.$btnQuitParameters = thiss.$form.find(Main.BTNQUITPARAMETERS);
                            thiss.datePicker('#txtStartDate');
                            thiss.datePicker('#txtEndDate');
                            thiss.$ddlThematic.off("change");
                            thiss.$ddlThematic.on("change", function (e) {
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + 'environment/model/searchbythematic',
                                    ddl: thiss.$ddlModel,
                                    data: {
                                        thematicId: $(this).int32(),
                                    }
                                });
                            });                            
                            thiss.$btnAddParameters.off("click");
                            thiss.$btnAddParameters.on("click", function (e) {
                                thiss.formParameter();
                            });
                            thiss.$btnQuitParameters.off("click");
                            thiss.$btnQuitParameters.on("click", function (e) {
                                thiss.deleteParameters();
                            });
                            jQuery('#btnAddActivity').off("click");
                            jQuery('#btnAddActivity').on("click", function (e) {
                                thiss.formActivity(0, "Agregar Actividad");
                            });
                            jQuery('#btnUpdateActivity').off("click");
                            jQuery('#btnUpdateActivity').on("click", function (e) {
                                var idActivity = thiss.getElementID('#tblResultActivitys');
                                if (idActivity > 0)
                                    thiss.formActivity(idActivity, "Editar Actividad");
                                else
                                    alert('Debes seleccionar una actividad.');
                            });
                            jQuery('#btnQuitActivitys').off("click");
                            jQuery('#btnQuitActivitys').on("click", function (e) {
                                thiss.deleteActivitys();
                            });
                            jQuery('#btnAddStations').off("click");
                            jQuery('#btnAddStations').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                thiss.formStation();                                
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitStations').off("click");
                            jQuery('#btnQuitStations').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteStations();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnAddInformationSources').off("click");
                            jQuery('#btnAddInformationSources').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formInformationSource();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitInformationSources').off("click");
                            jQuery('#btnQuitInformationSources').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteInformationSources();
                                else
                                    alert(Main.NEWELEMENTID);
                            });                           
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtStartDate').val(item.startDate);
                            jQuery('#txtEndDate').val(item.endDate);
                            jQuery('#ddlLegalFrame').val(item.legalFrame.id);
                            jQuery('#ddlAgreementType').val(item.agreementType.id);
                            jQuery('#ddlAgreementOrigin').val(item.agreementOrigin.id);                            
                            jQuery('#ddlPeriodTypeReport').val(item.periodTypeReport.id === null ? 0 : item.periodTypeReport.id);
                            jQuery('#ddlPeriodTypeFrequency').val(item.periodTypeFrequency.id);
                            jQuery('#txaReportDescription').val(item.reportDescription);
                            jQuery('#ddlEmployee').val(item.employee.id === null ? 0 : item.employee.id);
                            thiss.$ddlThematic.val(item.model.thematic.id === null ? 0 : item.model.thematic.id);
                            jQuery('#chkIsMonitoring').prop("checked", item.isMonitoring);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.$ddlThematic.trigger('change');
                            jQuery('#ddlModel').val(item.model.id === null ? 0 : item.model.id);
                            thiss.searchActivitys();
                            thiss.searchStations();
                            thiss.searchInformationSources();
                            thiss.searchParameters();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
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
                            switchable: false
                        }, {
                            field: "legalFrame.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "agreementType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "agreementOrigin.name",
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
                            name: jQuery('#txtNameSearch').val(),
                            legalFrame: { id: jQuery('#ddlLegalFrameSearch').int32() },
                            agreementType: { id: jQuery('#ddlAgreementTypeSearch').int32() },
                            agreementOrigin: { id: jQuery('#ddlAgreementOriginSearch').int32() },
                            model: { id: jQuery('#ddlModelSearch').int32() },
                            employee: { id: jQuery('#ddlEmployeeSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: jQuery('#txtName').val(),
                            startDate: jQuery("#txtStartDate").val(),
                            endDate: jQuery("#txtEndDate").val(),
                            reportDescription: jQuery("#txaReportDescription").val(),
                            isMonitoring: jQuery('#chkIsMonitoring').boolean(),
                            legalFrame: { id: jQuery("#ddlLegalFrame").int32() },
                            agreementType: { id: jQuery("#ddlAgreementType").int32() },
                            agreementOrigin: { id: jQuery("#ddlAgreementOrigin").int32() },
                            model: { id: jQuery("#ddlModel").int32() },
                            periodTypeReport: { id: jQuery("#ddlPeriodTypeReport").int32() },
                            periodTypeFrequency: { id: jQuery("#ddlPeriodTypeFrequency").int32() },
                            employee: { id: jQuery("#ddlEmployee").int32() },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#txtStartDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha de inicio.';
                                jQuery('#txtStartDate').focus();
                            } else if (jQuery('#txtEndDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha final.';
                                jQuery('#txtEndDate').focus();
                            } else if (jQuery('#ddlLegalFrame').int32() === 0) {
                                success = false;
                                message = 'Seleccione el IGA o Licencia.';
                                jQuery('#ddlLegalFrame').focus();
                            } /*else if (jQuery('#txaDescription').string() === '') {
                                success = false;
                                message = 'Ingrese la descripción.';
                                jQuery('#txaDescription').focus();
                            } else if (jQuery('#ddlProvider').int32() === 0) {
                                success = false;
                                message = 'Seleccione la empresa contratista.';
                                jQuery('#ddlProvider').focus();
                            }*/
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
                })(jtm.Master);
                agreement.Main = Main;
            })(environment.agreement || (environment.agreement = {}));
            var agreement = environment.agreement;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.agreement.Main.execute();