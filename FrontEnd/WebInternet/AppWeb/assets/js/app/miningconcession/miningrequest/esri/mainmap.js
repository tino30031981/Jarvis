function getInstance() {
    return com.jtm.miningconcession.miningrequest.MainMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningrequest) {
                var MainMap = (function (_super) {
                    __extends(MainMap, _super);
                    function MainMap() {
                        _super.call(this);
                        this.removePreview = function () {
                            var thiss = this;
                            if (thiss._layerPreview !== undefined && thiss._layerPreview !== null) {
                                thiss.map.removeLayer(thiss._layerPreview);
                                thiss._layerPreview = null;
                            }
                            thiss.map.graphicsLayerIds.forEach(function (layerId) {
                                if (layerId !== null && layerId.startsWith("overlap_") === true)
                                    thiss.map.removeLayer(thiss.map.getLayer(layerId));
                            });
                        };
                        this._layerConfig = function (options) {
                            var thiss = this;
                            options = options || {};
                            options.visible = (options.visible === undefined || options.visible === null) ? true : options.visible;
                            var thiss = this;
                            var layer = new esri.layers.GraphicsLayer({
                                style: function (feature, resolution) {
                                    return options.symbol || thiss.config.module.map.symbols[feature.geometry.type]["default"]
                                }
                            });
                            layer.setVisibility(options.visible);
                            layer.on("graphic-add", function (e) {
                                window.setTimeout(function () {
                                    var extent = esri.graphicsExtent(layer.graphics);
                                    thiss.map.setExtent(extent, true);
                                }, 1000);
                            });
                            thiss.map.addLayer(layer);
                            return layer;
                        };
                        this.loadServicesOnExtent = function (zone) {
                            var thiss = this;
                            for (var j in thiss.config.module.servicesOnExtent[zone]) {
                                var service = thiss.config.module.servicesOnExtent[zone][j];
                                var layer = new esri.layers.ArcGISDynamicMapServiceLayer(service.url, {
                                    visible: true
                                });
                                if (service.maxScale > 0)
                                    layer.setMaxScale(service.maxScale);
                                if (service.minScale > 0)
                                    layer.setMinScale(service.minScale);
                                layer.id = "image_" + thiss.getUUID();

                                thiss.map.addLayer(layer);
                            }
                        };
                        this.listZoneUTMs = function () {
                            var thiss = this;
                            var query = new esri.tasks.Query();
                            query.where = "1=1";
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            var task = new esri.tasks.QueryTask(thiss.config.module.serviceZoneUTM.url + "/" + thiss.config.module.serviceZoneUTM.layerId);
                            task.execute(query).addCallback(function (data) {
                                if (data === undefined || data === null) return;
                                data.features.forEach(function (feature) {
                                    feature.setId(feature.attributes.ZONE);
                                });
                                thiss._layerZoneUTM.addAll(data.features);
                                thiss.fillZoneUTMs(data.features);
                            });
                        };
                        this.fitExtentGrid = function (id) {
                            var thiss = this;
                            var extent = thiss._layerZoneUTM.getFeatureById(id).geometry.getExtent();
                            thiss.map.setExtent(extent);
                        };
                        this.fitExtentPreview = function (id) {
                            var thiss = this;
                            if (thiss._layerPreview === null) {
                                toastr.info("Aún no ha seleccionado las cuadrículas");
                                return;
                            }
                            var extent = thiss._layerPreview.getFeatureById(id).geometry.getExtent();
                            thiss.map.setExtent(extent, true);
                        };
                        this.getDataById = function (id) {
                            var thiss = this;
                            if (thiss._layerPreview === null) return null;
                            var feature = thiss._layerPreview.getFeatureById(id);
                            if (feature === null) return null;
                            var item = { coordinates: JSON.parse(feature.attributes["coordinates"]), spatialReference: { id: feature.attributes['srid'] } };
                            return item;
                        };
                        this.searchRestNationalCartographies = function (id) {
                            var thiss = this;
                            var geometry = thiss._layerZoneUTM.getFeatureById(id).geometry;
                            thiss.searchRestNationalCartographies2(geometry);
                        };
                        this.searchRestNationalCartographies2 = function (geometry) {
                            var thiss = this;
                            this._layerNationalCartography.clear();
                            var query = new esri.tasks.Query();
                            query.where = "1=1";
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            query.geometry = geometry;
                            query.orderByFields = ['CD_HOJA'];
                            var task = new esri.tasks.QueryTask(thiss.config.module.serviceNationalCartography.url + "/" + thiss.config.module.serviceNationalCartography.layerId);
                            task.execute(query).addCallback(function (data) {
                                thiss.fillNationalCartographies(data.features);
                            });
                        };
                        this.searchRestDepartments = function (id) {
                            var thiss = this;
                            this._layerPoliticalDivision.clear();
                            var geometry = thiss._layerZoneUTM.getFeatureById(id).geometry;
                            var query = new esri.tasks.Query();
                            query.where = "CD_DEPA<=25";
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = false;
                            query.outFields = ["*"];
                            query.geometry = geometry;
                            query.orderByFields = ['CD_DEPA'];
                            var task = new esri.tasks.QueryTask(thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdDepartment);
                            task.execute(query).addCallback(function (data) {
                                thiss.fillRestDepartments(data.features);
                            });
                        };
                        this.searchRestProvincesByDepartment = function (id, zone, callbackResponse) {
                            var thiss = this;
                            this._layerPoliticalDivision.clear();
                            var geometry = thiss._layerZoneUTM.getFeatureById(zone).geometry;
                            var query = new esri.tasks.Query();
                            query.where = "CD_DEPA='" + id + "'";
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = false;
                            query.outFields = ["*"];
                            query.geometry = geometry;
                            query.orderByFields = ['NM_PROV'];
                            var task = new esri.tasks.QueryTask(thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdProvince);
                            task.execute(query).addCallback(function (data) {
                                thiss.fillRestProvincesByDepartment(data.features);
                            });
                        };
                        this.searchRestDistrictsByProvince = function (id, zone, callbackResponse) {
                            var thiss = this;
                            this._layerPoliticalDivision.clear();
                            var geometry = thiss._layerZoneUTM.getFeatureById(zone).geometry;
                            var query = new esri.tasks.Query();
                            query.where = "CD_PROV='" + id + "'";
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = false;
                            query.outFields = ["*"];
                            query.geometry = geometry;
                            query.orderByFields = ['NM_DIST'];
                            var task = new esri.tasks.QueryTask(thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdDistrict);
                            task.execute(query).addCallback(function (data) {
                                thiss.fillRestDistrictsByProvince(data.features);
                            });
                        };
                        this.scopePoliticalDivision = function (layerId, where) {
                            var thiss = this;
                            this._layerPoliticalDivision.clear();
                            this._layerNationalCartography.clear();
                            var query = new esri.tasks.Query();
                            query.where = where;
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            var task = new esri.tasks.QueryTask(thiss.config.module.servicePoliticalDivision.url + "/" + layerId);
                            task.execute(query).addCallback(function (data) {
                                thiss._layerPoliticalDivision.clear();
                                thiss._layerPoliticalDivision.addAll(data.features);
                                thiss.searchRestNationalCartographies2(data.features[0].geometry);
                            });
                        };
                        this.scopeNationalCartography = function (id) {
                            var thiss = this;
                            this._layerNationalCartography.clear();
                            var query = new esri.tasks.Query();
                            query.where = "CD_HOJA='" + id + "'"
                            query.outSpatialReference = thiss.map.spatialReference;
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            var task = new esri.tasks.QueryTask(thiss.config.module.serviceNationalCartography.url + "/" + thiss.config.module.serviceNationalCartography.layerId);
                            task.execute(query).addCallback(function (data) {
                                thiss._layerNationalCartography.clear();
                                thiss._layerNationalCartography.addAll(data.features);
                            });
                        };
                        this.analizeCoordinates = function (coordinates, srid) {
                            var thiss = this;
                            thiss.removePreview();
                            thiss._layerPreview = new esri.layers.FeatureLayer({
                                layerDefinition: {
                                    geometryType: "esriGeometryAny",
                                    fields: [{
                                        name: MainMap.LABELLAYER,
                                        type: "esriFieldTypeInteger",
                                        alias: MainMap.LABELLAYER
                                    }]
                                },
                                featureSet: null
                            }, {
                                    outFields: [MainMap.LABELLAYER],
                                    showLabels: true
                                });
                            thiss._layerPreview.id = "preview";
                            var lineStyle = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, esri.Color.fromArray(thiss.config.module.symbolPreview.outline.color), 3);
                            var fillStyle = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineStyle, esri.Color.fromArray(thiss.config.module.symbolPreview.color));
                            var fillMarkerStyle = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineStyle, esri.Color.fromArray(thiss.config.module.symbolPreview.outline.color));
                            var markerStyle = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8, lineStyle, fillMarkerStyle)
                            var textStyle = new esri.symbol.TextSymbol();
                            textStyle.setColor(new esri.Color([0, 0, 0, 1]));
                            textStyle.setVerticalAlignment('middle');
                            textStyle.font.setSize("12px");
                            textStyle.font.setFamily("Calibri,sans-serif");
                            var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{" + MainMap.LABELLAYER + "}" }, labelPlacement: "center-center" });
                            labelClass.symbol = textStyle;
                            var renderer = new esri.renderer.SimpleRenderer(fillStyle);
                            thiss._layerPreview.setRenderer(renderer);
                            thiss._layerPreview.setLabelingInfo([labelClass]);
                            thiss.map.addLayer(thiss._layerPreview);
                            var coordinatesOriginal = JSON.stringify(coordinates);
                            var featuresVertex = [];
                            var i = 0;
                            var featureVertex = null;
                            for (i = 0; i < coordinates[0].length; i++) {
                                coordinates[0][i] = thiss.project(coordinates[0][i], srid, thiss.map.spatialReference.wkid);
                                if (i < coordinates[0].length - 1) {
                                    featureVertex = new esri.Graphic(new esri.geometry.Point(coordinates[0][i], thiss.map.spatialReference));
                                    featureVertex.setSymbol(markerStyle);
                                    featureVertex.attributes = {};
                                    featureVertex.attributes[MainMap.LABELLAYER] = i + 1;
                                    featuresVertex.push(featureVertex);
                                }
                                featureVertex = null;
                            }
                            var geometry = new esri.geometry.Polygon(coordinates);
                            geometry.setSpatialReference(thiss.map.spatialReference);
                            var feature = new esri.Graphic(geometry);
                            feature.attributes = {};
                            feature.attributes[MainMap.LABELLAYER] = '';
                            feature.setAttributes({ id: 0, coordinates: coordinatesOriginal, srid: srid });
                            feature.setId(0);
                            thiss._layerPreview.add(feature);
                            thiss._layerPreview.addAll(featuresVertex);
                            thiss.$btnExtentPreview.trigger("click");
                        };
                        this.searchGrids = function (geometry) {
                            var thiss = this;
                            var gridId = thiss.$ddlZoneUTM.int32();
                            var gridSRID = thiss.getSRIDGrid();
                            geometry = thiss.transformGeometry(geometry, gridSRID);
                            var query = new esri.tasks.Query();
                            query.outSpatialReference = new esri.SpatialReference(gridSRID);
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            query.geometry = geometry;
                            var task = new esri.tasks.QueryTask(thiss.config.module.servicesOnExtent[gridId].grid.url + "/" + thiss.config.module.servicesOnExtent[gridId].grid.layerId);
                            task.execute(query).addCallback(function (data) {
                                if (data.features === undefined || data.features === null || data.features.length === 0) return;
                                if (data.features.length < 1 || data.features.length > 10) {
                                    alert("Has seleccionado " + data.features.length + " cuadrículas, sólo está permitido entre 1 y 10 cuadrículas", null, MainMap.TITLE);
                                    return;
                                }
                                var i = 0;
                                var length = 0;
                                var union = null;
                                var geoJson = { type: "FeatureCollection", crs: { type: "name", properties: { name: 'EPSG:' + data.spatialReference.wkid } } };
                                geoJson.features = [];
                                data.features.forEach(function (feature) {
                                    geoJson.features.push({ type: "Feature", properties: {}, geometry: { type: thiss.typeEsriJSON2GeoJSON(data.geometryType), coordinates: feature.geometry.rings } });
                                });
                                if (data.features.length > 1) {
                                    for (var i = 1, length = geoJson.features.length; i < length; i++) {
                                        if (i == 1) {
                                            union = turf.union(geoJson.features[i - 1], geoJson.features[i]);
                                        } else {
                                            union = turf.union(union, geoJson.features[i]);
                                        }
                                    }
                                }
                                else {
                                    union = geoJson.features[0];
                                }
                                union.coordinates = thiss.orderCoordinates(union.geometry.coordinates);
                                //console.log('Number of points before simplification',union.geometry.coordinates[0].length);
                                union = turf.simplify(union, 0.001, true);
                                //console.log(JSON.stringify(union.geometry.coordinates));
                                //console.log('Number of points after simplification', union.geometry.coordinates[0].length);
                                thiss.analizeCoordinates(union.geometry.coordinates, gridSRID);
                            });
                        };
                        this.searchOverlaps = function () {
                            var thiss = this;
                            var layers = null;
                            thiss.config.module.services.forEach(function (service) {
                                service.layerIds = (service.layerId !== undefined && service.layerId !== null) ? service.layerId : service.layerIds;
                                service.layerIds = service.layerIds instanceof Array ? service.layerIds : service.layerIds.toString().split(',');
                                var parameters = new esri.tasks.IdentifyParameters();
                                parameters.geometry = geometry;
                                parameters.mapExtent = thiss.map.extent;
                                parameters.tolerance = thiss.config.module.widget.tolerance;
                                parameters.returnGeometry = true;
                                parameters.layerIds = service.layerIds;
                                parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                                parameters.width = thiss.map.width;
                                parameters.height = thiss.map.height;
                                var task = new esri.tasks.IdentifyTask(thiss.config.module.service.url);
                                task.execute(parameters).addCallback(function (response) {
                                    thiss.fillOverlaps(response);
                                });
                            });
                        };
                    }
                    MainMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        thiss.draw = new esri.toolbars.Draw(thiss.map);
                        thiss.draw.setFillSymbol(thiss.config.module.map.symbols['polygon']["highlight"]);
                        thiss.draw.setLineSymbol(thiss.config.module.map.symbols['polyline']["highlight"]);
                        thiss.draw.setMarkerSymbol(thiss.config.module.map.symbols['point']["highlight"]);
                        thiss.draw.deactivate();
                        thiss.draw.on("draw-complete", function (e) {
                            thiss.draw.deactivate();
                            thiss.searchGrids(e.geometry);
                        });
                        thiss._layerZoneUTM = thiss._layerConfig({ visible: false });
                        thiss._layerPoliticalDivision = thiss._layerConfig();
                        thiss._layerNationalCartography = thiss._layerConfig();
                        thiss._layerDraw = new esri.layers.GraphicsLayer({
                            style: function (feature, resolution) {
                                return options.symbol || thiss.config.module.map.symbols[feature.geometry.type]["highlight"]
                            }
                        });
                        this.removePreview();
                    };
                    MainMap.prototype.cleanControls = function () {
                        var thiss = this;
                        if (thiss._layerZoneUTM !== null)
                            thiss._layerZoneUTM.clear();
                        if (thiss._layerPoliticalDivision !== null)
                            thiss._layerPoliticalDivision.clear();
                        if (thiss._layerNationalCartography !== null)
                            thiss._layerNationalCartography.clear();
                        if (thiss._layerPreview !== null) {
                            thiss.map.removeLayer(this._layerPreview);
                            this._layerPreview = null;
                        }
                        if (thiss._layerDraw !== null)
                            thiss._layerDraw.getSource().clear();
                    };
                    MainMap.execute = function () {
                        return new MainMap();
                    };
                    return MainMap;
                })(miningrequest.BaseMainMap);
                miningrequest.MainMap = MainMap;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));