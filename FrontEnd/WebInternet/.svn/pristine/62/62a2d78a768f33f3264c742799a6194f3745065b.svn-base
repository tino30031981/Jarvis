(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (environmentalpassive) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "environment/folder/listfolder",
                            form: com.jtm.Server.contextPath + "environment/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "environment/tracing/save",
                            tracingdetail: com.jtm.Server.contextPath + "environment/tracing/detail",
                            delete: com.jtm.Server.contextPath + "environment/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "environment/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "environment/tracingdocument/searchtracingdocument",
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
                        data.environmentCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.environmentalPassive = { id: thiss.$hdnId };
                        return data;
                    };
                    TracingDocument.prototype.detail = function (url, id, options) {
                        var thiss = this;
                    };
                    TracingDocument.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "environment/alert/save", data, options);
                    };
                    TracingDocument.execute = function () {
                        var client = new TracingDocument();
                        client.load();
                    };
                    return TracingDocument;
                })(jtm.documentlibrary.BaseTracingDocument);
                environmentalpassive.TracingDocument = TracingDocument;
            })(environment.environmentalpassive || (environment.environmentalpassive = {}));
            var environmentalpassive = environment.environmentalpassive;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.environmentalpassive.TracingDocument.execute();