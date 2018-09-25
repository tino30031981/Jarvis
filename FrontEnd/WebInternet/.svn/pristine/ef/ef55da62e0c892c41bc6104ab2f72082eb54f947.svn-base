function getInstance() {
    return com.jtm.event.event.FormMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (event) {
            (function (event) {
                var FormMap = (function (_super) {
                    __extends(FormMap, _super);
                    function FormMap() {
                        _super.call(this);
                        this.addGeometryToLayer = function (layer, geometry) {
                            var geometryMAP = this.transform(geometry, this.map.getView().getProjection().getWKID());
                            var geometryDB = this.transform(geometry, FormMap.SRIDDEFAULTAPP);
                            var spatialReference = ol.proj.get('EPSG:' + geometry.spatialReference.id);
                            var geometry2 = null;
                            if (geometry.type === FormMap.OGCTYPES.POINT) {
                                geometry2 = new ol.geom.Point(geometryMAP.coordinates);
                            }
                            else if (geometry.type === FormMap.OGCTYPES.LINESTRING) {
                                geometry2 = new ol.geom.LineString(geometryMAP.coordinates);
                            }
                            else if (geometry.type === FormMap.OGCTYPES.POLYGON) {
                                geometry2 = new ol.geom.Polygon(geometryMAP.coordinates);
                            }
                            else {
                                window.plugins.toast.showLongBottom('Tipo de geometría no identificada');
                                return;
                            }
                            var feature = new ol.Feature({
                                geometry: geometry2
                            });
                            feature.setId(0);
                            feature.setProperties({ 'geometryy': JSON.stringify(geometryDB) });
                            layer.getSource().addFeature(feature);
                            var extent = feature.getGeometry().getExtent();
                            this.map.getView().fit(extent, this.map.getSize(), { maxZoom: 10 });
                            if (geometry.type === FormMap.OGCTYPES.LINESTRING) {
                                this.$txtLength.val(geometry2.getLength().toFixed(this.config.number.decimalCount));
                            }
                            else if (geometry.type === FormMap.OGCTYPES.POLYGON) {
                                this.$txtLength.val(geometry2.getLength().toFixed(this.config.number.decimalCount));
                                this.$txtArea.val(geometry2.getArea().toFixed(this.config.number.decimalCount));
                            }
                        };
                    }
                    FormMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        this.layerDraw = this.buildGraphicsLayer();
                    };
                    FormMap.prototype.addGeometry = function (geometry) {
                        this.layer.getSource().clear(true);
                        this.addGeometryToLayer(this.layer, geometry);
                    };
                    FormMap.prototype.addInteraction = function (options) {
                        var thiss = this;
                        thiss._toggleDragPan(false);
                        if (thiss.draw !== null)
                            thiss.map.removeInteraction(thiss.draw);
                        thiss.layerDraw.getSource().clear(true);
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
                            thiss._toggleDragPan(false);
                        }, this);
                        thiss.draw.on('drawend', function (e) {
                            thiss._toggleDragPan(true);
                            thiss.map.removeInteraction(thiss.draw);
                            if (e.feature.getGeometry().getType() === "Circle") {
                                e.feature.setGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()));
                            }
                            thiss.callbackMapDraw(e.feature.getGeometry());
                        }, this);
                    };
                    FormMap.prototype.callbackMapDraw = function (geometry) {
                        if (geometry === null) return;
                        this.layerDraw.getSource().clear(true);
                        var geometry2 = {
                            type: FormMap.OGCTYPES.POLYGON,
                            coordinates: geometry.getCoordinates(),
                            spatialReference: { id: this.map.getView().getProjection().getWKID() }
                        };
                        this.addGeometryToLayer(this.layerDraw, geometry2);
                    };
                    FormMap.prototype.callbackGPSDraw = function (geometry) {
                        if (geometry === null) return;
                        this.layerDraw.getSource().clear(true);
                        this.addGeometryToLayer(this.layerDraw, geometry);
                    };
                    FormMap.prototype.getGeometry = function () {
                        var geometry = null;
                        var feature = this.layerDraw.getSource().getFeatureById(0);
                        if (feature !== null)
                            geometry = feature.getProperties()["geometryy"];
                        else {
                            feature = this.layer.getSource().getFeatures()[0];
                            if (feature !== undefined && feature !== null)
                                geometry = feature.getProperties()["geometryy"];
                        }
                        return (String.isNullOrWhiteSpace(geometry) === true ? null : geometry);
                    };
                    FormMap.prototype.cleanLayerDraw = function (toNull) {
                        toNull = typeof toNull === "boolean" ? toNull : false;
                        _super.prototype.cleanLayerDraw.call(this, toNull);
                        if (this.layerDraw !== null) {
                            this.layerDraw.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerDraw);
                                this.layerDraw = null;
                            }
                        }
                    };
                    FormMap.prototype.cleanControls = function (toNull) {
                        toNull = typeof toNull === "boolean" ? toNull : false;
                        _super.prototype.cleanControls.call(this, toNull);
                        if (this.layer !== null) {
                            this.layer.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layer);
                                this.layer = null;
                            }
                        }
                    };
                    FormMap.execute = function () {
                        return new FormMap();
                    };
                    return FormMap;
                })(event.BaseFormMap);
                event.FormMap = FormMap;
            })(event.event || (event.event = {}));
            var event = event.event;
        })(jtm.event || (jtm.event = {}));
        var event = jtm.event;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));