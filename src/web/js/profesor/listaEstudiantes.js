var g_estudiantes = [];
var g_grupos = [];

function loaded(event){
    events(event);
}

function events(event){
    traerEstudantesXGrupo();
    traerCursosEstudiante();
    movePageBack();
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

function traerEstudantesXGrupo(){
    $.ajax({
        type: "GET",
        url: "/profesor/matriculaEstudiantes",
        contentType: "application/json"
    }).then((response) => {
        console.log(response);
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

    $('#EstudiantesPorClaseLista').append(
        '<div class="card-list-custom-2" id="idEstudiantexGrupo-'+id_usuario+'" onclick="abrirEstudiante('+id_usuario+')">'+
        '<div class="card-body d-flex">'+
        '<div class="align-self-center pr-2">'+
        '<i class="fas fa-user-circle fa-2x"></i>'+
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

document.addEventListener("DOMContentLoaded", loaded);