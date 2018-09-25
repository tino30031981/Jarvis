function getObject() {
    return com.jtm.geometry.viewer.widgets.custom.event.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (event) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                }
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    _super.prototype.launchView.call(this);
                                    thiss.layer = thiss.buildGraphicsLayer();
                                    thiss.layerSelected = thiss.buildGraphicsLayer();
                                    if (this.layerOnClick !== null)
                                        this.layerOnClick.remove();
                                    this.layerOnClick = thiss.layer.on("click", function (e) {
                                        thiss.form(null, e.graphic.getId());
                                    });
                                };
                                Widget.prototype.detail = function (dom, id) {
                                    var thiss = this;
                                    thiss.map.infoWindow.hide();
                                    var $table = jQuery(dom.contentDocument).find("table");
                                    var $resources = jQuery(dom.contentDocument).find("#divResources");
                                    $table.find('>tbody').empty();
                                    var layer = this.config.module.widget.service.layers.find(function (layer) {
                                        return layer.id == this.$ddlLayer.int32();
                                    }, this);
                                    var query = new esri.tasks.Query();
                                    query.where = "id = '{0}'".replace("{0}", id);
                                    query.outFields = ['*'];
                                    query.returnGeometry = true;
                                    var queryTask = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + layer.id);
                                    queryTask.execute(query, function (data) {
                                        if (data.features.length === 0) return;
                                        for (i in data.features[0].attributes) {
                                            if (String.isNullOrWhiteSpace(data.features[0].attributes[i]) === false && data.features[0].attributes[i].toString().trim().startsWith('http') === true) {
                                                data.features[0].attributes[i].split(',').forEach(function (resource) {
                                                    $resources.append('<img src="' + resource + '" class="img-responsive" />');
                                                });
                                            }
                                            else
                                                $table.find('>tbody').append('<tr><td>' + i + '</td><td>' + data.features[0].attributes[i] + '</td></tr>');

                                        }
                                    });
                                };
                                Widget.prototype.search = function () {
                                    var thiss = this;
                                    this.layer.clear();
                                    var layer = this.config.module.widget.service.layers.find(function (layer) {
                                        return layer.id == this.$ddlLayer.int32();
                                    }, this);
                                    if (validate() === false) return;
                                    var graphic = this.layerSelected.graphics[0];
                                    var geometry = null;
                                    if (graphic !== undefined && graphic !== null)
                                        geometry = graphic.geometry;
                                    var queryTask = new esri.tasks.QueryTask(this.config.module.widget.service.url + "/" + layer.id);
                                    var query = new esri.tasks.Query();
                                    query.where = this.getSql();
                                    query.outFields = ['*'];
                                    query.returnGeometry = true;
                                    if (geometry !== null)
                                        query.geometry = geometry;
                                    queryTask.execute(query, function (data) {
                                        data.features.forEach(function (feature) {
                                            feature.setId(feature.attributes.id);
                                        });
                                        thiss.layer.addAll(data.features);
                                        var extent = esri.graphicsExtent(thiss.layer.graphics);
                                        if (extent !== null)
                                            thiss.map.setExtent(extent, true);
                                    });
                                    function validate() {
                                        var message = '';
                                        var success = true;
                                        if (thiss.$ddlLayer.int32() === Widget.DDLVALUEDEFAULT2) {
                                            message = "Por favor seleccione la capa";
                                            success = false;
                                        }
                                        if (layer === null) {
                                            message = "La capa no existe";
                                            success = false;
                                        }
                                        if (success === false)
                                            toastr.info(message);
                                        return success;
                                    }
                                };
                                Widget.prototype.searchScope = function (layerId, id) {
                                    var thiss = this;
                                    var query = new esri.tasks.Query();
                                    query.where = "id = '{0}'".replace("{0}", id);
                                    query.outFields = ['*'];
                                    query.returnGeometry = true;
                                    var queryTask = new esri.tasks.QueryTask(thiss.config.module.widget.servicePoliticalDivision.url + "/" + layerId);
                                    queryTask.execute(query, function (data) {
                                        thiss.layerSelected.addAll(data.features);
                                        var extent = esri.graphicsExtent(thiss.layerSelected.graphics);
                                        thiss.map.setExtent(extent, true);
                                        thiss.search();
                                    });
                                };
                                Widget.prototype.resetContainers = function (toNull) {
                                    var thiss = this;
                                    _super.prototype.resetContainers.call(this, toNull);
                                    thiss.map.infoWindow.hide();
                                    if (this.layer !== null) {
                                        this.layer.clear();
                                        if (toNull === true) {
                                            this.map.removeLayer(this.layer);
                                            this.layer = null;
                                        }
                                    }
                                    if (this.layerDraw !== null) {
                                        this.layerDraw.clear();
                                        if (toNull === true) {
                                            this.map.removeLayer(this.layerDraw);
                                            this.layerDraw = null;
                                        }
                                    }
                                    if (this.layerSelected !== null) {
                                        this.layerSelected.clear();
                                        if (toNull === true) {
                                            this.map.removeLayer(this.layerSelected);
                                            this.layerSelected = null;
                                        }
                                    }
                                };
                                Widget.prototype.cleanControls = function () {
                                    _super.prototype.cleanControls.call(this);
                                    this.resetContainers(true);
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(event.BaseWidget);
                            event.Widget = Widget;
                        })(custom.event || (custom.event = {}));
                        var event = custom.event;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));