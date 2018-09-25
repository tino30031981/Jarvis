(function (com) {
    (function (jtm) {
        (function (uea) {
            (function (uea) {
                var Alert = (function (_super) {
                    __extends(Alert, _super);
                    function Alert() {
                        _super.call(this);
                        this.prefix = "al";
                        this.searchMembers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'uea/alert/searchueas', {
                                    data: { id: 0 }
                                }, function (item) {
                                    thiss.fillMembers(item.ueAs, '#tblResultMembers', '#divTotalMembers');
                                });
                            }
                            else
                                thiss.fillMembers(item.ueAs, '#tblResultMembers', '#divTotalMembers');
                        };
                        this.searchUsers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'uea/alert/searchusers', {
                                    data: { id: 0 }
                                }, function (item) {
                                    thiss.fillUsers(item.users, '#tblResultUsers', '#divTotalUser');
                                });
                            }
                            else
                                thiss.fillUsers(item.users, '#tblResultUsers', '#divTotalUser');
                        };
                    }
                    Alert.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        _super.prototype.search.call(this, com.jtm.Server.contextPath + "uea/alert/search", options, callback);
                    };
                    Alert.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.ueas = com.jtm.helper.Table.getItems("#tbdResultMembers", true, true);
                        if (data.ueas.length <= 0) {
                            alert('Seleccione al menos una UEA');
                            return;
                        }
                        return data;
                    };
                    Alert.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        options = options || {};
                        _super.prototype.detail.call(this, com.jtm.Server.contextPath + "uea/alert/detail", id, null, function (data) {
                        });
                    };
                    Alert.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "uea/alert/save", data, options);
                    };
                    Alert.execute = function () {
                        var client = new Alert();
                        client.load();
                    };
                    return Alert;
                })(jtm.BaseAlert);
                uea.Alert = Alert;
            })(uea.uea || (uea.uea = {}));
            var uea = uea.uea;
        })(jtm.uea || (jtm.uea = {}));
        var uea = jtm.uea;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.uea.uea.Alert.execute();