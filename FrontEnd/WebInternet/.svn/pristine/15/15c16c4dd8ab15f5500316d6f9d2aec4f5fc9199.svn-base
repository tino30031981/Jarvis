function getObject() {
    return com.jtm.geometry.viewer.widgets.indicator.query.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (indicator) {
                        (function (query) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                    this._oid = "OBJECTID";
                                    this._patternParameters = /\b(\w|\W)*\d{4}\b/;
                                    this.dialogData = null;
                                    this.domWidgetData = "divIndicatorWidgetData";
                                    this.layer = null;
                                    this.excludeFields = ["SHAPE", "SHAPE_LENGTH", "SHAPE_AREA"];

                                    this.processLayer = function (id) {
                                        var thiss = this;
                                        thiss.displayName = null;
                                        thiss.closeData(thiss.dialogData);
                                        var table = '#' + thiss.domWidget + ' #tblResult';
                                        jQuery(table).html("");
                                        thiss.layer.clear();
                                        if (id == Widget.DDLVALUEDEFAULT2) return;
                                        var outFields = [];
                                        getFields();
                                        addLayer();
                                        function getFields() {
                                            jQuery.ajaxSetup({ async: false });
                                            jQuery.getJSON(thiss.config.module.widget.service.url + "/" + id + "/?f=json", function (data, textStatus) {
                                                fill(data.fields);
                                            });
                                            jQuery.ajaxSetup({ async: true });
                                            function fill(data) {
                                                var i = 0;
                                                for (i = 0; i < data.length; i++) {
                                                    if (thiss._patternParameters.test(data[i].name) === false)
                                                        outFields.push(data[i].name);
                                                }
                                            }
                                        }
                                        function addLayer() {
                                            var query = new esri.tasks.Widget.execute();
                                            query.returnGeometry = true;
                                            query.outSpatialReference = thiss.map.spatialReference;
                                            query.outFields = outFields;
                                            query.where = "1=1";
                                            var task = new esri.tasks.WidgetTask(thiss.config.module.widget.service.url + "/" + id);
                                            var data = task.execute(query).addCallback(function (response) {
                                                processData(response);
                                            });
                                            function processData(data) {
                                                var infoTemplate = thiss.parseInfoTemplate(data.fields, data.displayFieldName, false);
                                                infoTemplate = thiss.parseInfoTemplate(
                                                    {
                                                        fields: data.fields,
                                                        title: data.displayFieldName,
                                                        useCustomInfoTemplate: false
                                                    });
                                                thiss.layer.setInfoTemplate(infoTemplate);
                                                thiss.setDataTable(data, thiss.layer, '#' + thiss.domWidget + ' #tblResult', thiss._oid, thiss.excludeFields, true);
                                            }
                                        }
                                    };
                                    this.getFields = function (layerId, id) {
                                        var thiss = this;
                                        thiss.closeData(thiss.dialogData);
                                        var outFields = [];
                                        addDom();
                                        if (layerId == Widget.DDLVALUEDEFAULT2) return;
                                        jQuery.ajaxSetup({ async: false });
                                        jQuery.getJSON(thiss.config.module.widget.service.url + "/" + layerId + "/?f=json", function (data, textStatus) {
                                            fill(data.fields);
                                        });
                                        jQuery.ajaxSetup({ async: true });
                                        function fill(data) {
                                            jQuery('#' + thiss.domWidgetData + ' #divParameters').html("");
                                            jQuery('#' + thiss.domWidgetData + ' #divYears').html("");
                                            var htmlParameters = '';
                                            var htmlYears = '';
                                            var itemsYear = [];
                                            var itemsParameter = [];
                                            var itemYear = 0;
                                            var itemParameter = '';
                                            var i = 0;
                                            for (i = 0; i < data.length; i++) {
                                                if (thiss._patternParameters.test(data[i].name) === true) {
                                                    itemParameter = data[i].name.substring(0, data[i].name.length - 4);
                                                    itemYear = data[i].name.substring(data[i].name.length - 4);
                                                    if (itemsParameter.indexOf(itemParameter) == -1) {
                                                        itemsParameter.push(itemParameter);
                                                        htmlParameters += '<input type="checkbox" id="chk' + itemParameter + '" value="' + itemParameter + '" checked="checked" />' + itemParameter + '<br />';
                                                    }
                                                    if (itemsYear.indexOf(itemYear) == -1) {
                                                        itemsYear.push(itemYear);
                                                        htmlYears += '<input type="checkbox" id="chk' + itemYear + '" value="' + itemYear + '" checked="checked" />' + itemYear + '<br />';
                                                    }
                                                }
                                                else
                                                    outFields.push(data[i].name);
                                            }
                                            jQuery('#' + thiss.domWidgetData + ' #divParameters').html(htmlParameters);
                                            jQuery('#' + thiss.domWidgetData + ' #divYears').html(htmlYears);
                                            jQuery('#' + thiss.domWidgetData + ' #btnSearch').click();
                                        }
                                        function addDom() {
                                            thiss.domWidgetData = thiss.getUUID();
                                            jQuery('body').append('<div id="' + thiss.domWidgetData + '"><table class="table"><tbody><tr><td><div id="divParameters" class="scroll100"></div></td><td><div id="divYears" class="scroll100"></div></td></tr></tbody></table><form class="form-inline"><div class="form-group"><label for="ddlChartType">Tipo gráfico</label><select class="form-control" id="ddlChartType"></select></div><button type="button" id="btnSearch" class="btn btn-default" title="Buscar datos"><i class="glyphicon glyphicon-search"></i></button></form><div id="divChart"></div><div class="scroll200"><table id="tblResultData" class="table table-bordered"></table></div></div>');
                                            com.jtm.helper.DropDownList.fillLocal({
                                                ddl: '#' + thiss.domWidgetData + " #ddlChartType",
                                                items: thiss.config.module.widget.chartTypes
                                            });
                                            jQuery('#' + thiss.domWidgetData + ' #btnSearch').off("click");
                                            jQuery('#' + thiss.domWidgetData + ' #btnSearch').on("click", function (e) {
                                                buildFields();
                                            });
                                            jQuery('#' + thiss.domWidgetData + ' #ddlChartType').off('change');
                                            jQuery('#' + thiss.domWidgetData + ' #ddlChartType').on('change', function (e) {
                                                buildFields();
                                            });
                                            thiss.showData();
                                            function buildFields() {
                                                thiss.clearData(jQuery('#' + thiss.domWidgetData));
                                                var chkParameters = jQuery('#' + thiss.domWidgetData + ' #divParameters input:checked');
                                                var chkYears = jQuery('#' + thiss.domWidgetData + ' #divYears input:checked');
                                                if (chkParameters.length === 0) {
                                                    alert("Seleccione un parámetro");
                                                    return;
                                                }
                                                if (chkYears.length === 0) {
                                                    alert("Seleccione los años");
                                                    return;
                                                }
                                                var outFields2 = [];
                                                var i = 0;
                                                var j = 0;
                                                for (i = 0; i < chkParameters.length; i++)
                                                    for (j = 0; j < chkYears.length; j++)
                                                        outFields2.push(jQuery(chkParameters[i]).val() + jQuery(chkYears[j]).val());
                                                var outFields3 = outFields.concat(outFields2);
                                                thiss.getData(layerId, id, outFields3);
                                            }
                                        }
                                    };
                                    this.getData = function (layerId, id, outFields) {
                                        var thiss = this;
                                        var query = new esri.tasks.Widget.execute();
                                        query.returnGeometry = true;
                                        query.outSpatialReference = thiss.map.spatialReference;
                                        query.outFields = outFields;
                                        query.where = thiss._oid + "=" + id;
                                        var task = new esri.tasks.WidgetTask(thiss.config.module.widget.service.url + "/" + layerId);
                                        var data = task.execute(query).addCallback(function (response) {
                                            processData(response);
                                        });
                                        function processData(data) {
                                            var itemsYear = [];
                                            var itemsParameter = [];
                                            parseParametersAndYears(data.fields);
                                            var subtitle = "";
                                            var measureUnit = "";
                                            var canDownload = false;
                                            var series = [];
                                            var i = 0;
                                            var j = 0;
                                            var values = [];
                                            var values2 = [];
                                            var value = 0;
                                            for (i = 0; i < itemsParameter.length; i++) {
                                                values = [];
                                                for (j = 0; j < itemsYear.length; j++) {
                                                    value = data.features[0].attributes[itemsParameter[i] + itemsYear[j]];
                                                    values.push(Number(value));
                                                    values2.push(Number(value));
                                                }
                                                series.push({ name: itemsParameter[i], data: values });
                                                subtitle = "Fuente: " + data.features[0].attributes.fuente;
                                                measureUnit = data.features[0].attributes.unidad;
                                                canDownload = data.features[0].attributes.descarga == "NO" ? false : true;
                                            }
                                            var title = "Indicador: " + jQuery('#' + thiss.domWidget + ' #ddlIndicator').getLabel() + " (" + getTitle() + ")";

                                            var min = values2.min();
                                            var max = values2.max();
                                            var chartType = jQuery('#' + thiss.domWidgetData + ' #ddlChartType').val();
                                            var item = configItem(chartType, title, subtitle, itemsYear, series, min, max, measureUnit, true);
                                            jQuery('#' + thiss.domWidgetData + ' #divChart').highcharts(item);
                                            setTable(canDownload);
                                            function parseParametersAndYears(items) {
                                                var itemYear = 0;
                                                var itemParameter = '';
                                                for (i = 0; i < items.length; i++) {
                                                    if (thiss._patternParameters.test(items[i].name) === true) {
                                                        itemParameter = items[i].name.substring(0, items[i].name.length - 4);
                                                        itemYear = items[i].name.substring(items[i].name.length - 4);
                                                        if (itemsParameter.indexOf(itemParameter) == -1) {
                                                            itemsParameter.push(itemParameter);
                                                        }
                                                        if (itemsYear.indexOf(itemYear) == -1) {
                                                            itemsYear.push(itemYear);
                                                        }
                                                    }
                                                }
                                                //itemYear.sort(function (a, b) {
                                                //    return a - b;
                                                //});
                                            }
                                            function getTitle() {
                                                return data.displayFieldName + ": " + data.features[0].attributes[data.displayFieldName];
                                            }
                                            function setTable(canDowload) {
                                                setCaption();
                                                setHeader(itemsYear);
                                                setBody(series);
                                                if (canDowload === true)
                                                    download();
                                                function setCaption() {
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData').append('<caption></caption>');
                                                    var html = title + '<br />' + subtitle;
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData caption').html(html);
                                                }
                                                function setHeader(items) {
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData').append('<thead></thead>');
                                                    var html = '<tr>';
                                                    html += '<th>&nbsp;</th>';
                                                    var i = 0;
                                                    for (i = 0; i < items.length; i++) {
                                                        html += '<th>' + items[i] + '</th>';
                                                    }
                                                    html += '<tr>';
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData thead').html(html);
                                                }
                                                function setBody(items) {
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData').append('<tbody></tbody>');
                                                    var html = '';
                                                    var i = 0;
                                                    var j = 0;
                                                    for (i = 0; i < items.length; i++) {
                                                        html += '<tr>';
                                                        html += '<td>' + items[i].name + '</td>';
                                                        for (j = 0; j < items[i].data.length; j++) {
                                                            html += '<td>' + items[i].data[j] + '</td>';
                                                        }
                                                        html += '</tr>';
                                                    }
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData tbody').html(html);
                                                }
                                                function setFooter() {
                                                }
                                                function download() {
                                                    jQuery('#' + thiss.domWidgetData + ' #btnDownload').remove();
                                                    if (series.length === 0) return;
                                                    jQuery('#' + thiss.domWidgetData + ' #tblResultData').before('<button type="button" id="btnDownload"  class="btn btn-default"><i class="glyphicon glyphicon-download"></i>Descargar datos</button>');
                                                    jQuery('#' + thiss.domWidgetData + ' #btnDownload').off("click");
                                                    jQuery('#' + thiss.domWidgetData + ' #btnDownload').on("click", function (e) {
                                                        com.jtm.helper.Table.toSpreadSheet(jQuery('#' + thiss.domWidgetData + ' #tblResultData'), title, title);
                                                    });
                                                }
                                            }
                                        }
                                        function configItem(chartType, title, subtitle, categories, series, min, max, measureUnit, enabled3d) {
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
                                                credits: { enabled: false },
                                                exporting: { enabled: true },
                                                title: {
                                                    text: title
                                                },
                                                subtitle: {
                                                    text: subtitle
                                                },
                                                xAxis: {
                                                    categories: categories,
                                                    crosshair: true
                                                },
                                                yAxis: {
                                                    min: min,
                                                    max: max,
                                                    title: {
                                                        text: measureUnit
                                                    }
                                                },
                                                tooltip: {
                                                    headerFormat: '<span style="font-size:10px">{point.key}</span>',
                                                    pointFormat: '<div>{series.name}:' +
                                                    '<b>{point.y:.1f} ' + measureUnit + '</b></div>',
                                                    footerFormat: '',
                                                    shared: true,
                                                    useHTML: true
                                                },
                                                plotOptions: {
                                                    column: {
                                                        pointPadding: 0.2,
                                                        borderWidth: 0
                                                    }
                                                },
                                                series: series
                                            };
                                            return item;
                                        }
                                    };
                                    this.showData = function () {
                                        var thiss = this;
                                        thiss.dialogData = jQuery('#' + thiss.domWidgetData).dialog({
                                            title: 'Resultado',
                                            width: 400,
                                            height: jQuery(window).height() - 20,
                                            resizable: false,
                                            closeOnEscape: true,
                                            position: [10, 10],
                                            close: function (e, ui) {
                                                thiss.onCloseData(this);
                                            }
                                        });
                                    };
                                    this.clearData = function (obj) {
                                        var thiss = this;
                                        var chart = jQuery(obj).find("#divChart").highcharts();
                                        if (chart !== undefined && chart !== null) {
                                            chart.destroy();
                                        }
                                        jQuery(obj).find("#tblResultData").html("");
                                    };
                                }
                                Widget.prototype.onClick = function () {
                                    var thiss = this;
                                    thiss.showView({
                                        dialog: { width: 400 }
                                    });
                                };
                                Widget.prototype.initConfig = function () {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    parseService(thiss.config.module.widget.service);
                                    jQuery.ajaxSetup({ async: true });
                                    _super.prototype.initConfig.call(this);
                                    function parseService(service) {
                                        jQuery.getJSON(service.url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                            if (data.error !== undefined) {
                                                service.exist = false;
                                            }
                                            else {
                                                if (data === null) return;
                                                service.definition = data;
                                                parseLayers(service, data.layers);
                                            }
                                        }).fail(function (data, textStatus, jqXHR) {
                                            service.exist = false;
                                        });
                                    }
                                    function parseLayers(service, layers) {
                                        var pattern = /\b(\w|\W)+\b/;
                                        service.indicators = [];
                                        service.indicators.push({ id: Widget.DDLVALUEDEFAULT2, name: Widget.DDLDISPLAYDEFAULT });
                                        var i = 0;
                                        for (i = 0; i < layers.length; i++) {
                                            if (pattern.test(layers[i].name) === true) {
                                                service.indicators.push({ id: layers[i].id, name: layers[i].name });
                                            }
                                        }
                                    }
                                };
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    thiss.layer = new esri.layers.GraphicsLayer();
                                    thiss.map.addLayer(thiss.layer);
                                    thiss.fillDropDownList('#' + thiss.domWidget + " #ddlIndicator", thiss.config.module.widget.service.indicators, false, "id", "name");
                                    jQuery('#' + thiss.domWidget + ' #ddlIndicator').unbind();
                                    jQuery('#' + thiss.domWidget + ' #ddlIndicator').change(function (e) {
                                        thiss.processLayer(jQuery(this).val());
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlIndicator').change();
                                    function setDefaultValue(obj) {
                                        jQuery(obj).nextAll('select').val(0);
                                    }
                                };
                                Widget.prototype.onMouseDoubleClickElementToGraphic = function (element, graphics, index) {
                                    var thiss = this;
                                    _super.prototype.onMouseDoubleClickElementToGraphic.call(this, element, graphics, index);
                                    thiss.getFields(jQuery('#' + thiss.domWidget + ' #ddlIndicator').val(), jQuery(element).prop("id"));
                                };
                                Widget.prototype.onCloseData = function (obj) {
                                    var thiss = this;
                                    this.clearData(obj);
                                    _super.prototype.onCloseData.call(this, obj);
                                };
                                Widget.prototype.cleanControls = function () {
                                    if (this.map.infoWindow.isShowing)
                                        this.map.infoWindow.hide();
                                    if (this.layer !== null)
                                        this.map.removeLayer(this.layer);
                                    this.closeData(this.dialogData);
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(query.BaseWidget);
                            query.Widget = Widget;
                        })(indicator.query || (indicator.query = {}));
                        var query = indicator.query;
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