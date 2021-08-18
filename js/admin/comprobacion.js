var estudiantes = [];

function loaded(event) {
    events(event);
}

function events(event) {
    traer_estudiantes();
    get_today_date();
    cambiarEstadoShow();
    cambiarEstadoSend();
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
function llenarListaUsuarios(u) {
    let id = u.id;
    let cedula = u.cedula;
    let nombre = u.nombre;
    let apellido = u.apellido;
    let nacimiento = u.nacimiento;
    let sexo = u.sexo;
    let tipo = u.tipo_usuario;
    let creado = moment(u.creado, "DD-MM-YYYY-h-mm").calendar();
    $('#lista_usuarios_temporales').append(
        `<tr style="height:calc(55vh / 10);">
            <td>${cedula}</td>
            <td>${nombre} ${apellido}</td>
            <td>${nacimiento}</td>
            <td>${sexo}</td>
            <td>${tipo}</td>
            <td>${creado}</td>
            <td>
                <button type="button" class="btn btn-sm d-inline btn-danger" id="CambiarEstadoRechazarBoton">Rechazar</button>
                <button type="button" class="btn btn-sm d-inline btn-primary" id="CambiarEstadoConfirmarBoton">Confirmar</button>
            </td>
        </tr>`
    );
}

function cambiarEstadoShow() {
    $('#modalCambiarEstado').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var cedula = button.data('cedula');
        var nombre = button.data('nombre');
        $('#nombreTarget').text(nombre);
        $('#cedulaTarget').text(cedula);
    });
}
function cambiarEstadoSend() {
    $('#CambiarEstadoConfirmarBoton').on('click', function () {
        let cedula = $('#cedulaTarget').text();
        let email = 'ianmorar03@gmail.com';
        let nombre = $('#nombreTarget').text();
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
    });
    $('#CambiarEstadoRechazarBoton').on('click', function () {
        let cedula = $('#cedulaTarget').text();
        let data = { cedula }
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
    });
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