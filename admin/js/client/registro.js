import {validate, check, emailCheck as cEm, verificarCedula as vc, verificarNombreCompleto as cNA, checkPass} from './validate.js';

const socket = io();

function loaded(event){
    events(event);
}

function events(event){
    registrar_usuario_ajax();
    toogle_clave();
    verificar_clave();
    llenarDatos();
    verificar_dropdowns();
    verificar_fecha();
    verificar_correo();
    validar_cedula();
    verificarCambioNacionalidad();
}
var g_tipo_nacionalidad = "";
function verificarCambioNacionalidad(){
    $('#tipoDeNacionalidad').on('change', ()=>{
        g_tipo_nacionalidad = $('#tipoDeNacionalidad').val();
        if(g_tipo_nacionalidad == 'nacional'){
            $('#cedula_inputGroup').html(`<b>NA</b>`);
            $('#id_registro').attr('type', 'number');
        }else if(g_tipo_nacionalidad == 'extranjera'){
            $('#cedula_inputGroup').html(`<b>EX</b>`);
            $('#id_registro').attr('type', 'text');
        }
    });
}
function validar_cedula() {
    $("#id_registro").keydown(function () {
        if(g_tipo_nacionalidad == 'nacional'){
            if ((parseInt($(this).val().length) <= 9 && parseInt($(this).val().length) >= 0)) $(this).data("old", $(this).val());
        }else if(g_tipo_nacionalidad == 'extranjera'){
            if ((parseInt($(this).val().length) <= 9 && parseInt($(this).val().length) >= 0)) $(this).data("old", $(this).val());
        }else{
            $('#id_registro').val('');
            return;
        }
    });
    $("#id_registro").keyup(function (key) {
        if(g_tipo_nacionalidad == 'nacional'){
            if (($(this).val().length <= 9 && $(this).val().length >= 0)) ;
            else {
                $(this).val($(this).data("old"));
            }
        }else if(g_tipo_nacionalidad == 'extranjera'){
            if (($(this).val().length <= 9 && $(this).val().length >= 0)) ;
            else {
                $(this).val($(this).data("old"));
            }
        }else{
            $('#id_registro').val('');
            return;
        }
    });
}
function verificar_correo(){
    $('#email').on('keyup', ()=>{
        let email = $('#email').val();
        if(email != ""){
            if(cEm(email)){
                let c = email.substring(0, email.indexOf('@'));
                $('#usuario_registro').val(c);
            } 
        }
    });
    $('#email').change( ()=>{
        let email = $('#email').val();
        if(email != ""){
            if(cEm(email)){
                let c = email.substring(0, email.indexOf('@'));
                $('#usuario_registro').val(c);
            } 
        }
    });
}
function verificar_dropdowns(params) {
    // $('#sexo').on('change', ()=> {
    //     let s = $('#sexo').val();
    //     if(s != 'none'){
    //         $('#sexo').addClass('is-valid');
    //     }else{
    //         $('#sexo').removeClass('is-valid');
    //     }
    // });
    // $('#perfil').on('change', ()=> {
    //     let s = $('#perfil').val();
    //     if(s != 'none'){
    //         $('#perfil').addClass('is-valid');
    //     }else{
    //         $('#perfil').removeClass('is-valid');
    //     }
    // });
}
function llenarDatos() {
    $('#id_registro').on('keyup',(cantidad)=>{
        let id = $('#id_registro').val();
        
        if(id.length == 9){
            // $('#id_registro').addClass('is-valid');
            $.ajax({
                type: "GET",
                url: '/buscarUsuarioRegistro',
                contentType: "application/json",
                data: {id:id}
            }).then((response) => {
                let p = JSON.parse(response)
                $('#nombre_registro').val(p.results[0].firstname1);
                $('#apellidos_registro').val(p.results[0].lastname);
                
                // $('#nombre_registro').addClass('is-valid');
                // $('#apellidos_registro').addClass('is-valid');

                $('#nombre_registro').attr('disabled', true);
                $('#apellidos_registro').attr('disabled', true);
            }, (error) => {
            
            });
        }
        else if(id.length == 12){
            // $('#id_registro').addClass('is-valid');
        }else{
            // $('#id_registro').removeClass('is-valid');

            // $('#nombre_registro').removeClass('is-valid');
            // $('#apellidos_registro').removeClass('is-valid');

            $('#nombre_registro').attr('disabled', false);
            $('#apellidos_registro').attr('disabled', false);
        }
    });
}

function verificar_clave(){
    // $('#clave_verificar').on('keyup',function (event){
    //     var pass = $('#clave_registro').val();
    //     var pass_v = $('#clave_verificar').val();
    //     if(pass == pass_v){
    //         $('#clave_registro').addClass('is-valid');
    //         $('#clave_verificar').addClass('is-valid');
    //     }
    //     else{
    //         $('#clave_registro').removeClass('is-valid');
    //         $('#clave_verificar').removeClass('is-valid');
    //     }
    // });
    $('#clave_registro').on('keyup',function (event){
        var p = $('#clave_registro').val();
        var l = (p.length / 20 * 100) + "%";
        $('#cantidad_caracteres').text('');
        $('#cantidad_caracteres').text(p.length);
        $('#progreso_clave').css('width',l);
        if(p.length >= 8){
            $('#progreso_clave').removeClass("bg-rojo");
            $('#progreso_clave').addClass('bg-green');
        }else if(p.length < 8){
            $('#progreso_clave').removeClass('bg-green');
            $('#progreso_clave').addClass("bg-rojo");
        }
    });
}
function toogle_clave(){
    $('#buttonClave').on('click', ()=>{
        console.log('click')
        let p = $('#clave_registro');
        if(p.attr('type') == 'password'){ // ----ver
            p.attr('type', 'text');
            $('#clave_verificar_form').slideToggle();
            $('#buttonClave').html('<i class="fas fa-eye-slash"></i>');
        }
        else{ // ----ocultar
            p.attr('type', 'password');
            $('#clave_verificar_form').slideToggle();
            $('#buttonClave').html('<i class="fas fa-eye"></i>');
        }
    });
    // $('#clave_registro').on('keyup', ()=>{
    //     let p = $('#clave_registro');
    //     if(p.val().length < 8){
    //         $('#clave_registro').removeClass("is-valid");
    //     }else{
    //         $('#clave_registro').addClass("is-valid");
    //     }
    // });
}
function limpiarCampos() {
    $('#nombre_registro').val('');
    $('#id_registro').val('');
    $('#apellidos_registro').val('');
    $('#fecha_nacimiento_registro').val('');
    $('#usuario_registro').val('');
    $('#clave_registro').val('');
    $("#sexo option:selected" ).text('');
    $("#perfil option:selected" ).val('');
    $('#email').val('');
    $('#clave_verificar').val('');
}
function ocultarAlertaSuccess(){
    $("#alertasuccess").fadeOut('slow');
}
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });
function registrar_usuario_ajax(){
    $('#registrar').on('click',()=>{
        $('#spinnerWaiter').show();
        
        let nombre = $('#nombre_registro').val();
        let cedula = $('#id_registro').val();
        let apellido = $('#apellidos_registro').val();
        let nacimiento = $('#fecha_nacimiento_registro').val();
        let nombreUsuario = $('#usuario_registro').val();
        let clave = $('#clave_registro').val();
        let sexo = $("#sexo option:selected" ).val();
        let tipoUser = $("#perfil option:selected" ).val();
        let email = $('#email').val();

        let data = {cedula,nombre,apellido,nacimiento,nombreUsuario,clave,sexo,tipoUser,email};

        if(validate(data)){
            if(cNA(data)){
                if(vc(cedula)){
                    $.ajax({
                        type: "POST",
                        url: "/usuario/registrarse",
                        data: JSON.stringify(data),
                        contentType: "application/json"
                    }).then((response) => {
                        if(response.status == 'ok'){
                            // socket.emit(' chat:nuevo_registro',data);
                            $('html').scrollTop(0);
                            limpiarCampos();
                            setTimeout(() => {
                                location.href = "/registrarse/subircomprobante"+"?cedula="+response.data;
                            }, 2000);
                        }else{
                            $('#spinnerWaiter').hide();
                            $('#text_incorrect').html('');
                            $('#text_incorrect').append(
                                error
                            );
                            $('#alerta_error_registro').show()
                        }
                    }, (error) => {
                        $('#text_incorrect').html('');
                        $('#text_incorrect').append(
                            error
                        );
                        $('#alerta_error_registro').show()
                    });
                }
            }
        }else{
            $('#spinnerWaiter').hide();
            let errores = check(data);
            let why = "";
            errores.forEach(e => {
                why += e + ', ';
            });
            $('#text_incorrect').html('');
            $('#text_incorrect').append(
                why+'deben ser completados'
            );
            $('#alerta_error_registro').show()
            animateCSS('#alerta_error_registro','bounceInUp').then(()=>{
                setTimeout(() => {
                    animateCSS('#alerta_error_registro','bounceOutUp').then(()=>{
                        $('#alerta_error_registro').hide();
                    })

                }, 8000);
            })
        }
    });
}
function verificar_fecha() {
    // $('#fecha_nacimiento_registro').on('change', ()=> {
    //     let s = $('#fecha_nacimiento_registro').val();
    //     let f = s.split('-');
    //     if(f[0] == "" || f[1] == "" || f[2] == ""){
    //         $('#fecha_nacimiento_registro').removeClass('is-valid');
    //     }else{
    //         $('#fecha_nacimiento_registro').addClass('is-valid');
    //     }
    // });
}
document.addEventListener("DOMContentLoaded", loaded);