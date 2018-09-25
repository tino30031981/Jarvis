(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (legalframe) {
                var BaseMainMap = (function (_super) {
                    __extends(BaseMainMap, _super);
                    function BaseMainMap() {
                        _super.call(this);
                        this.$divCoordinatesPoint = null;
                        this.buildCoordinates = function () {
                            var thiss = this;
                            thiss.clean();
                            if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.NULL) {
                                thiss.$divCoordinates.hide();
                                thiss.$divCoordinatesPoint.hide();
                            } else if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.POINT) {
                                thiss.$divCoordinates.hide();
                                thiss.$divCoordinatesPoint.show();
                                thiss.$map.css("height", thiss.$divCoordinatesPoint.height() + 100);
                            } else if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.POLYGON) {
                                thiss.$divCoordinatesPoint.hide();
                                thiss.$divCoordinates.show();
                                thiss.$map.css("height", thiss.$divCoordinates.height() - 20);
                            }
                        };
                    }
                    BaseMainMap.DIVCOORDINATEPOINT = '#divCoordinatesPoint';
                    BaseMainMap.GEOMETRYTYPE = {
                        POINT: "point",
                        POLYGON: "polygon",
                        NULL: "null"
                    };
                    BaseMainMap.prototype.saveCoordinates = function () {
                        var thiss = this;                        
                        if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.NULL) {
                            alert("Seleciona un Tipo de Marco Legal");
                        }
                        else if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.POINT) {
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    message = Main.NEWELEMENTID;
                                    return false;
                                } else if (thiss.$ddlSpatialReference.int32() === 0) {
                                    message = 'Seleccione el sistema referencial.';
                                    thiss.$ddlSpatialReference.focus();
                                    return false;
                                } else if (thiss.$txtX.int32() === 0) {
                                    message = 'Ingrese el eje X.';
                                    thiss.$txtX.focus();
                                    return false;
                                } else if (thiss.$txtY.int32() === 0) {
                                    message = 'Ingrese el eje Y.';
                                    thiss.$txtY.focus();
                                    return false;
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                            var item = {
                                id: thiss.$hdnId.int32(),
                                spatialReference: { id: thiss.$ddlSpatialReference.int32() },
                                coordinate: { x: thiss.$txtX.number(), y: thiss.$txtY.number() }
                            };
                            thiss.saveConfig(thiss.urlSave, { data: { item: item }, validate: validate }, function () { thiss.$btnExtentResult.trigger('click'); });
                        }
                        else if (thiss.$ddlLegalFrameType.find('option:selected').attr("data-geometrytype") === BaseMainMap.GEOMETRYTYPE.POLYGON) {
                            _super.prototype.saveCoordinates.call(this);
                        }
                    };
                    BaseMainMap.prototype.viewConfig = function () {
                        _super.prototype.viewConfig.call(this);
                        this.$divCoordinatesPoint = this.$main.find(BaseMainMap.DIVCOORDINATEPOINT);
                    };
                    BaseMainMap.prototype.clean = function () {
                    };
                    return BaseMainMap;
                })(jtm.geometry.SimpleMap);
                legalframe.BaseMainMap = BaseMainMap;
            })(environment.legalframe || (environment.legalframe = {}));
            var legalframe = environment.legalframe;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));