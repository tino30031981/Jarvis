(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (monitoring) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$result = null;
                                this.$divListCoordinates = null;
                                this.$tblCoordinates = null;
                                this.$btnRectangle = null;
                                this.$btnPolygon = null;
                                this.feature = null;
                                this.$smlFileCoordinate = null;
                                this.fillResult = function (items) {
                                    var thiss = this;
                                    var html = '<thead><tr><th>N°</th><th data-field="name">Nombre</th><th></th><th></th></tr></thead><tbody id="tdbMonitoring">';
                                    var i = 0;
                                    items.forEach(function (item, i) {
                                        i = i + 1;
                                        html += '<tr value="' + item.id + '">'
                                        html += '<td>' + (i) + ' </td>';
                                        html += '<td> ' + item.name + '</td>';
                                        html += '<td><button id="btnView" class="btn" type="button" value="' + item.id + '" ><i class="glyphicon glyphicon-eye-open"></i></button></td>';
                                        html += '<td><button id="btnDelete" class="btn" type="button" value="' + item.id + '" ><i class="glyphicon glyphicon-remove"></i></button></td>'
                                        html += '</tr>';
                                    });
                                    html += '</tbody>';
                                    thiss.$result.html(html);
                                    $('#tdbMonitoring >tr >td').find('#btnDelete').on('click', function (e) {
                                        thiss.deleteMonitoring($(this).val());
                                    });
                                    $('#tdbMonitoring >tr >td').find('#btnView').on('click', function (e) {
                                        console.log($(this).val());
                                        thiss.viewMonitoring($(this).val());
                                    });
                                    //$("#btnDelete").off('click');
                                    //$("#btnDelete").on('click', function (e) {
                                    //    thiss.deleteMonitoring($(this).val());
                                    //});
                                };
                                this.deleteMonitoring = function (id) {
                                    var thiss = this;
                                    var options = {
                                        data: { id: id },
                                        isJson: false,
                                        validate: validate
                                    };
                                    thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/monitoring/delete', options, function () { thiss.clearTable(); thiss.search(); });
                                    function validate() {
                                        var success = true;
                                        var message = '';
                                        if (id === 0) {
                                            success = false;
                                            message = Main.NEWELEMENTID;
                                        }
                                        if (message !== '')
                                            alert(message);
                                        return success;
                                    }

                                }
                                this.viewMonitoring = function (id) {
                                    var thiss = this;
                                    thiss.searchOnService(id);
                                };
                                this.clearTable = function () {
                                    var thiss = this;
                                    thiss.$result.empty();
                                };
                            }
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.addLayerOverlap = function () {
                                var thiss = this;
                                thiss.$tblCoordinates.find(">tbody").empty();
                                if (thiss.$filFileCoordinate.val() === "") {
                                    alert('Seleccione un archivo');
                                    return;
                                }
                                var options = { data: {} };
                                options.attachments = [];
                                options.url = com.jtm.Server.contextPath + "geometry/coordinate/search";
                                options.validate = function () { return true; };
                                options.method = "POST";
                                options.attachments.push({ id: 'filFileCoordinate', file: thiss.$filFileCoordinate[0].files[0] });
                                thiss.ajax(options, function (data) {
                                    thiss.$smlFileCoordinate.empty();
                                    thiss.$filFileCoordinate.val('');
                                    if (data.item === null) return;
                                    if (data.item.coordinates === null) return;
                                    coordinates = [[]];
                                    data.item.coordinates.forEach(function (item) {
                                        coordinates[0].push([item.x, item.y]);
                                    });
                                    thiss.analizeCoordinates(coordinates, data.item.spatialReference.id);
                                    thiss.writeCoordinates(coordinates[0]);
                                });
                            };
                            BaseWidget.prototype.search = function () {
                                var thiss = this;
                                thiss.resetContainers(false);
                                console.log('search');
                                var options = {
                                    data: {},
                                    isJson: false,
                                    validate: true,
                                    url: com.jtm.Server.contextPath + "miningconcession/monitoring/search"
                                }
                                console.log(options);
                                thiss.ajax(options, function (data) {
                                    console.log(data);
                                    if (data === null || data.items.length === 0) {
                                        toastr.info("No hay resultados de su base de datos");
                                        return;
                                    }                                    
                                    thiss.fillResult(data.items);
                                    thiss.fillFeaturesMap(data);
                                });
                            };
                            BaseWidget.prototype.searchOnService = function (options) {
                            };
                            BaseWidget.prototype.fillFeaturesMap = function (data) {
                                var thiss = this;
                                thiss.resetContainers(false);
                            };
                            BaseWidget.prototype.analizeCoordinates = function (coordinates, srid) {
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$btnPolygon = thiss.$widget.find('#btnPolygon');
                                thiss.$btnRectangle = thiss.$widget.find("#btnRectangle");
                                thiss.$txtName = thiss.$widget.find('#txtName');
                                thiss.$result = thiss.$widget.find('#tblResult');
                                thiss.$btnAdd = thiss.$widget.find('#btnAdd');
                                thiss.$divListCoordinates = thiss.$widget.find('#divListCoordinates');
                                thiss.$tblCoordinates = thiss.$widget.find('#tblCoordinates');
                                this.$divGraphic = this.$widget.find('#divGraphic');
                                this.$btnGraphicFile = this.$widget.find('#btnGraphicFile');
                                this.$divFile = this.$widget.find('#divFile');
                                this.$rbtSource = this.$widget.find('input[type=radio][name=rbtSource]');
                                this.$btnFileCoordinate = thiss.$widget.find("#btnFileCoordinate");
                                this.$filFileCoordinate = thiss.$widget.find("#filFileCoordinate");
                                this.$smlFileCoordinate = thiss.$widget.find("#smlFileCoordinate");
                                thiss.$divGraphic.hide();
                                thiss.$divFile.hide();
                                thiss.$rbtSource.off("change");
                                thiss.$rbtSource.on("change", function (e) {
                                    thiss.$tblCoordinates.find(">tbody").empty();
                                    if (jQuery(this).is(":checked") === true) {
                                        if (this.value == 1) {
                                            if (thiss.layerDraw != null) {
                                                thiss.layerDraw.clear();
                                            }
                                            thiss.$divGraphic.show();
                                            thiss.$divFile.hide();
                                        } else if (this.value == 2) {
                                            if (thiss.layerDraw != null) {
                                                thiss.layerDraw.clear();
                                            }
                                            thiss.$divGraphic.hide();
                                            thiss.$divFile.show();
                                        }
                                    }
                                });
                                thiss.$rbtSource.trigger("change");
                                thiss.$btnFileCoordinate.off("click");
                                thiss.$btnFileCoordinate.on("click", function (e) {
                                    thiss.$filFileCoordinate.trigger("click");
                                });
                                thiss.$filFileCoordinate.off("change");
                                thiss.$filFileCoordinate.on("change", function (e) {
                                    if (e.originalEvent.target.files.length) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        thiss.$smlFileCoordinate.html(e.originalEvent.target.files[0].name);
                                        thiss.addLayerOverlap();
                                    }
                                });
                                thiss.$btnPolygon.off('click');
                                thiss.$btnPolygon.on("click", function (e) {
                                    thiss.drawPolygon();
                                });
                                thiss.$btnRectangle.off("click");
                                thiss.$btnRectangle.on("click", function (e) {
                                    thiss.drawRectangle();
                                });
                                thiss.search();
                                thiss.$btnAdd.off('click');
                                thiss.$btnAdd.on('click', function (e) {
                                    thiss.addMonitoring(e.geometry);
                                });
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        monitoring.BaseWidget = BaseWidget;
                    })(widgets.monitoring || (widgets.monitoring = {}));
                    var monitoring = widgets.monitoring;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));