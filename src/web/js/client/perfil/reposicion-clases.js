function loaded_c(event) {
    events_c(event);
}

function events_c(event) {
    cargar_clases_reservadas();
    cargar_clases_perdidas();
    leerComprobante();
    checkFecha();
}

//-------------------------------------------------------Cursos a los que faltó la persona-----------------------------------------
var clasesPerdidas = [];

function cargar_clases_perdidas() {
    $.ajax({
        type: "GET",
        url: "/clases/reposicion/porEstudiante",
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

    $.ajax({
        type: "GET",
        url: "/clases/asistencia/porEstudiante",
        contentType: "application/json",
    }).then((asistencias) => {
        clasesPerdidas = asistencias;
        cargarListaAsistencias(asistencias);
    },
        (error) => {
            alert(error.status);
        }
    );
}
function cargarListaAsistencias(asistencias) {
    $("#lista_asistencia_usuario").html("");
    asistencias.forEach((a) => {
        llenarAsistenciasTabla(a);
    });
    $('#tabla_asistencia').DataTable({
        "language": {
            "zeroRecords": "No se encontraron asistencias",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "_MENU_ ",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": 'Primera',
                    "previous": 'Anterior',
                    "next": 'Siguiente',
                    "last": 'Última'
                }
            }
        }
      });
}
function llenarAsistenciasTabla(a) {
    $("#lista_asistencia_usuario").append(`
        <tr>
            <td>Grupo ${a.id_grupo} (${a.codigo})</td>
            <td><span style="font-size:12px;" class="w-75 badge badge-${a.estado == 'Presente'? 'success':a.estado == 'Ausente'? 'danger':'warning' }">${a.estado}</span></td>
            <td>${a.fecha}</td>
        </tr>
    `);
}
function cargarAsistenciaPerdida(asistenciaPerdida) {
    
   asistenciaPerdida = filtra_X_ausencias_justificables(asistenciaPerdida);
    $("#tablaClasesPerdidas").html("");
    asistenciaPerdida.forEach((asistencia_Perdida) => {
        llenarAsistenciaPerdida(asistencia_Perdida);
    });
}
function llenarAsistenciaPerdida(asistenciaPerdida) {

    let nivel = asistenciaPerdida.nivel;
    let id = asistenciaPerdida.id_grupo;
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
    
    let Dia = 1000*60*60*24;

    let tiempo_restante = Math.floor((semana - actual) / Dia);

    $("#tablaClasesPerdidas").append(
        "<tr>" +
        "<td>" +
'        <div class="custom-control ">'+
        '<input type="radio" id="clasePerdidaRadio-' + id + '" name="grupo_origen" value="'+id+'" >'+
        '</div>'+
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
        "</tr>"
    );
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
        if (tiempo_restante > 0) {
            result.push(asistenciaPerdida[i]);
        }
    }
    return result;
};
function sumarDias(fecha, dias) {
    let fecha_limite = new Date(fecha);
    fecha_limite.setMonth(fecha_limite.getMonth() - 1);
    fecha_limite.setDate(fecha_limite.getDate() + dias);

    return fecha_limite;
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
        let nivel = $('#id_nivel').text();
        $.ajax({
            type: "GET",
            url: "/client/cargarCursos",
            data: {nivel},
            contentType: "application/json",
        }).then((clasesExistentes_) => {
            clasesExistentes = clasesExistentes_;
            if(clasesReservadas.length == 0){
                cargarCursosDisponibles_alt(clasesExistentes);
            }else{
                cargarCursosDisponibles(clasesReservadas, clasesExistentes);
            }
            $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
        },(error) => {
                alert(error.status);
        });

        $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
    },
        (error) => {
            alert(error.status);
        }
    );
}
function cargar_clases_reservadas_alt() { // ocupo unir este metodo con el de abajo
    let nivel = $('#id_nivel').text();
    $.ajax({
        type: "GET",
        url: "/client/cargarCursos",
        data: {nivel},
        contentType: "application/json",
    }).then((clasesExistentes_) => {
        clasesExistentes = clasesExistentes_;
        cargarCursosDisponibles_alt(clasesExistentes_);
        $('#cargarDatosSpinnerRepoDisponibles').hide(); // hay que añadie ese en el html
    },(error) => {
            alert(error.status);
    });
}



function restar_disponibles_con_reservados(clasesReservadas, clasesExistentes) {
    let cursos = [];

    let result = [];
    let todos = [];
    let reservados = [];

    for(let i=0;i<clasesReservadas.length;i++){
        reservados.push({id:clasesReservadas[i].grupo_reposicion, fecha: clasesReservadas[i].fecha_reposicion, cantidad:clasesReservadas[i].cuenta});
    }
    for(let i=0;i<clasesExistentes.length;i++){
        todos.push({id: clasesExistentes[i].id_grupo, extra: clasesExistentes[i].cupo_extra});
    }

    for(let i=0;i<reservados.length;i++){ //filtra los cursos que estan reservados
        for(let j=0;j<todos.length;j++){
            if(todos[j].id == reservados[i].id){
                if(todos[j].extra == reservados[i].cantidad){
                    result.push(todos[j].id);
                }
            }
        }
    }
    result = result.filter(function(item, pos) {
        return result.indexOf(item) == pos;
    })
    for(let i=0;i<todos.length;i++){
        for(let j=0;j<result.length;j++){
            if(todos[i].id != result[j]){
                cursos.push(todos[i].id);
            }
        }
    }

    let final = [];
    for (let i = 0; i < cursos.length; i++) {
        for (let j = 0; j < clasesExistentes.length; j++) {
            if (clasesExistentes[j].id_grupo == cursos[i] ){
                final.push(clasesExistentes[j]);
            }
        }
    }
    final = final.filter(function(item, pos) {
        return final.indexOf(item) == pos;
    })

    return final;
}

function cargarCursosDisponibles_alt(clasesExistentes) {
    $("#tablaClasesDisponibles").html("");
    clasesExistentes.forEach((clasesDispo) => {
        llenarCursosDisponibles(clasesDispo);
    });
}
function cargarCursosDisponibles(clasesReservadas,clasesExistentes) {
    let clasesDispo = [];

    if(clasesReservadas.length = 0){
        clasesDispo = clasesExistentes;
    }
    clasesDispo = restar_disponibles_con_reservados(clasesReservadas,clasesExistentes);
    $("#tablaClasesDisponibles").html("");
    clasesDispo.forEach((clasesDispo) => {
        llenarCursosDisponibles(clasesDispo);
    });
}

function llenarCursosDisponibles(cupo) {

    let id = cupo.id_grupo;
    let profesor = cupo.nombre.toUpperCase() +" "+ cupo.apellido.toUpperCase();
    let codigo = cupo.codigo_taller;
    let cupos = cupo.cupo_extra;
    let fecha = cupo.dia +' ' + (cupo.hora > 12 ? (cupo.hora - 12) + 'pm' : cupo.hora + 'am');
    

    $("#tablaClasesDisponibles").append(
        "<tr>" +
        "<td>" +
        '<div class="">' +
        '<input type="radio" id="claseDisponibleRadio-' + id + '" value="' + id + '" name="grupo_reposicion" onclick="checkFecha('+id+')">' +
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

function checkFecha(id) {
    var Options = $("[id*=claseDisponibleRadio-]");
    for(let i=0;i<clasesExistentes.length;i++){
        if(clasesExistentes[i].id_grupo == id){
            daytoWeekDay(clasesExistentes[i].dia).then((dia)=>{
                var d = new Date();
                d.setDate(d.getDate() + (dia + 7 - d.getDay()) % 7);
                d.setHours(clasesExistentes[i].hora);
                d.setMinutes(0);
                d.setSeconds(0);

                var day = ("0" + d.getDate()).slice(-2);
                var month = ("0" + (d.getMonth() + 1)).slice(-2);
                
                let dateToday = d.getFullYear()+'-'+(month)+'-'+(day);
                $('#fechaReposicion').val(dateToday);
            });
        }   
    }
}
async function daytoWeekDay(day) {
    switch (day) {
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
            return 0;    
    }
}

//----------------------------------------------------------------Parte de los commprobantes

function leerComprobante() {
   $("#comprobante").change(function (event) {
       let fileInput = event.currentTarget;
       let archivos = fileInput.files;
       let nombre = archivos[0].name;
       let tipo = nombre.split('.')[archivos.length];
       if (tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg'
           || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'
           || tipo == 'PDF' || tipo == 'pdf') {
           $('#fileHelpId').after(
               '<div class="btn btn-secondary w-100 mt-4" data-dismiss="modal">Aceptar</div>'
           );
           $('#formatoImagenInvalido').hide();
       } else {
           $('#formatoImagenInvalido').show();
       }
   });
}

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