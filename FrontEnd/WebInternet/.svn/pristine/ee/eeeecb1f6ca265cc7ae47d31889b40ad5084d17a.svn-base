function getInstance() {
    return com.jtm.miningconcession.miningrequest.FormMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningrequest) {
                var FormMap = (function (_super) {
                    __extends(FormMap, _super);
                    function FormMap() {
                        _super.call(this);
                        this.fitExtentGrid = function (id) {
                            var thiss = this;
                            var extent = thiss.layerZoneUTM.getSource().getFeatureById(id).getGeometry().getExtent();
                            if (extent.equals(FormMap.EXTENTINFINITY) === true) return;
                            thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                        };
                        this.fitExtent = function (id) {
                            var thiss = this;
                            var extent = thiss.layerPreview.getSource().getFeatureById(id).getGeometry().getExtent();
                            if (extent.equals(FormMap.EXTENTINFINITY) === true) return;
                            thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                        };
                        this.getDataById = function (id) {
                            var thiss = this;
                            if (thiss.layerPreview === null) return null;
                            var feature = thiss.layerPreview.getSource().getFeatureById(id);
                            if (feature === null) return null;
                            var item = { coordinates: JSON.parse(feature.get("coordinates")), spatialReference: { id: feature.get("srid") } };
                            return item;
                        };
                        this.loadServicesOnExtent = function (zone) {
                            var thiss = this;
                            for (var j in thiss.config.module.servicesOnExtent[zone]) {
                                var service = thiss.config.module.servicesOnExtent[zone][j];
                                var layer = new ol.layer.Image({
                                    source: new ol.source.ImageArcGISRest({
                                        ratio: 1,
                                        params: { FORMAT: 'PNG8', DPI: 96 },
                                        url: service.url
                                    })
                                });
                                layer.on("change:visible", function (e) {
                                    console.log(e);
                                });
                                if (service.minScale > 0)
                                    layer.setMinResolution(thiss.map.getResolutionFromScale(service.maxScale));
                                if (service.maxScale > 0)
                                    layer.setMaxResolution(thiss.map.getResolutionFromScale(service.minScale));
                                layer.set("id", "image_" + thiss.getUUID());
                                thiss.map.addLayer(layer);
                            }
                        };
                        this.listZoneUTMs = function () {
                            var thiss = this;
                            var format = new ol.format.EsriJSON();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var data = {
                                f: "json",
                                returnGeometry: true,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                outSR: mapSRID,
                                where: '1=1'
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.serviceZoneUTM.url + "/" + thiss.config.module.serviceZoneUTM.layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                if (data === undefined || data === null) return;
                                var features = format.readFeatures(data);
                                features.forEach(function (feature) {
                                    feature.setId(feature.getProperties().ZONE);
                                });
                                thiss.layerZoneUTM.getSource().addFeatures(features);
                                thiss.fillZoneUTMs(data.features);
                            });
                        };

                        this.searchNationalCartographies = function (id) {
                            var geometry = this.layerZoneUTM.getSource().getFeatureById(id).getGeometry();
                            this.searchNationalCartographies2(geometry);
                        };
                        this.searchNationalCartographies2 = function (geometry, callbackResponse) {
                            var thiss = this;
                            this.layerNationalCartography.getSource().clear();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var data = {
                                f: "json",
                                returnGeometry: false,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                outSR: mapSRID,
                                geometryType: thiss.typeGeoJSON2EsriJSON(geometry.getType()),
                                geometry: JSON.stringify({ rings: geometry.getCoordinates() }),
                                inSR: mapSRID,
                                orderByFields: "CD_HOJA"
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.serviceNationalCartography.url + "/" + thiss.config.module.serviceNationalCartography.layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.fillNationalCartographies(data.features);
                            });
                        };
                        this.searchDepartments = function (id, callbackResponse) {
                            var thiss = this;
                            this.layerPoliticalDivision.getSource().clear();
                            var geometry = thiss.layerZoneUTM.getSource().getFeatureById(id).getGeometry();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var data = {
                                f: "json",
                                returnGeometry: false,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                outSR: mapSRID,
                                where: "CD_DEPA<=25",
                                geometryType: thiss.typeGeoJSON2EsriJSON(geometry.getType()),
                                geometry: JSON.stringify({ rings: geometry.getCoordinates() }),
                                inSR: mapSRID,
                                orderByFields: "CD_DEPA"
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdDepartment + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.fillDepartments(data.features);
                            });
                        };
                        this.searchProvincesByDepartment = function (id, zone, callbackResponse) {
                            var thiss = this;
                            this.layerPoliticalDivision.getSource().clear();
                            var geometry = thiss.layerZoneUTM.getSource().getFeatureById(zone).getGeometry();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            if (id === 0) return;
                            var data = {
                                f: "json",
                                where: "CD_DEPA='" + id + "'",
                                returnGeometry: false,
                                spatialRel: 'esriSpatialRelIntersects',
                                geometryType: thiss.typeGeoJSON2EsriJSON(geometry.getType()),
                                geometry: JSON.stringify({ rings: geometry.getCoordinates() }),
                                inSR: mapSRID,
                                outFields: "*",
                                orderByFields: 'NM_PROV'
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdProvince + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.fillProvinces(data.features);
                            });
                        };
                        this.searchDistrictsByProvince = function (id, zone, callbackResponse) {
                            var thiss = this;
                            this.layerPoliticalDivision.getSource().clear();
                            var geometry = thiss.layerZoneUTM.getSource().getFeatureById(zone).getGeometry();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            if (id === 0) return;
                            var data = {
                                f: "json",
                                where: "CD_PROV='" + id + "'",
                                returnGeometry: false,
                                spatialRel: 'esriSpatialRelIntersects',
                                geometryType: thiss.typeGeoJSON2EsriJSON(geometry.getType()),
                                geometry: JSON.stringify({ rings: geometry.getCoordinates() }),
                                inSR: mapSRID,
                                outFields: "*",
                                orderByFields: 'NM_DIST'
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicePoliticalDivision.url + "/" + thiss.config.module.servicePoliticalDivision.layerIdDistrict + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.fillDistricts(data.features);
                            });
                        };
                        this.scopePoliticalDivision = function (layerId, where) {
                            var thiss = this;
                            this.layerPoliticalDivision.getSource().clear(true);
                            this.layerNationalCartography.getSource().clear(true);
                            var format = new ol.format.EsriJSON();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var data = {
                                f: "json",
                                returnGeometry: true,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                outSR: mapSRID,
                                where: where
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicePoliticalDivision.url + "/" + layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.layerPoliticalDivision.getSource().clear();
                                var features = format.readFeatures(data);
                                thiss.layerPoliticalDivision.getSource().addFeatures(features);
                                thiss.searchNationalCartographies2(features[0].getGeometry());
                            });
                        };
                        this.scopeNationalCartography = function (id) {
                            var thiss = this;
                            this.layerNationalCartography.getSource().clear(true);
                            var format = new ol.format.EsriJSON();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var data = {
                                f: "json",
                                returnGeometry: true,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                outSR: mapSRID,
                                where: "CD_HOJA='" + id + "'"
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.serviceNationalCartography.url + "/" + thiss.config.module.serviceNationalCartography.layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                thiss.layerNationalCartography.getSource().clear();
                                var features = format.readFeatures(data);
                                thiss.layerNationalCartography.getSource().addFeatures(features);
                            });
                        };

                        this.searchOverlaps = function (geometry) {
                            var thiss = this;
                            thiss.layerOverlap.getSource().clear(true);
                            thiss.layerSelected.getSource().clear(true);
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var geometryESRI = thiss.geoJSON2EsriJSON(geometry.getCoordinates(), geometry.getType(), mapSRID);
                            var data = {
                                f: "json",
                                returnGeometry: true,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                sr: mapSRID,
                                tolerance: 0,
                                geometry: JSON.stringify(geometryESRI.geometry),
                                geometryType: geometryESRI.geometryType,
                                mapExtent: thiss.map.getView().calculateExtent(thiss.map.getSize()).join(","),
                                imageDisplay: thiss.map.getSize().join(",") + ",96"
                            };
                            thiss.config.module.services.forEach(function (service, i) {
                                data.layers = "all:" + service.layerId;
                                service.format = new ol.format.EsriJSON();
                                thiss.ajax({
                                    method: "POST",
                                    url: service.url + "/identify",
                                    data: data,
                                    isJson: false,
                                    validate: true
                                }, function (data) {
                                    if (i === thiss.config.module.services.length - 1)
                                        thiss.layerDraw.getSource().clear(true);
                                    if (data.hasOwnProperty('error')) { window.plugins.toast.showLongBottom("Error en " + service.name); return; };
                                    if (data.results.length === 0) { window.plugins.toast.showLongBottom("No hay elementos en " + service.name); return; };
                                    data.results.forEach(function (item, j) {
                                        item.attributes.UUID = service.UUID + '_' + j;
                                    });
                                    service.data = {};
                                    service.data.geometryType = data.results[0].geometryType;
                                    service.data.spatialReference = data.results[0].geometry.spatialReference;
                                    service.data.features = data.results;
                                    var features = service.format.readFeatures(service.data);
                                    features.forEach(function (feature) {
                                        feature.setId(feature.getProperties().UUID);
                                        feature.setStyle(thiss.buildStyle(service, feature));
                                    });
                                    thiss.layerOverlap.getSource().addFeatures(features);
                                    thiss.writeOverlaps(service, data.results);
                                    delete service.data;
                                    delete service.format;
                                });
                            });
                        };

                        this.searchGrids = function (geomery) {
                            var thiss = this;
                            var gridId = this.$ddlZoneUTM.int32();
                            var mapSRID = thiss.map.getView().getProjection().getWKID();
                            var gridSRID = thiss.getSRIDGrid();
                            var geometryESRI = thiss.toEsriGeometry(geomery, mapSRID, gridSRID);
                            var format = new ol.format.EsriJSON();
                            var data = {
                                f: "json",
                                returnGeometry: true,
                                spatialRel: 'esriSpatialRelIntersects',
                                outFields: "*",
                                inSR: gridSRID,
                                outSR: gridSRID,
                                geometryType: geometryESRI.geometryType,
                                geometry: JSON.stringify(geometryESRI.geometry)
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicesOnExtent[gridId].grid.url + "/" + thiss.config.module.servicesOnExtent[gridId].grid.layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: function () { return true; }
                            }, function (data) {
                                if (data.features === undefined || data.features === null || data.features.length === 0) return;
                                if (data.features.length < 1 || data.features.length > 10) {
                                    window.plugins.toast.showLongBottom("Has seleccionado " + data.features.length + " cuadrículas, sólo está permitido entre 1 y 10 cuadrículas");
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
                                thiss.coordinatesToMap(union.geometry.coordinates, gridSRID);
                            });
                        };
                        this.toEsriGeometry = function (geometry, fromSRID, toSRID) {
                            var thiss = this;
                            var esri = null;
                            if (geometry !== undefined && geometry !== null) {
                                var coordinates = geometry.getCoordinates();
                                var type = geometry.getType();
                                coordinates = projectionCoordinates(coordinates, type);
                                esri = { geometryType: thiss.typeGeoJSON2EsriJSON(type), spatialReference: { wkid: toSRID } };
                                if (type === "Point")
                                    esri.geometry = { x: coordinates[0], y: coordinates[1] };
                                else if (type === "LineString")
                                    esri.geometry = { paths: coordinates };
                                else if (type === "Polygon")
                                    esri.geometry = { rings: coordinates };
                                function projectionCoordinates(coordinates, type) {
                                    if (type === "Point") {
                                        coordinates = thiss.project(coordinates, fromSRID, toSRID);
                                    }
                                    else if (type === "LineString") {
                                        for (var i = 0; i < coordinates.length; i++)
                                            coordinates[i] = thiss.project(coordinates[i], fromSRID, toSRID);
                                        coordinates = [coordinates];
                                    }
                                    else if (type === "Polygon") {
                                        for (var i = 0; i < coordinates[0].length; i++)
                                            coordinates[0][i] = thiss.project(coordinates[0][i], fromSRID, toSRID);
                                    }
                                    return coordinates;
                                }
                            }
                            return esri;
                        };
                        this.captureMap = function ($div, callback) {
                            var thiss = this;
                            thiss.map.once('postcompose', function (e) {
                                var canvas = e.context.canvas;
                                canvas.toBlob(function (blob) {
                                    var $img = $('<img />');
                                    $img.addClass("img-responsive");
                                    $img.css("z-index", 99999999);
                                    var url = URL.createObjectURL(blob);
                                    $img.on("load", function () {
                                        URL.revokeObjectURL(url);
                                    });
                                    $div.find("canvas").closest("div").prepend($img);
                                    $img.attr("src", url);
                                    if (typeof callback === "function")
                                        callback($img);
                                });
                            });
                            thiss.map.renderSync();
                        };
                    }
                    FormMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        this.layer = this.buildFeatureLayer();
                        this.layerSelected = this.buildGraphicsLayer({ handlerAddFeature: true });
                        this.layerDraw = this.buildGraphicsLayer();
                        this.layerZoneUTM = this.buildGraphicsLayer({ visible: false });
                        this.layerPoliticalDivision = this.buildGraphicsLayer({ handlerAddFeature: true });
                        this.layerNationalCartography = this.buildGraphicsLayer({ handlerAddFeature: true });
                        this.layerOverlap = this.buildGraphicsLayer();
                        this.layerPreview = new ol.layer.Vector({
                            style: function (feature, resolution) {
                                return new ol.style.Style({
                                    image: new ol.style.Circle({
                                        radius: 8
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: "RGBA(" + thiss.config.module.symbolPreview.outline.color.join(",") + ")",
                                        lineDash: [4],
                                        width: 3
                                    }),
                                    fill: new ol.style.Fill({
                                        color: "RGBA(" + thiss.config.module.symbolPreview.color.join(",") + ")",
                                    }),
                                    text: new ol.style.Text({
                                        font: '12px Calibri,sans-serif',
                                        fill: new ol.style.Fill({
                                            color: '#000'
                                        }),
                                        stroke: new ol.style.Stroke({
                                            color: '#fff',
                                            width: 3
                                        }),
                                        text: (feature.get(FormMap.LABELLAYER) || '').toString()
                                    })
                                });
                            },
                            source: new ol.source.Vector()
                        });
                        this.map.addLayer(this.layerPreview);
                    };
                    FormMap.prototype.addInteraction = function (options) {
                        var thiss = this;
                        thiss._toggleDragPan(false);
                        if (thiss.draw !== null)
                            thiss.map.removeInteraction(thiss.draw);
                        thiss.layerDraw.getSource().clear(true);
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
                            thiss._toggleDragPan(false);
                            thiss.layerOverlap.getSource().clear(true);
                        }, this);
                        thiss.draw.on('drawend', function (e) {
                            thiss._toggleDragPan(true);
                            thiss.map.removeInteraction(thiss.draw);
                            thiss.layerDraw.getSource().clear(true);
                            if (e.feature.getGeometry().getType() === "Circle") {
                                e.feature.setGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()));
                            }
                            thiss.searchGrids(e.feature.getGeometry());
                        }, this);
                    };
                    FormMap.prototype.coordinatesToMap = function (coordinates, srid) {
                        var thiss = this;
                        this.layerPreview.getSource().clear(true);
                        var coordinatesOriginal = JSON.stringify(coordinates);
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        var featuresVertex = [];
                        var i = 0;
                        var featureVertex = null;
                        for (i = 0; i < coordinates[0].length; i++) {
                            coordinates[0][i] = thiss.project(coordinates[0][i], srid, mapSRID);
                            if (i < coordinates[0].length - 1) {
                                featureVertex = new ol.Feature({
                                    geometry: new ol.geom.Point(coordinates[0][i])
                                });
                                featureVertex.setProperty([FormMap.LABELLAYER], i + 1);
                                featuresVertex.push(featureVertex);
                            }
                            featureVertex = null;
                        }
                        var geometry = new ol.geom.Polygon(coordinates);
                        var feature = new ol.Feature({
                            geometry: geometry
                        });
                        feature.setProperties({ id: 0, coordinates: coordinatesOriginal, srid: srid });
                        feature.setId(0);
                        thiss.layerPreview.getSource().addFeature(feature);
                        thiss.layerPreview.getSource().addFeatures(featuresVertex);
                        var extent = feature.getGeometry().getExtent();
                        thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                        var geometryCustom = { coordinates: JSON.parse(coordinatesOriginal), spatialReference: { id: srid } };
                        this.writeCoordinates(geometryCustom);
                        this.searchOverlaps(feature.getGeometry());
                    };
                    FormMap.prototype.featureSelectById = function (id) {
                        var thiss = this;
                        _super.prototype.featureSelectById.call(this, id);
                        thiss.layerSelected.getSource().clear(true);
                        var feature = this.layerOverlap.getSource().getFeatureById(id);
                        if (feature === undefined || feature === null) {
                            window.plugins.toast.showLongBottom("No existe el elemento");
                            return;
                        }
                        var featureSelected = feature.clone();
                        featureSelected.setStyle(null);
                        var extent = featureSelected.getGeometry().getExtent();
                        thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                        thiss.layerSelected.getSource().addFeature(featureSelected);
                    };
                    FormMap.prototype.buildStyle = function (service, feature) {
                        return new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 12,
                                fill: new ol.style.Fill({
                                    color: "RGBA(" + service.symbol.color.join(",") + ")"
                                })
                            }),
                            stroke: new ol.style.Stroke({
                                color: "RGBA(" + service.symbol.outline.color.join(",") + ")",
                                lineDash: [4],
                                width: 3
                            }),
                            fill: new ol.style.Fill({
                                color: "RGBA(" + service.symbol.color.join(",") + ")",
                            }),
                            text: new ol.style.Text({
                                font: '12px Calibri,sans-serif',
                                fill: new ol.style.Fill({
                                    color: '#000'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 3
                                }),
                                text: this.map.getView().getZoom() > 12 ? feature.get(service.displayField) : ''
                            })
                        });
                    };
                    FormMap.prototype.cleanControls = function (toNull) {
                        var thiss = this;
                        toNull = typeof toNull === "boolean" ? toNull : false;
                        _super.prototype.cleanControls.call(this, toNull);
                        if (this.layer !== null) {
                            this.layer.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layer);
                                this.layer = null;
                            }
                        }
                        if (thiss.layerSelected !== null) {
                            this.layerSelected.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerSelected);
                                thiss.layerSelected = null;
                            }
                        }
                        if (thiss.layerDraw !== null) {
                            this.layerDraw.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerDraw);
                                this.layerDraw = null;
                            }
                        }
                        if (thiss.layerZoneUTM !== null) {
                            thiss.layerZoneUTM.getSource().clear();
                            if (toNull === true) {
                                this.map.removeLayer(this.layerZoneUTM);
                                this.layerZoneUTM = null;
                            }
                        }
                        if (thiss.layerPoliticalDivision !== null) {
                            thiss.layerPoliticalDivision.getSource().clear();
                            if (toNull === true) {
                                this.map.removeLayer(this.layerPoliticalDivision);
                                this.layerPoliticalDivision = null;
                            }
                        }
                        if (thiss.layerNationalCartography !== null) {
                            thiss.layerNationalCartography.getSource().clear();
                            if (toNull === true) {
                                this.map.removeLayer(this.layerNationalCartography);
                                this.layerNationalCartography = null;
                            }
                        }
                        if (thiss.layerPreview !== null) {
                            thiss.layerPreview.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerPreview);
                                this.layerPreview = null;
                            }
                        }
                        if (thiss.layerOverlap !== null) {
                            thiss.layerOverlap.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerOverlap);
                                this.layerOverlap = null;
                            }
                        }
                    };
                    FormMap.execute = function () {
                        return new FormMap();
                    };
                    return FormMap;
                })(miningrequest.BaseFormMap);
                miningrequest.FormMap = FormMap;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));