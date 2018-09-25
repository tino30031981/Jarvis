function getInstance() {
    return com.jtm.incidence.incidence.Form.execute();
}
(function (com) {
    (function (jtm) {
        (function (incidence) {
            (function (incidence) {
                var Form = (function (_super) {
                    __extends(Form, _super);
                    function Form() {
                        _super.call(this);
                        this.$pagerItems = null;
                        this.$divReport = null;
                        this.$btnShare = null;
                        this.$btnCaptureGeolocation = null;
                        this.$btnCapturePhoto = null;
                        this.$btnSelectedPhoto = null;
                        this.$img = null;
                        this.$ddlIncidenceType = null;
                        this.$txtInvolved = null;
                        this.$txtSuggestion = null;
                        this.$txtActionTaken = null;
                        this.$txtDate = null;
                        this.$txtTime = null;
                        this.listSpatialReferences = function () {
                            var sql = "select sr.id,(d.name || ' '  || ifnull(zone ,'')) as name from 'geo.spatialreference' as sr inner join 'geo.datum' as d ON sr.datumid =d.id;";
                            this.listDb(this.$ddlSpatialReference, sql);
                        };
                        this.capturePhoto = function () {
                            var thiss = this;
                            cordova.plugins.diagnostic.isCameraAvailable({
                                successCallback: function (available) {
                                    if (available === false) {
                                        window.plugins.toast.showLongBottom('La cámara no está disponible');
                                    } else {
                                        navigator.camera.getPicture(function (imageUri) {
                                            window.resolveLocalFileSystemURL(imageUri, function (fileEntry) {
                                                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                                                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem) {
                                                    fileEntry.copyTo(fileSystem, name, function (entry) {
                                                        thiss.$img.attr("src", entry.nativeURL);
                                                    }, function (error) {
                                                        window.plugins.toast.showLongBottom(error);
                                                    });
                                                },
                                                    function (error) {
                                                        window.plugins.toast.showLongBottom(error);
                                                    });
                                            }, function (error) {
                                                window.plugins.toast.showLongBottom(error);
                                            });
                                        }, function (error) { alert('Ocurrió un error: ' + error, null, "Cámara", "Aceptar"); }, {
                                            quality: 50,
                                            destinationType: Camera.DestinationType.FILE_URI,
                                            encodingType: Camera.EncodingType.JPEG,
                                            sourceType: Camera.PictureSourceType.CAMERA,
                                            mediaType: Camera.MediaType.PICTURE,
                                            allowEdit: false,
                                            correctOrientation: true,
                                            cameraDirection: Camera.Direction.BACK,
                                            saveToPhotoAlbum: true
                                        });
                                    }
                                },
                                errorCallback: function (error) {
                                    window.plugins.toast.showLongBottom('Ocurrió un error: ' + error);
                                },
                                externalStorage: true
                            });
                        };
                        this.selectedPhoto = function () {
                            var thiss = this;
                            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                                thiss.$img.attr("src", imageUri);
                            }, function (error) { console.log(error); }, {
                                quality: 50,
                                destinationType: Camera.DestinationType.FILE_URI,
                                encodingType: Camera.EncodingType.JPEG,
                                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                                mediaType: Camera.MediaType.PICTURE,
                                allowEdit: false,
                                correctOrientation: true
                            });
                        };
                        this.print = function () {
                            var thiss = this;
                            cordova.plugins.printer.check(function (avail, count) {
                                if (avail === true)
                                    cordova.plugins.printer.pick(function (uri) {
                                        thiss.printer(uri);
                                    });
                            });
                        };
                        this.printer = function (uri) {
                            var page = jQuery('html').html();
                            console.log(page);
                            //cordova.plugins.printer.print(page, 'Document.html');
                            cordova.plugins.printer.print(page, {
                                printerId: uri,
                                landscape: false, name: "Fotografía",
                                graystyle: false,
                                hideNumberOfCopies: false,
                                hidePaperFormat: false
                            }, function (response) {
                                alert(response ? 'Terminado' : 'Cancelado', null, "Impresión", "Aceptar");
                            });
                        };
                        this.buildSql = function (item) {
                            var fields = [];
                            var parameters = [];
                            var values = [];
                            function parse(data, prefix) {
                                for (var i in data) {
                                    if (typeof data[i] === "object")
                                        parse(data[i], i);
                                    else {
                                        fields.push((prefix + i).toLowerCase());
                                        parameters.push("?");
                                        values.push(data[i]);
                                    }
                                }
                            }
                            parse(data, "");
                            fields = fields.join(",");
                            parameters = parameters.join(",");
                            values = values.join(",");
                            var sql = "INSERT INTO incidence(" + fields + ") VALUES (" + parameters + ")";
                            return sql;
                        };
                        this.listIncidenceType = function () {
                            var sql = "select id, name from 'inc.incidencetype';";
                            this.listDb(this.$ddlIncidenceType, sql);
                        };
                        this.contentCSV = function () {
                            var thiss = this;
                            var csv = 'Reporte\r\n';
                            csv += 'Tipo,' + thiss.$ddlIncidenceType.getLabel() + '\r\n';
                            csv += 'Involucrado,' + thiss.$txtInvolved.string() + '\r\n';
                            csv += 'Sugerencia,' + thiss.$txtInvolved.string() + '\r\n';
                            csv += 'Acción tomada,' + thiss.$txtActionTaken.string() + '\r\n';
                            csv += 'Fecha,' + thiss.$txtDate.string() + '\r\n';
                            csv += 'Hora,' + thiss.$txtTime.string() + '\r\n';
                            csv += 'Descripción,' + thiss.$txaDescription.string() + '\r\n';
                            return csv;
                        };
                        this.shareData = function ($obj) {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) {
                                window.plugins.toast.showLongBottom("Todavía no ha guardado");
                                return;
                            }
                            thiss.viewer.fitExtent(0);
                            var csv = thiss.contentCSV();
                            var item = {
                                name: "Incidencia",
                                description: "Description",
                                attributes: {
                                    'Tipo': thiss.$ddlIncidenceType.getLabel(),
                                    'Involucrado': thiss.$txtInvolved.string(),
                                    'Sugerencia': thiss.$txtInvolved.string(),
                                    'Acción tomada': thiss.$txtActionTaken.string(),
                                    'Fecha': thiss.$txtDate.string(),
                                    'Hora': thiss.$txtTime.string(),
                                    'Descripción': thiss.$txaDescription.string()
                                },
                                geometry: null
                            };
                            var kml = thiss.viewer.getKML(item, {
                                folderName: id
                            });
                            var fileName = "incidencia_" + thiss.getUUID();
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directory) {
                                directory.getFile('report_' + fileName + ".csv", { create: true }, function (fileEntryReport) {
                                    fileEntryReport.createWriter(function (fileWriter) {
                                        fileWriter.seek(fileWriter.length);
                                        var blob = new Blob([csv], { type: 'text/csv' });
                                        fileWriter.write(blob);
                                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directory) {
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
                                                        thiss.$pagerItems.hide();
                                                        thiss.$divOption.hide();
                                                        setTimeout(function () {
                                                            navigator.screenshot.save(function (error, response) {
                                                                $img.remove();
                                                                thiss.$pagerItems.eq(0).show();
                                                                if (error) {
                                                                    window.plugins.toast.showLongBottom(error);
                                                                    return;
                                                                } else {
                                                                    response.filePath = 'file://' + response.filePath;
                                                                    window.plugins.socialsharing.shareViaEmail('Te envío una captura de pantalla del petitorio minero',
                                                                        'Sigemin Mobile',
                                                                        null, null, null, [fileEntry.toURL(), fileEntry2.toURL(), response.filePath, fileEntryReport.toURL(), thiss.$img.src],
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
                                        });
                                    }, fail);
                                });
                            });
                            function fail(error) {
                                window.plugins.toast.showLongBottom(error);
                            }
                        };
                    }
                    Form.prototype.domConfig = function () {
                        this.$subTitle = this.$header.find(Form.DOMSUBTITLE);
                        this.$form = this.$form.find('>.panel');
                        this.$btnSave = this.$form.find('#btnSave');
                        this.$btnReport = this.$form.find('#btnReport');
                        this.$btnShare = this.$form.find('#btnShare');
                        this.$btnClose = this.$form.find('#btnClose');
                        this.$btnClean = this.$form.find('#btnClean');
                        this.$btnCaptureGeolocation = this.$form.find('#btnCaptureGeolocation');
                        this.$btnCapturePhoto = this.$form.find('#btnCapturePhoto');
                        this.$btnSelectedPhoto = this.$form.find('#btnSelectedPhoto');
                        this.$ddlSpatialReference = this.$form.find('#ddlSpatialReference');
                        ////this.$hdnId = this.$form.find(Form.HDNID);
                        this.$txaDescription = this.$form.find('#txaDescription');
                        this.$pagerItems = this.$form.find(">.panel-body>.pager-item");
                        this.$img = this.$form.find('#imgPhoto');
                        this.$ddlIncidenceType = this.$form.find('#ddlIncidenceType');
                        this.$txtInvolved = this.$form.find('#txtInvolved');
                        this.$txtSuggestion = this.$form.find('#txtSuggestion');
                        this.$txtActionTaken = this.$form.find('#txtActionTaken');
                        this.$txtDate = this.$form.find('#txtDate');
                        this.$txtTime = this.$form.find('#txtTime');
                    };
                    Form.prototype.initConfig = function () {
                    };
                    Form.prototype.attachmentConfig = function () {
                    };
                    Form.prototype.viewConfig = function () {
                        var thiss = this;
                        var heightHeader = this.$form.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$form.find('>.panel-footer').outerHeight(true) || 0;
                        var height = this._heightWindow - (2 + this._heightHeader + this._heightFooter + heightHeader + heightFooter);
                        this.$form.find(">.panel-body").css("height", height).css("overflow", "auto");
                        var $labelCountChars = this.$form.find('#spnCountCharsDescription>label');
                        thiss.listIncidenceType();
                        thiss.$txaDescription.off("keyup");
                        thiss.$txaDescription.on("keyup", function (e) {
                            var newlines = ($(this).val().match(/\n/g) || []).length;
                            if (jQuery(this).val().length + newlines > jQuery(this).attr("maxlength"))
                                jQuery(this).val(jQuery(this).val().substr(0, jQuery(this).attr("maxlength") - newlines));
                            $labelCountChars.text(Form.COUNTCHARSMESSAGE - $(this).val().length);
                        });
                        $labelCountChars.text(Form.COUNTCHARSMESSAGE);
                        this.$txaDescription.attr("maxlength", Form.COUNTCHARSMESSAGE);
                        this.formPager(this.$form.find(">.panel-body"));
                        window.addEventListener('native.keyboardshow', function (e) {
                            thiss.$footer.hide();
                        });
                        window.addEventListener('native.keyboardhide', function (e) {
                            thiss.$footer.show();
                        });
                        if (thiss.$hdnId.int32() === 0) {
                            thiss.$txtDate.val(new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toString(thiss.config.date.format));
                            thiss.$txtTime.val(new Date().to24HourTimeString());
                        }
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
                        thiss.$btnCaptureGeolocation.off("click");
                        thiss.$btnCaptureGeolocation.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.captureGeolocation();
                        });
                        thiss.$btnCapturePhoto.off("click");
                        thiss.$btnCapturePhoto.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.capturePhoto();
                        });
                        thiss.$btnSelectedPhoto.off("click");
                        thiss.$btnSelectedPhoto.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.selectedPhoto();
                        });
                    };
                    Form.prototype.spatialConfig = function () {
                        var options = { spatialJSFile: this.js.module.subModule.path + this.js.apigeo.path + "formmap2" };      ///
                        _super.prototype.spatialConfig.call(this, options);
                    };
                    Form.prototype.uiConfig = function () {
                        var heightBody = this.$form.find('>.panel-body').outerHeight(true) || 0;
                        var heightPrev = this.$form.find('>.panel-body>.pager-item>#map').prev().outerHeight(true) || 0;
                        var height = heightBody - heightPrev;
                        this.viewer.load(this.$form.find('>.panel-body>.pager-item'), { heightMap: height });
                    };
                    Form.prototype.save = function (url, data, options, callback) {
                        var thiss = this;
                        var geometry = thiss.viewer.getGeometry();
                        var geometry2 = JSON.parse(geometry);
                        options = options || {};
                        options.validate = validate;
                        if (options.validate() === false)
                            return;
                        data = {
                            id: thiss.$hdnId.int32(),
                            description: thiss.$txaDescription.string(),
                            involved: this.$txtInvolved.string(),
                            suggestion: this.$txtSuggestion.string(),
                            actionTaken: this.$txtActionTaken.string(),
                            incidenceType: { id: this.$ddlIncidenceType.int32() },
                            date: this.$txtDate.string(),
                            time: this.$txtTime.string(),
                            spatialReference: geometry2.spatialReference,
                            state: true,
                            uuid: thiss.getUUID(),
                            document: { url: thiss.$img.attr("src") }
                        };
                        this.db = this.openDatabase();
                        this.db.transaction(function (tx) {
                            if (data.id === 0)
                                tx.executeSql('INSERT INTO "inc.incidence"(description,involved,suggestion,actiontaken,incidencetypeid,date,time,uuid,geometry,spatialreferenceid,documenturl,issynchronized,registrationdate,state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                    [data.description, data.involved, data.suggestion, data.actionTaken, data.incidenceType.id, data.date, data.time, thiss.getUUID(), geometry, data.spatialReference.id, data.document.url, false, Date.now(), true],
                                    function (tx, response) {
                                        thiss.$hdnId.val(response.insertId);
                                    });
                            else
                                tx.executeSql('UPDATE "inc.incidence" SET description=?, involved=?, suggestion=?, actiontaken=?, incidencetypeid=?, geometry=?, spatialreferenceid=?, documenturl=?, state=? where id=?', [data.description, data.involved, data.suggestion, data.actionTaken, data.incidenceType.id, geometry, data.spatialReference.id, data.document.url, true, data.id]);
                        }, function (error) {
                            window.plugins.toast.showLongBottom("Error:" + error);
                        }, function () {
                            confirm("Ha terminado de llenar el registro ¿Desea llenar otro registro?", function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    thiss.$main.find(Form.BTNINSERT).trigger("click");
                                }
                                else if (buttonIndex == 2) {
                                    thiss.$subTitle.text(thiss.$main.data('subtitle'));
                                    thiss.$form.empty().hide();
                                    thiss.$main.show();
                                    thiss.$main.find(Form.BTNSEARCH).trigger("click");
                                }
                            }, Form.TITLE, ["Si", "No"]);
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (String.isNullOrWhiteSpace(geometry) === true) {
                                success = false;
                                message = 'Por favor grafique o capture una geometría';
                            }
                            else if (thiss.$img.attr("src") === "") {
                                success = false;
                                message = 'Por favor capture o seleccione una foto';
                                thiss.$btnCapturePhoto.focus();
                            }
                            else if (thiss.$ddlIncidenceType.int32() === 0) {
                                success = false;
                                message = 'Por favor seleccione el tipo de incidencia';
                                thiss.$ddlIncidenceType.focus();
                            }
                            else if (thiss.$txtInvolved.string() === "") {
                                success = false;
                                message = "Ingrese la persona o empresa involucrada";
                                thiss.$txtInvolved.focus();
                            }
                            else if (thiss.$txtSuggestion.string() === "") {
                                success = false;
                                message = "Ingrese la sugerencia";
                                thiss.$txtSuggestion.focus();
                            }
                            else if (thiss.$txtActionTaken.string() === "") {
                                success = false;
                                message = "Ingrese la acción tomada";
                                thiss.$txtActionTaken.focus();
                            }
                            else if (thiss.$txtDate.string() === "") {
                                success = false;
                                message = "Ingrese la fecha";
                                thiss.$txtDate.focus();
                            }
                            else if (thiss.$txtTime.string() === "") {
                                success = false;
                                message = "Ingrese la hora";
                                thiss.$txtTime.focus();
                            }
                            else if (thiss.$txaDescription.string() === "") {
                                success = false;
                                message = 'Ingrese una descripción.';
                                thiss.$txaDescription.focus();
                            }
                            if (message !== '')
                                window.plugins.toast.showLongBottom(message);
                            return success;
                        }
                    };
                    Form.prototype.detail = function (url, id, options, callback) {
                        var thiss = this;
                        this.db = this.openDatabase();
                        this.db.readTransaction(function (tx) {
                            tx.executeSql('SELECT id, description, involved, suggestion, actiontaken, date, time, incidencetypeid, spatialreferenceid, geometry, registrationdate, state, documenturl FROM "inc.incidence" as i where id=?', [id], function (tx, rs) {
                                thiss.$hdnId.val(rs.rows.item(0).id);
                                thiss.$img.attr("src", rs.rows.item(0).documenturl);
                                thiss.$txaDescription.val(rs.rows.item(0).description);
                                thiss.$txtInvolved.val(rs.rows.item(0).involved);
                                thiss.$txtSuggestion.val(rs.rows.item(0).suggestion);
                                thiss.$txtActionTaken.val(rs.rows.item(0).actiontaken);
                                thiss.$txtDate.val(rs.rows.item(0).date);
                                thiss.$txtTime.val(rs.rows.item(0).time);
                                thiss.$ddlIncidenceType.val(rs.rows.item(0).incidencetypeid);
                                thiss.viewer.addGeometry(JSON.parse(rs.rows.item(0).geometry));
                            }, function (tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function (error) {
                            console.log('transaction error: ' + error.message);
                        }, function () {
                            console.log('transaction ok');
                        });
                    };
                    Form.prototype.callbackFormPager = function ($pagerItem) {
                        this.$subTitle.text($pagerItem.data('subtitle'));
                    };
                    Form.prototype.onCloseButton = function (options) {
                        var thiss = this;
                        confirm("¿Desea cancelar la incidencia actual?", function (buttonIndex) {
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
                        _super.prototype.load.call(this, com.jtm.Server.contextPath + "areas/incidence/incidence/_form.html", id, {    ///
                            callbackClose: thiss.callbackClose
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
                incidence.Form = Form;
            })(incidence.incidence || (incidence.incidence = {}));
            var incidence = incidence.incidence;
        })(jtm.incidence || (jtm.incidence = {}));
        var incidence = jtm.incidence;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));