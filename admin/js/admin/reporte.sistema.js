function loaded(event) {
    events(event);
}

function events(event) {
    cargar_registros();
    cargar_administradores();
}

function searchonfind(barra) {
    var table = $('#table_reportes').DataTable();
    let val = $('#barraBuscar').val();           
    let result1 = table.search( val ).draw();
}
function cargar_administradores(){
    $.ajax({
        type: "GET",
        url: "/admin/registro/sistemaCanAdmin",
        contentType: "application/json",
    }).then((solicitudes) => {
        $('#cantidad_administrativos').html(solicitudes.length);
    },(error) => {
        alert(error.status);
    });
}
var registro = [];
function cargar_registros() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/registro/sistema",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((reportes) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        registro = reportes;
        $('#cantidad_registros').text(reportes.length);
        reportesList(reportes);
    },(error) => {
      
    });
}
function reportesList(data) {
    $("#lista_reportes").html("");
    if(data){
        data.forEach((e) => {
            showReportesList(e); 
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
function showReportesList(data) {
    let badge = data.ddl == 'ELIMINAR' ? 'danger' : 
                data.ddl == 'AGREGAR' ? 'success' : 
                data.ddl == 'ACTUALIZAR' ? 'warning' : 'info';
    $("#lista_reportes").append(`
        <tr style="height:calc(60vh/10);">
            <td>${data.id}</td>
            <td>${data.usuario}</td>
            <td><h5 class="m-0"><span class="badge badge-${badge}">${data.ddl}</span></h5></td>
            <td>${data.descripcion}</td>
            <td>${data.tabla}</td>
            <td>${moment(data.created_at, 'YYYY-MM-DD hh:mm:ss').format('lll')}</td>
        </tr>
    `);
}
function excelDownload(){
    if(registro.length){
        const xls = new XlsExport(registro, "Estudiantes");
        xls.exportToXLS('Reporte_Morosidad.xls')
    }else{
        Swal.fire(
            'Vacia',
            'No hay registros reportados',
            'warning'
        )
    }
}
document.addEventListener("DOMContentLoaded", loaded);