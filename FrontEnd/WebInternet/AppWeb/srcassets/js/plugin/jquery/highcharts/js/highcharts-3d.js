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
