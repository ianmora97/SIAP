var g_estudiantes = [];
var g_grupos = [];

function loaded(event){
    events(event);
}

function events(event){
    traerCursosEstudiante();
    movePageBack();
}
function movePageBack() {
    $('#pag_ant').on('click',function(){
        let page = $('#pag_ant').attr('data-page');
        if(page == 1){
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
    $('#clasesLista').removeClass('animate__bounceInLeft');
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutRight');
    
    $('#clasesLista').addClass('animate__animated animate__bounceOutLeft');
    setTimeout(()=>{
        $('#clasesLista').hide();
        $('#pag_ant').attr('data-page','1');
        console.log($('#pag_ant').attr('data-page'));
        $('#pag_ant').show();
    },500);
    setTimeout(()=>{
        $('#EstudiantesPorClaseLista').show();
        $('#EstudiantesPorClaseLista').addClass('animate__animated animate__bounceInRight');
    },500);
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
    }, (error) => {
    });
}


function forEachCursosActuales(cursos){
    let result = filtrarCursosActuales(cursos);
    $('#lista_cursos_actuales').html('');
    result.forEach((c)=>{
        mostrarCursosActuales(c);
    });
}

function mostrarCursosActuales(c) {
    let id_matricula = c.id_matricula;
    let grupo = c.id_grupo;
    let codigo = c.codigo_taller;
    let titulo = c.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
    let dia = c.dia;
    let hora = c.hora > 12 ? c.hora - 12 + 'pm' : c.hora + 'am';
    let horaF = c.hora > 12 ? c.hora - 12 +':00': c.hora +':00' ;
    let horaFi = c.hora > 12 ? c.hora - 11 +':00': c.hora + 1 +':00' ;
    $('#lista_cursos_actuales').append(
        '<tr>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'" data-toggle="modal" data-target="#editMatriculaActual">'+titulo+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'" data-toggle="modal" data-target="#editMatriculaActual">'+codigo+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'" data-toggle="modal" data-target="#editMatriculaActual">'+dia+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'" data-toggle="modal" data-target="#editMatriculaActual">'+hora+'</th>'+
        '<tr>'
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
    }, (error) => {
    });
}
document.addEventListener("DOMContentLoaded", loaded);