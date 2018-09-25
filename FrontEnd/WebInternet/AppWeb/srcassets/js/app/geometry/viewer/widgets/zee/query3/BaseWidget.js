(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (zee) {
                        (function (query) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.dialogData = null;
                                    this.domWidgetData = "divWidgetData";
                                    this.layer = null;
                                    this.layerDepartment = null;
                                    this.layerMouseOver = null;
                                    this.layerMouseOut = null;

                                    this.query = function (layerId, where, outField, ddl) {
                                        var thiss = this;
                                        if (layerId == BaseWidget.DDLVALUEDEFAULT2) {
                                            alert("Seleccione el departamento");
                                            return;
                                        }
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
                                        jQuery.post(thiss.config.module.widget.service.url + "/" + layerId + "/query", query, function (data, textStatus) {
                                            if (data.error === undefined)
                                                fill(data.features, data.spatialReference);
                                            else
                                                alert(data.error.message);
                                        }, "json");
                                        function fill(data, spatialReference) {
                                            if (data === undefined || data === null) {
                                                alert("No hay datos");
                                                return;
                                            }
                                            var ddl2 = '#' + thiss.domWidget + ' ' + ddl;
                                            jQuery(ddl2).html("");
                                            jQuery(ddl2).append('<option value="' + BaseWidget.DDLVALUEDEFAULT + '">' + BaseWidget.DDLDISPLAYDEFAULT + '</option>');
                                            var items = [];
                                            var i = 0;
                                            for (i = 0; i < data.length; i++) {
                                                var item = data[i].attributes[outField];
                                                if (item === null || item === "" || item == " ") continue;
                                                if (items.indexOf(item) == -1) {
                                                    items.push(item);
                                                    jQuery(ddl2).append('<option value="' + item + '">' + item + '</option>');
                                                }
                                            }
                                            items = [];
                                        }
                                    };
                                    this.getLargeZones = function (layerId) {
                                        var thiss = this;
                                        thiss.getDepartmentByCode(layerId);
                                        var where = "1=1";
                                        var outField = "ZEE_GRANDE";
                                        var ddl = "#ddlLargeZone";
                                        thiss.query(layerId, where, outField, ddl);
                                    };
                                    this.getZones = function (layerId, largeZone) {
                                        var thiss = this;
                                        var where = "ZEE_GRANDE='" + largeZone + "'";
                                        var outField = "ZEE_ZONAS";
                                        var ddl = "#ddlZone";
                                        thiss.query(layerId, where, outField, ddl);
                                    };
                                    this.getZees = function (layerId, largeZone, zone) {
                                        var thiss = this;
                                        thiss.closeData(thiss.dialogData);
                                        if (layerId == BaseWidget.DDLVALUEDEFAULT2) return;
                                        if (largeZone == BaseWidget.DDLVALUEDEFAULT) return;
                                        if (zone == BaseWidget.DDLVALUEDEFAULT) return;
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
                                            if (thiss.layerMouseOver !== null)
                                                thiss.layerMouseOver.remove();
                                            thiss.layer.on("mouse-over", function (e) {
                                                thiss.map.infoWindow.setContent(e.graphic.getContent());
                                                thiss.map.infoWindow.setTitle(e.graphic.getTitle());
                                                thiss.map.infoWindow.show(e.screenPoint, thiss.map.getInfoWindowAnchor(e.screenPoint));
                                            });
                                            if (thiss.layerMouseOut !== null)
                                                thiss.layerMouseOut.remove();
                                            thiss.layer.on("mouse-out", function (e) {
                                                thiss.map.infoWindow.hide();
                                            });
                                            var zoneName = jQuery("#" + thiss.domWidget + " #ddlZone").getLabel();
                                            var i = 0;
                                            if (thiss.config.module.widget.sum === true)
                                                sum();
                                            else
                                                independent();
                                            var extent = esri.graphicsExtent(graphics);
                                            thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                            var series = [{ name: zoneName, data: data }];
                                            var subtitle = jQuery("#" + thiss.domWidget + " #ddlDepartment").getLabel();
                                            subtitle += "/" + jQuery("#" + thiss.domWidget + " #ddlLargeZone").getLabel();
                                            subtitle += "/" + jQuery("#" + thiss.domWidget + " #ddlZone").getLabel();
                                            subtitle += "<br />Fuente: " + thiss.config.module.widget.sourceInformation;
                                            var item = configItem(thiss.config.module.widget.title, subtitle, categories, series, thiss.config.module.widget.measureUnit, false);
                                            if (jQuery('#' + thiss.domWidget + ' #chkChart').is(":checked"))
                                                thiss.showData(item);
                                            function sum() {
                                                var items = [];
                                                var i = 0;
                                                var item = null;
                                                for (i = 0; i < graphics.length; i++) {
                                                    if (graphics[i].attributes.ZEE === null) continue;
                                                    if (i === 0 || items.exist2("category", graphics[i].attributes.ZEE) === false) {
                                                        item = {};
                                                        item.category = graphics[i].attributes.ZEE;
                                                        item.data = graphics[i].attributes.HECTARES;
                                                        item.geometries = [];
                                                        item.geometries.push(graphics[i].geometry);
                                                        items.push(item);
                                                    }
                                                    else {
                                                        item = items.find2("category", graphics[i].attributes.ZEE);
                                                        item.data += graphics[i].attributes.HECTARES;
                                                        item.geometries.push(graphics[i].geometry);
                                                    }
                                                }
                                                i = 0;
                                                var j = 0;
                                                var symbol = null;
                                                var hexColor = null;
                                                var g = null;
                                                for (i = 0; i < items.length; i++) {
                                                    hexColor = getColor(items, i);
                                                    categories.push(items[i].category);
                                                    data.push({ y: Number(items[i].data.toFixed(thiss.config.module.widget.decimalNumbers)), color: hexColor });
                                                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, esri.Color.fromHex(hexColor), 2), esri.Color.fromHex(hexColor));
                                                    for (j = 0; j < items[i].geometries.length; j++) {
                                                        g = new esri.Graphic(items[i].geometries[j], symbol);
                                                        g.attributes = {};
                                                        g.attributes.unidad = categories[i];
                                                        g.attributes.hectareas = data[i].y;
                                                        var infoTemplate = thiss.getInfoTemplate(zoneName, g);
                                                        g.setInfoTemplate(infoTemplate);
                                                        thiss.layer.add(g);
                                                    }
                                                }
                                                items = [];
                                            }
                                            function independent() {
                                                var i = 0;
                                                for (i = 0; i < graphics.length; i++) {
                                                    thiss.setGraphicSymbol(graphics[i], true);
                                                    var infoTemplate = thiss.getInfoTemplate(zoneName, graphics[i]);
                                                    graphics[i].setInfoTemplate(infoTemplate);
                                                    thiss.layer.add(graphics[i]);
                                                    graphics[i].attributes.unidad = graphics[i].attributes.ZEE;
                                                    graphics[i].attributes.hectareas = graphics[i].attributes.HECTARES;
                                                    categories.push(graphics[i].attributes.ZEE);
                                                    data.push(graphics[i].attributes.HECTARES);
                                                    delete graphics[i].attributes.ZEE;
                                                    delete graphics[i].attributes.HECTARES;
                                                }
                                            }
                                            function getColor(items, index) {
                                                var factor = parseInt(360 / items.length);
                                                var hue = index * factor;
                                                return (com.jtm.helper.Color.colorFromHue(hue));
                                            }
                                        }
                                        function configItem(title, subtitle, categories, series, measureUnit, enabled3d) {
                                            var item = {
                                                chart: {
                                                    type: 'column'
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
                                                plotOptions: {
                                                    series: {
                                                        allowPointSelect: true,
                                                        cursor: 'pointer',
                                                        dataLabels: {
                                                            enabled: true,
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
                                    };
                                    this.showData = function (data) {
                                        var thiss = this;
                                        jQuery('body').append('<div id="' + thiss.domWidgetData + '"></div>');
                                        if (thiss.config.module.widget.sum === true)
                                            jQuery('#' + thiss.domWidgetData).css("width", jQuery(window).width() - 40);
                                        else
                                            jQuery('#' + thiss.domWidgetData).css("width", 12000);
                                        jQuery('#' + thiss.domWidgetData).highcharts(data);

                                        thiss.dialogData = jQuery('#' + thiss.domWidgetData).dialog({
                                            title: 'Resultado',
                                            width: '100%',
                                            height: 300,
                                            resizable: false,
                                            closeOnEscape: true,
                                            autoremove: true,
                                            //position: position,
                                            close: function (dialog) {
                                                thiss.onCloseData(this);
                                            }
                                        });
                                    };
                                    this.getDepartments = function (items) {
                                        var thiss = this;
                                        var query = {
                                            where: "representacionterritorialid ='DP'",
                                            outFields: "codigo,nombre",
                                            returnGeometry: false,
                                            returnDistinctValues: true,
                                            geometryType: "esriGeometryEnvelope",
                                            orderByFields: "nombre ASC",
                                            f: "json"
                                        };
                                        jQuery.post(thiss.config.module.widget.serviceDepartment.url + "/" + thiss.config.module.widget.serviceDepartment.layerId + "/query", query, function (data, textStatus) {
                                            parse(data.features);
                                        }, "json");
                                        function parse(data) {
                                            var i = 0;
                                            var items2 = [];
                                            items2.push({ id: BaseWidget.DDLVALUEDEFAULT2, name: BaseWidget.DDLDISPLAYDEFAULT, code: BaseWidget.DDLVALUEDEFAULT2 });
                                            for (i = 0; i < data.length; i++) {
                                                var name = data[i].attributes.nombre;
                                                if (name === null || name === "" || name === " ") continue;
                                                if (items.exist2("name", name.toUpperCase())) {
                                                    var item = items.find2("name", name.toUpperCase());
                                                    item.code = data[i].attributes.codigo;
                                                    items2.push(item);
                                                }
                                            }
                                            items = items2;
                                            thiss.config.module.widget.service.departaments = items;
                                        }
                                    };
                                    this.getDepartmentByCode = function (code) {
                                        var thiss = this;
                                        thiss.layerDepartment.clear();
                                        var item = thiss.config.module.widget.service.departaments.find2("id", Number(code));
                                        if (item === null) { alert("Seleccione el departamento"); return; }
                                        var query = {
                                            where: "codigo ='" + item.code + "'",
                                            outFields: "codigo,nombre",
                                            returnGeometry: true,
                                            returnDistinctValues: false,
                                            geometryType: "esriGeometryEnvelope",
                                            outSR: thiss.map.spatialReference.wkid,
                                            orderByFields: "nombre ASC",
                                            f: "json"
                                        };
                                        jQuery.post(thiss.config.module.widget.serviceDepartment.url + "/" + thiss.config.module.widget.serviceDepartment.layerId + "/query", query, function (data, textStatus) {
                                            add(data.features, data.spatialReference);
                                        }, "json");
                                        function add(graphics, spatialReference) {
                                            for (i = 0; i < graphics.length; i++) {
                                                graphics[i].geometry = new esri.geometry.Polygon(graphics[i].geometry);
                                                graphics[i].geometry.setSpatialReference(new esri.SpatialReference(spatialReference.latestWkid));
                                                var g = new esri.Graphic(graphics[i].geometry);
                                                thiss.setGraphicSymbol(g, false);
                                                thiss.layerDepartment.add(g);
                                            }
                                            var extent = esri.graphicsExtent(thiss.layerDepartment.graphics);
                                            thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                        }
                                    };
                                }
                                BaseWidget.prototype.onClick = function () {
                                    var thiss = this;
                                    thiss.showView({
                                        dialog: { width: 350 }
                                    });
                                };
                                BaseWidget.prototype.initConfig = function () {
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
                                        service.departaments.push({ id: BaseWidget.DDLVALUEDEFAULT2, name: BaseWidget.DDLDISPLAYDEFAULT });
                                        var i = 0;
                                        for (i = 0; i < layers.length; i++) {
                                            if (pattern.test(layers[i].name) === true) {
                                                service.departaments.push({ id: layers[i].id, name: layers[i].name.replace(/(ZEE|zee)_/, "").toUpperCase() });
                                            }
                                        }
                                        thiss.getDepartments(service.departaments);
                                    }
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    thiss.layerDepartment = new esri.layers.GraphicsLayer();
                                    thiss.map.addLayer(thiss.layerDepartment);
                                    thiss.layer = new esri.layers.GraphicsLayer();
                                    thiss.map.addLayer(thiss.layer);
                                    jQuery('#' + thiss.domWidget + ' #chkChart').prop("checked", !!thiss.config.module.widget.showChart);
                                    fillDepartments();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartment').unbind();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartment').change(function (e) {
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').html("");
                                        jQuery('#' + thiss.domWidget + ' #ddlZone').html("");
                                        thiss.getLargeZones(jQuery(this).val());
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlLargeZone').bind("change", function () {
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').html("");
                                            thiss.getZones(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery(this).val());
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').unbind();
                                            jQuery('#' + thiss.domWidget + ' #ddlZone').bind("change", function () {
                                                thiss.getZees(jQuery('#' + thiss.domWidget + ' #ddlDepartment').val(), jQuery('#' + thiss.domWidget + ' #ddlLargeZone').val(), jQuery(this).val());
                                            });
                                        });
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartament').change();
                                    function fillDepartments() {
                                        jQuery('#' + thiss.domWidget + ' #ddlDepartment').html("");
                                        var items = thiss.config.module.widget.service.departaments;
                                        var i = 0;
                                        for (i = 0; i < items.length; i++) {
                                            jQuery('#' + thiss.domWidget + ' #ddlDepartment').append('<option value="' + items[i].id + '" name="' + items[i].code + '">' + items[i].name + '</option>');
                                        }
                                    }
                                };
                                BaseWidget.prototype.onCloseData = function (obj) {
                                    var thiss = this;
                                    var chart = jQuery(obj).highcharts();
                                    if (chart !== undefined && chart !== null) {
                                        chart.destroy();
                                    }
                                    thiss.layer.clear();
                                    _super.prototype.onCloseData.call(this, obj);
                                };
                                BaseWidget.prototype.cleanControls = function () {
                                    if (this.map.infoWindow.isShowing)
                                        this.map.infoWindow.hide();
                                    if (this.layer !== null)
                                        this.map.removeLayer(this.layer);
                                    if (this.layerDepartment !== null)
                                        this.map.removeLayer(this.layerDepartment);
                                    this.closeData(this.dialogData);
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            query.BaseWidget = BaseWidget;
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