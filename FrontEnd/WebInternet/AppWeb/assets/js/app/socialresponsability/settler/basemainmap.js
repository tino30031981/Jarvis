(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (settler) {
                var BaseMainMap = (function (_super) {
                    __extends(BaseMainMap, _super);
                    function BaseMainMap() {
                        _super.call(this);
                        this.$divCoordinatesPoint = null;
                        this.fillPoliticalDivision = function (id, url, ddl) {
                            var thiss = this;
                            com.jtm.helper.DropDownList.fill({
                                url: url,
                                ddl: ddl,
                                data: { id: id }
                            });
                        };
                        this.scopePoliticalDivision = function (id, url) {
                            var thiss = this;
                            thiss.resetContainers(false);
                            var options = {
                                data: { id: id },
                                isJson: false,
                                validate: true
                            };
                            thiss.searchConfig(url, options, function (item) {
                                thiss.changeScope(item);
                            });
                        };
                    }
                    BaseMainMap.prototype.saveCoordinates = function () {
                        var thiss = this;
                        var item = {
                            id: thiss.$hdnId.int32(),
                            spatialReference: { id: thiss.$ddlSpatialReference.int32() },
                            coordinate: { x: thiss.$txtX.number(), y: thiss.$txtY.number() }
                        };
                        thiss.saveConfig(thiss.urlSave, { data: { item: item }, validate: validate() }, function (response) {
                            if (response.sucess === true)
                                thiss.detail(null, response.extra);
                        });
                        function validate() {
                            var success = true;
                            var message = '';                            
                            if (thiss.$hdnId.int32() === 0) {
                                message = BaseMainMap.NEWELEMENTID;
                                success= false;
                            } else if (thiss.$ddlSpatialReference.int32() === 0) {
                                message = 'Seleccione el sistema referencial.';
                                thiss.$ddlSpatialReference.focus();
                                success= false;
                            } else if (thiss.$txtX.int32() === 0) {
                                message = 'Ingrese el eje X.';
                                thiss.$txtX.focus();
                                success= false;
                            } else if (thiss.$txtY.int32() === 0) {
                                message = 'Ingrese el eje Y.';
                                thiss.$txtY.focus();
                                success= false;
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    BaseMainMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);
                        thiss.draw = new esri.toolbars.Draw(thiss.map);
                        thiss.draw.setMarkerSymbol(thiss.config.module.map.symbols['point']["highlight"]);
                        thiss.draw.deactivate();
                        thiss.draw.on("draw-complete", function (e) {
                            //thiss.draw.deactivate();
                        });
                    };
                    BaseMainMap.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$ddlDepartment = this.$main.find(BaseMainMap.DDLDEPARTMENT);
                        this.$ddlProvince = this.$main.find(BaseMainMap.DDLPROVINCE);
                        this.$ddlDistrict = this.$main.find(BaseMainMap.DDLDISTRICT);
                        this.$divCoordinatesPoint = this.$main.find(BaseMainMap.DIVCOORDINATEPOINT);
                        this.$divParentCoordinates = this.$main.find(BaseMainMap.DIVPARENTCOORDINATES);
                    };
                    BaseMainMap.prototype.uiConfig = function () {
                        var thiss = this;
                        thiss.$ddlDepartment.off("change");
                        thiss.$ddlDepartment.on("change", function () {
                            thiss.$ddlProvince.empty();
                            thiss.$ddlDistrict.empty();
                            thiss.fillPoliticalDivision(jQuery(this).val(), com.jtm.Server.contextPath + 'geometry/province/searchbydepartment', thiss.$ddlProvince);
                            thiss.scopePoliticalDivision(jQuery(this).val(), com.jtm.Server.contextPath + "geometry/department/detailscope");
                        });
                        thiss.$ddlProvince.off("change");
                        thiss.$ddlProvince.on("change", function () {
                            thiss.$ddlDistrict.empty();                            
                            thiss.fillPoliticalDivision(jQuery(this).val(), com.jtm.Server.contextPath + 'geometry/district/searchbyprovince', thiss.$ddlDistrict);
                            thiss.scopePoliticalDivision(jQuery(this).val(), com.jtm.Server.contextPath + "geometry/province/detailscope");
                        });
                        thiss.$ddlDistrict.off("change");
                        thiss.$ddlDistrict.on("change", function () {
                            thiss.scopePoliticalDivision(jQuery(this).val(), com.jtm.Server.contextPath + "geometry/district/detailscope");
                        });
                    };
                    BaseMainMap.prototype.buttonConfig = function () {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this);
                        thiss.$btnPoint.off("click");
                        thiss.$btnPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanlayerPoliticalDivision(false);
                            thiss.drawPoint();
                            console.log(123);                            
                            thiss.capturePoint({}, function (geometry) {
                                thiss.fillCoordinatesPoint(geometry);
                            });
                        });
                    };
                    BaseMainMap.prototype.cleanlayerPoliticalDivision = function (toNull) {
                        
                    };
                    BaseMainMap.prototype.resetContainers = function (toNull) {
                        var thiss = this;                        
                    };
                    BaseMainMap.prototype.clean = function () {

                    };
                    return BaseMainMap;
                })(jtm.geometry.SimpleMap);
                settler.BaseMainMap = BaseMainMap;
            })(socialresponsability.settler || (socialresponsability.settler = {}));
            var settler = socialresponsability.settler;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));