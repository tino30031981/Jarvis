(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (deposittype) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "dt";
                    }
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#ddlDepositType').val(item.depositType.id === null ? 0 : item.depositType.id);
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
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true                        
                        }, {
                            field: "stateName",
                            searchable: false,
                            sortable: true,
                            visible: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
                            depositType: { id: jQuery('#ddlDepositTypeSearch').int32() },
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
                            depositType: { id: jQuery('#ddlDepositType').int32() },
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
                            if (jQuery('#ddlDepositType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo yacimiento.';
                                jQuery('#ddlDepositType').focus();
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
                deposittype.Main = Main;
            })(miningproject.deposittype || (miningproject.deposittype = {}));
            var deposittype = miningproject.deposittype;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningproject.deposittype.Main.execute();