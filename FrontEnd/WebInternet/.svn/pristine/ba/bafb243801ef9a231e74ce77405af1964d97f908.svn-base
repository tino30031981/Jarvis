function getObject() {
    return com.jtm.geometry.viewer.widgets.splash.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (splash) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.close = function () {
                                };
                            }
                            Widget.prototype.load = function () {
                                var thiss = this;
                                thiss.domWidget = thiss.getUUID();
                                if (!this.dialog) {
                                    jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                        if (data === null) return;
                                        thiss.config.module.widget = data;
                                        thiss.dialog = jQuery('<div id="' + thiss.domWidget + '"></div>').dialog({
                                            title: thiss.configView.label,
                                            height: 400,
                                            width: 600,
                                            resizable: false,
                                            autoremove: true,
                                            closable: false,
                                            modal: true,
                                            buttons: [{
                                                label: "Manual de usuario",
                                                action: function (dialog) {
                                                    window.open(thiss.js.module.subModule.widget.path + "ayuda.pdf", '_blank');
                                                }
                                            },
                                            {
                                                label: "Aceptar",
                                                action: function (dialog) {
                                                    dialog.close();
                                                }
                                            }]
                                        });
                                        thiss.loadView('#' + thiss.domWidget, thiss.js.module.subModule.widget.path + thiss.configView.url, function () {
                                            thiss.launchView();
                                        });
                                    });
                                } else {
                                    this.dialog.dialog("open");
                                    this.launchView();
                                }
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                if (thiss.config.module.widgetonlyText === true) {
                                    jQuery('#' + thiss.domWidget + ' #slides').html(thiss.config.text);
                                }
                                else {
                                    if (thiss.config.module.widgetslides === undefined || thiss.config.module.widgetslides === null || thiss.config.module.widgetslides.length === 0) return;
                                    jQuery('#' + thiss.domWidget + ' #slides').html("");
                                    var i = 0;
                                    var animationDelay = thiss.config.module.widgetslides.length * 2;
                                    for (i = 0; i < thiss.config.module.widgetslides.length; i++) {
                                        jQuery('#slides').append('<img src="' + this.img + thiss.config.module.widgetslides[i] + '" style="animation-delay:' + animationDelay + 's" />');
                                        animationDelay -= 2;
                                    }
                                }
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(geometry.Widget);
                        splash.Widget = Widget;
                    })(widgets.splash || (widgets.splash = {}));
                    var identify = widgets.splash;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));