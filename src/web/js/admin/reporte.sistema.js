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
        
        
        cantidad_administrativos
        $('#cantidad_administrativos').html(solicitudes.length);
       
    },
        (error) => {
            alert(error.status);
        }
    );



}
var registro = [];
function cargar_registros() {
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/registro/sistema",
        //url: "/admin/estudiante/getTalleres",
        
        contentType: "application/json",
    }).then((solicitudes) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        registro = solicitudes;
        var est = registro.filter( (x)=> x.tabla == 't_estudiante');
        var curs = registro.filter( (x)=> x.tabla == 't_grupo');
        var prof = registro.filter( (x)=> x.tabla == 't_profesor');
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
    console.log(solicitudes);
    solicitudes.forEach((solicitudes) => {
        llenar_registro_Estudiantes(solicitudes);
        
    });
}
function cargar_registro_Cursos(solicitudes) {
    $("#lista_registro-cursos").html("");
    console.log(solicitudes);
    solicitudes.forEach((solicitudes) => {
        llenar_registro_Cursos(solicitudes);
        
    });
}
function cargar_registro_Profesores(solicitudes) {
    $("#lista_registro-profesores").html("");
    console.log(solicitudes);
    solicitudes.forEach((solicitudes) => {
        llenar_registro_Profesores(solicitudes);
        
    });
}
function cargar_registro_Otros(solicitudes) {
    $("#lista_registro-").html("");
    console.log(solicitudes);
    solicitudes.forEach((solicitudes) => {
        llenar_registro_(solicitudes);
        
    });
}
function llenar_registro_Estudiantes(solicitudes) {
    let id_registro = solicitudes.id;
    let usuario_registro = solicitudes.usuario;
    let ddl_registro = solicitudes.ddl;
    let descripcion_registro = solicitudes.descripcion;
    let fecha_registro = solicitudes.created_at;
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