var estudiantes = [];

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
    filtrarXNuevos();
    filtrarXConfirmados();
    filtrarXFuncionarios();
    filtrarXEstudiantes();
    filtrarTodos();
    buscar();
}
function filtrarXFuncionarios() {
    $('#filtrar_funcionarios').on('click',function(){
        mostrarUsuarios(filtrarFuncionarios(estudiantes));
    });
}
function filtrarXEstudiantes() {
    $('#filtrar_estudiantes').on('click',function(){
        mostrarUsuarios(filtrarEstudiantes(estudiantes));
    });
}
function filtrarXConfirmados() {
    $('#filtrar_confirmados').on('click',function(){
        mostrarUsuarios(filtrarConfirmados(estudiantes));
    });
}
function filtrarXNuevos() {
    $('#filtrar_nuevos').on('click',function(){
        mostrarUsuarios(filtrarNuevos(estudiantes));
    });
}
function filtrarTodos(){
    $('#actualizar_lista').on('click',function(){
        mostrarUsuarios(estudiantes);
    });
}
function buscar() {
    $('#button_search').on('click',function () {
        let texto = $('#barraBuscar').val();
        if(texto == '') mostrarUsuarios(estudiantes);
        else mostrarUsuarios(filtrarBuscar(estudiantes,texto));
    });
    $('#barraBuscar').on('keydown',function (event) {
        if(event.which == 13){
            let texto = $('#barraBuscar').val();
            if(texto == '') mostrarUsuarios(estudiantes);
            else mostrarUsuarios(filtrarBuscar(estudiantes,texto));
        }
    });

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
        estudiantes = usuarios;
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
    let estado = u.estado == 1 ? 'Confirmado' : u.estado == 2 ? 'Rechazado' : 'No Confirmado';
    let colorEstado = u.estado == 1 ? 'success' : u.estado == 2 ? 'danger' : 'warning';
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
        let email = 'ianmorar03@gmail.com';
        let nombre = $('#nombreTarget').text();
        let data = {cedula, email, nombre}
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
    $('#CambiarEstadoRechazarBoton').on('click', function () {
        let cedula = $('#cedulaTarget').text();
        let data = {cedula}
        $.ajax({
            type: "POST",
            url: "/estudiante/rechazarEstudiante",
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
var filtrarNuevos = (estudiantes)=>{
    let result = [];
    for(let i=0;i<estudiantes.length; i++){
        if(!(estudiantes[i].estado)){
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarConfirmados = (estudiantes)=>{
    let result = [];
    for(let i=0;i<estudiantes.length; i++){
        if((estudiantes[i].estado)){
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarEstudiantes = (estudiantes)=>{
    let result = [];
    for(let i=0;i<estudiantes.length; i++){
        if((estudiantes[i].tipo_usuario == '1')){
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarFuncionarios = (estudiantes)=>{
    let result = [];
    for(let i=0;i<estudiantes.length; i++){
        if((estudiantes[i].tipo_usuario != '1')){
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarBuscar = (estudiantes, s)=>{
    let result = [];
    for(let i=0;i<estudiantes.length; i++) 
        if(estudiantes[i].nombre == s.toUpperCase() || estudiantes[i].nombre == s || estudiantes[i].cedula == s) 
            result.push(estudiantes[i]);
    return result;
}

document.addEventListener("DOMContentLoaded", loaded);