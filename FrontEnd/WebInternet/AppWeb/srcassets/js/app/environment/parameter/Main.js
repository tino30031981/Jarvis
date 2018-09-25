(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (parameter) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "pt";
                        this.$btnAddMeasureUnit = null;
                        this.$btnQuitMeasureUnit = null;
                        this.$btnAddThematic = null;
                        this.$btnQuitThematics = null;
                        this.$ddlMeasureUnit = null;
                        this.$ddlThematic = null;
                        this.$tblResultMeasureUnit = null;
                        this.$tblResultThematic = null;
                        this.saveMeasureUnit = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnId.int32(),
                                measureUnitId: thiss.$ddlMeasureUnit.int32()
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/parameter/savemeasureunit', options, function () {
                                thiss.searchMeasureUnits();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (thiss.$ddlMeasureUnit.int32() === 0) {
                                    success = false;
                                    message = 'Selecione la unidad de medida.';
                                    thiss.$ddlMeasureUnit.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteMeasureUnits = function () {
                            var thiss = this;
                            var measureUnitIds = com.jtm.helper.Table.getItems(thiss.$tblResultMeasureUnit, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), measureUnitIds: measureUnitIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (measureUnitIds.length === 0) {
                                    alert('Seleccione al menos una unidad de medida.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/parameter/deletemeasureunits', options, function () { thiss.searchMeasureUnits(); });
                        };
                        this.searchMeasureUnits = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/parameter/searchmeasureunits', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                if (items == null && items.length === 0) return;
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + item.symbol + '</td>';
                                    html += '<td>' + item.description + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblResultMeasureUnit.find('>tbody').html(html);
                                thiss.$tblResultMeasureUnit.find('>caption>span').html(thiss.$tblResultMeasureUnit.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultMeasureUnit);
                            });
                        };
                        this.saveThematic = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return };
                            var item = {
                                id: thiss.$hdnId.int32(),
                                thematicId: thiss.$ddlThematic.int32()
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/parameter/savethematics', options, function () {
                                thiss.searchThematics();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (thiss.$ddlThematic.int32() === 0) {
                                    success = false;
                                    message = 'Seleccione la Temática.';
                                    thiss.$ddlThematic.focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteThematics = function () {
                            var thiss = this;
                            var thematicIds = com.jtm.helper.Table.getItems(thiss.$tblResultThematic, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), thematicIds: thematicIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (thematicIds.length === 0) {
                                    alert('Seleccione al menos una temática.');
                                    return false;
                                } else if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/parameter/deletethematics', options, function () { thiss.searchThematics(); });
                        };
                        this.searchThematics = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/parameter/searchthematics', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                if (items == null && items.length === 0) return;
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';                                    
                                    html += '<td>' + item.description + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblResultThematic.find('>tbody').html(html);
                                thiss.$tblResultThematic.find('>caption>span').html(thiss.$tblResultThematic.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultThematic);
                            });
                        };
                    }
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$btnAddMeasureUnit = thiss.$form.find("#btnAddMeasureUnit");
                            thiss.$btnQuitMeasureUnit = thiss.$form.find("#btnQuitMeasureUnit");
                            thiss.$ddlMeasureUnit = thiss.$form.find("#ddlMeasureUnit");
                            thiss.$ddlThematic = thiss.$form.find("#ddlThematic");
                            thiss.$tblResultMeasureUnit = thiss.$form.find("#tblResultMeasureUnits");
                            thiss.$tblResultThematic = thiss.$form.find("#tblResultThematics");
                            thiss.$btnAddThematic = thiss.$form.find("#btnAddThematic");
                            thiss.$btnQuitThematics = thiss.$form.find("#btnQuitThematics");
                            thiss.$btnAddMeasureUnit.off('click');
                            thiss.$btnAddMeasureUnit.on('click', function (e) {
                                thiss.saveMeasureUnit();
                            });
                            thiss.$btnQuitMeasureUnit.off('click');
                            thiss.$btnQuitMeasureUnit.on('click', function (e) {
                                thiss.deleteMeasureUnits();
                            });
                            thiss.$btnAddThematic.off('click');
                            thiss.$btnAddThematic.on('click', function (e) {
                                thiss.saveThematic();
                            });
                            thiss.$btnQuitThematics.off('click');
                            thiss.$btnQuitThematics.on('click', function (e) {
                                thiss.deleteThematics();
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
                            jQuery('#txtSymbol').val(item.symbol);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#ddlParameterType').val(item.parameterType.id);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.searchMeasureUnits();
                            thiss.searchThematics();
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
                            field: "symbol",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "parameterType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "description",
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
                            symbol: jQuery('#txtSymbolSearch').string(),
                            parameterType: { id: jQuery('#ddlParameterTypeSearch').int32() },
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
                            parameterType: { id: jQuery('#ddlParameterType').int32() },
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
                            if (jQuery('#txtSymbol').string() === '') {
                                success = false;
                                message = 'Ingrese el simbolo.';
                                jQuery('#txtSymbol').focus();
                            }
                            if (jQuery('#ddlParameterType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de parametro.';
                                jQuery('#ddlParameter').focus();
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
                parameter.Main = Main;
            })(environment.parameter || (environment.parameter = {}));
            var parameter = environment.parameter;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.parameter.Main.execute();