(function (com) {
    (function (jtm) {
        (function (socialresponsability) {
            (function (entity) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "e";
                        this.$ddlIdentificationDocument = null;
                        this.$txtDocumentNumber = null;
                        this.$txtAccountingCode = null;
                        this.$ddlInterestGroupType = null;
                        this.$txtAddress = null;
                        this.$txtFoundationDate = null;
                        this.$chkBillable = null;
                        this.$txtLandline = null;
                        this.$ddlSocialClimate = null;
                        this.$ddlLevelInfluence = null;
                        this.$ddlInternalMobilizationCapacity = null;                        
                        this.$ddlEntity = null;
                        this.$ddlRegistryOffice = null;
                        this.$ddlMiningUnit = null;
                        this.$txaObservation = null;
                        this.$ddlSpatialReference = null;
                        this.$txtFoundationDateSearch = null;
                        this.$txtFoundationDateEndSearch = null;
                        this.$ddlDistrictSearch = null;
                        this.$ddlProvinceSearch = null;
                        this.$ddlDepartmentSearch = null;
                        this.$txtDocumentNumberSearch = null;
                        this.$txtAccountingCodeSearch = null;
                        this.$ddlInterestGroupTypeSearch = null;
                        this.$ddlSocialClimateSearch = null;
                        this.$ddlMiningUnitSearch = null;
                        this.$chkBillableSearch = null;
                        this.$ddlNationalCartographySearch = null;
                        this.$ddlHydrographicBasinSearch = null;
                        this.$ddlSpatialReferenceSearch = null;
                        this.$tblResultMembers = null;
                        this.searchMembers = function () {
                            var thiss = this;
                            if (thiss.$hdnId.int32() === 0) { alert(Main.NEWELEMENTID); return; }
                            thiss.searchConfig(com.jtm.Server.contextPath + 'socialresponsability/entity/searchmembers', {
                                data: { id: thiss.$hdnId.int32() }
                            }, function (items) {
                                if (items == null && items.length === 0) return;
                                var html = '';
                                items.forEach(function (item, i) {
                                    html += '<tr data-uniqueid="' + item.id + '" data-index="' + i + '">';
                                    html += '<td>' + (i + 1) + '</td>';
                                    html += '<td>' + item.name + '</td>';
                                    html += '<td>' + item.documentNumber + '</td>';
                                    html += '<td>' + item.interestGroupType.name + '</td>';
                                    html += '</tr>';
                                });
                                thiss.$tblResultMembers.find('>tbody').html(html);
                                thiss.$tblResultMembers.find('>caption>span').html(thiss.$tblResultMembers.find('>tbody>tr').length);
                                com.jtm.helper.Table.highlightRow(thiss.$tblResultMembers);
                            });
                        };
                    }
                    Main.prototype.setModule = function (jsonFile, options, callback) {
                        var thiss = this;
                        options.spatialJSFile = thiss.js.path + "socialresponsability/entity/" + this.apigeo + "mainmap";
                        _super.prototype.setModule.call(this, jsonFile, options, callback);
                    };
                    Main.prototype.load = function () {
                        _super.prototype.load.call(this, "", { module: "socialresponsability", subModule: 'entity' });
                    };
                    Main.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        this.$txtDocumentNumberSearch = this.$main.find("#txtDocumentNumberSearch");
                        this.$txtAccountingCodeSearch = this.$main.find("#txtAccountingCodeSearch");
                        this.$txtFoundationDateSearch = this.$main.find("#txtFoundationDateSearch");
                        this.$txtFoundationDateEndSearch = this.$main.find("#txtFoundationDateEndSearch");
                        this.$ddlInterestGroupTypeSearch = this.$main.find("#ddlInterestGroupTypeSearch");
                        this.$ddlSocialClimateSearch = this.$main.find("#ddlSocialClimateSearch");
                        this.$ddlMiningUnitSearch = this.$main.find("#ddlMiningUnitSearch");                        
                        this.$ddlNationalCartographySearch = this.$main.find("#ddlNationalCartographySearch");
                        this.$ddlHydrographicBasinSearch = this.$main.find("#ddlHydrographicBasinSearch");
                        this.$ddlSpatialReferenceSearch = this.$main.find("#ddlSpatialReferenceSearch");                      
                        this.$ddlDistrictSearch = this.$main.find("#ddlDistrictSearch");
                        this.$ddlProvinceSearch = this.$main.find("#ddlProvinceSearch");
                        this.$ddlDepartmentSearch = this.$main.find("#ddlDepartmentSearch");
                        this.$chkBillableSearch = this.$main.find("#chkBillableSearch");
                    };
                    Main.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        thiss.datePicker(thiss.$txtFoundationDateEndSearch);
                        thiss.datePicker(thiss.$txtFoundationDateSearch);
                        thiss.fillPoliticalDivision(thiss.$ddlDepartmentSearch, thiss.$ddlProvinceSearch, thiss.$ddlDistrictSearch);
                    };
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;                        
                        options = {};
                        options.urlCoordinateSave = com.jtm.Server.contextPath + "socialresponsability/entity/savecoordinatessimple";
                        options.urlCoordinateSaveMultiple = com.jtm.Server.contextPath + "socialresponsability/entity/savecoordinatesmultiple";
                        options.callback = function () {                            
                            thiss.$txtDocumentNumber = thiss.$form.find("#txtDocumentNumber");
                            thiss.$txtAccountingCode = thiss.$form.find("#txtAccountingCode");                            
                            thiss.$txtAddress = thiss.$form.find("#txtAddress");
                            thiss.$txtFoundationDate = thiss.$form.find("#txtFoundationDate");                            
                            thiss.$txtLandline = thiss.$form.find("#txtLandline");
                            thiss.$ddlIdentificationDocument = thiss.$form.find("#ddlIdentificationDocument");
                            thiss.$ddlInterestGroupType = thiss.$form.find("#ddlInterestGroupType");
                            thiss.$ddlSocialClimate = thiss.$form.find("#ddlSocialClimate");
                            thiss.$ddlLevelInfluence = thiss.$form.find("#ddlLevelInfluence");
                            thiss.$ddlInternalMobilizationCapacity = thiss.$form.find("#ddlInternalMobilizationCapacity");
                            thiss.$ddlEntity = thiss.$form.find("#ddlEntity");
                            thiss.$ddlRegistryOffice = thiss.$form.find("#ddlRegistryOffice");
                            thiss.$ddlMiningUnit = thiss.$form.find("#ddlMiningUnit");
                            thiss.$ddlSpatialReference = thiss.$form.find("ddlSpatialReference");
                            thiss.$txaObservation = thiss.$form.find("#txaObservation");                            
                            thiss.$chkBillable = thiss.$form.find("#chkBillable");
                            thiss.datePicker(thiss.$txtFoundationDate);
                            thiss.$tblResultMembers = thiss.$form.find("#tblResultMembers");                            
                            thiss.formAttachment.load(thiss.$form.find(Main.DOMATTACHMENTFORM), {                                
                                urlSave: com.jtm.Server.contextPath + "socialresponsability/entity/savedocument",
                                urlViewer: com.jtm.Server.contextPath + "documentlibrary/document/viewer",
                                urlDelete: com.jtm.Server.contextPath + "documentlibrary/document/delete",
                                urlSearch: com.jtm.Server.contextPath + "socialresponsability/entity/searchdocuments",
                                $hdnId: thiss.$hdnId
                            });
                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;                            
                            thiss.$hdnId.val(item.id);
                            thiss.$txtName.val(item.name);
                            thiss.$ddlIdentificationDocument.val(item.identificationDocument.id === null ? 0 : item.identificationDocument.id);
                            thiss.$txtDocumentNumber.val(item.documentNumber);
                            thiss.$txtAccountingCode.val(item.accountingCode);
                            thiss.$ddlInterestGroupType.val(item.interestGroupType.id);
                            thiss.$txtAddress.val(item.address.home);
                            thiss.$txtFoundationDate.val(item.foundationDate);
                            thiss.$chkBillable.prop("checked", item.billable);
                            thiss.$txtLandline.val(item.landline);
                            thiss.$ddlSocialClimate.val(item.socialClimate.id);
                            thiss.$ddlLevelInfluence.val(item.levelInfluence.id);
                            thiss.$ddlInternalMobilizationCapacity.val(item.internalMobilizationCapacity.id);
                            thiss.$ddlEntity.val(item.interestGroup.id === null ? 0 : item.interestGroup.id);
                            thiss.$ddlRegistryOffice.val(item.registryOffice.id === null ? 0 : item.registryOffice.id);
                            thiss.$ddlMiningUnit.val(item.miningUnit.id === null ? 0 : item.miningUnit.id);
                            thiss.$ddlSpatialReference.val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            thiss.$txaObservation.val(item.observation);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "socialresponsability/entity/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "socialresponsability/entity/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "socialresponsability/entity/searchnationalcartographies", item.id, null);
                            thiss.searchMembers();
                            thiss.formAttachment.search(item.id);                            
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "documentNumber",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "interestGroupType.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "foundationDate",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "socialClimate.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "miningUnit.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.save = function (url, data, options) {
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        data = {
                            id: thiss.$hdnId.int32(),
                            name: thiss.$txtName.val(),
                            identificationDocument: { id: thiss.$ddlIdentificationDocument.int32() },
                            documentNumber: thiss.$txtDocumentNumber.val(),
                            accountingCode: thiss.$txtAccountingCode.val(),
                            interestGroupType: { id: thiss.$ddlInterestGroupType.int32() },
                            address: { home: thiss.$txtAddress.val() },
                            foundationDate: thiss.$txtFoundationDate.date(),
                            billable: thiss.$chkBillable.boolean(),
                            landline: thiss.$txtLandline.val(),
                            socialClimate: { id: thiss.$ddlSocialClimate.int32() },
                            levelInfluence: { id: thiss.$ddlLevelInfluence.int32() },
                            internalMobilizationCapacity: { id: thiss.$ddlInternalMobilizationCapacity.int32() },
                            interestGroup: { id: thiss.$ddlEntity.int32() },
                            registryOffice: { id: thiss.$ddlRegistryOffice.int32() },
                            miningUnit: { id: thiss.$ddlMiningUnit.int32() },
                            observation: thiss.$txaObservation.val(),
                            spatialReference: {
                                id: thiss.$ddlSpatialReference.int32()
                            },
                            state: thiss.$chkState.boolean()
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtName.val() === '') {
                                success = false;
                                message = 'Ingrese el nombre.';
                                thiss.$txtName.focus();
                            } else if (thiss.$ddlIdentificationDocument.int32() === 0) {
                                success = false;
                                message = 'Seleccione el doc. identificación.';
                                thiss.$ddlIdentificationDocument.focus();
                            } else if (thiss.$txtDocumentNumber.val() === '') {
                                success = false;
                                message = 'Ingrese el N° de documento.';
                                thiss.$txtDocumentNumber.focus();
                            } else if (thiss.$ddlInterestGroupType.int32() === 0) {
                                success = false;
                                message = 'Seleccione el tipo.';
                                thiss.$ddlInterestGroupType.focus();
                            } else if (thiss.$txtAddress.val() === '') {
                                success = false;
                                message = 'Ingrese la dirección.';
                                thiss.$txtAddress.focus();
                            } else if (thiss.$ddlSocialClimate.int32() === 0) {
                                success = false;
                                message = 'Seleccione el clima social.';
                                thiss.$ddlSocialClimate.focus();
                            } else if (thiss.$ddlLevelInfluence.int32() === 0) {
                                success = false;
                                message = 'Seleccione el niv. de influencia.';
                                thiss.$ddlLevelInfluence.focus();
                            } else if (thiss.$ddlInternalMobilizationCapacity.int32() === 0) {
                                success = false;
                                message = 'Seleccione la cap. mov. interna.';
                                thiss.$ddlInternalMobilizationCapacity.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        }
                    };
                    Main.prototype.parameters = function () {
                        var thiss = this;
                        return {
                            name: thiss.$txtNameSearch.val(),
                            documentNumber: thiss.$txtDocumentNumberSearch.val(),
                            accountingCode: thiss.$txtAccountingCodeSearch.val(),
                            interestGroupType: { id: thiss.$ddlInterestGroupTypeSearch.int32() },
                            socialClimate: { id: thiss.$ddlSocialClimateSearch.int32() },
                            foundationDate: thiss.$txtFoundationDateSearch.date(),
                            foundationDateEnd: thiss.$txtFoundationDateEndSearch.date(),
                            miningUnit: { id: thiss.$ddlMiningUnitSearch.int32() },
                            billable: thiss.$chkBillableSearch.boolean(),
                            district: {
                                id: thiss.$ddlDistrictSearch.val(),
                                province: {
                                    id: thiss.$ddlProvinceSearch.val(),
                                    department: {
                                        id: thiss.$ddlDepartmentSearch.val()
                                    }
                                }
                            },
                            nationalCartography: {
                                id: thiss.$ddlNationalCartographySearch.val()
                            },
                            hydrographicBasin: {
                                id: thiss.$ddlHydrographicBasinSearch.val()
                            },
                            spatialReference: {
                                id: thiss.$ddlSpatialReferenceSearch.int32()
                            },
                            state: thiss.$chkStateSearch.boolean()
                        };
                    };
                    Main.execute = function () {
                        var client = new Main();
                        client.load();
                    };
                    return Main;
                })(jtm.geometry.BaseGeometry);
                entity.Main = Main;
            })(socialresponsability.entity || (socialresponsability.entity = {}));
            var entity = socialresponsability.entity;
        })(jtm.socialresponsability || (jtm.socialresponsability = {}));
        var socialresponsability = jtm.socialresponsability;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.socialresponsability.entity.Main.execute();