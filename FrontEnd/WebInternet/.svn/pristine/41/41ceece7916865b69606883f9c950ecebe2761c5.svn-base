function getInstance() {
    return com.jtm.uea.uea.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (uea) {
            (function (uea) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "uea/folder/listfolder",
                            form: com.jtm.Server.contextPath + "uea/tracing/form",
                            save: com.jtm.Server.contextPath + "uea/tracing/save",
                            detail: com.jtm.Server.contextPath + "uea/tracing/detail",
                            delete: com.jtm.Server.contextPath + "uea/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "uea/tracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.uea = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                uea.Tracing = Tracing;
            })(uea.uea || (uea.uea = {}));
            var uea = uea.uea;
        })(jtm.uea || (jtm.uea = {}));
        var uea = jtm.uea;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));