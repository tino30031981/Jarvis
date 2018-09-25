function getObject() {
    return com.jtm.geometry.viewer.widgets.shapefile.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (shapefile) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.defaultMaxRecordCount = 1000;
                                this.layers = [];

                                this.execute = function (e) {
                                    var thiss = this;
                                    thiss.removeLayers();
                                    var fileName = e.target.value.toLowerCase();
                                    setFileName();
                                    thiss.process(fileName);
                                    function setFileName() {
                                        if (com.jtm.helper.Browser.isIE === true) {
                                            var names = fileName.split("\\");
                                            fileName = names[names.length - 1];
                                        }
                                    }
                                };
                                this.process = function (fileName) {
                                    var thiss = this;
                                    var name = fileName.split(".");
                                    //Chrome and IE add c:\fakepath to the value - we need to remove it
                                    //See this link for more info: http://davidwalsh.name/fakepath
                                    name = name[0].replace("c:\\fakepath\\", "");
                                    var extent = esri.geometry.getExtentForScale(thiss.map, 40000);
                                    var resolution = extent.getWidth() / thiss.map.width;
                                    var parameters = {
                                        'name': name,
                                        'targetSR': thiss.map.spatialReference,
                                        'maxRecordCount': thiss.config.module.widget.maxRecordCount,
                                        'enforceInputFileSizeLimit': true,
                                        'enforceOutputJsonSizeLimit': true,
                                        generalize: true,
                                        maxAllowableOffset: resolution,
                                        reducePrecision: true,
                                        numberOfDigitsAfterDecimal: 0
                                    };
                                    var data = {
                                        'filetype': 'shapefile',
                                        'publishParameters': JSON.stringify(parameters),
                                        'f': 'json'
                                        //'callback.html': 'textarea'
                                    };
                                    var options = {
                                        type: 'POST',
                                        url: thiss.config.module.widget.service.url,
                                        dataType: 'json',
                                        data: data,
                                        beforeSubmit: validate,
                                        success: function (data) {
                                            thiss.addGraphicToLayer(data);
                                        }
                                        //error: function (error, message, data) {
                                        //    com.jtm.helper.File.maxFileSize();
                                        //}
                                    };
                                    jQuery('#' + thiss.domWidget + ' #frmWidget').ajaxForm(options);
                                    jQuery('#' + thiss.domWidget + ' #frmWidget').submit();
                                    function validate() {
                                        if (fileName.indexOf(".zip") !== -1) {
                                            return true;
                                        }
                                        else {
                                            alert("Seleccione un archivo como .zip");
                                            return false;
                                        }
                                    }
                                };
                                this.addGraphicToLayer = function (data) {
                                    var thiss = this;
                                    var fullExtent;
                                    var i = 0;
                                    var item = null;
                                    for (i = 0; i < data.featureCollection.layers.length; i++) {
                                        item = data.featureCollection.layers[i];
                                        console.log(item);
                                        var infoTemplate = thiss.parseInfoTemplate(
                                            {
                                                fields: item.layerDefinition.fields,
                                                title: item.layerDefinition.name,
                                                useCustomInfoTemplate: false
                                            });
                                        //item.layerDefinition.objectIdField;
                                        var featureLayer = new esri.layers.FeatureLayer(item);
                                        featureLayer.setInfoTemplate(infoTemplate);
                                        featureLayer.on('click', function (event) {
                                            thiss.map.infoWindow.setFeatures([event.graphic]);
                                        });
                                        renderer(featureLayer);
                                        fullExtent = fullExtent ? fullExtent.union(featureLayer.fullExtent) : featureLayer.fullExtent;
                                        thiss.layers.push(featureLayer);
                                    }
                                    thiss.map.addLayers(thiss.layers);
                                    thiss.map.setExtent(fullExtent.expand(thiss.config.module.widget.zoomLevel), true);

                                    function renderer(layer) {
                                        var symbol = null;
                                        switch (layer.geometryType) {
                                            case 'esriGeometryPoint':
                                                symbol = thiss.config.module.widget.symbols.simpleMarkerSymbol;
                                                break;
                                            case 'esriGeometryPolygon':
                                                symbol = thiss.config.module.widget.symbols.simpleFillSymbol;
                                                break;
                                        }
                                        if (symbol) {
                                            layer.setRenderer(new esri.renderers.SimpleRenderer(symbol));
                                        }
                                    }
                                };
                                this.removeLayers = function () {
                                    var thiss = this;
                                    if (thiss.map.infoWindow.isShowing)
                                        thiss.map.infoWindow.hide();
                                    var i = 0;
                                    for (i = 0; i < thiss.layers.length; i++) {
                                        if (thiss.layers[i] !== null) {
                                            thiss.layers[i].clear();
                                        }
                                        thiss.map.removeLayer(thiss.layers[i]);
                                    }
                                };
                            }
                            Widget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 250 }
                                });
                            };
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                thiss.config.module.widget.maxRecordCount = (Number(thiss.config.module.widget.maxRecordCount) === 0) ? thiss.defaultMaxRecordCount : thiss.config.module.widget.maxRecordCount;
                                _super.prototype.initConfig.call(this);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                jQuery('#' + thiss.domWidget + " #frmWidget").on("change", function (e) {
                                    thiss.execute(e);
                                });
                            };
                            Widget.prototype.cleanControls = function () {
                                this.removeLayers();
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(shapefile.BaseWidget);
                        shapefile.Widget = Widget;
                    })(widgets.shapefile || (widgets.shapefile = {}));
                    var shapefile = widgets.shapefile;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));