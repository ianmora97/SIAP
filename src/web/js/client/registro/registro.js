import {validate, check} from './validate.js';

function loaded(event){
    events(event);
}

function events(event){
    registrar_usuario_ajax();
}

function registrar_usuario_ajax(){
    $('#registrar').on('click',()=>{
        let nombre = $('#nombre_registro').val();
        let cedula = $('#id_registro').val();
        let apellido = $('#apellidos_registro').val();
        let nacimiento = $('#fecha_nacimiento_registro').val();
        let nombreUsuario = $('#usuario_registro').val();
        let clave = $('#clave_registro').val();
        let sexo =$("#sexo option:selected" ).text();

        let data = {cedula,nombre,apellido,nacimiento,nombreUsuario,clave,sexo};
        console.log(data);
        if(validate(data)){       
            console.log('yes');
            $.ajax({
                type: "POST",
                url: "/usuario/registrarse",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).then((response) => {
                
            }, (error) => {
            });
        }else{
            console.log('no');
            let errores = check(data);
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