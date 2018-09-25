if (window.ol !== undefined && window.ol !== null) {
    if (ol.Feature.prototype.setProperty === undefined) {
        ol.Feature.prototype.setProperty = function (key, value, opt_silent) {
            this.set(key, value, opt_silent);
        };
    }
}
if (window.ol !== undefined && window.ol !== null) {
    if (ol.geom.Geometry.prototype.getExtentCenter === undefined) {
        ol.geom.Polygon.prototype.getExtentCenter = function () {
            var extent = this.getExtent();
            var coordinate = ol.extent.getCenter(extent);
            return coordinate;
        };
    }
}
if (window.ol !== undefined && window.ol !== null) {
    if (ol.geom.LinearRing.prototype.getLength === undefined) {
        ol.geom.LinearRing.prototype.getLength = function () {
            return 0;
            //		return ol.geom.flat.length.linearRing(this.flatCoordinates, 0,
            //				this.flatCoordinates.length, this.stride);
        };
    }
}
if (window.ol !== undefined && window.ol !== null) {
    if (ol.Map.prototype.getLayer === undefined) {
        ol.Map.prototype.getLayer = function (id) {
            var layer;
            this.getLayers().forEach(function (layer2) {
                if (id == layer2.get('id')) {
                    layer = layer2;
                }
            });
            return layer;
        };
    }
    if (ol.Map.prototype.getCurrentExtent === undefined) {
        ol.Map.prototype.getCurrentExtent = function () {
            return this.getView().calculateExtent(this.getSize());
        };
    }
    if (ol.Map.prototype.getResolutionFromScale === undefined) {
        ol.Map.prototype.getResolutionFromScale = function (scale) {
            var units = this.getView().getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var resolution = scale / (mpu * 39.37 * dpi);
            return resolution;
        }
    }
    if (ol.Map.prototype.getCurrentScale === undefined) {
        ol.Map.prototype.getCurrentScale = function () {
            var resolution = this.getView().getResolution();
            var units = this.getView().getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * dpi;
//            if (scale >= 9500 && scale <= 950000) {
//                scale = Math.round(scale / 1000) + "K";
//            } else if (scale >= 950000) {
//                scale = Math.round(scale / 1000000) + "M";
//            } else {
//                scale = Math.round(scale);
//            }
            return scale;
        };
    }
}
if (window.ol !== undefined && window.ol !== null) {
    ol.geom.Point.prototype.getExtent = function (opt_extent) {
        var coordinates = this.getCoordinates();
        var extent = [coordinates[0], coordinates[1], coordinates[0], coordinates[1]];
        return new ol.extent.buffer(extent, 20);
    };
}
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
if (window.ol !== undefined && window.ol !== null) {
    if (ol.proj.Projection.prototype.getWKID === undefined) {
        ol.proj.Projection.prototype.getWKID = function () {
            if (this.getCode() === null) return 0;
            return Number(this.getCode().replace(/EPSG:/, ""))
        };
    }
}
if (window.ol !== undefined && window.ol !== null) {
    if (ol.View.prototype.getCurrentScale === undefined) {
        ol.View.prototype.getCurrentScale = function () {
            var resolution = this.getResolution();
            var units = this.getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * dpi;
            return scale;
        };
    }
    if (ol.View.prototype.setExtent === undefined) {
        ol.View.prototype.setExtent = function (extent,zoom) {
            //this.fit(extent, this.getMap().getSize(), { maxZoom: 10 });
        };
    }
}