var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Service = (function (_super) {
                __extends(Service, _super);
                function Service(map) {
                    _super.call(this, map);
                }
                Service.prototype.buildAgsDynamicLayer = function (item) {
                    var layerIds = (item.layerIds instanceof Array) ? item.layerIds.join(",") : item.layerIds;
                    item.service = new ol.layer.Tile({
                        source: new ol.source.TileArcGISRest({
                            url: item.url,
                            crossOrigin: 'anonymous',
                            params: {
                                'LAYERS': 'show:' + layerIds,
                                'F': 'image',
                                'FORMAT': 'PNG32',
                                'TRANSPARENT': 'true',
                                'BBOXSR': this.map.getView().getProjection().getCode(),
                                'IMAGESR': this.map.getView().getProjection().getCode(),
                                'SIZE': '256,256',
                                'DPI': 90
                            },
                            tileLoadFunction: function (tile, src) {
                                jQuery.get(src).done(function (data) {
                                    tile.getImage().src = src;
                                });
                            }
                        })
                    });
                    item.service.set("id", item.id);
                    item.service.set("projection", this.map.getView().getProjection(), true);
                    item.service.setVisible(item.visible);
                };
                Service.prototype.buildAgsTiledLayer = function (item) {
                    var layerIds = (item.layerIds instanceof Array) ? item.layerIds.join(",") : item.layerIds;
                    item.service = new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            crossOrigin: 'anonymous',
                            attributions: 'ArcGIS',
                            url: item.url + '/tile/{z}/{y}/{x}',
                            tilePixelRatio: 2,
                            tileLoadFunction: function (tile, src) {
                                jQuery.get(src).done(function (data) {
                                    tile.getImage().src = src;
                                });
                            }
                        })
                    });
                    item.service.set("id", item.id);
                    item.service.set("projection", this.map.getView().getProjection(), true);
                    item.service.setVisible(item.visible);
                };
                Service.prototype.buildAgsFeatureLayer = function (item) {
                    var layerIds = (item.layerIds instanceof Array) ? item.layerIds.join(",") : item.layerIds;
                    var esrijsonFormat = new ol.format.EsriJSON();
                    item.service = new ol.layer.Vector({
                        //style: function (feature) {
                        //    var classify = feature.get('activeprod');
                        //    return styles[classify];
                        //},
                        source: new ol.source.Vector({
                            loader: function (extent, resolution, projection) {
                                var url = item.url + layerIds + '/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                                    encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' + extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                                        ',"spatialReference":{"wkid":' + projection.getCode() + '}}') + '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
                                    '&outSR=' + projection.getCode();
                                jQuery.ajax({
                                    url: url, dataType: 'jsonp', success: function (response) {
                                        if (response.error) {
                                            alert(response.error.message + '\n' +
                                                response.error.details.join('\n'));
                                        } else {
                                            // dataProjection will be read from document
                                            var features = esrijsonFormat.readFeatures(response, {
                                                featureProjection: projection
                                            });
                                            if (features.length > 0) {
                                                item.service.getSource().addFeatures(features);
                                            }
                                        }
                                    }
                                });
                            },
                            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                                tileSize: 512
                            }))
                        })
                    });
                };
                Service.prototype.buildWmsLayer = function (item) {
                    var layerIds = (item.layerIds instanceof Array) ? item.layerIds.join(",") : item.layerIds;
                    item.service = new ol.layer.Tile({
                        source: new ol.source.TileWMS({
                            url: item.url,
                            //							      crossOrigin: 'anonymous',
                            params: { LAYERS: layerIds, TILED: true, VERSION: '1.3.0' },
                            tileLoadFunction: function (tile, src) {
                                jQuery.get(src).done(function (data) {
                                    tile.getImage().src = src;
                                });
                            }
                        })
                    });
                    item.service.set("id", item.id);
                    item.service.set("projection", this.map.getView().getProjection(), true);
                    item.service.setVisible(item.visible);
                };
                Service.prototype.buildLocalLayer = function (item) {
                    if (item.style == "ROADMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: item.url + "{z}/{x}/{y}" + item.extension
                            })
                        });
                    }
                    if (item.service !== null) {
                        item.service.set("id", item.id);
                        item.service.set("projection", this.map.getView().getProjection(), true);
                        item.service.setVisible(item.visible);
                        item.service.getSource().setTileLoadFunction(function (tile, src) {
                            jQuery.get(src).done(function (data) {
                                tile.getImage().src = src;
                            });
                        });
                    }
                };
                Service.prototype.buildEmbeddedLayer = function (item) {
                    var thiss = this;
                    var projection = thiss.map.getView().getProjection();
                    var projectionExtent = projection.getExtent();
                    var tileSize = 256;
                    var maxResolution = ol.extent.getWidth(projectionExtent) / (tileSize * 2);
                    var resolutions = [];
                    var z = 0;
                    for (z = 0; z < 19; ++z) {
                        resolutions[z] = maxResolution / Math.pow(2, z);
                    }
                    if (item.style == "ROADMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                tileGrid: new ol.tilegrid.TileGrid({
                                    origin: ol.extent.getBottomLeft(projectionExtent),
                                    resolutions: resolutions,
                                    extent: projectionExtent
                                })
                            })
                        });
                        if (item.service !== null) {
                            item.service.set("id", item.id);
                            item.service.set("projection", this.map.getView().getProjection(), true);
                            item.service.setVisible(item.visible);
                            item.service.getSource().setTileUrlFunction(function (tileCoord) {
                                return "";
                            });
                            item.service.getSource().setTileLoadFunction(function (tile, src) {
                                var tileCoord = tile.getTileCoord();
                                var z = tileCoord[0] + 1;
                                var x = tileCoord[1];
                                var y = tileCoord[2];
                                item.db.executeSql("SELECT tile_data as data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?;", [z, x, y], function (rs) {
                                    if (rs.rows.length === 0) {
                                        tile.getImage().src = thiss._emptyImage;
                                        return;
                                    }
                                    tile.getImage().src = thiss._base64Prefix + rs.rows.item(0).data;
                                }, function (error) {
                                    tile.getImage().src = thiss._emptyImage;
                                });
                            });
                        }
                    }
                };
                Service.prototype.buildGoogleLayer = function (item) {
                    //"http://${subDomain}.mqcdn.com/tiles/1.0.0/vx/map/${level}/${col}/${row}.jpg"
                    if (item.style == "ROADMAP") {
                        item.service = new ol.layer.Tile(
                            {
                                source: new ol.source.XYZ(
                                    {
                                        crossOrigin: 'anonymous',
                                        attributions: [''],
                                        url: 'http://mt{0-3}.google.com/vt/lyrs=m&hl=es&gl=es&x={x}&y={y}&z={z}&s=png'
                                    })
                            });
                    } else if (item.style == "SATELLITE") {
                        item.service = new ol.layer.Tile(
                            {
                                source: new ol.source.XYZ(
                                    {
                                        crossOrigin: 'anonymous',
                                        attributions: [''],
                                        url: 'http://mt{0-3}.google.com/vt/lyrs=s&hl=es&gl=es&x={x}&y={y}&z={z}&s=png'
                                    })
                            });
                    } else if (item.style == "TERRAIN") {
                        item.service = new ol.layer.Tile(
                            {
                                source: new ol.source.XYZ(
                                    {
                                        crossOrigin: 'anonymous',
                                        attributions: [''],
                                        url: 'http://mt{0-3}.google.com/vt/lyrs=t,r&hl=es&gl=es&x={x}&y={y}&z={z}&s=png'
                                    })
                            });
                    } else if (item.style == "HYBRID") {
                        item.service = new ol.layer.Tile(
                            {
                                source: new ol.source.XYZ(
                                    {
                                        crossOrigin: 'anonymous',
                                        attributions: [''],
                                        url: 'http://mt{0-3}.google.com/vt/lyrs=s,h&hl=es&gl=es&x={x}&y={y}&z={z}&s=png'
                                    })
                            });
                    }
                    if (item.service !== null) {
                        item.service.set("id", item.id);
                        item.service.set("projection", this.map.getView().getProjection(), true);
                        item.service.setVisible(item.visible);
                        item.service.getSource().setTileLoadFunction(function (tile, src) {
                            jQuery.get(src).done(function (data) {
                                tile.getImage().src = src;
                            });
                        });
                    }
                };
                Service.prototype.buildBingLayer = function (item) {
                    if (item.style == "Road") {
                        item.service = new ol.layer.Tile({
                            visible: false,
                            preload: Infinity,
                            source: new ol.source.BingMaps({
                                key: item.key,
                                imagerySet: "Road",
                                culture: 'es-ES'
                                // use maxZoom 19 to see stretched tiles
                                // instead of the BingMaps
                                // "no photos at this zoom level" tiles
                                // maxZoom: 19
                            })
                        });
                    } else if (item.style == "Aerial") {
                        item.service = new ol.layer.Tile({
                            visible: false,
                            preload: Infinity,
                            source: new ol.source.BingMaps({
                                key: item.key,
                                imagerySet: "Aerial"
                                // use maxZoom 19 to see stretched tiles
                                // instead of the BingMaps
                                // "no photos at this zoom level" tiles
                                // maxZoom: 19
                            })
                        });
                    } else if (item.style == "AerialWithLabels") {
                        item.service = new ol.layer.Tile({
                            visible: false,
                            preload: Infinity,
                            source: new ol.source.BingMaps({
                                key: item.key,
                                imagerySet: "AerialWithLabels"
                                // use maxZoom 19 to see stretched tiles
                                // instead of the BingMaps
                                // "no photos at this zoom level" tiles
                                // maxZoom: 19
                            })
                        });
                    }

                    if (item.service !== null) {
                        item.service.set("id", item.id);
                        item.service.set("projection", this.map.getView().getProjection(), true);
                        item.service.setVisible(item.visible);
                        item.service.getSource().setTileLoadFunction(function (tile, src) {
                            jQuery.get(src).done(function (data) {
                                tile.getImage().src = src;
                            });
                        });
                    }
                };
                Service.prototype.buildOSMLayer = function (item) {
                    if (item.style == "Mapnik") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.OSM({
                                layer: item.label
                            })
                        });
                    }
                    /*new ol.layer.Tile({
                        source: new ol.source.MapQuest({
                            layer: 'sat'
                        })*/
                    // else if (item.style == "OpenCycleMap") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    // "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    // "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]);
                    // }
                    // else if (item.style == "TransportMap") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // [
                    // "http://a.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",
                    // "http://b.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",
                    // "http://c.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png"
                    // ]
                    // );
                    // }

                    // else if (item.style == "MapQuest") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    // "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    // "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    // "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"]);
                    // }
                    // else if (item.style == "MapQuestAerial") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                    // "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                    // "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                    // "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
                    // }
                    // else if (item.style == "MapQuestHybrid") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://otile1.mqcdn.com/tiles/1.0.0/hyb/${z}/${x}/${y}.jpg",
                    // "http://otile2.mqcdn.com/tiles/1.0.0/hyb/${z}/${x}/${y}.jpg",
                    // "http://otile3.mqcdn.com/tiles/1.0.0/hyb/${z}/${x}/${y}.jpg",
                    // "http://otile4.mqcdn.com/tiles/1.0.0/hyb/${z}/${x}/${y}.jpg"]);
                    // }
                    // else if (item.style == "Humanitarian") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png",
                    // "http://b.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png",
                    // "http://c.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png"],
                    // { "tileOptions": { "crossOriginKeyword": null }
                    // });
                    // }
                    // else if (item.style == "WaterColour") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://tile.stamen.com/watercolor/${z}/${x}/${y}.png"]);
                    // }
                    // else if (item.style == "Toner") {
                    // layer = new OpenLayers.Layer.OSM(item.label,
                    // ["http://tile.stamen.com/toner/${z}/${x}/${y}.png"]);
                    // }

                    if (item.service !== null) {
                        item.service.set("id", item.id);
                        item.service.set("projection", this.map.getView().getProjection(), true);
                        item.service.setVisible(item.visible);
                        item.service.getSource().setTileLoadFunction(function (tile, src) {
                            jQuery.get(src).done(function (data) {
                                tile.getImage().src = src;
                            });
                        });
                    }
                };
                Service.prototype.buildYandexLayer = function (item) {
                    if (item.style == "SCHEMAMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=map&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES'
                            })
                        });
                    }
                    else if (item.style == "SATELLITEMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=satellite&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES'
                            })
                        });
                    }
                    if (item.style == "HYBRIDMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=hybrid&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES'
                            })
                        });
                    }
                    if (item.style == "PUBLICMAP") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=publicMap&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES'
                            })
                        });
                    }
                    if (item.style == "PUBLICMAPINHYBDRIDVIEW") {
                        item.service = new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [''],
                                url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=publicMapHybrid&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES'
                            })
                        });
                    }
                    if (item.service !== null) {
                        item.service.set("id", item.id);
                        item.service.set("projection", this.map.getView().getProjection(), true);
                        item.service.setVisible(item.visible);
                        item.service.getSource().setTileLoadFunction(function (tile, src) {
                            jQuery.get(src).done(function (data) {
                                tile.getImage().src = src;
                            });
                        });
                    }
                };
                return Service;
            })(geometry.BaseService);
            geometry.Service = Service || (Service = {});
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));