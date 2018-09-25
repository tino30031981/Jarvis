(function (com) {
    (function (jtm) {
        (function (admin) {
            (function (user) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "adm";
                    }

                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            jQuery('#txtDocumentNumber').numeric({ negative: false, });
                            jQuery('#txtLandLine').numeric({ negative: false, });
                            jQuery('#txtMobile').numeric({ negative: false, });
                            thiss.datePicker('#txtBirthDate');
                            jQuery('#ddlRole').on("change", function (e) {
                                thiss.searchConfig(com.jtm.Server.contextPath + "admin/role/searchmenuparents", { data: { id: jQuery(this).int32() } }, function (items) {
                                    thiss.fillModules(items);
                                });
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        jQuery('#txtUserName').prop("readonly", true);
                        jQuery('#txtUserName').prop("disabled", true);
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtUserName').val(item.userName);
                            jQuery('#txtFirstName').val(item.firstName);
                            jQuery('#txtLastName').val(item.lastName);
                            jQuery('#txtMaidenName').val(item.maidenName);
                            jQuery('#txtBirthDate').val(item.birthDate);
                            jQuery('#ddlCivilStatus').val((item.civilStatus.id === null) ? 0 : item.civilStatus.id);
                            jQuery('#ddlNationality').val((item.nationality.id === null) ? 0 : item.nationality.id);
                            jQuery('#ddlIdentificationDocument').val((item.identificationDocument.id === null) ? 0 : item.nationality.id);
                            jQuery('#txtDocumentNumber').val(item.documentNumber);
                            jQuery('#txtLandLine').val(item.landLine);
                            jQuery('#txtMobile').val(item.mobile);
                            jQuery('#ddlRole').val(item.role.id);
                            jQuery('#txtPersonalMail').val(item.personalMail);
                            jQuery('#txtCorporateMail').val(item.corporateMail);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#chkLdapAuthentication').prop("checked", item.ldapAuthentication);
                            thiss.fillModules(item.role.menus);
                        });
                    };
                    Main.prototype.fillModules = function (items) {
                        jQuery('#tblResultMenu').empty();
                        jQuery('#tblResultMenu').append('<thead></thead>');
                        jQuery('#tblResultMenu').append('<tbody></tbody>');
                        if (items === null || items.length === 0) return;
                        var html = '<tr><th>Módulo</th>';
                        jQuery.each(items[0].permissions, function (i, item) {
                            html += '<th>' + item.name + '</th>';
                        });
                        html += '</tr>';
                        jQuery('#tblResultMenu > thead').html(html);
                        html = '<tr>';
                        var state = '';
                        jQuery.each(items, function (i, item) {
                            html += '<td id="' + item.id + '">' + item.name + '</td>';
                            if (item.permissions instanceof Array) {
                                jQuery.each(item.permissions, function (i, item) {
                                    state = (item.state === true) ? 'checked="checked"' : '';
                                    html += '<td><input type="checkbox" id="chkPermission' + item.id + '" name="chkPermission' + item.id + '" value="' + item.id + '"' + state + ' disabled="disabled" /></td>';
                                });
                            }
                            html += '</tr>';
                        });
                        jQuery('#tblResultMenu > tbody').html(html);
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
                            field: 'userName',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'stateName',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            userName: jQuery('#txtUserNameSearch').string(),
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            role: {
                                id: jQuery('#ddlRole').int32()
                            },
                            userName: jQuery("#txtUserName").string(),
                            ldapAuthentication: jQuery("#chkLdapAuthentication").boolean(),
                            state: jQuery("#chkState").boolean(),
                            firstName: jQuery("#txtFirstName").string(),
                            lastName: jQuery("#txtLastName").string(),
                            maidenName: jQuery("#txtMaidenName").string(),
                            documentNumber: jQuery("#txtDocumentNumber").string(),
                            landLine: jQuery("#txtLandLine").string(),
                            mobile: jQuery("#txtMobile").string(),
                            personalMail: jQuery("#txtPersonalMail").string(),
                            corporateMail: jQuery("#txtCorporateMail").string(),
                            birthDate: jQuery("#txtBirthDate").date(),
                            civilStatus: {
                                id: jQuery("#ddlCivilStatus").int32()
                            },
                            nationality: {
                                id: jQuery("#ddlNationality").int32()
                            },
                            identificationDocument: {
                                id: jQuery("#ddlIdentificationDocument").int32()
                            },
                            passwordReset: jQuery("#chkPasswordReset").boolean(),
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            var regexEmail = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
                            if (jQuery('#txtUserName').string() === '') {
                                success = false;
                                message = 'Ingrese el Usuario.';
                                jQuery('#txtUserName').focus();
                            } else if (regexEmail.test(jQuery('#txtUserName').string()) === false) {
                                success = false;
                                message = 'Ingrese un correo válido.';
                                jQuery('#txtUserName').focus();
                            } /*else if (jQuery('#ddlRole').int32() === 0) {
                                success = false;
                                message = 'Seleccione Rol.';
                                jQuery('#ddlRole').focus();
                            }*/
                            else if (jQuery('#txtFirstName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtFirstName').focus();
                            } else if (jQuery('#txtLastName').string() === '') {
                                success = false;
                                message = 'Ingrese Apellido Paterno.';
                                jQuery('#txtLastName').focus();
                            } else if (jQuery('#txtMaidenName').string() === '') {
                                success = false;
                                message = 'Ingrese Apellido Materno.';
                                jQuery('#txtMaidenName').focus();
                            }
                            //						else if (jQuery('#ddlCivilStatus').int32() === 0) {
                            //							success = false;
                            //							message = 'Seleccione Estado Civil.';
                            //							jQuery('#ddlCivilStatus').focus();
                            //						}else if (jQuery('#ddlNationality').int32() === 0) {
                            //							success = false;
                            //							message = 'Seleccione Nacionalidad.';
                            //							jQuery('#ddlNationality').focus();
                            //						}else if (jQuery('#ddlIdentificationDocument').int32() === 0) {
                            //							success = false;
                            //							message = 'Seleccione Doc. Identificación.';
                            //							jQuery('#ddlIdentificationDocument').focus();
                            //						}else if (jQuery('#txtDocumentNumber').int32() === 0) {
                            //							success = false;
                            //							message = 'Seleccione Numero de Documento.';
                            //							jQuery('#txtDocumentNumber').focus();
                            //						}
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                        function getMenus() {
                            var data = [];
                            var json;
                            jQuery("#tblResultMenu tbody tr").each(function () {
                                var data2 = [];
                                jQuery(this).find('input[type=checkbox]').each(function () {
                                    if (jQuery(this).is(':checked')) {
                                        var json2 = { id: jQuery(this).val() };
                                        data2.push(json2);
                                    }
                                });
                                json = { id: jQuery(this).find('td:eq(0)').attr("id"), permissions: data2 };
                                data.push(json);
                            });
                            return data;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                user.Main = Main;
            })(admin.user || (admin.user = {}));
            var user = admin.user;
        })(jtm.admin || (jtm.admin = {}));
        var admin = jtm.admin;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.admin.user.Main.execute();