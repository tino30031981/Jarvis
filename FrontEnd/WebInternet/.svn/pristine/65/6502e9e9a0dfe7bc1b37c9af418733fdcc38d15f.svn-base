(function (com) {
    (function (jtm) {
        (function (uea) {
            (function (uea) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "uea";
                        this.tracing = null;
                        this.procedure = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;
                        this.searchMiningConcessions = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'uea/uea/searchminingconcessions', {
                                data: { id: this.$hdnId.int32() }
                            }, function (item, items) {
                                jQuery('#txtCodeMiningConcession>p').html((item.code === null || item.code === '' || item.code === undefined) ? '' : item.code);
                                jQuery('#txtNameMiningConcession>p').html((item.name === null || item.name === '' || item.name === undefined) ? '' : item.name);
                                jQuery('#txtTitleDateMiningConcession>p').html((item.title === undefined || item.title === '' || item.title === null) ? "" : item.title.date);
                                jQuery('#txtMineralMiningConcession>p').html(item.mineralType === undefined ? '' : item.mineralType.name);
                                jQuery('#spnMineralType').html(item.mineralType === undefined ? '' : item.mineralType.name);
                                jQuery('#spnMineral').html(item.mineral === undefined ? '' : item.mineral.name);
                                thiss.fillMiningConcessions(items, '#tblResultMiningConcessions', "#divTotalMiningConcession");
                            });
                        };
                        this.fillMiningConcessions = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + (item.title === null || item.title.date === null ? "" : item.title.date) + '</td>';
                                html += '<td>' + item.netArea + '</td>';
                                html += '<td>' + (item.title === null ? "" : item.title.area) + '</td>';
                                html += '<td>' + (item.ueaInclusion.date === null ? '' : item.ueaInclusion.date) + '</td>';
                                html += '<td>' + (item.ueaInclusion.resolution === null ? '' : item.ueaInclusion.resolution) + '</td>';
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
                        this.saveMiningConcessions = function () {
                            var thiss = this;
                            var itemsMiningConcession = [];
                            jQuery('#tbdResultMiningConcessions2 input:checkbox:checked').each(function () {
                                itemsMiningConcession.push({
                                    id: jQuery(this).val(),
                                    ueaInclusion: {
                                        date: jQuery('#txtDateInclusion').date(),
                                        resolution: jQuery('#txtResolution').string()
                                    }
                                });
                            });
                            var item = { id: thiss.$hdnId.int32(), miningConcessions: itemsMiningConcession };
                            function validate() {
                                var success = true;
                                var message = '';
                                if (itemsMiningConcession.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                } else if (jQuery('#txtDateInclusion').string() === '') {
                                    success = false;
                                    message = 'Ingresa una fecha.';
                                } else if (jQuery('#txtResolution').string() === '') {
                                    success = false;
                                    message = 'Ingresa un Número de Resolución.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'uea/uea/saveminingconcessions', options, function () {
                                thiss.searchMiningConcessions(); jQuery('#divPopup').dialog('close');
                            });
                        };
                        this.deleteMiningConcessions = function () {
                            var thiss = this;
                            var miningConcessionIds = com.jtm.helper.Table.getItems("#tbdResultMiningConcessions", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningConcessionIds: miningConcessionIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (miningConcessionIds.length === 0) {
                                    alert('Seleccione al menos Concessión Minera.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'uea/uea/deleteminingconcessions', options, function () { thiss.searchMiningConcessions(); });
                        };
                        this.formMiningConcession = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar Integrantes",
                                width: '800',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "miningconcession/miningconcession/formassignuea", function () {
                                thiss.datePicker('#txtDateInclusion');
                                jQuery('#btnSearchMiningConcessions').off("click");
                                jQuery('#btnSearchMiningConcessions').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveMiningConcessions').off("click");
                                jQuery('#btnSaveMiningConcessions').on("click", function (e) {
                                    thiss.saveMiningConcessions();
                                });
                            });
                            function search() {
                                jQuery('#tbdResultMiningConcession2').empty();
                                var item = {
                                    code: jQuery('#txtCodeSearchMiningConcession').val(),
                                    name: jQuery('#txtNameSearchMiningConcession').val(),
                                    holder: { id: jQuery('#ddlHolderSearchMiningConcession').int32() },
                                    mineralType: { id: jQuery('#ddlMineralTypeSearchMiningConcession').int32() },
                                    uea: { id: thiss.$hdnId.int32() }
                                };
                                var itemsExist = com.jtm.helper.Table.getItems("#tbdResultMiningConcessions", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchforuea', { data: item }, function (items) {
                                    thiss.fillMiningConcessions(items, '#tblResultMiningConcessions2', "#divTotalMiningConcession2", itemsExist);
                                });
                            }
                        };
                        this.searchAlerts = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'uea/uea/searchalerts', options, function (items) {
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
                        };
                        this.buildUrlIngemmet = function (options) {
                            options = options || {};
                            options.type = options.type || "GET_DETALLE";
                            options.option = options.option || 1;
                            return {
                                p_p_id: "igmbusquedaderechos_WAR_igmsidemcatportlet",
                                p_p_lifecycle: "2",
                                p_p_state: "normal",
                                p_p_mode: "view",
                                p_p_resource_id: options.resource,
                                p_p_cacheability: "cacheLevelPage",
                                p_p_col_id: "column-all",
                                p_p_col_pos: "3",
                                p_p_col_count: "4",
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_codigo: options.code,
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_tipo: options.type,/*GET_DETALLE,GET_DETALLE_CUADERNO,1,2,3*/
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_tipoDoc: "1",
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_opcion: options.option,/*1,2,3,4*/
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_texto: "",
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_departamento: '',
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_provincia: null,
                                _igmbusquedaderechos_WAR_igmsidemcatportlet_distrito: null
                            };
                        };
                        this.searchResolutionsOfficial = function (options, tbl) {
                            var thiss = this;
                            tbl = tbl || '#tblResultResolutions';
                            var $tbl = $(tbl);
                            if ($tbl.find("tbody").length === 0)
                                $tbl.append("<tbody></tbody>");
                            $tbl.find(">tbody").empty();
                            options.isJson = false;
                            options.data = (options.inline === true) ? thiss.buildUrlIngemmet({ resource: "grid_resoluciones_dm", code: options.code }) : { code: options.code };
                            var url = (options.inline === true) ? thiss.config.module.ingemmet.urls.sidemcat : com.jtm.Server.contextPath + "uea/uea/searchResolution";
                            thiss.searchConfig(url, options, function (data) {
                                fill(data, options.inline);
                            });
                            function fill(items, inline) {
                                $tbd = $tbl.find(">tbody");
                                var html = "";
                                var i = 0;
                                items.forEach(function (item) {
                                    html = '<tr data-uniqueid="' + (++i) + '">';
                                    html += '<td>' + ((inline === true) ? item.nroresolucion || '' : item.resolutionNumber || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fresolucion) || '' : item.resolutionDate || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? item.re_desres || '' : item.description || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? item.plazos || '' : item.timeLimit || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fnotificacion) || '' : item.notificationDate || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? item.nronotificacion || '' : item.notificationNumber || '') + '</td>';
                                    html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fpublicacion) || '' : item.publicationDate || '') + '</td>';
                                    html += '</tr>';
                                    $tbd.append(html);
                                });
                            }
                        };
                        this.reverseDate = function (date) {
                            return (date == null) ? '' : date.split("/").reverse().join("-");
                        };
                        this.searchNotebooksOfficial = function (id) {
                            var thiss = this;
                            var tbl = '#tblResultNotebooks';
                            var $tbl = $(tbl);
                            if ($tbl.find("tbody").length === 0)
                                $tbl.append("<tbody></tbody>");
                            $tbl.find(">tbody").empty();
                            var options = {};
                            options.isJson = false;
                            options.data = thiss.buildUrlIngemmet({ resource: "grid_cuadernos", code: id });
                            var url = thiss.config.module.ingemmet.urls.sidemcat;
                            thiss.searchConfig(url, options, function (data) {
                                if (data.length > 0) {
                                    data.forEach(function (item) {
                                        var options = {};
                                        options.isJson = false;
                                        options.data = thiss.buildUrlIngemmet({ type: 'GET_DETALLE_CUADERNO', resource: "crud", code: item.cg_codigo });
                                        var url = thiss.config.module.ingemmet.urls.sidemcat;
                                        thiss.searchConfig(url, options, function (data2) {
                                            item.main = data2.detalle;
                                            item.detalle = data2.detalle_cuaderno;
                                        });
                                    });
                                    fill(data);
                                }
                                else {
                                    thiss.tableEmpty(tbl, "No se ha encontrado cuadernos");
                                }
                            });
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtFormulationDateSearch');
                        thiss.datePicker('#txtFormulationDateEndSearch');
                        thiss.datePicker('#txtApprobationDateSearch');
                        thiss.datePicker('#txtApprobationDateEndSearch');
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "uea/uea/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnProcedure').off("click");
                        jQuery('#btnProcedure').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.procedure.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'uea/folder/delete',
                                urlForm: com.jtm.Server.contextPath + "uea/folder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'uea/folder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "uea/folder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "uea/folder/formfolder",
                            });
                        });
                        jQuery('#btnResolution').off("click");
                        jQuery('#btnResolution').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var form = com.jtm.Server.contextPath + "miningconcession/miningconcession/formresolutionofficial";
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code == 0)
                                alert("Por favor seleccione un elemento");
                            else {
                                thiss.loadView(form, url, function () {
                                    thiss.$main.hide();
                                    form.show();
                                    thiss.buildClose();
                                    thiss.$hdnId = thiss.$form.find(BaseMain.HDNID);
                                    thiss.$hdnId.val(id);
                                    jQuery('#chkInlineResolution').off("change");
                                    jQuery('#chkInlineResolution').on("change", function (e) {
                                        var inline = $(this).is(":checked");
                                        options.inline = inline;
                                        if (inline === true) {
                                            thiss.searchResolutionsOfficial(options);
                                            thiss.searchNotebooksOfficial(options);
                                        }
                                        else
                                            thiss.searchResolutionsOfficial(options);
                                    });
                                    jQuery('#chkInlineResolution').trigger("change");
                                });
                            }
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.datePicker('#txtFormulationDate');
                            thiss.datePicker('#txtApprobationDate');
                            thiss.datePicker('#txtExtinctionDate');
                            jQuery('#txtX').numeric({ negative: false });
                            jQuery('#txtY').numeric({ negative: false });
                            jQuery('#txtRadio').numeric({ negative: false });
                            thiss.$tblResultAlerts = thiss.$form.find('#tblResultAlerts');
                            thiss.$divTotalAlert = thiss.$form.find('#divTotalAlert');                            
                            jQuery('#btnAddMiningConcessions').off("click");
                            jQuery('#btnAddMiningConcessions').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formMiningConcession();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitMiningConcessions').off("click");
                            jQuery('#btnQuitMiningConcessions').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteMiningConcessions();
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
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txtFormulationDate').val(item.formulationDate);
                            jQuery('#txtApprobationDate').val(item.approbationDate);
                            jQuery('#txtApprobationResolution').val(item.approbationResolution);
                            jQuery('#txtExtinctionDate').val(item.extinctionDate);
                            jQuery('#txtExtinctionResolution').val(item.extinctionResolution);
                            jQuery('#txtDecisionMining').val(item.decisionMining);
                            jQuery('#ddlSituation').val(item.situation.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtPresentationCode').val(item.presentationCode);
                            jQuery('#txtRadio').val((item.radio / Main.KILOMETER).toFixed(0));
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList, false);                            
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "uea/uea/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "uea/uea/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "uea/uea/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "uea/uea/searchtowncenters", item.id, null);
                            thiss.searchMiningConcessions();
                            thiss.searchAlerts();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
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
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "approbationResolution",
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
                        },{
                            field: "approbationDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        },  {
                            field: "miningConcessionLength",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
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
                            formulationDate: jQuery('#txtFormulationDateSearch').date(),
                            formulationDateEnd: jQuery('#txtFormulationDateEndSearch').date(),
                            approbationDate: jQuery('#txtApprobationDateSearch').date(),
                            approbationDateEnd: jQuery('#txtApprobationDateEndSearch').date(),
                            situation: {
                                id: jQuery('#ddlSituationSearch').int32()
                            },
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
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            observation: jQuery('#txaObservation').string(),
                            formulationDate: jQuery('#txtFormulationDate').date(),
                            approbationDate: jQuery('#txtApprobationDate').date(),
                            approbationResolution: jQuery('#txtApprobationResolution').string(),
                            extinctionDate: jQuery('#txtExtinctionDate').date(),
                            extinctionResolution: jQuery('#txtExtinctionResolution').string(),
                            decisionMining: jQuery('#txtDecisionMining').string(),
                            situation: {
                                id: jQuery('#ddlSituation').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            coordinate: { x: jQuery('#txtX').number(), y: jQuery('#txtY').number() },
                            radio: jQuery('#txtRadio').number() * Main.KILOMETER,
                            presentationCode: jQuery('#txtPresentationCode').string(),
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            }
                            else if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el Codigo.';
                                jQuery('#txtCode').focus();
                            }
                            else if (jQuery('#ddlSituation').int32() === 0) {
                                success = false;
                                message = 'Seleccione la situación.';
                                jQuery('#ddlSituation').focus();
                            }
                            else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Ingrese la Referencia Espacial.';
                                jQuery('#ddlSpatialReference').focus();
                            }
                            else if (jQuery('#txtFormulationDate').string() === '') {
                                success = false;
                                message = 'Ingrese el dia de Formulacion';
                                jQuery('#txtFormulationDate').focus();
                            }
                            else if (jQuery('#txtApprobationDate').string() === '') {
                                success = false;
                                message = 'Ingrese el dia de Aprobacion.';
                                jQuery('#txtApprobationDate').focus();
                            } else if (jQuery('#txtX').int32() === 0) {
                                success = false;
                                message = 'Ingrese el eje X.';
                                jQuery('#txtX').focus();
                            } else if (jQuery('#txtY').int32() === 0) {
                                success = false;
                                message = 'Ingrese el eje Y.';
                                jQuery('#txtY').focus();
                            } else if (jQuery('#txtRadio').int32() === 0) {
                                success = false;
                                message = 'Ingrese el radio.';
                                jQuery('#txtRadio').focus();
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
                uea.Main = Main;
            })(uea.uea || (uea.uea = {}));
            var uea = uea.uea;
        })(jtm.uea || (jtm.uea = {}));
        var uea = jtm.uea;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.uea.uea.Main.execute();