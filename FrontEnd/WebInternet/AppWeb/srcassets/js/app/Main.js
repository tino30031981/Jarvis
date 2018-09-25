(function (com) {
    (function (jtm) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.call(this);
            }
            Main.execute = function () {
                var client = new Main();
                client.load();
            };
            return Main;
        })(jtm.Master);
        jtm.Main = Main;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.Main.execute();