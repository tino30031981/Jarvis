function getObject() {
    return com.jtm.geometry.viewer.widgets.extractdata.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (extractdata) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                
                            }
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                jQuery.ajaxSetup({ async: false });
                                setInformation(thiss.config.module.widget.service);
                                jQuery.ajaxSetup({ async: true });
                                _super.prototype.initConfig.call(this);
                                function setInformation(service) {
                                    var queryString = "request=getcapabilities";
                                    service.url = (service.url.endsWith("?") ? service.url : service.url + "?");
                                    jQuery.ajax(service.url + queryString).done(function (response) {
                                        var data = $.xml2json(response);
                                        parseLayers(data);
                                        parseFormats(data);
                                    });
                                    function parseLayers(data) {
                                        service.layers = (service.layers === undefined || service.layers === null) ? [] : service.layers;
                                        service.layers = (typeof service.layers === "string") ? service.layers.split(",") : service.layers;
                                        var pattern = /urn:ogc:def:crs:/;
                                        var patternEPSG = /urn:ogc:def:crs:EPSG::/;
                                        var i = 0;
                                        var layers = data.FeatureTypeList.FeatureType;
                                        service.layers2 = [];
                                        if (service.layers.length > 0) {
                                            for (i = 0; i < layers.length; i++) {
                                                if (service.layers.contains2(layers[i].Name) === true) {
                                                    add(layers[i]);
                                                }
                                            }
                                        }
                                        else {
                                            for (i = 0; i < layers.length; i++) {
                                                add(layers[i]);
                                            }
                                        }
                                        delete service.layers;
                                        service.layers = service.layers2;
                                        delete service.layers2;
                                        function add(layer2) {
                                            var layer = {};
                                            layer.id = layer2.Name;
                                            layer.name = layer2.Title;
                                            layer.srid = layer2.DefaultCRS.replace(patternEPSG, '');
                                            layer.sridEPSG = layer2.DefaultCRS.replace(pattern, '').replace("::", ":");
                                            service.layers2.push(layer);
                                        }
                                    }
                                    function parseFormats(data) {
                                        var getFeature = data.OperationsMetadata.Operation.find2("name", "GetFeature");
                                        service.formats = getFeature.Parameter.find2("name", "outputFormat").AllowedValues.Value;
                                        service.formats2 = [];
                                        var i = 0;
                                        for (i = 0; i < service.formats.length; i++) {
                                            if (service.formats[i].indexOf("/") == -1)
                                                service.formats2.push(service.formats[i]);
                                        }
                                        delete service.formats;
                                        service.formats = service.formats2;
                                        delete service.formats2;
                                    }
                                }
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layerDraw = new ol.layer.Vector({
                                    source: new ol.source.Vector(),
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layerDraw);
                            };
                            Widget.prototype.search = function (geometry) {
                                var thiss = this;
                                thiss.layerDraw.getSource().clear(true);
                                var serviceId = thiss.$ddlLayer.val();
                                serviceId = (serviceId instanceof Array && serviceId.length > 0) ? serviceId[0] : serviceId;
                                var item = thiss.config.module.widget.service.layers.find2("id", serviceId);
                                if (item === null) {
                                    alert("Capa no disponible");
                                    return;
                                }
                                var geometryClone = geometry.clone();
                                if (geometryClone.getType() == "Circle") {
                                    geometryClone = ol.geom.Polygon.fromCircle(e.feature.getGeometry());
                                }
                                geometryClone = (geometryClone.transform(thiss.map.getView().getProjection(), item.sridEPSG));
                                var format = new ol.format.WKT();
                                geometryClone = (format.writeGeometry(geometryClone));
                                var srid = thiss.$ddlSpatialReferenceOutput.int32();
                                if (srid > Widget.DDLVALUEDEFAULT)
                                    srid = "EPSG:" + srid;
                                else
                                    srid = item.sridEPSG;
                                var parameters = {
                                    service: 'WFS',
                                    version: '2.0.0',
                                    request: 'GetFeature',
                                    typeNames: item.id,
                                    srsName: srid,
                                    outputFormat: thiss.$ddlFormat.string(),
                                    cql_filter: 'Intersects(geometria,' + geometryClone + ')'
                                };
                                var queryString = jQuery.param(parameters);
                                var url = thiss.config.module.widget.service.url + queryString;
                                window.open(url, '_blank');
                            };
                            
                            Widget.prototype.addInteraction = function (options) {
                                var thiss = this;
                                thiss.infoWindow.hide();
                                var serviceId = thiss.$ddlLayer.val();
                                if (serviceId == Widget.DDLVALUEDEFAULT) { alert("Seleccione la capa"); return; }
                                thiss.toggleDragPan(false);
                                thiss.removeInteraction();
                                thiss.resetContainers();
                                thiss.draw = new ol.interaction.Draw({
                                    source: thiss.layerDraw.getSource(),
                                    type: options.type,
                                    condition: options.condition,
                                    freehandCondition: options.freehandCondition,
                                    maxPoints: options.maxPoints,
                                    geometryFunction: options.geometryFunction
                                });
                                thiss.map.addInteraction(thiss.draw);
                                thiss.draw.on('drawstart', function (e) {
                                    thiss.toggleDragPan(false);
                                    thiss.layerDraw.getSource().clear(true);
                                }, this);
                                thiss.draw.on('drawend', function (e) {
                                    thiss.toggleDragPan(true);
                                    thiss.removeInteraction();
                                    thiss.layerDraw.getSource().clear(true);
                                    thiss.search(e.feature.getGeometry());
                                }, this);
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                this.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                                if (this.layerDraw !== null) {
                                    this.layerDraw.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layerDraw);
                                        this.layerDraw = null;
                                    }
                                }
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(extractdata.BaseWidget);
                        extractdata.Widget = Widget;
                    })(widgets.extractdata || (widgets.extractdata = {}));
                    var extractdata = widgets.extractdata;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));