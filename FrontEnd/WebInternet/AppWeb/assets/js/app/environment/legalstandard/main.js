(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (parameter) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "pt";
                        this.$btnAddParameterField = null;
                        this.$btnQuitParameterField = null;
                        this.$btnAddParameterLaboratory = null;
                        this.$btnUpdateParameterLaboratory = null;
                        this.$btnSaveParameter = null;
                        this.$divTotalParametersField = null;
                        this.$divTotalParametersLaboratory = null;
                        this.$divTotalParameters = null;
                        this.$tblParameters = null;
                        this.$tblParametersField = null;
                        this.$tblParametersLaboratory = null;
                        this.saveParameters = function () {
                            var thiss = this;
                            var parameters = [];
                            var $tr = null;
                            thiss.$tblParameters.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(jQuery(input).closest('tr'));
                                parameters.push({
                                    id: $tr.find('td:eq(0) input:checkbox:checked').val(),
                                    measureUnit: { id: $tr.find('td:eq(3) :selected').int32() },
                                    parameterAnalysis: { id: $tr.find('td:eq(4) :selected').int32() },
                                    analysisMethod: { id: $tr.find('td:eq(5) :selected').int32() },
                                    parameterCategory: { id: $tr.find('td:eq(6) :selected').int32() },
                                    periodType: { id: $tr.find('td:eq(7) :selected').int32() },
                                    lmmpType: { id: $tr.find('td:eq(8) :selected').int32() },                                    
                                    minimumValue: $tr.find('td:eq(9) input').int32(),
                                    maximumValue: $tr.find("td:eq(10) input").int32()
                                });
                            });
                            var item = {
                                id: thiss.$hdnId.int32(),
                                parameters: parameters
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'environment/legalstandard/saveparameters', options, function () {
                                thiss.$divPopup.dialog('close'); thiss.searchParameters();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                parameters.forEach(function (parameter) {
                                    if (parameter.id === 0) {
                                        success = false;
                                        message = 'Seleccione el parametro.';
                                    }
                                    else if (parameter.measureUnit.id === 0) {
                                        success = false;
                                        message = 'Seleccione la unidad de medida';
                                    }
                                    else if (parameter.analysisMethod.id === 0) {
                                        success = false;
                                        message = 'Seleccione el metodo de analisis.';
                                    }
                                    else if (parameter.parameterCategory.id === 0) {
                                        success = false;
                                        message = 'Seleccione el parametro de categoria.';
                                    }                                    
                                    else if (parameter.maximumValue === 0) {
                                        success = false;
                                        message = 'Ingrese el valor máximo.';
                                    }                                    
                                    else if (parameter.minimumValue === 0) {
                                        success = false;
                                        message = 'Ingrese el valor minimo.';
                                    }
                                    else if (parameter.minimumValue >= parameter.maximumValue) {
                                        success = false;
                                        message = 'El valor mínimo no puede ser mayor al valor máximo.';
                                    }
                                });
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteParameters = function ($tbl) {
                            var thiss = this;
                            var parameters = [];
                            thiss.$tblParametersLaboratory.find('>tbody>tr').toArray().forEach(function (tr) {
                                if (jQuery(tr).find('input:checkbox:checked').length > 0) {
                                    parameters.push({ id: jQuery(tr).attr('data-uniqueid'), measureUnit: { id: jQuery(tr).attr('data-measureunitid') }, lmmpType: { id: jQuery(tr).attr('data-lmmptypeid') } });
                                }
                            });
                            var options = {
                                data: { id: thiss.$hdnId.int32(), parameters: parameters },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {                                
                                if (thiss.$hdnId.int32() === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                } else if (parameters.length === 0) {
                                    alert('Seleccione al un parametro.');
                                    return false;
                                }
                                else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'environment/legalstandard/deleteparameters', options, function () { thiss.searchParameters(); });
                        };
                        this.formParameters = function (id, title) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '100%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/legalstandard/formparameter", function () {
                                var itemParameter = [];
                                thiss.$btnSaveParameter = thiss.$divPopup.find('#btnSaveParameter');
                                thiss.$tblParameters = thiss.$divPopup.find('#tblResultParameters');                                
                                thiss.searchConfig(com.jtm.Server.contextPath + 'environment/parameter/searchbylegalstandard', {
                                    data: {
                                    },
                                    async: false
                                }, function (items) {
                                      thiss.fillParameters2(items);
                                });
                                thiss.$btnSaveParameter.off('click');
                                thiss.$btnSaveParameter.on('click', function (e) {                                    
                                    thiss.saveParameters();
                                });
                                thiss.$tblParametersLaboratory.find('>tbody>tr').toArray().forEach(function (tr) {
                                    itemParameter.push({
                                        id: jQuery(tr).attr('data-uniqueid'),                                        
                                        measureUnit: { id: jQuery(tr).attr('data-measureunitid') },                                        
                                        parameterAnalysis: { id: jQuery(tr).attr('data-parameteranalysisid') },
                                        analysisMethod: { id: jQuery(tr).attr('data-analysismethodid') },
                                        parameterCategory: { id: jQuery(tr).attr('data-parametercategoryid') },
                                        periodType: { id: jQuery(tr).attr('data-periodtypeid') },
                                        lmmpType: { id: jQuery(tr).attr('data-lmmptypeid') },
                                        minimumValue: jQuery(tr).find('td:eq(4)').text(),
                                        maximumValue: jQuery(tr).find('td:eq(5)').text()
                                    });
                                });
                                var $input = null;
                                var $tr = null;
                                itemParameter.forEach(function (item) {                                    
                                    $input = thiss.$tblParameters.find('>tbody>tr input:checkbox[value="' + item.id + '"]');
                                    if ($input.length > 0) {
                                        $tr = $input.closest('tr');
                                        $tr.find('input:checkbox[value="' + item.id + '"]').attr("checked", true);
                                        $tr.find('td:eq(3) select').val(item.measureUnit.id);
                                        $tr.find('td:eq(4) select').val(item.parameterAnalysis.id);
                                        $tr.find('td:eq(5) select').val(item.analysisMethod.id);
                                        $tr.find('td:eq(6) select').val(item.parameterCategory.id);
                                        $tr.find('td:eq(7) select').val(item.periodType.id);
                                        $tr.find('td:eq(8) select').val(item.lmmpType.id);                                        
                                        $tr.find('td:eq(9) input').val(item.minimumValue);
                                        $tr.find('td:eq(10) input').val(item.maximumValue);
                                    }
                                });
                            });
                        };
                        this.fillParameters2 = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + ddlList(item.measureUnits, "measureunit") + '</td>';
                                html += '<td>' + ddlList(item.parametersAnalysis, "paramteranalysis") + '</td>';
                                html += '<td>' + ddlList(item.analysisMethods, "analysismethod") + '</td>';
                                html += '<td>' + ddlList(item.parametersCategory, "parametercategory") + '</td>';
                                html += '<td>' + ddlList(item.periodTypes, "periodtype") + '</td>';
                                html += '<td>' + ddlList(item.lmmpTypes, "lmmptype") + '</td>';                                
                                html += '<td><input type="text" maxlength="6" class="form-control text-right minimumvalue" id="txt' + item.id + '" ></td>';
                                html += '<td><input type="text" maxlength="6" class="form-control text-right maximumvalue" id="txt' + item.id + '" ></td>';
                                html += '</tr>';
                            });
                            thiss.$tblParameters.find('>tbody').html(html);
                            thiss.$tblParameters.find('>caption>span').html(thiss.$tblParameters.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblParameters);
                            thiss.$tblParameters.find('>tbody>tr input:text').numeric({ negative: false, decimalPlaces: 2 });
                            function ddlList(items, attr) {
                                var html2 = '';
                                html2 += '<select class="form-control ' + attr + '">';
                                items.forEach(function (item) {
                                    html2 += '<option value="' + item.id + '">' + item.name + '</option>';
                                });
                                html2 += '</select>';
                                return html2;
                            }
                        };
                        this.searchParameters = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/legalstandard/searchparameters', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                if (items === undefined || items === null) return;
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-measureunitid="' + item.measureUnit.id + '" data-periodtypeid="' + item.periodType.id + '" data-lmmptypeid="' + item.lmmpType.id + '" data-parameteranalysisid="' + item.parameterAnalysis.id + '" data-analysismethodid="' + item.analysisMethod.id + '" data-parametercategoryid="' + item.parameterCategory.id + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + item.symbol + '</td>';
                                    html += '<td>' + item.minimumValue + '</td>';
                                    html += '<td>' + item.maximumValue + '</td>';                                    
                                    html += '<td>' + item.parameterAnalysis.name + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblParametersLaboratory.find('>tbody').html(html);
                                thiss.$tblParametersLaboratory.find('>caption>span').html(thiss.$tblParametersLaboratory.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblParametersLaboratory);
                            });
                        };
                    }
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.datePicker('#txtDate');
                            thiss.$btnAddParameterLaboratory = thiss.$form.find('#btnAddParameterLaboratory');
                            thiss.$btnQuitParameterLaboratory = thiss.$form.find('#btnQuitParameterLaboratory');
                            thiss.$tblParametersLaboratory = thiss.$form.find('#tblResultParametersLaboratory');
                            thiss.$btnAddParameterLaboratory.off('click');
                            thiss.$btnAddParameterLaboratory.on('click', function (e) {
                                thiss.formParameters(0, "Agregar Parametro");
                            });
                            thiss.$btnQuitParameterLaboratory.off("click");
                            thiss.$btnQuitParameterLaboratory.on("click", function (e) {
                                thiss.deleteParameters();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtNumber').val(item.number);
                            jQuery('#txtDate').val(item.date);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#ddlThematic').val(item.thematic.id === null ? 0 : item.thematic.id);
                            jQuery('#ddlInformationSource').val(item.informationSource.id === null ? 0 : item.informationSource.id);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.searchParameters();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "number",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "date",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "thematic.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "informationSource.name",
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
                            number: jQuery('#txtNumberSearch').string(),
                            description: jQuery('#txtDescriptionSearch').string(),
                            thematic: { id: jQuery('#ddlThematicSearch').int32() },
                            informationSource: { id: jQuery('#ddlInformationSourceSearch').int32() },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            number: jQuery('#txtNumber').string(),
                            description: jQuery('#txaDescription').string(),
                            date: jQuery('#txtDate').date(),
                            thematic: { id: jQuery('#ddlThematic').int32() },
                            informationSource: { id: jQuery('#ddlInformationSource').int32() },
                            state: jQuery('#chkState').boolean(),
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtNumber').string() === '') {
                                success = false;
                                message = 'Ingrese un numero.';
                                jQuery('#txtNumber').focus();
                            }
                            if (jQuery('#txtDate').string() === '') {
                                success = false;
                                message = 'Ingrese una Fecha.';
                                jQuery('#txtDate').focus();
                            }
                            if (jQuery('#ddlThematic').int32() === 0) {
                                success = false;
                                message = 'Seleccione la temática.';
                                jQuery('#ddlThematic').focus();
                            }
                            if (jQuery('#ddlInformationSource').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Institución.';
                                jQuery('#ddlInformationSource').focus();
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