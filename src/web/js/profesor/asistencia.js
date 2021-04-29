
var g_estudiantes = [];
var g_grupos = [];
var g_informacionEstudiantes = [];
var g_mapGrupos = new Map();
var g_mapAsistencia = new Map();

function loaded(event){
    events(event);
}

function events(event){
    traerEstudantesXGrupo();
    traerGrupos();
    traerInformacionDeEstudiante();
    movePageBack();
    modalsOpen();
}
const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
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
function modalsOpen() {
    $('#asistenciaModal').on('show.bs.modal', function (event) {
        animateCSS("#asistenciaModal", 'fadeInUpBig');
    })
    $('#asistenciaModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('grupo') 
        var grupo = g_mapGrupos.get(parseInt(id));
        $('#grupoIdModal').html('Grupo ' + id);
        buildAsistenciaTable(grupo);
      })
}
function buildAsistenciaTable(grupo) {
    console.log();
    let id = grupo.id_grupo;
    // let asistencia = g_mapAsistencia.get(parseInt(id));

}

function movePageBack() {
    $('#pag_ant').on('click',function(){
        let page = $('#pag_ant').attr('data-page');
        $('#buttonTriggerModalAsistencia').hide();
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
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/profesor/matriculaEstudiantes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_estudiantes = response;
        if(response == 'vacia'){
            
        }
    }, (error) => {
        
    });
    $.ajax({
        type: "GET",
        url: "/profesor/asistencia/getAsistencia",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        response.forEach((e =>{
            g_mapAsistencia.get(e.id_asistencia,e);
        }))
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
    $('#buttonTriggerModalAsistencia').show();
    $('#buttonTriggerModalAsistencia').attr("data-grupo",grupo);

    let result = filtrarEstudiantesxGrupo(grupo);
    $('#listaUlEstudiantes').html('');
    result.forEach((c)=>{
        mostrarCursosActuales(c);
    });
}
function updateStatus(estudiante,estado,grupo) {
    $.ajax({
        type: "GET",
        url: "/profesor/asistencia/actualizarEstudiante",
        data: {estado,estudiante,grupo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {

    }, (error) => {
        
    });
}
function mostrarCursosActuales(c) {
    let id_estudiante = c.id_estudiante;
    let cedula = c.cedula;
    let id_grupo = c.id_grupo;
    let nombre = c.nombre + ' ' + c.apellido;
    let foto = c.foto == null ? '<i class="fas fa-user-circle fa-3x"></i>' : 
    '<img class="rounded-circle mx-auto d-block" src="../public/uploads/'+c.foto+'" style="height:40px;">'
    let hora = c.hora > 12 ? c.hora - 12 + 'pm' : c.hora + 'am';
    $('#listaUlEstudiantes').append(`
        <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2" style="min-height:120px;">
            <div class="col-2 pr-0">
                <div class="btn-group-vertical" role="group" aria-label="Actualizar Estado">
                    <button type="button" class="btn btn-sm btn-success" onclick="updateStatus('${id_estudiante}','Presente',${id_grupo})">P</button>
                    <button type="button" class="btn btn-sm mt-1 btn-danger" onclick="updateStatus('${id_estudiante}','Ausente',${id_grupo})">A</button>
                    <button type="button" class="btn btn-sm mt-1 btn-warning" onclick="updateStatus('${id_estudiante}','Tarde',${id_grupo})">T</button>
                </div>
            </div>
            <div class="col px-1">
                <h5 class="mb-1">${nombre}</h5>
                <p class="mb-1">${cedula}</p>
                <small>${c.dia} ${hora}</small>
            </div>
            <div class="col-2 px-1 d-flex flex-column">
                <div class="mx-auto">${foto}</div>
                <button class="btn btn-primary btn-sm mt-4 mx-auto" id="idEstudiantexGrupo-${id_usuario}" onclick="abrirEstudiante(${cedula})"><i class="fas fa-info-circle"></i></button>
            </div>
        </li>
    `);
}

function traerGrupos(){
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/grupos",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
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
            g_mapGrupos.set(e.id_grupo,e);
        }
    });
}
function showGrupos(g){
    let id = g.id_grupo;
    let dia = g.dia;
    let hora = g.hora > 12 ? g.hora - 12 + 'pm' : g.hora + 'am';
    let nivel = g.descripcion;
    let cupo_actual = g.cupo_actual;
    let est = cupo_actual == 1 ? 'Estudiante':'Estudiantes';
    $('#clasesLista').append(`
    <div class="col-md mb-5">
        <div class="card rounded-xl shadow border-0 mx-auto" style="width: 320px;">
            <img src="../../../img/piscina4.jpg" class="card-img-top" alt="..." height="">
            <div class="card-body">
                <h5 class="card-title"><i class="far fa-calendar-alt"></i> Grupo ${dia} ${hora}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${nivel}</h6>
                <p class="card-text">${cupo_actual} ${est}</p>
                <button class="btn btn-primary" data-grupo="${id}" id="idGrupo-${id}" onclick="abrirCurso(${id})">Pasar Asistencia</button>
            </div>
        </div>
    </div>
    `);
}


function traerInformacionDeEstudiante(){
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/informacionEstudiantesMatricula",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_informacionEstudiantes = response;
    }, (error) => {
    });
}

function showInformacionDeEstudiante(id){
    $('#estudianteInformacionLista').html('');
    let e = buscarEstudiantexCedula(id);
    let foto;
    let celular = e.celular_estudiante == null ? 'No Asignado' : e.celular_estudiante;
    let correo = e.correo_estudiante == null ? 'No Asignado' : e.correo_estudiante;
    let carrera = e.carrera_departamento == null ? 'No Asignado' : e.carrera_departamento;
    let telefono = e.telefono_emergencia_estudiante == null ? 'No Asignado' : e.telefono_emergencia_estudiante;
    let id_est = e.id_estudiante;
    if(e.foto_estudiante != null){
        foto = '<div class="rounded-circle" style="background-image: url(../public/uploads/'+e.foto_estudiante+'); height: 20vh;width: 20vh;background-position: center;background-size: contain;"></div>';
    }else{
        foto = '<i class="fas fa-user-circle fa-10x"></i>';
    }

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
        '<h6>'+correo+'</h6>'+
        '<h6>'+carrera+'</h6>'+
        '<h6>'+e.sexo_estudiante+'</h6>'+
        '<h6>Celular: <a href="tel:'+celular+'" class="badge badge-success py-1" >'+celular+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>Telefono de emergencia: <a href="tel:'+telefono+'" class="badge badge-warning py-1" >'+telefono+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>'+edad+' años</h6>'+
        '</div>'+
        '</div>'+
        '</div>'
    );
}
function buscarEstudiantexCedula(id) {
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