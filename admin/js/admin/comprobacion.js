var estudiantes = [];

function loaded(event) {
    events(event);
}

function events(event) {
    traer_estudiantes();
    toogleMenu();
    get_today_date();
    cambiarEstadoShow();
    cambiarEstadoSend();
    filtrarX();
    filtrarTodos();
}
const animateCSS = (element, animation) =>

    // We create a Promise and return it
    new Promise((resolve, reject) => {
        let prefix = 'animate__';
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);
        console.log(node)

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
function closeFilter(params) {
    $('#containerFilter').addClass('animate__animated animate__fadeOutRight')
    setTimeout(() => {
        $('#containerFilter').removeClass('animate__animated animate__fadeOutRight')
        $('#containerFilter').hide();
    }, 1000);
}
function openFilter(params) {
    $('#containerFilter').show();
    animateCSS('#containerFilter', 'fadeInRight')
}
function filtrarX() {
    $('#filtrar_funcionarios').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarFuncionarios(estudiantes));
    });
    $('#filtrar_estudiantes').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarEstudiantes(estudiantes));
    });
    $('#filtrar_confirmados').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarConfirmados(estudiantes));
    });
    $('#filtrar_nuevos').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
        table.destroy();
        mostrarUsuarios(filtrarNuevos(estudiantes));
    });
    $('#filtrar_todos').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
        table.destroy();
        mostrarUsuarios(estudiantes);
    });
}
function filtrarTodos() {
    $('#actualizar_lista').on('click', function () {
        let table = $('#estudiantes_TableOrder').DataTable();
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
    var table = $('#estudiantes_TableOrder').DataTable();
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
    let database = '#estudiantes_TableOrder';
    var table = $(database).DataTable({
        "language": {
            "zeroRecords": "No se encontraron estudiantes",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "Mostrar _MENU_ ",
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

    $('#estudiantes_TableOrder_filter').css('display', 'none');
    $('#estudiantes_TableOrder_info').appendTo('#informacionTable');

    $('#estudiantes_TableOrder_paginate').appendTo('#botonesCambiarTable');


    $('#estudiantes_TableOrder_length').appendTo('#showlenghtentries');
    $('#estudiantes_TableOrder_length').find('label').addClass('d-flex align-items-center m-0')
    $('#estudiantes_TableOrder_length').find('label').find('select').addClass('custom-select custom-select-sm mx-2')
}
function llenarListaUsuarios(u) {
    let id = u.id;
    let cedula = u.cedula;
    let nombre = u.nombre;
    let apellido = u.apellido;
    let nacimiento = u.nacimiento;
    let sexo = u.sexo;
    let tipo = u.tipo_usuario;
    let creado = u.creado.substring(0, u.creado.indexOf(' '));
    let estado = u.estado == 1 ? 'Confirmado' : u.estado == 2 ? 'Rechazado' : 'No Confirmado';
    let colorEstado = u.estado == 1 ? 'success' : u.estado == 2 ? 'danger' : 'warning';
    $('#lista_usuarios_temporales').append(
        '<tr style="height:calc(55vh / 10);">' +
        '<td>' + cedula + '</td>' +
        '<td>' + nombre + ' ' + apellido + '</td>' +
        '<td>' + nacimiento + '</td>' +
        '<td>' + sexo + '</td>' +
        '<td>' + tipo + '</td>' +
        '<td>' + creado + '</td>' +
        '<td> <span role="button" class="badge badge-' + colorEstado + ' w-75" style="font-size:14px;" data-toggle="modal" data-target="#modalCambiarEstado" ' +
        'data-cedula="' + cedula + '" data-nombre="' + nombre + ' ' + apellido + '">' + estado + '</span></td>' +
        '</tr>'
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
            let table = $('#estudiantes_TableOrder').DataTable();
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
            let table = $('#estudiantes_TableOrder').DataTable();
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