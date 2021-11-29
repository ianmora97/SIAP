function loaded(event){
    events(event);
}

function events(event){
    
}

var g_currentModuleName = '';
var g_isCurrentModuleActive = false;
var g_moduleCont = 0;
var g_configModule = new Map();

var g_allModules = new Array();

// TODO: map to object
function mapToObject(map) {
    var obj = new Object();
    for (var [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}
// TODO: Agrega modulo
var g_conterAddModule = 0;
function agregarModulo(){
    if(g_isCurrentModuleActive){
        g_conterAddModule++;
        g_allModules.push({
            id: `${g_currentModuleName}_${g_moduleCont}`,
            order: g_conterAddModule,
            name: g_currentModuleName,
            config: mapToObject(g_configModule)
        });
        showPreview();
        g_isCurrentModuleActive = false;
        g_currentModuleName = '';
    }
}
function showPreview(){
    $('#allPreview').html(''); 
    g_allModules.forEach(modulo => {
        let clases = '';
        if(modulo.config.hasOwnProperty('align')){
            clases += `text-${modulo.config['align']} `;
        }
        if(modulo.config.hasOwnProperty('headerLevel')){
            clases += `${modulo.config['headerLevel']} `;

        }
        if(modulo.config.hasOwnProperty('bold')){
            if(modulo.config['bold'] == '700'){
                clases += 'font-weight-bold ';
            }
        }
        var html = `
        <div class="d-block position-relative module-preview mb-2 py-2" id="${modulo.name}_${modulo.order}_preview">
            <div class="position-absolute" style="top:5px;right:5px;">
                <button class="btn text-danger btn-sm" onclick="eliminarThisModulo('${modulo.name}_${modulo.order}_preview')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="position-absolute d-flex flex-column" style="top:0;left:-5px;">
                <button class="btn btn-light text-primary btn-sm" onclick="moverUnNivelArriba('${modulo.name}_${modulo.order}_preview')">
                    <i class="fas fa-caret-up"></i>
                </button>
                <button class="btn btn-light text-primary btn-sm" onclick="moverUnNivelAbajo('${modulo.name}_${modulo.order}_preview')">
                    <i class="fas fa-caret-down"></i>
                </button>
            </div>
        `;
        if(modulo.name == 'Title' || modulo.name == 'Text'){
            html += `<span class="d-block ${clases}">${modulo.config['data']}</span>`;
        }else if(modulo.name == 'Image'){
            html += `<div class="d-block w-100"><img src="${modulo.config['data']}" style="width:100%;"/></div> `;
        }else if(modulo.name == 'Caousel'){
            html += ``;
        }
        $('#allPreview').append(`${html}</div>`);
    });
    clearPropsConfig();
}
// TODO: Elimina el modulo
function eliminarModulo() {
    if(g_isCurrentModuleActive){
        clearPropsConfig();
    }
}
// TODO: Limpia los valores de configuracion
var clearPropsConfig = () => {
    $('#moduloConfig').html('');
    $('#botonesPropModulo').html('');
    g_isCurrentModuleActive = false;
    g_currentModuleName = '';
    g_configModule.clear();
    $('#agregarModuloBtn').prop('disabled',true);
    $('#eliminarModuloBtn').prop('disabled',true);
}
// TODO: eliminar el modulo del preview
function eliminarThisModulo(id){
    var modulo = g_allModules.find(modulo => modulo.id === id.split('_preview')[0]);
    var index = g_allModules.indexOf(modulo);
    g_allModules.splice(index, 1);
    showPreview();
}

function moverUnNivelArriba(id){
    var modulo = g_allModules.find(modulo => modulo.id === id.split('_preview')[0]);
    var index = g_allModules.indexOf(modulo);
    if(index > 0){
        var moduloUp = g_allModules[index-1];
        g_allModules[index-1] = modulo;
        g_allModules[index] = moduloUp;
        showPreview();
    }
}
function moverUnNivelAbajo(id){
    var modulo = g_allModules.find(modulo => modulo.id === id.split('_preview')[0]);
    var index = g_allModules.indexOf(modulo);
    if(index < g_allModules.length-1){
        var moduloDown = g_allModules[index+1];
        g_allModules[index+1] = modulo;
        g_allModules[index] = moduloDown;
        showPreview();
    }
}
function salvar(){
    let vec = new Array();
    for (let i = 0; i < g_allModules.length; i++) {
        const element = g_allModules[i];
        element.order = i+1;
        vec.push(element);
    }
    console.log(vec)
}
// ! -------------------------------------------------- TITLE MODULE --------------------------------------------------

function agregarModuloTitulo(){
    //enable button
    $('#agregarModuloBtn').prop('disabled',false);
    $('#eliminarModuloBtn').prop('disabled',false);

    if(g_isCurrentModuleActive){
        alert('Debe terminar el modulo actual antes de agregar otro');
        return false;
    }

    g_currentModuleName = 'Title';
    g_isCurrentModuleActive = true;
    g_moduleCont++;

    g_configModule.set('headerLevel','h1');
    g_configModule.set('data', 'Title');

    $('#botonesPropModulo').html('');
    $('#moduloConfig').html('');

    $('#botonesPropModulo').append(`
        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle btn-sm" type="button" id="dropdownAligmentTitle" 
            data-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-align-center"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownAligmentTitle">
                <a class="dropdown-item" href="#" onclick="mod_title_align('left')"><i class="fas fa-align-left"></i></a>
                <a class="dropdown-item" href="#" onclick="mod_title_align('center')"><i class="fas fa-align-justify"></i></a>
                <a class="dropdown-item" href="#" onclick="mod_title_align('right')"><i class="fas fa-align-right"></i></a>
            </div>
        </div>
        <div class="dropdown ml-2">
            <button class="btn btn-light dropdown-toggle btn-sm" type="button" id="dropdownHeaderLevelTitle" 
            data-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-heading"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownHeaderLevelTitle">
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h1')"><i class="fas fa-heading"></i> 1</a>
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h2')"><i class="fas fa-heading"></i> 2</a>
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h3')"><i class="fas fa-heading"></i> 3</a>
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h4')"><i class="fas fa-heading"></i> 4</a>
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h5')"><i class="fas fa-heading"></i> 5</a>
                <a class="dropdown-item" href="#" onclick="mod_title_headerLevel('h6')"><i class="fas fa-heading"></i> 6</a>
            </div>
        </div>
        <div class="btn-group-toggle ml-2" data-toggle="buttons">
            <label class="btn btn-light btn-sm">
                <input type="checkbox" onclick="mod_title_togglebold()"> <i class="fas fa-bold" ></i>
            </label>
        </div>
    `);
    $('#moduloConfig').append(`
        <span id="title" contentEditable="true" class="h1" style="display:block;" onkeyup="updateModuleTitle()">Titulo</span>   
    `);
}
function updateModuleTitle(){
    g_configModule.set('data', $('#title').text());
}
function mod_title_align(align){
    $('#title').css('text-align',align);
    g_configModule.set('align',align);
}
function mod_title_headerLevel(level){
    $('#title').removeClass('h1');
    $('#title').removeClass('h2');
    $('#title').removeClass('h3');
    $('#title').removeClass('h4');
    $('#title').removeClass('h5');
    $('#title').removeClass('h6');
    $('#title').addClass(level);
    g_configModule.set('headerLevel',level);
}
function mod_title_togglebold(){
    if($('#title').css('font-weight') == '700'){
        $('#title').css('font-weight','normal');
    }else{
        $('#title').css('font-weight','700');
    }
    g_configModule.set('bold',$('#title').css('font-weight'));
}
// ! -------------------------------------------------- BODY TEXT MODULE --------------------------------------------------

function agregarModuloTexto(){
    //enable button
    $('#agregarModuloBtn').prop('disabled',false);
    $('#eliminarModuloBtn').prop('disabled',false);

    if(g_isCurrentModuleActive){
        alert('Debe terminar el modulo actual antes de agregar otro');
        return false;
    }

    g_currentModuleName = 'Text';
    g_isCurrentModuleActive = true;
    g_moduleCont++;

    g_configModule.set('data', 'Texto');

    $('#botonesPropModulo').html('');
    $('#moduloConfig').html('');

    $('#botonesPropModulo').append(`
        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle btn-sm" type="button" id="dropdownAligmentBodyText" 
            data-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-align-center"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownAligmentBodyText">
                <a class="dropdown-item" href="#" onclick="mod_bodyText_align('left')"><i class="fas fa-align-left"></i></a>
                <a class="dropdown-item" href="#" onclick="mod_bodyText_align('center')"><i class="fas fa-align-justify"></i></a>
                <a class="dropdown-item" href="#" onclick="mod_bodyText_align('right')"><i class="fas fa-align-right"></i></a>
            </div>
        </div>
        <div class="btn-group-toggle ml-2" data-toggle="buttons">
            <label class="btn btn-light btn-sm">
                <input type="checkbox" onclick="mod_bodyText_togglebold()"> <i class="fas fa-bold" ></i>
            </label>
        </div>
    `);
    $('#moduloConfig').append(`
        <p id="bodyTextProp" contentEditable="true" style="display:block;" onkeyup="updateModuleBodyText()">Texto</p>   
    `);
}
function updateModuleBodyText(){
    g_configModule.set('data', $('#bodyTextProp').text());
}
function mod_bodyText_align(align){
    $('#bodyTextProp').css('text-align',align);
    g_configModule.set('align',align);
}
function mod_bodyText_togglebold(){
    if($('#bodyTextProp').css('font-weight') == '700'){
        $('#bodyTextProp').css('font-weight','normal');
    }else{
        $('#bodyTextProp').css('font-weight','700');
    }
    g_configModule.set('bold',$('#bodyTextProp').css('font-weight'));
}
// ! -------------------------------------------------- IMAGEN MODULE --------------------------------------------------

function agregarModuloImagen(){
    //enable button
    $('#agregarModuloBtn').prop('disabled',false);
    $('#eliminarModuloBtn').prop('disabled',false);

    if(g_isCurrentModuleActive){
        alert('Debe terminar el modulo actual antes de agregar otro');
        return false;
    }

    g_currentModuleName = 'Image';
    g_isCurrentModuleActive = true;
    g_moduleCont++;

    g_configModule.set('data', '/img/placeholder.png');

    $('#botonesPropModulo').html('');
    $('#moduloConfig').html('');

    $('#botonesPropModulo').append(`
        <div class="custom-file" style="width: 80px;">
            <input type="file" class="custom-file-input" id="imageModuleSelect" lang="es" onchange="mod_image_changeImage('up')">
            <label class="custom-file-label" for="imageModuleSelect"></label>
        </div>
        <div class="ml-2">
            <input type="text" class="form-control" id="inputImageModuleNetwork" placeholder="https://image.jpg" onchange="mod_image_changeImage('net')">
        </div>
        <script>
            tippy('#imageModuleSelect', {
                content: 'Subir un Archivo',
            });
            tippy('#inputImageModuleNetwork', {
                content: 'Imagen de internet',
            });
        </script>
    `);
    $('#moduloConfig').append(`
        <div class="d-block w-100">
            <img src="/img/placeholder.png" style="width:100%;"/>
        </div>  
    `);
}
function mod_image_changeImage(type){
    if(type === 'up'){
        var file = $('#imageModuleSelect')[0].files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#moduloConfig').html(`
                <div class="d-block w-100">
                    <img src="`+e.target.result+`" style="width:100%;"/>
                </div>
            `);
            g_configModule.set('data', e.target.result);
        }
        reader.readAsDataURL(file);
    }else if(type === 'net'){
        $('#moduloConfig').html(`
            <div class="d-block w-100">
                <img src="`+$('#inputImageModuleNetwork').val()+`" style="width:100%;"/>
            </div>
        `);
        g_configModule.set('data', $('#inputImageModuleNetwork').val());
    }
}



document.addEventListener("DOMContentLoaded", loaded);