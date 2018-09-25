function getObject() {
    return com.jtm.webservice.widgets.wfs.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wfs) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                            };
                            Widget.prototype.searchLayers = function (obj) {
                                var thiss = this;
                                _super.prototype.searchLayers.call(this, obj);
                                thiss.layer.clear();
                            };
                            Widget.prototype.detailLayer = function (obj) {
                                var thiss = this;
                                _super.prototype.detailLayer.call(this, obj);
                                //thiss.layer.getSource().clear();
                            };
                            Widget.prototype.fitExtent = function () {
                            };
                            Widget.prototype.addToMap = function (item) {
                            };
                            Widget.prototype.cleanControls = function () {
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(wfs.BaseWidget);
                        wfs.Widget = Widget;
                    })(widgets.wfs || (widgets.wfs = {}));
                    var wfs = widgets.wfs;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));