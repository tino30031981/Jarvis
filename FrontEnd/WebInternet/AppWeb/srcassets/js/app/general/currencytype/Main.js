(function (com) {
    (function (jtm) {
        (function (general) {
            (function (currencytype) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "ct";
                    }

                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtSymbol').val(item.slug);
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
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true
                        }, {
                            field: "symbol",
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
                            symbol: jQuery('#txtSymbolSearch').string(),
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
                            symbol: jQuery('#txtSymbol').string(),
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
                            if (jQuery('#txtSymbol').string() === '') {
                                success = false;
                                message = 'Ingrese el Símbolo.';
                                jQuery('#txtSymbol').focus();
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
                currencytype.Main = Main;
            })(general.currencytype || (general.currencytype = {}));
            var currencytype = general.currencytype;
        })(jtm.general || (jtm.general = {}));
        var general = jtm.general;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.general.currencytype.Main.execute();