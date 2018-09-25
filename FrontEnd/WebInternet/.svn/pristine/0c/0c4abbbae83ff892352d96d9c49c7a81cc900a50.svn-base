(function (com) {
    (function (jtm) {
        (function (uea) {
            (function (uea) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "uea/folder/listfolder",
                            form: com.jtm.Server.contextPath + "uea/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "uea/tracing/save",
                            tracingdetail: com.jtm.Server.contextPath + "uea/tracing/detail",
                            delete: com.jtm.Server.contextPath + "uea/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "uea/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "uea/tracingdocument/searchtracingdocument",
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
                        data.ueaCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.uea = { id: thiss.$hdnId };
                        return data;
                    };
                    TracingDocument.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        options = options || {
                        };
                        _super.prototype.detail.call(this, thiss.urls.detal, id, null, function (data) {
                        });
                    };
                    TracingDocument.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "miningconcession/alert/save", data, options);
                    };
                    TracingDocument.execute = function () {
                        var client = new TracingDocument();
                        client.load();
                    };
                    return TracingDocument;
                })(jtm.documentlibrary.BaseTracingDocument);
                uea.TracingDocument = TracingDocument;
            })(uea.uea || (uea.uea = {}));
            var uea = uea.uea;
        })(jtm.uea || (jtm.uea = {}));
        var uea = jtm.uea;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.uea.uea.TracingDocument.execute();