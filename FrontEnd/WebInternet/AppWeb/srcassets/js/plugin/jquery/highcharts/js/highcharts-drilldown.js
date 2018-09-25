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
