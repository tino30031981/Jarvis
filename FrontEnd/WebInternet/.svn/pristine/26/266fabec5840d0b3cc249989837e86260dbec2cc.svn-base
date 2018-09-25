if (window.ol !== undefined && window.ol !== null) {
    if (ol.geom.Geometry.prototype.getExtentCenter === undefined) {
        ol.geom.Polygon.prototype.getExtentCenter = function () {
            var extent = this.getExtent();
            var coordinate = ol.extent.getCenter(extent);
            return coordinate;
        };
    }
}