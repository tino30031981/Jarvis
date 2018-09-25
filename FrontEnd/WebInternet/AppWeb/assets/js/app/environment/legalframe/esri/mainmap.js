function getInstance() {
    return com.jtm.environment.legalframe.MainMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (legalframe) {
                var MainMap = (function (_super) {
                    __extends(MainMap, _super);
                    function MainMap() {
                        _super.call(this);                        
                    }
                    MainMap.prototype.clean = function () {
                        var thiss = this;
                        if (thiss.layer !== null)
                            thiss.layer.clear();
                    };
                    MainMap.execute = function () {
                        return new MainMap();
                    };                    
                    return MainMap;
                })(legalframe.BaseMainMap);
                legalframe.MainMap = MainMap;
            })(environment.legalframe || (environment.legalframe = {}));
            var legalframe = environment.legalframe;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));