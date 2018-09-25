(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (mouseposition) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlSpatialReference = null;
                                this.$lblCoordinate = null;
                                this.control = null;
                                this.show = function (coordinates) {
                                    var thiss = this;
                                    if (thiss.config.module.widget.isShow === true) {
                                        var projection = ol.proj.get("EPSG:" + thiss.$ddlSpatialReference.val());
                                        coordinates = ol.proj.transform(coordinates, thiss.map.getView().getProjection(), projection);
                                        var template = 'X: {x}, Y: {y}';
                                        return ol.coordinate.format(coordinates, template, thiss.config.module.widget.decimalNumbers);
                                    }
                                    return '';
                                };
                            }
                            BaseWidget.prototype.onClick = function () {
                            };
                            BaseWidget.prototype.buildTool = function () {
                                var thiss = this;
                                var uri = "mouseposition/";
                                this.configView = { uri: {} };
                                this.configView.uri.view = uri + "widget.html";
                                this.configView.config = uri + "mouseposition.json";
                                thiss.$widget = $('<div></div>').appendTo(thiss.$toolbarBottom);
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                    if (data === null) return;
                                    thiss.config.module.widget = data;
                                    if (thiss.config.module.widget.sridsFromRemote === true) {
                                        jQuery.getJSON(com.jtm.Server.contextPath + "geometry/spatialreference/list", function (data, textStatus, jqXHR) {
                                            thiss.config.module.widget.spatialReferences = data.items;
                                            _super.prototype.initConfig.call(thiss);
                                            thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                                thiss.launchView();
                                            });
                                        });
                                    }
                                    else {
                                        _super.prototype.initConfig.call(thiss);
                                        thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                            thiss.launchView();
                                        });
                                    }
                                });
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$ddlSpatialReference = thiss.$widget.find('#ddlSpatialReference');
                                thiss.$lblCoordinate = thiss.$widget.find('#lblCoordinate');
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.widget.spatialReferences,
                                    idSelected: thiss.config.module.widget.defaultSrid
                                });
                            };
                            BaseWidget.prototype.load = function () {
                                var thiss = this;
                                _super.prototype.load.call(this);
                                thiss.initConfig();
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        mouseposition.BaseWidget = BaseWidget;
                    })(widgets.mouseposition || (widgets.mouseposition = {}));
                    var mouseposition = widgets.mouseposition;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));