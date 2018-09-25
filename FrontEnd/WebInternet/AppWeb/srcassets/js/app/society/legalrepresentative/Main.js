(function (com) {
    (function (jtm) {
        (function (society) {
            (function (legalrepresentative) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "soc";
                        this.searchPowers = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'society/power/searchpowers', {
                                data: { legalRepresentativeId: this.$hdnId.int32(), holderId: jQuery("#ddlHolder").int32(), isList: false },
                                isJson: false
                            }, function (items) {
                                thiss.fillPowers(items, '#tblResultPowers', "#divTotalPower");
                                jQuery('#frmFaculties').empty();
                            });
                        };
                        this.fillPowers = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td class="number ' + i + '">' + (i + 1) + '</td>';
                                html += '<td>' + item.position + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.observation + '</td>';
                                html += '<td>' + item.statePower.name + '</td>';
                                html += '<td>' + item.startDate + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.publicRecord.file + '</td>';
                                html += '<td>' + item.publicRecord.place + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.deletePowers = function () {
                            var thiss = this;
                            var powerIds = com.jtm.helper.Table.getItems("#tbdResultPowers", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), powerIds: powerIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (powerIds.length === 0) {
                                    alert('Seleccione al menos Representate Legal.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'society/power/deletepowers', options, function () { thiss.searchPowers(); });
                        };
                        this.savePower = function () {
                            var thiss = this;
                            var itemsFaculties = com.jtm.helper.Table.getItems("#divFaculties2>#ulFaculties", true, true);
                            var item = {
                                id: jQuery('#hdnIdPower').int32(),
                                position: jQuery('#txtPositionPower').string(),
                                publicRecord: {
                                    file: jQuery('#txtFilePower').string(),
                                    place: jQuery('#txtPlacePower').string()
                                },
                                description: jQuery('#txaDescriptionPower').string(),
                                observation: jQuery('#txaObservationPower').string(),
                                startDate: jQuery('#txtStartDatePower').date(),
                                endDate: jQuery('#txtEndDatePower').date(),
                                startDescription: jQuery('#txtStartDescriptionPower').string(),
                                endDescription: jQuery('#txtEndDescriptionPower').string(),
                                legalRepresentative: {
                                    id: thiss.$hdnId.int32()
                                },
                                holder: {
                                    id: jQuery("#ddlHolder").int32()
                                },
                                statePower: {
                                    id: jQuery('#ddlStatePower').int32()
                                },
                                faculties: itemsFaculties,
                                state: jQuery('#chkStatePower').boolean()
                            };
                            var options = {
                                data: item,
                                attachments: [{ id: "filFilePower", file: jQuery('#filFilePower')[0].files[0] }],
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'society/power/save', options, function () {
                                thiss.searchPowers(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#txtPositionPower').string() === '') {
                                    success = false;
                                    message = 'Ingrese el Cargo.';
                                    jQuery('#txtPositionPower').focus();
                                }
                                else if (jQuery('#txtFilePower').string() === '') {
                                    success = false;
                                    message = 'Ingrese el Numero de Ficha.';
                                    jQuery('#txtFilePower').focus();
                                }
                                else if (jQuery('#txtPlacePower').string() === '') {
                                    success = false;
                                    message = 'Ingrese el Numero de Asiento.';
                                    jQuery('#txtPlacePower').focus();
                                }
                                else if (jQuery('#txtStartDatePower').string() === '') {
                                    success = false;
                                    message = 'Ingrese una Fecha de Inicio.';
                                    jQuery('#txtStartDatePower').focus();
                                }
                                else if (jQuery('#txtEndDatePower').string() === '') {
                                    success = false;
                                    message = 'Ingrese una Fecha Final.';
                                    jQuery('#txtEndDatePower').focus();
                                }
                                else if (jQuery('#txtStartDatePower').date() > jQuery('#txtEndDatePower').date()) {
                                    success = false;
                                    message = 'La fecha de Inicio no puede ser mayor que la fecha final.';
                                    jQuery('#txtStartDatePower').focus();
                                }
                                //else if (jQuery('#ddlStatePower').int32() === 0) {
                                //    success = false;
                                //    message = 'Seleccione un Poder de Estado.';
                                //    jQuery('#ddlStatePower').focus();
                                //}
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.formPower = function (id, title) {
                            var thiss = this;
                            if (jQuery('#ddlHolder').int32() === 0) {
                                alert('Seleccione un Titular');
                                return;
                            }
                            jQuery('#divPopup').dialog({
                                title: title,
                                fluid: true,
                                height: jQuery(window).height() - 100,
                                width: '750',
                                resizable: false,
                                closeOnEscape: true,
                                autoOpen: true,
                                modal: true,
                                autoremove: true
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "society/power/form", function () {
                                thiss.datePicker('#txtStartDatePower');
                                thiss.datePicker('#txtEndDatePower');
                                if (id > 0) {
                                    thiss.detailPower(id);
                                }
                                jQuery('#btnSavePower').off("click");
                                jQuery('#btnSavePower').on("click", function (e) {
                                    thiss.savePower();
                                });
                                jQuery('#divFaculties2>#ulFaculties').tree({
                                    initialState: "collapse"
                                });
                            });
                        };
                        this.detailPower = function (id) {
                            var thiss = this;
                            function validate() {
                                return true;
                            }
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'society/power/detail', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdPower').val(item.id);
                                jQuery('#txtPositionPower').val(item.position);
                                jQuery('#txaDescriptionPower').val(item.description);
                                jQuery('#txaObservationPower').val(item.observation);
                                jQuery('#txtStartDatePower').val(item.startDate);
                                jQuery('#txtEndDatePower').val(item.endDate);
                                jQuery('#txtStartDescriptionPower').val(item.startDescription);
                                jQuery('#txtEndDescriptionPower').val(item.endDescription);
                                jQuery('#txtFilePower').val(item.publicRecord != null ? item.publicRecord.file : "");
                                jQuery('#txtPlacePower').val(item.publicRecord != null ? item.publicRecord.place : "");
                                jQuery('#ddlStatePower').val(item.statePower != null ? item.statePower.id : 0);
                                jQuery('#chkStatePower').prop("checked", item.state);
                                for (i = 0; i < item.faculties.length; i++) {
                                    var chk = $('#divFaculties2>#ulFaculties input[value="' + item.faculties[i].id + '"]');
                                    if (chk.length > 0)
                                        jQuery(chk).attr("checked", true);
                                }
                                if (item.document.id !== null) {
                                    jQuery('#divFileAttachment').append('<a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + ' </a>' +
                                        '<button type="button" id="btnAttachment' + item.document.id + '" data-uniqueid="' + id + '" class="btn btn-default btn-xs"> <i class="glyphicon glyphicon-trash jca-cursor jca-file-remove"></i></button>');
                                    jQuery("#btnAttachment" + item.document.id + "").on("click", function (e) {
                                        thiss.deleteDocument(item.document.id);
                                    });
                                }
                            });
                        };
                        this.deleteDocument = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + "documentlibrary/document/delete", options, function () { jQuery('#divFileAttachment').empty(); });
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        jQuery('#txtDocumentNumberSearch').numeric({ negative: false });
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            thiss.fillPoliticalDivision();
                            jQuery('#txtLandLine').numeric({ negative: false });
                            jQuery('#txtMobile').numeric({ negative: false });
                            jQuery('#txtDocumentNumber').numeric({ negative: false });
                            jQuery('#btnAddPower').off("click");
                            jQuery('#btnAddPower').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formPower(0, "Agregar Poder");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnUpdatePower').off("click");
                            jQuery('#btnUpdatePower').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultPowers');
                                if (id > 0)
                                    thiss.formPower(id, "Editar Poder");
                                else
                                    alert('Debes seleccionar una fila.');
                            });
                            jQuery('#btnQuitPowers').off("click");
                            jQuery('#btnQuitPowers').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deletePowers();
                                else
                                    alert('Debes seleccionar una fila.');
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
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#txtDocumentNumber').val(item.documentNumber);
                            jQuery('#txtLandLine').val(item.landLine);
                            jQuery('#txtMobile').val(item.mobile);
                            jQuery('#txtHome').val(item.address.home);
                            jQuery('#txtUrbanization').val(item.address.urbanization);
                            jQuery('#ddlDepartment').val(item.district.province.department.id);
                            jQuery('#ddlDepartment').trigger("change");
                            jQuery('#ddlProvince').val(item.district.province.id);
                            jQuery('#ddlProvince').trigger("change");
                            jQuery('#ddlDistrict').val(item.district.id);
                            jQuery('#ddlHolder').off("click");
                            jQuery("#ddlHolder").on("change", function () {
                                thiss.searchPowers();
                            });
                            jQuery('#ddlIdentificationDocument').val(item.identificationDocument.id);
                            jQuery('#ddlNationality').val(item.nationality.id);
                            jQuery('#chkState').prop("checked", item.state);
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + "society/legalrepresentative/searchholders",
                                ddl: "#ddlHolder",
                                data: { id: item.id }
                            });
                            jQuery('#tblResultPowers').off();
                            jQuery('#tblResultPowers').on("dblclick", ">tbody>tr", function (e) {
                                var id = jQuery(this).find("input:checkbox").val();
                                var number = jQuery(this).attr("data-index");
                                thiss.loadView("#frmFaculties", com.jtm.Server.contextPath + "society/power/searchfaculties?id=" + id, function () {
                                    jQuery('#divFaculties>#ulFaculties').tree({
                                        initialState: "collapse"
                                    });
                                    var title = jQuery('#frmFaculties>.panel>.panel-heading').text();
                                    jQuery('#frmFaculties>.panel>.panel-heading').text(title + " " + number);
                                    $('#divFaculties>#ulFaculties input:checkbox').attr("checked", true);
                                    $('#divFaculties>#ulFaculties input:checkbox').attr('disabled', true);
                                });
                            });
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
                            field: "identificationDocument.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
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
                            documentNumber: jQuery('#txtDocumentNumberSearch').string(),
                            district: {
                                id: jQuery('#ddlDistrictSearch').string()
                            },
                            nationality: {
                                id: jQuery('#ddlNationalitySearch').int32()
                            },
                            holder: {
                                id: jQuery('#ddlHolderSearch').int32()
                            },
                            identificationDocument: {
                                id: jQuery('#ddlIdentificationDocumentSearch').int32()
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
                            observation: jQuery('#txaObservation').string(),
                            documentNumber: jQuery('#txtDocumentNumber').string(),
                            landLine: jQuery('#txtLandLine').string(),
                            mobile: jQuery('#txtMobile').string(),
                            address: {
                                home: jQuery('#txtHome').string(),
                                urbanization: jQuery('#txtUrbanization').string()
                            },
                            corporateMail: jQuery('#txtCorporateMail').string(),
                            personalMail: jQuery('#txtPersonalMail').string(),
                            district: {
                                id: jQuery('#ddlDistrict').string()
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
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#txtLastName').string() === '') {
                                success = false;
                                message = 'Ingrese el Apellido Paterno.';
                                jQuery('#txtLastName').focus();
                            } else if (jQuery('#txtMaidenName').string() === '') {
                                success = false;
                                message = 'Ingrese el Apellido Materno.';
                                jQuery('#txtMaidenName').focus();
                            } else if (jQuery('#ddlNationality').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Nacionalidad.';
                                jQuery('#ddlNationality').focus();
                            } else if (jQuery('#ddlIdentificationDocument').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Documento de Identificacion.';
                                jQuery('#ddlIdentificationDocument').focus();
                            } else if (jQuery('#txtDocumentNumber').string() === '') {
                                success = false;
                                message = 'Ingrese el Numero de Documento.';
                                jQuery('#txtDocumentNumber').focus();
                            } else if (jQuery('#ddlDistrict').val() === null || jQuery('#ddlDistrict').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Distrito.';
                                jQuery('#ddlDistrict').focus();
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
                legalrepresentative.Main = Main;
            })(society.legalrepresentative || (society.legalrepresentative = {}));
            var legalrepresentative = society.legalrepresentative;
        })(jtm.society || (jtm.society = {}));
        var society = jtm.society;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.society.legalrepresentative.Main.execute();