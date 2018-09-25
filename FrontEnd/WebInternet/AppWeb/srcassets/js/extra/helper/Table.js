var com = com || {};
com.jtm = com.jtm || {};
com.jtm.helper = com.jtm.helper || {};
com.jtm.helper.Table = function () {
};
com.jtm.helper.Table.existHiddenField = function (obj, nombre, id) {
    //            var $d = jQuery(obj).parent();
    //            var col = $d.parent().children().index($d);
    //            var row = $d.parent().parent().children().index($d.parent());
    return jQuery(obj).closest('table').find('#hdn' + nombre + id).length;
};
com.jtm.helper.Table.getHiddenField = function (nombre, id) {
    return '<input type="hidden" id="hdn' + nombre + id + '" nombre="hdn' + nombre + id + '"  value="' + id + '" />';
};
///<summary>
///Método estático que permite validar los valores nulos de una columna
///</summary>
///<remarks>
///This is a test.
///</remarks>
///<parame>
///This is a test.
///</paraam>
///<returns>
///This is a test.
///</returns>
//
com.jtm.helper.Table.validateNullValues = function (celdas, index, mensaje, faltaSeleccionar) {
    for (var i = index; i < celdas.length; i++) {
        var hdn = jQuery(celdas[i]).find('input[type=hidden]');
        if (hdn.length <= 0) {
            alert(faltaSeleccionar, "Dato");
            return false;
        }
    }
    return true;
};
//Método de instancia que permite agregar un nuevo elemento
com.jtm.helper.Table.prototype.addElement = function (obj, url, data, ddl, nombreCampoOculto, divPopup, esUnico, nombreCampoMensaje) {
    var thisObj = this;
    jQuery.ajax({
        url: url,
        async: false,
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.success === false) {
                alert(data.message, "Dato");
                return;
            }
            var items = data.items;
            var html = '';
            for (var j = 0; j < items.length; j++) {
                html += '<option value=' + items[j].id + '>' + items[j].name + '</option>';
            }
            jQuery(ddl).html(html);
            var itemId = jQuery(obj).parent().find("input[type=hidden]").val();
            if (itemId !== undefined && itemId !== null) {
                jQuery(ddl).val(itemId);
            }
            jQuery(ddl).unbind();
            jQuery(ddl).change(function () {
                if (jQuery(this).val() > 0) {
                    jQuery(obj).parent().find("input[type=hidden]").remove();
                    if (esUnico === true) {
                        var existe = com.jtm.helper.Table.existHiddenField(obj, nombreCampoOculto, jQuery(this).val());
                        if (existe > 0) {
                            alert("Ya existe " + nombreCampoMensaje + ", por favor seleccione otro", "Dato");
                            return;
                        }
                    }
                    jQuery(obj).parent().append(com.jtm.helper.Table.getHiddenField(nombreCampoOculto, jQuery(this).val()));
                    jQuery(obj).parent().find("span").html(jQuery("option:selected", jQuery(this)).text());
                    jQuery(obj).parent().removeClass("errorDato");
                    jQuery(divPopup).dialog('close');
                }
                else {
                    alert("Seleccione " + nombreCampoMensaje, "Dato");
                }
            });
        }
    });
    jQuery(divPopup).dialog({
        title: 'Seleccionar ' + nombreCampoMensaje,
        modal: true,
        resizable: false,
        height: 60,
        close: function (ev, ui) { jQuery(this).dialog('destroy'); }
    });
};
com.jtm.helper.Table.removeColumn = function (obj) {
    var columnIndex = jQuery(obj).closest("th").prevAll("th").length;
    jQuery(obj).closest("table").find("tr").find("td:eq(" + columnIndex + "), th:eq(" + columnIndex + ")").remove();
};
//Método estático que permite exportar una tabla a excel
com.jtm.helper.Table.toSpreadSheet = function (table, name, filename) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    //var uri = 'data:application/octet-stream;base64,';
    //text/csv;charset=utf-8;
    if (typeof table === "string")
        table = jQuery(table);
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    var ctx = { worksheet: name || 'Worksheet', table: table.html() };
    var auuid = com.jtm.helper.Random.getUUID();
    var a = jQuery(table.parent()).find("#" + auuid);
    if (a.length === 0)
        jQuery(table.parent()).append('<a id="' + auuid + '" style="display:none;"></a>');
    a = table.parent().find("#" + auuid);
    a.prop("href", uri + base64(format(template, ctx)));
    a.prop("download", filename + ".xls");
    if (navigator.msSaveBlob) // IE 10+
        navigator.msSaveBlob(new Blob(["<table>" + table.html() + "</table>"], { type: 'data:application/vnd.ms-excel;base64,' }), filename + ".xls");
    else
        document.getElementById(auuid).click();
    a.remove();
    //function base64(s) { return window.btoa(unescape(escape(s))); }
    function base64(s) { return window.btoa(unescape(decodeURIComponent(s))); }
    function format(s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); }
};
com.jtm.helper.Table.download = function (obj, url, content) {
    if (url === undefined || url === null) {
        alert("la url de generación no es válido"); return;
    }
    if (jQuery(content).lenght === 0) { alert("No hay datos a exportar"); return; }
    var frm = '<form id = "frmExcel" name = "frmExcel" method = "POST" target = "_blank" action = "' + url + '"></form>';
    var hdn = '<input type = "hidden" id = "hdnExportarExcel" name = "hdnExportarExcel" />';
    jQuery(obj).append(frm);
    jQuery(hdn).appendTo(jQuery('#frmExcel'));
    var clonado = jQuery(content).closest('div').clone();
    if (clonado === null) return;
    jQuery('#hdnExportarExcel').val($('<div />').text(clonado.html()).html());
    jQuery('#frmExcel').submit();
    jQuery('#frmExcel').remove();
};
com.jtm.helper.Table.copyItems = function (tbdOrigen, tbdDestino, divDestino) {
    jQuery(tbdDestino).html('');
    jQuery(tbdOrigen).find('input[type=checkbox]').each(function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).closest("tr").clone().appendTo(tbdDestino);
        }
    });
    seleccionarFila(tbdDestino);
    jQuery(divDestino + ' span').html(jQuery(tbdDestino + " tr").length);
    jQuery(tbdDestino + " tr").find(':checkbox').each(function () {
        jQuery(this).attr('checked', false);
    });
};
com.jtm.helper.Table.copyOrReplaceItems = function (tbdOrigen, tbdDestino, divDestino) {
    //jQuery(tbdDestino).html('');
    jQuery(tbdOrigen).find('input[type=checkbox]').each(function () {
        if (jQuery(this).is(':checked')) {
            var id = jQuery(this).val();
            var tr = jQuery(this).closest("tr").clone();
            if (jQuery(tbdDestino + "  #chk" + id).length > 0)
                jQuery(tbdDestino + "  #chk" + id).closest('tr').replaceWith(tr);
            else
                jQuery(tr).appendTo(tbdDestino);
        }
    });
    seleccionarFila(tbdDestino);
    jQuery(divDestino + ' span').html(jQuery(tbdDestino + " tr").length);
    jQuery(tbdDestino + " tr").find(':checkbox').each(function () {
        jQuery(this).attr('checked', false);
    });
};
com.jtm.helper.Table.selectExistingItems = function (tbdSource, tbdTarget, chk) {
    if (jQuery(tbdTarget + " input:checkbox").length > 0) {
        jQuery(tbdTarget + " input:checkbox").each(function () {
            if (jQuery(tbdSource).find(chk + jQuery(this).val()).length > 0)
                jQuery(tbdTarget + ' ' + chk + jQuery(this).val()).attr('checked', true);
        });
    }
};
com.jtm.helper.Table.removeItems = function (tbd, div) {
    tbd = (typeof table === "string") ? jQuery(tbd) : tbd;
    jQuery(tbd).find('input[type=checkbox]').each(function (index) {
        if (jQuery(this).is(':checked'))
            jQuery(this).closest('tr').remove();
    });
    jQuery(div + ' span').html(jQuery(tbd + " tr").length);
};
com.jtm.helper.Table.highlightRow = function (table, callback) {
    //jQuery(function () {
    //    jQuery(table + ' > tbody > tr').of("hover");
    //    jQuery(table + ' > tbody > tr').on("hover", function () {
    //        jQuery(this).addClass("selected");
    //    },
    //    function () {
    //        jQuery(this).removeClass("selected");
    //    });
    //});
    table = (typeof table === "string") ? jQuery(table) : table;
    table.find('> tbody > tr').on("click", function (e) {
        jQuery(this).siblings().removeClass("gh-selected").removeClass("selected");
        jQuery(this).toggleClass("gh-selected").toggleClass("selected");
        if (typeof callback === "function")
            callback();
    });
    table.find(">thead>tr>th:first input:checkbox").on("click", function () {
        var checked = this.checked;
        table.find(">tbody>tr>td:first-child input:checkbox").each(function () {
            this.checked = checked;
        });
    });
};
com.jtm.helper.Table.getItems = function (container, isSelected, isList) {
    var data = [];
    var json;
    var selector = (isSelected === true) ? "input:checkbox:checked" : "input:checkbox";
    container = (typeof container === "string") ? jQuery(container) : container;
    if (container.lenght === 0) return data;
    container = (container[0].tagName === "TABLE") ? container.find('>tbody') : container;
    container.find(selector).each(function () {
        if (isList === true)
            data.push({ id: jQuery(this).val() });
        else
            data.push(parseInt(jQuery(this).val()));
    });
    return data;
};