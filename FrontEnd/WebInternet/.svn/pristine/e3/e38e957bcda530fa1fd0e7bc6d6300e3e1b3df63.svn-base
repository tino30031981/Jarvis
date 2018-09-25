(function ($) {
    $.fn.getLabel = function () {
        var text;
        this.each(function () {
            if (this.tagName == 'SELECT') {
                var selectElement = this;
                if (selectElement.options.selectedIndex < 0) {
                    text = "";
                }
                else {
                    text = selectElement.options[selectElement.options.selectedIndex].text;
                }
            }
        });
        return text;
    };
    $.fn.toggleCheckbox = function () {
        this.attr('checked', !this.attr('checked'));
    };
    $.fn.getCheckboxValues = function () {
        var values = [];
        var i = 0;
        this.each(function () {
            values[i++] = $(this).val();
        });
        return values;
    };
    $.fn.copyNamedTo = function (other) {
        return this.each(function () {
            $(':input[name]', this).each(function () {
                $('[name=' + $(this).attr('name') + ']', other).val($(this).val());
            });
        });
    };
})(jQuery);
jQuery.fn.extend({
    string: function () {
        var value = jQuery(this).val();
        return (value === undefined) || value === null ? null : value.trim();
    },
    int32: function () {
        var value = jQuery(this).val();
        if (value === undefined || value === null || value <= 0 || value === '' || value == ' ') return 0;
        else return Number(value);
    },
    decimal: function () {
        var value = jQuery(this).val();
        if (value === undefined || value === null || value <= 0 || value === '' || value == ' ') return 0;
        else return Number(value);
    },
    double: function () {
        var value = jQuery(this).val();
        if (value === undefined || value === null || value <= 0 || value === '' || value == ' ') return 0;
        else return Number(value);
    },
    number: function () {
        var value = jQuery(this).val();
        if (value === undefined || value === null || value === '' || value == ' ') return 0;
        else return Number(value);
    },
    date: function () {
        var value = jQuery(this).val();
        return (value === undefined || value === null || value === '') ? null : value.trim();
    },
    date2: function () {
        var value = jQuery(this).val().split('-').reverse().join('-');
        return (value === undefined || value === null || value === '') ? null : value.trim();
    },
    boolean: function () {
        var value = jQuery(this).is(":checked");
        return (value === undefined || value === null) ? false : Boolean(value);
    }
});
(function ($) {
    var origAppend = $.fn.append;

    $.fn.append = function () {
        return origAppend.apply(this, arguments).trigger("append");
    };
    var origAppendTo = $.fn.appendTo;
    $.fn.appendTo = function () {
        return origAppendTo.apply(this, arguments).trigger("appendTo");
    };
})(jQuery);
(function ($) {
    $.fn.mousePosition = function (mouse, direction) {
        var win = $(window)[direction]();
        var page = $(document)[direction]();
        var menu = $(this)[direction]();

        if (direction == 'height') {
            //console.log("direction:", direction);
            //console.log("mouse", mouse);
            //console.log("menu", Math.round(menu));
            //console.log("page", page);
            //console.log("window", win);
        }

        // opening menu would pass the side of the page
        if (mouse + menu > page && menu < mouse) {
            return mouse - menu;
        }
        return mouse;
    };
})(jQuery);
jQuery.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};