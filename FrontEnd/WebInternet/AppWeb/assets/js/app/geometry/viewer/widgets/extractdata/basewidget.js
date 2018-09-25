(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (extractdata) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlLayer = null;
                                this.$ddlSpatialReferenceOutput = null;
                                this.$ddlFormat = null;
                                this.$ddlAnalysis = null;
                                this.$divStatus = null;
                                this.$fds = null;
                                this.geoprocessor = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 350 }
                                });
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$ddlLayer = this.$widget.find('#ddlLayer');
                                this.$ddlFormat = this.$widget.find('#ddlFormat');
                                this.$ddlAnalysis = this.$widget.find('#ddlAnalysis');
                                this.$ddlSpatialReference = this.$widget.find('#ddlSpatialReference');
                                this.$ddlSpatialReferenceOutput = this.$widget.find('#ddlSpatialReferenceOutput');
                                this.$ddlDepartment = thiss.$widget.find('#ddlDepartment');
                                this.$ddlProvince = thiss.$widget.find('#ddlProvince');
                                this.$ddlDistrict = thiss.$widget.find('#ddlDistrict');
                                this.$ddlHydrographicBasin = thiss.$widget.find('#ddlHydrographicBasin');
                                this.$ddlNationalCartography = thiss.$widget.find('#ddlNationalCartography');
                                this.$ddlTownCenter = thiss.$widget.find('#ddlTownCenter');
                                this.$txtRadio = this.$widget.find('#txtRadio');
                                this.$txtX = this.$widget.find('#txtX');
                                this.$txtY = this.$widget.find('#txtY');
                                this.$fds = this.$widget.find('#fdsForm');
                                this.$btnPoint = thiss.$widget.find("#btnPoint");
                                this.$btnPolyline = thiss.$widget.find("#btnPolyline");
                                this.$btnPolylineFreeHand = thiss.$widget.find("#btnPolylineFreeHand");
                                this.$btnRectangle = thiss.$widget.find("#btnRectangle");
                                this.$btnCircle = thiss.$widget.find("#btnCircle");
                                this.$btnEllipse = thiss.$widget.find("#btnEllipse");
                                this.$btnPolygon = thiss.$widget.find("#btnPolygon");
                                this.$btnPolygonFreeHand = thiss.$widget.find("#btnPolygonFreeHand");
                                this.$btnGraphicCoordinate = thiss.$widget.find('#btnGraphicCoordinate');
                                thiss.$fds.find('>div').hide();
                                thiss.$widget.find('#divRadio').hide();
                                if (thiss.config.module.widget.multiple === true) {
                                    thiss.$ddlLayer.prop("multiple", true);
                                    thiss.$ddlLayer.prop("size", thiss.config.module.widget.size);
                                }
                                else {
                                    thiss.$ddlLayer.prop("multiple", false);
                                    thiss.$ddlLayer.prop("size", 1);
                                }
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlLayer,
                                    items: thiss.config.module.widget.service.layers
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlFormat,
                                    items: thiss.config.module.widget.service.formats
                                });
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "geometry/spatialreference/list",
                                    ddl: thiss.$ddlSpatialReferenceOutput
                                });
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "geometry/spatialreference/list",
                                    ddl: thiss.$ddlSpatialReference
                                });
                                thiss.$txtRadio.numeric({ negative: false });
                                thiss.$txtRadio.val(thiss.config.module.widget.defaultRadio);
                                thiss.$txtX.numeric();
                                thiss.$txtY.numeric();
                                thiss.$ddlAnalysis.off('change');
                                thiss.$ddlAnalysis.on("change", function (e) {
                                    var typeOfAnalysis = jQuery(this).val();
                                    if (typeOfAnalysis === null) return;
                                    switch (jQuery(this).val()) {
                                        case "Coordinate":
                                            thiss.setCoordinate();
                                            break;
                                        case "Graphic":
                                            thiss.setGraphic();
                                            break;
                                        case "PoliticalDivision":
                                            thiss.setPoliticalDivision();
                                            break;
                                        case "HydrographicBasin":
                                            thiss.setHydrographicBasin();
                                            break;
                                        case "Town":
                                            thiss.setTown();
                                            break;
                                        default:
                                            alert("No soportado");
                                            break;
                                    }
                                });
                                thiss.$ddlAnalysis.trigger('change');
                            };
                            BaseWidget.prototype.setCoordinate = function () {
                                var thiss = this;
                                thiss.$fds.find('>div').hide();
                                thiss.$fds.find('#divCoordinate').show();
                                this.$btnGraphicCoordinate.off("click");
                                this.$btnGraphicCoordinate.on("click", function (e) {
                                });
                            };
                            BaseWidget.prototype.setGraphic = function () {
                                var thiss = this;
                                thiss.$fds.find('>div').hide();
                                thiss.$fds.find('#divGraphic').show();
                                thiss.$btnPoint.off("click");
                                thiss.$btnPoint.on("click", function (e) {
                                    thiss.drawPoint();
                                });
                                thiss.$btnPolyline.off("click");
                                thiss.$btnPolyline.on("click", function (e) {
                                    thiss.drawPolyline();
                                });
                                thiss.$btnPolylineFreeHand.off("click");
                                thiss.$btnPolylineFreeHand.on("click", function (e) {
                                    thiss.drawPolylineFreeHand();
                                });
                                thiss.$btnRectangle.off("click");
                                thiss.$btnRectangle.on("click", function (e) {
                                    thiss.drawRectangle();
                                });
                                thiss.$btnCircle.off("click");
                                thiss.$btnCircle.on("click", function (e) {
                                    thiss.drawCircle();
                                });
                                thiss.$btnEllipse.off("click");
                                thiss.$btnEllipse.on("click", function (e) {
                                    thiss.drawEllipse();
                                });
                                thiss.$btnPolygon.off("click");
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.drawPolygon();
                                });
                                thiss.$btnPolygonFreeHand.off("click");
                                thiss.$btnPolygonFreeHand.on("click", function (e) {
                                    thiss.drawPolygonFreeHand();
                                });
                            };
                            BaseWidget.prototype.setPoliticalDivision = function () {
                                var thiss = this;
                                thiss.$fds.find('>div').hide();
                                thiss.$fds.find('#divPoliticalDivision').show();
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "geometry/departament/list",
                                    ddl: thiss.$ddlDepartment
                                });
                                thiss.$ddlDepartment.off('change');
                                thiss.$ddlDepartment.on('change', function (e) {
                                    com.jtm.helper.DropDownList.fill({
                                        url: com.jtm.Server.contextPath + 'geometry/province/searchbydepartament',
                                        ddl: thiss.$ddlProvince,
                                        data: { id: jQuery(this).val() }
                                    });
                                    thiss.$ddlProvince.off('change');
                                    thiss.$ddlProvince.on("change", function () {
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + 'geometry/district/searchbyprovince',
                                            ddl: thiss.$ddlDistrict,
                                            data: { id: jQuery(this).val() }
                                        });
                                    });
                                });
                                thiss.$ddlDepartment.trigger('change');
                            };
                            BaseWidget.prototype.setHidrographicalBasin = function () {
                                var thiss = this;
                                thiss.$fds.find('>div').hide();
                                thiss.$fds.find('#divHidrographicalBasin').show();
                            };
                            BaseWidget.prototype.setTown = function () {
                                var thiss = this;
                                thiss.$fds.find('>div').hide();
                                thiss.$fds.find('#divTown').show();
                            };
                            BaseWidget.prototype.cleanControls = function () {
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        extractdata.BaseWidget = BaseWidget;
                    })(widgets.extractdata || (widgets.extractdata = {}));
                    var extractdata = widgets.extractdata;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));