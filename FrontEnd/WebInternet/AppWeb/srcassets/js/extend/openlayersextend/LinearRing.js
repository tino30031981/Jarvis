if (window.ol !== undefined && window.ol !== null) {
    if (ol.geom.LinearRing.prototype.getLength === undefined) {
        ol.geom.LinearRing.prototype.getLength = function () {
            return 0;
            //		return ol.geom.flat.length.linearRing(this.flatCoordinates, 0,
            //				this.flatCoordinates.length, this.stride);
        };
    }
}