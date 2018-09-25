function getObject() {
    return com.jtm.geometry.viewer.widgets.goto.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (goto) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new ol.layer.Vector({
                                    source: new ol.source.Vector(),
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layer);
                            };
                            Widget.prototype.search = function () {
                                this.layer.getSource().clear(true);
                                this.infoWindow.hide();
                                var srid = this.$ddlSpatialReference.int32();
                                var x = this.$txtX.val();
                                var y = this.$txtY.val();
                                if (this.validate() === false)
                                    return;
                                var coordinates = this.project([x, y], srid, this.map.getView().getProjection().getWKID());
                                var feature = new ol.Feature({
                                    geometry: new ol.geom.Point(coordinates)
                                });
                                feature.setProperties({ x: x, y: y, srid: srid });
                                thiss.layer.getSource().addFeature(feature);
                                var extent = feature.getGeometry().getExtent();
                                var coordinate = ol.extent.getCenter(extent);
                                var html = "<div>Coordenadas</div><span>Este (X):</span>" + x + "<br />" +
                                    "<span>Norte (Y):</span>" + y + "<br />";
                                this.infoWindow.show(coordinate, html);
                                this.map.getView().fit(extent, this.map.getSize(), { maxZoom: 10 });
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                this.infoWindow.hide();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(goto.BaseWidget);
                        goto.Widget = Widget;
                    })(widgets.goto || (widgets.goto = {}));
                    var goto = widgets.goto;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));