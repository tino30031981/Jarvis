if (window.ol !== undefined && window.ol !== null) {
    if (ol.proj.Projection.prototype.getWKID === undefined) {
        ol.proj.Projection.prototype.getWKID = function () {
            if (this.getCode() === null) return 0;
            return Number(this.getCode().replace(/EPSG:/, ""))
        };
    }
}