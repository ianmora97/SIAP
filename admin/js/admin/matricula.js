var calendar;
var g_VecMatrestudiantes = [];
var g_MapEstudiantes = new Map();
var g_MapTalleres = new Map();
var g_VecTalleres = [];
var g_VecEstudiantes = [];
var g_mapMatriculas = new Map();

var seleccionados = new Map();
var g_eventosArray = new Array();

function loaded(event) {
    events(event);
}

function events(event) {
    loadFromDb();
    openModalShow();
    onChangeSelectsMatricula();
    onModalOpen();
    checkCustomView();
}
moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);
function onModalOpen(){
    $('#gruposCalendario').on('shown.bs.modal', function (event) {
        calendar.updateSize();
        $(".fc-dayGridMonth-button").click();
    })
}
function checkCustomView(){
    
}

function onChangeSelectsMatricula() {
    $('#EstudiantesModalMatricular').on('change',function(event) {
        let dropdown = $(event.currentTarget);
        let card = $('#tiqueteMatricula');
        if(dropdown.val() !== 'default'){
            card.find('.card-title').text(dropdown.find('option:selected').text());
            $('.texto-fecha').html('')
            $('#btnSelecionarGrupos').attr('disabled',false);
            seleccionados.clear();
            let estudiante = g_MapEstudiantes.get(dropdown.val());
            $('.texto-matricular').html(`${estudiante.descripcion}`);
            let vecnew = g_eventosArray.filter(e => e.title === estudiante.descripcion);
            console.log('vecnew',vecnew)
            let vecnewMap = new Map();
            vecnew.forEach((e) => {
                vecnewMap.set(e.idGrupo,e);
            });
            let vecMatriDisponibles = new Map(); // los cursos que puede matricular
            let matriculasDelEstudiante = g_VecMatrestudiantes.filter(e => e.cedula === estudiante.cedula);
            // ! saca los cursos que ya estan matriculados por el estudiante
            let vecMa = new Array();
            matriculasDelEstudiante.forEach(e => {
                vecMa.push(e.id_grupo);
            });
            console.log('vecMa',vecMa);
            let last =  new Array();
            vecMa.forEach((e) => {
                vecnewMap.delete(e);
            });
            vecnewMap.forEach((e) => {
                last.push(e);
            });

            calendar.removeAllEventSources();
            calendar.addEventSource(last);
            calendar.render();
        }else{
            $('#btnSelecionarGrupos').attr('disabled',true);
            card.find('.card-title').html('');
        }
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
        $('#cambiarEstadoActivar').show();
        $('#cambiarEstadoDesactivar').show();
        var button = $(event.relatedTarget)
        var recipient = button.data('id')+"";
        var id_matricula = button.data('idma');
        let estudiante = g_MapEstudiantes.get(recipient);
        let matri = g_mapMatriculas.get(parseInt(id_matricula));
        if(matri.activa === 1){
            $('#cambiarEstadoActivar').hide();
        }else{
            $('#cambiarEstadoDesactivar').hide();
        }
        var modal = $(this)
        modal.find('.modal-title').text(estudiante.nombre + " " + estudiante.apellido)
        $('#cedulaTarget').html(estudiante.cedula);
        $('#idCursoDesmatricular').html(id_matricula);
       
    })
}


function loadFromDb() {
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
        url: "/admin/talleres/getGrupos", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        g_VecTalleres = talleres;
        fillSelectGrupo(talleres);
        fillCalendar(talleres);
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
    let matriculaid = parseInt($('#idCursoDesmatricular').html());
    let estudiante = $('#exampleModalLabel').html();
    let idGrupo = g_mapMatriculas.get(matriculaid).id_grupo;
    let data = {matriculaid: matriculaid,estudiante: estudiante, idGrupo: idGrupo}
    console.log(data)
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
    let estudiante = $('#EstudiantesModalMatricular').val();
    let correo = g_MapEstudiantes.get(estudiante).correo;
    let id_estudiante = g_MapEstudiantes.get(estudiante).id_estudiante;
    let nombreEst = g_MapEstudiantes.get(estudiante).nombre + " " + g_MapEstudiantes.get(estudiante).apellido;
    let grupos = [];
    let gruposAll = [];
    seleccionados.forEach((grupo) => {
        grupos.push(grupo.info.idGrupo);
        gruposAll.push(grupo.info);
    });
    console.log(gruposAll,estudiante,correo)
    let data = {
        estudianteId: id_estudiante,
        estudiante: estudiante,
        grupos: grupos,
        correo: correo,
        gruposAll: gruposAll
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
            <option value="default">Seleccione un estudiante...</option>
    `);
    for (let i = 0; i < data.length; i++) {
        var e = data[i];
        g_MapEstudiantes.set(e.cedula,e);
        if(check3Matriculas(e)){
            if(e.estado === 1 && e.moroso === 0){
                $('#EstudiantesModalMatricular').append(`
                    <option value="${e.cedula}">${e.nombre + " " + e.apellido}</option>
                `);
            }
        }
    }
    if(g_customView !== ''){
        $('#matricularModal').modal('show');
        console.log(g_customView)
        $('#EstudiantesModalMatricular').val(g_customView).trigger('change');
    }

}
function check3Matriculas(estudiante){
    let matriculas = g_VecMatrestudiantes.filter(e => e.cedula === estudiante.cedula);
    let count = 0;
    matriculas.forEach((matricula) => {
        console.log('MATRICULA:',matricula)
        if(matricula.activa === 1){
            count++;
        }
    });
    if(count < 3){
        return true;
    }else{
        return false;
    }
}
function fillSelectGrupo(data) {
    let cont = 0;
    data.forEach(e => {
        if(e.cupo_actual < e.cupo_base ) cont+= (e.cupo_base - e.cupo_actual);
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
            g_mapMatriculas.set(m.id_matricula,m);
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
    let horario = data.dia.toUpperCase() + " " + data.hora + "-" + data.hora_final;
    let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px">`;
    
    $("#lista_estudiantes").append(`
        <tr>
            <td>${id_matricula}</td>
            <td>${foto}&nbsp;&nbsp; <a href="/admin/estudiantes/getEstudiante/${cedul}">${nomb}</a></td>
            <td>${cedul}</td>
            <td><a href="/admin/talleres/grupo/${data.id_grupo}">${horario}</a></td>
            <td>${nivel}</td>
            <td>${nombre_pro.split(' ')[0]}</td>
            <td>${fecha}</td>
            <td>
                <button style="width:90%; display:block;margin:0 auto;" class="btn btn-${data.activa ? 'success' : 'danger'}">${data.activa ? 'Activo' : 'Inactivo'}</button>
            </td>
            <td class="text-center">
                <span class="button-circle" role="button" data-id="${cedul}" 
                data-matricula="${cedul}" data-idma="${id_matricula}" data-toggle="modal" data-target="#modalVerMatricula">
                    <i class="fas fa-ellipsis-v"></i>
                </span>
            </td>
        </tr>
    `);
}
function toWeekDay(dia) {
    switch (dia) {
        case 'LUNES':
            return 1;
        case 'MARTES':
            return 2;
        case 'MIERCOLES':
            return 3;
        case 'JUEVES':
            return 4;
        case 'VIERNES':
            return 5;
        case 'SABADO':
            return 6;
        case 'SÁBADO':
            return 6;
        case 'DOMINGO':
            return 7;
        default:
            break;
    }
}
function toDayWeek(dia) {
    switch (dia) {
        case 1:
            return 'LUNES';
        case 2:
            return 'MARTES';
        case 3:
            return 'MIERCOLES';
        case 4:
            return 'JUEVES';
        case 5:
            return 'VIERNES';
        case 6:
            return 'SABADO';
        case 7:
            return 'DOMINGO';
        default:
            return 'DOMINGO';
    }
}

var contEvents = 0;
function fillCalendar(grupos) {
    for (let i = 0; i < grupos.length; i++) {
        let e = grupos[i];
        let p = e.nombre + " "+ e.apellido;
        let id_matricula = e.id_matricula;
        let grupo = e.id_grupo;
        let codigo = e.codigo_taller;
        let descripcion = e.descripcion;
        let dia = e.dia;
        let hora = e.hora;
        let hora_final = e.hora_final;
        let horaI = moment(e.hora, 'h:mmA').format('HH:mm');
        let horaF = moment(e.hora_final, 'h:mmA').format('HH:mm');        
        let weekday = toWeekDay(dia.toUpperCase());
        let allp = e.dia+" "+e.hora+" "+e.hora_final;
        let todo = `
        <button type="button" class="btn btn-sm">
        <i class="fa fa-swimmer"></i> ${descripcion} <span class="badge badge-light">${dia}: ${e.hora} - ${e.hora_final}</span>
        </button>`;
        let today = moment();
        if(moment(e.periodo,'YYYY-MM-DD') < today < moment(e.periodo_final,'YYYY-MM-DD')){ // true si la fecha aplica -- a < b < c
            let a_t = moment().add('8', 'days').format('YYYY-MM-DD');
            let b_t = moment().add('1', 'days').format('YYYY-MM-DD');
            g_eventosArray.push({
                idGrupo: grupo,
                idEvent: contEvents,
                title: descripcion,
                hora: hora,
                hora_final: hora_final,
                startTime: horaI,
                endTime: horaF,
                startRecur: b_t,
                endRecur: a_t,
                daysOfWeek: [ weekday ], 
                display: 'block',
                backgroundColor: '#4659E4',
                borderColor: '#4659E4',
                icon : "swimmer",
                allp: allp,
                codigo: codigo,
                description: todo,
                nivel: descripcion,
            });
            contEvents++;
        }
    }
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        aspectRatio:1,
        height: 750,
        nowIndicator: true,
        themeSystem: 'bootstrap',
        businessHours: {
            startTime: '7:00',
            endTime: '22:00',
            dow: [ 1, 2, 3, 4, 5 ],
        },
        validRange: function(nowDate) {
            return {
              start: nowDate,
            };
        },
        views: {
            dayGrid: {
                titleFormat: { month: 'long', day: '2-digit' }
            },
        },
        customButtons: {
            doAgregar: {
                text: 'Matricular Seleccionados',
                click: function() {
                    $('.texto-fecha').html('');
                    seleccionados.forEach(e=>{
                        $('.texto-fecha').append(`<h5><span class="badge badge-light mr-2">${e.info.allp}</span></h5>`);
                    });
                    $('#gruposCalendario').modal('hide');
                    $('#matricularModal').modal('show');
                }
            },
            doCancelar: {
                text: 'Cancelar',
                click: function() {
                    $('#gruposCalendario').modal('hide');
                    $('#matricularModal').modal('show');
                }
            },
        },
        headerToolbar: {
            start: '',
            center: 'title',
            end: 'doAgregar doCancelar'
        },
        events: g_eventosArray,
        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'
        },
        dateClick: function(info) {
        },
        eventClick: function(event) {
            let info = event.event._def.extendedProps;
            let id = info.idEvent;
            let selected = moment(event.event.endStr).format('YYYY-MM-DD');
            
            if (seleccionados.has(id)) {
                seleccionados.delete(id);
                event.el.style.backgroundColor = '#4659E4';
                event.el.style.borderColor = '#4659E4';
                event.el.style.color = '#fff';
            } else {
                if(seleccionados.size < 3){
                    seleccionados.set(id, {info,selected});
                    event.el.style.backgroundColor = '#f0bc4d';
                    event.el.style.borderColor = '#f0bc4d';
                    event.el.style.color = '#4659E4';
                }
            }
        },
        eventContent: function (args, createElement) {
            const hora = args.event._def.extendedProps.hora;
            const icon = args.event._def.extendedProps.icon;
            const text = `
            <button type="button" class="btn text-white d-flex justify-content-between w-100 align-items-center">
                <div><i class="fa fa-${icon}"></i> ${args.event._def.title} </div><span class="badge badge-light">${hora}</span>
            </button>`;
            return {
              html: text
            };
        },
        viewDidMount: function(info) {
            $('.fc-doCancelar-button').removeClass('btn-primary').addClass('btn-danger');
            $('.fc-doAgregar-button').html('<i class="fas fa-plus mr-2"></i>Matricular Seleccionados');
            $('.fc-doCancelar-button').html('<i class="fas fa-times mr-2"></i>Cancelar');
        },
    });
    calendar.render();
}
document.addEventListener("DOMContentLoaded", loaded);
