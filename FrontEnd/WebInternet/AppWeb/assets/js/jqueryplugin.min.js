(function ($, window) {

	$.fn.contextMenu = function (settings) {

		return this.each(function () {

			// Open context menu
			$(this).on("contextmenu", function (e) {
				// return native menu if pressing control
				if (e.ctrlKey) return;

				//open menu
				$(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                    	position: "absolute",
                    	left: getMenuPosition(e.pageX, 'width'),
                    	top: getMenuPosition(e.pageY, 'height')
                    })
                    .off('click')
                    .on('click', function (e) {
                    	$(this).hide();

                    	var $invokedOn = $(this).data("invokedOn");
                    	var $selectedMenu = $(e.target);

                    	settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

				return false;
			});

			//make sure menu closes on any click
			$(document).click(function () {
				$(settings.menuSelector).hide();
			});
		});

		function getMenuPosition(mouse, direction) {
			var win = $(window)[direction]();
			var page = $(document)[direction]();
			var menu = $(settings.menuSelector)[direction]();

			//if (direction == 'height') {
			//	console.log("direction:", direction);
			//	console.log("mouse", mouse);
			//	console.log("menu", Math.round(menu));
			//	console.log("page", page);
			//	console.log("window", win);
			//}

			// opening menu would pass the side of the page
			if (mouse + menu > page && menu < mouse) {
				return mouse - menu;
			}
			return mouse;
		}

	};
})(jQuery, window);
/*! jquery.finger - v0.1.6 - 2016-10-05
* https://github.com/ngryman/jquery.finger
* Copyright (c) 2016 Nicolas Gryman; Licensed MIT */

(function (factory) {
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);
    else if (typeof exports === 'object')
        factory(require('jquery'));
    else
        factory(jQuery);
}(function ($) {

    var ua = navigator.userAgent,
		isChrome = /chrome/i.exec(ua),
		isAndroid = /android/i.exec(ua),
		hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid),
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend touchcancel' : 'mouseup mouseleave',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',

		namespace = 'finger',
		rootEl = $('html')[0],

		start = {},
		move = {},
		motion,
		safeguard,
		timeout,
		prevEl,
		prevTime,

		Finger = $.Finger = {
		    pressDuration: 300,
		    doubleTapInterval: 300,
		    flickDuration: 150,
		    motionThreshold: 5
		};

    function preventDefault(event) {
        event.preventDefault();
        $.event.remove(rootEl, 'click', preventDefault);
    }

    function page(coord, event) {
        return (hasTouch ? event.originalEvent.touches[0] : event)['page' + coord.toUpperCase()];
    }

    function trigger(event, evtName, remove) {
        var fingerEvent = $.Event(evtName, move);
        $.event.trigger(fingerEvent, { originalEvent: event }, event.target);

        if (fingerEvent.isDefaultPrevented()) {
            if (~evtName.indexOf('tap') && !hasTouch)
                $.event.add(rootEl, 'click', preventDefault);
            else
                event.preventDefault();
        }

        if (remove) {
            $.event.remove(rootEl, moveEvent + '.' + namespace, moveHandler);
            $.event.remove(rootEl, stopEvent + '.' + namespace, stopHandler);
        }
    }

    function startHandler(event) {
        if (event.which > 1)
            return;

        var timeStamp = event.timeStamp || +new Date();

        if (safeguard == timeStamp) return;
        safeguard = timeStamp;

        // initializes data
        start.x = move.x = page('x', event);
        start.y = move.y = page('y', event);
        start.time = timeStamp;
        start.target = event.target;
        move.orientation = null;
        move.end = false;
        motion = false;
        timeout = setTimeout(function () {
            trigger(event, 'press', true);
        }, Finger.pressDuration);

        $.event.add(rootEl, moveEvent + '.' + namespace, moveHandler);
        $.event.add(rootEl, stopEvent + '.' + namespace, stopHandler);

        // global prevent default
        if (Finger.preventDefault) {
            event.preventDefault();
            $.event.add(rootEl, 'click', preventDefault);
        }
    }

    function moveHandler(event) {
        // motion data
        move.x = page('x', event);
        move.y = page('y', event);
        move.dx = move.x - start.x;
        move.dy = move.y - start.y;
        move.adx = Math.abs(move.dx);
        move.ady = Math.abs(move.dy);

        // security
        motion = move.adx > Finger.motionThreshold || move.ady > Finger.motionThreshold;
        if (!motion) return;

        // moves cancel press events
        clearTimeout(timeout);

        // orientation
        if (!move.orientation) {
            if (move.adx > move.ady) {
                move.orientation = 'horizontal';
                move.direction = move.dx > 0 ? +1 : -1;
            }
            else {
                move.orientation = 'vertical';
                move.direction = move.dy > 0 ? +1 : -1;
            }
        }

        // for delegated events, the target may change over time
        // this ensures we notify the right target and simulates the mouseleave behavior
        while (event.target && event.target !== start.target)
            event.target = event.target.parentNode;
        if (event.target !== start.target) {
            event.target = start.target;
            stopHandler.call(this, $.Event(stopEvent + '.' + namespace, event));
            return;
        }

        // fire drag event
        trigger(event, 'drag');
    }

    function stopHandler(event) {
        var timeStamp = event.timeStamp || +new Date(),
			dt = timeStamp - start.time,
			evtName;

        // always clears press timeout
        clearTimeout(timeout);

        // tap-like events
        if (!motion) {
            // triggered only if targets match
            if (event.target === start.target) {
                var doubleTap = prevEl === event.target && timeStamp - prevTime < Finger.doubleTapInterval;
                evtName = doubleTap ? 'doubletap' : 'tap';
                prevEl = doubleTap ? null : start.target;
                prevTime = timeStamp;
            }
        }
            // motion events
        else {
            // ensure last target is set the initial one
            event.target = start.target;
            if (dt < Finger.flickDuration) trigger(event, 'flick');
            move.end = true;
            evtName = 'drag';
        }

        if (evtName)
            trigger(event, evtName, true);
    }

    // initial binding
    $.event.add(rootEl, startEvent + '.' + namespace, startHandler);

    // expose events as methods
    $.each('tap doubletap press drag flick'.split(' '), function (i, name) {
        $.fn[name] = function (fn) {
            return fn ? this.on(name, fn) : this.trigger(name);
        };
    });

    return Finger;

}));
/*! jQuery Geo - v1.0.0-rc1.2 - 2016-07-14
* http://jquerygeo.com
* Copyright (c) 2016 Ryan Morrison-Westphal; Licensed MIT */
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns only support repeat.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

    (function () {

        // alias some functions to make (compiled) code shorter
        var m = Math;
        var mr = m.round;
        var ms = m.sin;
        var mc = m.cos;
        var abs = m.abs;
        var sqrt = m.sqrt;

        // this is used for sub pixel precision
        var Z = 10;
        var Z2 = Z / 2;

        var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];

        /**
        * This funtion is assigned to the <canvas> elements as element.getContext().
        * @this {HTMLElement}
        * @return {CanvasRenderingContext2D_}
        */
        function getContext() {
            return this.context_ ||
              (this.context_ = new CanvasRenderingContext2D_(this));
        }

        var slice = Array.prototype.slice;

        /**
        * Binds a function to an object. The returned function will always use the
        * passed in {@code obj} as {@code this}.
        *
        * Example:
        *
        *   g = bind(f, obj, a, b)
        *   g(c, d) // will do f.call(obj, a, b, c, d)
        *
        * @param {Function} f The function to bind the object to
        * @param {Object} obj The object that should act as this when the function
        *     is called
        * @param {*} var_args Rest arguments that will be used as the initial
        *     arguments when the function is called
        * @return {Function} A new function that has bound this
        */
        function bind(f, obj, var_args) {
            var a = slice.call(arguments, 2);
            return function () {
                return f.apply(obj, a.concat(slice.call(arguments)));
            };
        }

        function encodeHtmlAttribute(s) {
            return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        }

        function addNamespace(doc, prefix, urn) {
            if (!doc.namespaces[prefix]) {
                doc.namespaces.add(prefix, urn, '#default#VML');
            }
        }

        function addNamespacesAndStylesheet(doc) {
            addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
            addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');

            // Setup default CSS.  Only add one style sheet per document
            if (!doc.styleSheets['ex_canvas_']) {
                var ss = doc.createStyleSheet();
                ss.owningElement.id = 'ex_canvas_';
                ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
                // default size is 300x150 in Gecko and Opera
                  'text-align:left;width:300px;height:150px}';
            }
        }

        // Add namespaces and stylesheet at startup.
        addNamespacesAndStylesheet(document);

        var G_vmlCanvasManager_ = {
            init: function (opt_doc) {
                var doc = opt_doc || document;
                // Create a dummy element so that IE will allow canvas elements to be
                // recognized.
                doc.createElement('canvas');
                doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
            },

            init_: function (doc) {
                // find all canvas elements
                var els = doc.getElementsByTagName('canvas');
                for (var i = 0; i < els.length; i++) {
                    this.initElement(els[i]);
                }
            },

            /**
            * Public initializes a canvas element so that it can be used as canvas
            * element from now on. This is called automatically before the page is
            * loaded but if you are creating elements using createElement you need to
            * make sure this is called on the element.
            * @param {HTMLElement} el The canvas element to initialize.
            * @return {HTMLElement} the element that was created.
            */
            initElement: function (el) {
                if (!el.getContext) {
                    el.getContext = getContext;

                    // Add namespaces and stylesheet to document of the element.
                    addNamespacesAndStylesheet(el.ownerDocument);

                    // Remove fallback content. There is no way to hide text nodes so we
                    // just remove all childNodes. We could hide all elements and remove
                    // text nodes but who really cares about the fallback content.
                    el.innerHTML = '';

                    // do not use inline function because that will leak memory
                    el.attachEvent('onpropertychange', onPropertyChange);
                    el.attachEvent('onresize', onResize);

                    var attrs = el.attributes;
                    if (attrs.width && attrs.width.specified) {
                        // TODO: use runtimeStyle and coordsize
                        // el.getContext().setWidth_(attrs.width.nodeValue);
                        el.style.width = attrs.width.nodeValue + 'px';
                    } else {
                        el.width = el.clientWidth;
                    }
                    if (attrs.height && attrs.height.specified) {
                        // TODO: use runtimeStyle and coordsize
                        // el.getContext().setHeight_(attrs.height.nodeValue);
                        el.style.height = attrs.height.nodeValue + 'px';
                    } else {
                        el.height = el.clientHeight;
                    }
                    //el.getContext().setCoordsize_()
                }
                return el;
            }
        };

        function onPropertyChange(e) {
            var el = e.srcElement;

            switch (e.propertyName) {
                case 'width':
                    el.getContext().clearRect();
                    el.style.width = el.attributes.width.nodeValue + 'px';
                    // In IE8 this does not trigger onresize.
                    el.firstChild.style.width = el.clientWidth + 'px';
                    break;
                case 'height':
                    el.getContext().clearRect();
                    el.style.height = el.attributes.height.nodeValue + 'px';
                    el.firstChild.style.height = el.clientHeight + 'px';
                    break;
            }
        }

        function onResize(e) {
            var el = e.srcElement;
            if (el.firstChild) {
                el.firstChild.style.width = el.clientWidth + 'px';
                el.firstChild.style.height = el.clientHeight + 'px';
            }
        }

        G_vmlCanvasManager_.init();

        // precompute "00" to "FF"
        var decToHex = [];
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
            }
        }

        function createMatrixIdentity() {
            return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
            ];
        }

        function matrixMultiply(m1, m2) {
            var result = createMatrixIdentity();

            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    var sum = 0;

                    for (var z = 0; z < 3; z++) {
                        sum += m1[x][z] * m2[z][y];
                    }

                    result[x][y] = sum;
                }
            }
            return result;
        }

        function copyState(o1, o2) {
            o2.fillStyle = o1.fillStyle;
            o2.lineCap = o1.lineCap;
            o2.lineJoin = o1.lineJoin;
            o2.lineWidth = o1.lineWidth;
            o2.miterLimit = o1.miterLimit;
            o2.shadowBlur = o1.shadowBlur;
            o2.shadowColor = o1.shadowColor;
            o2.shadowOffsetX = o1.shadowOffsetX;
            o2.shadowOffsetY = o1.shadowOffsetY;
            o2.strokeStyle = o1.strokeStyle;
            o2.globalAlpha = o1.globalAlpha;
            o2.font = o1.font;
            o2.textAlign = o1.textAlign;
            o2.textBaseline = o1.textBaseline;
            o2.arcScaleX_ = o1.arcScaleX_;
            o2.arcScaleY_ = o1.arcScaleY_;
            o2.lineScale_ = o1.lineScale_;
        }

        //  var colorData = {
        //    aliceblue: '#F0F8FF',
        //    antiquewhite: '#FAEBD7',
        //    aquamarine: '#7FFFD4',
        //    azure: '#F0FFFF',
        //    beige: '#F5F5DC',
        //    bisque: '#FFE4C4',
        //    black: '#000000',
        //    blanchedalmond: '#FFEBCD',
        //    blueviolet: '#8A2BE2',
        //    brown: '#A52A2A',
        //    burlywood: '#DEB887',
        //    cadetblue: '#5F9EA0',
        //    chartreuse: '#7FFF00',
        //    chocolate: '#D2691E',
        //    coral: '#FF7F50',
        //    cornflowerblue: '#6495ED',
        //    cornsilk: '#FFF8DC',
        //    crimson: '#DC143C',
        //    cyan: '#00FFFF',
        //    darkblue: '#00008B',
        //    darkcyan: '#008B8B',
        //    darkgoldenrod: '#B8860B',
        //    darkgray: '#A9A9A9',
        //    darkgreen: '#006400',
        //    darkgrey: '#A9A9A9',
        //    darkkhaki: '#BDB76B',
        //    darkmagenta: '#8B008B',
        //    darkolivegreen: '#556B2F',
        //    darkorange: '#FF8C00',
        //    darkorchid: '#9932CC',
        //    darkred: '#8B0000',
        //    darksalmon: '#E9967A',
        //    darkseagreen: '#8FBC8F',
        //    darkslateblue: '#483D8B',
        //    darkslategray: '#2F4F4F',
        //    darkslategrey: '#2F4F4F',
        //    darkturquoise: '#00CED1',
        //    darkviolet: '#9400D3',
        //    deeppink: '#FF1493',
        //    deepskyblue: '#00BFFF',
        //    dimgray: '#696969',
        //    dimgrey: '#696969',
        //    dodgerblue: '#1E90FF',
        //    firebrick: '#B22222',
        //    floralwhite: '#FFFAF0',
        //    forestgreen: '#228B22',
        //    gainsboro: '#DCDCDC',
        //    ghostwhite: '#F8F8FF',
        //    gold: '#FFD700',
        //    goldenrod: '#DAA520',
        //    grey: '#808080',
        //    greenyellow: '#ADFF2F',
        //    honeydew: '#F0FFF0',
        //    hotpink: '#FF69B4',
        //    indianred: '#CD5C5C',
        //    indigo: '#4B0082',
        //    ivory: '#FFFFF0',
        //    khaki: '#F0E68C',
        //    lavender: '#E6E6FA',
        //    lavenderblush: '#FFF0F5',
        //    lawngreen: '#7CFC00',
        //    lemonchiffon: '#FFFACD',
        //    lightblue: '#ADD8E6',
        //    lightcoral: '#F08080',
        //    lightcyan: '#E0FFFF',
        //    lightgoldenrodyellow: '#FAFAD2',
        //    lightgreen: '#90EE90',
        //    lightgrey: '#D3D3D3',
        //    lightpink: '#FFB6C1',
        //    lightsalmon: '#FFA07A',
        //    lightseagreen: '#20B2AA',
        //    lightskyblue: '#87CEFA',
        //    lightslategray: '#778899',
        //    lightslategrey: '#778899',
        //    lightsteelblue: '#B0C4DE',
        //    lightyellow: '#FFFFE0',
        //    limegreen: '#32CD32',
        //    linen: '#FAF0E6',
        //    magenta: '#FF00FF',
        //    mediumaquamarine: '#66CDAA',
        //    mediumblue: '#0000CD',
        //    mediumorchid: '#BA55D3',
        //    mediumpurple: '#9370DB',
        //    mediumseagreen: '#3CB371',
        //    mediumslateblue: '#7B68EE',
        //    mediumspringgreen: '#00FA9A',
        //    mediumturquoise: '#48D1CC',
        //    mediumvioletred: '#C71585',
        //    midnightblue: '#191970',
        //    mintcream: '#F5FFFA',
        //    mistyrose: '#FFE4E1',
        //    moccasin: '#FFE4B5',
        //    navajowhite: '#FFDEAD',
        //    oldlace: '#FDF5E6',
        //    olivedrab: '#6B8E23',
        //    orange: '#FFA500',
        //    orangered: '#FF4500',
        //    orchid: '#DA70D6',
        //    palegoldenrod: '#EEE8AA',
        //    palegreen: '#98FB98',
        //    paleturquoise: '#AFEEEE',
        //    palevioletred: '#DB7093',
        //    papayawhip: '#FFEFD5',
        //    peachpuff: '#FFDAB9',
        //    peru: '#CD853F',
        //    pink: '#FFC0CB',
        //    plum: '#DDA0DD',
        //    powderblue: '#B0E0E6',
        //    rosybrown: '#BC8F8F',
        //    royalblue: '#4169E1',
        //    saddlebrown: '#8B4513',
        //    salmon: '#FA8072',
        //    sandybrown: '#F4A460',
        //    seagreen: '#2E8B57',
        //    seashell: '#FFF5EE',
        //    sienna: '#A0522D',
        //    skyblue: '#87CEEB',
        //    slateblue: '#6A5ACD',
        //    slategray: '#708090',
        //    slategrey: '#708090',
        //    snow: '#FFFAFA',
        //    springgreen: '#00FF7F',
        //    steelblue: '#4682B4',
        //    tan: '#D2B48C',
        //    thistle: '#D8BFD8',
        //    tomato: '#FF6347',
        //    turquoise: '#40E0D0',
        //    violet: '#EE82EE',
        //    wheat: '#F5DEB3',
        //    whitesmoke: '#F5F5F5',
        //    yellowgreen: '#9ACD32'
        //  };


        function getRgbHslContent(styleString) {
            var start = styleString.indexOf('(', 3);
            var end = styleString.indexOf(')', start + 1);
            var parts = styleString.substring(start + 1, end).split(',');
            // add alpha if needed
            if (parts.length != 4 || styleString.charAt(3) != 'a') {
                parts[3] = 1;
            }
            return parts;
        }

        function percent(s) {
            return parseFloat(s) / 100;
        }

        function clamp(v, min, max) {
            return Math.min(max, Math.max(min, v));
        }

        function hslToRgb(parts) {
            var r, g, b, h, s, l;
            h = parseFloat(parts[0]) / 360 % 360;
            if (h < 0)
                h++;
            s = clamp(percent(parts[1]), 0, 1);
            l = clamp(percent(parts[2]), 0, 1);
            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hueToRgb(p, q, h + 1 / 3);
                g = hueToRgb(p, q, h);
                b = hueToRgb(p, q, h - 1 / 3);
            }

            return '#' + decToHex[Math.floor(r * 255)] +
              decToHex[Math.floor(g * 255)] +
              decToHex[Math.floor(b * 255)];
        }

        function hueToRgb(m1, m2, h) {
            if (h < 0)
                h++;
            if (h > 1)
                h--;

            if (6 * h < 1)
                return m1 + (m2 - m1) * 6 * h;
            else if (2 * h < 1)
                return m2;
            else if (3 * h < 2)
                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
            else
                return m1;
        }

        var processStyleCache = {};

        function processStyle(styleString) {
            if (styleString in processStyleCache) {
                return processStyleCache[styleString];
            }

            var str, alpha = 1;

            styleString = String(styleString);
            if (styleString.charAt(0) == '#') {
                str = styleString;
            } else if (/^rgb/.test(styleString)) {
                var parts = getRgbHslContent(styleString);
                var str = '#', n;
                for (var i = 0; i < 3; i++) {
                    if (parts[i].indexOf('%') != -1) {
                        n = Math.floor(percent(parts[i]) * 255);
                    } else {
                        n = +parts[i];
                    }
                    str += decToHex[clamp(n, 0, 255)];
                }
                alpha = +parts[3];
            } else if (/^hsl/.test(styleString)) {
                var parts = getRgbHslContent(styleString);
                str = hslToRgb(parts);
                alpha = parts[3];
            } else {
                str = /*colorData[styleString] ||*/styleString;
            }
            return processStyleCache[styleString] = { color: str, alpha: alpha };
        }

        var DEFAULT_STYLE = {
            style: 'normal',
            variant: 'normal',
            weight: 'normal',
            size: 10,
            family: 'sans-serif'
        };

        // Internal text style cache
        //  var fontStyleCache = {};

        //  function processFontStyle(styleString) {
        //    if (fontStyleCache[styleString]) {
        //      return fontStyleCache[styleString];
        //    }

        //    var el = document.createElement('div');
        //    var style = el.style;
        //    try {
        //      style.font = styleString;
        //    } catch (ex) {
        //      // Ignore failures to set to invalid font.
        //    }

        //    return fontStyleCache[styleString] = {
        //      style: style.fontStyle || DEFAULT_STYLE.style,
        //      variant: style.fontVariant || DEFAULT_STYLE.variant,
        //      weight: style.fontWeight || DEFAULT_STYLE.weight,
        //      size: style.fontSize || DEFAULT_STYLE.size,
        //      family: style.fontFamily || DEFAULT_STYLE.family
        //    };
        //  }

        //  function getComputedStyle(style, element) {
        //    var computedStyle = {};

        //    for (var p in style) {
        //      computedStyle[p] = style[p];
        //    }

        //    // Compute the size
        //    var canvasFontSize = parseFloat(element.currentStyle.fontSize),
        //        fontSize = parseFloat(style.size);

        //    if (typeof style.size == 'number') {
        //      computedStyle.size = style.size;
        //    } else if (style.size.indexOf('px') != -1) {
        //      computedStyle.size = fontSize;
        //    } else if (style.size.indexOf('em') != -1) {
        //      computedStyle.size = canvasFontSize * fontSize;
        //    } else if(style.size.indexOf('%') != -1) {
        //      computedStyle.size = (canvasFontSize / 100) * fontSize;
        //    } else if (style.size.indexOf('pt') != -1) {
        //      computedStyle.size = fontSize / .75;
        //    } else {
        //      computedStyle.size = canvasFontSize;
        //    }

        //    // Different scaling between normal text and VML text. This was found using
        //    // trial and error to get the same size as non VML text.
        //    computedStyle.size *= 0.981;

        //    return computedStyle;
        //  }

        //  function buildStyle(style) {
        //    return style.style + ' ' + style.variant + ' ' + style.weight + ' ' +
        //        style.size + 'px ' + style.family;
        //  }

        var lineCapMap = {
            'butt': 'flat',
            'round': 'round'
        };

        function processLineCap(lineCap) {
            return lineCapMap[lineCap] || 'square';
        }

        /**
        * This class implements CanvasRenderingContext2D interface as described by
        * the WHATWG.
        * @param {HTMLElement} canvasElement The element that the 2D context should
        * be associated with
        */
        function CanvasRenderingContext2D_(canvasElement) {
            this.m_ = createMatrixIdentity();

            this.mStack_ = [];
            this.aStack_ = [];
            this.currentPath_ = [];

            // Canvas context properties
            this.strokeStyle = '#000';
            this.fillStyle = '#000';

            this.lineWidth = 1;
            this.lineJoin = 'miter';
            this.lineCap = 'butt';
            this.miterLimit = Z * 1;
            this.globalAlpha = 1;
            //this.font = '10px sans-serif';
            //this.textAlign = 'left';
            //this.textBaseline = 'alphabetic';
            this.canvas = canvasElement;

            var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' +
              canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
            var el = canvasElement.ownerDocument.createElement('div');
            el.style.cssText = cssText;
            canvasElement.appendChild(el);

            var overlayEl = el.cloneNode(false);
            // Use a non transparent background.
            overlayEl.style.backgroundColor = 'red';
            overlayEl.style.filter = 'alpha(opacity=0)';
            canvasElement.appendChild(overlayEl);

            this.element_ = el;
            this.arcScaleX_ = 1;
            this.arcScaleY_ = 1;
            this.lineScale_ = 1;
        }

        var contextPrototype = CanvasRenderingContext2D_.prototype;
        contextPrototype.clearRect = function () {
            if (this.textMeasureEl_) {
                this.textMeasureEl_.removeNode(true);
                this.textMeasureEl_ = null;
            }
            this.element_.innerHTML = '';
        };

        contextPrototype.beginPath = function () {
            // TODO: Branch current matrix so that save/restore has no effect
            //       as per safari docs.
            this.currentPath_ = [];
        };

        contextPrototype.moveTo = function (aX, aY) {
            var p = getCoords(this, aX, aY);
            this.currentPath_.push({ type: 'moveTo', x: p.x, y: p.y });
            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };

        contextPrototype.lineTo = function (aX, aY) {
            var p = getCoords(this, aX, aY);
            this.currentPath_.push({ type: 'lineTo', x: p.x, y: p.y });

            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };

        contextPrototype.bezierCurveTo = function (aCP1x, aCP1y,
                                                  aCP2x, aCP2y,
                                                  aX, aY) {
            var p = getCoords(this, aX, aY);
            var cp1 = getCoords(this, aCP1x, aCP1y);
            var cp2 = getCoords(this, aCP2x, aCP2y);
            bezierCurveTo(this, cp1, cp2, p);
        };

        // Helper function that takes the already fixed cordinates.
        function bezierCurveTo(self, cp1, cp2, p) {
            self.currentPath_.push({
                type: 'bezierCurveTo',
                cp1x: cp1.x,
                cp1y: cp1.y,
                cp2x: cp2.x,
                cp2y: cp2.y,
                x: p.x,
                y: p.y
            });
            self.currentX_ = p.x;
            self.currentY_ = p.y;
        }

        contextPrototype.quadraticCurveTo = function (aCPx, aCPy, aX, aY) {
            // the following is lifted almost directly from
            // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

            var cp = getCoords(this, aCPx, aCPy);
            var p = getCoords(this, aX, aY);

            var cp1 = {
                x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
                y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
            };
            var cp2 = {
                x: cp1.x + (p.x - this.currentX_) / 3.0,
                y: cp1.y + (p.y - this.currentY_) / 3.0
            };

            bezierCurveTo(this, cp1, cp2, p);
        };

        contextPrototype.arc = function (aX, aY, aRadius,
                                      aStartAngle, aEndAngle, aClockwise) {
            aRadius *= Z;
            var arcType = aClockwise ? 'at' : 'wa';

            var xStart = aX + mc(aStartAngle) * aRadius - Z2;
            var yStart = aY + ms(aStartAngle) * aRadius - Z2;

            var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
            var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

            // IE won't render arches drawn counter clockwise if xStart == xEnd.
            if (xStart == xEnd && !aClockwise) {
                xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                // that can be represented in binary
            }

            var p = getCoords(this, aX, aY);
            var pStart = getCoords(this, xStart, yStart);
            var pEnd = getCoords(this, xEnd, yEnd);

            this.currentPath_.push({
                type: arcType,
                x: p.x,
                y: p.y,
                radius: aRadius,
                xStart: pStart.x,
                yStart: pStart.y,
                xEnd: pEnd.x,
                yEnd: pEnd.y
            });

        };

        //  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
        //    this.moveTo(aX, aY);
        //    this.lineTo(aX + aWidth, aY);
        //    this.lineTo(aX + aWidth, aY + aHeight);
        //    this.lineTo(aX, aY + aHeight);
        //    this.closePath();
        //  };

        //  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
        //    var oldPath = this.currentPath_;
        //    this.beginPath();

        //    this.moveTo(aX, aY);
        //    this.lineTo(aX + aWidth, aY);
        //    this.lineTo(aX + aWidth, aY + aHeight);
        //    this.lineTo(aX, aY + aHeight);
        //    this.closePath();
        //    this.stroke();

        //    this.currentPath_ = oldPath;
        //  };

        //  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
        //    var oldPath = this.currentPath_;
        //    this.beginPath();

        //    this.moveTo(aX, aY);
        //    this.lineTo(aX + aWidth, aY);
        //    this.lineTo(aX + aWidth, aY + aHeight);
        //    this.lineTo(aX, aY + aHeight);
        //    this.closePath();
        //    this.fill();

        //    this.currentPath_ = oldPath;
        //  };

        //  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
        //    var gradient = new CanvasGradient_('gradient');
        //    gradient.x0_ = aX0;
        //    gradient.y0_ = aY0;
        //    gradient.x1_ = aX1;
        //    gradient.y1_ = aY1;
        //    return gradient;
        //  };

        //  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
        //                                                   aX1, aY1, aR1) {
        //    var gradient = new CanvasGradient_('gradientradial');
        //    gradient.x0_ = aX0;
        //    gradient.y0_ = aY0;
        //    gradient.r0_ = aR0;
        //    gradient.x1_ = aX1;
        //    gradient.y1_ = aY1;
        //    gradient.r1_ = aR1;
        //    return gradient;
        //  };

        //  contextPrototype.drawImage = function(image, var_args) {
        //    var dx, dy, dw, dh, sx, sy, sw, sh;

        //    // to find the original width we overide the width and height
        //    var oldRuntimeWidth = image.runtimeStyle.width;
        //    var oldRuntimeHeight = image.runtimeStyle.height;
        //    image.runtimeStyle.width = 'auto';
        //    image.runtimeStyle.height = 'auto';

        //    // get the original size
        //    var w = image.width;
        //    var h = image.height;

        //    // and remove overides
        //    image.runtimeStyle.width = oldRuntimeWidth;
        //    image.runtimeStyle.height = oldRuntimeHeight;

        //    if (arguments.length == 3) {
        //      dx = arguments[1];
        //      dy = arguments[2];
        //      sx = sy = 0;
        //      sw = dw = w;
        //      sh = dh = h;
        //    } else if (arguments.length == 5) {
        //      dx = arguments[1];
        //      dy = arguments[2];
        //      dw = arguments[3];
        //      dh = arguments[4];
        //      sx = sy = 0;
        //      sw = w;
        //      sh = h;
        //    } else if (arguments.length == 9) {
        //      sx = arguments[1];
        //      sy = arguments[2];
        //      sw = arguments[3];
        //      sh = arguments[4];
        //      dx = arguments[5];
        //      dy = arguments[6];
        //      dw = arguments[7];
        //      dh = arguments[8];
        //    } else {
        //      throw Error('Invalid number of arguments');
        //    }

        //    var d = getCoords(this, dx, dy);

        //    var w2 = sw / 2;
        //    var h2 = sh / 2;

        //    var vmlStr = [];

        //    var W = 10;
        //    var H = 10;

        //    // For some reason that I've now forgotten, using divs didn't work
        //    vmlStr.push(' <g_vml_:group',
        //                ' coordsize="', Z * W, ',', Z * H, '"',
        //                ' coordorigin="0,0"' ,
        //                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

        //    // If filters are necessary (rotation exists), create them
        //    // filters are bog-slow, so only create them if abbsolutely necessary
        //    // The following check doesn't account for skews (which don't exist
        //    // in the canvas spec (yet) anyway.

        //    if (this.m_[0][0] != 1 || this.m_[0][1] ||
        //        this.m_[1][1] != 1 || this.m_[1][0]) {
        //      var filter = [];

        //      // Note the 12/21 reversal
        //      filter.push('M11=', this.m_[0][0], ',',
        //                  'M12=', this.m_[1][0], ',',
        //                  'M21=', this.m_[0][1], ',',
        //                  'M22=', this.m_[1][1], ',',
        //                  'Dx=', mr(d.x / Z), ',',
        //                  'Dy=', mr(d.y / Z), '');

        //      // Bounding box calculation (need to minimize displayed area so that
        //      // filters don't waste time on unused pixels.
        //      var max = d;
        //      var c2 = getCoords(this, dx + dw, dy);
        //      var c3 = getCoords(this, dx, dy + dh);
        //      var c4 = getCoords(this, dx + dw, dy + dh);

        //      max.x = m.max(max.x, c2.x, c3.x, c4.x);
        //      max.y = m.max(max.y, c2.y, c3.y, c4.y);

        //      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
        //                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
        //                  filter.join(''), ", sizingmethod='clip');");

        //    } else {
        //      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
        //    }

        //    vmlStr.push(' ">' ,
        //                '<g_vml_:image src="', image.src, '"',
        //                ' style="width:', Z * dw, 'px;',
        //                ' height:', Z * dh, 'px"',
        //                ' cropleft="', sx / w, '"',
        //                ' croptop="', sy / h, '"',
        //                ' cropright="', (w - sx - sw) / w, '"',
        //                ' cropbottom="', (h - sy - sh) / h, '"',
        //                ' />',
        //                '</g_vml_:group>');

        //    this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
        //  };

        contextPrototype.stroke = function (aFill) {
            var lineStr = [];
            var lineOpen = false;

            var W = 10;
            var H = 10;

            lineStr.push('<g_vml_:shape',
                       ' filled="', !!aFill, '"',
                       ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                       ' coordorigin="0,0"',
                       ' coordsize="', Z * W, ',', Z * H, '"',
                       ' stroked="', !aFill, '"',
                       ' path="');

            var newSeq = false;
            var min = { x: null, y: null };
            var max = { x: null, y: null };

            for (var i = 0; i < this.currentPath_.length; i++) {
                var p = this.currentPath_[i];
                var c;

                switch (p.type) {
                    case 'moveTo':
                        c = p;
                        lineStr.push(' m ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'lineTo':
                        lineStr.push(' l ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'close':
                        lineStr.push(' x ');
                        p = null;
                        break;
                    case 'bezierCurveTo':
                        lineStr.push(' c ',
                                   mr(p.cp1x), ',', mr(p.cp1y), ',',
                                   mr(p.cp2x), ',', mr(p.cp2y), ',',
                                   mr(p.x), ',', mr(p.y));
                        break;
                    case 'at':
                    case 'wa':
                        lineStr.push(' ', p.type, ' ',
                                   mr(p.x - this.arcScaleX_ * p.radius), ',',
                                   mr(p.y - this.arcScaleY_ * p.radius), ' ',
                                   mr(p.x + this.arcScaleX_ * p.radius), ',',
                                   mr(p.y + this.arcScaleY_ * p.radius), ' ',
                                   mr(p.xStart), ',', mr(p.yStart), ' ',
                                   mr(p.xEnd), ',', mr(p.yEnd));
                        break;
                }


                // TODO: Following is broken for curves due to
                //       move to proper paths.

                // Figure out dimensions so we can do gradient fills
                // properly
                if (p) {
                    if (min.x == null || p.x < min.x) {
                        min.x = p.x;
                    }
                    if (max.x == null || p.x > max.x) {
                        max.x = p.x;
                    }
                    if (min.y == null || p.y < min.y) {
                        min.y = p.y;
                    }
                    if (max.y == null || p.y > max.y) {
                        max.y = p.y;
                    }
                }
            }
            lineStr.push(' ">');

            if (!aFill) {
                appendStroke(this, lineStr);
            } else {
                appendFill(this, lineStr, min, max);
            }

            lineStr.push('</g_vml_:shape>');

            this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
        };

        function appendStroke(ctx, lineStr) {
            var a = processStyle(ctx.strokeStyle);
            var color = a.color;
            var opacity = a.alpha * ctx.globalAlpha;
            var lineWidth = ctx.lineScale_ * ctx.lineWidth;

            // VML cannot correctly render a line if the width is less than 1px.
            // In that case, we dilute the color to make the line look thinner.
            if (lineWidth < 1) {
                opacity *= lineWidth;
            }

            lineStr.push(
            '<g_vml_:stroke',
            ' opacity="', opacity, '"',
            ' joinstyle="', ctx.lineJoin, '"',
            ' miterlimit="', ctx.miterLimit, '"',
            ' endcap="', processLineCap(ctx.lineCap), '"',
            ' weight="', lineWidth, 'px"',
            ' color="', color, '" />'
          );
        }

        function appendFill(ctx, lineStr, min, max) {
            var fillStyle = ctx.fillStyle;
            var arcScaleX = ctx.arcScaleX_;
            var arcScaleY = ctx.arcScaleY_;
            var width = max.x - min.x;
            var height = max.y - min.y;
            //    if (fillStyle instanceof CanvasGradient_) {
            //      // TODO: Gradients transformed with the transformation matrix.
            //      var angle = 0;
            //      var focus = {x: 0, y: 0};

            //      // additional offset
            //      var shift = 0;
            //      // scale factor for offset
            //      var expansion = 1;

            //      if (fillStyle.type_ == 'gradient') {
            //        var x0 = fillStyle.x0_ / arcScaleX;
            //        var y0 = fillStyle.y0_ / arcScaleY;
            //        var x1 = fillStyle.x1_ / arcScaleX;
            //        var y1 = fillStyle.y1_ / arcScaleY;
            //        var p0 = getCoords(ctx, x0, y0);
            //        var p1 = getCoords(ctx, x1, y1);
            //        var dx = p1.x - p0.x;
            //        var dy = p1.y - p0.y;
            //        angle = Math.atan2(dx, dy) * 180 / Math.PI;

            //        // The angle should be a non-negative number.
            //        if (angle < 0) {
            //          angle += 360;
            //        }

            //        // Very small angles produce an unexpected result because they are
            //        // converted to a scientific notation string.
            //        if (angle < 1e-6) {
            //          angle = 0;
            //        }
            //      } else {
            //        var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
            //        focus = {
            //          x: (p0.x - min.x) / width,
            //          y: (p0.y - min.y) / height
            //        };

            //        width  /= arcScaleX * Z;
            //        height /= arcScaleY * Z;
            //        var dimension = m.max(width, height);
            //        shift = 2 * fillStyle.r0_ / dimension;
            //        expansion = 2 * fillStyle.r1_ / dimension - shift;
            //      }

            //      // We need to sort the color stops in ascending order by offset,
            //      // otherwise IE won't interpret it correctly.
            //      var stops = fillStyle.colors_;
            //      stops.sort(function(cs1, cs2) {
            //        return cs1.offset - cs2.offset;
            //      });

            //      var length = stops.length;
            //      var color1 = stops[0].color;
            //      var color2 = stops[length - 1].color;
            //      var opacity1 = stops[0].alpha * ctx.globalAlpha;
            //      var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;

            //      var colors = [];
            //      for (var i = 0; i < length; i++) {
            //        var stop = stops[i];
            //        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
            //      }

            //      // When colors attribute is used, the meanings of opacity and o:opacity2
            //      // are reversed.
            //      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
            //                   ' method="none" focus="100%"',
            //                   ' color="', color1, '"',
            //                   ' color2="', color2, '"',
            //                   ' colors="', colors.join(','), '"',
            //                   ' opacity="', opacity2, '"',
            //                   ' g_o_:opacity2="', opacity1, '"',
            //                   ' angle="', angle, '"',
            //                   ' focusposition="', focus.x, ',', focus.y, '" />');
            //    } else if (fillStyle instanceof CanvasPattern_) {
            //      if (width && height) {
            //        var deltaLeft = -min.x;
            //        var deltaTop = -min.y;
            //        lineStr.push('<g_vml_:fill',
            //                     ' position="',
            //                     deltaLeft / width * arcScaleX * arcScaleX, ',',
            //                     deltaTop / height * arcScaleY * arcScaleY, '"',
            //                     ' type="tile"',
            //                     // TODO: Figure out the correct size to fit the scale.
            //                     //' size="', w, 'px ', h, 'px"',
            //                     ' src="', fillStyle.src_, '" />');
            //       }
            //    } else {
            var a = processStyle(ctx.fillStyle);
            var color = a.color;
            var opacity = a.alpha * ctx.globalAlpha;
            lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                         '" />');
            //     }
        }

        contextPrototype.fill = function () {
            this.stroke(true);
        };

        contextPrototype.closePath = function () {
            this.currentPath_.push({ type: 'close' });
        };

        function getCoords(ctx, aX, aY) {
            var m = ctx.m_;
            return {
                x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
                y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
            };
        };

        contextPrototype.save = function () {
            var o = {};
            copyState(this, o);
            this.aStack_.push(o);
            this.mStack_.push(this.m_);
            this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
        };

        contextPrototype.restore = function () {
            if (this.aStack_.length) {
                copyState(this.aStack_.pop(), this);
                this.m_ = this.mStack_.pop();
            }
        };

        function matrixIsFinite(m) {
            return isFinite(m[0][0]) && isFinite(m[0][1]) &&
              isFinite(m[1][0]) && isFinite(m[1][1]) &&
              isFinite(m[2][0]) && isFinite(m[2][1]);
        }

        function setM(ctx, m, updateLineScale) {
            if (!matrixIsFinite(m)) {
                return;
            }
            ctx.m_ = m;

            if (updateLineScale) {
                // Get the line scale.
                // Determinant of this.m_ means how much the area is enlarged by the
                // transformation. So its square root can be used as a scale factor
                // for width.
                var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
                ctx.lineScale_ = sqrt(abs(det));
            }
        }

        contextPrototype.translate = function (aX, aY) {
            var m1 = [
            [1, 0, 0],
            [0, 1, 0],
            [aX, aY, 1]
            ];

            setM(this, matrixMultiply(m1, this.m_), false);
        };

        //  contextPrototype.rotate = function(aRot) {
        //    var c = mc(aRot);
        //    var s = ms(aRot);

        //    var m1 = [
        //      [c,  s, 0],
        //      [-s, c, 0],
        //      [0,  0, 1]
        //    ];

        //    setM(this, matrixMultiply(m1, this.m_), false);
        //  };

        contextPrototype.scale = function (aX, aY) {
            this.arcScaleX_ *= aX;
            this.arcScaleY_ *= aY;
            var m1 = [
            [aX, 0, 0],
            [0, aY, 0],
            [0, 0, 1]
            ];

            setM(this, matrixMultiply(m1, this.m_), true);
        };

        //  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
        //    var m1 = [
        //      [m11, m12, 0],
        //      [m21, m22, 0],
        //      [dx,  dy,  1]
        //    ];

        //    setM(this, matrixMultiply(m1, this.m_), true);
        //  };

        //  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
        //    var m = [
        //      [m11, m12, 0],
        //      [m21, m22, 0],
        //      [dx,  dy,  1]
        //    ];

        //    setM(this, m, true);
        //  };

        /**
        * The text drawing function.
        * The maxWidth argument isn't taken in account, since no browser supports
        * it yet.
        */
        //  contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
        //    var m = this.m_,
        //        delta = 1000,
        //        left = 0,
        //        right = delta,
        //        offset = {x: 0, y: 0},
        //        lineStr = [];

        //    var fontStyle = getComputedStyle(processFontStyle(this.font),
        //                                     this.element_);

        //    var fontStyleString = buildStyle(fontStyle);

        //    var elementStyle = this.element_.currentStyle;
        //    var textAlign = this.textAlign.toLowerCase();
        //    switch (textAlign) {
        //      case 'left':
        //      case 'center':
        //      case 'right':
        //        break;
        //      case 'end':
        //        textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
        //        break;
        //      case 'start':
        //        textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
        //        break;
        //      default:
        //        textAlign = 'left';
        //    }

        //    // 1.75 is an arbitrary number, as there is no info about the text baseline
        //    switch (this.textBaseline) {
        //      case 'hanging':
        //      case 'top':
        //        offset.y = fontStyle.size / 1.75;
        //        break;
        //      case 'middle':
        //        break;
        //      default:
        //      case null:
        //      case 'alphabetic':
        //      case 'ideographic':
        //      case 'bottom':
        //        offset.y = -fontStyle.size / 2.25;
        //        break;
        //    }

        //    switch(textAlign) {
        //      case 'right':
        //        left = delta;
        //        right = 0.05;
        //        break;
        //      case 'center':
        //        left = right = delta / 2;
        //        break;
        //    }

        //    var d = getCoords(this, x + offset.x, y + offset.y);

        //    lineStr.push('<g_vml_:line from="', -left ,' 0" to="', right ,' 0.05" ',
        //                 ' coordsize="100 100" coordorigin="0 0"',
        //                 ' filled="', !stroke, '" stroked="', !!stroke,
        //                 '" style="position:absolute;width:1px;height:1px;">');

        //    if (stroke) {
        //      appendStroke(this, lineStr);
        //    } else {
        //      // TODO: Fix the min and max params.
        //      appendFill(this, lineStr, {x: -left, y: 0},
        //                 {x: right, y: fontStyle.size});
        //    }

        //    var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' +
        //                m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';

        //    var skewOffset = mr(d.x / Z) + ',' + mr(d.y / Z);

        //    lineStr.push('<g_vml_:skew on="t" matrix="', skewM ,'" ',
        //                 ' offset="', skewOffset, '" origin="', left ,' 0" />',
        //                 '<g_vml_:path textpathok="true" />',
        //                 '<g_vml_:textpath on="true" string="',
        //                 encodeHtmlAttribute(text),
        //                 '" style="v-text-align:', textAlign,
        //                 ';font:', encodeHtmlAttribute(fontStyleString),
        //                 '" /></g_vml_:line>');

        //    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
        //  };

        //  contextPrototype.fillText = function(text, x, y, maxWidth) {
        //    this.drawText_(text, x, y, maxWidth, false);
        //  };

        //  contextPrototype.strokeText = function(text, x, y, maxWidth) {
        //    this.drawText_(text, x, y, maxWidth, true);
        //  };

        //  contextPrototype.measureText = function(text) {
        //    if (!this.textMeasureEl_) {
        //      var s = '<span style="position:absolute;' +
        //          'top:-20000px;left:0;padding:0;margin:0;border:none;' +
        //          'white-space:pre;"></span>';
        //      this.element_.insertAdjacentHTML('beforeEnd', s);
        //      this.textMeasureEl_ = this.element_.lastChild;
        //    }
        //    var doc = this.element_.ownerDocument;
        //    this.textMeasureEl_.innerHTML = '';
        //    this.textMeasureEl_.style.font = this.font;
        //    // Don't use innerHTML or innerText because they allow markup/whitespace.
        //    this.textMeasureEl_.appendChild(doc.createTextNode(text));
        //    return {width: this.textMeasureEl_.offsetWidth};
        //  };

        /******** STUBS ********/
        //  contextPrototype.clip = function() {
        //    // TODO: Implement
        //  };

        //  contextPrototype.arcTo = function() {
        //    // TODO: Implement
        //  };

        //  contextPrototype.createPattern = function(image, repetition) {
        //    return new CanvasPattern_(image, repetition);
        //  };

        //  // Gradient / Pattern Stubs
        //  function CanvasGradient_(aType) {
        //    this.type_ = aType;
        //    this.x0_ = 0;
        //    this.y0_ = 0;
        //    this.r0_ = 0;
        //    this.x1_ = 0;
        //    this.y1_ = 0;
        //    this.r1_ = 0;
        //    this.colors_ = [];
        //  }

        //  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
        //    aColor = processStyle(aColor);
        //    this.colors_.push({offset: aOffset,
        //                       color: aColor.color,
        //                       alpha: aColor.alpha});
        //  };

        //  function CanvasPattern_(image, repetition) {
        //    assertImageIsValid(image);
        //    switch (repetition) {
        //      case 'repeat':
        //      case null:
        //      case '':
        //        this.repetition_ = 'repeat';
        //        break
        //      case 'repeat-x':
        //      case 'repeat-y':
        //      case 'no-repeat':
        //        this.repetition_ = repetition;
        //        break;
        //      default:
        //        throwException('SYNTAX_ERR');
        //    }

        //    this.src_ = image.src;
        //    this.width_ = image.width;
        //    this.height_ = image.height;
        //  }

        function throwException(s) {
            throw new DOMException_(s);
        }

        //  function assertImageIsValid(img) {
        //    if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
        //      throwException('TYPE_MISMATCH_ERR');
        //    }
        //    if (img.readyState != 'complete') {
        //      throwException('INVALID_STATE_ERR');
        //    }
        //  }

        function DOMException_(s) {
            this.code = this[s];
            this.message = s + ': DOM Exception ' + this.code;
        }
        var p = DOMException_.prototype = new Error;
        p.INDEX_SIZE_ERR = 1;
        p.DOMSTRING_SIZE_ERR = 2;
        p.HIERARCHY_REQUEST_ERR = 3;
        p.WRONG_DOCUMENT_ERR = 4;
        p.INVALID_CHARACTER_ERR = 5;
        p.NO_DATA_ALLOWED_ERR = 6;
        p.NO_MODIFICATION_ALLOWED_ERR = 7;
        p.NOT_FOUND_ERR = 8;
        p.NOT_SUPPORTED_ERR = 9;
        p.INUSE_ATTRIBUTE_ERR = 10;
        p.INVALID_STATE_ERR = 11;
        p.SYNTAX_ERR = 12;
        p.INVALID_MODIFICATION_ERR = 13;
        p.NAMESPACE_ERR = 14;
        p.INVALID_ACCESS_ERR = 15;
        p.VALIDATION_ERR = 16;
        p.TYPE_MISMATCH_ERR = 17;

        // set up externs
        G_vmlCanvasManager = G_vmlCanvasManager_;
        CanvasRenderingContext2D = CanvasRenderingContext2D_;
        //CanvasGradient = CanvasGradient_;
        //CanvasPattern = CanvasPattern_;
        DOMException = DOMException_;
    })();

} // if

/*! JsRender v1.0pre: http://github.com/BorisMoore/jsrender */
/*
 * Optimized version of jQuery Templates, for rendering to string.
 * Does not require jQuery, or HTML DOM
 * Integrates with JsViews (http://github.com/BorisMoore/jsviews)
 * Copyright 2012, Boris Moore
 * Released under the MIT License.
 */
// informal pre beta commit counter: 3

this.jsviews || this.jQuery && jQuery.views || (function (window, undefined) {

    //========================== Top-level vars ==========================

    var versionNumber = "v1.0pre",

        $, rTag, rTmplString, extend,
        sub = {},
        FALSE = false, TRUE = true,
        jQuery = window.jQuery,

        rPath = /^(?:null|true|false|\d[\d.]*|([\w$]+|~([\w$]+)|#(view|([\w$]+))?)([\w$.]*?)(?:[.[]([\w$]+)\]?)?|(['"]).*\8)$/g,
        //                                 nil    object   helper    view  viewProperty pathTokens   leafToken     string

        rParams = /(\()(?=|\s*\()|(?:([([])\s*)?(?:([#~]?[\w$.]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*([)\]])([([]?))|(\s+)/g,
        //          lftPrn        lftPrn2                path    operator err                                                eq         path2       prn    comma   lftPrn2   apos quot        rtPrn   prn2   space
        // (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space

        rNewLine = /\r?\n/g,
        rUnescapeQuotes = /\\(['"])/g,
        rEscapeQuotes = /\\?(['"])/g,
        rBuildHash = /\x08(~)?([^\x08]+)\x08/g,

        autoViewKey = 0,
        autoTmplName = 0,
        escapeMapForHtml = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;"
        },
        tmplAttr = "data-jsv-tmpl",
        fnDeclStr = "var j=j||" + (jQuery ? "jQuery." : "js") + "views,",
        htmlSpecialChar = /[\x00"&'<>]/g,
        slice = Array.prototype.slice,

        render = {},

        // jsviews object ($.views if jQuery is loaded)
        jsv = {
            jsviews: versionNumber,
            sub: sub, // subscription, e.g. JsViews integration
            debugMode: TRUE,
            err: function (e) {
                return jsv.debugMode ? ("<br/><b>Error:</b> <em> " + (e.message || e) + ". </em>") : '""';
            },
            tmplFn: tmplFn,
            render: render,
            templates: templates,
            tags: tags,
            helpers: helpers,
            converters: converters,
            View: View,
            convert: convert,
            delimiters: setDelimiters,
            tag: renderTag
        };

    //========================== Top-level functions ==========================

    //===================
    // jsviews.delimiters
    //===================

    function setDelimiters(openChars, closeChars) {
        // Set the tag opening and closing delimiters. Default is "{{" and "}}"
        // openChar, closeChars: opening and closing strings, each with two characters
        var firstOpenChar = "\\" + openChars.charAt(0), // Escape the characters - since they could be regex special characters
            secondOpenChar = "\\" + openChars.charAt(1),
            firstCloseChar = "\\" + closeChars.charAt(0),
            secondCloseChar = "\\" + closeChars.charAt(1);
        // Build regex with new delimiters
        jsv.rTag = rTag // make rTag available to JsViews (or other components) for parsing binding expressions
            = secondOpenChar
                //          tag    (followed by / space or })   or  colon     or  html or code
            + "(?:(?:(\\w+(?=[\\/\\s" + firstCloseChar + "]))|(?:(\\w+)?(:)|(>)|(\\*)))"
            //     params
            + "\\s*((?:[^" + firstCloseChar + "]|" + firstCloseChar + "(?!" + secondCloseChar + "))*?)"
            //  slash or closeBlock
            + "(\\/)?|(?:\\/(\\w+)))"
        //  }}
        + firstCloseChar;

        // Default rTag:    tag          converter colon  html  code     params         slash   closeBlock
        //	    /{{(?:(?:(\w+(?=[\/\s\}]))|(?:(\w+)?(:)|(>)|(\*)))\s*((?:[^}]|}(?!\}))*?)(\/)?|(?:\/(\w+)))}}

        //      /{{(?:(?:(\w+(?=[\/!\s\}!]))|(?:(\w+)?(:)|(>)|(\*)))((?:[^\}]|}(?!}))*?)(\/)?|(?:\/(\w+)))}}/g;
        rTag = new RegExp(firstOpenChar + rTag + secondCloseChar, "g");
        rTmplString = new RegExp("<.*>|" + openChars + ".*" + closeChars);
        return this;
    }

    //=================
    // View.hlp
    //=================

    function getHelper(helper) {
        // Helper method called as view.hlp() from compiled template, for helper functions or template parameters ~foo
        var view = this,
        tmplHelpers = view.tmpl.helpers || {};
        helper = (view.ctx[helper] !== undefined ? view.ctx : tmplHelpers[helper] !== undefined ? tmplHelpers : helpers[helper] !== undefined ? helpers : {})[helper];
        return typeof helper !== "function" ? helper : function () {
            return helper.apply(view, arguments);
        };
    }

    //=================
    // jsviews.convert
    //=================

    function convert(converter, view, text) {
        var tmplConverters = view.tmpl.converters;
        converter = tmplConverters && tmplConverters[converter] || converters[converter];
        return converter ? converter.call(view, text) : text;
    }

    //=================
    // jsviews.tag
    //=================

    function renderTag(tag, parentView, converter, content, tagObject) {
        // Called from within compiled template function, to render a nested tag
        // Returns the rendered tag
        tagObject.props = tagObject.props || {};
        var ret,
            tmpl = tagObject.props.tmpl,
            tmplTags = parentView.tmpl.tags,
            nestedTemplates = parentView.tmpl.templates,
            args = arguments,
            tagFn = tmplTags && tmplTags[tag] || tags[tag];

        if (!tagFn) {
            return "";
        }
        // Set the tmpl property to the content of the block tag, unless set as an override property on the tag
        content = content && parentView.tmpl.tmpls[content - 1];
        tmpl = tmpl || content || undefined;
        tagObject.tmpl =
            "" + tmpl === tmpl // if a string
                ? nestedTemplates && nestedTemplates[tmpl] || templates[tmpl] || templates(tmpl)
                : tmpl;

        tagObject.isTag = TRUE;
        tagObject.converter = converter;
        tagObject.view = parentView;
        tagObject.renderContent = renderContent;
        if (parentView.ctx) {
            extend(tagObject.ctx, parentView.ctx);
        }

        ret = tagFn.apply(tagObject, args.length > 5 ? slice.call(args, 5) : []);
        return ret || (ret == undefined ? "" : ret.toString()); // (If ret is the value 0 or false, will render to string)
    }

    //=================
    // View constructor
    //=================

    function View(context, path, parentView, data, template, index) {
        // Constructor for view object in view hierarchy. (Augmented by JsViews if JsViews is loaded)
        var views = parentView.views,
    //	TODO: add this, as part of smart re-linking on existing content ($.link method), or remove completely
    //			self = parentView.views[ index ];
    //			if ( !self ) { ... }
            self = {
                tmpl: template,
                path: path,
                parent: parentView,
                data: data,
                ctx: context,
                views: $.isArray(data) ? [] : {},
                hlp: getHelper
            };

        if ($.isArray(views)) {
            views.splice(
                self.index = index !== undefined
                    ? index
                    : views.length, 0, self
            );
        } else {
            views[self.index = "_" + autoViewKey++] = self;
        }
        return self;
    }

    //=================
    // Registration
    //=================

    function addToStore(self, store, name, item, process) {
        // Add item to named store such as templates, helpers, converters...
        var key, onStore;
        if (name && typeof name === "object" && !name.nodeType) {
            // If name is a map, iterate over map and call store for key
            for (key in name) {
                store(key, name[key]);
            }
            return self;
        }
        if (!name || item === undefined) {
            if (process) {
                item = process(undefined, item || name);
            }
        } else if ("" + name === name) { // name must be a string
            if (item === null) {
                // If item is null, delete this entry
                delete store[name];
            } else if (item = process ? process(name, item) : item) {
                store[name] = item;
            }
        }
        if (onStore = sub.onStoreItem) {
            // e.g. JsViews integration
            onStore(store, name, item, process);
        }
        return item;
    }

    function templates(name, tmpl) {
        // Register templates
        // Setter: Use $.view.tags( name, tagFn ) or $.view.tags({ name: tagFn, ... }) to add additional tags to the registered tags collection.
        // Getter: Use var tagFn = $.views.tags( name ) or $.views.tags[name] or $.views.tags.name to return the function for the registered tag.
        // Remove: Use $.view.tags( name, null ) to remove a registered tag from $.view.tags.

        // When registering for {{foo a b c==d e=f}}, tagFn should be a function with the signature:
        // function(a,b). The 'this' pointer will be a hash with properties c and e.
        return addToStore(this, templates, name, tmpl, compile);
    }

    function tags(name, tagFn) {
        // Register template tags
        // Setter: Use $.view.tags( name, tagFn ) or $.view.tags({ name: tagFn, ... }) to add additional tags to the registered tags collection.
        // Getter: Use var tagFn = $.views.tags( name ) or $.views.tags[name] or $.views.tags.name to return the function for the registered tag.
        // Remove: Use $.view.tags( name, null ) to remove a registered tag from $.view.tags.

        // When registering for {{foo a b c==d e=f}}, tagFn should be a function with the signature:
        // function(a,b). The 'this' pointer will be a hash with properties c and e.
        return addToStore(this, tags, name, tagFn);
    }

    function helpers(name, helperFn) {
        // Register helper functions for use in templates (or in data-link expressions if JsViews is loaded)
        // Setter: Use $.view.helpers( name, helperFn ) or $.view.helpers({ name: helperFn, ... }) to add additional helpers to the registered helpers collection.
        // Getter: Use var helperFn = $.views.helpers( name ) or $.views.helpers[name] or $.views.helpers.name to return the function.
        // Remove: Use $.view.helpers( name, null ) to remove a registered helper function from $.view.helpers.
        // Within a template, access the helper using the syntax: {{... ~myHelper(...) ...}}.
        return addToStore(this, helpers, name, helperFn);
    }

    function converters(name, converterFn) {
        // Register converter functions for use in templates (or in data-link expressions if JsViews is loaded)
        // Setter: Use $.view.converters( name, converterFn ) or $.view.converters({ name: converterFn, ... }) to add additional converters to the registered converters collection.
        // Getter: Use var converterFn = $.views.converters( name ) or $.views.converters[name] or $.views.converters.name to return the converter function.
        // Remove: Use $.view.converters( name, null ) to remove a registered converter from $.view.converters.
        // Within a template, access the converter using the syntax: {{myConverter:...}}.
        return addToStore(this, converters, name, converterFn);
    }

    //=================
    // renderContent
    //=================

    function renderContent(data, context, parentView, path, index) {
        // Render template against data as a tree of subviews (nested template), or as a string (top-level template).
        // tagName parameter for internal use only. Used for rendering templates registered as tags (which may have associated presenter objects)
        var i, l, dataItem, newView, itemWrap, itemsWrap, itemResult, parentContext, tmpl, layout,
            props = {},
            swapContent = index === TRUE,
            self = this,
            result = "";

        if (self.isTag) {
            // This is a call from renderTag
            tmpl = self.tmpl;
            context = context || self.ctx;
            parentView = parentView || self.view;
            path = path || self.path;
            index = index || self.index;
            props = self.props;
        } else {
            tmpl = self.jquery && self[0] // This is a call $.fn.render
                || self; // This is a call from tmpl.render
        }
        parentView = parentView || jsv.topView;
        parentContext = parentView.ctx;
        layout = tmpl.layout;
        if (data === parentView) {
            // Inherit the data from the parent view.
            // This may be the contents of an {{if}} block
            data = parentView.data;
            layout = TRUE;
        }

        // Set additional context on views created here, (as modified context inherited from the parent, and be inherited by child views)
        // Note: If no jQuery, extend does not support chained copies - so limit extend() to two parameters
        context = (context && context === parentContext)
            ? parentContext
            : (parentContext
                // if parentContext, make copy
                ? ((parentContext = extend({}, parentContext), context)
                    // If context, merge context with copied parentContext
                    ? extend(parentContext, context)
                    : parentContext)
                // if no parentContext, use context, or default to {}
                : context || {});

        if (props.link === FALSE) {
            // Override inherited value of link by an explicit setting in props: link=false
            // The child views of an unlinked view are also unlinked. So setting child back to true will not have any effect.
            context.link = FALSE;
        }
        if (!tmpl.fn) {
            tmpl = templates[tmpl] || templates(tmpl);
        }
        itemWrap = context.link && sub.onRenderItem;
        itemsWrap = context.link && sub.onRenderItems;

        if (tmpl) {
            if ($.isArray(data) && !layout) {
                // Create a view for the array, whose child views correspond to each data item.
                // (Note: if index and parentView are passed in along with parent view, treat as
                // insert -e.g. from view.addViews - so parentView is already the view item for array)
                newView = swapContent ? parentView : (index !== undefined && parentView) || View(context, path, parentView, data, tmpl, index);

                for (i = 0, l = data.length; i < l; i++) {
                    // Create a view for each data item.
                    dataItem = data[i];
                    itemResult = tmpl.fn(dataItem, View(context, path, newView, dataItem, tmpl, (index || 0) + i), jsv);
                    result += itemWrap ? itemWrap(itemResult, props) : itemResult;
                }
            } else {
                // Create a view for singleton data object.
                newView = swapContent ? parentView : View(context, path, parentView, data, tmpl, index);
                result += (data || layout) ? tmpl.fn(data, newView, jsv) : "";
            }
            parentView.topKey = newView.index;
            return itemsWrap ? itemsWrap(result, path, newView.index, tmpl, props) : result;
        }
        return ""; // No tmpl. Could throw...
    }

    //===========================
    // Build and compile template
    //===========================

    // Generate a reusable function that will serve to render a template against data
    // (Compile AST then build template function)

    function syntaxError() {
        throw "Syntax error";
    }

    function tmplFn(markup, tmpl, bind) {
        // Compile markup to AST (abtract syntax tree) then build the template function code from the AST nodes
        // Used for compiling templates, and also by JsViews to build functions for data link expressions
        var newNode, node, i, l, code, hasTag, hasEncoder, getsValue, hasConverter, hasViewPath, tag, converter, params, hash, nestedTmpl, allowCode,
            tmplOptions = tmpl ? {
                allowCode: allowCode = tmpl.allowCode,
                debug: tmpl.debug
            } : {},
            nested = tmpl && tmpl.tmpls,
            astTop = [],
            loc = 0,
            stack = [],
            content = astTop,
            current = [, , , astTop],
            nestedIndex = 0;

        //==== nested functions ====
        function pushPreceedingContent(shift) {
            shift -= loc;
            if (shift) {
                content.push(markup.substr(loc, shift).replace(rNewLine, "\\n"));
            }
        }

        function parseTag(all, tagName, converter, colon, html, code, params, slash, closeBlock, index) {
            //                  tag           converter colon  html  code     params         slash   closeBlock
            //      /{{(?:(?:(\w+(?=[\/!\s\}!]))|(?:(\w+)?(:)|(?:(>)|(\*)))((?:[^\}]|}(?!}))*?)(\/)?|(?:\/(\w+)))}}/g;
            // Build abstract syntax tree (AST): [ tagName, converter, params, content, hash, contentMarkup ]
            if (html) {
                colon = ":";
                converter = "html";
            }
            var hash = "",
                passedCtx = "",
                block = !slash && !colon; // Block tag if not self-closing and not {{:}} or {{>}} (special case)

            //==== nested helper function ====

            tagName = tagName || colon;
            pushPreceedingContent(index);
            loc = index + all.length; // location marker - parsed up to here
            if (code) {
                if (allowCode) {
                    content.push(["*", params.replace(rUnescapeQuotes, "$1")]);
                }
            } else if (tagName) {
                if (tagName === "else") {
                    current[5] = markup.substring(current[5], index); // contentMarkup for block tag
                    current = stack.pop();
                    content = current[3];
                    block = TRUE;
                }
                params = (params
                    ? parseParams(params, bind)
                        .replace(rBuildHash, function (all, isCtx, keyValue) {
                            if (isCtx) {
                                passedCtx += keyValue + ",";
                            } else {
                                hash += keyValue + ",";
                            }
                            return "";
                        })
                    : "");
                hash = hash.slice(0, -1);
                params = params.slice(0, -1);
                newNode = [
                    tagName,
                    converter || "",
                    params,
                    block && [],
                    "{" + (hash ? ("props:{" + hash + "},") : "") + "path:'" + params + "'" + (passedCtx ? ",ctx:{" + passedCtx.slice(0, -1) + "}" : "") + "}"
                ];
                if (block) {
                    stack.push(current);
                    current = newNode;
                    current[5] = loc; // Store current location of open tag, to be able to add contentMarkup when we reach closing tag
                }
                content.push(newNode);
            } else if (closeBlock) {
                //if ( closeBlock !== current[ 0 ]) {
                //	throw "unmatched close tag: /" + closeBlock + ". Expected /" + current[ 0 ];
                //}
                current[5] = markup.substring(current[5], index); // contentMarkup for block tag
                current = stack.pop();
            }
            if (!current) {
                throw "Expected block tag";
            }
            content = current[3];
        }
        //==== /end of nested functions ====

        markup = markup.replace(rEscapeQuotes, "\\$1");

        // Build the AST (abstract syntax tree) under astTop
        markup.replace(rTag, parseTag);

        pushPreceedingContent(markup.length);

        // Use the AST (astTop) to build the template function
        l = astTop.length;
        code = (l ? "" : '"";');

        for (i = 0; i < l; i++) {
            // AST nodes: [ tagName, converter, params, content, hash, contentMarkup ]
            node = astTop[i];
            if (node[0] === "*") {
                code = code.slice(0, i ? -1 : -3) + ";" + node[1] + (i + 1 < l ? "ret+=" : "");
            } else if ("" + node === node) { // type string
                code += '"' + node + '"+';
            } else {
                tag = node[0];
                converter = node[1];
                params = node[2];
                content = node[3];
                hash = node[4];
                markup = node[5];
                if (content) {
                    // Create template object for nested template
                    nestedTmpl = TmplObject(markup, tmplOptions, tmpl, nestedIndex++);
                    // Compile to AST and then to compiled function
                    tmplFn(markup, nestedTmpl);
                    nested.push(nestedTmpl);
                }
                hasViewPath = hasViewPath || hash.indexOf("view") > -1;
                code += (tag === ":"
                    ? (converter === "html"
                        ? (hasEncoder = TRUE, "e(" + params)
                        : converter
                            ? (hasConverter = TRUE, 'c("' + converter + '",view,' + params)
                            : (getsValue = TRUE, "((v=" + params + ')!=u?v:""')
                    )
                    : (hasTag = TRUE, 't("' + tag + '",view,"' + (converter || "") + '",'
                        + (content ? nested.length : '""') // For block tags, pass in the key (nested.length) to the nested content template
                        + "," + hash + (params ? "," : "") + params))
                        + ")+";
            }
        }
        code = new Function("data, view, j, b, u", fnDeclStr
            + (getsValue ? "v," : "")
            + (hasTag ? "t=j.tag," : "")
            + (hasConverter ? "c=j.convert," : "")
            + (hasEncoder ? "e=j.converters.html," : "")
            + "ret; try{\n\n"
            + (tmplOptions.debug ? "debugger;" : "")
            + (allowCode ? 'ret=' : 'return ')
            + code.slice(0, -1) + ";\n\n"
            + (allowCode ? "return ret;" : "")
            + "}catch(e){return j.err(e);}"
        );

        // Include only the var references that are needed in the code
        if (tmpl) {
            tmpl.fn = code;
            tmpl.useVw = hasConverter || hasViewPath || hasTag;
        }
        return code;
    }

    function parseParams(params, bind) {
        var named,
            fnCall = {},
            parenDepth = 0,
            quoted = FALSE, // boolean for string content in double quotes
            aposed = FALSE; // or in single quotes

        function parseTokens(all, lftPrn0, lftPrn, path, operator, err, eq, path2, prn, comma, lftPrn2, apos, quot, rtPrn, prn2, space) {
            // rParams = /(?:([([])\s*)?(?:([#~]?[\w$.]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*([)\]])([([]?))|(\s+)/g,
            //            lftPrn                  path    operator err                                                eq         path2       prn    comma   lftPrn3   apos quot        rtPrn   prn2   space
            // (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space
            operator = operator || "";
            lftPrn = lftPrn || lftPrn0 || lftPrn2;
            path = path || path2;
            prn = prn || prn2 || "";
            operator = operator || "";

            function parsePath(all, object, helper, view, viewProperty, pathTokens, leafToken) {
                // rPath = /^(?:null|true|false|\d[\d.]*|([\w$]+|~([\w$]+)|#(view|([\w$]+))?)([\w$.]*?)(?:[.[]([\w$]+)\]?)?|(['"]).*\8)$/g,
                //                                        object   helper    view  viewProperty pathTokens   leafToken     string
                if (object) {
                    var ret = (helper
                        ? 'view.hlp("' + helper + '")'
                        : view
                            ? "view"
                            : "data")
                    + (leafToken
                        ? (viewProperty
                            ? "." + viewProperty
                            : helper
                                ? ""
                                : (view ? "" : "." + object)
                            ) + (pathTokens || "")
                        : (leafToken = helper ? "" : view ? viewProperty || "" : object, ""));

                    if (bind && prn !== "(") {
                        ret = "b(" + ret + ',"' + leafToken + '")';
                    }
                    return ret + (leafToken ? "." + leafToken : "");
                }
                return all;
            }

            if (err) {
                syntaxError();
            } else {
                return (aposed
                    // within single-quoted string
                    ? (aposed = !apos, (aposed ? all : '"'))
                    : quoted
                        // within double-quoted string
                        ? (quoted = !quot, (quoted ? all : '"'))
                        :
                    (
                        (lftPrn
                                ? (parenDepth++, lftPrn)
                                : "")
                        + (space
                            ? (parenDepth
                                ? ""
                                : named
                                    ? (named = FALSE, "\b")
                                    : ","
                            )
                            : eq
                                // named param
                                ? (parenDepth && syntaxError(), named = TRUE, '\b' + path + ':')
                                : path
                                    // path
                                    ? (path.replace(rPath, parsePath)
                                        + (prn
                                            ? (fnCall[++parenDepth] = TRUE, prn)
                                            : operator)
                                    )
                                    : operator
                                        ? all
                                        : rtPrn
                                            // function
                                            ? ((fnCall[parenDepth--] = FALSE, rtPrn)
                                                + (prn
                                                    ? (fnCall[++parenDepth] = TRUE, prn)
                                                    : "")
                                            )
                                            : comma
                                                ? (fnCall[parenDepth] || syntaxError(), ",") // We don't allow top-level literal arrays or objects
                                                : lftPrn0
                                                    ? ""
                                                    : (aposed = apos, quoted = quot, '"')
                    ))
                );
            }
        }
        params = (params + " ").replace(rParams, parseTokens);
        return params;
    }

    function compile(name, tmpl, parent, options) {
        // tmpl is either a template object, a selector for a template script block, the name of a compiled template, or a template object
        // options is the set of template properties, c
        var tmplOrMarkup, elem, key, nested, nestedItem;

        //==== nested functions ====
        function tmplOrMarkupFromStr(value) {
            // If value is of type string - treat as selector, or name of compiled template
            // Return the template object, if already compiled, or the markup string

            if (("" + value === value) || value.nodeType > 0) {
                // If selector is valid and returns at least one element, get first element
                elem = value.nodeType > 0 ? value : !rTmplString.test(value) && jQuery && jQuery(value)[0];
                if (elem && elem.type) {
                    // It is a script element
                    // Create a name for data linking if none provided
                    value = templates[elem.getAttribute(tmplAttr)];
                    if (!value) {
                        // Not already compiled and cached, so compile and cache the name
                        name = name || "_" + autoTmplName++;
                        elem.setAttribute(tmplAttr, name);
                        value = compile(name, elem.innerHTML, parent, options); // Use tmpl as options
                        templates[name] = value;
                    }
                }
                return value;
            }
            // If value is not a string or dom element, return undefined
        }

        //==== Compile the template ====
        tmplOrMarkup = tmplOrMarkupFromStr(tmpl);

        // If tmpl is a template object, use it for options
        options = options || (tmpl.markup ? tmpl : {});
        options.name = name;
        nested = options.templates;

        // If tmpl is not a markup string or a selector string, then it must be a template object
        // In that case, get it from the markup property of the object
        if (!tmplOrMarkup && tmpl.markup && (tmplOrMarkup = tmplOrMarkupFromStr(tmpl.markup))) {
            if (tmplOrMarkup.fn && (tmplOrMarkup.debug !== tmpl.debug || tmplOrMarkup.allowCode !== tmpl.allowCode)) {
                // if the string references a compiled template object, but the debug or allowCode props are different, need to recompile
                tmplOrMarkup = tmplOrMarkup.markup;
            }
        }
        if (tmplOrMarkup !== undefined) {
            if (name && !parent) {
                render[name] = function () {
                    return tmpl.render.apply(tmpl, arguments);
                };
            }
            if (tmplOrMarkup.fn || tmpl.fn) {
                // tmpl is already compiled, so use it, or if different name is provided, clone it
                if (tmplOrMarkup.fn) {
                    if (name && name !== tmplOrMarkup.name) {
                        tmpl = extend(extend({}, tmplOrMarkup), options);
                    } else {
                        tmpl = tmplOrMarkup;
                    }
                }
            } else {
                // tmplOrMarkup is a markup string, not a compiled template
                // Create template object
                tmpl = TmplObject(tmplOrMarkup, options, parent, 0);
                // Compile to AST and then to compiled function
                tmplFn(tmplOrMarkup, tmpl);
            }
            for (key in nested) {
                // compile nested template declarations
                nestedItem = nested[key];
                if (nestedItem.name !== key) {
                    nested[key] = compile(key, nestedItem, tmpl);
                }
            }
            return tmpl;
        }
    }
    //==== /end of function compile ====

    function TmplObject(markup, options, parent, index) {
        // Template object constructor

        // nested helper function
        function extendStore(storeName) {
            if (parent[storeName]) {
                // Include parent items except if overridden by item of same name in options
                tmpl[storeName] = extend(extend({}, parent[storeName]), options[storeName]);
            }
        }

        options = options || {};
        var tmpl = {
            markup: markup,
            tmpls: [],
            links: [],
            render: renderContent
        };
        if (parent) {
            if (parent.templates) {
                tmpl.templates = extend(extend({}, parent.templates), options.templates);
            }
            tmpl.parent = parent;
            tmpl.name = parent.name + "[" + index + "]";
            tmpl.index = index;
        }

        extend(tmpl, options);
        if (parent) {
            extendStore("templates");
            extendStore("tags");
            extendStore("helpers");
            extendStore("converters");
        }
        return tmpl;
    }

    //========================== Initialize ==========================

    if (jQuery) {
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // jQuery is loaded, so make $ the jQuery object
        $ = jQuery;
        $.templates = templates;
        $.render = render;
        $.views = jsv;
        $.fn.render = renderContent;

    } else {
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // jQuery is not loaded.

        $ = window.jsviews = jsv;
        $.extend = function (target, source) {
            var name;
            target = target || {};
            for (name in source) {
                target[name] = source[name];
            }
            return target;
        };

        $.isArray = Array && Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
    }

    extend = $.extend;

    jsv.topView = { views: {}, tmpl: {}, hlp: getHelper, ctx: jsv.helpers };

    function replacerForHtml(ch) {
        // Original code from Mike Samuel <msamuel@google.com>
        return escapeMapForHtml[ch]
            // Intentional assignment that caches the result of encoding ch.
            || (escapeMapForHtml[ch] = "&#" + ch.charCodeAt(0) + ";");
    }

    //========================== Register tags ==========================

    tags({
        "if": function () {
            var ifTag = this,
                view = ifTag.view;

            view.onElse = function (tagObject, args) {
                var i = 0,
                    l = args.length;

                while (l && !args[i++]) {
                    // Only render content if args.length === 0 (i.e. this is an else with no condition) or if a condition argument is truey
                    if (i === l) {
                        return "";
                    }
                }
                view.onElse = undefined; // If condition satisfied, so won't run 'else'.
                tagObject.path = "";
                return tagObject.renderContent(view);
                // Test is satisfied, so render content, while remaining in current data context
                // By passing the view, we inherit data context from the parent view, and the content is treated as a layout template
                // (so if the data is an array, it will not iterate over the data
            };
            return view.onElse(this, arguments);
        },
        "else": function () {
            var view = this.view;
            return view.onElse ? view.onElse(this, arguments) : "";
        },
        "for": function () {
            var i,
                self = this,
                result = "",
                args = arguments,
                l = args.length;
            if (self.props.layout) {
                self.tmpl.layout = TRUE;
            }
            for (i = 0; i < l; i++) {
                result += self.renderContent(args[i]);
            }
            return result;
        },
        "=": function (value) {
            return value;
        },
        "*": function (value) {
            return value;
        }
    });

    //========================== Register global helpers ==========================

    //	helpers({ // Global helper functions
    //		// TODO add any useful built-in helper functions
    //	});

    //========================== Register converters ==========================

    converters({
        html: function (text) {
            // HTML encoding helper: Replace < > & and ' and " by corresponding entities.
            // inspired by Mike Samuel <msamuel@google.com>
            return text != undefined ? String(text).replace(htmlSpecialChar, replacerForHtml) : "";
        }
    });

    //========================== Define default delimiters ==========================
    setDelimiters("{{", "}}");

})(this);

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ('onwheel' in document || document.documentMode >= 9) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function (elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function (elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function (fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ('detail' in orgEvent) { deltaY = orgEvent.detail * -1; }
        if ('wheelDelta' in orgEvent) { deltaY = orgEvent.wheelDelta; }
        if ('wheelDeltaY' in orgEvent) { deltaY = orgEvent.wheelDeltaY; }
        if ('wheelDeltaX' in orgEvent) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) { delta = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

/*!
 * jQuery UI Widget 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */

if (!jQuery.widget) {

    (function ($, undefined) {

        // jQuery 1.4+
        if ($.cleanData) {
            var _cleanData = $.cleanData;
            $.cleanData = function (elems) {
                for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                    try {
                        $(elem).triggerHandler("remove");
                        // http://bugs.jquery.com/ticket/8235
                    } catch (e) { }
                }
                _cleanData(elems);
            };
        } else {
            var _remove = $.fn.remove;
            $.fn.remove = function (selector, keepData) {
                return this.each(function () {
                    if (!keepData) {
                        if (!selector || $.filter(selector, [this]).length) {
                            $("*", this).add([this]).each(function () {
                                try {
                                    $(this).triggerHandler("remove");
                                    // http://bugs.jquery.com/ticket/8235
                                } catch (e) { }
                            });
                        }
                    }
                    return _remove.call($(this), selector, keepData);
                });
            };
        }

        $.widget = function (name, base, prototype) {
            var namespace = name.split(".")[0],
                fullName;
            name = name.split(".")[1];
            fullName = namespace + "-" + name;

            if (!prototype) {
                prototype = base;
                base = $.Widget;
            }

            // create selector for plugin
            $.expr[":"][fullName] = function (elem) {
                return !!$.data(elem, name);
            };

            $[namespace] = $[namespace] || {};
            $[namespace][name] = function (options, element) {
                // allow instantiation without initializing for simple inheritance
                if (arguments.length) {
                    this._createWidget(options, element);
                }
            };

            var basePrototype = new base();
            // we need to make the options hash a property directly on the new instance
            // otherwise we'll modify the options hash on the prototype that we're
            // inheriting from
            //	$.each( basePrototype, function( key, val ) {
            //		if ( $.isPlainObject(val) ) {
            //			basePrototype[ key ] = $.extend( {}, val );
            //		}
            //	});
            basePrototype.options = $.extend(true, {}, basePrototype.options);
            $[namespace][name].prototype = $.extend(true, basePrototype, {
                namespace: namespace,
                widgetName: name,
                widgetEventPrefix: $[namespace][name].prototype.widgetEventPrefix || name,
                widgetBaseClass: fullName
            }, prototype);

            $.widget.bridge(name, $[namespace][name]);
        };

        $.widget.bridge = function (name, object) {
            $.fn[name] = function (options) {
                var isMethodCall = typeof options === "string",
                    args = Array.prototype.slice.call(arguments, 1),
                    returnValue = this;

                // allow multiple hashes to be passed on init
                options = !isMethodCall && args.length ?
                    $.extend.apply(null, [true, options].concat(args)) :
                    options;

                // prevent calls to internal methods
                if (isMethodCall && options.charAt(0) === "_") {
                    return returnValue;
                }

                if (isMethodCall) {
                    this.each(function () {
                        var instance = $.data(this, name),
                            methodValue = instance && $.isFunction(instance[options]) ?
                                instance[options].apply(instance, args) :
                                instance;
                        // TODO: add this back in 1.9 and use $.error() (see #5972)
                        //				if ( !instance ) {
                        //					throw "cannot call methods on " + name + " prior to initialization; " +
                        //						"attempted to call method '" + options + "'";
                        //				}
                        //				if ( !$.isFunction( instance[options] ) ) {
                        //					throw "no such method '" + options + "' for " + name + " widget instance";
                        //				}
                        //				var methodValue = instance[ options ].apply( instance, args );
                        if (methodValue !== instance && methodValue !== undefined) {
                            returnValue = methodValue;
                            return false;
                        }
                    });
                } else {
                    this.each(function () {
                        var instance = $.data(this, name);
                        if (instance) {
                            instance.option(options || {})._init();
                        } else {
                            $.data(this, name, new object(options, this));
                        }
                    });
                }

                return returnValue;
            };
        };

        $.Widget = function (options, element) {
            // allow instantiation without initializing for simple inheritance
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };

        $.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            options: {
                disabled: false
            },
            _createWidget: function (options, element) {
                // $.widget.bridge stores the plugin instance, but we do it anyway
                // so that it's stored even before the _create function runs
                $.data(element, this.widgetName, this);
                this.element = $(element);
                this.options = $.extend(true, {},
                    this.options,
                    this._getCreateOptions(),
                    options);

                var self = this;
                this.element.bind("remove." + this.widgetName, function () {
                    self.destroy();
                });

                this._create();
                this._trigger("create");
                this._init();
            },
            _getCreateOptions: function () {
                return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
            },
            _create: function () { },
            _init: function () { },

            destroy: function () {
                this.element
                    .unbind("." + this.widgetName)
                    .removeData(this.widgetName);
                this.widget()
                    .unbind("." + this.widgetName)
                    .removeAttr("aria-disabled")
                    .removeClass(
                        this.widgetBaseClass + "-disabled " +
                        "ui-state-disabled");
            },

            widget: function () {
                return this.element;
            },

            option: function (key, value) {
                var options = key;

                if (arguments.length === 0) {
                    // don't return a reference to the internal hash
                    return $.extend({}, this.options);
                }

                if (typeof key === "string") {
                    if (value === undefined) {
                        return this.options[key];
                    }
                    options = {};
                    options[key] = value;
                }

                this._setOptions(options);

                return this;
            },
            _setOptions: function (options) {
                var self = this;
                $.each(options, function (key, value) {
                    self._setOption(key, value);
                });

                return this;
            },
            _setOption: function (key, value) {
                this.options[key] = value;

                if (key === "disabled") {
                    this.widget()
                        [value ? "addClass" : "removeClass"](
                            this.widgetBaseClass + "-disabled" + " " +
                            "ui-state-disabled")
                        .attr("aria-disabled", value);
                }

                return this;
            },

            enable: function () {
                return this._setOption("disabled", false);
            },
            disable: function () {
                return this._setOption("disabled", true);
            },

            _trigger: function (type, event, data) {
                var prop, orig,
                    callback = this.options[type];

                data = data || {};
                event = $.Event(event);
                event.type = (type === this.widgetEventPrefix ?
                    type :
                    this.widgetEventPrefix + type).toLowerCase();
                // the original event may come from any element
                // so we need to reset the target on the new event
                event.target = this.element[0];

                // copy original event properties over to the new event
                orig = event.originalEvent;
                if (orig) {
                    for (prop in orig) {
                        if (!(prop in event)) {
                            event[prop] = orig[prop];
                        }
                    }
                }

                this.element.trigger(event, data);

                return !($.isFunction(callback) &&
                    callback.call(this.element[0], event, data) === false ||
                    event.isDefaultPrevented());
            }
        };

    })(jQuery);

};


(function ($, window, undefined) {
    window.toStaticHTML = window.toStaticHTML || function (x) { return x; };

    var pos_oo = Number.POSITIVE_INFINITY,
        neg_oo = Number.NEGATIVE_INFINITY;

    $.geo = {
        //
        // utility functions
        //

        _allCoordinates: function (geom) {
            // return array of all positions in all geometries of geom
            // not in JTS
            var geometries = this._flatten(geom),
                curGeom = 0,
                result = [];

            for (; curGeom < geometries.length; curGeom++) {
                var coordinates = geometries[curGeom].coordinates,
                    isArray = coordinates && $.isArray(coordinates[0]),
                    isDblArray = isArray && $.isArray(coordinates[0][0]),
                    isTriArray = isDblArray && $.isArray(coordinates[0][0][0]),
                    i, j, k;

                if (!isTriArray) {
                    if (!isDblArray) {
                        if (!isArray) {
                            coordinates = [coordinates];
                        }
                        coordinates = [coordinates];
                    }
                    coordinates = [coordinates];
                }

                for (i = 0; i < coordinates.length; i++) {
                    for (j = 0; j < coordinates[i].length; j++) {
                        for (k = 0; k < coordinates[i][j].length; k++) {
                            result.push(coordinates[i][j][k]);
                        }
                    }
                }
            }
            return result;
        },

        _isGeodetic: function (coords) {
            // returns true if the first coordinate it can find is geodetic

            while ($.isArray(coords)) {
                if (coords.length > 1 && !$.isArray(coords[0])) {
                    return (coords[0] >= -180.001 && coords[0] <= 180.001 && coords[1] >= -90.001 && coords[1] <= 90.001);
                } else {
                    coords = coords[0];
                }
            }

            return false;
        },

        //
        // bbox functions
        //

        center: function (bbox, _ignoreGeo /* Internal Use Only */) {
            // Envelope.centre in JTS
            // bbox only, use centroid for geom
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                wasGeodetic = true;
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            var center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
            return wasGeodetic ? $.geo.proj.toGeodetic(center) : center;
        },

        expandBy: function (bbox, dx, dy, _ignoreGeo /* Internal Use Only */) {
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                wasGeodetic = true;
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            bbox = [bbox[0] - dx, bbox[1] - dy, bbox[2] + dx, bbox[3] + dy];
            return wasGeodetic ? $.geo.proj.toGeodetic(bbox) : bbox;
        },

        height: function (bbox, _ignoreGeo /* Internal Use Only */) {
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            return bbox[3] - bbox[1];
        },

        _in: function (bbox1, bbox2) {
            return bbox1[0] <= bbox2[0] &&
                   bbox1[1] <= bbox2[1] &&
                   bbox1[2] >= bbox2[2] &&
                   bbox1[3] >= bbox2[3];
        },

        _bboxDisjoint: function (bbox1, bbox2) {
            return bbox2[0] > bbox1[2] ||
                   bbox2[2] < bbox1[0] ||
                   bbox2[1] > bbox1[3] ||
                   bbox2[3] < bbox1[1];
        },

        include: function (bbox, value, _ignoreGeo /* Internal Use Only */) {
            // similar to Envelope.expandToInclude in JTS
            if (!value || !$.isArray(value)) {
                return bbox;
            }

            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox || value)) {
                wasGeodetic = true;
            }

            if (!bbox) {
                bbox = [pos_oo, pos_oo, neg_oo, neg_oo];
            } else if (wasGeodetic) {
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            if (value.length === 2) {
                value = [value[0], value[1], value[0], value[1]];
            }

            if ($.geo.proj) {
                value = $.geo.proj.fromGeodetic(value);
            }

            bbox[0] = Math.min(value[0], bbox[0]);
            bbox[1] = Math.min(value[1], bbox[1]);
            bbox[2] = Math.max(value[2], bbox[2]);
            bbox[3] = Math.max(value[3], bbox[3]);

            return wasGeodetic ? $.geo.proj.toGeodetic(bbox) : bbox;
        },

        polygonize: function (bbox, _ignoreGeo /* Internal Use Only */) {
            // adaptation of Polygonizer class in JTS for use with bboxes
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                wasGeodetic = true;
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            var polygon = {
                type: "Polygon",
                coordinates: [[
                  [bbox[0], bbox[1]],
                  [bbox[0], bbox[3]],
                  [bbox[2], bbox[3]],
                  [bbox[2], bbox[1]],
                  [bbox[0], bbox[1]]
                ]]
            };

            if (wasGeodetic) {
                polygon.coordinates = $.geo.proj.toGeodetic(polygon.coordinates);
            }

            return polygon;
        },

        reaspect: function (bbox, ratio, _ignoreGeo /* Internal Use Only */) {
            // not in JTS
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                wasGeodetic = true;
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            var width = this.width(bbox, true),
                height = this.height(bbox, true),
                center = this.center(bbox, true),
                dx, dy;

            if (width !== 0 && height !== 0 && ratio > 0) {
                if (width / height > ratio) {
                    dx = width / 2;
                    dy = dx / ratio;
                } else {
                    dy = height / 2;
                    dx = dy * ratio;
                }

                bbox = [center[0] - dx, center[1] - dy, center[0] + dx, center[1] + dy];
            }

            return wasGeodetic ? $.geo.proj.toGeodetic(bbox) : bbox;
        },

        recenter: function (bbox, center, _ignoreGeo /* Internal Use Only */) {
            // not in JTS
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj) {
                if (this._isGeodetic(bbox)) {
                    wasGeodetic = true;
                    bbox = $.geo.proj.fromGeodetic(bbox);
                }

                if (this._isGeodetic(center)) {
                    center = $.geo.proj.fromGeodetic(center);
                }
            }

            var halfWidth = (bbox[2] - bbox[0]) / 2,
                halfHeight = (bbox[3] - bbox[1]) / 2;

            bbox = [
              center[0] - halfWidth,
              center[1] - halfHeight,
              center[0] + halfWidth,
              center[1] + halfHeight
            ];

            return wasGeodetic ? $.geo.proj.toGeodetic(bbox) : bbox;
        },

        scaleBy: function (bbox, scale, _ignoreGeo /* Internal Use Only */) {
            // not in JTS
            var wasGeodetic = false;
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                wasGeodetic = true;
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            var c = this.center(bbox, true),
                dx = (bbox[2] - bbox[0]) * scale / 2,
                dy = (bbox[3] - bbox[1]) * scale / 2;

            bbox = [c[0] - dx, c[1] - dy, c[0] + dx, c[1] + dy];

            return wasGeodetic ? $.geo.proj.toGeodetic(bbox) : bbox;
        },

        width: function (bbox, _ignoreGeo /* Internal Use Only */) {
            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(bbox)) {
                bbox = $.geo.proj.fromGeodetic(bbox);
            }

            return bbox[2] - bbox[0];
        },

        //
        // geometry functions
        //

        // bbox (Geometry.getEnvelope in JTS)

        bbox: function (geom, _ignoreGeo /* Internal Use Only */) {
            var result, wasGeodetic = false;
            if (!geom) {
                return undefined;
            } else if (geom.bbox) {
                result = (!_ignoreGeo && $.geo.proj && this._isGeodetic(geom.bbox)) ? $.geo.proj.fromGeodetic(geom.bbox) : geom.bbox;
            } else {
                result = [pos_oo, pos_oo, neg_oo, neg_oo];

                var coordinates = this._allCoordinates(geom),
                    curCoord = 0;

                if (coordinates.length === 0) {
                    return undefined;
                }

                if (!_ignoreGeo && $.geo.proj && this._isGeodetic(coordinates)) {
                    wasGeodetic = true;
                    coordinates = $.geo.proj.fromGeodetic(coordinates);
                }

                for (; curCoord < coordinates.length; curCoord++) {
                    result[0] = Math.min(coordinates[curCoord][0], result[0]);
                    result[1] = Math.min(coordinates[curCoord][1], result[1]);
                    result[2] = Math.max(coordinates[curCoord][0], result[2]);
                    result[3] = Math.max(coordinates[curCoord][1], result[3]);
                }
            }

            return wasGeodetic ? $.geo.proj.toGeodetic(result) : result;
        },

        // centroid

        centroid: function (geom, _ignoreGeo /* Internal Use Only */) {
            var c; //< temp storage for any coordinate during centroid op

            switch (geom.type) {
                case "Point":
                    return $.extend({}, geom);

                case "LineString":
                case "Polygon":
                    var a = 0,
                        coords = $.merge([], geom.type === "Polygon" ? geom.coordinates[0] : geom.coordinates),
                        i = 1, j, n,
                        bbox = [pos_oo, pos_oo, neg_oo, neg_oo];

                    c = [0, 0];

                    var wasGeodetic = false;
                    if (!_ignoreGeo && $.geo.proj && this._isGeodetic(coords)) {
                        wasGeodetic = true;
                        coords = $.geo.proj.fromGeodetic(coords);
                    }

                    //if (coords[0][0] != coords[coords.length - 1][0] || coords[0][1] != coords[coords.length - 1][1]) {
                    //  coords.push(coords[0]);
                    //}

                    for (; i <= coords.length; i++) {
                        j = i % coords.length;

                        bbox[0] = Math.min(coords[j][0], bbox[0]);
                        bbox[1] = Math.min(coords[j][1], bbox[1]);
                        bbox[2] = Math.max(coords[j][0], bbox[2]);
                        bbox[3] = Math.max(coords[j][1], bbox[3]);

                        n = (coords[i - 1][0] * coords[j][1]) - (coords[j][0] * coords[i - 1][1]);
                        a += n;
                        c[0] += (coords[i - 1][0] + coords[j][0]) * n;
                        c[1] += (coords[i - 1][1] + coords[j][1]) * n;
                    }

                    if (a === 0) {
                        if (coords.length > 0) {
                            c[0] = Math.min(Math.max(coords[0][0], bbox[0]), bbox[2]);
                            c[1] = Math.min(Math.max(coords[0][1], bbox[1]), bbox[3]);
                            return { type: "Point", coordinates: wasGeodetic ? $.geo.proj.toGeodetic(c) : c };
                        } else {
                            return undefined;
                        }
                    }

                    a *= 3;
                    //c[0] /= a;
                    //c[1] /= a;

                    c[0] = Math.min(Math.max(c[0] / a, bbox[0]), bbox[2]);
                    c[1] = Math.min(Math.max(c[1] / a, bbox[1]), bbox[3]);

                    return { type: "Point", coordinates: wasGeodetic ? $.geo.proj.toGeodetic(c) : c };

                case "MultiPoint":
                    // should return center of mass for point cluster but just return first point for now
                    if (geom.coordinates.length > 0) {
                        c = geom.coordinates[0];
                        return {
                            type: "Point",
                            coordinates: [c[0], c[1]]
                        };
                    }
                    break;

                case "MultiLineString":
                case "MultiPolygon":
                    if (geom.coordinates.length > 0) {
                        return this.centroid({
                            type: geom.type.substr(5),
                            coordinates: geom.coordinates[0]
                        }, _ignoreGeo);
                    }
                    break;

            }
            return undefined;
        },

        // contains

        contains: function (geom1, geom2) {
            if (geom1.type !== "Polygon") {
                return false;
            }

            switch (geom2.type) {
                case "Point":
                    return this._containsPolygonPoint(geom1.coordinates, geom2.coordinates);

                case "LineString":
                    return this._containsPolygonLineString(geom1.coordinates, geom2.coordinates);

                case "Polygon":
                    return this._containsPolygonLineString(geom1.coordinates, geom2.coordinates[0]);

                default:
                    return false;
            }
        },

        _containsPolygonPoint: function (polygonCoordinates, pointCoordinate) {
            if (polygonCoordinates.length === 0 || polygonCoordinates[0].length < 4) {
                return false;
            }

            var rayCross = 0,
                a = polygonCoordinates[0][0],
                i = 1,
                b,
                x;

            for (; i < polygonCoordinates[0].length; i++) {
                b = polygonCoordinates[0][i];

                if ((a[1] <= pointCoordinate[1] && pointCoordinate[1] < b[1]) || (b[1] <= pointCoordinate[1] && pointCoordinate[1] < a[1]) && (pointCoordinate[0] < a[0] || pointCoordinate[0] < b[0])) {
                    x = a[0] + (b[0] - a[0]) * (pointCoordinate[1] - a[1]) / (b[1] - a[1]);

                    if (x > pointCoordinate[0]) {
                        rayCross++;
                    }
                }

                a = b;
            }

            return rayCross % 2 === 1;
        },

        _containsPolygonLineString: function (polygonCoordinates, lineStringCoordinates) {
            for (var i = 0; i < lineStringCoordinates.length; i++) {
                if (!this._containsPolygonPoint(polygonCoordinates, lineStringCoordinates[i])) {
                    return false;
                }
            }
            return true;
        },

        // distance

        distance: function (geom1, geom2, _ignoreGeo /* Internal Use Only */) {
            var geom1CoordinatesProjected = (!_ignoreGeo && $.geo.proj && this._isGeodetic(geom1.coordinates)) ? $.geo.proj.fromGeodetic(geom1.coordinates) : geom1.coordinates,
                geom2CoordinatesProjected = (!_ignoreGeo && $.geo.proj && this._isGeodetic(geom2.coordinates)) ? $.geo.proj.fromGeodetic(geom2.coordinates) : geom2.coordinates;

            switch (geom1.type) {
                case "Point":
                    switch (geom2.type) {
                        case "Point":
                            return this._distancePointPoint(geom2CoordinatesProjected, geom1CoordinatesProjected);
                        case "LineString":
                            return this._distanceLineStringPoint(geom2CoordinatesProjected, geom1CoordinatesProjected);
                        case "Polygon":
                            return this._containsPolygonPoint(geom2CoordinatesProjected, geom1CoordinatesProjected) ? 0 : this._distanceLineStringPoint(geom2CoordinatesProjected[0], geom1CoordinatesProjected);
                        default:
                            return undefined;
                    }
                    break;

                case "LineString":
                    switch (geom2.type) {
                        case "Point":
                            return this._distanceLineStringPoint(geom1CoordinatesProjected, geom2CoordinatesProjected);
                        case "LineString":
                            return this._distanceLineStringLineString(geom1CoordinatesProjected, geom2CoordinatesProjected);
                        case "Polygon":
                            return this._containsPolygonLineString(geom2CoordinatesProjected, geom1CoordinatesProjected) ? 0 : this._distanceLineStringLineString(geom2CoordinatesProjected[0], geom1CoordinatesProjected);
                        default:
                            return undefined;
                    }
                    break;

                case "Polygon":
                    switch (geom2.type) {
                        case "Point":
                            return this._containsPolygonPoint(geom1CoordinatesProjected, geom2CoordinatesProjected) ? 0 : this._distanceLineStringPoint(geom1CoordinatesProjected[0], geom2CoordinatesProjected);
                        case "LineString":
                            return this._containsPolygonLineString(geom1CoordinatesProjected, geom2CoordinatesProjected) ? 0 : this._distanceLineStringLineString(geom1CoordinatesProjected[0], geom2CoordinatesProjected);
                        case "Polygon":
                            return this._containsPolygonLineString(geom1CoordinatesProjected, geom2CoordinatesProjected[0]) ? 0 : this._distanceLineStringLineString(geom1CoordinatesProjected[0], geom2CoordinatesProjected[0]);
                        default:
                            return undefined;
                    }
                    break;
            }
        },

        _distancePointPoint: function (coordinate1, coordinate2) {
            var dx = coordinate2[0] - coordinate1[0],
                dy = coordinate2[1] - coordinate1[1];
            return Math.sqrt((dx * dx) + (dy * dy));
        },

        _distanceLineStringPoint: function (lineStringCoordinates, pointCoordinate) {
            var minDist = pos_oo;

            if (lineStringCoordinates.length > 0) {
                var a = lineStringCoordinates[0],

                    apx = pointCoordinate[0] - a[0],
                    apy = pointCoordinate[1] - a[1];

                if (lineStringCoordinates.length === 1) {
                    return Math.sqrt(apx * apx + apy * apy);
                } else {
                    for (var i = 1; i < lineStringCoordinates.length; i++) {
                        var b = lineStringCoordinates[i],

                            abx = b[0] - a[0],
                            aby = b[1] - a[1],
                            bpx = pointCoordinate[0] - b[0],
                            bpy = pointCoordinate[1] - b[1],

                            d = this._distanceSegmentPoint(abx, aby, apx, apy, bpx, bpy);

                        if (d === 0) {
                            return 0;
                        }

                        if (d < minDist) {
                            minDist = d;
                        }

                        a = b;
                        apx = bpx;
                        apy = bpy;
                    }
                }
            }

            return Math.sqrt(minDist);
        },

        _distanceSegmentPoint: function (abx, aby, apx, apy, bpx, bpy) {
            var dot1 = abx * apx + aby * apy;

            if (dot1 <= 0) {
                return apx * apx + apy * apy;
            }

            var dot2 = abx * abx + aby * aby;

            if (dot1 >= dot2) {
                return bpx * bpx + bpy * bpy;
            }

            return apx * apx + apy * apy - dot1 * dot1 / dot2;
        },

        _distanceLineStringLineString: function (lineStringCoordinates1, lineStringCoordinates2) {
            var minDist = pos_oo;
            for (var i = 0; i < lineStringCoordinates2.length; i++) {
                minDist = Math.min(minDist, this._distanceLineStringPoint(lineStringCoordinates1, lineStringCoordinates2[i]));
            }
            return minDist;
        },

        // buffer

        _buffer: function (geom, distance, _ignoreGeo /* Internal Use Only */) {
            var wasGeodetic = false,
                coords = geom.coordinates;

            if (!_ignoreGeo && $.geo.proj && this._isGeodetic(geom.coordinates)) {
                wasGeodetic = true;
                coords = $.geo.proj.fromGeodetic(geom.coordinates);
            }

            if (geom.type === "Point") {
                var resultCoords = [],
                    slices = 180,
                    i = 0,
                    a;

                for (; i <= slices; i++) {
                    a = (i * 360 / slices) * (Math.PI / 180);
                    resultCoords.push([
                      coords[0] + Math.cos(a) * distance,
                      coords[1] + Math.sin(a) * distance
                    ]);
                }

                return {
                    type: "Polygon",
                    coordinates: [(wasGeodetic ? $.geo.proj.toGeodetic(resultCoords) : resultCoords)]
                };
            } else {
                return undefined;
            }
        },


        //
        // feature
        //

        _basic: function (geom) {
            // return an array of all basic geometries
            // e.g., MultiPolygons become multiple Polygons
            // coordinate arrays are kept as references for speed & should not be altered
            // not in JTS
            var geometries = [];
            var multiType;
            var i = 0;
            var j;

            var flat = this._flatten(geom);

            for (; i < flat.length; i++) {
                if (flat[i].type.substring(0, 5) === "Multi") {
                    multiType = flat[i].type.substring(5);

                    for (j = 0; j < flat[i].coordinates.length; j++) {
                        geometries.push({
                            type: multiType,
                            coordinates: flat[i].coordinates[j]
                        });
                    }
                } else {
                    geometries.push(flat[i]);
                }
            }

            return geometries;
        },

        _flatten: function (geom) {
            // return an array of only geometries
            // will extract geometries from Feature, FeatureCollection, & GeometryCollection
            // not in JTS
            var geometries = [],
                curGeom = 0;
            switch (geom.type) {
                case "Feature":
                    $.merge(geometries, this._flatten(geom.geometry));
                    break;

                case "FeatureCollection":
                    for (; curGeom < geom.features.length; curGeom++) {
                        $.merge(geometries, this._flatten(geom.features[curGeom].geometry));
                    }
                    break;

                case "GeometryCollection":
                    for (; curGeom < geom.geometries.length; curGeom++) {
                        $.merge(geometries, this._flatten(geom.geometries[curGeom]));
                    }
                    break;

                default:
                    geometries[0] = geom;
                    break;
            }
            return geometries;
        },

        length: function (geom, _ignoreGeo /* Internal Use Only */) {
            var sum = 0,
                lineStringCoordinates,
                i = 1, dx, dy;

            switch (geom.type) {
                case "Point":
                    return 0;

                case "LineString":
                    lineStringCoordinates = geom.coordinates;
                    break;

                case "Polygon":
                    lineStringCoordinates = geom.coordinates[0];
                    break;
            }

            if (lineStringCoordinates) {
                if (!_ignoreGeo && $.geo.proj && this._isGeodetic(lineStringCoordinates)) {
                    lineStringCoordinates = $.geo.proj.fromGeodetic(lineStringCoordinates);
                }

                for (; i < lineStringCoordinates.length; i++) {
                    dx = lineStringCoordinates[i][0] - lineStringCoordinates[i - 1][0];
                    dy = lineStringCoordinates[i][1] - lineStringCoordinates[i - 1][1];
                    sum += Math.sqrt((dx * dx) + (dy * dy));
                }

                return sum;
            }

            // return undefined;
        },

        area: function (geom, _ignoreGeo /* Internal Use Only */) {
            var sum = 0,
                polygonCoordinates,
                i = 1, j;

            switch (geom.type) {
                case "Point":
                case "LineString":
                    return 0;

                case "Polygon":
                    polygonCoordinates = geom.coordinates[0];
                    break;
            }

            if (polygonCoordinates) {
                if (!_ignoreGeo && $.geo.proj && this._isGeodetic(polygonCoordinates)) {
                    polygonCoordinates = $.geo.proj.fromGeodetic(polygonCoordinates);
                }

                for (; i <= polygonCoordinates.length; i++) {
                    j = i % polygonCoordinates.length;
                    sum += (polygonCoordinates[i - 1][0] - polygonCoordinates[j][0]) * (polygonCoordinates[i - 1][1] + polygonCoordinates[j][1]) / 2;
                }

                return Math.abs(sum);
            }
        },

        pointAlong: function (geom, percentage, _ignoreGeo /* Internal Use Only */) {
            var totalLength = 0,
                previousPercentageSum = 0,
                percentageSum = 0,
                remainderPercentageSum,
                len,
                lineStringCoordinates,
                segmentLengths = [],
                i = 1, dx, dy,
                c, c0, c1,
                wasGeodetic = false;

            switch (geom.type) {
                case "Point":
                    return $.extend({}, geom);

                case "LineString":
                    lineStringCoordinates = geom.coordinates;
                    break;

                case "Polygon":
                    lineStringCoordinates = geom.coordinates[0];
                    break;
            }

            if (lineStringCoordinates) {
                if (percentage === 0) {
                    return {
                        type: "Point",
                        coordinates: [lineStringCoordinates[0][0], lineStringCoordinates[0][1]]
                    };
                } else if (percentage === 1) {
                    i = lineStringCoordinates.length - 1;
                    return {
                        type: "Point",
                        coordinates: [lineStringCoordinates[i][0], lineStringCoordinates[i][1]]
                    };
                } else {
                    if (!_ignoreGeo && $.geo.proj && this._isGeodetic(lineStringCoordinates)) {
                        wasGeodetic = true;
                        lineStringCoordinates = $.geo.proj.fromGeodetic(lineStringCoordinates);
                    }

                    for (; i < lineStringCoordinates.length; i++) {
                        dx = lineStringCoordinates[i][0] - lineStringCoordinates[i - 1][0];
                        dy = lineStringCoordinates[i][1] - lineStringCoordinates[i - 1][1];
                        len = Math.sqrt((dx * dx) + (dy * dy));
                        segmentLengths.push(len);
                        totalLength += len;
                    }

                    for (i = 0; i < segmentLengths.length && percentageSum < percentage; i++) {
                        previousPercentageSum = percentageSum;
                        percentageSum += (segmentLengths[i] / totalLength);
                    }

                    remainderPercentageSum = percentage - previousPercentageSum;

                    c0 = lineStringCoordinates[i - 1];
                    c1 = lineStringCoordinates[i];

                    c = [
                      c0[0] + (remainderPercentageSum * (c1[0] - c0[0])),
                      c0[1] + (remainderPercentageSum * (c1[1] - c0[1]))
                    ];

                    return {
                        type: "Point",
                        coordinates: wasGeodetic ? $.geo.proj.toGeodetic(c) : c
                    };
                }
            }
        },

        //
        // WKT functions
        //

        WKT: (function () {
            function pointToString(value) {
                return "POINT " + pointToUntaggedString(value.coordinates);
            }

            function pointToUntaggedString(coordinates) {
                if (!(coordinates && coordinates.length)) {
                    return "EMPTY";
                } else {
                    return "(" + coordinates.join(" ") + ")";
                }
            }

            function lineStringToString(value) {
                return "LINESTRING " + lineStringToUntaggedString(value.coordinates);
            }

            function lineStringToUntaggedString(coordinates) {
                if (!(coordinates && coordinates.length)) {
                    return "EMPTY";
                } else {
                    var points = [];

                    for (var i = 0; i < coordinates.length; i++) {
                        points.push(coordinates[i].join(" "));
                    }

                    return "(" + points + ")";
                }
            }

            function polygonToString(value) {
                return "POLYGON " + polygonToUntaggedString(value.coordinates);
            }

            function polygonToUntaggedString(coordinates) {
                if (!(coordinates && coordinates.length)) {
                    return "EMTPY";
                } else {
                    var lineStrings = [];

                    for (var i = 0; i < coordinates.length; i++) {
                        lineStrings.push(lineStringToUntaggedString(coordinates[i]));
                    }

                    return "(" + lineStrings + ")";
                }
            }

            function multiPointToString(value) {
                return "MULTIPOINT " + lineStringToUntaggedString(value.coordinates);
            }

            function multiLineStringToString(value) {
                return "MULTILINSTRING " + polygonToUntaggedString(value.coordinates);
            }

            function multiPolygonToString(value) {
                return "MULTIPOLYGON " + multiPolygonToUntaggedString(value.coordinates);
            }

            function multiPolygonToUntaggedString(coordinates) {
                if (!(coordinates && coordinates.length)) {
                    return "EMPTY";
                } else {
                    var polygons = [];
                    for (var i = 0; i < coordinates.length; i++) {
                        polygons.push(polygonToUntaggedString(coordinates[i]));
                    }
                    return "(" + polygons + ")";
                }
            }

            function geometryCollectionToString(value) {
                return "GEOMETRYCOLLECTION " + geometryCollectionToUntaggedString(value.geometries);
            }

            function geometryCollectionToUntaggedString(geometries) {
                if (!(geometries && geometries.length)) {
                    return "EMPTY";
                } else {
                    var geometryText = [];
                    for (var i = 0; i < geometries.length; i++) {
                        geometryText.push(stringify(geometries[i]));
                    }
                    return "(" + geometries + ")";
                }
            }

            function stringify(value) {
                if (!(value && value.type)) {
                    return "";
                } else {
                    switch (value.type) {
                        case "Point":
                            return pointToString(value);

                        case "LineString":
                            return lineStringToString(value);

                        case "Polygon":
                            return polygonToString(value);

                        case "MultiPoint":
                            return multiPointToString(value);

                        case "MultiLineString":
                            return multiLineStringToString(value);

                        case "MultiPolygon":
                            return multiPolygonToString(value);

                        case "GeometryCollection":
                            return geometryCollectionToString(value);

                        default:
                            return "";
                    }
                }
            }

            function pointParseUntagged(wkt) {
                var pointString = wkt.match(/\(\s*([\d\.\-]+)\s+([\d\.\-]+)\s*\)/);
                return pointString && pointString.length > 2 ? {
                    type: "Point",
                    coordinates: [
                      parseFloat(pointString[1]),
                      parseFloat(pointString[2])
                    ]
                } : null;
            }

            function lineStringParseUntagged(wkt) {
                var lineString = wkt.match(/\s*\((.*)\)/),
                    coords = [],
                    pointStrings,
                    pointParts,
                    i = 0;

                if (lineString && lineString.length > 1) {
                    pointStrings = lineString[1].match(/[\d\.\-]+\s+[\d\.\-]+/g);

                    for (; i < pointStrings.length; i++) {
                        pointParts = pointStrings[i].match(/\s*([\d\.\-]+)\s+([\d\.\-]+)\s*/);
                        coords[i] = [parseFloat(pointParts[1]), parseFloat(pointParts[2])];
                    }

                    return {
                        type: "LineString",
                        coordinates: coords
                    };
                } else {
                    return null;
                }
            }

            function polygonParseUntagged(wkt) {
                var polygon = wkt.match(/\s*\(\s*\((.*)\)\s*\)/),
                    coords = [],
                    pointStrings,
                    pointParts,
                    i = 0;

                if (polygon && polygon.length > 1) {
                    pointStrings = polygon[1].match(/[\d\.\-]+\s+[\d\.\-]+/g);

                    for (; i < pointStrings.length; i++) {
                        pointParts = pointStrings[i].match(/\s*([\d\.\-]+)\s+([\d\.\-]+)\s*/);
                        coords[i] = [parseFloat(pointParts[1]), parseFloat(pointParts[2])];
                    }

                    return {
                        type: "Polygon",
                        coordinates: [coords]
                    };
                } else {
                    return null;
                }
            }

            function multiPointParseUntagged(wkt) {
                var multiSomething;

                if (wkt.indexOf("((") === -1) {
                    multiSomething = lineStringParseUntagged(wkt);
                } else {
                    multiSomething = multiLineStringParseUntagged(wkt);
                    multiSomething.coordinates = $.geo._allCoordinates(multiSomething);
                }

                multiSomething.type = "MultiPoint";

                return multiSomething;
            }

            function multiLineStringParseUntagged(wkt) {
                var lineStringsWkt = wkt.substr(2, wkt.length - 4),
                    lineString,
                    lineStrings = lineStringsWkt.split(/\),\s*\(/),
                    i = 0,
                    multiLineString = {
                        type: "MultiLineString",
                        coordinates: []
                    };

                for (; i < lineStrings.length; i++) {
                    lineString = lineStringParseUntagged("(" + lineStrings[i] + ")");
                    if (lineString) {
                        multiLineString.coordinates.push(lineString.coordinates);
                    }
                }

                return multiLineString;
            }

            function multiPolygonParseUntagged(wkt) {
                var polygonsWkt = wkt.substr(1, wkt.length - 2),
                    polygon,
                    polygons = polygonsWkt.split(/\),\s*\(/),
                    i = 0,
                    multiPolygon = {
                        type: "MultiPolygon",
                        coordinates: []
                    };

                for (; i < polygons.length; i++) {
                    polygon = polygonParseUntagged("(" + polygons[i] + ")");
                    if (polygon) {
                        multiPolygon.coordinates.push(polygon.coordinates);
                    }
                }

                return multiPolygon;
            }

            function geometryCollectionParseUntagged(wkt) {
                var geometriesWkt = wkt.substr(1, wkt.length - 2),
                    geometries = geometriesWkt.match(/\),[a-zA-Z]/g),
                    geometryCollection = {
                        type: "GeometryCollection",
                        geometries: []
                    },
                    curGeom,
                    i = 0, curStart = 0, curLen;

                if (geometries && geometries.length > 0) {
                    for (; i < geometries.length; i++) {
                        curLen = geometriesWkt.indexOf(geometries[i], curStart) - curStart + 1;
                        curGeom = parse(geometriesWkt.substr(curStart, curLen));
                        if (curGeom) {
                            geometryCollection.geometries.push(curGeom);
                        }
                        curStart += curLen + 1;
                    }

                    // one more
                    curGeom = parse(geometriesWkt.substr(curStart));
                    if (curGeom) {
                        geometryCollection.geometries.push(curGeom);
                    }

                    return geometryCollection;
                } else {
                    return null;
                }
            }

            function parse(wkt) {
                wkt = $.trim(wkt);

                var typeIndex = wkt.indexOf("("),
                    untagged = wkt.substr(typeIndex);

                switch ($.trim(wkt.substr(0, typeIndex)).toUpperCase()) {
                    case "POINT":
                        return pointParseUntagged(untagged);

                    case "LINESTRING":
                        return lineStringParseUntagged(untagged);

                    case "POLYGON":
                        return polygonParseUntagged(untagged);

                    case "MULTIPOINT":
                        return multiPointParseUntagged(untagged);

                    case "MULTILINESTRING":
                        return multiLineStringParseUntagged(untagged);

                    case "MULTIPOLYGON":
                        return multiPolygonParseUntagged(untagged);

                    case "GEOMETRYCOLLECTION":
                        return geometryCollectionParseUntagged(untagged);

                    default:
                        return null;
                }
            }

            return {
                stringify: stringify,

                parse: parse
            };
        }()),

        //
        // projection functions
        //

        proj: (function () {
            var halfPi = 1.5707963267948966192,
                quarterPi = 0.7853981633974483096,
                radiansPerDegree = 0.0174532925199432958,
                degreesPerRadian = 57.295779513082320877,
                semiMajorAxis = 6378137;

            return {
                fromGeodeticPos: function (coordinate) {
                    return [
                      semiMajorAxis * coordinate[0] * radiansPerDegree,
                      semiMajorAxis * Math.log(Math.tan(quarterPi + coordinate[1] * radiansPerDegree / 2))
                    ];
                },

                fromGeodetic: function (coordinates) {
                    if (!$.geo._isGeodetic(coordinates)) {
                        return coordinates;
                    }

                    var isMultiPointOrLineString = $.isArray(coordinates[0]),
                        fromGeodeticPos = this.fromGeodeticPos;

                    if (!isMultiPointOrLineString && coordinates.length === 4) {
                        // bbox
                        var min = fromGeodeticPos([coordinates[0], coordinates[1]]),
                            max = fromGeodeticPos([coordinates[2], coordinates[3]]);
                        return [min[0], min[1], max[0], max[1]];
                    } else {
                        // geometry
                        var isMultiLineStringOrPolygon = isMultiPointOrLineString && $.isArray(coordinates[0][0]),
                            isMultiPolygon = isMultiLineStringOrPolygon && $.isArray(coordinates[0][0][0]),
                            result = [],
                            i, j, k;

                        if (!isMultiPolygon) {
                            if (!isMultiLineStringOrPolygon) {
                                if (!isMultiPointOrLineString) {
                                    coordinates = [coordinates];
                                }
                                coordinates = [coordinates];
                            }
                            coordinates = [coordinates];
                        }

                        for (i = 0; i < coordinates.length; i++) {
                            result[i] = [];
                            for (j = 0; j < coordinates[i].length; j++) {
                                result[i][j] = [];
                                for (k = 0; k < coordinates[i][j].length; k++) {
                                    result[i][j][k] = fromGeodeticPos(coordinates[i][j][k]);
                                }
                            }
                        }

                        return isMultiPolygon ? result : isMultiLineStringOrPolygon ? result[0] : isMultiPointOrLineString ? result[0][0] : result[0][0][0];
                    }
                },

                toGeodeticPos: function (coordinate) {
                    return [
                      (coordinate[0] / semiMajorAxis) * degreesPerRadian,
                      (halfPi - 2 * Math.atan(1 / Math.exp(coordinate[1] / semiMajorAxis))) * degreesPerRadian
                    ];
                },

                toGeodetic: function (coordinates) {
                    if ($.geo._isGeodetic(coordinates)) {
                        return coordinates;
                    }

                    var isMultiPointOrLineString = $.isArray(coordinates[0]),
                        toGeodeticPos = this.toGeodeticPos;

                    if (!isMultiPointOrLineString && coordinates.length === 4) {
                        // bbox
                        var min = toGeodeticPos([coordinates[0], coordinates[1]]),
                            max = toGeodeticPos([coordinates[2], coordinates[3]]);
                        return [min[0], min[1], max[0], max[1]];
                    } else {
                        // geometry
                        var isMultiLineStringOrPolygon = isMultiPointOrLineString && $.isArray(coordinates[0][0]),
                            isMultiPolygon = isMultiLineStringOrPolygon && $.isArray(coordinates[0][0][0]),
                            result = [],
                            i, j, k;

                        if (!isMultiPolygon) {
                            if (!isMultiLineStringOrPolygon) {
                                if (!isMultiPointOrLineString) {
                                    coordinates = [coordinates];
                                }
                                coordinates = [coordinates];
                            }
                            coordinates = [coordinates];
                        }

                        for (i = 0; i < coordinates.length; i++) {
                            result[i] = [];
                            for (j = 0; j < coordinates[i].length; j++) {
                                result[i][j] = [];
                                for (k = 0; k < coordinates[i][j].length; k++) {
                                    result[i][j][k] = toGeodeticPos(coordinates[i][j][k]);
                                }
                            }
                        }

                        return isMultiPolygon ? result : isMultiLineStringOrPolygon ? result[0] : isMultiPointOrLineString ? result[0][0] : result[0][0][0];
                    }
                }
            };
        }()),

        //
        // service types (defined in other files)
        //

        _serviceTypes: {}
    };
}(jQuery, this));

(function ($, window, undefined) {
    var _ieVersion = (function () {
        var v = 5, div = document.createElement("div"), a = div.all || [];
        do {
            div.innerHTML = "<!--[if gt IE " + (++v) + "]><br><![endif]-->";
        } while (a[0]);
        return v > 6 ? v : !v;
    }());

    $.widget("geo.geographics", {
        _$elem: undefined,
        _options: {},
        _trueCanvas: true,
        _trueDoubleBuffer: true,

        _width: 0,
        _height: 0,

        _$canvas: undefined,
        _context: undefined,

        _$canvasSceneFront: undefined, //< if _trueCanvas, where canvas images get written (front buffer)
        _$canvasSceneBack: undefined, //< if _trueCanvas, where canvas images get written (back buffer)
        _$canvasSceneStale: undefined, //< if _trueCanvas, scene to hide next
        _$canvasSceneDrawn: undefined, //< if _trueCanvas, scene to show next
        _timeoutEnd: null,
        _requireFlip: false,

        _blitcanvas: undefined,
        _blitcontext: undefined,

        _$labelsContainerFront: undefined,
        _$labelsContainerBack: undefined,
        _labelsHtml: "",

        options: {
            style: {
                borderRadius: "8px",
                color: "#7f0000",
                //fill: undefined,
                fillOpacity: 0.2,
                height: "8px",
                opacity: 1,
                //stroke: undefined,
                strokeOpacity: 1,
                strokeWidth: "2px",
                visibility: "visible",
                width: "8px"
            },

            doubleBuffer: true
        },

        _create: function () {
            this._$elem = this.element;
            this._options = this.options;

            this._$elem.css({
                webkitTransform: "translateZ(0)",
                display: "inline-block",
                overflow: "hidden",
                textAlign: "left"
            });

            if (this._$elem.css("position") === "static") {
                this._$elem.css("position", "relative");
            }

            this._$elem.addClass("geo-graphics");

            this._width = this._$elem.width();
            this._height = this._$elem.height();

            if (!(this._width && this._height)) {
                this._width = parseInt(this._$elem.css("width"), 10);
                this._height = parseInt(this._$elem.css("height"), 10);
            }

            var posCss = 'position:absolute;left:0;top:0;margin:0;padding:0;',
                sizeCss = 'width:' + this._width + 'px;height:' + this._height + 'px;',
                sizeAttr = 'width="' + this._width + '" height="' + this._height + '"';

            this._blitcanvas = document.createElement("canvas");

            if (this._blitcanvas.getContext) {
                this._$canvas = $(window.toStaticHTML('<canvas ' + sizeAttr + ' style="-webkit-transform:translateZ(0);' + posCss + '"></canvas>'));

                // test _trueDoubleBuffer
                this._blitcanvas.width = 1;
                this._blitcanvas.height = 1;
                this._trueDoubleBuffer = this._blitcanvas.toDataURL().length > 6;

                if (!(this._options.doubleBuffer && this._trueDoubleBuffer)) {
                    this._$elem.append(this._$canvas);
                }

                this._context = this._$canvas[0].getContext("2d");

                this._blitcanvas.width = this._width;
                this._blitcanvas.height = this._height;
                this._blitcontext = this._blitcanvas.getContext("2d");

                // create our front & back buffers
                // though, at any time either one can be in front
                this._$canvasSceneFront = $(window.toStaticHTML('<img id="scene0" style="-webkit-transform:translateZ(0);' + posCss + sizeCss + '" />')).on('load', $.proxy(this._canvasImgLoad, this));
                this._$canvasSceneBack = $(window.toStaticHTML('<img id="scene1" style="-webkit-transform:translateZ(0);' + posCss + sizeCss + '" />')).on('load', $.proxy(this._canvasImgLoad, this));

            } else if (_ieVersion <= 8) {
                this._trueCanvas = false;
                this._$elem.append('<div ' + sizeAttr + ' style="' + posCss + sizeCss + '"></div>');
                this._$canvas = this._$elem.children(':last');

                G_vmlCanvasManager.initElement(this._$canvas[0]);
                this._context = this._$canvas[0].getContext("2d");
                this._$canvas.children().css({ backgroundColor: "transparent", width: this._width, height: this._height });
            }

            // create our front & back label containers
            this._$labelsContainerFront = $(window.toStaticHTML('<div class="geo-labels-container" style="-webkit-transform:translateZ(0);' + posCss + sizeCss + '"></div>'));
            this._$labelsContainerBack = $(window.toStaticHTML('<div class="geo-labels-container" style="-webkit-transform:translateZ(0);' + posCss + sizeCss + '"></div>'));
        },

        _setOption: function (key, value) {
            if (key === "style") {
                value = $.extend({}, this._options.style, value);
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments);
            this._$elem.html("");
            this._$elem.removeClass("geo-graphics");
        },

        clear: function () {
            this._context.clearRect(0, 0, this._width, this._height);
            this._labelsHtml = "";
            this._end();
        },

        drawArc: function (coordinates, startAngle, sweepAngle, style) {
            style = this._getGraphicStyle(style);

            if (style.visibility !== "hidden" && style.opacity > 0 && style.widthValue > 0 && style.heightValue > 0) {
                var r = Math.min(style.widthValue, style.heightValue) / 2;

                startAngle = (startAngle * Math.PI / 180);
                sweepAngle = (sweepAngle * Math.PI / 180);

                this._context.save();
                this._context.translate(coordinates[0], coordinates[1]);
                if (style.widthValue > style.heightValue) {
                    this._context.scale(style.widthValue / style.heightValue, 1);
                } else {
                    this._context.scale(1, style.heightValue / style.widthValue);
                }

                this._context.beginPath();
                this._context.arc(0, 0, r, startAngle, sweepAngle, false);

                if (this._trueCanvas) {
                    this._context.restore();
                }

                if (style.doFill) {
                    this._context.fillStyle = style.fill;
                    this._context.globalAlpha = style.opacity * style.fillOpacity;
                    this._context.fill();
                }

                if (style.doStroke) {
                    this._context.lineJoin = "round";
                    this._context.lineWidth = style.strokeWidthValue;
                    this._context.strokeStyle = style.stroke;

                    this._context.globalAlpha = style.opacity * style.strokeOpacity;
                    this._context.stroke();
                }

                if (!this._trueCanvas) {
                    this._context.restore();
                }
            }

            this._end();
        },

        drawPoint: function (coordinates, style) {
            style = this._getGraphicStyle(style);
            if (style.widthValue === style.heightValue && style.heightValue === style.borderRadiusValue) {
                this.drawArc(coordinates, 0, 360, style);
            } else if (style.visibility !== "hidden" && style.opacity > 0) {
                style.borderRadiusValue = Math.min(Math.min(style.widthValue, style.heightValue) / 2, style.borderRadiusValue);
                coordinates[0] -= style.widthValue / 2;
                coordinates[1] -= style.heightValue / 2;
                this._context.beginPath();
                this._context.moveTo(coordinates[0] + style.borderRadiusValue, coordinates[1]);
                this._context.lineTo(coordinates[0] + style.widthValue - style.borderRadiusValue, coordinates[1]);
                this._context.quadraticCurveTo(coordinates[0] + style.widthValue, coordinates[1], coordinates[0] + style.widthValue, coordinates[1] + style.borderRadiusValue);
                this._context.lineTo(coordinates[0] + style.widthValue, coordinates[1] + style.heightValue - style.borderRadiusValue);
                this._context.quadraticCurveTo(coordinates[0] + style.widthValue, coordinates[1] + style.heightValue, coordinates[0] + style.widthValue - style.borderRadiusValue, coordinates[1] + style.heightValue);
                this._context.lineTo(coordinates[0] + style.borderRadiusValue, coordinates[1] + style.heightValue);
                this._context.quadraticCurveTo(coordinates[0], coordinates[1] + style.heightValue, coordinates[0], coordinates[1] + style.heightValue - style.borderRadiusValue);
                this._context.lineTo(coordinates[0], coordinates[1] + style.borderRadiusValue);
                this._context.quadraticCurveTo(coordinates[0], coordinates[1], coordinates[0] + style.borderRadiusValue, coordinates[1]);
                this._context.closePath();

                if (style.doFill) {
                    this._context.fillStyle = style.fill;
                    this._context.globalAlpha = style.opacity * style.fillOpacity;
                    this._context.fill();
                }

                if (style.doStroke) {
                    this._context.lineJoin = "round";
                    this._context.lineWidth = style.strokeWidthValue;
                    this._context.strokeStyle = style.stroke;

                    this._context.globalAlpha = style.opacity * style.strokeOpacity;

                    this._context.stroke();
                }

                this._end();
            }
        },

        drawLineString: function (coordinates, style) {
            this._drawLines([coordinates], false, style);
        },

        drawPolygon: function (coordinates, style) {
            if (!this._trueCanvas || coordinates.length === 1) {
                // either we don't have fancy rendering or there's no need for it (no holes)
                this._drawLines(coordinates, true, style);
            } else {
                if (!coordinates || !coordinates.length || coordinates[0].length < 3) {
                    // this is not a Polygon or it doesn't have a proper outer ring
                    return;
                }

                style = this._getGraphicStyle(style);
                this._blitcontext.globalCompositeOperation = "copy";

                var pixelBbox, i, j;

                if (style.visibility !== "hidden" && style.opacity > 0) {
                    this._blitcontext.clearRect(0, 0, this._width, this._height);

                    if (style.doFill) {
                        if (coordinates.length > 1) {
                            // stencil inner rings
                            this._blitcontext.globalCompositeOperation = "source-out";
                            this._blitcontext.globalAlpha = 1;

                            this._blitcontext.beginPath();

                            for (i = 1; i < coordinates.length; i++) {
                                // start drawing inner rings, i
                                this._blitcontext.moveTo(coordinates[i][0][0], coordinates[i][0][1]);

                                for (j = 0; j < coordinates[i].length; j++) {
                                    this._blitcontext.lineTo(coordinates[i][j][0], coordinates[i][j][1]);
                                }
                            }

                            this._blitcontext.closePath();

                            this._blitcontext.fill();
                        }
                    }

                    // path outer ring
                    this._blitcontext.beginPath();
                    this._blitcontext.moveTo(coordinates[0][0][0], coordinates[0][0][1]);

                    pixelBbox = [coordinates[0][0][0] - style.strokeWidthValue, coordinates[0][0][1] - style.strokeWidthValue, coordinates[0][0][0] + style.strokeWidthValue, coordinates[0][0][1] + style.strokeWidthValue];

                    for (i = 1; i < coordinates[0].length - 1; i++) {
                        this._blitcontext.lineTo(coordinates[0][i][0], coordinates[0][i][1]);

                        pixelBbox[0] = Math.min(coordinates[0][i][0] - style.strokeWidthValue, pixelBbox[0]);
                        pixelBbox[1] = Math.min(coordinates[0][i][1] - style.strokeWidthValue, pixelBbox[1]);
                        pixelBbox[2] = Math.max(coordinates[0][i][0] + style.strokeWidthValue, pixelBbox[2]);
                        pixelBbox[3] = Math.max(coordinates[0][i][1] + style.strokeWidthValue, pixelBbox[3]);
                    }

                    this._blitcontext.closePath();

                    if (style.doFill) {
                        // fill outer ring
                        this._blitcontext.fillStyle = style.fill;
                        this._blitcontext.globalAlpha = style.opacity * style.fillOpacity;
                        this._blitcontext.fill();
                    }

                    this._blitcontext.globalCompositeOperation = "source-over";
                    if (style.doStroke) {
                        // stroke outer ring
                        this._blitcontext.lineCap = this._blitcontext.lineJoin = "round";
                        this._blitcontext.lineWidth = style.strokeWidthValue;
                        this._blitcontext.strokeStyle = style.stroke;

                        this._blitcontext.globalAlpha = style.opacity * style.strokeOpacity;
                        this._blitcontext.stroke();

                        if (coordinates.length > 1) {
                            // stroke inner rings
                            for (i = 1; i < coordinates.length; i++) {
                                this._blitcontext.beginPath();
                                this._blitcontext.moveTo(coordinates[i][0][0], coordinates[i][0][1]);
                                for (j = 1; j < coordinates[i].length; j++) {
                                    this._blitcontext.lineTo(coordinates[i][j][0], coordinates[i][j][1]);
                                }
                                this._blitcontext.closePath();

                                this._blitcontext.stroke();
                            }
                        }
                    }

                    // blit
                    pixelBbox[0] = Math.min(Math.max(pixelBbox[0], 0), this._width);
                    pixelBbox[1] = Math.min(Math.max(pixelBbox[1], 0), this._height);
                    pixelBbox[2] = Math.min(Math.max(pixelBbox[2], 0), this._width);
                    pixelBbox[3] = Math.min(Math.max(pixelBbox[3], 0), this._height);

                    if (pixelBbox[0] !== pixelBbox[2] && pixelBbox[1] !== pixelBbox[3]) {
                        this._context.drawImage(this._blitcanvas, pixelBbox[0], pixelBbox[1], pixelBbox[2] - pixelBbox[0], pixelBbox[3] - pixelBbox[1], pixelBbox[0], pixelBbox[1], pixelBbox[2] - pixelBbox[0], pixelBbox[3] - pixelBbox[1]);

                        this._end();
                    }
                }
            }
        },

        drawBbox: function (bbox, style) {
            this._drawLines([[
              [bbox[0], bbox[1]],
              [bbox[0], bbox[3]],
              [bbox[2], bbox[3]],
              [bbox[2], bbox[1]],
              [bbox[0], bbox[1]]
            ]], true, style);
        },

        drawLabel: function (coordinates, label) {
            this._labelsHtml += '<div class="geo-label" style="-webkit-transform:translateZ(0);position:absolute; left:' + (coordinates[0] / this._width * 100) + '%; top:' + (coordinates[1] / this._height * 100) + '%;">' + label + '</div>';
        },

        resize: function (dx, dy) {
            this._width = this._$elem.width();
            this._height = this._$elem.height();

            if (!(this._width && this._height)) {
                this._width = parseInt(this._$elem.css("width"), 10);
                this._height = parseInt(this._$elem.css("height"), 10);
            }

            if (this._trueCanvas) {
                this._$canvas[0].width = this._width;
                this._$canvas[0].height = this._height;

                this._$canvasSceneFront.css({
                    left: dx,
                    top: dy
                });

                this._$canvasSceneBack.css({
                    width: this._width,
                    height: this._height
                });
            } else {
                this._$canvas.css({
                    width: this._width,
                    height: this._height
                });
            }

            var labelPositionFront = this._$labelsContainerFront.position();

            this._$labelsContainerFront.css({
                left: labelPositionFront.left + dx,
                top: labelPositionFront.top + dy,
                width: this._width,
                height: this._height
            });

            this._$labelsContainerBack.css({
                width: this._width,
                height: this._height
            });
        },

        interactiveTransform: function (origin, scale) {
            if (this._timeoutEnd) {
                clearTimeout(this._timeoutEnd);
                this._timeoutEnd = null;
            }

            if (this._trueCanvas && this._options.doubleBuffer && this._trueDoubleBuffer) {
                this._canvasSceneLoad();

                // transform a finished scene, can assume no drawing during these calls
                this._$canvasSceneFront.css({
                    left: Math.round(origin[0]),
                    top: Math.round(origin[1]),
                    width: this._width * scale,
                    height: this._height * scale
                });
            } else {
                this._context.clearRect(0, 0, this._width, this._height);
            }

            // transform labels
            this._$labelsContainerFront.css({
                left: Math.round(origin[0]),
                top: Math.round(origin[1]),
                width: this._width * scale,
                height: this._height * scale
            });
        },

        _canvasImgLoad: function () {
            var geographics = this;
            geographics._$canvasSceneFront = geographics._$canvasSceneDrawn.prependTo(geographics._$elem);
            geographics._$canvasSceneBack = geographics._$canvasSceneStale;
            geographics._$canvasSceneBack.detach();
        },

        _canvasSceneLoad: function () {
            var geographics = this;
            if (geographics._requireFlip) {
                geographics._requireFlip = false;
                geographics._$canvasSceneStale = geographics._$canvasSceneFront;

                geographics._$canvasSceneDrawn = geographics._$canvasSceneBack.css({
                    left: 0,
                    top: 0,
                    width: geographics._width,
                    height: geographics._height
                }).prop("src", geographics._$canvas[0].toDataURL());
            }
        },

        _endCallback: function () {
            var geographics = this;

            if (!geographics._timeoutEnd) {
                // something has canceled the draw
                return;
            }

            if (geographics._trueCanvas && geographics._options.doubleBuffer && geographics._trueDoubleBuffer) {
                this._canvasSceneLoad();
            }

            geographics._$labelsContainerBack.html(window.toStaticHTML(geographics._labelsHtml)).find("a").css({
                position: "relative",
                zIndex: 1,
                display: "inline-block",
                webkitTransform: "translateZ(0)"
            });

            var oldLabelsContainer = geographics._$labelsContainerFront;

            geographics._$labelsContainerFront = geographics._$labelsContainerBack.css({
                left: 0,
                top: 0,
                width: geographics._width,
                height: geographics._height
            }).appendTo(geographics._$elem);

            geographics._$labelsContainerBack = oldLabelsContainer.detach();

            geographics._timeoutEnd = null;
        },

        _end: function () {
            // end/finalize a scene
            if (this._timeoutEnd) {
                clearTimeout(this._timeoutEnd);
                this._timeoutEnd = null;
            }

            this._requireFlip = true;

            this._timeoutEnd = setTimeout($.proxy(this._endCallback, this), 20);
        },

        _getGraphicStyle: function (style) {
            function safeParse(value) {
                value = parseInt(value, 10);
                return (+value + '') === value ? +value : value;
            }

            style = $.extend({}, this._options.style, style);
            style.borderRadiusValue = safeParse(style.borderRadius);
            style.fill = style.fill || style.color;
            style.doFill = style.fill && style.fillOpacity > 0;
            style.stroke = style.stroke || style.color;
            style.strokeWidthValue = safeParse(style.strokeWidth);
            style.doStroke = style.stroke && style.strokeOpacity > 0 && style.strokeWidthValue > 0;
            style.widthValue = safeParse(style.width);
            style.heightValue = safeParse(style.height);
            return style;
        },

        _drawLines: function (coordinates, close, style) {
            if (!coordinates || !coordinates.length || coordinates[0].length < 2) {
                return;
            }

            var i, j;
            style = this._getGraphicStyle(style);

            if (style.visibility !== "hidden" && style.opacity > 0) {
                this._context.beginPath();

                for (i = 0; i < coordinates.length; i++) {
                    this._context.moveTo(coordinates[i][0][0], coordinates[i][0][1]);
                    for (j = 1; j < coordinates[i].length; j++) {
                        this._context.lineTo(coordinates[i][j][0], coordinates[i][j][1]);
                    }
                }

                if (close) {
                    this._context.closePath();
                }

                if (close && style.doFill) {
                    this._context.fillStyle = style.fill;
                    this._context.globalAlpha = style.opacity * style.fillOpacity;
                    this._context.fill();
                }

                if (style.doStroke) {
                    this._context.lineCap = this._context.lineJoin = "round";
                    this._context.lineWidth = style.strokeWidthValue;
                    this._context.strokeStyle = style.stroke;

                    this._context.globalAlpha = style.opacity * style.strokeOpacity;
                    this._context.stroke();
                }

                this._end();
            }
        }
    });
}(jQuery, window));


(function ($, window, undefined) {
    var _widgetIdSeed = 0,
        _ieVersion = (function () {
            var v = 5, div = document.createElement("div"), a = div.all || [];
            do {
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><br/><![endif]-->";
            } while (a[0]);
            return v > 6 ? v : !v;
        }()),

        _gecko = (function () {
            return (navigator.userAgent.match(/gecko\/*\d/i) || []).length > 0;
        }()),

        _defaultOptions = {
            bbox: [-180, -85, 180, 85],
            bboxMax: [-180, -85, 180, 85],
            center: [0, 0],
            cursors: {
                "static": "default",
                pan: "url(data:image/vnd.microsoft.icon;base64,AAACAAEAICACAAgACAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAA//AAAd/wAAGf+AAAH9gAADbYAAA2yAAAZsAAAGbAAAAGAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//4AB//8AAf//AAD//5AA///gAP//4AD//8AF///AB///5A////5///8=), move",
                click: "crosshair",
                zoom: "crosshair",
                dragBox: "crosshair",
                dragCircle: "crosshair",
                drawPoint: "crosshair",
                drawLineString: "crosshair",
                drawPolygon: "crosshair",
                measureLength: "crosshair",
                measureArea: "crosshair"
            },
            measureLabels: {
                length: "{{:length.toFixed( 2 )}} m",
                area: "{{:area.toFixed( 2 )}} sq m"
            },
            drawStyle: {},
            shapeStyle: {},
            mode: "pan",
            pannable: true,
            scroll: "default",
            shift: "default",
            services: [
                {
                    "class": "osm",
                    type: "tiled",
                    src: function (view) {
                        return "//" + String.fromCharCode(97 + (view.index % 3)) + ".tile.openstreetmap.org/" + view.zoom + "/" + view.tile.column + "/" + view.tile.row + ".png";
                    },
                    attr: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                }
            ],
            tilingScheme: {
                tileWidth: 256,
                tileHeight: 256,
                levels: 18,
                basePixelSize: 156543.03392799936,
                origin: [-20037508.342787, 20037508.342787]
            },
            axisLayout: "map",
            zoom: 0,
            zoomMin: 0,
            zoomMax: Number.POSITIVE_INFINITY,
            zoomFactor: 2, //< determines what a zoom level means
            pixelSize: 0
        };

    $.widget("geo.geomap", {
        // private widget members
        _$elem: undefined, //< map div for maps, service div for services
        _map: undefined, //< only defined in services
        _created: false,
        _createdGraphics: false,
        _widgetId: 0,
        _tmplLengthId: "",
        _tmplAreaId: "",

        _contentBounds: {},

        _$resizeContainer: undefined, //< all elements that should match _contentBounds' size

        _$eventTarget: undefined,
        _$contentFrame: undefined,
        _$existingChildren: undefined,
        _$attrList: undefined,
        _$servicesContainer: undefined,
        _$shapesContainers: undefined, //< all shapesContainer divs (map only)

        _$panContainer: undefined, //< all non-service elements that move while panning
        _$shapesContainer: undefined, //< just "our" shapesContainer div (map & service)
        _$drawContainer: undefined,
        _$measureContainer: undefined,
        _$measureLabel: undefined,

        _dpi: 96,

        _currentServices: [], //< internal copy

        _center: undefined,
        _pixelSize: undefined,
        _centerMax: undefined,
        _pixelSizeMax: undefined,
        _pixelSizeMin: undefined,

        _userGeodetic: true,

        _centerInteractive: undefined,
        _pixelSizeInteractive: undefined,
        _timeoutInteractive: null,
        _timeoutWheel: null,
        _triggerInteractive: false,

        _timeoutRefreshShapes: null,

        _loadCount: 0,

        _wheelLevel: 0,

        _fullZoomFactor: 2, //< interactiveScale factor needed to zoom a whole level
        _partialZoomFactor: 1.18920711500273, //< interactiveScale factor needed to zoom a fraction of a level (the fourth root of 2)

        _mouseDown: undefined,
        _inOp: undefined,
        _toolPan: undefined,
        _shiftDown: undefined,
        _anchor: undefined,
        _current: undefined,
        _downDate: undefined,
        _moveDate: undefined,
        _clickDate: undefined,
        _lastMove: undefined,
        _lastDrag: undefined,

        _windowHandler: null,
        _resizeTimeout: null,

        _panning: undefined,
        _velocity: undefined,
        _friction: undefined,

        _pointerEvents: undefined,
        _supportTouch: undefined,
        _softDblClick: undefined,
        _isTap: undefined,
        _isDbltap: undefined,

        _isMultiTouch: undefined,
        _multiTouchAnchor: [], //< TouchList
        _multiTouchAnchorBbox: undefined, //< bbox
        _multiTouchCurrentBbox: undefined, //< bbox

        _drawTimeout: null, //< used in drawPoint mode so we don't send two shape events on dbltap
        _drawPixels: [], //< an array of coordinate arrays for drawing lines & polygons, in pixel coordinates
        _drawCoords: [],

        _graphicShapes: [], //< an array of objects containing style object refs & GeoJSON object refs

        _initOptions: {},

        _options: {},

        options: $.extend({}, _defaultOptions),

        _createWidget: function (options, element) {
            this._$elem = $(element);

            if (this._$elem.is(".geo-service")) {
                this._graphicShapes = [];
                $.Widget.prototype._createWidget.apply(this, arguments);
                return;
            }

            this._widgetId = _widgetIdSeed++;
            this._serviceIdSeed = 0;
            this._tmplLengthId = "geoMeasureLength" + this._widgetId;
            this._tmplAreaId = "geoMeasureArea" + this._widgetId;

            this._$elem.addClass("geo-map").css({
                webkitTransform: "translateZ(0)",
                touchAction: 'none'
            });

            this._initOptions = options || {};

            this._forcePosition(this._$elem);

            this._$elem.css("text-align", "left");

            var size = this._findMapSize();
            this._contentBounds = {
                x: parseInt(this._$elem.css("padding-left"), 10),
                y: parseInt(this._$elem.css("padding-top"), 10),
                width: size["width"],
                height: size["height"]
            };

            this._createChildren();

            this._center = [0, 0];
            this._centerMax = [0, 0];
            this._centerInteractive = [0, 0];

            this.options["pixelSize"] = this._pixelSize = this._pixelSizeMax = 156543.03392799936;
            this._pixelSizeMin = this._pixelSizeMax / Math.pow(2, 17);

            this._mouseDown =
                this._inOp =
                this._toolPan =
                this._shiftDown =
                this._panning =
                this._isTap =
                this._isDbltap =
                this._isMultiTouch = false;

            this._anchor = [0, 0]; /* mouse down */
            this._current = [0, 0]; /* mouse move no matter what */
            this._lastMove = [0, 0];
            this._lastDrag = [0, 0];
            this._velocity = [0, 0];

            this._friction = [0.8, 0.8];

            this._downDate =
                this._moveDate =
                this._clickDate = 0;

            this._drawPixels = [];
            this._drawCoords = [];
            this._graphicShapes = [];


            $.Widget.prototype._createWidget.apply(this, arguments);
        },

        _create: function () {
            this._options = this.options;

            if (this._$elem.is(".geo-service")) {
                this._map = this._$elem.data("geoMap");
                this._$elem.data("geoService", this);
                return;
            }

            this._map = this;

            this._pointerEvents = window.PointerEvent;
            this._supportTouch = ("ontouchend" in document);
            this._softDblClick = this._pointerEvents || this._supportTouch || _ieVersion === 7;

            var geomap = this,
                touchStartEvent = this._pointerEvents ? 'pointerdown' : (this._supportTouch ? "touchstart mousedown" : "mousedown"),
                touchStopEvent = this._pointerEvents ? 'pointerup pointercancel' : (this._supportTouch ? "touchend touchcancel mouseup" : "mouseup"),
                touchMoveEvent = this._pointerEvents ? 'pointermove' : (this._supportTouch ? "touchmove mousemove" : "mousemove");

            $(document).keydown($.proxy(this._document_keydown, this));

            if (this._softDblClick) {
                this._$eventTarget.on('softdblclick', $.proxy(this._eventTarget_dblclick, this));
            } else {
                this._$eventTarget.dblclick($.proxy(this._eventTarget_dblclick, this));
            }

            this._$eventTarget.bind(touchStartEvent, $.proxy(this._eventTarget_touchstart, this));

            var dragTarget = (this._$eventTarget[0].setCapture || this._pointerEvents) ? this._$eventTarget : $(document);
            dragTarget.bind(touchMoveEvent, $.proxy(this._dragTarget_touchmove, this));
            dragTarget.bind(touchStopEvent, $.proxy(this._dragTarget_touchstop, this));

            this._$eventTarget.mousewheel($.proxy(this._eventTarget_mousewheel, this));

            this._windowHandler = function () {
                if (geomap._resizeTimeout) {
                    clearTimeout(geomap._resizeTimeout);
                }
                geomap._resizeTimeout = setTimeout(function () {
                    if (geomap._created) {
                        geomap._$elem.geomap("resize", true);
                    }
                }, 500);
            };

            $(window).resize(this._windowHandler);

            this._$drawContainer.geographics({ style: this._initOptions.drawStyle || {}, doubleBuffer: false });
            this._options["drawStyle"] = this._$drawContainer.geographics("option", "style");

            this._$shapesContainer.geographics({ style: this._initOptions.shapeStyle || {}, doubleBuffer: !_gecko });
            this._createdGraphics = true;

            this._options["shapeStyle"] = this._$shapesContainer.geographics("option", "style");

            if (this._initOptions) {
                // always init tilingScheme right away, even if it's null
                if (this._initOptions.tilingScheme !== undefined) {
                    this._setOption("tilingScheme", this._initOptions.tilingScheme || null, false);
                }

                if (this._initOptions.services) {
                    // jQuery UI Widget Factory merges user services with our default, we want to clobber the default
                    this._options["services"] = $.merge([], this._initOptions.services);
                }
                if (this._initOptions.bboxMax) {
                    this._setOption("bboxMax", this._initOptions.bboxMax, false);
                    this._setOption("bbox", this._initOptions.bboxMax, false);
                }
                if (this._initOptions.zoomMin !== undefined) {
                    this._setOption("zoomMin", this._initOptions.zoomMin, false);
                }
                if (this._initOptions.zoomMax !== undefined) {
                    this._setOption("zoomMax", this._initOptions.zoomMax, false);
                }
                if (this._initOptions.zoomFactor !== undefined) {
                    this._setOption("zoomFactor", this._initOptions.zoomFactor, false);
                    this._fullZoomFactor = this._initOptions.zoomFactor;
                    this._partialZoomFactor = Math.pow(4, 1 / this._fullZoomFactor); // 4th root of full
                }
                if (this._initOptions.bbox) {
                    this._setOption("bbox", this._initOptions.bbox, false);
                }
                if (this._initOptions.center) {
                    this._setOption("center", this._initOptions.center, false);
                }
                if (this._initOptions.zoom !== undefined) {
                    this._setOption("zoom", this._initOptions.zoom, false);
                }
            }

            $.templates(this._tmplLengthId, this._options["measureLabels"].length);
            $.templates(this._tmplAreaId, this._options["measureLabels"].area);

            this._$eventTarget.css("cursor", this._options["cursors"][this._options["mode"]]);

            this._createServices();
            this._refresh();

            this._created = true;
        },

        _setOption: function (key, value, refresh) {
            if (key === "pixelSize") {
                return;
            }

            refresh = (refresh === undefined || refresh);

            if (this._$elem.is(".geo-map")) {
                this._panFinalize();
            }

            var center, pixelSize, bbox, zoom;

            switch (key) {
                case "bbox":
                    if (this._created) {
                        this._clearInteractiveTimeout();
                    }

                    this._userGeodetic = this._options["axisLayout"] === "map" && $.geo.proj && $.geo._isGeodetic(value);
                    if (this._userGeodetic) {
                        value = $.geo.proj.fromGeodetic(value);
                    }

                    center = [value[0] + (value[2] - value[0]) / 2, value[1] + (value[3] - value[1]) / 2];
                    pixelSize = Math.max($.geo.width(value, true) / this._contentBounds.width, $.geo.height(value, true) / this._contentBounds.height);

                    // clamp to zoom
                    zoom = this._getZoom(center, pixelSize);

                    if (this._options["tilingScheme"]) {
                        pixelSize = this._getPixelSize(Math.min(Math.max(zoom, this._options["zoomMin"]), this._options["zoomMax"]));
                    } else {
                        if (zoom < this._options["zoomMin"]) {
                            pixelSize = this._getPixelSize(this._options["zoomMin"]);
                        } else if (zoom > this._options["zoomMax"]) {
                            pixelSize = this._getPixelSize(this._options["zoomMax"]);
                        }
                    }

                    if (this._created) {
                        this._setInteractiveCenterAndSize(center, pixelSize);
                        this._setInteractiveTimeout(false);
                    } else {
                        this._setCenterAndSize(center, pixelSize, false, refresh);
                    }

                    value = this._getBbox(center, pixelSize);
                    break;

                case "bboxMax":
                    this._userGeodetic = this._options["axisLayout"] === "map" && $.geo.proj && $.geo._isGeodetic(value);
                    break;

                case "center":
                    if (this._created) {
                        this._clearInteractiveTimeout();
                    }

                    this._userGeodetic = this._options["axisLayout"] === "map" && $.geo.proj && $.geo._isGeodetic(value);
                    if (this._userGeodetic) {
                        value = $.geo.proj.fromGeodetic(value);
                    }

                    if (this._created) {
                        this._setInteractiveCenterAndSize(value, this._pixelSizeInteractive);
                        this._interactiveTransform();
                        this._setInteractiveTimeout(false);
                    } else {
                        this._setCenterAndSize(value, this._pixelSize, false, refresh);
                    }
                    break;

                case "measureLabels":
                    value = $.extend(this._options["measureLabels"], value);


                    $.templates(this._tmplLengthId, this._options["measureLabels"].length);
                    $.templates(this._tmplAreaId, this._options["measureLabels"].area);

                    break;

                case "drawStyle":
                    if (this._$drawContainer) {
                        this._$drawContainer.geographics("option", "style", value);
                        value = this._$drawContainer.geographics("option", "style");
                    }
                    break;

                case "shapeStyle":
                    if (this._$elem.is(".geo-service") && !this._createdGraphics) {
                        this._createServiceGraphics();
                    }

                    if (this._createdGraphics) {
                        this._$shapesContainer.geographics("option", "style", value);
                        value = this._$shapesContainer.geographics("option", "style");
                    }
                    break;

                case "mode":
                    this._resetDrawing();
                    this._$eventTarget.css("cursor", this._options["cursors"][value]);
                    break;

                case "zoom":
                    this._userGeodetic = this._options["axisLayout"] === "map" && $.geo.proj;
                    if (this._created) {
                        this._setZoom(value, false, refresh);
                    } else {
                        value = Math.max(value, 0);
                        this._setCenterAndSize(this._center, this._getPixelSize(value), false, refresh);
                    }
                    break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);

            switch (key) {
                case "bbox":
                case "center":
                    if (this._userGeodetic) {
                        this._options["bbox"] = $.geo.proj.toGeodetic(this._options["bbox"]);
                        this._options["center"] = $.geo.proj.toGeodetic(this._center);
                    }
                    break;

                case "tilingScheme":
                    if (value !== null) {
                        this._pixelSizeMax = this._getPixelSize(0);
                        this._pixelSizeMin = this._getPixelSize(value.pixelSizes ? value.pixelSizes.length - 1 : value.levels - 1);
                        this._centerMax = [
                          value.origin[0] + this._pixelSizeMax * value.tileWidth / 2,
                          value.origin[1] + this._pixelSizeMax * value.tileHeight / 2
                        ];
                    }
                    break;

                case "bboxMax":
                    if (this._userGeodetic) {
                        bbox = $.geo.proj.fromGeodetic(value);
                    } else {
                        bbox = value;
                    }

                    this._centerMax = $.geo.center(bbox);
                    this._pixelSizeMax = Math.max($.geo.width(bbox, true) / this._contentBounds.width, $.geo.height(bbox, true) / this._contentBounds.height);
                    break;

                case "services":
                    this._createServices();
                    if (refresh) {
                        this._refresh();
                        this._refreshAllShapes();
                    }
                    break;

                case "shapeStyle":
                    if (refresh && this._createdGraphics) {
                        this._$shapesContainer.geographics("clear");
                        this._refreshShapes(this._$shapesContainer, this._graphicShapes, this._graphicShapes, this._graphicShapes);
                    }
                    break;
            }
        },

        destroy: function () {
            if (this._$elem.is(".geo-service")) {
                if (this._createdGraphics) {
                    this._$shapesContainer.geographics("destroy");
                    this._$shapesContainer = undefined;
                    this._createdGraphics = false;
                }
            } else {
                clearTimeout(this._timeoutInteractive);
                this._timeoutInteractive = null;

                this._created = false;

                $(window).unbind("resize", this._windowHandler);

                for (var i = 0; i < this._currentServices.length; i++) {
                    this._currentServices[i].serviceContainer.geomap("destroy");
                    $.geo["_serviceTypes"][this._currentServices[i].type].destroy(this, this._$servicesContainer, this._currentServices[i]);
                }

                this._$shapesContainer.geographics("destroy");
                this._$shapesContainer = undefined;
                this._createdGraphics = false;

                this._$drawContainer.geographics("destroy");
                this._$drawContainer = undefined;

                this._$existingChildren.detach();
                this._$elem.html("");
                this._$elem.append(this._$existingChildren);
                this._$elem.removeClass("geo-map");
            }

            $.Widget.prototype.destroy.apply(this, arguments);
        },

        toMap: function (p) {
            p = this._toMap(p);
            return this._userGeodetic ? $.geo.proj.toGeodetic(p) : p;
        },

        toPixel: function (p, _center /* Internal Use Only */, _pixelSize /* Internal Use Only */) {
            return this._toPixel($.geo.proj ? $.geo.proj.fromGeodetic(p) : p, _center, _pixelSize);
        },

        opacity: function (value, _serviceContainer) {
            if (this._$elem.is(".geo-service")) {
                this._$elem.closest(".geo-map").geomap("opacity", value, this._$elem);
            } else {
                if (value >= 0 || value <= 1) {
                    for (var i = 0; i < this._currentServices.length; i++) {
                        var service = this._currentServices[i];
                        if (!_serviceContainer || service.serviceContainer[0] === _serviceContainer[0]) {
                            service.style.opacity = value;

                            // update the original service object's style property
                            service.serviceObject.style = $.extend({}, service.serviceObject.style, service.style);

                            $.geo["_serviceTypes"][service.type].opacity(this, service);
                        }
                    }
                }
            }
        },

        toggle: function (value, _serviceContainer) {
            if (this._$elem.is(".geo-service")) {
                this._$elem.closest(".geo-map").geomap("toggle", value, this._$elem);
            } else {

                for (var i = 0; i < this._currentServices.length; i++) {
                    var service = this._currentServices[i];

                    if (!_serviceContainer || service.serviceContainer[0] === _serviceContainer[0]) {
                        if (value === undefined) {
                            // toggle visibility
                            value = (service.style.visibility !== "visible");
                        }

                        service.style.visibility = (value ? "visible" : "hidden");

                        // update the original service object's style property
                        service.serviceObject.style = $.extend({}, service.serviceObject.style, service.style);

                        service.serviceContainer.toggle(value);

                        if (value) {
                            $.geo["_serviceTypes"][service.type].refresh(this, service);
                        }
                    }
                }
            }
        },

        zoom: function (numberOfLevels) {
            if (numberOfLevels !== null) {
                this._setZoom(this._options["zoom"] + numberOfLevels, false, true);
            }
        },

        refresh: function (force, _serviceContainer) {
            if (!this._panning) {
                if (this._$elem.is(".geo-service")) {
                    this._$elem.closest(".geo-map").geomap("refresh", force, this._$elem);
                } else {
                    this._refresh(force, _serviceContainer);
                    this._refreshAllShapes(_serviceContainer);
                }
            }
        },

        resize: function (_trigger /* Internal Use Only */) {
            var size = this._findMapSize(),
                dx = size["width"] / 2 - this._contentBounds.width / 2,
                dy = size["height"] / 2 - this._contentBounds.height / 2,
                i;

            this._contentBounds = {
                x: parseInt(this._$elem.css("padding-left"), 10),
                y: parseInt(this._$elem.css("padding-top"), 10),
                width: size["width"],
                height: size["height"]
            };

            this._$resizeContainer.css({
                width: size["width"],
                height: size["height"]
            });

            for (i = 0; i < this._currentServices.length; i++) {
                $.geo["_serviceTypes"][this._currentServices[i].type].resize(this, this._currentServices[i], dx, dy);
            }

            this._$elem.find(".geo-graphics").css({
                width: size["width"],
                height: size["height"]
            }).geographics("resize", dx, dy);

            for (i = 0; i < this._drawPixels.length; i++) {
                this._drawPixels[i][0] += dx;
                this._drawPixels[i][1] += dy;
            }

            this._setCenterAndSize(this._center, this._pixelSize, _trigger, true);
        },

        append: function (shape /* , style, label, refresh */) {
            if (shape && ($.isPlainObject(shape) || ($.isArray(shape) && shape.length > 0))) {
                if (!this._createdGraphics) {
                    this._createServiceGraphics();
                }

                var shapes, arg, i, realStyle, realLabel, realRefresh;

                if ($.isArray(shape)) {
                    shapes = shape;
                } else if (shape.type === "FeatureCollection") {
                    shapes = shape.features;
                } else {
                    shapes = [shape];
                }

                for (i = 1; i < arguments.length; i++) {
                    arg = arguments[i];

                    if (arg !== null) {
                        if (typeof arg === "object") {
                            realStyle = arg;
                        } else if (typeof arg === "number" || typeof arg === "string") {
                            realLabel = arg;
                        } else if (typeof arg === "boolean") {
                            realRefresh = arg;
                        }
                    }
                }

                for (i = 0; i < shapes.length; i++) {
                    if (!$.data(shapes[i], "geoBbox")) {
                        var bbox = $.geo.bbox(shapes[i]);
                        if ($.geo.proj && $.geo._isGeodetic(bbox)) {
                            bbox = $.geo.proj.fromGeodetic(bbox);
                        }
                        $.data(shapes[i], "geoBbox", bbox);
                    }

                    this._graphicShapes.push({
                        shape: shapes[i],
                        style: realStyle,
                        label: realLabel
                    });
                }

                if (realRefresh === undefined || realRefresh) {
                    if (this._$elem.is(".geo-service")) {
                        this._refresh(false, this._$elem);
                    } else {
                        this._refresh();
                    }
                    this._refreshAllShapes();
                }
            }
        },

        empty: function (refresh) {
            this._graphicShapes = [];

            if (refresh === undefined || refresh) {
                if (this._$elem.is(".geo-service")) {
                    this._refresh(false, this._$elem);
                } else {
                    this._refresh();
                }
                this._refreshAllShapes();
            }
        },

        find: function (selector, pixelTolerance) {
            if (this._timeoutInteractive) {
                return [];
            }

            var isPoint = $.isPlainObject(selector),
                //searchPixel = isPoint ? this._map.toPixel( selector.coordinates ) : undefined,
                mapTol = this._map._pixelSize * pixelTolerance,
                result = [],
                graphicShape,
                geometries,
                curGeom,
                i;

            if (this._$elem.is(".geo-map")) {
                $(this._$elem.find(".geo-service").get().reverse()).each(function () {
                    result = $.merge(result, $(this).geomap("find", selector, pixelTolerance));
                });
            }

            for (i = this._graphicShapes.length - 1; i >= 0; i--) {
                graphicShape = this._graphicShapes[i];

                if (isPoint) {
                    if (graphicShape.shape.type === "Point") {
                        if ($.geo.distance(graphicShape.shape, selector) <= mapTol) {
                            result.push(graphicShape.shape);
                        }
                    } else {
                        var bbox = $.data(graphicShape.shape, "geoBbox"),
                            bboxPolygon = {
                                type: "Polygon",
                                coordinates: [[
                                  [bbox[0], bbox[1]],
                                  [bbox[0], bbox[3]],
                                  [bbox[2], bbox[3]],
                                  [bbox[2], bbox[1]],
                                  [bbox[0], bbox[1]]
                                ]]
                            },
                            projectedPoint = {
                                type: "Point",
                                coordinates: $.geo.proj && $.geo._isGeodetic(selector.coordinates) ? $.geo.proj.fromGeodetic(selector.coordinates) : selector.coordinates
                            };

                        if ($.geo.distance(bboxPolygon, projectedPoint, true) <= mapTol) {
                            geometries = $.geo._basic(graphicShape.shape);
                            for (curGeom = 0; curGeom < geometries.length; curGeom++) {
                                if ($.geo.distance(geometries[curGeom], selector) <= mapTol) {
                                    result.push(graphicShape.shape);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    result.push(graphicShape.shape);
                }
            }

            return result;
        },

        remove: function (shape, refresh) {
            if (shape && ($.isPlainObject(shape) || ($.isArray(shape) && shape.length > 0))) {
                var shapes = $.isArray(shape) ? shape : [shape],
                    rest;

                for (var i = 0; i < this._graphicShapes.length; i++) {
                    if ($.inArray(this._graphicShapes[i].shape, shapes) >= 0) {
                        rest = this._graphicShapes.slice(i + 1);
                        this._graphicShapes.length = i;
                        this._graphicShapes.push.apply(this._graphicShapes, rest);
                        i--;
                    }
                }

                if (refresh === undefined || refresh) {
                    if (this._$elem.is(".geo-service")) {
                        this._refresh(false, this._$elem);
                    } else {
                        this._refresh();
                    }
                    this._refreshAllShapes();
                }
            }
        },

        _getBbox: function (center, pixelSize) {
            center = center || this._center;
            pixelSize = pixelSize || this._pixelSize;

            // calculate the internal bbox
            var halfWidth = this._contentBounds["width"] / 2 * pixelSize,
                halfHeight = this._contentBounds["height"] / 2 * pixelSize;
            return [center[0] - halfWidth, center[1] - halfHeight, center[0] + halfWidth, center[1] + halfHeight];
        },

        _setBbox: function (value /* , trigger, refresh */) {
            var center = [value[0] + (value[2] - value[0]) / 2, value[1] + (value[3] - value[1]) / 2],
                pixelSize = Math.max($.geo.width(value, true) / this._contentBounds.width, $.geo.height(value, true) / this._contentBounds.height),
                zoom = this._getZoom(center, pixelSize);

            // clamp to zoom
            if (this._options["tilingScheme"]) {
                pixelSize = this._getPixelSize(Math.min(Math.max(zoom, this._options["zoomMin"]), this._options["zoomMax"]));
            } else {
                if (zoom < this._options["zoomMin"]) {
                    pixelSize = this._getPixelSize(this._options["zoomMin"]);
                } else if (zoom > this._options["zoomMax"]) {
                    pixelSize = this._getPixelSize(this._options["zoomMax"]);
                }
            }

            this._setInteractiveCenterAndSize(center, pixelSize);
            this._interactiveTransform();
        },

        _getBboxMax: function () {
            // calculate the internal bboxMax
            var halfWidth = this._contentBounds["width"] / 2 * this._pixelSizeMax,
              halfHeight = this._contentBounds["height"] / 2 * this._pixelSizeMax;
            return [this._centerMax[0] - halfWidth, this._centerMax[1] - halfHeight, this._centerMax[0] + halfWidth, this._centerMax[1] + halfHeight];
        },

        _getCenter: function () {
            return this._center;
        },

        _getContentBounds: function () {
            return this._contentBounds;
        },

        _getServicesContainer: function () {
            return this._$servicesContainer;
        },

        _getZoom: function (center, pixelSize) {
            // calculate the internal zoom level, vs. public zoom property
            // this does not take zoomMin or zoomMax into account
            center = center || this._center;
            pixelSize = pixelSize || this._pixelSize;

            var tilingScheme = this._options["tilingScheme"];
            if (tilingScheme) {
                if (tilingScheme.pixelSizes) {
                    var roundedPixelSize = Math.floor(pixelSize * 1000),
                        levels = tilingScheme.pixelSizes.length,
                        i = levels - 1;

                    for (; i >= 0; i--) {
                        if (Math.floor(tilingScheme.pixelSizes[i] * 1000) >= roundedPixelSize) {
                            return i;
                        }
                    }

                    return 0;
                } else {
                    return Math.round(Math.log(tilingScheme.basePixelSize / pixelSize) / Math.log(2));
                }
            } else {
                var ratio = this._contentBounds["width"] / this._contentBounds["height"],
                    bbox = $.geo.reaspect(this._getBbox(center, pixelSize), ratio, true),
                    bboxMax = $.geo.reaspect(this._getBboxMax(), ratio, true);

                return Math.round(Math.log($.geo.width(bboxMax, true) / $.geo.width(bbox, true)) / Math.log(this._fullZoomFactor));
            }
        },

        _setZoom: function (value, trigger /* , refresh */) {
            // set the map widget's zoom, taking zoomMin and zoomMax into account
            this._clearInteractiveTimeout();

            value = Math.min(Math.max(value, this._options["zoomMin"]), this._options["zoomMax"]);

            this._setInteractiveCenterAndSize(this._centerInteractive, this._getPixelSize(value));
            this._interactiveTransform();
            this._setInteractiveTimeout(trigger);
        },

        _createChildren: function () {
            this._$existingChildren = this._$elem.children();

            this._forcePosition(this._$existingChildren);

            this._$existingChildren.detach().css({
                mozUserSelect: "none"
            });


            var contentSizeCss = "width:" + this._contentBounds["width"] + "px; height:" + this._contentBounds["height"] + "px; margin:0; padding:0;",
                contentPosCss = "position:absolute; left:0; top:0;";

            this._$elem.prepend(window.toStaticHTML('<div class="geo-event-target geo-content-frame" style="position:absolute; left:' + this._contentBounds.x + 'px; top:' + this._contentBounds.y + 'px;' + contentSizeCss + 'overflow:hidden; -khtml-user-select:none; -moz-user-select:none; -webkit-user-select:none; user-select:none;" unselectable="on"></div>'));
            this._$eventTarget = this._$contentFrame = this._$elem.children(':first');

            this._$contentFrame.append('<div class="geo-services-container" style="' + contentPosCss + contentSizeCss + '"></div>');
            this._$servicesContainer = this._$contentFrame.children(':last');

            this._$contentFrame.append('<ul style="position: absolute; bottom: 8px; left: 8px; list-style-type: none; max-width: 50%; padding: 0; margin: 0;"></ul>');
            this._$attrList = this._$contentFrame.children(":last");

            this._$contentFrame.append('<div class="geo-draw-container" style="' + contentPosCss + contentSizeCss + '"></div>');
            this._$drawContainer = this._$contentFrame.children(':last');

            this._$contentFrame.append('<div class="geo-measure-container" style="' + contentPosCss + contentSizeCss + '"><span class="geo-measure-label" style="' + contentPosCss + '; display: none;"></span></div>');
            this._$measureContainer = this._$contentFrame.children(':last');
            this._$measureLabel = this._$measureContainer.children();

            this._$contentFrame.append('<div class="geo-shapes-container" style="' + contentPosCss + contentSizeCss + '"></div>');
            this._$shapesContainer = this._$contentFrame.children(':last');

            this._$panContainer = $([this._$shapesContainer[0], this._$drawContainer[0], this._$measureContainer[0]]);

            this._$resizeContainer = $([this._$contentFrame[0], this._$servicesContainer[0], this._$eventTarget[0], this._$measureContainer[0]]);

            this._$contentFrame.append(this._$existingChildren);

            if (!$("#geo-measure-style").length) {
                $("head").prepend(window.toStaticHTML('<style type="text/css" id="geo-measure-style">.geo-measure-label { margin: 4px 0 0 6px; font-family: sans-serif;' + (_ieVersion ? 'letter-spacing: 2px; color: #444; filter:progid:DXImageTransform.Microsoft.DropShadow(Color=white, OffX=1, OffY=2, Positive=true);' : 'color: #000; text-shadow: #fff 1px 2px; font-weight: bold;') + ' }</style>'));
            }
        },

        _createServices: function () {
            var service, i;

            for (i = 0; i < this._currentServices.length; i++) {
                this._currentServices[i].serviceContainer.geomap("destroy");
                $.geo["_serviceTypes"][this._currentServices[i].type].destroy(this, this._$servicesContainer, this._currentServices[i]);
            }

            this._currentServices = [];
            this._$servicesContainer.html("");
            this._$attrList.html("");

            for (i = 0; i < this._options["services"].length; i++) {
                service = this._currentServices[i] = $.extend({}, this._options["services"][i]);

                // keep a reference to the original
                service.serviceObject = this._options["services"][i];

                // default the service style property on our copy
                service.style = $.extend({
                    visibility: "visible",
                    opacity: 1
                }, service.style);

                var idString = service.id ? ' id="' + service.id + '"' : "",
                    classString = 'class="geo-service ' + (service["class"] ? service["class"] : '') + '"',
                    scHtml = '<div ' + idString + classString + ' style="-webkit-transform:translateZ(0);position:absolute; left:0; top:0; width:32px; height:32px; margin:0; padding:0; display:' + (service.style.visibility === "visible" ? "block" : "none") + ';"></div>',
                    serviceContainer;

                this._$servicesContainer.append(window.toStaticHTML(scHtml));
                serviceContainer = this._$servicesContainer.children(":last");
                service.serviceContainer = serviceContainer;

                $.geo["_serviceTypes"][service.type].create(this, serviceContainer, service, i);

                serviceContainer.data("geoMap", this).geomap();

                if (service.attr) {
                    this._$attrList.append('<li>' + service.attr + '</li>');
                }
            }

            // start with our map-level shapesContainer
            this._$shapesContainers = this._$shapesContainer;

            this._$attrList.find("a").css({
                position: "relative",
                zIndex: 1,
                display: "inline-block",
                webkitTransform: "translateZ(0)"
            });
        },

        _createServiceGraphics: function () {
            // only called in the context of a service-level geomap
            var $contentFrame = this._$elem.closest(".geo-content-frame");
            this._$elem.append('<div class="geo-shapes-container" style="position:absolute; left:0; top:0; width:' + $contentFrame.css("width") + '; height:' + $contentFrame.css("height") + '; margin:0; padding:0;"></div>');
            this._$shapesContainer = this._$elem.children(':last');

            this._map._$shapesContainers = this._map._$shapesContainers.add(this._$shapesContainer);

            this._$shapesContainer.geographics({ doubleBuffer: !_gecko });
            this._createdGraphics = true;

            this._options["shapeStyle"] = this._$shapesContainer.geographics("option", "style");
        },

        _refreshDrawing: function () {
            this._$drawContainer.geographics("clear");

            if (this._drawPixels.length > 0) {
                var mode = this._options["mode"],
                    pixels = this._drawPixels,
                    coords = this._drawCoords,
                    label,
                    labelShape,
                    labelPixel,
                    widthOver,
                    heightOver;

                switch (mode) {
                    case "measureLength":
                        mode = "drawLineString";
                        labelShape = {
                            type: "LineString",
                            coordinates: coords
                        };
                        label = $.render[this._tmplLengthId]({ length: $.geo.length(labelShape, true) });
                        labelPixel = $.merge([], pixels[pixels.length - 1]);
                        break;

                    case "measureArea":
                        mode = "drawPolygon";

                        labelShape = {
                            type: "Polygon",
                            coordinates: [$.merge([], coords)]
                        };
                        labelShape.coordinates[0].push(coords[0]);

                        label = $.render[this._tmplAreaId]({ area: $.geo.area(labelShape, true) });
                        labelPixel = this._toPixel($.geo.centroid(labelShape).coordinates);
                        pixels = [pixels];
                        break;

                    case "drawPolygon":
                        pixels = [pixels];
                        break;
                }

                this._$drawContainer.geographics(mode, pixels);

                if (label) {
                    this._$measureLabel.html(label);

                    widthOver = this._contentBounds.width - (this._$measureLabel.outerWidth(true) + labelPixel[0]);
                    heightOver = this._contentBounds.height - (this._$measureLabel.outerHeight(true) + labelPixel[1]);

                    if (widthOver < 0) {
                        labelPixel[0] += widthOver;
                    }

                    if (heightOver < 0) {
                        labelPixel[1] += heightOver;
                    }

                    this._$measureLabel.css({
                        left: Math.max(labelPixel[0], 0),
                        top: Math.max(labelPixel[1], 0)
                    }).show();
                }
            }
        },

        _resetDrawing: function () {
            this._drawPixels = [];
            this._drawCoords = [];
            this._$drawContainer.geographics("clear");
            this._$measureLabel.hide();
        },

        _refreshAllShapes: function (_serviceContainer) {
            this._timeoutRefreshShapes = null;

            var service,
                geoService,
                i = 0;

            for (; i < this._currentServices.length; i++) {
                service = this._currentServices[i];

                if (!_serviceContainer || service.serviceContainer[0] === _serviceContainer[0]) {
                    geoService = service.serviceContainer.data("geoService");

                    if (geoService._createdGraphics) {
                        geoService._$shapesContainer.geographics("clear");
                        if (geoService._graphicShapes.length > 0) {
                            geoService._refreshShapes(geoService._$shapesContainer, geoService._graphicShapes, geoService._graphicShapes, geoService._graphicShapes);
                        }
                    }
                }
            }

            if (this._createdGraphics && !_serviceContainer) {
                this._$shapesContainer.geographics("clear");
                if (this._graphicShapes.length > 0) {
                    this._refreshShapes(this._$shapesContainer, this._graphicShapes, this._graphicShapes, this._graphicShapes);
                }
            }
        },


        _refreshShapes: function (geographics, shapes, styles, labels, center, pixelSize) {
            var i, mgi,
                shape,
                shapeBbox,
                style,
                label,
                hasLabel,
                labelPixel,
                centroid,
                bbox = this._map._getBbox(center, pixelSize);

            for (i = 0; i < shapes.length; i++) {
                shape = shapes[i].shape || shapes[i];
                shape = shape.geometry || shape;
                shapeBbox = $.data(shape, "geoBbox");

                if (shapeBbox && $.geo._bboxDisjoint(bbox, shapeBbox)) {
                    continue;
                }

                style = $.isArray(styles) ? styles[i].style : styles;
                label = $.isArray(labels) ? labels[i].label : labels;
                hasLabel = (label !== undefined);
                labelPixel = undefined;
                centroid = $.geo.centroid(shape);

                switch (shape.type) {
                    case "Point":
                        labelPixel = this._map.toPixel(shape.coordinates, center, pixelSize);
                        this._$shapesContainer.geographics("drawPoint", labelPixel, style);
                        break;
                    case "LineString":
                        this._$shapesContainer.geographics("drawLineString", this._map.toPixel(shape.coordinates, center, pixelSize), style);
                        if (hasLabel) {
                            labelPixel = this._map.toPixel($.geo.pointAlong(shape, 0.5).coordinates, center, pixelSize);
                        }
                        break;
                    case "Polygon":
                        this._$shapesContainer.geographics("drawPolygon", this._map.toPixel(shape.coordinates, center, pixelSize), style);
                        if (hasLabel && centroid) {
                            labelPixel = this._map.toPixel(centroid.coordinates, center, pixelSize);
                        }
                        break;
                    case "MultiPoint":
                        for (mgi = 0; mgi < shape.coordinates.length; mgi++) {
                            this._$shapesContainer.geographics("drawPoint", this._map.toPixel(shape.coordinates[mgi], center, pixelSize), style);
                        }
                        if (hasLabel && centroid) {
                            labelPixel = this._map.toPixel(centroid.coordinates, center, pixelSize);
                        }
                        break;
                    case "MultiLineString":
                        for (mgi = 0; mgi < shape.coordinates.length; mgi++) {
                            this._$shapesContainer.geographics("drawLineString", this._map.toPixel(shape.coordinates[mgi], center, pixelSize), style);
                        }
                        if (hasLabel && centroid) {
                            labelPixel = this._map.toPixel(centroid.coordinates, center, pixelSize);
                        }
                        break;
                    case "MultiPolygon":
                        for (mgi = 0; mgi < shape.coordinates.length; mgi++) {
                            this._$shapesContainer.geographics("drawPolygon", this._map.toPixel(shape.coordinates[mgi], center, pixelSize), style);
                        }
                        if (hasLabel && centroid) {
                            labelPixel = this._map.toPixel(centroid.coordinates, center, pixelSize);
                        }
                        break;

                    case "GeometryCollection":
                        this._refreshShapes(geographics, shape.geometries, style, label, center, pixelSize);
                        break;
                }

                if (hasLabel && labelPixel) {
                    this._$shapesContainer.geographics("drawLabel", labelPixel, label);
                }
            }
        },

        _findMapSize: function () {
            // really, really attempt to find a size for this thing
            // even if it's hidden (look at parents)
            var size = { width: 0, height: 0 },
              sizeContainer = this._$elem;

            while (sizeContainer.size() && !(size["width"] > 0 && size["height"] > 0)) {
                size = { width: sizeContainer.width(), height: sizeContainer.height() };
                if (size["width"] <= 0 || size["height"] <= 0) {
                    size = { width: parseInt(sizeContainer.css("width"), 10), height: parseInt(sizeContainer.css("height"), 10) };
                }
                sizeContainer = sizeContainer.parent();
            }
            return size;
        },

        _forcePosition: function (elem) {
            var cssPosition = elem.css("position");
            if (cssPosition !== "relative" && cssPosition !== "absolute" && cssPosition !== "fixed") {
                elem.css("position", "relative");
            }
        },

        _getPixelSize: function (zoom) {
            var tilingScheme = this._options["tilingScheme"];
            if (tilingScheme !== null) {
                if (zoom === 0) {
                    return tilingScheme.pixelSizes ? tilingScheme.pixelSizes[0] : tilingScheme.basePixelSize;
                }

                zoom = Math.round(zoom);
                zoom = Math.max(zoom, 0);
                var levels = tilingScheme.pixelSizes ? tilingScheme.pixelSizes.length : tilingScheme.levels;
                zoom = Math.min(zoom, levels - 1);

                if (tilingScheme.pixelSizes) {
                    return tilingScheme.pixelSizes[zoom];
                } else {
                    return tilingScheme.basePixelSize / Math.pow(2, zoom);
                }
            } else {
                var bbox = $.geo.scaleBy(this._getBboxMax(), 1 / Math.pow(this._fullZoomFactor, zoom), true);
                return Math.max($.geo.width(bbox, true) / this._contentBounds.width, $.geo.height(bbox, true) / this._contentBounds.height);
            }
        },

        _getZoomCenterAndSize: function (anchor, zoomDelta, full) {
            var zoomFactor = (full ? this._fullZoomFactor : this._partialZoomFactor),
                scale = Math.pow(zoomFactor, -zoomDelta),
                pixelSize = this._pixelSizeInteractive * scale;

            if (this._options["tilingScheme"]) {
                // clamp to min/max pixelSize
                pixelSize = Math.min(Math.max(pixelSize, this._pixelSizeMin), this._pixelSizeMax);
            }

            var zoom = this._getZoom(this._centerInteractive, pixelSize);

            // clamp to zoom
            if (full && this._options["tilingScheme"]) {
                pixelSize = this._getPixelSize(Math.min(Math.max(zoom, this._options["zoomMin"]), this._options["zoomMax"]));
            } else {
                if (zoomDelta < 0 && zoom < this._options["zoomMin"]) {
                    pixelSize = this._pixelSizeInteractive;
                } else if (zoomDelta > 0 && zoom > this._options["zoomMax"]) {
                    pixelSize = this._pixelSizeInteractive;
                }
            }

            var ratio = pixelSize / this._pixelSizeInteractive,
                anchorMapCoord = this._toMap(anchor, this._centerInteractive, this._pixelSizeInteractive),
                centerDelta = [(this._centerInteractive[0] - anchorMapCoord[0]) * ratio, (this._centerInteractive[1] - anchorMapCoord[1]) * ratio],
                scaleCenter = [anchorMapCoord[0] + centerDelta[0], anchorMapCoord[1] + centerDelta[1]];

            return { pixelSize: pixelSize, center: scaleCenter };
        },

        _panFinalize: function () {
            if (this._panning) {
                this._velocity = [0, 0];

                this._$eventTarget.css("cursor", this._options["cursors"][this._options["mode"]]);

                this._inOp = false;
                this._anchor = this._current;
                this._mouseDown = this._toolPan = this._panning = false;
            }
        },

        _panMove: function () {
            if (!this._options["pannable"]) {
                return;
            }

            var dx = this._current[0] - this._lastDrag[0],
                dy = this._current[1] - this._lastDrag[1];

            if (this._toolPan || dx > 3 || dx < -3 || dy > 3 || dy < -3) {
                if (!this._toolPan) {
                    this._toolPan = true;
                    this._$eventTarget.css("cursor", this._options["cursors"]["pan"]);
                }

                if (this._mouseDown) {
                    this._velocity = [dx, dy];
                }

                if (dx !== 0 || dy !== 0) {
                    this._panning = true;
                    this._lastDrag = this._current;

                    this._centerInteractive[0] -= (dx * this._pixelSizeInteractive);
                    this._centerInteractive[1] += ((this._options["axisLayout"] === "image" ? -1 : 1) * dy * this._pixelSizeInteractive);
                    this._setInteractiveCenterAndSize(this._centerInteractive, this._pixelSizeInteractive);
                    this._interactiveTransform();
                }
            }
        },

        _clearInteractiveTimeout: function () {
            if (this._timeoutRefreshShapes) {
                clearTimeout(this._timeoutRefreshShapes);
                this._timeoutRefreshShapes = null;
            }

            if (this._timeoutInteractive) {
                clearTimeout(this._timeoutInteractive);
                this._timeoutInteractive = null;
                return true;
            } else {
                this._centerInteractive[0] = this._center[0];
                this._centerInteractive[1] = this._center[1];
                this._pixelSizeInteractive = this._pixelSize;
                return false;
            }
        },

        _interactiveTransform: function () {
            var service,

                scalePixelSize = this._pixelSize,
                scaleRatio = scalePixelSize / this._pixelSizeInteractive;

            if (scalePixelSize > 0) {
                scaleRatio = Math.round(scaleRatio * 1000) / 1000;

                var oldMapOrigin = this._toMap([0, 0]),
                    newPixelPoint = this._toPixel(oldMapOrigin, this._centerInteractive, this._pixelSizeInteractive);


                this._$shapesContainers.geographics("interactiveTransform", newPixelPoint, scaleRatio);
            }

            for (var i = 0; i < this._currentServices.length; i++) {
                service = this._currentServices[i];
                $.geo["_serviceTypes"][service.type].interactiveTransform(this, service, this._centerInteractive, this._pixelSizeInteractive);
            }

            if (this._drawCoords.length > 0) {
                this._drawPixels = this._toPixel(this._drawCoords, this._centerInteractive, this._pixelSizeInteractive);
                this._refreshDrawing();
            }
        },

        _interactiveTimeout: function () {
            if (this._isMultiTouch) {
                this._timeoutInteractive = setTimeout($.proxy(this._interactiveTimeout, this), 128);
            } else if (this._created && this._timeoutInteractive) {
                this._setCenterAndSize(this._centerInteractive, this._pixelSizeInteractive, this._triggerInteractive, true);
                this._timeoutInteractive = null;
                this._triggerInteractive = false;

                this._timeoutRefreshShapes = setTimeout($.proxy(this._refreshAllShapes, this), 128);
            }
        },

        _setInteractiveTimeout: function (trigger) {
            this._timeoutInteractive = setTimeout($.proxy(this._interactiveTimeout, this), 128);
            this._triggerInteractive |= trigger;
        },

        _refresh: function (force, _serviceContainer) {
            var service,
                i = 0;

            for (; i < this._currentServices.length; i++) {
                service = this._currentServices[i];
                if (!_serviceContainer || service.serviceContainer[0] === _serviceContainer[0]) {
                    $.geo["_serviceTypes"][service.type].refresh(this, service, force);
                }
            }
        },

        _setInteractiveCenterAndSize: function (center, pixelSize) {
            // set the temporary (interactive) center & size
            // also, update the public-facing options
            // this does not take zoomMin or zoomMax into account
            this._centerInteractive[0] = center[0];
            this._centerInteractive[1] = center[1];
            this._pixelSizeInteractive = pixelSize;

            if (this._userGeodetic) {
                this._options["bbox"] = $.geo.proj.toGeodetic(this._getBbox(center, pixelSize));
                this._options["center"] = $.geo.proj.toGeodetic(center);
            } else {
                this._options["bbox"] = this._getBbox(center, pixelSize);
                this._options["center"][0] = center[0];
                this._options["center"][1] = center[1];
            }

            this._options["pixelSize"] = pixelSize;
            this._options["zoom"] = this._getZoom(center, pixelSize);
        },

        _setCenterAndSize: function (center, pixelSize, trigger, refresh) {
            if (!$.isArray(center) || center.length !== 2 || typeof center[0] !== "number" || typeof center[1] !== "number") {
                return;
            }

            // the final call during any extent change
            // only called by timeoutInteractive & resize
            // clamp to zoom
            var zoom = this._getZoom(center, pixelSize);

            if (this._options["tilingScheme"]) {
                this._pixelSizeInteractive = pixelSize = this._getPixelSize(Math.min(Math.max(zoom, this._options["zoomMin"]), this._options["zoomMax"]));
            } else {
                if (zoom < this._options["zoomMin"]) {
                    this._pixelSizeInteractive = pixelSize = this._getPixelSize(this._options["zoomMin"]);
                } else if (zoom > this._options["zoomMax"]) {
                    this._pixelSizeInteractive = pixelSize = this._getPixelSize(this._options["zoomMax"]);
                }
            }

            this._centerInteractive[0] = center[0];
            this._centerInteractive[1] = center[1];

            if (this._created) {
                // one last interactiveTransform to put pinched map into place
                this._interactiveTransform();
            }

            this._options["pixelSize"] = this._pixelSize = pixelSize;

            this._center[0] = center[0];
            this._center[1] = center[1];


            if (this._userGeodetic) {
                this._options["bbox"] = $.geo.proj.toGeodetic(this._getBbox());
                this._options["center"] = $.geo.proj.toGeodetic(this._center);
            } else {
                this._options["bbox"] = this._getBbox();
                this._options["center"] = $.merge([], center);
            }

            this._options["zoom"] = zoom;

            if (trigger) {
                this._trigger("bboxchange", window.event, { bbox: $.merge([], this._options["bbox"]) });
            }

            if (refresh) {
                this._refresh();
                this._refreshAllShapes();
                this._refreshDrawing();
            }
        },

        _requestQueued: function () {
            if (this._loadCount === 0) {
                this._trigger("loadstart", window.event);
            }
            this._loadCount++;
        },

        _requestComplete: function () {
            this._loadCount--;
            if (this._loadCount <= 0) {
                this._loadCount = 0;
                this._trigger("loadend", window.event);
            }
        },

        _toMap: function (p, center, pixelSize) {
            // ignores $.geo.proj

            center = center || this._center;
            pixelSize = pixelSize || this._pixelSize;

            var isMultiPointOrLineString = $.isArray(p[0]),
                isMultiLineStringOrPolygon = isMultiPointOrLineString && $.isArray(p[0][0]),
                isMultiPolygon = isMultiLineStringOrPolygon && $.isArray(p[0][0][0]),
                width = this._contentBounds["width"],
                height = this._contentBounds["height"],
                halfWidth = width / 2 * pixelSize,
                halfHeight = height / 2 * pixelSize,
                bbox = [center[0] - halfWidth, center[1] - halfHeight, center[0] + halfWidth, center[1] + halfHeight],
                xRatio = $.geo.width(bbox, true) / width,
                yRatio = $.geo.height(bbox, true) / height,
                yOffset,
                image = this._options["axisLayout"] === "image",
                result = [],
                i, j, k;

            if (!isMultiPolygon) {
                if (!isMultiLineStringOrPolygon) {
                    if (!isMultiPointOrLineString) {
                        p = [p];
                    }
                    p = [p];
                }
                p = [p];
            }

            for (i = 0; i < p.length; i++) {
                result[i] = [];
                for (j = 0; j < p[i].length; j++) {
                    result[i][j] = [];
                    for (k = 0; k < p[i][j].length; k++) {
                        yOffset = (p[i][j][k][1] * yRatio);
                        result[i][j][k] = [
                          bbox[0] + (p[i][j][k][0] * xRatio),
                          image ? bbox[1] + yOffset : bbox[3] - yOffset
                        ];
                    }
                }
            }

            return isMultiPolygon ? result : isMultiLineStringOrPolygon ? result[0] : isMultiPointOrLineString ? result[0][0] : result[0][0][0];
        },

        _toPixel: function (p, center, pixelSize) {
            // ignores $.geo.proj

            center = center || this._center;
            pixelSize = pixelSize || this._pixelSize;

            var isMultiPointOrLineString = $.isArray(p[0]),
                isMultiLineStringOrPolygon = isMultiPointOrLineString && $.isArray(p[0][0]),
                isMultiPolygon = isMultiLineStringOrPolygon && $.isArray(p[0][0][0]),
                width = this._contentBounds["width"],
                height = this._contentBounds["height"],
                halfWidth = width / 2 * pixelSize,
                halfHeight = height / 2 * pixelSize,
                bbox = [center[0] - halfWidth, center[1] - halfHeight, center[0] + halfWidth, center[1] + halfHeight],
                bboxWidth = $.geo.width(bbox, true),
                bboxHeight = $.geo.height(bbox, true),
                image = this._options["axisLayout"] === "image",
                xRatio = width / bboxWidth,
                yRatio = height / bboxHeight,
                result = [],
                i, j, k;

            if (!isMultiPolygon) {
                if (!isMultiLineStringOrPolygon) {
                    if (!isMultiPointOrLineString) {
                        p = [p];
                    }
                    p = [p];
                }
                p = [p];
            }

            for (i = 0; i < p.length; i++) {
                result[i] = [];
                for (j = 0; j < p[i].length; j++) {
                    result[i][j] = [];
                    for (k = 0; k < p[i][j].length; k++) {
                        result[i][j][k] = [
                          Math.round((p[i][j][k][0] - bbox[0]) * xRatio),
                          Math.round((image ? p[i][j][k][1] - bbox[1] : bbox[3] - p[i][j][k][1]) * yRatio)
                        ];
                    }
                }
            }

            return isMultiPolygon ? result : isMultiLineStringOrPolygon ? result[0] : isMultiPointOrLineString ? result[0][0] : result[0][0][0];
        },

        _document_keydown: function (e) {
            var len = this._drawCoords.length;
            if (len > 0 && e.which === 27) {
                if (len <= 2) {
                    this._resetDrawing();
                    this._inOp = false;
                } else {
                    this._drawCoords[len - 2] = $.merge([], this._drawCoords[len - 1]);
                    this._drawPixels[len - 2] = $.merge([], this._drawPixels[len - 1]);

                    this._drawCoords.length--;
                    this._drawPixels.length--;

                    this._refreshDrawing();
                }
            }
        },

        _eventTarget_dblclick_zoom: function (e) {
            var doInteractiveTimeout = this._clearInteractiveTimeout();

            this._trigger("dblclick", e, { type: "Point", coordinates: this._toMap(this._current, this._centerInteractive, this._pixelSizeInteractive) });

            if (!e.isDefaultPrevented()) {
                var centerAndSize = this._getZoomCenterAndSize(this._current, 1, true);

                this._setInteractiveCenterAndSize(centerAndSize.center, centerAndSize.pixelSize);
                this._interactiveTransform();

                doInteractiveTimeout = true;
            }

            if (doInteractiveTimeout) {
                this._setInteractiveTimeout(true);
            }
        },

        _eventTarget_dblclick: function (e) {
            if (this._options["mode"] === "static") {
                return;
            }

            if (this._drawTimeout) {
                window.clearTimeout(this._drawTimeout);
                this._drawTimeout = null;
            }

            switch (this._options["mode"]) {
                case "drawLineString":
                case "measureLength":
                    if (this._drawCoords.length > 1 && !(this._drawCoords[0][0] === this._drawCoords[1][0] &&
                                                            this._drawCoords[0][1] === this._drawCoords[1][1])) {
                        this._drawCoords.length--;
                        this._trigger("shape", e, {
                            type: "LineString",
                            coordinates: this._userGeodetic ? $.geo.proj.toGeodetic(this._drawCoords) : this._drawCoords
                        });
                    } else {
                        this._eventTarget_dblclick_zoom(e);
                    }
                    this._resetDrawing();
                    break;

                case "drawPolygon":
                case "measureArea":
                    if (this._drawCoords.length > 1 && !(this._drawCoords[0][0] === this._drawCoords[1][0] &&
                                                            this._drawCoords[0][1] === this._drawCoords[1][1])) {
                        var endIndex = this._drawCoords.length - 1;
                        if (endIndex > 2) {
                            this._drawCoords[endIndex] = $.merge([], this._drawCoords[0]);
                            this._trigger("shape", e, {
                                type: "Polygon",
                                coordinates: [this._userGeodetic ? $.geo.proj.toGeodetic(this._drawCoords) : this._drawCoords]
                            });
                        }
                    } else {
                        this._eventTarget_dblclick_zoom(e);
                    }
                    this._resetDrawing();
                    break;

                default:
                    this._eventTarget_dblclick_zoom(e);
                    break;
            }

            this._inOp = false;
        },

        _eventTarget_touchstart: function (e) {
            if (typeof (document.elementFromPoint) !== "undefined") {
                var elFromPt = document.elementFromPoint(e.pageX, e.pageY);
                if (elFromPt && elFromPt.nodeName === "A") {
                    return;
                }
            }

            var mode = this._options["mode"],
                shift = this._options["shift"],
                defaultShift = (mode === "dragBox" ? "dragBox" : "zoom");

            if (mode === "static") {
                return;
            }

            if (!this._pointerEvents && !this._supportTouch && e.which !== 1) {
                return;
            }

            var doInteractiveTimeout = this._clearInteractiveTimeout();

            var offset = $(e.currentTarget).offset(),
                touches = e.originalEvent.changedTouches;

            if (this._pointerEvents) {
                if (!this._isMultiTouch && this._mouseDown && this._multiTouchAnchor.length > 0) {
                    // switch to multitouch
                    e.currentTarget.setPointerCapture(e.originalEvent.pointerId);

                    this._isMultiTouch = true;
                    this._wheelLevel = 0;

                    this._multiTouchAnchor.push(e.originalEvent);

                    this._multiTouchCurrentBbox = [
                      this._multiTouchCurrentBbox[0],
                      this._multiTouchCurrentBbox[1],
                      this._multiTouchAnchor[1].pageX - offset.left,
                      this._multiTouchAnchor[1].pageY - offset.top
                    ];

                    this._multiTouchAnchorBbox = $.merge([], this._multiTouchCurrentBbox);

                    this._anchor = $.geo.center(this._multiTouchCurrentBbox, true);
                    this._current = $.merge([], this._anchor);

                    if (doInteractiveTimeout) {
                        this._setInteractiveTimeout(true);
                    }

                    return false;
                } else if (this._multiTouchAnchor.length < 2) {
                    e.currentTarget.setPointerCapture(e.originalEvent.pointerId);

                    this._multiTouchAnchor.push(e.originalEvent);

                    this._multiTouchCurrentBbox = [
                      this._multiTouchAnchor[0].pageX - offset.left,
                      this._multiTouchAnchor[0].pageY - offset.top,
                      NaN,
                      NaN
                    ];

                    this._current = [this._multiTouchAnchor[0].pageX - offset.left, this._multiTouchAnchor[0].pageY - offset.top];
                }
            } else if (this._supportTouch && touches) {
                this._multiTouchAnchor = $.merge([], touches);

                this._isMultiTouch = this._multiTouchAnchor.length > 1;

                if (this._isMultiTouch) {
                    this._multiTouchCurrentBbox = [
                      touches[0].pageX - offset.left,
                      touches[0].pageY - offset.top,
                      touches[1].pageX - offset.left,
                      touches[1].pageY - offset.top
                    ];

                    this._multiTouchAnchorBbox = $.merge([], this._multiTouchCurrentBbox);

                    this._current = $.geo.center(this._multiTouchCurrentBbox, true);
                } else {
                    this._multiTouchCurrentBbox = [
                      touches[0].pageX - offset.left,
                      touches[0].pageY - offset.top,
                      NaN,
                      NaN
                    ];

                    this._current = [touches[0].pageX - offset.left, touches[0].pageY - offset.top];
                }
            } else {
                this._current = [e.pageX - offset.left, e.pageY - offset.top];
            }

            if (this._softDblClick) {
                var downDate = $.now();
                if (downDate - this._downDate < 750) {
                    if (this._isTap) {
                        var dx = this._current[0] - this._anchor[0],
                            dy = this._current[1] - this._anchor[1],
                            distance = Math.sqrt((dx * dx) + (dy * dy));
                        if (distance > 8) {
                            this._isTap = false;
                        } else {
                            this._current = $.merge([], this._anchor);
                        }
                    }

                    if (this._isDbltap) {
                        this._isDbltap = false;
                    } else {
                        this._isDbltap = this._isTap;
                    }
                } else {
                    this._isDbltap = false;
                }
                this._isTap = true;
                this._downDate = downDate;
            }

            this._mouseDown = true;
            this._anchor = $.merge([], this._current);

            if (!this._inOp && e.shiftKey && shift !== "off") {
                this._shiftDown = true;
                this._$eventTarget.css("cursor", this._options["cursors"][shift === "default" ? defaultShift : shift]);
            } else if (!this._isMultiTouch && (this._options["pannable"] || mode === "dragBox" || mode === "dragCircle")) {
                this._inOp = true;

                if (mode !== "zoom" && mode !== "dragBox" && mode !== "dragCircle") {
                    this._lastDrag = this._current;

                    if (e.currentTarget.setCapture) {
                        e.currentTarget.setCapture();
                    }
                }
            }

            e.preventDefault();

            if (doInteractiveTimeout) {
                this._setInteractiveTimeout(true);
            }

            return false;
        },

        _dragTarget_touchmove: function (e) {
            if (this._options["mode"] === "static") {
                return;
            }

            var doInteractiveTimeout = false;
            if (this._mouseDown) {
                doInteractiveTimeout = this._clearInteractiveTimeout();
            }

            var offset = this._$eventTarget.offset(),
                drawCoordsLen = this._drawCoords.length,
                touches = e.originalEvent.changedTouches,
                current = null,
                anchorDistance,
                currentDistance,
                wheelLevel,
                delta,
                pinchCenterAndSize,
                i;

            if (this._pointerEvents) {
                if (this._isMultiTouch) {
                    if (e.originalEvent.pointerId === this._multiTouchAnchor[0].pointerId) {
                        this._multiTouchCurrentBbox[0] = e.originalEvent.pageX - offset.left;
                        this._multiTouchCurrentBbox[1] = e.originalEvent.pageY - offset.top;
                    } else if (e.originalEvent.pointerId === this._multiTouchAnchor[1].pointerId) {
                        this._multiTouchCurrentBbox[2] = e.originalEvent.pageX - offset.left;
                        this._multiTouchCurrentBbox[3] = e.originalEvent.pageY - offset.top;
                    } else {
                        // untracked pointer
                        e.preventDefault();
                        if (doInteractiveTimeout) {
                            this._setInteractiveTimeout(true);
                        }
                        return false;
                    }

                    anchorDistance = $.geo._distancePointPoint([this._multiTouchAnchorBbox[0], this._multiTouchAnchorBbox[1]], [this._multiTouchAnchorBbox[2], this._multiTouchAnchorBbox[3]]);
                    currentDistance = $.geo._distancePointPoint([this._multiTouchCurrentBbox[0], this._multiTouchCurrentBbox[1]], [this._multiTouchCurrentBbox[2], this._multiTouchCurrentBbox[3]]);

                    wheelLevel = ((currentDistance - anchorDistance) / anchorDistance);

                    if (wheelLevel > 0) {
                        wheelLevel *= 5;
                    } else {
                        wheelLevel *= 10;
                    }

                    delta = wheelLevel - this._wheelLevel;

                    this._wheelLevel = wheelLevel;

                    pinchCenterAndSize = this._getZoomCenterAndSize(this._anchor, delta, false);

                    this._setInteractiveCenterAndSize(pinchCenterAndSize.center, pinchCenterAndSize.pixelSize);
                    this._interactiveTransform();

                    doInteractiveTimeout = true;

                    current = $.geo.center(this._multiTouchCurrentBbox, true);

                } else {
                    this._multiTouchAnchor[0] = e.originalEvent;

                    this._multiTouchCurrentBbox = [
                      this._multiTouchAnchor[0].pageX - offset.left,
                      this._multiTouchAnchor[0].pageY - offset.top,
                      NaN,
                      NaN
                    ];

                    current = [e.originalEvent.pageX - offset.left, e.originalEvent.pageY - offset.top];
                }
            } else if (this._supportTouch && touches) {
                if (!this._isMultiTouch && this._mouseDown && this._multiTouchAnchor.length > 0 && touches[0].identifier !== this._multiTouchAnchor[0].identifier) {
                    // switch to multitouch
                    this._isMultiTouch = true;
                    this._wheelLevel = 0;

                    this._multiTouchAnchor.push(touches[0]);

                    this._multiTouchCurrentBbox = [
                      this._multiTouchCurrentBbox[0],
                      this._multiTouchCurrentBbox[1],
                      this._multiTouchAnchor[1].pageX - offset.left,
                      this._multiTouchAnchor[1].pageY - offset.top
                    ];

                    this._multiTouchAnchorBbox = $.merge([], this._multiTouchCurrentBbox);

                    this._anchor = this._current = $.geo.center(this._multiTouchCurrentBbox, true);


                    if (doInteractiveTimeout) {
                        this._setInteractiveTimeout(true);
                    }
                    return false;
                }

                if (this._isMultiTouch) {

                    for (i = 0; i < touches.length; i++) {
                        if (touches[i].identifier === this._multiTouchAnchor[0].identifier) {
                            this._multiTouchCurrentBbox[0] = touches[i].pageX - offset.left;
                            this._multiTouchCurrentBbox[1] = touches[i].pageY - offset.top;
                        } else if (touches[i].identifier === this._multiTouchAnchor[1].identifier) {
                            this._multiTouchCurrentBbox[2] = touches[i].pageX - offset.left;
                            this._multiTouchCurrentBbox[3] = touches[i].pageY - offset.top;
                        }
                    }

                    anchorDistance = $.geo._distancePointPoint([this._multiTouchAnchorBbox[0], this._multiTouchAnchorBbox[1]], [this._multiTouchAnchorBbox[2], this._multiTouchAnchorBbox[3]]);
                    currentDistance = $.geo._distancePointPoint([this._multiTouchCurrentBbox[0], this._multiTouchCurrentBbox[1]], [this._multiTouchCurrentBbox[2], this._multiTouchCurrentBbox[3]]);

                    wheelLevel = ((currentDistance - anchorDistance) / anchorDistance);

                    if (wheelLevel > 0) {
                        wheelLevel *= 5;
                    } else {
                        wheelLevel *= 10;
                    }

                    delta = wheelLevel - this._wheelLevel;

                    this._wheelLevel = wheelLevel;

                    pinchCenterAndSize = this._getZoomCenterAndSize(this._anchor, delta, false);

                    this._setInteractiveCenterAndSize(pinchCenterAndSize.center, pinchCenterAndSize.pixelSize);
                    this._interactiveTransform();

                    doInteractiveTimeout = true;

                    current = $.geo.center(this._multiTouchCurrentBbox, true);
                } else {
                    current = [e.originalEvent.changedTouches[0].pageX - offset.left, e.originalEvent.changedTouches[0].pageY - offset.top];
                }
            } else {
                current = [e.pageX - offset.left, e.pageY - offset.top];
            }

            if (current === null) {
                e.preventDefault();
                if (doInteractiveTimeout) {
                    this._setInteractiveTimeout(true);
                }
                return false;
            }

            if (current[0] === this._lastMove[0] && current[1] === this._lastMove[1]) {
                if (this._inOp) {
                    e.preventDefault();
                    if (doInteractiveTimeout) {
                        this._setInteractiveTimeout(true);
                    }
                    return false;
                } else {
                    // fixes: [bug] highlight pop
                    return false;
                }
            }

            if (_ieVersion === 7) {
                this._isDbltap = this._isTap = false;
            }

            if (this._mouseDown) {
                this._current = current;
                this._moveDate = $.now();
            }

            if (this._isMultiTouch) {
                e.preventDefault();
                this._isDbltap = this._isTap = false;
                if (doInteractiveTimeout) {
                    this._setInteractiveTimeout(true);
                }
                return false;
            }

            var mode = this._options["mode"],
                shift = this._options["shift"],
                defaultShift = (mode === "dragBox" ? "dragBox" : "zoom"),
                dx, dy, circleSize;

            if (this._shiftDown) {
                mode = (shift === "default" ? defaultShift : shift);
            }

            switch (mode) {
                case "zoom":
                case "dragBox":
                    if (this._mouseDown) {
                        this._$drawContainer.geographics("clear");
                        this._$drawContainer.geographics("drawBbox", [
                          this._anchor[0],
                          this._anchor[1],
                          current[0],
                          current[1]
                        ]);
                    } else {
                        this._trigger("move", e, { type: "Point", coordinates: this.toMap(current) });
                    }
                    break;

                case "dragCircle":
                    if (this._mouseDown) {
                        dx = current[0] - this._anchor[0];
                        dy = current[1] - this._anchor[1];
                        circleSize = Math.sqrt((dx * dx) + (dy * dy)) * 2;
                        //circleSize = Math.max( Math.abs( current[ 0 ] - this._anchor[ 0 ] ), Math.abs( current[ 1 ] - this._anchor[ 1 ] ) ) * 2;

                        // not part of _refreshDrawing
                        this._$drawContainer.geographics("clear");
                        this._$drawContainer.geographics("drawArc", this._anchor, 0, 360, {
                            width: circleSize,
                            height: circleSize
                        });
                    } else {
                        this._trigger("move", e, { type: "Point", coordinates: this.toMap(current) });
                    }
                    break;

                case "drawLineString":
                case "drawPolygon":
                case "measureLength":
                case "measureArea":
                    if (this._mouseDown || this._toolPan) {
                        this._panMove();
                        doInteractiveTimeout = true;
                    } else {
                        if (drawCoordsLen > 0) {
                            this._drawCoords[drawCoordsLen - 1] = this._toMap(current, this._centerInteractive, this._pixelSizeInteractive);
                            this._drawPixels[drawCoordsLen - 1] = current;

                            this._refreshDrawing();
                        }

                        this._trigger("move", e, { type: "Point", coordinates: this.toMap(current) });
                    }
                    break;

                default:
                    if (this._mouseDown || this._toolPan) {
                        this._panMove();
                        doInteractiveTimeout = true;
                    } else {
                        this._trigger("move", e, { type: "Point", coordinates: this.toMap(current) });
                    }
                    break;
            }

            this._lastMove = current;

            if (doInteractiveTimeout) {
                this._setInteractiveTimeout(true);
            }

            if (this._inOp) {
                e.preventDefault();
                return false;
            }
        },

        _dragTarget_touchstop: function (e) {
            if (this._options["mode"] === "static") {
                return;
            }

            if (!this._mouseDown) {
                if (_ieVersion === 7) {
                    // ie7 doesn't appear to trigger dblclick on this._$eventTarget,
                    // we fake regular click here to cause soft dblclick
                    this._eventTarget_touchstart(e);
                } else {
                    // Chrome & Firefox trigger a rogue mouseup event when doing a dblclick maximize in Windows(/Linux?)
                    // ignore it
                    return;
                }
            }

            var doInteractiveTimeout = this._clearInteractiveTimeout();

            var mouseWasDown = this._mouseDown,
                wasToolPan = this._toolPan,
                offset = this._$eventTarget.offset(),
                mode = this._options["mode"],
                shift = this._options["shift"],
                defaultShift = (mode === "dragBox" ? "dragBox" : "zoom"),
                current = null, i, clickDate,
                dx, dy,
                coordBuffer,
                triggerShape;

            if (this._shiftDown) {
                mode = (shift === "default" ? defaultShift : shift);
            }

            if (this._pointerEvents) {
                if (e.originalEvent.pointerId === this._multiTouchAnchor[0].pointerId || e.originalEvent.pointerId === this._multiTouchAnchor[1].pointerId) {
                    e.currentTarget.releasePointerCapture(e.originalEvent.pointerId);

                    current = [e.originalEvent.pageX - offset.left, e.originalEvent.pageY - offset.top];

                    this._multiTouchAnchor = [];
                    this._inOp = false;
                } else {
                    // untracked pointer
                    e.preventDefault();
                    if (doInteractiveTimeout) {
                        this._setInteractiveTimeout(true);
                    }
                    return;
                }

            } else if (this._supportTouch && e.originalEvent.changedTouches) {
                current = [e.originalEvent.changedTouches[0].pageX - offset.left, e.originalEvent.changedTouches[0].pageY - offset.top];
                this._multiTouchAnchor = [];
                this._inOp = false;
            } else {
                current = [e.pageX - offset.left, e.pageY - offset.top];
            }

            if (this._softDblClick) {
                if (this._isTap) {
                    dx = current[0] - this._anchor[0];
                    dy = current[1] - this._anchor[1];
                    if (Math.sqrt((dx * dx) + (dy * dy)) <= 8) {
                        current = $.merge([], this._anchor);
                    }
                }
            }

            dx = current[0] - this._anchor[0];
            dy = current[1] - this._anchor[1];

            this._$eventTarget.css("cursor", this._options["cursors"][this._options["mode"]]);

            this._shiftDown = this._mouseDown = this._toolPan = false;

            if (this._isMultiTouch) {
                e.preventDefault();
                this._isMultiTouch = false;

                this._wheelLevel = 0;

                if (doInteractiveTimeout) {
                    this._setInteractiveTimeout(true);
                }

                return;
            }

            if (document.releaseCapture) {
                document.releaseCapture();
            }

            if (mouseWasDown) {
                clickDate = $.now();
                this._current = current;

                switch (mode) {
                    case "zoom":
                    case "dragBox":
                        if (dx !== 0 || dy !== 0) {
                            var minSize = this._pixelSize * 6,
                                bboxCoords = this._toMap([this._anchor, current]),
                                bbox = [
                                  Math.min(bboxCoords[0][0], bboxCoords[1][0]),
                                  Math.min(bboxCoords[0][1], bboxCoords[1][1]),
                                  Math.max(bboxCoords[0][0], bboxCoords[1][0]),
                                  Math.max(bboxCoords[0][1], bboxCoords[1][1])
                                ];

                            if (mode === "zoom") {
                                if ((bbox[2] - bbox[0]) < minSize && (bbox[3] - bbox[1]) < minSize) {
                                    bbox = $.geo.scaleBy(this._getBbox($.geo.center(bbox, true)), 0.5, true);
                                }

                                this._setBbox(bbox, true, true);
                                doInteractiveTimeout = true;
                            } else {
                                triggerShape = $.geo.polygonize(bbox, true);
                                triggerShape.bbox = bbox;

                                if (this._userGeodetic) {
                                    triggerShape.coordinates = $.geo.proj.toGeodetic(triggerShape.coordinates);
                                    triggerShape.bbox = $.geo.proj.toGeodetic(triggerShape.bbox);
                                }
                                this._trigger("shape", e, triggerShape);
                            }
                        } else {
                            if (mode === "dragBox") {
                                coordBuffer = this._toMap(current);

                                triggerShape = {
                                    type: "Point",
                                    coordinates: [coordBuffer[0], coordBuffer[1]],
                                    bbox: [coordBuffer[0], coordBuffer[1], coordBuffer[0], coordBuffer[1]]
                                };

                                if (this._userGeodetic) {
                                    triggerShape.coordinates = $.geo.proj.toGeodetic(triggerShape.coordinates);
                                    triggerShape.bbox = $.geo.proj.toGeodetic(triggerShape.bbox);
                                }

                                this._trigger("shape", e, triggerShape);
                            }
                        }

                        this._resetDrawing();
                        break;

                    case "dragCircle":
                        if (dx !== 0 || dy !== 0) {
                            var image = this._options["axisLayout"] === "image",
                                d = Math.sqrt((dx * dx) + (dy * dy)),
                                n = 180,
                                a;

                            this._drawPixels.length = n + 1;

                            for (i = 0; i < n; i++) {
                                a = (i * 360 / n) * (Math.PI / 180);
                                this._drawPixels[i] = [
                                  this._anchor[0] + Math.cos(a) * d,
                                  this._anchor[1] + Math.sin(a) * d
                                ];
                            }

                            this._drawPixels[n] = [
                              this._drawPixels[0][0],
                              this._drawPixels[0][1]
                            ];

                            // using coordBuffer for bbox coords
                            coordBuffer = this._toMap([
                              [this._anchor[0] - d, this._anchor[1] + (image ? -d : d)],
                              [this._anchor[0] + d, this._anchor[1] + (image ? d : -d)]
                            ]);

                            triggerShape = {
                                type: "Polygon",
                                coordinates: [this._toMap(this._drawPixels)],
                                bbox: [coordBuffer[0][0], coordBuffer[0][1], coordBuffer[1][0], coordBuffer[1][1]]
                            };

                            if (this._userGeodetic) {
                                triggerShape.coordinates = $.geo.proj.toGeodetic(triggerShape.coordinates);
                                triggerShape.bbox = $.geo.proj.toGeodetic(triggerShape.bbox);
                            }

                            this._trigger("shape", e, triggerShape);

                            this._resetDrawing();
                        } else {
                            coordBuffer = this._toMap(current);

                            triggerShape = {
                                type: "Point",
                                coordinates: [coordBuffer[0], coordBuffer[1]],
                                bbox: [coordBuffer[0], coordBuffer[1], coordBuffer[0], coordBuffer[1]]
                            };

                            if (this._userGeodetic) {
                                triggerShape.coordinates = $.geo.proj.toGeodetic(triggerShape.coordinates);
                                triggerShape.bbox = $.geo.proj.toGeodetic(triggerShape.bbox);
                            }

                            this._trigger("shape", e, triggerShape);
                        }
                        break;

                    case "drawPoint":
                        if (this._drawTimeout) {
                            window.clearTimeout(this._drawTimeout);
                            this._drawTimeout = null;
                        }

                        if (wasToolPan) {
                            this._panFinalize();
                        } else {
                            if (clickDate - this._clickDate > 100) {
                                var geomap = this;
                                this._drawTimeout = setTimeout(function () {
                                    if (geomap._drawTimeout) {
                                        geomap._trigger("shape", e, { type: "Point", coordinates: geomap.toMap(current) });
                                        geomap._inOp = false;
                                        geomap._drawTimeout = null;
                                    }
                                }, 250);
                            }
                        }
                        break;

                    case "drawLineString":
                    case "drawPolygon":
                    case "measureLength":
                    case "measureArea":
                        if (wasToolPan) {
                            this._panFinalize();
                        } else {
                            this._trigger("click", e, { type: "Point", coordinates: this.toMap(current) });

                            if (!e.isDefaultPrevented()) {
                                i = (this._drawCoords.length === 0 ? 0 : this._drawCoords.length - 1);

                                this._drawCoords[i] = this._toMap(current);
                                this._drawPixels[i] = current;

                                if (i < 2 || !(this._drawCoords[i][0] === this._drawCoords[i - 1][0] &&
                                               this._drawCoords[i][1] === this._drawCoords[i - 1][1])) {
                                    this._drawCoords[i + 1] = this._toMap(current, this._centerInteractive, this._pixelSizeInteractive);
                                    this._drawPixels[i + 1] = current;
                                }

                                this._refreshDrawing();
                            }
                        }
                        break;

                    default:
                        if (wasToolPan) {
                            this._panFinalize();
                        } else {
                            if (clickDate - this._clickDate > 100) {
                                this._trigger("click", e, { type: "Point", coordinates: this.toMap(current) });
                                this._inOp = false;
                            }
                        }
                        break;
                }

                this._clickDate = clickDate;

                if (this._softDblClick && this._isDbltap) {
                    this._isDbltap = this._isTap = false;
                    if (doInteractiveTimeout) {
                        this._setInteractiveTimeout(true);
                    }
                    this._$eventTarget.trigger("softdblclick", e);
                    return false;
                }
            }

            if (doInteractiveTimeout) {
                this._setInteractiveTimeout(true);
            }

            if (this._inOp) {
                e.preventDefault();
                return false;
            }
        },

        _eventTarget_mousewheel: function (e) {
            if (this._options["mode"] === "static" || this._options["scroll"] === "off") {
                return;
            }

            e.preventDefault();

            if (this._mouseDown) {
                return false;
            }

            if (e.deltaY !== 0) {
                if (this._timeoutWheel) {
                    clearTimeout(this._timeoutWheel);
                    this._timeoutWheel = null;
                }

                var geomap = this;
                var currentTarget = e.currentTarget;
                var deltaY = e.deltaY;
                var pageX = e.pageX;
                var pageY = e.pageY;

                this._timeoutWheel = setTimeout(function () {
                    geomap._clearInteractiveTimeout();

                    var delta = deltaY > 0 ? 1 : -1;

                    var offset = $(currentTarget).offset();
                    geomap._anchor = [pageX - offset.left, pageY - offset.top];

                    var wheelCenterAndSize = geomap._getZoomCenterAndSize(geomap._anchor, delta, geomap._options["tilingScheme"] !== null);

                    geomap._setInteractiveCenterAndSize(wheelCenterAndSize.center, wheelCenterAndSize.pixelSize);
                    geomap._interactiveTransform();

                    geomap._setInteractiveTimeout(true);
                }, 30);

            }

            return false;
        }
    }
    );
}(jQuery, window));


(function ($, window, undefined) {
    $.geo._serviceTypes.tiled = (function () {
        var rTmplString = new RegExp("<.*>|{{.*}}");

        return {
            _serviceId: 0,
            _tmplGeoSrcId: "",


            create: function (map, serviceContainer, service /* , index */) {
                this._serviceId = map._serviceIdSeed++;
                this._tmplGeoSrcId = "geoSrc" + this._serviceId;

                var serviceState = $.data(service, "geoServiceState");

                if (!serviceState) {
                    serviceState = {
                        loadCount: 0,
                        reloadTiles: false
                    };

                    var scHtml = '<div data-geo-service="tiled" style="-webkit-transform:translateZ(0); position:absolute; left:0; top:0; width:8px; height:8px; margin:0; padding:0;"></div>';

                    serviceContainer.append(window.toStaticHTML(scHtml));

                    serviceState.serviceContainer = serviceContainer.children(":last");

                    $.data(service, "geoServiceState", serviceState);
                }

                return serviceState.serviceContainer;
            },

            destroy: function (map, serviceContainer, service) {
                var serviceState = $.data(service, "geoServiceState");

                serviceState.serviceContainer.remove();

                $.removeData(service, "geoServiceState");
            },

            interactiveTransform: function (map, service, center, pixelSize) {
                //console.log( "tiled.interactiveTransform( " + center.join( ", " ) + ", " + pixelSize + ")" );
                var serviceState = $.data(service, "geoServiceState"),
                    tilingScheme = map.options["tilingScheme"];

                if (serviceState) {
                    this._cancelUnloaded(map, service);

                    serviceState.serviceContainer.children().each(function () {
                        var $scaleContainer = $(this),
                            scalePixelSize = $scaleContainer.data("pixelSize"),
                            scaleRatio = scalePixelSize / pixelSize;

                        if (scalePixelSize > 0) {
                            scaleRatio = Math.round(scaleRatio * 1000) / 1000;

                            var oldMapCoord = $scaleContainer.data("scaleOrigin"),
                                newPixelPoint = map._toPixel(oldMapCoord, center, pixelSize);

                            $scaleContainer.css({
                                left: Math.round(newPixelPoint[0]) + "px",
                                top: Math.round(newPixelPoint[1]) + "px",
                                width: tilingScheme.tileWidth * scaleRatio,
                                height: tilingScheme.tileHeight * scaleRatio
                            });

                            /*
                            if ( $("body")[0].filters !== undefined ) {
                              $scaleContainer.children().each( function ( i ) {
                                $( this ).css( "filter", "progid:DXImageTransform.Microsoft.Matrix(FilterType=bilinear,M11=" + scaleRatio + ",M22=" + scaleRatio + ",sizingmethod='auto expand')" );
                              } );
                            }
                            */
                        }
                    });
                }
            },

            refresh: function (map, service, force) {
                //console.log( "tiled.refresh( " + map._center.join( ", " ) + ", " + map._pixelSize + ")" );
                var serviceState = $.data(service, "geoServiceState");

                this._cancelUnloaded(map, service);

                if (serviceState && force) {
                    // if hidden atm, we want to make sure we reload this service after it becomes visible
                    serviceState.reloadTiles = true;
                }

                if (serviceState && service && service.style.visibility === "visible" && !(serviceState.serviceContainer.is(":hidden"))) {
                    var bbox = map._getBbox(),
                        pixelSize = map._pixelSize,

                        serviceObj = this,
                        $serviceContainer = serviceState.serviceContainer,

                        image = map.options["axisLayout"] === "image",
                        ySign = image ? +1 : -1,

                        tilingScheme = map.options["tilingScheme"],
                        tileWidth = tilingScheme.tileWidth,
                        tileHeight = tilingScheme.tileHeight,

                        tileX = Math.floor((bbox[0] - tilingScheme.origin[0]) / (pixelSize * tileWidth)),
                        tileY = Math.max(Math.floor((image ? bbox[1] - tilingScheme.origin[1] : tilingScheme.origin[1] - bbox[3]) / (pixelSize * tileHeight)), 0),
                        tileX2 = Math.ceil((bbox[2] - tilingScheme.origin[0]) / (pixelSize * tileWidth)),
                        tileY2 = Math.ceil((image ? bbox[3] - tilingScheme.origin[1] : tilingScheme.origin[1] - bbox[1]) / (pixelSize * tileHeight)),

                        bboxMax = map._getBboxMax(),
                        pixelSizeAtZero = map._getPixelSize(0),
                        ratio = pixelSizeAtZero / pixelSize,
                        fullXAtScale = Math.floor((bboxMax[0] - tilingScheme.origin[0]) / (pixelSizeAtZero * tileWidth)) * ratio,
                        fullYAtScale = Math.floor((tilingScheme.origin[1] + ySign * bboxMax[3]) / (pixelSizeAtZero * tileHeight)) * ratio,

                        fullXMinX = tilingScheme.origin[0] + (fullXAtScale * tileWidth) * pixelSize,
                        fullYMinOrMaxY = tilingScheme.origin[1] + ySign * (fullYAtScale * tileHeight) * pixelSize,

                        serviceLeft = Math.round((fullXMinX - bbox[0]) / pixelSize),
                        serviceTop = Math.round((image ? fullYMinOrMaxY - bbox[1] : bbox[3] - fullYMinOrMaxY) / pixelSize),

                        scaleContainers = $serviceContainer.children().show(),
                        scaleContainer = scaleContainers.filter("[data-pixel-size='" + pixelSize + "']").appendTo($serviceContainer),

                        opacity = service.style.opacity,

                        x, y,

                        loadImageDeferredDone = function (url) {
                            // when a Deferred call is done, add the image to the map
                            // a reference to the correct img element is on the Deferred object itself
                            serviceObj._loadImage(this.img, url, pixelSize, map, serviceState, opacity);
                        },

                        loadImageDeferredFail = function () {
                            delete this.img;
                            serviceState.loadCount--;
                            map._requestComplete();
                        };

                    if (serviceState.reloadTiles) {
                        scaleContainers.find("img").attr("data-dirty", "true");
                    }

                    if (!scaleContainer.size()) {
                        $serviceContainer.append(window.toStaticHTML("<div style='-webkit-transform:translateZ(0);position:absolute; left:" + serviceLeft % tileWidth + "px; top:" + serviceTop % tileHeight + "px; width:" + tileWidth + "px; height:" + tileHeight + "px; margin:0; padding:0;' data-pixel-size='" + pixelSize + "'></div>"));
                        scaleContainer = $serviceContainer.children(":last").data("scaleOrigin", map._toMap([(serviceLeft % tileWidth), (serviceTop % tileHeight)]));
                    } else {
                        scaleContainer.css({
                            left: (serviceLeft % tileWidth) + "px",
                            top: (serviceTop % tileHeight) + "px"
                        }).data("scaleOrigin", map._toMap([(serviceLeft % tileWidth), (serviceTop % tileHeight)]));

                        scaleContainer.children().each(function () {
                            var $img = $(this),
                                tile = $img.attr("data-tile").split(",");

                            $img.css({
                                left: Math.round(((parseInt(tile[0], 10) - fullXAtScale) * 100) + (serviceLeft - (serviceLeft % tileWidth)) / tileWidth * 100) + "%",
                                top: Math.round(((parseInt(tile[1], 10) - fullYAtScale) * 100) + (serviceTop - (serviceTop % tileHeight)) / tileHeight * 100) + "%"
                            });

                            if (opacity < 1) {
                                $img.fadeTo(0, opacity);
                            }
                        });
                    }

                    for (x = tileX; x < tileX2; x++) {
                        for (y = tileY; y < tileY2; y++) {
                            var tileStr = "" + x + "," + y,
                                $img = scaleContainer.children("[data-tile='" + tileStr + "']").removeAttr("data-dirty");

                            if ($img.size() === 0 || serviceState.reloadTiles) {
                                var bottomLeft = [
                                      tilingScheme.origin[0] + (x * tileWidth) * pixelSize,
                                      tilingScheme.origin[1] + ySign * (y * tileHeight) * pixelSize
                                ],

                                    topRight = [
                                      tilingScheme.origin[0] + ((x + 1) * tileWidth - 1) * pixelSize,
                                      tilingScheme.origin[1] + ySign * ((y + 1) * tileHeight - 1) * pixelSize
                                    ],

                                    tileBbox = [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]],

                                    urlArgs = {
                                        bbox: tileBbox,
                                        width: tileWidth,
                                        height: tileHeight,
                                        zoom: map._getZoom(),
                                        tile: {
                                            row: y,
                                            column: x
                                        },
                                        index: Math.abs(y + x)
                                    },
                                    isFunc = $.isFunction(service['src']),
                                    imageUrl;

                                if (isFunc) {
                                    imageUrl = service['src'](urlArgs);
                                } else {
                                    if (rTmplString.test(service['src'])) {
                                        $.templates(this._tmplGeoSrcId, service['src']);
                                        imageUrl = $.render[this._tmplGeoSrcId](urlArgs);
                                    } else {
                                        imageUrl = service['src'];
                                    }
                                }

                                serviceState.loadCount++;
                                map._requestQueued();

                                if (serviceState.reloadTiles && $img.size() > 0) {
                                    $img.attr("src", imageUrl);
                                } else {
                                    var imgMarkup = "<img style='-webkit-transform:translateZ(0);position:absolute; " +
                                      "left:" + (((x - fullXAtScale) * 100) + (serviceLeft - (serviceLeft % tileWidth)) / tileWidth * 100) + "%; " +
                                      "top:" + (((y - fullYAtScale) * 100) + (serviceTop - (serviceTop % tileHeight)) / tileHeight * 100) + "%; ";

                                    imgMarkup += "width: 100%; height: 100%;";

                                    imgMarkup += "margin:0; padding:0; -khtml-user-select:none; -moz-user-select:none; -webkit-user-select:none; user-select:none; display:none;' unselectable='on' data-tile='" + tileStr + "' />";

                                    scaleContainer.append(window.toStaticHTML(imgMarkup));
                                    $img = scaleContainer.children(":last");
                                }

                                if (typeof imageUrl === "string") {
                                    serviceObj._loadImage($img, imageUrl, pixelSize, map, serviceState, opacity);
                                } else if (imageUrl && $.isFunction(imageUrl.promise)) {
                                    // assume Deferred
                                    $.extend(imageUrl.promise(), { img: $img });
                                    imageUrl.done(loadImageDeferredDone).fail(loadImageDeferredFail);
                                } else {
                                    $img.remove();
                                }
                            }
                        }
                    }

                    scaleContainers.find("[data-dirty]").remove();
                    serviceState.reloadTiles = false;
                }
            },

            resize: function ( /* map, service, dx, dy */) {
            },

            opacity: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");
                serviceState.serviceContainer.find("img").stop(true).fadeTo("fast", service.style.opacity);
            },

            toggle: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");
                serviceState.serviceContainer.css("display", service.style.visibility === "visible" ? "block" : "none");
            },

            _cancelUnloaded: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");

                if (serviceState && serviceState.loadCount > 0) {
                    /*
                     * #193 - disabled until we can do this without canceling all AJAX requests
                     *
                    if ( window.stop !== undefined ) {
                      window.stop();
                    } else if( document.execCommand !== undefined ) {
                      document.execCommand("Stop", false);
                    }
                    */

                    serviceState.serviceContainer.find("img:hidden").remove();
                    while (serviceState.loadCount > 0) {
                        serviceState.loadCount--;
                        map._requestComplete();
                    }
                }
            },

            _loadImage: function ($img, url, pixelSize, map, serviceState, opacity) {
                var serviceContainer = serviceState.serviceContainer;

                $img.load(function (e) {
                    if (opacity < 1) {
                        $(e.target).fadeTo(0, opacity);
                    } else {
                        $(e.target).show();
                    }

                    serviceState.loadCount--;
                    map._requestComplete();

                    if (serviceState.loadCount <= 0) {
                        serviceContainer.children(":not([data-pixel-size='" + pixelSize + "'])").remove();
                        serviceState.loadCount = 0;
                    }
                }).error(function (e) {
                    $(e.target).remove();
                    serviceState.loadCount--;
                    map._requestComplete();

                    if (serviceState.loadCount <= 0) {
                        serviceContainer.children(":not([data-pixel-size='" + pixelSize + "'])").remove();
                        serviceState.loadCount = 0;
                    }
                }).attr("src", url);
            }
        };
    }());
}(jQuery, window));

(function ($, window, undefined) {
    $.geo._serviceTypes.shingled = (function () {
        var rTmplString = new RegExp("<.*>|{{.*}}");

        return {
            _serviceId: 0,
            _tmplGeoSrcId: "",

            create: function (map, serviceContainer, service /* , index */) {
                this._serviceId = map._serviceIdSeed++;
                this._tmplGeoSrcId = "geoSrc" + this._serviceId;

                var serviceState = $.data(service, "geoServiceState");

                if (!serviceState) {
                    serviceState = {
                        loadCount: 0
                    };

                    var scHtml = '<div data-geo-service="shingled" style="-webkit-transform:translateZ(0);position:absolute; left:0; top:0; width:16px; height:16px; margin:0; padding:0;"></div>';

                    serviceContainer.append(window.toStaticHTML(scHtml));

                    serviceState.serviceContainer = serviceContainer.children(":last");
                    $.data(service, "geoServiceState", serviceState);
                }

                return serviceState.serviceContainer;
            },

            destroy: function (map, serviceContainer, service) {
                var serviceState = $.data(service, "geoServiceState");

                serviceState.serviceContainer.remove();

                $.removeData(service, "geoServiceState");
            },

            interactiveTransform: function (map, service, center, pixelSize) {
                var serviceState = $.data(service, "geoServiceState"),

                    contentBounds = map._getContentBounds(),
                    mapWidth = contentBounds["width"],
                    mapHeight = contentBounds["height"];

                if (serviceState) {
                    this._cancelUnloaded(map, service);

                    serviceState.serviceContainer.children().each(function () {
                        var $scaleContainer = $(this),
                            scalePixelSize = $scaleContainer.data("pixelSize"),
                            scaleRatio = scalePixelSize / pixelSize;

                        if (scalePixelSize > 0) {
                            scaleRatio = Math.round(scaleRatio * 1000) / 1000;

                            var oldMapOrigin = $scaleContainer.data("origin"),
                                newPixelPoint = map._toPixel(oldMapOrigin, center, pixelSize);

                            $scaleContainer.css({
                                left: Math.round(newPixelPoint[0]),
                                top: Math.round(newPixelPoint[1]),
                                width: mapWidth * scaleRatio,
                                height: mapHeight * scaleRatio
                            });
                        }
                    });
                }
            },

            refresh: function (map, service, force) {
                var serviceState = $.data(service, "geoServiceState");

                this._cancelUnloaded(map, service);

                if (serviceState && service && service.style.visibility === "visible" && !(serviceState.serviceContainer.is(":hidden"))) {

                    var bbox = map._getBbox(),
                        pixelSize = map._pixelSize,

                        serviceObj = this,
                        serviceContainer = serviceState.serviceContainer,

                        contentBounds = map._getContentBounds(),
                        mapWidth = contentBounds["width"],
                        mapHeight = contentBounds["height"],

                        scaleContainer = serviceContainer.children('[data-pixel-size="' + pixelSize + '"]'),

                        opacity = service.style.opacity,

                        $img;

                    if (opacity < 1 || force || service.shinglesMax === 1) {
                        serviceContainer.find("img").attr("data-keep-alive", "0");
                    } else if (service.shinglesMax > 1) {
                        serviceContainer.find("img").slice(0, -(service.shinglesMax - 1)).attr("data-keep-alive", "0");
                    }

                    if (!scaleContainer.size()) {
                        serviceContainer.append(window.toStaticHTML('<div style="-webkit-transform:translateZ(0);position:absolute; left:0px; top: 0px; width:' + mapWidth + 'px; height:' + mapHeight + 'px; margin:0; padding:0;" data-pixel-size="' + pixelSize + '" data-origin="[' + map._toMap([0, 0]) + ']"></div>'));
                        scaleContainer = serviceContainer.children(":last");
                    }

                    var urlArgs = {
                        bbox: bbox,
                        width: mapWidth,
                        height: mapHeight,
                        zoom: map._getZoom(),
                        tile: null,
                        index: 0
                    },
                        isFunc = $.isFunction(service['src']),
                        imageUrl,
                        imagePos = scaleContainer.position();

                    imagePos.left = -(imagePos.left);
                    imagePos.top = -(imagePos.top);

                    if (isFunc) {
                        imageUrl = service['src'](urlArgs);
                    } else {
                        if (rTmplString.test(service['src'])) {
                            $.templates(this._tmplGeoSrcId, service['src']);
                            imageUrl = $.render[this._tmplGeoSrcId](urlArgs);
                        } else {
                            imageUrl = service['src'];
                        }
                    }

                    serviceState.loadCount++;
                    map._requestQueued();

                    scaleContainer.append(window.toStaticHTML('<img style="-webkit-transform:translateZ(0);position:absolute; left:' + (imagePos.left / scaleContainer.width() * 100) + '%; top:' + (imagePos.top / scaleContainer.height() * 100) + '%; width:100%; height:100%; margin:0; padding:0; -khtml-user-select:none; -moz-user-select:none; -webkit-user-select:none; user-select:none; display:none;" unselectable="on" />'));
                    $img = scaleContainer.children(":last").data("center", map._center);

                    if (typeof imageUrl === "string") {
                        serviceObj._loadImage($img, imageUrl, pixelSize, map, serviceState, opacity);
                    } else if (imageUrl) {
                        // assume Deferred
                        imageUrl.done(function (url) {
                            serviceObj._loadImage($img, url, pixelSize, map, serviceState, opacity);
                        }).fail(function () {
                            $img.remove();
                            serviceState.loadCount--;
                            map._requestComplete();
                        });
                    }

                }
            },

            resize: function (map, service /* , dx, dy */) {
                var serviceState = $.data(service, "geoServiceState");

                if (serviceState && service && service.style.visibility === "visible") {
                    this._cancelUnloaded(map, service);

                    var serviceContainer = serviceState.serviceContainer,

                        contentBounds = map._getContentBounds(),
                        mapWidth = contentBounds["width"],
                        mapHeight = contentBounds["height"],

                        scaleContainers = serviceContainer.children();

                    scaleContainers.attr("data-pixel-size", "0");

                    scaleContainers.each(function () {
                        var $scaleContainer = $(this),
                            position = $scaleContainer.position();

                        $scaleContainer.css({
                            left: position.left + (mapWidth - $scaleContainer.width()) / 2,
                            top: position.top + (mapHeight - $scaleContainer.height()) / 2
                        });

                    });
                }
            },

            opacity: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");
                serviceState.serviceContainer.find("img").stop(true).fadeTo("fast", service.style.opacity);
            },

            toggle: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");
                serviceState.serviceContainer.css("display", service.style.visibility === "visible" ? "block" : "none");
            },

            _cancelUnloaded: function (map, service) {
                var serviceState = $.data(service, "geoServiceState");

                if (serviceState && serviceState.loadCount > 0) {
                    serviceState.serviceContainer.find("img:hidden").remove();
                    while (serviceState.loadCount > 0) {
                        serviceState.loadCount--;
                        map._requestComplete();
                    }
                }
            },

            _loadImage: function ($img, url, pixelSize, map, serviceState, opacity) {
                var serviceContainer = serviceState.serviceContainer;

                $img.load(function (e) {
                    if (!$.contains(document.body, e.target.jquery ? e.target[0] : e.target)) {
                        // this image has been canceled and removed from the DOM
                        return;
                    }

                    if (opacity < 1) {
                        $(e.target).fadeTo(0, opacity);
                    } else {
                        $(e.target).show();
                    }

                    serviceState.loadCount--;
                    map._requestComplete();

                    if (serviceState.loadCount <= 0) {
                        // #newpanzoom
                        serviceContainer.children(':not([data-pixel-size="' + pixelSize + '"])').remove();

                        serviceContainer.find("img[data-keep-alive]").remove();

                        serviceState.loadCount = 0;
                    }
                }).error(function (e) {
                    if (!$.contains(document.body, e.target.jquery ? e.target[0] : e.target)) {
                        // this image has been canceled and removed from the DOM
                        return;
                    }

                    $(e.target).remove();
                    serviceState.loadCount--;
                    map._requestComplete();

                    if (serviceState.loadCount <= 0) {
                        serviceContainer.children(":not([data-pixel-size='" + pixelSize + "'])").remove();
                        serviceState.loadCount = 0;
                    }
                }).attr("src", url);
            }
        };
    }());
}(jQuery, window));
/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(L,a){"object"===typeof module&&module.exports?module.exports=L.document?a(L):a:L.Highcharts=a(L)})("undefined"!==typeof window?window:this,function(L){L=function(){var a=window,B=a.document,A=a.navigator&&a.navigator.userAgent||"",H=B&&B.createElementNS&&!!B.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,G=/(edge|msie|trident)/i.test(A)&&!window.opera,r=!H,g=/Firefox/.test(A),f=g&&4>parseInt(A.split("Firefox/")[1],10);return a.Highcharts?a.Highcharts.error(16,!0):{product:"Highcharts",
version:"5.0.7",deg2rad:2*Math.PI/360,doc:B,hasBidiBug:f,hasTouch:B&&void 0!==B.documentElement.ontouchstart,isMS:G,isWebKit:/AppleWebKit/.test(A),isFirefox:g,isTouchDevice:/(Mobile|Android|Windows Phone)/.test(A),SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},symbolSizes:{},svg:H,vml:r,win:a,charts:[],marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:function(){}}}();(function(a){var B=[],A=a.charts,H=a.doc,G=a.win;a.error=function(r,g){r=a.isNumber(r)?"Highcharts error #"+
r+": www.highcharts.com/errors/"+r:r;if(g)throw Error(r);G.console&&console.log(r)};a.Fx=function(a,g,f){this.options=g;this.elem=a;this.prop=f};a.Fx.prototype={dSetter:function(){var a=this.paths[0],g=this.paths[1],f=[],u=this.now,l=a.length,q;if(1===u)f=this.toD;else if(l===g.length&&1>u)for(;l--;)q=parseFloat(a[l]),f[l]=isNaN(q)?a[l]:u*parseFloat(g[l]-q)+q;else f=g;this.elem.attr("d",f,null,!0)},update:function(){var a=this.elem,g=this.prop,f=this.now,u=this.options.step;if(this[g+"Setter"])this[g+
"Setter"]();else a.attr?a.element&&a.attr(g,f,null,!0):a.style[g]=f+this.unit;u&&u.call(a,f,this)},run:function(a,g,f){var r=this,l=function(a){return l.stopped?!1:r.step(a)},q;this.startTime=+new Date;this.start=a;this.end=g;this.unit=f;this.now=this.start;this.pos=0;l.elem=this.elem;l.prop=this.prop;l()&&1===B.push(l)&&(l.timerId=setInterval(function(){for(q=0;q<B.length;q++)B[q]()||B.splice(q--,1);B.length||clearInterval(l.timerId)},13))},step:function(a){var r=+new Date,f,u=this.options;f=this.elem;
var l=u.complete,q=u.duration,d=u.curAnim,b;if(f.attr&&!f.element)f=!1;else if(a||r>=q+this.startTime){this.now=this.end;this.pos=1;this.update();a=d[this.prop]=!0;for(b in d)!0!==d[b]&&(a=!1);a&&l&&l.call(f);f=!1}else this.pos=u.easing((r-this.startTime)/q),this.now=this.start+(this.end-this.start)*this.pos,this.update(),f=!0;return f},initPath:function(r,g,f){function u(a){var e,b;for(n=a.length;n--;)e="M"===a[n]||"L"===a[n],b=/[a-zA-Z]/.test(a[n+3]),e&&b&&a.splice(n+1,0,a[n+1],a[n+2],a[n+1],a[n+
2])}function l(a,e){for(;a.length<m;){a[0]=e[m-a.length];var b=a.slice(0,t);[].splice.apply(a,[0,0].concat(b));E&&(b=a.slice(a.length-t),[].splice.apply(a,[a.length,0].concat(b)),n--)}a[0]="M"}function q(a,e){for(var b=(m-a.length)/t;0<b&&b--;)c=a.slice().splice(a.length/z-t,t*z),c[0]=e[m-t-b*t],C&&(c[t-6]=c[t-2],c[t-5]=c[t-1]),[].splice.apply(a,[a.length/z,0].concat(c)),E&&b--}g=g||"";var d,b=r.startX,p=r.endX,C=-1<g.indexOf("C"),t=C?7:3,m,c,n;g=g.split(" ");f=f.slice();var E=r.isArea,z=E?2:1,e;
C&&(u(g),u(f));if(b&&p){for(n=0;n<b.length;n++)if(b[n]===p[0]){d=n;break}else if(b[0]===p[p.length-b.length+n]){d=n;e=!0;break}void 0===d&&(g=[])}g.length&&a.isNumber(d)&&(m=f.length+d*z*t,e?(l(g,f),q(f,g)):(l(f,g),q(g,f)));return[g,f]}};a.extend=function(a,g){var f;a||(a={});for(f in g)a[f]=g[f];return a};a.merge=function(){var r,g=arguments,f,u={},l=function(q,d){var b,p;"object"!==typeof q&&(q={});for(p in d)d.hasOwnProperty(p)&&(b=d[p],a.isObject(b,!0)&&"renderTo"!==p&&"number"!==typeof b.nodeType?
q[p]=l(q[p]||{},b):q[p]=d[p]);return q};!0===g[0]&&(u=g[1],g=Array.prototype.slice.call(g,2));f=g.length;for(r=0;r<f;r++)u=l(u,g[r]);return u};a.pInt=function(a,g){return parseInt(a,g||10)};a.isString=function(a){return"string"===typeof a};a.isArray=function(a){a=Object.prototype.toString.call(a);return"[object Array]"===a||"[object Array Iterator]"===a};a.isObject=function(r,g){return r&&"object"===typeof r&&(!g||!a.isArray(r))};a.isNumber=function(a){return"number"===typeof a&&!isNaN(a)};a.erase=
function(a,g){for(var f=a.length;f--;)if(a[f]===g){a.splice(f,1);break}};a.defined=function(a){return void 0!==a&&null!==a};a.attr=function(r,g,f){var u,l;if(a.isString(g))a.defined(f)?r.setAttribute(g,f):r&&r.getAttribute&&(l=r.getAttribute(g));else if(a.defined(g)&&a.isObject(g))for(u in g)r.setAttribute(u,g[u]);return l};a.splat=function(r){return a.isArray(r)?r:[r]};a.syncTimeout=function(a,g,f){if(g)return setTimeout(a,g,f);a.call(0,f)};a.pick=function(){var a=arguments,g,f,u=a.length;for(g=
0;g<u;g++)if(f=a[g],void 0!==f&&null!==f)return f};a.css=function(r,g){a.isMS&&!a.svg&&g&&void 0!==g.opacity&&(g.filter="alpha(opacity\x3d"+100*g.opacity+")");a.extend(r.style,g)};a.createElement=function(r,g,f,u,l){r=H.createElement(r);var q=a.css;g&&a.extend(r,g);l&&q(r,{padding:0,border:"none",margin:0});f&&q(r,f);u&&u.appendChild(r);return r};a.extendClass=function(r,g){var f=function(){};f.prototype=new r;a.extend(f.prototype,g);return f};a.pad=function(a,g,f){return Array((g||2)+1-String(a).length).join(f||
0)+a};a.relativeLength=function(a,g){return/%$/.test(a)?g*parseFloat(a)/100:parseFloat(a)};a.wrap=function(a,g,f){var r=a[g];a[g]=function(){var a=Array.prototype.slice.call(arguments),q=arguments,d=this;d.proceed=function(){r.apply(d,arguments.length?arguments:q)};a.unshift(r);a=f.apply(this,a);d.proceed=null;return a}};a.getTZOffset=function(r){var g=a.Date;return 6E4*(g.hcGetTimezoneOffset&&g.hcGetTimezoneOffset(r)||g.hcTimezoneOffset||0)};a.dateFormat=function(r,g,f){if(!a.defined(g)||isNaN(g))return a.defaultOptions.lang.invalidDate||
"";r=a.pick(r,"%Y-%m-%d %H:%M:%S");var u=a.Date,l=new u(g-a.getTZOffset(g)),q,d=l[u.hcGetHours](),b=l[u.hcGetDay](),p=l[u.hcGetDate](),C=l[u.hcGetMonth](),t=l[u.hcGetFullYear](),m=a.defaultOptions.lang,c=m.weekdays,n=m.shortWeekdays,E=a.pad,u=a.extend({a:n?n[b]:c[b].substr(0,3),A:c[b],d:E(p),e:E(p,2," "),w:b,b:m.shortMonths[C],B:m.months[C],m:E(C+1),y:t.toString().substr(2,2),Y:t,H:E(d),k:d,I:E(d%12||12),l:d%12||12,M:E(l[u.hcGetMinutes]()),p:12>d?"AM":"PM",P:12>d?"am":"pm",S:E(l.getSeconds()),L:E(Math.round(g%
1E3),3)},a.dateFormats);for(q in u)for(;-1!==r.indexOf("%"+q);)r=r.replace("%"+q,"function"===typeof u[q]?u[q](g):u[q]);return f?r.substr(0,1).toUpperCase()+r.substr(1):r};a.formatSingle=function(r,g){var f=/\.([0-9])/,u=a.defaultOptions.lang;/f$/.test(r)?(f=(f=r.match(f))?f[1]:-1,null!==g&&(g=a.numberFormat(g,f,u.decimalPoint,-1<r.indexOf(",")?u.thousandsSep:""))):g=a.dateFormat(r,g);return g};a.format=function(r,g){for(var f="{",u=!1,l,q,d,b,p=[],C;r;){f=r.indexOf(f);if(-1===f)break;l=r.slice(0,
f);if(u){l=l.split(":");q=l.shift().split(".");b=q.length;C=g;for(d=0;d<b;d++)C=C[q[d]];l.length&&(C=a.formatSingle(l.join(":"),C));p.push(C)}else p.push(l);r=r.slice(f+1);f=(u=!u)?"}":"{"}p.push(r);return p.join("")};a.getMagnitude=function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))};a.normalizeTickInterval=function(r,g,f,u,l){var q,d=r;f=a.pick(f,1);q=r/f;g||(g=l?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===u&&(1===f?g=a.grep(g,function(a){return 0===a%1}):.1>=f&&(g=[1/f])));
for(u=0;u<g.length&&!(d=g[u],l&&d*f>=r||!l&&q<=(g[u]+(g[u+1]||g[u]))/2);u++);return d=a.correctFloat(d*f,-Math.round(Math.log(.001)/Math.LN10))};a.stableSort=function(a,g){var f=a.length,r,l;for(l=0;l<f;l++)a[l].safeI=l;a.sort(function(a,d){r=g(a,d);return 0===r?a.safeI-d.safeI:r});for(l=0;l<f;l++)delete a[l].safeI};a.arrayMin=function(a){for(var g=a.length,f=a[0];g--;)a[g]<f&&(f=a[g]);return f};a.arrayMax=function(a){for(var g=a.length,f=a[0];g--;)a[g]>f&&(f=a[g]);return f};a.destroyObjectProperties=
function(a,g){for(var f in a)a[f]&&a[f]!==g&&a[f].destroy&&a[f].destroy(),delete a[f]};a.discardElement=function(r){var g=a.garbageBin;g||(g=a.createElement("div"));r&&g.appendChild(r);g.innerHTML=""};a.correctFloat=function(a,g){return parseFloat(a.toPrecision(g||14))};a.setAnimation=function(r,g){g.renderer.globalAnimation=a.pick(r,g.options.chart.animation,!0)};a.animObject=function(r){return a.isObject(r)?a.merge(r):{duration:r?500:0}};a.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,
day:864E5,week:6048E5,month:24192E5,year:314496E5};a.numberFormat=function(r,g,f,u){r=+r||0;g=+g;var l=a.defaultOptions.lang,q=(r.toString().split(".")[1]||"").length,d,b;-1===g?g=Math.min(q,20):a.isNumber(g)||(g=2);b=(Math.abs(r)+Math.pow(10,-Math.max(g,q)-1)).toFixed(g);q=String(a.pInt(b));d=3<q.length?q.length%3:0;f=a.pick(f,l.decimalPoint);u=a.pick(u,l.thousandsSep);r=(0>r?"-":"")+(d?q.substr(0,d)+u:"");r+=q.substr(d).replace(/(\d{3})(?=\d)/g,"$1"+u);g&&(r+=f+b.slice(-g));return r};Math.easeInOutSine=
function(a){return-.5*(Math.cos(Math.PI*a)-1)};a.getStyle=function(r,g){return"width"===g?Math.min(r.offsetWidth,r.scrollWidth)-a.getStyle(r,"padding-left")-a.getStyle(r,"padding-right"):"height"===g?Math.min(r.offsetHeight,r.scrollHeight)-a.getStyle(r,"padding-top")-a.getStyle(r,"padding-bottom"):(r=G.getComputedStyle(r,void 0))&&a.pInt(r.getPropertyValue(g))};a.inArray=function(a,g){return g.indexOf?g.indexOf(a):[].indexOf.call(g,a)};a.grep=function(a,g){return[].filter.call(a,g)};a.find=function(a,
g){return[].find.call(a,g)};a.map=function(a,g){for(var f=[],u=0,l=a.length;u<l;u++)f[u]=g.call(a[u],a[u],u,a);return f};a.offset=function(a){var g=H.documentElement;a=a.getBoundingClientRect();return{top:a.top+(G.pageYOffset||g.scrollTop)-(g.clientTop||0),left:a.left+(G.pageXOffset||g.scrollLeft)-(g.clientLeft||0)}};a.stop=function(a,g){for(var f=B.length;f--;)B[f].elem!==a||g&&g!==B[f].prop||(B[f].stopped=!0)};a.each=function(a,g,f){return Array.prototype.forEach.call(a,g,f)};a.addEvent=function(r,
g,f){function u(a){a.target=a.srcElement||G;f.call(r,a)}var l=r.hcEvents=r.hcEvents||{};r.addEventListener?r.addEventListener(g,f,!1):r.attachEvent&&(r.hcEventsIE||(r.hcEventsIE={}),r.hcEventsIE[f.toString()]=u,r.attachEvent("on"+g,u));l[g]||(l[g]=[]);l[g].push(f);return function(){a.removeEvent(r,g,f)}};a.removeEvent=function(r,g,f){function u(a,b){r.removeEventListener?r.removeEventListener(a,b,!1):r.attachEvent&&(b=r.hcEventsIE[b.toString()],r.detachEvent("on"+a,b))}function l(){var a,b;if(r.nodeName)for(b in g?
(a={},a[g]=!0):a=d,a)if(d[b])for(a=d[b].length;a--;)u(b,d[b][a])}var q,d=r.hcEvents,b;d&&(g?(q=d[g]||[],f?(b=a.inArray(f,q),-1<b&&(q.splice(b,1),d[g]=q),u(g,f)):(l(),d[g]=[])):(l(),r.hcEvents={}))};a.fireEvent=function(r,g,f,u){var l;l=r.hcEvents;var q,d;f=f||{};if(H.createEvent&&(r.dispatchEvent||r.fireEvent))l=H.createEvent("Events"),l.initEvent(g,!0,!0),a.extend(l,f),r.dispatchEvent?r.dispatchEvent(l):r.fireEvent(g,l);else if(l)for(l=l[g]||[],q=l.length,f.target||a.extend(f,{preventDefault:function(){f.defaultPrevented=
!0},target:r,type:g}),g=0;g<q;g++)(d=l[g])&&!1===d.call(r,f)&&f.preventDefault();u&&!f.defaultPrevented&&u(f)};a.animate=function(r,g,f){var u,l="",q,d,b;a.isObject(f)||(u=arguments,f={duration:u[2],easing:u[3],complete:u[4]});a.isNumber(f.duration)||(f.duration=400);f.easing="function"===typeof f.easing?f.easing:Math[f.easing]||Math.easeInOutSine;f.curAnim=a.merge(g);for(b in g)a.stop(r,b),d=new a.Fx(r,f,b),q=null,"d"===b?(d.paths=d.initPath(r,r.d,g.d),d.toD=g.d,u=0,q=1):r.attr?u=r.attr(b):(u=parseFloat(a.getStyle(r,
b))||0,"opacity"!==b&&(l="px")),q||(q=g[b]),q.match&&q.match("px")&&(q=q.replace(/px/g,"")),d.run(u,q,l)};a.seriesType=function(r,g,f,u,l){var q=a.getOptions(),d=a.seriesTypes;q.plotOptions[r]=a.merge(q.plotOptions[g],f);d[r]=a.extendClass(d[g]||function(){},u);d[r].prototype.type=r;l&&(d[r].prototype.pointClass=a.extendClass(a.Point,l));return d[r]};a.uniqueKey=function(){var a=Math.random().toString(36).substring(2,9),g=0;return function(){return"highcharts-"+a+"-"+g++}}();G.jQuery&&(G.jQuery.fn.highcharts=
function(){var r=[].slice.call(arguments);if(this[0])return r[0]?(new (a[a.isString(r[0])?r.shift():"Chart"])(this[0],r[0],r[1]),this):A[a.attr(this[0],"data-highcharts-chart")]});H&&!H.defaultView&&(a.getStyle=function(r,g){var f={width:"clientWidth",height:"clientHeight"}[g];if(r.style[g])return a.pInt(r.style[g]);"opacity"===g&&(g="filter");if(f)return r.style.zoom=1,Math.max(r[f]-2*a.getStyle(r,"padding"),0);r=r.currentStyle[g.replace(/\-(\w)/g,function(a,l){return l.toUpperCase()})];"filter"===
g&&(r=r.replace(/alpha\(opacity=([0-9]+)\)/,function(a,l){return l/100}));return""===r?1:a.pInt(r)});Array.prototype.forEach||(a.each=function(a,g,f){for(var u=0,l=a.length;u<l;u++)if(!1===g.call(f,a[u],u,a))return u});Array.prototype.indexOf||(a.inArray=function(a,g){var f,u=0;if(g)for(f=g.length;u<f;u++)if(g[u]===a)return u;return-1});Array.prototype.filter||(a.grep=function(a,g){for(var f=[],u=0,l=a.length;u<l;u++)g(a[u],u)&&f.push(a[u]);return f});Array.prototype.find||(a.find=function(a,g){var f,
u=a.length;for(f=0;f<u;f++)if(g(a[f],f))return a[f]})})(L);(function(a){var B=a.each,A=a.isNumber,H=a.map,G=a.merge,r=a.pInt;a.Color=function(g){if(!(this instanceof a.Color))return new a.Color(g);this.init(g)};a.Color.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[r(a[1]),r(a[2]),r(a[3]),parseFloat(a[4],10)]}},{regex:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(a){return[r(a[1],
16),r(a[2],16),r(a[3],16),1]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[r(a[1]),r(a[2]),r(a[3]),1]}}],names:{white:"#ffffff",black:"#000000"},init:function(g){var f,u,l,q;if((this.input=g=this.names[g]||g)&&g.stops)this.stops=H(g.stops,function(d){return new a.Color(d[1])});else for(l=this.parsers.length;l--&&!u;)q=this.parsers[l],(f=q.regex.exec(g))&&(u=q.parse(f));this.rgba=u||[]},get:function(a){var f=this.input,g=this.rgba,l;this.stops?
(l=G(f),l.stops=[].concat(l.stops),B(this.stops,function(f,d){l.stops[d]=[l.stops[d][0],f.get(a)]})):l=g&&A(g[0])?"rgb"===a||!a&&1===g[3]?"rgb("+g[0]+","+g[1]+","+g[2]+")":"a"===a?g[3]:"rgba("+g.join(",")+")":f;return l},brighten:function(a){var f,g=this.rgba;if(this.stops)B(this.stops,function(l){l.brighten(a)});else if(A(a)&&0!==a)for(f=0;3>f;f++)g[f]+=r(255*a),0>g[f]&&(g[f]=0),255<g[f]&&(g[f]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this}};a.color=function(g){return new a.Color(g)}})(L);
(function(a){var B,A,H=a.addEvent,G=a.animate,r=a.attr,g=a.charts,f=a.color,u=a.css,l=a.createElement,q=a.defined,d=a.deg2rad,b=a.destroyObjectProperties,p=a.doc,C=a.each,t=a.extend,m=a.erase,c=a.grep,n=a.hasTouch,E=a.inArray,z=a.isArray,e=a.isFirefox,x=a.isMS,F=a.isObject,w=a.isString,h=a.isWebKit,y=a.merge,J=a.noop,K=a.pick,I=a.pInt,k=a.removeEvent,D=a.stop,P=a.svg,N=a.SVG_NS,S=a.symbolSizes,O=a.win;B=a.SVGElement=function(){return this};B.prototype={opacity:1,SVG_NS:N,textProps:"direction fontSize fontWeight fontFamily fontStyle color lineHeight width textDecoration textOverflow textOutline".split(" "),
init:function(a,k){this.element="span"===k?l(k):p.createElementNS(this.SVG_NS,k);this.renderer=a},animate:function(v,k,e){k=a.animObject(K(k,this.renderer.globalAnimation,!0));0!==k.duration?(e&&(k.complete=e),G(this,v,k)):this.attr(v,null,e);return this},colorGradient:function(v,k,e){var b=this.renderer,h,D,c,x,M,m,n,d,F,t,p,w=[],l;v.linearGradient?D="linearGradient":v.radialGradient&&(D="radialGradient");if(D){c=v[D];M=b.gradients;n=v.stops;t=e.radialReference;z(c)&&(v[D]=c={x1:c[0],y1:c[1],x2:c[2],
y2:c[3],gradientUnits:"userSpaceOnUse"});"radialGradient"===D&&t&&!q(c.gradientUnits)&&(x=c,c=y(c,b.getRadialAttr(t,x),{gradientUnits:"userSpaceOnUse"}));for(p in c)"id"!==p&&w.push(p,c[p]);for(p in n)w.push(n[p]);w=w.join(",");M[w]?t=M[w].attr("id"):(c.id=t=a.uniqueKey(),M[w]=m=b.createElement(D).attr(c).add(b.defs),m.radAttr=x,m.stops=[],C(n,function(v){0===v[1].indexOf("rgba")?(h=a.color(v[1]),d=h.get("rgb"),F=h.get("a")):(d=v[1],F=1);v=b.createElement("stop").attr({offset:v[0],"stop-color":d,
"stop-opacity":F}).add(m);m.stops.push(v)}));l="url("+b.url+"#"+t+")";e.setAttribute(k,l);e.gradient=w;v.toString=function(){return l}}},applyTextOutline:function(a){var v=this.element,k,e,b,c;-1!==a.indexOf("contrast")&&(a=a.replace(/contrast/g,this.renderer.getContrast(v.style.fill)));this.fakeTS=!0;this.ySetter=this.xSetter;k=[].slice.call(v.getElementsByTagName("tspan"));a=a.split(" ");e=a[a.length-1];(b=a[0])&&"none"!==b&&(b=b.replace(/(^[\d\.]+)(.*?)$/g,function(a,v,k){return 2*v+k}),C(k,function(a){"highcharts-text-outline"===
a.getAttribute("class")&&m(k,v.removeChild(a))}),c=v.firstChild,C(k,function(a,k){0===k&&(a.setAttribute("x",v.getAttribute("x")),k=v.getAttribute("y"),a.setAttribute("y",k||0),null===k&&v.setAttribute("y",0));a=a.cloneNode(1);r(a,{"class":"highcharts-text-outline",fill:e,stroke:e,"stroke-width":b,"stroke-linejoin":"round"});v.insertBefore(a,c)}))},attr:function(a,k,e,b){var v,c=this.element,h,x=this,M;"string"===typeof a&&void 0!==k&&(v=a,a={},a[v]=k);if("string"===typeof a)x=(this[a+"Getter"]||
this._defaultGetter).call(this,a,c);else{for(v in a)k=a[v],M=!1,b||D(this,v),this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(v)&&(h||(this.symbolAttr(a),h=!0),M=!0),!this.rotation||"x"!==v&&"y"!==v||(this.doTransform=!0),M||(M=this[v+"Setter"]||this._defaultSetter,M.call(this,k,v,c),this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(v)&&this.updateShadows(v,k,M));this.doTransform&&(this.updateTransform(),this.doTransform=!1)}e&&e();return x},updateShadows:function(a,
k,e){for(var v=this.shadows,b=v.length;b--;)e.call(v[b],"height"===a?Math.max(k-(v[b].cutHeight||0),0):"d"===a?this.d:k,a,v[b])},addClass:function(a,k){var v=this.attr("class")||"";-1===v.indexOf(a)&&(k||(a=(v+(v?" ":"")+a).replace("  "," ")),this.attr("class",a));return this},hasClass:function(a){return-1!==r(this.element,"class").indexOf(a)},removeClass:function(a){r(this.element,"class",(r(this.element,"class")||"").replace(a,""));return this},symbolAttr:function(a){var v=this;C("x y r start end width height innerR anchorX anchorY".split(" "),
function(k){v[k]=K(a[k],v[k])});v.attr({d:v.renderer.symbols[v.symbolName](v.x,v.y,v.width,v.height,v)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a,k){var v,e={},b;k=k||a.strokeWidth||0;b=Math.round(k)%2/2;a.x=Math.floor(a.x||this.x||0)+b;a.y=Math.floor(a.y||this.y||0)+b;a.width=Math.floor((a.width||this.width||0)-2*b);a.height=Math.floor((a.height||this.height||0)-2*b);q(a.strokeWidth)&&(a.strokeWidth=k);for(v in a)this[v]!==a[v]&&
(this[v]=e[v]=a[v]);return e},css:function(a){var v=this.styles,k={},e=this.element,b,c,h="";b=!v;var D=["textOverflow","width"];a&&a.color&&(a.fill=a.color);if(v)for(c in a)a[c]!==v[c]&&(k[c]=a[c],b=!0);if(b){b=this.textWidth=a&&a.width&&"text"===e.nodeName.toLowerCase()&&I(a.width)||this.textWidth;v&&(a=t(v,k));this.styles=a;b&&!P&&this.renderer.forExport&&delete a.width;if(x&&!P)u(this.element,a);else{v=function(a,v){return"-"+v.toLowerCase()};for(c in a)-1===E(c,D)&&(h+=c.replace(/([A-Z])/g,v)+
":"+a[c]+";");h&&r(e,"style",h)}this.added&&(b&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline))}return this},strokeWidth:function(){return this["stroke-width"]||0},on:function(a,k){var v=this,e=v.element;n&&"click"===a?(e.ontouchstart=function(a){v.touchEventFired=Date.now();a.preventDefault();k.call(e,a)},e.onclick=function(a){(-1===O.navigator.userAgent.indexOf("Android")||1100<Date.now()-(v.touchEventFired||0))&&k.call(e,a)}):e["on"+a]=k;return this},setRadialReference:function(a){var v=
this.renderer.gradients[this.element.gradient];this.element.radialReference=a;v&&v.radAttr&&v.animate(this.renderer.getRadialAttr(a,v.radAttr));return this},translate:function(a,k){return this.attr({translateX:a,translateY:k})},invert:function(a){this.inverted=a;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,k=this.translateY||0,e=this.scaleX,b=this.scaleY,c=this.inverted,h=this.rotation,D=this.element;c&&(a+=this.width,k+=this.height);a=["translate("+a+","+
k+")"];c?a.push("rotate(90) scale(-1,1)"):h&&a.push("rotate("+h+" "+(D.getAttribute("x")||0)+" "+(D.getAttribute("y")||0)+")");(q(e)||q(b))&&a.push("scale("+K(e,1)+" "+K(b,1)+")");a.length&&D.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,k,e){var v,b,c,h,D={};b=this.renderer;c=b.alignedObjects;var x,y;if(a){if(this.alignOptions=a,this.alignByTranslate=k,!e||w(e))this.alignTo=v=e||"renderer",m(c,this),c.push(this),
e=null}else a=this.alignOptions,k=this.alignByTranslate,v=this.alignTo;e=K(e,b[v],b);v=a.align;b=a.verticalAlign;c=(e.x||0)+(a.x||0);h=(e.y||0)+(a.y||0);"right"===v?x=1:"center"===v&&(x=2);x&&(c+=(e.width-(a.width||0))/x);D[k?"translateX":"x"]=Math.round(c);"bottom"===b?y=1:"middle"===b&&(y=2);y&&(h+=(e.height-(a.height||0))/y);D[k?"translateY":"y"]=Math.round(h);this[this.placed?"animate":"attr"](D);this.placed=!0;this.alignAttr=D;return this},getBBox:function(a,k){var v,e=this.renderer,b,c=this.element,
h=this.styles,D,x=this.textStr,m,y=e.cache,n=e.cacheKeys,F;k=K(k,this.rotation);b=k*d;D=h&&h.fontSize;void 0!==x&&(F=x.toString(),-1===F.indexOf("\x3c")&&(F=F.replace(/[0-9]/g,"0")),F+=["",k||0,D,h&&h.width,h&&h.textOverflow].join());F&&!a&&(v=y[F]);if(!v){if(c.namespaceURI===this.SVG_NS||e.forExport){try{(m=this.fakeTS&&function(a){C(c.querySelectorAll(".highcharts-text-outline"),function(v){v.style.display=a})})&&m("none"),v=c.getBBox?t({},c.getBBox()):{width:c.offsetWidth,height:c.offsetHeight},
m&&m("")}catch(W){}if(!v||0>v.width)v={width:0,height:0}}else v=this.htmlGetBBox();e.isSVG&&(a=v.width,e=v.height,h&&"11px"===h.fontSize&&17===Math.round(e)&&(v.height=e=14),k&&(v.width=Math.abs(e*Math.sin(b))+Math.abs(a*Math.cos(b)),v.height=Math.abs(e*Math.cos(b))+Math.abs(a*Math.sin(b))));if(F&&0<v.height){for(;250<n.length;)delete y[n.shift()];y[F]||n.push(F);y[F]=v}}return v},show:function(a){return this.attr({visibility:a?"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},
fadeOut:function(a){var v=this;v.animate({opacity:0},{duration:a||150,complete:function(){v.attr({y:-9999})}})},add:function(a){var v=this.renderer,k=this.element,e;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;void 0!==this.textStr&&v.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)e=this.zIndexSetter();e||(a?a.element:v.box).appendChild(k);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var v=a.parentNode;v&&v.removeChild(a)},destroy:function(){var a=
this.element||{},k=this.renderer.isSVG&&"SPAN"===a.nodeName&&this.parentGroup,e,b;a.onclick=a.onmouseout=a.onmouseover=a.onmousemove=a.point=null;D(this);this.clipPath&&(this.clipPath=this.clipPath.destroy());if(this.stops){for(b=0;b<this.stops.length;b++)this.stops[b]=this.stops[b].destroy();this.stops=null}this.safeRemoveChild(a);for(this.destroyShadows();k&&k.div&&0===k.div.childNodes.length;)a=k.parentGroup,this.safeRemoveChild(k.div),delete k.div,k=a;this.alignTo&&m(this.renderer.alignedObjects,
this);for(e in this)delete this[e];return null},shadow:function(a,k,e){var v=[],b,c,h=this.element,D,x,m,y;if(!a)this.destroyShadows();else if(!this.shadows){x=K(a.width,3);m=(a.opacity||.15)/x;y=this.parentInverted?"(-1,-1)":"("+K(a.offsetX,1)+", "+K(a.offsetY,1)+")";for(b=1;b<=x;b++)c=h.cloneNode(0),D=2*x+1-2*b,r(c,{isShadow:"true",stroke:a.color||"#000000","stroke-opacity":m*b,"stroke-width":D,transform:"translate"+y,fill:"none"}),e&&(r(c,"height",Math.max(r(c,"height")-D,0)),c.cutHeight=D),k?
k.element.appendChild(c):h.parentNode.insertBefore(c,h),v.push(c);this.shadows=v}return this},destroyShadows:function(){C(this.shadows||[],function(a){this.safeRemoveChild(a)},this);this.shadows=void 0},xGetter:function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)},_defaultGetter:function(a){a=K(this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,k,e){a&&a.join&&(a=
a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");e.setAttribute(k,a);this[k]=a},dashstyleSetter:function(a){var v,k=this["stroke-width"];"inherit"===k&&(k=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(v=a.length;v--;)a[v]=I(a[v])*k;a=a.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",
a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,k,e){this[k]=a;e.setAttribute(k,a)},titleSetter:function(a){var v=this.element.getElementsByTagName("title")[0];v||(v=p.createElementNS(this.SVG_NS,"title"),this.element.appendChild(v));v.firstChild&&v.removeChild(v.firstChild);v.appendChild(p.createTextNode(String(K(a),"").replace(/<[^>]*>/g,"")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,
this.textStr=a,this.added&&this.renderer.buildText(this))},fillSetter:function(a,k,e){"string"===typeof a?e.setAttribute(k,a):a&&this.colorGradient(a,k,e)},visibilitySetter:function(a,k,e){"inherit"===a?e.removeAttribute(k):e.setAttribute(k,a)},zIndexSetter:function(a,k){var v=this.renderer,e=this.parentGroup,b=(e||v).element||v.box,c,h=this.element,D;c=this.added;var x;q(a)&&(h.zIndex=a,a=+a,this[k]===a&&(c=!1),this[k]=a);if(c){(a=this.zIndex)&&e&&(e.handleZ=!0);k=b.childNodes;for(x=0;x<k.length&&
!D;x++)e=k[x],c=e.zIndex,e!==h&&(I(c)>a||!q(a)&&q(c)||0>a&&!q(c)&&b!==v.box)&&(b.insertBefore(h,e),D=!0);D||b.appendChild(h)}return D},_defaultSetter:function(a,k,e){e.setAttribute(k,a)}};B.prototype.yGetter=B.prototype.xGetter;B.prototype.translateXSetter=B.prototype.translateYSetter=B.prototype.rotationSetter=B.prototype.verticalAlignSetter=B.prototype.scaleXSetter=B.prototype.scaleYSetter=function(a,k){this[k]=a;this.doTransform=!0};B.prototype["stroke-widthSetter"]=B.prototype.strokeSetter=function(a,
k,e){this[k]=a;this.stroke&&this["stroke-width"]?(B.prototype.fillSetter.call(this,this.stroke,"stroke",e),e.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===k&&0===a&&this.hasStroke&&(e.removeAttribute("stroke"),this.hasStroke=!1)};A=a.SVGRenderer=function(){this.init.apply(this,arguments)};A.prototype={Element:B,SVG_NS:N,init:function(a,k,b,c,D,x){var v;c=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"}).css(this.getStyle(c));v=c.element;
a.appendChild(v);-1===a.innerHTML.indexOf("xmlns")&&r(v,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=v;this.boxWrapper=c;this.alignedObjects=[];this.url=(e||h)&&p.getElementsByTagName("base").length?O.location.href.replace(/#.*?$/,"").replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(p.createTextNode("Created with Highcharts 5.0.7"));this.defs=this.createElement("defs").add();this.allowHTML=x;this.forExport=D;this.gradients=
{};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(k,b,!1);var m;e&&a.getBoundingClientRect&&(k=function(){u(a,{left:0,top:0});m=a.getBoundingClientRect();u(a,{left:Math.ceil(m.left)-m.left+"px",top:Math.ceil(m.top)-m.top+"px"})},k(),this.unSubPixelFix=H(O,"resize",k))},getStyle:function(a){return this.style=t({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},setStyle:function(a){this.boxWrapper.css(this.getStyle(a))},isHidden:function(){return!this.boxWrapper.getBBox().width},
destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();b(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=null},createElement:function(a){var k=new this.Element;k.init(this,a);return k},draw:J,getRadialAttr:function(a,k){return{cx:a[0]-a[2]/2+k.cx*a[2],cy:a[1]-a[2]/2+k.cy*a[2],r:k.r*a[2]}},buildText:function(a){var k=a.element,v=this,e=v.forExport,b=K(a.textStr,"").toString(),
h=-1!==b.indexOf("\x3c"),D=k.childNodes,x,m,y,n,F=r(k,"x"),d=a.styles,t=a.textWidth,w=d&&d.lineHeight,l=d&&d.textOutline,z=d&&"ellipsis"===d.textOverflow,f=d&&"nowrap"===d.whiteSpace,E=d&&d.fontSize,q,g=D.length,d=t&&!a.added&&this.box,J=function(a){var e;e=/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:E||v.style.fontSize||12;return w?I(w):v.fontMetrics(e,a.getAttribute("style")?a:k).h};q=[b,z,f,w,l,E,t].join();if(q!==a.textCache){for(a.textCache=q;g--;)k.removeChild(D[g]);h||l||z||t||-1!==
b.indexOf(" ")?(x=/<.*class="([^"]+)".*>/,m=/<.*style="([^"]+)".*>/,y=/<.*href="(http[^"]+)".*>/,d&&d.appendChild(k),b=h?b.replace(/<(b|strong)>/g,'\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g,'\x3cspan style\x3d"font-style:italic"\x3e').replace(/<a/g,"\x3cspan").replace(/<\/(b|strong|i|em|a)>/g,"\x3c/span\x3e").split(/<br.*?>/g):[b],b=c(b,function(a){return""!==a}),C(b,function(b,c){var h,D=0;b=b.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||\x3cspan").replace(/<\/span>/g,"\x3c/span\x3e|||");
h=b.split("|||");C(h,function(b){if(""!==b||1===h.length){var d={},w=p.createElementNS(v.SVG_NS,"tspan"),l,E;x.test(b)&&(l=b.match(x)[1],r(w,"class",l));m.test(b)&&(E=b.match(m)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),r(w,"style",E));y.test(b)&&!e&&(r(w,"onclick",'location.href\x3d"'+b.match(y)[1]+'"'),u(w,{cursor:"pointer"}));b=(b.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e");if(" "!==b){w.appendChild(p.createTextNode(b));D?d.dx=0:c&&null!==F&&(d.x=F);r(w,d);
k.appendChild(w);!D&&c&&(!P&&e&&u(w,{display:"block"}),r(w,"dy",J(w)));if(t){d=b.replace(/([^\^])-/g,"$1- ").split(" ");l=1<h.length||c||1<d.length&&!f;for(var q,g,M=[],C=J(w),K=a.rotation,I=b,Q=I.length;(l||z)&&(d.length||M.length);)a.rotation=0,q=a.getBBox(!0),g=q.width,!P&&v.forExport&&(g=v.measureSpanWidth(w.firstChild.data,a.styles)),q=g>t,void 0===n&&(n=q),z&&n?(Q/=2,""===I||!q&&.5>Q?d=[]:(I=b.substring(0,I.length+(q?-1:1)*Math.ceil(Q)),d=[I+(3<t?"\u2026":"")],w.removeChild(w.firstChild))):
q&&1!==d.length?(w.removeChild(w.firstChild),M.unshift(d.pop())):(d=M,M=[],d.length&&!f&&(w=p.createElementNS(N,"tspan"),r(w,{dy:C,x:F}),E&&r(w,"style",E),k.appendChild(w)),g>t&&(t=g)),d.length&&w.appendChild(p.createTextNode(d.join(" ").replace(/- /g,"-")));a.rotation=K}D++}}})}),n&&a.attr("title",a.textStr),d&&d.removeChild(k),l&&a.applyTextOutline&&a.applyTextOutline(l)):k.appendChild(p.createTextNode(b.replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e")))}},getContrast:function(a){a=f(a).rgba;return 510<
a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,k,e,b,c,h,D,m,d){var v=this.label(a,k,e,d,null,null,null,null,"button"),n=0;v.attr(y({padding:8,r:2},c));var F,w,p,l;c=y({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",cursor:"pointer",fontWeight:"normal"}},c);F=c.style;delete c.style;h=y(c,{fill:"#e6e6e6"},h);w=h.style;delete h.style;D=y(c,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},D);p=D.style;delete D.style;m=y(c,{style:{color:"#cccccc"}},m);l=m.style;
delete m.style;H(v.element,x?"mouseover":"mouseenter",function(){3!==n&&v.setState(1)});H(v.element,x?"mouseout":"mouseleave",function(){3!==n&&v.setState(n)});v.setState=function(a){1!==a&&(v.state=n=a);v.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][a||0]);v.attr([c,h,D,m][a||0]).css([F,w,p,l][a||0])};v.attr(c).css(t({cursor:"default"},F));return v.on("click",function(a){3!==n&&b.call(v,a)})},crispLine:function(a,
k){a[1]===a[4]&&(a[1]=a[4]=Math.round(a[1])-k%2/2);a[2]===a[5]&&(a[2]=a[5]=Math.round(a[2])+k%2/2);return a},path:function(a){var k={fill:"none"};z(a)?k.d=a:F(a)&&t(k,a);return this.createElement("path").attr(k)},circle:function(a,k,e){a=F(a)?a:{x:a,y:k,r:e};k=this.createElement("circle");k.xSetter=k.ySetter=function(a,k,e){e.setAttribute("c"+k,a)};return k.attr(a)},arc:function(a,k,e,b,c,h){F(a)&&(k=a.y,e=a.r,b=a.innerR,c=a.start,h=a.end,a=a.x);a=this.symbol("arc",a||0,k||0,e||0,e||0,{innerR:b||
0,start:c||0,end:h||0});a.r=e;return a},rect:function(a,k,e,b,c,h){c=F(a)?a.r:c;var v=this.createElement("rect");a=F(a)?a:void 0===a?{}:{x:a,y:k,width:Math.max(e,0),height:Math.max(b,0)};void 0!==h&&(a.strokeWidth=h,a=v.crisp(a));a.fill="none";c&&(a.r=c);v.rSetter=function(a,k,e){r(e,{rx:a,ry:a})};return v.attr(a)},setSize:function(a,k,e){var b=this.alignedObjects,v=b.length;this.width=a;this.height=k;for(this.boxWrapper.animate({width:a,height:k},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+
" "+this.attr("height")})},duration:K(e,!0)?void 0:0});v--;)b[v].align()},g:function(a){var k=this.createElement("g");return a?k.attr({"class":"highcharts-"+a}):k},image:function(a,k,e,b,c){var v={preserveAspectRatio:"none"};1<arguments.length&&t(v,{x:k,y:e,width:b,height:c});v=this.createElement("image").attr(v);v.element.setAttributeNS?v.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):v.element.setAttribute("hc-svg-href",a);return v},symbol:function(a,k,e,b,c,h){var v=this,D,x=this.symbols[a],
m=q(k)&&x&&this.symbols[a](Math.round(k),Math.round(e),b,c,h),y=/^url\((.*?)\)$/,d,n;x?(D=this.path(m),D.attr("fill","none"),t(D,{symbolName:a,x:k,y:e,width:b,height:c}),h&&t(D,h)):y.test(a)&&(d=a.match(y)[1],D=this.image(d),D.imgwidth=K(S[d]&&S[d].width,h&&h.width),D.imgheight=K(S[d]&&S[d].height,h&&h.height),n=function(){D.attr({width:D.width,height:D.height})},C(["width","height"],function(a){D[a+"Setter"]=function(a,k){var e={},b=this["img"+k],v="width"===k?"translateX":"translateY";this[k]=a;
q(b)&&(this.element&&this.element.setAttribute(k,b),this.alignByTranslate||(e[v]=((this[k]||0)-b)/2,this.attr(e)))}}),q(k)&&D.attr({x:k,y:e}),D.isImg=!0,q(D.imgwidth)&&q(D.imgheight)?n():(D.attr({width:0,height:0}),l("img",{onload:function(){var a=g[v.chartIndex];0===this.width&&(u(this,{position:"absolute",top:"-999em"}),p.body.appendChild(this));S[d]={width:this.width,height:this.height};D.imgwidth=this.width;D.imgheight=this.height;D.element&&n();this.parentNode&&this.parentNode.removeChild(this);
v.imgCount--;if(!v.imgCount&&a&&a.onload)a.onload()},src:d}),this.imgCount++));return D},symbols:{circle:function(a,k,e,b){return this.arc(a+e/2,k+b/2,e/2,b/2,{start:0,end:2*Math.PI,open:!1})},square:function(a,k,e,b){return["M",a,k,"L",a+e,k,a+e,k+b,a,k+b,"Z"]},triangle:function(a,k,e,b){return["M",a+e/2,k,"L",a+e,k+b,a,k+b,"Z"]},"triangle-down":function(a,k,e,b){return["M",a,k,"L",a+e,k,a+e/2,k+b,"Z"]},diamond:function(a,k,e,b){return["M",a+e/2,k,"L",a+e,k+b/2,a+e/2,k+b,a,k+b/2,"Z"]},arc:function(a,
k,e,b,c){var v=c.start,h=c.r||e,D=c.r||b||e,x=c.end-.001;e=c.innerR;b=c.open;var m=Math.cos(v),d=Math.sin(v),y=Math.cos(x),x=Math.sin(x);c=c.end-v<Math.PI?0:1;h=["M",a+h*m,k+D*d,"A",h,D,0,c,1,a+h*y,k+D*x];q(e)&&h.push(b?"M":"L",a+e*y,k+e*x,"A",e,e,0,c,0,a+e*m,k+e*d);h.push(b?"":"Z");return h},callout:function(a,k,e,b,c){var h=Math.min(c&&c.r||0,e,b),D=h+6,v=c&&c.anchorX;c=c&&c.anchorY;var x;x=["M",a+h,k,"L",a+e-h,k,"C",a+e,k,a+e,k,a+e,k+h,"L",a+e,k+b-h,"C",a+e,k+b,a+e,k+b,a+e-h,k+b,"L",a+h,k+b,"C",
a,k+b,a,k+b,a,k+b-h,"L",a,k+h,"C",a,k,a,k,a+h,k];v&&v>e?c>k+D&&c<k+b-D?x.splice(13,3,"L",a+e,c-6,a+e+6,c,a+e,c+6,a+e,k+b-h):x.splice(13,3,"L",a+e,b/2,v,c,a+e,b/2,a+e,k+b-h):v&&0>v?c>k+D&&c<k+b-D?x.splice(33,3,"L",a,c+6,a-6,c,a,c-6,a,k+h):x.splice(33,3,"L",a,b/2,v,c,a,b/2,a,k+h):c&&c>b&&v>a+D&&v<a+e-D?x.splice(23,3,"L",v+6,k+b,v,k+b+6,v-6,k+b,a+h,k+b):c&&0>c&&v>a+D&&v<a+e-D&&x.splice(3,3,"L",v-6,k,v,k-6,v+6,k,e-h,k);return x}},clipRect:function(k,e,b,c){var h=a.uniqueKey(),D=this.createElement("clipPath").attr({id:h}).add(this.defs);
k=this.rect(k,e,b,c,0).add(D);k.id=h;k.clipPath=D;k.count=0;return k},text:function(a,k,e,b){var c=!P&&this.forExport,h={};if(b&&(this.allowHTML||!this.forExport))return this.html(a,k,e);h.x=Math.round(k||0);e&&(h.y=Math.round(e));if(a||0===a)h.text=a;a=this.createElement("text").attr(h);c&&a.css({position:"absolute"});b||(a.xSetter=function(a,k,e){var b=e.getElementsByTagName("tspan"),c,h=e.getAttribute(k),D;for(D=0;D<b.length;D++)c=b[D],c.getAttribute(k)===h&&c.setAttribute(k,a);e.setAttribute(k,
a)});return a},fontMetrics:function(a,k){a=a||k&&k.style&&k.style.fontSize||this.style&&this.style.fontSize;a=/px/.test(a)?I(a):/em/.test(a)?parseFloat(a)*(k?this.fontMetrics(null,k.parentNode).f:16):12;k=24>a?a+3:Math.round(1.2*a);return{h:k,b:Math.round(.8*k),f:a}},rotCorr:function(a,k,e){var b=a;k&&e&&(b=Math.max(b*Math.cos(k*d),4));return{x:-a/3*Math.sin(k*d),y:b}},label:function(a,e,b,c,h,D,x,m,d){var v=this,n=v.g("button"!==d&&"label"),F=n.text=v.text("",0,0,x).attr({zIndex:1}),w,p,l=0,z=3,
E=0,f,g,J,K,P,N={},I,u,r=/^url\((.*?)\)$/.test(c),M=r,S,Q,R,O;d&&n.addClass("highcharts-"+d);M=r;S=function(){return(I||0)%2/2};Q=function(){var a=F.element.style,k={};p=(void 0===f||void 0===g||P)&&q(F.textStr)&&F.getBBox();n.width=(f||p.width||0)+2*z+E;n.height=(g||p.height||0)+2*z;u=z+v.fontMetrics(a&&a.fontSize,F).b;M&&(w||(n.box=w=v.symbols[c]||r?v.symbol(c):v.rect(),w.addClass(("button"===d?"":"highcharts-label-box")+(d?" highcharts-"+d+"-box":"")),w.add(n),a=S(),k.x=a,k.y=(m?-u:0)+a),k.width=
Math.round(n.width),k.height=Math.round(n.height),w.attr(t(k,N)),N={})};R=function(){var a=E+z,k;k=m?0:u;q(f)&&p&&("center"===P||"right"===P)&&(a+={center:.5,right:1}[P]*(f-p.width));if(a!==F.x||k!==F.y)F.attr("x",a),void 0!==k&&F.attr("y",k);F.x=a;F.y=k};O=function(a,k){w?w.attr(a,k):N[a]=k};n.onAdd=function(){F.add(n);n.attr({text:a||0===a?a:"",x:e,y:b});w&&q(h)&&n.attr({anchorX:h,anchorY:D})};n.widthSetter=function(a){f=a};n.heightSetter=function(a){g=a};n["text-alignSetter"]=function(a){P=a};
n.paddingSetter=function(a){q(a)&&a!==z&&(z=n.padding=a,R())};n.paddingLeftSetter=function(a){q(a)&&a!==E&&(E=a,R())};n.alignSetter=function(a){a={left:0,center:.5,right:1}[a];a!==l&&(l=a,p&&n.attr({x:J}))};n.textSetter=function(a){void 0!==a&&F.textSetter(a);Q();R()};n["stroke-widthSetter"]=function(a,k){a&&(M=!0);I=this["stroke-width"]=a;O(k,a)};n.strokeSetter=n.fillSetter=n.rSetter=function(a,k){"fill"===k&&a&&(M=!0);O(k,a)};n.anchorXSetter=function(a,k){h=a;O(k,Math.round(a)-S()-J)};n.anchorYSetter=
function(a,k){D=a;O(k,a-K)};n.xSetter=function(a){n.x=a;l&&(a-=l*((f||p.width)+2*z));J=Math.round(a);n.attr("translateX",J)};n.ySetter=function(a){K=n.y=Math.round(a);n.attr("translateY",K)};var V=n.css;return t(n,{css:function(a){if(a){var k={};a=y(a);C(n.textProps,function(e){void 0!==a[e]&&(k[e]=a[e],delete a[e])});F.css(k)}return V.call(n,a)},getBBox:function(){return{width:p.width+2*z,height:p.height+2*z,x:p.x-z,y:p.y-z}},shadow:function(a){a&&(Q(),w&&w.shadow(a));return n},destroy:function(){k(n.element,
"mouseenter");k(n.element,"mouseleave");F&&(F=F.destroy());w&&(w=w.destroy());B.prototype.destroy.call(n);n=v=Q=R=O=null}})}};a.Renderer=A})(L);(function(a){var B=a.attr,A=a.createElement,H=a.css,G=a.defined,r=a.each,g=a.extend,f=a.isFirefox,u=a.isMS,l=a.isWebKit,q=a.pInt,d=a.SVGRenderer,b=a.win,p=a.wrap;g(a.SVGElement.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&"SPAN"===b.tagName&&a.width)delete a.width,this.textWidth=b,this.updateTransform();a&&"ellipsis"===a.textOverflow&&(a.whiteSpace=
"nowrap",a.overflow="hidden");this.styles=g(this.styles,a);H(this.element,a);return this},htmlGetBBox:function(){var a=this.element;"text"===a.nodeName&&(a.style.position="absolute");return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,m=this.translateX||0,c=this.translateY||0,n=this.x||0,d=this.y||0,p=this.textAlign||"left",e={left:0,center:.5,right:1}[p],x=this.styles;H(b,{marginLeft:m,marginTop:c});
this.shadows&&r(this.shadows,function(a){H(a,{marginLeft:m+1,marginTop:c+1})});this.inverted&&r(b.childNodes,function(e){a.invertChild(e,b)});if("SPAN"===b.tagName){var F=this.rotation,w=q(this.textWidth),h=x&&x.whiteSpace,y=[F,p,b.innerHTML,this.textWidth,this.textAlign].join();y!==this.cTT&&(x=a.fontMetrics(b.style.fontSize).b,G(F)&&this.setSpanRotation(F,e,x),H(b,{width:"",whiteSpace:h||"nowrap"}),b.offsetWidth>w&&/[ \-]/.test(b.textContent||b.innerText)&&H(b,{width:w+"px",display:"block",whiteSpace:h||
"normal"}),this.getSpanCorrection(b.offsetWidth,x,e,F,p));H(b,{left:n+(this.xCorr||0)+"px",top:d+(this.yCorr||0)+"px"});l&&(x=b.offsetHeight);this.cTT=y}}else this.alignOnAdd=!0},setSpanRotation:function(a,d,m){var c={},n=u?"-ms-transform":l?"-webkit-transform":f?"MozTransform":b.opera?"-o-transform":"";c[n]=c.transform="rotate("+a+"deg)";c[n+(f?"Origin":"-origin")]=c.transformOrigin=100*d+"% "+m+"px";H(this.element,c)},getSpanCorrection:function(a,b,m){this.xCorr=-a*m;this.yCorr=-b}});g(d.prototype,
{html:function(a,b,m){var c=this.createElement("span"),n=c.element,d=c.renderer,l=d.isSVG,e=function(a,e){r(["opacity","visibility"],function(b){p(a,b+"Setter",function(a,b,c,x){a.call(this,b,c,x);e[c]=b})})};c.textSetter=function(a){a!==n.innerHTML&&delete this.bBox;n.innerHTML=this.textStr=a;c.htmlUpdateTransform()};l&&e(c,c.element.style);c.xSetter=c.ySetter=c.alignSetter=c.rotationSetter=function(a,e){"align"===e&&(e="textAlign");c[e]=a;c.htmlUpdateTransform()};c.attr({text:a,x:Math.round(b),
y:Math.round(m)}).css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize,position:"absolute"});n.style.whiteSpace="nowrap";c.css=c.htmlCss;l&&(c.add=function(a){var b,x=d.box.parentNode,h=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)h.push(a),a=a.parentGroup;r(h.reverse(),function(a){var n,m=B(a.element,"class");m&&(m={className:m});b=a.div=a.div||A("div",m,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&
a.styles.pointerEvents},b||x);n=b.style;g(a,{on:function(){c.on.apply({element:h[0].div},arguments);return a},translateXSetter:function(e,k){n.left=e+"px";a[k]=e;a.doTransform=!0},translateYSetter:function(e,k){n.top=e+"px";a[k]=e;a.doTransform=!0}});e(a,n)})}}else b=x;b.appendChild(n);c.added=!0;c.alignOnAdd&&c.htmlUpdateTransform();return c});return c}})})(L);(function(a){var B,A,H=a.createElement,G=a.css,r=a.defined,g=a.deg2rad,f=a.discardElement,u=a.doc,l=a.each,q=a.erase,d=a.extend;B=a.extendClass;
var b=a.isArray,p=a.isNumber,C=a.isObject,t=a.merge;A=a.noop;var m=a.pick,c=a.pInt,n=a.SVGElement,E=a.SVGRenderer,z=a.win;a.svg||(A={docMode8:u&&8===u.documentMode,init:function(a,b){var e=["\x3c",b,' filled\x3d"f" stroked\x3d"f"'],c=["position: ","absolute",";"],h="div"===b;("shape"===b||h)&&c.push("left:0;top:0;width:1px;height:1px;");c.push("visibility: ",h?"hidden":"visible");e.push(' style\x3d"',c.join(""),'"/\x3e');b&&(e=h||"span"===b||"img"===b?e.join(""):a.prepVML(e),this.element=H(e));this.renderer=
a},add:function(a){var e=this.renderer,b=this.element,c=e.box,h=a&&a.inverted,c=a?a.element||a:c;a&&(this.parentGroup=a);h&&e.invertChild(b,c);c.appendChild(b);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();this.className&&this.attr("class",this.className);return this},updateTransform:n.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=Math.cos(a*g),c=Math.sin(a*g);G(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11\x3d",
b,", M12\x3d",-c,", M21\x3d",c,", M22\x3d",b,", sizingMethod\x3d'auto expand')"].join(""):"none"})},getSpanCorrection:function(a,b,c,n,h){var e=n?Math.cos(n*g):1,x=n?Math.sin(n*g):0,d=m(this.elemHeight,this.element.offsetHeight),F;this.xCorr=0>e&&-a;this.yCorr=0>x&&-d;F=0>e*x;this.xCorr+=x*b*(F?1-c:c);this.yCorr-=e*b*(n?F?c:1-c:1);h&&"left"!==h&&(this.xCorr-=a*c*(0>e?-1:1),n&&(this.yCorr-=d*c*(0>x?-1:1)),G(this.element,{textAlign:h}))},pathToVML:function(a){for(var b=a.length,e=[];b--;)p(a[b])?e[b]=
Math.round(10*a[b])-5:"Z"===a[b]?e[b]="x":(e[b]=a[b],!a.isArc||"wa"!==a[b]&&"at"!==a[b]||(e[b+5]===e[b+7]&&(e[b+7]+=a[b+7]>a[b+5]?1:-1),e[b+6]===e[b+8]&&(e[b+8]+=a[b+8]>a[b+6]?1:-1)));return e.join(" ")||"x"},clip:function(a){var b=this,e;a?(e=a.members,q(e,b),e.push(b),b.destroyClip=function(){q(e,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:b.docMode8?"inherit":"rect(auto)"});return b.css(a)},css:n.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&f(a)},destroy:function(){this.destroyClip&&
this.destroyClip();return n.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+a]=function(){var a=z.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var e;a=a.split(/[ ,]/);e=a.length;if(9===e||11===e)a[e-4]=a[e-2]=c(a[e-2])-10*b;return a.join(" ")},shadow:function(a,b,n){var e=[],h,d=this.element,x=this.renderer,p,F=d.style,k,D=d.path,l,t,z,f;D&&"string"!==typeof D.value&&(D="x");t=D;if(a){z=m(a.width,3);f=(a.opacity||.15)/z;for(h=1;3>=h;h++)l=2*z+1-2*h,n&&
(t=this.cutOffPath(D.value,l+.5)),k=['\x3cshape isShadow\x3d"true" strokeweight\x3d"',l,'" filled\x3d"false" path\x3d"',t,'" coordsize\x3d"10 10" style\x3d"',d.style.cssText,'" /\x3e'],p=H(x.prepVML(k),null,{left:c(F.left)+m(a.offsetX,1),top:c(F.top)+m(a.offsetY,1)}),n&&(p.cutOff=l+1),k=['\x3cstroke color\x3d"',a.color||"#000000",'" opacity\x3d"',f*h,'"/\x3e'],H(x.prepVML(k),null,null,p),b?b.element.appendChild(p):d.parentNode.insertBefore(p,d),e.push(p);this.shadows=e}return this},updateShadows:A,
setAttr:function(a,b){this.docMode8?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){(this.added?this.element:this).className=a},dashstyleSetter:function(a,b,c){(c.getElementsByTagName("stroke")[0]||H(this.renderer.prepVML(["\x3cstroke/\x3e"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var e=this.shadows;a=a||[];this.d=a.join&&a.join(" ");c.path=a=this.pathToVML(a);if(e)for(c=e.length;c--;)e[c].path=e[c].cutOff?this.cutOffPath(a,e[c].cutOff):a;this.setAttr(b,
a)},fillSetter:function(a,b,c){var e=c.nodeName;"SPAN"===e?c.style.color=a:"IMG"!==e&&(c.filled="none"!==a,this.setAttr("fillcolor",this.renderer.color(a,c,b,this)))},"fill-opacitySetter":function(a,b,c){H(this.renderer.prepVML(["\x3c",b.split("-")[0],' opacity\x3d"',a,'"/\x3e']),null,null,c)},opacitySetter:A,rotationSetter:function(a,b,c){c=c.style;this[b]=c[b]=a;c.left=-Math.round(Math.sin(a*g)+1)+"px";c.top=Math.round(Math.cos(a*g))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",
this.renderer.color(a,c,b,this))},"stroke-widthSetter":function(a,b,c){c.stroked=!!a;this[b]=a;p(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){"inherit"===a&&(a="visible");this.shadows&&l(this.shadows,function(c){c.style[b]=a});"DIV"===c.nodeName&&(a="hidden"===a?"-999em":0,this.docMode8||(c.style[b]=a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;"x"===b?b="left":"y"===b&&(b="top");this.updateClipping?
(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,b,c){c.style[b]=a}},A["stroke-opacitySetter"]=A["fill-opacitySetter"],a.VMLElement=A=B(n,A),A.prototype.ySetter=A.prototype.widthSetter=A.prototype.heightSetter=A.prototype.xSetter,A={Element:A,isIE8:-1<z.navigator.userAgent.indexOf("MSIE 8.0"),init:function(a,b,c){var e,h;this.alignedObjects=[];e=this.createElement("div").css({position:"relative"});h=e.element;a.appendChild(e.element);this.isVML=!0;this.box=h;this.boxWrapper=
e;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(b,c,!1);if(!u.namespaces.hcv){u.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{u.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(y){u.styleSheets[0].cssText+="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},
clipRect:function(a,b,c,n){var e=this.createElement(),m=C(a);return d(e,{members:[],count:0,left:(m?a.x:a)+1,top:(m?a.y:b)+1,width:(m?a.width:c)-1,height:(m?a.height:n)-1,getCSS:function(a){var b=a.element,c=b.nodeName,k=a.inverted,e=this.top-("shape"===c?b.offsetTop:0),h=this.left,b=h+this.width,n=e+this.height,e={clip:"rect("+Math.round(k?h:e)+"px,"+Math.round(k?n:b)+"px,"+Math.round(k?b:n)+"px,"+Math.round(k?e:h)+"px)"};!k&&a.docMode8&&"DIV"===c&&d(e,{width:b+"px",height:n+"px"});return e},updateClipping:function(){l(e.members,
function(a){a.element&&a.css(e.getCSS(a))})}})},color:function(b,c,n,m){var e=this,d,x=/^rgba/,p,t,k="none";b&&b.linearGradient?t="gradient":b&&b.radialGradient&&(t="pattern");if(t){var D,w,z=b.linearGradient||b.radialGradient,f,E,v,q,g,F="";b=b.stops;var C,u=[],r=function(){p=['\x3cfill colors\x3d"'+u.join(",")+'" opacity\x3d"',v,'" o:opacity2\x3d"',E,'" type\x3d"',t,'" ',F,'focus\x3d"100%" method\x3d"any" /\x3e'];H(e.prepVML(p),null,null,c)};f=b[0];C=b[b.length-1];0<f[0]&&b.unshift([0,f[1]]);1>
C[0]&&b.push([1,C[1]]);l(b,function(k,b){x.test(k[1])?(d=a.color(k[1]),D=d.get("rgb"),w=d.get("a")):(D=k[1],w=1);u.push(100*k[0]+"% "+D);b?(v=w,q=D):(E=w,g=D)});if("fill"===n)if("gradient"===t)n=z.x1||z[0]||0,b=z.y1||z[1]||0,f=z.x2||z[2]||0,z=z.y2||z[3]||0,F='angle\x3d"'+(90-180*Math.atan((z-b)/(f-n))/Math.PI)+'"',r();else{var k=z.r,A=2*k,B=2*k,G=z.cx,U=z.cy,L=c.radialReference,T,k=function(){L&&(T=m.getBBox(),G+=(L[0]-T.x)/T.width-.5,U+=(L[1]-T.y)/T.height-.5,A*=L[2]/T.width,B*=L[2]/T.height);F=
'src\x3d"'+a.getOptions().global.VMLRadialGradientURL+'" size\x3d"'+A+","+B+'" origin\x3d"0.5,0.5" position\x3d"'+G+","+U+'" color2\x3d"'+g+'" ';r()};m.added?k():m.onAdd=k;k=q}else k=D}else x.test(b)&&"IMG"!==c.tagName?(d=a.color(b),m[n+"-opacitySetter"](d.get("a"),n,c),k=d.get("rgb")):(k=c.getElementsByTagName(n),k.length&&(k[0].opacity=1,k[0].type="solid"),k=b);return k},prepVML:function(a){var b=this.isIE8;a=a.join("");b?(a=a.replace("/\x3e",' xmlns\x3d"urn:schemas-microsoft-com:vml" /\x3e'),a=
-1===a.indexOf('style\x3d"')?a.replace("/\x3e",' style\x3d"display:inline-block;behavior:url(#default#VML);" /\x3e'):a.replace('style\x3d"','style\x3d"display:inline-block;behavior:url(#default#VML);')):a=a.replace("\x3c","\x3chcv:");return a},text:E.prototype.html,path:function(a){var c={coordsize:"10 10"};b(a)?c.d=a:C(a)&&d(c,a);return this.createElement("shape").attr(c)},circle:function(a,b,c){var e=this.symbol("circle");C(a)&&(c=a.r,b=a.y,a=a.x);e.isCircle=!0;e.r=c;return e.attr({x:a,y:b})},g:function(a){var b;
a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement("div").attr(b)},image:function(a,b,c,n,h){var e=this.createElement("img").attr({src:a});1<arguments.length&&e.attr({x:b,y:c,width:n,height:h});return e},createElement:function(a){return"rect"===a?this.symbol(a):E.prototype.createElement.call(this,a)},invertChild:function(a,b){var e=this;b=b.style;var n="IMG"===a.tagName&&a.style;G(a,{flip:"x",left:c(b.width)-(n?c(n.top):1),top:c(b.height)-(n?c(n.left):1),rotation:-90});
l(a.childNodes,function(b){e.invertChild(b,a)})},symbols:{arc:function(a,b,c,n,h){var e=h.start,m=h.end,d=h.r||c||n;c=h.innerR;n=Math.cos(e);var p=Math.sin(e),k=Math.cos(m),D=Math.sin(m);if(0===m-e)return["x"];e=["wa",a-d,b-d,a+d,b+d,a+d*n,b+d*p,a+d*k,b+d*D];h.open&&!c&&e.push("e","M",a,b);e.push("at",a-c,b-c,a+c,b+c,a+c*k,b+c*D,a+c*n,b+c*p,"x","e");e.isArc=!0;return e},circle:function(a,b,c,n,h){h&&r(h.r)&&(c=n=2*h.r);h&&h.isCircle&&(a-=c/2,b-=n/2);return["wa",a,b,a+c,b+n,a+c,b+n/2,a+c,b+n/2,"e"]},
rect:function(a,b,c,n,h){return E.prototype.symbols[r(h)&&h.r?"callout":"square"].call(0,a,b,c,n,h)}}},a.VMLRenderer=B=function(){this.init.apply(this,arguments)},B.prototype=t(E.prototype,A),a.Renderer=B);E.prototype.measureSpanWidth=function(a,b){var c=u.createElement("span");a=u.createTextNode(a);c.appendChild(a);G(c,b);this.box.appendChild(c);b=c.offsetWidth;f(c);return b}})(L);(function(a){function B(){var l=a.defaultOptions.global,f=u.moment;if(l.timezone){if(f)return function(a){return-f.tz(a,
l.timezone).utcOffset()};a.error(25)}return l.useUTC&&l.getTimezoneOffset}function A(){var l=a.defaultOptions.global,q,d=l.useUTC,b=d?"getUTC":"get",p=d?"setUTC":"set";a.Date=q=l.Date||u.Date;q.hcTimezoneOffset=d&&l.timezoneOffset;q.hcGetTimezoneOffset=B();q.hcMakeTime=function(a,b,m,c,n,p){var l;d?(l=q.UTC.apply(0,arguments),l+=r(l)):l=(new q(a,b,f(m,1),f(c,0),f(n,0),f(p,0))).getTime();return l};G("Minutes Hours Day Date Month FullYear".split(" "),function(a){q["hcGet"+a]=b+a});G("Milliseconds Seconds Minutes Hours Date Month FullYear".split(" "),
function(a){q["hcSet"+a]=p+a})}var H=a.color,G=a.each,r=a.getTZOffset,g=a.merge,f=a.pick,u=a.win;a.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{useUTC:!0,VMLRadialGradientURL:"http://code.highcharts.com/5.0.7/gfx/vml-radial-gradient.png"},chart:{borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",
align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",
width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:a.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",
month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:a.isTouchDevice?25:10,backgroundColor:H("#f7f7f7").setOpacity(.85).get(),borderWidth:1,headerFormat:'\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"http://www.highcharts.com",
position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};a.setOptions=function(l){a.defaultOptions=g(!0,a.defaultOptions,l);A();return a.defaultOptions};a.getOptions=function(){return a.defaultOptions};a.defaultPlotOptions=a.defaultOptions.plotOptions;A()})(L);(function(a){var B=a.arrayMax,A=a.arrayMin,H=a.defined,G=a.destroyObjectProperties,r=a.each,g=a.erase,f=a.merge,u=a.pick;a.PlotLineOrBand=function(a,f){this.axis=
a;f&&(this.options=f,this.id=f.id)};a.PlotLineOrBand.prototype={render:function(){var a=this,q=a.axis,d=q.horiz,b=a.options,p=b.label,g=a.label,t=b.to,m=b.from,c=b.value,n=H(m)&&H(t),E=H(c),z=a.svgElem,e=!z,x=[],F,w=b.color,h=u(b.zIndex,0),y=b.events,x={"class":"highcharts-plot-"+(n?"band ":"line ")+(b.className||"")},J={},K=q.chart.renderer,I=n?"bands":"lines",k=q.log2lin;q.isLog&&(m=k(m),t=k(t),c=k(c));E?(x={stroke:w,"stroke-width":b.width},b.dashStyle&&(x.dashstyle=b.dashStyle)):n&&(w&&(x.fill=
w),b.borderWidth&&(x.stroke=b.borderColor,x["stroke-width"]=b.borderWidth));J.zIndex=h;I+="-"+h;(w=q[I])||(q[I]=w=K.g("plot-"+I).attr(J).add());e&&(a.svgElem=z=K.path().attr(x).add(w));if(E)x=q.getPlotLinePath(c,z.strokeWidth());else if(n)x=q.getPlotBandPath(m,t,b);else return;if(e&&x&&x.length){if(z.attr({d:x}),y)for(F in b=function(b){z.on(b,function(k){y[b].apply(a,[k])})},y)b(F)}else z&&(x?(z.show(),z.animate({d:x})):(z.hide(),g&&(a.label=g=g.destroy())));p&&H(p.text)&&x&&x.length&&0<q.width&&
0<q.height&&!x.flat?(p=f({align:d&&n&&"center",x:d?!n&&4:10,verticalAlign:!d&&n&&"middle",y:d?n?16:10:n?6:-4,rotation:d&&!n&&90},p),this.renderLabel(p,x,n,h)):g&&g.hide();return a},renderLabel:function(a,f,d,b){var p=this.label,l=this.axis.chart.renderer;p||(p={align:a.textAlign||a.align,rotation:a.rotation,"class":"highcharts-plot-"+(d?"band":"line")+"-label "+(a.className||"")},p.zIndex=b,this.label=p=l.text(a.text,0,0,a.useHTML).attr(p).add(),p.css(a.style));b=[f[1],f[4],d?f[6]:f[1]];f=[f[2],f[5],
d?f[7]:f[2]];d=A(b);l=A(f);p.align(a,!1,{x:d,y:l,width:B(b)-d,height:B(f)-l});p.show()},destroy:function(){g(this.axis.plotLinesAndBands,this);delete this.axis;G(this)}};a.AxisPlotLineOrBandExtension={getPlotBandPath:function(a,f){f=this.getPlotLinePath(f,null,null,!0);(a=this.getPlotLinePath(a,null,null,!0))&&f?(a.flat=a.toString()===f.toString(),a.push(f[4],f[5],f[1],f[2],"z")):a=null;return a},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,
"plotLines")},addPlotBandOrLine:function(f,g){var d=(new a.PlotLineOrBand(this,f)).render(),b=this.userOptions;d&&(g&&(b[g]=b[g]||[],b[g].push(f)),this.plotLinesAndBands.push(d));return d},removePlotBandOrLine:function(a){for(var f=this.plotLinesAndBands,d=this.options,b=this.userOptions,p=f.length;p--;)f[p].id===a&&f[p].destroy();r([d.plotLines||[],b.plotLines||[],d.plotBands||[],b.plotBands||[]],function(b){for(p=b.length;p--;)b[p].id===a&&g(b,b[p])})}}})(L);(function(a){var B=a.correctFloat,A=
a.defined,H=a.destroyObjectProperties,G=a.isNumber,r=a.merge,g=a.pick,f=a.deg2rad;a.Tick=function(a,f,g,d){this.axis=a;this.pos=f;this.type=g||"";this.isNew=!0;g||d||this.addLabel()};a.Tick.prototype={addLabel:function(){var a=this.axis,f=a.options,q=a.chart,d=a.categories,b=a.names,p=this.pos,C=f.labels,t=a.tickPositions,m=p===t[0],c=p===t[t.length-1],b=d?g(d[p],b[p],p):p,d=this.label,t=t.info,n;a.isDatetimeAxis&&t&&(n=f.dateTimeLabelFormats[t.higherRanks[p]||t.unitName]);this.isFirst=m;this.isLast=
c;f=a.labelFormatter.call({axis:a,chart:q,isFirst:m,isLast:c,dateTimeLabelFormat:n,value:a.isLog?B(a.lin2log(b)):b});A(d)?d&&d.attr({text:f}):(this.labelLength=(this.label=d=A(f)&&C.enabled?q.renderer.text(f,0,0,C.useHTML).css(r(C.style)).add(a.labelGroup):null)&&d.getBBox().width,this.rotation=0)},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var l=this.axis,q=a.x,d=l.chart.chartWidth,b=l.chart.spacing,p=g(l.labelLeft,
Math.min(l.pos,b[3])),b=g(l.labelRight,Math.max(l.pos+l.len,d-b[1])),C=this.label,t=this.rotation,m={left:0,center:.5,right:1}[l.labelAlign],c=C.getBBox().width,n=l.getSlotWidth(),E=n,z=1,e,x={};if(t)0>t&&q-m*c<p?e=Math.round(q/Math.cos(t*f)-p):0<t&&q+m*c>b&&(e=Math.round((d-q)/Math.cos(t*f)));else if(d=q+(1-m)*c,q-m*c<p?E=a.x+E*(1-m)-p:d>b&&(E=b-a.x+E*m,z=-1),E=Math.min(n,E),E<n&&"center"===l.labelAlign&&(a.x+=z*(n-E-m*(n-Math.min(c,E)))),c>E||l.autoRotation&&(C.styles||{}).width)e=E;e&&(x.width=
e,(l.options.labels.style||{}).textOverflow||(x.textOverflow="ellipsis"),C.css(x))},getPosition:function(a,f,g,d){var b=this.axis,p=b.chart,l=d&&p.oldChartHeight||p.chartHeight;return{x:a?b.translate(f+g,null,null,d)+b.transB:b.left+b.offset+(b.opposite?(d&&p.oldChartWidth||p.chartWidth)-b.right-b.left:0),y:a?l-b.bottom+b.offset-(b.opposite?b.height:0):l-b.translate(f+g,null,null,d)-b.transB}},getLabelPosition:function(a,g,q,d,b,p,C,t){var m=this.axis,c=m.transA,n=m.reversed,E=m.staggerLines,z=m.tickRotCorr||
{x:0,y:0},e=b.y;A(e)||(e=0===m.side?q.rotation?-8:-q.getBBox().height:2===m.side?z.y+8:Math.cos(q.rotation*f)*(z.y-q.getBBox(!1,0).height/2));a=a+b.x+z.x-(p&&d?p*c*(n?-1:1):0);g=g+e-(p&&!d?p*c*(n?1:-1):0);E&&(q=C/(t||1)%E,m.opposite&&(q=E-q-1),g+=m.labelOffset/E*q);return{x:a,y:Math.round(g)}},getMarkPath:function(a,f,g,d,b,p){return p.crispLine(["M",a,f,"L",a+(b?0:-g),f+(b?g:0)],d)},render:function(a,f,q){var d=this.axis,b=d.options,p=d.chart.renderer,l=d.horiz,t=this.type,m=this.label,c=this.pos,
n=b.labels,E=this.gridLine,z=t?t+"Tick":"tick",e=d.tickSize(z),x=this.mark,F=!x,w=n.step,h={},y=!0,J=d.tickmarkOffset,K=this.getPosition(l,c,J,f),I=K.x,K=K.y,k=l&&I===d.pos+d.len||!l&&K===d.pos?-1:1,D=t?t+"Grid":"grid",P=b[D+"LineWidth"],N=b[D+"LineColor"],r=b[D+"LineDashStyle"],D=g(b[z+"Width"],!t&&d.isXAxis?1:0),z=b[z+"Color"];q=g(q,1);this.isActive=!0;E||(h.stroke=N,h["stroke-width"]=P,r&&(h.dashstyle=r),t||(h.zIndex=1),f&&(h.opacity=0),this.gridLine=E=p.path().attr(h).addClass("highcharts-"+(t?
t+"-":"")+"grid-line").add(d.gridGroup));if(!f&&E&&(c=d.getPlotLinePath(c+J,E.strokeWidth()*k,f,!0)))E[this.isNew?"attr":"animate"]({d:c,opacity:q});e&&(d.opposite&&(e[0]=-e[0]),F&&(this.mark=x=p.path().addClass("highcharts-"+(t?t+"-":"")+"tick").add(d.axisGroup),x.attr({stroke:z,"stroke-width":D})),x[F?"attr":"animate"]({d:this.getMarkPath(I,K,e[0],x.strokeWidth()*k,l,p),opacity:q}));m&&G(I)&&(m.xy=K=this.getLabelPosition(I,K,m,l,n,J,a,w),this.isFirst&&!this.isLast&&!g(b.showFirstLabel,1)||this.isLast&&
!this.isFirst&&!g(b.showLastLabel,1)?y=!1:!l||d.isRadial||n.step||n.rotation||f||0===q||this.handleOverflow(K),w&&a%w&&(y=!1),y&&G(K.y)?(K.opacity=q,m[this.isNew?"attr":"animate"](K)):m.attr("y",-9999),this.isNew=!1)},destroy:function(){H(this,this.axis)}}})(L);(function(a){var B=a.addEvent,A=a.animObject,H=a.arrayMax,G=a.arrayMin,r=a.AxisPlotLineOrBandExtension,g=a.color,f=a.correctFloat,u=a.defaultOptions,l=a.defined,q=a.deg2rad,d=a.destroyObjectProperties,b=a.each,p=a.extend,C=a.fireEvent,t=a.format,
m=a.getMagnitude,c=a.grep,n=a.inArray,E=a.isArray,z=a.isNumber,e=a.isString,x=a.merge,F=a.normalizeTickInterval,w=a.pick,h=a.PlotLineOrBand,y=a.removeEvent,J=a.splat,K=a.syncTimeout,I=a.Tick;a.Axis=function(){this.init.apply(this,arguments)};a.Axis.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,labels:{enabled:!0,style:{color:"#666666",cursor:"default",fontSize:"11px"},
x:0},minPadding:.01,maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",title:{align:"middle",style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"},defaultYAxisOptions:{endOnTick:!0,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},maxPadding:.05,
minPadding:.05,startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return a.numberFormat(this.total,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"#000000",textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],
x:0},title:{rotation:0}},init:function(a,b){var k=b.isX;this.chart=a;this.horiz=a.inverted?!k:k;this.isXAxis=k;this.coll=this.coll||(k?"xAxis":"yAxis");this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var c=this.options,e=c.type;this.labelFormatter=c.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.reversed=c.reversed;this.visible=!1!==c.visible;this.zoomEnabled=!1!==c.zoomEnabled;this.hasNames=
"category"===e||!0===c.categories;this.categories=c.categories||this.hasNames;this.names=this.names||[];this.isLog="logarithmic"===e;this.isDatetimeAxis="datetime"===e;this.isLinked=l(c.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=c.minRange||c.maxZoom;this.range=c.range;this.offset=c.offset||0;this.stacks={};this.oldStacks={};this.stacksTouched=0;this.min=this.max=null;this.crosshair=w(c.crosshair,
J(a.options.tooltip.crosshairs)[k?0:1],!1);var h;b=this.options.events;-1===n(this,a.axes)&&(k?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];a.inverted&&k&&void 0===this.reversed&&(this.reversed=!0);this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(h in b)B(this,h,b[h]);this.isLog&&(this.val2lin=this.log2lin,this.lin2val=this.lin2log)},setOptions:function(a){this.options=x(this.defaultOptions,"yAxis"===this.coll&&this.defaultYAxisOptions,
[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],x(u[this.coll],a))},defaultLabelFormatter:function(){var b=this.axis,c=this.value,e=b.categories,h=this.dateTimeLabelFormat,n=u.lang,d=n.numericSymbols,n=n.numericSymbolMagnitude||1E3,v=d&&d.length,m,f=b.options.labels.format,b=b.isLog?c:b.tickInterval;if(f)m=t(f,this);else if(e)m=c;else if(h)m=a.dateFormat(h,c);else if(v&&1E3<=b)for(;v--&&void 0===m;)e=Math.pow(n,v+1),b>=
e&&0===10*c%e&&null!==d[v]&&0!==c&&(m=a.numberFormat(c/e,-1)+d[v]);void 0===m&&(m=1E4<=Math.abs(c)?a.numberFormat(c,-1):a.numberFormat(c,-1,void 0,""));return m},getSeriesExtremes:function(){var a=this,e=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();b(a.series,function(b){if(b.visible||!e.options.chart.ignoreHiddenSeries){var k=b.options,h=k.threshold,D;a.hasVisibleSeries=!0;a.isLog&&0>=h&&(h=null);if(a.isXAxis)k=b.xData,
k.length&&(b=G(k),z(b)||b instanceof Date||(k=c(k,function(a){return z(a)}),b=G(k)),a.dataMin=Math.min(w(a.dataMin,k[0]),b),a.dataMax=Math.max(w(a.dataMax,k[0]),H(k)));else if(b.getExtremes(),D=b.dataMax,b=b.dataMin,l(b)&&l(D)&&(a.dataMin=Math.min(w(a.dataMin,b),b),a.dataMax=Math.max(w(a.dataMax,D),D)),l(h)&&(a.threshold=h),!k.softThreshold||a.isLog)a.softThreshold=!1}})},translate:function(a,b,c,e,h,n){var k=this.linkedParent||this,D=1,m=0,d=e?k.oldTransA:k.transA;e=e?k.oldMin:k.min;var f=k.minPixelPadding;
h=(k.isOrdinal||k.isBroken||k.isLog&&h)&&k.lin2val;d||(d=k.transA);c&&(D*=-1,m=k.len);k.reversed&&(D*=-1,m-=D*(k.sector||k.len));b?(a=(a*D+m-f)/d+e,h&&(a=k.lin2val(a))):(h&&(a=k.val2lin(a)),a=D*(a-e)*d+m+D*f+(z(n)?d*n:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,e,h){var k=this.chart,D=this.left,n=this.top,m,d,f=c&&k.oldChartHeight||
k.chartHeight,p=c&&k.oldChartWidth||k.chartWidth,y;m=this.transB;var t=function(a,b,k){if(a<b||a>k)e?a=Math.min(Math.max(b,a),k):y=!0;return a};h=w(h,this.translate(a,null,null,c));a=c=Math.round(h+m);m=d=Math.round(f-h-m);z(h)?this.horiz?(m=n,d=f-this.bottom,a=c=t(a,D,D+this.width)):(a=D,c=p-this.right,m=d=t(m,n,n+this.height)):y=!0;return y&&!e?null:k.renderer.crispLine(["M",a,m,"L",c,d],b||1)},getLinearTickPositions:function(a,b,c){var k,e=f(Math.floor(b/a)*a),h=f(Math.ceil(c/a)*a),D=[];if(b===
c&&z(b))return[b];for(b=e;b<=h;){D.push(b);b=f(b+a);if(b===k)break;k=b}return D},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,e=[],h,n=this.pointRangePadding||0;h=this.min-n;var n=this.max+n,m=n-h;if(m&&m/c<this.len/3)if(this.isLog)for(n=b.length,h=1;h<n;h++)e=e.concat(this.getLogTickPositions(c,b[h-1],b[h],!0));else if(this.isDatetimeAxis&&"auto"===a.minorTickInterval)e=e.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),h,n,a.startOfWeek));
else for(b=h+(b[0]-h)%c;b<=n&&b!==e[0];b+=c)e.push(b);0!==e.length&&this.trimTicks(e,a.startOnTick,a.endOnTick);return e},adjustForMinRange:function(){var a=this.options,c=this.min,e=this.max,h,n=this.dataMax-this.dataMin>=this.minRange,m,v,d,f,p,y;this.isXAxis&&void 0===this.minRange&&!this.isLog&&(l(a.min)||l(a.max)?this.minRange=null:(b(this.series,function(a){f=a.xData;for(v=p=a.xIncrement?1:f.length-1;0<v;v--)if(d=f[v]-f[v-1],void 0===m||d<m)m=d}),this.minRange=Math.min(5*m,this.dataMax-this.dataMin)));
e-c<this.minRange&&(y=this.minRange,h=(y-e+c)/2,h=[c-h,w(a.min,c-h)],n&&(h[2]=this.isLog?this.log2lin(this.dataMin):this.dataMin),c=H(h),e=[c+y,w(a.max,c+y)],n&&(e[2]=this.isLog?this.log2lin(this.dataMax):this.dataMax),e=G(e),e-c<y&&(h[0]=e-y,h[1]=w(a.min,e-y),c=H(h)));this.min=c;this.max=e},getClosest:function(){var a;this.categories?a=1:b(this.series,function(b){var k=b.closestPointRange,c=b.visible||!b.chart.options.chart.ignoreHiddenSeries;!b.noSharedTooltip&&l(k)&&c&&(a=l(a)?Math.min(a,k):k)});
return a},nameToX:function(a){var b=E(this.categories),k=b?this.categories:this.names,c=a.options.x,e;a.series.requireSorting=!1;l(c)||(c=!1===this.options.uniqueNames?a.series.autoIncrement():n(a.name,k));-1===c?b||(e=k.length):e=c;this.names[e]=a.name;return e},updateNames:function(){var a=this;0<this.names.length&&(this.names.length=0,this.minRange=void 0,b(this.series||[],function(k){k.xIncrement=null;if(!k.points||k.isDirtyData)k.processData(),k.generatePoints();b(k.points,function(b,c){var e;
b.options&&(e=a.nameToX(b),e!==b.x&&(b.x=e,k.xData[c]=e))})}))},setAxisTranslation:function(a){var k=this,c=k.max-k.min,h=k.axisPointRange||0,n,m=0,d=0,f=k.linkedParent,y=!!k.categories,p=k.transA,t=k.isXAxis;if(t||y||h)n=k.getClosest(),f?(m=f.minPointOffset,d=f.pointRangePadding):b(k.series,function(a){var b=y?1:t?w(a.options.pointRange,n,0):k.axisPointRange||0;a=a.options.pointPlacement;h=Math.max(h,b);k.single||(m=Math.max(m,e(a)?0:b/2),d=Math.max(d,"on"===a?0:b))}),f=k.ordinalSlope&&n?k.ordinalSlope/
n:1,k.minPointOffset=m*=f,k.pointRangePadding=d*=f,k.pointRange=Math.min(h,c),t&&(k.closestPointRange=n);a&&(k.oldTransA=p);k.translationSlope=k.transA=p=k.len/(c+d||1);k.transB=k.horiz?k.left:k.bottom;k.minPixelPadding=p*m},minFromRange:function(){return this.max-this.range},setTickInterval:function(k){var c=this,e=c.chart,h=c.options,n=c.isLog,d=c.log2lin,v=c.isDatetimeAxis,y=c.isXAxis,p=c.isLinked,t=h.maxPadding,x=h.minPadding,g=h.tickInterval,E=h.tickPixelInterval,q=c.categories,J=c.threshold,
K=c.softThreshold,I,r,u,A;v||q||p||this.getTickAmount();u=w(c.userMin,h.min);A=w(c.userMax,h.max);p?(c.linkedParent=e[c.coll][h.linkedTo],e=c.linkedParent.getExtremes(),c.min=w(e.min,e.dataMin),c.max=w(e.max,e.dataMax),h.type!==c.linkedParent.options.type&&a.error(11,1)):(!K&&l(J)&&(c.dataMin>=J?(I=J,x=0):c.dataMax<=J&&(r=J,t=0)),c.min=w(u,I,c.dataMin),c.max=w(A,r,c.dataMax));n&&(!k&&0>=Math.min(c.min,w(c.dataMin,c.min))&&a.error(10,1),c.min=f(d(c.min),15),c.max=f(d(c.max),15));c.range&&l(c.max)&&
(c.userMin=c.min=u=Math.max(c.min,c.minFromRange()),c.userMax=A=c.max,c.range=null);C(c,"foundExtremes");c.beforePadding&&c.beforePadding();c.adjustForMinRange();!(q||c.axisPointRange||c.usePercentage||p)&&l(c.min)&&l(c.max)&&(d=c.max-c.min)&&(!l(u)&&x&&(c.min-=d*x),!l(A)&&t&&(c.max+=d*t));z(h.floor)?c.min=Math.max(c.min,h.floor):z(h.softMin)&&(c.min=Math.min(c.min,h.softMin));z(h.ceiling)?c.max=Math.min(c.max,h.ceiling):z(h.softMax)&&(c.max=Math.max(c.max,h.softMax));K&&l(c.dataMin)&&(J=J||0,!l(u)&&
c.min<J&&c.dataMin>=J?c.min=J:!l(A)&&c.max>J&&c.dataMax<=J&&(c.max=J));c.tickInterval=c.min===c.max||void 0===c.min||void 0===c.max?1:p&&!g&&E===c.linkedParent.options.tickPixelInterval?g=c.linkedParent.tickInterval:w(g,this.tickAmount?(c.max-c.min)/Math.max(this.tickAmount-1,1):void 0,q?1:(c.max-c.min)*E/Math.max(c.len,E));y&&!k&&b(c.series,function(a){a.processData(c.min!==c.oldMin||c.max!==c.oldMax)});c.setAxisTranslation(!0);c.beforeSetTickPositions&&c.beforeSetTickPositions();c.postProcessTickInterval&&
(c.tickInterval=c.postProcessTickInterval(c.tickInterval));c.pointRange&&!g&&(c.tickInterval=Math.max(c.pointRange,c.tickInterval));k=w(h.minTickInterval,c.isDatetimeAxis&&c.closestPointRange);!g&&c.tickInterval<k&&(c.tickInterval=k);v||n||g||(c.tickInterval=F(c.tickInterval,null,m(c.tickInterval),w(h.allowDecimals,!(.5<c.tickInterval&&5>c.tickInterval&&1E3<c.max&&9999>c.max)),!!this.tickAmount));this.tickAmount||(c.tickInterval=c.unsquish());this.setTickPositions()},setTickPositions:function(){var a=
this.options,b,c=a.tickPositions,e=a.tickPositioner,h=a.startOnTick,n=a.endOnTick,m;this.tickmarkOffset=this.categories&&"between"===a.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===a.minorTickInterval&&this.tickInterval?this.tickInterval/5:a.minorTickInterval;this.tickPositions=b=c&&c.slice();!b&&(b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,
!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],b.pop()]),this.tickPositions=b,e&&(e=e.apply(this,[this.min,this.max])))&&(this.tickPositions=b=e);this.trimTicks(b,h,n);this.isLinked||(this.min===this.max&&l(this.min)&&!this.tickAmount&&(m=!0,this.min-=.5,this.max+=.5),this.single=m,c||e||this.adjustTickAmount())},trimTicks:function(a,b,c){var k=a[0],e=a[a.length-1],h=this.minPointOffset||
0;if(!this.isLinked){if(b)this.min=k;else for(;this.min-h>a[0];)a.shift();if(c)this.max=e;else for(;this.max+h<a[a.length-1];)a.pop();0===a.length&&l(k)&&a.push((e+k)/2)}},alignToOthers:function(){var a={},c,e=this.options;!1===this.chart.options.chart.alignTicks||!1===e.alignTicks||this.isLog||b(this.chart[this.coll],function(b){var k=b.options,k=[b.horiz?k.left:k.top,k.width,k.height,k.pane].join();b.series.length&&(a[k]?c=!0:a[k]=1)});return c},getTickAmount:function(){var a=this.options,b=a.tickAmount,
c=a.tickPixelInterval;!l(a.tickInterval)&&this.len<c&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Math.ceil(this.len/c)+1);4>b&&(this.finalTickAmt=b,b=5);this.tickAmount=b},adjustTickAmount:function(){var a=this.tickInterval,b=this.tickPositions,c=this.tickAmount,e=this.finalTickAmt,h=b&&b.length;if(h<c){for(;b.length<c;)b.push(f(b[b.length-1]+a));this.transA*=(h-1)/(c-1);this.max=b[b.length-1]}else h>c&&(this.tickInterval*=2,this.setTickPositions());
if(l(e)){for(a=c=b.length;a--;)(3===e&&1===a%2||2>=e&&0<a&&a<c-1)&&b.splice(a,1);this.finalTickAmt=void 0}},setScale:function(){var a,c;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();c=this.len!==this.oldAxisLength;b(this.series,function(b){if(b.isDirtyData||b.isDirty||b.xAxis.isDirty)a=!0});c||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()?(this.resetStacks&&this.resetStacks(),this.forceRedraw=
!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=c||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks()},setExtremes:function(a,c,e,h,n){var k=this,m=k.chart;e=w(e,!0);b(k.series,function(a){delete a.kdTree});n=p(n,{min:a,max:c});C(k,"setExtremes",n,function(){k.userMin=a;k.userMax=c;k.eventArgs=n;e&&m.redraw(h)})},zoom:function(a,b){var c=this.dataMin,k=this.dataMax,e=this.options,
h=Math.min(c,w(e.min,c)),e=Math.max(k,w(e.max,k));if(a!==this.min||b!==this.max)this.allowZoomOutside||(l(c)&&(a<h&&(a=h),a>e&&(a=e)),l(k)&&(b<h&&(b=h),b>e&&(b=e))),this.displayBtn=void 0!==a||void 0!==b,this.setExtremes(a,b,!1,void 0,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsets||[0,0,0,0],e=this.horiz,h=w(b.width,a.plotWidth-c[3]+c[1]),n=w(b.height,a.plotHeight-c[0]+c[2]),m=w(b.top,a.plotTop+c[0]),b=w(b.left,a.plotLeft+c[3]),c=/%$/;c.test(n)&&(n=
Math.round(parseFloat(n)/100*a.plotHeight));c.test(m)&&(m=Math.round(parseFloat(m)/100*a.plotHeight+a.plotTop));this.left=b;this.top=m;this.width=h;this.height=n;this.bottom=a.chartHeight-n-m;this.right=a.chartWidth-h-b;this.len=Math.max(e?h:n,0);this.pos=e?b:m},getExtremes:function(){var a=this.isLog,b=this.lin2log;return{min:a?f(b(this.min)):this.min,max:a?f(b(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=
this.isLog,c=this.lin2log,k=b?c(this.min):this.min,b=b?c(this.max):this.max;null===a?a=k:k>a?a=k:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(w(a,0)-90*this.side+720)%360;return 15<a&&165>a?"right":195<a&&345>a?"left":"center"},tickSize:function(a){var b=this.options,c=b[a+"Length"],k=w(b[a+"Width"],"tick"===a&&this.isXAxis?1:0);if(k&&c)return"inside"===b[a+"Position"]&&(c=-c),[c,k]},labelMetrics:function(){return this.chart.renderer.fontMetrics(this.options.labels.style&&
this.options.labels.style.fontSize,this.ticks[0]&&this.ticks[0].label)},unsquish:function(){var a=this.options.labels,c=this.horiz,e=this.tickInterval,h=e,n=this.len/(((this.categories?1:0)+this.max-this.min)/e),m,d=a.rotation,f=this.labelMetrics(),p,y=Number.MAX_VALUE,t,x=function(a){a/=n||1;a=1<a?Math.ceil(a):1;return a*e};c?(t=!a.staggerLines&&!a.step&&(l(d)?[d]:n<w(a.autoRotationLimit,80)&&a.autoRotation))&&b(t,function(a){var b;if(a===d||a&&-90<=a&&90>=a)p=x(Math.abs(f.h/Math.sin(q*a))),b=p+
Math.abs(a/360),b<y&&(y=b,m=a,h=p)}):a.step||(h=x(f.h));this.autoRotation=t;this.labelRotation=w(m,d);return h},getSlotWidth:function(){var a=this.chart,b=this.horiz,c=this.options.labels,e=Math.max(this.tickPositions.length-(this.categories?0:1),1),h=a.margin[3];return b&&2>(c.step||0)&&!c.rotation&&(this.staggerLines||1)*this.len/e||!b&&(h&&h-a.spacing[3]||.33*a.chartWidth)},renderUnsquish:function(){var a=this.chart,c=a.renderer,h=this.tickPositions,n=this.ticks,m=this.options.labels,d=this.horiz,
v=this.getSlotWidth(),f=Math.max(1,Math.round(v-2*(m.padding||5))),p={},y=this.labelMetrics(),t=m.style&&m.style.textOverflow,g,z=0,E,w;e(m.rotation)||(p.rotation=m.rotation||0);b(h,function(a){(a=n[a])&&a.labelLength>z&&(z=a.labelLength)});this.maxLabelLength=z;if(this.autoRotation)z>f&&z>y.h?p.rotation=this.labelRotation:this.labelRotation=0;else if(v&&(g={width:f+"px"},!t))for(g.textOverflow="clip",E=h.length;!d&&E--;)if(w=h[E],f=n[w].label)f.styles&&"ellipsis"===f.styles.textOverflow?f.css({textOverflow:"clip"}):
n[w].labelLength>v&&f.css({width:v+"px"}),f.getBBox().height>this.len/h.length-(y.h-y.f)&&(f.specCss={textOverflow:"ellipsis"});p.rotation&&(g={width:(z>.5*a.chartHeight?.33*a.chartHeight:a.chartHeight)+"px"},t||(g.textOverflow="ellipsis"));if(this.labelAlign=m.align||this.autoLabelAlign(this.labelRotation))p.align=this.labelAlign;b(h,function(a){var b=(a=n[a])&&a.label;b&&(b.attr(p),g&&b.css(x(g,b.specCss)),delete b.specCss,a.rotation=p.rotation)});this.tickRotCorr=c.rotCorr(y.b,this.labelRotation||
0,0!==this.side)},hasData:function(){return this.hasVisibleSeries||l(this.min)&&l(this.max)&&!!this.tickPositions},addTitle:function(a){var b=this.chart.renderer,c=this.horiz,k=this.opposite,e=this.options.title,h;this.axisTitle||((h=e.textAlign)||(h=(c?{low:"left",middle:"center",high:"right"}:{low:k?"right":"left",middle:"center",high:k?"left":"right"})[e.align]),this.axisTitle=b.text(e.text,0,0,e.useHTML).attr({zIndex:7,rotation:e.rotation||0,align:h}).addClass("highcharts-axis-title").css(e.style).add(this.axisGroup),
this.axisTitle.isNew=!0);this.axisTitle[a?"show":"hide"](!0)},generateTick:function(a){var b=this.ticks;b[a]?b[a].addLabel():b[a]=new I(this,a)},getOffset:function(){var a=this,c=a.chart,e=c.renderer,h=a.options,n=a.tickPositions,m=a.ticks,d=a.horiz,f=a.side,p=c.inverted?[1,0,3,2][f]:f,y,t,x=0,g,z=0,E=h.title,q=h.labels,F=0,J=c.axisOffset,c=c.clipOffset,K=[-1,1,1,-1][f],C,I=h.className,r=a.axisParent,u=this.tickSize("tick");y=a.hasData();a.showAxis=t=y||w(h.showEmpty,!0);a.staggerLines=a.horiz&&q.staggerLines;
a.axisGroup||(a.gridGroup=e.g("grid").attr({zIndex:h.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(I||"")).add(r),a.axisGroup=e.g("axis").attr({zIndex:h.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(I||"")).add(r),a.labelGroup=e.g("axis-labels").attr({zIndex:q.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels "+(I||"")).add(r));if(y||a.isLinked)b(n,function(b,c){a.generateTick(b,c)}),a.renderUnsquish(),!1===q.reserveSpace||0!==f&&2!==f&&
{1:"left",3:"right"}[f]!==a.labelAlign&&"center"!==a.labelAlign||b(n,function(a){F=Math.max(m[a].getLabelSize(),F)}),a.staggerLines&&(F*=a.staggerLines,a.labelOffset=F*(a.opposite?-1:1));else for(C in m)m[C].destroy(),delete m[C];E&&E.text&&!1!==E.enabled&&(a.addTitle(t),t&&(x=a.axisTitle.getBBox()[d?"height":"width"],g=E.offset,z=l(g)?0:w(E.margin,d?5:10)));a.renderLine();a.offset=K*w(h.offset,J[f]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};e=0===f?-a.labelMetrics().h:2===f?a.tickRotCorr.y:0;z=Math.abs(F)+
z;F&&(z=z-e+K*(d?w(q.y,a.tickRotCorr.y+8*K):q.x));a.axisTitleMargin=w(g,z);J[f]=Math.max(J[f],a.axisTitleMargin+x+K*a.offset,z,y&&n.length&&u?u[0]:0);h=h.offset?0:2*Math.floor(a.axisLine.strokeWidth()/2);c[p]=Math.max(c[p],h)},getLinePath:function(a){var b=this.chart,c=this.opposite,k=this.offset,e=this.horiz,h=this.left+(c?this.width:0)+k,k=b.chartHeight-this.bottom-(c?this.height:0)+k;c&&(a*=-1);return b.renderer.crispLine(["M",e?this.left:h,e?k:this.top,"L",e?b.chartWidth-this.right:h,e?k:b.chartHeight-
this.bottom],a)},renderLine:function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,e=this.len,h=this.options.title,n=a?b:c,m=this.opposite,d=this.offset,f=h.x||0,p=h.y||0,y=this.chart.renderer.fontMetrics(h.style&&h.style.fontSize,this.axisTitle).f,e={low:n+(a?0:e),
middle:n+e/2,high:n+(a?e:0)}[h.align],b=(a?c+this.height:b)+(a?1:-1)*(m?-1:1)*this.axisTitleMargin+(2===this.side?y:0);return{x:a?e+f:b+(m?this.width:0)+d+f,y:a?b+p-(m?this.height:0)+d:e+p}},renderMinorTick:function(a){var b=this.chart.hasRendered&&z(this.oldMin),c=this.minorTicks;c[a]||(c[a]=new I(this,a,"minor"));b&&c[a].isNew&&c[a].render(null,!0);c[a].render(null,!1,1)},renderTick:function(a,b){var c=this.isLinked,e=this.ticks,k=this.chart.hasRendered&&z(this.oldMin);if(!c||a>=this.min&&a<=this.max)e[a]||
(e[a]=new I(this,a)),k&&e[a].isNew&&e[a].render(b,!0,.1),e[a].render(b)},render:function(){var a=this,c=a.chart,e=a.options,n=a.isLog,m=a.lin2log,d=a.isLinked,v=a.tickPositions,f=a.axisTitle,p=a.ticks,y=a.minorTicks,t=a.alternateBands,x=e.stackLabels,z=e.alternateGridColor,g=a.tickmarkOffset,E=a.axisLine,w=a.showAxis,l=A(c.renderer.globalAnimation),q,F;a.labelEdge.length=0;a.overlap=!1;b([p,y,t],function(a){for(var b in a)a[b].isActive=!1});if(a.hasData()||d)a.minorTickInterval&&!a.categories&&b(a.getMinorTickPositions(),
function(b){a.renderMinorTick(b)}),v.length&&(b(v,function(b,c){a.renderTick(b,c)}),g&&(0===a.min||a.single)&&(p[-1]||(p[-1]=new I(a,-1,null,!0)),p[-1].render(-1))),z&&b(v,function(b,e){F=void 0!==v[e+1]?v[e+1]+g:a.max-g;0===e%2&&b<a.max&&F<=a.max+(c.polar?-g:g)&&(t[b]||(t[b]=new h(a)),q=b+g,t[b].options={from:n?m(q):q,to:n?m(F):F,color:z},t[b].render(),t[b].isActive=!0)}),a._addedPlotLB||(b((e.plotLines||[]).concat(e.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0);b([p,y,t],
function(a){var b,e,h=[],k=l.duration;for(b in a)a[b].isActive||(a[b].render(b,!1,0),a[b].isActive=!1,h.push(b));K(function(){for(e=h.length;e--;)a[h[e]]&&!a[h[e]].isActive&&(a[h[e]].destroy(),delete a[h[e]])},a!==t&&c.hasRendered&&k?k:0)});E&&(E[E.isPlaced?"animate":"attr"]({d:this.getLinePath(E.strokeWidth())}),E.isPlaced=!0,E[w?"show":"hide"](!0));f&&w&&(f[f.isNew?"attr":"animate"](a.getTitlePosition()),f.isNew=!1);x&&x.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){this.visible&&
(this.render(),b(this.plotLinesAndBands,function(a){a.render()}));b(this.series,function(a){a.isDirty=!0})},keepProps:"extKey hcEvents names series userMax userMin".split(" "),destroy:function(a){var c=this,e=c.stacks,h,k=c.plotLinesAndBands,m;a||y(c);for(h in e)d(e[h]),e[h]=null;b([c.ticks,c.minorTicks,c.alternateBands],function(a){d(a)});if(k)for(a=k.length;a--;)k[a].destroy();b("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "),function(a){c[a]&&(c[a]=c[a].destroy())});
for(m in c)c.hasOwnProperty(m)&&-1===n(m,c.keepProps)&&delete c[m]},drawCrosshair:function(a,b){var c,e=this.crosshair,h=w(e.snap,!0),k,n=this.cross;a||(a=this.cross&&this.cross.e);this.crosshair&&!1!==(l(b)||!h)?(h?l(b)&&(k=this.isXAxis?b.plotX:this.len-b.plotY):k=a&&(this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos),l(k)&&(c=this.getPlotLinePath(b&&(this.isXAxis?b.x:w(b.stackY,b.y)),null,null,null,k)||null),l(c)?(b=this.categories&&!this.isRadial,n||(this.cross=n=this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+
(b?"category ":"thin ")+e.className).attr({zIndex:w(e.zIndex,2)}).add(),n.attr({stroke:e.color||(b?g("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":w(e.width,1)}),e.dashStyle&&n.attr({dashstyle:e.dashStyle})),n.show().attr({d:c}),b&&!e.width&&n.attr({"stroke-width":this.transA}),this.cross.e=a):this.hideCrosshair()):this.hideCrosshair()},hideCrosshair:function(){this.cross&&this.cross.hide()}};p(a.Axis.prototype,r)})(L);(function(a){var B=a.Axis,A=a.Date,H=a.dateFormat,G=a.defaultOptions,
r=a.defined,g=a.each,f=a.extend,u=a.getMagnitude,l=a.getTZOffset,q=a.normalizeTickInterval,d=a.pick,b=a.timeUnits;B.prototype.getTimeTicks=function(a,q,t,m){var c=[],n={},p=G.global.useUTC,z,e=new A(q-l(q)),x=A.hcMakeTime,F=a.unitRange,w=a.count,h;if(r(q)){e[A.hcSetMilliseconds](F>=b.second?0:w*Math.floor(e.getMilliseconds()/w));if(F>=b.second)e[A.hcSetSeconds](F>=b.minute?0:w*Math.floor(e.getSeconds()/w));if(F>=b.minute)e[A.hcSetMinutes](F>=b.hour?0:w*Math.floor(e[A.hcGetMinutes]()/w));if(F>=b.hour)e[A.hcSetHours](F>=
b.day?0:w*Math.floor(e[A.hcGetHours]()/w));if(F>=b.day)e[A.hcSetDate](F>=b.month?1:w*Math.floor(e[A.hcGetDate]()/w));F>=b.month&&(e[A.hcSetMonth](F>=b.year?0:w*Math.floor(e[A.hcGetMonth]()/w)),z=e[A.hcGetFullYear]());if(F>=b.year)e[A.hcSetFullYear](z-z%w);if(F===b.week)e[A.hcSetDate](e[A.hcGetDate]()-e[A.hcGetDay]()+d(m,1));z=e[A.hcGetFullYear]();m=e[A.hcGetMonth]();var y=e[A.hcGetDate](),J=e[A.hcGetHours]();if(A.hcTimezoneOffset||A.hcGetTimezoneOffset)h=(!p||!!A.hcGetTimezoneOffset)&&(t-q>4*b.month||
l(q)!==l(t)),e=e.getTime(),e=new A(e+l(e));p=e.getTime();for(q=1;p<t;)c.push(p),p=F===b.year?x(z+q*w,0):F===b.month?x(z,m+q*w):!h||F!==b.day&&F!==b.week?h&&F===b.hour?x(z,m,y,J+q*w):p+F*w:x(z,m,y+q*w*(F===b.day?1:7)),q++;c.push(p);F<=b.hour&&1E4>c.length&&g(c,function(a){0===a%18E5&&"000000000"===H("%H%M%S%L",a)&&(n[a]="day")})}c.info=f(a,{higherRanks:n,totalRange:F*w});return c};B.prototype.normalizeTimeTickInterval=function(a,d){var f=d||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",
[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];d=f[f.length-1];var m=b[d[0]],c=d[1],n;for(n=0;n<f.length&&!(d=f[n],m=b[d[0]],c=d[1],f[n+1]&&a<=(m*c[c.length-1]+b[f[n+1][0]])/2);n++);m===b.year&&a<5*m&&(c=[1,2,5]);a=q(a/m,c,"year"===d[0]?Math.max(u(a/m),1):1);return{unitRange:m,count:a,unitName:d[0]}}})(L);(function(a){var B=a.Axis,A=a.getMagnitude,H=a.map,G=a.normalizeTickInterval,r=a.pick;B.prototype.getLogTickPositions=
function(a,f,u,l){var g=this.options,d=this.len,b=this.lin2log,p=this.log2lin,C=[];l||(this._minorAutoInterval=null);if(.5<=a)a=Math.round(a),C=this.getLinearTickPositions(a,f,u);else if(.08<=a)for(var d=Math.floor(f),t,m,c,n,E,g=.3<a?[1,2,4]:.15<a?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];d<u+1&&!E;d++)for(m=g.length,t=0;t<m&&!E;t++)c=p(b(d)*g[t]),c>f&&(!l||n<=u)&&void 0!==n&&C.push(n),n>u&&(E=!0),n=c;else f=b(f),u=b(u),a=g[l?"minorTickInterval":"tickInterval"],a=r("auto"===a?null:a,this._minorAutoInterval,
g.tickPixelInterval/(l?5:1)*(u-f)/((l?d/this.tickPositions.length:d)||1)),a=G(a,null,A(a)),C=H(this.getLinearTickPositions(a,f,u),p),l||(this._minorAutoInterval=a/5);l||(this.tickInterval=a);return C};B.prototype.log2lin=function(a){return Math.log(a)/Math.LN10};B.prototype.lin2log=function(a){return Math.pow(10,a)}})(L);(function(a){var B=a.dateFormat,A=a.each,H=a.extend,G=a.format,r=a.isNumber,g=a.map,f=a.merge,u=a.pick,l=a.splat,q=a.syncTimeout,d=a.timeUnits;a.Tooltip=function(){this.init.apply(this,
arguments)};a.Tooltip.prototype={init:function(a,d){this.chart=a;this.options=d;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=d.split&&!a.inverted;this.shared=d.shared||this.split},cleanSplit:function(a){A(this.chart.series,function(b){var d=b&&b.tt;d&&(!d.isActive||a?b.tt=d.destroy():d.isActive=!1)})},getLabel:function(){var a=this.chart.renderer,d=this.options;this.label||(this.split?this.label=a.g("tooltip"):(this.label=a.label("",0,0,d.shape||"callout",null,null,d.useHTML,
null,"tooltip").attr({padding:d.padding,r:d.borderRadius}),this.label.attr({fill:d.backgroundColor,"stroke-width":d.borderWidth}).css(d.style).shadow(d.shadow)),this.label.attr({zIndex:8}).add());return this.label},update:function(a){this.destroy();this.init(this.chart,f(!0,this.options,a))},destroy:function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},
move:function(a,d,f,t){var b=this,c=b.now,n=!1!==b.options.animation&&!b.isHidden&&(1<Math.abs(a-c.x)||1<Math.abs(d-c.y)),p=b.followPointer||1<b.len;H(c,{x:n?(2*c.x+a)/3:a,y:n?(c.y+d)/2:d,anchorX:p?void 0:n?(2*c.anchorX+f)/3:f,anchorY:p?void 0:n?(c.anchorY+t)/2:t});b.getLabel().attr(c);n&&(clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){b&&b.move(a,d,f,t)},32))},hide:function(a){var b=this;clearTimeout(this.hideTimer);a=u(a,this.options.hideDelay,500);this.isHidden||(this.hideTimer=
q(function(){b.getLabel()[a?"fadeOut":"hide"]();b.isHidden=!0},a))},getAnchor:function(a,d){var b,f=this.chart,m=f.inverted,c=f.plotTop,n=f.plotLeft,p=0,z=0,e,x;a=l(a);b=a[0].tooltipPos;this.followPointer&&d&&(void 0===d.chartX&&(d=f.pointer.normalize(d)),b=[d.chartX-f.plotLeft,d.chartY-c]);b||(A(a,function(a){e=a.series.yAxis;x=a.series.xAxis;p+=a.plotX+(!m&&x?x.left-n:0);z+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!m&&e?e.top-c:0)}),p/=a.length,z/=a.length,b=[m?f.plotWidth-z:p,this.shared&&
!m&&1<a.length&&d?d.chartY-c:m?f.plotHeight-p:z]);return g(b,Math.round)},getPosition:function(a,d,f){var b=this.chart,m=this.distance,c={},n=f.h||0,p,z=["y",b.chartHeight,d,f.plotY+b.plotTop,b.plotTop,b.plotTop+b.plotHeight],e=["x",b.chartWidth,a,f.plotX+b.plotLeft,b.plotLeft,b.plotLeft+b.plotWidth],x=!this.followPointer&&u(f.ttBelow,!b.inverted===!!f.negative),g=function(a,b,e,h,d,f){var k=e<h-m,y=h+m+e<b,p=h-m-e;h+=m;if(x&&y)c[a]=h;else if(!x&&k)c[a]=p;else if(k)c[a]=Math.min(f-e,0>p-n?p:p-n);
else if(y)c[a]=Math.max(d,h+n+e>b?h:h+n);else return!1},w=function(a,b,e,h){var k;h<m||h>b-m?k=!1:c[a]=h<e/2?1:h>b-e/2?b-e-2:h-e/2;return k},h=function(a){var b=z;z=e;e=b;p=a},y=function(){!1!==g.apply(0,z)?!1!==w.apply(0,e)||p||(h(!0),y()):p?c.x=c.y=0:(h(!0),y())};(b.inverted||1<this.len)&&h();y();return c},defaultFormatter:function(a){var b=this.points||l(this),d;d=[a.tooltipFooterHeaderFormatter(b[0])];d=d.concat(a.bodyFormatter(b));d.push(a.tooltipFooterHeaderFormatter(b[0],!0));return d},refresh:function(a,
d){var b=this.chart,f,m=this.options,c,n,p={},z=[];f=m.formatter||this.defaultFormatter;var p=b.hoverPoints,e=this.shared;clearTimeout(this.hideTimer);this.followPointer=l(a)[0].series.tooltipOptions.followPointer;n=this.getAnchor(a,d);d=n[0];c=n[1];!e||a.series&&a.series.noSharedTooltip?p=a.getLabelConfig():(b.hoverPoints=a,p&&A(p,function(a){a.setState()}),A(a,function(a){a.setState("hover");z.push(a.getLabelConfig())}),p={x:a[0].category,y:a[0].y},p.points=z,a=a[0]);this.len=z.length;p=f.call(p,
this);e=a.series;this.distance=u(e.tooltipOptions.distance,16);!1===p?this.hide():(f=this.getLabel(),this.isHidden&&f.attr({opacity:1}).show(),this.split?this.renderSplit(p,b.hoverPoints):(f.attr({text:p&&p.join?p.join(""):p}),f.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+u(a.colorIndex,e.colorIndex)),f.attr({stroke:m.borderColor||a.color||e.color||"#666666"}),this.updatePosition({plotX:d,plotY:c,negative:a.negative,ttBelow:a.ttBelow,h:n[2]||0})),this.isHidden=!1)},renderSplit:function(b,
d){var f=this,p=[],m=this.chart,c=m.renderer,n=!0,g=this.options,z,e=this.getLabel();A(b.slice(0,d.length+1),function(a,b){b=d[b-1]||{isHeader:!0,plotX:d[0].plotX};var x=b.series||f,h=x.tt,y=b.series||{},t="highcharts-color-"+u(b.colorIndex,y.colorIndex,"none");h||(x.tt=h=c.label(null,null,null,"callout").addClass("highcharts-tooltip-box "+t).attr({padding:g.padding,r:g.borderRadius,fill:g.backgroundColor,stroke:b.color||y.color||"#333333","stroke-width":g.borderWidth}).add(e));h.isActive=!0;h.attr({text:a});
h.css(g.style);a=h.getBBox();y=a.width+h.strokeWidth();b.isHeader?(z=a.height,y=Math.max(0,Math.min(b.plotX+m.plotLeft-y/2,m.chartWidth-y))):y=b.plotX+m.plotLeft-u(g.distance,16)-y;0>y&&(n=!1);a=(b.series&&b.series.yAxis&&b.series.yAxis.pos)+(b.plotY||0);a-=m.plotTop;p.push({target:b.isHeader?m.plotHeight+z:a,rank:b.isHeader?1:0,size:x.tt.getBBox().height+1,point:b,x:y,tt:h})});this.cleanSplit();a.distribute(p,m.plotHeight+z);A(p,function(a){var b=a.point,c=b.series;a.tt.attr({visibility:void 0===
a.pos?"hidden":"inherit",x:n||b.isHeader?a.x:b.plotX+m.plotLeft+u(g.distance,16),y:a.pos+m.plotTop,anchorX:b.isHeader?b.plotX+m.plotLeft:b.plotX+c.xAxis.pos,anchorY:b.isHeader?a.pos+m.plotTop-15:b.plotY+c.yAxis.pos})})},updatePosition:function(a){var b=this.chart,d=this.getLabel(),d=(this.options.positioner||this.getPosition).call(this,d.width,d.height,a);this.move(Math.round(d.x),Math.round(d.y||0),a.plotX+b.plotLeft,a.plotY+b.plotTop)},getDateFormat:function(a,f,g,t){var b=B("%m-%d %H:%M:%S.%L",
f),c,n,p={millisecond:15,second:12,minute:9,hour:6,day:3},z="millisecond";for(n in d){if(a===d.week&&+B("%w",f)===g&&"00:00:00.000"===b.substr(6)){n="week";break}if(d[n]>a){n=z;break}if(p[n]&&b.substr(p[n])!=="01-01 00:00:00.000".substr(p[n]))break;"week"!==n&&(z=n)}n&&(c=t[n]);return c},getXDateFormat:function(a,d,f){d=d.dateTimeLabelFormats;var b=f&&f.closestPointRange;return(b?this.getDateFormat(b,a.x,f.options.startOfWeek,d):d.day)||d.year},tooltipFooterHeaderFormatter:function(a,d){var b=d?"footer":
"header";d=a.series;var f=d.tooltipOptions,m=f.xDateFormat,c=d.xAxis,n=c&&"datetime"===c.options.type&&r(a.key),b=f[b+"Format"];n&&!m&&(m=this.getXDateFormat(a,f,c));n&&m&&(b=b.replace("{point.key}","{point.key:"+m+"}"));return G(b,{point:a,series:d})},bodyFormatter:function(a){return g(a,function(a){var b=a.series.tooltipOptions;return(b.pointFormatter||a.point.tooltipFormatter).call(a.point,b.pointFormat)})}}})(L);(function(a){var B=a.addEvent,A=a.attr,H=a.charts,G=a.color,r=a.css,g=a.defined,f=
a.doc,u=a.each,l=a.extend,q=a.fireEvent,d=a.offset,b=a.pick,p=a.removeEvent,C=a.splat,t=a.Tooltip,m=a.win;a.Pointer=function(a,b){this.init(a,b)};a.Pointer.prototype={init:function(a,d){this.options=d;this.chart=a;this.runChartClick=d.chart.events&&!!d.chart.events.click;this.pinchDown=[];this.lastValidTouch={};t&&d.tooltip.enabled&&(a.tooltip=new t(a,d.tooltip),this.followTouchMove=b(d.tooltip.followTouchMove,!0));this.setDOMEvents()},zoomOption:function(a){var c=this.chart,d=c.options.chart,m=d.zoomType||
"",c=c.inverted;/touch/.test(a.type)&&(m=b(d.pinchType,m));this.zoomX=a=/x/.test(m);this.zoomY=m=/y/.test(m);this.zoomHor=a&&!c||m&&c;this.zoomVert=m&&!c||a&&c;this.hasZoom=a||m},normalize:function(a,b){var c,n;a=a||m.event;a.target||(a.target=a.srcElement);n=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;b||(this.chartPosition=b=d(this.chart.container));void 0===n.pageX?(c=Math.max(a.x,a.clientX-b.left),b=a.y):(c=n.pageX-b.left,b=n.pageY-b.top);return l(a,{chartX:Math.round(c),
chartY:Math.round(b)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};u(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},runPointActions:function(c){var d=this.chart,m=d.series,p=d.tooltip,e=p?p.shared:!1,g=!0,t=d.hoverPoint,w=d.hoverSeries,h,y,l,q=[],r;if(!e&&!w)for(h=0;h<m.length;h++)if(m[h].directTouch||!m[h].options.stickyTracking)m=[];w&&(e?w.noSharedTooltip:w.directTouch)&&t?q=[t]:(e||!w||w.options.stickyTracking||
(m=[w]),u(m,function(a){y=a.noSharedTooltip&&e;l=!e&&a.directTouch;a.visible&&!y&&!l&&b(a.options.enableMouseTracking,!0)&&(r=a.searchPoint(c,!y&&1===a.kdDimensions))&&r.series&&q.push(r)}),q.sort(function(a,b){var c=a.distX-b.distX,h=a.dist-b.dist,k=(b.series.group&&b.series.group.zIndex)-(a.series.group&&a.series.group.zIndex);return 0!==c&&e?c:0!==h?h:0!==k?k:a.series.index>b.series.index?-1:1}));if(e)for(h=q.length;h--;)(q[h].x!==q[0].x||q[h].series.noSharedTooltip)&&q.splice(h,1);if(q[0]&&(q[0]!==
this.prevKDPoint||p&&p.isHidden)){if(e&&!q[0].series.noSharedTooltip){for(h=0;h<q.length;h++)q[h].onMouseOver(c,q[h]!==(w&&w.directTouch&&t||q[0]));q.length&&p&&p.refresh(q.sort(function(a,b){return a.series.index-b.series.index}),c)}else if(p&&p.refresh(q[0],c),!w||!w.directTouch)q[0].onMouseOver(c);this.prevKDPoint=q[0];g=!1}g&&(m=w&&w.tooltipOptions.followPointer,p&&m&&!p.isHidden&&(m=p.getAnchor([{}],c),p.updatePosition({plotX:m[0],plotY:m[1]})));this.unDocMouseMove||(this.unDocMouseMove=B(f,
"mousemove",function(b){if(H[a.hoverChartIndex])H[a.hoverChartIndex].pointer.onDocumentMouseMove(b)}));u(e?q:[b(t,q[0])],function(a){u(d.axes,function(b){(!a||a.series&&a.series[b.coll]===b)&&b.drawCrosshair(c,a)})})},reset:function(a,b){var c=this.chart,d=c.hoverSeries,e=c.hoverPoint,n=c.hoverPoints,m=c.tooltip,f=m&&m.shared?n:e;a&&f&&u(C(f),function(b){b.series.isCartesian&&void 0===b.plotX&&(a=!1)});if(a)m&&f&&(m.refresh(f),e&&(e.setState(e.state,!0),u(c.axes,function(a){a.crosshair&&a.drawCrosshair(null,
e)})));else{if(e)e.onMouseOut();n&&u(n,function(a){a.setState()});if(d)d.onMouseOut();m&&m.hide(b);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());u(c.axes,function(a){a.hideCrosshair()});this.hoverX=this.prevKDPoint=c.hoverPoints=c.hoverPoint=null}},scaleGroups:function(a,b){var c=this.chart,d;u(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&e.group&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&
e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,m=this.zoomHor,f=this.zoomVert,p=b.plotLeft,h=b.plotTop,y=b.plotWidth,g=b.plotHeight,t,q=this.selectionMarker,k=this.mouseDownX,l=this.mouseDownY,r=c.panKey&&a[c.panKey+"Key"];q&&q.touch||(d<p?d=p:d>p+y&&(d=p+y),e<
h?e=h:e>h+g&&(e=h+g),this.hasDragged=Math.sqrt(Math.pow(k-d,2)+Math.pow(l-e,2)),10<this.hasDragged&&(t=b.isInsidePlot(k-p,l-h),b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&t&&!r&&!q&&(this.selectionMarker=q=b.renderer.rect(p,h,m?1:y,f?1:g,0).attr({fill:c.selectionMarkerFill||G("#335cad").setOpacity(.25).get(),"class":"highcharts-selection-marker",zIndex:7}).add()),q&&m&&(d-=k,q.attr({width:Math.abs(d),x:(0<d?0:d)+k})),q&&f&&(d=e-l,q.attr({height:Math.abs(d),y:(0<d?0:d)+l})),t&&!q&&c.panning&&b.pan(a,
c.panning)))},drop:function(a){var b=this,c=this.chart,d=this.hasPinched;if(this.selectionMarker){var e={originalEvent:a,xAxis:[],yAxis:[]},m=this.selectionMarker,f=m.attr?m.attr("x"):m.x,p=m.attr?m.attr("y"):m.y,h=m.attr?m.attr("width"):m.width,y=m.attr?m.attr("height"):m.height,t;if(this.hasDragged||d)u(c.axes,function(c){if(c.zoomEnabled&&g(c.min)&&(d||b[{xAxis:"zoomX",yAxis:"zoomY"}[c.coll]])){var m=c.horiz,k="touchend"===a.type?c.minPixelPadding:0,n=c.toValue((m?f:p)+k),m=c.toValue((m?f+h:p+
y)-k);e[c.coll].push({axis:c,min:Math.min(n,m),max:Math.max(n,m)});t=!0}}),t&&q(c,"selection",e,function(a){c.zoom(l(a,d?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();d&&this.scaleGroups()}c&&(r(c.container,{cursor:c._cursor}),c.cancelClick=10<this.hasDragged,c.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])},onContainerMouseDown:function(a){a=this.normalize(a);this.zoomOption(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(b){H[a.hoverChartIndex]&&
H[a.hoverChartIndex].pointer.drop(b)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition;a=this.normalize(a,c);!c||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||this.reset()},onContainerMouseLeave:function(b){var c=H[a.hoverChartIndex];c&&(b.relatedTarget||b.toElement)&&(c.pointer.reset(),c.pointer.chartPosition=null)},onContainerMouseMove:function(b){var c=this.chart;g(a.hoverChartIndex)&&H[a.hoverChartIndex]&&H[a.hoverChartIndex].mouseIsDown||
(a.hoverChartIndex=c.index);b=this.normalize(b);b.returnValue=!1;"mousedown"===c.mouseIsDown&&this.drag(b);!this.inClass(b.target,"highcharts-tracker")&&!c.isInsidePlot(b.chartX-c.plotLeft,b.chartY-c.plotTop)||c.openMenu||this.runPointActions(b)},inClass:function(a,b){for(var c;a;){if(c=A(a,"class")){if(-1!==c.indexOf(b))return!0;if(-1!==c.indexOf("highcharts-container"))return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;if(!(!b||!a||
b.options.stickyTracking||this.inClass(a,"highcharts-tooltip")||this.inClass(a,"highcharts-series-"+b.index)&&this.inClass(a,"highcharts-tracker")))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop;a=this.normalize(a);b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(q(c.series,"click",l(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(l(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&q(b,"click",a)))},setDOMEvents:function(){var b=
this,d=b.chart.container;d.onmousedown=function(a){b.onContainerMouseDown(a)};d.onmousemove=function(a){b.onContainerMouseMove(a)};d.onclick=function(a){b.onContainerClick(a)};B(d,"mouseleave",b.onContainerMouseLeave);1===a.chartCount&&B(f,"mouseup",b.onDocumentMouseUp);a.hasTouch&&(d.ontouchstart=function(a){b.onContainerTouchStart(a)},d.ontouchmove=function(a){b.onContainerTouchMove(a)},1===a.chartCount&&B(f,"touchend",b.onDocumentTouchEnd))},destroy:function(){var b;p(this.chart.container,"mouseleave",
this.onContainerMouseLeave);a.chartCount||(p(f,"mouseup",this.onDocumentMouseUp),p(f,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(b in this)this[b]=null}}})(L);(function(a){var B=a.charts,A=a.each,H=a.extend,G=a.map,r=a.noop,g=a.pick;H(a.Pointer.prototype,{pinchTranslate:function(a,g,l,q,d,b){this.zoomHor&&this.pinchTranslateDirection(!0,a,g,l,q,d,b);this.zoomVert&&this.pinchTranslateDirection(!1,a,g,l,q,d,b)},pinchTranslateDirection:function(a,g,l,q,d,b,p,r){var f=
this.chart,m=a?"x":"y",c=a?"X":"Y",n="chart"+c,E=a?"width":"height",z=f["plot"+(a?"Left":"Top")],e,x,F=r||1,w=f.inverted,h=f.bounds[a?"h":"v"],y=1===g.length,J=g[0][n],u=l[0][n],I=!y&&g[1][n],k=!y&&l[1][n],D;l=function(){!y&&20<Math.abs(J-I)&&(F=r||Math.abs(u-k)/Math.abs(J-I));x=(z-u)/F+J;e=f["plot"+(a?"Width":"Height")]/F};l();g=x;g<h.min?(g=h.min,D=!0):g+e>h.max&&(g=h.max-e,D=!0);D?(u-=.8*(u-p[m][0]),y||(k-=.8*(k-p[m][1])),l()):p[m]=[u,k];w||(b[m]=x-z,b[E]=e);b=w?1/F:F;d[E]=e;d[m]=g;q[w?a?"scaleY":
"scaleX":"scale"+c]=F;q["translate"+c]=b*z+(u-b*J)},pinch:function(a){var f=this,l=f.chart,q=f.pinchDown,d=a.touches,b=d.length,p=f.lastValidTouch,C=f.hasZoom,t=f.selectionMarker,m={},c=1===b&&(f.inClass(a.target,"highcharts-tracker")&&l.runTrackerClick||f.runChartClick),n={};1<b&&(f.initiated=!0);C&&f.initiated&&!c&&a.preventDefault();G(d,function(a){return f.normalize(a)});"touchstart"===a.type?(A(d,function(a,b){q[b]={chartX:a.chartX,chartY:a.chartY}}),p.x=[q[0].chartX,q[1]&&q[1].chartX],p.y=[q[0].chartY,
q[1]&&q[1].chartY],A(l.axes,function(a){if(a.zoomEnabled){var b=l.bounds[a.horiz?"h":"v"],c=a.minPixelPadding,d=a.toPixels(g(a.options.min,a.dataMin)),m=a.toPixels(g(a.options.max,a.dataMax)),f=Math.max(d,m);b.min=Math.min(a.pos,Math.min(d,m)-c);b.max=Math.max(a.pos+a.len,f+c)}}),f.res=!0):f.followTouchMove&&1===b?this.runPointActions(f.normalize(a)):q.length&&(t||(f.selectionMarker=t=H({destroy:r,touch:!0},l.plotBox)),f.pinchTranslate(q,d,m,t,n,p),f.hasPinched=C,f.scaleGroups(m,n),f.res&&(f.res=
!1,this.reset(!1,0)))},touch:function(f,r){var l=this.chart,q,d;if(l.index!==a.hoverChartIndex)this.onContainerMouseLeave({relatedTarget:!0});a.hoverChartIndex=l.index;1===f.touches.length?(f=this.normalize(f),(d=l.isInsidePlot(f.chartX-l.plotLeft,f.chartY-l.plotTop))&&!l.openMenu?(r&&this.runPointActions(f),"touchmove"===f.type&&(r=this.pinchDown,q=r[0]?4<=Math.sqrt(Math.pow(r[0].chartX-f.chartX,2)+Math.pow(r[0].chartY-f.chartY,2)):!1),g(q,!0)&&this.pinch(f)):r&&this.reset()):2===f.touches.length&&
this.pinch(f)},onContainerTouchStart:function(a){this.zoomOption(a);this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(f){B[a.hoverChartIndex]&&B[a.hoverChartIndex].pointer.drop(f)}})})(L);(function(a){var B=a.addEvent,A=a.charts,H=a.css,G=a.doc,r=a.extend,g=a.noop,f=a.Pointer,u=a.removeEvent,l=a.win,q=a.wrap;if(l.PointerEvent||l.MSPointerEvent){var d={},b=!!l.PointerEvent,p=function(){var a,b=[];b.item=function(a){return this[a]};for(a in d)d.hasOwnProperty(a)&&
b.push({pageX:d[a].pageX,pageY:d[a].pageY,target:d[a].target});return b},C=function(b,d,c,f){"touch"!==b.pointerType&&b.pointerType!==b.MSPOINTER_TYPE_TOUCH||!A[a.hoverChartIndex]||(f(b),f=A[a.hoverChartIndex].pointer,f[d]({type:c,target:b.currentTarget,preventDefault:g,touches:p()}))};r(f.prototype,{onContainerPointerDown:function(a){C(a,"onContainerTouchStart","touchstart",function(a){d[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){C(a,"onContainerTouchMove",
"touchmove",function(a){d[a.pointerId]={pageX:a.pageX,pageY:a.pageY};d[a.pointerId].target||(d[a.pointerId].target=a.currentTarget)})},onDocumentPointerUp:function(a){C(a,"onDocumentTouchEnd","touchend",function(a){delete d[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,b?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,b?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(G,b?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});q(f.prototype,
"init",function(a,b,c){a.call(this,b,c);this.hasZoom&&H(b.container,{"-ms-touch-action":"none","touch-action":"none"})});q(f.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(B)});q(f.prototype,"destroy",function(a){this.batchMSEvents(u);a.call(this)})}})(L);(function(a){var B,A=a.addEvent,H=a.css,G=a.discardElement,r=a.defined,g=a.each,f=a.extend,u=a.isFirefox,l=a.marginNames,q=a.merge,d=a.pick,b=a.setAnimation,p=a.stableSort,C=a.win,t=a.wrap;
B=a.Legend=function(a,b){this.init(a,b)};B.prototype={init:function(a,b){this.chart=a;this.setOptions(b);b.enabled&&(this.render(),A(this.chart,"endResize",function(){this.legend.positionCheckboxes()}))},setOptions:function(a){var b=d(a.padding,8);this.options=a;this.itemStyle=a.itemStyle;this.itemHiddenStyle=q(this.itemStyle,a.itemHiddenStyle);this.itemMarginTop=a.itemMarginTop||0;this.initialItemX=this.padding=b;this.initialItemY=b-5;this.itemHeight=this.maxItemWidth=0;this.symbolWidth=d(a.symbolWidth,
16);this.pages=[]},update:function(a,b){var c=this.chart;this.setOptions(q(!0,this.options,a));this.destroy();c.isDirtyLegend=c.isDirtyBox=!0;d(b,!0)&&c.redraw()},colorizeItem:function(a,b){a.legendGroup[b?"removeClass":"addClass"]("highcharts-legend-item-hidden");var c=this.options,d=a.legendItem,m=a.legendLine,e=a.legendSymbol,f=this.itemHiddenStyle.color,c=b?c.itemStyle.color:f,p=b?a.color||f:f,g=a.options&&a.options.marker,h={fill:p},y;d&&d.css({fill:c,color:c});m&&m.attr({stroke:p});if(e){if(g&&
e.isMarker&&(h=a.pointAttribs(),!b))for(y in h)h[y]=f;e.attr(h)}},positionItem:function(a){var b=this.options,d=b.symbolPadding,b=!b.rtl,m=a._legendItemPos,f=m[0],m=m[1],e=a.checkbox;(a=a.legendGroup)&&a.element&&a.translate(b?f:this.legendWidth-f-2*d-4,m);e&&(e.x=f,e.y=m)},destroyItem:function(a){var b=a.checkbox;g(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&G(a.checkbox)},destroy:function(){function a(a){this[a]&&(this[a]=this[a].destroy())}
g(this.getAllItems(),function(b){g(["legendItem","legendGroup"],a,b)});g(["box","title","group"],a,this);this.display=null},positionCheckboxes:function(a){var b=this.group&&this.group.alignAttr,d,m=this.clipHeight||this.legendHeight,f=this.titleHeight;b&&(d=b.translateY,g(this.allItems,function(c){var e=c.checkbox,n;e&&(n=d+f+e.y+(a||0)+3,H(e,{left:b.translateX+c.checkboxOffset+e.x-20+"px",top:n+"px",display:n>d-6&&n<d+m-6?"":"none"}))}))},renderTitle:function(){var a=this.padding,b=this.options.title,
d=0;b.text&&(this.title||(this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group)),a=this.title.getBBox(),d=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:d}));this.titleHeight=d},setText:function(b){var c=this.options;b.legendItem.attr({text:c.labelFormat?a.format(c.labelFormat,b):c.labelFormatter.call(b)})},renderItem:function(a){var b=this.chart,f=b.renderer,m=this.options,p="horizontal"===
m.layout,e=this.symbolWidth,g=m.symbolPadding,l=this.itemStyle,t=this.itemHiddenStyle,h=this.padding,y=p?d(m.itemDistance,20):0,J=!m.rtl,r=m.width,I=m.itemMarginBottom||0,k=this.itemMarginTop,u=this.initialItemX,C=a.legendItem,N=!a.series,A=!N&&a.series.drawLegendSymbol?a.series:a,B=A.options,B=this.createCheckboxForItem&&B&&B.showCheckbox,v=m.useHTML;C||(a.legendGroup=f.g("legend-item").addClass("highcharts-"+A.type+"-series highcharts-color-"+a.colorIndex+(a.options.className?" "+a.options.className:
"")+(N?" highcharts-series-"+a.index:"")).attr({zIndex:1}).add(this.scrollGroup),a.legendItem=C=f.text("",J?e+g:-g,this.baseline||0,v).css(q(a.visible?l:t)).attr({align:J?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(l=l.fontSize,this.fontMetrics=f.fontMetrics(l,C),this.baseline=this.fontMetrics.f+3+k,C.attr("y",this.baseline)),this.symbolHeight=m.symbolHeight||this.fontMetrics.f,A.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,C,v),B&&this.createCheckboxForItem(a));
this.colorizeItem(a,a.visible);this.setText(a);f=C.getBBox();e=a.checkboxOffset=m.itemWidth||a.legendItemWidth||e+g+f.width+y+(B?20:0);this.itemHeight=g=Math.round(a.legendItemHeight||f.height);p&&this.itemX-u+e>(r||b.chartWidth-2*h-u-m.x)&&(this.itemX=u,this.itemY+=k+this.lastLineHeight+I,this.lastLineHeight=0);this.maxItemWidth=Math.max(this.maxItemWidth,e);this.lastItemY=k+this.itemY+I;this.lastLineHeight=Math.max(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];p?this.itemX+=e:
(this.itemY+=k+g+I,this.lastLineHeight=g);this.offsetWidth=r||Math.max((p?this.itemX-u-y:e)+h,this.offsetWidth)},getAllItems:function(){var a=[];g(this.chart.series,function(b){var c=b&&b.options;b&&d(c.showInLegend,r(c.linkedTo)?!1:void 0,!0)&&(a=a.concat(b.legendItems||("point"===c.legendType?b.data:b)))});return a},adjustMargins:function(a,b){var c=this.chart,f=this.options,m=f.align.charAt(0)+f.verticalAlign.charAt(0)+f.layout.charAt(0);f.floating||g([/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,
/(lbv|lm|ltv)/],function(e,n){e.test(m)&&!r(a[n])&&(c[l[n]]=Math.max(c[l[n]],c.legend[(n+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][n]*f[n%2?"x":"y"]+d(f.margin,12)+b[n]))})},render:function(){var a=this,b=a.chart,d=b.renderer,q=a.group,l,e,t,r,w=a.box,h=a.options,y=a.padding;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;q||(a.group=q=d.g("legend").attr({zIndex:7}).add(),a.contentGroup=d.g().attr({zIndex:1}).add(q),a.scrollGroup=d.g().add(a.contentGroup));a.renderTitle();
l=a.getAllItems();p(l,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});h.reversed&&l.reverse();a.allItems=l;a.display=e=!!l.length;a.lastLineHeight=0;g(l,function(b){a.renderItem(b)});t=(h.width||a.offsetWidth)+y;r=a.lastItemY+a.lastLineHeight+a.titleHeight;r=a.handleOverflow(r);r+=y;w||(a.box=w=d.rect().addClass("highcharts-legend-box").attr({r:h.borderRadius}).add(q),w.isNew=!0);w.attr({stroke:h.borderColor,"stroke-width":h.borderWidth||0,fill:h.backgroundColor||
"none"}).shadow(h.shadow);0<t&&0<r&&(w[w.isNew?"attr":"animate"](w.crisp({x:0,y:0,width:t,height:r},w.strokeWidth())),w.isNew=!1);w[e?"show":"hide"]();a.legendWidth=t;a.legendHeight=r;g(l,function(b){a.positionItem(b)});e&&q.align(f({width:t,height:r},h),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,f=this.chart,m=f.renderer,p=this.options,e=p.y,f=f.spacingBox.height+("top"===p.verticalAlign?-e:e)-this.padding,e=p.maxHeight,q,l=this.clipRect,t=p.navigation,
h=d(t.animation,!0),y=t.arrowSize||12,r=this.nav,u=this.pages,I=this.padding,k,D=this.allItems,C=function(a){a?l.attr({height:a}):l&&(b.clipRect=l.destroy(),b.contentGroup.clip());b.contentGroup.div&&(b.contentGroup.div.style.clip=a?"rect("+I+"px,9999px,"+(I+a)+"px,0)":"auto")};"horizontal"!==p.layout||"middle"===p.verticalAlign||p.floating||(f/=2);e&&(f=Math.min(f,e));u.length=0;a>f&&!1!==t.enabled?(this.clipHeight=q=Math.max(f-20-this.titleHeight-I,0),this.currentPage=d(this.currentPage,1),this.fullHeight=
a,g(D,function(a,b){var c=a._legendItemPos[1];a=Math.round(a.legendItem.getBBox().height);var e=u.length;if(!e||c-u[e-1]>q&&(k||c)!==u[e-1])u.push(k||c),e++;b===D.length-1&&c+a-u[e-1]>q&&u.push(c);c!==k&&(k=c)}),l||(l=b.clipRect=m.clipRect(0,I,9999,0),b.contentGroup.clip(l)),C(q),r||(this.nav=r=m.g().attr({zIndex:1}).add(this.group),this.up=m.symbol("triangle",0,0,y,y).on("click",function(){b.scroll(-1,h)}).add(r),this.pager=m.text("",15,10).addClass("highcharts-legend-navigation").css(t.style).add(r),
this.down=m.symbol("triangle-down",0,0,y,y).on("click",function(){b.scroll(1,h)}).add(r)),b.scroll(0),a=f):r&&(C(),r.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return a},scroll:function(a,c){var d=this.pages,f=d.length;a=this.currentPage+a;var m=this.clipHeight,e=this.options.navigation,p=this.pager,g=this.padding;a>f&&(a=f);0<a&&(void 0!==c&&b(c,this.chart),this.nav.attr({translateX:g,translateY:m+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({"class":1===
a?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),p.attr({text:a+"/"+f}),this.down.attr({x:18+this.pager.getBBox().width,"class":a===f?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),this.up.attr({fill:1===a?e.inactiveColor:e.activeColor}).css({cursor:1===a?"default":"pointer"}),this.down.attr({fill:a===f?e.inactiveColor:e.activeColor}).css({cursor:a===f?"default":"pointer"}),c=-d[a-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=
a,this.positionCheckboxes(c))}};a.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.symbolHeight,f=a.options.squareSymbol;b.legendSymbol=this.chart.renderer.rect(f?(a.symbolWidth-c)/2:0,a.baseline-c+1,f?c:a.symbolWidth,c,d(a.options.symbolRadius,c/2)).addClass("highcharts-point").attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,f=b.marker,m=a.symbolWidth,p=a.symbolHeight,e=p/2,g=this.chart.renderer,l=this.legendGroup;a=a.baseline-Math.round(.3*a.fontMetrics.b);
var t;t={"stroke-width":b.lineWidth||0};b.dashStyle&&(t.dashstyle=b.dashStyle);this.legendLine=g.path(["M",0,a,"L",m,a]).addClass("highcharts-graph").attr(t).add(l);f&&!1!==f.enabled&&(b=Math.min(d(f.radius,e),e),0===this.symbol.indexOf("url")&&(f=q(f,{width:p,height:p}),b=0),this.legendSymbol=f=g.symbol(this.symbol,m/2-b,a-b,2*b,2*b,f).addClass("highcharts-point").add(l),f.isMarker=!0)}};(/Trident\/7\.0/.test(C.navigator.userAgent)||u)&&t(B.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&
a.call(c,b)};d();setTimeout(d)})})(L);(function(a){var B=a.addEvent,A=a.animate,H=a.animObject,G=a.attr,r=a.doc,g=a.Axis,f=a.createElement,u=a.defaultOptions,l=a.discardElement,q=a.charts,d=a.css,b=a.defined,p=a.each,C=a.extend,t=a.find,m=a.fireEvent,c=a.getStyle,n=a.grep,E=a.isNumber,z=a.isObject,e=a.isString,x=a.Legend,F=a.marginNames,w=a.merge,h=a.Pointer,y=a.pick,J=a.pInt,K=a.removeEvent,I=a.seriesTypes,k=a.splat,D=a.svg,P=a.syncTimeout,N=a.win,S=a.Renderer,O=a.Chart=function(){this.getArgs.apply(this,
arguments)};a.chart=function(a,b,c){return new O(a,b,c)};O.prototype={callbacks:[],getArgs:function(){var a=[].slice.call(arguments);if(e(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(b,c){var e,h=b.series;b.series=null;e=w(u,b);e.series=b.series=h;this.userOptions=b;this.respRules=[];b=e.chart;h=b.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.callback=c;this.isResizing=0;this.options=e;this.axes=[];this.series=[];this.hasCartesianSeries=b.showAxes;
var d;this.index=q.length;q.push(this);a.chartCount++;if(h)for(d in h)B(this,d,h[d]);this.xAxis=[];this.yAxis=[];this.pointCount=this.colorCounter=this.symbolCounter=0;this.firstRender()},initSeries:function(b){var c=this.options.chart;(c=I[b.type||c.type||c.defaultSeriesType])||a.error(17,!0);c=new c;c.init(this,b);return c},orderSeries:function(a){var b=this.series;for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].name||"Series "+(b[a].index+1))},isInsidePlot:function(a,b,c){var e=c?
b:a;a=c?a:b;return 0<=e&&e<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(b){var c=this.axes,e=this.series,h=this.pointer,d=this.legend,k=this.isDirtyLegend,f,n,y=this.hasCartesianSeries,g=this.isDirtyBox,v=e.length,l=v,q=this.renderer,t=q.isHidden(),w=[];this.setResponsive&&this.setResponsive(!1);a.setAnimation(b,this);t&&this.cloneRenderTo();for(this.layOutTitles();l--;)if(b=e[l],b.options.stacking&&(f=!0,b.isDirty)){n=!0;break}if(n)for(l=v;l--;)b=e[l],b.options.stacking&&(b.isDirty=
!0);p(e,function(a){a.isDirty&&"point"===a.options.legendType&&(a.updateTotals&&a.updateTotals(),k=!0);a.isDirtyData&&m(a,"updatedData")});k&&d.options.enabled&&(d.render(),this.isDirtyLegend=!1);f&&this.getStacks();y&&p(c,function(a){a.updateNames();a.setScale()});this.getMargins();y&&(p(c,function(a){a.isDirty&&(g=!0)}),p(c,function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,w.push(function(){m(a,"afterSetExtremes",C(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(g||f)&&a.redraw()}));
g&&this.drawChartBox();m(this,"predraw");p(e,function(a){(g||a.isDirty)&&a.visible&&a.redraw();a.isDirtyData=!1});h&&h.reset(!0);q.draw();m(this,"redraw");m(this,"render");t&&this.cloneRenderTo(!0);p(w,function(a){a.call()})},get:function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var c,e=this.series,h;c=t(this.axes,b)||t(this.series,b);for(h=0;!c&&h<e.length;h++)c=t(e[h].points||[],b);return c},getAxes:function(){var a=this,b=this.options,c=b.xAxis=k(b.xAxis||{}),b=b.yAxis=k(b.yAxis||
{});p(c,function(a,b){a.index=b;a.isX=!0});p(b,function(a,b){a.index=b});c=c.concat(b);p(c,function(b){new g(a,b)})},getSelectedPoints:function(){var a=[];p(this.series,function(b){a=a.concat(n(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return n(this.series,function(a){return a.selected})},setTitle:function(a,b,c){var e=this,h=e.options,d;d=h.title=w({style:{color:"#333333",fontSize:h.isStock?"16px":"18px"}},h.title,a);h=h.subtitle=w({style:{color:"#666666"}},
h.subtitle,b);p([["title",a,d],["subtitle",b,h]],function(a,b){var c=a[0],h=e[c],d=a[1];a=a[2];h&&d&&(e[c]=h=h.destroy());a&&a.text&&!h&&(e[c]=e.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+c,zIndex:a.zIndex||4}).add(),e[c].update=function(a){e.setTitle(!b&&a,b&&a)},e[c].css(a.style))});e.layOutTitles(c)},layOutTitles:function(a){var b=0,c,e=this.renderer,h=this.spacingBox;p(["title","subtitle"],function(a){var c=this[a],d=this.options[a],k;c&&(k=d.style.fontSize,
k=e.fontMetrics(k,c).b,c.css({width:(d.width||h.width+d.widthAdjust)+"px"}).align(C({y:b+k+("title"===a?-3:2)},d),!1,"spacingBox"),d.floating||d.verticalAlign||(b=Math.ceil(b+c.getBBox().height)))},this);c=this.titleOffset!==b;this.titleOffset=b;!this.isDirtyBox&&c&&(this.isDirtyBox=c,this.hasRendered&&y(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var a=this.options.chart,e=a.width,a=a.height,h=this.renderToClone||this.renderTo;b(e)||(this.containerWidth=c(h,"width"));b(a)||(this.containerHeight=
c(h,"height"));this.chartWidth=Math.max(0,e||this.containerWidth||600);this.chartHeight=Math.max(0,a||this.containerHeight||400)},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;if(a){if(b){for(;b.childNodes.length;)this.renderTo.appendChild(b.firstChild);l(b);delete this.renderToClone}}else c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),d(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&
b.style.setProperty("display","block","important"),r.body.appendChild(b),c&&b.appendChild(c)},setClassName:function(a){this.container.className="highcharts-container "+(a||"")},getContainer:function(){var b,c=this.options,h=c.chart,d,k;b=this.renderTo;var m=a.uniqueKey(),n;b||(this.renderTo=b=h.renderTo);e(b)&&(this.renderTo=b=r.getElementById(b));b||a.error(13,!0);d=J(G(b,"data-highcharts-chart"));E(d)&&q[d]&&q[d].hasRendered&&q[d].destroy();G(b,"data-highcharts-chart",this.index);b.innerHTML="";
h.skipClone||b.offsetWidth||this.cloneRenderTo();this.getChartSize();d=this.chartWidth;k=this.chartHeight;n=C({position:"relative",overflow:"hidden",width:d+"px",height:k+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},h.style);this.container=b=f("div",{id:m},n,this.renderToClone||b);this._cursor=b.style.cursor;this.renderer=new (a[h.renderer]||S)(b,d,k,null,h.forExport,c.exporting&&c.exporting.allowHTML);this.setClassName(h.className);this.renderer.setStyle(h.style);
this.renderer.chartIndex=this.index},getMargins:function(a){var c=this.spacing,e=this.margin,h=this.titleOffset;this.resetMargins();h&&!b(e[0])&&(this.plotTop=Math.max(this.plotTop,h+this.options.title.margin+c[0]));this.legend.display&&this.legend.adjustMargins(e,c);this.extraMargin&&(this[this.extraMargin.type]=(this[this.extraMargin.type]||0)+this.extraMargin.value);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);a||this.getAxisMargins()},getAxisMargins:function(){var a=this,c=a.axisOffset=
[0,0,0,0],e=a.margin;a.hasCartesianSeries&&p(a.axes,function(a){a.visible&&a.getOffset()});p(F,function(h,d){b(e[d])||(a[h]+=c[d])});a.setChartSize()},reflow:function(a){var e=this,h=e.options.chart,d=e.renderTo,k=b(h.width),f=h.width||c(d,"width"),h=h.height||c(d,"height"),d=a?a.target:N;if(!k&&!e.isPrinting&&f&&h&&(d===N||d===r)){if(f!==e.containerWidth||h!==e.containerHeight)clearTimeout(e.reflowTimeout),e.reflowTimeout=P(function(){e.container&&e.setSize(void 0,void 0,!1)},a?100:0);e.containerWidth=
f;e.containerHeight=h}},initReflow:function(){var a=this,b;b=B(N,"resize",function(b){a.reflow(b)});B(a,"destroy",b)},setSize:function(b,c,e){var h=this,k=h.renderer;h.isResizing+=1;a.setAnimation(e,h);h.oldChartHeight=h.chartHeight;h.oldChartWidth=h.chartWidth;void 0!==b&&(h.options.chart.width=b);void 0!==c&&(h.options.chart.height=c);h.getChartSize();b=k.globalAnimation;(b?A:d)(h.container,{width:h.chartWidth+"px",height:h.chartHeight+"px"},b);h.setChartSize(!0);k.setSize(h.chartWidth,h.chartHeight,
e);p(h.axes,function(a){a.isDirty=!0;a.setScale()});h.isDirtyLegend=!0;h.isDirtyBox=!0;h.layOutTitles();h.getMargins();h.redraw(e);h.oldChartHeight=null;m(h,"resize");P(function(){h&&m(h,"endResize",null,function(){--h.isResizing})},H(b).duration)},setChartSize:function(a){var b=this.inverted,c=this.renderer,e=this.chartWidth,h=this.chartHeight,d=this.options.chart,k=this.spacing,f=this.clipOffset,m,n,y,g;this.plotLeft=m=Math.round(this.plotLeft);this.plotTop=n=Math.round(this.plotTop);this.plotWidth=
y=Math.max(0,Math.round(e-m-this.marginRight));this.plotHeight=g=Math.max(0,Math.round(h-n-this.marginBottom));this.plotSizeX=b?g:y;this.plotSizeY=b?y:g;this.plotBorderWidth=d.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:k[3],y:k[0],width:e-k[3]-k[1],height:h-k[0]-k[2]};this.plotBox=c.plotBox={x:m,y:n,width:y,height:g};e=2*Math.floor(this.plotBorderWidth/2);b=Math.ceil(Math.max(e,f[3])/2);c=Math.ceil(Math.max(e,f[0])/2);this.clipBox={x:b,y:c,width:Math.floor(this.plotSizeX-Math.max(e,f[1])/
2-b),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(e,f[2])/2-c))};a||p(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},resetMargins:function(){var a=this,b=a.options.chart;p(["margin","spacing"],function(c){var e=b[c],h=z(e)?e:[e,e,e,e];p(["Top","Right","Bottom","Left"],function(e,d){a[c][d]=y(b[c+e],h[d])})});p(F,function(b,c){a[b]=y(a.margin[c],a.spacing[c])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=
this.chartWidth,e=this.chartHeight,h=this.chartBackground,d=this.plotBackground,k=this.plotBorder,f,m=this.plotBGImage,n=a.backgroundColor,p=a.plotBackgroundColor,y=a.plotBackgroundImage,g,l=this.plotLeft,q=this.plotTop,t=this.plotWidth,w=this.plotHeight,x=this.plotBox,r=this.clipRect,z=this.clipBox,J="animate";h||(this.chartBackground=h=b.rect().addClass("highcharts-background").add(),J="attr");f=a.borderWidth||0;g=f+(a.shadow?8:0);n={fill:n||"none"};if(f||h["stroke-width"])n.stroke=a.borderColor,
n["stroke-width"]=f;h.attr(n).shadow(a.shadow);h[J]({x:g/2,y:g/2,width:c-g-f%2,height:e-g-f%2,r:a.borderRadius});J="animate";d||(J="attr",this.plotBackground=d=b.rect().addClass("highcharts-plot-background").add());d[J](x);d.attr({fill:p||"none"}).shadow(a.plotShadow);y&&(m?m.animate(x):this.plotBGImage=b.image(y,l,q,t,w).add());r?r.animate({width:z.width,height:z.height}):this.clipRect=b.clipRect(z);J="animate";k||(J="attr",this.plotBorder=k=b.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());
k.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});k[J](k.crisp({x:l,y:q,width:t,height:w},-k.strokeWidth()));this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,e=a.options.series,h,d;p(["inverted","angular","polar"],function(k){c=I[b.type||b.defaultSeriesType];d=b[k]||c&&c.prototype[k];for(h=e&&e.length;!d&&h--;)(c=I[e[h].type])&&c.prototype[k]&&(d=!0);a[k]=d})},linkSeries:function(){var a=this,b=a.series;p(b,function(a){a.linkedSeries.length=
0});p(b,function(b){var c=b.options.linkedTo;e(c)&&(c=":previous"===c?a.series[b.index-1]:a.get(c))&&c.linkedParent!==b&&(c.linkedSeries.push(b),b.linkedParent=c,b.visible=y(b.options.visible,c.options.visible,b.visible))})},renderSeries:function(){p(this.series,function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&p(b.items,function(c){var e=C(b.style,c.style),h=J(e.left)+a.plotLeft,d=J(e.top)+a.plotTop+12;delete e.left;delete e.top;a.renderer.text(c.html,
h,d).attr({zIndex:2}).css(e).add()})},render:function(){var a=this.axes,b=this.renderer,c=this.options,e,h,d;this.setTitle();this.legend=new x(this,c.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();c=this.plotWidth;e=this.plotHeight-=21;p(a,function(a){a.setScale()});this.getAxisMargins();h=1.1<c/this.plotWidth;d=1.05<e/this.plotHeight;if(h||d)p(a,function(a){(a.horiz&&h||!a.horiz&&d)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&
p(a,function(a){a.visible&&a.render()});this.seriesGroup||(this.seriesGroup=b.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.hasRendered=!0},addCredits:function(a){var b=this;a=w(!0,this.options.credits,a);a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){a.href&&(N.location.href=a.href)}).attr({align:a.position.align,
zIndex:8}).css(a.style).add().align(a.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a)})},destroy:function(){var b=this,c=b.axes,e=b.series,h=b.container,d,k=h&&h.parentNode;m(b,"destroy");q[b.index]=void 0;a.chartCount--;b.renderTo.removeAttribute("data-highcharts-chart");K(b);for(d=c.length;d--;)c[d]=c[d].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(d=e.length;d--;)e[d]=e[d].destroy();p("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "),
function(a){var c=b[a];c&&c.destroy&&(b[a]=c.destroy())});h&&(h.innerHTML="",K(h),k&&l(h));for(d in b)delete b[d]},isReadyToRender:function(){var a=this;return D||N!=N.top||"complete"===r.readyState?!0:(r.attachEvent("onreadystatechange",function(){r.detachEvent("onreadystatechange",a.firstRender);"complete"===r.readyState&&a.firstRender()}),!1)},firstRender:function(){var a=this,b=a.options;if(a.isReadyToRender()){a.getContainer();m(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();
a.getAxes();p(b.series||[],function(b){a.initSeries(b)});a.linkSeries();m(a,"beforeRender");h&&(a.pointer=new h(a,b));a.render();if(!a.renderer.imgCount&&a.onload)a.onload();a.cloneRenderTo(!0)}},onload:function(){p([this.callback].concat(this.callbacks),function(a){a&&void 0!==this.index&&a.apply(this,[this])},this);m(this,"load");m(this,"render");b(this.index)&&!1!==this.options.chart.reflow&&this.initReflow();this.onload=null}}})(L);(function(a){var B,A=a.each,H=a.extend,G=a.erase,r=a.fireEvent,
g=a.format,f=a.isArray,u=a.isNumber,l=a.pick,q=a.removeEvent;B=a.Point=function(){};B.prototype={init:function(a,b,f){this.series=a;this.color=a.color;this.applyOptions(b,f);a.options.colorByPoint?(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter],b=b.length,f=a.colorCounter,a.colorCounter++,a.colorCounter===b&&(a.colorCounter=0)):f=a.colorIndex;this.colorIndex=l(this.colorIndex,f);a.chart.pointCount++;return this},applyOptions:function(a,b){var d=this.series,f=d.options.pointValKey||
d.pointValKey;a=B.prototype.optionsToObject.call(this,a);H(this,a);this.options=this.options?H(this.options,a):a;a.group&&delete this.group;f&&(this.y=this[f]);this.isNull=l(this.isValid&&!this.isValid(),null===this.x||!u(this.y,!0));this.selected&&(this.state="select");"name"in this&&void 0===b&&d.xAxis&&d.xAxis.hasNames&&(this.x=d.xAxis.nameToX(this));void 0===this.x&&d&&(this.x=void 0===b?d.autoIncrement(this):b);return this},optionsToObject:function(a){var b={},d=this.series,g=d.options.keys,
l=g||d.pointArrayMap||["y"],m=l.length,c=0,n=0;if(u(a)||null===a)b[l[0]]=a;else if(f(a))for(!g&&a.length>m&&(d=typeof a[0],"string"===d?b.name=a[0]:"number"===d&&(b.x=a[0]),c++);n<m;)g&&void 0===a[c]||(b[l[n]]=a[c]),c++,n++;else"object"===typeof a&&(b=a,a.dataLabels&&(d._hasPointLabels=!0),a.marker&&(d._hasPointMarkers=!0));return b},getClassName:function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":
"")+(void 0!==this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")},getZone:function(){var a=this.series,b=a.zones,a=a.zoneAxis||"y",f=0,g;for(g=b[f];this[a]>=g.value;)g=b[++f];g&&g.color&&!this.options.color&&(this.color=g.color);return g},destroy:function(){var a=this.series.chart,b=a.hoverPoints,f;a.pointCount--;b&&(this.setState(),G(b,this),b.length||
(a.hoverPoints=null));if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)q(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(f in this)this[f]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],b,f=6;f--;)b=a[f],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,
point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,d=b.tooltipOptions,f=l(d.valueDecimals,""),q=d.valuePrefix||"",m=d.valueSuffix||"";A(b.pointArrayMap||["y"],function(b){b="{point."+b;if(q||m)a=a.replace(b+"}",q+b+"}"+m);a=a.replace(b+"}",b+":,."+f+"f}")});return g(a,{point:this,series:this.series})},firePointEvent:function(a,b,f){var d=this,g=this.series.options;(g.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&
this.importEvents();"click"===a&&g.allowPointSelect&&(f=function(a){d.select&&d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});r(this,a,b,f)},visible:!0}})(L);(function(a){var B=a.addEvent,A=a.animObject,H=a.arrayMax,G=a.arrayMin,r=a.correctFloat,g=a.Date,f=a.defaultOptions,u=a.defaultPlotOptions,l=a.defined,q=a.each,d=a.erase,b=a.extend,p=a.fireEvent,C=a.grep,t=a.isArray,m=a.isNumber,c=a.isString,n=a.merge,E=a.pick,z=a.removeEvent,e=a.splat,x=a.SVGElement,F=a.syncTimeout,w=a.win;a.Series=a.seriesType("line",
null,{lineWidth:2,allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{lineWidth:0,lineColor:"#ffffff",radius:4,states:{hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===this.y?"":a.numberFormat(this.y,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",
x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{hover:{lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3},{isCartesian:!0,pointClass:a.Point,sorted:!0,requireSorting:!0,directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],coll:"series",init:function(a,c){var e=this,h,d,k=a.series,f;e.chart=a;e.options=c=e.setOptions(c);e.linkedSeries=[];e.bindAxes();b(e,{name:c.name,state:"",visible:!1!==
c.visible,selected:!0===c.selected});d=c.events;for(h in d)B(e,h,d[h]);if(d&&d.click||c.point&&c.point.events&&c.point.events.click||c.allowPointSelect)a.runTrackerClick=!0;e.getColor();e.getSymbol();q(e.parallelArrays,function(a){e[a+"Data"]=[]});e.setData(c.data,!1);e.isCartesian&&(a.hasCartesianSeries=!0);k.length&&(f=k[k.length-1]);e._i=E(f&&f._i,-1)+1;a.orderSeries(this.insert(k))},insert:function(a){var b=this.options.index,c;if(m(b)){for(c=a.length;c--;)if(b>=E(a[c].options.index,a[c]._i)){a.splice(c+
1,0,this);break}-1===c&&a.unshift(this);c+=1}else a.push(this);return E(c,a.length-1)},bindAxes:function(){var b=this,c=b.options,e=b.chart,d;q(b.axisTypes||[],function(h){q(e[h],function(a){d=a.options;if(c[h]===d.index||void 0!==c[h]&&c[h]===d.id||void 0===c[h]&&0===d.index)b.insert(a.series),b[h]=a,a.isDirty=!0});b[h]||b.optionalAxis===h||a.error(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,e=arguments,h=m(b)?function(e){var h="y"===e&&c.toYData?c.toYData(a):a[e];c[e+"Data"][b]=
h}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(e,2))};q(c.parallelArrays,h)},autoIncrement:function(){var a=this.options,b=this.xIncrement,c,e=a.pointIntervalUnit,b=E(b,a.pointStart,0);this.pointInterval=c=E(this.pointInterval,a.pointInterval,1);e&&(a=new g(b),"day"===e?a=+a[g.hcSetDate](a[g.hcGetDate]()+c):"month"===e?a=+a[g.hcSetMonth](a[g.hcGetMonth]()+c):"year"===e&&(a=+a[g.hcSetFullYear](a[g.hcGetFullYear]()+c)),c=a-b);this.xIncrement=b+c;return b},setOptions:function(a){var b=
this.chart,c=b.options.plotOptions,b=b.userOptions||{},e=b.plotOptions||{},h=c[this.type];this.userOptions=a;c=n(h,c.series,a);this.tooltipOptions=n(f.tooltip,f.plotOptions[this.type].tooltip,b.tooltip,e.series&&e.series.tooltip,e[this.type]&&e[this.type].tooltip,a.tooltip);null===h.marker&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();!c.negativeColor&&!c.negativeFillColor||c.zones||a.push({value:c[this.zoneAxis+"Threshold"]||c.threshold||0,className:"highcharts-negative",
color:c.negativeColor,fillColor:c.negativeFillColor});a.length&&l(a[a.length-1].value)&&a.push({color:this.color,fillColor:this.fillColor});return c},getCyclic:function(a,b,c){var e,h=this.chart,d=this.userOptions,f=a+"Index",n=a+"Counter",m=c?c.length:E(h.options.chart[a+"Count"],h[a+"Count"]);b||(e=E(d[f],d["_"+f]),l(e)||(h.series.length||(h[n]=0),d["_"+f]=e=h[n]%m,h[n]+=1),c&&(b=c[e]));void 0!==e&&(this[f]=e);this[a]=b},getColor:function(){this.options.colorByPoint?this.options.color=null:this.getCyclic("color",
this.options.color||u[this.type].color,this.chart.options.colors)},getSymbol:function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)},drawLegendSymbol:a.LegendSymbolMixin.drawLineMarker,setData:function(b,e,d,f){var h=this,k=h.points,n=k&&k.length||0,g,p=h.options,y=h.chart,l=null,w=h.xAxis,x=p.turboThreshold,r=this.xData,z=this.yData,F=(g=h.pointArrayMap)&&g.length;b=b||[];g=b.length;e=E(e,!0);if(!1!==f&&g&&n===g&&!h.cropped&&!h.hasGroupedData&&h.visible)q(b,function(a,
b){k[b].update&&a!==p.data[b]&&k[b].update(a,!1,null,!1)});else{h.xIncrement=null;h.colorCounter=0;q(this.parallelArrays,function(a){h[a+"Data"].length=0});if(x&&g>x){for(d=0;null===l&&d<g;)l=b[d],d++;if(m(l))for(d=0;d<g;d++)r[d]=this.autoIncrement(),z[d]=b[d];else if(t(l))if(F)for(d=0;d<g;d++)l=b[d],r[d]=l[0],z[d]=l.slice(1,F+1);else for(d=0;d<g;d++)l=b[d],r[d]=l[0],z[d]=l[1];else a.error(12)}else for(d=0;d<g;d++)void 0!==b[d]&&(l={series:h},h.pointClass.prototype.applyOptions.apply(l,[b[d]]),h.updateParallelArrays(l,
d));c(z[0])&&a.error(14,!0);h.data=[];h.options.data=h.userOptions.data=b;for(d=n;d--;)k[d]&&k[d].destroy&&k[d].destroy();w&&(w.minRange=w.userMinRange);h.isDirty=y.isDirtyBox=!0;h.isDirtyData=!!k;d=!1}"point"===p.legendType&&(this.processData(),this.generatePoints());e&&y.redraw(d)},processData:function(b){var c=this.xData,e=this.yData,h=c.length,d;d=0;var k,f,n=this.xAxis,m,g=this.options;m=g.cropThreshold;var p=this.getExtremesFromAll||g.getExtremesFromAll,l=this.isCartesian,g=n&&n.val2lin,q=n&&
n.isLog,t,w;if(l&&!this.isDirty&&!n.isDirty&&!this.yAxis.isDirty&&!b)return!1;n&&(b=n.getExtremes(),t=b.min,w=b.max);if(l&&this.sorted&&!p&&(!m||h>m||this.forceCrop))if(c[h-1]<t||c[0]>w)c=[],e=[];else if(c[0]<t||c[h-1]>w)d=this.cropData(this.xData,this.yData,t,w),c=d.xData,e=d.yData,d=d.start,k=!0;for(m=c.length||1;--m;)h=q?g(c[m])-g(c[m-1]):c[m]-c[m-1],0<h&&(void 0===f||h<f)?f=h:0>h&&this.requireSorting&&a.error(15);this.cropped=k;this.cropStart=d;this.processedXData=c;this.processedYData=e;this.closestPointRange=
f},cropData:function(a,b,c,e){var h=a.length,d=0,f=h,n=E(this.cropShoulder,1),m;for(m=0;m<h;m++)if(a[m]>=c){d=Math.max(0,m-n);break}for(c=m;c<h;c++)if(a[c]>e){f=c+n;break}return{xData:a.slice(d,f),yData:b.slice(d,f),start:d,end:f}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,f=this.processedYData,k=this.pointClass,n=d.length,m=this.cropStart||0,g,p=this.hasGroupedData,l,q=[],t;b||p||(b=[],b.length=a.length,b=this.data=b);for(t=0;t<n;t++)g=m+t,p?(l=(new k).init(this,
[d[t]].concat(e(f[t]))),l.dataGroup=this.groupMap[t]):(l=b[g])||void 0===a[g]||(b[g]=l=(new k).init(this,a[g],d[t])),l.index=g,q[t]=l;if(b&&(n!==(c=b.length)||p))for(t=0;t<c;t++)t!==m||p||(t+=n),b[t]&&(b[t].destroyElements(),b[t].plotX=void 0);this.data=b;this.points=q},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,e,h=[],d=0;e=this.xAxis.getExtremes();var f=e.min,n=e.max,g,p,l,q;a=a||this.stackedYData||this.processedYData||[];e=a.length;for(q=0;q<e;q++)if(p=c[q],l=a[q],g=(m(l,!0)||
t(l))&&(!b.isLog||l.length||0<l),p=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(c[q+1]||p)>=f&&(c[q-1]||p)<=n,g&&p)if(g=l.length)for(;g--;)null!==l[g]&&(h[d++]=l[g]);else h[d++]=l;this.dataMin=G(h);this.dataMax=H(h)},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,b=a.stacking,c=this.xAxis,e=c.categories,d=this.yAxis,k=this.points,f=k.length,n=!!this.modifyValue,g=a.pointPlacement,p="between"===g||m(g),q=a.threshold,
t=a.startFromThreshold?q:0,w,x,z,F,u=Number.MAX_VALUE;"between"===g&&(g=.5);m(g)&&(g*=E(a.pointRange||c.pointRange));for(a=0;a<f;a++){var C=k[a],A=C.x,B=C.y;x=C.low;var H=b&&d.stacks[(this.negStacks&&B<(t?0:q)?"-":"")+this.stackKey],G;d.isLog&&null!==B&&0>=B&&(C.isNull=!0);C.plotX=w=r(Math.min(Math.max(-1E5,c.translate(A,0,0,0,1,g,"flags"===this.type)),1E5));b&&this.visible&&!C.isNull&&H&&H[A]&&(F=this.getStackIndicator(F,A,this.index),G=H[A],B=G.points[F.key],x=B[0],B=B[1],x===t&&F.key===H[A].base&&
(x=E(q,d.min)),d.isLog&&0>=x&&(x=null),C.total=C.stackTotal=G.total,C.percentage=G.total&&C.y/G.total*100,C.stackY=B,G.setOffset(this.pointXOffset||0,this.barW||0));C.yBottom=l(x)?d.translate(x,0,1,0,1):null;n&&(B=this.modifyValue(B,C));C.plotY=x="number"===typeof B&&Infinity!==B?Math.min(Math.max(-1E5,d.translate(B,0,1,0,1)),1E5):void 0;C.isInside=void 0!==x&&0<=x&&x<=d.len&&0<=w&&w<=c.len;C.clientX=p?r(c.translate(A,0,0,0,1,g)):w;C.negative=C.y<(q||0);C.category=e&&void 0!==e[C.x]?e[C.x]:C.x;C.isNull||
(void 0!==z&&(u=Math.min(u,Math.abs(w-z))),z=w);C.zone=this.zones.length&&C.getZone()}this.closestPointRangePx=u},getValidPoints:function(a,b){var c=this.chart;return C(a||this.points||[],function(a){return b&&!c.isInsidePlot(a.plotX,a.plotY,c.inverted)?!1:!a.isNull})},setClip:function(a){var b=this.chart,c=this.options,e=b.renderer,d=b.inverted,h=this.clipBox,f=h||b.clipBox,n=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,f.height,c.xAxis,c.yAxis].join(),m=b[n],g=b[n+"m"];m||(a&&(f.width=
0,b[n+"m"]=g=e.clipRect(-99,d?-b.plotLeft:-b.plotTop,99,d?b.chartWidth:b.chartHeight)),b[n]=m=e.clipRect(f),m.count={length:0});a&&!m.count[this.index]&&(m.count[this.index]=!0,m.count.length+=1);!1!==c.clip&&(this.group.clip(a||h?m:b.clipRect),this.markerGroup.clip(g),this.sharedClipKey=n);a||(m.count[this.index]&&(delete m.count[this.index],--m.count.length),0===m.count.length&&n&&b[n]&&(h||(b[n]=b[n].destroy()),b[n+"m"]&&(this.markerGroup.clip(),b[n+"m"]=b[n+"m"].destroy())))},animate:function(a){var b=
this.chart,c=A(this.options.animation),e;a?this.setClip(c):(e=this.sharedClipKey,(a=b[e])&&a.animate({width:b.plotSizeX},c),b[e+"m"]&&b[e+"m"].animate({width:b.plotSizeX+99},c),this.animate=null)},afterAnimate:function(){this.setClip();p(this,"afterAnimate")},drawPoints:function(){var a=this.points,b=this.chart,c,e,d,k,f=this.options.marker,n,g,p,l,q=this.markerGroup,t=E(f.enabled,this.xAxis.isRadial?!0:null,this.closestPointRangePx>2*f.radius);if(!1!==f.enabled||this._hasPointMarkers)for(e=0;e<a.length;e++)d=
a[e],c=d.plotY,k=d.graphic,n=d.marker||{},g=!!d.marker,p=t&&void 0===n.enabled||n.enabled,l=d.isInside,p&&m(c)&&null!==d.y?(c=E(n.symbol,this.symbol),d.hasImage=0===c.indexOf("url"),p=this.markerAttribs(d,d.selected&&"select"),k?k[l?"show":"hide"](!0).animate(p):l&&(0<p.width||d.hasImage)&&(d.graphic=k=b.renderer.symbol(c,p.x,p.y,p.width,p.height,g?n:f).add(q)),k&&k.attr(this.pointAttribs(d,d.selected&&"select")),k&&k.addClass(d.getClassName(),!0)):k&&(d.graphic=k.destroy())},markerAttribs:function(a,
b){var c=this.options.marker,e=a.marker||{},d=E(e.radius,c.radius);b&&(c=c.states[b],b=e.states&&e.states[b],d=E(b&&b.radius,c&&c.radius,d+(c&&c.radiusPlus||0)));a.hasImage&&(d=0);a={x:Math.floor(a.plotX)-d,y:a.plotY-d};d&&(a.width=a.height=2*d);return a},pointAttribs:function(a,b){var c=this.options.marker,e=a&&a.options,d=e&&e.marker||{},h=this.color,f=e&&e.color,n=a&&a.color,e=E(d.lineWidth,c.lineWidth);a=a&&a.zone&&a.zone.color;h=f||a||n||h;a=d.fillColor||c.fillColor||h;h=d.lineColor||c.lineColor||
h;b&&(c=c.states[b],b=d.states&&d.states[b]||{},e=E(b.lineWidth,c.lineWidth,e+E(b.lineWidthPlus,c.lineWidthPlus,0)),a=b.fillColor||c.fillColor||a,h=b.lineColor||c.lineColor||h);return{stroke:h,"stroke-width":e,fill:a}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(w.navigator.userAgent),e,f=a.data||[],k,n,m;p(a,"destroy");z(a);q(a.axisTypes||[],function(b){(m=a[b])&&m.series&&(d(m.series,a),m.isDirty=m.forceRedraw=!0)});a.legendItem&&a.chart.legend.destroyItem(a);for(e=f.length;e--;)(k=
f[e])&&k.destroy&&k.destroy();a.points=null;clearTimeout(a.animationTimeout);for(n in a)a[n]instanceof x&&!a[n].survive&&(e=c&&"group"===n?"hide":"destroy",a[n][e]());b.hoverSeries===a&&(b.hoverSeries=null);d(b.series,a);b.orderSeries();for(n in a)delete a[n]},getGraphPath:function(a,b,c){var e=this,d=e.options,h=d.step,f,n=[],m=[],g;a=a||e.points;(f=a.reversed)&&a.reverse();(h={right:1,center:2}[h]||h&&3)&&f&&(h=4-h);!d.connectNulls||b||c||(a=this.getValidPoints(a));q(a,function(f,k){var p=f.plotX,
q=f.plotY,t=a[k-1];(f.leftCliff||t&&t.rightCliff)&&!c&&(g=!0);f.isNull&&!l(b)&&0<k?g=!d.connectNulls:f.isNull&&!b?g=!0:(0===k||g?k=["M",f.plotX,f.plotY]:e.getPointSpline?k=e.getPointSpline(a,f,k):h?(k=1===h?["L",t.plotX,q]:2===h?["L",(t.plotX+p)/2,t.plotY,"L",(t.plotX+p)/2,q]:["L",p,t.plotY],k.push("L",p,q)):k=["L",p,q],m.push(f.x),h&&m.push(f.x),n.push.apply(n,k),g=!1)});n.xMap=m;return e.graphPath=n},drawGraph:function(){var a=this,b=this.options,c=(this.gappedPath||this.getGraphPath).call(this),
e=[["graph","highcharts-graph",b.lineColor||this.color,b.dashStyle]];q(this.zones,function(c,d){e.push(["zone-graph-"+d,"highcharts-graph highcharts-zone-graph-"+d+" "+(c.className||""),c.color||a.color,c.dashStyle||b.dashStyle])});q(e,function(e,d){var h=e[0],f=a[h];f?(f.endX=c.xMap,f.animate({d:c})):c.length&&(a[h]=a.chart.renderer.path(c).addClass(e[1]).attr({zIndex:1}).add(a.group),f={stroke:e[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},e[3]?f.dashstyle=e[3]:"square"!==b.linecap&&
(f["stroke-linecap"]=f["stroke-linejoin"]="round"),f=a[h].attr(f).shadow(2>d&&b.shadow));f&&(f.startX=c.xMap,f.isArea=c.isArea)})},applyZones:function(){var a=this,b=this.chart,c=b.renderer,e=this.zones,d,f,n=this.clips||[],m,g=this.graph,p=this.area,l=Math.max(b.chartWidth,b.chartHeight),t=this[(this.zoneAxis||"y")+"Axis"],w,x,r=b.inverted,z,F,u,C,A=!1;e.length&&(g||p)&&t&&void 0!==t.min&&(x=t.reversed,z=t.horiz,g&&g.hide(),p&&p.hide(),w=t.getExtremes(),q(e,function(e,h){d=x?z?b.plotWidth:0:z?0:
t.toPixels(w.min);d=Math.min(Math.max(E(f,d),0),l);f=Math.min(Math.max(Math.round(t.toPixels(E(e.value,w.max),!0)),0),l);A&&(d=f=t.toPixels(w.max));F=Math.abs(d-f);u=Math.min(d,f);C=Math.max(d,f);t.isXAxis?(m={x:r?C:u,y:0,width:F,height:l},z||(m.x=b.plotHeight-m.x)):(m={x:0,y:r?C:u,width:l,height:F},z&&(m.y=b.plotWidth-m.y));r&&c.isVML&&(m=t.isXAxis?{x:0,y:x?u:C,height:m.width,width:b.chartWidth}:{x:m.y-b.plotLeft-b.spacingBox.x,y:0,width:m.height,height:b.chartHeight});n[h]?n[h].animate(m):(n[h]=
c.clipRect(m),g&&a["zone-graph-"+h].clip(n[h]),p&&a["zone-area-"+h].clip(n[h]));A=e.value>w.max}),this.clips=n)},invertGroups:function(a){function b(){q(["group","markerGroup"],function(b){c[b]&&(c[b].width=c.yAxis.len,c[b].height=c.xAxis.len,c[b].invert(a))})}var c=this,e;c.xAxis&&(e=B(c.chart,"resize",b),B(c,"destroy",e),b(a),c.invertGroups=b)},plotGroup:function(a,b,c,e,d){var h=this[a],f=!h;f&&(this[a]=h=this.chart.renderer.g(b).attr({zIndex:e||.1}).add(d),h.addClass("highcharts-series-"+this.index+
" highcharts-"+this.type+"-series highcharts-color-"+this.colorIndex+" "+(this.options.className||"")));h.attr({visibility:c})[f?"attr":"animate"](this.getPlotBox());return h},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;a.inverted&&(b=c,c=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,e=a.options,d=!!a.animate&&b.renderer.isSVG&&A(e.animation).duration,f=a.visible?"inherit":"hidden",n=
e.zIndex,m=a.hasRendered,g=b.seriesGroup,p=b.inverted;c=a.plotGroup("group","series",f,n,g);a.markerGroup=a.plotGroup("markerGroup","markers",f,n,g);d&&a.animate(!0);c.inverted=a.isCartesian?p:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(p);!1===e.clip||a.sharedClipKey||m||c.clip(b.clipRect);d&&a.animate();m||(a.animationTimeout=F(function(){a.afterAnimate()},
d));a.isDirty=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,c=this.group,e=this.xAxis,d=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:E(e&&e.left,a.plotLeft),translateY:E(d&&d.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree},kdDimensions:1,kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,e=this.yAxis,d=this.chart.inverted;return this.searchKDTree({clientX:d?
c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:d?e.len-a.chartX+e.pos:a.chartY-e.pos},b)},buildKDTree:function(){function a(c,e,d){var h,f;if(f=c&&c.length)return h=b.kdAxisArray[e%d],c.sort(function(a,b){return a[h]-b[h]}),f=Math.floor(f/2),{point:c[f],left:a(c.slice(0,f),e+1,d),right:a(c.slice(f+1),e+1,d)}}this.buildingKdTree=!0;var b=this,c=b.kdDimensions;delete b.kdTree;F(function(){b.kdTree=a(b.getValidPoints(null,!b.directTouch),c,c);b.buildingKdTree=!1},b.options.kdNow?0:1)},searchKDTree:function(a,
b){function c(a,b,k,n){var m=b.point,g=e.kdAxisArray[k%n],p,t,q=m;t=l(a[d])&&l(m[d])?Math.pow(a[d]-m[d],2):null;p=l(a[h])&&l(m[h])?Math.pow(a[h]-m[h],2):null;p=(t||0)+(p||0);m.dist=l(p)?Math.sqrt(p):Number.MAX_VALUE;m.distX=l(t)?Math.sqrt(t):Number.MAX_VALUE;g=a[g]-m[g];p=0>g?"left":"right";t=0>g?"right":"left";b[p]&&(p=c(a,b[p],k+1,n),q=p[f]<q[f]?p:m);b[t]&&Math.sqrt(g*g)<q[f]&&(a=c(a,b[t],k+1,n),q=a[f]<q[f]?a:q);return q}var e=this,d=this.kdAxisArray[0],h=this.kdAxisArray[1],f=b?"distX":"dist";
this.kdTree||this.buildingKdTree||this.buildKDTree();if(this.kdTree)return c(a,this.kdTree,this.kdDimensions,this.kdDimensions)}})})(L);(function(a){function B(a,d,b,f,g){var p=a.chart.inverted;this.axis=a;this.isNegative=b;this.options=d;this.x=f;this.total=null;this.points={};this.stack=g;this.rightCliff=this.leftCliff=0;this.alignOptions={align:d.align||(p?b?"left":"right":"center"),verticalAlign:d.verticalAlign||(p?"middle":b?"bottom":"top"),y:l(d.y,p?4:b?14:-6),x:l(d.x,p?b?-6:6:0)};this.textAlign=
d.textAlign||(p?b?"right":"left":"center")}var A=a.Axis,H=a.Chart,G=a.correctFloat,r=a.defined,g=a.destroyObjectProperties,f=a.each,u=a.format,l=a.pick;a=a.Series;B.prototype={destroy:function(){g(this,this.axis)},render:function(a){var d=this.options,b=d.format,b=b?u(b,this):d.formatter.call(this);this.label?this.label.attr({text:b,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(b,null,null,d.useHTML).css(d.style).attr({align:this.textAlign,rotation:d.rotation,visibility:"hidden"}).add(a)},
setOffset:function(a,d){var b=this.axis,f=b.chart,g=f.inverted,l=b.reversed,l=this.isNegative&&!l||!this.isNegative&&l,m=b.translate(b.usePercentage?100:this.total,0,0,0,1),b=b.translate(0),b=Math.abs(m-b);a=f.xAxis[0].translate(this.x)+a;var c=f.plotHeight,g={x:g?l?m:m-b:a,y:g?c-a-d:l?c-m-b:c-m,width:g?b:d,height:g?d:b};if(d=this.label)d.align(this.alignOptions,null,g),g=d.alignAttr,d[!1===this.options.crop||f.isInsidePlot(g.x,g.y)?"show":"hide"](!0)}};H.prototype.getStacks=function(){var a=this;
f(a.yAxis,function(a){a.stacks&&a.hasVisibleSeries&&(a.oldStacks=a.stacks)});f(a.series,function(d){!d.options.stacking||!0!==d.visible&&!1!==a.options.chart.ignoreHiddenSeries||(d.stackKey=d.type+l(d.options.stack,""))})};A.prototype.buildStacks=function(){var a=this.series,d,b=l(this.options.reversedStacks,!0),f=a.length,g;if(!this.isXAxis){this.usePercentage=!1;for(g=f;g--;)a[b?g:f-g-1].setStackedPoints();for(g=f;g--;)d=a[b?g:f-g-1],d.setStackCliffs&&d.setStackCliffs();if(this.usePercentage)for(g=
0;g<f;g++)a[g].setPercentStacks()}};A.prototype.renderStackTotals=function(){var a=this.chart,d=a.renderer,b=this.stacks,f,g,l=this.stackTotalGroup;l||(this.stackTotalGroup=l=d.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());l.translate(a.plotLeft,a.plotTop);for(f in b)for(g in a=b[f],a)a[g].render(l)};A.prototype.resetStacks=function(){var a=this.stacks,d,b;if(!this.isXAxis)for(d in a)for(b in a[d])a[d][b].touched<this.stacksTouched?(a[d][b].destroy(),delete a[d][b]):(a[d][b].total=
null,a[d][b].cum=null)};A.prototype.cleanStacks=function(){var a,d,b;if(!this.isXAxis)for(d in this.oldStacks&&(a=this.stacks=this.oldStacks),a)for(b in a[d])a[d][b].cum=a[d][b].total};a.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var a=this.processedXData,d=this.processedYData,b=[],f=d.length,g=this.options,t=g.threshold,m=g.startFromThreshold?t:0,c=g.stack,g=g.stacking,n=this.stackKey,u="-"+n,z=this.negStacks,
e=this.yAxis,x=e.stacks,F=e.oldStacks,w,h,y,A,K,I,k;e.stacksTouched+=1;for(K=0;K<f;K++)I=a[K],k=d[K],w=this.getStackIndicator(w,I,this.index),A=w.key,y=(h=z&&k<(m?0:t))?u:n,x[y]||(x[y]={}),x[y][I]||(F[y]&&F[y][I]?(x[y][I]=F[y][I],x[y][I].total=null):x[y][I]=new B(e,e.options.stackLabels,h,I,c)),y=x[y][I],null!==k&&(y.points[A]=y.points[this.index]=[l(y.cum,m)],r(y.cum)||(y.base=A),y.touched=e.stacksTouched,0<w.index&&!1===this.singleStacks&&(y.points[A][0]=y.points[this.index+","+I+",0"][0])),"percent"===
g?(h=h?n:u,z&&x[h]&&x[h][I]?(h=x[h][I],y.total=h.total=Math.max(h.total,y.total)+Math.abs(k)||0):y.total=G(y.total+(Math.abs(k)||0))):y.total=G(y.total+(k||0)),y.cum=l(y.cum,m)+(k||0),null!==k&&(y.points[A].push(y.cum),b[K]=y.cum);"percent"===g&&(e.usePercentage=!0);this.stackedYData=b;e.oldStacks={}}};a.prototype.setPercentStacks=function(){var a=this,d=a.stackKey,b=a.yAxis.stacks,g=a.processedXData,l;f([d,"-"+d],function(d){for(var f=g.length,c,n;f--;)if(c=g[f],l=a.getStackIndicator(l,c,a.index,
d),c=(n=b[d]&&b[d][c])&&n.points[l.key])n=n.total?100/n.total:0,c[0]=G(c[0]*n),c[1]=G(c[1]*n),a.stackedYData[f]=c[1]})};a.prototype.getStackIndicator=function(a,d,b,f){!r(a)||a.x!==d||f&&a.key!==f?a={x:d,index:0,key:f}:a.index++;a.key=[b,d,a.index].join();return a}})(L);(function(a){var B=a.addEvent,A=a.animate,H=a.Axis,G=a.createElement,r=a.css,g=a.defined,f=a.each,u=a.erase,l=a.extend,q=a.fireEvent,d=a.inArray,b=a.isNumber,p=a.isObject,C=a.merge,t=a.pick,m=a.Point,c=a.Series,n=a.seriesTypes,E=a.setAnimation,
z=a.splat;l(a.Chart.prototype,{addSeries:function(a,b,c){var e,d=this;a&&(b=t(b,!0),q(d,"addSeries",{options:a},function(){e=d.initSeries(a);d.isDirtyLegend=!0;d.linkSeries();b&&d.redraw(c)}));return e},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;a=C(a,{index:this[e].length,isX:b});new H(this,a);f[e]=z(f[e]||{});f[e].push(a);t(c,!0)&&this.redraw(d)},showLoading:function(a){var b=this,c=b.options,e=b.loadingDiv,d=c.loading,f=function(){e&&r(e,{left:b.plotLeft+"px",top:b.plotTop+
"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};e||(b.loadingDiv=e=G("div",{className:"highcharts-loading highcharts-loading-hidden"},null,b.container),b.loadingSpan=G("span",{className:"highcharts-loading-inner"},null,e),B(b,"redraw",f));e.className="highcharts-loading";b.loadingSpan.innerHTML=a||c.lang.loading;r(e,l(d.style,{zIndex:10}));r(b.loadingSpan,d.labelStyle);b.loadingShown||(r(e,{opacity:0,display:""}),A(e,{opacity:d.style.opacity||.5},{duration:d.showDuration||0}));b.loadingShown=
!0;f()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&(b.className="highcharts-loading highcharts-loading-hidden",A(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){r(b,{display:"none"})}}));this.loadingShown=!1},propsRequireDirtyBox:"backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions".split(" "),update:function(a,c){var e,n={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle"},h=a.chart,m,p;if(h){C(!0,this.options.chart,h);"className"in h&&this.setClassName(h.className);if("inverted"in h||"polar"in h)this.propFromSeries(),m=!0;for(e in h)h.hasOwnProperty(e)&&(-1!==d("chart."+e,this.propsRequireUpdateSeries)&&(p=!0),-1!==d(e,this.propsRequireDirtyBox)&&(this.isDirtyBox=
!0));"style"in h&&this.renderer.setStyle(h.style)}for(e in a){if(this[e]&&"function"===typeof this[e].update)this[e].update(a[e],!1);else if("function"===typeof this[n[e]])this[n[e]](a[e]);"chart"!==e&&-1!==d(e,this.propsRequireUpdateSeries)&&(p=!0)}a.colors&&(this.options.colors=a.colors);a.plotOptions&&C(!0,this.options.plotOptions,a.plotOptions);f(["xAxis","yAxis","series"],function(b){a[b]&&f(z(a[b]),function(a,c){(c=g(a.id)&&this.get(a.id)||this[b][c])&&c.coll===b&&c.update(a,!1)},this)},this);
m&&f(this.axes,function(a){a.update({},!1)});p&&f(this.series,function(a){a.update({},!1)});a.loading&&C(!0,this.options.loading,a.loading);e=h&&h.width;h=h&&h.height;b(e)&&e!==this.chartWidth||b(h)&&h!==this.chartHeight?this.setSize(e,h):t(c,!0)&&this.redraw()},setSubtitle:function(a){this.setTitle(void 0,a)}});l(m.prototype,{update:function(a,b,c,d){function e(){f.applyOptions(a);null===f.y&&n&&(f.graphic=n.destroy());p(a,!0)&&(n&&n.element&&a&&a.marker&&a.marker.symbol&&(f.graphic=n.destroy()),
a&&a.dataLabels&&f.dataLabel&&(f.dataLabel=f.dataLabel.destroy()));m=f.index;g.updateParallelArrays(f,m);l.data[m]=p(l.data[m],!0)?f.options:a;g.isDirty=g.isDirtyData=!0;!g.fixedBox&&g.hasCartesianSeries&&(k.isDirtyBox=!0);"point"===l.legendType&&(k.isDirtyLegend=!0);b&&k.redraw(c)}var f=this,g=f.series,n=f.graphic,m,k=g.chart,l=g.options;b=t(b,!0);!1===d?e():f.firePointEvent("update",{options:a},e)},remove:function(a,b){this.series.removePoint(d(this,this.series.data),a,b)}});l(c.prototype,{addPoint:function(a,
b,c,d){var e=this.options,f=this.data,g=this.chart,n=this.xAxis,n=n&&n.hasNames&&n.names,m=e.data,k,p,l=this.xData,q,w;b=t(b,!0);k={series:this};this.pointClass.prototype.applyOptions.apply(k,[a]);w=k.x;q=l.length;if(this.requireSorting&&w<l[q-1])for(p=!0;q&&l[q-1]>w;)q--;this.updateParallelArrays(k,"splice",q,0,0);this.updateParallelArrays(k,q);n&&k.name&&(n[w]=k.name);m.splice(q,0,a);p&&(this.data.splice(q,0,null),this.processData());"point"===e.legendType&&this.generatePoints();c&&(f[0]&&f[0].remove?
f[0].remove(!1):(f.shift(),this.updateParallelArrays(k,"shift"),m.shift()));this.isDirtyData=this.isDirty=!0;b&&g.redraw(d)},removePoint:function(a,b,c){var e=this,d=e.data,f=d[a],g=e.points,n=e.chart,m=function(){g&&g.length===d.length&&g.splice(a,1);d.splice(a,1);e.options.data.splice(a,1);e.updateParallelArrays(f||{series:e},"splice",a,1);f&&f.destroy();e.isDirty=!0;e.isDirtyData=!0;b&&n.redraw()};E(c,n);b=t(b,!0);f?f.firePointEvent("remove",null,m):m()},remove:function(a,b,c){function e(){d.destroy();
f.isDirtyLegend=f.isDirtyBox=!0;f.linkSeries();t(a,!0)&&f.redraw(b)}var d=this,f=d.chart;!1!==c?q(d,"remove",null,e):e()},update:function(a,b){var c=this,e=this.chart,d=this.userOptions,g=this.type,m=a.type||d.type||e.options.chart.type,p=n[g].prototype,q=["group","markerGroup","dataLabelsGroup"],k;if(m&&m!==g||void 0!==a.zIndex)q.length=0;f(q,function(a){q[a]=c[a];delete c[a]});a=C(d,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1,null,!1);for(k in p)this[k]=
void 0;l(this,n[m||g].prototype);f(q,function(a){c[a]=q[a]});this.init(e,a);e.linkSeries();t(b,!0)&&e.redraw(!1)}});l(H.prototype,{update:function(a,b){var c=this.chart;a=c.options[this.coll][this.options.index]=C(this.userOptions,a);this.destroy(!0);this.init(c,l(a,{events:void 0}));c.isDirtyBox=!0;t(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,e=this.series,d=e.length;d--;)e[d]&&e[d].remove(!1);u(b.axes,this);u(b[c],this);b.options[c].splice(this.options.index,1);f(b[c],
function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;t(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}})})(L);(function(a){var B=a.color,A=a.each,H=a.map,G=a.pick,r=a.Series,g=a.seriesType;g("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(){var a=[],g=[],l=this.xAxis,q=this.yAxis,d=q.stacks[this.stackKey],b={},p=this.points,r=this.index,t=q.series,m=t.length,c,n=G(q.options.reversedStacks,
!0)?1:-1,E,z;if(this.options.stacking){for(E=0;E<p.length;E++)b[p[E].x]=p[E];for(z in d)null!==d[z].total&&g.push(z);g.sort(function(a,b){return a-b});c=H(t,function(){return this.visible});A(g,function(e,f){var p=0,t,h;if(b[e]&&!b[e].isNull)a.push(b[e]),A([-1,1],function(a){var p=1===a?"rightNull":"leftNull",l=0,q=d[g[f+a]];if(q)for(E=r;0<=E&&E<m;)t=q.points[E],t||(E===r?b[e][p]=!0:c[E]&&(h=d[e].points[E])&&(l-=h[1]-h[0])),E+=n;b[e][1===a?"rightCliff":"leftCliff"]=l});else{for(E=r;0<=E&&E<m;){if(t=
d[e].points[E]){p=t[1];break}E+=n}p=q.toPixels(p,!0);a.push({isNull:!0,plotX:l.toPixels(e,!0),plotY:p,yBottom:p})}})}return a},getGraphPath:function(a){var f=r.prototype.getGraphPath,g=this.options,q=g.stacking,d=this.yAxis,b,p,C=[],t=[],m=this.index,c,n=d.stacks[this.stackKey],E=g.threshold,z=d.getThreshold(g.threshold),e,g=g.connectNulls||"percent"===q,x=function(b,e,f){var h=a[b];b=q&&n[h.x].points[m];var g=h[f+"Null"]||0;f=h[f+"Cliff"]||0;var p,l,h=!0;f||g?(p=(g?b[0]:b[1])+f,l=b[0]+f,h=!!g):!q&&
a[e]&&a[e].isNull&&(p=l=E);void 0!==p&&(t.push({plotX:c,plotY:null===p?z:d.getThreshold(p),isNull:h}),C.push({plotX:c,plotY:null===l?z:d.getThreshold(l),doCurve:!1}))};a=a||this.points;q&&(a=this.getStackPoints());for(b=0;b<a.length;b++)if(p=a[b].isNull,c=G(a[b].rectPlotX,a[b].plotX),e=G(a[b].yBottom,z),!p||g)g||x(b,b-1,"left"),p&&!q&&g||(t.push(a[b]),C.push({x:b,plotX:c,plotY:e})),g||x(b,b+1,"right");b=f.call(this,t,!0,!0);C.reversed=!0;p=f.call(this,C,!0,!0);p.length&&(p[0]="L");p=b.concat(p);f=
f.call(this,t,!1,g);p.xMap=b.xMap;this.areaPath=p;return f},drawGraph:function(){this.areaPath=[];r.prototype.drawGraph.apply(this);var a=this,g=this.areaPath,l=this.options,q=[["area","highcharts-area",this.color,l.fillColor]];A(this.zones,function(d,b){q.push(["zone-area-"+b,"highcharts-area highcharts-zone-area-"+b+" "+d.className,d.color||a.color,d.fillColor||l.fillColor])});A(q,function(d){var b=d[0],f=a[b];f?(f.endX=g.xMap,f.animate({d:g})):(f=a[b]=a.chart.renderer.path(g).addClass(d[1]).attr({fill:G(d[3],
B(d[2]).setOpacity(G(l.fillOpacity,.75)).get()),zIndex:0}).add(a.group),f.isArea=!0);f.startX=g.xMap;f.shiftUnit=l.step?2:1})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(L);(function(a){var B=a.pick;a=a.seriesType;a("spline","line",{},{getPointSpline:function(a,H,G){var r=H.plotX,g=H.plotY,f=a[G-1];G=a[G+1];var u,l,q,d;if(f&&!f.isNull&&!1!==f.doCurve&&G&&!G.isNull&&!1!==G.doCurve){a=f.plotY;q=G.plotX;G=G.plotY;var b=0;u=(1.5*r+f.plotX)/2.5;l=(1.5*g+a)/2.5;q=(1.5*r+q)/2.5;d=(1.5*g+G)/2.5;
q!==u&&(b=(d-l)*(q-r)/(q-u)+g-d);l+=b;d+=b;l>a&&l>g?(l=Math.max(a,g),d=2*g-l):l<a&&l<g&&(l=Math.min(a,g),d=2*g-l);d>G&&d>g?(d=Math.max(G,g),l=2*g-d):d<G&&d<g&&(d=Math.min(G,g),l=2*g-d);H.rightContX=q;H.rightContY=d}H=["C",B(f.rightContX,f.plotX),B(f.rightContY,f.plotY),B(u,r),B(l,g),r,g];f.rightContX=f.rightContY=null;return H}})})(L);(function(a){var B=a.seriesTypes.area.prototype,A=a.seriesType;A("areaspline","spline",a.defaultPlotOptions.area,{getStackPoints:B.getStackPoints,getGraphPath:B.getGraphPath,
setStackCliffs:B.setStackCliffs,drawGraph:B.drawGraph,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(L);(function(a){var B=a.animObject,A=a.color,H=a.each,G=a.extend,r=a.isNumber,g=a.merge,f=a.pick,u=a.Series,l=a.seriesType,q=a.svg;l("column","line",{borderRadius:0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1,shadow:!1},select:{color:"#cccccc",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,
y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){u.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&H(b.series,function(b){b.type===a.type&&(b.isDirty=!0)})},getColumnMetrics:function(){var a=this,b=a.options,g=a.xAxis,l=a.yAxis,t=g.reversed,m,c={},n=0;!1===b.grouping?n=1:H(a.chart.series,function(b){var e=
b.options,d=b.yAxis,f;b.type===a.type&&b.visible&&l.len===d.len&&l.pos===d.pos&&(e.stacking?(m=b.stackKey,void 0===c[m]&&(c[m]=n++),f=c[m]):!1!==e.grouping&&(f=n++),b.columnIndex=f)});var q=Math.min(Math.abs(g.transA)*(g.ordinalSlope||b.pointRange||g.closestPointRange||g.tickInterval||1),g.len),r=q*b.groupPadding,e=(q-2*r)/(n||1),b=Math.min(b.maxPointWidth||g.len,f(b.pointWidth,e*(1-2*b.pointPadding)));a.columnMetrics={width:b,offset:(e-b)/2+(r+((a.columnIndex||0)+(t?1:0))*e-q/2)*(t?-1:1)};return a.columnMetrics},
crispCol:function(a,b,f,g){var d=this.chart,m=this.borderWidth,c=-(m%2?.5:0),m=m%2?.5:1;d.inverted&&d.renderer.isVML&&(m+=1);f=Math.round(a+f)+c;a=Math.round(a)+c;g=Math.round(b+g)+m;c=.5>=Math.abs(b)&&.5<g;b=Math.round(b)+m;g-=b;c&&g&&(--b,g+=1);return{x:a,y:b,width:f-a,height:g}},translate:function(){var a=this,b=a.chart,g=a.options,l=a.dense=2>a.closestPointRange*a.xAxis.transA,l=a.borderWidth=f(g.borderWidth,l?0:1),t=a.yAxis,m=a.translatedThreshold=t.getThreshold(g.threshold),c=f(g.minPointLength,
5),n=a.getColumnMetrics(),q=n.width,r=a.barW=Math.max(q,1+2*l),e=a.pointXOffset=n.offset;b.inverted&&(m-=.5);g.pointPadding&&(r=Math.ceil(r));u.prototype.translate.apply(a);H(a.points,function(d){var g=f(d.yBottom,m),n=999+Math.abs(g),n=Math.min(Math.max(-n,d.plotY),t.len+n),h=d.plotX+e,l=r,p=Math.min(n,g),z,x=Math.max(n,g)-p;Math.abs(x)<c&&c&&(x=c,z=!t.reversed&&!d.negative||t.reversed&&d.negative,p=Math.abs(p-m)>c?g-c:m-(z?c:0));d.barX=h;d.pointWidth=q;d.tooltipPos=b.inverted?[t.len+t.pos-b.plotLeft-
n,a.xAxis.len-h-l/2,x]:[h+l/2,n+t.pos-b.plotTop,x];d.shapeType="rect";d.shapeArgs=a.crispCol.apply(a,d.isNull?[d.plotX,t.len/2,0,0]:[h,p,l,x])})},getSymbol:a.noop,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")},pointAttribs:function(a,b){var d=this.options,f,g=this.pointAttrToOptions||{};f=g.stroke||"borderColor";var m=g["stroke-width"]||"borderWidth",c=a&&a.color||this.color,n=a[f]||d[f]||this.color||
c,l=a[m]||d[m]||this[m]||0,g=d.dashStyle;a&&this.zones.length&&(c=(c=a.getZone())&&c.color||a.options.color||this.color);b&&(a=d.states[b],b=a.brightness,c=a.color||void 0!==b&&A(c).brighten(a.brightness).get()||c,n=a[f]||n,l=a[m]||l,g=a.dashStyle||g);f={fill:c,stroke:n,"stroke-width":l};d.borderRadius&&(f.r=d.borderRadius);g&&(f.dashstyle=g);return f},drawPoints:function(){var a=this,b=this.chart,f=a.options,l=b.renderer,t=f.animationLimit||250,m;H(a.points,function(c){var d=c.graphic;if(r(c.plotY)&&
null!==c.y){m=c.shapeArgs;if(d)d[b.pointCount<t?"animate":"attr"](g(m));else c.graphic=d=l[c.shapeType](m).attr({"class":c.getClassName()}).add(c.group||a.group);d.attr(a.pointAttribs(c,c.selected&&"select")).shadow(f.shadow,null,f.stacking&&!f.borderRadius)}else d&&(c.graphic=d.destroy())})},animate:function(a){var b=this,d=this.yAxis,f=b.options,g=this.chart.inverted,m={};q&&(a?(m.scaleY=.001,a=Math.min(d.pos+d.len,Math.max(d.pos,d.toPixels(f.threshold))),g?m.translateX=a-d.len:m.translateY=a,b.group.attr(m)):
(m[g?"translateX":"translateY"]=d.pos,b.group.animate(m,G(B(b.options.animation),{step:function(a,d){b.group.attr({scaleY:Math.max(.001,d.pos)})}})),b.animate=null))},remove:function(){var a=this,b=a.chart;b.hasRendered&&H(b.series,function(b){b.type===a.type&&(b.isDirty=!0)});u.prototype.remove.apply(a,arguments)}})})(L);(function(a){a=a.seriesType;a("bar","column",null,{inverted:!0})})(L);(function(a){var B=a.Series;a=a.seriesType;a("scatter","line",{lineWidth:0,marker:{enabled:!0},tooltip:{headerFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 0.85em"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
pointFormat:"x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"}},{sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,kdDimensions:2,drawGraph:function(){this.options.lineWidth&&B.prototype.drawGraph.call(this)}})})(L);(function(a){var B=a.pick,A=a.relativeLength;a.CenteredSeriesMixin={getCenter:function(){var a=this.options,G=this.chart,r=2*(a.slicedOffset||0),g=G.plotWidth-2*r,G=G.plotHeight-
2*r,f=a.center,f=[B(f[0],"50%"),B(f[1],"50%"),a.size||"100%",a.innerSize||0],u=Math.min(g,G),l,q;for(l=0;4>l;++l)q=f[l],a=2>l||2===l&&/%$/.test(q),f[l]=A(q,[g,G,u,f[2]][l])+(a?r:0);f[3]>f[2]&&(f[3]=f[2]);return f}}})(L);(function(a){var B=a.addEvent,A=a.defined,H=a.each,G=a.extend,r=a.inArray,g=a.noop,f=a.pick,u=a.Point,l=a.Series,q=a.seriesType,d=a.setAnimation;q("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return null===this.y?
void 0:this.point.name},x:0},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,states:{hover:{brightness:.1,shadow:!1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:a.seriesTypes.column.prototype.pointAttribs,animate:function(a){var b=this,d=b.points,f=b.startAngleRad;a||(H(d,function(a){var c=
a.graphic,d=a.shapeArgs;c&&(c.attr({r:a.startR||b.center[3]/2,start:f,end:f}),c.animate({r:d.r,start:d.start,end:d.end},b.options.animation))}),b.animate=null)},updateTotals:function(){var a,d=0,f=this.points,g=f.length,m,c=this.options.ignoreHiddenPoint;for(a=0;a<g;a++)m=f[a],0>m.y&&(m.y=null),d+=c&&!m.visible?0:m.y;this.total=d;for(a=0;a<g;a++)m=f[a],m.percentage=0<d&&(m.visible||!c)?m.y/d*100:0,m.total=d},generatePoints:function(){l.prototype.generatePoints.call(this);this.updateTotals()},translate:function(a){this.generatePoints();
var b=0,d=this.options,g=d.slicedOffset,m=g+(d.borderWidth||0),c,n,l,q=d.startAngle||0,e=this.startAngleRad=Math.PI/180*(q-90),q=(this.endAngleRad=Math.PI/180*(f(d.endAngle,q+360)-90))-e,r=this.points,u=d.dataLabels.distance,d=d.ignoreHiddenPoint,w,h=r.length,y;a||(this.center=a=this.getCenter());this.getX=function(b,c){l=Math.asin(Math.min((b-a[1])/(a[2]/2+u),1));return a[0]+(c?-1:1)*Math.cos(l)*(a[2]/2+u)};for(w=0;w<h;w++){y=r[w];c=e+b*q;if(!d||y.visible)b+=y.percentage/100;n=e+b*q;y.shapeType=
"arc";y.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:Math.round(1E3*c)/1E3,end:Math.round(1E3*n)/1E3};l=(n+c)/2;l>1.5*Math.PI?l-=2*Math.PI:l<-Math.PI/2&&(l+=2*Math.PI);y.slicedTranslation={translateX:Math.round(Math.cos(l)*g),translateY:Math.round(Math.sin(l)*g)};c=Math.cos(l)*a[2]/2;n=Math.sin(l)*a[2]/2;y.tooltipPos=[a[0]+.7*c,a[1]+.7*n];y.half=l<-Math.PI/2||l>Math.PI/2?1:0;y.angle=l;m=Math.min(m,u/5);y.labelPos=[a[0]+c+Math.cos(l)*u,a[1]+n+Math.sin(l)*u,a[0]+c+Math.cos(l)*m,a[1]+n+Math.sin(l)*
m,a[0]+c,a[1]+n,0>u?"center":y.half?"right":"left",l]}},drawGraph:null,drawPoints:function(){var a=this,d=a.chart.renderer,f,g,m,c,n=a.options.shadow;n&&!a.shadowGroup&&(a.shadowGroup=d.g("shadow").add(a.group));H(a.points,function(b){if(null!==b.y){g=b.graphic;c=b.shapeArgs;f=b.sliced?b.slicedTranslation:{};var l=b.shadowGroup;n&&!l&&(l=b.shadowGroup=d.g("shadow").add(a.shadowGroup));l&&l.attr(f);m=a.pointAttribs(b,b.selected&&"select");g?g.setRadialReference(a.center).attr(m).animate(G(c,f)):(b.graphic=
g=d[b.shapeType](c).addClass(b.getClassName()).setRadialReference(a.center).attr(f).add(a.group),b.visible||g.attr({visibility:"hidden"}),g.attr(m).attr({"stroke-linejoin":"round"}).shadow(n,l))}})},searchPoint:g,sortByAngle:function(a,d){a.sort(function(a,b){return void 0!==a.angle&&(b.angle-a.angle)*d})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,getCenter:a.CenteredSeriesMixin.getCenter,getSymbol:g},{init:function(){u.prototype.init.apply(this,arguments);var a=this,d;a.name=f(a.name,"Slice");
d=function(b){a.slice("select"===b.type)};B(a,"select",d);B(a,"unselect",d);return a},setVisible:function(a,d){var b=this,g=b.series,m=g.chart,c=g.options.ignoreHiddenPoint;d=f(d,c);a!==b.visible&&(b.visible=b.options.visible=a=void 0===a?!b.visible:a,g.options.data[r(b,g.data)]=b.options,H(["graphic","dataLabel","connector","shadowGroup"],function(c){if(b[c])b[c][a?"show":"hide"](!0)}),b.legendItem&&m.legend.colorizeItem(b,a),a||"hover"!==b.state||b.setState(""),c&&(g.isDirty=!0),d&&m.redraw())},
slice:function(a,g,l){var b=this.series;d(l,b.chart);f(g,!0);this.sliced=this.options.sliced=a=A(a)?a:!this.sliced;b.options.data[r(this,b.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(b.x,b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}})})(L);(function(a){var B=
a.addEvent,A=a.arrayMax,H=a.defined,G=a.each,r=a.extend,g=a.format,f=a.map,u=a.merge,l=a.noop,q=a.pick,d=a.relativeLength,b=a.Series,p=a.seriesTypes,C=a.stableSort;a.distribute=function(a,b){function c(a,b){return a.target-b.target}var d,g=!0,m=a,e=[],l;l=0;for(d=a.length;d--;)l+=a[d].size;if(l>b){C(a,function(a,b){return(b.rank||0)-(a.rank||0)});for(l=d=0;l<=b;)l+=a[d].size,d++;e=a.splice(d-1,a.length)}C(a,c);for(a=f(a,function(a){return{size:a.size,targets:[a.target]}});g;){for(d=a.length;d--;)g=
a[d],l=(Math.min.apply(0,g.targets)+Math.max.apply(0,g.targets))/2,g.pos=Math.min(Math.max(0,l-g.size/2),b-g.size);d=a.length;for(g=!1;d--;)0<d&&a[d-1].pos+a[d-1].size>a[d].pos&&(a[d-1].size+=a[d].size,a[d-1].targets=a[d-1].targets.concat(a[d].targets),a[d-1].pos+a[d-1].size>b&&(a[d-1].pos=b-a[d-1].size),a.splice(d,1),g=!0)}d=0;G(a,function(a){var b=0;G(a.targets,function(){m[d].pos=a.pos+b;b+=m[d].size;d++})});m.push.apply(m,e);C(m,c)};b.prototype.drawDataLabels=function(){var a=this,b=a.options,
c=b.dataLabels,d=a.points,f,l,e=a.hasRendered||0,p,r,w=q(c.defer,!0),h=a.chart.renderer;if(c.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(c),r=a.plotGroup("dataLabelsGroup","data-labels",w&&!e?"hidden":"visible",c.zIndex||6),w&&(r.attr({opacity:+e}),e||B(a,"afterAnimate",function(){a.visible&&r.show(!0);r[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),l=c,G(d,function(e){var d,m=e.dataLabel,n,k,t,z=e.connector,w=!m,x;f=e.dlOptions||e.options&&e.options.dataLabels;
if(d=q(f&&f.enabled,l.enabled)&&null!==e.y)for(k in c=u(l,f),n=e.getLabelConfig(),p=c.format?g(c.format,n):c.formatter.call(n,c),x=c.style,t=c.rotation,x.color=q(c.color,x.color,a.color,"#000000"),"contrast"===x.color&&(x.color=c.inside||0>c.distance||b.stacking?h.getContrast(e.color||a.color):"#000000"),b.cursor&&(x.cursor=b.cursor),n={fill:c.backgroundColor,stroke:c.borderColor,"stroke-width":c.borderWidth,r:c.borderRadius||0,rotation:t,padding:c.padding,zIndex:1},n)void 0===n[k]&&delete n[k];!m||
d&&H(p)?d&&H(p)&&(m?n.text=p:(m=e.dataLabel=h[t?"text":"label"](p,0,-9999,c.shape,null,null,c.useHTML,null,"data-label"),m.addClass("highcharts-data-label-color-"+e.colorIndex+" "+(c.className||"")+(c.useHTML?"highcharts-tracker":""))),m.attr(n),m.css(x).shadow(c.shadow),m.added||m.add(r),a.alignDataLabel(e,m,c,null,w)):(e.dataLabel=m.destroy(),z&&(e.connector=z.destroy()))})};b.prototype.alignDataLabel=function(a,b,c,d,f){var g=this.chart,e=g.inverted,m=q(a.plotX,-9999),n=q(a.plotY,-9999),l=b.getBBox(),
h,p=c.rotation,t=c.align,u=this.visible&&(a.series.forceDL||g.isInsidePlot(m,Math.round(n),e)||d&&g.isInsidePlot(m,e?d.x+1:d.y+d.height-1,e)),E="justify"===q(c.overflow,"justify");u&&(h=c.style.fontSize,h=g.renderer.fontMetrics(h,b).b,d=r({x:e?g.plotWidth-n:m,y:Math.round(e?g.plotHeight-m:n),width:0,height:0},d),r(c,{width:l.width,height:l.height}),p?(E=!1,e=g.renderer.rotCorr(h,p),e={x:d.x+c.x+d.width/2+e.x,y:d.y+c.y+{top:0,middle:.5,bottom:1}[c.verticalAlign]*d.height},b[f?"attr":"animate"](e).attr({align:t}),
m=(p+720)%360,m=180<m&&360>m,"left"===t?e.y-=m?l.height:0:"center"===t?(e.x-=l.width/2,e.y-=l.height/2):"right"===t&&(e.x-=l.width,e.y-=m?0:l.height)):(b.align(c,null,d),e=b.alignAttr),E?this.justifyDataLabel(b,c,e,l,d,f):q(c.crop,!0)&&(u=g.isInsidePlot(e.x,e.y)&&g.isInsidePlot(e.x+l.width,e.y+l.height)),c.shape&&!p&&b.attr({anchorX:a.plotX,anchorY:a.plotY}));u||(b.attr({y:-9999}),b.placed=!1)};b.prototype.justifyDataLabel=function(a,b,c,d,f,g){var e=this.chart,m=b.align,n=b.verticalAlign,l,h,p=a.box?
0:a.padding||0;l=c.x+p;0>l&&("right"===m?b.align="left":b.x=-l,h=!0);l=c.x+d.width-p;l>e.plotWidth&&("left"===m?b.align="right":b.x=e.plotWidth-l,h=!0);l=c.y+p;0>l&&("bottom"===n?b.verticalAlign="top":b.y=-l,h=!0);l=c.y+d.height-p;l>e.plotHeight&&("top"===n?b.verticalAlign="bottom":b.y=e.plotHeight-l,h=!0);h&&(a.placed=!g,a.align(b,null,f))};p.pie&&(p.pie.prototype.drawDataLabels=function(){var d=this,g=d.data,c,l=d.chart,p=d.options.dataLabels,r=q(p.connectorPadding,10),e=q(p.connectorWidth,1),u=
l.plotWidth,F=l.plotHeight,w,h=p.distance,y=d.center,C=y[2]/2,B=y[1],H=0<h,k,D,L,N,S=[[],[]],O,v,M,Q,R=[0,0,0,0];d.visible&&(p.enabled||d._hasPointLabels)&&(b.prototype.drawDataLabels.apply(d),G(g,function(a){a.dataLabel&&a.visible&&(S[a.half].push(a),a.dataLabel._pos=null)}),G(S,function(b,e){var g,m,n=b.length,q,t,z;if(n)for(d.sortByAngle(b,e-.5),0<h&&(g=Math.max(0,B-C-h),m=Math.min(B+C+h,l.plotHeight),q=f(b,function(a){if(a.dataLabel)return z=a.dataLabel.getBBox().height||21,{target:a.labelPos[1]-
g+z/2,size:z,rank:a.y}}),a.distribute(q,m+z-g)),Q=0;Q<n;Q++)c=b[Q],L=c.labelPos,k=c.dataLabel,M=!1===c.visible?"hidden":"inherit",t=L[1],q?void 0===q[Q].pos?M="hidden":(N=q[Q].size,v=g+q[Q].pos):v=t,O=p.justify?y[0]+(e?-1:1)*(C+h):d.getX(v<g+2||v>m-2?t:v,e),k._attr={visibility:M,align:L[6]},k._pos={x:O+p.x+({left:r,right:-r}[L[6]]||0),y:v+p.y-10},L.x=O,L.y=v,null===d.options.size&&(D=k.width,O-D<r?R[3]=Math.max(Math.round(D-O+r),R[3]):O+D>u-r&&(R[1]=Math.max(Math.round(O+D-u+r),R[1])),0>v-N/2?R[0]=
Math.max(Math.round(-v+N/2),R[0]):v+N/2>F&&(R[2]=Math.max(Math.round(v+N/2-F),R[2])))}),0===A(R)||this.verifyDataLabelOverflow(R))&&(this.placeDataLabels(),H&&e&&G(this.points,function(a){var b;w=a.connector;if((k=a.dataLabel)&&k._pos&&a.visible){M=k._attr.visibility;if(b=!w)a.connector=w=l.renderer.path().addClass("highcharts-data-label-connector highcharts-color-"+a.colorIndex).add(d.dataLabelsGroup),w.attr({"stroke-width":e,stroke:p.connectorColor||a.color||"#666666"});w[b?"attr":"animate"]({d:d.connectorPath(a.labelPos)});
w.attr("visibility",M)}else w&&(a.connector=w.destroy())}))},p.pie.prototype.connectorPath=function(a){var b=a.x,c=a.y;return q(this.options.dataLabels.softConnector,!0)?["M",b+("left"===a[6]?5:-5),c,"C",b,c,2*a[2]-a[4],2*a[3]-a[5],a[2],a[3],"L",a[4],a[5]]:["M",b+("left"===a[6]?5:-5),c,"L",a[2],a[3],"L",a[4],a[5]]},p.pie.prototype.placeDataLabels=function(){G(this.points,function(a){var b=a.dataLabel;b&&a.visible&&((a=b._pos)?(b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-9999}))})},
p.pie.prototype.alignDataLabel=l,p.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,f=c.center,g=c.minSize||80,l,e;null!==f[0]?l=Math.max(b[2]-Math.max(a[1],a[3]),g):(l=Math.max(b[2]-a[1]-a[3],g),b[0]+=(a[3]-a[1])/2);null!==f[1]?l=Math.max(Math.min(l,b[2]-Math.max(a[0],a[2])),g):(l=Math.max(Math.min(l,b[2]-a[0]-a[2]),g),b[1]+=(a[0]-a[2])/2);l<b[2]?(b[2]=l,b[3]=Math.min(d(c.innerSize||0,l),l),this.translate(b),this.drawDataLabels&&this.drawDataLabels()):e=!0;return e});
p.column&&(p.column.prototype.alignDataLabel=function(a,d,c,f,g){var l=this.chart.inverted,e=a.series,m=a.dlBox||a.shapeArgs,n=q(a.below,a.plotY>q(this.translatedThreshold,e.yAxis.len)),p=q(c.inside,!!this.options.stacking);m&&(f=u(m),0>f.y&&(f.height+=f.y,f.y=0),m=f.y+f.height-e.yAxis.len,0<m&&(f.height-=m),l&&(f={x:e.yAxis.len-f.y-f.height,y:e.xAxis.len-f.x-f.width,width:f.height,height:f.width}),p||(l?(f.x+=n?0:f.width,f.width=0):(f.y+=n?f.height:0,f.height=0)));c.align=q(c.align,!l||p?"center":
n?"right":"left");c.verticalAlign=q(c.verticalAlign,l||p?"middle":n?"top":"bottom");b.prototype.alignDataLabel.call(this,a,d,c,f,g)})})(L);(function(a){var B=a.Chart,A=a.each,H=a.pick,G=a.addEvent;B.prototype.callbacks.push(function(a){function g(){var f=[];A(a.series,function(a){var g=a.options.dataLabels,q=a.dataLabelCollections||["dataLabel"];(g.enabled||a._hasPointLabels)&&!g.allowOverlap&&a.visible&&A(q,function(d){A(a.points,function(a){a[d]&&(a[d].labelrank=H(a.labelrank,a.shapeArgs&&a.shapeArgs.height),
f.push(a[d]))})})});a.hideOverlappingLabels(f)}g();G(a,"redraw",g)});B.prototype.hideOverlappingLabels=function(a){var g=a.length,f,r,l,q,d,b,p,C,t,m=function(a,b,d,f,e,g,l,m){return!(e>a+d||e+l<a||g>b+f||g+m<b)};for(r=0;r<g;r++)if(f=a[r])f.oldOpacity=f.opacity,f.newOpacity=1;a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(r=0;r<g;r++)for(l=a[r],f=r+1;f<g;++f)if(q=a[f],l&&q&&l.placed&&q.placed&&0!==l.newOpacity&&0!==q.newOpacity&&(d=l.alignAttr,b=q.alignAttr,p=l.parentGroup,C=q.parentGroup,
t=2*(l.box?0:l.padding),d=m(d.x+p.translateX,d.y+p.translateY,l.width-t,l.height-t,b.x+C.translateX,b.y+C.translateY,q.width-t,q.height-t)))(l.labelrank<q.labelrank?l:q).newOpacity=0;A(a,function(a){var b,c;a&&(c=a.newOpacity,a.oldOpacity!==c&&a.placed&&(c?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=c,a[a.isOld?"animate":"attr"](a.alignAttr,null,b)),a.isOld=!0)})}})(L);(function(a){var B=a.addEvent,A=a.Chart,H=a.createElement,G=a.css,r=a.defaultOptions,g=a.defaultPlotOptions,f=a.each,u=
a.extend,l=a.fireEvent,q=a.hasTouch,d=a.inArray,b=a.isObject,p=a.Legend,C=a.merge,t=a.pick,m=a.Point,c=a.Series,n=a.seriesTypes,E=a.svg;a=a.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=function(a){for(var c=a.target,e;c&&!e;)e=c.point,c=c.parentNode;if(void 0!==e&&e!==b.hoverPoint)e.onMouseOver(a)};f(a.points,function(a){a.graphic&&(a.graphic.element.point=a);a.dataLabel&&(a.dataLabel.div?a.dataLabel.div.point=a:a.dataLabel.element.point=a)});a._hasTracking||(f(a.trackerGroups,
function(b){if(a[b]){a[b].addClass("highcharts-tracker").on("mouseover",d).on("mouseout",function(a){c.onTrackerMouseOut(a)});if(q)a[b].on("touchstart",d);a.options.cursor&&a[b].css(G).css({cursor:a.options.cursor})}}),a._hasTracking=!0)},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:a.graphPath),g=d.length,h=a.chart,l=h.pointer,m=h.renderer,n=h.options.tooltip.snap,p=a.tracker,k,r=function(){if(h.hoverSeries!==a)a.onMouseOver()},t="rgba(192,192,192,"+
(E?.0001:.002)+")";if(g&&!c)for(k=g+1;k--;)"M"===d[k]&&d.splice(k+1,0,d[k+1]-n,d[k+2],"L"),(k&&"M"===d[k]||k===g)&&d.splice(k,0,"L",d[k-2]+n,d[k-1]);p?p.attr({d:d}):a.graph&&(a.tracker=m.path(d).attr({"stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:t,fill:c?t:"none","stroke-width":a.graph.strokeWidth()+(c?0:2*n),zIndex:2}).add(a.group),f([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",r).on("mouseout",function(a){l.onTrackerMouseOut(a)});
b.cursor&&a.css({cursor:b.cursor});if(q)a.on("touchstart",r)}))}};n.column&&(n.column.prototype.drawTracker=a.drawTrackerPoint);n.pie&&(n.pie.prototype.drawTracker=a.drawTrackerPoint);n.scatter&&(n.scatter.prototype.drawTracker=a.drawTrackerPoint);u(p.prototype,{setItemEvents:function(a,b,c){var e=this,d=e.chart,f="highcharts-legend-"+(a.series?"point":"series")+"-active";(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");d.seriesGroup.addClass(f);b.css(e.options.itemHoverStyle)}).on("mouseout",
function(){b.css(a.visible?e.itemStyle:e.itemHiddenStyle);d.seriesGroup.removeClass(f);a.setState()}).on("click",function(b){var c=function(){a.setVisible&&a.setVisible()};b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):l(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=H("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);B(a.checkbox,"click",function(b){l(a.series||a,"checkboxClick",
{checked:b.target.checked,item:a},function(){a.select()})})}});r.legend.itemStyle.cursor="pointer";u(A.prototype,{showResetZoom:function(){var a=this,b=r.lang,c=a.options.chart.resetZoomButton,d=c.theme,f=d.states,g="chart"===c.relativeTo?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,f&&f.hover).attr({align:c.position.align,title:b.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(c.position,!1,g)},zoomOut:function(){var a=this;
l(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var c,d=this.pointer,g=!1,l;!a||a.resetSelection?f(this.axes,function(a){c=a.zoom()}):f(a.xAxis.concat(a.yAxis),function(a){var b=a.axis;d[b.isXAxis?"zoomX":"zoomY"]&&(c=b.zoom(a.min,a.max),b.displayBtn&&(g=!0))});l=this.resetZoomButton;g&&!l?this.showResetZoom():!g&&b(l)&&(this.resetZoomButton=l.destroy());c&&this.redraw(t(this.options.chart.animation,a&&a.animation,100>this.pointCount))},pan:function(a,b){var c=this,d=c.hoverPoints,
e;d&&f(d,function(a){a.setState()});f("xy"===b?[1,0]:[1],function(b){b=c[b?"xAxis":"yAxis"][0];var d=b.horiz,f=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",g=c[d],h=(b.pointRange||0)/2,k=b.getExtremes(),l=b.toValue(g-f,!0)+h,h=b.toValue(g+b.len-f,!0)-h,m=h<l,g=m?h:l,l=m?l:h,h=Math.min(k.dataMin,k.min)-g,k=l-Math.max(k.dataMax,k.max);b.series.length&&0>h&&0>k&&(b.setExtremes(g,l,!1,!1,{trigger:"pan"}),e=!0);c[d]=f});e&&c.redraw(!1);G(c.container,{cursor:"move"})}});u(m.prototype,{select:function(a,
b){var c=this,e=c.series,g=e.chart;a=t(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;e.options.data[d(c,e.data)]=c.options;c.setState(a&&"select");b||f(g.getSelectedPoints(),function(a){a.selected&&a!==c&&(a.selected=a.options.selected=!1,e.options.data[d(a,e.data)]=a.options,a.setState(""),a.firePointEvent("unselect"))})})},onMouseOver:function(a,b){var c=this.series,d=c.chart,e=d.tooltip,f=d.hoverPoint;if(this.series){if(!b){if(f&&
f!==this)f.onMouseOut();if(d.hoverSeries!==c)c.onMouseOver();d.hoverPoint=this}!e||e.shared&&!c.noSharedTooltip?e||this.setState("hover"):(this.setState("hover"),e.refresh(this,a));this.firePointEvent("mouseOver")}},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;this.firePointEvent("mouseOut");b&&-1!==d(this,b)||(this.setState(),a.hoverPoint=null)},importEvents:function(){if(!this.hasImportedEvents){var a=C(this.series.options.point,this.options).events,b;this.events=a;for(b in a)B(this,
b,a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=Math.floor(this.plotX),d=this.plotY,e=this.series,f=e.options.states[a]||{},l=g[e.type].marker&&e.options.marker,m=l&&!1===l.enabled,n=l&&l.states&&l.states[a]||{},p=!1===n.enabled,k=e.stateMarkerGraphic,q=this.marker||{},r=e.chart,z=e.halo,C,A=l&&e.markerAttribs;a=a||"";if(!(a===this.state&&!b||this.selected&&"select"!==a||!1===f.enabled||a&&(p||m&&!1===n.enabled)||a&&q.states&&q.states[a]&&!1===q.states[a].enabled)){A&&(C=e.markerAttribs(this,
a));if(this.graphic)this.state&&this.graphic.removeClass("highcharts-point-"+this.state),a&&this.graphic.addClass("highcharts-point-"+a),this.graphic.attr(e.pointAttribs(this,a)),C&&this.graphic.animate(C,t(r.options.chart.animation,n.animation,l.animation)),k&&k.hide();else{if(a&&n){l=q.symbol||e.symbol;k&&k.currentSymbol!==l&&(k=k.destroy());if(k)k[b?"animate":"attr"]({x:C.x,y:C.y});else l&&(e.stateMarkerGraphic=k=r.renderer.symbol(l,C.x,C.y,C.width,C.height).add(e.markerGroup),k.currentSymbol=
l);k&&k.attr(e.pointAttribs(this,a))}k&&(k[a&&r.isInsidePlot(c,d,r.inverted)?"show":"hide"](),k.element.point=this)}(c=f.halo)&&c.size?(z||(e.halo=z=r.renderer.path().add(A?e.markerGroup:e.group)),z[b?"animate":"attr"]({d:this.haloPath(c.size)}),z.attr({"class":"highcharts-halo highcharts-color-"+t(this.colorIndex,e.colorIndex)}),z.point=this,z.attr(u({fill:this.color||e.color,"fill-opacity":c.opacity,zIndex:-1},c.attributes))):z&&z.point&&z.point.haloPath&&z.animate({d:z.point.haloPath(0)});this.state=
a}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-a,this.plotY-a,2*a,2*a)}});u(c.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&l(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&l(this,"mouseOut");!c||a.stickyTracking||
c.shared&&!this.noSharedTooltip||c.hide();this.setState()},setState:function(a){var b=this,c=b.options,d=b.graph,g=c.states,h=c.lineWidth,c=0;a=a||"";if(b.state!==a&&(f([b.group,b.markerGroup],function(c){c&&(b.state&&c.removeClass("highcharts-series-"+b.state),a&&c.addClass("highcharts-series-"+a))}),b.state=a,!g[a]||!1!==g[a].enabled)&&(a&&(h=g[a].lineWidth||h+(g[a].lineWidthPlus||0)),d&&!d.dashstyle))for(g={"stroke-width":h},d.attr(g);b["zone-graph-"+c];)b["zone-graph-"+c].attr(g),c+=1},setVisible:function(a,
b){var c=this,d=c.chart,e=c.legendItem,g,m=d.options.chart.ignoreHiddenSeries,n=c.visible;g=(c.visible=a=c.options.visible=c.userOptions.visible=void 0===a?!n:a)?"show":"hide";f(["group","dataLabelsGroup","markerGroup","tracker","tt"],function(a){if(c[a])c[a][g]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&f(d.series,function(a){a.options.stacking&&a.visible&&(a.isDirty=!0)});f(c.linkedSeries,function(b){b.setVisible(a,
!1)});m&&(d.isDirtyBox=!0);!1!==b&&d.redraw();l(c,g)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=void 0===a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);l(this,a?"select":"unselect")},drawTracker:a.drawTrackerGraph})})(L);(function(a){var B=a.Chart,A=a.each,H=a.inArray,G=a.isObject,r=a.pick,g=a.splat;B.prototype.setResponsive=function(a){var f=this.options.responsive;f&&f.rules&&A(f.rules,function(f){this.matchResponsiveRule(f,
a)},this)};B.prototype.matchResponsiveRule=function(f,g){var l=this.respRules,q=f.condition,d;d=q.callback||function(){return this.chartWidth<=r(q.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=r(q.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=r(q.minWidth,0)&&this.chartHeight>=r(q.minHeight,0)};void 0===f._id&&(f._id=a.uniqueKey());d=d.call(this);!l[f._id]&&d?f.chartOptions&&(l[f._id]=this.currentOptions(f.chartOptions),this.update(f.chartOptions,g)):l[f._id]&&!d&&(this.update(l[f._id],g),delete l[f._id])};
B.prototype.currentOptions=function(a){function f(a,d,b,l){var p,q;for(p in a)if(!l&&-1<H(p,["series","xAxis","yAxis"]))for(a[p]=g(a[p]),b[p]=[],q=0;q<a[p].length;q++)b[p][q]={},f(a[p][q],d[p][q],b[p][q],l+1);else G(a[p])?(b[p]={},f(a[p],d[p]||{},b[p],l+1)):b[p]=d[p]||null}var l={};f(a,this.options,l,0);return l}})(L);return L});
/*
 Highcharts JS v5.0.7 (2017-01-17)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
*/
(function (F) { "object" === typeof module && module.exports ? module.exports = F : F(Highcharts) })(function (F) {
    (function (a) {
        var r = a.deg2rad, k = a.pick; a.perspective = function (n, m, u) {
            var p = m.options.chart.options3d, f = u ? m.inverted : !1, g = m.plotWidth / 2, q = m.plotHeight / 2, d = p.depth / 2, e = k(p.depth, 1) * k(p.viewDistance, 0), c = m.scale3d || 1, b = r * p.beta * (f ? -1 : 1), p = r * p.alpha * (f ? -1 : 1), h = Math.cos(p), w = Math.cos(-b), y = Math.sin(p), z = Math.sin(-b); u || (g += m.plotLeft, q += m.plotTop); return a.map(n, function (b) {
                var a, p; p = (f ? b.y : b.x) - g; var m = (f ?
                b.x : b.y) - q, k = (b.z || 0) - d; a = w * p - z * k; b = -y * z * p + h * m - w * y * k; p = h * z * p + y * m + h * w * k; m = 0 < e && e < Number.POSITIVE_INFINITY ? e / (p + d + e) : 1; a = a * m * c + g; b = b * m * c + q; return { x: f ? b : a, y: f ? a : b, z: p * c + d }
            })
        }; a.pointCameraDistance = function (a, m) { var n = m.options.chart.options3d, p = m.plotWidth / 2; m = m.plotHeight / 2; n = k(n.depth, 1) * k(n.viewDistance, 0) + n.depth; return Math.sqrt(Math.pow(p - a.plotX, 2) + Math.pow(m - a.plotY, 2) + Math.pow(n - a.plotZ, 2)) }
    })(F); (function (a) {
        function r(b) {
            var c = 0, l, x; for (l = 0; l < b.length; l++) x = (l + 1) % b.length, c += b[l].x * b[x].y -
            b[x].x * b[l].y; return c / 2
        } function k(b) { var c = 0, l; for (l = 0; l < b.length; l++) c += b[l].z; return b.length ? c / b.length : 0 } function n(b, c, l, x, a, h, d, e) {
            var D = [], f = h - a; return h > a && h - a > Math.PI / 2 + .0001 ? (D = D.concat(n(b, c, l, x, a, a + Math.PI / 2, d, e)), D = D.concat(n(b, c, l, x, a + Math.PI / 2, h, d, e))) : h < a && a - h > Math.PI / 2 + .0001 ? (D = D.concat(n(b, c, l, x, a, a - Math.PI / 2, d, e)), D = D.concat(n(b, c, l, x, a - Math.PI / 2, h, d, e))) : ["C", b + l * Math.cos(a) - l * t * f * Math.sin(a) + d, c + x * Math.sin(a) + x * t * f * Math.cos(a) + e, b + l * Math.cos(h) + l * t * f * Math.sin(h) + d, c + x * Math.sin(h) -
            x * t * f * Math.cos(h) + e, b + l * Math.cos(h) + d, c + x * Math.sin(h) + e]
        } var m = Math.cos, u = Math.PI, p = Math.sin, f = a.animObject, g = a.charts, q = a.color, d = a.defined, e = a.deg2rad, c = a.each, b = a.extend, h = a.inArray, w = a.map, y = a.merge, z = a.perspective, G = a.pick, B = a.SVGElement, H = a.SVGRenderer, C = a.wrap, t = 4 * (Math.sqrt(2) - 1) / 3 / (u / 2); H.prototype.toLinePath = function (b, a) { var h = []; c(b, function (b) { h.push("L", b.x, b.y) }); b.length && (h[0] = "M", a && h.push("Z")); return h }; H.prototype.cuboid = function (b) {
            var c = this.g(), h = c.destroy; b = this.cuboidPath(b);
            c.attr({ "stroke-linejoin": "round" }); c.front = this.path(b[0]).attr({ "class": "highcharts-3d-front", zIndex: b[3] }).add(c); c.top = this.path(b[1]).attr({ "class": "highcharts-3d-top", zIndex: b[4] }).add(c); c.side = this.path(b[2]).attr({ "class": "highcharts-3d-side", zIndex: b[5] }).add(c); c.fillSetter = function (b) { this.front.attr({ fill: b }); this.top.attr({ fill: q(b).brighten(.1).get() }); this.side.attr({ fill: q(b).brighten(-.1).get() }); this.color = b; return this }; c.opacitySetter = function (b) {
                this.front.attr({ opacity: b });
                this.top.attr({ opacity: b }); this.side.attr({ opacity: b }); return this
            }; c.attr = function (b) { if (b.shapeArgs || d(b.x)) b = this.renderer.cuboidPath(b.shapeArgs || b), this.front.attr({ d: b[0], zIndex: b[3] }), this.top.attr({ d: b[1], zIndex: b[4] }), this.side.attr({ d: b[2], zIndex: b[5] }); else return a.SVGElement.prototype.attr.call(this, b); return this }; c.animate = function (b, c, a) {
                d(b.x) && d(b.y) ? (b = this.renderer.cuboidPath(b), this.front.attr({ zIndex: b[3] }).animate({ d: b[0] }, c, a), this.top.attr({ zIndex: b[4] }).animate({ d: b[1] },
                c, a), this.side.attr({ zIndex: b[5] }).animate({ d: b[2] }, c, a), this.attr({ zIndex: -b[6] })) : b.opacity ? (this.front.animate(b, c, a), this.top.animate(b, c, a), this.side.animate(b, c, a)) : B.prototype.animate.call(this, b, c, a); return this
            }; c.destroy = function () { this.front.destroy(); this.top.destroy(); this.side.destroy(); return h.call(this) }; c.attr({ zIndex: -b[6] }); return c
        }; H.prototype.cuboidPath = function (b) {
            function c(b) { return q[b] } var a = b.x, h = b.y, d = b.z, e = b.height, D = b.width, f = b.depth, q = [{ x: a, y: h, z: d }, { x: a + D, y: h, z: d },
            { x: a + D, y: h + e, z: d }, { x: a, y: h + e, z: d }, { x: a, y: h + e, z: d + f }, { x: a + D, y: h + e, z: d + f }, { x: a + D, y: h, z: d + f }, { x: a, y: h, z: d + f }], q = z(q, g[this.chartIndex], b.insidePlotArea), d = function (b, a) { var h = []; b = w(b, c); a = w(a, c); 0 > r(b) ? h = b : 0 > r(a) && (h = a); return h }; b = d([3, 2, 1, 0], [7, 6, 5, 4]); a = [4, 5, 2, 3]; h = d([1, 6, 7, 0], a); d = d([1, 2, 5, 6], [0, 7, 4, 3]); return [this.toLinePath(b, !0), this.toLinePath(h, !0), this.toLinePath(d, !0), k(b), k(h), k(d), 9E9 * k(w(a, c))]
        }; a.SVGRenderer.prototype.arc3d = function (a) {
            function d(b) {
                var a = !1, c = {}, d; for (d in b) -1 !== h(d,
                p) && (c[d] = b[d], delete b[d], a = !0); return a ? c : !1
            } var l = this.g(), x = l.renderer, p = "x y r innerR start end".split(" "); a = y(a); a.alpha *= e; a.beta *= e; l.top = x.path(); l.side1 = x.path(); l.side2 = x.path(); l.inn = x.path(); l.out = x.path(); l.onAdd = function () { var b = l.parentGroup, a = l.attr("class"); l.top.add(l); c(["out", "inn", "side1", "side2"], function (c) { l[c].addClass(a + " highcharts-3d-side").add(b) }) }; l.setPaths = function (b) {
                var a = l.renderer.arc3dPath(b), c = 100 * a.zTop; l.attribs = b; l.top.attr({ d: a.top, zIndex: a.zTop }); l.inn.attr({
                    d: a.inn,
                    zIndex: a.zInn
                }); l.out.attr({ d: a.out, zIndex: a.zOut }); l.side1.attr({ d: a.side1, zIndex: a.zSide1 }); l.side2.attr({ d: a.side2, zIndex: a.zSide2 }); l.zIndex = c; l.attr({ zIndex: c }); b.center && (l.top.setRadialReference(b.center), delete b.center)
            }; l.setPaths(a); l.fillSetter = function (b) { var a = q(b).brighten(-.1).get(); this.fill = b; this.side1.attr({ fill: a }); this.side2.attr({ fill: a }); this.inn.attr({ fill: a }); this.out.attr({ fill: a }); this.top.attr({ fill: b }); return this }; c(["opacity", "translateX", "translateY", "visibility"],
            function (b) { l[b + "Setter"] = function (b, a) { l[a] = b; c(["out", "inn", "side1", "side2", "top"], function (c) { l[c].attr(a, b) }) } }); C(l, "attr", function (a, c) { var h; "object" === typeof c && (h = d(c)) && (b(l.attribs, h), l.setPaths(l.attribs)); return a.apply(this, [].slice.call(arguments, 1)) }); C(l, "animate", function (b, a, c, h) {
                var l, e = this.attribs, q; delete a.center; delete a.z; delete a.depth; delete a.alpha; delete a.beta; q = f(G(c, this.renderer.globalAnimation)); q.duration && (a = y(a), l = d(a), a.dummy = 1, l && (q.step = function (b, a) {
                    function c(b) {
                        return e[b] +
                        (G(l[b], e[b]) - e[b]) * a.pos
                    } "dummy" === a.prop && a.elem.setPaths(y(e, { x: c("x"), y: c("y"), r: c("r"), innerR: c("innerR"), start: c("start"), end: c("end") }))
                }), c = q); return b.call(this, a, c, h)
            }); l.destroy = function () { this.top.destroy(); this.out.destroy(); this.inn.destroy(); this.side1.destroy(); this.side2.destroy(); B.prototype.destroy.call(this) }; l.hide = function () { this.top.hide(); this.out.hide(); this.inn.hide(); this.side1.hide(); this.side2.hide() }; l.show = function () {
                this.top.show(); this.out.show(); this.inn.show(); this.side1.show();
                this.side2.show()
            }; return l
        }; H.prototype.arc3dPath = function (b) {
            function a(b) { b %= 2 * Math.PI; b > Math.PI && (b = 2 * Math.PI - b); return b } var c = b.x, h = b.y, d = b.start, e = b.end - .00001, f = b.r, q = b.innerR, w = b.depth, g = b.alpha, k = b.beta, y = Math.cos(d), r = Math.sin(d); b = Math.cos(e); var z = Math.sin(e), v = f * Math.cos(k), f = f * Math.cos(g), t = q * Math.cos(k), C = q * Math.cos(g), q = w * Math.sin(k), A = w * Math.sin(g), w = ["M", c + v * y, h + f * r], w = w.concat(n(c, h, v, f, d, e, 0, 0)), w = w.concat(["L", c + t * b, h + C * z]), w = w.concat(n(c, h, t, C, e, d, 0, 0)), w = w.concat(["Z"]), G =
            0 < k ? Math.PI / 2 : 0, k = 0 < g ? 0 : Math.PI / 2, G = d > -G ? d : e > -G ? -G : d, E = e < u - k ? e : d < u - k ? u - k : e, B = 2 * u - k, g = ["M", c + v * m(G), h + f * p(G)], g = g.concat(n(c, h, v, f, G, E, 0, 0)); e > B && d < B ? (g = g.concat(["L", c + v * m(E) + q, h + f * p(E) + A]), g = g.concat(n(c, h, v, f, E, B, q, A)), g = g.concat(["L", c + v * m(B), h + f * p(B)]), g = g.concat(n(c, h, v, f, B, e, 0, 0)), g = g.concat(["L", c + v * m(e) + q, h + f * p(e) + A]), g = g.concat(n(c, h, v, f, e, B, q, A)), g = g.concat(["L", c + v * m(B), h + f * p(B)]), g = g.concat(n(c, h, v, f, B, E, 0, 0))) : e > u - k && d < u - k && (g = g.concat(["L", c + v * Math.cos(E) + q, h + f * Math.sin(E) + A]), g = g.concat(n(c,
            h, v, f, E, e, q, A)), g = g.concat(["L", c + v * Math.cos(e), h + f * Math.sin(e)]), g = g.concat(n(c, h, v, f, e, E, 0, 0))); g = g.concat(["L", c + v * Math.cos(E) + q, h + f * Math.sin(E) + A]); g = g.concat(n(c, h, v, f, E, G, q, A)); g = g.concat(["Z"]); k = ["M", c + t * y, h + C * r]; k = k.concat(n(c, h, t, C, d, e, 0, 0)); k = k.concat(["L", c + t * Math.cos(e) + q, h + C * Math.sin(e) + A]); k = k.concat(n(c, h, t, C, e, d, q, A)); k = k.concat(["Z"]); y = ["M", c + v * y, h + f * r, "L", c + v * y + q, h + f * r + A, "L", c + t * y + q, h + C * r + A, "L", c + t * y, h + C * r, "Z"]; c = ["M", c + v * b, h + f * z, "L", c + v * b + q, h + f * z + A, "L", c + t * b + q, h + C * z + A, "L", c + t *
            b, h + C * z, "Z"]; z = Math.atan2(A, -q); h = Math.abs(e + z); b = Math.abs(d + z); d = Math.abs((d + e) / 2 + z); h = a(h); b = a(b); d = a(d); d *= 1E5; e = 1E5 * b; h *= 1E5; return { top: w, zTop: 1E5 * Math.PI + 1, out: g, zOut: Math.max(d, e, h), inn: k, zInn: Math.max(d, e, h), side1: y, zSide1: .99 * h, side2: c, zSide2: .99 * e }
        }
    })(F); (function (a) {
        function r(a, d) {
            var e = a.plotLeft, c = a.plotWidth + e, b = a.plotTop, h = a.plotHeight + b, f = e + a.plotWidth / 2, g = b + a.plotHeight / 2, q = Number.MAX_VALUE, k = -Number.MAX_VALUE, p = Number.MAX_VALUE, m = -Number.MAX_VALUE, r, t = 1; r = [{ x: e, y: b, z: 0 }, {
                x: e, y: b,
                z: d
            }]; n([0, 1], function (b) { r.push({ x: c, y: r[b].y, z: r[b].z }) }); n([0, 1, 2, 3], function (b) { r.push({ x: r[b].x, y: h, z: r[b].z }) }); r = u(r, a, !1); n(r, function (b) { q = Math.min(q, b.x); k = Math.max(k, b.x); p = Math.min(p, b.y); m = Math.max(m, b.y) }); e > q && (t = Math.min(t, 1 - Math.abs((e + f) / (q + f)) % 1)); c < k && (t = Math.min(t, (c - f) / (k - f))); b > p && (t = 0 > p ? Math.min(t, (b + g) / (-p + b + g)) : Math.min(t, 1 - (b + g) / (p + g) % 1)); h < m && (t = Math.min(t, Math.abs((h - g) / (m - g)))); return t
        } var k = a.Chart, n = a.each, m = a.merge, u = a.perspective, p = a.pick, f = a.wrap; k.prototype.is3d =
        function () { return this.options.chart.options3d && this.options.chart.options3d.enabled }; k.prototype.propsRequireDirtyBox.push("chart.options3d"); k.prototype.propsRequireUpdateSeries.push("chart.options3d"); a.wrap(a.Chart.prototype, "isInsidePlot", function (a) { return this.is3d() || a.apply(this, [].slice.call(arguments, 1)) }); var g = a.getOptions(); m(!0, g, { chart: { options3d: { enabled: !1, alpha: 0, beta: 0, depth: 100, fitToPlot: !0, viewDistance: 25, frame: { bottom: { size: 1 }, side: { size: 1 }, back: { size: 1 } } } } }); f(k.prototype,
        "setClassName", function (a) { a.apply(this, [].slice.call(arguments, 1)); this.is3d() && (this.container.className += " highcharts-3d-chart") }); a.wrap(a.Chart.prototype, "setChartSize", function (a) {
            var d = this.options.chart.options3d; a.apply(this, [].slice.call(arguments, 1)); if (this.is3d()) {
                var e = this.inverted, c = this.clipBox, b = this.margin; c[e ? "y" : "x"] = -(b[3] || 0); c[e ? "x" : "y"] = -(b[0] || 0); c[e ? "height" : "width"] = this.chartWidth + (b[3] || 0) + (b[1] || 0); c[e ? "width" : "height"] = this.chartHeight + (b[0] || 0) + (b[2] || 0); this.scale3d =
                1; !0 === d.fitToPlot && (this.scale3d = r(this, d.depth))
            }
        }); f(k.prototype, "redraw", function (a) { this.is3d() && (this.isDirtyBox = !0); a.apply(this, [].slice.call(arguments, 1)) }); f(k.prototype, "renderSeries", function (a) { var d = this.series.length; if (this.is3d()) for (; d--;) a = this.series[d], a.translate(), a.render(); else a.call(this) }); k.prototype.retrieveStacks = function (a) {
            var d = this.series, e = {}, c, b = 1; n(this.series, function (h) {
                c = p(h.options.stack, a ? 0 : d.length - 1 - h.index); e[c] ? e[c].series.push(h) : (e[c] = { series: [h], position: b },
                b++)
            }); e.totalStacks = b + 1; return e
        }
    })(F); (function (a) {
        var r, k = a.Axis, n = a.Chart, m = a.each, u = a.extend, p = a.merge, f = a.perspective, g = a.pick, q = a.splat, d = a.Tick, e = a.wrap; e(k.prototype, "setOptions", function (a, b) { a.call(this, b); this.chart.is3d() && (a = this.options, a.tickWidth = g(a.tickWidth, 0), a.gridLineWidth = g(a.gridLineWidth, 1)) }); e(k.prototype, "render", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var b = this.chart, c = b.renderer, d = b.options.chart.options3d, e = d.frame, f = e.bottom, g = e.back,
                e = e.side, k = d.depth, q = this.height, p = this.width, m = this.left, n = this.top; this.isZAxis || (this.horiz ? (g = { x: m, y: n + (b.xAxis[0].opposite ? -f.size : q), z: 0, width: p, height: f.size, depth: k, insidePlotArea: !1 }, this.bottomFrame ? this.bottomFrame.animate(g) : (this.bottomFrame = c.cuboid(g).attr({ "class": "highcharts-3d-frame highcharts-3d-frame-bottom", zIndex: b.yAxis[0].reversed && 0 < d.alpha ? 4 : -1 }).add(), this.bottomFrame.attr({ fill: f.color || "none", stroke: f.color || "none" }))) : (d = {
                    x: m + (b.yAxis[0].opposite ? 0 : -e.size), y: n + (b.xAxis[0].opposite ?
                    -f.size : 0), z: k, width: p + e.size, height: q + f.size, depth: g.size, insidePlotArea: !1
                }, this.backFrame ? this.backFrame.animate(d) : (this.backFrame = c.cuboid(d).attr({ "class": "highcharts-3d-frame highcharts-3d-frame-back", zIndex: -3 }).add(), this.backFrame.attr({ fill: g.color || "none", stroke: g.color || "none" })), b = { x: m + (b.yAxis[0].opposite ? p : -e.size), y: n + (b.xAxis[0].opposite ? -f.size : 0), z: 0, width: e.size, height: q + f.size, depth: k, insidePlotArea: !1 }, this.sideFrame ? this.sideFrame.animate(b) : (this.sideFrame = c.cuboid(b).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-side",
                    zIndex: -2
                }).add(), this.sideFrame.attr({ fill: e.color || "none", stroke: e.color || "none" }))))
            }
        }); e(k.prototype, "getPlotLinePath", function (a) {
            var b = a.apply(this, [].slice.call(arguments, 1)); if (!this.chart.is3d() || null === b) return b; var c = this.chart, d = c.options.chart.options3d, c = this.isZAxis ? c.plotWidth : d.depth, d = this.opposite; this.horiz && (d = !d); b = [this.swapZ({ x: b[1], y: b[2], z: d ? c : 0 }), this.swapZ({ x: b[1], y: b[2], z: c }), this.swapZ({ x: b[4], y: b[5], z: c }), this.swapZ({ x: b[4], y: b[5], z: d ? 0 : c })]; b = f(b, this.chart, !1); return b =
            this.chart.renderer.toLinePath(b, !1)
        }); e(k.prototype, "getLinePath", function (a) { return this.chart.is3d() ? [] : a.apply(this, [].slice.call(arguments, 1)) }); e(k.prototype, "getPlotBandPath", function (a) { if (!this.chart.is3d()) return a.apply(this, [].slice.call(arguments, 1)); var b = arguments, c = b[1], b = this.getPlotLinePath(b[2]); (c = this.getPlotLinePath(c)) && b ? c.push("L", b[10], b[11], "L", b[7], b[8], "L", b[4], b[5], "L", b[1], b[2]) : c = null; return c }); e(d.prototype, "getMarkPath", function (a) {
            var b = a.apply(this, [].slice.call(arguments,
            1)); if (!this.axis.chart.is3d()) return b; b = [this.axis.swapZ({ x: b[1], y: b[2], z: 0 }), this.axis.swapZ({ x: b[4], y: b[5], z: 0 })]; b = f(b, this.axis.chart, !1); return b = ["M", b[0].x, b[0].y, "L", b[1].x, b[1].y]
        }); e(d.prototype, "getLabelPosition", function (a) { var b = a.apply(this, [].slice.call(arguments, 1)); this.axis.chart.is3d() && (b = f([this.axis.swapZ({ x: b.x, y: b.y, z: 0 })], this.axis.chart, !1)[0]); return b }); a.wrap(k.prototype, "getTitlePosition", function (a) {
            var b = this.chart.is3d(), c, d; b && (d = this.axisTitleMargin, this.axisTitleMargin =
            0); c = a.apply(this, [].slice.call(arguments, 1)); b && (c = f([this.swapZ({ x: c.x, y: c.y, z: 0 })], this.chart, !1)[0], c[this.horiz ? "y" : "x"] += (this.horiz ? 1 : -1) * (this.opposite ? -1 : 1) * d, this.axisTitleMargin = d); return c
        }); e(k.prototype, "drawCrosshair", function (a) { var b = arguments; this.chart.is3d() && b[2] && (b[2] = { plotX: b[2].plotXold || b[2].plotX, plotY: b[2].plotYold || b[2].plotY }); a.apply(this, [].slice.call(b, 1)) }); e(k.prototype, "destroy", function (a) {
            m(["backFrame", "bottomFrame", "sideFrame"], function (b) {
                this[b] && (this[b] =
                this[b].destroy())
            }, this); a.apply(this, [].slice.call(arguments, 1))
        }); k.prototype.swapZ = function (a, b) { if (this.isZAxis) { b = b ? 0 : this.chart.plotLeft; var c = this.chart; return { x: b + (c.yAxis[0].opposite ? a.z : c.xAxis[0].width - a.z), y: a.y, z: a.x - b } } return a }; r = a.ZAxis = function () { this.isZAxis = !0; this.init.apply(this, arguments) }; u(r.prototype, k.prototype); u(r.prototype, {
            setOptions: function (a) { a = p({ offset: 0, lineWidth: 0 }, a); k.prototype.setOptions.call(this, a); this.coll = "zAxis" }, setAxisSize: function () {
                k.prototype.setAxisSize.call(this);
                this.width = this.len = this.chart.options.chart.options3d.depth; this.right = this.chart.chartWidth - this.width - this.left
            }, getSeriesExtremes: function () {
                var a = this, b = a.chart; a.hasVisibleSeries = !1; a.dataMin = a.dataMax = a.ignoreMinPadding = a.ignoreMaxPadding = null; a.buildStacks && a.buildStacks(); m(a.series, function (c) {
                    if (c.visible || !b.options.chart.ignoreHiddenSeries) a.hasVisibleSeries = !0, c = c.zData, c.length && (a.dataMin = Math.min(g(a.dataMin, c[0]), Math.min.apply(null, c)), a.dataMax = Math.max(g(a.dataMax, c[0]), Math.max.apply(null,
                    c)))
                })
            }
        }); e(n.prototype, "getAxes", function (a) { var b = this, c = this.options, c = c.zAxis = q(c.zAxis || {}); a.call(this); b.is3d() && (this.zAxis = [], m(c, function (a, c) { a.index = c; a.isX = !0; (new r(b, a)).setScale() })) })
    })(F); (function (a) {
        function r(a) { var d = a.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && (d.stroke = this.options.edgeColor || d.fill, d["stroke-width"] = u(this.options.edgeWidth, 1)); return d } function k(a) {
            if (this.chart.is3d()) {
                var d = this.chart.options.plotOptions.column.grouping; void 0 === d || d || void 0 ===
                this.group.zIndex || this.zIndexSet || (this.group.attr({ zIndex: 10 * this.group.zIndex }), this.zIndexSet = !0)
            } a.apply(this, [].slice.call(arguments, 1))
        } var n = a.each, m = a.perspective, u = a.pick, p = a.Series, f = a.seriesTypes, g = a.svg; a = a.wrap; a(f.column.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var d = this.chart, e = this.options, c = e.depth || 25, b = (e.stacking ? e.stack || 0 : this._i) * (c + (e.groupZPadding || 1)); !1 !== e.grouping && (b = 0); b += e.groupZPadding || 1; n(this.data, function (a) {
                    if (null !==
                    a.y) { var e = a.shapeArgs, h = a.tooltipPos; a.shapeType = "cuboid"; e.z = b; e.depth = c; e.insidePlotArea = !0; h = m([{ x: h[0], y: h[1], z: b }], d, !0)[0]; a.tooltipPos = [h.x, h.y] }
                }); this.z = b
            }
        }); a(f.column.prototype, "animate", function (a) {
            if (this.chart.is3d()) {
                var d = arguments[1], e = this.yAxis, c = this, b = this.yAxis.reversed; g && (d ? n(c.data, function (a) { null !== a.y && (a.height = a.shapeArgs.height, a.shapey = a.shapeArgs.y, a.shapeArgs.height = 1, b || (a.shapeArgs.y = a.stackY ? a.plotY + e.translate(a.stackY) : a.plotY + (a.negative ? -a.height : a.height))) }) :
                (n(c.data, function (a) { null !== a.y && (a.shapeArgs.height = a.height, a.shapeArgs.y = a.shapey, a.graphic && a.graphic.animate(a.shapeArgs, c.options.animation)) }), this.drawDataLabels(), c.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        }); a(f.column.prototype, "init", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var d = this.options, e = d.grouping, c = d.stacking, b = u(this.yAxis.options.reversedStacks, !0), f = 0; if (void 0 === e || e) {
                    e = this.chart.retrieveStacks(c); f = d.stack || 0; for (c = 0; c <
                    e[f].series.length && e[f].series[c] !== this; c++); f = 10 * (e.totalStacks - e[f].position) + (b ? c : -c); this.xAxis.reversed || (f = 10 * e.totalStacks - f)
                } d.zIndex = f
            }
        }); a(f.column.prototype, "pointAttribs", r); f.columnrange && a(f.columnrange.prototype, "pointAttribs", r); a(p.prototype, "alignDataLabel", function (a) { if (this.chart.is3d() && ("column" === this.type || "columnrange" === this.type)) { var d = arguments[4], e = { x: d.x, y: d.y, z: this.z }, e = m([e], this.chart, !0)[0]; d.x = e.x; d.y = e.y } a.apply(this, [].slice.call(arguments, 1)) }); f.columnrange &&
        a(f.columnrange.prototype, "drawPoints", k); a(f.column.prototype, "drawPoints", k)
    })(F); (function (a) {
        var r = a.deg2rad, k = a.each, n = a.pick, m = a.seriesTypes, u = a.svg; a = a.wrap; a(m.pie.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var f = this, g = f.options, p = g.depth || 0, d = f.chart.options.chart.options3d, e = d.alpha, c = d.beta, b = g.stacking ? (g.stack || 0) * p : f._i * p, b = b + p / 2; !1 !== g.grouping && (b = 0); k(f.data, function (a) {
                    var d = a.shapeArgs; a.shapeType = "arc3d"; d.z = b; d.depth = .75 *
                    p; d.alpha = e; d.beta = c; d.center = f.center; d = (d.end + d.start) / 2; a.slicedTranslation = { translateX: Math.round(Math.cos(d) * g.slicedOffset * Math.cos(e * r)), translateY: Math.round(Math.sin(d) * g.slicedOffset * Math.cos(e * r)) }
                })
            }
        }); a(m.pie.prototype.pointClass.prototype, "haloPath", function (a) { var f = arguments; return this.series.chart.is3d() ? [] : a.call(this, f[1]) }); a(m.pie.prototype, "pointAttribs", function (a, f, g) {
            a = a.call(this, f, g); g = this.options; this.chart.is3d() && (a.stroke = g.edgeColor || f.color || this.color, a["stroke-width"] =
            n(g.edgeWidth, 1)); return a
        }); a(m.pie.prototype, "drawPoints", function (a) { a.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && k(this.points, function (a) { var f = a.graphic; if (f) f[a.y && a.visible ? "show" : "hide"]() }) }); a(m.pie.prototype, "drawDataLabels", function (a) {
            if (this.chart.is3d()) {
                var f = this.chart.options.chart.options3d; k(this.data, function (a) {
                    var g = a.shapeArgs, d = g.r, e = (g.start + g.end) / 2, c = a.labelPos, b = -d * (1 - Math.cos((g.alpha || f.alpha) * r)) * Math.sin(e), h = d * (Math.cos((g.beta || f.beta) * r) - 1) * Math.cos(e);
                    k([0, 2, 4], function (a) { c[a] += h; c[a + 1] += b })
                })
            } a.apply(this, [].slice.call(arguments, 1))
        }); a(m.pie.prototype, "addPoint", function (a) { a.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && this.update(this.userOptions, !0) }); a(m.pie.prototype, "animate", function (a) {
            if (this.chart.is3d()) {
                var f = arguments[1], g = this.options.animation, k = this.center, d = this.group, e = this.markerGroup; u && (!0 === g && (g = {}), f ? (d.oldtranslateX = d.translateX, d.oldtranslateY = d.translateY, f = {
                    translateX: k[0], translateY: k[1], scaleX: .001,
                    scaleY: .001
                }, d.attr(f), e && (e.attrSetters = d.attrSetters, e.attr(f))) : (f = { translateX: d.oldtranslateX, translateY: d.oldtranslateY, scaleX: 1, scaleY: 1 }, d.animate(f, g), e && e.animate(f, g), this.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        })
    })(F); (function (a) {
        var r = a.perspective, k = a.pick, n = a.Point, m = a.seriesTypes, u = a.wrap; u(m.scatter.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var f = this.chart, g = k(this.zAxis, f.options.zAxis[0]), m = [], d, e, c; for (c =
                0; c < this.data.length; c++) d = this.data[c], e = g.isLog && g.val2lin ? g.val2lin(d.z) : d.z, d.plotZ = g.translate(e), d.isInside = d.isInside ? e >= g.min && e <= g.max : !1, m.push({ x: d.plotX, y: d.plotY, z: d.plotZ }); f = r(m, f, !0); for (c = 0; c < this.data.length; c++) d = this.data[c], g = f[c], d.plotXold = d.plotX, d.plotYold = d.plotY, d.plotZold = d.plotZ, d.plotX = g.x, d.plotY = g.y, d.plotZ = g.z
            }
        }); u(m.scatter.prototype, "init", function (a, f, g) {
            f.is3d() && (this.axisTypes = ["xAxis", "yAxis", "zAxis"], this.pointArrayMap = ["x", "y", "z"], this.parallelArrays = ["x",
            "y", "z"], this.directTouch = !0); a = a.apply(this, [f, g]); this.chart.is3d() && (this.tooltipOptions.pointFormat = this.userOptions.tooltip ? this.userOptions.tooltip.pointFormat || "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e" : "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e"); return a
        }); u(m.scatter.prototype, "pointAttribs", function (k, f) {
            var g = k.apply(this,
            [].slice.call(arguments, 1)); this.chart.is3d() && f && (g.zIndex = a.pointCameraDistance(f, this.chart)); return g
        }); u(n.prototype, "applyOptions", function (a) { var f = a.apply(this, [].slice.call(arguments, 1)); this.series.chart.is3d() && void 0 === f.z && (f.z = 0); return f })
    })(F); (function (a) {
        var r = a.Axis, k = a.SVGRenderer, n = a.VMLRenderer; n && (a.setOptions({ animate: !1 }), n.prototype.cuboid = k.prototype.cuboid, n.prototype.cuboidPath = k.prototype.cuboidPath, n.prototype.toLinePath = k.prototype.toLinePath, n.prototype.createElement3D =
        k.prototype.createElement3D, n.prototype.arc3d = function (a) { a = k.prototype.arc3d.call(this, a); a.css({ zIndex: a.zIndex }); return a }, a.VMLRenderer.prototype.arc3dPath = a.SVGRenderer.prototype.arc3dPath, a.wrap(r.prototype, "render", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); this.sideFrame && (this.sideFrame.css({ zIndex: 0 }), this.sideFrame.front.attr({ fill: this.sideFrame.color })); this.bottomFrame && (this.bottomFrame.css({ zIndex: 1 }), this.bottomFrame.front.attr({ fill: this.bottomFrame.color })); this.backFrame &&
            (this.backFrame.css({ zIndex: 0 }), this.backFrame.front.attr({ fill: this.backFrame.color }))
        }))
    })(F)
});

/*
 Highcharts JS v5.0.7 (2017-01-17)
 Highcharts Drilldown module

 Author: Torstein Honsi
 License: www.highcharts.com/license

*/
(function (n) { "object" === typeof module && module.exports ? module.exports = n : n(Highcharts) })(function (n) {
    (function (f) {
        function n(b, a, d) { var c; a.rgba.length && b.rgba.length ? (b = b.rgba, a = a.rgba, c = 1 !== a[3] || 1 !== b[3], b = (c ? "rgba(" : "rgb(") + Math.round(a[0] + (b[0] - a[0]) * (1 - d)) + "," + Math.round(a[1] + (b[1] - a[1]) * (1 - d)) + "," + Math.round(a[2] + (b[2] - a[2]) * (1 - d)) + (c ? "," + (a[3] + (b[3] - a[3]) * (1 - d)) : "") + ")") : b = a.input || "none"; return b } var B = f.noop, v = f.color, w = f.defaultOptions, l = f.each, p = f.extend, H = f.format, C = f.pick, x = f.wrap, q = f.Chart,
        t = f.seriesTypes, D = t.pie, r = t.column, E = f.Tick, y = f.fireEvent, F = f.inArray, G = 1; l(["fill", "stroke"], function (b) { f.Fx.prototype[b + "Setter"] = function () { this.elem.attr(b, n(v(this.start), v(this.end), this.pos), null, !0) } }); p(w.lang, { drillUpText: "\u25c1 Back to {series.name}" }); w.drilldown = {
            activeAxisLabelStyle: { cursor: "pointer", color: "#003399", fontWeight: "bold", textDecoration: "underline" }, activeDataLabelStyle: { cursor: "pointer", color: "#003399", fontWeight: "bold", textDecoration: "underline" }, animation: { duration: 500 },
            drillUpButton: { position: { align: "right", x: -10, y: 10 } }
        }; f.SVGRenderer.prototype.Element.prototype.fadeIn = function (b) { this.attr({ opacity: .1, visibility: "inherit" }).animate({ opacity: C(this.newOpacity, 1) }, b || { duration: 250 }) }; q.prototype.addSeriesAsDrilldown = function (b, a) { this.addSingleSeriesAsDrilldown(b, a); this.applyDrilldown() }; q.prototype.addSingleSeriesAsDrilldown = function (b, a) {
            var d = b.series, c = d.xAxis, e = d.yAxis, h, g = [], k = [], u, m, z; z = { color: b.color || d.color }; this.drilldownLevels || (this.drilldownLevels =
            []); u = d.options._levelNumber || 0; (m = this.drilldownLevels[this.drilldownLevels.length - 1]) && m.levelNumber !== u && (m = void 0); a = p(p({ _ddSeriesId: G++ }, z), a); h = F(b, d.points); l(d.chart.series, function (a) { a.xAxis !== c || a.isDrilling || (a.options._ddSeriesId = a.options._ddSeriesId || G++, a.options._colorIndex = a.userOptions._colorIndex, a.options._levelNumber = a.options._levelNumber || u, m ? (g = m.levelSeries, k = m.levelSeriesOptions) : (g.push(a), k.push(a.options))) }); b = p({
                levelNumber: u, seriesOptions: d.options, levelSeriesOptions: k,
                levelSeries: g, shapeArgs: b.shapeArgs, bBox: b.graphic ? b.graphic.getBBox() : {}, color: b.isNull ? (new f.Color(v)).setOpacity(0).get() : v, lowerSeriesOptions: a, pointOptions: d.options.data[h], pointIndex: h, oldExtremes: { xMin: c && c.userMin, xMax: c && c.userMax, yMin: e && e.userMin, yMax: e && e.userMax }
            }, z); this.drilldownLevels.push(b); a = b.lowerSeries = this.addSeries(a, !1); a.options._levelNumber = u + 1; c && (c.oldPos = c.pos, c.userMin = c.userMax = null, e.userMin = e.userMax = null); d.type === a.type && (a.animate = a.animateDrilldown || B, a.options.animation =
            !0)
        }; q.prototype.applyDrilldown = function () { var b = this.drilldownLevels, a; b && 0 < b.length && (a = b[b.length - 1].levelNumber, l(this.drilldownLevels, function (b) { b.levelNumber === a && l(b.levelSeries, function (c) { c.options && c.options._levelNumber === a && c.remove(!1) }) })); this.redraw(); this.showDrillUpButton() }; q.prototype.getDrilldownBackText = function () { var b = this.drilldownLevels; if (b && 0 < b.length) return b = b[b.length - 1], b.series = b.seriesOptions, H(this.options.lang.drillUpText, b) }; q.prototype.showDrillUpButton = function () {
            var b =
            this, a = this.getDrilldownBackText(), d = b.options.drilldown.drillUpButton, c, e; this.drillUpButton ? this.drillUpButton.attr({ text: a }).align() : (e = (c = d.theme) && c.states, this.drillUpButton = this.renderer.button(a, null, null, function () { b.drillUp() }, c, e && e.hover, e && e.select).addClass("highcharts-drillup-button").attr({ align: d.position.align, zIndex: 7 }).add().align(d.position, !1, d.relativeTo || "plotBox"))
        }; q.prototype.drillUp = function () {
            for (var b = this, a = b.drilldownLevels, d = a[a.length - 1].levelNumber, c = a.length, e =
            b.series, h, g, k, f, m = function (a) { var c; l(e, function (b) { b.options._ddSeriesId === a._ddSeriesId && (c = b) }); c = c || b.addSeries(a, !1); c.type === k.type && c.animateDrillupTo && (c.animate = c.animateDrillupTo); a === g.seriesOptions && (f = c) }; c--;) if (g = a[c], g.levelNumber === d) {
                a.pop(); k = g.lowerSeries; if (!k.chart) for (h = e.length; h--;) if (e[h].options.id === g.lowerSeriesOptions.id && e[h].options._levelNumber === d + 1) { k = e[h]; break } k.xData = []; l(g.levelSeriesOptions, m); y(b, "drillup", { seriesOptions: g.seriesOptions }); f.type === k.type &&
                (f.drilldownLevel = g, f.options.animation = b.options.drilldown.animation, k.animateDrillupFrom && k.chart && k.animateDrillupFrom(g)); f.options._levelNumber = d; k.remove(!1); f.xAxis && (h = g.oldExtremes, f.xAxis.setExtremes(h.xMin, h.xMax, !1), f.yAxis.setExtremes(h.yMin, h.yMax, !1))
            } y(b, "drillupall"); this.redraw(); 0 === this.drilldownLevels.length ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({ text: this.getDrilldownBackText() }).align(); this.ddDupes.length = []
        }; r.prototype.supportsDrilldown =
        !0; r.prototype.animateDrillupTo = function (b) {
            if (!b) {
                var a = this, d = a.drilldownLevel; l(this.points, function (a) { var c = a.dataLabel; a.graphic && a.graphic.hide(); c && (c.hidden = "hidden" === c.attr("visibility"), c.hidden || (c.hide(), a.connector && a.connector.hide())) }); setTimeout(function () { a.points && l(a.points, function (a, b) { b = b === (d && d.pointIndex) ? "show" : "fadeIn"; var c = "show" === b ? !0 : void 0, e = a.dataLabel; if (a.graphic) a.graphic[b](c); if (e && !e.hidden && (e[b](c), a.connector)) a.connector[b](c) }) }, Math.max(this.chart.options.drilldown.animation.duration -
                50, 0)); this.animate = B
            }
        }; r.prototype.animateDrilldown = function (b) { var a = this, d = this.chart.drilldownLevels, c, e = this.chart.options.drilldown.animation, h = this.xAxis; b || (l(d, function (b) { a.options._ddSeriesId === b.lowerSeriesOptions._ddSeriesId && (c = b.shapeArgs, c.fill = b.color) }), c.x += C(h.oldPos, h.pos) - h.pos, l(this.points, function (b) { b.shapeArgs.fill = b.color; b.graphic && b.graphic.attr(c).animate(p(b.shapeArgs, { fill: b.color || a.color }), e); b.dataLabel && b.dataLabel.fadeIn(e) }), this.animate = null) }; r.prototype.animateDrillupFrom =
        function (b) { var a = this.chart.options.drilldown.animation, d = this.group, c = this; l(c.trackerGroups, function (a) { if (c[a]) c[a].on("mouseover") }); delete this.group; l(this.points, function (c) { var e = c.graphic, g = b.shapeArgs, k = function () { e.destroy(); d && (d = d.destroy()) }; e && (delete c.graphic, g.fill = b.color, a ? e.animate(g, f.merge(a, { complete: k })) : (e.attr(g), k())) }) }; D && p(D.prototype, {
            supportsDrilldown: !0, animateDrillupTo: r.prototype.animateDrillupTo, animateDrillupFrom: r.prototype.animateDrillupFrom, animateDrilldown: function (b) {
                var a =
                this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], d = this.chart.options.drilldown.animation, c = a.shapeArgs, e = c.start, h = (c.end - e) / this.points.length; b || (l(this.points, function (b, k) { var g = b.shapeArgs; c.fill = a.color; g.fill = b.color; if (b.graphic) b.graphic.attr(f.merge(c, { start: e + k * h, end: e + (k + 1) * h }))[d ? "animate" : "attr"](g, d) }), this.animate = null)
            }
        }); f.Point.prototype.doDrilldown = function (b, a, d) {
            var c = this.series.chart, e = c.options.drilldown, f = (e.series || []).length, g; c.ddDupes || (c.ddDupes = []);
            for (; f-- && !g;) e.series[f].id === this.drilldown && -1 === F(this.drilldown, c.ddDupes) && (g = e.series[f], c.ddDupes.push(this.drilldown)); y(c, "drilldown", { point: this, seriesOptions: g, category: a, originalEvent: d, points: void 0 !== a && this.series.xAxis.getDDPoints(a).slice(0) }, function (a) { var c = a.point.series && a.point.series.chart, d = a.seriesOptions; c && d && (b ? c.addSingleSeriesAsDrilldown(a.point, d) : c.addSeriesAsDrilldown(a.point, d)) })
        }; f.Axis.prototype.drilldownCategory = function (b, a) {
            var d, c, e = this.getDDPoints(b); for (d in e) (c =
            e[d]) && c.series && c.series.visible && c.doDrilldown && c.doDrilldown(!0, b, a); this.chart.applyDrilldown()
        }; f.Axis.prototype.getDDPoints = function (b) { var a = []; l(this.series, function (d) { var c, e = d.xData, f = d.points; for (c = 0; c < e.length; c++) if (e[c] === b && d.options.data[c] && d.options.data[c].drilldown) { a.push(f ? f[c] : !0); break } }); return a }; E.prototype.drillable = function () {
            var b = this.pos, a = this.label, d = this.axis, c = "xAxis" === d.coll && d.getDDPoints, e = c && d.getDDPoints(b); c && (a && e.length ? (a.drillable = !0, a.basicStyles ||
            (a.basicStyles = f.merge(a.styles)), a.addClass("highcharts-drilldown-axis-label").css(d.chart.options.drilldown.activeAxisLabelStyle).on("click", function (a) { d.drilldownCategory(b, a) })) : a && a.drillable && (a.styles = {}, a.css(a.basicStyles), a.on("click", null), a.removeClass("highcharts-drilldown-axis-label")))
        }; x(E.prototype, "addLabel", function (b) { b.call(this); this.drillable() }); x(f.Point.prototype, "init", function (b, a, d, c) {
            var e = b.call(this, a, d, c); c = (b = a.xAxis) && b.ticks[c]; e.drilldown && f.addEvent(e, "click",
            function (b) { a.xAxis && !1 === a.chart.options.drilldown.allowPointDrilldown ? a.xAxis.drilldownCategory(e.x, b) : e.doDrilldown(void 0, void 0, b) }); c && c.drillable(); return e
        }); x(f.Series.prototype, "drawDataLabels", function (b) {
            var a = this.chart.options.drilldown.activeDataLabelStyle, d = this.chart.renderer; b.call(this); l(this.points, function (b) { var c = {}; b.drilldown && b.dataLabel && ("contrast" === a.color && (c.color = d.getContrast(b.color || this.color)), b.dataLabel.addClass("highcharts-drilldown-data-label"), b.dataLabel.css(a).css(c)) },
            this)
        }); var A, w = function (b) { b.call(this); l(this.points, function (a) { a.drilldown && a.graphic && (a.graphic.addClass("highcharts-drilldown-point"), a.graphic.css({ cursor: "pointer" })) }) }; for (A in t) t[A].prototype.supportsDrilldown && x(t[A].prototype, "drawTracker", w)
    })(n)
});

/*
 Highcharts JS v5.0.7 (2017-01-17)
 Exporting module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (h) { "object" === typeof module && module.exports ? module.exports = h : h(Highcharts) })(function (h) {
    (function (f) {
        var h = f.defaultOptions, n = f.doc, A = f.Chart, u = f.addEvent, F = f.removeEvent, D = f.fireEvent, q = f.createElement, B = f.discardElement, v = f.css, p = f.merge, C = f.pick, k = f.each, r = f.extend, G = f.isTouchDevice, E = f.win, H = f.Renderer.prototype.symbols; r(h.lang, {
            printChart: "Print chart", downloadPNG: "Download PNG image", downloadJPEG: "Download JPEG image", downloadPDF: "Download PDF document", downloadSVG: "Download SVG vector image",
            contextButtonTitle: "Chart context menu"
        }); h.navigation = { buttonOptions: { theme: {}, symbolSize: 14, symbolX: 12.5, symbolY: 10.5, align: "right", buttonSpacing: 3, height: 22, verticalAlign: "top", width: 24 } }; p(!0, h.navigation, {
            menuStyle: { border: "1px solid #999999", background: "#ffffff", padding: "5px 0" }, menuItemStyle: { padding: "0.5em 1em", background: "none", color: "#333333", fontSize: G ? "14px" : "11px", transition: "background 250ms, color 250ms" }, menuItemHoverStyle: { background: "#335cad", color: "#ffffff" }, buttonOptions: {
                symbolFill: "#666666",
                symbolStroke: "#666666", symbolStrokeWidth: 3, theme: { fill: "#ffffff", stroke: "none", padding: 5 }
            }
        }); h.exporting = {
            type: "image/png", url: "https://export.highcharts.com/", printMaxWidth: 780, scale: 2, buttons: {
                contextButton: {
                    className: "highcharts-contextbutton", menuClassName: "highcharts-contextmenu", symbol: "menu", _titleKey: "contextButtonTitle", menuItems: [{ textKey: "printChart", onclick: function () { this.print() } }, { separator: !0 }, { textKey: "downloadPNG", onclick: function () { this.exportChart() } }, { textKey: "downloadJPEG", onclick: function () { this.exportChart({ type: "image/jpeg" }) } },
                    { textKey: "downloadPDF", onclick: function () { this.exportChart({ type: "application/pdf" }) } }, { textKey: "downloadSVG", onclick: function () { this.exportChart({ type: "image/svg+xml" }) } }]
                }
            }
        }; f.post = function (a, c, e) { var b; a = q("form", p({ method: "post", action: a, enctype: "multipart/form-data" }, e), { display: "none" }, n.body); for (b in c) q("input", { type: "hidden", name: b, value: c[b] }, null, a); a.submit(); B(a) }; r(A.prototype, {
            sanitizeSVG: function (a, c) {
                if (c && c.exporting && c.exporting.allowHTML) {
                    var e = a.match(/<\/svg>(.*?$)/); e && (e =
                    '\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"' + c.chart.width + '" height\x3d"' + c.chart.height + '"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e' + e[1] + "\x3c/body\x3e\x3c/foreignObject\x3e", a = a.replace("\x3c/svg\x3e", e + "\x3c/svg\x3e"))
                } a = a.replace(/zIndex="[^"]+"/g, "").replace(/isShadow="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g,
                " xlink:href\x3d").replace(/\n/, " ").replace(/<\/svg>.*?$/, "\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g, "\u00a0").replace(/&shy;/g, "\u00ad"); return a = a.replace(/<IMG /g, "\x3cimage ").replace(/<(\/?)TITLE>/g, "\x3c$1title\x3e").replace(/height=([^" ]+)/g, 'height\x3d"$1"').replace(/width=([^" ]+)/g, 'width\x3d"$1"').replace(/hc-svg-href="([^"]+)">/g, 'xlink:href\x3d"$1"/\x3e').replace(/ id=([^" >]+)/g, ' id\x3d"$1"').replace(/class=([^" >]+)/g,
                'class\x3d"$1"').replace(/ transform /g, " ").replace(/:(path|rect)/g, "$1").replace(/style="([^"]+)"/g, function (a) { return a.toLowerCase() })
            }, getChartHTML: function () { return this.container.innerHTML }, getSVG: function (a) {
                var c, e, b, w, m, g = p(this.options, a); n.createElementNS || (n.createElementNS = function (a, c) { return n.createElement(c) }); e = q("div", null, { position: "absolute", top: "-9999em", width: this.chartWidth + "px", height: this.chartHeight + "px" }, n.body); b = this.renderTo.style.width; m = this.renderTo.style.height;
                b = g.exporting.sourceWidth || g.chart.width || /px$/.test(b) && parseInt(b, 10) || 600; m = g.exporting.sourceHeight || g.chart.height || /px$/.test(m) && parseInt(m, 10) || 400; r(g.chart, { animation: !1, renderTo: e, forExport: !0, renderer: "SVGRenderer", width: b, height: m }); g.exporting.enabled = !1; delete g.data; g.series = []; k(this.series, function (a) { w = p(a.userOptions, { animation: !1, enableMouseTracking: !1, showCheckbox: !1, visible: a.visible }); w.isInternal || g.series.push(w) }); k(this.axes, function (a) { a.userOptions.internalKey = f.uniqueKey() });
                c = new f.Chart(g, this.callback); a && k(["xAxis", "yAxis", "series"], function (b) { var d = {}; a[b] && (d[b] = a[b], c.update(d)) }); k(this.axes, function (a) { var b = f.find(c.axes, function (b) { return b.options.internalKey === a.userOptions.internalKey }), d = a.getExtremes(), e = d.userMin, d = d.userMax; !b || void 0 === e && void 0 === d || b.setExtremes(e, d, !0, !1) }); b = c.getChartHTML(); b = this.sanitizeSVG(b, g); g = null; c.destroy(); B(e); return b
            }, getSVGForExport: function (a, c) {
                var e = this.options.exporting; return this.getSVG(p({ chart: { borderRadius: 0 } },
                e.chartOptions, c, { exporting: { sourceWidth: a && a.sourceWidth || e.sourceWidth, sourceHeight: a && a.sourceHeight || e.sourceHeight } }))
            }, exportChart: function (a, c) { c = this.getSVGForExport(a, c); a = p(this.options.exporting, a); f.post(a.url, { filename: a.filename || "chart", type: a.type, width: a.width || 0, scale: a.scale, svg: c }, a.formAttributes) }, print: function () {
                var a = this, c = a.container, e = [], b = c.parentNode, f = n.body, m = f.childNodes, g = a.options.exporting.printMaxWidth, d, t; if (!a.isPrinting) {
                    a.isPrinting = !0; a.pointer.reset(null,
                    0); D(a, "beforePrint"); if (t = g && a.chartWidth > g) d = [a.options.chart.width, void 0, !1], a.setSize(g, void 0, !1); k(m, function (a, b) { 1 === a.nodeType && (e[b] = a.style.display, a.style.display = "none") }); f.appendChild(c); E.focus(); E.print(); setTimeout(function () { b.appendChild(c); k(m, function (a, b) { 1 === a.nodeType && (a.style.display = e[b]) }); a.isPrinting = !1; t && a.setSize.apply(a, d); D(a, "afterPrint") }, 1E3)
                }
            }, contextMenu: function (a, c, e, b, f, m, g) {
                var d = this, t = d.options.navigation, w = d.chartWidth, h = d.chartHeight, p = "cache-" + a,
                l = d[p], x = Math.max(f, m), y, z; l || (d[p] = l = q("div", { className: a }, { position: "absolute", zIndex: 1E3, padding: x + "px" }, d.container), y = q("div", { className: "highcharts-menu" }, null, l), v(y, r({ MozBoxShadow: "3px 3px 10px #888", WebkitBoxShadow: "3px 3px 10px #888", boxShadow: "3px 3px 10px #888" }, t.menuStyle)), z = function () { v(l, { display: "none" }); g && g.setState(0); d.openMenu = !1 }, u(l, "mouseleave", function () { l.hideTimer = setTimeout(z, 500) }), u(l, "mouseenter", function () { clearTimeout(l.hideTimer) }), p = u(n, "mouseup", function (b) {
                    d.pointer.inClass(b.target,
                    a) || z()
                }), u(d, "destroy", p), k(c, function (a) { if (a) { var b; a.separator ? b = q("hr", null, null, y) : (b = q("div", { className: "highcharts-menu-item", onclick: function (b) { b && b.stopPropagation(); z(); a.onclick && a.onclick.apply(d, arguments) }, innerHTML: a.text || d.options.lang[a.textKey] }, null, y), b.onmouseover = function () { v(this, t.menuItemHoverStyle) }, b.onmouseout = function () { v(this, t.menuItemStyle) }, v(b, r({ cursor: "pointer" }, t.menuItemStyle))); d.exportDivElements.push(b) } }), d.exportDivElements.push(y, l), d.exportMenuWidth =
                l.offsetWidth, d.exportMenuHeight = l.offsetHeight); c = { display: "block" }; e + d.exportMenuWidth > w ? c.right = w - e - f - x + "px" : c.left = e - x + "px"; b + m + d.exportMenuHeight > h && "top" !== g.alignOptions.verticalAlign ? c.bottom = h - b - x + "px" : c.top = b + m - x + "px"; v(l, c); d.openMenu = !0
            }, addButton: function (a) {
                var c = this, e = c.renderer, b = p(c.options.navigation.buttonOptions, a), f = b.onclick, m = b.menuItems, g, d, h = b.symbolSize || 12; c.btnCount || (c.btnCount = 0); c.exportDivElements || (c.exportDivElements = [], c.exportSVGElements = []); if (!1 !== b.enabled) {
                    var k =
                    b.theme, n = k.states, q = n && n.hover, n = n && n.select, l; delete k.states; f ? l = function (a) { a.stopPropagation(); f.call(c, a) } : m && (l = function () { c.contextMenu(d.menuClassName, m, d.translateX, d.translateY, d.width, d.height, d); d.setState(2) }); b.text && b.symbol ? k.paddingLeft = C(k.paddingLeft, 25) : b.text || r(k, { width: b.width, height: b.height, padding: 0 }); d = e.button(b.text, 0, 0, l, k, q, n).addClass(a.className).attr({ "stroke-linecap": "round", title: c.options.lang[b._titleKey], zIndex: 3 }); d.menuClassName = a.menuClassName || "highcharts-menu-" +
                    c.btnCount++; b.symbol && (g = e.symbol(b.symbol, b.symbolX - h / 2, b.symbolY - h / 2, h, h).addClass("highcharts-button-symbol").attr({ zIndex: 1 }).add(d), g.attr({ stroke: b.symbolStroke, fill: b.symbolFill, "stroke-width": b.symbolStrokeWidth || 1 })); d.add().align(r(b, { width: d.width, x: C(b.x, c.buttonOffset) }), !0, "spacingBox"); c.buttonOffset += (d.width + b.buttonSpacing) * ("right" === b.align ? -1 : 1); c.exportSVGElements.push(d, g)
                }
            }, destroyExport: function (a) {
                var c = a ? a.target : this; a = c.exportSVGElements; var e = c.exportDivElements; a &&
                (k(a, function (a, e) { a && (a.onclick = a.ontouchstart = null, c.exportSVGElements[e] = a.destroy()) }), a.length = 0); e && (k(e, function (a, e) { clearTimeout(a.hideTimer); F(a, "mouseleave"); c.exportDivElements[e] = a.onmouseout = a.onmouseover = a.ontouchstart = a.onclick = null; B(a) }), e.length = 0)
            }
        }); H.menu = function (a, c, e, b) { return ["M", a, c + 2.5, "L", a + e, c + 2.5, "M", a, c + b / 2 + .5, "L", a + e, c + b / 2 + .5, "M", a, c + b - 1.5, "L", a + e, c + b - 1.5] }; A.prototype.renderExporting = function () {
            var a, c = this.options.exporting, e = c.buttons, b = this.isDirtyExporting || !this.exportSVGElements;
            this.buttonOffset = 0; this.isDirtyExporting && this.destroyExport(); if (b && !1 !== c.enabled) { for (a in e) this.addButton(e[a]); this.isDirtyExporting = !1 } u(this, "destroy", this.destroyExport)
        }; A.prototype.callbacks.push(function (a) { a.renderExporting(); u(a, "redraw", a.renderExporting); k(["exporting", "navigation"], function (c) { a[c] = { update: function (e, b) { a.isDirtyExporting = !0; p(!0, a.options[c], e); C(b, !0) && a.redraw() } } }) })
    })(h)
});

/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (u) { "object" === typeof module && module.exports ? module.exports = u : u(Highcharts) })(function (u) {
    (function (a) {
        function p(a, b, d) { this.init(a, b, d) } var v = a.each, w = a.extend, l = a.merge, q = a.splat; w(p.prototype, {
            init: function (a, b, d) {
                var k = this, m = k.defaultOptions; k.chart = b; k.options = a = l(m, b.angular ? { background: {} } : void 0, a); (a = a.background) && v([].concat(q(a)).reverse(), function (b) {
                    var c, m = d.userOptions; c = l(k.defaultBackgroundOptions, b); b.backgroundColor && (c.backgroundColor = b.backgroundColor); c.color = c.backgroundColor;
                    d.options.plotBands.unshift(c); m.plotBands = m.plotBands || []; m.plotBands !== d.options.plotBands && m.plotBands.unshift(c)
                })
            }, defaultOptions: { center: ["50%", "50%"], size: "85%", startAngle: 0 }, defaultBackgroundOptions: { className: "highcharts-pane", shape: "circle", borderWidth: 1, borderColor: "#cccccc", backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, "#ffffff"], [1, "#e6e6e6"]] }, from: -Number.MAX_VALUE, innerRadius: 0, to: Number.MAX_VALUE, outerRadius: "105%" }
        }); a.Pane = p
    })(u); (function (a) {
        var p = a.CenteredSeriesMixin,
        v = a.each, w = a.extend, l = a.map, q = a.merge, f = a.noop, b = a.Pane, d = a.pick, k = a.pInt, m = a.splat, n = a.wrap, c, g, h = a.Axis.prototype; a = a.Tick.prototype; c = { getOffset: f, redraw: function () { this.isDirty = !1 }, render: function () { this.isDirty = !1 }, setScale: f, setCategories: f, setTitle: f }; g = {
            defaultRadialGaugeOptions: { labels: { align: "center", x: 0, y: null }, minorGridLineWidth: 0, minorTickInterval: "auto", minorTickLength: 10, minorTickPosition: "inside", minorTickWidth: 1, tickLength: 10, tickPosition: "inside", tickWidth: 2, title: { rotation: 0 }, zIndex: 2 },
            defaultRadialXOptions: { gridLineWidth: 1, labels: { align: null, distance: 15, x: 0, y: null }, maxPadding: 0, minPadding: 0, showLastLabel: !1, tickLength: 0 }, defaultRadialYOptions: { gridLineInterpolation: "circle", labels: { align: "right", x: -3, y: -2 }, showLastLabel: !1, title: { x: 4, text: null, rotation: 90 } }, setOptions: function (b) { b = this.options = q(this.defaultOptions, this.defaultRadialOptions, b); b.plotBands || (b.plotBands = []) }, getOffset: function () {
                h.getOffset.call(this); this.chart.axisOffset[this.side] = 0; this.center = this.pane.center =
                p.getCenter.call(this.pane)
            }, getLinePath: function (b, e) { b = this.center; var c = this.chart, k = d(e, b[2] / 2 - this.offset); this.isCircular || void 0 !== e ? e = this.chart.renderer.symbols.arc(this.left + b[0], this.top + b[1], k, k, { start: this.startAngleRad, end: this.endAngleRad, open: !0, innerR: 0 }) : (e = this.postTranslate(this.angleRad, k), e = ["M", b[0] + c.plotLeft, b[1] + c.plotTop, "L", e.x, e.y]); return e }, setAxisTranslation: function () {
                h.setAxisTranslation.call(this); this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) /
                (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            }, beforeSetTickPositions: function () { if (this.autoConnect = this.isCircular && void 0 === d(this.userMax, this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0 }, setAxisSize: function () {
                h.setAxisSize.call(this); this.isRadial && (this.center = this.pane.center = p.getCenter.call(this.pane), this.isCircular &&
                (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * d(this.sector, 1) / 2)
            }, getPosition: function (b, e) { return this.postTranslate(this.isCircular ? this.translate(b) : this.angleRad, d(this.isCircular ? e : this.translate(b), this.center[2] / 2) - this.offset) }, postTranslate: function (b, e) { var d = this.chart, c = this.center; b = this.startAngleRad + b; return { x: d.plotLeft + c[0] + Math.cos(b) * e, y: d.plotTop + c[1] + Math.sin(b) * e } }, getPlotBandPath: function (b, e, c) {
                var m = this.center, t = this.startAngleRad,
                h = m[2] / 2, a = [d(c.outerRadius, "100%"), c.innerRadius, d(c.thickness, 10)], r = Math.min(this.offset, 0), g = /%$/, n, f = this.isCircular; "polygon" === this.options.gridLineInterpolation ? m = this.getPlotLinePath(b).concat(this.getPlotLinePath(e, !0)) : (b = Math.max(b, this.min), e = Math.min(e, this.max), f || (a[0] = this.translate(b), a[1] = this.translate(e)), a = l(a, function (b) { g.test(b) && (b = k(b, 10) * h / 100); return b }), "circle" !== c.shape && f ? (b = t + this.translate(b), e = t + this.translate(e)) : (b = -Math.PI / 2, e = 1.5 * Math.PI, n = !0), a[0] -= r, a[2] -=
                r, m = this.chart.renderer.symbols.arc(this.left + m[0], this.top + m[1], a[0], a[0], { start: Math.min(b, e), end: Math.max(b, e), innerR: d(a[1], a[0] - a[2]), open: n })); return m
            }, getPlotLinePath: function (b, e) {
                var c = this, d = c.center, k = c.chart, m = c.getPosition(b), a, h, g; c.isCircular ? g = ["M", d[0] + k.plotLeft, d[1] + k.plotTop, "L", m.x, m.y] : "circle" === c.options.gridLineInterpolation ? (b = c.translate(b)) && (g = c.getLinePath(0, b)) : (v(k.xAxis, function (b) { b.pane === c.pane && (a = b) }), g = [], b = c.translate(b), d = a.tickPositions, a.autoConnect && (d =
                d.concat([d[0]])), e && (d = [].concat(d).reverse()), v(d, function (c, d) { h = a.getPosition(c, b); g.push(d ? "L" : "M", h.x, h.y) })); return g
            }, getTitlePosition: function () { var b = this.center, c = this.chart, d = this.options.title; return { x: c.plotLeft + b[0] + (d.x || 0), y: c.plotTop + b[1] - { high: .5, middle: .25, low: 0 }[d.align] * b[2] + (d.y || 0) } }
        }; n(h, "init", function (k, e, a) {
            var h = e.angular, n = e.polar, t = a.isX, r = h && t, f, x = e.options, l = a.pane || 0; if (h) { if (w(this, r ? c : g), f = !t) this.defaultRadialOptions = this.defaultRadialGaugeOptions } else n && (w(this,
            g), this.defaultRadialOptions = (f = t) ? this.defaultRadialXOptions : q(this.defaultYAxisOptions, this.defaultRadialYOptions)); h || n ? (this.isRadial = !0, e.inverted = !1, x.chart.zoomType = null) : this.isRadial = !1; k.call(this, e, a); r || !h && !n || (k = this.options, e.panes || (e.panes = []), this.pane = e = e.panes[l] = e.panes[l] || new b(m(x.pane)[l], e, this), e = e.options, this.angleRad = (k.angle || 0) * Math.PI / 180, this.startAngleRad = (e.startAngle - 90) * Math.PI / 180, this.endAngleRad = (d(e.endAngle, e.startAngle + 360) - 90) * Math.PI / 180, this.offset = k.offset ||
            0, this.isCircular = f)
        }); n(h, "autoLabelAlign", function (b) { if (!this.isRadial) return b.apply(this, [].slice.call(arguments, 1)) }); n(a, "getPosition", function (b, c, d, k, a) { var e = this.axis; return e.getPosition ? e.getPosition(d) : b.call(this, c, d, k, a) }); n(a, "getLabelPosition", function (b, c, k, a, m, h, g, n, f) {
            var e = this.axis, t = h.y, r = 20, z = h.align, x = (e.translate(this.pos) + e.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360; e.isRadial ? (b = e.getPosition(this.pos, e.center[2] / 2 + d(h.distance, -25)), "auto" === h.rotation ? a.attr({ rotation: x }) :
            null === t && (t = e.chart.renderer.fontMetrics(a.styles.fontSize).b - a.getBBox().height / 2), null === z && (e.isCircular ? (this.label.getBBox().width > e.len * e.tickInterval / (e.max - e.min) && (r = 0), z = x > r && x < 180 - r ? "left" : x > 180 + r && x < 360 - r ? "right" : "center") : z = "center", a.attr({ align: z })), b.x += h.x, b.y += t) : b = b.call(this, c, k, a, m, h, g, n, f); return b
        }); n(a, "getMarkPath", function (b, c, d, k, a, m, h) { var e = this.axis; e.isRadial ? (b = e.getPosition(this.pos, e.center[2] / 2 + k), c = ["M", c, d, "L", b.x, b.y]) : c = b.call(this, c, d, k, a, m, h); return c })
    })(u);
    (function (a) {
        var p = a.each, v = a.noop, w = a.pick, l = a.Series, q = a.seriesType, f = a.seriesTypes; q("arearange", "area", { lineWidth: 1, marker: null, threshold: null, tooltip: { pointFormat: '\x3cspan style\x3d"color:{series.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' }, trackByArea: !0, dataLabels: { align: null, verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0 }, states: { hover: { halo: !1 } } }, {
            pointArrayMap: ["low", "high"], dataLabelCollections: ["dataLabel",
            "dataLabelUpper"], toYData: function (b) { return [b.low, b.high] }, pointValKey: "low", deferTranslatePolar: !0, highToXY: function (b) { var d = this.chart, k = this.xAxis.postTranslate(b.rectPlotX, this.yAxis.len - b.plotHigh); b.plotHighX = k.x - d.plotLeft; b.plotHigh = k.y - d.plotTop }, translate: function () {
                var b = this, d = b.yAxis, k = !!b.modifyValue; f.area.prototype.translate.apply(b); p(b.points, function (a) {
                    var m = a.low, c = a.high, g = a.plotY; null === c || null === m ? a.isNull = !0 : (a.plotLow = g, a.plotHigh = d.translate(k ? b.modifyValue(c, a) : c, 0, 1,
                    0, 1), k && (a.yBottom = a.plotHigh))
                }); this.chart.polar && p(this.points, function (d) { b.highToXY(d) })
            }, getGraphPath: function (b) {
                var d = [], k = [], a, n = f.area.prototype.getGraphPath, c, g, h; h = this.options; var r = this.chart.polar && !1 !== h.connectEnds, e = h.step; b = b || this.points; for (a = b.length; a--;) c = b[a], c.isNull || r || b[a + 1] && !b[a + 1].isNull || k.push({ plotX: c.plotX, plotY: c.plotY, doCurve: !1 }), g = { polarPlotY: c.polarPlotY, rectPlotX: c.rectPlotX, yBottom: c.yBottom, plotX: w(c.plotHighX, c.plotX), plotY: c.plotHigh, isNull: c.isNull },
                k.push(g), d.push(g), c.isNull || r || b[a - 1] && !b[a - 1].isNull || k.push({ plotX: c.plotX, plotY: c.plotY, doCurve: !1 }); b = n.call(this, b); e && (!0 === e && (e = "left"), h.step = { left: "right", center: "center", right: "left" }[e]); d = n.call(this, d); k = n.call(this, k); h.step = e; h = [].concat(b, d); this.chart.polar || "M" !== k[0] || (k[0] = "L"); this.graphPath = h; this.areaPath = this.areaPath.concat(b, k); h.isArea = !0; h.xMap = b.xMap; this.areaPath.xMap = b.xMap; return h
            }, drawDataLabels: function () {
                var b = this.data, d = b.length, a, m = [], n = l.prototype, c = this.options.dataLabels,
                g = c.align, h = c.verticalAlign, r = c.inside, e, t, f = this.chart.inverted; if (c.enabled || this._hasPointLabels) {
                    for (a = d; a--;) if (e = b[a]) t = r ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.y = e.high, e._plotY = e.plotY, e.plotY = e.plotHigh, m[a] = e.dataLabel, e.dataLabel = e.dataLabelUpper, e.below = t, f ? g || (c.align = t ? "right" : "left") : h || (c.verticalAlign = t ? "top" : "bottom"), c.x = c.xHigh, c.y = c.yHigh; n.drawDataLabels && n.drawDataLabels.apply(this, arguments); for (a = d; a--;) if (e = b[a]) t = r ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.dataLabelUpper =
                    e.dataLabel, e.dataLabel = m[a], e.y = e.low, e.plotY = e._plotY, e.below = !t, f ? g || (c.align = t ? "left" : "right") : h || (c.verticalAlign = t ? "bottom" : "top"), c.x = c.xLow, c.y = c.yLow; n.drawDataLabels && n.drawDataLabels.apply(this, arguments)
                } c.align = g; c.verticalAlign = h
            }, alignDataLabel: function () { f.column.prototype.alignDataLabel.apply(this, arguments) }, setStackedPoints: v, getSymbol: v, drawPoints: v
        })
    })(u); (function (a) { var p = a.seriesType; p("areasplinerange", "arearange", null, { getPointSpline: a.seriesTypes.spline.prototype.getPointSpline }) })(u);
    (function (a) {
        var p = a.defaultPlotOptions, v = a.each, w = a.merge, l = a.noop, q = a.pick, f = a.seriesType, b = a.seriesTypes.column.prototype; f("columnrange", "arearange", w(p.column, p.arearange, { lineWidth: 1, pointRange: null }), {
            translate: function () {
                var d = this, a = d.yAxis, m = d.xAxis, n = m.startAngleRad, c, g = d.chart, h = d.xAxis.isRadial, r; b.translate.apply(d); v(d.points, function (b) {
                    var e = b.shapeArgs, k = d.options.minPointLength, f, l; b.plotHigh = r = a.translate(b.high, 0, 1, 0, 1); b.plotLow = b.plotY; l = r; f = q(b.rectPlotY, b.plotY) - r; Math.abs(f) <
                    k ? (k -= f, f += k, l -= k / 2) : 0 > f && (f *= -1, l -= f); h ? (c = b.barX + n, b.shapeType = "path", b.shapeArgs = { d: d.polarArc(l + f, l, c, c + b.pointWidth) }) : (e.height = f, e.y = l, b.tooltipPos = g.inverted ? [a.len + a.pos - g.plotLeft - l - f / 2, m.len + m.pos - g.plotTop - e.x - e.width / 2, f] : [m.left - g.plotLeft + e.x + e.width / 2, a.pos - g.plotTop + l + f / 2, f])
                })
            }, directTouch: !0, trackerGroups: ["group", "dataLabelsGroup"], drawGraph: l, crispCol: b.crispCol, drawPoints: b.drawPoints, drawTracker: b.drawTracker, getColumnMetrics: b.getColumnMetrics, animate: function () {
                return b.animate.apply(this,
                arguments)
            }, polarArc: function () { return b.polarArc.apply(this, arguments) }, pointAttribs: b.pointAttribs
        })
    })(u); (function (a) {
        var p = a.each, v = a.isNumber, w = a.merge, l = a.pick, q = a.pInt, f = a.Series, b = a.seriesType, d = a.TrackerMixin; b("gauge", "line", { dataLabels: { enabled: !0, defer: !1, y: 15, borderRadius: 3, crop: !1, verticalAlign: "top", zIndex: 2, borderWidth: 1, borderColor: "#cccccc" }, dial: {}, pivot: {}, tooltip: { headerFormat: "" }, showInLegend: !1 }, {
            angular: !0, directTouch: !0, drawGraph: a.noop, fixedBox: !0, forceDL: !0, noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"], translate: function () {
                var b = this.yAxis, a = this.options, d = b.center; this.generatePoints(); p(this.points, function (c) {
                    var k = w(a.dial, c.dial), h = q(l(k.radius, 80)) * d[2] / 200, m = q(l(k.baseLength, 70)) * h / 100, e = q(l(k.rearLength, 10)) * h / 100, n = k.baseWidth || 3, f = k.topWidth || 1, p = a.overshoot, y = b.startAngleRad + b.translate(c.y, null, null, null, !0); v(p) ? (p = p / 180 * Math.PI, y = Math.max(b.startAngleRad - p, Math.min(b.endAngleRad + p, y))) : !1 === a.wrap && (y = Math.max(b.startAngleRad, Math.min(b.endAngleRad,
                    y))); y = 180 * y / Math.PI; c.shapeType = "path"; c.shapeArgs = { d: k.path || ["M", -e, -n / 2, "L", m, -n / 2, h, -f / 2, h, f / 2, m, n / 2, -e, n / 2, "z"], translateX: d[0], translateY: d[1], rotation: y }; c.plotX = d[0]; c.plotY = d[1]
                })
            }, drawPoints: function () {
                var b = this, a = b.yAxis.center, d = b.pivot, c = b.options, g = c.pivot, h = b.chart.renderer; p(b.points, function (a) {
                    var d = a.graphic, k = a.shapeArgs, g = k.d, m = w(c.dial, a.dial); d ? (d.animate(k), k.d = g) : (a.graphic = h[a.shapeType](k).attr({ rotation: k.rotation, zIndex: 1 }).addClass("highcharts-dial").add(b.group), a.graphic.attr({
                        stroke: m.borderColor ||
                        "none", "stroke-width": m.borderWidth || 0, fill: m.backgroundColor || "#000000"
                    }))
                }); d ? d.animate({ translateX: a[0], translateY: a[1] }) : (b.pivot = h.circle(0, 0, l(g.radius, 5)).attr({ zIndex: 2 }).addClass("highcharts-pivot").translate(a[0], a[1]).add(b.group), b.pivot.attr({ "stroke-width": g.borderWidth || 0, stroke: g.borderColor || "#cccccc", fill: g.backgroundColor || "#000000" }))
            }, animate: function (b) {
                var a = this; b || (p(a.points, function (b) {
                    var d = b.graphic; d && (d.attr({ rotation: 180 * a.yAxis.startAngleRad / Math.PI }), d.animate({ rotation: b.shapeArgs.rotation },
                    a.options.animation))
                }), a.animate = null)
            }, render: function () { this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup); f.prototype.render.call(this); this.group.clip(this.chart.clipRect) }, setData: function (b, a) { f.prototype.setData.call(this, b, !1); this.processData(); this.generatePoints(); l(a, !0) && this.chart.redraw() }, drawTracker: d && d.drawTrackerPoint
        }, { setState: function (b) { this.state = b } })
    })(u); (function (a) {
        var p = a.each, v = a.noop, w = a.pick, l = a.seriesType,
        q = a.seriesTypes; l("boxplot", "column", { threshold: null, tooltip: { pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e' }, whiskerLength: "50%", fillColor: "#ffffff", lineWidth: 1, medianWidth: 2, states: { hover: { brightness: -.3 } }, whiskerWidth: 2 }, {
            pointArrayMap: ["low", "q1", "median",
            "q3", "high"], toYData: function (a) { return [a.low, a.q1, a.median, a.q3, a.high] }, pointValKey: "high", pointAttribs: function (a) { var b = this.options, d = a && a.color || this.color; return { fill: a.fillColor || b.fillColor || d, stroke: b.lineColor || d, "stroke-width": b.lineWidth || 0 } }, drawDataLabels: v, translate: function () { var a = this.yAxis, b = this.pointArrayMap; q.column.prototype.translate.apply(this); p(this.points, function (d) { p(b, function (b) { null !== d[b] && (d[b + "Plot"] = a.translate(d[b], 0, 1, 0, 1)) }) }) }, drawPoints: function () {
                var a =
                this, b = a.options, d = a.chart.renderer, k, m, n, c, g, h, r = 0, e, t, l, q, y = !1 !== a.doQuartiles, v, B = a.options.whiskerLength; p(a.points, function (f) {
                    var p = f.graphic, z = p ? "animate" : "attr", x = f.shapeArgs, u = {}, D = {}, H = {}, I = f.color || a.color; void 0 !== f.plotY && (e = x.width, t = Math.floor(x.x), l = t + e, q = Math.round(e / 2), k = Math.floor(y ? f.q1Plot : f.lowPlot), m = Math.floor(y ? f.q3Plot : f.lowPlot), n = Math.floor(f.highPlot), c = Math.floor(f.lowPlot), p || (f.graphic = p = d.g("point").add(a.group), f.stem = d.path().addClass("highcharts-boxplot-stem").add(p),
                    B && (f.whiskers = d.path().addClass("highcharts-boxplot-whisker").add(p)), y && (f.box = d.path(void 0).addClass("highcharts-boxplot-box").add(p)), f.medianShape = d.path(void 0).addClass("highcharts-boxplot-median").add(p), u.stroke = f.stemColor || b.stemColor || I, u["stroke-width"] = w(f.stemWidth, b.stemWidth, b.lineWidth), u.dashstyle = f.stemDashStyle || b.stemDashStyle, f.stem.attr(u), B && (D.stroke = f.whiskerColor || b.whiskerColor || I, D["stroke-width"] = w(f.whiskerWidth, b.whiskerWidth, b.lineWidth), f.whiskers.attr(D)), y && (p =
                    a.pointAttribs(f), f.box.attr(p)), H.stroke = f.medianColor || b.medianColor || I, H["stroke-width"] = w(f.medianWidth, b.medianWidth, b.lineWidth), f.medianShape.attr(H)), h = f.stem.strokeWidth() % 2 / 2, r = t + q + h, f.stem[z]({ d: ["M", r, m, "L", r, n, "M", r, k, "L", r, c] }), y && (h = f.box.strokeWidth() % 2 / 2, k = Math.floor(k) + h, m = Math.floor(m) + h, t += h, l += h, f.box[z]({ d: ["M", t, m, "L", t, k, "L", l, k, "L", l, m, "L", t, m, "z"] })), B && (h = f.whiskers.strokeWidth() % 2 / 2, n += h, c += h, v = /%$/.test(B) ? q * parseFloat(B) / 100 : B / 2, f.whiskers[z]({
                        d: ["M", r - v, n, "L", r + v, n,
                        "M", r - v, c, "L", r + v, c]
                    })), g = Math.round(f.medianPlot), h = f.medianShape.strokeWidth() % 2 / 2, g += h, f.medianShape[z]({ d: ["M", t, g, "L", l, g] }))
                })
            }, setStackedPoints: v
        })
    })(u); (function (a) {
        var p = a.each, v = a.noop, w = a.seriesType, l = a.seriesTypes; w("errorbar", "boxplot", { color: "#000000", grouping: !1, linkedTo: ":previous", tooltip: { pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' }, whiskerWidth: null }, {
            type: "errorbar",
            pointArrayMap: ["low", "high"], toYData: function (a) { return [a.low, a.high] }, pointValKey: "high", doQuartiles: !1, drawDataLabels: l.arearange ? function () { var a = this.pointValKey; l.arearange.prototype.drawDataLabels.call(this); p(this.data, function (f) { f.y = f[a] }) } : v, getColumnMetrics: function () { return this.linkedParent && this.linkedParent.columnMetrics || l.column.prototype.getColumnMetrics.call(this) }
        })
    })(u); (function (a) {
        var p = a.correctFloat, v = a.isNumber, w = a.pick, l = a.Point, q = a.Series, f = a.seriesType, b = a.seriesTypes;
        f("waterfall", "column", { dataLabels: { inside: !0 }, lineWidth: 1, lineColor: "#333333", dashStyle: "dot", borderColor: "#333333", states: { hover: { lineWidthPlus: 0 } } }, {
            pointValKey: "y", translate: function () {
                var a = this.options, k = this.yAxis, m, f, c, g, h, r, e, t, l, q = w(a.minPointLength, 5), y = a.threshold, v = a.stacking, u = 0, x = 0, A; b.column.prototype.translate.apply(this); e = t = y; f = this.points; m = 0; for (a = f.length; m < a; m++) c = f[m], r = this.processedYData[m], g = c.shapeArgs, h = v && k.stacks[(this.negStacks && r < y ? "-" : "") + this.stackKey], A = this.getStackIndicator(A,
                c.x), l = h ? h[c.x].points[this.index + "," + m + "," + A.index] : [0, r], c.isSum ? c.y = p(r) : c.isIntermediateSum && (c.y = p(r - t)), h = Math.max(e, e + c.y) + l[0], g.y = k.toPixels(h, !0), c.isSum ? (g.y = k.toPixels(l[1], !0), g.height = Math.min(k.toPixels(l[0], !0), k.len) - g.y + u + x) : c.isIntermediateSum ? (g.y = k.toPixels(l[1], !0), g.height = Math.min(k.toPixels(t, !0), k.len) - g.y + u + x, t = l[1]) : (g.height = 0 < r ? k.toPixels(e, !0) - g.y : k.toPixels(e, !0) - k.toPixels(e - r, !0), e += r), 0 > g.height && (g.y += g.height, g.height *= -1), c.plotY = g.y = Math.round(g.y) - this.borderWidth %
                2 / 2, g.height = Math.max(Math.round(g.height), .001), c.yBottom = g.y + g.height, g.y -= x, g.height <= q && !c.isNull && (g.height = q, 0 > c.y ? x -= q : u += q), g.y -= u, g = c.plotY - x - u + (c.negative && 0 <= x ? g.height : 0), this.chart.inverted ? c.tooltipPos[0] = k.len - g : c.tooltipPos[1] = g
            }, processData: function (b) {
                var a = this.yData, d = this.options.data, f, c = a.length, g, h, r, e, t, l; h = g = r = e = this.options.threshold || 0; for (l = 0; l < c; l++) t = a[l], f = d && d[l] ? d[l] : {}, "sum" === t || f.isSum ? a[l] = p(h) : "intermediateSum" === t || f.isIntermediateSum ? a[l] = p(g) : (h += t, g += t),
                r = Math.min(h, r), e = Math.max(h, e); q.prototype.processData.call(this, b); this.dataMin = r; this.dataMax = e
            }, toYData: function (b) { return b.isSum ? 0 === b.x ? null : "sum" : b.isIntermediateSum ? 0 === b.x ? null : "intermediateSum" : b.y }, pointAttribs: function (a, k) { var d = this.options.upColor; d && !a.options.color && (a.color = 0 < a.y ? d : null); a = b.column.prototype.pointAttribs.call(this, a, k); delete a.dashstyle; return a }, getGraphPath: function () { return ["M", 0, 0] }, getCrispPath: function () {
                var b = this.data, a = b.length, f = this.graph.strokeWidth() +
                this.borderWidth, f = Math.round(f) % 2 / 2, n = [], c, g, h; for (h = 1; h < a; h++) g = b[h].shapeArgs, c = b[h - 1].shapeArgs, g = ["M", c.x + c.width, c.y + f, "L", g.x, c.y + f], 0 > b[h - 1].y && (g[2] += c.height, g[5] += c.height), n = n.concat(g); return n
            }, drawGraph: function () { q.prototype.drawGraph.call(this); this.graph.attr({ d: this.getCrispPath() }) }, getExtremes: a.noop
        }, {
            getClassName: function () { var b = l.prototype.getClassName.call(this); this.isSum ? b += " highcharts-sum" : this.isIntermediateSum && (b += " highcharts-intermediate-sum"); return b }, isValid: function () {
                return v(this.y,
                !0) || this.isSum || this.isIntermediateSum
            }
        })
    })(u); (function (a) {
        var p = a.Series, v = a.seriesType, u = a.seriesTypes; v("polygon", "scatter", { marker: { enabled: !1, states: { hover: { enabled: !1 } } }, stickyTracking: !1, tooltip: { followPointer: !0, pointFormat: "" }, trackByArea: !0 }, {
            type: "polygon", getGraphPath: function () { for (var a = p.prototype.getGraphPath.call(this), q = a.length + 1; q--;) (q === a.length || "M" === a[q]) && 0 < q && a.splice(q, 0, "z"); return this.areaPath = a }, drawGraph: function () { this.options.fillColor = this.color; u.area.prototype.drawGraph.call(this) },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle, drawTracker: p.prototype.drawTracker, setStackedPoints: a.noop
        })
    })(u); (function (a) {
        var p = a.arrayMax, v = a.arrayMin, u = a.Axis, l = a.color, q = a.each, f = a.isNumber, b = a.noop, d = a.pick, k = a.pInt, m = a.Point, n = a.Series, c = a.seriesType, g = a.seriesTypes; c("bubble", "scatter", {
            dataLabels: { formatter: function () { return this.point.z }, inside: !0, verticalAlign: "middle" }, marker: { lineColor: null, lineWidth: 1, radius: null, states: { hover: { radiusPlus: 0 } }, symbol: "circle" }, minSize: 8, maxSize: "20%",
            softThreshold: !1, states: { hover: { halo: { size: 5 } } }, tooltip: { pointFormat: "({point.x}, {point.y}), Size: {point.z}" }, turboThreshold: 0, zThreshold: 0, zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"], parallelArrays: ["x", "y", "z"], trackerGroups: ["markerGroup", "dataLabelsGroup"], bubblePadding: !0, zoneAxis: "z", pointAttribs: function (b, a) { var c = d(this.options.marker.fillOpacity, .5); b = n.prototype.pointAttribs.call(this, b, a); 1 !== c && (b.fill = l(b.fill).setOpacity(c).get("rgba")); return b }, getRadii: function (b, a, c, d) {
                var e, k, h, g =
                this.zData, f = [], m = this.options, n = "width" !== m.sizeBy, t = m.zThreshold, l = a - b; k = 0; for (e = g.length; k < e; k++) h = g[k], m.sizeByAbsoluteValue && null !== h && (h = Math.abs(h - t), a = Math.max(a - t, Math.abs(b - t)), b = 0), null === h ? h = null : h < b ? h = c / 2 - 1 : (h = 0 < l ? (h - b) / l : .5, n && 0 <= h && (h = Math.sqrt(h)), h = Math.ceil(c + h * (d - c)) / 2), f.push(h); this.radii = f
            }, animate: function (b) {
                var a = this.options.animation; b || (q(this.points, function (b) {
                    var c = b.graphic, d; c && c.width && (d = { x: c.x, y: c.y, width: c.width, height: c.height }, c.attr({
                        x: b.plotX, y: b.plotY, width: 1,
                        height: 1
                    }), c.animate(d, a))
                }), this.animate = null)
            }, translate: function () { var b, a = this.data, c, d, k = this.radii; g.scatter.prototype.translate.call(this); for (b = a.length; b--;) c = a[b], d = k ? k[b] : 0, f(d) && d >= this.minPxSize / 2 ? (c.marker = { radius: d, width: 2 * d, height: 2 * d }, c.dlBox = { x: c.plotX - d, y: c.plotY - d, width: 2 * d, height: 2 * d }) : c.shapeArgs = c.plotY = c.dlBox = void 0 }, alignDataLabel: g.column.prototype.alignDataLabel, buildKDTree: b, applyZones: b
        }, {
            haloPath: function (b) {
                return m.prototype.haloPath.call(this, 0 === b ? 0 : this.marker.radius +
                b)
            }, ttBelow: !1
        }); u.prototype.beforePadding = function () {
            var b = this, a = this.len, c = this.chart, g = 0, m = a, n = this.isXAxis, l = n ? "xData" : "yData", u = this.min, w = {}, x = Math.min(c.plotWidth, c.plotHeight), A = Number.MAX_VALUE, E = -Number.MAX_VALUE, F = this.max - u, C = a / F, G = []; q(this.series, function (a) {
                var e = a.options; !a.bubblePadding || !a.visible && c.options.chart.ignoreHiddenSeries || (b.allowZoomOutside = !0, G.push(a), n && (q(["minSize", "maxSize"], function (b) { var a = e[b], c = /%$/.test(a), a = k(a); w[b] = c ? x * a / 100 : a }), a.minPxSize = w.minSize,
                a.maxPxSize = Math.max(w.maxSize, w.minSize), a = a.zData, a.length && (A = d(e.zMin, Math.min(A, Math.max(v(a), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), E = d(e.zMax, Math.max(E, p(a))))))
            }); q(G, function (a) { var c = a[l], d = c.length, e; n && a.getRadii(A, E, a.minPxSize, a.maxPxSize); if (0 < F) for (; d--;) f(c[d]) && b.dataMin <= c[d] && c[d] <= b.dataMax && (e = a.radii[d], g = Math.min((c[d] - u) * C - e, g), m = Math.max((c[d] - u) * C + e, m)) }); G.length && 0 < F && !this.isLog && (m -= a, C *= (a + g - m) / a, q([["min", "userMin", g], ["max", "userMax", m]], function (a) {
                void 0 ===
                d(b.options[a[0]], b[a[1]]) && (b[a[0]] += a[2] / C)
            }))
        }
    })(u); (function (a) {
        function p(b, a) { var d = this.chart, f = this.options.animation, n = this.group, c = this.markerGroup, g = this.xAxis.center, h = d.plotLeft, l = d.plotTop; d.polar ? d.renderer.isSVG && (!0 === f && (f = {}), a ? (b = { translateX: g[0] + h, translateY: g[1] + l, scaleX: .001, scaleY: .001 }, n.attr(b), c && c.attr(b)) : (b = { translateX: h, translateY: l, scaleX: 1, scaleY: 1 }, n.animate(b, f), c && c.animate(b, f), this.animate = null)) : b.call(this, a) } var u = a.each, w = a.pick, l = a.seriesTypes, q = a.wrap, f =
        a.Series.prototype; a = a.Pointer.prototype; f.searchPointByAngle = function (b) { var a = this.chart, k = this.xAxis.pane.center; return this.searchKDTree({ clientX: 180 + -180 / Math.PI * Math.atan2(b.chartX - k[0] - a.plotLeft, b.chartY - k[1] - a.plotTop) }) }; q(f, "buildKDTree", function (b) { this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.kdDimensions = 2); b.apply(this) }); f.toXY = function (b) {
            var a, k = this.chart, f = b.plotX; a = b.plotY; b.rectPlotX = f; b.rectPlotY = a; a = this.xAxis.postTranslate(b.plotX, this.yAxis.len -
            a); b.plotX = b.polarPlotX = a.x - k.plotLeft; b.plotY = b.polarPlotY = a.y - k.plotTop; this.kdByAngle ? (k = (f / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > k && (k += 360), b.clientX = k) : b.clientX = b.plotX
        }; l.spline && q(l.spline.prototype, "getPointSpline", function (b, a, k, f) {
            var d, c, g, h, m, e, l; this.chart.polar ? (d = k.plotX, c = k.plotY, b = a[f - 1], g = a[f + 1], this.connectEnds && (b || (b = a[a.length - 2]), g || (g = a[1])), b && g && (h = b.plotX, m = b.plotY, a = g.plotX, e = g.plotY, h = (1.5 * d + h) / 2.5, m = (1.5 * c + m) / 2.5, g = (1.5 * d + a) / 2.5, l = (1.5 * c + e) / 2.5, a = Math.sqrt(Math.pow(h -
            d, 2) + Math.pow(m - c, 2)), e = Math.sqrt(Math.pow(g - d, 2) + Math.pow(l - c, 2)), h = Math.atan2(m - c, h - d), m = Math.atan2(l - c, g - d), l = Math.PI / 2 + (h + m) / 2, Math.abs(h - l) > Math.PI / 2 && (l -= Math.PI), h = d + Math.cos(l) * a, m = c + Math.sin(l) * a, g = d + Math.cos(Math.PI + l) * e, l = c + Math.sin(Math.PI + l) * e, k.rightContX = g, k.rightContY = l), f ? (k = ["C", b.rightContX || b.plotX, b.rightContY || b.plotY, h || d, m || c, d, c], b.rightContX = b.rightContY = null) : k = ["M", d, c]) : k = b.call(this, a, k, f); return k
        }); q(f, "translate", function (a) {
            var b = this.chart; a.call(this); if (b.polar &&
            (this.kdByAngle = b.tooltip && b.tooltip.shared, !this.preventPostTranslate)) for (a = this.points, b = a.length; b--;) this.toXY(a[b])
        }); q(f, "getGraphPath", function (a, d) { var b = this, f, l; if (this.chart.polar) { d = d || this.points; for (f = 0; f < d.length; f++) if (!d[f].isNull) { l = f; break } !1 !== this.options.connectEnds && void 0 !== l && (this.connectEnds = !0, d.splice(d.length, 0, d[l])); u(d, function (a) { void 0 === a.polarPlotY && b.toXY(a) }) } return a.apply(this, [].slice.call(arguments, 1)) }); q(f, "animate", p); l.column && (l = l.column.prototype,
        l.polarArc = function (a, d, f, l) { var b = this.xAxis.center, c = this.yAxis.len; return this.chart.renderer.symbols.arc(b[0], b[1], c - d, null, { start: f, end: l, innerR: c - w(a, c) }) }, q(l, "animate", p), q(l, "translate", function (a) {
            var b = this.xAxis, f = b.startAngleRad, l, n, c; this.preventPostTranslate = !0; a.call(this); if (b.isRadial) for (l = this.points, c = l.length; c--;) n = l[c], a = n.barX + f, n.shapeType = "path", n.shapeArgs = { d: this.polarArc(n.yBottom, n.plotY, a, a + n.pointWidth) }, this.toXY(n), n.tooltipPos = [n.plotX, n.plotY], n.ttBelow = n.plotY >
            b.center[1]
        }), q(l, "alignDataLabel", function (a, d, k, l, n, c) { this.chart.polar ? (a = d.rectPlotX / Math.PI * 180, null === l.align && (l.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === l.verticalAlign && (l.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), f.alignDataLabel.call(this, d, k, l, n, c)) : a.call(this, d, k, l, n, c) })); q(a, "getCoordinates", function (a, d) {
            var b = this.chart, f = { xAxis: [], yAxis: [] }; b.polar ? u(b.axes, function (a) {
                var c = a.isXAxis, g = a.center, h = d.chartX - g[0] - b.plotLeft, g = d.chartY - g[1] -
                b.plotTop; f[c ? "xAxis" : "yAxis"].push({ axis: a, value: a.translate(c ? Math.PI - Math.atan2(h, g) : Math.sqrt(Math.pow(h, 2) + Math.pow(g, 2)), !0) })
            }) : f = a.call(this, d); return f
        })
    })(u)
});

/**
 * jquery.mask.js
 * @version: v1.14.10
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* jshint maxcomplexity:17 */
/* global define */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory, jQuery, Zepto) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, mask, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                        // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) { }
            },
            setCaret: function (pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) { }
            },
            events: function () {
                el
                .on('keydown.mask', function (e) {
                    el.data('mask-keycode', e.keyCode || e.which);
                    el.data('mask-previus-value', el.val());
                })
                .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function () {
                    setTimeout(function () {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function () {
                    el.data('changed', true);
                })
                .on('blur.mask', function () {
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function () {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function () {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                        p.val('');
                    }
                });
            },
            getRegexMask: function () {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = { digit: mask.charAt(i), pattern: pattern };
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function () {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function (v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            calculateCaretPosition: function (caretPos, newVal) {
                var newValL = newVal.length,
                    oValue = el.data('mask-previus-value') || '',
                    oValueL = oValue.length;

                // edge cases when erasing digits
                if (el.data('mask-keycode') === 8 && oValue !== newVal) {
                    caretPos = caretPos - (newVal.slice(0, caretPos).length - oValue.slice(0, caretPos).length);

                    // edge cases when typing new digits
                } else if (oValue !== newVal) {
                    // if the cursor is at the end keep it there
                    if (caretPos >= oValueL) {
                        caretPos = newValL;
                    } else {
                        caretPos = caretPos + (newVal.slice(0, caretPos).length - oValue.slice(0, caretPos).length);
                    }
                }

                return caretPos;
            },
            behaviour: function (e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('mask-keycode');

                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var newVal = p.getMasked(),
                        caretPos = p.getCaret();

                    setTimeout(function (caretPos, newVal) {
                        p.setCaret(p.calculateCaretPosition(caretPos, newVal));
                    }, 10, caretPos, newVal);

                    p.val(newVal);
                    p.setCaret(caretPos);
                    return p.callbacks(e);
                }
            },
            getMasked: function (skipMaskChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                var lastUntranslatedMaskChar;
                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                            if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (valDigit === lastUntranslatedMaskChar) {
                            // matched the last untranslated (raw) mask character that we encountered
                            // likely an insert offset the mask character from the last entry; fall
                            // through and only increment v
                            lastUntranslatedMaskChar = undefined;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                            p.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        } else {
                            lastUntranslatedMaskChar = maskDigit;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function (name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMask = this, oldValue = p.val(), regexMask;

        mask = typeof mask === 'function' ? mask(p.val(), undefined, el, options) : mask;

        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function () {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret);
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function () {
            return p.getMasked(true);
        };

        // get masked value without the value being in the input or element
        jMask.getMaskedVal = function (val) {
            return p.getMasked(false, val);
        };

        jMask.init = function (onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.clearIfNotMatch = $.jMaskGlobals.clearIfNotMatch;
            jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
            jMask.translation = $.extend({}, $.jMaskGlobals.translation, options.translation);

            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask) {
                p.events();
                p.val(p.getMasked());
            } else {
                if (options.placeholder) {
                    el.attr('placeholder', options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('mask')) {
                    el.attr('autocomplete', 'off');
                }

                // detect if is necessary let the user type freely.
                // for is a lot faster than forEach.
                for (var i = 0, maxlength = true; i < mask.length; i++) {
                    var translation = jMask.translation[mask.charAt(i)];
                    if (translation && translation.recursive) {
                        maxlength = false;
                        break;
                    }
                }

                if (maxlength) {
                    el.attr('maxlength', mask.length);
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret);
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-mask-',
            mask = input.attr('data-mask');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
            options.selectOnFocus = true;
        }

        if (notSameMaskObject(input, mask, options)) {
            return input.data('mask', new Mask(this, mask, options));
        }
    },
    notSameMaskObject = function (field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof mask === 'function') {
                mask = mask(value);
            }
            return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) { }
    },
    eventSupported = function (eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.mask = function (mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskFunction = function () {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function () {
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.masked = function (val) {
        return this.data('mask').getMaskedVal(val);
    };

    $.fn.unmask = function () {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function () {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function () {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function (selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        // old versions of chrome dont work great with input event
        useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': { pattern: /\d/ },
            '9': { pattern: /\d/, optional: true },
            '#': { pattern: /\d/, recursive: true },
            'A': { pattern: /[a-zA-Z0-9]/ },
            'S': { pattern: /[a-zA-Z]/ }
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
        $.applyDataMask();
    }

    setInterval(function () {
        if ($.jMaskGlobals.watchDataMask) {
            $.applyDataMask();
        }
    }, globals.watchInterval);
}, window.jQuery, window.Zepto));
/*
 *
 * Copyright (c) 2006-2014 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 1.4.1
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function (factory) { if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else { factory(window.jQuery); } }(function ($) { $.fn.numeric = function (config, callback) { if (typeof config === "boolean") { config = { decimal: config, negative: true, decimalPlaces: -1 } } config = config || {}; if (typeof config.negative == "undefined") { config.negative = true } var decimal = config.decimal === false ? "" : config.decimal || "."; var negative = config.negative === true ? true : false; var decimalPlaces = typeof config.decimalPlaces == "undefined" ? -1 : config.decimalPlaces; callback = typeof callback == "function" ? callback : function () { }; return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).data("numeric.decimalPlaces", decimalPlaces).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur) }; $.fn.numeric.keypress = function (e) { var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0; if (key == 13 && this.nodeName.toLowerCase() == "input") { return true } else if (key == 13) { return false } var allow = false; if (e.ctrlKey && key == 97 || e.ctrlKey && key == 65) { return true } if (e.ctrlKey && key == 120 || e.ctrlKey && key == 88) { return true } if (e.ctrlKey && key == 99 || e.ctrlKey && key == 67) { return true } if (e.ctrlKey && key == 122 || e.ctrlKey && key == 90) { return true } if (e.ctrlKey && key == 118 || e.ctrlKey && key == 86 || e.shiftKey && key == 45) { return true } if (key < 48 || key > 57) { var value = $(this).val(); if ($.inArray("-", value.split("")) !== 0 && negative && key == 45 && (value.length === 0 || parseInt($.fn.getSelectionStart(this), 10) === 0)) { return true } if (decimal && key == decimal.charCodeAt(0) && $.inArray(decimal, value.split("")) != -1) { allow = false } if (key != 8 && key != 9 && key != 13 && key != 35 && key != 36 && key != 37 && key != 39 && key != 46) { allow = false } else { if (typeof e.charCode != "undefined") { if (e.keyCode == e.which && e.which !== 0) { allow = true; if (e.which == 46) { allow = false } } else if (e.keyCode !== 0 && e.charCode === 0 && e.which === 0) { allow = true } } } if (decimal && key == decimal.charCodeAt(0)) { if ($.inArray(decimal, value.split("")) == -1) { allow = true } else { allow = false } } } else { allow = true; if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, $(this).val().split("")); if (dot >= 0 && $(this).val().length > dot + decimalPlaces) { allow = false } } } return allow }; $.fn.numeric.keyup = function (e) { var val = $(this).val(); if (val && val.length > 0) { var carat = $.fn.getSelectionStart(this); var selectionEnd = $.fn.getSelectionEnd(this); var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); if (decimal !== "" && decimal !== null) { var dot = $.inArray(decimal, val.split("")); if (dot === 0) { this.value = "0" + val; carat++; selectionEnd++ } if (dot == 1 && val.charAt(0) == "-") { this.value = "-0" + val.substring(1); carat++; selectionEnd++ } val = this.value } var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", decimal]; var length = val.length; for (var i = length - 1; i >= 0; i--) { var ch = val.charAt(i); if (i !== 0 && ch == "-") { val = val.substring(0, i) + val.substring(i + 1) } else if (i === 0 && !negative && ch == "-") { val = val.substring(1) } var validChar = false; for (var j = 0; j < validChars.length; j++) { if (ch == validChars[j]) { validChar = true; break } } if (!validChar || ch == " ") { val = val.substring(0, i) + val.substring(i + 1) } } var firstDecimal = $.inArray(decimal, val.split("")); if (firstDecimal > 0) { for (var k = length - 1; k > firstDecimal; k--) { var chch = val.charAt(k); if (chch == decimal) { val = val.substring(0, k) + val.substring(k + 1) } } } if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, val.split("")); if (dot >= 0) { val = val.substring(0, dot + decimalPlaces + 1); selectionEnd = Math.min(val.length, selectionEnd) } } this.value = val; $.fn.setSelection(this, [carat, selectionEnd]) } }; $.fn.numeric.blur = function () { var decimal = $.data(this, "numeric.decimal"); var callback = $.data(this, "numeric.callback"); var negative = $.data(this, "numeric.negative"); var val = this.value; if (val !== "") { var re = new RegExp("^" + (negative ? "-?" : "") + "\\d+$|^" + (negative ? "-?" : "") + "\\d*" + decimal + "\\d+$"); if (!re.exec(val)) { callback.apply(this) } } }; $.fn.removeNumeric = function () { return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).data("numeric.decimalPlaces", null).unbind("keypress", $.fn.numeric.keypress).unbind("keyup", $.fn.numeric.keyup).unbind("blur", $.fn.numeric.blur) }; $.fn.getSelectionStart = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveEnd("character", o.value.length); if (r.text == "") return o.value.length; return Math.max(0, o.value.lastIndexOf(r.text)) } else { try { return o.selectionStart } catch (e) { return 0 } } }; $.fn.getSelectionEnd = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveStart("character", -o.value.length); return r.text.length } else return o.selectionEnd }; $.fn.setSelection = function (o, p) { if (typeof p == "number") { p = [p, p] } if (p && p.constructor == Array && p.length == 2) { if (o.type === "number") { o.focus() } else if (o.createTextRange) { var r = o.createTextRange(); r.collapse(true); r.moveStart("character", p[0]); r.moveEnd("character", p[1] - p[0]); r.select() } else { o.focus(); try { if (o.setSelectionRange) { o.setSelectionRange(p[0], p[1]) } } catch (e) { } } } } }));
// Spectrum Colorpicker v1.5.1
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    "use strict";

    var defaultOpts = {
        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec(window.navigator.userAgent),
    rgbaSupport = (function () {
        function contains(str, substr) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    inputTypeColorSupport = (function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        return colorInput.type === "color" && colorInput.value !== "!";
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {
        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                        "<button type='button' class='sp-palette-toggle'></button>",
                    "</div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-clear sp-clear-display'>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button type='button' class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate(p, color, className, opts) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var current = p[i];
            if (current) {
                var tiny = tinycolor(current);
                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
            } else {
                var cls = 'sp-clear-display';
                html.push($('<div />')
                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                        .attr('title', opts.noColorSelectedText)
                    )
                    .html()
                );
            }
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {
        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = [],
            paletteArray = [],
            paletteLookup = {},
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            pickerContainer = container.find(".sp-picker-container"),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            clearButton = container.find(".sp-clear"),
            chooseButton = container.find(".sp-choose"),
            toggleButton = container.find(".sp-palette-toggle"),
            isInput = boundElement.is("input"),
            isInputTypeColor = isInput && inputTypeColorSupport && boundElement.attr("type") === "color",
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
            isEmpty = !initialColor,
            allowEmpty = opts.allowEmpty && !isInputTypeColor;

        function applyOptions() {
            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

            if (opts.palette) {
                palette = opts.palette.slice(0);
                paletteArray = $.isArray(palette[0]) ? palette : [palette];
                paletteLookup = {};
                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-clear-enabled", allowEmpty);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className).addClass(opts.containerClassName);

            reflow();
        }

        function initialize() {
            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (!allowEmpty) {
                clearButton.hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {
                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            updateSelectionPaletteFromStorage();

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if (boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                revert();
                hide();
            });

            clearButton.attr("title", opts.clearText);
            clearButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isEmpty = true;
                move();

                if (flat) {
                    //for the flat style, this is a change event
                    updateOriginalInput(true);
                }
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
            toggleButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                opts.showPaletteOnly = !opts.showPaletteOnly;

                // To make sure the Picker area is drawn on the right, next to the
                // Palette area (and not below the palette), first move the Palette
                // to the left to make space for the picker, plus 5px extra.
                // The 'applyOptions' function puts the whole container back into place
                // and takes care of the button-text and the sp-palette-only CSS class.
                if (!opts.showPaletteOnly && !flat) {
                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                }
                applyOptions();
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                isEmpty = false;
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            }, dragStart, dragStop);

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {
                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }

                move();
            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function paletteElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                }
                else {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                    updateOriginalInput(true);
                    if (opts.hideAfterPaletteSelect) {
                        hide();
                    }
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
        }

        function updateSelectionPaletteFromStorage() {
            if (localStorageKey && window.localStorage) {
                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function (i, c) {
                            addColorToSelectionPalette(c);
                        });
                    }
                }
                catch (e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var rgb = tinycolor(color).toRgbString();
                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                    selectionPalette.push(rgb);
                    while (selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch (e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            if (opts.showPalette) {
                for (var i = 0; i < selectionPalette.length; i++) {
                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

                    if (!paletteLookup[rgb]) {
                        unique.push(selectionPalette[i]);
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {
            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
            });

            updateSelectionPaletteFromStorage();

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
            shiftMovementDirection = null;
            boundElement.trigger('dragstart.spectrum', [get()]);
        }

        function dragStop() {
            container.removeClass(draggingClass);
            boundElement.trigger('dragstop.spectrum', [get()]);
        }

        function setFromTextInput() {
            var value = textInput.val();

            if ((value === null || value === "") && allowEmpty) {
                set(null);
                updateOriginalInput(true);
            }
            else {
                var tiny = tinycolor(value);
                if (tiny.isValid()) {
                    set(tiny);
                    updateOriginalInput(true);
                }
                else {
                    textInput.addClass("sp-validation-error");
                }
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [get()]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", clickout);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [colorOnShow]);
        }

        function clickout(e) {
            // Return on right click.
            if (e && e.type == "click" && e.button == 2) { return; }

            if (clickoutFiresChange) {
                updateOriginalInput(true);
            }
            else {
                revert();
            }
            hide();
        }

        function hide() {
            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("click.spectrum", clickout);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [get()]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                // Update UI just in case a validation error needs
                // to be cleared.
                updateUI();
                return;
            }

            var newColor, newHsv;
            if (!color && allowEmpty) {
                isEmpty = true;
            } else {
                isEmpty = false;
                newColor = tinycolor(color);
                newHsv = newColor.toHsv();

                currentHue = (newHsv.h % 360) / 360;
                currentSaturation = newHsv.s;
                currentValue = newHsv.v;
                currentAlpha = newHsv.a;
            }
            updateUI();

            if (newColor && newColor.isValid() && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.getFormat();
            }
        }

        function get(opts) {
            opts = opts || {};

            if (allowEmpty && isEmpty) {
                return null;
            }

            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [get()]);
        }

        function updateUI() {
            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                displayColor = '';

            //reset background info for preview element
            previewElement.removeClass("sp-clear-display");
            previewElement.css('background-color', 'transparent');

            if (!realColor && allowEmpty) {
                // Update the replaced elements background with icon indicating no color selection
                previewElement.addClass("sp-clear-display");
            }
            else {
                var realHex = realColor.toHexString(),
                    realRgb = realColor.toRgbString();

                // Update the replaced elements background color (with actual selected color)
                if (rgbaSupport || realColor.alpha === 1) {
                    previewElement.css("background-color", realRgb);
                }
                else {
                    previewElement.css("background-color", "transparent");
                    previewElement.css("filter", realColor.toFilter());
                }

                if (opts.showAlpha) {
                    var rgb = realColor.toRgb();
                    rgb.a = 0;
                    var realAlpha = tinycolor(rgb).toRgbString();
                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                    if (IE) {
                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                    }
                    else {
                        alphaSliderInner.css("background", "-webkit-" + gradient);
                        alphaSliderInner.css("background", "-moz-" + gradient);
                        alphaSliderInner.css("background", "-ms-" + gradient);
                        // Use current syntax gradient on unprefixed property.
                        alphaSliderInner.css("background",
                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                    }
                }

                displayColor = realColor.toString(format);
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(displayColor);
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            if (allowEmpty && isEmpty) {
                //if selected color is empty, hide the helpers
                alphaSlideHelper.hide();
                slideHelper.hide();
                dragHelper.hide();
            }
            else {
                //make sure helpers are visible
                alphaSlideHelper.show();
                slideHelper.show();
                dragHelper.show();

                // Where to show the little circle in that displays your current selected color
                var dragX = s * dragWidth;
                var dragY = dragHeight - (v * dragHeight);
                dragX = Math.max(
                    -dragHelperHeight,
                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
                );
                dragY = Math.max(
                    -dragHelperHeight,
                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
                );
                dragHelper.css({
                    "top": dragY + "px",
                    "left": dragX + "px"
                });

                var alphaX = currentAlpha * alphaWidth;
                alphaSlideHelper.css({
                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
                });

                // Where to show the bar that displays your current selected hue
                var slideY = (currentHue) * slideHeight;
                slideHelper.css({
                    "top": (slideY - slideHelperHeight) + "px"
                });
            }
        }

        function updateOriginalInput(fireCallback) {
            var color = get(),
                displayColor = '',
                hasChanged = !tinycolor.equals(color, colorOnShow);

            if (color) {
                displayColor = color.toString(currentPreferredFormat);
                // Update the selection palette with the current color
                addColorToSelectionPalette(color);
            }

            if (isInput) {
                boundElement.val(displayColor);
            }

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [color]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();

            if (opts.showPalette) {
                drawPalette();
            }

            boundElement.trigger('reflow.spectrum');
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {
    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && doc.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {
        if (typeof opts == "string") {
            var returnValue = this;
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {
                    var method = spect[opts];
                    if (!method) {
                        throw new Error("Spectrum: no such method: '" + opts + "'");
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var options = $.extend({}, opts, $(this).data());
            var spect = spectrum(this, options);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = {};
    $.spectrum.localization = {};
    $.spectrum.palettes = {};

    $.fn.spectrum.processNativeColorInputs = function () {
        if (!inputTypeColorSupport) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v1.0.0
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function () {
        var trimLeft = /^[\s,#]+/,
            trimRight = /\s+$/,
            tinyCounter = 0,
            math = Math,
            mathRound = math.round,
            mathMin = math.min,
            mathMax = math.max,
            mathRandom = math.random;

        var tinycolor = function tinycolor(color, opts) {
            color = (color) ? color : '';
            opts = opts || {};

            // If input is already a tinycolor, return itself
            if (color instanceof tinycolor) {
                return color;
            }
            // If we are called as a function, call using new instead
            if (!(this instanceof tinycolor)) {
                return new tinycolor(color, opts);
            }

            var rgb = inputToRGB(color);
            this._r = rgb.r,
            this._g = rgb.g,
            this._b = rgb.b,
            this._a = rgb.a,
            this._roundA = mathRound(100 * this._a) / 100,
            this._format = opts.format || rgb.format;
            this._gradientType = opts.gradientType;

            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1
            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
            if (this._r < 1) { this._r = mathRound(this._r); }
            if (this._g < 1) { this._g = mathRound(this._g); }
            if (this._b < 1) { this._b = mathRound(this._b); }

            this._ok = rgb.ok;
            this._tc_id = tinyCounter++;
        };

        tinycolor.prototype = {
            isDark: function () {
                return this.getBrightness() < 128;
            },
            isLight: function () {
                return !this.isDark();
            },
            isValid: function () {
                return this._ok;
            },
            getFormat: function () {
                return this._format;
            },
            getAlpha: function () {
                return this._a;
            },
            getBrightness: function () {
                var rgb = this.toRgb();
                return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            },
            setAlpha: function (value) {
                this._a = boundAlpha(value);
                this._roundA = mathRound(100 * this._a) / 100;
                return this;
            },
            toHsv: function () {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
            },
            toHsvString: function () {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                return (this._a == 1) ?
                  "hsv(" + h + ", " + s + "%, " + v + "%)" :
                  "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
            },
            toHsl: function () {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
            },
            toHslString: function () {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                return (this._a == 1) ?
                  "hsl(" + h + ", " + s + "%, " + l + "%)" :
                  "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
            },
            toHex: function (allow3Char) {
                return rgbToHex(this._r, this._g, this._b, allow3Char);
            },
            toHexString: function (allow3Char) {
                return '#' + this.toHex(allow3Char);
            },
            toHex8: function () {
                return rgbaToHex(this._r, this._g, this._b, this._a);
            },
            toHex8String: function () {
                return '#' + this.toHex8();
            },
            toRgb: function () {
                return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
            },
            toRgbString: function () {
                return (this._a == 1) ?
                  "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
                  "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
            },
            toPercentageRgb: function () {
                return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
            },
            toPercentageRgbString: function () {
                return (this._a == 1) ?
                  "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
                  "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
            },
            toName: function () {
                if (this._a === 0) {
                    return "transparent";
                }

                if (this._a < 1) {
                    return false;
                }

                return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
            },
            toFilter: function (secondColor) {
                var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
                var secondHex8String = hex8String;
                var gradientType = this._gradientType ? "GradientType = 1, " : "";

                if (secondColor) {
                    var s = tinycolor(secondColor);
                    secondHex8String = s.toHex8String();
                }

                return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
            },
            toString: function (format) {
                var formatSet = !!format;
                format = format || this._format;

                var formattedString = false;
                var hasAlpha = this._a < 1 && this._a >= 0;
                var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

                if (needsAlphaFormat) {
                    // Special case for "transparent", all other non-alpha formats
                    // will return rgba when there is transparency.
                    if (format === "name" && this._a === 0) {
                        return this.toName();
                    }
                    return this.toRgbString();
                }
                if (format === "rgb") {
                    formattedString = this.toRgbString();
                }
                if (format === "prgb") {
                    formattedString = this.toPercentageRgbString();
                }
                if (format === "hex" || format === "hex6") {
                    formattedString = this.toHexString();
                }
                if (format === "hex3") {
                    formattedString = this.toHexString(true);
                }
                if (format === "hex8") {
                    formattedString = this.toHex8String();
                }
                if (format === "name") {
                    formattedString = this.toName();
                }
                if (format === "hsl") {
                    formattedString = this.toHslString();
                }
                if (format === "hsv") {
                    formattedString = this.toHsvString();
                }

                return formattedString || this.toHexString();
            },

            _applyModification: function (fn, args) {
                var color = fn.apply(null, [this].concat([].slice.call(args)));
                this._r = color._r;
                this._g = color._g;
                this._b = color._b;
                this.setAlpha(color._a);
                return this;
            },
            lighten: function () {
                return this._applyModification(lighten, arguments);
            },
            brighten: function () {
                return this._applyModification(brighten, arguments);
            },
            darken: function () {
                return this._applyModification(darken, arguments);
            },
            desaturate: function () {
                return this._applyModification(desaturate, arguments);
            },
            saturate: function () {
                return this._applyModification(saturate, arguments);
            },
            greyscale: function () {
                return this._applyModification(greyscale, arguments);
            },
            spin: function () {
                return this._applyModification(spin, arguments);
            },

            _applyCombination: function (fn, args) {
                return fn.apply(null, [this].concat([].slice.call(args)));
            },
            analogous: function () {
                return this._applyCombination(analogous, arguments);
            },
            complement: function () {
                return this._applyCombination(complement, arguments);
            },
            monochromatic: function () {
                return this._applyCombination(monochromatic, arguments);
            },
            splitcomplement: function () {
                return this._applyCombination(splitcomplement, arguments);
            },
            triad: function () {
                return this._applyCombination(triad, arguments);
            },
            tetrad: function () {
                return this._applyCombination(tetrad, arguments);
            }
        };

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function (color, opts) {
            if (typeof color == "object") {
                var newColor = {};
                for (var i in color) {
                    if (color.hasOwnProperty(i)) {
                        if (i === "a") {
                            newColor[i] = color[i];
                        }
                        else {
                            newColor[i] = convertToPercentage(color[i]);
                        }
                    }
                }
                color = newColor;
            }

            return tinycolor(color, opts);
        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "#ff000000" or "ff000000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {
            var rgb = { r: 0, g: 0, b: 0 };
            var a = 1;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                    color.s = convertToPercentage(color.s);
                    color.v = convertToPercentage(color.v);
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                    color.s = convertToPercentage(color.s);
                    color.l = convertToPercentage(color.l);
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            a = boundAlpha(a);

            return {
                ok: ok,
                format: color.format || format,
                r: mathMin(255, mathMax(rgb.r, 0)),
                g: mathMin(255, mathMax(rgb.g, 0)),
                b: mathMin(255, mathMax(rgb.b, 0)),
                a: a
            };
        }

        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b) {
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {
            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {
            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            }
            else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h, s: s, v: v };
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hsvToRgb(h, s, v) {
            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, allow3Char) {
            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }
        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b and a are contained in the set [0, 255]
        // Returns an 8 character hex
        function rgbaToHex(r, g, b, a) {
            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) { return false; }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function () {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };

        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

        function desaturate(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }

        function saturate(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }

        function greyscale(color) {
            return tinycolor(color).desaturate(100);
        }

        function lighten(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }

        function brighten(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var rgb = tinycolor(color).toRgb();
            rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
            rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
            rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
            return tinycolor(rgb);
        }

        function darken(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }

        // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
        // Values outside of this range will be wrapped into this range.
        function spin(color, amount) {
            var hsl = tinycolor(color).toHsl();
            var hue = (mathRound(hsl.h) + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return tinycolor(hsl);
        }

        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        function complement(color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return tinycolor(hsl);
        }

        function triad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
            ];
        }

        function tetrad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
            ];
        }

        function splitcomplement(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
            ];
        }

        function analogous(color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        }

        function monochromatic(color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({ h: h, s: s, v: v }));
                v = (v + modification) % 1;
            }

            return ret;
        }

        // Utility Functions
        // ---------------------

        tinycolor.mix = function (color1, color2, amount) {
            amount = (amount === 0) ? 0 : (amount || 50);

            var rgb1 = tinycolor(color1).toRgb();
            var rgb2 = tinycolor(color2).toRgb();

            var p = amount / 100;
            var w = p * 2 - 1;
            var a = rgb2.a - rgb1.a;

            var w1;

            if (w * a == -1) {
                w1 = w;
            } else {
                w1 = (w + a) / (1 + w * a);
            }

            w1 = (w1 + 1) / 2;

            var w2 = 1 - w1;

            var rgba = {
                r: rgb2.r * w1 + rgb1.r * w2,
                g: rgb2.g * w1 + rgb1.g * w2,
                b: rgb2.b * w1 + rgb1.b * w2,
                a: rgb2.a * p + rgb1.a * (1 - p)
            };

            return tinycolor(rgba);
        };

        // Readability Functions
        // ---------------------
        // <http://www.w3.org/TR/AERT#color-contrast>

        // `readability`
        // Analyze the 2 colors and returns an object with the following properties:
        //    `brightness`: difference in brightness between the two colors
        //    `color`: difference in color/hue between the two colors
        tinycolor.readability = function (color1, color2) {
            var c1 = tinycolor(color1);
            var c2 = tinycolor(color2);
            var rgb1 = c1.toRgb();
            var rgb2 = c2.toRgb();
            var brightnessA = c1.getBrightness();
            var brightnessB = c2.getBrightness();
            var colorDiff = (
                Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
                Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
                Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
            );

            return {
                brightness: Math.abs(brightnessA - brightnessB),
                color: colorDiff
            };
        };

        // `readable`
        // http://www.w3.org/TR/AERT#color-contrast
        // Ensure that foreground and background color combinations provide sufficient contrast.
        // *Example*
        //    tinycolor.isReadable("#000", "#111") => false
        tinycolor.isReadable = function (color1, color2) {
            var readability = tinycolor.readability(color1, color2);
            return readability.brightness > 125 && readability.color > 500;
        };

        // `mostReadable`
        // Given a base color and a list of possible foreground or background
        // colors for that base, returns the most readable color.
        // *Example*
        //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
        tinycolor.mostReadable = function (baseColor, colorList) {
            var bestColor = null;
            var bestScore = 0;
            var bestIsReadable = false;
            for (var i = 0; i < colorList.length; i++) {
                // We normalize both around the "acceptable" breaking point,
                // but rank brightness constrast higher than hue.

                var readability = tinycolor.readability(baseColor, colorList[i]);
                var readable = readability.brightness > 125 && readability.color > 500;
                var score = 3 * (readability.brightness / 125) + (readability.color / 500);

                if ((readable && !bestIsReadable) ||
                    (readable && bestIsReadable && score > bestScore) ||
                    ((!readable) && (!bestIsReadable) && score > bestScore)) {
                    bestIsReadable = readable;
                    bestScore = score;
                    bestColor = tinycolor(colorList[i]);
                }
            }
            return bestColor;
        };

        // Big List of Colors
        // ------------------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);

        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = {};
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Return a valid alpha value [0,1] with all invalid values being set to 1
        function boundAlpha(a) {
            a = parseFloat(a);

            if (isNaN(a) || a < 0 || a > 1) {
                a = 1;
            }

            return a;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) { n = "100%"; }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = parseInt(n * max, 10) / 100;
            }

            // Handle floating point rounding errors
            if ((math.abs(n - max) < 0.000001)) {
                return 1;
            }

            // Convert into [0, 1] range if it isn't already
            return (n % max) / parseFloat(max);
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse a base-16 hex value into a base-10 integer
        function parseIntFromHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        // Replace a decimal with it's percentage value
        function convertToPercentage(n) {
            if (n <= 1) {
                n = (n * 100) + "%";
            }

            return n;
        }

        // Converts a decimal to a hex value
        function convertDecimalToHex(d) {
            return Math.round(parseFloat(d) * 255).toString(16);
        }
        // Converts a hex value to a decimal
        function convertHexToDecimal(h) {
            return (parseIntFromHex(h) / 255);
        }

        var matchers = (function () {
            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {
            color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return { r: 0, g: 0, b: 0, a: 0, format: "name" };
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return { r: match[1], g: match[2], b: match[3] };
            }
            if ((match = matchers.rgba.exec(color))) {
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            }
            if ((match = matchers.hsl.exec(color))) {
                return { h: match[1], s: match[2], l: match[3] };
            }
            if ((match = matchers.hsla.exec(color))) {
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            }
            if ((match = matchers.hsv.exec(color))) {
                return { h: match[1], s: match[2], v: match[3] };
            }
            if ((match = matchers.hex8.exec(color))) {
                return {
                    a: convertHexToDecimal(match[1]),
                    r: parseIntFromHex(match[2]),
                    g: parseIntFromHex(match[3]),
                    b: parseIntFromHex(match[4]),
                    format: named ? "name" : "hex8"
                };
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseIntFromHex(match[1]),
                    g: parseIntFromHex(match[2]),
                    b: parseIntFromHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseIntFromHex(match[1] + '' + match[1]),
                    g: parseIntFromHex(match[2] + '' + match[2]),
                    b: parseIntFromHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        window.tinycolor = tinycolor;
    })();

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });
})(window, jQuery);
/*!
 * jQuery pagination plugin v1.4.1
 * http://esimakin.github.io/twbs-pagination/
 *
 * Copyright 2014-2016, Eugene Simakin
 * Released under Apache 2.0 license
 * http://apache.org/licenses/LICENSE-2.0.html
 */
(function ($, window, document, undefined) {

    'use strict';

    var old = $.fn.twbsPagination;

    // PROTOTYPE AND CONSTRUCTOR

    var TwbsPagination = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.twbsPagination.defaults, options);

        if (this.options.startPage < 1 || this.options.startPage > this.options.totalPages) {
            throw new Error('Start page option is incorrect');
        }

        this.options.totalPages = parseInt(this.options.totalPages);
        if (isNaN(this.options.totalPages)) {
            throw new Error('Total pages option is not correct!');
        }

        this.options.visiblePages = parseInt(this.options.visiblePages);
        if (isNaN(this.options.visiblePages)) {
            throw new Error('Visible pages option is not correct!');
        }

        if (this.options.onPageClick instanceof Function) {
            this.$element.first().on('page', this.options.onPageClick);
        }

        // hide if only one page exists
        if (this.options.hideOnlyOnePage && this.options.totalPages == 1) {
            this.$element.trigger('page', 1);
            return this;
        }

        if (this.options.totalPages < this.options.visiblePages) {
            this.options.visiblePages = this.options.totalPages;
        }

        if (this.options.href) {
            this.options.startPage = this.getPageFromQueryString();
            if (!this.options.startPage) {
                this.options.startPage = 1;
            }
        }

        var tagName = (typeof this.$element.prop === 'function') ?
            this.$element.prop('tagName') : this.$element.attr('tagName');

        if (tagName === 'UL') {
            this.$listContainer = this.$element;
        } else {
            this.$listContainer = $('<ul></ul>');
        }

        this.$listContainer.addClass(this.options.paginationClass);

        if (tagName !== 'UL') {
            this.$element.append(this.$listContainer);
        }

        if (this.options.initiateStartPageClick) {
            this.show(this.options.startPage);
        } else {
            this.currentPage = this.options.startPage;
            this.render(this.getPages(this.options.startPage));
            this.setupEvents();
        }

        return this;
    };

    TwbsPagination.prototype = {

        constructor: TwbsPagination,

        destroy: function () {
            this.$element.empty();
            this.$element.removeData('twbs-pagination');
            this.$element.off('page');

            return this;
        },

        show: function (page) {
            if (page < 1 || page > this.options.totalPages) {
                throw new Error('Page is incorrect.');
            }
            this.currentPage = page;

            this.render(this.getPages(page));
            this.setupEvents();

            this.$element.trigger('page', page);

            return this;
        },

        enable: function () {
            this.show(this.currentPage);
        },

        disable: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                evt.preventDefault();
            });
            this.$listContainer.children().each(function () {
                var $this = $(this);
                if (!$this.hasClass(_this.options.activeClass)) {
                    $(this).addClass(_this.options.disabledClass);
                }
            });
        },

        buildListItems: function (pages) {
            var listItems = [];

            if (this.options.first) {
                listItems.push(this.buildItem('first', 1));
            }

            if (this.options.prev) {
                var prev = pages.currentPage > 1 ? pages.currentPage - 1 : this.options.loop ? this.options.totalPages : 1;
                listItems.push(this.buildItem('prev', prev));
            }

            for (var i = 0; i < pages.numeric.length; i++) {
                listItems.push(this.buildItem('page', pages.numeric[i]));
            }

            if (this.options.next) {
                var next = pages.currentPage < this.options.totalPages ? pages.currentPage + 1 : this.options.loop ? 1 : this.options.totalPages;
                listItems.push(this.buildItem('next', next));
            }

            if (this.options.last) {
                listItems.push(this.buildItem('last', this.options.totalPages));
            }

            return listItems;
        },

        buildItem: function (type, page) {
            var $itemContainer = $('<li></li>'),
                $itemContent = $('<a></a>'),
                itemText = this.options[type] ? this.makeText(this.options[type], page) : page;

            $itemContainer.addClass(this.options[type + 'Class']);
            $itemContainer.data('page', page);
            $itemContainer.data('page-type', type);
            $itemContainer.append($itemContent.attr('href', this.makeHref(page)).addClass(this.options.anchorClass).html(itemText));

            return $itemContainer;
        },

        getPages: function (currentPage) {
            var pages = [];

            var half = Math.floor(this.options.visiblePages / 2);
            var start = currentPage - half + 1 - this.options.visiblePages % 2;
            var end = currentPage + half;

            // handle boundary case
            if (start <= 0) {
                start = 1;
                end = this.options.visiblePages;
            }
            if (end > this.options.totalPages) {
                start = this.options.totalPages - this.options.visiblePages + 1;
                end = this.options.totalPages;
            }

            var itPage = start;
            while (itPage <= end) {
                pages.push(itPage);
                itPage++;
            }

            return { "currentPage": currentPage, "numeric": pages };
        },

        render: function (pages) {
            var _this = this;
            this.$listContainer.children().remove();
            var items = this.buildListItems(pages);
            $.each(items, function (key, item) {
                _this.$listContainer.append(item);
            });

            this.$listContainer.children().each(function () {
                var $this = $(this),
                    pageType = $this.data('page-type');

                switch (pageType) {
                    case 'page':
                        if ($this.data('page') === pages.currentPage) {
                            $this.addClass(_this.options.activeClass);
                        }
                        break;
                    case 'first':
                        $this.toggleClass(_this.options.disabledClass, pages.currentPage === 1);
                        break;
                    case 'last':
                        $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.totalPages);
                        break;
                    case 'prev':
                        $this.toggleClass(_this.options.disabledClass, !_this.options.loop && pages.currentPage === 1);
                        break;
                    case 'next':
                        $this.toggleClass(_this.options.disabledClass,
                            !_this.options.loop && pages.currentPage === _this.options.totalPages);
                        break;
                    default:
                        break;
                }

            });
        },

        setupEvents: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                var $this = $(this);
                if ($this.hasClass(_this.options.disabledClass) || $this.hasClass(_this.options.activeClass)) {
                    return false;
                }
                // Prevent click event if href is not set.
                !_this.options.href && evt.preventDefault();
                _this.show(parseInt($this.data('page')));
            });
        },

        makeHref: function (page) {
            return this.options.href ? this.generateQueryString(page) : "#";
        },

        makeText: function (text, page) {
            return text.replace(this.options.pageVariable, page)
                .replace(this.options.totalPagesVariable, this.options.totalPages)
        },
        getPageFromQueryString: function (searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '(=([^&#]*)|&|#|$)'),
                page = regex.exec(search);
            if (!page || !page[2]) {
                return null;
            }
            page = decodeURIComponent(page[2]);
            page = parseInt(page);
            if (isNaN(page)) {
                return null;
            }
            return page;
        },
        generateQueryString: function (pageNumber, searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '=*[^&#]*');
            if (!search) return '';
            return '?' + search.replace(regex, this.options.pageVariable + '=' + pageNumber);

        },
        getSearchString: function (searchStr) {
            var search = searchStr || window.location.search;
            if (search === '') {
                return null;
            }
            if (search.indexOf('?') === 0) search = search.substr(1);
            return search;
        },
        getCurrentPage: function () {
            return this.currentPage;
        }
    };

    // PLUGIN DEFINITION

    $.fn.twbsPagination = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('twbs-pagination');
        var options = typeof option === 'object' ? option : {};

        if (!data) $this.data('twbs-pagination', (data = new TwbsPagination(this, options)));
        if (typeof option === 'string') methodReturn = data[option].apply(data, args);

        return (methodReturn === undefined) ? $this : methodReturn;
    };

    $.fn.twbsPagination.defaults = {
        totalPages: 1,
        startPage: 1,
        visiblePages: 5,
        initiateStartPageClick: true,
        hideOnlyOnePage: false,
        href: false,
        pageVariable: '{{page}}',
        totalPagesVariable: '{{total_pages}}',
        page: null,
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last',
        loop: false,
        onPageClick: null,
        paginationClass: 'pagination',
        nextClass: 'page-item next',
        prevClass: 'page-item prev',
        lastClass: 'page-item last',
        firstClass: 'page-item first',
        pageClass: 'page-item',
        activeClass: 'active',
        disabledClass: 'disabled',
        anchorClass: 'page-link'
    };

    $.fn.twbsPagination.Constructor = TwbsPagination;

    $.fn.twbsPagination.noConflict = function () {
        $.fn.twbsPagination = old;
        return this;
    };

    $.fn.twbsPagination.version = "1.4.1";

})(window.jQuery, window, document);
/**
 * @license jquery.panzoom.js v3.2.2
 * Updated: Sun Aug 28 2016
 * Add pan and zoom functionality to any element
 * Copyright (c) timmy willison
 * Released under the MIT license
 * https://github.com/timmywil/jquery.panzoom/blob/master/MIT-License.txt
 */

(function(global, factory) {
	// AMD
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], function(jQuery) {
			return factory(global, jQuery);
		});
	// CommonJS/Browserify
	} else if (typeof exports === 'object') {
		factory(global, require('jquery'));
	// Global
	} else {
		factory(global, global.jQuery);
	}
}(typeof window !== 'undefined' ? window : this, function(window, $) {
	'use strict';

	var document = window.document;
	var datakey = '__pz__';
	var slice = Array.prototype.slice;
	var rIE11 = /trident\/7./i;
	var supportsInputEvent = (function() {
		// IE11 returns a false positive
		if (rIE11.test(navigator.userAgent)) {
			return false;
		}
		var input = document.createElement('input');
		input.setAttribute('oninput', 'return');
		return typeof input.oninput === 'function';
	})();

	// Regex
	var rupper = /([A-Z])/g;
	var rsvg = /^http:[\w\.\/]+svg$/;

	var floating = '(\\-?\\d[\\d\\.e-]*)';
	var commaSpace = '\\,?\\s*';
	var rmatrix = new RegExp(
		'^matrix\\(' +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + commaSpace +
		floating + '\\)$'
	);

	/**
	 * Utility for determining transform matrix equality
	 * Checks backwards to test translation first
	 * @param {Array} first
	 * @param {Array} second
	 */
	function matrixEquals(first, second) {
		var i = first.length;
		while(--i) {
			if (Math.round(+first[i]) !== Math.round(+second[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Creates the options object for reset functions
	 * @param {Boolean|Object} opts See reset methods
	 * @returns {Object} Returns the newly-created options object
	 */
	function createResetOptions(opts) {
		var options = { range: true, animate: true };
		if (typeof opts === 'boolean') {
			options.animate = opts;
		} else {
			$.extend(options, opts);
		}
		return options;
	}

	/**
	 * Represent a transformation matrix with a 3x3 matrix for calculations
	 * Matrix functions adapted from Louis Remi's jQuery.transform (https://github.com/louisremi/jquery.transform.js)
	 * @param {Array|Number} a An array of six values representing a 2d transformation matrix
	 */
	function Matrix(a, b, c, d, e, f, g, h, i) {
		if ($.type(a) === 'array') {
			this.elements = [
				+a[0], +a[2], +a[4],
				+a[1], +a[3], +a[5],
				    0,     0,     1
			];
		} else {
			this.elements = [
				a, b, c,
				d, e, f,
				g || 0, h || 0, i || 1
			];
		}
	}

	Matrix.prototype = {
		/**
		 * Multiply a 3x3 matrix by a similar matrix or a vector
		 * @param {Matrix|Vector} matrix
		 * @return {Matrix|Vector} Returns a vector if multiplying by a vector
		 */
		x: function(matrix) {
			var isVector = matrix instanceof Vector;

			var a = this.elements,
				b = matrix.elements;

			if (isVector && b.length === 3) {
				// b is actually a vector
				return new Vector(
					a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
					a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
					a[6] * b[0] + a[7] * b[1] + a[8] * b[2]
				);
			} else if (b.length === a.length) {
				// b is a 3x3 matrix
				return new Matrix(
					a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
					a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
					a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

					a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
					a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
					a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

					a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
					a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
					a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
				);
			}
			return false; // fail
		},
		/**
		 * Generates an inverse of the current matrix
		 * @returns {Matrix}
		 */
		inverse: function() {
			var d = 1 / this.determinant(),
				a = this.elements;
			return new Matrix(
				d * ( a[8] * a[4] - a[7] * a[5]),
				d * (-(a[8] * a[1] - a[7] * a[2])),
				d * ( a[5] * a[1] - a[4] * a[2]),

				d * (-(a[8] * a[3] - a[6] * a[5])),
				d * ( a[8] * a[0] - a[6] * a[2]),
				d * (-(a[5] * a[0] - a[3] * a[2])),

				d * ( a[7] * a[3] - a[6] * a[4]),
				d * (-(a[7] * a[0] - a[6] * a[1])),
				d * ( a[4] * a[0] - a[3] * a[1])
			);
		},
		/**
		 * Calculates the determinant of the current matrix
		 * @returns {Number}
		 */
		determinant: function() {
			var a = this.elements;
			return a[0] * (a[8] * a[4] - a[7] * a[5]) - a[3] * (a[8] * a[1] - a[7] * a[2]) + a[6] * (a[5] * a[1] - a[4] * a[2]);
		}
	};

	/**
	 * Create a vector containing three values
	 */
	function Vector(x, y, z) {
		this.elements = [ x, y, z ];
	}

	/**
	 * Get the element at zero-indexed index i
	 * @param {Number} i
	 */
	Vector.prototype.e = Matrix.prototype.e = function(i) {
		return this.elements[ i ];
	};

	/**
	 * Create a Panzoom object for a given element
	 * @constructor
	 * @param {Element} elem - Element to use pan and zoom
	 * @param {Object} [options] - An object literal containing options to override default options
	 *  (See Panzoom.defaults for ones not listed below)
	 * @param {jQuery} [options.$zoomIn] - zoom in buttons/links collection (you can also bind these yourself
	 *  e.g. $button.on('click', function(e) { e.preventDefault(); $elem.panzoom('zoomIn'); });)
	 * @param {jQuery} [options.$zoomOut] - zoom out buttons/links collection on which to bind zoomOut
	 * @param {jQuery} [options.$zoomRange] - zoom in/out with this range control
	 * @param {jQuery} [options.$reset] - Reset buttons/links collection on which to bind the reset method
	 * @param {Function} [options.on[Start|Change|Zoom|Pan|End|Reset] - Optional callbacks for panzoom events
	 */
	function Panzoom(elem, options) {

		// Allow instantiation without `new` keyword
		if (!(this instanceof Panzoom)) {
			return new Panzoom(elem, options);
		}

		// Sanity checks
		if (elem.nodeType !== 1) {
			$.error('Panzoom called on non-Element node');
		}
		if (!$.contains(document, elem)) {
			$.error('Panzoom element must be attached to the document');
		}

		// Don't remake
		var d = $.data(elem, datakey);
		if (d) {
			return d;
		}

		// Extend default with given object literal
		// Each instance gets its own options
		this.options = options = $.extend({}, Panzoom.defaults, options);
		this.elem = elem;
		var $elem = this.$elem = $(elem);
		this.$set = options.$set && options.$set.length ? options.$set : $elem;
		this.$doc = $(elem.ownerDocument || document);
		this.$parent = $elem.parent();
		this.parent = this.$parent[0];

		// This is SVG if the namespace is SVG
		// However, while <svg> elements are SVG, we want to treat those like other elements
		this.isSVG = rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';

		this.panning = false;

		// Save the original transform value
		// Save the prefixed transform style key
		// Set the starting transform
		this._buildTransform();

		// Build the appropriately-prefixed transform style property name
		// De-camelcase
		this._transform = $.cssProps.transform.replace(rupper, '-$1').toLowerCase();

		// Build the transition value
		this._buildTransition();

		// Build containment dimensions
		this.resetDimensions();

		// Add zoom and reset buttons to `this`
		var $empty = $();
		var self = this;
		$.each([ '$zoomIn', '$zoomOut', '$zoomRange', '$reset' ], function(i, name) {
			self[ name ] = options[ name ] || $empty;
		});

		this.enable();

		this.scale = this.getMatrix()[0];
		this._checkPanWhenZoomed();

		// Save the instance
		$.data(elem, datakey, this);
	}

	// Attach regex for possible use (immutable)
	Panzoom.rmatrix = rmatrix;

	Panzoom.defaults = {
		// Should always be non-empty
		// Used to bind jQuery events without collisions
		// A guid is not added here as different instantiations/versions of panzoom
		// on the same element is not supported, so don't do it.
		eventNamespace: '.panzoom',

		// Whether or not to transition the scale
		transition: true,

		// Default cursor style for the element
		cursor: 'move',

		// There may be some use cases for zooming without panning or vice versa
		disablePan: false,
		disableZoom: false,

		// Pan only on the X or Y axes
		disableXAxis: false,
		disableYAxis: false,

		// Set whether you'd like to pan on left (1), middle (2), or right click (3)
		which: 1,

		// The increment at which to zoom
		// Should be a number greater than 0
		increment: 0.3,

		// When no scale is passed, this option tells
		// the `zoom` method to increment
		// the scale *linearly* based on the increment option.
		// This often ends up looking like very little happened at larger zoom levels.
		// The default is to multiply/divide the scale based on the increment.
		linearZoom: false,

		// Pan only when the scale is greater than minScale
		panOnlyWhenZoomed: false,

		// min and max zoom scales
		minScale: 0.3,
		maxScale: 6,

		// The default step for the range input
		// Precendence: default < HTML attribute < option setting
		rangeStep: 0.05,

		// Animation duration (ms)
		duration: 200,
		// CSS easing used for scale transition
		easing: 'ease-in-out',

		// Indicate that the element should be contained within it's parent when panning
		// Note: this does not affect zooming outside of the parent
		// Set this value to 'invert' to only allow panning outside of the parent element (basically the opposite of the normal use of contain)
		// 'invert' is useful for a large panzoom element where you don't want to show anything behind it
		contain: false
	};

	Panzoom.prototype = {
		constructor: Panzoom,

		/**
		 * @returns {Panzoom} Returns the instance
		 */
		instance: function() {
			return this;
		},

		/**
		 * Enable or re-enable the panzoom instance
		 */
		enable: function() {
			// Unbind first
			this._initStyle();
			this._bind();
			this.disabled = false;
		},

		/**
		 * Disable panzoom
		 */
		disable: function() {
			this.disabled = true;
			this._resetStyle();
			this._unbind();
		},

		/**
		 * @returns {Boolean} Returns whether the current panzoom instance is disabled
		 */
		isDisabled: function() {
			return this.disabled;
		},

		/**
		 * Destroy the panzoom instance
		 */
		destroy: function() {
			this.disable();
			$.removeData(this.elem, datakey);
		},

		/**
		 * Builds the restricing dimensions from the containment element
		 * Also used with focal points
		 * Call this method whenever the dimensions of the element or parent are changed
		 */
		resetDimensions: function() {
			// Reset container properties
			this.container = this.parent.getBoundingClientRect();

			// Set element properties
			var elem = this.elem;
			// getBoundingClientRect() works with SVG, offsetWidth does not
			var dims = elem.getBoundingClientRect();
			var absScale = Math.abs(this.scale);
			this.dimensions = {
				width: dims.width,
				height: dims.height,
				left: $.css(elem, 'left', true) || 0,
				top: $.css(elem, 'top', true) || 0,
				// Borders and margins are scaled
				border: {
					top: $.css(elem, 'borderTopWidth', true) * absScale || 0,
					bottom: $.css(elem, 'borderBottomWidth', true) * absScale || 0,
					left: $.css(elem, 'borderLeftWidth', true) * absScale || 0,
					right: $.css(elem, 'borderRightWidth', true) * absScale || 0
				},
				margin: {
					top: $.css(elem, 'marginTop', true) * absScale || 0,
					left: $.css(elem, 'marginLeft', true) * absScale || 0
				}
			};
		},

		/**
		 * Return the element to it's original transform matrix
		 * @param {Boolean} [options] If a boolean is passed, animate the reset (default: true). If an options object is passed, simply pass that along to setMatrix.
		 * @param {Boolean} [options.silent] Silence the reset event
		 */
		reset: function(options) {
			options = createResetOptions(options);
			// Reset the transform to its original value
			var matrix = this.setMatrix(this._origTransform, options);
			if (!options.silent) {
				this._trigger('reset', matrix);
			}
		},

		/**
		 * Only resets zoom level
		 * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to zoom()
		 */
		resetZoom: function(options) {
			options = createResetOptions(options);
			var origMatrix = this.getMatrix(this._origTransform);
			options.dValue = origMatrix[ 3 ];
			this.zoom(origMatrix[0], options);
		},

		/**
		 * Only reset panning
		 * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to pan()
		 */
		resetPan: function(options) {
			var origMatrix = this.getMatrix(this._origTransform);
			this.pan(origMatrix[4], origMatrix[5], createResetOptions(options));
		},

		/**
		 * Sets a transform on the $set
		 * For SVG, the style attribute takes precedence
		 * and allows us to animate
		 * @param {String} transform
		 */
		setTransform: function(transform) {
			var $set = this.$set;
			var i = $set.length;
			while(i--) {
				$.style($set[i], 'transform', transform);

				// Support IE9-11, Edge 13-14+
				// Set attribute alongside style attribute
				// since IE and Edge do not respect style settings on SVG
				// See https://css-tricks.com/transforms-on-svg-elements/
				if (this.isSVG) {
					$set[i].setAttribute('transform', transform);
				}
			}
		},

		/**
		 * Retrieving the transform is different for SVG
		 *  (unless a style transform is already present)
		 * Uses the $set collection for retrieving the transform
		 * @param {String} [transform] Pass in an transform value (like 'scale(1.1)')
		 *  to have it formatted into matrix format for use by Panzoom
		 * @returns {String} Returns the current transform value of the element
		 */
		getTransform: function(transform) {
			var $set = this.$set;
			var transformElem = $set[0];
			if (transform) {
				this.setTransform(transform);
			} else {

				// IE and Edge still set the transform style properly
				// They just don't render it on SVG
				// So we get a correct value here
				transform = $.style(transformElem, 'transform');

				if (this.isSVG && (!transform || transform === 'none')) {
					transform = $.attr(transformElem, 'transform') || 'none';
				}
			}

			// Convert any transforms set by the user to matrix format
			// by setting to computed
			if (transform !== 'none' && !rmatrix.test(transform)) {

				// Get computed and set for next time
				this.setTransform(transform = $.css(transformElem, 'transform'));
			}

			return transform || 'none';
		},

		/**
		 * Retrieve the current transform matrix for $elem (or turn a transform into it's array values)
		 * @param {String} [transform] matrix-formatted transform value
		 * @returns {Array} Returns the current transform matrix split up into it's parts, or a default matrix
		 */
		getMatrix: function(transform) {
			var matrix = rmatrix.exec(transform || this.getTransform());
			if (matrix) {
				matrix.shift();
			}
			return matrix || [ 1, 0, 0, 1, 0, 0 ];
		},

		/**
		 * Given a matrix object, quickly set the current matrix of the element
		 * @param {Array|String} matrix
		 * @param {Object} [options]
		 * @param {Boolean|String} [options.animate] Whether to animate the transform change, or 'skip' indicating that it is unnecessary to set
		 * @param {Boolean} [options.contain] Override the global contain option
		 * @param {Boolean} [options.range] If true, $zoomRange's value will be updated.
		 * @param {Boolean} [options.silent] If true, the change event will not be triggered
		 * @returns {Array} Returns the newly-set matrix
		 */
		setMatrix: function(matrix, options) {
			if (this.disabled) { return; }
			if (!options) { options = {}; }
			// Convert to array
			if (typeof matrix === 'string') {
				matrix = this.getMatrix(matrix);
			}
			var scale = +matrix[0];
			var contain = typeof options.contain !== 'undefined' ? options.contain : this.options.contain;

			// Apply containment
			if (contain) {
				var dims = options.dims;
				if (!dims) {
					this.resetDimensions();
					dims = this.dimensions;
				}
				var spaceWLeft, spaceWRight, scaleDiff;
				var container = this.container;
				var width = dims.width;
				var height = dims.height;
				var conWidth = container.width;
				var conHeight = container.height;
				var zoomAspectW = conWidth / width;
				var zoomAspectH = conHeight / height;

				// If the element is not naturally centered,
				// assume full space right
				if (this.$parent.css('textAlign') !== 'center' || $.css(this.elem, 'display') !== 'inline') {
					// offsetWidth gets us the width without the transform
					scaleDiff = (width - this.elem.offsetWidth) / 2;
					spaceWLeft = scaleDiff - dims.border.left;
					spaceWRight = width - conWidth - scaleDiff + dims.border.right;
				} else {
					spaceWLeft = spaceWRight = ((width - conWidth) / 2);
				}
				var spaceHTop = ((height - conHeight) / 2) + dims.border.top;
				var spaceHBottom = ((height - conHeight) / 2) - dims.border.top - dims.border.bottom;

				if (contain === 'invert' || contain === 'automatic' && zoomAspectW < 1.01) {
					matrix[4] = Math.max(Math.min(matrix[4], spaceWLeft - dims.border.left), -spaceWRight);
				} else {
					matrix[4] = Math.min(Math.max(matrix[4], spaceWLeft), -spaceWRight);
				}

				if (contain === 'invert' || (contain === 'automatic' && zoomAspectH < 1.01)) {
					matrix[5] = Math.max(Math.min(matrix[5], spaceHTop - dims.border.top), -spaceHBottom);
				} else {
					matrix[5] = Math.min(Math.max(matrix[5], spaceHTop), -spaceHBottom);
				}
			}

			// Animate
			if (options.animate !== 'skip') {
				// Set transition
				this.transition(!options.animate);
			}

			// Update range element
			if (options.range) {
				this.$zoomRange.val(scale);
			}

			// Set the matrix on this.$set
			if (this.options.disableXAxis || this.options.disableYAxis) {
				var originalMatrix = this.getMatrix();
				if (this.options.disableXAxis) {
					matrix[4] = originalMatrix[4];
				}
				if (this.options.disableYAxis) {
					matrix[5] = originalMatrix[5];
				}
			}
			this.setTransform('matrix(' + matrix.join(',') + ')');

			this.scale = scale;

			// Disable/enable panning if zooming is at minimum and panOnlyWhenZoomed is true
			this._checkPanWhenZoomed(scale);

			if (!options.silent) {
				this._trigger('change', matrix);
			}

			return matrix;
		},

		/**
		 * @returns {Boolean} Returns whether the panzoom element is currently being dragged
		 */
		isPanning: function() {
			return this.panning;
		},

		/**
		 * Apply the current transition to the element, if allowed
		 * @param {Boolean} [off] Indicates that the transition should be turned off
		 */
		transition: function(off) {
			if (!this._transition) { return; }
			var transition = off || !this.options.transition ? 'none' : this._transition;
			var $set = this.$set;
			var i = $set.length;
			while(i--) {
				// Avoid reflows when zooming
				if ($.style($set[i], 'transition') !== transition) {
					$.style($set[i], 'transition', transition);
				}
			}
		},

		/**
		 * Pan the element to the specified translation X and Y
		 * Note: this is not the same as setting jQuery#offset() or jQuery#position()
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Object} [options] These options are passed along to setMatrix
		 * @param {Array} [options.matrix] The matrix being manipulated (if already known so it doesn't have to be retrieved again)
		 * @param {Boolean} [options.silent] Silence the pan event. Note that this will also silence the setMatrix change event.
		 * @param {Boolean} [options.relative] Make the x and y values relative to the existing matrix
		 */
		pan: function(x, y, options) {
			if (this.options.disablePan) { return; }
			if (!options) { options = {}; }
			var matrix = options.matrix;
			if (!matrix) {
				matrix = this.getMatrix();
			}
			// Cast existing matrix values to numbers
			if (options.relative) {
				x += +matrix[4];
				y += +matrix[5];
			}
			matrix[4] = x;
			matrix[5] = y;
			this.setMatrix(matrix, options);
			if (!options.silent) {
				this._trigger('pan', matrix[4], matrix[5]);
			}
		},

		/**
		 * Zoom in/out the element using the scale properties of a transform matrix
		 * @param {Number|Boolean} [scale] The scale to which to zoom or a boolean indicating to transition a zoom out
		 * @param {Object} [opts] All global options can be overwritten by this options object. For example, override the default increment.
		 * @param {Boolean} [opts.noSetRange] Specify that the method should not set the $zoomRange value (as is the case when $zoomRange is calling zoom on change)
		 * @param {jQuery.Event|Object} [opts.focal] A focal point on the panzoom element on which to zoom.
		 *  If an object, set the clientX and clientY properties to the position relative to the parent
		 * @param {Boolean} [opts.animate] Whether to animate the zoom (defaults to true if scale is not a number, false otherwise)
		 * @param {Boolean} [opts.silent] Silence the zoom event
		 * @param {Array} [opts.matrix] Optionally pass the current matrix so it doesn't need to be retrieved
		 * @param {Number} [opts.dValue] Think of a transform matrix as four values a, b, c, d
		 *  where a/d are the horizontal/vertical scale values and b/c are the skew values
		 *  (5 and 6 of matrix array are the tx/ty transform values).
		 *  Normally, the scale is set to both the a and d values of the matrix.
		 *  This option allows you to specify a different d value for the zoom.
		 *  For instance, to flip vertically, you could set -1 as the dValue.
		 */
		zoom: function(scale, opts) {
			// Shuffle arguments
			if (typeof scale === 'object') {
				opts = scale;
				scale = null;
			} else if (!opts) {
				opts = {};
			}
			var options = $.extend({}, this.options, opts);
			// Check if disabled
			if (options.disableZoom) { return; }
			var animate = false;
			var matrix = options.matrix || this.getMatrix();
			var startScale = +matrix[0];

			// Calculate zoom based on increment
			if (typeof scale !== 'number') {
				if (options.linearZoom) {
					scale = startScale + (options.increment * (scale ? -1 : 1));
				} else {
					scale = scale ? (startScale / (1 + options.increment)) : (startScale * (1 + options.increment));
				}
				animate = true;
			}

			// Constrain scale
			scale = Math.max(Math.min(scale, options.maxScale), options.minScale);

			// Calculate focal point based on scale
			var focal = options.focal;
			if (focal && !options.disablePan) {
				// Adapted from code by Florian Günther
				// https://github.com/florianguenther/zui53
				this.resetDimensions();
				var dims = options.dims = this.dimensions;
				var clientX = focal.clientX;
				var clientY = focal.clientY;

				// Adjust the focal point for transform-origin 50% 50%
				// SVG elements have a transform origin of 0 0
				if (!this.isSVG) {
					clientX -= (dims.width / startScale) / 2;
					clientY -= (dims.height / startScale) / 2;
				}

				var clientV = new Vector(clientX, clientY, 1);
				var surfaceM = new Matrix(matrix);
				// Supply an offset manually if necessary
				var o = this.parentOffset || this.$parent.offset();
				var offsetM = new Matrix(1, 0, o.left - this.$doc.scrollLeft(), 0, 1, o.top - this.$doc.scrollTop());
				var surfaceV = surfaceM.inverse().x(offsetM.inverse().x(clientV));
				var scaleBy = scale / matrix[0];
				surfaceM = surfaceM.x(new Matrix([scaleBy, 0, 0, scaleBy, 0, 0]));
				clientV = offsetM.x(surfaceM.x(surfaceV));
				matrix[4] = +matrix[4] + (clientX - clientV.e(0));
				matrix[5] = +matrix[5] + (clientY - clientV.e(1));
			}

			// Set the scale
			matrix[0] = scale;
			matrix[3] = typeof options.dValue === 'number' ? options.dValue : scale;

			// Calling zoom may still pan the element
			this.setMatrix(matrix, {
				animate: typeof options.animate !== 'undefined' ? options.animate : animate,
				// Set the zoomRange value
				range: !options.noSetRange
			});

			// Trigger zoom event
			if (!options.silent) {
				this._trigger('zoom', matrix[0], options);
			}
		},

		/**
		 * Get/set option on an existing instance
		 * @returns {Array|undefined} If getting, returns an array of all values
		 *   on each instance for a given key. If setting, continue chaining by returning undefined.
		 */
		option: function(key, value) {
			var options;
			if (!key) {
				// Avoids returning direct reference
				return $.extend({}, this.options);
			}

			if (typeof key === 'string') {
				if (arguments.length === 1) {
					return this.options[ key ] !== undefined ?
						this.options[ key ] :
						null;
				}
				options = {};
				options[ key ] = value;
			} else {
				options = key;
			}

			this._setOptions(options);
		},

		/**
		 * Internally sets options
		 * @param {Object} options - An object literal of options to set
		 * @private
		 */
		_setOptions: function(options) {
			$.each(options, $.proxy(function(key, value) {
				switch(key) {
					case 'disablePan':
						this._resetStyle();
						/* falls through */
					case '$zoomIn':
					case '$zoomOut':
					case '$zoomRange':
					case '$reset':
					case 'disableZoom':
					case 'onStart':
					case 'onChange':
					case 'onZoom':
					case 'onPan':
					case 'onEnd':
					case 'onReset':
					case 'eventNamespace':
						this._unbind();
				}
				this.options[ key ] = value;
				switch(key) {
					case 'disablePan':
						this._initStyle();
						/* falls through */
					case '$zoomIn':
					case '$zoomOut':
					case '$zoomRange':
					case '$reset':
						// Set these on the instance
						this[ key ] = value;
						/* falls through */
					case 'disableZoom':
					case 'onStart':
					case 'onChange':
					case 'onZoom':
					case 'onPan':
					case 'onEnd':
					case 'onReset':
					case 'eventNamespace':
						this._bind();
						break;
					case 'cursor':
						$.style(this.elem, 'cursor', value);
						break;
					case 'minScale':
						this.$zoomRange.attr('min', value);
						break;
					case 'maxScale':
						this.$zoomRange.attr('max', value);
						break;
					case 'rangeStep':
						this.$zoomRange.attr('step', value);
						break;
					case 'startTransform':
						this._buildTransform();
						break;
					case 'duration':
					case 'easing':
						this._buildTransition();
						/* falls through */
					case 'transition':
						this.transition();
						break;
					case 'panOnlyWhenZoomed':
						this._checkPanWhenZoomed();
						break;
					case '$set':
						if (value instanceof $ && value.length) {
							this.$set = value;
							// Reset styles
							this._initStyle();
							this._buildTransform();
						}
				}
			}, this));
		},

		/**
		 * Disable/enable panning depending on whether the current scale
		 * matches the minimum
		 * @param {Number} [scale]
		 * @private
		 */
		_checkPanWhenZoomed: function(scale) {
			var options = this.options;
			if (options.panOnlyWhenZoomed) {
				if (!scale) {
					scale = this.getMatrix()[0];
				}
				var toDisable = scale <= options.minScale;
				if (options.disablePan !== toDisable) {
					this.option('disablePan', toDisable);
				}
			}
		},

		/**
		 * Initialize base styles for the element and its parent
		 * @private
		 */
		_initStyle: function() {
			var styles = {
				// Set the same default whether SVG or HTML
				// transform-origin cannot be changed to 50% 50% in IE9-11 or Edge 13-14+
				'transform-origin': this.isSVG ? '0 0' : '50% 50%'
			};
			// Set elem styles
			if (!this.options.disablePan) {
				styles.cursor = this.options.cursor;
			}
			this.$set.css(styles);

			// Set parent to relative if set to static
			var $parent = this.$parent;
			// No need to add styles to the body
			if ($parent.length && !$.nodeName(this.parent, 'body')) {
				styles = {
					overflow: 'hidden'
				};
				if ($parent.css('position') === 'static') {
					styles.position = 'relative';
				}
				$parent.css(styles);
			}
		},

		/**
		 * Undo any styles attached in this plugin
		 * @private
		 */
		_resetStyle: function() {
			this.$elem.css({
				'cursor': '',
				'transition': ''
			});
			this.$parent.css({
				'overflow': '',
				'position': ''
			});
		},

		/**
		 * Binds all necessary events
		 * @private
		 */
		_bind: function() {
			var self = this;
			var options = this.options;
			var ns = options.eventNamespace;
			var str_down = 'mousedown' + ns + ' pointerdown' + ns + ' MSPointerDown' + ns;
			var str_start = 'touchstart' + ns + ' ' + str_down;
			var str_click = 'touchend' + ns + ' click' + ns + ' pointerup' + ns + ' MSPointerUp' + ns;
			var events = {};
			var $reset = this.$reset;
			var $zoomRange = this.$zoomRange;

			// Bind panzoom events from options
			$.each([ 'Start', 'Change', 'Zoom', 'Pan', 'End', 'Reset' ], function() {
				var m = options[ 'on' + this ];
				if ($.isFunction(m)) {
					events[ 'panzoom' + this.toLowerCase() + ns ] = m;
				}
			});

			// Bind $elem drag and click/touchdown events
			// Bind touchstart if either panning or zooming is enabled
			if (!options.disablePan || !options.disableZoom) {
				events[ str_start ] = function(e) {
					var touches;
					if (e.type === 'touchstart' ?
						// Touch
						(touches = e.touches || e.originalEvent.touches) &&
							((touches.length === 1 && !options.disablePan) || touches.length === 2) :
						// Mouse/Pointer: Ignore unexpected click types
						// Support: IE10 only
						// IE10 does not support e.button for MSPointerDown, but does have e.which
						!options.disablePan && (e.which || e.originalEvent.which) === options.which) {

						e.preventDefault();
						e.stopPropagation();
						self._startMove(e, touches);
					}
				};
				// Prevent the contextmenu event
				// if we're binding to right-click
				if (options.which === 3) {
					events.contextmenu = false;
				}
			}
			this.$elem.on(events);

			// Bind reset
			if ($reset.length) {
				$reset.on(str_click, function(e) {
					e.preventDefault();
					self.reset();
				});
			}

			// Set default attributes for the range input
			if ($zoomRange.length) {
				$zoomRange.attr({
					// Only set the range step if explicit or
					// set the default if there is no attribute present
					step: options.rangeStep === Panzoom.defaults.rangeStep &&
						$zoomRange.attr('step') ||
						options.rangeStep,
					min: options.minScale,
					max: options.maxScale
				}).prop({
					value: this.getMatrix()[0]
				});
			}

			// No bindings if zooming is disabled
			if (options.disableZoom) {
				return;
			}

			var $zoomIn = this.$zoomIn;
			var $zoomOut = this.$zoomOut;

			// Bind zoom in/out
			// Don't bind one without the other
			if ($zoomIn.length && $zoomOut.length) {
				// preventDefault cancels future mouse events on touch events
				$zoomIn.on(str_click, function(e) {
					e.preventDefault();
					self.zoom();
				});
				$zoomOut.on(str_click, function(e) {
					e.preventDefault();
					self.zoom(true);
				});
			}

			if ($zoomRange.length) {
				events = {};
				// Cannot prevent default action here
				events[ str_down ] = function() {
					self.transition(true);
				};
				// Zoom on input events if available and change events
				// See https://github.com/timmywil/jquery.panzoom/issues/90
				events[ (supportsInputEvent ? 'input' : 'change') + ns ] = function() {
					self.zoom(+this.value, { noSetRange: true });
				};
				$zoomRange.on(events);
			}
		},

		/**
		 * Unbind all events
		 * @private
		 */
		_unbind: function() {
			this.$elem
				.add(this.$zoomIn)
				.add(this.$zoomOut)
				.add(this.$reset)
				.off(this.options.eventNamespace);
		},

		/**
		 * Builds the original transform value
		 * @private
		 */
		_buildTransform: function() {
			// Save the original transform
			// Retrieving this also adds the correct prefixed style name
			// to jQuery's internal $.cssProps
			return this._origTransform = this.getTransform(this.options.startTransform);
		},

		/**
		 * Set transition property for later use when zooming
		 * @private
		 */
		_buildTransition: function() {
			if (this._transform) {
				var options = this.options;
				this._transition = this._transform + ' ' + options.duration + 'ms ' + options.easing;
			}
		},

		/**
		 * Calculates the distance between two touch points
		 * Remember pythagorean?
		 * @param {Array} touches
		 * @returns {Number} Returns the distance
		 * @private
		 */
		_getDistance: function(touches) {
			var touch1 = touches[0];
			var touch2 = touches[1];
			return Math.sqrt(Math.pow(Math.abs(touch2.clientX - touch1.clientX), 2) + Math.pow(Math.abs(touch2.clientY - touch1.clientY), 2));
		},

		/**
		 * Constructs an approximated point in the middle of two touch points
		 * @returns {Object} Returns an object containing pageX and pageY
		 * @private
		 */
		_getMiddle: function(touches) {
			var touch1 = touches[0];
			var touch2 = touches[1];
			return {
				clientX: ((touch2.clientX - touch1.clientX) / 2) + touch1.clientX,
				clientY: ((touch2.clientY - touch1.clientY) / 2) + touch1.clientY
			};
		},

		/**
		 * Trigger a panzoom event on our element
		 * The event is passed the Panzoom instance
		 * @param {String|jQuery.Event} event
		 * @param {Mixed} arg1[, arg2, arg3, ...] Arguments to append to the trigger
		 * @private
		 */
		_trigger: function (event) {
			if (typeof event === 'string') {
				event = 'panzoom' + event;
			}
			this.$elem.triggerHandler(event, [this].concat(slice.call(arguments, 1)));
		},

		/**
		 * Starts the pan
		 * This is bound to mouse/touchmove on the element
		 * @param {jQuery.Event} event An event with pageX, pageY, and possibly the touches list
		 * @param {TouchList} [touches] The touches list if present
		 * @private
		 */
		_startMove: function(event, touches) {
			if (this.panning) {
				return;
			}
			var moveEvent, endEvent,
				startDistance, startScale, startMiddle,
				startPageX, startPageY, touch;
			var self = this;
			var options = this.options;
			var ns = options.eventNamespace;
			var matrix = this.getMatrix();
			var original = matrix.slice(0);
			var origPageX = +original[4];
			var origPageY = +original[5];
			var panOptions = { matrix: matrix, animate: 'skip' };
			var type = event.type;

			// Use proper events
			if (type === 'pointerdown') {
				moveEvent = 'pointermove';
				endEvent = 'pointerup';
			} else if (type === 'touchstart') {
				moveEvent = 'touchmove';
				endEvent = 'touchend';
			} else if (type === 'MSPointerDown') {
				moveEvent = 'MSPointerMove';
				endEvent = 'MSPointerUp';
			} else {
				moveEvent = 'mousemove';
				endEvent = 'mouseup';
			}

			// Add namespace
			moveEvent += ns;
			endEvent += ns;

			// Remove any transitions happening
			this.transition(true);

			// Indicate that we are currently panning
			this.panning = true;

			// Trigger start event
			this._trigger('start', event, touches);

			var setStart = function(event, touches) {
				if (touches) {
					if (touches.length === 2) {
						if (startDistance != null) {
							return;
						}
						startDistance = self._getDistance(touches);
						startScale = +matrix[0];
						startMiddle = self._getMiddle(touches);
						return;
					}
					if (startPageX != null) {
						return;
					}
					if ((touch = touches[0])) {
						startPageX = touch.pageX;
						startPageY = touch.pageY;
					}
				}
				if (startPageX != null) {
					return;
				}
				startPageX = event.pageX;
				startPageY = event.pageY;
			};

			setStart(event, touches);

			var move = function(e) {
				var coords;
				e.preventDefault();
				touches = e.touches || e.originalEvent.touches;
				setStart(e, touches);

				if (touches) {
					if (touches.length === 2) {

						// Calculate move on middle point
						var middle = self._getMiddle(touches);
						var diff = self._getDistance(touches) - startDistance;

						// Set zoom
						self.zoom(diff * (options.increment / 100) + startScale, {
							focal: middle,
							matrix: matrix,
							animate: 'skip'
						});

						// Set pan
						self.pan(
							+matrix[4] + middle.clientX - startMiddle.clientX,
							+matrix[5] + middle.clientY - startMiddle.clientY,
							panOptions
						);
						startMiddle = middle;
						return;
					}
					coords = touches[0] || { pageX: 0, pageY: 0 };
				}

				if (!coords) {
					coords = e;
				}

				self.pan(
					origPageX + coords.pageX - startPageX,
					origPageY + coords.pageY - startPageY,
					panOptions
				);
			};

			// Bind the handlers
			$(document)
				.off(ns)
				.on(moveEvent, move)
				.on(endEvent, function(e) {
					e.preventDefault();
					// Unbind all document events
					$(this).off(ns);
					self.panning = false;
					// Trigger our end event
					// Simply set the type to "panzoomend" to pass through all end properties
					// jQuery's `not` is used here to compare Array equality
					e.type = 'panzoomend';
					self._trigger(e, matrix, !matrixEquals(matrix, original));
				});
		}
	};

	// Add Panzoom as a static property
	$.Panzoom = Panzoom;

	/**
	 * Extend jQuery
	 * @param {Object|String} options - The name of a method to call on the prototype
	 *  or an object literal of options
	 * @returns {jQuery|Mixed} jQuery instance for regular chaining or the return value(s) of a panzoom method call
	 */
	$.fn.panzoom = function(options) {
		var instance, args, m, ret;

		// Call methods widget-style
		if (typeof options === 'string') {
			ret = [];
			args = slice.call(arguments, 1);
			this.each(function() {
				instance = $.data(this, datakey);

				if (!instance) {
					ret.push(undefined);

				// Ignore methods beginning with `_`
				} else if (options.charAt(0) !== '_' &&
					typeof (m = instance[ options ]) === 'function' &&
					// If nothing is returned, do not add to return values
					(m = m.apply(instance, args)) !== undefined) {

					ret.push(m);
				}
			});

			// Return an array of values for the jQuery instances
			// Or the value itself if there is only one
			// Or keep chaining
			return ret.length ?
				(ret.length === 1 ? ret[0] : ret) :
				this;
		}

		return this.each(function() { new Panzoom(this, options); });
	};

	return Panzoom;
}));

/* jquery.signalR.core.js */
/*global window:false */
/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *
 */

/// <reference path="Scripts/jquery-1.6.4.js" />
/// <reference path="jquery.signalR.version.js" />
(function ($, window, undefined) {

    var resources = {
        nojQuery: "jQuery was not found. Please ensure jQuery is referenced before the SignalR client JavaScript file.",
        noTransportOnInit: "No transport could be initialized successfully. Try specifying a different transport or none at all for auto initialization.",
        errorOnNegotiate: "Error during negotiation request.",
        stoppedWhileLoading: "The connection was stopped during page load.",
        stoppedWhileNegotiating: "The connection was stopped during the negotiate request.",
        errorParsingNegotiateResponse: "Error parsing negotiate response.",
        errorDuringStartRequest: "Error during start request. Stopping the connection.",
        stoppedDuringStartRequest: "The connection was stopped during the start request.",
        errorParsingStartResponse: "Error parsing start response: '{0}'. Stopping the connection.",
        invalidStartResponse: "Invalid start response: '{0}'. Stopping the connection.",
        protocolIncompatible: "You are using a version of the client that isn't compatible with the server. Client version {0}, server version {1}.",
        sendFailed: "Send failed.",
        parseFailed: "Failed at parsing response: {0}",
        longPollFailed: "Long polling request failed.",
        eventSourceFailedToConnect: "EventSource failed to connect.",
        eventSourceError: "Error raised by EventSource",
        webSocketClosed: "WebSocket closed.",
        pingServerFailedInvalidResponse: "Invalid ping response when pinging server: '{0}'.",
        pingServerFailed: "Failed to ping server.",
        pingServerFailedStatusCode: "Failed to ping server.  Server responded with status code {0}, stopping the connection.",
        pingServerFailedParse: "Failed to parse ping server response, stopping the connection.",
        noConnectionTransport: "Connection is in an invalid state, there is no transport active.",
        webSocketsInvalidState: "The Web Socket transport is in an invalid state, transitioning into reconnecting.",
        reconnectTimeout: "Couldn't reconnect within the configured timeout of {0} ms, disconnecting.",
        reconnectWindowTimeout: "The client has been inactive since {0} and it has exceeded the inactivity timeout of {1} ms. Stopping the connection."
    };

    if (typeof ($) !== "function") {
        // no jQuery!
        throw new Error(resources.nojQuery);
    }

    var signalR,
        _connection,
        _pageLoaded = (window.document.readyState === "complete"),
        _pageWindow = $(window),
        _negotiateAbortText = "__Negotiate Aborted__",
        events = {
            onStart: "onStart",
            onStarting: "onStarting",
            onReceived: "onReceived",
            onError: "onError",
            onConnectionSlow: "onConnectionSlow",
            onReconnecting: "onReconnecting",
            onReconnect: "onReconnect",
            onStateChanged: "onStateChanged",
            onDisconnect: "onDisconnect"
        },
        ajaxDefaults = {
            processData: true,
            timeout: null,
            async: true,
            global: false,
            cache: false
        },
        log = function (msg, logging) {
            if (logging === false) {
                return;
            }
            var m;
            if (typeof (window.console) === "undefined") {
                return;
            }
            m = "[" + new Date().toTimeString() + "] SignalR: " + msg;
            if (window.console.debug) {
                window.console.debug(m);
            } else if (window.console.log) {
                window.console.log(m);
            }
        },

        changeState = function (connection, expectedState, newState) {
            if (expectedState === connection.state) {
                connection.state = newState;

                $(connection).triggerHandler(events.onStateChanged, [{ oldState: expectedState, newState: newState }]);
                return true;
            }

            return false;
        },

        isDisconnecting = function (connection) {
            return connection.state === signalR.connectionState.disconnected;
        },

        supportsKeepAlive = function (connection) {
            return connection._.keepAliveData.activated &&
                   connection.transport.supportsKeepAlive(connection);
        },

        configureStopReconnectingTimeout = function (connection) {
            var stopReconnectingTimeout,
                onReconnectTimeout;

            // Check if this connection has already been configured to stop reconnecting after a specified timeout.
            // Without this check if a connection is stopped then started events will be bound multiple times.
            if (!connection._.configuredStopReconnectingTimeout) {
                onReconnectTimeout = function (connection) {
                    var message = signalR._.format(signalR.resources.reconnectTimeout, connection.disconnectTimeout);
                    connection.log(message);
                    $(connection).triggerHandler(events.onError, [signalR._.error(message, /* source */ "TimeoutException")]);
                    connection.stop(/* async */ false, /* notifyServer */ false);
                };

                connection.reconnecting(function () {
                    var connection = this;

                    // Guard against state changing in a previous user defined even handler
                    if (connection.state === signalR.connectionState.reconnecting) {
                        stopReconnectingTimeout = window.setTimeout(function () { onReconnectTimeout(connection); }, connection.disconnectTimeout);
                    }
                });

                connection.stateChanged(function (data) {
                    if (data.oldState === signalR.connectionState.reconnecting) {
                        // Clear the pending reconnect timeout check
                        window.clearTimeout(stopReconnectingTimeout);
                    }
                });

                connection._.configuredStopReconnectingTimeout = true;
            }
        };

    signalR = function (url, qs, logging) {
        /// <summary>Creates a new SignalR connection for the given url</summary>
        /// <param name="url" type="String">The URL of the long polling endpoint</param>
        /// <param name="qs" type="Object">
        ///     [Optional] Custom querystring parameters to add to the connection URL.
        ///     If an object, every non-function member will be added to the querystring.
        ///     If a string, it's added to the QS as specified.
        /// </param>
        /// <param name="logging" type="Boolean">
        ///     [Optional] A flag indicating whether connection logging is enabled to the browser
        ///     console/log. Defaults to false.
        /// </param>

        return new signalR.fn.init(url, qs, logging);
    };

    signalR._ = {
        defaultContentType: "application/x-www-form-urlencoded; charset=UTF-8",

        ieVersion: (function () {
            var version,
                matches;

            if (window.navigator.appName === 'Microsoft Internet Explorer') {
                // Check if the user agent has the pattern "MSIE (one or more numbers).(one or more numbers)";
                matches = /MSIE ([0-9]+\.[0-9]+)/.exec(window.navigator.userAgent);

                if (matches) {
                    version = window.parseFloat(matches[1]);
                }
            }

            // undefined value means not IE
            return version;
        })(),

        error: function (message, source, context) {
            var e = new Error(message);
            e.source = source;

            if (typeof context !== "undefined") {
                e.context = context;
            }

            return e;
        },

        transportError: function (message, transport, source, context) {
            var e = this.error(message, source, context);
            e.transport = transport ? transport.name : undefined;
            return e;
        },

        format: function () {
            /// <summary>Usage: format("Hi {0}, you are {1}!", "Foo", 100) </summary>
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                s = s.replace("{" + i + "}", arguments[i + 1]);
            }
            return s;
        },

        firefoxMajorVersion: function (userAgent) {
            // Firefox user agents: http://useragentstring.com/pages/Firefox/
            var matches = userAgent.match(/Firefox\/(\d+)/);
            if (!matches || !matches.length || matches.length < 2) {
                return 0;
            }
            return parseInt(matches[1], 10 /* radix */);
        },

        configurePingInterval: function (connection) {
            var config = connection._.config,
                onFail = function (error) {
                    $(connection).triggerHandler(events.onError, [error]);
                };

            if (config && !connection._.pingIntervalId && config.pingInterval) {
                connection._.pingIntervalId = window.setInterval(function () {
                    signalR.transports._logic.pingServer(connection).fail(onFail);
                }, config.pingInterval);
            }
        }
    };

    signalR.events = events;

    signalR.resources = resources;

    signalR.ajaxDefaults = ajaxDefaults;

    signalR.changeState = changeState;

    signalR.isDisconnecting = isDisconnecting;

    signalR.connectionState = {
        connecting: 0,
        connected: 1,
        reconnecting: 2,
        disconnected: 4
    };

    signalR.hub = {
        start: function () {
            // This will get replaced with the real hub connection start method when hubs is referenced correctly
            throw new Error("SignalR: Error loading hubs. Ensure your hubs reference is correct, e.g. <script src='/signalr/js'></script>.");
        }
    };

    //_pageWindow.load(function () { _pageLoaded = true; });
    _pageWindow.on("load", function () { _pageLoaded = true; });
    function validateTransport(requestedTransport, connection) {
        /// <summary>Validates the requested transport by cross checking it with the pre-defined signalR.transports</summary>
        /// <param name="requestedTransport" type="Object">The designated transports that the user has specified.</param>
        /// <param name="connection" type="signalR">The connection that will be using the requested transports.  Used for logging purposes.</param>
        /// <returns type="Object" />

        if ($.isArray(requestedTransport)) {
            // Go through transport array and remove an "invalid" tranports
            for (var i = requestedTransport.length - 1; i >= 0; i--) {
                var transport = requestedTransport[i];
                if ($.type(transport) !== "string" || !signalR.transports[transport]) {
                    connection.log("Invalid transport: " + transport + ", removing it from the transports list.");
                    requestedTransport.splice(i, 1);
                }
            }

            // Verify we still have transports left, if we dont then we have invalid transports
            if (requestedTransport.length === 0) {
                connection.log("No transports remain within the specified transport array.");
                requestedTransport = null;
            }
        } else if (!signalR.transports[requestedTransport] && requestedTransport !== "auto") {
            connection.log("Invalid transport: " + requestedTransport.toString() + ".");
            requestedTransport = null;
        } else if (requestedTransport === "auto" && signalR._.ieVersion <= 8) {
            // If we're doing an auto transport and we're IE8 then force longPolling, #1764
            return ["longPolling"];

        }

        return requestedTransport;
    }

    function getDefaultPort(protocol) {
        if (protocol === "http:") {
            return 80;
        } else if (protocol === "https:") {
            return 443;
        }
    }

    function addDefaultPort(protocol, url) {
        // Remove ports  from url.  We have to check if there's a / or end of line
        // following the port in order to avoid removing ports such as 8080.
        if (url.match(/:\d+$/)) {
            return url;
        } else {
            return url + ":" + getDefaultPort(protocol);
        }
    }

    function ConnectingMessageBuffer(connection, drainCallback) {
        var that = this,
            buffer = [];

        that.tryBuffer = function (message) {
            if (connection.state === $.signalR.connectionState.connecting) {
                buffer.push(message);

                return true;
            }

            return false;
        };

        that.drain = function () {
            // Ensure that the connection is connected when we drain (do not want to drain while a connection is not active)
            if (connection.state === $.signalR.connectionState.connected) {
                while (buffer.length > 0) {
                    drainCallback(buffer.shift());
                }
            }
        };

        that.clear = function () {
            buffer = [];
        };
    }

    signalR.fn = signalR.prototype = {
        init: function (url, qs, logging) {
            var $connection = $(this);

            this.url = url;
            this.qs = qs;
            this.lastError = null;
            this._ = {
                keepAliveData: {},
                connectingMessageBuffer: new ConnectingMessageBuffer(this, function (message) {
                    $connection.triggerHandler(events.onReceived, [message]);
                }),
                lastMessageAt: new Date().getTime(),
                lastActiveAt: new Date().getTime(),
                beatInterval: 5000, // Default value, will only be overridden if keep alive is enabled,
                beatHandle: null,
                totalTransportConnectTimeout: 0 // This will be the sum of the TransportConnectTimeout sent in response to negotiate and connection.transportConnectTimeout
            };
            if (typeof (logging) === "boolean") {
                this.logging = logging;
            }
        },

        _parseResponse: function (response) {
            var that = this;

            if (!response) {
                return response;
            } else if (typeof response === "string") {
                return that.json.parse(response);
            } else {
                return response;
            }
        },

        _originalJson: window.JSON,

        json: window.JSON,

        isCrossDomain: function (url, against) {
            /// <summary>Checks if url is cross domain</summary>
            /// <param name="url" type="String">The base URL</param>
            /// <param name="against" type="Object">
            ///     An optional argument to compare the URL against, if not specified it will be set to window.location.
            ///     If specified it must contain a protocol and a host property.
            /// </param>
            var link;

            url = $.trim(url);

            against = against || window.location;

            if (url.indexOf("http") !== 0) {
                return false;
            }

            // Create an anchor tag.
            link = window.document.createElement("a");
            link.href = url;

            // When checking for cross domain we have to special case port 80 because the window.location will remove the 
            return link.protocol + addDefaultPort(link.protocol, link.host) !== against.protocol + addDefaultPort(against.protocol, against.host);
        },

        ajaxDataType: "text",

        contentType: "application/json; charset=UTF-8",

        logging: false,

        state: signalR.connectionState.disconnected,

        clientProtocol: "1.5",

        reconnectDelay: 2000,

        transportConnectTimeout: 0,

        disconnectTimeout: 30000, // This should be set by the server in response to the negotiate request (30s default)

        reconnectWindow: 30000, // This should be set by the server in response to the negotiate request 

        keepAliveWarnAt: 2 / 3, // Warn user of slow connection if we breach the X% mark of the keep alive timeout

        start: function (options, callback) {
            /// <summary>Starts the connection</summary>
            /// <param name="options" type="Object">Options map</param>
            /// <param name="callback" type="Function">A callback function to execute when the connection has started</param>
            var connection = this,
                config = {
                    pingInterval: 300000,
                    waitForPageLoad: true,
                    transport: "auto",
                    jsonp: false
                },
                initialize,
                deferred = connection._deferral || $.Deferred(), // Check to see if there is a pre-existing deferral that's being built on, if so we want to keep using it
                parser = window.document.createElement("a");

            connection.lastError = null;

            // Persist the deferral so that if start is called multiple times the same deferral is used.
            connection._deferral = deferred;

            if (!connection.json) {
                // no JSON!
                throw new Error("SignalR: No JSON parser found. Please ensure json2.js is referenced before the SignalR.js file if you need to support clients without native JSON parsing support, e.g. IE<8.");
            }

            if ($.type(options) === "function") {
                // Support calling with single callback parameter
                callback = options;
            } else if ($.type(options) === "object") {
                $.extend(config, options);
                if ($.type(config.callback) === "function") {
                    callback = config.callback;
                }
            }

            config.transport = validateTransport(config.transport, connection);

            // If the transport is invalid throw an error and abort start
            if (!config.transport) {
                throw new Error("SignalR: Invalid transport(s) specified, aborting start.");
            }

            connection._.config = config;

            // Check to see if start is being called prior to page load
            // If waitForPageLoad is true we then want to re-direct function call to the window load event
            if (!_pageLoaded && config.waitForPageLoad === true) {
                connection._.deferredStartHandler = function () {
                    connection.start(options, callback);
                };
                _pageWindow.bind("load", connection._.deferredStartHandler);

                return deferred.promise();
            }

            // If we're already connecting just return the same deferral as the original connection start
            if (connection.state === signalR.connectionState.connecting) {
                return deferred.promise();
            } else if (changeState(connection,
                            signalR.connectionState.disconnected,
                            signalR.connectionState.connecting) === false) {
                // We're not connecting so try and transition into connecting.
                // If we fail to transition then we're either in connected or reconnecting.

                deferred.resolve(connection);
                return deferred.promise();
            }

            configureStopReconnectingTimeout(connection);

            // Resolve the full url
            parser.href = connection.url;
            if (!parser.protocol || parser.protocol === ":") {
                connection.protocol = window.document.location.protocol;
                connection.host = parser.host || window.document.location.host;
            } else {
                connection.protocol = parser.protocol;
                connection.host = parser.host;
            }

            connection.baseUrl = connection.protocol + "//" + connection.host;

            // Set the websocket protocol
            connection.wsProtocol = connection.protocol === "https:" ? "wss://" : "ws://";

            // If jsonp with no/auto transport is specified, then set the transport to long polling
            // since that is the only transport for which jsonp really makes sense.
            // Some developers might actually choose to specify jsonp for same origin requests
            // as demonstrated by Issue #623.
            if (config.transport === "auto" && config.jsonp === true) {
                config.transport = "longPolling";
            }

            // If the url is protocol relative, prepend the current windows protocol to the url. 
            if (connection.url.indexOf("//") === 0) {
                connection.url = window.location.protocol + connection.url;
                connection.log("Protocol relative URL detected, normalizing it to '" + connection.url + "'.");
            }

            if (this.isCrossDomain(connection.url)) {
                connection.log("Auto detected cross domain url.");

                if (config.transport === "auto") {
                    // TODO: Support XDM with foreverFrame
                    config.transport = ["webSockets", "serverSentEvents", "longPolling"];
                }

                if (typeof (config.withCredentials) === "undefined") {
                    config.withCredentials = true;
                }

                // Determine if jsonp is the only choice for negotiation, ajaxSend and ajaxAbort.
                // i.e. if the browser doesn't supports CORS
                // If it is, ignore any preference to the contrary, and switch to jsonp.
                if (!config.jsonp) {
                    config.jsonp = !$.support.cors;

                    if (config.jsonp) {
                        connection.log("Using jsonp because this browser doesn't support CORS.");
                    }
                }

                connection.contentType = signalR._.defaultContentType;
            }

            connection.withCredentials = config.withCredentials;

            connection.ajaxDataType = config.jsonp ? "jsonp" : "text";

            $(connection).bind(events.onStart, function (e, data) {
                if ($.type(callback) === "function") {
                    callback.call(connection);
                }
                deferred.resolve(connection);
            });

            connection._.initHandler = signalR.transports._logic.initHandler(connection);

            initialize = function (transports, index) {
                var noTransportError = signalR._.error(resources.noTransportOnInit);

                index = index || 0;
                if (index >= transports.length) {
                    if (index === 0) {
                        connection.log("No transports supported by the server were selected.");
                    } else if (index === 1) {
                        connection.log("No fallback transports were selected.");
                    } else {
                        connection.log("Fallback transports exhausted.");
                    }

                    // No transport initialized successfully
                    $(connection).triggerHandler(events.onError, [noTransportError]);
                    deferred.reject(noTransportError);
                    // Stop the connection if it has connected and move it into the disconnected state
                    connection.stop();
                    return;
                }

                // The connection was aborted
                if (connection.state === signalR.connectionState.disconnected) {
                    return;
                }

                var transportName = transports[index],
                    transport = signalR.transports[transportName],
                    onFallback = function () {
                        initialize(transports, index + 1);
                    };

                connection.transport = transport;

                try {
                    connection._.initHandler.start(transport, function () { // success
                        // Firefox 11+ doesn't allow sync XHR withCredentials: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#withCredentials
                        var isFirefox11OrGreater = signalR._.firefoxMajorVersion(window.navigator.userAgent) >= 11,
                            asyncAbort = !!connection.withCredentials && isFirefox11OrGreater;

                        connection.log("The start request succeeded. Transitioning to the connected state.");

                        if (supportsKeepAlive(connection)) {
                            signalR.transports._logic.monitorKeepAlive(connection);
                        }

                        signalR.transports._logic.startHeartbeat(connection);

                        // Used to ensure low activity clients maintain their authentication.
                        // Must be configured once a transport has been decided to perform valid ping requests.
                        signalR._.configurePingInterval(connection);

                        if (!changeState(connection,
                                            signalR.connectionState.connecting,
                                            signalR.connectionState.connected)) {
                            connection.log("WARNING! The connection was not in the connecting state.");
                        }

                        // Drain any incoming buffered messages (messages that came in prior to connect)
                        connection._.connectingMessageBuffer.drain();

                        $(connection).triggerHandler(events.onStart);

                        // wire the stop handler for when the user leaves the page
                        _pageWindow.bind("unload", function () {
                            connection.log("Window unloading, stopping the connection.");

                            connection.stop(asyncAbort);
                        });

                        if (isFirefox11OrGreater) {
                            // Firefox does not fire cross-domain XHRs in the normal unload handler on tab close.
                            // #2400
                            _pageWindow.bind("beforeunload", function () {
                                // If connection.stop() runs runs in beforeunload and fails, it will also fail
                                // in unload unless connection.stop() runs after a timeout.
                                window.setTimeout(function () {
                                    connection.stop(asyncAbort);
                                }, 0);
                            });
                        }
                    }, onFallback);
                }
                catch (error) {
                    connection.log(transport.name + " transport threw '" + error.message + "' when attempting to start.");
                    onFallback();
                }
            };

            var url = connection.url + "/negotiate",
                onFailed = function (error, connection) {
                    var err = signalR._.error(resources.errorOnNegotiate, error, connection._.negotiateRequest);

                    $(connection).triggerHandler(events.onError, err);
                    deferred.reject(err);
                    // Stop the connection if negotiate failed
                    connection.stop();
                };

            $(connection).triggerHandler(events.onStarting);

            url = signalR.transports._logic.prepareQueryString(connection, url);

            connection.log("Negotiating with '" + url + "'.");

            // Save the ajax negotiate request object so we can abort it if stop is called while the request is in flight.
            connection._.negotiateRequest = signalR.transports._logic.ajax(connection, {
                url: url,
                error: function (error, statusText) {
                    // We don't want to cause any errors if we're aborting our own negotiate request.
                    if (statusText !== _negotiateAbortText) {
                        onFailed(error, connection);
                    } else {
                        // This rejection will noop if the deferred has already been resolved or rejected.
                        deferred.reject(signalR._.error(resources.stoppedWhileNegotiating, null /* error */, connection._.negotiateRequest));
                    }
                },
                success: function (result) {
                    var res,
                        keepAliveData,
                        protocolError,
                        transports = [],
                        supportedTransports = [];

                    try {
                        res = connection._parseResponse(result);
                    } catch (error) {
                        onFailed(signalR._.error(resources.errorParsingNegotiateResponse, error), connection);
                        return;
                    }

                    keepAliveData = connection._.keepAliveData;
                    connection.appRelativeUrl = res.Url;
                    connection.id = res.ConnectionId;
                    connection.token = res.ConnectionToken;
                    connection.webSocketServerUrl = res.WebSocketServerUrl;

                    // The long poll timeout is the ConnectionTimeout plus 10 seconds
                    connection._.pollTimeout = res.ConnectionTimeout * 1000 + 10000; // in ms

                    // Once the server has labeled the PersistentConnection as Disconnected, we should stop attempting to reconnect
                    // after res.DisconnectTimeout seconds.
                    connection.disconnectTimeout = res.DisconnectTimeout * 1000; // in ms

                    // Add the TransportConnectTimeout from the response to the transportConnectTimeout from the client to calculate the total timeout
                    connection._.totalTransportConnectTimeout = connection.transportConnectTimeout + res.TransportConnectTimeout * 1000;

                    // If we have a keep alive
                    if (res.KeepAliveTimeout) {
                        // Register the keep alive data as activated
                        keepAliveData.activated = true;

                        // Timeout to designate when to force the connection into reconnecting converted to milliseconds
                        keepAliveData.timeout = res.KeepAliveTimeout * 1000;

                        // Timeout to designate when to warn the developer that the connection may be dead or is not responding.
                        keepAliveData.timeoutWarning = keepAliveData.timeout * connection.keepAliveWarnAt;

                        // Instantiate the frequency in which we check the keep alive.  It must be short in order to not miss/pick up any changes
                        connection._.beatInterval = (keepAliveData.timeout - keepAliveData.timeoutWarning) / 3;
                    } else {
                        keepAliveData.activated = false;
                    }

                    connection.reconnectWindow = connection.disconnectTimeout + (keepAliveData.timeout || 0);

                    if (!res.ProtocolVersion || res.ProtocolVersion !== connection.clientProtocol) {
                        protocolError = signalR._.error(signalR._.format(resources.protocolIncompatible, connection.clientProtocol, res.ProtocolVersion));
                        $(connection).triggerHandler(events.onError, [protocolError]);
                        deferred.reject(protocolError);

                        return;
                    }

                    $.each(signalR.transports, function (key) {
                        if ((key.indexOf("_") === 0) || (key === "webSockets" && !res.TryWebSockets)) {
                            return true;
                        }
                        supportedTransports.push(key);
                    });

                    if ($.isArray(config.transport)) {
                        $.each(config.transport, function (_, transport) {
                            if ($.inArray(transport, supportedTransports) >= 0) {
                                transports.push(transport);
                            }
                        });
                    } else if (config.transport === "auto") {
                        transports = supportedTransports;
                    } else if ($.inArray(config.transport, supportedTransports) >= 0) {
                        transports.push(config.transport);
                    }

                    initialize(transports);
                }
            });

            return deferred.promise();
        },

        starting: function (callback) {
            /// <summary>Adds a callback that will be invoked before anything is sent over the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute before the connection is fully instantiated.</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onStarting, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        send: function (data) {
            /// <summary>Sends data over the connection</summary>
            /// <param name="data" type="String">The data to send over the connection</param>
            /// <returns type="signalR" />
            var connection = this;

            if (connection.state === signalR.connectionState.disconnected) {
                // Connection hasn't been started yet
                throw new Error("SignalR: Connection must be started before data can be sent. Call .start() before .send()");
            }

            if (connection.state === signalR.connectionState.connecting) {
                // Connection hasn't been started yet
                throw new Error("SignalR: Connection has not been fully initialized. Use .start().done() or .start().fail() to run logic after the connection has started.");
            }

            connection.transport.send(connection, data);
            // REVIEW: Should we return deferred here?
            return connection;
        },

        received: function (callback) {
            /// <summary>Adds a callback that will be invoked after anything is received over the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when any data is received on the connection</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReceived, function (e, data) {
                callback.call(connection, data);
            });
            return connection;
        },

        stateChanged: function (callback) {
            /// <summary>Adds a callback that will be invoked when the connection state changes</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection state changes</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onStateChanged, function (e, data) {
                callback.call(connection, data);
            });
            return connection;
        },

        error: function (callback) {
            /// <summary>Adds a callback that will be invoked after an error occurs with the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when an error occurs on the connection</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onError, function (e, errorData, sendData) {
                connection.lastError = errorData;
                // In practice 'errorData' is the SignalR built error object.
                // In practice 'sendData' is undefined for all error events except those triggered by
                // 'ajaxSend' and 'webSockets.send'.'sendData' is the original send payload.
                callback.call(connection, errorData, sendData);
            });
            return connection;
        },

        disconnected: function (callback) {
            /// <summary>Adds a callback that will be invoked when the client disconnects</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is broken</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onDisconnect, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        connectionSlow: function (callback) {
            /// <summary>Adds a callback that will be invoked when the client detects a slow connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is slow</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onConnectionSlow, function (e, data) {
                callback.call(connection);
            });

            return connection;
        },

        reconnecting: function (callback) {
            /// <summary>Adds a callback that will be invoked when the underlying transport begins reconnecting</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection enters a reconnecting state</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReconnecting, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        reconnected: function (callback) {
            /// <summary>Adds a callback that will be invoked when the underlying transport reconnects</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is restored</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReconnect, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        stop: function (async, notifyServer) {
            /// <summary>Stops listening</summary>
            /// <param name="async" type="Boolean">Whether or not to asynchronously abort the connection</param>
            /// <param name="notifyServer" type="Boolean">Whether we want to notify the server that we are aborting the connection</param>
            /// <returns type="signalR" />
            var connection = this,
                // Save deferral because this is always cleaned up
                deferral = connection._deferral;

            // Verify that we've bound a load event.
            if (connection._.deferredStartHandler) {
                // Unbind the event.
                _pageWindow.unbind("load", connection._.deferredStartHandler);
            }

            // Always clean up private non-timeout based state.
            delete connection._.config;
            delete connection._.deferredStartHandler;

            // This needs to be checked despite the connection state because a connection start can be deferred until page load.
            // If we've deferred the start due to a page load we need to unbind the "onLoad" -> start event.
            if (!_pageLoaded && (!connection._.config || connection._.config.waitForPageLoad === true)) {
                connection.log("Stopping connection prior to negotiate.");

                // If we have a deferral we should reject it
                if (deferral) {
                    deferral.reject(signalR._.error(resources.stoppedWhileLoading));
                }

                // Short-circuit because the start has not been fully started.
                return;
            }

            if (connection.state === signalR.connectionState.disconnected) {
                return;
            }

            connection.log("Stopping connection.");

            changeState(connection, connection.state, signalR.connectionState.disconnected);

            // Clear this no matter what
            window.clearTimeout(connection._.beatHandle);
            window.clearInterval(connection._.pingIntervalId);

            if (connection.transport) {
                connection.transport.stop(connection);

                if (notifyServer !== false) {
                    connection.transport.abort(connection, async);
                }

                if (supportsKeepAlive(connection)) {
                    signalR.transports._logic.stopMonitoringKeepAlive(connection);
                }

                connection.transport = null;
            }

            if (connection._.negotiateRequest) {
                // If the negotiation request has already completed this will noop.
                connection._.negotiateRequest.abort(_negotiateAbortText);
                delete connection._.negotiateRequest;
            }

            // Ensure that initHandler.stop() is called before connection._deferral is deleted
            if (connection._.initHandler) {
                connection._.initHandler.stop();
            }

            // Trigger the disconnect event
            $(connection).triggerHandler(events.onDisconnect);

            delete connection._deferral;
            delete connection.messageId;
            delete connection.groupsToken;
            delete connection.id;
            delete connection._.pingIntervalId;
            delete connection._.lastMessageAt;
            delete connection._.lastActiveAt;

            // Clear out our message buffer
            connection._.connectingMessageBuffer.clear();

            return connection;
        },

        log: function (msg) {
            log(msg, this.logging);
        }
    };

    signalR.fn.init.prototype = signalR.fn;

    signalR.noConflict = function () {
        /// <summary>Reinstates the original value of $.connection and returns the signalR object for manual assignment</summary>
        /// <returns type="signalR" />
        if ($.connection === signalR) {
            $.connection = _connection;
        }
        return signalR;
    };

    if ($.connection) {
        _connection = $.connection;
    }

    $.connection = $.signalR = signalR;

}(window.jQuery, window));
/* jquery.signalR.transports.common.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        startAbortText = "__Start Aborted__",
        transportLogic;

    signalR.transports = {};

    function beat(connection) {
        if (connection._.keepAliveData.monitoring) {
            checkIfAlive(connection);
        }

        // Ensure that we successfully marked active before continuing the heartbeat.
        if (transportLogic.markActive(connection)) {
            connection._.beatHandle = window.setTimeout(function () {
                beat(connection);
            }, connection._.beatInterval);
        }
    }

    function checkIfAlive(connection) {
        var keepAliveData = connection._.keepAliveData,
            timeElapsed;

        // Only check if we're connected
        if (connection.state === signalR.connectionState.connected) {
            timeElapsed = new Date().getTime() - connection._.lastMessageAt;

            // Check if the keep alive has completely timed out
            if (timeElapsed >= keepAliveData.timeout) {
                connection.log("Keep alive timed out.  Notifying transport that connection has been lost.");

                // Notify transport that the connection has been lost
                connection.transport.lostConnection(connection);
            } else if (timeElapsed >= keepAliveData.timeoutWarning) {
                // This is to assure that the user only gets a single warning
                if (!keepAliveData.userNotified) {
                    connection.log("Keep alive has been missed, connection may be dead/slow.");
                    $(connection).triggerHandler(events.onConnectionSlow);
                    keepAliveData.userNotified = true;
                }
            } else {
                keepAliveData.userNotified = false;
            }
        }
    }

    function getAjaxUrl(connection, path) {
        var url = connection.url + path;

        if (connection.transport) {
            url += "?transport=" + connection.transport.name;
        }

        return transportLogic.prepareQueryString(connection, url);
    }

    function InitHandler(connection) {
        this.connection = connection;

        this.startRequested = false;
        this.startCompleted = false;
        this.connectionStopped = false;
    }

    InitHandler.prototype = {
        start: function (transport, onSuccess, onFallback) {
            var that = this,
                connection = that.connection,
                failCalled = false;

            if (that.startRequested || that.connectionStopped) {
                connection.log("WARNING! " + transport.name + " transport cannot be started. Initialization ongoing or completed.");
                return;
            }

            connection.log(transport.name + " transport starting.");

            that.transportTimeoutHandle = window.setTimeout(function () {
                if (!failCalled) {
                    failCalled = true;
                    connection.log(transport.name + " transport timed out when trying to connect.");
                    that.transportFailed(transport, undefined, onFallback);
                }
            }, connection._.totalTransportConnectTimeout);

            transport.start(connection, function () {
                if (!failCalled) {
                    that.initReceived(transport, onSuccess);
                }
            }, function (error) {
                // Don't allow the same transport to cause onFallback to be called twice
                if (!failCalled) {
                    failCalled = true;
                    that.transportFailed(transport, error, onFallback);
                }

                // Returns true if the transport should stop;
                // false if it should attempt to reconnect
                return !that.startCompleted || that.connectionStopped;
            });
        },

        stop: function () {
            this.connectionStopped = true;
            window.clearTimeout(this.transportTimeoutHandle);
            signalR.transports._logic.tryAbortStartRequest(this.connection);
        },

        initReceived: function (transport, onSuccess) {
            var that = this,
                connection = that.connection;

            if (that.startRequested) {
                connection.log("WARNING! The client received multiple init messages.");
                return;
            }

            if (that.connectionStopped) {
                return;
            }

            that.startRequested = true;
            window.clearTimeout(that.transportTimeoutHandle);

            connection.log(transport.name + " transport connected. Initiating start request.");
            signalR.transports._logic.ajaxStart(connection, function () {
                that.startCompleted = true;
                onSuccess();
            });
        },

        transportFailed: function (transport, error, onFallback) {
            var connection = this.connection,
                deferred = connection._deferral,
                wrappedError;

            if (this.connectionStopped) {
                return;
            }

            window.clearTimeout(this.transportTimeoutHandle);

            if (!this.startRequested) {
                transport.stop(connection);

                connection.log(transport.name + " transport failed to connect. Attempting to fall back.");
                onFallback();
            } else if (!this.startCompleted) {
                // Do not attempt to fall back if a start request is ongoing during a transport failure.
                // Instead, trigger an error and stop the connection.
                wrappedError = signalR._.error(signalR.resources.errorDuringStartRequest, error);

                connection.log(transport.name + " transport failed during the start request. Stopping the connection.");
                $(connection).triggerHandler(events.onError, [wrappedError]);
                if (deferred) {
                    deferred.reject(wrappedError);
                }

                connection.stop();
            } else {
                // The start request has completed, but the connection has not stopped.
                // No need to do anything here. The transport should attempt its normal reconnect logic.
            }
        }
    };

    transportLogic = signalR.transports._logic = {
        ajax: function (connection, options) {
            return $.ajax(
                $.extend(/*deep copy*/ true, {}, $.signalR.ajaxDefaults, {
                    type: "GET",
                    data: {},
                    xhrFields: { withCredentials: connection.withCredentials },
                    contentType: connection.contentType,
                    dataType: connection.ajaxDataType
                }, options));
        },

        pingServer: function (connection) {
            /// <summary>Pings the server</summary>
            /// <param name="connection" type="signalr">Connection associated with the server ping</param>
            /// <returns type="signalR" />
            var url,
                xhr,
                deferral = $.Deferred();

            if (connection.transport) {
                url = connection.url + "/ping";

                url = transportLogic.addQs(url, connection.qs);

                xhr = transportLogic.ajax(connection, {
                    url: url,
                    success: function (result) {
                        var data;

                        try {
                            data = connection._parseResponse(result);
                        }
                        catch (error) {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR.resources.pingServerFailedParse,
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                            connection.stop();
                            return;
                        }

                        if (data.Response === "pong") {
                            deferral.resolve();
                        }
                        else {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR._.format(signalR.resources.pingServerFailedInvalidResponse, result),
                                    connection.transport,
                                    null /* error */,
                                    xhr
                                )
                            );
                        }
                    },
                    error: function (error) {
                        if (error.status === 401 || error.status === 403) {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR._.format(signalR.resources.pingServerFailedStatusCode, error.status),
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                            connection.stop();
                        }
                        else {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR.resources.pingServerFailed,
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                        }
                    }
                });
            }
            else {
                deferral.reject(
                    signalR._.transportError(
                        signalR.resources.noConnectionTransport,
                        connection.transport
                    )
                );
            }

            return deferral.promise();
        },

        prepareQueryString: function (connection, url) {
            var preparedUrl;

            // Use addQs to start since it handles the ?/& prefix for us
            preparedUrl = transportLogic.addQs(url, "clientProtocol=" + connection.clientProtocol);

            // Add the user-specified query string params if any
            preparedUrl = transportLogic.addQs(preparedUrl, connection.qs);

            if (connection.token) {
                preparedUrl += "&connectionToken=" + window.encodeURIComponent(connection.token);
            }

            if (connection.data) {
                preparedUrl += "&connectionData=" + window.encodeURIComponent(connection.data);
            }

            return preparedUrl;
        },

        addQs: function (url, qs) {
            var appender = url.indexOf("?") !== -1 ? "&" : "?",
                firstChar;

            if (!qs) {
                return url;
            }

            if (typeof (qs) === "object") {
                return url + appender + $.param(qs);
            }

            if (typeof (qs) === "string") {
                firstChar = qs.charAt(0);

                if (firstChar === "?" || firstChar === "&") {
                    appender = "";
                }

                return url + appender + qs;
            }

            throw new Error("Query string property must be either a string or object.");
        },

        // BUG #2953: The url needs to be same otherwise it will cause a memory leak
        getUrl: function (connection, transport, reconnecting, poll, ajaxPost) {
            /// <summary>Gets the url for making a GET based connect request</summary>
            var baseUrl = transport === "webSockets" ? "" : connection.baseUrl,
                url = baseUrl + connection.appRelativeUrl,
                qs = "transport=" + transport;

            if (!ajaxPost && connection.groupsToken) {
                qs += "&groupsToken=" + window.encodeURIComponent(connection.groupsToken);
            }

            if (!reconnecting) {
                url += "/connect";
            } else {
                if (poll) {
                    // longPolling transport specific
                    url += "/poll";
                } else {
                    url += "/reconnect";
                }

                if (!ajaxPost && connection.messageId) {
                    qs += "&messageId=" + window.encodeURIComponent(connection.messageId);
                }
            }
            url += "?" + qs;
            url = transportLogic.prepareQueryString(connection, url);

            if (!ajaxPost) {
                url += "&tid=" + Math.floor(Math.random() * 11);
            }

            return url;
        },

        maximizePersistentResponse: function (minPersistentResponse) {
            return {
                MessageId: minPersistentResponse.C,
                Messages: minPersistentResponse.M,
                Initialized: typeof (minPersistentResponse.S) !== "undefined" ? true : false,
                ShouldReconnect: typeof (minPersistentResponse.T) !== "undefined" ? true : false,
                LongPollDelay: minPersistentResponse.L,
                GroupsToken: minPersistentResponse.G
            };
        },

        updateGroups: function (connection, groupsToken) {
            if (groupsToken) {
                connection.groupsToken = groupsToken;
            }
        },

        stringifySend: function (connection, message) {
            if (typeof (message) === "string" || typeof (message) === "undefined" || message === null) {
                return message;
            }
            return connection.json.stringify(message);
        },

        ajaxSend: function (connection, data) {
            var payload = transportLogic.stringifySend(connection, data),
                url = getAjaxUrl(connection, "/send"),
                xhr,
                onFail = function (error, connection) {
                    $(connection).triggerHandler(events.onError, [signalR._.transportError(signalR.resources.sendFailed, connection.transport, error, xhr), data]);
                };


            xhr = transportLogic.ajax(connection, {
                url: url,
                type: connection.ajaxDataType === "jsonp" ? "GET" : "POST",
                contentType: signalR._.defaultContentType,
                data: {
                    data: payload
                },
                success: function (result) {
                    var res;

                    if (result) {
                        try {
                            res = connection._parseResponse(result);
                        }
                        catch (error) {
                            onFail(error, connection);
                            connection.stop();
                            return;
                        }

                        transportLogic.triggerReceived(connection, res);
                    }
                },
                error: function (error, textStatus) {
                    if (textStatus === "abort" || textStatus === "parsererror") {
                        // The parsererror happens for sends that don't return any data, and hence
                        // don't write the jsonp callback to the response. This is harder to fix on the server
                        // so just hack around it on the client for now.
                        return;
                    }

                    onFail(error, connection);
                }
            });

            return xhr;
        },

        ajaxAbort: function (connection, async) {
            if (typeof (connection.transport) === "undefined") {
                return;
            }

            // Async by default unless explicitly overidden
            async = typeof async === "undefined" ? true : async;

            var url = getAjaxUrl(connection, "/abort");

            transportLogic.ajax(connection, {
                url: url,
                async: async,
                timeout: 1000,
                type: "POST"
            });

            connection.log("Fired ajax abort async = " + async + ".");
        },

        ajaxStart: function (connection, onSuccess) {
            var rejectDeferred = function (error) {
                var deferred = connection._deferral;
                if (deferred) {
                    deferred.reject(error);
                }
            },
                triggerStartError = function (error) {
                    connection.log("The start request failed. Stopping the connection.");
                    $(connection).triggerHandler(events.onError, [error]);
                    rejectDeferred(error);
                    connection.stop();
                };

            connection._.startRequest = transportLogic.ajax(connection, {
                url: getAjaxUrl(connection, "/start"),
                success: function (result, statusText, xhr) {
                    var data;

                    try {
                        data = connection._parseResponse(result);
                    } catch (error) {
                        triggerStartError(signalR._.error(
                            signalR._.format(signalR.resources.errorParsingStartResponse, result),
                            error, xhr));
                        return;
                    }

                    if (data.Response === "started") {
                        onSuccess();
                    } else {
                        triggerStartError(signalR._.error(
                            signalR._.format(signalR.resources.invalidStartResponse, result),
                            null /* error */, xhr));
                    }
                },
                error: function (xhr, statusText, error) {
                    if (statusText !== startAbortText) {
                        triggerStartError(signalR._.error(
                            signalR.resources.errorDuringStartRequest,
                            error, xhr));
                    } else {
                        // Stop has been called, no need to trigger the error handler
                        // or stop the connection again with onStartError
                        connection.log("The start request aborted because connection.stop() was called.");
                        rejectDeferred(signalR._.error(
                            signalR.resources.stoppedDuringStartRequest,
                            null /* error */, xhr));
                    }
                }
            });
        },

        tryAbortStartRequest: function (connection) {
            if (connection._.startRequest) {
                // If the start request has already completed this will noop.
                connection._.startRequest.abort(startAbortText);
                delete connection._.startRequest;
            }
        },

        tryInitialize: function (persistentResponse, onInitialized) {
            if (persistentResponse.Initialized) {
                onInitialized();
            }
        },

        triggerReceived: function (connection, data) {
            if (!connection._.connectingMessageBuffer.tryBuffer(data)) {
                $(connection).triggerHandler(events.onReceived, [data]);
            }
        },

        processMessages: function (connection, minData, onInitialized) {
            var data;

            // Update the last message time stamp
            transportLogic.markLastMessage(connection);

            if (minData) {
                data = transportLogic.maximizePersistentResponse(minData);

                transportLogic.updateGroups(connection, data.GroupsToken);

                if (data.MessageId) {
                    connection.messageId = data.MessageId;
                }

                if (data.Messages) {
                    $.each(data.Messages, function (index, message) {
                        transportLogic.triggerReceived(connection, message);
                    });

                    transportLogic.tryInitialize(data, onInitialized);
                }
            }
        },

        monitorKeepAlive: function (connection) {
            var keepAliveData = connection._.keepAliveData;

            // If we haven't initiated the keep alive timeouts then we need to
            if (!keepAliveData.monitoring) {
                keepAliveData.monitoring = true;

                transportLogic.markLastMessage(connection);

                // Save the function so we can unbind it on stop
                connection._.keepAliveData.reconnectKeepAliveUpdate = function () {
                    // Mark a new message so that keep alive doesn't time out connections
                    transportLogic.markLastMessage(connection);
                };

                // Update Keep alive on reconnect
                $(connection).bind(events.onReconnect, connection._.keepAliveData.reconnectKeepAliveUpdate);

                connection.log("Now monitoring keep alive with a warning timeout of " + keepAliveData.timeoutWarning + ", keep alive timeout of " + keepAliveData.timeout + " and disconnecting timeout of " + connection.disconnectTimeout);
            } else {
                connection.log("Tried to monitor keep alive but it's already being monitored.");
            }
        },

        stopMonitoringKeepAlive: function (connection) {
            var keepAliveData = connection._.keepAliveData;

            // Only attempt to stop the keep alive monitoring if its being monitored
            if (keepAliveData.monitoring) {
                // Stop monitoring
                keepAliveData.monitoring = false;

                // Remove the updateKeepAlive function from the reconnect event
                $(connection).unbind(events.onReconnect, connection._.keepAliveData.reconnectKeepAliveUpdate);

                // Clear all the keep alive data
                connection._.keepAliveData = {};
                connection.log("Stopping the monitoring of the keep alive.");
            }
        },

        startHeartbeat: function (connection) {
            connection._.lastActiveAt = new Date().getTime();
            beat(connection);
        },

        markLastMessage: function (connection) {
            connection._.lastMessageAt = new Date().getTime();
        },

        markActive: function (connection) {
            if (transportLogic.verifyLastActive(connection)) {
                connection._.lastActiveAt = new Date().getTime();
                return true;
            }

            return false;
        },

        isConnectedOrReconnecting: function (connection) {
            return connection.state === signalR.connectionState.connected ||
                   connection.state === signalR.connectionState.reconnecting;
        },

        ensureReconnectingState: function (connection) {
            if (changeState(connection,
                        signalR.connectionState.connected,
                        signalR.connectionState.reconnecting) === true) {
                $(connection).triggerHandler(events.onReconnecting);
            }
            return connection.state === signalR.connectionState.reconnecting;
        },

        clearReconnectTimeout: function (connection) {
            if (connection && connection._.reconnectTimeout) {
                window.clearTimeout(connection._.reconnectTimeout);
                delete connection._.reconnectTimeout;
            }
        },

        verifyLastActive: function (connection) {
            if (new Date().getTime() - connection._.lastActiveAt >= connection.reconnectWindow) {
                var message = signalR._.format(signalR.resources.reconnectWindowTimeout, new Date(connection._.lastActiveAt), connection.reconnectWindow);
                connection.log(message);
                $(connection).triggerHandler(events.onError, [signalR._.error(message, /* source */ "TimeoutException")]);
                connection.stop(/* async */ false, /* notifyServer */ false);
                return false;
            }

            return true;
        },

        reconnect: function (connection, transportName) {
            var transport = signalR.transports[transportName];

            // We should only set a reconnectTimeout if we are currently connected
            // and a reconnectTimeout isn't already set.
            if (transportLogic.isConnectedOrReconnecting(connection) && !connection._.reconnectTimeout) {
                // Need to verify before the setTimeout occurs because an application sleep could occur during the setTimeout duration.
                if (!transportLogic.verifyLastActive(connection)) {
                    return;
                }

                connection._.reconnectTimeout = window.setTimeout(function () {
                    if (!transportLogic.verifyLastActive(connection)) {
                        return;
                    }

                    transport.stop(connection);

                    if (transportLogic.ensureReconnectingState(connection)) {
                        connection.log(transportName + " reconnecting.");
                        transport.start(connection);
                    }
                }, connection.reconnectDelay);
            }
        },

        handleParseFailure: function (connection, result, error, onFailed, context) {
            var wrappedError = signalR._.transportError(
                signalR._.format(signalR.resources.parseFailed, result),
                connection.transport,
                error,
                context);

            // If we're in the initialization phase trigger onFailed, otherwise stop the connection.
            if (onFailed && onFailed(wrappedError)) {
                connection.log("Failed to parse server response while attempting to connect.");
            } else {
                $(connection).triggerHandler(events.onError, [wrappedError]);
                connection.stop();
            }
        },

        initHandler: function (connection) {
            return new InitHandler(connection);
        },

        foreverFrame: {
            count: 0,
            connections: {}
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.webSockets.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic;

    signalR.transports.webSockets = {
        name: "webSockets",

        supportsKeepAlive: function () {
            return true;
        },

        send: function (connection, data) {
            var payload = transportLogic.stringifySend(connection, data);

            try {
                connection.socket.send(payload);
            } catch (ex) {
                $(connection).triggerHandler(events.onError,
                    [signalR._.transportError(
                        signalR.resources.webSocketsInvalidState,
                        connection.transport,
                        ex,
                        connection.socket
                    ),
                    data]);
            }
        },

        start: function (connection, onSuccess, onFailed) {
            var url,
                opened = false,
                that = this,
                reconnecting = !onSuccess,
                $connection = $(connection);

            if (!window.WebSocket) {
                onFailed();
                return;
            }

            if (!connection.socket) {
                if (connection.webSocketServerUrl) {
                    url = connection.webSocketServerUrl;
                } else {
                    url = connection.wsProtocol + connection.host;
                }

                url += transportLogic.getUrl(connection, this.name, reconnecting);

                connection.log("Connecting to websocket endpoint '" + url + "'.");
                connection.socket = new window.WebSocket(url);

                connection.socket.onopen = function () {
                    opened = true;
                    connection.log("Websocket opened.");

                    transportLogic.clearReconnectTimeout(connection);

                    if (changeState(connection,
                                    signalR.connectionState.reconnecting,
                                    signalR.connectionState.connected) === true) {
                        $connection.triggerHandler(events.onReconnect);
                    }
                };

                connection.socket.onclose = function (event) {
                    var error;

                    // Only handle a socket close if the close is from the current socket.
                    // Sometimes on disconnect the server will push down an onclose event
                    // to an expired socket.

                    if (this === connection.socket) {
                        if (opened && typeof event.wasClean !== "undefined" && event.wasClean === false) {
                            // Ideally this would use the websocket.onerror handler (rather than checking wasClean in onclose) but
                            // I found in some circumstances Chrome won't call onerror. This implementation seems to work on all browsers.
                            error = signalR._.transportError(
                                signalR.resources.webSocketClosed,
                                connection.transport,
                                event);

                            connection.log("Unclean disconnect from websocket: " + (event.reason || "[no reason given]."));
                        } else {
                            connection.log("Websocket closed.");
                        }

                        if (!onFailed || !onFailed(error)) {
                            if (error) {
                                $(connection).triggerHandler(events.onError, [error]);
                            }

                            that.reconnect(connection);
                        }
                    }
                };

                connection.socket.onmessage = function (event) {
                    var data;

                    try {
                        data = connection._parseResponse(event.data);
                    }
                    catch (error) {
                        transportLogic.handleParseFailure(connection, event.data, error, onFailed, event);
                        return;
                    }

                    if (data) {
                        // data.M is PersistentResponse.Messages
                        if ($.isEmptyObject(data) || data.M) {
                            transportLogic.processMessages(connection, data, onSuccess);
                        } else {
                            // For websockets we need to trigger onReceived
                            // for callbacks to outgoing hub calls.
                            transportLogic.triggerReceived(connection, data);
                        }
                    }
                };
            }
        },

        reconnect: function (connection) {
            transportLogic.reconnect(connection, this.name);
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        stop: function (connection) {
            // Don't trigger a reconnect after stopping
            transportLogic.clearReconnectTimeout(connection);

            if (connection.socket) {
                connection.log("Closing the Websocket.");
                connection.socket.close();
                connection.socket = null;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.serverSentEvents.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic,
        clearReconnectAttemptTimeout = function (connection) {
            window.clearTimeout(connection._.reconnectAttemptTimeoutHandle);
            delete connection._.reconnectAttemptTimeoutHandle;
        };

    signalR.transports.serverSentEvents = {
        name: "serverSentEvents",

        supportsKeepAlive: function () {
            return true;
        },

        timeOut: 3000,

        start: function (connection, onSuccess, onFailed) {
            var that = this,
                opened = false,
                $connection = $(connection),
                reconnecting = !onSuccess,
                url;

            if (connection.eventSource) {
                connection.log("The connection already has an event source. Stopping it.");
                connection.stop();
            }

            if (!window.EventSource) {
                if (onFailed) {
                    connection.log("This browser doesn't support SSE.");
                    onFailed();
                }
                return;
            }

            url = transportLogic.getUrl(connection, this.name, reconnecting);

            try {
                connection.log("Attempting to connect to SSE endpoint '" + url + "'.");
                connection.eventSource = new window.EventSource(url, { withCredentials: connection.withCredentials });
            }
            catch (e) {
                connection.log("EventSource failed trying to connect with error " + e.Message + ".");
                if (onFailed) {
                    // The connection failed, call the failed callback
                    onFailed();
                } else {
                    $connection.triggerHandler(events.onError, [signalR._.transportError(signalR.resources.eventSourceFailedToConnect, connection.transport, e)]);
                    if (reconnecting) {
                        // If we were reconnecting, rather than doing initial connect, then try reconnect again
                        that.reconnect(connection);
                    }
                }
                return;
            }

            if (reconnecting) {
                connection._.reconnectAttemptTimeoutHandle = window.setTimeout(function () {
                    if (opened === false) {
                        // If we're reconnecting and the event source is attempting to connect,
                        // don't keep retrying. This causes duplicate connections to spawn.
                        if (connection.eventSource.readyState !== window.EventSource.OPEN) {
                            // If we were reconnecting, rather than doing initial connect, then try reconnect again
                            that.reconnect(connection);
                        }
                    }
                },
                that.timeOut);
            }

            connection.eventSource.addEventListener("open", function (e) {
                connection.log("EventSource connected.");

                clearReconnectAttemptTimeout(connection);
                transportLogic.clearReconnectTimeout(connection);

                if (opened === false) {
                    opened = true;

                    if (changeState(connection,
                                         signalR.connectionState.reconnecting,
                                         signalR.connectionState.connected) === true) {
                        $connection.triggerHandler(events.onReconnect);
                    }
                }
            }, false);

            connection.eventSource.addEventListener("message", function (e) {
                var res;

                // process messages
                if (e.data === "initialized") {
                    return;
                }

                try {
                    res = connection._parseResponse(e.data);
                }
                catch (error) {
                    transportLogic.handleParseFailure(connection, e.data, error, onFailed, e);
                    return;
                }

                transportLogic.processMessages(connection, res, onSuccess);
            }, false);

            connection.eventSource.addEventListener("error", function (e) {
                var error = signalR._.transportError(
                    signalR.resources.eventSourceError,
                    connection.transport,
                    e);

                // Only handle an error if the error is from the current Event Source.
                // Sometimes on disconnect the server will push down an error event
                // to an expired Event Source.
                if (this !== connection.eventSource) {
                    return;
                }

                if (onFailed && onFailed(error)) {
                    return;
                }

                connection.log("EventSource readyState: " + connection.eventSource.readyState + ".");

                if (e.eventPhase === window.EventSource.CLOSED) {
                    // We don't use the EventSource's native reconnect function as it
                    // doesn't allow us to change the URL when reconnecting. We need
                    // to change the URL to not include the /connect suffix, and pass
                    // the last message id we received.
                    connection.log("EventSource reconnecting due to the server connection ending.");
                    that.reconnect(connection);
                } else {
                    // connection error
                    connection.log("EventSource error.");
                    $connection.triggerHandler(events.onError, [error]);
                }
            }, false);
        },

        reconnect: function (connection) {
            transportLogic.reconnect(connection, this.name);
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        stop: function (connection) {
            // Don't trigger a reconnect after stopping
            clearReconnectAttemptTimeout(connection);
            transportLogic.clearReconnectTimeout(connection);

            if (connection && connection.eventSource) {
                connection.log("EventSource calling close().");
                connection.eventSource.close();
                connection.eventSource = null;
                delete connection.eventSource;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.foreverFrame.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic,
        createFrame = function () {
            var frame = window.document.createElement("iframe");
            frame.setAttribute("style", "position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;");
            return frame;
        },
        // Used to prevent infinite loading icon spins in older versions of ie
        // We build this object inside a closure so we don't pollute the rest of   
        // the foreverFrame transport with unnecessary functions/utilities.
        loadPreventer = (function () {
            var loadingFixIntervalId = null,
                loadingFixInterval = 1000,
                attachedTo = 0;

            return {
                prevent: function () {
                    // Prevent additional iframe removal procedures from newer browsers
                    if (signalR._.ieVersion <= 8) {
                        // We only ever want to set the interval one time, so on the first attachedTo
                        if (attachedTo === 0) {
                            // Create and destroy iframe every 3 seconds to prevent loading icon, super hacky
                            loadingFixIntervalId = window.setInterval(function () {
                                var tempFrame = createFrame();

                                window.document.body.appendChild(tempFrame);
                                window.document.body.removeChild(tempFrame);

                                tempFrame = null;
                            }, loadingFixInterval);
                        }

                        attachedTo++;
                    }
                },
                cancel: function () {
                    // Only clear the interval if there's only one more object that the loadPreventer is attachedTo
                    if (attachedTo === 1) {
                        window.clearInterval(loadingFixIntervalId);
                    }

                    if (attachedTo > 0) {
                        attachedTo--;
                    }
                }
            };
        })();

    signalR.transports.foreverFrame = {
        name: "foreverFrame",

        supportsKeepAlive: function () {
            return true;
        },

        // Added as a value here so we can create tests to verify functionality
        iframeClearThreshold: 50,

        start: function (connection, onSuccess, onFailed) {
            var that = this,
                frameId = (transportLogic.foreverFrame.count += 1),
                url,
                frame = createFrame(),
                frameLoadHandler = function () {
                    connection.log("Forever frame iframe finished loading and is no longer receiving messages.");
                    if (!onFailed || !onFailed()) {
                        that.reconnect(connection);
                    }
                };

            if (window.EventSource) {
                // If the browser supports SSE, don't use Forever Frame
                if (onFailed) {
                    connection.log("Forever Frame is not supported by SignalR on browsers with SSE support.");
                    onFailed();
                }
                return;
            }

            frame.setAttribute("data-signalr-connection-id", connection.id);

            // Start preventing loading icon
            // This will only perform work if the loadPreventer is not attached to another connection.
            loadPreventer.prevent();

            // Build the url
            url = transportLogic.getUrl(connection, this.name);
            url += "&frameId=" + frameId;

            // add frame to the document prior to setting URL to avoid caching issues.
            window.document.documentElement.appendChild(frame);

            connection.log("Binding to iframe's load event.");

            if (frame.addEventListener) {
                frame.addEventListener("load", frameLoadHandler, false);
            } else if (frame.attachEvent) {
                frame.attachEvent("onload", frameLoadHandler);
            }

            frame.src = url;
            transportLogic.foreverFrame.connections[frameId] = connection;

            connection.frame = frame;
            connection.frameId = frameId;

            if (onSuccess) {
                connection.onSuccess = function () {
                    connection.log("Iframe transport started.");
                    onSuccess();
                };
            }
        },

        reconnect: function (connection) {
            var that = this;

            // Need to verify connection state and verify before the setTimeout occurs because an application sleep could occur during the setTimeout duration.
            if (transportLogic.isConnectedOrReconnecting(connection) && transportLogic.verifyLastActive(connection)) {
                window.setTimeout(function () {
                    // Verify that we're ok to reconnect.
                    if (!transportLogic.verifyLastActive(connection)) {
                        return;
                    }

                    if (connection.frame && transportLogic.ensureReconnectingState(connection)) {
                        var frame = connection.frame,
                            src = transportLogic.getUrl(connection, that.name, true) + "&frameId=" + connection.frameId;
                        connection.log("Updating iframe src to '" + src + "'.");
                        frame.src = src;
                    }
                }, connection.reconnectDelay);
            }
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        receive: function (connection, data) {
            var cw,
                body,
                response;

            if (connection.json !== connection._originalJson) {
                // If there's a custom JSON parser configured then serialize the object
                // using the original (browser) JSON parser and then deserialize it using
                // the custom parser (connection._parseResponse does that). This is so we
                // can easily send the response from the server as "raw" JSON but still 
                // support custom JSON deserialization in the browser.
                data = connection._originalJson.stringify(data);
            }

            response = connection._parseResponse(data);

            transportLogic.processMessages(connection, response, connection.onSuccess);

            // Protect against connection stopping from a callback trigger within the processMessages above.
            if (connection.state === $.signalR.connectionState.connected) {
                // Delete the script & div elements
                connection.frameMessageCount = (connection.frameMessageCount || 0) + 1;
                if (connection.frameMessageCount > signalR.transports.foreverFrame.iframeClearThreshold) {
                    connection.frameMessageCount = 0;
                    cw = connection.frame.contentWindow || connection.frame.contentDocument;
                    if (cw && cw.document && cw.document.body) {
                        body = cw.document.body;

                        // Remove all the child elements from the iframe's body to conserver memory
                        while (body.firstChild) {
                            body.removeChild(body.firstChild);
                        }
                    }
                }
            }
        },

        stop: function (connection) {
            var cw = null;

            // Stop attempting to prevent loading icon
            loadPreventer.cancel();

            if (connection.frame) {
                if (connection.frame.stop) {
                    connection.frame.stop();
                } else {
                    try {
                        cw = connection.frame.contentWindow || connection.frame.contentDocument;
                        if (cw.document && cw.document.execCommand) {
                            cw.document.execCommand("Stop");
                        }
                    }
                    catch (e) {
                        connection.log("Error occured when stopping foreverFrame transport. Message = " + e.message + ".");
                    }
                }

                // Ensure the iframe is where we left it
                if (connection.frame.parentNode === window.document.body) {
                    window.document.body.removeChild(connection.frame);
                }

                delete transportLogic.foreverFrame.connections[connection.frameId];
                connection.frame = null;
                connection.frameId = null;
                delete connection.frame;
                delete connection.frameId;
                delete connection.onSuccess;
                delete connection.frameMessageCount;
                connection.log("Stopping forever frame.");
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        },

        getConnection: function (id) {
            return transportLogic.foreverFrame.connections[id];
        },

        started: function (connection) {
            if (changeState(connection,
                signalR.connectionState.reconnecting,
                signalR.connectionState.connected) === true) {

                $(connection).triggerHandler(events.onReconnect);
            }
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.longPolling.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        isDisconnecting = $.signalR.isDisconnecting,
        transportLogic = signalR.transports._logic;

    signalR.transports.longPolling = {
        name: "longPolling",

        supportsKeepAlive: function () {
            return false;
        },

        reconnectDelay: 3000,

        start: function (connection, onSuccess, onFailed) {
            /// <summary>Starts the long polling connection</summary>
            /// <param name="connection" type="signalR">The SignalR connection to start</param>
            var that = this,
                fireConnect = function () {
                    fireConnect = $.noop;

                    connection.log("LongPolling connected.");
                    onSuccess();
                },
                tryFailConnect = function (error) {
                    if (onFailed(error)) {
                        connection.log("LongPolling failed to connect.");
                        return true;
                    }

                    return false;
                },
                privateData = connection._,
                reconnectErrors = 0,
                fireReconnected = function (instance) {
                    window.clearTimeout(privateData.reconnectTimeoutId);
                    privateData.reconnectTimeoutId = null;

                    if (changeState(instance,
                                    signalR.connectionState.reconnecting,
                                    signalR.connectionState.connected) === true) {
                        // Successfully reconnected!
                        instance.log("Raising the reconnect event");
                        $(instance).triggerHandler(events.onReconnect);
                    }
                },
                // 1 hour
                maxFireReconnectedTimeout = 3600000;

            if (connection.pollXhr) {
                connection.log("Polling xhr requests already exists, aborting.");
                connection.stop();
            }

            connection.messageId = null;

            privateData.reconnectTimeoutId = null;

            privateData.pollTimeoutId = window.setTimeout(function () {
                (function poll(instance, raiseReconnect) {
                    var messageId = instance.messageId,
                        connect = (messageId === null),
                        reconnecting = !connect,
                        polling = !raiseReconnect,
                        url = transportLogic.getUrl(instance, that.name, reconnecting, polling, true /* use Post for longPolling */),
                        postData = {};

                    if (instance.messageId) {
                        postData.messageId = instance.messageId;
                    }

                    if (instance.groupsToken) {
                        postData.groupsToken = instance.groupsToken;
                    }

                    // If we've disconnected during the time we've tried to re-instantiate the poll then stop.
                    if (isDisconnecting(instance) === true) {
                        return;
                    }

                    connection.log("Opening long polling request to '" + url + "'.");
                    instance.pollXhr = transportLogic.ajax(connection, {
                        xhrFields: {
                            onprogress: function () {
                                transportLogic.markLastMessage(connection);
                            }
                        },
                        url: url,
                        type: "POST",
                        contentType: signalR._.defaultContentType,
                        data: postData,
                        timeout: connection._.pollTimeout,
                        success: function (result) {
                            var minData,
                                delay = 0,
                                data,
                                shouldReconnect;

                            connection.log("Long poll complete.");

                            // Reset our reconnect errors so if we transition into a reconnecting state again we trigger
                            // reconnected quickly
                            reconnectErrors = 0;

                            try {
                                // Remove any keep-alives from the beginning of the result
                                minData = connection._parseResponse(result);
                            }
                            catch (error) {
                                transportLogic.handleParseFailure(instance, result, error, tryFailConnect, instance.pollXhr);
                                return;
                            }

                            // If there's currently a timeout to trigger reconnect, fire it now before processing messages
                            if (privateData.reconnectTimeoutId !== null) {
                                fireReconnected(instance);
                            }

                            if (minData) {
                                data = transportLogic.maximizePersistentResponse(minData);
                            }

                            transportLogic.processMessages(instance, minData, fireConnect);

                            if (data &&
                                $.type(data.LongPollDelay) === "number") {
                                delay = data.LongPollDelay;
                            }

                            if (isDisconnecting(instance) === true) {
                                return;
                            }

                            shouldReconnect = data && data.ShouldReconnect;
                            if (shouldReconnect) {
                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into a invalid state in processMessages.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }
                            }

                            // We never want to pass a raiseReconnect flag after a successful poll.  This is handled via the error function
                            if (delay > 0) {
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, shouldReconnect);
                                }, delay);
                            } else {
                                poll(instance, shouldReconnect);
                            }
                        },

                        error: function (data, textStatus) {
                            var error = signalR._.transportError(signalR.resources.longPollFailed, connection.transport, data, instance.pollXhr);

                            // Stop trying to trigger reconnect, connection is in an error state
                            // If we're not in the reconnect state this will noop
                            window.clearTimeout(privateData.reconnectTimeoutId);
                            privateData.reconnectTimeoutId = null;

                            if (textStatus === "abort") {
                                connection.log("Aborted xhr request.");
                                return;
                            }

                            if (!tryFailConnect(error)) {

                                // Increment our reconnect errors, we assume all errors to be reconnect errors
                                // In the case that it's our first error this will cause Reconnect to be fired
                                // after 1 second due to reconnectErrors being = 1.
                                reconnectErrors++;

                                if (connection.state !== signalR.connectionState.reconnecting) {
                                    connection.log("An error occurred using longPolling. Status = " + textStatus + ".  Response = " + data.responseText + ".");
                                    $(instance).triggerHandler(events.onError, [error]);
                                }

                                // We check the state here to verify that we're not in an invalid state prior to verifying Reconnect.
                                // If we're not in connected or reconnecting then the next ensureReconnectingState check will fail and will return.
                                // Therefore we don't want to change that failure code path.
                                if ((connection.state === signalR.connectionState.connected ||
                                    connection.state === signalR.connectionState.reconnecting) &&
                                    !transportLogic.verifyLastActive(connection)) {
                                    return;
                                }

                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into the disconnected or connecting state within the above error handler trigger.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }

                                // Call poll with the raiseReconnect flag as true after the reconnect delay
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, true);
                                }, that.reconnectDelay);
                            }
                        }
                    });

                    // This will only ever pass after an error has occured via the poll ajax procedure.
                    if (reconnecting && raiseReconnect === true) {
                        // We wait to reconnect depending on how many times we've failed to reconnect.
                        // This is essentially a heuristic that will exponentially increase in wait time before
                        // triggering reconnected.  This depends on the "error" handler of Poll to cancel this 
                        // timeout if it triggers before the Reconnected event fires.
                        // The Math.min at the end is to ensure that the reconnect timeout does not overflow.
                        privateData.reconnectTimeoutId = window.setTimeout(function () { fireReconnected(instance); }, Math.min(1000 * (Math.pow(2, reconnectErrors) - 1), maxFireReconnectedTimeout));
                    }
                }(connection));
            }, 250); // Have to delay initial poll so Chrome doesn't show loader spinner in tab
        },

        lostConnection: function (connection) {
            if (connection.pollXhr) {
                connection.pollXhr.abort("lostConnection");
            }
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        stop: function (connection) {
            /// <summary>Stops the long polling connection</summary>
            /// <param name="connection" type="signalR">The SignalR connection to stop</param>

            window.clearTimeout(connection._.pollTimeoutId);
            window.clearTimeout(connection._.reconnectTimeoutId);

            delete connection._.pollTimeoutId;
            delete connection._.reconnectTimeoutId;

            if (connection.pollXhr) {
                connection.pollXhr.abort();
                connection.pollXhr = null;
                delete connection.pollXhr;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.hubs.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />

(function ($, window, undefined) {

    var eventNamespace = ".hubProxy",
        signalR = $.signalR;

    function makeEventName(event) {
        return event + eventNamespace;
    }

    // Equivalent to Array.prototype.map
    function map(arr, fun, thisp) {
        var i,
            length = arr.length,
            result = [];
        for (i = 0; i < length; i += 1) {
            if (arr.hasOwnProperty(i)) {
                result[i] = fun.call(thisp, arr[i], i, arr);
            }
        }
        return result;
    }

    function getArgValue(a) {
        return $.isFunction(a) ? null : ($.type(a) === "undefined" ? null : a);
    }

    function hasMembers(obj) {
        for (var key in obj) {
            // If we have any properties in our callback map then we have callbacks and can exit the loop via return
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    function clearInvocationCallbacks(connection, error) {
        /// <param name="connection" type="hubConnection" />
        var callbacks = connection._.invocationCallbacks,
            callback;

        if (hasMembers(callbacks)) {
            connection.log("Clearing hub invocation callbacks with error: " + error + ".");
        }

        // Reset the callback cache now as we have a local var referencing it
        connection._.invocationCallbackId = 0;
        delete connection._.invocationCallbacks;
        connection._.invocationCallbacks = {};

        // Loop over the callbacks and invoke them.
        // We do this using a local var reference and *after* we've cleared the cache
        // so that if a fail callback itself tries to invoke another method we don't 
        // end up with its callback in the list we're looping over.
        for (var callbackId in callbacks) {
            callback = callbacks[callbackId];
            callback.method.call(callback.scope, { E: error });
        }
    }

    // hubProxy
    function hubProxy(hubConnection, hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        return new hubProxy.fn.init(hubConnection, hubName);
    }

    hubProxy.fn = hubProxy.prototype = {
        init: function (connection, hubName) {
            this.state = {};
            this.connection = connection;
            this.hubName = hubName;
            this._ = {
                callbackMap: {}
            };
        },

        constructor: hubProxy,

        hasSubscriptions: function () {
            return hasMembers(this._.callbackMap);
        },

        on: function (eventName, callback) {
            /// <summary>Wires up a callback to be invoked when a invocation request is received from the server hub.</summary>
            /// <param name="eventName" type="String">The name of the hub event to register the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            // If there is not an event registered for this callback yet we want to create its event space in the callback map.
            if (!callbackMap[eventName]) {
                callbackMap[eventName] = {};
            }

            // Map the callback to our encompassed function
            callbackMap[eventName][callback] = function (e, data) {
                callback.apply(that, data);
            };

            $(that).bind(makeEventName(eventName), callbackMap[eventName][callback]);

            return that;
        },

        off: function (eventName, callback) {
            /// <summary>Removes the callback invocation request from the server hub for the given event name.</summary>
            /// <param name="eventName" type="String">The name of the hub event to unregister the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap,
                callbackSpace;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            callbackSpace = callbackMap[eventName];

            // Verify that there is an event space to unbind
            if (callbackSpace) {
                // Only unbind if there's an event bound with eventName and a callback with the specified callback
                if (callbackSpace[callback]) {
                    $(that).unbind(makeEventName(eventName), callbackSpace[callback]);

                    // Remove the callback from the callback map
                    delete callbackSpace[callback];

                    // Check if there are any members left on the event, if not we need to destroy it.
                    if (!hasMembers(callbackSpace)) {
                        delete callbackMap[eventName];
                    }
                } else if (!callback) { // Check if we're removing the whole event and we didn't error because of an invalid callback
                    $(that).unbind(makeEventName(eventName));

                    delete callbackMap[eventName];
                }
            }

            return that;
        },

        invoke: function (methodName) {
            /// <summary>Invokes a server hub method with the given arguments.</summary>
            /// <param name="methodName" type="String">The name of the server hub method.</param>

            var that = this,
                connection = that.connection,
                args = $.makeArray(arguments).slice(1),
                argValues = map(args, getArgValue),
                data = { H: that.hubName, M: methodName, A: argValues, I: connection._.invocationCallbackId },
                d = $.Deferred(),
                callback = function (minResult) {
                    var result = that._maximizeHubResponse(minResult),
                        source,
                        error;

                    // Update the hub state
                    $.extend(that.state, result.State);

                    if (result.Progress) {
                        if (d.notifyWith) {
                            // Progress is only supported in jQuery 1.7+
                            d.notifyWith(that, [result.Progress.Data]);
                        } else if (!connection._.progressjQueryVersionLogged) {
                            connection.log("A hub method invocation progress update was received but the version of jQuery in use (" + $.prototype.jquery + ") does not support progress updates. Upgrade to jQuery 1.7+ to receive progress notifications.");
                            connection._.progressjQueryVersionLogged = true;
                        }
                    } else if (result.Error) {
                        // Server hub method threw an exception, log it & reject the deferred
                        if (result.StackTrace) {
                            connection.log(result.Error + "\n" + result.StackTrace + ".");
                        }

                        // result.ErrorData is only set if a HubException was thrown
                        source = result.IsHubException ? "HubException" : "Exception";
                        error = signalR._.error(result.Error, source);
                        error.data = result.ErrorData;

                        connection.log(that.hubName + "." + methodName + " failed to execute. Error: " + error.message);
                        d.rejectWith(that, [error]);
                    } else {
                        // Server invocation succeeded, resolve the deferred
                        connection.log("Invoked " + that.hubName + "." + methodName);
                        d.resolveWith(that, [result.Result]);
                    }
                };

            connection._.invocationCallbacks[connection._.invocationCallbackId.toString()] = { scope: that, method: callback };
            connection._.invocationCallbackId += 1;

            if (!$.isEmptyObject(that.state)) {
                data.S = that.state;
            }

            connection.log("Invoking " + that.hubName + "." + methodName);
            connection.send(data);

            return d.promise();
        },

        _maximizeHubResponse: function (minHubResponse) {
            return {
                State: minHubResponse.S,
                Result: minHubResponse.R,
                Progress: minHubResponse.P ? {
                    Id: minHubResponse.P.I,
                    Data: minHubResponse.P.D
                } : null,
                Id: minHubResponse.I,
                IsHubException: minHubResponse.H,
                Error: minHubResponse.E,
                StackTrace: minHubResponse.T,
                ErrorData: minHubResponse.D
            };
        }
    };

    hubProxy.fn.init.prototype = hubProxy.fn;

    // hubConnection
    function hubConnection(url, options) {
        /// <summary>Creates a new hub connection.</summary>
        /// <param name="url" type="String">[Optional] The hub route url, defaults to "/signalr".</param>
        /// <param name="options" type="Object">[Optional] Settings to use when creating the hubConnection.</param>
        var settings = {
            qs: null,
            logging: false,
            useDefaultPath: true
        };

        $.extend(settings, options);

        if (!url || settings.useDefaultPath) {
            url = (url || "") + "/signalr";
        }
        return new hubConnection.fn.init(url, settings);
    }

    hubConnection.fn = hubConnection.prototype = $.connection();

    hubConnection.fn.init = function (url, options) {
        var settings = {
            qs: null,
            logging: false,
            useDefaultPath: true
        },
            connection = this;

        $.extend(settings, options);

        // Call the base constructor
        $.signalR.fn.init.call(connection, url, settings.qs, settings.logging);

        // Object to store hub proxies for this connection
        connection.proxies = {};

        connection._.invocationCallbackId = 0;
        connection._.invocationCallbacks = {};

        // Wire up the received handler
        connection.received(function (minData) {
            var data, proxy, dataCallbackId, callback, hubName, eventName;
            if (!minData) {
                return;
            }

            // We have to handle progress updates first in order to ensure old clients that receive
            // progress updates enter the return value branch and then no-op when they can't find
            // the callback in the map (because the minData.I value will not be a valid callback ID)
            if (typeof (minData.P) !== "undefined") {
                // Process progress notification
                dataCallbackId = minData.P.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    callback.method.call(callback.scope, minData);
                }
            } else if (typeof (minData.I) !== "undefined") {
                // We received the return value from a server method invocation, look up callback by id and call it
                dataCallbackId = minData.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    // Delete the callback from the proxy
                    connection._.invocationCallbacks[dataCallbackId] = null;
                    delete connection._.invocationCallbacks[dataCallbackId];

                    // Invoke the callback
                    callback.method.call(callback.scope, minData);
                }
            } else {
                data = this._maximizeClientHubInvocation(minData);

                // We received a client invocation request, i.e. broadcast from server hub
                connection.log("Triggering client hub event '" + data.Method + "' on hub '" + data.Hub + "'.");

                // Normalize the names to lowercase
                hubName = data.Hub.toLowerCase();
                eventName = data.Method.toLowerCase();

                // Trigger the local invocation event
                proxy = this.proxies[hubName];

                // Update the hub state
                $.extend(proxy.state, data.State);
                $(proxy).triggerHandler(makeEventName(eventName), [data.Args]);
            }
        });

        connection.error(function (errData, origData) {
            var callbackId, callback;

            if (!origData) {
                // No original data passed so this is not a send error
                return;
            }

            callbackId = origData.I;
            callback = connection._.invocationCallbacks[callbackId];

            // Verify that there is a callback bound (could have been cleared)
            if (callback) {
                // Delete the callback
                connection._.invocationCallbacks[callbackId] = null;
                delete connection._.invocationCallbacks[callbackId];

                // Invoke the callback with an error to reject the promise
                callback.method.call(callback.scope, { E: errData });
            }
        });

        connection.reconnecting(function () {
            if (connection.transport && connection.transport.name === "webSockets") {
                clearInvocationCallbacks(connection, "Connection started reconnecting before invocation result was received.");
            }
        });

        connection.disconnected(function () {
            clearInvocationCallbacks(connection, "Connection was disconnected before invocation result was received.");
        });
    };

    hubConnection.fn._maximizeClientHubInvocation = function (minClientHubInvocation) {
        return {
            Hub: minClientHubInvocation.H,
            Method: minClientHubInvocation.M,
            Args: minClientHubInvocation.A,
            State: minClientHubInvocation.S
        };
    };

    hubConnection.fn._registerSubscribedHubs = function () {
        /// <summary>
        ///     Sets the starting event to loop through the known hubs and register any new hubs 
        ///     that have been added to the proxy.
        /// </summary>
        var connection = this;

        if (!connection._subscribedToHubs) {
            connection._subscribedToHubs = true;
            connection.starting(function () {
                // Set the connection's data object with all the hub proxies with active subscriptions.
                // These proxies will receive notifications from the server.
                var subscribedHubs = [];

                $.each(connection.proxies, function (key) {
                    if (this.hasSubscriptions()) {
                        subscribedHubs.push({ name: key });
                        connection.log("Client subscribed to hub '" + key + "'.");
                    }
                });

                if (subscribedHubs.length === 0) {
                    connection.log("No hubs have been subscribed to.  The client will not receive data from hubs.  To fix, declare at least one client side function prior to connection start for each hub you wish to subscribe to.");
                }

                connection.data = connection.json.stringify(subscribedHubs);
            });
        }
    };

    hubConnection.fn.createHubProxy = function (hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        /// <param name="hubName" type="String">
        ///     The name of the hub on the server to create the proxy for.
        /// </param>

        // Normalize the name to lowercase
        hubName = hubName.toLowerCase();

        var proxy = this.proxies[hubName];
        if (!proxy) {
            proxy = hubProxy(this, hubName);
            this.proxies[hubName] = proxy;
        }

        this._registerSubscribedHubs();

        return proxy;
    };

    hubConnection.fn.init.prototype = hubConnection.fn;

    $.hubConnection = hubConnection;

}(window.jQuery, window));
/* jquery.signalR.version.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />
(function ($, undefined) {
    $.signalR.version = "2.2.0";
}(window.jQuery));
/*
 * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,
 * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,
 * make sure you copy the url from the website since the url may change between versions.
 * */
!function(e){e(["jquery"],function(e){return function(){function t(e,t,n){return g({type:O.error,iconClass:m().iconClasses.error,message:e,optionsOverride:n,title:t})}function n(t,n){return t||(t=m()),v=e("#"+t.containerId),v.length?v:(n&&(v=d(t)),v)}function o(e,t,n){return g({type:O.info,iconClass:m().iconClasses.info,message:e,optionsOverride:n,title:t})}function s(e){C=e}function i(e,t,n){return g({type:O.success,iconClass:m().iconClasses.success,message:e,optionsOverride:n,title:t})}function a(e,t,n){return g({type:O.warning,iconClass:m().iconClasses.warning,message:e,optionsOverride:n,title:t})}function r(e,t){var o=m();v||n(o),u(e,o,t)||l(o)}function c(t){var o=m();return v||n(o),t&&0===e(":focus",t).length?void h(t):void(v.children().length&&v.remove())}function l(t){for(var n=v.children(),o=n.length-1;o>=0;o--)u(e(n[o]),t)}function u(t,n,o){var s=!(!o||!o.force)&&o.force;return!(!t||!s&&0!==e(":focus",t).length)&&(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){h(t)}}),!0)}function d(t){return v=e("<div/>").attr("id",t.containerId).addClass(t.positionClass),v.appendTo(e(t.target)),v}function p(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1}}function f(e){C&&C(e)}function g(t){function o(e){return null==e&&(e=""),e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function s(){c(),u(),d(),p(),g(),C(),l(),i()}function i(){var e="";switch(t.iconClass){case"toast-success":case"toast-info":e="polite";break;default:e="assertive"}I.attr("aria-live",e)}function a(){E.closeOnHover&&I.hover(H,D),!E.onclick&&E.tapToDismiss&&I.click(b),E.closeButton&&j&&j.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&e.cancelBubble!==!0&&(e.cancelBubble=!0),E.onCloseClick&&E.onCloseClick(e),b(!0)}),E.onclick&&I.click(function(e){E.onclick(e),b()})}function r(){I.hide(),I[E.showMethod]({duration:E.showDuration,easing:E.showEasing,complete:E.onShown}),E.timeOut>0&&(k=setTimeout(b,E.timeOut),F.maxHideTime=parseFloat(E.timeOut),F.hideEta=(new Date).getTime()+F.maxHideTime,E.progressBar&&(F.intervalId=setInterval(x,10)))}function c(){t.iconClass&&I.addClass(E.toastClass).addClass(y)}function l(){E.newestOnTop?v.prepend(I):v.append(I)}function u(){if(t.title){var e=t.title;E.escapeHtml&&(e=o(t.title)),M.append(e).addClass(E.titleClass),I.append(M)}}function d(){if(t.message){var e=t.message;E.escapeHtml&&(e=o(t.message)),B.append(e).addClass(E.messageClass),I.append(B)}}function p(){E.closeButton&&(j.addClass(E.closeClass).attr("role","button"),I.prepend(j))}function g(){E.progressBar&&(q.addClass(E.progressClass),I.prepend(q))}function C(){E.rtl&&I.addClass("rtl")}function O(e,t){if(e.preventDuplicates){if(t.message===w)return!0;w=t.message}return!1}function b(t){var n=t&&E.closeMethod!==!1?E.closeMethod:E.hideMethod,o=t&&E.closeDuration!==!1?E.closeDuration:E.hideDuration,s=t&&E.closeEasing!==!1?E.closeEasing:E.hideEasing;if(!e(":focus",I).length||t)return clearTimeout(F.intervalId),I[n]({duration:o,easing:s,complete:function(){h(I),clearTimeout(k),E.onHidden&&"hidden"!==P.state&&E.onHidden(),P.state="hidden",P.endTime=new Date,f(P)}})}function D(){(E.timeOut>0||E.extendedTimeOut>0)&&(k=setTimeout(b,E.extendedTimeOut),F.maxHideTime=parseFloat(E.extendedTimeOut),F.hideEta=(new Date).getTime()+F.maxHideTime)}function H(){clearTimeout(k),F.hideEta=0,I.stop(!0,!0)[E.showMethod]({duration:E.showDuration,easing:E.showEasing})}function x(){var e=(F.hideEta-(new Date).getTime())/F.maxHideTime*100;q.width(e+"%")}var E=m(),y=t.iconClass||E.iconClass;if("undefined"!=typeof t.optionsOverride&&(E=e.extend(E,t.optionsOverride),y=t.optionsOverride.iconClass||y),!O(E,t)){T++,v=n(E,!0);var k=null,I=e("<div/>"),M=e("<div/>"),B=e("<div/>"),q=e("<div/>"),j=e(E.closeHtml),F={intervalId:null,hideEta:null,maxHideTime:null},P={toastId:T,state:"visible",startTime:new Date,options:E,map:t};return s(),r(),a(),f(P),E.debug&&console&&console.log(P),I}}function m(){return e.extend({},p(),b.options)}function h(e){v||(v=n()),e.is(":visible")||(e.remove(),e=null,0===v.children().length&&(v.remove(),w=void 0))}var v,C,w,T=0,O={error:"error",info:"info",success:"success",warning:"warning"},b={clear:r,remove:c,error:t,getContainer:n,info:o,options:{},subscribe:s,success:i,version:"2.1.3",warning:a};return b}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
//# sourceMappingURL=toastr.js.map
/*
 ### jQuery XML to JSON Plugin v1.3 - 2013-02-18 ###
 * http://www.fyneworks.com/ - diego@fyneworks.com
	* Licensed under http://en.wikipedia.org/wiki/MIT_License
 ###
 Website: http://www.fyneworks.com/jquery/xml-to-json/
*//*
 # INSPIRED BY: http://www.terracoder.com/
           AND: http://www.thomasfrank.se/xml_to_json.html
											AND: http://www.kawa.net/works/js/xml/objtree-e.html
*//*
 This simple script converts XML (document of code) into a JSON object. It is the combination of 2
 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
// Avoid collisions
; if (window.jQuery) (function ($) {
    // Add function to jQuery namespace
    $.extend({
        // converts xml documents and xml text to json object
        xml2json: function (xml, extended) {
            if (!xml) return {}; // quick fail

            //### PARSER LIBRARY
            // Core function
            function parseXML(node, simple) {
                if (!node) return null;
                var txt = '', obj = null, att = null;
                var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
                var nv = node.text || node.nodeValue || '';
                /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
                if (node.childNodes) {
                    if (node.childNodes.length > 0) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
                        $.each(node.childNodes, function (n, cn) {
                            var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
                            var cnv = cn.text || cn.nodeValue || '';
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
                            if (cnt == 8) {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
                                return; // ignore comment node
                            }
                            else if (cnt == 3 || cnt == 4 || !cnn) {
                                // ignore white-space in between tags
                                if (cnv.match(/^\s+$/)) {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
                                    return;
                                };
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
                                txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                                // make sure we ditch trailing spaces from markup
                            }
                            else {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
                                obj = obj || {};
                                if (obj[cnn]) {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

                                    // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                    if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
                                    obj[cnn] = myArr(obj[cnn]);

                                    obj[cnn][obj[cnn].length] = parseXML(cn, true/* simple */);
                                    obj[cnn].length = obj[cnn].length;
                                }
                                else {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
                                    obj[cnn] = parseXML(cn);
                                };
                            };
                        });
                    };//node.childNodes.length>0
                };//node.childNodes
                if (node.attributes) {
                    if (node.attributes.length > 0) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
                        att = {}; obj = obj || {};
                        $.each(node.attributes, function (a, at) {
                            var atn = jsVar(at.name), atv = at.value;
                            att[atn] = atv;
                            if (obj[atn]) {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

                                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                //if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
                                obj[cnn] = myArr(obj[cnn]);

                                obj[atn][obj[atn].length] = atv;
                                obj[atn].length = obj[atn].length;
                            }
                            else {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                                obj[atn] = atv;
                            };
                        });
                        //obj['attributes'] = att;
                    };//node.attributes.length>0
                };//node.attributes
                if (obj) {
                    obj = $.extend((txt != '' ? new String(txt) : {}),/* {text:txt},*/ obj || {}/*, att || {}*/);
                    //txt = (obj.text) ? (typeof(obj.text)=='object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
                    txt = (obj.text) ? ([obj.text || '']).concat([txt]) : txt;
                    if (txt) obj.text = txt;
                    txt = '';
                };
                var out = obj || txt;
                //console.log([extended, simple, out]);
                if (extended) {
                    if (txt) out = {};//new String(out);
                    txt = out.text || txt || '';
                    if (txt) out.text = txt;
                    if (!simple) out = myArr(out);
                };
                return out;
            };// parseXML
            // Core Function End
            // Utility functions
            var jsVar = function (s) { return String(s || '').replace(/-/g, "_"); };

            // NEW isNum function: 01/09/2010
            // Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
            function isNum(s) {
                // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
                // few bugs corrected from original function :
                // - syntax error : regexp.test(string) instead of string.test(reg)
                // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
                // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
                // - string is "trimmed", allowing to accept space at the beginning and end of string
                var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
                return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
            };
            // OLD isNum function: (for reference only)
            //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

            var myArr = function (o) {
                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                //if(!o.length) o = [ o ]; o.length=o.length;
                if (!$.isArray(o)) o = [o]; o.length = o.length;

                // here is where you can attach additional functionality, such as searching and sorting...
                return o;
            };
            // Utility functions End
            //### PARSER LIBRARY END

            // Convert plain text to xml
            if (typeof xml == 'string') xml = $.text2xml(xml);

            // Quick fail if not xml (or if this is a node)
            if (!xml.nodeType) return;
            if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

            // Find xml root node
            var root = (xml.nodeType == 9) ? xml.documentElement : xml;

            // Convert xml to json
            var out = parseXML(root, true /* simple */);

            // Clean-up memory
            xml = null; root = null;

            // Send output
            return out;
        },

        // Convert text to XML DOM
        text2xml: function (str) {
            // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
            //return $(xml)[0];

            /* prior to jquery 1.9 */
            /*
            var out;
            try{
             var xml = ((!$.support.opacity && !$.support.style))?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser();
             xml.async = false;
            }catch(e){ throw new Error("XML Parser could not be instantiated") };
            try{
             if((!$.support.opacity && !$.support.style)) out = (xml.loadXML(str))?xml:false;
             else out = xml.parseFromString(str, "text/xml");
            }catch(e){ throw new Error("Error parsing XML string") };
            return out;
            */

            /* jquery 1.9+ */
            return $.parseXML(str);
        }
    }); // extend $
})(jQuery);