(function (com) {
    (function (jtm) {
        (function (miningunit) {
            (function (miningunit) {
                var Main = (function (_super) {
                    __extends(Main, _super);
                    function Main() {
                        _super.call(this);
                        this.prefix = "mu";
                    }
                    Main.prototype.form = function (url, id, options) {
                        var thiss = this;
                        options = {};
                        options.callback = function () {

                        };
                        _super.prototype.form.call(this, url, id, options);
                    };
                    Main.prototype.detail = function (url, id, options) {
                        var thiss = this;
                        _super.prototype.detail.call(this, null, id, null, function (data) {
                            var item = data.item;
                            thiss.$hdnId.val(item.id);
                            jQuery('#txtCode').val(item.code);
                            jQuery('#txtName').val(item.name);
                            jQuery('#txtAddressHome').val(item.address.home);
                            jQuery('#txtLocation').val(item.location);
                            jQuery('#txtLandLine').val(item.landLine);
                            jQuery('#txtMsnm').val(item.msnm);
                            jQuery('#ddlActivity').val(item.activity.id === null ? 0 : item.activity.id);
                            jQuery('#ddlHolder').val(item.holder.id === null ? 0 : item.holder.id);
                            jQuery('#ddlSpatialReference').val(item.spatialReference.id === null ? 0 : item.spatialReference.id);
                            jQuery('#chkState').prop("checked", item.state);
                            thiss.formViewer.fillCoordinates(item.coordinate);
                            thiss.formViewer.addFeatures(data.featuresList, false);
                            thiss.formViewer.searchDistricts(com.jtm.Server.contextPath + "miningunit/miningunit/searchdistricts", item.id, null);
                            thiss.formViewer.searchHydrographicBasins(com.jtm.Server.contextPath + "miningunit/miningunit/searchhydrographicbasins", item.id, null);
                            thiss.formViewer.searchNationalCartographies(com.jtm.Server.contextPath + "miningunit/miningunit/searchnationalcartographies", item.id, null);
                            thiss.formViewer.searchTownCenters(com.jtm.Server.contextPath + "miningunit/miningunit/searchtowncenters", item.id, null);
                        });
                    };
                    Main.prototype.search = function (url, options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.columns = [{
                            field: 'code',
                            sortable: true,
                            visible: true,
                            searchable: false,
                            switchable: false
                        }, {
                            field: "name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: false
                        }, {
                            field: "activity.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }, {
                            field: "holder.name",
                            searchable: false,
                            sortable: true,
                            visible: true,
                            switchable: true
                        }];
                        _super.prototype.search.call(this, url, options, callback);
                    };
                    Main.prototype.parameters = function () {
                        return {
                            code: jQuery('#txtCodeSearch').val(),
                            name: jQuery('#txtNameSearch').val(),
                            activity: { id: jQuery('#ddlActivitySearch').int32() },
                            holder: { id: jQuery('#ddlHolderSearch').int32() },
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
                        var thiss = this;
                        options = options || {};
                        options.validate = validate;
                        var coordinate = null;
                        if (jQuery('#txtX').number() !== 0 && jQuery('#txtY').number() !== 0) {
                            coordinate = { x: jQuery('#txtX').number(), y: jQuery('#txtY').number() };
                        }
                        data = {
                            id: thiss.$hdnId.int32(),
                            code: jQuery('#txtCode').val(),
                            name: jQuery('#txtName').val(),
                            landLine: jQuery('#txtLandLine').val(),
                            location: jQuery('#txtLocation').val(),
                            msnm: jQuery('#txtMsnm').val(),
                            address: { home: jQuery('#txtAddressHome').val() },
                            activity: { id: jQuery('#ddlActivity').int32() },
                            holder: { id: jQuery('#ddlHolder').int32() },
                            spatialReference: { id: jQuery('#ddlSpatialReference').int32() },
                            coordinate: coordinate,
                            state: jQuery('#chkState').boolean(),
                        };
                        _super.prototype.save.call(this, url, data, options);
                        function validate() {
                            var success = true;
                            var message = '';
                            if (jQuery('#txtName').string() === '') {
                                success = false;
                                message = 'Ingrese el Nombre.';
                                jQuery('#txtName').focus();
                            }
                            else if (jQuery('#txtCode').string() === '') {
                                success = false;
                                message = 'Ingrese el Codigo.';
                                jQuery('#txtCode').focus();
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
                miningunit.Main = Main;
            })(miningunit.miningunit || (miningunit.miningunit = {}));
            var miningunit = miningunit.miningunit;
        })(jtm.miningunit || (jtm.miningunit = {}));
        var miningunit = jtm.miningunit;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningunit.miningunit.Main.execute();