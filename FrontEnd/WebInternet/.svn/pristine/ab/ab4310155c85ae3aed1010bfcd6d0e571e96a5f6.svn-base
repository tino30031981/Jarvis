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
                    var infos = {};
                    for (var i = 0; i < item.layerIds.length ; i++) {
                        infos[i] = { infoTemplate: new esri.InfoTemplate(item.label + ' ' + item.layerIds[i] || '', "${*}") };
                    }
                    item.service = new esri.layers.ArcGISDynamicMapServiceLayer(item.url, {
                        opacity: item.alpha,
                        visible: item.visible,
                        infoTemplates: infos,
                        id: item.id
                    });
                };
                Service.prototype.buildWfsLayer = function (item) {
                    if (item.layerIds.length > 1) {
                        //console.log('if');
                        //console.log('ids');
                        item.services = [item.layerIds.length];
                        //console.log(item.services);
                        for (var z = 0; z < item.layerIds.length; z++) {
                            item.services[z] = new esri.layers.WFSLayer();
                            var opts = {
                                "url": item.url,
                                "version": "2.0.0",
                                "name": item.layerIds[z],
                                "maxFeatures" : 1000,
                                "wkid": 3857
                            };
                            item.services[z].visible = item.visible;
                            item.services[z].alpha = item.alpha;
                            item.services[z].id = item.layerIds[z] + "_" + item.id;
                            item.services[z].infoTemplate = new esri.InfoTemplate(item.layerIds[z] || '', "${*}");
                            item.services[z].fromJson(opts);
                            //console.log(item.layerIds[z]);
                            //console.log(item.services[z]);
                        }
                    }
                    else {
                        //console.log('else');
                        item.service = new esri.layers.WFSLayer();
                        var opts = {
                            "url": item.url,
                            "version": "2.0.0",
                            "name": item.layerIds.join(""),
                            "maxFeatures": 1000,
                            "wkid": 3857
                        };
                        item.service.visible = item.visible;
                        item.service.alpha = item.alpha;
                        item.service.id = item.layerIds.join("") + "_" + item.id;
                        item.service.infoTemplate = new esri.InfoTemplate(item.layerIds.join("") || '', "${*}");
                        item.service.fromJson(opts);
                        /*item.service = new esri.layers.WFSLayer({
                            url: item.url,
                            version: "2.0.0",
                            name: item.layerIds.join('|'),
                            infoTemplate: new esri.InfoTemplate(item.label || '', "${*}"),
                            wkid: 3857
                        });
                        item.service.visible = item.visible;
                        item.service.alpha = item.alpha;
                        item.service.id = item.id + item.layerIds;*/
                    }
                    //console.log(item);
                    /*item.service = new esri.layers.WFSLayer();
                    var opts = {
                        "url": item.url,
                        "version": "2.0.0",
                        "name": item.layerIds.join(","),
                        "wkid": 3857
                    };
                    item.service.visible = item.visible;
                    item.service.id = item.id;
                    item.service.infoTemplate = new esri.InfoTemplate(item.label || '', "${*}");
                    item.service.fromJson(opts);
                    */
                    //guardar porque en algun momento no funciono
                    /*item.service = new esri.layers.WFSLayer({
                        url: item.url
                    });
                    item.showDetails = true,
                    item.name = item.layerIds.join("|");
                    item.service.infoTemplate = new esri.InfoTemplate(item.label || '', "${*}");
                    item.service.id = item.id;
                    if (item.layerIds.length > 0)
                        item.service.visible = true;*/
                };
                Service.prototype.buildAgsTiledLayer = function (item) {
                    item.service = new esri.layers.ArcGISTiledMapServiceLayer(item.url, {
                        opacity: item.alpha,
                        visible: item.visible,
                        id: item.id
                    });
                };
                Service.prototype.buildAgsFeatureLayer = function (item) {
                    item.service = new esri.layers.FeatureLayer(item.url, {
                        opacity: item.alpha,
                        visible: item.visible,
                        id: item.id,
                        outFields: ["*"],
                        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
                    });
                };
                Service.prototype.buildWmsLayer = function (item) {
                    item.service = new esri.layers.WMSLayer(item.url, {
                        format: "png"
                    });
                    item.service.setOpacity(item.alpha);
                    item.service.setVisibility(item.visible);
                    item.service.id = item.id;
                    if (item.layerIds.length > 0)
                        item.service.setVisibleLayers(item.layerIds);
                };
                Service.prototype.buildLocalLayer = function (item) {
                    if (item.style == "ROADMAP") {
                    }
                };
                Service.prototype.buildGoogleLayer = function (item) {
                    //"http://${subDomain}.mqcdn.com/tiles/1.0.0/vx/map/${level}/${col}/${row}.jpg"
                    var subDomains = ["0", "1", "2", "3"];
                    if (item.style == "ROADMAP") {
                        item.service = new esri.layers.WebTiledLayer("http://mt${subDomain}.google.com/vt/lyrs=m&hl=es&gl=es&x=${col}&y=${row}&z=${level}&s=png", {
                            id: item.id,
                            subDomains: subDomains,
                            copyright: "google"
                        });
                    }
                    else if (item.style == "SATELLITE") {
                        item.service = new esri.layers.WebTiledLayer("http://mt${subDomain}.google.com/vt/lyrs=s&hl=es&gl=es&x=${col}&y=${row}&z=${level}&s=png", {
                            "id": item.id,
                            "subDomains": subDomains,
                            "copyright": "google"
                        });
                    } else if (item.style == "TERRAIN") {
                        item.service = new esri.layers.WebTiledLayer("http://mt${subDomain}.google.com/vt/lyrs=t,r&hl=es&gl=es&x=${col}&y=${row}&z=${level}&s=png", {
                            "id": item.id,
                            "subDomains": subDomains,
                            "copyright": "google"
                        });
                    } else if (item.style == "HYBRID") {
                        item.service = new esri.layers.WebTiledLayer("http://mt${subDomain}.google.com/vt/lyrs=s,h&hl=es&gl=es&x=${col}&y=${row}&z=${level}&s=png", {
                            "id": item.id,
                            "subDomains": subDomains,
                            "copyright": "google"
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.spatialReference = this.map.spatialReference;
                        item.service.setVisibility(item.visible);
                    }
                };
                Service.prototype.buildBingLayer = function (item) {
                    if (item.style == "Road") {
                        item.service = new esri.virtualearth.VETiledLayer({
                            bingMapsKey: item.key,
                            culture: 'es-ES',
                            mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD
                        });
                    }
                    else if (item.style == "Aerial") {
                        item.service = new esri.virtualearth.VETiledLayer({
                            bingMapsKey: item.key,
                            culture: 'es-ES',
                            mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL
                        });
                    }
                    else if (item.style == "AerialWithLabels") {
                        item.service = new esri.virtualearth.VETiledLayer({
                            bingMapsKey: item.key,
                            culture: 'es-ES',
                            mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.spatialReference = this.map.spatialReference;
                        item.service.setVisibility(item.visible);
                    }
                };
                Service.prototype.buildOSMLayer = function (item) {
                    if (item.style == "Mapnik") {
                        item.service = new esri.layers.OpenStreetMapLayer();
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.spatialReference = this.map.spatialReference;
                        item.service.setVisibility(item.visible);
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