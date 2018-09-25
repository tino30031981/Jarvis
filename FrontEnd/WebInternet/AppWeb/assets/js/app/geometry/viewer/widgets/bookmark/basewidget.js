(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (bookmark) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ulResult = null;
                                this.$txtName = null;
                                this.$btnAdd = null;
                                this.layer = null;
                                this.toolbar = null;
                                this.geoprocessor = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 200 }
                                });
                            };

                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.graphics = [];
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        bookmark.BaseWidget = BaseWidget;
                    })(widgets.bookmark || (widgets.bookmark = {}));
                    var bookmark = widgets.bookmark;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));