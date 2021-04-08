function loaded(event){
    events(event);
}

function events(event){
    obtenerReposiciones();
    cargarFoto();
    toogleMenu();
    openModalComprobante();
    cambiarEstadoShow();
    traerCursos();
    informacionGrupos();
}
const animateCSS = (element, animation) =>
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});
function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}
function cargarFoto() {
    let foto = $('#usuario_foto').data('value');
    if(!foto){
        $('.avatar-bg').css({
            'background':'url(../../img/default-user-image.png)',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }else{
        $('.avatar-bg').css({
            'background':'url(./../public/uploads/'+foto+')',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }
}
function obtenerReposiciones(){
    let ajaxTime= new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/getReposiciones",
        contentType: "application/json"
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime/1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        listReposiciones(response);
        $('#cargarDatosSpinner').hide();
        load_stats(response);
    }, (error) => {
    });
}
function listReposiciones(reposiciones) {
    $('#lista_reposiciones').html('');
    reposiciones.forEach((r)=>{
        showReposicion(r);
    });
}
function showReposicion(r) {

    let cedula = r.cedula;
    let nombre = r.nombre + ' ' + r.apellido;
    let g_orig = r.grupo_origen;
    let g_repo = r.grupo_reposicion;
    let nivel  = r.nivel;
    let fecha  = r.fecha_reposicion;
    let compro = r.comprobante;
    let observ = r.observacion;
    let estado = r.estado == 1 ? 'Confirmado' : r.estado == 2 ? 'Rechazado' : 'Pendiente';
    let color  = r.estado == 1 ? 'success' : r.estado == 2 ? 'danger' : 'warning';

    $('#lista_reposiciones').append(
        '<tr>'+
        '<td>'+cedula+'</td>'+
        '<td>'+nombre+'</td>'+
        '<td><button class="btn btn-sm btn-light w-50 mx-auto d-block" data-toggle="modal" data-target="#modalGrupoOrigen"><span class="badge badge-light">'+g_orig+'</span></button></td>'+
        '<td><button class="btn btn-sm btn-light w-50 mx-auto d-block" data-toggle="modal" data-target="#modalGrupoOrigen"><span class="badge badge-light">'+g_repo+'</span></button></td>'+
        '<td>'+nivel+'</td>'+
        '<td>'+fecha+'</td>'+
        '<td><button class="btn p-0" data-cedula="'+cedula+'" data-obser="'+observ+'" data-foto="'+compro+'" data-toggle="modal" data-target="#modalComprobante"><i class="fas fa-file-image fa-2x text-info"></i></button></td>'+
        '<td> <button class="btn btn-'+color+' py-0 w-100" data-toggle="modal" data-target="#modalCambiarEstado" '+
        'data-cedula="'+cedula+'" data-nombre="'+nombre+'"><i class="fas fa-sign-in-alt"></i> '+estado+'</button></td>'+
        '</tr>'
    );

}
var g_grupos = [];

function traerCursos(){
    $.ajax({
        type: "GET",
        url: "/admin/getGrupos",
        contentType: "application/json"
    }).then((cursosDis) => {
        g_grupos = cursosDis;        
    }, (error) => {
    });
}
function cargarCurso(cupos) {
    $('#cursos_lista').html('');
    filtrarCursosMatriculados(cupos).then((newCupos)=>{
        newCupos.forEach(cupo => {
            llenarCurso(cupo);
        });
    }); 
}
function load_stats(reposiciones) {
    let cantidad = reposiciones.length;
    let verificados=0;
    let nuevos =0 ;
    for (let i of reposiciones) {
        if(i.estado) verificados++;
        if(i.estado == 2) nuevos++;
    }
    $('#reposiciones_todas_stats').text(cantidad);
    $('#reposiciones_aceptadas_stats').text(verificados);
    $('#reposiciones_nuevos_stats').text(nuevos);
}
function openModalComprobante() {
    $('#modalComprobante').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        var foto = button.data('foto');
        var cedula = button.data('cedula');
        var observacion = button.data('obser');
        $('#bodyComprobante').html('');

        $('#titleModalComprobante').text('Comprobante de '+cedula);
        if(foto.length != 0){
            let tipo = foto.split('.')[1];
            if(tipo == 'pdf'){
                $('#bodyComprobante').append(
                    '<h4>Comprobante:</h4>'+
                    '<embed src="./../public/uploads/'+foto+'" type="application/pdf" class="d-block mx-auto w-75" />'+
                    '<div class="form-group">'+
                    '<label for="Observacion">Observacion</label>'+
                    '<textarea class="form-control" style="resize: none;" rows="4" disabled>'+observacion+'</textarea>'+
                    '</div>'
                );
            }else{
                $('#bodyComprobante').append(
                    '<h4>Comprobante:</h4>'+
                    '<img src="./../public/uploads/'+foto+'" class="d-block w-50 mx-auto">'+
                    '<div class="form-group">'+
                    '<label for="Observacion">Observacion</label>'+
                    '<textarea class="form-control" style="resize: none;" rows="4" disabled>'+observacion+'</textarea>'+
                    '</div>'
                );
            }
            
        }else{
            $('#bodyComprobante').append(
                '<div class="text-center w-100 d-block">No se subio comprobante</div>'
            );
        }
        
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
function informacionGrupos() { //modal para ver informacion de un grupo
    $('#modalCambiarEstado').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var cedula = button.data('cedula');
        var nombre = button.data('nombre');
        $('#nombreTarget').text(nombre);
        $('#cedulaTarget').text(cedula);
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