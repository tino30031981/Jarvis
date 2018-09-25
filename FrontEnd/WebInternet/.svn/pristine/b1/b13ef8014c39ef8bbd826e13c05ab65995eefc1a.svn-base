(function (com) {
    (function (jtm) {
        var Master = (function (_super) {
            __extends(Master, _super);
            function Master(c, x) {
                _super.call(this);
                this.$chkState = null;
                this.$hdnId = null;
                this.$txtName = null;
                this.$txaDescription = null;
                this.$chkState = null;
                this.$btnInsert = null;
                this.$btnUpdate = null;
                this.$btnDetail = null;
                this.$btnDelete = null;
                this.$btnSearch = null;
                this.$btnNotify = null;
                this.$btnClean = null;
                this.$btnGPS = null;
                this.$btnDownload = null;
                this.$searchDownload = null;
                this.$spnNotify = null;
                this.$table = null;
                this.$btnClose = null;
                this.$btnCloseList = null;
                this.$btnSave = null;
                this.$ddlDepartment = null;
                this.$ddlProvince = null;
                this.$ddlDistrict = null;
                this.$ddlHydrographicBasin = null;
                this.$ddlNationalCartography = null;
                this.$ddlTownCenter = null;
                this.$detailDownload = null;
                this.$divReport = null;
                this.$divFormatReport = null;
                this.$divPopup = null;
                this.uuid = '';
                this.formm = null;
                this.attachment = null;
                this.formAttachment = null;
                this.folder = null;
                this.setPathJS = function (value) {
                    this.js = value;
                };
                this.setPathJSON = function (value) {
                    this.json = value;
                };
                this.setPathImage = function (value) {
                    this.img = value;
                };
                this.buildClose = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.container = options.container || thiss.$form;
                    if (typeof options.container === "string")
                        options.container = jQuery(options.container);
                    var $toolbar = options.container.find('>.panel>.panel-heading>.btn-toolbar');
                    var $btn = $('<button class="btn" type= "button" title= "Cerrar" ><i class="glyphicon glyphicon-remove"></i></button >');
                    var $group = $('<div></div>');
                    $group.addClass("btn-group pull-right");
                    $group.append($btn);
                    $toolbar.find('.pull-right:first').prepend($group);
                    $btn.off("click");
                    $btn.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.$form.empty().hide();
                        thiss.$main.show();
                    });
                };

                this.getElementID = function (tbl, attribute) {
                    tbl = tbl || Master.TBLRESULT;
                    tbl = (typeof tbl === "string") ? jQuery(tbl) : tbl;
                    attribute = attribute || "data-uniqueid";
                    var row = tbl.find('>tbody>tr.selected')[0];
                    if (row === undefined) return 0;
                    var id = this.getInt32($(row).attr(attribute));
                    return id;
                };
                this.getElementUnique = function (tbl, attribute) {
                    tbl = tbl || Master.TBLRESULT;
                    attribute = attribute || "data-uniqueid";
                    tbl = (typeof tbl === "string") ? jQuery(tbl) : tbl;
                    var row = tbl.find('>tbody>tr.selected')[0];
                    if (row === undefined) return 0;
                    var id = $(row).attr(attribute);
                    return id === undefined || id === null ? 0 : id;
                };
                this.detailConfig = function (url, options, callback) {
                    var thiss = this;
                    options = options || {};
                    options.url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlDetail : url;
                    options.isJson = typeof options.isJson === 'boolean' ? options.isJson : true;
                    options.validate = (typeof options.validate !== "function" || typeof options.validate !== "boolean") ? true : options.validate;
                    thiss.ajax(options, function (data) {
                        if (data.success === false) {
                            alert(data.message);
                            return;
                        }
                        if (typeof callback === 'function')
                            callback(data);
                        else {
                            thiss.$hdnId.val(data.item.id);
                            thiss.$txtName.val(data.item.name);
                            thiss.$txaDescription.val(data.item.description);
                            thiss.$chkState.prop("checked", data.item.state);
                        }
                    });
                };
                this.deleteConfig = function (url, options, callback) {
                    var thiss = this;
                    if (confirm("¿Desea eliminar el elemento?")) {
                        options = options || {};
                        options.url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlDelete : url;
                        options.isJson = typeof options.isJson === 'boolean' ? options.isJson : true;
                        options.validate = (typeof options.validate !== "function" && typeof options.validate !== "boolean") ? true : options.validate;
                        thiss.ajax(options, function (data) {
                            toastr.info(data.message);
                            if (typeof callback === 'function')
                                callback();
                            else
                                thiss.$btnSearch.trigger('click');
                        });
                    }
                };
                this.saveConfig = function (url, options, callback) {
                    var thiss = this;
                    options = options || {};
                    options.url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlSave : url;
                    options.isJson = typeof options.isJson === 'boolean' ? options.isJson : true;
                    options.validate = (typeof options.validate !== "function" && typeof options.validate !== "boolean") ? false : options.validate;
                    if (options.data === undefined || options.data === null) {
                        options.data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.string(),
                            description: thiss.$txaDescription.string(),
                            state: thiss.$chkState.boolean()
                        };
                    }
                    thiss.ajax(options, function (data) {
                        if (data.success === false) {
                            alert(data.message);
                            return;
                        }
                        if (data.success === true) {
                            alert(data.message);
                        }
                        if (typeof callback === 'function') {
                            callback(data);
                        }
                        else {
                            //jQuery('#btnSearch').trigger('click');
                            thiss.$hdnId.val(data.extra);
                            thiss.detail(options.urlDetail, data.extra);
                        }
                    });
                };
                this.searchConfig = function (url, options, callback) {
                    var thiss = this;
                    options = options || {};
                    options.url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlSearch : url;
                    options.isJson = typeof options.isJson === 'boolean' ? options.isJson : true;
                    options.validate = (typeof options.validate !== "function" && typeof options.validate !== "boolean") ? true : options.validate;
                    thiss.ajax(options, function (data) {
                        if (data.hasOwnProperty("success") === false) {
                            if (typeof callback === "function")
                                callback(data);
                            return;
                        }
                        if (data.success) {
                            if (typeof callback === "function") {
                                if (data.items !== undefined && data.items !== null && data.item !== undefined && data.item !== null)
                                    callback(data.item, data.items);
                                else if (data.items instanceof Array)
                                    callback(data.items);
                                else if (data.item !== undefined && data.item !== null)
                                    callback(data.item);
                                else
                                    callback(data);
                            }
                        }
                        else
                            alert(data.message);
                    });
                };
                this.downloadConfig = function (url, format, options, callback) {
                    var uuid = this.getUUID();
                    options = options || {};
                    options.data = options.data || {};
                    options.data.format = format;
                    var $frm = $('<form></form>');
                    $frm.attr("id", "frm" + uuid);
                    $frm.attr("name", "frm" + uuid);
                    $frm.attr("method", "POST");
                    $frm.attr("target", "_blank");
                    $frm.attr("action", url);
                    jQuery("body").append($frm);
                    if (options.data !== undefined && options.data !== null) {
                        var i = null;
                        var $hidden = null;
                        for (i in options.data) {
                            $hidden = $("<input />");
                            $hidden.attr("type", "hidden");
                            $hidden.attr("id", i);
                            $hidden.attr("name", i);
                            $hidden.val(options.data[i]);
                            $frm.append($hidden);
                        }
                    }
                    $frm.submit();
                    $frm.remove();
                    options.data = null;
                };
                this.fillPoliticalDivision = function (ddlDepartment, ddlProvince, ddlDistrict) {
                    ddlDepartment = ddlDepartment || '#ddlDepartment';
                    ddlDepartment = (typeof ddlDepartment === 'string') ? jQuery(ddlDepartment) : ddlDepartment;
                    ddlProvince = ddlProvince || '#ddlProvince';
                    ddlProvince = (typeof ddlProvince === 'string') ? jQuery(ddlProvince) : ddlProvince;
                    ddlDistrict = ddlDistrict || '#ddlDistrict';
                    ddlDistrict = (typeof ddlDistrict === 'string') ? jQuery(ddlDistrict) : ddlDistrict;
                    ddlDepartment.on("change", function (e) {
                        com.jtm.helper.DropDownList.fill({
                            url: com.jtm.Server.contextPath + "geometry/province/searchbydepartment",
                            ddl: ddlProvince,
                            data: { id: jQuery(this).string() },
                            callback: function (id) {
                                com.jtm.helper.DropDownList.fill({
                                    url: com.jtm.Server.contextPath + "geometry/district/searchbyprovince",
                                    ddl: ddlDistrict,
                                    data: { id: id }
                                });
                            }
                        });
                    });
                    ddlDepartment.trigger("change");
                };
                this.project = function (coordinates, sridFrom, sridTo) {
                    sridFrom = (sridFrom === Master.SRIDDEFAULTESRI) ? Master.SRIDDEFAULTMAP : sridFrom;
                    sridTo = (sridTo === Master.SRIDDEFAULTESRI) ? Master.SRIDDEFAULTMAP : sridTo;
                    var toProj = proj4('EPSG:' + sridTo);
                    var fromProj = proj4('EPSG:' + sridFrom);
                    coordinates = proj4(fromProj, toProj).forward(coordinates);
                    return coordinates;
                };
                this.typeEsriJSON2GeoJSON = function (type) {
                    if (type !== undefined && type !== null) {
                        if (type === Master.ESRITYPES.POINT) {
                            return Master.OGCTYPES.POINT;
                        }
                        else if (type === Master.ESRITYPES.LINESTRING) {
                            return Master.OGCTYPES.LINESTRING;
                        }
                        else if (type === Master.ESRITYPES.POLYGON) {
                            return Master.OGCTYPES.POLYGON;
                        }
                    }
                    return null;
                };
                this.typeGeoJSON2EsriJSON = function (type) {
                    if (type !== undefined && type !== null) {
                        if (type === Master.OGCTYPES.POINT) {
                            return Master.ESRITYPES.POINT;
                        }
                        else if (type === Master.OGCTYPES.LINESTRING) {
                            return Master.ESRITYPES.LINESTRING;
                        }
                        else if (type === Master.OGCTYPES.POLYGON) {
                            return Master.ESRITYPES.POLYGON;
                        }
                        else if (type === Master.OGCTYPES.MULTIPOLYGON) {
                            return Master.ESRITYPES.POLYGON;
                        }
                        else if (type === Master.OGCTYPES.MULTIPOINT) {
                            return Master.ESRITYPES.POINT;
                        }
                    }
                    return null;
                };
                this.geoJSON2EsriJSON = function (coordinates, type, srid) {
                    var esri = null;
                    if (coordinates !== undefined && coordinates !== null) {
                        var geometryType = this.typeGeoJSON2EsriJSON(type);
                        if (type === Master.OGCTYPES.POINT) {
                            esri = { geometryType: geometryType, geometry: { x: coordinates[0], y: coordinates[1] }, spatialReference: { wkid: srid } };
                        }
                        else if (type === Master.OGCTYPES.LINESTRING) {
                            esri = { geometryType: geometryType, geometry: { paths: coordinates }, spatialReference: { wkid: srid } };
                        }
                        else if (type === Master.OGCTYPES.POLYGON) {
                            esri = { geometryType: geometryType, geometry: { rings: coordinates }, spatialReference: { wkid: srid } };
                        }
                    }
                    return esri;
                };
                this.esriJSON2GeoJSON = function (coordinates, type, srid) {
                };
                this.geometryToGeoJSON = function (geometry) {
                };
                this.geometryToEsriJSON = function (geometry) {
                    var thiss = this;
                    var json = {};
                    json.geometryType = thiss.typeGeoJSON2EsriJSON(geometry.type);
                    json.spatialReference = {
                        wkid: geometry.spatialReference.id,
                        latestWkid: geometry.spatialReference.id
                    };
                    json.features = [];
                    if (geometry.type === Master.OGCTYPES.POINT)
                        json.features.push({
                            geometry: {
                                x: geometry.coordinates[0],
                                y: geometry.coordinates[1],
                                //spatialReference: srid
                                spatialReference: {
                                    wkid: geometry.spatialReference.id,
                                    latestWkid: geometry.spatialReference.id
                                }
                            },
                            attributes: {}
                        });
                    else if (geometry.type === Master.OGCTYPES.POLYLINE) {
                        if (geometry.coordinates instanceof Array && geometry.coordinates.length > 0) {
                            if (geometry.coordinates[0] instanceof Array && geometry.coordinates[0].length > 0)
                                if ((geometry.coordinates[0][0] instanceof Array) === false || geometry.coordinates[0][0] === undefined)
                                    geometry.coordinates = [geometry.coordinates];
                        }
                        else {
                            alert("Para generar la polilínea al menos debe capturarse 2 puntos", null, Master.TITLE, "Aceptar");
                            return null;
                        }
                        if (!(geometry.coordinates[0] instanceof Array) || geometry.coordinates[0].length < 2) {
                            alert("Para generar la polilínea al menos debe capturarse 2 puntos", null, Master.TITLE, "Aceptar");
                            return null;
                        }
                        json.features.push({
                            geometry: {
                                paths: geometry.coordinates,
                                spatialReference: {
                                    wkid: srid,
                                    latestWkid: srid
                                }
                            },
                            attributes: {}
                        });
                    }
                    else if (geometry.type === Master.OGCTYPES.POLYGON || geometry.type === Master.OGCTYPES.MULTIPOLYGON) {
                        var coordinates = [[]];
                        if (geometry.coordinates instanceof Array && geometry.coordinates.length > 0) {
                            if (geometry.coordinates[0] instanceof Array && geometry.coordinates[0].length > 0)
                                geometry.coordinates[0].forEach(function (coordinate) {
                                    coordinates[0] = coordinate;
                                });
                        }
                        else {
                            //console.log('else');
                            alert("Para generar el polígono al menos debe capturarse 3 puntos", null, Master.TITLE, "Aceptar");
                            return null;
                        }
                        if (!(coordinates[0] instanceof Array) && coordinates[0].length > 3) {
                            alert("Para generar el polígono al menos debe capturarse 3 puntos", null, Master.TITLE, "Aceptar");
                            return null;
                        }
                        /*var lastIndex = coordinates[0].length - 1;
                        if (geometry.coordinates[0][0][0] !== geometry.coordinates[0][lastIndex][0] || geometry.coordinates[0][0][1] !== geometry.coordinates[0][lastIndex][1])
                            geometry.coordinates[0].push(geometry.coordinates[0][0]);*/
                        json.features.push({
                            type: Master.OGCTYPES.POLYGON,
                            geometry: {
                                type: Master.OGCTYPES2.POLYGON,
                                rings: coordinates,
                                spatialReference: {
                                    wkid: geometry.spatialReference.id,
                                    latestWkid: geometry.spatialReference.id
                                }
                            },
                            attributes: {}
                        });
                    }
                    return json;
                };
                this.geolocation = function (callback) {
                    if (window.cordova !== undefined) {
                        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                            if (enabled === false) {
                                confirm('Su GPS está desactivado. ¿Desea activarlo?', function onConfirm(buttonIndex) {
                                    if (buttonIndex === 1)
                                        cordova.plugins.diagnostic.switchToLocationSettings();
                                }, "GPS", ["Aceptar", "Cancelar"]);
                            } else {
                                navigator.geolocation.getCurrentPosition(function (position) {
                                    var geometry = {
                                        coordinates: [position.coords.longitude, position.coords.latitude, position.coords.altitude],
                                        spatialReference: { id: Master.SRIDDEFAULTGPS }
                                    };
                                    geometry.extraData = {
                                        accuracy: position.coords.accuracy
                                    };
                                    if (typeof callback === "function")
                                        callback(geometry);
                                }, function (error) { alert(Master.TITLE, null, "Error: " + error, "Aceptar"); }, { enableHighAccuracy: true });
                            }
                        }, function (error) {
                            alert('Ocurrió un error: ' + error, null, "GPS", "Aceptar");
                        });
                    }
                    else {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var geometry = {
                                coordinates: [position.coords.longitude, position.coords.latitude, position.coords.altitude],
                                spatialReference: { id: Master.SRIDDEFAULTGPS }
                            };
                            geometry.extraData = {
                                accuracy: position.coords.accuracy
                            };
                            if (typeof callback === "function")
                                callback(geometry);
                        }, function (error) { alert(Master.TITLE, null, "Error: " + error, "Aceptar"); }, { enableHighAccuracy: true });
                    }
                };
                this.convertDDToDMS = function (deg, lng) {
                    var d = parseInt(deg);
                    var minfloat = Math.abs((deg - d) * 60);
                    var m = Math.floor(minfloat);
                    var secfloat = (minfloat - m) * 60;
                    var s = Math.round(secfloat);
                    d = Math.abs(d);

                    if (s == 60) {
                        m++;
                        s = 0;
                    }
                    if (m == 60) {
                        d++;
                        m = 0;
                    }

                    return {
                        dir: deg < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N',
                        d: d,
                        m: m,
                        s: s
                    };
                };
                this.convertDDToDMSString = function (deg, lng) {
                    var dms = this.convertDDToDMS(deg, lng);
                    return dms.d + '&#176; ' + dms.m + '\' ' + dms.s + '\" '
                };
                this.converDMSToDD = function (input) {
                    var parts = input.split(/[^\d\w]+/);
                    var lat = convert(parts[0], parts[1], parts[2], parts[3]);
                    var lng = convert(parts[4], parts[5], parts[6], parts[7]);
                    function convert(degrees, minutes, seconds, direction) {
                        var dd = degrees + minutes / 60 + seconds / (60 * 60);

                        if (direction == "S" || direction == "W") {
                            dd = dd * -1;
                        } // Don't do anything for N or E
                        return dd;
                    }
                };
                this.listReportType = function (url) {
                    var thiss = this;
                    if (thiss.$divReport.length === 0) return;
                    if (thiss.$divReport.find('>ul').length === 0) return;
                    url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlListReportType : url;
                    var options = {
                        url: url,
                        data: {},
                        validate: true
                    };
                    thiss.ajax(options, function (data) {
                        data.forEach(function (item, i) {
                            thiss.$divReport.find('>ul').append('<li data-reportid="' + (i + 1) + '" data-format="EXCEL"><a href="#">' + item.name + ' EXCEL </a></li>');
                            thiss.$divReport.find('>ul').append('<li data-reportid="' + (i + 1) + '" data-format="PDF"><a href="#">' + item.name + ' PDF </a></li>');
                        });
                        thiss.$divReport.find('>ul').append('<li role="separator" class="divider"></li>');
                        thiss.$divReport.find('>ul').append('<li data-reportid="kml" data-format="kml"><a href="#" id="kml"> Kml</a></li>');
                    });
                };
                this.listFormatReportType = function (url) {
                    var thiss = this;
                    if (thiss.$divFormatReport.length === 0) return;
                    if (thiss.$divFormatReport.find('>ul').length === 0) return;
                    url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlListFormatReportType : url;
                    var options = {
                        url: url,
                        data: {},
                        validate: true
                    };
                    thiss.ajax(options, function (data) {
                        data.forEach(function (item) {
                            thiss.$divFormatReport.find('>ul').append('<li data-format=' + item + '><a href="#"><i class="glyphicon glyphicon-list-alt"></i> ' + item + '</a></li>');
                        });
                    });
                    thiss.$divFormatReport.find('>ul').off("click", ">li>a");
                    thiss.$divFormatReport.find('>ul').on("click", ">li>a", function (e) {
                        e.preventDefault();
                        window.plugins.deviceFeedback.acoustic();
                        thiss.$divFormatReport.find('>button>span:first').text($(this).text()).attr("data-format", $(this).closest('li').attr('data-format'));
                    });
                };
                this.report = function (reportId, format, url) {
                    var thiss = this;
                    var id = thiss.getElementID();
                    if (reportId == 1) {
                        if (id === 0) {
                            alert('Debe seleccionar una fila');
                            return;
                        }
                    }
                    var options = {
                        data: {
                            reportId: reportId,
                            id: id,
                            format: format,
                            item: JSON.stringify(thiss.parameters())
                        }
                    };
                    url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlReport : url;
                    thiss.downloadConfig(url, format, options, null);
                };
            }
            Master.SRIDDEFAULTESRI = 102100;
            Master.SRIDDEFAULTMAP = 3857;
            Master.SRIDDEFAULTGPS = 4326;
            Master.SRIDDEFAULTAPP = 32718;
            Master.EXTENTINFINITY = [Infinity, Infinity, -Infinity, -Infinity];
            Master.OGCTYPES = {
                POINT: "Point",
                LINESTRING: "LineString",
                POLYGON: "Polygon",
                MULTIPOINT: "MultiPoint",
                MULTILINESTRING: "MultiLineString",
                MULTIPOLYGON: "MultiPolygon",
                GEOMETRYCOLLECTION: "GeometryCollection"
            };
            Master.OGCTYPES2 = {
                POINT: "point",
                LINESTRING: "lineString",
                POLYGON: "polygon",
                MULTIPOINT: "multiPoint",
                MULTILINESTRING: "multiLineString",
                MULTIPOLYGON: "multiPolygon",
                POLYLINE : "polyline"
            };
            Master.ESRITYPES = {
                POINT: "esriGeometryPoint",
                LINESTRING: "esriGeometryPolyline",
                POLYGON: "esriGeometryPolygon",
                MULTIPOINT: "esriGeometryMultiPoint",
                ENVELOPE: "esriGeometryEnvelope"
            };
            Master.FORMAT = {
                ESRIJSON: 'esrijson',
                GEOJSON: 'geojson'
            };
            Master.INFOWINDOW = 'infoWindow';
            Master.LABELLAYER = 'n';
            Master.TXTNAMESEARCH = '#txtNameSearch';
            Master.CHKSTATESEARCH = '#chkStateSearch';
            Master.HDNID = '#hdnId';
            Master.TXTNAME = '#txtName';
            Master.TXADESCRIPTION = '#txaDescription';
            Master.CHKSTATE = '#chkState';
            Master.BTNINSERT = '#btnInsert';
            Master.BTNUPDATE = '#btnUpdate';
            Master.BTNDETAIL = '#btnDetail';
            Master.BTNDELETE = '#btnDelete';
            Master.BTNSEARCH = '#btnSearch';
            Master.BTNNOTIFY = '#btnNotify';
            Master.BTNCLEAN = '#btnClean';
            Master.BTNDOWNLOAD = '#btnDownload';
            Master.TBLRESULT = '#tblResult';
            Master.SEARCHDOWNLOAD = '#searchDownload';
            Master.SPNNOTIFY = '#spnNotify';
            Master.BTNCLOSE = '#btnClose';
            Master.BTNSAVE = '#btnSave';
            Master.DETAILDOWNLOAD = '#detailDownload';
            Master.DIVPOPUP = '#divPopup';
            Master.DOMATTACHMENT = '#divAttachment';
            Master.DOMATTACHMENTFORM = '#divAttachmentForm';
            Master.DOMTRACINGFORM = '#divFormTracing';
            Master.DOMDIVREPORT = '#divReport';
            Master.DOMDIVFORMATREPORT = '#divFormatReport';
            Master.prototype.setModule = function (jsonFile, options, callback) {
                var thiss = this;
                _super.prototype.setModule.call(this, jsonFile, options, function () {
                    thiss.formConfig(options, options.withCustomForm);
                    //thiss.attachmentConfig();
                    thiss.folderConfig();
                    thiss.procedureConfig();
                    thiss.spatialConfig(options, null);
                    if (typeof callback === "function")
                        callback();
                    thiss.initConfig();
                    thiss.domConfig();
                    thiss.viewConfig();
                    thiss.uiConfig();
                    thiss.buttonConfig(null);
                });
            };
            Master.prototype.formConfig = function (options, withCustomForm) {
                var thiss = this;
                if (withCustomForm === true) {
                    options = options || {};
                    options.formJS = String.isNullOrWhiteSpace(options.formJS) === true ? thiss.js.module.subModule.path + "form.js" : options.formJS;
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getScript(options.formJS, function (data, textStatus, jqxhr) {
                        thiss.formm = getInstance();
                        thiss.formm.setPathJS(thiss.js);
                        thiss.formm.setPathJSON(thiss.json);
                        thiss.formm.setConfig(thiss.config);
                    });
                    jQuery.ajaxSetup({ async: true });
                }
            };
            Master.prototype.procedureConfig = function () {

            };
            Master.prototype.attachmentConfig = function () {
                var thiss = this;
                jQuery.ajaxSetup({ async: false });
                jQuery.getScript(thiss.js.path + "documentlibrary/attachment.js", function (data, textStatus, jqxhr) {
                    thiss.attachment = getInstance();
                    thiss.formAttachment = getInstance();
                });
                jQuery.ajaxSetup({ async: true });
            };
            Master.prototype.folderConfig = function () {
                var thiss = this;
                jQuery.ajaxSetup({ async: false });
                jQuery.getScript(thiss.js.path + "documentlibrary/basefolder.js", function (data, textStatus, jqxhr) {
                    thiss.folder = getInstance();
                });
                jQuery.ajaxSetup({ async: true });
            };
            Master.prototype.spatialConfig = function (options, callback) {

            };
            Master.prototype.domConfig = function () {
                this.$txtNameSearch = this.$main.find(Master.TXTNAMESEARCH);
                this.$chkStateSearch = this.$main.find(Master.CHKSTATESEARCH);
                this.$spnNotify = this.$main.find(Master.SPNNOTIFY);
                this.$table = this.$main.find(Master.TBLRESULT);
                this.$divReport = this.$main.find(Master.DOMDIVREPORT);
                //this.$divFormatReport = this.$main.find(Master.DOMDIVFORMATREPORT);
                this.$btnInsert = this.$main.find(Master.BTNINSERT);
                this.$btnUpdate = this.$main.find(Master.BTNUPDATE);
                this.$btnDetail = this.$main.find(Master.BTNDETAIL);
                this.$btnDelete = this.$main.find(Master.BTNDELETE);
                this.$btnSearch = this.$main.find(Master.BTNSEARCH);
                this.$btnNotify = this.$main.find(Master.BTNNOTIFY);
                this.$btnClean = this.$main.find(Master.BTNCLEAN);
                //this.$searchDownload = this.$main.find(Master.SEARCHDOWNLOAD);
                this.$btnDownload = this.$main.find(Master.BTNDOWNLOAD);
            };
            Master.prototype.viewConfig = function () {
                var thiss = this;
                var hub = $.connection.baseHub;
                if (hub !== undefined && hub !== null) {
                    hub.client.save = function (id, dmlType, description) {
                        thiss.addNotify(id, dmlType, description);
                        //thiss.$btnSearch.trigger("click");
                    };
                    hub.client.delete = function (id, dmlType, description) {
                        thiss.addNotify(id, dmlType, description);
                        thiss.$btnSearch.trigger("click");
                    };
                    $.connection.hub.start().done(function () {
                    });
                }
            };
            Master.prototype.initConfig = function () {
                var thiss = this;
            };
            Master.prototype.buttonConfig = function (options) {
                var thiss = this;
                options = options || {};
                options.urlForm = String.isNullOrWhiteSpace(options.urlForm) === true ? com.jtm.System.urlForm : options.urlForm;
                options.urlSave = String.isNullOrWhiteSpace(options.urlSave) === true ? com.jtm.System.urlSave : options.urlSave;
                options.urlDelete = String.isNullOrWhiteSpace(options.urlDelete) === true ? com.jtm.System.urlDelete : options.urlDelete;

                thiss.$btnSearch.off("click");
                thiss.$btnSearch.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.search();
                });
                thiss.$btnClean.off("click");
                thiss.$btnClean.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.clean();
                });
                thiss.$btnInsert.off("click");
                thiss.$btnInsert.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.form(options.urlForm, 0);
                });
                thiss.$btnUpdate.off("click");
                thiss.$btnUpdate.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.form(options.urlForm, -1);
                });
                thiss.$btnDetail.off("click");
                thiss.$btnDetail.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.form(options.urlForm, -1);
                });
                thiss.$btnDelete.off("click");
                thiss.$btnDelete.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.delete(options.urlDelete, 0);
                });
                /*thiss.$searchDownload.find('a').off("click");
                thiss.$searchDownload.find('a').on("click", function (e) {
                    e.preventDefault();
                    window.plugins.deviceFeedback.acoustic();
                    thiss.searchDownload(null, jQuery(this).attr("data-format"), options);
                });*/
                thiss.$divReport.find('>ul').off("click", ">li>a");
                thiss.$divReport.find('>ul').on("click", ">li>a", function (e) {
                    e.preventDefault();
                    window.plugins.deviceFeedback.acoustic();
                    if ($(this).closest('li').attr('data-reportid') == "kml")
                        thiss.searchDownload(null, $(this).closest('li').attr("data-format"), options);
                    else
                        thiss.report($(this).closest('li').attr('data-reportid'), $(this).closest('li').attr("data-format"), null);
                });
                thiss.$btnSearch.trigger('click');
            };
            Master.prototype.uiConfig = function () {
                var thiss = this;
                thiss.listReportType();
                //thiss.listFormatReportType();
                //thiss.attachment.load(thiss.$main.find(Master.DOMATTACHMENT));
            };
            Master.prototype.dialog = function (dom, options) {
                var thiss = this;
                if (typeof dom === "string")
                    dom = jQuery(dom);
                dom.dialog({
                    title: options.title,
                    width: (options.width === undefined) ? "100%" : options.width,
                    resizable: false,
                    modal: true,
                    closeOnEscape: true,
                    autoempty: true,
                    position: [0, 0],
                    close: function (dialog) {
                        dialog.dialog('close');
                    }
                });
            };
            Master.prototype.form = function form(url, id, options) {
                var thiss = this;
                id = id || 0;
                if (id < 0) {
                    id = thiss.getElementID();
                    if (id === 0) {
                        alert("Por favor seleccione un elemento");
                        return;
                    }
                }
                options = options || {};
                options.container = options.container || thiss.$form;
                if (typeof options.container === "string")
                    options.container = jQuery(options.container);
                thiss.loadView(options.container, url, function () {
                    thiss.$main.hide();
                    thiss.$form.show();
                    thiss.$hdnId = options.container.find(Master.HDNID);
                    thiss.$txtName = options.container.find(Master.TXTNAME);
                    thiss.$txaDescription = options.container.find(Master.TXADESCRIPTION);
                    thiss.$chkState = options.container.find(Master.CHKSTATE);
                    thiss.$btnClose = options.container.find(Master.BTNCLOSE);
                    thiss.$btnSave = options.container.find(Master.BTNSAVE);
                    thiss.$detailDownload = options.container.find(Master.DETAILDOWNLOAD);
                    thiss.$divPopup = options.container.find(Master.DIVPOPUP);
                    thiss.buildClose();
                    if (thiss.config.detailIsPopup === true) {
                        options.dialog = options.dialog || {};
                        options.dialog.title = options.dialog.title || "Formulario";
                        thiss.dialog(options.container, options.dialog);
                    }
                    thiss.$btnClose.off("click");
                    thiss.$btnClose.on("click", function (e) {
                        thiss.$form.empty().hide();
                        thiss.$main.show();
                    });
                    thiss.$btnSave.off("click");
                    thiss.$btnSave.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.save(options.urlSave);
                    });
                    thiss.$detailDownload.find('a').off("click");
                    thiss.$detailDownload.find('a').on("click", function (e) {
                        e.preventDefault();
                        window.plugins.deviceFeedback.acoustic();
                        thiss.formDownload(null, jQuery(this).attr("data-format"), options);
                    });
                    if (typeof options.callback === "function")
                        options.callback();
                    if (thiss.getInt32(id) > 0) {
                        thiss.detail(options.urlDetail, id);
                    }
                });
            };
            Master.prototype.formDownload = function (url, format, options) {
                var thiss = this;
                url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlDetailDownload : url;
                if (options.data === undefined || options.data === null) {
                    var id = thiss.$hdnId.int32();
                    if (id === 0) {
                        alert(Master.NEWELEMENTID);
                        return;
                    }
                    options.data = {
                        id: id
                    };
                    this.downloadConfig(url, format, options);
                }
                else
                    this.downloadConfig(url, format, options);
            };
            Master.prototype.detail = function (url, id, options, callback) {
                var thiss = this;
                var options2 = {
                    data: { id: id },
                    validate: (options !== undefined && options !== null) ? options.validate : null
                };
                this.detailConfig(url, options2, callback);
            };
            Master.prototype.report = function (dom,id) {
                var thiss = this;
            };
            Master.prototype.detailByRow = function ($row, options) {
                var thiss = this;
                options = options || {};
                options.urlForm = String.isNullOrWhiteSpace(options.urlForm) === true ? com.jtm.System.urlForm : options.urlForm;
                options.urlSave = String.isNullOrWhiteSpace(options.urlSave) === true ? com.jtm.System.urlSave : options.urlSave;
                options.urlDelete = String.isNullOrWhiteSpace(options.urlDelete) === true ? com.jtm.System.urlDelete : options.urlDelete;
                var id = $row.attr("data-uniqueid");
                if (id == undefined || id == null)
                    id = $row.attr("data-uniquecode");
                thiss.form(options.urlForm, -1);
            };
            Master.prototype.onElementSelected = function ($row) {
                var thiss = this;
            };
            Master.prototype.delete = function (url, id, options, callback) {
                var thiss = this;
                if (id === 0) {
                    id = thiss.getElementID();
                    if (id === 0) { alert("Por favor seleccione un elemento"); return; }
                }
                var options2 = {
                    data: { id: id },
                    isJson: false,
                    validate: (options !== undefined && options !== null) ? options.validate : null
                };
                this.deleteConfig(url, options2, callback);
            };
            Master.prototype.save = function save(url, data, options, callback) {
                var thiss = this;
                options = options || {};
                options.data = data;
                options.validate = options.validate || validate;
                this.saveConfig(url, options, callback);
                function validate() {
                    if (thiss.$txtName.string() === '') {
                        alert("Ingrese el nombre");
                        thiss.$txtName.focus();
                        return false;
                    }
                    return true;
                }
            };
            Master.prototype.search = function (url, options, callback) {
                var thiss = this;
                options = options || {};
                url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlSearch : url;
                options.columns = options.columns || [{
                    field: 'name',
                    sortable: true,
                    visible: true,
                    searchable: false,
                    switchable: false
                    //sorter: "numericOnly"
                }, {
                    field: 'description',
                    sortable: true,
                    visible: true,
                    searchable: false
                }, {
                    field: 'stateName',
                    sortable: true,
                    visible: true,
                    searchable: false
                }];
                thiss.$table.removeClass("table-striped");
                thiss.$table.bootstrapTable('destroy');
                thiss.$table.bootstrapTable({
                    method: "post",
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    pagination: true,
                    sidePagination: "server",
                    pageNumber: 1,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 500],
                    smartDisplay: true,
                    striped: false,
                    search: false,
                    showHeader: true,
                    showFooter: true,
                    showColumns: true,
                    showRefresh: false,
                    showToggle: true,
                    showPaginationSwitch: false,
                    idField: "id",
                    uniqueId: "id",
                    cardView: false,
                    detailView: false,
                    paginationVAlign: "bottom",
                    paginationPreText: "<",
                    paginationNextText: ">",
                    maintainSelected: true,
                    mobileResponsive: true,
                    checkOnInit: true,
                    flat: true,
                    //locale:'en-US',
                    toolbar: "#jcaResultToolbar",
                    ajax: function (p) {
                        var data = { paginator: JSON.stringify(p.data), item: JSON.stringify(thiss.parameters()) };
                        if (options.extraData !== undefined && options.extraData !== null)
                            for (var i in options.extraData)
                                data[i] = options.extraData[i];
                        var optionsAjax = {
                            url: url,
                            data: data,
                            isJson: false,
                            validate: function () { return true; },
                            type: p.type,
                            contentType: p.contentType,
                            dataType: p.dataType,
                            cache: p.cache
                        };
                        thiss.ajax(optionsAjax,
                            function (data) {
                                if (data.success === true) {
                                    p.success({
                                        total: data.total,
                                        rows: data.items
                                    });
                                    if (typeof callback === "function") {
                                        thiss.$table.one("load-success.bs.table", function (e) {
                                            callback(data);
                                        });
                                        thiss.$table.trigger("load-success.bs.table");
                                    }
                                }
                                else
                                    alert(data.message);
                            });
                    },
                    columns: options.columns,
                    onClickRow: function (row, element, field) {
                        jQuery(element).closest("tbody").find(">tr").removeClass('selected');
                        jQuery(element).addClass('selected');
                        thiss.onElementSelected($(element));
                    },
                    onDblClickRow: function (row, element, field) {
                        thiss.detailByRow($(element), null);
                    }
                });
            };
            Master.prototype.searchDownload = function (url, format, options) {
                url = String.isNullOrWhiteSpace(url) ? com.jtm.System.urlSearchDownload : url;
                if (options.data === undefined || options.data === null) {
                    options.data = {
                        item: JSON.stringify(this.parameters())
                    };
                }
                this.downloadConfig(url, format, options);
            };
            Master.prototype.parameters = function () {
                var thiss = this;
                return {
                    name: thiss.$txtNameSearch.string(),
                    state: thiss.$chkStateSearch.boolean()
                };
            };
            Master.prototype.addNotify = function (id, action, message) {
                var thiss = this;
                var count = (id instanceof Array) ? id.length : 1;
                var currentCount = Number(thiss.$spnNotify.text());
                thiss.$spnNotify.text(currentCount + count);
            };
            return Master;
        })(jtm.Base);
        jtm.Master = Master;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
//El objeto siguiente está en prueba, todavía debe de utilizarse en los objetos ya existentes
(function (com) {
    (function (jtm) {
        var MasterForm = (function (_super) {
            __extends(MasterForm, _super);
            function MasterForm(c, x) {
                _super.call(this);
                this.buildClose2 = function (options) {
                    var thiss = this;
                    options = options || {};
                    options.container = options.container || thiss.$form;
                    if (typeof options.container === "string")
                        options.container = jQuery(options.container);
                    if (typeof options.containerMain === "string")
                        options.containerMain = jQuery(options.containerMain);
                    var $toolbar = options.container.find('>.panel>.panel-heading>.btn-toolbar');
                    var $btn = $('<button class="btn" type= "button" title= "Cerrar" ><i class="glyphicon glyphicon-remove"></i></button >');
                    var $group = $('<div></div>');
                    $group.addClass("btn-group pull-right");
                    $group.append($btn);
                    $toolbar.find('.pull-right:first').prepend($group);
                    $btn.off("click");
                    $btn.on("click", function (e) {
                        window.plugins.deviceFeedback.acoustic();
                        thiss.onCloseButton(options);
                    });
                };
            }
            MasterForm.prototype.setConfig = function (value, options, callback) {
                this.config = value;
            };
            MasterForm.prototype.attachmentConfig = function () {
                jQuery.ajaxSetup({ async: false });
                jQuery.getScript(thiss.js.path + "documentlibrary/attachment.js", function (data, textStatus, jqxhr) {
                    thiss.attachment = getInstance();
                });
                jQuery.ajaxSetup({ async: true });
            };
            MasterForm.prototype.iniConfig = function () {

            };
            MasterForm.prototype.formConfig = function () {

            };
            MasterForm.prototype.domConfig = function () {
                this.$hdnId = this.$form.find(MasterForm.HDNID);
                this.$txtName = this.$form.find(MasterForm.TXTNAME);
                this.$txaDescription = this.$form.find(MasterForm.TXADESCRIPTION);
                this.$chkState = this.$form.find(MasterForm.CHKSTATE);
                this.$btnClose = this.$form.find(MasterForm.BTNCLOSE);
                this.$btnSave = this.$form.find(MasterForm.BTNSAVE);
                this.$download = this.$form.find(MasterForm.DOWNLOAD);
                this.$divPopup = this.$form.find(MasterForm.DIVPOPUP);
            };
            MasterForm.prototype.viewConfig = function () {

            };
            MasterForm.prototype.uiConfig = function (options) {

            };
            MasterForm.prototype.buttonConfig = function () {
                var thiss = this;

                thiss.$btnSave.off("click");
                thiss.$btnSave.on("click", function (e) {
                    window.plugins.deviceFeedback.acoustic();
                    thiss.save(options.urlSave);
                });
                thiss.$download.find('a').off("click");
                thiss.$download.find('a').on("click", function (e) {
                    e.preventDefault();
                    window.plugins.deviceFeedback.acoustic();
                    thiss.download(null, jQuery(this).attr("data-format"), options);
                });
            };
            MasterForm.prototype.onCloseButton = function (options) {
                options.container.empty().hide();
                options.containerMain.show();
            };
            MasterForm.prototype.load = function (url, id, options) {
                var thiss = this;
                MasterForm.initialize = false;
                id = id || 0;
                //if (id === 0) {
                //    alert("Por favor seleccione un elemento");
                //    return;
                //}
                this.setDoms();
                options = options || {};
                thiss.$main = options.containerMain || thiss.$main;
                thiss.$form = options.container || thiss.$form;
                if (typeof thiss.$form === "string")
                    thiss.$form = jQuery(thiss.$form);
                if (typeof thiss.$main === "string")
                    thiss.$main = jQuery(thiss.$main);
                options.container = thiss.$form;
                options.containerMain = thiss.$main;
                thiss.loadView(thiss.$form, url, function () {
                    thiss.$main.hide();
                    thiss.$form.show();
                    thiss.buildClose2(options);
                    if (thiss.config.detailIsPopup === true) {
                        options.dialog = options.dialog || {};
                        options.dialog.title = options.dialog.title || "Formulario";
                        thiss.dialog(thiss.$form, options.dialog);
                    }
                    thiss.attachmentConfig();
                    thiss.spatialConfig();
                    thiss.initConfig();
                    thiss.domConfig();
                    thiss.viewConfig();
                    thiss.uiConfig(options);
                    thiss.buttonConfig(null);
                    if (typeof options.callback === "function")
                        options.callback();

                    if (thiss.getInt32(id) > 0) {
                        thiss.detail(options.urlDetail, id);
                    }
                    MasterForm.initialize = true;
                });
            };
            return MasterForm;
        })(jtm.Master);
        jtm.MasterForm = MasterForm;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));