var g_estudiantes = [];
var g_grupos = [];
var g_informacionEstudiantes = [];

function loaded(event){
    events(event);
}

function events(event){
    traerEstudantesXGrupo();
    traerCursosEstudiante();
    traerInformacionDeEstudiante();
    movePageBack();
}
function openAnotacion(){
    $('#modalAnotaciones').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('whatever') // Extract info from data-* attributes
         
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
    })
}

function movePageBack() {
    $('#pag_ant').on('click',function(){
        let page = $('#pag_ant').attr('data-page');
        if(page == 1){
            $('#breadcrum-item-listaestudiantes').hide();
            $('#pag_ant').attr('data-page','0');
            $('#pag_ant').hide();
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInRight');
            $('#EstudiantesPorClaseLista').addClass('animate__bounceOutRight');
            setTimeout(()=>{
                $('#EstudiantesPorClaseLista').hide();
            },500);
            setTimeout(()=>{
                $('#clasesLista').show();
                $('#clasesLista').removeClass('animate__bounceOutLeft');
                $('#clasesLista').addClass('animate__bounceInLeft');
            },500);
        }
        if(page == 2){
            $('#breadcrum-item-estudiantesInfo').hide();
            $('#pag_ant').attr('data-page','1');
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInLeft');
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInRight');
            $('#estudianteInformacionLista').removeClass('animate__bounceInRight');
            $('#estudianteInformacionLista').addClass('animate__bounceOutRight');
            setTimeout(()=>{
                $('#estudianteInformacionLista').hide();
            },500);
            setTimeout(()=>{
                $('#EstudiantesPorClaseLista').show();
                $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutLeft');
                $('#EstudiantesPorClaseLista').addClass('animate__bounceInLeft');
            },500);
        }
    });
}

function abrirCurso(grupo){
    let curso = $('#idGrupo-'+grupo);
    $('html').scrollTop(0);
    forEachEstudiantesxGrupo(grupo);
    $('#clasesLista').removeClass('animate__bounceInLeft');
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutRight');
    
    $('#clasesLista').addClass('animate__animated animate__bounceOutLeft');
    setTimeout(()=>{
        $('#clasesLista').hide();
        $('#pag_ant').attr('data-page','1');
        $('#breadcrum-item-listaestudiantes').show();
        $('#pag_ant').show();
    },500);
    setTimeout(()=>{
        $('#EstudiantesPorClaseLista').show();
        $('#EstudiantesPorClaseLista').addClass('animate__animated animate__bounceInRight');
    },500);
}

function abrirEstudiante(id){
    $('html').scrollTop(0);
    showInformacionDeEstudiante(id);
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceInLeft');
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutLeft');
    $('#estudianteInformacionLista').removeClass('animate__bounceOutRight');
    
    $('#EstudiantesPorClaseLista').addClass('animate__animated animate__bounceOutLeft');
    setTimeout(()=>{
        $('#EstudiantesPorClaseLista').hide();
        $('#pag_ant').attr('data-page','2');
        $('#breadcrum-item-estudiantesInfo').show();
        $('#pag_ant').show();
    },500);
    setTimeout(()=>{
        $('#estudianteInformacionLista').show();
        $('#estudianteInformacionLista').addClass('animate__animated animate__bounceInRight');
    },500);
}

function traerEstudantesXGrupo(){
    $.ajax({
        type: "GET",
        url: "/profesor/matriculaEstudiantes",
        contentType: "application/json"
    }).then((response) => {
        g_estudiantes = response;
    }, (error) => {
    });
}

function filtrarEstudiantesxGrupo(grupo) {
    let result=[];
    for(let i=0;i<g_estudiantes.length; i++){
        if(g_estudiantes[i].id_grupo == grupo){
            result.push(g_estudiantes[i]);
        }
    }
    return result;
}
function forEachEstudiantesxGrupo(grupo){
    let result = filtrarEstudiantesxGrupo(grupo);
    $('#EstudiantesPorClaseLista').html('');
    result.forEach((c)=>{
        mostrarCursosActuales(c);
    });
}

function mostrarCursosActuales(c) {
    let id_usuario = c.id_usuario;
    let cedula = c.cedula;
    let nombre = c.nombre + ' ' + c.apellido;
    let foto = c.foto == null ? '<i class="fas fa-user-circle fa-2x"></i>' : '<img class="rounded-circle" src="../public/uploads/'+c.foto+'" style="height:50px;">'

    $('#EstudiantesPorClaseLista').append(
        '<div class="card-list-custom-2" id="idEstudiantexGrupo-'+id_usuario+'" onclick="abrirEstudiante('+cedula+')">'+
        '<div class="card-body d-flex">'+
        '<div class="align-self-center pr-2">'+
        foto+
        '</div>'+
        '<div class="align-self-stretch">'+
        '<h4 class="card-title">'+nombre+'</h4>'+
        '<p class="card-text text-muted">'+cedula+'</p>'+
        '</div>'+
        '</div>'+
        '<div class=" d-flex align-items-center mr-2">'+
        '<i class="fas fa-chevron-right fa-2x"></i>'+
        '</div>'+
        '</div>'
    );
}

function traerCursosEstudiante(){
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/grupos",
        data: data,
        contentType: "application/json"
    }).then((response) => {
        g_grupos = response;
        eachGrupos(response);
    }, (error) => {
    });
}
function eachGrupos(grupos) {
    $('#clasesLista').html('');
    grupos.forEach((e)=>{
        if(e.cupo_actual != 0){
            showGrupos(e);
        }
    });
}
function showGrupos(g){
    let id = g.id_grupo;
    let dia = g.dia;
    let hora = g.hora > 12 ? g.hora - 12 + 'pm' : g.hora + 'am';
    let nivel = g.nivel == 1 ? 'Principiante' : 'Intermedio-Avanzado';
    let cupo_actual = g.cupo_actual;
    $('#clasesLista').append(
        '<div class="card-list-custom" data-grupo="'+id+'" id="idGrupo-'+id+'" onclick="abrirCurso('+id+')">'+
        '<div class="card-body">'+
        '<h4 class="card-title"><i class="far fa-calendar-alt"></i> '+dia+' '+hora+'</h4>'+
        '<p class="card-text text-muted">'+nivel+'</p>'+
        '<h5 class="card-text">'+cupo_actual+' <span class="text-muted" style="font-size: 15px;">estudiantes</span></h5>'+
        '</div>'+
        '<div class=" d-flex align-items-center mr-2">'+
        '<i class="fas fa-chevron-right fa-2x"></i>'+
        '</div>'+
        '</div>'
    );
}


function traerInformacionDeEstudiante(){
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/informacionEstudiantesMatricula",
        data: data,
        contentType: "application/json"
    }).then((response) => {
        g_informacionEstudiantes = response;
    }, (error) => {
    });
}

function showInformacionDeEstudiante(id){
    $('#estudianteInformacionLista').html('');
    let e = buscarEstudiantexCedula(id);
    let foto;
    if(e.foto_estudiante != null){
        foto = '<div class="rounded-circle" style="background-image: url(../public/uploads/'+e.foto_estudiante+'); height: 20vh;width: 20vh;background-position: center;background-size: contain;"></div>';
    }else{
        foto = '<i class="fas fa-user-circle fa-10x"></i>';
    }
    let celular = e.celular_estudiante
    let edad = getEdad(e.nacimiento_estudiante);
    $('#estudianteInformacionLista').append(
        '<div class="card bg-light shadow-sm rounded-lg" id="estudianteInformacionCard">'+
        '<div class="card-body d-flex justify-content-between row">'+
        '<div class="align-self-center order-md-2 col-md d-flex justify-content-md-end justify-content-center">'+
        foto+
        '</div>'+
        '<div class="align-self-stretch col-md">'+
        '<h4 class="card-title">'+e.nombre_estudiante+' '+e.apellido_estudiante+'</h4>'+
        '<span class="text-muted">'+e.cedula_estudiante+'</span>'+
        '<h6>'+e.correo_estudiante+'</h6>'+
        '<h6>'+e.carrera_departamento+'</h6>'+
        '<h6>'+e.sexo_estudiante+'</h6>'+
        '<h6>Celular: <a href="tel:'+e.celular_estudiante+'" class="badge badge-success py-1" >'+e.celular_estudiante+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>Telefono de emergencia: <a href="tel:'+e.telefono_emergencia_estudiante+'" class="badge badge-warning py-1" >'+e.telefono_emergencia_estudiante+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>'+edad+' años</h6>'+
        '<button type="button" class="btn btn-primary" data-cedula="'+e.cedula_estudiante+'" data-toggle="modal" data-target="#modalAnotaciones">Crear anotacion</button>'+
        '</div>'+
        '</div>'+
        '</div>'
    );
}
function buscarEstudiantexCedula(id) {
    console.log(g_informacionEstudiantes);
    for(let i =0;i<g_informacionEstudiantes.length;i++){
        // console.log(g_informacionEstudiantes[i].cedula_estudiante,id);
        if(g_informacionEstudiantes[i].cedula_estudiante == id){
            return g_informacionEstudiantes[i];
        }
    }
}
function getEdad(birthday) {
    let b = new Date(birthday);
    var ageDifMs = Date.now() - b.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
document.addEventListener("DOMContentLoaded", loaded);