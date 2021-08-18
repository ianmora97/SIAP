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
    // ! on open
    $('#modalEditTaller').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var taller = g_mapTalleres.get(parseInt(id));

        var modal = $(this)
        modal.find('.modal-title').text('Taller #' + id)
        $('#idTallerModal').html(id)

        $('#descripcionModalTaller').val(taller.descripcion);
        $('#nivelModalTaller').val(taller.nivel);
        $('#costoestudianteModalTaller').val(taller.costo);
        $('#costofuncionarioModalTaller').val(taller.costo_funcionario);
    })
    $('#modalEditHoraio').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var horario = g_mapHorarios.get(parseInt(id));

        var modal = $(this)
        modal.find('.modal-title').text('Horario #' + id)
        $('#idHorarioModal').html(id)

        $('#diaeditarHorarioModal').val(horario.dia);
        $('#horaeditarHorarioModal').val(horario.hora);
    })
    $('#actualizarGrupo').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var grupo = g_mapGrupos.get(parseInt(id));
        
        var modal = $(this)
        modal.find('.modal-title').text('Grupo #' + id)
        $('#idGrupoModal').html(id)

        $('#horarioInputActualizar').val(grupo.id_horario);
        $('#talleresSelectGrupoActualizar').val(grupo.id_taller);
        $('#profesoresSelectGrupoActualizar').val(grupo.id_profesor);
        
        $('#cupobaseActualizarModal').val(grupo.cupo_base);
        $('#cupoExtraActualizarModal').val(grupo.cupo_extra);
        $('#periodoActualizarModal').val(grupo.periodo);


    })
    // ! on close
    $('#modalEditHoraio').on('hide.bs.modal', function (event) {
        $('#feedbackHorarioEditar').html('')
    })
    $('#agregarHorario').on('hide.bs.modal', function (event) {
        $('#feedbackHorarioAgregar').html('')
    })

    $('#agregarTaller').on('hide.bs.modal', function (event) {
        $('#feedback').html('')
    })
    $('#modalEditTaller').on('hide.bs.modal', function (event) {
        $('#feedbackEditarTaller').html('')
    })
    
    $('#agregarGrupo').on('hide.bs.modal', function (event) {
        $('#feedbackAgregarGrupo').html('')
    })
    $('#actualizarGrupo').on('hide.bs.modal', function (event) {
        $('#feedbackActualizarGrupo').html('')
        $('#toogleFormActualizar').show();
    })
}
// ? ------------------------------------- Horario CRUD ------------------------------

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

// ? ------------------------------------- Taller CRUD ------------------------------
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
    let id = $('#idTallerModal').html();
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
    let id = parseInt($('#idTallerModal').text());
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
        if(response.fb == "good"){
            location.href = "/admin/talleres";
        }
        if(response.fb.code.match('ER_ROW_IS_REFERENCED')){
            $('#feedbackEditarTaller').html('')
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
// ? ------------------------------------- Grupo CRUD ------------------------------
function agregarGrupo() {
    let horario = parseInt($('#horarioSelectGrupo').val());
    let profesor = parseInt($('#profesoresSelectGrupo').val());
    let taller = parseInt($('#talleresSelectGrupo').val());
    let cupobase = parseInt($('#cupobaseAgregarModal').val());
    let cupoextra = parseInt($('#cupoExtraAgregarModal').val());
    let periodo = $('#periodoAgregarModal').val();

    let bearer = 'Bearer '+g_token;
    if(horario && profesor && taller && cupobase && cupoextra && periodo) {
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarGrupo", 
            data:{horario,profesor,taller,cupobase,cupoextra,periodo},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedbackAgregarGrupo').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedbackAgregarGrupo').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un grupo con .
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
    }else{
        $('#feedbackAgregarGrupo').html('')
        $('#feedbackAgregarGrupo').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosGrupo() {
    let id = $('#idGrupoModal').html();
    let horario = parseInt($('#horarioInputActualizar').val());
    let taller = parseInt($('#talleresSelectGrupoActualizar').val());
    let profesor = parseInt($('#profesoresSelectGrupoActualizar').val());
    let cupobase = parseInt($('#cupobaseActualizarModal').val());
    let cupoextra = parseInt($('#cupoExtraActualizarModal').val());
    let periodo = $('#periodoActualizarModal').val();

    let bearer = 'Bearer '+g_token;
    if(horario && profesor && taller && cupobase && cupoextra && periodo) {
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarGrupo", 
            data:{id,horario,profesor,taller,cupobase,cupoextra,periodo},
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
function eliminarGrupo() {
    $('#toogleFormActualizar').hide();
    $('#feedbackActualizarGrupo').html('')
    $('#feedbackActualizarGrupo').append(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Existen estudiantes matriculados en este grupo, o reposiciones asociadas a este 
            grupo. <strong>¿Desea eliminar definitivamente las 
            matriculas y todo lo asociado a este grupo?</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);
    $('#feedbackActualizarGrupo').append(`
        <div class="mx-auto">
            <small class="text-muted">Al eliminar todas las referencias a este grupo, pueden existir inconsistencias en el sistema. 
            Es recomendable primero eliminar todo lo que este asociado a este grupo.</small><br>
            <button type="button" class="btn btn-sm btn-warning" onclick="eliminarDefGrupo()">
                Eliminar definitivamente
            </button>
            <button type="button" class="btn btn-sm btn-danger" onclick="cancelarEliminarGrupo()">
                Cancelar
            </button>
        </div>
    `)
}
function cancelarEliminarGrupo() {
    $('#toogleFormActualizar').show();
    $('#feedbackActualizarGrupo').html('');
}
function eliminarDefGrupo() {
    let id = $('#idGrupoModal').html();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarGrupo", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/talleres";
    }, (error) => {
    });
}

// ! ---------------------------------------- CRUD ------------------------------
function loadFromDb() {
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getProfesores", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((profesores) => {
        selectProfesoresFromGrupo(profesores);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getTalleres", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        $('#talleres_stats').html(talleres.length)
        showTalleres(talleres);
        selectTallerFromGrupo(talleres);
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getHorarios", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((horarios) => {
            $('#horarios_stats').html(horarios.length)
            showHorarios(horarios);
            selectHorarioFromGrupo(horarios);
            $.ajax({
                type: "GET",
                url: "/admin/talleres/getGrupos", 
                contentType: "appication/json",
                headers:{
                    'Authorization':bearer
                }
            }).then((grupos) => {
                $('#grupos_stats').html(grupos.length)
                let totalTime = new Date().getTime() - ajaxTime;
                let a = Math.ceil(totalTime / 1000);
                let t = a == 1 ? a + ' segundo' : a + ' segundos';
                $('#infoTiming').text(t);
                showGrupos(grupos);
                fillCalendar(grupos);
            }, (error) => {
            });
        }, (error) => {
        });

    }, (error) => {
    });
    
}
function selectProfesoresFromGrupo(profesores) {
    profesores.forEach(e => {
        $('#profesoresSelectGrupo').append(`
            <option value="${e.id_profesor}">${e.nombre} ${e.apellido} - ${e.cedula}</option>
        `)
    });
    profesores.forEach(e => {
        $('#profesoresSelectGrupoActualizar').append(`
            <option value="${e.id_profesor}">${e.nombre} ${e.apellido} - ${e.cedula}</option>
        `)
    });
}
function selectTallerFromGrupo(talleres) {
    talleres.forEach(e => {
        $('#talleresSelectGrupo').append(`
            <option value="${e.id}">${e.descripcion} Nivel: ${e.nivel}</option>
        `)
    });
    talleres.forEach(e => {
        $('#talleresSelectGrupoActualizar').append(`
            <option value="${e.id}">${e.descripcion} Nivel: ${e.nivel}</option>
        `)
    });
}
function selectHorarioFromGrupo(horarios) {
    horarios.forEach(e => {
        $('#horarioSelectGrupo').append(`
            <option value="${e.id}">${e.dia} ${e.hora}</option>
        `)
    });
    horarios.forEach(e => {
        $('#horarioInputActualizar').append(`
            <option value="${e.id}">${e.dia} ${e.hora}</option>
        `)
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
          <span class="button-circle" role="button" data-id="${e.id}" data-toggle="modal" data-target="#modalEditTaller">
              <i class="fas fa-ellipsis-v"></i>
          </span>
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
        <td class="text-center">
          <span class="button-circle" role="button" data-id="${e.id}" data-toggle="modal" data-target="#modalEditHoraio">
              <i class="fas fa-ellipsis-v"></i>
          </span>
        </td>
    </tr>
    `);
}
function createRowGrupos(e) {
    let h = g_mapHorarios.get(e.id_horario);
    let p = e.nombre + e.apellido;
    $('#grupos_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td style="line-height: 1.5;" class="text-center">${e.id_grupo}</td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div><strong>Dia: </strong>${h.dia}</div>
                <div><strong>Hora: </strong>${h.hora}:00</div>
            </div>
        </td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div>${p}</div>
                <div><strong>${e.cedula}</strong></div>
            </div>
        </td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div>${e.descripcion}(N:${e.nivel})</div>
                <div><strong>${e.codigo_taller}</strong></div>
            </div>
        </td>
        <td style="line-height: 1.5;">${e.cupo_actual}/${e.cupo_base}</td>
        <td style="line-height: 1.5;">${e.cupo_extra}</td>
        <td class="text-center">
          <span class="button-circle" role="button" data-id="${e.id_grupo}" data-toggle="modal" data-target="#actualizarGrupo">
              <i class="fas fa-ellipsis-v"></i>
          </span>
        </td>
    </tr>
    `);
}
function toWeekDay(dia) {
    switch (dia) {
        case 'LUNES':
            return 1;
        case 'MARTES':
            return 2;
        case 'MIERCOLES':
            return 3;
        case 'JUEVES':
            return 4;
        case 'VIERNES':
            return 5;
        case 'SABADO':
            return 6;
        case 'SÁBADO':
            return 6;
        case 'DOMINGO':
            return 7;
        default:
            break;
    }
}
function fillCalendar(grupos) {
    grupos.forEach(e => {
        let p = e.nombre + e.apellido;
        let id_matricula = e.id_matricula;
        let grupo = e.id_grupo;
        let codigo = e.codigo_taller;
        let descripcion = e.descripcion;
        // let titulo = e.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
        let dia = e.dia;
        let hora = e.hora > 12 ? e.hora - 12 + 'pm' : e.hora + 'am';
        let horaF = e.hora > 12 ? e.hora - 12 +':00': e.hora +':00' ;
        let horaFi = e.hora > 12 ? e.hora - 11 +':00': e.hora + 1 +':00' ;
        let weekday = toWeekDay(dia.toUpperCase());
        
        let todo = `Profesor: ${p} <br>${dia}: ${e.hora}`;
        let horainicio = e.hora + ":00";
        let horafinal = (e.hora + 1) + ":00";

        
        $('#calendar').fullCalendar('renderEvent', {
            title: descripcion,
            description: todo,
            start: horainicio,
            end: horafinal,
            dow: [ weekday ], 
            className: 'fc-bg-default',
            icon : "swimmer"
        });
    })
   
}

document.addEventListener("DOMContentLoaded", loaded);