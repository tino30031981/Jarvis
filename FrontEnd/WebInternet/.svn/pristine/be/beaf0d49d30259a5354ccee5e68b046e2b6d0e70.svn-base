(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (agreementservice) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.openWindow = null;
                        this.getElementCode = function (tbl, attribute) {
                            var thiss = this;
                            tbl = "#tblResult";//tbl || thiss.TBLRESULT;
                            tbl = (typeof tbl === "string") ? jQuery(tbl) : tbl;
                            attribute = attribute || "data-uniqueid";
                            var row = tbl.find('>tbody>tr.selected')[0];
                            if (row === undefined) return 0;
                            var code = $(row).attr(attribute);
                            return code;
                        };
                        this.popup = function () {
                            var thiss = this
                            var hdnCode = (thiss.$hdnId === undefined || thiss.$hdnId === null) ? thiss.getElementCode() : thiss.$hdnId.string();
                            if (hdnCode == "" || hdnCode == 0)
                            {
                                alert("Seleccione un registro a consultar");
                                return;
                            }
                            if ((thiss.openWindow == null) || (thiss.openWindow.closed)) {
                                thiss.openWindow = window.open($('#hdnViewDetail').val() + hdnCode, 'detalleConvenio', 'width=700,height=500,scrollbars=yes,resizable=yes');
                                thiss.openWindow.focus();
                            } else {
                                thiss.openWindow.location.href = url;
                                thiss.openWindow.focus();
                            }
                        }
                    }
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        $('#btnViewDetail').off("click");
                        $('#btnViewDetail').on("click", function () {
                            thiss.popup();
                        });
                        _super.prototype.buttonConfig.call(this);
                    };
                    Main.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        var options = {};
                        var id = thiss.getElementCode();
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "socialresponsability/agreementservice/savecoordinatessimple";
                        options.callback = function () {
                            thiss.detail(url, id)
                            $('#btnDetail').off("click");
                            $('#btnDetail').on("click", function () {
                                thiss.popup();
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    }
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        console.log(id);
                        options = {};
                        var options2 = {
                            data: { code: id },
                            validate: true,
                            isJson: false
                        };
                        thiss.$hdnId.val(id);
                        thiss.detailConfig(com.jtm.Server.contextPath + "socialresponsability/agreementservice/detailbycode2", options2, function (data) {
                            var item = data.item;
                            //thiss.$hdnId.val(item.code);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            thiss.formViewer.fillCoordinates(item.coordinates);
                            thiss.formViewer.addFeatures(data.featuresList);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: 'community.id',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: "community.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "startDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "agreementServiceArea",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "description",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                agreementservice.Main = Main;
            })(socialresponsability.agreementservice || (socialresponsability.agreementservice = {}));
            var agreementservice = socialresponsability.agreementservice;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.agreementservice.Main.execute();