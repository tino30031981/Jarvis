function getInstance() {
    return com.jtm.documentlibrary.Attachment.execute();
}
(function (com) {
    (function (jtm) {
        (function (documentlibrary) {
            var Attachment = (function (_super) {
                __extends(Attachment, _super);
                function Attachment() {
                    _super.call(this);
                    this.$btnFile = null;
                    this.$btnShowHide = null;
                    this.$listFile = null;
                    this.$listAttachments = null;
                    this.$filFile = null;
                    this.$divAttachment = null;
                    this.$divDragAndDrop = null;
                    this.items = null;
                    this.urlSearch = null;
                    this.urlViewer = null;
                    this.urlSave = null;
                    this.urlDelete = null;
                    this.dragAndDropFiles = function () {
                        var thiss = this;
                        if (thiss.$divDragAndDrop.find('>ul').length == 0) {
                            thiss.$divDragAndDrop.text(this.options.textDropLeave);
                            thiss.$divDragAndDrop.addClass('jca-cursor');
                        }
                        else {
                            thiss.$divDragAndDrop.removeClass('jca-cursor');
                        }
                        thiss.$divDragAndDrop.off("click");
                        thiss.$divDragAndDrop.on("click", function (e) {
                            if (jQuery(this).find('>ul').length == 0) {
                                jQuery(this).text(thiss.options.textDropLeave);
                                jQuery(this).addClass('jca-cursor');
                                thiss.$filFile.trigger('click');
                            }
                        });
                        thiss.$divDragAndDrop.off("dragstart");
                        thiss.$divDragAndDrop.on('dragstart', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        thiss.$divDragAndDrop.off("drag");
                        thiss.$divDragAndDrop.on('drag', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        thiss.$divDragAndDrop.off("dragover");
                        thiss.$divDragAndDrop.on('dragover', function (e) {
                            $(this).addClass('jca-drop-zone-over');
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        thiss.$divDragAndDrop.off("dragenter");
                        thiss.$divDragAndDrop.on('dragenter', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        thiss.$divDragAndDrop.off("dragleave");
                        thiss.$divDragAndDrop.on('dragleave', function (e) {
                            $(this).removeClass('jca-drop-zone-over');
                        });
                        thiss.$divDragAndDrop.off("dragend");
                        thiss.$divDragAndDrop.on('dragend', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        thiss.$divDragAndDrop.off("drop");
                        thiss.$divDragAndDrop.on('drop', function (e) { // drop-handler event
                            if (e.originalEvent.dataTransfer) {
                                //$('#draganddropProgress').attr('style', 'width: 0%').attr('aria-valuenow', '0').text('0%'); // Bootstrap progress bar at 0%
                                if (e.originalEvent.dataTransfer.files.length) { // Check if we have files
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (thiss.$hdnId.int32() === 0) {
                                        toastr.info(Attachment.NEWELEMENTID);
                                        $(this).removeClass('jca-drop-zone-over');
                                        return;
                                    }
                                    thiss.writeList(e.originalEvent.dataTransfer.files);
                                }
                            }
                            $(this).removeClass('jca-drop-zone-over');
                        });
                    };
                    this.selectFiles = function () {
                        var thiss = this;
                        thiss.$filFile.off('change');
                        thiss.$filFile.on('change', function (e) {                            
                            if (e.originalEvent.target.files.length) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (thiss.$hdnId.int32() === 0) {
                                    toastr.info(Attachment.NEWELEMENTID);
                                    return;
                                }
                                thiss.writeList(e.originalEvent.target.files);
                            }
                        });
                    };
                    this.writeList = function (files) {
                        var thiss = this;
                        var id = 0;
                        thiss.items = [];
                        for (var i = 0; i < files.length; i++) {
                            id = thiss.getUUID();
                            thiss.$listAttachments.append('<li id="' + id + '" class="list-group-item"><div class="input-group"><input type="text" value="' + files[i].name + '" class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-trash jca-cursor jca-file-remove"></i></span></div></li>');
                            thiss.items.push({
                                id: id,
                                name: files[i].name,
                                originalName: files[i].name,
                                size: files[i].size,
                                contentType: files[i].type,
                                lastModifiedDate: files[i].lastModifiedDate,
                                status: Attachment.STATUS.NONE,
                                file: files[i]
                            });
                        }
                        if (thiss.$listAttachments.length > 0)
                            thiss.$divAttachment.show();
                        thiss.$btnShowHide.off('click');
                        thiss.$btnShowHide.on('click', function (e, isClosed) {
                            var state = typeof isClosed === "boolean" ? isClosed : $(this).find('>i').hasClass(Attachment.UPLOADSHOW);
                            if (state) {
                                $(this).find('>i').removeClass(Attachment.UPLOADSHOW).addClass(Attachment.UPLOADHIDE);
                                thiss.$divAttachment.find('>.panel-body').hide();
                            }
                            else {
                                $(this).find('>i').removeClass(Attachment.UPLOADHIDE).addClass(Attachment.UPLOADSHOW);
                                thiss.$divAttachment.find('>.panel-body').show();
                            }
                        });
                        thiss.$btnShowHide.trigger('click', false);
                        thiss.$listAttachments.find('li span .jca-file-remove').off('click');
                        thiss.$listAttachments.find('li span .jca-file-remove').on('click', function (e) {
                            var id = jQuery(this).closest('li').attr('id');
                            var index = 0;
                            jQuery(this).closest('li').remove();
                            for (var i = 0; i < thiss.items.length; i++) {
                                if (thiss.items[i].id = id)
                                    index = i;
                            }
                            thiss.items.splice(index, 1);
                        });
                    };
                    this.upload = function (items) {
                        var thiss = this;
                        if (thiss.$hdnId.int32() === 0) return;
                        var item = items.shift();
                        item.name = thiss.$listAttachments.find('#' + item.id + ' input:text').val();
                        var options = {
                            url: thiss.urlSave,
                            data: {
                                id: thiss.$hdnId.int32(),
                                document: item
                            },
                            validate: validate,
                            attachments: [{ id: 'filFile', file: item.file }]
                        };
                        thiss.ajax(options, function (data) {
                            if (items.length > 0)
                                thiss.upload(items);
                            else {
                                thiss.items = null;
                                thiss.clean();
                                thiss.search("", {}, null);
                            }
                        });
                        function validate() {
                            //if (thiss.items.length === 0) {
                            //    toastr.info('No existen archivos para cargar');
                            //    return false;
                            //}
                            //else
                            return true;
                        }
                    };
                    this.clean = function () {
                        var thiss = this;
                        thiss.$listAttachments.empty();
                        thiss.$divAttachment.hide();
                    };
                    this.setContainers = function () {
                        var thiss = this;
                        thiss.$main.find('>.panel-body').css('position', 'relative');
                        thiss.$divAttachment.css({ 'position': 'absolute', 'bottom': '0', 'right': '0' });
                    };
                    this.writeFile = function (items) {
                        var thiss = this;
                        thiss.$listFile.empty();
                        items.forEach(function (item) {
                            thiss.$listFile.append('<li id="' + item.id + '" class="list-group-item"><span class="glyphicon glyphicon-folder-close"><a href="' + com.jtm.Server.contextPath + 'documentlibrary/document/viewer?id=' + item.id + '" target="_blank"> ' + item.name + '</a></span><span class="badge"><i class="glyphicon glyphicon-trash jca-cursor jca-file-remove"></i></span></li>');
                        });
                        thiss.$listFile.find('li .jca-file-remove').off('click');
                        thiss.$listFile.find('li .jca-file-remove').on('click', function (e) {
                            thiss.deleteFile(jQuery(this).closest('li').attr('id'));
                        });
                    };
                    this.deleteFile = function (id) {
                        var thiss = this;
                        if (String.isNullOrWhiteSpace(id)) return;
                        var options = {
                            data: { id: id },
                            isJson: false
                        };
                        thiss.deleteConfig(thiss.urlDelete, options, function () {
                            thiss.search(null);
                        });
                    };
                }
                Attachment.STATUS = {
                    NONE: 'none',
                    OK: 'ok',
                    ERROR: "error"
                };
                Attachment.FILFILE = '#filFile';
                Attachment.UPLOADSHOW = "glyphicon-triangle-bottom";
                Attachment.UPLOADHIDE = "glyphicon-triangle-top";
                Attachment.prototype.viewConfig = function () {
                    var thiss = this;
                    thiss.$filFile = thiss.$main.find(Attachment.FILFILE);
                    thiss.$listFile = thiss.$main.find('#listFile');
                    thiss.$divAttachment = thiss.$main.find('>.panel-body>.panel-default');
                    thiss.$divDragAndDrop = thiss.$main.find('>.panel-body');                    
                    thiss.$listAttachments = thiss.$divAttachment.find('>.panel-body>ul');
                    thiss.$btnClean = thiss.$divAttachment.find('>.panel-heading>div.btn-toolbar>div>button');
                    thiss.$btnFile = thiss.$main.find('#btnFile');
                    thiss.$btnSave = thiss.$divAttachment.find('#btnSaveFile');
                    thiss.$btnShowHide = thiss.$divAttachment.find('#btnShowHide');
                    thiss.$divAttachment.hide();
                    thiss.setContainers();
                };
                Attachment.prototype.initConfig = function () {
                    
                };
                Attachment.prototype.buttonConfig = function (options) {
                    var thiss = this;
                    thiss.selectFiles();
                    thiss.dragAndDropFiles();
                    thiss.$btnFile.off('click');
                    thiss.$btnFile.on('click', function (e) {
                        if (thiss.$hdnId.int32() === 0) {
                            toastr.info(Attachment.NEWELEMENTID);
                            return;
                        }
                        thiss.$filFile.trigger('click');
                    });
                    thiss.$btnClean.off('click');
                    thiss.$btnClean.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        thiss.clean();
                    });
                    thiss.$btnSave.off("click");
                    thiss.$btnSave.on("click", function (e) {
                        thiss.save();
                    });
                };
                Attachment.prototype.search = function (id) {
                    var thiss = this;
                    id = id || thiss.$hdnId.int32();
                    if (id === 0) return;
                    options = {
                        data: { id: id },
                        isJson: false
                    };
                    thiss.searchConfig(thiss.urlSearch, options, function (items) {
                        thiss.writeFile(items);
                    });
                };
                Attachment.prototype.save = function (url, data, options) {
                    var thiss = this;
                    thiss.upload(thiss.items);
                };
                Attachment.prototype.load = function ($container, options) {
                    var thiss = this;
                    options = options || {};
                    thiss.$hdnId = options.$hdnId;
                    thiss.urlSearch = options.urlSearch;
                    thiss.urlViewer = options.urlViewer;
                    thiss.urlSave = options.urlSave;
                    thiss.urlDelete = options.urlDelete;
                    if (String.isNullOrWhiteSpace($container) === true)
                        $container = thiss.$main;
                    if (typeof $container === "string")
                        $container = jQuery($container);
                    thiss.$main = ($container.length === 0) ? thiss.$main : $container;
                    this.initConfig();
                    this.viewConfig();
                    this.buttonConfig();
                };
                Attachment.execute = function () {
                    return new Attachment();
                };
                return Attachment;
            })(jtm.Master);
            documentlibrary.Attachment = Attachment;
        })(jtm.documentlibrary || (jtm.documentlibrary = {}));
        var documentlibrary = jtm.documentlibrary;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));