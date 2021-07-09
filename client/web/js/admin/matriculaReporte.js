function loaded(event) {
    events(event);
}

function events(event) {
    cargar_registros();
    toogleMenu();
    onFilterDate();
}
function toogleMenu() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
  }
$(function () {
    $('[data-toggle="popover"]').popover();
})
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})
var g_filtrado = [];
function onFilterDate() {
    $('#filtrarDate').on('change', function () {
        var table = $('#table_reportes').DataTable();
        let val = $('#filtrarDate').val();
        console.log(val);
        g_filtrado = registro.filter(e => e.created_at.match(val));
        console.log(g_filtrado)
        let result1 = table.search( val ).draw();
    });
}

function searchonfind(barra) {
    var table = $('#table_reportes').DataTable();
    let val = $('#barraBuscar').val();           
    let result1 = table.search( val ).draw();
}

var registro = [];
function cargar_registros() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/api/admin/matricula/reportes",
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
    let cont = 0;
    if(data.length){
        data.forEach((e) => {
            if(e.accion.match('ELIMINADA')) cont++;
            showReportesList(e); 
        });
        $('#cantidad_desmatriculados').html(cont);
        $('#cantidad_matriculados').html(data.length - cont);
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
    let badge = data.accion.match('ELIMINADA') ? '<h4><span class="badge badge-danger">ELIMINADA</span></h4>' : '<h4><span class="badge badge-success">AGREGADA</span></h4>';
    $("#lista_reportes").append(`
        <tr>
            <td class="text-center">${data.id}</td>
            <td>${data.grupo}</td>
            <td>${data.estudiante}</td>
            <td>${badge}</td>
            <td>${data.created_at.split(' ')[0]}</td>
        </tr>
    `);
}
function openModal(modal) {
    $(modal).modal('show');
}
function pdfDownload() {
    let titulo = $('#tituloPdf').val();
    let data = [];
    g_filtrado.forEach(e=>{
        data.push(Object.values(e))
    })
    var doc = new jsPDF('p', 'pt', 'letter');  
    var htmlstring = '';  
    var tempVarToCheckPageHeight = 0;  
    var pageHeight = 0;  
    pageHeight = doc.internal.pageSize.height;  
    specialElementHandlers = {  
        '#bypassme': function(element, renderer) {  
            return true  
        }  
    };  
    margins = {  
        top: 150,  
        bottom: 60,  
        left: 40,  
        right: 40,  
        width: 600  
    };  
    var y = 20;  
    doc.setLineWidth(2);  
    doc.text(200, y = y + 30, "Reportes de Matricula");
    doc.text(200, y = y + 30, titulo);
    doc.autoTable({
        head: [['#', 'Grupo', 'Estudiante','Fecha','Acción']],
        body: data,
        startY: 110,  
        theme: 'grid',  
        
    })
    doc.save('Reportes_Matricula.pdf');
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