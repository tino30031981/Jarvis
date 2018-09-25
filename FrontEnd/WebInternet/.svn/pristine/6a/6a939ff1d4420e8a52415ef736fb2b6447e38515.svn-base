(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (geophoto) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "geo";
                        this.geometry = {};
                        this.listSpatialReferences = function () {
                            var sql = "select sr.id,(d.name || ' '  || ifnull(zone ,'')) as name from 'geo.spatialreference' as sr inner join 'geo.datum' as d ON sr.datumid =d.id;";
                            this.listDb('#ddlSpatialReference', sql);
                        };
                        this.detailTrash = function () {
                            jQuery('#txtX').val(0);
                            jQuery('#txtY').val(0);
                            jQuery('#txtZ').val(0);
                        };
                        this.detailMapClick = function (geometry) {
                            var thiss = this;
                            var sridTo = jQuery('#ddlSpatialReference').int32();
                            thiss.populateCoordinate(geometry, sridTo);
                        };
                        this.populateCoordinate = function (geometry, sridTo) {
                            var thiss = this;
                            if (geometry === undefined || geometry === null || geometry.coordinates === undefined || geometry.coordinates === null) return;
                            thiss.geometry = geometry;
                            var coordinatesView = thiss.project(geometry.coordinates, geometry.spatialReference.id, sridTo);
                            var coordinatesMap = thiss.project(geometry.coordinates, geometry.spatialReference.id, Main.SRIDDEFAULTMAP);
                            jQuery('#txtX').val(sridTo === Main.SRIDDEFAULTGPS ? coordinatesView[0] : coordinatesView[0].toFixed(thiss.config.number.decimalCount));
                            jQuery('#txtY').val(sridTo === Main.SRIDDEFAULTGPS ? coordinatesView[1] : coordinatesView[1].toFixed(thiss.config.number.decimalCount));
                            jQuery('#txtZ').val(geometry.extraData.accuracy.toFixed(2));
                            jQuery('#ddlSpatialReference').val(sridTo);
                            var json = thiss.viewer.buildJSON(Main.OGCTYPES.POINT, coordinatesMap, Main.SRIDDEFAULTMAP);
                            thiss.viewer.addFeaturesDetail(json);
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
                                                    var $img = jQuery('#imgPhoto');
                                                    $img.attr("src", entry.nativeURL);
                                                }, function (error) {
                                                    alert(error, null, Main.TITLE);
                                                });
                                            },
                                                function (error) {
                                                    alert(error, null, Main.TITLE);
                                                });
                                        }, function (error) {
                                            alert(error, null, Main.TITLE);
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
                            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                                console.log(imageUri);
                                var $img = jQuery('#imgPhoto');
                                $img.attr("src", imageUri);
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
                            jQuery('#tblResult>tbody>tr input:checkbox').toArray().forEach(function (chk) {
                                if (jQuery(chk).is(":checked") === true)
                                    ids.push(jQuery(chk).val());
                            });
                            if (ids.length === 0) {
                                alert("No ha seleccionado ningún elemento para sincronizar", null, Main.TITLE, "Aceptar");
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
                                                type: 'Point',
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
                                                    console.log(data.uuid);
                                                    thiss.ajax({
                                                        data: data,
                                                        attachments: attachments,
                                                        url: thiss.config.restServer + "geometry/photography/save",
                                                        async: true,
                                                        validate: function () { return true; }
                                                    }, function (data) {
                                                        j++;
                                                        console.log(data.extra);
                                                        thiss.db.executeSql("update 'geo.photography' set issynchronized=? where uuid=?", [true, data.extra]);
                                                        if (j === length) {
                                                            alert("Se ha terminado de sincronizar", function () {
                                                                jQuery('#btnSearch').trigger("click");
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
                        var thiss = this;
                        this.datePicker('#txtDateStart');
                        this.datePicker('#txtDateEnd');
                        jQuery('#tblResult>thead input[name=chkAll]').off("change");
                        jQuery('#tblResult>thead input[name=chkAll]').on("change", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if ($(this).is(':checked'))
                                $("#tblResult>tbody input[type=checkbox]").prop('checked', true);
                            else
                                $("#tblResult>tbody input[type=checkbox]").prop('checked', false);
                        });
                        thiss.search();
                        jQuery('#tblResult').off("doubletap");
                        jQuery('#tblResult').on("doubletap", ">tbody>tr", function (e) {
                            var id = jQuery(this).attr("data-uniqueid");
                            jQuery('#btnUpdate').trigger('click');
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        Main.initialize = false;
                        thiss.geometry = {};
                        options = {};
                        options.container = '#divDetail';
                        options.dialog = { title: "Fotografía" };
                        options.callback = function () {
                            thiss._heightHeader = jQuery('#' + Main.DOMHEADER).height();
                            jQuery('#divDetail').show();
                            jQuery('#divMaster').hide();
                            var heightHeader = jQuery('#divForm>.panel-heading').height() || 0;
                            var heightFooter = jQuery('#divForm>.panel-footer').height() || 0;
                            jQuery('#divContent').css("overflow", "auto");
                            jQuery('#divContent').css("height", thiss._heightWindow - (5 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter));
                            jQuery('#spnCountCharsDescription>label').text(Main.COUNTCHARSMESSAGE);
                            jQuery('#txaDescription').attr("maxlength", Main.COUNTCHARSMESSAGE);
                            thiss.formPager();
                            jQuery('#btnBack').off("click");
                            jQuery('#btnBack').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                confirm("¿Desea cancelar el llenado de la ficha actual?", function (buttonIndex) {
                                    if (buttonIndex == 1) {
                                        jQuery('#divDetail').empty().hide();
                                        jQuery('#divMaster').show();
                                        thiss.search();
                                    }
                                }, Main.TITLE, ["Si", "No"]);
                            });
                            window.addEventListener('native.keyboardshow', function (e) {
                                jQuery('#' + Main.DOMFOOTER).hide();
                            });
                            window.addEventListener('native.keyboardhide', function (e) {
                                jQuery('#' + Main.DOMFOOTER).show();
                            });
                            jQuery('#btnCaptureGeolocation').off("click");
                            jQuery('#btnCaptureGeolocation').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.captureGeolocation();
                            });
                            jQuery('#btnCapturePhoto').off("click");
                            jQuery('#btnCapturePhoto').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.capturePhoto();
                            });
                            jQuery('#btnSelectedPhoto').off("click");
                            jQuery('#btnSelectedPhoto').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.selectedPhoto();
                            });
                            thiss.listSpatialReferences();
                            jQuery('#ddlSpatialReference').off("change");
                            jQuery('#ddlSpatialReference').on("change", function (e) {
                                thiss.populateCoordinate(thiss.geometry, jQuery(this).int32());
                            });
                            $('#txaDescription').keyup(function () {
                                var newlines = ($(this).val().match(/\n/g) || []).length;
                                if (jQuery(this).val().length + newlines > jQuery(this).attr("maxlength"))
                                    jQuery(this).val(jQuery(this).val().substr(0, jQuery(this).attr("maxlength") - newlines));
                                jQuery('#spnCountCharsDescription>label').text(Main.COUNTCHARSMESSAGE - $(this).val().length);
                            });
                            thiss.viewer.callbackDetailMapClick = function (geometry) {
                                thiss.detailMapClick(geometry);
                            };
                            thiss.viewer.callbackDetailTrash = function () {
                                thiss.detailTrash();
                            };
                            thiss.viewer.buildDetail('mapDetail', jQuery('#divContent').height() - (jQuery('#mapDetail').prev().height()));
                            Main.initialize = true;
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        options = options || {};
                        options.urlForm = com.jtm.Server.contextPath + "areas/geometry/photography/form.html";
                        _super.prototype.buttonConfig.call(this, options);
                        jQuery('#btnCloud').off("click");
                        jQuery('#btnCloud').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.synchronize();
                        });
                        jQuery('#btnPrint').off("click");
                        jQuery('#btnPrint').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.print();
                        });
                    };
                    Main.prototype.save = function (url, data, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        if (options.validate() === false)
                            return;
                        data = {
                            id: thiss.$hdnId.int32(),
                            description: jQuery('#txaDescription').string(),
                            state: true,
                            uuid: thiss.getUUID(),
                            spatialReference: { id: jQuery('#ddlSpatialReference').val() },
                            coordinate: { x: thiss.geometry.coordinates[0], y: thiss.geometry.coordinates[1] },
                            document: { url: jQuery('#imgPhoto').attr("src") }
                        };
                        var geometry = {
                            coordinates: thiss.project([data.coordinate.x, data.coordinate.y], thiss.geometry.spatialReference.id, Main.SRIDDEFAULTAPP),
                            spatialReference: { id: Main.SRIDDEFAULTAPP },
                            extraData: thiss.geometry.extraData
                        };
                        geometry = JSON.stringify(geometry);
                        this.db = this.openDatabase();
                        this.db.transaction(function (tx) {
                            if (data.id === 0)
                                tx.executeSql('INSERT INTO "geo.photography"(description,uuid,geometry,spatialreferenceid,documenturl,issynchronized,registrationdate,state) VALUES (?,?,?,?,?,?,?,?)',
                                    [data.description, thiss.getUUID(), geometry, data.spatialReference.id, data.document.url, false, Date.now(), true],
                                    function (tx, response) {
                                        thiss.$hdnId.val(response.insertId);
                                    });
                            else
                                tx.executeSql('UPDATE "geo.photography" SET description=?,geometry=?,spatialreferenceid=?,documenturl=?,registrationdate=?,state=? where id=?', [data.description, geometry, data.spatialReference.id, data.document.url, Date.now(), true, data.id]);
                        }, function (error) {
                            alert("Error:" + error, null, Main.TITLE, "Aceptar");
                        }, function () {
                            confirm("Ha terminado de llenar el registro ¿Desea llenar otro registro?", function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    jQuery('#btnInsert').trigger("click");
                                }
                                else if (buttonIndex == 2) {
                                    jQuery('#divDetail').empty().hide();
                                    jQuery('#divMaster').show();
                                    jQuery('#btnSearch').trigger("click");
                                }
                            }, Main.TITLE, ["Si", "No"]);
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtX').number() === 0) {
                                success = false;
                                message = 'Ingrese el este (X).';
                                jQuery('#txtX').focus();
                            }
                            else if (jQuery('#txtY').number() === 0) {
                                success = false;
                                message = 'Ingrese el norte (Y).';
                                jQuery('#txtY').focus();
                            }
                            else if (jQuery('#ddlSpatialReference').int32() === 0) {
                                success = false;
                                message = 'Seleccione el Sist. Ref.';
                                jQuery('#ddlSpatialReference').focus();
                            }
                            else if (jQuery('#imgPhoto').attr("src") === "") {
                                success = false;
                                message = 'Por favor capture o seleccione una foto';
                                jQuery('#btnCapturePhoto').focus();
                            }
                            else if (jQuery('#txaDescription').string() === "") {
                                success = false;
                                message = 'Ingrese una descripción.';
                                jQuery('#txaDescription').focus();
                            }
                            if (message !== '')
                                alert(message, null, Main.TITLE);
                            return success;
                        }
                    };
                    Main.prototype.detail = function (url, id, options, callback) {
                        var thiss = this;
                        this.db = this.openDatabase();
                        this.db.readTransaction(function (tx) {
                            tx.executeSql('SELECT * FROM "geo.photography" where id=?', [id], function (tx, rs) {
                                thiss.$hdnId.val(rs.rows.item(0).id);
                                thiss.populateCoordinate(JSON.parse(rs.rows.item(0).geometry), rs.rows.item(0).spatialreferenceid);
                                jQuery('#imgPhoto').attr("src", rs.rows.item(0).documenturl);
                                jQuery('#txaDescription').val(rs.rows.item(0).description);
                            }, function (tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function (error) {
                            console.log('transaction error: ' + error.message);
                        }, function () {
                            console.log('transaction ok');
                        });
                    };
                    Main.prototype.delete = function (url, id, options, callback) {
                        var thiss = this;
                        confirm("¿Desea eliminar el elemento?", function (buttonId) {
                            if (buttonId === 1) {
                                thiss.db = thiss.openDatabase();
                                thiss.db.transaction(function (tx) {
                                    tx.executeSql('delete from "geo.photography" where id =?', [id]);
                                }, function (error) {
                                    alert("Error:" + error, null, Main.TITLE, "Aceptar");
                                }, function () {
                                    alert("Se ha eliminado el registro", function () {
                                        jQuery('#btnSearch').trigger("click");
                                    }, Main.TITLE, "Aceptar");
                                });
                            }
                        }, Main.TITLE, ["Aceptar", "Cancelar"]);
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        $("#tbdResult").empty();
                        $("#tbdResult").html('');
                        var html = '';
                        this.db = this.openDatabase();
                        this.db.readTransaction(function (tx) {
                            tx.executeSql('SELECT * FROM "geo.photography" where lower(description) LIKE  "%" || "' + jQuery('#txtDescriptionSearch').string().toLowerCase() + '" || "%" order by registrationdate desc', [], function (tx, rs) {
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
                                $("#tbdResult").append(html);
                                com.jtm.helper.Table.highlightRow("#tblResult");
                            }, function (tx, error) {
                                console.log('SELECT error: ' + error.message);
                            });
                        }, function (error) {
                            console.log('transaction error: ' + error.message);
                        }, function () {
                            console.log('transaction ok');
                        });
                    };
                    Main.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.path + "geometry/" + this.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    //Main.prototype.load = function () {
                    //    _super.prototype.load.call(this, "photography", { module: "geometry", subModule: '' });
                    //};
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