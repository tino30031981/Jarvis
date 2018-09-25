(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (fiscalization) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "f";                        
                        this.localizationFormViewer = null;
                        this.localizationViewer = null;
                        this.divLocalization = null;                        
                        this.formLocalization = function (id, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }                            
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
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/fiscalization/formlocalization", function () {
                                thiss.localizationFormViewer.load(thiss.$divPopup.find(Main.FORMLOCALIZATION), {});
                                thiss.formAttachment.load(thiss.$divPopup.find(Main.DOMATTACHMENTFORM), {
                                    urlSave: com.jtm.Server.contextPath + "environment/fiscalization/savedocumentlocalization",
                                    urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                    urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                    urlSearch: com.jtm.Server.contextPath + "environment/fiscalization/searchdocumentslocalization",
                                    $hdnId: jQuery('#hdnIdFormLocalization')
                                });
                                jQuery('#txtAltitudeLocalization').numeric({ negative: false, decimalPlaces: 3 });                               
                                jQuery('#btnSaveLocalization').off("click");
                                jQuery('#btnSaveLocalization').on("click", function (e) {
                                    thiss.saveLocalization();
                                });
                                if (id > 0)
                                    thiss.detailLocalization(id);
                            });
                        };
                        this.saveLocalization = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormLocalization').int32(),
                                description: jQuery('#txtDescriptionLocalization').val(),
                                observation: jQuery('#txtObservationLocalization').val(),
                                altitude: jQuery("#txtAltitudeLocalization").number(),
                                location: jQuery('#txtLocationLocalization').val(),
                                fiscalization: { id: thiss.$hdnId.int32() },
                                spatialReference: { id: thiss.localizationFormViewer.$ddlSpatialReference.int32() },
                                coordinate: { x: thiss.localizationFormViewer.$txtX.number(), y: thiss.localizationFormViewer.$txtY.number() },
                                state: jQuery('#chkStateLocalization').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/fiscalization/savelocalization', options, function () {
                                jQuery('#divPopup').dialog('close');
                                thiss.searchLocalizations();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txtDescriptionLocalization').val() === "") {
                                    success = false;
                                    message = 'Ingrese una description.';
                                    jQuery('#txtDescriptionLocalization').focus();
                                } else if (thiss.localizationFormViewer.$ddlSpatialReference.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el sistema referencial.';
                                    thiss.localizationFormViewer.$ddlSpatialReference.focus();
                                } else if (thiss.localizationFormViewer.$txtX.val() === '') {
                                    success = false;
                                    message = 'Ingrese el eje X.';
                                    thiss.localizationFormViewer.$txtX.focus();
                                } else if (thiss.localizationFormViewer.$txtY.val() === '') {
                                    success = false;
                                    message = 'Ingrese el eje Y.';
                                    thiss.localizationFormViewer.$txtY.focus();
                                } else if (jQuery('#txtAltitudeLocalization').string() === '') {
                                    success = false;
                                    message = 'Ingrese la altitud.';
                                    jQuery('#txtAltitudeLocalization').focus();
                                } else if (jQuery('#txtLocationLocalization').string() === '') {
                                    success = false;
                                    message = 'Ingrese la ubicación.';
                                    jQuery('#txtLocationLocalization').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailLocalization = function (id) {
                            var thiss = this;
                            var options = {
                                data: { localizationId: id }
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'environment/fiscalization/detaillocalization', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormLocalization').val(item.id);
                                thiss.localizationFormViewer.$ddlSpatialReference.val(item.spatialReference.id);
                                jQuery('#txtLocationLocalization').val(item.location);
                                jQuery('#txtAltitudeLocalization').val(item.altitude);
                                jQuery('#txtObservationLocalization').val(item.observation);
                                jQuery('#txtDescriptionLocalization').val(item.description);
                                jQuery('#chkStateLocalization').prop("checked", item.state);
                                thiss.localizationFormViewer.$txtX.val((item.coordinate.x).toFixed(thiss.config.number.decimalCount));
                                thiss.localizationFormViewer.$txtY.val((item.coordinate.y).toFixed(thiss.config.number.decimalCount));
                                thiss.localizationFormViewer.addFeatures(data.featuresList);
                                searchDistricts(com.jtm.Server.contextPath + "environment/localization/searchdistricts");
                                thiss.formAttachment.search(item.id);
                            });
                            function searchDistricts(url) {
                                thiss.searchConfig(url, { isJson: false, data: { id: jQuery('#hdnIdFormLocalization').int32() } }, function (items) {
                                    if (items.length === 0) return;
                                    var html = "";
                                    items.forEach(function (item) {
                                        html += item.province.department.name + '/' + item.province.name + '/' + item.name + ', ';
                                    });
                                    jQuery('#divPopup').find('#txtUbigeoLocalization').val(html.substring(0, html.length - 2));
                                });
                            };
                        };
                        this.deleteLocalizations = function () {
                            var thiss = this;
                            var localizationIds = com.jtm.helper.Table.getItems("#tbdResultLocalizations", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), localizationIds: localizationIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (localizationIds.length === 0) {
                                    alert('Seleccione al menos una incidencia.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                }
                                else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/fiscalization/deletelocalizations', options, function () {
                                thiss.searchLocalizations();
                                jQuery("#tbdResultInfractions").empty();
                                jQuery("#tbdResultTracings").empty();
                            });
                        };
                        this.searchLocalizations = function () {
                            var thiss = this;
                            if (this.$hdnId.int32() === 0) return;
                            var options = {
                                url: com.jtm.Server.contextPath + 'environment/fiscalization/searchlocalizations',
                                data: { id: thiss.$hdnId.int32() },
                                validate : validate, isJson:false
                            };
                            thiss.ajax(options, function (data) {
                                thiss.fillLocalizations(data.items, '#tblResultLocalizations', "#divTotalLocalization");
                                thiss.localizationViewer.addFeatures(data.featuresList);
                            });
                            function validate() { return true; }
                        };
                        this.fillLocalizations = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.location + '</td>';
                                html += '<td>' + (item.coordinate.x).toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '<td>' + (item.coordinate.y).toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '<td>' + item.spatialReference.name + '</td>';
                                html += '<td>' + item.observation + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);

                            jQuery(tbl).off("dblclick");
                            jQuery(tbl).on("dblclick", ">tbody>tr", function (e) {
                                var localizationId = jQuery(this).find("input:checkbox").val();
                                jQuery("#hdnIdLocalization").val(localizationId);
                                thiss.searchInfractions();
                                jQuery('#tblResultTracings>tbody>tr').remove();
                            });                            
                        };
                        this.formInfraction = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdLocalization").int32() === 0) { alert("Debe hacer doble click en una indicencia"); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/fiscalization/forminfraction", function () {
                                thiss.datePicker('#txtEndDateInfraction');
                                jQuery('#txtAmountInfraction').numeric({ negative: false, decimalPlaces: 3 });
                                if (id > 0) {
                                    thiss.detailInfraction(id);
                                }
                                jQuery('#btnSaveInfraction').off("click");
                                jQuery('#btnSaveInfraction').on("click", function (e) {
                                    thiss.saveInfraction();
                                });
                                jQuery("#btnOpenFileInfraction").off("click")
                                jQuery("#btnOpenFileInfraction").on("click", function (e) {
                                    jQuery("#filFileInfraction").trigger("click");
                                });
                                jQuery("#filFileInfraction").off("change");
                                jQuery("#filFileInfraction").on("change", function () {
                                    jQuery("#smlNameInfraction").html(jQuery('#filFileInfraction')[0].files[0].name);
                                });
                            });
                        };
                        this.saveInfraction = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormInfraction').int32(),
                                code: jQuery('#txtCodeInfraction').val(),
                                description: jQuery('#txtDescriptionInfraction').val(),
                                legalnorm: jQuery('#txtLegalNormInfraction').val(),
                                sanction: jQuery('#txtSanctionInfraction').val(),
                                endDate: jQuery('#txtEndDateInfraction').date(),
                                amount: jQuery("#txtAmountInfraction").number(),
                                localization: { id: jQuery('#hdnIdLocalization').int32() },
                                stateAttention: { id: jQuery('#ddlStateAttentionInfraction').int32() },
                                infractionType: { id: jQuery('#ddlInfractionTypeInfraction').int32() },
                                state: jQuery('#chkStateInfraction').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileInfraction", file: jQuery('#filFileInfraction')[0].files[0] }]
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/fiscalization/saveinfraction', options, function () {
                                jQuery('#divPopup').dialog('close');
                                thiss.searchInfractions();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#txtCodeInfraction').val() === "") {
                                    success = false;
                                    message = 'Ingrese un código.';
                                    jQuery('#txtCodeInfraction').focus();
                                } else if (jQuery('#txtDescriptionInfraction').val() === "") {
                                    success = false;
                                    message = 'Ingrese una description.';
                                    jQuery('#txtDescriptionInfraction').focus();
                                } else if (jQuery('#txtLegalNormInfraction').val() === "") {
                                    success = false;
                                    message = 'Ingrese una norma legal.';
                                    jQuery('#txtLegalNormInfraction').focus();
                                } else if (jQuery('#txtSanctionInfraction').val() === "") {
                                    success = false;
                                    message = 'Ingrese una sanción.';
                                    jQuery('#txtSanctionInfraction').focus();
                                } else if (jQuery('#txtAmountInfraction').val() === "") {
                                    success = false;
                                    message = 'Ingrese un monto.';
                                    jQuery('#txtAmountInfraction').focus();
                                } else if (jQuery('#ddlStateAttentionInfraction').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el estado de atención.';
                                    jQuery('#ddlStateAttentionInfraction').focus();
                                } else if (jQuery('#ddlInfractionTypeInfraction').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el tipo de infracción.';
                                    jQuery('#ddlInfractionTypeInfraction').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailInfraction = function (id) {
                            var thiss = this;
                            var options = {
                                data: { infractionId: id }
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'environment/fiscalization/detailinfraction', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormInfraction').val(item.id);
                                jQuery('#txtCodeInfraction').val(item.code);
                                jQuery('#txtDescriptionInfraction').val(item.description);
                                jQuery('#txtLegalNormInfraction').val(item.legalNorm);
                                jQuery('#txtSanctionInfraction').val(item.sanction);
                                jQuery('#txtEndDateInfraction').val(item.endDate);
                                jQuery('#txtAmountInfraction').val(item.amount);
                                jQuery('#ddlStateAttentionInfraction').val(item.stateAttention.id);
                                jQuery('#ddlInfractionTypeInfraction').val(item.infractionType.id);
                                jQuery('#chkStateInfraction').prop("checked", item.state);
                                jQuery("#smlNameInfraction").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.deleteInfractions = function () {
                            var thiss = this;
                            var infractionIds = com.jtm.helper.Table.getItems("#tbdResultInfractions", true, false);
                            var options = {
                                data: { localizationId: jQuery('#hdnIdLocalization').int32(), infractionIds: infractionIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (jQuery('#hdnIdLocalization').int32() === 0) {
                                    alert("Debe seleccionar una incidencia");
                                    return false;
                                } else if (infractionIds.length === 0) {
                                    alert('Seleccione al menos una infracción.');
                                    return false;
                                }
                                else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/fiscalization/deleteinfractions', options, function () {
                                thiss.searchInfractions();
                                jQuery("#tbdResultTracings").empty();
                            });
                        };
                        this.searchInfractions = function () {
                            var thiss = this;
                            if (jQuery("#hdnIdLocalization").int32() === 0) return;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/fiscalization/searchinfractions', {
                                data: { localizationId: jQuery("#hdnIdLocalization").int32() }
                            }, function (items) {   
                                thiss.fillInfractions(items, '#tblResultInfractions', "#divTotalInfraction");
                            });
                        };
                        this.fillInfractions = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.infractionType.name + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.legalNorm + '</td>';
                                html += '<td>' + item.sanction + '</td>';
                                html += '<td>' + item.amount + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.stateAttention.name + '</td>';
                                if (item.document === null)
                                    html += '<td></td>';
                                else
                                    html += '<td><a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + '</a></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            jQuery(tbl).off("dblclick");
                            jQuery(tbl).on("dblclick", ">tbody>tr", function (e) {
                                var infractionId = jQuery(this).find("input:checkbox").val();
                                jQuery("#hdnIdInfraction").val(infractionId)
                                thiss.searchTracings();
                            });
                        };
                        this.formTracing = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdInfraction").int32() === 0) { alert("Debe hacer doble click en una infración"); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/fiscalization/formtracing", function () {
                                thiss.datePicker('#txtStartDateTracing');
                                thiss.datePicker('#txtEndDateTracing');
                                if (id > 0) {
                                    thiss.detailTracing(id);
                                }
                                jQuery('#btnSaveTracing').off("click");
                                jQuery('#btnSaveTracing').on("click", function (e) {
                                    thiss.saveTracing();
                                });
                                jQuery("#btnOpenFileTracing").off("click")
                                jQuery("#btnOpenFileTracing").on("click", function (e) {
                                    jQuery("#filFileTracing").trigger("click");
                                });
                                jQuery("#filFileTracing").off("change");
                                jQuery("#filFileTracing").on("change", function () {
                                    jQuery("#smlNameTracing").html(jQuery('#filFileTracing')[0].files[0].name);
                                });
                            });
                        };
                        this.saveTracing = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormTracing').int32(),
                                activity: jQuery('#txtActivityTracing').val(),
                                startDate: jQuery('#txtStartDateTracing').date(),
                                endDate: jQuery('#txtEndDateTracing').date(),
                                employee: { name: jQuery('#txtEmployeeNameTracing').val() },
                                stateAttention: { id: jQuery('#ddlStateAttentionTracing').int32() },
                                infraction: { id: jQuery('#hdnIdInfraction').int32() },
                                verified: jQuery('#chkVerifiedTracing').boolean(),
                                state: jQuery('#chkStateTracing').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileTracing", file: jQuery('#filFileTracing')[0].files[0] }]
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/fiscalization/savetracing', options, function () {
                                jQuery('#divPopup').dialog('close');
                                thiss.searchTracings();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#txtActivityTracing').val() === "") {
                                    success = false;
                                    message = 'Ingrese un actividad.';
                                    jQuery('#txtActivityTracing').focus();
                                } else if (jQuery('#txtStartDateTracing').val() === "") {
                                    success = false;
                                    message = 'Ingrese una fecha de inicio.';
                                    jQuery('#txtStartDateTracing').focus();
                                } else if (jQuery('#txtEndDateTracing').val() === "") {
                                    success = false;
                                    message = 'Ingrese una fecha fin.';
                                    jQuery('#txtEndDateTracing').focus();
                                } else if (jQuery('#txtSanctionTracing').val() === "") {
                                    success = false;
                                    message = 'Ingrese una sanción.';
                                    jQuery('#txtSanctionTracing').focus();
                                } else if (jQuery('#txtEmployeeNameTracing').val() === "") {
                                    success = false;
                                    message = 'Ingrese el nombre del empleado.';
                                    jQuery('#txtEmployeeNameTracing').focus();
                                } else if (jQuery('#ddlStateAttentionTracing').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el estado de atención.';
                                    jQuery('#ddlStateAttentionTracing').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailTracing = function (id) {
                            var thiss = this;
                            var options = {
                                data: { tracingId: id }
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'environment/fiscalization/detailtracing', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormTracing').val(item.id);
                                jQuery('#txtActivityTracing').val(item.activity);
                                jQuery('#txtStartDateTracing').val(item.startDate);
                                jQuery('#txtEndDateTracing').val(item.endDate);
                                jQuery('#txtEmployeeNameTracing').val(item.employee.name);
                                jQuery('#ddlStateAttentionTracing').val(item.stateAttention.id);
                                jQuery('#chkVerifiedTracing').prop("checked", item.verified);
                                jQuery('#chkStateTracing').prop("checked", item.state);
                                jQuery("#smlNameTracing").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.deleteTracings = function () {
                            var thiss = this;
                            var tracingIds = com.jtm.helper.Table.getItems("#tbdResultTracings", true, false);
                            var options = {
                                data: { infractionId: jQuery('#hdnIdInfraction').int32(), tracingIds: tracingIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (jQuery('#hdnIdInfraction').int32() === 0) {
                                    alert("Debe seleccionar una infracción");
                                    return false;
                                } else if (tracingIds.length === 0) {
                                    alert('Seleccione al menos un seguimiento.');
                                    return false;
                                }
                                else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/fiscalization/deletetracings', options, function () { thiss.searchTracings(); });
                        };
                        this.searchTracings = function () {
                            var thiss = this;
                            if (jQuery("#hdnIdInfraction").int32() === 0) return;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/fiscalization/searchtracings', {
                                data: { infractionId: jQuery("#hdnIdInfraction").int32() }
                            }, function (items) {
                                thiss.fillTracings(items, '#tblResultTracings', "#divTotalTracing");
                            });
                        };
                        this.fillTracings = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.activity + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.employee.name + '</td>';
                                html += '<td>' + item.stateAttention.name + '</td>';
                                html += '<td>' + item.verified + '</td>';
                                if (item.document === null)
                                    html += '<td></td>';
                                else
                                    html += '<td><a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + '</a></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                    }
                    Main.DIVLOCALIZATION = '#divLocalization';
                    Main.FORMLOCALIZATION = '#formLocalization';
                    Main.prototype.uiConfig = function () {
                        this.listReportType();
                        this.listFormatReportType();
                    };
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            thiss.localizationViewer = getInstance();
                            thiss.localizationViewer.setConfig(thiss.config);
                            thiss.localizationFormViewer = getInstance();
                            thiss.localizationFormViewer.setConfig(thiss.config);
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "environment/fiscalization/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);                       
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'environment/fiscalizationfolder/delete',
                                urlForm: com.jtm.Server.contextPath + "environment/fiscalizationfolder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'environment/fiscalizationfolder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "environment/fiscalizationfolder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "environment/fiscalizationfolder/formfolder",
                            });
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {                            
                            thiss.divLocalization = thiss.$form.find(Main.DIVLOCALIZATION);
                            thiss.datePicker('#txtStartDate');
                            thiss.datePicker('#txtEndDate');
                            jQuery("#btnOpenFileCredential").off("click")
                            jQuery("#btnOpenFileCredential").on("click", function (e) {
                                jQuery("#filFileCredential").trigger("click");
                            });
                            jQuery("#filFileCredential").off("change");
                            jQuery("#filFileCredential").on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    jQuery("#smlcredentialName").html(e.originalEvent.target.files[0].name);                                    
                                }                                
                            });
                            jQuery("#btnOpenFileDocument").off("click")
                            jQuery("#btnOpenFileDocument").on("click", function (e) {
                                jQuery("#filFileDocument").trigger("click");
                            });
                            jQuery("#filFileDocument").off("change");
                            jQuery("#filFileDocument").on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    jQuery("#smldocumentName").html(e.originalEvent.target.files[0].name);
                                }
                            });
                            jQuery('#btnAddLocalization').off("click");
                            jQuery('#btnAddLocalization').on("click", function (e) {
                                thiss.formLocalization(0, "Agregar Incidencia");
                            });
                            jQuery('#btnUpdateLocalization').off("click");
                            jQuery('#btnUpdateLocalization').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultLocalizations');
                                if (id > 0)
                                    thiss.formLocalization(id, "Editar Incidencia");
                                else
                                    alert('Debes seleccionar una incidencia.');
                            });
                            jQuery('#btnQuitLocalizations').off("click");
                            jQuery('#btnQuitLocalizations').on("click", function (e) {
                                thiss.deleteLocalizations();
                            });
                            jQuery('#btnAddInfraction').off("click");
                            jQuery('#btnAddInfraction').on("click", function (e) {
                                thiss.formInfraction(0, "Agregar Infracción");
                            });
                            jQuery('#btnUpdateInfraction').off("click");
                            jQuery('#btnUpdateInfraction').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultInfractions');
                                if (id > 0)
                                    thiss.formInfraction(id, "Editar Infracción");
                                else
                                    alert('Debes seleccionar una infracción.');
                            });
                            jQuery('#btnQuitInfractions').off("click");
                            jQuery('#btnQuitInfractions').on("click", function (e) {
                                thiss.deleteInfractions();
                            });
                            jQuery('#btnAddTracing').off("click");
                            jQuery('#btnAddTracing').on("click", function (e) {
                                thiss.formTracing(0, "Agregar Seguimiento");
                            });
                            jQuery('#btnUpdateTracing').off("click");
                            jQuery('#btnUpdateTracing').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultTracings');
                                if (id > 0)
                                    thiss.formTracing(id, "Editar Seguimiento");
                                else
                                    alert('Debes seleccionar un seguimiento.');
                            });
                            jQuery('#btnQuitTracings').off("click");
                            jQuery('#btnQuitTracings').on("click", function (e) {
                                thiss.deleteTracings();
                            });
                            thiss.localizationViewer.load(thiss.divLocalization, {});
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
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
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txtEndDate').val(item.endDate);
                            jQuery('#txtStartDate').val(item.startDate);
                            jQuery('#ddlInformationSource').val(item.informationSource.id);
                            jQuery('#ddlFiscalizationType').val(item.fiscalizationType.id);
                            jQuery('#ddlMiningProject').val(item.miningProject.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtAuditor').val(item.auditor);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.searchLocalizations();
                            //thiss.attachment.search(item.id);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "fiscalizationType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "miningProject.name",
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
                            field: "informationSource.name",
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
                            description: jQuery('#txtDescriptionSearch').val(),
                            informationSource: { id: jQuery('#ddlInformationSourceSearch').int32() },
                            miningProject: { id: jQuery('#ddlMiningProjectSearch').int32() },
                            fiscalizationType: { id: jQuery('#ddlFiscalizationTypeSearch').int32() },
                            startDate: jQuery('#txtStartSearch').date(),
                            endDate: jQuery('#txtEndSearch').date(),
                            auditor: jQuery('#txtAuditorSearch').val(),
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
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            description: jQuery('#txaDescription').val(),
                            informationSource: { id: jQuery("#ddlInformationSource").int32() },
                            fiscalizationType: { id: jQuery("#ddlFiscalizationType").int32() },
                            miningProject: { id: jQuery("#ddlMiningProject").int32() },
                            startDate: jQuery("#txtStartDate").date(),
                            endDate: jQuery("#txtEndDate").date(),
                            auditor: jQuery("#txtAuditor").val(),
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txaDescription').string() === '') {
                                success = false;
                                message = 'Ingrese la descripción.';
                                jQuery('#txaDescription').focus();
                            } else if (jQuery('#txtStartDate').string() === '') {
                                success = false;
                                message = 'Ingrese la Fecha de Inicio.';
                                jQuery('#txtStartDate').focus();
                            } else if (jQuery('#txtStartDate').date() > jQuery('#txtEndDate').date()) {
                                success = false;
                                message = 'La Fecha de Inicio no puede ser mayor que la fecha fin.';
                                jQuery('#txtStartDate').focus();
                            } else if (jQuery('#ddlInformationSource').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Fuente de Información.';
                                jQuery('#ddlInformationSource').focus();
                            } else if (jQuery('#ddlFiscalizationType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo Fiscalization.';
                                jQuery('#ddlFiscalizationType').focus();
                            } else if (jQuery('#ddlMiningProject').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Proyecto.';
                                jQuery('#ddlMiningProject').focus();
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
                fiscalization.Main = Main;
            })(environment.fiscalization || (environment.fiscalization = {}));
            var fiscalization = environment.fiscalization;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.fiscalization.Main.execute();