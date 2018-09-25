function getInstance() {
    return com.jtm.geometry.geophoto.Form.execute();
}
(function(com) {
    (function(jtm) {
        (function(geometry) {
            (function(geophoto) {
                var Form = (function(_super) {
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
                        this.listSpatialReferences = function() {
                            var sql = "select sr.id,(d.name || ' '  || ifnull(zone ,'')) as name from 'geo.spatialreference' as sr inner join 'geo.datum' as d ON sr.datumid =d.id;";
                            this.listDb(this.$ddlSpatialReference, sql);
                        };
                        this.capturePhoto = function() {
                            var thiss = this;
                            cordova.plugins.diagnostic.isCameraAvailable(function(available) {
                                if (available === false) {
                                    alert('La cámara no está disponible', null, "Cámara", "Aceptar");
                                } else {
                                    navigator.camera.getPicture(function(imageUri) {
                                        console.log(imageUri);
                                        window.resolveLocalFileSystemURL(imageUri, function(fileEntry) {
                                            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                                            console.log(name);
                                            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem) {
                                                fileEntry.copyTo(fileSystem, name, function(entry) {
                                                    console.log(entry.nativeURL);
                                                    thiss.$img.attr("src", entry.nativeURL);
                                                }, function(error) {
                                                    window.plugins.toast.showLongBottom(error);
                                                });
                                            },
                                                function(error) {
                                                    window.plugins.toast.showLongBottom(error);
                                                });
                                        }, function(error) {
                                            window.plugins.toast.showLongBottom(error);
                                        });
                                    }, function(error) { alert('Ocurrió un error: ' + error, null, "Cámara", "Aceptar"); }, {
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
                            }, function(error) {
                                alert('Ocurrió un error: ' + error, null, "Cámara", "Aceptar");
                            });
                        };
                        this.selectedPhoto = function () {
                            var thiss = this;
                            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                                console.log(imageUri);
                                thiss.$img.attr("src", imageUri);
                            }, function(error) { console.log(error); }, {
                                    quality: 50,
                                    destinationType: Camera.DestinationType.FILE_URI,
                                    encodingType: Camera.EncodingType.JPEG,
                                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                                    mediaType: Camera.MediaType.PICTURE,
                                    allowEdit: false,
                                    correctOrientation: true
                                });
                        };
                        this.print = function() {
                            var thiss = this;
                            cordova.plugins.printer.check(function(avail, count) {
                                if (avail === true)
                                    cordova.plugins.printer.pick(function(uri) {
                                        thiss.printer(uri);
                                    });
                            });
                        };
                        this.printer = function(uri) {
                            var page = jQuery('html').html();
                            console.log(page);
                            //cordova.plugins.printer.print(page, 'Document.html');
                            cordova.plugins.printer.print(page, {
                                printerId: uri,
                                landscape: false, name: "Fotografía",
                                graystyle: false,
                                hideNumberOfCopies: false,
                                hidePaperFormat: false
                            }, function(response) {
                                alert(response ? 'Terminado' : 'Cancelado', null, "Impresión", "Aceptar");
                            });
                        };
                        this.buildSql = function(item) {
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
                            var sql = "INSERT INTO photography(" + fields + ") VALUES (" + parameters + ")";
                            return sql;
                        };
                    }
                    Form.prototype.domConfig = function() {
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
                        this.$hdnId = this.$form.find(Form.HDNID);
                        this.$txtName = this.$form.find(Form.TXTNAME);
                        this.$txaDescription = this.$form.find('#txaDescription');
                        this.$pagerItems = this.$form.find(">.panel-body>.pager-item");
                        this.$img = this.$form.find('#imgPhoto');
                        this.$subTitle = this.$header.find(Form.DOMSUBTITLE);
                    };
                    Form.prototype.initConfig = function() {
                    };
                    Form.prototype.attachmentConfig = function() {
                    };
                    Form.prototype.viewConfig = function() {
                        var thiss = this;
                        var heightHeader = this.$form.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$form.find('>.panel-footer').outerHeight(true) || 0;
                        var height = this._heightWindow - (2 + this._heightHeader + this._heightFooter + heightHeader + heightFooter);
                        this.$form.find(">.panel-body").css("height", height).css("overflow", "auto");
                        var $labelCountChars = this.$form.find('#spnCountCharsDescription>label');
                        thiss.listSpatialReferences();
                        thiss.$txaDescription.off("keyup");
                        thiss.$txaDescription.on("keyup", function(e) {
                            var newlines = ($(this).val().match(/\n/g) || []).length;
                            if (jQuery(this).val().length + newlines > jQuery(this).attr("maxlength"))
                                jQuery(this).val(jQuery(this).val().substr(0, jQuery(this).attr("maxlength") - newlines));
                            $labelCountChars.text(Form.COUNTCHARSMESSAGE - $(this).val().length);
                        });
                        $labelCountChars.text(Form.COUNTCHARSMESSAGE);
                        this.$txaDescription.attr("maxlength", Form.COUNTCHARSMESSAGE);
                        this.formPager(this.$form.find(">.panel-body"));
                        window.addEventListener('native.keyboardshow', function(e) {
                            thiss.$footer.hide();
                        });
                        window.addEventListener('native.keyboardhide', function(e) {
                            thiss.$footer.show();
                        });
                    };
                    Form.prototype.buttonConfig = function(options) {
                        var thiss = this;
                        options = options || {};
                        thiss.$btnSave.off("click");
                        thiss.$btnSave.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.save(options.urlSave);
                        });
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function() {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnShare.off("click");
                        thiss.$btnShare.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.shareData(jQuery(this));
                        });
                        thiss.$btnCaptureGeolocation.off("click");
                        thiss.$btnCaptureGeolocation.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.captureGeolocation();
                        });
                        thiss.$btnCapturePhoto.off("click");
                        thiss.$btnCapturePhoto.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.capturePhoto();
                        });
                        thiss.$btnSelectedPhoto.off("click");
                        thiss.$btnSelectedPhoto.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.selectedPhoto();
                        });
                    };
                    Form.prototype.spatialConfig = function() {
                        var options = { spatialJSFile: this.js.module.subModule.path + this.js.apigeo.path + "formmap2" };
                        _super.prototype.spatialConfig.call(this, options);
                    };
                    Form.prototype.uiConfig = function() {
                        var heightBody = this.$form.find('>.panel-body').outerHeight(true) || 0;
                        var heightPrev = this.$form.find('>.panel-body>.pager-item>#map').prev().outerHeight(true) || 0;
                        var height = heightBody - heightPrev;
                        this.viewer.load(this.$form.find('>.panel-body>.pager-item'), { heightMap: height });
                    };
                    Form.prototype.save = function(url, data, options, callback) {
                        var thiss = this;
                        var geometry = thiss.viewer.getGeometry();
                        options = options || {};
                        options.validate = validate;
                        if (options.validate() === false)
                            return;
                        data = {
                            id: thiss.$hdnId.int32(),
                            description: thiss.$txaDescription.string(),
                            spatialReference: { id: thiss.$ddlSpatialReference.int32() },
                            state: true,
                            uuid: thiss.getUUID(),
                            document: { url: thiss.$img.attr("src") }
                        };
                        this.db = this.openDatabase();
                        this.db.transaction(function(tx) {
                            if (data.id === 0)
                                tx.executeSql('INSERT INTO "geo.photography"(description,uuid,geometry,spatialreferenceid,documenturl,issynchronized,registrationdate,state) VALUES (?,?,?,?,?,?,?,?)',
                                    [data.description, thiss.getUUID(), geometry, data.spatialReference.id, data.document.url, false, Date.now(), true],
                                    function(tx, response) {
                                        thiss.$hdnId.val(response.insertId);
                                    });
                            else
                                tx.executeSql('UPDATE "geo.photography" SET description=?,geometry=?,spatialreferenceid=?,documenturl=?,registrationdate=?,state=? where id=?', [data.description, geometry, data.spatialReference.id, data.document.url, Date.now(), true, data.id]);
                        }, function(error) {
                            window.plugins.toast.showLongBottom("Error:" + error);
                        }, function() {
                            confirm("Ha terminado de llenar el registro ¿Desea llenar otro registro?", function(buttonIndex) {
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
                            if (geometry === null) {
                                success = false;
                                message = 'Por favor capture un punto';
                            }
                            else if (thiss.$ddlSpatialReference.int32 === 0) {
                                success = false;
                                message = 'Por favor seleccione la referencia espacial';
                                thiss.$ddlSpatialReference.focus();
                            }
                            else if (thiss.$img.attr("src") === "") {
                                success = false;
                                message = 'Por favor capture o seleccione una foto';
                                thiss.$btnCapturePhoto.focus();
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
                    Form.prototype.detail = function(url, id, options, callback) {
                        var thiss = this;
                        this.db = this.openDatabase();
                        this.db.readTransaction(function(tx) {
                            tx.executeSql('SELECT * FROM "geo.photography" where id=?', [id], function(tx, rs) {
                                thiss.$hdnId.val(rs.rows.item(0).id);
                                thiss.$ddlSpatialReference.val(rs.rows.item(0).spatialreferenceid);
                                thiss.$img.attr("src", rs.rows.item(0).documenturl);
                                thiss.$txaDescription.val(rs.rows.item(0).description);
                                thiss.viewer.addGeometry(JSON.parse(rs.rows.item(0).geometry));
                            }, function(tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function(error) {
                            console.log('transaction error: ' + error.message);
                        }, function() {
                            console.log('transaction ok');
                        });
                    };
                    Form.prototype.callbackFormPager = function($pagerItem) {
                        this.$subTitle.text($pagerItem.data('subtitle'));
                    };
                    Form.prototype.onCloseButton = function(options) {
                        var thiss = this;
                        confirm("¿Desea cancelar la geofoto actual?", function(buttonIndex) {
                            if (buttonIndex == 1) {
                                thiss.$subTitle.text(thiss.$main.data('subtitle'));
                                thiss.cleanControls(true);
                                thiss.$form.empty().hide();
                                thiss.$main.show();
                                thiss.$main.find(Form.BTNSEARCH).trigger("click");
                            }
                        }, Form.TITLE, ["Si", "No"]);
                    };
                    Form.prototype.load = function(id) {
                        var thiss = this;
                        _super.prototype.load.call(this, com.jtm.Server.contextPath + "areas/geometry/geophoto/_form.html", id, {
                            callbackClose: thiss.callbackClose
                        });
                    };
                    Form.prototype.cleanControls = function(toNull) {
                        this.viewer.cleanControls(toNull);
                    };
                    Form.execute = function() {
                        return new Form();
                    };
                    return Form;
                })(geometry.BaseGeometryForm);
                geophoto.Form = Form;
            })(geometry.geophoto || (geometry.geophoto = {}));
            var geophoto = geometry.geophoto;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));