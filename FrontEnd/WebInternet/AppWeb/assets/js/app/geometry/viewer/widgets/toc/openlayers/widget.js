function getObject() {
    return com.jtm.geometry.viewer.widgets.toc.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (toc) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.changeVisibility = function (service) {
                                var thiss = this;
                                thiss.$widget.off('change', '#' + service.id);
                                thiss.$widget.on('change', '#' + service.id, function (e) {
                                    var idd = jQuery(this).attr('id');
                                    var layer = thiss.map.getLayer(idd);
                                    var visibilityLayers = [];
                                    thiss.getLayers(jQuery(this), visibilityLayers);
                                    if (layer !== undefined && layer !== null) {
                                        if (service.type != "agsf") {
                                            if (service.type === "wms")
                                                layer.getSource().updateParams({ LAYERS: visibilityLayers.join(",") });
                                            else
                                                layer.getSource().updateParams({ LAYERS: 'show:' + visibilityLayers.join(",") });
                                            if (visibilityLayers.length === 0)
                                                layer.setVisible(false);
                                            else
                                                layer.setVisible(jQuery(this).is(':checked'));
                                        }
                                        else
                                            layer.setVisible(jQuery(this).is(':checked'));
                                    }
                                });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(toc.BaseWidget);
                        toc.Widget = Widget;
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