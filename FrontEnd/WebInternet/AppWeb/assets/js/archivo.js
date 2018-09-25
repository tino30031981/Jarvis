$(function () {
    var $table = $("#tblResult");

    $("#btnSearch").click(function () {
        //console.log($("#txtDNIHolderSearch"));
        //console.log($("#txtDNIHolderSearch").val());
        $.ajax({
            type: 'POST',
            url: 'http://localhost:6585/service/consultartributo',
            data: {
                buscar: $("#txtDNIHolderSearch").val()
            },
            success: function (data) {
                console.log(data);
                $.each(data, function (index, value) {
                    //console.log(value.estado);
                    var html = "<tr id=" + value.idTributo + "><td>" + value.idTributo + "</td><td>" + value.tipo + "</td><td>" + value.monto + "</td><td>" + value.estado + "</td>";
                    if (value.estado == "Pendiente")
                        html += "<td><button class='btn btnEditPay' id=" + value.idTributo + ">Pagar</button></td>";
                    else
                        html += "<td></td>";
                    $table.find(">tbody").append(html);
                });
            },
            error: function (request, status, error) {

            },
        });
        //alert(resultado);
    });

    $table.find('>tbody').off('click', "> tr > td > .btnEditPay");
    $table.find('>tbody').on('click', "> tr > td > .btnEditPay", function (e) {
        var id = $(this).attr("id");
        console.log(id);
        window.location.href = "http://localhost:6585/service/form?id=" + id;
    });

});