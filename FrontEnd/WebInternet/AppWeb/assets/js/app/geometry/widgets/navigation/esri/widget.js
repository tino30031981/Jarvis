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
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.zoomByDelta(-1);
                                        }
                                    });
                                };
                                this.zoomOutRubberBand = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-out-rubberband",
                                        label: "Acercar",
                                        openInitial: false,
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            if (state === true)
                                                if (thiss.map.isRubberBandZoom) {
                                                    thiss.map.disablePan();
                                                    thiss.navigation.activate(esri.toolbars.Navigation.ZOOM_OUT);
                                                }
                                                else
                                                    thiss.map.enablePan();
                                            else
                                                thiss.navigation.deactivate();
                                        }
                                    });
                                };
                                this.zoomInRubberBand = function () {
                                    var thiss = this;
                                    thiss.setButton2({
                                        icon: "gh gh-zoom-in-rubberband",
                                        label: "Acercar",
                                        openInitial: false,
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            if (state === true)
                                                if (thiss.map.isRubberBandZoom) {
                                                    thiss.map.disablePan();
                                                    thiss.navigation.activate(esri.toolbars.Navigation.ZOOM_IN);
                                                }
                                                else
                                                    thiss.map.enablePan();
                                            else
                                                thiss.navigation.deactivate();
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
                                        label: "Límite inicial",
                                        openInitial: false,
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
                                    jQuery('#btnPreviousExtent').prop("disabled", thiss.navigation.isFirstExtent());
                                    jQuery('#btnNextExtent').prop("disabled", thiss.navigation.isLastExtent());
                                });
                                //this.fullExtent();
                                this.initialExtent();
                                this.pan();
                                this.zoomIn();
                                this.zoomOut();
                                this.previousExtent();
                                this.nextExtent();
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