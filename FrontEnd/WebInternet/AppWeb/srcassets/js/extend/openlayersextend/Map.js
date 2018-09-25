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