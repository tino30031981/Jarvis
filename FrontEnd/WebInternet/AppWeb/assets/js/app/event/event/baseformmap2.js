(function (com) {
    (function (jtm) {
        (function (event) {
            (function (event) {
                var BaseFormMap = (function (_super) {
                    __extends(BaseFormMap, _super);
                    function BaseFormMap() {
                        _super.call(this);
                        this.$txtArea = null;
                        this.$txtLength = null;
                        this.transform = function (geometry, toSrid) {
                            var coordinates = null;
                            if (geometry.type === BaseFormMap.OGCTYPES.POINT) {
                                coordinates = this.project(geometry.coordinates, geometry.spatialReference.id, srid);
                            } else if (geometry.type === BaseFormMap.OGCTYPES.LINESTRING) {
                                coordinates = [];
                                var coordinatesOriginal = geometry.coordinates;
                                coordinatesOriginal.forEach(function (coordinate) {
                                    coordinates.push(this.project(coordinate, geometry.spatialReference.id, toSrid));
                                }, this);
                            }
                            else if (geometry.type === BaseFormMap.OGCTYPES.POLYGON) {
                                coordinates = [[]];
                                var coordinatesOriginal = geometry.coordinates;
                                if ((coordinatesOriginal[0][0] instanceof Array) === false || coordinatesOriginal[0][0] === undefined)
                                    coordinatesOriginal = [coordinatesOriginal];
                                coordinatesOriginal[0].forEach(function (coordinate) {
                                    coordinates[0].push(this.project(coordinate, geometry.spatialReference.id, toSrid));
                                }, this);
                                var lastIndex = coordinates[0].length - 1;
                                if (coordinates[0][0][0] !== coordinates[0][lastIndex][0] || coordinates[0][0][1] !== coordinates[0][lastIndex][1])
                                    coordinates[0].push(coordinates[0][0]);
                            }

                            return gemetry2 = {
                                type: geometry.type,
                                coordinates: coordinates, spatialReference: { id: toSrid }
                            };
                        };
                    }
                    BaseFormMap.prototype.build = function ($dom, height) {
                        _super.prototype.build.call(this, $dom, height);
                    };
                    BaseFormMap.prototype.widgetsCustom = function () {
                        var thiss = this;
                        var coordinates = [];
                        var $btnGPS = $('<button type="button" class="btn"><i class="fa fa-map-marker"></i></button>');
                        $btnGPS.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.geolocation(function (geometry) {
                                coordinates.push(geometry.coordinates);
                                if (coordinates.length === 0) return;
                                else if (coordinates.length === 1) {
                                    geometry.type = BaseFormMap.OGCTYPES.POINT;
                                    geometry.coordinates = coordinates[0]
                                }
                                else if (coordinates.length === 2) {
                                    geometry.type = BaseFormMap.OGCTYPES.LINESTRING;
                                    geometry.coordinates = coordinates
                                }
                                else {
                                    geometry.type = BaseFormMap.OGCTYPES.POLYGON;
                                    geometry.coordinates = [coordinates]
                                }
                                thiss.callbackGPSDraw(geometry);
                            });
                        });
                        $btnGPS.on("press", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (coordinates.length >= 3) {
                                var geometry = {
                                    type: BaseFormMap.OGCTYPES.POLYGON,
                                    coordinates: JSON.parse(JSON.stringify(coordinates)),
                                    spatialReference: { id: BaseFormMap.SRIDDEFAULTGPS }
                                };
                                coordinates = [];
                                console.log(geometry);
                                thiss.callbackGPSDraw(geometry);
                            }
                            else
                                window.plugins.toast.showLongBottom("Debe generar al menos tres puntos");
                        });
                        var $btnMapPolygon = $('<button type="button" class="btn"><i class="gh gh-polygon"></i></button>');
                        $btnMapPolygon.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolygon();
                        });
                        var $btnMapPolygonFreeHand = $('<button type="button" class="btn"><i class="gh gh-polygon-freehand"></i></button>');
                        $btnMapPolygonFreeHand.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolygonFreeHand();
                        });
                        var $btnMapCircle = $('<button type="button" class="btn"><i class="gh gh-circle"></i></button>');
                        $btnMapCircle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawCircle();
                        });
                        var $btnTrash = $('<button type="button" class="btn" title="Graficar"><i class="glyphicon glyphicon-trash"></i></button>');
                        $btnTrash.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanLayerDraw(false);
                        });
                        this.$toolbar.append($btnGPS);
                        this.$toolbar.append($btnMapPolygon);
                        this.$toolbar.append($btnMapPolygonFreeHand);
                        this.$toolbar.append($btnMapCircle);
                        this.$toolbar.append($btnTrash);
                    };
                    BaseFormMap.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$ddlSpatialReference = this.$main.find('#ddlSpatialReference');
                        this.$txtArea = this.$main.find('#txtArea');
                        this.$txtLength = this.$main.find('#txtLength');
                    };
                    BaseFormMap.prototype.viewConfig = function () {
                        var thiss = this;
                        this.$map.css("overflow", "auto");
                        thiss.$ddlSpatialReference.off("change");
                        thiss.$ddlSpatialReference.on("change", function (e) {
                            //
                        });
                    };
                    BaseFormMap.prototype.buttonConfig = function () {
                        var thiss = this;
                    };
                    BaseFormMap.prototype.addGeometry = function (geometry) {

                    };
                    BaseFormMap.prototype.callbackGPSDraw = function (geometry) {

                    };
                    BaseFormMap.prototype.callbackMapDraw = function (geometry) {

                    };
                    BaseFormMap.prototype.getGeometry = function () {

                    };
                    BaseFormMap.prototype.cleanLayerDraw = function (toNull) {
                        this.$txtArea.val(0);
                        this.$txtLength.val(0);
                    };
                    BaseFormMap.prototype.cleanControls = function (toNull) {
                        this.cleanLayerDraw(toNull);
                    };
                    return BaseFormMap;
                })(jtm.geometry.SimpleMap);
                event.BaseFormMap = BaseFormMap;
            })(event.event || (event.event = {}));
            var event = event.event;
        })(jtm.event || (jtm.event = {}));
        var event = jtm.event;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));