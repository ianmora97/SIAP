
var g_contAusentes = 0;
var g_mediaEstudiantes = 0; //cantidad de estudiantes ausentes / estudiantes totales(matriculados) * 100

var navCreateGroups = (item,i) =>{
    let c = item.cupo_actual;
    return `<a class="nav-link-casilleros ${!i ? 'active':''}" id="nav-grupoid-${item.id_grupo}-tab" 
    data-toggle="tab" href="#nav-grupoid-${item.id_grupo}" role="tab" aria-controls="nav-grupoid-${item.id_grupo}" 
    aria-selected="true">Grupo ${item.id_grupo} &nbsp; <span class="badge badge-primary">${c == 1? c+' estudiante': c+' estudiantes'}</span></a>`;
}

var tableCreateGroups = (item,i)=>{
        return `
        <div class="tab-pane fade ${!i ? 'show active': ''}" id="nav-grupoid-${item.id_grupo}" role="tabpanel" aria-labelledby="nav-grupoid-${item.id_grupo}-tab">
            <div class="card-body px-2 py-2">
                <div class="row bg-light mx-auto rounded-lg justify-content-between py-1 mb-1">
                    <div class="col-md-6 pl-1 pr-0">
                        <div class="input-group flex-nowrap">
                            <div class="input-group-prepend">
                                <button class="btn bg-white" type="button" id="button_search_grupo${item.id_grupo}"><i class="fas fa-search"></i></button>
                            </div>
                            <input type="search" class="form-control border-0 shadow-none bg-white" 
                            onkeyup="searchonfind(${item.id_grupo})" placeholder="Buscar..." aria-label="Username" id="barraBuscar_grupo${item.id_grupo}">
                        </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-around px-0">
                        <div class="row no-gutters px-0 w-100 d-flex justify-content-between">
                            <div class="col-5 d-flex align-items-center">
                                <div id="showlenghtentries_grupo${item.id_grupo}" class="d-flex align-items-center m-0"></div>
                            </div>
                            <div class="col-7 d-flex align-items-center justify-content-end pr-2" style="max-height: 40px">
                                <button type="button" name="actualizar_lista" id="actualizar_lista_grupo${item.id_grupo}" 
                                data-toggle="tooltip" data-placement="top" title="Actualizar lista"
                                class="btn bg-white btn-sm" style="border-radius: 50px;"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row w-100 mx-0" style="height: 65vh; overflow-y: auto;">
                    <table class="table custom-table table-responsive-md table-borderless" id="grupo${item.id_grupo}_asistencia_Table" data-order="[[ 2, &quot;asc&quot; ]]">
                        <thead>
                            <tr>
                                <th class="bg-dark text-white sticky-top " style="width: 40px;" scope="col">&nbsp;</th> <!--Aqui va la foto-->
                                <th class="bg-dark text-white sticky-top" scope="col"><i class="fas fa-address-card"></i> Cedula</th>
                                <th class="bg-dark text-white sticky-top" data-class-name="priority" scope="col"><i class="fas fa-id-card"></i> Nombre</th>
                                <th class="bg-dark text-white sticky-top" scope="col"><i class="fas fa-calendar-alt"></i> Fecha</th>
                                <th class="bg-dark text-white sticky-top" scope="col"><i class="fas fa-list"></i> Estado</th>
                                <th class="bg-dark text-white sticky-top" scope="col"><i class="fas fa-user"></i> Profesor</th>
                                <th class="bg-dark text-white sticky-top" scope="col">&nbsp;</th> <!--Aqui va el edit-->
                            </tr>
                            </thead>
                            <tbody id="lista_asistencia_grupo${item.id_grupo}">

                            </tbody>
                    </table>
                    <div class="d-flex align-items-center align-self-end border-info w-100">
                        <div class="row w-100 ml-0">
                            <div class="col-md-6 d-flex justify-content-start text-muted pl-0" >
                                <small id="informacionTable_grupo${item.id_grupo}" class="d-flex align-items-end"></small>
                            </div>
                            <div class="col-md-6 d-flex justify-content-end" id="botonesCambiarTable_grupo${item.id_grupo}">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
}
function toogleMenu() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}
const animateCSS = (element, animation) =>
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

function loaded(event){
    events(event);
}

function events(event){
    bringData();
    toogleMenu();
}
function searchonfind(num) {
    var table = $(`#grupo${num}_asistencia_Table`).DataTable();
    let val = $(`#barraBuscar_grupo${num}`).val();           
    let result = table.search( val ).draw();
    
}
var g_grupos = [];
function bringData(){
    $.ajax({
        type: "GET",
        url: "/admin/reportes/asistencia/getGrupos",
        contentType: "application/json"
    }).then((response) => {
        g_grupos = response;
        fillNavTabs(response);
    }, (error) => {
    });
}
function bringDataAsistencia(){
    $.ajax({
        type: "GET",
        url: "/admin/reportes/asistencia/getAsistencia",
        contentType: "application/json"
    }).then((response) => {
        console.log(response)
        filltableGroups(response);
    }, (error) => {
        console.log('error ajax')
    });
}
var g_cantidadEstudiantes =0;
function fillNavTabs(data) {
    $('#grupos-tab').html('');
    data.forEach((g,i)=>{
        if(g.estado == 'Ausente'){
            g_contAusentes++;
        }
        showTabsNavBarGroups(g,i);
        g_cantidadEstudiantes += g.cupo_actual;
    });
    g_mediaEstudiantes = (g_cantidadEstudiantes - (g_contAusentes/g_cantidadEstudiantes));
    $('#estudiantes_ausentes_stats').html(g_contAusentes);
    $('#estudiantes_media_stats').html(g_mediaEstudiantes+'<small>%</small>');
    $('#estudiantes_total_stats').html(g_cantidadEstudiantes);
    bringDataAsistencia();
}
function runDatatables() {
    g_grupos.forEach((g)=>{
        $(`#grupo${g.id_grupo}_asistencia_Table`).DataTable({
            stateSave: true,
            "language": {
                "zeroRecords": "No se encontraron estudiantes",
                "infoEmpty": "No hay registros disponibles!",
                "infoFiltered": "(filtrado de _MAX_ registros)",
                "lengthMenu": "Mostrar _MENU_ registros",
                "info": "Mostrando pagina _PAGE_ de _PAGES_",
                "paginate": {
                    "first":    '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-double-left"></i></button>',
                    "previous": '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-left"></i></button>',
                    "next":     '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-right"></i></button>',
                    "last":     '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-double-right"></i></button>'
                },
                "aria": {
                    "paginate": {
                        "first":    'Primera',
                        "previous": 'Anterior',
                        "next":     'Siguiente',
                        "last":     'Última'
                    }
                }
            }
        });
        $(`#grupo${g.id_grupo}_asistencia_Table_length`).css('display','none');
        $(`#grupo${g.id_grupo}_asistencia_Table_filter`).css('display','none');

        $(`#grupo${g.id_grupo}_asistencia_Table_info`).appendTo(`#informacionTable_grupo${g.id_grupo}`);
        $(`#grupo${g.id_grupo}_asistencia_Table_paginate`).appendTo(`#botonesCambiarTable_grupo${g.id_grupo}`);
    })
    
}
function showTabsNavBarGroups(data,i){
    $('#grupos-tab').append(navCreateGroups(data,i));
    $('#nav-tabContent').append(tableCreateGroups(data,i));
}

function filltableGroups(data) {
    data.forEach((g,i)=>{
        showRowsOntablesgroup(g,i);
    });
    runDatatables();
}
function showRowsOntablesgroup(data,i) {
    let foto = '<img src="/public/uploads/'+data.foto+'" class="rounded-circle" width="30px" height="30px">';
    $(`#lista_asistencia_grupo${data.id_grupo}`).append(`
        <tr class="align-middle">
            <td class="text-center">${foto}</td>
            <td class="align-middle">${data.cedula}</td>
            <td class="align-middle">${data.nombre.toUpperCase()  + ' ' + data.apellido.toUpperCase() }</td>
            <td class="align-middle">${data.fecha}</td>
            <td class="align-middle"><button class="w-75 btn btn-sm btn-${data.estado == 'Presente'? 'success': data.estado == 'Ausente' ? 'danger' : 'warning'}">${data.estado}</button></td>
            <td class="align-middle">${data.profesor}</td>
            <td class="align-middle"><a href="/admin/reposiciones" class="btn btn-dark btn-sm"><i class="fas fa-edit"></i> Reponer Clase</a></td>
        </tr>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);