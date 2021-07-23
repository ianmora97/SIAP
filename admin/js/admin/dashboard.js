function loaded(event){
    events(event);
}

function events(event){
    cargarDatos();
    change_navbar();
    load_stats();
    get_today_date();
    cargarFoto();
    changeProfilePhoto();
    fotoonChange();
    onshowtabscharts();
    onfind();
}

function onshowtabscharts(){
    $('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
        let target = event.target // newly activated tab
        let href = $(target).attr('href') //event.relatedTarget // previous active tab
        //animateCSS(href,'bounce')
    })
}


function cargarFoto() {
    let foto = $('#usuario_foto').data('value');
    if(!foto){
        $('.avatar-bg').css({
            'background':'url(/public/uploads/default-avatar.png)',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }else{
        $('.avatar-bg').css({
            'background':'url(/public/uploads/'+foto+')',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
    });
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
function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
}
function load_stats() {
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/stats/usuariosNuevosTabla",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        cargarTablaUsuariosNuevos(response);
    }, (error) => {

    });
}
function cargarTablaUsuariosNuevos(usuarios) {
    $('#list-comprobacion').html('');
    $('#statNuevoUsusariosNotificacion').append(usuarios.length);
    usuarios.forEach((u)=>{
        showTablaUsuariosNuevos(u);
    });
}
function showTablaUsuariosNuevos(u) {
    $('#list-comprobacion').append(`
        <a href="/admin/comprobacion" class="list-group-item list-group-item-action p-1 border-0">
            <div class="d-flex w-100 justify-content-between">
                <div class="row mx-0">
                    <div class="col-2 pr-0 pl-2 d-flex align-items-center">
                        <span class="rounded-circle py-1 px-2 text-white mr-2" 
                        style="background:${getRandomColor()}; display:block; width:35px; height:35px;">${u.nombre[0] + u.apellido[0]}</span>
                    </div>
                    <div class="col pl-3 pr-0">
                        <p class="mb-1 font-weight-bold">${u.nombre + ' ' + u.apellido}</p>
                        <small>${u.cedula}</small>
                    </div>
                </div>
                <div class="d-flex flex-column mb-auto justify-content-end pr-2">
                    <small class="mb-2">${moment(u.registro, "DD-MM-YYYY-h-mm").fromNow()}</small>
                    <span class="badge badge-primary">${u.tipo ? 'Estudiante' : 'Funcionario'}</span>
                </div>
            </div>
        </a>
    `);
}
function getRandomColor() {
    let number = Math.floor(Math.random() * 6) + 1;
    switch (number) {
        case 1:
            return '#6f42c1';
        case 2:
            return '#fd7e14';
        case 3:
            return '#20c997';
        case 4:
            return '#007bff';
        case 5: 
            return '#dc3545';
        case 6:
            return '#ffc107';
    }
}
function change_navbar(){
    let sizeScreen = $('body')[0].clientWidth;
    console.log(sizeScreen);
    
}
var g_links = [];
function cargarDatos() {
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getTalleres",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then(
        (response) => {
            let grupos = response.grupos;
            $('#talleres-stats').text(response.mxg.length);
            for (var [key, value] of Object.entries(grupos)) {
                addData(tallerCh,key, value);
            }
        },
        (error) => {}
    );
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getUsuarios",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then(
        (response) => {
            let cont = 0;
            for (var [key, value] of Object.entries(response)) {
                addData(usuarioCharVar, key, value);
                cont += value;
            }
            $('#usuarios-stats').text(cont);
            $('#estudiantestotales-stats').text(response.Estudiantes);

        },
        (error) => {}
    );
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getCasilleros",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then(
        (response) => {
            $('.casilleros-stats').text(response.total.length);
            let percentage = 100 - Math.round((response.uso.length / response.total.length) * 100);
            $('.casilleros-stats-per').text(percentage+'%');
            addData(casillerosChartVar,'En Uso', response.uso.length);
            addData(casillerosChartVar,'Sin Usar',response.total.length - response.uso.length);
        },
        (error) => {}
    );

    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getMorosos",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then(
        (response) => {
            console.log(response)
            $('.morosidad-stats').text(response.morosos);
            $('.reposiciones-stats').text(response.estudiantes - response.estado);
            let percentage = Math.round((response.morosos / response.estudiantes) * 100);
            let percentage1 = Math.round((response.estado / response.estudiantes) * 100);
            $('.morosidad-stats-per').text(percentage+'%');
            $('.reposiciones-stats-per').text(percentage1+'%');
            addData(morosidadChartVar,'Morosos', response.morosos);
            addData(morosidadChartVar,'Al dia', response.estudiantes - response.morosos);

            addData(reposicionesChartVar,'Activos', response.estado);
            addData(reposicionesChartVar,'Inactivos', response.estudiantes - response.estado);
        },
        (error) => {}
    );
    
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getReportes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then(
        (reportes) => {
            let todos = reportes.Agregados + reportes.Eliminados + reportes.Actualizados;
            addData(pieDonutChartVar,'Agregados', reportes.Agregados);
            addData(pieDonutChartVar,'Eliminados', reportes.Eliminados);
            addData(pieDonutChartVar,'Actualizados', reportes.Actualizados);
        },
        (error) => {}
    );
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getGrupos", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        fillCalendar(talleres);
        let cont = 0;
        let total = 0;
        talleres.forEach(e => {
            total +=  e.cupo_base;
            if(e.cupo_actual < e.cupo_base ){
                cont+= (e.cupo_base - e.cupo_actual);
            }
        })
        addData(cuposDisponiblesChartVar,'Disponibles', cont);
        addData(cuposDisponiblesChartVar,'Matriculados', total - cont);
        $('.cupos-stats').text(cont);
        let percentage = Math.round((cont / total) * 100);
        $('.cupos-stats-per').text(percentage+'%');
        
    }, (error) => {
    });

    $.ajax({
        type: "GET",
        url: "/admin/ajax/getUrls", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((urls) => {
        g_links = urls;
        getUrl(urls);
    }, (error) => {
    });
}
function getUrl(urls){
    $('.finder').html('');
    urls.forEach(u => {
        $('.finder').append(`
            <div class="row no-gutters mx-0 d-flex justify-content-between position-relative py-2 px-3 bg-white mb-2">
                <div class="col-md-7 d-flex justify-content-start">
                    <span class="d-block align-middle h-100 text-primary mt-3" style="font-size:30px; width:45px;">    
                        ${u.icon}
                    </span>
                    <div class="d-flex flex-column pl-2">
                        <h6 class="mt-0 font-weight-bold">${u.name}</h6>
                        <p class="text-muted mb-0">${u.description}</p>
                    </div>
                </div>
                <div class="col-md-5 d-flex justify-content-end align-items-center px-3" style="position:unset !important;">
                    <a href="${u.url}" class="mt-2 stretched-link btn btn-sm btn-primary d-block w-100">
                        <i class="fas fa-external-link-square-alt"></i> ${u.name}
                    </a>
                </div>
            </div>
            <hr>
        `);
    })
}

function onfind(){
    $('#dashboardSearch').on('keyup',function(event){
        let word = $('#dashboardSearch').val();
        let wordN = word;
        $('.finder').show();
        if(!word.length){
            $('.finder').hide();
        }
        word = word != '' ? word[0].toUpperCase() + word.slice(1) : '';
        let urls = g_links.filter(e => (
            e.name.includes(word) ||  e.name.includes(wordN) || includesVariation(e,wordN)
        ))
        getUrl(urls);
    })
}
function includesVariation(e,word){
    let varations = e.variation.split(',')
    let vec = varations.filter(v => 
        v.includes(word)
    );
    console.log(vec.length)
    return vec.length > 0;
}
var g_grupos = new Map();
function fillCalendar(grupos) {
    var eventsArray = [];
    grupos.forEach(e => {
        let p = e.nombre +' '+ e.apellido;
        let id_matricula = e.id_matricula;
        let grupo = parseInt(e.id_grupo);
        let codigo = e.codigo_taller;
        let descripcion = e.descripcion;
        // let titulo = e.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
        let dia = e.dia;
        let hora = e.hora > 12 ? e.hora - 12 + 'pm' : e.hora + 'am';
        let horaF = e.hora > 12 ? e.hora - 12 +':00': e.hora +':00' ;
        let horaFi = e.hora > 12 ? e.hora - 11 +':00': e.hora + 1 +':00' ;
        let weekday = toWeekDay(dia.toUpperCase());
        
        let todo = `Profesor: ${p} <br>${dia} a la${e.hora == 1 ? '':'s'} ${e.hora}`;
        let horainicio = e.hora + ":00";
        let horafinal = (e.hora + 1) + ":00";
        
        g_grupos.set(grupo,{
            title: descripcion,
            description: todo,
            startTime: horainicio,
            endTime: horafinal,
            icon : "swimmer",
            codigo: codigo
        })
        eventsArray.push({
            id: grupo,
            title: descripcion,
            startTime: horainicio,
            endTime: horafinal,
            daysOfWeek: [ weekday ], 
            backgroundColor: '#4659E4',
            borderColor: '#4659E4',
        });
        
    })
    //console.log(eventsArray)
    var calendarEl = document.getElementById('calendar');


    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'listWeek',
        lazyFetching: true,
        themeSystem: 'bootstrap',
        headerToolbar: {
            start: '',
            center: 'listWeek,timeGridWeek',
            end: ''
        },
        events: eventsArray,
        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Dia',
            list:     'Hoy'
        },
        eventClick: function(info) {
            // info.el.style.borderColor = 'red';
            let grupo = g_grupos.get(parseInt(info.event.id));
            $('#infoEventCalendar').html('')
            $('#infoEventCalendar').append(`
                <i class='fa fa-${grupo.icon}'></i> ${grupo.title} <br>
                ${grupo.description}
            `);
            $('#grupoHorarioLabel').html(`Grupo ${info.event.id} - ${grupo.title} `);
            $('#grupoHorario').modal();
          }
        // eventDidMount: function(info) {
        //     if (info.event.extendedProps.status === 'done') {
        
        //       // Change background color of row
        //       info.el.style.backgroundColor = 'red';
        
        //       // Change color of dot marker
        //       var dotEl = info.el.getElementsByClassName('fc-event-dot')[0];
        //       if (dotEl) {
        //         dotEl.style.backgroundColor = 'white';
        //       }
        //     }
        // }
      });
    
      calendar.render();
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
function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var d = date.getDate();
    var mo = date.getMonth();
    var y = date.getFullYear();
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    var time = d + " "+ monthNames[mo] + ", "+ y +" - "+ h + ":" + m + ":" + s + " " + session;
    //document.getElementById("MyClockDisplay").innerText = time;
    //document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);
    
}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
function updateChart(chart,data) {
    chart.data.datasets[0].data = data;
    chart.update();
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
document.addEventListener("DOMContentLoaded", loaded);