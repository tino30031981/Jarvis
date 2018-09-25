(function(com) {
    (function(jtm) {
        (function(geometry) {
            (function(viewer) {
                (function(widgets) {
                    (function(custom) {
                        (function(event) {
                            var BaseWidget = (function(_super) {
                                __extends(BaseWidget, _super);
                                function BaseWidget() {
                                    _super.call(this);
                                    this.$ddlLayer = null;
                                    this.getSql = function() {
                                        var sql = "1=1";
                                        return sql;
                                    };
                                    this.fillDDL = function($ddl, items, options) {
                                        if ((items instanceof Array) === false) return;
                                        options = options || {};
                                        options.valueField = options.valueField || 'id';
                                        options.displayField = options.displayField || 'name';
                                        $ddl.empty();
                                        if (String.isNullOrWhiteSpace(options.property) === false) {
                                            $ddl.append('<option value="' + BaseWidget.DDLVALUEDEFAULT + '">' + BaseWidget.DDLDISPLAYDEFAULT + '</option>');
                                            items.forEach(function(item) {
                                                $ddl.append('<option value="' + item[property][options.valueField] + '">' + item[property][options.displayField] + '</option>');
                                            }, this);
                                        }
                                        else
                                            items.forEach(function(item) {
                                                $ddl.append('<option value="' + item[options.valueField] + '">' + item[options.displayField] + '</option>');
                                            }, this);
                                        if (String.isNullOrWhiteSpace(options.emelentSelected) === false) {
                                            $ddl.val(options.emelentSelected);
                                            $ddl.trigger("change");
                                        }
                                    };
                                    this.fillLayers = function() {
                                        if ((this.config.module.widget.service.layers instanceof Array) === false) return;
                                        this.$ddlLayer.empty();
                                        this.config.module.widget.service.layers.forEach(function(layer) {
                                            this.$ddlLayer.append('<option value="' + layer.id + '">' + layer.name + '</option>');
                                        }, this);
                                    };
                                }
                                BaseWidget.prototype.onClick = function() {
                                    var thiss = this;
                                    thiss.showView({
                                        dialog: { width: 300 }
                                    });
                                };
                                BaseWidget.prototype.initConfig = function() {
                                    var thiss = this;
                                    _super.prototype.initConfig.call(this);
                                    thiss.config.module.widget.defaultDepartment = thiss.config.module.widget.defaultDepartment || 0;
                                    thiss.config.module.widget.servicePoliticalDivision.url = thiss.config.module.widget.servicePoliticalDivision.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.servicePoliticalDivision.url : thiss.config.module.widget.servicePoliticalDivision.url;
                                    thiss.config.module.widget.service.url = thiss.config.module.widget.service.url.startsWith('http') === false ? com.jtm.Server.contextPath + thiss.config.module.widget.service.url : thiss.config.module.widget.service.url;
                                };
                                BaseWidget.prototype.launchView = function() {
                                    var thiss = this;
                                    this.$ddlDepartment = this.$widget.find('#ddlDepartment');
                                    this.$ddlProvince = this.$widget.find('#ddlProvince');
                                    this.$ddlDistrict = this.$widget.find('#ddlDistrict');
                                    this.$ddlLayer = this.$widget.find('#ddlLayer');
                                    this.fillLayers();
                                    this.$ddlDepartment.off("change");
                                    this.$ddlDepartment.on("change", function(e) {
                                        thiss.$ddlProvince.empty();
                                        thiss.$ddlDistrict.empty();
                                        thiss.resetContainers();
                                        if (jQuery(this).int32() === 0) return;
                                        thiss.searchProvinces();
                                        thiss.searchScope(thiss.config.module.widget.servicePoliticalDivision.layerDepartmentId, jQuery(this).val());
                                    });
                                    this.$ddlProvince.off("change");
                                    this.$ddlProvince.on("change", function(e) {
                                        thiss.$ddlDistrict.empty();
                                        thiss.resetContainers();
                                        if (jQuery(this).int32() === 0) return;
                                        thiss.searchDistricts();
                                        thiss.searchScope(thiss.config.module.widget.servicePoliticalDivision.layerProvinceId, jQuery(this).val());
                                    });
                                    this.$ddlDistrict.off("change");
                                    this.$ddlDistrict.on("change", function(e) {
                                        thiss.resetContainers();
                                        if (jQuery(this).int32() === 0) return;
                                        thiss.searchScope(thiss.config.module.widget.servicePoliticalDivision.layerDistrictId, jQuery(this).val());
                                    });
                                    this.$ddlLayer.off("change");
                                    this.$ddlLayer.on("change", function(e) {
                                        thiss.search();
                                    });
                                    this.searchDepartments();
                                    setTimeout(function() {
                                        thiss.$ddlLayer.trigger('change');
                                    }, 500);
                                };
                                BaseWidget.prototype.search = function() {
                                    var thiss = this;
                                };
                                BaseWidget.prototype.showHideToolbar = function(isShow) {
                                };
                                BaseWidget.prototype.form = function(url, id, options) {
                                    options = options || {};
                                    options.title = "Reporte";
                                    options.dialogTitle = "Reporte";
                                    options.width = jQuery(window).width() / 3;
                                    options.draggable = true;
                                    url = this.js.module.subModule.widget.path + this.configView.uri.base + '_report.html?' + Math.random();
                                    _super.prototype.form.call(this, url, id, options);
                                };
                                BaseWidget.prototype.searchDepartments = function() {
                                    var thiss = this;
                                    thiss.searchConfig(com.jtm.Server.contextPath + "geometry/department/list", {}, function(items) {
                                        thiss.fillDDL(thiss.$ddlDepartment, items, { displayField: 'name', emelentSelected: thiss.config.module.widget.defaultDepartment });
                                    });
                                };
                                BaseWidget.prototype.searchProvinces = function() {
                                    var thiss = this;
                                    thiss.searchConfig(com.jtm.Server.contextPath + "geometry/province/searchbydepartment", { data: { id: thiss.$ddlDepartment.val() }, isJson: false }, function(items) {
                                        thiss.fillDDL(thiss.$ddlProvince, items, { displayField: 'name' });
                                    });
                                };
                                BaseWidget.prototype.searchDistricts = function() {
                                    var thiss = this;
                                    thiss.searchConfig(com.jtm.Server.contextPath + "geometry/district/searchbyprovince", { data: { id: thiss.$ddlProvince.val() }, isJson: false }, function(items) {
                                        thiss.fillDDL(thiss.$ddlDistrict, items, { displayField: 'name' });
                                    });
                                };
                                BaseWidget.prototype.searchScope = function(layerId, id) {

                                };
                                BaseWidget.prototype.cleanControls = function() {
                                    _super.prototype.cleanControls.call(this);
                                };
                                return BaseWidget;
                            })(geometry.Widget);
                            event.BaseWidget = BaseWidget;
                        })(custom.event || (custom.event = {}));
                        var event = custom.event;
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