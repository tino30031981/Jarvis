var com;
(function (com) {
    (function (jtm) {
        (function (defaultt) {
            var Index = (function (_super) {
                __extends(Index, _super);
                function Index() {
                    _super.call(this);
                    this.prefix = "def";
                }
                Index.prototype.initConfig = function () {
                    //window.location = 'layout.html';
                };
                //Index.prototype.load = function () {
                //    _super.prototype.load.call(this, "default", "index");
                //};
                Index.execute = function () {
                    var client = new Index();
                    client.load();
                };
                return Index;
            })(jtm.Master);
            defaultt.Index = Index;
        })(jtm.defaultt || (jtm.defaultt = {}));
        var defaultt = jtm.defaultt;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.defaultt.Index.execute();