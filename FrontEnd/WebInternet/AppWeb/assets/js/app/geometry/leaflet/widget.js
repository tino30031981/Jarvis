var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Widget = (function (_super) {
                __extends(Widget, _super);
                function Widget() {
                    _super.call(this);
                    this.setData = function (featureSet, layer, table, joinField, symbols, isSynchronized) {
                        var thiss = this;
                        this.setDataTable(featureSet, joinField, table);
                        this.setDataLayer(featureSet.features, layer);
                        if (isSynchronized === true) {
                            layerToTable();
                            tableToLayer();
                        }
                        function layerToTable() {
                            layer.on("click", function (e) {
                                thiss.setGraphicSymbol(e.graphic, true);
                                thiss.map.infoWindow.show(e.screenPoint, thiss.map.getInfoWindowAnchor(e.screenPoint));
                            });
                            layer.on("mouse-over", function (e) {
                                thiss.setGraphicSymbol(e.graphic, true);
                                jQuery(table + ' tr.' + Widget.ELEMENTSELECTED).removeClass(Widget.ELEMENTSELECTED);
                                var id = e.graphic.attributes[joinField];
                                jQuery(table + " tr#" + id)[0].scrollIntoView();
                                jQuery(table + " tr#" + id).addClass(Widget.ELEMENTSELECTED);
                            });
                            layer.on("mouse-out", function (e) {
                                jQuery(table + ' tr.' + Widget.ELEMENTSELECTED).removeClass(Widget.ELEMENTSELECTED);
                                thiss.setGraphicSymbol(e.graphic, false);
                            });
                        }
                        function tableToLayer() {
                            jQuery(table + ' tbody').on('mouseover', 'tr', function () {
                                thiss.onMouseOverElementToGrahic(this, layer.graphics, joinField, Widget.ELEMENTSELECTED, symbols);
                            });
                            jQuery(table + ' tbody').on('mouseleave', 'tr', function () {
                                thiss.onMouseOutElementToGrahic(this, layer.graphics, Widget.ELEMENTSELECTED, symbols);
                            });
                        }
                    };
                    this.setDataTable = function (featureSet, joinField, table) {
                        jQuery(table).html("");
                        var items = dojo.map(featureSet.features, function (feature) {
                            return feature.attributes;
                        });
                        setHeader(featureSet.fields);
                        if (featureSet.features === null) return;
                        setBody(items);
                        function setHeader(items) {
                            jQuery(table).append("<thead></thead>");
                            if (items !== null && items instanceof Array) {
                                var html = "<tr>";
                                var i = 0;
                                for (i = 0; i < items.length; i++) {
                                    if (items[i].name.toUpperCase() == joinField.toUpperCase()) continue;
                                    html += '<th>' + ((items[i].alias !== null && items[i].alias !== "") ? items[i].alias : items[i].name) + '</th>';
                                }
                                html += "</tr>";
                                jQuery(table + " thead").html(html);
                            }
                        }
                        function setBody(items) {
                            jQuery(table).append("<tbody></tbody>");
                            if (items !== null && items instanceof Array) {
                                var html = "";
                                if (items.length > 0) {
                                    var i = 0;
                                    for (i = 0; i < items.length; i++) {
                                        var attributes = items[i];
                                        html = '<tr id="' + attributes[joinField] + '">';
                                        for (var attribute in attributes) {
                                            if (attribute.toUpperCase() == joinField.toUpperCase()) continue;
                                            if (attributes[attribute] === null)
                                                html += '<td></td>';
                                            else if (attributes[attribute] !== null && attributes[attribute].toString().startsWith("http") === true) {
                                                html += '<td><a href="' + attributes[attribute] + '" target="_blank">Ver</a></td>';
                                            }
                                            else
                                                html += "<td>" + attributes[attribute] + "</td>";
                                        }
                                        html += "</tr>";
                                        jQuery(table + " tbody").append(html);
                                    }
                                }
                                else {
                                    var numerColumnas = jQuery(table + " thead tr > th").length;
                                    html = '<tr id="0"><td colspan="' + numerColumnas + '">No se han encontrado resultados para sus condiciones de búsqueda</td>';
                                    jQuery(table + " tbody").html(html);
                                }
                            }
                        }
                    };
                    this.setDataLayer = function (features, layer, symbols) {
                        if (features.length === 0) { alert("No se han encontrado datos"); return; }
                        var thiss = this;
                        require(["esri/graphicsUtils"], function (GraphicsUtils) {
                            var extent = GraphicsUtils.graphicsExtent(features);
                            thiss.map.setExtent(extent);
                            dojo.forEach(features, function (graphic) {
                                thiss.setGraphicSymbol(graphic, false);
                                layer.add(graphic);
                            });
                        });
                    };
                    this.parseFields = function (fields, fieldIndex) {
                        var fields2 = [];
                        if (fields !== undefined && fields !== null)
                            if (jQuery.inArray("*", fields) > -1)
                                fields2 = ["*"];
                            else
                                if (jQuery.inArray(fieldIndex, fields) == -1) {
                                    fields2 = fields;
                                    fields2.push(fieldIndex);
                                }
                        return fields2;
                    };
                    this.parseInfoTemplate = function (fields, displayFieldName, useCustomInfoTemplate, customInfoTemplate) {
                        var infoTemplate = new esri.InfoTemplate("Atributos", "${*}");
                        if (useCustomInfoTemplate === true)
                            if (customInfoTemplate !== undefined && customInfoTemplate !== null)
                                infoTemplate = new esri.InfoTemplate(customInfoTemplate);
                            else {
                                infoTemplate = getInfoTemplate();
                            }
                        else {
                            infoTemplate = getInfoTemplate();
                        }
                        return infoTemplate;
                        function getInfoTemplate() {
                            var infoTemplate = {};
                            infoTemplate.title = displayFieldName + ": ${" + displayFieldName + "}";
                            infoTemplate.content = "";
                            for (i = 0; i < fields.length; i++) {
                                infoTemplate.content += ((fields[i].alias !== null && fields[i].alias !== "") ? fields[i].alias : fields[i].name);
                                infoTemplate.content += ": ${" + fields[i].name + "}<br />";
                            }
                            return new esri.InfoTemplate(infoTemplate);
                        }
                    };
                    this.setGraphicSymbol = function (graphic, isHighlight) {
                        switch (graphic.geometry.type) {
                            case "point":
                                graphic.setSymbol(((isHighlight === true) ? symbols.simpleMarkerHighlightSymbol : symbols.simpleMarkerSymbol));
                                break;
                            case "multipoint":
                                graphic.setSymbol(((isHighlight === true) ? symbols.simpleMarkerHighlightSymbol : symbols.simpleMarkerSymbol));
                                break;
                            case "polyline":
                                graphic.setSymbol(((isHighlight === true) ? symbols.simpleLineHighlightSymbol : symbols.simpleLineSymbol));
                                break;
                            case "polygon":
                                graphic.setSymbol(((isHighlight === true) ? symbols.simpleFillHighlightSymbol : symbols.simpleFillSymbol));
                                break;
                            case "extent":
                                graphic.setSymbol(((isHighlight === true) ? symbols.simpleFillHighlightSymbol : symbols.simpleFillSymbol));
                                break;
                            default:
                        }
                    };
                    this.resetInfoWindow = function () {
                        var parent = jQuery('.contentPane').closest(".esriPopupWrapper");
                        jQuery(parent).find("div").prop("style", "");
                    };
                }
                Widget.prototype.parseSymbols = function () {
                    var thiss = this;
                    if (thiss.config.module.widget.symbols === undefined || this.config.module.widget.symbols === null) {
                        if (this.config.module.map === undefined || this.config.module.map === null)
                            this.config.module.widget.symbols = {};
                        else
                            this.config.module.widget.symbols = (this.config.module.map.symbols === undefined || this.config.module.map.symbols === null) ? {} : this.config.module.map.symbols;
                    }
                    _super.prototype.parseSymbols.call(this);
                };
                /*Events of Synchronization*/
                Widget.prototype.onMouseOverGraphicToElement = function (e, domWidget, index, cssClass, symbols) {
                    this.setGraphicSymbol(e.graphic, true);
                    var id = graphic.attributes[index];
                    var element = jQuery(domWidget + " #" + id);
                    this.removeClass(element, cssClass, domWidget);
                    jQuery(element)[0].scrollIntoView();
                    jQuery(element).addClass(cssClass);
                };
                Widget.prototype.onMouseOutGraphicToElement = function (e, domWidget, cssClass, symbols) {
                    jQuery(domWidget).find("." + cssClass).removeClass(cssClass);
                    this.setGraphicSymbol(e.graphic, false);
                };
                Widget.prototype.onMouseOverElementToGrahic = function (element, graphics, index, cssClass, symbols, closestElement) {
                    var thiss = this;
                    this.removeClass(element, cssClass, closestElement);
                    jQuery(element).addClass(cssClass);
                    dojo.some(graphics, function (g) {
                        if ((g.attributes) && g.attributes[index] == jQuery(element).attr('id')) {
                            thiss.setGraphicSymbol(g, true);
                        }
                    });
                };
                Widget.prototype.onMouseOutElementToGrahic = function (element, graphics, cssClass, symbols, closestElement) {
                    var thiss = this;
                    this.removeClass(element, cssClass, closestElement);
                    dojo.some(graphics, function (g) {
                        thiss.setGraphicSymbol(g, false);
                    });
                };
                Widget.prototype.onMouseDoubleClickElementToGraphic = function (element, graphics, index) {
                    var thiss = this;
                };
                return Widget;
            })(geometry.BaseMapWidget);
            geometry.Widget = Widget;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));