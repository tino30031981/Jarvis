(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (model) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "agr";
                        this.$ddlThematic = null;
                        this.$ddlThematicSearch = null;
                        this.$tblParameters = null;
                        this.$tblListParameters = null;
                        this.formParameter = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: "Agregar Parametros",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/model/formparameter", function () {
                                thiss.$tblParameters = thiss.$divPopup.find(Main.TBLRESULTPARAMETERS);
                                thiss.$btnSaveParameters = thiss.$divPopup.find(Main.BTNSAVEPARAMETER);
                                thiss.$btnSaveParameters.off("click");
                                thiss.$btnSaveParameters.on("click", function (e) {
                                    thiss.saveParameters();
                                });
                                thiss.searchParameters();
                            });
                        };
                        this.searchListParameters = function () {
                            var thiss = this;
                            thiss.cleanTable(thiss.$tblListParameters);
                            if (thiss.$hdnId.int32() === 0 && thiss.$ddlThematic.int32() === 0) {
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/model/searchparameters', {
                                data: { id: thiss.$hdnId.int32(), thematicId: thiss.$ddlThematic.int32() }, isJson: false
                            }, function (items) {
                                var html = '';
                                if (items === undefined || items === null) return;
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-legalstandardid=' + item.legalStandard.id + ' data-parameteranalysisid=' + item.parameterAnalysis.id + ' data-minimumvalue=' + item.minimumValue + ' data-maximumvalue=' + item.maximumValue + '>';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + item.legalStandard.number + '</td>';
                                    html += '<td>' + item.minimumValue + '</td>';
                                    html += '<td>' + item.maximumValue + '</td>';
                                    html += '<td>' + item.parameterAnalysis.name + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblListParameters.find('>tbody').html(html);
                                thiss.$tblListParameters.find('>caption>span').html(thiss.$tblListParameters.find('>tbody>tr').length);
                            });
                        };
                        this.searchParameters = function () {
                            var thiss = this;
                            thiss.cleanTable(thiss.$tblParameters);
                            if (thiss.$ddlThematic.int32() === 0) {
                                alert('Seleccione la Temática');
                                return;
                            }
                            var itemParameter = [];
                            thiss.$tblListParameters.find('>tbody>tr').toArray().forEach(function (tr) {
                                itemParameter.push({
                                    id: $(tr).attr('data-uniqueid'),
                                    legalStandard: { id: $(tr).attr('data-legalstandardid') },
                                    parameterAnalysis: { id: $(tr).attr('data-parameteranalysisid') },
                                    maximumValue: $(tr).attr('data-minimumvalue'),
                                    minimumValue: $(tr).attr('data-maximumvalue')
                                });
                            });
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/parameter/searchformodel', {
                                data: { thematicId: thiss.$ddlThematic.int32() }
                            }, function (items) {
                                var html = '';
                                if (items === undefined || items === null) return;
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + ddlList(item.legalStandards, "legalstandard") + '</td>';
                                    html += '<td>' + item.maximumValue + '</td>';
                                    html += '<td>' + item.minimumValue + '</td>';
                                    html += '<td>' + ddlList(item.parametersAnalysis, "parameterAnalysis") + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblParameters.find('>tbody').html(html);
                                thiss.$tblParameters.find('>caption>span').html(thiss.$tblParameters.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblParameters);
                                function ddlList(items, attr) {
                                    var html2 = '';
                                    html2 += '<select class="form-control ' + attr + '">';
                                    items.forEach(function (item) {
                                        html2 += '<option value="' + item.id + '">' + item.name + '</option>';
                                    });
                                    html2 += '</select>';
                                    return html2;
                                }
                                var $input = null;
                                var $tr = null;
                                itemParameter.forEach(function (item) {
                                    $input = thiss.$tblParameters.find('>tbody>tr input:checkbox[value="' + item.id + '"]');
                                    if ($input.length > 0) {
                                        $tr = $input.closest('tr');
                                        $tr.find('input:checkbox[value="' + item.id + '"]').attr("checked", true);
                                        $tr.find('td:eq(3) select').val(item.legalStandard.id);
                                        $tr.find('td:eq(6) select').val(item.parameterAnalysis.id);
                                    }
                                });
                                thiss.$tblParameters.find('>tbody>tr .legalstandard').off("change");
                                thiss.$tblParameters.find('>tbody>tr .legalstandard').on("change", function (e) {
                                    thiss.searchMinimumAndMaximum($(this).closest('tr'));
                                });
                                thiss.$tblParameters.find('>tbody>tr .legalstandard').trigger("change");
                            });
                        };
                        this.searchMinimumAndMaximum = function ($tr) {
                            var thiss = this;
                            var id = $tr.find('td:eq(0) input:checkbox').int32();
                            var legalStandardId = $tr.find('td:eq(3) :selected').int32();
                            if (id == 0 || legalStandardId == 0) return;
                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/parameter/searchminimumandmaximum', {
                                data: { id: id, legalStandardId: legalStandardId }, isJson : false
                            }, function (data) {
                                if (data === null) return;
                                var item = data.item;
                                $tr.find('td:eq(4)').text(item.minimumValue);
                                $tr.find('td:eq(5)').text(item.maximumValue);
                            });
                        };
                        this.deleteParameters = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0){
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var parameterIds = com.jtm.helper.Table.getItems(thiss.$tblListParameters, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), parameterIds: parameterIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (parameterIds.length === 0) {
                                    alert('Seleccione al menos un parametro.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/model/deleteparameters', options, function () { thiss.searchListParameters(); });
                        };
                        this.saveParameters = function () {
                            var thiss = this;
                            var parameters = [];
                            var $tr = null;
                            thiss.$tblParameters.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(jQuery(input).closest('tr'));
                                parameters.push({
                                    id: $tr.find('td:eq(0) input:checkbox:checked').val(),
                                    legalStandard: { id: $tr.find('td:eq(3) :selected').int32() },
                                    parameterAnalysis: { id: $tr.find('td:eq(6) :selected').int32() }
                                });
                            });
                            var item = {
                                id: thiss.$hdnId.int32(),
                                thematic: { id: thiss.$ddlThematic.int32() },
                                parameters: parameters
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/model/saveparameters', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchListParameters();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (parameters.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un parametro';
                                }
                                parameters.forEach(function (parameter) {
                                    if (parameter.id == 0) {
                                        success = false;
                                        message = 'Seleccione el parametro.';
                                    }
                                    else if (parameter.parameterAnalysis.id === 0) {
                                        success = false;
                                        message = 'Seleccione Análsis Parametro.';
                                    }
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.cleanTable = function ($tbl) {
                            $tbl.find('>tbody').empty();
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                        };
                    }
                    Main.TBLLISTPARAMETERS = '#tblListParameters';
                    Main.TBLRESULTPARAMETERS = '#tblResultParameters';
                    Main.DDLTHEMATIC = "#ddlThematic";
                    Main.BTNADDPARAMETER = "#btnAddParameter";
                    Main.BTNSAVEPARAMETER = "#btnSaveParameters";
                    Main.BTNQUITPARAMETER = "#btnQuitParameters";
                    Main.DDLTHEMATICSEARCH = "#ddlThematicSearch";
                    Main.DIVPARAMETERS = "#divParameters";
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.$ddlThematic = thiss.$form.find(Main.DDLTHEMATIC);
                            thiss.$tblListParameters = thiss.$form.find(Main.TBLLISTPARAMETERS);                           
                            thiss.$btnAddParameter = thiss.$form.find(Main.BTNADDPARAMETER);                            
                            thiss.$btnQuitParameters = thiss.$form.find(Main.BTNQUITPARAMETER);
                            thiss.$btnAddParameter.off("click");
                            thiss.$btnAddParameter.on("click", function (e) {
                                thiss.formParameter();
                            });
                            thiss.$btnQuitParameters.off("click");
                            thiss.$btnQuitParameters.on("click", function (e) {
                                thiss.deleteParameters();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$ddlThematicSearch = this.$main.find(Main.DDLTHEMATICSEARCH);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            thiss.$txtName.val(item.name);
                            thiss.$txaDescription.val(item.description);
                            thiss.$ddlThematic.val(item.thematic.id);
                            thiss.searchListParameters();
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
                            field: "thematic.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
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
                        var thiss = this;
                        return {
                            name: thiss.$txtNameSearch.val(),
                            thematic: { id: thiss.$ddlThematicSearch.val() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.val(),
                            description: thiss.$txaDescription.val(),
                            thematic: { id: thiss.$ddlThematic.int32() },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtName.string() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                thiss.$txtName.focus();
                            } else if (thiss.$ddlThematic.int32() === 0) {
                                success = false;
                                message = 'Selecione la Temática.';
                                thiss.$ddlThematic.focus();
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
                model.Main = Main;
            })(environment.model || (environment.model = {}));
            var model = environment.model;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.model.Main.execute();