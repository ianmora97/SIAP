var cursos = [];
var montoTotal = 0;
var cursosSeleccionados = [];

function loaded(event){
    events(event);
}

function events(event){
    traerCursos();
    filtrarTODOS();
    dropdownhoras();
    toogleMenuAplicar();
    matricularCursos();
    ocultarAlertaSuccess();
    ocultarAlertaDanger();
}
function eventSeleccionar(curso) {
    let all = $("[id*=matricularCursoCheckbox-]");
    let select = [];
    let montoCantidad = 0;
    
    cursosSeleccionados = []; //limpio el vector de cursos seleccionados

    for (let i = 0; i < all.length; i++) {
        if (all[i].checked) {
            select.push(all[i].value);
            cursosSeleccionados.push(getCurso(all[i].value,cursos)); //lleno el vector de cursos seleccioandos para no perderlos a la hora de filtrarlos
            if(montoCantidad != 0){
                montoCantidad += 1000;
            }else{
                montoCantidad += $('#matricularCursoCheckbox-'+all[i].value).data('price');
            }
        }
    }

    cursosSeleccionados = cursosSeleccionados.filter(function(item, pos) { //elimina repetidos
        return cursosSeleccionados.indexOf(item) == pos;
    });
    
    let contadorCursos = select.length; //cuenta los cursos que se seleccionaron, e.g 3 cursos (lunes1, martes11, jueves3)
    montoTotal = montoCantidad; //monto total precio
    $('#montoTotal').text(montoTotal);

    if(contadorCursos == 3){ //desabilito los demas botones para que no pueda marcar mas de 3 cursos
        for (let i = 0; i < all.length; i++) {
            if (!(all[i].checked)) {
                $('#matricularCursoCheckbox-'+all[i].value).attr('disabled',true);
            }
        }
    }else{
        for (let i = 0; i < all.length; i++) {
            if (!(all[i].checked)) {
                $('#matricularCursoCheckbox-'+all[i].value).attr('disabled',false);
            }
        }
    }
}
function dropdownhoras() {
    $("#dropdownboton").on("click", function () {
        $("#dropdownhoras").toggle();
    });
}

function toogleMenuAplicar(){
    $("#buscarApply").on("click", function () {  
        $("#dropdownhoras").hide();
    });
}
function filtrarTODOS(){
    $('#buscarApply').on('click',function(){
		let horas = [];
        let seleccionadoshoras = $("[id*=horas]");
        let dias = [];
        let seleccionadosDias = $("[id*=filter_]");

        for (let i = 0; i < seleccionadoshoras.length; i++) {
            if (seleccionadoshoras[i].checked) {
                horas.push(seleccionadoshoras[i].name.toUpperCase());
            }
        }
        for (let i = 0; i < seleccionadosDias.length; i++) {
            if (seleccionadosDias[i].checked) {
                dias.push(seleccionadosDias[i].name.toUpperCase());
            }
        }
        let vector = [];
        if (horas.length != 0 || dias.length != 0) {
            vector = filtrarTodos(cursos,dias,horas);
            // console.log(vector);
            // vector = filtradosSeleccionados(cursosSeleccionados,vector);
            cargarCurso(vector);
        } else {
            cargarCurso(cursos);
        }
	
	});
}

function traerCursos(){
    let nivel = $('#nivel_estudiante').text();
    let data = {nivel}
    $.ajax({
        type: "GET",
        url: "/client/cargarCursos",
        data:data,
        contentType: "application/json"
    }).then((response) => {
        cursos = response;
        $('#spinnerCursos').toggleClass('d-block');
        $('#spinnerCursos').hide();
        cargarCurso(response);
    }, (error) => {
    });
}
function cargarCurso(cupos) {
    $('#cursos_lista').html('');
    cupos.forEach(cupo => {
        llenarCurso(cupo);
    });
}
function llenarCurso(cupo) {
    let id = cupo.id_grupo;
    let tipo = $('#tipo_estudiante').text();
    let profesor = cupo.nombre.toUpperCase() +" "+ cupo.apellido.toUpperCase();
    let cod_t = cupo.codigo_taller;
    let costo = tipo == 1 ? cupo.costo : cupo.costo_funcionario;
    let nivel = cupo.nivel == 1 ? 'Principiante' : cupo.nivel == 2 ? 'Intermedio' : 'Avanzado';
    let cupos = cupo.cupo_base > 0 ? 'Cupo Disponible' : 'No hay cupos';
    let cupos_t = cupo.cupo_base > 0 ? 'bg-success' : 'bg-danger';
    let fecha = parseFecha(cupo.dia,cupo.hora);
    $('#cursos_lista').append(
        '<div class="w-100 my-3">'+
        '<div class="card-cursos-header">'+
        '<h5 id="nombre">(Taller) Piscina Nivel '+nivel+' <br><span id="nrc">'+cod_t+'</span></h5>'+
        '<span class="my-auto badge badge-pill '+cupos_t+'" id="cupo">'+cupos+'</span>'+
        '</div>'+
        '<div class="card-cursos-body">'+
        '<p class="my-0" id="horario">'+fecha+'</p>'+
        '<i class="fas fa-swimmer fa-3x text-celeste"></i>'+
        '</div>'+
        '<div class="card-cursos-footer">'+
        '<div class="row w-100">'+
        '<div class="col-md-6">'+
        '<small id="profesor">Profesor: '+profesor+'</small>'+
        '</div>'+
        '<div class="col-md-6 d-flex justify-content-md-end">'+
        '<a href="#" class="mx-3 btn btn-secondary disabled" role="button" id="precio">'+costo+' Colones</a>'+
        '<div class="custom-control custom-checkbox">' +
        '<input type="checkbox" id="matricularCursoCheckbox-' + id + '" class="custom-control-input" value="' + id + '" data-price="'+costo+'" name="matricularCursoCheckbox-'+id+'" onclick="eventSeleccionar('+id+')"/>' +
        '<label class="custom-control-label" for="matricularCursoCheckbox-' + id + '">Matricular</label></div>' +
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
    );
}
function ocultarAlertaDanger(){
    $('#cerrarAlertaDanger').on('click',function(){
        $("#alertadanger").fadeOut('slow');
    });
}
function ocultarAlertaSuccess(){
    $('#alertasucess').on('click',function(){
        $("#alertasucess").fadeOut('slow');
    });
}
function matricularCursos(){
    $('#aceptarMatricularAll').on('click',function(){
        let estudiante = parseInt($('#id_estudiante').text());
        for (let i = 0; i < cursosSeleccionados.length; i++) {
            let data; 
            data = {
                id:cursosSeleccionados[i].id_grupo,
                estudiante,
            };
            console.log(data);
            $.ajax({
                type: "POST",
                url: "/client/matricularCursos",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).then((response) => {
                $("#alertasucess").fadeIn('slow');
            }, (error) => {
                $("#alertadanger").fadeIn('slow');   
            });
        }
        
    });
}
function parseFecha(dia,hora){
    let fecha = dia;
    let h = hora > 12 ? hora - 12 : hora;
    let u = hora >= 12 ? 'pm' : hora == 24 ? 'am' : 'am' ;
    fecha = fecha + " " + h + u + "-" + (h+1) + u;
    return fecha;
}
var getCurso = (id,cursos)=>{
    for(let i=0;i<cursos.length;i++){
        if(cursos[i].id_grupo == id){
            return cursos[i];
        }
    }
}
var filtrarTodos = (cursos, dias, horas)=>{
    let result = [];
    if (horas.length == 0 && dias.length != 0) {
        for (let i = 0; i < cursos.length; i++) {
            for (let j = 0; j < dias.length; j++) {
                if (cursos[i].dia == dias[j]) {
                    result.push(cursos[i]);
                }
            }
        }
    }

    if (horas.length != 0 && dias.length == 0) {
        for (let i = 0; i < cursos.length; i++) {
            for (let w = 0; w < horas.length; w++) {
                if (cursos[i].hora == horas[w]) {
                    result.push(cursos[i]);
                }
            }
        }
    }

    if (horas.length != 0 && dias.length != 0) {
        for (let i = 0; i < cursos.length; i++) {
            for (let j = 0; j < dias.length; j++) {
                for (let w = 0; w < horas.length; w++) {
                    if (cursos[i].dia == dias[j] && cursos[i].hora == horas[w]) {
                        result.push(cursos[i]);
                    }
                }
            }
        }
    }
    return result;
};
var filtradosSeleccionados = (seleccionados, filtrados) =>{
    let result = [];
    for (let i = 0; i < filtrados.length; i++) {
        for (let w = 0; w < seleccionados.length; w++) {
            if (filtrados[i].id_grupo == seleccioados[w].id_grupo) {
                console.log(filtrados[i].id_grupo, seleccionados[w].id_grupo);
                result.push(filtrados[i]);
            }
        }
    }
    return result;
}
var quitarCurso = ( arr, item )=> {
    var i = arr.indexOf( item );
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}

document.addEventListener("DOMContentLoaded", loaded);