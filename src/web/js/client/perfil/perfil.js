import { procesarLugares as proplaces, filtrarCantones as filCan, filtrarDistritos as filDis } from './places.js'

function loaded(event){
    events(event);
}

function events(event){
    get_today_date();
    load_image();
    checkUpdate();
    update();
    getLugares();
    fotoonChange();
    reqCantones();
    reqDistritos();
}
function fotoonChange() {
    $("#fileFoto").change(function(){
        readURL(this);
    });
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('.today-date').text(today);
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
function load_image() {
    $('#btn_cambiar_foto').on('click',function(event){
        event.preventDefault();
        var files = $('#fileFoto').get(0).files,
        formData = new FormData(); 
        for (var i=0; i < files.length; i++) {
            var file = files[i];
            formData.append('photos[]', file, file.name);
        } 
        $.ajax({
            type: "POST",
            url: "/client/subirImagen",
            data: formData,
            contentType: false,
            processData: false
        }).then((response) => {
            console.log(response);
        }, (error) => {
        });
    });
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
        let sexo = $("#sexo option:selected" ).text();
        let celular = $('#celular_perfil').val();
        let telefono = $('#telefono_perfil').val();
        let TelEmergencia = $('#telefono_emergencia').val();
        let correo = $('#email_perfil').val();    

        $.ajax({
            type: "POST",
            url: "/ejemplo",
            data: data,
            contentType: "application/json"
        }).then((response) => {
            
        }, (error) => {
        });
    })
}

document.addEventListener("DOMContentLoaded", loaded);