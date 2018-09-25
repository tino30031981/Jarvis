(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (query) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$rdbQuery = null;
                                this.$divSpatial = null;
                                this.$divAlphanumeric = null;
                                this.$txtSearch = null;
                                this.parseAGSD = function (service, services) {
                                    var thiss = this;
                                    jQuery.getJSON(service.url + service.layerId + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                        if (data.error !== undefined) {
                                            service.disabled = true;
                                        }
                                        else {
                                            if (data === null) return;
                                            service.definition = data;
                                            service.label = String.isNullOrWhiteSpace(service.label) === true ? service.definition.name : service.label;
                                        }
                                    }).fail(function (data, textStatus, jqXHR) {
                                        service.disabled = true;
                                    });
                                };
                                this.parseWFS = function (service, services) {
                                    var thiss = this;
                                    var queryString = "request=getcapabilities";
                                    var pattern = /urn:ogc:def:crs:/;
                                    var patternEPSG = /urn:ogc:def:crs:EPSG::/;
                                    jQuery.ajax(service.url + queryString).done(function (response) {
                                        var data = $.xml2json(response);
                                        parseLayers(data, service);
                                    });
                                    function parseLayers(data, service) {
                                        var layers = data.FeatureTypeList.FeatureType;
                                        var i = 0;
                                        var j = 0;
                                        var index = -1;
                                        for (i = 0; i < layers.length; i++) {
                                            j = 0;
                                            for (j = 0; j < service.layers.length; j++) {
                                                if (service.layers[j].disabled === true) continue;
                                                if (layers[i].Name.toLowerCase() == service.layers[j].id.toLowerCase()) {
                                                    index = services.push(service.layers[j]);
                                                    services[index - 1].uuid = thiss.getUUID();
                                                    services[index - 1].url = service.url;
                                                    services[index - 1].id = layers[i].Name;
                                                    services[index - 1].name = layers[i].Title;
                                                    services[index - 1].srid = layers[i].DefaultCRS.replace(patternEPSG, '');
                                                    services[index - 1].sridEPSG = layers[i].DefaultCRS.replace(pattern, '').replace("::", ":");
                                                }
                                            }
                                        }
                                    }
                                };
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 300 }
                                });
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.services2 = [];
                                jQuery.ajaxSetup({ async: false });
                                parseServices(thiss.config.module.widget.services);
                                jQuery.ajaxSetup({ async: true });
                                thiss.config.module.widget.services = thiss.config.module.widget.services2;
                                delete thiss.config.module.widget.services2;
                                _super.prototype.initConfig.call(this);
                                function parseServices(services) {
                                    //jQuery.support.cors = true;
                                    var i = 0;
                                    for (i = 0; i < services.length; i++) {
                                        services[i].url = (services[i].url.endsWith("?") ? services[i].url : services[i].url + "?");
                                        switch (services[i].type) {
                                            case "wfs":
                                                thiss.parseWFS(services[i], thiss.config.module.widget.services2);
                                                break;
                                            case "agsd":
                                                thiss.parseAGSD(services[i], thiss.config.module.widget.services2);
                                                break;
                                        }
                                    }
                                }
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$ddlLayer = this.$widget.find('#ddlLayer');
                                this.$rdbQuery = this.$widget.find('input[name=rdbQuery]:radio');
                                this.$divSpatial = this.$widget.find('#divSpatial');
                                this.$divAlphanumeric = this.$widget.find('#divAlphanumeric');
                                this.$btnSearch = this.$widget.find('#btnSearch');
                                this.$btnPoint = thiss.$widget.find("#btnPoint");
                                this.$btnPolyline = thiss.$widget.find("#btnPolyline");
                                this.$btnPolylineFreeHand = thiss.$widget.find("#btnPolylineFreeHand");
                                this.$btnRectangle = thiss.$widget.find("#btnRectangle");
                                this.$btnCircle = thiss.$widget.find("#btnCircle");
                                this.$btnEllipse = thiss.$widget.find("#btnEllipse");
                                this.$btnPolygon = thiss.$widget.find("#btnPolygon");
                                this.$btnPolygonFreeHand = thiss.$widget.find("#btnPolygonFreeHand");
                                this.$txtSearch = thiss.$widget.find('#txtSearch');
                                this.$table = thiss.$widget.find('#tblResult');
                                this.$rdbQuery.off('change');
                                this.$rdbQuery.on("change", function (e) {
                                    thiss.$table.empty();
                                    thiss.resetContainers();
                                    if (jQuery(this).is(":checked") === true) {
                                        switch (jQuery(this).prop("id")) {
                                            case "rdbAlphanumeric":
                                                setAlphanumeric();
                                                break;
                                            case "rdbSpatial":
                                                setSpatial();
                                                break;
                                            default:
                                                alert("No soportado");
                                                break;
                                        }
                                    }
                                });
                                this.$rdbQuery.trigger('change');
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlLayer,
                                    items: thiss.config.module.widget.services,
                                    fieldId: 'uuid',
                                    fieldName: "name"
                                });
                                function setAlphanumeric() {
                                    thiss.$divSpatial.hide();
                                    thiss.$divAlphanumeric.show();
                                    thiss.$btnSearch.off('click');
                                    thiss.$btnSearch.on('click', function (e) {
                                        thiss.search();
                                    });
                                }
                                function setSpatial() {
                                    thiss.$divSpatial.show();
                                    thiss.$divAlphanumeric.hide();
                                    thiss.$btnPoint.off("click");
                                    thiss.$btnPoint.on("click", function (e) {
                                        thiss.drawPoint();
                                    });
                                    thiss.$btnPolyline.off("click");
                                    thiss.$btnPolyline.on("click", function (e) {
                                        thiss.drawPolyline();
                                    });
                                    thiss.$btnPolylineFreeHand.off("click");
                                    thiss.$btnPolylineFreeHand.on("click", function (e) {
                                        thiss.drawPolylineFreeHand();
                                    });
                                    thiss.$btnRectangle.off("click");
                                    thiss.$btnRectangle.on("click", function (e) {
                                        thiss.drawRectangle();
                                    });
                                    thiss.$btnCircle.off("click");
                                    thiss.$btnCircle.on("click", function (e) {
                                        thiss.drawCircle();
                                    });
                                    thiss.$btnEllipse.off("click");
                                    thiss.$btnEllipse.on("click", function (e) {
                                        thiss.drawEllipse();
                                    });
                                    thiss.$btnPolygon.off("click");
                                    thiss.$btnPolygon.on("click", function (e) {
                                        thiss.drawPolygon();
                                    });
                                    thiss.$btnPolygonFreeHand.off("click");
                                    thiss.$btnPolygonFreeHand.on("click", function (e) {
                                        thiss.drawPolygonFreeHand();
                                    });
                                }
                            };
                            BaseWidget.prototype.searchSpatial = function (geometry) {
                            };
                            BaseWidget.prototype.writeResultDefault = function (data, options) {
                                _super.prototype.writeResultDefault.call(this, data, options);
                                this.$table.find('button').remove();
                            }
                            BaseWidget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        query.BaseWidget = BaseWidget;
                    })(widgets.query || (widgets.query = {}));
                    var query = widgets.query;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));