if (window.ol !== undefined && window.ol !== null) {
    ol.geom.Point.prototype.getExtent = function (opt_extent) {
        var coordinates = this.getCoordinates();
        var extent = [coordinates[0], coordinates[1], coordinates[0], coordinates[1]];
        return new ol.extent.buffer(extent, 20);
    };
}