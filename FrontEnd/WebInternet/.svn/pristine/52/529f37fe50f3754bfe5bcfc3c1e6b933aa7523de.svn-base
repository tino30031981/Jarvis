(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (station) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "sta";                        
                        this.searchRecords = function (id) {
                            var thiss = this;
                            var options = {};
                            options.isJson = false;
                            options.data = { id: id };
                            var url = com.jtm.Server.contextPath + "environment/station/searchrecord";
                            thiss.searchConfig(url, options, function (data) {
                                jQuery('#imgRecord').attr('src', '');
                                jQuery('#imgRecord').attr("alt", '');
                                jQuery('#ddlImage').empty();
                                if (data.length > 0) {
                                    thiss.fillRecordImages(data);
                                    jQuery('#ddlImage').val(data[data.length - 1].id);
                                    thiss.navigationRecordHandler();
                                }
                            });
                        };
                        this.fillRecordImages = function (items) {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            $ddl.empty();
                            for (var i = 0; i < items.length; i++) {
                                $ddl.append('<option name="' + items[i].id + '" value="' + items[i].id + '">Imagen ' + (i + 1) + '</option>');
                            }
                        };
                        this.navigationRecordHandler = function () {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            var $img = $('#imgRecord');
                            $img.off("load");
                            $img.on("load", function (e) {
                                thiss.loadingHide();
                            });
                            $img.off("error");
                            $img.on("error", function (e) {
                                jQuery(this).attr("alt", "No se pudo cargar la imagen");
                                thiss.loadingHide();
                            });
                            $ddl.off("change");
                            $ddl.on("change", function (e) {
                                thiss.loadingShow();
                                jQuery('#imgRecord').attr("src", "");
                                if (jQuery(this).int32() === 0) return;
                                jQuery('#hdnImageId').val(jQuery(this).int32());
                                jQuery('#imgRecord').attr("alt", "Imagen: " + jQuery(this).int32());
                                jQuery('#imgRecord').attr("src", com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + jQuery(this).int32());
                            });
                            jQuery('#btnFirst').off("click");
                            jQuery('#btnFirst').on("click", function (e) {
                                $ddl.val($ddl.find("option:first-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            jQuery('#btnLast').off("click");
                            jQuery('#btnLast').on("click", function (e) {
                                $ddl.val($ddl.find("option:last-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            jQuery('#btnPrevious').off("click");
                            jQuery('#btnPrevious').on("click", function (e) {
                                var index = $ddl.find(":selected").index() - 1;
                                if (index >= 0) {
                                    $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                    $ddl.trigger("change");
                                }
                            });
                            jQuery('#btnNext').off("click");
                            jQuery('#btnNext').on("click", function (e) {
                                var index = $ddl.find(":selected").index() + 1;
                                var lastIndex = $ddl.find(":last-child").index();
                                if (index <= lastIndex) {
                                    $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                    $ddl.trigger("change");
                                }
                            });
                            $ddl.trigger("change");
                        };
                        this.saveDocument = function () {
                            var thiss = this;
                            var item = { id: thiss.$hdnId.int32() };
                            var options = {
                                data: item,
                                attachments: [{ id: "filPhoto", file: jQuery('#filPhoto')[0].files[0] }],
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/station/savedocument', options, function (item) {
                                thiss.searchRecords(thiss.$hdnId.int32());
                                jQuery('#filPhoto').val('');
                            });
                            function validate() {
                                if (jQuery('#filPhoto').val() === '') {
                                    alert('Seleccione una foto.');
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.deleteDocument = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'documentlibrary/document/delete', options, function () {
                                thiss.searchRecords(thiss.$hdnId.int32());
                            });
                            function validate() {
                                if (id === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.detailReport = function (id, format) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                isJson: false
                            };
                            thiss.downloadConfig(com.jtm.Server.contextPath + 'environment/station/detailreport', format, options);
                        };
                    }                    
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            jQuery('#btnAddPhoto').off("click");
                            jQuery('#btnAddPhoto').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    jQuery('#filPhoto').trigger('click');
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#filPhoto').off("change");
                            jQuery('#filPhoto').on("change", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                thiss.saveDocument();
                            });
                            jQuery('#btnDeletePhoto').off("click");
                            jQuery('#btnDeletePhoto').on("click", function (e) {
                                if (jQuery('#hdnImageId').int32() !== 0) {
                                    var id = jQuery('#hdnImageId').int32();
                                    thiss.deleteDocument(id);
                                }
                                else
                                    alert('No existe imagen para eliminar.');
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
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txtReference').val(item.reference);
                            jQuery('#ddlStationClass').val(item.stationClass.id);
                            thiss.formViewer.$ddlSpatialReference.val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            jQuery('#txtReceiverBody').val(item.receiverBody);
                            jQuery('#txtReceiverBodyCategory').val(item.receiverBodyCategory);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#txtAltitude').val(item.altitude);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "environment/station/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "environment/station/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "environment/station/searchnationalcartographies", item.id, null);
                            thiss.searchRecords(thiss.$hdnId.int32());
                        });
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
                            field: "stationClass.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "description",
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
                            code: jQuery('#txtCodeSearch').val(),
                            name: jQuery('#txtNameSearch').val(),
                            stationClass: { id: jQuery('#ddlStationClassSearch').int32() },
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
                            code: jQuery('#txtCode').val(),
                            name: jQuery("#txtName").val(),
                            description: jQuery('#txaDescription').val(),
                            observation: jQuery('#txaObservation').val(),
                            reference: jQuery('#txtReference').val(),
                            receiverBody: jQuery('#txtReceiverBody').val(),
                            receiverBodyCategory: jQuery('#txtReceiverBodyCategory').val(),
                            stationClass: { id: jQuery("#ddlStationClass").int32() },
                            spatialReference: { id: thiss.formViewer.$ddlSpatialReference.int32() },
                            coordinate: { x: thiss.formViewer.$txtX.number(), y: thiss.formViewer.$txtY.number() },
                            altitude: jQuery('#txtAltitude').number(),
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
                            } else if (jQuery('#ddlStationClass').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo.';
                                jQuery('#ddlStationClass').focus();
                            } else if (thiss.formViewer.$ddlSpatialReference.int32() === 0) {
                                success = false;
                                message = 'Seleccione el sistema referencial.';
                                thiss.formViewer.$ddlSpatialReference.focus();
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
                station.Main = Main;
            })(environment.station || (environment.station = {}));
            var station = environment.station;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.station.Main.execute();