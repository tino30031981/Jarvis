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
                    item.service.set("id", item.id);
                    item.service.setVisible(item.visible);
                };
                Service.prototype.buildAgsTiledLayer = function (item) {
                };
                Service.prototype.buildAgsFeatureLayer = function (item) {
                };
                Service.prototype.buildWmsLayer = function (item) {
                    var layerIds = (item.layerIds instanceof Array) ? item.layerIds.join(",") : item.layerIds;
                    item.service = new L.TileLayer.WMS(item.url, {
                        layers: layerIds,
                        format: 'image/png',
                        transparent: true,
                        attribution: "WMS",
                        version: "1.3.0",
                        uppercase: false
                    });
                    item.service.id = item.id;
                    item.service.crs = this.map.options.crs;
                    item.service.visible = (item.visible);
                };
                Service.prototype.buildGoogleLayer = function (item) {
                    var subdomains = [0, 1, 2, 3];
                    if (item.style == "ROADMAP") {
                        item.service = new L.TileLayer('http://mt{s}.google.com/vt/lyrs=m&hl=es&gl=es&x={x}&y={y}&z={z}&s=png', {
                            maxZoom: 18,
                            attribution: 'Google',
                            subdomains: subdomains
                        });
                    } else if (item.style == "SATELLITE") {
                        item.service = new L.TileLayer('http://mt{s}.google.com/vt/lyrs=s&hl=es&gl=es&x={x}&y={y}&z={z}&s=png', {
                            maxZoom: 18,
                            attribution: 'Google',
                            subdomains: subdomains
                        });
                    } else if (item.style == "TERRAIN") {
                        item.service = new L.TileLayer('http://mt{s}.google.com/vt/lyrs=t,r&hl=es&gl=es&x={x}&y={y}&z={z}&s=png', {
                            maxZoom: 18,
                            attribution: 'Google',
                            subdomains: subdomains
                        });
                    } else if (item.style == "HYBRID") {
                        item.service = new L.TileLayer('http://mt{s}.google.com/vt/lyrs=s,h&hl=es&gl=es&x={x}&y={y}&z={z}&s=png', {
                            maxZoom: 18,
                            attribution: 'Google',
                            subdomains: subdomains
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.crs = this.map.options.crs;
                        item.service.visible = (item.visible);
                    }
                };
                Service.prototype.buildBingLayer = function (item) {
                    var subdomains = [0, 1, 2, 3];
                    if (item.style == "Road") {
                        item.service = new L.TileLayer('http://ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}.png?mkt=es-es&it=G,VE,BX,L,LA&shading=hill&og=125&n=z', {
                            maxZoom: 18,
                            attribution: 'Bing',
                            subdomains: subdomains
                        });
                    } else if (item.style == "Aerial") {
                        item.service = new L.TileLayer('http://ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}.png?&it=A&shading=hill&og=125&n=z', {
                            maxZoom: 18,
                            attribution: 'Bing',
                            subdomains: subdomains
                        });
                    } else if (item.style == "AerialWithLabels") {
                        item.service = new L.TileLayer('http://ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}.png?mkt=es-es&it=A,G,L,LA&shading=hill&og=125&n=z', {
                            maxZoom: 18,
                            attribution: 'Bing',
                            subdomains: subdomains
                        });
                    } else if (item.style == "SVAerial") {
                        item.service = new L.TileLayer('http://ak.t{s}.tiles.virtualearth.net/tiles/cmd/svhybrid?a={q}&g=10000&dir=dir_n&n=z', {
                            maxZoom: 18,
                            attribution: 'Bing',
                            subdomains: subdomains
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.crs = this.map.options.crs;
                        item.service.visible = (item.visible);
                    }
                };
                Service.prototype.buildOSMLayer = function (item) {
                    if (item.style == "Mapnik") {
                        item.service = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                            attribution: 'OpenStreetMap'
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.crs = this.map.options.crs;
                        item.service.visible = (item.visible);
                    }
                };
                Service.prototype.buildYandexLayer = function (item) {
                    var subdomains = [1, 2, 3, 4];
                    if (item.style == "MAP") {
                        item.service = new L.TileLayer('https://vec0{s}.maps.yandex.net/tiles?l=map&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES', {
                            maxZoom: 18,
                            attribution: 'Yandex',
                            subdomains: subdomains
                        });
                    }
                    else if (item.style == "SATELLITE") {
                        item.service = new L.TileLayer('https://vec0{s}.maps.yandex.net/tiles?l=satellite&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES', {
                            maxZoom: 18,
                            attribution: 'Yandex',
                            subdomains: subdomains
                        });
                    }
                    else if (item.style == "HYBRID") {
                        item.service = new L.TileLayer('https://vec0{s}.maps.yandex.net/tiles?l=hybrid&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES', {
                            maxZoom: 18,
                            attribution: 'Yandex',
                            subdomains: subdomains
                        });
                    }
                    else if (item.style == "PUBLICMAP") {
                        item.service = new L.TileLayer('https://vec0{s}.maps.yandex.net/tiles?l=publicMap&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES', {
                            maxZoom: 18,
                            attribution: 'Yandex',
                            subdomains: subdomains
                        });
                    }
                    if (item.style == "PUBLICMAPHYBRID") {
                        item.service = new L.TileLayer('https://vec0{s}.maps.yandex.net/tiles?l=publicMapHybrid&v=4.93.0&x={x}&y={y}&z={z}&scale=1&lang=es_ES', {
                            maxZoom: 18,
                            attribution: 'Yandex',
                            subdomains: subdomains
                        });
                    }
                    if (item.service !== null) {
                        item.service.id = item.id;
                        item.service.crs = this.map.options.crs;
                        item.service.visible = (item.visible);
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