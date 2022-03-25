
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
        let bearer = 'Bearer '+g_token;
        console.log(content);
        if(content.includes('HC1:')){
            $.ajax({
                url: '/leerqrcss',
                type: 'GET',
                data: {codigo: content},
                headers: {
                    'Authorization': bearer
                },
            }).then((response) => {

                let jsonc = JSON.stringify(response,null,4).replace(/</g, '').replace(/>/g, '');
                Swal.fire({
                    icon: 'success',
                    title: 'QR Verificado',
                    html: 
                    `<pre style="text-align:start;">${jsonc}</pre>`
                }).then((result) => {
                    if (result.isConfirmed) {
                        openQRCamera()
                    }
                });
            })
        }else{
            let data = {
                cedula: content
            }
            $.ajax({
                url: '/admin/matricula/qr/check',
                type: 'GET',
                data: data,
                headers: {
                    'Authorization': bearer
                },
            }).then((response) => {
                if(response.length > 0){
                    if(response.filter(x => x.activa).length > 0){
                        if(typeof g_canScan != 'undefined'){ // ! si esta en Asistencias
                            if(g_canScan == true){
                                let est_m = g_mapMatriculados.get(content);
                                let f = new Date();
                                let fecha = `${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}`;
                                let data = {
                                    estado: 1,
                                    est: parseInt(est_m.id_estudiante),
                                    grupo: parseInt(g_grupo),
                                    fecha: fecha
                                };
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Matricula Verificada',
                                    html: 
                                    `<p>Presente</p>
                                    <h5><b>Cedula:</b> ${content}</h5>
                                    <hr class="my-2">`
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        let bearer = 'Bearer '+g_token;
                                        $.ajax({
                                            type: 'GET',
                                            url: '/teach/enviarAsistencia',
                                            data: data,
                                            contentType: "application/json",
                                            headers: {
                                                'Authorization': bearer
                                            },
                                        }).then((response) => {
                                            openQRCamera();
                                        }, (error) => {
                                        });
                                    }
                                });
                            }
                        }else{
                            Swal.fire({
                                icon: 'success',
                                title: 'Matricula Verificada',
                                html: 
                                `<p>El estudiante tiene una matricula activa</p>
                                <h5><b>Cedula:</b> ${content}</h5>
                                <hr class="my-2">`
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    openQRCamera()
                                }
                            });
                        }
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
        }
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