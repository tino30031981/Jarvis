(function (com) {
    (function (jtm) {
        (function (geology) {
            (function (surfacesampling) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "sus";
                        this.urls = {
                            formSample: com.jtm.Server.contextPath + 'geology/surfacesampling/formsample',
                            saveSample: com.jtm.Server.contextPath + 'geology/surfacesampling/savesample',
                            detailSample: com.jtm.Server.contextPath + 'geology/surfacesampling/detailsample',
                            deleteSamples: com.jtm.Server.contextPath + 'geology/surfacesampling/deletesamples',
                            searchSamples: com.jtm.Server.contextPath + 'geology/surfacesampling/searchsamples',
                            saveDocumentsSample: com.jtm.Server.contextPath + 'geology/surfacesampling/savedocumentssample'
                        };
                    }
                    Main.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.path + "geology/surfacesampling/" + thiss.apigeo + "mainmap";
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
                surfacesampling.Main = Main;
            })(geology.surfacesampling || (geology.surfacesampling = {}));
            var surfacesampling = geology.surfacesampling;
        })(jtm.geology || (jtm.geology = {}));
        var geology = jtm.geology;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geology.surfacesampling.Main.execute();