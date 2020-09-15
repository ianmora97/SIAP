function loaded(event){
    events(event);
}

function events(event){
    iniciar_sesion();
}

function iniciar_sesion(){
    $('#inciarSesion').on('click',function(){ 
        var usu = $("#cedula").val();
        var cla = $("#clave").val();
        var data = {usu,cla};
        $.ajax({
            type: "POST",
            url: "/admin/login",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).then((response) => {
            sessionStorage.setItem('usuario',response);
        }, (error) => {
        });
    });
}

document.addEventListener("DOMContentLoaded", loaded);