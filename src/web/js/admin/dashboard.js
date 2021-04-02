function loaded(event){
    events(event);
}
function onReady(callback) {
    var intervalId = window.setInterval(function() {
      if (document.getElementsByTagName('body')[0] !== undefined) {
        window.clearInterval(intervalId);
        callback.call(this);
      }
    }, 1000);
  }
  
  function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
  }
  
  onReady(function() {
    $('body').removeClass('overflow-hidden');
    animateCSS('#loadingPage','fadeOutDownBig').then(()=>{
        $('#loadingPage').hide();
    })
  });
function events(event){
    cargarDatos();
    toogleMenu();
    change_navbar();
    load_stats();
    get_today_date();
    cargarFoto();
    changeProfilePhoto();
    fotoonChange();
    onshowtabscharts();
}
function onshowtabscharts(){
    $('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
        let target = event.target // newly activated tab
        let href = $(target).attr('href') //event.relatedTarget // previous active tab
        //animateCSS(href,'bounce')
    })
}
const animateCSS = (element, animation) =>
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

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
        url: "/admin/ajax/stats/getTalleres",
        contentType: "application/json",
    }).then(
        (response) => {
            let grupos = response.grupos;
            $('#talleres-stats').text(response.mxg.length);
            for (var [key, value] of Object.entries(grupos)) {
                addData(tallerCh,key, value);
            }
        },
        (error) => {}
    );
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getUsuarios",
        contentType: "application/json",
    }).then(
        (response) => {
            let cont = 0;
            for (var [key, value] of Object.entries(response)) {
                addData(usuarioCharVar, key, value);
                cont += value;
            }
            $('#usuarios-stats').text(cont);
        },
        (error) => {}
    );
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getCasilleros",
        contentType: "application/json",
    }).then(
        (response) => {
            console.log(response);
            $('#casilleros-stats').text(response.total.length);
            addData(casillerosChartVar,'En Uso', response.uso.length);
            addData(casillerosChartVar,'Sin Usar',response.total.length - response.uso.length);
        },
        (error) => {}
    );
}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
function updateChart(chart,data) {
    chart.data.datasets[0].data = data;
    chart.update();
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
document.addEventListener("DOMContentLoaded", loaded);