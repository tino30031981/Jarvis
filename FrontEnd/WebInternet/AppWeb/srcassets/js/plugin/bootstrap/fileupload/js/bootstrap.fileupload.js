(function ($) {
    $.fn.fileupload = function (options) {
        var helper = new FileUpload(this, options);
        helper.realize();
        return this;
    };
    $.fn.fileupload.defaults = {
        urlSave: '',
        urlViewer: '',
        urlDelete: '',
        urlDetail: '',
        urlSearch: '',
        textDropLeave: "Sólo tienes que arrastrar y soltar los archivos aquí",
        textDropOver: "Suélte los archivos aquí",
        titleOption: "Opción de carga",
        titleDrop: "Lista de archivos",
        titleList: "Archivos a subir",
        multiple: true,
        accept: '',
        validateSave: function () {
            return true;
        },
        validateDelete: function () {
            return confirm("¿Está seguro de eliminar?");
        }
    };
    /*$('body').on('keydown', 'input', function(ev) {
    if (ev.which == 9) {
        var tabEv = $.extend({}, ev, { type: 'tab' });
        return $(ev.target).trigger(tabEv);
    }

    if (ev.which == 13) {
        var enterEv = $.extend({}, ev, { type: 'enter' });
        return $(ev.target).trigger(enterEv);
    }
	});*/
    $.fn.uploadfile = function (selector, data, fn) {
        return this.trigger("upload", data);
        //return this.on('upload', selector, data, fn);
    };
    var FileUpload = function (obj, options) {
        if (obj.length === 0) {
            alert("No hay ningún elemento de tipo file");
            return;
        }
        this.objUrl = window.URL || window.webkitURL;
        this.imageTypeAccept = "image/*";
        this.imageTypeRegex = /image.*/;
        this.items = [];
        this.i = 0;
        this.options = $.extend(true, $.fn.fileupload.defaults, options);
        this.realize = function () {
            var thiss = this;
            destroy();
            this.setPanel(this.createPanel())
			.setPanelDrop(this.createPanelDrop())
            this.getFile().wrap(this.getPanel());
            this.getDom().append(this.getPanelDrop());
            this.addEventListenerFile();
            this.addEventListenerOptionFile();
            this.addEventListenerOptionDocument();
            this.addEventListenerOptionClear();
            this.addEventListenerDrop();
            function destroy() {
                thiss.getDom('optiondrop').remove();
                thiss.getDom('listfile').remove();
                if (jQuery(obj).closest(thiss.getDom()).length > 0)
                    jQuery(obj).unwrap();
            }
        };
        this.addEventListenerFile = function () {
            var thiss = this;
            this.getFile().on("change", function (e) {
                if (e.originalEvent.target.files.length) { // Check if we have files
                    e.preventDefault();
                    e.stopPropagation();
                    thiss.addToList(e.originalEvent.target.files);
                }
                thiss.getFile().val('');
            });
            this.getFile().on("upload", {}, function (e, extraData) {
                if (thiss.items.length == 0) {
                    alert("Seleccione los archivos a subir");
                    return;
                }
                thiss.i = 0;
                thiss.upload(thiss.items[thiss.i], extraData);
            });
            this.getFile().on("search", {}, function (e, data) {
                thiss.search(data);
            });
        };
        this.addEventListenerOptionFile = function () {
            var thiss = this;
            this.getDom('optionfile').on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                thiss.getFile().click();
            });
        };
        this.addEventListenerOptionDocument = function () {
            var thiss = this;
            this.getDom('optiondocument').on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                thiss.getFile().click();
            });
        };
        this.addEventListenerOptionClear = function () {
            var thiss = this;
            this.getDom('optionclear').on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                thiss.items = [];
                thiss.getDom("list").empty();
            });
        };
        this.addEventListenerDrop = function () {
            var thiss = this;
            if (this.getDom('drop').find('>ul').length == 0) {
                this.getDom('drop').text(this.options.textDropLeave);
                this.getDom('drop').addClass(thiss.getNamespaceClass('cursor'));
            }
            else {
                this.getDom('drop').removeClass(thiss.getNamespaceClass('cursor'));
            }
            this.getDom('drop').off("click");
            this.getDom('drop').on("click", function (e) {
                if (jQuery(this).find('>ul').length == 0) {
                    jQuery(this).text(thiss.options.textDropLeave);
                    jQuery(this).addClass(thiss.getNamespaceClass('cursor'));
                    thiss.getFile().click();
                }
            });
            this.getDom('drop').off("dragstart");
            this.getDom('drop').on('dragstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            this.getDom('drop').off("drag");
            this.getDom('drop').on('drag', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            this.getDom('drop').off("dragover");
            this.getDom('drop').on('dragover', function (e) {
                $(this).addClass(thiss.getNamespaceClass('drop-zone-over'));
                e.preventDefault();
                e.stopPropagation();
            });
            this.getDom('drop').off("dragenter");
            this.getDom('drop').on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            this.getDom('drop').off("dragleave");
            this.getDom('drop').on('dragleave', function (e) {
                $(this).removeClass(thiss.getNamespaceClass('drop-zone-over'));
            });
            this.getDom('drop').off("dragend");
            this.getDom('drop').on('dragend', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            this.getDom('drop').off("drop");
            this.getDom('drop').on('drop', function (e) { // drop-handler event
                if (e.originalEvent.dataTransfer) {
                    //$('#draganddropProgress').attr('style', 'width: 0%').attr('aria-valuenow', '0').text('0%'); // Bootstrap progress bar at 0%
                    if (e.originalEvent.dataTransfer.files.length) { // Check if we have files
                        e.preventDefault();
                        e.stopPropagation();
                        thiss.addToList(e.originalEvent.dataTransfer.files);
                    }
                }
                $(this).removeClass(thiss.getNamespaceClass('drop-zone-over'));
            });
        };
        this.addEventListenerDelete = function () {
            var thiss = this;
            this.getDom("drop").off("click");
            this.getDom("drop").on("click", ("." + this.getNamespaceClass('file-remove')), function (e) {
                thiss.delete(this);
            });
        };
        this.getUUID = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        this.addToList = function (files) {
            var thiss = this;
            var i = 0;
            for (i = 0; i < files.length; i++) {
                /*if (!files[i].type.match(imageType)) {
				continue;
				}*/
                var index = this.items.length + 1;
                var id = this.getUUID();
                this.items.push({
                    id: id,
                    originalName: files[i].name,
                    size: files[i].size,
                    type: files[i].type,
                    lastModified: files[i].lastModified,
                    status: 'none',
                    file: files[i]
                });
                this.getDom('list').append('<li id="' + id + '" class="list-group-item"><span class="glyphicon glyphicon-file"></span><span class="badge">'
				+ files[i].size + ' bytes<i class="glyphicon glyphicon-arrow-up ' + thiss.getNamespaceClass('status') + '"></i></span>' + files[i].name + '</li>');
            }
        };
        this.upload = function (item, extraData) {
            var thiss = this;
            if (item == undefined || item == null || item.status == 'ok') {
                this.getDom('progress').text('');
                thiss.i++;
                if (thiss.i < thiss.items.length)
                    this.upload(thiss.items[thiss.i], extraData);
                return;
            }
            this.updateProgress(0);
            var data = new FormData();
            data.append(this.getId(), item.file);
            $.each(extraData, function (key, value) {
                data.append(key, value);
            });
            $.ajax({ // JQuery Ajax
                type: 'POST',
                url: thiss.options.urlSave,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (evt) {
                            if (evt.lengthComputable) {
                                var percent = (evt.loaded / evt.total) * 100;
                                thiss.updateProgress(Math.round(percent));
                            }
                        }, false);
                    }
                    return xhr;
                },
                beforeSend: function () {
                    if (typeof thiss.options.validateSave === "function")
                        return thiss.options.validateSave();
                    else
                        return false;
                },
                data: data, // We send the data string
                cache: false,
                contentType: false,
                processData: false,
                async: true,
                dataType: 'json'
            })
			.done(function (data) {
			    thiss.updateProgress(100);
			    if (data.success == true) {
			        thiss.getDom('list').find('>li#' + item.id + ' .badge  .' + thiss.getNamespaceClass('status')).removeClass('glyphicon-arrow-up').removeClass('glyphicon-remove').addClass('glyphicon-ok');
			        item.status = 'ok';
			    }
			    else {
			        thiss.getDom('list').find('>li#' + item.id + ' .badge  .' + thiss.getNamespaceClass('status')).removeClass('glyphicon-arrow-up').removeClass('glyphicon-ok').addClass('glyphicon-remove');
			        item.sucess = "error";
			    }
			    thiss.detail(data.extra);
			    thiss.i++;
			    if (thiss.i < thiss.items.length)
			        thiss.upload(thiss.items[thiss.i], extraData);
			    else {
			        alert(data.message);
			    }
			})
			.fail(function () {
			    thiss.getDom('list').find('>li#' + item.id + ' .badge  .' + thiss.getNamespaceClass('status')).removeClass('glyphicon-arrow-up').addClass('glyphicon-remove');
			    item.status = 'error';
			});
        };
        this.detail = function (id) {
            var thiss = this;
            if ((/\d+/).test(id) == false || id == 0) return;
            this._addDomToDrop();
            $.post(thiss.options.urlDetail, { id: id }, function (data) {
                if (data.success == false) return;
                thiss._addDomChildToDrop('>ul', data.item);
            }, "json");
        };
        this.search = function (data) {
            var thiss = this;
            $.post(thiss.options.urlSearch, data, function (data) {
                if (data.success == false) { alert(data.message); return; }
                if (!data.items instanceof Array || data.items.length == 0) return;
                thiss._addDomToDrop();
                thiss.getDom('drop').find(">ul").empty();
                var i = 0;
                for (i = 0; i < data.items.length; i++) {
                    thiss._addDomChildToDrop('>ul', data.items[i]);
                }
            }, "json");
        };
        this.delete = function (obj) {
            var thiss = this;
            var id = jQuery(obj).closest('li').prop("id");
            if ((/\d+/).test(id) == false || id == 0) return;
            $.ajax({
                type: 'POST',
                url: thiss.options.urlDelete,
                beforeSend: function () {
                    if (typeof thiss.options.validateDelete === "function")
                        return thiss.options.validateDelete();
                    else
                        return false;
                },
                data: { id: id }, // We send the data string
                dataType: 'json'
            })
			.done(function (data) {
			    if (data.success == false) { alert(data.message); return; }
			    jQuery(obj).closest('li').remove();
			    if (thiss.getDom("drop").find("ul>li").length == 0) {
			        thiss.getDom("drop").find('ul').remove();
			        thiss.getDom('drop').addClass(thiss.getNamespaceClass('drop-zone-empty'));
			        thiss.getDom('drop').addClass(thiss.getNamespaceClass('cursor'));
			    }
			});
        };
        this._addDomToDrop = function () {
            if (this.getDom('drop').find(">ul").length == 0) {
                this.addEventListenerDrop();
                this.getDom('drop').removeClass(this.getNamespaceClass('drop-zone-empty'));
                this.getDom('drop').removeClass(this.getNamespaceClass('cursor'));
                this.getDom('drop').html("<ul></ul>");
            }
        };
        this._addDomChildToDrop = function (parent, item) {
            var icon = (!!item.isFile == true) ? "glyphicon-file" : "glyphicon-folder-close";
            this.getDom('drop').find(parent).append('<li id="' + item.id + '" class="list-group-item"></li>');
            this.getDom('drop').find(parent + ">li#" + item.id).append('<span class="glyphicon ' + icon + '"></span>');
            this.getDom('drop').find(parent + ">li#" + item.id + ">span").html('<a href="' + this.options.urlViewer + '?id=' + item.id + '" target="_blank">' + ((item.name == null || item.name == "") ? item.originalName : item.name) + '</a>');
            this.getDom('drop').find(parent + ">li#" + item.id).append('<span class="badge"><i class="glyphicon glyphicon-trash ' + this.getNamespaceClass('cursor') + ' ' + this.getNamespaceClass('file-remove') + '"></i></span>');
            this.addEventListenerDelete();
        };
        this.updateProgress = function (value) {
            this.getDom('progress').find('>.progress-bar').width(value + '%').attr('aria-valuenow', value).text(value + '%');
        };
        this.getFile = function () {
            obj.val('');
            obj.hide();
            if (this.options.multiple == true)
                obj.attr("multiple", true);
            else
                obj.removeAttr("multiple");
            obj.attr("accept", this.options.accept);
            return obj;
        };
        this.createPanel = function () {
            var $panel = $('<div class="col-md-12"></div>');
            $panel.prop('id', this.createDomId());
            return $panel;
        };
        this.getPanel = function () {
            return this.$panel;
        };
        this.setPanel = function ($panel) {
            this.$panel = $panel;
            return this;
        };
        this.createPanelDrop = function () {
            //<li><a id="'+this.createDomId('optiondocument')+'" href="#"><i class="glyphicon glyphicon-level-up"></i>Crear carpeta</a></li>
            var $panelDrop = $('<div class="panel panel-default"><div class="panel-heading ' + this.getNamespaceClass('panel-heading') + '"><nav class="navbar ' + this.getNamespaceClass('navbar') + '" role="navigation"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#' + this.createDomId('optionlist') + '"><span class="sr-only">Toggle Option</span><span class="glyphicon glyphicon-align-justify"></span></button><span class="navbar-brand">' + this.options.titleDrop + '</span></div><div class="collapse navbar-collapse" id="' + this.createDomId('optionlist') + '"><ul class="nav navbar-nav pull-right"><li class="dropdown"><a href="#" data-toggle="dropdown" class="dropdown-toggle">Opciones de carga<b class="caret"></b></a><ul class="dropdown-menu"><li><a id="' + this.createDomId('optionfile') + '" href="#"><i class="glyphicon glyphicon-open-file"></i>Sel. Archivo(s)</a></li><li class="divider"></li><li><a id="' + this.createDomId('optionclear') + '" href="#"><i class="glyphicon glyphicon-remove"></i>Limpiar</a></li></ul></li></ul></div></nav></div><div id="' + this.createDomId('drop') + '" class="panel-body ' + this.getNamespaceClass('drop-zone') + ' ' + this.getNamespaceClass('drop-zone-empty') + '" ondragover="return false"></div><div class="panel-footer ' + this.getNamespaceClass('panel-footer') + '"><div class="progress ' + this.getNamespaceClass('progress') + '" id="' + this.createDomId('progress') + '"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div></div></div><ul id="' + this.createDomId('list') + '" class="list-group small ' + this.getNamespaceClass('list-group') + '"></ul>');
            return $panelDrop;
        };
        this.getPanelDrop = function () {
            return this.$panelDrop;
        };
        this.setPanelDrop = function ($panelDrop) {
            this.$panelDrop = $panelDrop;
            return this;
        };
        this.getId = function () {
            return (obj[0].id.replace(/(#|\.)/, ""));
        };
        this.getDom = function (name) {
            if (name == undefined || name == null || name == '') return jQuery('#' + this.createDomId(null));
            return jQuery('#' + this.createDomId(null) + ' #' + this.createDomId(name));
        };
        this.createDomId = function (name) {
            return this.getNamespace(name) + '_' + this.getId();
        };
        this.getNamespace = function (name) {
            return (name != undefined && name != null && name != '') ? FileUpload.NAMESPACE + '_' + name : FileUpload.NAMESPACE;
        };
        this.getDomByClass = function (name) {
            return this.getNamespaceClass(name);
        };
        this.getNamespaceClass = function (name) {
            return (name != undefined && name != null && name != '') ? FileUpload.NAMESPACE + '-' + name : FileUpload.NAMESPACE;
        };
        FileUpload.NAMESPACE = 'jca';
    }
}(jQuery));