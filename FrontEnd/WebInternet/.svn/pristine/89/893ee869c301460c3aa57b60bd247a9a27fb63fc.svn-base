(function (com) {
    (function (jtm) {
        (function (geology) {
            (function (undergroundsampling) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "uns";
                        this.urls = {
                            formSample: com.jtm.Server.contextPath + 'geology/undergroundsampling/formsample',
                            saveSample: com.jtm.Server.contextPath + 'geology/undergroundsampling/savesample',
                            detailSample: com.jtm.Server.contextPath + 'geology/undergroundsampling/detailsample',
                            deleteSamples: com.jtm.Server.contextPath + 'geology/undergroundsampling/deletesamples',
                            searchSamples: com.jtm.Server.contextPath + 'geology/undergroundsampling/searchsamples',
                            saveDocumentsSample: com.jtm.Server.contextPath + 'geology/undergroundsampling/savedocumentssample'
                        };
                    }
                    Main.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.path + "geology/undergroundsampling/" + thiss.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            thiss.sampleViewer = getInstance();
                            thiss.sampleViewer.setConfig(thiss.config);
                            thiss.sampleFormViewer = getInstance();
                            thiss.sampleFormViewer.setConfig(thiss.config);
                        });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(geology.BaseMain);
                undergroundsampling.Main = Main;
            })(geology.undergroundsampling || (geology.undergroundsampling = {}));
            var undergroundsampling = geology.undergroundsampling;
        })(jtm.geology || (jtm.geology = {}));
        var geology = jtm.geology;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geology.undergroundsampling.Main.execute();