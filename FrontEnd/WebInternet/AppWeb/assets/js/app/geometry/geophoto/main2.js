(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (geophoto) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.$btnClean = null;
                        this.$btnShare = null;
                        this.$btnCloud = null;
                        this.$btnPrint = null;
                        this.$txtStartDate = null;
                        this.$txtEndDate = null;
                        this.$txtDescription = null;
                        this.sqlSynchronized = function (ids) {
                            var sql = 'SELECT p.id,p.uuid,p.description,p.documenturl,p.geometry,p.spatialreferenceid,p.state FROM "geo.photography" as p where p.id in(' + ids.join() + ') order by p.registrationdate desc';
                            return sql;
                        }
                        this.synchronize = function () {
                            var thiss = this;
                            var i = 0;
                            var ids = [];
                            var itemUser = window.sessionStorage.getItem(Main.USERSESSIONNAME);
                            if (String.isNullOrWhiteSpace(itemUser)===true) {
                                window.plugins.toast.showLongBottom("Aún no se ha identificado");
                                return;
                            }
                            thiss.$table.find('>tbody>tr input:checkbox').toArray().forEach(function (chk) {
                                if (jQuery(chk).is(":checked") === true)
                                    ids.push(jQuery(chk).val());
                            });
                            if (ids.length === 0) {
                                window.plugins.toast.showLongBottom("No ha seleccionado ningún elemento para sincronizar");
                                return;
                            }
                            itemUser = JSON.parse(itemUser);
                            var sql = thiss.sqlSynchronized(ids);
                            thiss.db = thiss.openDatabase();
                            thiss.db.executeSql(sql, [], function (rs) {
                                var length = rs.rows.length;
                                var i = 0;
                                var j = 0;
                                for (i = 0; i < length; i++) {
                                    (function (k) {
                                        var data = {
                                            id: rs.rows.item(k).id,
                                            uuid: rs.rows.item(k).uuid,
                                            user: { id: itemUser.userName },
                                            description: rs.rows.item(k).description,
                                            spatialReference: { id: rs.rows.item(k).spatialreferenceid },
                                            state: rs.rows.item(k).state
                                        };
                                        var geometry = rs.rows.item(k).geometry;
                                        var geometryEWKT = '';
                                        if (geometry !== undefined && geometry !== null) {
                                            geometry = JSON.parse(geometry);
                                            var wkt = $.geo.WKT.stringify({
                                                type: geometry.type,
                                                coordinates: geometry.coordinates
                                            });
                                            geometryEWKT = "SRID=" + geometry.spatialReference.id + ";" + wkt;
                                        }
                                        data.geometryEWKT = geometryEWKT;
                                        window.resolveLocalFileSystemURL(rs.rows.item(k).documenturl, function (fileEntry) {
                                            fileEntry.file(function (file) {
                                                var reader = new FileReader();
                                                reader.onloadend = function (e) {
                                                    var blob = new Blob([this.result], { type: file.type });
                                                    var attachments = [];
                                                    attachments.push({ id: "file", file: blob });
                                                    thiss.ajax({
                                                        data: data,
                                                        attachments: attachments,
                                                        url: thiss.config.restServer + "geometry/geophoto/save",
                                                        async: true,
                                                        validate: function () { return true; }
                                                    }, function (data) {
                                                        j++;
                                                        thiss.db.executeSql("update 'geo.photography' set issynchronized=? where uuid=?", [true, data.extra]);
                                                        if (j === length) {
                                                            alert("Se ha terminado de sincronizar", function () {
                                                                thiss.$btnSearch.trigger("click");
                                                            }, Main.TITLE, "Aceptar");
                                                        }
                                                    });
                                                };
                                                reader.readAsArrayBuffer(file);
                                            }, function (e) { console.log(e); });
                                        }, function (e) { console.log(e); });
                                    })(i);
                                }
                            });
                        };
                    }
                    Main.prototype.initConfig = function () {
                    };
                    Main.prototype.formConfig = function () {
                        var options = { formJS: this.js.module.subModule.path + "form2.js" };
                        //var options = { formJS: this.js.path + "minedu/edan/form2.js" };
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
                        this.$btnClean = this.$main.find('#btnClean');
                        this.$btnPrint = this.$main.find('#btnPrint');
                        this.$txtStartDate = this.$main.find('#txtStartDate');
                        this.$txtEndDate = this.$main.find('#txtEndDate');
                        this.$txtDescription = this.$main.find('#txtDescription');
                        this.$table = this.$main.find('#tblResult');
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                        var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                        this.$main.find(">.panel-body").css("height", height).css("overflow", "auto");
                        thiss.$table.find('>thead input[name=chkAll]').off("change");
                        thiss.$table.find('>thead input[name=chkAll]').on("change", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if ($(this).is(':checked'))
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', true);
                            else
                                thiss.$table.find('>tbody input[type=checkbox]').prop('checked', false);
                        });
                        thiss.$table.off("doubletap");
                        thiss.$table.on("doubletap", ">tbody>tr", function (e) {
                            var id = jQuery(this).attr("data-uniqueid");
                            thiss.formm.load(id, { containerMain: thiss.$main });
                        });
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
                        thiss.$btnSearch.off("click");
                        thiss.$btnSearch.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.search();
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnCloud.off("click");
                        thiss.$btnCloud.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.synchronize();
                        });
                        thiss.$btnPrint.off("click");
                        thiss.$btnPrint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.print();
                        });
                        this.$btnSearch.trigger("click");
                    };
                    Main.prototype.delete = function (url, id, options, callback) {
                        var thiss = this;
                        var ids = com.jtm.helper.Table.getItems(this.$table, true, false);
                        if (ids.length === 0) {
                            window.plugins.toast.showLongBottom("No hay elementos seleccionados para eliminar");
                            return;
                        }
                        confirm("¿Desea eliminar el elemento?", function (buttonId) {
                            if (buttonId === 1) {
                                thiss.db = thiss.openDatabase();
                                thiss.db.transaction(function (tx) {
                                    tx.executeSql('delete from "geo.photography" where id in ('+ids.join()+')', []);
                                }, function (error) {
                                    window.plugins.toast.showLongBottom("Error:" + error);
                                }, function () {
                                    window.plugins.toast.showLongBottom("Se ha eliminado el registro");
                                    thiss.$btnSearch.trigger('click');
                                });
                            }
                        }, Main.TITLE, ["Aceptar", "Cancelar"]);
                    };
                    Main.prototype.uiConfig = function () {
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        thiss.$table.find('>tbody').empty();
                        var html = '';
                        this.db = this.openDatabase();
                        this.db.readTransaction(function (tx) {
                            tx.executeSql('SELECT * FROM "geo.photography" where lower(description) LIKE  "%'+thiss.$txtDescription.string().toLowerCase()+'%" order by registrationdate desc', [], function (tx, rs) {
                                var length = rs.rows.length;
                                for (var i = 0; i < length; i++) {
                                    html += '<tr data-uniqueid=' + rs.rows.item(i).id + '>';
                                    html += '<td><input type="checkbox" value="' + rs.rows.item(i).id + '"/></td>';
                                    html += '<td><p>' + rs.rows.item(i).description + '</p><b>' + new Date(rs.rows.item(i).registrationdate).toString(Main.DATETIMEFORMAT) + '</b></td>';
                                    if (rs.rows.item(i).issynchronized == "false")
                                        html += '<td><i class="glyphicon glyphicon-alert" style="color:red !important;font-size:24px"></i></td>';
                                    else
                                        html += '<td><i class="glyphicon glyphicon-ok" style="color:green !important;font-size:24px"></i></td>';
                                    html += '</tr>';
                                };
                                thiss.$table.find('>tbody').append(html);
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
                        this.$txtDescription.val('');
                        this.$table.find('>tbody').empty();
                    };
                    Main.prototype.setModule = function (jsonFile, options) {
                        options = { refactorized: true };
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "", { module: "geometry", subModule: 'geophoto' });
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(geometry.BaseGeometry);
                geophoto.Main = Main;
            })(geometry.geophoto || (geometry.geophoto = {}));
            var geophoto = geometry.geophoto;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.geometry.geophoto.Main.execute();