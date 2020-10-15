function loaded_c(event) {
    events_c(event);
}

function events_c(event) {
    cargar_clases_perdidas();
    cargar_clases_reservadas();

}

//-------------------------------------------------------Cursos a los que faltó la persona-----------------------------------------
var clasesPerdidas = [];

function cargar_clases_perdidas() {
    $.ajax({
        type: "GET",
        url: "/reposicion/porEstudiante",
        contentType: "application/json",
    }).then((asistenciaPerdida) => {
        clasesPerdidas = asistenciaPerdida;
        cargarAsistenciaPerdida(asistenciaPerdida);
        $('#cargarDatosSpinnerRepoPerdidos').hide(); // hay que añadie ese en el html
    },
        (error) => {
            alert(error.status);
        }
    );
}

function cargarAsistenciaPerdida(asistenciaPerdida) {
    
   asistenciaPerdida = filtra_X_ausencias_justificables(asistenciaPerdida);
    $("#tablaClasesPerdidas").html("");
    asistenciaPerdida.forEach((asistencia_Perdida) => {
        console.log(asistencia_Perdida);
        llenarCursosPerdidos(asistencia_Perdida);
    });
}

var filtra_X_ausencias_justificables = (asistenciaPerdida) => { // No sé en donde va esto para que filtre la vara 
    let result = [];
    for (let i = 0; i < asistenciaPerdida.length; i++) {
        let fecha = asistenciaPerdida[i].fecha; // 13-10-2020-04-42
        let dia = fecha.split('-')[0];
        let mes = fecha.split('-')[1];
        let anio = fecha.split('-')[2];
        let hora = fecha.split('-')[3];
        let minutos = fecha.split('-')[4];
        let Fecha_ = new Date(anio, mes, dia, hora, minutos);
        let semana = sumarDias(Fecha_, 7);
        let actual = new Date();

        let tiempo_restante = semana - actual;
        console.log(tiempo_restante);
        if (tiempo_restante > 0) {
            result.push(asistenciaPerdida[i]);
        }
    }
    return result;
};

function sumarDias(fecha, dias) {
    let fecha_limite = new Date(fecha);
    fecha_limite.setDate(fecha_limite.getDate() + dias);
    return fecha_limite;
}






function llenarCursosPerdidos(asistenciaPerdida) {
    console.log(asistenciaPerdida);
    let nivel = asistenciaPerdida.nivel;
    let id = asistenciaPerdida.id;
    let codigo = asistenciaPerdida.codigo;

    let fecha = asistenciaPerdida.fecha; // 13-10-2020-04-42
    let dia = fecha.split('-')[0];
    let mes = fecha.split('-')[1];
    let anio = fecha.split('-')[2];
    let hora = fecha.split('-')[3];
    let minutos = fecha.split('-')[4];

    let fechaVista = dia + "/" + mes + "/" + anio + " " + minutos + ":00"

    let Fecha_ = new Date(anio, mes, dia, hora, minutos);
    let semana = sumarDias(Fecha_, 7);
    let actual = new Date();

    let tiempo_restante = Math.floor((semana - actual) / Dia);

    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>" +
        '<div class="custom-control custom-radio">' +
        '<input  type="radio" id="clasePerdidaRadio-' + id + '" class="custom-control-input" data-value="' + id + '" name="clasePerdidaRadio"' +
        '</div>' +
        "</td>" +
        "<td>" +
        codigo +
        " </td>" +
        "<td>" +
        fechaVista +
        "</td>" +
        "<td>" +
        tiempo_restante +
        "</td>" +
        "<td>" +
        'Esto no va acá, es lo que tiene que ir con una barra de progreso' +
        "</td>" +
        "<td>" +
        nivel +
        "</td>" +
        "</tr>"
    );
}


//-------------------------------------------------------Cursos disponibles para reponer en los proximos 7 días-----------------------------------------
var clasesReservadas = [];
var clasesExistentes = [];

function cargar_clases_reservadas() { // ocupo unir este metodo con el de abajo
    $.ajax({
        type: "GET",
        url: "/reposicion/cursosDisponiblesPorNivel",// el de la tabla de solicitudes
        contentType: "application/json",
    }).then((clasesReservadas_) => {
        clasesReservadas = clasesReservadas_;
        $.ajax({
            type: "GET",
            url: "/client/cargarCursos",
            contentType: "application/json",
        }).then((clasesExistentes_) => {
            clasesExistentes = clasesExistentes_;
            cargarCursosDisponibles(clasesReservadas, clasesExistentes);
            $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
        },
            (error) => {
                alert(error.status);
            }
        );

        $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
    },
        (error) => {
            alert(error.status);
        }
    );
}


function restar_disponibles_con_reservados(clasesReservadas, clasesExistentes) {
    let curos = [];

    // en el caso en que un curso hayan cupos (que cupos_extra sea <0) y que los reservados sean menores a los campos máximos del grupo (porque si estan los campos extra intactos si
    //gnifica que nadie ha reservado aun en ese horario)
    for (let i = 0; i < clasesReservadas.length; i++) {
        for (let j = 0; j < clasesExistentes.length; j++) {
            if (clasesReservadas[i].id_grupo == clasesExistentes[j].id_grupo &&
                clasesReservadas[i].cupo_extra > 0 &&
                clasesReservadas[i].cupo_extra < clasesExistentes[j].cupo_extra
            ) {
                curos.push(clasesExistentes[j]);
            }
        }
    }

    // en el caso que un horario no tenga ninguna reserva aún (o sea, no hay registro de ello en la trabla de reservas)
    for (let i = 0; i < clasesReservadas.length; i++) {
        let contador = 0;
        for (let j = 0; j < clasesExistentes.length; j++) {
            if (clasesReservadas[i].id_grupo == clasesExistentes[j].id_grupo) {
                contador++; // guardo la cantidad de veces que un curso de las reservaciones está en los disponibles
            }
            if (contador == 0) {// si ese curso no se encuentra en las reservaciones es porque tiene todos los campos libres, entonces lo meto en el vector
                curos.push(clasesExistentes[j]);
            }

        }
        contador = 0;
    }
    return cursos;
}

function cargarCursosDisponibles(clasesReservadas,clasesExistentes) {
    let clasesDispo = restar_disponibles_con_reservados(clasesReservadas,clasesExistentes);
    $("#tablaClasesDisponibles").html("");
    console.log(clasesDispo);
    clasesDispo.forEach((clasesDispo) => {
        llenarCursosDisponibles(clasesDispo);
    });
}

function llenarCursosPerdidos(clasesDispo) {
    let id = clasesDispo.id;
    let codigo = clasesDispo.codigo;
    let fecha = clasesDispo.fecha;
    let cupos = clasesDispo.cupos;
    let profesor = clasesDispo.profesor;

    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>" +
        '<div class="custom-control custom-radio">' +
        '<input  type="radio" id="claseDisponibleRadio-' + id + '" class="custom-control-input" value="' + id + '" name="claseDisponibleRadio"' +
        '</div>' +
        "</td>" +
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
//-------------------------------------------------------------valida que los campos estén llenos----------------------------------

//$(document).ready(function () {
//    $("#boton").click(function () {
//        if ($("#formulario input[name='edad']:radio").is(':checked')) {
//            alert("Bien!!!, la edad seleccionada es: " + $('input:radio[name=edad]:checked').val());
//            $("#formulario").submit();
//        } else {
//            alert("Selecciona la edad por favor!!!");
//        }
//    });
//});

//----------------------------------------------------------------Parte de los commprobantes

//function leerComprobante() {
//    $("#comprobante").change(function (event) {
//        let fileInput = event.currentTarget;
//        let archivos = fileInput.files;
//        let nombre = archivos[0].name;
//        let tipo = nombre.split('.')[archivos.length];
//        if (tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg'
//            || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'
//            || tipo == 'PDF' || tipo == 'pdf') {
//            $('#fileHelpId').append(
//                '<input type="submit" value="Subir Comprobante" id="subirComprobanteBotonModal" class="btn btn-secondary w-100 mt-4" >'
//            );
//            $('#formatoImagenInvalido').hide();
//        } else {
//            $('#formatoImagenInvalido').show();
//        }
//    });
//}
//function cargarComprobantesFotos() {
//    $.ajax({
//        type: "GET",
//        url: "/client/cargarPadecimientosFotos",// acá podría la ruta que se llama /cliente/uploadRepoImage
//        contentType: "application/json"
//    }).then((response) => {
//        $('#spinnerPadecimientos').toggleClass('d-block');
//        
//        showComprobantes(response);
//    }, (error) => {
//
//    });
//}
//
//
//function showComprobantes(comprobantes) {
//    $('#comprobantes').html(' ');
//    comprobantes.forEach(c => {
//        printComprobantes(c);
//    });
//}
//
//function printComprobantes(c) {
//    let tipo = c.documento.split('.')[1];
//    if (tipo == 'pdf') {
//        $('#comprobantes').append(
//            '<div class="col-md-6">' +
//            '<embed src="./../public/uploads/' + c.documento + '" type="application/pdf" width="100%" height="400px" />' +
//            '</div>'
//        );
//    } else {
//        $('#comprobantes').append(
//            '<div class="col-md-6">' +
//            '<img src="./../public/uploads/' + c.documento + '" alt="" width="100%">' +
//            '</div>'
//        );
//    }
//}



document.addEventListener("DOMContentLoaded", loaded_c);






















































































































































































