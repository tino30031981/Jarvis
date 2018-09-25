(function (com) {
    (function (jtm) {
        (function (documentlibrary) {
            var BaseTracingDocument = (function (_super) {
                __extends(BaseTracingDocument, _super);
                function BaseTracingDocument() {
                    _super.call(this);
                    this.$txtCodeNameSearch = null;
                    this.$txtDocumentName = null;
                    this.$txtDocumentNameSearch = null;
                    this.$txtFromDate = null;
                    this.$txtFromDateSearch = null;
                    this.$txtToDate = null;
                    this.$txtToDateSearch = null;
                    this.$tblResultDocument = null;
                    this.$btnSearch = null;
                    this.$btnClean = null;
                    this.$hdnId = 0;
                    this.$divPopup = null;
                    this.$hdnIdFormTracing = null;
                    this.$hdnIdFolderTracing = null;
                    this.$hdnIdDocument = null;
                    this.$txtEndDate = null;
                    this.$txtStartDate = null;
                    this.$txaObservation = null;
                    this.$ddlUser = null;
                    this.$ddlTracingProcess = null;
                    this.$ddlTracingProcessSearch = null;
                    this.$chkConfidential = null;
                    this.$tblResultUser = null;
                    this.$btnSave = null;
                    this.$btnCleanTracing = null;
                    this.$filFile = null;
                    this.$btnFile = null;
                    this.$divAlert = null;
                    this.$tblResultAlert = null;
                    this.$chkAlert = null;
                    this.$ddlFrequency = null;
                    this.$btnAddAlert = null;
                    this.$txtStartDateAlert = null;
                    this.$txtEndDateAlert = null;
                    this.$btnGenerateExcel = null;
                    this.searchTracing = function () {
                        var thiss = this;
                        thiss.$tblResultDocument.find('>tbody').empty();
                        var colors = thiss.config.module.state;
                        data = thiss.parametersSearch();
                        thiss.searchConfig(thiss.urls.searchtracingdocument, { data, isJson: false }, function (items) {
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-documentid="' + item.document.id + '" data-folderid="' + item.folder.id + '" data-tracingid="' + item.tracing.id + '">';
                                html += '<td id="divpr"><span style="background-color:' + colors[item.tracingProcess.name].color + ';border-radius: 50px;font-size:30px;" title="' + item.tracingProcess.name + '">&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.folder.name +'</td>';
                                html += '<td>' + item.document.name + '</td>';
                                html += '<td>' + item.alertsCount + '</td>';
                                html += '<td>' + item.tracingProcess.name + '</td>';
                                html += '<td>' + item.tracing.endDate + '</td>';
                                html += '<td><button class="btn btn-default btnEditTracing" type="button" id="btnEditTracing"><i class="glyphicon glyphicon-pencil"></i></button></td>';
                                html += '<td><a class="btn" href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                                html += '</tr>';
                            });
                            thiss.$tblResultDocument.find('>tbody').html(html);
                            thiss.$tblResultDocument.find('>caption>span').html(thiss.$tblResultDocument.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultDocument);
                            thiss.$tblResultDocument.find('>tbody').off('click', "> tr > td > .btnEditTracing");
                            thiss.$tblResultDocument.find('>tbody').on('click', "> tr > td > .btnEditTracing", function (e) {
                                var tracingid = jQuery(this).closest("tr").attr("data-tracingid");
                                var folderid = jQuery(this).closest("tr").attr("data-folderid");
                                thiss.$hdnId = jQuery(this).closest("tr").attr("data-uniqueid");
                                thiss.formAddDocument('Editar Documento', folderid, tracingid);
                            });
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
                                thiss.addAlert();
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
                    this.detail = function (id) {
                        var thiss = this;
                        this.detailConfig(thiss.urls.tracingdetail, { data: { id: id }, async: false }, function (data) {
                            var item = data.item;
                            console.log(item);
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
                            thiss.$chkConfidential.trigger('change');
                            thiss.$btnFile.attr('disabled', 'disabled');
                            thiss.$txtDocumentName.attr('readonly', 'readonly');
                            console.log(item);
                            if (item.document.id !== null) {
                                thiss.$hdnIdDocument.val(item.document.id);
                                thiss.$txtDocumentName.val(item.document.name || item.document.originalName);
                            }
                            thiss.$txtStartDate.attr('disabled', 'disabled');
                            thiss.$chkConfidential.attr('disabled', 'disabled');
                        });
                    };
                    this.generateReport = function () {
                        var thiss = this;
                        var formats = '';
                        thiss.$tblResultDocument.find('>tbody tr').toArray().forEach(function (tr) {
                            var tds = $(tr).find('td');
                            format = '';
                            format += $(tds[2]).text() + ',';
                            format += $(tds[3]).text() + ',';
                            format += $(tds[4]).text() + ',';
                            format += $(tds[5]).text() + ',';
                            format += $(tds[6]).text() + ',';
                            format += $(tds[7]).text() + ',';
                            format += $(tds[8]).text();
                            formats += format + ';';
                        });
                        if (formats != '')
                            thiss.downloadConfig(thiss.urls.downloadtracingdocument, formats);
                        else
                            alert("Realice una busqueda primero");
                    };
                    this.listUsers = function () {
                        var thiss = this;
                        thiss.$tblResultUser.find('>tbody').empty();
                        thiss.searchConfig(com.jtm.Server.contextPath + 'admin/user/searchbyoffice', { data: {}, async: false }, function (items) {
                            var html = '';
                            items.forEach(function (item, i) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.corporateMail + '</td>';
                                html += '</tr>';
                            });
                            thiss.$tblResultUser.find('>tbody').html(html);
                            thiss.$tblResultUser.find('>caption>span').html(thiss.$tblResultUser.find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(thiss.$tblResultUser);
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
                    this.countRows = function () {
                        var thiss = this;
                        var count = 0;
                        thiss.$tblResultAlert.find('tbody').find('tr').each(function (item, i) {
                            count = count + 1;
                        });
                        return count;
                    };
                    this.addAlert = function () {
                        var thiss = this;
                        var count = thiss.countRows();
                        if (thiss.$ddlFrequency.val() != 0 && thiss.$txtStartDateAlert.date() != null && thiss.$txtEndDateAlert.date() != null) {
                            if (thiss.$txtStartDateAlert.date() >= thiss.$txtStartDate.date() && thiss.$txtEndDateAlert.date() <= thiss.$txtEndDate.date()) {
                                var html = "<tr data-uniqueid='" + thiss.$ddlFrequency.val() + "'>";
                                html += "<td><button class='btn btnDeleteAlert' type='button' id='btnDeleteAlert' name='btnDeleteAlert'><i class='glyphicon glyphicon-remove'></i></button></td>";
                                html += "<td>" + ++count + "</td>";
                                html += "<td style='display:none;'>" + thiss.$ddlFrequency.val() + "</td>";
                                html += "<td>" + thiss.$ddlFrequency.find('option:selected').text() + "</td>";
                                html += "<td>" + thiss.$txtStartDateAlert.date() + "</td>";
                                html += "<td>" + thiss.$txtEndDateAlert.date() + "</td>";
                                html += "</tr>";
                                thiss.$tblResultAlert.find('tbody').append(html);
                            }
                        }
                    };
                    this.getDateNow = function () {
                        var hoy = new Date();
                        var dd = hoy.getDate();
                        var mm = hoy.getMonth() + 1;
                        var yyyy = hoy.getFullYear();
                        if (dd < 10)
                            dd = '0' + dd
                        if (mm < 10)
                            mm = '0' + mm
                        return hoy = yyyy + '-' + mm + '-' + dd;
                    };
                };
                BaseTracingDocument.prototype.domConfig = function () {
                    var thiss = this;
                    this.$txtCodeNameSearch = this.$main.find('#txtCodeNameSearch');
                    this.$txtDocumentNameSearch = this.$main.find('#txtDocumentNameSearch');
                    this.$txtFromDateSearch = this.$main.find('#txtFromDateSearch');
                    this.$txtToDateSearch = this.$main.find('#txtToDateSearch');
                    this.$tblResultDocument = this.$main.find('#tblResultDocument');
                    this.$btnSearch = this.$main.find('#btnSearch');
                    this.$btnClean = this.$main.find('#btnClean');
                    this.$divPopup = this.$main.find('#divPopup');
                    this.$ddlTracingProcessSearch = this.$main.find('#ddlTracingProcessSearch');
                    this.$btnGenerateExcel = this.$main.find('#btnGenerateExcel');
                };
                BaseTracingDocument.prototype.uiConfig = function () {
                    var thiss = this;
                };
                BaseTracingDocument.prototype.viewConfig = function () {
                    var thiss = this;
                    thiss.datePicker(thiss.$txtFromDateSearch);
                    thiss.datePicker(thiss.$txtToDateSearch);
                };
                BaseTracingDocument.prototype.buttonConfig = function () {
                    var thiss = this;
                    thiss.$btnSearch.off('click');
                    thiss.$btnSearch.on('click', function () {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.searchTracing();
                    });
                    thiss.$btnClean.off('click');
                    thiss.$btnClean.on('click', function () {
                        thiss.$txtCodeNameSearch.val("");
                        thiss.$txtDocumentNameSearch.val("");
                        thiss.$txtFromDateSearch.val("");
                        thiss.$txtToDateSearch.val("");
                        thiss.$tblResultDocument.find('>tbody').empty();
                    });
                    thiss.$btnGenerateExcel.off('click');
                    thiss.$btnGenerateExcel.on('click', function () {
                        thiss.generateReport();
                    });
                    thiss.$txtDocumentNameSearch.keyup(function (event) {
                        event.preventDefault();
                        if (event.keyCode === 13) {
                            thiss.searchTracing();
                        }
                    });
                    thiss.$txtCodeNameSearch.keyup(function (event) {
                        event.preventDefault();
                        if (event.keyCode === 13) {
                            thiss.searchTracing();
                        }
                    });
                };
                BaseTracingDocument.prototype.form = function (url, id, options) {
                    var thiss = this;
                    options = {};
                    options.callback = function () {
                        thiss.datePicker('#txtStartDate');
                        thiss.datePicker('#txtEndDate');
                        if (id === 0) {
                            thiss.searchMembers(null);
                            thiss.searchUsers(null);
                        }
                    };
                    _super.prototype.form.call(this, url, id, options);
                };
                BaseTracingDocument.prototype.search = function (url, options, callback) {
                    var thiss = this;
                    console.log();
                    options = options || {};
                    _super.prototype.search.call(this, url, options, callback);
                };
                BaseTracingDocument.prototype.parametersSearch = function () {
                    var thiss = this;
                    var data = {
                        document: {
                            name: thiss.$txtDocumentNameSearch.val()
                        },
                        tracingProcess: {
                            id: thiss.$ddlTracingProcessSearch.val()
                        },
                        fromDate: thiss.$txtFromDateSearch.date(),
                        toDate: thiss.$txtToDateSearch.date()
                    };
                    return data;
                }
                BaseTracingDocument.prototype.parameters = function () {
                    
                };
                BaseTracingDocument.prototype.save = function (url, data, options) {
                    var thiss = this;
                    url = thiss.urls.tracingsave;
                    data = thiss.parametersSave();
                    options = options || {};
                    options.validate = validate;
                    if (thiss.file !== null)
                        options.attachments = [{ id: "filFile", file: thiss.file.file }];
                    _super.prototype.save.call(this, url, data, options, function () {
                        thiss.$divPopup.dialog('close');
                        thiss.searchTracing();
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
                        } else if (thiss.$txtStartDate.date2() > thiss.$txtEndDate.date2()) {
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
                BaseTracingDocument.prototype.parametersSave = function () {
                    var thiss = this;
                    var alerts = [];
                    var document = null;
                    if (thiss.file === null) {
                        document = { id: thiss.$hdnIdDocument.int32() };
                    }
                    else {
                        document = thiss.file;
                        document = { id: thiss.$hdnIdDocument.int32() };
                        document.name = thiss.$txtDocumentName.val();
                    }
                    thiss.$tblResultAlert.find('tbody').find('tr').each(function () {
                        var tds = $(this).find('td');
                        alerts.push({
                            ruleTypeId: $(tds[2]).text(),
                            StartDate: $(tds[4]).text(),
                            EndDate: $(tds[5]).text()
                        })
                    });
                    var data = {
                        id: thiss.$hdnIdFormTracing.val(),
                        startDate: thiss.$txtStartDate.date(),
                        endDate: thiss.$txtEndDate.date(),
                        observation: thiss.$txaObservation.val(),
                        isConfidential: thiss.$chkConfidential.boolean(),
                        employee : { id: thiss.$ddlUser.int32() },
                        folder: { id: thiss.$hdnIdFolderTracing.int32() },
                        tracingProcess: { id: thiss.$ddlTracingProcess.int32() },
                        alerts: alerts,
                        document: document,
                        users: thiss.getUsers()
                    };
                    console.log(data);
                    return data;
                };
                BaseTracingDocument.prototype.load = function (jsonFile, options) {
                    var thiss = this;
                    options = options || {};
                    options.module = options.module || "documentlibrary";
                    options.subModule = options.subModule || "tracing";
                    jsonFile = jsonFile || BaseTracingDocument.JSONBASE + options.module + "/basetracingdocument";
                    _super.prototype.load.call(this, jsonFile, options);
                };
                return BaseTracingDocument;
            })(jtm.Master);
            documentlibrary.BaseTracingDocument = BaseTracingDocument;
        })(jtm.documentlibrary || (jtm.documentlibrary = {}));
        var documentlibrary = jtm.documentlibrary;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));