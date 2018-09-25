function getInstance() {
    return com.jtm.miningconcession.miningconcession.Procedure.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Procedure = (function (_super) {
                    __extends(Procedure, _super);
                    function Procedure() {
                        _super.call(this);
                        this.urls = {
                            detailModule: com.jtm.Server.contextPath + 'miningconcession/miningconcession/detail',
                            form: com.jtm.Server.contextPath + "miningconcession/procedure/form",
                            list: com.jtm.Server.contextPath + 'miningconcession/procedure/list',
                            searchByModule: com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchprocedures',
                            save: com.jtm.Server.contextPath + "miningconcession/miningconcession/saveprocedure",
                            detail: com.jtm.Server.contextPath + 'miningconcession/procedure/detail',
                            searchRequirement: com.jtm.Server.contextPath + 'miningconcession/requirement/searchbyprocedure',
                            detailRequirement: com.jtm.Server.contextPath + 'miningconcession/requirement/detail',
                            saveRequirement: com.jtm.Server.contextPath + "miningconcession/miningconcession/saverequirement"
                        };
                    }
                    Procedure.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);                        
                        data.miningConcession = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.prototype.parametersSaveRequirement = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSaveRequirement.call(this);                        
                        data.miningConcession = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.execute = function () {
                        return new Procedure();
                    };
                    return Procedure;
                })(jtm.general.BaseProcedure);
                miningconcession.Procedure = Procedure;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));