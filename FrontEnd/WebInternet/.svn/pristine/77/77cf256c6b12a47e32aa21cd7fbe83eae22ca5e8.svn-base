function getInstance() {
    return com.jtm.minedu.edan.FormMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (minedu) {
            (function (edan) {
                var FormMap = (function (_super) {
                    __extends(FormMap, _super);
                    function FormMap() {
                        _super.call(this);
                        this.fitExtent = function (id) {
                            var thiss = this;
                            var extent = thiss.layerPreview.getSource().getFeatureById(id).getGeometry().getExtent();
                            if (extent.equals(FormMap.EXTENTINFINITY) === true) return;
                            thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 15 });
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
                        this.layerDraw = this.buildGraphicsLayer();
                        this.layerZoneUTM = this.buildGraphicsLayer({ visible: false });
                        this.layerPoliticalDivision = this.buildGraphicsLayer({ handlerAddFeature: true });
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
                        if (thiss.layerDraw !== null) {
                            this.layerDraw.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerDraw);
                                this.layerDraw = null;
                            }
                        }
                        if (thiss.layerPoliticalDivision !== null) {
                            thiss.layerPoliticalDivision.getSource().clear();
                            if (toNull === true) {
                                this.map.removeLayer(this.layerPoliticalDivision);
                                this.layerPoliticalDivision = null;
                            }
                        }
                    };
                    FormMap.execute = function () {
                        return new FormMap();
                    };
                    return FormMap;
                })(edan.BaseFormMap);
                edan.FormMap = FormMap;
            })(minedu.edan || (minedu.edan = {}));
            var edan = minedu.edan;
        })(jtm.minedu || (jtm.minedu = {}));
        var minedu = jtm.minedu;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));