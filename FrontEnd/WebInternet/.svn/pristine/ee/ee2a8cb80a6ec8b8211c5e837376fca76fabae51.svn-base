(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "miningproject/folder/searchbyminingproject",
                            form: com.jtm.Server.contextPath + "miningproject/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "miningproject/tracing/save2",
                            tracingdetail: com.jtm.Server.contextPath + "miningproject/tracing/detail",
                            delete: com.jtm.Server.contextPath + "miningproject/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "miningproject/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "miningproject/tracingdocument/searchtracingdocument",
                            searchByFolder: com.jtm.Server.contextPath + "miningproject/tracing/searchbyfolder",
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
                        data.miningProjectCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.miningProject = { id: thiss.$hdnId };
                        return data;
                    };
                    TracingDocument.prototype.detail = function (url, id, options) {
                        var thiss = this;
                    };
                    TracingDocument.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "miningproject/alert/save", data, options);
                    };
                    TracingDocument.execute = function () {
                        var client = new TracingDocument();
                        client.load();
                    };
                    return TracingDocument;
                })(jtm.documentlibrary.BaseTracingDocument);
                miningproject.TracingDocument = TracingDocument;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningproject.miningproject.TracingDocument.execute();