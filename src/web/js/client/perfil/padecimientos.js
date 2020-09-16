function loaded(event) {
    events(event);
}

function events(event) {
    ejemploAJAX();
    change_navbar();
    load_stats();
    get_today_date();
}
function get_today_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    $(".today-date").text(today);
}
function load_stats() {
    let cantones = ['San José','Escazú','Desamparados','Puriscal',
    'Tarrazú','Aserrí','Mora','Goicoechea','Santa Ana','Alajuelita'];
    for (let canton in cantones) {
        $('#canton').append(new Option(canton, canton));
    }

}
function change_navbar() {
    let md = 768;
    let sizeScreen = screen.width;
    console.log(sizeScreen, md);
    if (sizeScreen <= md) {
        $("#nombreUsuario").hide();
    }
}

function ejemploAJAX() {
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
