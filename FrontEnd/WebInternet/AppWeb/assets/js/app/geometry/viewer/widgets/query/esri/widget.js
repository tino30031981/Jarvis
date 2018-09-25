function getObject() {
    return com.jtm.geometry.viewer.widgets.query.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (query) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new esri.layers.GraphicsLayer({
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layer);
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.deactivate();
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.draw.deactivate();
                                    thiss.searchSpatial(e.geometry);
                                });
                            };
                            Widget.prototype.search = function () {
                                var thiss = this;
                                thiss.layer.clear();
                                var searchText = thiss.$txtSearch.val();
                                var serviceId = thiss.$ddlLayer.val();
                                if (serviceId == Widget.DDLVALUEDEFAULT) { alert("Seleccione la capa"); return; }
                                if (searchText === null || searchText === "") { alert("Ingrese un texto para buscar"); return; }
                                var item = thiss.config.module.widget.services.find2("id", serviceId);
                                var parameters = new esri.tasks.FindParameters();
                                parameters.layerIds = [item.layerId];
                                parameters.searchFields = [];
                                parameters.searchText = searchText;
                                parameters.returnGeometry = true;
                                parameters.outSpatialReference = thiss.map.spatialReference;
                                var task = new esri.tasks.FindTask(item.url);
                                task.execute(parameters).addCallback(function (response) {
                                    thiss.showData(response);
                                });
                            };
                            Widget.prototype.searchSpatial = function (geometry) {
                                var thiss = this;
                                thiss.draw.deactivate();
                                thiss.layer.clear();
                                var serviceId = thiss.$ddlLayer.val();
                                if (serviceId == Widget.DDLVALUEDEFAULT) { alert("Seleccione la capa"); return; }
                                var item = thiss.config.module.widget.services.find2("id", serviceId);
                                var parameters = new esri.tasks.IdentifyParameters();
                                parameters.geometry = geometry;
                                parameters.mapExtent = thiss.map.extent;
                                parameters.tolerance = thiss.config.module.widget.tolerance;
                                parameters.returnGeometry = true;
                                parameters.layerIds = [item.layerId];
                                parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                                parameters.width = thiss.map.width;
                                parameters.height = thiss.map.height;
                                var task = new esri.tasks.IdentifyTask(item.url);
                                task.execute(parameters).addCallback(function (response) {
                                    thiss.showData(response);
                                });
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                this.map.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
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
                        })(query.BaseWidget);
                        query.Widget = Widget;
                    })(widgets.query || (widgets.query = {}));
                    var query = widgets.query;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));