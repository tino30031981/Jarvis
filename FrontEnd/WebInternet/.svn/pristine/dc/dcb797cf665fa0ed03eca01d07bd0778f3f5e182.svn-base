function getInstance() {
    return com.jtm.miningconcession.miningconcession.OverlapMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var OverlapMap = (function (_super) {
                    __extends(OverlapMap, _super);
                    function OverlapMap() {
                        _super.call(this);
                        this.services = [];
                        this.removeOverlaps = function () {
                            var thiss = this;
                            thiss.map.getLayers().getArray().slice().forEach(function (layer) {
                                if (layer.get("id") !== undefined && layer.get("id").startsWith("overlap_") === true) {
                                    thiss.map.removeLayer(layer);
                                    layer = null;
                                }
                            });
                        };
                    }
                    OverlapMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        thiss.layer = new ol.layer.Vector({
                            source: new ol.source.Vector()
                        });
                        thiss.map.addLayer(thiss.layer);
                        thiss.layerSelected = thiss.buildGraphicsLayer();
                        thiss.layerDraw = thiss.buildGraphicsLayer();

                    };
                    OverlapMap.prototype.search = function (geometry) {
                        var thiss = this;
                        this.cleanControls(false);
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
                        thiss.services.forEach(function (service, i) {
                            data.layers = "all:" + service.layerId;
                            service.format = new ol.format.EsriJSON();
                            thiss.ajax({
                                method: "POST",
                                url: service.url + "/identify",
                                data: data,
                                isJson: false,
                                validate: true
                            }, function (data) {
                                if (i === thiss.services.length - 1)
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
                                thiss.layer.getSource().addFeatures(features);
                                thiss.writeOverlaps(service, data.results);
                                delete service.data;
                                delete service.format;
                            });
                        });
                    };
                    OverlapMap.prototype.addInteraction = function (options) {
                        var thiss = this;
                        thiss._toggleDragPan(false);
                        if (thiss.draw !== null)
                            thiss.map.removeInteraction(thiss.draw);
                        thiss.layerDraw.getSource().clear(true);
                        thiss.layerSelected.getSource().clear(true);
                        thiss.removeOverlaps();
                        if (typeof thiss.callbackPaneList === "function")
                            thiss.callbackPaneList();
                        if (!(thiss.services instanceof Array) || thiss.services.length === 0) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICES);
                            return;
                        }
                        if (thiss.services.length > 10) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICESMAX);
                            return;
                        }
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
                        }, this);
                        thiss.draw.on('drawend', function (e) {
                            thiss._toggleDragPan(true);
                            thiss.map.removeInteraction(thiss.draw);
                            thiss.layerDraw.getSource().clear(true);
                            if (e.feature.getGeometry().getType() === "Circle") {
                                e.feature.setGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()));
                            }
                            thiss.search(e.feature.getGeometry());
                        }, this);
                    };
                    OverlapMap.prototype.drawCircleCustom = function (x, y, radio, srid, options) {
                        var thiss = this;
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        thiss.layerDraw.getSource().clear();
                        thiss.layerSelected.getSource().clear();
                        thiss.removeOverlaps();
                        if (typeof thiss.callbackPaneList === "function")
                            thiss.callbackPaneList();
                        if (!(thiss.services instanceof Array) || thiss.services.length === 0) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICES);
                            return;
                        }
                        if (thiss.services.length > 10) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICESMAX);
                            return;
                        }
                        setTimeout(function () {
                            var coordinates = [x, y];
                            coordinates = thiss.project(coordinates, srid, mapSRID);
                            var geometryOL = (radio === 0) ? new ol.geom.Point(coordinates) : new ol.geom.Circle(coordinates, (radio * OverlapMap.KILOMETER));
                            var feature = new ol.Feature({
                                geometry: geometryOL
                            });
                            feature.setStyle(thiss.config.module.map.symbols[feature.getGeometry().getType()]["default"]);
                            thiss.layerDraw.getSource().addFeature(feature);
                            if (geometryOL.getType() === "Circle")
                                geometryOL = ol.geom.Polygon.fromCircle(geometryOL);
                            options.$dom.hide();
                            thiss.search(geometryOL);
                        }, 1000);
                    };
                    OverlapMap.prototype.drawPointGPS = function () {
                        var thiss = this;
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        thiss.layerDraw.getSource().clear();
                        thiss.layerSelected.getSource().clear();
                        thiss.removeOverlaps();
                        if (typeof thiss.callbackPaneList === "function")
                            thiss.callbackPaneList();
                        if (!(thiss.services instanceof Array) || thiss.services.length === 0) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICES);
                            return;
                        }
                        if (thiss.services.length > 10) {
                            window.plugins.toast.showLongBottom(OverlapMap.SELECTEDSERVICESMAX);
                            return;
                        }
                        thiss.geolocation(function (geometry) {
                            geometry.coordinates = thiss.project(geometry.coordinates, geometry.spatialReference.id, mapSRID);
                            geometry.spatialReference.id = mapSRID;
                            var geometryOL = new ol.geom.Point(geometry.coordinates);
                            var feature = new ol.Feature({
                                geometry: geometryOL
                            });
                            feature.setStyle(thiss.config.module.map.symbols[feature.getGeometry().getType()]["default"]);
                            thiss.layerDraw.getSource().addFeature(feature);
                            thiss.search(geometryOL);
                        });
                    };
                    OverlapMap.prototype.featureSelectById = function (id) {
                        var thiss = this;
                        _super.prototype.featureSelectById.call(this, id);
                        thiss.layerSelected.getSource().clear(true);
                        var feature = this.layer.getSource().getFeatureById(id);
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
                    OverlapMap.prototype.buildStyle = function (service, feature) {
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
                    OverlapMap.prototype.cleanControls = function (toNull) {
                        toNull = typeof toNull === "boolean" ? toNull : true;
                        _super.prototype.cleanControls.call(this, toNull);
                        if (this.layer !== null) {
                            this.layer.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layer);
                                this.layer = null;
                            }
                        }
                        if (this.layerSelected !== null) {
                            this.layerSelected.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerSelected);
                                this.layerSelected = null;
                            }
                        }
                        if (this.layerDraw !== null) {
                            this.layerDraw.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerDraw);
                                this.layerDraw = null;
                            }
                        }
                    };
                    OverlapMap.execute = function () {
                        return new OverlapMap();
                    };
                    return OverlapMap;
                })(miningconcession.BaseOverlapMap);
                miningconcession.OverlapMap = OverlapMap;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));