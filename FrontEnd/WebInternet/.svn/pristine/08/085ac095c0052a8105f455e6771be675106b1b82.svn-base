var com;
(function (com) {
    (function (jtm) {
        (function (helper) {
            var Notification = (function () {
                function Notification() {
                }
                Notification.prototype = {
                };
                Notification.news = function () {
                    jQuery.ajax({
                        type: 'POST',
                        url: com.jtm.Server + "home/notificacion",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        beforeSend: function () {
                            return true;
                        },
                        done: function (data) {
                            var items = data.items;
                            if (data.success === true) {
                                var html = '';
                                jQuery.each(items, function (i, item) {
                                    html += '<li>';
                                    html += '<i class="wi-day-lightning"></i>&#160;&#160;Berlin&#160;';
                                    html += '</li>';
                                    //<li>
                                    //<i class="wi-day-lightning"></i>&#160;&#160;Berlin&#160;
                                    //<b>85</b><i class="wi-fahrenheit"></i>&#160;; 15km/h
                                    //</li>
                                });
                            }
                        },
                        fail: function () { }
                    });
                };
                return Notification;
            })();
            helper.Notification = Notification;
        })(jtm.helper || (jtm.helper = {}));
        var helper = jtm.helper;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));