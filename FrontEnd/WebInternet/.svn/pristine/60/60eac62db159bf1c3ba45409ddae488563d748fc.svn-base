function getInstance() {
    return com.jtm.geometry.geophoto.FormMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (geophoto) {
                var FormMap = (function (_super) {
                    __extends(FormMap, _super);
                    function FormMap() {
                        _super.call(this);
                        this.addGeometryToLayer = function (layer, geometry) {
                            var srid = this.$ddlSpatialReference.int32();
                            var geometryView = this.transform(geometry, srid);
                            var geometryMap = this.transform(geometry, this.map.getView().getProjection().getWKID());
                            var geometryDB = this.transform(geometry, FormMap.SRIDDEFAULTAPP);
                            var feature = new ol.Feature({
                                geometry: new ol.geom.Point(geometryMap.coordinates)
                            });
                            feature.setId(0);
                            feature.setProperties({ 'geometryy': JSON.stringify(geometryDB) });
                            layer.getSource().addFeature(feature);
                            var extent = feature.getGeometry().getExtent();
                            this.map.getView().fit(extent, this.map.getSize(), { maxZoom: 10 });
                            this.$txtX.val(srid === FormMap.SRIDDEFAULTGPS ? geometryView.coordinates[0] : geometryView.coordinates[0].toFixed(this.config.number.decimalCount));
                            this.$txtY.val(srid === FormMap.SRIDDEFAULTGPS ? geometryView.coordinates[1] : geometryView.coordinates[1].toFixed(this.config.number.decimalCount));
                            //this.$txtZ.val(geometry.extraData.accuracy.toFixed(2));
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
                    FormMap.prototype.callbackCapturePoint = function (geometry) {
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
                        this.cleanLayerDraw(toNull);
                    };
                    FormMap.execute = function () {
                        return new FormMap();
                    };
                    return FormMap;
                })(geophoto.BaseFormMap);
                geophoto.FormMap = FormMap;
            })(geometry.geophoto || (geometry.geophoto = {}));
            var geophoto = geometry.geophoto;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));