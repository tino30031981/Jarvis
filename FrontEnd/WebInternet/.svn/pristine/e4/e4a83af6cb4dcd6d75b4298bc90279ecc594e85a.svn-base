function getObject() {
    return com.jtm.geometry.viewer.widgets.monitoring.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (monitoring) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.getCoordinates = function () {
                                    var thiss = this;
                                    var coordinates = [];
                                    thiss.$tblCoordinates.find(">tbody>tr").toArray().forEach(function (tr) {
                                        coordinates.push({ x: parseFloat(jQuery(tr).find('td:eq(1)>input').val()), y: parseFloat(jQuery(tr).find('td:eq(2)>input').val()) });
                                    });
                                    return coordinates;
                                };
                                this.writeCoordinates = function (geometry) {
                                    var thiss = this;
                                    geometry.forEach(function (item, i) {
                                        var item = thiss.project(item, Widget.SRIDDEFAULTMAP, Widget.SRIDDEFAULTAPP);
                                        thiss.$tblCoordinates.find(">tbody").append("<tr></tr>");
                                        thiss.$tblCoordinates.find(">tbody>tr:last").append('<td> ' + (i + 1) + ' </td><td> <input type="text" value="' + item[0] + '"> </td><td> <input type="text" value="' + item[1] + '"> </td>');
                                    });
                                };
                                this.addMonitoring = function (geometry) {
                                    var thiss = this;
                                    thiss.clearTable();
                                    var coordinates = thiss.getCoordinates();
                                    var item = {
                                        name: jQuery('#txtName').string(),
                                        coordinates: coordinates,
                                        spatialReference: { id: Widget.SRIDDEFAULTAPP }
                                    };
                                    var options = {
                                        data: item,
                                        validate: validate,
                                        isJson: true
                                    };
                                    this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/monitoring/save', options, function () {
                                        thiss.search();
                                    });
                                    function validate() {
                                        var success = true;
                                        var message = '';
                                        if (this.coordinates === null) {
                                            success = false;
                                            message = 'grafique el area a consultar.';
                                        } else if (jQuery('#txtName').string() === '') {
                                            success = false;
                                            message = 'Ingrese un nombre al area graficada.';
                                            jQuery('#txtName').focus();
                                            if (message !== '')
                                                alert(message);
                                            return success;
                                        }
                                    };
                                };
                                this.graphic = function (geometry) {
                                    var thiss = this;
                                    var graphic = new esri.Graphic(geometry);
                                    thiss.layerDraw.add(graphic);
                                    var extent = geometry.getExtent();
                                    thiss.map.setExtent(extent, true);
                                };
                                this.graphicShp = function (geometry, coordinates, srid) {
                                    var thiss = this;
                                    if (geometry === undefined || geometry === null) return;
                                    var coordinatesOriginal = JSON.stringify(coordinates);
                                    geometry.setSpatialReference(thiss.map.spatialReference);
                                    var feature = new esri.Graphic(geometry);
                                    feature.setAttributes({ vertex: '', id: 0, coordinate: coordinatesOriginal, srid: srid });
                                    var id = thiss.getUUID();
                                    feature.setId(id);
                                    thiss.layerDraw.add(feature);
                                    var extent = feature.geometry.getExtent();
                                    thiss.map.setExtent(extent, true);
                                };
                                //this.fillFeature = function (items) {
                                //    var thiss = this;
                                //    var geometry = null;
                                //    items.forEach(function (item) {
                                //        if (item === null || item.length === 0) return;
                                //        geometry = new esri.geometry.Polygon(item.coordinates);
                                //        thiss.layerMonitoring.add(geometry);
                                //    });
                                //};
                            }
                            Widget.prototype.analizeCoordinates = function (coordinates, srid) {
                                var thiss = this;
                                for (i = 0; i < coordinates[0].length; i++) {
                                    coordinates[0][i] = thiss.project(coordinates[0][i], srid, Widget.SRIDDEFAULTMAP);
                                }
                                var geometry = new esri.geometry.Polygon(coordinates);
                                thiss.graphicShp(geometry, coordinates,srid);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new esri.layers.FeatureLayer({
                                    layerDefinition: {
                                        geometryType: "esriGeometryAny",
                                        fields: [{
                                            name: "name",
                                            type: "esriFieldTypeString",
                                            alias: "name"
                                        }]
                                    },
                                    featureSet: null
                                }, {
                                    outFields: ["name"],
                                    showLabels: true,
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["highlight"];
                                    }
                                });
                                thiss.layersConcession = new esri.layers.FeatureLayer({
                                    layerDefinition: {
                                        geometryType: "esriGeometryAny",
                                        fields: [{
                                            name: "name",
                                            type: "esriFieldTypeString",
                                            alias: "name"
                                        }]
                                    },
                                    featureSet: null
                                }, {
                                    outFields: ["name"],
                                    showLabels: true,
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{name}" }, labelPlacement: "below-center" });
                                labelClass.symbol = thiss.config.module.widget.symbols["text"]["default"];
                                thiss.layer.setLabelingInfo([labelClass]);
                                thiss.layer.id = thiss.getUUID();
                                thiss.map.addLayer(thiss.layer);
                                thiss.map.addLayer(thiss.layersConcession);
                                thiss.layerDraw = new esri.layers.GraphicsLayer({
                                    style: function (feature) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layerDraw);
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.deactivate();
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.draw.deactivate();
                                    thiss.layerDraw.clear();
                                    thiss.$tblCoordinates.find(">tbody").empty();
                                    thiss.graphic(e.geometry);
                                    thiss.writeCoordinates(e.geometry.rings[0]);
                                });                                
                            };
                            Widget.prototype.fillFeaturesMap = function (data) {
                                var thiss = this;
                                _super.prototype.fillFeaturesMap.call(this, data);
                                if (data.featuresList === null) return;
                                if (data.featuresList.features === null || data.featuresList.features.lenght === 0) return;
                                var graphic = null;
                                data.featuresList.features.forEach(function (feature) {
                                    graphic = new esri.Graphic(feature);
                                    thiss.layer.add(graphic);
                                });
                                var extent = esri.graphicsExtent(thiss.layer.graphics);
                                thiss.map.setExtent(extent, true);

                            };
                            Widget.prototype.searchOnService = function (id) {
                                var thiss = this;
                                var query = new esri.tasks.Query();
                                query.returnGeometry = true;
                                query.outSpatialReference = thiss.map.spatialReference;
                                query.outFields = thiss.config.module.widget.service.fields;
                                query.where = thiss.config.module.widget.service.joinField + " IN (" + id + ")";
                                var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
                                task.execute(query).addCallback(function (response) {
                                    if (response.hasOwnProperty('error')) {
                                        toastr.info('Ha ocurrido un error');
                                        return;
                                    }
                                    thiss.layersConcession.clear();
                                    console.log(response);
                                    response.features.forEach(function (item) {
                                        if (item === null || item.length === 0) return;
                                        thiss.layersConcession.add(item);
                                    });
                                    var extent = esri.graphicsExtent(thiss.layersConcession.graphics);
                                    thiss.map.setExtent(extent, true);
                                    //var infoTemplate = thiss.parseInfoTemplate(
                                    //    {
                                    //        fields: response.fields,
                                    //        title: response.displayFieldName,
                                    //        useCustomInfoTemplate: thiss.config.module.widget.service.useCustomInfoTemplate,
                                    //        customInfoTemplate: thiss.config.module.widget.infoTemplate,
                                    //        extraFields: thiss.config.module.widget.service.extraAttributes
                                    //    });
                                    //console.log(response);
                                    //thiss.layer.setInfoTemplate(infoTemplate);
                                    //thiss.fillResult(response);
                                });
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                if (this.draw !== null)
                                    this.draw.deactivate();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(monitoring.BaseWidget);
                        monitoring.Widget = Widget;
                    })(widgets.monitoring || (widgets.monitoring = {}));
                    var monitoring = widgets.monitoring;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));