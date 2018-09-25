var com;
(function (com) {
    (function (jtm) {
        (function (society) {
            (function (holderregime) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "soc";
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
                            jQuery('#txtTariffValidity').val(item.tariffValidity);
                            jQuery('#txtTariffSanction').val(item.tariffSanction);
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
                            visible: true,
                            switchable: false
                        }, {
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "tariffValidity",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "tariffSanction",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "stateName",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
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
                            tariffValidity: jQuery('#txtTariffValidity').double(),
                            tariffSanction: jQuery('#txtTariffSanction').double(),
                            state: jQuery('#chkState').boolean(),
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
                            if (jQuery('#txtTariffValidity').string() === '') {
                                success = false;
                                message = 'Ingrese la Tarifa de Vigencia.';
                                jQuery('#txtTariffValidity').focus();
                            }
                            if (jQuery('#txtTariffSanction').string() === '') {
                                success = false;
                                message = 'Ingrese la Tarifa de Penalidad.';
                                jQuery('#txTtariffSanction').focus();
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
                holderregime.Main = Main;
            })(society.holderregime || (society.holderregime = {}));
            var holderregime = society.holderregime;
        })(jtm.society || (jtm.society = {}));
        var society = jtm.society;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.society.holderregime.Main.execute();