if (typeof Date.prototype.customFormat != "function")
    Date.prototype.customFormat = function (formatString) {
        var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, dMod, th;
        YY = ((YYYY = this.getFullYear()) + "").substr(2, 2);
        MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
        MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substr(0, 3);
        DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
        DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substr(0, 3);
        th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
        formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

        h = (hhh = this.getHours());
        if (h === 0) h = 24;
        if (h > 12) h -= 12;
        hh = h < 10 ? ('0' + h) : h;
        ampm = hhh < 12 ? 'am' : 'pm';
        mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
        ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
        return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm);
    };
//var now = new Date();
//alert("Today is " + now.customFormat('#DDDD#, #MMMM# #D##th#') + "\nThe time is " + now.customFormat('#h#:#mm##ampm#') + ".");
if (typeof Date.prototype.to12HourTimeString != "function")
    Date.prototype.to12HourTimeString = function () {
        var h = this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();

        var ap = "am";

        if (h >= 12) {
            ap = "pm";

            if (h >= 13)
                h -= 12;
        } else if (h === 0)
            h = 12;

        h = "0" + h;
        return h.slice(-2) + ":" +
          m.slice(-2) + ":" +
          s.slice(-2) + " " + ap;
    };
if (typeof Date.prototype.to24HourTimeString != "function")
    Date.prototype.to24HourTimeString = function () {
        var h = "0" + this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2);
    };
if (typeof Date.prototype.lastday != "function")
    Date.prototype.lastday = function () {
        var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    }; Date.DAYNAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (typeof Date.now != "function")
    Date.now = function (format) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            var month = '0' + month;
        }
        if (day.toString().length == 1) {
            var day = '0' + day;
        }
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    };
Date.MONTHNAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Date.msPERDAY = 1000 * 60 * 60 * 24;

Date.prototype.DAYNAMES = Date.DAYNAMES;

Date.prototype.MONTHNAMES = Date.MONTHNAMES;

Date.prototype.msPERDAY = Date.msPERDAY;
if (typeof Date.prototype.copy != "function")
    Date.prototype.copy = function () {
        return new Date(this.getTime());
    };
if (typeof Date.prototype.getFullDay != "function")
    Date.prototype.getFullDay = function () {
        return this.DAYNAMES[this.getDay()];
    };
if (typeof Date.prototype.getDayAbbr != "function")
    Date.prototype.getDayAbbr = function () {
        return this.getFullDay().slice(0, 3);
    };
if (typeof Date.prototype.getFullMonth != "function")
    Date.prototype.getFullMonth = function () {
        return this.MONTHNAMES[this.getMonth()];
    };
if (typeof Date.prototype.getMonthAbbr != "function")
    Date.prototype.getMonthAbbr = function () {
        return this.getFullMonth().slice(0, 3);
    };
if (typeof Date.prototype.to12HourTimeString != "function")
    Date.prototype.to12HourTimeString = function () {
        var h = this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        var ap = "am";
        if (h >= 12) {
            ap = "pm";
            if (h >= 13)
                h -= 12;
        } else if (h === 0) {
            h = 12;
        }
        h = "0" + h;
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2) + " " + ap;
    };
if (typeof Date.prototype.to24HourTimeString != "function")
    Date.prototype.to24HourTimeString = function () {
        var h = "0" + this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2);
    };
if (typeof Date.prototype.lastday != "function")
    Date.prototype.lastday = function () {
        var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    };
if (typeof Date.prototype.getDaysBetween != "function")
    Date.prototype.getDaysBetween = function (d) {
        var tmp = d.copy();
        tmp.setHours(this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
        var diff = tmp.getTime() - this.getTime();
        return diff / this.msPERDAY;
    };
if (typeof Date.prototype.getDayOfYear != "function")
    Date.prototype.getDayOfYear = function () {
        var start = new Date(this.getFullYear(), 0, 0);
        return this.getDaysBetween(start) * -1;
    };
if (typeof Date.prototype.addDays != "function")
    Date.prototype.addDays = function (d) {
        this.setDate(this.getDate() + d);
    };
if (typeof Date.prototype.addWeeks != "function")
    Date.prototype.addWeeks = function (w) {
        this.addDays(w * 7);
    };
if (typeof Date.prototype.addMonths != "function")
    Date.prototype.addMonths = function (m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() + m);
        if (this.getDate() < d)
            this.setDate(0);
    };
if (typeof Date.prototype.addYears != "function")
    Date.prototype.addYears = function (y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() + y);
        if (m < this.getMonth()) {
            this.setDate(0);
        }
    };
if (typeof Date.prototype.addWeekDays != "function")
    Date.prototype.addWeekDays = function (d) {
        var startDay = this.getDay();  //current weekday 0 thru 6
        var wkEnds = 0;                //# of weekends needed
        var partialWeek = d % 5;       //# of weekdays for partial week
        if (d < 0) {                 //subtracting weekdays
            wkEnds = Math.ceil(d / 5); //negative number weekends
            switch (startDay) {
                case 6:                  //start Sat. 1 less weekend
                    if (partialWeek === 0 && wkEnds < 0)
                        wkEnds++;
                    break;
                case 0:                   //starting day is Sunday
                    if (partialWeek === 0)
                        d++;              //decrease days to add
                    else
                        d--;              //increase days to add
                    break;
                default:
                    if (partialWeek <= -startDay)
                        wkEnds--;
            }
        } else if (d > 0) {            //adding weekdays
            wkEnds = Math.floor(d / 5);
            var w = wkEnds;
            switch (startDay) {
                case 6:
                    /* If staring day is Sat. and
                     * no partial week one less day needed
                     * if partial week one more day needed
                     */
                    if (partialWeek === 0)
                        d--;
                    else
                        d++;
                    break;
                case 0:        //Sunday
                    if (partialWeek === 0 && wkEnds > 0)
                        wkEnds--;
                    break;
                default:
                    if (5 - day < partialWeek)
                        wkEnds++;
            }
        }
        d += wkEnds * 2;
        this.addDays(d);
    };
if (typeof Date.prototype.getWeekDays != "function")
    Date.prototype.getWeekDays = function (d) {
        var wkEnds = 0;
        var days = Math.abs(this.getDaysBetween(d));
        var startDay = 0, endDay = 0;
        if (days) {
            if (d < this) {
                startDay = d.getDay();
                endDay = this.getDay();
            } else {
                startDay = this.getDay();
                endDay = d.getDay();
            }
            wkEnds = Math.floor(days / 7);
            if (startDay != 6 && startDay > endDay)
                wkEnds++;
            if (startDay != endDay && (startDay == 6 || endDay == 6))
                days--;
            days -= (wkEnds * 2);
        }
        return days;
    };
if (typeof Date.prototype.getMonthsBetween != "function")
    Date.prototype.getMonthsBetween = function (d) {
        var sDate, eDate;
        var d1 = this.getFullYear() * 12 + this.getMonth();
        var d2 = d.getFullYear() * 12 + d.getMonth();
        var sign;
        var months = 0;
        if (this == d) {
            months = 0;
        } else if (d1 == d2) { //same year and month
            months = (d.getDate() - this.getDate()) / this.lastday();
        } else {
            if (d1 < d2) {
                sDate = this;
                eDate = d;
                sign = 1;
            } else {
                sDate = d;
                eDate = this;
                sign = -1;
            }
            var sAdj = sDate.lastday() - sDate.getDate();
            var eAdj = eDate.getDate();
            var adj = (sAdj + eAdj) / sDate.lastday() - 1;
            months = Math.abs(d2 - d1) + adj;
            months = (months * sign);
        }
        return months;
    };
if (typeof Date.prototype.getYearsBetween != "function")
    Date.prototype.getYearsBetween = function (d) {
        var months = this.getMonthsBetween(d);
        return months / 12;
    };
if (typeof Date.prototype.getAge != "function")
    Date.prototype.getAge = function () {
        var today = new Date();
        return this.getYearsBetween(today).toFixed(2);
    };
if (typeof Date.prototype.sameDayEachWeek != "function")
    Date.prototype.sameDayEachWeek = function (day, date) {
        var aDays = [];
        var eDate, nextDate, adj;
        if (this > date) {
            eDate = this;
            nextDate = date.copy();
        } else {
            eDate = date;
            nextDate = this.copy();
        }
        adj = (day - nextDate.getDay() + 7) % 7;
        nextDate.setDate(nextDate.getDate() + adj);
        while (nextDate < eDate) {
            aDays[aDays.length] = nextDate.copy();
            nextDate.setDate(nextDate.getDate() + 7);
        }
        return aDays;
    };
if (typeof Date.prototype.toDate != "function")
    Date.toDate = function (d) {
        var newDate;
        if (arguments.length === 0) {
            newDate = new Date();
        } else if (d instanceof Date) {
            newDate = new Date(d.getTime());
        } else if (typeof d == "string") {
            newDate = new Date(d);
        } else if (arguments.length >= 3) {
            var dte = [0, 0, 0, 0, 0, 0];
            for (var i = 0; i < arguments.length && i < 7; i++) {
                dte[i] = arguments[i];
            }
            newDate = new Date(dte[0], dte[1], dte[2], dte[3], dte[4], dte[5]);
        } else if (typeof d == "number") {
            newDate = new Date(d);
        } else {
            newDate = null;
        }
        if (newDate == "Invalid Date")
            return null;
        else
            return newDate;
    };