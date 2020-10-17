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
    $.ajax({
        type: "GET",
        url: "/admin/stats/usuariosNuevosTabla",
        contentType: "application/json"
    }).then((response) => {
        cargarTablaUsuariosNuevos(response);
    }, (error) => {

    });
    
}
function cargarTablaUsuariosNuevos(usuarios) {
    $('#dataListUsuariosNuevos').html('');
    $('#statNuevoUsusariosNotificacion').append(usuarios.length);
    usuarios.forEach((u)=>{
        showTablaUsuariosNuevos(u);
    });
}
function showTablaUsuariosNuevos(u) {
    
    let cedula = u.cedula;
    let nombre = u.nombre + ' ' + u.apellido;
    let tipo = u.tipo ? 'Estudiante' : 'Funcionario';
    let registro = u.registro.split(' ')[0];
    let iniciales = u.nombre[0] + u.apellido[0];
    let color = getRandomColor();

    $('#dataListUsuariosNuevos').append(
        '<tr>'+
        '<td><span class="rounded-circle p-2 text-white mr-2" style="background:'+color+';">'+iniciales+'</span></td>'+
        '<td>'+cedula+'</td>'+
        '<td>'+nombre+'</td>'+
        '<td>'+tipo+'</td>'+
        '<td>'+registro+'</td>'+
        '</tr>'
    );
}
function getRandomColor() {
    let number = Math.floor(Math.random() * 6) + 1;
    switch (number) {
        case 1:
            return '#6f42c1';
        case 2:
            return '#fd7e14';
        case 3:
            return '#20c997';
        case 4:
            return '#007bff';
        case 5: 
            return '#dc3545';
        case 6:
            return '#ffc107';
    }
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