function getObject() {
    return new com.jtm.catalog.widgets.basic.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (catalog) {
                (function (widgets) {
                    (function (basic) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new ol.layer.Vector({
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                    },
                                    source: new ol.source.Vector()
                                });
                                thiss.layer.getSource().on("addfeature", function (e) {
                                    var extent = thiss.layer.getSource().getExtent();
                                    if (extent.equals(Widget.EXTENTINFINITY) === true) return;
                                    thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                                });
                                thiss.map.addLayer(thiss.layer);
                            };
                            Widget.prototype.search = function (startPosition) {
                                var thiss = this;
                                thiss.$divResult.empty();
                                thiss.layer.getSource().clear();
                                if (thiss.infoWindow === null) {
                                    thiss.infoWindow = new ol.Overlay.Popup();
                                    thiss.map.addOverlay(thiss.infoWindow);
                                }
                                thiss.infoWindow.hide();
                                var spatialFilter = new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Spatial.BBOX,
                                    property: "ows:BoundingBox",
                                    value: new OpenLayers.Bounds(-8878462, 4930820, 8027433, 5697234)
                                });
                                gh.spatial.helper.CswHelper.search(ol.proxyUrl + thiss.$ddlServer.val(), {
                                    data: thiss.parameters(startPosition)
                                }, function (data) {
                                    thiss.writeData(data);
                                });
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                this.detachMapEventsSynchronize();
                                this.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                            };
                            Widget.prototype.addToMap = function (feature2) {
                                var thiss = this;
                                if (feature2 === undefined || feature2 === null || feature2.srid === 0) return;
                                var polygon = ol.geom.Polygon.fromExtent(feature2.geometry);
                                var spatialReference = ol.proj.get(feature2.srid);
                                polygon = polygon.transform(spatialReference, thiss.map.getView().getProjection());
                                var feature = new ol.Feature({
                                    geometry: polygon
                                });
                                feature.setId(feature2.id);
                                feature.setProperties(feature2.properties);
                                thiss.layer.getSource().addFeature(feature);
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                            };
                            return Widget;
                        })(basic.BaseWidget);
                        basic.Widget = Widget;
                    })(widgets.basic || (widgets.basic = {}));
                    var basic = widgets.basic;
                })(catalog.widgets || (catalog.widgets = {}));
                var widgets = catalog.widgets;
            })(geometry.catalog || (geometry.catalog = {}));
            var catalog = geometry.catalog;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));