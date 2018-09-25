(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var MineralPrice = (function (_super) {
                    __extends(MineralPrice, _super);
                    function MineralPrice() {
                        _super.call(this);
                        this.$divMaster = null;
                        this.$ddlMineral = null;
                        this.$imgPrice = null;
                    }
                    MineralPrice.prototype.buttonConfig = function (options) {
                        var thiss = this;
                    };
                    MineralPrice.prototype.uiConfig = function () {
                    };
                    MineralPrice.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.$divMaster = $('#divMaster');
                        var heightHeader = thiss.$divMaster.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = thiss.$divMaster.find('>.panel-footer').outerHeight(true) || 0;
                        thiss.$divMaster.find('>.panel-body').css("overflow", "auto");
                        thiss.$divMaster.find('>.panel-body').css("height", thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter));
                        thiss.$ddlMineral = $('#ddlMineral');
                        thiss.$imgPrice = $('#imgPrice');
                        com.jtm.helper.DropDownList.fillLocal({
                            ddl: thiss.$ddlMineral,
                            items: thiss.config.module.minerals,
                            fieldId: "url",
                            fieldName: "title"
                        });
                        thiss.$ddlMineral.off("change");
                        thiss.$ddlMineral.on("change", function (e) {
                            thiss.$imgPrice.attr("src", jQuery(this).val());
                        });
                        thiss.$ddlMineral.trigger("change");
                    };
                    MineralPrice.prototype.load = function () {
                        _super.prototype.load.call(this, "miningconcession", "mineralprice");
                    };
                    MineralPrice.execute = function () {
                        var client = new MineralPrice();
                        client.load();
                    };
                    return MineralPrice;
                })(jtm.Master);
                miningconcession.MineralPrice = MineralPrice;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.MineralPrice.execute();