function getObject() {
    return com.jtm.geometry.viewer.widgets.bookmark.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (bookmark) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.zoomGeometry = function (extent) {
                                    var thiss = this;
                                    thiss.map.setExtent(extent);
                                };
                                this.loadData = function () {
                                    var thiss = this;
                                    thiss.$ulResult.empty();
                                    var html = "";
                                    var i = 0;
                                    for (i = thiss.config.module.widget.graphics.length - 1; i >= 0; i--) {
                                        thiss.layer.add(thiss.config.module.widget.graphics[i]);
                                        html = ('<li class="list-group-item"  data-uniqueid="' + thiss.config.module.widget.graphics[i].attributes.id + '">');
                                        html += (thiss.config.module.widget.graphics[i].attributes.name);
                                        html += ('<span class="pull-right badge remove gh-cursor-pointer" data-uniqueid="' + thiss.config.module.widget.graphics[i].attributes.id + '"><i class="glyphicon glyphicon-remove"></i></span>');
                                        html += ('</li>');
                                        thiss.$ulResult.append(html);
                                    }
                                };
                                this.add = function () {
                                    var thiss = this;
                                    if (String.isNullOrWhiteSpace(thiss.$txtName.val())) {
                                        alert("Ingrese un nombre para el marcador");
                                        return;
                                    }
                                    var g = new esri.Graphic(thiss.map.extent, null, { id: thiss.getUUID(), name: thiss.$txtName.val() });
                                    thiss.config.module.widget.graphics.push(g);
                                    thiss.layer.clear();
                                    thiss.loadData();
                                    thiss.$txtName.val("");
                                    thiss.$ulResult.find('>li').off("mouseover");
                                    thiss.$ulResult.find('>li').on("mouseover", function (e) {
                                        jQuery(this).addClass(Widget.ELEMENTSELECTED);
                                    });
                                    thiss.$ulResult.find('>li').off("mouseout");
                                    thiss.$ulResult.find('>li').on("mouseout", function (e) {
                                        jQuery(this).removeClass(Widget.ELEMENTSELECTED);
                                    });
                                    thiss.$ulResult.find('>li').off("click");
                                    thiss.$ulResult.find('>li').on("click", function (e) {
                                        var g = thiss.getGraphic(jQuery(this).attr("data-uniqueid"));
                                        thiss.map.setExtent(g.geometry);
                                    });
                                    thiss.$ulResult.find('>li .remove').off("click");
                                    thiss.$ulResult.find('>li .remove').on("click", function (e) {
                                        jQuery(this).closest("li").remove();
                                        var i = thiss.getGraphicIndex(jQuery(this).attr("data-uniqueid"));
                                        thiss.config.module.widget.graphics.splice(i, 1);
                                    });
                                };
                                this.getGraphic = function (id) {
                                    var thiss = this;
                                    var g = null;
                                    var i = 0;
                                    for (i in thiss.config.module.widget.graphics) {
                                        g = thiss.config.module.widget.graphics[i];
                                        if ((g.attributes) && g.attributes.id == id) {
                                            break;
                                        }
                                    }
                                    return g;
                                };
                                this.getGraphicIndex = function (id) {
                                    var thiss = this;
                                    var g = null;
                                    var i = 0;
                                    for (i in thiss.config.module.widget.graphics) {
                                        g = thiss.config.module.widget.graphics[i];
                                        if ((g.attributes) && g.attributes.id == id) {
                                            break;
                                        }
                                    }
                                    return i;
                                };
                            }
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                this.$ulResult = thiss.$widget.find('#ulResult');
                                this.$txtName = thiss.$widget.find('#txtName');
                                this.$btnAdd = thiss.$widget.find('#btnAdd');
                                thiss.layer = new esri.layers.GraphicsLayer();
                                thiss.layer.setVisibility(false);
                                thiss.map.addLayer(thiss.layer);
                                thiss.loadData();
                                thiss.$btnAdd.off("click");
                                thiss.$btnAdd.on("click", function (e) {
                                    thiss.add();
                                });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(bookmark.BaseWidget);
                        bookmark.Widget = Widget;
                    })(widgets.bookmark || (widgets.bookmark = {}));
                    var bookmark = widgets.bookmark;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));