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
    $('#table_reportes').DataTable({
        "language": {
            "zeroRecords": "No se encontraron reportes",
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
    $('#table_reportes_info').appendTo('#infoTable_reportes');
    $('#table_reportes_paginate').appendTo('#botonesTable_reportes');
    $('#table_reportes_length').find('select').removeClass('custom-select-sm');
    $('#table_reportes_length').find('select').appendTo('#showlenghtentries');
    $('#table_reportes_length').html('');
    $('#table_reportes_filter').html('');
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
            <td>${data.created_at}</td>
        </tr>
    `);
}
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

document.addEventListener("DOMContentLoaded", loaded);