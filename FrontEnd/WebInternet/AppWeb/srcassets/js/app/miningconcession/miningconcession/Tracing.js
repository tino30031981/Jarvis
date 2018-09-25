function getInstance() {
    return com.jtm.miningconcession.miningconcession.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "miningconcession/folder/listfolder",
                            form: com.jtm.Server.contextPath + "miningconcession/tracing/form",
                            save: com.jtm.Server.contextPath + "miningconcession/tracing/save",
                            detail: com.jtm.Server.contextPath + "miningconcession/tracing/detail",
                            delete: com.jtm.Server.contextPath + "miningconcession/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "miningconcession/tracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.miningConcession = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                miningconcession.Tracing = Tracing;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));