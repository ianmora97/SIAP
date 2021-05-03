/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro

    * Javascript de Talleres
*/
var g_mapTalleres = new Map();
var g_mapHorarios = new Map();
var g_mapGrupos = new Map();
var g_mapProfesores = new Map();

function loaded(event){
    events(event);
}

function events(event){
    loadFromDb();
    openModal();
    toogleMenu();
}
function toogleMenu() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        //$('#sidebar-wrapper').css('position','relative');
        $("#wrapper").toggleClass("toggled");
        //$("#side-panel").css('margin-left','-12px');
        //$("#sidebar-wrapper").toggle("'slide', {direction: 'right' }, 1000");
        //$("#sidebar-wrapper").css({'transform': 'translate(-13rem, 0px)'});
        //$("#sidebar-wrapper").animate({left:'-200'},1000);
    });
}
$(function () {
    $('[data-toggle="popover"]').popover();
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

function searchonfind(barra) {
    let bar = $(barra);
    switch (bar.data('type')) {
        case 'talleres':
            var table = $('#talleres_table').DataTable();
            let val = bar.val();           
            let result = table.search( val ).draw();
            break;
        case 'horarios':
            console.log('horarios')
            break;
        case 'grupos':
            console.log('grupos')
            break;
        default:
            break;
    }
    
}
function actualizarDatos() {
    let table = $('#talleres_table').DataTable();
    table.destroy();
    let table1 = $('#talleres_table').DataTable();
    table1.destroy();
    let table2 = $('#talleres_table').DataTable();
    table2.destroy();
    loadFromDb();
}
function openModal(){
    $('#modalEditTaller').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var taller = g_mapTalleres.get(parseInt(id));

        var modal = $(this)
        modal.find('.modal-title').text('Taller #' + id)
        $('#idTallerModal').val(id)
        $('#descripcionModalTaller').val(taller.descripcion);
        $('#nivelModalTaller').val(taller.nivel);
        $('#costoestudianteModalTaller').val(taller.costo);
        $('#costofuncionarioModalTaller').val(taller.costo_funcionario);
    })
}
function actualizarDatosTaller() {
    let id = $('#idTallerModal').val();
    let descripcion =  $('#descripcionModalTaller').val();
    let nivel = $('#nivelModalTaller').val();
    let costo = $('#costoestudianteModalTaller').val();
    let costo_funcionario = $('#costofuncionarioModalTaller').val();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/actualizarGrupo", 
        data:{id,descripcion,nivel,costo,costo_funcionario},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/talleres";
    }, (error) => {
    });
}
function loadFromDb() {
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getTalleres", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        showTalleres(response);
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getHorarios", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            showHorarios(response);
            $.ajax({
                type: "GET",
                url: "/admin/talleres/getGrupos", 
                contentType: "appication/json",
                headers:{
                    'Authorization':bearer
                }
            }).then((response) => {
                showGrupos(response);
            }, (error) => {
            });
        }, (error) => {
        });

    }, (error) => {
    });
    
}

function showTalleres(data) {
    data.forEach(e => {
        g_mapTalleres.set(e.id, e);
    });
    data.forEach(e => {
        createRowTalleres(e)
    });
    $('#talleres_table').DataTable({
        "columnDefs": [
            { "orderable": true, "targets": [0, 1, 2, 3, 4, 5] },
            { "orderable": false, "targets": [6] }
        ],
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
    $('#talleres_table_length').find('select').removeClass('custom-select-sm');
    $('#talleres_table_length').find('select').appendTo('#lenghtTable_talleres');
    $('#talleres_table_length').html('');
    $('#talleres_table_info').appendTo('#infoTable_talleres');
    $('#talleres_table_paginate').appendTo('#botonesTable_talleres');
    $('#talleres_table_filter').html('');
}
function showHorarios(data) {
    data.forEach(e => {
        g_mapHorarios.set(e.id, e);
    });
    data.forEach(e => {
        createRowHorarios(e)
    });
    $('#horarios_table').DataTable({
        "columnDefs": [
            { "orderable": true, "targets": [0, 1, 2] },
            { "orderable": false, "targets": [3] }
        ],
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron horarios",
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
    $('#horarios_table_length').find('select').removeClass('custom-select-sm');
    $('#horarios_table_length').find('select').appendTo('#lenghtTable_horarios');
    $('#horarios_table_length').html('');
    $('#horarios_table_info').appendTo('#infoTable_horarios');
    $('#horarios_table_paginate').appendTo('#botonesTable_horarios');
    $('#horarios_table_filter').html('');
}
function showGrupos(data) {
    data.forEach(e => {
        g_mapGrupos.set(e.id_grupo, e);
    });
    data.forEach(e => {
        createRowGrupos(e)
    });
    $('#grupos_table').DataTable({
        "columnDefs": [
            { "orderable": true, "targets": [0, 1, 2] },
            { "orderable": false, "targets": [3] }
        ],
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron grupos",
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
    $('#grupos_table_length').find('select').removeClass('custom-select-sm');
    $('#grupos_table_length').find('select').appendTo('#lenghtTable_grupos');
    $('#grupos_table_length').html('');
    $('#grupos_table_info').appendTo('#infoTable_grupos');
    $('#grupos_table_paginate').appendTo('#botonesTable_grupos');
    $('#grupos_table_filter').html('');
}
function createRowTalleres(e) {
    $('#talleres_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td>${e.id}</td>
        <td>${e.codigo}</td>
        <td>${e.descripcion}</td>
        <td>${e.nivel}</td>
        <td>${e.costo}</td>
        <td>${e.costo_funcionario}</td>
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-primary" 
            data-id="${e.id}" data-toggle="modal" data-target="#modalEditTaller" >
                Editar <span class="badge badge-light"><i class="fas fa-pen"></i></span>
            </button>
        </td>
    </tr>
    `);
}
function createRowHorarios(e) {
    $('#horarios_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td>${e.id}</td>
        <td class="text-center">${e.dia}</td>
        <td class="text-center">${e.hora}:00</td>
        <td class="text-right">
            <button type="button" class="btn btn-sm btn-primary" 
            data-id="${e.id}" data-toggle="modal" data-target="#modalEditHorario" >
                Editar <span class="badge badge-light"><i class="fas fa-pen"></i></span>
            </button>
        </td>
    </tr>
    `);
}
function createRowGrupos(e) {
    let h = g_mapHorarios.get(e.id_horario);
    console.log(h,e.id_horario)
    let p = e.nombre + e.apellido;
    $('#grupos_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td>${e.id_grupo}</td>
        <td>
            <div class="d-flex flex-column">
                <div><strong>Dia: </strong>${h.dia}</div>
                <div><strong>Hora: </strong>${h.hora}:00</div>
            </div>
        </td>
        <td>
            <div class="d-flex flex-column">
                <div>${p}</div>
                <div><strong>${e.cedula}</strong></div>
            </div>
        </td>
        <td>
            <div class="d-flex flex-column">
                <div>${e.descripcion}(N:${e.nivel})</div>
                <div><strong>${e.codigo_taller}</strong></div>
            </div>
        </td>
        <td>${e.cupo_actual}/${e.cupo_base}</td>
        <td>${e.cupo_extra}</td>
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-primary" 
            data-id="${e.id}" data-toggle="modal" data-target="#modalEditGrupo" >
                Editar <span class="badge badge-light"><i class="fas fa-pen"></i></span>
            </button>
        </td>
    </tr>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);