(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (equipment) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "eqp";
                    }
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            jQuery('#txtPrecision').numeric({ negative: false, decimalPlaces: 2 });
                            jQuery("#btnOpenFile").off("click")
                            jQuery("#btnOpenFile").on("click", function (e) {
                                jQuery("#filFile").trigger("click");
                            });
                            jQuery("#filFile").off("change");
                            jQuery("#filFile").on("change", function () {
                                jQuery("#smlName").html(jQuery('#filFile')[0].files[0].name);
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txtPrecision').val(item.precision);
                            jQuery('#ddlEquipmentType').val(item.equipmentType.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery("#smlName").html((item.document !== null) ? item.document.name : '');
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "code",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
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
                            switchable: true
                        }, {
                            field: "equipmentType.name",
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
                            code: jQuery('#txtCodeSearch').val(),
                            name: jQuery('#txtNameSearch').val(),
                            description: jQuery('#txtDescriptionSearch').val(),
                            equipmentType: { id: jQuery('#ddlEquipmentTypeSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        options.attachments = [{ id: "filFile", file: jQuery('#filFile')[0].files[0] }];
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').val(),
                            name: jQuery("#txtName").val(),
                            description: jQuery('#txaDescription').val(),
                            precision: jQuery('#txtPrecision').val(),
                            equipmentType: { id: jQuery("#ddlEquipmentType").int32() },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el Código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#ddlEquipmentType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo equipo.';
                                jQuery('#ddlEquipmentType').focus();
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
                equipment.Main = Main;
            })(environment.equipment || (environment.equipment = {}));
            var equipment = environment.equipment;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.equipment.Main.execute();