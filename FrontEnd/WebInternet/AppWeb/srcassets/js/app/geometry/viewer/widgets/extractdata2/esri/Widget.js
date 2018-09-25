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
                                _super.prototype.initConfig.call(this);
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                _super.prototype.launchView.call(this);
                                thiss.geoprocessor = new esri.tasks.Geoprocessor(thiss.config.module.widget.url);
                                thiss.layerDraw = new esri.layers.GraphicsLayer({
                                    style: function (feature) {
                                        return thiss.config.module.widget.symbols[feature.geometry.type]["default"];
                                    }
                                });
                                thiss.map.addLayer(thiss.layerDraw);
                                thiss.draw = new esri.toolbars.Draw(thiss.map);
                                thiss.draw.deactivate();
                                thiss.draw.on("draw-complete", function (e) {
                                    thiss.draw.deactivate();
                                    thiss.$aDownload.hide();
                                    if (thiss.$chkServiceType.is(":checked") === true) {
                                        var g = new esri.Graphic(e.geometry);
                                        thiss.layerDraw.add(g);
                                        thiss.map.setExtent(g.geometry.getExtent().expand(thiss.config.module.widget.zoomLevel));
                                        thiss.searchInServiceExternal(e.geometry);
                                    }
                                    else
                                        thiss.search(e.geometry);
                                });
                            };
                            Widget.prototype.search = function (geometry) {
                                var thiss = this;
                                var g = new esri.Graphic(geometry);
                                thiss.layerDraw.add(g);
                                thiss.map.setExtent(g.geometry.getExtent().expand(thiss.config.module.widget.zoomLevel));
                                var clipLayers = [];
                                var layers = thiss.getLayers();
                                if (layers.length === 0)
                                {
                                    toastr.info("Debe seleccionar una capa");
                                    return;
                                }
                                if (layers instanceof Array)
                                    clipLayers = layers;
                                else
                                    clipLayers.push(layers);
                                var features = [];
                                var featureSet = new esri.tasks.FeatureSet();
                                features.push(new esri.Graphic(geometry));
                                featureSet.features = features;
                                //var srid = thiss.$ddlSpatialReferenceOutput.int32() === 0 ? thiss.map.spatialReference.wkid : thiss.$ddlSpatialReferenceOutput.int32();
                                var parameters = {
                                    "Layers_to_Clip": clipLayers,
                                    "Area_of_Interest": featureSet,
                                    "Feature_Format": thiss.$ddlFormat.val()
                                };
                                /*if (String.isNullOrWhiteSpace(srid)) {
                                    toastr.info("Debe seleccionar un sistema referencial de salida");
                                    return;
                                }*/
                                //console.log(srid);
                                //thiss.geoprocessor.setOutSpatialReference({ wkid: srid });
                                //thiss.geoprocessor.setProcessSpatialReference({ wkid: srid });
                                thiss.geoprocessor.submitJob(parameters, completeCallback, statusCallback, function (error) {
                                    toastr.info(error);
                                    thiss.$divStatus.empty();
                                });
                                function completeCallback(jobInfo) {
                                    //thiss.layer.clear();
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
                                            toastr.info(jobinfo.jobStatus);
                                            //alert(jobinfo.jobStatus);
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
                            Widget.prototype.resetContainers = function (toNull) {
                                var thiss = this;
                                _super.prototype.resetContainers.call(this, toNull);
                                if (this.layer !== null) {
                                    this.layer.clear();
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layer);
                                        this.layer = null;
                                    }
                                }
                                if (this.layerDraw !== null) {
                                    this.layerDraw.clear();
                                    if (toNull === true) {
                                        this.map.removeLayer(this.layerDraw);
                                        this.layerDraw = null;
                                    }
                                }
                                if (this.draw !== null) {
                                    this.draw.deactivate();
                                    if (toNull === true) {
                                        this.draw = null;
                                    }
                                }
                                this.map.infoWindow.hide();
                            };
                            Widget.prototype.cleanControls = function (toNull) {
                                //console.log('clean');
                                _super.prototype.cleanControls.call(this, toNull);
                                this.resetContainers(toNull);
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