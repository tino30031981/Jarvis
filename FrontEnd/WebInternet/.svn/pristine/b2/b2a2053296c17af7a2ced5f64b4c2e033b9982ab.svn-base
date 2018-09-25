(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseMapWidget = (function (_super) {
                __extends(BaseMapWidget, _super);
                function BaseMapWidget() {
                    _super.call(this);
                    this.$map = null;
                    this.$toolbarLeft = null;
                    this.$toolbarRight = null;
                    this.$toolbarBottom = null;
                    this.$toolNorthArrow = null;
                    this.$btnPoint = null;
                    this.$btnMultiPoint = null;
                    this.$btnRectangle = null;
                    this.$btnLine = null;
                    this.$btnPolyline = null;
                    this.$btnPolylineFreeHand = null;
                    this.$btnPolygon = null;
                    this.$btnPolygonFreeHand = null;
                    this.$btnCircle = null;
                    this.$btnEllipse = null;
                    this.$btnArrow = null;
                    this.$btnText = null;
                    this.$btnXY = null;
                    this.$btnXYR = null;
                    this.$btnXYMM = null;
                    this.$btnFileCoordinate = null;
                    this.$ddlSpatialReference = null;
                    this.$ddlZoneUTM = null;
                    this.$txtX = null;
                    this.$txtY = null;
                    this.$txtRadio = null;
                    this.$ddlSpatialReference = null;
                    this.$tableCoordinates = null;
                    this.$tableDistricts = null;
                    this.$tableNationalCartographies = null;
                    this.$tableHydrogrphicBasins = null;
                    this.$tableTownCenters = null;
                    this.$filFileCoordinate = null;
                    this.map = null;
                    this.draw = null;
                    this.layer = null;
                    this.layerSelected = null;
                    this.layerDraw = null;
                    this.layerGeolocation = null;
                    this.infoWindow = null;
                    this.geometryService = null;
                    this.setDomMap = function (value) {
                        this.$map = value;
                    };
                    this.setDomToolbarLeft = function (value) {
                        this.$toolbarLeft = value;
                    };
                    this.setDomToolbarRight = function (value) {
                        this.$toolbarRight = value;
                    };
                    this.setDomToolbarBottom = function (value) {
                        this.$toolbarBottom = value;
                    };
                    this.setDomToolNorthArrow = function (value) {
                        this.$toolNorthArrow = value;
                    };
                    this.parseFields = function (fields, fieldIndex) {
                        if (fields !== undefined && fields !== null)
                            if (fields.indexOf("*") > -1)
                                fields = ["*"];
                            else
                                if (fields.indexOf(fieldIndex) == -1)
                                    fields.push(fieldIndex);
                        return fields;
                    };
                }
                BaseMapWidget.JOINFIELD = 'ID';
                BaseMapWidget.SYNCHRONIZE = true;
                BaseMapWidget.EXCLUDEFIELDS = ["SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "SHAPE.AREA", "SHAPE.LEN", "Shape_Leng", "Shape.STArea()", "Shape.STLength()", "BBOX", "GEOMETRY", "GEOM", "GEOMETRIA"];
                BaseMapWidget.DOMTABLE = '#tblResult';
                BaseMapWidget.prototype.setMap = function (map) {
                    this.map = map;
                };
                BaseMapWidget.prototype.parseAnyInitConfig = function () {
                    this.parseSymbols();
                    this.parseSpatialReferences();
                    delete this.config.module.map;
                };
                BaseMapWidget.prototype.parseSymbols = function () {
                    delete this.config.module.map.symbols;
                };
                BaseMapWidget.prototype.parseSpatialReferences = function () {
                    if (this.config.module.widget.spatialReferences === undefined || this.config.module.widget.spatialReferences === null || this.config.module.widget.spatialReferences.length === 0) {
                        if (this.config.module.map === undefined || this.config.module.map === null)
                            this.config.module.widget.spatialReferences = [];
                        else
                            this.config.module.widget.spatialReferences = (this.config.module.map.spatialReferences === undefined || this.config.module.map.spatialReferences === null) ? [] : this.config.module.map.spatialReferences;
                    }
                    delete this.config.module.map.spatialReferences;
                };
                BaseMapWidget.prototype.onClick = function () {
                    var thiss = this;
                    thiss.showView({
                        dialog: { width: 200 }
                    });
                };
                BaseMapWidget.prototype.form = function (url, id, options) {
                    var thiss = this;
                    options = options || {};
                    options.width = options.width || '100%';
                    options.height = options.height || jQuery(window).height() - 50;
                    options.draggable = options.draggable || false;
                    options.dialogTitle = options.dialogTitle || "Superposicion";
                    thiss.$form = $('<div></div>').appendTo(thiss.$widget);
                    thiss.$form.dialog({
                        title: options.dialogTitle,
                        fluid: true,
                        height: options.height,
                        width: options.width,
                        resizable: false,
                        closeOnEscape: true,
                        autoOpen: true,
                        modal: true,
                        autoremove: true,
                        draggable: options.draggable
                    });
                    thiss.$form.css("overflow", "");
                    var $iframe = $('<iframe id="iframe" width="100%" height="100%" frameborder="0"></iframe>');
                    thiss.$form.append($iframe);
                    $iframe.on("load", function (e) {
                        var thisFrame = this;
                        var $head = jQuery(this.contentDocument).find("head");
                        var $title = jQuery(this.contentDocument).find("title");
                        var $btnPrint = jQuery(this.contentDocument).find("#btnPrint");
                        var jss = [];
                        var csss = [];
                        csss.push(com.jtm.Server.contextPath + 'assets/css/bootstrap.min.css');
                        jss.push(com.jtm.Server.contextPath + 'assets/js/jquery.min.js');
                        jss.push(com.jtm.Server.contextPath + 'assets/js/bootstrap.min.js');
                        BaseMapWidget.addCsss($head, csss);
                        BaseMapWidget.addScripts($head, jss);
                        $title.text(String.isNullOrWhiteSpace(options.title) ? 'Detalle' : options.title);
                        thiss.showHideToolbar(true);
                        if (String.isNullOrWhiteSpace(id) === false)
                            thiss.detail(this, id);
                        $btnPrint.off('click');
                        $btnPrint.on('click', function (e) {
                            jQuery(this).hide();
                            thisFrame.focus();
                            if (thisFrame.contentWindow)
                                thisFrame.contentWindow.print();
                            else
                                thisFrame.print();
                            jQuery(this).show();
                        });
                    });
                    $iframe.attr("src", url);
                };
                BaseMapWidget.prototype.showHideToolbar = function (isShow) {
                    var thiss = this;
                    isShow = typeof isShow === "boolean" ? isShow : false;
                    if (isShow === true) {
                        thiss.$toolbar.hide();
                        thiss.$toolNorthArrow.show();
                    } else {
                        thiss.$toolbar.show();
                        thiss.$toolNorthArrow.hide();
                    }
                };
                BaseMapWidget.prototype.detail = function (dom, id) {
                };
                BaseMapWidget.prototype.writeResultDefault = function (data, options) {
                    this.writeResult(data, this.layer, this.$table, options);
                };
                BaseMapWidget.prototype.writeResult = function (data, layer, $table, options) {
                    var thiss = this;
                    options = options || {};
                    options.joinField = options.joinField || BaseMapWidget.JOINFIELD;
                    options.synchronize = typeof options.synchronize === "boolean" ? options.synchronize : BaseMapWidget.SYNCHRONIZE;
                    options.excludeFields = !(options.excludeFields instanceof Array) ? [] : options.excludeFields;
                    options.excludeFields = options.excludeFields.concat(BaseMapWidget.EXCLUDEFIELDS);
                    if (typeof $table === "string")
                        $table = jQuery($table);
                    $table.attr("id", options.UUID);
                    if (String.isNullOrWhiteSpace(options.propertyAttribute) === false) {
                        var items = data.features.map(function (feature, i) {
                            feature.id = options.UUID + "_" + (i + 1);
                            for (var attribute in feature[options.propertyAttribute]) {
                                if (BaseMapWidget.EXCLUDEFIELDS.includes(attribute.toUpperCase()) === true)
                                    delete feature[options.propertyAttribute][attribute];
                                if (feature[options.propertyAttribute][attribute] === null)
                                    feature[options.propertyAttribute][attribute] = '';
                                else if (feature[options.propertyAttribute][attribute] !== null && feature[options.propertyAttribute][attribute].toString().startsWith("http") === true)
                                    feature[options.propertyAttribute][attribute] = '<a href="' + feature[options.propertyAttribute][attribute] + '" target="_blank" class="' + attribute + '">Ver</a>';
                                else
                                    feature[options.propertyAttribute][attribute] = feature[options.propertyAttribute][attribute];
                            }
                            return feature;
                        });
                        var item = { columns: data.fieldAliases, rows: items };
                        this.fillTable($table, item, options);
                        data.features = items;
                        this.fillLayer(layer, data);
                        if (options.synchronize === true) {
                            thiss.layerToTable(layer, $table.find("> tbody"));
                            thiss.tableToLayer($table.find(">tbody>tr"), layer);
                        }
                    }
                };
                BaseMapWidget.prototype.fillLayer = function (layer, data) {
                };
                BaseMapWidget.prototype.fillTable = function ($table, item, options) {
                    var thiss = this;
                    console.log(item);
                    options.defaultFields = options.defaultFields || [];
                    $table = (typeof $table === "string") ? jQuery($table) : $table;
                    $table.empty();
                    writeCaption();
                    writeHeader(item.columns);
                    writeBody(item.rows);
                    function writeCaption() {
                        $table.append('<caption class="text-right">Elementos encontrados: ' + item.rows.length + '</caption>');
                    }
                    function writeHeader(items) {
                        if (items !== null && items instanceof Object) {
                            $table.append("<thead></thead>");
                            $table.find('>thead').append("<tr></tr>");
                            $table.find('>thead>tr:last').append("<th>&nbsp;</th>");
                            var i = 0;
                            for (i in items) {
                                if (items[i].toUpperCase() == options.joinField.toUpperCase()) continue;
                                if (options.excludeFields.includes(items[i].toUpperCase()) === true) continue;
                                if (options.defaultFields.includes(items[i].toUpperCase()) === true) {
                                    $table.find('>thead>tr:last').append('<th data-field="' + items[i] + '">' + items[i] + '</th>');
                                }
                            }
                            if (options.report === true && (options.report !== undefined || options.report !== null))//cambio ernesto
                                $table.find('>thead>tr:last').append('<th data-field="">Reporte PDF</th>');
                        }
                    }
                    function writeBody(items) {
                        if (items !== null && items instanceof Array) {
                            $table.append("<tbody></tbody>");
                            if (items.length > 0) {
                                var i = 0;
                                for (i = 0; i < items.length; i++) {
                                    var attributes = items[i][options.propertyAttribute];
                                    $table.find('>tbody').append('<tr id="' + items[i].id + '" data-uniqueid="' + (attributes[options.joinField] || items[i].id) + '">');
                                    $table.find('>tbody>tr:last').append('<td><button id="' + items[i].id + '" class="btn print"><i class="glyphicon glyphicon-eye-open"></i></button></td>');
                                    for (var attribute in attributes) {
                                        if (attribute.toUpperCase() == options.joinField.toUpperCase()) continue;
                                        if (options.excludeFields.includes(attribute.toUpperCase()) === true) continue;
                                        if (options.defaultFields.includes(attribute.toUpperCase()) === true) {
                                            $table.find('>tbody>tr:last').append('<td data-title="' + attribute + '">' + attributes[attribute] + "</td>");
                                        }
                                    }
                                    if (options.report === true && (options.report !== undefined || options.report !== null))
                                        $table.find('>tbody>tr:last').append('<td><button id="' + items[i].id + '" data-uniqueid="' + items[i].attributes.id + '" class="btn pdf"><i class="fa fa-file-pdf-o"></i></button></td>');//cambio
                                    if (options.extinct === true && (options.extinct !== undefined || options.extinct !== null))
                                        $table.find('>tbody>tr:last').append('<td><button id="' + items[i].id + '" data-uniqueid="' + items[i].attributes.id + '" class="btn extinct"><i class="glyphicon glyphicon-fire"></i></button></td>');// cambio
                                }
                                var selector = $table.find(">tbody>tr>td>a");
                                if (selector.length > 0) {
                                    selector.on("click", function (e) {
                                        e.preventDefault();
                                        jQuery(this).closest("td").load(this.href);
                                    });
                                    selector.trigger("click");
                                }
                                $table.find('>tbody>tr button.print').off("click");
                                $table.find('>tbody>tr button.print').on("click", function (e) {
                                    thiss.form(null, this.id, {});
                                });
                                $table.find('>tbody>tr button.pdf').off("click");
                                $table.find('>tbody>tr button.pdf').on("click", function (e) {
                                    thiss.pdf(null, $(this).attr("data-uniqueid"), this.id, {});
                                });
                                $table.find('>tbody>tr button.extinct').off("click");
                                $table.find('>tbody>tr button.extinct').on("click", function (e) {
                                    thiss.extinct($(this).attr("data-uniqueid"), this.id);
                                });
                            }
                            else {
                                $table.find('>tbody').append('<tr id="0"><td colspan="' + $table.find(">thead>tr>th").length + '">No se han encontrado resultados</td></tr>');
                            }
                        }
                    }
                };

                BaseMapWidget.prototype.pdf = function (url, id, featureId, options) {
                    var thiss = this;
                    options = options || {};
                    options.width = options.width || '100%';
                    options.height = options.height || jQuery(window).height() - 50;
                    options.draggable = options.draggable || false;
                    options.dialogTitle = options.dialogTitle || "Reporte PDF";
                    thiss.$form = $('<div></div>').appendTo(thiss.$widget);
                    thiss.$form.dialog({
                        title: options.dialogTitle,
                        fluid: true,
                        height: options.height,
                        width: options.width,
                        resizable: false,
                        closeOnEscape: true,
                        autoOpen: true,
                        modal: true,
                        autoremove: true,
                        draggable: options.draggable
                    });
                    thiss.$form.css("overflow", "");
                    var $iframe = $('<iframe id="iframe" width="100%" height="100%" frameborder="0"></iframe>');
                    thiss.$form.append($iframe);
                    $iframe.on("load", function (e) {
                        var thisFrame = this;
                        var $head = jQuery(this.contentDocument).find("head");
                        var $title = jQuery(this.contentDocument).find("title");
                        var $btnPdf2 = jQuery(this.contentDocument).find("#btnPdf2");
                        var jss = [];
                        var csss = [];
                        csss.push(com.jtm.Server.contextPath + 'assets/css/bootstrap.min.css');
                        jss.push(com.jtm.Server.contextPath + 'assets/js/jquery.min.js');
                        jss.push(com.jtm.Server.contextPath + 'assets/js/bootstrap.min.js');
                        BaseMapWidget.addCsss($head, csss);
                        BaseMapWidget.addScripts($head, jss);
                        $title.text(String.isNullOrWhiteSpace(options.title) ? 'Detalle' : options.title);
                        thiss.showHideToolbar(true);
                        if (String.isNullOrWhiteSpace(id) === false) {
                            console.log(featureId);
                            thiss.reportPdf(this, id, featureId);
                        }
                        $btnPdf2.off('click');
                        $btnPdf2.on('click', function (e) {
                            jQuery(this).hide();
                            thisFrame.focus();
                            if (thisFrame.contentWindow)
                                thisFrame.contentWindow.print();
                            else
                                thisFrame.print();
                            jQuery(this).show();
                        });
                    });
                    $iframe.attr("src", url);
                };
                BaseMapWidget.prototype.tableToLayer = function ($table, layer) {
                };
                BaseMapWidget.prototype.layerToTable = function (layer, $table) {
                };
                BaseMapWidget.prototype.buildGraphicsLayer = function (options) {
                };
                BaseMapWidget.prototype.buildFeatureLayer = function (options) {
                };
                BaseMapWidget.prototype.fitToFeature = function (layer, id) {
                };
                BaseMapWidget.prototype.selectFeature = function (id, labeled) {
                }
                BaseMapWidget.prototype.layerToTable = function (layer, selector) {
                };
                BaseMapWidget.prototype.tableToLayer = function (selector, layer) {
                };
                BaseMapWidget.prototype.drawPoint = function () {
                };
                BaseMapWidget.prototype.drawPolyline = function () {
                };
                BaseMapWidget.prototype.drawPolylineFreeHand = function () {
                };
                BaseMapWidget.prototype.drawRectangle = function () {
                };
                BaseMapWidget.prototype.drawCircle = function () {
                };
                BaseMapWidget.prototype.drawEllipse = function () {
                };
                BaseMapWidget.prototype.drawPolygon = function () {
                };
                BaseMapWidget.prototype.drawPolygonFreeHand = function () {
                };
                BaseMapWidget.prototype.extinct = function (id, featureId) {
                };
                BaseMapWidget.prototype.html2Canvas = function ($dom, $img, options) {
                    var thiss = this;
                    options = options || {};
                    options.callbackOnRendered = function (canvas) {
                        thiss.showHideToolbar(false);
                    };
                    _super.prototype.html2Canvas.call(this, $dom, $img, options);
                };
                BaseMapWidget.prototype.reportPdf = function (dom, id, featureId) {
                    console.log(id);
                };
                return BaseMapWidget;
            })(jtm.BaseWidget);
            geometry.BaseMapWidget = BaseMapWidget;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));