(function(com) {
    (function(jtm) {
        (function(miningconcession) {
            (function(miningcadaster) {
                var Main = (function(_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$toolbarDate = null;
                        this.$toolbarUbigeo = null;
                        this.$txtSearch = null;
                        this.$lblSelected = null;
                        this.$divResult = null;
                        this.$btnGroupSearch = null;
                        this.$btnCloseToolBarDate = null;
                        this.$btnCloseToolBarUbigeo = null;
                        this.$btnSearchByDate = null;
                        this.$btnShare = null;
                        this.$btnSummaryReport = null;
                        this.$btnPayReport = null;
                        this.$divToc = null;
                        this.generateReport = function(id) {
                            var thiss = this;
                            var fileName = id + "_" + thiss.getUUID();
                            var csv = thiss.contentCSV(id);
                            var kml = thiss.formViewer.contentKML('Polygon', [], 0, true, {
                                folderName: id
                            });
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(directory) {
                                directory.getFile(fileName + ".csv", { create: true }, function(fileEntry) {
                                    fileEntry.createWriter(function(fileWriter) {
                                        fileWriter.seek(fileWriter.length);
                                        fileWriter.write(csv);
                                        directory.getFile(fileName + ".kml", { create: true }, function(fileEntry2) {
                                            fileEntry2.createWriter(function(fileWriter2) {
                                                fileWriter2.seek(fileWriter2.length);
                                                fileWriter2.write(kml);
                                                var canvas = thiss.$main.find('canvas')[0];
                                                thiss.$form.hide();
                                                thiss.$main.show();
                                                canvas.toBlob(function(blob) {
                                                    var $img = $('<img />');
                                                    $img.addClass("img-responsive");
                                                    $img.css("z-index", 99999999);
                                                    var url = URL.createObjectURL(blob);
                                                    $img.on("load", function() {
                                                        URL.revokeObjectURL(url);
                                                    });
                                                    thiss.$main.find("canvas").closest("div").prepend($img);
                                                    $img.attr("src", url);
                                                    setTimeout(function() {
                                                        navigator.screenshot.save(function(error, response) {
                                                            $img.remove();
                                                            if (error) {
                                                                window.plugins.toast.showLongBottom(error);
                                                                thiss.$form.show();
                                                                thiss.$main.hide();
                                                            } else {
                                                                response.filePath = 'file://' + response.filePath;
                                                                window.plugins.socialsharing.shareViaEmail('Envío los datos de la concesión minera ' + id,
                                                                    'Datos de concesión minera ' + id,
                                                                    null, null, null, [fileEntry.toURL(), fileEntry2.toURL(), response.filePath],
                                                                    function(success) {
                                                                        window.resolveLocalFileSystemURL(fileEntry.toURL(), function(fe) {
                                                                            fe.remove(null, null);
                                                                        });
                                                                        window.resolveLocalFileSystemURL(fileEntry2.toURL(), function(fe) {
                                                                            fe.remove(null, null);
                                                                        });
                                                                        //window.resolveLocalFileSystemURL(response.filePath, function (fe) {
                                                                        //    fe.remove(null, null);
                                                                        //});
                                                                        setTimeout(function() {
                                                                            thiss.$form.show();
                                                                            thiss.$main.hide();
                                                                        }, 1000);
                                                                    },
                                                                    function(error) { }
                                                                );
                                                            }
                                                        }, 'png', 100, fileName);
                                                    }, 1000);
                                                });
                                            }, fail);
                                        });
                                    }, fail);
                                });
                            });
                            function fail(error) {
                                window.plugins.toast.showLongBottom(error);
                            }
                        };
                        this.contentCSV = function(id) {
                            var thiss = this;
                            var csv = 'Detalle de concesión minera ' + id + '\r\n' + '\r\n';
                            var $divs = thiss.$form.find(".form-group");
                            $divs.toArray().forEach(function(div) {
                                csv += jQuery(div).find('label').text() + "," + jQuery(div).find("p").text() + '\r\n';
                            });
                            csv += '\r\n';
                            var $tables = thiss.$form.find("table");
                            $tables.toArray().forEach(function(table) {
                                csv += jQuery(table).find("caption").text() + '\r\n';
                                jQuery(table).find(">thead>tr>th").toArray().forEach(function(th) {
                                    csv += jQuery(th).text() + ",";
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n';
                                jQuery(table).find(">tbody>tr").toArray().forEach(function(tr) {
                                    jQuery(tr).find(">td").toArray().forEach(function(td) {
                                        csv += jQuery(td).text() + ",";
                                    });
                                    csv += '\r\n';
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n' + '\r\n';
                            });
                            return csv;
                        };
                        this.setServicesToc = function() {
                            var thiss = this;
                            var services = thiss.config.module.servicesToc;
                            jQuery.ajaxSetup({ async: false });
                            for (var i = 0; i < services.length; i++) {
                                jQuery.getJSON(services[i].url + "?f=json&rnd=" + Math.random()).done(function(data, textStatus, jqXHR) {
                                    if (data.error !== undefined || jqXHR.status != 200) { services[i].disabled = true; return; }
                                    services[i].layers = [];
                                    data.layers.forEach(function(layer) {
                                        var layer2 = services[i].layerIds.find(function(layerId) {
                                            return layer.id == layerId;
                                        });
                                        if (layer2 !== undefined && layer2 !== null)
                                            services[i].layers.push({ id: layer.id, name: layer.name, UUID: 'toc_' + thiss.getUUID() });
                                    });
                                    delete services[i].layerIds;
                                });
                            }
                            jQuery.ajaxSetup({ async: true });
                        };
                    }
                    Main.prototype.initConfig = function() {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        this.setServicesToc();
                    };
                    Main.prototype.domConfig = function() {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$main = this.$main.find('>.panel');
                        this.$toolbar = this.$main.find('>.panel-heading>div:first');
                        this.$toolbarDate = this.$main.find('>.panel-heading>div:eq(1)');
                        this.$toolbarUbigeo = this.$main.find('>.panel-heading>div:last');
                        this.$txtSearch = thiss.$toolbar.find('#txtSearch');
                        this.$txtStartDate = this.$toolbarDate.find('#txtStartDate');
                        this.$txtEndDate = this.$toolbarDate.find('#txtEndDate');
                        this.$lblSelected = this.$toolbar.find('#lblSelected');
                        this.$btnGroupSearch = this.$toolbar.find('#btnGroupSearch');
                        this.$btnSearch = this.$toolbar.find('#btnSearch');
                        this.$btnClean = this.$toolbar.find('#btnClean');
                        this.$btnCloseToolBarDate = this.$toolbarDate.find('#btnCloseToolBarDate');
                        this.$btnCloseToolBarUbigeo = this.$toolbarUbigeo.find('#btnCloseToolBarUbigeo');
                        this.$btnSearchByDate = this.$toolbarDate.find('#btnSearchByDate');
                        this.$btnShare = this.$main.find('#btnShare');
                        this.$divResult = this.$main.find('#divResult');
                        this.$ddlDepartment = this.$main.find('#ddlDepartment');
                        this.$ddlProvince = this.$main.find('#ddlProvince');
                        this.$ddlDistrict = this.$main.find('#ddlDistrict');
                        this.$divToc = this.$main.find('#divToc');
                    };
                    Main.prototype.viewConfig = function() {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(this.$txtStartDate);
                        thiss.datePicker(this.$txtEndDate);
                        thiss.$toolbar.find('>div>div>ul.dropdown-menu li:not(.disabled)>a').off("click");
                        thiss.$toolbar.find('>div>div>ul.dropdown-menu li:not(.disabled)>a').on("click", function() {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$btnGroupSearch.removeClass("hidden");
                            thiss.$toolbarDate.removeClass("hidden");
                            thiss.$toolbarUbigeo.removeClass("hidden");
                            $(this).closest(".input-group-btn").find(".btn>span:first").text($(this).text());
                            $(this).closest(".input-group-btn").find(".btn>span:first").attr("data-field", $(this).closest("li").attr("id"));
                            if ($(this).closest("li").attr("id") == "GEOMETRY") {
                                thiss.$txtSearch.hide();
                                thiss.$btnSearch.hide();
                                thiss.$btnGroupSearch.show();
                                thiss.$toolbarDate.hide();
                                thiss.$toolbarUbigeo.hide();
                            } else if ($(this).closest("li").attr("id") == "FEC_DENU") {
                                thiss.$btnGroupSearch.hide();
                                thiss.$toolbar.hide();
                                thiss.$toolbarDate.show();
                                thiss.$toolbarUbigeo.hide();
                                thiss.$txtStartDate.val(new Date(Date.now() - 86400000 + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                                thiss.$txtEndDate.val(new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                            } else if ($(this).closest("li").attr("id") == "UBIGEO") {
                                thiss.$btnGroupSearch.hide();
                                thiss.$toolbar.hide();
                                thiss.$toolbarDate.hide();
                                thiss.$toolbarUbigeo.show();
                                thiss.$ddlDepartment.val(0);
                                thiss.$ddlProvince.empty();
                                thiss.$ddlDistrict.empty();
                            } else {
                                thiss.$toolbar.show();
                                thiss.$txtSearch.show();
                                thiss.$btnGroupSearch.hide();
                                thiss.$toolbarDate.hide();
                                thiss.$toolbarUbigeo.hide();
                                thiss.$btnSearch.show();
                            }
                        });
                        
                    };
                    Main.prototype.buttonConfig = function(options) {
                        var thiss = this;
                        var where = null;
                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (String.isNullOrWhiteSpace(thiss.$lblSelected.attr("data-field")) !== true && thiss.$lblSelected.attr("data-field") !== "" && String.isNullOrWhiteSpace(thiss.$txtSearch.val()) !== true && thiss.$txtSearch.val() !== "") {
                                where = "UPPER(" + thiss.$lblSelected.attr("data-field") + ")" + " LIKE '%" + thiss.$txtSearch.val().trim().toUpperCase() + "%'";
                                thiss.viewer.search({ where: where });
                            }
                            else {
                                window.plugins.toast.showLongBottom("Ingrese un texto");
                            }
                        });
                        thiss.$btnSearchByDate.off("click");
                        thiss.$btnSearchByDate.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (String.isNullOrWhiteSpace(thiss.$txtStartDate.val()) !== true && String.isNullOrWhiteSpace(thiss.$txtEndDate.val()) !== true) {
                                if (thiss.$txtStartDate.date() > thiss.$txtEndDate.date()) {
                                    window.plugins.toast.showLongBottom("La fecha de inicio no puede ser mayor que la fecha final");
                                } else {
                                    where = "FEC_DENU>=date '" + thiss.$txtStartDate.val() + "' AND FEC_DENU<=date '" + thiss.$txtEndDate.val() + "'";
                                    thiss.viewer.search({ where: where });
                                }
                            }
                            else {
                                window.plugins.toast.showLongBottom("Ingrese las fechas correctamente");
                            }
                        });
                        thiss.$btnCloseToolBarDate.off("click");
                        thiss.$btnCloseToolBarDate.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$toolbarDate.hide();
                            thiss.$toolbarUbigeo.hide();
                            thiss.$toolbar.show();
                            thiss.$toolbar.find('>div>div>button>span:first').text('Nombre').attr("data-field", 'CONCESION');
                        });
                        thiss.$btnCloseToolBarUbigeo.off("click");
                        thiss.$btnCloseToolBarUbigeo.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$toolbarDate.hide();
                            thiss.$toolbarUbigeo.hide();
                            thiss.$toolbar.show();
                            thiss.$toolbar.find('>div>div>button>span:first').text('Nombre').attr("data-field", 'CONCESION');
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });

                        thiss.$btnShare.off("click");
                        thiss.$btnShare.on("click", function(e) {
                        });
                        //document.removeEventListener("searchbutton");

                    };
                    Main.prototype.uiConfig = function() {
                        var thiss = this;
                        var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                        var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                        thiss.viewer.load(this.$main, { heightMap: height });
                        thiss.viewer.callbackForm = function(id) {
                            thiss.form(id);
                        };                        
                    };
                    Main.prototype.form = function(id) {
                        var thiss = this;
                        Main.initialize = false;
                        thiss.loadView(thiss.$form, com.jtm.Server.contextPath + "areas/miningconcession/miningcadaster/_form.html", function() {
                            thiss.$main.hide();
                            thiss.$form.show();
                            thiss.$hdnId = thiss.$form.find(Main.HDNID);
                            thiss.$btnClose = thiss.$form.find('#btnClose');
                            thiss.$btnShare = thiss.$form.find('#btnShare');
                            thiss.$btnSummaryReport = thiss.$form.find('#btnSummaryReport');
                            thiss.$btnPayReport = thiss.$form.find('#btnPayReport');
                            var heightHeader = thiss.$form.find('>.panel>.panel-heading').outerHeight(true) || 0;
                            var heightFooter = thiss.$form.find('>.panel>.panel-footer').outerHeight(true) || 0;
                            thiss.$form.find('.panel>.panel-body').css("overflow", "auto");
                            thiss.$form.find('.panel>.panel-body').css("height", thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter));
                            thiss.formViewer.load(thiss.$form.find('.panel>.panel-body'));
                            thiss.$btnClose.off("click");
                            thiss.$btnClose.on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.$form.empty().hide();
                                thiss.$main.show();
                            });
                            thiss.detail(id);
                            thiss.$btnSummaryReport.off("click");
                            thiss.$btnSummaryReport.on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                window.open('https://docs.google.com/viewer?url=' + thiss.config.module.ingemmet.urls.summary.replace("{0}", id), "_blank", "location=0");
                            });
                            thiss.$btnPayReport.off("click");
                            thiss.$btnPayReport.on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                window.open('https://docs.google.com/viewer?url=' + thiss.config.module.ingemmet.urls.pay.replace("{0}", id), "_blank", "location=no,toolbar=no,hardwareback=yes");
                            });
                            thiss.$btnShare.off("click");
                            thiss.$btnShare.on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.generateReport(id);
                            });
                        });
                    };
                    Main.prototype.detail = function(id) {
                        var thiss = this;
                        var zone = thiss.viewer.getZoneFromLayer(id);
                        var url = thiss.config.module.service.url + "/" + thiss.config.module.service.layerId;
                        if (zone > 0)
                            url = thiss.config.module.servicesByZone[zone].url + "/" + thiss.config.module.servicesByZone[zone].layerId;
                        thiss.ajax({
                            method: "POST",
                            url: url + "/query",
                            data: {
                                f: "json",
                                where: thiss.config.module.service.joinField + "='" + id + "'",
                                outFields: "*"
                            },
                            isJson: false,
                            validate: function() { return true; }
                        }, function(data) {
                            if (data.features[0] === undefined) return;
                            data.format = Main.FORMAT.ESRIJSON;
                            var geometryESRI = {
                                spatialReference: data.spatialReference,
                                geometry: data.features[0].geometry,
                                geometryType: data.geometryType
                            };
                            jQuery('#detailTitle p.form-control-static').text(data.features[0].attributes.CONCESION + ' (' + data.features[0].attributes.CODIGOU + ')');
                            thiss.$hdnId.val(data.features[0].attributes.CODIGOU);
                            jQuery('#pCode').text(data.features[0].attributes.CODIGOU);
                            jQuery('#pName').text(data.features[0].attributes.CONCESION);
                            jQuery('#pZone').text(data.features[0].attributes.ZONA + "S");
                            jQuery('#pHolderName').text(data.features[0].attributes.TIT_CONCES);
                            jQuery('#pStateName').text(data.features[0].attributes.D_ESTADO);
                            jQuery('#pArea').text(data.features[0].attributes.HECTAGIS);
                            jQuery('#pDateFormulation').text(new Date(data.features[0].attributes.FEC_DENU + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                            thiss.formViewer.setZone(zone);
                            thiss.formViewer.fillCoordinates(data.features[0].geometry.rings);
                            thiss.formViewer.searchDistricts(geometryESRI);
                            thiss.formViewer.searchNationalCartographies(geometryESRI);
                            thiss.searchPaysOfficial(id, { tbl: '#tblResultPayValidities', tblDetail: '#tblResultPayValidityDetails' }, "dol", { resource: "grid_vigencia" });
                            thiss.searchPaysOfficial(id, { tbl: '#tblResultPayPenalities', tblDetail: '#tblResultPayPenalityDetails' }, "pen", { resource: "grid_penalidad" });
                            thiss.searchResolutionsOfficial(id);
                            thiss.searchNotebooksOfficial(id);
                        });
                    };
                    Main.prototype.setModule = function(jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.path + "miningconcession/miningcadaster/" + this.apigeo + "mainmap2";
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.load = function() {
                        _super.prototype.load.call(this, "miningcadaster2", { module: "miningconcession", subModule: 'miningcadaster' });
                    };
                    Main.prototype.cleanControls = function() {
                        this.viewer.cleanControls(false);
                    };
                    Main.execute = function() {
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