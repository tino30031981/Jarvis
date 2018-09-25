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
                                    var coordinates = geometry.getCoordinates();
                                    var srid = parseInt(thiss.$ddlSpatialReference.val());
                                    if (srid == Widget.DDLVALUEDEFAULT) {
                                        alert("Seleccione la referencia espacial");
                                        return;
                                    }
                                    var sridEPSG = 'EPSG:' + srid;
                                    var spatialReference = ol.proj.get(sridEPSG);
                                    var mapProjection = thiss.map.getView().getProjection();
                                    coordinates = ol.proj.transform(coordinates, mapProjection, spatialReference);

                                    if (srid != Widget.SRIDDEFAULTGPS) {
                                        coordinates[0] = coordinates[0].toFixed(thiss.config.number.decimalCount);
                                        coordinates[1] = coordinates[1].toFixed(thiss.config.number.decimalCount);
                                    }
                                    else {
                                        coordinates[0] = thiss.convertDDToDMSString(coordinates[0], true);
                                        coordinates[1] = thiss.convertDDToDMSString(coordinates[1], false);
                                    }
                                    var html = '<p><b>srid</b>: ' + sridEPSG + '</p>';
                                    html += '<p><b>Este (X)</b>: ' + coordinates[0] + '</p>';
                                    html += '<p><b>Norte (Y)</b>: ' + coordinates[1] + '</p>';
                                    thiss.$result.html(html);
                                };
                                this.calculateLength = function (geometry) {
                                    var thiss = this;
                                    var html = '<p><b>Longitud</b>: ' + thiss.getLength(geometry) + '</p>';
                                    thiss.$result.html(html);
                                };
                                this.calculateArea = function (geometry) {
                                    var thiss = this;
                                    var area = Math.round(geometry.getArea() * 100) / 100;
                                    var html2 = '<p><b>Longitud</b>: ' + thiss.getLength(geometry) + '</p>';
                                    var html = '<p><b>Área</b>: ' + calculate(area) + '</p>';
                                    thiss.$result.html(html2 + html);
                                    function calculate(area) {
                                        var measureUnit = thiss.$ddlMeasureUnitArea.val();
                                        switch (measureUnit) {
                                            case "109404":
                                                return operation(1, "m", true);
                                            case "109414":
                                                return operation(0.000001, "km", true);
                                            case "109402":
                                                return operation(0.000247105, "acres", false);
                                            case "109401":
                                                return operation(0.0001, "has", false);
                                            case "109451":
                                                return operation(10000, "cm", true);
                                            case "109450":
                                                return operation(100, "dm", true);
                                            case "109405":
                                                return operation(10.7639, "pies", true);
                                            case "109439":
                                                return operation(1550, "pulgadas", true);
                                            case "109439":
                                                return operation(3.86102e-7, "millas", true);
                                            case "109452":
                                                return operation(1000000, "mm", true);
                                            case "109442":
                                                return operation(1.19599, "yardas", true);
                                            default:
                                                return "Not supported";
                                        }
                                        function operation(factor, symbol, isSup) {
                                            return String((Math.round(area * factor * 100) / 100)) + " " + symbol + (isSup === true ? "<sup>2</sup>" : "");
                                        }
                                    }
                                };
                                this.getLength = function (geometry) {
                                    var thiss = this;
                                    var length = Math.round(geometry.getLength() * 100) / 100;
                                    return calculate(length);
                                    function calculate(length) {
                                        var measureUnit = thiss.$ddlMeasureUnitLength.val();
                                        switch (measureUnit) {
                                            case "9001":
                                                return operation(1, "m");
                                            case "9036":
                                                return operation(1000, "km");
                                            case "9002":
                                                return operation(3.2808, "pies");
                                            case "9030":
                                                return operation(0.000539957, "mn");
                                            case "9093":
                                                return operation(0.000621371192237, "mlls");
                                            case "109012":
                                                return operation(0.00053996, "us mn");
                                            default:
                                                return "Not supported";
                                        }
                                        function operation(factor, symbol) {
                                            return String((Math.round(length / factor * 100) / 100)) + " " + symbol;
                                        }
                                    }
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
                                thiss.map.addLayer(thiss.layer);
                                thiss.draw = new ol.interaction.Draw({
                                    source: thiss.layer.getSource()
                                });
                                //thiss.map.addInteraction(thiss.draw);
                                thiss.$btnPoint.off('click');
                                thiss.$btnPoint.on("click", function (e) {
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.show();
                                    thiss.$fdsMeasureUnitLength.hide();
                                    thiss.$fdsMeasureUnitArea.hide();
                                    addInteraction('Point');
                                });
                                thiss.$btnPolyline.off('click');
                                thiss.$btnPolyline.on("click", function (e) {
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.hide();
                                    thiss.$fdsMeasureUnitLength.show();
                                    thiss.$fdsMeasureUnitArea.hide();
                                    addInteraction('LineString');
                                });
                                thiss.$btnPolygon.off('click');
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.$result.empty();
                                    thiss.$fdsSpatialReference.hide();
                                    thiss.$fdsMeasureUnitLength.show();
                                    thiss.$fdsMeasureUnitArea.show();
                                    addInteraction('Polygon');
                                });
                                thiss.$ddlSpatialReference.off("change").on("change", function (e) {
                                    if (thiss.feature === null) return;
                                    thiss.calculatePoint(thiss.feature.getGeometry());
                                });
                                thiss.$ddlMeasureUnitLength.off("change").on("change", function (e) {
                                    if (thiss.feature === null) return;
                                    thiss.calculateLength(thiss.feature.getGeometry());
                                });
                                thiss.$ddlMeasureUnitArea.off("change").on("change", function (e) {
                                    if (thiss.feature === null) return;
                                    thiss.calculateArea(thiss.feature.getGeometry());
                                });
                                //thiss.map.on("click",function(e){});
                                jQuery(thiss.map.getViewport()).on("click", function (e) {
                                    thiss.$result.empty();
                                    if (thiss.feature === null) return;
                                    var type = (thiss.feature.getGeometry().getType());
                                    switch (type) {
                                        case "Point":
                                            thiss.calculatePoint(thiss.feature.getGeometry());
                                            break;
                                        case "LineString":
                                            thiss.calculateLength(thiss.feature.getGeometry());
                                            break;
                                        case "Polygon":
                                            thiss.calculateArea(thiss.feature.getGeometry());
                                            break;
                                        default:
                                    }
                                });
                                jQuery(thiss.map.getViewport()).on('mousemove', function (e) {
                                    if (thiss.feature === null) return;
                                    var type = (thiss.feature.getGeometry().getType());
                                    switch (type) {
                                        case "Point":
                                            break;
                                        case "LineString":
                                            thiss.calculateLength(thiss.feature.getGeometry());
                                            break;
                                        case "Polygon":
                                            thiss.calculateArea(thiss.feature.getGeometry());
                                            break;
                                        default:
                                    }
                                });
                                function addInteraction(type) {
                                    thiss.feature = null;
                                    removeInteraction();
                                    thiss.draw = new ol.interaction.Draw({
                                        source: thiss.layer.getSource(),
                                        type: type
                                    });
                                    thiss.map.addInteraction(thiss.draw);
                                    thiss.draw.on('drawstart', function (e) {
                                        thiss.layer.getSource().clear();
                                        thiss.feature = e.feature;
                                        thiss.$result.empty();
                                    }, this);
                                    thiss.draw.on('drawend', function (e) {
                                        removeInteraction();
                                    }, this);
                                }
                                function removeInteraction() {
                                    if (thiss.draw !== null)
                                        thiss.map.removeInteraction(thiss.draw);
                                }
                            };
                            Widget.prototype.cleanControls = function () {
                                this.map.removeInteraction(this.draw);
                                if (this.infoWindow !== null)
                                    this.map.removeOverlay(this.infoWindow);
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
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