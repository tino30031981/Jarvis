var com;
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            var MiningProject = (function (_super) {
                __extends(MiningProject, _super);
                function MiningProject() {
                    _super.call(this);
                    this.$txtSearch = null;
                    this.$btnSearch = null;
                    this.$btnDownload = null;
                    this.$btnFormDownload = null;
                    this.$btnClear = null;
                    this.$divDownload = null;
                    this.$ddlPage = null;
                    this.$ddlStartPage = null;
                    this.$ddlEndPage = null;
                    this.formDownload = function () {
                        var thiss = this;
                        thiss.loadView(thiss.$divDownload, com.jtm.Server.contextPath + "areas/miningconcession/miningcadaster/_recorddownload.html", function () {
                            thiss.$btnDownload = $('#btnDownload');
                            thiss.$ddlStartPage = $('#ddlStartPage');
                            thiss.$ddlEndPage = $('#ddlEndPage');
                            thiss.$ddlStartPage.html(thiss.$ddlPage.html());
                            thiss.$ddlEndPage.html(thiss.$ddlPage.html());
                            thiss.$ddlStartPage.val(1);
                            thiss.$ddlEndPage.val(thiss.$ddlPage.find('option').length);
                            thiss.$divDownload.addClass("show");
                            jQuery('#btnDownload').off("click");
                            jQuery('#btnDownload').on("click", function (e) {
                                thiss.downloadRangeRecord();
                                jQuery('#btnClose').trigger("click");
                            });
                            jQuery('#btnClose').off("click");
                            jQuery('#btnClose').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.$divDownload.empty();
                                thiss.$divDownload.hide();
                            });
                        });
                    };
                    this.downloadRangeRecord = function () {
                        var thiss = this;
                        var $ddlStart = $('#ddlStartPage');
                        var $ddlEnd = $('#ddlEndPage');
                        var startPage = $ddlStart.int32();
                        var endPage = $ddlEnd.int32();
                        var range = endPage - startPage;
                        if (startPage === 0 || endPage === 0) {
                            alert("No hay expedientes para descargar");
                            return;
                        }
                        var message = (range > 150) ? "La descarga del expediente en rango de más de 150 páginas puede ser lenta" : "";
                        var question = "¿Desea descargar?";
                        confirm(message + question, function (buttonIndex) {
                            console.log(buttonIndex);
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
                            }
                        }, MiningProject.TITLE, ["Cancelar", "Aceptar"]);
                    };
                }
                MiningProject.prototype.buttonConfig = function (options) {
                    var thiss = this;
                    thiss.$btnSearch.off("click");
                    thiss.$btnSearch.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        if (thiss.$txtSearch.val() !== '')
                            thiss.searchRecords(thiss.$txtSearch.val(), true);
                        else
                            alert('Ingrese el Código de Concesssion Minera');
                    });
                    thiss.$btnFormDownload.off("click");
                    thiss.$btnFormDownload.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.formDownload();
                    });
                    thiss.$btnClear.off("click");
                    thiss.$btnClear.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.$txtSearch.val("");
                        jQuery('#imgRecord').attr("src", "");
                        jQuery('#imgRecord').attr("alt", "");
                        thiss.$ddlPage.empty();
                    });
                };
                MiningProject.prototype.uiConfig = function () {
                };
                MiningProject.prototype.initConfig = function () {
                    var thiss = this;
                    _super.prototype.initConfig.call(this);
                    var heightHeader = jQuery('#divMaster>.panel-heading').outerHeight(true) || 0;
                    var heightFooter = jQuery('#divMaster>.panel-footer').outerHeight(true) || 0;
                    jQuery('#divMaster>.panel-body').css("overflow", "auto");
                    jQuery('#divMaster>.panel-body').css("height", thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter));
                    jQuery('#divMaster>').css("position", "relative");
                    this.$txtSearch = $('#txtSearch');
                    this.$btnSearch = $('#btnSearch');
                    this.$btnFormDownload = $('#btnFormDownload');
                    this.$divDownload = $('#divDownload');
                    this.$btnClear = $('#btnClear');
                    thiss.$divDownload.addClass("hiden");
                    thiss.$divDownload.css({ "position": "absolute", "top": "50px", "left": "0px", "right": "0px" });
                    this.$ddlPage = $('#ddlPage');
                };
                MiningProject.execute = function () {
                    var client = new MiningProject();
                    client.load();
                };
                return MiningProject;
            })(jtm.miningconcession.BaseMiningConcession);
            miningconcession.MiningProject = MiningProject;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.MiningProject.execute();