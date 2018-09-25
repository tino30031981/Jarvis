(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (geophoto) {
                var BaseFormMap = (function (_super) {
                    __extends(BaseFormMap, _super);
                    function BaseFormMap() {
                        _super.call(this);
                        this.transform = function (geometry, toSrid) {
                            var coordinates = this.project(geometry.coordinates, geometry.spatialReference.id, toSrid);
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
                        var $btnGPS = $('<button type="button" class="btn"><i class="fa fa-map-marker"></i></button>');
                        $btnGPS.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.geolocation(function (geometry) {
                                thiss.callbackCapturePoint(geometry);
                            });
                        });
                        var $btnMap = $('<button type="button" class="btn"><i class="glyphicon glyphicon-pushpin"></i></button>');
                        $btnMap.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.capturePoint({}, function (geometry) {
                                thiss.callbackCapturePoint(geometry);
                            });
                        });
                        var $btnTrash = $('<button type="button" class="btn" title="Graficar"><i class="glyphicon glyphicon-trash"></i></button>');
                        $btnTrash.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanLayerDraw(false);
                        });
                        this.$toolbar.append($btnGPS);
                        this.$toolbar.append($btnMap);
                        this.$toolbar.append($btnTrash);
                    };
                    BaseFormMap.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$ddlSpatialReference = this.$main.find('#ddlSpatialReference');
                        this.$txtX = this.$main.find(BaseFormMap.TXTX);
                        this.$txtY = this.$main.find(BaseFormMap.TXTY);
                        this.$txtZ = this.$main.find('#txtZ');
                        this.$baseMaps = this.$main.find('#divBasemaps');
                    };
                    BaseFormMap.prototype.viewConfig = function() {
                        var thiss = this;
                        this.$map.css("overflow", "auto");
                        thiss.$ddlSpatialReference.off("change");
                        thiss.$ddlSpatialReference.on("change", function(e) {
                            //
                        });
                    };
                    BaseFormMap.prototype.buttonConfig = function () {
                        var thiss = this;
                    };
                    BaseFormMap.prototype.addGeometry = function(geometry) {

                    };
                    BaseFormMap.prototype.callbackCapturePoint = function (geometry) {

                    };
                    BaseFormMap.prototype.getGeometry = function() {
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
                geophoto.BaseFormMap = BaseFormMap;
            })(geometry.geophoto || (geometry.geophoto = {}));
            var geophoto = geometry.geophoto;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));