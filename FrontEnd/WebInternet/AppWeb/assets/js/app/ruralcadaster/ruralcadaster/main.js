(function (com) {
    (function (jtm) {
        (function (ruralcadaster) {
            (function (ruralcadaster) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "rc";
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch",
                            "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/savecoordinatesmultiple";
                        options.callback = function () {
                            // thiss.datePicker('#txtDateStart');
                            jQuery('#txtArea').numeric({
                                negative: false
                            });
                            jQuery('#txtLength').numeric();
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
                            title: "Reporte de análisis de superposición espacial - Catastro Rural",
                            services: services
                        };
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtCadasterCode').val(item.cadasterCode);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtHolderName').val(item.holderName);
                            jQuery('#ddlLegalStatus').val(item.legalStatus.id);
                            jQuery('#ddlStatus').val(item.status.id);
                            jQuery('#ddlGeoReferenceType').val(item.geoReferenceType.id);
                            jQuery('#ddlInformationSource').val(item.informationSource.id);
                            jQuery('#txtSector').val(item.sector);
                            jQuery('#txtReference').val(item.reference);
                            jQuery('#ddlGpsType').val(item.gpsType.id);
                            jQuery('#txtAltitude').val(item.altitude);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#ddlRegistryOffice').val(item.registryOffice.id);
                            jQuery('#txtAreaTitle').val(item.areaTitle);
                            jQuery('#txtLengthTitle').val(item.lengthTitle);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalCount));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalCount));
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "ruralcadaster/ruralcadaster/searchtowncenters", item.id, null);
                            //											thiss.reportOverlap2(item.id,thiss.config.module.tables,{urlView : com.jtm.Server.contextPath+ "ruralcadaster/ruralcadaster/reportoverlap",
                            //																urlOverlap : com.jtm.Server.contextPath+ "ruralcadaster/ruralcadaster/searchoverlaps"
                            //															},function(item) {
                            //																jQuery('#pCode').text(item.code);
                            //																jQuery('#pName').text(item.name);
                            //																jQuery('#pHolderName').text(item.holderName);
                            //																jQuery('#pStatusName').text(item.status.name);
                            //																jQuery('#pArea').text(item.area);
                            //																jQuery('#pLength').text(item.length);
                            //															});
                        });
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery("#txtCode").string(),
                            name: jQuery("#txtName").string(),
                            cadasterCode: jQuery("#txtCadasterCode").string(),
                            description: jQuery("#txaDescription").string(),
                            observation: jQuery("#txaObservation").string(),
                            valley: "",
                            hamlet: "",
                            sector: jQuery("#txtSector").string(),
                            histories: "",
                            holderName: jQuery("#txtHolderName").string(),
                            state: jQuery("#chkState").boolean(),
                            geoReferenceType: {
                                id: jQuery('#ddlGeoReferenceType').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            registryOffice: {
                                id: jQuery('#ddlRegistryOffice').int32()
                            },
                            status: {
                                id: jQuery('#ddlStatus').int32()
                            },
                            informationSource: {
                                id: jQuery('#ddlInformationSource').int32()
                            },
                            legalStatus: {
                                id: jQuery('#ddlLegalStatus').int32()
                            },
                            areaTitle: jQuery("#txtAreaTitle").number('.'),
                            lengthTitle: jQuery("#txtLengthTitle").number('.'),
                            altitude: jQuery("#txtAltitude").number('.'),
                            reference: jQuery("#txtReference").string(),
                            gpsType: {
                                id: jQuery('#ddlGpsType').int32()
                            },
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
                            } else if (jQuery('#ddlLegalStatus').int32() === 0) {
                                success = false;
                                message = 'Seleccione la condición jurídica.';
                                jQuery('#ddlLegalStatus').focus();
                            } else if (jQuery('#ddlStatus').int32() === 0) {
                                success = false;
                                message = 'Seleccione el statusid.';
                                jQuery('#ddlStatus').focus();
                            } else if (jQuery('#ddlGeoReferenceType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Método Levan.';
                                jQuery('#ddlGeoReferenceType').focus();
                            } else if (jQuery('#ddlInformationSource').int32() === 0) {
                                success = false;
                                message = 'Seleccione la fuente.';
                                jQuery('#ddlInformationSource').focus();
                            } else if (jQuery('#ddlGpsType').int32() === 0) {
                                success = false;
                                message = 'Seleccione tipo de GPS.';
                                jQuery('#ddlGpsType').focus();
                            } else if (jQuery('#ddlRegistryOffice').int32() === 0) {
                                success = false;
                                message = 'Seleccione la sede registral.';
                                jQuery('#ddlRegistryOffice').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el sistema refer.';
                                jQuery('#ddlSpatialReference').focus();
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
                            field: "cadasterCode",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "areaTitle",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "lengthTitle",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "reference",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "holderName",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "registryOffice.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "status.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options,
                            callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            cadasterCode: jQuery('#txtCadasterCodeSearch')
                                .string(),
                            areaTitle: jQuery('#txtAreaTitleSearch').double(),
                            lengthTitle: jQuery('#txtLengthTitleSearch')
                                .double(),
                            reference: jQuery('#txtReferenceSearch').string(),
                            holderName: jQuery('#txtHolderNameSearch')
                                .string(),
                            state: jQuery('#chkStateSearch').boolean(),
                            registryOffice: {
                                id: jQuery('#ddlRegistryOfficeSearch').int32()
                            },
                            status: {
                                id: jQuery('#ddlStatusSearch').int32()
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
                        _super.prototype.load.call(this, "ruralcadaster", "ruralcadaster");
                    };
                    Main.execute = function () {
                        return new Main().load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                ruralcadaster.Main = Main;
            })(ruralcadaster.ruralcadaster || (ruralcadaster.ruralcadaster = {}));
            var ruralcadaster = ruralcadaster.ruralcadaster;
        })(jtm.ruralcadaster || (jtm.ruralcadaster = {}));
        var ruralcadaster = jtm.ruralcadaster;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.ruralcadaster.ruralcadaster.Main.execute();