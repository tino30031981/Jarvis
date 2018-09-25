var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this.infoWindow = null;
                    this.setInfoWindow = function () {
                        if (this.infoWindow === null) {
                            this.infoWindow = new ol.Overlay.Popup({ id: Map.INFOWINDOW });
                            this.map.addOverlay(this.infoWindow);
                        }
                    }
                }
                Map.prototype.build = function () {
                    var thiss = this;
                    _super.prototype.build.call(this);
                    var projection = ol.proj.get("EPSG:" + thiss.config.module.map.projectionCode);
                    var extent = [thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum, thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum];//new ol.Extent
                    thiss.map = new ol.Map({
                        loadTilesWhileInteracting: true,
                        loadTilesWhileAnimating: true,
                        controls: [],
                        interactions: ol.interaction.defaults({
                            dragPan: true,
                            mouseWheelZoom: true
                        }),
                        target: thiss.$map[0],
                        view: new ol.View({
                            projection: projection,
                            enableRotation: true,
                            maxResolution: 40075016.68557849 / 256,
                            zoom: 0
                        })
                    });
                    thiss.setServices();
                    thiss.map.once('postrender', function (e) {
                        thiss.map.getView().set('initialExtent', extent);
                        thiss.map.getView().fit(extent, thiss.map.getSize(), true);
                        defaultControls();
                        thiss.setToolbar();
                    });
                    jQuery(window).on("resize", function () {
                        setTimeout(function () {
                            thiss.map.getView().fit(extent, thiss.map.getSize(), true);
                            //thiss.map.updateSize();
                        }, 200);
                    });
                    thiss.setOverView();
                    this.setInfoWindow();
                    function defaultControls() {
                        var attribution = new ol.control.Attribution({
                            collapsible: false
                        });
                        thiss.map.addControl(attribution);
                    }
                };
                Map.prototype.parseSymbols = function () {
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
                Map.prototype.setOverView = function () {
                    var thiss = this;
                    if (thiss.config.module.withOverview === true) {
                        var control = new ol.control.OverviewMap({
                            className: 'ol-overviewmap ol-custom-overviewmap',
                            collapsed: true,
                            collapseLabel: '\u00BB',
                            label: '\u00AB',
                        });
                        thiss.map.addControl(control);
                    }
                };
                Map.prototype.setCorsServers = function (items) {
                };
                Map.prototype.setProxy = function (proxy) {
                    if (String.isNullOrWhiteSpace(proxy) !== true) {
                        ol.proxyUrl = proxy;
                    }
                };
                Map.prototype.setGeometryService = function (geometryService) {
                    //require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
                    //    esriConfig.defaults.geometryService = new GeometryService(geometryService.url);
                    //});
                };
                return Map;
            })(geometry.BaseMap);
            geometry.Map = Map;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));