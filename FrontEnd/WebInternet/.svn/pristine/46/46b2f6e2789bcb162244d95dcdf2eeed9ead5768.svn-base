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

                                    this.query = function (where, outField, ddl) {
                                        var thiss = this;
                                        thiss.layer.clear();
                                        thiss.closeData(thiss.dialogData);
                                        var query = {
                                            where: where,
                                            outFields: outField,
                                            returnGeometry: false,
                                            returnDistinctValues: true,
                                            geometryType: "esriGeometryEnvelope",
                                            orderByFields: outField + " ASC",
                                            f: "json"
                                        };
                                        jQuery.post(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId + "/query", query, function (data, textStatus) {
                                            fill(data.features);
                                        }, "json");
                                        function fill(data) {
                                            jQuery('#' + thiss.domWidget + ' ' + ddl).html("");
                                            var html = '<option value="' + Widget.DDLVALUEDEFAULT + '">' + Widget.DDLDISPLAYDEFAULT + '</option>';
                                            var i = 0;
                                            for (i = 0; i < data.length; i++) {
                                                var item = data[i].attributes[outField];
                                                if (item === null || item === "" || item == " ") continue;
                                                html += '<option value="' + item + '">' + item + '</option>';
                                            }
                                            jQuery('#' + thiss.domWidget + ' ' + ddl).html(html);
                                        }
                                    };
                                    this.getDepartments = function () {
                                        var thiss = this;
                                        var where = "1=1";
                                        var outField = "departamen";
                                        var ddl = "#ddlDepartment";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getProvincesByDepartament = function (nameDepartment) {
                                        var thiss = this;
                                        var where = "departamen='" + nameDepartment + "'";
                                        var outField = "provincia";
                                        var ddl = "#ddlProvince";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getDistrictsByProvince = function (nameDepartment, nameProvince) {
                                        var thiss = this;
                                        var where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "'";
                                        var outField = "distrito";
                                        var ddl = "#ddlDistrict";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getLargeZonesByDistrict = function (nameDepartment, nameProvince, nameDistrict) {
                                        var thiss = this;
                                        var where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "' AND distrito='" + nameDistrict + "'";
                                        var outField = "zee_grande";
                                        var ddl = "#ddlLargeZone";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getLargeZonesByProvince = function (nameDepartment, nameProvince) {
                                        var thiss = this;
                                        var where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "'";
                                        var outField = "zee_grande";
                                        var ddl = "#ddlLargeZone";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getZonesByLargeZone = function (nameDepartment, nameProvince, nameLargeZone) {
                                        var thiss = this;
                                        var where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "' AND zee_grande='" + nameLargeZone + "'";
                                        var outField = "zee_zonas";
                                        var ddl = "#ddlZone";
                                        thiss.query(where, outField, ddl);
                                    };
                                    this.getZeesByZone = function (nameDepartment, nameProvince, nameLargeZone, nameZone) {
                                        var thiss = this;
                                        thiss.layer.clear();
                                        thiss.closeData(thiss.dialogData);
                                        if (nameDepartment == Widget.DDLVALUEDEFAULT) return;
                                        if (nameProvince == Widget.DDLVALUEDEFAULT) return;
                                        //if (nameDistrict == Widget.DDLVALUEDEFAULT) return;
                                        if (nameLargeZone == Widget.DDLVALUEDEFAULT) return;
                                        if (nameZone == Widget.DDLVALUEDEFAULT) return;
                                        var query = new esri.tasks.Query();
                                        query.returnGeometry = true;
                                        query.outSpatialReference = thiss.map.spatialReference;
                                        query.outFields = ["zee", "hecterea"];
                                        query.orderByFields = ["zee ASC"];
                                        //query.where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "' AND distrito='" + nameDistrict + "' AND ZEE_GRANDE='" + nameLargeZone + "' AND ZEE_ZONAS='" + nameZone + "'";
                                        query.where = "departamen='" + nameDepartment + "' AND provincia='" + nameProvince + "' AND ZEE_GRANDE='" + nameLargeZone + "' AND ZEE_ZONAS='" + nameZone + "'";
                                        var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
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
                                                categories.push(graphics[i].attributes.zee);
                                                data.push(graphics[i].attributes.hecterea);
                                            }
                                            var extent = esri.graphicsExtent(graphics);
                                            thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                            var series = [{ name: "ZEE", data: data }];
                                            var item = configItem(categories, series, "Has", true);
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
                                        //jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).css("width", 12000);
                                        jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).highcharts(data);
                                        thiss.dialogData = jQuery('#' + thiss.domWidget + ' #' + thiss.domWidgetData).dialog({
                                            title: 'Gráfico',
                                            fluid: true,
                                            width: jQuery(window).width(),
                                            resizable: false,
                                            closeOnEscape: true,
                                            maxHeight: 250,
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
                                            }
                                        }).fail(function (data, textStatus, jqXHR) {
                                            service.exist = false;
                                        });
                                    }
                                    _super.prototype.initConfig.call(this);
                                };
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    thiss.layer = new esri.layers.GraphicsLayer();
                                    thiss.map.addLayer(thiss.layer);
                                    thiss.getDepartments();
                                    queryByProvince();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartament').change();
                                    function queryByDistrict() {
                                        jQuery('#' + thiss.domWidget + ' #ddlDepartment').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlDepartment').change(function (e) {
                                            setDefaultValue(this);
                                            thiss.getProvincesByDepartament(jQuery(this).val());
                                            jQuery('#' + thiss.domWidget + ' #ddlProvince').unbind();
                                            jQuery('#' + thiss.domWidget + ' #ddlProvince').bind("change", function () {
                                                setDefaultValue(this);
                                                thiss.getDistrictsByProvince(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery(this).val());
                                                jQuery('#' + thiss.domWidget + ' #ddlDistrict').unbind();
                                                jQuery('#' + thiss.domWidget + ' #ddlDistrict').bind("change", function () {
                                                    setDefaultValue(this);
                                                    thiss.getLargeZonesByDistrict(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlProvince').val(), jQuery(this).val());
                                                    jQuery('#' + thiss.domWidget + ' #ddlLargeZone').unbind();
                                                    jQuery('#' + thiss.domWidget + ' #ddlLargeZone').bind("change", function () {
                                                        setDefaultValue(this);
                                                        thiss.getZonesByLargeZone(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlProvince').val(), jQuery('#' + thiss.domWidget + ' #ddlDistrict').val(), jQuery(this).val());
                                                        jQuery('#' + thiss.domWidget + ' #ddlZone').unbind();
                                                        jQuery('#' + thiss.domWidget + ' #ddlZone').bind("change", function () {
                                                            thiss.getZeesByZone(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlProvince').val(), jQuery('#' + thiss.domWidget + ' #ddlDistrict').val(), jQuery('#' + thiss.domWidget + ' #ddlLargeZone').val(), jQuery(this).val());
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    function queryByProvince() {
                                        jQuery('#' + thiss.domWidget + ' #ddlDepartment').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlDepartment').change(function (e) {
                                            setDefaultValue(this);
                                            thiss.getProvincesByDepartament(jQuery(this).val());
                                            jQuery('#' + thiss.domWidget + ' #ddlProvince').unbind();
                                            jQuery('#' + thiss.domWidget + ' #ddlProvince').bind("change", function () {
                                                setDefaultValue(this);
                                                //thiss.getDistrictsByProvince(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery(this).val());
                                                //jQuery('#' + thiss.domWidget + ' #ddlDistrict').unbind();
                                                //jQuery('#' + thiss.domWidget + ' #ddlDistrict').bind("change", function () {
                                                //    setDefaultValue(this);
                                                thiss.getLargeZonesByProvince(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery(this).val());
                                                jQuery('#' + thiss.domWidget + ' #ddlLargeZone').unbind();
                                                jQuery('#' + thiss.domWidget + ' #ddlLargeZone').bind("change", function () {
                                                    setDefaultValue(this);
                                                    thiss.getZonesByLargeZone(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlProvince').val(), jQuery(this).val());
                                                    jQuery('#' + thiss.domWidget + ' #ddlZone').unbind();
                                                    jQuery('#' + thiss.domWidget + ' #ddlZone').bind("change", function () {
                                                        thiss.getZeesByZone(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlProvince').val(), jQuery('#' + thiss.domWidget + ' #ddlLargeZone').val(), jQuery(this).val());
                                                    });
                                                    //});
                                                });
                                            });
                                        });
                                    }
                                    function setDefaultValue(obj) {
                                        jQuery(obj).nextAll('select').val(0);
                                    }
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