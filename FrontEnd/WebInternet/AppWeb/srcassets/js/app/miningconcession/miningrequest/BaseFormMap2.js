(function(com) {
    (function(jtm) {
        (function(miningconcession) {
            (function(miningrequest) {
                var BaseFormMap = (function(_super) {
                    __extends(BaseFormMap, _super);
                    function BaseFormMap() {
                        _super.call(this);
                        this.$divOption = null;
                        this.$divReport = null;
                        this.$btnManual = null;
                        this.$btnMap = null;
                        this.$btnCsv = null;
                        this.$btnSelectFile = null;
                        this.$filFile = null;
                        this.layerZoneUTM = null;
                        this.layerPoliticalDivision = null;
                        this.layerNationalCartography = null;
                        this.layerPreview = null;
                        this.layerOverlap = null;
                        this.formReport = function () {
                            var thiss = this;
                            if (thiss.$divReport !== null) {
                                thiss.$divReport.remove();
                            }
                            thiss.$divReport = $('<div></div>');
                            thiss.$map.append(thiss.$divReport);
                            thiss.$divReport.empty().hide();
                            thiss.$divReport.css("bottom", "0").css("position", "absolute");
                            thiss.loadView(thiss.$divReport, com.jtm.Server.contextPath + "areas/miningconcession/miningrequest/_report.html", function () {
                                thiss.$divReport.show();
                                var $btnClose = thiss.$divReport.find('>.panel>.panel-heading #btnClose');
                                var heightList = thiss.$divReport.find('>.panel>.panel-heading').outerHeight(true);
                                thiss.$divReport.hide();
                                thiss.$divReport.find('>.panel>.panel-body').css("max-height", (thiss.$map.outerHeight(true) - heightList)).css("overflow", "auto");
                                $btnClose.off("click");
                                $btnClose.on("click", function (e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.$divReport.hide();
                                });
                            });
                        };
                        this.showHideClosePanelOption = function() {
                            var thiss = this;
                            thiss.$divOption.find('#btnClose').off("click");
                            thiss.$divOption.find('#btnClose').on("click", function() {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.$divOption.empty();
                            });
                            thiss.$divOption.find('#btnShowHide').off("click");
                            thiss.$divOption.find('#btnShowHide').on("click", function(e, isClosed) {
                                window.plugins.deviceFeedback.acoustic();
                                var state = typeof isClosed === "boolean" ? isClosed : jQuery(this).find('>span').hasClass('glyphicon-triangle-top');
                                if (state === true) {
                                    thiss.$divOption.find(">div>div.panel-body").hide();
                                    thiss.$divOption.find(">div>div.panel-footer").hide();
                                    jQuery(this).find('>span').removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
                                }
                                else {
                                    thiss.$divOption.find(">div>div.panel-body").show();
                                    thiss.$divOption.find(">div>div.panel-footer").show();
                                    jQuery(this).find('>span').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
                                }
                            });
                        };
                        this.formMap = function() {
                            var thiss = this;
                            thiss.$divOption.empty();
                            thiss.cleanControls();
                            thiss.loadView(thiss.$divOption, com.jtm.Server.contextPath + "areas/miningconcession/miningrequest/_formmap.html", function() {
                                thiss.$divOption.show();
                                thiss.$divOption[0].scrollIntoView();
                                thiss.$ddlZoneUTM = thiss.$main.find('#ddlZoneUTM');
                                thiss.$ddlDepartment = thiss.$main.find('#ddlDepartment');
                                thiss.$ddlProvince = thiss.$main.find('#ddlProvince');
                                thiss.$ddlDistrict = thiss.$main.find('#ddlDistrict');
                                thiss.$ddlNationalCartography = thiss.$main.find('#ddlNationalCartography');
                                thiss.$btnPoint = thiss.$main.find('#btnPoint');
                                thiss.$btnRectangle = thiss.$main.find('#btnRectangle');
                                thiss.$btnPolyline = thiss.$main.find('#btnPolyline');
                                thiss.$btnPolygon = thiss.$main.find('#btnPolygon');
                                thiss.$btnCircle = thiss.$main.find('#btnCircle');
                                var $btnShowHide = thiss.$divOption.find('#btnShowHide');
                                thiss.showHideClosePanelOption();
                                thiss.listZoneUTMs();
                                //thiss.searchDepartments();
                                thiss.$ddlZoneUTM.off("change");
                                thiss.$ddlZoneUTM.on("change", function(e) {
                                    thiss.$ddlDepartment.empty();
                                    thiss.$ddlProvince.empty();
                                    thiss.$ddlDistrict.empty();
                                    thiss.$ddlNationalCartography.empty();
                                    thiss.fitExtentGrid(jQuery(this).val());
                                    thiss.searchDepartments(jQuery(this).val());
                                    thiss.searchNationalCartographies(jQuery(this).val());
                                    thiss.loadServicesOnExtent(jQuery(this).val());
                                });
                                thiss.$ddlDepartment.off("change");
                                thiss.$ddlDepartment.on("change", function() {
                                    thiss.$ddlProvince.empty();
                                    thiss.$ddlDistrict.empty();
                                    thiss.$ddlNationalCartography.empty();
                                    thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDepartment, "CD_DEPA='" + jQuery(this).val() + "'");
                                    thiss.searchProvincesByDepartment(jQuery(this).val(), thiss.$ddlZoneUTM.val());
                                });
                                thiss.$ddlProvince.off("change");
                                thiss.$ddlProvince.on("change", function() {
                                    thiss.$ddlDistrict.empty();
                                    thiss.$ddlNationalCartography.empty();
                                    thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdProvince, "CD_PROV='" + jQuery(this).val() + "'");
                                    thiss.searchDistrictsByProvince(jQuery(this).val(), thiss.$ddlZoneUTM.val());
                                });
                                thiss.$ddlDistrict.off("change");
                                thiss.$ddlDistrict.on("change", function() {
                                    thiss.$ddlNationalCartography.empty();
                                    thiss.scopePoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDistrict, "CD_DIST='" + jQuery(this).val() + "'");
                                });
                                thiss.$ddlNationalCartography.off("change");
                                thiss.$ddlNationalCartography.on("change", function(e) {
                                    thiss.scopeNationalCartography(jQuery(this).val());
                                });
                                thiss.$btnPoint.off("click");
                                thiss.$btnPoint.on("click", function(e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    $btnShowHide.trigger("click", true);
                                    thiss.drawPoint();
                                });
                                thiss.$btnPolyline.off("click");
                                thiss.$btnPolyline.on("click", function(e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    $btnShowHide.trigger("click", true);
                                    thiss.drawPolyline();
                                });
                                thiss.$btnRectangle.off("click");
                                thiss.$btnRectangle.on("click", function(e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    $btnShowHide.trigger("click", true);
                                    thiss.drawRectangle();
                                });
                                thiss.$btnCircle.off("click");
                                thiss.$btnCircle.on("click", function(e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    $btnShowHide.trigger("click", true);
                                    thiss.drawCircle();
                                });
                                thiss.$btnPolygon.off("click");
                                thiss.$btnPolygon.on("click", function(e) {
                                    window.plugins.deviceFeedback.acoustic();
                                    $btnShowHide.trigger("click", true);
                                    thiss.drawPolygon();
                                });
                            });
                        };
                        this.formManual = function() {
                            var thiss = this;
                            thiss.$divOption.empty();
                            thiss.cleanControls();
                            thiss.loadView(thiss.$divOption, com.jtm.Server.contextPath + "areas/miningconcession/miningrequest/_formmanual.html", function() {
                                thiss.$divOption.show();
                                thiss.$divOption[0].scrollIntoView();
                                thiss.$ddlSpatialReference = thiss.$main.find('#ddlSpatialReference');
                                thiss.$tableCoordinates = thiss.$main.find('#tblResultCoordinates');
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.spatialReferences
                                });
                                thiss.showHideClosePanelOption();
                                thiss.$divOption.find(".panel>.panel-body>.table input").numeric();
                                var $btnGraphic = thiss.$main.find('#btnGraphic');
                                $btnGraphic.off("click");
                                $btnGraphic.on("click", function () {
                                    window.plugins.deviceFeedback.acoustic();
                                    jQuery('#btnShowHide').trigger("click", true);
                                    thiss.analizeCoordinates(thiss.$divOption.find(thiss.$tableCoordinates));
                                });
                                thiss.$tableCoordinates.find(">thead").on('click', ".coordinate-add", function() {
                                    window.plugins.deviceFeedback.acoustic();
                                    var $tr = $(this).closest('table').find(">tbody>tr:last");//(this).closest('tr');
                                    var $clone = $tr.clone();
                                    $clone.find('input').val('');
                                    $clone.find('td:eq(0)').text(parseInt($tr.find('td:eq(0)').text()) + 1);
                                    $tr.after($clone);
                                    $tr.find("button").remove();
                                    thiss.$divOption.find(".panel>.panel-body>.table input").numeric();
                                });
                                thiss.$tableCoordinates.find(">tbody").on('click', ".coordinate-remove", function() {
                                    window.plugins.deviceFeedback.acoustic();
                                    var $tr = $(this).closest('tr');
                                    var $btnRemove = $tr.find("button.coordinate-remove");
                                    //var $btnAdd = $tr.find("button.coordinate-add");
                                    if ($tr.index() <= 3) return;
                                    $tr.prev().find('td:eq(3)').empty().append($btnRemove);//.append($btnAdd);
                                    $tr.remove();
                                });
                                thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                                thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                                thiss.$tableCoordinates.find(">thead .coordinate-add").trigger("click");
                            });
                        };
                        this.formCsv = function() {
                            var thiss = this;
                            thiss.$divOption.empty();
                            thiss.cleanControls();
                            thiss.loadView(thiss.$divOption, com.jtm.Server.contextPath + "areas/miningconcession/miningrequest/_formcsv.html", function() {
                                thiss.$divOption.show();
                                thiss.$divOption[0].scrollIntoView();
                                thiss.$ddlSpatialReference = thiss.$main.find('#ddlSpatialReference');
                                thiss.$tableCoordinates = thiss.$main.find('#tblResultCoordinates');
                                thiss.$btnSelectFile = thiss.$main.find('#btnSelectFile');
                                thiss.$filFile = thiss.$main.find('#filFile');
                                thiss.$tableCoordinates.find("tbody").hide();
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlSpatialReference,
                                    items: thiss.config.module.spatialReferences
                                });
                                thiss.showHideClosePanelOption();
                                thiss.$filFile.off("change");
                                thiss.$filFile.on("change", function(e) {
                                    if (e.originalEvent.target.files.length) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        thiss.$tableCoordinates.find('>tbody>tr:not(:eq(0))').remove();
                                        addHandlerTable();
                                        if (e.originalEvent.target.files[0].name.endsWith('.csv') === false) {
                                            window.plugins.toast.showLongBottom("La extensión del archivo no es válido");
                                            return;
                                        }
                                        Papa.parse(e.originalEvent.target.files[0], {
                                            complete: function(results) {
                                                if (results === undefined || results === null) return;
                                                if (!(results.data instanceof Array)) return;
                                                var data = results.data;
                                                var i = 0;
                                                var srid = 0;
                                                var $tr = null;
                                                for (i = 1; i < data.length; i++) {
                                                    if (i === 1) {
                                                        if (data[i].length >= 3) {
                                                            $tr = thiss.$tableCoordinates.find(">tbody>tr:last");
                                                            $tr.find('td:eq(0)').text(data[i][0]);
                                                            $tr.find('td:eq(1)').find("input").val(data[i][1]);
                                                            $tr.find('td:eq(2)').find("input").val(data[i][2]);
                                                        }
                                                        if (data[i].length >= 4) {
                                                            srid = data[i][3];
                                                        }
                                                    } else {
                                                        if (data[i].length >= 3) {
                                                            thiss.$tableCoordinates.find(">tbody>tr:last").trigger("click");
                                                            $tr = thiss.$tableCoordinates.find(">tbody>tr:last");
                                                            $tr.find('td:eq(0)').text(data[i][0]);
                                                            $tr.find('td:eq(1)').find("input").val(data[i][1]);
                                                            $tr.find('td:eq(2)').find("input").val(data[i][2]);
                                                        }
                                                    }
                                                }
                                                $tr = null;
                                                thiss.$tableCoordinates.find(">tbody").off('click', ">tr:last");
                                                thiss.$tableCoordinates.find(">tbody>tr input").attr("readonly", true);
                                                if (thiss.$tableCoordinates.find('>tbody>tr').length > 1)
                                                    thiss.$tableCoordinates.find('>tbody').show();
                                                if (srid > 0)
                                                    thiss.$ddlSpatialReference.val(srid);
                                            }
                                        });
                                    }
                                    $(this).val('');
                                });
                                thiss.$btnSelectFile.off("click");
                                thiss.$btnSelectFile.on("click", function() {
                                    window.plugins.deviceFeedback.acoustic();
                                    thiss.$filFile.trigger("click");
                                });
                                thiss.$tableCoordinates.numeric();
                                var $btnGraphic = thiss.$main.find('#btnGraphic');
                                $btnGraphic.off("click");
                                $btnGraphic.on("click", function() {
                                    window.plugins.deviceFeedback.acoustic();
                                    jQuery('#btnShowHide').trigger("click");
                                    thiss.analizeCoordinates();
                                });
                                addHandlerTable();
                                function addHandlerTable() {
                                    thiss.$tableCoordinates.find(">tbody").off('click', ">tr:last");
                                    thiss.$tableCoordinates.find(">tbody").on('click', ">tr:last", function() {
                                        var $clone = $(this).clone();
                                        $clone.find('input').val('');
                                        $clone.find('td:eq(0)').text(parseInt($(this).find('td:eq(0)').text()) + 1);
                                        $(this).after($clone);
                                        thiss.$tableCoordinates.find("input").numeric();
                                    });
                                }
                            });
                        };
                        this.fillZoneUTMs = function(items) {
                            items.forEach(function(item) {
                                this.$ddlZoneUTM.append('<option value="' + item.attributes.ZONE + '">' + item.attributes.ZONE + ' S</option>');
                            }, this);
                            this.$ddlZoneUTM.val(this.config.module.defaultZone);
                            this.$ddlZoneUTM.trigger('change');
                        };
                        this.fillNationalCartographies = function(items) {
                            this.$ddlNationalCartography.html('<option value="' + BaseFormMap.DDLVALUEDEFAULT + '">' + BaseFormMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function(item) {
                                this.$ddlNationalCartography.append('<option value="' + item.attributes.CD_HOJA + '">' + item.attributes.CD_HOJA + ' - ' + item.attributes.NM_HOJA + ' S</option>');
                            }, this);
                        };

                        this.fillDepartments = function(items) {
                            this.$ddlDepartment.html('<option value="' + BaseFormMap.DDLVALUEDEFAULT + '">' + BaseFormMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function(item) {
                                this.$ddlDepartment.append('<option value="' + item.attributes.CD_DEPA + '">' + item.attributes.NM_DEPA + '</option>');
                            }, this);
                        };
                        this.fillProvinces = function(items) {
                            this.$ddlProvince.html('<option value="' + BaseFormMap.DDLVALUEDEFAULT + '">' + BaseFormMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function(item) {
                                this.$ddlProvince.append('<option value="' + item.attributes.CD_PROV + '">' + item.attributes.NM_PROV + '</option>');
                            }, this);
                        };
                        this.fillDistricts = function(items) {
                            this.$ddlDistrict.html('<option value="' + BaseFormMap.DDLVALUEDEFAULT + '">' + BaseFormMap.DDLDISPLAYDEFAULT + '</option>');
                            items.forEach(function(item) {
                                this.$ddlDistrict.append('<option value="' + item.attributes.CD_DIST + '">' + item.attributes.NM_DIST + '</option>');
                            }, this);
                        };
                        this.writeOverlaps = function(service, items) {
                            var thiss = this;
                            if (!(items instanceof Array) || items.length === 0) return;
                            var $table = $('<table class="table table-striped"></table>');
                            thiss.$divReport.find('>.panel>.panel-body>div:first').append($table);
                            writeCaption();
                            writeHeader();
                            writeBody();
                            $table.find('>tbody>tr button').off("click");
                            $table.find('>tbody>tr button').on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.featureSelectById(jQuery(this).attr('id'));
                                thiss.$divReport.hide();
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
                        };
                        this.writeCoordinates = function(geometry) {
                            var thiss = this;
                            if (geometry === undefined || geometry === null) return;
                            var $table = thiss.$divReport.find('>.panel>.panel-body>table:first');
                            $table.find('>tfoot>tr button').off("click");
                            $table.find('>tfoot>tr button').on("click", function(e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.fitExtent(0);
                                thiss.$divReport.hide();
                            });
                            if (geometry !== null && geometry.coordinates instanceof Array && geometry.coordinates[0] instanceof Array) {
                                var i = 0;
                                for (i = 0; i < geometry.coordinates[0].length - 1; i++) {
                                    $table.find("tbody").append("<tr><td>" + (i + 1) + "</td><td>" + geometry.coordinates[0][i][0] + "</td><td>" + geometry.coordinates[0][i][1] + "</td></tr>");
                                }
                                $table.find(">tfoot>tr>td>span").text(geometry.spatialReference.id);
                            }
                        };
                        this.contentKML = function (type, coordinates, srid, withVertex, options) {
                            var thiss = this;
                            options = options || {};
                            options.folderName = options.folderName || 'Folder';
                            options.folderDescription = $('<div>').append(thiss.getTableCoordinates()).html();
                            options.folderVertexName = 'Folder vertex' || options.folderVertexName;
                            options.folderVertexDescription = options.folderVertexDescription || 'Folder description vértices';
                            coordinates = thiss.$tableCoordinates.find('tbody').html().replace(/^<tr><td>/, '[[[').replace(/<\/td><\/tr>$/, ']]]').replace(/<\/td><\/tr><tr><td>/g, '],[').replace(/<\/td><td>/g, ',');
                            coordinates = JSON.parse(coordinates);
                            for (var i = 0; i < coordinates[0].length; i++) {
                                coordinates[0][i] = coordinates[0][i].slice(1);
                            }
                            coordinates[0].push(coordinates[0][0]);
                            var kml = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n';
                            kml += '<kml xmlns="http://www.opengis.net/kml/2.2">' + '\r\n';
                            kml += '<Document>' + '\r\n';
                            kml += '<open>1</open>' + '\r\n';
                            kml += '<name>Petitorio minero a INGEMMET</name>' + '\r\n';
                            kml += '<description>Petitorio minero generado por SIGEMIN MOBILE</description>' + '\r\n';
                            kml += '<Style id="style">';
                            kml += '<LineStyle>' + '\r\n';
                            kml += '<color>' + converter.rgbaToKml(thiss.config.module.map.symbols['Polygon']['highlight'].getStroke().getColor().replace(/rgba\(/i, '').replace(')', '')) + '</color>' + '\r\n';
                            kml += '<width>1.5</width>' + '\r\n';
                            kml += '</LineStyle>' + '\r\n';
                            kml += '<PolyStyle>' + '\r\n';
                            kml += '<color>' + converter.rgbaToKml(thiss.config.module.map.symbols['Polygon']['highlight'].getFill().getColor().replace(/rgba\(/i, '').replace(')', '')) + '</color>' + '\r\n';
                            kml += '</PolyStyle>' + '\r\n';
                            kml += '</Style>' + '\r\n';
                            kml += '<Folder>' + '\r\n';
                            kml += '<name>' + options.folderName + '</name>' + '\r\n';
                            kml += '<visibility>0</visibility>' + '\r\n';
                            kml += '<open>1</open>' + '\r\n';
                            kml += '<Placemark>';
                            kml += '<styleUrl>#style</styleUrl>';
                            kml += '<name>Área</name>' + '\r\n';
                            kml += '<description><![CDATA[ ' + options.folderDescription + ' ]]></description>' + '\r\n';
                            kml += '<Polygon>' + '\r\n';
                            kml += '<outerBoundaryIs>' + '\r\n';
                            kml += '<LinearRing>' + '\r\n';
                            kml += '<coordinates>' + '\r\n';
                            var i = 0;
                            for (i = 0; i < coordinates[0].length; i++) {
                                coordinates[0][i] = thiss.project(coordinates[0][i], srid, BaseFormMap.SRIDDEFAULTGPS);
                                kml += coordinates[0][i][0] + "," + coordinates[0][i][1] + " ";
                            }
                            kml += '</coordinates>' + '\r\n';
                            kml += '</LinearRing>' + '\r\n';
                            kml += '</outerBoundaryIs>' + '\r\n';
                            kml += '</Polygon>' + '\r\n';
                            kml += '</Placemark>' + '\r\n';
                            if (withVertex === true) {
                                kml += '<Folder>' + '\r\n';
                                kml += '<name>Vértices</name>' + '\r\n';
                                kml += '<visibility>0</visibility>' + '\r\n';
                                kml += '<open>0</open>' + '\r\n';
                                for (i = 0; i < coordinates[0].length - 1; i++) {
                                    kml += '<Placemark>' + '\r\n';
                                    kml += '<name>' + (i + 1) + '</name>' + '\r\n';
                                    kml += '<Point>' + '\r\n';
                                    kml += '<coordinates>';
                                    kml += coordinates[0][i][0] + "," + coordinates[0][i][1] + " ";
                                    kml += '</coordinates>' + '\r\n';
                                    kml += '</Point>' + '\r\n';
                                    kml += '</Placemark>' + '\r\n';
                                }
                                kml += '</Folder>' + '\r\n';
                            }
                            kml += '</Folder>' + '\r\n';
                            kml += '</Document>' + '\r\n';
                            kml += '</kml>';
                            return kml;//application/vnd.google-earth.kml+xml
                        };
                    }
                    BaseFormMap.prototype.build = function ($dom, height) {
                        _super.prototype.build.call(this, $dom, height);
                        this.formReport();
                    };
                    BaseFormMap.prototype.domConfig = function() {
                        _super.prototype.domConfig.call(this);
                        this.$hdnId = this.$main.find('#hdnId');
                        this.$txtName = this.$main.find('#txtName');
                        this.$btnClose = this.$main.find('#btnClose');
                        this.$btnManual = this.$main.find('#btnManual');
                        this.$btnMap = this.$main.find('#btnMap');
                        this.$btnCsv = this.$main.find('#btnCsv');
                        this.$btnCoordinates = this.$main.find('#btnCoordinates');
                        this.$btnReport = this.$main.find('#btnReport');
                        this.$divOption = this.$main.find('#divOption');
                    };
                    BaseFormMap.prototype.viewConfig = function() {
                        this.$map.css("overflow", "auto");
                        this.$divOption.empty();
                    };
                    BaseFormMap.prototype.buttonConfig = function() {
                        var thiss = this;
                        thiss.$btnMap.off("click");
                        thiss.$btnMap.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formMap();
                        });
                        thiss.$btnManual.off("click");
                        thiss.$btnManual.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formManual();
                        });
                        thiss.$btnCsv.off("click");
                        thiss.$btnCsv.on("click", function(e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.formCsv();
                        });
                        thiss.$btnReport.off("click");
                        thiss.$btnReport.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.$divReport.toggle();
                        });
                    };
                    BaseFormMap.prototype.featureSelectById = function(id) {
                    };
                    BaseFormMap.prototype.buildStyle = function(service, feature) {
                    };
                    BaseFormMap.prototype.analizeCoordinates = function() {
                        var thiss = this;
                        thiss.$btnReport.find('>i').removeClass('glyphicon-chevron-down').addClass("glyphicon-chevron-up");
                        if (thiss.$tableCoordinates.find(">tbody>tr>td>input").val() === '') {
                            window.plugins.toast.showLongBottom("Ingrese todas las coordenadas");
                            return;
                        }
                        var coordinates = [[]];
                        thiss.$tableCoordinates.find(">tbody>tr").toArray().forEach(function(tr) {
                            coordinates[0].push([parseFloat(jQuery(tr).find('td:eq(1)>input').val()), parseFloat(jQuery(tr).find('td:eq(2)>input').val())]);
                        });
                        coordinates[0].push(coordinates[0][0]);
                        thiss.coordinatesToMap(coordinates, thiss.$ddlSpatialReference.int32());
                        thiss.$divOption[0].scrollIntoView();
                    };
                    BaseFormMap.prototype.coordinatesToMap = function(coordinates, srid) {
                    };
                    BaseFormMap.prototype.cleanControls = function (toNull) {
                        this.$divOption.empty().hide();
                        this.$divReport.find('>.panel>.panel-body>table>tbody:first').empty();
                        this.$divReport.find('>.panel>.panel-body>div:first').empty();
                        this.$divReport.hide();
                    };
                    return BaseFormMap;
                })(jtm.geometry.SimpleMap);
                miningrequest.BaseFormMap = BaseFormMap;
            })(miningconcession.miningrequest || (miningconcession.miningrequest = {}));
            var miningrequest = miningconcession.miningrequest;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));