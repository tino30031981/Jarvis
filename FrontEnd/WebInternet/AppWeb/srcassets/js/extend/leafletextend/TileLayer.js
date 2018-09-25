/*jshint sub:true*/
if (window.L !== undefined && window.L !== null) {
    if (L.TileLayer.prototype.getTileUrl) {
        L.TileLayer.prototype.getTileUrl = function (coords) {
            var data = {
                r: L.Browser.retina ? '@2x' : '',
                s: this._getSubdomain(coords),
                x: coords.x,
                y: coords.y,
                z: this._getZoomForUrl(),
                q: this.tile2quad(coords.x, coords.y, this._getZoomForUrl())
            };
            if (this._map && !this._map.options.crs && !this._map.options.crs.infinite) {
                var invertedY = this._globalTileRange.max.y - coords.y;
                if (this.options.tms) {
                    data['y'] = invertedY;
                }
                data['-y'] = invertedY;
            }

            return L.Util.template(this._url, L.extend(data, this.options));

        };
    }
    if (!L.TileLayer.prototype.tile2quad) {
        L.TileLayer.prototype.tile2quad = function (x, y, z) {
            var quad = '';
            for (var i = z; i > 0; i--) {
                var digit = 0;
                var mask = 1 << (i - 1);
                if ((x & mask) !== 0) digit += 1;
                if ((y & mask) !== 0) digit += 2;
                quad = quad + digit;
            }
            return quad;
        };
    }
}