function getInstance() {
    return com.jtm.society.holder.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (society) {
            (function (holder) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "society/folder/listfolder",
                            form: com.jtm.Server.contextPath + "society/tracing/form",
                            save: com.jtm.Server.contextPath + "society/tracing/save",
                            detail: com.jtm.Server.contextPath + "society/tracing/detail",
                            delete: com.jtm.Server.contextPath + "society/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "society/tracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.holder = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                holder.Tracing = Tracing;
            })(society.holder || (society.holder = {}));
            var holder = society.holder;
        })(jtm.society || (jtm.society = {}));
        var society = jtm.society;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));