function getObject() {
    return com.jtm.geometry.viewer.widgets.print.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (print) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.downloadWhenReady = function (startTime, data) {
                                    var thiss = this;
                                    if ((new Date().getTime() - startTime) > 60000) {
                                        thiss.$message.text('Terminó la espera de 1 minuto');
                                        thiss.$widget.find('form').attr("disabled", false);
                                    } else {
                                        thiss.updateWaitingMessage(startTime, data);
                                        setTimeout(function () {
                                            $.getJSON(data.statusURL, function (statusData) {
                                                if (!statusData.done) {
                                                    thiss.downloadWhenReady(startTime, data);
                                                } else {
                                                    window.location = statusData.downloadURL;
                                                    thiss.$message.text('Descargando: ' + data.ref);
                                                    thiss.$widget.find('form').attr("disabled", false);
                                                }
                                            }, function error(data) { thiss.$message.text('Ocurrió un error en la petición'); });
                                        }, 500);
                                    }
                                };
                                this.appendGraticule = function (items, srid) {
                                    var item = {
                                        "type": "grid",
                                        "gridType": "points",
                                        "numberOfLines": [5, 5],
                                        //"pointsInLine": 100,
                                        "renderAsSvg": true,
                                        "haloColor": "#CCFFCC", // most css color definitions supported
                                        //"haloColor": "green",
                                        "labelColor": "black",
                                        "labelFomat": "%1.0f %s",
                                        "labelProjection": srid,
                                        //"spacing": [1000,1000],
                                        //"origin": [8200000, 4980000],
                                        "indent": 10,
                                        "haloRadius": 4,
                                        "font": {
                                            "name": ["Arial", "Helvetica", "Nimbus Sans L", "Liberation Sans", "FreeSans", "Sans-serif"],
                                            "size": 8,
                                            "style": "BOLD"
                                        }
                                    };
                                    items.push(item);
                                };
                                this.appendWMS = function (items, source) {
                                    var item = {
                                        baseURL: source.getUrls()[0],
                                        customParams: {
                                            EXCEPTIONS: "INIMAGE",
                                            TRANSPARENT: "true"
                                        },
                                        imageFormat: "image/png",
                                        layers: source.getParams().LAYERS.split(","),
                                        type: "WMS",
                                        version: source.getParams().VERSION
                                    };
                                    items.push(item);
                                };
                                this.getLayers = function (srid) {
                                    var items = [];
                                    this.appendGraticule(items, srid);
                                    var layers = this.map.getLayers();
                                    var i = 0;
                                    layers.forEach(function (layer) {
                                        if (layer.getVisible() === true) {
                                            if (layer.getSource() instanceof ol.source.TileWMS) {
                                                this.appendWMS(items, layer.getSource());
                                            }
                                            else {
                                            }
                                        }
                                    }, this);
                                    return items;
                                };
                                this.buildParameters = function () {
                                    var srid = this.$ddlSpatialReference.int32();
                                    if (srid > Widget.DDLVALUEDEFAULT)
                                        srid = "EPSG:" + srid;
                                    else
                                        srid = this.map.getView().getProjection().getCode();
                                    var parameters = {
                                        layout: this.config.module.widget.layouts[0].name,
                                        outputFormat: this.$ddlFormat.string(),
                                        attributes: {
                                            pAppTitle: this.config.module.widget.appTitle,
                                            pMapTitle: this.$txtTitle.string(),
                                            pAuthor: this.$txtAuthor.string(),
                                            pSrid: srid,
                                            keywordsAtt: ["map", "example", "metadata"],
                                            map: {
                                                projection: this.map.getView().getProjection().getCode(),
                                                scale: this.map.getView().getCurrentScale(),
                                                dpi: this.$txtNbrDpi.int32(),
                                                rotation: 0,
                                                bbox: this.map.getView().calculateExtent(this.map.getSize()),
                                                layers: this.getLayers(srid)
                                            }
                                        }
                                        /*,"legend": {
                                            "name": "",
                                            "classes": [{
                                                "name": "Arbres",
                                                "icons": ["http://localhost:8080/examples/data/www/legends/legend1.png"]
                                            }, {
                                                "name": "Peturbations",
                                                "icons": ["http://localhost:8080/examples/data/www/legends/legend2.png"]
                                            }, {
                                                "name": "Points de vente",
                                                "icons": ["http://localhost:8080/examples/data/www/legends/legend3.png"]
                                            }, {
                                                "name": "Alea",
                                                "icons": ["http://localhost:8080/examples/data/www/legends/legend4.png"]
                                            }]
                                        }*/
                                    };
                                    return parameters;
                                };
                            }
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.service.url = (thiss.config.module.widget.service.url.startsWith("http") ? thiss.config.module.widget.service.url : com.jtm.Server.contextPath + thiss.config.module.widget.service.url);
                                thiss.config.module.widget.service.url = (thiss.config.module.widget.service.url.endsWith("/") ? thiss.config.module.widget.service.url + "" : thiss.config.module.widget.service.url + "/");
                                jQuery.ajaxSetup({ async: false });
                                jQuery.getJSON(thiss.config.module.widget.service.url + "capabilities.json?" + Math.random(), function (data, textStatus, jqXHR) {
                                    thiss.config.module.widget.formats = data.formats;
                                    thiss.config.module.widget.layouts = data.layouts;
                                });
                                jQuery.ajaxSetup({ async: true });
                                _super.prototype.initConfig.call(this);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                this.$txtScale.val(thiss.map.getView().getCurrentScale());
                                this.$ddlPaper.closest('.form-group').remove();
                                this.$ddlScaleBarUnit.closest('.form-group').remove();
                                this.$txtRecommendedScale.closest('.form-group').remove();
                                this.$rdbOrientation.closest('.form-group').remove();
                                this.$chkScale.closest('.form-group').remove();
                                //this.$txtScale.closest('.form-group').remove();
                                thiss.map.getView().on("change:resolution", function (e) {
                                    thiss.$txtScale.val(thiss.map.getCurrentScale());
                                    thiss.changePaper();
                                });
                                this.$txtNbrDpi.numeric({ decimal: false, negative: false });
                                this.$txtNbrDpi.TouchSpin({
                                    min: thiss.config.module.widget.minDpi,
                                    max: thiss.config.module.widget.maxDpi,
                                    step: thiss.config.module.widget.stepDpi,
                                    initval: thiss.config.module.widget.minDpi,
                                    verticalbuttons: true
                                });
                            };
                            Widget.prototype.printer = function () {
                                var thiss = this;
                                var parameters = thiss.buildParameters();
                                var format = parameters.outputFormat;
                                delete parameters.outputFormat;
                                thiss.$widget.find('form').attr("disabled", true);
                                var startTime = new Date().getTime();
                                thiss.$message.text('Esperando el reporte...');
                                thiss.ajax({
                                    url: thiss.config.module.widget.service.url + '2/report.' + format,
                                    isJson: false,
                                    validate: true,
                                    data: { requestData: JSON.stringify(parameters) }
                                }, function (data) {
                                    thiss.downloadWhenReady(startTime, data);
                                }, function (xhr, status, error) {
                                    thiss.$message.text('Error creando reporte: ' + xhr.statusText);
                                    thiss.$widget.find('form').attr("disabled", false);
                                });
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(print.BaseWidget);
                        print.Widget = Widget;
                    })(widgets.print || (widgets.print = {}));
                    var print = widgets.print;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));