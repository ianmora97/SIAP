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
        animateCSS("#modalVerEstudiante", 'fadeInUpBig')

        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let estudiante = g_estudiantes_map.get(parseInt(recipient))

        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)
        modal.find('.modal-body input').val(recipient)

        $('#v_nombre_usuario').val(estudiante.usuario)
        $('#v_correo').val(estudiante.correo)
        $('#v_fec_nacimiento').val(estudiante.nacimiento)
        $('#v_sexo').val(estudiante.sexo)
        $('#v_telefono').val(estudiante.telefono)
        $('#v_celular').val(estudiante.celular)
        $('#v_rol').val(estudiante.tipo)
        $('#v_Dirección').val(estudiante.direccion)
        $('#v_cam_nivel').val(estudiante.nivel)
        $('#v_tel_emergencia').val(estudiante.telefono_emergencia)
        $('#v_provincias').val(estudiante.provincia)
        $('#v_canton').val(estudiante.canton)
        $('#v_distrito').val(estudiante.distrito)
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
function searchonfind() {
    var table = $('#estudiantes_TableOrder').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
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

    $('#estudiantes_matriculados_stats').text(cantidad);
    $('#estudiantes_inactivos_stats').text(inactivos);
    $('#estudiantes_morosos_stats').text(morosos);
}

var estudiantes = [];
var g_estudiantes_map = new Map();
var g_talleres = new Map();
var g_talleresA = [];

function cargar_estudiantes() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/usuarios/listaEstudiantes", //este es un path nuevo, hay que hacerlo
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
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
    }
    );
    
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/getTalleres", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        g_talleresA = talleres;
        talleres.forEach((t)=>{
            g_talleres.set(t.nivel,t);
        })
    }, (error) => {
    }
    );
}

function cargar_estudiante(data) {
    $("#lista_estudiantes").html("");
    
    data.forEach((e) => {
        llenar_Estudiantes(e);
        g_estudiantes_map.set(e.id, e);

    });
    $('#estudiantes_TableOrder').DataTable({
        "language": {
            "zeroRecords": "No se encontraron estudiantes",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "Mostrar _MENU_ registros",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "paginate": {
                "first":    '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next":     '<i class="fas fa-angle-right"></i>',
                "last":     '<i class="fas fa-angle-double-right"></i>'
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
    $(`#estudiantes_TableOrder_length`).css('display','none');
    $(`#estudiantes_TableOrder_filter`).css('display','none');

    $(`#estudiantes_TableOrder_info`).appendTo(`#informacionTable`);
    $(`#estudiantes_TableOrder_paginate`).appendTo(`#botonesCambiarTable`);

}
function moverlabel(label_id, nivel){
    let valor = g_talleres.get(parseInt(nivel.value));
    $('#id_label_est_'+label_id+'').html(valor.descripcion);    
    $('#guardar_rango_'+label_id+'').removeClass('disabled');
    $('#guardar_rango_'+label_id+'').prop('disabled',false);
}
function guardarEstadoRango(id,cedula) {
    let bearer = 'Bearer '+g_token;
    let valor = $('#id_label_est_'+id+'').html();
    let nivel = 0;
    g_talleresA.forEach((t)=>{
        if(t.descripcion == valor){
            nivel = t.nivel;
        }
    });
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarNivel", 
        data: {nivel,cedula},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = '/admin/estudiantes';
    }, (error) => {
    }
    );
}
function cambiarMorosidadEst(estado,cedula) {
    let bearer = 'Bearer '+g_token;
    let morosidad = estado.checked == true ? 1:0;

    console.log(morosidad)
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarMorosidad", 
        data: {morosidad,cedula},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = '/admin/estudiantes';
    }, (error) => {
    }
    );
}
function cambiarEstadoEstudiante(id) {
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarEstado", 
        data: {morosidad,cedula},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = '/admin/estudiantes';
    }, (error) => {
    }
    );
}
function llenar_Estudiantes(data) {
    let foto = data.foto == null ? '<i class="fas fa-user-circle fa-3x"></i>' : 
    '<img class="rounded-circle mx-auto d-block" src="../../public/uploads/'+data.foto+'" style="height:40px;">';

    $("#lista_estudiantes").append(`
        <tr style="height:calc(55vh / 10);">
            <td class="align-center">${foto}</td>
            <td>${data.cedula}</td>
            <td>${data.nombre + " " + data.apellido}</td>
            <td>
                <div class="d-flex justify-content-between">
                    <label id="id_label_est_${data.id}" for="customRange_nivel">${data.descripcion}</label>
                    <button type="button" class="btn btn-secondary btn-sm py-1 disabled" id="guardar_rango_${data.id}" 
                    disabled onclick="guardarEstadoRango('${data.id}','${data.cedula}')"><i class="far fa-save"></i></button>
                </div>
                <input type="range" class="custom-range" min="1" max="3" id="customRange_nivel" value="${data.nivel}" onchange="moverlabel(${data.id}, this)"></input>
            </td>
            <td><button class="btn btn-sm btn-${data.estado == 0 ? 'dark' : 'success'} w-100 d-block" onclick="cambiarEstadoEstudiante('${data.id}')">${data.estado == 0 ? 'Inactivo' : 'Activo'}</button></td>
            <td class="d-flex justify-content-center">
                <label class="switch-cus" for="customSwitch_${data.id}">
                    <input type="checkbox" id="customSwitch_${data.id}" ${data.moroso == 1 ? "checked" : ""} onclick="cambiarMorosidadEst(this,'${data.cedula}')">
                    <span class="slider-cus round-cus"></span>
                </label>
            </td>
            <td>
                <button class="btn btn-sm d-block w-100 btn-info" data-id="${data.id}" data-toggle="modal" data-target="#modalVerEstudiante"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    S`);

}
document.addEventListener("DOMContentLoaded", loaded);