(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var Alert = (function (_super) {
                    __extends(Alert, _super);
                    function Alert() {
                        _super.call(this);
                        this.prefix = "al";
                        this.searchMembers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/alert/searchminingprojects', {
                                    data: { id: 0 }
                                }, function (item) {
                                    thiss.fillMembers(item.miningProjects, '#tblResultMembers', '#divTotalMembers');
                                });
                            }
                            else
                                thiss.fillMembers(item.miningProjects, '#tblResultMembers', '#divTotalMembers');
                        };
                        this.searchUsers = function (item) {
                            var thiss = this;
                            if (item === null) {
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/alert/searchusers', {
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
                        _super.prototype.search.call(this, com.jtm.Server.contextPath + "miningproject/alert/search", options, callback);
                    };
                    Alert.prototype.parametersSave = function () {
                        var thiss = this;
                        var data = _super.prototype.parametersSave.call(this);
                        data.miningProjects = com.jtm.helper.Table.getItems("#tbdResultMembers", true, true);
                        if (data.miningProjects.length <= 0) {
                            alert('Seleccione al menos una UEA');
                            return;
                        }
                        return data;
                    };
                    Alert.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        options = options || {};
                        _super.prototype.detail.call(this, com.jtm.Server.contextPath + "miningproject/alert/detail", id, null, function (data) {
                        });
                    };
                    Alert.prototype.save = function (url, data, options) {
                        var thiss = this;
                        _super.prototype.save.call(this, com.jtm.Server.contextPath + "miningproject/alert/save", data, options);
                    };
                    Alert.execute = function () {
                        var client = new Alert();
                        client.load();
                    };
                    return Alert;
                })(jtm.BaseAlert);
                miningproject.Alert = Alert;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningproject.miningproject.Alert.execute();