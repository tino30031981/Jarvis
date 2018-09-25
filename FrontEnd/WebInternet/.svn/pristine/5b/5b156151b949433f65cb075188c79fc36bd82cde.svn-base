(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Alert = (function (_super) {
                    __extends(Alert, _super);
                    function Alert() {
                        _super.call(this);
                        this.prefix = "al";
                        this.searchMembers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/alert/searchminingconcessions', {
                                    data: { id: 0 }
                                }, function (item) {
                                    thiss.fillMembers(item.miningConcessions, '#tblResultMembers', '#divTotalMembers');
                                });
                            } else
                                thiss.fillMembers(item.miningConcessions, '#tblResultMembers', '#divTotalMembers');
                        };
                        this.searchUsers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/alert/searchusers', {
                                    data: { id: 0 }
                                }, function (item) {
                                    thiss.fillUsers(item.users, '#tblResultUsers', '#divTotalUser');
                                });
                            } else
                                thiss.fillUsers(item.users, '#tblResultUsers', '#divTotalUser');
                        };
                    }
                    Alert.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        _super.prototype.search.call(this, com.jtm.Server.contextPath + "miningconcession/alert/search", options, callback);
                    };
                    Alert.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.miningconcessions = com.jtm.helper.Table.getItems("#tbdResultMembers", true, true);
                        if (data.miningconcessions.length <= 0) {
                            alert('Seleccione al menos una concession minera');
                            return;
                        }
                        return data;
                    };
                    Alert.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        options = options || {};
                        _super.prototype.detail.call(this, com.jtm.Server.contextPath + "miningconcession/alert/detail", id, null, function (data) {
                        });
                    };
                    Alert.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "miningconcession/alert/save", data, options);
                    };
                    Alert.execute = function () {
                        var client = new Alert();
                        client.load();
                    };
                    return Alert;
                })(jtm.BaseAlert);
                miningconcession.Alert = Alert;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.Alert.execute();