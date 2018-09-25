(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (relationship) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        //this.formActivity = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '80%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formactivity", function () {
                        //    });
                        //};
                        //this.formLegalEvaluation = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '70%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formlegalevaluation", function () {
                        //    });
                        //};
                        //this.formCoordination = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '60%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formcoordination", function () {
                        //    });
                        //};
                        //this.formCommissionCompany = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '60%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formcommissioncompany", function () {
                        //    });
                        //};
                        //this.formRelevantActor = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '60%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formrelevantactor", function () {
                        //    });
                        //};
                        //this.formCommissionNegotiator = function (id, title) {
                        //    var thiss = this;
                        //    thiss.$divPopup.dialog({
                        //        title: title,
                        //        width: '60%',
                        //        resizable: false,
                        //        modal: true,
                        //        closeOnEscape: true,
                        //        autoempty: true,
                        //        close: function (dialog) {
                        //        }
                        //    });
                        //    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/relationship/formcommissionnegotiator", function () {
                        //    });
                        //};
                    }
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$btnAddActivity = thiss.$form.find('#btnAddActivity');
                            thiss.$btnEditActivity = thiss.$form.find('#btnEditActivity');
                            thiss.$btnQuitActivities = thiss.$form.find('#btnQuitActivities');
                            thiss.$btnAddLegalEvaluation = thiss.$form.find('#btnAddLegalEvaluation');
                            thiss.$btnEditLegalEvaluation = thiss.$form.find('#btnEditLegalEvaluation');
                            thiss.$btnQuitLegalEvaluations = thiss.$form.find('#btnQuitLegalEvaluations');
                            thiss.$btnAddCoordination = thiss.$form.find('#btnAddCoordination');
                            thiss.$btnAddCommissionCompany = thiss.$form.find('#btnAddCommissionCompany');
                            thiss.$btnAddRelevantActor = thiss.$form.find('#btnAddRelevantActor');
                            thiss.$btnAddCommissionNegotiator = thiss.$form.find('#btnAddCommissionNegotiator');
                            thiss.$btnAddActivity.off("click");
                            thiss.$btnAddActivity.on("click", function (e) {
                                thiss.formActivity(0, "Añadir Actividades");
                            });
                            thiss.$btnQuitActivities.off("click");
                            thiss.$btnQuitActivities.on("click", function (e) {
                                //thiss.deleteMembers();
                            });
                            
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/relationship/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/relationship/searchdocuments",
                                $hdnId: thiss.$hdnId
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };

                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            //name: thiss.$txtNameSearch.val(),
                            //startDate: thiss.$txtStartDateSearch.date(),
                            //startDateEnd: thiss.$txtStartDateEndSearch.date(),
                            //endDate: thiss.$txtEndDateSearch.date(),
                            //endDateEnd: thiss.$txtEndDateEndSearch.date(),
                            //entity: { id: thiss.$ddlEntitySearch.int32() },
                            //levelInfluence: { id: thiss.$ddlLevelInfluenceSearch.int32() },
                            //registryOffice: { id: thiss.$ddlRegistryOfficeSearch.int32() },
                            //state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                relationship.Main = Main;
            })(socialresponsability.relationship || (socialresponsability.relationship = {}));
            var relationship = socialresponsability.relationship;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.relationship.Main.execute();