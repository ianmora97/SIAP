const socket = io();

function cargasSockets(event){
    socket_pushNotificationNewUser();
    socket_pushNotificationNuevaMatricula();
}

function socket_pushNotificationNewUser(){
    socket.on(' chat:nuevo_registro',function (data) {
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
    socket.on('matricula:newMatricula',function (data) {
        $('#notifications').append(
            `<a class="dropdown-item bg-white p-1 mb-2" href="/admin/matricula">
                <div class="d-flex justify-content-between align-items-stretch pb-3">
                    <div class="d-flex justify-content-start align-items-start">
                        <div class="mx-2">
                            <i class="fas fa-circle text-primary" style="font-size:10px;"></i> 
                        </div>
                        <div>
                            <p class="mb-0 d-block">Estudiante Matriculado</p>
                            <strong class="mb-0 d-block">${data.nombreEst}</strong>
                            <small class="text-muted d-block">${moment(new Date()).format('lll')}</small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end align-items-center pr-2">
                        <i class="fas fa-user-edit text-primary fa-2x"></i>
                    </div>
                </div>
                <hr class="mx-4">
            </a>`
        );
        $('#toastsNotifications').append(
            '<div class="toast" data-autohide="false" id="toast-'+data.cedula+'">'+
            '<div class="toast-header bg-dark text-white">'+
            '<i class="far fa-user"></i>&nbsp;<strong class="mr-auto">Nueva Matricula</strong>'+
            '<small class="text-white">hace 1seg</small>'+
            '<button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast">'+
            '<span aria-hidden="true">&times;</span>'+
            '</button>'+
            '</div>'+
            '<div class="toast-body bg-light">'+
            '<strong>'+data.cedula+'</strong> '+data.nombreEst+
            '</div>'+
            '</div>'
        );
        $("#toast-"+data.cedula).toast('show');
    });
}
document.addEventListener("DOMContentLoaded", cargasSockets);