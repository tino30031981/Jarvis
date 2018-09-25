/*jshint sub:true*/
var com;
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            var BaseMain = (function (_super) {
                __extends(BaseMain, _super);
                function BaseMain() {
                    _super.call(this);
                    this.saveRecordFromCloud = function () {
                        var thiss = this;
                        if (jQuery('#chkInline').is(":checked") === false) {
                            alert("Esta opción no está disponible para modo local");
                            return;
                        }
                        if (thiss.config.module.recordTotalPages === 0) {
                            alert("No hay expedientes para guardar en la base de datos local");
                            return;
                        }
                        var r = confirm("¡Este proceso puede demorar mucho tiempo! ¿Desea continuar?");
                        if (r === false) return;
                        var item = {
                            id: thiss.$hdnId.int32(),
                            totalPages: thiss.config.module.recordTotalPages.max_page,
                            urlRecordPage: thiss.config.module.ingemmet.urls.recordImage2
                        };
                        var options = {
                            isJson: false,
                            data: item,
                            validate: validate
                        };
                        console.log(options);

                        this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/saverecordfromcloud', options, function () {
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$hdnId.int32() === 0) {
                                success = false;
                                message = BaseMain.NEWELEMENTID;
                            }
                            if (thiss.config.module.recordTotalPages === 0) {
                                success = false;
                                message = 'No hay expedientes disponibles';
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    this.buildUrlIngemmet = function (options) {
                        options = options || {};
                        options.type = options.type || "GET_DETALLE";
                        options.option = options.option || 1;
                        return {
                            p_p_id: "igmbusquedaderechos_WAR_igmsidemcatportlet",
                            p_p_lifecycle: "2",
                            p_p_state: "normal",
                            p_p_mode: "view",
                            p_p_resource_id: options.resource,
                            p_p_cacheability: "cacheLevelPage",
                            p_p_col_id: "column-all",
                            p_p_col_pos: "3",
                            p_p_col_count: "4",
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_codigo: options.code,
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_tipo: options.type,/*GET_DETALLE,GET_DETALLE_CUADERNO,1,2,3*/
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_tipoDoc: "1",
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_opcion: options.option,/*1,2,3,4*/
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_texto: "",
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_departamento: '',
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_provincia: null,
                            _igmbusquedaderechos_WAR_igmsidemcatportlet_distrito: null
                        };
                    };
                    this.searchRecords = function (id, inline) {
                        var thiss = this;
                        thiss.config.module.recordTotalPages = 0;
                        var options = {};
                        options.isJson = false;
                        options.data = (inline === true) ? thiss.buildUrlIngemmet({ resource: "crud", code: id }) : { id: id };
                        var url = (inline === true) ? thiss.config.module.ingemmet.urls.sidemcat : com.jtm.Server.contextPath + "miningconcession/miningconcession/searchrecord";
                        thiss.searchConfig(url, options, function (data) {
                            if (inline === true) {
                                console.log(data);
                                thiss.config.module.ingemmet.urls.recordImage2 = thiss.config.module.ingemmet.urls.recordImage.replace("{0}", data.cod_expediente);
                                thiss.config.module.ingemmet.urls.recordRange2 = thiss.config.module.ingemmet.urls.recordRange.replace("{0}", data.cod_expediente);
                                thiss.config.module.recordTotalPages = data;
                            }
                            else {
                                if (data.length === 0) {
                                    alert("Aún no se ha cargado los expedientes");
                                }
                                else {
                                    thiss.config.module.ingemmet.urls.recordImage2 = com.jtm.Server.contextPath + "documentlibrary/document/viewer?id={1}&miningconcessionid={2}";
                                    thiss.config.module.ingemmet.urls.recordRange2 = com.jtm.Server.contextPath + "documentlibrary/document/searchbyrange?startpage={1}&endpage={2}&format=pdf&merge=true";
                                    thiss.config.module.recordTotalPages = data;
                                }
                            }
                            thiss.fillRecordPages(thiss.config.module.recordTotalPages);
                            thiss.navigationRecordHandler();
                            thiss.rangeRecordHandler();
                        });
                    };
                    this.getImageRecord = function (id) {
                        return (this.config.module.ingemmet.urls.recordImage2.replace("{1}", id));
                    };
                    this.fillRecordPages = function (items) {
                        var thiss = this;
                        var count = items.max_page == undefined ? items.length : items.max_page;
                        var $ddl = $('#ddlPage');
                        var $ddlStart = $('#ddlStartPage');
                        var $ddlEnd = $('#ddlEndPage');
                        $ddl.empty();
                        $ddlStart.empty();
                        $ddlEnd.empty();
                        for (var i = 0; i < count ; i++) {
                            value = items.max_page == undefined ? items[i].id : (1 + i);
                            $ddl.append('<option name="' + (i + 1) + '" value="' + value + '">Página ' + (i + 1) + '</option>');
                            $ddlStart.append('<option name="' + (i + 1) + '" value="' + value + '">Pág. ' + (i + 1) + '</option>');
                            $ddlEnd.append('<option name="' + (i + 1) + '" value="' + value + '">Pág. ' + (i + 1) + '</option>');
                        }
                    };
                    this.navigationRecordHandler = function () {
                        var thiss = this;
                        var $ddl = $('#ddlPage');
                        var $img = $('#imgRecord');
                        $img.off("load");
                        $img.on("load", function (e) {
                            thiss.loadingHide();
                        });
                        $img.off("error");
                        $img.on("error", function (e) {
                            jQuery(this).attr("alt", "No se pudo cargar el expediente o no existe el mismo");
                            thiss.loadingHide();
                        });
                        $ddl.off("change");
                        $ddl.on("change", function (e) {
                            thiss.loadingShow();
                            jQuery('#imgRecord').attr("src", "");
                            if (jQuery(this).int32() === 0) return;
                            jQuery('#imgRecord').attr("alt", "Página: " + jQuery(this).int32());
                            jQuery('#imgRecord').attr("src", thiss.getImageRecord(jQuery(this).int32()));
                        });
                        jQuery('#btnFirst').off("click");
                        jQuery('#btnFirst').on("click", function (e) {
                            $ddl.val($ddl.find("option:first-child").val()).attr('selected', true);
                            $ddl.trigger("change");
                        });
                        jQuery('#btnLast').off("click");
                        jQuery('#btnLast').on("click", function (e) {
                            $ddl.val($ddl.find("option:last-child").val()).attr('selected', true);
                            $ddl.trigger("change");
                        });
                        jQuery('#btnPrevious').off("click");
                        jQuery('#btnPrevious').on("click", function (e) {
                            var index = $ddl.find(":selected").index() - 1;
                            if (index >= 0) {
                                $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                $ddl.trigger("change");
                            }
                        });
                        jQuery('#btnNext').off("click");
                        jQuery('#btnNext').on("click", function (e) {
                            var index = $ddl.find(":selected").index() + 1;
                            var lastIndex = $ddl.find(":last-child").index();
                            if (index <= lastIndex) {
                                $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                $ddl.trigger("change");
                            }
                        });
                        $ddl.trigger("change");
                    };
                    this.rangeRecordHandler = function () {
                        var thiss = this;
                        var $ddlStart = $('#ddlStartPage');
                        var $ddlEnd = $('#ddlEndPage');
                        $ddlStart.on("change", function (e) {
                            var id = jQuery(this).int32();
                            if (id > $ddlEnd.int32())
                                jQuery(this).val($ddlEnd.val());
                        });
                        $ddlEnd.on("change", function (e) {
                            var id = jQuery(this).int32();
                            if (id < $ddlStart.int32())
                                jQuery(this).val($ddlStart.val());
                        });
                        $ddlStart.val($ddlStart.find("option:first-child").val());
                        $ddlEnd.val($ddlEnd.find("option:last-child").val());
                        $ddlStart.trigger("change");
                        $ddlEnd.trigger("change");
                    };
                    this.downloadRangeRecord = function () {
                        var thiss = this;
                        var $ddlStart = $('#ddlStartPage');
                        var $ddlEnd = $('#ddlEndPage');
                        var startPage = $ddlStart.int32();
                        var endPage = $ddlEnd.int32();
                        var range = endPage - startPage;
                        if (startPage === 0 || endPage === 0) {
                            alert("No hay expedientes para descargar");
                            return;
                        }
                        var message = (range > 150) ? "La descarga del expediente en rango de más de 150 páginas puede ser lenta" : "";
                        var question = "¿Desea descargar?";
                        var r = confirm(message + question);
                        if (r === true) {
                            var url = (thiss.config.module.ingemmet.urls.recordRange2.replace("{1}", startPage).replace("{2}", endPage));
                            var options = {
                                isJson: false,
                                dataType: "binary",
                                fileName: "Expediente_Pag" + startPage + "_Pag" + endPage + ".pdf",
                                validate: function () { return true; }
                            };
                            thiss.searchConfig(url, options);
                        }
                    };
                    this.searchResolutionsOfficial = function (options, tbl) {
                        var thiss = this;
                        tbl = tbl || '#tblResultResolutions';
                        var $tbl = $(tbl);
                        if ($tbl.find("tbody").length === 0)
                            $tbl.append("<tbody></tbody>");
                        $tbl.find(">tbody").empty();
                        options.isJson = false;
                        options.data = (options.inline === true) ? thiss.buildUrlIngemmet({ resource: "grid_resoluciones_dm", code: options.code }) : { code: options.code };
                        var url = (options.inline === true) ? thiss.config.module.ingemmet.urls.sidemcat : com.jtm.Server.contextPath + "miningconcession/miningconcession/searchResolution";
                        thiss.searchConfig(url, options, function (data) {
                            fill(data, options.inline);
                        });
                        function fill(items, inline) {
                            $tbd = $tbl.find(">tbody");
                            var html = "";
                            var i = 0;
                            items.forEach(function (item) {
                                html = '<tr data-uniqueid="' + (++i) + '">';
                                html += '<td>' + ((inline === true) ? item.nroresolucion || '' : item.resolutionNumber || '') + '</td>';
                                html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fresolucion) || '' : item.resolutionDate || '') + '</td>';
                                html += '<td>' + ((inline === true) ? item.re_desres || '' : item.description || '') + '</td>';
                                html += '<td>' + ((inline === true) ? item.plazos || '' : item.timeLimit || '') + '</td>';
                                html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fnotificacion) || '' : item.notificationDate || '') + '</td>';
                                html += '<td>' + ((inline === true) ? item.nronotificacion || '' : item.notificationNumber || '') + '</td>';
                                html += '<td>' + ((inline === true) ? thiss.reverseDate(item.fpublicacion) || '' : item.publicationDate || '') + '</td>';
                                html += '</tr>';
                                $tbd.append(html);
                            });
                        }
                    };
                    this.reverseDate = function (date) {
                        return (date == null) ? '' : date.split("/").reverse().join("-");
                    };
                    this.searchNotebooksOfficial = function (id) {
                        var thiss = this;
                        var tbl = '#tblResultNotebooks';
                        var $tbl = $(tbl);
                        if ($tbl.find("tbody").length === 0)
                            $tbl.append("<tbody></tbody>");
                        $tbl.find(">tbody").empty();
                        var options = {};
                        options.isJson = false;
                        options.data = thiss.buildUrlIngemmet({ resource: "grid_cuadernos", code: id });
                        var url = thiss.config.module.ingemmet.urls.sidemcat;
                        thiss.searchConfig(url, options, function (data) {
                            if (data.length > 0) {
                                data.forEach(function (item) {
                                    var options = {};
                                    options.isJson = false;
                                    options.data = thiss.buildUrlIngemmet({ type: 'GET_DETALLE_CUADERNO', resource: "crud", code: item.cg_codigo });
                                    var url = thiss.config.module.ingemmet.urls.sidemcat;
                                    thiss.searchConfig(url, options, function (data2) {
                                        item.main = data2.detalle;
                                        item.detalle = data2.detalle_cuaderno;
                                    });
                                });
                                fill(data);
                            }
                            else {
                                thiss.tableEmpty(tbl, "No se ha encontrado cuadernos");
                            }
                        });
                        function fill(items) {
                            $tbd = $tbl.find(">tbody");
                            var html = "";
                            var i = 0;
                            items.forEach(function (item) {
                                html = '<tr data-uniqueid="' + item.numero + '" data-uniquecode="' + item.cg_codigo + '">';
                                html += '<td>' + (item.numero || '') + '</td>';
                                html += '<td>' + (item.cg_codigo || '') + '</td>';
                                html += '<td>' + (item.tipo || '') + '</td>';
                                html += '<td>' + (item.estado || '') + '</td>';
                                html += '<td>' + (item.detalle !== undefined ? (item.detalle.anexado || '') : '') + '</td>';
                                html += '<td>' + (item.detalle !== undefined ? (item.detalle.fecharegistro || '') : '') + '</td>';
                                html += '</tr>';
                                $tbd.append(html);
                            });
                            $tbl.find(">tr").off("click");
                            $tbl.find(">tr").on("click", function (e) {
                                var id = jQuery(this).attr("data-uniquecode");
                                var tbl = "#tblResultNotebookResolution";
                                thiss.searchResolutionsOfficial(id, tbl);
                                jQuery(tbl).show();
                            });
                        }
                    };
                    /* this.searchFormPayOfficial = function (url, id, options) {
                         var thiss = this;
                         thiss.loadView(thiss.$form, url, function () {
                             thiss.$main.hide();
                             thiss.$form.show();
                             thiss.buildClose();
                             thiss.$hdnId = thiss.$form.find(BaseMain.HDNID);
                             thiss.$hdnId.val(id);
                             options.id = id;
                             thiss.searchPaysOfficial(options, { tbl: '#tblResultPayValidities', tblDetail: '#tblResultPayValidityDetails' }, "dol", { resource: "grid_vigencia" });
                             thiss.searchPaysOfficial(options, { tbl: '#tblResultPayPenalities', tblDetail: '#tblResultPayPenalityDetails' }, "pen", { resource: "grid_penalidad" });
                         });
                     };*/
                    this.searchPaysOfficial = function (options, tbls, suffix, parameters) {
                        var thiss = this;
                        var $tbl = $(tbls.tbl);
                        var $tblDetail = $(tbls.tblDetail);
                        if ($tbl.find("tbody").length === 0)
                            $tbl.append("<tbody></tbody>");
                        $tbl.find(">tbody").empty();
                        if ($tblDetail.find("tbody").length === 0)
                            $tblDetail.append("<tbody></tbody>");
                        $tblDetail.find(">tbody").empty();
                        options.isJson = false;
                        options.data = (options.inline === true) ? thiss.buildUrlIngemmet({ resource: parameters.resource, code: options.code }) : { code: options.code };
                        var url = (options.inline === true) ? thiss.config.module.ingemmet.urls.sidemcat : (com.jtm.Server.contextPath + "miningconcession/miningconcession/searchPaysPending");
                        thiss.searchConfig(url, options, function (data) {
                            if (options.inline === true) {
                                fill(data);
                                thiss.searchPaysDetailOfficial($tblDetail, {
                                    resource: parameters.resource + "_det", code: options.code
                                }, options);
                            }
                            else {
                                filloffline(data, parameters);
                                options.concept = (options.inline == false) ? parameters : null;
                                thiss.searchPaysDetailOfficial($tblDetail, null, options);
                            }
                        });
                        function fill(items, options) {
                            $tbd = $tbl.find(">tbody");
                            var html = "";
                            var i = 0;
                            items.forEach(function (item) {
                                html = '<tr data-uniqueid="' + item['dv_anoeje'] + '">';
                                html += '<td>' + (item["dv_anoeje"] || '') + '</td>';
                                html += '<td>' + (item["calificacion"] || '') + '</td>';
                                html += '<td>' + (item["dv_has" + suffix] || '') + '</td>';
                                html += '<td>' + (item["dv_deu" + suffix] || '') + '</td>';
                                html += '<td>' + (item["dv_pag" + suffix] || '') + '</td>';
                                html += '<td>' + (item.saldo || '') + '</td>';
                                html += '</tr>';
                                $tbd.append(html);
                            });
                        }
                        function filloffline(data, concept) {
                            var html = "";
                            var j = 0;
                            var year = (new Date).getFullYear();
                            var saldo = [];
                            var years = [];
                            var itemConcept = (concept == 2) ? data[0].itemPenality : data[0].itemValidity;
                            if ((itemConcept.itemCurrentYear.saldo.trim()).indexOf('-') > -1) {
                                years.push(year);
                                saldo.push(itemConcept.itemCurrentYear.saldo);
                                j++;
                            }
                            if ((itemConcept.itemLastYear.saldo.trim()).indexOf('-') > -1) {
                                years.push(year - 1);
                                saldo.push(itemConcept.itemLastYear.saldo);
                                j++;
                            }
                            if (j == 0) {
                                thiss.tableEmpty($tbl, "No se ha encontrado pagos");
                            }
                            for (var i = 0; i < years.length ; i++) {
                                html += '<tr data-uniqueid="' + data[0].code + '">';
                                html += '<td>' + (years[i] || '') + '</td>';
                                html += '<td>' + (' ' || '') + '</td>';
                                html += '<td>' + (data[0].netArea || '') + '</td>';
                                html += '<td>' + (saldo[i].replace('-', '') || '') + '</td>';
                                html += '<td>' + '0.00' + '</td>';
                                html += '<td>' + (saldo[i] || '') + '</td>';
                                html += '</tr>';
                            }
                            $tbl.find('>tbody').html(html);
                        }
                    };
                    this.parseoFloat = function (item) {
                        return item.text().replace("US", "").replace("$", "").replace("-", "").replace(",", "").replace('S/.', "").trim()
                    };
                    this.searchPaysDetailOfficial = function ($tbl, parameters, options) {
                        var thiss = this;
                        options.isJson = false;
                        options.data = (options.inline === true) ? thiss.buildUrlIngemmet({ resource: parameters.resource, code: parameters.code }) : { id: options.id };
                        var url = (options.inline === true) ? thiss.config.module.ingemmet.urls.sidemcat : com.jtm.Server.contextPath + "miningconcession/miningconcession/searchPays";
                        thiss.searchConfig(url, options, function (data) {
                            var html = "";
                            var i = 0;
                            var items = data;
                            if (options.inline === false) {
                                items = options.concept == 1 ? items.validities : items.penalties;
                            }
                            items.forEach(function (item) {
                                html += '<tr>';
                                html += '<td>' + ((options.inline === true) ? item["pv_anoeje"] || '' : item.year) + '</td>';
                                html += '<td>' + ((options.inline === true) ? item["ba_desabr"] || '' : item.financialEntity.name) + '</td>';
                                html += '<td>' + ((options.inline === true) ? item["pv_nrodoc"] || '' : item.receiptNumber) + '</td>';
                                html += '<td>' + ((options.inline === true) ? item["pv_fecpag"] || '' : item.receiptDate) + '</td>';
                                html += '<td>' + ((options.inline === true) ? item["moneda"] || '' : item.currencyType.name) + '</td>';
                                html += '<td>' + ((options.inline === true) ? item["pv_monpag"] || '' : item.amountPaid) + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find(">tbody").html(html);
                        });
                    };
                    this.getElementUnique = function (tbl, attribute) {
                        tbl = tbl || '#tblResult';
                        attribute = attribute || "data-uniqueid";
                        var row = jQuery(tbl + '>tbody>tr.selected').find("td:eq(0)").html();
                        if (row === undefined) return 0;
                        var id = row;
                        return id === undefined || id === null ? 0 : id;
                    };
                }
                BaseMain.prototype.formRecord = function (url, id, options) {
                    var thiss = this;
                    thiss.loadView(thiss.$form, url, function () {
                        thiss.$main.hide();
                        thiss.$form.show();
                        thiss.buildClose();
                        thiss.$hdnId = thiss.$form.find(BaseMain.HDNID);
                        thiss.$hdnId.val(id);
                        jQuery('#chkInline').off("change");
                        jQuery('#chkInline').on("change", function (e) {
                            var inline = jQuery('#chkInline').is(":checked");
                            if (inline === true)
                                thiss.searchRecords(options.code, inline);
                            else
                                thiss.searchRecords(id, inline);
                        });
                        jQuery('#chkInline').trigger("change");
                        jQuery('#btnDownload').off("click");
                        jQuery('#btnDownload').on("click", function (e) {
                            thiss.downloadRangeRecord();
                        });
                        if (options.online === true) {
                            jQuery('#divInLine').remove();
                            jQuery('#btnSave').remove();
                        }
                        else {
                            jQuery('#btnSave').off("click");
                            jQuery('#btnSave').on("click", function (e) {
                                thiss.saveRecordFromCloud();
                            });
                        }
                    });
                };
                BaseMain.prototype.formPayOfficial = function (url, id, options) {
                    var thiss = this;
                    thiss.loadView(thiss.$form, url, function () {
                        thiss.$main.hide();
                        thiss.$form.show();
                        thiss.buildClose();
                        thiss.$hdnId = thiss.$form.find(BaseMain.HDNID);
                        thiss.$hdnId.val(id);
                        jQuery('#chkInlinePay').off("change");
                        jQuery('#chkInlinePay').on("change", function (e) {
                            var inline = $(this).is(":checked");
                            options.inline = inline;
                            options.concept = 1;
                            options.id = id;
                            if (inline === true) {
                                thiss.searchPaysOfficial(options, { tbl: '#tblResultPayValidities', tblDetail: '#tblResultPayValidityDetails' }, "dol", { resource: "grid_vigencia" });
                                thiss.searchPaysOfficial(options, { tbl: '#tblResultPayPenalities', tblDetail: '#tblResultPayPenalityDetails' }, "pen", { resource: "grid_penalidad" });
                            }
                            else {
                                thiss.searchPaysOfficial(options, { tbl: '#tblResultPayValidities', tblDetail: '#tblResultPayValidityDetails' }, "dol", 1);
                                thiss.searchPaysOfficial(options, { tbl: '#tblResultPayPenalities', tblDetail: '#tblResultPayPenalityDetails' }, "pen", 2);
                            }
                        });
                        jQuery('#chkInlinePay').trigger("change");
                    });
                };
                BaseMain.prototype.formResolution = function (url, id, options) {
                    var thiss = this;
                    thiss.loadView(thiss.$form, url, function () {
                        thiss.$main.hide();
                        thiss.$form.show();
                        thiss.buildClose();
                        thiss.$hdnId = thiss.$form.find(BaseMain.HDNID);
                        thiss.$hdnId.val(id);
                        jQuery('#chkInlineResolution').off("change");
                        jQuery('#chkInlineResolution').on("change", function (e) {
                            var inline = $(this).is(":checked");
                            options.inline = inline;
                            if (inline === true) {
                                thiss.searchResolutionsOfficial(options);
                                thiss.searchNotebooksOfficial(options);
                            }
                            else
                                thiss.searchResolutionsOfficial(options);
                        });
                        jQuery('#chkInlineResolution').trigger("change");
                    });
                };
                BaseMain.prototype.initConfig = function () {
                    var thiss = this;
                    _super.prototype.initConfig.call(this);
                    if (thiss.config.module.ingemmet.urls.sidemcat.startsWith("http") === false)
                        thiss.config.module.ingemmet.urls.sidemcat = thiss.config.proxy + thiss.config.module.ingemmet.urls.base + thiss.config.module.ingemmet.urls.sidemcat;
                    if (thiss.config.module.ingemmet.urls.recordImage.startsWith("http") === false)
                        thiss.config.module.ingemmet.urls.recordImage = thiss.config.module.ingemmet.urls.base + thiss.config.module.ingemmet.urls.recordImage;
                    if (thiss.config.module.ingemmet.urls.recordRange.startsWith("http") === false)
                        thiss.config.module.ingemmet.urls.recordRange = thiss.config.proxy + thiss.config.module.ingemmet.urls.base + thiss.config.module.ingemmet.urls.recordRange;
                    if (thiss.config.module.ingemmet.urls.summary.startsWith("http") === false)
                        thiss.config.module.ingemmet.urls.summary = thiss.config.module.ingemmet.urls.base + thiss.config.module.ingemmet.urls.summary;
                    if (thiss.config.module.ingemmet.urls.pay.startsWith("http") === false)
                        thiss.config.module.ingemmet.urls.pay = thiss.config.module.ingemmet.urls.base + thiss.config.module.ingemmet.urls.pay;
                };
                BaseMain.prototype.load = function (jsonFile, options) {
                    options = options || {};
                    options.module = options.module || "miningconcession";
                    options.subModule = options.subModule || "miningconcession";
                    jsonFile = jsonFile || BaseMain.JSONBASE + options.module + "/baseminingconcession";
                    _super.prototype.load.call(this, jsonFile, options);
                };
                return BaseMain;
            })(jtm.geometry.BaseGeometry);
            miningconcession.BaseMain = BaseMain;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));