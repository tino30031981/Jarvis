var gh;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var WfsHelper = (function () {
                function WfsHelper() {

                }
                WfsHelper.DEFAULTVERSION = "2.0.0";
                WfsHelper.DEFAULTOUTPUTFORMAT = "text/json";
                WfsHelper.REQUESTCAPABILITIES = "service=WFS&version={0}&request=getcapabilities";
                WfsHelper.REQUESTFEATURE = "service=WFS&version={0}&request=GetFeature&typename={1}&outputFormat={2}&srsname={3}";
                WfsHelper.REQUESTFEATURETYPE = "service=wfs&version={0}&request=DescribeFeatureType&typeNames={1}";
                WfsHelper.PATTERNCRS = /urn:ogc:def:crs:/;
                WfsHelper.PATTERNCRSEPSG = /urn:ogc:def:crs:EPSG::/;
                WfsHelper.detailType = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var requestFeatureType = WfsHelper.REQUESTFEATURETYPE.replace("{0}", options.version).replace("{1}", id);
                    var type = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        type = WfsHelper._getByName(data.FeatureTypeList.FeatureType, id);
                        type.url = url;
                        type.formats = formats;
                        jQuery.ajax(url + requestFeatureType).done(function (response) {
                            data = jQuery.xml2json(response);
                            if (data.Exception === undefined)
                                type.fields = WfsHelper._getFieldsByName(data.complexType, id);
                            else
                                type.fields = [];
                        }).fail(function (error) {

                        });
                    }).fail(function (error) {

                    });
                    jQuery.ajaxSetup({ async: true });
                    return type;
                };
                WfsHelper.listAllTypes = function (url, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var types = [];
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var types2 = data.FeatureTypeList.FeatureType;
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        types2.forEach(function (type) {
                            type.url = url;
                            type.outputFormats = formats;
                            types.push(WfsHelper._parserType(type));
                        });
                    });
                    jQuery.ajaxSetup({ async: true });
                    return types;
                };
                WfsHelper.detailType2 = function (url, id, options) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var requestFeatureType = WfsHelper.REQUESTFEATURETYPE.replace("{0}", options.version).replace("{1}", id);
                    var type = {};
                    jQuery.ajaxSetup({ async: false });
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        type = WfsHelper._getByName(data.FeatureTypeList.FeatureType, id);
                        type.url = url;
                        type.formats = formats;
                        jQuery.ajax(url + requestFeatureType).done(function (response) {
                            data = jQuery.xml2json(response);
                            if (data.Exception === undefined)
                                type.fields = WfsHelper._getFieldsByName(data.complexType, id);
                            else
                                type.fields = [];
                        }).fail(function (error) {

                        });
                    }).fail(function (error) {

                    });
                    return type;
                };
                WfsHelper.listAllTypes2 = function (url, options, callback) {
                    url = (url.endsWith("?") ? url : url + "?");
                    options = options = {};
                    options.version = options.version || WfsHelper.DEFAULTVERSION;
                    options.outputFormat = options.outputFormat || WfsHelper.DEFAULTOUTPUTFORMAT;
                    var requestCapabilities = WfsHelper.REQUESTCAPABILITIES.replace("{0}", options.version);
                    var types = [];
                    jQuery.ajax(url + requestCapabilities).done(function (data) {
                        data = jQuery.xml2json(data);
                        var types2 = data.FeatureTypeList.FeatureType;
                        var formats = WfsHelper._parserOutputFormats(data.OperationsMetadata.Operation);
                        types2.forEach(function (type) {
                            type.url = url;
                            type.formats = formats;
                            types.push(WfsHelper._parserType(type));
                        });
                    });
                    return types;
                };
                WfsHelper._getByName = function (types, typeName) {
                    var i = 0;
                    for (i = 0; i < types.length; i++) {
                        if (typeName === types[i].Name) {
                            return WfsHelper._parserType(types[i])
                        }
                    }
                    return null;
                };
                WfsHelper._getFieldsByName = function (complexTypes, typeName) {
                    typeName = (typeName + "Type").replace(/(.*):/, "");
                    var i = 0;
                    for (i = 0; i < complexTypes.length; i++) {
                        if (complexTypes[i].name === typeName) {
                            return WfsHelper._parserDescribe(complexTypes[i].complexContent.extension.sequence.element);
                        }
                    }
                    return [];
                }
                WfsHelper._parserOutputFormats = function (operations) {
                    var getFeature = operations.find2("name", "GetFeature");
                    var formats = getFeature.Parameter.find2("name", "outputFormat").AllowedValues.Value;
                    var items = [];
                    formats.forEach(function (item) {
                        if (item.indexOf("/") == -1)
                            items.push(item);
                    });
                    return items;
                };
                WfsHelper._parserDescribe = function (data) {
                    return getFields();
                    function getFields() {
                        var items = [];
                        data.forEach(function (item) {
                            items.push({
                                name: item.name,
                                nullable: item.nillable == "true",
                                type: item.type.replace(/(.*):/, "")
                            });
                        });
                        return items;
                    }
                }
                WfsHelper._parserType = function (data) {
                    data.oid = "wfstype_" + com.jtm.helper.Random.getUUID();
                    data.extent = [data.xmax, data.ymax, data.xmin, data.ymin];
                    //data.extent = ol.proj.transformExtent(data.extent, data.srid, thiss.map.getView().getProjection());
                    data.id = data.Name;
                    delete data.Name;
                    data.name = data.Title;
                    delete data.Title;
                    var itemBoundingBox = {};
                    itemBoundingBox.geographic = {
                        srid: "EPSG:4326"
                    };
                    var point = data.WGS84BoundingBox.LowerCorner.split(" ");
                    itemBoundingBox.geographic.xmin = point[1];
                    itemBoundingBox.geographic.ymin = point[0];
                    point = data.WGS84BoundingBox.UpperCorner.split(" ");
                    itemBoundingBox.geographic.xmax = point[1];
                    itemBoundingBox.geographic.ymax = point[0];
                    data.boundingbox = itemBoundingBox;
                    delete data.WGS84BoundingBox;
                    data.extent = [data.boundingbox.geographic.xmin, data.boundingbox.geographic.ymin, data.boundingbox.geographic.xmax, data.boundingbox.geographic.ymax];
                    data.srid = data.boundingbox.geographic.srid;
                    data.crs = data.DefaultCRS.replace(WfsHelper.PATTERNCRS, '').replace("::", ":");
                    delete data.DefaultCRS;
                    data.keywords = data.Keywords.Keyword.join();
                    delete data.Keywords;
                    data.abstract = data.Abstract;
                    delete data.Abstract;
                    return data;
                };
                return WfsHelper;
            })();
            helper.WfsHelper = WfsHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (gh.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));