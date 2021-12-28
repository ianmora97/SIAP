var g_grupos = new Array();
var g_mapGrupos = new Map();
var g_asistencias = new Array();
var g_mapAsistencias = new Map();

var g_filterby = new Map();

function loaded(event){
    events(event);
}

function events(e){
    loadFromDB()
    loadDatePicker();
}
function loadDatePicker(){
    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        header: true,
        footer: true,
        icons: {
            rightIcon: '<i class="fas fa-calendar-alt text-primary"></i>'
        }
    });
    $('#datepicker + span').find('button').addClass('btn-sm');
    $('#datepicker + span').after(`
        <span class="input-group-append" role="clear-icon">
            <button class="btn btn-outline-danger btn-sm" type="button" onclick="filterAsistenciaDeleteDate()">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `)
    // on change
    $('#datepicker').on('change', function() {
        let fecha = $(this).val();
        addDatatoFilter(fecha,'fecha');
    });
}
function loadFromDB(){
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/api/teach/grupos",
        contentType: "application/json",
        headers: {
            'Authorization': bearer
        },
    }).then((response) => {
        g_grupos = response;
        g_grupos.forEach(g => {
            g_mapGrupos.set(g.id_grupo,g);
        });
        showGruposSelect(response);
        $.ajax({
            type: "GET",
            url: "/api/teach/getAsistencia",
            contentType: "application/json",
            headers: {
                'Authorization': bearer
            },
        }).then((response) => {
            $('#spinnerLoad').remove();
            g_asistencias = response;
            showAsistencias(response);
        }, (error) => {
            
        });
    }, (error) => {
        
    });
}
function showAsistencias(data){
    if(data.length > 0){
        $('#lista').html('');
        data.forEach((a,i) => {
            showAsistencia(a,i);
        });
    }
}
function showAsistencia(item,i){
    let foto = `<img src="/public/uploads/${item.foto}" class="rounded-circle" width="30px">`;
    $('#lista').append(`
        <div class="card mb-3" id="as_card_${i}" data-cedula="${item.cedula}">
            <div class="card-body">
                <div>
                    <div class="d-flex align-items-start justify-content-between">
                        <div class="d-flex justify-content-start align-items-start">
                            <div class="mr-2">
                                ${foto}
                            </div>
                            <div class="">
                                <h5 class="mb-0">${item.nombre}</h5>
                                <small class="text-muted">${item.cedula}</small>    
                            </div>
                        </div>
                        <div class="">
                           <small class="text-muted">${moment(item.fecha,"YYYY-MM-DD").format('ll')}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-2 justify-content-between">
                        <div class="">
                            <p class="mb-0 font-weight-bold"> ${item.descripcion}</p>
                            <small class="text-muted"><i class="fas fa-calendar-day text-info"></i> ${item.dia} ${item.hora} ${item.hora_final}</small>
                        </div>
                        <div class="mr-2">
                            ${item.estado == '1' ? 
                            '<button class="btn btn-success btn-sm"><i class="fas fa-check-circle"></i></button>':
                            '<button class="btn btn-danger btn-sm"><i class="fas fa-times-circle"></i></button>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

}
function showGruposSelect(data){
    let taller = new Set();
    let dia = new Set();
    data.forEach(g => {
        taller.add(g.descripcion);
    });
    data.forEach(g => {
        dia.add(g.dia);
    });
    taller.forEach((g) => {
        $('#gruposSelect').append(`
        <button type="button" class="btn btn-toggle mb-2" data-toggle="button" onclick="addDatatoFilter('${g}','grupo')" 
        aria-pressed="false"><i class="fas fa-flag"></i> ${g}</button>
        `);
    });
    dia.forEach((g) => {
        $('#diasSelect').append(`
        <button type="button" class="btn btn-toggle mb-2" data-toggle="button" onclick="addDatatoFilter('${g}','dia')" 
        aria-pressed="false"><i class="fas fa-calendar-day"></i> ${g}</button>
        `);
    });
}
function filterAsistenciaDeleteDate(){
    g_filterby.delete('fecha');
    $('#datepicker').val('')
    filterAsistencia();
}
function addDatatoFilter(data,type){
    if(type == 'fecha'){
        g_filterby.set('fecha',data);
    }else{
        if(g_filterby.has(data)){
            g_filterby.delete(data);
        }else{
            g_filterby.set(data,true);
        }
    }
    console.log(g_filterby);
    filterAsistencia()
}
function filterAsistencia(){
    if(g_filterby.size > 0){
        $('#lista').html('');
        g_asistencias.forEach((a,i) => {
            if(g_filterby.has(a.descripcion)){
                showAsistencia(a,i);
            }else if(g_filterby.has(a.dia)){
                showAsistencia(a,i);
            }else if(g_filterby.has('fecha')){ //si es fecha
                let fecha = g_filterby.get('fecha');
                if(fecha == a.fecha){
                    showAsistencia(a,i);
                }
            }
        });
    }else{
        showAsistencias(g_asistencias);
    }
}

document.addEventListener('DOMContentLoaded', loaded);