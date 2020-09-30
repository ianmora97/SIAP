
var lugares = [];

function procesarLugares(data) {
    lugares = data;
    var lines = data.split("\n");

    var provincia = [];
    var cantones = [];
    var distritos = [];

    for (var j=0; j<lines.length -1; j++) {
        var values = lines[j].split(' ,'); 
        provincia.push((values[0])); 
        cantones.push((values[1]));
        distritos.push((values[2]));
    }
    load_provincias(provincia);
    load_cantones(cantones);
    load_distritos(distritos);
}

function load_provincias(data) {
    let provincias = data;
    provincias = provincias.filter(function(item, pos) { //elimina repetidos
        return provincias.indexOf(item) == pos;
    })
    let c = $('#provinciaSelected').attr('data-values');

    for (let provincia of provincias) {
        if(provincia == c){
            $('#provincia').append(new Option(provincia, provincia,false,true));
        }else{
            $('#provincia').append(new Option(provincia, provincia));
        }
    }
}
function load_cantones(data) {
    let pro = $('#provinciaSelected').attr('data-values');
    let c = $('#cantonSelected').attr('data-values');
    let cantones = data;
    cantones = filtrarCantonxProvincia(pro);
    $('#canton').html(' ');
    for (let canton of cantones) {
        if(canton == c){
            $('#canton').append(new Option(canton, canton,false,true));
        }else{
            $('#canton').append(new Option(canton, canton));
        }
    }
}
function load_distritos(data) {
    let distritos = data;
    let can = $('#cantonSelected').attr('data-values');
    let dis = $('#distritoSelected').attr('data-values');
    distritos = filtrarDistritoxCanton(can);
    $('#distrito').html(' ');
    for (let distrito of distritos) {
        if(distrito == dis){
            $('#distrito').append(new Option(dis, dis,false,true));
        }else{
            $('#distrito').append(new Option(distrito, distrito));
        }
    }
}


function filtrarCantonxProvincia(p){
    var lines = lugares.split("\n");
    var cantones = [];

    for (var j=0; j<lines.length -1; j++) {
        var values = lines[j].split(' ,');
        if(p == values[0]) cantones.push((values[1]));
    }
    cantones = cantones.filter(function(item, pos) { //elimina repetidos
        return cantones.indexOf(item) == pos;
    })
    return cantones;
}

function filtrarDistritoxCanton(canton){
    var lines = lugares.split("\n");
    var distrito = [];
    for (var j=0; j<lines.length -1; j++) {
        var values = lines[j].split(' ,');
        if(canton == values[1]) distrito.push((values[2]));
    }
    
    return distrito;
}

function filtrarCantones(provincia){
    let cantones = filtrarCantonxProvincia(provincia);
    $('#canton').html(' ');
    $('#distrito').html(' ');
    for (let canton of cantones) {
        $('#canton').append(new Option(canton, canton));
    }
}
function filtrarDistritos(canton) {
    let  distritos = filtrarDistritoxCanton(canton);
    $('#distrito').html(' ');
    for (let distrito of distritos) {
        $('#distrito').append(new Option(distrito, distrito));
    }
}

var validate = (u) => {
    if (!u.celular || !u.correo) return false;
    // if (!u.carrera || !u.provincia || !u.canton || !u.distrito || !u.direccion) return false;
    return true;
};
var check = (u) => {
    let error = [];
    if (!u.celular) error.push("celular");
    if (!u.telefono) error.push("telefono");
    if (!u.emergencia) error.push("telefono de emergencia");
    if (!u.correo) error.push("correo");
    if (!u.carrera) error.push("carrera");
    if (!u.provincia) error.push("provincia");
    if (!u.canton) error.push("canton");
    if (!u.distrito) error.push("distrito");
    if (!u.direccion) error.push("direccion");
    return error;
};


export { procesarLugares, filtrarCantones, filtrarDistritos, lugares, validate, check };