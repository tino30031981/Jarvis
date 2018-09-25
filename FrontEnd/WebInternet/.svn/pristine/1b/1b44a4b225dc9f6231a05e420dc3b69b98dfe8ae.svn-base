(function (com) {
    (function (jtm) {
        (function (geometry) {
            (function (catalog) {
                (function (widgets) {
                    (function (basic) {
                        var BaseWidget = (function (_super) {
                            __extends(BaseWidget, _super);
                            function BaseWidget() {
                                _super.call(this);
                                this.$ddlServer = null;
                                this.$divResult = null;
                                this.$ulPaginator = null;
                                this.$txtAnyText = null;
                                this.format = null;
                            }
                            BaseWidget.prototype.onClick = function () {
                                var thiss = this;
                                thiss.showView({
                                    dialog: { width: 200 }
                                });
                            };
                            BaseWidget.prototype.initConfig = function () {
                                var thiss = this;
                                _super.prototype.initConfig.call(this);
                            };
                            BaseWidget.prototype.launchView = function () {
                                var thiss = this;
                                thiss.$ddlServer = thiss.$widget.find("#ddlServer");
                                thiss.$btnSearch = thiss.$widget.find('#btnSearch');
                                thiss.$divResult = thiss.$widget.find('#divResult');
                                thiss.$ulPaginator = thiss.$widget.find('#ulPaginator');
                                thiss.$txtAnyText = thiss.$widget.find('#txtAnyText');
                                com.jtm.helper.DropDownList.fillLocal({
                                    ddl: thiss.$ddlServer,
                                    fieldId: "url",
                                    fieldName: "name",
                                    items: thiss.config.module.widget.servers
                                });
                                thiss.$btnSearch.off("click");
                                thiss.$btnSearch.on("click", function (e) {
                                    thiss.search(1);
                                });
                            };
                            BaseWidget.prototype.parameters = function (startPosition) {
                                var thiss = this;
                                this.format = new OpenLayers.Format.CSWGetRecords();
                                //var spatial = new ol.format.ogc.filter.Bbox("ows:BoundingBox", [-8878462, 4930820, 8027433, 5697234], "optional");

                                var alphanumFilter = new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.LIKE,
                                    property: "./AnyText",
                                    value: thiss.$txtAnyText.val()
                                });
                                //var alphanum = new ol.format.ogc.filter.IsLike("./AnyText", jQuery('#' + thiss.container + " #txtAnyText").val(), "*", ".", "!", false);
                                var filter = new OpenLayers.Filter.Logical({
                                    type: OpenLayers.Filter.Logical.AND,
                                    filters: [alphanumFilter]
                                });
                                //var filter = new ol.format.ogc.filter.And(alphanum);
                                //                                thiss.layer.getSource().addFeature(feature);
                                //                                var extent = feature.getGeometry().getExtent();
                                //                                var coordinate = ol.extent.getCenter(extent);
                                //                                var html = "";
                                //                                thiss.infoWindow.show(coordinate, html);
                                //                                thiss.map.getView().fit(extent, thiss.map.getSize(), { maxZoom: 10 });
                                var parameters = thiss.format.write({
                                    resultType: "results_with_summary",
                                    startPosition: startPosition,
                                    maxRecords: thiss.config.module.widget.paginator.recordsByPage,
                                    Query: {
                                        ElementSetName: {
                                            value: "full"
                                        },
                                        Constraint: {
                                            version: "1.1.0",
                                            Filter: filter
                                        }
                                    }
                                });
                                return parameters;
                            };
                            BaseWidget.prototype.writeData = function (data) {
                                var thiss = this;
                                thiss.$divResult.empty();
                                var html = '';
                                var count = (data.items.length);
                                if (count === 0) {
                                    toastr.info('No se encontraron coincidencias');
                                    return;
                                }
                                data.items.forEach(function (item, i) {
                                    thiss.addToMap(item.feature);
                                    var className = (i == count - 1) ? "dropup" : "dropdown";
                                    html = '<div class="panel panel-default" id="' + item.oid + '">';
                                    html += '<div class="panel-heading">';
                                    html += '<div class="' + className + ' pull-right">';
                                    html += '<a id="catalogOption' + i + '" href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Opciones <b class="caret"></b></a>';
                                    html += '<ul class="dropdown-menu" role="menu" aria-labelledby="catalogOption' + i + '">';
                                    html += '<li><a href="' + item.info.baseUrl + '?uuid=' + item.info.uuid + '" target="_blank">Detalle</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/xml.metadata.get?uuid=' + item.info.uuid + '" target="_blank">Xml</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/xml_iso19139?uuid=' + item.info.uuid + '" target="_blank">Esquema</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/pdf?uuid=' + item.info.uuid + '" target="_blank">Pdf</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/rdf.metadata.get?uuid=' + item.info.uuid + '" target="_blank">Rdf</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/mef.export?version=2&uuid=' + item.info.uuid + '" target="_blank">Zip</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + '/apps/html5ui/print.html?currTab=view-simple&hl=' + item.language + '&uuid=' + item.info.uuid + '" target="_blank">Imprimir</a></li>';
                                    html += '<li><a href="' + item.info.baseUrl + item.info.locService + '/google.kml?uuid=' + item.info.uuid + '" target="_blank">Kml</a></li>';
                                    html += '</ul>';
                                    html += '</div>';
                                    html += '<h3 class="panel-title">' + item.title + '</h3>';
                                    html += '</div>';
                                    html += '<div class="panel-body">';
                                    html += '<div><i>Fecha creación:</i> <strong>' + item.info.createDate + '</strong> - <i>Fecha modificación:</i> <strong>' + item.info.changeDate + '</strong></div>';
                                    html += '<div>' + item.abstract + '</div>';
                                    html += '</div>';
                                    html += '</div>';
                                    thiss.$divResult.append(html);
                                });
                                this.configPaginator(data.paginator);
                            };
                            BaseWidget.prototype.configPaginator = function (paginator) {
                                var thiss = this;
                                thiss.$ulPaginator.twbsPagination({
                                    totalPages: paginator.total,
                                    visiblePages: thiss.config.module.widget.paginator.visiblePages,
                                    startPage: 1,
                                    first: '<<',
                                    prev: '<',
                                    next: '>',
                                    last: '>>',
                                    paginationClass: "pagination pagination-panel",
                                    onPageClick: function (event, page) {
                                        var startPosition = ((thiss.config.module.widget.paginator.recordsByPage * page) + 1) - thiss.config.module.widget.paginator.recordsByPage;
                                        thiss.search(startPosition);
                                    }
                                });
                            };
                            BaseWidget.prototype.search = function (startPosition) {
                            };
                            BaseWidget.prototype.addToMap = function (feature2) {
                            };
                            BaseWidget.prototype.loadDependencies = function () {
                                //var dependencies = [this.js.module.path + "helper/cswhelper.js"];
                                //_super.prototype.loadDependencies.call(this, dependencies);
                            };
                            BaseWidget.prototype.cleanControls = function () {
                                _super.prototype.cleanControls.call(this);
                            };
                            return BaseWidget;
                        })(geometry.Widget);
                        basic.BaseWidget = BaseWidget;
                    })(widgets.basic || (widgets.basic = {}));
                    var basic = widgets.basic;
                })(catalog.widgets || (catalog.widgets = {}));
                var widgets = catalog.widgets;
            })(geometry.catalog || (geometry.catalog = {}));
            var catalog = geometry.catalog;
        })(jtm.geometry || (jtm.geometry = {}));
        var geometry = jtm.geometry;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));