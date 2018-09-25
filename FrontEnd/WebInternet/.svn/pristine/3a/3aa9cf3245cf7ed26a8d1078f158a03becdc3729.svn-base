function getInstance() {
    return com.jtm.miningconcession.miningcadaster.MainMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningcadaster) {
                var MainMap = (function (_super) {
                    __extends(MainMap, _super);
                    function MainMap() {
                        _super.call(this);

                        this.featureSelected = function (feature) {
                            var thiss = this;
                            feature.setStyle(null);
                            var coordinates = feature.getGeometry().getCoordinates();
                            var featuresVertex = [];
                            var i = 0;
                            var featureVertex = null;
                            for (i = 0; i < coordinates[0].length - 1; i++) {
                                featureVertex = new ol.Feature({
                                    geometry: new ol.geom.Point(coordinates[0][i])
                                });
                                featureVertex.setProperty([MainMap.LABELLAYER], i + 1);
                                featuresVertex.push(featureVertex);
                                featureVertex = null;
                            }
                            var extent = feature.getGeometry().getExtent();
                            thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                            thiss.layerSelected.getSource().addFeature(feature);
                            thiss.layerSelected.getSource().addFeatures(featuresVertex);
                        };
                        this.getZoneFromLayer = function (id) {
                            var thiss = this;
                            if (thiss.layer === null) return 0;
                            var feature = thiss.layer.getSource().getFeatureById(id);
                            if (feature === null) return 0;
                            return feature.get("ZONA");
                        };
                    }
                    MainMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        thiss.layer = new ol.layer.Vector({
                            source: new ol.source.Vector(),
                            style: function (feature, resolution) {
                                for (var i in thiss.config.module.map.symbols[feature.getGeometry().getType()]) {
                                    thiss.config.module.map.symbols[feature.getGeometry().getType()][i].getText().setText(thiss.map.getView().getZoom() > 12 ? feature.get(thiss.config.module.service.displayField) : '');
                                }
                                //thiss.map.getView().getZoom() > 12 ? feature.get(thiss.config.module.service.displayField) : ''
                                return thiss.config.module.map.symbols[feature.getGeometry().getType()]["default"];
                            }
                        });
                        thiss.layer.getSource().on("addfeature", function (e) {
                            var extent = thiss.layer.getSource().getExtent();
                            if (extent.equals(MainMap.EXTENTINFINITY) === true) return;
                            thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
                        });
                        thiss.map.addLayer(thiss.layer);
                        thiss.layerSelected = new ol.layer.Vector({
                            style: function (feature, resolution) {
                                for (var i in thiss.config.module.map.symbols[feature.getGeometry().getType()]) {
                                    thiss.config.module.map.symbols[feature.getGeometry().getType()][i].getText().setText(thiss.map.getView().getZoom() > 12 ? (feature.get(MainMap.LABELLAYER) !== undefined ? feature.get(MainMap.LABELLAYER).toString() : '') : '');
                                }
                                return thiss.config.module.map.symbols[feature.getGeometry().getType()]["highlight"];
                            },
                            source: new ol.source.Vector()
                        });
                        thiss.map.addLayer(thiss.layerSelected);
                        thiss.layerDraw = thiss.buildGraphicsLayer();
                        thiss.map.on('singleclick', function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.layerSelected.getSource().clear(true);
                            var features = thiss.layer.getSource().getFeaturesAtCoordinate(e.coordinate);
                            var feature = null;
                            if (features !== null && features[0] !== undefined) {
                                feature = features[0].clone();
                                feature.setId(features[0].getId());
                                thiss.featureSelected(feature);
                                if (typeof thiss.callbackForm === "function") {
                                    thiss.callbackForm(feature.getId());
                                }
                            }
                        });
                    };
                    MainMap.prototype.search = function (options) {
                        var thiss = this;
                        this.cleanControls(false);
                        var format = new ol.format.EsriJSON();
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        var where = options.where;
                        var geometryESRI = null;
                        var data = {
                            f: "json",
                            returnGeometry: true,
                            spatialRel: 'esriSpatialRelIntersects',
                            outFields: "*",
                            outSR: mapSRID,
                            orderByFields: 'CONCESION'
                        };
                        if (where !== null)
                            data.where = where;
                        if (options.geometry !== undefined && options.geometry !== null) {
                            geometryESRI = thiss.geoJSON2EsriJSON(options.geometry.getCoordinates(), options.geometry.getType(), mapSRID);
                            data.geometry = JSON.stringify(geometryESRI.geometry);
                            data.geometryType = geometryESRI.geometryType;
                            data.inSR = geometryESRI.spatialReference.wkid;
                        }
                        thiss.ajax({
                            method: "POST",
                            url: thiss.config.module.service.url + "/" + thiss.config.module.service.layerId + "/query",
                            data: data,
                            isJson: false,
                            validate: true,
                            async: true
                        }, function (data) {
                            thiss.layerDraw.getSource().clear(true);
                            if (data.features === undefined || data.features.length === 0) {
                                window.plugins.toast.showLongBottom("No se encontraron concesiones mineras");
                                return;
                            }
                            if (data.features.length >= 5000) {
                                window.plugins.toast.showLongBottom('Sólo se muestran los primeros 5000');
                            }
                            var features = format.readFeatures(data);
                            features.forEach(function (feature) {
                                feature.setId(feature.getProperties()[thiss.config.module.service.joinField]);
                            });
                            thiss.layer.getSource().addFeatures(features);
                            thiss.writeResult(data.features);
                        });
                        function getEsriWhere(field, value) {
                            var where = null;
                            if (String.isNullOrWhiteSpace(field) !== true && String.isNullOrWhiteSpace(value) !== true)
                                where = 'UPPER(' + field + ')' + " LIKE '%" + value.trim().toUpperCase() + "%'";
                            return where;
                        }
                    };
                    MainMap.prototype.addInteraction = function (options) {
                        var thiss = this;
                        thiss._toggleDragPan(false);
                        if (thiss.draw !== null)
                            thiss.map.removeInteraction(thiss.draw);
                        this.cleanControls(false);
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
                            thiss.layerDraw.getSource().clear(true);
                            thiss.map.removeInteraction(thiss.draw);
                            if (e.feature.getGeometry().getType() === "Circle") {
                                e.feature.setGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()));
                            }
                            thiss.search({ geometry: e.feature.getGeometry() });
                        }, this);
                    };
                    MainMap.prototype.searchByPoliticalDivision = function (layerId, field, value) {
                        var thiss = this;
                        _super.prototype.searchByPoliticalDivision.call(this, layerId, field, value);
                        var format = new ol.format.EsriJSON();
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        var data = {
                            f: "json",
                            returnGeometry: true,
                            spatialRel: 'esriSpatialRelIntersects',
                            outFields: "*",
                            outSR: mapSRID,
                            where: field + "='" + value + "'"
                        };
                        thiss.ajax({
                            method: "POST",
                            url: thiss.config.module.servicePoliticalDivision.url + "/" + layerId + "/query",
                            data: data,
                            isJson: false,
                            validate: true
                        }, function (data) {
                            if (data.features.length === 0) return;
                            var features = format.readFeatures(data);
                            var options = {
                                geometry: features[0].getGeometry()
                            };
                            thiss.search(options);
                        });
                    };
                    MainMap.prototype.addLayerToToc = function (service) {
                        var service2 = new ol.layer.Tile({
                            source: new ol.source.TileArcGISRest({
                                url: service.url,
                                crossOrigin: 'anonymous',
                                params: {
                                    'LAYERS': 'show:' + service.id,
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
                        service2.set('id', service.UUID);
                        service2.setVisible(false);
                        this.map.addLayer(service2);
                    };
                    MainMap.prototype.toggleLayer = function (id, isVisible) {
                        this.map.getLayers().getArray().forEach(function (layer) {
                            if (layer.get("id") !== undefined && layer.get("id") === id) {
                                layer.setVisible(isVisible);
                            }
                        });
                    };
                    MainMap.prototype.featureSelectById = function (id) {
                        var thiss = this;
                        thiss.layerSelected.getSource().clear(true);
                        var feature = thiss.layer.getSource().getFeatureById(id);
                        if (feature !== undefined && feature !== null) {
                            thiss.featureSelected(feature.clone());
                        }
                    };
                    MainMap.prototype.searchOverlaps = function (geometryESRI, url, layerId, callbackResult) {
                        var thiss = this;
                        if (geometryESRI === null) return null;
                        var mapSRID = thiss.map.getView().getProjection().getWKID();
                        var data = {
                            f: "json",
                            returnGeometry: true,
                            spatialRel: 'esriSpatialRelIntersects',
                            outFields: "*",
                            outSR: mapSRID,
                            geometry: JSON.stringify(geometryESRI.geometry),
                            geometryType: geometryESRI.geometryType,
                            inSR: geometryESRI.spatialReference.wkid
                        };
                        thiss.ajax({
                            method: "POST",
                            url: url + "/" + layerId + "/query",
                            data: data,
                            isJson: false,
                            validate: function () { return true; }
                        }, function (data) {
                            if (!(data.features instanceof Array)) return;
                            var geometryMiningCadaster = turf.polygon(geometryESRI.geometry.rings);
                            var geometryIntersect = null;
                            var geometryResult = null;
                            var area = 0;
                            data.features2 = [];
                            data.features.forEach(function (feature) {
                                //geometryIntersect = turf.polygon(feature.geometry.rings);
                                //geometryResult = turf.intersect(geometryIntersect, geometryMiningCadaster);
                                //feature.attributes.AREAINTERSECTED = turf.area(geometryResult) / MainMap.HECTARE;
                                //if (feature.attributes.AREAINTERSECTED > 0)
                                data.features2.push(feature);
                            });
                            delete data.features;
                            if (typeof callbackResult === "function")
                                callbackResult(data.features2);
                        });
                    };

                    MainMap.prototype.cleanControls = function (toNull) {
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
                                thiss.layerSelected = null;
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
                    MainMap.execute = function () {
                        return new MainMap();
                    };
                    return MainMap;
                })(miningcadaster.BaseMainMap);
                miningcadaster.MainMap = MainMap;
            })(miningconcession.miningcadaster || (miningconcession.miningcadaster = {}));
            var miningcadaster = miningconcession.miningcadaster;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));