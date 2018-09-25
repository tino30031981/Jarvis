(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (interestgrouptype) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                    }
                    //Main.DDLINTERESTGROUPSEARCH = "#ddlInterestGroupTypeSearch";
                    Main.DDLPERSONTYPESEARCH = "#ddlPersonTypeSearch";
                    //Main.DDLINTERESTGROUP = "#ddlInterestGroupType";
                    Main.DDLPERSONTYPE = "#ddlPersonType";
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        //thiss.$ddlInterestGroupTypeSearch = thiss.$main.find(Main.DDLINTERESTGROUPSEARCH);
                        thiss.$ddlPersonTypeSearch = thiss.$main.find(Main.DDLPERSONTYPESEARCH);                     
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            //thiss.$ddlInterestGroupType = thiss.$form.find(Main.DDLINTERESTGROUP);
                            thiss.$ddlPersonType = thiss.$form.find(Main.DDLPERSONTYPE);
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txtName.val(item.name);
                            thiss.$txaDescription.val(item.description);
                            //thiss.$ddlInterestGroupType.val(item.interestGroupType.id === null ? 0 : item.interestGroupType.id);
                            thiss.$ddlPersonType.val(item.personType.id === null ? 0 : item.personType.id);
                            thiss.$chkState.prop("checked", item.state);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        //}, {
                        //    field: "interestGroupType.name",
                        //    searchable: false,
                        //    sortable: true,
                        //    visible: true,
                        //    switchable: false
                        }, {
                            field: "personType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "stateName",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.val(),
                            description: thiss.$txaDescription.val(),
                            interestGroupType: { id: 0 },
                            personType: { id: thiss.$ddlPersonType.int32() },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtName.val() === '') {
                                success = false;
                                message = 'Ingrese nombre.';
                                thiss.$txtName.focus();
                            } else if (thiss.$ddlPersonType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo persona.';
                                thiss.$ddlPersonType.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            name: thiss.$txtNameSearch.val(),
                            //interestGroupType: { id: thiss.$ddlInterestGroupTypeSearch.int32() },
                            personType: { id: thiss.$ddlPersonTypeSearch.int32() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                interestgrouptype.Main = Main;
            })(socialresponsability.interestgrouptype || (socialresponsability.interestgrouptype = {}));
            var interestgrouptype = socialresponsability.interestgrouptype;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.interestgrouptype.Main.execute();