(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (goto) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                            }
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$txtX = thiss.$widget.find('#txtX');
                                thiss.$txtY = thiss.$widget.find('#txtY');
                                thiss.$ddlSpatialReference = thiss.$widget.find('#ddlSpatialReference');
                                thiss.$btnSearch = thiss.$widget.find('#btnSearch');
                                thiss.$txtX.numeric();
                                thiss.$txtY.numeric();
                                thiss.$btnSearch.off('click');
                                thiss.$btnSearch.on('click', function (e) {
                                    thiss.search();
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.widget.spatialReferences,
                                    fieldId: "id",
                                    fieldName: "label",
                                    addDefaultOption: true
                                });
                            };
                            BaseWidget.prototype.search = function () {
                            };
                            BaseWidget.prototype.validate = function () {
                                var message = '';
                                var success = true;
                                if (this.$ddlSpatialReference.int32() == BaseWidget.DDLVALUEDEFAULT) {
                                    message = "Seleccione el sistema referencial";
                                    success = false;
                                    this.$ddlSpatialReference.focus();
                                }
                                else if (String.isNullOrWhiteSpace(this.$txtX.val()) === true) {
                                    message = "Ingrese la coordenada Este (X)";
                                    success = false;
                                    this.$txtX.focus();
                                }
                                else if (String.isNullOrWhiteSpace(this.$txtY.val()) === true) {
                                    message = "Ingrese la coordenada Norte (Y)";
                                    success = false;
                                    this.$txtY.focus();
                                }
                                if (success === false)
                                    toastr.error(message);
                                return success;
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                var thiss = this;
                                if (thiss.$txtX !== null)
                                    thiss.$txtX.val(0);
                                if (thiss.$txtY !== null)
                                    thiss.$txtY.val(0);
                                if (thiss.$ddlSpatialReference !== null)
                                    thiss.$ddlSpatialReference.val(BaseWidget.DDLVALUEDEFAULT);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        goto.BaseWidget = BaseWidget;
                    })(widgets.goto || (widgets.goto = {}));
                    var goto = widgets.goto;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));