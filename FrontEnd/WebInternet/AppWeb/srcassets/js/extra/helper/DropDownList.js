var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.DropDownList = function () { };
com.jtm.helper.DropDownList.ID = "id";
com.jtm.helper.DropDownList.NAME = "name";
com.jtm.helper.DropDownList.DDLVALUEDEFAULT = "0";
com.jtm.helper.DropDownList.DDLDISPLAYDEFAULT = "--Seleccione--";
com.jtm.helper.DropDownList.getLastOption = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return { id: 0, name: '' };
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return { id: 0, name: '' };
    }
    return { id: ddl.val(), name: ddl.getLabel() };
};
com.jtm.helper.DropDownList.getLastValue = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return 0;
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return 0;
    }
    return ddl.val();
};
com.jtm.helper.DropDownList.getLastText = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return '';
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        ddl = jQuery(container + ' select').eq(-2);// jQuery(container + ' #ddl' + (id - 1));
        if (ddl.length === 0) return '';
    }
    return ddl.getLabel();
};
com.jtm.helper.DropDownList.getLastValues = function (container) {
    var ddl = jQuery(container + ' select:last');
    if (ddl.val() === undefined) return [0];
    var id = jQuery(ddl).attr("id").replace(/[^-\d\.]/g, '');//jQuery(ddl).attr("id").replace("ddl", "");
    if (ddl.val() == "0") {
        var items = [];
        jQuery.each(jQuery(ddl).find("option"), function (i, item) {
            if (jQuery(item).val() != com.jtm.helper.DropDownList.DDLVALUEDEFAULT)
                items.push(jQuery(item).val());
        });
        return items;
    }
    return [0];
};
com.jtm.helper.DropDownList.setRecursive = function (container, id, url, isOpen, label, inmediateparent, ddlName, fieldId, fieldName) {
    fieldId = (fieldId === undefined || fieldId === null || fieldId === '') ? "id" : fieldId;
    fieldName = (fieldName === undefined || fieldName === null || fieldName === '') ? "name" : fieldName;
    if (isOpen === true)
        jQuery(container).html('');
    if (id === 0)
        return;
    label = label === null ? ' ' : label;
    var ddl = "ddl" + ((ddlName === undefined || ddlName === null) ? '' : ddlName);
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: { id: (id === null) ? 0 : id },
        dataType: 'json',
        async: false,
        success: function (data) {
            try {
                //Chequear cantidad
                if (data.total > 0) {
                    var nivel = 0;
                    if (jQuery(container + ' select').length > 0) {
                        var ddlLast = jQuery(container + ' select:last');
                        nivel = jQuery(ddlLast).attr("id").replace(ddl, "");
                    }
                    var select = '<select id="' + ddl + (++nivel) + '">';
                    jQuery.each(data.items, function (j, item) {
                        select += '<option value="' + eval('item.' + fieldId) + '">' + eval('item.' + fieldName) + '</option>';
                    });
                    select += "</select>";
                    var div = '<p id="divNivel' + nivel + '"><label>' + label + '</label>' + select + '</p>';
                    removeItems(nivel);
                    if (jQuery(container + " #" + ddl + nivel).length)
                        jQuery(container + " #" + ddl + nivel).html(select);
                    else
                        jQuery(container).append(div);
                    ddlChange(nivel);
                }
            } catch (ex) {
            }
        }
    });
    function ddlChange(nivel) {
        jQuery(container + " #" + ddl + nivel).on("change", function () {
            removeItems(nivel);
            var idd = jQuery(this).val();
            com.jtm.helper.DropDownList.setRecursive(container, idd, url, false, '&nbsp;', (inmediateparent === null ? null : inmediateparent.Padre), ddlName, fieldId, fieldName);
            if (inmediateparent !== undefined && inmediateparent !== null && inmediateparent.Padre !== null && inmediateparent.Padre !== undefined)
                delete inmediateparent.Padre;
            if (jQuery(container + " #" + ddl + nivel).val() === 0) {
                var i = nivel;
                var ddlNivel = jQuery(container + ' #' + ddl + (--i));
                if (ddlNivel.length > 0) {
                }
                removeItems(nivel);
            }
            return;
        });
        if (inmediateparent !== undefined && inmediateparent !== null) {
            jQuery(container + " #" + ddl + nivel).val(eval('inmediateparent.' + fieldId));
            jQuery(container + " #" + ddl + nivel).trigger("change");
        }
    }
    function removeItems(i) {
        var flag = true;
        while (flag === true) {
            ++i;
            if (jQuery(container + " #divNivel" + i).length) {
                jQuery(container + " #divNivel" + i).remove();
                flag = true;
            } else
                flag = false;
        }
    }
};
com.jtm.helper.DropDownList.fill = function (options) {
    options = options || {};
    options.ddl = (typeof options.ddl === "string") ? jQuery(options.ddl) : options.ddl;
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;
    options.async = typeof options.async === 'boolean' ? options.async : false;
    options.ddl.empty();
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: options.url,
        data: options.data,
        async: options.async,
        success: function (data) {
            if (!data.success) return;
            var items = '';
            if (data.items === undefined || data.items.length === 0) return;
            jQuery.each(data.items, function (i, item) {
                items += '<option value="' + eval('item.' + options.fieldId) + '">' + eval('item.' + options.fieldName) + '</option>';
            });
            options.ddl.html(items);
            if (typeof options.callback === "function") {
                options.ddl.off("change");
                options.ddl.on("change", data, function () {
                    if (jQuery(this).int32() !== 0)
                        options.callback(jQuery(this).val());
                });
            }
            options.idSelected = (options.ddl.find("option[value='" + options.idSelected + "']").length > 0) ? options.idSelected : options.ddl.find("option:first").val();
            if (options.idSelected !== undefined && options.idSelected !== null) {
                options.ddl.val(options.idSelected);
                if (options.idSelected > 0)
                    options.ddl.trigger("change");
            }
        }
    });
};
com.jtm.helper.DropDownList.fillLocal = function (options) {
    options = options || {};
    options.ddl = (typeof options.ddl === "string") ? jQuery(options.ddl) : options.ddl;
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;

    if (!(options.items instanceof Array)) { options.ddl.prop("disabled", true); return; }
    var html = "";
    if (options.addDefaultOption === true)
        html += '<option value="' + com.jtm.helper.DropDownList.DDLVALUEDEFAULT + '">' + com.jtm.helper.DropDownList.DDLDISPLAYDEFAULT + '</option>';
    options.items.forEach(function (item) {
        if (typeof item === "object")
            html += '<option value="' + item[options.fieldId] + '">' + item[options.fieldName] + '</option>';
        else
            html += '<option value="' + item + '">' + item + '</option>';
    });
    options.ddl.html(html);
    options.ddl.prop("disabled", false);
    if (options.callback !== undefined && options.callback !== null) {
        options.ddl.off("change");
        options.ddl.on("change", null, options.callback);
    }
    options.idSelected = (options.ddl.find("option[value='" + options.idSelected + "']").length > 0) ? options.idSelected : options.ddl.find("option:first").val();
    if (options.idSelected !== undefined && options.idSelected !== null) {
        jQuery(options.ddl).val(options.idSelected);
        if (options.idSelected != 0)
            jQuery(options.ddl).trigger("change");
    }
};
com.jtm.helper.DropDownList.getItems = function (url) {
    jQuery.post(url, function (data, textStatus) {
        return (data.success === true) ? data.items : [];
    }, "json");
};
com.jtm.helper.DropDownList.fillNew = function (options) {
    options = options || {};
    options.fieldId = (options.fieldId === undefined || options.fieldId === null || options.fieldId === '') ? com.jtm.helper.DropDownList.ID : options.fieldId;
    options.fieldName = (options.fieldName === undefined || options.fieldName === null || options.fieldName === '') ? com.jtm.helper.DropDownList.NAME : options.fieldName;
    options.async = typeof options.async === 'boolean' ? options.async : false;
    var items = '';
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: options.url,
        data: options.data,
        async: options.async,
        success: function (data) {
            if (!data.success) return;
            if (data.items === undefined || data.items.length === 0) return;
            items = '<select style="width:100%" class=' + options.className + '>';
            jQuery.each(data.items, function (i, item) {
                items += '<option value="' + item[options.fieldId] + '">' + item[options.fieldName] + '</option>';
            });
            items += '</select>';
        }
    });
    return items;
};