
var g_grupoInfo = {};
var g_asistencias = new Array();
var g_mapAsistencias = new Map();

function loaded(event){
    events(event);
}

function events(event){
    bringData();
}
function searchonfind(num) {
    var table = $(`#table`).DataTable();
    let val = $(`#barraBuscar`).val();           
    let result = table.search( val ).draw();
}
function bringData(){
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/reportes/asistencia/getGrupo",
        data: {id_grupo:g_grupo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_grupoInfo = response[0];
        console.log(g_grupoInfo);
        $('#estudiantes_total_stats').html(g_grupoInfo.cupo_actual);
        $('#text_informacion').html(`
            <b>${g_grupoInfo.descripcion}</b> <br>
            <i class="fas fa-user-tie pr-1"></i> <b>${g_grupoInfo.nombre} ${g_grupoInfo.apellido}</b> <br>
            <i class="fas fa-calendar pr-1"></i> <b>${g_grupoInfo.dia} ${g_grupoInfo.hora}-${g_grupoInfo.hora_final}</b>
        `);

        $.ajax({
            type: "GET",
            url: "/admin/reportes/asistencia/getByGrupo",
            data: {grupo:g_grupo},
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            g_asistencias = response;
            let totalTime = new Date().getTime() - ajaxTime;
            let a = Math.ceil(totalTime / 1000);
            let t = a == 1 ? a + ' segundo' : a + ' segundos';
            $('#infoTiming').html(t)
            forEachGroups(response);
            console.log(response);
        }, (error) => {
            console.log('error ajax')
        });
    }, (error) => {
        console.log('error ajax')
    });
}
function forEachGroups(data){
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        showRowsOntablesgroup(e,i)
        g_mapAsistencias.set(e.id,e)
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
            { targets: [0, 5], orderable: false,},
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
function showRowsOntablesgroup(data,i) {
    let foto = '<img src="/public/uploads/'+data.foto+'" class="rounded-circle" width="30px" height="30px">';
    $(`#lista_asistencia_grupo${data.id_grupo}`).append(`
        <tr class="align-middle">
            <td class="text-center">${foto}</td>
            <td class="align-middle">${data.cedula}</td>
            <td class="align-middle">${data.nombre.toUpperCase()  + ' ' + data.apellido.toUpperCase() }</td>
            <td class="align-middle">${data.fecha}</td>
            <td class="align-middle"><button class="w-75 btn btn-sm btn-${data.estado == 'Presente'? 'success': data.estado == 'Ausente' ? 'danger' : 'warning'}">${data.estado}</button></td>
            <td class="align-middle"><a href="/admin/reposiciones" class="btn btn-dark btn-sm"><i class="fas fa-edit"></i> Reponer Clase</a></td>
        </tr>
    `);
}
function excelDownload(){
    let data = new Array();
    for (let i = 0; i < g_asistencias.length; i++) {
        const e = g_asistencias[i];
        data.push({
           
        });
    }
    if(g_asistencias.length){
        const xls = new XlsExport(g_asistencias, `Asistencia Grupo #${g_grupo}`);
        xls.exportToXLS(`Reporte_Asistencia_grupo_${g_grupo}.xls`)
    }else{
        //swal alert
        Swal.fire(
            'Vacia',
            'No hay asistencias reportadas',
            'warning'
        )
        
    }
}
document.addEventListener("DOMContentLoaded", loaded);