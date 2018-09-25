(function(com) {
    (function(jtm) {
        (function(minedu) {
            (function(edan) {
                var BaseFormMap = (function(_super) {
                    __extends(BaseFormMap, _super);
                    function BaseFormMap() {
                        _super.call(this);
                        this.layerPoliticalDivision = null;
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
                    };
                    BaseFormMap.prototype.cleanControls = function (toNull) {

                    };
                    return BaseFormMap;
                })(jtm.geometry.SimpleMap);
                edan.BaseFormMap = BaseFormMap;
            })(minedu.edan || (minedu.edan = {}));
            var edan = minedu.edan;
        })(jtm.minedu || (jtm.minedu = {}));
        var minedu = jtm.minedu;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));