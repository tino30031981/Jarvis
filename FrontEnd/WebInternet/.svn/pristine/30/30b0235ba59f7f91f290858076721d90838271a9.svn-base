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
                                    var type = jQuery(this).attr('data-type');
                                    if (type == "wfs") {
                                        var layers = jQuery(this).siblings('ul').find('>li>input:checkbox');
                                        //console.log(layers);
                                        for (var k = 0; k < layers.length; k++)
                                            changeLayer($(layers[k]), jQuery(this));
                                    }
                                    else {
                                        var visibilityLayers = [];
                                        thiss.getLayers(jQuery(this), visibilityLayers);
                                        if (layer !== undefined && layer !== null) {
                                            if (service.type != "agsf") {
                                                layer.setVisibleLayers(visibilityLayers);
                                                if (visibilityLayers.length === 0)
                                                    layer.setVisibility(false);
                                                else
                                                    layer.setVisibility(jQuery(this).is(':checked'));
                                            }
                                            else
                                                layer.setVisibility(jQuery(this).is(':checked'));
                                        }
                                    }
                                });
                                function changeLayer($dom2, $dom) {
                                    var visibilityLayers = [];
                                    var layerId = $dom2.attr('id');
                                    //console.log(layerId);
                                    var layer = thiss.map.getLayer(layerId);
                                    //console.log(layer);
                                    thiss.getLayers($dom, visibilityLayers);
                                    if (layer !== undefined && layer !== null) {
                                        if (visibilityLayers.length > 0)
                                            layer.setVisibility($dom2.is(':checked'));
                                        else
                                            layer.setVisibility(false);
                                        layer.resume();
                                    }
                                }
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