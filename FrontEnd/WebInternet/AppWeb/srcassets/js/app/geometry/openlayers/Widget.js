var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Widget = (function (_super) {
                __extends(Widget, _super);
                function Widget() {
                    _super.call(this);
                    this.infoWindow = null;
                    this.layerSync = null;
                    this.$tableSync = null;
                    this._toggleDragPan = function (state) {
                        var thiss = this;
                        thiss.map.getInteractions().forEach(function (interaction) {
                            if (interaction instanceof ol.interaction.DragPan) {
                                interaction.setActive(state);
                            }
                        }, this);
                    };
                    this.removeInteraction = function () {
                        if (this.draw !== null)
                            this.map.removeInteraction(this.draw);
                    };
                    this.drawSquare = function () {
                        return ol.interaction.Draw.createRegularPolygon(4);
                    };
                    this.drawBox = function (coordinates, geometry) {
                        if (!geometry) {
                            geometry = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geometry.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[1]], start]
                        ]);
                        return geometry;
                    };
                    this.detachMapEventsSynchronize = function () {
                        this.map.un('pointermove', this.pointerMoveMapSynchronize, this);
                        this.map.un('singleclick', this.singleClickMapSynchronize, this);
                        this.layerSync = null;
                        this.$tableSync = null;
                    };
                }
                Widget.prototype.setMap = function (map) {
                    _super.prototype.setMap.call(this, map);
                    this.infoWindow = this.map.getOverlayById(Widget.INFOWINDOW);
                };
                Widget.prototype.writeResultDefault = function (data, options) {
                    var thiss = this;
                    options = options || {};
                    options.propertyAttribute = 'properties';
                    options.UUID = thiss.layer.get('id');
                    data.fieldAliases = data.fieldAliases || {};
                    if (data.features.length > 0) {
                        for (var i in data.features[0].properties) {
                            data.fieldAliases[i] = i;
                        }
                    }
                    _super.prototype.writeResultDefault.call(this, data, options);
                };
                Widget.prototype.writeResult = function (data, layer, $table, options) {
                    var thiss = this;
                    options = options || {};
                    options.propertyAttribute = 'properties';
                    options.UUID = layer.get('id');
                    if (data.features.length > 0) {
                        for (var i in data.features[0].properties) {
                            data.fieldAliases[i] = i;
                        }
                    }
                    _super.prototype.writeResult.call(this, data, layer, $table, options);
                };
                Widget.prototype.fillLayer = function (layer, data) {
                    var thiss = this;
                    var format = new ol.format.GeoJSON();
                    var features = format.readFeatures(data);
                    thiss.layer.getSource().addFeatures(features);
                    var extent = thiss.layer.getSource().getExtent();
                    if (extent.equals(Widget.EXTENTINFINITY) === true) return;
                    thiss.map.getView().fit(extent, thiss.map.getSize());
                };
                Widget.prototype.layerToTable = function (layer, $table) {
                    var thiss = this;
                    this.layerSync = layer;
                    this.$tableSync = $table;
                    thiss.map.on('pointermove', thiss.pointerMoveMapSynchronize, this);
                    thiss.map.on('singleclick', thiss.singleClickMapSynchronize, this);
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
                    this.infoWindow.hide();
                };
                Widget.prototype.buildGraphicsLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.style = options.style || thiss.config.module.widget.symbols;
                    var layer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        style: function (feature, resolution) {
                            return options.style[feature.getGeometry().getType()]["default"];
                        }
                    });
                    layer.set('id', thiss.getUUID());
                    this.map.addLayer(layer);
                    return layer;
                };
                Widget.prototype.buildFeatureLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? Widget.LABELLAYER : options.label;
                    options.style = options.style || thiss.config.module.widget.symbols;
                    var layer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        style: function (feature, resolution) {
                            if (feature.get(Widget.LABELLAYER || '') !== undefined)
                                options.style[feature.getGeometry().getType()]['default'].getText().setText(feature.get(Widget.LABELLAYER || '').toString());
                            return options.style[feature.getGeometry().getType()]["default"];
                        }
                    });
                    layer.set('id', thiss.getUUID());
                    this.map.addLayer(layer);
                    return layer;
                };
                Widget.prototype.parseSymbols = function () {
                    var thiss = this;
                    if (thiss.config.module.widget.symbols === undefined || this.config.module.widget.symbols === null) {
                        if (this.config.module.map === undefined || this.config.module.map === null)
                            this.config.module.widget.symbols = {};
                        else
                            this.config.module.widget.symbols = (this.config.module.map.symbols === undefined || this.config.module.map.symbols === null) ? {} : this.config.module.map.symbols;
                    }
                    //for (var i in thiss.config.module.widget.symbols) {
                    //    for (var j in thiss.config.module.widget.symbols[i]) {
                    //        var clone = thiss.config.module.widget.symbols[i][j].color.slice();
                    //        thiss.config.module.widget.symbols[i][j].color = thiss.config.module.widget.symbols[i][j].color.slice(0, 3);
                    //        thiss.config.module.widget.symbols[i][j].color.push(clone[3] / 100);
                    //        if (thiss.config.module.widget.symbols[i][j].outline !== undefined) {
                    //            clone = thiss.config.module.widget.symbols[i][j].outline.color.slice();
                    //            thiss.config.module.widget.symbols[i][j].outline.color = thiss.config.module.widget.symbols[i][j].outline.color.slice(0, 3);
                    //            thiss.config.module.widget.symbols[i][j].outline.color.push(clone[3] / 100);
                    //        }
                    //    }
                    //}
                    thiss.config.module.widget.symbols = {
                        'Point': {
                            "default": new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 12,
                                    fill: new ol.style.Fill({
                                        color: "RGBA(" + thiss.config.module.widget.symbols.point.default.color.join(",") + ")"
                                    })
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 7,
                                    fill: new ol.style.Fill({
                                        color: "RGBA(" + thiss.config.module.widget.symbols.point.highlight.color.join(",") + ")"
                                    })
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'LineString': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polyline.default.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polyline.highlight.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'MultiLineString': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polyline.default.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polyline.highlight.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'MultiPolygon': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'Polygon': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'GeometryCollection': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    lineDash: [10, 10],
                                    color: 'magenta',
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: 'magenta'
                                }),
                                image: new ol.style.Circle({
                                    radius: 10,
                                    fill: null,
                                    stroke: new ol.style.Stroke({
                                        lineDash: [10, 10],
                                        color: 'magenta'
                                    })
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    lineDash: [10, 10],
                                    color: 'magenta',
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: 'magenta'
                                }),
                                image: new ol.style.Circle({
                                    radius: 10,
                                    fill: null,
                                    stroke: new ol.style.Stroke({
                                        lineDash: [10, 10],
                                        color: 'magenta'
                                    })
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        },
                        'Circle': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.default.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.widget.symbols.polygon.highlight.color.join(",") + ")"
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            })
                        }
                    };
                    _super.prototype.parseSymbols.call(this);
                };
                Widget.prototype.addInteraction = function (options) {
                };
                Widget.prototype.drawPoint = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Point' });
                };
                Widget.prototype.drawPolyline = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'LineString' });
                };
                Widget.prototype.drawPolylineFreeHand = function () {
                    this.resetContainers();
                    this.addInteraction({
                        type: 'LineString',
                        freehandCondition: ol.events.condition.noModifierKeys,
                        condition: ol.events.condition.singleClick
                    });
                };
                Widget.prototype.drawRectangle = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'LineString', maxPoints: 2, geometryFunction: this.drawBox });
                };
                Widget.prototype.drawCircle = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Circle' });
                };
                Widget.prototype.drawEllipse = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Circle' });
                };
                Widget.prototype.drawPolygon = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Polygon' });
                };
                Widget.prototype.drawPolygonFreeHand = function () {
                    this.resetContainers();
                    this.addInteraction({
                        type: 'Polygon',
                        freehandCondition: ol.events.condition.noModifierKeys,
                        condition: ol.events.condition.singleClick
                    });
                };
                /*Events of Synchronization*/
                Widget.prototype.pointerMoveMapSynchronize = function (e) {
                    this.$tableSync.find("." + Widget.ELEMENTSELECTED).removeClass(Widget.ELEMENTSELECTED);
                    this.layerSync.getSource().forEachFeature(function (feature) {
                        feature.setStyle(this.config.module.widget.symbols[feature.getGeometry().getType()]["default"]);
                    }, this);
                    var features = this.layerSync.getSource().getFeaturesAtCoordinate(e.coordinate);
                    if (features !== null)
                        features.forEach(function (feature) {
                            feature.setStyle(this.config.module.widget.symbols[feature.getGeometry().getType()]["highlight"]);
                            var element = this.$tableSync.find('#' + feature.getId());
                            jQuery(element)[0].scrollIntoView();
                            jQuery(element).addClass(Widget.ELEMENTSELECTED);
                        }, this);
                };
                Widget.prototype.singleClickMapSynchronize = function (e) {
                    this.infoWindow.hide();
                    var features = this.layerSync.getSource().getFeaturesAtCoordinate(e.coordinate);
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
                Widget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                };
                Widget.prototype.onMouseOverGraphicToElement = function (graphic, $dom, options) {
                };
                Widget.prototype.onMouseOutGraphicToElement = function (graphic, $dom, options) {
                };
                Widget.prototype.onMouseClickElementToGraphic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseClickElementToGraphic.call(this, element, layer, options);
                };
                Widget.prototype.onMouseDoubleClickElementToGraphic = function (element, layer, options) {
                    var thiss = this;
                    thiss.infoWindow.hide();
                    var g = layer.getSource().getFeatureById(element.id);
                    if (g === null) return;
                    var attributes = g.getProperties();
                    var content = '<table>';
                    for (var attribute in attributes) {
                        if (typeof attributes[attribute] !== "object") {
                            content += "<tr><td>" + attribute + "</td><td>" + attributes[attribute] + "</td></tr>";
                        }
                    }
                    content += '</table>';
                    var extent = g.getGeometry().getExtent();
                    var coordinate = ol.extent.getCenter(extent);
                    thiss.infoWindow.show(coordinate, content);
                    thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                };
                Widget.prototype.onMouseOverElementToGrahic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseOverElementToGrahic.call(this, element, layer, options);
                    var g = layer.getSource().getFeatureById(element.id);
                    if (g === null) return;
                    g.setStyle(thiss.config.module.widget.symbols[g.getGeometry().getType()]["highlight"]);
                };
                Widget.prototype.onMouseOutElementToGrahic = function (element, layer, options) {
                    var thiss = this;
                    _super.prototype.onMouseOutElementToGrahic.call(this, element, layer, options);
                    layer.getSource().getFeatures().forEach(function (feature) {
                        feature.setStyle(this.config.module.widget.symbols[feature.getGeometry().getType()]["default"]);
                    }, this);
                };
                Widget.prototype.cleanControls = function () {
                    this.detachMapEventsSynchronize();
                    this._toggleDragPan(true);
                    this.infoWindow.hide();
                };
                return Widget;
            })(geometry.BaseMapWidget);
            geometry.Widget = Widget;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));