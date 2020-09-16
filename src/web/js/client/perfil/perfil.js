function loaded(event){
    events(event);
}

function events(event){
    ejemploAJAX();
    get_today_date();
    load_image();
    checkUpdate();
    update();
    getLugares();
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
function getLugares(){
    $.ajax({
        type: "GET",
        url: "../../../assets/lugares.txt",
        contentType: "text"
    }).then((data) => {
        processData(data);
    }, (error) => {
    });
}
function processData(data) {
    var lines = data.split("\n");

    var provincia = [];
    var cantones = [];
    var distritos = [];

    for (var j=0; j<lines.length -1; j++) {
        var values = lines[j].split(' ,'); 
        provincia.push((values[0])); 
        cantones.push((values[1]));
        distritos.push((values[2]));
    }
    load_provincias(provincia);
    load_cantones(cantones);
    load_distritos(distritos);
}

function load_provincias(data) {
    let provincias = data;
    provincias = provincias.filter(function(item, pos) {
        return provincias.indexOf(item) == pos;
    })
    let c = $('#provinciaSelected').attr('data-values');

    for (let provincia of provincias) {
        if(provincia == c){
            $('#provincia').append(new Option(provincia, provincia,true));
        }else{
            $('#provincia').append(new Option(provincia, provincia));
        }
    }
}
function load_cantones(data) {
    let cantones = data;
    cantones = cantones.filter(function(item, pos) {
        return cantones.indexOf(item) == pos;
    })
    let c = $('#cantonSelected').attr('data-values');

    for (let canton of cantones) {
        if(canton == c){
            $('#canton').append(new Option(canton, canton,true));
        }else{
            $('#canton').append(new Option(canton, canton));
        }
    }
}
function load_distritos(data) {
    let distritos = data;
    let c = $('#distritoSelected').attr('data-values');

    for (let distrito of distritos) {
        if(distrito == c){
            $('#distrito').append(new Option(distrito, distrito,true));
        }else{
            $('#distrito').append(new Option(distrito, distrito));
        }
    }
}

function checkUpdate(){
    $('#guardar_info').on('click',function(){
        $('#modalCheckUpdate').modal('show');
    });
}
function update() {
    $('#guardar_confirmar').on('click', function () {
        let cedula = $('#cedula_gu').text();
        let sexo =$("#sexo option:selected" ).text();
        let celular = $('#celular_perfil').val();
        let telefono = $('#telefono_perfil').val();
        let TelEmergencia = $('#telefono_emergencia').val();
        $.ajax({
            type: "POST",
            url: "/ejemplo",
            contentType: "application/json"
        }).then((response) => {
            
        }, (error) => {
        });
    })
}

document.addEventListener("DOMContentLoaded", loaded);