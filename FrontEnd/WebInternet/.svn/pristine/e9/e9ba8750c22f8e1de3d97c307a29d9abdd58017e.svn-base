function getInstance() {
    return com.jtm.miningproject.Procedure.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningproject) {
            var Procedure = (function (_super) {
                __extends(Procedure, _super);
                function Procedure() {
                    _super.call(this);
                    this.urls = {
                        detailModule: com.jtm.Server.contextPath + 'miningproject/miningproject/detail',
                        form: com.jtm.Server.contextPath + "miningconcession/procedure/form",
                        list: com.jtm.Server.contextPath + 'miningproject/procedure/list',
                        searchByModule: com.jtm.Server.contextPath + 'miningproject/miningproject/searchprocedures',
                        save: com.jtm.Server.contextPath + "miningproject/miningproject/saveprocedure",
                        detail: com.jtm.Server.contextPath + 'miningproject/procedure/detail',
                        searchRequirement: com.jtm.Server.contextPath + 'miningproject/requirement/searchbyprocedure',
                        detailRequirement: com.jtm.Server.contextPath + 'miningproject/requirement/detail',
                        saveRequirement: com.jtm.Server.contextPath + "miningproject/miningproject/saverequirement"
                    };
                }
                Procedure.prototype.parametersSave = function () {
                    var thiss = this;
                    var data = _super.prototype.parametersSave.call(this);
                    data.miningProject = { id: thiss.$hdnId.int32() };
                    return data;
                };
                Procedure.prototype.parametersSaveRequirement = function () {
                    var thiss = this;
                    var data = _super.prototype.parametersSaveRequirement.call(this);
                    data.miningProject = { id: thiss.$hdnId.int32() };
                    return data;
                };
                Procedure.execute = function () {
                    return new Procedure();
                };
                return Procedure;
            })(jtm.general.BaseProcedure);
            miningproject.Procedure = Procedure;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));