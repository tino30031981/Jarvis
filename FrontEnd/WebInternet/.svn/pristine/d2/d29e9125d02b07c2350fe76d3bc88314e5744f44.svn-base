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
                                thiss.map.layerIds.forEach(function (layerId) {
                                    if (String.isNullOrWhiteSpace(layerId) === false && layerId.startsWith("basemap_") === true) {
                                        if (thiss.map.getLayer(layerId).visible === true)
                                            thiss.$widget.find('input#' + layerId).attr('checked', true);
                                    }
                                });
                            };
                            Widget.prototype.changeVisibility = function (id) {
                                var thiss = this;
                                var layer = null;
                                thiss.map.layerIds.forEach(function (layerId) {
                                    layer = thiss.map.getLayer(layerId);
                                    if (id == layer.id) {
                                        layer.setVisibility(true);
                                        //thiss.$widget.find('#' + id).addClass('gh-thumbnail-selected');
                                    }
                                    else {
                                        if (String.isNullOrWhiteSpace(layer.id) === false && layer.id.startsWith("basemap_") === true) {
                                            layer.setVisibility(false);
                                            //thiss.$widget.find('#' + layer.get('id')).removeClass('gh-thumbnail-selected');
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