function loaded(event){
    events(event);
}

function events(event){
    
}

var g_currentModule = '';
var g_moduleCont = 0;

function agregarModuloTitulo(){
    g_moduleCont++;
    $('#botonesPropModulo').append(`
        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownAligmentTitle" 
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
            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownHeaderLevelTitle" 
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
            <label class="btn btn-light">
                <input type="checkbox"> <i class="fas fa-bold" onclick="mod_title_togglebold()"></i>
            </label>
        </div>
    `);
    $('#moduloConfig').append(`
        <span id="title" contentEditable="true" class="h1" style="display:block;">Titulo</span>   
    `);
}
function mod_title_align(align){
    $('#title').css('text-align',align);
}
function mod_title_headerLevel(level){
    $('#title').removeClass('h1');
    $('#title').removeClass('h2');
    $('#title').removeClass('h3');
    $('#title').removeClass('h4');
    $('#title').removeClass('h5');
    $('#title').removeClass('h6');
    $('#title').addClass(level);
}
function mod_title_togglebold(){
    if($('#title').css('font-weight') == '700'){
        $('#title').css('font-weight','normal');
    }else{
        $('#title').css('font-weight','700');
    }
}

document.addEventListener("DOMContentLoaded", loaded);