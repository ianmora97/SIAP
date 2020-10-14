var estudiantes = [];

function loaded(event){
    events(event);
}

function events(event){
    traer_estudiantes();
    toogleMenu();
    get_today_date();
    cambiarEstadoShow();
    cambiarEstadoSend();
    filtrarXNuevos();
    filtrarXConfirmados();
    filtrarXFuncionarios();
    filtrarXEstudiantes();
    filtrarTodos();
    buscar();
    actualizar();
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
    $('#barraBuscar').on('keyup',(cantidad)=>{
        if($('#barraBuscar').val() != ''){
            mostrarUsuarios(buscarInlcudes(estudiantes,$('#barraBuscar').val().toUpperCase()));
        }else{
            mostrarUsuarios(estudiantes);
        }
    });
    
}
function buscarInlcudes(estudiantes, buscar) {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].nombre.includes(buscar) || estudiantes[i].apellido.includes(buscar) || estudiantes[i].cedula.includes(buscar) ) {
            result.push(estudiantes[i]);
        }
    }
    return result;
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
}

function load_stats(usuarios) {
    let cantidad = usuarios.length;
    let verificados=0;
    let nuevos =0 ;
    for (let i of usuarios) {
        if(i.estado) verificados++;
        if(!i.estado) nuevos++;
    }
    $('#usuarios_registrados_stats').text(cantidad);
    $('#usuarios_verificados_stats').text(verificados);
    $('#usuarios_nuevos_stats').text(nuevos);
}
function traer_estudiantes() {
    let ajaxTime= new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/usuariostemp",
        contentType: "application/json"
    }).then((usuarios) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime/1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        $('#cargarDatosSpinner').hide();
        estudiantes = usuarios;
        mostrarUsuarios(usuarios);
        load_stats(usuarios);
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
    let sexo = u.sexo;
    let tipo = u.tipo_usuario == '1' ? 'Estudiante' : 'Funcionario';
    let creado = u.creado.substring(0,u.creado.indexOf(' '));
    let estado = u.estado == 1 ? 'Confirmado' : u.estado == 2 ? 'Rechazado' : 'No Confirmado';
    let colorEstado = u.estado == 1 ? 'success' : u.estado == 2 ? 'danger' : 'warning';
    $('#lista_usuarios_temporales').append(
        '<tr>'+
        '<td>'+cedula+'</td>'+
        '<td>'+nombre+' '+apellido+'</td>'+
        '<td>'+nacimiento+'</td>'+
        '<td>'+sexo+'</td>'+
        '<td>'+tipo+'</td>'+
        '<td>'+creado+'</td>'+
        '<td> <button class="btn btn-'+colorEstado+' py-0 w-100" data-toggle="modal" data-target="#modalCambiarEstado" '+
        'data-cedula="'+cedula+'" data-nombre="'+nombre+' '+apellido+'"><i class="fas fa-sign-in-alt"></i> '+estado+'</button></td>'+
        '</tr>'
    );
}
function actualizar(){
    socket.on('notificacion:nuevo_registro',function (data) {
        traer_estudiantes();
    });
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
        //$('#sidebar-wrapper').css('position','relative');
        $("#wrapper").toggleClass("toggled");
        //$("#side-panel").css('margin-left','-12px');
        //$("#sidebar-wrapper").toggle("'slide', {direction: 'right' }, 1000");
        //$("#sidebar-wrapper").css({'transform': 'translate(-13rem, 0px)'});
        //$("#sidebar-wrapper").animate({left:'-200'},1000);
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