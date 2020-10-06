var cursos_matriculados = [];

function loaded(event){
    events(event);
}

function events(event){
    traerCursosEstudiante();
    filtarHistorial();
}
function imprimirHistorial(){
    alert('imprimir');
}
function traerCursosEstudiante(){
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/client/matricula/seleccionaMatriculaEstudiante",
        data: data,
        contentType: "application/json"
    }).then((response) => {
        $('#cargarCursosActuales').hide();
        $('#cargarHistorialCursos').hide();
        cursos_matriculados = response;
        forEachCursosMatriculados(response);
        forEachCursosActuales(response);
    }, (error) => {
    });
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}
function toWeekDay(dia) {
    switch (dia) {
        case 'LUNES':
            return 1;
        case 'MARTES':
            return 2;
        case 'MIERCOLES':
            return 3;
        case 'JUEVES':
            return 4;
        case 'VIERNES':
            return 5;
        case 'SABADO':
            return 6;
        case 'DOMINGO':
            return 7;
        default:
            break;
    }
}
function filtarHistorial(){
    $('#nivel').on('change', function(){
        let opcion = $( "#nivel option:selected" ).text();
        let result = [];
        for(let i=0; i<cursos_matriculados.length; i++){
            let nivel = cursos_matriculados[i].nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
            if(nivel == opcion){
                result.push(cursos_matriculados[i]);
            }
        }
        forEachCursosMatriculados(result);
    });
}
function filtrarCursosActuales(cursos) {
    let today = get_today_date().split('-')[1];
    let result = [];
    for(let i=0; i<cursos.length; i++){
        if(cursos[i].periodo.split('-')[1] == today){
            result.push(cursos[i]);
        }
    }
    return result;
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
    let weekday = toWeekDay(dia);
    $('#calendar').fullCalendar('renderEvent', {
        title: 'Piscina Day!',
        description: 'Taller de la piscina',
        start: horaF,
        end: horaFi,
        dow: [ weekday ], 
        className: 'fc-bg-default',
        icon : "swimmer"
    });
}
function forEachCursosMatriculados(cursos) {
    $('#lista_historial_cursos').html('');
    cursos.forEach((c)=>{
        mostrarCursos(c);
    });
}
function mostrarCursos(c) {
    let id_matricula = c.id_matricula;
    let grupo = c.id_grupo;
    let codigo = c.codigo_taller;
    let titulo = c.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
    let dia = c.dia;
    let hora = c.hora > 12 ? c.hora - 12 + 'pm' : c.hora + 'am';
    let horaF = c.hora > 12 ? c.hora - 12 +':00': c.hora +':00' ;
    let horaFi = c.hora > 12 ? c.hora - 11 +':00': c.hora + 1 +':00' ;
    let periodo = c.periodo;
    $('#lista_historial_cursos').append(
        '<tr>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'">'+titulo+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'">'+codigo+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'">'+periodo+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'">'+dia+'</th>'+
        '<th role="button" data-id="'+id_matricula+'" data-codigocurso="'+grupo+'">'+hora+'</th>'+
        '<tr>'
    );
}
document.addEventListener("DOMContentLoaded", loaded);