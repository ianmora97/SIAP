function loaded(event){
    events(event);
}

function events(event){
    ejemploAJAX();
    toogleMenu();
    change_navbar();
    load_stats();
    get_today_date();
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
    let md = 768;
    let sizeScreen = screen.width;
    console.log(sizeScreen,md);
    if(sizeScreen <= md){
        $('#nombreUsuario').hide();
    }
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