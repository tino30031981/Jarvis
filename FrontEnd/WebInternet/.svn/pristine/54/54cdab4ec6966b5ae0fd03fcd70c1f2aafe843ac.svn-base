function getObject() {
    return com.jtm.geometry.viewer.widgets.measure.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (measure) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.calculatePoint = function (geometry) {
                                    var thiss = this;
                                    thiss.layer.clear();
                                    var sridTo = thiss.$ddlSpatialReference.val();
                                    var toProj = proj4('EPSG:' + sridTo);
                                    var fromProj = proj4('EPSG:' + thiss.map.spatialReference.wkid);
                                    var coordinates = (proj4(fromProj, toProj).forward([geometry.x, geometry.y]));
                                    var html = "<p><b>Este (X): </b>" + coordinates[0].toFixed(3) + " <b><br />Norte (Y): </b>" + coordinates[1].toFixed(3) + "</p>";
                                    thiss.$result.html(html);
                                    var graphic = new esri.Graphic(geometry);
                                    thiss.layer.add(graphic);
                                };
                                this.calculateLength = function (geometry) {
                                    var thiss = this;
                                    thiss.layer.clear();
                                    require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                                        var length = geometryEngine.geodesicLength(geometry, thiss.$ddlMeasureUnitLength.val());
                                        var html = "<p><b>Longitud</b> :" + length.toFixed(3) + " " + thiss.$ddlMeasureUnitLength.find(':selected').text() + ". </p>";
                                        thiss.$result.html(html);
                                        var graphic = new esri.Graphic(geometry);
                                        thiss.layer.add(graphic);
                                    });
                                };
                                this.calculateArea = function (geometry) {
                                    var thiss = this;
                                    thiss.layer.clear();
                                    require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                                        var area = geometryEngine.geodesicArea(geometry, thiss.$ddlMeasureUnitArea.val());
                                        var length = geometryEngine.geodesicLength(geometry, thiss.$ddlMeasureUnitLength.val());
                                        var html = "<p><b>Longitud</b> :" + length.toFixed(3) + " " + thiss.$ddlMeasureUnitLength.find(':selected').text() + ". </p>";
                                        html += "<p><b>&Aacute;rea</b> :" + area.toFixed(3) + " " + thiss.$ddlMeasureUnitArea.find(':selected').text() + ". </p>";
                                        thiss.$result.html(html);
                                        var graphic = new esri.Graphic(geometry);
                                        thiss.layer.add(graphic);
                                    });
                                };
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.setFillSymbol(thiss.config.module.widget.symbols.polygon.default);
                                thiss.draw.setLineSymbol(thiss.config.module.widget.symbols.polyline.default);
                                thiss.draw.setMarkerSymbol(thiss.config.module.widget.symbols.point.default);
                                thiss.draw.deactivate();
                                thiss.layer = new esri.layers.GraphicsLayer({
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layer);
                                thiss.$btnPoint.off('click');
                                thiss.$btnPoint.on("click", function (e) {
                                    thiss.map.setInfoWindowOnClick(false);
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.show();
                                    thiss.$fdsMeasureUnitLength.hide();
                                    thiss.$fdsMeasureUnitArea.hide();
                                    thiss.draw.activate(esri.toolbars.Draw.POINT);
                                });
                                thiss.$btnPolyline.off('click');
                                thiss.$btnPolyline.on("click", function (e) {
                                    thiss.map.setInfoWindowOnClick(false);
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.hide();
                                    thiss.$fdsMeasureUnitLength.show();
                                    thiss.$fdsMeasureUnitArea.hide();
                                    thiss.draw.activate(esri.toolbars.Draw.POLYLINE);
                                });
                                thiss.$btnPolygon.off('click');
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.map.setInfoWindowOnClick(false);
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.hide();
                                    thiss.$fdsMeasureUnitLength.show();
                                    thiss.$fdsMeasureUnitArea.show();
                                    thiss.draw.activate(esri.toolbars.Draw.POLYGON);
                                });
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.map.setInfoWindowOnClick(true);
                                    thiss.draw.deactivate();
                                    switch (e.geometry.type) {
                                        case "point":
                                            thiss.calculatePoint(e.geometry);
                                            break;
                                        case "polyline":
                                            thiss.calculateLength(e.geometry);
                                            break;
                                        case "polygon":
                                            thiss.calculateArea(e.geometry);
                                            break;
                                        default:
                                    }
                                });
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                if (this.draw !== null)
                                    this.draw.deactivate();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(measure.BaseWidget);
                        measure.Widget = Widget;
                    })(widgets.measure || (widgets.measure = {}));
                    var measure = widgets.measure;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));