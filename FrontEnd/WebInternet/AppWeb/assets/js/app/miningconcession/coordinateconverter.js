var com;
(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            var CoordinateConverter = (function (_super) {
                __extends(CoordinateConverter, _super);
                function CoordinateConverter() {
                    _super.call(this);
                    this.process = function () {
                        var thiss = this;
                        var options = {
                            isJson: false,
                            dataType: "binary",
                            data: { name: jQuery('#txtName').val(), format: jQuery('#ddlFormatOutput').val() },
                            attachments: [{ id: "filFile", file: jQuery('#filFile')[0].files[0] }],
                            validate: validate
                        };
                        this.saveConfig(com.jtm.Server.contextPath + 'miningconcession/coordinateconverter/process', options);
                        function validate() {
                            return true;
                        }
                    };
                }
                CoordinateConverter.prototype.initConfig = function () {
                    var thiss = this;
                    com.jtm.helper.DropDownList.fillLocal({
                        ddl: "#ddlFormatOutput",
                        items: thiss.config.module.formatsOutput
                    });
                };
                CoordinateConverter.prototype.buttonConfig = function (options) {
                    var thiss = this;
                    jQuery('#btnUpload').unbind();
                    jQuery('#btnUpload').click(function () {
                        thiss.process();
                    });
                };
                CoordinateConverter.prototype.form = function (url, id, options) {
                };

                CoordinateConverter.prototype.detail = function (url, id, options) {
                    var thiss = this;
                };
                CoordinateConverter.prototype.load = function () {
                    _super.prototype.load.call(this, "miningconcession", "coordinateconverter");
                };
                CoordinateConverter.prototype.parameters = function () {
                    return null;
                };
                CoordinateConverter.prototype.search = function () {
                };
                return CoordinateConverter;
            })(jtm.Master);
            miningconcession.CoordinateConverter = CoordinateConverter;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
var client = new com.jtm.miningconcession.CoordinateConverter();
client.load();