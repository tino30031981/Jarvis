(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wms) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlServer = null;
                                this.$ddlLayer = null;
                                this.$btnFullExtent = null;
                                this.$divResult = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 200 }
                                });
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.services = thiss.config.module.widget.services || [];
                                thiss.config.module.widget.services2 = [];
                                thiss.config.module.widget.services.forEach(function (item) {
                                    if (item.disabled === false) {
                                        if (item.url.startsWith("http") === false)
                                            item.url = com.jtm.Server.contextPath + item.url;
                                        thiss.config.module.widget.services2.push(item);
                                    }
                                });
                                thiss.config.module.widget.services = thiss.config.module.widget.services2;
                                delete thiss.config.module.widget.services2;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$ddlServer = thiss.$widget.find("#ddlServer");
                                thiss.$ddlLayer = thiss.$widget.find("#ddlLayer");
                                thiss.$btnFullExtent = thiss.$widget.find("#btnFullExtent");
                                thiss.$divResult = thiss.$widget.find("#divResult");
                                setTimeout(function () {
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: thiss.$ddlServer,
                                        fieldId: "url",
                                        fieldName: "name",
                                        items: thiss.config.module.widget.services,
                                        callback: function () {
                                            thiss.searchLayers(this);
                                        }
                                    });
                                }, 1000);
                                thiss.$ddlLayer.off("change");
                                thiss.$ddlLayer.on("change", function (e) {
                                    thiss.detailLayer(this);
                                });
                                thiss.$btnFullExtent.off("click");
                                thiss.$btnFullExtent.on("click", function (e) {
                                    thiss.fitExtent();
                                });
                                thiss.$ddlServer.trigger("change");
                                thiss.$ddlLayer.trigger("change");
                            };
                            BaseWidget.prototype.fitExtent = function () {
                            };
                            BaseWidget.prototype.addToMap = function (item) {
                            };
                            BaseWidget.prototype.searchLayers = function (obj) {
                                var thiss = this;
                                var url = jQuery(obj).val();
                                var items = gh.spatial.helper.WmsHelper.listAllLayers(url);
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlLayer,
                                    items: items
                                });
                            };
                            BaseWidget.prototype.detailLayer = function (obj) {
                                var thiss = this;
                                thiss.$divResult.find("dd").empty();
                                var layerName = jQuery(obj).string();
                                if (layerName === null) return;
                                var url = thiss.$ddlServer.val();
                                var item = gh.spatial.helper.WmsHelper.detailLayer(url, layerName);
                                thiss.writeData(item);
                            };
                            BaseWidget.prototype.writeData = function (item) {
                                var thiss = this;
                                if (item === null) {
                                    alert("No hay datos");
                                    return;
                                }
                                var html = "";
                                thiss.$divResult.find(">.panel-heading>span").text(item.id + " (" + item.name + ")");
                                thiss.$divResult.find(">.panel-body #ddId").text(item.id);
                                thiss.$divResult.find(">.panel-body #ddName").text(item.name);
                                thiss.$divResult.find(">.panel-body #ddAbstract").text(item.abstract);
                                thiss.$divResult.find(">.panel-body #ddKeywords").text(item.keywords);
                                thiss.$divResult.find(">.panel-body #ddOpacity").text(item.opacity);
                                $dom = thiss.$divResult.find(">.panel-body #ddCrs").append('<ul class="list-group"></ul>');
                                item.crs.forEach(function (item) {
                                    $dom.append('<li class="list-group-item">' + item + '</li>');
                                });
                                $dom = thiss.$divResult.find(">.panel-body #ddBoundingBox").append('<ul class="list-group"></ul>');
                                $dom.append('<li class="list-group-item"><span class="badge">' + item.boundingbox.geographic.srid + '</span>xmin: ' + item.boundingbox.geographic.xmin + ', ymin: ' + item.boundingbox.geographic.ymin + ', xmax: ' + item.boundingbox.geographic.xmax + ', ymax: ' + item.boundingbox.geographic.ymax + '</li>');
                                $dom.append('<li class="list-group-item"><span class="badge">' + item.boundingbox.projected.srid + '</span>xmin: ' + item.boundingbox.projected.xmin + ', ymin: ' + item.boundingbox.projected.ymin + ', xmax: ' + item.boundingbox.projected.xmax + ', ymax: ' + item.boundingbox.projected.ymax + '</li>');
                                $dom = thiss.$divResult.find(">.panel-body #ddStyles");
                                html = "";
                                item.styles.forEach(function (item) {
                                    html = ('<div class="col-xs-12 col-sm-6 col-md-6">');
                                    html += ('<div class="thumbnail">');
                                    html += ('<img src="' + item.url + '" alt="' + item.name + '">');
                                    html += ('<div class="caption">');
                                    html += ('<div>Nombre: ' + item.name + '</div>');
                                    html += ('<div>Formato: ' + item.format + '</div>');
                                    html += '</div>';
                                    html += '</div>';
                                    html += '</div>';
                                    $dom.append(html);
                                });
                                thiss.addToMap(item);
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        wms.BaseWidget = BaseWidget;
                    })(widgets.wms || (widgets.wms = {}));
                    var wms = widgets.wms;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));