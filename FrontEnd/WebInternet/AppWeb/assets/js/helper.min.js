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
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Color = function () {
};
// source:
// http://rainbowcoding.com/how-to-create-rainbow-text-in-html-css-javascript/
com.jtm.helper.Color.colorFromHue = function (hue) {
    var h = hue / 60;
    var c = 255;
    var x = (1 - Math.abs(h % 2 - 1)) * 255;
    var color;

    var i = Math.floor(h);
    if (i === 0)
        color = com.jtm.helper.Color.rgbToHex(c, x, 0);
    else if (i == 1)
        color = com.jtm.helper.Color.rgbToHex(x, c, 0);
    else if (i == 2)
        color = com.jtm.helper.Color.rgbToHex(0, c, x);
    else if (i == 3)
        color = com.jtm.helper.Color.rgbToHex(0, x, c);
    else if (i == 4)
        color = com.jtm.helper.Color.rgbToHex(x, 0, c);
    else
        color = com.jtm.helper.Color.rgbToHex(c, 0, x);
    return color;
};

com.jtm.helper.Color.rgbToHex = function (red, green, blue) {
    var h = ((red << 16) | (green << 8) | (blue)).toString(16);
    // add the beginning zeros
    while (h.length < 6)
        h = '0' + h;
    return '#' + h;
}; // end functions from rainbowcoding.com
com.jtm.helper.Color.rgbToHex2 = function (rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
     ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
};
com.jtm.helper.Color.random = function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);
    if (hexR.length == 1)
        hexR = "0" + hexR;
    if (hexG.length == 1)
        hexG = "0" + hexG;
    if (hexB.length == 1)
        hexB = "0" + hexB;
    var color = "#" + hexR + hexG + hexB;
    return color.toUpperCase();
};
com.jtm.helper.Color.picker = function (content, initialColor) {
    jQuery(content).spectrum({
        color: initialColor,
        showPaletteOnly: true,
        showPalette: true,
        hideAfterPaletteSelect: true,
        move: function (color) {
        },
        show: function () {
        },
        beforeShow: function () {
        },
        hide: function () {
        },
        change: function (color) {
            //$("#basic-log2").text("Cambio: " + color.toHexString());
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
            "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"], [
            "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], [
            "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"], [
            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"], [
            "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
            "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
};
com.jtm.helper.Color.picker2 = function (container, initialColor) {
    jQuery(container).spectrum({
        containerClassName: 'colorPicker',
        replacerClassName: 'colorPicker',
        color: initialColor,
        showPaletteOnly: true,
        showPalette: true,
        showAlpha: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        hideAfterPaletteSelect: true,
        allowEmpty: false,
        move: function (color) {
        },
        show: function () {
        },
        beforeShow: function () {
        },
        hide: function () {
        },
        change: function (color) {
            //$("#basic-log2").text("Cambio: " + color.toHexString());
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
            "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"], [
            "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], [
            "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"], [
            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"], [
            "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
            "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
};
var com = com || {};
com.jtm = com.jtm || {};

com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.ColorPicker = function () { }
com.jtm.helper.ColorPicker.color = function (content, initialColor) {
    jQuery(content).spectrum({
        color: initialColor,
        showPaletteOnly: true,
        showPalette: true,
        hideAfterPaletteSelect: true,
        move: function (color) {
        },
        show: function () {
        },
        beforeShow: function () {
        },
        hide: function () {
        },
        change: function (color) {
            //$("#basic-log2").text("Cambio: " + color.toHexString());
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
            "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"], [
            "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], [
            "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"], [
            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"], [
            "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
            "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
};
com.jtm.helper.ColorPicker.set = function (container, initialColor) {
    jQuery(container).spectrum({
        containerClassName: 'colorPicker',
        replacerClassName: 'colorPicker',
        color: initialColor,
        showPaletteOnly: true,
        showPalette: true,
        showAlpha: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        hideAfterPaletteSelect: true,
        allowEmpty: false,
        move: function (color) {
        },
        show: function () {
        },
        beforeShow: function () {
        },
        hide: function () {
        },
        change: function (color) {
            //$("#basic-log2").text("Cambio: " + color.toHexString());
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
            "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"], [
            "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], [
            "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"], [
            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"], [
            "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
            "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
};
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.DateTime = function () { };

var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.DropDownList = function () { };
com.jtm.helper.DropDownList.ID = "id";
com.jtm.helper.DropDownList.NAME = "name";
com.jtm.helper.DropDownList.DDLVALUEDEFAULT = "0";
com.jtm.helper.DropDownList.DDLDISPLAYDEFAULT = "--Seleccione--";
com.jtm.helper.DropDownList.getLastOption = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return { id: 0, name: '' };
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return { id: 0, name: '' };
    }
    return { id: ddl.val(), name: ddl.getLabel() };
};
com.jtm.helper.DropDownList.getLastValue = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return 0;
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return 0;
    }
    return ddl.val();
};
com.jtm.helper.DropDownList.getLastText = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return '';
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return '';
    }
    return ddl.getLabel();
};
com.jtm.helper.DropDownList.getLastValues = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return [0];
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        var items = [];
        jQuery.each(jQuery(ddl).find("option"), function (i, item) {
            if (jQuery(item).val() != com.jtm.helper.DropDownList.DDLVALUEDEFAULT)
                items.push(jQuery(item).val());
        });
        return items;
    }
    return [0];
};
com.jtm.helper.DropDownList.setRecursive = function (container, id, url, isOpen, label, inmediateparent, ddlName, fieldId, fieldName) {
    fieldId = (fieldId === undefined || fieldId === null || fieldId === '') ? "id" : fieldId;
    fieldName = (fieldName === undefined || fieldName === null || fieldName === '') ? "name" : fieldName;
    if (isOpen === true)
        jQuery(container).html('');
    if (id === 0)
        return;
    label = label === null ? ' ' : label;
    var ddl = "ddl" + ((ddlName === undefined || ddlName === null) ? '' : ddlName);
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: { id: (id === null) ? 0 : id },
        dataType: 'json',
        async: false,
        success: function (data) {
            try {
                //Chequear cantidad
                if (data.total > 0) {
                    var nivel = 0;
                    if (jQuery(container + ' select').length > 0) {
                        var ddlLast = jQuery(container + ' select:last');
                        nivel = jQuery(ddlLast).attr("id").replace(ddl, "");
                    }
                    var select = '<select id="' + ddl + (++nivel) + '">';
                    jQuery.each(data.items, function (j, item) {
                        select += '<option value="' + eval('item.' + fieldId) + '">' + eval('item.' + fieldName) + '</option>';
                    });
                    select += "</select>";
                    var div = '<p id="divNivel' + nivel + '"><label>' + label + '</label>' + select + '</p>';
                    removeItems(nivel);
                    if (jQuery(container + " #" + ddl + nivel).length)
                        jQuery(container + " #" + ddl + nivel).html(select);
                    else
                        jQuery(container).append(div);
                    ddlChange(nivel);
                }
            } catch (ex) {
            }
        }
    });
    function ddlChange(nivel) {
        jQuery(container + " #" + ddl + nivel).on("change", function () {
            removeItems(nivel);
            var idd = jQuery(this).val();
            com.jtm.helper.DropDownList.setRecursive(container, idd, url, false, '&nbsp;', (inmediateparent === null ? null : inmediateparent.Padre), ddlName, fieldId, fieldName);
            if (inmediateparent !== undefined && inmediateparent !== null && inmediateparent.Padre !== null && inmediateparent.Padre !== undefined)
                delete inmediateparent.Padre;
            if (jQuery(container + " #" + ddl + nivel).val() === 0) {
                var i = nivel;
                var ddlNivel = jQuery(container + ' #' + ddl + (--i));
                if (ddlNivel.length > 0) {
                }
                removeItems(nivel);
            }
            return;
        });
        if (inmediateparent !== undefined && inmediateparent !== null) {
            jQuery(container + " #" + ddl + nivel).val(eval('inmediateparent.' + fieldId));
            jQuery(container + " #" + ddl + nivel).trigger("change");
        }
    }
    function removeItems(i) {
        var flag = true;
        while (flag === true) {
            ++i;
            if (jQuery(container + " #divNivel" + i).length) {
                jQuery(container + " #divNivel" + i).remove();
                flag = true;
            } else
                flag = false;
        }
    }
};
com.jtm.helper.DropDownList.fill = function (options) {
    options = options || {};
    options.ddl = (typeof options.ddl === "string") ? jQuery(options.ddl) : options.ddl;
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;
    options.async = typeof options.async === 'boolean' ? options.async : false;
    options.ddl.empty();
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: options.url,
        data: options.data,
        async: options.async,
        success: function (data) {
            if (!data.success) return;
            var items = '';
            if (data.items === undefined || data.items.length === 0) return;
            jQuery.each(data.items, function (i, item) {
                items += '<option value="' + eval('item.' + options.fieldId) + '">' + eval('item.' + options.fieldName) + '</option>';
            });
            options.ddl.html(items);
            if (typeof options.callback === "function") {
                options.ddl.off("change");
                options.ddl.on("change", data, function () {
                    if (jQuery(this).int32() !== 0)
                        options.callback(jQuery(this).val());
                });
            }
            options.idSelected = (options.ddl.find("option[value='" + options.idSelected + "']").length > 0) ? options.idSelected : options.ddl.find("option:first").val();
            if (options.idSelected !== undefined && options.idSelected !== null) {
                options.ddl.val(options.idSelected);
                if (options.idSelected > 0)
                    options.ddl.trigger("change");
            }
        }
    });
};
com.jtm.helper.DropDownList.fillLocal = function (options) {
    options = options || {};
    options.ddl = (typeof options.ddl === "string") ? jQuery(options.ddl) : options.ddl;
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;

    if (!(options.items instanceof Array)) { options.ddl.prop("disabled", true); return; }
    var html = "";
    if (options.addDefaultOption === true)
        html += '<option value="' + com.jtm.helper.DropDownList.DDLVALUEDEFAULT + '">' + com.jtm.helper.DropDownList.DDLDISPLAYDEFAULT + '</option>';
    options.items.forEach(function (item) {
        if (typeof item === "object")
            html += '<option value="' + item[options.fieldId] + '">' + item[options.fieldName] + '</option>';
        else
            html += '<option value="' + item + '">' + item + '</option>';
    });
    options.ddl.html(html);
    options.ddl.prop("disabled", false);
    if (options.callback !== undefined && options.callback !== null) {
        options.ddl.off("change");
        options.ddl.on("change", null, options.callback);
    }
    options.idSelected = (options.ddl.find("option[value='" + options.idSelected + "']").length > 0) ? options.idSelected : options.ddl.find("option:first").val();
    if (options.idSelected !== undefined && options.idSelected !== null) {
        jQuery(options.ddl).val(options.idSelected);
        if (options.idSelected != 0)
            jQuery(options.ddl).trigger("change");
    }
};
com.jtm.helper.DropDownList.getItems = function (url) {
    jQuery.post(url, function (data, textStatus) {
        return (data.success === true) ? data.items : [];
    }, "json");
};
com.jtm.helper.DropDownList.fillNew = function (options) {
    options = options || {};
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;
    options.async = typeof options.async === 'boolean' ? options.async : false;
    var items = '';
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: options.url,
        data: options.data,
        async: options.async,
        success: function (data) {
            if (!data.success) return;
            if (data.items === undefined || data.items.length === 0) return;
            items = '<select style="width:100%" class=' + options.className + '>';
            jQuery.each(data.items, function (i, item) {
                items += '<option value="' + item[options.fieldId] + '">' + item[options.fieldName] + '</option>';
            });
            items += '</select>';
        }
    });
    return items;
};
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.File = function () { };
com.jtm.helper.File.maxFilesize = function (url) {
    return 0;
    //jQuery.ajax({
    //    type: "POST",
    //    url: baseUrl + "documento/documento/BuscarTamanioArchivo",
    //    dataType: 'json',
    //    success: function (data) {
    //        alert(data.message, "Documentos");
    //    }
    //});
};
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
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Random = function () {
};
com.jtm.helper.Random.getRandom = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
com.jtm.helper.Random.getUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.RandomColor = function () {
};
// source:
// http://rainbowcoding.com/how-to-create-rainbow-text-in-html-css-javascript/
com.jtm.helper.RandomColor.colorFromHue = function (hue) {
    var h = hue / 60;
    var c = 255;
    var x = (1 - Math.abs(h % 2 - 1)) * 255;
    var color;

    var i = Math.floor(h);
    if (i == 0)
        color = com.jtm.helper.RandomColor.rgbToHex(c, x, 0);
    else if (i == 1)
        color = com.jtm.helper.RandomColor.rgbToHex(x, c, 0);
    else if (i == 2)
        color = com.jtm.helper.RandomColor.rgbToHex(0, c, x);
    else if (i == 3)
        color = com.jtm.helper.RandomColor.rgbToHex(0, x, c);
    else if (i == 4)
        color = com.jtm.helper.RandomColor.rgbToHex(x, 0, c);
    else
        color = com.jtm.helper.RandomColor.rgbToHex(c, 0, x);
    return color;
};

com.jtm.helper.RandomColor.rgbToHex = function (red, green, blue) {
    var h = ((red << 16) | (green << 8) | (blue)).toString(16);
    // add the beginning zeros
    while (h.length < 6)
        h = '0' + h;
    return '#' + h;
}; // end functions from rainbowcoding.com
com.jtm.helper.RandomColor.random = function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);
    if (hexR.length == 1)
        hexR = "0" + hexR;
    if (hexG.length == 1)
        hexG = "0" + hexG;
    if (hexB.length == 1)
        hexB = "0" + hexB;
    var color = "#" + hexR + hexG + hexB;
    return color.toUpperCase();
};
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
var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Table = function () {
};
com.jtm.helper.Table.existHiddenField = function (obj, nombre, id) {
    //            var $d = jQuery(obj).parent();
    //            var col = $d.parent().children().index($d);
    //            var row = $d.parent().parent().children().index($d.parent());
    return jQuery(obj).closest('table').find('#hdn' + nombre + id).length;
};
com.jtm.helper.Table.getHiddenField = function (nombre, id) {
    return '<input type="hidden" id="hdn' + nombre + id + '" nombre="hdn' + nombre + id + '"  value="' + id + '" />';
};
///<summary>
///Método estático que permite validar los valores nulos de una columna
///</summary>
///<remarks>
///This is a test.
///</remarks>
///<parame>
///This is a test.
///</paraam>
///<returns>
///This is a test.
///</returns>
//
com.jtm.helper.Table.validateNullValues = function (celdas, index, mensaje, faltaSeleccionar) {
    for (var i = index; i < celdas.length; i++) {
        var hdn = jQuery(celdas[i]).find('input[type=hidden]');
        if (hdn.length <= 0) {
            alert(faltaSeleccionar, "Dato");
            return false;
        }
    }
    return true;
};
//Método de instancia que permite agregar un nuevo elemento
com.jtm.helper.Table.prototype.addElement = function (obj, url, data, ddl, nombreCampoOculto, divPopup, esUnico, nombreCampoMensaje) {
    var thisObj = this;
    jQuery.ajax({
        url: url,
        async: false,
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.success === false) {
                alert(data.message, "Dato");
                return;
            }
            var items = data.items;
            var html = '';
            for (var j = 0; j < items.length; j++) {
                html += '<option value=' + items[j].id + '>' + items[j].name + '</option>';
            }
            jQuery(ddl).html(html);
            var itemId = jQuery(obj).parent().find("input[type=hidden]").val();
            if (itemId !== undefined && itemId !== null) {
                jQuery(ddl).val(itemId);
            }
            jQuery(ddl).unbind();
            jQuery(ddl).change(function () {
                if (jQuery(this).val() > 0) {
                    jQuery(obj).parent().find("input[type=hidden]").remove();
                    if (esUnico === true) {
                        var existe = com.jtm.helper.Table.existHiddenField(obj, nombreCampoOculto, jQuery(this).val());
                        if (existe > 0) {
                            alert("Ya existe " + nombreCampoMensaje + ", por favor seleccione otro", "Dato");
                            return;
                        }
                    }
                    jQuery(obj).parent().append(com.jtm.helper.Table.getHiddenField(nombreCampoOculto, jQuery(this).val()));
                    jQuery(obj).parent().find("span").html(jQuery("option:selected", jQuery(this)).text());
                    jQuery(obj).parent().removeClass("errorDato");
                    jQuery(divPopup).dialog('close');
                }
                else {
                    alert("Seleccione " + nombreCampoMensaje, "Dato");
                }
            });
        }
    });
    jQuery(divPopup).dialog({
        title: 'Seleccionar ' + nombreCampoMensaje,
        modal: true,
        resizable: false,
        height: 60,
        close: function (ev, ui) { jQuery(this).dialog('destroy'); }
    });
};
com.jtm.helper.Table.removeColumn = function (obj) {
    var columnIndex = jQuery(obj).closest("th").prevAll("th").length;
    jQuery(obj).closest("table").find("tr").find("td:eq(" + columnIndex + "), th:eq(" + columnIndex + ")").remove();
};
//Método estático que permite exportar una tabla a excel
com.jtm.helper.Table.toSpreadSheet = function (table, name, filename) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    //var uri = 'data:application/octet-stream;base64,';
    //text/csv;charset=utf-8;
    if (typeof table === "string")
        table = jQuery(table);
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    var ctx = { worksheet: name || 'Worksheet', table: table.html() };
    var auuid = com.jtm.helper.Random.getUUID();
    var a = jQuery(table.parent()).find("#" + auuid);
    if (a.length === 0)
        jQuery(table.parent()).append('<a id="' + auuid + '" style="display:none;"></a>');
    a = table.parent().find("#" + auuid);
    a.prop("href", uri + base64(format(template, ctx)));
    a.prop("download", filename + ".xls");
    if (navigator.msSaveBlob) // IE 10+
        navigator.msSaveBlob(new Blob(["<table>" + table.html() + "</table>"], { type: 'data:application/vnd.ms-excel;base64,' }), filename + ".xls");
    else
        document.getElementById(auuid).click();
    a.remove();
    //function base64(s) { return window.btoa(unescape(escape(s))); }
    function base64(s) { return window.btoa(unescape(decodeURIComponent(s))); }
    function format(s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); }
};
com.jtm.helper.Table.download = function (obj, url, content) {
    if (url === undefined || url === null) {
        alert("la url de generación no es válido"); return;
    }
    if (jQuery(content).lenght === 0) { alert("No hay datos a exportar"); return; }
    var frm = '<form id = "frmExcel" name = "frmExcel" method = "POST" target = "_blank" action = "' + url + '"></form>';
    var hdn = '<input type = "hidden" id = "hdnExportarExcel" name = "hdnExportarExcel" />';
    jQuery(obj).append(frm);
    jQuery(hdn).appendTo(jQuery('#frmExcel'));
    var clonado = jQuery(content).closest('div').clone();
    if (clonado === null) return;
    jQuery('#hdnExportarExcel').val($('<div />').text(clonado.html()).html());
    jQuery('#frmExcel').submit();
    jQuery('#frmExcel').remove();
};
com.jtm.helper.Table.copyItems = function (tbdOrigen, tbdDestino, divDestino) {
    jQuery(tbdDestino).html('');
    jQuery(tbdOrigen).find('input[type=checkbox]').each(function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).closest("tr").clone().appendTo(tbdDestino);
        }
    });
    seleccionarFila(tbdDestino);
    jQuery(divDestino + ' span').html(jQuery(tbdDestino + " tr").length);
    jQuery(tbdDestino + " tr").find(':checkbox').each(function () {
        jQuery(this).attr('checked', false);
    });
};
com.jtm.helper.Table.copyOrReplaceItems = function (tbdOrigen, tbdDestino, divDestino) {
    //jQuery(tbdDestino).html('');
    jQuery(tbdOrigen).find('input[type=checkbox]').each(function () {
        if (jQuery(this).is(':checked')) {
            var id = jQuery(this).val();
            var tr = jQuery(this).closest("tr").clone();
            if (jQuery(tbdDestino + "  #chk" + id).length > 0)
                jQuery(tbdDestino + "  #chk" + id).closest('tr').replaceWith(tr);
            else
                jQuery(tr).appendTo(tbdDestino);
        }
    });
    seleccionarFila(tbdDestino);
    jQuery(divDestino + ' span').html(jQuery(tbdDestino + " tr").length);
    jQuery(tbdDestino + " tr").find(':checkbox').each(function () {
        jQuery(this).attr('checked', false);
    });
};
com.jtm.helper.Table.selectExistingItems = function (tbdSource, tbdTarget, chk) {
    if (jQuery(tbdTarget + " input:checkbox").length > 0) {
        jQuery(tbdTarget + " input:checkbox").each(function () {
            if (jQuery(tbdSource).find(chk + jQuery(this).val()).length > 0)
                jQuery(tbdTarget + ' ' + chk + jQuery(this).val()).attr('checked', true);
        });
    }
};
com.jtm.helper.Table.removeItems = function (tbd, div) {
    tbd = (typeof table === "string") ? jQuery(tbd) : tbd;
    jQuery(tbd).find('input[type=checkbox]').each(function (index) {
        if (jQuery(this).is(':checked'))
            jQuery(this).closest('tr').remove();
    });
    jQuery(div + ' span').html(jQuery(tbd + " tr").length);
};
com.jtm.helper.Table.highlightRow = function (table, callback) {
    //jQuery(function () {
    //    jQuery(table + ' > tbody > tr').of("hover");
    //    jQuery(table + ' > tbody > tr').on("hover", function () {
    //        jQuery(this).addClass("selected");
    //    },
    //    function () {
    //        jQuery(this).removeClass("selected");
    //    });
    //});
    table = (typeof table === "string") ? jQuery(table) : table;
    table.find('> tbody > tr').on("click", function (e) {
        jQuery(this).siblings().removeClass("gh-selected").removeClass("selected");
        jQuery(this).toggleClass("gh-selected").toggleClass("selected");
        if (typeof callback === "function")
            callback();
    });
    table.find(">thead>tr>th:first input:checkbox").on("click", function () {
        var checked = this.checked;
        table.find(">tbody>tr>td:first-child input:checkbox").each(function () {
            this.checked = checked;
        });
    });
};
com.jtm.helper.Table.getItems = function (container, isSelected, isList) {
    var data = [];
    var json;
    var selector = (isSelected === true) ? "input:checkbox:checked" : "input:checkbox";
    container = (typeof container === "string") ? jQuery(container) : container;
    if (container.lenght === 0) return data;
    container = (container[0].tagName === "TABLE") ? container.find('>tbody') : container;
    container.find(selector).each(function () {
        if (isList === true)
            data.push({ id: jQuery(this).val() });
        else
            data.push(parseInt(jQuery(this).val()));
    });
    return data;
};
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
var com;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var CswHelper = (function () {
                function CswHelper() {

                }
                CswHelper.CRS84 = "urn:ogc:def:crs:::WGS - 84";
                CswHelper.EPSG4326 = "EPSG:4326";
                CswHelper.search = function (url, options, callback) {
                    jQuery.ajax({
                        type: 'POST',
                        contentType: 'application/xml; charset=UTF-8',
                        url: url,
                        dataType: 'text',
                        cache: false,
                        data: options.data
                        //processdata: false,
                    }).done(function (data) {
                        data = jQuery.xml2json(data);
                        var item = {};
                        item.paginator = CswHelper._parsePaginator(data);
                        item.items = [];
                        item.extra = CswHelper._parseExtra(data);
                        data.SearchResults.Record=data.SearchResults.Record || [];
                        data.SearchResults.Record.forEach(function (record) {
                            item.items.push(CswHelper._parseElement(record));
                        });
                        if (typeof callback === "function") {
                            callback(item);
                        }
                    });
                };
                CswHelper._parseExtra = function (data) {
                    var item = {};
                    item.extra = data.SearchResults.elementSet;
                    item.extra = data.SearchStatus.timestamp;
                    return item;
                };
                CswHelper._parsePaginator = function (data) {
                    return {
                        total: Math.ceil(data.SearchResults.numberOfRecordsMatched / data.SearchResults.numberOfRecordsReturned),
                        totalRecords: data.SearchResults.numberOfRecordsReturned,
                        nextRecord: data.SearchResults.nextRecord
                    };
                };
                CswHelper._parseElement = function (data) {
                    var item = {};
                    item.oid = com.jtm.helper.Random.getUUID();
                    item.uris = [];
                    if (data.URI !== undefined) {
                        if (data.URI instanceof Array)
                            data.URI.forEach(function (uri) {
                                item.uris.push({
                                    name: uri.name,
                                    protocol: uri.protocol,
                                    value: uri.text,
                                    description: uri.description
                                });
                            });
                        else
                            item.uris.push({
                                name: data.URI.name,
                                protocol: data.URI.protocol,
                                value: data.URI.text,
                                description: data.URI.description
                            });
                    }
                    item.abstract = "";
                    if (data.abstract !== undefined) {
                        if (data.abstract instanceof Array)
                            data.abstract.forEach(function (abstract) {
                                item.abstract += abstract + "<br />";
                            });
                        else
                            item.abstract = data.abstract;
                    }
                    item.date = "";
                    if (data.date !== undefined) {
                        if (data.date instanceof Array)
                            data.date.forEach(function (date) {
                                item.date += date.value + " | ";
                            });
                        else
                            item.date = data.date;
                    }
                    item.description = "";
                    if (data.description !== undefined) {
                        if (data.description instanceof Array)
                            data.description.forEach(function (description) {
                                item.description = description + "<br />";
                            });
                        else
                            item.description = data.description;
                    }
                    item.format = "";
                    if (data.format !== undefined) {
                        if (data.format instanceof Array)
                            data.format.forEach(function (format) {
                                item.format += format.value + " | ";
                            });
                        item.format = data.format;
                    }
                    item.info = data.info;
                    item.identifier = "";
                    if (data.identifier !== undefined) {
                        if (data.identifier instanceof Array)
                            data.identifier.forEach(function (identifier) {
                                item.identifier += identifier.value;
                            });
                        else
                            item.identifier = data.identifier;
                    }
                    item.language = "";
                    if (data.language !== undefined) {
                        if (data.language instanceof Array)
                            data.language.forEach(function (language) {
                                item.language += language.value + " | ";
                            });
                        else
                            item.language = data.language;
                    }

                    item.rights = "";
                    if (data.rights !== undefined) {
                        if (data.rights instanceof Array)
                            data.rights.forEach(function (right) {
                                item.rights += right.value + " | ";
                            });
                        else
                            item.rights = data.rights;
                    }

                    if (data.subject !== undefined) {
                        if (data.subject instanceof Array)
                            data.subject.forEach(function (subject) {
                                item.subject += subject + " | ";
                            });
                        else
                            item.subject = data.subject;
                    }
                    item.title = "";
                    if (data.title !== undefined) {
                        if (data.title instanceof Array)
                            data.title.forEach(function (title) {
                                item.title += title.value + " | ";
                            });
                        else
                            item.title = data.title;
                    }
                    item.geometry = null;
                    item.boundingbox = null;
                    if (data.BoundingBox !== undefined && data.BoundingBox !== null) {
                        var itemBoundingBox = {};
                        var point = data.BoundingBox.LowerCorner.split(" ");
                        itemBoundingBox.xmin = Number(point[0]);
                        itemBoundingBox.ymin = Number(point[1]);
                        point = data.BoundingBox.UpperCorner.split(" ");
                        itemBoundingBox.xmax = Number(point[0]);
                        itemBoundingBox.ymax = Number(point[1]);
                        item.boundingbox = itemBoundingBox;
                        var srid = 0;
                        if (data.BoundingBox.crs == CswHelper.CRS84)
                            srid = CswHelper.EPSG4326;
                        else if (data.BoundingBox.crs.includes(CswHelper.EPSG4326) === true)
                            srid = CswHelper.EPSG4326;
                        item.feature = {
                            id: item.oid,
                            srid: srid,
                            extent: item.boundingbox,
                            geometry: [item.boundingbox.xmin, item.boundingbox.ymin, item.boundingbox.xmax, item.boundingbox.ymax],
                            properties: {
                                id: item.identifier,
                                xmin: item.boundingbox.xmin,
                                ymin: item.boundingbox.ymin,
                                xmax: item.boundingbox.xmax,
                                ymax: item.boundingbox.ymax,
                                srid: item.boundingbox.srid
                            }
                        };
                    }
                    return item;
                };
                return CswHelper;
            })();
            helper.CswHelper = CswHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (gh.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));
//function Wgs2Utm( lan1,fi) {
//
//var a=6378137.000;
//var b=6356752.314;
//var f=(a-b)/a;
//var e2=Math.sqrt((Math.pow(a,2)-Math.pow(b,2))/Math.pow(b,2));
//var e=Math.sqrt((Math.pow(a,2)-Math.pow(b,2))/Math.pow(a,2));
//
//var zone;
//var lan0;
//if (lan1>0)
//{
//    var zone=30+Math.ceil(lan1/6);
//    lan0=Math.floor(lan1/6)*6+3;
//}
//else
//{
//    var zone=30-Math.floor(Math.abs(lan1)/6);
//    lan0=-Math.floor(Math.abs(lan1)/6)*6-3;
//}
//
//
////-----------------------------------------------
//
//var lan=lan1-lan0;
//lan=lan*Math.PI/180;
//fi=fi*Math.PI/180;
//var N=a/Math.pow(1-Math.pow(e,2)*Math.pow(Math.sin(fi),2),0.5);
//var M=a*(1-Math.pow(e,2))/Math.pow((1-(Math.pow(e,2)*Math.pow(Math.sin(fi),2))),(3/2));
//var t=Math.tan(fi);
//var p=N/M;
//
////----------------------------------------------
//var k0=0.9996;
//
//var term1=Math.pow(lan,2)*p*Math.pow(Math.cos(fi),2)/2;
//var term2=Math.pow(lan,4)*Math.pow(Math.cos(fi),4)*(4*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1+24*Math.pow(t,2))-4*p*Math.pow(t,2))/24;
//var term3=Math.pow(lan,6)*Math.pow(Math.cos(fi),6)*(61-148*Math.pow(t,2)+16*Math.pow(t,4))/720;
//
//var Kutm=k0*(term1+term2+term3);
//
//
////----------------------------------------------
//term1=Math.pow(lan,2)*p*Math.pow(Math.cos(fi),2)*(p-Math.pow(t,2))/6;
//term2=Math.pow(lan,4)*Math.pow(Math.cos(fi),4)*(4*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1+8*Math.pow(t,2))-Math.pow(p,2)*Math.pow(t,2)+Math.pow(t,4))/120;
//term3=Math.pow(lan,6)*Math.pow(Math.cos(fi),6)*(61-479*Math.pow(t,2)+179*Math.pow(t,4)-Math.pow(t,6))/5040;
//
//var Xutm=500000+k0*lan*N*Math.cos(fi)*(1+term1+term2+term3);
//
////----------------------------------------------
//
//var A0=1-0.25*Math.pow(e,2)-3/64*Math.pow(e,4)-5/256*Math.pow(e,6);
//var A2=3/8*(Math.pow(e,2)+0.25*Math.pow(e,4)+15/128*Math.pow(e,6));
//var A4=15/256*(Math.pow(e,4)+0.75*Math.pow(e,6));
//var A6=35/3072*Math.pow(e,6);
//
//var sfi=a*(A0*fi-A2*Math.sin(2*fi)+A4*Math.sin(4*fi)-A6*Math.sin(6*fi));
//
////----------------------------------------------
//
//term1=Math.pow(lan,2)*N*Math.sin(fi)*Math.cos(fi)/2;
//term2=Math.pow(lan,4)*N*Math.sin(fi)*Math.pow(Math.cos(fi),3)*(4*Math.pow(p,2)+p-Math.pow(t,2))/24;
//term3=Math.pow(lan,6)*N*Math.sin(fi)*Math.pow(Math.cos(fi),5)*(8*Math.pow(p,4)*(11-24*Math.pow(t,2))-28*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1-32*Math.pow(t,2))-p*2*Math.pow(t,2)+Math.pow(t,4));
//var term4=Math.pow(lan,8)*N*Math.sin(fi)*Math.pow(Math.cos(fi),7)*(1385-3111*Math.pow(t,2)+543*Math.pow(t,4)-Math.pow(t,6));
//
//var Yutm=k0*(sfi+term1+term2+term3+term4);
//var sn='N';
//if (fi <0)
//{
//    Yutm = 10000000 + Yutm;
//    sn='S';
//}
//    return Xutm.toString().concat(" ; " + Yutm.toString() + " "+zone.toString()+sn) ;
//
//}
//
//function Utm2Wgs( X,Y,zone,sn) {
//    if (sn=='S')
//    {
//        Y = Y - 10000000;
//    }
//    X = X - 500000;
//    var sa = 6378137.000000;
//    var sb = 6356752.314245;
//
//   var e = Math.pow( Math.pow(sa , 2) - Math.pow(sb , 2) , 0.5 ) / sa;
//   var e2 = Math.pow( Math.pow( sa , 2 ) - Math.pow( sb , 2 ) , 0.5 ) / sb;
//   var e2cuadrada = Math.pow(e2 , 2);
//   var c = Math.pow(sa , 2 ) / sb;
//
//
//
//   var S = ( ( zone * 6 ) - 183 ); 
//   var lat =  Y / ( 6366197.724 * 0.9996 );                         
//   var v =  (c * 0.9996)/ Math.pow( 1 + ( e2cuadrada * Math.pow( Math.cos(lat), 2 ))  , 0.5 ) ;
//   var a = X / v;
//   var a1 = Math.sin( 2 * lat );
//   var a2 = a1 * Math.pow( Math.cos(lat), 2);
//   var j2 = lat + ( a1 / 2 );
//   var j4 = ( ( 3 * j2 ) + a2 ) / 4;
//   var j6 = ( ( 5 * j4 ) + ( a2 * Math.pow( Math.cos(lat) , 2) ) ) / 3;
//   var alfa = ( 3 / 4 ) * e2cuadrada;
//   var beta = ( 5 / 3 ) * Math.pow(alfa , 2);
//   var gama = ( 35 / 27 ) * Math.pow(alfa , 3);
//   var Bm = 0.9996 * c * ( lat - alfa * j2 + beta * j4 - gama * j6 );
//   var b = ( Y - Bm ) / v;
//   var Epsi = ( ( e2cuadrada * Math.pow(a , 2)) / 2 ) * Math.pow( Math.cos(lat) , 2);
//   var Eps = a * ( 1 - ( Epsi / 3 ) );
//   var nab = ( b * ( 1 - Epsi ) ) + lat;
//   var senoheps = ( Math.exp(Eps) - Math.exp(-Eps) ) / 2;
//   var Delt = Math.atan(senoheps / Math.cos(nab) );
//   var TaO = Math.atan(Math.cos(Delt) * Math.tan(nab));
//   var longitude = (Delt *(180 / Math.PI ) ) + S;
//   var latitude = ( lat + ( 1 + e2cuadrada* Math.pow(Math.cos(lat), 2) - ( 3 / 2 ) * e2cuadrada * Math.sin(lat) * Math.cos(lat) * ( TaO - lat ) ) * ( TaO - lat ) ) * (180 / Math.PI);
//    return longitude.toString().concat(" ; " + latitude.toString()) ;
//}
var gh;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var WfsHelper = (function () {
                function WfsHelper() {

                }
                WfsHelper.DEFAULTVERSION = "2.0.0";
                WfsHelper.DEFAULTOUTPUTFORMAT = "text/json";
                WfsHelper.REQUESTCAPABILITIES = "service=WFS&version={0}&request=getcapabilities";
                WfsHelper.REQUESTFEATURE = "service=WFS&version={0}&request=GetFeature&typename={1}&outputFormat={2}&srsname={3}";
                WfsHelper.REQUESTFEATURETYPE = "service=wfs&version={0}&request=DescribeFeatureType&typeNames={1}";
                WfsHelper.PATTERNCRS = /urn:ogc:def:crs:/;
                WfsHelper.PATTERNCRSEPSG = /urn:ogc:def:crs:EPSG::/;
                WfsHelper.detailType = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var requestFeatureType = WfsHelper.REQUESTFEATURETYPE.replace("{0}", options.version).replace("{1}", id);
                    var type = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        type = WfsHelper._getByName(data.FeatureTypeList.FeatureType, id);
                        type.url = url;
                        type.formats = formats;
                        jQuery.ajax(url + requestFeatureType).done(function (response) {
                            data = jQuery.xml2json(response);
                            if (data.Exception === undefined)
                                type.fields = WfsHelper._getFieldsByName(data.complexType, id);
                            else
                                type.fields = [];
                        }).fail(function (error) {

                        });
                    }).fail(function (error) {

                    });
                    jQuery.ajaxSetup({ async: true });
                    return type;
                };
                WfsHelper.listAllTypes = function (url, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var types = [];
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var types2 = data.FeatureTypeList.FeatureType;
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        types2.forEach(function (type) {
                            type.url = url;
                            type.outputFormats = formats;
                            types.push(WfsHelper._parserType(type));
                        });
                    });
                    jQuery.ajaxSetup({ async: true });
                    return types;
                };
                WfsHelper.detailType2 = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var requestFeatureType = WfsHelper.REQUESTFEATURETYPE.replace("{0}", options.version).replace("{1}", id);
                    var type = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        type = WfsHelper._getByName(data.FeatureTypeList.FeatureType, id);
                        type.url = url;
                        type.formats = formats;
                        jQuery.ajax(url + requestFeatureType).done(function (response) {
                            data = jQuery.xml2json(response);
                            if (data.Exception === undefined)
                                type.fields = WfsHelper._getFieldsByName(data.complexType, id);
                            else
                                type.fields = [];
                        }).fail(function (error) {

                        });
                    }).fail(function (error) {

                    });
                    return type;
                };
                WfsHelper.listAllTypes2 = function (url, options, callback) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var types = [];
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var types2 = data.FeatureTypeList.FeatureType;
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        types2.forEach(function (type) {
                            type.url = url;
                            type.formats = formats;
                            types.push(WfsHelper._parserType(type));
                        });
                    });
                    return types;
                };
                WfsHelper._getByName = function (types, typeName) {
                    var i = 0;
                    for (i = 0; i < types.length; i++) {
                        if (typeName === types[i].Name) {
                            return WfsHelper._parserType(types[i])
                        }
                    }
                    return null;
                };
                WfsHelper._getFieldsByName = function (complexTypes, typeName) {
                    typeName = (typeName + "Type").replace(/(.*):/, "");
                    var i = 0;
                    for (i = 0; i < complexTypes.length; i++) {
                        if (complexTypes[i].name === typeName) {
                            return WfsHelper._parserDescribe(complexTypes[i].complexContent.extension.sequence.element);
                        }
                    }
                    return [];
                }
                WfsHelper._parserOutputFormats = function (operations) {
                    var getFeature = operations.find2("name", "GetFeature");
                    var formats = getFeature.Parameter.find2("name", "outputFormat").AllowedValues.Value;
                    var items = [];
                    formats.forEach(function (item) {
                        if (item.indexOf("/") == -1)
                            items.push(item);
                    });
                    return items;
                };
                WfsHelper._parserDescribe = function (data) {
                    return getFields();
                    function getFields() {
                        var items = [];
                        data.forEach(function (item) {
                            items.push({
                                name: item.name,
                                nullable: item.nillable == "true",
                                type: item.type.replace(/(.*):/, "")
                            });
                        });
                        return items;
                    }
                }
                WfsHelper._parserType = function (data) {
                    data.oid = "wfstype_" + com.jtm.helper.Random.getUUID();
                    data.extent = [data.xmax, data.ymax, data.xmin, data.ymin];
                    //data.extent = ol.proj.transformExtent(data.extent, data.srid, thiss.map.getView().getProjection());
                    data.id = data.Name;
                    delete data.Name;
                    data.name = data.Title;
                    delete data.Title;
                    var itemBoundingBox = {};
                    itemBoundingBox.geographic = {
                        srid: "EPSG:4326"
                    };
                    var point = data.WGS84BoundingBox.LowerCorner.split(" ");
                    itemBoundingBox.geographic.xmin = point[1];
                    itemBoundingBox.geographic.ymin = point[0];
                    point = data.WGS84BoundingBox.UpperCorner.split(" ");
                    itemBoundingBox.geographic.xmax = point[1];
                    itemBoundingBox.geographic.ymax = point[0];
                    data.boundingbox = itemBoundingBox;
                    delete data.WGS84BoundingBox;
                    data.extent = [data.boundingbox.geographic.xmin, data.boundingbox.geographic.ymin, data.boundingbox.geographic.xmax, data.boundingbox.geographic.ymax];
                    data.srid = data.boundingbox.geographic.srid;
                    data.crs = data.DefaultCRS.replace(WfsHelper.PATTERNCRS, '').replace("::", ":");
                    delete data.DefaultCRS;
                    data.keywords = data.Keywords.Keyword.join();
                    delete data.Keywords;
                    data.abstract = data.Abstract;
                    delete data.Abstract;
                    return data;
                };
                return WfsHelper;
            })();
            helper.WfsHelper = WfsHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (gh.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));
var gh;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var WmsHelper = (function () {
                function WmsHelper() {

                }
                WmsHelper.DEFAULTVERSION = "1.3.0";
                WmsHelper.REQUESTCAPABILITIES = "service=WMS&version={0}&request=getcapabilities";
                WmsHelper.CRS84 = "CRS:84";
                WmsHelper.detailLayer = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WmsHelper.DEFAULTVERSION;
                    var requestCapabilities = WmsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var layer = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        layer = WmsHelper._getByName(data.Capability.Layer.Layer, id);
                        layer.url = url;
                    });
                    jQuery.ajaxSetup({ async: true });
                    return layer;
                };
                WmsHelper.listAllLayers = function (url, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WmsHelper.DEFAULTVERSION;
                    var requestCapabilities = WmsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var layers = [];
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var layers2 = data.Capability.Layer.Layer;
                        layers2.forEach(function (layer) {
                            layer.url = url;
                            layers.push(WmsHelper._parserLayer(layer));
                        });
                    });
                    jQuery.ajaxSetup({ async: true });
                    return layers;
                };
                WmsHelper._getByName = function (layers, name) {
                    var i = 0;
                    for (i = 0; i < layers.length; i++) {
                        if (name === layers[i].Name) {
                            return WmsHelper._parserLayer(layers[i]);
                        }
                    }
                    return null;
                };
                WmsHelper._parserLayer = function (data) {
                    var thiss = this;
                    data.oid = "wmslayer_" + com.jtm.helper.Random.getUUID();
                    //extent = ol.proj.transformExtent(extent, data.srid, thiss.map.getView().getProjection());
                    data.id = data.Name;
                    delete data.Name;
                    data.name = data.Title;
                    delete data.Title;
                    var itemBoundingBox = {};
                    data.BoundingBox.forEach(function (item) {
                        if (item.CRS.includes(WmsHelper.CRS84) === true)
                            itemBoundingBox.geographic = {
                                srid: item.CRS,
                                xmax: Number(item.maxx),
                                ymax: Number(item.maxy),
                                xmin: Number(item.minx),
                                ymin: Number(item.miny)
                            }
                    });
                    data.BoundingBox.forEach(function (item) {
                        if (item.CRS.includes(WmsHelper.CRS84) === false)
                            itemBoundingBox.projected = {
                                srid: item.CRS,
                                xmin: Number(item.minx),
                                ymin: Number(item.miny),
                                xmax: Number(item.maxx),
                                ymax: Number(item.maxy)
                            }
                    });
                    data.boundingbox = itemBoundingBox;
                    delete data.BoundingBox;
                    data.extent = [data.boundingbox.geographic.xmin, data.boundingbox.geographic.ymin, data.boundingbox.geographic.xmax, data.boundingbox.geographic.ymax];
                    data.srid = data.boundingbox.geographic.srid;
                    data.crs = [];
                    data.CRS.forEach(function (item) {
                        data.crs.push(item);
                    });
                    delete data.CRS;
                    data.keywords = data.KeywordList.Keyword.join();
                    delete data.KeywordList;
                    data.styles = [];
                    if (data.Style instanceof Array) {
                        data.Style.forEach(function (item) {
                            data.styles.push({
                                name: item.Name,
                                format: item.LegendURL.Format,
                                url: item.LegendURL.OnlineResource["xlink:href"]
                            });
                        });
                    }
                    else {
                        data.styles.push({
                            name: data.Style.Name,
                            format: data.Style.LegendURL.Format,
                            url: data.Style.LegendURL.OnlineResource["xlink:href"]
                        });
                    }
                    delete data.Style;
                    data.opacity = data.opaque;
                    delete data.opaque;
                    data.queryable = data.queryable;
                    data.abstract = data.Abstract;
                    delete data.Abstract;
                    delete data.EX_GeographicBoundingBox;
                    return data;
                };
                return WmsHelper;
            })();
            helper.WmsHelper = WmsHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (jtm.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));