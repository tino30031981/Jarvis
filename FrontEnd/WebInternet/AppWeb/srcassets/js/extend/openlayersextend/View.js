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