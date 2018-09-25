(function (com) {
    (function (jtm) {
        var BaseWidget = (function (_super) {
            __extends(BaseWidget, _super);
            function BaseWidget() {
                _super.call(this);
                this.$ddlDepartment = null;
                this.$ddlProvince = null;
                this.$ddlDistrict = null;
                this.$ddlHydrographicBasin = null;
                this.$ddlNationalCartography = null;
                this.dialog = null;
                this.panel = null;
                this.configView = null;
                this.setConfig = function (value) {
                    this.config = value;
                };
                this.setConfigView = function (value) {
                    this.configView = value;
                };
                this.setDomMain = function (value) {
                    this.$main = value;
                };
                this.setDomToolbar = function (value) {
                    this.$toolbar = value;
                };
                this.setDomWidget = function (value) {
                    var thiss = this;
                    this.$widget = value;
                    if (this.$widget === null || this.$widget.length === 0) {
                        thiss.config.module.isWidgetPopup = true;
                        thiss.$widget = jQuery('<div id ="' + thiss.getUUID() + '"></div>');
                    } else {
                        thiss.$widgetHeader = this.$widget.find('>.panel-heading');
                        thiss.$widgetBody = this.$widget.find('>.panel-body');
                        thiss.$widgetFooter = this.$widget.find('>.panel-footer');
                        thiss.$widget = thiss.$widgetBody;
                        var $widget = thiss.$widget;
                        var $widgetHeader = thiss.$widgetHeader;
                        var $widgetFooter = thiss.$widgetFooter;
                        thiss.$widgetHeader.find('>div>button').on("click", function (e) {
                            thiss.cleanControls();
                            $widgetHeader.find(">span").empty();
                            $widgetFooter.html('&nbsp;');
                            $widget.empty();
                        });
                    }
                };
                this.setButton = function () {
                    var thiss = this;
                    this.setButton2({
                        icon: thiss.configView.icon,
                        label: thiss.configView.label,
                        openInitial: thiss.configView.openInitial,
                        location: thiss.configView.location,
                        cssClass: thiss.configView.cssClass,
                        callback: null
                    });
                };
                this.setButton2 = function (options) {
                    options = options || {};
                    options.location = options.location || "top";
                    var thiss = this;
                    var buttonId = this.getUUID();
                    var $button = null;
                    if (thiss.config.module.isMenuButton === true)
                        button();
                    else
                        li();
                    if (options.openInitial === true)
                        $button.trigger('click');
                    function button() {
                        $button = jQuery('<button />', {
                            id: buttonId,
                            type: 'button',
                            html: '<i class="' + options.icon + '"></i>',
                            title: options.label,
                            on: {
                                click: function (e) {
                                    thiss.removeClassButton(this);
                                    jQuery(this).toggleClass(BaseWidget.ACTIVE);
                                    var state = jQuery(this).hasClass(BaseWidget.ACTIVE);
                                    if (typeof options.callback === "function")
                                        options.callback(state, jQuery(this));
                                    else
                                        thiss.onClick(state, jQuery(this));
                                }
                            }
                        }).appendTo(thiss.$toolbar.find("#" + options.location));
                        $button.addClass('btn jca-btn-circle');
                        if (options.cssClass instanceof Array) {
                            var i = 0;
                            for (i = 0; i < options.cssClass.length; i++)
                                $button.addClass(options.cssClass[i]);
                        }
                    }
                    function li() {
                        jQuery('<li />', {
                            id: buttonId,
                            html: '<a href="#">' + options.label + '</a>',
                            alt: options.label,
                            title: options.label,
                            on: {
                                click: function (e) {
                                    thiss.removeClassButton(this);
                                    jQuery(this).toggleClass(BaseWidget.ACTIVE);
                                    var state = jQuery(this).hasClass(BaseWidget.ACTIVE);
                                    if (options.callback !== undefined && options.callback !== null)
                                        options.callback(state, jQuery(this));
                                    else
                                        thiss.onClick(state, jQuery(this));
                                }
                            }
                        }).appendTo(thiss.$toolbar);
                        if (options.cssClass instanceof Array) {
                            var i = 0;
                            for (i = 0; i < options.cssClass.length; i++)
                                $button.addClass(options.cssClass[i]);
                        }
                    }
                };
                this.removeClassButton = function (currentObject) {
                    var thiss = this;
                    thiss.$toolbar.find("button").toArray().forEach(function (item) {
                        if (currentObject != item)
                            jQuery(item).removeClass(BaseWidget.ACTIVE);
                    });
                };

                this.showDialog = function (options) {
                    var thiss = this;
                    options = options || {};
                    thiss.$widget = $('<div id="' + thiss.getUUID() + '"></div>');
                    if (!thiss.config.module.widget) {
                        if (String.isNullOrWhiteSpace(thiss.configView.config) === false && String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                            jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                if (data === null) return;
                                thiss.config.module.widget = data;
                                thiss.initConfig();
                                thiss.loadDependencies();
                                dialog();
                                thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                    thiss.launchView();
                                });
                            });
                        }
                        else {
                            if (String.isNullOrWhiteSpace(thiss.configView.config) === true && String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                                dialog();
                                thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                    thiss.launchView();
                                });
                            }
                            else if (String.isNullOrWhiteSpace(thiss.configView.config) === false && String.isNullOrWhiteSpace(thiss.configView.uri.view) === true) {
                                jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                    if (data === null) return;
                                    thiss.config.module.widget = data;
                                    thiss.initConfig();
                                    thiss.loadDependencies();
                                    dialog();
                                    thiss.launchView();
                                });
                            }
                            else {
                                dialog();
                                thiss.initConfig();
                                thiss.launchView();
                            }
                        }
                    }
                    else {
                        if (String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                            this.dialog.dialog("open");
                            thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                thiss.launchView();
                            });
                        }
                        else {
                            this.dialog.dialog("open");
                            thiss.launchView();
                        }
                    }
                    function dialog() {
                        options.left = (thiss.configView.left === undefined || thiss.configView.left === null) ? 10 : thiss.configView.left;
                        options.top = (thiss.configView.top === undefined || thiss.configView.top === null) ? 10 : thiss.configView.top;
                        delete thiss.configView.left;
                        delete thiss.configView.top;
                        thiss.dialog = thiss.$widget.dialog({
                            title: thiss.configView.label,
                            width: (options.width === undefined) ? null : options.width,
                            resizable: false,
                            closeOnEscape: true,
                            height: options.height,
                            maxHeight: options.maxHeight,
                            width: options.width,
                            maxWidth: options.maxWidth,
                            position: [options.left, options.top],
                            close: function (dialog) {
                                thiss.cleanControls();
                            }
                        });
                    }
                };
                this.showPanel = function (options) {
                    var thiss = this;
                    options = options || {};
                    thiss.$widget.parent('div').removeClass("pl-close-lg");
                    thiss.$widgetHeader.find('>div>button').off("mouseup");
                    thiss.$widgetHeader.find('>div>button').on("mouseup", function (e) {
                        if (e.which != 1) return false;
                        thiss.cleanControls();
                        thiss.$widgetHeader.find('>span').empty();
                        thiss.$widget.empty();
                    });
                    thiss.$widgetHeader.find('>div>button').trigger("click");
                    thiss.$widgetHeader.find('>span').text(thiss.configView.label);
                    if (!thiss.config.module.widget) {
                        if (String.isNullOrWhiteSpace(thiss.configView.config) === false && String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                            jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                if (data === null) return;
                                thiss.config.module.widget = data;
                                thiss.initConfig();
                                thiss.loadDependencies();
                                thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                    thiss.launchView();
                                });
                            });
                        }
                        else {
                            if (String.isNullOrWhiteSpace(thiss.configView.config) === true && String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                                thiss.loadView(thiss.widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                    thiss.launchView();
                                });
                            }
                            else if (String.isNullOrWhiteSpace(thiss.configView.config) === false && String.isNullOrWhiteSpace(thiss.configView.uri.view) === true) {
                                jQuery.getJSON(thiss.json.module.subModule.widget.path + thiss.configView.config + "?" + Math.random(), function (data, textStatus, jqXHR) {
                                    if (data === null) return;
                                    thiss.config.module.widget = data;
                                    thiss.initConfig();
                                    thiss.loadDependencies();
                                    thiss.launchView();
                                });
                            }
                            else {
                                thiss.initConfig();
                                thiss.launchView();
                            }
                        }
                    }
                    else {
                        if (String.isNullOrWhiteSpace(thiss.configView.uri.view) === false) {
                            thiss.loadView(thiss.$widget, thiss.js.module.subModule.widget.path + thiss.configView.uri.view, function () {
                                thiss.launchView();
                            });
                        }
                        else {
                            thiss.launchView();
                        }
                    }
                };
            }
            BaseWidget.prototype.onClick = function (state, $btn) {
                alert('No implementado');
            };
            BaseWidget.prototype.buildTool = function () {
                this.setButton();
            };
            BaseWidget.prototype.load = function () {
                this.buildTool();
            };
            BaseWidget.prototype.parseAnyInitConfig = function () {
            };
            BaseWidget.prototype.initConfig = function () {
                this.parseAnyInitConfig();
            };
            BaseWidget.prototype.launchView = function () {
            };
            BaseWidget.prototype.showView = function (options) {
                var thiss = this;
                options = options || {};
                if (thiss.config.module.isWidgetPopup === true)
                    thiss.showDialog(options.dialog);
                else
                    thiss.showPanel(options.panel);
            };
            BaseWidget.prototype.html2Canvas = function ($dom, $img, options) {
                var thiss = this;
                options = options || {};
                options.height = (typeof options.height === "number" && options.height > 0) ? options.height : 300;
                options.width = (typeof options.width === "number" && options.width > 0) ? options.width : 500;
                html2canvas($dom, {
                    useCORS: true,
                    allowTaint: false,
                    height: options.height,
                    width: options.width,
                    onrendered: function (canvas) {
                        var url = canvas.toDataURL();
                        //var url = URL.createObjectURL(blob);
                        if (typeof options.callbackOnRendered === "function")
                            options.callbackOnRendered(canvas);
                        $img.on("load", function () {
                            URL.revokeObjectURL(url);
                        });
                        $img.attr("src", url);
                    }
                });
            };
            /*Events of Synchronization*/

            BaseWidget.prototype.onMouseClickGraphicToElement = function (graphic, $dom, options) {
            };
            BaseWidget.prototype.onMouseOverGraphicToElement = function (graphic, $dom, options) {
                var thiss = this;
                if (String.isNullOrWhiteSpace($dom))
                    $dom = thiss.$table;
                if (typeof $dom === "string")
                    $dom = jQuery($dom);
                var element = $dom.find("#" + options.id);
                $dom.find("." + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                element[0].scrollIntoView();
                element.addClass(BaseWidget.ELEMENTSELECTED);
            };
            BaseWidget.prototype.onMouseOutGraphicToElement = function (graphic, $dom, options) {
                var thiss = this;
                if (String.isNullOrWhiteSpace($dom))
                    $dom = thiss.$table;
                if (typeof $dom === "string")
                    $dom = jQuery($dom);
                $dom.find("." + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
            };
            BaseWidget.prototype.onMouseClickElementToGraphic = function (element, layer, options) {
                var thiss = this;
                if (String.isNullOrWhiteSpace(element)) return;
                var closestSelector = element.id.substring(0, element.id.lastIndexOf('_'));
                if (String.isNullOrWhiteSpace(closestSelector)) return;
                jQuery(element).closest('#' + closestSelector).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                jQuery(element).addClass(BaseWidget.ELEMENTSELECTED);
            };
            BaseWidget.prototype.onMouseDoubleClickElementToGraphic = function (element, layer, options) {
            };
            BaseWidget.prototype.onMouseOverElementToGrahic = function (element, layer, options) {
                var thiss = this;
                if (String.isNullOrWhiteSpace(element)) return;
                var closestSelector = element.id.substring(0, element.id.lastIndexOf('_'));
                if (String.isNullOrWhiteSpace(closestSelector)) return;
                jQuery(element).closest('#' + closestSelector).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
                jQuery(element).addClass(BaseWidget.ELEMENTSELECTED);
            };
            BaseWidget.prototype.onMouseOutElementToGrahic = function (element, layer, options) {
                var thiss = this;
                if (String.isNullOrWhiteSpace(element)) return;
                var closestSelector = element.id.substring(0, element.id.lastIndexOf('_'));
                if (String.isNullOrWhiteSpace(closestSelector)) return;
                jQuery(element).closest('#' + closestSelector).find('.' + BaseWidget.ELEMENTSELECTED).removeClass(BaseWidget.ELEMENTSELECTED);
            };

            BaseWidget.prototype.onMouseClickChartToGraphic = function (e, graphics) {
            };
            BaseWidget.prototype.onMouseOverChartToGraphic = function (e, graphics, index) {
            };
            BaseWidget.prototype.onMouseOutChartToGraphic = function (e, layer) {
            };
            BaseWidget.prototype.onMouseClickGraphicToChart = function (graphic) {
            };
            BaseWidget.prototype.onMouseOverGraphicToChart = function (graphic, series) {
            };
            BaseWidget.prototype.onMouseOutGraphicToChart = function (graphic, series) {
            };
            BaseWidget.prototype.onMouseClickChartToElement = function (e, $dom) {
            };
            BaseWidget.prototype.onMouseOverChartToElement = function (e, $dom) {
            };
            BaseWidget.prototype.onMouseOutChartToElement = function (e) {
            };
            BaseWidget.prototype.onMouseClickElementToChart = function (element, series) {
            };
            BaseWidget.prototype.onMouseOverElementToChart = function (element, series) {
            };
            BaseWidget.prototype.onMouseOutElementToChart = function (element, series) {
            };
            /**Eventos ***/
            return BaseWidget;
        })(jtm.Master);
        jtm.BaseWidget = BaseWidget;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));