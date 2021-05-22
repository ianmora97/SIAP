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
    $.ajax({
        type: "GET",
        url: "/admin/reportes/morosos/estudiantesMorosos",
        contentType: "application/json"
    }).then((response) => {
        fillListMorosos(response);
        $('#cargarDatosSpinner').hide();
    }, (error) => {
    });
}
function fillListMorosos(morosos) {
    $('#lista_morosos').html('');
    morosos.forEach((e)=>{
        showonListMorosos(e);
    });
    $('#morosos_Table').DataTable({
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron estudiantes",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "Mostrar _MENU_ registros",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "paginate": {
                "first":    '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-double-left"></i></button>',
                "previous": '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-left"></i></button>',
                "next":     '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-right"></i></button>',
                "last":     '<button class="btn btn-sm btn-dark"><i class="fas fa-angle-double-right"></i></button>'
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
    $('#morosos_Table_filter').css('display','none');
    $('#morosos_Table_length').css('display','none');

    $('#morosos_Table_info').appendTo('#informacionTable');
    $('#morosos_Table_paginate').appendTo('#botonesCambiarTable');
}
function showonListMorosos(u){
    let id = u.id;
    let cedula = u.cedula;
    let nombre = u.nombre;
    let apellido = u.apellido;
    let pago = u.pago;
    let sexo = u.sexo == 'Masculino' ? 'o' : u.sexo == 'Femenino' ? 'a' : '@';
    let estado = u.moroso == 1 ? 'Moroso' : 'Activo';
    let colorEstado = u.moroso == 1 ? 'danger' : 'Success';
    let foto = '<img src="/public/uploads/'+u.foto+'" class="rounded-circle" width="30px">';
    $('#lista_morosos').append(`
        <tr>
        <td class="text-center">${foto}</td>
        <td>${cedula}</td>
        <td>${nombre.toUpperCase()  + ' ' + apellido.toUpperCase() }</td>
        <td>${pago}</td>
        <td class="text-center"><span class="badge badge-danger">Moros${sexo}</span></td>
        <td class="text-center" data-toggle="modal" data-target="#editarFilaMorosoModal"><i class="fas fa-pen 2x"></i></td>
        </tr>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);