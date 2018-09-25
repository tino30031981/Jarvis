(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Overlap = (function (_super) {
                    __extends(Overlap, _super);
                    function Overlap() {
                        _super.call(this);
                        this.$btnResult = null;
                        this.contentCSV = function () {
                            var thiss = this;
                            var csv = 'Listado de superposiciones\r\n' + '\r\n';
                            var $tables = thiss.viewer.$divResult.find("table");
                            $tables.toArray().forEach(function (table) {
                                csv += jQuery(table).find("caption").text() + '\r\n';
                                jQuery(table).find(">thead>tr>th").toArray().forEach(function (th) {
                                    csv += jQuery(th).text() + ",";
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n';
                                jQuery(table).find(">tbody>tr").toArray().forEach(function (tr) {
                                    jQuery(tr).find(">td").toArray().forEach(function (td) {
                                        csv += jQuery(td).text() + ",";
                                    });
                                    csv += '\r\n';
                                });
                                csv = csv.replace(/,\s*$/, "") + '\r\n' + '\r\n';
                            });
                            return csv;
                        };
                        this.shareData = function () {
                            var thiss = this;
                            this.viewer.$divResult.hide();
                            if (this.viewer.$divResult.find('table').length === 0) {
                                window.plugins.toast.showLongBottom("No hay elementos superpuestos para compartir");
                                return;
                            }
                            var fileName = "overlaps_" + thiss.getUUID();
                            var csv = thiss.contentCSV();
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directory) {
                                directory.getFile(fileName + ".csv", { create: true }, function (fileEntry) {
                                    fileEntry.createWriter(function (fileWriter) {
                                        fileWriter.seek(fileWriter.length);
                                        fileWriter.write(csv);
                                        var canvas = thiss.$main.find('canvas')[0];
                                        canvas.toBlob(function (blob) {
                                            var $img = $('<img />');
                                            $img.addClass("img-responsive");
                                            $img.css("z-index", 99999999);
                                            var url = URL.createObjectURL(blob);
                                            $img.on("load", function () {
                                                URL.revokeObjectURL(url);
                                            });
                                            thiss.$main.find("canvas").closest("div").prepend($img);
                                            $img.attr("src", url);
                                            setTimeout(function () {
                                                navigator.screenshot.save(function (error, response) {
                                                    $img.remove();
                                                    if (error) {
                                                        window.plugins.toast.showLongBottom(error);
                                                    } else {
                                                        response.filePath = 'file://' + response.filePath;
                                                        window.plugins.socialsharing.shareViaEmail('Envío los elementos superpuestos', 'Sigemin Mobile',
                                                            null, null, null, [fileEntry.toURL(), response.filePath],
                                                            function (success) {
                                                                window.plugins.toast.showLongBottom("Se he enviado el mensaje");
                                                                window.resolveLocalFileSystemURL(fileEntry.toURL(), function (fe) {
                                                                    fe.remove(null, null);
                                                                });
                                                                //window.resolveLocalFileSystemURL(response.filePath, function (fe) {
                                                                //    fe.remove(null, null);
                                                                //});
                                                            },
                                                            function (error) { }
                                                        );
                                                    }
                                                }, 'png', 100, fileName);
                                            }, 1000);
                                        });
                                    }, fail);
                                });
                            });
                            function fail(error) {
                                window.plugins.toast.showLongBottom(error);
                            }
                        };
                        this.setServices = function () {
                            var thiss = this;
                            thiss.config.module.servicesNew = [];
                            var length = 0;
                            jQuery.ajaxSetup({ async: false });
                            setData(thiss.config.module.services, thiss.config.module.servicesNew);
                            jQuery.ajaxSetup({ async: true });
                            thiss.config.module.services = thiss.config.module.servicesNew;
                            delete thiss.config.module.servicesNew;
                            function setData(services, servicesNew) {
                                for (var i = 0; i < services.length; i++) {
                                    if (services[i].services instanceof Array) {
                                        var length = servicesNew.push(JSON.parse(JSON.stringify(services[i])));
                                        servicesNew[length - 1].services = [];
                                        setData(services[i].services, servicesNew[length - 1].services);
                                    } else {
                                        if (services[i].groups instanceof Array) {
                                            jQuery.getJSON(services[i].url + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                                if (data.error !== undefined || jqXHR.status != 200) { services[i].disabled = true; return; }
                                                for (var j = 0; j < data.layers.length; j++) {
                                                    if (data.layers[j].subLayerIds instanceof Array) continue;
                                                    if (services[i].groups.exist2('layerId', j) === true) {
                                                        length = servicesNew.push(services[i].groups.find2('layerId', j));
                                                        servicesNew[length - 1].UUID = 'overlap_' + thiss.getUUID();
                                                        servicesNew[length - 1].url = services[i].url;
                                                        servicesNew[length - 1].name = data.layers[j].name;
                                                        servicesNew[length - 1].displayField = data.layers[j].displayField;
                                                        servicesNew[length - 1].geometryType = data.layers[j].geometryType;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            jQuery.getJSON(services[i].url + '/' + services[i].layerId + "?f=json&rnd=" + Math.random()).done(function (data, textStatus, jqXHR) {
                                                if (data.error !== undefined || jqXHR.status != 200) { services[i].disabled = true; return; }
                                                length = servicesNew.push(services[i]);
                                                servicesNew[length - 1].UUID = 'overlap_' + thiss.getUUID();
                                                servicesNew[length - 1].name = data.name;
                                                servicesNew[length - 1].displayField = data.displayField;
                                                servicesNew[length - 1].geometryType = data.geometryType;
                                            });
                                        }
                                    }
                                }
                            }
                        };
                        this.getService = function (id) {
                            return getById(this.config.module.services);
                            function getById(services) {
                                var service = null;
                                for (var i = 0; i < services.length; i++) {
                                    service = services[i].services.find2('UUID', id);
                                    if (service !== null)
                                        return service;
                                }
                            }
                        };

                    }
                    Overlap.prototype.domConfig = function () {
                        this.$main = this.$main.find('>.panel');
                        this.$toolbar = this.$main.find('>.panel-heading>div:first');
                        this.$btnClean = this.$toolbar.find('#btnClean');
                        this.$btnShare = this.$main.find('#btnShare');
                        this.$map = this.$main.find('#map');
                        this.$divServices = this.$main.find('#divServices');
                    };
                    Overlap.prototype.buttonConfig = function () {
                        var thiss = this;
                        thiss.$btnClean.off("click");
                        thiss.$btnClean.on("click", function () {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.cleanControls();
                        });
                        thiss.$btnShare.off("click");
                        thiss.$btnShare.on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            thiss.shareData();
                        });
                    };
                    Overlap.prototype.viewConfig = function () {
                        var thiss = this;
                        //this.$map.css("overflow", "auto").css("position", "relative");
                        thiss.$divServices.find('>button').off("click");
                        thiss.$divServices.find('>button').on("click", function (e) {
                            window.plugins.deviceFeedback.acoustic();
                        });
                    };
                    Overlap.prototype.uiConfig = function () {
                        var thiss = this;
                        var heightHeader = this.$main.find('>.panel-heading').outerHeight(true) || 0;
                        var heightFooter = this.$main.find('>.panel-footer').outerHeight(true) || 0;
                        var height = thiss._heightWindow - (2 + thiss._heightHeader + thiss._heightFooter + heightHeader + heightFooter);
                        thiss.viewer.load(this.$main, { heightMap: height });
                        thiss.config.module.services.forEach(function (service) {
                            if (service.disabled !== true) {
                                thiss.$divServices.find('>ul').append('<li class="dropdown-header">' + service.name + '</li> ');
                                service.services.forEach(function (service2) {
                                    if (service2.disabled !== true) {
                                        thiss.$divServices.find('ul').append('<li id="' + service2.UUID + '"><a><span class="checkbox"><input type="checkbox" /><label>' + service2.name + '</label></span></a></li>');
                                    }
                                });
                            }
                        });
                        thiss.$divServices.find('ul').css({
                            "height": "auto",
                            "max-height": height,
                            "overflow-x": "hidden"
                        });
                        thiss.$divServices.find('ul>li>a input:checkbox').on('change', function (e) {
                            window.plugins.deviceFeedback.acoustic();
                            var services = [];
                            var service = null;
                            jQuery(this).closest('ul').find('input:checkbox').toArray().forEach(function (chk) {
                                if (jQuery(chk).is(":checked") === true) {
                                    var $li = jQuery(chk).closest('li');
                                    if ($li !== undefined && $li !== null && String.isNullOrWhiteSpace($li.attr('id')) === false) {
                                        service = thiss.getService($li.attr('id'));
                                        if (service !== null)
                                            services.push(service);
                                    }
                                }
                            });
                            thiss.viewer.services = services;
                        });
                    };
                    Overlap.prototype.initConfig = function () {
                        var thiss = this;
                        _super.prototype.initConfig.call(this);
                        thiss.setServices();
                    };
                    Overlap.prototype.setModule = function (jsonFile) {
                        var thiss = this;
                        var options = {};
                        options.spatialJSFile = thiss.js.module.subModule.path + this.apigeo + "overlapmap";
                        _super.prototype.setModule.call(this, jsonFile, options);
                    };
                    Overlap.prototype.load = function () {
                        _super.prototype.load.call(this, "overlap", { module: "miningconcession", subModule: 'miningconcession' });
                    };
                    Overlap.prototype.cleanControls = function () {
                        this.viewer.cleanControls(false);
                    };
                    Overlap.execute = function () {
                        var client = new Overlap();
                        client.load();
                    };
                    return Overlap;
                })(jtm.geometry.BaseGeometry);
                miningconcession.Overlap = Overlap;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.Overlap.execute();