(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseGeometry = (function (_super) {
                __extends(BaseGeometry, _super);
                function BaseGeometry() {
                    _super.call(this);
                    this.basePrefix = "geometry";
                    this.$btnUpdateGeometry = null;
                    this.$ddlSpatialReferenceSearch = null;
                    this.$ddlZoneUTMSearch = null;
                    this.$ddlDepartmentSearch = null;
                    this.$ddlProvinceSearch = null;
                    this.$ddlDistrictSearch = null;
                    this.$ddlHydrographicBasinSearch = null;
                    this.$ddlNationalCartographySearch = null;
                    this.viewer = null;
                    this.formViewer = null;
                }
                BaseGeometry.MODULE = 'geometry';
                BaseGeometry.SPATIAL = '#frmSpatial';
                BaseGeometry.SPATIALFORM = '#frmSpatialForm';
                BaseGeometry.DDLSPATIALREFERENCESEARCH = '#ddlSpatialReferenceSearch';
                BaseGeometry.DDLZONEUTMSEARCH = '#ddlZoneUTMSearch';
                BaseGeometry.DDLDEPARTMENTSEARCH = '#ddlDepartmentSearch';
                BaseGeometry.DDLPROVINCESEARCH = '#ddlProvinceSearch';
                BaseGeometry.DDLDISTRICTSEARCH = '#ddlDistrictSearch';
                BaseGeometry.DDLHYDROGRAPHICBASINSEARCH = '#ddlHydrographicBasinSearch';
                BaseGeometry.DDLNATIONALCARTOGRAPHYSEARCH = '#ddlNationalCartographySearch';
                BaseGeometry.prototype.form = function (url, id, options) {
                    var thiss = this;
                    var callback = function () { };
                    if (typeof options.callback === "function")
                        callback = options.callback;
                    options.callback = function () {
                        options.spatialDOM = options.spatialDOM || thiss.$form.find(BaseGeometry.SPATIALFORM);
                        if (typeof options.spatialDOM === "string")
                            options.spatialDOM = jQuery(options.spatialDOM);
                        if (options.spatialDOM.length > 0) {
                            thiss.formViewer.load(options.spatialDOM, {
                                $hdnId: thiss.$hdnId,
                                urlSave: options.urlCoordinateSave,
                                urlSaveMultiple: options.urlCoordinateSaveMultiple
                            });
                            thiss.formViewer.detail = function (url, id) { thiss.detail(url, id); };
                        }
                        callback();
                    }
                    _super.prototype.form.call(this, url, id, options);
                };
                BaseGeometry.prototype.spatialConfig = function (options, callback) {
                    var thiss = this;
                    options = options || {};
                    if (options.refactorized !== true) return;
                    var dependencies = [thiss.js.path + BaseGeometry.MODULE + "/basesimplemap"];
                    var spatialJSFile = thiss.js.path + BaseGeometry.MODULE + "/" + thiss.js.apigeo.path + "simplemap";
                    var baseJS = '';
                    if (String.isNullOrWhiteSpace(options.spatialJSFile) === false) {
                        if (spatialJSFile !== options.spatialJSFile) {
                            dependencies.push(spatialJSFile);
                            baseJS = 'base' + options.spatialJSFile.substring(options.spatialJSFile.lastIndexOf('/') + 1);
                            dependencies.push(thiss.js.module.subModule.path + baseJS);
                        }
                        spatialJSFile = options.spatialJSFile;
                    }
                    if (options.spatialDependencies instanceof Array)
                        options.spatialDependencies.forEach(function (dependencie) {
                            dependencies.push(dependencie);
                        });
                    jQuery.ajaxSetup({ async: false });
                    dependencies.forEach(function (dependency) {
                        jQuery.getScript(dependency + ".js");
                    });
                    jQuery.getScript(spatialJSFile + ".js", function (data, textStatus, jqxhr) {
                        thiss.viewer = getInstance();
                        thiss.viewer.setPathJS(thiss.js);
                        thiss.viewer.setPathJSON(thiss.json);
                        thiss.viewer.setConfig(thiss.config);
                    });
                    jQuery.ajaxSetup({ async: true });
                };
                BaseGeometry.prototype.initConfig = function () {
                    var thiss = this;
                    _super.prototype.initConfig.call(this);
                };
                BaseGeometry.prototype.uiConfig = function () {
                    var thiss = this;
                    _super.prototype.uiConfig.call(this);
                    thiss.viewer.load(thiss.$main);
                };
                BaseGeometry.prototype.setModule = function (jsonFile, options, callback) {
                    var thiss = this;
                    _super.prototype.setModule.call(this, jsonFile, options, function () {
                        //if (navigator.connection !== undefined && navigator.connection.type !== Connection.NONE) {
                        if (options.refactorized !== true) {
                            var dependencies = [thiss.js.path + BaseGeometry.MODULE + "/basesimplemap"];
                            var spatialJSFile = thiss.js.path + BaseGeometry.MODULE + "/" + thiss.apigeo + "simplemap";
                            var baseJS = '';
                            if (String.isNullOrWhiteSpace(options.spatialJSFile) === false) {
                                if (spatialJSFile !== options.spatialJSFile) {
                                    dependencies.push(spatialJSFile);
                                    baseJS = 'base' + options.spatialJSFile.substring(options.spatialJSFile.lastIndexOf('/') + 1);
                                    dependencies.push(thiss.js.module.subModule.path + baseJS);
                                }
                                spatialJSFile = options.spatialJSFile;
                            }
                            if (options.spatialDependencies instanceof Array)
                                options.spatialDependencies.forEach(function (dependencie) {
                                    dependencies.push(dependencie);
                                });
                            jQuery.ajaxSetup({ async: false });
                            dependencies.forEach(function (dependency) {
                                jQuery.getScript(dependency + ".js");
                            });
                            jQuery.getScript(spatialJSFile + ".js", function (data, textStatus, jqxhr) {
                                thiss.viewer = getInstance();
                                thiss.viewer.setPathJS(thiss.js);
                                thiss.viewer.setPathJSON(thiss.json);
                                thiss.viewer.setConfig(thiss.config);
                                thiss.formViewer = getInstance();
                                thiss.formViewer.setPathJS(thiss.js);
                                thiss.formViewer.setPathJSON(thiss.json);
                                thiss.formViewer.setConfig(thiss.config);
                            });
                            jQuery.ajaxSetup({ async: true });
                        }
                        //}
                        //else {
                        //    alert("El mapa no está disponible", null, "Aceptar");
                        //}
                        if (typeof callback === "function")
                            callback();
                    });
                };
                BaseGeometry.prototype.search = function (url, options, callback) {
                    var thiss = this;
                    _super.prototype.search.call(this, url, options, function (data) {
                        if (typeof callback === "function")
                            callback(data);
                        thiss.viewer.removeLayers(false);
                        if (thiss.viewer.map !== null && data.featuresList !== undefined && data.featuresList !== null) {
                            thiss.viewer.addFeatures(data.featuresList, false);
                            thiss.viewer.$map.css("height", thiss.$table.closest('.panel').outerHeight(true) - 40);
                        }
                    });
                };
                BaseGeometry.prototype.onElementSelected = function ($row) {
                    var thiss = this;
                    var id = $row.attr("data-uniqueid");
                    if (id == undefined || id == null)
                        id = $row.attr("data-uniquecode");
                    thiss.viewer.selectedFeature(id, true);
                };
                return BaseGeometry;
            })(jtm.Master);
            geometry.BaseGeometry = BaseGeometry;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
//El siguiente objeto está en prueba, por favor no utilizar en los objetos ya existentes
(function (com) {
    (function (jtm) {
        (function (geometry) {
            var BaseGeometryForm = (function (_super) {
                __extends(BaseGeometryForm, _super);
                function BaseGeometryForm() {
                    _super.call(this);
                    this.$ddlSpatialReference = null;
                    this.$ddlZoneUTM = null;
                    this.$ddlDepartment = null;
                    this.$ddlProvince = null;
                    this.$ddlDistrict = null;
                    this.$ddlHydrographicBasin = null;
                    this.$ddlNationalCartography = null;
                    this.$spatialDom = null;
                }
                BaseGeometryForm.MODULE = 'geometry';
                BaseGeometryForm.SPATIAL = '#frmSpatialForm';

                BaseGeometryForm.prototype.domConfig = function () {
                    _super.prototype.domConfig.call(this);
                    this.$spatialDom = this.$spatialDom || this.$main.find(BaseGeometryForm.SPATIAL);

                    if (typeof this.$spatialDom === "string")
                        this.$spatialDom = jQuery(this.$spatialDom);
                    this.$spatialDom = this.$spatialDom || this.$main;
                };
                BaseGeometryForm.prototype.viewConfig = function () {
                    var thiss = this;
                    _super.prototype.viewConfig.call(this);


                };
                BaseGeometryForm.prototype.uiConfig = function (options) {
                    _super.prototype.uiConfig.call(this);
                    if (this.$spatialDom.length > 0) {
                        this.viewer.load(this.$spatialDom, {
                            $hdnId: thiss.$hdnId,
                            urlSave: options.urlCoordinateSave,
                            urlSaveMultiple: options.urlCoordinateSaveMultiple
                        });
                        thiss.viewer.detail = function (url, id) { thiss.detail(url, id); };
                    }
                };
                BaseGeometryForm.prototype.spatialConfig = function (options, callback) {
                    var thiss = this;
                    var dependencies = [thiss.js.path + BaseGeometryForm.MODULE + "/basesimplemap"];
                    var spatialJSFile = thiss.js.path + BaseGeometryForm.MODULE + "/" + this.js.apigeo.path + "simplemap";
                    var baseJS = '';
                    if (String.isNullOrWhiteSpace(options.spatialJSFile) === false) {
                        if (spatialJSFile !== options.spatialJSFile) {
                            dependencies.push(spatialJSFile);
                            baseJS = 'base' + options.spatialJSFile.substring(options.spatialJSFile.lastIndexOf('/') + 1);
                            dependencies.push(thiss.js.module.subModule.path + baseJS);
                        }
                        spatialJSFile = options.spatialJSFile;
                    }
                    if (options.spatialDependencies instanceof Array)
                        options.spatialDependencies.forEach(function (dependencie) {
                            dependencies.push(dependencie);
                        });
                    jQuery.ajaxSetup({ async: false });
                    dependencies.forEach(function (dependency) {
                        jQuery.getScript(dependency + ".js");
                    });
                    jQuery.getScript(spatialJSFile + ".js", function (data, textStatus, jqxhr) {
                        thiss.viewer = getInstance();
                        thiss.viewer.setPathJS(thiss.js);
                        thiss.viewer.setPathJSON(thiss.json);
                        thiss.viewer.setConfig(thiss.config);
                    });
                    jQuery.ajaxSetup({ async: true });
                    if (typeof callback === "function")
                        callback();
                };
                BaseGeometryForm.prototype.load = function (url, id, options) {
                    var thiss = this;
                    options = options || {};
                    var callback = function () { };
                    if (typeof options.callback === "function")
                        callback = options.callback;
                    this.$spatialDom = options.spatialDOM;
                    options.callback = function () {
                        callback();
                    }
                    _super.prototype.load.call(this, url, id, options);
                };
                return BaseGeometryForm;
            })(jtm.MasterForm);
            geometry.BaseGeometryForm = BaseGeometryForm;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));