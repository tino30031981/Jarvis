function getInstance() {
    return new com.jtm.environment.legalframe.Procedure.execute();
}
(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (legalframe) {
                var Procedure = (function (_super) {
                    __extends(Procedure, _super);
                    function Procedure() {
                        _super.call(this);
                        this.urls = {
                            detailModule: com.jtm.Server.contextPath + 'environment/legalframe/detail',
                            form: com.jtm.Server.contextPath + "environment/procedure/form",
                            list: com.jtm.Server.contextPath + 'environment/procedure/list',
                            searchByModule: com.jtm.Server.contextPath + 'environment/legalframe/searchprocedures',
                            save: com.jtm.Server.contextPath + "environment/legalframe/saveprocedure",                            
                            detail: com.jtm.Server.contextPath + 'environment/procedure/detail',
                            searchRequirement: com.jtm.Server.contextPath + 'environment/requirement/searchbyprocedure',
                            detailRequirement: com.jtm.Server.contextPath + 'environment/requirement/detail',
                            saveRequirement: com.jtm.Server.contextPath + 'environment/legalframe/saverequirement'
                        };
                    }
                    Procedure.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.legalframe = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.prototype.parametersSaveRequirement = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSaveRequirement.call(this);
                        data.legalframe = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.execute = function () {
                        return new Procedure();
                    };
                    return Procedure;
                })(jtm.general.BaseProcedure);
                legalframe.Procedure = Procedure;
            })(environment.legalframe || (environment.legalframe = {}));
            var legalframe = environment.legalframe;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));