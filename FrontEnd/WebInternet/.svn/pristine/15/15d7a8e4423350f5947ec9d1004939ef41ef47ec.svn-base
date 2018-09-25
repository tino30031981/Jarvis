function getInstance() {
    return com.jtm.incidence.incidence.FormMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (incidence) {
            (function (incidence) {
                var FormMap = (function (_super) {
                    __extends(FormMap, _super);
                    function FormMap() {
                        _super.call(this);
                        this.addGeometryToLayer = function (layer, geometry) {
                            var geometryMAP = this.transform(geometry, this.map.getView().getProjection().getWKID());
                            var geometryDB = this.transform(geometry, FormMap.SRIDDEFAULTAPP);
                            var spatialReference = ol.proj.get('EPSG:' + geometry.spatialReference.id);
                            var geometry2 = null;
                            if (geometry.type === FormMap.OGCTYPES.POINT) {
                                geometry2 = new ol.geom.Point(geometryMAP.coordinates);
                            }
                            else if (geometry.type === FormMap.OGCTYPES.LINESTRING) {
                                geometry2 = new ol.geom.LineString(geometryMAP.coordinates);
                            }
                            else if (geometry.type === FormMap.OGCTYPES.POLYGON) {
                                geometry2 = new ol.geom.Polygon(geometryMAP.coordinates);
                            }
                            else {
                                window.plugins.toast.showLongBottom('Tipo de geometría no identificada');
                                return;
                            }
                            var feature = new ol.Feature({
                                geometry: geometry2
                            });
                            feature.setId(0);
                            feature.setProperties({ 'geometryy': JSON.stringify(geometryDB) });
                            layer.getSource().addFeature(feature);
                            var extent = feature.getGeometry().getExtent();
                            this.map.getView().fit(extent, this.map.getSize(), { maxZoom: 10 });
                        };
                        this.getKML = function (items, options) {
                            var thiss = this;
                            items = items instanceof Array ? items : [items];
                            options = options || {};
                            options.folderName = options.folderName || 'Folder';
                            options.folderDescription = "";

                            var kml = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n';
                            kml += '<kml xmlns="http://www.opengis.net/kml/2.2">' + '\r\n';
                            kml += '<Document>' + '\r\n';
                            kml += '<open>1</open>' + '\r\n';
                            kml += '<name>Incidencias</name>' + '\r\n';
                            kml += '<description>Incidencias generado por SIGEMIN MOBILE</description>' + '\r\n';
                            kml += '<Style id="style">';
                            kml += '<IconStyle>';
                            kml += '<color>' + converter.rgbaToKml(thiss.config.module.map.symbols['Point']['highlight'].getColor().replace(/rgba\(/i, '').replace(')', '')) + '</color>' + '\r\n';
                            kml += '</IconStyle>';
                            kml += '<LineStyle>' + '\r\n';
                            kml += '<color>' + converter.rgbaToKml(thiss.config.module.map.symbols['Polygon']['highlight'].getStroke().getColor().replace(/rgba\(/i, '').replace(')', '')) + '</color>' + '\r\n';
                            kml += '<width>1.5</width>' + '\r\n';
                            kml += '</LineStyle>' + '\r\n';
                            kml += '<PolyStyle>' + '\r\n';
                            kml += '<color>' + converter.rgbaToKml(thiss.config.module.map.symbols['Polygon']['highlight'].getFill().getColor().replace(/rgba\(/i, '').replace(')', '')) + '</color>' + '\r\n';
                            kml += '</PolyStyle>' + '\r\n';
                            kml += '</Style>' + '\r\n';
                            kml += '<Folder>' + '\r\n';
                            kml += '<name>' + options.folderName + '</name>' + '\r\n';
                            kml += '<visibility>0</visibility>' + '\r\n';
                            kml += '<open>1</open>' + '\r\n';
                            var i = 0;
                            for (i = 0; i < items.length; i++) {
                                kml += '<Placemark>';
                                kml += '<styleUrl>#style</styleUrl>';
                                kml += '<name>' + items[i].name + '</name>' + '\r\n';
                                kml += '<description><![CDATA[ ' + items[i].description + ' ]]></description>' + '\r\n';
                                if (items[i].geometry.type === "Point") {
                                    kml += '<Point>' + '\r\n';
                                    kml += '<coordinates>' + '\r\n';
                                    kml += coordinates[0] + "," + coordinates[1] + " ";
                                    kml += '</coordinates>' + '\r\n';
                                    kml += '</Point>' + '\r\n';
                                }
                                else if (items[i].geometry.type === "LineString") {

                                }
                                else if (items[i].geometry.type === "Polygon") {
                                    kml += '<Polygon>' + '\r\n';
                                    kml += '<outerBoundaryIs>' + '\r\n';
                                    kml += '<LinearRing>' + '\r\n';
                                    kml += '<coordinates>' + '\r\n';
                                    var i = 0;
                                    for (i = 0; i < coordinates[0].length; i++) {
                                        coordinates[0][i] = thiss.project(coordinates[0][i], srid, FormMap.SRIDDEFAULTGPS);
                                        kml += coordinates[0][i][0] + "," + coordinates[0][i][1] + " ";
                                    }
                                    kml += '</coordinates>' + '\r\n';
                                    kml += '</LinearRing>' + '\r\n';
                                    kml += '</outerBoundaryIs>' + '\r\n';
                                    kml += '</Polygon>' + '\r\n';
                                }
                                kml += '</Placemark>' + '\r\n';
                                if (items[i].withVertex === true) {
                                    kml += '<Folder>' + '\r\n';
                                    kml += '<name>Vértices</name>' + '\r\n';
                                    kml += '<visibility>0</visibility>' + '\r\n';
                                    kml += '<open>0</open>' + '\r\n';
                                    for (i = 0; i < coordinates[0].length - 1; i++) {
                                        kml += '<Placemark>' + '\r\n';
                                        kml += '<name>' + (i + 1) + '</name>' + '\r\n';
                                        kml += '<Point>' + '\r\n';
                                        kml += '<coordinates>';
                                        kml += coordinates[0][i][0] + "," + coordinates[0][i][1] + " ";
                                        kml += '</coordinates>' + '\r\n';
                                        kml += '</Point>' + '\r\n';
                                        kml += '</Placemark>' + '\r\n';
                                    }
                                    kml += '</Folder>' + '\r\n';
                                }
                            }
                            kml += '</Folder>' + '\r\n';
                            kml += '</Document>' + '\r\n';
                            kml += '</kml>';
                            return kml;//application/vnd.google-earth.kml+xml
                        };
                    }
                    FormMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        this.layerDraw = this.buildGraphicsLayer();
                    };
                    FormMap.prototype.addGeometry = function (geometry) {
                        this.layer.getSource().clear(true);
                        this.addGeometryToLayer(this.layer, geometry);
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
                        }, this);
                        thiss.draw.on('drawend', function (e) {
                            thiss._toggleDragPan(true);
                            thiss.map.removeInteraction(thiss.draw);
                            if (e.feature.getGeometry().getType() === "Circle") {
                                e.feature.setGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()));
                            }
                            thiss.callbackMapDraw(e.feature.getGeometry());
                        }, this);
                    };
                    FormMap.prototype.callbackMapDraw = function (geometry) {
                        if (geometry === null) return;
                        this.layerDraw.getSource().clear(true);
                        var geometry2 = {
                            type: geometry.getType(),
                            coordinates: geometry.getCoordinates(),
                            spatialReference: { id: this.map.getView().getProjection().getWKID() }
                        };
                        this.addGeometryToLayer(this.layerDraw, geometry2);
                    };
                    FormMap.prototype.callbackCapturePoint = function (geometry) {
                        this.layerDraw.getSource().clear(true);
                        this.addGeometryToLayer(this.layerDraw, geometry);
                    };
                    FormMap.prototype.getGeometry = function () {
                        var geometry = null;
                        var feature = this.layerDraw.getSource().getFeatureById(0);
                        if (feature !== null)
                            geometry = feature.getProperties()["geometryy"];
                        else {
                            feature = this.layer.getSource().getFeatures()[0];
                            if (feature !== undefined && feature !== null)
                                geometry = feature.getProperties()["geometryy"];
                        }
                        return (String.isNullOrWhiteSpace(geometry) === true ? null : geometry);
                    };
                    FormMap.prototype.cleanLayerDraw = function (toNull) {
                        toNull = typeof toNull === "boolean" ? toNull : false;
                        _super.prototype.cleanLayerDraw.call(this, toNull);
                        if (this.layerDraw !== null) {
                            this.layerDraw.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layerDraw);
                                this.layerDraw = null;
                            }
                        }
                    };
                    FormMap.prototype.cleanControls = function (toNull) {
                        toNull = typeof toNull === "boolean" ? toNull : false;
                        _super.prototype.cleanControls.call(this, toNull);
                        if (this.layer !== null) {
                            this.layer.getSource().clear(true);
                            if (toNull === true) {
                                this.map.removeLayer(this.layer);
                                this.layer = null;
                            }
                        }
                        this.cleanLayerDraw(toNull);
                    };
                    FormMap.execute = function () {
                        return new FormMap();
                    };
                    return FormMap;
                })(incidence.BaseFormMap);
                incidence.FormMap = FormMap;
            })(incidence.incidence || (incidence.incidence = {}));
            var incidence = incidence.incidence;
        })(jtm.incidence || (jtm.incidence = {}));
        var incidence = jtm.incidences;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));