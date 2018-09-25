(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningcadaster) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.getElementUnique2 = function (tbl, attribute) {
                            tbl = tbl || Main.TBLRESULT;
                            attribute = attribute || "data-uniqueid";
                            tbl = (typeof tbl === "string") ? jQuery(tbl) : tbl;
                            var row = tbl.find('>tbody>tr.selected')[0];
                            if (row === undefined) return 0;
                            var id = $(row).attr(attribute);
                            return id === undefined || id === null ? 0 : id;
                        };
                        this.formDetailReport = function (url, id, code) {
                            var thiss = this;
                            thiss.loadView(thiss.$form, url, function () {
                                thiss.$main.hide();
                                thiss.$form.show();
                                thiss.buildClose();
                                jQuery('#dataReport').append('<div><iframe width="100%" height="700px" src="' + getUrl() + '"></iframe></div>');
                                function getUrl() {
                                    var url = thiss.config.module.ingemmet.urls.summary;
                                    return (url.replace("{0}", code));
                                }
                            });
                        };                        
                        this.searchDistricts = function (url, data, options) {
                            var thiss = this;
                            thiss.searchConfig(url, {
                                data: {
                                    layerId: data.layerId,
                                    url: data.url,
                                    code: data.code
                                }, isJson: false
                            }, function (items) {
                                options = options || {};
                                options.tbl = (options.tbl === undefined || options.tbl === null || options.tbl === "") ? "#tblResultDistricts" : options.tbl;
                                options.div = (options.div === undefined || options.div === null || options.div === "") ? "#divTotalDistrict" : options.div;
                                fill(items, options.tbl, options.div);
                            });
                            function fill(items, tbl, div) {
                                var html = '';
                                jQuery.each(items, function (i, item) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + ' (' + item.id + ')</td>';
                                    html += '<td>' + item.province.name + '</td>';
                                    html += '<td>' + item.province.department.name + '</td>';
                                    html += '</tr>';
                                });
                                jQuery(tbl + " > tbody").html(html);
                                jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                            }
                        };
                        this.searchNationalCartographies = function (url, data, options) {
                            var thiss = this;
                            thiss.searchConfig(url, {
                                data: {
                                    layerId: data.layerId,
                                    url: data.url,
                                    code: data.code
                                }, isJson: false
                            }, function (items) {
                                options = options || {};
                                options.tbl = (options.tbl === undefined || options.tbl === null || options.tbl === "") ? "#tblResultNationalCartographies" : options.tbl;
                                options.div = (options.div === undefined || options.div === null || options.div === "") ? "#divTotalNationalCartography" : options.div;
                                fill(items, options.tbl, options.div);
                            });
                            function fill(items, tbl, div) {
                                var html = '';
                                jQuery.each(items, function (i, item) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.id + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '</tr>';
                                });
                                jQuery(tbl + " > tbody").html(html);
                                jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                            }
                        };
                        this.searchTownCenters = function (url, data, options) {
                            var thiss = this;
                            thiss.searchConfig(url, {
                                data: {
                                    layerId: data.layerId,
                                    url: data.url,
                                    code: data.code
                                }, isJson: false
                            }, function (items) {
                                options = options || {};
                                options.tbl = (options.tbl === undefined || options.tbl === null || options.tbl === "") ? "#tblResultTownCenters" : options.tbl;
                                options.div = (options.div === undefined || options.div === null || options.div === "") ? "#divTotalTownCenter" : options.div;
                                fill(items, options.tbl, options.div);
                            });
                            function fill(items, tbl, div) {
                                var html = '';
                                jQuery.each(items, function (i, item) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.id + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '</tr>';
                                });
                                jQuery(tbl + " > tbody").html(html);
                                jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                            }
                        };
                        this.searchHydrographicBasins = function (url, data, options) {
                            var thiss = this;
                            thiss.searchConfig(url, {
                                data: {
                                    layerId: data.layerId,
                                    url: data.url,
                                    code: data.code
                                }, isJson: false
                            }, function (items) {
                                options = options || {};
                                options.tbl = (options.tbl === undefined || options.tbl === null || options.tbl === "") ? "#tblResultHydrographicBasins" : options.tbl;
                                options.div = (options.div === undefined || options.div === null || options.div === "") ? "#divTotalHydrographicBasin" : options.div;
                                fill(items, options.tbl, options.div);
                            });
                            function fill(items, tbl, div) {
                                var html = '';
                                jQuery.each(items, function (i, item) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '</tr>';
                                });
                                jQuery(tbl + " > tbody").html(html);
                                jQuery(div + ' > span').html(jQuery(tbl + " > tbody" + '> tr').length);
                            }
                        };

                        this.fillCoordinates = function (items) {
                            var thiss = this;
                            if (items === undefined || items === null || !(items instanceof Array)) return;
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                items[i].vertex = i;
                                html += '<tr id="' + i + '">';
                                html += '<td class="text-right">' + (items[i].vertex + 1) + '</td>';
                                html += '<td class="text-right tdX" style="vnd.ms-excel.numberformat:0.00">' + Number(item.x).toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '<td class="text-right tdY" style="vnd.ms-excel.numberformat:0.00">' + Number(item.y).toFixed(thiss.config.number.decimalCount) + '</td>';
                                html += '</tr>';
                            });
                            jQuery('#tblResultCoordinates>tbody').html(html);
                            jQuery('#divTotalCoordinates>span').html(jQuery('#tblResultCoordinates>tbody>tr').length);
                        };
                    }                             
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.datePicker("#txtFormulationDateSearch");
                        thiss.datePicker("#txtFormulationDateEndSearch");
                        thiss.datePicker("#txtTitleRegistrationDate");
                        thiss.fillPoliticalDivision("#ddlDepartmentSearch", "#ddlProvinceSearch", "#ddlDistrictSearch");
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnDetailReport').off("click");
                        jQuery('#btnDetailReport').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0) {
                                thiss.formDetailReport(com.jtm.Server.contextPath + "miningconcession/miningcadaster/formreport", id, code);
                            } else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnRecord').off("click");
                        jQuery('#btnRecord').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0) {
                                thiss.formRecord(com.jtm.Server.contextPath + "miningconcession/miningcadaster/formrecord", id, { code: code, online: true });
                            } else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnResolution').off("click");
                        jQuery('#btnResolution').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0) {
                                thiss.formResolution(com.jtm.Server.contextPath + "miningconcession/miningcadaster/formresolutionofficial", id, { code: code });
                            } else
                                alert("Por favor seleccione un elemento");
                        });
                        jQuery('#btnPay').off("click");
                        jQuery('#btnPay').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var id = thiss.getElementID();
                            var code = thiss.getElementUnique(null, "data-uniquecode");
                            if (code !== 0) {
                                thiss.formPayOfficial(com.jtm.Server.contextPath + "miningconcession/miningcadaster/formpayofficial", id, { code: code });
                            } else
                                alert("Por favor seleccione un elemento");
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        var zone = thiss.getElementUnique2(null, "data-zone");
                        var service = thiss.config.module.soaps.find2("zone", zone);
                        var code = thiss.getElementUnique(null, "data-uniquecode");
                        var itemService = {
                            url: service.url,
                            layerId: Number(service.layerId),
                            code : code
                        };
                        options = {
                            data: itemService,
                            isJson: false,
                            validate: function () { return true; }
                        };
                        this.detailConfig(com.jtm.Server.contextPath + "miningconcession/miningcadaster/detailsoap2", options, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtSituationName').val(item.legend);
                            jQuery('#txtFormulationArea').val((item.formulationArea).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtAdmissionDate').val(item.admissionDate);
                            jQuery('#txtHolderName').val(item.holder.name);
                            jQuery('#txtIncorporationDate').val(item.incorporationDate);
                            jQuery('#txtFormulationDate').val(item.formulationDate);
                            jQuery('#txtTitleRegistrationDate').val(item.resolutionTitle.date);
                            jQuery('#txtTitleResolution').val(item.resolutionTitle.number);
                            jQuery('#txtTitleDecision').val(item.resolutionTitle.decision);
                            jQuery('#txtMineralTypeName').val(item.mineralType.name);
                            jQuery('#txtStateManagementName').val(item.stateManagement.name);
                            jQuery('#txtGeographicalSpace').val(item.geographicalSpace);
                            jQuery('#txtNationalCartographyId').val(item.nationalCartography.id);
                            jQuery('#txtRecordLocation').val(item.record.location);
                            jQuery('#txtStateOfficial').val(item.stateOfficial);
                            jQuery('#ddlSpatialReference').val(item.spatialReference === null ? thiss.config.module.defaultsoap : item.spatialReference.id);
                            jQuery('#txtArea').val((item.area / Main.HECTARE).toFixed(thiss.config.number.decimalArea));
                            jQuery('#txtLength').val((item.length / Main.KILOMETER).toFixed(thiss.config.number.decimalLength));
                            thiss.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.searchDistricts(com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchdistrictssoap2", itemService, null);
                            thiss.searchHydrographicBasins(com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchhydrographicbasinssoap2", itemService, null);
                            thiss.searchNationalCartographies(com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchnationalcartographiessoap2", itemService, null);
                            thiss.searchTownCenters(com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchtowncenterssoap2", itemService, null);
                        });
                    };
                    Main.prototype.parameters = function () {
                        return {
                            name: jQuery('#txtNameSearch').string(),
                            code: jQuery('#txtCodeSearch').string(),
                            formulationDate: jQuery('#txtFormulationDateSearch').date() === null ? undefined : jQuery('#txtFormulationDateSearch').val(),
                            formulationDateEnd: jQuery('#txtFormulationDateEndSearch').date() === null ? undefined : jQuery('#txtFormulationDateEndSearch').val(),
                            holder: {
                                name: jQuery('#ddlHolderSearch').int32() === 0 ? "" : jQuery('#ddlHolderSearch option:selected').text(),
                                nameOther: jQuery('#txtHolderNameOtherSearch').string()
                            }
                        };
                    };
                    Main.prototype.search = function () {
                        var thiss = this;
                        var id = thiss.config.module.defaultsoap;
                        var item = thiss.config.module.soaps.find2("id", id);
                        var extraData = {
                            url: item.url,
                            layerId: Number(item.layerId),
                        };
                        var url = com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchsoap";
                        var options = {
                            extraData: extraData
                        };
                        options.columns = [{
                            field: 'code',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: 'name',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: 'holder.name',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'formulationArea',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'formulationDate',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'stateManagement.name',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }, {
                            field: 'geographicalSpace',
                            sortable: false,
                            visible: true,
                            searchable: false,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, function (data) {
                            data.items.forEach(function (item) {
                                thiss.$table.find('>tbody>tr[data-uniqueid="' + item.id + '"]').attr("data-zone", item.geographicalSpace);
                            });
                        });
                    };
                    Main.prototype.searchDownload = function (url, format, options) {
                        var thiss = this;
                        options = options || {};
                        url = url || com.jtm.Server.contextPath + "miningconcession/miningcadaster/searchsoapdownload";
                        var id = thiss.config.module.defaultsoap;
                        var item = thiss.config.module.soaps.find2("id", id);
                        options = {
                            data: {
                                url: item.url,
                                layerId: Number(item.layerId),
                                item: JSON.stringify(thiss.parameters())
                            }
                        };
                        _super.prototype.searchDownload.call(this, url, format, options);
                    };
                    Main.prototype.formDownload = function (url, format, options) {
                        var thiss = this;
                        options = options || {};
                        url = url || com.jtm.Server.contextPath + "miningconcession/miningcadaster/detailsoapdownload";
                        var id = jQuery('#ddlSpatialReference').string();
                        var item = thiss.config.module.soaps.find2("id", id);
                        options = {
                            data: {
                                url: item.url,
                                layerId: Number(item.layerId),
                                id: thiss.$hdnId.int32()
                            }
                        };
                        _super.prototype.formDownload.call(this, url, format, options);
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.miningconcession.BaseMain);
                miningcadaster.Main = Main;
            })(miningconcession.miningcadaster || (miningconcession.miningcadaster = {}));
            var miningcadaster = miningconcession.miningcadaster;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningcadaster.Main.execute();