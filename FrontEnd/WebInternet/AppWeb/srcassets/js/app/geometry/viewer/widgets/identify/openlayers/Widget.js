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
                                thiss.$btnPolyline.remove();
                                thiss.$btnPolylineFreeHand.remove();
                                thiss.$btnRectangle.remove();
                                thiss.$btnCircle.remove();
                                thiss.$btnEllipse.remove();
                                thiss.$btnPolygon.remove();
                                thiss.$btnPolygonFreeHand.remove();
                                thiss.layer = thiss.buildGraphicsLayer();
                                thiss.layerDraw = thiss.buildGraphicsLayer();
                            };
                            Widget.prototype.search = function (geometry) {
                                var thiss = this;
                                this.$list.html('');
                                this.$divFeatureSelected.html('');
                                var srid = thiss.map.getView().getProjection().getCode();
                                var layers = thiss.getLayers();
                                var viewProjection = thiss.map.getView().getProjection();
                                var viewResolution = thiss.map.getView().getResolution();
                                var coordinates = geometry.getCoordinates();
                                var format = new ol.format.GeoJSON();
                                thiss.layer.getSource().clear(true);
                                var i = 0;
                                for (i = 0; i < layers.length; i++) {
                                    var url = thiss.map.getLayer(layers[i].uuid).getSource().getGetFeatureInfoUrl(
                                        coordinates, viewResolution, viewProjection,
                                        { 'INFO_FORMAT': 'application/json' });
                                    if (url) {
                                        $.ajax({
                                            url: url,
                                            async: false,
                                            dataType: 'json'
                                        }).done(function (data) {
                                            thiss.layerDraw.getSource().clear(true);
                                            data.layerName = layers[i].name;
                                            data.uuid = layers[i].uuid;
                                            thiss.writeResultDefault(data, {});
                                        });
                                    }
                                }
                                thiss.$list.tree();
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
                                thiss.map.on('pointermove', thiss.pointerMoveMapSynchronize, this);
                                thiss.map.on('singleclick', thiss.singleClickMapSynchronize, this);
                            };
                            Widget.prototype.writeResultDefault = function (data, options) {
                                var thiss = this;
                                if (data.features.length === 0) return null;
                                var epsg = data.crs.properties.name.match(/EPSG::\d+/g);
                                data.crs.properties.name = epsg[0].replace("::", ":");
                                data.layerName = layers[i].name;
                                data.displayFieldName = String.isNullOrWhiteSpace(data.displayFieldName) === true ? data.layerName : data.displayFieldName;
                                data.features.forEach(function (feature, j) {
                                    feature.id = data.uuid + "_" + (j + 1);
                                    if (feature.properties[data.displayFieldName] === undefined) {
                                        feature.displayFieldName = data.layerName + '_' + (j + 1);
                                    } else {
                                        feature.displayFieldName = feature.properties[data.displayFieldName];
                                    }
                                    for (var attribute in feature.properties) {
                                        if (Widget.EXCLUDEFIELDS.includes(attribute.toUpperCase()) === true)
                                            delete feature.properties[attribute];
                                        if (feature.properties[attribute] === null)
                                            feature.properties[attribute] = '';
                                    }
                                });
                                thiss.fillData(data);
                                var viewProjection = thiss.map.getView().getProjection();
                                var features = format.readFeatures(data, { featureProjection: viewProjection });
                                thiss.layer.getSource().addFeatures(features);
                            };
                            Widget.prototype.addInteraction = function (options) {
                                var thiss = this;
                                thiss.toggleDragPan(false);
                                thiss.infoWindow.hide();
                                thiss.removeInteraction();
                                thiss.resetContainers();
                                thiss.draw = new ol.interaction.Draw({
                                    source: thiss.layerDraw.getSource(),
                                    type: options.type,
                                    condition: options.condition,
                                    freehandCondition: options.freehandCondition,
                                    maxPoints: options.maxPoints,
                                    geometryFunction: options.geometryFunction
                                });
                                thiss.map.addInteraction(thiss.draw);
                                thiss.draw.on('drawstart', function (e) {
                                    thiss.toggleDragPan(false);
                                    thiss.resetContainers();
                                }, this);
                                thiss.draw.on('drawend', function (e) {
                                    thiss.toggleDragPan(true);
                                    thiss.removeInteraction();
                                    thiss.resetContainers();
                                    thiss.search(e.feature.getGeometry());
                                }, this);
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                var thiss = this;
                                _super.prototype.resetContainers.call(this, toNull);
                                this.detachMapEventsSynchronize();
                                this.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                                if (this.layerDraw !== null) {
                                    this.layerDraw.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layerDraw);
                                        this.layerDraw = null;
                                    }
                                }
                            };
                            Widget.prototype.addLayer = function (url, layerId, uuid) {
                                var thiss = this;
                                var service2 = new ol.layer.Tile({
                                    source: new ol.source.TileWMS({
                                        url: url,
                                        //            							      crossOrigin: 'anonymous',
                                        params: { LAYERS: layerId, TILED: true }
                                    })
                                });
                                if (service2 !== null) {
                                    service2.set("id", uuid);
                                    service2.setVisible(false);
                                    thiss.map.addLayer(service2);
                                }
                            };
                            Widget.prototype.pointerMoveMapSynchronize = function (e) {
                                this.$list.find("." + Widget.ELEMENTSELECTED).removeClass(Widget.ELEMENTSELECTED);
                                this.layer.getSource().forEachFeature(function (feature) {
                                    feature.setStyle(this.config.module.widget.symbols[feature.getGeometry().getType()]["default"]);
                                }, this);
                                var features = this.layer.getSource().getFeaturesAtCoordinate(e.coordinate);
                                if (features !== null)
                                    features.forEach(function (feature) {
                                        feature.setStyle(this.config.module.widget.symbols[feature.getGeometry().getType()]["highlight"]);
                                        var element = this.$list.find('#' + feature.getId());
                                        jQuery(element)[0].scrollIntoView();
                                        jQuery(element).addClass(Widget.ELEMENTSELECTED);
                                    }, this);
                            };
                            Widget.prototype.singleClickMapSynchronize = function (e) {
                                this.infoWindow.hide();
                                var features = this.layer.getSource().getFeaturesAtCoordinate(e.coordinate);
                                if (features instanceof Array && features.length > 0)
                                    var attributes = features[0].getProperties();
                                var content = '<table>';
                                for (var attribute in attributes) {
                                    if (typeof attributes[attribute] !== "object") {
                                        content += "<tr><td>" + attribute + "</td><td>" + attributes[attribute] + "</td></tr>";
                                    }
                                }
                                content += '</table>';
                                this.infoWindow.show(e.coordinate, content);
                            };
                            Widget.prototype.onMouseClickElementToGraphic = function (element, layer, options) {
                                var thiss = this;
                                thiss.infoWindow.hide();
                                _super.prototype.onMouseClickElementToGraphic.call(this, element, layer, options);
                                var g = layer.getFeatureById(element.id);
                                if (g === null) return;
                                var extent = g.getGeometry().getExtent();
                                //var coordinate = ol.extent.getCenter(extent);
                                thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                                var attributes = g.getProperties();
                                thiss.$divFeatureSelected.append('<table></table>');
                                for (var attribute in attributes) {
                                    if (typeof attributes[attribute] !== "object") {
                                        thiss.$divFeatureSelected.find('>table').append("<tr><td>" + attribute + "</td><td>" + attributes[attribute] + "</td></tr>");
                                    }
                                }
                                thiss.infoWindow.show(g.getGeometry().getExtentCenter(), thiss.$divFeatureSelected.html());
                            };
                            Widget.prototype.onMouseOverElementToGrahic = function (element, layer, options) {
                                var thiss = this;
                                _super.prototype.onMouseOverElementToGrahic.call(this, element, layer, options);
                                var g = layer.getFeatureById(element.id);
                                if (g === null) return;
                                g.setStyle(thiss.config.module.widget.symbols[feature.getGeometry().getType()]["highlight"]);
                            };
                            Widget.prototype.onMouseOutElementToGrahic = function (element, layer, options) {
                                var thiss = this;
                                _super.prototype.onMouseOutElementToGrahic.call(this, element, layer, options);
                                layer.getFeatures().forEach(function (feature) {
                                    feature.setStyle(thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"]);
                                }, this);
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                                this.removeInteraction();
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