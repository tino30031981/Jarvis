function getObject() {
    return com.jtm.geometry.viewer.widgets.overlappingarea.Widget.execute();
}
(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (overlappingarea) {
                        var Widget = (function (_super) {
                            __extends(Widget, _super);
                            function Widget() {
                                _super.call(this);
                                this.dialogData = null;
                                this.domWidgetData = "divWidgetData";
                                this.layer = null;
                                this.toolbar = null;

                                this.query = function (geometry) {
                                    var thiss = this;
                                    thiss.closeData(thiss.dialogData);
                                    thiss.zoomGeometry(geometry);
                                    var i = 0;
                                    var services = [];
                                    if (jQuery('#' + thiss.domWidget + ' #ddlLayer').val() == Widget.DDLVALUEDEFAULT2)
                                        services = thiss.config.module.widget.services;
                                    else
                                        services.push(thiss.config.module.widget.services.find2("id", jQuery('#' + thiss.domWidget + ' #ddlLayer').val()));
                                    thiss.showData();
                                    for (i = 0; i < services.length; i++) {
                                        if (services[i].exist === false) continue;
                                        var parameters = new esri.tasks.IdentifyParameters();
                                        parameters.geometry = geometry;
                                        parameters.mapExtent = thiss.map.extent;
                                        parameters.returnGeometry = true;
                                        parameters.tolerance = 0;
                                        parameters.layerIds = [services[i].layerId];
                                        parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                                        parameters.width = thiss.map.width;
                                        parameters.height = thiss.map.height;
                                        var task = new esri.tasks.IdentifyTask(services[i].url);
                                        var data = task.execute(parameters).addCallback(function (response) {
                                            setTable(response);
                                        });
                                    }
                                    function setTable(items) {
                                        if (items.length === 0) return;
                                        var uuid = thiss.getUUID();
                                        jQuery('#' + thiss.domWidgetData + " > ul").append('<li><a data-target="#tab' + uuid + '"  data-toggle="tab">' + items[0].layerName + '</a></li>');
                                        jQuery('#' + thiss.domWidgetData + " > div").append('<div id="tab' + uuid + '" class="tab-pane gh-scroll100"><table id="tbl' + uuid + '"  class="table"><caption><button id="btn' + uuid + '" class="btn btnDownload">Descargar</button></caption><thead class="thead-inverse"></thead><tbody></tbody></table></div>');
                                        table = '#' + thiss.domWidgetData + ' #tbl' + uuid;
                                        jQuery(table + " caption").html(items[0].layerName);
                                        setHeader(items[0].feature.attributes);
                                        setBody(items);
                                        jQuery('#' + thiss.domWidgetData + ' #btn' + uuid).off('click');
                                        jQuery('#' + thiss.domWidgetData + ' #btn' + uuid).on('click', function (e) {
                                            com.jtm.helper.Table.toSpreadSheet(jQuery('#' + thiss.domWidgetData + ' #tbl' + uuid), items[0].layerName, items[0].layerName);
                                        });
                                        function setHeader(columns) {
                                            var html = '<tr>';
                                            for (var column in columns)
                                                html += "<th>" + column + "</th>";
                                            html += '</tr>';
                                            jQuery(table + " thead").html(html);
                                        }
                                        function setBody(rows) {
                                            var html = '';
                                            var i = 0;
                                            for (i = 0; i < rows.length; i++) {
                                                html += '<tr>';
                                                for (var attribute in rows[i].feature.attributes)
                                                    html += "<td>" + rows[i].feature.attributes[attribute] + "</td>";
                                                html += '</tr>';
                                            }
                                            jQuery(table + " tbody").html(html);
                                        }
                                    }
                                };
                                this.zoomGeometry = function (geometry) {
                                    var thiss = this;
                                    var g = new esri.Graphic(geometry);
                                    if (geometry.type == "point")
                                        thiss.map.centerAndZoom(geometry, thiss.config.module.widget.zoomLevel);
                                    else {
                                        var extent = esri.graphicsExtent([g]);
                                        thiss.map.setExtent(extent.expand(thiss.config.module.widget.zoomLevel));
                                    }
                                };
                                this.showData = function () {
                                    var thiss = this;
                                    thiss.domWidgetData = thiss.getUUID();
                                    thiss.dialogData = jQuery('<div id="' + thiss.domWidgetData + '"><ul class="nav nav-tabs"></ul>	<div class="tab-content"></div></div>').dialog({
                                        title: 'Áreas superpuestas',
                                        width: jQuery(window).width() - 30,
                                        resizable: false,
                                        closeOnEscape: true,
                                        autoremove: true,
                                        //position: position,
                                        close: function (dialog) {
                                            thiss.onCloseData(this);
                                        }
                                    });
                                    jQuery('#' + thiss.domWidget + ' > ul a:first').tab('show');
                                };
                            }
                            Widget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 350 }
                                });
                            };
                            Widget.prototype.initConfig = function () {
                                var thiss = this;
                                jQuery.ajaxSetup({ async: false });
                                var i = 0;
                                for (i = 0; i < thiss.config.module.widget.services.length; i++) {
                                    thiss.config.module.widget.services[i].id = thiss.getUUID();
                                    setInformation(thiss.config.module.widget.services[i]);
                                }
                                jQuery.ajaxSetup({ async: true });
                                _super.prototype.initConfig.call(this);
                                function setInformation(service) {
                                    jQuery.getJSON(service.url + "/" + service.layerId + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                        if (data.error !== undefined) {
                                            service.exist = false;
                                        }
                                        else {
                                            service.extent = data.extent;
                                            service.spatialReference = new esri.SpatialReference(data.extent.spatialReference.wkid);
                                            delete data.extent;
                                            service.label = data.name;
                                            delete data.name;
                                            service.definition = data;
                                        }
                                    }).fail(function (data, textStatus, jqXHR) {
                                        service.exist = false;
                                    });
                                }
                            };
                            Widget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.toolbar = new esri.toolbars.Draw(thiss.map);
                                thiss.toolbar.setFillSymbol(thiss.config.module.widget.symbols.simpleFillSymbol);
                                thiss.toolbar.setLineSymbol(thiss.config.module.widget.symbols.simpleLineSymbol);
                                thiss.toolbar.setMarkerSymbol(thiss.config.module.widget.symbols.simpleMarkerSymbol);
                                thiss.toolbar.deactivate();
                                thiss.layer = new esri.layers.GraphicsLayer();
                                thiss.map.addLayer(thiss.layer);
                                hidedomWidgets();
                                fillServices();
                                jQuery('#' + thiss.domWidget + ' #txtRadio').numeric();
                                jQuery('#' + thiss.domWidget + ' #txtRadio').val(thiss.config.module.widget.defaultRadio);

                                jQuery('#' + thiss.domWidget + " #ddlAnalysis").unbind();
                                jQuery('#' + thiss.domWidget + " #ddlAnalysis").on("change", function (e) {
                                    var typeOfAnalysis = jQuery('#' + thiss.domWidget + ' #ddlAnalysis').val();
                                    if (typeOfAnalysis === null) return;
                                    switch (jQuery(this).val()) {
                                        case "Coordinate":
                                            setCoordinate();
                                            break;
                                        case "Graphic":
                                            setGraphic();
                                            break;
                                        case "PoliticalDivision":
                                            setPoliticalDivision();
                                            break;
                                        case "HydrographicBasin":
                                            setHydrographicBasin();
                                            break;
                                        case "Town":
                                            setTown();
                                            break;
                                        default:
                                            alert("No soportado");
                                            break;
                                    }
                                });
                                //jQuery('#' + thiss.domWidget + " input[name=rdbAnalysis]:radio").unbind();
                                //jQuery('#' + thiss.domWidget + " input[name=rdbAnalysis]:radio").on("change", function (e) {
                                //    if (jQuery(this).is(":checked") == true) {
                                //        switch (jQuery(this).prop("id")) {
                                //            case "rdbCoordinate":
                                //                setCoordinate();
                                //                break;
                                //            case "rdbGraphic":
                                //                setGraphic();
                                //                break;
                                //            case "rdbPoliticalDivision":
                                //                setPoliticalDivision();
                                //                break;
                                //            case "rdbHydrographicBasin":
                                //                setHydrographicBasin();
                                //                break;
                                //            case "rdbTown":
                                //                setTown();
                                //                break;
                                //            default:
                                //                alert("No soportado");
                                //                break;
                                //        }
                                //    }
                                //});
                                jQuery('#' + thiss.domWidget + " #ddlAnalysis").change();
                                function fillServices() {
                                    var html = '';
                                    var i = 0;
                                    html += '<option value="' + Widget.DDLVALUEDEFAULT2 + '">' + thiss.config.module.widget.descriptionLabel.allServices + '</option>';
                                    for (i = 0; i < thiss.config.module.widget.services.length; i++) {
                                        html += '<option value="' + thiss.config.module.widget.services[i].id + '">' + thiss.config.module.widget.services[i].label + '</option>';
                                    }
                                    jQuery('#' + thiss.domWidget + " #ddlLayer").html(html);
                                }
                                function hidedomWidgets() {
                                    var divChilds = jQuery('#' + thiss.domWidget + ' #fdsForm > div');
                                    jQuery.each(divChilds, function (i, item) {
                                        jQuery(this).hide();
                                    });
                                }

                                function setCoordinate() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #txtX').numeric();
                                    jQuery('#' + thiss.domWidget + ' #txtY').numeric();
                                    jQuery('#' + thiss.domWidget + ' #divCoordinate').show();
                                    com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + "geometry/spatialreference/list", '#' + thiss.domWidget + " #ddlSpatialReference");
                                    jQuery('#' + thiss.domWidget + ' #btnGraphicCoordinate').off("click");
                                    jQuery('#' + thiss.domWidget + ' #btnGraphicCoordinate').on("click", function (e) {
                                        buildGeometry();
                                    });
                                    function buildGeometry() {
                                        var x = jQuery("#" + thiss.domWidget + " #txtX").val();
                                        var y = jQuery("#" + thiss.domWidget + " #txtY").val();
                                        var srid = jQuery("#" + thiss.domWidget + " #ddlSpatialReference").val();
                                        var spatialReference = new esri.SpatialReference({ wkid: parseInt(srid) });
                                        var point = new esri.geometry.Point(x, y, spatialReference);
                                        var radio = jQuery("#" + thiss.domWidget + " #txtRadio").val() * Widget.KILOMETER;
                                        var parameters = new esri.tasks.ProjectParameters();
                                        parameters.geometries = [point.normalize()];
                                        parameters.outSR = thiss.map.spatialReference;
                                        parameters.transformForward = true;
                                        project(parameters);
                                        function project(parameters) {
                                            thiss.geometryService.project(parameters, function (geometries) {
                                                var geometry = esri.geometry.geometryEngine.buffer(geometries[0], radio, 9001, true);
                                                thiss.query(geometry);
                                            });
                                        }
                                    }
                                }
                                function setGraphic() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #btnPoint').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnPoint').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.POINT);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnPolyline').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnPolyline').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.POLYLINE);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnFreeHandPolyline').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnFreeHandPolyline').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYLINE);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnRectangle').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnRectangle').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.RECTANGLE);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnCircle').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnCircle').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.CIRCLE);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnEllipse').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnEllipse').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.ELLIPSE);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnPolygon').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnPolygon').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.POLYGON);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #btnFreeHandPolygon').unbind();
                                    jQuery('#' + thiss.domWidget + ' #btnFreeHandPolygon').click(function (e) {
                                        if (thiss.map.infoWindow.isShowing)
                                            thiss.map.infoWindow.hide();
                                        thiss.toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
                                    });
                                    jQuery('#' + thiss.domWidget + ' #divGraphic').show();
                                    thiss.toolbar.on("draw-complete", function (e) {
                                        console.log(e);
                                        thiss.query(e.geometry);
                                    });
                                }
                                function setPoliticalDivision() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #divPoliticalDivision').show();
                                    com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + "geometry/departament/list", '#' + thiss.domWidget + ' #ddlDepartamentSearch');
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').unbind();
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').change(function (e) {
                                        com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + 'geometry/province/searchbydepartament', '#' + thiss.domWidget + ' #ddlProvinceSearch', { id: jQuery(this).val() }, 0);
                                        jQuery('#' + thiss.domWidget + ' #ddlProvinceSearch').unbind();
                                        jQuery('#' + thiss.domWidget + ' #ddlProvinceSearch').bind("change", function () {
                                            com.jtm.helper.DropDownList.fill(com.jtm.Server.contextPath + 'geometry/district/searchbyprovince', '#' + thiss.domWidget + ' #ddlDistrictSearch', { id: jQuery(this).val() }, 0);
                                        });
                                    });
                                    jQuery('#' + thiss.domWidget + ' #ddlDepartamentSearch').change();
                                }
                                function setHydrographicBasin() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #divHydrographicBasin').show();
                                }
                                function setTown() {
                                    hidedomWidgets();
                                    jQuery('#' + thiss.domWidget + ' #divTown').show();
                                }
                            };
                            Widget.prototype.onCloseData = function (obj) {
                                var thiss = this;
                                _super.prototype.onCloseData.call(this, obj);
                            };
                            Widget.prototype.cleanControls = function () {
                                if (this.map.infoWindow.isShowing)
                                    this.map.infoWindow.hide();
                                if (this.layer !== null)
                                    this.map.removeLayer(this.layer);
                                if (this.toolbar !== null)
                                    this.toolbar.deactivate();
                                this.closeData(this.dialogData);
                            };
                            Widget.execute = function () {
                                return new Widget();
                            };
                            return Widget;
                        })(overlappingarea.BaseWidget);
                        overlappingarea.Widget = Widget;
                    })(widgets.overlappingarea || (widgets.overlappingarea = {}));
                    var overlappingarea = widgets.overlappingarea;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));