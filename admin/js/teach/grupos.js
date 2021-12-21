var g_grupos = new Array();
var g_mapGrupos = new Map();

function loaded(event){
    events(event);
}
function events(e){
    loadFromDB()
}

function loadFromDB(){
    console.log('loadFromDB')
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/api/teach/inicio",
        contentType: "application/json",
        headers: {
            'Authorization': bearer
        },
    }).then((response) => {
        if(response.length > 0){
            g_grupos = response;
            g_grupos.forEach(g => {
                g_mapGrupos.set(g.id_grupo,g);
            });
            showGrupos(response)
        }else{
            $('#contentLista').html('<h5 class="text-center text-muted mt-5">No tiene grupos asignados aun</h2>')
        }
    }, (error) => {
        
    });
}
function showGrupos(data){
    data.forEach((g,i)=>{
        showGrupo(g,i)
    })
}
function showGrupo(item,i){
    let c = item.cupo_actual;
    $('#contentLista').append(`
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
    `);
}

document.addEventListener('DOMContentLoaded', loaded);