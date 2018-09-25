(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (documentlibrary) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "dl";
                        this.$ddlMiningProject = null;
                        this.$ddlLegalFrame = null;
                        this.$ddlFiscalization = null;
                        this.$ddlIncidence = null;
                        this.fillDropDownList = function () {
                            var thiss = this;
                            thiss.$ddlMiningProject.on("change", function (e) {
                                com.jtm.helper.DropDownList.fill({ url: com.jtm.Server.contextPath + "environment/legalframe/searchbyminingproject", ddl: thiss.$ddlLegalFrame, data: { id: thiss.$ddlMiningProject.int32() } });
                                com.jtm.helper.DropDownList.fill({ url: com.jtm.Server.contextPath + "environment/fiscalization/searchbyminingproject", ddl: thiss.$ddlFiscalization, data: { id: thiss.$ddlMiningProject.int32() } });
                                com.jtm.helper.DropDownList.fill({ url: com.jtm.Server.contextPath + "environment/incidence/searchbyminingproject", ddl: thiss.$ddlIncidence, data: { id: thiss.$ddlMiningProject.int32() } });
                            });
                            thiss.$ddlMiningProject.trigger("change");
                        };
                        this.downloadData = function () {
                            var thiss = this;
                            var documentIds = com.jtm.helper.Table.getItems(thiss.$tblResult, true, false);
                            var options = {
                                isJson: false,
                                dataType: "binary",
                                data: { ids: documentIds },
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'documentlibrary/document/download', options, null);
                            function validate() {
                                if (documentIds.length === 0) {
                                    alert('Seleccione al menos un documento.');
                                    return false;
                                } else
                                    return true;
                            }
                        };
                        this.report = function (format, url) {
                            var thiss = this;                            
                            var options = {
                                data: {
                                    legalFrameId: thiss.$ddlLegalFrame.int32(),
                                    fiscalizationId: thiss.$ddlFiscalization.int32(),
                                    incidenceId: thiss.$ddlIncidence.int32()
                                }
                            };                            
                            url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlReport : url;
                            thiss.downloadConfig(url, format, options, null);
                        };
                    }
                    Main.DDLMININGPRJECT = '#ddlMiningProject';
                    Main.DDLLEGALFRAME = "#ddlLegalFrame";
                    Main.DDLFISCALIZATION = "#ddlFiscalization";
                    Main.DDLINCIDENCE = "#ddlIncidence";

                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        thiss.$ddlMiningProject = this.$main.find(Main.DDLMININGPRJECT);
                        thiss.$ddlLegalFrame = this.$main.find(Main.DDLLEGALFRAME);
                        thiss.$ddlFiscalization = this.$main.find(Main.DDLFISCALIZATION);
                        thiss.$ddlIncidence = this.$main.find(Main.DDLINCIDENCE);
                        thiss.$btnSearch = this.$main.find(Main.BTNSEARCH);
                        thiss.$btnDownload = this.$main.find(Main.BTNDOWNLOAD);
                        thiss.$divReport = this.$main.find(Main.DOMDIVREPORT);
                        thiss.$divFormatReport = this.$main.find(Main.DOMDIVFORMATREPORT);
                        thiss.$tblResult = this.$main.find('#tblResult');
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        thiss.fillDropDownList();
                    }
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.search();
                        });
                        thiss.$btnDownload.off("click");
                        thiss.$btnDownload.on("click", function (e) {
                            thiss.downloadData();
                        });
                        thiss.$divReport.find('>ul').off("click", ">li>a");
                        thiss.$divReport.find('>ul').on("click", ">li>a", function (e) {
                            e.preventDefault();
                            window.plugins.deviceFeedback.acoustic();
                            thiss.report(thiss.$divFormatReport.find('#lblSelected').attr("data-format"), com.jtm.Server.contextPath + "environment/documentlibrary/report2");
                        });
                    };
                    Main.prototype.search = function () {
                        var thiss = this;
                        var item = {
                            miningProjectId: thiss.$ddlMiningProject.int32(),
                            legalFrameId: thiss.$ddlLegalFrame.int32(),
                            fiscalizationId: thiss.$ddlFiscalization.int32(),
                            incidenceId: thiss.$ddlIncidence.int32()
                        };
                        thiss.searchConfig(com.jtm.Server.contextPath + 'environment/documentlibrary/search',
                            {
                                data: item,
                                isJson: false
                            }, function (items) {
                               thiss.$tblResult.find('>tbody').empty();                                
                                items.forEach(function (item, i) {         
                                    thiss.$tblResult.find('>tbody').append("<tr></tr>")                                    
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td><input type="checkbox" id="chk' + item.id + '" name="chk' + item.id + '" value="' + item.id + '"/></td>');
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td>' + (i + 1) + '</td>');
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td>' + item.group + '</td>');
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td>' + item.component + '</td>');
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td>' + item.name + '</td>');
                                    thiss.$tblResult.find('>tbody>tr:last').append('<td>' + item.physicallocation + '</td>');
                                });
                                thiss.$tblResult.find('>caption>span').html(thiss.$tblResult.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResult);
                            });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.Master);
                documentlibrary.Main = Main;
            })(environment.documentlibrary || (environment.documentlibrary = {}));
            var documentlibrary = environment.documentlibrary;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.documentlibrary.Main.execute();