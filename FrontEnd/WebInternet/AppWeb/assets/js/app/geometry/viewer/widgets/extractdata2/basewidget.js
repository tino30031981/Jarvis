(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (extractdata) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlLayer = null;
                                this.html = null;
                                this.html2 = null;
                                this.$ddlSpatialReferenceOutput = null;
                                this.$ddlFormat = null;
                                this.$ddlAnalysis = null;
                                this.$divStatus = null;
                                this.$fds = null;
                                this.geoprocessor = null;
                                this.setService = function (url) {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    setData(thiss.config.module.widget.url);
                                    jQuery.ajaxSetup({ async: true });
                                    function setData(url) {
                                        url = url || thiss.config.module.widget.url;
                                        var service = [];
                                        jQuery.getJSON(url + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                            var service2 = data.parameters[0].choiceList;
                                            if (service2 == undefined || service2 == null) return;
                                            service2.forEach(function (service3, i) {
                                                service.push({ id: i, name: service3 });
                                            });
                                        }).fail(function (data, textStatus, jqXHR) {
                                            service = [];
                                        });
                                        thiss.config.module.widget.services = service;
                                    }
                                };
                                this.setServiceExternal = function (items) {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    setData(items);
                                    jQuery.ajaxSetup({ async: true });
                                    function setData(items) {
                                        var services = [];
                                        items.forEach(function (item, j) {
                                            var service = null;
                                            if (item.layerIds === undefined || item.layerIds === null) return;
                                            jQuery.getJSON(item.url + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                                if (data.layers == undefined || data.layers == null || data.layers.length < 1) return;
                                                service = {};
                                                service.id = item.id;
                                                service.label = item.label;
                                                service.url = item.url;
                                                service.services = [];
                                                var layers = getFeactureLayers(data.layers);
                                                if (item.layerIds == "*" || item.layerIds == "") {
                                                    layers.forEach(function (service3, i) {
                                                        service.services.push({ id: service3.id, label: service3.name });
                                                    });
                                                }
                                                else if (item.layerIds.split(',').length > 0 || item.layerIds.split('.').length > 0) {
                                                    var layersIds = item.layerIds.split(',');
                                                    layers.forEach(function (service3, k) {
                                                        if (service3.id == layersIds[k])
                                                            service.services.push({ id: service3.id, label: service3.name });
                                                    });
                                                }
                                                else 
                                                    service = null;

                                                function getFeactureLayers(layers) {
                                                    var layers2 = [];
                                                    layers.forEach(function (layer, h) {
                                                        if (layer.subLayerIds == null)
                                                            layers2.push(layer)
                                                    });
                                                    return layers2;
                                                }
                                            }).fail(function (data, textStatus, jqXHR) {
                                                service = null;
                                            });
                                            if (service != {} && service != null)
                                                services.push(service);
                                        });
                                        thiss.config.module.widget.servicesExternal = services;
                                    }
                                };
                                this.writeServicesExternal = function (services, isBoolean) {
                                    var thiss = this;
                                    services = services || this.config.module.widget.servicesExternal;
                                    var tree = isBoolean == true ? "" : "tree root";
                                    this.html2 += '<ul class="' + tree + '">';
                                    var i = 0;
                                    for (i = 0; i < services.length; i++) {
                                        var hasChild = (services[i].services !== undefined && services[i].services !== null);
                                        var url = (services[i].url !== undefined && services[i].url !== null) ? services[i].url : "";
                                        this.html2 += '<li id="li_' + services[i].id + '" url=' + url + '>';
                                        this.writeTree(services[i], hasChild);
                                        if (hasChild)
                                            this.writeServicesExternal(services[i].services, true);
                                        this.html2 += '</li>';
                                    }
                                    this.html2 += '</ul>';
                                };
                                this.writeTree = function (service, hasChild) {
                                    var thiss = this;
                                    if (hasChild === false) {
                                        this.html2 += '<input type="checkbox" id="' + service.id + '" value="-1" data-label="' + service.label + '" />';
                                        thiss.html2 += ((service.label === undefined || service.label === null || service.label === "") ? service.name : service.label);
                                    }
                                    else {
                                        this.html2 += service.label;
                                    }
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
                                        this.html += '<input type="checkbox" id="' + services[i].id + '" value="' + services[i].name + '" />';
                                        if (hasChild === false) {
                                            thiss.html += ((services[i].label === undefined || services[i].label === null || services[i].label === "") ? services[i].name : services[i].label);
                                        }
                                        else {
                                            this.html += services[i].label;
                                        }
                                        if (hasChild)
                                            this.writeServices(services[i].services);
                                        this.html += '</li>';
                                    }
                                    this.html += '</ul>';
                                };
                                this.getLayers = function () {
                                    var thiss = this;
                                    var layers = [];
                                    thiss.$divListServicesInternal.find('ul').find('input:checkbox:checked').toArray().forEach(function (chk) {
                                        layers.push($(chk).val());
                                    });
                                    return layers;
                                };
                                this.getLayersExternal = function () {
                                    var thiss = this;
                                    var layers = [];
                                    thiss.$divListServicesExternal.find('ul').find('li').toArray().forEach(function (li) {
                                        $(li).find('ul').find('input:checkbox:checked').toArray().forEach(function (chk) {
                                            var add = { url: $(li).attr('url'), id: $(chk).attr("id"), name: $(chk).attr("data-label") };
                                            layers.push(add);
                                        });
                                    });
                                    return layers;
                                };
                                this.searchInServiceExternal = function (geometry) {
                                    var thiss = this;
                                    var layers = thiss.getLayersExternal();
                                    var coordinates = [];
                                    if (layers.length === 0) {
                                        toastr.info("Debe seleccionar una capa");
                                        return;
                                    } else if (layers.length > 5) {
                                        toastr.info("Debe seleccionar un maximo de 5 capas");
                                        return;
                                    }
                                    geometry.rings[0].forEach(function (item) {
                                        coordinates.push({ x: parseFloat(item[0]), y: parseFloat(item[1]) });
                                    });
                                    var options = {
                                        data: {
                                            layerTables: layers,
                                            coordinates: coordinates,
                                            spatialReference: { id: geometry.spatialReference.wkid }
                                        },
                                        validate: true,
                                        isJson: true
                                    };
                                    thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/useful/generateshapefilebygeometry', options, function (data) {
                                        if (data.extra != "" && data.extra != null) {
                                            thiss.$aDownload.attr("href", com.jtm.Server.contextPath + "miningconcession/useful/formdownload?fileName=" + data.extra);
                                            thiss.$aDownload.show();
                                        }
                                    });
                                };
                            }
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                                thiss.setService();
                                thiss.searchConfig(com.jtm.Server.contextPath + 'geometry/layertable/list2', { data: {}, async: false }, function (items) {
                                    thiss.setServiceExternal(items);
                                });
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$btnDownload = this.$widget.find('#btnDownload');
                                this.$btnGraphicFile = this.$widget.find('#btnGraphicFile');
                                //this.$btnPoint = this.$widget.find("#btnPoint");
                                this.$btnPolyline = this.$widget.find("#btnPolyline");
                                //this.$btnPolylineFreeHand = this.$widget.find("#btnPolylineFreeHand");
                                this.$btnRectangle = this.$widget.find("#btnRectangle");
                                //this.$btnCircle = this.$widget.find("#btnCircle");
                                this.$btnEllipse = this.$widget.find("#btnEllipse");
                                this.$btnPolygon = this.$widget.find("#btnPolygon");
                                //this.$btnPolygonFreeHand = this.$widget.find("#btnPolygonFreeHand");
                                this.$ddlSpatialReference = this.$widget.find('#ddlSpatialReference');
                                this.$ddlSpatialReferenceOutput = this.$widget.find('#ddlSpatialReferenceOutput');
                                this.$ddlLayer = this.$widget.find('#ddlLayer');
                                this.$ddlFormat = this.$widget.find('#ddlFormat');
                                this.$txtRadio = this.$widget.find('#txtRadio');
                                this.$divGraphic = this.$widget.find('#divGraphic');
                                this.$divFile = this.$widget.find('#divFile');
                                this.$divListServicesInternal = this.$widget.find('#divListServicesInternal');
                                this.$divListServicesExternal = this.$widget.find('#divListServicesExternal');
                                this.$rbtSource = this.$widget.find('input[type=radio][name=rbtSource]');
                                this.$divRbtFile = this.$widget.find('#divRbtFile');
                                this.$divStatus = this.$widget.find('#divStatus');
                                this.$chkServiceType = this.$widget.find('#chkServiceType');
                                this.$aDownload = this.$widget.find('#aDownload');

                                thiss.$chkServiceType.off("change");
                                thiss.$chkServiceType.on("change", function () {
                                    thiss.$aDownload.hide();
                                    if (jQuery(this).is(":checked") === true) {
                                        thiss.$divListServicesExternal.show();
                                        thiss.$divListServicesInternal.hide();
                                        thiss.$divRbtFile.hide();
                                        thiss.$btnEllipse.hide();
                                        thiss.$btnPolyline.hide();
                                        thiss.$ddlFormat.val(thiss.$ddlFormat.find("option:first").val());
                                        thiss.$ddlFormat.prop('disabled', true);
                                    } else {
                                        thiss.$divListServicesInternal.show();
                                        thiss.$divListServicesExternal.hide();
                                        thiss.$divRbtFile.show();
                                        thiss.$btnEllipse.show();
                                        thiss.$btnPolyline.show();
                                        thiss.$ddlFormat.prop('disabled', false);
                                    }
                                });
                                thiss.$chkServiceType.trigger("change");
                                thiss.$aDownload.hide();
                                thiss.$divGraphic.hide();
                                thiss.$divFile.hide();
                                thiss.$rbtSource.off("change");
                                thiss.$rbtSource.on("change", function (e) {
                                    if (jQuery(this).is(":checked") === true) {
                                        if (this.value == 1) {
                                            thiss.$divGraphic.show();
                                            thiss.$divFile.hide();
                                        } else if (this.value == 2) {
                                            thiss.$divGraphic.hide();
                                            thiss.$divFile.show();
                                        }
                                    }
                                });
                                thiss.html = "";
                                thiss.writeServices();
                                thiss.$divListServicesInternal.empty();
                                thiss.$divListServicesInternal.html(thiss.html);
                                thiss.$divListServicesInternal.find('> ul').tree({
                                    checkChildren: false,
                                    singleBranchOpen: false,
                                    initialState: "collapse",
                                    expandOnCheck: false,
                                    collapseOnUnCheck: false
                                });
                                thiss.html2 = "";
                                thiss.writeServicesExternal();
                                thiss.$divListServicesExternal.empty();
                                thiss.$divListServicesExternal.html(thiss.html2);
                                thiss.$divListServicesExternal.find('> ul').tree({
                                    checkChildren: false,
                                    singleBranchOpen: false,
                                    initialState: "collapse",
                                    expandOnCheck: false,
                                    collapseOnUnCheck: false
                                });

                                thiss.$rbtSource.trigger("change");
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlFormat,
                                    items: thiss.config.module.widget.formats
                                });
                                /*com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "geometry/spatialreference/list",
                                    ddl: thiss.$ddlSpatialReferenceOutput
                                });*/
                                thiss.$txtRadio.numeric({ negative: false });
                                thiss.$txtRadio.val(thiss.config.module.widget.defaultRadio);
                                thiss.$btnDownload.off("click");
                                thiss.$btnDownload.on("click", function () {
                                    thiss.download();
                                });
                                thiss.$btnPolyline.off("click");
                                thiss.$btnPolyline.on("click", function (e) {
                                    thiss.drawPolyline();
                                });
                                thiss.$btnPolygon.off("click");
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.drawPolygon();
                                });
                                thiss.$btnRectangle.off("click");
                                thiss.$btnRectangle.on("click", function (e) {
                                    thiss.drawRectangle();
                                });
                                thiss.$btnEllipse.off("click");
                                thiss.$btnEllipse.on("click", function (e) {
                                    thiss.drawEllipse();
                                });
                                //thiss.$btnPoint.off("click");
                                //thiss.$btnPoint.on("click", function (e) {
                                //    thiss.drawPoint();
                                //});
                                //thiss.$btnPolylineFreeHand.off("click");
                                //thiss.$btnPolylineFreeHand.on("click", function (e) {
                                //    thiss.drawPolylineFreeHand();
                                //});
                                //thiss.$btnCircle.off("click");
                                //thiss.$btnCircle.on("click", function (e) {
                                //    thiss.drawCircle();
                                //});
                                //thiss.$btnPolygonFreeHand.off("click");
                                //thiss.$btnPolygonFreeHand.on("click", function (e) {
                                //    thiss.drawPolygonFreeHand();
                                //});
                            };
                            BaseWidget.prototype.resetContainers = function (toNull) {
                                var thiss = this;
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                var thiss = this;
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        extractdata.BaseWidget = BaseWidget;
                    })(widgets.extractdata || (widgets.extractdata = {}));
                    var extractdata = widgets.extractdata;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));