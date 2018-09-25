(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (catalog) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                    }
                    Main.prototype.load = function () {
                        var thiss = this;
                        _super.prototype.load.call(this, "catalog", { module: "geometry", subModule: "catalog" });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(geometry.Map);
                catalog.Main = Main;
            })(geometry.catalog || (geometry.catalog = {}));
            var catalog = geometry.catalog;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geometry.catalog.Main.execute();