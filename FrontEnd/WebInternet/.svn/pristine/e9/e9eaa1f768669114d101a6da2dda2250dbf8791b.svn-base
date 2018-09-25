function getObject() {
    return com.jtm.geometry.viewer.widgets.overlap.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (overlap) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.writeLayer = function (geometry, coordinates, srid) {
                                    //                                var thiss = this;
                                    //                                thiss.cleanLayer();
                                    //                                if (geometry === undefined || geometry === null) return;
                                    //                                var coordinatesOriginal = JSON.stringify(coordinates);
                                    //                                geometry.setSpatialReference(thiss.map.spatialReference);
                                    //                                var feature = new esri.Graphic(geometry);
                                    //                                feature.setAttributes({ vertex: '', id: 0, coordinate: coordinatesOriginal, srid: srid });
                                    //                                var id = thiss.getUUID();
                                    //                                feature.setId(id);
                                    //                                thiss.layer.add(feature);
                                    //                                var extent = feature.geometry.getExtent();
                                    //                                thiss.map.setExtent(extent);
                                    //                                thiss.form("", id, {});
                                };
                                this.writeOverlapsMap = function (services, responses, geometry) {
                                    //                                var thiss = this;
                                    //                                var layer = thiss.buildOverlapLayer();
                                    //                                var symbol = null;
                                    //                                var geometryIntersect = null;
                                    //                                var areaIntersect = null;
                                    //                                require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                                    //                                    responses.forEach(function (response, i) {
                                    //                                        symbol = esri.symbol.fromJson(services[i].symbol);
                                    //                                        response.forEach(function (result, j) {
                                    //                                            geometryIntersect = geometryEngine.intersect(geometry, result.feature.geometry);
                                    //                                            if (geometryIntersect !== null)
                                    //                                                areaIntersect = geometryEngine.planarArea(geometryIntersect, "hectares");
                                    //                                            else
                                    //                                                areaIntersect = 0;
                                    //                                            result.feature.setId(services[i].UUID + "_" + (j + 1));
                                    //                                            result.feature.attributes.N = (j + 1);
                                    //                                            result.feature.attributes.AREAINTERSECT = areaIntersect.toFixed(thiss.config.number.decimalLength);
                                    //                                            result.feature.setSymbol(symbol);
                                    //                                            layer.add(result.feature);
                                    //                                        });
                                    //                                    });
                                    //                                });
                                    //                                //var extent = esri.graphicsExtent(layer.graphics);
                                    //                                //thiss.map.setExtent(extent, true);
                                };
                                this.buildOverlapLayer = function () {
                                    //                                var thiss = this;
                                    //                                var layer = new esri.layers.FeatureLayer({
                                    //                                    layerDefinition: {
                                    //                                        geometryType: "esriGeometryAny",
                                    //                                        fields: [{
                                    //                                            name: "N",
                                    //                                            type: "esriFieldTypeString",
                                    //                                            alias: "N"
                                    //                                        }]
                                    //                                    },
                                    //                                    featureSet: null
                                    //                                }, {
                                    //                                    outFields: ["N"],
                                    //                                    showLabels: true
                                    //                                });
                                    //                                var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{N}" }, labelPlacement: "center-center" });
                                    //                                labelClass.symbol = thiss.config.module.widget.symbols["text"]["default"];
                                    //                                layer.setLabelingInfo([labelClass]);
                                    //                                layer.id = "overlap_" + thiss.getUUID();
                                    //                                thiss.map.addLayer(layer);
                                    //                                return layer;
                                };
                            }
                            Widget.prototype.launchView = function () {
                                //                            var thiss = this;
                                //                            _super.prototype.launchView.call(this);
                                //                            thiss.layer = thiss.buildGraphicsLayer();
                            };
                            Widget.prototype.analizeCoordinates = function (coordinates, srid) {
                                //                            var thiss = this;
                                //                            var i = 0;
                                //                            for (i = 0; i < coordinates[0].length; i++) {
                                //                                coordinates[0][i] = thiss.project(coordinates[0][i], srid, thiss.map.spatialReference.wkid);
                                //                            }
                                //                            var geometry = new esri.geometry.Polygon(coordinates);
                                //                            thiss.writeLayer(geometry, coordinates, srid);
                            };
                            Widget.prototype.analizeCoordinatesPoint = function (coordinates, srid) {
                                //                            var thiss = this;
                                //                            var radio = parseFloat(thiss.$txtRadio.val()) * Widget.KILOMETER;
                                //                            coordinates = thiss.project(coordinates, srid, thiss.map.spatialReference.wkid);
                                //                            var point = new esri.geometry.Point(coordinates, thiss.map.spatialReference);
                                //                            var geometry = new esri.geometry.Circle({
                                //                                center: point,
                                //                                radius: radio
                                //                            });
                                //                            thiss.writeLayer(geometry, coordinates, srid);
                            };
                            Widget.prototype.searchOverlaps = function (dom, id) {
                            };
                            Widget.prototype.removeOverlaps = function () {
                            };
                            Widget.prototype.cleanLayer = function () {
                            };
                            Widget.prototype.cleanControls = function () {
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(overlap.BaseWidget);
                        overlap.Widget = Widget;
                    })(widgets.overlap || (widgets.overlap = {}));
                    var overlap = widgets.overlap;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));