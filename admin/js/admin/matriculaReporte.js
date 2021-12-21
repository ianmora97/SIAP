function loaded(event) {
    events(event);
}

function events(event) {
    cargar_registros();
    toogleMenu();
    onFilterDate();
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
        var table = $('#table').DataTable();
        let val = $('#filtrarDate').val();
        console.log(val);
        g_filtrado = registro.filter(e => e.created_at.match(val));
        console.log(g_filtrado)
        let result1 = table.search(val).draw();
    });
}

function searchonfind(barra) {
    var table = $('#table').DataTable();
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

    $('#table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#table_length').find('label').find('select').appendTo('#length');
    $('#table_length').html('');
}
function showReportesList(data) {
    let badge = data.accion.match('ELIMINADA') ? '<button class="btn btn-danger w-75">Desmatricula</button>' : '<button class="btn btn-success w-75">Matricula</button>';
    $("#lista_reportes").append(`
        <tr>
            <td class="text-center">${data.id}</td>
            <td>${data.grupo}</td>
            <td>${data.estudiante}</td>
            <td>
            <span class="sr-only">${data.created_at.split(' ')[0]}</span>
            ${moment(data.created_at.split(' ')[0], 'YYYY-MM-DD').format('LL')}
            </td>
            <td>${badge}</td>
        </tr>
    `);
}
function openModal(modal) {
    $(modal).modal('show');
}
function pdfDownload() {
    let titulo = $('#tituloPdf').val();
    let data = [];
    if(g_filtrado.length){
        g_filtrado.forEach(e=>{
            data.push(Object.values(e))
        })
    }else{
        registro.forEach(e=>{
            data.push(Object.values(e))
        })
    }
    console.log(data)
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
    var img = new Image()
    img.src = '/img/logo-vive-promocion-transparency.png'
    doc.addImage(img, 'png',  15, 15, 50, 50)
    doc.text(80, 40 ,'Sistema de Administracion de la Piscina del');
    doc.text(80, 58 ,'Departamento de Promocion Estudiantil');

    let fecha = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(525, 30, fecha.toLocaleDateString());

    doc.setFontSize(11);
    doc.text(40, y = y + 65, "Reportes de Matricula y desmatricula del sistema");

    doc.setDrawColor(183, 183, 183);
    doc.setLineWidth(0.5);
    doc.line(40, y + 20, 570, y + 20); 

    doc.autoTable({
        headStyles: { fillColor: [70, 89, 228] },
        head: [['#', 'Grupo', 'Estudiante','Fecha','Acción']],
        body: data,
        startY: y = y + 30,  
        theme: 'grid'
    })
    titulo = titulo.split(" ").join("_");
    doc.save(titulo+'.pdf');
}


document.addEventListener("DOMContentLoaded", loaded);