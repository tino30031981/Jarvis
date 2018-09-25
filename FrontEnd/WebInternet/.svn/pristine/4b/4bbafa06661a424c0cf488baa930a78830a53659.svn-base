(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mp";
                        this.tracing = null;
                        this.procedure = null;
                        this.$tblResultAlerts = null;
                        this.$divTotalAlert = null;
                        this.$divProcedureDocuments = null;
                        this.$ulDocumentProcedure = null;
                        this.$divRequirementDocuments = null;
                        this.$btnShowHide = null;
                        this.file = null;
                        this.searchStageOperation = function ($ddl1, $ddl2) {
                            var thiss = this;
                            com.jtm.helper.DropDownList.fill({
                                url: com.jtm.Server.contextPath + "miningproject/stageoperation/searchbycategory",
                                ddl: $ddl1,
                                data: { categoryId: $ddl2.int32() }
                            });
                        };
                        this.searchMiningConcessions = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/searchminingconcessions',
                                {
                                    data: { id: thiss.$hdnId.int32() }
                                }, function (items) {
                                    thiss.fillMiningConcessions(items, '#tblResultMiningConcessions', "#divTotalMiningConcession");
                                });
                        };
                        this.saveMiningConcessions = function () {
                            var thiss = this;
                            var miningConcessionIds = com.jtm.helper.Table.getItems("#tbdResultMiningConcessions2", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningConcessionIds: miningConcessionIds },
                                validate: validate,
                                isJson: false
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/saveminingconcessions', options, function () {
                                thiss.searchMiningConcessions(); jQuery('#divPopupMiningProject').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (miningConcessionIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteMiningConcessions = function () {
                            var thiss = this;
                            var miningConcessionIds = com.jtm.helper.Table.getItems("#tbdResultMiningConcessions", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), miningConcessionIds: miningConcessionIds },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/deleteminingconcessions', options, function () { thiss.searchMiningConcessions(); });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (miningConcessionIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.fillMiningConcessions = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.formulationDate + '</td>';
                               // html += '<td>' + item.holder.name + '</td>';
                                html += '<td>' + item.mineralType.name + '</td>';
                                html += '<td>' + item.situation.name + '</td>';
                                html += '<td>' + item.netArea + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (itemsExist !== undefined) {
                                itemsExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formMiningConcession = function () {
                            var thiss = this;
                            jQuery('#divPopupMiningProject').dialog({
                                title: "Integrantes",
                                width: '800',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopupMiningProject', com.jtm.Server.contextPath + "miningconcession/miningconcession/formassign", function () {
                                jQuery('#btnSearchMiningConcession').off("click");
                                jQuery('#btnSearchMiningConcession').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveMiningConcession').off("click");
                                jQuery('#btnSaveMiningConcession').on("click", function (e) {
                                    thiss.saveMiningConcessions();
                                });
                                jQuery('#btnClearMiningConcession').off("click");
                                jQuery('#btnClearMiningConcession').on("click", function (e) {
                                    jQuery('#txtCodeSearchMiningConcession').val('');
                                    jQuery('#txtNameSearchMiningConcession').val('');
                                    jQuery('#ddlHolderSearchMiningConcession').val(0);
                                    jQuery('#ddlMineralTypeSearchMiningConcession').val(0);
                                });
                            });
                            function search() {
                                jQuery('#tbdResultMiningConcessions2').empty();
                                var item = {
                                    code: jQuery('#txtCodeSearchMiningConcession').val(),
                                    name: jQuery('#txtNameSearchMiningConcession').val(),
                                    holder: { id: jQuery('#ddlHolderSearchMiningConcession').val() },
                                    mineralType: { id: jQuery('#ddlMineralTypeSearchMiningConcession').val(), },
                                    miningProject: { id: thiss.$hdnId.int32() }
                                };
                                var itemsExist = com.jtm.helper.Table.getItems("#tbdResultMiningConcessions", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/searchforminingproject', { data: item }, function (items) {
                                    thiss.fillMiningConcessions(items, '#tblResultMiningConcessions2', "#divTotalMiningConcession2", itemsExist);
                                });
                            }
                        };
                        this.searchDrillings = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/searchdrillings',
                                {
                                    data: { id: thiss.$hdnId.int32() }
                                }, function (items) {
                                    thiss.fillDrillings(items, '#tblResultDrillings', "#divTotalDrilling");
                                });
                        };
                        this.detailDrilling = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/detaildrilling', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdDrilling').val(item.id);
                                jQuery('#ddlYearDrilling').val(item.year);
                                jQuery('#txtProgrammedMeterDrilling').val(item.programmedMeter);
                                jQuery("#txtProgrammedSolesDrilling").val(item.programmedSoles);
                                jQuery("#txtExecutedMeterDrilling").val(item.executedMeter);
                                jQuery("#txtExecutedSolesDrilling").val(item.executedSoles);
                                jQuery('#chkStateDrilling').prop('checked', item.state);
                            });
                            function validate() {
                                return true;
                            }
                        };
                        this.saveDrilling = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdDrilling').int32(),
                                year: jQuery('#ddlYearDrilling').int32(),
                                programmedMeter: jQuery('#txtProgrammedMeterDrilling').val(),
                                programmedSoles: jQuery('#txtProgrammedSolesDrilling').val(),
                                executedMeter: jQuery('#txtExecutedMeterDrilling').val(),
                                executedSoles: jQuery('#txtExecutedSolesDrilling').val(),
                                miningProject: { id: thiss.$hdnId.int32() },
                                state: jQuery('#chkStateDrilling').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/savedrilling', options, function () {
                                thiss.searchDrillings(); jQuery('#divPopupMiningProject').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#ddlYearDrilling').val() === '0') {
                                    success = false;
                                    message = 'Seleccione un año';
                                    jQuery('#ddlYearDrilling').focus();
                                } else
                                    if (jQuery('#txtProgrammedMeterDrilling').val() === '') {
                                        success = false;
                                        message = 'Ingrese metros programado.';
                                        jQuery('#txtProgrammedMeterDrilling').focus();
                                    } else
                                        if (jQuery('#txtProgrammedSolesDrilling').val() === '') {
                                            success = false;
                                            message = 'Ingrese soles programados';
                                            jQuery('#txtProgrammedSolesDrilling').focus();
                                        } else
                                            if (jQuery('#txtExecutedMeterDrilling').val() === '') {
                                                success = false;
                                                message = 'Ingrese metros ejecutados';
                                                jQuery('#txtExecutedMeterDrilling').focus();
                                            } else
                                                if (jQuery('#txtExecutedSolesDrilling').val() === '') {
                                                    success = false;
                                                    message = 'Ingrese soles programados';
                                                    jQuery('#txtExecutedSolesDrilling').focus();
                                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteDrillings = function () {
                            var thiss = this;
                            var drillingIds = com.jtm.helper.Table.getItems("#tbdResultDrillings", true, false);
                            var options = {
                                data: { drillingIds: drillingIds },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/deletedrillings', options, function () { thiss.searchDrillings(); });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (drillingIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos una perforación.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.fillDrillings = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + item.year + '</td>';
                                html += '<td>' + item.programmedMeter + '</td>';
                                html += '<td>' + item.programmedSoles + '</td>';
                                html += '<td>' + item.executedMeter + '</td>';
                                html += '<td>' + item.executedSoles + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.formDrilling = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopupMiningProject').dialog({
                                title: title,
                                width: '450',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopupMiningProject', com.jtm.Server.contextPath + "miningproject/miningproject/formdrilling", function () {
                                jQuery('#txtProgrammedMeterDrilling').numeric({ negative: false });
                                jQuery('#txtProgrammedSolesDrilling').numeric({ negative: false });
                                jQuery('#txtExecutedMeterDrilling').numeric({ negative: false });
                                jQuery('#txtExecutedSolesDrilling').numeric({ negative: false });
                                if (id > 0) {
                                    jQuery('#ddlYearDrilling').attr('disabled', true);
                                    thiss.detailDrilling(id);
                                } else { jQuery('#ddlYearDrilling').attr('disabled', false); jQuery('#chkStateDrilling').prop('checked', 'on'); }
                                jQuery('#btnSaveDrilling').off("click");
                                jQuery('#btnSaveDrilling').on("click", function (e) {
                                    thiss.saveDrilling();
                                });
                            });
                        };
                        this.searchReserves = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/searchreserves', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                thiss.fillReserves(items, '#tblResultReserves', "#divTotalReserve");
                            });
                        };
                        this.detailReserve = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                validate: validate
                            };
                            this.detailConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/detailReserve', options, function (data) {
                                var item = data.item;
                                jQuery('#hdnIdReserve').val(item.id);
                                jQuery('#ddlYearReserve').val(item.year);
                                jQuery('#txtReserveProbableReserve').val(item.reserveProbable);
                                jQuery("#txtReserveTestedReserve").val(item.reserveTested);
                                jQuery('#ddlMineralReserve').val(item.mineral.id);
                                jQuery('#txaDescriptionReserve').val(item.description);
                                jQuery('#chkStateReserve').prop('checked', item.state);
                            });
                            function validate() {
                                return true;
                            }
                        };
                        this.saveReserve = function () {
                            var thiss = this;
                            var item = {
                                id: jQuery('#hdnIdReserve').val(),
                                miningProject: { id: thiss.$hdnId.int32() },
                                year: jQuery('#ddlYearReserve').val(),
                                mineral: { id: jQuery('#ddlMineralReserve').int32() },
                                reserveProbable: jQuery('#txtReserveProbableReserve').val(),
                                reserveTested: jQuery('#txtReserveTestedReserve').val(),
                                description: jQuery('#txaDescriptionReserve').val(),
                                state: jQuery('#chkStateReserve').boolean()
                            };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/savereserve', options, function () {
                                thiss.searchReserves(); jQuery('#divPopupMiningProject').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (jQuery('#ddlYearReserve').val() === '0') {
                                    success = false;
                                    message = 'Seleccione un año';
                                } else
                                    if (jQuery('#ddlMineralReserve').val() === 0) {
                                        success = false;
                                        message = 'Seleccione un Mineral';
                                    } else
                                        if (jQuery('#txtReserveProbableReserve').val() === '') {
                                            success = false;
                                            message = 'Ingrese Recurso indicado';
                                        } else
                                            if (jQuery('#txtReserveTestedReserve').val() === '') {
                                                success = false;
                                                message = 'Ingrese recurso inferido';
                                            } else
                                                if (message !== '')
                                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteReserves = function () {
                            var thiss = this;
                            var reserveIds = com.jtm.helper.Table.getItems("#tbdResultReserves", true, false);
                            var options = {
                                data: { reserveIds: reserveIds },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/deletereserves', options, function () { thiss.searchReserves(); });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (reserveIds.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos una Reserva.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.fillReserves = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + item.year + '</td>';
                                html += '<td>' + item.mineral.name + '</td>';
                                html += '<td>' + item.reserveProbable + '</td>';
                                html += '<td>' + item.reserveTested + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.formReserve = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopupMiningProject').dialog({
                                title: title,
                                width: '550',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopupMiningProject', com.jtm.Server.contextPath + "miningproject/miningproject/formreserve", function () {
                                jQuery('#txtReserveProbableReserve').numeric({ negative: false });
                                jQuery('#txtReserveTestedReserve').numeric({ negative: false });
                                if (id > 0) {
                                    jQuery('#ddlYearReserve').attr('disabled', true);
                                    thiss.detailReserve(id);
                                } else { jQuery('#ddlYearReserve').attr('disabled', false); jQuery('#chkStateReserve').prop('checked', 'on'); }
                                jQuery('#btnSaveReserve').off();
                                jQuery('#btnSaveReserve').on("click", function (e) {
                                    thiss.saveReserve();
                                });
                            });
                        };
                        this.searchAlerts = function () {
                            var thiss = this;
                            var options = {
                                data: { id: thiss.$hdnId.int32() },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/miningproject/searchalerts', options, function (items) {
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
                        this.setFile = function (file2) {
                            this.file = {
                                id: 0,
                                name: file2.name,
                                originalName: file2.name,
                                size: file2.size,
                                contentType: file2.type,
                                status: 'none',
                                file: file2
                            };
                        };
                        this.searchPermissions = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningproject/permission/searchbyminingproject',
                                { data: { miningProjectId: thiss.$hdnId.int32() } }, function (items) {
                                    thiss.fillPermissions(items, '#tblResultPermissions', "#divTotalPermission");
                                });
                        };
                        this.fillPermissions = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.description + '</td>';
                                html += '<td>' + item.type + '</td>';
                                html += '<td>' + item.generatingEntity + '</td>';
                                html += '<td>' + item.approvedResolution + '</td>';
                                html += '<td>' + item.dateApprovedResolution + '</td>';
                                html += '<td>' + item.expirationDate + '</td>';
                                html += '<td>' + item.document.name + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').empty();
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            if (itemsExist !== undefined) {
                                itemsExist.forEach(function (id) {
                                    jQuery(tbl + '>tbody>tr input:checkbox[value="' + id + '"]').attr("checked", true);
                                });
                            }
                        };
                        this.formPermissions = function (id, title) {
                            var thiss = this;
                            jQuery('#divPopupMiningProject').dialog({
                                title: title,
                                width: '500',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopupMiningProject', com.jtm.Server.contextPath + "miningproject/permission/form", function () {
                                thiss.datePicker('#txtDateApprovedResolution');
                                thiss.datePicker('#txtExpirationDate');
                                $('#btnFile').off('click');
                                $('#btnFile').on('click', function (e) {
                                    $('#filFile').trigger("click");
                                });
                                $('#filFile').off("change");
                                $('#filFile').on("change", function (e) {
                                    if (e.originalEvent.target.files.length) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        $('#txtDocumentName').val(e.originalEvent.target.files[0].name);
                                        thiss.setFile(e.originalEvent.target.files[0]);
                                    }
                                });
                                jQuery('#btnSavePermission').off("click");
                                jQuery('#btnSavePermission').on("click", function (e) {
                                    thiss.savePermissions();
                                });
                                if (id > 0)
                                    thiss.detailPermissions(id);
                            });
                        };
                        this.savePermissions = function () {
                            var thiss = this;
                            var document = null;
                            if (thiss.file === null) {
                                document = { id: $('#hdnIdDocument').int32() };
                            }
                            else {
                                document = thiss.file;
                                document.name = $('#txtDocumentName').val();
                            }
                            var options = {
                                data: {
                                    id: $('#hdnIdPermission').int32(),
                                    miningProjectId: thiss.$hdnId.int32(),
                                    type: $('#ddlEnvironmentalIssueType').int32(),
                                    description: $('#txaDescriptionPermission').val(),
                                    generatingEntity: $('#txtGeneratingEntity').val(),
                                    approvedResolution: $('#txtApprovedResolution').val(),
                                    dateApprovedResolution: $('#txtDateApprovedResolution').date(),
                                    expirationDate: $('#txtExpirationDate').date(),
                                    affectedArea: $('#txtAffectedArea').int32(),
                                    document: document
                                    //state: 1 // chkPermission
                                },
                                isJson: false,
                                validate: validate()
                            };
                            if (thiss.file !== null)
                                options.attachments = [{ id: "filFile", file: thiss.file.file }];
                            this.saveConfig(com.jtm.Server.contextPath + 'miningproject/permission/save', options, function () {
                                thiss.searchPermissions(); jQuery('#divPopupMiningProject').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                /*if (miningConcessionIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                }*/
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deletePermissions = function () {
                            var thiss = this;
                            var permissionIds = com.jtm.helper.Table.getItems("#tbdResultPermissions", true, false);
                            var options = {
                                data: { Ids: permissionIds },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningproject/permission/deletemasive', options, function () {
                                thiss.searchPermissions();
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (permissionIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.detailPermissions = function (id) {
                            var thiss = this;
                            thiss.detailConfig(com.jtm.Server.contextPath + "miningproject/permission/detail", { data: { id: id }, async: false }, function (data) {
                                var item = data.item;
                                $('#hdnIdPermission').val(item.id);
                                $('#ddlEnvironmentalIssueType').val(item.type);
                                $('#txtGeneratingEntity').val(item.generatingEntity);
                                $('#txtApprovedResolution').val(item.approvedResolution);
                                $('#txaDescriptionPermission').val(item.description);
                                $('#txtDateApprovedResolution').val(item.dateApprovedResolution);
                                $('#txtExpirationDate').val(item.expirationDate);
                                $('#txtAffectedArea').val(item.affectedArea);
                                //$('#chkStateReserve').val(item.state);
                                $('#btnFile').attr('disabled', 'disabled');
                                $('#hdnIdDocument').val(item.document.id);
                                $('#txtDocumentName').val(item.document.name).attr('readonly', 'readonly');
                            });
                        };
                    }
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            /*jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "general/baseprocedure.js");
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/procedure.js", function (data, textStatus, jqxhr) {
                                thiss.procedure = getInstance();
                                thiss.procedure.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });*/
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                            /*jQuery.ajaxSetup({ async: true });
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "miningproject/miningproject/folder.js", function (data, textStatus, jqxhr) {
                                thiss.folder = getInstance();
                            });
                            jQuery.ajaxSetup({ async: true });*/
                        });
                    };
                    /*Main.prototype.folderConfig = function () {
                    };*/
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        /*jQuery('#btnProcedure').off("click");
                        jQuery('#btnProcedure').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.procedure.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });*/
                        /*jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            if (id !== 0)
                                thiss.folder.load(thiss.$form, { id: id });
                            else
                                alert("Por favor seleccione un elemento");
                        });*/
                        jQuery('#btnFolder').off("click");
                        jQuery('#btnFolder').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.folder.load(thiss.$form, {
                                urlDelete: com.jtm.Server.contextPath + 'miningproject/folder/delete',
                                urlForm: com.jtm.Server.contextPath + "miningproject/folder/form",
                                urlListFolder: com.jtm.Server.contextPath + 'miningproject/folder/listfolder',
                                urlSave: com.jtm.Server.contextPath + "miningproject/folder/save",
                                urlFormFolder: com.jtm.Server.contextPath + "miningproject/folder/formfolder"
                            });
                        });
                        if (thiss.config.module.isCoorporate)
                            jQuery('#btnFolder').hide();
                    };
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.uiConfig = function () {
                        var thiss = this;
                        _super.prototype.uiConfig.call(this);
                        jQuery('#ddlCategorySearch').off("change");
                        jQuery('#ddlCategorySearch').on("change", function (e) {
                            thiss.searchStageOperation(jQuery('#ddlStageOperationSearch'), jQuery('#ddlCategorySearch'));
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "miningproject/miningproject/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "miningproject/miningproject/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.datePicker('#txtTitleDate');
                            thiss.datePicker('#txtFormulationDate');
                            thiss.datePicker('#txtTitleRegistrationDate');
                            thiss.datePicker('#txtCoordinateRegistrationDate');
                            thiss.datePicker('#txtDateOrigin');
                            thiss.$tblResultAlerts = thiss.$form.find('#tblResultAlerts');
                            thiss.$divTotalAlert = thiss.$form.find('#divTotalAlert');
                            thiss.$divProcedureDocuments = thiss.$form.find('#divProcedureDocuments');
                            thiss.$ulDocumentProcedure = thiss.$divProcedureDocuments.find('#ulDocumentProcedure');
                            thiss.$divRequirementDocuments = thiss.$divProcedureDocuments.find('>.panel-body>.panel-default');
                            thiss.$btnShowHide = thiss.$divProcedureDocuments.find('#btnShowHide');
                            thiss.$divRequirementDocuments.hide();
                            jQuery('#btnAddMiningConcession').off("click");
                            jQuery('#btnAddMiningConcession').on("click", function (e) {
                                if (id !== 0)
                                    thiss.formMiningConcession();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitMiningConcession').off("click");
                            jQuery('#btnQuitMiningConcession').on("click", function (e) {
                                thiss.deleteMiningConcessions();
                            });
                            jQuery('#btnAddDrilling').off();
                            jQuery('#btnAddDrilling').on("click", function (e) {
                                if (id !== 0)
                                    thiss.formDrilling(0, "Agregar Perforación");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnEditDrilling').off("click");
                            jQuery('#btnEditDrilling').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultDrillings');
                                if (id > 0) {
                                    thiss.formDrilling(id, "Modificar Perforación");
                                }
                                else
                                    alert('Seleccione una perforación.');
                            });
                            jQuery('#btnQuitDrilling').off("click");
                            jQuery('#btnQuitDrilling').on("click", function (e) {
                                thiss.deleteDrillings();
                            });
                            jQuery('#btnAddReserve').off("click");
                            jQuery('#btnAddReserve').on("click", function (e) {
                                if (id !== 0)
                                    thiss.formReserve(0, "Agregar Reserva");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnEditReserve').off("click");
                            jQuery('#btnEditReserve').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultReserves');
                                if (id > 0) {
                                    thiss.formReserve(id, "Modificar Reserva");
                                }
                                else
                                    alert('Seleccione una Reserva.');
                            });
                            jQuery('#btnQuitReserve').off("click");
                            jQuery('#btnQuitReserve').on("click", function (e) {
                                thiss.deleteReserves();
                            });
                            jQuery('#ddlCategory').off("change");
                            jQuery('#ddlCategory').on("change", function (e) {
                                thiss.searchStageOperation(jQuery('#ddlStageOperation'), jQuery('#ddlCategory'));
                            });
                            jQuery('#btnAddPermission').off("click");
                            jQuery('#btnAddPermission').on("click", function (e) {
                                if (id !== 0)
                                    thiss.formPermissions(0, "Agregar Permiso");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnEditPermission').off("click");
                            jQuery('#btnEditPermission').on("click", function (e) {
                                var id = thiss.getElementID('#tblResultPermissions');
                                if (id > 0) {
                                    thiss.formPermissions(id, "Modificar Permiso");
                                }
                                else
                                    alert('Seleccione un Permiso.');
                            });
                            jQuery('#btnDeletePermission').off("click");
                            jQuery('#btnDeletePermission').on("click", function (e) {
                                thiss.deletePermissions();
                            });
                            if (thiss.config.module.isCoorporate)
                                jQuery('#divFormTracing').hide();
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
                            jQuery('#txaGeology').val(item.geology);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlExploitationMethod').val(item.exploitationMethod.id === null ? 0 : item.exploitationMethod.id);
                            jQuery('#ddlDepositOrigin').val(item.depositOrigin.id === null ? 0 : item.depositOrigin.id);
                            jQuery('#ddlCategory').val(item.category.id);
                            jQuery('#ddlCategory').trigger("change");
                            jQuery('#ddlDepositType').val(item.depositType.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                            jQuery('#ddlStageOperation').val(item.stageOperation.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#txtMineralType').val(item.miningConcession.mineralType.name);
                             jQuery('#txtMiningUnit').val(item.miningConcession.miningUnit.name);
                            jQuery('#txtHolderGroup').val(item.miningConcession.holder.holderGroup.name);
                            jQuery('#txtMineralName').val(item.miningConcession.mineral.name);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "miningproject/miningproject/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "miningproject/miningproject/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "miningproject/miningproject/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "miningproject/miningproject/searchtowncenters", item.id, null);
                            thiss.searchMiningConcessions();
                            thiss.searchDrillings();
                            thiss.searchReserves();
                            thiss.searchPermissions();
                            thiss.searchAlerts();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                        });
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
                            field: "geology",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "stageOperation.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "depositType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "depositOrigin.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "miningConcessionLength",
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
                            stageOperation: { id: jQuery('#ddlStageOperationSearch').int32() },
                            category: { id: jQuery('#ddlCategorySearch').int32() },
                            depositType: { id: jQuery('#ddlDepositTypeSearch').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnitSearch').int32() },
                            mineralType: { id: jQuery('#ddlMineralTypeSearch').int32() },
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
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            observation: jQuery('#txaObservation').string(),
                            geology: jQuery('#txaGeology').string(),
                            stageOperation: { id: jQuery('#ddlStageOperation').int32() },
                            exploitationMethod: { id: jQuery('#ddlExploitationMethod').int32() },
                            depositOrigin: { id: jQuery('#ddlDepositOrigin').int32() },
                            category: { id: jQuery('#ddlCategory').int32() },
                            depositType: { id: jQuery('#ddlDepositType').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnit').int32() },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
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
                            } else if (jQuery('#ddlStageOperation').int32() === 0) {
                                success = false;
                                message = 'Seleccione la etapa de Operación.';
                                jQuery('#ddlStageOperation').focus();
                            } else if (jQuery('#ddlExploitationMethod').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Método de Exploración.';
                                jQuery('#ddlExploitationMethod').focus();
                            } else if (jQuery('#ddlDepositOrigin').int32() === 0) {
                                success = false;
                                message = 'Seleccione Origen de Yacimiento.';
                                jQuery('#ddlDepositOrigin').focus();
                            } else if (jQuery('#ddlCategory').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Categoría.';
                                jQuery('#ddlCategory').focus();
                            } else if (jQuery('#ddlDepositType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo de Yacimiento.';
                                jQuery('#ddlDepositType').focus();
                            } else if (jQuery('#ddlMiningUnit').int32() === 0) {
                                success = false;
                                message = 'Seleccione la Unidad Minera.';
                                jQuery('#ddlMiningUnit').focus();
                            } else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Sistema Referencial.';
                                jQuery('#ddlSpatialReference2').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "miningproject", { module: "miningproject", subModule: 'miningproject' });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                miningproject.Main = Main;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningproject.miningproject.Main.execute();