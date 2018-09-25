(function (com) {
    (function (jtm) {
        (function (society) {
            (function (holder) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "society/folder/listfolder",
                            form: com.jtm.Server.contextPath + "society/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "society/tracing/save",
                            tracingdetail: com.jtm.Server.contextPath + "society/tracing/detail",
                            delete: com.jtm.Server.contextPath + "society/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "society/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "society/tracingdocument/searchtracingdocument",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    TracingDocument.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        _super.prototype.search.call(this, thiss.urls.searchtracingdocument, options, callback);
                    };
                    TracingDocument.prototype.parametersSearch = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSearch.call(this);                        
                        data.holderCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.holder = { id: thiss.$hdnId };
                        return data;
                    };
                    TracingDocument.prototype.detail = function (url, id, options) {
                        var thiss = this;
                    };
                    TracingDocument.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "society/alert/save", data, options);
                    };
                    TracingDocument.execute = function () {
                        var client = new TracingDocument();
                        client.load();
                    };
                    return TracingDocument;
                })(jtm.documentlibrary.BaseTracingDocument);
                holder.TracingDocument = TracingDocument;
            })(society.holder || (society.holder = {}));
            var holder = society.holder;
        })(jtm.society || (jtm.society = {}));
        var society = jtm.society;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.society.holder.TracingDocument.execute();