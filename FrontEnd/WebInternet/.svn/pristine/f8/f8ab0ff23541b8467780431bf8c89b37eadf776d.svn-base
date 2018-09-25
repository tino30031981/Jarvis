(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (vip) {
                            (function (variable) {
                                var BaseWidget = (function (_super) {
                                    __extends(BaseWidget, _super);
                                    function BaseWidget() {
                                        _super.call(this);
                                        this.$txtValue = null;
                                        this.$ddlVariable = null;
                                        this.$ulVariablesAqua = null;
                                        this.$spnValue = null;
                                        this.$spnMeasureUnit = null;
                                        this.layerData = null;
                                        this.searchVariablesByParent = function () {
                                            var thiss = this;
                                            thiss.$ddlVariable.empty();
                                            console.log(thiss.$ddlDistrict.val());
                                            thiss.searchConfig(com.jtm.Server.contextPath + "vip/variable/searchforsliderbyparent",
                                                {   isJson:false,
                                                    data: { ids: [1, 3], parentId: thiss.$ddlDistrict.val() }
                                                }, function (items) {
                                                    items.forEach(function (item) {
                                                        thiss.$ddlVariable.append('<option value="' + item.id + '" data-variable-name="' + (item.measureUnit === null ? '' : item.measureUnit.name) + '" data-value-min="' + (item.limit === null ? 0 : item.limit.min) + '" data-value-max="' + (item.limit === null ? 0 : item.limit.max) + '" data-value-step="' + (item.limit === null ? 0 : item.limit.step) + '">' + item.name + '</option>');
                                                    }, this);
                                                    thiss.$ddlVariable.trigger("change");
                                                });
                                        };
                                        this.searchVariablesAqua = function () {
                                            var thiss = this;
                                            thiss.$ulVariablesAqua.empty();
                                            thiss.searchConfig(com.jtm.Server.contextPath + "vip/variable/searchaqua", { data: { ids: [0] } }, function (items) {
                                                items.forEach(function (item) {
                                                    thiss.$ulVariablesAqua.append('<li class="list-group-item" id="' + item.id + '"><input type="checkbox" value="' + item.id + '" /> ' + item.name + '</li>');
                                                });
                                            });
                                        };
                                        this.fillDDL = function ($ddl, items, options) {
                                            if ((items instanceof Array) === false) return;
                                            options = options || {};
                                            options.valueField = options.valueField || 'id';
                                            options.displayField = options.displayField || 'name';
                                            $ddl.empty();
                                            if (String.isNullOrWhiteSpace(options.property) === false) {
                                                $ddl.append('<option value="' + BaseWidget.DDLVALUEDEFAULT + '">' + BaseWidget.DDLDISPLAYDEFAULT + '</option>');
                                                items.forEach(function (item) {
                                                    $ddl.append('<option value="' + item[property][options.valueField] + '">' + item[property][options.displayField] + '</option>');
                                                }, this);
                                            }
                                            else
                                                items.forEach(function (item) {
                                                    $ddl.append('<option value="' + item[options.valueField] + '">' + item[options.displayField] + '</option>');
                                                }, this);
                                            if (String.isNullOrWhiteSpace(options.emelentSelected) === false) {
                                                $ddl.val(options.emelentSelected);
                                                $ddl.trigger("change");
                                            }
                                        };
                                        this.getSql = function (value) {
                                            var sql = "parentid='{0}' AND variableid={1} AND value<={2}";
                                            sql = sql.replace("{0}", this.$ddlDistrict.val());
                                            sql = sql.replace("{1}", this.$ddlVariable.val());
                                            sql = sql.replace("{2}", value);
                                            return sql;
                                        };
                                    }
                                    BaseWidget.prototype.onClick = function () {
                                        var thiss = this;
                                        thiss.showView({
                                            dialog: { width: 300 }
                                        });
                                    };
                                    BaseWidget.prototype.initConfig = function () {
                                        var thiss = this;
                                        _super.prototype.initConfig.call(this);
                                        thiss.config.module.widget.defaultDepartment = thiss.config.module.widget.defaultDepartment || 0;
                                        thiss.config.module.widget.service.url = thiss.config.module.widget.service.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.service.url : thiss.config.module.widget.service.url;
                                        thiss.config.module.widget.serviceData.url = thiss.config.module.widget.serviceData.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.serviceData.url : thiss.config.module.widget.serviceData.url;
                                    };
                                    BaseWidget.prototype.launchView = function () {
                                        var thiss = this;
                                        this.$ddlVariable = this.$widget.find('#ddlVariable');
                                        this.$ddlDepartment = this.$widget.find('#ddlDepartment');
                                        this.$ddlProvince = this.$widget.find('#ddlProvince');
                                        this.$ddlDistrict = this.$widget.find('#ddlDistrict');
                                        this.$ddlVariable = this.$widget.find('#ddlVariable');
                                        this.$txtValue = this.$widget.find('#txtValue');
                                        this.$ulVariablesAqua = this.$widget.find('#fdsVariablesAqua>ul');
                                        this.$spnValue = this.$widget.find('#spnValue');
                                        this.$spnMeasureUnit = this.$spnValue.find('span:last');
                                        this.$spnValue = this.$spnValue.find('span:first');
                                        this.$ddlDepartment.attr("disabled", true);
                                        this.$ddlDepartment.off("change");
                                        this.$ddlDepartment.on("change", function (e) {
                                            thiss.$ddlProvince.empty();
                                            thiss.$ddlDistrict.empty();
                                            thiss.$ddlVariable.empty();
                                            thiss.resetContainers();
                                            if (jQuery(this).int32() === 0) return;
                                            thiss.searchProvinces();
                                            thiss.searchScope(thiss.config.module.widget.service.layerDepartmentId, jQuery(this).val());
                                        });
                                        this.$ddlProvince.off("change");
                                        this.$ddlProvince.on("change", function (e) {
                                            thiss.$ddlDistrict.empty();
                                            thiss.$ddlVariable.empty();
                                            thiss.resetContainers();
                                            if (jQuery(this).int32() === 0) return;
                                            thiss.searchDistricts();
                                            thiss.searchScope(thiss.config.module.widget.service.layerProvinceId, jQuery(this).val());
                                        });
                                        this.$ddlDistrict.off("change");
                                        this.$ddlDistrict.on("change", function (e) {
                                            thiss.resetContainers();
                                            if (jQuery(this).int32() === 0) return;
                                            thiss.searchVariablesByParent();
                                            thiss.searchScope(thiss.config.module.widget.service.layerDistrictId, jQuery(this).val());                                            
                                        });
                                        this.$ddlVariable.off("change");
                                        this.$ddlVariable.on("change", function (e) {
                                            var $variable = jQuery(this).find(':selected');
                                            thiss.$txtValue.slider('destroy');
                                            thiss.$txtValue.hide();
                                            if ($variable.int32() === 0) {
                                                thiss.$txtValue.hide();
                                                return;
                                            }
                                            thiss.$txtValue.show();
                                            thiss.$txtValue.attr("data-slider-min", $variable.attr("data-value-min"));
                                            thiss.$txtValue.attr("data-slider-max", $variable.attr("data-value-max"));
                                            thiss.$txtValue.attr("data-slider-step", $variable.attr("data-value-step"));
                                            thiss.$txtValue.slider();
                                            thiss.$txtValue.closest('fieldset').find('>.slider').css('width', '100%');
                                            thiss.$spnMeasureUnit.text($variable.attr('data-variable-name'));
                                            thiss.$txtValue.off("slideStop");
                                            thiss.$txtValue.on("slideStop", function (e) {
                                                thiss.$spnValue.text(e.value);
                                                thiss.search(e.value);
                                            });
                                            //thiss.$txtValue.off("change");
                                            //thiss.$txtValue.on("change", function (e) {
                                            //    thiss.$spnValue.text(e.value);
                                            //    thiss.search(e.value);
                                            //});
                                        });
                                        thiss.$ddlVariable.trigger("change");
                                        setTimeout(function () {
                                            thiss.searchDepartments();                                            
                                            thiss.searchVariablesAqua();
                                            //thiss.$ddlDepartment.trigger("change");
                                        }, 500);
                                    };
                                    BaseWidget.prototype.searchDepartments = function () {
                                        var thiss = this;
                                        thiss.searchConfig(com.jtm.Server.contextPath + "geometry/department/list", {}, function (items) {
                                            thiss.fillDDL(thiss.$ddlDepartment, items, { displayField: 'name', emelentSelected: thiss.config.module.widget.defaultDepartment });
                                        });
                                    };
                                    BaseWidget.prototype.searchProvinces = function () {
                                        var thiss = this;
                                        thiss.searchConfig(com.jtm.Server.contextPath + "geometry/province/searchbydepartment", { data: { id: thiss.$ddlDepartment.val() } }, function (items) {
                                            thiss.fillDDL(thiss.$ddlProvince, items, { displayField: 'name' });
                                        });
                                    };
                                    BaseWidget.prototype.searchDistricts = function () {
                                        var thiss = this;
                                        thiss.searchConfig(com.jtm.Server.contextPath + "geometry/district/searchbyprovince", { data: { id: thiss.$ddlProvince.val() } }, function (items) {
                                            thiss.fillDDL(thiss.$ddlDistrict, items, { displayField: 'name' });
                                        });
                                    };
                                    BaseWidget.prototype.searchScope = function (layerId, id) {

                                    };
                                    BaseWidget.prototype.cleanControls = function () {
                                        _super.prototype.cleanControls.call(this);
                                    };
                                    return BaseWidget;
                                })(geometry.Widget);
                                variable.BaseWidget = BaseWidget;
                            })(vip.variable || (vip.variable = {}));
                            var variable = vip.variable;
                        })(custom.vip || (custom.vip = {}));
                        var vip = custom.vip;
                    })(widgets.custom || (widgets.custom = {}));
                    var custom = widgets.custom;
                })(viewer.widgets || (viewer.widgets = {}));
                var widgets = viewer.widgets;
            })(geometry.viewer || (geometry.viewer = {}));
            var viewer = geometry.viewer;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));