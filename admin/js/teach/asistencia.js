var g_grupo = {}
var g_Matriculados = new Array();
var g_mapMatriculados = new Map();
var g_asistencias = new Array();
var g_asistenciasVerify = new Array();
var g_Map_asistenciasVerify = new Map();
var g_mapAsistencias = new Map();

var cameraIsOpen = false;
var self = this;

function loaded(event){
    events(event);
}
function events(e){
    loadFromDB();
    enviarAsistencia();
    abrirCamara();
}
function enviarAsistencia(){
    $('#btnEnviarAsistencia').on('click', function(e){
        e.preventDefault();
        $('#btnCamara').css('display', 'block');
        html5QrcodeScanner.clear();
        let data = new Array();
        let id_grupo = g_grupo.id_grupo;
        let f = new Date();
        let fecha = `${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}`;
        g_Matriculados.forEach(e =>{
            if(e.activa){
                if(g_mapAsistencias.get(e.cedula) == undefined){
                    if(g_Map_asistenciasVerify.get(e.cedula) != undefined){ //paso y esta
                        data.push({
                            estado: 1,
                            est: parseInt(e.id_estudiante),
                            grupo: parseInt(id_grupo),
                            fecha: fecha
                        });
                    }else{
                        
                    }
                }
            }
        });
        
        let bearer = 'Bearer '+g_token;
        data.forEach((e,i) =>{
            console.log(e)
            $.ajax({
                type: 'GET',
                url: '/teach/enviarAsistencia',
                data: e,
                contentType: "application/json",
                headers: {
                    'Authorization': bearer
                },
            }).then((response) => {
                console.log(response)
            },(error) => {
                
            });
            if(i == data.length-1){
                Swal.fire({
                    icon: 'success',
                    title: 'Asistencia Enviada',
                    html: `<p>La asistencia se ha enviado correctamente</p>
                    `,
                    showDenyButton: true,
                    confirmButtonText: 'Cerrar',
                    timer: 5000,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // window.location.reload()
                    }else if (result.isDenied) {
                    }
                });
            }
        })
    });
}
function abrirCamara(){
    $('#btnCamara').on('click', function(e){
        e.preventDefault();
        $('#btnCamara').css('display', 'none');
        openScanner();
    });
}
var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 280, disableFlip: true });
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Scan result:`, decodedText);
    let cedula = decodedText;

    let est = g_mapMatriculados.get(cedula);
    if(est.id_grupo == g_grupo.id_grupo){
        if(est){
            if(est.activa == 1){
                let flag = true;
                html5QrcodeScanner.clear();
                Swal.fire({
                    icon: 'success',
                    title: 'Matrícula Confirmada',
                    html: `<p>La matricula se encuentra activa</p>
                    <p><i class="fas fa-calendar-day text-primary"></i> ${est.dia} ${est.hora} ${est.hora_final}</p>
                    `,
                    showDenyButton: true,
                    confirmButtonText: 'Pasar Asistencia',
                    denyButtonText: `Cerrar`,
                    timer: 5000,
                    timerProgressBar: true,
                }).then((result) => {
                    html5QrcodeScanner.render(onScanSuccess, onScanError);
                    if (result.isConfirmed) {
                        showVerify(est);
                        // g_asistenciasVerify.push(est);
                        g_Map_asistenciasVerify.set(est.cedula, est);
                    }else if (result.isDenied) {
                        console.log('no existe');
                    }else if (result.dismiss === Swal.DismissReason.timer && flag) {
                        showVerify(est);
                        // g_asistenciasVerify.push(est);
                        g_Map_asistenciasVerify.set(est.cedula, est);
                    }
                });
            }else{
                html5QrcodeScanner.clear();
                Swal.fire({
                    icon: 'error',
                    title: 'El estudiante se encuentra inactivo',
                    html: `La matricula se encuentra activa
                    <br>
                    <p>${decodedText}</p>
                    `,
                }).then((result) => {
                    if (result.isConfirmed) {
                        html5QrcodeScanner.render(onScanSuccess, onScanError);
                    }
                });
            }
        }else{
            Swal.fire({
                icon: 'danger',
                title: 'El estudiante no se encuentra matriculado',
            }).then((result) => {
                if (result.isConfirmed) {
                    html5QrcodeScanner.render(onScanSuccess, onScanError);
                }
            });
        }
    }else{ // ! el grupo no coincide
        let al = "";
        cursos.forEach(e =>{
            al += `<i class="fas fa-exclamation-triangle text-warning"></i> `+e.split('-')[2]+'<br>';
        })
        Swal.fire({
            icon: 'danger',
            title: 'El grupo no coincide',
            html: `${al}`
        }).then((result) => {
            if (result.isConfirmed) {
                html5QrcodeScanner.render(onScanSuccess, onScanError);
            }
        });
    }
}
function onScanError(errorMessage) {
    Swal.fire({
        icon: 'danger',
        title: 'Matrícula Confirmada',
        html: `La matricula se encuentra activa
        <br>
        <p>${decodedText}</p>
        `,
    }).then((result) => {
        if (result.isConfirmed) {
            html5QrcodeScanner.render(onScanSuccess, onScanError);
        }
    });
}
function openScanner(){
    html5QrcodeScanner.render(onScanSuccess, onScanError);
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
        openScanner();
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
            }else{
                $('#contentLista').html('<h5 class="text-center text-muted mt-5 flex-fill">No tiene grupos asignados aun</h2>')
            }
            $.ajax({
                type: "GET",
                url: "/api/teach/getAsistenciaByGroup",
                data: {grupo},
                contentType: "application/json",
                headers: {
                    'Authorization': bearer
                },
            }).then((response) => {
                g_asistencias = response;
                g_asistencias.forEach(g => {
                    let fechahoy = moment().format('DD-MM-YYYY');
                    if(g.fecha == fechahoy){
                        g_mapAsistencias.set(g.cedula,g);
                    }
                });
                showAsistenciasdeHoy();
            }, (error) => {
                
            });
        }, (error) => {
            
        });
    }, (error) => {
        
    });
}
function showGrupoInfo(data){
    $('#infoGrupo').html(`
        <div class="bg-white position-relative">
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex justify-content-between aling-items-start w-100">
                    <div class="mx-0">
                        <a type="button" href="/teach/grupo/${data.id_grupo}" class="btn px-0"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
                    </div>
                    <div class="d-flex align-items-center">
                        <h6 class="font-weight-bold mb-0">${data.descripcion}</h6>
                    </div>
                    <div>
                        <span class="text-white btn px-0"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                    </div>
                </div>
            </div>
            <div class="text-center animate__animated animate__fadeInDown">
                <small class="text-muted mb-0"><i class="fas fa-calendar pr-1"></i> ${data.dia}</small>
                <small class="text-muted mb-0"> ${data.hora} - ${data.hora_final}</small>
            </div>
        </div>
    `);
}
function showVerify(e){
    $('#contentLista').append(`
        <div class="bg-white border-bottom p-4 position-relative w-100">
            <div class="d-flex justify-content-start align-items-center">
                <div class="mr-2">
                    <img src="/public/uploads/${e.foto}" class="rounded-circle" width="50" height="50">
                </div>
                <div>
                    <p class="mb-0 text-muted"><i class="fas fa-check-circle text-success"></i> Verificado</p>
                    <p class="font-weight-bold mb-0">${e.nombre} ${e.apellido}</p>
                </div>
            </div>
            <a class="stretched-link" data-toggle="modal" data-target="#crearAnotacion" data-cedula="${e.cedula}"></a>
        </div>
    `);
}
function weekDayToInt(day){
    let d = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
    return d.indexOf(day) == new Date().getDay() ? d.indexOf(day) : -1;
}
function showAsistenciasdeHoy(){
    //#asistenciaEnviada
    let dia = weekDayToInt(new Date().getDay());
    let asistencias = g_asistencias.filter(e => weekDayToInt(e.dia) == dia);
    let hoy = moment().format('YYYY-MM-DD');
    let all = asistencias.filter(e =>{
        let fecha = moment(e.fecha);
        return fecha.format('YYYY-MM-DD') == hoy;
    })

    if(all.length > 0){
        all.forEach(e => {
            if(g_mapAsistencias.has(e.cedula)){
                showAsistencia(e,g_mapAsistencias.get(e.cedula));
            }else{
                showAsistencia(e,null);
            }
        });
    }
}

function showAsistencia(a,b){
    $('#asistenciaEnviada').append(`
        <div class="bg-white border-bottom p-4 position-relative w-100">
            <div class="d-flex justify-content-start align-items-center">
                <div class="mr-2">
                    <img src="/public/uploads/${a.foto}" class="rounded-circle" width="50" height="50">
                </div>
                <div>
                    <p class="mb-0 text-muted"><i class="fas fa-check-circle text-success"></i> Verificado</p>
                    <p class="font-weight-bold mb-0">${a.nombre} ${a.apellido}</p>
                </div>
            </div>
        </div>
    `);

}

document.addEventListener('DOMContentLoaded', loaded);