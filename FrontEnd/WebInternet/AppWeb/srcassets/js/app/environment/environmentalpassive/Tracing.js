function getInstance() {
    return com.jtm.environment.environmentalpassive.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (environmentalpassive) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "environment/folder/listfolder",
                            form: com.jtm.Server.contextPath + "environment/tracing/form",
                            save: com.jtm.Server.contextPath + "environment/tracing/save",
                            detail: com.jtm.Server.contextPath + "environment/tracing/detail",
                            delete: com.jtm.Server.contextPath + "environment/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "environment/tracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.environmentalPassive = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                environmentalpassive.Tracing = Tracing;
            })(environment.environmentalpassive || (environment.environmentalpassive = {}));
            var environmentalpassive = environment.environmentalpassive;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));