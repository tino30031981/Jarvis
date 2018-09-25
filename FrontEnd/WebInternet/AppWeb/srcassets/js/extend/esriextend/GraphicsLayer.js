if (window.esri !== undefined && window.esri !== null) {
    require(["esri/layers/GraphicsLayer"], function (GraphicsLayer) {
        GraphicsLayer.prototype.add = function (g, t) {
            if (g === null) return;
            if ((this.renderer === undefined || this.renderer === null || this.renderer.symbol === undefined || this.renderer.symbol === null) && (g.symbol === undefined || g.symbol === null)) {
                if (typeof this._params.style === "function") {
                    var s = this._params.style(g, null);
                    g.setSymbol(s);
                }
            }
            return g._graphicsLayer === this ? g : (t || this.graphics.push(g), g._graphicsLayer = this, g._layer = this, this._updateExtent(g), this._draw(g), t || this.onGraphicAdd(g), g);
        };
        GraphicsLayer.prototype.addAll = function (gs) {
            if (gs instanceof Array)
                gs.forEach(function (g) {
                    this.add(g);
                }, this);
        };
        GraphicsLayer.prototype.getFeatureById = function (id) {
            var g2 = null;
            this.graphics.forEach(function (g) {
                if (g.getId() == id) {
                    g2 = g;
                    return;
                }
            });
            return g2;
        };
    });
}