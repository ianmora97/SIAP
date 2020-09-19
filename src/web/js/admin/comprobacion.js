function loaded(event){
    events(event);
}

function events(event){
    traer_estudiantes();
    toogleMenu();
    load_stats();
    get_today_date();
    cambiarEstadoShow();
    cambiarEstadoSend();
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
}
function load_stats() {
    $.ajax({
        type: "GET",
        url: "/admin/stats/cantidadRegistros",
        contentType: "application/json"
    }).then((response) => {
        $('#usuarios_registrados_stats').text(response.cantidad);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/stats/usuariosVerificados",
        contentType: "application/json"
    }).then((response) => {
        $('#usuarios_verificados_stats').text(response.cant);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/stats/usuariosNuevos",
        contentType: "application/json"
    }).then((response) => {
        $('#usuarios_nuevos_stats').text(response.cant);
    }, (error) => {

    });

}
function traer_estudiantes() {
    $.ajax({
        type: "GET",
        url: "/admin/usuariostemp",
        contentType: "application/json"
    }).then((usuarios) => {
        mostrarUsuarios(usuarios);
    }, (error) => {
    });
}
function mostrarUsuarios(usuarios) {
    $('#lista_usuarios_temporales').html(' ');
    usuarios.forEach(u =>{
        llenarListaUsuarios(u);
    });
}
function llenarListaUsuarios(u) {
    let id = u.id;
    let cedula = u.cedula;
    let nombre = u.nombre;
    let apellido = u.apellido;
    let nacimiento = u.nacimiento;
    let username = u.usuario;
    let sexo = u.sexo;
    let tipo = u.tipo_usuario == '1' ? 'Estudiante' : 'Funcionario0';
    let creado = u.creado;
    let estado = u.estado ? 'Confirmado' : 'No confirmado';
    let colorEstado = u.estado ? 'success' : 'warning';
    $('#lista_usuarios_temporales').append(
        '<tr>'+
        '<td>'+id+'</td>'+
        '<td>'+cedula+'</td>'+
        '<td>'+nombre+'</td>'+
        '<td>'+apellido+'</td>'+
        '<td>'+nacimiento+'</td>'+
        '<td>'+username+'</td>'+
        '<td>'+sexo+'</td>'+
        '<td>'+tipo+'</td>'+
        '<td>'+creado+'</td>'+
        '<td><span type="button" class="badge badge-pill badge-'+colorEstado+'" data-toggle="modal" data-target="#modalCambiarEstado" data-cedula="'+cedula+'" data-nombre="'+nombre+' '+apellido+'">'+estado+'</span></td>'+
        '</tr>'
    );
}
function cambiarEstadoShow() {
    $('#modalCambiarEstado').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var cedula = button.data('cedula');
        var nombre = button.data('nombre');
        $('#nombreTarget').text(nombre);
        $('#cedulaTarget').text(cedula);
    });
}
function cambiarEstadoSend() {
    $('#CambiarEstadoConfirmarBoton').on('click', function () {
        let cedula = $('#cedulaTarget').text();
        let data = {cedula}
        $.ajax({
            type: "POST",
            url: "/estudiante/insertarUsuarioPermanente",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((response) => {
            console.log(response);
            $('#modalCambiarEstado').modal('hide');
            traer_estudiantes();
        }, (error) => {
            $('#alerta_error_estado').css('display','block');
        });        
    });
}
function toogleMenu() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}

function ejemploAJAX(){
    // $('#accion').on('click',function(){ 
    //     $.ajax({
    //         type: "POST",
    //         url: "/ejemplo",
    //         contentType: "application/json"
    //     }).then((response) => {
            
    //     }, (error) => {
    //     });
    // });
}

document.addEventListener("DOMContentLoaded", loaded);