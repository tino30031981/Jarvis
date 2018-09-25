function getObject() {
    return com.jtm.webservice.widgets.wfs.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wfs) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.layer = new ol.layer.Vector({
                                    style: function (feature, resolution) {
                                        var style = thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                        //style.getText().setText(resolution < 5000 ? feature.get('name') : '');
                                        return style;
                                    },
                                    source: new ol.source.Vector({
                                        format: new ol.format.GeoJSON()
                                    })
                                });
                                thiss.layer.setVisible(true);
                                thiss.layer.on('change', function (e) {
                                    thiss.fitExtent();
                                });
                                thiss.map.addLayer(thiss.layer);
                                //                            com.jtm.helper.DropDownList.fillLocal({
                                //                                ddl: thiss.$ddlServer,
                                //                                fieldId: "url",
                                //                                items: thiss.config.module.widget.services,
                                //                                callback: function () {
                                //                                    thiss.searchLayers(this);
                                //                                }
                                //                            });
                            };
                            Widget.prototype.resetContainers = function (toNull) {
                                _super.prototype.resetContainers.call(this, toNull);
                                this.detachMapEventsSynchronize();
                                this.infoWindow.hide();
                                if (this.layer !== null) {
                                    this.layer.getSource().clear(true);
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                            };
                            Widget.prototype.searchLayers = function (obj) {
                                var thiss = this;
                                _super.prototype.searchLayers.call(this, obj);
                                this.resetContainers(false);
                            };
                            Widget.prototype.detailLayer = function (obj) {
                                var thiss = this;
                                _super.prototype.detailLayer.call(this, obj);
                                this.resetContainers(false);
                            };
                            Widget.prototype.fitExtent = function () {
                                var thiss = this;
                                var extent = thiss.layer.getSource().getExtent();
                                if (extent.equals(Widget.EXTENTINFINITY) === true) return;
                                thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                            };
                            Widget.prototype.addToMap = function (item) {
                                var thiss = this;
                                var url = item.url;
                                var parameters = {
                                    service: 'WFS',
                                    version: gh.spatial.helper.WfsHelper.DEFAULTVERSION,
                                    request: 'GetFeature',
                                    typeNames: item.id,
                                    srsName: thiss.map.getView().getProjection().getCode(),
                                    outputFormat: "application/json"
                                };
                                url = (url.endsWith("?") ? url : url + "?");
                                var queryString = jQuery.param(parameters);
                                url = url + queryString;
                                var source = new ol.source.Vector({
                                    format: new ol.format.GeoJSON(),
                                    strategy: ol.loadingstrategy.all,
                                    loader: function (extent, resolution, projection) {
                                        //// + '&bbox=' + extent.join(',') + ',' + projection.getCode()
                                        jQuery.ajax(url).done(function (data) {
                                            if (thiss.worker) {
                                                //                                    		thiss.worker.addEventListener('message',function(e) {
                                                //                                    			console.log(e.data);
                                                //                                    		})
                                                //                                    		thiss.worker.postMessage({
                                                //                                    			data:data
                                                //                                    		});
                                                var format = new ol.format.GeoJSON();
                                                source.addFeatures(format.readFeatures(data));
                                            }
                                            else {
                                                var format = new ol.format.GeoJSON();
                                                source.addFeatures(format.readFeatures(data));
                                            }
                                        }).fail(function (error) {
                                        });
                                    }
                                });
                                thiss.layer.setSource(source);
                                thiss.layer.set("id", item.oid);
                            };
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.resetContainers(true);
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(wfs.BaseWidget);
                        wfs.Widget = Widget;
                    })(widgets.wfs || (widgets.wfs = {}));
                    var wfs = widgets.wfs;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));