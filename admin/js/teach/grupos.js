var g_grupo = {}
var g_Matriculados = new Array();
var g_mapMatriculados = new Map();

function loaded(event){
    events(event);
}
function events(e){
    loadFromDB()
    onModalOpen();
}
function loadFromDB(){
    let bearer = 'Bearer '+g_token;
    let grupo = $('#idGrupo').html();
    $.ajax({
        type: "GET",
        url: "/api/teach/grupo",
        data: {grupo},
        contentType: "application/json",
        headers: {
            'Authorization': bearer
        },
    }).then((response) => {
        g_grupo = response;
        showGrupoInfo(response)
        $.ajax({
            type: "GET",
            url: "/api/teach/grupoMatriculados",
            data: {grupo},
            contentType: "application/json",
            headers: {
                'Authorization': bearer
            },
        }).then((response) => {
            if(response.length > 0){
                g_Matriculados = response;
                g_Matriculados.forEach(g => {
                    g_mapMatriculados.set(g.cedula,g);
                });
                showMatriculados(response);
            }else{
                $('#contentLista').html('<h5 class="text-center text-muted mt-5">No tiene grupos asignados aun</h2>')
            }
        }, (error) => {
            
        });
    }, (error) => {
        
    });
}
function showGrupoInfo(data){
    let pasar = `<a class="btn btn-primary btn-sm mt-2" href="/teach/asistencia/${data.id_grupo}"><i class="fas fa-external-link-square-alt"></i> Pasar Asistencia</a>`
    $('#infoGrupo').html(`
        <div class="bg-white position-relative">
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex justify-content-between aling-items-start w-100">
                    <div class="mx-0">
                        <a type="button" href="/teach/inicio" class="btn px-0"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
                    </div>
                    <div class="d-flex align-items-center">
                        <h6 class="font-weight-bold mb-0">${data.descripcion}</h6>
                    </div>
                    <div>
                        <span class="text-white btn px-0"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                    </div>
                </div>
            </div>
            <div class="mt-2 text-center animate__animated animate__fadeInDown">
                <small class="text-muted mb-0"><i class="fas fa-calendar pr-1"></i> ${data.dia}</small>
                <small class="text-muted mb-0"> ${data.hora} - ${data.hora_final}</small>
            </div>
            <div class="d-flex justify-content-center">
                ${weekDayToInt(data.dia) != -1 ? pasar : ''}
            </div>
        </div>
    `);
}
function showMatriculados(data){
    data.forEach((e,i) =>{
        $('#contentLista').append(`
            <div class="bg-white border-bottom p-4 position-relative w-100 animate__animated animate__slideInLeft" style="animation-delay:${i}00ms;">
                <div class="d-flex justify-content-start align-items-center">
                    <div class="mr-2">
                        <img src="/public/uploads/${e.foto}" class="rounded-circle" width="50" height="50">
                    </div>
                    <div>
                        <h6 class="font-weight-bold mb-0">${e.nombre} ${e.apellido}</h6>
                    </div>
                </div>
                <a class="stretched-link" data-toggle="modal" data-target="#crearAnotacion" data-cedula="${e.cedula}"></a>
            </div>
        `);
    });
}
function weekDayToInt(day){
    let d = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
    return d.indexOf(day) == new Date().getDay() ? d.indexOf(day) : -1;
}
function onModalOpen(){
    $('#crearAnotacion').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var cedula = button.data('cedula')
        var modal = $(this)
        let estudiante = g_mapMatriculados.get(cedula+'');
        modal.find('.modal-body').html(`
            <div class="d-flex justify-content-center flex-column align-items-start w-100 ">
                <div class="my-3 d-flex justify-content-center w-100">
                    <img src="/public/uploads/${estudiante.foto}" class="rounded-circle" width="200px" height="200px">
                </div>
                <div class="w-100 text-center">
                    <h6 class="font-weight-bold mb-0">${estudiante.nombre} ${estudiante.apellido}</h6>
                    <p class="text-muted mb-0">${estudiante.cedula}</p>
                    <a href="mailto:${estudiante.correo}">${estudiante.correo}</a>
                </div>
            </div>
        `);            
    })
}


document.addEventListener('DOMContentLoaded', loaded);