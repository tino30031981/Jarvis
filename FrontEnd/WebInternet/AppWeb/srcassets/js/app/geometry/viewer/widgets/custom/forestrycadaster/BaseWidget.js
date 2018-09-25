(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (forestrycadaster) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$rdbQuery = null;
                                    this.$divSpatial = null;
                                    this.$divAlphanumeric = null;
                                    this.parseWFS = function (service) {
                                        var thiss = this;
                                        var queryString = "request=getcapabilities";
                                        var pattern = /urn:ogc:def:crs:/;
                                        var patternEPSG = /urn:ogc:def:crs:EPSG::/;
                                        jQuery.ajax(service.url + queryString).done(function (response) {
                                            var data = $.xml2json(response);
                                            parseLayer(data, service);
                                        });
                                        function parseLayer(data, service) {
                                            var layers = data.FeatureTypeList.FeatureType;
                                            var i = 0;
                                            var j = 0;
                                            for (i = 0; i < layers.length; i++) {
                                                if (layers[i].Name.toLowerCase() == service.layerId.toLowerCase()) {
                                                    thiss.config.module.widget.service2 = {
                                                        url: service.url,
                                                        id: layers[i].Name,
                                                        name: layers[i].Title,
                                                        srid: layers[i].DefaultCRS.replace(patternEPSG, ''),
                                                        sridEPSG: layers[i].DefaultCRS.replace(pattern, '').replace("::", ":")
                                                    };
                                                    break;
                                                }
                                            }
                                        }
                                    };
                                    this.parseAGSD = function (service, service2) {
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
                                    this.config.module.widget.service2 = {};
                                    jQuery.ajaxSetup({ async: false });
                                    parseService(thiss.config.module.widget.service);
                                    jQuery.ajaxSetup({ async: true });
                                    thiss.config.module.widget.service = thiss.config.module.widget.service2;
                                    delete thiss.config.module.widget.service2;
                                    _super.prototype.initConfig.call(this);
                                    function parseService(service) {
                                        service.url = (service.url.endsWith("?") ? service.url : service.url + "?");
                                        switch (service.type) {
                                            case "wfs":
                                                thiss.parseWFS(service);
                                                break;
                                            case "agsd":
                                                thiss.parseAGSD(service);
                                                break;
                                        }
                                    }
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
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
                            forestrycadaster.BaseWidget = BaseWidget;
                        })(custom.forestrycadaster || (custom.forestrycadaster = {}));
                        var forestrycadaster = custom.forestrycadaster;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));