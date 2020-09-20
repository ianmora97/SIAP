function loaded(event) {
    events(event);
}

function events(event) {
    toogleMenu();
    cargar_Estudiantes();
    dropdownhoras();
    filtrarXdia();
}

//--------------------------------------------------------------
var estudiantes = [];

function cargar_Estudiantes() {
    $.ajax({
        type: "GET",
        url: "/admin/matricula/listaest",
        contentType: "application/json",
    }).then(
        (solicitudes) => {
            estudiantes = solicitudes;
            cargarEstudiantes(solicitudes);
        },
        (error) => {
            alert(error.status);
        }
    );
}

function cargarEstudiantes(solicitudes) {
    $("#lista-estudiantes").html("");
    solicitudes.forEach((solicitudes) => {
        llenarEstudiantes(solicitudes);
    });
}

function llenarEstudiantes(solicitudes) {
    let nrc = solicitudes.codigo_taller;
    let nivel = solicitudes.nivel_taller;
    let id_grup = solicitudes.id_grupo;
    let dia = solicitudes.dia;
    let hora = solicitudes.hora;
    let nombre_pro = solicitudes.nombre_profesor;
    let id_matri = solicitudes.id_matricula;
    let consenti = solicitudes.consentimiento;
    let id_est = solicitudes.id_estudiante;
    let id_usu = solicitudes.id_usuario;
    let cedul = solicitudes.cedula;
    let nomb =
        solicitudes.nombre.toUpperCase() +
        " " +
        solicitudes.apellido.toUpperCase();
    $("#lista-estudiantes").append(
        "<tr>" +
            "<td>" +
            cedul +
            " </td>" +
            "<td>" +
            nomb +
            "</td>" +
            "<td>" +
            nrc +
            "</td>" +
            "<td>" +
            dia +
            "</td>" +
            "<td>" +
            nivel +
            "</td>" +
            "<td>" +
            nombre_pro +
            "</td>" +
            "<td> por hacer</td>" +
            "<td>" +
            id_matri +
            "</td>" +
            "</tr>"
    );
}

function dropdownhoras() {
    $("#dropdownboton").on("click", function () {
        $("#dropdownhoras").toggle();
    });
}

function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}

function filtrarXdia() {
    //primero obtiene los elementos marcados
    $("#aplicarFiltro").on("click", function () {
        let dias = [];
        let seleccionados = $("[id*=filter_lista_dias_]");

        for (let i = 0; i < seleccionados.length; i++) {
            if (seleccionados[i].checked) {
                dias.push(seleccionados[i].name.toUpperCase());
            }
        }
        if(dias.length != 0){
            cargarEstudiantes(filtrarxdia(estudiantes, dias));
        }else{
            cargarEstudiantes(estudiantes);
        }
        
    });
}

var filtrarxdia = (array, selected) => {
    let result = [];
    for (let j = 0; j < selected.length; j++) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].dia == selected[j]) {
                result.push(array[i]);
            }
        }
    }
    return result;
};

function filtrarXhora() {}

document.addEventListener("DOMContentLoaded", loaded);
