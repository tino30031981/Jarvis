(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (settler) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$txtLastNameSearch = null;
                        this.$txtMaidenNameSearch = null;
                        this.$txtDocumentNumberSearch = null;
                        this.$txtBirthDateSearch = null;
                        this.$txtBirthDateEndSearch = null;
                        this.$ddlSexSearch = null;
                        this.$ddlIdentificationDocumentSearch = null;
                        this.$ddlSpatialReferenceSearch = null;
                        this.$ddlDepartmentSearch = null;
                        this.$ddlProvinceSearch = null;
                        this.$ddlDistrictSearch = null;
                        this.$ddlHydrographicBasinSearch = null;
                        this.$ddlNationalCartographySearch = null;
                        this.$btnAddPhoto = null;
                        this.$filPhoto = null;
                        this.$btnDeletePhoto = null;
                        this.$hdnImageId = null;
                        this.$imgRecord = null;
                        this.$ddlImage = null;
                        this.$btnFirst = null;
                        this.$btnLast = null;
                        this.$btnPrevious = null;
                        this.$btnNext = null;
                        this.$txtLastName = null;
                        this.$txtMaidenName = null;
                        this.$txaObservation = null;
                        this.$ddlIdentificationDocument = null;
                        this.$txtDocumentNumber = null;
                        this.$txtAffiliationDate = null;
                        this.$txtBirthDate = null;
                        this.$txtPlaceBirth = null;
                        this.$txtPersonalMail = null;
                        this.$txtCode = null;
                        this.$txtLandline = null;
                        this.$txtMobile = null;
                        this.$txtWorkPlace = null;
                        this.$txtMonthlyIncome = null;
                        this.$chkIsHeadofFamily = null;
                        this.$chkIsResident = null;
                        this.$ddlSex = null;
                        this.$ddlInterestGroupType = null;
                        this.$ddlOccupation = null;
                        this.$ddlKinship = null;
                        this.$ddlLevelEducation = null;
                        this.$ddlLevelInfluence = null;
                        this.$ddlSpatialReference = null;
                        this.$btnAddMembers = null;
                        this.$btnEditMembers = null;
                        this.$btnQuitMembers = null;
                        this.$tblMembers = null;
                        this.$btnAddEntities = null;
                        this.$btnQuitEntities = null;
                        this.$tblEntities = null;
                        this.searchImages = function () {
                            var thiss = this;
                            var id = thiss.$hdnId.int32();
                            var options = {
                                isJson: false,
                                data: { id: id },
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + "socialresponsability/settler/searchimages", options, function (data) {
                                thiss.$imgRecord.attr('src', '');
                                thiss.$imgRecord.attr("alt", '');
                                if (data.length > 0) {
                                    thiss.fillRecordImages(data);
                                    thiss.$ddlImage.val(data[data.length - 1].id);
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
                            var $ddl = thiss.$ddlImage;
                            $ddl.empty();
                            for (var i = 0; i < items.length; i++) {
                                $ddl.append('<option name="' + items[i].id + '" value="' + items[i].id + '">Imagen ' + (i + 1) + '</option>');
                            }
                        };
                        this.navigationRecordHandler = function () {
                            var thiss = this;
                            var $ddl = thiss.$ddlImage;
                            var $img = thiss.$imgRecord;
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
                                thiss.$imgRecord.attr("src", "");
                                if (jQuery(this).int32() === 0) return;
                                thiss.$hdnImageId.val(jQuery(this).int32());
                                thiss.$imgRecord.attr("alt", "Imagen: " + jQuery(this).int32());
                                thiss.$imgRecord.attr("src", com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + jQuery(this).int32());
                            });
                            thiss.$btnFirst.off("click");
                            thiss.$btnFirst.on("click", function (e) {
                                $ddl.val($ddl.find("option:first-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            thiss.$btnLast.off("click");
                            thiss.$btnLast.on("click", function (e) {
                                $ddl.val($ddl.find("option:last-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            thiss.$btnPrevious.off("click");
                            thiss.$btnPrevious.on("click", function (e) {
                                var index = $ddl.find(":selected").index() - 1;
                                if (index >= 0) {
                                    $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                    $ddl.trigger("change");
                                }
                            });
                            thiss.$btnNext.off("click");
                            thiss.$btnNext.on("click", function (e) {
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
                            var options = {                                
                                data: { id: thiss.$hdnId.int32(), saveImage: true },
                                attachments: [{ id: "filPhoto", file: thiss.$filPhoto[0].files[0] }],
                                isJson: false,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/savedocumentimage', options, function (item) {
                                thiss.searchImages();
                                thiss.$filPhoto.val('');
                            });
                            function validate() {
                                if (thiss.$filPhoto.val() === '') {
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
                        this.formMember = function (id, title) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: '80%',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/settler/formmember", function () {
                                thiss.$hdnIdSettler = thiss.$divPopup.find('#hdnIdSettler');
                                thiss.$txtNameSettler = thiss.$divPopup.find('#txtNameSettler');
                                thiss.$txtLastNameSettler = thiss.$divPopup.find('#txtLastNameSettler');
                                thiss.$txtMaidenNameSettler = thiss.$divPopup.find('#txtMaidenNameSettler');
                                thiss.$txaObservationSettler = thiss.$divPopup.find('#txaObservationSettler');
                                thiss.$ddlIdentificationDocumentSettler = thiss.$divPopup.find('#ddlIdentificationDocumentSettler');
                                thiss.$txtDocumentNumberSettler = thiss.$divPopup.find('#txtDocumentNumberSettler');
                                thiss.$txtAffiliationDateSettler = thiss.$divPopup.find('#txtAffiliationDateSettler');
                                thiss.$txtBirthDateSettler = thiss.$divPopup.find('#txtBirthDateSettler');
                                thiss.$txtPlaceBirthSettler = thiss.$divPopup.find('#txtPlaceBirthSettler');
                                thiss.$txtPersonalMailSettler = thiss.$divPopup.find('#txtPersonalMailSettler');
                                thiss.$txtCodeSettler = thiss.$divPopup.find('#txtCodeSettler');
                                thiss.$txtLandlineSettler = thiss.$divPopup.find('#txtLandlineSettler');
                                thiss.$txtMobileSettler = thiss.$divPopup.find('#txtMobileSettler');
                                thiss.$txtWorkPlaceSettler = thiss.$divPopup.find('#txtWorkPlaceSettler');
                                thiss.$txtMonthlyIncomeSettler = thiss.$divPopup.find('#txtMonthlyIncomeSettler');
                                thiss.$ddlSexSettler = thiss.$divPopup.find('#ddlSexSettler');
                                thiss.$ddlInterestGroupTypeSettler = thiss.$divPopup.find('#ddlInterestGroupTypeSettler');
                                thiss.$ddlOccupationSettler = thiss.$divPopup.find('#ddlOccupationSettler');
                                thiss.$ddlKinshipSettler = thiss.$divPopup.find('#ddlKinshipSetller');
                                thiss.$ddlLevelEducationSettler = thiss.$divPopup.find('#ddlLevelEducationSettler');
                                thiss.$ddlLevelInfluenceSettler = thiss.$divPopup.find('#ddlLevelInfluenceSettler');
                                thiss.$chkStateSettler = thiss.$divPopup.find('#chkStateSettler');
                                thiss.$btnSaveMember = thiss.$divPopup.find('#btnSaveMember');
                                thiss.datePicker(thiss.$txtAffiliationDateSettler);
                                thiss.datePicker(thiss.$txtBirthDateSettler);
                                if (id > 0)
                                    thiss.detailMember(id);
                                thiss.$btnSaveMember.off("click");
                                thiss.$btnSaveMember.on("click", function (e) {
                                    thiss.saveMember();
                                });
                            });
                        };
                        this.searchMembers = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/searchmembers', {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            }, function (items) {
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + item.identificationDocument.name + '</td>';
                                    html += '<td>' + item.documentNumber + '</td>';
                                    html += '<td>' + item.kinship.name + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblMembers.find('>tbody').html(html);
                                thiss.$tblMembers.find('>caption>span').html(thiss.$tblMembers.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblMembers);
                            });
                        };
                        this.deleteMembers = function () {
                            var thiss = this;
                            var memberIds = com.jtm.helper.Table.getItems(thiss.$tblMembers, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), memberIds: memberIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (memberIds.length === 0) {
                                    alert('Seleccione al menos un miembro.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/deletemembers', options, function () { thiss.searchMembers(); });
                        };
                        this.saveMember = function () {
                            var thiss = this;
                            var item = {
                                id: thiss.$hdnIdSettler.int32(),
                                name: thiss.$txtNameSettler.val(),
                                lastName: thiss.$txtLastNameSettler.val(),
                                maidenName: thiss.$txtMaidenNameSettler.val(),
                                observation: thiss.$txaObservationSettler.val(),
                                birthDate: thiss.$txtBirthDateSettler.date(),
                                placeBirth: thiss.$txtPlaceBirthSettler.val(),
                                personalMail: thiss.$txtPersonalMailSettler.val(),
                                code: thiss.$txtCodeSettler.val(),
                                landline: thiss.$txtLandlineSettler.val(),
                                mobile: thiss.$txtMobileSettler.val(),
                                workPlace: thiss.$txtWorkPlaceSettler.val(),
                                monthlyIncome: thiss.$txtMonthlyIncomeSettler.val(),
                                documentNumber: thiss.$txtDocumentNumberSettler.val(),
                                affiliationDate: thiss.$txtAffiliationDateSettler.date(),
                                identificationDocument: { id: thiss.$ddlIdentificationDocumentSettler.int32() },
                                sex: { id: thiss.$ddlSexSettler.int32() },
                                interestGroupType: { id: thiss.$ddlInterestGroupTypeSettler.int32() },
                                occupation: { id: thiss.$ddlOccupationSettler.int32() },
                                kinship: { id: thiss.$ddlKinshipSettler.int32() },
                                levelEducation: { id: thiss.$ddlLevelEducationSettler.int32() },
                                levelInfluence: { id: thiss.$ddlLevelInfluenceSettler.int32() },
                                isHeadofFamily: thiss.$chkIsHeadofFamily.boolean(),
                                isResident: thiss.$chkIsResident.boolean(),
                                interestGroup: { id: thiss.$hdnId.int32() }, //si HAY interestGroup
                                state: thiss.$chkStateSettler.boolean(),
                                address: { home: null },//NO HAY ADDRESS
                            };
                            var options = {
                                data: item,
                                validate: validate()
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/save', options, function () {
                                thiss.searchMembers(); thiss.$divPopup.dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                //if (thiss.$txtPositionPower').string() === '') {
                                //    success = false;
                                //    message = 'Ingrese el Cargo.';
                                //    thiss.$txtPositionPower').focus();
                                //}
                                //else if (thiss.$txtFilePower').string() === '') {
                                //    success = false;
                                //    message = 'Ingrese el Numero de Ficha.';
                                //    thiss.$txtFilePower').focus();
                                //}
                                //else if (thiss.$txtPlacePower').string() === '') {
                                //    success = false;
                                //    message = 'Ingrese el Numero de Asiento.';
                                //    thiss.$txtPlacePower').focus();
                                //}
                                //else if (thiss.$txtStartDatePower').string() === '') {
                                //    success = false;
                                //    message = 'Ingrese una Fecha de Inicio.';
                                //    thiss.$txtStartDatePower').focus();
                                //}
                                //else if (thiss.$txtEndDatePower').string() === '') {
                                //    success = false;
                                //    message = 'Ingrese una Fecha Final.';
                                //    thiss.$txtEndDatePower').focus();
                                //}
                                //else if (thiss.$txtStartDatePower').date() > thiss.$txtEndDatePower').date()) {
                                //    success = false;
                                //    message = 'La fecha de Inicio no puede ser mayor que la fecha final.';
                                //    thiss.$txtStartDatePower').focus();
                                //}
                                //else if (thiss.$ddlStatePower').int32() === 0) {
                                //    success = false;
                                //    message = 'Seleccione un Poder de Estado.';
                                //    thiss.$ddlStatePower').focus();
                                //}
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailMember = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                validate: true
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/detail', options, function (data) {
                                var item = data.item;
                                thiss.$hdnIdSettler.val(item.id);
                                thiss.$txtNameSettler.val(item.name);
                                thiss.$txtLastNameSettler.val(item.lastName);
                                thiss.$txtMaidenNameSettler.val(item.maidenName);
                                thiss.$txaObservationSettler.val(item.observation);
                                thiss.$txtBirthDateSettler.val(item.birthDate);
                                thiss.$txtPlaceBirthSettler.val(item.placeBirth);
                                thiss.$txtAffiliationDateSettler.val(item.affiliationDate);
                                thiss.$txtPersonalMailSettler.val(item.personalMail);
                                thiss.$txtCodeSettler.val(item.code);
                                thiss.$txtLandlineSettler.val(item.landline);
                                thiss.$txtMobileSettler.val(item.mobile);
                                thiss.$ddlKinshipSettler.val(item.kinship.id === null ? 0 : item.kinship.id);
                                thiss.$txtDocumentNumberSettler.val(item.documentNumber);
                                thiss.$ddlIdentificationDocumentSettler.val(item.identificationDocument.id === null ? 0 : item.identificationDocument.id);
                                thiss.$ddlSexSettler.val(item.sex.id === null ? 0 : item.sex.id);
                                thiss.$ddlInterestGroupTypeSettler.val(item.interestGroupType.id === null ? 0 : item.interestGroupType.id);
                                thiss.$ddlOccupationSettler.val(item.occupation.id === null ? 0 : item.occupation.id);
                                thiss.$ddlLevelEducationSettler.val(item.levelEducation.id === null ? 0 : item.levelEducation.id);
                                thiss.$ddlLevelInfluenceSettler.val(item.levelInfluence.id === null ? 0 : item.levelInfluence.id);
                            });
                        };
                        this.searchEntities = function () {
                            var thiss = this;
                            thiss.$tblEntities.find('>tbody').empty();
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/searchentities', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillEntities(items, thiss.$tblEntities);
                            });
                        };
                        this.fillEntities = function (items, $tbl, entitiesExist) {
                            if (items === undefined || items === null) return;
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.identificationDocument.name + '</td>';
                                html += '<td>' + item.documentNumber + '</td>';
                                html += '</tr>';
                            });
                            $tbl.find('>tbody').html(html);
                            $tbl.find('>caption>span').html($tbl.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow($tbl);
                            if (entitiesExist !== undefined) {
                                entitiesExist.forEach(function (id) {
                                    $tbl.find('>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formEntity = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            thiss.$divPopup.dialog({
                                title: "Agregar Comunidades y otros",
                                width: '700',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "socialresponsability/settler/formentity", function () {
                                thiss.$tblEntities2 = thiss.$divPopup.find('#tblResultEntities2');
                                thiss.$btnSaveEntities = thiss.$divPopup.find('#btnSaveEntities');
                                thiss.$btnSearchEntities = thiss.$divPopup.find('#btnSearchEntities');
                                thiss.$txtNameEntities = thiss.$divPopup.find('#txtNameSearchEntity');
                                thiss.$btnSearchEntities.off("click");
                                thiss.$btnSearchEntities.on("click", function (e) {
                                    search();
                                });
                                thiss.$btnSaveEntities.off("click");
                                thiss.$btnSaveEntities.on("click", function (e) {
                                    thiss.saveEntities();
                                });
                                function search() {
                                    var data = {
                                        settlerId: thiss.$hdnId.int32(),
                                        name: thiss.$txtNameEntities.val()
                                    };
                                    var entitiesExist = com.jtm.helper.Table.getItems(thiss.$tblEntities, false, false);
                                    thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/entity/searchforsettler', {
                                        data: data,
                                        isJson: false
                                    }, function (items) {
                                        thiss.fillEntities(items, thiss.$tblEntities2, entitiesExist);
                                    });
                                }
                            });
                        };
                        this.saveEntities = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var entitiesIds = com.jtm.helper.Table.getItems(thiss.$tblEntities2, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), entitiesIds: entitiesIds },
                                isJson: false,
                                validate: validate()
                            };
                            thiss.saveConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/saveentities', options, function () {
                                thiss.$divPopup.dialog('close');
                                thiss.searchEntities();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (entitiesIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un elemento.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteEntities = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var entitiesIds = com.jtm.helper.Table.getItems(thiss.$tblEntities, true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), entitiesIds: entitiesIds },
                                isJson: false,
                                validate: validate()
                            };
                            function validate() {
                                if (entitiesIds.length === 0) {
                                    alert('Seleccione al menos un elemento');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'socialresponsability/settler/deleteentities', options, function () { thiss.searchEntities(); });
                        };
                    }
                    Main.BTNADDPHOTO = '#btnAddPhoto';
                    Main.BTNDELETEPHOTO = '#btnDeletePhoto';
                    Main.BTNFIRST = '#btnFirst';
                    Main.BTNLAST = '#btnLast';
                    Main.BTNPREVIOUS = '#btnPrevious';
                    Main.BTNNEXT = '#btnNext';
                    Main.FILPHOTO = '#filPhoto';
                    Main.HDNIMAGEID = '#hdnImageId';
                    Main.IMGRECORD = '#imgRecord';
                    Main.DDLIMAGE = '#ddlImage';
                    Main.TBLRESULTMEMBERS = '#tblResultMembers';
                    Main.BTNADDMEMBERS = '#btnAddMembers';
                    Main.BTNEDITMEMBERS = '#btnEditMembers';
                    Main.BTNQUITMEMBERS = '#btnQuitMembers';
                    Main.TBLRESULTENTITIES = '#tblResultEntities';
                    Main.BTNADDENTITIES = '#btnAddEntities';
                    Main.BTNQUITENTITIES = '#btnQuitEntities';
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        options.spatialJSFile = thiss.js.path + "socialresponsability/settler/" + this.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options, callback);
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "", { module: "socialresponsability", subModule: 'settler' });
                    };
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$txtLastNameSearch = this.$main.find('#txtLastNameSearch');
                        this.$txtMaidenNameSearch = this.$main.find('#txtMaidenNameSearch');
                        this.$txtDocumentNumberSearch = this.$main.find('#txtDocumentNumberSearch');
                        this.$txtBirthDateSearch = this.$main.find('#txtBirthDateSearch');
                        this.$txtBirthDateEndSearch = this.$main.find('#txtBirthDateEndSearch');
                        this.$ddlSexSearch = this.$main.find('#ddlSexSearch');
                        this.$ddlIdentificationDocumentSearch = this.$main.find('#ddlIdentificationDocumentSearch');
                        this.$ddlSpatialReferenceSearch = this.$main.find('#ddlSpatialReferenceSearch');
                        this.$ddlDepartmentSearch = this.$main.find('#ddlDepartmentSearch');
                        this.$ddlProvinceSearch = this.$main.find('#ddlProvinceSearch');
                        this.$ddlDistrictSearch = this.$main.find('#ddlDistrictSearch');
                        this.$ddlHydrographicBasinSearch = this.$main.find('#ddlHydrographicBasinSearch');
                        this.$ddlNationalCartographySearch = this.$main.find('#ddlNationalCartographySearch');
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(thiss.$txtBirthDateSearch);
                        thiss.datePicker(thiss.$txtBirthDateEndSearch);
                        thiss.fillPoliticalDivision(thiss.$ddlDepartmentSearch, thiss.$ddlProvinceSearch, thiss.$ddlDistrictSearch);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "socialresponsability/settler/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "socialresponsability/settler/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.$txtLastName = thiss.$form.find('#txtLastName');
                            thiss.$txtMaidenName = thiss.$form.find('#txtMaidenName');
                            thiss.$txaObservation = thiss.$form.find('#txaObservation');
                            thiss.$ddlIdentificationDocument = thiss.$form.find('#ddlIdentificationDocument');
                            thiss.$txtDocumentNumber = thiss.$form.find('#txtDocumentNumber');
                            thiss.$txtAffiliationDate = thiss.$form.find('#txtAffiliationDate');
                            thiss.$txtBirthDate = thiss.$form.find('#txtBirthDate');
                            thiss.$txtPlaceBirth = thiss.$form.find('#txtPlaceBirth');
                            thiss.$txtPersonalMail = thiss.$form.find('#txtPersonalMail');
                            thiss.$txtCode = thiss.$form.find('#txtCode');
                            thiss.$txtLandline = thiss.$form.find('#txtLandline');
                            thiss.$txtMobile = thiss.$form.find('#txtMobile');
                            thiss.$txtWorkPlace = thiss.$form.find('#txtWorkPlace');
                            thiss.$txtMonthlyIncome = thiss.$form.find('#txtMonthlyIncome');
                            thiss.$chkIsHeadofFamily = thiss.$form.find('#chkIsHeadofFamily');
                            thiss.$chkIsResident = thiss.$form.find('#chkIsResident');
                            thiss.$filPhoto = thiss.$form.find(Main.FILPHOTO);
                            thiss.$hdnImageId = thiss.$form.find(Main.HDNIMAGEID);
                            thiss.$imgRecord = thiss.$form.find(Main.IMGRECORD);
                            thiss.$ddlImage = thiss.$form.find(Main.DDLIMAGE);
                            thiss.$ddlSex = thiss.$form.find('#ddlSex');
                            thiss.$ddlInterestGroupType = thiss.$form.find('#ddlInterestGroupType');
                            thiss.$ddlOccupation = thiss.$form.find('#ddlOccupation');
                            thiss.$ddlKinship = thiss.$form.find('#ddlKinship');
                            thiss.$ddlLevelEducation = thiss.$form.find('#ddlLevelEducation');
                            thiss.$ddlLevelInfluence = thiss.$form.find('#ddlLevelInfluence');
                            thiss.$ddlSpatialReference = thiss.$form.find("ddlSpatialReference");
                            thiss.$btnAddPhoto = thiss.$form.find(Main.BTNADDPHOTO);
                            thiss.$btnDeletePhoto = thiss.$form.find(Main.BTNDELETEPHOTO);
                            thiss.$btnFirst = thiss.$form.find(Main.BTNFIRST);
                            thiss.$btnLast = thiss.$form.find(Main.BTNLAST);
                            thiss.$btnPrevious = thiss.$form.find(Main.BTNPREVIOUS);
                            thiss.$btnNext = thiss.$form.find(Main.BTNNEXT);
                            thiss.$btnAddMembers = thiss.$form.find(Main.BTNADDMEMBERS);
                            thiss.$btnEditMembers = thiss.$form.find(Main.BTNEDITMEMBERS);
                            thiss.$btnQuitMembers = thiss.$form.find(Main.BTNQUITMEMBERS);
                            thiss.$btnAddEntities = thiss.$form.find(Main.BTNADDENTITIES);
                            thiss.$btnQuitEntities = thiss.$form.find(Main.BTNQUITENTITIES);
                            thiss.$tblMembers = thiss.$form.find(Main.TBLRESULTMEMBERS);
                            thiss.$tblEntities = thiss.$form.find(Main.TBLRESULTENTITIES);
                            thiss.datePicker(thiss.$txtAffiliationDate);
                            thiss.datePicker(thiss.$txtBirthDate);
                            thiss.$btnAddPhoto.off("click");
                            thiss.$btnAddPhoto.on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.$filPhoto.trigger('click');
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            thiss.$filPhoto.off("change");
                            thiss.$filPhoto.on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    thiss.saveImage();
                                }
                            });
                            thiss.$btnDeletePhoto.off("click");
                            thiss.$btnDeletePhoto.on("click", function (e) {
                                if (thiss.$hdnImageId.int32() !== 0) {
                                    var id = thiss.$hdnImageId.int32();
                                    thiss.deleteImage(id);
                                }
                                else
                                    alert('No existe imagen para eliminar.');
                            });
                            thiss.$btnAddMembers.off("click");
                            thiss.$btnAddMembers.on("click", function (e) {
                                thiss.formMember(0, "Añadir miembros");
                            });
                            thiss.$btnQuitMembers.off("click");
                            thiss.$btnQuitMembers.on("click", function (e) {
                                thiss.deleteMembers();
                            });
                            thiss.$btnEditMembers.off("click");
                            thiss.$btnEditMembers.on("click", function (e) {
                                var id = thiss.getElementID(thiss.$tblMembers);
                                if (id > 0)
                                    thiss.formMember(id, "Editar miembros");
                                else
                                    toastr.info('Debes seleccionar un miembro.');
                            });
                            thiss.$btnAddEntities.off("click");
                            thiss.$btnAddEntities.on("click", function (e) {
                                thiss.formEntity();
                            });
                            thiss.$btnQuitEntities.off("click");
                            thiss.$btnQuitEntities.on("click", function (e) {
                                thiss.deleteEntities();
                            });
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/settler/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/settler/searchdocuments",
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
                            thiss.$txtName.val(item.name);
                            thiss.$txtLastName.val(item.lastName);
                            thiss.$txtMaidenName.val(item.maidenName);
                            thiss.$txaObservation.val(item.observation);
                            thiss.$txtBirthDate.val(item.birthDate);
                            thiss.$txtPlaceBirth.val(item.placeBirth);
                            thiss.$txtAffiliationDate.val(item.affiliationDate);
                            thiss.$txtPersonalMail.val(item.personalMail);
                            thiss.$txtCode.val(item.code);
                            thiss.$txtLandline.val(item.landline);
                            thiss.$txtMobile.val(item.mobile);
                            thiss.$ddlKinship.val(item.kinship.id === null ? 0 : item.kinship.id);
                            thiss.$txtDocumentNumber.val(item.documentNumber);
                            thiss.$ddlIdentificationDocument.val(item.identificationDocument.id === null ? 0 : item.identificationDocument.id);
                            thiss.$ddlSex.val(item.sex.id === null ? 0 : item.sex.id);
                            thiss.$ddlInterestGroupType.val(item.interestGroupType.id === null ? 0 : item.interestGroupType.id);
                            thiss.$ddlOccupation.val(item.occupation.id === null ? 0 : item.occupation.id);
                            thiss.$ddlLevelEducation.val(item.levelEducation.id === null ? 0 : item.levelEducation.id);
                            thiss.$ddlLevelInfluence.val(item.levelInfluence.id === null ? 0 : item.levelInfluence.id);
                            thiss.$txtWorkPlace.val(item.workPlace);
                            thiss.$txtMonthlyIncome.val(item.monthlyIncome);
                            thiss.$chkState.prop("checked", item.state);
                            thiss.$chkIsHeadofFamily.prop("checked", item.isHeadofFamily);
                            thiss.$chkIsResident.prop("checked", item.isResident);
                            thiss.formViewer.$ddlSpatialReference.val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "socialresponsability/settler/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "socialresponsability/settler/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "socialresponsability/settler/searchnationalcartographies", item.id, null);
                            thiss.formAttachment.search(item.id);
                            thiss.searchImages();
                            thiss.searchMembers();
                            thiss.searchEntities();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: 'name',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: "identificationDocument.name",
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
                        }, {
                            field: "levelInfluence.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "sex.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "levelEducation.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            name: thiss.$txtNameSearch.val(),
                            lastName: thiss.$txtLastNameSearch.val(),
                            maidenName: thiss.$txtMaidenNameSearch.val(),
                            documentNumber: thiss.$txtDocumentNumberSearch.val(),
                            birthDate: thiss.$txtBirthDateSearch.date(),
                            birthDateEnd: thiss.$txtBirthDateEndSearch.date(),
                            sex: { id: thiss.$ddlSexSearch.int32() },
                            identificationDocument: { id: thiss.$ddlIdentificationDocumentSearch.int32() },
                            district: {
                                id: thiss.$ddlDistrictSearch.val(),
                                province: {
                                    id: thiss.$ddlProvinceSearch.val(),
                                    department: { id: thiss.$ddlDepartmentSearch.val() }
                                }
                            },
                            nationalCartography: { id: thiss.$ddlNationalCartographySearch.val() },
                            hydrographicBasin: { id: thiss.$ddlHydrographicBasinSearch.val() },
                            spatialReference: { id: thiss.$ddlSpatialReferenceSearch.int32() },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.val(),
                            lastName: thiss.$txtLastName.val(),
                            maidenName: thiss.$txtMaidenName.val(),
                            observation: thiss.$txaObservation.val(),
                            birthDate: thiss.$txtBirthDate.date(),
                            placeBirth: thiss.$txtPlaceBirth.val(),
                            personalMail: thiss.$txtPersonalMail.val(),
                            code: thiss.$txtCode.val(),
                            landline: thiss.$txtLandline.val(),
                            mobile: thiss.$txtMobile.val(),
                            workPlace: thiss.$txtWorkPlace.val(),
                            documentNumber: thiss.$txtDocumentNumber.val(),
                            affiliationDate: thiss.$txtAffiliationDate.date(),
                            monthlyIncome: thiss.$txtMonthlyIncome.val(),
                            identificationDocument: { id: thiss.$ddlIdentificationDocument.int32() },
                            sex: { id: thiss.$ddlSex.int32() },
                            interestGroupType: { id: thiss.$ddlInterestGroupType.int32() },
                            occupation: { id: thiss.$ddlOccupation.int32() },
                            kinship: { id: thiss.$ddlKinship.int32() },
                            levelEducation: { id: thiss.$ddlLevelEducation.int32() },
                            levelInfluence: { id: thiss.$ddlLevelInfluence.int32() },
                            isHeadofFamily: thiss.$chkIsHeadofFamily.boolean(),
                            isResident: thiss.$chkIsResident.boolean(),
                            spatialReference: {
                                id: thiss.$ddlSpatialReference.int32()
                            },
                            state: thiss.$chkState.boolean(),
                            address: { home: null },//NO HAY ADDRESS
                            interestGroup: { id: 0 } // NO HAY interestGroup
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtName.val() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                thiss.$txtName.focus();
                            } else if (thiss.$txtLastName.val() === '') {
                                success = false;
                                message = 'Ingrese el Apellido paterno.';
                                thiss.$txtLastName.focus();
                            } else if (thiss.$txtMaidenName.val() === '') {
                                success = false;
                                message = 'Ingrese el Apellido materno.';
                                thiss.$txtMaidenName.focus();
                            } else if (thiss.$ddlSex.int32() === 0) {
                                success = false;
                                message = 'Seleccione el sexo.';
                                thiss.$ddlSex.focus();
                            } else if (thiss.$ddlKinship.int32() === 0) {
                                success = false;
                                message = 'Seleccione el parentesco.';
                                thiss.$ddlKinship.focus();
                            } else if (thiss.$ddlOccupation.int32() === 0) {
                                success = false;
                                message = 'Seleccione la ocupación.';
                                thiss.$ddlOccupation.focus();
                            } else if (thiss.$ddlLevelEducation.int32() === 0) {
                                success = false;
                                message = 'Seleccione el nivel de educación.';
                                thiss.$ddlLevelEducation.focus();
                            } else if (thiss.$ddlLevelInfluence.int32() === 0) {
                                success = false;
                                message = 'Seleccione el nivel de influencia.';
                                thiss.$ddlLevelInfluence.focus();
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
                })(jtm.geometry.BaseGeometry);
                settler.Main = Main;
            })(socialresponsability.settler || (socialresponsability.settler = {}));
            var settler = socialresponsability.settler;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.settler.Main.execute();