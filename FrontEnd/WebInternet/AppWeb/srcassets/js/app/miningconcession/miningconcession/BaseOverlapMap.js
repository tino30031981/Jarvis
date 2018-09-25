(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var BaseOverlapMap = (function (_super) {
                    __extends(BaseOverlapMap, _super);
                    function BaseOverlapMap() {
                        _super.call(this);
                        this.$divResult = null;
                        this.$divFormGeometry = null;
                        this.$btnResult = null;
                        this.$divServices = null;
                        this.services = [];
                        this.callbackDetailMapClick = null;
                        this.formResult = function () {
                            var thiss = this;
                            if (thiss.$divResult !== null) {
                                thiss.$divResult.remove();
                            }
                            thiss.$divResult = $('<div></div>');
                            thiss.$map.append(thiss.$divResult);
                            thiss.$divResult.empty().hide();
                            thiss.$divResult.css("bottom", "0").css("position", "absolute");
                            thiss.loadView(thiss.$divResult, com.jtm.Server.contextPath + "areas/miningconcession/miningconcession/_overlaplist.html", function () {
                                thiss.$divResult.show();
                                thiss.$btnCloseList = thiss.$divResult.find('>.panel>.panel-heading #btnCloseList');
                                var heightList = thiss.$divResult.find('>.panel>.panel-heading').outerHeight(true);
                                thiss.$divResult.hide();
                                thiss.$divResult.find('>.panel>.panel-body').css("max-height", (thiss.$map.outerHeight(true) - heightList)).css("overflow", "auto");
                                thiss.$btnCloseList.off("click");
                                thiss.$btnCloseList.on("click", function (e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.$divResult.hide();
                                });
                            });
                        };
                        this.removeFormGeometry = function () {
                            if (this.$divFormGeometry !== null) {
                                this.$divFormGeometry.remove();
                                this.$divFormGeometry = null;
                            }
                        };
                        this.formGeometry = function () {
                            var thiss = this;
                            if (this.$divFormGeometry !== null)
                                this.$divFormGeometry.remove();
                            this.$divFormGeometry = null;
                            thiss.$divFormGeometry = $('<div class="panel"></div>');
                            thiss.$map.append(thiss.$divFormGeometry);
                            thiss.$divFormGeometry.empty();
                            thiss.$divFormGeometry.css("top", "0").css("position", "absolute");
                            thiss.loadView(thiss.$divFormGeometry, com.jtm.Server.contextPath + "areas/geometry/shared/_formXYR.html", function () {
                                var $btnGeometry = thiss.$divFormGeometry.find('#btnGraphic');
                                var $txtX = thiss.$divFormGeometry.find('#txtX');
                                var $txtY = thiss.$divFormGeometry.find('#txtY');
                                var $txtRadio = thiss.$divFormGeometry.find('#txtRadio');
                                var $ddlSpatialReference = thiss.$divFormGeometry.find('#ddlSpatialReference');
                                $txtRadio.numeric({ negative: false });
                                $txtX.numeric();
                                $txtY.numeric();
                                var sql = "select sr.id,(d.name || ' '  || ifnull(zone ,'')) as name from 'geo.spatialreference' as sr inner join 'geo.datum' as d ON sr.datumid =d.id;";
                                thiss.listDb($ddlSpatialReference, sql);
                                $btnGeometry.off("click");
                                $btnGeometry.on("click", function (e) {
                                    if (validate() === false)
                                        return;
                                    thiss.drawCircleCustom($txtX.val(), $txtY.val(), $txtRadio.val(), $ddlSpatialReference.int32(), { $dom: thiss.$divFormGeometry });
                                });
                                function validate() {
                                    var success = true;
                                    if (String.isNullOrWhiteSpace($txtX.val()) === true) {
                                        $txtX.focus();
                                        window.plugins.toast.showLongBottom("Ingrese la coordenada Este (X)");
                                        success = false;
                                    }
                                    else if (String.isNullOrWhiteSpace($txtY.val()) === true) {
                                        $txtY.focus();
                                        window.plugins.toast.showLongBottom("Ingrese la coordenada Norte (Y)");
                                        success = false;
                                    }
                                    else if (String.isNullOrWhiteSpace($txtRadio.val()) === true) {
                                        $txtRadio.focus();
                                        window.plugins.toast.showLongBottom("Ingrese el radio");
                                        success = false;
                                    }
                                    return success;
                                }
                            });
                        };
                        this.writeOverlaps = function (service, items) {
                            var thiss = this;
                            if (!(items instanceof Array) || items.length === 0) return;
                            var $table = $('<table class="table table-striped"></table>');
                            thiss.$divResult.find('>.panel>.panel-body').append($table);
                            thiss.$divResult.show();
                            writeCaption();
                            writeHeader();
                            writeBody();
                            $table.find('>tbody>tr button').off("click");
                            $table.find('>tbody>tr button').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.featureSelectById(jQuery(this).attr('id'));                                
                            });
                            function writeCaption() {
                                $table.append('<caption>' + items[0].layerName + ' (' + items.length + ')</caption>');
                            }
                            function writeHeader() {
                                $table.append("<thead></thead>");
                                $table.find('>thead').append("<tr></tr>");
                                $table.find('>thead>tr').append('<th></th>');
                                for (var j in items[0].attributes) {
                                    if (service.fields.includes(j) === false) continue;
                                    $table.find('>thead>tr').append("<th>" + j + "</th>");
                                }
                            }
                            function writeBody() {
                                $table.append("<tbody></tbody>");
                                for (i = 0; i < items.length; i++) {
                                    $table.find('>tbody').append("<tr></tr>");
                                    $table.find('>tbody>tr:last').append('<td><button type="button" id="' + items[i].attributes.UUID + '" class="btn btn-sm"><i class="glyphicon glyphicon-eye-open"></i></button></td>');
                                    for (var j in items[i].attributes) {
                                        if (service.fields.includes(j) === false) continue;
                                        $table.find('>tbody>tr:last').append('<td>' + items[i].attributes[j].replaceBlankWith(" "));
                                    }
                                }
                            }
                            //var selectorHeaderText = '>.panel>.panel-heading>.btn-toolbar>.btn-group:first>p';
                            //thiss.$divResult.find(selectorHeaderText).text(thiss.$divResult.find(selectorHeaderText).text() + ' (' + items.length + ' coincidencias)');
                        };
                    }
                    BaseOverlapMap.SELECTEDSERVICES = 'Seleccione capas a superponer';
                    BaseOverlapMap.SELECTEDSERVICESMAX = 'Sólo se permite la selección con 10 capas como máximo';
                    BaseOverlapMap.prototype.domConfig = function () {
                        _super.prototype.domConfig.call(this);
                        this.$btnPoint = this.$main.find('#btnPoint');
                        this.$btnGPS = this.$main.find('#btnGPS');
                        this.$btnRectangle = this.$main.find('#btnRectangle');
                        this.$btnPolygon = this.$main.find('#btnPolygon');
                        this.$btnPolygonFreeHand = this.$main.find('#btnPolygonFreeHand');
                        this.$btnCircle = this.$main.find('#btnCircle');
                        this.$btnXYR = this.$main.find('#btnXYR');
                        this.$btnResult = this.$main.find('#btnResult');
                    };
                    BaseOverlapMap.prototype.buttonConfig = function () {
                        var thiss = this;
                        thiss.$btnPoint.off("click");
                        thiss.$btnPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawPoint();
                        });
                        thiss.$btnRectangle.off("click");
                        thiss.$btnRectangle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawRectangle();
                        });
                        thiss.$btnCircle.off("click");
                        thiss.$btnCircle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawCircle();
                        });
                        thiss.$btnPolygon.off("click");
                        thiss.$btnPolygon.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawPolygon();
                        });
                        thiss.$btnPolygonFreeHand.off("click");
                        thiss.$btnPolygonFreeHand.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawPolygonFreeHand();
                        });
                        thiss.$btnGPS.off("click");
                        thiss.$btnGPS.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.drawPointGPS();
                        });
                        thiss.$btnXYR.off("click");
                        thiss.$btnXYR.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.removeFormGeometry();
                            thiss.formGeometry();
                        });
                        thiss.$btnResult.off("click");
                        thiss.$btnResult.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (thiss.$divResult.find('>.panel>.panel-body').is(":empty") === true) {
                                window.plugins.toast.showLongBottom("No hay elementos superpuestos");
                                return;
                            }
                            thiss.$divResult.toggle();
                        });
                    };
                    BaseOverlapMap.prototype.build = function ($dom, height) {
                        _super.prototype.build.call(this, $dom, height);
                        this.formResult();
                    };
                    BaseOverlapMap.prototype.drawCircleCustom = function (x, y, radio, srid, options) {
                    };
                    BaseOverlapMap.prototype.featureSelectById = function (id) {
                        this.$divResult.hide();
                    };
                    BaseOverlapMap.prototype.buildStyle = function (service, feature) {

                    };
                    BaseOverlapMap.prototype.cleanControls = function (toNull) {
                        if (this.$divResult !== null) {
                            this.$divResult.find('>.panel>.panel-body').empty();
                            this.$divResult.hide();
                            if (toNull === true) {
                                this.$divResult.empty().hide();
                                this.$divResult = null;
                            }
                        }
                        this.removeFormGeometry();
                    };
                    return BaseOverlapMap;
                })(jtm.geometry.SimpleMap);
                miningconcession.BaseOverlapMap = BaseOverlapMap;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));