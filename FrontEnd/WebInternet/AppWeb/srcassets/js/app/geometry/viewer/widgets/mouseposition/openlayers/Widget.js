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
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.control = new ol.control.MousePosition({
                                    target: thiss.$lblCoordinate[0],
                                    coordinateFormat: function (coordinates) { return thiss.show(coordinates); },
                                    undefinedHTML: 'El puntero no está sobre el mapa.'
                                });
                                thiss.map.addControl(thiss.control);
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