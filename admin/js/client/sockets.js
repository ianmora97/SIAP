const socket = io();
socket.on("connect", () => {
    let id = socket.id;
    console.log('%c🚀 WebSocket Conectado al servidor '+id, 'background: #222; color: #bada55');
});

function cargasSockets(event){
    socket_NewMatricula();
}

function socket_NewMatricula(){
    socket.on('matricula:newMatricula',function (data) {
        
    });
}
document.addEventListener("DOMContentLoaded", cargasSockets);