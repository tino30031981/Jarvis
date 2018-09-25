(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningrequest) {
                var BaseMainMap = (function (_super) {
                    __extends(BaseMainMap, _super);
                    function BaseMainMap() {
                        _super.call(this);
                        this.$btnExtentPreview = null;
                        this._layerZoneUTM = null;
                        this._layerPoliticalDivision = null;
                        this._layerNationalCartography = null;
                        this._layerPreview = null;

                        this.fillCoordinatesFromPreview = function (geometry) {
                            var thiss = this;
                            if (geometry === null) return;
                            thiss.$tableCoordinates.find('>tbody>tr:not(:eq(0))').remove();
                            var coordinates = geometry.coordinates;
                            var i = 0;
                            var srid = 0;
                            var $tr = null;
                            for (i = 0; i < coordinates[0].length - 1; i++) {
                                if (i === 0) {
                                    $tr = thiss.$tableCoordinates.find(">tbody>tr:last");
                                    $tr.find('td:eq(0)').text(i + 1);
                                    $tr.find('td:eq(1)').find("input").val(coordinates[0][i][0]);
                                    $tr.find('td:eq(2)').find("input").val(coordinates[0][i][1]);
                                } else {
                                    $tr = thiss.$tableCoordinates.find(">tbody>tr:last");//(this).closest('tr');
                                    var $clone = $tr.clone();
                                    $clone.find('input').val('');
                                    $clone.find('td:eq(0)').text(parseInt($tr.find('td:eq(0)').text()) + 1);
                                    $tr.after($clone);
                                    $tr = thiss.$tableCoordinates.find(">tbody>tr:last");
                                    $tr.find('td:eq(1)').find("input").val(coordinates[0][i][0]);
                                    $tr.find('td:eq(2)').find("input").val(coordinates[0][i][1]);
                                }
                            }
                            $tr = null;
                            thiss.$tableCoordinates.find(">tbody>tr input").attr("readonly", true);
                            thiss.$ddlSpatialReference.val(geometry.spatialReference.id);
                        };
                        this.fillZoneUTMs = function (items) {
                            var thiss = this;
                            thiss.$ddlZoneUTM.empty();
                            items.forEach(function (item) {
                                thiss.$ddlZoneUTM.append('<option value="' + item.attributes.ZONE + '">' + item.attributes.ZONE + ' S</option>');
                            });
                            thiss.$ddlZoneUTM.val(thiss.config.module.defaultZone);
                            thiss.$ddlZoneUTM.trigger("change");
                        };
                        this.fillRestDepartments = function (items) {
                            var thiss = this;
                            thiss.$ddlDepartment.empty();
                            thiss.$ddlDepartment.html('<option value="' + BaseMainMap.DDLVALUEDEFAULT + '">' + BaseMainMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function (item) {
                                thiss.$ddlDepartment.append('<option value="' + item.attributes.CD_DEPA + '">' + item.attributes.NM_DEPA + '</option>');
                            });
                        };
                        this.fillRestProvincesByDepartment = function (items) {
                            var thiss = this;
                            thiss.$ddlProvince.html('<option value="' + BaseMainMap.DDLVALUEDEFAULT + '">' + BaseMainMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function (item) {
                                thiss.$ddlProvince.append('<option value="' + item.attributes.CD_PROV + '">' + item.attributes.NM_PROV + '</option>');
                            });
                        };
                        this.fillRestDistrictsByProvince = function (items) {
                            var thiss = this;
                            thiss.$ddlDistrict.html('<option value="' + BaseMainMap.DDLVALUEDEFAULT + '">' + BaseMainMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function (item) {
                                thiss.$ddlDistrict.append('<option value="' + item.attributes.CD_DIST + '">' + item.attributes.NM_DIST + '</option>');
                            });
                        };
                        this.fillNationalCartographies = function (items) {
                            var thiss = this;
                            thiss.$ddlNationalCartography.html('<option value="' + BaseMainMap.DDLVALUEDEFAULT + '">' + BaseMainMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function (item) {
                                thiss.$ddlNationalCartography.append('<option value="' + item.attributes.CD_HOJA + '">' + item.attributes.CD_HOJA + ' - ' + item.attributes.NM_HOJA + ' S</option>');
                            });
                        };
                        this.fillOverlaps = function (items) {
                            var thiss = this;
                        };
                    }
                    BaseMainMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        thiss.draw = new esri.toolbars.Draw(thiss.map);
                        thiss.draw.setFillSymbol(thiss.config.module.map.symbols['polygon']["highlight"]);
                        thiss.draw.setLineSymbol(thiss.config.module.map.symbols['polyline']["highlight"]);
                        thiss.draw.setMarkerSymbol(thiss.config.module.map.symbols['point']["highlight"]);
                        thiss.draw.deactivate();
                        thiss.draw.on("draw-complete", function (e) {
                            thiss.draw.deactivate();
                            thiss.searchGrids(e.geometry);
                        });
                    };
                    BaseMainMap.prototype.callbackCoordinatesMap = function () {
                        var thiss = this;
                        thiss.$ddlSpatialReference.attr('disabled', true);
                        thiss.listZoneUTMs();
                        thiss.$ddlZoneUTM.off("change");
                        thiss.$ddlZoneUTM.on("change", function (e) {
                            thiss.$ddlDepartment.empty();
                            thiss.$ddlProvince.empty();
                            thiss.$ddlDistrict.empty();
                            thiss.$ddlNationalCartography.empty();
                            thiss.fitExtentGrid(jQuery(this).val());
                            thiss.searchRestDepartments(jQuery(this).val());
                            thiss.searchRestNationalCartographies(jQuery(this).val());
                            thiss.loadServicesOnExtent(jQuery(this).val());
                            thiss.$ddlSpatialReference.val(thiss.getSRIDGrid());
                        });
                        thiss.$ddlDepartment.off("change");
                        thiss.$ddlDepartment.on("change", function () {
                            thiss.$ddlProvince.empty();
                            thiss.$ddlDistrict.empty();
                            thiss.$ddlNationalCartography.empty();
                            thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDepartment, "CD_DEPA='" + jQuery(this).val() + "'");
                            thiss.searchRestProvincesByDepartment(jQuery(this).val(), thiss.$ddlZoneUTM.val());
                        });
                        thiss.$ddlProvince.off("change");
                        thiss.$ddlProvince.on("change", function () {
                            thiss.$ddlDistrict.empty();
                            thiss.$ddlNationalCartography.empty();
                            thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdProvince, "CD_PROV='" + jQuery(this).val() + "'");
                            thiss.searchRestDistrictsByProvince(jQuery(this).val(), thiss.$ddlZoneUTM.val());
                        });
                        thiss.$ddlDistrict.off("change");
                        thiss.$ddlDistrict.on("change", function () {
                            thiss.$ddlNationalCartography.empty();
                            thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDistrict, "CD_DIST='" + jQuery(this).val() + "'");
                        });
                        thiss.$ddlNationalCartography.off("change");
                        thiss.$ddlNationalCartography.on("change", function (e) {
                            thiss.scopeNationalCartography(jQuery(this).val());
                        });
                        thiss.$btnPoint.off("click");
                        thiss.$btnPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPoint();
                        });
                        thiss.$btnPolyline.off("click");
                        thiss.$btnPolyline.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolyline();
                        });
                        thiss.$btnRectangle.off("click");
                        thiss.$btnRectangle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawRectangle();
                        });
                        thiss.$btnCircle.off("click");
                        thiss.$btnCircle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawCircle();
                        });
                        thiss.$btnPolygon.off("click");
                        thiss.$btnPolygon.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolygon();
                        });
                        thiss.$btnExtentPreview.off("click");
                        thiss.$btnExtentPreview.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.fitExtentPreview(0);
                            thiss.fillCoordinatesFromPreview(thiss.getDataById(0));
                        });
                    };
                    BaseMainMap.prototype.initConfig = function () {
                        var thiss = this;
                        jQuery.ajaxSetup({ async: false });
                        for (var i in thiss.config.module.servicesOnExtent) {
                            for (var j in thiss.config.module.servicesOnExtent[i]) {
                                jQuery.getJSON(thiss.config.module.servicesOnExtent[i][j].url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                    if (data.error !== undefined || jqXHR.status != 200) return;
                                    thiss.config.module.servicesOnExtent[i][j].minScale = data.minScale;
                                    thiss.config.module.servicesOnExtent[i][j].maxScale = data.maxScale;
                                });
                            }
                        }
                        jQuery.ajaxSetup({ async: true });
                    };
                    BaseMainMap.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        this.$btnPoint = this.$main.find(BaseMainMap.BTNPOINT);
                        this.$btnMultiPoint = this.$main.find(BaseMainMap.BTNMULTIPOINT);
                        this.$btnRectangle = this.$main.find(BaseMainMap.BTNRECTANGLE);
                        this.$btnLine = this.$main.find(BaseMainMap.BTNLINE);
                        this.$btnPolyline = this.$main.find(BaseMainMap.BTNPOLYLINE);
                        this.$btnPolylineFreeHand = this.$main.find(BaseMainMap.BTNPOLYLINEFREEHAND);
                        this.$btnPolygon = this.$main.find(BaseMainMap.BTNPOLYGON);
                        this.$btnPolygonFreeHand = this.$main.find(BaseMainMap.BTNPOLYGONFREEHAND);
                        this.$btnCircle = this.$main.find(BaseMainMap.BTNCIRCLE);
                        this.$btnEllipse = this.$main.find(BaseMainMap.BTNELLIPSE);
                        this.$btnArrow = this.$main.find(BaseMainMap.BTNARROW);
                        this.$btnText = this.$main.find(BaseMainMap.BTNTEXT);
                        this.$btnExtentResult = this.$main.find(BaseMainMap.BTNEXTENTRESULT);
                        this.$ddlDepartment = this.$main.find(BaseMainMap.DDLDEPARTMENT);
                        this.$ddlProvince = this.$main.find(BaseMainMap.DDLPROVINCE);
                        this.$ddlDistrict = this.$main.find(BaseMainMap.DDLDISTRICT);
                        this.$ddlNationalCartography = this.$main.find(BaseMainMap.DDLNATIONALCARTOGRAPHY);
                        this.$btnExtentPreview = this.$main.find('#btnExtentPreview');
                    };
                    return BaseMainMap;
                })(jtm.geometry.SimpleMap);
                miningrequest.BaseMainMap = BaseMainMap;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));