function getObject() {
    return com.jtm.geometry.viewer.widgets.graphic.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (graphic) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.layer = null;
                                this.toolbar = null;

                                this.execute = function (e) {
                                    var thiss = this;
                                    var symbol = null;
                                    var rgb = null;
                                    var arrayColor = [];
                                    var outLine = null;
                                    switch (e.geometry.type) {
                                        case "point":
                                            if (jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val() === "true") {
                                                symbol = new esri.symbols.SimpleMarkerSymbol();
                                                rgb = jQuery('#' + thiss.domWidget + ' #txtColorMarkerSymbol').spectrum("get").toRgb();
                                                arrayColor = [rgb.r, rgb.g, rgb.b, parseFloat(jQuery('#' + thiss.domWidget + ' #nmbAlphaMarkerSymbol').val())];
                                                symbol.setColor(new esri.Color(arrayColor));
                                                symbol.setSize(parseInt(jQuery('#' + thiss.domWidget + ' #nmbSizeMarkerSymbol').val()));
                                                symbol.setStyle(esri.symbols.SimpleMarkerSymbol[jQuery('#' + thiss.domWidget + ' #ddlMarkerSymbolStyle :selected').val()]);
                                                symbol.setAngle(parseInt(jQuery('#' + thiss.domWidget + ' #nmbAngleMarkerSymbol').val()));
                                                outLine = new esri.symbols.SimpleLineSymbol();
                                                outLine.setColor(jQuery('#' + thiss.domWidget + ' #txtOutlineColorMarkerSymbol').spectrum("get").toHexString());
                                                outLine.setWidth(parseInt(jQuery('#' + thiss.domWidget + ' #nmbWidthMarkerSymbol').val()));
                                                symbol.setOutline(outLine);
                                            } else {
                                                symbol = new esri.symbols.TextSymbol(jQuery('#' + thiss.domWidget + ' #txtTextSymbol').val());
                                                var font = new esri.symbols.Font();
                                                font.setFamily(jQuery('#' + thiss.domWidget + ' #ddlFontTextSymbol').val());
                                                font.setSize(jQuery('#' + thiss.domWidget + ' #nmbSizeTextSymbol').val() + "pt");
                                                if (jQuery('#' + thiss.domWidget + ' #btnBoldTextSymbol').val() == "active") font.setWeight(esri.symbols.Font.WEIGHT_BOLD);
                                                if (jQuery('#' + thiss.domWidget + ' #btnItalicTextSymbol').val() == "active") font.setStyle(esri.symbols.Font.STYLE_ITALIC);
                                                if (jQuery('#' + thiss.domWidget + ' #btnUnderlineTextSymbol').val() == "active") font.setDecoration("underline");
                                                symbol.setFont(font);
                                                symbol.setAngle(parseInt(jQuery('#' + thiss.domWidget + ' #nmbRotationTextSymbol').val()));
                                                symbol.setColor(jQuery('#' + thiss.domWidget + ' #txtColorTextSymbol').spectrum("get").toHexString());
                                                if (jQuery('#' + thiss.domWidget + ' #chkHaloTextSymbol').is(":checked")) addTextBorder();
                                            }
                                            break;
                                        case "polyline":
                                            symbol = new esri.symbols.SimpleLineSymbol();
                                            rgb = jQuery('#' + thiss.domWidget + ' #txtColorLineSymbol').spectrum("get").toRgb();
                                            arrayColor = [rgb.r, rgb.g, rgb.b, parseFloat(jQuery('#' + thiss.domWidget + ' #nmbAlphaLineSymbol').val())];
                                            symbol.setColor(new esri.Color(arrayColor));
                                            symbol.setWidth(parseInt(jQuery('#' + thiss.domWidget + ' #nmbWidthLineSymbol').val()));
                                            symbol.setStyle(esri.symbols.SimpleLineSymbol[jQuery('#' + thiss.domWidget + ' #ddlLineSymbolStyle :selected').val()]);
                                            break;
                                        default:
                                            symbol = new esri.symbols.SimpleFillSymbol();
                                            rgb = jQuery('#' + thiss.domWidget + ' #txtColorFillSymbol').spectrum("get").toRgb();
                                            arrayColor = [rgb.r, rgb.g, rgb.b, parseFloat(jQuery('#' + thiss.domWidget + ' #nmbAlphaFillSymbol').val())];
                                            symbol.setColor(new esri.Color(arrayColor));
                                            symbol.setStyle(esri.symbols.SimpleFillSymbol[jQuery('#' + thiss.domWidget + ' #ddlFillSymbolStyle :selected').val()]);
                                            outLine = new esri.symbols.SimpleLineSymbol();
                                            rgb = jQuery('#' + thiss.domWidget + ' #txtOutlineColorFillSymbol').spectrum("get").toRgb();
                                            arrayColor = [rgb.r, rgb.g, rgb.b, parseFloat(jQuery('#' + thiss.domWidget + ' #nmbOutlineAlphaFillSymbol').val())];
                                            outLine.setColor(new esri.Color(arrayColor));
                                            outLine.setStyle(esri.symbols.SimpleLineSymbol[jQuery('#' + thiss.domWidget + ' #ddlOutlineFillSymbolStyle :selected').val()]);
                                            outLine.setWidth(parseInt(jQuery('#' + thiss.domWidget + ' #nmbWidthFillSymbol').val()));
                                            symbol.setOutline(outLine);
                                            break;
                                    }
                                    var graphic = new esri.Widget(e.geometry, symbol);
                                    //thiss.map.graphics.add(graphic);
                                    thiss.layer.add(graphic);
                                    function addTextBorder() {
                                        var symbol2 = new esri.symbols.TextSymbol(jQuery("#txtTextSymbol").val());
                                        var font2 = new esri.symbols.Font();
                                        font2.setFamily(jQuery('#' + thiss.domWidget + ' #ddlFontTextSymbol').val());
                                        font2.setSize(jQuery('#' + thiss.domWidget + ' #nmbSizeTextSymbol').val() + "pt");
                                        if (jQuery('#' + thiss.domWidget + ' #btnBoldTextSymbol').val() == "active") font2.setWeight(esri.symbols.Font.WEIGHT_BOLD);
                                        if (jQuery('#' + thiss.domWidget + ' #btnItalicTextSymbol').val() == "active") font2.setStyle(esri.symbols.Font.STYLE_ITALIC);
                                        if (jQuery('#' + thiss.domWidget + ' #btnUnderlineTextSymbol').val() == "active") font2.setDecoration("underline");
                                        symbol2.setFont(font2);
                                        symbol2.setAngle(parseInt(jQuery('#' + thiss.domWidget + ' #nmbRotationTextSymbol').val()));
                                        symbol2.setColor("#FFFFFF");
                                        symbol2.setOffset(0, -2);

                                        var graphic2 = new esri.Widget(e.geometry, symbol2);
                                        //thiss.map.graphics.add(graphic2);
                                        thiss.layer.add(graphic2);

                                        var symbol3 = symbol2;
                                        symbol3.setOffset(0, 2);
                                        var graphic3 = new esri.Widget(e.geometry, symbol3);
                                        //thiss.map.graphics.add(graphic3);
                                        thiss.layer.add(graphic3);

                                        var symbol4 = symbol3;
                                        symbol4.setOffset(-2, 0);
                                        var graphic4 = new esri.Widget(e.geometry, symbol4);
                                        //thiss.map.graphics.add(graphic4);
                                        thiss.layer.add(graphic4);

                                        var symbol5 = symbol4;
                                        symbol5.setOffset(2, 0);
                                        var graphic5 = new esri.Widget(e.geometry, symbol5);
                                        //thiss.map.graphics.add(graphic5);
                                        thiss.layer.add(graphic5);

                                        var symbol6 = symbol5;
                                        symbol6.setOffset(2, 2);
                                        var graphic6 = new esri.Widget(e.geometry, symbol6);
                                        //thiss.map.graphics.add(graphic6);
                                        thiss.layer.add(graphic6);

                                        var symbol7 = symbol6;
                                        symbol7.setOffset(2, -2);
                                        var graphic7 = new esri.Widget(e.geometry, symbol7);
                                        //thiss.map.graphics.add(graphic7);
                                        thiss.layer.add(graphic7);

                                        var symbol8 = symbol7;
                                        symbol8.setOffset(-2, 2);
                                        var graphic8 = new esri.Widget(e.geometry, symbol8);
                                        //thiss.map.graphics.add(graphic8);
                                        thiss.layer.add(graphic8);

                                        var symbol9 = symbol8;
                                        symbol9.setOffset(-2, -2);
                                        var graphic9 = new esri.Widget(e.geometry, symbol9);
                                        //thiss.map.graphics.add(graphic9);
                                        thiss.layer.add(graphic9);
                                    }
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
                                _super.prototype.initConfig.call(this);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;

                                noHideDiv();
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtColorMarkerSymbol', "#00F");
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtOutlineColorMarkerSymbol', "#000");
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtColorLineSymbol', "#00F");
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtColorFillSymbol', "#0F0");
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtOutlineColorFillSymbol', "#000");
                                com.jtm.helper.Color.color('#' + thiss.domWidget + ' #txtColorTextSymbol', "#F00");

                                thiss.fillDropDownList('#' + thiss.domWidget + ' #ddlMarkerSymbolStyle', thiss.config.module.widget.symbols.markerSymbol.styles, false, "id", "label");
                                thiss.fillDropDownList('#' + thiss.domWidget + ' #ddlLineSymbolStyle', thiss.config.module.widget.symbols.lineSymbol.styles, false, "id", "label");
                                thiss.fillDropDownList('#' + thiss.domWidget + ' #ddlFillSymbolStyle', thiss.config.module.widget.symbols.fillSymbol.styles, false, "id", "label");
                                thiss.fillDropDownList('#' + thiss.domWidget + ' #ddlOutlineFillSymbolStyle', thiss.config.module.widget.symbols.fillSymbol.outline.styles, false, "id", "label");
                                thiss.fillDropDownList('#' + thiss.domWidget + ' #ddlFontTextSymbol', thiss.config.module.widget.symbols.textSymbol.fonts, false, "id", "label");

                                toggleFont("btnBoldTextSymbol");
                                toggleFont("btnItalicTextSymbol");
                                toggleFont("btnUnderlineTextSymbol");
                                thiss.toolbar = new esri.toolbars.Draw(thiss.map);
                                thiss.toolbar.deactivate();
                                thiss.layer = new esri.layers.WidgetsLayer();
                                thiss.map.addLayer(thiss.layer);
                                thiss.toolbar.on("draw-complete", function (e) { thiss.execute(e); });
                                jQuery('#' + thiss.domWidget + ' #btnPoint').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnPoint').click(function (e) {
                                    noHideDiv("divMarkerSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    //jQuery("#txtColorMarkerSymbol").spectrum("get").toHexString();
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.POINT);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnPolyline').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnPolyline').click(function (e) {
                                    noHideDiv("divLineSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.POLYLINE);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnFreeHandPolyline').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnFreeHandPolyline').click(function (e) {
                                    noHideDiv("divLineSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYLINE);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnRectangle').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnRectangle').click(function (e) {
                                    noHideDiv("divFillSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.EXTENT);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnCircle').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnCircle').click(function (e) {
                                    noHideDiv("divFillSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.CIRCLE);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnEllipse').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnEllipse').click(function (e) {
                                    noHideDiv("divFillSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.ELLIPSE);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnPolygon').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnPolygon').click(function (e) {
                                    noHideDiv("divFillSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.POLYGON);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnFreeHandPolygon').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnFreeHandPolygon').click(function (e) {
                                    noHideDiv("divFillSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(true);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
                                });
                                jQuery('#' + thiss.domWidget + ' #btnText').unbind();
                                jQuery('#' + thiss.domWidget + ' #btnText').click(function (e) {
                                    noHideDiv("divTextSymbol");
                                    jQuery('#' + thiss.domWidget + ' #hdnIsGeometry').val(false);
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    thiss.toolbar.activate(esri.toolbars.Draw.POINT);
                                });
                                jQuery('#' + thiss.domWidget + ' #divClear a').unbind();
                                jQuery('#' + thiss.domWidget + ' #divClear a').click(function (e) {
                                    thiss.layer.clear();
                                });
                                function noHideDiv(divSymbol) {
                                    var totalHidden = false;
                                    if (divSymbol === undefined || divSymbol === null) totalHidden = true;
                                    jQuery('#' + thiss.domWidget + ' #divContentSymbols > div').each(function (i, div) {
                                        if (totalHidden === false && jQuery(div).attr('id') == divSymbol)
                                            jQuery(div).show();
                                        else
                                            jQuery(div).hide();
                                    });
                                }
                                function toggleFont(button) {
                                    jQuery('#' + thiss.domWidget + ' #' + button).click(function () {
                                        if (jQuery(this).val() == "inactive") {
                                            jQuery(this).val("active");
                                            jQuery(this).css("background", "#38836A");
                                        } else {
                                            jQuery(this).val("inactive");
                                            jQuery(this).css("background", "#469B7E");
                                        }
                                    });
                                }
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    this.map.removeLayer(this.layer);
                                }
                                if (this.toolbar !== null)
                                    this.toolbar.deactivate();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(graphic.BaseWidget);
                        graphic.Widget = Widget;
                    })(widgets.graphic || (widgets.graphic = {}));
                    var graphic = widgets.graphic;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));