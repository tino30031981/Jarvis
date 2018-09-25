(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningcadaster) {
                var BaseMainMap = (function (_super) {
                    __extends(BaseMainMap, _super);
                    function BaseMainMap() {
                        _super.call(this);
                        this.$btnResult = null;
                        this.$divResult = null;
                        this.$divToc = null;
                        this.callbackForm = null;
                        this.zone = 0;
                        this.setZone = function (value) {
                            this.zone = value;
                        };
                        this.getZone = function () {
                            return this.zone;
                        };
                        this.formResult = function () {
                            var thiss = this;
                            if (thiss.$divResult !== null) {
                                thiss.$divResult.remove();
                            }
                            thiss.$divResult = $('<div></div>');
                            thiss.$map.append(thiss.$divResult);
                            thiss.$divResult.empty().hide();
                            thiss.$divResult.css("bottom", "0").css("position", "absolute");
                            thiss.loadView(thiss.$divResult, com.jtm.Server.contextPath + "areas/miningconcession/miningcadaster/_list.html", function () {
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
                        this.writeResult = function (items) {
                            var thiss = this;
                            var $table = thiss.$divResult.find('table');
                            items.forEach(function (item) {
                                $table.find('>tbody').append('<tr><td><button type="button" id="' + item.attributes[thiss.config.module.service.joinField] + '" class="btn btn-sm"><i class="glyphicon glyphicon-eye-open"></i></button></td><td>' + item.attributes.CODIGOU + '</td><td>' + item.attributes.CONCESION + '</td></tr>');
                            }, this);
                            $table.find('>tbody>tr button').off("click");
                            $table.find('>tbody>tr button').on("click", function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                thiss.featureSelectById(jQuery(this).attr('id'));
                                thiss.$divResult.hide();
                            });
                            var selectorHeaderText = '>.panel>.panel-heading>.btn-toolbar>.btn-group:first>p';
                            this.$divResult.find(selectorHeaderText).text('Listado (' + items.length + ' coincidencias)');
                            this.$divResult.show();
                        };

                        this.contentKML = function (type, coordinates, srid, withVertex, options) {
                            var thiss = this;
                            options = options || {};
                            options.folderName = options.folderName || 'Folder';
                            options.folderDescription = $('<div>').append(thiss.getTableCoordinates()).html();
                            options.folderVertexName = 'Folder vertex' || options.folderVertexName;
                            options.folderVertexDescription = options.folderVertexDescription || 'Folder description vértices';
                            var zone = thiss.getZone();
                            srid = thiss.config.module.servicesByZone[zone].srid;
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
                            kml += '<name>Concesión minera INGEMMET</name>' + '\r\n';
                            kml += '<description>Concesión minera generada por SIGEMIN MOBILE</description>' + '\r\n';
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
                                coordinates[0][i] = thiss.project(coordinates[0][i], srid, BaseMainMap.SRIDDEFAULTGPS);
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
                        this.getTableCoordinates = function () {
                            return this.$tableCoordinates.clone();
                        };
                        this.writeToc = function () {
                            var thiss = this;
                            var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                            var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                            var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                            thiss.config.module.servicesToc.forEach(function (service) {
                                if (service.disabled !== true) {
                                    service.layers.forEach(function (layer) {
                                        layer.url = service.url;
                                        if (layer.disabled !== true) {
                                            thiss.$divToc.find('ul').append('<li id="' + layer.UUID + '"><a><span class="checkbox"><input type="checkbox" /><label>' + layer.name + '</label></span></a></li>');
                                            thiss.addLayerToToc(layer);
                                        }
                                    });
                                }
                            });
                            thiss.$divToc.find('ul').css({
                                "height": "auto",
                                "max-height": height,
                                "overflow-x": "hidden"
                            });
                            thiss.$divToc.find('ul>li>a input:checkbox').on('change', function (e) {
                                window.plugins.deviceFeedback.acoustic();
                                var $li = jQuery(this).closest('li');
                                if ($li !== undefined && $li !== null && String.isNullOrWhiteSpace($li.attr('id')) === false) {
                                    thiss.toggleLayer($li.attr('id'), jQuery(this).is(":checked"));
                                }
                            });
                        };
                        this.listDepartments = function () {
                            var options = {
                                where: "CD_DEPA<=25",
                                orderByField: 'NM_DEPA',
                                defaultDisplay: 'Departamento',
                                fieldId: 'CD_DEPA',
                                fieldName: 'NM_DEPA',
                                id: 25
                            };
                            this.searchPoliticalDivision(this.config.module.servicePoliticalDivision.layerIdDepartment, this.$ddlDepartment, options);
                        };
                        this.searchProvincesByDepartment = function (id) {
                            if (id === 0) return;
                            var options = {
                                where: "CD_DEPA='" + id + "'",
                                orderByField: 'NM_PROV',
                                defaultDisplay: 'Provincia',
                                fieldId: 'CD_PROV',
                                fieldName: 'NM_PROV',
                                id: id
                            };
                            this.searchPoliticalDivision(this.config.module.servicePoliticalDivision.layerIdProvince, this.$ddlProvince, options);
                        };
                        this.searchDistrictsByProvince = function (id) {
                            if (id === 0) return;
                            var options = {
                                where: "CD_PROV='" + id + "'",
                                orderByField: 'NM_DIST',
                                defaultDisplay: 'Distrito',
                                fieldId: 'CD_DIST',
                                fieldName: 'NM_DIST',
                                id:id
                            };
                            this.searchPoliticalDivision(this.config.module.servicePoliticalDivision.layerIdDistrict, this.$ddlDistrict, options);
                        };
                        this.searchPoliticalDivision = function (layerId, $ddl, options) {
                            var thiss = this;
                            this.cleanControls(false);
                            if (options.id === "0") return;
                            var data = {
                                f: "json",
                                where: options.where,
                                returnGeometry: false,
                                outFields: "*",
                                orderByFields: options.orderByField
                            };
                            thiss.ajax({
                                method: "POST",
                                url: thiss.config.module.servicePoliticalDivision.url + "/" + layerId + "/query",
                                data: data,
                                isJson: false,
                                validate: true,
                                async: false
                            }, function (data) {
                                if (data.features.length === 0) return;
                                $ddl.html('<option value="' + BaseMainMap.DDLVALUEDEFAULT + '">' + options.defaultDisplay + '</option>');
                                data.features.forEach(function (item) {
                                    $ddl.append('<option value="' + item.attributes[options.fieldId] + '">' + item.attributes[options.fieldName] + '</option>');
                                });
                            });
                        };
                    }
                    BaseMainMap.prototype.initConfig = function () {
                        var thiss = this;
                        jQuery.ajaxSetup({ async: false });
                        for (var i in thiss.config.module.servicesOnExtent) {
                            for (var j in thiss.config.module.servicesOnExtent[i]) {
                                jQuery.getJSON(thiss.config.module.servicesOnExtent[i][j].url + "?f=json&rnd=" + Math.random(), function () { }).done(function (data, textStatus, jqXHR) {
                                    if (data.error !== undefined || jqXHR.status != 200) return;
                                    thiss.config.module.servicesOnExtent[i][j].minScale = data.minScale;
                                    thiss.config.module.servicesOnExtent[i][j].maxScale = data.maxScale;
                                });
                            }
                        }
                        jQuery.ajaxSetup({ async: true });
                    };
                    BaseMainMap.prototype.buttonConfig = function () {
                        var thiss = this;
                        thiss.$btnPoint.off("click");
                        thiss.$btnPoint.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPoint();
                        });
                        thiss.$btnRectangle.off("click");
                        thiss.$btnRectangle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawRectangle();
                        });
                        thiss.$btnCircle.off("click");
                        thiss.$btnCircle.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawCircle();
                        });
                        thiss.$btnPolygon.off("click");
                        thiss.$btnPolygon.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolygon();
                        });
                        thiss.$btnPolygonFreeHand.off("click");
                        thiss.$btnPolygonFreeHand.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.drawPolygonFreeHand();
                        });
                        thiss.$btnResult.off("click");
                        thiss.$btnResult.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            if (thiss.$divResult.find('>.panel>.panel-body>table>tbody').is(":empty") === true) {
                                window.plugins.toast.showLongBottom("No hay concesiones mineras");
                                return;
                            }
                            thiss.$divResult.toggle();
                        });
                        document.addEventListener("searchbutton", function (e) {
                            thiss.queryFilter({ field: thiss.$lblSelected.attr("data-field"), value: thiss.$txtSearch.val() });
                        }, false);
                    };
                    BaseMainMap.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.$divToc.find('>button').off("click");
                        thiss.$divToc.find('>button').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                        });
                        thiss.$ddlDepartment.off('change');
                        thiss.$ddlDepartment.on('change', function (e) {
                            thiss.$ddlProvince.empty();
                            thiss.$ddlDistrict.empty();
                            thiss.searchProvincesByDepartment(jQuery(this).val());
                            window.plugins.toast.showLongBottom("Seleccione una provincia");
                            //thiss.searchByPoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDepartment, "CD_DEPA", jQuery(this).val());
                        });
                        thiss.$ddlProvince.off('change');
                        thiss.$ddlProvince.on('change', function (e) {
                            thiss.$ddlDistrict.empty();
                            thiss.searchDistrictsByProvince(jQuery(this).val());
                            thiss.searchByPoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdProvince, "CD_PROV", jQuery(this).val());
                        });
                        thiss.$ddlDistrict.off('change');
                        thiss.$ddlDistrict.on('change', function (e) {
                            thiss.searchByPoliticalDivision(thiss.config.module.servicePoliticalDivision.layerIdDistrict, "CD_DIST", jQuery(this).val());
                        });
                        thiss.listDepartments();
                    };
                    BaseMainMap.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$btnPoint = this.$main.find(BaseMainMap.BTNPOINT);
                        this.$btnRectangle = this.$main.find(BaseMainMap.BTNRECTANGLE);
                        this.$btnPolygon = this.$main.find(BaseMainMap.BTNPOLYGON);
                        this.$btnPolygonFreeHand = this.$main.find(BaseMainMap.BTNPOLYGONFREEHAND);
                        this.$btnCircle = this.$main.find(BaseMainMap.BTNCIRCLE);
                        this.$btnEllipse = this.$main.find(BaseMainMap.BTNELLIPSE);
                        this.$baseMaps = this.$main.find('#divBasemaps');
                        this.$btnResult = this.$main.find('#btnResult');
                        this.$tableCoordinates = this.$main.find('#tblResultCoordinates');
                        this.$tableDistricts = this.$main.find('#tblResultDistricts');
                        this.$tableNationalCartographies = this.$main.find('#tblResultNationalCartographies');
                        this.$ddlDepartment = this.$main.find('#ddlDepartment');
                        this.$ddlProvince = this.$main.find('#ddlProvince');
                        this.$ddlDistrict = this.$main.find('#ddlDistrict');
                        this.$divToc = this.$main.find('#divToc');
                    };
                    BaseMainMap.prototype.build = function ($dom, height) {
                        _super.prototype.build.call(this, $dom, height);
                        this.formResult();
                        this.writeToc();
                    };
                    BaseMainMap.prototype.searchByPoliticalDivision = function (layerId, field, value) {
                        this.cleanControls(false);
                    };
                    BaseMainMap.prototype.addLayerToToc = function (service) {

                    };
                    BaseMainMap.prototype.toggleLayer = function (id, isVisible) {

                    };
                    BaseMainMap.prototype.fillCoordinates = function (items) {
                        this.$tableCoordinates.find("tbody").empty();
                        var i = 0;
                        for (i = 0; i < items[0].length - 1; i++) {
                            this.$tableCoordinates.find("tbody").append('<tr><td>' + (i + 1) + '</td><td>' + items[0][i][0] + '</td><td>' + items[0][i][1] + '</td></tr>');
                        }
                    };
                    BaseMainMap.prototype.searchDistricts = function (geometryESRI) {
                        var thiss = this;
                        thiss.searchOverlaps(geometryESRI, thiss.config.module.servicesOverlaps.district.url, thiss.config.module.servicesOverlaps.district.layerId, function (items) {
                            items.forEach(function (item) {
                                thiss.$tableDistricts.find("tbody").append('<tr><td>' + item.attributes.CD_DIST + '</td><td>' + item.attributes.NM_DIST + '</td><td>' + item.attributes.NM_PROV + '</td><td>' + item.attributes.NM_DEPA + '</td></tr>');//<td>' + item.attributes.AREAINTERSECTED.toFixed(thiss.config.number.decimalArea) + '</td>
                            });
                        });
                    };
                    BaseMainMap.prototype.searchNationalCartographies = function (geometryESRI) {
                        var thiss = this;
                        thiss.searchOverlaps(geometryESRI, thiss.config.module.servicesOverlaps.nationalCartography.url, thiss.config.module.servicesOverlaps.nationalCartography.layerId, function (items) {
                            items.forEach(function (item) {
                                thiss.$tableNationalCartographies.find("tbody").append('<tr><td>' + item.attributes.CD_HOJA + '</td><td>' + item.attributes.NM_HOJA + '</td></tr>');//<td>' + item.attributes.AREAINTERSECTED.toFixed(thiss.config.number.decimalArea) + '</td>
                            });
                        });
                    };
                    BaseMainMap.prototype.searchOverlaps = function (geometryESRI, url, layerId, callbackResult) {

                    };
                    BaseMainMap.prototype.cleanControls = function (toNull) {
                        if (this.$divResult !== null) {
                            this.$divResult.find('>.panel>.panel-body>table>tbody').empty();
                            this.$divResult.hide();
                            if (toNull === true) {
                                this.$divResult.empty().hide();
                                this.$divResult = null;
                            }
                        }
                    };
                    return BaseMainMap;
                })(jtm.geometry.SimpleMap);
                miningcadaster.BaseMainMap = BaseMainMap;
            })(miningconcession.miningcadaster || (miningconcession.miningcadaster = {}));
            var miningcadaster = miningconcession.miningcadaster;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));