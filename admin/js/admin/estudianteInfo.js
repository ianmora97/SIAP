
function loaded(event) {
    events(event);
}
function events(event) {
    cargar_estudiante();
}

var g_estudiante = {};
var g_talleres = new Array();

function cargar_estudiante() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    let cedulaID = $('#cedulaID').html();
    $.ajax({
        type: "GET",
        url: "/api/admin/estudiantes/getEstudiante/full",
        data: { cedulaID: cedulaID },
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        if(response === "NO_DATA"){
            console.warn('NO DATA');
        }else{
            g_estudiante.data = response.estudiante;
            g_estudiante.talleres = response.talleres;
            g_estudiante.conducta = response.conducta;
            g_estudiante.anotaciones = response.anotaciones;
            g_talleres = response.talleres_p;
            buildDataOnPage(g_estudiante);
            console.log(g_estudiante)
        }
        //$('#infoTiming-usuarios-estudiantes').text(t);
    }, (error) => {

    });
}

function buildDataOnPage(data){
    buildPrimaryInfo(data.data);
    buildSwitches(data.data);
    buildTalleres(data.talleres);
    buildConductas(data.conducta);
    buildAnotaciones(data.anotaciones);
    buildTalleresP(g_talleres);
}
function buildTalleresP(data){
    if(data.length > 0){
        data.forEach(e => {
            $("#talleresP").append(`
            <h5>${e.descripcion}</h5>
            <div class="progress">
                <div class="progress-bar progress-bar-striped" role="progressbar" id="tallerPro_${e.codigo}" 
                style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="border-top border-light"></div>
            `);
        });
    }else{
    }
}
function buildAnotaciones(data){
    if(data.length > 0){
        data.forEach(e => {
            $("#anotacionesList").append(`
            <div class="list-group-item  px-2">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h5 class="mb-1">${e.nota}</h5>
                    <small class="text-muted">${e.created_at.split(" ")[0]}</small>
                </div>
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <blockquote class="blockquote">
                        <footer class="blockquote-footer">Anotacion por: <cite title="Source Title">${e.nombre_profesor} ${e.apellido_profesor}</cite></footer>
                    </blockquote>
                </div>
            </div>
            <div class="border-top border-light"></div>
            `);
        });
    }else{
        $("#anotacionesList").append(`
            <div class="list-group-item  px-2">
                <div class="d-flex w-100 justify-content-center align-items-center">
                    <h5 class="mb-1 text-muted">No tiene anotaciones reportadas</h5>
                </div>
            </div>
            <div class="border-top border-light"></div>
        `);
    }
}
function buildConductas(data){
    if(data.length > 0){
        let strikes = 0;
        data.forEach(e => {
            $("#conductaList").append(`
            <div class="list-group-item  px-2">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h5 class="mb-1 font-weight-bold"><i class="fas fa-circle text-${e.tipo === "Eventualidad" ? "warning" : "danger" } pr-2"></i>${e.tipo}</h5>
                </div>
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <p class="mb-1 text-muted">${e.texto}</p>
                </div>
            </div>
            <div class="border-top border-light"></div>
            `);
            strikes += e.strike;
            $("#strikesCounter").html(strikes);
        });
    }else{
        $("#conductaList").append(`
            <div class="list-group-item  px-2">
                <div class="d-flex w-100 justify-content-center align-items-center">
                    <h5 class="mb-1 text-muted">No tiene conductas reportadas</h5>
                </div>
            </div>
            <div class="border-top border-light"></div>
        `);
        $("#strikesCounter").html("0");
    }
}
function buildTalleres(data){
    if(data.length > 0){
        data.forEach(e => {
            $("#talleresList").append(`
                <div class="list-group-item  px-2">
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <h5 class="mb-1 font-weight-bold"><i class="fas fa-swimmer pr-2 text-primary"></i>${e.descripcion}</h5>
                        <small class="text-muted">${e.periodo}</small>
                    </div>
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <p class="mb-1 text-muted">${e.dia} ${e.hora}-${e.hora + 1}</p>
                        <small class="">${e.activa ? "Activa" : "Inactiva" } <i class="fas fa-circle text-${e.activa ? "success" : "danger" }"></i></small>
                    </div>
                </div>
                <div class="border-top border-light"></div>
            `)
        });
    }else{
        $("#talleresList").append(`
            <div class="list-group-item  px-2">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h5 class="mb-1 font-weight-bold">No tiene talleres matriculados</h5>
                </div>
            </div>
            <div class="border-top border-light"></div>
        `)
    }
}
function buildPrimaryInfo(data){
    $('#nombreEstudiante').html(`${data.nombre} ${data.apellido}`);
    $('#tipodeUsuario').html(data.tipo);
    $("#fotoPerfil").attr("src","/public/uploads/"+data.foto);

    $("#v_nombre_usuario").val(data.usuario);
    $("#v_correo").val(data.correo);
    $("#v_fec_nacimiento").val(data.nacimiento);
    $("#v_sexo").val(data.sexo);
    $("#v_Dirección").val(data.direccion);
    $("#v_telefono").val(data.telefono);
    $("#v_celular").val(data.celular);
    $("#v_carrera").val(data.carrera_departamento);
    $("#v_perfil").val(data.tipo);

}
function buildSwitches(data){
    // ! Morosidad
    $('#customSwitch_cedulaMorosidad').prop('checked', (parseInt(data.moroso)) === 1 ? true : false);
    $("#morosoEstudianteText").html(`<i class="fas fa-circle ${(parseInt(data.moroso)) === 1 ? "text-warning" : "text-light"}"></i>`)
    // ! Estado
    $('#customSwitch_cedulaEstado').prop('checked', (parseInt(data.estado)) === 1 ? true : false);
    $("#estadoEstudianteText").html(`
    <small class="text-muted">${(parseInt(data.estado)) !== 1 ? "Inactivo" : "Activo"}</small>
    <i class="fas fa-circle ${(parseInt(data.estado)) !== 1 ? "text-danger" : "text-success"}"></i>`)
}
function cambiarMorosidadEst(checkbox){
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    let cedulaID = $('#cedulaID').html();
    let data = {
        cedula: cedulaID,
        moroso: checkbox.checked ? 1 : 0
    }
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarMorosidad",
        data:data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows > 0){
            $("#textoAlertSuccessUp").html("La <b>Morosidad</b> se actualizó correctamente.")
            $("#morosoEstudianteText").html(`<i class="fas fa-circle text-${checkbox.checked ? "warning" : "light"}"></i>`);
            $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
        }
    });
}
function cambiarEstadoEst(checkbox){
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    let cedulaID = $('#cedulaID').html();
    let data = {
        cedula: cedulaID,
        estado: checkbox.checked ? 1 : 0
    }
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarEstado",
        data:data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows > 0){
            $("#textoAlertSuccessUp").html("El <b>Estado</b> se actualizó correctamente.")
            $("#estadoEstudianteText").html(`
            <small class="text-muted">${checkbox.checked ? "Activo" : "Inactivo"}</small>
            <i class="fas fa-circle ${checkbox.checked ? "text-success" : "text-danger"}"></i>`);
            $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
        }
    });
}
function actualizarDatosEstudiante(){
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    let cedulaID = $('#cedulaID').html();
    let nombre = $('#nombreEstudiante').html();
    let tipo = $('#tipodeUsuario').html();

    let correo = $('#v_correo').val();
    let nacimiento = $('#v_fec_nacimiento').val();
    let sexo = $('#v_sexo').val();
    let direccion = $('#v_Dirección').val();
    let telefono = $('#v_telefono').val();
    let celular = $('#v_celular').val();
    let carrera = $('#v_carrera').val();
    let perfil = $('#v_perfil').val();
    let usuario = $('#v_nombre_usuario').val();
    let data = {
        cedula: cedulaID,
        tipo: tipo,
        correo: correo,
        nacimiento: nacimiento,
        sexo: sexo,
        direccion: direccion,
        telefono: telefono,
        celular: celular,
        carrera: carrera,
        tipo: perfil,
        usuario: usuario,
    }
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarDatos",
        data:data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows > 0){
            $("#textoAlertSuccessUp").html("Los <b>Datos Personales</b> se actualizaron correctamente.")
            $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
        }
    });
}

document.addEventListener("DOMContentLoaded", loaded);