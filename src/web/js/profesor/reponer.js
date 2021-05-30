var g_grupos = [];
var g_profesores = [];

function loaded(event){
    events(event);
}

function events(event){
    bringDBAlt();

}

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    Swal.fire({
        title: 'Antes...',
        width: 600,
        html: `Debe cumplir con los siguientes puntos antes de hacer la repocicion:<br> <br>
        1. Hablar con el profesor de reposicion antes. <br>
        2. Hablar con un administrador antes de hacer la repocicion. <br>
        3. Solamente se pueden hacer repociciones los domingos o Lunes en la mañana. <br>
        `,
        icon:'info',
        confirmButtonText: 'Entendido',
        showClass: {
            popup: 'animate__animated animate__zoomIn'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut'
          }
    })
})

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

function enviarSolicitud() {
    let bearer = 'Bearer '+g_token;
    let idProfesor = parseInt($('#id_profesor').text());
    let grupo = parseInt($('#selectDropdownGrupos option:selected').val());
    let profesorRepo = parseInt($('#selectDropdownProfesores option:selected').val());
    let fecha = new Date();
    fecha = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate();
    let data = {
        idProfesor, 
        grupo, 
        profesorRepo,
        fecha
    }
    $.ajax({
        type: "GET",
        url: "/profesor/reponer/reponerClase",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        showSuccessSolicitud();

    }, (error) => {
        console.log(error);
    });
}

function bringDBAlt() {
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/grupos/getGrupos",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_grupos = response;
        eachGrupos(response);
    }, (error) => {
    });

    $.ajax({
        type: "GET",
        url: "/profesor/reponer/profesores",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_profesores = response;
        eachProfesores(response);
    }, (error) => {
    });
}

function eachGrupos(data) {
    if(data.length){
        let r = filtrarCuposActuales(data);
        r.forEach((e)=>{
            showGrupoOption(e);
        })
    }else{
        $('#selectDropdownGrupos').append(`
            <option value="0">Usted no tiene grupos actualmente</option>
        `);
    }
}
function eachProfesores(data) {
    let r = filtrarProfesor(data,$('#id_cedula').text())
    r.forEach((e)=>{
        showeachProfesoresOption(e);
    })
}

function showGrupoOption(g) {
    let id = g.id_grupo;
    let dia = g.dia;
    let hora = g.hora > 12 ? g.hora - 12 + 'pm' : g.hora + 'am';
    let nivel = g.descripcion;
    $('#selectDropdownGrupos').append(`
        <option value="${id}">Grupo #${id} - ${dia + ' ' + hora} : ${nivel}</option>
    `);
}

function showeachProfesoresOption(g) {
    let id = g.id_profesor;
    let idUs = g.id_usuario;
    let cedula = g.cedula;
    let nombre = g.nombre + ' ' + g.apellido;
    nombre = nombre.toUpperCase();

    $('#selectDropdownProfesores').append(`
        <option value="${id}">${nombre} - ${cedula}</option>
    `);
}
function filtrarCuposActuales(data) {
    return data.filter(e => e.cupo_actual != 0);
}
function filtrarProfesor(data,cedula){
    return data.filter(e => e.cedula != cedula)
}

function showSuccessSolicitud() {
    Swal.fire(
        'Solicitud Enviada',
        'Debe presentarse a la oficina para presentar el documento para justificar la ausencia.',
        'success'
    )
}



document.addEventListener("DOMContentLoaded", loaded);