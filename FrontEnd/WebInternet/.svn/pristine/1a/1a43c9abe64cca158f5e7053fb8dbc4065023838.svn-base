var com;
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseMap = (function (_super) {
                __extends(BaseMap, _super);
                function BaseMap() {
                    _super.call(this);
                    this.$toolbarLeft = null;
                    this.$toolbarRight = null;
                    this.$toolbarBottom = null;
                    this.$toolNorthArrow = null;
                    this.setOrientation = function () {
                        var thiss = this;
                        onOrientationChange(null);
                        window.addEventListener("orientationchange", onOrientationChange, true);
                        window.addEventListener('resize', onOrientationChange, true);
                        function onOrientationChange(e) {
                            var fullHeight = thiss.$window.outerHeight(true);
                            var headerHeight = thiss.$header.length === 0 ? 0 : thiss.$header.outerHeight(true);
                            var footerHeight = thiss.$footer.length === 0 ? 0 : thiss.$footer.outerHeight(true);
                            var heightUsed = headerHeight + footerHeight;
                            var orientation = window.orientation;
                            if (orientation === undefined) {
                                orientation = (thiss.$window.width() <= 650) ? 180 : 90;
                            }
                            switch (orientation) {
                                case -90:
                                case 90:
                                    if (thiss.config.module.isWidgetPopup === true) {
                                        toggleClass(thiss.$map, "col-xs-12", "col-sm-12", "col-md-12");
                                        toggle(thiss.$map, fullHeight - heightUsed);
                                    }
                                    else {
                                        toggleClass(thiss.$map, "col-xs-12", "col-sm-12", "col-md-12");
                                        toggleClass(thiss.$widget, "", "", "");
                                        toggle(thiss.$map, fullHeight - heightUsed);
                                        toggle(thiss.$widget, fullHeight - heightUsed);
                                    }
                                    break;
                                default:
                                    if (thiss.config.module.isWidgetPopup === true) {
                                        toggleClass(thiss.$map, "col-xs-12", "col-sm-12", "col-md-12");
                                        toggle(thiss.$map, fullHeight - heightUsed);
                                    }
                                    else {
                                        toggleClass(thiss.$map, "col-xs-12", "col-sm-8", "col-md-10");
                                        toggleClass(thiss.$widget, "", "", "");
                                        toggle(thiss.$map, (fullHeight - heightUsed) / 2);
                                        toggle(thiss.$widget, (fullHeight - heightUsed) / 2);
                                    }
                                    break;
                            }
                            var heightWidget = thiss.$widget.outerHeight(true);
                            var heightWidgetHeader = thiss.$widgetHeader.outerHeight(true);
                            var heightWidgetFooter = thiss.$widgetFooter.outerHeight(true);
                            thiss.$map.addClass("map");
                            thiss.$widget.addClass("panel-lateral lg pl-close-lg");
                            thiss.$widgetBody.addClass("gh-content");
                            thiss.$widgetBody.css("height", heightWidget - (heightWidgetHeader + heightWidgetFooter));
                            thiss.$widgetBody.css("overflow", "auto");
                            function toggleClass($dom, phone, tablet, pc) {
                                $dom.removeClass().addClass(phone).addClass(tablet).addClass(pc);
                                //$dom.addClass("map");
                                $dom.addClass("gh-padding-0");//.addClass("gh-position")
                            }
                            function toggle($dom, height) {
                                $dom.css("height", height);
                                jQuery($dom[0].id + "_root").css("height", height);
                            }
                        }
                    };
                    this.showSplash = function () {
                        var thiss = this;
                        var uri = thiss.config.module.splashPage.uri.endsWith("/") ? thiss.config.module.splashPage.uri : thiss.config.module.splashPage.uri + "/";
                        thiss.config.module.splashPage.uri = {};
                        thiss.config.module.splashPage.uri.script = uri + "widget.js";
                        thiss.config.module.splashPage.uri.view = uri + "widget.html";
                        jQuery.ajaxSetup({ async: false });
                        jQuery.getScript(thiss.js.module.subModule.widget.path + thiss.config.module.splashPage.uri.script, function (data, textStatus, jqxhr) {
                            var widget = getObject();
                            widget.setConfig(JSON.parse(JSON.stringify(thiss.config)));
                            widget.setPathJS(thiss.js);
                            widget.setPathJSON(thiss.json);
                            widget.setPathImage(thiss.img);
                            //widget.setDomToolbar(thiss.$toolbar);
                            //widget.setDomToolbarLeft(thiss.$toolbarLeft);
                            //widget.setDomToolbarRight(thiss.$toolbarRight);
                            //widget.setDomToolbarBottom(thiss.$toolbarBottom);
                            widget.setConfigView(thiss.config.module.splashPage);
                            widget.setMap(thiss.map);
                            widget.load();
                        });
                        jQuery.ajaxSetup({ async: true });
                    };
                }
                BaseMap.prototype.setContainers = function () {
                    var thiss = this;
                    if (thiss.config.module.isWidgetPopup === true) {
                        thiss.$map = thiss.$body;
                        return;
                    }
                    thiss.$map = $('<div id="' + thiss.getUUID() + '"></div>');
                    thiss.$widget = $('<div class="panel panel-default"></div>');
                    thiss.$widgetButton = $('<button class="btn-panel-lateral"><i class="glyphicon glyphicon-menu-hamburger"></i></button>');
                    thiss.$widgetHeader = $('<div class="panel-heading">&nbsp;</div>');
                    thiss.$widgetBody = $('<div class="panel-body"></div>');
                    thiss.$widgetFooter = $('<div class="panel-footer">&nbsp;</div>');
                    thiss.$body.find('>ol').remove();
                    thiss.$body.append(thiss.$map);
                    thiss.$body.append(thiss.$widget);
                    thiss.$widgetButton.on("click", function (e) {
                        //$(".panel-lateral").toggleClass("pl-close-lx");
                        //$(".container").toggleClass("container-pl-collapse");
                        var classes = $(this).parent().attr('class');
                        var newClass = ((classes.indexOf("lx") > -1) ? "pl-close-lx" : ((classes.indexOf("lg") > -1) ? "pl-close-lg" : "pl-close"));
                        if (classes.indexOf(newClass) > -1) {
                            $(".panel-lateral").removeClass(newClass);
                            $(".container").removeClass("container-pl-collapse");
                        } else {
                            $(".panel-lateral").addClass(newClass);
                            $(".container").addClass("container-pl-collapse");
                        }
                    });
                    addPanelToWidget();
                    function addPanelToWidget() {
                        thiss.$widget.empty();
                        thiss.$widget.append(thiss.$widgetButton);
                        thiss.$widget.append(thiss.$widgetHeader);
                        thiss.$widget.append(thiss.$widgetBody);
                        thiss.$widget.append(thiss.$widgetFooter);
                        thiss.$widgetHeader.append("<span></span>");
                        thiss.$widgetHeader.append('<div class="btn-group pull-right"><button type="button" class="btn" style="padding:0;border:0;"><span class="glyphicon glyphicon-remove"></span></button></div>');
                    }
                };
                BaseMap.prototype.setToolbar = function () {
                    var thiss = this;
                    if (thiss.$toolbar === null || thiss.$toolbar.length === 0) {
                        thiss.$toolbar = jQuery('<div><div id="top" class="gh-btn-top"></div><div id="left" class="gh-btn-left"></div></div>').appendTo(thiss.$map);
                        thiss.$toolbar.addClass("col-xs-12").addClass("text-right");
                        thiss.$toolbar.css({ position: "absolute", top: 0, "z-index": 0, height: 0 });
                    }
                    if (thiss.$toolbarLeft === null || thiss.$toolbarLeft.length === 0) {
                        thiss.$toolbarLeft = jQuery('<div></div>').appendTo(thiss.$map);
                        thiss.$toolbarLeft.css({ position: "absolute", left: 0, "z-index": 0, height: "auto" });
                    }
                    if (thiss.$toolbarRight === null || thiss.$toolbarRight.length === 0) {
                        thiss.$toolbarRight = jQuery('<div></div>').appendTo(thiss.$map);
                        thiss.$toolbarRight.css({ position: "absolute", right: 0, "z-index": 0, height: "auto" });
                    }
                    if (thiss.$toolbarBottom === null || thiss.$toolbarBottom.length === 0) {
                        thiss.$toolbarBottom = jQuery('<div></div>').appendTo(thiss.$map);
                        thiss.$toolbarBottom.addClass("col-xs-6").addClass("text-left");
                        thiss.$toolbarBottom.css({ position: "absolute", bottom: 0, "z-index": 0, height: "auto" });
                    }
                    if (thiss.$toolNorthArrow === null || thiss.$toolNorthArrow.length === 0) {
                        thiss.$toolNorthArrow = jQuery('<div></div>').appendTo(thiss.$map);
                        thiss.$toolNorthArrow.append('<span class="gh gh-north-arrow"></span>');
                        thiss.$toolNorthArrow.find('>span').css({ "font-size": "70px" });
                        thiss.$toolNorthArrow.css({ position: "absolute", top: 0, left: 0, "z-index": 0, height: 0 });
                    }
                    thiss.$toolNorthArrow.hide();
                    this.widgetsDefault(this.config.module);
                    this.widgetsCustom(this.config.module.widgetContainer);
                };
                BaseMap.prototype.setServices = function () {
                    var thiss = this;
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getScript(thiss.js.path + BaseMap.MODULE + "/baseservice.js");
                    jQuery.getScript(thiss.js.path + BaseMap.MODULE + "/" + thiss.js.apigeo.path + "service.js", function (data, textStatus, jqxhr) {
                        var client = new com.jtm.geometry.Service(thiss.map);
                        client.Base(thiss.config.module.map.baseMaps);
                        var services2 = [];
                        client.Operational(thiss.config.module.map.services, services2);
                        thiss.config.module.map.services = services2;
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseMap.prototype.widgetsDefault = function (widgetContainer) {
                    var thiss = this;
                    if (!(thiss.config.module.widgetsDefault instanceof Array)) {
                        if (typeof thiss.config.module.widgetsDefault === "string")
                            thiss.config.module.widgetsDefault = thiss.config.module.widgetsDefault.split(',');
                        else
                            return;
                    }
                    var bases = [];
                    for (var i = 0; i < thiss.config.module.widgetsDefault.length; i++) {
                        bases[i] = thiss.config.module.widgetsDefault[i] + "/basewidget.js";
                        thiss.config.module.widgetsDefault[i] = thiss.config.module.widgetsDefault[i] + "/" + thiss.apigeo + "widget.js";
                    }
                    jQuery.ajaxSetup({ async: false });
                    thiss.config.module.widgetsDefault.forEach(function (item, i) {
                        jQuery.getScript(thiss.js.module.subModule.widget.path + bases[i]);
                        jQuery.getScript(thiss.js.module.subModule.widget.path + item, function (data, textStatus, jqxhr) {
                            var widget = getObject();
                            widget.setConfig(JSON.parse(JSON.stringify(thiss.config)));
                            widget.setDomMap(thiss.$map);
                            widget.setDomToolbar(thiss.$toolbar);
                            widget.setDomToolbarLeft(thiss.$toolbarLeft);
                            widget.setDomToolbarRight(thiss.$toolbarRight);
                            widget.setDomToolbarBottom(thiss.$toolbarBottom);
                            widget.setDomToolNorthArrow(thiss.$toolNorthArrow);
                            widget.setDomWidget(thiss.$widget);
                            widget.setPathJS(thiss.js);
                            widget.setPathJSON(thiss.json);
                            widget.setPathImage(thiss.img);
                            widget.setMap(thiss.map);
                            widget.setConfigView(null);
                            widget.load();
                        });
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseMap.prototype.widgetsCustom = function (widgetContainer) {
                    var thiss = this;
                    if (widgetContainer === null) return;
                    if (widgetContainer.widgets === null) return;
                    var widgets = widgetContainer.widgets;
                    var uri = '';
                    jQuery.ajaxSetup({ async: false });
                    for (i = 0; i < widgets.length; i++) {
                        if (widgets[i].disabled === true) continue;
                        uri = widgets[i].uri.endsWith("/") ? widgets[i].uri : widgets[i].uri + "/";
                        widgets[i].uri = {};
                        widgets[i].uri.base = uri;
                        widgets[i].uri.baseApiGeo = uri + thiss.apigeo;
                        widgets[i].uri.script = uri + thiss.apigeo + "widget.js";
                        widgets[i].uri.view = uri + "widget.html";
                        jQuery.getScript(thiss.js.module.subModule.widget.path + widgets[i].uri.base + 'basewidget.js');
                        jQuery.getScript(thiss.js.module.subModule.widget.path + widgets[i].uri.script, function (data, textStatus, jqxhr) {
                            if (jqxhr.status != 200) return;
                            var widget = getObject();
                            widget.setConfig(JSON.parse(JSON.stringify(thiss.config)));
                            widget.setDomMap(thiss.$map);
                            widget.setDomToolbar(thiss.$toolbar);
                            widget.setDomToolbarLeft(thiss.$toolbarLeft);
                            widget.setDomToolbarRight(thiss.$toolbarRight);
                            widget.setDomToolbarBottom(thiss.$toolbarBottom);
                            widget.setDomToolNorthArrow(thiss.$toolNorthArrow);
                            widget.setDomWidget(thiss.$widget);
                            widget.setPathJS(thiss.js);
                            widget.setPathJSON(thiss.json);
                            widget.setPathImage(thiss.img);
                            widget.setMap(thiss.map);
                            widget.setConfigView(widgets[i]);
                            widget.load();
                        });
                    }
                    jQuery.ajaxSetup({ async: true });
                };
                BaseMap.prototype.parseSymbols = function () {
                };
                BaseMap.prototype.setCoordinates = function () {
                };
                BaseMap.prototype.domConfig = function () {
                };
                BaseMap.prototype.uiConfig = function () {
                };
                BaseMap.prototype.buttonConfig = function () {
                };
                BaseMap.prototype.viewConfig = function () {
                };
                BaseMap.prototype.load = function (jsonFile, options, callback) {
                    var thiss = this;
                    jsonFile = jsonFile || 'viewer';
                    options = options || {};
                    options.module = options.module || "geometry";
                    options.subModule = options.subModule || "viewer";
                    options.extendsRoot = true;
                    _super.prototype.load.call(this, jsonFile, options);
                };
                BaseMap.prototype.setModule = function (jsonFile, options, callback) {
                    var thiss = this;
                    options = options || {};
                    options.dependencies = ["basewidget", "geometry/basemapwidget", "geometry/" + options.framework + "/widget"];
                    _super.prototype.setModule.call(this, jsonFile, options, function () {
                        jQuery.ajaxSetup({ async: false });
                        options.dependencies.forEach(function (dependency) {
                            jQuery.getScript(thiss.js.path + dependency + ".js");
                        });
                        jQuery.ajaxSetup({ async: false });
                        if (thiss.config.module.withSplash === true)
                            thiss.showSplash();
                        thiss.build();
                    });
                };
                BaseMap.prototype.loadConfig = function (options, callback) {
                    var thiss = this;
                    options.noParseSymbols = true;
                    _super.prototype.loadConfig.call(this, options, callback);
                };
                BaseMap.prototype.build = function () {
                    this.setContainers();
                    this.setOrientation();
                };
                BaseMap.prototype.setOverView = function () {
                };
                return BaseMap;
            })(geometry.BaseSimpleMap);
            geometry.BaseMap = BaseMap;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));