
var g_estudiantes = new Array();

function loaded(event){
    events(event);
}

function events(event){
    bringData();
}

function searchonfind() {
    var table = $('#morosos_Table').DataTable();
    let val = $('#barraBuscar').val();           
    let result = table.search( val ).draw();
}

function bringData(){
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/reportes/morosos/estudiantesMorosos",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_estudiantes = response;
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').html(t)
        fillListMorosos(response);
        $('#estudiantes_morosos_stats').html(response.length)
    }, (error) => {
    });
}
function fillListMorosos(morosos) {
    $('#lista_morosos').html('');
    let cont = 0;
    if(morosos.length){
        morosos.forEach((e)=>{
            if(e.estado) cont++;
            showonListMorosos(e);
            $('#estudiantes_inactivos_stats').html(cont)
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
            { targets: [1], orderable: false,},
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
    let id = u.id;
    let cedula = u.cedula;
    let nombre = u.nombre +' '+ u.apellido;
    let pago = u.pago;
    let sexo = u.sexo == 'Masculino' ? 'o' : u.sexo == 'Femenino' ? 'a' : '@';
    let estado = u.moroso == 1 ? 'Moroso' : 'Activo';
    let colorEstado = u.moroso == 1 ? 'danger' : 'Success';
    let foto = '<img src="/public/uploads/'+u.foto+'" class="rounded-circle" width="30px" height="30px">';
    $('#lista_morosos').append(`
        <tr>
        <td>${id}</td>
        <td class="text-center">${foto}</td>
        <td>${cedula}</td>
        <td><a href="/admin/estudiantes/getEstudiante/${cedula}">${nombre}</a></td>
        <td class="text-center"><span class="badge badge-danger">Moros${sexo}</span></td>
        </tr>
    `);
}
function excelDownload(){
    if(g_estudiantes.length){
        let data = new Array();
        for (let i = 0; i < g_estudiantes.length; i++) {
            const e = g_estudiantes[i];
            data.push({
                id: e.id,
                cedula: e.cedula,
                nombre: e.nombre,
                apellido: e.apellido,
                correo: e.correo,
                estado: `${e.estado == 1 ? 'Activo' :'Inactivo' }`
            });
        }
        const xls = new XlsExport(data, "Estudiantes");
        xls.exportToXLS('Reporte_sistema.xls')
    }else{
        Swal.fire(
            'Vacia',
            'No hay registros reportados',
            'warning'
        )
    }
}
document.addEventListener("DOMContentLoaded", loaded);