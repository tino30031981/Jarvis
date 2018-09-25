(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningcadaster) {
                var Record = (function (_super) {
                    __extends(Record, _super);
                    function Record() {
                        _super.call(this);
                        this.$btnGroupSearch = null;
                        this.$btnFormDownload = null;
                        this.$btnCloseToolBarDate = null;
                        this.$btnSearchByDate = null;
                        this.$btnResult = null;
                        this.$btnShare = null;
                        this.$ddlPage = null;
                        this.$ddlStartPage = null;
                        this.$ddlEndPage = null;
                        this.$img = null;
                        this.$divDownload = null;
                        this.$divResult = null;
                        this.$lblSelected = null;
                        this.$toolbarDate = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                        this.formDownload = function () {
                            var thiss = this;
                            thiss.loadView(thiss.$divDownload, com.jtm.Server.contextPath + "areas/miningconcession/miningcadaster/_recorddownload.html", function () {
                                thiss.$btnDownload = thiss.$main.find('#btnDownload');
                                thiss.$btnShare = thiss.$main.find('#btnShare');
                                thiss.$btnClose = thiss.$main.find('#btnClose');
                                thiss.$ddlStartPage = thiss.$main.find('#ddlStartPage');
                                thiss.$ddlEndPage = thiss.$main.find('#ddlEndPage');
                                thiss.$ddlStartPage.html(thiss.$ddlPage.html());
                                thiss.$ddlEndPage.html(thiss.$ddlPage.html());
                                thiss.$ddlStartPage.val(1);
                                thiss.$ddlEndPage.val(thiss.$ddlPage.find('option').length);
                                thiss.$divDownload.addClass("show");
                                thiss.$btnDownload.off("click");
                                thiss.$btnDownload.on("click", function (e) {
                                    thiss.downloadRangeRecord();
                                });
                                thiss.$btnShare.off("click");
                                thiss.$btnShare.on("click", function (e) {
                                    thiss.sendMail();
                                });
                                thiss.$btnClose.off("click");
                                thiss.$btnClose.on("click", function (e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.$divDownload.empty();
                                    thiss.$divDownload.hide();
                                });
                            });
                        };
                        this.downloadRangeRecord = function () {
                            var thiss = this;
                            var startPage = thiss.$ddlStartPage.int32();
                            var endPage = thiss.$ddlEndPage.int32();
                            var range = endPage - startPage;
                            if (startPage === 0 || endPage === 0) {
                                window.plugins.toast.showLongBottom("No hay expedientes para descargar");
                                return;
                            }
                            var message = (range > 150) ? "La descarga del expediente en rango de más de 150 páginas puede ser lenta" : "";
                            var question = "¿Desea descargar?";
                            confirm(message + question, function (buttonIndex) {
                                if (buttonIndex === 2) {
                                    window.open('https://docs.google.com/viewer?url=' + thiss.config.module.ingemmet.urls.recordRange2.replace("{1}", startPage).replace("{2}", endPage), '_blank', 'location=yes');
                                    //var url = (thiss.config.module.ingemmet.urls.recordRange2.replace("{1}", startPage).replace("{2}", endPage));
                                    //var options = {
                                    //    isJson: false,
                                    //    dataType: "binary",
                                    //    fileName: "Expediente_Pag" + startPage + "_Pag" + endPage,
                                    //    validate: function () { return true; }
                                    //};
                                    //thiss.searchConfig(url, options);
                                    thiss.$btnClose.trigger("click");
                                }
                            }, Record.TITLE, ["Cancelar", "Aceptar"]);
                        };
                        this.writeList = function (items) {
                            var thiss = this;
                            if (!(items instanceof Array)) return;
                            if (thiss.$divResult === null) {
                                thiss.$divResult = $('<div></div>');
                                thiss.$main.find('>.panel-body').append(thiss.$divResult);
                            }
                            thiss.$divResult.empty();
                            thiss.$divResult.css("bottom", "0").css("position", "absolute");
                            thiss.loadView(thiss.$divResult, com.jtm.Server.contextPath + "areas/miningconcession/miningcadaster/_list.html", function () {
                                thiss.$divResult.show();
                                thiss.$btnCloseList = thiss.$divResult.find('>.panel>.panel-heading #btnCloseList');
                                var heightList = thiss.$divResult.find('>.panel>.panel-heading').outerHeight(true);
                                thiss.$divResult.hide();
                                var selectorHeaderText = '>.panel>.panel-heading>.btn-toolbar>.btn-group:first>p';
                                thiss.$divResult.find(selectorHeaderText).text(thiss.$divResult.find(selectorHeaderText).text() + ' (' + items.length + ' coincidencias)');
                                thiss.$divResult.find('>.panel>.panel-body').css("max-height", (thiss.$main.find('>.panel-body').outerHeight(true) - heightList)).css("overflow", "auto");
                                var $table = thiss.$divResult.find('table');
                                items.forEach(function (item) {
                                    $table.find('>tbody').append('<tr><td><button type="button" id="' + item.attributes[thiss.config.module.service.joinField] + '" class="btn btn-sm"><i class="glyphicon glyphicon-eye-open"></i></button></td><td>' + item.attributes.CODIGOU + '</td><td>' + item.attributes.CONCESION + '</td></tr>');
                                });
                                thiss.$divResult.show();
                                $table.find('>tbody>tr button').off("click");
                                $table.find('>tbody>tr button').on("click", function (e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.searchRecords(jQuery(this).attr('id'), true);
                                    thiss.$divResult.hide();
                                });
                                thiss.$btnCloseList.off("click");
                                thiss.$btnCloseList.on("click", function (e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.$divResult.hide();
                                });
                                $table.find('>tbody>tr button:first').trigger('click');
                            });
                        };
                        this.sendMail = function () {
                            var thiss = this;
                            var startPage = thiss.$ddlStartPage.int32();
                            var endPage = thiss.$ddlEndPage.int32();
                            var range = endPage - startPage;
                            if (startPage === 0 || endPage === 0) {
                                window.plugins.toast.showLongBottom("No hay expedientes para descargar");
                                return;
                            }
                            var url = thiss.config.module.ingemmet.urls.recordRange2.replace("{1}", startPage).replace("{2}", endPage);
                            window.plugins.socialsharing.shareViaEmail(
                                'Te envío el enlace del expediente <br>' + url,
                                'Sigemin Mobile',
                                null,
                                null,
                                null,
                                [url],
                                function (success) {
                                    window.plugins.toast.showLongBottom("Se ha enviado correctament");
                                    thiss.$btnClose.trigger("click");
                                },
                                function (error) {
                                    window.plugins.toast.showLongBottom(error);
                                }
                            );
                        };
                    }
                    Record.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$main = this.$main.find('>.panel');
                        this.$toolbar = this.$main.find('>.panel-heading>div:first');
                        this.$toolbarDate = this.$main.find('>.panel-heading>div:last');
                        this.$txtSearch = thiss.$toolbar.find('#txtSearch');
                        this.$txtStartDate = this.$toolbarDate.find('#txtStartDate');
                        this.$txtEndDate = this.$toolbarDate.find('#txtEndDate');
                        this.$lblSelected = thiss.$toolbar.find('#lblSelected');
                        this.$btnGroupSearch = thiss.$toolbar.find('#btnGroupSearch');
                        this.$btnSearch = thiss.$toolbar.find('#btnSearch');
                        this.$btnClean = thiss.$toolbar.find('#btnClean');
                        this.$btnCloseToolBarDate = thiss.$toolbarDate.find('#btnCloseToolBarDate');
                        this.$btnSearchByDate = thiss.$toolbarDate.find('#btnSearchByDate');
                        this.$btnResult = thiss.$main.find('#btnResult');
                        this.$btnShare = thiss.$main.find('#btnShare');
                        this.$btnFormDownload = thiss.$main.find('#btnFormDownload');
                        this.$btnCloseToolBarDate = thiss.$main.find('#btnCloseToolBarDate');
                        this.$divDownload = thiss.$main.find('#divDownload');
                        this.$ddlPage = thiss.$main.find('#ddlPage');
                        this.$img = thiss.$main.find("#imgRecord");
                    };
                    Record.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (String.isNullOrWhiteSpace(thiss.$lblSelected.attr("data-field")) !== true && thiss.$lblSelected.attr("data-field") !== "" && String.isNullOrWhiteSpace(thiss.$txtSearch.val()) !== true && thiss.$txtSearch.val() !== "") {
                                where = "UPPER(" + thiss.$lblSelected.attr("data-field") + ")" + " LIKE '%" + thiss.$txtSearch.val().trim().toUpperCase() + "%'";
                                thiss.search(where);
                            }
                            else {
                                window.plugins.toast.showLongBottom("Ingrese un texto");
                            }
                        });
                        thiss.$btnSearchByDate.off("click");
                        thiss.$btnSearchByDate.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (String.isNullOrWhiteSpace(thiss.$txtStartDate.val()) !== true !== "" && String.isNullOrWhiteSpace(thiss.$txtEndDate.val()) !== true) {
                                if (thiss.$txtStartDate.date() > thiss.$txtEndDate.date()) {
                                    window.plugins.toast.showLongBottom("La fecha de inicio no puede ser mayor que la fecha final");
                                } else {
                                    where = "FEC_DENU>=date '" + thiss.$txtStartDate.val() + "' AND FEC_DENU<=date '" + thiss.$txtEndDate.val() + "'";
                                    thiss.search(where);
                                }
                            }
                            else {
                                window.plugins.toast.showLongBottom("Ingrese las fechas correctamente");
                            }
                        });
                        thiss.$btnCloseToolBarDate.off("click");
                        thiss.$btnCloseToolBarDate.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$toolbarDate.hide();
                            thiss.$toolbar.show();
                            thiss.$toolbar.find('>div>div>button>span:first').text('Nombre').attr("data-field", 'CONCESION');
                        });
                        thiss.$btnFormDownload.off("click");
                        thiss.$btnFormDownload.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formDownload();
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnResult.off("click");
                        thiss.$btnResult.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$divDownload.empty();
                            if (thiss.$divResult === null || thiss.$divResult.is(":empty") === true) {
                                window.plugins.toast.showLongBottom("No se encontraron concesiones mineras");
                                return;
                            }
                            thiss.$divResult.toggle();
                        });
                        thiss.$btnShare.off("click");
                        thiss.$btnShare.on("click", function (e) {
                        });
                    };
                    Record.prototype.uiConfig = function () {
                    };
                    Record.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(thiss.$txtStartDate);
                        thiss.datePicker(thiss.$txtEndDate);
                        var heightHeader = thiss.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = thiss.$main.find('>.panel-footer').outerHeight(true) || 0;
                        thiss.$main.find('>.panel-body').css("overflow", "auto").css("position", "relative");
                        thiss.$main.find('>.panel-body').css("height", thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter));
                        thiss.$divDownload.addClass("hiden");
                        thiss.$divDownload.css({ "position": "absolute", "top": "0", "left": "0px", "right": "0px" });
                        thiss.$toolbar.find('>div>div>ul.dropdown-menu li:not(.disabled)>a').off("click");
                        thiss.$toolbar.find('>div>div>ul.dropdown-menu li:not(.disabled)>a').on("click", function () {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$toolbarDate.removeClass("hidden");
                            $(this).closest(".input-group-btn").find(".btn>span:first").text($(this).text());
                            $(this).closest(".input-group-btn").find(".btn>span:first").attr("data-field", $(this).closest("li").attr("id"));
                            if ($(this).closest("li").attr("id") == "FEC_DENU") {
                                thiss.$toolbar.hide();
                                thiss.$toolbarDate.show();
                                thiss.$txtStartDate.val(new Date(Date.now() - 86400000 + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                                thiss.$txtEndDate.val(new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                            } else {
                                thiss.$toolbar.show();
                                thiss.$txtSearch.show();
                                thiss.$toolbarDate.hide();
                                thiss.$btnSearch.show();
                            }
                        });
                    };
                    Record.prototype.search = function (where) {
                        var thiss = this;
                        thiss.$img.attr("src", "").attr("alt", "");
                        thiss.$ddlPage.empty();
                        thiss.$divDownload.empty();
                        //thiss.$modalBackdrop = thiss.$modalBackdrop.detach();
                        if (thiss.$divResult !== null)
                            thiss.$divResult.empty().hide();
                        var data = {
                            f: "json",
                            returnGeometry: false,
                            outFields: "CODIGOU,CONCESION,TIT_CONCES",
                            where: where,
                            orderByFields: 'CONCESION'
                        };
                        thiss.ajax({
                            method: "POST",
                            url: thiss.config.module.service.url + "/" + thiss.config.module.service.layerId + "/query",
                            data: data,
                            isJson: false,
                            validate: function () { return true; }
                        }, function (data) {
                            if (data.features === undefined || data.features.length === 0) {
                                window.plugins.toast.showLongBottom("No se encontraron concesiones mineras");
                                return;
                            }
                            thiss.writeList(data.features);
                        });
                    };
                    Record.prototype.load = function () {
                        _super.prototype.load.call(this, "record", { module: "miningconcession", subModule: "miningcadaster" });
                    };
                    Record.prototype.cleanControls = function () {
                        var thiss = this;
                        if (thiss.$txtSearch !== null)
                            thiss.$txtSearch.val("");
                        if (thiss.$img !== null)
                            thiss.$img.attr("src", "").attr("alt", "");
                        if (thiss.$ddlPage !== null)
                            thiss.$ddlPage.empty();
                        if (thiss.$divResult !== null)
                            thiss.$divResult.empty().hide();
                        if (thiss.$divDownload !== null)
                            thiss.$divDownload.empty();
                    };
                    Record.execute = function () {
                        var client = new Record();
                        client.load();
                    };
                    return Record;
                })(jtm.miningconcession.BaseMain);
                miningcadaster.Record = Record;
            })(miningconcession.miningcadaster || (miningconcession.miningcadaster = {}));
            var miningcadaster = miningconcession.miningcadaster;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningcadaster.Record.execute();