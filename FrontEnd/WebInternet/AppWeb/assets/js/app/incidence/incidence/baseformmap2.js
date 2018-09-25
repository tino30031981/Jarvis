(function (com) {
    (function (jtm) {
        (function (incidence) {
            (function (incidence) {
                var BaseFormMap = (function (_super) {
                    __extends(BaseFormMap, _super);
                    function BaseFormMap() {
                        _super.call(this);
                        this.transform = function (geometry, toSrid) {
                            var coordinates = null;
                            if (geometry.type === BaseFormMap.OGCTYPES.POINT) {
                                coordinates = this.project(geometry.coordinates, geometry.spatialReference.id, toSrid);
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
                        var $btnGPSPoint = $('<button type="button" class="btn"><i class="fa fa-map-marker"></i></button>');
                        $btnGPSPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.geolocation(function (geometry) {
                                thiss.callbackCapturePoint(geometry);
                            });
                        });                        
                        var $btnMapPoint = $('<button type="button" class="btn"><i class="gh gh-point"></i></button>');
                        $btnMapPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPoint();
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
                        var $btnTrash = $('<button type="button" class="btn" title="Graficar"><i class="glyphicon glyphicon-trash"></i></button>');
                        $btnTrash.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanLayerDraw(false);
                        });
                        this.$toolbar.append($btnGPSPoint);
                        this.$toolbar.append($btnMapPoint);
                        this.$toolbar.append($btnMapPolygon);
                        this.$toolbar.append($btnMapPolygonFreeHand);
                        this.$toolbar.append($btnTrash);
                    };
                    BaseFormMap.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$baseMaps = this.$main.find('#divBasemaps');
                    };
                    BaseFormMap.prototype.viewConfig = function () {
                        var thiss = this;
                        this.$map.css("overflow", "auto");
                    };
                    BaseFormMap.prototype.buttonConfig = function () {
                        var thiss = this;
                    };
                    BaseFormMap.prototype.addGeometry = function (geometry) {

                    };
                    BaseFormMap.prototype.callbackCapturePoint = function (geometry) {

                    };
                    BaseFormMap.prototype.getGeometry = function () {
                        this.$txtX.val(0);
                        this.$txtY.val(0);
                        this.$txtZ.val(0);
                    };
                    BaseFormMap.prototype.cleanLayerDraw = function (toNull) {

                    };
                    BaseFormMap.prototype.cleanControls = function (toNull) {

                    };
                    return BaseFormMap;
                })(jtm.geometry.SimpleMap);
                incidence.BaseFormMap = BaseFormMap;
            })(incidence.incidence || (incidence.incidence = {}));
            var incidence = incidence.incidence;
        })(jtm.incidence || (jtm.incidence = {}));
        var incidence = jtm.incidence;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));