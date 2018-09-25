function getObject() {
    return com.jtm.geometry.viewer.widgets.extractdata.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (extractdata) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                            }
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                jQuery.ajaxSetup({ async: false });
                                setInformation(thiss.config.module.widget.service);
                                jQuery.ajaxSetup({ async: true });
                                _super.prototype.initConfig.call(this);
                                function setInformation(service) {
                                    jQuery.getJSON(service.url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                        if (data.error !== undefined) {
                                            service.exist = false;
                                        }
                                        else {
                                            if (data === null) return;
                                            service.definition = data;
                                            service.layers = data.parameters.find2("name", "Layers_to_Clip").choiceList;
                                            service.formats = data.parameters.find2("name", "Feature_Format").choiceList;
                                            service.dataFile = data.parameters.find2("name", "Output_Zip_File").name;
                                        }
                                    }).fail(function (data, textStatus, jqXHR) {
                                        service.exist = false;
                                    });
                                }
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.setFillSymbol(thiss.config.module.widget.symbols.simpleFillSymbol);
                                thiss.draw.setLineSymbol(thiss.config.module.widget.symbols.simpleLineSymbol);
                                thiss.draw.setMarkerSymbol(thiss.config.module.widget.symbols.simpleMarkerSymbol);
                                thiss.draw.deactivate();
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.draw.deactivate();
                                    thiss.search(e.geometry);
                                });
                                thiss.geoprocessor = new esri.tasks.Geoprocessor(thiss.config.module.widget.service.url);
                                thiss.layerDraw = new esri.layers.GraphicsLayer({
                                    style: function (feature, resolution) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layerDraw);
                            };
                            Widget.prototype.search = function (geometry) {
                                var thiss = this;
                                var g = new esri.Graphic(geometry);
                                thiss.layerDraw.add(g);
                                var extent = thiss.toExtent(geometry);
                                thiss.map.setExtent(g.geometry.getExtent().expand(thiss.config.module.widget.zoomLevel));
                                var clipLayers = [];
                                var layers = thiss.$ddlLayer.val();
                                if (layers instanceof Array)
                                    clipLayers = layers;
                                else
                                    clipLayers.push(layers);
                                var features = [];
                                var featureSet = new esri.tasks.FeatureSet();
                                features.push(new esri.Graphic(geometry));
                                featureSet.features = features;
                                var srid = thiss.$ddlSpatialReferenceOutput.val() === 0 ? thiss.map.spatialReference.wkid : thiss.$ddlSpatialReference.val();
                                var parameters = {
                                    "Layers_to_Clip": clipLayers,
                                    "Area_of_Interest": featureSet,
                                    "Feature_Format": thiss.$ddlFormat.val()
                                };
                                thiss.geoprocessor.setOutSpatialReference({ wkid: srid });
                                thiss.geoprocessor.submitJob(parameters, completeCallback, statusCallback, function (error) {
                                    alert(error);
                                    thiss.$divStatus.empty();
                                });
                                function completeCallback(jobInfo) {
                                    thiss.layer.clear();
                                    if (jobInfo.jobStatus !== "esriJobFailed") {
                                        thiss.geoprocessor.getResultData(jobInfo.jobId, "Output_Zip_File", downloadFile);
                                    }
                                }
                                function statusCallback(jobInfo) {
                                    var jobstatus = '';
                                    switch (jobInfo.jobStatus) {
                                        case 'esriJobSubmitted':
                                            jobstatus = 'Enviando...';
                                            break;
                                        case 'esriJobExecuting':
                                            jobstatus = 'Ejecutando...';
                                            break;
                                        case 'esriJobSucceeded':
                                            jobstatus = '';
                                            break;
                                        case 'esriJobFailed': {
                                            alert(jobinfo.jobStatus);
                                            jobstatus = '';
                                            break;
                                        }
                                    }
                                    thiss.$divStatus.html(jobstatus);
                                }
                                function downloadFile(outputFile) {
                                    window.location = outputFile.value.url;
                                }
                            };
                            
                            Widget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                                this.map.infoWindow.hide();
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                if (this.draw !== null) {
                                    this.draw.deactivate();
                                    this.draw = null;
                                }
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(extractdata.BaseWidget);
                        extractdata.Widget = Widget;
                    })(widgets.extractdata || (widgets.extractdata = {}));
                    var extractdata = widgets.extractdata;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));