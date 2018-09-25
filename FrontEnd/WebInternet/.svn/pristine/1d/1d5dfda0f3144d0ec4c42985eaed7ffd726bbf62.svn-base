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
                                    var view = this.map.getView();
                                    var currentResolution = view.getResolution();
                                    if (currentResolution) {
                                        this.map.beforeRender(ol.animation.zoom({
                                            resolution: currentResolution,
                                            duration: 250,
                                            easing: ol.easing.easeOut
                                        }));
                                        var newResolution = view.constrainResolution(currentResolution, delta);
                                        view.setResolution(newResolution);
                                    }
                                };
                                this.pan = function () {
                                    var thiss = this;
                                    var interaction = new ol.interaction.DragPan({
                                        kinetic: false
                                    });
                                    thiss.setButton2({
                                        icon: "gh gh-pan",
                                        label: "Mover",
                                        openInitial: false,
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            if (state === true)
                                                thiss.map.addInteraction(interaction);
                                            else
                                                thiss.map.removeInteraction(interaction);
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
                                            thiss.zoomByDelta(-1);
                                            //var zoom = view.getZoom();
                                            //view.setZoom(zoom - 1);
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
                                            thiss.zoomByDelta(1);
                                            //var zoom = view.getZoom();
                                            //view.setZoom(zoom + 1);
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
                                            thiss.navigation.previous.trigger();
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
                                            thiss.navigation.next.trigger();
                                        }
                                    });
                                };
                                this.fullExtent = function () {
                                    //                                var thiss = this;
                                    //                                var control = new OpenLayers.Control.ZoomToMaxExtent({
                                    //                                    autoActivate: false
                                    //                                });
                                    //                                thiss.map.addControl(control);
                                    //                                thiss.setButton2("full-extent", "Límite completo", false, function (state) {
                                    //                                    if (state == true)
                                    //                                        control.activate();
                                    //                                    else
                                    //                                        control.deactivate();
                                    //                                });
                                };
                                this.initialExtent = function () {
                                    var thiss = this;
                                    var extent = thiss.map.getView().get('initialExtent');
                                    thiss.setButton2({
                                        icon: "gh gh-initial-extent",
                                        label: "Límite inicial",
                                        openInitial: false,
                                        cssClass: ['jca-btn-left'],
                                        callback: function (state) {
                                            thiss.map.getView().fit(extent, thiss.map.getSize(), true);
                                        }
                                    });
                                };
                            }
                            Widget.prototype.load = function () {
                                var thiss = this;
                                thiss.config.module.isMenuButton = true;
                                this.initialExtent();
                                this.pan();
                                this.zoomIn();
                                this.zoomOut();
                                //                            this.previousExtent();
                                //                            this.nextExtent();
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