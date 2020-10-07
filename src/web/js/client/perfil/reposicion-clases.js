function loaded(event) {
    events(event);
}

function events(event) {
    cargar_clases_perdidas();
    cargar_Estudiantes();
    dropdownhoras();
    filtrarXdia();
    toogleMenuAplicar();
}


//-------------------------------------------------------Asistencia de una persona-------------------
var clasesPerdidas = [];

function cargar_clases_perdidas() {
    $.ajax({
        type: "GET",
        url: "/client/reposicion-clases-perdidas",
        contentType: "application/json",
    }).then((asistenciaPerdida) => {
        clasesPerdidas = asistenciaPerdida;
        cargarAsistencia(asistenciaPerdida);
        $('#cargarDatosSpinnerRepo').hide(); // hay que añadie ese en el html
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
    let codigo = asistenciaPerdida.codigo_taller;
    let fecha = asistenciaPerdida.dia.toUpperCase() + "/" + asistenciaPerdida.mes.toUpperCase() + "/" + asistenciaPerdida.anio.toUpperCase()+" "+ asistenciaPerdida.hora.toUpperCase()+":00";
    let tiempo_restante =  asistenciaPerdida.tiempo_restante;
    let ausencias_historicas = asistenciaPerdida.ausencias_historicas; // PREGUNTARLE A IAN QUE COMO se hace para que por cada ausencia aumentarle 1 + al historial si lo deja pasar 
   
    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>"+
        "<input type="radio" name ="radio_clase_perdida "/>"+
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




document.addEventListener("DOMContentLoaded", loaded);






















































































































































































