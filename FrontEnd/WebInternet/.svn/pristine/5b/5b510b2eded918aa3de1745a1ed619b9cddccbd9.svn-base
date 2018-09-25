(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (documentlibrary) {
                            var BaseWidget = (function (_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$divMiningProject = null;
                                    this.$tblResultDocument = null;
                                    this.$btnAddDocument = null;
                                    this.htmlServices = null;
                                    this.$txtDocumentName = null;
                                    this.$txtDocumentSearch = null;
                                    this.$btnDocumentSearch = null;
                                    this.file = null;
                                    this.count = 0;
                                    this.fillList = function (items, $tbd) {
                                        var thiss = this;
                                        items.forEach(function (item, i) {
                                            var code = thiss.getUUID();
                                            $tbd.append('<li id="' + item.id + '" folderid="' + item.folder.id + '"></li>');
                                            $tbd.find('>li:last').append('<input class="jca-active" type="checkbox" id=item' + code + ' /><label for=item' + code + '>' + item.name + ' ('+ item.documentCount +')</label>');
                                            if (item.folders.length > 0) {
                                                $tbd.find('>li:last').append('<ul></ul>');
                                                thiss.fillList(item.folders, $tbd.find('>li:last>ul'));
                                            }
                                        });
                                    };
                                    this.searchFolder = function ($div) {
                                        var thiss = this;
                                        thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/folder/searchbyminingproject", { data: { miningProjectId: thiss.$hdnIdMiningProject.val(), officeId: thiss.$hdnIdOffice.int32()}, validate: true, isJson: false }, function (items) {
                                            if (items.length === 0) {
                                                toastr.info("No hay resultados de su base de datos");
                                                return;
                                            }
                                            $div.append('<ul></ul>');
                                            thiss.fillList(items, $div.find('>ul'));
                                        });
                                    };
                                    this.searchTracing = function (documentName) {
                                        var thiss = this;
                                        thiss.$tblResultDocument.find('>tbody').empty();
                                        $('#divRowsFind').find('>span:first').html(0);
                                        //thiss.$tblResultDocument.find('>caption>span:first').html(0);
                                        var data = { folderId: thiss.$hdnIdFolder.int32(), officeId: thiss.$hdnIdOffice.int32(), documentName: documentName };
                                        thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/tracing/searchdocumentsbyfolder", { data: data, validate: true, isJson : false }, function (items) {
                                            if (items.length === 0) {
                                                toastr.info("No se ha encontrado elementos");
                                                return;
                                            }
                                            var html = '';
                                            items.forEach(function (item, i) {
                                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-documentid="' + item.document.id + '">';
                                                html += '<td>' + (i + 1) + '</td>';
                                                html += '<td>' + item.name + '</td>';
                                                html += '<td>' + item.tracingProcess.name + '</td>';
                                                html += '<td><button class="btn btn-default btnEditTracing" type="button" id="btnEditTracing"><i class="glyphicon glyphicon-pencil"></i></button></td>';
                                                html += '<td><button class="btn btn-default btnDeleteTracing" type="button" id="btnDeleteTracing"><i class="glyphicon glyphicon-remove"></i></button></td>';
                                                html += '<td><a  class="btn" href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.document.id + '" target="_blank"><i class="glyphicon glyphicon-eye-open"></i></a></td>';
                                                html += '</tr>';
                                            });
                                            thiss.$tblResultDocument.find('>tbody').html(html);
                                            $('#divRowsFind').find('>span:first').html(thiss.$tblResultDocument.find('>tbody>tr').length);
                                            com.jtm.helper.Table.highlightRow(thiss.$tblResultDocument);
                                            thiss.$tblResultDocument.find('>tbody').off('click', "> tr > td > .btnEditTracing");
                                            thiss.$tblResultDocument.find('>tbody').on('click', "> tr > td > .btnEditTracing", function (e) {
                                                var id = jQuery(this).closest("tr").attr("data-uniqueid");
                                                thiss.form2(null, id, { folderId: 0, title: "Editar documento" });
                                            });
                                            thiss.$tblResultDocument.find('>tbody').off('click', "> tr > td > .btnDeleteTracing");
                                            thiss.$tblResultDocument.find('>tbody').on('click', "> tr > td > .btnDeleteTracing", function (e) {
                                                var id = jQuery(this).closest("tr").attr("data-uniqueid");
                                                var documentId = jQuery(this).closest("tr").attr("data-documentid");
                                                thiss.deleteTracing(id, documentId);
                                            });
                                        });
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
                                    this.addDocument = function () {
                                        var thiss = this;
                                        if (thiss.$hdnIdMiningProject.int32() == 0) {
                                            toastr.info("Seleccione un proyecto minero");
                                            return;
                                        } else if (thiss.$hdnIdFolder.int32() == 0) {
                                            toastr.info("Seleccione una carpeta");
                                            return;
                                        }
                                        thiss.form2(null, 0, { folderId: thiss.$hdnIdFolder.int32(), title: "Añadir documento" });
                                    };
                                    this.detail = function (id) {
                                        var thiss = this;
                                        thiss.detailConfig(com.jtm.Server.contextPath + "miningproject/tracing/detail", { data: { id: id }, async: false }, function (data) {
                                            var item = data.item;
                                            thiss.$txtEndDate.val(item.endDate);
                                            thiss.$txtStartDate.val(item.startDate);
                                            thiss.$txaObservation.val(item.observation);
                                            thiss.$ddlUser.val(item.employee.id);
                                            thiss.$ddlTracingProcess.val(item.tracingProcess.id);
                                            thiss.$chkConfidential.prop("checked", item.isConfidential);
                                            thiss.$chkConfidential.trigger('change');
                                            if (item.users != null) {
                                                item.users.forEach(function (user) {
                                                    thiss.$tblResultUser.find('>tbody>tr input:checkbox[value="' + user.id + '"]').attr("checked", true);
                                                });
                                            }
                                            if (item.alerts != null){
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
                                            thiss.$hdnIdFormTracing.val(item.id);
                                            thiss.$hdnIdFolderTracing.val(item.folder.id);
                                            thiss.$btnFile.attr('disabled', 'disabled');
                                            thiss.$chkConfidential.attr('disabled', 'disabled');
                                            thiss.$txtDocumentName.attr('readonly', 'readonly');
                                            if (item.document.id !== null) {
                                                thiss.$hdnIdDocument.val(item.document.id);
                                                thiss.$txtDocumentName.val(item.document.name);
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
                                        thiss.deleteConfig(com.jtm.Server.contextPath + "miningproject/tracing/delete", options, function () {
                                            thiss.searchTracing(thiss.$txtDocumentSearch.val());
                                        });
                                    };
                                    this.cleanTracing = function () {
                                        //this.$hdnIdProcedure.val('');
                                        this.$filFile.val('');
                                        //this.$smlNameProcedure.html('');
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
                                BaseWidget.prototype.initConfig = function () {
                                    var thiss = this;
                                    _super.prototype.initConfig.call(this);
                                };
                                BaseWidget.prototype.launchView = function () {
                                    var thiss = this;
                                    this.$hdnIdFolder = thiss.$widget.find("#hdnIdFolder");
                                    this.$hdnIdOffice = thiss.$widget.find("#hdnIdOffice");
                                    this.$hdnIdUser = thiss.$widget.find("#hdnIdUser");
                                    this.$hdnIdMiningProject = thiss.$widget.find("#hdnIdMiningProject");
                                    this.$divMiningProject = thiss.$widget.find("#divMiningProject");
                                    this.$btnAddDocument = thiss.$widget.find("#btnAddDocument");
                                    this.$tblResultDocument = thiss.$widget.find("#tblResultDocument");
                                    this.$divPopup = thiss.$widget.find('#divPopup');
                                    this.$txtDocumentSearch = thiss.$widget.find('#txtDocumentSearch');
                                    this.$btnDocumentSearch = thiss.$widget.find('#btnDocumentSearch');
                                    thiss.getOffice();
                                    //thiss.search();
                                    thiss.$btnAddDocument.off('click');
                                    thiss.$btnAddDocument.on('click', function (e) {
                                        thiss.count = 0;
                                        thiss.addDocument();
                                    });
                                    thiss.$btnDocumentSearch.off('click');
                                    thiss.$btnDocumentSearch.on('click', function (e) {
                                        thiss.searchTracing(thiss.$txtDocumentSearch.val());
                                    });
                                    thiss.$txtDocumentSearch.keyup(function (event) {
                                        event.preventDefault();
                                        if (event.keyCode === 13) {
                                            thiss.searchTracing($(this).val());
                                        }
                                    });
                                };
                                BaseWidget.prototype.getOffice = function () {
                                    var thiss = this;                                   
                                    var options = {};
                                    options.data = {};
                                    options.validate = true;
                                    options.async = true;
                                    thiss.searchConfig(com.jtm.Server.contextPath + "admin/user/getoffice", options, function (item) {
                                        if (item == null) return;
                                        thiss.$hdnIdOffice.val(item.office.id);
                                        thiss.$hdnIdUser.val(item.id);
                                        thiss.search();
                                    });
                                };
                                BaseWidget.prototype.search = function () {
                                    var thiss = this;
                                    if (thiss.$hdnIdOffice.int32() === 0 && thiss.$hdnIdUser.int32() === 0)
                                    {
                                        return;
                                    }
                                    thiss.resetContainers(false);
                                    var options = {};
                                    options.data = { officeId: thiss.$hdnIdOffice.int32(), userId: thiss.$hdnIdUser.int32() };
                                    options.validate = true;
                                    options.isJson = false;
                                    options.async = true;
                                    thiss.searchConfig(com.jtm.Server.contextPath + "miningproject/miningproject/searchbyarea", options, function (items) {
                                        if (items.length === 0) {
                                            toastr.info("No hay resultados de su base de datos");
                                            return;
                                        }
                                        var html = "";
                                        items.forEach(function (item) {
                                            html += '<li id="' + item.id + '" class="list-group-item gh-padding-0"><div class="input-group">';
                                            html += '<a class="form-control">' + item.name + '</a>';
                                            html += '<span class="input-group-addon" style="background-color:rgb(135, 206, 250);">';
                                            html += '<i class="glyphicon glyphicon-triangle-bottom"></i>';
                                            html += '</span>';
                                            html += '</div>';
                                            html += '<div class="css-treeview" id="ulParent" active="false"></div>';
                                            html += '</li>';
                                        });
                                        thiss.$divMiningProject.find('>ul').html(html);
                                        thiss.$divMiningProject.off('click', '>ul>li>div span.input-group-addon');
                                        thiss.$divMiningProject.on('click', '>ul>li>div span.input-group-addon', function (e) {
                                            if (jQuery(this).closest('li').find('>div:last').attr('active') == "false") {
                                                thiss.$hdnIdMiningProject.val(jQuery(this).closest('li').attr('id'));
                                                thiss.searchFolder(jQuery(this).closest('li').find('>div:last'));
                                                jQuery(this).closest('li').find('>div:last').attr('active', 'active');
                                            } else {
                                                jQuery(this).closest('li').find('>div:last').empty();
                                                jQuery(this).closest('li').find('>div:last').attr('active', 'false');
                                            }
                                            //thiss.searchFolder(jQuery(this).closest('li').find('>div:last'));
                                        });
                                        thiss.$divMiningProject.off('click', '>ul>li>div >ul >li label');
                                        thiss.$divMiningProject.on('click', '>ul>li>div >ul >li label', function (e) {
                                            jQuery(this).closest('li').parents('ul').find('li').removeClass("active");
                                            jQuery(this).closest('li').toggleClass("active");
                                            thiss.$hdnIdFolder.val(jQuery(this).closest('li').attr('id'));
                                            thiss.searchTracing(thiss.$txtDocumentSearch.val());
                                        });
                                    });
                                };
                                BaseWidget.prototype.save = function (url, data, options, callback) {
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
                                    console.log(thiss.getUsers());
                                    data = {
                                        id: thiss.$hdnIdFormTracing.val(),
                                        office : { id : thiss.$hdnIdOffice.int32() },
                                        startDate: thiss.$txtStartDate.date(),
                                        endDate: thiss.$txtEndDate.date(),
                                        observation: thiss.$txaObservation.val(),
                                        isConfidential: thiss.$chkConfidential.boolean(),
                                        employee: { id: thiss.$ddlUser.int32() },
                                        folder: { id: thiss.$hdnIdFolderTracing.int32() },
                                        tracingProcess: { id: thiss.$ddlTracingProcess.int32() },
                                        miningProject: { id: thiss.$hdnIdMiningProject.int32() },
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
                                        thiss.searchTracing(thiss.$txtDocumentSearch.val());
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
                                BaseWidget.prototype.form = function (url, id, options) {
                                    var thiss = this;
                                    /*if (thiss.getServicesOverlaps().length === 0) {
                                        toastr.info("Seleccione las capas a superponer");
                                        return;
                                    } else if (thiss.getServicesOverlaps().length > 10) {
                                        toastr.info("Seleccionar máximo 10 capas a consultar");
                                        return;
                                    }*/
                                    url = thiss.js.module.subModule.widget.path + thiss.configView.uri.base + '_formDocument.html?' + Math.random();
                                    options = options || {};
                                    options.title = "Añadir Documento";
                                    options.width = options.width || '60%';
                                    options.height = options.height || jQuery(window).height() - 50;
                                    options.draggable = options.draggable || false;
                                    options.dialogTitle = options.dialogTitle || "Documento";
                                    thiss.$form = $('<div></div>').appendTo(thiss.$widget);
                                    thiss.$form.dialog({
                                        title: options.dialogTitle,
                                        fluid: true,
                                        height: options.height,
                                        width: options.width,
                                        resizable: false,
                                        closeOnEscape: true,
                                        autoOpen: true,
                                        modal: true,
                                        autoremove: true,
                                        draggable: options.draggable
                                    });
                                    thiss.$form.css("overflow", "");
                                    var $iframe = $('<iframe id="iframe" width="100%" height="100%" frameborder="0"></iframe>');
                                    thiss.$form.append($iframe);
                                    $iframe.on("load", function (e) {
                                        var thisFrame = this;
                                        var $head = jQuery(this.contentDocument).find("head");
                                        var $title = jQuery(this.contentDocument).find("title");
                                        thiss.$hdnIdFormTracing = jQuery(this.contentDocument).find('#hdnIdFormTracing');
                                        thiss.$hdnIdFolderTracing = jQuery(this.contentDocument).find('#hdnIdFolderTracing');
                                        thiss.$hdnIdDocument = jQuery(this.contentDocument).find('#hdnIdDocument');
                                        thiss.$txtEndDate = jQuery(this.contentDocument).find('#txtEndDate');
                                        thiss.$txtStartDate = jQuery(this.contentDocument).find('#txtStartDate');
                                        thiss.$txaObservation = jQuery(this.contentDocument).find('#txaObservation');
                                        thiss.$ddlUser = jQuery(this.contentDocument).find('#ddlUser');
                                        thiss.$ddlTracingProcess = jQuery(this.contentDocument).find('#ddlTracingProcess');
                                        thiss.$btnSave = jQuery(this.contentDocument).find('#btnSaveTracing');
                                        thiss.$btnCleanTracing = jQuery(this.contentDocument).find('#btnCleanTracing');
                                        thiss.$filFile = jQuery(this.contentDocument).find('#filFile');
                                        thiss.$btnFile = jQuery(this.contentDocument).find('#btnFile');
                                        thiss.$txtDocumentName = jQuery(this.contentDocument).find('#txtDocumentName');
                                        thiss.$hdnIdFormTracing.val(options.tracingId);
                                        thiss.$hdnIdFolderTracing.val(options.folderId);
                                        var jss = [];
                                        var csss = [];
                                        csss.push(com.jtm.Server.contextPath + 'assets/css/bootstrap.min.css');
                                        jss.push(com.jtm.Server.contextPath + 'assets/js/jquery.min.js');
                                        jss.push(com.jtm.Server.contextPath + 'assets/js/bootstrap.min.js');
                                        csss.push(com.jtm.Server.contextPath + 'assets/css/extra.min.css');
                                        csss.push(com.jtm.Server.contextPath + 'assets/css/gh.min.css');
                                        csss.push(com.jtm.Server.contextPath + 'assets/css/jazani.min.css');

                                        BaseWidget.addCsss($head, csss);
                                        BaseWidget.addScripts($head, jss);
                                        $title.text(String.isNullOrWhiteSpace(options.title) ? 'Detalle' : options.title);
                                        //thiss.showHideToolbar(true);                                       
                                        thiss.datePicker(thiss.$txtEndDate);
                                        thiss.datePicker(thiss.$txtStartDate);
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
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "admin/user/list",
                                            ddl: thiss.$ddlUser,
                                            data: {}
                                        });
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "documentlibrary/tracingprocess/list",
                                            ddl: thiss.$ddlTracingProcess,
                                            data: {}
                                        });
                                        if (id > 0)
                                            thiss.detail(id);
                                    });
                                    $iframe.attr("src", url);
                                };
                                BaseWidget.prototype.form2 = function (url, id, options) {
                                    var thiss = this;
                                    options = options || {};
                                    options.title = options.title || "";
                                    thiss.$divPopup.dialog({
                                        title: options.title,
                                        width: screen.width,
                                        resizable: false,
                                        modal: true,
                                        closeOnEscape: true,
                                        autoempty: true,
                                        //position: [(x - 550) / 2, y - 100],
                                        close: function (dialog) {
                                        }
                                    });
                                    thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "geometry/viewer/formadddocument", function () {
                                        thiss.$hdnIdFormTracing = thiss.$divPopup.find('#hdnIdFormTracing');
                                        thiss.$hdnIdFolderTracing = thiss.$divPopup.find('#hdnIdFolderTracing');
                                        thiss.$hdnIdDocument = thiss.$divPopup.find('#hdnIdDocument');
                                        thiss.$txtEndDate = thiss.$divPopup.find('#txtEndDate');
                                        thiss.$txtStartDate = thiss.$divPopup.find('#txtStartDate');
                                        thiss.$txaObservation = thiss.$divPopup.find('#txaObservation');
                                        thiss.$ddlUser = thiss.$divPopup.find('#ddlUser');
                                        thiss.$ddlTracingProcess = thiss.$divPopup.find('#ddlTracingProcess');
                                        thiss.$tblResultUser = thiss.$divPopup.find('#tblResultUser');
                                        thiss.$chkConfidential = thiss.$divPopup.find('#chkConfidential');
                                        thiss.$btnSave = thiss.$divPopup.find('#btnSaveTracing');
                                        thiss.$btnCleanTracing = thiss.$divPopup.find('#btnCleanTracing');
                                        thiss.$filFile = thiss.$divPopup.find('#filFile');
                                        thiss.$btnFile = thiss.$divPopup.find('#btnFile');
                                        thiss.$txtDocumentName = thiss.$divPopup.find('#txtDocumentName');
                                        thiss.$hdnIdFormTracing.val(id);
                                        thiss.$hdnIdFolderTracing.val(options.folderId);
                                        thiss.datePicker(thiss.$txtEndDate);
                                        thiss.datePicker(thiss.$txtStartDate);
                                        thiss.$divAlert = thiss.$divPopup.find('#divAlert');
                                        thiss.$tblResultAlert = thiss.$divPopup.find('#tblResultAlert');
                                        thiss.$chkAlert = thiss.$divPopup.find('#chkAlert');
                                        thiss.$ddlFrequency = thiss.$divPopup.find('#ddlFrequency');
                                        thiss.$btnAddAlert = thiss.$divPopup.find('#btnAddAlert');
                                        thiss.$txtStartDateAlert = thiss.$divPopup.find('#txtStartDateAlert');
                                        thiss.$txtEndDateAlert = thiss.$divPopup.find('#txtEndDateAlert');
                                        thiss.datePicker(thiss.$txtStartDateAlert);
                                        thiss.datePicker(thiss.$txtEndDateAlert);

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
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "admin/user/list",
                                            ddl: thiss.$ddlUser,
                                            data: {}
                                        });
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "documentlibrary/tracingprocess/list",
                                            ddl: thiss.$ddlTracingProcess,
                                            data: {}
                                        });
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "documentlibrary/ruletype/list",
                                            ddl: thiss.$ddlFrequency,
                                            data: {}
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
                                            if ($(this).is(':checked') && thiss.$txtStartDate.date() != null && thiss.$txtEndDate.date() != null) {
                                                if (thiss.$txtStartDate.date2() <= thiss.$txtEndDate.date2()) {
                                                    thiss.$txtStartDateAlert.val(thiss.$txtStartDate.date());
                                                    thiss.$txtEndDateAlert.val(thiss.$txtEndDate.date());
                                                    thiss.$divAlert.show();
                                                    thiss.$tblResultAlert.show();
                                                } else{
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

                                        thiss.$tblResultAlert.find('>tbody').off('click', "> tr > td > .btnDeleteAlert");
                                        thiss.$tblResultAlert.find('>tbody').on('click', "> tr > td > .btnDeleteAlert", function (e) {
                                            $(this).closest('tr').remove();
                                        });

                                        thiss.listUsers();
                                        if (id > 0)
                                            thiss.detail(id);
                                    });
                                };
                                BaseWidget.prototype.cleanControls = function () {
                                    var thiss = this;
                                };
                                BaseWidget.prototype.resetContainers = function (toNull) {
                                    var thiss = this;
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            documentlibrary.BaseWidget = BaseWidget;
                        })(custom.documentlibrary || (custom.documentlibrary = {}));
                        var documentlibrary = custom.documentlibrary;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));