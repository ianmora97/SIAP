function loaded(event){
    events(event);
}

function events(event){
    ejemploAJAX();
    load_stats();
    get_today_date();
    load_image();
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

function load_stats() {
    let cantones = ['Central','Escazú','Desamparados','Puriscal',
        'Tarrazú','Aserrí','Mora','Goicoechea','Santa Ana','Alajuelita'];
    let c = $('#cantonSelected').attr('data-values');
    console.log(c);
    for (let canton of cantones) {
        if(canton == c){
            $('#canton').append(new Option(canton, canton,true));
        }else{
            $('#canton').append(new Option(canton, canton));
        }
    }
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

    // Get the files from input, create new FormData.
    var files = $('#fileFoto').get(0).files,
        formData = new FormData();

    // Append the files to the formData.
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
function ejemploAJAX(){
    // $('#accion').on('click',function(){ 
    //     $.ajax({
    //         type: "POST",
    //         url: "/ejemplo",
    //         contentType: "application/json"
    //     }).then((response) => {
            
    //     }, (error) => {
    //     });
    // });
}

document.addEventListener("DOMContentLoaded", loaded);