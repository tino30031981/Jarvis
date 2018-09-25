function getObject() {
    return com.jtm.geometry.viewer.widgets.zee.query.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (zee) {
                        (function (query) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                    this.dialogData = null;
                                    this.domWidgetData = "divWidgetData";
                                    this.layer = null;
                                    this.geoprocessor = null;

                                    this.getLargeZones = function (layerId) {
                                        var thiss = this;
                                        thiss.layer.clear();
                                        thiss.closeData(thiss.dialogData);
                                        if (layerId == Widget.DDLVALUEDEFAULT2) return;
                                        var query = {
                                            where: "1=1",
                                            outFields: "ZEE_GRANDE",
                                            returnGeometry: false,
                                            returnDistinctValues: true,
                                            geometryType: "esriGeometryEnvelope",
                                            f: "json"
                                        };
                                        jQuery.post(thiss.config.module.widget.service.url + "/" + layerId + "/query", query, function (data, textStatus) {
                                            fill(data.features);
                                        }, "json");
                                        function fill(data) {
                                            jQuery('#' + thiss.domWidget + ' #ddlLargeZone').html("");
                                            var html = '<option value="' + Widget.DDLVALUEDEFAULT + '">' + Widget.DDLDISPLAYDEFAULT + '</option>';
                                            var items = [];
                                            var i = 0;
                                            for (i = 0; i < data.length; i++) {
                                                if (items.indexOf(data[i].attributes.ZEE_GRANDE) == -1) {
                                                    items.push(data[i].attributes.ZEE_GRANDE);
                                                    html += '<option value="' + data[i].attributes.ZEE_GRANDE + '">' + data[i].attributes.ZEE_GRANDE + '</option>';
                                                }
                                            }
                                            items = [];
                                            jQuery('#' + thiss.domWidget + ' #ddlLargeZone').html(html);
                                        }
                                    };
                                    this.getZones = function (layerId, largeZone) {
                                        var thiss = this;
                                        thiss.layer.clear();
                                        thiss.closeData(thiss.dialogData);
                                        if (layerId == Widget.DDLVALUEDEFAULT2) return;
                                        if (largeZone == Widget.DDLVALUEDEFAULT) return;
                                        var query = {
                                            where: "ZEE_GRANDE='" + largeZone + "'",
                                            outFields: "ZEE_ZONAS",
                                            returnDistinctValues: true,
                                            returnGeometry: false,
                                            geometryType: "esriGeometryEnvelope",
                                            f: "json"
                                        };
                                        jQuery.post(thiss.config.module.widget.service.url + "/" + layerId + "/query", query, function (data, textStatus) {
                                            fill(data.features);
                                        }, "json");
                                        function fill(data) {
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').html("");
                                            var html = '<option value="' + Widget.DDLVALUEDEFAULT + '">' + Widget.DDLDISPLAYDEFAULT + '</option>';
                                            var items = [];
                                            var i = 0;
                                            for (i = 0; i < data.length; i++) {
                                                if (items.indexOf(data[i].attributes.ZEE_ZONAS) == -1) {
                                                    items.push(data[i].attributes.ZEE_ZONAS);
                                                    html += '<option value="' + data[i].attributes.ZEE_ZONAS + '">' + data[i].attributes.ZEE_ZONAS + '</option>';
                                                }
                                            }
                                            items = [];
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').html(html);
                                        }
                                    };
                                    this.getZees = function (layerId, largeZone, zone) {
                                        var thiss = this;
                                        thiss.layer.clear();
                                        thiss.closeData(thiss.dialogData);
                                        if (layerId == Widget.DDLVALUEDEFAULT2) return;
                                        if (largeZone == Widget.DDLVALUEDEFAULT) return;
                                        if (zone == Widget.DDLVALUEDEFAULT) return;
                                        var query = new esri.tasks.Query();
                                        query.returnGeometry = true;
                                        query.outSpatialReference = thiss.map.spatialReference;
                                        query.outFields = ["ZEE", "HECTARES"];
                                        query.where = "ZEE_GRANDE='" + largeZone + "' AND ZEE_ZONAS='" + zone + "'";
                                        var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + layerId);
                                        var data = task.execute(query).addCallback(function (response) {
                                            processData(response.features);
                                        });
                                        function processData(graphics) {
                                            var categories = [];
                                            var data = [];
                                            var i = 0;
                                            for (i = 0; i < graphics.length; i++) {
                                                thiss.setGraphicSymbol(graphics[i], false);
                                                thiss.layer.add(graphics[i]);
                                                categories.push(graphics[i].attributes.ZEE);
                                                data.push(graphics[i].attributes.HECTARES);
                                            }
                                            var extent = esri.graphicsExtent(graphics);
                                            thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                            var series = [{ name: "ZEE", data: data }];
                                            var item = configItem(categories, series, "Has", false);
                                            thiss.showData(item);
                                        }
                                        function configItem(categories, series, measureUnit, enabled3d) {
                                            var item = {
                                                chart: {
                                                    type: 'column',
                                                    options3d: {
                                                        enabled: enabled3d,
                                                        alpha: 15,
                                                        beta: 15,
                                                        depth: 50,
                                                        viewDistance: 25
                                                    }
                                                },
                                                title: {
                                                    text: 'Avance de zonificación ecológica económica'
                                                },
                                                subtitle: {
                                                    text: 'Fuente: Ministerio del ambiente'
                                                },
                                                xAxis: {
                                                    categories: categories,
                                                    crosshair: true
                                                },
                                                yAxis: {
                                                    min: series[0].data.min(),
                                                    max: series[0].data.max(),
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
                                    this.showData = function (data) {
                                        var thiss = this;
                                        jQuery('#' + thiss.domWidget).append('<div id="' + thiss.domWidgetData + '"></div>');
                                        jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).css("width", 12000);
                                        jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).highcharts(data);
                                        thiss.dialogData = jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).dialog({
                                            title: 'Gráfico',
                                            fluid: true,
                                            width: '100%',
                                            resizable: false,
                                            closeOnEscape: true,
                                            maxHeight: 300,
                                            autoOpen: true,
                                            //appendTo: '#' + thiss.domWidget,
                                            position: { my: 'top', at: 'bottom' },
                                            close: function (e, ui) {
                                                thiss.onCloseData(this);
                                            }
                                        });
                                    };
                                }
                                Widget.prototype.onClick = function () {
                                    var thiss = this;
                                    thiss.showView({
                                        dialog: { width: 350 }
                                    });
                                };
                                Widget.prototype.initConfig = function () {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    setInformation(thiss.config.module.widget.service);
                                    jQuery.ajaxSetup({ async: true });
                                    _super.prototype.initConfig.call(this);
                                    function setInformation(service) {
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
                                        var pattern = /\b(ZEE|zee)_(\w|\W)+\b/;
                                        service.departaments = [];
                                        service.departaments.push({ id: Widget.DDLVALUEDEFAULT2, name: Widget.DDLDISPLAYDEFAULT });
                                        var i = 0;
                                        for (i = 0; i < layers.length; i++) {
                                            if (pattern.test(layers[i].name) === true) {
                                                service.departaments.push({ id: layers[i].id, name: layers[i].name });
                                            }
                                        }
                                    }
                                };
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    thiss.layer = new esri.layers.GraphicsLayer();
                                    thiss.map.addLayer(thiss.layer);
                                    thiss.fillDropDownList('#' + thiss.domWidget + " #ddlDepartament", thiss.config.module.widget.service.departaments, false, "id", "name");
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartament').unbind();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartament').change(function (e) {
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').html("");
                                        jQuery('#' + thiss.domWidget + ' #ddlZone').html("");
                                        thiss.getLargeZones(jQuery(this).val());
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').bind("change", function () {
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').html("");
                                            thiss.getZones(jQuery('#' + thiss.domWidget + ' #ddlDepartament').val(), jQuery(this).val());
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').unbind();
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').bind("change", function () {
                                                thiss.getZees(jQuery('#' + thiss.domWidget + ' #ddlDepartament').val(), jQuery('#' + thiss.domWidget + ' #ddlLargeZone').val(), jQuery(this).val());
                                            });
                                        });
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartament').change();
                                };
                                Widget.prototype.onCloseData = function (obj) {
                                    var thiss = this;
                                    var chart = jQuery(this).highcharts();
                                    if (chart !== undefined && chart !== null) {
                                        chart.destroy();
                                    }
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
                        })(zee.query || (zee.query = {}));
                        var query = zee.query;
                    })(widgets.zee || (widgets.zee = {}));
                    var zee = widgets.zee;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));