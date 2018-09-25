(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (identify) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlLayer = null;
                                this.$divFeatures = null;
                                this.$divFeatureSelected = null;
                                this.$list = null;
                                this.treeNode = null;
                                this.setValues = function (datas) {
                                    var items = [];
                                    datas.forEach(function (data, i) {
                                        var item = {};
                                        item.label = data.label;
                                        item.alpha = data.alpha;
                                        item.type = data.type;
                                        item.layers = data.layerIds;
                                        item.disabled = data.disabled;
                                        item.id = data.id;
                                        item.visible = data.visible;
                                        item.url = data.url;
                                        items.push(item);
                                    });
                                    return items;
                                };
                                this.parseAGSD = function (service) {
                                    var thiss = this;
                                    jQuery.getJSON(service.url + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                        var layers = data.layers;
                                        var i = 0;
                                        var j = 0;
                                        if (service.layers.length > 0) {
                                            for (i = 0; i < layers.length; i++) {
                                                j = 0;
                                                for (j = 0; j < service.layers.length; j++) {
                                                    if (typeof service.layers[j] === "object") {
                                                        if (layers[i].subLayerIds instanceof Array) {
                                                            continue;
                                                        }
                                                        if (service.layers[j].disabled === true) continue;
                                                        if (layers[i].id == service.layers[j].id)
                                                            setData(layers[i]);
                                                    }
                                                    else if (typeof service.layers[j] === "string" || typeof service.layers[j] === "number") {
                                                        if (layers[i].subLayerIds instanceof Array) {
                                                            continue;
                                                        }
                                                        if (layers[i].id == service.layers[j])
                                                            setData(layers[i]);
                                                    }
                                                }
                                            }
                                        }
                                        else
                                            if (layers != null)
                                                for (i = 0; i < layers.length; i++) {
                                                    if (layers[i].subLayerIds instanceof Array) {
                                                        continue;
                                                    }
                                                    setData(layers[i]);
                                                }
                                    });
                                    function setData(layer) {
                                        var uuid = thiss.getUUID();
                                        thiss.config.module.widget.layers2.push({
                                            uuid: uuid,
                                            url: service.url,
                                            id: layer.id,
                                            name: layer.name,
                                            type: service.type
                                        });
                                    }
                                };
                                this.parseWMS = function (service) {
                                    var thiss = this;
                                    var queryString = "service=WMS&version=1.3.0&request=getcapabilities&rnd=" + Math.random();
                                    service.url = (service.url.endsWith("?") ? service.url : service.url + "?");
                                    var data = null;
                                    jQuery.ajax(service.url + queryString).done(function (response) {
                                        data = jQuery.xml2json(response);
                                        var layers = data.Capability.Layer.Layer;
                                        var i = 0;
                                        var j = 0;
                                        //console.log(layers);
                                        //console.log(service.layers);
                                        if (service.layers.length > 0) {
                                            for (i = 0; i < layers.length; i++) {
                                                j = 0;
                                                for (j = 0; j < service.layers.length; j++) {
                                                    if (typeof service.layers[j] === "object") {
                                                        if (service.layers[j].disabled === true) continue;
                                                        //console.log(BaseWidget.LAYERDEFAULTCOORPORATE.indexOf(service.layers[j].id.toLowerCase()));
                                                        if (BaseWidget.LAYERDEFAULTCOORPORATE.indexOf(service.layers[j].id.toLowerCase()) > -1) continue;
                                                        if (layers[i].Name.toLowerCase() == service.layers[j].id.toLowerCase())
                                                            setData(layers[i]);
                                                    }
                                                    else if (typeof service.layers[j] === "string" || typeof service.layers[j] === "number") {
                                                        //console.log(BaseWidget.LAYERDEFAULTCOORPORATE.indexOf(service.layers[j].toLowerCase()));
                                                        if (BaseWidget.LAYERDEFAULTCOORPORATE.indexOf(service.layers[j].toLowerCase()) > -1) continue;
                                                        if (layers[i].Name.toLowerCase() == service.layers[j].toLowerCase())
                                                            setData(layers[i]);
                                                    }
                                                }
                                            }
                                        }
                                        else
                                            for (i = 0; i < layers.length; i++) {
                                                //console.log(layers[i]);
                                                if (BaseWidget.LAYERDEFAULTCOORPORATE.indexOf(layers[i].toLowerCase()) > -1) continue;
                                                setData(layers[i]);
                                            }
                                    });
                                    function setData(layer) {
                                        var uuid = thiss.getUUID();
                                        thiss.config.module.widget.layers3.push({
                                            uuid: uuid,
                                            url: service.url,
                                            id: layer.Name,
                                            name: layer.Title,
                                            type: service.type
                                        });
                                        //thiss.addLayer(service.url, layer.Name, uuid);
                                    }
                                };
                                this.parseServices = function () {
                                    var thiss = this;
                                    data = {};
                                    jQuery.ajaxSetup({ async: false });
                                    /***********************************************************************************/
                                    $.ajax({
                                        url: com.jtm.Server.contextPath + "geometry/layertable/searchbyoffice",
                                        type: 'post',
                                        success: function (data) {
                                            if (data === null) return;
                                            data = JSON.parse(data);
                                            items = thiss.setValues(data.items);
                                            items = thiss.config.module.widget.services.concat(items);
                                            if (items === null) return;
                                            var i = 0;
                                            for (i = 0; i < items.length; i++) {
                                                if (items[i].disabled === true) continue;
                                                items[i].layers = String.isNullOrWhiteSpace(items[i].layers) === true ? [] : items[i].layers;
                                                items[i].layers = (items[i].layers instanceof Array ? items[i].layers : items[i].layers.split(","));
                                                items[i].layers = (items[i].layers.length === 1 && items[i].layers[0] == "*") ? [] : items[i].layers;
                                                items[i].url = items[i].url.startsWith('http') === false ? com.jtm.Server.contextPath + items[i].url : items[i].url;
                                                if (items[i].type == "agsd") {
                                                    thiss.parseAGSD(items[i]);
                                                }
                                                else if (items[i].type == "wms") {
                                                    console.log(items[i]);
                                                    thiss.parseWMS(items[i]);
                                                }
                                            }
                                            //thiss.config.module.widget.layers = items;
                                        },
                                        error: function (items) { /*thiss.config.module.widget.layers = [];*/ /*console.log(items);*/ }
                                    });
                                    /***********************************************************************************/
                                    /*var i = 0;
                                    for (i = 0; i < thiss.config.module.widget.services.length; i++) {
                                        if (thiss.config.module.widget.services[i].disabled === true) continue;
                                        thiss.config.module.widget.services[i].layers = String.isNullOrWhiteSpace(thiss.config.module.widget.services[i].layers) === true ? [] : thiss.config.module.widget.services[i].layers;
                                        thiss.config.module.widget.services[i].layers = (thiss.config.module.widget.services[i].layers instanceof Array ? thiss.config.module.widget.services[i].layers : thiss.config.module.widget.services[i].layers.split(","));
                                        thiss.config.module.widget.services[i].layers = (thiss.config.module.widget.services[i].layers.length === 1 && thiss.config.module.widget.services[i].layers[0] == "*") ? [] : thiss.config.module.widget.services[i].layers;
                                        thiss.config.module.widget.services[i].url = thiss.config.module.widget.services[i].url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.services[i].url : thiss.config.module.widget.services[i].url;
                                        if (thiss.config.module.widget.services[i].type == "agsd"){   
                                            thiss.parseAGSD(thiss.config.module.widget.services[i]);
                                        }
                                        else if (thiss.config.module.widget.services[i].type == "wms") {
                                            thiss.parseWMS(thiss.config.module.widget.services[i]);
                                        
                                    }*/
                                    jQuery.ajaxSetup({ async: true });
                                    //delete thiss.config.module.widget.services;
                                }
                                this.getLayers = function () {
                                    var thiss = this;
                                    if (thiss.$rdbServiceType.filter(":checked").val() == 1)
                                        items2 = thiss.config.module.widget.layers2;
                                    else
                                        items2 = thiss.config.module.widget.layers3;
                                    var items = [];
                                    if (thiss.$ddlLayer.val() == BaseWidget.DDLVALUEDEFAULT) {
                                        items = items2;
                                    }
                                    else {
                                        var i = 0;
                                        for (i = 0; i < items2.length; i++) {
                                            if (items2[i].uuid == thiss.$ddlLayer.val()) {
                                                items.push(items2[i]);
                                                break;
                                            }
                                        }
                                    }
                                    return items;
                                }
                                this.fillData = function parse(data) {
                                    var thiss = this;
                                    thiss.$list.append('<li>' + data.layerName + '</li>');
                                    thiss.$list.find('>li:last').append('<ul></ul');
                                    data.features.forEach(function (feature, i) {
                                        thiss.$list.find('>li:last').find('ul').append('<li id="' + feature.id + '">' + feature.displayFieldName + '</li>');
                                        delete feature.displayFieldName;
                                    });
                                    thiss.$list.tree();
                                };
                                this.transform = function (geometry, toSrid) {
                                    var coordinates = null;
                                    if (geometry.type === BaseWidget.OGCTYPES.POINT) {
                                        coordinates = this.project(geometry.coordinates, geometry.spatialReference.id, toSrid);
                                    }
                                    else if (geometry.type === BaseWidget.OGCTYPES.LINESTRING) {
                                        coordinates = [];
                                        var coordinatesOriginal = geometry.coordinates;
                                        coordinatesOriginal.forEach(function (coordinate) {
                                            coordinates.push(this.project(coordinate, geometry.spatialReference.id, toSrid));
                                        }, this);
                                    }
                                    else if (geometry.type === BaseWidget.OGCTYPES.POLYGON) {
                                        coordinates = [[]];
                                        var coordinatesOriginal = geometry.coordinates;
                                        if ((coordinatesOriginal[0][0] instanceof Array) === false || coordinatesOriginal[0][0] === undefined)
                                            coordinatesOriginal = [coordinatesOriginal];
                                        coordinatesOriginal[0].forEach(function (coordinate) {
                                            coordinates[0].push(this.project(coordinate, geometry.spatialReference.id, toSrid));
                                        }, this);
                                        var lastIndex = coordinates[0].length - 1;
                                        if (coordinates[0][0][0] !== coordinates[0][lastIndex][0] || coordinates[0][0][1] !== coordinates[0][lastIndex][1])
                                            coordinates[0].push(coordinates[0][0]);
                                    }
                                    return gemetry2 = {
                                        type: geometry.type,
                                        coordinates: coordinates, spatialReference: { id: toSrid }
                                    };
                                };
                            }
                            BaseWidget.COLUMNGEOMETRYIDENTIFY = "the_geom";
                            BaseWidget.SRIDDEFAULTINDENTIFY = 4326;
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 300 }
                                });
                            };
                            BaseWidget.LAYERDEFAULTCOORPORATE = ['derechominerovista', 'proyectominerovista', 'ueavista', 'derechosuperficialvista'];
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.layers = [];
                                thiss.config.module.widget.layers2 = [];
                                thiss.config.module.widget.layers3 = [];
                                thiss.parseServices();
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$ddlLayer = thiss.$widget.find("#ddlLayer");
                                this.$btnPoint = thiss.$widget.find("#btnPoint");
                                this.$btnPolyline = thiss.$widget.find("#btnPolyline");
                                this.$btnPolylineFreeHand = thiss.$widget.find("#btnPolylineFreeHand");
                                this.$btnRectangle = thiss.$widget.find("#btnRectangle");
                                this.$btnCircle = thiss.$widget.find("#btnCircle");
                                this.$btnEllipse = thiss.$widget.find("#btnEllipse");
                                this.$btnPolygon = thiss.$widget.find("#btnPolygon");
                                this.$btnPolygonFreeHand = thiss.$widget.find("#btnPolygonFreeHand");
                                this.$divFeatures = thiss.$widget.find("#divFeatures");
                                this.$divFeatureSelected = thiss.$widget.find("#divFeatureDetail");
                                thiss.$divFeatures.html('<ul class="tree root"></ul>');
                                this.$list = this.$divFeatures.find('>ul');
                                this.$rdbServiceType = this.$widget.find('input[type=radio][name=serviceType]');
                                thiss.$btnPoint.off("click");
                                thiss.$btnPoint.on("click", function (e) {
                                    thiss.drawPoint();
                                });
                                thiss.$btnPolyline.off("click");
                                thiss.$btnPolyline.on("click", function (e) {
                                    thiss.drawPolyline();
                                });
                                thiss.$btnPolylineFreeHand.off("click");
                                thiss.$btnPolylineFreeHand.on("click", function (e) {
                                    thiss.drawPolylineFreeHand();
                                });
                                thiss.$btnRectangle.off("click");
                                thiss.$btnRectangle.on("click", function (e) {
                                    thiss.drawRectangle();
                                });
                                thiss.$btnCircle.off("click");
                                thiss.$btnCircle.on("click", function (e) {
                                    thiss.drawCircle();
                                });
                                thiss.$btnEllipse.off("click");
                                thiss.$btnEllipse.on("click", function (e) {
                                    thiss.drawEllipse();
                                });
                                thiss.$btnPolygon.off("click");
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.drawPolygon();
                                });
                                thiss.$btnPolygonFreeHand.off("click");
                                thiss.$btnPolygonFreeHand.on("click", function (e) {
                                    thiss.drawPolygonFreeHand();
                                });
                                thiss.$rdbServiceType.off("change");
                                thiss.$rdbServiceType.on("change", function () {
                                    if (jQuery(this).is(":checked") === true) {
                                        if (jQuery(this).val() == 1) {
                                            com.jtm.helper.DropDownList.fillLocal({
                                                ddl: thiss.$ddlLayer,
                                                items: thiss.config.module.widget.layers2,
                                                fieldId: "uuid",
                                                fieldName: "name",
                                                addDefaultOption: true
                                            });
                                        }
                                        else if (jQuery(this).val() == 2) {
                                            com.jtm.helper.DropDownList.fillLocal({
                                                ddl: thiss.$ddlLayer,
                                                items: thiss.config.module.widget.layers3,
                                                fieldId: "uuid",
                                                fieldName: "name",
                                                addDefaultOption: true
                                            });
                                        }
                                    }
                                });
                                thiss.$rdbServiceType.trigger("change");
                                thiss.$ddlLayer.val(thiss.$ddlLayer.find("option:eq(1)").val());
                            };
                            BaseWidget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                if (this.$list !== null)
                                    this.$list.html('');
                                if (this.$divFeatureSelected !== null)
                                    this.$divFeatureSelected.html('');
                            };
                            BaseWidget.prototype.addLayer = function (url, layerId, uuid) {
                            };
                            BaseWidget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
                                this.$divFeatureSelected.empty();
                            };
                            BaseWidget.prototype.onMouseOverGraphicToElement = function (graphic, $dom, options) {
                                var thiss = this;
                                var element = $dom.find("#" + options.id);
                                $dom.find("." + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                                //element[0].scrollIntoView();
                                element.addClass(BaseWidget.ELEMENTSELECTED);
                            };
                            BaseWidget.prototype.onMouseOutGraphicToElement = function (graphic, $dom, options) {
                                var thiss = this;
                                $dom.find("." + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                            };

                            BaseWidget.prototype.onMouseClickElementToGraphic = function (element, layer, options) {
                                var thiss = this;
                                if (String.isNullOrWhiteSpace(element)) return;
                                jQuery(element).closest(thiss.$list).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                                jQuery(element).addClass(BaseWidget.ELEMENTSELECTED);
                                thiss.$divFeatureSelected.empty();
                            };
                            BaseWidget.prototype.onMouseOverElementToGrahic = function (element, layer, options) {
                                var thiss = this;
                                if (String.isNullOrWhiteSpace(element)) return;
                                jQuery(element).closest(thiss.$list).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                                jQuery(element).addClass(BaseWidget.ELEMENTSELECTED);
                            };
                            BaseWidget.prototype.onMouseOutElementToGrahic = function (element, layer, options) {
                                var thiss = this;
                                if (String.isNullOrWhiteSpace(element)) return;
                                jQuery(element).closest(thiss.$list).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                if (this.$divFeatures !== null)
                                    this.$divFeatures.empty();
                                if (this.$divFeatureSelected !== null)
                                    this.$divFeatureSelected.empty();
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        identify.BaseWidget = BaseWidget;
                    })(widgets.identify || (widgets.identify = {}));
                    var identify = widgets.identify;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));