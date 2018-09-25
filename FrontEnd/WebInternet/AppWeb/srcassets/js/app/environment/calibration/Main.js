(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (calibration) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "cal";
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtDateSearch');
                        thiss.datePicker('#txtDateEndSearch');
                        thiss.datePicker('#txtExpirationDateSearch');
                        thiss.datePicker('#txtExpirationDateEndSearch');
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.datePicker('#txtDate');
                            thiss.datePicker('#txtExpirationDate');
                            jQuery("#btnOpenFile").off("click")
                            jQuery("#btnOpenFile").on("click", function (e) {
                                jQuery("#filFile").trigger("click");
                            });
                            jQuery("#filFile").off("change");
                            jQuery("#filFile").on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    jQuery("#smlName").html(e.originalEvent.target.files[0].name);
                                }                                
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtDate').val(item.date);
                            jQuery('#txtExpirationDate').val(item.expirationDate);
                            jQuery('#ddlEquipment').val(item.equipment.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery("#smlName").html((item.document !== null) ? item.document.name : '');
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "date",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "expirationDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "equipment.name",
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
                            date: jQuery('#txtDateSearch').val(),
                            dateEnd: jQuery('#txtDateEndSearch').val(),
                            expirationDate: jQuery('#txtExpirationDateStartSearch').val(),
                            expirationDateEnd: jQuery('#txtExpirationDateEndSearch').val(),
                            equipment: { id: jQuery('#ddlEquipmentSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        options.attachments = [{ id: "filFile", file: jQuery('#filFile')[0].files[0] }];
                        data = {
                            id: thiss.$hdnId.int32(),
                            date: jQuery('#txtDate').val(),
                            expirationDate: jQuery("#txtExpirationDate").val(),
                            equipment: { id: jQuery("#ddlEquipment").int32() },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha.';
                                jQuery('#txtDate').focus();
                            } else if (jQuery('#txtExpirationDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha de expiración.';
                                jQuery('#txtExpirationDate').focus();
                            } else if (jQuery('#ddlEquipment').int32() === 0) {
                                success = false;
                                message = 'Seleccione el equipo.';
                                jQuery('#ddlEquipment').focus();
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
                calibration.Main = Main;
            })(environment.calibration || (environment.calibration = {}));
            var calibration = environment.calibration;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.calibration.Main.execute();