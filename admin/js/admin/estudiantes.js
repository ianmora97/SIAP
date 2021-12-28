var l_estudiantes


function loaded(event) {
    events(event);
}

function events(event) {
    openModalAdd();
    loadFromDb();
    llenarDatos();
    onSubmitShowModal();
}
function onSubmitShowModal(){
    $('#formAgregar').one('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let form = document.getElementById('formAgregar');
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            })
            Toast.fire({
                icon: 'error',
                background: '#ffdcdc',
                html: `<h5 class="font-weight-bold mb-0">Datos incompletos</h5>`,
            })
        }else{
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                willClose: () => {
                    console.log('submit')
                    $('#formAgregar').submit();
                }
            })
            Toast.fire({
                icon: 'success',
                background: '#dcffe4',
                text: `Estudiante agregado`,
            })
        }        
    });
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
        console.log(solicitudes)
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming-usuarios-estudiantes').text(t);
        estudiantes = solicitudes;
        cargar_estudiante(solicitudes);
        load_stats(solicitudes);
    }, (error) => {
        console.log(error)
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
        closeProgressBarLoader();
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
    let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="40px" height="40px">`;
    $("#lista_estudiantes").append(`
        <tr style="height:calc(55vh / 10);" class="">
            <td class="align-center"><a href="/admin/estudiantes/getEstudiante/${data.cedula}">${foto}</a></td>
            <td class="align-center descriptionRow"><a href="/admin/estudiantes/getEstudiante/${data.cedula}">${data.nombre + " " + data.apellido}</a></td>
            <td class="descriptionRow">${data.cedula}</td>
            <td class="descriptionRow"><i class="fas fa-flag text-primary"></i>&nbsp;&nbsp; ${data.descripcion}</td>
            <td class="descriptionRow"><i style="font-size:0.7rem;" class="fas fa-circle text-${data.estado == 0 ? 'danger' : 'success'}"></i>&nbsp; ${data.estado == 0 ? 'Inactivo' : 'Activo'}</td>
            <td class="descriptionRow">
                <a href="mailto:${data.correo}">${data.correo}</a>
            </td>
            <td class="text-center">
                <button class="btn btn-danger" onclick="delete_estudiante(${data.cedula})"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    S`);
}
/**
 * 
 * @param {string} cedula cedula del estudiante
 */
async function delete_estudiante(cedula){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    let est = g_estudiantes_map.get(""+cedula);
    swalWithBootstrapButtons.fire({
        title: `Desea eliminar a ${est.nombre} ${est.apellido} de la lista?`,
        text: "Esta acción no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarEstudiante(cedula).then(data => {
                if(data.status == 200){
                    swalWithBootstrapButtons.fire(
                        'Eliminado!',
                        `${est.nombre} ${est.apellido} ha sido eliminado`,
                        'success'
                    ).then(() => {
                        location.reload();
                    });
                    // $('#table_estudiantes').DataTable().ajax.reload();
                }else{
                    swalWithBootstrapButtons.fire(
                        'Error!',
                        `${data.error}`,
                        'error'
                    )
                }
            })
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            
        }
    })
}
function moverlabel(label_id, nivel){
    let valor = g_talleres.get(parseInt(nivel.value));
    $('#id_label_est_'+label_id+'').html(valor.descripcion);    
    $('#guardar_rango_'+label_id+'').removeClass('disabled');
    $('#guardar_rango_'+label_id+'').prop('disabled',false);
}
function eliminarEstudiante(cedula) {
    return new Promise((resolve, reject) => {
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "GET",
            url: "/admin/estudiante/eliminar", 
            data: {cedula},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            resolve(response);
            //location.href = '/admin/estudiantes';
        }, (error) => {
            reject(error);
        });
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

function cambiarClaveModal() {
    $('#modalcambiarclave').modal('show');
    let cedula = t_modalCedulaEstudiante;
    console.log(cedula);
    $('#cambiarclaveID').val(cedula);
    $('#claveCedulaID').html(cedula);
}

function excelDownload(){
    let data = new Array();
    for (let i = 0; i < estudiantes.length; i++) {
        const e = estudiantes[i];
        data.push({
            Id: e.id,
            Cedula: e.cedula, 
            Nombre: e.nombre + " " + e.apellido, 
            Correo: e.correo, 
            Usuario: e.usuario, 
            Celular: e.celular, 
            Telefono: e.telefono, 
            "Telefono Emergencia": e.telefono_emergencia, 
            Sexo: e.sexo, 
            Tipo: e.tipo, 
            "Carrera o Departamento":e.carrera_departamento, 
            Direccion: e.direccion, 
            "Fecha de Nacimiento": e.nacimiento, 
            Estado: e.estado ? "Activo" : "Inactivo", 
            Morosidad: e.moroso ? "Si" : "No",
        })
    }
    const xls = new XlsExport(data, "Estudiantes");
    xls.exportToXLS('Reporte_Estudiantes.xls')
}
function pdfDownload() {
    let titulo = "Reporte de Estudiantes en el Sistema";
    let data = [];
    for (let i = 0; i < estudiantes.length; i++) {
        const e = estudiantes[i];
        data.push([e.cedula, e.nombre, e.apellido, e.correo, e.celular, e.sexo, e.tipo])
    }
    console.log(data);
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
    doc.text(40, y = y + 65, "Reportes de Estudiantes registrados en el sistema SIAP.");

    doc.setDrawColor(183, 183, 183);
    doc.setLineWidth(0.5);
    doc.line(40, y + 20, 570, y + 20); 

    doc.autoTable({
        headStyles: { fillColor: [70, 89, 228] },
        head: [['Cedula', 'Nombre', 'Correo','Celular','Sexo','Tipo']],
        body: data,
        startY: y = y + 30,  
        theme: 'grid'
    })
    titulo = titulo.split(" ").join("_");
    doc.save(titulo+'.pdf');
}
document.addEventListener("DOMContentLoaded", loaded);