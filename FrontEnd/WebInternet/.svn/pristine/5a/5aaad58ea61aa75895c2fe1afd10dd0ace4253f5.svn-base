(function ($) {
    $.fn.dialog = function (options) {
        var action = (typeof options === "string") ? options : "open";
        this.options = (action == "open" && options == action) ? this.options : options;
        var helper = new Helper(this, this.options);
        this.options = helper.options;
        if (action == "close") {
            helper.onClose();
            return;
        }
        helper.realize();
        jQuery('body').removeClass("modal-open");
        return this;
    };
    var Helper = function (obj, options) {
        var sizePattern = /\d+(em|px|%)/;
        var defaultOptions = {
            type: 'type-primary',
            size: 'size-normal',
            cssClass: 'content-default',
            title: null,
            message: null,
            nl2br: true,
            closable: true,
            closeByBackdrop: true,
            closeByKeyboard: true,
            spinicon: 'glyphicon glyphicon-asterisk',
            autodestroy: true,
            autoremove: false,
            autoempty: false,
            autohide: true,
            draggable: true,
            modal: false,
            animate: true,
            description: '',
            tabindex: -1,
            position2: {
                x: 0,
                y: 0
            },
            width: 200,
            maxWidth: 200,
            buttons: []
        };
        this.options = $.extend(true, defaultOptions, options);
        this.getId = function () {
            if (typeof obj === "string")
                obj = jQuery(obj);
            return obj.prop("id");
        };
        this.realized = false;
        this.opened = false;
        this.draggableData = {
            isMouseDown: false,
            mouseOffset: {}
        };
        this.validateDom = function () {
            var id = this.getId();
            if (obj.length > 0) {
                if (id !== undefined && id !== null && id !== "") {
                    if (obj.closest('body').length === 0) {
                        jQuery('body').append(obj);
                    }
                } else {
                    obj.prop('id', this.getUUID());
                    if (obj.closest('body').length == 0) {
                        jQuery('body').append(obj);
                    }
                }
            }
        };
        this.onClose = function () {
            this.getDom('header').find("button").click();
        }
        this.close = function () {
            var thiss = this;
            if (this.options.autoremove == true) {
                destroy();
                jQuery(obj).remove();
            }
            if (this.options.autodestroy == true) {
                destroy();
            }
            if (this.options.autoempty == true)
                jQuery(obj).empty();
            else
                this.getDom().css("display", "none");
            jQuery("body > .modal-backdrop").remove();

            function destroy() {
                thiss.setRealized(false);
                thiss.getDom('header').remove();
                thiss.getDom('footer').remove();
                jQuery(obj).unwrap().unwrap().unwrap().unwrap();
            }
            if (this.options.autohide === true)
                jQuery(obj).css("display", "none");
            if (typeof this.options.close === "function")
                this.options.close(thiss);
        };
        this.realize = function () {
            this.validateDom();
            this.setModalOpacity(this.createModalOpacity());
            if (this.options.modal == true) {
                jQuery("body").prepend(this.getModalOpacity());
            }

            if (obj.closest('#' + this.createDomId()).length == 0) {
                this.initDialog();
                this.getDom('header').append(this.createHeaderContent());
                this.getDom('footer').append(this.createFooterContent());
                this.handleModalEvents();
                this.makeModalDraggable();
                this.setRealized(true);
                this.updateButtons();
                this.updateTitle();
            }
            this.getDom().modal("show");
        };
        this.initDialog = function () {
            this.addAttributes()
                .setModal(this.createModal())
                .setModalDialog(this.createDom('dialog'))
                .setModalContent(this.createDom('content'))
                .setModalHeader(this.createDom('header'))
                .setModalBody(this.createDom('body'))
                .setModalFooter(this.createDom('footer'));

            this.getDialog().wrap(this.getModal());
            this.getDialog().wrap(this.getModalDialog());
            this.getDialog().wrap(this.getModalContent());
            this.getDialog().wrap(this.getModalBody());
            this.getDialog().parent().before(this.getModalHeader());
            this.getDialog().parent().after(this.getModalFooter());
            var heightHeader = this.getDialog().parent().prev().outerHeight(true);
            var heightFooter = this.getDialog().parent().next().outerHeight(true);
            this.options.height = (typeof this.options.height === "number") ? this.options.height - heightHeader : this.options.height;
            this.options.maxHeight = (typeof this.options.maxHeight === "number") ? this.options.maxHeight - heightHeader : jQuery(window).outerHeight(true) - heightHeader;
            this.getDialog().css("height", this.options.height);
            this.getDialog().css("max-height", this.options.maxHeight);

            if (this.options.cssClass !== undefined && this.options.cssClass !== null && this.options.cssClass !== "")
                obj.closest("." + this.getNamespace('content')).addClass(this.getNamespace('content-default'));
            else
                obj.closest("." + this.getNamespace('content')).addClass(this.options.cssClass);
            return this;
        };

        this.addAttributes = function () {
            return this;
        };
        this.createModalOpacity = function () {
            return $('<div class="modal-backdrop fade in"></div>');
        };
        this.getModalOpacity = function () {
            return this.$modalOpacity;
        };
        this.setModalOpacity = function ($modalOpacity) {
            this.$modalOpacity = $modalOpacity;
            return this;
        };
        this.getDialog = function () {
            obj.css("display", "block");
            obj.css("overflow", "auto");
            obj.css("width", "100%");
            obj.css("padding", 0);
            obj.css("margin", 0);
            obj.addClass("container-fluid");
            //obj.css("max-width","95%");//$(window).width()
            //obj.css("max-height","95%");
            return obj;
        };
        this.createModal = function () {
            var $modal = $('<div class="modal fade in" data-toggle="modal" data-backdrop="false" role="dialog" aria-hidden="true"></div>');
            $modal.prop('id', this.createDomId());
            $modal.attr('aria-labelledby', this.getId() + '_title');
            $modal.css("display", "block");

            var position = this.getPosition();
            $modal.css("left", position.x + "%");
            $modal.css("top", position.y + "%");
            if (this.options.modal == true) {
                $modal.css("right", 0);
                $modal.css("bottom", 0);
                $modal.css("z-index", 9999);
            }
            else {
                $modal.css("right", "inherit");
                $modal.css("bottom", "inherit");
            }
            return $modal;
        };

        this.getModal = function () {
            return this.$modal;
        };
        this.setModal = function ($modal) {
            this.$modal = $modal;
            return this;
        };
        this.createDom = function (name) {
            return $('<div id="' + this.createDomId(name) + '" class="' + this.getNamespace(name) + '"></div>');
        };
        this.getModalDialog = function () {
            if (this.options.modal == true) {
                this.$modalDialog.css("width", this.options.width);
            }
            this.$modalDialog.css("padding", 0);
            this.$modalDialog.css("margin", 0);
            return this.$modalDialog;
        };
        this.setModalDialog = function ($modalDialog) {
            this.$modalDialog = $modalDialog;
            return this;
        };
        this.getModalContent = function () {
            return this.$modalContent;
        };
        this.setModalContent = function ($modalContent) {
            this.$modalContent = $modalContent;

            return this;
        };
        this.getModalHeader = function () {
            return this.$modalHeader;
        };
        this.setModalHeader = function ($modalHeader) {
            this.$modalHeader = $modalHeader;
            return this;
        };
        this.getModalBody = function () {
            return this.$modalBody;
        };
        this.setModalBody = function ($modalBody) {
            this.$modalBody = $modalBody;

            return this;
        };
        this.getModalFooter = function () {
            return this.$modalFooter;
        };
        this.setModalFooter = function ($modalFooter) {
            this.$modalFooter = $modalFooter;

            return this;
        };
        this.createDynamicContent = function (rawContent) {
            var content = null;
            if (typeof rawContent === 'function') {
                content = rawContent.call(rawContent, this);
            } else {
                content = rawContent;
            }
            if (typeof content === 'string') {
                content = this.formatStringContent(content);
            }

            return content;
        };
        this.createHeaderContent = function () {
            var $container = this.getModalHeader();
            $container.append(this.createTitleContent());

            $container.prepend(this.createCloseButton());
            return $container;
        };
        this.createTitleContent = function () {
            var $title = $('<div></div>');
            $title.addClass(('modal-title'));
            return $title;
        };
        this.createCloseButton = function () {
            var $icon = $('<button class="close" type="button">&times;</button>');
            $icon.attr("data-dismiss", "modal");
            $icon.attr("aria-hidden", true)
            if (this.options.closable == false)
                $icon.css("visibility", "hidden");
            $icon.on('click', { dialog: this }, function (event) {
                $('body').removeAttr("class");
                $('body').removeAttr("style");
                event.data.dialog.close();
            });

            return $icon;
        };

        this.createBodyContent = function () {
            var $container = this.getModalBody();
            return $container;
        };
        this.createFooterContent = function () {
            var $container = this.getModalFooter();
            return $container;
        };
        this.getTitle = function () {
            return this.options.title;
        };
        this.setTitle = function (title) {
            this.options.title = title;
            this.updateTitle();

            return this;
        };
        this.updateTitle = function () {
            if (this.isRealized()) {
                var title = this.getTitle() !== null ? this.createDynamicContent(this.getTitle()) : this.getDefaultText();
                this.getModalHeader().find('.' + 'modal-title').html('').append(title).prop('id', this.getId() + '_title');
            }

            return this;
        };
        this.getDefaultText = function () {
            return '';
        };
        this.getButtons = function () {
            return this.options.buttons instanceof Array ? this.options.buttons : new Array();
        };
        this.updateButtons = function () {
            if (this.isRealized()) {
                if (this.getButtons().length === 0) {
                    this.getDom('footer').hide();
                } else {
                    this.getDom('footer').show().html('').append(this.createFooterButtons());
                }
            }

            return this;
        };
        this.createFooterButtons = function () {
            var thiss = this;
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('footer-buttons'));
            $.each(this.options.buttons, function (index, button) {
                var $button = thiss.createButton(button);
                $container.append($button);
            });

            return $container;
        };
        this.createButton = function (button) {
            var thiss = this;
            var $button = $('<button class="btn"></button>');
            $button.prop('id', button.id);
            $button.data('button', button);
            if (typeof button.label !== 'undefined') {
                $button.append(button.label);
            }
            // Css class
            if (typeof button.cssClass !== 'undefined' && $.trim(button.cssClass) !== '') {
                $button.addClass(button.cssClass);
            } else {
                $button.addClass('btn-default');
            }
            // Button on click
            $button.on('click', function (event) {
                var button = $button.data('button');
                if (typeof button.action === 'function') {
                    return button.action(thiss);
                }
            });
            return $button;
        };
        this.getPosition = function () {
            if (this.options.position instanceof Array)
                if (this.options.position.length >= 2)
                    this.options.position = { x: this.options.position[0], y: this.options.position[1] };
                else
                    if (this.options.position.length == 1)
                        this.options.position = { x: this.options.position[0], y: this.options.position2[1] };
                    else
                        this.options.position = { x: this.options2.position[0], y: this.options.position2[1] };
            else
                this.options.position = { x: this.options.position2[0], y: this.options.position2[1] };
            delete this.options.position2;
            return this.options.position;
        };
        this.isRealized = function () {
            return this.realized;
        };
        this.setRealized = function (realized) {
            this.realized = realized;

            return this;
        };
        this.isOpened = function () {
            return this.opened;
        };
        this.setOpened = function (opened) {
            this.opened = opened;

            return this;
        };
        this.isAutodestroy = function () {
            return this.options.autodestroy;
        };
        this.handleModalEvents = function () {
            var thiss = this;
            this.getDom().on('show.bs.modal', { dialog: this }, function (event) {
                var dialog = event.data.dialog;
                dialog.setOpened(true);
            });
            this.getDom().on('shown.bs.modal', { dialog: this }, function (event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onshown === 'function' && dialog.options.onshown(dialog);
            });
            this.getDom().on('hide.bs.modal', { dialog: this }, function (event) {
                var dialog = event.data.dialog;
                dialog.setOpened(false);
            });
            this.getDom().on('hidden.bs.modal', { dialog: this }, function (event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onhidden === 'function' && dialog.options.onhidden(dialog);
                thiss.close();
            });

            /*
			// ESC key support
            this.getModal().on('keyup', {dialog: this}, function (event) {
                event.which === 27 && event.data.dialog.isClosable() && event.data.dialog.canCloseByKeyboard() && event.data.dialog.close();
            });

            // Button hotkey
            this.getModal().on('keyup', {dialog: this}, function (event) {
                var dialog = event.data.dialog;
                if (typeof dialog.registeredButtonHotkeys[event.which] !== 'undefined') {
                    var $button = $(dialog.registeredButtonHotkeys[event.which]);
                    !$button.prop('disabled') && $button.focus().trigger('click');
                }
            });*/

            return this;
        };
        this.isModalEvent = function (event) {
            return typeof event.namespace !== 'undefined' && event.namespace === 'bs.modal';
        },
            this.makeModalDraggable = function () {
                var thiss = this;
                if (this.options.draggable) {
                    this.getDom('header').addClass(this.getNamespace('draggable')).on('mousedown', { dialog: this }, function (event) {
                        var dialog = event.data.dialog;
                        dialog.draggableData.isMouseDown = true;
                        var dialogOffset = null;
                        if (thiss.options.modal == true)
                            dialogOffset = dialog.getDom('dialog').offset();
                        else
                            dialogOffset = dialog.getDom().offset();
                        dialog.draggableData.mouseOffset = {
                            top: event.clientY - dialogOffset.top,
                            left: event.clientX - dialogOffset.left
                        };
                    });
                    this.getDom().on('mouseup mouseleave', { dialog: this }, function (event) {
                        event.data.dialog.draggableData.isMouseDown = false;
                    });
                    $('body').on('mousemove', { dialog: this }, function (event) {
                        var dialog = event.data.dialog;
                        if (!dialog.draggableData.isMouseDown) {
                            return;
                        }
                        if (thiss.options.modal == true)
                            dialog.getDom('dialog').offset({
                                top: event.clientY - dialog.draggableData.mouseOffset.top,
                                left: event.clientX - dialog.draggableData.mouseOffset.left
                            });
                        else
                            dialog.getDom().offset({
                                top: event.clientY - dialog.draggableData.mouseOffset.top,
                                left: event.clientX - dialog.draggableData.mouseOffset.left
                            });
                    });
                }

                return this;
            };
        this.formatStringContent = function (content) {
            if (this.options.nl2br) {
                return content.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
            }

            return content;
        };
        this.getDom = function (name) {
            if (name == undefined || name == null || name == '') return jQuery('#' + this.createDomId(null));
            return jQuery('#' + this.createDomId(null) + ' #' + this.createDomId(name));
        };
        this.createDomId = function (name) {
            return this.getNamespace(name) + '_' + this.getId();
        };
        this.getNamespace = function (name) {
            return (name != undefined && name != null && name != '') ? Helper.NAMESPACE + '-' + name : Helper.NAMESPACE;
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
    };
    Helper.NAMESPACE = 'modal';
}(jQuery));