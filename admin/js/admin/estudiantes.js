var l_estudiantes


function loaded(event) {
    events(event);
}

function events(event) {
    openModalAdd();
    loadFromDb();
    changeProfilePhoto();
    fotoonChange();
    llenarDatos();
}

function openModalCameras() {
    setTimeout(() => {
        $('#modalTakePic').modal('show');
    }, 1000);
}
var t_modalCedulaEstudiante = "";

function openModal(modal) {
    $(modal).modal('show')
}

function openModalAdd() {
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

        var button = $(event.relatedTarget)
        var recipient = ""+button.data('id')
        let estudiante = g_estudiantes_map.get(recipient)
        console.log(estudiante,recipient)

        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)

        $('#idEstudiante').html(estudiante.id)
        $('#cedulaEstudiante').html(estudiante.cedula)

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
        $('#v_perfil').val(estudiante.tipo)
        $('#v_Dirección').val(estudiante.direccion)
        $('#v_cam_nivel').val(estudiante.nivel)
        $('#v_tel_emergencia').val(estudiante.telefono_emergencia)
        $('#v_carrera').val(estudiante.carrera_departamento)
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
    var table = $('#table').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
}
function llenarDatos() {
    $('#cedula_add').on('keyup',(cantidad)=>{
        let id = $('#cedula_add').val();
        
        if(id.length == 9){
            // $('#id_registro').addClass('is-valid');
            $.ajax({
                type: "GET",
                url: '/buscarUsuarioRegistro',
                contentType: "application/json",
                data: {id:id}
            }).then((response) => {
                let p = JSON.parse(response)
                $('#nombre_add').val(p.results[0].firstname1);
                $('#apellido_add').val(p.results[0].lastname);
                
                // $('#nombre_add').addClass('is-valid');
                // $('#apellido_add').addClass('is-valid');
  
                $('#nombre_add').attr('readonly', true);
                $('#apellido_add').attr('readonly', true);
            }, (error) => {
            
            });
        }
        else if(id.length == 12){ //revisar si es residente
            // $('#id_registro').addClass('is-valid');
        }else{ // si no se encontro
            // $('#id_registro').removeClass('is-valid');
  
            // $('#nombre_add').removeClass('is-valid');
            // $('#apellido_add').removeClass('is-valid');
  
            $('#nombre_add').attr('readonly', false);
            $('#apellido_add').attr('readonly', false);
        }
    });
  }
function load_stats(solicitudes) {
    if(solicitudes.length){
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
    if(data.length){
        data.forEach((e) => {
            g_estudiantes_map.set(e.cedula, e);
            llenar_Estudiantes(e);
    
        });
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
        columnDefs: [
            { targets: [0, 6], orderable: false,},
            { targets: '_all', orderable: true }
        ]
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
function llenar_Estudiantes(data) {
    let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px" height="30px" role="button" onclick="openImageModal('/public/uploads/${data.foto}','${data.cedula}')">`;
    $("#lista_estudiantes").append(`
        <tr style="height:calc(55vh / 10);">
            <td class="align-center">${foto}</td>
            <td class="align-center">${data.nombre + " " + data.apellido}</td>
            <td>${data.cedula}</td>
            <td><i class="fas fa-flag text-primary"></i>&nbsp;&nbsp; ${data.descripcion}</td>
            <td><i style="font-size:0.7rem;" class="fas fa-circle text-${data.estado == 0 ? 'danger' : 'success'}"></i>&nbsp; ${data.estado == 0 ? 'Inactivo' : 'Activo'}</td>
            <td class="">
                <span class="sr-only">${data.moroso == 1 ? 'moroso':'limpio'}</span>
                <label class="switch-cus" for="customSwitch_${data.id}">
                    <input type="checkbox" id="customSwitch_${data.id}" ${data.moroso == 1 ? "checked" : ""} onclick="cambiarMorosidadEst(this,'${data.cedula}')">
                    <span class="slider-cus round-cus"></span>
                </label>
            </td>
            <td class="text-center">
                <span class="button-circle" role="button" data-id="${data.cedula}" data-toggle="modal" data-target="#modalVerEstudiante">
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
function moverlabel(label_id, nivel){
    let valor = g_talleres.get(parseInt(nivel.value));
    $('#id_label_est_'+label_id+'').html(valor.descripcion);    
    $('#guardar_rango_'+label_id+'').removeClass('disabled');
    $('#guardar_rango_'+label_id+'').prop('disabled',false);
}
function eliminarEstudiante() {
    let bearer = 'Bearer '+g_token;
    let cedula = $('#cedulaEstudiante').html();
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/eliminar", 
        data: {cedula},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = '/admin/estudiantes';
    }, (error) => {
    });
}
function actualizarNivel() {
    let bearer = 'Bearer '+g_token;
    let nivel = $('#nivelModalactualizar').val();
    let cedula = $('#cedulaEstudiante').html();
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
    let cedula = $('#cedulaEstudiante').html();
    let bearer = 'Bearer '+g_token;
    console.log(cedula,estado)
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
        //location.href = '/admin/estudiantes';
    }, (error) => {
    }
    );
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
function actualizarDatosEstudiante() {
    let username = $('#v_nombre_usuario').val()
    let correo = $('#v_correo').val()
    let nacimiento = $('#v_fec_nacimiento').val()
    let sexo = $('#v_sexo').val()
    let telefono = $('#v_telefono').val()
    let celular = $('#v_celular').val()
    let tipo = $('#v_perfil').val()
    let direccion = $('#v_Dirección').val()
    let cedula = $('#cedulaEstudiante').html();
    let carrera = $('#v_carrera').val()
    let data ={
        username,correo,nacimiento,telefono,sexo,cedula,tipo,celular,direccion,carrera
    }
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarDatos", 
        data: data,
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows){
            location.href = '/admin/estudiantes';
        }else if(response.code){
            if(response.code == "ER_DUP_ENTRY"){
                $('#feedbackVer').append(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        El correo <strong>${correo}</strong> ya se encuentra registrado. <i class="far fa-question-circle" 
                        data-toggle="tooltip" data-placement="bottom" data-html="true" 
                        title="Para cambiar a este correo si el usuario ya cuenta con un registro anterior: <br> 
                        1. Elimine el usuario con este correo. <br>
                        2. Haga el cambio de correo a este usuario."></i>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
            }
            $('[data-toggle="tooltip"]').tooltip()
        }
        
    }, (error) => {
    });
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
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#sendFileFoto').html('')
            $('#sendFileFoto').html(
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

document.addEventListener("DOMContentLoaded", loaded);