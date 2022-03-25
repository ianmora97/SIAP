moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function loaded(event){
    events(event);
}

function events(event){
    obtenerReposiciones();
    openModalComprobante();
    selecEstudianteAdd();
}
function openModal(modal) {
    $(modal).modal('show')
}

$(function () {
    $('[data-toggle="popover"]').popover();
})
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function searchonfind() {
    var table = $('#table').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
}

var g_vecAsistencias = [];
var g_vecGrupos = [];
var g_vecReposiciones = new Array();
var g_mapReposiciones = new Map();
var g_mapEstudiantes = new Map();

function obtenerReposiciones(){
    let bearer = 'Bearer '+g_token;
    let ajaxTime= new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/api/admin/reposiciones",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((reposiciones) => {
        g_vecReposiciones = reposiciones;
        listaReposiciones(reposiciones);
        $.ajax({
            type: "GET",
            url: "/admin/reportes/asistencia/getAsistencia",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((asistencias) => {
            let totalTime = new Date().getTime() - ajaxTime;
            let a = Math.ceil(totalTime/1000);
            let t = a == 1 ? a + ' segundo' : a + ' segundos';
            $('#infoTiming').text(t);
            g_vecAsistencias = asistencias;
        }, (error) => {
        });

        $.ajax({
            type: "GET",
            url: "/admin/reportes/asistencia/getGrupos",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((grupos) => {
            g_vecGrupos = grupos;
            listaGrupos(grupos);
        }, (error) => {
        });

        $.ajax({
            type: "GET",
            url: "/admin/estudiante/listaEstudiantes",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((estudiantes) => {
            listaEstudiantes(estudiantes);
            closeProgressBarLoader();
        }, (error) => {

        });
    });
}
function listaGrupos(data) {
    $('#grupoAddSelect').html('');
    $('#grupoAddSelect').append(`
        <option value="null" >Seleccione un Grupo</option>
    `)
    data.forEach(e => {
        let hora = e.hora < 10 ? '0'+e.hora : e.hora;
        $('#grupoAddSelect').append(`
            <option value="${e.id_grupo}">${e.dia} ${moment(`${hora}:00`,'HH:mm').format('LT')}</option>
        `)
    });
}
function selecEstudianteAdd() {
    $('#estudiantesAddSelect').on('change',function(){
        if($('#estudiantesAddSelect').val() != 'null'){
            let estudiante = g_mapEstudiantes.get(parseInt($('#estudiantesAddSelect').val()))
            let filt = g_vecAsistencias.filter(e => e.id_estudiante == parseInt($('#estudiantesAddSelect').val()))
            if(filt.length > 0){
                $("#escogerReposicion").slideToggle();
                buildRowListAusencia(filt)
            }else{
                $("#ausenciasAgregarReposicion").html(
                    `<div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Sin ausencias</h4>
                    <p>${estudiante.nombre + " " + estudiante.apellido} no presenta ausencias!</p>
                    <hr class="my-2">
                    <p class="my-2 d-inline mr-3">El estudiante necesita al menos de una ausencia para reponer la clase.</p>
                    <button class="btn btn-sm btn-warning d-inline" onclick="$('#escogerReposicion').slideToggle();">Solicitar Reposición</button>
                    
                    </div>`);
            }
        }else{
            $("#ausenciasAgregarReposicion").html("");
        }
    })
}
function buildRowListAusencia(data) {
    // filtro por ausencias
    let res = data.filter(e => e.estado == "Ausente");
    res.forEach(element => {
        showRowListAusencia(element)
    });
}

function showRowListAusencia(ele) {
    $('#ausenciasAgregarReposicion').append(`
        <a class="list-group-item list-group-item-action border-right-0 border-left-0">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1"><span class="badge badge-danger">Ausencia</span></h5>
                <small class="text-muted">${moment(ele.fecha,'DD-MM-YYYY-HH-mm').calendar()}</small>
            </div>
            <p class="mb-1">${ele.nombre} ${ele.apellido} 
            <br>Presenta una ausencia con ${ele.profesor}</p>
            <small class="text-muted">Grupo: ${ele.id_grupo}</small>
        </a>
    `)
}
function listaEstudiantes(data){
    $('#estudiantesAddSelect').html('');
    
    $('#estudiantesAddSelect').append(`
        <option value="null" id="valorreposicionulo">Seleccione un estudiante</option>
    `)
    data.forEach(e => {
        g_mapEstudiantes.set(e.id_estudiante,e);
        $('#estudiantesAddSelect').append(`
            <option value="${e.id_estudiante}">${e.cedula} - ${e.nombre + " " + e.apellido}</option>
        `)
    })
}
function listaReposiciones(reposiciones) {
    $('#lista_reposiciones').html('');
    if(reposiciones.length){
        $('#reposiciones_todas_stats').html(reposiciones.length);
        reposiciones.forEach((r)=>{
            g_mapReposiciones.set(r.id_reposicion, r)
            showReposicion(r);
        });
    }
    $('#table').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos en la tabla",
            "info":           "Mostrando _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 registros",
            "infoFiltered":   "(Filtrado de _MAX_ registros totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron registros similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        columnDefs: [
            { targets: [5], orderable: false,},
            { targets: '_all', orderable: true }
        ]
    });
    $('#info').html('');
    $('#pagination').html('');
    $('#length').html('');

    $('#table_wrapper').addClass('px-0')
    let a = $('#table_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#table_filter').css('display', 'none');
    $('#table_info').appendTo('#info');
    
    $('#table_paginate').appendTo('#pagination');

    $('#table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#table_length').find('label').find('select').appendTo('#length');
    $('#table_length').html('');
}
function showReposicion({id_reposicion,cedula, nombre, apellido, dia_reposicion, descripcion, fecha_reposicion, hora_reposicion, hora_reposicion_final}) {
    $('#lista_reposiciones').append(`
        <tr>
        <td class="text-center">${cedula}</td>
        <td><a href="/admin/estudiantes/getEstudiante/${cedula}">${nombre} ${apellido}</a></td>
        <td>${dia_reposicion} ${hora_reposicion}-${hora_reposicion_final}</td>
        <td>${descripcion}</td>
        <td>${moment(fecha_reposicion.split(' ')[0],'YYYY-MM-DD').format('LL')}</td>
        <td class="text-center">
            <button class="btn btn-primary w-100" role="button" data-id="${id_reposicion}" data-toggle="modal" data-target="#modalComprobante">
                <i class="fas fa-file-image"></i> Comprobante
            </button>
        </td>
        <td><button class="btn btn-danger" onclick="eliminarReposicion('${id_reposicion}')"><i class="fas fa-trash-alt "></i></button></td>
        </tr>`
    );
}
function openModal(modal) {
    $(modal).modal('show');
}
async function eliminarReposicion(idreposicion) {
    let reposicion = g_mapReposiciones.get(parseInt(idreposicion));
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: `Desea eliminar la reposicion de ${reposicion.nombre} ${reposicion.apellido}?`,
        html: `<b>Fecha:</b> ${moment(reposicion.fecha_reposicion.split(' ')[0], 'YYYY-MM-DD').format('LL')} <br>
        <b>Dia y Hora:</b> ${reposicion.dia_reposicion} ${reposicion.hora_reposicion}-${reposicion.hora_reposicion_final} <br>
        <span class="my-3 text-danger d-block">Esta acción no se puede revertir!</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarReposicionAjax(idreposicion).then(data => {
                swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    `La reposicion de ${reposicion.nombre} ${reposicion.apellido} se ha eliminado correctamente`,
                    'success'
                ).then(() => {
                    location.reload();
                });
            }).catch(err => {
                swalWithBootstrapButtons.fire(
                    'Error!',
                    `${err}`,
                    'error'
                );
            })
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            
        }
    })
}
function eliminarReposicionAjax(idreposicion) {
    return new Promise((resolve, reject) => {
        let bearer = 'Bearer '+g_token;
        $.ajax({
            url: '/admin/reposicion/delete',
            type: 'POST',
            data: {
                id: idreposicion
            },
            headers: {
                'Authorization': bearer
            },
        }).then((res) => {
            resolve(res);
        }, (error) => {
            reject(error);
        });
    });
}
function openModalComprobante() {
    $('#modalComprobante').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        let re = g_mapReposiciones.get(parseInt(id))
        console.log(re)
        $('#bodyComprobante').html('');

        $('#titleModalComprobante').text('Comprobante '+re.nombre);
        if(re.comprobante.length != 0){
            let tipo = re.comprobante.split('.')[1];
            if(tipo == 'pdf'){
                $('#bodyComprobante').append(
                    '<embed src="/public/uploads/'+re.comprobante+'" type="application/pdf" class="d-block mx-auto w-100" />'+
                    '<div class="form-group">'+
                    '<label for="Observacion">Observacion</label>'+
                    '<textarea class="form-control" style="resize: none;" rows="4" disabled>'+re.observacion+'</textarea>'+
                    '</div>'
                );
            }else{
                $('#bodyComprobante').append(
                    '<img src="/public/uploads/'+re.comprobante+'" class="d-block w-100 mx-auto">'+
                    '<div class="form-group">'+
                    '<label for="Observacion">Observacion</label>'+
                    '<textarea class="form-control" style="resize: none;" rows="4" disabled>'+re.observacion+'</textarea>'+
                    '</div>'
                );
            }
            
        }else{
            $('#bodyComprobante').append(
                '<div class="text-center w-100 d-block">No se subio comprobante</div>'
            );
        }
        
    });
    $('#modalAdd').on('hide.bs.modal', function (event) {
       $("#escogerReposicion").hide()
       $("#ausenciasAgregarReposicion").html('');
    })
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
function toDayWeek(dia) {
    switch (dia) {
        case 1:
            return 'LUNES';
        case 2:
            return 'MARTES';
        case 3:
            return 'MIERCOLES';
        case 4:
            return 'JUEVES';
        case 5:
            return 'VIERNES';
        case 6:
            return 'SABADO';
        case 7:
            return 'DOMINGO';
        default:
            return 'DOMINGO';
    }
}
function excelDownload(){
    const xls = new XlsExport(g_vecReposiciones, "Reposiciones");
    xls.exportToXLS('Reporte_reposiciones.xls')
}
document.addEventListener("DOMContentLoaded", loaded);