var com;
(function (gh) {
    (function (spatial) {
        (function (helper) {
            var CswHelper = (function () {
                function CswHelper() {

                }
                CswHelper.CRS84 = "urn:ogc:def:crs:::WGS - 84";
                CswHelper.EPSG4326 = "EPSG:4326";
                CswHelper.search = function (url, options, callback) {
                    jQuery.ajax({
                        type: 'POST',
                        contentType: 'application/xml; charset=UTF-8',
                        url: url,
                        dataType: 'text',
                        cache: false,
                        data: options.data
                        //processdata: false,
                    }).done(function (data) {
                        data = jQuery.xml2json(data);
                        var item = {};
                        item.paginator = CswHelper._parsePaginator(data);
                        item.items = [];
                        item.extra = CswHelper._parseExtra(data);
                        data.SearchResults.Record=data.SearchResults.Record || [];
                        data.SearchResults.Record.forEach(function (record) {
                            item.items.push(CswHelper._parseElement(record));
                        });
                        if (typeof callback === "function") {
                            callback(item);
                        }
                    });
                };
                CswHelper._parseExtra = function (data) {
                    var item = {};
                    item.extra = data.SearchResults.elementSet;
                    item.extra = data.SearchStatus.timestamp;
                    return item;
                };
                CswHelper._parsePaginator = function (data) {
                    return {
                        total: Math.ceil(data.SearchResults.numberOfRecordsMatched / data.SearchResults.numberOfRecordsReturned),
                        totalRecords: data.SearchResults.numberOfRecordsReturned,
                        nextRecord: data.SearchResults.nextRecord
                    };
                };
                CswHelper._parseElement = function (data) {
                    var item = {};
                    item.oid = com.jtm.helper.Random.getUUID();
                    item.uris = [];
                    if (data.URI !== undefined) {
                        if (data.URI instanceof Array)
                            data.URI.forEach(function (uri) {
                                item.uris.push({
                                    name: uri.name,
                                    protocol: uri.protocol,
                                    value: uri.text,
                                    description: uri.description
                                });
                            });
                        else
                            item.uris.push({
                                name: data.URI.name,
                                protocol: data.URI.protocol,
                                value: data.URI.text,
                                description: data.URI.description
                            });
                    }
                    item.abstract = "";
                    if (data.abstract !== undefined) {
                        if (data.abstract instanceof Array)
                            data.abstract.forEach(function (abstract) {
                                item.abstract += abstract + "<br />";
                            });
                        else
                            item.abstract = data.abstract;
                    }
                    item.date = "";
                    if (data.date !== undefined) {
                        if (data.date instanceof Array)
                            data.date.forEach(function (date) {
                                item.date += date.value + " | ";
                            });
                        else
                            item.date = data.date;
                    }
                    item.description = "";
                    if (data.description !== undefined) {
                        if (data.description instanceof Array)
                            data.description.forEach(function (description) {
                                item.description = description + "<br />";
                            });
                        else
                            item.description = data.description;
                    }
                    item.format = "";
                    if (data.format !== undefined) {
                        if (data.format instanceof Array)
                            data.format.forEach(function (format) {
                                item.format += format.value + " | ";
                            });
                        item.format = data.format;
                    }
                    item.info = data.info;
                    item.identifier = "";
                    if (data.identifier !== undefined) {
                        if (data.identifier instanceof Array)
                            data.identifier.forEach(function (identifier) {
                                item.identifier += identifier.value;
                            });
                        else
                            item.identifier = data.identifier;
                    }
                    item.language = "";
                    if (data.language !== undefined) {
                        if (data.language instanceof Array)
                            data.language.forEach(function (language) {
                                item.language += language.value + " | ";
                            });
                        else
                            item.language = data.language;
                    }

                    item.rights = "";
                    if (data.rights !== undefined) {
                        if (data.rights instanceof Array)
                            data.rights.forEach(function (right) {
                                item.rights += right.value + " | ";
                            });
                        else
                            item.rights = data.rights;
                    }

                    if (data.subject !== undefined) {
                        if (data.subject instanceof Array)
                            data.subject.forEach(function (subject) {
                                item.subject += subject + " | ";
                            });
                        else
                            item.subject = data.subject;
                    }
                    item.title = "";
                    if (data.title !== undefined) {
                        if (data.title instanceof Array)
                            data.title.forEach(function (title) {
                                item.title += title.value + " | ";
                            });
                        else
                            item.title = data.title;
                    }
                    item.geometry = null;
                    item.boundingbox = null;
                    if (data.BoundingBox !== undefined && data.BoundingBox !== null) {
                        var itemBoundingBox = {};
                        var point = data.BoundingBox.LowerCorner.split(" ");
                        itemBoundingBox.xmin = Number(point[0]);
                        itemBoundingBox.ymin = Number(point[1]);
                        point = data.BoundingBox.UpperCorner.split(" ");
                        itemBoundingBox.xmax = Number(point[0]);
                        itemBoundingBox.ymax = Number(point[1]);
                        item.boundingbox = itemBoundingBox;
                        var srid = 0;
                        if (data.BoundingBox.crs == CswHelper.CRS84)
                            srid = CswHelper.EPSG4326;
                        else if (data.BoundingBox.crs.includes(CswHelper.EPSG4326) === true)
                            srid = CswHelper.EPSG4326;
                        item.feature = {
                            id: item.oid,
                            srid: srid,
                            extent: item.boundingbox,
                            geometry: [item.boundingbox.xmin, item.boundingbox.ymin, item.boundingbox.xmax, item.boundingbox.ymax],
                            properties: {
                                id: item.identifier,
                                xmin: item.boundingbox.xmin,
                                ymin: item.boundingbox.ymin,
                                xmax: item.boundingbox.xmax,
                                ymax: item.boundingbox.ymax,
                                srid: item.boundingbox.srid
                            }
                        };
                    }
                    return item;
                };
                return CswHelper;
            })();
            helper.CswHelper = CswHelper;
        })(spatial.helper || (spatial.helper = {}));
        var helper = spatial.helper;
    })(gh.spatial || (gh.spatial = {}));
    var spatial = gh.spatial;
})(gh || (gh = {}));