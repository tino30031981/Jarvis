(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (surfacepropertynational) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$txtNumberOrCodeSearch = null;
                                    this.$txtNameSearch = null;
                                    this.$txtHolderSearch = null;
                                    this.$btnSearch = null;
                                    this.$btnClean = null;
                                    this.$divServicesOverlaps = null;
                                    this.code = null;
                                    this.infoWindowShow = null;
                                    this.cleanData = function () {
                                        var thiss = this;
                                        if (thiss.$txtNumberOrCodeSearch !== null)
                                            thiss.$txtNumberOrCodeSearch.val('');
                                        if (thiss.$txtNameSearch !== null)
                                            thiss.$txtNameSearch.val('');
                                        if (thiss.$txtHolderSearch !== null)
                                            thiss.$txtHolderSearch.val('');
                                        if (thiss.$table !== null)
                                            thiss.$table.empty();
                                    };
                                    this.setServicesOverlaps = function () {
                                        var thiss = this;
                                        jQuery.ajaxSetup({ async: false });
                                        setData(thiss.config.module.widget.servicesOverlaps);
                                        jQuery.ajaxSetup({ async: true });
                                        function setData(servicesOverlaps) {
                                            for (var i = 0; i < servicesOverlaps.length; i++) {
                                                servicesOverlaps[i].UUID = thiss.getUUID();
                                                if (servicesOverlaps[i].servicesOverlaps instanceof Array) {
                                                    setData(servicesOverlaps[i].servicesOverlaps);
                                                } else {
                                                    //(function () {
                                                        jQuery.getJSON(servicesOverlaps[i].url + '/' + servicesOverlaps[i].layerId + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                                            if (data.error !== undefined || jqXHR.status != 200) { servicesOverlaps[i].disabled = true; return; }
                                                            servicesOverlaps[i].name = data.name;
                                                            servicesOverlaps[i].displayField = data.displayField;
                                                        });
                                                    //}());
                                                }
                                            }
                                        }
                                    };
                                    this.writeServicesOverlaps = function (servicesOverlaps, isRoot) {
                                        var thiss = this;
                                        servicesOverlaps = servicesOverlaps || thiss.config.module.widget.servicesOverlaps;
                                        isRoot = (typeof isRoot === "boolean") ? isRoot : true;
                                        thiss.htmlServices += isRoot ? '<ul class="dropdown-menu dropdown-menu-right tree root" aria-labelledby="ulServices">' : '<ul class="">';
                                        var i = 0;
                                        var checked = '';
                                        for (i = 0; i < servicesOverlaps.length; i++) {
                                            thiss.htmlServices += '<li>';
                                            thiss.htmlServices += '<input type="checkbox" id="' + servicesOverlaps[i].UUID + '"' + checked + ' value="' + (String.isNullOrWhiteSpace(servicesOverlaps[i].layerId) ? -1 : servicesOverlaps[i].layerId) + '" />';
                                            thiss.htmlServices += '<label>' + servicesOverlaps[i].name + '</label>';
                                            if (servicesOverlaps[i].servicesOverlaps instanceof Array)
                                                thiss.writeServicesOverlaps(servicesOverlaps[i].servicesOverlaps, false);
                                            thiss.htmlServices += '</li>';
                                        }
                                        thiss.htmlServices += '</ul>';
                                    };
                                    this.getServicesOverlaps = function () {
                                        var thiss = this;
                                        var services = [];
                                        thiss.$divServicesOverlaps.find('>ul input:checkbox').toArray().forEach(function (chk) {
                                            if (jQuery(chk).is(":checked") === true && jQuery(chk).val() > -1) {
                                                thiss.findServiceById(thiss.config.module.widget.servicesOverlaps, jQuery(chk).attr('id'), services);
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
                                            else if (services[i].servicesOverlaps instanceof Array)
                                                thiss.findServiceById(services[i].servicesOverlaps, id, servicesSelected);
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
                                            thiss.writeOverlapTable($divResult, service, response);
                                        }, this);
                                        thiss.html2Canvas(thiss.$map, $img);
                                    };
                                    this.writeOverlapTable = function ($dom, service, items) {
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
                                        var $table = $('<table class="table table-sm table-striped table-bordered table-responsive"></table>');
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
                                            $table.find('>thead>tr').append("<th>N&ord;</th>");
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
                                    this.fillData = function (response) {
                                        var thiss = this;
                                        console.log(response);
                                        thiss.writeResultDefault(response, {
                                            joinField: thiss.config.module.widget.service.joinField,
                                            excludeFields: thiss.config.module.widget.service.excludeFields,
                                            defaultFields: thiss.config.module.widget.service.defaultFields
                                        });
                                        thiss.getResource();
                                    };
                                    this.getResource = function () {
                                        var thiss = this;
                                        var id = thiss.getUUID();
                                        jQuery(".contentPane").off("click", "a.recursos");
                                        jQuery(".contentPane").on("click", "a.recursos", function (e) {
                                            e.preventDefault();
                                            if (jQuery(this).closest(".contentPane").find("#" + id).length === 0) {
                                                jQuery(this).closest(".contentPane").append('<div id="' + id + '"></div>');
                                            }
                                            jQuery(jQuery(this).closest(".contentPane").find("#" + id)[0]).load(this.href);
                                        });
                                    };
                                }
                                BaseWidget.prototype.initConfig = function () {
                                    var thiss = this;
                                    _super.prototype.initConfig.call(this);
                                    thiss.config.module.widget.service.url = thiss.config.module.widget.service.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.service.url : thiss.config.module.widget.service.url;
                                    thiss.setServicesOverlaps();
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    this.$txtNumberOrCodeSearch = thiss.$widget.find('#txtNumberOrCodeSearch');
                                    this.$txtNameSearch = thiss.$widget.find('#txtNameSearch');
                                    this.$txtHolderSearch = thiss.$widget.find('#txtHolderSearch');
                                    this.$btnSearch = thiss.$widget.find('#btnSearch');
                                    this.$btnClean = thiss.$widget.find('#btnClean');
                                    this.$table = thiss.$widget.find('#tblResult');
                                    this.$divServicesOverlaps = thiss.$widget.find("#divServicesOverlaps");
                                    thiss.htmlServices = "";
                                    thiss.writeServicesOverlaps();
                                    thiss.$divServicesOverlaps.append(thiss.htmlServices);
                                    thiss.$divServicesOverlaps.find('>ul').tree({
                                        checkChildren: true,
                                        singleBranchOpen: false,
                                        initialState: "collapse",
                                        expandOnCheck: true,
                                        collapseOnUnCheck: true
                                    });
                                    thiss.$divServicesOverlaps.find('>ul').css({
                                        "height": "auto",
                                        "width": "300",
                                        "color": "black"
                                    });
                                    thiss.$divServicesOverlaps.find('>ul.dropdown-menu').on('click', function (e) {
                                        e.stopPropagation();
                                    });
                                    thiss.$btnSearch.off("click");
                                    thiss.$btnSearch.on("click", function (e) {
                                        thiss.search();
                                    });
                                    thiss.$btnClean.off("click");
                                    thiss.$btnClean.on("click", function () {
                                        thiss.cleanData();
                                        thiss.resetContainers(false);
                                    });
                                };
                                BaseWidget.prototype.form = function (url, id, options) {
                                    var thiss = this;
                                    if (thiss.getServicesOverlaps().length === 0) {
                                        toastr.info("Seleccione las capas a superponer");
                                        return;
                                    } else if (thiss.getServicesOverlaps().length > 10) {
                                        toastr.info("Seleccionar máximo 10 capas a consultar");
                                        return;
                                    }
                                    options = options || {};
                                    options.title = "Detalle de predios superficiales";
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_list.html?' + Math.random();
                                    _super.prototype.form.call(this, url, id, options);
                                }
                                BaseWidget.prototype.detail = function (dom, id) {
                                    var thiss = this;
                                    thiss.selectFeature(id);
                                    thiss.searchOverlaps(dom, id);
                                    thiss.detailCustom(dom, id);
                                };
                                BaseWidget.prototype.search = function () {
                                    var thiss = this;
                                    thiss.resetContainers(false);
                                    thiss.searchOnService();
                                };
                                BaseWidget.prototype.parameters = function () {
                                    var thiss = this;
                                    var sql = "";
                                    sql += "NUM_PREDIO LIKE '" + thiss.$txtNumberOrCodeSearch.val().toUpperCase() + "%'";
                                    sql += " AND PREDIO LIKE '%" + thiss.$txtNameSearch.val().toUpperCase() + "%'";
                                    sql += " AND NOMBRE LIKE '%" + thiss.$txtHolderSearch.val().toUpperCase() + "%'";
                                    return sql;
                                };
                                BaseWidget.prototype.searchOnService = function (options) {
                                };
                                BaseWidget.prototype.searchOverlaps = function (dom, id) {
                                };
                                BaseWidget.prototype.detailCustom = function (dom, id) {
                                    var thiss = this;
                                    if (id === undefined || id === 0) return;
                                    var $divDetail = jQuery(dom.contentDocument).find("#divDetail");
                                    var $tblResultCoordinates = jQuery(dom.contentDocument).find("#tblResultCoordinates");
                                    var options = {
                                        data: { id: id }
                                    };
                                    console.log("detalle");
                                    /*thiss.detailConfig(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/detail", options, function (data) {
                                        var item = data.item;
                                        writeDetail(item);
                                        writeCoordinates(item.coordinates);
                                        function writeDetail(item) {
                                            if (item === undefined || item === null) return;
                                            $divDetail.find('#divCode>span').append(item.code);
                                            $divDetail.find('#divName>span').append(item.name);
                                            $divDetail.find('#divProcurementDate>span').append(item.procurementDate);
                                            $divDetail.find('#divAreaTitle>span').append(item.areaTitle.toFixed(thiss.config.number.decimalCount));
                                        }
                                        function writeCoordinates(items) {
                                            if (items === undefined || items === null || !(items instanceof Array)) return;
                                            var html = '';
                                            jQuery.each(items, function (i, item) {
                                                items[i].vertex = i;
                                                html += '<tr>';
                                                html += '<td class="text-right">' + (items[i].vertex + 1) + '</td>';
                                                html += '<td class="text-right">' + item.x.toFixed(thiss.config.number.decimalCount) + '</td>';
                                                html += '<td class="text-right">' + item.y.toFixed(thiss.config.number.decimalCount) + '</td>';
                                                html += '</tr>';
                                            });
                                            $tblResultCoordinates.find('>tbody').html(html);
                                            $tblResultCoordinates.find('>tfoot>tr>th>span').html($tblResultCoordinates.find('>tbody>tr').length);
                                        }
                                    });*/
                                };
                                BaseWidget.prototype.removeOverlaps = function () {
                                };
                                BaseWidget.prototype.cleanControls = function () {
                                    var thiss = this;
                                    thiss.cleanData();
                                };
                                BaseWidget.prototype.resetContainers = function (toNull) {
                                    var thiss = this;
                                    if (thiss.$table !== null)
                                        thiss.$table.empty();
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            surfacepropertynational.BaseWidget = BaseWidget;
                        })(custom.surfacepropertynational || (custom.surfacepropertynational = {}));
                        var surfacepropertynational = custom.surfacepropertynational;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));