var l_estudiantes


function loaded(event) {
    events(event);
}

function events(event) {
    getLugares();
    openModalAdd();
    cargar_estudiantes();

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

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
function openModalAdd() {
    $('#modalButtonAgregarEstudiante').on('click', function () {
        $('#modalAgregarEstudiante').modal('show')
        animateCSS("#modalAgregarEstudiante", 'fadeInUpBig')
    })
    $('#closeModalAgregar').on('click', function () {
        animateCSS("#modalAgregarEstudiante", 'fadeOutDownBig').then(() => {
            $('#modalAgregarEstudiante').modal('hide')
        })
    })
    $('#modalAgregarEstudiante').on('hidePrevented.bs.modal', function (event) {
        animateCSS("#modalAgregarEstudiante", 'shakeX')
    })

    $('#modalVerEstudiante').on('show.bs.modal', function (event) {
        animateCSS("#modalVerEstudiante", 'shakeX')

        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let estudiante = g_estudiantes_map.get(parseInt(recipient))

        console.log(g_estudiantes_map)
        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)
        modal.find('.modal-body input').val(recipient)

        $('#v_nombre_usuario').val(estudiante.usuario)
        $('#v_correo').val(estudiante.correo)
        $('#v_fec_nacimiento').val(estudiante.nacimiento )
        $('#v_sexo').val(estudiante.sexo)
        $('#v_telefono').val(estudiante.telefono)
        $('#v_celular').val(estudiante.celular )
        $('#v_rol').val(estudiante.rol )
        $('#v_cam_nivel').val(estudiante.nivel )
        
       
        



//< label class="switch" >
             //   <input type="checkbox" checked>
             //</input>       <span class="slider round"></span>
           //</input> </label>



    })



}
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
function getLugares() {
    $.ajax({
        type: "GET",
        url: "../../assets/lugares.txt",
        contentType: "text"
    }).then((data) => {
        procesarLugares(data);
    }, (error) => {
    });
}
function procesarLugares(data) {
    lugares = data;
    var lines = data.split("\n");

    var provincia = [];
    var cantones = [];
    var distritos = [];

    for (var j = 0; j < lines.length - 1; j++) {
        var values = lines[j].split(' ,');
        provincia.push((values[0]));
        cantones.push((values[1]));
        distritos.push((values[2]));
    }
    load_provincias(provincia);
    load_cantones(cantones);
    load_distritos(distritos);
}
function load_provincias(data) {
    console.log(data)
    let provincias = data;
    provincias = provincias.filter(function (item, pos) { //elimina repetidos
        return provincias.indexOf(item) == pos;
    })

    for (let provincia of provincias) {
        $('#provincia').append(new Option(provincia, provincia));
    }
}
function load_cantones(data) {
    let pro = $('#provinciaSelected').attr('data-values');
    let cantones = data;
    cantones = filtrarCantonxProvincia(pro);

    $('#canton').html(' ');

    for (let canton of cantones) {
        $('#canton').append(new Option(canton, canton));
    }
}
function load_distritos(data) {
    let distritos = data;
    let can = $('#cantonSelected').attr('data-values');
    let dis = $('#distritoSelected').attr('data-values');
    distritos = filtrarDistritoxCanton(can);
    $('#distrito').html(' ');
    for (let distrito of distritos) {
        if (distrito == dis) {
            $('#distrito').append(new Option(dis, dis, false, true));
        } else {
            $('#distrito').append(new Option(distrito, distrito));
        }
    }
}
function load_stats(solicitudes) {
    let cantidad = solicitudes.length;
    let inactivos = 0;
    let morosos = 0;
    for (let i of solicitudes) {
        if (!i.estado) inactivos++;
        if (i.moroso) morosos++;
    }
    console.log(cantidad);
    console.log(inactivos);
    console.log(morosos);

    $('#estudiantes_matriculados_stats').text(cantidad);
    $('#estudiantes_inactivos_stats').text(inactivos);
    $('#estudiantes_morosos_stats').text(morosos);
}

var estudiantes = [];
var g_estudiantes_map = new Map();

function cargar_estudiantes() {
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/usuarios/listaEstudiantes", //este es un path nuevo, hay que hacerlo
        contentType: "appication/json",
    }).then((solicitudes) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming-usuarios-estudiantes').text(t);
        estudiantes = solicitudes;
        cargar_estudiante(solicitudes);
        load_stats(solicitudes);
        $('#cargarDatosSpinner-usuarios-estudiantes').hide();
    }, (error) => {
        alert(error.status);
    }
    );
}

function cargar_estudiante(solicitudes) {
    $("#lista_estudiantes").html("");
    console.log(solicitudes);
    solicitudes.forEach((solicitudes) => {
        llenar_Estudiantes(solicitudes);
        g_estudiantes_map.set(solicitudes.id, solicitudes);

    });
}



function llenar_Estudiantes(solicitudes) {

    let id = solicitudes.id;
    let cedula = solicitudes.cedula;
    let nivel = solicitudes.descripcion;
    let nombre = solicitudes.nombre;
    let apellido = solicitudes.apellido;
    let matricula = solicitudes.matricula;
    let estado = solicitudes.estado == 0 ? 'Inactivo' : 'Activo';
    let color_estado = solicitudes.estado == 0 ? 'dark' : 'success';
    let color_moroso = solicitudes.moroso == 0 ? 'success' : 'secondary';
    let moroso = solicitudes.moroso == 1 ? 'Si' : 'No';
    $("#lista_estudiantes").append(
        "<tr>" +
        "<td>" +
        id +
        " </td>" +
        "<td>" +
        cedula +
        "</td>" +
        "<td>" +
        nombre + " " + apellido +
        "</td>" +
        "<td>" +
        nivel +
        "</td>" +
        "<td>" +
        matricula +
        "</td>" +
        '<td>' +
        '<button type="button" class="btn btn-' + color_estado + '" disabled>' +
        estado + '</button>' +
        "</td>" +
        "<td> por hacer</td>" +
        '<td>' +
        '<button type="button" class="btn btn-' + color_moroso + '" disabled>' +
        moroso + '</button>' +
        "</td>" +
        '<td class="list-action ">' +
        '<a class="btn btn-primary text-white" data-id="' + id + "Ver mas" + '" data-toggle="modal" data-target="#modalVerEstudiante">' +
        '<i class="fas fa-eye"></i>' +
        '</a>' +
        '</td>' +
        "</tr>"
    );

}



















document.addEventListener("DOMContentLoaded", loaded);