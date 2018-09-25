function getObject() {
    return com.jtm.geometry.viewer.widgets.print.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (print) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.buildTemplates = function () {
                                    thiss.config.module.widget.papers = [];
                                    parsePapers();
                                    thiss.config.module.widget.templates = [];
                                    var i, j = 0;
                                    var maxScale = 0;
                                    for (i = 0; i < thiss.config.module.widget.scales.length; i++) {
                                        if (i > 0) j = 1;
                                        maxScale = (i == thiss.config.module.widget.scales.length - 1) ? Number.MAX_VALUE : thiss.config.module.widget.scales[i + 1];
                                        var verticals = [], horizontals = [];
                                        var k = 0;
                                        for (k = 0; k < thiss.config.module.widget.papers.length; k++) {
                                            horizontals.push(thiss.config.module.widget.papers[k].id.toUpperCase() + "_" + Widget.HORIZONTAL + "_" + (i + 1));
                                            verticals.push(thiss.config.module.widget.papers[k].id.toUpperCase() + "_" + Widget.VERTICAL + "_" + (i + 1));
                                        }
                                        thiss.config.module.widget.templates.push({ minScale: thiss.config.module.widget.scales[i] + j, maxScale: maxScale, verticals: verticals, horizontals: horizontals });
                                    }
                                    function parsePapers() {
                                        var i = 0;
                                        thiss.config.module.widget.papers.push({ id: Widget.DDLVALUEDEFAULT2, name: Widget.DDLDISPLAYDEFAULT });
                                        for (i = 0; i < thiss.config.module.widget.layouts.length; i++) {
                                            var index = thiss.config.module.widget.layouts[i].indexOf("_");
                                            if (index == -1) continue;
                                            var paper = thiss.config.module.widget.layouts[i].substring(0, index);
                                            if (paper == Widget.PREFFIXDEFAULT) return;
                                            if (thiss.config.module.widget.papers.find2("id", paper) === null)
                                                thiss.config.module.widget.papers.push({ id: paper, name: paper });
                                        }
                                    }
                                };
                            }
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                //jQuery.ajaxSetup({ async: false });
                                jQuery.getJSON(thiss.config.module.widget.service.url + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                    parse(data);
                                });
                                //jQuery.ajaxSetup({ async: true });
                                _super.prototype.initConfig.call(this);
                                function parse(data) {
                                    if (data === undefined || data === null) return;
                                    thiss.config.module.widget.layouts = data.parameters.find2("name", "Layout_Template").choiceList;
                                    thiss.config.module.widget.formats = data.parameters.find2("name", "Format").choiceList;
                                    thiss.config.module.widget.scales = thiss.scales;
                                    thiss.config.module.widget.currentTemplate = Widget.DEFAULTEMPLATE;
                                    delete thiss.scales;
                                    thiss.buildTemplates();
                                }
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                this.$txtScale.val(thiss.map.getScale());
                                this.$txtNbrDpi.closest('.form-group').remove();
                                thiss.map.on("extent-change", function (e) {
                                    thiss.$txtScale.val(thiss.map.getScale());
                                    thiss.changePaper();
                                });
                            };
                            Widget.prototype.printer = function () {
                                var thiss = this;
                                var template = new esri.tasks.WidgetTemplate();
                                template.exportOptions = {
                                    width: thiss.map.width,
                                    height: thiss.map.height,
                                    dpi: 96
                                };
                                template.layoutOptions = {
                                    titleText: this.$txtTitle.val(),
                                    authorText: this.$txtAuthor.val(),
                                    copyrightText: thiss.config.module.widget.copyright.defaultValue,
                                    scalebarUnit: this.$ddlScaleBarUnit.val(),
                                    legendLayers: thiss.getLegends(),
                                    //customTextElements: []
                                    customTextElements: [{ elmSrid: this.$ddlSpatialReference.getLabel() }]
                                };
                                template.format = this.$ddlFormat.val();
                                template.layout = thiss.config.module.widget.currentTemplate;
                                template.preserveScale = true;
                                template.showAttribution = true;
                                template.outScale = this.$chkScale.is(":checked") ? this.$txtScale.val() : this.$txtRecommendedScale.val();
                                var parameters = new esri.tasks.WidgetParameters();
                                parameters.map = thiss.map;
                                parameters.template = template;
                                parameters.outSpatialReference = new esri.SpatialReference({ wkid: this.$ddlSpatialReference.val() });
                                parameters.extraParameters = {
                                };
                                var task = new esri.tasks.PrintTask(thiss.config.module.widget.service.url);
                                task.execute(parameters, function (data) {
                                    if (data === null || data.url === null) { alert("El servidor no respondió adecuadamente"); return; }
                                    window.open(data.url, '_blank');
                                }, function (data) {
                                    alert(data.error.message);
                                });
                            };
                            Widget.prototype.changePaper = function () {
                                thiss.config.module.widget.currentTemplate = Widget.DEFAULTEMPLATE;
                                var paper = thiss.$ddlPaper.val();
                                var orientation = this.$rdbHorizontal.is(":checked") ? Widget.HORIZONTAL : Widget.VERTICAL;
                                if (paper === null || paper == Widget.DDLVALUEDEFAULT2) return;
                                if (thiss.map.extent === null) return;
                                var factor = 0;
                                switch (paper) {
                                    case Widget.PAPERS.A3:
                                        factor = 15;
                                        break;
                                    case Widget.PAPERS.A4:
                                        factor = 22;
                                        break;
                                    default:
                                        factor = 0;
                                }
                                var scale = Math.round((thiss.map.extent.getHeight() * 100) / factor, 0);
                                scale = this.customScale(scale);
                                thiss.$txtRecommendedScale.val(scale);
                                var i = 0;
                                for (i = 0; i < thiss.config.module.widget.templates.length; i++) {
                                    if ((thiss.config.module.widget.templates[i].minScale <= scale && scale <= thiss.config.module.widget.templates[i].maxScale) === true) {
                                        thiss.config.module.widget.currentTemplate = paper + "_" + orientation + "_" + (i + 1);
                                        break;
                                    }
                                }
                            };
                            Widget.prototype.getLegends = function () {
                                var thiss = this;
                                var legends = Array();
                                var layerIds = thiss.map.layerIds;//
                                var graphicsLayerIds = thiss.map.graphicsLayerIds;
                                var basemapLayerIds = thiss.map.basemapLayerIds;
                                var layer = null;
                                var i = 0;
                                for (i = 0; i < layerIds.length; i++) {
                                    if (basemapLayerIds.indexOf(layerIds[i]) > -1) continue;
                                    layer = thiss.map.getLayer(layerIds[i]);
                                    var layerLegend = null;
                                    var visibleLayers = [];
                                    if (layer !== null && layer.visible === true) {
                                        if (layer instanceof esri.layers.ArcGISTiledMapServiceLayer) {
                                            //if (layer.maxScale == 0 || layer.minScale == 0)
                                            visibleLayers = layer.visibleLayers;
                                            layerLegend = new esri.tasks.LegendLayer();
                                            layerLegend.layerId = layer.id;
                                            layerLegend.subLayerIds = visibleLayers;
                                            legends.push(layerLegend);
                                        }
                                        else if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer) {
                                            //if (layer.maxScale == 0 || layer.minScale == 0)
                                            visibleLayers = layer.visibleLayers;
                                            layerLegend = new esri.tasks.LegendLayer();
                                            layerLegend.layerId = layer.id;
                                            layerLegend.subLayerIds = visibleLayers;
                                            legends.push(layerLegend);
                                        }
                                    }
                                }
                                for (i = 0; i < graphicsLayerIds.length; i++) {
                                    layer = thiss.map.getLayer(layerIds[i]);
                                    if (layer !== null && layer.visible === true) {
                                    }
                                }
                                return legends;
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(print.BaseWidget);
                        print.Widget = Widget;
                    })(widgets.print || (widgets.print = {}));
                    var print = widgets.print;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));