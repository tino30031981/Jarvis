(function (com) {
    (function (jtm) {
        (function (admin) {
            var Login = (function (_super) {
                __extends(Login, _super);
                function Login() {
                    _super.call(this);
                    this.prefix = "adm";
                    this.$btnLogin = null;
                    this.$txtMainName = null;
                    this.$pwdPassword = null;
                    this.validate = function () {
                        var thiss = this;
                        var userName = this.$txtUserName.string();
                        var password = this.$pwdPassword.string();
                        $.post(thiss.config.restServer + "user/loginajax", { userName: userName, password: password }, function (data) {
                            if (data.success === true) {
                                window.sessionStorage.setItem(Login.USERSESSIONNAME, JSON.stringify(data.item));
                                window.plugins.toast.showLongBottom("Se ha identificado correctamente");
                                window.location.href = com.jtm.Server.contextPath + Login.DEFAULTPAGE;
                                //jQuery('#jcaBody').empty();
                                //thiss.loadView('#jcaBody', com.jtm.Server.contextPath + thiss.defaultPage, function () {
                                //    console.log('menu');
                                //});
                            }
                            else {
                                window.plugins.toast.showLongBottom(data.message);
                            }
                        }, "json");
                    };

                }
                Login.DEFAULTPAGE = "layout.html";
                Login.prototype.initConfig = function () {

                };
                Login.prototype.attachmentConfig = function () {
                };
                Login.prototype.formConfig = function () {
                };
                Login.prototype.domConfig = function () {
                    this.$txtUserName = this.$main.find('#txtUserName');
                    this.$pwdPassword = this.$main.find('#pwdPassword');
                    this.$btnLogin = this.$main.find('#btnLogin');
                };
                Login.prototype.viewConfig = function () {

                };
                Login.prototype.uiConfig = function () {

                };
                Login.prototype.buttonConfig = function () {
                    var thiss = this;
                    this.$btnLogin.off("click");
                    this.$btnLogin.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.validate();
                    });
                };
                Login.execute = function () {
                    var thiss = this;
                    if (String.isNullOrWhiteSpace(window.sessionStorage.getItem(Login.USERSESSIONNAME))===false) {
                        window.location.href = com.jtm.Server.contextPath + Login.DEFAULTPAGE;
                    }
                    var client = new Login();
                    client.load();
                };

                return Login;
            })(jtm.Master);
            admin.Login = Login;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.Login.execute();