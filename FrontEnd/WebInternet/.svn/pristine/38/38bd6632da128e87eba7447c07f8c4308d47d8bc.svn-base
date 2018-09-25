var com;
(function (com) {
    (function (jtm) {
        (function (general) {
            (function (mineral) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mn";
                    }

                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#ddlMineralType').val(item.mineralType.id);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#chkState').prop("checked", item.state);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true
                        }, {
                            field: "mineralType.name",
                            searchable: false,
                            sortable: true,
                            visible: true
                        }, {
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true,
                        }, {
                            field: "stateName",
                            searchable: false,
                            sortable: true,
                            visible: true,
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
                            mineralType: { id: jQuery('#ddlMineralTypeSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            name: jQuery('#txtName').string(),
                            mineralType: { id: jQuery('#ddlMineralType').int32() },
                            description: jQuery('#txaDescription').string(),
                            state: jQuery('#chkState').boolean()
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
                            if (jQuery('#ddlMineralType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de Main.';
                                jQuery('#ddlMineralType').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                mineral.Main = Main;
            })(general.mineral || (general.mineral = {}));
            var mineral = general.mineral;
        })(jtm.general || (jtm.general = {}));
        var general = jtm.general;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.general.mineral.Main.execute();