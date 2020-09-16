var cursos = [];

function loaded(event){
    events(event);
}

function events(event){
    cargar_cupos();
}

function cargar_cupos(){
    let nivel = $('#nivel_estudiante').text();
    let data = {nivel}
    $.ajax({
        type: "GET",
        url: "/client/cargarCursos",
        data:data,
        contentType: "application/json"
    }).then((response) => {
        cursos = response;
        cargarCupos(response);
    }, (error) => {
    });
}
function cargarCupos(cupos) {
    $('#cursos_lista').html('');
    cupos.forEach(cupo => {
        llenarCupos(cupo);
    });
}
function llenarCupos(cupo) {
    let tipo = $('#tipo_estudiante').text();
    let profesor = cupo.nombre.toUpperCase() +" "+ cupo.apellido.toUpperCase();
    let cod_t = cupo.codigo_taller;
    let costo = tipo == 1 ? cupo.costo : cupo.costo_funcionario;
    let nivel = cupo.nivel == 1 ? 'Principiante' : cupo.nivel == 2 ? 'Intermedio' : 'Avanzado';
    let cupos = cupo.cupo_base > 0 ? 'Cupo Disponible' : 'No hay cupos';
    let cupos_t = cupo.cupo_base > 0 ? 'bg-success' : 'bg-danger';
    let fecha = parseFecha(cupo.dia,cupo.hora);
    $('#cursos_lista').append(
        '<div class="w-100 my-3">'+
        '<div class="card-cursos-header">'+
        '<h5 id="nombre">(Taller) Piscina Nivel '+nivel+' <br><span id="nrc">'+cod_t+'</span></h5>'+
        '<span class="my-auto badge badge-pill '+cupos_t+'" id="cupo">'+cupos+'</span>'+
        '</div>'+
        '<div class="card-cursos-body">'+
        '<p class="my-0" id="horario">'+fecha+'</p>'+
        '<i class="fas fa-swimmer fa-3x text-celeste"></i>'+
        '</div>'+
        '<div class="card-cursos-footer">'+
        '<div class="row w-100">'+
        '<div class="col-md-6">'+
        '<small id="profesor">Profesor: '+profesor+'</small>'+
        '</div>'+
        '<div class="col-md-6">'+
        '<span>Costo:</span>'+
        '<a href="#" class="mx-3 btn btn-secondary disabled" role="button" id="precio">'+costo+' Colones</a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'

    );


}
function parseFecha(dia,hora){
    let fecha = dia;
    let h = hora > 12 ? hora - 12 : hora;
    let u = hora >= 12 ? 'pm' : hora == 24 ? 'am' : 'am' ;
    fecha = fecha + " " + h + u + "-" + (h+1) + u;
    return fecha;
}
document.addEventListener("DOMContentLoaded", loaded);