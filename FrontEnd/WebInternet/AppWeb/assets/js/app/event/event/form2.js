function getInstance() {
    return com.jtm.event.event.Form.execute();
}
(function (com) {
    (function (jtm) {
        (function (event) {
            (function (event) {
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
                        this.$btnInsertInformationSource = null;
                        this.$img = null;
                        this.$ddlEventType = null;
                        this.$ddlLiftingMethod = null;
                        this.$ddlEventParent = null;
                        this.$ddlInformationSource = null;
                        this.$txtInformationSource = null;
                        this.$chkInformationSource = null;
                        this.$txtPlaceName = null;
                        this.$txtRiverName = null;
                        this.$txtInundationHeight = null;
                        this.$txtAffectedsNumber = null;
                        this.listSpatialReferences = function () {
                            var sql = "select sr.id,(d.name || ' '  || ifnull(zone ,'')) as name from 'geo.spatialreference' as sr inner join 'geo.datum' as d ON sr.datumid =d.id;";
                            this.listDb(this.$ddlSpatialReference, sql);
                        };
                        this.listTypes = function () {
                            var sql = "select id,name from 'evn.eventtype';";
                            this.listDb(this.$ddlEventType, sql);
                        };
                        this.listLiftingMethods = function () {
                            var sql = "select id,name from 'evn.liftingmethod';";
                            this.listDb(this.$ddlLiftingMethod, sql);
                        };
                        this.listEventParents = function () {
                            var sql = "select id,description as name, (case when eventtypeid is null then id else eventtypeid end) as eventtypeid " +
                                "from 'evn.eventtype' as e where e.state = 1 and e.eventtypeid is null order by id asc;";
                            this.listDb(this.$ddlEventParent, sql);
                        };
                        this.listEventByEvent = function (id) {
                            var sql = "select distinct id,name || '-' || description as name from 'evn.eventtype' where eventtypeid =" + id + ";";
                            this.listDb(this.$ddlEventType, sql);
                        };
                        this.listInformationSource = function () {
                            var sql = "select id,name from 'ge.informationsource' order by id desc;";
                            this.listDb(this.$ddlInformationSource, sql);
                        };
                        this.saveInformationSource = function () {
                            var thiss = this;
                            var options = {};
                            options.validate = validate;
                            var data = {
                                name: this.$txtInformationSource.val()
                            };
                            options.data = data;
                            if (options.validate() === false)
                                return;
                            this.db = this.openDatabase();
                            this.db.transaction(function (tx) {
                                tx.executeSql("INSERT INTO 'ge.informationsource'(name,description,registrationdate,state)  SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM  'ge.informationsource' WHERE name = ?)",
                                    [data.name, data.name, Date.now(), true, data.name],
                                    function (tx, response) {
                                        thiss.listInformationSource(response.insertId);
                                        thiss.$txtInformationSource.val('');
                                    });
                            }, function (error) {
                                window.plugins.toast.showLongBottom("Error:" + error);
                            }, function () {
                                window.plugins.toast.showLongBottom("Se ha guardado el registro");
                                thiss.$txtInformationSource.val("");
                                thiss.$chkInformationSource.attr("checked", false);
                                thiss.$chkInformationSource.trigger("change");
                            });
                            function validate() {
                                var success = true;
                                var message = '';
                                if (thiss.$txtInformationSource.string() === "") {
                                    success = false;
                                    message = 'Ingrese código UP.';
                                    thiss.$txtInformationSource.focus();
                                    return success;
                                }
                                if (message !== '')
                                    window.plugins.toast.showLongBottom(message);
                                return success;
                            }
                        };
                        this.capturePhoto = function () {
                            var thiss = this;
                            cordova.plugins.diagnostic.isCameraAvailable(function (available) {
                                if (available === false) {
                                    alert('La cámara no está disponible', null, "Cámara", "Aceptar");
                                } else {
                                    navigator.camera.getPicture(function (imageUri) {
                                        console.log(imageUri);
                                        window.resolveLocalFileSystemURL(imageUri, function (fileEntry) {
                                            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                                            console.log(name);
                                            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem) {
                                                fileEntry.copyTo(fileSystem, name, function (entry) {
                                                    console.log(entry.nativeURL);
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
                            }, function (error) {
                                alert('Ocurrió un error: ' + error, null, "Cámara", "Aceptar");
                            });
                        };
                        this.selectedPhoto = function () {
                            var thiss = this;
                            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                                console.log(imageUri);
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
                            var sql = "INSERT INTO photography(" + fields + ") VALUES (" + parameters + ")";
                            return sql;
                        };
                    }
                    Form.prototype.domConfig = function () {
                        this.$form = this.$form.find('>.panel');
                        this.$btnSave = this.$form.find('#btnSave');
                        this.$btnReport = this.$form.find('#btnReport');
                        this.$btnShare = this.$form.find('#btnShare');
                        this.$btnClose = this.$form.find('#btnClose');
                        this.$btnClean = this.$form.find('#btnClean');
                        this.$btnCaptureGeolocation = this.$form.find('#btnCaptureGeolocation');
                        this.$btnCapturePhoto = this.$form.find('#btnCapturePhoto');
                        this.$btnSelectedPhoto = this.$form.find('#btnSelectedPhoto');
                        this.$btnInsertInformationSource = this.$form.find('#btnInsertInformationSource');
                        this.$ddlSpatialReference = this.$form.find('#ddlSpatialReference');
                        this.$ddlInformationSource = this.$form.find('#ddlInformationSource');
                        this.$ddlEventParent = this.$form.find('#ddlEventParent');
                        this.$ddlEventType = this.$form.find('#ddlEventType');
                        this.$ddlLiftingMethod = this.$form.find('#ddlLiftingMethod');
                        this.$hdnId = this.$form.find(Form.HDNID);
                        this.$txtPlaceName = this.$form.find('#txtPlaceName');
                        this.$txtRiverName = this.$form.find('#txtRiverName');
                        this.$txtInundationHeight = this.$form.find('#txtInundationHeight');
                        this.$txtAffectedsNumber = this.$form.find('#txtAffectedsNumber');
                        this.$txaDescription = this.$form.find('#txaDescription');
                        this.$txtInformationSource = this.$form.find('#txtInformationSource');
                        this.$chkInformationSource = this.$form.find('#chkInformationSource');
                        this.$pagerItems = this.$form.find(">.panel-body>.pager-item");
                        this.$img = this.$form.find('#imgPhoto');
                        this.$subTitle = this.$header.find(Form.DOMSUBTITLE);
                    };
                    Form.INUNDATIONTYPE = '.inundation-type';
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
                        this.formPager(this.$form.find(">.panel-body"));
                        var $labelCountChars = this.$form.find('#spnCountCharsDescription>label');
                        thiss.listSpatialReferences();
                        thiss.listTypes();
                        thiss.listLiftingMethods();
                        thiss.listEventParents();
                        thiss.listInformationSource();
                        thiss.$txaDescription.off("keyup");
                        thiss.$txaDescription.on("keyup", function (e) {
                            var newlines = ($(this).val().match(/\n/g) || []).length;
                            if (jQuery(this).val().length + newlines > jQuery(this).attr("maxlength"))
                                jQuery(this).val(jQuery(this).val().substr(0, jQuery(this).attr("maxlength") - newlines));
                            $labelCountChars.text(Form.COUNTCHARSMESSAGE - $(this).val().length);
                        });
                        $labelCountChars.text(Form.COUNTCHARSMESSAGE);
                        this.$txaDescription.attr("maxlength", Form.COUNTCHARSMESSAGE);
                        thiss.$ddlEventParent.off("change");
                        thiss.$ddlEventParent.on("change", function (e) {
                            thiss.listEventByEvent(jQuery(this).val());
                            if (jQuery(this).int32() === 3)
                                thiss.$form.find(Form.INUNDATIONTYPE).show();
                            else
                                thiss.$form.find(Form.INUNDATIONTYPE).hide();
                        });
                        thiss.$txtInundationHeight.off("keyup");
                        thiss.$txtInundationHeight.on("keyup", function (key) {
                            var length = jQuery(this).string().length;
                            var max = jQuery(this).attr("maxlength");
                            if (length > max)
                                jQuery(this).val(jQuery(this).val().substr(0, (jQuery(this).val().length - 1)));

                        });
                        thiss.$txtAffectedsNumber.off("keyup");
                        thiss.$txtAffectedsNumber.on("keyup", function (key) {
                            var length = jQuery(this).string().length;
                            var max = jQuery(this).attr("maxlength");
                            if (length > max)
                                jQuery(this).val(jQuery(this).val().substr(0, (jQuery(this).val().length - 1)));

                        });
                        thiss.$chkInformationSource.off("change");
                        thiss.$chkInformationSource.on("change", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (jQuery(this).is(":checked")) {
                                thiss.$ddlInformationSource.removeClass("show").addClass("hidden");
                                thiss.$txtInformationSource.removeClass("hidden").addClass("show");
                                thiss.$btnInsertInformationSource.attr("disabled", false);
                                thiss.$form.find('#informationSourceHelp').text("Ingrese el nombre de la fuente y presione [+] para registrar");
                            }
                            else {
                                thiss.$txtInformationSource.removeClass("show").addClass("hidden");
                                thiss.$ddlInformationSource.removeClass("hidden").addClass("show");
                                thiss.$btnInsertInformationSource.attr("disabled", true);
                                thiss.$form.find('#informationSourceHelp').text("Seleccione una fuente de información");
                            }
                        });
                        window.addEventListener('native.keyboardshow', function (e) {
                            thiss.$footer.hide();
                        });
                        window.addEventListener('native.keyboardhide', function (e) {
                            thiss.$footer.show();
                        });
                        jQuery(window).on("resize", function (e) {
                            setTimeout(function () { console.log(0); thiss.viewer.reposition(); }, 200);
                        });
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
                        thiss.$btnInsertInformationSource.off("click");
                        thiss.$btnInsertInformationSource.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.saveInformationSource();
                        });
                    };
                    Form.prototype.spatialConfig = function () {
                        var options = { spatialJSFile: this.js.module.subModule.path + this.js.apigeo.path + "formmap2" };
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
                            placeName: thiss.$txtPlaceName.string(),
                            riverName: thiss.$txtRiverName.string(),
                            inundationHeight: thiss.$txtInundationHeight.number() || 0,
                            affectedsNumber: thiss.$txtAffectedsNumber.int32() || 0,
                            informationSource: { id: thiss.$ddlInformationSource.int32() },
                            eventType: { id: thiss.$ddlEventType.int32() },
                            liftingMethod: { id: thiss.$ddlLiftingMethod.int32() },
                            description: thiss.$txaDescription.string(),
                            state: true,
                            spatialReference: { id: Form.SRIDDEFAULTAPP },// { id: thiss.$ddlSpatialReference.int32() },
                            uuid: thiss.getUUID(),
                            document: { url: thiss.$img.attr("src") }
                        };
                        this.db = this.openDatabase();
                        this.db.transaction(function (tx) {
                            if (data.id === 0)
                                tx.executeSql('INSERT INTO "evn.event"(placename,rivername,description,inundationheight,affectedsnumber,uuid,geometry,spatialreferenceid,informationsourceid,eventtypeid,liftingmethodid,documenturl,registrationdate,state,issynchronized) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                    [data.placeName, data.riverName, data.description, data.inundationHeight, data.affectedsNumber, data.uuid, geometry, data.spatialReference.id, data.informationSource.id, data.eventType.id, data.liftingMethod.id, data.document.url, Date.now(), true, false],
                                    function (tx, response) {
                                        thiss.$hdnId.val(response.insertId);
                                    });
                            else
                                tx.executeSql('UPDATE "evn.event" SET placename=?,rivername=?,description=?,inundationheight=?,affectedsnumber=?,geometry=?,spatialreferenceid=?,informationsourceid=?,eventtypeid=?,liftingmethodid=?,documenturl=?,registrationdate=?, state=? where id=?', [data.placeName, data.riverName, data.description, data.inundationHeight, data.affectedsNumber, geometry, data.spatialReference.id, data.informationSource.id, data.eventType.id, data.liftingMethod.id, data.document.url, Date.now(), true, data.id]);
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
                            if (String.isNullOrWhiteSpace(geometry)===true || geometry2.coordinates[0].length < 3) {
                                success = false;
                                message = " No hay los puntos requeridos para generar el polígono";
                            }
                            else if (thiss.$txtPlaceName.string() === "") {
                                success = false;
                                message = 'Ingrese el lugar.';
                                thiss.$txtPlaceName.focus();
                            }
                            else if (thiss.$ddlEventType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de evento';
                                thiss.$ddlEventType.focus();
                            }
                            else if (thiss.$chkInformationSource.is(":checked")) {
                                success = false;
                                message = 'La fuente no ha sido agregado, presione en boton [+] para registrar';
                                thiss.$chkInformationSource.focus();
                            }
                            else if (thiss.$ddlInformationSource.int32() === 0) {
                                success = false;
                                message = 'Seleccione la fuente';
                                thiss.$ddlInformationSource.focus();
                            }
                            else if (thiss.$ddlLiftingMethod.int32() === 0) {
                                success = false;
                                message = 'Seleccione el método de levantamiento';
                                thiss.$ddlLiftingMethod.focus();
                            }
                            else if (thiss.$txaDescription.string() === "") {
                                success = false;
                                message = 'Ingrese una descripción.';
                                thiss.$txaDescription.focus();
                            }
                            else if (thiss.$img.attr("src") === "") {
                                success = false;
                                message = 'Por favor capture o seleccione una foto';
                                thiss.$btnCapturePhoto.focus();
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
                            tx.executeSql('SELECT evn.*,is1.id as informationsourceid,et.eventtypeid as eventparentid FROM "evn.event" as evn inner join "ge.informationsource" as is1 on is1.id=evn.informationsourceid inner join "evn.eventtype" as et on et.id=evn.eventtypeid inner join "evn.eventtype" as et2 on et2.id=et.eventtypeid where evn.id=?', [id], function (tx, rs) {
                                thiss.$hdnId.val(rs.rows.item(0).id);
                                thiss.$txtPlaceName.val(rs.rows.item(0).placename);
                                thiss.$txtRiverName.val(rs.rows.item(0).rivername);
                                thiss.$txtInundationHeight.val(rs.rows.item(0).inundationheight);
                                thiss.$txtAffectedsNumber.val(rs.rows.item(0).affectedsnumber);
                                thiss.$txaDescription.val(rs.rows.item(0).description);
                                thiss.$ddlSpatialReference.val(rs.rows.item(0).spatialreferenceid);
                                thiss.$ddlInformationSource.val(rs.rows.item(0).informationsourceid);
                                thiss.$ddlEventParent.val(rs.rows.item(0).eventparentid);
                                if (parseInt(rs.rows.item(0).eventparentid) === 3)
                                    thiss.$form.find(Form.INUNDATIONTYPE).show();
                                else
                                    thiss.$form.find(Form.INUNDATIONTYPE).hide();
                                thiss.listEventByEvent(rs.rows.item(0).eventparentid);
                                thiss.$ddlEventType.val(rs.rows.item(0).eventtypeid);
                                thiss.$ddlLiftingMethod.val(rs.rows.item(0).liftingmethodid);
                                thiss.$img.attr("src", rs.rows.item(0).documenturl);
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
                        confirm("¿Desea cancelar la geofoto actual?", function (buttonIndex) {
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
                        _super.prototype.load.call(this, com.jtm.Server.contextPath + "areas/event/event/_form.html", id, {
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
                event.Form = Form;
            })(event.event || (event.event = {}));
            var event = event.event;
        })(jtm.event || (jtm.event = {}));
        var event = jtm.event;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));