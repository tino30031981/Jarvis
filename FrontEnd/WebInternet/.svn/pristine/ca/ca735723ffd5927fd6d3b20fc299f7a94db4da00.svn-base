if (window.esri !== undefined && window.esri !== null) {
    require(["esri/graphic"], function (Graphic) {
        Graphic.prototype.setId = function (id) {
            this.id = id;
        };
        Graphic.prototype.getId = function () {
            return this.id;
        };
    });
}
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
if (window.esri !== undefined && window.esri !== null) {
    require(["esri/graphicsUtils", "esri/geometry/geometryEngine"], function (graphicsUtils, geometryEngine) {
        graphicsUtils.graphicsExtent = function (graphics) {
            if (!graphics || !graphics.length) return null;
            var t, n, r = graphics[0].geometry, i = r.getExtent(), a = graphics.length;
            for (null === i && (i = new o(r.x, r.y, r.x, r.y, r.spatialReference)), n = 1; a > n; n++)
                t = (r = graphics[n].geometry).getExtent(), null === t && (t = new o(r.x, r.y, r.x, r.y, r.spatialReference)), i = i.union(t);
            if (r.xmin === r.xmax && r.ymin === r.ymax) {
                r = r.expand(2);
                //r= geometryEngine.buffer(new esri.geometry.Point(r.xmin, r.ymin, r.spatialReference), 1, 9001).getExtent();
            }
            return i.getWidth() < 0 && i.getHeight() < 0 ? null : i
        }
    });
}
if (window.esri !== undefined && window.esri !== null) {
    require(["esri/map"], function (Map) {
        if (Map.prototype.setInitialExtent === undefined) {
            Map.prototype.setInitialExtent = function (extent) {
                Map.prototype.initialExtent = extent;
            };
        }
        if (Map.prototype.removeDefaultBaseMap === undefined) {
            Map.prototype.removeDefaultBaseMap = function () {
                var i = 0;
                for (i = 0; i < this.basemapLayerIds.length; i++) {
                    this.removeLayer(this.getLayer(this.basemapLayerIds[i]));
                }
                this.basemapLayerIds = [];
            };
        }
        if (Map.prototype.beforeResizeExtent === undefined)
            Map.prototype.beforeResizeExtent = this.initialExtent || null;
    });
}
if (window.esri !== undefined && window.esri !== null) {
    require(["esri/geometry/Point", "esri/geometry/geometryEngine"], function (Point, geometryEngine) {
        Point.prototype.getExtent = function () {            
            if (this.spatialReference.wkid === 3857 || this.spatialReference.wkid === 4326 )
                return geometryEngine.geodesicBuffer(this, 20).getExtent();
            else
                return geometryEngine.buffer(this, 20).getExtent();
        };
        Point.prototype.getCentroid = function () {
            return this;
        };
    });
}