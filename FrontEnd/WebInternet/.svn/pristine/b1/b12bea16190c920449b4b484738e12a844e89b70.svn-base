function getObject() {
    return com.jtm.webservice.widgets.wms.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wms) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new ol.layer.Tile({
                                    source: new ol.source.TileWMS({
                                        params: { LAYERS: null, TILED: true, VERSION: '1.3.0' },
                                        tileLoadFunction: function (tile, src) {
                                            jQuery.get(src).done(function (data) {
                                                tile.getImage().src = src;
                                            });
                                        }
                                    })
                                });
                                thiss.layer.setVisible(true);
                                thiss.map.addLayer(thiss.layer);
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                this.detachMapEventsSynchronize();
                                this.infoWindow.hide();
                                if (this.layer !== null) {
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                            };
                            Widget.prototype.fitExtent = function () {
                                var thiss = this;
                                var extent = thiss.layer.getExtent();
                                thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                            };
                            Widget.prototype.addToMap = function (item) {
                                var thiss = this;
                                var params = thiss.layer.getSource().getParams();
                                params.LAYERS = item.id;
                                thiss.layer.getSource().updateParams(params);
                                thiss.layer.getSource().setUrl(item.url);
                                thiss.layer.set("id", item.oid);
                                thiss.layer.set("extent", ol.proj.transformExtent(item.extent, item.srid, thiss.map.getView().getProjection()));
                                thiss.layer.getSource().refresh();
                                thiss.layer.getSource().once('tileloadend', function (e) {
                                    thiss.fitExtent();
                                });
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(wms.BaseWidget);
                        wms.Widget = Widget;
                    })(widgets.wms || (widgets.wms = {}));
                    var wms = widgets.wms;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));