(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (miningcadaster) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$txtCodeSearch = null;
                                    this.$txtNameSearch = null;
                                    this.$txtHolderSearch = null;
                                    this.$btnSearch = null;
                                    this.$btnClean = null;
                                    this.$div = null;
                                    this.$divServicesOverlaps = null;
                                    this.code = null;
                                    this.infoWindowShow = null;
                                    this.cleanData = function () {
                                        var thiss = this;
                                        if (thiss.$txtHolderSearch !== null)
                                            thiss.$txtHolderSearch.val('');
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
                                    this.fillData = function (response) {
                                        var thiss = this;
                                        thiss.config.module.widget.service.excludeFields.push("FECHA FORMULACIÓN", "HORA FORMULACIÓN");
                                        thiss.writeResultDefault(response, {
                                            joinField: thiss.config.module.widget.service.joinField,
                                            excludeFields: thiss.config.module.widget.service.excludeFields,
                                            defaultFields: thiss.config.module.widget.service.defaultFields
                                        });
                                        jQuery('.contentPane').off("click", ".btnDetailReport");
                                        jQuery('.contentPane').on("click", ".btnDetailReport", function (e) {
                                            thiss.getDetailReport(this.id);
                                        });
                                        jQuery('.contentPane').off("click", ".btnPayReport");
                                        jQuery('.contentPane').on("click", ".btnPayReport", function (e) {
                                            thiss.getPayReport(this.id);
                                        });
                                        jQuery('.contentPane').off("click", ".btnRecord");
                                        jQuery('.contentPane').on("click", ".btnRecord", function (e) {
                                            thiss.getRecord(this.id);
                                        });
                                        jQuery('.contentPane').off("click", ".btnRecordFull");
                                        jQuery('.contentPane').on("click", ".btnRecordFull", function (e) {
                                            thiss.getRecordFull(this.id);
                                        });
                                    };
                                    this.getParametersUrl = function (options) {
                                        var thiss = this;
                                        options = options || {};
                                        return {
                                            p_p_id: "igmbusquedaderechos_WAR_igmsidemcatportlet",
                                            p_p_lifecycle: "2",
                                            p_p_state: "normal",
                                            p_p_mode: "view",
                                            p_p_resource_id: "crud",
                                            p_p_cacheability: "cacheLevelPage",
                                            p_p_col_id: "column-all",
                                            p_p_col_pos: "3",
                                            p_p_col_count: "4",
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_codigo: options.code,
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_tipo: "GET_DETALLE",
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_tipoDoc: "1",
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_opcion: "1",
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_texto: "",
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_departamento: '',
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_provincia: null,
                                            _igmbusquedaderechos_WAR_igmsidemcatportlet_distrito: null
                                        };
                                    };
                                    this.getRecordFull = function (obj) {
                                        var thiss = this;
                                        thiss.code = obj.replace("btn", "");
                                        var recordCode = null;
                                        var countPages = 0;
                                        getData();
                                        thiss.$div = $("<div></div>").appendTo(thiss.$widget);
                                        thiss.$div.dialog({
                                            title: 'Expediente completo (' + thiss.code + ')',
                                            fluid: true,
                                            height: '600',
                                            width: '800',
                                            resizable: false,
                                            closeOnEscape: true,
                                            autoOpen: true,
                                            modal: true,
                                            autoremove: true
                                        });
                                        function getData() {
                                            jQuery.ajaxSetup({ async: false });
                                            jQuery.post(thiss.config.proxy + thiss.config.module.widget.urlRecordCode, thiss.getParametersUrl({ code: thiss.code }), function (data, textStatus) {
                                                recordCode = data.cod_expediente;
                                                countPages = data.max_page;
                                            }, "json");
                                            jQuery.ajaxSetup({ async: true });
                                        }
                                        function getUrl() {
                                            return (thiss.config.module.widget.urlRecordFull.replace("{0}", recordCode));
                                        }
                                        thiss.$div.append('<iframe width="100%" height="100%" src="' + getUrl() + '"></iframe></div>');
                                    };
                                    this.getRecord = function (obj) {
                                        var thiss = this;
                                        thiss.code = obj.replace("btn", "");
                                        var recordCode = null;
                                        var countPages = 0;
                                        thiss.$div = $("<div></div>").appendTo(thiss.$widget);
                                        thiss.$div.dialog({
                                            title: 'Visor Expediente (' + thiss.code + ')',
                                            fluid: true,
                                            height: '600',
                                            width: '800',
                                            resizable: false,
                                            autoremove: false,
                                            closable: true,
                                            modal: true,
                                            autoOpen: true
                                        });
                                        getData();
                                        domNavigation(countPages);
                                        function getData() {
                                            jQuery.ajaxSetup({ async: false });
                                            jQuery.post(thiss.config.proxy + thiss.config.module.widget.urlRecordCode, thiss.getParametersUrl({ code: thiss.code }), function (data, textStatus) {
                                                recordCode = data.cod_expediente;
                                                countPages = data.max_page;
                                            }, "json");
                                            jQuery.ajaxSetup({ async: true });
                                        }
                                        function domNavigation(items) {
                                            thiss.$div.append('<div class="centro"><button type="button" id="btnFirst">&laquo;</button><button type="button" id="btnPrevious">Anterior</button><select id="ddlRecord" name="ddlRecord"></select><button type="button" id="btnNext">Siguiente</button><button type="button" id="btnLast">&raquo;</button></div><img widht="100%" height="100%" src="" id="imgRecord" />');
                                            var $ddl = thiss.$div.find('#ddlRecord');
                                            var $btnFirst = thiss.$div.find('#btnFirst');
                                            var $btnLast = thiss.$div.find('#btnLast');
                                            var $btnPrevious = thiss.$div.find('#btnPrevious');
                                            var $btnNext = thiss.$div.find('#btnNext');
                                            var html = '';
                                            for (var i = 0; i < items; i++)
                                                html += '<option name="' + (i + 1) + '" value="' + (i + 1) + '">' + (i + 1) + '</option>';
                                            $ddl.html(html);
                                            $ddl.off('change');
                                            $ddl.on('change', function (e) {
                                                e.preventDefault();
                                                show(jQuery(this).val());
                                            });
                                            $ddl.trigger('change');
                                            $btnFirst.off('click');
                                            $btnFirst.on('click', function (e) {
                                                e.preventDefault();
                                                id = $ddl.find("option:first-child").val();
                                                $ddl.val(id).attr('selected', true);
                                                show(id);
                                            });
                                            $btnLast.off('click');
                                            $btnLast.on('click', function (e) {
                                                e.preventDefault();
                                                id = $ddl.find("option:last-child").val();
                                                $ddl.val(id).attr('selected', true);
                                                show(id);
                                            });
                                            $btnPrevious.off('click');
                                            $btnPrevious.on('click', function (e) {
                                                e.preventDefault();
                                                index = $ddl.find("option:selected").index();
                                                $ddl.find('option:eq(' + index + ')').removeAttr('selected');
                                                index = index - 1;
                                                if (index >= 0) {
                                                    $ddl.find('option:eq(' + index + ')').attr('selected', true);
                                                    id = $ddl.find('option:eq(' + index + ')').val();
                                                    show(id);
                                                }
                                            });
                                            $btnNext.off('click');
                                            $btnNext.on('click', function (e) {
                                                e.preventDefault();
                                                index = $ddl.find("option:selected").index();
                                                $ddl.find('option:eq(' + index + ')').removeAttr('selected');
                                                index = index + 1;
                                                indexUltimo = $ddl.find(":last-child").index();
                                                if (index <= indexUltimo) {
                                                    $ddl.find('option:eq(' + index + ')').attr('selected', true);
                                                    id = $ddl.find('option:eq(' + index + ')').val();
                                                    show(id);
                                                }
                                            });
                                            function show(id) {
                                                thiss.$div.find('#imgRecord').attr("src", "");
                                                if (id === 0) return;
                                                thiss.$div.find('#imgRecord').attr("src", getUrl());
                                                function getUrl() {
                                                    return (thiss.config.module.widget.urlRecordImage.replace("{0}", recordCode).replace("{1}", id));
                                                }
                                            }
                                        }
                                        //jQuery('#btnImprimirImagen').click(function (e) {
                                        //    var inicio = +jQuery('#ddlImagenDe').find(':selected').text();
                                        //    var final = +jQuery('#ddlImagenAl').find(':selected').text();
                                        //    if (inicio > final) {
                                        //        alert("Rango establecido para la impresión es inválido.");
                                        //        return;
                                        //    }
                                        //    else {
                                        //        var html = '', idTexto, id;
                                        //        idTexto = id = 0;
                                        //        jQuery('#ddlImagen').find('option').each(function (i, item) {
                                        //            idTexto = +jQuery(this).text();
                                        //            if (idTexto >= inicio && idTexto <= final) {
                                        //                id = +jQuery(this).val();
                                        //                html += "<img id='imgImagenImprimir" + i + "' class='centro' src='" + baseUrl + "documento/documento/visor?id=" + id + " ' width='100%' />";
                                        //            }
                                        //        });
                                        //        jQuery('#divImagenImprimir').html(html);
                                        //        var codigo = jQuery('#tab1 #txtCodigo').val();
                                        //        var nombre = jQuery('#tab1 #txtNombre').val();
                                        //        var titulo = codigo + " - " + nombre;
                                        //        imprimir('divImagenImprimir', titulo);
                                        //    }
                                        //});
                                        //function imprimir(divContenedor, titulo) {
                                        //    var ventana = window.open("", "", "location=0,menubar=0,status=0,scrollbars=0");
                                        //    var contenido = '';
                                        //    contenido += "<html><span> " + titulo + "</span><body onload='window.print();window.close();'>" + document.getElementById(divContenedor).innerHTML + "</body></html>";
                                        //    ventana.document.write('<title>Impresion de expedientes</title>');
                                        //    ventana.document.write(contenido);
                                        //    ventana.document.close();
                                        //}
                                    };
                                    this.getDetailReport = function (obj) {
                                        var thiss = this;
                                        thiss.code = obj.replace("btn", "");
                                        thiss.$div = $("<div></div>").appendTo(thiss.$widget);
                                        thiss.$div.dialog({
                                            title: 'Detalle (' + thiss.code + ')',
                                            fluid: true,
                                            height: '600',
                                            width: '800',
                                            resizable: false,
                                            closeOnEscape: true,
                                            autoOpen: true,
                                            modal: true,
                                            autoremove: true
                                        });
                                        function getUrl() {
                                            return (thiss.config.module.widget.urlDetailReport.replace("{0}", thiss.code));
                                        }
                                        thiss.$div.append('<iframe width="100%" height="100%" src="' + getUrl() + '"></iframe></div>');
                                    };
                                    this.getPayReport = function (obj) {
                                        var thiss = this;
                                        thiss.code = obj.replace("btn", "");
                                        thiss.$div = $("<div></div>").appendTo(thiss.$widget);
                                        thiss.$div.dialog({
                                            title: 'Pagos (' + thiss.code + ')',
                                            fluid: true,
                                            height: '600',
                                            width: '800',
                                            resizable: false,
                                            closeOnEscape: true,
                                            autoOpen: true,
                                            modal: true,
                                            autoremove: true
                                        });
                                        function getUrl() {
                                            return (thiss.config.module.widget.urlPayReport.replace("{0}", thiss.code));
                                        }
                                        thiss.$div.append('<iframe width="100%" height="100%" src="' + getUrl() + '"></iframe></div>');
                                    };
                                }
                                BaseWidget.prototype.initConfig = function () {
                                    var thiss = this;
                                    _super.prototype.initConfig.call(this);
                                    thiss.setServicesOverlaps();
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    this.$txtHolderSearch = thiss.$widget.find('#txtNameHolderSearch');
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
                                    options.title = "Detalle de catastro minero";
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_list.html?' + Math.random();
                                    _super.prototype.form.call(this, url, id, options);
                                };
                                BaseWidget.prototype.detail = function (dom, id) {
                                    var thiss = this;
                                    thiss.selectFeature(id);
                                    thiss.searchOverlaps(dom, id);
                                };
                                BaseWidget.prototype.search = function () {
                                    var thiss = this;
                                    thiss.searchOnService();
                                };
                                BaseWidget.prototype.searchOnService = function () {
                                };
                                BaseWidget.prototype.parameters = function () {
                                    var thiss = this;
                                    var sql = "";
                                    sql += "CODIGOU LIKE '" + thiss.$txtCodeSearch.val().toUpperCase() + "%'";
                                    sql += " AND CONCESION LIKE '%" + thiss.$txtNameSearch.val().toUpperCase() + "%'";
                                    sql += " AND TIT_CONCES LIKE '%" + thiss.$txtHolderSearch.val().toUpperCase() + "%'";
                                    return sql;
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
                            miningcadaster.BaseWidget = BaseWidget;
                        })(custom.miningcadaster || (custom.miningcadaster = {}));
                        var miningcadaster = custom.miningcadaster;
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