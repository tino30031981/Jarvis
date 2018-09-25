function getObject() {
    return com.jtm.geometry.viewer.widgets.identify.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (identify) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = thiss.buildFeatureLayer();
                                thiss.layerDraw = thiss.buildGraphicsLayer();
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.setFillSymbol(thiss.config.module.widget.symbols.polygon.default);
                                thiss.draw.setLineSymbol(thiss.config.module.widget.symbols.polyline.default);
                                thiss.draw.setMarkerSymbol(thiss.config.module.widget.symbols.point.default);
                                thiss.draw.deactivate();
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.draw.deactivate();
                                    thiss.layerDraw.clear();
                                    var g = new esri.Graphic(e.geometry);
                                    thiss.layerDraw.add(g);
                                    thiss.search(e.geometry);
                                });
                                thiss.drawPoint();
                            };
                            Widget.prototype.search = function (geometry) {
                                var thiss = this;
                                thiss.layer.clear();
                                var layers = thiss.getLayers();
                                var length = layers.length;
                                var itemsPromise = [];
                                var i = 0;
                                var j = 0;
                                thiss.$list.off("click", "li>ul>li");
                                thiss.$list.on("click", "li>ul>li", function (e) {
                                    thiss.onMouseClickElementToGraphic(this, thiss.layer);
                                });
                                thiss.$list.off("mouseover", "li>ul>li");
                                thiss.$list.on("mouseover", "li>ul>li", function (e) {
                                    thiss.onMouseOverElementToGrahic(this, thiss.layer);
                                });
                                thiss.$list.off("mouseleave", "li>ul>li");
                                thiss.$list.on("mouseleave", "li>ul>li", function (e) {
                                    thiss.onMouseOutElementToGrahic(this, thiss.layer);
                                });
                                thiss.layer.on("click", function (e) {
                                    thiss.onMouseClickGraphicToElement(e.graphic, thiss.$list);
                                });
                                thiss.layer.on("mouse-over", function (e) {
                                    thiss.onMouseOverGraphicToElement(e.graphic, thiss.$list);
                                });
                                thiss.layer.on("mouse-out", function (e) {
                                    thiss.onMouseOutGraphicToElement(e.graphic, thiss.$list);
                                });
                                for (i = 0; i < layers.length; i++) {
                                    if (layers[i].type === "agsd") {
                                        var parameters = new esri.tasks.IdentifyParameters();
                                        parameters.geometry = geometry;
                                        parameters.mapExtent = thiss.map.extent;
                                        parameters.tolerance = thiss.config.module.widget.tolerance;
                                        parameters.returnGeometry = true;
                                        parameters.layerIds = [layers[i].id];
                                        parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                                        parameters.width = thiss.map.width;
                                        parameters.height = thiss.map.height;
                                        var task = new esri.tasks.IdentifyTask(layers[i].url);
                                        itemsPromise.push(task.execute(parameters));
                                    }
                                    else if (layers[i].type === "wms" && thiss.$rdbServiceType.filter(":checked").val() == 2) {
                                        var z = i;
                                        console.log(geometry);
                                        var wkt = "";
                                        var coordinates = [];
                                        var type = "";
                                        var extend = geometry.getExtent();
                                        if (geometry.type == Widget.OGCTYPES2.POINT) {
                                            type = Widget.OGCTYPES.POINT;
                                            coordinates = [geometry.x, geometry.y];
                                        }
                                        else if (geometry.type == Widget.OGCTYPES2.POLYGON) {
                                            type = Widget.OGCTYPES.POLYGON;
                                            coordinates = geometry.rings;
                                        }
                                        else if (geometry.type == Widget.OGCTYPES2.POLYLINE) {
                                            type = Widget.OGCTYPES.LINESTRING;
                                            coordinates = geometry.paths;
                                        }
                                        else return;
                                        var geometry3 = {
                                            type: type,
                                            coordinates: coordinates,
                                            spatialReference: { id: Widget.SRIDDEFAULTMAP }
                                        };
                                        //var geometry2 = thiss.transform(geometry3, Widget.SRIDDEFAULTGPS);
                                        /*var wkt = $.geo.WKT.stringify({
                                            type: geometry2.type,
                                            coordinates: geometry2.coordinates
                                        }); */
                                        var wkt = $.geo.WKT.stringify({
                                            type: geometry3.type,
                                            coordinates: geometry3.coordinates
                                        });
                                        //console.log(geometry3);
                                        //console.log(geometry2);
                                        console.log(wkt);
                                        var srid = Widget.SRIDDEFAULTMAP;
                                        if (String.isNullOrWhiteSpace(wkt) == true)
                                            return;
                                        layers[i].url = layers[i].url.replace("wms", "wfs");
                                        layers[i].url = layers[i].url.endsWith("/?") ? layers[i].url.replace("/?", "?") : layers[i].url;
                                        (function (k) {
                                            j++;
                                            //console.log(k);
                                            thiss.searchConfig(layers[k].url, {
                                                isJson: false,
                                                async: true,
                                                method: "POST",
                                                data: {
                                                    service: 'WFS',
                                                    version: '2.0.0',
                                                    request: 'GetFeature',
                                                    typeNames: layers[k].id,
                                                    srsName: 'EPSG:' + Widget.SRIDDEFAULTMAP,
                                                    outputFormat: 'json',
                                                    //bbox: extend.xmax + ',' + extend.xmin + ',' + extend.ymax + ',' + extend.ymin
                                                    cql_filter: 'Intersects(' + Widget.COLUMNGEOMETRYIDENTIFY + ',' + wkt + ')'
                                                }
                                            }, function (data) {
                                                thiss.writeResultDefault2(data);
                                                thiss.$list.find("li:first>ul>li:first").trigger("click");
                                            });
                                        })(z);
                                    }
                                }
                                if (itemsPromise.length === 0) return;
                                var promises = dojo.promise.all(itemsPromise);
                                promises.then(function (results) {
                                    thiss.layerDraw.clear();
                                    thiss.writeResultDefault(results, {});
                                    thiss.$list.find("li:first>ul>li:first").trigger("click");
                                });                                
                            };
                            Widget.prototype.writeResultDefault = function (data, options) {
                                var thiss = this;
                                if (data.length === 0) return null;
                                data.forEach(function (items) {
                                    if (!(items instanceof Array) || items.length === 0) {
                                        toastr.info("No se encontraron elementos");
                                        return;
                                    }
                                    var data2 = { layerName: items[0].layerName };
                                    data2.displayFieldName = String.isNullOrWhiteSpace(items[0].displayFieldName) === true ? items[0].layerName : items[0].displayFieldName;
                                    data2.features = [];
                                    var uuid = thiss.getUUID();
                                    items.forEach(function (item, j) {
                                        item.feature.id = uuid + "_" + (j + 1);
                                        if (item.feature.attributes[data2.displayFieldName] === undefined) {
                                            item.feature.displayFieldName = data2.layerName + '_' + (j + 1);
                                        } else {
                                            item.feature.displayFieldName = item.feature.attributes[data2.displayFieldName];
                                        }
                                        for (var attribute in item.feature.attributes) {
                                            if (Widget.EXCLUDEFIELDS.includes(attribute.toUpperCase()) === true)
                                                delete item.feature.attributes[attribute];
                                            if (String.isNullOrWhiteSpace(item.feature.attributes[attribute]) === true)
                                                item.feature.attributes[attribute] = '';
                                        }
                                        var infoTemplate = thiss.getInfoTemplate(data2.layerName, item.feature);
                                        item.feature.setInfoTemplate(infoTemplate);
                                        data2.features.push(item.feature);
                                    });
                                    thiss.fillData(data2);
                                    thiss.layer.addAll(data2.features);
                                });
                            };
                            Widget.prototype.writeResultDefault2 = function (data, options) {
                                var thiss = this;
                                options = options || {};
                                var items = data.features;
                                if (!(items instanceof Array) || items.length === 0) {
                                    //toastr.info("No se encontraron elementos");
                                    return;
                                }
                                var layerName = items[0].id;
                                layerName = layerName.substring(0, layerName.indexOf("."));
                                options.layerName = options.layerName || layerName;
                                var data2 = { layerName: options.layerName };
                                data2.displayFieldName = String.isNullOrWhiteSpace(items[0].displayFieldName) === true ? items[0].layerName : items[0].displayFieldName;
                                data2.displayFieldName = data2.displayFieldName || "id";
                                data2.features = [];
                                var uuid = thiss.getUUID();
                                items.forEach(function (item, j) {
                                    var spatialReferenceId = Widget.SRIDDEFAULTMAP;
                                    var item2 = thiss.geometryToEsriJSON({ type: item.geometry.type, coordinates: item.geometry.coordinates, spatialReference: { id: spatialReferenceId } });
                                    if (item2 === null) return;
                                    item.feature = new esri.Graphic(item2.features[0]);
                                    item.feature.attributes = item.properties;
                                    item.feature.id = uuid + "_" + (j + 1);
                                    if (item.feature.attributes[data2.displayFieldName] === undefined) {
                                        item.feature.displayFieldName = item.id;
                                    } else {
                                        item.feature.displayFieldName = item.id;
                                    }
                                    for (var attribute in item.feature.attributes) {
                                        if (Widget.EXCLUDEFIELDS.includes(attribute.toUpperCase()) === true)
                                            delete item.feature.attributes[attribute];
                                        if (String.isNullOrWhiteSpace(item.feature.attributes[attribute]) === true)
                                            item.feature.attributes[attribute] = '';
                                    }
                                    var infoTemplate = thiss.getInfoTemplate(data2.layerName, item.feature);
                                    item.feature.setInfoTemplate(infoTemplate);
                                    data2.features.push(item.feature);
                                });
                                thiss.fillData(data2);
                                thiss.layer.addAll(data2.features);
                            };
                            Widget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                                _super.prototype.onMouseClickGraphicToElement.call(this, graphic, $dom, options);
                                //thiss.map.infoWindow.show(e.mapPoint);
                                this.map.infoWindow.hide();
                                this.map.infoWindow.clearFeatures();
                                this.map.infoWindow.setFeatures([graphic]);
                                this.map.infoWindow.setTitle(graphic.getTitle());
                                this.map.infoWindow.setContent(graphic.getContent());
                                this.map.infoWindow.show(graphic.geometry.getCentroid());
                            };
                            Widget.prototype.onMouseOverGraphicToElement = function (graphic, $dom, options) {
                                var thiss = this;
                                options = options || {};
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
                                thiss.map.infoWindow.hide();
                                _super.prototype.onMouseClickElementToGraphic.call(this, element, layer, options);
                                var g = layer.getFeatureById(element.id);
                                if (g === null) return;
                                //thiss.map.setExtent(g.geometry.getExtent().expand(2), true);
                                var attributes = g.attributes;
                                thiss.$divFeatureSelected.append('<table></table>');
                                for (var attribute in attributes) {
                                    if (typeof attributes[attribute] !== "object") {
                                        thiss.$divFeatureSelected.find('>table').append("<tr><td>" + attribute + "</td><td>" + attributes[attribute] + "</td></tr>");
                                    }
                                }
                                thiss.map.infoWindow.setTitle(g.getTitle());
                                thiss.map.infoWindow.setContent(thiss.$divFeatureSelected.html());
                                thiss.map.infoWindow.show(g.geometry.getCentroid());
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
                            Widget.prototype.resetContainers = function (toNull) {
                                var thiss = this;
                                _super.prototype.resetContainers.call(this, toNull);
                                thiss.map.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                                if (this.layerDraw !== null) {
                                    this.layerDraw.clear();
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layerDraw);
                                        this.layerDraw = null;
                                    }
                                }
                                if (this.draw !== null) {
                                    this.draw.deactivate();
                                    if (this.draw === true) {
                                        this.draw = null;
                                    }
                                }
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                                if (this.draw !== null) {
                                    this.draw.deactivate();
                                    this.draw = null;
                                }
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(identify.BaseWidget);
                        identify.Widget = Widget;
                    })(widgets.identify || (widgets.identify = {}));
                    var identify = widgets.identify;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));