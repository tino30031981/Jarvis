function getObject() {
    return com.jtm.webservice.widgets.wms.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wms) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                            };
                            Widget.prototype.fitExtent = function () {
                                var thiss = this;
                            };
                            Widget.prototype.addToMap = function (item) {
                                var thiss = this;
                            };
                            Widget.prototype.cleanControls = function () {
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(wms.BaseWidget);
                        wms.Widget = Widget;
                    })(widgets.wms || (widgets.wms = {}));
                    var wms = widgets.wms;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));