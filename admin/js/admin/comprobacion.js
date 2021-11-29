var estudiantes = [];

moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function loaded(event) {
    events(event);
}

function events(event) {
    traer_estudiantes();
    get_today_date();
    modalComprobante();
    filtrarX();
    filtrarTodos();
}

function closeFilter(params) {
    animateCSS('#containerFilter', 'fadeOutRight').then(e=>{
        $('#containerFilter').hide();
    })
}
function openFilter(params) {
    $('#containerFilter').show();
    
    animateCSS('#containerFilter', 'fadeInRight')
}
function filtrarX() {
    $('#filtrar_funcionarios').on('click', function () {
        let table = $('#table').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarFuncionarios(estudiantes));
    });
    $('#filtrar_estudiantes').on('click', function () {
        let table = $('#table').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarEstudiantes(estudiantes));
    });

    $('#filtrar_todos').on('click', function () {
        let table = $('#table').DataTable();
        table.destroy();
        mostrarUsuarios(estudiantes);
    });
}
function filtrarTodos() {
    $('#actualizar_lista').on('click', function () {
        let table = $('#table').DataTable();
        table.destroy();
        traer_estudiantes();
    });
}

function buscarInlcudes(estudiantes, buscar) {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].nombre.includes(buscar) || estudiantes[i].apellido.includes(buscar) || estudiantes[i].cedula.includes(buscar)) {
            result.push(estudiantes[i]);
        }
    }
    return result;
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
}

function load_stats(usuarios) {
    let cantidad = usuarios.length;
    let verificados = 0;
    let nuevos = 0;
    for (let i of usuarios) {
        if (i.estado) verificados++;
        if (!i.estado) nuevos++;
    }
    $('#usuarios_registrados_stats').text(cantidad);
    $('#usuarios_verificados_stats').text(verificados);
    $('#usuarios_nuevos_stats').text(nuevos);
}
function searchonfind() {
    var table = $('#table').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
}
var g_mapEstudiantes = new Map();
function traer_estudiantes() {
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/usuariostemp",
        contentType: "application/json"
    }).then((usuarios) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        $('#cargarDatosSpinner').hide();
        estudiantes = usuarios;
        mostrarUsuarios(usuarios);
        load_stats(usuarios);
    }, (error) => {
    });
}

function mostrarUsuarios(usuarios) {
    $('#lista_usuarios_temporales').html(' ');
    usuarios.forEach(u => {
        llenarListaUsuarios(u);
        g_mapEstudiantes.set(u.cedula, u);
    });
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
function llenarListaUsuarios({id,cedula,nombre,apellido,nacimiento,tipo_usuario,created_at,comprobante}) {
    $('#lista_usuarios_temporales').append(
        `<tr style="height:calc(55vh / 10);">
            <td>${cedula}</td>
            <td>${nombre} ${apellido}</td>
            <td>${moment(nacimiento, "YYYY-MM-DD").format('LL')}</td>
            <td>${tipo_usuario}</td>
            <td>${ moment(created_at, "YYYY-MM-DD").format('LL')}</td>
            <td class="text-center">
                <button class="btn btn-light btn-sm " data-pic="${comprobante == null ? "na": comprobante}" data-toggle="modal" data-target="#verComprobante">
                <i class="far fa-image"></i> Ver Comprobante</button>
            </td>
            <td>
                <button type="button" class="btn btn-sm d-inline btn-danger" onclick="cambiarEstadoSend('rechazar','${cedula}')"><i class="fas fa-times"></i> Rechazar</button>
                <button type="button" class="btn btn-sm d-inline btn-primary" onclick="cambiarEstadoSend('confirmar','${cedula}')"><i class="fas fa-check"></i> Confirmar</button>
            </td>
        </tr>`
    );
}

function modalComprobante() {
    $('#verComprobante').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var imagen = button.data('pic');
        var modal = $(this);
        if(imagen != "na"){
            modal.find('.modal-body').html(`<img src="/public/uploads/${imagen}" class="img-fluid">`);
        }else{
            modal.find('.modal-body').html('<h3>No hay comprobante</h3>');
        }
    });
}

function cambiarEstadoSend(estado,p_cedula) {
    if(estado == 'confirmar'){
        let est = g_mapEstudiantes.get(p_cedula);
        let cedula = p_cedula;
        let email = est.correo;
        let nombre = est.nombre + ' ' + est.apellido;
        let data = { cedula, email, nombre }
        $.ajax({
            type: "POST",
            url: "/admin/comprobacion/insertarUsuarioPermanente",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((response) => {
            console.log(response);
            location.href = "/admin/comprobacion";
            let table = $('#table').DataTable();
            table.destroy();
            traer_estudiantes();
        }, (error) => {
            $('#alerta_error_estado').css('display', 'block');
        });
    }else{
        let data = { p_cedula }
        $.ajax({
            type: "POST",
            url: "/admin/comprobacion/rechazarEstudiante",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((response) => {
            console.log(response);
            location.href = "/admin/comprobacion";
            $('#modalCambiarEstado').modal('hide');
            let table = $('#table').DataTable();
            table.destroy();
        }, (error) => {
            $('#alerta_error_estado').css('display', 'block');
        });
    }
}

var filtrarNuevos = (estudiantes) => {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if (!(estudiantes[i].estado)) {
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarConfirmados = (estudiantes) => {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if ((estudiantes[i].estado)) {
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarEstudiantes = (estudiantes) => {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if ((estudiantes[i].tipo_usuario == 'Estudiante')) {
            console.log('est');
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarFuncionarios = (estudiantes) => {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++) {
        if ((estudiantes[i].tipo_usuario == 'Funcionario')) {
            console.log('funcionario');
            result.push(estudiantes[i]);
        }
    }
    return result;
}
var filtrarBuscar = (estudiantes, s) => {
    let result = [];
    for (let i = 0; i < estudiantes.length; i++)
        if (estudiantes[i].nombre == s.toUpperCase() || estudiantes[i].nombre == s || estudiantes[i].cedula == s)
            result.push(estudiantes[i]);
    return result;
}

document.addEventListener("DOMContentLoaded", loaded);