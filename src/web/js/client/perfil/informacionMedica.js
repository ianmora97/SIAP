
function loaded(event){
    events(event);
}

function events(event){
    get_padecimientos();
    openmodal_edit();
    edit();
}
function c_td(data,name){
    return '<td class="text-center" data-'+name+'="'+data+'" data-type="'+typeof(data)+'">'+data+'</td>';
}
function get_padecimientos(){
    let cedula = $('#cedula').text();
    let data ={cedula}
    $.ajax({
        type: "GET",
        url: "/client/cargarPadecimientos",
        data: data,
        contentType: "application/json"
    }).then((padecimientos) => {
        $('#lista_padecimientos').html(' ');
        padecimientos.forEach((p)=>{
            llenarLista(p);
        });
    }, (error) => {
    });

}
function openmodal_edit() {
    $('#modalEditPadecimiento').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var oberservacion = button.data('oberservacion');
        var padecimiento = button.data('padecimiento');
        var id_padecimiento = button.data('id');

        $('#modalEditPadecimientoLabel').text(padecimiento.toUpperCase());
        $('#idPadecimiento_only').text(id_padecimiento);
        $('#observacionesInput').val(oberservacion);
    });
}
function edit() {
    $('#cerrarguardarpadecimiento').on('click',function () {
        let id = $('#idPadecimiento_only').text();
        let observacion = $('#observacionesInput').val();
        let data = {id,observacion};
        $.ajax({
            type: "PUT",
            url: "/client/padecimiento/actualizarObservacion",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((padecimientos) => {
            get_padecimientos();
        }, (error) => {
        });

    });
}
function llenarLista(p){
    $('#lista_padecimientos').append(
        '<tr>'+
        '<td class="list-action">' +
        '<div class="custom-control custom-checkbox">' +
        '<input type="checkbox" id="checkbox-' + p.id_padecimiento + '" class="custom-control-input" value="' + p.id_padecimiento + '" name="checked[]"/>' +
        '<label class="custom-control-label" for="checkbox-' + p.id_padecimiento + '">&nbsp;</label></div></td>' +
        '<td class="list-action ">'+
        '<a class="btn btn-outline-primary text-primary" data-oberservacion="'+p.observaciones+'" data-padecimiento="'+p.descripcion+'" data-id="'+p.id_padecimiento+'" data-toggle="modal" data-target="#modalEditPadecimiento">'+
        '<i class="fas fa-pen"></i>'+
        '</a>'+
        '</td>'+
        c_td(p.apellido,'apellido') +
        c_td(p.nombre,'nombre') +
        c_td(p.descripcion,'padecimiento') +
        c_td(p.observaciones,'observacion') +
        '</tr>'
        );
}

document.addEventListener("DOMContentLoaded", loaded);