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
}
function eventSeleccionar(curso) {
    let all = $("[id*=matricularCursoCheckbox-]");
    let select = [];
    let montoCantidad = 0;

    for (let i = 0; i < all.length; i++) {
        if (all[i].checked) {
            select.push(all[i].value);
            cursosSeleccionados.push(all[i]); //FILTRAR CURSOS SELECCIONADOS
            if(montoCantidad != 0){
                montoCantidad += 1000;
            }else{
                montoCantidad += $('#matricularCursoCheckbox-'+all[i].value).data('price');
            }
        }
    }
    let contadorCursos = select.length;
    montoTotal = montoCantidad;
    $('#montoTotal').text(montoTotal);
    if(contadorCursos == 3){
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
    $("#matricularCursoApply").on("click", function () {  
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
        if (horas.length != 0 || dias.length != 0) {
            let vector = [];
            vector = filtrarTodos(cursos,dias,horas);
            vector = filtradosSeleccionados(cursosSeleccionados,vector);
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
        console.log(cursos);
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
        '<label class="custom-control-label" for="matricularCursoCheckbox-' + id + '">Matricular</label></div></td>' +
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
    );
}
function matricularCursos(){
    let nivel = $('#nivel_estudiante').text();
    let data = {nivel}
    $.ajax({
        type: "GET",
        url: "/client/matricularCursos",
        data:data,
        contentType: "application/json"
    }).then((response) => {
        cursos = response;
        console.log(cursos);
        cargarCurso(response);
    }, (error) => {
    });
}
function parseFecha(dia,hora){
    let fecha = dia;
    let h = hora > 12 ? hora - 12 : hora;
    let u = hora >= 12 ? 'pm' : hora == 24 ? 'am' : 'am' ;
    fecha = fecha + " " + h + u + "-" + (h+1) + u;
    return fecha;
}
var filtrarxdia = (array, selected)=>{
	let result = [];
	for(let j=0;j<selected.length;j++){
		for(let i=0;i<array.length;i++){
			if(array[i].dia.toUpperCase() == selected[j].toUpperCase()){
				result.push(array[i])
			}
		}	
	}
	return result;
}
var filtrarxhora = (array, selected)=>{
	let result = [];
	for(let j=0;j<selected.length;j++){
		for(let i=0;i<array.length;i++){
			if(array[i].hora == selected[j]){
				result.push(array[i])
			}
		}	
	}
	return result;
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
var filtradosSeleccionados = (seleccioados, filtrados) =>{
    let result = [];
    for (let i = 0; i < filtrados.length; i++) {
        for (let w = 0; w < seleccioados.length; w++) {
            if (filtrados[i].id == seleccioados[w].id) {
                result.push(filtrados[i]);
            }
        }
    }
    return result;
}
document.addEventListener("DOMContentLoaded", loaded);