function getObject() {
    return com.jtm.geometry.viewer.widgets.navigation.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (navigation) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.zoomByDelta = function (delta) {
                                    var zoom = this.map.getZoom();
                                    this.map.setZoom(zoom - delta);
                                };
                                this.pan = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-pan",
                                        label: "Mover",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            if (state === true)
                                                thiss.navigation.activate(esri.toolbars.Navigation.PAN);
                                            else
                                                thiss.navigation.deactivate();
                                        }
                                    });
                                };
                                this.zoomOut = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-out",
                                        label: "Alejar",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.zoomByDelta(1);
                                        }
                                    });
                                };
                                this.zoomIn = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-in",
                                        label: "Acercar",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.zoomByDelta(-1);
                                        }
                                    });
                                };
                                this.zoomOutRubberBand = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-out-2",
                                        label: "Alejar Ventana",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            //Activar zoom to windows alejado
                                            thiss.map.disablePan();
                                            if (thiss.map.isRubberBandZoom) {
                                                thiss.navigation.activate(esri.toolbars.Navigation.ZOOM_OUT);
                                            }
                                        }
                                    });
                                };
                                this.zoomInRubberBand = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-in-2",
                                        label: "Acercar Ventana",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            //Activar zoom to windows acercar
                                            thiss.map.disablePan();
                                            if (thiss.map.isRubberBandZoom) {
                                                thiss.navigation.activate(esri.toolbars.Navigation.ZOOM_IN);
                                            }
                                        }
                                    });
                                };
                                this.previousExtent = function () {
                                    var thiss = this;
                                    thiss.navigation.activate();
                                    thiss.setButton2({
                                        icon: "gh gh-previous-extent",
                                        label: "Zoom previo",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.navigation.zoomToPrevExtent();
                                        }
                                    });
                                };
                                this.nextExtent = function () {
                                    var thiss = this;
                                    thiss.navigation.activate();
                                    thiss.setButton2({
                                        icon: "gh gh-next-extent",
                                        label: "Zoom siguiente",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.navigation.zoomToNextExtent();
                                        }
                                    });
                                };
                                this.fullExtent = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-full-extent",
                                        label: "Límite completo",
                                        openInitial: false,
                                        location: "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.navigation.zoomToFullExtent();
                                        }
                                    });
                                };
                                this.initialExtent = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-initial-extent",
                                        label: "Vista inicial",
                                        openInitial: false,
                                        location : "left",
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.map.setExtent(thiss.map.initialExtent, true);
                                        }
                                    });
                                };
                            }
                            Widget.prototype.load = function () {
                                var thiss = this;
                                thiss.config.module.isMenuButton = true;
                                thiss.navigation = new esri.toolbars.Navigation(thiss.map);
                                thiss.navigation.on("extent-history-change", function (e) {
                                    thiss.navigation.deactivate();
                                    thiss.map.enablePan();
                                    jQuery('#btnPreviousExtent').prop("disabled", thiss.navigation.isFirstExtent());
                                    jQuery('#btnNextExtent').prop("disabled", thiss.navigation.isLastExtent());
                                });
                                //this.fullExtent();
                                this.initialExtent();
                                this.zoomOutRubberBand();
                                this.zoomInRubberBand();
                                this.pan();
                                this.zoomIn();
                                this.zoomOut();
                                //this.previousExtent();
                                //this.nextExtent();
                                this.map.enablePan();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(navigation.BaseWidget);
                        navigation.Widget = Widget;
                    })(widgets.navigation || (widgets.navigation = {}));
                    var navigation = widgets.navigation;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));