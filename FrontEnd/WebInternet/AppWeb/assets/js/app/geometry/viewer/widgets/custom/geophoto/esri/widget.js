function getObject() {
    return com.jtm.geometry.viewer.widgets.custom.geophoto.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (geophoto) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                }
                                Widget.prototype.launchView = function () {
                                    var thiss = this;
                                    _super.prototype.launchView.call(this);
                                    thiss.layer = thiss.buildGraphicsLayer();
                                    if (this.layerOnClick !== null)
                                        this.layerOnClick.remove();
                                    this.layerOnClick = thiss.layer.on("click", function (e) {
                                        thiss.form();
                                    });
                                };
                                Widget.prototype.detail = function (graphic) {
                                    var thiss = this;
                                    thiss.map.infoWindow.hide();
                                };
                                Widget.prototype.search = function () {
                                    var thiss = this;
                                    this.layerData.clear();
                                    if (validate() === false) return;
                                    var queryTask = new esri.tasks.QueryTask(thiss.config.module.widget.serviceData.url + "/" + thiss.config.module.widget.serviceData.layerId);
                                    var query = new esri.tasks.Query();
                                    query.where = thiss.getSql();
                                    query.outFields = ['*'];
                                    query.returnGeometry = true;
                                    queryTask.execute(query, function (data) {
                                        data.features.forEach(function (feature) {
                                            feature.setId(feature.attributes.id);
                                        });
                                        thiss.layerData.addAll(data.features);
                                        var extent = esri.graphicsExtent(thiss.layerData.graphics);
                                        if (extent !== null)
                                            thiss.map.setExtent(extent, true);
                                    });
                                    function validate() {
                                        var message = '';
                                        var success = true;
                                        if (thiss.$ddlDistrict.int32() === 0) {
                                            message = "Por favor seleccione un distrito";
                                            success = false;
                                        }
                                        if (success === false)
                                            toastr.info(message);
                                        return success;
                                    }
                                };
                                Widget.prototype.searchScope = function (layerId, id) {
                                    var thiss = this;
                                    var queryTask = new esri.tasks.QueryTask(thiss.config.module.widget.service.url + "/" + layerId);
                                    var query = new esri.tasks.Query();
                                    query.where = "id = '{0}'".replace("{0}", id);
                                    query.outFields = ['*'];
                                    query.returnGeometry = true;
                                    queryTask.execute(query, function (data) {
                                        thiss.layer.addAll(data.features);
                                        var extent = esri.graphicsExtent(thiss.layer.graphics);
                                        thiss.map.setExtent(extent, true);
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
                                };
                                Widget.prototype.cleanControls = function () {
                                    _super.prototype.cleanControls.call(this);
                                    this.resetContainers(true);
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(geophoto.BaseWidget);
                            geophoto.Widget = Widget;
                        })(custom.geophoto || (custom.geophoto = {}));
                        var geophoto = custom.geophoto;
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