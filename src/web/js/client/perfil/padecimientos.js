function loaded(event) {
    events(event);
}

function events(event) {
    ejemploAJAX();
    get_padecimientos();
    insertarPadecimientos();
}
function get_padecimientos(){
    let cedula = $('#cedula').text();
    let data ={cedula}
    $.ajax({
        type: "GET",
        url: "/client/cargarPadecimientos",
        data: data,
        contentType: "application/json"
    }).then((padecimientos) => {
        padecimientos.forEach((p)=>{
            ocultarPadecimiento(p);
        });
        
    }, (error) => {
    });

}
function ocultarPadecimiento(p){
    $('#fila_'+p.descripcion.toLowerCase()).hide();
}

function insertarPadecimientos(){
    $('#ingresarPadecimientosBoton').on('click',function(){
        let cedula = $('#cedula').text();
        
        let padecimientos = $("[id*=switch-]");
        
        let padecimientosSeleccionados = [];
        for (let i = 0; i < padecimientos.length; i++) {
            if (padecimientos[i].checked) {
                padecimientosSeleccionados.push(padecimientos[i].name);
            }
        }
        let data = [];
        for (let i = 0; i < padecimientosSeleccionados.length; i++) {
            data.push({
                descripcion: padecimientosSeleccionados[i].toUpperCase(),
                observacion: $('#text_'+padecimientosSeleccionados[i]).val(),
                cedula: cedula
            });
        }
        console.log(data);
        for(let i = 0; i < data.length; i++){
            $.ajax({
                type: "POST",
                url: "/client/insertarPadecimientos",
                data: data,
                contentType: "application/json"
            }).then((padecimientos) => {
                
            }, (error) => {
            });
        }
    });


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
