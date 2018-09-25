function getInstance() {
    return com.jtm.surfaceproperty.surfaceright.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (surfaceproperty) {
            (function (surfaceright) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "surfaceproperty/folder/listfolder",
                            form: com.jtm.Server.contextPath + "surfaceproperty/tracing/form",
                            save: com.jtm.Server.contextPath + "surfaceproperty/tracing/save",
                            detail: com.jtm.Server.contextPath + "surfaceproperty/tracing/detail",
                            delete: com.jtm.Server.contextPath + "surfaceproperty/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "surfaceproperty/tracing/searchbyfolder",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                    }
                    Tracing.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.surfaceRight = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                surfaceright.Tracing = Tracing;
            })(surfaceproperty.surfaceright || (surfaceproperty.surfaceright = {}));
            var surfaceright = surfaceproperty.surfaceright;
        })(jtm.surfaceproperty || (jtm.surfaceproperty = {}));
        var surfaceproperty = jtm.surfaceproperty;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));