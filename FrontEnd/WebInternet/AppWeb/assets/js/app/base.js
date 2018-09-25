var com;
(function (com) {
    (function (jtm) {
        var Base = (function () {
            function Base() {
                this.$header = null;
                this.$title = null;
                this.$subTitle = null;
                this.$titleMini = null;
                this.$window = null;
                this.$logo = null;
                this.$body = null;
                this.$footer = null;
                this.$copyright = null;
                this.$suite = null;
                this.$year = null;
                this.$product = null;
                this.$user = null;
                this.$toolbar = null;
                this.$main = null;
                this.$form = null;
                this.$widget = null;
                this.$widgetHeader = null;
                this.$widgetBody = null;
                this.$loading = null;
                this.$message = null;
                this.apigeo = "";
                this.js = null;
                this.json = null;
                this.config = null;
                this.img = null;
                this._heightWindow = 0;
                this._heightHeader = 0;
                this._heightFooter = 0;
                this._heightBody = 0;
                this.db = null;
                this.getInt32 = function (value) {
                    if (value === undefined || value === null || value <= 0
                        || value === '' || value === ' ')
                        return 0;
                    else
                        return value;
                };
                this.getUUID = function () {
                    return com.jtm.helper.Random.getUUID();
                };
                this.dialogDestroy = function (e, ui) {
                    jQuery(this).dialog('destroy');
                };
                this.dialogDestroyEmpty = function (e, ui) {
                    jQuery(this).dialog('destroy').empty();
                };
                this.loadView = function (dom, url, callback) {
                    var thiss = this;
                    Base.ISAJAX = false;
                    if (typeof dom === 'string')
                        dom = jQuery(dom);
                    dom.empty();
                    url = url.includes("?") ? url + "&" : url + "?";
                    jQuery.get(url + Math.random(), function (responseText, textStatus, request) {
                        if (request.status !== 200)
                            return;
                        Base.ISAJAX = true;
                        dom.html(responseText);
                        dom.show();
                        thiss.setBaseDoms();
                        thiss.setHeights();
                        callback();
                    });
                };
                this.removeClass = function (element, cssClass, closestElement) {
                    if (typeof element === "string")
                        element = jQuery(element);
                    if (closestElement !== undefined && closestElement !== null && closestElement !== "")
                        element.closest(closestElement).find("." + cssClass).removeClass(cssClass);
                    else
                        element.siblings().removeClass(cssClass);
                };
                this.eventsConfig = function () {
                    $.Finger = {
                        preventDefault: true,
                        pressDuration: 300,
                        doubleTapInterval: 300,
                        flickDuration: 150,
                        motionThreshold: 5
                    };
                };
                this.pluginConfig = function () {
                    var thiss = this;
                    $.fn.datepicker.defaults = {
                        format: thiss.config.date.format,
                        maxViewMode: 4,
                        clearBtn: true,
                        autoclose: true,
                        toggleActive: true,
                        language: 'es',
                        todayBtn: true,
                        todayHighlight: true
                    };
                    // moment.locale('es');
                    moment().format(thiss.config.date.format);
                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": true,
                        "positionClass": "toast-bottom-right",
                        "preventDuplicates": true,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };
                };
                this.ajax = function (options, callbackDone, callbackFail, callbackAlways) {
                    if (!(options instanceof Object))
                        throw "Objeto no válido";
                    var thiss = this;
                    options.attachments = options.attachments || [];
                    var isFormData = options.attachments.length === 0 ? false : true;
                    var isJson = (options.isJson === undefined || options.isJson === null) ? true : options.isJson;
                    var cache = true;
                    var processData = true;
                    var data = null;
                    var async = typeof options.async === "boolean" ? options.async : true;
                    var dataType = (options.dataType === undefined || options.dataType === null) ? "json" : options.dataType;
                    var method = (options.method === undefined || options.method === null) ? "POST" : options.method;
                    if (isFormData === true) {
                        contentType = false;
                        cache = false;
                        processData = false;
                        data = new FormData();
                        if (isJson === false)
                            for (var i in options.data)
                                data.append(i, options.data[i]);
                        else
                            data.append("item", JSON.stringify(options.data));
                        options.attachments.forEach(function (attachment) {
                            data.append(attachment.id, attachment.file);
                        });
                    } else {
                        contentType = isJson === true ? Base.APPJSON : Base.APPFORM;
                        data = (isJson === true) ? JSON.stringify(options.data) : options.data;
                    }
                    var responseType = '';
                    if (options.dataType === 'binary') {
                        responseType = 'blob';
                        async = true;
                    } else
                        responseType = null;
                    jQuery.ajax({
                        type: method,
                        url: options.url,
                        dataType: dataType,
                        contentType: contentType,
                        cache: cache,
                        processData: processData,
                        data: data,
                        async: async,
                        // jsonp: "json.wrf",
                        // data: JSON.stringify($.extend(true,
                        // data, {additional: "foo",data:
                        // 42,})),
                        beforeSend: function () {
                            if (typeof options.validate === "function")
                                return options.validate();
                            else if (typeof options.validate === "boolean")
                                return options.validate;
                            else
                                return false;
                        },
                        xhrFields: {
                            responseType: responseType
                        },
                        xhr: function () {
                            var xhr = $.ajaxSettings.xhr();
                            xhr.addEventListener('progress', function (evt) {
                                if (evt.lengthComputable) {
                                    var percent = (evt.loaded / evt.total) * 100;
                                }
                            }, false);
                            if (xhr.upload) {
                                xhr.upload.addEventListener('progress', function (evt) {
                                    if (evt.lengthComputable) {
                                        var percent = (evt.loaded / evt.total) * 100;
                                        //console.log(percent);
                                    }
                                }, false);
                            }
                            return xhr;
                        }
                    })
                        .done(function (data, success, xhr) {
                            xhr.fileName = options.fileName
                                || "Archivo";
                            if (data instanceof Blob)
                                thiss.download(data, xhr);
                            else {
                                if (data.hasOwnProperty("success") === true)
                                    if (data.success === true) {
                                        callbackDone(data);
                                    } else
                                        alert(data.message,
                                            thiss.title);
                                else
                                    callbackDone(data);
                            }
                        }).fail(function (xhr, status, error) {
                            if (typeof callbackFail === "function")
                                callbackFail(xhr, status, error);
                        }).always(function (data, success, xhr) {
                            if (typeof callbackAlways === "function")
                                callbackAlways(data, success, xhr);
                        });
                };
                this.datePicker = function (container) {
                    var thiss = this;
                    if (typeof container === 'string')
                        container = jQuery(container);
                    container.datepicker({
                        format: thiss.config.date.format.toLowerCase(),
                        maxViewMode: 4,
                        orientation: "bottom",
                        clearBtn: false,
                        autoclose: true,
                        toggleActive: true,
                        language: 'es',
                        todayBtn: true,
                        todayHighlight: true
                    }).keyup(function (e) {
                        if (e.keyCode === 8 || e.keyCode === 46) {
                            container.val('');
                        }
                    });// .next().insertBefore(dtp);
                    container.datepicker({
                        minDate: -1,
                        maxDate: -2
                    }).attr('readonly', 'readonly');
                };
                this.enterSearch = function (dom, callback) {
                    var code = '';
                    if (typeof dom === 'string')
                        dom = jQuery(dom);
                    dom.find(':input:text').each(function () {
                        jQuery(this).keypress(function (e) {
                            code = (e.keyCode ? e.keyCode : e.which);
                            if (code === 13) {
                                if (typeof callback !== 'function')
                                    callback();
                                return false;
                            }
                        });
                    });
                };
                this.download = function (result, xhr) {
                    var pattern = /(attachment|inline);\s+filename=/;
                    var fileName = xhr.getResponseHeader("Content-Disposition");
                    fileName = (fileName === null ? xhr.fileName : fileName);
                    fileName = fileName.replace(pattern, "").replace(" ", "_");
                    var url = URL.createObjectURL(result);
                    var $a = $('<a />', {
                        'href': url,
                        'download': fileName,
                        'text': "click"
                    }).hide().appendTo("body")[0].click();
                    setTimeout(function () {
                        URL.revokeObjectURL(url);
                    }, 10000);
                };
                this.alias = function (method) {
                    return function () {
                        return this[method].apply(this, arguments);
                    };
                };
                this.loadingShow = function () {
                    $(Base.DOMLOADING).show();
                };
                this.loadingHide = function () {
                    $(Base.DOMLOADING).hide();
                };
                this.tableEmpty = function (tbl, message, options, callback) {
                    message = message || "No se encontraron datos";
                    if (typeof tbl === 'string')
                        tbl = jQuery(tbl);
                    var columnCounts = tbl.find(">thead>tr>th").length;
                    if ((tbl).find(">tbody").length === 0)
                        tbl.append("tbody></tbody>");
                    tbl.append('<tr><td colspan="' + columnCounts + '">'
                        + message + '</td></tr>');
                };
                this.formPager = function (container, options) {
                    var thiss = this;
                    container = container || "#divContent";
                    if (typeof container === 'string')
                        container = jQuery(container);
                    options = options || {};
                    options.selector = options.selector || '.pager-item';
                    options.btnNext = options.btnNext || '#next';
                    options.btnPrevious = options.btnPrevious || '#previous';
                    var $divs = container.find(">" + options.selector);
                    $divs.hide();
                    $divs.first().show();
                    var $current = $divs.first();
                    var $temp = $current;
                    thiss.callbackFormPager($current);
                    setPrevious();
                    setNext();
                    $(options.btnNext).off("click");
                    $(options.btnNext).on("click", function () {
                        window.plugins.deviceFeedback.acoustic();
                        $current.hide();
                        $current = $current.next(options.selector);
                        if ($current.length > 0) {
                            $temp = $current;
                            $current.show();
                            thiss.callbackFormPager($current);
                        }
                        if ($temp.next(options.selector).length === 0)
                            jQuery(this).hide();
                        setPrevious();
                    });
                    $(options.btnPrevious).off("click");
                    $(options.btnPrevious).on("click", function () {
                        window.plugins.deviceFeedback.acoustic();
                        $current.hide();
                        $current = $current.prev(options.selector);
                        if ($current.length > 0) {
                            $temp = $current;
                            $current.show();
                            thiss.callbackFormPager($current);
                        }
                        if ($temp.prev(options.selector).length === 0)
                            jQuery(this).hide();
                        setNext();
                    });
                    function setPrevious() {
                        if ($temp.prev(options.selector).length > 0)
                            $(options.btnPrevious).show();
                        else
                            $(options.btnPrevious).hide();
                    }
                    function setNext() {
                        if ($temp.next(options.selector).length > 0)
                            $(options.btnNext).show();
                        else
                            $(options.btnNext).hide();
                    }
                };
                
                this.worker = function (fileJS, options, callback) {
                    var worker = new Worker(fileJS);
                    jQuery(worker).on("message", function (e) {
                        callback(e);
                    });
                };
                this.openDatabase = function () {
                    var thiss = this;
                    if (window.sqlitePlugin !== undefined)
                        return window.sqlitePlugin.openDatabase({
                            name: thiss.config.db.name,
                            iosDatabaseLocation: 'default',
                            createFromLocation: 1,
                            androidDatabaseImplementation: 2,
                            androidLockWorkaround: 1
                        });
                    else
                        return null;
                };
                this.listDb = function (ddl, sql, options, callback) {
                    var thiss = this;
                    thiss.db = thiss.openDatabase();
                    thiss.db.readTransaction(function (tx) {
                        tx.executeSql(sql, [], function (tx, rs) {
                            var length = rs.rows.length;
                            var items = [];
                            var i = 0;
                            for (i = 0; i < length; i++) {
                                items.push({
                                    id: rs.rows.item(i).id,
                                    name: rs.rows.item(i).name
                                });
                            }
                            com.jtm.helper.DropDownList.fillLocal({
                                ddl: ddl,
                                items: items
                            });
                        }, function (tx, error) {
                            console.log('SELECT error: ' + error.message);
                        });
                    }, function (error) {
                        console.log('transaction error: ' + error.message);
                    }, function () {
                        console.log('transaction ok');
                    });
                };
                this.chartToCanvas = function (chart) {//svg2
                    var render_width = EXPORT_WIDTH;
                    var render_height = render_width * chart.chartHeight / chart.chartWidth

                    // Get the cart's SVG code
                    var svg = chart.getSVG({
                        exporting: {
                            sourceWidth: chart.chartWidth,
                            sourceHeight: chart.chartHeight
                        }
                    });

                    // Create a canvas
                    var canvas = document.createElement('canvas');
                    canvas.height = render_height;
                    canvas.width = render_width;
                    document.body.appendChild(canvas);

                    // Create an image and draw the SVG onto the canvas
                    var image = new Image;
                    image.onload = function () {
                        canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
                    };
                    image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
                };
                this.chartToCanvas2 = function () {
                    var svgElements = $("#container").find('svg');

                    //replace all svgs with a temp canvas
                    svgElements.each(function () {
                        var canvas, xml;

                        // canvg doesn't cope very well with em font sizes so find the calculated size in pixels and replace it in the element.
                        $.each($(this).find('[style*=em]'), function (index, el) {
                            $(this).css('font-size', getStyle(el, 'font-size'));
                        });

                        canvas = document.createElement("canvas");
                        canvas.className = "screenShotTempCanvas";
                        //convert SVG into a XML string
                        xml = (new XMLSerializer()).serializeToString(this);

                        // Removing the name space as IE throws an error
                        xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                        //draw the SVG onto a canvas
                        canvg(canvas, xml);
                        $(canvas).insertAfter(this);
                        //hide the SVG element
                        ////this.className = "tempHide";
                        $(this).attr('class', 'tempHide');
                        $(this).hide();
                    });
                };
                this.svg2Canvas = function () {
                    var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
                    var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext("2d");
                    var img = new Image();
                    var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                    var url = window.URL.createObjectURL(svg);
                    img.onload = function () {
                        ctx.drawImage(img, 0, 0);
                        var png = canvas.toDataURL("image/png");
                        document.querySelector('#png-container').innerHTML = '<img src="' + png + '"/>';
                        window.URL.revokeObjectURL(png);
                    };
                    img.src = url;
                };
                this.svg2Canvas2 = function () {
                    var canvas = document.getElementById('canvas');
                    var ctx = canvas.getContext('2d');

                    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                        '<foreignObject width="100%" height="100%">' +
                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
                        '<em>I</em> like <span style="color:white; text-shadow:0 0 2px blue;">cheese</span>' +
                        '</div>' +
                        '</foreignObject>' +
                        '</svg>';
                    var img = new Image();
                    var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
                    var url = window.URL.createObjectURL(svg);

                    img.onload = function () {
                        ctx.drawImage(img, 0, 0);
                        window.URL.revokeObjectURL(url);
                    }

                    img.src = url;
                };
            }
            Base.ISLOCAL = false;
            Base.AFTERLOAD = false;
            Base.MODULE = '';
            Base.SUBMODULE = '';
            Base.ISAJAX = false;
            Base.USERSESSIONNAME='user';
            Base.OPENASYNC = "jca-open-async";
            Base.TOGGLE = "jca-toggle";
            Base.ACTIVE = "active";
            Base.ELEMENTSELECTED = "gh-selected";
            Base.DDLVALUEDEFAULT2 = "-1";
            Base.DDLVALUEDEFAULT = "0";
            Base.DDLDISPLAYDEFAULT = "--Seleccione--";
            Base.KILOMETER = 1000;
            Base.HECTARE = 10000;
            Base.METER = 100;
            Base.APPJSON = 'application/json; charset=utf-8';
            Base.APPFORM = 'application/x-www-form-urlencoded; charset=UTF-8';
            Base.TITLE = "App";
            Base.DATEFORMAT = "yyyy-MM-dd";
            Base.DATETIMEFORMAT = "yyyy-MM-dd HH:mm:ss";
            Base.PROXY = "";
            Base.DOMLOADING = '#divLoading';
            Base.DOMHEADER = '#jcaHeader';
            Base.DOMBODY = '#jcaBody';
            Base.DOMFOOTER = '#jcaFooter';
            Base.DOMMAIN = '#jcaMain';
            Base.DOMFORM = '#jcaForm';
            Base.DOMWIDGET = '#jcaWidget';
            Base.DOMWIDGETHEADER = '#jcaWidgetHeader';
            Base.DOMWIDGETFOOTER = '#jcaWidgetFooter';
            Base.DOMWIDGETBODY = '#jcaWidgetBody';
            Base.DOMTITLE = '#jcaTitle';
            Base.DOMTITLETITLE = '#jcaTitleMini';
            Base.DOMSUBTITLE = '#jcaSubTitle';
            Base.DOMLOGO = '#jcaLogo';
            Base.DOMCOPYRIGHT = '#spnCopyright';
            Base.DOMSUITE = '#spnSuite';
            Base.DOMYEAR = '#spnYear';
            Base.DOMPRODUCT = '#spnProduct';
            Base.DOMUSER = '#spnUser';
            Base.DOMMESSAGE = '#message';
            Base.initialize = false;
            Base.LOADINGMESSAGE = "Espere por favor";
            Base.NEWELEMENTID = 'Primero guarde la ficha';
            Base.DEVICECONNECTMESSAGE = "";
            Base.COUNTCHARSMESSAGE = 145;
            Base.JSBASE = com.jtm.Server.contextPath + "assets/js/app/";
            Base.JSONBASE = com.jtm.Server.contextPath + "assets/json/app/";
            Base.IMGBASE = com.jtm.Server.contextPath + 'assets/css/img/';
            Base.maintainSession = function () {
                setInterval(function () {
                    task();
                }, com.jtm.Server.sessionTimeout);
                function task() {
                    var head = document.getElementsByTagName('head').item(0);
                    var script = document.createElement('script');
                    script.src = com.jtm.Server.contextPath + "user/renewsession";
                    script.setAttribute('type', 'text/javascript');
                    script.defer = true;
                    head.appendChild(script);
                }
            };
            Base.ajaxSetup = function () {
                jQuery.ajaxSetup({
                    statusCode: {
                        400: error400,
                        401: error401,
                        403: error403,
                        500: error500,
                        501: error501,
                        503: error503,
                        600: error600,
                        601: error601
                    }
                    /* , timeout: 1000 * 60 */
                });
                function error400(data, error, message) {
                }
                function error401(data, error, message) {
                }
                function error403(data, error, message) {
                }
                function error500(data, error, message) {
                }
                function error501(data, error, message) {
                }
                function error503(data, error, message) {
                }
                function error600(data, error, message) {
                    var item = jQuery.parseJSON(data.responseText);
                    alert(item.message);
                    setTimeout(reloadPage, 3000);
                    function reloadPage() {
                        location.reload();
                    }
                }
                function error601(data, error, message) {
                    // jQuery(window).ajaxStop();
                    var item = jQuery.parseJSON(data.responseText);
                    alert(item.message);
                }
            };
            Base.configLoading = function () {
                var $div = jQuery(Base.DOMLOADING);
                $div.hide();
                $div.css("position", "fixed").css("width", "50%").css("height",
                    "15px").css("margin-left", "25%").css("z-index", 99999);
                $div
                    .html('<div style="width: 100%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="100" role="progressbar" class="progress-bar progress-bar-striped  gh-progress-bar active"><b>'
                    + Base.LOADINGMESSAGE + '<b></div>');
            };
            Base.loadingSetup = function () {
                Base.configLoading();
                var $div = jQuery(Base.DOMLOADING);
                try {
                    // Ajax events fire in following order
                    jQuery(document).ajaxStart(function () {
                        $div.show();
                    }).ajaxSend(function (e, xhr, opts) {
                    }).ajaxError(function (e, xhr, opts) {
                        if (500 == xhr.status) {
                            document.location.replace("");
                            return;
                        }
                        $div.hide();
                    }).ajaxSuccess(function (e, xhr, opts) {
                    }).ajaxComplete(function (e, xhr, opts) {
                    }).ajaxStop(function () {
                        $div.hide();
                    });
                } catch (e) {
                    $div.hide();
                }
            };
            Base.loadingSetupDojo = function () {
                if (window.dojo !== undefined && window.dojo !== null) {
                    var $div = jQuery(Base.DOMLOADING);
                    require(["dojo/request/notify"], function (notify) {
                        notify("start", function () {
                            $div.show();
                            // Do something when the request queue has started
                            // This event won't fire again until "stop" has
                            // fired
                        });
                        notify("send", function (response, cancel) {
                            // Do something before a request has been sent
                            // Calling cancel() will prevent the request from
                            // being sent
                        });
                        notify("load", function (response) {
                            // Do something when a request has succeeded
                        });
                        notify("error", function (error) {
                            $div.hide();
                        });
                        notify("done", function (responseOrError) {
                            $div.hide();
                            // Do something whether a request has succeeded or
                            // failed
                            if (responseOrError instanceof Error) {
                                // Do something when a request has failed
                            } else {
                                // Do something when a request has succeeded
                            }
                        });
                        notify("stop", function () {
                            $div.hide();
                            // Do something when all in-flight requests have
                            // finished
                        });
                    });
                }
            };
            Base.spatialDependencies = function (apigeo) {
                var jss = [];
                var csss = [];
                var isRequired = false;
                apigeo = apigeo.replace(/(\/|\.)/, "");
                if (apigeo === "esri") {
                    jss.push("http://js.arcgis.com/3.20/init.js");
                    jss.push(com.jtm.Server.contextPath + "assets/js/esriextend.min.js");
                    csss.push("http://js.arcgis.com/3.20/esri/css/esri.css");
                    csss.push(com.jtm.Server.contextPath + "assets/css/esriextend.min.css");
                    isRequired = true;
                } else if (apigeo === "openlayers") {
                    jss.push("https://cdnjs.cloudflare.com/ajax/libs/ol3/4.0.1/ol-debug.js");
                    jss.push("https://cdn.rawgit.com/walkermatt/ol3-popup/master/src/ol3-popup.js");
                    jss.push(com.jtm.Server.contextPath + "assets/js/openlayersextend.min.js");
                    csss.push("https://cdnjs.cloudflare.com/ajax/libs/ol3/4.0.1/ol-debug.css");
                    csss.push("https://cdn.rawgit.com/walkermatt/ol3-popup/master/src/ol3-popup.css");
                    csss.push(com.jtm.Server.contextPath + "assets/css/openlayersextend.min.css");
                } else if (apigeo === "leaflet") {
                    jss.push("https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js");
                    jss.push(com.jtm.Server.contextPath + "assets/js/leafletextend.min.js");
                    csss.push("https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css");
                    csss.push(com.jtm.Server.contextPath + "assets/css/leafletextend.min.css");
                } else {
                    alert("El api para mapa no es soportado", null, "Aceptar");
                    return;
                }
                Base.loadCssRecursive(csss);
                Base.loadScriptRecursive(jss, isRequired);
            };
            Base.dojoRequired = function () {
                dojo.require("dojo.promise.all");
                dojo.require("esri.map");
                dojo.require("esri.SpatialReference");
                dojo.require("esri.dijit.OverviewMap");
                dojo.require("esri.dijit.Scalebar");
                dojo.require("esri.renderers.SimpleRenderer");
                dojo.require("esri.units");
                dojo.require("esri.virtualearth.VETiledLayer");
                dojo.require("esri.layers.osm");
                dojo.require("esri.layers.wms");
                dojo.require("esri.layers.WebTiledLayer");
                dojo.require("esri.layers.WFSLayer");
                dojo.require("esri.geometry.geometryEngine");
                dojo.require("esri.geometry.Extent");
                dojo.require("esri.geometry.Circle");
                dojo.require("esri.symbols.Font");
                dojo.require("esri.symbols.SimpleMarkerSymbol");
                dojo.require("esri.symbols.SimpleLineSymbol");
                dojo.require("esri.symbols.SimpleFillSymbol");
                dojo.require("esri.symbols.TextSymbol");
                dojo.require("esri.toolbars.navigation");
                dojo.require("esri.toolbars.draw");
                dojo.require("esri.tasks.geometry");
                dojo.require("esri.tasks.AlgorithmicColorRamp");
                dojo.require("esri.tasks.UniqueValueDefinition");
                dojo.require("esri.tasks.GenerateRendererTask");
                dojo.require("esri.tasks.GenerateRendererParameters");
                dojo.require("esri.tasks.ProjectParameters");
                dojo.require("esri.tasks.LegendLayer");
                dojo.require("esri.tasks.PrintParameters");
                dojo.require("esri.tasks.PrintTask");
                dojo.require("esri.tasks.PrintTemplate");
                dojo.require("esri.tasks.IdentifyParameters");
                dojo.require("esri.tasks.identify");
                dojo.require("esri.tasks.gp");
                dojo.require("esri.tasks.LengthsParameters");
                dojo.require("esri.tasks.AreasAndLengthsParameters");
                dojo.require("esri.tasks.query");
            };
            Base.loadScriptRecursive = function (els, isRequired) {
                var js = els.shift();
                var el = document.createElement('script');
                el.setAttribute("type", "text/javascript");
                el.async = false;
                document.head.appendChild(el);
                if (el.readyState) {
                    el.onreadystatechange = function (e) {
                        if (el.readyState == "loaded"
                            || el.readyState == "complete") {
                            el.onreadystatechange = null;
                            if (els.length > 0)
                                Base.loadScriptRecursive(els, isRequired);
                            else if (isRequired === true)
                                Base.dojoRequired();
                        }
                    };
                } else {
                    el.onload = function (e) {
                        if (els.length > 0)
                            Base.loadScriptRecursive(els, isRequired);
                        else if (isRequired === true)
                            Base.dojoRequired();
                    };
                }
                el.src = js;
            };
            Base.loadCssRecursive = function (els) {
                var css = els.shift();
                var el = document.createElement('link');
                document.head.appendChild(el);
                el.setAttribute('rel', "stylesheet");
                if (el.readyState) {
                    el.onreadystatechange = function (e) {
                        if (el.readyState == "loaded"
                            || el.readyState == "complete") {
                            el.onreadystatechange = null;
                            if (els.length > 0)
                                Base.loadCssRecursive(els);
                        }
                    };
                } else
                    el.onload = function (e) {
                        if (els.length > 0)
                            Base.loadCssRecursive(els);
                    };
                el.setAttribute('href', css);
            };
            Base.templateDependencies = function (template) {
                var link = document.createElement('link');
                link.setAttribute('rel', "stylesheet");
                link.setAttribute('href', template + "app.min.css");
                document.head.appendChild(link);
            };
            Base.mobileDependencies = function () {
                var link = document.createElement('link');
                link.setAttribute('rel', "stylesheet");
                link.setAttribute('href', com.jtm.Server.contextPath
                    + "assets/css/mobile.min.css");
                document.head.appendChild(link);
            };
            Base.addScripts = function ($head, els) {
                var js = els.shift();
                var el = $('<script type="text/javascript" async="false"></script>');
                $head.append(el);
                el.on("load", function (e) {
                    if (els.length > 0)
                        Base.addScripts($head, els);
                });
                el.attr("src", js);
                el.trigger("load");
            };
            Base.addCsss = function ($head, els) {
                var css = els.shift();
                var el = $('<link rel="stylesheet"/>');
                $head.append(el);
                el.on("load", function (e) {
                    if (els.length > 0)
                        Base.addCsss($head, els);
                });
                el.attr("href", css);
                el.trigger("load");
            };
            Base.execute = function () {
                alert("No puede inicializar");
            };
            Base.prototype = {
                validate: function () {
                },
                report: function () {
                },
                clean: function (container) {
                    var thiss = this;
                    container = (container === undefined || container === null || container === '') ? thiss.$main : container;
                    if (typeof container === 'string')
                        container = jQuery(container);
                    if (typeof tbl === 'string')
                        tbl = jQuery(tbl);
                    container.find('input[type=text]').each(function () {
                        jQuery(this).val('');
                    });
                    container.find('select').each(function () {
                        jQuery(this).val(0);
                    });
                    container.find('table>tbody').each(function () {
                        jQuery(this).empty();
                    });
                },
                load: function (jsonFile, options, callback) {
                    var thiss = this;
                    options = options || {};
                    options.dom = options.dom || Base.DOMBODY;
                    options.framework = options.framework || null;
                    thiss.setRoots(options);
                    if (Base.ISAJAX === false) {
                        var body = document.createElement('body');
                        body.setAttribute("id", "bodyTemp");
                        var html = document.getElementsByTagName('html');
                        html[0].appendChild(body);
                        var $loading = jQuery('<div></div>');
                        jQuery('body').append($loading);
                        $loading.text("Cargando...");
                        if (Base.AFTERLOAD !== true) {
                            Base.spatialDependencies(thiss.apigeo);
                            Base.templateDependencies(com.jtm.System.template);
                        }
                        jQuery(window).on("load", function () {
                            jQuery('#bodyTemp').remove();
                            $loading.empty();
                            $loading.remove();
                            if (typeof options.dom === 'string')
                                options.dom = jQuery(options.dom);
                            thiss.$main = options.dom;
                            delete options.dom;
                            if (Base.AFTERLOAD === true) {
                                Base.spatialDependencies(thiss.apigeo);
                                Base.templateDependencies(com.jtm.System.template);
                            }
                            Base.maintainSession();
                            Base.ajaxSetup();
                            Base.loadingSetup();
                            Base.loadingSetupDojo();
                            window.URL = window.URL || window.webkitURL || window;
                            if ((window.cordova !== undefined && window.cordova !== null) === true) {
                                Base.mobileDependencies();
                                jQuery(Base.DOMLOADING + ">div>b").text(Base.DEVICECONNECTMESSAGE);
                                jQuery(document).on("deviceready", function (e) {
                                    jQuery(Base.DOMLOADING + ">div>b").text(Base.LOADINGMESSAGE);
                                    window.alert = navigator.notification.alert;
                                    window.confirm = navigator.notification.confirm;
                                    window.prompt = navigator.notification.prompt;
                                    window.beep = navigator.notification.beep;
                                    window.open = cordova.InAppBrowser.open;
                                    //document.addEventListener('pause', onPause.bind(this), false);
                                    //document.addEventListener('resume', onResume.bind(this), false);
                                    //openURL: function(url) {
                                    //    if (device.platform === 'Android') {
                                    //        navigator.app.loadUrl(url, { openExternal: true });
                                    //    } else {
                                    //        window.open(url, '_system');
                                    //    }
                                    //}
                                    thiss.setModule(jsonFile, options, null);
                                });
                            } else {
                                window.plugins = window.plugins || {};
                                window.plugins.deviceFeedback = window.plugins.deviceFeedback || {};
                                window.plugins.deviceFeedback.acoustic = window.plugins.deviceFeedback.acoustic || function () {
                                };
                                thiss.setModule(jsonFile, options, null);
                            }
                        });
                    } else
                        thiss.setModule(jsonFile, options, null);
                },
                setModule: function (jsonFile, options, callback) {
                    var thiss = this;
                    Base.ISAJAX = false;
                    thiss.eventsConfig();
                    var fileConfig = com.jtm.helper.Request.queryString("config");
                    fileConfig = fileConfig === null ? "app.json" : fileConfig + ".json";
                    jQuery.ajaxSetup({ async: false });
                    jQuery.getJSON(thiss.json.path + fileConfig + "?" + Math.random(), function (data, textStatus, jqXHR) {
                        thiss.config = data;
                    });
                    jQuery.ajaxSetup({ async: true });
                    if (thiss.config === null) {
                        alert("No existe la configuración");
                        return;
                    }
                    thiss.pluginConfig();
                    thiss.setBaseDoms();
                    thiss.setDoms();
                    thiss.setHeights();
                    thiss.setDefaultValues();
                    //jsonFile = String.isNullOrWhiteSpace(jsonFile) === true ? thiss.json.module.path : jsonFile;
                    fileConfig = com.jtm.helper.Request.queryString("configmodule");
                    if (String.isNullOrWhiteSpace(jsonFile) === false || String.isNullOrWhiteSpace(fileConfig) === false)
                        jsonFile = String.isNullOrWhiteSpace(fileConfig) === true ? jsonFile : fileConfig;
                    thiss.loadConfig({ jsonFile: jsonFile, config: thiss.config, property: "module" }, callback);
                },
                loadConfig: function (options, callback) {
                    var thiss = this;
                    //delete thiss.module;
                    if (String.isNullOrWhiteSpace(options.jsonFile) === false) {
                        options.jsonFile = options.jsonFile.endsWith(".json") ? options.jsonFile : options.jsonFile + ".json";
                        options.jsonFile = options.jsonFile.startsWith("/") ? options.jsonFile : thiss.json.module.subModule.path + options.jsonFile;
                        jQuery.ajaxSetup({ async: false });
                        jQuery.getJSON(options.jsonFile + "?" + Math.random(), function (data, textStatus, jqXHR) {
                            options.config[options.property] = data;
                        });
                        jQuery.ajaxSetup({ async: true });
                        if (options.config[options.property] === null) {
                            alert("No existe la configuración del módulo");
                            return;
                        }
                    }
                    if (typeof callback === "function")
                        callback();
                },
                setConfig: function (value, options, callback) {
                    this.config = value;
                    options.config = options.config || value;
                    this.loadConfig(options, callback);
                },
                setRoots: function (options) {
                    var thiss = this;
                    var framework = options;
                    if (typeof options === "string") {
                        options = {};
                        options.module = Base.MODULE;
                        options.subModule = Base.SUBMODULE;
                        options.framework = framework;
                    } else {
                        options = options || {};
                        options.module = options.module || Base.MODULE;
                        options.subModule = options.subModule || Base.SUBMODULE;
                        options.framework = options.framework || com.jtm.system.Spatial.apiGeo;
                    }
                    framework = String.isNullOrWhiteSpace(options.framework) === true ? "" : options.framework + "/";
                    var module = String.isNullOrWhiteSpace(options.module) ? "" : (options.module.endsWith("/") === true ? options.module : options.module + "/");
                    var subModule = String.isNullOrWhiteSpace(options.subModule) ? "" : (options.subModule.endsWith("/") === true ? options.subModule : options.subModule + "/");
                    this.apigeo = framework;
                    this.js = { path: Base.JSBASE };
                    this.js.apigeo = { path: framework };
                    this.js.module = { path: this.js.path + module };
                    this.js.module.subModule = { path: this.js.module.path + subModule };
                    this.js.module.widget = { path: this.js.module.path + "widgets/" };
                    this.js.module.subModule.widget = { path: this.js.module.subModule.path + "widgets/" };
                    this.json = { path: Base.JSONBASE };
                    this.json.module = { path: this.json.path + module };
                    this.json.module.subModule = { path: this.json.module.path + subModule };
                    this.json.module.widget = { path: this.json.module.path + "widgets/" };
                    this.json.module.subModule.widget = { path: this.json.module.subModule.path + "widgets/" };
                    this.img = { path: Base.IMGBASE };
                },
                setBaseDoms: function () {
                    this.$window = jQuery(window);
                    this.$header = jQuery(Base.DOMHEADER);
                    this.$body = jQuery(Base.DOMBODY);
                    this.$footer = jQuery(Base.DOMFOOTER);
                    this.$loading = jQuery(Base.DOMLOADING);
                },
                setDoms: function () {
                    this.$main = jQuery(Base.DOMMAIN);
                    this.$form = jQuery(Base.DOMFORM);
                    this.$title = jQuery(Base.DOMTITLE);
                    this.$titleMini = jQuery(Base.DOMTITLEMINI);
                    this.$subTitle = jQuery(Base.DOMSUBTITLE);
                    this.$logo = jQuery(Base.DOMLOGO);
                    this.$copyright = jQuery(Base.DOMCOPYRIGHT);
                    this.$suite = jQuery(Base.DOMSUITE);
                    this.$year = jQuery(Base.DOMYEAR);
                    this.$product = jQuery(Base.DOMPRODUCT);
                    this.$user = jQuery(Base.DOMUSER);
                },
                setHeights: function () {
                    if (this.$window !== null)
                        this._heightWindow = this.$window.outerHeight(true);
                    if (this.$header !== null)
                        this._heightHeader = this.$header.outerHeight(true);
                    if (this.$body !== null)
                        this._heightBody = this.$body.outerHeight(true);
                    if (this.$footer !== null)
                        this._heightFooter = this.$footer.outerHeight(true);
                },
                setDefaultValues: function () {
                    var thiss = this;
                    if (thiss.config === null)
                        return;
                    thiss.$title.html(thiss.config.title);
                    thiss.$subTitle.html(thiss.config.subtitle);
                    if (String.isNullOrWhiteSpace(thiss.config.titleMini) === false)
                        thiss.$titleMini.html(thiss.config.titleMini);
                    else
                        thiss.$titleMini.html(thiss.config.title);
                    thiss.$logo.attr("src", com.jtm.System.img + thiss.config.logo);
                    thiss.$logo.attr("alt", thiss.config.title);
                    thiss.$logo.attr("title", thiss.config.title);
                    thiss.$copyright.text(thiss.config.footer.copyright);
                    thiss.$suite.text(thiss.config.footer.suite);
                    thiss.$year.text(thiss.config.footer.year);
                    thiss.$product.text(thiss.config.footer.product);
                    if ((window.cordova !== undefined && window.cordova !== null) === true)
                        thiss.config.proxy = '';
                    if (String.isNullOrWhiteSpace(thiss.config.proxy) === false) {
                        thiss.config.proxy = thiss.config.proxy.startsWith("http") ? thiss.config.proxy : com.jtm.Server.contextPath + thiss.config.proxy;
                        thiss.config.proxy = thiss.config.proxy + "?url=";
                    }
                    if (String.isNullOrWhiteSpace(thiss.config.restServer) === false) {
                        thiss.config.restServer = thiss.config.restServer.startsWith("http") ? thiss.config.restServer : com.jtm.Server.contextPath + thiss.config.restServer;
                        thiss.config.restServer = thiss.config.restServer.endsWith("/") ? thiss.config.restServer : thiss.config.restServer + "/";
                    }
                },
                loadDependencies: function (dependencies) {
                    var thiss = this;
                    if (dependencies === undefined || dependencies === null
                        || dependencies === "")
                        return;
                    var items = [];
                    if (typeof dependencies === "string")
                        items.push(dependencies);
                    else {
                        dependencies.forEach(function (dependencie) {
                            if (typeof dependencie === "string")
                                items.push({
                                    url: (dependencie), callback: function (data) {
                                    }
                                });
                            else
                                items.push({
                                    url: (dependencie.url),
                                    callback: dependencie.callback
                                });
                        });
                    }
                    jQuery.ajaxSetup({ async: false });
                    items.forEach(function (item) {
                        jQuery.getScript(item.url, item.callback);
                    });
                    jQuery.ajaxSetup({ async: true });
                },
                cleanControls: function () {
                },
                resetContainers: function (toNull) {
                },
                callbackFormPager : function ($pagerItem) {

                }
            };
            return Base;
        })();
        jtm.Base = Base;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));