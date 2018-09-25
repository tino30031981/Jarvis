function getObject() {
    return com.jtm.geometry.viewer.widgets.print.html5.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (print) {
                        (function (html5) {
                            var Widget = (function (_super) {
                                __extends(Widget, _super);
                                function Widget() {
                                    _super.call(this);
                                }                                
                                Widget.prototype.getLayers = function () {
                                    var thiss = this;
                                    var service = null;
                                    var items = [];
                                    jQuery.ajaxSetup({ async: false });
                                    thiss.map.layerIds.forEach(function (layerId) {
                                        service = thiss.map.getLayer(layerId);                                        
                                        if (String.isNullOrWhiteSpace(service.id) === true || service.id.startsWith('basemap_') === true) return;
                                        if (service.visible === false) return;
                                        if (service instanceof esri.layers.ArcGISDynamicMapServiceLayer) {                                            
                                            items = items.concat(this.parseLayersAGSD(service.url, service.visibleLayers));
                                        }
                                        else if (service instanceof esri.layers.ArcGISTiledMapServiceLayer) {
                                            items = items.concat(this.parseLayersAGST(service.url));
                                        }
                                        else if (service instanceof esri.layers.WMSLayer) {                                            
                                            items = items.concat(this.parseLayersWMS(service.url, service.visibleLayers));                                            
                                        }
                                    }, this);
                                    jQuery.ajaxSetup({ async: true });
                                    return items;
                                };
                                Widget.execute = function () {
                                    return new Widget();
                                };
                                return Widget;
                            })(html5.BaseWidget);
                            html5.Widget = Widget;
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