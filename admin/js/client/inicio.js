var calendar;
moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function loaded(event){
    loadDB();
    whenClickCalendarioTab()
}
function whenClickCalendarioTab(){
    $('#calendario-tab').on('click',function(){
        calendar.render();
        setTimeout(() => {
            $(".fc-dayGridMonth-button").click();
            $(".fc-dayGridMonth-button").trigger("click");
        }, 200);
    })
}
var g_grupos = new Array();
function loadDB(){
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/api/client/inicio", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((grupos) => {
        g_grupos = grupos;
        buildListCards(grupos);
        loadCalendar(grupos);
        $('#spinnerLoad').remove()
    }, (error) => {
    });
}
/**
 * 
 * @param {Array} data lista de grupos
 */
function buildListCards(data){
    if(data.length > 0){
        data.forEach((e,i) => {
            showCard(e,i)
        });
    }
}
function showCard({dia,hora,hora_final,descripcion,id_grupo,periodo_final,created_at},i){
    $('#cursos').append(`
        <div class="card-list" style="animation-delay: ${i}50ms;" id="cursoId-${id_grupo}">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="font-weight-bold">${descripcion}</h3>
                <small class="text-muted mb-0">${nextDayOfClass(dia,periodo_final).nextDay}</small>
            </div>
            <div class="">
                <p class="mb-0"><i class="fas fa-calendar-day text-primary" style="font-size: 12px;"></i> ${dia}</p>
                <small class="mb-0 text-muted"><i class="fas fa-clock text-primary" style="font-size: 12px;"></i> ${hora} - ${hora_final}</small>
            </div>
            <div class="progress mt-2" style="height:10px;">
                <div class="progress-bar progress-bar-striped bg-primary" role="progressbar" style="width: ${progresoPorcentaje(created_at,periodo_final,dia)}%" aria-valuenow="${progresoPorcentaje(created_at,periodo_final)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
        <script>
            animateCSS('#cursoId-${id_grupo}', 'fadeInUp');
        </script>
    `);
}
function progresoPorcentaje(inicio, fin,dia){
    // how many progress since incicio to fin from today
    let start = moment(inicio);
    let end = moment(fin);
    let today_ = moment();
    let today = moment().day();
    let diff = toWeekDay(dia) - today;
    if(diff < 0){
        return 100;
    }else if(diff == 0){
        return 90;
    }
    let next = moment().add(diff, 'days');
    let di2 = today_.diff(start, 'days');
    let progreso = di2 * 100/ end.diff(start, 'days');
    console.log(diff,dia,progreso);
    return progreso;

    
}
function toWeekDay(dia) {
    let array = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return array.indexOf(dia);
}
function toDayWeek(dia) {
    let array = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return array[dia];
}
function nextDayOfClass(dia,periodo_final){
    let end = moment(periodo_final);
    let day = toWeekDay(dia);
    let today = moment().day();
    let diff = day - today;
    if(diff < 0){
        diff = diff + 7;
    }
    let next = moment().add(diff, 'days');
    let di = end.diff(next, 'days');
    let nextDay = di < 0 ? 'Finalizado <i class="fas fa-check-circle text-success"></i>' : next.format('LL');
    let nextDayComplete = di < 0 ? 'Finalizado' : `Proxima clase: <b>${next.format('dddd LL')}</b>`;
    return {nextDay,nextDayComplete};
}
function loadCalendar(data){
    var eventsArray = [];
    data.forEach(e => {
        let p = e.nombre_profesor;
        let id_matricula = e.id_matricula;
        let grupo = e.id_grupo;
        let codigo = e.codigo_taller;
        let descripcion = e.descripcion;
        let dia = e.dia;
        let hora = e.hora;
        let horaI = moment(e.hora, 'h:mmA').format('HH:mm');
        let horaF = moment(e.hora_final, 'h:mmA').format('HH:mm');        
        let weekday = toWeekDay(dia.toUpperCase());
        
        let todo = `Profesor: ${p} <br>${dia}: ${e.hora} - ${e.hora_final}`;
        let today = moment();
        if(moment(e.periodo,'YYYY-MM-DD') < today < moment(e.periodo_final,'YYYY-MM-DD')){
            let b_t = moment().format('YYYY-MM-DD');
            eventsArray.push({
                id: grupo,
                title: descripcion,
                hora: hora,
                startTime: horaI,
                endTime: horaF,
                startRecur: b_t,
                endRecur: e.periodo_final,
                daysOfWeek: [ weekday ], 
                display: 'block',
                backgroundColor: 'rgba(255,255,255, 0)',
                borderColor: 'rgba(255,255,255, 0)',
                icon : "swimmer",
                codigo: codigo,
                description: todo,
            });
        }

        
    })
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        height: 550,
        aspectRatio:1,
        themeSystem: 'bootstrap',
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'prev,dayGridMonth,next'
        },
        views: {
            dayGrid: {
                titleFormat: { month: 'long',year:'numeric'}
            },
        },
        events: eventsArray,
        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'
        },
        eventClick: function(event) {
            let info = event.event._def.extendedProps
            console.log(event.event._def.extendedProps)
            $('.event-icon').html("<i class='fa fa-"+info.icon+"'></i>");
            $('.event-title').html(info.codigo);
            $('.event-body').html(info.description);
            $('#modal-view-event').modal();
        },
        eventContent: function (args, createElement) {
            const hora = args.event._def.extendedProps.hora;
            const icon = args.event._def.extendedProps.icon;
            const text = `<div class="bg-primary text-center rounded-pill d-flex justify-content-center align-items-center mx-auto" 
            style="width:30px;height:30px;"><i class="fa fa-${icon} text-white"></i></div>`;
            return {
                html: text
            };
        },
        viewDidMount: function(info) {
            $('.fc-dayGridMonth-button').addClass('btn-sm');
            $('.fc-listWeek-button').addClass('btn-sm');
            $('.fc-prev-button').addClass('btn-sm');
            $('.fc-next-button').addClass('btn-sm');
            $('.fc-toolbar-title').addClass('display-6');
            $('.fc-col-header-cell-cushion').css('text-transform','capitalize');
        },
    });
    calendar.render();
    
}
document.addEventListener("DOMContentLoaded", loaded);