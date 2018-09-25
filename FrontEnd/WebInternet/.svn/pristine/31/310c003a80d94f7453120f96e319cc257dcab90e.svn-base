function getObject() {
    return com.jtm.catalog.widgets.basic.Widget.execute();
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
                            };
                            Widget.prototype.addToMap = function (feature2) {
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                this.infoWindow.hide();
                            };
                            Widget.execute = function () {
                                return new Widget();
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