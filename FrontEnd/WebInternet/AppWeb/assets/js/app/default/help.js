(function (com) {
    (function (jtm) {
        (function (defaultt) {
            var Help = (function (_super) {
                __extends(Help, _super);
                function Help() {
                    _super.call(this);
                    this.writeImages = function () {
                        if ((this.config.module.images instanceof Array) === false) return;
                        this.config.module.images.forEach(function (item) {
                            this.$main.append('<img class="img-responsive" />');
                            this.$main.find('>img:last').attr('src', "data/help/" + this.config.appName + '/' + item + '.jpg');
                        }, this);
                    };
                }
                Help.prototype.initConfig = function () {
                    var thiss = this;
                    thiss.writeImages();
                };
                Help.prototype.load = function () {
                    _super.prototype.load.call(this, "help", { module: "default" });
                };
                Help.execute = function () {
                    var client = new Help();
                    client.load();
                };
                return Help;
            })(jtm.Master);
            defaultt.Help = Help;
        })(jtm.defaultt || (jtm.defaultt = {}));
        var defaultt = jtm.defaultt;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.defaultt.Help.execute();