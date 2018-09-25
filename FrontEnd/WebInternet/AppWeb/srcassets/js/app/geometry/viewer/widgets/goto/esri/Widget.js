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
                                thiss.layer = new esri.layers.GraphicsLayer({
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layer);
                            };
                            Widget.prototype.search = function () {
                                this.layer.clear();
                                this.map.infoWindow.hide();
                                var srid = this.$ddlSpatialReference.int32();
                                var x = this.$txtX.val();
                                var y = this.$txtY.val();
                                if (this.validate() === false)
                                    return;
                                var coordinates = this.project([x, y], srid, this.map.spatialReference.wkid);
                                var feature = new esri.Graphic(new esri.geometry.Point(coordinates, this.map.spatialReference));
                                feature.setInfoTemplate(new esri.InfoTemplate("Coordenadas", "<span>Este (X): </span>" + x + "<br /><span>Norte (Y): </span>" + y + "<br />"));
                                this.map.infoWindow.setTitle(feature.getTitle());
                                this.map.infoWindow.setContent(feature.getContent());
                                this.map.infoWindow.show(feature.geometry);
                                this.layer.add(feature);
                                this.map.centerAndZoom(feature.geometry, 12);
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
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