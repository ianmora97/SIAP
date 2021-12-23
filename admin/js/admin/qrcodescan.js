
var cameraIsOpen = false;
var self = this;



function openQRModal(){
    animateCSS('.QRContainer', 'fadeInUp');
    $('.QRContainer').css('display', 'flex');
    openQRCamera();
}
function openQRCamera(){
    cameraIsOpen = true;
    self.scanner = new Instascan.Scanner({
        video: document.getElementById('previewCameraQR'), 
        scanPeriod: 5,
        captureImage: false,
        mirror: true,
    });
    self.scanner.addListener('scan', function (content, image) {
        closeQRCamera();
        let cursos = content.split('.');
        cursos.pop();
        let bearer = 'Bearer '+g_token;
        let data = {
            cursos
        }
        cursos.forEach(c => {
            if(isTodayQR(c.split('-')[2].split(' ')[0])){
                $('#codescanned').append();
                let data = {
                    cedula: c.split('-')[0],
                    grupo: c.split('-')[3],
                }
                $.ajax({
                    url: '/admin/matricula/qr/check',
                    type: 'GET',
                    data: data,
                    headers: {
                        'Authorization': bearer
                    },
                }).then((response) => {
                    console.log(response);
                    if(response.length > 0){
                        if(response[0].activa){
                            Swal.fire({
                                icon: 'success',
                                title: 'Matricula Verificada',
                                html: 
                                `<p>El estudiante tiene una matricula activa</p>
                                <h4 class="text-primary">${c.split('-')[1]}</h4>
                                <h5><b>Cedula:</b> ${c.split('-')[0]}</h5>
                                <h5><b>Grupo:</B> ${c.split('-')[3]}</h5>
                                <h5><b>Dia:</b> ${c.split('-')[2]}</h5>
                                <hr class="my-2">`
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    openQRCamera()
                                }
                            });
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Matricula Inactiva',
                                html: `
                                    <p>El estudiante tiene una matricula inactiva</p>
                                    <h5>Revisar grupo:</h5>
                                    <a href="/admin/talleres/grupo/${c.split('-')[3]}">${c.split('-')[2]}</a>

                                `,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    openQRCamera()
                                }
                            });
                        }
                    }
                }, (error) => {
                    console.log(error);
                });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Dia no valido',
                    html: `
                        <p>El dia de la matricula no es valido</p>
                        <h5>Dia:</h5>
                        <a href="/admin/talleres/grupo/${c.split('-')[3]}">${c.split('-')[2]}</a>
                    `,
                }).then((result) => {
                    if (result.isConfirmed) {
                        openQRCamera()
                    }
                });
            }
        });
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        self.cameras = cameras;
        if (cameras.length > 0) {
            self.activeCameraId = cameras[0].id;
            self.scanner.start(cameras[0]);
            console.log("camera is open");
            setTimeout(() => {
                $('#loaderQRCamera').removeClass('d-flex');
                $('#loaderQRCamera').addClass('d-none');
            }, 1000);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
            console.error(e);
    });
}

function closeQRCamera(){
    if(cameraIsOpen){
        self.scanner.stop();
        cameraIsOpen = false;
    }
}
function closeQRModal(){
    if(cameraIsOpen){
        closeQRCamera();
    }
    $('#codescanned').html('');
    animateCSS('.QRContainer', 'fadeOutDown').then(() => {
        $('.QRContainer').hide();
    });
}

function isTodayQR(day){
    var days = ['DOMINGO','LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    if(days[new Date().getDay()] == day){
        return true;
    }
    return false;
}