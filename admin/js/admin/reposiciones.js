function loaded(event){
    events(event);
}

function events(event){
    obtenerReposiciones();
    toogleMenu();
    openModalComprobante();
    selecEstudianteAdd();
}
function openModal(modal) {
    $(modal).modal('show')
}

const animateCSS = (element, animation) =>
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
function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}
$(function () {
    $('[data-toggle="popover"]').popover();
})
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function searchonfind() {
    var table = $('#reposiciones_TableOrder').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
}

var g_vecAsistencias = [];
var g_vecGrupos = [];
var g_mapReposiciones = new Map();
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
        }, (error) => {

        });
    });
}
function listaGrupos(data) {
    $('#grupoAddSelect').html('');
    $('#grupoAddSelect').append(`
        <option value="null">Seleccione un estudiante</option>
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
        // filtro por estudiante la lista de asistencia
        let filt = g_vecAsistencias.filter(e => e.id_estudiante == parseInt($('#estudiantesAddSelect').val()))
        buildRowListAusencia(filt)
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
        <option value="null">Seleccione un estudiante</option>
    `)
    data.forEach(e => {
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
    $('#reposiciones_TableOrder').DataTable({
      "language": {
          "zeroRecords": "No se encontraron profesores",
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
    $('#informacionTable').html('');
    $('#botonesCambiarTable').html('');
    $('#showlenghtentries').html('');
  
    $('#reposiciones_TableOrder_filter').css('display', 'none');
    $('#reposiciones_TableOrder_info').appendTo('#informacionTable');
  
    $('#reposiciones_TableOrder_paginate').appendTo('#botonesCambiarTable');
    
    $('#reposiciones_TableOrder_length').appendTo('#showlenghtentries');
    $('#reposiciones_TableOrder_length').find('label').addClass('d-flex align-items-center m-0')
    $('#reposiciones_TableOrder_length').find('label').find('select').addClass('custom-select custom-select-sm mx-2')
}
function showReposicion(r) {

    let cedula = r.cedula;
    let nombre = r.nombre + ' ' + r.apellido;
    let g_orig = r.grupo_origen;
    let g_repo = r.grupo_reposicion;
    let nivel  = r.descripcion;
    let fecha  = r.fecha_reposicion;
    let compro = r.comprobante;
    let observ = r.observacion;
    let hora = r.hora_reposicion < 10 ? '0'+r.hora_reposicion : r.hora_reposicion;

    $('#lista_reposiciones').append(
        '<tr>'+
        '<td class="text-center">'+cedula+'</td>'+
        '<td>'+nombre+'</td>'+
        `<td>${r.dia_reposicion} ${moment(`${hora}:00`,'HH:mm').format('LT')}</td>`+
        '<td>'+nivel+'</td>'+
        '<td>'+fecha+'</td>'+
        `<td class="text-center">
            <span class="button-circle" role="button" data-id="${r.id_reposicion}" data-toggle="modal" data-target="#modalComprobante">
                <i class="fas fa-ellipsis-v"></i>
            </span>
        </td>`+
        '</tr>'
    );
}
function openModal(modal) {
    $(modal).modal('show');
}

function openModalComprobante() {
    $('#modalComprobante').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        let re = g_mapReposiciones.get(parseInt(id))
        console.log(re)
        $('#bodyComprobante').html('');

        $('#titleModalComprobante').text('Reposicion de '+re.nombre);
        if(re.comprobante.length != 0){
            let tipo = re.comprobante.split('.')[1];
            if(tipo == 'pdf'){
                $('#bodyComprobante').append(
                    '<h4>Comprobante:</h4>'+
                    '<embed src="/public/uploads/'+re.comprobante+'" type="application/pdf" class="d-block mx-auto w-100" />'+
                    '<div class="form-group">'+
                    '<label for="Observacion">Observacion</label>'+
                    '<textarea class="form-control" style="resize: none;" rows="4" disabled>'+re.observacion+'</textarea>'+
                    '</div>'
                );
            }else{
                $('#bodyComprobante').append(
                    '<h4>Comprobante:</h4>'+
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
}

document.addEventListener("DOMContentLoaded", loaded);