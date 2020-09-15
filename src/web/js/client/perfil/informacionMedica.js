
function loaded(event){
    events(event);
}

function events(event){
    get_padecimientos();
}
function c_td(data,name){
    return '<td data-'+name+'="'+data+'" data-type="'+typeof(data)+'">'+data+'</td>';
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
        padecimientos.forEach((p)=>{
            llenarLista(p);
        });
        
    }, (error) => {
    });

}
function llenarLista(p){

    $('#lista_padecimientos').append(
        '<tr>'+
        c_td(p.descripcion,'padecimiento') +
        c_td(p.observaciones,'observacion') +
        '</tr>'
        );
}

document.addEventListener("DOMContentLoaded", loaded);