function getObject() {
    return com.jtm.geometry.viewer.widgets.custom.miningconcession.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (miningconcession) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
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
                                        labelClass.symbol = thiss.config.module.widget.symbols["text"]["selection"];
                                        layer.setLabelingInfo([labelClass]);
                                        layer.id = "overlap_" + thiss.getUUID();
                                        thiss.map.addLayer(layer);
                                        return layer;
                                    };
                                }
                                Widget.prototype.initConfig = function () {
                                    var thiss = this;
                                    thiss.config.module.widget.service.fields = thiss.parseFields(thiss.config.module.widget.service.fields, thiss.config.module.widget.service.joinField);
                                    _super.prototype.initConfig.call(this);
                                };
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    _super.prototype.launchView.call(this);
                                    thiss.layer = thiss.buildGraphicsLayer();
                                    thiss.layerSelected = thiss.buildFeatureLayer();
                                };
                                Widget.prototype.getInfoTemplateWithFields = function (title, fields, extraFields) {
                                    var thiss = this;
                                    var infoTemplate = {};
                                    infoTemplate.title = title + ": ${" + title + "}";
                                    infoTemplate.content = "<table>";
                                    var i = 0;
                                    for (i = 0; i < fields.length; i++) {
                                        infoTemplate.content += "<tr>";
                                        infoTemplate.content += "<td>" + ((fields[i].alias !== null && fields[i].alias !== "") ? fields[i].alias : fields[i].name) + "</td>";
                                        infoTemplate.content += "<td>${" + fields[i].name + "}</td>";
                                        infoTemplate.content += "</tr>";
                                    }
                                    addExtraAttributes();
                                    infoTemplate.content += "</table>";
                                    return new esri.InfoTemplate(infoTemplate);
                                    function addExtraAttributes() {
                                        if (extraFields instanceof Object) {
                                            infoTemplate.content += '<tr><td>' + extraFields.detailReport + '</td><td><button type="button" id="btn${' + thiss.config.module.widget.service.joinFieldExtra + '}" class="btnDetailReport">Ver</button></td></tr>';
                                            infoTemplate.content += '<tr><td>' + extraFields.payReport + '</td><td><button type="button" id="btn${' + thiss.config.module.widget.service.joinFieldExtra + '}" class="btnPayReport">Ver</button></td></tr>';
                                            infoTemplate.content += '<tr><td>' + extraFields.record + '</td><td><button type="button" id="btn${' + thiss.config.module.widget.service.joinFieldExtra + '}" class="btnRecord">Ver</button></td></tr>';
                                            infoTemplate.content += '<tr><td>' + extraFields.recordFull + '</td><td><button type="button" id="btn${' + thiss.config.module.widget.service.joinFieldExtra + '}" class="btnRecordFull">Ver</button></td></tr>';
                                        }
                                    }
                                };
                                Widget.prototype.searchOnService = function (options) {
                                    var thiss = this;
                                    var query = new esri.tasks.Query();
                                    query.returnGeometry = true;
                                    query.outSpatialReference = thiss.map.spatialReference;
                                    query.outFields = thiss.config.module.widget.service.fields;
                                    query.where = thiss.config.module.widget.service.joinField + " IN (" + options.ids + ")";
                                    var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
                                    task.execute(query).addCallback(function (response) {
                                        if (response.hasOwnProperty('error')) {
                                            toastr.info('Ha ocurrido un error');
                                            return;
                                        }
                                        var infoTemplate = thiss.parseInfoTemplate(
                                            {
                                                fields: response.fields,
                                                title: response.displayFieldName,
                                                useCustomInfoTemplate: thiss.config.module.widget.service.useCustomInfoTemplate,
                                                customInfoTemplate: thiss.config.module.widget.infoTemplate,
                                                extraFields: thiss.config.module.widget.service.extraAttributes
                                            });
                                        thiss.layer.setInfoTemplate(infoTemplate);
                                        thiss.fillData(response);
                                    });
                                };
                                Widget.prototype.searchOverlaps = function (dom, id) {
                                    var thiss = this;
                                    thiss.removeOverlaps();
                                    var g = thiss.layerSelected.getFeatureById(id);
                                    if (g.geometry == null) {
                                        toastr.info("No existe el elemento en el mapa");
                                        return;
                                    }
                                    var services = thiss.getServicesOverlaps();
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
                                Widget.prototype.detailCustom = function (dom, id) {
                                    var thiss = this;
                                    id = thiss.layerSelected.getFeatureById(id).attributes[thiss.config.module.widget.service.joinField];
                                    _super.prototype.detailCustom.call(this, dom, id);
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
                                Widget.prototype.cleanControls = function () {
                                    var thiss = this;
                                    _super.prototype.cleanControls.call(this);
                                    this.resetContainers(true);
                                };
                                Widget.prototype.resetContainers = function (toNull) {
                                    var thiss = this;
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
                                    if (this.infoWindow !== null) {
                                        if (toNull === true) {
                                            this.infoWindow.remove();
                                        }
                                    }
                                    thiss.map.infoWindow.hide();
                                    thiss.removeOverlaps();
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(miningconcession.BaseWidget);
                            miningconcession.Widget = Widget;
                        })(custom.miningconcession || (custom.miningconcession = {}));
                        var miningconcession = custom.miningconcession;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));