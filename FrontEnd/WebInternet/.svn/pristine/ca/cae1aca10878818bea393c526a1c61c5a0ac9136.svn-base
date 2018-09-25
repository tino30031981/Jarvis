(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (webservice) {
                (function (widgets) {
                    (function (wfs) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
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
                                var urlWorker = (thiss.js.module.subModule.widget.path + thiss.configView.uri.baseApiGeo + 'widgetworker.js').toString();
                                //console.log(urlWorker);
                                if (window.Worker) {
                                    thiss.worker = new Worker(urlWorker);
                                }
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$ddlServer = thiss.$widget.find("#ddlServer");
                                thiss.$ddlLayer = thiss.$widget.find("#ddlLayer");
                                thiss.$ddlFormat = thiss.$widget.find("#ddlFormat");
                                thiss.$btnFullExtent = thiss.$widget.find("#btnFullExtent");
                                thiss.$btnDownload = thiss.$widget.find("#btnDownload");
                                thiss.$divResult = thiss.$widget.find("#divResult");
                                setTimeout(function () {
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: thiss.$ddlServer,
                                        fieldId: "url",
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
                                thiss.$btnDownload.off("click");
                                thiss.$btnDownload.on("click", function (e) {
                                    thiss.downloadData();
                                });
                                thiss.$ddlLayer.trigger("change");
                                //new ol.layer.Image({
                                //    source: new ol.source.ImageVector({
                                //        source: new ol.source.Vector({
                                //            url: 'http://openlayers.org/en/v3.17.1/examples/data/geojson/countries.geojson',
                                //            format: new ol.format.GeoJSON()
                                //        }),
                                //        style: function (feature, resolution) {
                                //            var style = thiss.config.module.widget.symbols[feature.getGeometry().getType()]["default"];
                                //style.getText().setText(resolution < 5000 ? feature.get('name') : '');
                                // return style;
                                //        }
                                //    })
                                //})
                                //////ol.VectorTile#setFeatures{
                                //////    tileLoadFunction: function(tile, url) {
                                //////        tile.setLoader(function() {
                                //////            var xhr = new XMLHttpRequest();
                                //////            xhr.open('GET', url);
                                //////            xhr.onload = function() {
                                //////                var json = JSON.parse(xhr.responseText);
                                //////                var format = tile.getFormat();
                                //////                tile.setFeatures(format.readFeatures(json));
                                //////                tile.setProjection(format.readProjection(json));
                                //////            }
                                //////            xhr.send();
                                //////        });
                                //////    },
                                //////    }
                                //https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!msg/ol3-dev/VwkLPvewDcg/Ct9a38vnAQAJ
                                //https://github.com/openlayers/ol3/issues/4678
                            };
                            BaseWidget.prototype.searchLayers = function (obj) {
                                var thiss = this;
                                var url = jQuery(obj).val();
                                var items = gh.spatial.helper.WfsHelper.listAllTypes(url);
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlLayer,
                                    items: items
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlFormat,
                                    items: items[0].outputFormats
                                });
                            };
                            BaseWidget.prototype.detailLayer = function (obj) {
                                var thiss = this;
                                thiss.$divResult.find("dd").empty();
                                var layerName = jQuery(obj).string();
                                if (layerName === null) return;
                                var url = thiss.$ddlServer.val();
                                var item = gh.spatial.helper.WfsHelper.detailType(url, layerName);
                                thiss.writeData(item);
                            };
                            BaseWidget.prototype.fitExtent = function () {
                            };
                            BaseWidget.prototype.downloadData = function () {
                                var thiss = this;
                                var url = thiss.$ddlServer.string();
                                var layerName = thiss.$ddlLayer.string();
                                var format = thiss.$ddlFormat.string();
                                var parameters = {
                                    service: 'WFS',
                                    version: gh.spatial.helper.WfsHelper.DEFAULTVERSION,
                                    request: 'GetFeature',
                                    typeNames: layerName,
                                    outputFormat: format
                                };
                                url = (url.endsWith("?") ? url : url + "?");
                                var queryString = jQuery.param(parameters);
                                url = url + queryString;
                                window.open(url, '_blank');
                            };
                            BaseWidget.prototype.addToMap = function (item) {
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
                                $dom = thiss.$divResult.find(">.panel-body #ddCrs").append(item.crs);
                                $dom = thiss.$divResult.find(">.panel-body #ddBoundingBox").append('<ul class="list-group"></ul>');
                                $dom.append('<li class="list-group-item"><span class="badge">' + item.boundingbox.geographic.srid + '</span>xmin: ' + item.boundingbox.geographic.xmin + ', ymin: ' + item.boundingbox.geographic.ymin + ', xmax: ' + item.boundingbox.geographic.xmax + ', ymax: ' + item.boundingbox.geographic.ymax + '</li>');
                                $dom = thiss.$divResult.find(">.panel-body #ddFields");
                                html = '<table class="table table-striped table-bordered nowrap">';
                                html += '<thead><th>Campo</th><th>Tipo</th><th>¿Acepta nulo?</th></thead>';
                                html += '<tbody>';
                                item.fields.forEach(function (item) {
                                    html += ('<tr data-uniqueid="' + item.name + '">');
                                    html += ('<td>' + item.name + '</td>');
                                    html += ('<td>' + item.type + '</td>');
                                    html += ('<td>' + (item.nullable === true ? 'Si' : 'No') + '</td>');
                                    html += '</tr>';
                                });
                                html += '</tbody>';
                                html += '</table>';
                                $dom.append(html);
                                thiss.addToMap(item);
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        wfs.BaseWidget = BaseWidget;
                    })(widgets.wfs || (widgets.wfs = {}));
                    var wfs = widgets.wfs;
                })(webservice.widgets || (webservice.widgets = {}));
                var widgets = webservice.widgets;
            })(geometry.webservice || (geometry.webservice = {}));
            var webservice = geometry.webservice;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));