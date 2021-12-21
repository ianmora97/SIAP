function loaded(event){
    events(event);
}

function events(event){
    ejemploAJAX();
}

function ejemploAJAX(){
    $('#accion').on('click',function(){ 
        $.ajax({
            type: "POST",
            url: "/ejemplo",
            contentType: "application/json"
        }).then((response) => {
            
        }, (error) => {
        });
    });
}

document.addEventListener("DOMContentLoaded", loaded);