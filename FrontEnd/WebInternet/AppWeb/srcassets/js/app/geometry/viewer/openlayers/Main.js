(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                    }
                    Main.prototype.load = function () {
                        var thiss = this;
                        _super.prototype.load.call(this);
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(geometry.Map);
                viewer.Main = Main;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geometry.viewer.Main.execute();