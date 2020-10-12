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
        url: "/ausencias/porEstudiante",
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
//-------------------------------------------------------------valida que los campos estén llenos----------------------------------

$(document).ready(function()
{
$("#boton").click(function () {	 
    if( $("#formulario input[name='edad']:radio").is(':checked')) {  
        alert("Bien!!!, la edad seleccionada es: " + $('input:radio[name=edad]:checked').val());
        $("#formulario").submit();  
        } else{  
            alert("Selecciona la edad por favor!!!");  
            }  
});
});

//----------------------------------------------------------------Parte de los commprobantes

function leerComprobante(){
    $("#comprobante").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' 
        || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG' 
        || tipo == 'PDF' || tipo == 'pdf'){
            $('#fileHelpId').append(
                '<input type="submit" value="Subir Comprobante" id="subirComprobanteBotonModal" class="btn btn-secondary w-100 mt-4" >'
            );
            $('#formatoImagenInvalido').hide();
        }else{
            $('#formatoImagenInvalido').show();
        }
    });
}
function cargarComprobantesFotos() {
    $.ajax({
        type: "GET",
        url: "/client/cargarPadecimientosFotos",
        contentType: "application/json"
    }).then((response) => {
        $('#spinnerPadecimientos').toggleClass('d-block');
        $('#spinnerPadecimientos').hide();
        showComprobantes(response);
    }, (error) => {

    });
}
function showComprobantes(comprobantes) {
    $('#comprobantes').html(' ');
    comprobantes.forEach(c =>{
        printComprobantes(c);
    });
}

function printComprobantes(c) {
    let tipo = c.documento.split('.')[1];
    if(tipo == 'pdf'){
        $('#comprobantes').append(
            '<div class="col-md-6">'+
            '<embed src="./../public/uploads/'+c.documento+'" type="application/pdf" width="100%" height="400px" />'+
            '</div>'    
        );
    }else{
        $('#comprobantes').append(
            '<div class="col-md-6">'+
            '<img src="./../public/uploads/'+c.documento+'" alt="" width="100%">'+
            '</div>'
        );
    }
}


document.addEventListener("DOMContentLoaded", loaded);






















































































































































































