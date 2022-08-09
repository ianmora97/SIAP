var g_matriculados = new Array();
var g_grupos = new Array();
var g_mapGrupos = new Map();

var g_gruposAvailable = new Array();

var g_filterby = new Map();

var g_modalGrupoSelected = null;

var g_map_grupoSelected = new Map();

var g_maxGrupos = 0;

function loaded(event){
    loadOptions();
    loadDB();
    onModalOpen();
    onMatricular();
}
//admin/matricula/json
function loadOptions(){
    $.ajax({
        type: "GET",
        url: "/admin/matricula/json",
        contentType: "application/json",
    }).then((response) => {
        if(response){
            if(response.matricula.enable == "true"){
                location.href = '/';
            }
            g_maxGrupos = parseInt(response.matricula.cantidad);
        }
    },(error) => {
        console.log('error')
    });
}
function onMatricular(){
    $('#matricularBotonSelected').on('click', function (event) {
        let grupos = "";
        g_map_grupoSelected.forEach((e,i) => {
            grupos += `${e.id_grupo},`;
        });
        grupos = grupos.substring(0,grupos.length-1);
        window.location.href = '/client/matricula/new/'+grupos;
    });
}
function onModalOpen(){
    $('#seleccionarModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id_grupo = button.data('id') // Extract info from data-* attributes
        g_modalGrupoSelected = id_grupo;
        let grupo = g_mapGrupos.get(id_grupo);
        var modal = $(this)
        modal.find('.modal-title').html(`<i class="fas fa-swimmer"></i> Grupo ${grupo.id_grupo}`)
        modal.find('.modal-body').html(`
            <div class="row">
                <div class="col-12 px-0">
                    <div class="card border-0">
                        <div class="card-body py-0">
                            <h4 class="card-title font-weight-bold">${grupo.descripcion}</h4>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="fas fa-calendar-day text-primary"></i> ${grupo.dia} ${grupo.hora} - ${grupo.hora_final}
                                </small>
                            </p>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="fas fa-user-check text-primary"></i> ${grupo.nombre} ${grupo.apellido}
                                </small>
                            </p>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="fas fa-users text-primary"></i> <span id="modal_grupo_currect_${grupo.id_grupo}">${grupo.cupo_base - grupo.cupo_actual}</span> cupos disponibles
                                </small>
                            </p>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="fas fa-history text-primary"></i> <u>${moment(grupo.periodo,"YYYY-MM-DD").format('LL')}</u> al <u>${moment(grupo.periodo_final,"YYYY-MM-DD").format('LL')}</u>
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}
function seleccionarGrupo(){
    if(g_map_grupoSelected.size == 0) $('#listSelected').slideDown();
    if(g_map_grupoSelected.size < g_maxGrupos){
        let id_grupo = g_modalGrupoSelected;
        let grupo = g_mapGrupos.get(id_grupo);
        if(g_map_grupoSelected.has(parseInt(id_grupo))){
            Swal.fire({
                icon: 'warning',
                title: "El grupo ya esta seleccionado",
                showConfirmButton : false,
                timer: 1500,
                showClass: {
                    popup: 'animate__animated animate__fadeIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut'
                }
            });
        }else{
            $('#seleccionarModal').modal('hide');
            g_map_grupoSelected.set(parseInt(id_grupo),grupo);
            $('#gruposSelected').html('');
            g_map_grupoSelected.forEach((e,i) => {
                $('#gruposSelected').append(`
                    <div class="bg-light rounded-lg mb-1 p-2 bg-light" id="SelectedCursoId-${e.id_grupo}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="mb-0 d-block font-weight-bold">${e.descripcion}</small>
                                <small class="mb-0"><i class="fas fa-calendar-day text-primary"></i> ${e.dia} ${e.hora} - ${e.hora_final}</small>
                            </div>
                            <button type="button" class="btn btn-danger btn-sm" onclick="eliminarGrupoFromSelected(${e.id_grupo})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `);
            });
            buildListCards(g_grupos,g_matriculados);
        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: `Solo se pueden seleccionar ${g_maxGrupos} grupos`,
            timer: 5000,
        });
    }
}

function eliminarGrupoFromSelected(id_grupo){
    g_map_grupoSelected.delete(parseInt(id_grupo));
    $('#SelectedCursoId-'+id_grupo).remove();
    if(g_map_grupoSelected.size == 0) {
        $('#listSelected').slideUp();
    }
    buildListCards(g_grupos,g_matriculados);
}
function loadDB(){
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/api/client/matricula", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((grupos) => {
        g_grupos = grupos;
        $.ajax({
            type: "GET",
            url: "/api/client/inicio", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((matriculados) => {
            g_matriculados = matriculados;
            buildListCards(g_grupos,g_matriculados);
            $('#spinnerLoad').remove()
        }, (error) => {
        });
    }, (error) => {
    });
}
function loadOptionsFilter(data){
    $('#diasSelect').html('');
    let dia = new Set();
    data.forEach(g => {
        dia.add(g.dia);
    });
    dia.forEach((g) => {
        $('#diasSelect').append(`
            <button type="button" class="btn btn-toggle mb-2" data-toggle="button" onclick="addDatatoFilter('${g}')" 
            aria-pressed="false"><i class="fas fa-calendar-day"></i> ${g}</button>
        `);
    });
}
/**
 * 
 * @param {Array} grupos 
 * @param {Array} matriculados
 */
function buildListCards(grupos,matriculados){
    if(grupos.length > 0){
        $('#cursos').html('');
        g_gruposAvailable = grupos.filter(e => !g_map_grupoSelected.has(e.id_grupo)
        ).filter(e => {
            return !matriculados.some(m => {
                return m.id_grupo == e.id_grupo
            })
        }).filter(e => {
            return e.cupo_actual < e.cupo_base;
        }).filter(e => {
            return moment(e.periodo_final,"YYYY-MM-DD").isAfter(new moment());
        });
        loadOptionsFilter(g_gruposAvailable)
        g_gruposAvailable.forEach((e,i) => {
            g_mapGrupos.set(e.id_grupo,e);
            showCard(e,i)
        });
    }
}
function showCard(e,i){
    let color = ['primary','fresh1','fresh2','fresh3'];
    // let color_card = color[Math.floor(Math.random() * color.length)];
    let color_card = "primary";
    $('#cursos').append(`
        <div class="card-list-mat" style="animation-delay: ${i}50ms;" id="cursoId-${e.id_grupo}">
            <div class="borderContainer bef-${color_card}">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="font-weight-bold">${e.descripcion}</h3>
                    <small class="text-muted mb-0 d-block">${e.periodo}</small>
                </div>
                <div class="">
                    <small class="mb-0 text-muted"><i class="fas fa-calendar-day text-${color_card}" style="font-size: 12px;"></i> ${e.dia} ${e.hora} - ${e.hora_final}</small>
                </div>
                <a data-target="#seleccionarModal" data-toggle="modal" data-id="${e.id_grupo}" class="text-primary stretched-link text-decoration-none"><small>Seleccionar</small></a>
            </div>
        </div>
    `);
}
function addDatatoFilter(data){
    if(g_filterby.has(data)){
        g_filterby.delete(data);
    }else{
        g_filterby.set(data,true);
    }
    filterGrupos()
}
function filterGrupos(){
    if(g_filterby.size > 0){
        $('#cursos').html('');
        g_gruposAvailable.forEach((a,i) => {
            if(g_filterby.has(a.dia)){
                showCard(a,i);
            }
        });
    }else{
        buildListCards(g_grupos,g_matriculados);
    }
}
document.addEventListener('DOMContentLoaded', loaded);