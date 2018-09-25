(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (incidence) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "inc";                        
                        this.formImpact = function (id, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '40%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/incidence/formimpact", function () {
                                jQuery('#txtCostEstimationImpact').numeric({ negative: false, decimalPlaces: 3 });
                                if (id > 0)
                                    thiss.detailImpact(id);
                                jQuery('#btnSaveImpact').off("click");
                                jQuery('#btnSaveImpact').on("click", function (e) {
                                    thiss.saveImpact();
                                });
                                jQuery("#btnOpenFileImpact").off("click")
                                jQuery("#btnOpenFileImpact").on("click", function (e) {
                                    jQuery("#filFileImpact").trigger("click");
                                });
                                jQuery("#filFileImpact").off("change");
                                jQuery("#filFileImpact").on("change", function () {
                                    jQuery("#smlNameImpact").html(jQuery('#filFileImpact')[0].files[0].name);
                                });
                            });
                        };
                        this.saveImpact = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormImpact').int32(),
                                description: jQuery('#txaDescriptionImpact').string(),
                                costEstimation: jQuery('#txtCostEstimationImpact').number(),
                                incidence: { id: thiss.$hdnId.int32() },
                                impactType: { id: jQuery('#ddlImpactTypeImpact').int32() },
                                impactLevel: { id: jQuery('#ddlImpactLevelImpact').int32() },
                                state: jQuery('#chkStateImpact').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileImpact", file: jQuery('#filFileImpact')[0].files[0] }]
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/incidence/saveimpact', options, function () {
                                thiss.searchImpacts(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txaDescriptionImpact').string() === '') {
                                    success = false;
                                    message = 'Ingrese la descripción.';
                                    jQuery('#txaDescriptionImpact').focus();
                                } else if (jQuery('#txtCostEstimationImpact').decimal() === 0) {
                                    success = false;
                                    message = 'Ingrese el costo estimado.';
                                    jQuery('#txtCostEstimationImpact').focus();
                                } else if (jQuery('#ddlImpactTypeImpact').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione tipo de impacto.';
                                    jQuery('#ddlImpactTypeImpact').focus();
                                } else if (jQuery('#ddlImpactLevelImpact').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione nivel de impacto.';
                                    jQuery('#ddlImpactLevelImpact').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteImpacts = function () {
                            var thiss = this;
                            var impactIds = com.jtm.helper.Table.getItems("#tbdResultImpacts", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), impactIds: impactIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (impactIds.length === 0) {
                                    alert('Seleccione al menos un impacto.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/incidence/deleteimpacts', options, function () {
                                thiss.searchImpacts();
                                jQuery("#tbdResultActions").empty();
                                jQuery("#tbdResultControls").empty();
                            });
                        };
                        this.searchImpacts = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/incidence/searchimpacts', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillImpacts(items, '#tblResultImpacts', "#divTotalImpact");
                            });
                        };
                        this.fillImpacts = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.impactType.name + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.impactLevel.name + '</td>';
                                html += '<td>' + item.costEstimation + '</td>';
                                if (item.document == null)
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
                                var impactId = jQuery(this).find("input:checkbox").val();
                                jQuery("#hdnIdImpact").val(impactId)
                                thiss.searchActions();
                                jQuery('#tblResultControls>tbody>tr').remove();
                            });
                        };
                        this.detailImpact = function (id) {
                            var thiss = this;
                            var options = {
                                data: { impactId: id }
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/incidence/detailimpact', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormImpact').val(item.id);
                                jQuery('#txaDescriptionImpact').val(item.description);
                                jQuery('#txtCostEstimationImpact').val(item.costEstimation);
                                jQuery('#ddlImpactTypeImpact').val(item.impactType.id);
                                jQuery('#ddlImpactLevelImpact').val(item.impactLevel.id);
                                jQuery('#chkStateImpact').prop("checked", item.state);
                                jQuery("#smlNameImpact").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.formAction = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdImpact").int32() === 0) { alert("Debe hacer doble click en un impacto"); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '40%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/incidence/formaction", function () {
                                jQuery('#btnSaveAction').off("click");
                                jQuery('#btnSaveAction').on("click", function (e) {
                                    thiss.saveAction();
                                });
                                if (id > 0)
                                    thiss.detailAction(id);
                                jQuery("#btnOpenFileAction").off("click")
                                jQuery("#btnOpenFileAction").on("click", function (e) {
                                    jQuery("#filFileAction").trigger("click");
                                });
                                jQuery("#filFileAction").off("change");
                                jQuery("#filFileAction").on("change", function () {
                                    jQuery("#smlNameAction").html(jQuery('#filFileAction')[0].files[0].name);
                                });
                            });
                        };
                        this.saveAction = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormAction').int32(),
                                description: jQuery('#txaDescriptionAction').string(),
                                actionType: { id: jQuery('#ddlActionTypeAction').int32() },
                                impact: { id: jQuery('#hdnIdImpact').int32() },
                                state: jQuery('#chkStateAction').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileAction", file: jQuery('#filFileAction')[0].files[0] }]
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/incidence/saveaction', options, function () {
                                thiss.searchActions(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txaDescriptionAction').string() === '') {
                                    success = false;
                                    message = 'Ingrese la descripción.';
                                    jQuery('#txaDescriptionAction').focus();
                                } else if (jQuery('#ddlActionTypeAction').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el tipo de acción.';
                                    jQuery('#ddlActionTypeAction').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteActions = function () {
                            var thiss = this;
                            var actionIds = com.jtm.helper.Table.getItems("#tbdResultActions", true, false);
                            var options = {
                                data: { impactId: jQuery('#hdnIdImpact').int32(), actionIds: actionIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (actionIds.length === 0) {
                                    alert('Seleccione al menos una acción.');
                                    return false;
                                } else if (jQuery('#hdnIdImpact').val() === 0) {
                                    alert("Debe seleccionar un impact");
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/incidence/deleteactions', options, function () {
                                thiss.searchActions();
                                jQuery("#tbdResultControls").empty();
                            });
                        };
                        this.searchActions = function () {
                            var thiss = this;
                            if (jQuery("#hdnIdImpact").int32() === 0) return;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/incidence/searchactions', {
                                data: { impactId: jQuery('#hdnIdImpact').int32() }
                            }, function (items) {
                                thiss.fillActions(items, '#tblResultActions', "#divTotalAction");
                            });
                        };
                        this.fillActions = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.actionType.name + '</td>';
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
                            jQuery(tbl).off("dblclick");
                            jQuery(tbl).on("dblclick", ">tbody>tr", function (e) {
                                var actionId = jQuery(this).find("input:checkbox").val();
                                jQuery("#hdnIdAction").val(actionId)
                                thiss.searchControls();
                            });
                        };
                        this.detailAction = function (id) {
                            var thiss = this;
                            var options = {
                                data: { actionId: id }
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/incidence/detailaction', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormAction').val(item.id);
                                jQuery('#txaDescriptionAction').val(item.description);
                                jQuery('#ddlActionTypeAction').val(item.actionType.id);
                                jQuery('#chkStateAction').prop("checked", item.state);
                                jQuery("#smlNameAction").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                        this.formControl = function (id, title) {
                            var thiss = this;
                            if (jQuery("#hdnIdAction").int32() === 0) { alert("Debe hacer doble click en una acción"); return; }
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "environment/incidence/formcontrol", function () {
                                thiss.datePicker('#txtStartDateControl');
                                thiss.datePicker('#txtEndDateControl');
                                jQuery('#btnSaveControl').off("click");
                                jQuery('#btnSaveControl').on("click", function (e) {
                                    thiss.saveControl();
                                });
                                if (id > 0)
                                    thiss.detailControl(id);
                                jQuery("#btnOpenFileControl").off("click")
                                jQuery("#btnOpenFileControl").on("click", function (e) {
                                    jQuery("#filFileControl").trigger("click");
                                });
                                jQuery("#filFileControl").off("change");
                                jQuery("#filFileControl").on("change", function () {
                                    jQuery("#smlNameControl").html(jQuery('#filFileControl')[0].files[0].name);
                                });
                            });
                        };
                        this.saveControl = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdFormControl').int32(),
                                activity: jQuery('#txtActivityControl').string(),
                                startDate: jQuery("#txtStartDateControl").date(),
                                endDate: jQuery("#txtEndDateControl").date(),
                                employee: { id: jQuery('#ddlEmployeeControl').int32() },
                                stateAttention: { id: jQuery('#ddlStateAttentionControl').int32() },
                                action: { id: jQuery('#hdnIdAction').int32() },
                                verified: jQuery('#chkVerifiedControl').boolean(),
                                state: jQuery('#chkStateControl').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate,
                                attachments: [{ id: "filFileControl", file: jQuery('#filFileControl')[0].files[0] }]
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/incidence/savecontrol', options, function () {
                                thiss.searchControls(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#hdnIdAction').int32() === 0) {
                                    success = false;
                                    message = 'Guarde la ficha de Acciones.';
                                } else if (jQuery('#txtActivityControl').string() === '') {
                                    success = false;
                                    message = 'Ingrese la actividad.';
                                    jQuery('#txtActivityControl').focus();
                                } else if (jQuery('#txtStartDateControl').string() === '') {
                                    success = false;
                                    message = 'Ingrese la fecha inicio.';
                                    jQuery('#txtStartDateControl').focus();
                                } else if (jQuery('#txtEndDateControl').string() === '') {
                                    success = false;
                                    message = 'Ingrese la fecha fin.';
                                    jQuery('#txtEndDateControl').focus();
                                } else if (jQuery('#ddlEmployeeControl').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el empleado.';
                                    jQuery('#ddlEmployeeControl').focus();
                                } else if (jQuery('#ddlStateAttentionControl').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el estado de atención.';
                                    jQuery('#ddlStateAttentionControl').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteControls = function () {
                            var thiss = this;
                            var controlIds = com.jtm.helper.Table.getItems("#tbdResultControls", true, false);
                            var options = {
                                data: { actionId: jQuery('#hdnIdAction').int32(), controlIds: controlIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (controlIds.length === 0) {
                                    alert('Seleccione al menos un control.');
                                    return false;
                                } else if (jQuery('#hdnIdAction').val() === 0) {
                                    alert("Debe seleccionar una accion");
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/incidence/deletecontrols', options, function () { thiss.searchControls(); });
                        };
                        this.searchControls = function () {
                            var thiss = this;
                            if (jQuery("#hdnIdAction").int32() === 0) return;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/incidence/searchcontrols', {
                                data: { actionId: jQuery('#hdnIdAction').int32() }
                            }, function (items) {
                                thiss.fillControls(items, '#tblResultControls', "#divTotalControl");
                            });
                        };
                        this.fillControls = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.activity + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.employee.name + '</td>';
                                html += '<td>' + item.stateAttention.name + '</td>';
                                html += '<td>' + ((item.verified) ? 'Verificado' : 'No verificado') + '</td>';
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
                        this.detailControl = function (id) {
                            var thiss = this;
                            var options = {
                                data: { controlId: id }
                            };
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/incidence/detailcontrol', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdFormControl').val(item.id);
                                jQuery('#txtActivityControl').val(item.activity);
                                jQuery('#txtStartDateControl').val(item.startDate);
                                jQuery('#txtEndDateControl').val(item.endDate);
                                jQuery('#ddlEmployeeControl').val(item.employee.id);
                                jQuery('#ddlStateAttentionControl').val(item.stateAttention.id);
                                jQuery('#chkVerifiedControl').prop("checked", item.verified);
                                jQuery('#chkStateControl').prop("checked", item.state);
                                jQuery("#smlNameControl").html((item.document !== null) ? item.document.name : '');
                            });
                        };
                    }                    
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtOccurrenceDateSearch');
                        thiss.datePicker('#txtOccurrenceDateEndSearch');
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.datePicker('#txtOccurrenceDate');
                            thiss.datePicker('#txtReportDate');                            
                            jQuery('#btnAddImpact').off("click");
                            jQuery('#btnAddImpact').on("click", function (e) {
                                thiss.formImpact(0, "Agregar Impacto");
                            });
                            jQuery('#btnUpdateImpact').off("click");
                            jQuery('#btnUpdateImpact').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultImpacts');
                                if (id > 0)
                                    thiss.formImpact(id, "Editar Impacto");
                                else
                                    alert('Debes seleccionar un impacto.');
                            });
                            jQuery('#btnQuitImpacts').off("click");
                            jQuery('#btnQuitImpacts').on("click", function (e) {
                                thiss.deleteImpacts();
                            });
                            jQuery('#btnAddAction').off("click");
                            jQuery('#btnAddAction').on("click", function (e) {
                                thiss.formAction(0, "Agregar Acción");
                            });
                            jQuery('#btnUpdateAction').off("click");
                            jQuery('#btnUpdateAction').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultActions');
                                if (id > 0)
                                    thiss.formAction(id, "Editar Acción");
                                else
                                    alert('Debes seleccionar una acción.');
                            });
                            jQuery('#btnQuitActions').off("click");
                            jQuery('#btnQuitActions').on("click", function (e) {
                                thiss.deleteActions();
                            });
                            jQuery('#btnAddControl').off("click");
                            jQuery('#btnAddControl').on("click", function (e) {
                                thiss.formControl(0, "Agregar Control");
                            });
                            jQuery('#btnUpdateControl').off("click");
                            jQuery('#btnUpdateControl').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultControls');
                                if (id > 0)
                                    thiss.formControl(id, "Editar Control");
                                else
                                    alert('Debes seleccionar un control.');
                            });
                            jQuery('#btnQuitControls').off("click");
                            jQuery('#btnQuitControls').on("click", function (e) {
                                thiss.deleteControls();
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
                            jQuery('#ddlIncidenceClass').val(item.incidenceClass.id);
                            jQuery('#ddlType').val('');
                            jQuery('#txtCause').val(item.cause);
                            jQuery('#txtReporter').val(item.reporter);
                            jQuery('#ddlProvider').val(item.provider.id);
                            jQuery('#ddlMiningProject').val(item.miningProject.id);
                            jQuery('#ddlArea').val(item.areaResponsability.id);
                            jQuery('#txtOccurrenceDate').val(item.occurrenceDate);
                            jQuery('#txtReportDate').val(item.reportDate);
                            jQuery('#ddlEmployeeSupervisor').val(item.employeeSupervisor.id);
                            jQuery('#ddlEmployeeOperator').val(item.employeeOperator.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            jQuery('#txtAltitude').val(item.altitude);
                            jQuery('#txtLocalization').val(item.localization);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "environment/incidence/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "environment/incidence/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "environment/incidence/searchnationalcartographies", item.id, null);
                            thiss.searchImpacts();
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
                            field: "incidenceClass.name",
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
                            field: "occurrenceDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "area.name",
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
                            incidenceClass: { id: jQuery('#ddlIncidenceClassSearch').int32() },
                            occurrenceDate: jQuery("#txtOccurrenceDateSearch").date(),
                            occurrenceDateEnd: jQuery("#txtOccurrenceDateEndSearch").date(),
                            miningProject: { id: jQuery('#ddlMiningProjectSearch').int32() },
                            areaResponsability: { id: jQuery('#ddlAreaSearch').int32() },
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
                            description: jQuery('#txaDescription').val(),
                            cause: jQuery("#txtCause").val(),
                            occurrenceDate: jQuery("#txtOccurrenceDate").date(),
                            reportDate: jQuery("#txtReportDate").date(),
                            altitude: jQuery('#txtAltitude').number(),
                            localization: jQuery('#txtLocalization').val(),
                            reporter: jQuery('#txtReporter').val(),
                            employeeSupervisorName: jQuery('#txtEmployeeSupervisorName').val(),
                            employeeOperatorName: jQuery('#txtEmployeeOperatorName').val(),
                            provider: { id: jQuery("#ddlProvider").int32() },
                            incidenceClass: { id: jQuery("#ddlIncidenceClass").int32() },
                            areaResponsability: { id: jQuery("#ddlArea").int32() },
                            miningProject: { id: jQuery("#ddlMiningProject").int32() },
                            employeeSupervisor: { id: jQuery("#ddlEmployeeSupervisor").int32() },
                            employeeOperator: { id: jQuery("#ddlEmployeeOperator").int32() },
                            spatialReference: { id: thiss.formViewer.$ddlSpatialReference.int32() },
                            coordinate: { x: thiss.formViewer.$txtX.number(), y: thiss.formViewer.$txtY.number() },
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
                            } else if (jQuery('#ddlIncidenceClass').int32() === 0) {
                                success = false;
                                message = 'Seleccione la categoría.';
                                jQuery('#ddlIncidenceClass').focus();
                            } else if (jQuery('#txtCause').string() === '') {
                                success = false;
                                message = 'Ingrese la causa.';
                                jQuery('#txtCause').focus();
                            } else if (jQuery('#txtReporter').string() === '') {
                                success = false;
                                message = 'Ingrese al reportador.';
                                jQuery('#txtReporter').focus();
                            } else if (jQuery('#ddlProvider').int32() === 0) {
                                success = false;
                                message = 'Seleccione la empresa contratista.';
                                jQuery('#ddlProvider').focus();
                            } else if (jQuery('#ddlMiningProject').int32() === 0) {
                                success = false;
                                message = 'Seleccione el proyecto minero.';
                                jQuery('#ddlMiningProject').focus();
                            } else if (jQuery('#ddlArea').int32() === 0) {
                                success = false;
                                message = 'Seleccione el área.';
                                jQuery('#ddlArea').focus();
                            } else if (jQuery('#txtOccurrenceDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha de ocurrencia.';
                                jQuery('#txtOccurrenceDate').focus();
                            } else if (jQuery('#txtReportDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha reportada.';
                                jQuery('#txtReportDate').focus();
                            } else if (jQuery('#ddlArea').int32() === 0) {
                                success = false;
                                message = 'Seleccione el área.';
                                jQuery('#ddlArea').focus();
                            } else if (jQuery('#ddlEmployeeSupervisor').int32() === 0) {
                                success = false;
                                message = 'Seleccione al supervisor responsable.';
                                jQuery('#ddlEmployeeSupervisor').focus();
                            } else if (jQuery('#ddlEmployeeOperator').int32() === 0) {
                                success = false;
                                message = 'Seleccione al operador responsable.';
                                jQuery('#ddlEmployeeOperator').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el sistema referencial.';
                                jQuery('#ddlSpatialReference').focus();
                            } else if (thiss.formViewer.$txtX.int32() === 0) {
                                success = false;
                                message = 'Ingrese el eje X.';
                                thiss.formViewer.$txtX.focus();
                            } else if (thiss.formViewer.$txtY.int32() === 0) {
                                success = false;
                                message = 'Ingrese el eje Y.';
                                thiss.formViewer.$txtY.focus();
                            } else if (jQuery('#txtAltitude').int32() === 0) {
                                success = false;
                                message = 'Ingrese la altitud.';
                                jQuery('#txtAltitude').focus();
                            } else if (jQuery('#txtLocalization').string() === '') {
                                success = false;
                                message = 'Ingrese la ubicación.';
                                jQuery('#txtLocalization').focus();
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
                incidence.Main = Main;
            })(environment.incidence || (environment.incidence = {}));
            var incidence = environment.incidence;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.incidence.Main.execute();