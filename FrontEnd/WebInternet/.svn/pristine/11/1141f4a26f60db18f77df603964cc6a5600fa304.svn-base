(function (com) {
    (function (jtm) {
        (function (surfaceproperty) {
            (function (surfaceright) {
                var TracingDocument = (function (_super) {
                    __extends(TracingDocument, _super);
                    function TracingDocument() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "surfaceproperty/folder/listfolder",
                            form: com.jtm.Server.contextPath + "surfaceproperty/tracing/form",
                            tracingsave: com.jtm.Server.contextPath + "surfaceproperty/tracing/save",
                            tracingdetail: com.jtm.Server.contextPath + "surfaceproperty/tracing/detail",
                            delete: com.jtm.Server.contextPath + "surfaceproperty/tracing/delete",
                            downloadtracingdocument: com.jtm.Server.contextPath + "surfaceproperty/tracingdocument/formdownload",
                            searchtracingdocument: com.jtm.Server.contextPath + "surfaceproperty/tracingdocument/searchtracingdocument",
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
                        data.surfaceRightCodeName = thiss.$txtCodeNameSearch.val();
                        return data;
                    };
                    TracingDocument.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.surfaceright = { id: thiss.$hdnId };
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
                surfaceright.TracingDocument = TracingDocument;
            })(surfaceproperty.surfaceright || (surfaceproperty.surfaceright = {}));
            var surfaceright = surfaceproperty.surfaceright;
        })(jtm.surfaceproperty || (jtm.surfaceproperty = {}));
        var surfaceproperty = jtm.surfaceproperty;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.surfaceproperty.surfaceright.TracingDocument.execute();