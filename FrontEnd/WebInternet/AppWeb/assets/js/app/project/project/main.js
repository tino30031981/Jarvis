(function (com) {
    (function (jtm) {
        (function (project) {
            (function (project) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtDateStartSearch');
                        thiss.datePicker('#txtDateStartEndSearch');
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch",
                            "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.datePicker('#txtDateStart');
                            jQuery('#txtInvestment').numeric({
                                negative: false
                            });
                            jQuery('#txtX').numeric();
                            jQuery('#txtY').numeric();
                            jQuery('#filFile').fileupload({
                                urlSave: com.jtm.Server.contextPath + "project/project/savedocument",
                                urlDetail: com.jtm.Server.contextPath + "documentlibrary/document/detail",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "project/project/searchdocuments"
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        var services = [];
                        services.push({
                            name: "Distritos",
                            url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioBase/MapServer/12"
                        },
                            {
                                name: "Area de Conservación",
                                url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioTematico/MapServer/4"
                            },
                            {
                                name: "Lotes Petroleros",
                                url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioTematico/MapServer/21"
                            },
                            {
                                name: "Catastro Minero",
                                url: "http://geocatminapp.ingemmet.gob.pe/arcgis/rest/services/SERV_CATASTRO_MINERO/MapServer/0"
                            });
                        var reportOverlapData = {
                            title: "Reporte de análisis de superposición espacial - Proyectos",
                            services: services
                        };
                        _super.prototype.detail.call(this, null, id, null,
                            function (data) {
                                var item = data.item;
                                thiss.$hdnId.val(item.id);
                                jQuery('#txtCode').val(item.code);
                                jQuery('#txtName').val(item.name);
                                jQuery('#txtDateStart').val(item.dateStart);
                                jQuery('#txtLocation').val(item.location);
                                jQuery('#txtInvestment').val(item.investment);
                                jQuery('#txtBudgetProgress').val(item.budgetProgress);
                                jQuery('#txtPhysicalProgress').val(item.physicalProgress);
                                jQuery('#txtExecutionTime').val(item.executionTime);
                                jQuery('#ddlExecutionModality').val(item.executionModality.id);
                                jQuery('#ddlExecutingUnit').val(item.executingUnit.id);
                                jQuery('#ddlStatusProject').val(item.statusProject.id);
                                jQuery('#ddlPhaseProject').val(item.phaseProject.id);
                                jQuery('#txtSupervisor').val(item.supervisor);
                                jQuery('#txtCoordinator').val(item.coordinator);
                                jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                                jQuery('#chkState').prop("checked", item.state);
                                thiss.formViewer.fillCoordinates(item.coordinate);
                                thiss.formViewer.addFeatures(data.featuresList);
                                thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "project/project/searchdistricts", item.id, null);
                                thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "project/project/searchhydrographicbasins", item.id, null);
                                thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "project/project/searchnationalcartographies", item.id, null);
                                thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "project/project/searchtowncenters", item.id, null);
                                thiss.reportOverlap2(item.id, thiss.config.module.tables, {
                                    urlView: com.jtm.Server.contextPath + "project/project/reportoverlap",
                                    urlOverlap: com.jtm.Server.contextPath + "project/project/searchoverlaps"
                                }, function (item) {
                                    jQuery('#pCode').text(item.code);
                                    jQuery('#pName').text(item.name);
                                    jQuery('#pHolderName').text(item.holderName);
                                    jQuery('#pStatusName').text(item.statusMain.name);
                                    jQuery('#pArea').text(item.area);
                                    jQuery('#pLength').text(item.length);
                                });
                            });
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery("#txtCode").string(),
                            name: jQuery("#txtName").string(),
                            dateStart: jQuery("#txtDateStart").date(),
                            location: jQuery("#txtLocation").string(),
                            budgetProgress: jQuery("#txtBudgetProgress")
                                .number(),
                            physicalProgress: jQuery("#txtPhysicalProgress")
                                .number(),
                            investment: jQuery("#txtInvestment").decimal(),
                            executionTime: jQuery('#txtExecutionTime')
                                .string(),
                            executionModality: {
                                id: jQuery('#ddlExecutionModality').int32()
                            },
                            executingUnit: {
                                id: jQuery('#ddlExecutingUnit').int32()
                            },
                            statusProject: {
                                id: jQuery('#ddlStatusProject').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            state: jQuery("#chkState").boolean(),
                            phaseProject: {
                                id: jQuery('#ddlPhaseProject').int32()
                            },
                            supervisor: jQuery("#txtSupervisor").string(),
                            coordinator: jQuery("#txtCoordinator").string(),
                            coordinate: {
                                x: jQuery("#txtX").number(),
                                y: jQuery("#txtY").number()
                            }
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#txtDateStart').date() === null) {
                                success = false;
                                message = 'Ingrese una la fecha de inicio.';
                                jQuery('#txtDateStart').focus();
                            } else if (jQuery('#txtLocation').string() === '') {
                                success = false;
                                message = 'Ingrese la localización.';
                                jQuery('#txtLocation').focus();
                            } else if (jQuery('#txtInvestment').decimal() === 0) {
                                success = false;
                                message = 'Ingrese el monto de inversión.';
                                jQuery('#txtInvestment').focus();
                            } else if (jQuery('#txtBudgetProgress').decimal() === 0) {
                                success = false;
                                message = 'Ingrese el avance presupuestal.';
                                jQuery('#txtBudgetProgress').focus();
                            } else if (jQuery('#txtPhysicalProgress').decimal() === 0) {
                                success = false;
                                message = 'Ingrese el avance físico.';
                                jQuery('#txtPhysicalProgress').focus();
                            } else if (jQuery('#txtExecutionTime').string() === '') {
                                success = false;
                                message = 'Ingrese el tiempo de ejecución.';
                                jQuery('#txtExecutionTime').focus();
                            } else if (jQuery('#ddlExecutionModality').int32() === 0) {
                                success = false;
                                message = 'Ingrese la modalidad de ejecución.';
                                jQuery('#ddlExecutionModality').focus();
                            } else if (jQuery('#ddlExecutingUnit').int32() === 0) {
                                success = false;
                                message = 'Seleccione la unidad ejecutante.';
                                jQuery('#ddlExecutingUnit').focus();
                            } else if (jQuery('#ddlStatusMain').int32() === 0) {
                                success = false;
                                message = 'Seleccione el estado del proyecto.';
                                jQuery('#ddlStatusMain').focus();
                            } else if (jQuery('#ddlPhaseProject').int32() === 0) {
                                success = false;
                                message = 'Seleccione la etapa del proyecto.';
                                jQuery('#ddlPhaseProject').focus();
                            } else if (jQuery('#txtSupervisor').string() === '') {
                                success = false;
                                message = 'Ingrese al supervisor.';
                                jQuery('#txtSupervisor').focus();
                            } else if (jQuery('#txtCoordinator').string() === '') {
                                success = false;
                                message = 'Ingrese al Residente/Coordinador.';
                                jQuery('#txtCoordinator').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el sistema referencial.';
                                jQuery('#ddlSpatialReference').focus();
                            } else if (jQuery('#txtX').number() === 0) {
                                success = false;
                                message = 'Ingrese la coordenada este (X).';
                                jQuery('#txtX').focus();
                            } else if (jQuery('#txtY').number() === 0) {
                                success = false;
                                message = 'Ingrese la coordenada norte (Y).';
                                jQuery('#txtY').focus();
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
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: "dateStart",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "location",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "budgetProgress",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "physicalProgress",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "investment",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "executionTime",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "executionModality.name",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "executingUnit.name",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: "statusMain.name",
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options,
                            callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            state: jQuery('#chkStateSearch').boolean(),
                            executionModality: {
                                id: jQuery('#ddlExecutionModalitySearch')
                                    .int32()
                            },
                            executingUnit: {
                                id: jQuery('#ddlExecutingUnitSearch').int32()
                            },
                            statusProject: {
                                id: jQuery('#ddlStatusProjectSearch').int32()
                            },
                            district: {
                                id: jQuery('#ddlDistrictSearch').int32(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').int32(),
                                    department: {
                                        id: jQuery('#ddlDepartmentSearch')
                                            .int32()
                                    }
                                }
                            }
                        };
                    };
                    Main.prototype.load = function () {
                        var thiss = this;
                        _super.prototype.load.call(this, "project", "project");
                    };
                    Main.execute = function () {
                        return new Main().load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                project.Main = Main;
            })(project.project || (project.project = {}));
            var project = project.project;
        })(jtm.project || (jtm.project = {}));
        var project = jtm.project;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.project.project.Main.execute();