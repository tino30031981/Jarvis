(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "miningconcession/folder/listfolder",
                            form: com.jtm.Server.contextPath + "miningconcession/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "miningconcession/tracing/save",
                            tracingdetail: com.jtm.Server.contextPath + "miningconcession/tracing/detail",
                            delete: com.jtm.Server.contextPath + "miningconcession/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "miningconcession/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "miningconcession/tracingdocument/searchtracingdocument",
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
                        data.miningConcessionCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.miningconcession = { id: thiss.$hdnId };
                        return data;
                    };
                    TracingDocument.prototype.detail = function (url, id, options) {
                        var thiss = this;
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
                miningconcession.TracingDocument = TracingDocument;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.TracingDocument.execute();