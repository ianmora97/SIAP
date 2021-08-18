/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro

    * Javascript de Casilleros
*/
var listaEstudiantes = [];
var listaCasilleros = [];
var listaCasillerosEstudiantes = [];
var listaEstudiantesMap = new Map();
var listaCasilleroEstudiantesMap = new Map();
var listaCasillerosMap = new Map();
var g_cantidadCasilleros=0;

function loaded(event){
    events(event);
}

function events(event){
    loadFromDb();
    openModalAdd();
    readCasilleroModalOpen();

    agregarCasilleros();
}

$(function () {
    $('[data-toggle="popover"]').popover();
})

function openModalAdd(){
    $('#modalButtonAgregarEstudiante').on('click',function(){
        $('#modalAgregarEstudiante').modal('show')
        animateCSS("#modalAgregarEstudiante",'fadeInUpBig')
    })
    $('#closeModalAgregar').on('click',function(){
        animateCSS("#modalAgregarEstudiante",'fadeOutDownBig').then(()=>{
            $('#modalAgregarEstudiante').modal('hide')
        })
    })
    $('#modalAgregarEstudiante').on('hidePrevented.bs.modal', function (event) {
        animateCSS("#modalAgregarEstudiante",'shakeX')
    })
}
function agregarCasilleros() {
    let bearer = 'Bearer '+g_token;
    $('#addCasilleroInputModal').on('keyup', function (){
        let val = $('#addCasilleroInputModal').val();
        let res = listaCasilleros.find(i => i.codigo == 'CA'+val);
        if(res != undefined){
            console.log('existe');
            $('.formgroup-casillero').addClass('ya-existe');
            $('#feedbackInputCasilleroModal').html('Ya existe este casillero');
            $('#agregarCasilleroButton').prop('disabled',true);
        }else{
            $('.formgroup-casillero').removeClass('ya-existe');
            $('#feedbackInputCasilleroModal').html('');
            $('#agregarCasilleroButton').prop('disabled',false);
        }
    });
    $('#agregarCasilleroButton').on('click',function (){
        let codigo = 'CA'+$('#addCasilleroInputModal').val();
        $.ajax({
            type: "GET",
            url: "/admin/casilleros/agregarCasillero",
            data: {codigo},
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/casilleros"
        }, (error) => {
    
        });
    });
    $('#eliminarCasilleroModal').on('click',function (){
        let codigo = $('.codigoModal').html();
        console.log(codigo)
        $.ajax({
            type: "GET",
            url: "/admin/casilleros/eliminarCasillero",
            data: {codigo},
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/casilleros"
        }, (error) => {
    
        });
    });
}
var busquedaAnterior='';
function searchonfind(params) {
    let codigo = $('#barraBuscar').val();
    if(codigo.search('CA') != -1 || codigo.search('ca') != -1){
   
        $(`.casilleroFormat[data-codigo="${codigo}"]`).addClass('warningFind');
        
        if(busquedaAnterior != ''){
            $(busquedaAnterior).removeClass('warningFind');
        }
        if(listaCasillerosMap.get(codigo)){
            busquedaAnterior = `.casilleroFormat[data-codigo="${codigo}"]`;   
        }
    }else{
        $(`.casilleroFormat[data-codigo="CA${codigo}"]`).addClass('warningFind');

        if(busquedaAnterior != ''){
            $(busquedaAnterior).removeClass('warningFind');
        }
        if(listaCasillerosMap.get('CA'+codigo)){
            busquedaAnterior = `.casilleroFormat[data-codigo="CA${codigo}"]`;   
        }
    }
}
function asignaruncasillero(cedula) {
    let bearer = 'Bearer '+g_token;
    let codigo = $('.codigoModal').html();
    let date = new Date();
    let horaEntrada = date.getHours()+":"+date.getMinutes()+":00";
    let horaSalida = ( date.getHours()+1)+":"+date.getMinutes()+":00";
    let data = {
        cedula,codigo,horaEntrada,horaSalida
    }
    console.log(data);
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/asignarCasillero",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/casilleros"
    }, (error) => {

    });
}

function loadFromDb() {
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/bringCasilleros",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        g_cantidadCasilleros = response.length;
        $('#addCasilleroInputModal').val( response.length + 1);
        cargarMatrizCasilleros(response)
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/bringEstudiantes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        cargarEstudiantes(response);
    }, (error) => {

    });
    
}

function cargarEstudiantes(estudiantes) {
    let bearer = 'Bearer '+g_token;
    estudiantes.forEach(u =>{
        listaEstudiantes.push(u);
        listaEstudiantesMap.set(u.id,u);
        $('#bodyTableModal').append(`
        <tr style="border-bottom:1px solid #c1c1c1 !important;">
            <td class="py-2 align-middle"><strong class="text-muted">${u.cedula}</strong></td>
            <td class="py-2">
                <h6 class="text-primary"><strong>${u.nombre+" "+u.apellido}</strong></h6>
                <button class="btn bg-light btn-sm py-0" >
                    Estado: <span class="badge badge-${u.moroso? "danger":"success"}">${u.moroso? "Moroso":"Activo"}</span>
                </button>
            </td>
            <td>
            <button class="btn bg-success btn-sm py-0 text-white ${u.moroso? "disbled":""}" 
            ${u.moroso? "disabled='disbled'":""} onclick="asignaruncasillero('${u.cedula}')">Asignar Casillero</button>
            </td>
        </tr>
        `);
    });
    $('#tablaBusquedaModal').DataTable({
        stateSave: true,
        ordering:  false,
        "paging": false,
        info: false,
        "pageLength": 5
    });
    $('#tablaBusquedaModal_filter').css('display','none');
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/bringCasillerosEstudiantes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#casilleros_disponibles_stats').html(g_cantidadCasilleros - response.length);
        $('#casilleros_en_uso_stats').html(response.length);
        cargarCasillerosEstudiantes(response);
    }, (error) => {

    });
}
function buscarModalEstudiantes() {
    var table = $('#tablaBusquedaModal').DataTable();
    let val = $('#inputBuscarEstudianteModal').val();           
    let result = table.search( val ).draw();
}
function readCasilleroModalOpen() {
    $('#modalAsignarCasillero').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) 
        var codigo = button.data('codigo') 
        let estado = button.data('estado');

        var modal = $(this)
        modal.find('.codigoModal').html(codigo)
        if(estado == "1"){ //ocupado
            let id = listaCasilleroEstudiantesMap.get(codigo);
            $('#idCasilleroModal').html(id.id_reserva);
            modal.find('#asignarModal').hide();
            modal.find('#revocarModal').show();
            $('#modal-dialog-size').removeClass('modal-lg');
            $('#modal-dialog-size').addClass('modal-sm');
        }else{
            modal.find('#asignarModal').show();
            modal.find('#revocarModal').hide();
            $('#modal-dialog-size').addClass('modal-lg');
            $('#modal-dialog-size').removeClass('modal-sm');
        }
    })
}
function revocarCasillero() {
    let bearer = 'Bearer '+g_token;
    let id = $('#idCasilleroModal').html();
    let codigo = $('.codigoModal').html();
    $.ajax({
        type: "GET",
        url: "/admin/casilleros/revocarCasillero",
        data: {id,codigo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/casilleros";
    }, (error) => {

    });
}
function cargarCasillerosEstudiantes(casillerosEstudiantes) {
    if(casillerosEstudiantes.length != 0){
        casillerosEstudiantes.forEach(u =>{
            listaCasillerosEstudiantes.push(u);
            listaCasilleroEstudiantesMap.set(u.codigo_casillero,u);
            let mapa = listaEstudiantesMap.get(u.id_usuario);
            $(`#nombreEstudianteCodigo-${u.codigo_casillero}`).html(`<small class="text-white">${mapa.nombre}</small>`);
        });
    }
}
function cargarMatrizCasilleros(data) {
    let cont = 0;
    $('#casillerosMatrix').html('');
    $('#totalCasilleros_stats').html(data.length);
    for (let i = 0; i < Math.ceil( data.length / 6); i++) {
        $('#casillerosMatrix').append(`<div class="row w-100  mb-2" id="filaCasillero_${i}">`);
        for (let j = 0; j < 6; j++) {
            listaCasillerosMap.set(data[cont].codigo,data[cont]);
            $(`#filaCasillero_${i}`).append(
                `<div class="col-md" id="casillero_cod_${data[cont].codigo}">
                    <div class="casilleroFormat ${data[cont].estado ? 'ocupado' :'libre'}" data-codigo="${data[cont].codigo}" data-estado="${data[cont].estado}" 
                    data-toggle="modal" data-target="#modalAsignarCasillero" role="button">
                        <div>${data[cont].codigo}</div>
                        <div class="d-flex justify-content-between">
                            <span id="nombreEstudianteCodigo-${data[cont].codigo}"></span>
                            <span class="text-white text-right">${data[cont].estado ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>'}</span>
                        </div>
                    </div>
                </div>
                `
            );
            listaCasilleros.push(data[cont]);
            cont++;
        }
        $('#casillerosMatrix').append(`</div>`);
    }
}
function showMatrizCasilleros(c) {
    let cedula = c.id;
    let nombre = c.codigo;

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
document.addEventListener("DOMContentLoaded", loaded);