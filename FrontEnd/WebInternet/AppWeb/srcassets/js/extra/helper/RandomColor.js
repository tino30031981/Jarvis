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