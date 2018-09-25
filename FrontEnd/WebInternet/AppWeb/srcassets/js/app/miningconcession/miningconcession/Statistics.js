(function (com) {
    (function (jtm) {
        (function (miningconcession) {
            (function (miningconcession) {
                var Statistics = (function (_super) {
                    __extends(Statistics, _super);
                    function Statistics() {
                        _super.call(this);
                        this.$divChart = null;
                        this.searchStaticstis = function () {
                            var thiss = this;
                            var item = {
                                nameGroup: $('#ddlNamesGroup').val(),
                                typeGroup: $("input:radio[name=rdbGroup]:checked").val()
                            };
                            var options = {
                                data: { item: item },
                                validate: true
                            };
                            thiss.searchConfig(com.jtm.Server.contextPath + 'miningconcession/miningconcession/generategraphic', options, function (item) {
                                if (item !== null)
                                    getHighcharts(item);
                                else
                                    thiss.$divChart.html('<tbody><tr><td>No se encontraron resultados</td></tr></tbody>');
                            });
                            function getHighcharts(item) {
                                var series = [];
                                var years = [];
                                var names = [];
                                years = item.years;
                                series = item.series;
                                names = item.names;
                                var title = item.title;
                                var subtitle = item.subTitle;
                                var valueText = item.valueText;
                                var min = item.min;
                                var max = item.max;
                                var chartType = "column";
                                var item2 = configItem(chartType, title, subtitle, names, series, min, max, valueText, false);
                                thiss.$divChart.highcharts(item2);
                            }
                            function configItem(chartType, title, subtitle, categories, series, min, max, valueText, enabled3d) {
                                chartType = (chartType === undefined || chartType === null) ? "column" : chartType;
                                var item = {
                                    chart: {
                                        type: chartType,
                                        options3d: {
                                            enabled: enabled3d,
                                            alpha: 15,
                                            beta: 15,
                                            depth: 50,
                                            viewDistance: 40
                                        }
                                    },
                                    credits: { enabled: false },
                                    exporting: { enabled: true },
                                    title: {
                                        text: title
                                    },
                                    subtitle: {
                                        text: subtitle
                                    },
                                    xAxis: {
                                        categories: categories,
                                        crosshair: true
                                    },
                                    yAxis: {
                                        min: min,
                                        max: max,
                                        title: {
                                            text: valueText
                                        }
                                    },
                                    tooltip: {
                                        //headerFormat: '<span style="font-size:10px">{point.key}</span>',
                                        //pointFormat: '<div>{series.name}:' +
                                        //    '<b>{point.y:.1f} ' + measureUnit + '</b></div>',
                                        //footerFormat: '',
                                        //shared: true,
                                        //useHTML: true
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        }
                                    },
                                    series: series
                                };
                                return item;
                            }
                        };
                    }
                    Statistics.prototype.domConfig = function () {
                        var thiss = this;
                        _super.prototype.domConfig.call(this);
                        thiss.$divChart = thiss.$main.find('#divChart');
                    };
                    Statistics.prototype.uiConfig = function () {
                        //  this.searchStaticstis();
                    };
                    Statistics.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        $('#btnSearch').off("click");
                        $('#btnSearch').on("click", function (e) {
                            if ($('#ddlNamesGroup').int32() === 0) {
                                console.log($('#ddlNamesGroup').int32());
                                alert('Seleccione tipo de filtro');
                            } else {
                                thiss.searchStaticstis();
                            }
                        });
                    };
                    Statistics.execute = function () {
                        var client = new Statistics();
                        client.load();
                    };
                    return Statistics;
                })(jtm.geometry.BaseGeometry);
                miningconcession.Statistics = Statistics;
            })(miningconcession.miningconcession || (miningconcession.miningconcession = {}));
            var miningconcession = miningconcession.miningconcession;
        })(jtm.miningconcession || (jtm.miningconcession = {}));
        var miningconcession = jtm.miningconcession;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.miningconcession.miningconcession.Statistics.execute();