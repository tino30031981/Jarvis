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