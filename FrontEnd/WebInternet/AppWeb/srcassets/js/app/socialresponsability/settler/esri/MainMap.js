function getInstance() {
    return com.jtm.socialresponsability.settler.MainMap.execute();
}
(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (settler) {
                var MainMap = (function (_super) {
                    __extends(MainMap, _super);
                    function MainMap() {
                        _super.call(this);
                        this._layerConfig = function (options) {
                            var thiss = this;
                            options = options || {};
                            options.visible = (options.visible === undefined || options.visible === null) ? true : options.visible;
                            var layer = new esri.layers.GraphicsLayer({                                
                                style: function (feature, resolution) {
                                    return options.symbol || thiss.config.module.map.symbols[feature.geometry.type]["default"]
                                }
                            });
                            layer.setVisibility(options.visible);
                            layer.on("graphic-add", function (e) {
                                window.setTimeout(function () {
                                    var extent = esri.graphicsExtent(layer.graphics);
                                    thiss.map.setExtent(extent, true);
                                }, 1000);
                            });
                            thiss.map.addLayer(layer);
                            return layer;
                        };

                    }
                    MainMap.prototype.changeScope = function (json) {
                        var thiss = this;
                        var graphic = null;
                        json.features.forEach(function (feature) {
                            graphic = new esri.Graphic(feature);
                            thiss._layerPoliticalDivision.add(graphic);
                        });
                    };
                    MainMap.prototype.build = function ($dom, height) {
                        var thiss = this;
                        _super.prototype.build.call(this, $dom, height);                                               
                        thiss._layerPoliticalDivision = thiss._layerConfig();                        
                    };
                    MainMap.prototype.clean = function () {
                        var thiss = this;
                        if (thiss.layer !== null)
                            thiss.layer.clear();
                    };
                    MainMap.prototype.resetContainers = function (toNull) {
                        var thiss = this;
                        _super.prototype.resetContainers.call(this, toNull);
                        if (this.layer !== null) {
                            this.layer.clear();
                            if (toNull === true) {
                                this.map.removeLayer(this.layer);
                                this.layer = null;
                            }
                        }
                        thiss.cleanlayerPoliticalDivision(toNull);
                    };
                    MainMap.prototype.cleanlayerPoliticalDivision = function (toNull) {
                        var thiss = this;
                        if (this._layerPoliticalDivision !== null) {
                            this._layerPoliticalDivision.clear();
                            if (toNull === true) {
                                this.map.removeLayer(this._layerPoliticalDivision);
                                this._layerPoliticalDivision = null;
                            }
                        }
                    };
                    MainMap.execute = function () {
                        return new MainMap();
                    };
                    return MainMap;
                })(settler.BaseMainMap);
                settler.MainMap = MainMap;
            })(socialresponsability.settler || (socialresponsability.settler = {}));
            var settler = socialresponsability.settler;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));