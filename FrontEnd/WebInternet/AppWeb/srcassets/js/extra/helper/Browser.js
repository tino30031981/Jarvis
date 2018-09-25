var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Browser = function () {
};
com.jtm.helper.Browser.isModernBrowser = (!document.all || (document.all && document.addEventListener));
com.jtm.helper.Browser.isIE = (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent));
com.jtm.helper.Browser.mimeTypeSupport = function (type) {
    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
            return supported || mime.type == type;
        }, supported);
    }, false);
};
com.jtm.helper.Browser.getIEVersion = function () {
    var rv = -1;
    var ua = navigator.userAgent;
    var re = null;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) !== null)
            rv = parseFloat(RegExp.$1);
    }
    else if (navigator.appName == 'Netscape') {
        re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) !== null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
};
com.jtm.helper.Browser.getIEVersion2 = function () {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    // If IE, return version number.
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));

        // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;

    else
        return 0; //It is not IE
};
com.jtm.helper.Browser.getBrowser = function () {
    var navigatorObj = navigator.appName,
        userAgentObj = navigator.userAgent,
        matchVersion;
    var match = userAgentObj.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (match && (matchVersion = userAgentObj.match(/version\/([\.\d]+)/i)) !== null) match[2] = matchVersion[1];
    //mobile
    if (navigator.userAgent.match(/iPhone|Android|webOS|iPad/i)) {
        return match ? [match[1], match[2], mobile] : [navigatorObj, navigator.appVersion, mobile];
    }
    // web browser
    return match ? [match[1], match[2]] : [navigatorObj, navigator.appVersion, '-?'];
};