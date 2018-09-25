function getInstance() {
    return com.jtm.environment.fiscalization.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (fiscalization) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "environment/fiscalizationfolder/listfolder",
                            form: com.jtm.Server.contextPath + "environment/fiscalizationtracing/form",
                            save: com.jtm.Server.contextPath + "environment/fiscalizationtracing/save",
                            detail: com.jtm.Server.contextPath + "environment/fiscalizationtracing/detail",
                            delete: com.jtm.Server.contextPath + "environment/fiscalizationtracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "environment/fiscalizationtracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.fiscalization = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                fiscalization.Tracing = Tracing;
            })(environment.fiscalization || (environment.fiscalization = {}));
            var fiscalization = environment.fiscalization;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));