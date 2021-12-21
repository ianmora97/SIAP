var cursos_matriculados = [];

function loaded(event){
    events(event);
}

function events(event){
    traerCursosEstudiante();
    desmatricula();
}
function desmatricula(){
    $('#editMatriculaActual').on('shown.bs.modal', function (event) {
        let button = $(event.relatedTarget)
        let id = button.data('id')
        let c;
        for(let i = 0; i<cursos_matriculados.length; i++){
            if(cursos_matriculados[i].id_matricula == id){
                c = cursos_matriculados[i];
            }
        }
        let codigo = c.codigo_taller;
        let titulo = c.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
        let dia = c.dia;
        let hora = c.hora > 12 ? c.hora - 12 + 'pm' : c.hora + 'am';
        let periodo = c.periodo;
        let profesor = c.nombre_profesor;
        
        $('#informacionCursoModal').html(' ');
        $('#informacionCursoModal').append(
            '<strong>Descripcion:</strong> '+codigo+' '+titulo+
            '<br><strong>Dia:</strong> '+dia+
            '<br><strong>Hora:</strong> '+hora+
            '<br><strong>Periodo:</strong> '+periodo+
            '<br><strong>Profesor:</strong> '+profesor.toUpperCase()
        );
        $('#desmatricularCurso').attr('data-id',id);
        $('#desmatricularCurso').attr('data-target','#desmatricularCursoModal');
        $('#desmatricularCurso').attr('data-toggle','modal');
    })
    $('#desmatricularCursoModal').on('shown.bs.modal',function(event){
        $('#editMatriculaActual').modal('toggle');
        let button = $(event.relatedTarget)
        let id = button.data('id')

        $('#idCursoDesmatricular').attr('data-id',id);
    });
    $('#desmatricularCursoAceptar').on('click',function(){
        $('#desmatriculaLoader').show();
        let curso_id = $('#idCursoDesmatricular').data('id');
        let data = {curso_id}
        $.ajax({
            type: "POST",
            url: "/client/cursos/desmatricular",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((response) => {
            $('#alertasucess').show();
            $('#desmatriculaLoader').hide();
            setTimeout(()=>{
                location.href = "/client/clases";
            },3000);
        }, (error) => {
            $('#alertadanger').show();
            $('#desmatriculaLoader').hide();
        });
    });
}
function imprimirHistorial(){
    alert('imprimir');
}
function traerCursosEstudiante(){
    let cedula = $('#id_cedula').html();
    let data = {cedula}
    console.log('CEDULA:',data);
    $.ajax({
        type: "GET",
        url: "/client/matricula/seleccionaMatriculaEstudiante",
        data: data,
        contentType: "application/json"
    }).then((response) => {
        $('#cargarCursosActuales').hide();
        $('#cargarHistorialCursos').hide();
        console.log(response);
        cursos_matriculados = response;
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
        case 'SÁBADO':
            return 6;
        case 'DOMINGO':
            return 7;
        default:
            break;
    }
}
function forEachCursosActuales(cursos){
    $('#lista_cursos_actuales').html('');
    cursos.forEach((c)=>{
        mostrarCursosActuales(c);
    });
}
function mostrarCursosActuales(c) {
    let id_matricula = c.id_matricula;
    let grupo = c.id_grupo;
    let codigo = c.codigo_taller;
    let titulo = c.descripcion;
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
    let p = c.nombre + c.apellido;
    let weekday = toWeekDay(dia.toUpperCase());
    let todo = `Profesor: ${p} <br>${dia}: ${c.hora}`;
    let horainicio = c.hora + ":00";
    let horafinal = (c.hora + 1) + ":00";

    $('#calendar').fullCalendar('renderEvent', {
        title: titulo,
        description: todo,
        start: horainicio,
        end: horafinal,
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