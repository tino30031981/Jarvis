(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (measure) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$fdsSpatialReference = null;
                                this.$fdsMeasureUnitLength = null;
                                this.$fdsMeasureUnitArea = null;
                                this.$ddlMeasureUnitLength = null;
                                this.$ddlMeasureUnitArea = null;
                                this.$result = null;
                                this.feature = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.config.module.isWidgetPopup = true;
                                thiss.showView({
                                    dialog: { width: 350, height: 300 }
                                });
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$fdsSpatialReference = thiss.$widget.find('#fdsSpatialReference');
                                thiss.$fdsMeasureUnitLength = thiss.$widget.find('#fdsMeasureUnitLength');
                                thiss.$fdsMeasureUnitArea = thiss.$widget.find('#fdsMeasureUnitArea');
                                thiss.$ddlSpatialReference = thiss.$widget.find('#ddlSpatialReference');
                                thiss.$ddlMeasureUnitLength = thiss.$widget.find('#ddlMeasureUnitLength');
                                thiss.$ddlMeasureUnitArea = thiss.$widget.find('#ddlMeasureUnitArea');
                                thiss.$btnPoint = thiss.$widget.find('#btnPoint');
                                thiss.$btnPolyline = thiss.$widget.find('#btnPolyline');
                                thiss.$btnPolygon = thiss.$widget.find('#btnPolygon');
                                thiss.$result = thiss.$widget.find('#result');
                                thiss.$fdsSpatialReference.hide();
                                thiss.$fdsMeasureUnitLength.hide();
                                thiss.$fdsMeasureUnitArea.hide();
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.widget.spatialReferences,
                                    fieldId: "id",
                                    fieldName: "label"
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlMeasureUnitLength,
                                    items: thiss.config.module.widget.lengthUnit,
                                    fieldId: "id",
                                    fieldName: "label"
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlMeasureUnitArea,
                                    items: thiss.config.module.widget.arealUnit,
                                    fieldId: "id",
                                    fieldName: "label"
                                });
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        measure.BaseWidget = BaseWidget;
                    })(widgets.measure || (widgets.measure = {}));
                    var measure = widgets.measure;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));