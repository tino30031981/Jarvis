(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (layertable) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.searchOffices = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'geometry/layertable/searchoffices',
                                {
                                    data: { id: thiss.$hdnId.int32(), isJson :false }
                                }, function (items) {
                                    thiss.fillOffices(items, '#tblResultOffices', "#divTotalOffice");
                                });
                        };
                        this.saveOffices = function () {
                            var thiss = this;
                            var officeIds = com.jtm.helper.Table.getItems("#tblResultOffices2", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), officeIds: officeIds },
                                validate: validate,
                                isJson: false
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'geometry/layertable/saveoffices', options, function () {
                                thiss.searchOffices(); jQuery('#divPopup').dialog('close');
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                if (officeIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos una oficina.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteOffices = function () {
                            var thiss = this;
                            var officeIds = com.jtm.helper.Table.getItems("#tblResultOffices", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), officeIds: officeIds },
                                isJson: false,
                                validate: validate
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'geometry/layertable/deleteoffices', options, function () { thiss.searchOffices(); });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$hdnId.int32() === 0) {
                                    success = false;
                                    message = Main.NEWELEMENTID;
                                }
                                else if (officeIds.length <= 0) {
                                    success = false;
                                    message = 'Seleccione al menos un integrante.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.fillOffices = function (items, tbl, div, itemsExist) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.name + '</td>';
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
                        this.formOffice = function () {
                            var thiss = this;
                            jQuery('#divPopup').dialog({
                                title: "Oficinas",
                                width: '800',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView('#divPopup', com.jtm.Server.contextPath + "geometry/layertable/formoffice", function () {
                                jQuery('#btnSearchOffice').off("click");
                                jQuery('#btnSearchOffice').on("click", function (e) {
                                    search();
                                });
                                jQuery('#btnSaveOffice').off("click");
                                jQuery('#btnSaveOffice').on("click", function (e) {
                                    thiss.saveOffices();
                                });
                                search();
                            });
                            function search() {
                                jQuery('#tbdResultMiningConcessions2').empty();
                                var layerId = thiss.$hdnId.int32();
                                var itemsExist = com.jtm.helper.Table.getItems("#tblResultOffices", false, false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'admin/office/searchforlayer', { data: { layerId: layerId }, isJson: false }, function (items) {
                                    thiss.fillOffices(items, '#tblResultOffices2', "#divTotalOffice2", itemsExist);
                                });
                            }
                        };
                    }
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                            jQuery('#btnQuitOffice').off("click");
                            jQuery('#btnQuitOffice').on("click", function (e) {
                                thiss.deleteOffices();
                            });
                            jQuery('#btnAddOffice').off("click");
                            jQuery('#btnAddOffice').on("click", function (e) {
                                if (id !== 0)
                                    thiss.formOffice(0, "Agregar Oficinas");
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtLabel').val(item.label);
                            jQuery('#txtUrl').val(item.url);
                            jQuery('#txtAlpha').val(item.alpha);
                            jQuery('#ddlLayerType').val(item.layerType.id === null ? 0 : item.layerType.id);
                            jQuery('#txtLayerIds').val(item.layerIds);
                            jQuery('#chkVisible').prop("checked", item.visible);
                            jQuery('#chkDisabled').prop("checked", item.disabled);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.searchOffices();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "label",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "layerType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "layerIds",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }
                        ];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            label: jQuery('#txtLabel').string(),
                            url: jQuery('#txtUrl').string(),
                            layerType: { id: jQuery('#ddlLayerType').int32() },
                            alpha: jQuery('#txtAlpha').string(),
                            layerIds: jQuery('#txtLayerIds').string(),
                            visible: jQuery('#chkVisible').boolean(),
                            disabled: jQuery('#chkDisabled').boolean(),
                            state: jQuery('#chkState').boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtLabel').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtLabel').focus();
                            }
                            if (jQuery('#txtUrl').string() === '') {
                                success = false;
                                message = 'Ingrese url.';
                                jQuery('#txtUrl').focus();
                            }
                            if (jQuery('#txtLayerIds').string === '') {
                                success = false;
                                message = 'Ingrese Ids.';
                                jQuery('#txtLayerIds').focus();
                            }
                            if (jQuery('#ddlLayerType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Tipo Capa.';
                                jQuery('#ddlLayerType').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        return {
                            label: jQuery('#txtLabelSearch').string(),
                            layerType: {
                                id: jQuery('#ddlLayerTypeSearch').int32(),
                            },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                layertable.Main = Main;
            })(geometry.layertable || (geometry.layertable = {}));
            var layertable = geometry.layertable;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geometry.layertable.Main.execute();