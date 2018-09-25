(function (com) {
    (function (jtm) {
        (function (environment) {
            (function (agreement) {
                var Calendar = (function (_super) {
                    __extends(Calendar, _super);
                    function Calendar() {
                        _super.call(this);
                        this.prefix = "cal";
                        this.calendar = null;
                        this.data = null;
                        this.date = null;
                        this.dateTitle = null;
                        this.$container = null;
                        this.$calendar = null;
                        this.$btnReport = null;
                        this.$calSlideContent = null;
                        this.searchOptions = function (typeView, currentDay) {
                            var thiss = this;
                            typeView = (typeView === undefined || typeView === null) === true ? 'month' : typeView;
                            currentDay = (currentDay === undefined || currentDay === null) === true ? thiss.date : currentDay;
                            var options = {
                                events_source: thiss.data,
                                view: typeView,
                                tmpl_path: com.jtm.Server.contextPath + 'assets/js/app/environment/agreement/tmpls/',
                                tmpl_cache: false,
                                day: currentDay,
                                first_day: 2,
                                language: "es-ES",
                                modal: function () {
                                    $eventsList = thiss.$main.find(".events-list");
                                    $calWeekBox = thiss.$main.find(".cal-week-box");
                                    $calDayBox = thiss.$main.find("#cal-day-box");
                                    $calSlideContent = thiss.$main.find('#cal-slide-content');
                                    $calDayBox.find(".cal-day-hour>.span11>.day-highlight>a").off("click");
                                    $calDayBox.find("#cal-day-panel>.day-highlight>a").off("click");
                                    $calWeekBox.find(".cal-row-fluid>.day-highlight>a").off("click");
                                    $eventsList.find('a').off("click");                                   
                                    $calSlideContent.find('>ul>li>a').off("click");
                                    $calSlideContent.find('>ul>li>a').on("click", function (e) {
                                        e.preventDefault();
                                        thiss.formDetail($(this).attr("data-event-id"));
                                    });
                                },
                                //modal_type: "iframe",
                                //modal_title: 'Detalle',
                                onAfterViewLoad: function (view) {
                                    thiss.$title.text(this.getTitle());
                                    $('.btn-group button').removeClass('active');
                                    $('button[data-calendar-view="' + view + '"]').addClass('active');
                                }
                            };
                            thiss.calendar = thiss.$calendar.calendar(options);
                            thiss.calendar.view();
                        };
                        this.searchDate = function (date) {
                            var thiss = this;
                            thiss.searchConfig(com.jtm.Server.contextPath + 'environment/agreement/searchdate',
                                {
                                    data: { date: date, },
                                    isJson: false,
                                    async: false
                                }, function (items) {
                                    thiss.fillDates(items);
                                });
                        };
                        this.fillDates = function (items) {
                            var thiss = this;
                            var event = ['event-important', 'event-warning', 'event-info', 'event-inverse', 'event-success', 'event-special']
                            var rand = null;
                            thiss.data = [];
                            items.forEach(function (item) {
                                rand = event[Math.floor(Math.random() * event.length)];
                                thiss.data.push({
                                    "id": item.id,
                                    "title": item.name + '( ' + item.legalFrame.name + ' )',
                                    //"url": '#',
                                    "class": rand,
                                    "start": new Date(item.startDate).getTime(),
                                    "end": new Date(item.endDate).getTime()
                                });
                            });
                        };
                        this.downloadReport = function () {
                            var thiss = this;
                            var month = null;
                            var year = null;                            
                            month = thiss.$title.text();
                            year = month.substring(month.length, month.length - 4);
                            switch (month.substring(month.length - 5, 0)) {
                                case "Enero": month = 0; break;
                                case "Febrero": month = 1; break;
                                case "Marzo": month = 2; break;
                                case "Abril": month = 3; break;
                                case "Mayo": month = 4; break;
                                case "Junio": month = 5; break;
                                case "Julio": month = 6; break;
                                case "Agosto": month = 7; break;
                                case "Septiembre": month = 8; break;
                                case "Octubre": month = 9; break;
                                case "Noviembre": month = 10; break;
                                case "Diciembre": month = 11; break;
                            };
                            thiss.dateTitle = new Date(year, month, 1).toJSON().slice(0, 10);
                            console.log(thiss.dateTitle);
                            html2canvas(thiss.$container, {
                                useCORS: true,
                                allowTaint: false,
                                height: 708,    //Largo
                                width: 655,     //Ancho
                                onrendered: function (canvas) {
                                    var item = { image: canvas.toDataURL("image/png"), date: thiss.dateTitle };
                                    var url = com.jtm.Server.contextPath + 'environment/agreement/downloadreport';
                                    var options = { data: item };
                                    thiss.downloadConfig(url, "PDF", options, null);
                                }
                            });
                        };
                        this.formDetail = function (id) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Detalle",
                                width: '1050',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, com.jtm.Server.contextPath + "environment/agreement/formcalendardetail", function () {
                                thiss.detailConfig(com.jtm.Server.contextPath + 'environment/agreement/detail', {
                                    data: { id: id }
                                }, function (data) {
                                    var item = data.item;
                                    jQuery('#hdnId').val(item.id);
                                    jQuery('#txtName').val(item.name);
                                    jQuery('#txtStartDate').val(item.startDate);
                                    jQuery('#txtEndDate').val(item.endDate);
                                    jQuery('#txtLegalFrame').val(item.legalFrame.name);
                                    jQuery('#txtAgreementType').val(item.agreementType.name);
                                    jQuery('#txtAgreementOrigin').val(item.agreementOrigin.name);
                                    jQuery('#txtPeriodTypeReport').val(item.periodTypeReport.name);
                                    jQuery('#txtPeriodTypeFrequency').val(item.periodTypeFrequency.name);
                                    jQuery('#txaReportDescription').val(item.reportDescription);
                                    jQuery('#txtEmployee').val(item.employee.name);
                                });
                            });
                        };
                    }
                    Calendar.CONTAINER = "#container";
                    Calendar.CALENDAR = "#calendar";
                    Calendar.TITLE = "#title";
                    Calendar.BTNREPORT = "#btnReport";
                    Calendar.DIVPOPUP = '#divPopup';
                    Calendar.prototype.domConfig = function () {
                        var thiss = this;
                        thiss.$container = this.$main.find(Calendar.CONTAINER);
                        thiss.$calendar = this.$main.find(Calendar.CALENDAR);
                        thiss.$title = this.$main.find(Calendar.TITLE);
                        thiss.$btnReport = this.$main.find(Calendar.BTNREPORT);
                        thiss.$divPopup = this.$main.find(Calendar.DIVPOPUP);
                    };
                    Calendar.prototype.initConfig = function () {
                        var thiss = this;
                        thiss.date = new Date().toJSON().slice(0, 10);
                    };
                    Calendar.prototype.viewConfig = function () {
                        var thiss = this;
                        _super.prototype.viewConfig.call(this);
                        var date = new Date();
                        thiss.searchDate(thiss.date);
                        thiss.searchOptions();
                        $('.btn-group button[data-calendar-nav]').each(function () {
                            var $this = $(this);
                            $this.click(function () {
                                thiss.calendar.navigate($this.data('calendar-nav'));
                                if ($('.btn-group button[data-calendar-view="year"]').hasClass('active') === true) {
                                    if ($this.data('calendar-nav') === "prev") {
                                        date.setYear(date.getFullYear() - 1);
                                    } else if ($this.data('calendar-nav') === "next") {
                                        date.setYear(date.getFullYear() + 1);
                                    } else if ($this.data('calendar-nav') === "today") {
                                        date = new Date();
                                    }
                                    thiss.searchDate(date.toJSON().slice(0, 10));
                                    thiss.searchOptions('year', date.toJSON().slice(0, 10));
                                } else
                                    return;
                            });
                        });
                        $('.btn-group button[data-calendar-view]').each(function () {
                            var $this = $(this);
                            $this.click(function () {
                                thiss.calendar.view($this.data('calendar-view'));
                            });
                        });
                    };
                    Calendar.prototype.uiConfig = function () {
                        var thiss = this;
                    };
                    Calendar.prototype.buttonConfig = function (options) {
                        var thiss = this;
                        thiss.$btnReport.off("click");
                        thiss.$btnReport.on("click", function (e) {
                            thiss.downloadReport();
                        });
                    };
                    Calendar.execute = function () {
                        var client = new Calendar();
                        client.load();
                    };
                    return Calendar;
                })(jtm.Master);
                agreement.Calendar = Calendar;
            })(environment.agreement || (environment.agreement = {}));
            var agreement = environment.agreement;
        })(jtm.environment || (jtm.environment = {}));
        var environment = jtm.environment;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));
com.jtm.environment.agreement.Calendar.execute();