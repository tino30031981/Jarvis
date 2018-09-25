(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mp";
                        this.tracing = null;
                        this.procedure = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;
                    }
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            /*jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "general/baseprocedure.js");
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/procedure.js", function (data, textStatus, jqxhr) {
                                thiss.procedure = getInstance();
                                thiss.procedure.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });*/
                            /*jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });*/
                            jQuery.ajaxSetup({ async: true });
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/folder.js", function (data, textStatus, jqxhr) {
                                thiss.folder = getInstance();
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.folderConfig = function () {
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);                       
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.folder.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        /*options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "miningproject/miningproject/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "miningproject/miningproject/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.datePicker('#txtTitleDate');
                            thiss.datePicker('#txtFormulationDate');
                            thiss.datePicker('#txtTitleRegistrationDate');
                            thiss.datePicker('#txtCoordinateRegistrationDate');
                            thiss.datePicker('#txtDateOrigin');
                            thiss.$tblResultAlerts = thiss.$form.find('#tblResultAlerts');
                            thiss.$divTotalAlert = thiss.$form.find('#divTotalAlert');
                            thiss.$divProcedureDocuments = thiss.$form.find('#divProcedureDocuments');
                            thiss.$ulDocumentProcedure = thiss.$divProcedureDocuments.find('#ulDocumentProcedure');
                            thiss.$divRequirementDocuments = thiss.$divProcedureDocuments.find('>.panel-body>.panel-default');
                            thiss.$btnShowHide = thiss.$divProcedureDocuments.find('#btnShowHide');
                            thiss.$divRequirementDocuments.hide();
                            jQuery('#btnAddMiningConcession').off("click");
                            jQuery('#btnAddMiningConcession').on("click", function (e) {
                                thiss.formMiningConcession();
                            });
                            jQuery('#btnQuitMiningConcession').off("click");
                            jQuery('#btnQuitMiningConcession').on("click", function (e) {
                                thiss.deleteMiningConcessions();
                            });
                            jQuery('#btnAddDrilling').off();
                            jQuery('#btnAddDrilling').on("click", function (e) {
                                thiss.formDrilling(0, "Agregar Perforación");
                            });
                            jQuery('#btnEditDrilling').off("click");
                            jQuery('#btnEditDrilling').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultDrillings');
                                if (id > 0) {
                                    thiss.formDrilling(id, "Modificar Perforación");
                                }
                                else
                                    alert('Seleccione una perforación.');
                            });
                            jQuery('#btnQuitDrilling').off("click");
                            jQuery('#btnQuitDrilling').on("click", function (e) {
                                thiss.deleteDrillings();
                            });
                            jQuery('#btnAddReserve').off("click");
                            jQuery('#btnAddReserve').on("click", function (e) {
                                thiss.formReserve(0, "Agregar Reserva");
                            });
                            jQuery('#btnEditReserve').off("click");
                            jQuery('#btnEditReserve').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultReserves');
                                if (id > 0) {
                                    thiss.formReserve(id, "Modificar Reserva");
                                }
                                else
                                    alert('Seleccione una Reserva.');
                            });
                            jQuery('#btnQuitReserve').off("click");
                            jQuery('#btnQuitReserve').on("click", function (e) {
                                thiss.deleteReserves();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);*/
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        /*_super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtGeology').val(item.geology);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlStageOperation').val(item.stageOperation.id);
                            jQuery('#ddlExploitationMethod').val(item.exploitationMethod.id === null ? 0 : item.exploitationMethod.id);
                            jQuery('#ddlDepositOrigin').val(item.depositOrigin.id === null ? 0 : item.depositOrigin.id);
                            jQuery('#ddlCategory').val(item.category.id);
                            jQuery('#ddlDepositType').val(item.depositType.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "miningproject/miningproject/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "miningproject/miningproject/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "miningproject/miningproject/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "miningproject/miningproject/searchtowncenters", item.id, null);
                            thiss.searchMiningConcessions();
                            thiss.searchDrillings();
                            thiss.searchReserves();
                            thiss.searchAlerts();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                        });*/
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        url = com.jtm.Server.contextPath + "miningproject/miningproject/search";
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
                            field: "geology",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "stageOperation.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "depositType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "depositOrigin.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "miningConcessionLength",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            stageOperation: { id: 0 },
                            category: { id: 0 },
                            depositType: { id: 0 },
                            miningUnit: { id: 0 },
                            district: {
                                id: "0",
                                province: {
                                    id: "0",
                                    department: {
                                        id: "0"
                                    }
                                }
                            },
                            nationalCartography: {
                                id: "0"
                            },
                            hydrographicBasin: {
                                id: "0"
                            },
                            spatialReference: {
                                id: 0
                            },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        /*options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            observation: jQuery('#txaObservation').string(),
                            geology: jQuery('#txtGeology').string(),
                            stageOperation: { id: jQuery('#ddlStageOperation').int32() },
                            exploitationMethod: { id: jQuery('#ddlExploitationMethod').int32() },
                            depositOrigin: { id: jQuery('#ddlDepositOrigin').int32() },
                            category: { id: jQuery('#ddlCategory').int32() },
                            depositType: { id: jQuery('#ddlDepositType').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnit').int32() },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el Código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#ddlStageOperation').int32() === 0) {
                                success = false;
                                message = 'Seleccione la etapa de Operación.';
                                jQuery('#ddlStageOperation').focus();
                            } else if (jQuery('#ddlExploitationMethod').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Método de Exploración.';
                                jQuery('#ddlExploitationMethod').focus();
                            } else if (jQuery('#ddlDepositOrigin').int32() === 0) {
                                success = false;
                                message = 'Seleccione Origen de Yacimiento.';
                                jQuery('#ddlDepositOrigin').focus();
                            } else if (jQuery('#ddlCategory').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Categoría.';
                                jQuery('#ddlCategory').focus();
                            } else if (jQuery('#ddlDepositType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo de Yacimiento.';
                                jQuery('#ddlDepositType').focus();
                            } else if (jQuery('#ddlMiningUnit').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Unidad Minera.';
                                jQuery('#ddlMiningUnit').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Sistema Referencial.';
                                jQuery('#ddlSpatialReference2').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }*/
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                miningproject.Main = Main;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningproject.miningproject.Main.execute();