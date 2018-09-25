(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (viewer) {
                (function (widgets) {
                    (function (custom) {
                        (function (environment) {
                            (function (station) {
                                var BaseWidget = (function (_super) {
                                    __extends(BaseWidget, _super);
                                    function BaseWidget() {
                                        _super.call(this);
                                        this.$ddlLegalFrame = null;
                                        this.$ddlAgreement = null;
                                        this.$ddlParameter = null;
                                        this.$ddlActivity = null;
                                        this.$ddlChartType = null;
                                        this.$divChart = null;
                                        this.chart = null;
                                        this._getGroups = function (items) {                                            
                                            var items2 = [];
                                            var items3 = [];
                                            items.forEach(function (item) {
                                                if (items3.indexOf(item.attributes['stationcode']) === -1) {
                                                    items3.push(item.attributes['stationcode']);
                                                    items2.push(item.attributes);
                                                }
                                            });
                                            return items2;
                                        };
                                        this._getCategories = function (items) {
                                            var categories = [];
                                            if (items !== null && items.length > 0) {
                                                items[0].stations.forEach(function (item) {                                                    
                                                    categories.push(item.activityname + ' (' + item.activitystartdate + ')');
                                                });
                                            }
                                            return categories;
                                        };
                                        this._getSeries = function (items, items2) {
                                            var thiss = this;
                                            var data = null;
                                            var name = null;
                                            var series = [];
                                            items.forEach(function (item) {
                                                data = [];
                                                name = '';
                                                item.stations = searchStation(items2, item.stationcode);
                                                item.stations.forEach(function (item) {
                                                    data.push(item.value);
                                                });
                                                name = item.stationcode;
                                                series.push({ name: name, data: data, color: thiss.getColor(item.stationcode) });
                                            });
                                            series.push({
                                                name: 'Lim Máx.',
                                                color: '#FF9500',
                                                dashStyle: 'shortdash',
                                                lineWidth: 2,
                                                showInLegend: false,
                                                data: [[0, items[0].maximumvalue], { x: items[0].stations.length - 1, y: items[0].maximumvalue, dataLabels: { enabled: true } }]
                                            });
                                            series.push({
                                                name: 'Lim Mín.',
                                                color: '#FFEB00',
                                                dashStyle: 'shortdash',
                                                lineWidth: 2,
                                                showInLegend: false,
                                                data: [[0, items[0].minimumvalue], { x: items[0].stations.length - 1, y: items[0].minimumvalue, dataLabels: { enabled: true } }]
                                            });                                       
                                            return series;
                                            function searchStation(items, stationCode) {
                                                var itemsStation = [];
                                                items.forEach(function (item2) {
                                                    if (item2.attributes['stationcode'] === stationCode)
                                                        itemsStation.push(item2.attributes);
                                                });
                                                return itemsStation;
                                            }
                                        };
                                        this.updateChart = function () {
                                            var thiss = this;
                                            if (thiss.chart === null) return;
                                            if (thiss.$ddlParameter.int32() === 0) {
                                                alert('Seleccione un parámetro');
                                                return;
                                            }
                                            if (thiss.$ddlLegalStandard.int32() === 0) {
                                                alert('Seleccione una norma legal');
                                                return;
                                            }
                                            thiss.detailConfig(com.jtm.Server.contextPath + 'environment/parameter/searchminimumandmaximum', {
                                                data: { id: thiss.$ddlParameter.int32(), legalStandardId: thiss.$ddlLegalStandard.int32() }, isJson: false
                                            }, function (data) {
                                                if (data === null) return;
                                                var positionX = 0;
                                                if (thiss.chart.series.length) {
                                                    positionX = thiss.chart.series[0].xIncrement;
                                                    thiss.chart.series[thiss.chart.series.length - 1].remove();
                                                    thiss.chart.series[thiss.chart.series.length - 1].remove();
                                                }
                                                thiss.chart.addSeries({
                                                    name: 'Lim Máx.',
                                                    color: '#FF9500',
                                                    dashStyle: 'shortdash',
                                                    lineWidth: 2,
                                                    showInLegend: false,
                                                    data: [[0, data.item.maximumValue], { x: positionX - 1, y: data.item.maximumValue, dataLabels: { enabled: true } }]
                                                });
                                                thiss.chart.addSeries({
                                                    name: 'Lim Mín.',
                                                    color: '#FFEB00',
                                                    dashStyle: 'shortdash',
                                                    lineWidth: 2,
                                                    showInLegend: false,
                                                    data: [[0, data.item.minimumValue], { x: positionX - 1, y: data.item.minimumValue, dataLabels: { enabled: true } }]
                                                });
                                                //thiss._addSeriesMinAndMax(thiss.chart.series, positionX - 1, data.item.maximumValue, data.item.minimumValue);                                                
                                            });
                                        };
                                        this.buildChart = function (items) {
                                            var thiss = this;
                                            if (items.length === 0) {
                                                toastr.info('No hay datos');
                                                return;
                                            }
                                            thiss.$ddlLegalStandard.val(items[0].attributes["legalstandardid"]);
                                            var items2 = thiss._getGroups(items);
                                            if (items2 == null || items2.length < 0) return;
                                            var series = thiss._getSeries(items2, items);
                                            var categories = thiss._getCategories(items2);
                                            var measureUnit = 'Valores (' + items2[0].measureunitsymbol + ')';
                                            var item = this.buildChartItem(categories, series, measureUnit);
                                            this.$divChart.highcharts(item);
                                            this.chart = this.$divChart.highcharts();
                                            //series.push({
                                            //    // scatter plot line to serve as moveable plot line
                                            //    type: 'scatter',
                                            //    data: [{
                                            //        x: 0, y: items2[0].minimumvalue,
                                            //        marker: {
                                            //            enabled: false						// hide the markers (to show only the line)
                                            //        },
                                            //        dataLabels: {
                                            //            enabled: false
                                            //        }
                                            //    }, {
                                            //        x: categories.length - 1, y: items2[0].minimumvalue,
                                            //        marker: {
                                            //            enabled: true,
                                            //            fillColor: '#248EC6',
                                            //            symbol: 'square',
                                            //            radius: 14
                                            //        },
                                            //        dataLabels: {
                                            //            align: 'center',
                                            //            enabled: true,
                                            //            backgroundColor: '#248EC6',
                                            //            shape: 'diamond',
                                            //            x: 10, y: 14,
                                            //            style: {
                                            //                color: 'white',
                                            //                fontWeight: 'bold',
                                            //                textShadow: 'none'
                                            //            },
                                            //            useHTML: true,
                                            //            formatter: function () {
                                            //                return '<span style="padding-left: 10px;">' + this.y + '</span>';
                                            //            },
                                            //        }
                                            //    }],
                                            //    lineWidth: 2,
                                            //    lineColor: '#248EC6',
                                            //    showFirstLabel: false,
                                            //    showInLegend: false,				// hide in legend
                                            //    enableMouseTracking: false	// prevent user from interacting with this line
                                            //});
                                        };
                                        this.buildChartItem = function (categories, series, measureUnit) {
                                            var item = {
                                                chart: {
                                                    type: 'line'
                                                    //plotBorderWidth: 0,
                                                    //options3d: {
                                                    //    enabled: true,
                                                    //    alpha: 15,
                                                    //    beta: 15,
                                                    //    depth: 50,
                                                    //    viewDistance: 25
                                                    //}
                                                },
                                                credits: { enabled: false },
                                                exporting: { enabled: true },
                                                title: {
                                                    text: this.$ddlLegalFrame.getLabel() + ' - ' + this.$ddlAgreement.getLabel()
                                                },
                                                subtitle: {
                                                    text: 'Parámetro: ' + this.$ddlParameter.getLabel()
                                                },
                                                xAxis: {
                                                    type: 'category',
                                                    categories: categories,
                                                    crosshair: false
                                                },
                                                yAxis: {
                                                    title: {
                                                        margin: 10,
                                                        text: measureUnit
                                                    }
                                                },
                                                legend: {
                                                    enabled: true
                                                },
                                                plotOptions: {
                                                    line: {
                                                        dataLabels: {
                                                            enabled: true
                                                        },
                                                        enableMouseTracking: true
                                                    }
                                                    //,
                                                    //series: {
                                                    //    point: {
                                                    //        events: {
                                                    //            mouseOver: function () {
                                                    //                var chart = this.series.chart;
                                                    //                console.log(chart);
                                                    //                // update both ends of the scatter line
                                                    //                chart.series[chart.series.length - 1].data[0].update([0, this.y]);
                                                    //                chart.series[chart.series.length - 1].data[1].update([11, this.y]);
                                                    //            }
                                                    //        }
                                                    //    }
                                                    //}
                                                },
                                                series: series
                                            };
                                            return item;
                                        };
                                    }
                                    BaseWidget.prototype.onClick = function () {
                                        var thiss = this;
                                        thiss.showView({
                                            dialog: { width: 300 }
                                        });
                                    };
                                    BaseWidget.prototype.initConfig = function () {
                                        _super.prototype.initConfig.call(this);
                                        this.config.module.widget.service.url = this.config.module.widget.service.url.startsWith('http') === false ? com.jtm.Server.contextPath + this.config.module.widget.service.url : this.config.module.widget.service.url;
                                    };
                                    BaseWidget.prototype.launchView = function () {
                                        var thiss = this;
                                        this.$btnSearch = this.$widget.find('#btnSearch');
                                        this.$ddlLegalFrame = this.$widget.find('#ddlLegalFrame');
                                        this.$ddlAgreement = this.$widget.find('#ddlAgreement');
                                        this.$ddlParameter = this.$widget.find('#ddlParameter');
                                        this.$ddlLegalStandard = this.$widget.find('#ddlLegalStandard');
                                        this.$ddlActivity = this.$widget.find('#ddlActivity');
                                        this.$ddlChartType = this.$widget.find("#ddlChartType");
                                        this.$divChart = this.$widget.find("#divChart");
                                        com.jtm.helper.DropDownList.fill({
                                            url: com.jtm.Server.contextPath + "environment/legalframe/list",
                                            ddl: thiss.$ddlLegalFrame
                                        });
                                        com.jtm.helper.DropDownList.fillLocal({
                                            ddl: this.$ddlChartType,
                                            items: this.config.module.widget.chartTypes
                                        });
                                        this.$btnSearch.off("click");
                                        this.$btnSearch.on("click", function (e) {
                                            thiss.search();
                                        });
                                        this.$ddlLegalFrame.off("change");
                                        this.$ddlLegalFrame.on("change", function (e) {
                                            thiss.$ddlAgreement.empty();
                                            thiss.$ddlActivity.empty();
                                            thiss.$ddlParameter.empty();
                                            com.jtm.helper.DropDownList.fill({
                                                url: com.jtm.Server.contextPath + "environment/agreement/searchwithmonitoringbylegalframe",
                                                ddl: thiss.$ddlAgreement,
                                                data: { id: jQuery(this).int32() },
                                                callback: function (id) {
                                                    thiss.$ddlActivity.empty();
                                                    thiss.$ddlParameter.empty();
                                                    thiss.$ddlLegalStandard.empty();
                                                    com.jtm.helper.DropDownList.fill({
                                                        url: com.jtm.Server.contextPath + "environment/agreement/searchparameters",
                                                        ddl: thiss.$ddlParameter,
                                                        data: { id: id },
                                                        callback: function (id) {
                                                            com.jtm.helper.DropDownList.fill({
                                                                url: com.jtm.Server.contextPath + "environment/legalstandard/searchbyagremmentandparameter",
                                                                ddl: thiss.$ddlLegalStandard,
                                                                data: { agreementId: thiss.$ddlAgreement.int32(), parameterId: id },
                                                                async: true
                                                            });
                                                        },
                                                        async: true
                                                    });
                                                    com.jtm.helper.DropDownList.fill({
                                                        url: com.jtm.Server.contextPath + "environment/activity/searchbyagreement",
                                                        ddl: thiss.$ddlActivity,
                                                        data: { id: id },
                                                        async: true
                                                    });
                                                }
                                            });
                                        });
                                        this.$ddlLegalStandard.off("change");
                                        this.$ddlLegalStandard.on("change", function (e) {
                                            thiss.updateChart();
                                        });
                                        //this.$ddlChartType.off("change");
                                        //this.$ddlChartType.on("change", function (e) {
                                        //    if (thiss.chart === null) return;
                                        //    thiss.chart.series[0].update({
                                        //        type: jQuery(this).val()
                                        //    });
                                        //    thiss.chart.redraw();
                                        //});
                                        
                                    };
                                    BaseWidget.prototype.getColor = function (stationCode) {

                                    };
                                    BaseWidget.prototype.validate = function () {
                                        var success = true;
                                        var message = '';
                                        if (this.$ddlAgreement.int32() === 0) {
                                            success = false;
                                            message = 'Seleccione la actividad';
                                            this.$ddlAgreement.focus();
                                        }
                                        if (this.$ddlParameter.int32() === 0) {
                                            success = false;
                                            message = 'Seleccione el parámetro';
                                            this.$ddlParameter.focus();
                                        }
                                        if (message !== '')
                                            toastr.info(message);
                                        return success;
                                    };
                                    BaseWidget.prototype.writeResultDefault = function (data, options) {
                                        _super.prototype.writeResultDefault.call(this, data, options);
                                        this.$table.find('button').remove();
                                    }
                                    BaseWidget.prototype.cleanControls = function (toNull) {
                                        _super.prototype.cleanControls.call(this, toNull);
                                        if (this.chart !== null) {
                                            this.chart.destroy();
                                            this.chart = null;
                                        }

                                    };
                                    return BaseWidget;
                                })(geometry.Widget);
                                station.BaseWidget = BaseWidget;
                            })(environment.station || (environment.station = {}));
                            var station = environment.station;
                        })(custom.environment || (custom.environment = {}));
                        var environment = custom.environment;
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