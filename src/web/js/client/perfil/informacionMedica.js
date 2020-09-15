function loaded(event){
    events(event);
}

function events(event){
    ejemploAJAX();
}
function ejemploAJAX(){
    let cedula = $('#cedula').text();
    let data ={cedula}
    $.ajax({
        type: "GET",
        url: "/client/cargarPadecimientos",
        data: data,
        contentType: "application/json"
    }).then((response) => {
        $('#cedula').append('<p>'+response+'</p>');  
        
    }, (error) => {
    });

}

document.addEventListener("DOMContentLoaded", loaded);