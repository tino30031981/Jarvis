(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (print) {
                        (function (html5) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$btnPrint = null;
                                    this.$txtTitle = null;
                                    this.$txtAuthor = null;
                                    this.$txaDescription = null;
                                    this.writeTemplate = function ($dom) {
                                        var thiss = this;
                                        var $title = jQuery($dom.contentDocument).find("h2");                                       
                                        var $description = jQuery($dom.contentDocument).find("#pDescription");
                                        var $divLegend = jQuery($dom.contentDocument).find("#divLegend");
                                        var $divContentLegend = jQuery($dom.contentDocument).find("#divContentLegend");
                                        var $divSource = jQuery($dom.contentDocument).find("#divSource");
                                        var $divDescription = jQuery($dom.contentDocument).find("#divDescription");
                                        var $img = jQuery($dom.contentDocument).find("#img");
                                        var $imgLogo = jQuery($dom.contentDocument).find("#imgLogo");
                                        var $tblSource = jQuery($dom.contentDocument).find("#tblSource");
                                        $title.append(thiss.$txtTitle.val());
                                        $description.append(thiss.$txaDescription.val());
                                        $imgLogo.attr("src", com.jtm.System.img + thiss.config.logo);
                                        $imgLogo.attr("alt", thiss.config.appName);
                                        $tblSource.find('>caption').append(thiss.config.module.widget.corporationTitle);
                                        $tblSource.find('>thead>tr>th:eq(1)').append($title.text());
                                        $tblSource.find('>tbody>tr:first>td:eq(0)').append(new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                                        $tblSource.find('>tbody>tr:first>td:eq(1)').append(thiss.$ddlSpatialReference.find(':selected').text());
                                        $tblSource.find('>tbody>tr:first>td:eq(2)').append(thiss.$txtAuthor.val());
                                        $tblSource.find('>tbody>tr:last>td:eq(1)').append(thiss.config.module.widget.source);
                                        thiss.html2Canvas(thiss.$map, $img);
                                        var layers = thiss.getLayers();
                                        layers.forEach(function (layer) {                                            
                                            if (layer.legends.length === 1) {                                                
                                                $divLegend.append('<div></div>');
                                                $divLegend.find('>div:last').append('<strong>' + layer.name + '</strong><br/><img src="' + layer.legends[0].url + '"/>');
                                            }
                                            else {
                                                $divLegend.append('<div></div>');
                                                $divLegend.find('>div:last').append('<strong>' + layer.name + '</strong><br/>');
                                                layer.legends.forEach(function (legend, i) {
                                                    $divLegend.find('>div:last').append('<img src="' + legend.url + '"/>' + legend.label + '<br/>');
                                                });
                                            }                                            
                                        }, this);
                                        $divLegend.find('img').css('margin-left', '20px');                                        
                                        if ($divLegend.height() > $tblSource.height()) {
                                            $divLegend.find('div').toArray().forEach(function (div) {
                                                $(div).addClass('col-md-4');
                                            });
                                        } else {
                                            $divContentLegend.removeClass('col-sm-12').addClass('col-sm-4');
                                            $divSource.removeClass('col-sm-6').addClass('col-sm-4');
                                            $divDescription.removeClass('col-sm-6').addClass('col-sm-4');
                                        }
                                    };
                                    this.parseLayersAGSD = function (url, layerIds) {                                        
                                        var layers = [];
                                        var layer = null;
                                        var layers2 = null;
                                        jQuery.getJSON(url + "/legend?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                            if (data.error !== undefined || jqXHR.status != 200) {
                                                return;
                                            }
                                            layers2 = data.layers;
                                        });
                                        var i = 0;
                                        var layer2 = null;
                                        for (i = 0; i < layerIds.length; i++) {
                                            if (layers2 === null) continue;
                                            layer2 = layers2.find(function (layer) {                                                
                                                if (layer.layerId == layerIds[i])
                                                return layer;
                                            });                                            
                                            if (layer2 !== undefined && layer2 !== null) {
                                                layer = { id: layer2.layerId, name: layer2.layerName, legends:[] };                                                
                                                layer2.legend.forEach(function (legend) {
                                                    layer.legends.push({
                                                        label: legend.label,
                                                        url: url + "/" + layer.id + "/images/" + legend.url
                                                    });
                                                });
                                                layers.push(layer);
                                            }
                                        }
                                        return layers;
                                    };
                                    this.parseLayersAGST = function (url) {

                                    };
                                    this.parseLayersAGSF = function (url) {

                                    };
                                    this.parseLayersAGSG = function (url) {

                                    };
                                    this.parseLayersWMS = function (url, layerIds) {
                                        var thiss = this;
                                        var queryString = "service=WMS&version=1.3.0&request=getcapabilities";
                                        url = (url.endsWith("?") ? url : url + "?");
                                        var data = null;
                                        jQuery.ajax(url + queryString).done(function (response, textStatus, jqXHR) {                                            
                                            if (response.error !== undefined || jqXHR.status != 200) {                                                
                                                return;
                                            }
                                            data = jQuery.xml2json(response);                                                                                     
                                        });
                                        var layers = [];
                                        var layer = null;
                                        var i = 0;
                                        var j = 0;
                                        if (data.Capability.Layer.Layer instanceof Array)
                                            for (i = 0; i < data.Capability.Layer.Layer.length; i++) {
                                                if (layerIds.indexOf(data.Capability.Layer.Layer[i].Name) == -1) continue;
                                                layer = {};
                                                layer.id = data.Capability.Layer.Layer[i].Name;
                                                layer.name = data.Capability.Layer.Layer[i].Title;
                                                setLegend(layer, i);
                                                layers.push(layer);
                                            }
                                        else {
                                            if (service.layerIds.indexOf(data.Capability.Layer.Layer.Name) == -1) return;
                                            layer = {};
                                            layer.id = data.Capability.Layer.Layer.Name;
                                            layer.name = data.Capability.Layer.Layer.Title;                                            
                                            setLegend(layer, i);
                                            layers.push(layer);
                                        }                                       
                                        return layers;
                                        function setLegend(layer, i) {                                            
                                            layer.legends = [];
                                            var j = 0;
                                            if (data.Capability.Layer.Layer instanceof Array) {
                                                if (data.Capability.Layer.Layer[i].Style instanceof Array) {
                                                    for (j = 0; j < data.Capability.Layer.Layer[i].Style.length; j++) {
                                                        layer.legends[j] = {};
                                                        layer.legends[j].url = data.Capability.Layer.Layer[i].Style[j].LegendURL.OnlineResource["xlink:href"];
                                                        layer.legends[j].label = data.Capability.Layer.Layer[i].Style[j].Title;
                                                    }
                                                }
                                                else {
                                                    layer.legends[j] = {};
                                                    layer.legends[j].url = data.Capability.Layer.Layer[i].Style.LegendURL.OnlineResource["xlink:href"]
                                                    layer.legends[j].label = data.Capability.Layer.Layer[i].Style.Title;
                                                }
                                            } else {
                                                layer.legends[j] = {};
                                                layer.legends[j].url = data.Capability.Layer.Layer.Style.LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer.Style.Title;
                                            }
                                        }
                                    };
                                }
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    this.$ddlSpatialReference = this.$widget.find('#ddlSpatialReference');
                                    this.$btnPrint = this.$widget.find('#btnPrint');
                                    this.$txtTitle = this.$widget.find('#txtTitle');
                                    this.$txtAuthor = this.$widget.find('#txtAuthor');
                                    this.$txaDescription = this.$widget.find('#txaDescription');
                                    this.$message = this.$widget.find(BaseWidget.DOMMESSAGE);
                                    com.jtm.helper.DropDownList.fillLocal({
                                        items: thiss.config.module.widget.spatialReferences,
                                        ddl: thiss.$ddlSpatialReference,
                                        idSelected: thiss.config.module.widget.defaultSrid
                                    });
                                    thiss.$txtTitle.val(thiss.config.module.widget.titleMap);
                                    thiss.$txtAuthor.val(thiss.config.module.widget.author);
                                    thiss.$txaDescription.val(thiss.config.module.widget.description);
                                    thiss.$btnPrint.off('click');
                                    thiss.$btnPrint.on('click', function () {
                                        thiss.form(null, 0, {});
                                    });
                                };
                                BaseWidget.prototype.form = function (url, id, options) {
                                    var thiss = this;
                                    options = options || {};
                                    options.title = "Impresión de mapa desde sigemin";
                                    options.dialogTitle = "Impresión de Mapa";
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + 'templates/template1.html?' + Math.random();
                                    _super.prototype.form.call(this, url, id, options);
                                };
                                BaseWidget.prototype.detail = function (dom, id) {
                                    var thiss = this;
                                    thiss.writeTemplate(dom);
                                };
                                BaseWidget.prototype.getLayers = function () {
                                };
                                BaseWidget.prototype.cleanControls = function () {
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            html5.BaseWidget = BaseWidget;
                        })(print.html5 || (print.html5 = {}));
                        var html5 = print.html5;
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