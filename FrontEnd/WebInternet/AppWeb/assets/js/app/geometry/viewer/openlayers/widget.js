(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                var Widget = (function (_super) {
                    __extends(Widget, _super);
                    function Widget() {
                        _super.call(this);
                    }
                    return Widget;
                })(geometry.Widget);
                viewer.Widget = Widget;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));