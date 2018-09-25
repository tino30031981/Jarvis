var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this.removeLayers = function () {
                        this.map.layers = [];
                        for (var i in this.map._layers) {
                            this.map.layers.push(this.map._layers[i]);
                            if (this.map._layers[i].visible === false) {
                                this.map.removeLayer(this.map._layers[i]);
                            }
                        }
                    };
                }
                Map.prototype.build = function () {
                    var thiss = this;
                    //<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise"></script>
                    _super.prototype.build.call(this);
                    var projection = proj4("EPSG:" + thiss.config.module.map.projectionCode);
                    var toProjectionCode = proj4("EPSG:4326");
                    var southWest = [thiss.config.module.map.initialExtent.xMinimum, thiss.config.module.map.initialExtent.yMinimum];
                    var northEast = [thiss.config.module.map.initialExtent.xMaximum, thiss.config.module.map.initialExtent.yMaximum];
                    southWest = (proj4(projection, toProjectionCode).forward(southWest));
                    northEast = (proj4(projection, toProjectionCode).forward(northEast));
                    southWest = L.latLng(southWest.reverse());
                    northEast = L.latLng(northEast.reverse());
                    var extent = L.latLngBounds(southWest, northEast);
                    thiss.map = L.map(thiss.$map[0], {
                        zoom: 0,
                        crs: L.CRS.EPSG3857,
                        dragging: true,
                        touchZoom: true,
                        scrollWheelZoom: true,
                        doubleClickZoom: true,
                        boxZoom: true,
                        tap: true,
                        tapTolerance: 15,
                        trackResize: true,
                        worldCopyJump: true,
                        closePopupOnClick: true,
                        bounceAtZoomLimits: true,
                        zoomControl: false,
                        attributionControl: false,
                        fadeAnimation: true,
                        zoomAnimation: true,
                        zoomAnimationThreshold: 4,
                        markerZoomAnimation: true,
                        setView: true,
                        maxZoom: Infinity,
                        enableHighAccuracy: true,
                        watch: true,
                        preferCanvas: false
                    });
                    // thiss.map.setMaxBounds();
                    thiss.setServices();
                    thiss.removeLayers();
                    thiss.map.on('load', function (e) {
                        thiss.map.fitBounds(extent);
                        thiss.map.initialExtent = extent;
                        defaultControls();
                        thiss.setToolbar();
                    });
                    thiss.map.setView([0, 0], 0);
                    jQuery(window).on("resize", function () {
                        setTimeout(function () {
                            thiss.map.fitBounds(extent);
                        }, 200);
                    });
                    thiss.setOverView();
                    function defaultControls() {
                        var attribution = new L.control.attribution({ prefix: "" });
                        thiss.map.addControl(attribution);
                    }
                };
                Map.prototype.parseSymbols = function () {
                    var thiss = this;
                    //if (thiss.config.module.map.symbols === undefined || thiss.config.module.map.symbols === null) return;
                    thiss.config.module.map.symbols = function (feature) {
                        return {
                            fillOpacity: 0.55,
                            weight: 7,
                            color: '#eff682'
                        };
                    };
                };
                Map.prototype.setOverView = function () {
                    var thiss = this;
                    if (thiss.config.module.withOverview === true) {
                        var control = {};
                        thiss.map.addControl(control);
                    }
                };
                Map.prototype.setCorsServers = function (items) {
                };
                Map.prototype.setProxy = function (proxy) {
                    if (proxy !== undefined && proxy !== null && proxy !== null) {
                        L.proxyUrl = proxy;
                    }
                };
                Map.prototype.setGeometryService = function (geometryService) {
                    //require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
                    //    esriConfig.defaults.geometryService = new GeometryService(geometryService.url);
                    //});
                };
                return Map;
            })(geometry.BaseMap);
            geometry.Map = Map;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));