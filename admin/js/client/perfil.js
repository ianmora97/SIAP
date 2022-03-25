var g_estudiante = {};

function loadedData(){
    cargar_estudiante();
    tipodedatosOnchange()
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
function cargar_estudiante() {
    let bearer = 'Bearer '+g_token;
    let ajaxTime = new Date().getTime();
    let cedulaID = $('#cedulaID').html();
    $.ajax({
        type: "GET",
        url: "/api/client/estudiantes/getEstudiante/full",
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
            buildPrimaryInfo(g_estudiante.data);
            console.log(g_estudiante)
        }
    }, (error) => {

    });
}
function buildPrimaryInfo(data){
    $('#idEstudiante').html(data.id_estudiante)
    $('#nombreEstudiante').html(`${data.nombre} ${data.apellido}`);
    $('#tipodeUsuario').html(data.tipo);
    $("#fotoPerfil").attr("src","/public/uploads/"+data.foto);
    //correo on correoUsuariosend
    $("#correoUsuariosend").html(data.correo);
    $("#correoUsuariosend").attr("href","mailto:"+data.correo);

    let nomE = data.telefono_emergencia == null ? '':data.telefono_emergencia.split('&')[1];
    let telE = data.telefono_emergencia == null ? '':data.telefono_emergencia.split('&')[0];


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

    var qrcode = new QRCode(document.getElementById("qrBodymodal"), {
        text: data.cedula,
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

document.addEventListener('DOMContentLoaded', loadedData);