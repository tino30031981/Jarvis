function getInstance() {
    return com.jtm.miningproject.miningproject.Tracing.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var Tracing = (function (_super) {
                    __extends(Tracing, _super);
                    function Tracing() {
                        _super.call(this);
                        this.urls = {
                            listFolder: com.jtm.Server.contextPath + "miningproject/folder/searchbyminingproject",
                            form: com.jtm.Server.contextPath + "miningproject/tracing/form",
                            save: com.jtm.Server.contextPath + "miningproject/tracing/save2",
                            detail: com.jtm.Server.contextPath + "miningproject/tracing/detail",
                            delete: com.jtm.Server.contextPath + "miningproject/tracing/delete",
                            searchByFolder: com.jtm.Server.contextPath + "miningproject/miningproject/searchbyarea",
                            viewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer"
                        };
                        this.deleteTracing = function (id, documentId) {
                            var thiss = this;
                            var options = {
                                data: { id: id, documentId: documentId },
                                isJson: false,
                                validate: true
                            };
                            thiss.deleteConfig(thiss.urls.delete, options, function () {
                                thiss.search();
                            });
                        };
                        this.getUsers = function () {
                            var thiss = this;
                            var users = [];
                            thiss.$tblResultUser.find('>tbody input:checkbox:checked').toArray().forEach(function (input) {
                                $tr = jQuery(input).closest('tr');
                                users.push({ id: $tr.attr('data-uniqueid') });
                            });
                            return users;
                        };
                        this.detail = function (id) {
                            var thiss = this;
                            this.detailConfig(thiss.urls.detail, { data: { id: id }, async: false }, function (data) {
                                var item = data.item;
                                thiss.$txtEndDate.val(item.endDate);
                                thiss.$txtStartDate.val(item.startDate);
                                thiss.$txaObservation.val(item.observation);
                                thiss.$ddlUser.val(item.employee.id);
                                thiss.$ddlTracingProcess.val(item.tracingProcess.id);
                                thiss.$chkConfidential.prop("checked", item.isConfidential);
                                thiss.$hdnIdFormTracing.val(item.id);
                                thiss.$hdnIdFolderTracing.val(item.folder.id);
                                if (item.users != null) {
                                    item.users.forEach(function (user) {
                                        thiss.$tblResultUser.find('>tbody>tr input:checkbox[value="' + user.id + '"]').attr("checked", true);
                                    });
                                }
                                if (item.alerts != null) {
                                    thiss.$chkAlert.attr("checked", true).trigger('change');
                                    for (var i = 0; i < item.alerts.length; i++) {
                                        var html = "<tr data-uniqueid='" + item.alerts[i].id + "'>";
                                        html += "<td><button class='btn btnDeleteAlert' type='button' id='btnDeleteAlert' name='btnDeleteAlert'><i class='glyphicon glyphicon-remove'></i></button></td>";
                                        html += "<td>" + (i + 1) + "</td>";
                                        html += "<td style='display:none;'>" + item.alerts[i].ruleTypeId + "</td>";
                                        html += "<td>" + thiss.$ddlFrequency.find("option[value='" + item.alerts[i].ruleTypeId + "']").text() + "</td>";
                                        html += "<td>" + item.alerts[i].startDate + "</td>";
                                        html += "<td>" + item.alerts[i].endDate + "</td>";
                                        html += "</tr>";
                                        thiss.$tblResultAlert.find('tbody').append(html);
                                    }
                                }
                                thiss.$chkConfidential.attr('disabled', 'disabled');
                                thiss.$btnFile.attr('disabled', 'disabled');
                                thiss.$txtDocumentName.attr('readonly', 'readonly');
                                if (item.document.id !== null) {
                                    thiss.$hdnIdDocument.val(item.document.id);
                                    thiss.$txtDocumentName.val(item.document.name);
                                }
                            });
                        };
                        this.formAddDocument = function (title, folderId, id) {
                            var thiss = this;
                            thiss.file = null;
                            thiss.$divPopup.dialog({
                                title: title,
                                width: screen.width,
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, thiss.urls.form, function () {
                                thiss.$hdnIdFormTracing = thiss.$divPopup.find('#hdnIdFormTracing');
                                thiss.$hdnIdFolderTracing = thiss.$divPopup.find('#hdnIdFolderTracing');
                                thiss.$hdnIdDocument = thiss.$divPopup.find('#hdnIdDocument');
                                thiss.$txtEndDate = thiss.$divPopup.find('#txtEndDate');
                                thiss.$txtStartDate = thiss.$divPopup.find('#txtStartDate');
                                thiss.$txaObservation = thiss.$divPopup.find('#txaObservation');
                                thiss.$ddlUser = thiss.$divPopup.find('#ddlUser');
                                thiss.$ddlTracingProcess = thiss.$divPopup.find('#ddlTracingProcess');
                                thiss.$chkConfidential = thiss.$divPopup.find('#chkConfidential');
                                thiss.$tblResultUser = thiss.$divPopup.find('#tblResultUser');
                                thiss.$btnSave = thiss.$divPopup.find('#btnSaveTracing');
                                thiss.$btnCleanTracing = thiss.$divPopup.find('#btnCleanTracing');
                                thiss.$filFile = thiss.$divPopup.find('#filFile');
                                thiss.$btnFile = thiss.$divPopup.find('#btnFile');
                                thiss.$txtDocumentName = thiss.$divPopup.find('#txtDocumentName');
                                thiss.$divAlert = thiss.$divPopup.find('#divAlert');
                                thiss.$tblResultAlert = thiss.$divPopup.find('#tblResultAlert');
                                thiss.$chkAlert = thiss.$divPopup.find('#chkAlert');
                                thiss.$ddlFrequency = thiss.$divPopup.find('#ddlFrequency');
                                thiss.$btnAddAlert = thiss.$divPopup.find('#btnAddAlert');
                                thiss.$txtStartDateAlert = thiss.$divPopup.find('#txtStartDateAlert');
                                thiss.$txtEndDateAlert = thiss.$divPopup.find('#txtEndDateAlert');
                                thiss.datePicker(thiss.$txtStartDateAlert);
                                thiss.datePicker(thiss.$txtEndDateAlert);
                                thiss.listUsers();
                                thiss.$hdnIdFolderTracing.val(folderId);
                                thiss.datePicker(thiss.$txtEndDate);
                                thiss.datePicker(thiss.$txtStartDate);
                                thiss.$txtStartDate.val(thiss.getDateNow());
                                thiss.$btnSave.off('click');
                                thiss.$btnSave.on('click', function (e) {
                                    thiss.save();
                                });
                                thiss.$btnCleanTracing.off('click');
                                thiss.$btnCleanTracing.on('click', function (e) {
                                    thiss.cleanTracing();
                                });
                                thiss.$btnFile.off('click');
                                thiss.$btnFile.on('click', function (e) {
                                    thiss.$filFile.trigger("click");
                                });
                                thiss.$filFile.off("change");
                                thiss.$filFile.on("change", function (e) {
                                    if (e.originalEvent.target.files.length) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        thiss.$txtDocumentName.val(e.originalEvent.target.files[0].name);
                                        thiss.setFile(e.originalEvent.target.files[0]);
                                    }
                                });
                                thiss.$chkConfidential.off('change');
                                thiss.$chkConfidential.on('change', function (e) {
                                    if ($(this).is(':checked'))
                                        thiss.$tblResultUser.show();
                                    else
                                        thiss.$tblResultUser.hide();
                                });
                                thiss.$chkConfidential.trigger('change');

                                thiss.$chkAlert.off('change');
                                thiss.$chkAlert.on('change', function (e) {
                                    if ($(this).is(':checked')) {
                                        if (thiss.$txtStartDate.date2() <= thiss.$txtEndDate.date2()) {
                                            if (thiss.$txtStartDate.val() != "" && thiss.$txtEndDate.val() != "" && thiss.$ddlTracingProcess.val() != 0) {
                                                thiss.$txtStartDateAlert.val(thiss.$txtStartDate.date());
                                                thiss.$txtEndDateAlert.val(thiss.$txtEndDate.date());
                                                thiss.$divAlert.show();
                                                thiss.$tblResultAlert.show();
                                            } else {
                                                alert("Complete los campos de documento antes de agregar una alerta");
                                                thiss.$chkAlert.trigger('click');
                                            }
                                        } else {
                                            alert('La fecha inicio debe ser menor a la fecha final');
                                        }
                                    } else {
                                        thiss.$divAlert.hide();
                                        thiss.$tblResultAlert.hide();
                                    }
                                });
                                thiss.$chkAlert.trigger('change');
                                thiss.$btnAddAlert.off('click');
                                thiss.$btnAddAlert.on('click', function (e) {
                                    if (thiss.$txtStartDateAlert.date2() <= thiss.$txtEndDateAlert.date2()) {
                                        thiss.addAlert();
                                    } else {
                                        alert('La fecha inicio debe ser menor a la fecha final');
                                    }
                                });
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "admin/user/list",
                                    ddl: thiss.$ddlUser,
                                    data: {}
                                });
                                thiss.$tblResultAlert.find('>tbody').off('click', "> tr > td > .btnDeleteAlert");
                                thiss.$tblResultAlert.find('>tbody').on('click', "> tr > td > .btnDeleteAlert", function (e) {
                                    $(this).closest('tr').remove();
                                });
                                if (id > 0)
                                    thiss.detail(id);
                            });
                        };
                    }
                    Tracing.prototype.search = function () {
                        var thiss = this;
                        if ($('#hdnIdOffice').int32() === 0 && $('#hdnIdUser').int32() === 0) {
                            return;
                        }
                        thiss.resetContainers(false);
                        var options = {};
                        var documentName = '';
                        var colors = thiss.config.module.tracing.state;
                        options.data = { folderId: thiss.$hdnIdFolder.int32(), officeId: $('#hdnIdOffice').int32(), documentName: documentName };
                        options.validate = true;
                        options.isJson = false;
                        options.async = true;
                        thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/tracing/searchdocumentsbyfolder", options, function (items) {
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-documentid="' + item.document.id + '">';
                                html += '<td id="divpr"><span style="background-color:' + colors[item.tracingProcess.name].color + ';border-radius: 50px;font-size:30px;" title="' + item.tracingProcess.name + '">&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.endDate + '</td>';
                                html += '<td>' + item.tracingProcess.name + '</td>';
                                html += '<td><button class="btn btn-default btnEditTracing" type="button" id="btnEditTracing"><i class="glyphicon glyphicon-pencil"></i></button></td>';
                                html += '<td><button class="btn btn-default btnDeleteTracing" type="button" id="btnDeleteTracing"><i class="glyphicon glyphicon-remove"></i></button></td>';
                                html += '<td><a class="btn" href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                                html += '</tr>';
                            });
                            thiss.$tblResultDocument.find('>tbody').html(html);
                            thiss.$divRowsFind.find('span').html(thiss.$tblResultDocument.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultDocument);
                            thiss.$tblResultDocument.find('>tbody').off('click', "> tr > td > .btnEditTracing");
                            thiss.$tblResultDocument.find('>tbody').on('click', "> tr > td > .btnEditTracing", function (e) {
                                var id = jQuery(this).closest("tr").attr("data-uniqueid");
                                thiss.formAddDocument('Editar Documento', thiss.$hdnIdFolder.int32(), id);
                            });
                            thiss.$tblResultDocument.find('>tbody').off('click', "> tr > td > .btnDeleteTracing");
                            thiss.$tblResultDocument.find('>tbody').on('click', "> tr > td > .btnDeleteTracing", function (e) {
                                var id = jQuery(this).closest("tr").attr("data-uniqueid");
                                var documentId = jQuery(this).closest("tr").attr("data-documentid");
                                thiss.deleteTracing(id, documentId);
                            });
                        });
                    };
                    Tracing.prototype.domConfig = function () {
                        this.$hdnIdFolder = this.$main.find('#hdnIdFolder');
                        this.$divRowsFind = this.$main.find('#divRowsFind');
                        this.$btnAddDocument = this.$main.find('#btnAddDocument');
                        this.$divLegend = this.$main.find('#divLegend');
                        this.$divResultFolder = this.$main.find('#divResultFolder');
                        this.$tblResultDocument = this.$main.find('#tblResultDocument');
                        this.$btnClean = this.$main.find('#btnClean');
                        this.$divPopup = this.$main.find('#divPopup');
                    };
                    Tracing.prototype.getOffice = function () {
                        var thiss = this;
                        var options = {};
                        options.data = {};
                        options.validate = true;
                        options.async = true;
                        thiss.searchConfig(com.jtm.Server.contextPath + "admin/user/getoffice", options, function (item) {
                            if (item == null) return;
                            $('#hdnIdOffice').val(item.office.id);
                            $('#hdnIdUser').val(item.id);
                        });
                    };
                    Tracing.prototype.save = function (url, data, options, callback) {
                        var thiss = this;
                        var document = null;
                        var alerts = [];
                        if (thiss.file === null) {
                            document = { id: thiss.$hdnIdDocument.int32() };
                        }
                        else {
                            document = thiss.file;
                            document = { id: thiss.$hdnIdDocument.int32() };
                            document.name = thiss.$txtDocumentName.val();
                        }
                        url = com.jtm.Server.contextPath + "miningproject/tracing/save2";

                        thiss.$tblResultAlert.find('tbody').find('tr').each(function () {
                            var tds = $(this).find('td');
                            alerts.push({
                                ruleTypeId: $(tds[2]).text(),
                                StartDate: $(tds[4]).text(),
                                EndDate: $(tds[5]).text()
                            })
                        });
                        data = {
                            id: thiss.$hdnIdFormTracing.val(),
                            office: { id: $('#hdnIdOffice').int32() },
                            startDate: thiss.$txtStartDate.date(),
                            endDate: thiss.$txtEndDate.date(),
                            observation: thiss.$txaObservation.val(),
                            isConfidential: thiss.$chkConfidential.boolean(),
                            employee: { id: thiss.$ddlUser.int32() },
                            folder: { id: thiss.$hdnIdFolder.int32() },
                            tracingProcess: { id: thiss.$ddlTracingProcess.int32() },
                            miningProject: { id: thiss.$hdnId.int32() },
                            alerts: alerts,
                            document: document,
                            users: thiss.getUsers()
                        };
                        options = options || {};
                        options.data = data;
                        options.validate = validate;
                        if (thiss.file !== null)
                            options.attachments = [{ id: "filFile", file: thiss.file.file }];
                        thiss.saveConfig(url, options, function () {
                            thiss.cleanTracing();
                            thiss.$divPopup.dialog('close');
                            thiss.search();
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$ddlTracingProcess.int32() === 0) {
                                success = false;
                                message = 'Seleccione un Proceso';
                                thiss.$ddlTracingProcess.focus();
                            } else if (thiss.$ddlUser.int32() === 0) {
                                success = false;
                                message = 'Seleccione un responsable.';
                                thiss.$ddlUser.focus();
                            } else if (String.isNullOrWhiteSpace(thiss.$txtStartDate.val()) || String.isNullOrWhiteSpace(thiss.$txtEndDate.val())) {
                                success = false;
                                message = 'Debe ingresar ambas fechas.';
                            } else if (thiss.$txtStartDate.date2() >= thiss.$txtEndDate.date2()) {
                                success = false;
                                message = 'La fecha fin debe ser mayor a la fecha inicio.';
                                thiss.$txtStartDate.focus();
                            } else if (thiss.$hdnIdFormTracing.int32() === 0 && thiss.$filFile.val() === '') {
                                success = false;
                                message = 'Cargue un documento.';
                                thiss.$btnFile.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Tracing.prototype.listFolder = function () {
                        var thiss = this;
                        thiss.getOffice();
                        if (thiss.$hdnId.int32() === 0) return;
                        thiss.$divResultFolder.find('>ul').empty();
                        thiss.searchConfig(thiss.urls.listFolder, { data: { miningProjectId: thiss.$hdnId.int32() }, isJson: false, async: false }, function (items) {
                            thiss.fillList(items, thiss.$divResultFolder.find('>ul'));
                            thiss.$divResultFolder.find('ul li .jca-active').off('click');
                            thiss.$divResultFolder.find('ul li .jca-active').on("click", function (e) {
                                jQuery(this).closest('li').parents('ul#ulParent').find('li').removeClass("active");
                                jQuery(this).closest('li').toggleClass("active");
                                thiss.$hdnIdFolder.val(jQuery(this).closest('li').attr('id'));
                                thiss.search();
                            });
                        });
                    };
                    Tracing.prototype.uiConfig = function () {
                        var thiss = this;
                        thiss.listFolder();
                        thiss.fillLegend();
                    };
                    Tracing.prototype.buttonConfig = function () {
                        var thiss = this;
                        $('#btnAddDocument').off('click');
                        $('#btnAddDocument').on('click', function (e) {
                            if (thiss.$hdnIdFolder.int32() !== 0) {
                                thiss.count = 0;
                                thiss.formAddDocument('Añadir Documento', thiss.$hdnIdFolder.int32(), 0);
                            } else
                                alert("Seleccione un folder");
                        });
                        thiss.$btnClean.off('click');
                        thiss.$btnClean.on('click', function (e) {
                            thiss.clean();
                        });
                    };
                    Tracing.prototype.initConfig = function () {
                        var thiss = this;
                    };
                    Tracing.prototype.load = function ($container, options) {
                        var thiss = this;
                        options = options || {};
                        thiss.$hdnId = options.$hdnId;
                        if (String.isNullOrWhiteSpace($container) === true)
                            $container = thiss.$main;
                        if (typeof $container === "string")
                            $container = jQuery($container);
                        thiss.$main = ($container.length === 0) ? thiss.$main : $container;
                        this.initConfig();
                        this.domConfig();
                        this.viewConfig();
                        this.uiConfig();
                        this.buttonConfig();
                    };
                    Tracing.execute = function () {
                        return new Tracing();
                    };
                    return Tracing;
                })(jtm.documentlibrary.BaseTracing);
                miningproject.Tracing = Tracing;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));