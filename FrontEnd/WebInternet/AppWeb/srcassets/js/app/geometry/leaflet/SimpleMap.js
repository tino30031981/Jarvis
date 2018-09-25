function getInstance() {
    return new com.jtm.geometry.SimpleMap();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var SimpleMap = (function (_super) {
                __extends(SimpleMap, _super);
                function SimpleMap() {
                    _super.call(this);
                }
                SimpleMap.prototype.reposition = function () {
                    var thiss = this;
                    if (thiss.map !== null)
                        thiss.map.updateSize();
                };
                SimpleMap.prototype.parseSymbols = function () {
                    var thiss = this;
                    //if (thiss.config.module.map.symbols === undefined || thiss.config.module.map.symbols === null) return;
                    thiss.config.module.map.symbols = {
                        'Point': {
                            "default": new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 7,
                                    fill: new ol.style.Fill({
                                        color: 'black'
                                    })
                                })
                            }),
                            "highlight": new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 7,
                                    fill: new ol.style.Fill({
                                        color: 'black'
                                    })
                                })
                            })
                        },
                        'LineString': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'green',
                                    lineDash: [10, 10],
                                    width: 1
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'green',
                                    lineDash: [10, 10],
                                    width: 1
                                })
                            })
                        },
                        'MultiLineString': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'green',
                                    lineDash: [10, 10],
                                    width: 1
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'green',
                                    lineDash: [10, 10],
                                    width: 1
                                })
                            })
                        },
                        'MultiPolygon': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#fff000',
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 0, 0.1)'
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#fff000',
                                    lineDash: [10, 10],
                                    width: 1
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 0, 0.1)'
                                })
                            })
                        },
                        'Polygon': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'blue',
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(0, 0, 255, 0.1)'
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'blue',
                                    lineDash: [4],
                                    width: 3
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(0, 0, 255, 0.1)'
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
                                })
                            })
                        },
                        'Circle': {
                            "default": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'red',
                                    lineDash: [10, 10],
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255,0,0,0.2)'
                                })
                            }),
                            "highlight": new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'red',
                                    lineDash: [10, 10],
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255,0,0,0.2)'
                                })
                            })
                        }
                    };
                };
                SimpleMap.prototype.newMap = function (dom, height) {
                    var thiss = this;
                    _super.prototype.newMap.call(this, dom, height);
                    return new ol.Map({
                        layers: [new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })],
                        target: thiss.$map[0],
                        view: new ol.View({
                            center: [0, 0],
                            zoom: 2
                        })
                    });
                };
                SimpleMap.prototype.initialExtent = function (map) {
                    var thiss = this;
                    _super.prototype.initialExtent.call(this, map);
                    var layer = null;
                    layer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            url: thiss.config.module.map.scopeLayer,
                            projection: thiss.mapDetail.getView().getProjection(),
                            format: new ol.format.GeoJSON()
                        }),
                        style: function (feature, resolution) {
                            return thiss.config.module.map.symbols[feature.getGeometry().getType()]["default"];
                        }
                    });
                    layer.on("change", function (e) {
                        var extent = layer.getSource().getExtent();
                        map.getView().fit(extent, map.getSize());
                    });
                    map.addLayer(layer);
                };
                SimpleMap.prototype.build = function (dom, height) {
                    var thiss = this;
                    thiss.map = thiss.newMap(dom, height);
                    thiss.initialExtent(thiss.map);
                    thiss.layer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        style: function (feature, resolution) {
                            return thiss.config.module.map.symbols[feature.getGeometry().getType()]["default"];
                        }
                    });
                    thiss.layer.getSource().on("addfeature", function (e) {
                        var extent = thiss.layer.getSource().getExtent();
                        thiss.map.getView().fit(extent, thiss.map.getSize());
                    });
                    thiss.map.addLayer(thiss.layer);
                };
                SimpleMap.prototype._addFeature = function (layer, json) {
                    if (json !== undefined && json !== null) {
                        var features = new ol.format.GeoJSON().readFeatures(json,
                            { featureProjection: thiss.mapDetail.getView().getProjection() });
                        layer.getSource().addFeatures(features);
                    }
                };
                SimpleMap.prototype.addFeatures = function (json) {
                    var thiss = this;
                    thiss.addFeature(thiss.layer, json);
                };
                SimpleMap.prototype.sincLayer2Dom = function (layer, dom, joinField) {
                };
                SimpleMap.prototype.sincDom2Layer = function (dom, layer, joinField) {
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