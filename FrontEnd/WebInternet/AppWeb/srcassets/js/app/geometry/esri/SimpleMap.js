function getInstance() {
    return com.jtm.geometry.SimpleMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var SimpleMap = (function (_super) {
                __extends(SimpleMap, _super);
                function SimpleMap() {
                    _super.call(this);
                    this.defaultBaseMap = "osm";
                    this.layerOnClick = null;
                    this.layerOnMouseOver = null;
                    this.layerOnMouseOut = null;
                    this.zoomByDelta = function (delta) {
                        var zoom = this.map.getZoom();
                        this.map.setZoom(zoom - delta);
                    };
                    this.calculateArea = function (geometry, unitType) {
                        unitType = unitType || "hectares";
                        require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                            return geometryEngine.planarArea(geometry, unitType);
                        });
                    };
                    this.calculateLength = function (geometry, unitType) {
                        unitType = unitType || "kilometers";
                        require(["esri/geometry/geometryEngine"], function (geometryEngine) {
                            return geometryEngine.planarLength(geometry, unitType);
                        });
                    };
                }
                SimpleMap.prototype.reposition = function () {
                    var thiss = this;
                    if (thiss.map !== null)
                        thiss.map.reposition();
                };
                SimpleMap.prototype.parseSymbols = function () {
                    var thiss = this;
                    if (thiss.config.module.map.symbols === undefined || thiss.config.module.map.symbols === null) return;
                    var textStyle = new esri.symbol.TextSymbol();
                    textStyle.setColor(new esri.Color([0, 0, 0, 1]));
                    textStyle.setVerticalAlignment('middle');
                    textStyle.font.setSize("12px");
                    textStyle.font.setFamily("Calibri,sans-serif");
                    thiss.config.module.map.symbols = {
                        "point": {
                            "default": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.default),
                            "highlight": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.highlight),
                            "selection": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.selection)
                        },
                        "polyline": {
                            "default": new esri.symbol.SimpleLineSymbol(thiss.config.module.map.symbols.polyline.default),
                            "highlight": new esri.symbol.SimpleLineSymbol(thiss.config.module.map.symbols.polyline.highlight),
                            "selection": new esri.symbol.SimpleLineSymbol(thiss.config.module.map.symbols.polyline.selection)
                        },
                        "polygon": {
                            "default": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.default),
                            "highlight": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.highlight),
                            "selection": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.selection)
                        },
                        "multipoint": {
                            "default": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.default),
                            "highlight": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.highlight),
                            "selection": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.map.symbols.point.selection)
                        },
                        "extent": {
                            "default": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.default),
                            "highlight": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.highlight),
                            "selection": new esri.symbol.SimpleFillSymbol(thiss.config.module.map.symbols.polygon.selection)
                        },
                        "text": {
                            "default": textStyle,
                            "highlight": textStyle,
                            "selection": textStyle
                        }
                    };
                    thiss.config.module.map.symbols.text.default.font.setSize("12pt");
                    thiss.config.module.map.symbols.text.default.font.setFamily("arial");
                };
                SimpleMap.prototype.initialExtent = function (map) {
                    var thiss = this;
                    _super.prototype.initialExtent.call(this, map);
                    var layer = null;
                    var layerId = 'scope';
                    if (thiss.config.module.map.initialBoundingBox == "initialExtent") {
                        var extent = new esri.geometry.Extent(thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum, thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum, new esri.SpatialReference({ wkid: thiss.config.module.map.projectionCode }));
                        //map.on("load", function (e) {
                        //    map.showZoomSlider();
                        //    map.setExtent(extent, true);
                        //    map.setInitialExtent(extent);
                        //});
                        layer = new esri.layers.GraphicsLayer();
                        layer.id = layerId;
                        layer.on("graphic-add", function (e) {
                            map.setExtent(esri.graphicsExtent(layer.graphics), true);
                        });
                        layer.add(new esri.Graphic(esri.geometry.Polygon.fromExtent(extent)));
                    }
                    else if (thiss.config.module.map.initialBoundingBox == "scopeLayer") {
                        layer = new esri.layers.FeatureLayer(thiss.config.module.map.scopeLayer, {
                            mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                        });
                        layer.id = layerId;
                        layer.on("update-end", function (e) {
                            thiss.map.setExtent(esri.graphicsExtent(layer.graphics), true, function (e) {
                                layer.redraw();
                            });
                        });
                    }
                    map.addLayer(layer);
                };
                SimpleMap.prototype.addToolbar = function () {
                    this.$toolbar.appendTo(this.$map.find('>div.esriMapContainer'));
                };
                SimpleMap.prototype._addDom = function ($dom) {
                    this.$map.find('>div.esriMapContainer').append($dom);
                };
                SimpleMap.prototype.newMap = function (dom, height) {
                    var thiss = this;
                    _super.prototype.newMap.call(this, dom, height);
                    var spatialReference = new esri.SpatialReference({ wkid: thiss.config.module.map.projectionCode });
                    var extent = new esri.geometry.Extent(thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum, thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum, spatialReference);
                    var map = new esri.Map(thiss.$map[0], {
                        smartNavigation: false,
                        isZoomSlider: false,
                        logo: false,
                        autoResize: true,
                        showLabels: true,
                        basemap: thiss.defaultBaseMap,
                        zoom: 0,
                        slider: false,
                        wrapAround180: false
                    });
                    map.spatialReference = spatialReference;
                    thiss.setServices(map);
                    map.hideZoomSlider();
                    map.enableScrollWheelZoom();
                    map.enableKeyboardNavigation();
                    map.enableMapNavigation();
                    map.on("load", function (e) {
                        map.spatialReference = spatialReference;
                        map.showZoomSlider();
                        map.setExtent(extent, true);
                        map.setInitialExtent(extent);
                        map.removeDefaultBaseMap();
                        thiss.setToolbar();
                    });
                    return map;
                };
                SimpleMap.prototype.transformGeometry = function (geometry, toSRID) {
                    var thiss = this;
                    geometry.spatialReference = thiss.map.spatialReference;
                    var type = geometry.type;
                    var fromSRID = geometry.spatialReference.wkid;
                    var coordinates = [];
                    if (type === "point") {
                        coordinates.push(geometry.x);
                        coordinates.push(geometry.y);
                        coordinates = thiss.project(coordinates, fromSRID, toSRID);
                        geometry.x = coordinates[0];
                        geometry.y = coordinates[1];
                    }
                    else if (type === "polyline") {
                        coordinates = geometry.paths;
                        for (var i = 0; i < coordinates[0].length; i++)
                            coordinates[0][i] = thiss.project(coordinates[0][i], fromSRID, toSRID);
                        geometry.paths = coordinates;
                    }
                    else if (type === "polygon") {
                        coordinates = geometry.rings;
                        for (var i = 0; i < coordinates[0].length; i++)
                            coordinates[0][i] = thiss.project(coordinates[0][i], fromSRID, toSRID);
                        geometry.rings = coordinates;
                    }
                    geometry.spatialReference = new esri.SpatialReference(toSRID);
                    return geometry;
                };
                SimpleMap.prototype.build = function (dom, height) {
                    var thiss = this;
                    thiss.map = thiss.newMap(dom, height);
                    thiss.layerScope = thiss.buildGraphicsLayer();
                    thiss.layerGeolocation = thiss.buildGraphicsLayer();
                    //thiss.initialExtent(thiss.map);
                    thiss.layer = thiss.buildFeatureLayer();
                    thiss.layerSelected = thiss.buildFeatureLayer();
                };
                SimpleMap.prototype.buildGraphicsLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? 'n' : options.label;
                    options.style = options.style || thiss.config.module.map.symbols;
                    var layer = new esri.layers.GraphicsLayer({
                        style: function (feature, resolution) {
                            return options.style[feature.geometry.type]["default"];
                        }
                    });
                    /*var layer = new esri.layers.FeatureLayer({
                        layerDefinition: {
                            geometryType: "esriGeometryAny",
                            fields: []
                        },
                        featureSet: null
                    }, {
                        //outFields: [options.label],
                        showLabels: false,
                        style: function (feature, resolution) {
                            return thiss.config.module.map.symbols[feature.geometry.type]["default"];
                        }
                    });*/
                    layer.id = thiss.getUUID();
                    layer.on("graphic-add", function (e) {
                        var extent = esri.graphicsExtent(layer.graphics);
                        if (extent === null) return;
                        window.setTimeout(function () {
                            thiss.map.setExtent(extent, true);
                        }, 500);
                    });
                    layer.on("renderer-change", function (e) {
                    });
                    console.log(layer);
                    thiss.map.addLayer(layer);
                    return layer;
                };
                SimpleMap.prototype.buildFeatureLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? SimpleMap.LABELLAYER : options.label;
                    options.labelType = String.isNullOrWhiteSpace(options.labelType) ? 'esriFieldTypeInteger' : options.labelType;
                    options.labelPlacement = String.isNullOrWhiteSpace(options.labelType) ? "center-center" : options.labelPlacement;
                    options.style = options.style || thiss.config.module.map.symbols;
                    var layer = new esri.layers.FeatureLayer({
                        layerDefinition: {
                            geometryType: "esriGeometryAny",
                            fields: [{
                                name: options.label,
                                type: options.labelType,
                                alias: options.label
                            }]
                        },
                        featureSet: null
                    }, {
                        outFields: [options.label],
                        showLabels: true,
                        style: function (feature, resolution) {
                            return thiss.config.module.map.symbols[feature.geometry.type]["default"];
                        }
                    });
                    layer.id = thiss.getUUID();
                    var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{" + options.label + "}" }, labelPlacement: options.labelPlacement });
                    labelClass.symbol = thiss.config.module.map.symbols["text"]["default"];
                    layer.setLabelingInfo([labelClass]);
                    /*layer.on("graphic-add", function (e) {
                        var extent = esri.graphicsExtent(layer.graphics);
                        if (extent === null) return;
                        window.setTimeout(function () {
                            thiss.map.setExtent(extent, true);
                        }, 1000);
                    });*/
                    console.log(layer);
                    thiss.map.addLayer(layer);
                    return layer;
                };
                SimpleMap.prototype.selectedFeature = function (id, addVertex) {
                    var thiss = this;
                    addVertex = typeof addVertex === 'boolean' ? addVertex : true;
                    thiss.layerSelected.clear();
                    var g = thiss.layer.getFeatureById(id);
                    if (g == null) return;
                    var feature = new esri.Graphic(g.geometry);
                    feature.setAttributes(g.attributes);
                    feature.attributes[SimpleMap.LABELLAYER] = '';
                    feature.setSymbol(thiss.config.module.map.symbols[g.geometry.type]["selection"]);
                    feature.setId(id);
                    thiss.layerSelected.add(feature);
                    //console.log('g');
                    //console.log(g);
                    if (g.type === SimpleMap.ESRITYPES.POINT) return;
                    if (addVertex === true) {
                        var graphic = null;
                        feature.geometry.coordinates = feature.geometry.rings instanceof Array ? feature.geometry.rings : feature.geometry.paths;
                        for (var i = 0; i < feature.geometry.coordinates[0].length; i++) {
                            if (i < feature.geometry.coordinates[0].length - 1) {
                                graphic = new esri.Graphic(new esri.geometry.Point(feature.geometry.coordinates[0][i], g.geometry.spatialReference));
                                graphic.attributes = {};
                                graphic.attributes[SimpleMap.LABELLAYER] = i + 1;
                                graphic.setSymbol(thiss.config.module.map.symbols[graphic.geometry.type]["selection"]);
                                thiss.layerSelected.add(graphic);
                            }
                        }
                        delete feature.geometry.coordinates;
                    }
                    var extent = g.geometry.getExtent();
                    thiss.map.setExtent(extent, true);
                };
                SimpleMap.prototype._addFeature = function (layer, json) {
                    layer.clear();
                    if (json === undefined || json === null || json.features === undefined || json.features === null) return;
                    var graphic = null;
                    json.features.forEach(function (feature) {
                        console.log(feature);
                        var id = feature.attributes.id;
                        feature.attributes[SimpleMap.LABELLAYER] = '';
                        if (id === undefined || id === null)
                            id = 0;
                        graphic = new esri.Graphic(feature);
                        graphic.setId(id);
                        layer.add(graphic);
                    });
                };
                SimpleMap.prototype.addFeatures = function (json, addVertex) {
                    var thiss = this;
                    _super.prototype.addFeatures.call(this, json, addVertex);
                    addVertex = typeof addVertex === 'boolean' ? addVertex : true;
                    thiss.layer.clear();
                    thiss._addFeature(thiss.layer, json);
                    //if (json !== null && addVertex === true) {
                    //    if (json.geometryType === SimpleMap.ESRITYPES.POINT) return;
                    //    var graphic = null;
                    //    json.features.forEach(function (feature) {
                    //        feature.geometry.coordinates = feature.geometry.rings instanceof Array ? feature.geometry.rings : feature.geometry.paths;
                    //        for (var i = 0; i < feature.geometry.coordinates[0].length - 1; i++) {
                    //            graphic = new esri.Graphic(new esri.geometry.Point(feature.geometry.coordinates[0][i], new esri.SpatialReference(json.spatialReference.wkid)));
                    //            graphic.attributes = {};
                    //            graphic.attributes[SimpleMap.LABELLAYER] = i + 1;
                    //            thiss.layer.add(graphic);
                    //        }
                    //        delete feature.geometry.coordinates;
                    //    });
                    //    graphic = null;
                    //}
                    var extent = esri.graphicsExtent(thiss.layer.graphics);
                    if (extent !== null)
                        thiss.map.setExtent(extent, true);
                };
                SimpleMap.prototype.removeLayers = function (toNull) {
                    _super.prototype.resetContainers.call(this, toNull);
                    if (this.layer !== null) {
                        this.layer.clear();
                        if (toNull === true) {
                            this.map.removeLayer(this.layer);
                            this.layer = null;
                        }
                    }
                    if (this.layerSelected !== null) {
                        this.layerSelected.clear();
                        if (toNull === true) {
                            this.map.removeLayer(this.layerSelected);
                            this.layerSelected = null;
                        }
                    }
                };
                SimpleMap.prototype.drawPoint = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POINT);
                };
                SimpleMap.prototype.drawRectangle = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.RECTANGLE);
                };
                SimpleMap.prototype.drawPolyline = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POLYLINE);
                };
                SimpleMap.prototype.drawPolygon = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POLYGON);
                };
                SimpleMap.prototype.drawPolygonFreeHand = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
                };
                SimpleMap.prototype.drawCircle = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.CIRCLE);
                };
                SimpleMap.prototype.drawEllipse = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.ELLIPSE);
                };
                SimpleMap.prototype.extentResult = function () {
                    var thiss = this;
                    //console.log('entra2');
                    var extent = esri.graphicsExtent(thiss.layer.graphics);
                    if (extent === null) return;
                    window.setTimeout(function () {
                        thiss.map.setExtent(extent, true);
                    }, 1000);
                    //this.layer.emit("graphic-add", { bubbles: true, cancelable: true });
                };
                SimpleMap.prototype.sincLayer2Dom = function (layer, dom, joinField) {
                    var thiss = this;
                    if (this.layerOnClick !== null)
                        this.layerOnClick.remove();
                    this.layerOnClick = layer.on("click", function (e) {
                        thiss.onMouseClickGraphicToElement(e);
                    });
                    if (this.layerOnMouseOver !== null)
                        this.layerOnMouseOver.remove();
                    this.layerOnMouseOver = layer.on("mouse-over", function (e) {
                        thiss.onMouseOverGraphicToElement(e, dom, joinField);
                    });
                    if (this.layerOnMouseOut !== null)
                        this.layerOnMouseOut.remove();
                    this.layerOnMouseOut = layer.on("mouse-out", function (e) {
                        thiss.onMouseOutGraphicToElement(e, dom);
                    });
                };
                SimpleMap.prototype.sincDom2Layer = function (dom, layer, joinField) {
                    var thiss = this;
                    jQuery(dom).on('mouseover', function () {
                        thiss.onMouseOverElementToGrahic(this, layer, joinField);
                    });
                    jQuery(dom).on('mouseleave', function () {
                        thiss.onMouseOutElementToGrahic(this, layer);
                    });
                    jQuery(dom).on('dblclick doubletap', function () {
                        thiss.onMouseDoubleClickElementToGraphic(this, layer, joinField);
                    });
                };
                SimpleMap.prototype.callbackExtent = function () {
                    this.map.setExtent(this.map.initialExtent, true);
                };
                SimpleMap.prototype.callbackZoomIn = function () {
                    this.zoomByDelta(-1);
                };
                SimpleMap.prototype.callbackZoomOut = function () {
                    this.zoomByDelta(1);
                };
                SimpleMap.prototype.capturePoint = function (options, callback) {
                    var thiss = this;
                    options = options || {};
                    var mapClick = thiss.map.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        var geometry = {
                            x: e.mapPoint.x,
                            y: e.mapPoint.y,
                            spatialReference: { id: e.mapPoint.spatialReference.wkid }
                        };
                        if (typeof callback === "function")
                            callback(geometry);
                        mapClick.remove();
                    });
                };
                SimpleMap.prototype.setCorsServers = function (items) {
                    if (items !== undefined && items !== null && items instanceof Array)
                        for (i = 0; i < items.length; i++)
                            esri.config.defaults.io.corsEnabledServers.push(items[i]);
                };
                SimpleMap.prototype.setProxy = function (proxy) {
                    if (String.isNullOrWhiteSpace(proxy) !== true) {
                        esri.config.defaults.io.proxyUrl = proxy;
                    }
                    esri.config.defaults.io.alwaysUseProxy = false;
                };
                SimpleMap.prototype.setGeometryService = function (geometryService) {
                    if (geometryService !== undefined && geometryService !== null)
                        esri.config.defaults.geometryService = new esri.tasks.GeometryService((typeof geometryService === "string" ? geometryService : geometryService.url));
                };
                SimpleMap.prototype.changeVisibility = function (id) {
                    var thiss = this;
                    var layer = null;
                    thiss.map.layerIds.forEach(function (layerId) {
                        layer = thiss.map.getLayer(layerId);
                        if (id == layer.id) {
                            layer.setVisibility(true);
                        }
                        else {
                            if (String.isNullOrWhiteSpace(layer.id) === false && layer.id.startsWith("basemap_") === true) {
                                layer.setVisibility(false);
                            }
                        }
                    });
                };
                SimpleMap.prototype.currentBasemap = function ($dom) {
                    var thiss = this;
                    thiss.map.layerIds.forEach(function (layerId) {
                        if (String.isNullOrWhiteSpace(layerId) === false && layerId.startsWith("basemap_") === true) {
                            if (thiss.map.getLayer(layerId).visible === true)
                                thiss.$baseMaps.find('input#' + layerId).attr('checked', true);
                        }
                    });
                };
                SimpleMap.execute = function () {
                    return new SimpleMap();
                };
                return SimpleMap;
            })(jtm.geometry.BaseSimpleMap);
            geometry.SimpleMap = SimpleMap;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));