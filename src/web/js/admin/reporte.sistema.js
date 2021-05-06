function loaded(event) {
    events(event);
}

function events(event) {
cargar_registros();
cargar_administradores();
}

//------------------------Cargar todos los estudiantes matriculados en al menos un curso-----------------------------Inicio---


function cargar_administradores(){

  
    $.ajax({
        type: "GET",
        url: "/admin/registro/sistemaCanAdmin",
        //url: "/admin/estudiante/getTalleres",
        
        contentType: "application/json",
    }).then((solicitudes) => {
        
        
        
        $('#cantidad_administrativos').html(solicitudes.length);
       
    },
        (error) => {
            alert(error.status);
        }
    );



}
var registro = [];
function cargar_registros() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/registro/sistema",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((solicitudes) => {
        console.log(solicitudes);
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        registro = solicitudes;
        let est = registro.filter( element => element.tabla == 'T_ESTUDIANTE');
        let curs = registro.filter( element => element.tabla == 'T_GRUPO');
        let prof = registro.filter( element => element.tabla == 'T_ADMINISTRATIVO');
       // var otr = registro.filter( (x)=> x.tabla == 't_estudiante');
        cargar_registro_Estudiantes(est);
        cargar_registro_Cursos(curs);
        cargar_registro_Profesores(prof);
       
    },
        (error) => {
            alert(error.status);
        }
    );
}
function cargar_registro_Estudiantes(solicitudes) {
    $("#lista-registro-estudiantes").html("");
    
    solicitudes.forEach((element) => {
        llenar_registro_Estudiantes(element);
        
    });
    /*
                "columnDefs": [
            { "orderable": true, "targets": [0, 1, 2, 3, 4, 5] },
            { "orderable": false, "targets": [6] }
        ],
    */
    $('#table_estudiantes').DataTable({
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron talleres",
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
    $('#table_estudiantes_info').appendTo('#infoTable_estudiantes');
}
function cargar_registro_Cursos(solicitudes) {
    $("#lista_registro-cursos").html("");
    
    solicitudes.forEach((element) => {
        llenar_registro_Cursos(element);
        
    });
}
function cargar_registro_Profesores(solicitudes) {
    $("#lista_registro-profesores").html("");
    
    solicitudes.forEach((element) => {
        llenar_registro_Profesores(element);
        
    });
}
function cargar_registro_Otros(solicitudes) {
    $("#lista_registro-").html("");
    
    solicitudes.forEach((element) => {
        llenar_registro_(element);
        
    });

}
function llenar_registro_Estudiantes(data) {
    let id_registro = data.id;
    let usuario_registro = data.usuario;
    let ddl_registro = data.ddl;
    let descripcion_registro = data.descripcion;
    let fecha_registro = data.created_at;
    $("#lista-registro-estudiantes").append(
        "<tr>" +
        "<td>" +
        id_registro +
        " </td>" +
        "<td>" +
        usuario_registro +
        "</td>" +
        "<td>" +
        descripcion_registro +
        "</td>" +
        "<td>" +
        ddl_registro +
        "</td>" +
        "<td>" +
        fecha_registro +
        "</td>" +
        "</tr>"
    );
}
function llenar_registro_Cursos(solicitudes) {
    let id_registro = solicitudes.id;
    let usuario_registro = solicitudes.usuario;
    let ddl_registro = solicitudes.ddl;
    let descripcion_registro = solicitudes.descripcion;
    let fecha_registro = solicitudes.created_at;
    $("#lista_registro-cursos").append(
        "<tr>" +
        "<td>" +
        id_registro +
        " </td>" +
        "<td>" +
        usuario_registro +
        "</td>" +
        "<td>" +
        descripcion_registro +
        "</td>" +
        "<td>" +
        ddl_registro +
        "</td>" +
        "<td>" +
        fecha_registro +
        "</td>" +
        "</tr>"
    );
}
function llenar_registro_Profesores(solicitudes) {
    let id_registro = solicitudes.id;
    let usuario_registro = solicitudes.usuario;
    let ddl_registro = solicitudes.ddl;
    let descripcion_registro = solicitudes.descripcion;
    let fecha_registro = solicitudes.created_at;
    $("#lista_registro-profesores").append(
        "<tr>" +
        "<td>" +
        id_registro +
        " </td>" +
        "<td>" +
        usuario_registro +
        "</td>" +
        "<td>" +
        descripcion_registro +
        "</td>" +
        "<td>" +
        ddl_registro +
        "</td>" +
        "<td>" +
        fecha_registro +
        "</td>" +
        "</tr>"
    );
}
const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("DOMContentLoaded", loaded);