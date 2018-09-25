(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (miningproject) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$txtCodeSearch = null;
                                    this.$txtNameSearch = null;
                                    this.$btnSearch = null;
                                    this.$btnClean = null;
                                    this.$divServicesOverlaps = null;
                                    this.infoWindowShow = null;
                                    this.htmlServices = null;
                                    this.cleanData = function () {
                                        var thiss = this;
                                        if (thiss.$txtCodeSearch !== null)
                                            thiss.$txtCodeSearch.val('');
                                        if (thiss.$txtNameSearch !== null)
                                            thiss.$txtNameSearch.val('');
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
                                        thiss.writeResultDefault(response, {
                                            joinField: thiss.config.module.widget.service.joinField,
                                            excludeFields: thiss.config.module.widget.service.excludeFields,
                                            defaultFields: thiss.config.module.widget.service.defaultFields,
                                            report: thiss.config.module.widget.service.report
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
                                    this.reportPdfs = function (dom, id) {
                                        var thiss = this;
                                        if (id === undefined || id === 0) return;
                                        var $divDetail = jQuery(dom.contentDocument).find("#divDetail");
                                        var $divDetailPdf = jQuery(dom.contentDocument).find("#divDetailPdf");
                                        var $tblResultCoordinates = jQuery(dom.contentDocument).find("#tblResultCoordinates");
                                        var options = {
                                            data: { id: id }
                                        };
                                        thiss.detailConfig(com.jtm.Server.contextPath + "miningproject/miningproject/detail", options, function (data) {
                                            var item = data.item;
                                            console.log(item);
                                            console.log(data);
                                            writeDetail(item);
                                            writeCoordinates(item.coordinates);
                                            function writeDetail(item) {
                                                if (item === undefined || item === null) return;
                                                $divDetail.find('#divCode>span').append(item.code);
                                                $divDetail.find('#divName>span').append(item.name);
                                                $divDetail.find('#divDepositType>span').append(item.depositType.name);
                                                $divDetail.find('#divDepositOrigin>span').append(item.depositOrigin.name);
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
                                            if ($divDetailPdf.length > 0) {
                                                if (item === undefined || item === null) return;
                                                var $img = jQuery(dom.contentDocument).find("#img");
                                                var $tblDetailDocument = jQuery(dom.contentDocument).find("#tblDetailDocument");
                                                var $tblDetailAlert = jQuery(dom.contentDocument).find("#tblDetailAlert");
                                                //var $btnPdf2 = jQuery(dom.contentDocument).find("#btnPdf2");
                                                var $body = jQuery(dom.contentDocument).find("#divPdf");
                                                $divDetailPdf.find('#divCode').html(item.code);
                                                $divDetailPdf.find('#divName').html(item.name);
                                                $divDetailPdf.find('#divDepositType').html(item.depositType.name);
                                                $divDetailPdf.find('#divDepositOrigin').html(item.depositOrigin.name);
                                                thiss.html2Canvas(thiss.$map, $img);
                                                writeDocuments();
                                                writeAlerts();
                                                function writeDocuments() {
                                                    thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/searchDocumentsByMiningProject", options, function (data) {
                                                        console.log(data);
                                                        if (data.length == 0 || data === undefined) {
                                                            $tblDetailDocument.find('>tbody').append('<tr><td colspan=3>No hay Datos</td></tr>');
                                                        } else {
                                                            var html = "";
                                                            data.forEach(function (item2, i) {
                                                                html += '<tr data-uniqueid="' + item2.id + '">';
                                                                html += '<td>' + (i + 1) + '</td>';
                                                                html += '<td>' + item2.name + '</td>';
                                                                html += '<td>' + item2.registrationDate + '</td>';
                                                                html += '</tr>';
                                                            });
                                                            $tblDetailDocument.find('>tbody').append(html);
                                                        }
                                                    });
                                                };
                                                function writeAlerts() {
                                                    var options = {
                                                        data: { id: id }
                                                    };
                                                    thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/searchAlerts", options, function (data) {
                                                        console.log(data);
                                                        if (data.length == 0 || data === undefined) {
                                                            $tblDetailAlert.find('>tbody').append('<tr><td colspan=6>No hay Datos</td></tr>');
                                                        } else {
                                                            var html = "";
                                                            data.forEach(function (item3, i) {
                                                                html += '<tr data-uniqueid="' + item3.id + '">';
                                                                html += '<td>' + (i + 1) + '</td>';
                                                                html += item3.name == null || item3.name == "" ? '<td>Sin Nombre</td>' : '<td>' + item3.name + '</td>';
                                                                html += item3.description == null || item3.description == "" ? '<td>Sin Descripción</td>' : '<td>' + item3.description + '</td>';;
                                                                html += '<td>' + item3.ruleTypeId + '</td>';
                                                                html += '<td>' + item3.startDate + '</td>';
                                                                html += '<td>' + item3.endDate + '</td>';
                                                                html += '</tr>';
                                                            });
                                                            $tblDetailAlert.find('>tbody').append(html);
                                                        }
                                                    });
                                                };
                                            }
                                        });
                                    };
                                };
                                BaseWidget.prototype.initConfig = function () {
                                    var thiss = this;
                                    _super.prototype.initConfig.call(this);
                                    thiss.config.module.widget.service.url = thiss.config.module.widget.service.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.service.url : thiss.config.module.widget.service.url;
                                    thiss.setServicesOverlaps();
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    this.$txtCodeSearch = thiss.$widget.find('#txtCodeSearch');
                                    this.$txtNameSearch = thiss.$widget.find('#txtNameSearch');
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
                                    options.title = "Detalle de proyecto minero";
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_list.html?' + Math.random();
                                    _super.prototype.form.call(this, url, id, options);
                                };
                                BaseWidget.prototype.pdf = function (url, id, options) {
                                    var thiss = this;
                                    options = options || {};
                                    options.title = "Detalle de proyecto minero";
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_pdf.html?' + Math.random();
                                    _super.prototype.pdf.call(this, url, id, options);
                                };
                                BaseWidget.prototype.detail = function (dom, id) {
                                    var thiss = this;
                                    thiss.selectFeature(id);
                                    thiss.searchOverlaps(dom, id);
                                    thiss.detailCustom(dom, id);
                                };
                                BaseWidget.prototype.search = function () {
                                    var thiss = this;
                                    thiss.resetContainers(false);
                                    var options = {};
                                    options.data = thiss.parameters();
                                    options.validate = function () { return true; };
                                    thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/search", options, function (items) {
                                        if (items.length === 0) {
                                            toastr.info("No hay resultados de su base de datos");
                                            return;
                                        }
                                        var ids = items.map(function (item) {
                                            return item.id;
                                        });
                                        var options = {
                                            ids: ids.join()
                                        };
                                        thiss.searchOnService(options);
                                    });
                                };
                                BaseWidget.prototype.parameters = function () {
                                    var thiss = this;
                                    var item = {
                                        code: thiss.$txtCodeSearch.val(),
                                        name: thiss.$txtNameSearch.val()
                                    };
                                    item.district = {
                                        id: "0",
                                        province: {
                                            id: "0",
                                            department: { id: "0" }
                                        }
                                    };
                                    //valores por defecto
                                    item.nationalCartography = { id: 0 };
                                    item.hydrographicbasin = { id: 0 };
                                    item.spatialReference = { id: 0 };
                                    item.state = false;
                                    item.stageOperation = { id: 0 };
                                    item.category = { id: 0 };
                                    item.depositType = { id: 0 };
                                    item.miningUnit = { id: 0 };
                                    return item;
                                };
                                BaseWidget.prototype.searchOnService = function (options) {
                                };
                                BaseWidget.prototype.searchOverlaps = function (dom, id) {
                                };
                                BaseWidget.prototype.reportPdf = function (dom, id, featureId) {
                                    var thiss = this;
                                    thiss.selectFeature(featureId);
                                    thiss.reportPdfs(dom, id);
                                };
                                BaseWidget.prototype.detailCustom = function (dom, id) {
                                    var thiss = this;
                                    if (id === undefined || id === 0) return;
                                    var $divDetail = jQuery(dom.contentDocument).find("#divDetail");
                                    var $divDetailPdf = jQuery(dom.contentDocument).find("#divDetailPdf");
                                    var $tblResultCoordinates = jQuery(dom.contentDocument).find("#tblResultCoordinates");
                                    var options = {
                                        data: { id: id }
                                    };
                                    thiss.detailConfig(com.jtm.Server.contextPath + "miningproject/miningproject/detail", options, function (data) {
                                        var item = data.item;
                                        console.log(item);
                                        console.log(data);
                                        writeDetail(item);
                                        writeCoordinates(item.coordinates);
                                        function writeDetail(item) {
                                            if (item === undefined || item === null) return;
                                            $divDetail.find('#divCode>span').append(item.code);
                                            $divDetail.find('#divName>span').append(item.name);
                                            $divDetail.find('#divDepositType>span').append(item.depositType.name);
                                            $divDetail.find('#divDepositOrigin>span').append(item.depositOrigin.name);
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
                                        if ($divDetailPdf.length > 0) {
                                            if (item === undefined || item === null) return;
                                            var $img = jQuery(dom.contentDocument).find("#img");
                                            var $tblDetailDocument = jQuery(dom.contentDocument).find("#tblDetailDocument");
                                            var $tblDetailAlert = jQuery(dom.contentDocument).find("#tblDetailAlert");
                                            //var $btnPdf2 = jQuery(dom.contentDocument).find("#btnPdf2");
                                            var $body = jQuery(dom.contentDocument).find("#divPdf");
                                            $divDetailPdf.find('#divCode').html(item.code);
                                            $divDetailPdf.find('#divName').html(item.name);
                                            $divDetailPdf.find('#divDepositType').html(item.depositType.name);
                                            $divDetailPdf.find('#divDepositOrigin').html(item.depositOrigin.name);
                                            thiss.html2Canvas(thiss.$map, $img);
                                            writeDocuments();
                                            writeAlerts();
                                            function writeDocuments() {
                                                thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/searchDocumentsByMiningProject", options, function (data) {
                                                    console.log(data);
                                                    if (data.length == 0 || data === undefined) {
                                                        $tblDetailDocument.find('>tbody').append('<tr><td colspan=3>No hay Datos</td></tr>');
                                                    } else {
                                                        var html = "";
                                                        data.forEach(function (item2, i) {
                                                            html += '<tr data-uniqueid="' + item2.id + '">';
                                                            html += '<td>' + (i + 1) + '</td>';
                                                            html += '<td>' + item2.name + '</td>';
                                                            html += '<td>' + item2.registrationDate + '</td>';
                                                            html += '</tr>';
                                                        });
                                                        $tblDetailDocument.find('>tbody').append(html);
                                                    }
                                                });
                                            };
                                            function writeAlerts() {
                                                var options = {
                                                    data: { id: id }
                                                };
                                                thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/searchAlerts", options, function (data) {
                                                    console.log(data);
                                                    if (data.length == 0 || data === undefined) {
                                                        $tblDetailAlert.find('>tbody').append('<tr><td colspan=6>No hay Datos</td></tr>');
                                                    } else {
                                                        var html = "";
                                                        data.forEach(function (item3, i) {
                                                            html += '<tr data-uniqueid="' + item3.id + '">';
                                                            html += '<td>' + (i + 1) + '</td>';
                                                            html += item3.name == null || item3.name == "" ? '<td>Sin Nombre</td>' : '<td>' + item3.name + '</td>';
                                                            html += item3.description == null || item3.description == "" ? '<td>Sin Descripción</td>' : '<td>' + item3.description + '</td>';;
                                                            html += '<td>' + item3.ruleTypeId + '</td>';
                                                            html += '<td>' + item3.startDate + '</td>';
                                                            html += '<td>' + item3.endDate + '</td>';
                                                            html += '</tr>';
                                                        });
                                                        $tblDetailAlert.find('>tbody').append(html);
                                                    }
                                                });
                                            };

                                            // $btnPdf2.off("click");
                                            // $btnPdf2.on("click", function (e) {
                                            // console.log("click");
                                            //$btnPdf2.hide();
                                            //$title.hide();
                                            /* html2canvas($($body), {
                                                 onrendered: function (canvas) {
                                                     //var imgData = canvas.toDataURL(
                                                     //    'image/png');
                                                     var doc = new jsPDF('l', 'pt', [850,612]);
                                                     console.log($($body).height());
                                                     console.log($body.height());
                                                     for (var i = 0; i <= ($body.height() / 980); i++) {
                                                         var srcImg = canvas;
                                                         var sX = 0;
                                                         var sY = 980 * i; // empieza 980 con pixels  por cada  nueva pagina
                                                         var sWidth = 1263;
                                                         var sHeight = 980;
                                                         var dX = 0;
                                                         var dY = 0;
                                                         var dWidth = 1263;
                                                         var dHeight = 980;

                                                         window.onePageCanvas = document.createElement("canvas");
                                                         console.log(onePageCanvas.length);
                                                         onePageCanvas.setAttribute('width', 1263);
                                                         onePageCanvas.setAttribute('height', 980);
                                                         var ctx = onePageCanvas.getContext('2d');
                                                         ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                                                         var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
                                                         var width = onePageCanvas.width;
                                                         var height = onePageCanvas.clientHeight;

                                                         //crea cada pagina
                                                         if (i > 0) {
                                                             doc.text(20, 20, 'Reporte generado por Sigemin.');
                                                             doc.addPage(850, 612); //8.5" x 11" in pts (in*72)
                                                         }
                                                         doc.setPage(i + 1);
                                                         doc.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62));
                                                     }
                                                     //doc.addImage(imgData, 'PNG', 10, 10);
                                                     //doc.text(20, 20, 'Reporte generado por Sigemin.');
                                                     var d = new Date().toISOString().slice(0, 19).replace(/-/g, "");
                                                     doc.save('Reporte_' + d + '.pdf');
                                                     $btnPdf2.show();
                                                     //$title.show();
                                                 }
                                             });*/
                                            //thiss.writeOverlapsToPrint(id);
                                            //});
                                        }
                                    });
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
                            miningproject.BaseWidget = BaseWidget;
                        })(custom.miningproject || (custom.miningproject = {}));
                        var miningproject = custom.miningproject;
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