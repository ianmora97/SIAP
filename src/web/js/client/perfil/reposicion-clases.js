function loaded(event) {
    events(event);
}

function events(event) {
    cargar_clases_perdidas();
    cargar_clases_disponibles();

}


//-------------------------------------------------------Cursos a los que faltó la persona-----------------------------------------
var clasesPerdidas = [];

function cargar_clases_perdidas() {
    $.ajax({
        type: "GET",
        url: "/client/reposicion-clases-perdidas",
        contentType: "application/json",
    }).then((asistenciaPerdida) => {
        clasesPerdidas = asistenciaPerdida;
        cargarAsistencia(asistenciaPerdida);
        $('#cargarDatosSpinnerRepoPerdidos').hide(); // hay que añadie ese en el html
    },
        (error) => {
            alert(error.status);
        }
    );
}

function cargarAsistenciaPerdida(asistenciaPerdida) {
    $("#tablaClasesPerdidas").html("");
    console.log(asistenciaPerdida);
    asistenciaPerdida.forEach((asistenciaPerdida) => {
        llenarCursosPerdidos(asistenciaPerdida);
    });
}

function llenarCursosPerdidos(asistenciaPerdida) {
    let id = asistenciaPerdida.id;
    let codigo = asistenciaPerdida.codigo_taller;
    let fecha = asistenciaPerdida.dia.toUpperCase() + "/" + asistenciaPerdida.mes.toUpperCase() + "/" + asistenciaPerdida.anio.toUpperCase()+" "+ asistenciaPerdida.hora.toUpperCase()+":00";
    let tiempo_restante =  asistenciaPerdida.tiempo_restante;
    let ausencias_historicas = asistenciaPerdida.ausencias_historicas; // PREGUNTARLE A IAN QUE COMO se hace para que por cada ausencia aumentarle 1 + al historial si lo deja pasar 
   
    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>"+
        '<div class="custom-control custom-radio">' +
        '<input  type="radio" id="clasePerdidaRadio-'+ id +'" class="custom-control-input" data-value="'+ id +'" name="clasePerdidaRadio"' +
        '</div>' +
        "</td>"+
        "<td>" +
        codigo +
        " </td>" +
        "<td>" +
        fecha +
        "</td>" +
        "<td>" +
        tiempo_restante +
        "</td>" +
        "<td>" +
        ausencias_historicas +
        "</td>" +
        "<td>" +
        nivel +
        "</td>" +
        "</tr>"
    );
}


//-------------------------------------------------------Cursos disponibles para reponer en los proximos 7 días-----------------------------------------
var clasesDisponibles = [];

function cargar_clases_disponibles() {
    $.ajax({
        type: "GET",
        url: "/client/reposicion-clases-disponibles",
        contentType: "application/json",
    }).then((clasesDispo) => {
        clasesDisponibles = clasesDispo;
        cargarCursosDisponibles(clasesDispo);
        $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
    },
        (error) => {
            alert(error.status);
        }
    );
}

function cargarCursosDisponibles(clasesDispo) {
    $("#tablaClasesDisponibles").html("");
    console.log(clasesDispo);
    clasesDispo.forEach((clasesDispo) => {
        llenarCursosDisponibles(clasesDispo);
    });
}

function llenarCursosPerdidos(clasesDispo) {
    let id = clasesDispo.id;
    let codigo = clasesDispo.codigo_taller;
    let fecha = clasesDispo.dia.toUpperCase() + "/" + clasesDispo.mes.toUpperCase() + "/" + clasesDispo.anio.toUpperCase()+" "+ clasesDispo.hora.toUpperCase()+":00";
    let cupos =  clasesDispo.cupos;
    let profesor = clasesDispo.profesor; 
   
    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>"+
        '<div class="custom-control custom-radio">' +
        '<input  type="radio" id="claseDisponibleRadio-'+ id +'" class="custom-control-input" value="'+ id +'" name="claseDisponibleRadio"' +
        '</div>' +
        "</td>"+
        "<td>" +
        codigo +
        " </td>" +
        "<td>" +
        fecha +
        "</td>" +
        "<td>" +
        cupos +
        "</td>" +
        "<td>" +
        profesor +
        "</td>" +

        "</tr>"
    );
}


document.addEventListener("DOMContentLoaded", loaded);






















































































































































































