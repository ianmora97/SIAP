
var g_mapProfesoresAsistencia = new Map();
moment.lang('es', {
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
    bringDB();
}

function bringDB() {
	let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/api/teach/asistencia/allteach",
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
        }).then((data) => {
            llenarAsistencia(data);
            closeProgressBarLoader();
        }, (error) => {
        }
    );
}
function llenarAsistencia(data){
    $('#lista_asistencia').html();
    data.forEach(e=>{
        g_mapProfesoresAsistencia.set(e.id_profesor_asistencia,e);
        showRowAsistenica(e);
    })
    $('#table_asistencia').DataTable({
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
        }
    });
    $('#info_asistencia').html('');
    $('#pagination_asistencia').html('');
    $('#length_asistencia').html('');
  
    $('#table_asistencia_wrapper').addClass('px-0')
    let a = $('#table__asistenciawrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');
  
    $('#table_asistencia_filter').css('display', 'none');
    $('#table_asistencia_info').appendTo('#info_asistencia');
  
    $('#table_asistencia_paginate').appendTo('#pagination_asistencia');
  
    $('#table_asistencia_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#table_asistencia_length').find('label').find('select').appendTo('#length_asistencia');
    $('#table_asistencia_length').html('');
  
}
function showRowAsistenica(e){
    let estado = e.estado == 'Presente' ? '<i class="fas fa-check-circle text-success"></i> <b>Presente</b>' : '<i class="fas fa-times-circle text-danger"></i>';
    $("#lista_asistencia").append(`
        <tr>
            <td>${e.id_profesor_asistencia}</td>
            <td>${e.nombre} ${e.apellido}</td>
            <td>${e.cedula}</td>
            <td>${moment(e.fecha, 'DD/MM/YYYY').format("dddd, Do MMMM YYYY") }</td>
            <td>${estado}</td>
        </tr>
    `);
}
function searchonfindAsistencia() {
    var table = $('#table_asistencia').DataTable();
    let val = $('#barraBuscarasistencia').val();
    let result = table.search(val).draw();
  }

function excelDownloadAsistencia(){
    let data = Array.from(g_mapProfesoresAsistencia.values());
    const xls = new XlsExport(data, "Asistencia de Profesores");
    xls.exportToXLS('Reporte_asistencia_Profesores.xls')
}

document.addEventListener("DOMContentLoaded", loaded);