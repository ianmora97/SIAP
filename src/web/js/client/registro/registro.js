import {validate, check} from './validate.js';

function loaded(event){
    events(event);
}

function events(event){
    registrar_usuario_ajax();
}

function registrar_usuario_ajax(){
    $('#enviar').on('click',()=>{
        let nombre = $('#nombre_t_usuario').val();
        let cedula = $('#cedula').val();
        let apellido = $('#apellido_t_usuario').val();
        let nacimiento = $('#nacimiento_t_usuario').val();
        let nombreUsuario = $('#nombreUsuario_t_usuario').val();
        let clave = $('#clave_t_usuario').val();
        let sexo = $("input[name='sexo_t_usuario']:checked").val();

        let data = {cedula,nombre,apellido,nacimiento,nombreUsuario,clave,sexo};

        if(validate(data)){       
            $('#accion').on('click',function(){ 
                $.ajax({
                    type: "POST",
                    url: "/usuario/registrarse",
                    data: JSON.stringify(data),
                    contentType: "application/json"
                }).then((response) => {
                    
                }, (error) => {
                });
            });
        }else{
            let errores = check(datos);
            let why = "";
            errores.forEach(e => {why += e + ' ';});
            $('#alerta_error_registro').append(
                '<p>'+why+'</p>'
            );
            $('#alerta_error_registro').show().fadeIn(4000);
        }
    });
}

function ejemploAJAX(){
    $('#accion').on('click',function(){ 
        $.ajax({
            type: "POST",
            url: "/ejemplo",
            contentType: "application/json"
        }).then((response) => {
            
        }, (error) => {
        });
    });
}

document.addEventListener("DOMContentLoaded", loaded);