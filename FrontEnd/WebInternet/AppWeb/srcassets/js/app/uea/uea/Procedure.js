function getInstance() {
    return com.jtm.uea.Procedure.execute();
}
(function (com) {
    (function (jtm) {
        (function (uea) {
            var Procedure = (function (_super) {
                __extends(Procedure, _super);
                function Procedure() {
                    _super.call(this);
                    this.urls = {
                        detailModule: com.jtm.Server.contextPath + 'uea/uea/detail',
                        form: com.jtm.Server.contextPath + "uea/procedure/form",
                        list: com.jtm.Server.contextPath + 'uea/procedure/list',
                        searchByModule: com.jtm.Server.contextPath + 'uea/uea/searchprocedures',
                        save: com.jtm.Server.contextPath + "uea/uea/saveprocedure",
                        detail: com.jtm.Server.contextPath + 'uea/procedure/detail',
                        searchRequirement: com.jtm.Server.contextPath + 'uea/requirement/searchbyprocedure',
                        detailRequirement: com.jtm.Server.contextPath + 'uea/requirement/detail',
                        saveRequirement: com.jtm.Server.contextPath + "uea/uea/saverequirement"
                    };
                }

                Procedure.prototype.parametersSave = function () {
                    var thiss = this;
                    var data = _super.prototype.parametersSave.call(this);
                    data.uea = { id: thiss.$hdnId.int32() };
                    return data;
                };
                Procedure.prototype.parametersSaveRequirement = function () {
                    var thiss = this;
                    var data = _super.prototype.parametersSaveRequirement.call(this);
                    data.uea = { id: thiss.$hdnId.int32() };
                    return data;
                };
                Procedure.execute = function () {
                    return new Procedure();
                };
                return Procedure;
            })(jtm.general.BaseProcedure);
            uea.Procedure = Procedure;
        })(jtm.uea || (jtm.uea = {}));
        var uea = jtm.uea;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));