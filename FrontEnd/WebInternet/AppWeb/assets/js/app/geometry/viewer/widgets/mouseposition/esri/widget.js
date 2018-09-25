function getObject() {
    return com.jtm.geometry.viewer.widgets.mouseposition.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (mouseposition) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.show = function (point) {
                                    var thiss = this;
                                    if (thiss.config.module.widget.isShow === false) return;
                                    var sridTo = thiss.$ddlSpatialReference.val();
                                    if (sridTo === 0 || sridTo === undefined || sridTo === null) return;
                                    var toProj = proj4('EPSG:' + sridTo);
                                    var fromProj = proj4('EPSG:' + thiss.map.spatialReference.wkid);
                                    var coordinates = proj4(fromProj, toProj).forward([point.x, point.y]);
                                    var decimals = thiss.config.module.widget.decimalNumbers;
                                    thiss.$lblCoordinate.html("X: " + coordinates[0].toFixed(decimals) + ", Y: " + coordinates[1].toFixed(decimals));
                                };
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.map.on("mouse-move", function (e) {
                                    thiss.show(e.mapPoint);
                                });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(mouseposition.BaseWidget);
                        mouseposition.Widget = Widget;
                    })(widgets.mouseposition || (widgets.mouseposition = {}));
                    var mouseposition = widgets.mouseposition;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));