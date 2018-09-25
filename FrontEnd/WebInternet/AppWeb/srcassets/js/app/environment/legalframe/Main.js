(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (legalframe) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$ddlLegalFrameType = null;
                        this.$ddlMiningUnitSearch = null;
                        this.$ddlMiningProjectSearch = null;
                        this.$ddlMiningUnit = null;
                        this.$ddlMiningProject = null;
                        this.$divCoordinatesPoint = null;
                        this.prefix = "mon";
                        this.searchHolders = function (id) {
                            var thiss = this;
                            if (id !== 0) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningunit/miningunit/searchholders',
                                { data: { id: id } },
                                function (items) {
                                    var holders = "";
                                    if (items !== null && items.length > 0) {                                        
                                        items.forEach(function (item) {
                                            holders += item.name + ", ";
                                        });
                                    }
                                    jQuery("#txtHolders").val(holders.substring(0, holders.length - 2));
                                });
                            }
                        };
                        this.dropDownListLegalFrameType = function () {
                            var thiss = this;
                            var options = {
                                url: com.jtm.Server.contextPath + 'environment/legalframetype/list',
                                data: {},
                                validate: function () { return true; }
                            };
                            thiss.ajax(options, function (data) {
                                fillDropDownList(data.items);
                            });
                            function fillDropDownList(items) {
                                if (items.length === 0) return;
                                var html = "";                                
                                items.forEach(function (item) {
                                    html += '<option value="' + item.id + '" data-geometrytype="' + item.geometryType + '">' + item.name + '</option>';
                                });
                                thiss.$ddlLegalFrameType.html(html);
                            }
                        };
                        this.searchMiningProjects = function (ddlMiningUnit, ddlMiningProject) {
                            var thiss = this;
                            ddlMiningUnit.off('change');
                            ddlMiningUnit.on('change', function (e) {                                
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + 'miningproject/miningproject/searchbyminingunit',
                                    ddl: ddlMiningProject,
                                    data: {
                                        miningUnitId: $(this).int32(),
                                    }
                                });
                                thiss.searchHolders($(this).int32());
                            });
                        };
                    }
                    Main.DDLMININGUNITSEARCH = '#ddlMiningUnitSearch';
                    Main.DDLMININGPROJECTSEARCH = '#ddlMiningProjectSearch';
                    Main.DDLMININGUNIT = '#ddlMiningUnit';
                    Main.DDLMININGPROJECT = '#ddlMiningProject';
                    Main.DDLLEGALFRAMETYPE = '#ddlLegalFrameType';
                    Main.DIVCOORDINATEPOINT = '#divCoordinatesPoint';
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        options.spatialJSFile = thiss.js.path + "environment/legalframe/" + this.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "general/baseprocedure.js");
                            jQuery.getScript(thiss.js.path + "environment/legalframe/procedure.js", function (data, textStatus, jqxhr) {
                                thiss.procedure = getInstance();
                                thiss.procedure.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "", { module: "environment", subModule: 'legalframe' });
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnProcedure').off("click");
                        jQuery('#btnProcedure').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0) {
                                thiss.procedure.load(thiss.$form, { id: id });
                            }
                            else
                                alert("Por favor seleccione un elemento");
                        });
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtApprobationDateStartSearch');
                        thiss.datePicker('#txtApprobationDateEndSearch');
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                        thiss.$ddlMiningUnitSearch = thiss.$main.find(Main.DDLMININGUNITSEARCH);
                        thiss.$ddlMiningProjectSearch = thiss.$main.find(Main.DDLMININGPROJECTSEARCH);
                        thiss.searchMiningProjects(thiss.$ddlMiningUnitSearch, thiss.$ddlMiningProjectSearch);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "environment/legalframe/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "environment/legalframe/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.$ddlLegalFrameType = thiss.$form.find(Main.DDLLEGALFRAMETYPE);
                            thiss.$divCoordinatesPoint = thiss.$form.find(Main.DIVCOORDINATEPOINT);
                            thiss.$ddlMiningUnit = thiss.$form.find(Main.DDLMININGUNIT);
                            thiss.$ddlMiningProject = thiss.$form.find(Main.DDLMININGPROJECT);
                            thiss.formViewer.setCustomDoms([{ key: 'ddlLegalFrameType', value: thiss.$ddlLegalFrameType }]);
                            thiss.datePicker('#txtStartDate');
                            thiss.datePicker('#txtApprobationDate');
                            thiss.datePicker('#txtEndDate');
                            thiss.dropDownListLegalFrameType();
                            thiss.searchMiningProjects(thiss.$ddlMiningUnit, thiss.$ddlMiningProject);                            
                            thiss.$ddlLegalFrameType.off("change");
                            thiss.$ddlLegalFrameType.on("change", function (e) {
                                thiss.formViewer.buildCoordinates();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txtApprobationDate').val(item.approbationDate);
                            jQuery('#txtApprobationResolution').val(item.approbationResolution);
                            jQuery('#txtEndDate').val(item.endDate);
                            jQuery('#txtStartDate').val(item.startDate);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlInformationSource').val(item.informationSource.id);                            
                            jQuery('#ddlEmployee').val(item.employee.id === null ? 0 : item.employee.id);
                            jQuery('#ddlProvider').val(item.provider.id === null ? 0 : item.provider.id);                            
                            thiss.$ddlMiningUnit.val(item.miningProject.miningUnit.id === null ? 0 : item.miningProject.miningUnit.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.METER).toFixed(thiss.config.number.decimalLength));
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.$ddlMiningUnit.trigger('change');
                            thiss.$ddlMiningProject.val(item.miningProject.id);
                            thiss.$ddlLegalFrameType.val(item.legalFrameType.id);
                            thiss.$ddlLegalFrameType.trigger('change');                            
                            thiss.formViewer.fillCoordinates(item.coordinate || item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "environment/legalframe/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "environment/legalframe/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "environment/legalframe/searchnationalcartographies", item.id, null);
                        });
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            code: jQuery('#txtCode').val(),
                            name: jQuery("#txtName").val(),
                            description: jQuery('#txaDescription').val(),
                            observation: jQuery('#txaObservation').val(),
                            miningProject: { id: thiss.$ddlMiningProject.int32() },
                            legalFrameType: { id: thiss.$ddlLegalFrameType.int32() },
                            informationSource: { id: jQuery("#ddlInformationSource").int32() },
                            employee: { id: jQuery("#ddlEmployee").int32() },
                            provider: { id: jQuery("#ddlProvider").int32() },
                            startDate: jQuery("#txtStartDate").date(),
                            endDate: jQuery("#txtEndDate").date(),
                            approbationResolution: jQuery("#txtApprobationResolution").val(),
                            approbationDate: jQuery("#txtApprobationDate").date(),
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            coordinate: { x: thiss.formViewer.$txtX.number(), y: thiss.formViewer.$txtY.number() },
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
                                //} else if (jQuery('#txtStartDate').date() > jQuery('#txtEndDate').date()) {
                                //    success = false;
                                //    message = 'La Fecha de Inicio no puede ser mayor para que la fecha fin.';
                                //    jQuery('#txtStartDate').focus();
                            } else if (jQuery('#ddlInformationSource').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Fuente de Información.';
                                jQuery('#ddlInformationSource').focus();
                            } else if (thiss.$ddlLegalFrameType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo legalframe.';
                                thiss.$ddlLegalFrameType.focus();
                                //} else if (jQuery('#ddlEmployee').int32() === 0) {
                                //    success = false;
                                //    message = 'Seleccione el Especialista.';
                                //    jQuery('#ddlEmployee').focus();
                                //} else if (jQuery('#ddlProvider').int32() === 0) {
                                //    success = false;
                                //    message = 'Seleccione la Empresa Consultora.';
                                //    jQuery('#ddlProvider').focus();        
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
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
                            field: "miningProject.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "approbationDate",
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
                        var thiss = this;
                        return {
                            code: jQuery('#txtCodeSearch').val(),
                            name: jQuery('#txtNameSearch').val(),
                            employee: { id: jQuery('#ddlEmployeeSearch').int32() },
                            miningProject: { id: thiss.$ddlMiningProjectSearch.int32(), miningUnit: { id: thiss.$ddlMiningUnitSearch.int32() } },
                            legalframeType: { id: jQuery('#ddlLegalFrameTypeSearch').int32() },
                            approbationStartDate: jQuery('#txtApprobationDateStartSearch').date(),
                            approbationEndDate: jQuery('#txtApprobationDateEndSearch').date(),
                            district: {
                                id: jQuery('#ddlDistrictSearch').string(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').string(),
                                    department: { id: jQuery('#ddlDepartmentSearch').string() }
                                }
                            },
                            nationalCartography: { id: jQuery('#ddlNationalCartographySearch').string() },
                            hydrographicBasin: { id: jQuery('#ddlHydrographicBasinSearch').string() },
                            spatialReference: { id: jQuery('#ddlSpatialReferenceSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                legalframe.Main = Main;
            })(environment.legalframe || (environment.legalframe = {}));
            var legalframe = environment.legalframe;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.legalframe.Main.execute();