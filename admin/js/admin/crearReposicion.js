var g_vecAsistencias = [];
var g_vecGrupos = [];
var g_mapReposiciones = new Map();
var g_mapEstudiantes = new Map();
var calendar;
var g_eventosArray = new Array();

moment.lang('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function loaded(event){
    events(event);
}

function events(event){
    obtenerReposiciones();
    selecEstudianteAdd();
    onModalOpen();
    onFileLoad();
}
function onFileLoad(){
    $('#fileFoto').change(function(event) {
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = archivos[0].type;
        if(tipo == 'image/jpeg' || tipo == 'image/png' || tipo == 'image/jpg' ){
            readFile(this);
            $('#labelfileFoto').text(nombre);
        }
    });
}
function readFile(input){
    if (input.files && input.files[0]) {
        $('#fotoContainer').show();
        var reader = new FileReader(); 
        reader.onload = function (e) {
            $('#fotoContainer').html('<img src="'+e.target.result+'" class="img-fluid" width="100%">');
        }; 
        reader.readAsDataURL(input.files[0]);
    }
}
function obtenerReposiciones(){
    let bearer = 'Bearer '+g_token;
    let ajaxTime= new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/api/admin/reposiciones",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((reposiciones) => {
        $.ajax({
            type: "GET",
            url: "/admin/reportes/asistencia/getAsistencia",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((asistencias) => {
            let totalTime = new Date().getTime() - ajaxTime;
            let a = Math.ceil(totalTime/1000);
            let t = a == 1 ? a + ' segundo' : a + ' segundos';
            $('#infoTiming').text(t);
            g_vecAsistencias = asistencias;
        }, (error) => {
        });

        $.ajax({
            type: "GET",
            url: "/admin/reportes/asistencia/getGrupos",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((grupos) => {
            g_vecGrupos = grupos;
            listaGrupos(grupos);
            fillCalendar(grupos);
        }, (error) => {
        });

        $.ajax({
            type: "GET",
            url: "/admin/estudiante/listaEstudiantes",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((estudiantes) => {
            listaEstudiantes(estudiantes);
        }, (error) => {

        });
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getGrupos", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((grupos) => {
            $('#grupos_stats').html(grupos.length)
            let totalTime = new Date().getTime() - ajaxTime;
            let a = Math.ceil(totalTime / 1000);
            let t = a == 1 ? a + ' segundo' : a + ' segundos';
            $('#infoTiming').text(t);
        }, (error) => {
        });
    });
}
function listaGrupos(data) {
    $('#grupoAddSelect').html('');
    $('#grupoAddSelect').append(`
        <option value="null" >Seleccione un Grupo</option>
    `)
    data.forEach(e => {
        let hora = e.hora < 10 ? '0'+e.hora : e.hora;
        $('#grupoAddSelect').append(`
            <option value="${e.id_grupo}">${e.dia} ${e.hora}-${e.hora_final}</option>
        `)
    });
}
function onModalOpen(){
    $('#modalAdd').on('shown.bs.modal', function (event) {
        // $(".fc-daygrid-body").css("width", "100vw");
        // $(".fc-scrollgrid-sync-table").css("width", "100vw");
        calendar.updateSize();
        $(".fc-dayGridMonth-button").click();
        console.log('abre');

    })
}
function slideToggleModal() {
    $('#escogerReposicion').show();
}
function selecEstudianteAdd() {
    $('#estudiantesAddSelect').on('change',function(){
        if($('#estudiantesAddSelect').val() != 'null'){
            let estudiante = g_mapEstudiantes.get(parseInt($('#estudiantesAddSelect').val()))
            let filt = g_vecAsistencias.filter(e => e.id_estudiante == parseInt($('#estudiantesAddSelect').val()))
            //update calendar with level
            let vecnew = g_eventosArray.filter(function(e){
                console.log(e.title, estudiante.descripcion);
                return e.title == estudiante.descripcion;
            });
            calendar.removeAllEventSources();
            calendar.addEventSource(vecnew);
            calendar.render();
            if(filt.length > 0){
                slideToggleModal();
                buildRowListAusencia(filt)
            }else{
                $("#ausenciasAgregarReposicion").html(
                    `<div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Sin ausencias</h4>
                    <p><a class="text-warning" href="/admin/estudiantes/getEstudiante/${estudiante.cedula}"><b>${estudiante.nombre + " " + estudiante.apellido}</b></a> no presenta ausencias!</p>
                    <hr class="my-2">
                    <p class="my-2 d-inline mr-3">El estudiante necesita al menos de una ausencia para reponer la clase.</p>
                    <button class="btn btn-sm btn-warning d-inline" onclick="slideToggleModal()">Solicitar Reposición</button>
                    
                    </div>`);
            }
        }else{
            $("#ausenciasAgregarReposicion").html("");
        }
    })
}
function buildRowListAusencia(data) {
    // filtro por ausencias
    let res = data.filter(e => e.estado == "Ausente");
    res.forEach(element => {
        showRowListAusencia(element)
    });
}

function showRowListAusencia(ele) {
    $('#ausenciasAgregarReposicion').append(`
        <a class="list-group-item list-group-item-action border-right-0 border-left-0">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1"><span class="badge badge-danger">Ausencia</span></h5>
                <small class="text-muted">${moment(ele.fecha,'DD-MM-YYYY-HH-mm').calendar()}</small>
            </div>
            <p class="mb-1">${ele.nombre} ${ele.apellido} 
            <br>Presenta una ausencia con ${ele.profesor}</p>
            <small class="text-muted">Grupo: ${ele.id_grupo}</small>
        </a>
    `)
}
function listaEstudiantes(data){
    $('#estudiantesAddSelect').html('');
    
    $('#estudiantesAddSelect').append(`
        <option value="null" id="valorreposicionulo">Seleccione un estudiante</option>
    `)
    data.forEach(e => {
        g_mapEstudiantes.set(e.id_estudiante,e);
        if(e.estado == "1" && e.moroso == "0"){
            $('#estudiantesAddSelect').append(`
                <option value="${e.id_estudiante}">${e.cedula} - ${e.nombre + " " + e.apellido}</option>
            `)
        }
        
    })
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
        let allp = e.dia+"_"+e.hora+"_"+e.hora_final;
        
        let todo = `
        <button type="button" class="btn btn-sm btn-primary-noshadow">
            <i class="fa fa-swimmer"></i> ${descripcion} <span class="badge badge-light">${dia}: ${e.hora} - ${e.hora_final}</span>
        </button>`;

        g_eventosArray.push({
            idGrupo: grupo,
            id: grupo,
            title: descripcion,
            hora: hora,
            hora_final: hora_final,
            startTime: horaI,
            endTime: horaF,
            startRecur: e.periodo,
            endRecur: e.periodo_final,
            daysOfWeek: [ weekday ], 
            display: 'block',
            backgroundColor: '#4659E4',
            borderColor: '#4659E4',
            icon : "swimmer",
            allp: allp,
            codigo: codigo,
            description: todo,
        });
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
        headerToolbar: {
            start: 'today prev,next',
            center: 'title',
            end: 'dayGridMonth'
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
            g_modalFechaCalendario = info.dateStr;
        },
        eventClick: function(event) {
            let info = event.event._def.extendedProps;
            let title = event.event._def.title;
            let selected = event.event.endStr;
            $('#grupoAddSelect').val(info.idGrupo);
            $('#fechareposicion').val(moment(selected).format('YYYY-MM-DD'));
            $('#grupoescogido').html(`
                ${info.description}
            `);
            $('#modalAdd').modal('hide');

        },
        eventContent: function (args, createElement) {
            const hora = args.event._def.extendedProps.hora;
            const icon = args.event._def.extendedProps.icon;
            const text = `
            <button type="button" class="btn btn-primary-noshadow text-white">
                <i class="fa fa-${icon}"></i> ${args.event._def.title} <span class="badge badge-light">${hora}</span>
            </button>`;
            return {
              html: text
            };
        }
    });
    calendar.render();
}
var mientras;
document.addEventListener("DOMContentLoaded", loaded);