$(function () {
    var $table = $("#tblResult");

    $("#btnSearch").click(function () {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:6585/service/metodo',
            data: {
            },
            success: function (data) {
                console.log(data);
                $.each(data, function (index, value) {
                    console.log(value);
                    $table.find(">tbody").append("<tr><td>" + value.saldo + " </td><tr>");
                });
            },
            error: function (request, status, error) {

            },
        });
        //alert(resultado);
    });
});