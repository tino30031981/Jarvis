function getObject() {
    return com.jtm.geometry.viewer.widgets.elevationprofile.BaseWidget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (elevationprofile) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.dialogData = null;
                                this.domBaseWidgetData = "divBaseWidgetData";
                                this.layer = null;
                                this.toolbar = null;
                                this.widget = null;

                                this.execute = function (e) {
                                    var thiss = this;
                                    thiss.toolbar.deactivate();
                                    thiss.map.enableMapBaseWidget();
                                    var graphic = new esri.Graphic(e.geometry);
                                    thiss.setGraphicSymbol(graphic, false);
                                    thiss.layer.clear();
                                    thiss.layer.add(graphic);
                                    thiss.widget.set("profileGeometry", e.geometry);
                                    thiss.widget.set("measureUnits", jQuery("#" + thiss.domBaseWidget + " #ddlMeasureUnit").val());
                                };
                                this.showData = function () {
                                    var thiss = this;
                                    thiss.domBaseWidgetData = thiss.getUUID();
                                    jQuery('body').append('<div id="' + thiss.domBaseWidgetData + '"></div>');
                                    configProfile();
                                    function configProfile() {
                                        var chartOptions = {
                                            title: "Perfil de elevación",
                                            chartTitleFontSize: 11,
                                            axisTitleFontSize: 10,
                                            axisLabelFontSize: 9,
                                            indicatorFontColor: '#eee',
                                            indicatorFillColor: '#666',
                                            titleFontColor: '#000',
                                            axisFontColor: '#000',
                                            axisMajorTickColor: '#333',
                                            skyTopColor: "#B0E0E6",
                                            skyBottomColor: "#4682B4",
                                            waterLineColor: "#eee",
                                            waterTopColor: "#ADD8E6",
                                            waterBottomColor: "#0000FF",
                                            elevationLineColor: "#D2B48C",
                                            elevationTopColor: "#8B4513",
                                            elevationBottomColor: "#CD853F"
                                        };
                                        var parameters = {
                                            map: thiss.map,
                                            profileTaskUrl: thiss.config.module.widget.service.url,
                                            scalebarUnits: jQuery("#" + thiss.domBaseWidget + " #ddlMeasureUnit").val(),
                                            chartOptions: chartOptions
                                        };
                                        require(["esri/dijit/BaseWidget"], function (BaseWidget) {
                                            thiss.widget = new BaseWidget(parameters, jQuery("#" + thiss.domBaseWidgetData)[0]);
                                            thiss.widget.startup();
                                            showDialog();
                                        });
                                    }
                                    function showDialog() {
                                        thiss.dialogData = jQuery('<div id="' + thiss.domBaseWidgetData + '"></div>').dialog({
                                            title: 'Gráfico de elevación de perfil',
                                            width: jQuery(window).width() - 30,
                                            resizable: false,
                                            closeOnEscape: true,
                                            closable: false,
                                            autoremove: true,
                                            //position: position,
                                            close: function (dialog) {
                                                thiss.onCloseData(this);
                                            }
                                        });
                                    }
                                };
                            }
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.toolbar = new esri.toolbars.Draw(thiss.map);
                                thiss.toolbar.setFillSymbol(thiss.config.module.widget.symbols.simpleFillSymbol);
                                thiss.toolbar.setLineSymbol(thiss.config.module.widget.symbols.simpleLineSymbol);
                                thiss.toolbar.setMarkerSymbol(thiss.config.module.widget.symbols.simpleMarkerSymbol);
                                thiss.toolbar.deactivate();
                                thiss.layer = new esri.layers.GraphicsLayer();
                                thiss.map.addLayer(thiss.layer);
                                thiss.toolbar.on("draw-complete", function (e) { thiss.execute(e); });
                                jQuery('#' + thiss.domBaseWidget + ' #btnPolyline').unbind();
                                jQuery('#' + thiss.domBaseWidget + ' #btnPolyline').click(function (e) {
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.POLYLINE);
                                });
                                jQuery('#' + thiss.domBaseWidget + ' #btnFreeHandPolyline').unbind();
                                jQuery('#' + thiss.domBaseWidget + ' #btnFreeHandPolyline').click(function (e) {
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYLINE);
                                });
                                jQuery("#" + thiss.domBaseWidget + " #ddlMeasureUnit").on("change", function (e) {
                                    if (thiss.widget) {
                                        thiss.widget.set("measureUnits", jQuery("#" + thiss.domBaseWidget + " #ddlMeasureUnit").val());
                                    }
                                });
                                fillMeasureUnit(thiss.config.module.widget.measureUnits);
                                thiss.showData();
                                function fillMeasureUnit(items) {
                                    if (items !== null && items instanceof Array) {
                                        var i = 0;
                                        var html = '';
                                        for (i = 0; i < items.length; i++) {
                                            html += '<option value="' + items[i].id + '">' + items[i].label + '</option>';
                                        }
                                        jQuery("#" + thiss.domBaseWidget + " #ddlMeasureUnit").html(html);
                                    }
                                }
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    this.map.removeLayer(this.layer);
                                }
                                if (this.toolbar !== null)
                                    this.toolbar.deactivate();
                                this.closeData(this.dialogData);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        elevationprofile.BaseWidget = BaseWidget;
                    })(widgets.elevationprofile || (widgets.elevationprofile = {}));
                    var elevationprofile = widgets.elevationprofile;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));