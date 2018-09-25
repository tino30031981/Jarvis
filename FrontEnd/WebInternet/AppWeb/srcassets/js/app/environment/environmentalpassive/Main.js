(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (environmentalpassive) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "pt";
                        this.tracing = null;
                        this.searchImages = function () {
                            var thiss = this;
                            var id = thiss.$hdnId.int32();
                            var options = {
                                isJson: false,
                                data: { id: id },
                                validate: validate
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + "environment/environmentalpassive/searchimages", options, function (data) {
                                jQuery('#imgRecord').attr('src', '');
                                jQuery('#imgRecord').attr("alt", '');
                                if (data.length > 0) {
                                    thiss.fillRecordImages(data);
                                    jQuery('#ddlImage').val(data[data.length - 1].id);
                                    thiss.navigationRecordHandler();
                                }
                            });
                            function validate() {
                                if (id === 0) {
                                    alert(Main.NEWELEMENTID);
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.fillRecordImages = function (items) {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            $ddl.empty();
                            for (var i = 0; i < items.length; i++) {
                                $ddl.append('<option name="' + items[i].id + '" value="' + items[i].id + '">Imagen ' + (i + 1) + '</option>');
                            }
                        };
                        this.navigationRecordHandler = function () {
                            var thiss = this;
                            var $ddl = $('#ddlImage');
                            var $img = $('#imgRecord');
                            $img.off("load");
                            $img.on("load", function (e) {
                                thiss.loadingHide();
                            });
                            $img.off("error");
                            $img.on("error", function (e) {
                                jQuery(this).attr("alt", "No se pudo cargar la imagen");
                                thiss.loadingHide();
                            });
                            $ddl.off("change");
                            $ddl.on("change", function (e) {
                                thiss.loadingShow();
                                jQuery('#imgRecord').attr("src", "");
                                if (jQuery(this).int32() === 0) return;
                                jQuery('#hdnImageId').val(jQuery(this).int32());
                                jQuery('#imgRecord').attr("alt", "Imagen: " + jQuery(this).int32());
                                jQuery('#imgRecord').attr("src", com.jtm.Server.contextPath + "documentlibrary/document/viewer?id=" + jQuery(this).int32());
                            });
                            jQuery('#btnFirst').off("click");
                            jQuery('#btnFirst').on("click", function (e) {
                                $ddl.val($ddl.find("option:first-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            jQuery('#btnLast').off("click");
                            jQuery('#btnLast').on("click", function (e) {
                                $ddl.val($ddl.find("option:last-child").val()).attr('selected', true);
                                $ddl.trigger("change");
                            });
                            jQuery('#btnPrevious').off("click");
                            jQuery('#btnPrevious').on("click", function (e) {
                                var index = $ddl.find(":selected").index() - 1;
                                if (index >= 0) {
                                    $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                    $ddl.trigger("change");
                                }
                            });
                            jQuery('#btnNext').off("click");
                            jQuery('#btnNext').on("click", function (e) {
                                var index = $ddl.find(":selected").index() + 1;
                                var lastIndex = $ddl.find(":last-child").index();
                                if (index <= lastIndex) {
                                    $ddl.val($ddl.find('option:eq(' + index + ')').val()).attr('selected', true);
                                    $ddl.trigger("change");
                                }
                            });
                            $ddl.trigger("change");
                        };
                        this.saveImage = function () {
                            var thiss = this;
                            var item = { id: thiss.$hdnId.int32() };
                            var options = {
                                data: item,
                                attachments: [{ id: "filPhoto", file: jQuery('#filPhoto')[0].files[0] }],
                                validate: validate
                            };
                            this.saveConfig(com.jtm.Server.contextPath + 'environment/environmentalpassive/savedocument', options, function (item) {
                                thiss.searchImages();
                                jQuery('#filPhoto').val('');
                            });
                            function validate() {
                                if (jQuery('#filPhoto').val() === '') {
                                    alert('Seleccione una foto.');
                                    return false;
                                }
                                return true;
                            }
                        };
                        this.deleteImage = function (id) {
                            var thiss = this;
                            var options = {
                                data: { id: id },
                                isJson: false
                            };
                            thiss.deleteConfig(com.jtm.Server.contextPath + 'documentlibrary/document/delete', options, function () {
                                thiss.searchImages();
                            });
                        };
                        this.fillddl = function (ddl, id, div) {
                            var thiss = this;
                            var count = 0;
                            var options = { data: { id: id }, validate: true };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/environmentalpassivetype/searchbyparent', options, function (items) {
                                if (items.length > 0) {
                                    count = items.length;
                                    com.jtm.helper.DropDownList.fillLocal({
                                        ddl: ddl,
                                        items: items,
                                        addDefaultOption: true
                                    });
                                    //if (jQuery('#ddlEnvironmentalPassiveType3 > option').length > 0)
                                    jQuery(div).show();
                                }
                                jQuery(ddl).trigger('change');
                            });
                            return count;
                        };
                        this.searchOfficialCoordinates = function () {
                            var thiss = this;
                            thiss.DDLSPATIALREFERENCE = "#ddlOfficialSpatialReference";
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/environmentalpassive/searchOfficialcoordinates', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (item) {
                                thiss.formViewer.fillCoordinates(item.coordinates);
                                thiss.DDLSPATIALREFERENCE = "#ddlSpatialReference";
                            });
                        };
                        this.saveOfficialCoordinates = function () {
                            var thiss = this;
                            if (jQuery('#tblResultCoordinates').find(">tbody>tr>td>input").val() === '' || jQuery('#tblResultCoordinates').find(">tbody>tr>td>input").val() === 0) {
                                alert("Ingrese todas las coordenadas", null, "Sigemin: ");
                                return;
                            }
                            var items = [];
                            jQuery('#tblResultCoordinates').find(">tbody>tr").toArray().forEach(function (tr) {
                                items.push({ x: parseFloat(jQuery(tr).find('td:eq(1)>input').val()), y: parseFloat(jQuery(tr).find('td:eq(2)>input').val()) });
                            });
                            var options = {};
                            var data = {
                                id: this.$hdnId.int32(),
                                spatialReference: {
                                    id: jQuery('#ddlOfficialSpatialReference').int32()
                                },
                                coordinates: items
                            };
                            function validate() {
                                if (thiss.$hdnId.int32() === 0) {
                                    alert(BaseSimpleMap.NEWELEMENTID);
                                    return false;
                                }
                                if (jQuery('#ddlOfficialSpatialReference').int32() === 0) {
                                    alert("Seleccione el sistema referencial");
                                    jQuery('#ddlOfficialSpatialReference').focus();
                                    return false;
                                }
                                return true;
                            }
                            options.validate = validate;
                            options.data = data;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/environmentalpassive/updateofficialgeometry', options, function (data) {
                                alert(data.message);
                            });
                        };
                    }
                    Main.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.fillPoliticalDivision('#ddlDepartmentSearch', '#ddlProvinceSearch', '#ddlDistrictSearch');
                    };
                    Main.prototype.uiConfig = function () {
                        var thiss = this;
                        _super.prototype.uiConfig.call(this);
                        
                    };
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        _super.prototype.setModule.call(this, jsonFile, options, function () {
                            jQuery.ajaxSetup({ async: false });
                            jQuery.getScript(thiss.js.path + "documentlibrary/basetracing.js");
                            jQuery.getScript(thiss.js.path + "environment/environmentalpassive/tracing.js", function (data, textStatus, jqxhr) {
                                thiss.tracing = getInstance();
                                thiss.tracing.setConfig(thiss.config);
                            });
                        });
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        var options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "environment/environmentalpassive/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "environment/environmentalpassive/savecoordinatesmultiple";
                        options.callback = function () {
                            thiss.datePicker('#txtVerificationDate');
                            thiss.datePicker('#txtResolutionDate');
                            jQuery('#chkTool').off("change");
                            jQuery('#chkTool').on("change", function (e) {
                                if ($(this).is(':checked')) {
                                    jQuery('#txtToolDescription').show();
                                    jQuery('#divToolDescription').show();
                                }
                                else {
                                    jQuery('#txtToolDescription').empty();
                                    jQuery('#divToolDescription').hide();
                                }
                                });
                            jQuery('#chkVerification').off("change");
                            jQuery('#chkVerification').on("change", function (e) {
                                if ($(this).is(':checked')) {
                                    jQuery('#txtVerificationDate').show();
                                    jQuery('#divVerificationDate').show();
                                }
                                else {
                                    jQuery('#txtVerificationDate').empty();
                                    jQuery('#divVerificationDate').hide();
                                }
                            });
                            jQuery('#btnAddPhoto').off("click");
                            jQuery('#btnAddPhoto').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    jQuery('#filPhoto').trigger('click');
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#filPhoto').off("change");
                            jQuery('#filPhoto').on("change", function (e) {
                                if (e.originalEvent.target.files.length) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    thiss.saveImage();
                                }
                            });
                            jQuery('#btnDeletePhoto').off("click");
                            jQuery('#btnDeletePhoto').on("click", function (e) {
                                if (jQuery('#hdnImageId').int32() !== 0) {
                                    var id = jQuery('#hdnImageId').int32();
                                    thiss.deleteImage(id);
                                }
                                else
                                    alert('No existe imagen para eliminar.');
                            });
                            thiss.fillddl('#ddlEnvironmentalPassiveType', 0);
                            jQuery('#ddlEnvironmentalPassiveType').off('change');
                            jQuery('#ddlEnvironmentalPassiveType').on('change', function (e) {
                                jQuery('#ddlEnvironmentalPassiveType2').empty();
                                jQuery('#ddlEnvironmentalPassiveType3').empty();
                                jQuery('#divEnvironmentalPassiveType2').hide();
                                jQuery('#divEnvironmentalPassiveType3').hide();
                                if ($(this).int32() > 0) {
                                    thiss.fillddl('#ddlEnvironmentalPassiveType2', $(this).int32(), '#divEnvironmentalPassiveType2');
                                }
                            });
                            jQuery('#ddlEnvironmentalPassiveType2').off('change');
                            jQuery('#ddlEnvironmentalPassiveType2').on('change', function (e) {
                                jQuery('#ddlEnvironmentalPassiveType3').empty();
                                jQuery('#divEnvironmentalPassiveType3').hide();
                                if ($(this).int32() > 0) {
                                    thiss.fillddl('#ddlEnvironmentalPassiveType3', $(this).int32(), '#divEnvironmentalPassiveType3');
                                }
                            });
                            $('#chkTool').trigger('change');
                            $('#chkVerification').trigger('change');
                            
                            jQuery('#btnUpdateOfficialGeometry').off("click");
                            jQuery('#btnUpdateOfficialGeometry').on("click", function (e) {
                                if (thiss.$hdnId.int32() !== 0)
                                    thiss.saveOfficialCoordinates();
                                else
                                    alert(Main.NEWELEMENTID);
                            });
                            jQuery('#ddlEnvironmentalPassiveType').trigger('change');
                            //thiss.DDLSPATIALREFERENCE = "#ddlOfficialSpatialReference";
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            console.log(data);
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtOfficialCode').val(item.companyCode);
                            jQuery('#txtName').val(item.name);
                            jQuery('#ddlEnvironmentalPassiveType').val(item.environmentalPassiveType.id);
                            jQuery('#ddlEnvironmentalPassiveType').trigger('change');
                            jQuery('#ddlEnvironmentalPassiveType2').val(item.environmentalPassiveType2.id);
                            jQuery('#ddlEnvironmentalPassiveType2').trigger('change');
                            jQuery('#ddlEnvironmentalPassiveType3').val(item.environmentalPassiveType3.id);
                            jQuery('#txtAntecedent').val(item.antecedent);
                            jQuery('#txtDescription').val(item.description);
                            jQuery('#ddlSituation').val(item.situation.id);
                            jQuery('#ddlMineralType').val(item.mineralType.id);
                            jQuery('#ddlMiningUnit').val(item.miningUnit.id);
                            jQuery('#chkTool').prop("checked", item.tool);
                            jQuery('#txtToolDescription').val(item.toolDescription);
                            jQuery('#chkVerification').prop("checked", item.verification);
                            jQuery('#txtVerificationDate').val(item.verificationDate);
                            jQuery('#txtVerificationDate').datepicker("update", item.verificationDate);
                            jQuery('#txtResolutionNumber').val(item.resolutionNumber);
                            jQuery('#txtResolutionDate').val(item.resolutionDate);
                            jQuery('#txtResolutionDate').datepicker("update", item.resolutionDate);
                            jQuery('#txtWidth').val(item.dimension.width);
                            jQuery('#txtHigh').val(item.dimension.high);
                            jQuery('#txtLong').val(item.dimension.long);
                            jQuery('#txtDepth').val(item.dimension.depth);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "environment/environmentalpassive/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "environment/environmentalpassive/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "environment/environmentalpassive/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "environment/environmentalpassive/searchtowncenters", item.id, null);
                            thiss.searchImages();
                            thiss.searchOfficialCoordinates();
                            thiss.tracing.load(thiss.$form.find(Main.DOMTRACINGFORM), {
                                $hdnId: thiss.$hdnId
                            });
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "code",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "miningUnit.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "resolutionNumber",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "resolutionDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').string(),
                            name: jQuery('#txtNameSearch').string(),
                            miningUnit: { id: jQuery('#ddlMiningUnitSearch').int32() },
                            mineralType: { id: jQuery('#ddlMineralTypeSearch').int32() },
                            situation: { id: jQuery('#ddlSituationSearch').int32() },
                            environmentalPassiveType: { id: jQuery('#ddlEnvironmentalPassiveTypeSearch').int32() },
                            district: {
                                id: jQuery('#ddlDistrictSearch').string(),
                                province: {
                                    id: jQuery('#ddlProvinceSearch').string(),
                                    department: {
                                        id: jQuery('#ddlDepartmentSearch').string()
                                    }
                                }
                            },
                            nationalCartography: {
                                id: jQuery('#ddlNationalCartographySearch').string()
                            },
                            hydrographicBasin: {
                                id: jQuery('#ddlHydrographicBasinSearch').string()
                            },
                            spatialReference: {
                                id: jQuery('#ddlSpatialReferenceSearch').int32()
                            },
                            state: jQuery('#chkStateSearch').boolean()
                        };
                    };
                    Main.prototype.save = function (url, data, options) {
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: this.$hdnId.int32(),
                            code: jQuery('#txtCode').string(),
                            companyCode: jQuery('#txtOfficialCode').string(),
                            name: jQuery('#txtName').string(),
                            antecedent: jQuery('#txtAntecedent').string(),
                            description: jQuery('#txtDescription').string(),
                            situation: { id: jQuery('#ddlSituation').int32() },
                            environmentalPassiveType: { id: jQuery('#ddlEnvironmentalPassiveType').int32() },
                            environmentalPassiveType2: { id: jQuery('#ddlEnvironmentalPassiveType2').int32() },
                            environmentalPassiveType3: { id: jQuery('#ddlEnvironmentalPassiveType3').int32() },
                            mineralType: { id: jQuery('#ddlMineralType').int32() },
                            miningUnit: { id: jQuery('#ddlMiningUnit').int32() },
                            tool: jQuery('#chkTool').boolean(),
                            toolDescription: jQuery('#txtToolDescription').string(),
                            verification: jQuery('#chkVerification').boolean(),
                            verificationDate: jQuery('#txtVerificationDate').date(),
                            resolutionNumber: jQuery('#txtResolutionNumber').string(),
                            resolutionDate: jQuery('#txtResolutionDate').date(),
                            dimension: {
                                high: jQuery('#txtHigh').string(),
                                width: jQuery('#txtWidth').string(),
                                long: jQuery('#txtLong').string(),
                                depth: jQuery('#txtDepth').string(),
                            },
                            geoReferenceType: { Id: null },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            coordinate: { x: jQuery('#txtX').number(), y: jQuery('#txtY').number() },
                            state: 1
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el código.';
                                jQuery('#txtCode').focus();
                            } else if (jQuery('#txtOfficialCode').string() === '') {
                                success = false;
                                message = 'Ingrese el código interno.';
                                jQuery('#txtOfficialCode').focus();
                            } else if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese la denominación.';
                                jQuery('#txtName').focus();
                            } else if (jQuery('#ddlSituation').int32() === 0) {
                                success = false;
                                message = 'Seleccione la situación.';
                                jQuery('#ddlSituation').focus();
                            } else if (jQuery('#ddlMineralType').int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo de sustacia.';
                                jQuery('#ddlMineralType').focus();
                            } else if (jQuery('#ddlMiningUnit').int32() === 0) {
                                success = false;
                                message = 'Seleccione la unidad minera.';
                                jQuery('#ddlMiningUnit').focus();
                            } else if (jQuery('#txtResolutionNumber').string() === '') {
                                success = false;
                                message = 'Ingrese la codigo de formulación.';
                                jQuery('#txtResolutionNumber').focus();
                            } else if (jQuery('#txtResolutionDate').string() === '') {
                                success = false;
                                message = 'Ingrese la fecha de formulación.';
                                jQuery('#txtResolutionDate').focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                environmentalpassive.Main = Main;
            })(environment.environmentalpassive || (environment.environmentalpassive = {}));
            var environmentalpassive = environment.environmentalpassive;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.environmentalpassive.Main.execute();