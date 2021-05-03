var g_grupos = [];
var g_profesores = [];

function loaded(event){
    events(event);
}

function events(event){
    bringDB();

}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
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

function bringDB() {
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/grupos",
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
    let r = filtrarCuposActuales(data);
    r.forEach((e)=>{
        showGrupoOption(e);
    })
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