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