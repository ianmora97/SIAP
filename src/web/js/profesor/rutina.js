var g_grupos = [];

function loaded(event){
    events(event);
}

function events(event){
    bringDB();
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

function enviarRutina() {
    let bearer = 'Bearer '+g_token;
    let profesor = parseInt($('#id_profesor').text());
    let grupo = parseInt($('#selectDropdownGrupos option:selected').val());
    let texto = $('#textoRutina').val();
    let data = {
        profesor, 
        grupo, 
        texto,
    }
    $.ajax({
        type: "GET",
        url: "/profesor/rutina/crear",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        bringDB();
        $('#feedback').append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Rutina creada!</strong> Revise las rutinas para visualizar todas sus rutinas.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `)
    }, (error) => {
        console.log(error);
    });
}

function bringDB() {
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let id = parseInt($('#id_profesor').text());
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/rutinas/getGrupos",
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
        url: "/profesor/rutinas/ver",
        data: {id},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        console.log(response);
        verListRutina(response);
    }, (error) => {
    });
}

function verListRutina(data) {
    $('#listaRutinas').html('');
    if(data.length){
        data.forEach((e)=>{
            mostrarItemRutina(e);
        })
    }else{
        
    }
}
function mostrarItemRutina(r) {
    let fecha = r.fecha.split(' ')[0];
    let hora = r.fecha.split(' ')[1].slice(0,5);
    $('#listaRutinas').append(`
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <button type="button" class="btn btn-info btn-sm">
                    Rutina <span class="badge badge-light">Grupo: ${r.id_grupo}</span>
                </button>
                <small class="text-muted">Fecha de creacion: ${fecha}</small>
            </div>
            <p class="my-2">${r.texto}</p>
            <small>${r.dia} - ${r.hora}</small>
        </a>
    `);
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

function showGrupoOption(g) {
    let id = g.id_grupo;
    let dia = g.dia;
    let hora = g.hora > 12 ? g.hora - 12 + 'pm' : g.hora + 'am';
    let nivel = g.descripcion;
    $('#selectDropdownGrupos').append(`
        <option value="${id}">Grupo #${id} - ${dia + ' ' + hora} : ${nivel}</option>
    `);
}
function filtrarCuposActuales(data) {
    return data.filter(e => e.cupo_actual != 0);
}



document.addEventListener("DOMContentLoaded", loaded);