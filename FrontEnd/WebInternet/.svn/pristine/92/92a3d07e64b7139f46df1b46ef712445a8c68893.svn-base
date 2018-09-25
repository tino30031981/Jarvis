(function (com) {
    (function (jtm) {
        (function (surfaceproperty) {
            (function (surfaceright) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "sr";
                        this.procedure = null;
                        this.tracing = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;
                        this.searchHistorics = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'surfaceproperty/historic/searchhistorics', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.fillHistorics(item, '#tblResultHistorics', "#divResultHistoric");
                            });
                        };
                        this.fillHistorics = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.documentNumber + '</td>';
                                html += '<td>' + item.historicCondition.name + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.formHistorics = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: title,
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                //position: [(x - 550) / 2, y - 100],
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "surfaceproperty/surfaceright/formHistoric", function () {
                                thiss.datePicker('#txtHistoricStartDate');
                                if (id > 0) {
                                    thiss.detailHistoric(id);
                                }
                                jQuery('#btnSaveHistoric').off("click");
                                jQuery('#btnSaveHistoric').on("click", function (e) {
                                    thiss.saveHistoric();
                                });
                            });
                        };
                        this.saveHistoric = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdHistoric').int32(),
                                historicCondition: {
                                    id: jQuery('#ddlHistoricCondition').int32()
                                },
                                name: jQuery('#txtHistoricName').string(),
                                documentNumber: jQuery("#txtHistoricDocumentNumber").string(),
                                startDate: jQuery('#txtHistoricStartDate').date(),
                                surfaceright: {
                                    id: jQuery('#hdnId').int32()
                                }
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'surfaceproperty/historic/save', options, function () {
                                thiss.searchHistorics(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                } else if (jQuery('#ddlHistoricCondition').int32() === 0) {
                                    success = false;
                                    message = 'Seleccione el tipo de Condición.';
                                    jQuery('#ddlHistoricCondition').focus();
                                } else if (jQuery('#txtHistoricName').int32() === 0) {
                                    success = false;
                                    message = 'Ingrese el Nombre de titular.';
                                    jQuery('#txtHistoricName').focus();
                                } else if (jQuery('#txtHistoricDocumentNumber').decimal() === 0) {
                                    success = false;
                                    message = 'Ingrese el Numero de Documento.';
                                    jQuery('#txtHistoricDocumentNumber').focus();
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            };
                        };
                        this.detailHistoric = function (id) {
                            var thiss = this;
                            function validate() {
                                return true;
                            }
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'surfaceproperty/historic/detail', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdHistoric').val(item.id);
                                jQuery('#txtHistoricName').val(item.name);
                                jQuery('#txtHistoricDocumentNumber').val(item.documentNumber);
                                jQuery('#ddlHistoricCondition').val(item.historicCondition.id);
                                jQuery('#txtHistoricStartDate').val(item.startDate);
                            });
                        };
                        this.deleteHistorics = function () {
                            var thiss = this;
                            var items = com.jtm.helper.Table.getItems("#tblResultHistorics", true, true);
                            var item = {
                                Historics: items
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (item.length === 0) {
                                    alert('Seleccione al menos un pago.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/deletehistorics', options, function () { thiss.searchHistorics(); });
                        };
                        this.searchIndependences = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/searchIndependences', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.fillIndependences(item, '#tblResultIndependences', "#divResultIndependence");
                            });
                        };
                        this.fillIndependences = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td>' + (i++) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.companyCode + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.netArea + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                        };
                        this.searchImages = function () {
                            var thiss = this;
                            var id = thiss.$hdnId.int32();
                            var options = {
                                isJson: false,
                                data: { id: id },
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/searchimages", options, function (data) {
                                jQuery('#imgRecord').attr('src', '');
                                jQuery('#imgRecord').attr("alt", '');
                                if (data.length > 0) {
                                    thiss.fillRecordImages(data);
                                    jQuery('#ddlImage').val(data[data.length - 1].id);
                                    thiss.navigationRecordHandler();
                                }
                            });
                            function validate() {
                                if (id === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.fillRecordImages = function (items) {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            $ddl.empty();
                            for (var i = 0; i < items.length; i++) {
                                $ddl.append('<option name="' + items[i].id + '" value="' + items[i].id + '">Imagen ' + (i + 1) + '</option>');
                            }
                        };
                        this.navigationRecordHandler = function () {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            var $img = $('#imgRecord');
                            $img.off("load");
                            $img.on("load", function (e) {
                                thiss.loadingHide();
                            });
                            $img.off("error");
                            $img.on("error", function (e) {
                                jQuery(this).attr("alt", "No se pudo cargar la imagen");
                                thiss.loadingHide();
                            });
                            $ddl.off("change");
                            $ddl.on("change", function (e) {
                                thiss.loadingShow();
                                jQuery('#imgRecord').attr("src", "");
                                if (jQuery(this).int32() === 0) return;
                                jQuery('#hdnImageId').val(jQuery(this).int32());
                                jQuery('#imgRecord').attr("alt", "Imagen: " + jQuery(this).int32());
                                jQuery('#imgRecord').attr("src", com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + jQuery(this).int32());
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
                        this.saveImage = function () {
                            var thiss = this;
                            var item = { id: thiss.$hdnId.int32() };
                            var options = {
                                data: item,
                                attachments: [{ id: "filPhoto", file: jQuery('#filPhoto')[0].files[0] }],
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/savedocument', options, function (item) {
                                thiss.searchImages();
                                jQuery('#filPhoto').val('');
                            });
                            function validate() {
                                if (jQuery('#filPhoto').val() === '') {
                                    alert('Seleccione una foto.');
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.deleteImage = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                isJson: false
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'documentlibrary/document/delete', options, function () {
                                thiss.searchImages();
                            });
                        };
                        this.searchAlerts = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/searchalerts', options, function (items) {
                                thiss.fillAlerts(items);
                            });
                        };
                        this.fillAlerts = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.rule + '</td>';
                                html += '</tr>';
                            });
                            thiss.$tblResultAlerts.find('>tbody').html(html);
                            thiss.$divTotalAlert.find('>span').html(thiss.$tblResultAlerts.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultAlerts);
                        };
                        this.searchMininingCadaster = function () {
                            var thiss = this;
                            var id = jQuery('#ddlServer').string();
                            var item = thiss.config.module.soaps.find2("id", id);
                            var options = {
                                data: {
                                    url: item.url,
                                layerId: Number(item.layerId),
                                    id: thiss.$hdnId.int32()
                                    },
                                            isJson : false
                                    };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'surfaceproperty/surfaceright/searchminingcadaster', options, function (items) {
                                thiss.fillMininingCadaster(items, '#tblResultMiningCadester', "#divTotalMiningCadester");
                            });
                        };
                        this.fillMininingCadaster = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            if (items === null || items === undefined) return;
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + '" data-index="' +i + '">';
                                html += '<td>' +(i +1) + '</td>';
                                html += '<td>' +item.code + '</td>';
                                html += '<td>' +item.name + '</td>';
                                html += '<td>' +item.holder.name + '</td>';
                                html += '<td>' +(item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea) + '</td>';
                                html += '<td>' +(item.areaIntersected / Main.HECTARE).toFixed(thiss.config.number.decimalArea) + '</td>';
                                html += '<td>' +item.formulationDate + '</td>';
                                    html += '</tr>';
                                });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            };
                    }
                     
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "surfaceproperty/surfaceright/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnProcedure').off("click");
                        jQuery('#btnProcedure').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.procedure.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'surfaceproperty/folder/delete',
                                urlForm: com.jtm.Server.contextPath + "surfaceproperty/folder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'surfaceproperty/folder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "surfaceproperty/folder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "surfaceproperty/folder/formfolder",
                            });
                        });
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "miningrequest", { module: "miningconcession", subModule: 'miningrequest' });
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker('#txtProcurementDateEndSearch');
                        thiss.datePicker('#txtProcurementDateStartSearch');
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "surfaceproperty/surfaceright/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "surfaceproperty/surfaceright/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.$ddlServer = thiss.$form.find('#ddlServer');
                            jQuery('#txtCertificateNumber').numeric({ negative: false });
                            jQuery('#txtAreaTitle').numeric({ negative: false, decimalPlaces: 4 });
                            jQuery('#txtPerimeter').numeric({ negative: false, decimalPlaces: 2 });
                            thiss.datePicker('#txtProcurementDate');
                            thiss.$tblResultAlerts = thiss.$form.find('#tblResultAlerts');
                            thiss.$divTotalAlert = thiss.$form.find('#divTotalAlert');
                            thiss.$divProcedureDocuments = thiss.$form.find('#divProcedureDocuments');
                            thiss.$ulDocumentProcedure = thiss.$divProcedureDocuments.find('#ulDocumentProcedure');
                            thiss.$divRequirementDocuments = thiss.$divProcedureDocuments.find('>.panel-body>.panel-default');
                            thiss.$btnShowHide = thiss.$divProcedureDocuments.find('#btnShowHide');
                            thiss.$divRequirementDocuments.hide();
                            com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlServer,
                                        items: thiss.config.module.soaps
                            });
                            jQuery('#btnAddPhoto').off("click");
                            jQuery('#btnAddPhoto').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    jQuery('#filPhoto').trigger('click');
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#filPhoto').off("change");
                            jQuery('#filPhoto').on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    thiss.saveImage();
                                }
                            });
                            jQuery('#btnAddHistoric').off("click");
                            jQuery('#btnAddHistoric').on("click", function (e) {
                                thiss.formHistorics();
                            });
                            jQuery('#btnUpdateHistoric').off("click");
                            jQuery('#btnUpdateHistoric').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0) {
                                    var id = thiss.getElementID('#tblResultHistorics');
                                    if (id > 0)
                                        thiss.formHistorics(id, "Editar Historicos");
                                    else
                                        alert('Debes seleccionar un Historico.');
                                }
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnDeleteHistoric').off("click");
                            jQuery('#btnDeleteHistoric').on("click", function (e) {
                                thiss.deleteHistorics();
                            });
                            jQuery('#btnDeletePhoto').off("click");
                            jQuery('#btnDeletePhoto').on("click", function (e) {
                                if (jQuery('#hdnImageId').int32() !== 0) {
                                    var id = jQuery('#hdnImageId').int32();
                                    thiss.deleteImage(id);
                                }
                                else
                                    alert('No existe imagen para eliminar.');
                            });
                            thiss.$ddlServer.off("change");
                            thiss.$ddlServer.on("change", function () {
                                thiss.searchMininingCadaster();
                                });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtCadasterCode').val(item.cadasterCode);
                            jQuery('#txtCompanyCode').val(item.companyCode);
                            jQuery('#txtDenomination').val(item.name);
                            jQuery('#txtProcurementDate').val(item.procurementDate);
                            jQuery('#txtProcurementDate').datepicker("update", item.procurementDate);
                            jQuery('#txtAreaTitle').val((item.areaTitle).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtPerimeter').val((item.perimeter).toFixed(thiss.config.number.decimalLength));
                            jQuery('#txtFormerOwner').val(item.formerOwner);
                            jQuery('#txtPlaceInscribedFactory').val(item.placeInscribedFactory);
                            jQuery('#txtFormerOwner').val(item.formerOwner);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txaDestination').val(item.destination);
                            jQuery('#ddlPhysicalSituation').val(item.physicalSituation.id);
                            jQuery('#ddlLegalSituation').val(item.legalSituation.id);
                            jQuery('#ddlHolder').val(item.holder.id);
                            jQuery('#ddlUsePresent').val(item.usePresent.id === null ? 0 : item.usePresent.id);
                            jQuery('#ddlRegistryOffice').val(item.registryOffice.id === null ? 0 : item.registryOffice.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length).toFixed(thiss.config.number.decimalLength));
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#chkHito').prop("checked", item.hito);
                            jQuery('#chkInscribedFactory').prop("checked", item.inscribedFactory);
                            jQuery('#chkRealFactory').prop("checked", item.realFactory);
                            jQuery('#txtCertificate').val(item.publicRecord === null ? '' : item.publicRecord.certificate);
                            jQuery('#txtPage').val(item.publicRecord === null ? '' : item.publicRecord.page);
                            jQuery('#txtTomo').val(item.publicRecord === null ? '' : item.publicRecord.tomo);
                            jQuery('#txtFoja').val(item.publicRecord === null ? '' : item.publicRecord.foja)
                            jQuery('#txtFile').val(item.publicRecord === null ? '' : item.publicRecord.file);
                            jQuery('#txaFront').val(item.adjacent === null ? '' : item.adjacent.front);
                            jQuery('#txaBack').val(item.adjacent === null ? '' : item.adjacent.back);
                            jQuery('#txaRight').val(item.adjacent === null ? '' : item.adjacent.right);
                            jQuery('#txaLeft').val(item.adjacent === null ? '' : item.adjacent.left);
                            jQuery('#txtAdjacentAreaTitle').val(item.areaTitle);
                            jQuery('#txtAdjacentNetArea').val(item.netArea);
                            jQuery('#ddlGeoReferenceType').val(item.geoReferenceType.id);
                            jQuery('#txaGeoReferenceTypeDescription').val(item.geoReferenceTypeDescription);
                            jQuery('#chkAssessment').prop("checked", item.assessment);
                            jQuery('#txtDescriptionAssessment').val(item.descriptionAssessment);
                            jQuery('#txtAddress').val(item.address.home);
                            jQuery('#ddlServer').val(item.spatialReference.id);
                            jQuery('#ddlServer').trigger('change');
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "surfaceproperty/surfaceright/searchtowncenters", item.id, null);
                            thiss.searchImages();
                            thiss.searchAlerts();
                            thiss.searchIndependences();
                            thiss.searchHistorics();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                        });
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtDenomination').string(),
                            companyCode: jQuery('#txtCompanyCode').string(),
                            cadasterCode: jQuery('#txtCadasterCode').string(),
                            physicalSituation: { id: jQuery('#ddlPhysicalSituation').int32() },
                            legalSituation: { id: jQuery('#ddlLegalSituation').int32() },
                            holder: { id: jQuery('#ddlHolder').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnit').int32() },
                            usePresent: { id: jQuery('#ddlUsePresent').int32() },
                            procurementDate: jQuery('#txtProcurementDate').date(),
                            placeInscribedFactory: jQuery('#txtPlaceInscribedFactory').string(),
                            inscribedFactory: $('#chkInscribedFactory').boolean(),
                            realFactory: $('#chkRealFactory').boolean(),
                            hito: $('#chkHito').boolean(),
                            destination: jQuery('#txaDestination').string(),
                            registryOffice: { id: $('#ddlRegistryOffice').int32() },
                            publicRecord: {
                                certificate: $('#txtCertificate').string(),
                                file: $('#txtFile').string(),
                                tomo: $('#txtTomo').string(),
                                foja: $('#txtFoja').string(),
                                page: $('#txtPage').string()
                            },
                            assessment: $('#chkAssessment').boolean(),
                            descriptionAssessment: jQuery('#txtDescriptionAssessment').string(),
                            observation: jQuery('#txaObservation').string(),
                            formerOwner: jQuery('#txtFormerOwner').string(),
                            certificateNumber: jQuery('#txtCertificateNumber').string(),
                            perimeter: jQuery('#txtPerimeter').number(),
                            registryOffice: { id: jQuery('#ddlRegistryOffice').int32() },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            adjacent: {
                                front: jQuery('#txaFront').string(),
                                back:  jQuery('#txaBack').string(),
                                right: jQuery('#txaRight').string(),
                                left:  jQuery('#txaLeft').string()
                            },
                            geoReferenceType: {
                                id: jQuery('#ddlGeoReferenceType').int32()
                            },
                            geoReferenceTypeDescription: jQuery('#txaGeoReferenceTypeDescription').string(),
                            areaTitle: jQuery('#txtAdjacentAreaTitle').number(),
                            netArea: jQuery('#txtAdjacentNetArea').number(),
                            address: {
                                home: jQuery('#txtAddress').string()
                            },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el Código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#ddlUsePresent').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Uso actual.';
                                jQuery('#ddlUsePresent').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Sistema de Referencia.';
                                jQuery('#ddlSpatialReference').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "code",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "address.home",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "publicRecord.certificate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "publicRecord.file",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "areaTitle",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "netArea",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "miningUnit.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            cadasterCode: jQuery('#txtCadasterCodeSearch').string(),
                            procurementDate: jQuery('#txtProcurementDateSearch').date(),
                            procurementDateEnd: jQuery('#txtProcurementDateEndSearch').date(),
                            holder: { id: jQuery('#ddlHolderSearch').int32() },
                            formerOwner: jQuery('#txtFormerOwnerSearch').string(),
                            district: {
                                id: jQuery('#ddlDistrictSearch').string(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').string(),
                                    department: {
                                        id: jQuery('#ddlDepartmentSearch').string()
                                    }
                                }
                            },
                            address: {
                                home: jQuery('#txtHomeSearch').string()
                            },
                            physicalSituation: {
                                id: jQuery('#ddlPhysicalSituationSearch').int32()
                            },
                            legalSituation: {
                                id: jQuery('#ddlLegalSituationSearch').int32()
                            },
                            condition: {
                                id: jQuery('#ddlConditionSearch').int32()
                            },
                            nationalCartography: {
                                id: jQuery('#ddlNationalCartographySearch').string()
                            },
                            usePresent: {
                                id: jQuery('#ddlUsePresentSearch').int32()
                            },
                            miningUnit: {
                                id: jQuery('#ddlMiningUnitSearch').int32()
                            },
                            hydrographicBasin: {
                                id: jQuery('#ddlHydrographicBasinSearch').string()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReferenceSearch').int32()
                            },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                surfaceright.Main = Main;
            })(surfaceproperty.surfaceright || (surfaceproperty.surfaceright = {}));
            var surfaceright = surfaceproperty.surfaceright;
        })(jtm.surfaceproperty || (jtm.surfaceproperty = {}));
        var surfaceproperty = jtm.surfaceproperty;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.surfaceproperty.surfaceright.Main.execute();