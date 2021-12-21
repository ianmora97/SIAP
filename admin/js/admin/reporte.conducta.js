

var g_mapConductas = new Map();
var g_conductas = new Array();
function loaded(event){
    events(event);
}

function events(event){
    bringData();
    openModalOn();
}

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
    var table = $('#table').DataTable();
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
        g_conductas = response;
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
            { targets: [0, 4], orderable: false,},
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

    $('#table_length').find('label').find('select').removeClass('form-control form-control-sm custom-select-sm')
    $('#table_length').find('label').find('select').appendTo('#length');
    $('#table_length').html('');
}
function showonListMorosos(u){
    let foto = '<img src="/public/uploads/'+u.foto+'" class="rounded-circle" width="30px" height="30px">';
    $('#lista_conductas').append(`
        <tr>
            <td class="text-center">${foto}</td>
            <td>
                <a href="/admin/estudiantes/getEstudiante/${u.cedula}">${u.nombre} ${u.apellido}</a>
                <small class="sr-only">${u.cedula}</small>
            </td>
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
function excelDownload(){
    if(g_conductas.length){
        const xls = new XlsExport(g_conductas, "Estudiantes");
        xls.exportToXLS('Reporte_conductas.xls')
    }else{
        Swal.fire(
            'Vacia',
            'No hay conductas reportadas',
            'warning'
        )
    }
}
document.addEventListener("DOMContentLoaded", loaded);