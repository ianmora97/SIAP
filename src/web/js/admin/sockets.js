const socket = io();

function loaded(event){
    sendAction();
    pushNotificationNewUser();
    prueba();
}
function prueba(){
    $('#toastBoton').on('click',function(){
        $('#toastsNotifications').append(
            '<div class="toast" data-autohide="false" id="toast-11">'+
            '<div class="toast-header bg-dark text-white">'+
            '<i class="far fa-user"></i>&nbsp;<strong class="mr-auto">Nuevo Usuario</strong>'+
            '<small class="text-white">just now</small>'+
            '<button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast">'+
            '<span aria-hidden="true">&times;</span>'+
            '</button>'+
            '</div>'+
            '<div class="toast-body bg-light">'+
            'algo'+
            '</div>'+
            '</div>'
        );
        $("#toast-11").toast('show');
    });
}
function sendAction(){
    $('#mensaje').on('keydown',function (event){
        if(event.which == 13){
            var mensaje = $('#mensaje').val();
            var usuario = $('#username').val();
            console.log(usuario + " " + mensaje);
            socket.emit('chat:message',{
                message:  mensaje,
                username: usuario
            });
            $('#mensaje').val('');
        }
    });
}
function pushNotificationNewUser(){
    socket.on('notificacion:nuevo_registro',function (data) {
        $('#notifications').append(
            '<a class="dropdown-item bg-light" href="#"><i class="far fa-user"></i> Nuevo usuario registrado <strong>'+data.nombre+'</strong></a>'
        );
        $('#toastsNotifications').append(
            '<div class="toast" data-autohide="false" id="toast-'+data.cedula+'">'+
            '<div class="toast-header bg-dark text-white">'+
            '<i class="far fa-user"></i>&nbsp;<strong class="mr-auto">Nuevo Usuario</strong>'+
            '<small class="text-white">just now</small>'+
            '<button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast">'+
            '<span aria-hidden="true">&times;</span>'+
            '</button>'+
            '</div>'+
            '<div class="toast-body bg-light">'+
            '<strong>'+data.cedula+'</strong> '+data.nombre+' '+data.apellido+
            '</div>'+
            '</div>'
        );
        $("#toast-"+data.cedula).toast('show');
    });
}
document.addEventListener("DOMContentLoaded", loaded);