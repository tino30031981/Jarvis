(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (catalog) {
                var Widget = (function (_super) {
                    __extends(Widget, _super);
                    function Widget() {
                        _super.call(this);
                    }
                    return Widget;
                })(geometry.Widget);
                catalog.Widget = Widget;
            })(geometry.catalog || (geometry.catalog = {}));
            var catalog = geometry.catalog;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));