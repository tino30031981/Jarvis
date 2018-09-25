var com = com || {};
com.jtm = com.jtm || {};

com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Request = function () { };
com.jtm.helper.Request = {
    queryString: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var value = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]*)(\&?)", "i"));
        return value ? value[1] : value;
    },
    queryString2: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        return (decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null);
    },
    queryString3: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    queryStringFromUrl: function (url, name) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results === null ? null : results[1];
    }
};