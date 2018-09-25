(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (importingemment) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$tbdResultMiningCadasters = null;
                        this.$ddlServerSearch = null;
                        this.$btnSearchMiningCadaster = null;
                        this.$btnSaveFromMiningCadaster = null;
                        this.$btnCleanMiningCadaster = null;
                        this.$txtNameMiningCadasterSearch = null;
                        this.$txtCodeMiningCadasterSearch = null;
                        this.$txtHolderNameMiningCadasterSearch = null;
                        this.searchMiningRequest = function () {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningrequest/searchforminingconcession', { data: { name: jQuery('#txtNameMiningRequestSearch').string() }, isJson: false }, function (items) {
                                thiss.fillMiningRequest(items, '#tblResultMiningRequests', "#divTotalMiningRequest");
                                thiss.datePicker('.formulationdate');
                            });
                        };
                        this.fillMiningRequest = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td><input type="text" maxlength="11" class="form-control code" id="txt' + item.id + '"></td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td><input type="text" class="form-control formulationdate" id="txt' + item.id + '"></td>';
                                html += '</tr>';
                            });
                            jQuery(tbl + '>tbody').html(html);
                            jQuery(div + ' > span').html(jQuery(tbl + '>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.searchMiningCadaster = function () {
                            var thiss = this;
                            var id = thiss.$ddlServerSearch.string();
                            var services = thiss.config.module.soaps.find2("id", id);
                            var item = {
                                name: thiss.$txtNameMiningCadasterSearch.val(),
                                code: thiss.$txtCodeMiningCadasterSearch.val(),
                                holder: {
                                    name: thiss.$txtHolderNameMiningCadasterSearch.val()
                                }
                            };
                            var options = {
                                data: {
                                    url: services.url,
                                    layerId: Number(services.layerId),
                                    item: JSON.stringify(item)
                                },
                                isJson: false
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningcadaster/searchsoap', options, function (items) {
                                thiss.fillMiningCadaster(items, thiss.$tblResultMiningCadasters, thiss.$divTotalMiningCadaster);
                            });
                        };
                        this.fillMiningCadaster = function (items, tbl, div) {
                            var html = '';
                            jQuery.each(items, function (i, item) {
                                html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                html += '<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '" /></td>';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + item.code + '</td>';
                                html += '<td>' + item.name + '</td>';
                                html += '<td>' + item.formulationDate + '</td>';
                                html += '</tr>';
                            });
                            $(tbl).find('>tbody').html(html);
                            $(div).find('>span').html($(tbl).find('>tbody>tr').length);
                            com.jtm.helper.Table.highlightRow(tbl);
                        };
                        this.saveFromMiningCadaster = function () {
                            var thiss = this;
                            var ids = com.jtm.helper.Table.getItems(thiss.$tbdResultMiningCadasters, true, false);
                            var id = thiss.$ddlServerSearch.string();
                            var service = thiss.config.module.soaps.find2("id", id);
                            var item = {
                                url: service.url,
                                layerId: Number(service.layerId),
                                ids: ids
                            };
                            var options = {
                                data: item,
                                isJson: false,
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/savefromminingcadaster', options, function (response) {
                                if (response.success) {
                                    thiss.searchMiningRequest();
                                }
                            });
                            function validate() {
                                if (ids.length === 0) {
                                    alert('Seleccione al menos una Concesión.');
                                    return false;
                                }
                                else
                                    return true;
                            }
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        this.$divTotalMiningCadaster = thiss.$main.find('#divTotalMiningCadaster');
                        this.$tblResultMiningCadasters = thiss.$main.find('#tblResultMiningCadasters');
                        this.$tbdResultMiningCadasters = thiss.$main.find('#tbdResultMiningCadasters');
                        this.$ddlServerSearch = thiss.$main.find('#ddlServerSearch');
                        this.$btnSearchMiningCadaster = thiss.$main.find('#btnSearchMiningCadaster');
                        this.$btnSaveFromMiningCadaster = thiss.$main.find('#btnSaveFromMiningCadaster');
                        this.$btnCleanMiningCadaster = thiss.$main.find('#btnCleanMiningCadaster');
                        this.$txtNameMiningCadasterSearch = thiss.$main.find('#txtNameMiningCadasterSearch');
                        this.$txtCodeMiningCadasterSearch = thiss.$main.find('#txtCodeMiningCadasterSearch');
                        this.$txtHolderNameMiningCadasterSearch = thiss.$main.find('#txtHolderNameMiningCadasterSearch');
                        com.jtm.helper.DropDownList.fillLocal({
                            ddl: '#ddlServerSearch',
                            items: thiss.config.module.soaps
                        });
                        thiss.$ddlServerSearch.val(thiss.config.module.defaultsoap);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        thiss.$btnSearchMiningCadaster.off("click");
                        thiss.$btnSearchMiningCadaster.on("click", function (e) {
                            thiss.searchMiningCadaster();
                        });
                        thiss.$btnSaveFromMiningCadaster.off("click");
                        thiss.$btnSaveFromMiningCadaster.on("click", function (e) {
                            thiss.saveFromMiningCadaster();
                        });
                        thiss.$btnCleanMiningCadaster.off("click");
                        thiss.$btnCleanMiningCadaster.on("click", function (e) {
                            thiss.$txtNameMiningCadasterSearch.val('');
                            thiss.$txtCodeMiningCadasterSearch.val('');
                            thiss.$txtHolderNameMiningCadasterSearch.val('');
                            thiss.$ddlServerSearch.val(thiss.config.module.defaultsoap);
                            thiss.$tbdResultMiningCadasters.empty();
                        });
                    };
                    Main.prototype.load = function (jsonFile, options) {
                        options = options || {};
                        options.module = options.module || "miningconcession";
                        options.subModule = options.subModule || "importingemment";
                        jsonFile = jsonFile || Main.JSONBASE + options.module + "/baseminingconcession";
                        _super.prototype.load.call(this, jsonFile, options);
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };

                    return Main;
                })(jtm.Master);
                importingemment.Main = Main;
            })(miningconcession.importingemment || (miningconcession.importingemment = {}));
            var miningconcession = miningconcession.importingemment;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.importingemment.Main.execute();