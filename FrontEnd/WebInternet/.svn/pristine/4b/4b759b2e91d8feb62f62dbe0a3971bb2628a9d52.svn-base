(function (com) {
    (function (jtm) {
        (function (admin) {
            (function (menu) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$menuList = null;
                        this.$menuListAdmin = null;
                        this.$menuBody = null;
                        this.writeOnListAdmin = function () {
                            var thiss = this;
                            this.config.module.itemsAdmin = [];
                            if (thiss.config.module.itemsAdmin instanceof Array) {
                                thiss.$menuListAdmin.empty();
                                var $liLogin = $('<li><a href="areas/admin/user/login.html" class="' + Main.OPENASYNC + ' ' + Main.TOGGLE + '">Ingresar</a></li>');
                                $liLogin.attr("data-title", "Usuario").attr("data-subtitle", "Identificarse");
                                thiss.$menuListAdmin.append($liLogin);
                                thiss.config.module.itemsAdmin.forEach(function (item) {
                                    var $li = $('<li></li>');
                                    thiss.$menuListAdmin.append($li);
                                    $li.append('<a href="' + item.url + '" class="' + Main.OPENASYNC + '">' + item.name + '</a>');
                                });
                                var $liLogout = $('<li><a>Cerrar Sesión</a></li>');
                                $liLogout.on("click", function (e) {
                                    e.preventDefault();
                                    window.plugins.deviceFeedback.acoustic();
                                    if (String.isNullOrWhiteSpace(window.sessionStorage.getItem(Main.USERSESSIONNAME)) === false) {
                                        window.sessionStorage.removeItem(Main.USERSESSIONNAME);
                                        thiss.$footer.find('>span:first').show();
                                        thiss.$footer.find('>span:last').empty().hide();
                                        window.plugins.toast.showLongBottom("Se ha cerrado su sesión");
                                    }
                                    else
                                        window.plugins.toast.showLongBottom("Aún no se ha identificado");
                                });
                                thiss.$menuListAdmin.append($liLogout);
                            }
                        };
                        this.writeOnList = function () {
                            var thiss = this;
                            if (thiss.config.module.items instanceof Array) {
                                thiss.$menuList.empty();
                                thiss.config.module.items.forEach(function (item) {
                                    if (item.disabled !== true) {
                                        item.title = (String.isNullOrWhiteSpace(item.title) === true ? thiss.config.title : item.title);
                                        item.subtitle = (String.isNullOrWhiteSpace(item.subtitle) === true ? thiss.config.subtitle : item.subtitle);
                                        var $li = $('<li></li>');
                                        thiss.$menuList.append($li);
                                        $li.append('<a href="' + item.url + '" class="' + Main.OPENASYNC + '">' + item.name.replace('<br>', '') + '</a>');
                                        $li.find(">a").attr("data-title", item.title).attr("data-subtitle", item.subtitle);
                                    }
                                });
                            }
                        };
                        this.writeOnBody = function () {
                            var thiss = this;
                            if (thiss.config.module.items instanceof Array) {
                                thiss.$menuBody.css("margin-top", 30);
                                thiss.$menuBody.empty();
                                thiss.config.module.items.forEach(function (item) {
                                    if (item.disabled !== true) {
                                        if (item.both === true) {
                                            item.title = (String.isNullOrWhiteSpace(item.title) === true ? thiss.config.title : item.title);
                                            item.subtitle = (String.isNullOrWhiteSpace(item.subtitle) === true ? thiss.config.subtitle : item.subtitle);
                                            var $column = $('<a></a>');
                                            thiss.$menuBody.append($column);
                                            $column.addClass("col-xs-6").addClass("col-sm-6").addClass("col-md-6");
                                            $column.attr("href", item.url).attr("data-title", item.title).attr("data-subtitle", item.subtitle);
                                            $column.addClass("jca-col-full");
                                            $column.addClass(Main.OPENASYNC);
                                            var $thumbnail = $('<div></div>');
                                            $column.append($thumbnail);
                                            $thumbnail.addClass("text-center").addClass("gh-jumbotron").addClass("jca-format-button");
                                            var $label = $('<label></label>');
                                            $thumbnail.append($label);
                                            var $span = $('<span></span>');
                                            $label.append($span);
                                            $span.addClass("jca-" + item.icon).addClass("jca-color-icon").addClass("jca-menu-icon-body");
                                            var $thumbnail2 = $('<div></div>');
                                            $thumbnail2.addClass("text-center").addClass("jca-padding-span-text");
                                            $column.append($thumbnail2);
                                            var $spanText = $('<span></span>');
                                            $spanText.html(item.name);
                                            $spanText.addClass("jca-color-span-text");
                                            $thumbnail2.append($spanText);
                                        }
                                    }
                                });
                            }
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        this.viewConfig();
                        this.writeOnListAdmin();
                        this.writeOnList();
                        this.writeOnBody();
                    };
                    Main.prototype.uiConfig = function () {
                    };
                    Main.prototype.buttonConfig = function () {
                    };
                    Main.prototype.viewConfig = function () {
                        this.$menuList = this.$header.find('#ulMenu');
                        this.$menuListAdmin = this.$header.find('#ulMenuAdmin');
                        this.$menuBody = this.$main.find('#divMenu');
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "menu", { module: "admin", subModule: "menu" });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                menu.Main = Main;
            })(admin.menu || (admin.menu = {}));
            var menu = admin.menu;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.menu.Main.execute();