(function(com) {
    (function(jtm) {
        (function(miningconcession) {
            (function(miningrequest) {
                var Main = (function(_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$btnClean = null;
                        this.$btnShare = null;
                        this.$btnCloud = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                        this.setServices = function() {
                            var thiss = this;
                            thiss.config.module.servicesNew = [];
                            jQuery.ajaxSetup({ async: false });
                            for (var i in thiss.config.module.servicesOnExtent) {
                                for (var j in thiss.config.module.servicesOnExtent[i]) {
                                    jQuery.getJSON(thiss.config.module.servicesOnExtent[i][j].url + "?f=json&rnd=" + Math.random(), function() { }).done(function(data, textStatus, jqXHR) {
                                        if (data.error !== undefined || jqXHR.status != 200) return;
                                        thiss.config.module.servicesOnExtent[i][j].minScale = data.minScale;
                                        thiss.config.module.servicesOnExtent[i][j].maxScale = data.maxScale;
                                    });
                                }
                            }
                            for (var i = 0; i < thiss.config.module.services.length; i++) {
                                if (thiss.config.module.services[i].groups instanceof Array) {
                                    jQuery.getJSON(thiss.config.module.services[i].url + "?f=json&rnd=" + Math.random()).done(function(data, textStatus, jqXHR) {
                                        if (data.error !== undefined || jqXHR.status != 200) { thiss.config.module.services[i].disabled = true; return; }
                                        for (var j = 0; j < data.layers.length; j++) {
                                            if (data.layers[j].subLayerIds instanceof Array) continue;
                                            if (thiss.config.module.services[i].groups.exist2('layerId', j) === true) {
                                                length = thiss.config.module.servicesNew.push(thiss.config.module.services[i].groups.find2('layerId', j));
                                                thiss.config.module.servicesNew[length - 1].UUID = 'overlap_' + thiss.getUUID();
                                                thiss.config.module.servicesNew[length - 1].url = thiss.config.module.services[i].url;
                                                thiss.config.module.servicesNew[length - 1].name = data.layers[j].name;
                                                thiss.config.module.servicesNew[length - 1].displayField = data.layers[j].displayField;
                                                thiss.config.module.servicesNew[length - 1].geometryType = data.layers[j].geometryType;
                                            }
                                        }
                                    });
                                }
                                else {
                                    jQuery.getJSON(thiss.config.module.services[i].url + '/' + thiss.config.module.services[i].layerId + "?f=json&rnd=" + Math.random()).done(function(data, textStatus, jqXHR) {
                                        if (data.error !== undefined || jqXHR.status != 200) { thiss.config.module.services[i].disabled = true; return; }
                                        length = thiss.config.module.servicesNew.push(thiss.config.module.services[i]);
                                        thiss.config.module.servicesNew[length - 1].UUID = 'overlap_' + thiss.getUUID();
                                        thiss.config.module.servicesNew[length - 1].name = data.name;
                                        thiss.config.module.servicesNew[length - 1].displayField = data.displayField;
                                        thiss.config.module.servicesNew[length - 1].geometryType = data.geometryType;
                                    });
                                }
                            }
                            jQuery.ajaxSetup({ async: true });
                            thiss.config.module.services = thiss.config.module.servicesNew;
                        };
                    }
                    Main.prototype.formConfig = function() {
                        var options = { formJS: this.js.module.subModule.path + "form2.js" };
                        _super.prototype.formConfig.call(this, options, true);
                    };
                    Main.prototype.attachmentConfig = function() {
                    };
                    Main.prototype.domConfig = function() {
                        this.$main = this.$main.find('>.panel');
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
                    Main.prototype.buttonConfig = function(options) {
                        var thiss = this;
                        thiss.$btnInsert.off("click");
                        thiss.$btnInsert.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formm.load(0);
                        });
                        thiss.$btnUpdate.off("click");
                        thiss.$btnUpdate.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formm.load(0);
                        });
                        thiss.$btnDelete.off("click");
                        thiss.$btnDelete.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.delete();
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnCloud.off("click");
                        thiss.$btnCloud.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            window.plugins.toast.showLongBottom('En implementación, permitirá sincronizar a un servidor en la nube');
                        });
                        this.$btnSearch.trigger("click");
                    };
                    Main.prototype.uiConfig = function() {
                    };
                    Main.prototype.viewConfig = function() {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                        var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                        this.$main.find(">.panel-body").css("height", height).css("overflow", "auto");
                        this.datePicker(thiss.$txtStartDate);
                        this.datePicker(thiss.$txtEndDate);
                        this.$table.find('>thead input[name=chkAll]').off("change");
                        this.$table.find('>thead input[name=chkAll]').on("change", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            if ($(this).is(':checked'))
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', true);
                            else
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', false);
                        });
                        this.$table.off("doubletap");
                        this.$table.on("doubletap", ">tbody>tr", function(e) {
                            var id = jQuery(this).attr("data-uniqueid");
                            thiss.formm.load(id, { containerMain: thiss.$main });
                        });
                    };
                    Main.prototype.initConfig = function() {
                        this.setServices();
                    };
                    Main.prototype.setModule = function(jsonFile, options) {
                        options = { refactorized: true };
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.load = function() {
                        _super.prototype.load.call(this, "miningrequest2", { module: "miningconcession", subModule: 'miningrequest' });
                    };
                    Main.prototype.delete = function() {
                        var thiss = this;
                        var ids = com.jtm.helper.Table.getItems(thiss.$table, true, false);
                        if (ids.length === 0) {
                            window.plugins.toast.showLongBottom('Seleccione al menos un elemento a eliminar');
                            return;
                        }
                        confirm("¿Desea eliminar los elementos?", function(buttonId) {
                            if (buttonId === 1) {
                                thiss.db = thiss.openDatabase();
                                thiss.db.transaction(function(tx) {
                                    tx.executeSql('delete from "mc.miningrequest" where id in(' + ids.join(",") + ')');
                                }, function(error) {
                                    window.plugins.toast.showLongBottom(error);
                                }, function() {
                                    window.plugins.toast.showLongBottom("Se ha eliminado el registro");
                                    thiss.$btnSearch.trigger("click");
                                });
                            }
                        }, Main.TITLE, ["Aceptar", "Cancelar"]);
                    };
                    Main.prototype.search = function(url, options, callback) {
                        var thiss = this;
                        thiss.$table.find("tbody").empty();
                        var html = '';
                        this.db = thiss.openDatabase();
                        this.db.readTransaction(function(tx) {
                            tx.executeSql('SELECT * FROM "mc.miningrequest" order by registrationdate desc', [], function(tx, rs) {
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
                            }, function(tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function(error) {
                            console.log('transaction error: ' + error.message);
                        }, function() {
                            console.log('transaction ok');
                        });
                    };
                    Main.prototype.cleanControls = function(toNull) {
                        this.$txtStartDate.val('');
                        this.$txtEndDate.val('');
                        this.$table.find('>tbody').empty();
                    };
                    Main.execute = function() {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                miningrequest.Main = Main;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningrequest.Main.execute();