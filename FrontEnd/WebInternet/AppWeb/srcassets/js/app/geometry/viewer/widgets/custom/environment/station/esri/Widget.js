function getObject() {
    return com.jtm.geometry.viewer.widgets.custom.environment.station.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (environment) {
                            (function (station) {
                                var Widget = (function (_super) {
                                    __extends(Widget, _super);
                                    function Widget() {
                                        _super.call(this);
                                        this.buildStyle = function () {
                                            var thiss = this;
                                            var color = esri.Color.fromHex(com.jtm.helper.RandomColor.random());
                                            //var markerStyle = new esri.symbol.SimpleMarkerSymbol();
                                            //markerStyle.setColor(color);
                                            //markerStyle.setOutline(null);
                                            //markerStyle.setSize("10");
                                            var lineStyle = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, color, 10);
                                            var fillMarkerStyle = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineStyle, color);
                                            var markerStyle = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, lineStyle);
                                            return markerStyle;
                                        };
                                    }
                                    Widget.prototype.initConfig = function () {
                                        _super.prototype.initConfig.call(this);
                                    };
                                    Widget.prototype.launchView = function () {
                                        var thiss = this;
                                        _super.prototype.launchView.call(this);
                                        this.layer = new esri.layers.FeatureLayer({
                                            layerDefinition: {
                                                geometryType: "esriGeometryPoint",
                                                fields: [{
                                                    name: "stationcode",
                                                    type: "esriFieldTypeString",
                                                    alias: "stationcode"
                                                }, {
                                                    name: "value",
                                                    type: "esriFieldTypeDouble",
                                                    alias: "value"
                                                }]
                                            },
                                            featureSet: null
                                        }, {
                                                outFields: ["stationcode"],
                                                showLabels: true
                                            });
                                        var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{stationcode}" }, labelPlacement: "below-center" });
                                        var textStyle = new esri.symbol.TextSymbol();
                                        textStyle.setColor(new esri.Color([255, 255, 255, 1]));
                                        textStyle.setVerticalAlignment('middle');
                                        textStyle.font.setSize("12px");
                                        textStyle.font.setFamily("Calibri,sans-serif");
                                        //labelClass.symbol = this.config.module.widget.symbols["text"]["selection"];
                                        labelClass.symbol = textStyle;
                                        this.layer.setLabelingInfo([labelClass]);
                                        this.map.addLayer(this.layer);
                                    };
                                    Widget.prototype.search = function () {
                                        var thiss = this;
                                        thiss.cleanControls(false);
                                        if (this.validate() === false)
                                            return;                                        
                                        //this.layer.clear();                                        
                                        var parameterId = thiss.$ddlParameter.int32();
                                        var agreementId = thiss.$ddlAgreement.int32();
                                        var activityId = thiss.$ddlActivity.int32();
                                        var query = new esri.tasks.Query();
                                        query.returnGeometry = true;
                                        query.outSpatialReference = this.map.spatialReference;
                                        query.outFields = thiss.config.module.widget.service.fields;
                                        query.where = getSql(parameterId, agreementId, activityId);
                                        var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
                                        task.execute(query).addCallback(function (response) {
                                            if (response.hasOwnProperty('error')) {
                                                toastr.info('Ha ocurrido un error');
                                                return;
                                            }
                                            var features = [];
                                            response.features.forEach(function (feature, i) {
                                                if (features.indexOf(feature.attributes['stationcode']) === -1) {
                                                    features.push(feature.attributes['stationcode']);
                                                    feature.setId(feature.attributes['stationcode']);
                                                    feature.setSymbol(thiss.buildStyle());
                                                    thiss.layer.add(feature);
                                                }
                                            });
                                            features = null;
                                            thiss.map.setExtent(esri.graphicsExtent(thiss.layer.graphics), true);
                                            thiss.buildChart(response.features);
                                        });
                                        thiss.layer.on("click", function (e) {
                                            thiss.onMouseClickGraphicToElement(e.graphic);
                                        });
                                        function getSql(parameterId, agreementId, activityId) {
                                            var sql = '';
                                            if (agreementId !== 0 && activityId === 0)
                                                sql = "parameterid={0} and agreementid={1}".replace('{0}', parameterId).replace('{1}', agreementId);
                                            else if (agreementId !== 0 && activityId !== 0)
                                                sql = "parameterid={0} and agreementid={1} and activityid={2}".replace('{0}', parameterId).replace('{1}', agreementId).replace('{2}', activityId);
                                            return sql;
                                        }
                                    };
                                    Widget.prototype.getColor = function (stationCode) {
                                        var thiss = this;
                                        var items = thiss.layer.graphics;
                                        var i = 0;
                                        var color = '#000000';
                                        for (i = 0; i < items.length; i++) {
                                            if (items[i].getId() == stationCode) {
                                                color = items[i].getShape().strokeStyle.color.toHex();
                                            }
                                        }
                                        return color;
                                    };
                                    Widget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                                        _super.prototype.onMouseClickGraphicToElement.call(this, graphic, $dom, options);
                                        this.map.infoWindow.hide();
                                        this.map.infoWindow.clearFeatures();
                                        this.map.infoWindow.setFeatures([graphic]);
                                        this.map.infoWindow.setTitle('Estación ' + graphic.getId());
                                        var content = '<table>';
                                        graphic.attributes['stations'].forEach(function (station) {
                                            content += "<tr><td>" + station.activityname + " : </td><td> <b>" + station.value + "</b></td></tr>";
                                        });                                        
                                        content += '</table>';
                                        this.map.infoWindow.setContent(content);
                                        this.map.infoWindow.show(graphic.geometry.getCentroid());
                                    };
                                    Widget.prototype.cleanControls = function (toNull) {
                                        _super.prototype.cleanControls.call(this, toNull);
                                        if (this.layer !== null) {
                                            this.layer.clear();
                                            if (toNull === true) {
                                                this.map.removeLayer(this.layer);
                                                this.layer = null;
                                            }
                                        }
                                    };
                                    Widget.execute = function () {
                                        return new Widget();
                                    };
                                    return Widget;
                                })(station.BaseWidget);
                                station.Widget = Widget;
                            })(environment.station || (environment.station = {}));
                            var station = environment.station;
                        })(custom.environment || (custom.environment = {}));
                        var environment = custom.environment;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));