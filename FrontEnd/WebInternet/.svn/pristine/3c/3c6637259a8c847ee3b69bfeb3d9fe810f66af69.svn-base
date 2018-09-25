function getInstance() {
    return com.jtm.miningproject.miningproject.Folder.execute();
}
(function (com) {
    (function (jtm) {
        (function (miningproject) {
            (function (miningproject) {
                var Folder = (function (_super) {
                    __extends(Folder, _super);
                    function Folder() {
                        _super.call(this);
                        this.$hdnIdParentFolder = null;
                        this.$hdnIdFolder = null;
                        this.$txtNameFolder = null;
                        this.$btnSaveFolder = null;
                        this.$btnAddFolder = null;
                        this.$divResultFolder = null;
                        this.listFolder = function () {
                            var thiss = this;
                            thiss.$divResultFolder.find('>ul').empty();
                            thiss.searchConfig(thiss.urlListFolder, { data: { miningProjectId: thiss.$hdnId.int32(), officeId: 0 }, isJson: false }, function (items) {
                                thiss.fillList(items, thiss.$divResultFolder.find('>ul'));
                                thiss.$divResultFolder.find('ul li .jca-button-a').off('click');
                                thiss.$divResultFolder.find('ul li .jca-button-a').on('click', function (e) {
                                    e.preventDefault();
                                });
                                thiss.$divResultFolder.find('ul li .jca-folder-edit').off('click');
                                thiss.$divResultFolder.find('ul li .jca-folder-edit').on('click', function (e) {
                                    thiss.$hdnIdFolder = jQuery(this).closest('li').attr('id');
                                    thiss.formFolder(jQuery(this).closest('li').attr('id'));
                                });
                                thiss.$divResultFolder.find('ul li .jca-folder-add').off('click');
                                thiss.$divResultFolder.find('ul li .jca-folder-add').on('click', function (e) {
                                    thiss.formFolder(jQuery(this).closest('li').attr('id'));
                                });
                                thiss.$divResultFolder.find('ul li .jca-folder-remove').off('click');
                                thiss.$divResultFolder.find('ul li .jca-folder-remove').on('click', function (e) {
                                    thiss.delete(jQuery(this).closest('li').attr('id'));
                                });
                                thiss.$divResultFolder.find('ul li .jca-active').off('click');
                                thiss.$divResultFolder.find('ul li .jca-active').on("click", function (e) {
                                    jQuery(this).closest('li').parents('ul#ulParent').find('li').removeClass("active");
                                    jQuery(this).closest('li').toggleClass("active");
                                });
                            });
                        };
                        this.fillList = function (items, $ul) {
                            var thiss = this;
                            items.forEach(function (item, i) {
                                $ul.append('<li id="' + item.id + '" folderid="' + item.folder.id + '"></li>');
                                $ul.find('>li:last').append('<input class="jca-active" type="checkbox" id=item' + item.folder.id + '-' + i + ' /><label for=item' + item.folder.id + '-' + i + ' >' + item.name + '</label>');
                                $ul.find('>li:last').append('&nbsp;&nbsp;<span class="badge"><i class="glyphicon glyphicon-edit jca-cursor jca-folder-edit"></i></span>');
                                $ul.find('>li:last').append('&nbsp;&nbsp;<span class="badge"><i class="glyphicon glyphicon-folder-open jca-cursor jca-folder-add"></i></span>');
                                $ul.find('>li:last').append('&nbsp;&nbsp;<span class="badge"><i class="glyphicon glyphicon-trash jca-cursor jca-folder-remove"></i></span>');
                                if (item.folders.length > 0) {
                                    $ul.find('>li:last').append('<ul></ul>');
                                    thiss.fillList(item.folders, $ul.find('>li:last>ul'));
                                }
                            });
                        };
                        this.formFolder = function (folderId) {
                            var thiss = this;
                            thiss.$divPopup.dialog({
                                title: "Carpetas",
                                width: '400',
                                resizable: false,
                                modal: true,
                                closeOnEscape: true,
                                autoempty: true,
                                close: function (dialog) {
                                }
                            });
                            thiss.loadView(thiss.$divPopup, thiss.urlFormFolder, function () {
                                thiss.$btnSaveFolder = thiss.$divPopup.find('#btnSaveFolder');
                                thiss.$hdnIdFolder = thiss.$divPopup.find('#hdnIdFolder').val(thiss.$hdnIdFolder);
                                thiss.$hdnIdParentFolder = thiss.$divPopup.find('#hdnIdParentFolder');
                                thiss.$txtNameFolder = thiss.$divPopup.find('#txtNameFolder');
                                thiss.$hdnIdParentFolder.val(folderId);
                                thiss.$btnSaveFolder.off('click');
                                thiss.$btnSaveFolder.on('click', function (e) {
                                    thiss.save();
                                });
                            });
                        };
                    }
                    Folder.ULRESULTFOLDERS = "#divResultFolder";
                    Folder.prototype.form = function (url, id, options) {
                        var thiss = this;
                        thiss.loadView(thiss.$form, thiss.urlForm, function () {
                            thiss.$main.hide();
                            thiss.$form.show();
                            thiss.buildClose();
                            thiss.domConfig();
                            thiss.buttonConfig();
                            if (id != null)
                                thiss.$hdnId.val(id);
                            thiss.listFolder();
                        });
                    };
                    Folder.prototype.save = function (url, data, options, callback) {
                        var thiss = this;
                        var data = {
                            id: thiss.$hdnIdFolder.int32(),
                            moduleId: thiss.$hdnId.int32(),
                            folder: { id: thiss.$hdnIdParentFolder.int32() },
                            name: thiss.$txtNameFolder.val()
                        };
                        var options = {
                            data: data,
                            isJson: true,
                            validate: validate
                        };
                        _super.prototype.save.call(this, thiss.urlSave, data, options, function () {
                            thiss.listFolder();
                            thiss.$divPopup.dialog('close');
                        });
                        function validate() {
                            var success = true;
                            var message = '';
                            if (thiss.$txtNameFolder.val() === '') {
                                success = false;
                                message = 'Ingrese Nombre';
                                thiss.$txtNameFolder.focus();
                            }
                            if (message !== '')
                                alert(message);
                            return success;
                        };
                    };
                    Folder.prototype.delete = function (id, url , options, callback) {
                        var thiss = this;
                        options = options || {};
                        options.data = { id: id };
                        options.isJson = false;
                        options.validate = validate;
                        thiss.deleteConfig(thiss.urlDelete, options, function () {
                            thiss.listFolder();
                        });
                        function validate() {
                            if (id === 0)
                                return false;
                            return true;
                        }
                    };
                    Folder.prototype.domConfig = function () {
                        var thiss = this;
                        thiss.$divResultFolder = this.$form.find(Folder.ULRESULTFOLDERS);
                        thiss.$btnAddFolder = this.$form.find('#btnAddFolder');
                        thiss.$btnDeselectedFolder = this.$form.find('#btnDeselectedFolder');
                        thiss.$divPopup = this.$form.find('#divPopup');
                        thiss.$hdnIdParent = this.$form.find('#hdnIdParent');
                        thiss.$hdnId = this.$form.find('#hdnId');
                    };
                    Folder.prototype.buttonConfig = function () {
                        var thiss = this;
                        thiss.$btnAddFolder.off('click');
                        thiss.$btnAddFolder.on('click', function (e) {
                            thiss.formFolder(0);
                        });
                        thiss.$btnDeselectedFolder.off('click');
                        thiss.$btnDeselectedFolder.on('click', function (e) {
                            thiss.$divResultFolder.on('deselect_all.jstree', function (e, data) {
                            });
                            thiss.$divResultFolder.on('deselect_node.jstree', function (e, data) {
                            });
                        });
                    };
                    Folder.prototype.load = function ($container, options) {
                        var thiss = this;
                        options = options || {};
                        //thiss.$hdnId = options.$hdnId;
                        thiss.urlDelete = com.jtm.Server.contextPath + 'miningproject/folder/delete';
                        thiss.urlForm = com.jtm.Server.contextPath + "miningproject/folder/form";
                        thiss.urlListFolder = com.jtm.Server.contextPath + 'miningproject/folder/searchbyminingproject';
                        thiss.urlSave = com.jtm.Server.contextPath + "miningproject/folder/save";
                        thiss.urlFormFolder = com.jtm.Server.contextPath + "miningproject/folder/formfolder";
                        if (String.isNullOrWhiteSpace($container) === true)
                            $container = this.$form;
                        if (typeof $container === "string")
                            $container = jQuery($container);
                        this.$form = ($container.length === 0) ? this.$form : $container;
                        this.$main = this.$form.parent().find(Folder.DOMMAIN);
                        this.form(null, options.id, null);
                    };
                    Folder.execute = function () {
                        return new Folder();
                    };
                    return Folder;
                })(jtm.Master);
                miningproject.Folder = Folder;
            })(miningproject.miningproject || (miningproject.miningproject = {}));
            var miningproject = miningproject.miningproject;
        })(jtm.miningproject || (jtm.miningproject = {}));
        var miningproject = jtm.miningproject;
    })(com.jtm || (com.jtm = {}));
    var jtm = com.jtm;
})(com || (com = {}));