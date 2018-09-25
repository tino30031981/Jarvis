(function (com) {
    (function (jtm) {
        var Layout = (function (_super) {
            __extends(Layout, _super);
            function Layout() {
                _super.call(this);
                this.prefix = "adm";
                this.loadMenu = function (url, $menu) {
                    var thiss = this;
                    thiss.$main.empty();
                    thiss.$form.empty();
                    thiss.loadView(thiss.$main, com.jtm.Server.contextPath + url, function () {
                        if ($menu !== undefined && $menu !== null) {
                            thiss.$title.text($menu.data("title"));
                            thiss.$subTitle.text($menu.data("subtitle"));
                            thiss.$main.attr('data-title', $menu.data('title'));
                            thiss.$main.attr('data-subtitle', $menu.data('subtitle'));
                        }
                        jQuery('a.' + Layout.OPENASYNC).off("click");
                        jQuery('a.' + Layout.OPENASYNC).on("click", function (e) {
                            e.preventDefault();
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$main.attr('data-title', jQuery(this).data('title'));
                            thiss.$main.attr('data-subtitle', jQuery(this).data('subtitle'));
                            if (jQuery(this).hasClass(Layout.TOGGLE)) {
                                if (String.isNullOrWhiteSpace(window.sessionStorage.getItem(Layout.USERSESSIONNAME))===false) {
                                    window.plugins.toast.showLongCenter("Ya se ha identificado");
                                    return false;
                                }
                            }
                            var url = jQuery(this).attr("href");
                            thiss.loadMenu(url, jQuery(this));
                        });
                    });
                };
                this.eventHandlers = function () {
                    document.addEventListener("backbutton", function () {
                        confirm("Desea salir de la aplicación", function (buttonId) {
                            if (buttonId === 1)
                                if (typeof (navigator.app) !== "undefined")
                                    navigator.app.exitApp();
                        }, Layout.TITLE, ["Aceptar", "Cancelar"]);
                        //if (typeof (navigator.app) !== "undefined")
                        //    navigator.app.backHistory();
                        //history.go(-1);
                    }, false);
                };
                this.writeUser = function () {
                    var thiss = this;
                    var item = window.sessionStorage.getItem(Layout.USERSESSIONNAME);
                    if (String.isNullOrWhiteSpace(item)===true) return;
                    item = JSON.parse(item);
                    thiss.$user.text("Usuario: " + item.fullName);
                    thiss.$footer.find('>span:first').hide();
                    thiss.$footer.find('>span:last').show();
                };
                this.writeWarning = function () {
                    window.plugins.toast.showWithOptions(
                        {
                            message: this.config.warning,
                            duration: "15000",
                            position: "bottom"
                        });
                };
            }
            Layout.prototype.formConfig = function () {

            };
            Layout.prototype.buttonConfig = function () {

            };
            Layout.prototype.attachmentConfig = function () {

            };
            Layout.prototype.uiConfig = function () {
            };
            Layout.prototype.initConfig = function () {
                var thiss = this;
                thiss.loadMenu(com.jtm.Server.contextPath + "areas/admin/menu/main.html");
                thiss.eventHandlers();
                thiss.writeUser();
                thiss.writeWarning();
            };
            Layout.execute = function () {
                var client = new Layout();
                client.load();
            };
            return Layout;
        })(jtm.Master);
        jtm.Layout = Layout;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.Layout.execute();