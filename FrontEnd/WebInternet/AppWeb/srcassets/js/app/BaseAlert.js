var com;
(function (com) {
    (function (jtm) {
        var BaseAlert = (function (_super) {
            __extends(BaseAlert, _super);
            function BaseAlert() {
                _super.call(this);
                this.fillMembers = function (items, tbl, div) {
                    var html = '';
                    var viewControl = '';
                    jQuery.each(items, function (i, item) {
                        viewControl = (item.state) ? ' checked="true"' : '';
                        html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                        html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" ' + viewControl + ' /></td>';
                        html += '<td>' + (i + 1) + '</td>';
                        html += '<td>' + item.code + '</td>';
                        html += '<td>' + item.name + '</td>';
                        html += '</tr>';
                    });
                    jQuery(tbl + '>tbody').html(html);
                    jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                    com.jtm.helper.Table.highlightRow(tbl);
                };
                this.fillUsers = function (items, tbl, div) {
                    var html = '';
                    var viewControl = '';
                    jQuery.each(items, function (i, item) {
                        viewControl = (item.state) ? ' checked="true"' : '';
                        html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                        html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" ' + viewControl + '  /></td>';
                        html += '<td>' + (i + 1) + '</td>';
                        html += '<td>' + item.name + '</td>';
                        html += '<td>' + item.user.name + '</td>';
                        html += '</tr>';
                    });
                    jQuery(tbl + '>tbody').html(html);
                    jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                    com.jtm.helper.Table.highlightRow(tbl);
                };
            }

            BaseAlert.prototype.form = function (url, id, options) {
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
            BaseAlert.prototype.detail = function (url, id, options) {
                var thiss = this;
                _super.prototype.detail.call(this, url, id, null, function (data) {
                    var item = data.item;
                    thiss.$hdnId.val(item.id);
                    jQuery('#txtName').val(item.name);
                    jQuery('#txtRule').val(item.rule);
                    jQuery('#txtStartDate').val(item.startDate);
                    jQuery('#txtEndDate').val(item.endDate);
                    jQuery('#txaDescription').val(item.description);
                    jQuery('#chkState').prop("checked", item.state);
                    thiss.searchMembers(item);
                    thiss.searchUsers(item);
                });
            };
            BaseAlert.prototype.report = function (dom, id) {
                var thiss = this;
            };
            BaseAlert.prototype.search = function (url, options, callback) {
                var thiss = this;
                options = options || {};
                options.columns = [{
                    field: "name",
                    searchable: false,
                    sortable: true,
                    visible: true,
                    switchable: false
                }, {
                    field: "description",
                    searchable: false,
                    sortable: true,
                    visible: true,
                    switchable: false
                }, {
                    field: "endDate",
                    searchable: false,
                    sortable: true,
                    visible: true,
                    switchable: true
                }, {
                    field: "stateName",
                    searchable: false,
                    sortable: true,
                    visible: true,
                    switchable: true
                }
                ];
                _super.prototype.search.call(this, url, options, callback);
            };
            BaseAlert.prototype.parameters = function () {
                return {
                    name: jQuery('#txtNameSearch').string(),
                    state: jQuery('#chkStateSearch').boolean()
                };
            };
            BaseAlert.prototype.save = function (url, data, options) {
                var thiss = this;
                options = options || {};
                options.validate = validate;
                data = this.parametersSave();
                _super.prototype.save.call(this, url, data, options);
                function validate() {
                    var success = true;
                    var message = '';
                    if (data === undefined) {
                        success = false;
                    }
                    else if (jQuery('#txtName').string() === '') {
                        success = false;
                        message = 'Ingrese el Nombre.';
                        jQuery('#txtName').focus();
                    }
                    else if (jQuery('#txtStartDate').string() === '') {
                        success = false;
                        message = 'Ingrese la fecha de inicio.';
                        jQuery('#txtStartDate').focus();
                    }
                    else if (jQuery('#txtEndDate').string() === '') {
                        success = false;
                        message = 'Ingrese la fecha final.';
                        jQuery('#txtEndDate').focus();
                    }
                    else if (jQuery('#txtEndDate').date() <= jQuery('#txtStartDate').date()) {
                        success = false;
                        message = 'La fecha final debe ser mayor a la fecha de inicio.';
                        jQuery('#txtEndDate').focus();
                    }
                    else if (jQuery('#txtRule').string() === '') {
                        success = false;
                        message = 'Ingrese el nombre de la Regla.';
                        jQuery('#txtRule').focus();
                    }
                    else if (data.users === undefined || data.users.length === 0 || data.users === null) {
                        success = false;
                        message = 'Seleccione al menos un usuario';
                    }
                    if (message !== '')
                        alert(message);
                    return success;
                }
            };
            BaseAlert.prototype.parametersSave = function () {
                var data = {
                    id: this.$hdnId.int32(),
                    name: jQuery('#txtName').string(),
                    description: jQuery('#txaDescription').string(),
                    startDate: jQuery('#txtStartDate').date(),
                    endDate: jQuery('#txtEndDate').date(),
                    rule: jQuery('#txtRule').string(),
                    state: jQuery('#chkState').boolean(),
                    users: com.jtm.helper.Table.getItems("#tbdResultUsers", true, true)
                };
                return data;
            };
            return BaseAlert;
        })(jtm.Master);
        jtm.BaseAlert = BaseAlert;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));