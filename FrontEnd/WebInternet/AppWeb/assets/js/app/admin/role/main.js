(function (com) {
    (function (jtm) {
        (function (admin) {
            (function (role) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "adm";
                    }

                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            jQuery('#ulMenu').tree({
                                initialState: "collapse"
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#chkState').prop("checked", item.state);
                            var i = 0;
                            for (i = 0; i < item.menus.length; i++) {
                                $('#ulMenu input[id="chkMenu' + item.menus[i].id + '"]').attr("checked", true);
                                var permissions = $('#ulMenu input[id="chkMenu' + item.menus[i].id + '"]').closest("li").find(" > #iPermissions");
                                jQuery.each(jQuery(permissions).find(":checkbox"), function (j, item2) {
                                    jQuery(this).attr("checked", item.menus[i].permissions[j].state);
                                });
                            }
                        });
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            state: jQuery('#chkState').boolean(),
                            menus: getMenus()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            }
                            if (getMenus().length === 0) {
                                success = false;
                                message = 'Seleccione los menú para el rol';
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                        function getMenus() {
                            var lis = jQuery('#ulMenu > li');
                            var items = [];
                            fill(items, lis, 0);
                            return items;
                            function fill(items, lis, level, chkPermissions) {
                                var i = 0;
                                for (i = 0; i < lis.length; i++) {
                                    var chkMenu = jQuery(lis[i]).find(" > :checkbox");
                                    if (chkPermissions === undefined || chkPermissions === null)
                                        chkPermissions = jQuery(lis[i]).find("#iPermissions :checkbox");
                                    var itemsPermission = [];
                                    var j = 0;
                                    for (j = 0; j < chkPermissions.length; j++) {
                                        if (jQuery(chkPermissions[j]).is(":checked") === true)
                                            itemsPermission.push({ id: jQuery(chkPermissions[j]).val() });
                                    }
                                    if (jQuery(chkMenu[0]).is(":checked") === true) 
                                        items.push({ id: jQuery(chkMenu[0]).val(), permissions: itemsPermission });
                                    var lis2 = jQuery(lis[i]).find(">ul>li");
                                    if (jQuery(chkMenu[0]).is(":checked") === true && lis2.length > 0) {
                                        fill(items, lis2, 1, chkPermissions);
                                    }
                                    if (level === 0)
                                        chkPermissions = null;
                                }
                            }
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                role.Main = Main;
            })(admin.role || (admin.role = {}));
            var role = admin.role;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.role.Main.execute();