(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningrequest) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mr";
                        this.$btnSearchHolders = null;
                        this.$btnSaveHolders = null;
                        this.$btnGenerateForm = null;
                        this.$ddlServer = null;
                        this.formHolder = function () {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Agregar titulares",
                                width: '830',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "miningconcession/miningrequest/formholder", function () {
                                thiss.$btnSearchHolders = thiss.$divPopup.find('#btnSearchHolders');
                                thiss.$btnSaveHolders = thiss.$divPopup.find('#btnSaveHolders');
                                thiss.$btnSearchHolders.off("click");
                                thiss.$btnSearchHolders.on("click", function (e) {
                                    search();
                                });
                                thiss.$btnSaveHolders.off("click");
                                thiss.$btnSaveHolders.on("click", function (e) {
                                    thiss.saveHolders();
                                });
                                function search() {
                                    var data = {
                                        item: {
                                            name: jQuery('#txtNameSearchHolder').string(),
                                            holderType: {
                                                id: jQuery('#ddlHolderTypeSearchHolder').int32()
                                            },
                                            holderGroup: {
                                                id: jQuery('#ddlHolderGroupSearchHolder').int32()
                                            }
                                        },
                                        id: thiss.$hdnId.int32()
                                    };
                                    var itemsExist = [];
                                    jQuery('#tbdResultHolders input:checkbox').toArray().forEach(function (input) {
                                        itemsExist.push({
                                            id: jQuery(input).val(),
                                            legalRepresentative: { id: jQuery(input).closest('tr').attr('data-legalrepresentativeid') },
                                            power: { id: jQuery(input).closest('tr').attr('data-powerid') },
                                        });
                                    });
                                    thiss.searchConfig(com.jtm.Server.contextPath + 'society/holder/searchbyminingrequest', {
                                        data: data,
                                        isJson: false,
                                        async : false
                                    }, function (items) {
                                        thiss.fillHolders(items, "#tblResultHolders2", "#divTotalHolder2", itemsExist);
                                    });
                                }
                            });
                        };
                        this.saveHolders = function () {
                            var thiss = this;
                            var holders = [];
                            jQuery('#tbdResultHolders2 input:checkbox:checked').each(function () {
                                holders.push({
                                    id: jQuery(this).val(),
                                    percent: jQuery(this).closest('tr').find(".percent").val(),
                                    legalRepresentative: {
                                        id: jQuery(this).closest('tr').find(".legalrepresentative").val(),
                                        power: { id: jQuery(this).closest('tr').find(".power").val() }
                                    }
                                });
                            });
                            var item = { id: thiss.$hdnId.int32(), holders: holders };
                            var options = {
                                data: item,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/saveholders', options, function (response) {
                                if (response.success) { thiss.searchHolders(); jQuery('#divPopup').dialog('close'); }
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (holders.length === 0) {
                                    success = false;
                                    message = 'Seleccione al menos un titular.';
                                }
                                var total = 0;
                                holders.forEach(function (itemHolder) {
                                    if (itemHolder.percent === "0") {
                                        success = false;
                                        message = 'Debe ingresar porcentaje mayor a cero para el titular seleccionado.';
                                    }
                                    else if (itemHolder.legalRepresentative.id === null || itemHolder.legalRepresentative.id === 0 || itemHolder.legalRepresentative.id === "0") {
                                        success = false;
                                        message = 'Debe seleccionar un representante legal para su titular.';
                                    }
                                    else if (itemHolder.legalRepresentative.power.id === null || itemHolder.legalRepresentative.power.id === "0" || itemHolder.legalRepresentative.power.id === "---Seleccione---") {
                                        success = false;
                                        message = 'Debe seleccionar un poder para su representante legal.';
                                    }
                                    total += parseFloat(itemHolder.percent);
                                });
                                if (success === true && total !== 100) {
                                    success = false;
                                    message = 'El porcentaje total debe ser igual a 100%.';
                                }
                                if (message !== '')
                                    alert(message);
                                return success;
                            }
                        };
                        this.deleteHolders = function () {
                            var thiss = this;
                            var holderIds = com.jtm.helper.Table.getItems("#tbdResultHolders", true, false);
                            var options = {
                                data: { id: thiss.$hdnId.int32(), holderIds: holderIds },
                                isJson: false,
                                validate: validate
                            };
                            function validate() {
                                if (holderIds.length === 0) {
                                    alert('Seleccione al menos un titular.');
                                    return false;
                                } else
                                    return true;
                            }
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/deleteholders', options, function () { thiss.searchHolders(); });
                        };
                        this.searchHolders = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/searchholders', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                fillHolders(items, '#tblResultHolders', "#divTotalHolder");
                                function fillHolders(items, tbl, div) {
                                    var html = '';
                                    items.forEach(function (item, i) {
                                        html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-legalrepresentativeid="' + item.legalRepresentative.id + '"  data-powerid="' + item.legalRepresentative.power.id + '">';
                                        html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                        html += '<td>' + (i + 1) + '</td>';
                                        html += '<td>' + item.holderGroup.name + '</td>';
                                        html += '<td>' + item.name + '</td>';
                                        html += '<td>' + item.legalRepresentative.name + '</td>';
                                        html += '<td>' + item.legalRepresentative.power.publicRecord.place + '</td>';
                                        html += '<td>' + item.percent + '</td>';
                                        html += '</tr>';
                                    });
                                    jQuery(tbl + '>tbody').html(html);
                                    jQuery(div + '>span').html(jQuery(tbl + '>tbody>tr').length);
                                    com.jtm.helper.Table.highlightRow(tbl);
                                }
                            });
                        };
                        this.fillHolders = function (items, tbl, div, itemsExist) {
                            var thiss = this;
                            var html = '';
                            var inputPercent = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '" data-legalrepresentativeid="' + item.legalRepresentative.id + '"  data-powerid="' + item.legalRepresentative.power.id + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.holderGroup.name + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + ddlList(item.legalRepresentatives, "legalrepresentative") + '</td>';
                                html += '<td><select class="form-control power"></select></td>';
                                inputPercent = (item.percent > 0 ? ' value="' + item.percent + '"' : ' value="0" disabled="false"');
                                html += '<td><input type="text" maxlength="6" class="form-control text-right percent" id="txt' + item.id + '"' + inputPercent + '></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + '>span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                            jQuery(tbl + '>tbody>tr input:text').numeric({ negative: false, decimalPlaces: 2 });
                            jQuery("#tbdResultHolders2").off('change', '>tr> td .legalrepresentative');
                            jQuery("#tbdResultHolders2").on('change', '>tr> td .legalrepresentative', function (e) {
                                var $ddl = jQuery(this);
                                var $tr = jQuery(this).closest('tr');
                                var holderId = $tr.attr("data-uniqueid");
                                var legalRepresentativeId = $ddl.int32();
                                if (holderId === 0 || legalRepresentativeId === 0) return;
                                $tr.find('.power').attr("disabled", false);
                                thiss.searchConfig(com.jtm.Server.contextPath + 'society/power/searchpowers', {
                                    data: {
                                        legalRepresentativeId: legalRepresentativeId, holderId: holderId, isList: false
                                    },
                                    isJson: false
                                }, function (items) {
                                    var html = "";
                                    items.forEach(function (item) {
                                        html += '<option value="' + item.id + '" >' + item.publicRecord.place + '</option>';
                                    });
                                    $ddl.closest('tr').find('.power').html(html);
                                });
                            });
                            jQuery('#tbdResultHolders2').off('click', '>tr> td input:checkbox');
                            jQuery('#tbdResultHolders2').on('click', '>tr> td input:checkbox', function (e) {
                                if (jQuery(this).prop('checked')) {
                                    jQuery(this).closest('tr').find('.legalrepresentative').attr("disabled", false);
                                    jQuery(this).closest('tr').find('.power').attr("disabled", false);
                                    jQuery(this).closest('tr').find('input:text').attr("disabled", false);
                                } else {
                                    jQuery(this).closest('tr').find('.legalrepresentative').attr("disabled", true);
                                    jQuery(this).closest('tr').find('.power').attr("disabled", true);
                                    jQuery(this).closest('tr').find('input:text').attr("disabled", true);
                                }
                            });
                            jQuery('#tbdResultHolders2>tr> td .legalrepresentative').trigger("change");
                            jQuery('#tbdResultHolders2>tr> td .power').attr("disabled", true);
                            if (itemsExist.length > 0) {
                                itemsExist.forEach(function (item) {
                                    jQuery('#tbdResultHolders2>tr input:checkbox[value="' + item.id + '"]').attr("checked", true);
                                    jQuery('#tbdResultHolders2>tr[data-legalrepresentativeid="' + item.legalRepresentative.id + '"]').find('.legalrepresentative').val(item.legalRepresentative.id);
                                    jQuery('#tbdResultHolders2>tr[data-legalrepresentativeid="' + item.legalRepresentative.id + '"]').find('.power').val(item.power.id);
                                });
                            }
                            function ddlList(items, attr) {
                                var html = '';
                                html += '<select class="form-control ' + attr + '">';
                                items.forEach(function (item) {
                                    html += '<option value="' + item.id + '">' + item.name + '</option>';
                                });
                                html += '</select>';
                                return html;
                            }
                        };
                        this.downloadFile = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                alert(Main.NEWELEMENTID);
                                return;
                            }
                            var options = {
                                data: { id: thiss.$hdnId.int32() }
                            };
                            thiss.downloadConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/formdownload', ".zip", options);
                        };
                        this.searchReservedArea = function () {
                            var thiss = this;
                        };
                        this.searchMininingCadaster = function () {
                            var thiss = this;
                            var id = jQuery('#ddlServer').string();
                            var item = thiss.config.module.soaps.find2("id", id);
                            var options = {
                                data: {
                                    url: item.url,
                                    layerId: Number(item.layerId),
                                    id: thiss.$hdnId.int32()
                                },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/searchminingcadaster', options, function (items) {
                                thiss.fillMininingCadaster(items, '#tblResultMiningCadester', "#divTotalMiningCadester");
                            });
                        };
                        this.fillMininingCadaster = function (items, tbl, div) {
                            var thiss = this;
                            var html = '';
                            if (items === null || items === undefined) return;
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + '" data-index="' + i + '">';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.holder.name + '</td>';
                                html += '<td>' + (item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea) + '</td>';
                                html += '<td>' + (item.areaIntersected / Main.HECTARE).toFixed(thiss.config.number.decimalArea) + '</td>';
                                html += '<td>' + item.formulationDate + '</td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.path + "miningconcession/miningrequest/" + this.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "miningrequest", { module: "miningconcession", subModule: 'miningrequest' });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "miningconcession/miningrequest/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "miningconcession/miningrequest/savecoordinatesmultiple";
                        options.callback = function () {
                            //thiss.$btnSearchHolders = thiss.$main.find('#btnSearchHolders');
                            //thiss.$btnSaveHolders = thiss.$main.find('#btnSaveHolders');
                            thiss.$btnGenerateForm = thiss.$form.find('#btnGenerateForm');
                            thiss.$ddlServer = thiss.$form.find('#ddlServer');
                            com.jtm.helper.DropDownList.fillLocal({
                                ddl: thiss.$ddlServer,
                                items: thiss.config.module.soaps
                            });
                            thiss.datePicker('#txtExpirationDateDevolutionCertificate');
                            jQuery('#txtMountPayProcedure').numeric({ negative: false });
                            jQuery('#txtMountPayValidities').numeric({ negative: false });
                            jQuery('#txtMountDevolutionCertificate').numeric({ negative: false });
                            jQuery('#btnAddHolder').off("click");
                            jQuery('#btnAddHolder').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.formHolder();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#btnQuitHolders').off("click");
                            jQuery('#btnQuitHolders').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.deleteHolders();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            thiss.$btnGenerateForm.off("click");
                            thiss.$btnGenerateForm.on("click", function (e) {
                                thiss.downloadFile();
                            });

                            thiss.$ddlServer.off("change");
                            thiss.$ddlServer.on("change", function () {
                                thiss.searchMininingCadaster();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txaDescription').val(item.description);
                            jQuery('#txaObservation').val(item.observation);
                            jQuery('#ddlMineralType').val(item.mineralType.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            jQuery('#chkState').prop("checked", item.state);
                            jQuery('#chkIsRedenouncement').prop("checked", item.isRedenouncement);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                            jQuery('#txtMountPayProcedure').val((item.miningRequestPayProcedure === null) ? "" : item.miningRequestPayProcedure.mount);
                            jQuery('#txtReceiptNumberPayProcedure').val((item.miningRequestPayProcedure === null) ? "" : item.miningRequestPayProcedure.receiptNumber);
                            jQuery('#ddlFinancialEntityPayProcedure').val((item.miningRequestPayProcedure.financialEntity === null) ? 0 : item.miningRequestPayProcedure.financialEntity.id);
                            jQuery('#txtMountPayValidities').val((item.miningRequestPayValidities === null) ? "" : item.miningRequestPayValidities.mount);
                            jQuery('#txtReceiptNumberPayValidities').val((item.miningRequestPayValidities === null) ? "" : item.miningRequestPayValidities.receiptNumber);
                            jQuery('#ddlFinancialEntityPayValidities').val((item.miningRequestPayValidities === null || item.miningRequestPayValidities.financialEntity === null) ? 0 : item.miningRequestPayValidities.financialEntity.id);
                            jQuery('#txtMountDevolutionCertificate').val((item.miningRequestPayValidities === null) ? "" : item.miningRequestDevolutionCertificate.mount);
                            jQuery('#txtReceiptNumberDevolutionCertificate').val(item.miningRequestDevolutionCertificate.receiptNumber);
                            jQuery('#txtExpirationDateDevolutionCertificate').val(item.miningRequestDevolutionCertificate.expirationDate);
                            jQuery('#txtHolderDevolutionCertificate').val(item.miningRequestDevolutionCertificate.holder);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            jQuery('#ddlServer').val(item.spatialReference.id);
                            jQuery('#ddlServer').trigger('change');
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "miningconcession/miningrequest/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "miningconcession/miningrequest/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "miningconcession/miningrequest/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "miningconcession/miningrequest/searchtowncenters", item.id, null);
                            thiss.searchHolders();
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "isMiningConcessionText",
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
                            field: "mineralType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "spatialReference.id",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "area",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
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
                            name: jQuery('#txtName').string(),
                            description: jQuery('#txaDescription').string(),
                            observation: jQuery('#txaObservation').string(),
                            mineralType: {
                                id: jQuery('#ddlMineralType').int32()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReference').int32()
                            },
                            state: jQuery('#chkState').boolean(),
                            isRedenouncement: jQuery('#chkIsRedenouncement').boolean(),
                            miningRequestPayProcedure: {
                                mount: jQuery('#txtMountPayProcedure').double(),
                                receiptNumber: jQuery('#txtReceiptNumberPayProcedure').string(),
                                financialEntity: {
                                    id: jQuery("#ddlFinancialEntityPayProcedure").int32()
                                }
                            },
                            miningRequestPayValidities: {
                                mount: jQuery('#txtMountPayValidities').double(),
                                receiptNumber: jQuery('#txtReceiptNumberPayValidities').string(),
                                financialEntity: {
                                    id: jQuery("#ddlFinancialEntityPayValidities").int32()
                                }
                            },
                            miningRequestDevolutionCertificate: {
                                mount: jQuery('#txtMountDevolutionCertificate').double(),
                                receiptNumber: jQuery('#txtReceiptNumberDevolutionCertificate').string(),
                                expirationDate: jQuery('#txtExpirationDateDevolutionCertificate').date(),
                                holder: jQuery('#txtHolderDevolutionCertificate').string()
                            }
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese su Nombre.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#ddlMineralType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de mineral.';
                                jQuery('#ddlMineralType').focus();
                            }
                            //else if(jQuery('#ddlSpatialReference').int32() === 0) {
                            //    success = false;
                            //    message = 'Seleccione el Sistema Referencial.';
                            //    jQuery('#ddlSpatialReference').focus();
                            //}
                            //else if (jQuery('#txtMountPayProcedure').string() === '') {
                            //    success = false;
                            //    message = 'Ingrese el Monto por Derecho de Trámite.';
                            //    jQuery('#txtMountPayProcedure').focus();
                            //} else if (jQuery('#txtReceiptNumberPayProcedure').string() === '') {
                            //    success = false;
                            //    message = 'Ingrese el Nº de Recibo por Derecho de Trámite.';
                            //    jQuery('#txtReceiptNumberPayProcedure').focus();
                            //} else if (jQuery('#ddlFinancialEntityPayProcedure').int32() === 0) {
                            //    success = false;
                            //    message = 'Seleccione la Entidad Financiera por Derecho de Trámite .';
                            //    jQuery('#ddlFinancialEntityPayProcedure').focus();
                            //} else if (jQuery('#txtMountPayValidities').string() === '') {
                            //    success = false;
                            //    message = 'Ingrese el Monto por Derecho de Vigencia.';
                            //    jQuery('#txtMountPayValidities').focus();
                            //} else if (jQuery('#txtReceiptNumberPayValidities').string() === '') {
                            //    success = false;
                            //    message = 'Ingrese el Nº de Recibo por Derecho de Vigencia.';
                            //    jQuery('#txtReceiptNumberPayValidities').focus();
                            //} else if (jQuery('#ddlFinancialEntityPayValidities').int32() === 0) {
                            //    success = false;
                            //    message = 'Seleccione la Entidad Financiera por Derecho de Vigencia.';
                            //    jQuery('#ddlFinancialEntityPayValidities').focus();
                            //}
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
                miningrequest.Main = Main;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningrequest.Main.execute();