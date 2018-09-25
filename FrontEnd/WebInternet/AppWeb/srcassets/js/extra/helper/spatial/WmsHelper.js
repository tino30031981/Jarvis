var gh;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var WmsHelper = (function () {
                function WmsHelper() {

                }
                WmsHelper.DEFAULTVERSION = "1.3.0";
                WmsHelper.REQUESTCAPABILITIES = "service=WMS&version={0}&request=getcapabilities";
                WmsHelper.CRS84 = "CRS:84";
                WmsHelper.detailLayer = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WmsHelper.DEFAULTVERSION;
                    var requestCapabilities = WmsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var layer = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        layer = WmsHelper._getByName(data.Capability.Layer.Layer, id);
                        layer.url = url;
                    });
                    jQuery.ajaxSetup({ async: true });
                    return layer;
                };
                WmsHelper.listAllLayers = function (url, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WmsHelper.DEFAULTVERSION;
                    var requestCapabilities = WmsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var layers = [];
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var layers2 = data.Capability.Layer.Layer;
                        layers2.forEach(function (layer) {
                            layer.url = url;
                            layers.push(WmsHelper._parserLayer(layer));
                        });
                    });
                    jQuery.ajaxSetup({ async: true });
                    return layers;
                };
                WmsHelper._getByName = function (layers, name) {
                    var i = 0;
                    for (i = 0; i < layers.length; i++) {
                        if (name === layers[i].Name) {
                            return WmsHelper._parserLayer(layers[i]);
                        }
                    }
                    return null;
                };
                WmsHelper._parserLayer = function (data) {
                    var thiss = this;
                    data.oid = "wmslayer_" + com.jtm.helper.Random.getUUID();
                    //extent = ol.proj.transformExtent(extent, data.srid, thiss.map.getView().getProjection());
                    data.id = data.Name;
                    delete data.Name;
                    data.name = data.Title;
                    delete data.Title;
                    var itemBoundingBox = {};
                    data.BoundingBox.forEach(function (item) {
                        if (item.CRS.includes(WmsHelper.CRS84) === true)
                            itemBoundingBox.geographic = {
                                srid: item.CRS,
                                xmax: Number(item.maxx),
                                ymax: Number(item.maxy),
                                xmin: Number(item.minx),
                                ymin: Number(item.miny)
                            }
                    });
                    data.BoundingBox.forEach(function (item) {
                        if (item.CRS.includes(WmsHelper.CRS84) === false)
                            itemBoundingBox.projected = {
                                srid: item.CRS,
                                xmin: Number(item.minx),
                                ymin: Number(item.miny),
                                xmax: Number(item.maxx),
                                ymax: Number(item.maxy)
                            }
                    });
                    data.boundingbox = itemBoundingBox;
                    delete data.BoundingBox;
                    data.extent = [data.boundingbox.geographic.xmin, data.boundingbox.geographic.ymin, data.boundingbox.geographic.xmax, data.boundingbox.geographic.ymax];
                    data.srid = data.boundingbox.geographic.srid;
                    data.crs = [];
                    data.CRS.forEach(function (item) {
                        data.crs.push(item);
                    });
                    delete data.CRS;
                    data.keywords = data.KeywordList.Keyword.join();
                    delete data.KeywordList;
                    data.styles = [];
                    if (data.Style instanceof Array) {
                        data.Style.forEach(function (item) {
                            data.styles.push({
                                name: item.Name,
                                format: item.LegendURL.Format,
                                url: item.LegendURL.OnlineResource["xlink:href"]
                            });
                        });
                    }
                    else {
                        data.styles.push({
                            name: data.Style.Name,
                            format: data.Style.LegendURL.Format,
                            url: data.Style.LegendURL.OnlineResource["xlink:href"]
                        });
                    }
                    delete data.Style;
                    data.opacity = data.opaque;
                    delete data.opaque;
                    data.queryable = data.queryable;
                    data.abstract = data.Abstract;
                    delete data.Abstract;
                    delete data.EX_GeographicBoundingBox;
                    return data;
                };
                return WmsHelper;
            })();
            helper.WmsHelper = WmsHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (jtm.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));