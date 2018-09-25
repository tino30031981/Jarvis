(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (toc) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.html = '';
                                this.removeElement = function (id) {
                                    if (id === undefined || id === null || id === "") return;
                                    var layer = this.map.getLayer(id);
                                    if (layer !== undefined && layer !== null)
                                        this.map.removeLayer(layer);
                                    var index = this.config.module.widget.services.findIndex2("id", id);
                                    if (index > -1)
                                        this.config.module.widget.services.splice(index, 1);
                                };
                                this.showOptions = function (obj) {
                                    var $obj = jQuery(obj);
                                    var $options = $('<ul class="dropdown-menu"></ul>');
                                    $options.append('<li><a href="#">Action 1</a></li>');
                                    $options.append('<li><a href="#">Action 2</a></li>');
                                    $obj.append($options);
                                };
                                this.writeServices = function (services) {
                                    var thiss = this;
                                    services = services || this.config.module.widget.services;
                                    this.html += '<ul class="tree root">';
                                    var i = 0;
                                    for (i = 0; i < services.length; i++) {
                                        var hasChild = (services[i].services !== undefined && services[i].services !== null);
                                        if (hasChild === false)
                                            this.html += '<li id="li_' + services[i].id + '">';
                                        else
                                            this.html += '<li id="li_' + services[i].id + '">';
                                        this.writeTree(services[i], hasChild);
                                        if (hasChild)
                                            this.writeServices(services[i].services);
                                        this.html += '</li>';
                                    }
                                    this.html += '</ul>';
                                };
                                this.writeTree = function (service, hasChild) {
                                    var thiss = this;
                                    var checked = (service.visible === true ? ' checked="checked"' : '');
                                    var type = "";
                                    if (service.type == "wfs")
                                        type = "wfs";
                                    this.html += '<input type="checkbox" data-type="' + type + '" id="' + service.id + '"' + checked + ' value="-1" />';
                                    if (hasChild === false) {
                                        if (thiss.map.getLayer(service.id) !== null) {
                                            thiss.html += ((service.label === undefined || service.label === null || service.label === "") ? service.name : service.label);
                                            thiss.html += '<label class="dropdown pull-right">';
                                            thiss.html += '<label id="opt' + service.id + '" class="dropdown-toggle glyphicon glyphicon-cog" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></label>';
                                            thiss.html += '</label>';
                                            thiss.$widget.on('click', '#opt' + service.id, function (e) {
                                                thiss.showOptions(this);
                                            });
                                            thiss.writeLayers(service, service.layers);
                                        }
                                    }
                                    else {
                                        this.html += service.label;
                                    }
                                    thiss.changeVisibility(service);
                                };
                                this.writeLayers = function (service, layers) {
                                    var thiss = this;
                                    var i = 0;
                                    var value = -1;
                                    var id = value;
                                    if (layers == null) return;
                                    thiss.html += '<ul>';
                                    for (i = 0; i < layers.length; i++) {
                                        id = layers[i].id.toString().replace(".", "") + '_' + service.id;
                                        value = (layers[i].layers !== undefined && layers[i].layers !== null && layers[i].layers.length > 0) ? -1 : layers[i].id;
                                        thiss.html += '<li>';
                                        thiss.html += '<input type="checkbox" id="' + id + '"' + (layers[i].defaultVisibility === true ? ' checked="checked"' : '') + ' value="' + value + '" />';
                                        thiss.html += layers[i].name;
                                        if (layers[i].legends !== undefined && layers[i].legends !== null && layers[i].legends.length > 0) {
                                            thiss.html += '<ul>';
                                            thiss.html += '<li>';
                                            var j = 0;
                                            for (j = 0; j < layers[i].legends.length; j++)
                                                thiss.html += '<img src="' + layers[i].legends[j].url + '" />' + layers[i].legends[j].label + '<br />';
                                            thiss.html += '</li>';
                                            thiss.html += '</ul>';
                                        }
                                        if (layers[i].layers !== undefined && layers[i].layers !== null && layers[i].layers.length > 0) {
                                            thiss.writeLayers(service, layers[i].layers);
                                        }
                                        thiss.html += '</li>';
                                        thiss.$widget.on('change', '#' + id, function (e) {
                                            var serviceId = jQuery(this).prop("id").replace(/(\d|\w)+?_/, "");
                                            jQuery("#li_" + serviceId + " #" + serviceId).change();
                                        });
                                    }
                                    thiss.html += '</ul>';
                                };
                                this.getLayers = function ($obj, visibilityLayers) {
                                    var thiss = this;
                                    var chk = ($obj.closest("li").find(">input:checkbox"));
                                    var state = (jQuery(chk).is(":checked"));
                                    if (state) {
                                        if (jQuery(chk).val() != -1)
                                            visibilityLayers.push(jQuery(chk).val());
                                        var chks = $obj.closest("li").find(">ul>li>input:checkbox");
                                        var i = 0;
                                        for (i = 0; i < chks.length; i++) {
                                            this.getLayers(jQuery(chks[i]), visibilityLayers);
                                        }
                                    }
                                };
                                this.parseWMS = function (service) {
                                    var thiss = this;
                                    var queryString = "service=WMS&version=1.3.0&request=getcapabilities";
                                    service.url = (service.url.endsWith("?") ? service.url : service.url + "?");
                                    var data = null;
                                    jQuery.ajax(service.url + queryString).done(function (response, textStatus, jqXHR) {
                                        if (response.error !== undefined || jqXHR.status != 200) {
                                            service.disabled = true;
                                            thiss.removeElement(service.id);
                                            return;
                                        }
                                        data = jQuery.xml2json(response);
                                        console.log(data);
                                        service.layers = [];
                                        var layer = {};
                                        var i = 0;
                                        var j = 0;
                                        if (service.groups instanceof Array) {
                                            for (j = 0; j < service.groups.length; j++) {
                                                if (service.groups[j].disabled === true) {
                                                    thiss.removeElement(service.groups[j].id);
                                                    continue;
                                                }
                                                var serviceGroup = JSON.parse(JSON.stringify(service.groups[j]));
                                                serviceGroup.type = service.type;
                                                serviceGroup.url = service.url;
                                                serviceGroup.layers = [];
                                                for (i = 0; i < data.Capability.Layer.Layer.length; i++) {
                                                    if (service.groups[j].layerIds.indexOf(data.Capability.Layer.Layer[i].Name) == -1) continue;
                                                    layer = {};
                                                    layer.id = data.Capability.Layer.Layer[i].Name;
                                                    layer.name = data.Capability.Layer.Layer[i].Title;
                                                    layer.defaultVisibility = serviceGroup.visible;
                                                    setLegend(layer, i);
                                                    service.layers.push(layer);
                                                    serviceGroup.layers.push(layer);
                                                }
                                                thiss.config.module.widget.services.push(serviceGroup);
                                            }
                                            thiss.removeElement(service.id);
                                        }
                                        else {
                                            if (data.Capability.Layer.Layer instanceof Array)
                                                for (i = 0; i < data.Capability.Layer.Layer.length; i++) {
                                                    if (service.layerIds.indexOf(data.Capability.Layer.Layer[i].Name) == -1) continue;
                                                    layer = {};
                                                    layer.id = data.Capability.Layer.Layer[i].Name;
                                                    layer.name = data.Capability.Layer.Layer[i].Title;
                                                    layer.defaultVisibility = service.visible;
                                                    setLegend(layer, i);
                                                    service.layers.push(layer);
                                                }
                                            else {
                                                if (service.layerIds.indexOf(data.Capability.Layer.Layer.Name) == -1) return;
                                                layer = {};
                                                layer.id = data.Capability.Layer.Layer.Name;
                                                layer.name = data.Capability.Layer.Layer.Title;
                                                layer.defaultVisibility = service.visible;
                                                setLegend(layer, i);
                                                service.layers.push(layer);
                                            }
                                        }
                                    });
                                    function setLegend(layer, i) {
                                        layer.legends = [];
                                        var j = 0;
                                        if (data.Capability.Layer.Layer instanceof Array) {
                                            if (data.Capability.Layer.Layer[i].Style instanceof Array) {
                                                for (j = 0; j < data.Capability.Layer.Layer[i].Style.length; j++) {
                                                    layer.legends[j] = {};
                                                    layer.legends[j].url = data.Capability.Layer.Layer[i].Style[j].LegendURL.OnlineResource["xlink:href"];
                                                    layer.legends[j].label = data.Capability.Layer.Layer[i].Style[j].Title || data.Capability.Layer.Layer[i].Style[j].Name;
                                                }
                                            }
                                            else {
                                                layer.legends[j] = {};
                                                layer.legends[j].url = data.Capability.Layer.Layer[i].Style.LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer[i].Style.Title || data.Capability.Layer.Layer[i].Style.Name;
                                            }
                                        } else {
                                            layer.legends[j] = {};
                                            if (data.Capability.Layer.Layer.Style instanceof Array) {
                                                layer.legends[j].url = data.Capability.Layer.Layer.Style[0].LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer.Style[0].Title || data.Capability.Layer.Layer.Style[0].Name;
                                            }
                                            else {
                                                layer.legends[j].url = data.Capability.Layer.Layer.Style.LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer.Style.Title || data.Capability.Layer.Layer.Style.Name;
                                            }
                                        }
                                    }
                                };
                                this.parseWFS = function (service) {
                                    var thiss = this;
                                    var queryString = "service=WMS&version=1.3.0&request=getcapabilities";
                                    service.url = (service.url.endsWith("?") ? service.url : service.url + "?");
                                    var data = null;
                                    jQuery.ajax(service.url + queryString).done(function (response, textStatus, jqXHR) {
                                        if (response.error !== undefined || jqXHR.status != 200) {
                                            service.disabled = true;
                                            thiss.removeElement(service.id);
                                            return;
                                        }
                                        data = jQuery.xml2json(response);
                                        service.layers = [];
                                        var layer = {};
                                        var i = 0;
                                        var j = 0;
                                        if (service.groups instanceof Array) {
                                            for (j = 0; j < service.groups.length; j++) {
                                                if (service.groups[j].disabled === true) {
                                                    thiss.removeElement(service.groups[j].id);
                                                    continue;
                                                }
                                                var serviceGroup = JSON.parse(JSON.stringify(service.groups[j]));
                                                serviceGroup.type = service.type;
                                                serviceGroup.url = service.url;
                                                serviceGroup.layers = [];
                                                for (i = 0; i < data.Capability.Layer.Layer.length; i++) {
                                                    if (service.groups[j].layerIds.indexOf(data.Capability.Layer.Layer[i].Name) == -1) continue;
                                                    layer = {};
                                                    layer.id = data.Capability.Layer.Layer[i].Name;
                                                    layer.name = data.Capability.Layer.Layer[i].Title;
                                                    layer.defaultVisibility = serviceGroup.visible;
                                                    setLegend(layer, i);
                                                    service.layers.push(layer);
                                                    serviceGroup.layers.push(layer);
                                                }
                                                thiss.config.module.widget.services.push(serviceGroup);
                                            }
                                            thiss.removeElement(service.id);
                                        }
                                        else {
                                            if (data.Capability.Layer.Layer instanceof Array)
                                                for (i = 0; i < data.Capability.Layer.Layer.length; i++) {
                                                    if (service.layerIds.indexOf(data.Capability.Layer.Layer[i].Name) == -1) continue;
                                                    layer = {};
                                                    layer.id = data.Capability.Layer.Layer[i].Name;
                                                    layer.name = data.Capability.Layer.Layer[i].Title;
                                                    layer.defaultVisibility = service.visible;
                                                    setLegend(layer, i);
                                                    service.layers.push(layer);
                                                }
                                            else {
                                                if (data.Capability.Layer.Layer === null) return;
                                                if (service.layerIds.indexOf(data.Capability.Layer.Layer.Name) == -1) return;
                                                layer = {};
                                                layer.id = data.Capability.Layer.Layer.Name;
                                                layer.name = data.Capability.Layer.Layer.Title;
                                                layer.defaultVisibility = service.visible;
                                                setLegend(layer, i);
                                                service.layers.push(layer);
                                            }
                                        }
                                    });
                                    function setLegend(layer, i) {
                                        layer.legends = [];
                                        var j = 0;
                                        if (data.Capability.Layer.Layer instanceof Array) {
                                            if (data.Capability.Layer.Layer[i].Style instanceof Array) {
                                                for (j = 0; j < data.Capability.Layer.Layer[i].Style.length; j++) {
                                                    layer.legends[j] = {};
                                                    layer.legends[j].url = data.Capability.Layer.Layer[i].Style[j].LegendURL.OnlineResource["xlink:href"];
                                                    layer.legends[j].label = data.Capability.Layer.Layer[i].Style[j].Title || data.Capability.Layer.Layer[i].Style[j].Name;
                                                }
                                            }
                                            else {
                                                layer.legends[j] = {};
                                                layer.legends[j].url = data.Capability.Layer.Layer[i].Style.LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer[i].Style.Title || data.Capability.Layer.Layer[i].Style.Name;
                                            }
                                        } else {
                                            layer.legends[j] = {};
                                            if (data.Capability.Layer.Layer.Style instanceof Array) {
                                                layer.legends[j].url = data.Capability.Layer.Layer.Style[0].LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer.Style[0].Title || data.Capability.Layer.Layer.Style[0].Name;
                                            }
                                            else {
                                                layer.legends[j].url = data.Capability.Layer.Layer.Style.LegendURL.OnlineResource["xlink:href"]
                                                layer.legends[j].label = data.Capability.Layer.Layer.Style.Title || data.Capability.Layer.Layer.Style.Name;
                                            }
                                        }
                                    }
                                };
                                this.parseAGS = function (service) {
                                    var thiss = this;
                                    jQuery.getJSON(service.url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                        if (data.error !== undefined || jqXHR.status != 200) {
                                            service.disabled = true;
                                            thiss.removeElement(service.id);
                                            return;
                                        }
                                        var i = 0;
                                        var j = 0;
                                        if (service.groups instanceof Array) {
                                            for (j = 0; j < service.groups.length; j++) {
                                                if (service.groups[j].disabled === true) {
                                                    thiss.removeElement(service.groups[j].id);
                                                    continue;
                                                }
                                                var serviceGroup = JSON.parse(JSON.stringify(service.groups[j]));
                                                serviceGroup.type = service.type;
                                                serviceGroup.url = service.url;
                                                serviceGroup.label = serviceGroup.label || ((data.mapName !== undefined) ? data.mapName : data.name);
                                                serviceGroup.fullExtent = (data.fullExtent !== undefined) ? data.fullExtent : data.extent;
                                                serviceGroup.initialExtent = (data.initialExtent !== undefined) ? data.initialExtent : data.extent;
                                                serviceGroup.extent = data.extent;
                                                serviceGroup.layers = data.layers;
                                                setLegend(serviceGroup);
                                                thiss.parseAGSLayers(serviceGroup);
                                                thiss.config.module.widget.services.push(serviceGroup);
                                            }
                                            thiss.removeElement(service.id);
                                        }
                                        else {
                                            service.label = service.label || ((data.mapName !== undefined) ? data.mapName : data.name);
                                            service.fullExtent = (data.fullExtent !== undefined) ? data.fullExtent : data.extent;
                                            service.initialExtent = (data.initialExtent !== undefined) ? data.initialExtent : data.extent;
                                            service.extent = data.extent;
                                            service.layers = data.layers;
                                            setLegend(service);
                                            thiss.parseAGSLayers(service);
                                        }
                                    }).fail(function () {
                                        thiss.removeElement(service.id);
                                    });
                                    function setLegend(service) {
                                        jQuery.getJSON(service.url + "/legend?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                            if (data.error !== undefined) {
                                                service.legends = [];
                                                return;
                                            }
                                            service.legends = data.layers;
                                        });
                                    }
                                };
                                this.parseAGSLayers = function (service) {
                                    var thiss = this;
                                    var originalLayers = service.layers;
                                    var layerLegends = service.legends;
                                    var layerIds = service.layerIds;
                                    var layers = [];
                                    var i = 0;
                                    if (layerIds.length > 0) {
                                        for (i = 0; i < originalLayers.length; i++) {
                                            if (originalLayers[i].parentLayerId == -1) {
                                                if (layerIds.indexOf(originalLayers[i].id) > -1)
                                                    layers.push(originalLayers[i]);
                                            }
                                        }
                                    }
                                    else {
                                        for (i = 0; i < originalLayers.length; i++) {
                                            if (originalLayers[i].parentLayerId == -1)
                                                layers.push(originalLayers[i]);
                                        }
                                    }
                                    i = 0;
                                    for (i = 0; i < layers.length; i++) {
                                        if (layers[i].subLayerIds !== null && layers[i].subLayerIds.length > 0)
                                            parseRecursive(layers[i]);
                                    }
                                    setChildren(layers);
                                    service.layers = layers;
                                    function parseRecursive(layer) {
                                        layer.layers = [];
                                        layer.layers2 = [];
                                        var i = 0;
                                        for (i = 0; i < layer.subLayerIds.length; i++) {
                                            var layer2 = originalLayers.find2("id", layer.subLayerIds[i]);
                                            if (layerIds.indexOf(layer.subLayerIds[i]) > -1) {
                                                layer.layers2.push(layer2);
                                            }
                                            layer.layers.push(layer2);
                                            if (layer2.subLayerIds !== null && layer2.subLayerIds.length > 0)
                                                parseRecursive(layer2);
                                        }
                                    }
                                    function setChildren(layers) {
                                        var i = 0;
                                        for (i = 0; i < layers.length; i++) {
                                            if (layers[i].layers instanceof Array && layers[i].layers.length > 0) {
                                                layers[i].layers = (layers[i].layers2.length === 0) ? layers[i].layers : layers[i].layers2;
                                                delete layers[i].layers2;
                                                setChildren(layers[i].layers);
                                            }
                                            else
                                                setLegends(layers[i]);
                                        }
                                    }
                                    function setLegends(layer) {
                                        if (layer === null) return;
                                        var layerLegend = layerLegends.find2("layerId", layer.id);
                                        if (layerLegend !== null) {
                                            layer.legends = layerLegend.legend;
                                            var i = 0;
                                            for (i = 0; i < layer.legends.length; i++) {
                                                layer.legends[i].url = service.url + "/" + layer.id + "/images/" + layer.legends[i].url;
                                            }
                                        }
                                    }
                                };
                                this.parseServices = function (services, services2) {
                                    var thiss = this;
                                    var i = 0;
                                    for (i = 0; i < services.length; i++) {
                                        (function (servicess, servicess2, k) {
                                            if (servicess[k].disabled === true) {
                                                thiss.removeElement(servicess[k].id);
                                                return;
                                            }
                                            servicess2.push(JSON.parse(JSON.stringify(servicess[k])));
                                            var j = servicess2.findIndex2("id", servicess[k].id);
                                            var hasChild = (servicess[k].services !== undefined && servicess[k].services !== null);
                                            if (hasChild === true) {
                                                servicess2[j].services = [];
                                                thiss.parseServices(servicess[k].services, servicess2[j].services);
                                            }
                                            else {
                                                switch (servicess[k].type) {
                                                    case "wms":
                                                        thiss.parseWMS(servicess2[servicess2.length - 1]);
                                                        break;
                                                    case "wfs":
                                                        thiss.parseWFS(servicess2[servicess2.length - 1]);
                                                        break;
                                                    case "agsd":
                                                    case "agst":
                                                        thiss.parseAGS(servicess2[servicess2.length - 1]);
                                                        break;
                                                    default:
                                                }
                                            }
                                        })(services, services2, i);
                                    }
                                };
                            }
                            BaseWidget.prototype.buildTool = function () {
                                this.configView = this.configView || {};
                                this.configView.openInitial = false;
                                this.configView.icon = "gh gh-toc";
                                this.configView.label = "Capas";
                                this.configView.uri = {};
                                this.configView.config = "toc/toc.json";
                                this.configView.location = "left";
                                this.configView.cssClass = ['jca-btn-left'];
                                _super.prototype.buildTool.call(this);
                            };
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.config.module.isWidgetPopup = true;
                                thiss.showView({
                                    dialog: {
                                        maxWidth: 350, maxHeight: 400
                                    }
                                });
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                if (!(thiss.config.module.map.services instanceof Array)) {
                                    alert("No hay capas");
                                    return;
                                }
                                thiss.config.module.widget.services2 = JSON.parse(JSON.stringify(thiss.config.module.map.services));
                                thiss.config.module.widget.services = [];
                                jQuery.ajaxSetup({ async: false });
                                thiss.parseServices(thiss.config.module.widget.services2, thiss.config.module.widget.services);
                                jQuery.ajaxSetup({ async: true });
                                delete thiss.config.module.widget.services2;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.html = '';
                                thiss.writeServices();
                                thiss.$widget.html(thiss.html);
                                thiss.$widget.find('> ul').tree({
                                    checkChildren: false,
                                    singleBranchOpen: false,
                                    initialState: "collapse",
                                    expandOnCheck: false,
                                    collapseOnUnCheck: false
                                });
                            };
                            BaseWidget.prototype.changeVisibility = function (service) {
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        toc.BaseWidget = BaseWidget;
                    })(widgets.toc || (widgets.toc = {}));
                    var toc = widgets.toc;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));