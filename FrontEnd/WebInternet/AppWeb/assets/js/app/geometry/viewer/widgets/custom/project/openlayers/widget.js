function getObject() {
    return com.jtm.geometry.viewer.widgets.custom.project.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (project) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                    this.getCql = function () {
                                        var code = this.$widget.find('#txtCode').val();
                                        var name = this.$widget.find('#txtName').val();
                                        var cql = "strToLowerCase(codigo) LIKE '%{0}%' AND strToLowerCase(nombre) LIKE '%{1}%'";
                                        return cql.replace("{0}", code.toLowerCase()).replace("{1}", name.toLowerCase());
                                    };
                                }
                                Widget.prototype.initConfig = function () {
                                    this.config.module.widget.service.type = "wfs";
                                    _super.prototype.initConfig.call(this);
                                };
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    _super.prototype.launchView.call(this);
                                    thiss.layer = thiss.buildGraphicsLayer();
                                    thiss.layerDraw = thiss.buildGraphicsLayer();
                                };
                                Widget.prototype.search = function () {
                                    var thiss = this;
                                    thiss.layer.getSource().clear(true);
                                    var srid = thiss.map.getView().getProjection().getCode();
                                    thiss.searchConfig(thiss.config.module.widget.service.url, {
                                        isJson: false,
                                        async: true,
                                        data: {
                                            service: 'WFS',
                                            version: '2.0.0',
                                            request: 'GetFeature',
                                            typeNames: thiss.config.module.widget.service.id,
                                            srsName: srid,
                                            outputFormat: 'json',
                                            cql_filter: thiss.getCql()
                                        }
                                    }, function (data) {
                                        thiss.writeResultDefault(data);
                                    });
                                };
                                Widget.prototype.searchSpatial = function (geometry) {
                                    var thiss = this;
                                    thiss.layer.getSource().clear(true);
                                    var geometryClone = geometry.clone();
                                    if (geometryClone.getType() == "Circle") {
                                        geometryClone = ol.geom.Polygon.fromCircle(e.feature.getGeometry());
                                    }
                                    var spatialReference = ol.proj.get(thiss.config.module.widget.service.sridEPSG);
                                    geometryClone = (geometryClone.transform(thiss.map.getView().getProjection(), spatialReference));
                                    var format = new ol.format.WKT();
                                    geometryClone = (format.writeGeometry(geometryClone));
                                    //var extent = thiss.map.getView().calculateExtent(thiss.map.getSize());
                                    var srid = thiss.map.getView().getProjection().getCode();
                                    thiss.searchConfig(thiss.config.module.widget.service.url, {
                                        isJson: false,
                                        async: true,
                                        data: {
                                            service: 'WFS',
                                            version: '2.0.0',
                                            request: 'GetFeature',
                                            typeNames: thiss.config.module.widget.service.id,
                                            srsName: srid,
                                            outputFormat: 'json',
                                            cql_filter: 'Intersects(geometria,' + geometryClone + ')'
                                        }
                                    }, function (data) {
                                        thiss.layerDraw.getSource().clear(true);
                                        thiss.writeResultDefault(data);
                                    });
                                };
                                Widget.prototype.addInteraction = function (options) {
                                    var thiss = this;
                                    thiss.infoWindow.hide();
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
                                    }, this);
                                    thiss.draw.on('drawend', function (e) {
                                        thiss.toggleDragPan(true);
                                        thiss.removeInteraction();
                                        thiss.searchSpatial(e.feature.getGeometry());
                                    }, this);
                                };
                                Widget.prototype.resetContainers = function (toNull) {
                                    var thiss = this;
                                    _super.prototype.resetContainers.call(this, toNull);
                                    this.detachMapEventsSynchronize();
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
                                    this.removeInteraction();
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(project.BaseWidget);
                            project.Widget = Widget;
                        })(custom.project || (custom.project = {}));
                        var project = custom.project;
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