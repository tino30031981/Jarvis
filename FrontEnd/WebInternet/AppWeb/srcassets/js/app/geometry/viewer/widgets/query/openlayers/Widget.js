function getObject() {
    return com.jtm.geometry.viewer.widgets.query.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (query) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                
                                this.getCql = function (fields) {
                                    var where = "1=1";
                                    var searchText = this.$txtSearch.val();
                                    if (fields instanceof Array) {
                                        where += " AND (";
                                        var i = 0;
                                        for (i = 0; i < fields.length; i++) {
                                            where += fields[i] + " LIKE '%" + searchText + "%'";
                                            if (i < fields.length - 1)
                                                where += ' OR ';
                                        }
                                        where += ")";
                                    }
                                    return where;
                                };
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new ol.layer.Vector({
                                    source: new ol.source.Vector(),
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                    }
                                });
                                thiss.layer.set('id', 'query_' + thiss.getUUID());
                                thiss.map.addLayer(thiss.layer);
                                thiss.layerDraw = new ol.layer.Vector({
                                    source: new ol.source.Vector(),
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layerDraw);
                            };
                            Widget.prototype.search = function () {
                                var thiss = this;
                                thiss.layer.getSource().clear(true);
                                var searchText = thiss.$txtSearch.val();
                                var serviceId = thiss.$ddlLayer.val();
                                if (serviceId == Widget.DDLVALUEDEFAULT) { alert("Seleccione la capa"); return; }
                                if (String.isNullOrWhiteSpace(searchText) === true) { alert("Ingrese un texto para buscar"); return; }
                                var service = thiss.config.module.widget.services.find(function (service) {
                                    return service.uuid === serviceId;
                                });
                                var srid = thiss.map.getView().getProjection().getCode();
                                thiss.searchConfig(service.url, {
                                    isJson: false,
                                    async: true,
                                    data: {
                                        service: 'WFS',
                                        version: '2.0.0',
                                        request: 'GetFeature',
                                        typeNames: service.id,
                                        srsName: srid,
                                        outputFormat: 'json',
                                        cql_filter: thiss.getCql(service.searchFields)
                                    }
                                }, function (data) {
                                    thiss.layerDraw.getSource().clear(true);
                                    thiss.writeResultDefault(data);
                                });
                            };
                            Widget.prototype.searchSpatial = function (geometry) {
                                var thiss = this;
                                thiss.layer.getSource().clear(true);
                                var serviceId = thiss.$ddlLayer.val();
                                if (serviceId == Widget.DDLVALUEDEFAULT) { alert("Seleccione la capa"); return; }
                                var service = thiss.config.module.widget.services.find(function (service) {
                                    return service.uuid === serviceId;
                                });
                                var geometryClone = geometry.clone();
                                if (geometryClone.getType() == "Circle") {
                                    geometryClone = ol.geom.Polygon.fromCircle(e.feature.getGeometry());
                                }
                                var spatialReference = ol.proj.get(service.sridEPSG);
                                geometryClone = (geometryClone.transform(thiss.map.getView().getProjection(), spatialReference));
                                var format = new ol.format.WKT();
                                geometryClone = (format.writeGeometry(geometryClone));
                                //var extent = thiss.map.getView().calculateExtent(thiss.map.getSize());
                                var srid = thiss.map.getView().getProjection().getCode();
                                thiss.searchConfig(service.url, {
                                    isJson: false,
                                    async: true,
                                    data: {
                                        service: 'WFS',
                                        version: '2.0.0',
                                        request: 'GetFeature',
                                        typeNames: service.id,
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
                                    thiss.searchSpatial(e.feature.getGeometry());
                                }, this);
                            };
                            Widget.prototype.resetContainers = function (toNull) {
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
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(query.BaseWidget);
                        query.Widget = Widget;
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