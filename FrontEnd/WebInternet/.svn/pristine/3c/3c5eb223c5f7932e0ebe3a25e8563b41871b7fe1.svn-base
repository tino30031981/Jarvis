function getInstance() {
    return com.jtm.minedu.edan.Form.execute();
}
(function (com) {
    (function (jtm) {
        (function (minedu) {
            (function (edan) {
                var Form = (function (_super) {
                    __extends(Form, _super);
                    function Form() {
                        _super.call(this);
                        this.$pagerItems = null;
                        this.$divReport = null;
                        this.$btnShare = null;
                        this.contentCSVReport = function () {
                            var thiss = this;
                            var csv = 'Evaluación del petitorio minero ' + '\r\n\r\n';
                            var $divs = thiss.$divReport.find(".form-group");
                            $divs.toArray().forEach(function (div) {
                                csv += jQuery(div).find('label').text() + "," + jQuery(div).find("p").text() + '\r\n';
                            });
                            csv += '\r\n';
                            var $tables = thiss.$divReport.find("table");
                            $tables.toArray().forEach(function (table) {
                                csv += jQuery(table).find("caption").text() + '\r\n';
                                jQuery(table).find(">thead>tr>th").toArray().forEach(function (th) {
                                    csv += jQuery(th).text() + ",";
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n';
                                jQuery(table).find(">tbody>tr").toArray().forEach(function (tr) {
                                    jQuery(tr).find(">td").toArray().forEach(function (td) {
                                        csv += jQuery(td).text() + ",";
                                    });
                                    csv += '\r\n';
                                });
                                jQuery(table).find(">tfoot>tr>td").toArray().forEach(function (td) {
                                    csv += jQuery(td).text() + ",";
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n' + '\r\n';
                            });
                            return csv;
                        };
                        this.contentCSV = function () {
                            var thiss = this;
                            var coordinates = thiss.$tableCoordinates.find('tbody').html().replace(/^<tr><td>/, '[[[').replace(/<\/td><\/tr>$/, ']]]').replace(/<\/td><\/tr><tr><td>/g, '],[').replace(/<\/td><td>/g, ',');
                            coordinates = JSON.parse(coordinates);
                            for (var i = 0; i < coordinates[0].length; i++) {
                                coordinates[0][i] = coordinates[0][i].slice(1);
                            }
                            coordinates[0].push(coordinates[0][0]);
                            var srid = thiss.$tableCoordinates.find('tfoot>tr>td:last').text();
                            var csv = 'Vért.,Este(X),Norte(Y),SRID\r\n';
                            var i = 0;
                            for (i = 0; i < coordinates[0].length - 1; i++) {
                                csv += (i + 1) + "," + coordinates[0][i][0] + "," + coordinates[0][i][1] + "," + srid + '\r\n';
                            }
                            return csv;
                        };

                        this.shareData = function ($obj) {
                            var thiss = this;
                            thiss.$divReport.hide();
                            var item = thiss.viewer.getDataById(0);
                            if (item === null || !(item.coordinates instanceof Array) || !(item.coordinates[0] instanceof Array)) {
                                window.plugins.toast.showLongBottom("No hay petitorio minero");
                                $obj.removeClass(Form.ACTIVE);
                                return;
                            }
                            thiss.viewer.fitExtent(0);
                            var csv = thiss.contentCSV();
                            var csvReport = thiss.contentCSVReport();
                            var kml = thiss.viewer.contentKML('Polygon', [], 0, true, {
                                folderName: id
                            });
                            var fileName = "coordenadas_" + thiss.getUUID();
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directory) {
                                directory.getFile('report_' + fileName + ".csv", { create: true }, function (fileEntryReport) {
                                    fileEntryReport.createWriter(function (fileWriter) {
                                        fileWriter.seek(fileWriter.length);
                                        var blob = new Blob([csv], { type: 'text/csv' });
                                        fileWriter.write(blob);
                                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directory) {
                                            directory.getFile(fileName + ".csv", { create: true }, function (fileEntry) {
                                                fileEntry.createWriter(function (fileWriter) {
                                                    fileWriter.seek(fileWriter.length);
                                                    var blob = new Blob([csv], { type: 'text/csv' });
                                                    fileWriter.write(blob);
                                                    directory.getFile(fileName + ".kml", { create: true }, function (fileEntry2) {
                                                        fileEntry2.createWriter(function (fileWriter2) {
                                                            fileWriter2.seek(fileWriter2.length);
                                                            fileWriter2.write(kml);
                                                            var canvas = thiss.$map.find('canvas')[0];
                                                            canvas.toBlob(function (blob) {
                                                                var $img = $('<img />');
                                                                $img.addClass("img-responsive");
                                                                $img.css("z-index", 99999999);
                                                                var url = URL.createObjectURL(blob);
                                                                $img.on("load", function () {
                                                                    URL.revokeObjectURL(url);
                                                                });
                                                                thiss.$map.find("canvas").closest("div").prepend($img);
                                                                $img.attr("src", url);
                                                                thiss.$divOption.hide();
                                                                setTimeout(function () {
                                                                    navigator.screenshot.save(function (error, response) {
                                                                        $img.remove();
                                                                        thiss.$divOption.show();
                                                                        if (error) {
                                                                            window.plugins.toast.showLongBottom(error);
                                                                            return;
                                                                        } else {
                                                                            response.filePath = 'file://' + response.filePath;
                                                                            window.plugins.socialsharing.shareViaEmail('Te envío una captura de pantalla del petitorio minero',
                                                                                'Sigemin Mobile',
                                                                                null, null, null, [fileEntry.toURL(), fileEntry2.toURL(), response.filePath, fileEntryReport.toURL()],
                                                                                function (success) {
                                                                                    window.resolveLocalFileSystemURL(fileEntry.toURL(), function (fe) {
                                                                                        fe.remove(null, null);
                                                                                    });
                                                                                    window.resolveLocalFileSystemURL(fileEntry2.toURL(), function (fe) {
                                                                                        fe.remove(null, null);
                                                                                    });
                                                                                    //window.resolveLocalFileSystemURL(response.filePath, function (fe) {
                                                                                    //    fe.remove(null, null);
                                                                                    //});
                                                                                    window.resolveLocalFileSystemURL(fileEntryReport.toURL(), function (fe) {
                                                                                        fe.remove(null, null);
                                                                                    });
                                                                                    thiss.$divOption.hide();
                                                                                },
                                                                                function (error) { }
                                                                            );
                                                                        }
                                                                    }, 'png', 100, fileName);
                                                                }, 1000);
                                                            });
                                                        }, fail);
                                                    });
                                                }, fail);
                                            });
                                        });
                                    }, fail);
                                });
                            });
                            function fail(error) {
                                window.plugins.toast.showLongBottom(error);
                            }
                        };
                    }
                    Form.prototype.attachmentConfig = function () {
                    };
                    Form.prototype.domConfig = function () {
                        this.$form = this.$form.find('>.panel');
                        this.$btnSave = this.$form.find('#btnSave');
                        this.$btnReport = this.$form.find('#btnReport');
                        this.$btnShare = this.$form.find('#btnShare');
                        this.$btnClose = this.$form.find('#btnClose');
                        this.$btnClean = this.$form.find('#btnClean');
                        this.$hdnId = this.$form.find(Form.HDNID);
                        this.$txtName = this.$form.find(Form.TXTNAME);
                        this.$pagerItems = this.$form.find(">.panel-body>.pager-item");
                        this.$subTitle = this.$header.find(Form.DOMSUBTITLE);
                    };
                    Form.prototype.viewConfig = function () {
                        var heightHeader = this.$form.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$form.find('>.panel-footer').outerHeight(true) || 0;
                        var height = this._heightWindow - (2 + this._heightHeader + this._heightFooter + heightHeader + heightFooter);
                        this.$form.find(">.panel-body").css("height", height).css("overflow", "auto");
                        this.formPager(this.$form.find(">.panel-body"));
                    };
                    Form.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        options = options || {};
                        thiss.$btnSave.off("click");
                        thiss.$btnSave.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.save(options.urlSave);
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function () {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnShare.off("click");
                        thiss.$btnShare.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.shareData(jQuery(this));
                        });
                    };
                    Form.prototype.spatialConfig = function () {
                        var options = { spatialJSFile: this.js.module.subModule.path + this.js.apigeo.path + "formmap2" };
                        _super.prototype.spatialConfig.call(this, options);
                    };
                    Form.prototype.uiConfig = function () {
                        var $panels = this.$form.find(">.panel-body>.pager-item");
                        $panels.hide();
                        $panels.eq(1).show();
                        var heightHeader = this.$form.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$form.find('>.panel-footer').outerHeight(true) || 0;
                        var height = this._heightWindow - (2 + this._heightHeader + this._heightFooter + heightHeader + heightFooter);
                        this.viewer.load(this.$form, { heightMap: height });
                        $panels.hide();
                        $panels.first().show();
                    };
                    Form.prototype.callbackFormPager = function ($pagerItem) {
                        this.$subTitle.text($pagerItem.data('subtitle'));
                    };
                    Form.prototype.onCloseButton = function (options) {
                        var thiss = this;
                        confirm("¿Desea cancelar el EDAN actual?", function (buttonIndex) {
                            if (buttonIndex == 1) {
                                thiss.$subTitle.text(thiss.$main.data('subtitle'));
                                thiss.cleanControls(true);
                                thiss.$form.empty().hide();
                                thiss.$main.show();
                                thiss.$main.find(Form.BTNSEARCH).trigger("click");
                            }
                        }, Form.TITLE, ["Si", "No"]);
                    };
                    Form.prototype.load = function (id) {
                        var thiss = this;
                        _super.prototype.load.call(this, com.jtm.Server.contextPath + "areas/minedu/edan/_form.html", id, {
                            callbackClose: thiss.callbackClose
                        });
                    };
                    Form.prototype.save = function (url, data, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        var itemGeometry = thiss.viewer.getDataById(0);
                        if (options.validate() === false)
                            return;
                        prompt("Ingrese el nombre", function (result) {
                            if (result.buttonIndex === 2) return;
                            data = {
                                id: thiss.$hdnId.int32(),
                                name: result.input1,
                                state: true,
                                spatialReference: itemGeometry.spatialReference,
                                coordinates: itemGeometry.coordinates
                            };
                            var geometry = { spatialReference: itemGeometry.spatialReference };
                            geometry.coordinates = itemGeometry.coordinates;
                            geometry = JSON.stringify(geometry);
                            thiss.db = thiss.openDatabase();
                            thiss.db.transaction(function (tx) {
                                if (data.id === 0)
                                    tx.executeSql('INSERT INTO "mc.edan"(name,uuid,geometry,spatialreferenceid,registrationdate,state,issynchronized) VALUES (?,?,?,?,?,?,?)',
                                        [data.name, thiss.getUUID(), geometry, data.spatialReference.id, Date.now(), true, false],
                                        function (tx, response) {
                                            thiss.$hdnId.val(response.insertId);
                                        });
                                else
                                    tx.executeSql('UPDATE "mc.edan" SET name=?,geometry=?,spatialreferenceid=?,registrationdate=?, state=? where id=?', [thiss.$txtName, geometry, data.spatialReference.id, Date.now(), true, data.id]);
                            }, function (error) {
                                window.plugins.toast.showLongBottom("Error:" + error);
                            }, function () {
                                confirm("Ha terminado de llenar el registro ¿Desea llenar otro registro?", function (buttonIndex) {
                                    if (buttonIndex == 1) {
                                        thiss.$main.find(Form.BTNINSERT).trigger("click");
                                    }
                                    else if (buttonIndex == 2) {
                                        thiss.$form.empty().hide();
                                        thiss.$main.show();
                                        thiss.$main.find(Form.BTNSEARCH).trigger("click");
                                    }
                                }, Form.TITLE, ["Si", "No"]);
                            });
                        }, "Petitorio minero", ["Aceptar", "Cancelar"], thiss.$txtName.val() || 'Petitorio minero');
                        function validate() {
                            var success = true;
                            var message = '';
                            if (itemGeometry === null || itemGeometry.coordinates[0].length < 4) {
                                success = false;
                                message = "No existe aún el petitorio minero";
                            }
                            if (message !== '')
                                window.plugins.toast.showLongBottom(message);
                            return success;
                        }
                    };
                    Form.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        this.db = this.openDatabase();
                        thiss.db.executeSql('SELECT mr.* FROM "mc.edan" as mr where mr.id=?', [id], function (rs) {
                            thiss.$hdnId.val(rs.rows.item(0).id);
                            thiss.$txtName.val(rs.rows.item(0).name);
                            thiss.viewer.coordinatesToMap(JSON.parse(rs.rows.item(0).coordinates), rs.rows.item(0).spatialreferenceid);
                        });
                    };
                    Form.prototype.cleanControls = function (toNull) {
                        this.viewer.cleanControls(toNull);
                    };
                    Form.execute = function () {
                        return new Form();
                    };
                    return Form;
                })(jtm.geometry.BaseGeometryForm);
                edan.Form = Form;
            })(minedu.edan || (minedu.edan = {}));
            var edan = minedu.edan;
        })(jtm.minedu || (jtm.minedu = {}));
        var minedu = jtm.minedu;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));