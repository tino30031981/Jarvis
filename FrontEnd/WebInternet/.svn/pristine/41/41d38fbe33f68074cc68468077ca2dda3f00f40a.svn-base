var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this.defaultBaseMap = "osm";
                    this.layerTemp = null;
                    this.buildStyle = function () {
                        var thiss = this;
                        var color = new esri.Color([255, 255, 0]);
                        var color2 = new esri.Color([0, 0, 0, 0.5]);
                        var lineStyle = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, color, 2);
                        var fillMarkerStyle = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineStyle, color2);
                        return fillMarkerStyle;
                    };
                }
                Map.prototype.build = function () {
                    var thiss = this;
                    _super.prototype.build.call(this);
                    var spatialReference = new esri.SpatialReference({ wkid: thiss.config.module.map.projectionCode });
                    var extent = new esri.geometry.Extent(thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum, thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum, spatialReference);
                    thiss.map = new esri.Map(thiss.$map[0], {
                        smartNavigation: false,
                        isZoomSlider: false,
                        logo: false,
                        autoResize: true,
                        showLabels: true,
                        basemap: thiss.defaultBaseMap,
                        zoom: 0,
                        slider: false,
                        wrapAround180: thiss.config.module.map.wrapAround180
                    });
                    thiss.map.spatialReference = spatialReference;
                    thiss.setServices();
                    thiss.map.hideZoomSlider();
                    thiss.map.enableScrollWheelZoom();
                    thiss.map.enableKeyboardNavigation();
                    thiss.map.enableMapNavigation();                    
                    thiss.map.on("load", function (e) {
                        thiss.map.spatialReference = spatialReference;
                        thiss.map.showZoomSlider();
                        thiss.map.setExtent(extent, true);
                        thiss.map.setInitialExtent(extent);
                        thiss.map.removeDefaultBaseMap();
                        thiss.setToolbar();
                    });
                    //thiss.map.on("resize", function (e) {
                    jQuery(window).on("resize", function () {
                        setTimeout(function () {
                            thiss.map.setExtent(extent, true);
                            //thiss.map.reposition();
                        }, 200);
                    });
                    thiss.setOverView();
                    //console.log('cambio6');
                    //thiss.parseSymbols();
                    if (jQuery('#txtViewLayer').length === 0)
                        return;
                    var item = jQuery('#txtViewLayer').val();
                    if (String.isNullOrWhiteSpace(item))
                        return;
                    //item = JSON.parse(item);
                    json = JSON.parse(item);                    
                    thiss.layerTemp = thiss.buildFeatureLayer();
                    json.features.forEach(function (feature) {
                        var id = feature.attributes.id;
                        feature.attributes[Map.LABELLAYER] = '';
                        if (id === undefined || id === null)
                            id = 0;
                        graphic = new esri.Graphic(feature);
                        graphic.setId(id);
                        graphic.setSymbol(thiss.buildStyle());
                        thiss.layerTemp.add(graphic);
                    });
                    var extent = esri.graphicsExtent(thiss.layerTemp.graphics);
                    if (extent !== null)
                        thiss.map.setExtent(extent, true);
                };                
                Map.prototype.buildFeatureLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? Map.LABELLAYER : options.label;
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
                        showLabels: true
                    });
                    var textStyle = new esri.symbol.TextSymbol();
                    textStyle.setColor(new esri.Color([0, 0, 0, 1]));
                    textStyle.setVerticalAlignment('middle');
                    textStyle.font.setSize("12px");
                    textStyle.font.setFamily("Calibri,sans-serif");
                    var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{" + options.label + "}" }, labelPlacement: options.labelPlacement });
                    labelClass.symbol = textStyle;
                    layer.setLabelingInfo([labelClass]);
                    this.map.addLayer(layer);
                    return layer;
                };
                Map.prototype.parseSymbols = function () {
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
                };
                Map.prototype.setOverView = function () {
                    var thiss = this;
                    if (thiss.config.module.withOverview === true) {
                        var overView = new esri.dijit.OverviewMap({
                            map: thiss.map,
                            width: 250,
                            height: 200,
                            attachTo: "bottom-right",
                            expandFactor: 1.0,
                            visible: true
                        });
                        overView.startup();
                    }
                };
                Map.prototype.setCorsServers = function (items) {
                    if (items !== undefined && items !== null && items instanceof Array)
                        for (i = 0; i < items.length; i++)
                            esri.config.defaults.io.corsEnabledServers.push(items[i]);
                };
                Map.prototype.setProxy = function (proxy) {
                    if (String.isNullOrWhiteSpace(proxy) !== true) {
                        esri.config.defaults.io.proxyUrl = proxy;
                    }
                    esri.config.defaults.io.alwaysUseProxy = false;
                };
                Map.prototype.setGeometryService = function (geometryService) {
                    esri.config.defaults.geometryService = new esri.tasks.GeometryService(geometryService.url);
                };
                return Map;
            })(geometry.BaseMap);
            geometry.Map = Map;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));