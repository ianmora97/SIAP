var l_estudiantes


function loaded(event) {
    events(event);
}

function events(event) {
    getLugares();
    openModalAdd();
    loadFromDb();
    changeProfilePhoto();
    fotoonChange();
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
function openModalCameras() {
    setTimeout(() => {
        $('#modalTakePic').modal('show');
    }, 1000);
}
var t_modalCedulaEstudiante = "";

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
    
    $('#modalTakePic').on('hidden.bs.modal', function (event) {
        
        if(f_videoRecording){
            var videoEl = document.getElementById('theVideo');
            stream = videoEl.srcObject;
            tracks = stream.getTracks();
            tracks.forEach(function(track) {
                track.stop();
            });
            videoEl.srcObject = null;
        }
       
    })

    $('#modalVerEstudiante').on('show.bs.modal', function (event) {
        animateCSS("#modalVerEstudiante", 'fadeInUpBig')

        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let estudiante = g_estudiantes_map.get(parseInt(recipient))

        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)
        modal.find('.modal-body input').val(recipient)

        $('#idEstudiante').val(estudiante.id)
        $('#cedulaEstudiante').val(estudiante.cedula)

        $('#cedulaEstudiante').val(estudiante.cedula)
        $('#cambiarclaveID').val(estudiante.cedula)
        $('#claveCedulaID').html(estudiante.cedula)
        t_modalCedulaEstudiante = estudiante.cedula;

        $('#estadoModalactualizar').val(estudiante.estado)
        $('#nivelModalactualizar').val(estudiante.nivel);

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

function loadFromDb() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes", //este es un path nuevo, hay que hacerlo
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
    });
    
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
            $('#nivelModalactualizar').append(`
                <option value="${t.nivel}">${t.descripcion}</option>
            `);
        })
    }, (error) => {
    });
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
function actualizarNivel() {
    let bearer = 'Bearer '+g_token;
    let nivel = $('#nivelModalactualizar').val();
    let cedula = $('#cedulaEstudiante').val();
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
function cambiarEstadoEstudiante() {
    let estado = parseInt($('#estadoModalactualizar').val());
    let cedula = $('#cedulaEstudiante').val();
    let bearer = 'Bearer '+g_token;
    console.log(cedula);
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarEstado", 
        data: {estado,cedula},
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
function openImageModal(foto,cedula) {
    $('#modalImage').modal('show');
    $('#cedulaHiddenCambiarFotoModal').val(cedula);

    $('.avatar-bg').css({
        'background':'url('+foto+')',
        'background-size':'cover',
        'background-position': '50% 50%'
    });
    $('#contentImageModal').attr('src',foto);
}

function readURL(input) { 
    if (input.files && input.files[0]) {
        var reader = new FileReader(); 
        reader.onload = function (e) {
            $('.avatar-bg').css({
                'background':'url('+e.target.result+')',
                'background-size':'cover',
                'background-position': '50% 50%'
            });
        }; 
        reader.readAsDataURL(input.files[0]);
    }
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
    });
}
function cambiarClaveModal() {
    $('#modalcambiarclave').modal('show');
    let cedula = t_modalCedulaEstudiante;
    console.log(cedula);
    $('#cambiarclaveID').val(cedula);
    $('#claveCedulaID').html(cedula);
}
function fotoonChange() {
    $("#fileFoto").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' 
        || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#fileFoto').after(
                '<button class="btn btn-primary btn-sm d-block mx-auto mb-3" '+
                'id="btn_cambiar_foto" type="submit" '+
                'style="display: none;">Cambiar foto</button>'
            );
            $('#formatoImagenInvalido').hide();
        }else{
            $('#formatoImagenInvalido').show();
        }
                    
    });
}
var f_videoRecording = false;
function openModalToTakePhoto(){
    $('#theVideo').show();
    f_videoRecording = true;
    var videoWidth = 500;
    var videoHeight = 500;
    var videoTag = document.getElementById('theVideo');
    var canvasTag = document.getElementById('theCanvas');
    var btnCapture = document.getElementById("btnCapture");
    var btnDownloadImage = document.getElementById("btnDownloadImage");
    videoTag.setAttribute('width', videoWidth);
    videoTag.setAttribute('height', videoHeight);
    canvasTag.setAttribute('width', videoWidth);
    canvasTag.setAttribute('height', videoHeight);
    navigator.mediaDevices.getUserMedia({
        video: {
            width: videoWidth,
            height: videoHeight
        }
    }).then(stream => {
        videoTag.srcObject = stream;
        
    }).catch(e => {
        document.getElementById('errorTxt').innerHTML = 'ERROR: ' + e.toString();
    });
    var canvasContext = canvasTag.getContext('2d');
    btnCapture.addEventListener("click", () => {
        canvasContext.drawImage(videoTag, 0, 0, videoWidth, videoHeight);
        var videoEl = document.getElementById('theVideo');
        stream = videoEl.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        videoEl.srcObject = null;
        f_videoRecording = false;
        setTimeout(() => {
            $('#theVideo').hide();
        }, 1500);
    });
    btnDownloadImage.addEventListener("click", () => {
        var link = document.createElement('a');
        link.download = 'capturedImage.png';
        link.href = canvasTag.toDataURL();
        link.click();
    });
}
function llenar_Estudiantes(data) {
    let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px" role="button" onclick="openImageModal('/public/uploads/${data.foto}','${data.cedula}')">`;
    $("#lista_estudiantes").append(`
        <tr style="height:calc(55vh / 10);">
            <td class="align-center">${foto} &nbsp;&nbsp;${data.nombre + " " + data.apellido}</td>
            <td>${data.cedula}</td>
            <td><i class="fas fa-flag text-info"></i>&nbsp;&nbsp; ${data.descripcion}</td>
            <td><i style="font-size:0.7rem;" class="fas fa-circle text-${data.estado == 0 ? 'danger' : 'success'}"></i>&nbsp; ${data.estado == 0 ? 'Inactivo' : 'Activo'}</td>
            <td class="">
                <span class="sr-only">${data.moroso == 1 ? 'moroso':'limpio'}</span>
                <label class="switch-cus" for="customSwitch_${data.id}">
                    <input type="checkbox" id="customSwitch_${data.id}" ${data.moroso == 1 ? "checked" : ""} onclick="cambiarMorosidadEst(this,'${data.cedula}')">
                    <span class="slider-cus round-cus"></span>
                </label>
            </td>
            <td class="text-center">
                <span class="button-circle" role="button" data-id="${data.id}" data-toggle="modal" data-target="#modalVerEstudiante">
                    <i class="fas fa-ellipsis-v"></i>
                </span>
            </td>
        </tr>
    S`);
    /*
    <button class="btn btn-sm btn-${data.estado == 0 ? 'dark' : 'success'} w-100 d-block" onclick="cambiarEstadoEstudiante('${data.id}')"></button>

    <div class="d-flex justify-content-between">
        <label id="id_label_est_${data.id}" for="customRange_nivel">${data.descripcion}</label>
        <button type="button" class="btn btn-secondary btn-sm py-1 disabled" id="guardar_rango_${data.id}" 
        disabled onclick="guardarEstadoRango('${data.id}','${data.cedula}')"><i class="far fa-save"></i></button>
    </div>
    <input type="range" class="custom-range" min="1" max="3" id="customRange_nivel" value="${data.nivel}" onchange="moverlabel(${data.id}, this)"></input>
    */
}
document.addEventListener("DOMContentLoaded", loaded);