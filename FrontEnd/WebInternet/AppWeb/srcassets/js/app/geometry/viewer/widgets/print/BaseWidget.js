(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (print) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlPapper = null;
                                this.$ddlFormat = null;
                                this.$ddlScaleBarUnit = null;
                                this.$ddlPaper = null;
                                this.$rdbOrientation = null;
                                this.$btnPrint = null;
                                this.$txtScale = null;
                                this.$txtTitle = null;
                                this.$txtAuthor = null;
                                this.$txaDescription = null;
                                this.$txtRecommendedScale = null;
                                this.$rdbHorizontal = null;
                                this.$chkScale = null;
                                this.customScale = function (scale) {
                                    scale = parseFloat(scale.toFixed(0));
                                    var scaleWithSeparator = scale.toLocaleString("en-US");
                                    var scaleParts = scaleWithSeparator.split(",");
                                    var decimals = "";
                                    var zeros = "1";
                                    var i = 0;
                                    for (i = 1; i < scaleParts.length; i++) {
                                        decimals += scaleParts[i];
                                        zeros += "000";
                                    }
                                    var scaleInteger = parseFloat(scaleParts[0] + "." + (decimals === "" ? "0" : decimals));
                                    var scaleFactor = parseFloat(zeros);
                                    var scaleAdjust = Math.round(scaleInteger, 0) * scaleFactor;
                                    return scaleAdjust;
                                };
                                this.updateWaitingMessage = function (startTime, data) {
                                    var elapsed = Math.floor((new Date().getTime() - startTime) / 100);
                                    var time = '';
                                    if (elapsed > 5) {
                                        time = (elapsed / 10) + " seg.";
                                    }
                                    this.$message.text('Esperando ' + time + ": " + data.ref);
                                };
                            }
                            BaseWidget.SCALES = [1, 25000, 100000, 500000, 1000000, 6000000];
                            BaseWidget.VERTICAL = "Vertical";
                            BaseWidget.HORIZONTAL = "Horizontal";
                            BaseWidget.DEFAULTEMPLATE = "MAP_ONLY";
                            BaseWidget.PREFFIXDEFAULT = "MAP";
                            BaseWidget.PAPERS = { A1: "A1", A2: "A2", A3: "A3", A4: "A4", A5: "A5" };
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.config.module.isWidgetPopup = true;
                                thiss.showView({
                                    dialog: { width: 350, height: 400 }
                                });
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$ddlPaper = this.$widget.find('#ddlPaper');
                                this.$ddlFormat = this.$widget.find('#ddlFormat');
                                this.$ddlSpatialReference = this.$widget.find('#ddlSpatialReference');
                                this.$ddlScaleBarUnit = this.$widget.find('#ddlScaleBarUnit');
                                this.$rdbOrientation = this.$widget.find('input[name=rdbOrientation]:radio');
                                this.$btnPrint = this.$widget.find('#btnPrint');
                                this.$txtScale = this.$widget.find('#txtScale');
                                this.$txtTitle = this.$widget.find('#txtTitle');
                                this.$txtAuthor = this.$widget.find('#txtAuthor');
                                this.$txaDescription = this.$widget.find('#txaDescription');
                                this.$txtRecommendedScale = this.$widget.find('#txtRecommendedScale');
                                this.$txtNbrDpi = this.$widget.find('#txtNbrDpi');
                                this.$rdbHorizontal = this.$widget.find('#rdbHorizontal');
                                this.$chkScale = this.$widget.find('#chkScale');
                                this.$message = this.$widget.find(BaseWidget.DOMMESSAGE);
                                com.jtm.helper.DropDownList.fillLocal({
                                    items: thiss.config.module.widget.papers,
                                    ddl: thiss.$ddlPaper,
                                    idSelected: thiss.config.module.widget.defaultPaper
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    items: thiss.config.module.widget.formats,
                                    ddl: thiss.$ddlFormat
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    items: thiss.config.module.widget.spatialReferences,
                                    ddl: thiss.$ddlSpatialReference,
                                    fieldName: 'label',
                                    idSelected: thiss.config.module.widget.defaultSrid
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    items: thiss.config.module.widget.scaleBarUnits,
                                    ddl: thiss.$ddlScaleBarUnit,
                                    fieldName: 'label',
                                    idSelected: thiss.config.module.widget.defaultScaleBarUnits
                                });
                                thiss.$ddlPaper.off('change');
                                thiss.$ddlPaper.on('change', function (e) {
                                    thiss.changePaper();
                                });
                                thiss.$rdbOrientation.off('change');
                                thiss.$rdbOrientation.on('change', function () {
                                    thiss.changePaper();
                                });
                                this.$txtTitle.val(thiss.config.module.widget.title);
                                this.$txtAuthor.val(thiss.config.module.widget.author);

                                this.$txaDescription.val(thiss.config.module.widget.description);
                                this.$btnPrint.off('click');
                                this.$btnPrint.on('click', function () {
                                    thiss.printer();
                                });
                            };
                            BaseWidget.prototype.printer = function () {
                            };
                            BaseWidget.prototype.getLegends = function () {
                            };
                            BaseWidget.prototype.changePaper = function () {
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        print.BaseWidget = BaseWidget;
                    })(widgets.print || (widgets.print = {}));
                    var print = widgets.print;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));