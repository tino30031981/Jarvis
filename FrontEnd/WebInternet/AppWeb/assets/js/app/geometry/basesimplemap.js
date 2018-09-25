(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseSimpleMap = (function (_super) {
                __extends(BaseSimpleMap, _super);
                function BaseSimpleMap() {
                    _super.call(this);
                    this.$map = null;
                    this.$btnPoint = null;
                    this.$btnMultiPoint = null;
                    this.$btnRectangle = null;
                    this.$btnLine = null;
                    this.$btnPolyline = null;
                    this.$btnPolylineFree = null;
                    this.$btnPolygon = null;
                    this.$btnPolygonFreeHand = null;
                    this.$btnCircle = null;
                    this.$btnEllipse = null;
                    this.$btnArrow = null;
                    this.$btnText = null;
                    this.$btnExtentResult = null;
                    this.$btnXY = null;
                    this.$btnXYR = null;
                    this.$btnXYMM = null;
                    this.$btnFileCoordinate = null;
                    this.$btnFullMap = null;
                    this.$btnFullMapLayers = null;
                    this.$btnDowloadCordinates = null;
                    this.$ddlSpatialReference = null;
                    this.$ddlZoneUTM = null;
                    this.$txtX = null;
                    this.$txtY = null;
                    this.$txtRadio = null;
                    this.$tableCoordinates = null;
                    this.$tableDistricts = null;
                    this.$tableNationalCartographies = null;
                    this.$tableHydrogrphicBasins = null;
                    this.$tableTownCenters = null;
                    this.$chkCoordinateReadonly = null;
                    this.$divCoordinates = null;
                    this.$filFileCoordinate = null;
                    this.$rdbCoordinate = null;
                    this.$chkCoordinateReadonly = null;
                    this.$baseMaps = null;
                    this.map = null;
                    this.draw = null;
                    this.layer = null;
                    this.layerSelected = null;
                    this.layerDraw = null;
                    this.layerGeolocation = null;
                    this.layerScope = null;
                    this.infoWindow = null;
                    this.geometryService = null;
                    this.height = 250;
                    this.urlSave = null;
                    this.urlSaveMassive = null;
                    this.orderCoordinates = function (coordinates) {
                        var thiss = this;
                        var startIndex = getIndexMaxPoint(coordinates, true);
                        var coordinates1 = coordinates[0].slice(startIndex);
                        var coordinates2 = coordinates[0].slice(0, startIndex);
                        coordinates[0] = coordinates1.concat(coordinates2);
                        var lastIndex = coordinates[0].length - 1;
                        if (coordinates[0][0][0] !== coordinates[0][lastIndex][0] || coordinates[0][0][1] !== coordinates[0][lastIndex][1])
                            coordinates[0].push(coordinates[0][0]);
                        return coordinates;
                        function getIndexMaxPoint(coordinates, byY) {
                            var index = 0;
                            var indexMaxsY = [];
                            var i = 0;
                            for (i = 0; i < coordinates[0].length; i++) {
                                if (i === 0) { indexMaxsY.push(i); continue; }
                                if (coordinates[0][indexMaxsY[0]][1] === coordinates[0][i][1])
                                    indexMaxsY.push(i)
                                else if (coordinates[0][indexMaxsY[0]][1] < coordinates[0][i][1])
                                    indexMaxsY = [i];
                            }
                            for (i = 0; i < indexMaxsY.length; i++) {
                                if (i === 0) { index = indexMaxsY[i]; continue; }
                                if (coordinates[0][index][0] < coordinates[0][indexMaxsY[i]][0])
                                    index = indexMaxsY[i];
                            }
                            return index;
                        }
                    };
                    this.getSRIDGrid = function () {
                        var thiss = this;
                        var gridId = thiss.$ddlZoneUTM.int32();
                        if (gridId === 17) return 32717;
                        else if (gridId === 18) return 32718;
                        else if (gridId === 19) return 32719;
                        else return thiss.map.spatialReference.wkid
                    };
                    this._setDom = function ($dom, height) {
                        var thiss = this;
                        if ($dom !== undefined && $dom !== null)
                            if (typeof $dom === 'string')
                                $dom = jQuery($dom);
                        thiss.$map = $dom;
                        if (thiss.$map === undefined || thiss.$map === null || thiss.$map.length === 0)
                            thiss.$map = $('<div></div>', {
                                id: thiss.getUUID()
                            }).appendTo(jQuery('body'));
                        thiss.height = typeof height === "number" ? height : thiss.height;
                        thiss.setContainers();
                        if (String.isNullOrWhiteSpace(thiss.$map.attr('id')) === true)
                            thiss.$map.prop('id', thiss.getUUID());
                        //thiss.$map.prop('id').replace(/^\s*(#|\.|\>)/g, '');
                    };
                    this.setCustomDoms = function (doms) {
                        if (doms instanceof Array) {
                            doms.forEach(function (dom) {
                                this['$' + dom.key] = (typeof dom.value === "string") ? jQuery(dom.value) : dom.value;
                            }, this);
                        }
                        else if (doms instanceof Object) {
                            for (var i in doms) {
                                this['$' + i] = (typeof doms[i] === "string") ? jQuery(doms[i]) : doms[i];
                            }
                        }
                    };
                    this.toolExtent = function () {
                        var thiss = this;
                        var $btn = $('<button type="button" class="btn"><i class="gh gh-extent"></i></button>');
                        $btn.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.callbackExtent();
                        });
                        return $btn;
                    };
                    this.toolZoomIn = function () {
                        var thiss = this;
                        var $btn = $('<button type="button" class="btn"><i class="gh gh-zoom-in"></i></button>');
                        $btn.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.callbackZoomIn();
                        });
                        return $btn;
                    };
                    this.toolZoomOut = function () {
                        var thiss = this;
                        var $btn = $('<button type="button" class="btn"><i class="gh gh-zoom-out"></i></button>');
                        $btn.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.callbackZoomOut();
                        });
                        return $btn;
                    };
                    this.toolBaseMaps = function () {
                        var thiss = this;
                        if (thiss.$baseMaps === undefined || thiss.$baseMaps === null || thiss.$baseMaps.length === 0) {
                            thiss.$baseMaps = jQuery('<div><button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="margin-top:0"><span class="glyphicon glyphicon-globe"></span> <span class="caret"></span></button><ul class="dropdown-menu  dropdown-menu-right"></ul></div>').css({ "top": 0, "right": 0, "position": "absolute" });
                            thiss._addDom(thiss.$baseMaps);
                        }
                        thiss.$baseMaps.find('>button').off("click");
                        thiss.$baseMaps.find('>button').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            write(thiss.$baseMaps);
                            thiss.currentBasemap();
                        });
                        function write($dom) {
                            if ($dom.find('>ul').is(":empty") === true) {
                                $dom.find('>ul').append('<li class="dropdown-header">Mapas base</li>');
                                var baseMaps = thiss.config.module.map.baseMaps;
                                var uuid = thiss.getUUID();
                                var i = 0;
                                for (i = 0; i < baseMaps.length; i++) {
                                    if (baseMaps[i].disabled === true) continue;
                                    $dom.find('>ul').append('<li role="separator" class="divider"></li>');
                                    for (var j = 0; j < baseMaps[i].items.length; j++) {
                                        if (baseMaps[i].items[j].disabled === true) continue;
                                        var $rdb = $('<input type="radio" name="rdb_' + uuid + '" id="' + baseMaps[i].items[j].id + '" />');
                                        var $a = $('<a><span class="radio"></span></a>');
                                        $a.append($rdb);
                                        $a.append('<label>' + baseMaps[i].items[j].label + '</label>');
                                        var $li = $('<li></li>');
                                        $li.append($a);
                                        $rdb.on('change', function (e) {
                                            window.plugins.deviceFeedback.acoustic();
                                            if (jQuery(this).is(":checked") === true) {
                                                thiss.changeVisibility(jQuery(this).prop("id"));
                                                $rdb.closest('li').trigger('click');
                                            }
                                        });
                                        $dom.find('>ul').append($li);
                                    }
                                }
                            }
                        }
                    };
                    this.toolGPSTrack = function () {
                        var $btn = $('<button type="button" class="btn" title="GPS"><i class="fa fa-map-marker"></i></button>');
                        $btn.on("press", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (BaseToolPalette.geometry.coordinates.length >= 3) {
                                var geometry = JSON.parse(JSON.stringify(BaseToolPalette.geometry));
                                BaseToolPalette.geometry = {};
                                if (typeof callback === "function")
                                    callback(geometry, true);
                            }
                            else
                                alert("Debe generar al menos tres puntos", null, BaseToolPalette.TITLE, "Aceptar");
                        });
                        $btn.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                                if (enabled === false) {
                                    confirm('Su GPS está desactivado. ¿Desea activarlo?', function onConfirm(buttonIndex) {
                                        if (buttonIndex === 1)
                                            cordova.plugins.diagnostic.switchToLocationSettings();
                                    }, "GPS", ["Aceptar", "Cancelar"]);
                                } else {
                                    navigator.geolocation.getCurrentPosition(function (position) {
                                        var point = [position.coords.longitude, position.coords.latitude, position.coords.altitude];
                                        BaseToolPalette.geometry.spatialReference = BaseToolPalette.geometry.spatialReference || { id: BaseToolPalette.SRIDDEFAULTGPS };
                                        BaseToolPalette.geometry.coordinates = BaseToolPalette.geometry.coordinates || [];
                                        BaseToolPalette.geometry.coordinates.push(point);
                                        var geometry = JSON.parse(JSON.stringify(BaseToolPalette.geometry));
                                        if (typeof callback === "function")
                                            callback(geometry, false);
                                    }, function (error) { alert(BaseToolPalette.TITLE, null, "Error: " + error, "Aceptar"); }, { enableHighAccuracy: true });
                                }
                            });
                        });
                        return $btn;
                    };
                    this.fullMap = function () {
                        var thiss = this;
                        var currentWidth = thiss.$map.width();
                        var currentHeight = thiss.$map.height();
                        thiss.$map.dialog({
                            title: "Vista Previa",
                            width: '100%',
                            height: jQuery(window).height() - 70,
                            resizable: false,
                            modal: true,
                            closeOnEscape: true,
                            autohide: false,
                            draggable: false,
                            close: function (obj) {
                                thiss.$map.css({ 'width': currentWidth, 'height': currentHeight });
                                thiss.$btnExtentResult.trigger('click');
                            }
                        });
                        thiss.$btnExtentResult.trigger('click');
                    };
                    this.fullMapLayers = function (options) {
                        var thiss = this;
                        //var currentWidth = thiss.$map.width();
                        //var currentHeight = thiss.$map.height();
                        var id = thiss.$hdnId.int32();
                        url = com.jtm.System.urlViewer + "?id=" + id;
                        options = options || {};
                        options.width = options.width || '100%';
                        options.height = options.height || jQuery(window).height() - 50;
                        options.draggable = options.draggable || false;
                        options.dialogTitle = options.dialogTitle || "Vista previa";
                        thiss.$form = $('<div></div>').appendTo(thiss.$map);
                        thiss.$form.dialog({
                            title: options.dialogTitle,
                            fluid: true,
                            height: options.height,
                            width: options.width,
                            resizable: false,
                            closeOnEscape: true,
                            autoOpen: true,
                            modal: true,
                            autoremove: true,
                            draggable: options.draggable
                        });
                        thiss.$form.css("overflow", "");
                        var $iframe = $('<iframe id="iframeViewer" width="100%" height="100%" frameborder="no" src="' + url + '"></iframe>');
                        thiss.$form.append($iframe);
                    };
                    this.downloadCoordinates = function () {
                        var thiss = this;
                        var $table = thiss.$tableCoordinates.clone();
                        var $tr = null;
                        var name = "Coordenadas";
                        $table.hide();
                        if ($table.find('>tbody').length === 0) {
                            toastr.info("No hay coordenadas");
                            $table.remove();
                            return;
                        }
                        $table.find('>thead>tr:first>th:eq(0)').text('Vertice');
                        $table.find('>tbody>tr').toArray().forEach(function (tr) {
                            $tr = jQuery(tr);
                            $tr.find('td:eq(1)').text($tr.find('td:eq(1) input').val());
                            $tr.find('td:eq(2)').text($tr.find('td:eq(2) input').val());
                        });
                        $table.append("<tfoot><tr><td colspan=" + ($table.find('>thead>tr:first>th').length - 1) + "> SRID : " + thiss.$ddlSpatialReference.find(":selected").text() + "</td></tr></tfoot>");
                        thiss.$tableCoordinates.append($table);
                        com.jtm.helper.Table.toSpreadSheet($table, name, name);
                        $table.remove();
                    };
                }
                BaseSimpleMap.MODULE = 'geometry';
                BaseSimpleMap.SUBMODULE = '';
                BaseSimpleMap.BASEPREFIX = 'geometry';
                BaseSimpleMap.DIVMAP = '#map';
                BaseSimpleMap.DIVCOORDINATES = '#divCoordinates';
                BaseSimpleMap.BTNUPDATEGEOMETRY = '#btnUpdateGeometry';
                BaseSimpleMap.BTNPOINT = '#btnPoint';
                BaseSimpleMap.BTNMULTIPOINT = '#btnMultiPoint';
                BaseSimpleMap.BTNRECTANGLE = '#btnRectangle';
                BaseSimpleMap.BTNLINE = '#btnLine';
                BaseSimpleMap.BTNPOLYLINE = '#btnPolyline';
                BaseSimpleMap.BTNPOLYLINEFREEHAND = '#btnPolylineFreeHand';
                BaseSimpleMap.BTNPOLYGON = '#btnPolygon';
                BaseSimpleMap.BTNPOLYGONFREEHAND = '#btnPolygonFreeHand';
                BaseSimpleMap.BTNCIRCLE = '#btnCircle';
                BaseSimpleMap.BTNELLIPSE = '#btnEllipse';
                BaseSimpleMap.BTNTRIANGLE = '#btnTriangle';
                BaseSimpleMap.BTNARROW = '#btnArrow';
                BaseSimpleMap.BTNTEXT = '#btnText';
                BaseSimpleMap.BTNEXTENTRESULT = '#btnExtentResult';
                BaseSimpleMap.BTNXY = '#btnXY';
                BaseSimpleMap.BTNXYR = '#btnXYR';
                BaseSimpleMap.BTNXYMM = '#btnXYMM';
                BaseSimpleMap.BTNFILECOORDINATE = '#btnFileCoordinate';
                BaseSimpleMap.BTNDOWNLOADCOORDINATE = '#btnDownloadCoordinates';
                BaseSimpleMap.BTNFULLMAP = '#btnFullMap';
                BaseSimpleMap.BTNFULLMAPLAYERS = '#btnFullMapLayers';
                BaseSimpleMap.TXTRADIO = '#txtRadio';
                BaseSimpleMap.DDLSPATIALREFERENCE = '#ddlSpatialReference';
                BaseSimpleMap.DDLZONEUTM = '#ddlZoneUTM';
                BaseSimpleMap.DDLDEPARTMENT = '#ddlDepartment';
                BaseSimpleMap.DDLPROVINCE = '#ddlProvince';
                BaseSimpleMap.DDLDISTRICT = '#ddlDistrict';
                BaseSimpleMap.DDLHYDROGRAPHICBASIN = '#ddlHydrographicBasin';
                BaseSimpleMap.DDLNATIONALCARTOGRAPHY = '#ddlNationalCartography';
                BaseSimpleMap.TXTX = '#txtX';
                BaseSimpleMap.TXTY = '#txtY';
                BaseSimpleMap.TBLRESULTCOORDINATES = '#tblResultCoordinates';
                BaseSimpleMap.TBLRESULTDISTRICTS = '#tblResultDistricts';
                BaseSimpleMap.TBLRESULTNATIONALCARTOGRAPHIES = '#tblResultNationalCartographies';
                BaseSimpleMap.TBLRESULTHYDROGRAPHICBASINS = '#tblResultHydrographicBasins';
                BaseSimpleMap.TBLRESULTTOWNCENTERS = '#tblResultTownCenters';
                BaseSimpleMap.CHKCOORDINATEREADONLY = '#chkCoordinateReadonly';
                BaseSimpleMap.FILFILECOORDINATE = '#filFileCoordinate';
                BaseSimpleMap.COORDINATESDIRECTTODB = true;
                BaseSimpleMap.prototype.addToolbar = function () {
                };
                BaseSimpleMap.prototype._addDom = function ($dom) {
                };
                BaseSimpleMap.prototype.setContainers = function () {
                    var thiss = this;
                    thiss.$map.css("width", "100%").css("height", thiss.height).css("position", "relative");
                };
                BaseSimpleMap.prototype.projectGeometry = function (geometry, toSRID) {
                    return null;
                };
                BaseSimpleMap.prototype.setServices = function (map) {
                    var thiss = this;
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getScript(thiss.js.path + "geometry/baseservice.js");
                    jQuery.getScript(thiss.js.path + "geometry/" + thiss.js.apigeo.path + "service.js", function (data, textStatus, jqxhr) {
                        var client = new com.jtm.geometry.Service(map);
                        client.Base(thiss.config.module.map.baseMaps);
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseSimpleMap.prototype.setToolbar = function () {
                    var thiss = this;
                    thiss.$toolbar = null;//se setea el valor a null por un bug con respecto al toolbar
                    if (thiss.$toolbar === null || thiss.$toolbar.length === 0) {
                        thiss.$toolbar = jQuery('<div></div>');
                        thiss.addToolbar();
                        thiss.$toolbar.addClass("text-right");
                    }
                    thiss.$toolbar.addClass("btn-group-vertical");
                    thiss.$toolbar.css("top", "0").css("left", 0).css("position", "absolute").css("opacity", 0.8).css("filter", "alpha(opacity=80)").css("-moz-opacity", 0.8);
                    thiss.$toolbar.empty();
                    thiss.widgetsDefault();
                    thiss.widgetsCustom();
                };
                BaseSimpleMap.prototype.widgetsDefault = function () {
                    this.$toolbar.append(this.toolExtent());
                    this.$toolbar.append(this.toolZoomIn());
                    this.$toolbar.append(this.toolZoomOut());
                    this.toolBaseMaps();
                };
                BaseSimpleMap.prototype.widgetsCustom = function () {
                };
                BaseSimpleMap.prototype.parseSymbols = function () {
                };
                BaseSimpleMap.prototype.reposition = function () {
                };
                BaseSimpleMap.prototype.newMap = function (dom, height) {
                    var thiss = this;
                    height = height || thiss.$divCoordinates.outerHeight(true)
                    thiss._setDom(dom, height);
                };
                BaseSimpleMap.prototype.build = function (dom, height) {
                };
                BaseSimpleMap.prototype.initialExtent = function (map) {
                    var thiss = this;
                };
                BaseSimpleMap.prototype._addFeature = function (layer, json) {
                };
                BaseSimpleMap.prototype.addFeatures = function (json, addVertex) {
                    var thiss = this;
                    addVertex = typeof addVertex === 'boolean' ? addVertex : true;
                };
                BaseSimpleMap.prototype.removeLayers = function (toNull) {
                    toNull = typeof toNull === 'boolean' ? toNull : true;
                };
                BaseSimpleMap.prototype.selectedFeature = function (id, addVertex) {
                };
                BaseSimpleMap.prototype.syncLayer2Dom = function (layer, dom, joinField) {
                };
                BaseSimpleMap.prototype.syncDom2Layer = function (dom, layer, joinField) {
                };

                BaseSimpleMap.prototype.buildGraphicsLayer = function (options) {
                    return null;
                };
                BaseSimpleMap.prototype.buildFeatureLayer = function (options) {
                    return null;
                };
                BaseSimpleMap.prototype.callbackExtent = function () {
                };
                BaseSimpleMap.prototype.callbackZoomIn = function () {
                };
                BaseSimpleMap.prototype.callbackZoomOut = function () {
                };
                BaseSimpleMap.prototype.capturePoint = function (options, callback) {
                };
                BaseSimpleMap.prototype.changeVisibility = function (id) {
                };
                BaseSimpleMap.prototype.currentBasemap = function ($dom) {
                };
                BaseSimpleMap.prototype.drawPoint = function () {
                };
                BaseSimpleMap.prototype.drawPolyline = function () {
                };
                BaseSimpleMap.prototype.drawPolylineFreeHand = function () {
                };
                BaseSimpleMap.prototype.drawRectangle = function () {
                };
                BaseSimpleMap.prototype.drawCircle = function () {
                };
                BaseSimpleMap.prototype.drawEllipse = function () {
                };
                BaseSimpleMap.prototype.drawPolygon = function () {
                };
                BaseSimpleMap.prototype.drawPolygonFreeHand = function () {
                };
                BaseSimpleMap.prototype.extentResult = function () {
                };
                BaseSimpleMap.prototype.setCoordinates = function () {
                    var thiss = this;
                    thiss.$tableCoordinates.find("input").numeric();
                    thiss.$tableCoordinates.find(">thead").on('click', ".coordinate-add", function () {
                        window.plugins.deviceFeedback.acoustic();
                        var $tr = $(this).closest('table').find(">tbody>tr:last");//(this).closest('tr');
                        var $clone = $tr.clone();
                        $clone.find('input').val('');
                        $clone.find('td:eq(0)').text(parseInt($tr.find('td:eq(0)').text()) + 1);
                        $tr.after($clone);
                        $tr.find("button").remove();
                        thiss.$tableCoordinates.find("input").numeric();
                    });
                    thiss.$tableCoordinates.find(">tbody").on('click', ".coordinate-remove", function () {
                        window.plugins.deviceFeedback.acoustic();
                        var $tr = $(this).closest('tr');
                        var $btnRemove = $tr.find("button.coordinate-remove");
                        //var $btnAdd = $tr.find("button.coordinate-add");
                        if ($tr.index() <= 3) return;
                        $tr.prev().find('td:eq(3)').empty().append($btnRemove);//.append($btnAdd);
                        $tr.remove();
                    });
                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                    localStorage.removeItem("itemsCoordinate");
                    showOption();
                    function showOption() {
                        thiss.$main.find('#divCoordinateManual').hide();
                        thiss.$main.find('#divCoordinateMassive').hide();
                        thiss.$main.find('#divCoordinateMap').hide();
                        thiss.$tableCoordinates.find('button').hide();
                        thiss.$chkCoordinateReadonly.parent().hide();
                        thiss.$map.css('height', thiss.$divCoordinates.outerHeight(true));
                        thiss.$rdbCoordinate.off("change");
                        thiss.$rdbCoordinate.on("change", function (e) {
                            if (jQuery(this).is(":checked") === true) {
                                thiss.$ddlSpatialReference.attr('disabled', false);
                                if (this.value == 1) {
                                    thiss.$main.find('#divCoordinateManual').show();
                                    thiss.$main.find('#divCoordinateMassive').hide();
                                    thiss.$main.find('#divCoordinateMap').hide();
                                    thiss.$chkCoordinateReadonly.parent().show();
                                    thiss.$chkCoordinateReadonly.trigger("change");
                                    thiss.callbackCoordinatesManual();
                                } else if (this.value == 2) {
                                    thiss.$main.find('#divCoordinateManual').hide();
                                    thiss.$main.find('#divCoordinateMassive').show();
                                    thiss.$main.find('#divCoordinateMap').hide();
                                    thiss.$tableCoordinates.find('button').hide();
                                    thiss.$tableCoordinates.find('input').attr('readonly', true);
                                    thiss.$chkCoordinateReadonly.parent().hide();
                                    thiss.callbackCoordinatesMassive();
                                }
                                else if (this.value == 3) {
                                    thiss.$main.find('#divCoordinateManual').hide();
                                    thiss.$main.find('#divCoordinateMassive').hide();
                                    thiss.$main.find('#divCoordinateMap').show();
                                    thiss.$tableCoordinates.find('button').hide();
                                    thiss.$tableCoordinates.find('input').attr('readonly', true);
                                    thiss.$chkCoordinateReadonly.parent().hide();
                                    thiss.callbackCoordinatesMap();
                                }
                                thiss.$map.css('height', thiss.$divCoordinates.outerHeight(true));
                            }
                        });
                        thiss.$rdbCoordinate.trigger("change");
                    }
                    thiss.$chkCoordinateReadonly.off("change");
                    thiss.$chkCoordinateReadonly.on("change", function (e) {
                        thiss.$tableCoordinates.find('>tbody input').attr("readonly", !(jQuery(this).is(":checked")));
                        thiss.$tableCoordinates.find('button').css("display", (jQuery(this).is(":checked") === true ? 'block' : 'none'));
                    });
                    thiss.$chkCoordinateReadonly.trigger("change");
                };
                BaseSimpleMap.prototype.saveCoordinates = function () {
                    var thiss = this;
                    if (thiss.$tableCoordinates === null) return;
                    if (thiss.$tableCoordinates.find(">tbody>tr>td>input").val() === '' || thiss.$tableCoordinates.find(">tbody>tr>td>input").val() === 0) {
                        alert("Ingrese todas las coordenadas", null, BaseSimpleMap.TITLE);
                        return;
                    }
                    var items = [];
                    thiss.$tableCoordinates.find(">tbody>tr").toArray().forEach(function (tr) {
                        items.push({ x: parseFloat(jQuery(tr).find('td:eq(1)>input').val()), y: parseFloat(jQuery(tr).find('td:eq(2)>input').val()) });
                    });
                    var options = {};
                    //var items = (JSON.parse(localStorage.getItem("itemsCoordinate")));
                    var data = {
                        id: (isNaN(this.$hdnId.int32()) === true) ? this.$hdnId.string() : this.$hdnId.int32(),
                        spatialReference: {
                            id: thiss.$ddlSpatialReference.int32()
                        },
                        coordinates: items
                    };
                    function validate() {
                        if (thiss.$hdnId.int32() === 0) {
                            alert(BaseSimpleMap.NEWELEMENTID);
                            thiss.$hdnId.focus();
                            return false;
                        }
                        if (thiss.$ddlSpatialReference.int32() === 0) {
                            alert("Seleccione el sistema referencial");
                            thiss.$ddlSpatialReference.focus();
                            return false;
                        }
                        return true;
                    }
                    options.validate = validate;
                    options.data = data;
                    this.saveConfig(thiss.urlSave, options, null);
                };
                BaseSimpleMap.prototype.searchCoordinates = function (url, id) {
                    var thiss = this;
                    this.searchConfig(url, { data: { id: id } }, function (items) {
                        thiss.fillCoordinates(items);
                    });
                };
                BaseSimpleMap.prototype.fillCoordinates = function (items) {
                    var thiss = this;
                    if (items === undefined || items === null) return;
                    if (items instanceof Array) {
                        if (thiss.$tableCoordinates === null) return;
                        items.forEach(function (item, i) {
                            var $tr = thiss.$tableCoordinates.find('>tbody>tr').eq(i);
                            if ($tr.length === 0)
                                thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                            $tr = thiss.$tableCoordinates.find('>tbody>tr').eq(i);
                            $tr.find('td:eq(1)>input').val(Number(item.x).toFixed(thiss.config.number.decimalCount));
                            $tr.find('td:eq(1)>input').attr('data-x', item.x);
                            $tr.find('td:eq(2)>input').val(Number(item.y).toFixed(thiss.config.number.decimalCount));
                            $tr.find('td:eq(2)>input').attr('data-y', item.y);
                        });
                        jQuery('#divTotalCoordinates' + '>span').text(thiss.$tableCoordinates.find('>tbody>tr').length);
                        localStorage.setItem('itemsCoordinate', JSON.stringify(items));
                    }
                    else if (items instanceof Object) {
                        thiss.$txtX = thiss.$main.find(BaseSimpleMap.TXTX);
                        thiss.$txtY = thiss.$main.find(BaseSimpleMap.TXTY);
                        thiss.$txtX.val(Number(items.x).toFixed(thiss.config.number.decimalCount));
                        thiss.$txtY.val(Number(items.y).toFixed(thiss.config.number.decimalCount));
                    }
                };
                BaseSimpleMap.prototype.fillCoordinatesPoint = function (geometry) {
                    var thiss = this;
                    if (thiss.$ddlSpatialReference.int32() === 0) {
                        alert('Primero debe seleccionar el sistema referencial');
                    }
                    else {
                        var coordinates = [geometry.x, geometry.y];
                        coordinates = thiss.project(coordinates, geometry.spatialReference.id, thiss.$ddlSpatialReference.int32());
                        if (thiss.$ddlSpatialReference.int32() === BaseSimpleMap.SRIDDEFAULTGPS) {
                            thiss.$txtX.val(coordinates[0]);
                            thiss.$txtY.val(coordinates[1]);
                        } else {
                            thiss.$txtX.val(coordinates[0].toFixed(thiss.config.number.decimalCount));
                            thiss.$txtY.val(coordinates[1].toFixed(thiss.config.number.decimalCount));
                        }
                    }
                };
                BaseSimpleMap.prototype.callbackCoordinatesManual = function (options) {
                };
                BaseSimpleMap.prototype.callbackCoordinatesMassive = function (options) {
                    var thiss = this;
                    thiss.$btnFileCoordinate.off("click");
                    thiss.$btnFileCoordinate.on("click", function (e) {
                        thiss.$filFileCoordinate.trigger("click");
                    });
                    thiss.$filFileCoordinate.off("change");
                    thiss.$filFileCoordinate.on("change", function (e) {
                        if (e.originalEvent.target.files.length) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.originalEvent.target.files[0].name.split('.').pop() !== "zip") {
                                if (thiss.$ddlSpatialReference.int32() === 0) {
                                    alert("Seleccione un sistema referencial");
                                    thiss.$ddlSpatialReference.focus();
                                    return;
                                }
                            }
                            var options = { data: { spatialReferenceId: thiss.$ddlSpatialReference.int32() }, isJson: false };
                            options.attachments = [];
                            options.validate = function () { return true; };
                            options.attachments.push({ id: 'filFileCoordinate', file: e.originalEvent.target.files[0] });
                            thiss.searchConfig(com.jtm.Server.contextPath + "geometry/coordinate/search", options, function (item) {
                                thiss.fillCoordinates(item.coordinates);
                                thiss.$ddlSpatialReference.val(item.spatialReference.id);
                            });
                        }
                    });
                };
                BaseSimpleMap.prototype.callbackCoordinatesMap = function (options) {
                };
                BaseSimpleMap.prototype.searchDistricts = function (url, id, options) {
                    var thiss = this;
                    thiss.searchConfig(url, {
                        isJson: false,
                        data: {
                            id: id
                        }
                    }, function (items) {
                        options = options || {};
                        options.tbl = String.isNullOrWhiteSpace(options.tbl) ? BaseSimpleMap.TBLRESULTDISTRICTS : options.tbl;
                        options.div = String.isNullOrWhiteSpace(options.div) ? "#divTotalDistrict" : options.div;
                        fill(items, options.tbl, options.div);
                    });
                    function fill(items, tbl, div) {
                        var html = '';
                        jQuery.each(items, function (i, item) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.name + ' (' + item.id + ')</td>';
                            html += '<td>' + item.province.name + '</td>';
                            html += '<td>' + item.province.department.name + '</td>';
                            html += '</tr>';
                        });
                        jQuery(tbl + " > tbody").html(html);
                        jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                    }
                };
                BaseSimpleMap.prototype.searchNationalCartographies = function (url, id, options) {
                    var thiss = this;
                    thiss.searchConfig(url, {
                        isJson: false,
                        data: {
                            id: id
                        }
                    }, function (items) {
                        options = options || {};
                        options.tbl = String.isNullOrWhiteSpace(options.tbl) ? BaseSimpleMap.TBLRESULTNATIONALCARTOGRAPHIES : options.tbl;
                        options.div = String.isNullOrWhiteSpace(options.div) ? "#divTotalNationalCartography" : options.div;
                        fill(items, options.tbl, options.div);
                    });
                    function fill(items, tbl, div) {
                        var html = '';
                        jQuery.each(items, function (i, item) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.id + '</td>';
                            //html += '<td>' + item.code + '</td>';
                            html += '<td>' + item.name + '</td>';
                            html += '</tr>';
                        });
                        jQuery(tbl + " > tbody").html(html);
                        jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                    }
                };
                BaseSimpleMap.prototype.searchHydrographicBasins = function (url, id, options) {
                    var thiss = this;
                    thiss.searchConfig(url, {
                        isJson: false,
                        data: {
                            id: id
                        }
                    }, function (items) {
                        options = options || {};
                        options.tbl = String.isNullOrWhiteSpace(options.tbl) ? BaseSimpleMap.TBLRESULTHYDROGRAPHICBASINS : options.tbl;
                        options.div = String.isNullOrWhiteSpace(options.div) ? "#divTotalHydrographicBasin" : options.div;
                        fill(items, options.tbl, options.div);
                    });
                    function fill(items, tbl, div) {
                        var html = '';
                        jQuery.each(items, function (i, item) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.id + '</td>';
                            html += '<td>' + item.name + '</td>';
                            html += '</tr>';
                        });
                        jQuery(tbl + " > tbody").html(html);
                        jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                    }
                };
                BaseSimpleMap.prototype.searchTownCenters = function (url, id, options) {
                    var thiss = this;
                    thiss.searchConfig(url, {
                        isJson: false,
                        data: {
                            id: id
                        }
                    }, function (items) {
                        options = options || {};
                        options.tbl = options.tbl || thiss.$tableTownCenters;
                        options.tbl = typeof options.tbl == "string" == true ? $(options.tbl) : options.tbl;
                        thiss.$tableTownCenters = options.tbl;
                        div = String.isNullOrWhiteSpace(options.div) ? "#divTotalTownCenter" : options.div;
                        var html = '';
                        items.forEach(function (item, i) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.id + '</td>';
                            html += '<td>' + item.name + '</td>';
                            html += '</tr>';
                        });
                        thiss.$tableTownCenters.find(">tbody").html(html);
                        jQuery(div + ' > span').html(thiss.$tableTownCenters.find(">tbody tr").length);
                    });
                };
                BaseSimpleMap.prototype.initConfig = function () {
                };
                BaseSimpleMap.prototype.domConfig = function () {
                    this.$map = this.$main.find(BaseSimpleMap.DIVMAP);
                    this.$btnSave = this.$main.find(BaseSimpleMap.BTNUPDATEGEOMETRY);
                    this.$btnXY = this.$main.find(BaseSimpleMap.BTNXY);
                    this.$btnXYR = this.$main.find(BaseSimpleMap.BTNXYR);
                    this.$btnXYMM = this.$main.find(BaseSimpleMap.BTNXYMM);
                    this.$btnFileCoordinate = this.$main.find(BaseSimpleMap.BTNFILECOORDINATE);
                    this.$btnFullMap = this.$main.find(BaseSimpleMap.BTNFULLMAP);
                    this.$btnFullMapLayers = this.$main.find(BaseSimpleMap.BTNFULLMAPLAYERS);
                    this.$btnPoint = this.$main.find(BaseSimpleMap.BTNPOINT);
                    this.$btnExtentResult = this.$main.find(BaseSimpleMap.BTNEXTENTRESULT);
                    this.$btnDowloadCordinates = this.$main.find(BaseSimpleMap.BTNDOWNLOADCOORDINATE);
                    this.$ddlSpatialReference = this.$main.find(BaseSimpleMap.DDLSPATIALREFERENCE);
                    this.$ddlZoneUTM = this.$main.find(BaseSimpleMap.DDLZONEUTM);
                    this.$txtX = this.$main.find(BaseSimpleMap.TXTX);
                    this.$txtY = this.$main.find(BaseSimpleMap.TXTY);
                    this.$txtRadio = this.$main.find(BaseSimpleMap.TXTRADIO);
                    this.$tableCoordinates = this.$main.find(BaseSimpleMap.TBLRESULTCOORDINATES);
                    this.$tableDistricts = this.$main.find(BaseSimpleMap.TBLRESULTDISTRICTS);
                    this.$tableNationalCartographies = this.$main.find(BaseSimpleMap.TBLRESULTNATIONALCARTOGRAPHIES);
                    this.$tableHydrogrphicBasins = this.$main.find(BaseSimpleMap.TBLRESULTHYDROGRAPHICBASINS);
                    this.$tableTownCenters = this.$main.find(BaseSimpleMap.TBLRESULTTOWNCENTERS);
                    this.$chkCoordinateReadonly = this.$main.find(BaseSimpleMap.CHKCOORDINATEREADONLY);
                    this.$divCoordinates = this.$main.find(BaseSimpleMap.DIVCOORDINATES);
                    this.$filFileCoordinate = this.$main.find(BaseSimpleMap.FILFILECOORDINATE);
                    this.$rdbCoordinate = this.$divCoordinates.find('input[type=radio][name=rdbCoordinate]');
                    this.$chkCoordinateReadonly = this.$divCoordinates.find('#chkCoordinateReadonly');
                };
                BaseSimpleMap.prototype.buttonConfig = function () {
                    var thiss = this;
                    thiss.$btnSave.off("click");
                    thiss.$btnSave.on("click", function (e) {
                        thiss.saveCoordinates();
                    });
                    thiss.$btnFullMap.off("click");
                    thiss.$btnFullMap.on("click", function (e) {
                        thiss.fullMap();
                    });
                    thiss.$btnFullMapLayers.off("click");
                    thiss.$btnFullMapLayers.on("click", function (e) {
                        thiss.fullMapLayers();
                    });
                    thiss.$btnExtentResult.off("click");
                    thiss.$btnExtentResult.on("click", function (e) {
                        thiss.extentResult();
                    });
                    thiss.$btnPoint.off("click");
                    thiss.$btnPoint.on("click", function (e) {
                        thiss.capturePoint({}, function (geometry) {
                            thiss.fillCoordinatesPoint(geometry);
                        });
                    });
                    thiss.$btnDowloadCordinates.off("click");
                    thiss.$btnDowloadCordinates.on("click", function (e) {
                        thiss.downloadCoordinates();
                    });
                };
                BaseSimpleMap.prototype.formConfig = function () {
                };
                BaseSimpleMap.prototype.attachmentConfig = function () {
                };
                BaseSimpleMap.prototype.formConfig = function () {
                };
                BaseSimpleMap.prototype.procedureConfig = function () {
                };
                BaseSimpleMap.prototype.spatialConfig = function () {
                };
                BaseSimpleMap.prototype.viewConfig = function () {
                };
                BaseSimpleMap.prototype.uiConfig = function () {
                };
                BaseSimpleMap.prototype.load = function ($container, options) {
                    var thiss = this;
                    options = options || {};
                    if (options.extendsRoot === true) {
                        options.framework = options.framework || com.jtm.system.Spatial.apiGeo;
                        _super.prototype.load.call(this, $container, options);
                    }
                    else {
                        this.$hdnId = options.$hdnId;
                        this.urlSave = options.urlSave;
                        if (String.isNullOrWhiteSpace($container) === true)
                            $container = this.$main;
                        if (typeof $container === "string")
                            $container = jQuery($container);
                        this.$main = ($container.length === 0) ? this.$main : $container;
                        this.initConfig();
                        this.domConfig();
                        this.viewConfig();
                        this.uiConfig();
                        this.buttonConfig();
                        this.setCoordinates();
                        this.build(this.$map, options.heightMap);
                    }
                };
                BaseSimpleMap.prototype.setConfig = function (value, options, callback) {
                    var thiss = this;
                    this.config = value || {};
                    this.config.module = this.config.module || {};
                    options = options || { config: thiss.config.module, property: "map" };
                    options.module = String.isNullOrWhiteSpace(options.module) === true ? BaseSimpleMap.MODULE : options.module;
                    options.subModule = String.isNullOrWhiteSpace(options.subModule) === true ? BaseSimpleMap.SUBMODULE : options.subModule;
                    options.jsonFile = String.isNullOrWhiteSpace(options.jsonFile) === true ? "basesimplemap" : options.jsonFile;
                    options.framework = options.framework || com.jtm.system.Spatial.apiGeo;
                    thiss.setRoots(options);
                    this.loadConfig(options, callback);
                    var dependencies = [];
                    jQuery.ajaxSetup({ async: false });
                    dependencies.forEach(function (dependency) {
                        jQuery.getScript(dependency + ".js");
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseSimpleMap.prototype.loadConfig = function (options, callback) {
                    var thiss = this;
                    _super.prototype.loadConfig.call(this, options, function () {
                        options = options || {};
                        thiss.loadBaseMaps(options);
                        thiss.loadSpatialReferences(options);
                        thiss.loadSymbols(options);
                        if (options.noParseSymbols !== true)
                            thiss.parseSymbols();
                        thiss.setScopeLayer();
                        thiss.setCorsServers(thiss.config.corsServers);
                        thiss.setProxy(thiss.config.proxy);
                        thiss.setGeometryService(thiss.config.module.geometryService);
                        if (typeof callback === "function")
                            callback();
                    });
                };
                BaseSimpleMap.prototype.loadSymbols = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.jsonSymbol = options.jsonSymbol || thiss.json.path + BaseSimpleMap.MODULE + "/";
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getJSON(options.jsonSymbol + "symbols.json?" + Math.random(), function (data, textStatus, jqXHR) {
                        thiss.config.module.map.symbols = data;
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseSimpleMap.prototype.loadBaseMaps = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.jsonBaseMap = options.jsonBaseMap || thiss.json.path + BaseSimpleMap.MODULE + "/";
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getJSON(options.jsonBaseMap + "basemap.json?" + Math.random(), function (data, textStatus, jqXHR) {
                        thiss.config.module.map.baseMaps = data;
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseSimpleMap.prototype.loadSpatialReferences = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.jsonSpatialReference = options.jsonSpatialReference || thiss.json.path + BaseSimpleMap.MODULE + "/";
                    jQuery.ajaxSetup({ async: false });
                    if (options.fromRemote === true)
                        thiss.config.module.map.spatialReferences = com.jtm.helper.DropDownList.getItems(com.jtm.Server.contextPath + "geometry/spatialreference/list");
                    else
                        jQuery.getJSON(options.jsonSpatialReference + "spatialreferences.json?" + Math.random(), function (data, textStatus, jqXHR) {
                            thiss.config.module.map.spatialReferences = data;
                        });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseSimpleMap.prototype.setScopeLayer = function () {
                    var thiss = this;
                    if (String.isNullOrWhiteSpace(thiss.config.module.map.scopeLayer) === false)
                        thiss.config.module.map.scopeLayer = (thiss.config.module.map.scopeLayer.startsWith('http') ? thiss.config.module.map.scopeLayer : com.jtm.Server.contextPath + thiss.config.module.map.scopeLayer);
                };
                BaseSimpleMap.prototype.setCorsServers = function (items) {
                };
                BaseSimpleMap.prototype.setProxy = function (proxy) {
                };
                BaseSimpleMap.prototype.setGeometryService = function (geometryService) {
                };
                return BaseSimpleMap;
            })(jtm.Master);
            geometry.BaseSimpleMap = BaseSimpleMap;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));