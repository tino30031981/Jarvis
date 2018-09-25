(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (overlap) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$btnOverlap = null;
                                this.$btnIdentify = null;
                                this.$ddlOption = null;
                                this.$divPointAndRadio = null;
                                this.$divListCoordinates = null;
                                this.$divFiles = null;
                                this.$divServicesOverlaps = null;
                                this.$smlFileCoordinate = null;
                                this.htmlServices = null;
                                this.layerOverlap = null;
                                this.layerOnClick = null;
                                this.writeServicesOverlaps = function (services, isRoot) {
                                    var thiss = this;
                                    isRoot = (typeof isRoot === "boolean") ? isRoot : true;
                                    var classUl = (isRoot === true) ? "tree root" : "";
                                    services = services || thiss.config.module.widget.services;
                                    thiss.htmlServices += '<ul class="' + classUl + '">';
                                    var i = 0;
                                    var checked = '';
                                    for (i = 0; i < services.length; i++) {
                                        thiss.htmlServices += '<li>';
                                        thiss.htmlServices += '<input type="checkbox" id="' + services[i].UUID + '"' + checked + ' value="' + (String.isNullOrWhiteSpace(services[i].layerId) ? -1 : services[i].layerId) + '" />';
                                        thiss.htmlServices += '<label>' + services[i].name + '</label>';
                                        if (services[i].services instanceof Array)
                                            thiss.writeServicesOverlaps(services[i].services, false);
                                        thiss.htmlServices += '</li>';
                                    }
                                    thiss.htmlServices += '</ul>';
                                };
                                this.writetblCoordinates = function () {
                                    var thiss = this;
                                    thiss.$tableCoordinates = thiss.$widget.find("#tblResultCoordinates");
                                    //thiss.$tableCoordinates.find("input").numeric();
                                    thiss.$tableCoordinates.find(">thead").off('click', ".coordinate-add");
                                    thiss.$tableCoordinates.find(">thead").on('click', ".coordinate-add", function () {
                                        window.plugins.deviceFeedback.acoustic();
                                        var $tr = $(this).closest('table').find(">tbody>tr:last");
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
                                        if ($tr.index() <= 3) return;
                                        $tr.prev().find('td:eq(3)').empty().append($btnRemove);
                                        $tr.remove();
                                    });
                                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                                    thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                                };
                                this.setServices = function () {
                                    var thiss = this;
                                    jQuery.ajaxSetup({ async: false });
                                    setData(thiss.config.module.widget.services);
                                    jQuery.ajaxSetup({ async: true });
                                    function setData(services) {
                                        for (var i = 0; i < services.length; i++) {
                                            services[i].UUID = thiss.getUUID();
                                            if (services[i].services instanceof Array) {
                                                setData(services[i].services);
                                            } else {                                                                                              
                                                jQuery.getJSON(services[i].url + '/' + services[i].layerId + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                                    if (data.error !== undefined || jqXHR.status != 200) { services[i].disabled = true; return; }
                                                    services[i].name = data.name;
                                                    services[i].displayField = data.displayField;
                                                    services[i].excludeFields = services[i].excludeFields.concat(thiss.excludeFields);
                                                });
                                            }
                                        }
                                    }
                                };
                                this.getServices = function () {
                                    var thiss = this;
                                    var services = [];
                                    thiss.$divServicesOverlaps.find('>ul input:checkbox').toArray().forEach(function (chk) {
                                        if (jQuery(chk).is(":checked") === true && jQuery(chk).val() > -1) {
                                            thiss.findServiceById(thiss.config.module.widget.services, jQuery(chk).attr('id'), services);
                                        }
                                    });
                                    return services;
                                };
                                this.findServiceById = function (services, id, servicesSelected) {
                                    var thiss = this;
                                    var i = 0;
                                    for (i; i < services.length; i++) {
                                        if (services[i].UUID === id)
                                            servicesSelected.push(services[i]);
                                        else if (services[i].services instanceof Array)
                                            thiss.findServiceById(services[i].services, id, servicesSelected);
                                    }
                                };
                                this.writeOverlapsAlphanumeric = function (dom, services, responses) {
                                    var thiss = this;
                                    var $divResult = jQuery(dom.contentDocument).find("#divResult");
                                    var $img = jQuery(dom.contentDocument).find("#img");
                                    if (responses.length === 0) return;
                                    var service = null;
                                    responses.forEach(function (response, i) {
                                        service = services[i];
                                        thiss.writeTable($divResult, service, response);
                                    }, this);
                                    thiss.html2Canvas(thiss.$map, $img);
                                };
                                this.writeTable = function ($dom, service, items) {
                                    var thiss = this;
                                    var symbol = JSON.parse(JSON.stringify(service.symbol));
                                    var clone = service.symbol.color.slice();
                                    symbol.color = symbol.color.slice(0, 3);
                                    symbol.color.push(clone[3] / 100);
                                    if (symbol.outline !== undefined) {
                                        clone = symbol.outline.color.slice();
                                        symbol.outline.color = symbol.outline.color.slice(0, 3);
                                        symbol.outline.color.push(clone[3] / 100);
                                    }
                                    var $table = $('<table class="table table-sm table-striped table-bordered"></table>');
                                    $dom.append($table);
                                    writeCaption();
                                    writeHeader();
                                    writeBody();
                                    function writeCaption() {
                                        $table.append('<caption>' + service.name + ' (' + items.length + ')' + '</caption>');
                                    }
                                    function writeHeader() {
                                        if (items.length === 0) return;
                                        $table.append("<thead></thead>");
                                        $table.find('>thead').append("<tr></tr>");
                                        $table.find('>thead>tr').css({
                                            "border-color": 'rgba(' + symbol.outline.color.join() + ')',
                                            "background-color": 'rgba(' + symbol.outline.color.join() + ')',
                                            "border-width": symbol.outline.width + 'px',
                                            "border-style": "solid"
                                        });
                                        $table.find('>thead>tr').append("<th>N&#186;</th>");
                                        for (var j in items[0].feature.attributes) {
                                            if (service.excludeFields.includes(j) || j === "N") continue;
                                            $table.find('>thead>tr').append("<th>" + j + "</th>");
                                        }
                                    }
                                    function writeBody() {
                                        if (items.length === 0) return;
                                        $table.append("<tbody></tbody>");
                                        items.forEach(function (item, i) {
                                            $table.find('>tbody').append('<tr id="' + service.UUID + "_" + (i + 1) + '"></tr>');
                                            $table.find('>tbody>tr:last').append("<td>" + (i + 1) + "</td>");
                                            for (var j in item.feature.attributes) {
                                                if (service.excludeFields.includes(j) || j === "N") continue;
                                                $table.find('>tbody>tr:last').append("<td>" + item.feature.attributes[j] + "</td>");
                                            }
                                        });
                                    }
                                };
                                this.cleanData = function () {
                                    var thiss = this;
                                    if (thiss.$txtX !== null)
                                        thiss.$txtX.val('');
                                    if (thiss.$txtY !== null)
                                        thiss.$txtY.val('');
                                    if (thiss.$txtRadio !== null)
                                        thiss.$txtRadio.val('');
                                    if (thiss.$filFileCoordinate !== null)
                                        thiss.$filFileCoordinate.val('');
                                    if (thiss.$smlFileCoordinate !== null)
                                        thiss.$smlFileCoordinate.empty();
                                    if (thiss.$tableCoordinates !== null)
                                        thiss.$tableCoordinates.find('>tbody tr input').val('');
                                    thiss.removeOverlaps();
                                    thiss.cleanLayer();
                                };
                            }
                            BaseWidget.POINTANDRADIO = "pointandradio";
                            BaseWidget.LISTCOORDINATES = "listcoordinates";
                            BaseWidget.FILES = "files";
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                                thiss.excludeFields = ["Shape_Leng", "Shape", "Shape.STArea()", "Shape.STLength()"];
                                thiss.setServices();
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                this.$txtX = thiss.$widget.find("#txtX");
                                this.$txtY = thiss.$widget.find("#txtY");
                                this.$txtRadio = thiss.$widget.find("#txtRadio");
                                this.$btnOverlap = thiss.$widget.find("#btnOverlap");
                                this.$btnIdentify = thiss.$widget.find("#btnIdentify");
                                this.$btnFileCoordinate = thiss.$widget.find("#btnFileCoordinate");
                                this.$btnClean = thiss.$widget.find("#btnClean");
                                this.$ddlOption = thiss.$widget.find("#ddlOption");
                                this.$ddlSpatialReference = thiss.$widget.find("#ddlSpatialReference");
                                this.$divPointAndRadio = thiss.$widget.find("#divPointAndRadio");
                                this.$divListCoordinates = thiss.$widget.find("#divListCoordinates");
                                this.$divServicesOverlaps = thiss.$widget.find("#divServicesOverlaps");
                                this.$divFiles = thiss.$widget.find("#divFiles");
                                this.$filFileCoordinate = thiss.$widget.find("#filFileCoordinate");
                                this.$smlFileCoordinate = thiss.$widget.find("#smlFileCoordinate");
                                thiss.$txtX.numeric({ negative: false, decimalPlaces: 3 });
                                thiss.$txtY.numeric({ negative: false, decimalPlaces: 3 });
                                thiss.$txtRadio.numeric({ negative: false, decimalPlaces: 2 });
                                thiss.writetblCoordinates();
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.widget.spatialReferences
                                });
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlOption,
                                    items: thiss.config.module.widget.options
                                });
                                thiss.$ddlOption.off("change");
                                thiss.$ddlOption.on("change", function (e) {
                                    thiss.$divPointAndRadio.hide();
                                    thiss.$divListCoordinates.hide();
                                    thiss.$divFiles.hide();
                                    thiss.cleanData();
                                    if (jQuery(this).val() === BaseWidget.POINTANDRADIO) {
                                        thiss.$divPointAndRadio.show();
                                        thiss.$divListCoordinates.hide();
                                        thiss.$divFiles.hide();
                                    }
                                    else if (jQuery(this).val() === BaseWidget.LISTCOORDINATES) {
                                        thiss.$divListCoordinates.show();
                                        thiss.$divPointAndRadio.hide();
                                        thiss.$divFiles.hide();
                                    }
                                    else if (jQuery(this).val() === BaseWidget.FILES) {
                                        thiss.$divFiles.show();
                                        thiss.$divPointAndRadio.hide();
                                        thiss.$divListCoordinates.hide();
                                    }
                                });
                                thiss.$ddlOption.trigger("change");
                                thiss.htmlServices = "";
                                thiss.writeServicesOverlaps();
                                thiss.$divServicesOverlaps.empty();
                                thiss.$divServicesOverlaps.html(thiss.htmlServices);
                                thiss.$divServicesOverlaps.find('>ul').tree({
                                    checkChildren: true,
                                    singleBranchOpen: false,
                                    initialState: "collapse",
                                    expandOnCheck: true,
                                    collapseOnUnCheck: true
                                });
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
                                    }
                                });
                                thiss.$btnOverlap.off("click");
                                thiss.$btnOverlap.on("click", function (e) {
                                    thiss.addLayerOverlap();
                                });
                                thiss.$btnClean.off("click");
                                thiss.$btnClean.on("click", function () {
                                    thiss.cleanData();
                                });
                                thiss.$btnIdentify.off("click");
                                thiss.$btnIdentify.on("click", function () {
                                    thiss.identify();
                                });
                            };
                            BaseWidget.prototype.form = function (url, id, options) {
                                var thiss = this;
                                options = options || {};
                                options.title = "Superposicion desde sigemin";
                                url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_list.html?' + Math.random();
                                _super.prototype.form.call(this, url, id, options);
                            };
                            BaseWidget.prototype.detail = function (dom, id) {
                                var thiss = this;
                                thiss.searchOverlaps(dom, id);
                            };
                            BaseWidget.prototype.addLayerOverlap = function () {
                                var thiss = this;
                                if (thiss.getServices().length === 0) {
                                    toastr.info("Seleccione las capas a superponer");
                                    return;
                                } else if (thiss.getServices().length > 10) {
                                    toastr.info("Seleccionar máximo 10 capas a consultar");
                                    return;
                                }
                                var coordinates = null;
                                if (thiss.$ddlOption.val() === BaseWidget.POINTANDRADIO) {
                                    if (thiss.$txtX.val() === "") {
                                        alert('Ingrese un X');
                                        return;
                                    }
                                    else if (thiss.$txtY.val() === "") {
                                        alert('Ingrese un Y');
                                        return;
                                    }
                                    else if (thiss.$txtRadio.val() === "") {
                                        alert('Ingrese un Radio');
                                        return;
                                    }
                                    coordinates = [];
                                    coordinates.push(thiss.$txtX.val(), thiss.$txtY.val());
                                    thiss.analizeCoordinatesPoint(coordinates, thiss.$ddlSpatialReference.int32());
                                } else if (thiss.$ddlOption.val() === BaseWidget.LISTCOORDINATES) {
                                    if (thiss.$tableCoordinates.find(">tbody tr input").val() == "") {
                                        alert("Ingrese todas las coordenadas");
                                        return;
                                    }
                                    coordinates = [[]];
                                    thiss.$tableCoordinates.find(">tbody>tr").toArray().forEach(function (tr) {
                                        coordinates[0].push([parseFloat(jQuery(tr).find('td:eq(1)>input').val()), parseFloat(jQuery(tr).find('td:eq(2)>input').val())]);
                                    });
                                    coordinates[0].push(coordinates[0][0]);
                                    thiss.analizeCoordinates(coordinates, thiss.$ddlSpatialReference.int32());
                                } else if (thiss.$ddlOption.val() === BaseWidget.FILES) {
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
                                        coordinates[0].push(coordinates[0][0]);
                                        thiss.analizeCoordinates(coordinates, data.item.spatialReference.id);
                                    });
                                }
                            };
                            BaseWidget.prototype.analizeCoordinates = function (coordinates, srid) {
                            };
                            BaseWidget.prototype.analizeCoordinatesPoint = function (coordinates, srid) {
                            };
                            BaseWidget.prototype.removeOverlaps = function () {
                            };
                            BaseWidget.prototype.identify = function () {
                            };
                            BaseWidget.prototype.cleanLayer = function () {
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                this.cleanData();
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        overlap.BaseWidget = BaseWidget;
                    })(widgets.overlap || (widgets.overlap = {}));
                    var overlap = widgets.overlap;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));