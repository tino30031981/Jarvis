if (window.ol !== undefined && window.ol !== null) {
	if (ol.geom.Polygon.prototype.getLength === undefined) {
		ol.geom.Polygon.prototype.getLength = function() {
			// var length = 0;
			// var i = 0;
			// for (i = 0; i < this.getLinearRingCount() ; i++) {
			// var linearRing = this.getLinearRing(i);
			// length += linearRing.getLength();
			// }
			// return length;
			var linearRing = this.getLinearRing(0);
			var coordinates = linearRing.getCoordinates();
			var lineString = new ol.geom.LineString(coordinates);
			return lineString.getLength();
		};
	}
}