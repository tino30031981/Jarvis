(function (com) {
    (function (jtm) {
        (function (minedu) {
            (function (edan) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$btnClean = null;
                        this.$btnShare = null;
                        this.$btnCloud = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                    }
                    Main.prototype.formConfig = function () {
                        var options = { formJS: this.js.module.subModule.path + "form2.js" };
                        _super.prototype.formConfig.call(this, options, true);
                    };
                    Main.prototype.attachmentConfig = function () {
                    };
                    Main.prototype.domConfig = function () {
                        this.$main = this.$main.find('>.panel:first');
                        this.$btnInsert = this.$main.find('#btnInsert');
                        this.$btnUpdate = this.$main.find('#btnUpdate');
                        this.$btnDelete = this.$main.find('#btnDelete');
                        this.$btnCloud = this.$main.find('#btnCloud');
                        this.$btnSearch = this.$main.find('#btnSearch');
                        this.$btnClean = this.$form.find('#btnClean');
                        this.$txtStartDate = this.$main.find('#txtStartDate');
                        this.$txtEndDate = this.$main.find('#txtEndDate');
                        this.$table = this.$main.find('#tblResult');
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        thiss.$btnInsert.off("click");
                        thiss.$btnInsert.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formm.load(0);
                        });
                        thiss.$btnUpdate.off("click");
                        thiss.$btnUpdate.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formm.load(0);
                        });
                        thiss.$btnDelete.off("click");
                        thiss.$btnDelete.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.delete();
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnCloud.off("click");
                        thiss.$btnCloud.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            window.plugins.toast.showLongBottom('En implementación, permitirá sincronizar a un servidor en la nube');
                        });
                        this.$btnSearch.trigger("click");
                    };
                    Main.prototype.uiConfig = function () {
                        //var thiss = this;

                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                        var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                        this.$main.find(">.panel-body").css("height", height).css("overflow", "auto");
                        this.$main.attr('data-title', this.$main.closest(Main.DOMMAIN).data('title'));
                        this.$main.attr('data-subtitle', this.$main.closest(Main.DOMMAIN).data('subtitle'));
                        this.datePicker(thiss.$txtStartDate);
                        this.datePicker(thiss.$txtEndDate);
                        this.$table.find('>thead input[name=chkAll]').off("change");
                        this.$table.find('>thead input[name=chkAll]').on("change", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if ($(this).is(':checked'))
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', true);
                            else
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', false);
                        });
                        this.$table.off("doubletap");
                        this.$table.on("doubletap", ">tbody>tr", function (e) {
                            var id = jQuery(this).attr("data-uniqueid");
                            thiss.formm.load(id, { containerMain: thiss.$main });
                        });
                    };
                    Main.prototype.initConfig = function () {
                    };
                    Main.prototype.setModule = function (jsonFile, options) {
                        options = { refactorized: true };
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "edan2", { module: "minedu", subModule: 'edan' });
                    };
                    Main.prototype.delete = function () {
                        var thiss = this;
                        var ids = com.jtm.helper.Table.getItems(thiss.$table, true, false);
                        if (ids.length === 0) {
                            window.plugins.toast.showLongBottom('Seleccione al menos un elemento a eliminar');
                            return;
                        }
                        confirm("¿Desea eliminar los elementos?", function (buttonId) {
                            if (buttonId === 1) {
                                thiss.db = thiss.openDatabase();
                                thiss.db.transaction(function (tx) {
                                    tx.executeSql('delete from "edan.edan" where id in(' + ids.join(",") + ')');
                                }, function (error) {
                                    window.plugins.toast.showLongBottom(error);
                                }, function () {
                                    window.plugins.toast.showLongBottom("Se ha eliminado el registro");
                                    thiss.$btnSearch.trigger("click");
                                });
                            }
                        }, Main.TITLE, ["Aceptar", "Cancelar"]);
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        thiss.$table.find("tbody").empty();
                        var html = '';
                        this.db = thiss.openDatabase();
                        this.db.readTransaction(function (tx) {
                            tx.executeSql('SELECT * FROM "edan.edan" order by registrationdate desc', [], function (tx, rs) {
                                var length = rs.rows.length;
                                var i = 0;
                                for (i = 0; i < length; i++) {
                                    html += '<tr data-uniqueid=' + rs.rows.item(i).id + '>';
                                    html += '<td><input type="checkbox" value="' + rs.rows.item(i).id + '"/></td>';
                                    html += '<td><p>' + rs.rows.item(i).name + '</p><b>' + new Date(rs.rows.item(i).registrationdate).toString(Main.DATETIMEFORMAT) + '</b></td>';
                                    if (rs.rows.item(i).issynchronized == "false")
                                        html += '<td><i class="glyphicon glyphicon-alert" style="color:red !important;font-size:24px"></i></td>';
                                    else
                                        html += '<td><i class="glyphicon glyphicon-ok" style="color:background-color:green !important;font-size:24px"></i></td>';
                                    html += '</tr>';
                                }
                                thiss.$table.find("tbody").append(html);
                                com.jtm.helper.Table.highlightRow(thiss.$table);
                            }, function (tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function (error) {
                            console.log('transaction error: ' + error.message);
                        }, function () {
                            console.log('transaction ok');
                        });
                    };
                    Main.prototype.cleanControls = function (toNull) {
                        this.$txtStartDate.val('');
                        this.$txtEndDate.val('');
                        this.$table.find('>tbody').empty();
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                edan.Main = Main;
            })(minedu.edan || (minedu.edan = {}));
            var edan = minedu.edan;
        })(jtm.minedu || (jtm.minedu = {}));
        var minedu = jtm.minedu;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.minedu.edan.Main.execute();