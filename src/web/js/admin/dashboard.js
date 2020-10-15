function loaded(event){
    events(event);
}

function events(event){
    cargarDatos();
    toogleMenu();
    change_navbar();
    load_stats();
    get_today_date();
    cargarFoto();
    changeProfilePhoto();
    fotoonChange();
}
function cargarFoto() {
    let foto = $('#usuario_foto').data('value');
    if(!foto){
        $('.avatar-bg').css({
            'background':'url(../../img/default-user-image.png)',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }else{
        $('.avatar-bg').css({
            'background':'url(./../public/uploads/'+foto+')',
            'background-size':'cover',
            'background-position': '50% 50%'
        });

    }
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
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
function fotoonChange() {
    $("#fileFoto").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' 
        || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#fileFoto').after(
                '<button class="btn btn-primary btn-sm d-block mx-auto mb-3" '+
                'id="btn_cambiar_foto" type="submit" '+
                'style="display: none;">Cambiar foto</button>'
            );
            $('#formatoImagenInvalido').hide();
        }else{
            $('#formatoImagenInvalido').show();
        }
                    
    });
}
function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
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
    $.ajax({
        type: "GET",
        url: "/admin/stats/usuarios",
        contentType: "application/json"
    }).then((response) => {
        $('#usuarios-stats').text(response.cant);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/stats/talleres",
        contentType: "application/json"
    }).then((response) => {
        $('#talleres-stats').text(response.cant);
    }, (error) => {
        
    });
    $.ajax({
        type: "GET",
        url: "/admin/stats/matricula",
        contentType: "application/json"
    }).then((response) => {
        $('#matricula-stats').text(response.cant);
    }, (error) => {

    });

}
function change_navbar(){
    let sizeScreen = $('body')[0].clientWidth;
    console.log(sizeScreen);
    
}
function cargarDatos() {
    $.ajax({
        type: "GET",
        url: "/admin/stats/getTalleres",
        contentType: "application/json",
    }).then(
        (response) => {
            // addData(barChart, '# of Votes 2017', '#ff0000', [16, 14, 8]);
            updateChart( tallerCh,response);
        },
        (error) => {}
    );
}

function updateChart(chart,data) {
    chart.data.datasets[0].data = data;
    chart.update();
}
document.addEventListener("DOMContentLoaded", loaded);