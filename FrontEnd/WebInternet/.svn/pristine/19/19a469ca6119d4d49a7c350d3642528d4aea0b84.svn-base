function getObject() {
    return com.jtm.geometry.viewer.widgets.coverage.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (coverage) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.dialogData = null;
                                this.domWidgetData = "divWidgetData";
                                this.layer = null;
                                this.query = function (value, isParent) {
                                    var thiss = this;
                                    thiss.closeData(thiss.dialogData);
                                    if (isParent === true) return;
                                    console.log(isParent);
                                    var definitionExpression = (isParent === true ? thiss.config.module.widget.service.queryFieldParent : thiss.config.module.widget.service.queryField) + " = '" + value + "'";
                                    thiss.setRenderer(definitionExpression);
                                    var query = new esri.tasks.Query();
                                    query.returnGeometry = true;
                                    query.outSpatialReference = thiss.map.spatialReference;
                                    query.outFields = thiss.config.module.widget.service.fields;
                                    query.where = (isParent === true ? thiss.config.module.widget.service.queryFieldParent : thiss.config.module.widget.service.queryField) + " = '" + value + "'";
                                    var task = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
                                    var data = task.execute(query).addCallback(function (response) {
                                        //thiss.layer.setInfoTemplate(thiss.getInfoTemplate());
                                        //thiss.map.infoWindow.resize(500, 480);
                                        var i = 0;
                                        thiss.layer.clear();
                                        var g = null;
                                        for (i = 0; i < response.features.length; i++) {
                                            g = response.features[i];
                                            thiss.setGraphicSymbol(g, false);
                                            var infoTemplate = thiss.getInfoTemplate("${nombre}", g);
                                            g.setInfoTemplate(infoTemplate);
                                            thiss.layer.add(g);
                                            thiss.map.infoWindow.setTitle(g.getTitle());
                                            thiss.map.infoWindow.setContent(g.getContent());
                                            //thiss.map.infoWindow.show(g.geometry.getCentroid());
                                        }
                                        if (g.geometry.type != "point")
                                            point = g.geometry.getCentroid();
                                        thiss.map.infoWindow.show(point);
                                        thiss.map.centerAndZoom(point, 5);
                                        thiss.showData(value);
                                    });
                                };
                                this.addLayer = function (value, isParent) {
                                    var thiss = this;
                                    if (this.map.infoWindow.isShowing)
                                        this.map.infoWindow.hide();
                                    this.layer.clear();
                                    this.layer.clearSelection();
                                    this.layer.refresh();
                                    if (isParent === true) return;
                                    var renderer = new esri.renderer.SimpleRenderer(thiss.config.module.widget.symbols.simpleFillSymbol);
                                    var definitionExpression = (isParent === true ? thiss.config.module.widget.service.queryFieldParent : thiss.config.module.widget.service.queryField) + " = '" + value + "'";
                                    thiss.layer.setDefinitionExpression(definitionExpression);
                                    thiss.layer.setRenderer(renderer);
                                    thiss.setRenderer(definitionExpression);
                                };
                                this.getGraphic = function (code) {
                                    var thiss = this;
                                    jQuery("#" + thiss.domWidgetData).append('Tipo gráfico: <select id="ddlChartType"></select><div id="divChart"></div>');
                                    thiss.fillDropDownList('#' + thiss.domWidgetData + ' #ddlChartType', thiss.config.module.widget.chartTypes);
                                    jQuery('#' + thiss.domWidgetData + ' #ddlChartType').off('change');
                                    jQuery('#' + thiss.domWidgetData + ' #ddlChartType').on('change', function (e) {
                                        getGraphic();
                                    });
                                    jQuery('#' + thiss.domWidgetData + ' #ddlChartType').change();
                                    function getGraphic() {
                                        jQuery.post(com.jtm.Server.contextPath + "enviroment/coverage/graphicbycode", { code: code, type: jQuery('#' + thiss.domWidgetData + ' #ddlChartType').val(), enabled3d: true }, function (data, textStatus) {
                                            data.item.subtitle.text = "Fuente: " + thiss.config.module.widget.informationSource;
                                            jQuery("#" + thiss.domWidgetData + " #divChart").highcharts(data.item);
                                        }, "json");
                                    }
                                };
                                this.getFiles = function (code) {
                                    var thiss = this;
                                    jQuery.post(com.jtm.Server.contextPath + "enviroment/coverage/searchdocumentsbyterritorialrepresentationcode", { code: code }, function (data, textStatus) {
                                        jQuery("#" + thiss.domWidgetData).append('<h4>Documentos</h4><div id="divFiles"></div>');
                                        jQuery("#" + thiss.domWidgetData + " #divFiles").html('Documentos');
                                    }, "json");
                                };
                                this.getInfoTemplate2 = function (title, feature) {
                                    var thiss = this;
                                    //__super.prototype.getInfoTemplate.call(this, title, feature);
                                    var template = new esri.InfoTemplate();
                                    template.setTitle("<b>${nombre}</b>");
                                    template.setContent(getTextContent);
                                    return template;
                                    function getTextContent(g) {
                                        thiss.destroyGraphic();
                                        thiss.getGraphic(g.attributes[thiss.config.module.widget.service.queryField]);
                                        thiss.getFiles(g.attributes[thiss.config.module.widget.service.queryField]);
                                    }
                                };
                                this.setRenderer = function (definitionExpression) {
                                    var thiss = this;
                                    var task = new esri.tasks.GenerateRendererTask(thiss.config.module.widget.service.url + "/" + thiss.config.module.widget.service.layerId);
                                    var colorRamp = new esri.tasks.AlgorithmicColorRamp();
                                    colorRamp.fromColor = dojo.colorFromHex("#998ec3");
                                    colorRamp.toColor = dojo.colorFromHex("#f1a340");
                                    colorRamp.algorithm = "hsv";
                                    var uniqueValueDef = new esri.tasks.UniqueValueDefinition();
                                    uniqueValueDef.attributeField = thiss.config.module.widget.service.queryField;
                                    uniqueValueDef.colorRamp = colorRamp;
                                    var parameters = new esri.tasks.GenerateRendererParameters();
                                    parameters.classificationDefinition = uniqueValueDef;
                                    parameters.where = definitionExpression;
                                    task.execute(parameters, applyRenderer, errorHandler);

                                    function applyRenderer(renderer) {
                                        thiss.layer.setRenderer(renderer);
                                        thiss.layer.refresh();
                                    }

                                    function errorHandler() {
                                        //do something
                                    }
                                };
                                this.showData = function (value) {
                                    console.log('data');
                                    var thiss = this;
                                    thiss.domWidgetData = thiss.getUUID();
                                    thiss.dialogData = jQuery('<div id="' + thiss.domWidgetData + '"></div>').dialog({
                                        title: 'Resultado',
                                        width: 400,
                                        height: jQuery(window).height(),
                                        resizable: false,
                                        closeOnEscape: true,
                                        autoremove: true,
                                        //position: position,
                                        close: function (dialog) {
                                            thiss.onCloseData(this);
                                        }
                                    });
                                    thiss.getGraphic(value);
                                    thiss.getFiles(value);
                                };
                            }
                            Widget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 300 }
                                });
                            };
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.layer = new esri.layers.GraphicsLayer();
                                thiss.map.addLayer(thiss.layer);
                                //jQuery('.contentPane').accordion({ collapsible: true, navigation: true });
                                //thiss.map.infoWindow.on("show", function (e) {
                                //    thiss.destroyGraphic();
                                //});
                                //thiss.map.infoWindow.on("hide", function (e) {
                                //    thiss.destroyGraphic();
                                //});
                                hidedomWidgets();
                                jQuery('#' + thiss.domWidget + ' #fdsWidget').hide();
                                jQuery("input[name=rdbQuery]:radio").unbind();
                                jQuery("input[name=rdbQuery]:radio").on("change", function (e) {
                                    if (jQuery(this).is(":checked") === true) {
                                        switch (jQuery(this).prop("id")) {
                                            case "rdbPoliticalDivision":
                                                setPoliticalDivision();
                                                break;
                                            case "rdbHydrographicBasin":
                                                setHydrographicBasin();
                                                break;
                                            default:
                                                alert("No soportado");
                                                break;
                                        }
                                    }
                                });
                                jQuery("input[name=rdbQuery]:radio").change();
                                function hidedomWidgets() {
                                    var childs = jQuery('#' + thiss.domWidget + ' #fdsForm > div');
                                    jQuery.each(childs, function (i, item) {
                                        jQuery(this).hide();
                                    });
                                }
                                function setPoliticalDivision() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #divPoliticalDivision').show();
                                    com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + "geometry/departament/list", '#' + thiss.domWidget + ' #ddlDepartamentSearch');
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').unbind();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').change(function (e) {
                                        if (jQuery(this).val() === 0)
                                            thiss.query(jQuery(this).val(), true);
                                        else
                                            thiss.query(jQuery(this).val(), false);
                                        com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + 'geometry/province/searchbydepartament', '#' + thiss.domWidget + ' #ddlProvinceSearch', { id: jQuery(this).val() }, 0);
                                        jQuery('#' + thiss.domWidget + ' #ddlProvinceSearch').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlProvinceSearch').bind("change", function (e) {
                                            if (jQuery(this).val() === 0)
                                                thiss.query(jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').val(), true);
                                            else
                                                thiss.query(jQuery(this).val(), false);
                                            com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + 'geometry/district/searchbyprovince', '#' + thiss.domWidget + ' #ddlDistrictSearch', { id: jQuery(this).val() }, 0);
                                            jQuery('#' + thiss.domWidget + ' #ddlDistrictSearch').unbind();
                                            jQuery('#' + thiss.domWidget + ' #ddlDistrictSearch').bind("change", function (e) {
                                                if (jQuery(this).val() === 0)
                                                    thiss.query(jQuery('#' + thiss.domWidget + ' #ddlProvinceSearch').val(), true);
                                                else
                                                    thiss.query(jQuery(this).val(), false);
                                            });
                                        });
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').change();
                                }
                                function setHydrographicBasin() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #divHydrographicBasin').show();
                                    com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + "geometry/hydrographicbasin/list", '#' + thiss.domWidget + ' #ddlHydrographicBasinSearch');
                                    jQuery('#' + thiss.domWidget + ' #ddlHydrographicBasinSearch').change(function (e) {
                                        if (jQuery(this).val() === 0)
                                            thiss.query("DH", true);
                                        else
                                            thiss.query(jQuery(this).val(), false);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlHydrographicBasinSearch').change();
                                }
                            };
                            Widget.prototype.onCloseData = function (obj) {
                                var thiss = this;
                                var chart = jQuery(obj).find("#divChart").highcharts();
                                if (chart !== undefined && chart !== null) {
                                    chart.destroy();
                                }
                                _super.prototype.onCloseData.call(this, obj);
                                thiss.layer.clear();
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    this.map.removeLayer(this.layer);
                                }
                                this.closeData(this.dialogData);
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(coverage.BaseWidget);
                        coverage.Widget = Widget;
                    })(widgets.coverage || (widgets.coverage = {}));
                    var coverage = widgets.coverage;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));