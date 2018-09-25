(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (navigation) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.navigation = null;
                            }
                            return BaseWidget;
                        })(geometry.Widget);
                        navigation.BaseWidget = BaseWidget;
                    })(widgets.navigation || (widgets.navigation = {}));
                    var navigation = widgets.navigation;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));