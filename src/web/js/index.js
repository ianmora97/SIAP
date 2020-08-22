function loaded(event){
    events(event);
}

function events(event){
    traerUsuarios();
}
function traerUsuarios(){
    $('#accion').on('click',function(){ 
        $.ajax({
            type: "POST",
            url: "/usuarios",
            contentType: "application/json"
        }).then((response) => {
            if(response != undefined){
                listarUsuarios(response);
            }
        }, (error) => {
        });
    });
}
function listarUsuarios(usuarios){
    $("#listaUsuarios").html("");
    usuarios.forEach((usuario) => {
        llenarListaUsuario(usuario);
    });
}
function llenarListaUsuario(usuario){
    $('#listaUsuarios').append(
        '<tr>'+
        '<td>'+usuario.id+'</td>'+
        '<td>'+usuario.cedula+'</td>'+
        '<td>'+usuario.nombre+'</td>'+
        '<td>'+usuario.apellido+'</td>'+
        '<td>'+usuario.nacimiento+'</td>'+
        '<td>'+usuario.usuario+'</td>'+
        '<td>'+usuario.clave+'</td>'+
        '<td>'+usuario.sexo+'</td>'+
        '<td>'+usuario.created_at+'</td>'+
        '<td>'+usuario.updated_at+'</td>'+
        '<tr>'
    );
}
document.addEventListener("DOMContentLoaded", loaded);