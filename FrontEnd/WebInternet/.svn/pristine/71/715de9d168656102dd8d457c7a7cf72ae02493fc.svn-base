(function (com) {
    (function (jtm) {
        (function (general) {
            var BaseProcedure = (function (_super) {
                __extends(BaseProcedure, _super);
                function BaseProcedure() {
                    _super.call(this);
                    this.detailModule = function (id) {
                        var thiss = this;
                        function validate() {
                            if (id === 0)
                                return false;
                            else
                                return true;
                        }
                        var options = {
                            data: { id: id },
                            validate: validate
                        };
                        thiss.detailConfig(thiss.urls.detailModule, options, function (data) {
                            jQuery('#txtNameModule>p').html(data.item.code + ' - ' + data.item.name);
                        });
                    };
                    this.list = function () {
                        var thiss = this;
                        thiss.searchConfig(thiss.urls.list, { data: {}, async: false }, function (items) {
                            thiss.fillList(items);
                        });
                    };
                    this.fillList = function (items) {
                        var thiss = this;
                        var pendingColor = thiss.config.module.procedure.state.pending.color;
                        var pendingTitle = thiss.config.module.procedure.state.pending.label;
                        var pendingText = thiss.config.module.procedure.state.pending.textColor;
                        var pendingIcon = thiss.config.module.procedure.state.pending.icon;
                        var html = '';
                        items.forEach(function (item, i) {
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" title="' + pendingTitle + '" style="color:' + pendingText + '" >';
                            html += '<td> <button type="button" class="btn" style="background-color:' + pendingColor + ' !important; border-radius: 70px;"><i style="color:white" class="glyphicon ' + pendingIcon + '"></i> </button> </td>';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.name + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td><button class="btn btn-default btnEditProcedure" type="button" id="btnEditProcedure"><i class="glyphicon glyphicon-pencil"></i> Editar</button>  </td>';
                            html += '</tr>';
                        });
                        thiss.$tblResultProcedure.find('>tbody').html(html);
                        thiss.$divTotalProcedure.find('>span').html(thiss.$tblResultProcedure.find('>tbody>tr').length);
                        com.jtm.helper.Table.highlightRow(thiss.$tblResultProcedure);
                        if (thiss.$divLegend.find('>div').length === 0) {
                            thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.procedure.state.pending.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.state.pending.label + '</div>');
                            thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.procedure.state.procedure.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.state.procedure.label + '</div>');
                            thiss.$divLegend.append('<div><span style="background-color:' + thiss.config.module.procedure.state.completed.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.state.completed.label + '</div>');
                        }
                    };
                    this.searchByModule = function () {
                        var thiss = this;
                        var procedureColor = thiss.config.module.procedure.state.procedure.color;
                        var procedureTitle = thiss.config.module.procedure.state.procedure.label;
                        var procedureText = thiss.config.module.procedure.state.procedure.textColor;
                        var completedColor = thiss.config.module.procedure.state.completed.color;
                        var completedTitle = thiss.config.module.procedure.state.completed.label;
                        var completedText = thiss.config.module.procedure.state.completed.textColor;
                        var $tr = null;
                        this.searchConfig(thiss.urls.searchByModule, { data: { id: thiss.$hdnId.int32() } }, function (items) {
                            items.forEach(function (item) {                                
                                $tr = thiss.$tblResultProcedure.find('>tbody>tr[data-uniqueid="' + item.id + '"]');
                                if ($tr.length === 0) return;
                                $tr.find("td:eq(3)").text(item.timeResolve);
                                if (item.stateProcedure === thiss.config.module.procedure.state.procedure.id || item.stateProcedure === thiss.config.module.procedure.state.completed.id) {
                                    $tr.find("td:eq(4)").text(item.approvalDate);
                                    $tr.find("td:eq(5)").text(item.expirationDate);
                                    if (item.stateProcedure === thiss.config.module.procedure.state.procedure.id) {
                                        $tr.attr("title", procedureTitle).css({ "color": procedureText });
                                        $tr.find("td:eq(0)>button>i").removeClass("glyphicon-alert").addClass("glyphicon-minus");
                                        $tr.find("td:eq(0)>button")[0].style.setProperty('background-color', procedureColor, 'important');
                                    } else if (item.stateProcedure === thiss.config.module.procedure.state.completed.id) {
                                        $tr.attr("title", completedTitle).css({ "color": completedText, "font-weight": "bold" });
                                        $tr.find("td:eq(0)>button>i").removeClass("glyphicon-alert").addClass("glyphicon-ok");
                                        $tr.find("td:eq(0)>button")[0].style.setProperty('background-color', completedColor, 'important');
                                        $tr.find("td:eq(6)").html(item.document.id === null ? "" : '<a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name);
                                    }
                                }
                            });
                            thiss.$tblResultProcedure.find('>tbody').off('click', "> tr > td > .btnEditProcedure");
                            thiss.$tblResultProcedure.find('>tbody').on('click', "> tr > td > .btnEditProcedure", function (e) {
                                var id = jQuery(this).closest("tr").attr("data-uniqueid");
                                thiss.detail(id);
                                thiss.searchRequirements(id);
                            });
                            thiss.$tblResultProcedure.find('>tbody').off("dblclick", "> tr");
                            thiss.$tblResultProcedure.find('>tbody').on("dblclick", "> tr", function (e) {
                                var id = jQuery(this).attr("data-uniqueid");
                                thiss.searchRequirements(id);
                            });
                        });
                    };
                    this.detail = function (id) {
                        var thiss = this;
                        jQuery('#divFileAttachment').empty();
                        var options = {
                            data: { moduleId: thiss.$hdnId.int32(), id: id },
                            isJson: false
                        };
                        this.detailConfig(thiss.urls.detail, options, function (data) {
                            var item = data.item;
                            var approvalDate = (item.approvalDate === null || item.approvalDate === '') ? "indefinido" : item.approvalDate;
                            var expirationDate = (item.expirationDate === null || item.expirationDate === '') ? "indefinido" : item.expirationDate;
                            thiss.$hdnIdProcedure.val(item.id);
                            jQuery('#txtName>p').html(item.name);
                            jQuery('#txtApprovalDate').val(approvalDate);
                            jQuery('#txtExpirationDate').val(expirationDate);
                            if (item.document.id !== null) {
                                jQuery('#divFileAttachment').append('<a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + ' </a>' +
                                    '<button type="button" id="btnAttachment' + item.document.id + '" class="btn btn-default btn-xs"> <i class="glyphicon glyphicon-trash jca-cursor jca-file-remove"></i></button>');
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
                        thiss.deleteConfig(com.jtm.Server.contextPath + "documentlibrary/document/delete", options, function () {
                            jQuery('#divFileAttachment').empty();
                            thiss.list();
                            thiss.searchByModule();
                            thiss.clearForm();
                        });
                        function validate() {
                            if (thiss.$hdnIdRequirement.int32() === 0)
                                return false;
                            return true;
                        }
                    };
                    this.clearForm = function () {
                        this.$hdnIdProcedure.val('');
                        jQuery('#txtName>p').html('');
                        jQuery('#txtApprovalDate').val('');
                        jQuery('#txtExpirationDate').val('');
                        jQuery('#divFileAttachment').empty();
                        this.$filFileProcedure.val('');
                        this.$smlNameProcedure.html('');
                    };
                    this.searchRequirements = function (id) {
                        var thiss = this;
                        var idRequirement = 0;
                        thiss.searchConfig(thiss.urls.searchRequirement, { data: { id: id, moduleId: thiss.$hdnId.int32() }, isJson: false }, function (items) {
                            thiss.fillRequirements(items);
                        });
                        thiss.$tblResultRequirement.find('>tbody').off("dblclick", "> tr");
                        thiss.$tblResultRequirement.find('>tbody').on("dblclick", "> tr", function (e) {
                            idRequirement = jQuery(this).attr("data-uniqueid");
                            thiss.detailRequirement(idRequirement);
                        });
                        thiss.$hdnIdProcedure.val(id);
                        thiss.clearFormRequirement();
                    };
                    this.fillRequirements = function (items) {
                        var thiss = this;                        
                        var html = '';
                        var title = null;
                        var color = null;                       
                        var textColor = null;
                        var icon = null;
                        items.forEach(function (item, i) {
                            if (item.stateProcedure === thiss.config.module.procedure.requirement.state.pending.id) {
                                title = thiss.config.module.procedure.requirement.state.pending.label;
                                color = thiss.config.module.procedure.requirement.state.pending.color;
                                textColor = thiss.config.module.procedure.requirement.state.pending.textColor;
                                icon = thiss.config.module.procedure.requirement.state.pending.icon;
                            } else if (item.stateProcedure === thiss.config.module.procedure.requirement.state.procedure.id) {
                                title = thiss.config.module.procedure.requirement.state.procedure.label;
                                color = thiss.config.module.procedure.requirement.state.procedure.color;                                
                                textColor = thiss.config.module.procedure.requirement.state.procedure.textColor;
                                icon = thiss.config.module.procedure.requirement.state.procedure.icon;
                            } else if (item.stateProcedure === thiss.config.module.procedure.requirement.state.completed.id) {
                                title = thiss.config.module.procedure.requirement.state.completed.label;
                                color = thiss.config.module.procedure.requirement.state.completed.color;
                                textColor = thiss.config.module.procedure.requirement.state.completed.color;
                                icon = thiss.config.module.procedure.requirement.state.completed.icon;
                            }
                            html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" title="' + title + '" style="color:' + textColor + '" >';
                            html += '<td><button type="button" class="btn" style="background-color:' + color + ' !important; border-radius: 70px"><i style="color:white" class="glyphicon ' + icon + '"></i></button></td>';
                            html += '<td>' + (i + 1) + '</td>';
                            html += '<td>' + item.name + '</td>';
                            html += '<td>' + item.realizationDate + '</td>';
                            html += '<td> ' + (item.document.id === null ? '' : '<a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name) + '</td>';
                            html += '</tr>';
                        });
                        thiss.$tblResultRequirement.find('>tbody').html(html);
                        thiss.$divTotalRequirement.find('>span').html(thiss.$tblResultRequirement.find('>tbody>tr').length);
                        com.jtm.helper.Table.highlightRow(thiss.$tblResultRequirement);
                        if (thiss.$divLegendRequirement.find('>div').length === 0) {
                            thiss.$divLegendRequirement.append('<div><span style="background-color:' + thiss.config.module.procedure.requirement.state.pending.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.requirement.state.pending.label + '</div>');
                            thiss.$divLegendRequirement.append('<div><span style="background-color:' + thiss.config.module.procedure.requirement.state.procedure.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.requirement.state.procedure.label + '</div>');
                            thiss.$divLegendRequirement.append('<div><span style="background-color:' + thiss.config.module.procedure.requirement.state.completed.color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + thiss.config.module.procedure.requirement.state.completed.label + '</div>');
                        }
                    };
                    this.detailRequirement = function (id) {
                        var thiss = this;
                        jQuery('#divFileAttachment2').empty();
                        var options = {
                            data: { id: id, procedureId: thiss.$hdnIdProcedure.int32(), moduleId: thiss.$hdnId.int32() },
                            isJson: false,
                            validate: true
                        };
                        this.detailConfig(thiss.urls.detailRequirement, options, function (data) {
                            var item = data.item;
                            var realizationDate = (item.realizationDate === null || item.realizationDate === '') ? "indefinido" : item.realizationDate;
                            thiss.$hdnIdRequirement.val(item.id);
                            jQuery('.txtNameRequirement>p').html(item.name);
                            jQuery('#txtRealizationDateRequirement').val(realizationDate);
                            if (item.document.id !== null) {
                                jQuery('#divFileAttachment2').append('<a href="' + com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + item.document.id + '" target="_blank"> ' + item.document.name + ' </a>' +
                                    ' <button type="button" id="btnAttachment2' + item.document.id + '" class="btn btn-default btn-xs"> <i class="glyphicon glyphicon-trash jca-cursor jca-file-remove"></i></button>');
                                jQuery("#btnAttachment2" + item.document.id + "").on("click", function (e) {
                                    thiss.deleteDocumentRequirement(item.document.id);
                                });
                            }
                        });
                    };
                    this.deleteDocumentRequirement = function (id) {
                        var thiss = this;
                        var options = {
                            data: { id: id },
                            isJson: false,
                            validate: validate
                        };
                        function validate() {
                            if (thiss.$hdnIdProcedure.int32() === 0)
                                return false;
                            return true;
                        }
                        thiss.deleteConfig(com.jtm.Server.contextPath + "documentlibrary/document/delete", options, function () {
                            jQuery('#divFileAttachment2').empty();
                            thiss.searchRequirements(thiss.$hdnIdProcedure.int32());
                            thiss.clearFormRequirement();
                        });
                    };
                    this.clearFormRequirement = function () {
                        this.$hdnIdRequirement.val('');
                        jQuery("#txtNameRequirement>p").html('');
                        jQuery('#txtRealizationDateRequirement').val('');
                        jQuery('#divFileAttachment2').empty();
                        this.$filFileRequirement.val('');
                        this.$smlNameRequirement.html('');
                    };
                }
                BaseProcedure.HDNIDPROCEDURE = "#hdnIdProcedure";
                BaseProcedure.HDNIDREQUIREMENT = "#hdnIdRequirement";
                BaseProcedure.TBLRESULTPROCEDURE = "#tblResultProcedures";
                BaseProcedure.TBLRESULTREQUIREMENT = "#tblResultRequirements";
                BaseProcedure.DIVTOTALRESULTPROCEDURE = "#divTotalResultProcedure";
                BaseProcedure.DIVTOTALRESULTREQUIREMENT = "#divTotalRequirement";
                BaseProcedure.DIVLEGEND = "#divLegend";
                BaseProcedure.DIVLEGENDREQUIREMENT = "#divLegendRequirement";
                BaseProcedure.prototype.form = function (url, id, options) {
                    var thiss = this;
                    thiss.loadView(thiss.$form, thiss.urls.form, function () {
                        thiss.$main.hide();
                        thiss.$form.show();
                        thiss.buildClose();
                        thiss.initConfig();
                        thiss.domConfig();
                        thiss.viewConfig();
                        thiss.buttonConfig();
                        thiss.$hdnId.val(id);
                        thiss.detailModule(id);
                        thiss.list();
                        thiss.searchByModule();
                        thiss.$btnFileProcedure.off('click');
                        thiss.$btnFileProcedure.on('click', function (e) {
                            thiss.$filFileProcedure.trigger("click");
                        });
                        thiss.$filFileProcedure.off("change");
                        thiss.$filFileProcedure.on("change", function (e) {
                            if (e.originalEvent.target.files.length) {
                                e.preventDefault();
                                e.stopPropagation();
                                thiss.$smlNameProcedure.html(e.originalEvent.target.files[0].name);
                            }
                        });
                        thiss.$btnFileRequirement.off('click');
                        thiss.$btnFileRequirement.on('click', function (e) {
                            thiss.$filFileRequirement.trigger("click");
                        });
                        thiss.$filFileRequirement.off("change");
                        thiss.$filFileRequirement.on("change", function (e) {
                            if (e.originalEvent.target.files.length) {
                                e.preventDefault();
                                e.stopPropagation();
                                thiss.$smlNameRequirement.html(e.originalEvent.target.files[0].name);
                            }
                        });
                    });
                };
                BaseProcedure.prototype.save = function (url, data, options, callback) {
                    var thiss = this;
                    url = String.isNullOrWhiteSpace(url) === true ? thiss.urls.save : url;
                    data = thiss.parametersSave();
                    options = {
                        attachments: [{ id: "filFile", file: thiss.$filFileProcedure[0].files[0] }],
                        validate: validate
                    };
                    _super.prototype.save.call(this, url, data, options, function () {
                        thiss.clearForm();
                        thiss.clearFormRequirement();                        
                        thiss.$tblResultRequirement.find('>tbody').empty();
                        thiss.$divTotalRequirement.find('>span').html(0);
                        thiss.list();
                        thiss.searchByModule();
                    });
                    function validate() {
                        var success = true;
                        var message = '';
                        if (thiss.$hdnIdProcedure.int32() === 0 || jQuery('#txtName>p').html() === '') {
                            success = false;
                            message = 'Seleccione un Procedimiento';
                        } else if (jQuery('#txtApprovalDate').date() === null || jQuery('#txtApprovalDate').string() === 'indefinido' || jQuery('#txtApprovalDate').string() === '') {
                            success = false;
                            message = 'Ingrese la fecha inicio';
                            jQuery('#txtApprovalDateProcedure').focus();
                        } else if (jQuery('#txtExpirationDate').date() === null || jQuery('#txtExpirationDate').string() === 'indefinido' || jQuery('#txtExpirationDate').string() === '') {
                            success = false;
                            message = 'Ingrese la fecha fin.';
                            jQuery('#txtExpirationDateProcedure').focus();
                        } else if (jQuery('#txtApprovalDate').date() >= jQuery('#txtExpirationDate').date()) {
                            success = false;
                            message = 'La fecha fin debe ser mayor a la fecha inicio.';
                            jQuery('#txtExpirationDateProcedure').focus();
                        }
                        if (message !== '')
                            alert(message);
                        return success;
                    }
                };
                BaseProcedure.prototype.saveRequirement = function (url, data, options, callback) {
                    var thiss = this;
                    url = String.isNullOrWhiteSpace(url) === true ? thiss.urls.saveRequirement : url;
                    data = thiss.parametersSaveRequirement();
                    options = {
                        attachments: [{ id: "filFileRequirement", file: thiss.$filFileRequirement[0].files[0] }],
                        validate: validate
                    };
                    _super.prototype.save.call(this, url, data, options, function () { thiss.searchRequirements(thiss.$hdnIdProcedure.int32()); thiss.clearFormRequirement(); });
                    function validate() {
                        var success = true;
                        var message = '';
                        if (thiss.$hdnIdRequirement.int32() === 0 || jQuery('#txtNameRequirement>p').html() === '') {
                            success = false;
                            message = 'Seleccione un Requirimiento';
                            jQuery('#tblResultProcedures').focus();
                        } else if (jQuery('#txtRealizationDateRequirement').date() === "" || jQuery('#txtRealizationDateRequirement').string() === "" || jQuery('#txtRealizationDateRequirement').date() === null || jQuery('#txtRealizationDateRequirement').string() === 'indefinido') {
                            success = false;
                            message = 'Seleccione fecha de Realización';
                            jQuery('#txtRealizationDateRequirement').focus();
                        }
                        if (message !== '')
                            alert(message);
                        return success;
                    }
                };
                BaseProcedure.prototype.parametersSaveRequirement = function () {
                    var data = {
                        id: jQuery('#hdnIdRequirement').val(),
                        procedure: { id: jQuery('#hdnIdProcedure').int32() },
                        realizationDate: jQuery('#txtRealizationDateRequirement').date()
                    };
                    return data;
                };
                BaseProcedure.prototype.parametersSave = function () {
                    var data = {
                        id: jQuery('#hdnIdProcedure').val(),
                        approvalDate: jQuery('#txtApprovalDate').date(),
                        expirationDate: jQuery('#txtExpirationDate').date()
                    };
                    return data;
                };
                BaseProcedure.prototype.initConfig = function () {
                    var thiss = this;
                    thiss.datePicker('#txtApprovalDate');
                    thiss.datePicker('#txtExpirationDate');
                    thiss.datePicker('#txtRealizationDateRequirement');
                };
                BaseProcedure.prototype.domConfig = function () {
                    this.$hdnId = this.$form.find(BaseProcedure.HDNID);
                    this.$hdnIdProcedure = this.$form.find(BaseProcedure.HDNIDPROCEDURE);
                    this.$hdnIdRequirement = this.$form.find(BaseProcedure.HDNIDREQUIREMENT);
                    this.$tblResultProcedure = this.$form.find(BaseProcedure.TBLRESULTPROCEDURE);
                    this.$tblResultRequirement = this.$form.find(BaseProcedure.TBLRESULTREQUIREMENT);
                    this.$divTotalProcedure = this.$form.find(BaseProcedure.DIVTOTALRESULTPROCEDURE);
                    this.$divTotalRequirement = this.$form.find(BaseProcedure.DIVTOTALRESULTREQUIREMENT);
                    this.$divLegend = this.$form.find(BaseProcedure.DIVLEGEND);
                    this.$divLegendRequirement = this.$form.find(BaseProcedure.DIVLEGENDREQUIREMENT);
                    this.$btnSaveProcedure = this.$form.find('#btnSaveProcedure');
                    this.$btnCleanProcedure = this.$form.find('#btnCleanProcedure');
                    this.$btnSaveRequirement = this.$form.find('#btnSaveRequirement');
                    this.$btnCleanRequirement = this.$form.find('#btnCleanRequirement');
                    this.$btnFileProcedure = this.$form.find('#btnFileProcedure');
                    this.$btnFileRequirement = this.$form.find('#btnFileRequirement');
                    this.$smlNameProcedure = this.$form.find('#smlNameProcedure');
                    this.$smlNameRequirement = this.$form.find('#smlNameRequirement');
                    this.$filFileProcedure = this.$form.find('#filFileProcedure');
                    this.$filFileRequirement = this.$form.find('#filFileRequirement');
                };
                BaseProcedure.prototype.viewConfig = function () {

                };
                BaseProcedure.prototype.buttonConfig = function () {
                    var thiss = this;
                    thiss.$btnSaveProcedure.off('click');
                    thiss.$btnSaveProcedure.on('click', function (e) {
                        thiss.save();
                    });
                    thiss.$btnCleanProcedure.off('click');
                    thiss.$btnCleanProcedure.on('click', function (e) {
                        thiss.clearForm();
                    });
                    thiss.$btnSaveRequirement.off('click');
                    thiss.$btnSaveRequirement.on('click', function (e) {
                        thiss.saveRequirement();
                    });
                    thiss.$btnCleanRequirement.off('click');
                    thiss.$btnCleanRequirement.on('click', function (e) {
                        thiss.clearFormRequirement();
                    });
                };
                BaseProcedure.prototype.load = function ($container, options) {
                    var thiss = this;
                    options = options || {};
                    if (String.isNullOrWhiteSpace($container) === true)
                        $container = this.$form;
                    if (typeof $container === "string")
                        $container = jQuery($container);
                    this.$form = ($container.length === 0) ? this.$form : $container;
                    this.$main = this.$form.parent().find(BaseProcedure.DOMMAIN);
                    this.form(null, options.id, options);
                    //this.initConfig();
                    //this.domConfig();
                    //this.viewConfig();
                    //this.buttonConfig();                    
                };
                BaseProcedure.prototype.setConfig = function (value, options, callback) {
                    var thiss = this;
                    this.config = value || {};
                    this.config.module = this.config.module || {};
                    options = options || { config: thiss.config.module, property: "procedure" };
                    options.module = String.isNullOrWhiteSpace(options.module) === true ? "" : options.module;
                    options.subModule = String.isNullOrWhiteSpace(options.subModule) === true ? "" : options.subModule;
                    options.jsonFile = String.isNullOrWhiteSpace(options.jsonFile) === true ? BaseProcedure.JSONBASE + "baseprocedure" : options.jsonFile;
                    thiss.setRoots(options);
                    this.loadConfig(options, callback);
                    //_super.prototype.setConfig.call(this,value,options,callback);
                };
                return BaseProcedure;
            })(jtm.Master);
            general.BaseProcedure = BaseProcedure;
        })(jtm.general || (jtm.general = {}));
        var general = jtm.general;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));