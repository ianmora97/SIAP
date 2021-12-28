
var g_contAusentes = 0;
var g_mediaEstudiantes = 0; //cantidad de estudiantes ausentes / estudiantes totales(matriculados) * 100

var navCreateGroups = (item,i) =>{
    let c = item.cupo_actual;
    console.log(item)
    return `
    <div class="col-12 mt-4">
        <div class="card-grupo animate__animated animate__backInUp" style="animation-delay: ${i}00ms; min-height:362px;" id="grupoid-${item.id_grupo}-tab" >
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="pl-2 rounded-circle bg-light-alt" style="width: 45px; height: 45px;">
                    <img src="/img/emoji/man-swim.png" class="" style="width: 85%;">
                </div>
                <div class="d-flex justify-content-end align-items-center">
                    <small class="text-muted">Grupo ${item.id_grupo}</small>
                    <a class="btn btn-white btn-sm stretched-link text-muted" href="/admin/asistencia/grupo/${item.id_grupo}"><i class="fas fa-external-link-square-alt"></i></a>
                </div>
            </div>
            <div class="d-flex justify-content-start flex-column">
                <h2 class="font-weight-bold">${item.descripcion}</h2>
                <p class="text-muted">En este grupo hay <span class="text-secondary">${c}</span> estudiante${c == 1 ? '':'s'} matriculado${c == 1 ? '':'s'}.</p>
                <div class="mt-2">
                    <p class="text-muted"><i class="fas fa-user-tie pr-1"></i> <small>${item.nombre} ${item.apellido}</small></p>
                    <p class="text-muted"><i class="fas fa-calendar pr-1"></i> <small>${item.dia} ${item.hora}-${item.hora_final}</small></p>
                </div>
            </div>
        </div>
        <script>
            tippy('#grupoid-${item.id_grupo}-tab', {
                content: 'Ver asistencia del grupo ${item.id_grupo}',
                placement: 'top',
                animation: 'shift-away-extreme',
            });
        </script>
    </div>
    `;
}


function loaded(event){
    events(event);
}

function events(event){
    bringData();
}

var g_grupos = [];
function bringData(){
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/reportes/asistencia/getGrupos",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        g_grupos = response;
        fillNavTabs(response);
        closeProgressBarLoader();
    }, (error) => {
    });
}

var g_cantidadEstudiantes =0;
function fillNavTabs(data) {
    $('#grupos-tab').html('');
    data.forEach((g,i)=>{
        if(g.estado == 'Ausente'){
            g_contAusentes++;
        }
        $('#grupos-tab').append(navCreateGroups(g,i));
        g_cantidadEstudiantes += g.cupo_actual;
    });
    g_mediaEstudiantes = (g_cantidadEstudiantes - (g_contAusentes/g_cantidadEstudiantes));
    $('#estudiantes_ausentes_stats').html(g_contAusentes);
    $('#estudiantes_media_stats').html(g_mediaEstudiantes+'<small>%</small>');
    $('#estudiantes_total_stats').html(g_cantidadEstudiantes);
}

document.addEventListener("DOMContentLoaded", loaded);