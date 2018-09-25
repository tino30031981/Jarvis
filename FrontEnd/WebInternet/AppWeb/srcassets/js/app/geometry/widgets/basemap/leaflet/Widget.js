function getObject() {
    return com.jtm.geometry.viewer.widgets.basemap.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (basemap) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.currentMap = function () {
                                var thiss = this;
                                var layer = null;
                                thiss.map.layers.forEach(function (layer) {
                                    if (String.isNullOrWhiteSpace(layer.id) === false && layer.id.startsWith("basemap_") === true) {
                                        if (layer.visible === true)
                                            thiss.$widget.find('input#' + layer.get("id")).attr('checked', true);
                                    }
                                });
                            };
                            Widget.prototype.changeVisibility = function (id) {
                                var thiss = this;
                                thiss.map.addLayer(thiss.map.layers[0]);
                                thiss.map.layers.forEach(function (layer) {
                                    if (id == layer.id) {
                                        thiss.map.addLayer(layer);
                                        //jQuery('#' + thiss.domWidget + ' #' + id).addClass('gh-thumbnail-selected');
                                    }
                                    else {
                                        if (String.isNullOrWhiteSpace(layer.id) === false && layer.id.startsWith("basemap_") === true) {
                                            thiss.map.removeLayer(layer);
                                            //jQuery('#' + thiss.domWidget + ' #' + layer.id).removeClass('gh-thumbnail-selected');
                                        }
                                    }
                                });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(basemap.BaseWidget);
                        basemap.Widget = Widget;
                    })(widgets.basemap || (widgets.basemap = {}));
                    var basemap = widgets.basemap;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));