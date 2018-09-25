if (window.ol !== undefined && window.ol !== null) {
    if (ol.Feature.prototype.setProperty === undefined) {
        ol.Feature.prototype.setProperty = function (key, value, opt_silent) {
            this.set(key, value, opt_silent);
        };
    }
}