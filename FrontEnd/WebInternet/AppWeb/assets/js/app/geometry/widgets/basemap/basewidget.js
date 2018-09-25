(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (basemap) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.build = function () {
                                    var thiss = this;
                                    thiss.$widget.empty();
                                    var element;
                                    var i = 0;
                                    for (i = 0; i < this.config.module.widget.baseMaps.length; i++) {
                                        element = $('<img />');
                                        element.prop("id", this.config.module.widget.baseMaps[i].id);
                                        element.addClass("img-circle");
                                        element.addClass("img-responsive");
                                        element.addClass("gh-cursor-pointer");
                                        element.prop("src", this.config.module.widget.baseMaps[i].icon);
                                        element.prop("alt", this.config.module.widget.baseMaps[i].label);
                                        element.prop("title", this.config.module.widget.baseMaps[i].label);
                                        element.on("click", function (e) {
                                            thiss.changeVisibility(jQuery(this).prop("id"));
                                        });
                                        element.on("mouseover", function (e) {
                                            jQuery(this).addClass('gh-thumbnail-over');
                                        });
                                        element.on("mouseleave", function (e) {
                                            jQuery(this).removeClass('gh-thumbnail-over');
                                        });
                                        thiss.$widget.append(element);
                                    }
                                };
                                this.addItems = function ($btn) {
                                    var thiss = this;
                                    var $divList = $btn.parent().find('>.dropdown-menu');
                                    if ($divList.is(':empty')) {
                                        $divList.append('<li class="dropdown-header">' + thiss.configView.label + '</li>');
                                        var baseMaps = thiss.config.module.widget.baseMaps;
                                        var uuid = thiss.getUUID();
                                        var i = 0;
                                        for (i = 0; i < baseMaps.length; i++) {
                                            if (baseMaps[i].disabled === true) continue;
                                            $divList.append('<li role="separator" class="divider"></li>');
                                            for (var j = 0; j < baseMaps[i].items.length; j++) {
                                                if (baseMaps[i].items[j].disabled === true) continue;
                                                var $rdb = $('<input type="radio" name="rdb_' + uuid + '" id="' + baseMaps[i].items[j].id + '" />');
                                                var $a = $('<a></a>');
                                                $a.append($rdb);
                                                $a.append('&nbsp;' + baseMaps[i].items[j].label);
                                                var $li = $('<li></li>');
                                                $li.append($a);
                                                $rdb.on('change', function (e) {
                                                    if (jQuery(this).is(":checked") === true) {
                                                        thiss.changeVisibility(jQuery(this).prop("id"));
                                                        $rdb.closest('li').trigger('click');
                                                    }
                                                });
                                                $divList.append($li);
                                            }
                                        }
                                    }
                                    thiss.currentMap();
                                };
                            }
                            BaseWidget.prototype.buildTool = function () {
                                var thiss = this;
                                this.configView = this.configView || {};
                                this.configView.icon = "gh gh-base-map";
                                this.configView.label = "Mapas base";
                                this.configView.uri = {};
                                var options = {
                                    icon: thiss.configView.icon,
                                    label: thiss.configView.label,
                                    openInitial: thiss.configView.openInitial,
                                    callback: null
                                };
                                var uuid = thiss.getUUID();
                                var $div = $('<div class="btn-group dropdown"></div>').appendTo(thiss.$toolbar);
                                var $button = null;
                                $button = jQuery('<button />', {
                                    id: uuid,
                                    type: 'button',
                                    html: '<i class="' + options.icon + '"></i><span class="caret"></span>',
                                    title: options.label,
                                    on: {
                                        click: function (e) {
                                            thiss.removeClassButton(this);
                                            jQuery(this).toggleClass(BaseWidget.ACTIVE);
                                            var state = jQuery(this).hasClass(BaseWidget.ACTIVE);
                                            if (typeof options.callback === "function")
                                                options.callback(state);
                                            else
                                                thiss.onClick(state, jQuery(this));
                                        }
                                    }
                                }).appendTo($div);
                                $button.addClass('btn');
                                $button.addClass('dropdown-toggle');
                                $button.attr('data-toggle', 'dropdown');
                                $button.attr('aria-haspopup', 'true');
                                $button.attr('aria-expanded', 'true');
                                if (options.cssClass instanceof Array) {
                                    var i = 0;
                                    for (i = 0; i < options.cssClass.length; i++)
                                        $button.addClass(options.cssClass[i]);
                                }
                                var $divList = $('<ul class="dropdown-menu  dropdown-menu-left" aria-labelledby="' + uuid + '"></ul>').appendTo($div);
                                $divList.css("overflow", "auto").css("max-height", 400);
                                thiss.$widget = $div;
                                //_super.prototype.buildTool.call(this);
                            };
                            BaseWidget.prototype.onClick = function (state, $btn) {
                                var thiss = this;
                                thiss.addItems($btn);
                            };
                            BaseWidget.prototype.initConfig = function () {
                                if (!(this.config.module.map.baseMaps instanceof Array)) {
                                    alert("No hay mapas base");
                                    return;
                                }
                                this.config.module.widget = this.config.module.widget || {};
                                this.config.module.widget.baseMaps = JSON.parse(JSON.stringify(this.config.module.map.baseMaps));
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.build();
                            };
                            BaseWidget.prototype.load = function () {
                                var thiss = this;
                                _super.prototype.load.call(this);
                                thiss.initConfig();
                            };
                            BaseWidget.prototype.changeVisibility = function (id) {
                            };
                            BaseWidget.prototype.currentMap = function () {
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        basemap.BaseWidget = BaseWidget;
                    })(widgets.basemap || (widgets.basemap = {}));
                    var basemap = widgets.basemap;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));