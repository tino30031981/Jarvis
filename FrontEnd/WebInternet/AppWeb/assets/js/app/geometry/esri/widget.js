var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Widget = (function (_super) {
                __extends(Widget, _super);
                function Widget() {
                    _super.call(this);
                    this.layerOnClick = null;
                    this.layerOnMouseOver = null;
                    this.layerOnMouseOut = null;
                    this.geometryService = esriConfig.defaults.geometryService;
                    this.parseInfoTemplate = function (options) {
                        var thiss = this;
                        options = options || {};
                        options.title = (options.title === undefined || options.title === null) ? null : options.title;
                        options.fields = (options.fields === undefined || options.fields === null) ? [] : options.fields;
                        options.customInfoTemplate = (options.customInfoTemplate === undefined || options.customInfoTemplate === null) ? null : options.customInfoTemplate;
                        var infoTemplate = new esri.InfoTemplate("Atributos", "${*}");
                        if (options.useCustomInfoTemplate === true)
                            if (options.customInfoTemplate !== null)
                                infoTemplate = new esri.InfoTemplate(options.customInfoTemplate);
                            else {
                                infoTemplate = thiss.getInfoTemplateWithFields(options.title, options.fields, options.extraFields);
                            }
                        else
                            infoTemplate = thiss.getInfoTemplateWithFields(options.title, options.fields, options.extraFields);
                        return infoTemplate;
                    };
                    this.resetInfoWindow = function () {
                        var parent = jQuery('.contentPane').closest(".esriPopupWrapper");
                        jQuery(parent).find("div").prop("style", "");
                    };
                }
                Widget.JOINFIELD = 'OBJECTID';
                Widget.prototype.writeResultDefault = function (data, options) {
                    var thiss = this;
                    options = options || {};
                    options.propertyAttribute = 'attributes';
                    options.UUID = thiss.layer.id;
                    _super.prototype.writeResultDefault.call(this, data, options);
                };
                Widget.prototype.writeResult = function (data, layer, $table, options) {
                    var thiss = this;
                    options = options || {};
                    options.propertyAttribute = 'attributes';
                    options.UUID = layer.id;
                    _super.prototype.writeResult.call(this, data, layer, $table, options);
                };
                Widget.prototype.fillLayer = function (layer, data) {
                    var thiss = this;
                    data.features.forEach(function (feature) {
                        layer.add(feature);
                    });
                    var extent = esri.graphicsExtent(data.features);
                    thiss.map.setExtent(extent, true);
                };
                Widget.prototype.layerToTable = function (layer, $table) {
                    var thiss = this;
                    if (this.layerOnClick !== null)
                        this.layerOnClick.remove();
                    this.layerOnClick = layer.on("click", function (e) {
                        thiss.onMouseClickGraphicToElement(e.graphic, $table);
                    });
                    if (this.layerOnMouseOver !== null)
                        this.layerOnMouseOver.remove();
                    this.layerOnMouseOver = layer.on("mouse-over", function (e) {
                        thiss.onMouseOverGraphicToElement(e.graphic, $table);
                    });
                    if (this.layerOnMouseOut !== null)
                        this.layerOnMouseOut.remove();
                    this.layerOnMouseOut = layer.on("mouse-out", function (e) {
                        thiss.onMouseOutGraphicToElement(e.graphic, $table);
                    });
                };
                Widget.prototype.tableToLayer = function ($table, layer) {
                    var thiss = this;
                    jQuery($table).on('mouseover', function () {
                        thiss.onMouseOverElementToGrahic(this, layer);
                    });
                    jQuery($table).on('mouseleave', function () {
                        thiss.onMouseOutElementToGrahic(this, layer);
                    });
                    jQuery($table).on('dblclick doubletap', function () {
                        thiss.onMouseDoubleClickElementToGraphic(this, layer);
                    });
                };
                Widget.prototype.resetContainers = function (toNull) {
                    this.map.infoWindow.hide();
                };
                Widget.prototype.fitToFeature = function (layer, id) {
                    var thiss = this;
                    if (layer === undefined || layer === null) layer = this.layer;
                    var extent = layer.getFeatureById(id).geometry.getExtent();
                    thiss.map.setExtent(extent, true);
                };
                Widget.prototype.selectFeature = function (id, labeled) {
                    var thiss = this;
                    labeled = typeof labeled === "boolean" ? labeled : true;
                    thiss.layerSelected.clear();
                    var g = this.layer.getFeatureById(id);
                    var feature = new esri.Graphic(g.geometry);
                    feature.setAttributes(g.attributes);
                    feature.attributes[Widget.LABELLAYER] = '';
                    feature.setSymbol(thiss.config.module.widget.symbols[g.geometry.type]["selection"]);
                    feature.setId(id);
                    thiss.layerSelected.add(feature);
                    if (g.type === Widget.ESRITYPES.POINT) return;
                    var graphic = null;
                    feature.geometry.coordinates = feature.geometry.rings instanceof Array ? feature.geometry.rings : feature.geometry.paths;
                    for (var i = 0; i < feature.geometry.coordinates[0].length; i++) {
                        if (i < feature.geometry.coordinates[0].length - 1) {
                            graphic = new esri.Graphic(new esri.geometry.Point(feature.geometry.coordinates[0][i], g.geometry.spatialReference));
                            graphic.attributes = {};
                            graphic.attributes[Widget.LABELLAYER] = i + 1;
                            graphic.setSymbol(thiss.config.module.widget.symbols[graphic.geometry.type]["selection"]);
                            thiss.layerSelected.add(graphic);
                        }
                    }
                    delete feature.geometry.coordinates;
                    var extent = g.geometry.getExtent();
                    thiss.map.setExtent(extent, true);
                };
                Widget.prototype.buildGraphicsLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.style = options.style || thiss.config.module.widget.symbols;
                    var layer = new esri.layers.GraphicsLayer({
                        style: function (feature, resolution) {
                            return options.style[feature.geometry.type]["default"];
                        }
                    });
                    layer.id = thiss.getUUID();
                    this.map.addLayer(layer);
                    return layer;
                };
                Widget.prototype.buildFeatureLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? Widget.LABELLAYER : options.label;
                    options.labelType = String.isNullOrWhiteSpace(options.labelType) ? 'esriFieldTypeInteger' : options.labelType;
                    options.labelPlacement = String.isNullOrWhiteSpace(options.labelType) ? "center-center" : options.labelPlacement;
                    options.style = options.style || thiss.config.module.widget.symbols;
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
                                return options.style[feature.geometry.type]["default"];
                            }
                        });
                    var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{" + options.label + "}" }, labelPlacement: options.labelPlacement });
                    labelClass.symbol = thiss.config.module.widget.symbols["text"]["default"];
                    layer.setLabelingInfo([labelClass]);
                    this.map.addLayer(layer);
                    return layer;
                };
                Widget.prototype.getInfoTemplate = function (title, feature) {
                    var infoTemplate = {};
                    infoTemplate.title = title;
                    infoTemplate.content = "<table>";
                    for (var attribute in feature.attributes)
                        infoTemplate.content += "<tr><td>" + attribute + "</td><td>${" + attribute + "}</td></tr>";
                    infoTemplate.content += "</table>";
                    return new esri.InfoTemplate(infoTemplate);
                };
                Widget.prototype.getInfoTemplateWithFields = function (title, fields, extraFields) {
                    var thiss = this;
                    var infoTemplate = {};
                    infoTemplate.title = title + ": ${" + title + "}";
                    //infoTemplate.content = "";
                    infoTemplate.content = "<table>";
                    var i = 0;
                    for (i = 0; i < fields.length; i++) {
                        infoTemplate.content += "<tr>";
                        infoTemplate.content += "<td>" + ((fields[i].alias !== null && fields[i].alias !== "") ? fields[i].alias : fields[i].name) + "</td>";
                        infoTemplate.content += "<td>${" + fields[i].name + "}</td>";
                        infoTemplate.content += "</tr>";
                    }
                    infoTemplate.content += "</table>";
                    return new esri.InfoTemplate(infoTemplate);
                };
                Widget.prototype.parseSymbols = function () {
                    var thiss = this;
                    if (thiss.config.module.widget.symbols === undefined || this.config.module.widget.symbols === null) {
                        if (this.config.module.map === undefined || this.config.module.map === null)
                            this.config.module.widget.symbols = {};
                        else
                            this.config.module.widget.symbols = (this.config.module.map.symbols === undefined || this.config.module.map.symbols === null) ? {} : this.config.module.map.symbols;
                    }
                    var textStyle = new esri.symbol.TextSymbol();
                    textStyle.setColor(new esri.Color([0, 0, 0, 1]));
                    textStyle.setVerticalAlignment('middle');
                    textStyle.font.setSize("12px");
                    textStyle.font.setFamily("Calibri,sans-serif");
                    thiss.config.module.widget.symbols = {
                        "point": {
                            "default": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.default),
                            "highlight": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.highlight),
                            "selection": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.selection)
                        },
                        "polyline": {
                            "default": new esri.symbol.SimpleLineSymbol(thiss.config.module.widget.symbols.polyline.default),
                            "highlight": new esri.symbol.SimpleLineSymbol(thiss.config.module.widget.symbols.polyline.highlight),
                            "selection": new esri.symbol.SimpleLineSymbol(thiss.config.module.widget.symbols.polyline.selection)
                        },
                        "polygon": {
                            "default": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.default),
                            "highlight": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.highlight),
                            "selection": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.selection)
                        },
                        "multipoint": {
                            "default": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.default),
                            "highlight": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.highlight),
                            "selection": new esri.symbol.SimpleMarkerSymbol(thiss.config.module.widget.symbols.point.selection)
                        },
                        "extent": {
                            "default": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.default),
                            "highlight": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.highlight),
                            "selection": new esri.symbol.SimpleFillSymbol(thiss.config.module.widget.symbols.polygon.selection)
                        },
                        "text": {
                            "default": textStyle,
                            "highlight": textStyle,
                            "selection": textStyle
                        }
                    };
                    _super.prototype.parseSymbols.call(this);
                };
                Widget.prototype.html2Canvas = function ($dom, $img, options) {
                    var thiss = this;
                    options = options || {};
                    options.height = thiss.map.height;
                    options.width = thiss.map.width;
                    _super.prototype.html2Canvas.call(this, $dom, $img, options);
                };
                Widget.prototype.drawPoint = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POINT);
                };
                Widget.prototype.drawRectangle = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.RECTANGLE);
                };
                Widget.prototype.drawPolyline = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POLYLINE);
                };
                Widget.prototype.drawPolygon = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.POLYGON);
                };
                Widget.prototype.drawPolygonFreeHand = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
                };
                Widget.prototype.drawCircle = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.CIRCLE);
                };
                Widget.prototype.drawEllipse = function () {
                    this.resetContainers();
                    this.draw.activate(esri.toolbars.Draw.ELLIPSE);
                };
                /*Events of Synchronization*/

                Widget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                    var thiss = this;
                    thiss.map.infoWindow.hide();
                    thiss.map.infoWindow.clearFeatures();
                    thiss.map.infoWindow.setFeatures([graphic]);
                    thiss.map.infoWindow.setTitle(graphic.getTitle());
                    thiss.map.infoWindow.setContent(graphic.getContent());
                    thiss.map.infoWindow.show(graphic.geometry.getCentroid());
                };
                Widget.prototype.onMouseOverGraphicToElement = function (graphic, $dom, options) {
                    var thiss = this;
                    options = options = {};
                    options.id = graphic.getId();
                    _super.prototype.onMouseOverGraphicToElement.call(this, graphic, $dom, options);
                    graphic.setSymbol(thiss.config.module.widget.symbols[graphic.geometry.type]["highlight"]);
                };
                Widget.prototype.onMouseOutGraphicToElement = function (graphic, $dom, options) {
                    var thiss = this;
                    _super.prototype.onMouseOutGraphicToElement.call(this, graphic, $dom, options);
                    graphic.setSymbol(thiss.config.module.widget.symbols[graphic.geometry.type]["default"]);
                };
                Widget.prototype.onMouseClickElementToGraphic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseClickElementToGraphic.call(this, element, layer, options);
                    thiss.map.infoWindow.hide();
                    var g = layer.getFeatureById(element.id);
                    if (g === null) return;
                    thiss.map.infoWindow.setTitle(g.getTitle());
                    thiss.map.infoWindow.setContent(g.getContent());
                    thiss.map.infoWindow.show(g.geometry.getCentroid());
                    thiss.map.setExtent(g.geometry.getExtent().expand(thiss.config.module.widget.zoomLevel), true);
                    if (typeof options.callback === "function")
                        options.callback(g.attributes);
                    //////////////////var htmlDetail = '';
                    //////////////////for (var attribute in g.attributes)
                    //////////////////    htmlDetail += "<tr><td>" + attribute + "</td><td>" + g.attributes[attribute] + "</td></tr>";
                    //////////////////thiss.$widget.find("#divFeatureDetail").html(htmlDetail);
                };
                Widget.prototype.onMouseDoubleClickElementToGraphic = function (element, layer, options) {
                    var thiss = this;
                    thiss.map.infoWindow.hide();
                    thiss.map.infoWindow.clearFeatures();
                    var g = layer.getFeatureById(element.id);
                    if (g === null) return;
                    thiss.map.infoWindow.setFeatures([g]);
                    thiss.map.infoWindow.setTitle(g.getTitle());
                    thiss.map.infoWindow.setContent(g.getContent());
                    thiss.map.infoWindow.show(g.geometry.getCentroid());
                    thiss.map.setExtent(g.geometry.getExtent().expand(thiss.config.module.widget.zoomLevel), true);
                };
                Widget.prototype.onMouseOverElementToGrahic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseOverElementToGrahic.call(this, element, layer, options);
                    var g = layer.getFeatureById(element.id);
                    if (g === null) return;
                    g.setSymbol(thiss.config.module.widget.symbols[g.geometry.type]["highlight"]);
                };
                Widget.prototype.onMouseOutElementToGrahic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseOutElementToGrahic.call(this, element, layer, options);
                    layer.graphics.forEach(function (feature) {
                        feature.setSymbol(thiss.config.module.widget.symbols[feature.geometry.type]["default"]);
                    }, this);
                };
                Widget.prototype.onMouseClickChartToGraphic = function (e, layer) {
                    var thiss = this;
                    var g = layer.getFeatureById(e.currentTarget.id);
                    if (g === null) return;
                    thiss.map.setExtent(g.getExtent().expand(thiss.config.module.widget.zoomLevel));
                };
                Widget.prototype.onMouseOverChartToGraphic = function (e, layer) {
                    var thiss = this;
                    var g = layer.getFeatureById(e.currentTarget.id);
                };
                Widget.prototype.onMouseOutChartToGraphic = function (e, layer) {
                };
                Widget.prototype.onMouseClickGraphicToChart = function (graphic) {
                };
                Widget.prototype.onMouseOverGraphicToChart = function (graphic, series) {
                };
                Widget.prototype.onMouseOutGraphicToChart = function (graphic, series) {
                };
                Widget.prototype.onMouseClickChartToElement = function (e, $dom) {
                };
                Widget.prototype.onMouseOverChartToElement = function (e, $dom) {
                };
                Widget.prototype.onMouseOutChartToElement = function (e) {
                };
                Widget.prototype.onMouseClickElementToChart = function (element, series) {
                };
                Widget.prototype.onMouseOverElementToChart = function (element, series) {
                };
                Widget.prototype.onMouseOutElementToChart = function (element, series) {
                };
                Widget.prototype.cleanControls = function () {
                };
                return Widget;
            })(geometry.BaseMapWidget);
            geometry.Widget = Widget;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));