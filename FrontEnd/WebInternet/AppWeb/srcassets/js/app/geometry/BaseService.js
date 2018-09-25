var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseService = (function () {
                function BaseService(map) {
                    this.map = map;
                    this._base64Prefix = 'data:image/png;base64,';
                    this._emptyImage = "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    this.getUUID = function () {
                        return com.jtm.helper.Random.getUUID();
                    };
                    this.tile2quad = function (x, y, z) {
                        var quad = '';
                        for (var i = z; i > 0; i--) {
                            var digit = 0;
                            var mask = 1 << (i - 1);
                            if ((x & mask) !== 0) digit += 1;
                            if ((y & mask) !== 0) digit += 2;
                            quad = quad + digit;
                        }
                        return quad;
                    };
                    this.parseOperationalsEnabled = function (services, services2) {
                        var i = 0;
                        var j = 0;
                        for (i = 0; i < services.length; i++) {
                            if (services[i].disabled === true) continue;
                            //if (typeof services[i] === "string")
                            services2.push(JSON.parse(JSON.stringify(services[i])));
                            var hasChild = (services[i].services !== undefined && services[i].services !== null);
                            if (hasChild) {
                                services2[services2.length - 1].services = [];
                                this.parseOperationalsEnabled(services[i].services, services2[services2.length - 1].services);
                            }
                            else {
                                if (services[i].groups !== undefined && services[i].groups !== null && services[i].groups instanceof Array) {
                                    services2[services2.length - 1].groups = [];
                                    j = 0;
                                    for (j = 0; j < services[i].groups.length; j++) {
                                        if (services[i].groups[j].disabled === true) continue;
                                        services2[services2.length - 1].groups.push(services[i].groups[j]);
                                    }
                                }
                            }
                            j = services2.length - 1;
                            if ((services2[j].services instanceof Array && services2[j].services.length === 0) || (services2[j].groups instanceof Array && services2[j].groups.length === 0)) {
                                services2.pop();
                            }
                        }
                    };
                    this.parseOperationals = function (services, id) {
                        var i = 0;
                        var uuid = '';
                        for (i = 0; i < services.length; i++) {
                            uuid = this.getUUID();
                            services[i].uuid = uuid;
                            services[i].id = (id === undefined || id === null ? "map_" + services[i].uuid : (id + "_" + i));
                            services[i].disabled = false;
                            var hasChild = (services[i].services !== undefined && services[i].services !== null);
                            if (hasChild) {
                                parseOperationals(services[i].services, services[i].id);
                            }
                            else {
                                if (services[i].type === undefined || services[i].type === null || services[i].type === "") continue;
                                services[i].url = services[i].url.startsWith("http") === true ? services[i].url : (services[i].sameDomain === true ? com.jtm.Server.root : com.jtm.Server.contextPath) + services[i].url;
                                if (services[i].groups !== undefined && services[i].groups !== null && services[i].groups instanceof Array) {
                                    var j = 0;
                                    for (j = 0; j < services[i].groups.length; j++) {
                                        uuid = this.getUUID();
                                        services[i].groups[j].uuid = uuid;
                                        services[i].groups[j].id = "map_" + services[i].groups[j].uuid;
                                        services[i].groups[j].type = services[i].type;
                                        services[i].groups[j].url = services[i].url;
                                        services[i].groups[j].layerIds = (services[i].groups[j].layerIds === undefined || services[i].groups[j].layerIds === null || services[i].groups[j].layerIds === "") ? [] : services[i].groups[j].layerIds;
                                        services[i].groups[j].layerIds = (services[i].groups[j].layerIds instanceof Array ? services[i].groups[j].layerIds : services[i].groups[j].layerIds.split(","));
                                        services[i].groups[j].layerIds = (services[i].groups[j].layerIds.length === 1 && services[i].groups[j].layerIds[0] == "*") ? [] : services[i].groups[j].layerIds;
                                        services[i].groups[j].layerIds = this.getLayerIds(services[i].groups[j].layerIds);
                                        services[i].groups[j].disabled = false;
                                        services[i].groups[j].service = null;
                                        console.log('groups');
                                        switch (services[i].groups[j].type) {
                                            case "wms":
                                                this.buildWmsLayer(services[i].groups[j]);
                                                break;
                                            case "wfs":
                                                this.buildWfsLayer(services[i].groups[j]);
                                                break;
                                            case "agsd":
                                                this.buildAgsDynamicLayer(services[i].groups[j]);
                                                break;
                                            case "agst":
                                                this.buildAgsTiledLayer(services[i].groups[j]);
                                                break;
                                            case "agsf":
                                                this.buildAgsFeatureLayer(services[i].groups[j]);
                                                break;
                                            default:
                                        }
                                        if (services[i].groups[j].service !== null) {
                                            this.map.addLayer(services[i].groups[j].service);
                                        }
                                        delete services[i].groups[j].service;
                                    }
                                }
                                else {
                                    services[i].layerIds = (services[i].layerIds === undefined || services[i].layerIds === null || services[i].layerIds === "") ? [] : services[i].layerIds;
                                    services[i].layerIds = (services[i].layerIds instanceof Array ? services[i].layerIds : services[i].layerIds.split(","));
                                    services[i].layerIds = (services[i].layerIds.length === 1 && services[i].layerIds[0] == "*") ? [] : services[i].layerIds;
                                    services[i].layerIds = this.getLayerIds(services[i].layerIds);
                                    services[i].service = null;
                                    switch (services[i].type) {
                                        case "wms":
                                            this.buildWmsLayer(services[i]);
                                            break;
                                        case "wfs":
                                            this.buildWfsLayer(services[i]);
                                            break;
                                        case "agsd":
                                            this.buildAgsDynamicLayer(services[i]);
                                            break;
                                        case "agst":
                                            this.buildAgsTiledLayer(services[i]);
                                            break;
                                        case "agsf":
                                            this.buildAgsFeatureLayer(services[i]);
                                            break;
                                        default:
                                    }
                                    if (services[i].services instanceof Array)
                                    {
                                        //console.log('services');
                                        var layers = services[i].services;
                                        this.map.addLayers(layers);
                                        delete services[i].services;
                                    }
                                    if (services[i].service !== null) {
                                        //console.log('service');
                                        var layer = services[i].service;
                                        this.map.addLayer(layer);
                                        //if (services[i].type != "wms") return;
                                        //layer.on('click', function (e) {
                                        //console.log(111);
                                        //thiss.onMouseClickGraphicToElement(e.graphic, null, null);
                                        //});
                                    }
                                    delete services[i].service;
                                }
                            }
                        }
                    };
                    this.getLayerIds = function (layerIds) {
                        var layerIds2 = [];
                        var k = 0;
                        for (k = 0; k < layerIds.length; k++) {
                            if (typeof layerIds[k] === "object") {
                                if (layerIds[k].disabled === true) continue;
                                layerIds2.push((isNaN(layerIds[k].id) ? String(layerIds[k].id).trim() : Number(layerIds[k].id)));
                            }
                            else {
                                layerIds2.push((isNaN(layerIds[k]) ? String(layerIds[k]).trim() : Number(layerIds[k])));
                            }
                        }
                        return layerIds2;
                    };
                    this.parseService = function (service) {
                        service.uuid = this.getUUID();
                        service.id = "basemap_" + service.uuid;
                        service.icon = String.isNullOrWhiteSpace(service.icon) ? '' : service.icon;
                        service.icon = (service.icon.startsWith("http") ? service.icon : com.jtm.System.img + service.icon);
                    };
                }
                BaseService.prototype.Base = function (services) {
                    var i = 0;
                    var j = 0;
                    var service = null;
                    for (i = 0; i < services.length; i++) {
                        if (services[i].disabled === true) continue;
                        if (services[i].type == "LocalMap")
                            for (j = 0; j < services[i].items.length; j++) {
                                if (services[i].items[j].disabled === true) continue;
                                this.parseService(services[i].items[j]);
                                services[i].items[j].extension = (services[i].items[j].isFile === true) ? '.png' : '';
                                services[i].items[j].url = String.isNullOrWhiteSpace(services[i].items[j].url) ? com.jtm.Server.contextPath + "tile/road/" : services[i].items[j].url;
                                services[i].items[j].url = services[i].items[j].url.startsWith("http") ? services[i].items[j].url : com.jtm.Server.contextPath + services[i].items[j].url;
                                services[i].items[j].service = null;
                                this.buildLocalLayer(services[i].items[j]);
                                if (services[i].items[j].service !== null)
                                    this.map.addLayer(services[i].items[j].service);
                                delete services[i].items[j].service;
                            }
                        else if (services[i].type == "EmbeddedMap") {
                            if (window.sqlitePlugin === undefined) {
                                services[i].disabled === true;
                                continue;
                            }
                            for (j = 0; j < services[i].items.length; j++) {
                                if (services[i].items[j].disabled === true) continue;
                                this.parseService(services[i].items[j]);
                                services[i].items[j].service = null;
                                services[i].items[j].db = window.sqlitePlugin.openDatabase({
                                    name: services[i].items[j].source,
                                    iosDatabaseLocation: 'default',
                                    createFromLocation: 1,
                                    androidDatabaseImplementation: 2,
                                    androidLockWorkaround: 1
                                });
                                this.buildEmbeddedLayer(services[i].items[j]);
                                if (services[i].items[j].service !== null)
                                    this.map.addLayer(services[i].items[j].service);
                                delete services[i].items[j].service;
                            }
                        }
                        else if (services[i].type == "GoogleMap")
                            for (j = 0; j < services[i].items.length; j++) {
                                if (services[i].items[j].disabled === true) continue;
                                this.parseService(services[i].items[j]);
                                services[i].items[j].service = null;
                                this.buildGoogleLayer(services[i].items[j]);
                                if (services[i].items[j].service !== null)
                                    this.map.addLayer(services[i].items[j].service);
                                delete services[i].items[j].service;
                            }
                        else if (services[i].type == "BingMap")
                            for (j = 0; j < services[i].items.length; j++) {
                                services[i].items[j].key = services[i].key;
                                if (services[i].items[j].disabled === true) continue;
                                this.parseService(services[i].items[j]);
                                services[i].items[j].service = null;
                                this.buildBingLayer(services[i].items[j]);
                                if (services[i].items[j].service !== null)
                                    this.map.addLayer(services[i].items[j].service);
                                delete services[i].items[j].service;
                            }
                        else if (services[i].type == "OSMap")
                            for (j = 0; j < services[i].items.length; j++) {
                                if (services[i].items[j].disabled === true) continue;
                                this.parseService(services[i].items[j]);
                                services[i].items[j].service = null;
                                this.buildOSMLayer(services[i].items[j]);
                                if (services[i].items[j].service !== null)
                                    this.map.addLayer(services[i].items[j].service);
                                delete services[i].items[j].service;
                            }
                        else {
                        }
                    }
                };
                BaseService.prototype.Operational = function (services, services2) {
                    var thiss = this;
                    $.ajax({
                        url: com.jtm.Server.contextPath + "geometry/layertable/searchbyoffice",
                        type: 'post',
                        data: {},
                        success: function (data) {
                            if (data === null) return;
                            data = JSON.parse(data);
                            if (data.items === null) return;
                            thiss.parseOperationalsEnabled(data.items, services2);
                            thiss.parseOperationals(services2);
                        },
                        error: function (data) { console.log(data); }
                    });
                };
                BaseService.prototype.buildAgsDynamicLayer = function (item) {
                };
                BaseService.prototype.buildWfsLayer = function (item) {
                };
                BaseService.prototype.buildAgsTiledLayer = function (item) {
                };
                BaseService.prototype.buildAgsFeatureLayer = function (item) {
                };
                BaseService.prototype.buildWmsLayer = function (item) {
                };
                BaseService.prototype.buildLocalLayer = function (item) {
                };
                BaseService.prototype.buildEmbeddedLayer = function (item) {
                };
                BaseService.prototype.buildGoogleLayer = function (item) {
                };
                BaseService.prototype.buildBingLayer = function (item) {
                };
                BaseService.prototype.buildOSMLayer = function (item) {
                };
                BaseService.prototype.buildYandexLayer = function (item) {
                };
                BaseService.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                    //console.log('entra');
                    _super.prototype.onMouseClickGraphicToElement.call(this, graphic, $dom, options);
                    //thiss.map.infoWindow.show(e.mapPoint);
                    this.map.infoWindow.hide();
                    this.map.infoWindow.clearFeatures();
                    this.map.infoWindow.setFeatures([graphic]);
                    this.map.infoWindow.setTitle(graphic.getTitle());
                    this.map.infoWindow.setContent(graphic.getContent());
                    this.map.infoWindow.show(graphic.geometry.getCentroid());
                };
                return BaseService;
            })(geometry.BaseGeometry);
            geometry.BaseService = BaseService || (BaseService = {});
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));