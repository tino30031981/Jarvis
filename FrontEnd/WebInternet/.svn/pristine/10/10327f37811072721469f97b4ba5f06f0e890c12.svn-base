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
                    this.infoWindow = null;
                    this.layerSync = null;
                    this.$tableSync = null;
                    this.setInfoWindow = function (map) {
                        if (this.infoWindow === null) {
                            this.infoWindow = new ol.Overlay.Popup({ id: SimpleMap.INFOWINDOW });
                            map.addOverlay(this.infoWindow);
                        }
                    };
                    this.zoomByDelta = function (delta) {
                        var view = this.map.getView();
                        var currentResolution = view.getResolution();
                        if (currentResolution) {
                            view.animate({
                                resolution: currentResolution,
                                duration: 250,
                                easing: ol.easing.easeOut
                            });
                            var newResolution = view.constrainResolution(currentResolution, delta);
                            view.setResolution(newResolution);
                        }
                    };
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
                SimpleMap.prototype.reposition = function () {
                    var thiss = this;
                    if (thiss.map !== null)
                        thiss.map.updateSize();
                };
                SimpleMap.prototype.parseSymbols = function () {
                    var thiss = this;
                    //if (thiss.config.module.map.symbols === undefined || thiss.config.module.map.symbols === null) return;
                    for (var i in thiss.config.module.map.symbols) {
                        for (var j in thiss.config.module.map.symbols[i]) {
                            var clone = thiss.config.module.map.symbols[i][j].color.slice();
                            thiss.config.module.map.symbols[i][j].color = thiss.config.module.map.symbols[i][j].color.slice(0, 3);
                            thiss.config.module.map.symbols[i][j].color.push(clone[3] / 100);
                            if (thiss.config.module.map.symbols[i][j].outline !== undefined) {
                                clone = thiss.config.module.map.symbols[i][j].outline.color.slice();
                                thiss.config.module.map.symbols[i][j].outline.color = thiss.config.module.map.symbols[i][j].outline.color.slice(0, 3);
                                thiss.config.module.map.symbols[i][j].outline.color.push(clone[3] / 100);
                            }
                        }
                    }
                    thiss.config.module.map.symbols = {
                        'Point': {
                            "default": new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 12,
                                    fill: new ol.style.Fill({
                                        color: "RGBA(" + thiss.config.module.map.symbols.point.default.color.join(",") + ")"
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
                                        color: "RGBA(" + thiss.config.module.map.symbols.point.highlight.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polyline.default.color.join(",") + ")",
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polyline.highlight.color.join(",") + ")",
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polyline.default.color.join(",") + ")",
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polyline.highlight.color.join(",") + ")",
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.default.color.join(",") + ")"
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
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.outline.color.join(",") + ")",
                                    lineDash: [10, 10],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + thiss.config.module.map.symbols.polygon.highlight.color.join(",") + ")"
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
                };
                SimpleMap.prototype.addToolbar = function () {
                    this.$toolbar.appendTo(this.$map.find('>div.ol-viewport'));
                };
                SimpleMap.prototype._addDom = function ($dom) {
                    this.$map.find('>div.ol-viewport').append($dom);
                };
                SimpleMap.prototype.newMap = function (dom, height) {
                    var thiss = this;
                    _super.prototype.newMap.call(this, dom, height);
                    var projection = ol.proj.get("EPSG:" + thiss.config.module.map.projectionCode);
                    var extent = [thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum, thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum];//new ol.Extent
                    var map = new ol.Map({
                        loadTilesWhileInteracting: true,
                        loadTilesWhileAnimating: true,
                        controls: [],
                        //layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
                        interactions: ol.interaction.defaults({
                            dragPan: true,
                            mouseWheelZoom: true
                        }),
                        target: thiss.$map[0],
                        view: new ol.View({
                            projection: projection,
                            enableRotation: false,
                            maxResolution: 40075016.68557849 / 256,
                            zoom: 0
                        })
                    });
                    thiss.setServices(map);
                    map.once('postrender', function (e) {
                        map.getView().set('initialExtent', extent);
                        map.getView().fit(extent, map.getSize(), true);
                        thiss.setToolbar();
                    });
                    this.setInfoWindow(map);
                    return map;
                };
                SimpleMap.prototype.build = function (dom, height) {
                    var thiss = this;
                    thiss.map = thiss.newMap(dom, height);
                    thiss.layer = thiss.buildGraphicsLayer();
                };
                SimpleMap.prototype.buildGraphicsLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.style = options.style || thiss.config.module.map.symbols;
                    options.visible = (typeof options.visible === "boolean") ? options.visible : true;
                    options.handlerAddFeature = (typeof options.handlerAddFeature === "boolean") ? options.handlerAddFeature : false;
                    var layer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        style: function (feature, resolution) {
                            return options.style[feature.getGeometry().getType()]["default"];
                        }
                    });
                    if (options.handlerAddFeature === true) {
                        layer.getSource().on("addfeature", function (e) {
                            var extent = layer.getSource().getExtent();
                            setTimeout(function () {
                                thiss.map.getView().fit(extent, thiss.map.getSize());
                            }, 500);
                        });
                    }
                    layer.setVisible(options.visible);
                    layer.set('id', thiss.getUUID());
                    this.map.addLayer(layer);
                    return layer;
                };
                SimpleMap.prototype.buildFeatureLayer = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.label = String.isNullOrWhiteSpace(options.label) ? SimpleMap.LABELLAYER : options.label;
                    options.style = options.style || thiss.config.module.map.symbols;
                    options.visible = (typeof options.visible === "boolean") ? options.visible : true;
                    options.handlerAddFeature = (typeof options.handlerAddFeature === "boolean") ? options.handlerAddFeature : false;
                    var layer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        style: function (feature, resolution) {
                            if (feature.get(SimpleMap.LABELLAYER || '') !== undefined)
                                options.style[feature.getGeometry().getType()]['default'].getText().setText(feature.get(SimpleMap.LABELLAYER || '').toString());
                            return options.style[feature.getGeometry().getType()]["default"];
                        }
                    });
                    layer.getSource().on("addfeature", function (e) {
                        var extent = layer.getSource().getExtent();
                        setTimeout(function () {
                            thiss.map.getView().fit(extent, thiss.map.getSize());
                        }, 500);
                    });
                    layer.setVisible(options.visible);
                    layer.set('id', thiss.getUUID());
                    this.map.addLayer(layer);
                    return layer;
                };
                SimpleMap.prototype._addFeature = function (layer, json) {
                    var thiss = this;
                    if (json === undefined || json === null || json.features === undefined || json.features === null) return;
                    var features = null;
                    if (json.format === SimpleMap.FORMAT.ESRIJSON)
                        features = new ol.format.EsriJSON().readFeatures(json);
                    else
                        features = new ol.format.GeoJSON().readFeatures(json);
                    features.forEach(function (feature) {
                        //feature.setProperties({
                        //    [SimpleMap.LABELLAYER]: ""
                        //});
                        feature.setProperty([SimpleMap.LABELLAYER], '');
                    });
                    layer.getSource().addFeatures(features);
                };
                SimpleMap.prototype.addFeatures = function (json, addVertex) {
                    var thiss = this;
                    _super.prototype.addFeatures.call(this, json, addVertex);
                    addVertex = typeof addVertex === 'boolean' ? addVertex : true;
                    thiss.layer.getSource().clear(true);
                    thiss._addFeature(thiss.layer, json);
                    if (addVertex === true) {
                        if (json.features[0].geometry.type === SimpleMap.OGCTYPES.POINT) return;
                        if (json.format === SimpleMap.FORMAT.ESRIJSON) {

                        } else {
                            json.features.forEach(function (feature) {
                                if (feature.geometry.type === SimpleMap.OGCTYPES.POLYGON) {
                                    for (var i = 0; i < feature.geometry.coordinates[0].length - 1; i++) {
                                        addFeatures(feature.geometry.coordinates[0][i], i)
                                    }
                                }
                                else if (feature.geometry.type === SimpleMap.OGCTYPES.MULTIPOLYGON) {
                                    for (var i = 0; i < feature.geometry.coordinates[0][0].length - 1; i++) {
                                        addFeatures(feature.geometry.coordinates[0][0][i], i)
                                    }
                                }
                            });
                        }
                    }
                    function addFeatures(coordinates, i) {
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Point(coordinates)
                        });
                        //feature.setProperties({
                        //    [SimpleMap.LABELLAYER]: i + 1
                        //});
                        feature.setProperty([SimpleMap.LABELLAYER], i + 1);
                        thiss.layer.getSource().addFeature(feature);
                    }
                };
                SimpleMap.prototype.addInteraction = function (options) {
                };
                SimpleMap.prototype.drawPoint = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Point' });
                };
                SimpleMap.prototype.drawPolyline = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'LineString' });
                };
                SimpleMap.prototype.drawPolylineFreeHand = function () {
                    this.resetContainers();
                    this.addInteraction({
                        type: 'LineString',
                        freehandCondition: ol.events.condition.noModifierKeys,
                        condition: ol.events.condition.singleClick
                    });
                };
                SimpleMap.prototype.drawRectangle = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'LineString', maxPoints: 2, geometryFunction: this.drawBox });
                };
                SimpleMap.prototype.drawCircle = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Circle' });
                };
                SimpleMap.prototype.drawEllipse = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Circle' });
                };
                SimpleMap.prototype.drawPolygon = function () {
                    this.resetContainers();
                    this.addInteraction({ type: 'Polygon' });
                };
                SimpleMap.prototype.drawPolygonFreeHand = function () {
                    this.resetContainers();
                    this.addInteraction({
                        type: 'Polygon',
                        freehandCondition: ol.events.condition.noModifierKeys,
                        condition: ol.events.condition.singleClick
                    });
                };
                SimpleMap.prototype.sincLayer2Dom = function (layer, dom, joinField) {
                };
                SimpleMap.prototype.sincDom2Layer = function (dom, layer, joinField) {
                };
                SimpleMap.prototype.callbackExtent = function () {
                    var extent = this.map.getView().get('initialExtent');
                    this.map.getView().fit(extent, this.map.getSize(), true);
                };
                SimpleMap.prototype.callbackZoomIn = function () {
                    this.zoomByDelta(1);
                };
                SimpleMap.prototype.callbackZoomOut = function () {
                    this.zoomByDelta(-1);
                };
                SimpleMap.prototype.capturePoint = function (options, callback) {
                    var thiss = this;
                    options = options || {};
                    thiss.map.once("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        var geometry = {
                            type: SimpleMap.OGCTYPES.POINT,
                            coordinates: e.coordinate,
                            spatialReference: { id: e.map.getView().getProjection().getWKID() }
                        };
                        if (typeof callback === "function")
                            callback(geometry);
                    });
                    //thiss.map.dispatchEvent("click");
                };
                SimpleMap.prototype.changeVisibility = function (id) {
                    var thiss = this;
                    thiss.map.getLayers().forEach(function (layer) {
                        if (id == layer.get('id')) {
                            layer.setVisible(true);
                        }
                        else {
                            if (String.isNullOrWhiteSpace(layer.get('id')) === false && layer.get("id").startsWith("basemap_") === true) {
                                layer.setVisible(false);
                            }
                        }
                    });
                };
                SimpleMap.prototype.currentBasemap = function () {
                    var thiss = this;
                    thiss.map.getLayers().forEach(function (layer) {
                        if (String.isNullOrWhiteSpace(layer.get('id')) === false && layer.get("id").startsWith("basemap_") === true) {
                            if (layer.getVisible() === true)
                                thiss.$baseMaps.find('input#' + layer.get("id")).attr('checked', true);
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