/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro

    * Javascript de Casilleros
*/
var listaEstudiantes = [];
var listaCasilleros = [];

function loaded(event){
    events(event);
}

function events(event){
    loadFromDb();
    openModalAdd();
}
$(function () {
    $('[data-toggle="popover"]').popover()
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
function openModalAdd(){
    $('#modalButtonAgregarEstudiante').on('click',function(){
        $('#modalAgregarEstudiante').modal('show')
        animateCSS("#modalAgregarEstudiante",'fadeInUpBig')
    })
    $('#closeModalAgregar').on('click',function(){
        animateCSS("#modalAgregarEstudiante",'fadeOutDownBig').then(()=>{
            $('#modalAgregarEstudiante').modal('hide')
        })
    })
    $('#modalAgregarEstudiante').on('hidePrevented.bs.modal', function (event) {
        animateCSS("#modalAgregarEstudiante",'shakeX')
    })
}

function loadFromDb() {
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/bringCasilleros",
        contentType: "application/json"
    }).then((response) => {
        console.log(response)
        cargarMatrizCasilleros(response)
    }, (error) => {

    });
}
function cargarMatrizCasilleros(data) {
    let cont = 0;
    $('#casillerosMatrix').html('');
    $('#totalCasilleros_stats').html(data.length);
    for (let i = 0; i < Math.ceil( data.length / 12); i++) {
        $('#casillerosMatrix').append(`<div class="row w-100 no-gutters mb-2" id="filaCasillero_${i}">`);
        for (let j = 0; j < 12; j++) {
            $(`#filaCasillero_${i}`).append(
                `<div class="col-md">
                    <div class="casilleroFormat ${data[cont].estado ? 'ocupado' :'libre'}" data-codigo="${data[cont].codigo}"
                    data-toggle="popover" data-placement="right" data-container="body" data-trigger="focus" title="Asignar Casillero" data-content="un dropdown" role="button">
                        <div>${data[cont].codigo}</div>
                        <div class="text-white text-right">${data[cont].estado ? '<i class="fas fa-lock-open"></i>' : '<i class="fas fa-lock"></i>'}</div>
                    </div>
                </div>
                `
            );
            cont++;
        }
        $('#casillerosMatrix').append(`</div>`);
    }
}
function showMatrizCasilleros(c) {
    let cedula = c.id;
    let nombre = c.codigo;

    $('#dataListUsuariosNuevos').append(
        '<tr>'+
        '<td><span class="rounded-circle p-2 text-white mr-2" style="background:'+color+';">'+iniciales+'</span></td>'+
        '<td>'+cedula+'</td>'+
        '<td>'+nombre+'</td>'+
        '<td>'+tipo+'</td>'+
        '<td>'+registro+'</td>'+
        '</tr>'
    );
}
document.addEventListener("DOMContentLoaded", loaded);