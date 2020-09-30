import { procesarLugares as proplaces, filtrarCantones as filCan, filtrarDistritos as filDis, validate, check } from './places.js'

function loaded(event){
    events(event);
}

function events(event){
    get_today_date();
    fotoonChange();
    checkUpdate();
    update();
    getLugares();
    cargarFoto();
    reqCantones();
    reqDistritos();
    ocultarAlertaDanger();
    changeProfilePhoto();
}



function cargarFoto() {
    let foto = $('#usuario_foto').data('value');
    $('.avatar-bg').css({
        'background':'url(./../public/uploads/'+foto+')',
        'background-size':'cover',
        'background-position': '50% 50%'
    });
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
    });
}
function fotoonChange() {
    $("#fileFoto").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' 
        || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#btn_cambiar_foto').show();
            $('#formatoImagenInvalido').hide();
        }else{
            $('#formatoImagenInvalido').show();
        }
                    
    });
}
function readURL(input) { 
    if (input.files && input.files[0]) {
        var reader = new FileReader(); 
        reader.onload = function (e) {
            $('.avatar-bg').css({
                'background':'url('+e.target.result+')',
                'background-size':'cover',
                'background-position': '50% 50%'
            });
        }; 
        reader.readAsDataURL(input.files[0]);
    }
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
}

function reqCantones() {
    $('#provincia').on('change', function(){
        filCan(this.value);
    });
}

function reqDistritos() {
    $('#canton').on('change', function(){
        filDis(this.value);
    });
}

function getLugares(){
    $.ajax({
        type: "GET",
        url: "../../../assets/lugares.txt",
        contentType: "text"
    }).then((data) => {
        proplaces(data);
    }, (error) => {
    });
}

function checkUpdate(){
    $('#guardar_info').on('click',function(){
        $('#modalCheckUpdate').modal('show');
    });
}

function update() {
    $('#guardar_confirmar').on('click', function () {
        let cedula = $('#cedula_gu').text();
        let celular = $('#celular_perfil').val();
        let telefono = $('#telefono_perfil').val();
        let emergencia = $('#telefono_emergencia').val();
        let correo = $('#email_perfil').val();
        let carrera = $('#carrera').val();
        let provincia = $('#provincia option:selected').val();
        let canton = $('#canton option:selected').val();
        let distrito = $('#distrito option:selected').val();
        let direccion = $('#direccion').val();

        let data = {cedula,correo,celular,telefono,emergencia,carrera,provincia,canton,distrito,direccion}
        console.log(data);

        if(validate(data)){
            $('#spinnerWaiter').show();

            $.ajax({
                type: "PUT",
                url: "/client/actualizardatos",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).then((response) => {
                $('#spinnerWaiter').hide();
                $("#alertasucess").fadeIn('slow');
            }, (error) => {
            }); 
        }else{
            let err = check(data);
            for (let i = 0; i < err.length; i++) {
                if(i != err.length - 1){
                    $('#erroresAlert').append(err[i] + ", ");
                }else{
                    $('#erroresAlert').append(err[i] + ".");
                }
            }
            $("#alertadanger").fadeIn('slow');      
        }
    })
}
function ocultarAlertaDanger(){
    $('#cerrarAlertaDanger').on('click',function(){
        $("#alertadanger").fadeOut('slow');
    });
}
document.addEventListener("DOMContentLoaded", loaded);