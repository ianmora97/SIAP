
function loaded(event) {
    events(event);
}
function events(event) {
    cargar_estudiante();
    changeProfilePhoto();
    fotoonChange();
    onOpenCameraModalApp();
    tipodedatosOnchange();
}

function tipodedatosOnchange(){
    $('#tipodedatos').on('change',function(event){
        let option = $(this).val();
        if(option == 'secundario'){
            $('#containerPrimario').slideUp();
            $('#containerSecundario').slideDown();
        }else{
            $('#containerSecundario').slideUp();
            $('#containerPrimario').slideDown();
        }
    })
}

var g_estudiante = {};
var g_talleres = new Array();
var g_talleres_all = new Map();

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
        closeProgressBarLoader();
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getTalleres",
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((talleres) => {
            g_talleres_all = new Map(talleres.map(e => [e.descripcion, e]));
            showTalleres(talleres);
        }, (error) => {
    
        });
    }, (error) => {

    });
}
function showTalleres(talleres){
    $("#nivelEstudianteSelect").empty();
    talleres.forEach(e => {
        if(g_estudiante.data.descripcion === e.descripcion){
            $("#nivelEstudianteText").html(`<i class="fas fa-layer-group text-${e.color}"></i>`);
            $("#nivelEstudianteSelect").append(`<option value="${e.nivel}" selected>${e.descripcion}</option>`);
        }else{
            $("#nivelEstudianteSelect").append(`<option value="${e.nivel}">${e.descripcion}</option>`);
        }
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
                        <p class="mb-1 text-muted">${e.dia} ${e.hora}-${e.hora_final}</p>
                        <small class="">${e.activa ? "Activa" : "Inactiva" } <i class="fas fa-circle text-${e.activa ? "success" : "danger" }"></i></small>
                    </div>
                </div>
                <div class="border-top border-light"></div>
            `)
        });
    }else{
        $("#talleresList").append(`
            <div class="list-group-item  px-2">
                <div class="w-100 text-center">
                    <h6 class="mb-1 text-muted font-italic">No tiene talleres matriculados</h6>
                    ${g_estudiante.data.estado === 1 && g_estudiante.data.moroso === 0 ? 
                        `<a href="/admin/matricula/add/${g_estudiante.data.cedula}" class="text-secondary">Matricular</a>`
                        :''}
                </div>
            </div>
            <div class="border-top border-light"></div>
        `)
    }
}
function progresoPorcentaje(pinicio, pfin){
    let inicio = moment(pinicio,'YYYY-MM-DD'); // matriculacion
    let fin = moment(pfin,'YYYY-MM-DD'); // periodo final del curso
    let hoy = moment();
    let avanzado = hoy.diff(inicio, 'days');
    return (avanzado * 100) / (fin.diff(inicio, 'days'));
}
function buildTalleresP(data){
    let newM = new Map();
    data.forEach(e => {
        newM.set(e.codigo_taller, e);
    });
    if(newM.size > 0){
        newM.forEach(e => {
            let p = progresoPorcentaje(e.created_at,e.periodo_final);
            $("#talleresP").append(`
                <h5>${e.descripcion}</h5>
                <div class="progress">
                    <div class="progress-bar bg-secondary progress-bar-striped progress-bar-animated" role="progressbar" id="tallerPro_${e.codigo_taller}" 
                    style="width: 0%" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" data-to="${p}"></div>
                </div>
                <div class="border-top border-light"></div>
            `);
            $("#tallerPro_"+e.codigo_taller).animate({
                width: p+"%"
            }, 1000);
            // add class progress-bar-animated
            setTimeout(() => {
                $("#tallerPro_"+e.codigo_taller).removeClass('progress-bar-animated');
            }, 1500);
        });
    }else{
        $("#talleresP").append(`
            <div class="list-group-item  px-2">
                <div class="w-100 text-center">
                    <h6 class="mb-1 text-muted font-italic">No tiene talleres matriculados</h6>
                    ${g_estudiante.data.estado === 1 && g_estudiante.data.moroso === 0 ? 
                        `<a href="/admin/matricula/add/${g_estudiante.data.cedula}" class="text-secondary">Matricular</a>`
                        :''}
                </div>
            </div>
            <div class="border-top border-light"></div>
        `);
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
                    <h6 class="mb-1 text-muted font-italic">No tiene anotaciones reportadas</h6>
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
                <div class="w-100 text-center">
                    <h6 class="mb-1 text-muted font-italic">No tiene conductas reportadas</h6>
                    <a href="/admin/reportes/conducta/add" class="text-secondary">Reportar Conducta</a>
                </div>
            </div>
            <div class="border-top border-light"></div>
        `);
        $("#strikesCounter").html("0");
    }
}

function buildPrimaryInfo(data){
    $('#idEstudiante').html(data.id_estudiante);
    $('#v_cedula').val(data.cedula);
    $('#nombreEstudiante').html(`${data.nombre} ${data.apellido}`);
    $('#tipodeUsuario').html(data.tipo);
    $("#fotoPerfil").attr("src","/public/uploads/"+data.foto);
    //correo on correoUsuariosend
    $("#correoUsuariosend").html(data.correo);
    $("#correoUsuariosend").attr("href","mailto:"+data.correo);
    
    let nomE = data.telefono_emergencia == null ? '':data.telefono_emergencia.split('&')[1];
    let telE = data.telefono_emergencia == null ? '':data.telefono_emergencia.split('&')[0];
    
    $('#estudianteIdcambiocedula').val(data.cedula);
    $('#cedulaCambio').val(data.cedula);


    $('#v_telefonoEmergenciaNombre').val(nomE)
    $('#v_telefonoEmergencia').val(telE)
    $('#v_padecimientos').val(data.padecimientos)

    $("#v_nombre_usuario").val(data.usuario);
    $("#v_correo").val(data.correo);
    $("#v_fec_nacimiento").val(data.nacimiento);
    $("#v_sexo").val(data.sexo);
    $("#v_Dirección").val(data.direccion);
    $("#v_telefono").val(data.telefono);
    $("#v_celular").val(data.celular);
    $("#v_carrera").val(data.carrera_departamento);
    $("#v_perfil").val(data.tipo);

    var qrcode = new QRCode(document.getElementById("qrImg"), {
        text: data.cedula,
    });
    console.log(qrcode)

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
function cambiarNivel(drop){
    let bearer = 'Bearer '+g_token;
    let cedulaID = $('#cedulaID').html();
    let data = {
        cedula: cedulaID,
        nivel: drop.value
    }
    console.log(data);
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarNivel",
        data:data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows > 0){
            $("#textoAlertSuccessUp").html("El <b>nivel</b> se actualizó correctamente.");
            g_talleres_all.forEach(e => {
                if(drop.value === e.descripcion){
                    $("#nivelEstudianteText").html(`<i class="fas fa-layer-group text-${e.color}"></i>`);
                }
            });
        }
    });
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
            // $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
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
            // $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
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
function actualizarDatosEstudianteSecundario(){
    let bearer = 'Bearer '+g_token;
    let id = $('#idEstudiante').html();
    let emergencia = `${$('#v_telefonoEmergencia').val()}&${$('#v_telefonoEmergenciaNombre').val()}`;
    let padecimientos = $('#v_padecimientos').val();
    let data = {
        emergencia, padecimientos,id
    }
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/actualizarDatosSecundarios",
        data:data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.affectedRows > 0){
            $("#textoAlertSuccessUp").html("Los <b>Datos Secundarios</b> se actualizaron correctamente.")
            $("#feedback_alerta_success").fadeIn('slow').animate({opacity: 1.0}, 3000).fadeOut('slow');
        }
    });
}
function pdfDownload() {
    let est = g_estudiante.data;
    let data = new Array();
    for(let i = 0; i < g_estudiante.talleres.length; i++){
        let el =  g_estudiante.talleres[i];
        data.push([
            el.descripcion,
            el.dia,
            el.hora + ' - ' + el.hora_final,
            moment(el.created_at, 'YYYY-MM-DD').format('ll'),
            moment(el.periodo, 'YYYY-MM-DD').format('ll') + ' - ' + moment(el.periodo_final, 'YYYY-MM-DD').format('ll')
        ]);
    }
    let conductas = new Array();
    for(let i = 0; i < g_estudiante.conducta.length; i++){
        let el =  g_estudiante.conducta[i];
        conductas.push([ el.texto,el.tipo,moment(el.created_at.split(' ')[0], 'YYYY-MM-DD').format('ll')]);
    }
    let titulo = `Reporte de Estudiante ${est.nombre}`;
    var doc = new jsPDF('p', 'pt', 'letter');  
    var htmlstring = '';  
    var tempVarToCheckPageHeight = 0;  
    var pageHeight = 0;  
    pageHeight = doc.internal.pageSize.height;  
    specialElementHandlers = {  
        '#bypassme': function(element, renderer) {  
            return true  
        }  
    };  
    margins = {  
        top: 150,  
        bottom: 60,  
        left: 40,  
        right: 40,  
        width: 600  
    };  
    var y = 20;  
    doc.setLineWidth(2);
    var img = new Image()
    img.src = '/img/logo-vive-promocion-transparency.png'
    doc.addImage(img, 'png',  15, 15, 50, 50)
    doc.text(80, 40 ,'Sistema de Administracion de la Piscina del');
    doc.text(80, 58 ,'Departamento de Promocion Estudiantil');

    let fecha = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(525, 30, fecha.toLocaleDateString());

    doc.setFontSize(11);
    doc.text(40, y = y + 65, "Reporte Estudiante en el sistema SIAP.");

    doc.setDrawColor(183, 183, 183);
    doc.setLineWidth(0.5);
    doc.line(40, y + 20, 570, y += 20); 

    var img = new Image()
    img.src = `/public/uploads/${est.foto}`
    let type = est.foto.split('.')[1];
    doc.addImage(img, type, 40, y + 10, 100, 100)

    doc.setTextColor(0,0,0);
    doc.setFontSize(16);
    doc.text(150, y = y + 45, `${est.nombre} ${est.apellido}`);

    doc.setTextColor(50,50,50);
    doc.setFontSize(11);
    doc.text(150, y = y + 13, `Cedula: ${est.cedula}`);
    doc.text(150, y = y + 13, `Correo: ${est.correo}`);
    y = y + 50;

    doc.setFillColor(237, 240, 255);
    doc.roundedRect(40, y += 5, 530, 20, 5,5, 'F');

    doc.setFontSize(12);
    doc.setFontType('bold');
    doc.setTextColor(0, 0, 0);
    doc.text(45, y += 14, 'Datos');
    // ! --------------------------------------------------
    doc.setTextColor(0,0,0);
    doc.setFontSize(11);
    doc.setFontType('bold');
    doc.text(40, y = y + 35, `Nombre de usuario`);
    doc.setFontType('normal');
    doc.text(40, y + 13, `${est.usuario}`);

    doc.setFontType('bold');
    doc.text(300, y , `Celular`);
    doc.setFontType('normal');
    doc.text(300, y = y + 13, `${est.celular}`);
    // ! --------------------------------------------------
    doc.setFontType('bold');
    doc.text(40, y = y + 20, `Telefono`);
    doc.setFontType('normal');
    doc.text(40, y + 13, `${est.telefono}`);

    doc.setFontType('bold');
    doc.text(300, y , `Fecha de Nacimiento`);
    doc.setFontType('normal');
    doc.text(300, y = y +13, `${est.nacimiento}`);
    // ! --------------------------------------------------
    doc.setFontType('bold');
    doc.text(40, y = y + 20, `Carrera o Departamento`);
    doc.setFontType('normal');
    doc.text(40, y + 13, `${est.carrera_departamento}`);

    doc.setFontType('bold');
    doc.text(300, y , `Direccion`);
    doc.setFontType('normal');
    doc.text(300, y = y + 13, `${est.direccion}`);
    // ! --------------------------------------------------
    doc.setFontType('bold');
    doc.text(40, y = y + 20, `Sexo`);
    doc.setFontType('normal');
    doc.text(40, y + 13, `${est.sexo}`);
    // ! -------------------------------------------------- tablas
    y+=30;
    doc.setFillColor(237, 240, 255);
    doc.roundedRect(40, y += 5, 530, 20, 5,5, 'F');

    doc.setFontSize(12);
    doc.setFontType('bold');
    doc.setTextColor(0, 0, 0);
    doc.text(45, y += 14, 'Talleres Matriculados');
    if(g_estudiante.talleres.length){
        doc.autoTable({
            headStyles: { fillColor: [70, 89, 228] },
            head: [['Taller', 'Fecha', 'Hora','Matricula','Periodo']],
            body: data,
            startY: y = y + 20,  
            theme: 'grid'
        })
        y = y + (g_estudiante.talleres.length * 20); 
    }else{
        y+=20;
        doc.setFontType('normal');
        doc.setFontSize(11);
        doc.text(45, y += 14, 'No tiene talleres matriculados');
    }
    // ! -------------------------------------------------- tablas
    y+=30;
    doc.setFillColor(237, 240, 255);
    doc.roundedRect(40, y += 5, 530, 20, 5,5, 'F');

    doc.setFontSize(12);
    doc.setFontType('bold');
    doc.setTextColor(0, 0, 0);
    doc.text(45, y += 14, 'Reportes de Conducta');
    if(g_estudiante.conducta.length){
        doc.autoTable({
            headStyles: { fillColor: [70, 89, 228] },
            head: [['Descripcion', 'Tipo', 'Fecha']],
            body: conductas,
            startY: y = y + 20,  
            theme: 'grid'
        })
        y = y + (g_estudiante.conducta.length * 20);
    }else{
        y+=20;
        doc.setFontType('normal');
        doc.setFontSize(11);
        doc.text(45, y += 14, 'No hay reportes de conducta');
    }
    titulo = titulo.split(" ").join("_");
    doc.save(titulo+'.pdf');
}
function onOpenCameraModalApp(){
    $('#modalTakePic').on('hidden.bs.modal', function (event) {
        if(f_videoRecording){
            var videoEl = document.getElementById('theVideo');
            stream = videoEl.srcObject;
            tracks = stream.getTracks();
            tracks.forEach(function(track) {
                track.stop();
            });
            videoEl.srcObject = null;
        }
    })
}
function openModalCameras() {
    setTimeout(() => {
        $('#modalTakePic').modal('show');
    }, 1000);
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
    });
}
function openImageModal() {
    var cedula = g_estudiante.data.cedula;
    var foto = `/public/uploads/${g_estudiante.data.foto}`;
    $('#modalImage').modal('show');
    $('#cedulaHiddenCambiarFotoModal').val(cedula);

    $('.avatar-bg').css({
        'background':'url('+foto+')',
        'background-size':'cover',
        'background-position': '50% 50%'
    });
    $('#contentImageModal').attr('src',foto);
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
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#sendFileFoto').html('')
            $('#sendFileFoto').html(
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
var f_videoRecording = false;
function openModalToTakePhoto(){
    $('#theVideo').show();
    f_videoRecording = true;
    var videoWidth = 500;
    var videoHeight = 500;
    var videoTag = document.getElementById('theVideo');
    var canvasTag = document.getElementById('theCanvas');
    var btnCapture = document.getElementById("btnCapture");
    var btnDownloadImage = document.getElementById("btnDownloadImage");
    videoTag.setAttribute('width', videoWidth);
    videoTag.setAttribute('height', videoHeight);
    canvasTag.setAttribute('width', videoWidth);
    canvasTag.setAttribute('height', videoHeight);
    navigator.mediaDevices.getUserMedia({
        video: {
            width: videoWidth,
            height: videoHeight
        }
    }).then(stream => {
        videoTag.srcObject = stream;
        
    }).catch(e => {
        document.getElementById('errorTxt').innerHTML = 'ERROR: ' + e.toString();
    });
    var canvasContext = canvasTag.getContext('2d');
    btnCapture.addEventListener("click", () => {
        canvasContext.drawImage(videoTag, 0, 0, videoWidth, videoHeight);
        var videoEl = document.getElementById('theVideo');
        stream = videoEl.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        videoEl.srcObject = null;
        f_videoRecording = false;
        setTimeout(() => {
            $('#theVideo').hide();
        }, 1500);
    });
    btnDownloadImage.addEventListener("click", () => {
        var link = document.createElement('a');
        link.download = 'capturedImage.png';
        link.href = canvasTag.toDataURL();
        link.click();
    });
}

document.addEventListener("DOMContentLoaded", loaded);