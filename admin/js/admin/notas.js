var g_notas = new Array();
var g_MapNotas = new Map();

function loaded(event) {
    events(event);
}

function events(event) {
    loadFromDb();
    onModalOpen();
    onGuardarNota();
    checkForParse();
    onborrarNota();
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
    $('#modalVer').on('show.bs.modal', (e) => {
        let id = $(e.relatedTarget).data('id');
        let nota = g_MapNotas.get(parseInt(id));
        $("#idNotaabierta").html(nota.id);
        $('#modalVerLabel').text(nota.title);
        $('#subtitleModalVer').text(nota.subtitle);
        $('#modalBodyVer').html(marked.parse(nota.description));
    });
}
function reloadData(){
    loadFromDb();
    $("#tituloAgregar").val('');
    $("#subtituloAgregar").val('');
    $("#contenidoAgregar").val('');
    g_MapNotas.clear();
}
function loadFromDb(){
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/api/admin/notas",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((notas) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        g_notas = notas;
        mostrarNotas(notas);
        closeProgressBarLoader();
    },(error) => {
        console.log('error')
    });
}
function mostrarNotas(notas){
    $("#notas-tab").html('');
    $("#statsTotal1").html(notas.length);
    if(notas.length > 0){
        notas.forEach((e,i)=>{
            g_MapNotas.set(e.id,e);
            printNotas(e,i);
        });
    }else{
        $("#notas-tab").html('<div class="text-muted">No hay notas</div>');
    }
}
function printNotas(e,i){
    let fecha = moment(e.created_at).format('DD/MM/YYYY');
    let html = `
        <div class="col-4 mt-4">
            <div class="card-grupo animate__animated animate__backInUp" style="animation-delay: ${i}00ms; min-height:200px;" id="notaid-${e.id}-tab" >
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="pl-2 rounded-circle bg-light-alt" style="width: 45px; height: 45px;">
                        <img src="/img/emoji/man-swim.png" class="" style="width: 85%;">
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <small class="text-muted">${fecha}</small>
                        <a role="button" href="#" data-id="${e.id}" data-toggle="modal" data-target="#modalVer" class="btn btn-white stretched-link btn-sm"><i class="text-primary fas fa-sticky-note"></i></a>
                    </div>
                </div>
                <div class="d-flex justify-content-start flex-column">
                    <h2 class="font-weight-bold">${e.title}</h2>
                    <p class="text-muted">${e.subtitle}</p>
                </div>
            </div>
            <script>
                tippy('#notaid-${e.id}-tab', {
                    content: '${e.title}',
                    placement: 'top',
                    animation: 'shift-away-extreme',
                });
            </script>
        </div>
    `;
    $("#notas-tab").append(html);
}
function onGuardarNota(){
    $("#btnGuardarNota").click(function(){
        let title = $("#tituloAgregar").val();
        let subtitle = $("#subtituloAgregar").val();
        let description = $("#contenidoAgregar").val();
        let nota = {
            title: title,
            subtitle: subtitle,
            description: description
        }
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "POST",
            url: "/api/admin/notas",
            data: JSON.stringify(nota),
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((notas) => {
            $('#modalAgregar').modal('hide');
            reloadData();
        },(error) => {
            console.log('error')
        });
    });
}
function checkForParse(){
    $("#contenidoAgregar").on('keyup', function(){
        let text = $(this).val();
        $("#contentParseMd").html(marked.parse(text));
    });
}
function onborrarNota(){
    $("#borrarNota").click(function(){
        let id = parseInt($("#idNotaabierta").html());
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "DELETE",
            url: "/api/admin/notas/"+id,
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((notas) => {
            $('#modalVer').modal('hide');
            reloadData();
        },(error) => {
            console.log('error')
        });
    });
}
document.addEventListener('DOMContentLoaded', loaded);