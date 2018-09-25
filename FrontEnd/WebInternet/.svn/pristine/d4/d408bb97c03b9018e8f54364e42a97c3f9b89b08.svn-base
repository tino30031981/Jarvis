(function (com) {
    (function (jtm) {
        (function (documentlibrary) {
            var BaseTracing = (function (_super) {
                __extends(BaseTracing, _super);
                function BaseTracing() {
                    _super.call(this);
                    this.$hdnIdFormTracing = null;
                    this.$hdnIdFolderTracing = null;
                    this.$hdnIdDocument = null;
                    this.$hdnIdFolder = null;
                    this.$divRowsFind = null;
                    this.$txtEndDate = null;
                    this.$txtStartDate = null;
                    this.$txtDocumentName = null;
                    this.$txaObservation = null;
                    this.$ddlUser = null;
                    this.$ddlTracingProcess = null;
                    this.$chkConfidential = null;
                    this.$btnAddDocument = null;
                    this.$btnCleanTracing = null;
                    this.$btnFile = null;
                    this.$divLegend = null;
                    this.$tblResultDocument = null;
                    this.$divResultFolder = null;
                    this.$tblResultUser = null;
                    this.$filFile = null;
                    this.urls = null;
                    this.file = null;
                    this.count = 0;
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
                            thiss.$chkConfidential.trigger("change");
                            thiss.$chkConfidential.attr('disabled', 'disabled');
                            thiss.$btnFile.attr('disabled', 'disabled');
                            thiss.$txtDocumentName.attr('readonly', 'readonly');
                            if (item.document.id !== null) {
                                thiss.$hdnIdDocument.val(item.document.id);
                                thiss.$txtDocumentName.val(item.document.name || item.document.originalName);
                            }
                        });
                    };
                    this.deleteTracing = function (id, documentId) {
                        var thiss = this;
                        var options = {
                            data: { id: id, documentId: documentId },
                            isJson: false,
                            validate: true
                        };
                        thiss.deleteConfig(thiss.urls.delete, options, function () {
                            thiss.searchTracing();
                        });
                    };
                    this.cleanTracing = function () {
                        this.$filFile.val('');
                    };
                    this.searchTracing = function () {
                        var thiss = this;
                        if (thiss.$hdnIdFolder.int32() === 0) return;
                        thiss.$tblResultDocument.find('>tbody').empty();
                        console.log(thiss.$hdnId.int32());
                        var colors = thiss.config.module.tracing.state;
                        thiss.searchConfig(thiss.urls.searchByFolder, { data: { folderId: thiss.$hdnIdFolder.int32(), moduleId: thiss.$hdnId.int32() }, isJson: false }, function (items) {
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
                    this.fillList = function (items, $ul) {
                        var thiss = this;
                        items.forEach(function (item, i) {
                            var code = thiss.getUUID();
                            $ul.append('<li id="' + item.id + '" folderid="' + item.folder.id + '"></li>');
                            $ul.find('>li:last').append('<input class="jca-active" type="checkbox" id=item' + code + ' /><label for=item' + code + '>' + item.name + ' ('+ item.documentCount + ')</label>');
                            if (item.folders.length > 0) {
                                $ul.find('>li:last').append('<ul></ul>');
                                thiss.fillList(item.folders, $ul.find('>li:last>ul'));
                            }
                        });
                    };
                    this.fillLegend = function () {
                        var thiss = this;
                        thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.tracing.state.Pendiente.color + ';border-radius:15px;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.tracing.state.Pendiente.label + '</div>');
                        thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.tracing.state.Atendido.color + ';border-radius:15px;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.tracing.state.Atendido.label + '</div>');
                        thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.tracing.state.Completado.color + ';border-radius:15px;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.tracing.state.Completado.label + '</div>');
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
                    this.clean = function () {

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
                            if (thiss.$txtStartDateAlert.date2() >= thiss.$txtStartDate.date2() && thiss.$txtEndDateAlert.date2() <= thiss.$txtEndDate.date2()) {
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
                        return hoy = dd + '-' + mm + '-' + yyyy;
                    };
                }
                BaseTracing.prototype.save = function (url, data, options, callback) {
                    var thiss = this;
                    url = String.isNullOrWhiteSpace(url) === true ? thiss.urls.save : url;
                    //url = com.jtm.Server.contextPath + "miningconcession/tracing/save2";
                    data = thiss.parametersSave();
                    options = options || {};
                    options.validate = validate;
                    if (thiss.file !== null)
                        options.attachments = [{ id: "filFile", file: thiss.file.file }];
                    _super.prototype.save.call(this, url, data, options, function () {
                        thiss.clean();
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
                BaseTracing.prototype.parametersSave = function () {
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
                        employee: { id: thiss.$ddlUser.int32() },
                        folder: { id: thiss.$hdnIdFolderTracing.int32() },
                        tracingProcess: { id: thiss.$ddlTracingProcess.int32() },
                        alerts: alerts,
                        document: document,
                        users: thiss.getUsers()
                    };
                    return data;
                };
                BaseTracing.prototype.initConfig = function () {
                    var thiss = this;
                };
                BaseTracing.prototype.domConfig = function () {
                    this.$hdnIdFolder = this.$main.find('#hdnIdFolder');
                    this.$divRowsFind = this.$main.find('#divRowsFind');
                    this.$btnAddDocument = this.$main.find('#btnAddDocument');
                    this.$divLegend = this.$main.find('#divLegend');
                    this.$divResultFolder = this.$main.find('#divResultFolder');
                    this.$tblResultDocument = this.$main.find('#tblResultDocument');
                    this.$btnClean = this.$main.find('#btnClean');
                    this.$divPopup = this.$main.find('#divPopup');
                };
                BaseTracing.prototype.viewConfig = function () {
                    var thiss = this;
                };
                BaseTracing.prototype.buttonConfig = function () {
                    var thiss = this;
                    thiss.$btnAddDocument.off('click');
                    thiss.$btnAddDocument.on('click', function (e) {
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
                BaseTracing.prototype.listFolder = function () {
                    var thiss = this;
                    thiss.$divResultFolder.find('>ul').empty();
                    var options = {}
                    var data = {
                        moduleId : thiss.$hdnId.int32()
                    }
                    options = {
                        data : data,
                        isJson : false
                    }
                    thiss.searchConfig(thiss.urls.listFolder, options, function (items) {
                        thiss.fillList(items, thiss.$divResultFolder.find('>ul'));
                        thiss.$divResultFolder.find('>ul >li label').off('click');
                        thiss.$divResultFolder.find('>ul >li label').on("click", function (e) {
                            jQuery(this).closest('li').parents('ul#ulParent').find('li').removeClass("active");
                            jQuery(this).closest('li').toggleClass("active");
                            thiss.$hdnIdFolder.val(jQuery(this).closest('li').attr('id'));
                            thiss.$tblResultDocument.find('>caption>span').html(jQuery(this).closest('li').find('>label').html());
                            thiss.searchTracing();
                        });
                    });
                };
                BaseTracing.prototype.uiConfig = function () {
                    var thiss = this;
                    thiss.listFolder();
                    thiss.fillLegend();
                };
                BaseTracing.prototype.load = function ($container, options) {
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
                BaseTracing.prototype.setConfig = function (value, options, callback) {
                    var thiss = this;
                    this.config = value || {};
                    this.config.module = this.config.module || {};
                    options = options || { config: thiss.config.module, property: "tracing" };
                    options.module = String.isNullOrWhiteSpace(options.module) === true ? "" : options.module;
                    options.subModule = String.isNullOrWhiteSpace(options.subModule) === true ? "" : options.subModule;
                    options.jsonFile = String.isNullOrWhiteSpace(options.jsonFile) === true ? BaseTracing.JSONBASE + "basetracing" : options.jsonFile;
                    thiss.setRoots(options);
                    this.loadConfig(options, callback);
                };
                return BaseTracing;
            })(jtm.Master);
            documentlibrary.BaseTracing = BaseTracing;
        })(jtm.documentlibrary || (jtm.documentlibrary = {}));
        var documentlibrary = jtm.documentlibrary;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));