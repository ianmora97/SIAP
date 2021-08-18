
function loaded(event) {
    events(event);
}

function events(event) {
    loadFromDb();
    openModalShow();
    onChangeSelectsMatricula();
}

function onChangeSelectsMatricula() {
    $('#EstudiantesModalMatricular').on('change',function(event) {
        let dropdown = $(event.currentTarget);
        let card = $('#tiqueteMatricula');
        card.find('.card-title').text(dropdown.find('option:selected').text());
    });
    $('#GrupoModalMatricular').on('change',function(event) {
        let dropdown = $(event.currentTarget);
        let card = $('#tiqueteMatricula');
        let curso = dropdown.find('option:selected').text().split(' ')[0];
        let fecha = dropdown.find('option:selected').text().split(' ')[1];
        let hora = dropdown.find('option:selected').text().split(' ')[2];

        card.find('.texto-matricular').text(`Nivel: ${curso}`);
        card.find('.texto-fecha').text(`Fecha: ${fecha} ${hora}`);
    });
}

function searchonfind() {
    var table = $('#table').DataTable();
    let val = $('#barraBuscar').val();
    let result = table.search(val).draw();
}
function openModalShow(){
    $('#modalVerMatricula').on('show.bs.modal', function (event) {
        
        var button = $(event.relatedTarget)
        var recipient = button.data('id')+"";
        var id_matricula = button.data('matricula');
        let estudiante = g_MapEstudiantes.get(recipient);

        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)
        $('#cedulaTarget').html(estudiante.cedula);
        $('#idCursoDesmatricular').html(id_matricula);
       
    })
}
var g_VecMatrestudiantes = [];
var g_MapEstudiantes = new Map();
var g_MapTalleres = new Map();
var g_VecTalleres = [];
var g_VecEstudiantes = [];

function loadFromDb() {
    console.log("se pide")
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/matricula/listaMatriculados",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((matriculas) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        g_VecMatrestudiantes = matriculas;
        
        cargarEstudiantes(matriculas);
        $('#cargarDatosSpinner').hide();
    },(error) => {
        console.log('error')
    });
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes",
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((estudiantes) => {
        g_VecEstudiantes = estudiantes;
        fillSelected(estudiantes);
    }, (error) => {
    });
    
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getGrupos", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        g_VecTalleres = talleres;
        fillSelectGrupo(talleres);
    }, (error) => {
    });
}
function cambiarEstadoMatricula(est) {
    let bearer = 'Bearer '+g_token;
    let curso_id = parseInt($('#idCursoDesmatricular').html());
    let estudiante = $('#exampleModalLabel').html();
    let estado = est;
    let data = {
        curso_id: curso_id,
        estado: estado,
        estudiante: estudiante
    }
    $.ajax({
        type: "POST",
        url: "/admin/matricula/cambiarEstado/matricula",
        data: JSON.stringify(data),
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/matricula";
    }, (error) => {
        $('#feedbackdesmatricula').append(`
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Error!</strong> No se pudo cambiar el estado de matricula de este estudiante.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    });
}

function desmatricular() {
    let bearer = 'Bearer '+g_token;
    let curso_id = parseInt($('#idCursoDesmatricular').html());
    let estudiante = $('#exampleModalLabel').html();
    let data = {curso_id: curso_id,estudiante: estudiante}
    $.ajax({
        type: "POST",
        url: "/admin/matricula/desmatricular",
        data: JSON.stringify(data),
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/matricula";
    }, (error) => {
        $('#feedbackdesmatricula').append(`
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Error!</strong> No se pudo cambiar el estado de matricula de este estudiante.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    });
}
function matricularCursos(){
    let bearer = 'Bearer '+g_token;
    let estudiante = parseInt($('#EstudiantesModalMatricular').val());
    let grupo = parseInt($('#GrupoModalMatricular').val());

    let dropdown = $('#GrupoModalMatricular');
    
    let curso = dropdown.find('option:selected').text().split(' ')[0];
    let fecha = dropdown.find('option:selected').text().split(' ')[1];
    let hora = dropdown.find('option:selected').text().split(' ')[2];
    // ! falta enviar el correo como parametro
    let data = {
        estudiante: estudiante,
        grupo: grupo,
        curso: curso,
        fecha: fecha,
        hora: hora
    }
    $.ajax({
        type: "POST",
        url: "/admin/matricula/matricularCursos",
        data: JSON.stringify(data),
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        animateCSS('#tiqueteMatricula','backOutRight').then(e=>{
            $('#tiqueteMatricula').hide();
            location.href = '/admin/matricula';
        });
    }, (error) => {
        $("#alertadanger").fadeIn('slow');   
    });
}
function fillSelected(data) {
    $('#EstudiantesModalMatricular').html('');
    $('#EstudiantesModalMatricular').append(`
            <option>Seleccione un estudiante...</option>
    `);
    data.forEach(e => {
        g_MapEstudiantes.set(e.cedula,e);
        $('#EstudiantesModalMatricular').append(`
            <option value="${e.id_estudiante}">${e.nombre + " " + e.apellido}</option>
        `);
    })
}
function fillSelectGrupo(data) {
    $('#GrupoModalMatricular').html('');
    $('#GrupoModalMatricular').append(`
        <option>Seleccione un grupo...</option>
    `);
    let cont = 0;
    data.forEach(e => {
        if(e.cupo_actual < e.cupo_base ){
            cont+= (e.cupo_base - e.cupo_actual);
            $('#GrupoModalMatricular').append(`
                <option value="${e.id_grupo}">${e.descripcion + " " + e.dia + " "+e.hora}</option>
            `);
        }
    })
    $('#cursos_stats').text(cont);
}
function openmodal(modal) {
    $(modal).modal('show');
}
function cargarEstudiantes(matricula) {
    $("#lista-estudiantes").html("");
    let cont = 0;
    if(matricula.length){
        matricula.forEach((m) => {
            if(m.activa) cont ++;
            llenarEstudiantes(m);
        });
    }
    $('#est_activos_stats').text(cont);
    $('#est_inactivos_stats').text(matricula.length - cont);

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
            { targets: [8], orderable: false,},
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

function llenarEstudiantes(data) {
    console.log(data)
    let id_matricula = data.id_matricula;
    let nivel = data.descripcion;
    let nombre_pro = data.nombre_profesor;
    let fecha = data.created_at.split(' ')[0];
    let cedul = data.cedula;
    let nomb = data.nombre.toUpperCase() + " " + data.apellido.toUpperCase();
    let horario = data.dia.toUpperCase() + " " + data.hora + "-" + parseInt(data.hora + 1);
    let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px">`;
    
    $("#lista_estudiantes").append(`
        <tr>
            <td>${id_matricula}</td>
            <td>${foto}&nbsp;&nbsp; ${nomb}</td>
            <td>${cedul}</td>
            <td>${horario}</td>
            <td>${nivel}</td>
            <td>${nombre_pro.split(' ')[0]}</td>
            <td>${fecha}</td>
            <td><i style="font-size:0.7rem;" class="fas fa-circle text-${data.activa ? 'success' : 'danger'}"></i>&nbsp; ${data.activa ? 'Activo' : 'Inactivo'}</td>
            <td class="text-center">
                <span class="button-circle" role="button" data-id="${cedul}" 
                data-matricula="${id_matricula}" data-toggle="modal" data-target="#modalVerMatricula">
                    <i class="fas fa-ellipsis-v"></i>
                </span>
            </td>
        </tr>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);
