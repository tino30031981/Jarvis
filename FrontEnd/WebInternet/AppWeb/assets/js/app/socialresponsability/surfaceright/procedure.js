function getInstance() {
    return com.jtm.surfaceproperty.surfaceright.Procedure.execute();
}
(function (com) {
    (function (jtm) {
        (function (surfaceproperty) {
            (function (surfaceright) {
                var Procedure = (function (_super) {
                    __extends(Procedure, _super);
                    function Procedure() {
                        _super.call(this);
                        this.urls = {
                            detailModule: com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/detail',
                            form: com.jtm.Server.contextPath + "surfaceproperty/procedure/form",
                            list: com.jtm.Server.contextPath + 'surfaceproperty/procedure/list',
                            searchByModule: com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/searchprocedures',
                            save: com.jtm.Server.contextPath + "surfaceproperty/surfaceright/saveprocedure",
                            detail: com.jtm.Server.contextPath + 'surfaceproperty/procedure/detail',
                            searchRequirement: com.jtm.Server.contextPath + 'surfaceproperty/requirement/searchbyprocedure',
                            detailRequirement: com.jtm.Server.contextPath + 'surfaceproperty/requirement/detail',
                            saveRequirement: com.jtm.Server.contextPath + "surfaceproperty/surfaceright/saverequirement"
                        };
                    }
                    Procedure.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.surfaceRight = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.prototype.parametersSaveRequirement = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSaveRequirement.call(this);
                        data.surfaceRight = { id: thiss.$hdnId.int32() };
                        return data;
                    };
                    Procedure.execute = function () {
                        return new Procedure();
                    };
                    return Procedure;
                })(jtm.general.BaseProcedure);
                surfaceright.Procedure = Procedure;
            })(surfaceproperty.surfaceright || (surfaceproperty.surfaceright = {}));
            var surfaceright = surfaceproperty.surfaceright;
        })(jtm.surfaceproperty || (jtm.surfaceproperty = {}));
        var surfaceproperty = jtm.surfaceproperty;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));