(function (com) {
    (function (jtm) {
        (function (society) {
            (function (holder) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "soc";
                        this.tracing = null;
                        this.searchLegalRepresentatives = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'society/holder/searchlegalrepresentatives', {
                                data: { id: this.$hdnId.int32(), isList: false },
                                isJson: false
                            }, function (items) {
                                thiss.fillLegalRepresentatives(items, '#tblResultLegalRepresentatives', "#divTotalLegalRepresentative");
                            });
                        };
                        this.fillLegalRepresentatives = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.firstName + '</td>';
                                html += '<td>' + item.registryOffice.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.deleteLegalRepresentatives = function () {
                            var thiss = this;
                            var legalRepresentativeIds = com.jtm.helper.Table.getItems("#tbdResultLegalRepresentatives", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), legalRepresentativeIds: legalRepresentativeIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (legalRepresentativeIds.length === 0) {
                                    alert('Seleccione al menos Representate Legal.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'society/holder/deletelegalrepresentatives', options, function () { thiss.searchLegalRepresentatives(); });
                        };
                        this.saveLegalRepresentative = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnId.int32(),
                                legalRepresentative: { id: jQuery('#ddlLegalRepresentative').int32() },
                                registryOffice: { id: jQuery('#ddlRegistryOfficeLegalRepresentative').int32() }
                            };
                            function validate() {
                                if (jQuery('#ddlLegalRepresentative').int32() === 0) {
                                    alert('Seleccione un Representante Legal.');
                                    return false;
                                } else if (jQuery('#ddlRegistryOfficeLegalRepresentative').int32() === 0) {
                                    alert('Seleccione la Sede Registral.');
                                    return false;
                                } else
                                    return true;
                            }
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'society/holder/savelegalrepresentative', options, function () {
                                thiss.searchLegalRepresentatives(); jQuery('#divPopup').dialog('close');
                            });
                        };
                        this.formLegalRepresentative = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Agregar Representante Legal",
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "society/legalrepresentative/formassign", function () {
                                jQuery('#btnSaveLegalRepresentative').off("click");
                                jQuery('#btnSaveLegalRepresentative').on("click", function (e) {
                                    thiss.saveLegalRepresentative();
                                });
                            });
                        };
                        this.showRegister = function () {
                            var thiss = this;
                            jQuery('#ddlCivilStatus').on("change", function (e) {
                                if (jQuery('#ddlCivilStatus').int32() === 2)
                                    jQuery("#divSpouse").show();
                                else
                                    cleanTexts();
                            });
                            jQuery('#ddlHolderType').on("change", function (e) {
                                cleanTexts();
                            });
                            function cleanTexts() {
                                jQuery('#txtNameSpouse').val('');
                                jQuery('#txtLastNameSpouse').val('');
                                jQuery('#txtMaidenNameSpouse').val('');
                                jQuery('#ddlNationalitySpouse').val(0);
                                jQuery('#ddlIdentificationDocumentSpouse').val(0);
                                jQuery('#ddlRegistryOfficeSpouse').val(0);
                                jQuery('#txtDocumentNumberSpouse').val('');
                                jQuery('#txtPlaceSpouse').val('');
                                jQuery('#txtFileSpouse').val('');
                                if (jQuery('#ddlHolderType').int32() === 2) {
                                    jQuery("#divNatural").hide();
                                    jQuery("#divNatural2").hide();
                                    jQuery('#ddlCivilStatus').val(0);
                                    jQuery('#txtLastName').val('');
                                    jQuery('#txtMaidenName').val('');
                                    jQuery('#txtLandLine').val('');
                                    jQuery('#txtMobile').val('');
                                    jQuery('#txtPersonalMail').val('');
                                    jQuery('#ddlNationality').val(0);
                                } else {
                                    jQuery("#divNatural").show();
                                    jQuery("#divNatural2").show();
                                }
                                jQuery("#divSpouse").hide();
                            }
                        };
                    }
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {                            
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "society/holder/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        });
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        jQuery('#txtDocumentNumberSearch').numeric({ negative: false });
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);                        
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'society/folder/delete',
                                urlForm: com.jtm.Server.contextPath + "society/folder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'society/folder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "society/folder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "society/folder/formfolder"
                            });
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.fillPoliticalDivision();
                            thiss.datePicker('#txtRegimeDateStart');
                            thiss.datePicker('#txtRegimeDateEnd');
                            jQuery('#txtLandLine').numeric({ negative: false });
                            jQuery('#txtMobile').numeric({ negative: false });
                            jQuery('#txtDocumentNumber').numeric({ negative: false });
                            jQuery('#txtNumberRegimeConstancy').numeric({ negative: false });
                            jQuery('#txtCertificate').numeric({ negative: false });
                            jQuery('#txtTomo').numeric({ negative: false });
                            jQuery('#txtPage').numeric({ negative: false });
                            jQuery('#txtDocumentNumberSpouse').numeric({ negative: false });
                            thiss.showRegister();
                            jQuery('#btnAddLegalRepresentatives').off("click");
                            jQuery('#btnAddLegalRepresentatives').on("click", function (e) {
                                if (thiss.$hdnId.int32() === 0 || jQuery('#ddlHolderType').int32() === 1)
                                    alert(Main.NEWELEMENTID);
                                else
                                    thiss.formLegalRepresentative();
                            });
                            jQuery('#btnQuitLegalRepresentatives').off("click");
                            jQuery('#btnQuitLegalRepresentatives').on("click", function (e) {
                                if (thiss.$hdnId.int32() === 0 && jQuery('#ddlHolderType').int32() === 1)
                                    alert(Main.NEWELEMENTID);
                                else
                                    thiss.deleteLegalRepresentatives();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtLastName').val(item.lastName);
                            jQuery('#txtMaidenName').val(item.maidenName);
                            jQuery('#ddlIdentificationDocument').val(item.identificationDocument.id);
                            jQuery('#txtDocumentNumber').val(item.documentNumber);
                            jQuery('#txtLandLine').val(item.landLine);
                            jQuery('#txtMobile').val(item.mobile);
                            jQuery('#txtCorporateMail').val(item.corporateMail);
                            jQuery('#txtPersonalMail').val(item.personalMail);
                            jQuery('#ddlHolderRegime').val(item.holderRegime.id);
                            jQuery('#ddlHolderGroup').val(item.holderGroup.id);
                            jQuery('#ddlHolderType').val(item.holderType.id);
                            jQuery('#ddlHolderType').trigger("change");
                            jQuery('#txtRegimeDateStart').val(item.regimeDateStart);
                            jQuery('#txtRegimeDateEnd').val(item.regimeDateEnd);
                            jQuery('#txtNumberRegimeConstancy').val(item.numberRegimeConstancy);
                            jQuery('#txtHome').val(item.address.home);
                            jQuery('#txtUrbanization').val(item.address.urbanization);
                            jQuery('#ddlDepartment').val(item.district.province.department.id);
                            jQuery('#ddlDepartment').trigger("change");
                            jQuery('#ddlProvince').val(item.district.province.id);
                            jQuery('#ddlProvince').trigger("change");
                            jQuery('#ddlDistrict').val(item.district.id);
                            jQuery('#txtResolution').val(item.publicRecord.resolution);
                            jQuery('#txtCertificate').val(item.publicRecord.certificate);
                            jQuery('#txtFile').val(item.publicRecord.file);
                            jQuery('#txtTomo').val(item.publicRecord.tomo);
                            jQuery('#txtPage').val(item.publicRecord.page);
                            jQuery('#txtFolio').val(item.publicRecord.folio);
                            jQuery('#txtPlace').val(item.publicRecord.place);
                            jQuery('#ddlRegistryOffice').val(item.registryOffice.id);
                            jQuery('#ddlNationality').val(item.nationality.id === null ? 0 : item.nationality.id);
                            jQuery('#ddlCivilStatus').val(item.civilStatus.id === null ? 0 : item.civilStatus.id);
                            jQuery('#ddlCivilStatus').trigger("change");
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#txtNameSpouse').val(item.spouse.name);
                            jQuery('#txtLastNameSpouse').val(item.spouse.lastName);
                            jQuery('#txtMaidenNameSpouse').val(item.spouse.maidenName);
                            jQuery('#ddlNationalitySpouse').val(item.spouse.nationality.id === null ? 0 : item.spouse.nationality.id);
                            jQuery('#ddlIdentificationDocumentSpouse').val(item.spouse.identificationDocument.id === null ? 0 : item.spouse.identificationDocument.id);
                            jQuery('#txtDocumentNumberSpouse').val(item.spouse.documentNumber);
                            jQuery('#ddlRegistryOfficeSpouse').val(item.spouse.registryOffice.id === null ? 0 : item.spouse.registryOffice.id);
                            jQuery('#txtPlaceSpouse').val(item.spouse.publicRecord.place);
                            jQuery('#txtFileSpouse').val(item.spouse.publicRecord.file);
                            thiss.searchLegalRepresentatives();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                            //thiss.formAttachment.search(item.id);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "holderType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "holderGroup.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "holderRegime.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "documentNumber",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
                            lastName: jQuery('#txtLastNameSearch').string(),
                            maidenName: jQuery('#txtMaidenNameSearch').string(),
                            documentNumber: jQuery('#txtNumberDocumentSearch').string(),
                            district: {
                                id: jQuery('#ddlDistrictSearch').string()
                            },
                            holderRegime: {
                                id: jQuery('#ddlHolderRegimeSearch').int32()
                            },
                            holderGroup: {
                                id: jQuery('#ddlHolderGroupSearch').int32()
                            },
                            registryOffice: {
                                id: jQuery('#ddlRegistryOfficeSearch').int32()
                            },
                            identificationDocument: {
                                id: jQuery('#ddlIdentificationDocumentSearch').int32()
                            },
                            holderType: {
                                id: jQuery('#ddlHolderTypeSearch').int32()
                            },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            name: jQuery('#txtName').string(),
                            lastName: jQuery('#txtLastName').string(),
                            maidenName: jQuery('#txtMaidenName').string(),
                            documentNumber: jQuery('#txtDocumentNumber').string(),
                            landLine: jQuery('#txtLandLine').string(),
                            mobile: jQuery('#txtMobile').string(),
                            holderGroup: {
                                id: jQuery('#ddlHolderGroup').int32()
                            },
                            identificationDocument: {
                                id: jQuery('#ddlIdentificationDocument').int32()
                            },
                            nationality: {
                                id: jQuery('#ddlNationality').int32()
                            },
                            civilStatus: {
                                id: jQuery('#ddlCivilStatus').int32()
                            },
                            holderType: {
                                id: jQuery('#ddlHolderType').int32()
                            },
                            holderRegime: {
                                id: jQuery('#ddlHolderRegime').int32()
                            },
                            corporateMail: jQuery('#txtCorporateMail').string(),
                            personalMail: jQuery('#txtPersonalMail').string(),
                            publicRecord: {
                                resolution: jQuery('#txtResolution').string(),
                                certificate: jQuery('#txtCertificate').string(),
                                file: jQuery('#txtFile').string(),
                                tomo: jQuery('#txtTomo').string(),
                                page: jQuery('#txtPage').string(),
                                folio: jQuery('#txtFolio').string(),
                                place: jQuery('#txtPlace').string()
                            },
                            address: {
                                home: jQuery('#txtHome').string(),
                                urbanization: jQuery('#txtUrbanization').string()
                            },
                            district: {
                                id: jQuery('#ddlDistrict').string()
                            },
                            registryOffice: {
                                id: jQuery('#ddlRegistryOffice').int32()
                            },
                            regimeDateStart: jQuery('#txtRegimeDateStart').date(),
                            regimeDateEnd: jQuery('#txtRegimeDateEnd').date(),
                            numberRegimeConstancy: jQuery('#txtNumberRegimeConstancy').string(),
                            spouse: {
                                name: jQuery('#txtNameSpouse').string(),
                                lastName: jQuery('#txtLastNameSpouse').string(),
                                maidenName: jQuery('#txtMaidenNameSpouse').string(),
                                documentNumber: jQuery('#txtDocumentNumberSpouse').string(),
                                publicRecord: {
                                    file: jQuery('#txtFileSpouse').string(),
                                    place: jQuery('#txtPlaceSpouse').string()
                                },
                                nationality: { id: jQuery('#ddlNationalitySpouse').int32() },
                                identificationDocument: { id: jQuery('#ddlIdentificationDocumentSpouse').int32() },
                                registryOffice: { id: jQuery('#ddlRegistryOfficeSpouse').int32() }
                            },
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#ddlHolderType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo Titular.';
                                jQuery('#ddlHolderType').focus();
                            } if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            } if (jQuery('#ddlIdentificationDocument').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Documento de Identificacion.';
                                jQuery('#ddlIdentificationDocument').focus();
                            } if (jQuery('#txtDocumentNumber').string() === '') {
                                success = false;
                                message = 'Ingrese el Numero de Documento.';
                                jQuery('#txtDocumentNumber').focus();
                            } if (jQuery('#ddlHolderType').int32() !== 2) {
                                if (jQuery('#ddlNationality').int32() === 0) {
                                    message = 'Seleccione la Nacionalidad.';
                                    jQuery('#ddlNationality').focus();
                                    success = false;
                                } if (jQuery('#ddlCivilStatus').int32() === 0) {
                                    message = 'Seleccione el Estado Civil.';
                                    jQuery('#ddlCivilStatus').focus();
                                    success = false;
                                } if (jQuery('#txtMaidenName').string() === '') {
                                    message = 'Ingrese el Apellido Materno.';
                                    jQuery('#txtMaidenName').focus();
                                    success = false;
                                } if (jQuery('#txtLastName').string() === '') {
                                    message = 'Ingrese el Apellido Paterno.';
                                    jQuery('#txtLastName').focus();
                                    success = false;
                                }
                            } if (jQuery('#ddlHolderGroup').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Grupo Titular.';
                                jQuery('#ddlHolderGroup').focus();
                            } if (jQuery('#txtCorporateMail').string() === '') {
                                success = false;
                                message = 'Ingrese el Correo de la Empresa.';
                                jQuery('#txtCorporateMail').focus();
                            } if (jQuery('#ddlHolderRegime').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Regimen Titular.';
                                jQuery('#ddlHolderRegime').focus();
                            } if (jQuery('#txtRegimeDateStart').date() > jQuery('#txtRegimeDateEnd').date()) {
                                success = false;
                                message = 'La fecha de Inicio no puede ser mayor que la fecha de vencimiento.';
                                jQuery('#txtRegimeDateStart').focus();
                            } if (jQuery('#ddlDistrict').val() === null || jQuery('#ddlDistrict').string() === '0') {
                                success = false;
                                message = 'Seleccione el Distrito.';
                                jQuery('#ddlDistrict').focus();
                            } if (jQuery('#ddlRegistryOffice').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Sede Registral.';
                                jQuery('#ddlRegistryOffice').focus();
                            } if (jQuery('#txtResolution').string() === '') {
                                success = false;
                                message = 'Ingrese el Nº Resolución.';
                                jQuery('#txtResolution').focus();
                            } if (jQuery('#txtCertificate').string() === '') {
                                success = false;
                                message = 'Ingrese Nº Partida.';
                                jQuery('#txtCertificate').focus();
                            } if (jQuery('#txtPlace').string() === '') {
                                success = false;
                                message = 'Ingrese Nº Asiento.';
                                jQuery('#txtPlace').focus();
                            } if (jQuery('#ddlHolderType').val() != 2 && jQuery('#ddlCivilStatus').val() == 2) {
                                if (jQuery('#txtFileSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el número de ficha del cónyuge";
                                    jQuery('#txtFileSpouse').focus();
                                } if (jQuery('#txtPlaceSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el número de asiento del cónyuge";
                                    jQuery('#txtPlaceSpouse').focus();
                                } if (jQuery('#ddlRegistryOfficeSpouse').int32() === 0) {
                                    success = false;
                                    message = "Seleccione la Sede Registral del cónyuge";
                                    jQuery('#ddlRegistryOfficeSpouse').focus();
                                } if (jQuery('#txtDocumentNumberSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el número del documento del cónyuge";
                                    jQuery('#txtDocumentNumberSpouse').focus();
                                } if (jQuery('#ddlIdentificationDocumentSpouse').int32() === 0) {
                                    success = false;
                                    message = "Seleccione el documento de identificación del cónyuge";
                                    jQuery('#ddlIdentificationDocumentSpouse').focus();
                                } if (jQuery('#ddlNationalitySpouse').int32() === 0) {
                                    success = false;
                                    message = "Seleccione la nacionalidad del cónyuge";
                                    jQuery('#ddlNationalitySpouse').focus();
                                } if (jQuery('#txtMaidenNameSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el apellido materno del cónyuge";
                                    jQuery('#txtMaidenNameSpouse').focus();
                                } if (jQuery('#txtLastNameSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el apellido paterno del cónyuge";
                                    jQuery('#txtLastNameSpouse').focus();
                                } if (jQuery('#txtNameSpouse').string() === '') {
                                    success = false;
                                    message = "Ingrese el nombre del cónyugue";
                                    jQuery('#txtNameSpouse').focus();
                                }
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                holder.Main = Main;
            })(society.holder || (society.holder = {}));
            var holder = society.holder;
        })(jtm.society || (jtm.society = {}));
        var society = jtm.society;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.society.holder.Main.execute();