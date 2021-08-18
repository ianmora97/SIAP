

var g_mapConductas = new Map();

function loaded(event){
    events(event);
}

function events(event){
    bringData();
    openModalOn();
}

$(function () {
    $('[data-toggle="popover"]').popover();
})
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
function openModalOn() {
    $('#verConductaModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let conducta = g_mapConductas.get(parseInt(recipient))
        
        var modal = $(this)
        modal.find('.modal-title').text(conducta.nombre + " " + conducta.apellido)
        
        $('#idEstudiante').html(conducta.id_estudiante)
        $('#cedulaEstudiante').html(conducta.cedula)
        $('#conductaTextModal').html(conducta.texto)
        $('#estadoModalactualizar').val(conducta.estado)
        //$('#strikesModalactualizar').val(conducta.strike)
    })
}

function searchonfind() {
    var table = $('#conductas_Table').DataTable();
    let val = $('#barraBuscar').val();           
    let result = table.search( val ).draw();
}
function openmodal(modal) {
    $(modal).modal('show');
}
function cambiarEstadoEstudiante() {
    let estado = parseInt($('#estadoModalactualizar').val());
    let cedula = $('#cedulaEstudiante').html();
    let bearer = 'Bearer '+g_token;
    
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarEstado", 
        data: {estado,cedula},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = '/admin/reportes/conducta';
    }, (error) => {
    });
}
function agregarNota(){
    let bearer = 'Bearer '+g_token;
    let estudiante = parseInt($('#estudianteModal').val());
    let nota = $('#notamodal').val();
    let tipo = $('#tipoModal').val();

    $.ajax({
        type: "GET",
        url: "/admin/reportes/conductas/agregarConducta",
        data:{estudiante,nota,tipo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/reportes/conducta";
    }, (error) => {
    });
}
function bringData(){
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/reportes/conductas/getConductas",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        fillListConductas(response);
    }, (error) => {
    });
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes", //este es un path nuevo, hay que hacerlo
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((solicitudesDB) => {
        
        solicitudesDB.forEach(e => {
            $('#estudianteModal').append(`
                <option value="${e.id_estudiante}">${e.nombre} ${e.cedula}</option>
            `);
        })
    }, (error) => {
    });
}
function fillListConductas(conductas) {
    $('#lista_conductas').html('');
    let cont = 0;
    if(conductas.length){
        conductas.forEach((e)=>{
            if(e.tipo == 'Eventualidad') cont++;
            g_mapConductas.set(e.id_conducta, e);
            showonListMorosos(e);
        });
    }
    $('#inadecuadas_stats').html(conductas.length - cont);
    $('#eventualidades_stats').html(cont);
    $('#reportes_stats').html(conductas.length);

    $('#conductas_Table').DataTable({
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron estudiantes",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "Mostrar _MENU_ registros",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "paginate": {
                "first":    '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next":     '<i class="fas fa-angle-right"></i>',
                "last":     '<i class="fas fa-angle-double-right"></i>'
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
    $('#dataTables_length').css('display','none');
    $('#conductas_Table_filter').css('display','none');
    $('#conductas_Table_length').css('display','none');

    $('#conductas_Table_info').appendTo('#informacionTable');
    $('#conductas_Table_paginate').appendTo('#botonesCambiarTable');
}
function showonListMorosos(u){
    let foto = '<img src="/public/uploads/'+u.foto+'" class="rounded-circle" width="30px" height="30px">';
    $('#lista_conductas').append(`
        <tr>
            <td class="text-center">${foto}</td>
            <td>${u.cedula}</td>
            <td>${u.nombre.toUpperCase()  + ' ' + u.apellido.toUpperCase() }</td>
            <td><a role="button" data-id="${u.id_conducta}" data-toggle="modal" data-target="#verConductaModal" 
            class="btn btn-sm btn-${u.tipo == 'Eventualidad' ? 'warning':'danger'} py-1 m-0">${u.tipo}</a></td>
            <td><i style="font-size:0.7rem;" class="fas fa-circle text-${u.estado == 0 ? 'danger' : 'success'}">
            </i>&nbsp; ${u.estado == 0 ? 'Inactivo' : 'Activo'}</td>
            <td class="text-center">
                <span class="button-circle" role="button" data-id="${u.id_conducta}" data-toggle="modal" data-target="#verConductaModal">
                    <i class="fas fa-ellipsis-v"></i>
                </span>
            </td>
        </tr>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);