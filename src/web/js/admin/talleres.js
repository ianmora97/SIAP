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

function openmodal(modal) {
    $(modal).modal('show');
}

function searchonfind(barra) {
    let bar = $(barra);
    switch (bar.data('type')) {
        case 'talleres':
            var table1 = $('#talleres_table').DataTable();
            let val1 = bar.val();           
            let result1 = table1.search( val1 ).draw();
            break;
        case 'horarios':
            var table2 = $('#horarios_table').DataTable();
            let val2 = bar.val();           
            let result2 = table2.search( val2 ).draw();
            break;
        case 'grupos':
            var table3 = $('#grupos_table').DataTable();
            let val3 = bar.val();           
            let result3 = table3.search( val3 ).draw();
            break;
        default:
            break;
    }
    
}
function actualizarDatos() {
    let table = $('#talleres_table').DataTable();
    table.destroy();
    let table1 = $('#horarios_table').DataTable();
    table1.destroy();
    let table2 = $('#grupos_table').DataTable();
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
    $('#modalEditHoraio').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var horario = g_mapHorarios.get(parseInt(id));
        console.log(horario);
        var modal = $(this)
        modal.find('.modal-title').text('Horario #' + id)
        $('#idHorarioModal').html(id)

        $('#diaeditarHorarioModal').val(horario.dia);
        $('#horaeditarHorarioModal').val(horario.hora);
    })
}
function agregarHorario() {
    let dia = $('#diaAgregarHorarioModal').val();
    let hora = parseInt($('#horaAgregarHorarioModal').val());
    let bearer = 'Bearer '+g_token;
    if(dia && hora){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarHorario", 
            data:{dia,hora},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedbackHorarioAgregar').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedbackHorarioAgregar').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un horario con ${dia + ' ' + hora}.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
        console.log('lleno');
    }else{
        $('#feedbackHorarioAgregar').html('')
        $('#feedbackHorarioAgregar').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosHorario() {
    let id = $('#idHorarioModal').html();
    let dia = $('#diaeditarHorarioModal').val();
    let hora = parseInt($('#horaeditarHorarioModal').val());
    let bearer = 'Bearer '+g_token;
    if(dia && hora){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarHorario", 
            data:{id,dia,hora},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/talleres";
        }, (error) => {
        });
    }else{
        $('#feedbackHorarioEditar').html('');
        $('#feedbackHorarioEditar').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function eliminarHorario() {
    let id = $('#idHorarioModal').html();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarHorario", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.fb == "good"){
            location.href = "/admin/talleres";
        }else{
            $('#feedbackHorarioEditar').html('');
            if(response.fb.code.match('ER_ROW_IS_REFERENCED')){
                $('#feedbackHorarioEditar').append(`
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Existe un grupo con este Horario debe 
                        eliminar primero el grupo antes de eliminar el horario.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
            }
        }
    }, (error) => {
    });
}

// ? -----------------Taller CRUD----------
function agregarTaller() {
    let codigo = $('#codigoTallerModalAgregar').val();
    let descripcion = $('#descripcionTallerModalAgregar').val();
    let nivel = parseInt($('#nivelTallerModalAgregar').val());
    let costoEst = parseInt($('#costoEstTallerModalAgregar').val());
    let costoFun = parseInt($('#costoFunTallerModalAgregar').val());
    let bearer = 'Bearer '+g_token;
    if(codigo && descripcion && nivel && costoEst && costoFun){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarTaller", 
            data:{codigo,descripcion,nivel,costoEst,costoFun},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedback').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedback').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un codigo con ${codigo}.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
        console.log('lleno');
    }else{
        $('#feedback').html('')
        $('#feedback').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosTaller() {
    let id = $('#idTallerModal').val();
    let descripcion =  $('#descripcionModalTaller').val();
    let nivel = $('#nivelModalTaller').val();
    let costo = $('#costoestudianteModalTaller').val();
    let costo_funcionario = $('#costofuncionarioModalTaller').val();
    let bearer = 'Bearer '+g_token;
    if(descripcion && nivel && costo && costo_funcionario){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarTaller", 
            data:{id,descripcion,nivel,costo,costo_funcionario},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/talleres";
        }, (error) => {
        });
    }else{
        $('#feedbackEditarTaller').html('')
        $('#feedbackEditarTaller').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function eliminarTaller() {
    let id = $('#idTallerModal').val();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarTaller", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#feedbackEditarTaller').html('')
        console.log();
        if(response.fb == "good"){
            location.href = "/admin/talleres";
        }
        if(response.fb.code.match('ER_ROW_IS_REFERENCED')){
            $('#feedbackEditarTaller').append(`
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Existe un grupo con este Taller, debe 
                    eliminar primero el grupo antes de eliminar el Taller.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);
        }
    }, (error) => {
    });
}
function loadFromDb() {
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getTalleres", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#talleres_stats').html(response.length)
        showTalleres(response);
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getHorarios", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            $('#horarios_stats').html(response.length)
            showHorarios(response);
            $.ajax({
                type: "GET",
                url: "/admin/talleres/getGrupos", 
                contentType: "appication/json",
                headers:{
                    'Authorization':bearer
                }
            }).then((response) => {
                $('#grupos_stats').html(response.length)
                let totalTime = new Date().getTime() - ajaxTime;
                let a = Math.ceil(totalTime / 1000);
                let t = a == 1 ? a + ' segundo' : a + ' segundos';
                $('#infoTiming').text(t);
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
            data-id="${e.id}" data-toggle="modal" data-target="#modalEditHoraio" >
                Editar <span class="badge badge-light"><i class="fas fa-pen"></i></span>
            </button>
        </td>
    </tr>
    `);
}
function createRowGrupos(e) {
    let h = g_mapHorarios.get(e.id_horario);
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