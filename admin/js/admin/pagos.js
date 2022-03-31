var g_listaPagos = new Array();
var g_mapPagos = new Map();

var g_estudiantes = new Array();
var g_grupos = new Array();

function loaded(event){
    loadDB();
    onEstudiantesAgregarChange();
}

moment.lang('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function onEstudiantesAgregarChange(){
    $("#estudiantesAgregarSelect").change(function(e){
        let op = parseInt($(this).val());
        let grupos = g_grupos.filter(e => e.id_estudiante == op);
        $("#grupoAgregarSelect").empty();
        if(grupos.length > 0){
            $("#grupoAgregarSelect").append('<option value="no_0">Seleccione un grupo</option>');
            grupos.forEach(e => {
                $("#grupoAgregarSelect").append('<option value="' + e.id_grupo + '">' + e.dia +" "+ e.hora + '</option>');
            });
        }else{
            $("#grupoAgregarSelect").append('<option value="no_0">No hay matriculas registradas</option>');
        }
    });
}
function registrarPago(){
    let id_estudiante = parseInt($("#estudiantesAgregarSelect").val());
    let id_grupo = parseInt($("#grupoAgregarSelect").val());
    let cuenta = $("#cuentaAgregarModal").val() == "" ? "Vacio" : $("#cuentaAgregarModal").val();
    let monto = parseInt($("#montoAgregarModal").val());

    if(id_estudiante != "" || id_grupo != "no_0" || monto != ""){
        let pago = {
            est: id_estudiante,
            grupo: id_grupo,
            cuenta: cuenta,
            monto: monto,
        }
        console.log(pago);
        let bearer = "Bearer " + g_token;
        $.ajax({
            type: "GET",
            url: "/admin/pagos/agregar",
            data: pago,
            contentType: "appication/json",
            headers: {
                Authorization: bearer,
            },
        }).then((response) => {
            $("#modalAgregar").modal('hide');
            location.reload();
        },(error) => {
            console.log(error);
        });
    }
}
function loadDB(){
    let ajaxTime = new Date().getTime();
    let bearer = "Bearer " + g_token;
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes",
        contentType: "appication/json",
        headers: {
            Authorization: bearer,
        },
    }).then((estudiantes) => {
        g_estudiantes = estudiantes;
        buildOptionsEst(g_estudiantes);
        $.ajax({
            type: "GET",
            url: "/admin/matricula/listaMatriculados",
            contentType: "appication/json",
            headers: {
                Authorization: bearer,
            },
        }).then((grupos) => {
            g_grupos = grupos;
            $.ajax({
                type: "GET",
                url: "/admin/pagos/getPagos",
                contentType: "appication/json",
                headers: {
                    Authorization: bearer,
                },
            }).then((response) => {
                let totalTime = new Date().getTime() - ajaxTime;
                let a = Math.ceil(totalTime / 1000);
                let t = a == 1 ? a + " segundo" : a + " segundos";
                $("#infoTiming").text(t);
                g_listaPagos = response;
                buildTable(response);
                closeProgressBarLoader();
            },(error) => {
        
        });
    
        },(error) => {
    
        });

    },(error) => {

    });
}
function buildOptionsEst(estudiantes){
    $("#estudiantesAgregarSelect").empty();
    $("#estudiantesAgregarSelect").append('<option value="">Seleccione un estudiante</option>');
    estudiantes.forEach(e => {
        $("#estudiantesAgregarSelect").append('<option value="' + e.id_estudiante + '">' + e.nombre +" " + e.apellido+ '</option>');
    });
}
function buildTable(data){
    $("#lista").empty();
    data.forEach(e => {
        g_mapPagos.set(e.id_pago,e);
        buildRowTable(e);
    });
    $('#table').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos en la tabla",
            "info":           "Mostrando _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 registros",
            "infoFiltered":   "(Filtrado de _MAX_ registros totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron registros similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
    });
    $('#info').html('');
    $('#pagination').html('');
    $('#length').html('');

    $('#table_wrapper').addClass('px-0')
    let a = $('#table_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#table_filter').css('display', 'none');
    $('#table_info').appendTo('#info');
    
    $('#table_paginate').appendTo('#pagination');

    $('#table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#table_length').find('label').find('select').appendTo('#length');
    $('#table_length').html('');
}
function buildRowTable(e){
    let foto = `<img src="/public/uploads/${e.foto}" class="rounded-circle" width="40px" height="40px">`;
    $("#lista").append(`
        <tr>
            <td>${foto}</td>
            <td>${e.cedula}</td>
            <td><a href="/admin/estudiantes/getEstudiante/${e.cedula}">${e.nombre} ${e.apellido}</a></td>
            <td style="line-height: 1.5;">
                <div class="d-flex flex-column">
                    <div><strong>${e.dia}: ${e.hora} - ${e.hora_final}</strong></div>
                    <div><span class="">${e.descripcion}</span></div>
                </div>
            </td>
            <td id="colones-tippy-${e.id_pago}">₡ ${e.monto_pagado}</td>
            <td>${moment(e.pagado_fecha).format('LL')}</td>
            <td>
                <button type="button" class="btn btn-sm d-inline btn-warning text-white" 
                data-toggle="modal" data-target="#actualizarModal" data-id="${e.id_pago}"><i class="fa-solid fa-pencil"></i> Actualizar</button>
                <button type="button" class="btn btn-sm d-inline btn-danger" 
                data-toggle="modal" data-target="#borrarPago" data-id="${e.id_pago}"><i class="fa-solid fa-delete-left"></i> Eliminar</button>
            </td>
        </tr>
    `);
    tippy(`#colones-tippy-${e.id_pago}`, {
        content: `Colones`,
        placement: 'top',
        animation: 'shift-away-extreme',
    });
}

document.addEventListener("DOMContentLoaded", loaded);