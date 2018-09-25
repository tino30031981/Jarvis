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