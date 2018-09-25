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
                                    var thiss = this;
                                    thiss.cleanLayer();
                                    if (geometry === undefined || geometry === null) return;
                                    var coordinatesOriginal = JSON.stringify(coordinates);
                                    geometry.setSpatialReference(thiss.map.spatialReference);
                                    var feature = new esri.Graphic(geometry);
                                    feature.setAttributes({ vertex: '', id: 0, coordinate: coordinatesOriginal, srid: srid });
                                    var id = thiss.getUUID();
                                    feature.setId(id);
                                    thiss.layer.add(feature);
                                    var extent = feature.geometry.getExtent();
                                    thiss.map.setExtent(extent, true);
                                    thiss.form(null, id, {});
                                };
                                this.writeOverlapsMap = function (services, responses, geometry) {
                                    var thiss = this;
                                    var layer = thiss.buildOverlapLayer();
                                    var symbol = null;
                                    var geometryIntersect = null;
                                    var areaIntersect = null;
                                    require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                                        responses.forEach(function (response, i) {
                                            symbol = esri.symbol.fromJson(services[i].symbol);
                                            response.forEach(function (result, j) {
                                                geometryIntersect = geometryEngine.intersect(geometry, result.feature.geometry);
                                                if (geometryIntersect !== null)
                                                    areaIntersect = geometryEngine.planarArea(geometryIntersect, "hectares");
                                                else
                                                    areaIntersect = 0;
                                                result.feature.setId(services[i].UUID + "_" + (j + 1));
                                                result.feature.attributes.N = (j + 1);
                                                result.feature.attributes.AREAINTERSECT = areaIntersect.toFixed(thiss.config.number.decimalLength);
                                                result.feature.setSymbol(symbol);
                                                layer.add(result.feature);
                                            });
                                        });
                                    });
                                    //var extent = esri.graphicsExtent(layer.graphics);
                                    //thiss.map.setExtent(extent, true);
                                };
                                this.buildOverlapLayer = function () {
                                    var thiss = this;
                                    var layer = new esri.layers.FeatureLayer({
                                        layerDefinition: {
                                            geometryType: "esriGeometryAny",
                                            fields: [{
                                                name: "N",
                                                type: "esriFieldTypeString",
                                                alias: "N"
                                            }]
                                        },
                                        featureSet: null
                                    }, {
                                            outFields: ["N"],
                                            showLabels: true
                                        });
                                    var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{N}" }, labelPlacement: "center-center" });
                                    labelClass.symbol = thiss.config.module.widget.symbols["text"]["default"];
                                    layer.setLabelingInfo([labelClass]);
                                    layer.id = "overlap_" + thiss.getUUID();
                                    thiss.map.addLayer(layer);
                                    return layer;
                                };
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = thiss.buildGraphicsLayer();
                            };
                            Widget.prototype.analizeCoordinates = function (coordinates, srid) {
                                var thiss = this;
                                var i = 0;
                                for (i = 0; i < coordinates[0].length; i++) {
                                    coordinates[0][i] = thiss.project(coordinates[0][i], srid, thiss.map.spatialReference.wkid);
                                }
                                var geometry = new esri.geometry.Polygon(coordinates);
                                thiss.writeLayer(geometry, coordinates, srid);
                            };
                            Widget.prototype.analizeCoordinatesPoint = function (coordinates, srid) {
                                var thiss = this;
                                var radio = parseFloat(thiss.$txtRadio.val()) * Widget.KILOMETER;
                                coordinates = thiss.project(coordinates, srid, thiss.map.spatialReference.wkid);
                                var point = new esri.geometry.Point(coordinates, thiss.map.spatialReference);
                                var geometry = new esri.geometry.Circle({
                                    center: point,
                                    radius: radio
                                });
                                thiss.writeLayer(geometry, coordinates, srid);
                            };
                            Widget.prototype.searchOverlaps = function (dom, id) {
                                var thiss = this;
                                var g = thiss.layer.getFeatureById(id);
                                if (g.geometry == null) {
                                    toastr.info("No existe el elemento en el mapa");
                                    return;
                                }
                                var services = thiss.getServices();
                                if (services.length === 0) {
                                    toastr.info("Seleccione las capas a superponer");
                                    return;
                                } else if (services.length > 10) {
                                    toastr.info("Seleccionar máximo 10 capas a consultar");
                                    return;
                                }
                                var itemsPromise = [];
                                services.forEach(function (service) {
                                    var parameters = new esri.tasks.IdentifyParameters();
                                    parameters.geometry = g.geometry;
                                    parameters.mapExtent = thiss.map.extent;
                                    parameters.tolerance = 0;
                                    parameters.returnGeometry = true;
                                    parameters.layerIds = [service.layerId];
                                    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                                    parameters.width = thiss.map.width;
                                    parameters.height = thiss.map.height;
                                    var task = new esri.tasks.IdentifyTask(service.url);
                                    itemsPromise.push(task.execute(parameters));
                                });
                                var promises = dojo.promise.all(itemsPromise);
                                promises.then(function (responses) {
                                    thiss.writeOverlapsMap(services, responses, g.geometry);
                                    setTimeout(function () {
                                        thiss.writeOverlapsAlphanumeric(dom, services, responses);
                                    }, 2000);
                                });
                            };
                            Widget.prototype.removeOverlaps = function () {
                                var thiss = this;
                                var layer = null;
                                thiss.map.graphicsLayerIds.forEach(function (layerId) {
                                    if (layerId !== undefined && layerId !== null && layerId.startsWith("overlap_") === true) {
                                        layer = thiss.map.getLayer(layerId);
                                        thiss.map.removeLayer(layer);
                                        layer = null;
                                    }
                                });
                            };
                            Widget.prototype.identify = function () {
                                var thiss = this;
                                thiss.map.infoWindow.hide();
                                this.layerOnClick = thiss.layer.on("click", function (e) {
                                    console.log(e.graphic);
                                    var content = '<table>';
                                    //if (data.features.length === 0) return;
                                    //data.features.forEach(function (feature) {
                                    //    content += "<tr><td>" + feature.attributes.variablename + " : </td><td> <b>" + feature.attributes.value + "</b></td></tr>";
                                    //});
                                    content += '</table>';
                                    thiss.map.infoWindow.setTitle('Servicios');
                                    thiss.map.infoWindow.setContent(content);
                                    thiss.map.infoWindow.show(e.graphic.geometry.getCentroid());
                                    thiss.layerOnClick.remove();
                                });
                            };
                            Widget.prototype.cleanLayer = function () {
                                if (this.layer !== null)
                                    this.layer.clear();
                            };
                            Widget.prototype.cleanControls = function () {
                                var thiss = this;
                                _super.prototype.cleanControls.call(this);
                                if (this.layer !== null) {
                                    this.map.removeLayer(this.layer);
                                    this.layer = null;
                                }
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