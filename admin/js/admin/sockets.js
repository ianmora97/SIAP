const socket = io();

function cargasSockets(event){
    socket_pushNotificationNewUser();
    socket_prueba();
    socket_pushNotificationNuevaMatricula();
}
function socket_prueba(){
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

function socket_pushNotificationNewUser(){
    socket.on('notificacion:nuevo_registro',function (data) {
        $('#notifications').append(
            `<a class="dropdown-item bg-light px-0" href="/admin/comprobacion"><i class="far fa-user"></i> 
            Registro Nuevo<br> <strong>${data.nombre}</strong></a>`
        );
        $('#toastsNotifications').append(
            '<div class="toast" data-autohide="false" id="toast-'+data.cedula+'">'+
            '<div class="toast-header bg-dark text-white">'+
            '<i class="far fa-user"></i>&nbsp;<strong class="mr-auto">Nuevo Usuario</strong>'+
            '<small class="text-white">hace 1seg</small>'+
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

function socket_pushNotificationNuevaMatricula(){
    socket.on('notificacion:nueva_matricula',function (data) {
        $('#notifications').append(
            `<a class="dropdown-item bg-light" href="#"><i class="far fa-user"></i> 
            Nueva Matricula<br> <strong>${data.nombre}</strong></a>`
        );
        $('#toastsNotifications').append(
            '<div class="toast" data-autohide="false" id="toast-'+data.cedula+'">'+
            '<div class="toast-header bg-dark text-white">'+
            '<i class="far fa-user"></i>&nbsp;<strong class="mr-auto">Nuevo Matricula</strong>'+
            '<small class="text-white">hace 1seg</small>'+
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
document.addEventListener("DOMContentLoaded", cargasSockets);