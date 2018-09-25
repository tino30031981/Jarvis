(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (scale) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.scale = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                            };
                            BaseWidget.prototype.buildTool = function () {
                                var thiss = this;
                                var uri = "scale/";
                                this.configView = { uri: {} };
                                this.configView.uri.view = uri + "widget.html";
                                this.configView.config = uri + "scale.json";
                                thiss.$widget = $('<div></div>').appendTo(thiss.$toolbarBottom);
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                    if (data === null) return;
                                    thiss.config.module.widget = data;
                                    _super.prototype.initConfig.call(thiss);
                                    thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                        thiss.launchView();
                                    });
                                });
                            };
                            BaseWidget.prototype.load = function () {
                                var thiss = this;
                                _super.prototype.load.call(this);
                                thiss.initConfig();
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        scale.BaseWidget = BaseWidget;
                    })(widgets.scale || (widgets.scale = {}));
                    var scale = widgets.scale;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));