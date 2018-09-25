(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (surfaceright) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "sr";
                        this.procedure = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;
                        this.searchImages = function () {
                            var thiss = this;
                            var id = thiss.$hdnId.int32();
                            var options = {
                                isJson: false,
                                data: { id: id },
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + "socialresponsability/surfaceright/searchimages", options, function (data) {
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
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/surfaceright/savedocument', options, function (item) {
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
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/surfaceright/searchalerts', options, function (items) {
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
                        this.searchProcedureDocuments = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/surfaceright/searchprocedures', options, function (items) {
                                thiss.fillProcedureDocuments(items);
                            });
                            thiss.$btnShowHide.off('click');
                            thiss.$btnShowHide.on('click', function (e, isClosed) {
                                var state = typeof isClosed === "boolean" ? isClosed : $(this).find('>i').hasClass(Main.UPLOADSHOW);
                                if (state) {
                                    $(this).find('>i').removeClass(Main.UPLOADSHOW).addClass(Main.UPLOADHIDE);
                                    thiss.$divRequirementDocuments.find('>.panel-body').hide();
                                }
                                else {
                                    $(this).find('>i').removeClass(Main.UPLOADHIDE).addClass(Main.UPLOADSHOW);
                                    thiss.$divRequirementDocuments.find('>.panel-body').show();
                                }
                            });
                            thiss.$btnShowHide.trigger('click', false);
                        };
                        this.fillProcedureDocuments = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                if (item.document.id !== null) {
                                    html += '<li id="' + item.id + '" class="list-group-item">';
                                    html += '<span class="glyphicon glyphicon-folder-close">';
                                    html += '<a href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank">' + item.name + '</a>';
                                    html += '</span>';
                                    html += '</li>';
                                }
                            });
                            thiss.$ulDocumentProcedure.html(html);
                            thiss.$ulDocumentProcedure.find('>li').off('dblclick');
                            thiss.$ulDocumentProcedure.find('>li').on('dblclick', function (e) {
                                thiss.searchRequirements($(this).attr('id'));
                            });
                            thiss.$divProcedureDocuments.find('>.panel-body').css('position', 'relative');
                            thiss.$divRequirementDocuments.css({ 'position': 'absolute', 'bottom': '0', 'right': '0' });
                        };
                        this.searchRequirements = function (id) {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/requirement/searchbyprocedure', { data: { id: id, moduleId: thiss.$hdnId.int32() }, isJson: false }, function (items) {
                                thiss.fillRequirementDocuments(items);
                            });
                        };
                        this.fillRequirementDocuments = function (items) {
                            var thiss = this;
                            var html = '';
                            items.forEach(function (item, i) {
                                if (item.document.id !== null) {
                                    html += '<li id="' + item.id + '" class="list-group-item">';
                                    html += '<span class="glyphicon glyphicon-folder-close">';
                                    html += '<a href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank">' + item.name + '</a>';
                                    html += '</span>';
                                    html += '</li>';
                                }
                            });
                            thiss.$divRequirementDocuments.show();
                            thiss.$divRequirementDocuments.find('>.panel-body>ul').html(html);
                            thiss.$btnShowHide.trigger('click', false);
                        };
                    }
                    Main.UPLOADSHOW = "glyphicon-triangle-bottom";
                    Main.UPLOADHIDE = "glyphicon-triangle-top";
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "general/baseprocedure.js");
                            jQuery.getScript(thiss.js.path + "socialresponsability/surfaceright/procedure.js", function (data, textStatus, jqxhr) {
                                thiss.procedure = getInstance();
                                thiss.procedure.setConfig(thiss.config);
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
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "socialresponsability/surfaceright/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "socialresponsability/surfaceright/savecoordinatesmultiple";
                        options.callback = function () {
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
                            jQuery('#btnDeletePhoto').off("click");
                            jQuery('#btnDeletePhoto').on("click", function (e) {
                                if (jQuery('#hdnImageId').int32() !== 0) {
                                    var id = jQuery('#hdnImageId').int32();
                                    thiss.deleteImage(id);
                                }
                                else
                                    alert('No existe imagen para eliminar.');
                            });
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/surfaceright/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/surfaceright/searchdocuments",
                                $hdnId: thiss.$hdnId
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
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtCadasterCode').val(item.cadasterCode);
                            jQuery('#txtProcurementDate').val(item.procurementDate);
                            jQuery('#txtAreaTitle').val((item.areaTitle).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtPerimeter').val((item.perimeter).toFixed(thiss.config.number.decimalLength));
                            jQuery('#txtFormerOwner').val(item.formerOwner);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlPhysicalSituation').val(item.physicalSituation.id);
                            jQuery('#ddlHolder').val(item.holder.id);
                            jQuery('#ddlUsePresent').val(item.usePresent.id === null ? 0 : item.usePresent.id);
                            jQuery('#ddlGroup').val(item.group.id === null ? 0 : item.group.id);
                            jQuery('#ddlRegistryOffice').val(item.registryOffice.id === null ? 0 : item.registryOffice.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length).toFixed(thiss.config.number.decimalLength));
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#txtCertificateNumber').val(item.certificateNumber);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "socialresponsability/surfaceright/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "socialresponsability/surfaceright/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "socialresponsability/surfaceright/searchnationalcartographies", item.id, null);
                            thiss.searchImages();
                            thiss.searchAlerts();
                            thiss.searchProcedureDocuments();
                            thiss.formAttachment.search(item.id);
                        });
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            observation: jQuery('#txaObservation').string(),
                            cadasterCode: jQuery('#txtCadasterCode').string(),
                            areaTitle: jQuery('#txtAreaTitle').number(),
                            formerOwner: jQuery('#txtFormerOwner').string(),
                            procurementDate: jQuery('#txtProcurementDate').date(),
                            certificateNumber: jQuery('#txtCertificateNumber').string(),
                            perimeter: jQuery('#txtPerimeter').number(),
                            registryOffice: { id: jQuery('#ddlRegistryOffice').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnit').int32() },
                            usePresent: { id: jQuery('#ddlUsePresent').int32() },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            physicalSituation: { id: jQuery('#ddlPhysicalSituation').int32() },
                            holder: { id: jQuery('#ddlHolder').int32() },
                            group: { id: jQuery('#ddlGroup').int32() },
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
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#ddlUsePresent').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Uso actual.';
                                jQuery('#ddlUsePresent').focus();
                            } else if (jQuery('#ddlHolder').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Titular.';
                                jQuery('#ddlHolder').focus();
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
                            field: "cadasterCode",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "procurementDate",
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
                            field: "group.name",
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
                            procurementDate: jQuery('#txtProcurementDateStartSearch').date(),
                            procurementDateEnd: jQuery('#txtProcurementDateEndSearch').date(),
                            holder: { id: jQuery('#ddlHolderSearch').int32() },
                            group: { id: jQuery('#ddlGroupSearch').int32() },
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
                            nationalCartography: {
                                id: jQuery('#ddlNationalCartographySearch').string()
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
            })(socialresponsability.surfaceright || (socialresponsability.surfaceright = {}));
            var surfaceright = socialresponsability.surfaceright;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.surfaceright.Main.execute();