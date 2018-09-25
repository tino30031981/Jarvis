(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (indicator) {
                        (function (thematicmap) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.dialogData = null;
                                    this.domWidgetData = this.domWidget + "Data";
                                    this.defaultDefinitionExpression = "0=1";
                                    this.excludeFields = ["ESRI_OID", "OBJECTID", "SHAPE_AREA", "SHAPE_LENGTH", "FID", "SHAPE.AREA", "SHAPE.LENGTH"];
                                    this.layer = null;
                                    this.layerMouseClick = null;
                                    this.layerMouseOver = null;
                                    this.layerMouseOut = null;
                                    this.layerUpdateStart = null;
                                    this.layerUpdateEnd = null;

                                    this.parseLayer = function () {
                                        var thiss = this;
                                        var data2 = null;
                                        jQuery.ajaxSetup({ async: false });
                                        jQuery.getJSON(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerDataId + "?f=json", function (data, textStatus, jqXHR) {
                                            data2 = data;
                                        });
                                        jQuery.ajaxSetup({ async: true });
                                        parseFields();
                                        parseMeasureUnitField();
                                        parseServiceFields();
                                        parseNormalizationFields();
                                        function parseFields() {
                                            var i = 0;
                                            var exist = false;
                                            for (i = 0; i < thiss.config.module.widget.fields.length; i++) {
                                                exist = (data2.fields.exist2("name", thiss.config.module.widget.fields[i]));
                                                if (exist === false)
                                                    thiss.config.module.widget.fields.remove2(thiss.config.module.widget.fields[i]);
                                            }
                                        }
                                        function parseMeasureUnitField() {
                                            if (data2.fields.exist2("name", thiss.config.module.widget.meatureUnitField) === false)
                                                thiss.config.module.widget.meatureUnitField = "";
                                        }
                                        function parseServiceFields() {
                                            var i = 0;
                                            if (thiss.config.module.widget.service.fields.indexOf("*") != -1) {
                                                thiss.config.module.widget.service.fields = [];
                                                for (i = 0; i < data2.fields.length; i++)
                                                    if (thiss.excludeFields.indexOf(data2.fields[i].name) == -1)
                                                        thiss.config.module.widget.service.fields.push(data2.fields[i].name);
                                            }
                                            else {
                                                var fields = [];
                                                i = 0;
                                                for (i = 0; i < thiss.config.module.widget.service.fields.length; i++)
                                                    if (thiss.excludeFields.indexOf(thiss.config.module.widget.service.fields[i]) == -1)
                                                        if (data2.fields.exist2("name", thiss.config.module.widget.service.fields[i]) === true)
                                                            fields.push(thiss.config.module.widget.service.fields[i]);
                                                thiss.config.module.widget.service.fields = fields;
                                            }
                                        }
                                        function parseNormalizationFields() {
                                            var normalizationFields = [];
                                            var i = 0;
                                            for (i = 0; i < data2.fields.length; i++) {
                                                if (data2.fields[i].type == 'esriFieldTypeInteger' || data2.fields[i].type == 'esriFieldTypeDouble')
                                                    normalizationFields.push(data2.fields[i].name);
                                            }
                                            var normalizationType = thiss.config.module.widget.classificationType.classBreaksDef.normalizationTypes.find2("id", "field");
                                            if (normalizationType !== null)
                                                normalizationType.normalizationFields = normalizationFields;
                                        }
                                    };
                                    this.parseOthers = function () {
                                        var thiss = this;
                                        thiss.config.module.widget.thematicMapTypes = [];
                                        var type = null;
                                        for (type in thiss.config.module.widget.classificationType)
                                            thiss.config.module.widget.thematicMapTypes.push(type);
                                        if (thiss.config.module.widget.service.fields.indexOf("*") == -1) {
                                            var i = 0;
                                            for (i = 0; i < thiss.config.module.widget.fields.length; i++) {
                                                if (thiss.config.module.widget.service.fields.indexOf(thiss.config.module.widget.fields[i]) == -1)
                                                    thiss.config.module.widget.service.fields.push(thiss.config.module.widget.fields[i]);
                                            }
                                            if (thiss.config.module.widget.service.fields.indexOf(thiss.config.module.widget.meatureUnitField) == -1)
                                                thiss.config.module.widget.service.fields.push(thiss.config.module.widget.meatureUnitField);
                                        }
                                    };
                                    this.execute = function () {
                                        var thiss = this;
                                        thiss.closeData(thiss.dialogData);
                                        var validateForm = false;
                                        if (jQuery('#' + thiss.domWidget + ' #ddlClassificationType').val().toUpperCase() == BaseWidget.UNIQUEVALUEDEF.toUpperCase())
                                            validateForm = validate(true);
                                        else
                                            validateForm = validate(false);
                                        if (validateForm === false)
                                            return;
                                        if (thiss.layerUpdateStart !== null)
                                            thiss.layerUpdateStart.remove();
                                        thiss.layerUpdateStart = thiss.layer.on("update-start", function (e) {
                                        });
                                        if (thiss.layerUpdateEnd !== null)
                                            thiss.layerUpdateEnd.remove();
                                        thiss.layerUpdateEnd = thiss.layer.on("update-end", function (e) {
                                            if (thiss.layer.graphics.length === 0) return;
                                            thiss.map.setExtent(thiss.layer.fullExtent, true).addCallback(function (e) {
                                                thiss.layer.setRenderer(null);
                                                thiss.layer.redraw();
                                                if (jQuery('#' + thiss.domWidget + ' #ddlClassificationType').val().toUpperCase() == BaseWidget.UNIQUEVALUEDEF.toUpperCase())
                                                    setUniqueValueRenderer();
                                                else
                                                    setClassBreaksRenderer();
                                            });
                                        });
                                        thiss.layer.setDefinitionExpression(getWhere());
                                        setLabel();
                                        var colorRamp = new esri.tasks.AlgorithmicColorRamp();
                                        colorRamp.fromColor = getColor("#txtFromColor");
                                        colorRamp.toColor = getColor("#txtToColor");
                                        colorRamp.algorithm = jQuery('#' + thiss.domWidget + ' #ddlAlgorithm').val();
                                        function setUniqueValueRenderer() {
                                            var definition = new esri.tasks.UniqueValueDefinition();
                                            definition.attributeField = thiss.getValue('#ddlField');
                                            definition.baseSymbol = getBaseSymbol();
                                            definition.colorRamp = colorRamp;
                                            var parameters = new esri.tasks.GenerateRendererParameters();
                                            parameters.classificationDefinition = definition;
                                            parameters.where = getWhere();
                                            var task = new esri.tasks.GenerateRendererTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerDataId);
                                            task.execute(parameters).addCallback(function (response) {
                                                patchValueUniqueDefinition(response);
                                                thiss.layer.setRenderer(response);
                                                thiss.layer.redraw();
                                                thiss.showData();
                                            });
                                        }
                                        function setClassBreaksRenderer() {
                                            var definition = new esri.tasks.ClassBreaksDefinition();
                                            definition.classificationField = thiss.getValue('#ddlField');
                                            definition.classificationMethod = thiss.getValue('#ddlClassificationMethod');
                                            definition.breakCount = thiss.getValue('#txtBreakCount');
                                            definition.baseSymbol = getBaseSymbol();
                                            definition.colorRamp = colorRamp;
                                            var parameters = new esri.tasks.GenerateRendererParameters();
                                            parameters.classificationDefinition = definition;
                                            parameters.where = getWhere();
                                            var task = new esri.tasks.GenerateRendererTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerDataId);
                                            task.execute(parameters).addCallback(function (response) {
                                                thiss.layer.setRenderer(response);
                                                thiss.layer.redraw();
                                                thiss.showData();
                                            });
                                        }
                                        function getBaseSymbol() {
                                            var color = getColor("#txtBaseColor");
                                            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                                new esri.symbol.SimpleLineSymbol(
                                                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                                    color,
                                                    0.5
                                                ),
                                                null
                                            );
                                            return symbol;
                                        }
                                        function getColor(selector) {
                                            var hex = jQuery('#' + thiss.domWidget + ' ' + selector).spectrum("get").toHexString();
                                            return esri.Color.fromHex(hex);
                                        }
                                        function getWhere() {
                                            var random = Math.random();
                                            var where = "representacionterritorialid ='{0}' and variableid = {1} and fuenteinformacionid={2} and tipoperiodoid = {3} and fechainicio = '{4}'";
                                            var representacionTerritorialId = com.jtm.helper.DropDownList.getLastValue('#' + thiss.domWidget + ' #divTerritorialRepresentation');
                                            var variableId = jQuery('#' + thiss.domWidget + ' #ddlVariable').val();
                                            var fuenteInformacionId = jQuery('#' + thiss.domWidget + ' #ddlSourceInformation').val();
                                            var periodTypeId = jQuery('#' + thiss.domWidget + ' #ddlPeriodType').val();
                                            var date = jQuery('#' + thiss.domWidget + ' #ddlYear').val() + "-01-01";
                                            return where.replace("{0}", representacionTerritorialId).replace("{1}", variableId).replace("{2}", fuenteInformacionId).replace("{3}", periodTypeId).replace("{4}", date);
                                        }
                                        function setLabel() {
                                            var color = esri.Color.fromRgb(thiss.config.module.widget.color.defaultLabel);
                                            var symbol = new esri.symbol.TextSymbol().setColor(color);
                                            symbol.font.setSize("10pt");
                                            symbol.font.setFamily("arial");
                                            var labelClass = new esri.layers.LabelClass({ labelExpressionInfo: { value: "{" + thiss.config.module.widget.service.displayField + "}({" + thiss.getValue("#ddlField") + "})" } });
                                            labelClass.symbol = symbol;
                                            thiss.layer.setLabelingInfo([labelClass]);
                                        }
                                        function patchValueUniqueDefinition(data) {
                                            if (data.infos === undefined || data.infos === null) return;
                                            var i = 0;
                                            var items = [];
                                            for (i in data._symbols) {
                                                items.push(i.replace(",", thiss.config.module.widget.decimalSeparator));
                                            }
                                            var symbols = toObject(items);
                                            var j = null;
                                            for (i in symbols) {
                                                j = (i.replace(thiss.config.module.widget.decimalSeparator, ","));
                                                symbols[i] = data._symbols[j];
                                                symbols[i].value = Number(data._symbols[j].value.replace(",", thiss.config.module.widget.decimalSeparator));
                                                symbols[i].label = data._symbols[j].label.replace(",", thiss.config.module.widget.decimalSeparator);
                                            }
                                            delete data._symbols;
                                            data._symbols = symbols;
                                            for (i = 0; i < data.infos.length; i++) {
                                                data.infos[i].label = data.infos[i].label.replace(",", thiss.config.module.widget.decimalSeparator);
                                                data.values[i] = Number(data.values[i].replace(",", thiss.config.module.widget.decimalSeparator));
                                            }
                                            function toObject(symbols) {
                                                var symbols2 = items.reduce(function (o, v, i) {
                                                    o[v] = v;
                                                    return o;
                                                }, {});
                                                return symbols2;
                                                //var rv = {};
                                                //for (var i = 0; i < array.length; ++i)
                                                //    if (array[i] !== undefined) rv[i] = array[i];
                                                //return rv;
                                            }
                                        }
                                        function validate(classBreaks) {
                                            if (com.jtm.helper.DropDownList.getLastValue('#' + thiss.domWidget + " #divTerritorialRepresentation") == com.jtm.helper.DropDownList.DDLVALUEDEFAULT) {
                                                alert("Seleccione la representación territorial");
                                                return false;
                                            }
                                            if (thiss.getValue("#ddlVariable") == com.jtm.helper.DropDownList.DDLVALUEDEFAULT) {
                                                alert("Seleccione una variable");
                                                return false;
                                            }
                                            if (thiss.getValue("#ddlSourceInformation") == com.jtm.helper.DropDownList.DDLVALUEDEFAULT) {
                                                alert("Seleccione una fuente de información");
                                                return false;
                                            }
                                            if (thiss.getValue("#ddlPeriodType") == com.jtm.helper.DropDownList.DDLVALUEDEFAULT) {
                                                alert("Seleccione un tipo de periodo");
                                                return false;
                                            }
                                            if (thiss.getValue("#ddlYear") == com.jtm.helper.DropDownList.DDLVALUEDEFAULT) {
                                                alert("Seleccione un año");
                                                return false;
                                            }
                                            if (classBreaks === true) {
                                                if (thiss.getValue("#txtBreakCount") <= 0) {
                                                    alert("Ingrese la cantidad de rangos");
                                                    return false;
                                                }
                                            }
                                            return true;
                                        }
                                    };
                                    this.showData = function () {
                                        var thiss = this;
                                        var uuid = thiss.getUUID();
                                        thiss.dialogData = jQuery('<div id="' + thiss.domWidgetData + '"></div>').dialog({
                                            title: 'Gráfico y tabla de datos',
                                            width: 400,
                                            height: jQuery(window).height() - 50,
                                            resizable: false,
                                            closeOnEscape: true,
                                            autoremove: true,
                                            //position: [10, 10],
                                            //position: { my: 'right top', at: 'right top' },
                                            close: function (dialog) {
                                                thiss.onCloseData(this);
                                            }
                                        });

                                        setChart();
                                        setTable();
                                        if (thiss.layerMouseClick !== null)
                                            thiss.layerMouseClick.remove();
                                        thiss.layerMouseClick = thiss.layer.on("click", function (e) {
                                            thiss.onMouseClickGraphicToChart(e);
                                        });
                                        if (thiss.layerMouseOver !== null)
                                            thiss.layerMouseOver.remove();
                                        thiss.layerMouseOver = thiss.layer.on("mouse-over", function (e) {
                                            var series = jQuery('#' + thiss.domWidgetData + ' #div' + uuid).highcharts().series;
                                            thiss.onMouseOverGraphicToChart(e, series, thiss.layer.objectIdField);
                                        });
                                        if (thiss.layerMouseOut !== null)
                                            thiss.layerMouseOut.remove();
                                        thiss.layerMouseOut = thiss.layer.on("mouse-out", function (e) {
                                            var series = jQuery('#' + thiss.domWidgetData + ' #div' + uuid).highcharts().series;
                                            thiss.onMouseOutGraphicToChart(e, series);
                                        });
                                        function setChart() {
                                            jQuery('#' + thiss.domWidgetData).append('<div>Tipo de gráfico: <select id="ddlChartType"></select> 3d: <input type="checkbox" id="chkEnabledChart3d" /></div>');
                                            jQuery('#' + thiss.domWidgetData + ' #chkEnabledChart3d').prop("checked", !!thiss.config.module.widget.enabledChart3d);
                                            com.jtm.helper.DropDownList.fillLocal({
                                                ddl: '#' + thiss.domWidgetData + ' #ddlChartType',
                                                items: thiss.config.module.widget.chartTypes
                                            });
                                            jQuery('#' + thiss.domWidgetData).append('<div id="div' + uuid + '"></div>');
                                            jQuery('#' + thiss.domWidgetData + ' #ddlChartType').off('change');
                                            jQuery('#' + thiss.domWidgetData + ' #ddlChartType').on('change', function (e) {
                                                chart(jQuery(this).val(), jQuery('#' + thiss.domWidgetData + ' #chkEnabledChart3d').val());
                                            });
                                            jQuery('#' + thiss.domWidgetData + ' #chkEnabledChart3d').off('change');
                                            jQuery('#' + thiss.domWidgetData + ' #chkEnabledChart3d').on('change', function (e) {
                                                chart(jQuery('#' + thiss.domWidgetData + ' #ddlChartType').val(), jQuery(this).is(":checked"));
                                            });
                                            var div = '#' + thiss.domWidgetData + " #div" + uuid;
                                            chart(jQuery('#' + thiss.domWidgetData + ' #ddlChartType').val(), jQuery('#' + thiss.domWidgetData + ' #chkEnabledChart3d').is(":checked"));
                                            function chart(chartType, enabledChart3d) {
                                                thiss.map.setExtent(thiss.layer.fullExtent, true).addCallback(function (e) {
                                                    var categories = getCategories(thiss.layer.graphics);
                                                    var series = getSeries(thiss.layer.graphics);
                                                    var title = getTitle();
                                                    var subtitle = getSubtitle();
                                                    var measureUnit = getMeasureUnit(thiss.layer.graphics[0]);
                                                    var data = config(chartType, title, subtitle, categories, series, measureUnit, enabledChart3d);
                                                    data.plotOptions.series = data.plotOptions.series || {};
                                                    data.plotOptions.series.states = data.plotOptions.series.states || {};
                                                    data.plotOptions.series.states.select = data.plotOptions.series.states.select || {};
                                                    data.plotOptions.series.states.select.color = thiss.config.module.widget.symbols.simpleFillSelectionSymbol.color.toString();
                                                    data.plotOptions.series.states.select.lineColor = thiss.config.module.widget.symbols.simpleFillSelectionSymbol.outline.color.toString();
                                                    data.plotOptions.series.point = data.plotOptions.series.point || {};
                                                    data.plotOptions.series.point = {
                                                        events: {
                                                            mouseOver: function (e) {
                                                                thiss.onMouseOverChartToGraphic(e, thiss.layer.graphics, thiss.layer.objectIdField);
                                                            },
                                                            mouseOut: function (e) {
                                                                thiss.onMouseOutChartToGraphic(e, thiss.layer.graphics);
                                                            },
                                                            click: function (e) {
                                                                thiss.onMouseClickChartToGraphic(e, thiss.layer.graphics, thiss.layer.objectIdField);
                                                            }
                                                        }
                                                    };
                                                    jQuery(div).highcharts(data);
                                                });
                                                function getCategories(items) {
                                                    var categories = [];
                                                    var i = 0;
                                                    var j = null;
                                                    for (i = 0; i < items.length; i++)
                                                        for (j in items[i].attributes)
                                                            if (j.toUpperCase() == thiss.config.module.widget.service.displayField.toUpperCase())
                                                                categories.push(items[i].attributes[j]);
                                                    return categories;
                                                }
                                                function getSeries(items) {
                                                    var series = [];
                                                    var values = [];
                                                    var i = 0;
                                                    var j = null;
                                                    for (i = 0; i < items.length; i++) {
                                                        for (j in items[i].attributes) {
                                                            if (j.toUpperCase() == thiss.getValue('#ddlField').toUpperCase()) {
                                                                values.push({
                                                                    y: items[i].attributes[j],
                                                                    lineColor: items[i].getShape().fillStyle.toHex(),
                                                                    color: items[i].getShape().fillStyle.toHex(),
                                                                    id: items[i].attributes[thiss.layer.objectIdField]
                                                                });
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    series.push({ name: thiss.getValue('#ddlYear'), color: 'rgba(0, 0, 0, 0.1)', colorByPoint: false, data: values });
                                                    return series;
                                                }
                                                function config(chartType, title, subtitle, categories, series, measureUnit, enabled3d) {
                                                    //Highcharts.setOptions({
                                                    //    lang: {
                                                    //        drillUpText: 'Back to {series.name}'
                                                    //    }
                                                    //});
                                                    chartType = (chartType === undefined || chartType === null) ? "column" : chartType;
                                                    var item = {
                                                        chart: {
                                                            type: chartType,
                                                            options3d: {
                                                                enabled: enabled3d,
                                                                alpha: 15,
                                                                beta: 15,
                                                                depth: 50,
                                                                viewDistance: 25
                                                            }
                                                        },
                                                        title: {
                                                            text: title
                                                        },
                                                        subtitle: {
                                                            text: subtitle
                                                        },
                                                        xAxis: {
                                                            categories: categories
                                                        },
                                                        yAxis: {
                                                            title: {
                                                                text: measureUnit
                                                            }
                                                        },
                                                        credits: { enabled: false },
                                                        exporting: { enabled: true },
                                                        plotOptions: {
                                                            series: {
                                                                allowPointSelect: true,
                                                                states: {
                                                                    select: {
                                                                        /*borderWidth:5,
                                                                        borderColor:'Blue'*/
                                                                    }
                                                                },
                                                                cursor: 'pointer',
                                                                dataLabels: {
                                                                    enabled: false,
                                                                    //color: colors[0],
                                                                    style: {
                                                                        fontWeight: 'bold'
                                                                    },
                                                                    formatter: function () {
                                                                        return this.y; // +'%';
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        series: series
                                                    };
                                                    return item;
                                                }
                                            }
                                        }
                                        function setTable() {
                                            jQuery('#' + thiss.domWidgetData).append('<table id="tbl' + uuid + '" class="table"></table>');
                                            var table = '#' + thiss.domWidgetData + " #tbl" + uuid;
                                            setCaption();
                                            setHeader(thiss.layer.graphics[0].attributes);
                                            setBody(thiss.layer.graphics);
                                            setFooter();
                                            function setCaption() {
                                                jQuery(table).append('<caption></caption>');
                                                jQuery(table + " caption").html(getTitle());
                                            }
                                            function setHeader(items) {
                                                jQuery(table).append('<thead class="thead-inverse"></thead>');
                                                if (items !== null && items instanceof Object) {
                                                    var html = '<tr>';
                                                    var i = 0;
                                                    html += '<th>Color</th>';
                                                    for (i in items) {
                                                        if (i == thiss.layer.objectIdField.toUpperCase()) continue;
                                                        if (thiss.excludeFields.indexOf(i.toUpperCase()) > -1) continue;
                                                        if (thiss.config.module.widget.service.fields.indexOf(i) == -1) continue;
                                                        html += '<th>' + i + '</th>';
                                                    }
                                                    html += '</tr>';
                                                    jQuery(table + " thead").html(html);
                                                }
                                            }
                                            function setBody(items) {
                                                jQuery(table).append("<tbody></tbody>");
                                                if (items !== null && items instanceof Array) {
                                                    var html = '';
                                                    var i = 0;
                                                    var j = null;
                                                    for (i = 0; i < items.length; i++) {
                                                        html += '<tr><td style="background-color:' + items[i].getShape().fillStyle.toHex() + '">&nbsp;</td>';
                                                        for (j in items[i].attributes) {
                                                            if (j.toUpperCase() == thiss.layer.objectIdField.toUpperCase()) continue;
                                                            if (thiss.excludeFields.indexOf(j.toUpperCase()) > -1) continue;
                                                            if (thiss.config.module.widget.service.fields.indexOf(j) == -1) continue;
                                                            html += "<td>" + items[i].attributes[j] + "</td>";
                                                        }
                                                        html += '</tr>';
                                                    }
                                                    jQuery(table + " tbody").html(html);
                                                }
                                            }
                                            function setFooter() {
                                                jQuery(table).append('<tfoot></tfoot>');
                                                var columnsCount = jQuery(table).find("tr >td").length;
                                                var html = '<tr><th colspan="' + columnsCount + '">' + getSubtitle() + '</th></tr>';
                                                jQuery(table + " tfoot").html(html);
                                            }
                                        }
                                        function getTitle() {
                                            return jQuery('#' + thiss.domWidget + ' #ddlVariable :selected').text() + " - " + jQuery('#' + thiss.domWidget + ' #ddlYear').getLabel() + " (" + com.jtm.helper.DropDownList.getLastText('#' + thiss.domWidget + ' #divTerritorialRepresentation') + ")";
                                        }
                                        function getSubtitle() {
                                            return "Fuente: " + jQuery('#' + thiss.domWidget + ' #ddlSourceInformation').getLabel();
                                        }
                                        function getMeasureUnit(graphic) {
                                            if (graphic === undefined || graphic === null) return '';
                                            var measureUnit = graphic.attributes[thiss.config.module.widget.meatureUnitField];
                                            return (measureUnit === undefined || measureUnit === null) ? "Unidad" : measureUnit;
                                        }
                                    };
                                    this.updateMaxOffset = function () {
                                        var thiss = this;
                                        var offset = thiss.maxOffset();
                                        thiss.layer.setMaxAllowableOffset(offset);
                                    };
                                    this.maxOffset = function () {
                                        var thiss = this;
                                        return (thiss.map.extent.getWidth() / thiss.map.width);
                                    };
                                    this.getValue = function (dom) {
                                        var thiss = this;
                                        return jQuery('#' + thiss.domWidget + ' ' + dom).val();
                                    };
                                    this.clearData = function (obj) {
                                        var thiss = this;
                                    };
                                }
                                BaseWidget.UNIQUEVALUEDEF = 'uniqueValueDef';
                                BaseWidget.CLASSBREAKSDEF = 'classBreaksDef';
                                BaseWidget.prototype.onClick = function () {
                                    var thiss = this;
                                    thiss.showView({
                                        dialog: { width: 300 }
                                    });
                                };
                                BaseWidget.prototype.initConfig = function () {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    parseService(thiss.config.module.widget.service);
                                    jQuery.ajaxSetup({ async: true });
                                    thiss.parseLayer();
                                    this.parseOthers();
                                    _super.prototype.initConfig.call(this);
                                    function parseService(service) {
                                        jQuery.getJSON(service.url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                            if (data.error !== undefined) {
                                                service.exist = false;
                                            }
                                            else {
                                                if (data === null) return;
                                                service.definition = data;
                                            }
                                        }).fail(function (data, textStatus, jqXHR) {
                                            service.exist = false;
                                        });
                                    }
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    jQuery('#' + thiss.domWidget + " #pFields").hide();
                                    jQuery('#' + thiss.domWidget + " #divAdvancedOptions").hide();

                                    var infoTemplate = new esri.dijit.PopupTemplate(esri.config.infoTemplate);
                                    thiss.layer = new esri.layers.FeatureLayer(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerDataId, {
                                        id: "ftlWidget",
                                        maxAllowableOffset: thiss.maxOffset(),
                                        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                                        fields: thiss.config.module.widget.service.fields,
                                        outFields: thiss.config.module.widget.service.fields,
                                        displayField: thiss.config.module.widget.service.displayField,
                                        showLabels: thiss.config.module.widget.service.showLabels
                                    });
                                    thiss.layer.setDefinitionExpression(thiss.defaultDefinitionExpression);
                                    thiss.layer.setSelectionSymbol(thiss.config.module.widget.symbols.simpleFillSelectionSymbol);
                                    thiss.map.addLayer(thiss.layer);
                                    com.jtm.helper.Color.picker2('#' + thiss.domWidget + ' #txtBaseColor', thiss.config.module.widget.color.defaultBase);
                                    com.jtm.helper.Color.picker2('#' + thiss.domWidget + ' #txtFromColor', thiss.config.module.widget.color.defaultFrom);
                                    com.jtm.helper.Color.picker2('#' + thiss.domWidget + ' #txtToColor', thiss.config.module.widget.color.defaultTo);
                                    jQuery('#' + thiss.domWidget + " #txtBreakCount").numeric({ decimal: false, negative: false });
                                    jQuery('#' + thiss.domWidget + " #txtBreakCount").val(thiss.config.module.widget.classificationType.classBreaksDef.breakCount);
                                    var territorialRepresentationSelector = '#' + thiss.domWidget + ' #divTerritorialRepresentation';
                                    var fieldSelector = '#' + thiss.domWidget + ' #ddlField';
                                    var variableSelector = '#' + thiss.domWidget + ' #ddlVariable';
                                    var sourceInformationSelector = '#' + thiss.domWidget + ' #ddlSourceInformation';
                                    var periodTypeSelector = '#' + thiss.domWidget + ' #ddlPeriodType';
                                    var yearSelector = '#' + thiss.domWidget + " #ddlYear";
                                    var classificationTypeSelector = '#' + thiss.domWidget + " #ddlClassificationType";
                                    var algorithmSelector = '#' + thiss.domWidget + " #ddlAlgorithm";
                                    var classificationMethodSelector = '#' + thiss.domWidget + " #ddlClassificationMethod";
                                    var dynamicSelector = '#' + thiss.domWidget + " #divDynamic";
                                    com.jtm.helper.DropDownList.setRecursive2({
                                        domWidget: territorialRepresentationSelector,
                                        id: thiss.config.module.widget.level,
                                        url: com.jtm.Server.contextPath + "geometry/territorialrepresentation/searchbyterritorialrepresentation",
                                        isOpen: true,
                                        label: "Rep. territorial:",
                                        callback: function (id) {
                                            thiss.closeData(thiss.dialogData);
                                            jQuery(variableSelector).empty();
                                            jQuery(sourceInformationSelector).empty();
                                            jQuery(periodTypeSelector).empty();
                                            jQuery(yearSelector).empty();
                                            com.jtm.helper.DropDownList.fill2({
                                                url: com.jtm.Server.contextPath + "indicator/variable/searchbyterritorialrepresentation",
                                                ddl: variableSelector,
                                                data: { id: com.jtm.helper.DropDownList.getLastValue(territorialRepresentationSelector) },
                                                callback: function (e) {
                                                    thiss.closeData(thiss.dialogData);
                                                    jQuery(sourceInformationSelector).empty();
                                                    jQuery(periodTypeSelector).empty();
                                                    jQuery(yearSelector).empty();
                                                    com.jtm.helper.DropDownList.fill2({
                                                        url: com.jtm.Server.contextPath + "indicator/data/searchsourceinformationsbytrandvariable",
                                                        ddl: sourceInformationSelector,
                                                        data: {
                                                            territorialRepresentationId: com.jtm.helper.DropDownList.getLastValue(territorialRepresentationSelector),
                                                            variableId: jQuery(this).val()
                                                        },
                                                        callback: function (e) {
                                                            thiss.closeData(thiss.dialogData);
                                                            jQuery(periodTypeSelector).empty();
                                                            jQuery(yearSelector).empty();
                                                            com.jtm.helper.DropDownList.fill2({
                                                                url: com.jtm.Server.contextPath + "indicator/data/searchperiodstypebytrandvariableandsi",
                                                                ddl: periodTypeSelector,
                                                                data: {
                                                                    territorialRepresentationId: com.jtm.helper.DropDownList.getLastValue(territorialRepresentationSelector),
                                                                    variableId: jQuery(variableSelector).val(),
                                                                    sourceInformationId: jQuery(this).val(),
                                                                },
                                                                callback: function (e) {
                                                                    thiss.closeData(thiss.dialogData);
                                                                    jQuery(yearSelector).empty();
                                                                    com.jtm.helper.DropDownList.fill2({
                                                                        url: com.jtm.Server.contextPath + "indicator/data/searchdatesbytrandvariableandsiandpt",
                                                                        ddl: yearSelector,
                                                                        data: {
                                                                            territorialRepresentationId: com.jtm.helper.DropDownList.getLastValue(territorialRepresentationSelector),
                                                                            variableId: jQuery(variableSelector).val(),
                                                                            sourceInformationId: jQuery(sourceInformationSelector).val(),
                                                                            periodTypeId: jQuery(this).val()
                                                                        },
                                                                        callback: function (e) {
                                                                            thiss.closeData(thiss.dialogData);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: fieldSelector,
                                        items: thiss.config.module.widget.fields
                                    });
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: classificationTypeSelector,
                                        items: thiss.config.module.widget.thematicMapTypes,
                                        callback: function (e) {
                                            if (jQuery(this).val() == BaseWidget.CLASSBREAKSDEF)
                                                jQuery('#' + thiss.domWidget + " #divAdvancedOptions").show();
                                            else
                                                jQuery('#' + thiss.domWidget + " #divAdvancedOptions").hide();
                                        }
                                    });
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: algorithmSelector,
                                        items: thiss.config.module.widget.colorRamp.algorithms
                                    });
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: classificationMethodSelector,
                                        items: thiss.config.module.widget.classificationType.classBreaksDef.classificationMethods,
                                        fieldId: 'id',
                                        fieldName: 'id',
                                    });
                                    jQuery("#" + thiss.domWidget + " #btnGenerate").off("click");
                                    jQuery("#" + thiss.domWidget + " #btnGenerate").on("click", function (e) {
                                        thiss.execute();
                                    });
                                };
                                BaseWidget.prototype.onCloseData = function (obj) {
                                    var thiss = this;
                                    var chart = jQuery(obj).highcharts();
                                    if (chart !== undefined && chart !== null) {
                                        chart.destroy();
                                    }
                                    thiss.layer.setRenderer(null);
                                    delete thiss.layer._mode._featureMap;
                                    thiss.layer._mode._featureMap = {};
                                    thiss.layer.clear();
                                    thiss.layer.clearSelection();
                                    thiss.layer.setLabelingInfo([]);
                                    thiss.layer.redraw();
                                    //thiss.layer.setDefinitionExpression(thiss.defaultDefinitionExpression);
                                    _super.prototype.onCloseData.call(this, obj);
                                };
                                BaseWidget.prototype.onMouseClickChartToGraphic = function (e, graphics, index) {
                                    var thiss = this;
                                    var g = null;
                                    var i = 0;
                                    for (i = 0; i < graphics.length; i++) {
                                        g = graphics[i];
                                        if ((g.attributes) && g.attributes[index] == e.currentTarget.id) {
                                            var extent = thiss.toExtent(g.geometry);
                                            thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                            break;
                                        }
                                    }
                                };
                                BaseWidget.prototype.onMouseOverChartToGraphic = function (e, graphics, index) {
                                    var thiss = this;
                                    var g = null;
                                    var graphicClone = null;
                                    var i = 0;
                                    for (i = 0; i < graphics.length; i++) {
                                        g = graphics[i];
                                        if ((g.attributes) && g.attributes[index] == e.currentTarget.id) {
                                            g.setSymbol(thiss.config.module.widget.symbols.simpleFillSelectionSymbol);
                                            break;
                                        }
                                    }
                                };
                                BaseWidget.prototype.onMouseOutChartToGraphic = function (e, graphics) {
                                    var thiss = this;
                                    e.currentTarget.select(false, false);
                                    var i = 0;
                                    for (i = 0; i < graphics.length; i++) {
                                        graphics[i].setSymbol(null);
                                    }
                                };
                                BaseWidget.prototype.onMouseClickGraphicToChart = function (e) {
                                    var thiss = this;
                                    var title = thiss.config.module.widget.service.displayField + ": " + e.graphic.attributes[thiss.config.module.widget.service.displayField];
                                    var content = thiss.getValue('#ddlField') + ": " + e.graphic.attributes[thiss.getValue('#ddlField')];
                                    thiss.map.infoWindow.setTitle(title);
                                    thiss.map.infoWindow.setContent(content);
                                    thiss.map.infoWindow.show(e.screenPoint, thiss.map.getInfoWindowAnchor(e.screenPoint));
                                };
                                BaseWidget.prototype.onMouseOverGraphicToChart = function (e, series, index) {
                                    var thiss = this;
                                    e.graphic.setSymbol(thiss.config.module.widget.symbols.simpleFillSelectionSymbol);
                                    var id = e.graphic.attributes[index];
                                    var i = 0;
                                    for (i = 0; i < series[0].data.length; i++) {
                                        if (series[0].data[i].id == id) {
                                            series[0].data[i].select(true, false);
                                            //series[0].data[i].setState('hover');
                                            break;
                                        }
                                    }
                                };
                                BaseWidget.prototype.onMouseOutGraphicToChart = function (e, series) {
                                    var thiss = this;
                                    e.graphic.setSymbol(null);
                                    var i = 0;
                                    for (i = 0; i < series[0].data.length; i++) {
                                        series[0].data[i].select(false, false);
                                    }
                                };
                                BaseWidget.prototype.cleanControls = function () {
                                    if (this.map.infoWindow.isShowing)
                                        this.map.infoWindow.hide();
                                    if (this.layer !== null)
                                        this.map.removeLayer(this.layer);
                                    this.closeData(this.dialogData);
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            thematicmap.BaseWidget = BaseWidget;
                        })(indicator.thematicmap || (indicator.thematicmap = {}));
                        var thematicmap = indicator.thematicmap;
                    })(widgets.indicator || (widgets.indicator = {}));
                    var indicator = widgets.indicator;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
//http://www.color-hex.com/