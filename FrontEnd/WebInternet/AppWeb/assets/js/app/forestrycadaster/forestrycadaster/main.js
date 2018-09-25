(function (com) {
    (function (jtm) {
        (function (forestrycadaster) {
            (function (forestrycadaster) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "fc";
                        this.saveHolder = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnId.int32(),
                                holder: {
                                    fullName: jQuery('#txtFullName').string(),
                                    transferResolution: jQuery('#txtTransferResolution').string(),
                                    transferDate: jQuery("#txtTransferDate").date()
                                }
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'forestrycadaster/forestrycadaster/saveholder', options, function () {
                                jQuery('#txtFullName').val("");
                                jQuery('#txtTransferResolution').val("");
                                jQuery('#txtTransferDate').val("");
                                thiss.searchHolders();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#txtFullName').string() === '') {
                                    success = false;
                                    message = 'Ingrese nombre completo del titular.';
                                    jQuery('#txtFullName').focus();
                                } else if (jQuery('#txtTransferResolution').string() === '') {
                                    success = false;
                                    message = 'Ingrese la resolución de transferencia.';
                                    jQuery('#txtTransferResolution').focus();
                                } else if (jQuery('#txtTransferDate').date() === null) {
                                    success = false;
                                    message = 'Ingrese la fecha de transferencia.';
                                    jQuery('#txtTransferDate').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.searchHolders = function () {
                            var thiss = this;
                            var options = {
                                isJson: false,
                                data: { id: thiss.$hdnId.int32() }
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'forestrycadaster/forestrycadaster/searchholders', options, function (items) {
                                thiss.fillHolders(items, '#tblResultHolders', "#divTotalHolder");
                            });
                        };
                        this.fillHolders = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.fullName + '</td>';
                                html += '<td>' + item.transferResolution + '</td>';
                                html += '<td>' + item.transferDate + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            /*jQuery(tbl + '>tbody>tr input:text').numeric({ negative: false, decimalPlaces: 2 });*/
                        };
                        this.deleteHolders = function () {
                            var thiss = this;
                            var holderIds = com.jtm.helper.Table.getItems("#tbdResultHolders", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), holderIds: holderIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (holderIds.length === 0) {
                                    alert('Seleccione al menos un titular.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'forestrycadaster/forestrycadaster/deleteholders', options, function () { thiss.searchHolders(); });
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtDateAgreementStartSearch');
                        thiss.datePicker('#txtDateAgreementEndSearch');
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.datePicker('#txtAgreementDate');
                            jQuery('#filFile').fileupload({
                                urlSave: com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/savedocument",
                                urlDetail: com.jtm.Server.contextPath + "documentlibrary/document/detail",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/searchdocuments"
                            });
                            thiss.datePicker('#txtTransferDate');
                            jQuery('#btnSaveHolder').off("click");
                            jQuery('#btnSaveHolder').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.saveHolder();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitHolders').off("click");
                            jQuery('#btnQuitHolders').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteHolders();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        var services = [];
                        services.push({ name: "Distritos", url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioBase/MapServer/12" },
                            { name: "Area de Conservación", url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioTematico/MapServer/4" },
                            { name: "Lotes Petroleros", url: "http://geoservidor.minam.gob.pe/arcgis/rest/services/ServicioTematico/MapServer/21" },
                            { name: "Catastro Minero", url: "http://geocatminapp.ingemmet.gob.pe/arcgis/rest/services/SERV_CATASTRO_MINERO/MapServer/0" });
                        var reportOverlapData = { title: "Reporte de análisis de superposición espacial - Catastro Forestal", services: services };
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtAgreementNumber').val(item.agreementNumber);
                            jQuery('#txtAgreementDate').val(item.agreementDate);
                            jQuery('#txtHolderName').val(item.holderName);
                            jQuery('#txtLegalBase').val(item.legalBase);
                            jQuery('#ddlModality').val(item.modality.id);
                            jQuery('#ddlStatus').val(item.status.id);
                            jQuery('#ddlInformationSource').val(item.informationSource.id);
                            jQuery('#ddlGpsType').val(item.gpsType.id);
                            jQuery('#txtAltitude').val(item.altitude);
                            jQuery('#ddlScale').val(item.scale.id);
                            jQuery('#txtReference').val(item.reference);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalCount));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalCount));
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/searchnationalcartographies", item.id, null);
                            thiss.searchHolders();
                            thiss.reportOverlap2(item.id, thiss.config.module.tables, {
                                urlView: com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/reportoverlap",
                                urlOverlap: com.jtm.Server.contextPath + "forestrycadaster/forestrycadaster/searchoverlaps"
                            }, function (item) {
                                jQuery('#pCode').text(item.code);
                                jQuery('#pName').text(item.name);
                                jQuery('#pHolderName').text(item.holderName);
                                jQuery('#pStatusName').text(item.status.name);
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
                            name: "",
                            agreementNumber: jQuery("#txtAgreementNumber").string(),
                            agreementDate: jQuery("#txtAgreementDate").date(),
                            legalBase: jQuery("#txtLegalBase").string(),
                            holderName: jQuery("#txtHolderName").string(),
                            reference: jQuery("#txtReference").string(),
                            description: "",
                            observation: jQuery("#txaObservation").string(),
                            status: {
                                id: jQuery('#ddlStatus').int32()
                            },
                            modality: {
                                id: jQuery('#ddlModality').int32()
                            },
                            informationSource: {
                                id: jQuery('#ddlInformationSource').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            gpsType: {
                                id: jQuery('#ddlGpsType').int32()
                            },
                            altitude: jQuery("#txtAltitude").number('.'),
                            source: "",
                            scale: {
                                id: jQuery('#ddlScale').int32()
                            },
                        };
                        _super.prototype.save.call(this, url, data, options, function (item) {
                            thiss.detail(null, item.extra, null);
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtAgreementNumber').string() === '') {
                                success = false;
                                message = 'Ingrese el número de contrato.';
                                jQuery('#txtAgreementNumber').focus();
                            } else if (jQuery('#txtAgreementDate').date() === null) {
                                success = false;
                                message = 'Ingrese la fecha del contrato.';
                                jQuery('#txtAgreementDate').focus();
                            } else if (jQuery('#txtHolderName').string() === '') {
                                success = false;
                                message = 'Ingrese el nombre del titular.';
                                jQuery('#txtHolderName').focus();
                            } else if (jQuery('#txtLegalBase').string() === '') {
                                success = false;
                                message = 'Ingrese la base legal.';
                                jQuery('#txtLegalBase').focus();
                            } else if (jQuery('#ddlModality').int32() === 0) {
                                success = false;
                                message = 'Seleccione la modalidad.';
                                jQuery('#ddlModality').focus();
                            } else if (jQuery('#ddlStatus').int32() === 0) {
                                success = false;
                                message = 'Seleccione el estado.';
                                jQuery('#ddlStatus').focus();
                            } else if (jQuery('#ddlInformationSource').int32() === 0) {
                                success = false;
                                message = 'Seleccione la fuente.';
                                jQuery('#ddlInformationSource').focus();
                            } else if (jQuery('#ddlGpsType').int32() === 0) {
                                success = false;
                                message = 'Seleccione tipo de GPS.';
                                jQuery('#ddlGpsType').focus();
                            } else if (jQuery('#ddlScale').int32() === 0) {
                                success = false;
                                message = 'Seleccione la escala.';
                                jQuery('#ddlScale').focus();
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
                            field: "agreementNumber",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "agreementDate",
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
                            field: "modality.name",
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
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            agreementNumber: jQuery('#txtDateAgreementStartSearch').string(),
                            agreementDate: jQuery('#txtDateAgreementEndSearch').date(),
                            agreementDateEnd: jQuery('#txtAgreementDateEndSearch').date(),
                            holderName: jQuery('#txtHolderNameSearch').string(),
                            modality: {
                                id: jQuery('#ddlModalitySearch').int32()
                            },
                            status: {
                                id: jQuery('#ddlStatusSearch').int32()
                            },
                            district: {
                                id: jQuery('#ddlDistrictSearch').int32(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').int32(),
                                    department: {
                                        id: jQuery('#ddlDepartmentSearch').int32()
                                    }
                                }
                            }
                        };
                    };
                    Main.prototype.load = function () {
                        var thiss = this;
                        _super.prototype.load.call(this, "forestrycadaster", "forestrycadaster");
                    };
                    Main.execute = function () {
                        return new Main().load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                forestrycadaster.Main = Main;
            })(forestrycadaster.forestrycadaster || (forestrycadaster.forestrycadaster = {}));
            var forestrycadaster = forestrycadaster.forestrycadaster;
        })(jtm.forestrycadaster || (jtm.forestrycadaster = {}));
        var forestrycadaster = jtm.forestrycadaster;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.forestrycadaster.forestrycadaster.Main.execute();