var com;
(function (com) {
    (function (jtm) {
        (function (defaultt) {
            var Index = (function (_super) {
                __extends(Index, _super);
                function Index() {
                    _super.call(this);
                    this.prefix = "def";
                    this.$divAreas = null;
                    this.listOffice = function () {
                        var thiss = this;
                        var options = {
                            data: {},
                            validate: true
                        };
                        thiss.searchConfig(com.jtm.Server.contextPath + "admin/office/list2", options, function (items) {
                            if (items.length === 0) {
                                toastr.info("No hay resultados de su base de datos");
                                return;
                            }
                            var col = 0;
                            col = items.length <= 4 ? col = 12 / items.length : 3;
                            var i = 1;
                            var html = '';
                            items.forEach(function (item) {
                                html += '<a href="' + com.jtm.Server.contextPath + 'admin/user/loginbyarea?areaId=' + item.id + '" style="">';
                                html += '<button class="btn btn-lg col-sm-2" style="height: 150px;white-space: normal;">';
                                html += '<i class="glyphicon glyphicon-log-in"></i> <br> ' + item.name + '</button></a>';
                            });
                            thiss.$divAreas.html(html);
                        });
                    };
                }
                Index.prototype.initConfig = function () {
                };
                Index.prototype.domConfig = function () {
                    var thiss = this;
                    thiss.$divAreas = $("#divAreas");
                    thiss.$imgLogo = $("#imgLogo");
                };
                Index.prototype.buttonConfig = function () {
                };
                Index.prototype.uiConfig = function () {
                    var thiss = this;
                    thiss.listOffice();
                    thiss.$imgLogo.attr('src', com.jtm.System.img + thiss.config.logoCoorporate);
                };
                Index.execute = function () {
                    var client = new Index();
                    client.load();
                };
                return Index;
            })(jtm.Master);
            defaultt.Index = Index;
        })(jtm.defaultt || (jtm.defaultt = {}));
        var defaultt = jtm.defaultt;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.defaultt.Index.execute();