function getObject() {
    return com.jtm.geometry.viewer.widgets.scale.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (scale) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.config.module.widget.unit = (String.isNullOrWhiteSpace(thiss.config.module.widget.unit) === true) ? "metric" : thiss.config.module.widget.unit;
                                this.scale = new esri.dijit.Scalebar({
                                    map: thiss.map,
                                    scalebarUnit: thiss.config.module.widget.unit
                                }, thiss.$widget[0]);
                                thiss.$widget.find(".esriScalebar").css({ "position": "inherit", "height": "auto" });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(scale.BaseWidget);
                        scale.Widget = Widget;
                    })(widgets.scale || (widgets.scale = {}));
                    var scale = widgets.scale;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));