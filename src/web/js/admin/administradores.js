
const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

function loaded(event){
  events(event);
}

function events(event){
  traerTablas();
  bringDB();
  toogleMenu();
  modals();
}
function toogleMenu() {
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      //$('#sidebar-wrapper').css('position','relative');
      $("#wrapper").toggleClass("toggled");
      //$("#side-panel").css('margin-left','-12px');
      //$("#sidebar-wrapper").toggle("'slide', {direction: 'right' }, 1000");
      //$("#sidebar-wrapper").css({'transform': 'translate(-13rem, 0px)'});
      //$("#sidebar-wrapper").animate({left:'-200'},1000);
  });
}
$(function () {
  $('[data-toggle="popover"]').popover();
})
function modals() {
  
}
function agregarUsuario(){
  let bearer = 'Bearer '+g_token;
  let cedula = $('#cedulaAdd').val();
  let nombre = $('#NombreAdd').val();
  let apellidos = $('#apellidosAdd').val();
  let correo = $('#correoAdd').val();
  let clave = $('#claveAdd').val();
  let sexo = $('#sexoAdd option:selected').val();
  let usuario = $('#UsuarioAdd').val();
  let rol = $('#rolAdd option:selected').val();
  $.ajax({
      type: "GET",
      url: "/admin/administrador/agregarAdministrador",
      data: {cedula,nombre,apellidos,correo,clave,sexo,usuario,rol},
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      location.href = "/admin/administradores"
    }, (error) => {
  });
}

function bringDB() {
  let ajaxTime = new Date().getTime();
  let bearer = 'Bearer '+g_token;
  $.ajax({
      type: "GET",
      url: "/admin/administrador/getAdministradores",
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      let totalTime = new Date().getTime() - ajaxTime;
      let a = Math.ceil(totalTime / 1000);
      let t = a == 1 ? a + ' segundo' : a + ' segundos';
      $('#infoTiming').text(t);
      let su = response.filter(e => e.rol == 5).length;
      let ad = response.filter(e => e.rol < 5).length;
      $('#administradores_total_stats').html(ad);
      $('#superusuarios_stats').html(su);
      showAdminList(response);
    }, (error) => {
  });
}
function searchonfind() {
  var table = $('#administradores_TableOrder').DataTable();
  let val = $('#barraBuscar').val();
  let result = table.search(val).draw();
}

function showAdminList(data){
  $('#lista_administradores').html();
  data.forEach(e=>{
    showRowAdminList(e)
  })
  $('#administradores_TableOrder').DataTable({
    "language": {
        "zeroRecords": "No se encontraron estudiantes",
        "infoEmpty": "No hay registros disponibles!",
        "infoFiltered": "(filtrado de _MAX_ registros)",
        "lengthMenu": "Mostrar _MENU_ ",
        "info": "Mostrando pagina _PAGE_ de _PAGES_",
        "paginate": {
            "first": '<i class="fas fa-angle-double-left"></i>',
            "previous": '<i class="fas fa-angle-left"></i>',
            "next": '<i class="fas fa-angle-right"></i>',
            "last": '<i class="fas fa-angle-double-right"></i>'
        },
        "aria": {
            "paginate": {
                "first": 'Primera',
                "previous": 'Anterior',
                "next": 'Siguiente',
                "last": 'Última'
            }
        }
    }
  });
  $('#informacionTable').html('');
  $('#botonesCambiarTable').html('');
  $('#showlenghtentries').html('');

  $('#administradores_TableOrder_filter').css('display', 'none');
  $('#administradores_TableOrder_info').appendTo('#informacionTable');

  $('#administradores_TableOrder_paginate').appendTo('#botonesCambiarTable');
  
  $('#administradores_TableOrder_length').find('label').find('select').appendTo('#showlenghtentries');

}
function showRowAdminList(data){
  $('#lista_administradores').append(`
    <tr>
      <td>${data.id}</td>
      <td>${data.cedula}</td>
      <td>${data.nombre.toUpperCase() + ' '+ data.apellido.toUpperCase()}</td>
      <td>${data.usuario}</td>
      <td>${data.correo}</td>
      <td>${data.rol}</td>
    </tr>
  `)
}

function traerTablas() {
  let bearer = 'Bearer '+g_token;
  $.ajax({
      type: "GET",
      url: "/admin/administrador/getTables",
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      showTableTree(response.tables).then(e=>{
        showviewTree(response.views).then(e=>{
          let toggler = document.getElementsByClassName("caret");
          for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
              this.parentElement.querySelector(".nested").classList.toggle("active-open");
              $(this).find('i').toggleClass('fa-rotate-90');
            });
          }
        })
      })
    }, (error) => {
  });
}

function showTableTree(data) {
  return new Promise((resolve, reject) => {
    let cont = 0;
    data.forEach(e => {
      $('#ulTables').append(`
        <li><span class="caret"><i class="fas fa-chevron-right"></i> ${e.name}</span>
            <ul class="nested" id="table_name_${e.name}">

            </ul>
        </li>
      `);
      e.rows.forEach(c => {
        $(`#table_name_${e.name}`).append(`
          <li class="pl-1">${c.Key == "PRI" ? '<i class="ri-key-line text-warning"></i>': 
          c.Key == "MUL" ? '<i class="ri-key-2-line text-info"></i>' : '<i class="ri-archive-line text-info"></i>'} 
          <strong role="button" ondblclick="addTableToQuery('${c.Field}')">${c.Field}</strong> <span class="text-muted">${c.Type}</span><li>
        `);
      })
      cont++;
      if(cont == data.length){
        resolve('FINISH')
      }
    })
  })
}

function showviewTree(data) {
  return new Promise((resolve, reject) => {
    let cont = 0;
    data.forEach(e => {
      $('#ulViews').append(`
        <li><span class="caret"><i class="fas fa-chevron-right"></i> ${e.name}</span>
            <ul class="nested" id="table_name_${e.name}">
            </ul>
        </li>
      `);
      e.rows.forEach(c => {
        $(`#table_name_${e.name}`).append(`
          <li class="pl-1">${c.Key == "PRI" ? '<i class="ri-key-line text-warning"></i>': 
          c.Key == "MUL" ? '<i class="ri-key-2-line text-info"></i>' : '<i class="ri-archive-line text-info"></i>'} 
          <strong role="button" ondblclick="addTableToQuery('${c.Field}')">${c.Field}</strong> <span class="text-muted">${c.Type}</span><li>
        `);
      })
      cont++;
      if(cont == data.length){
        resolve('FINISH')
      }
    })
  });
}
function addTableToQuery(table) {
  let valMoment = $('#scripts').html();
  $('#scripts').html(valMoment + table);
}
const editor = document.getElementById('scripts');
const selectionOutput = document.getElementById('selection');

function getTextSegments(element) {
    const textSegments = [];
    Array.from(element.childNodes).forEach((node) => {
        switch(node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({text: node.nodeValue, node});
                break;
                
            case Node.ELEMENT_NODE:
                textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                break;
                
            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`);
        }
    });
    return textSegments;
}



function updateEditor() {
    const sel = window.getSelection();
    const textSegments = getTextSegments(editor);
    const textContent = textSegments.map(({text}) => text).join('');
    let anchorIndex = null;
    let focusIndex = null;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        if (node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset;
        }
        if (node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset;
        }
        currentIndex += text.length;
    });
    
    editor.innerHTML = renderText(textContent);
    
    restoreSelection(anchorIndex, focusIndex);
}

function restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
    const sel = window.getSelection();
    const textSegments = getTextSegments(editor);
    let anchorNode = editor;
    let anchorIndex = 0;
    let focusNode = editor;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        const startIndexOfNode = currentIndex;
        const endIndexOfNode = startIndexOfNode + text.length;
        if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
            anchorNode = node;
            anchorIndex = absoluteAnchorIndex - startIndexOfNode;
        }
        if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
            focusNode = node;
            focusIndex = absoluteFocusIndex - startIndexOfNode;
        }
        currentIndex += text.length;
    });
    
    sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
}

function renderText(text) {
    const words = text.split(/(\s+)/);
    const output = words.map((word) => {
      
      if (checkWordColor(word,'azul')) {
        return `<span class="text-info">${word.toUpperCase()}</span>`;
      }
      else if (checkWordColor(word,'rojo')) {
        return `<span class="text-danger">${word.toUpperCase()}</span>`;
      }else if(typeof word === 'number') {
        return `<span class="text-warning">${word.toUpperCase()}</span>`;
      }
      else {
          return word;
      }
    })
    return output.join('');
}
function checkWordColor(palabra,color) {
  let s_azul = ['select','from','as','join','distinct','view','call','where'
  ,'and','update','create','in','begin','end','insert','into','procedure','delete','set'
  ,'returns','declare','return','deterministic','default','grant','add','alter',
  'char','all','before','after','column','databse','desc','exit','if','like'];  
  let s_rojo = ['float','varchar','int','blob','timestamp','tinyint'];
  if(color == 'azul'){
    s_azul.forEach(e=>{
      if(e === palabra){
        return true;
      }
    })
  }else if(color == 'rojo'){
    s_rojo.forEach(e=>{
      if(e === palabra){
        return true;
      }
    })
  }
}
var g_vecResponseQuery = [];
var g_MapResponseQuery = new Map();
function runQueryIntoBase() {
  let bearer = 'Bearer '+g_token;
  let text = $('#scripts').html();
  $.ajax({
      type: "GET",
      url: "/admin/administrador/runScript",
      data: {text},
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      if(response.type == 'good') {
        g_vecResponseQuery = response;
        showResponseTable(response);
      }else if(response.type == 'error'){
        $('#resultScript').html('');
        $('#resultScript').append(`
        <span class="text-danger">${response.text.code}</span><br>
        <span class="text-danger">${response.text.sqlMessage}</span>
        `);
      }
      
    }, (error) => {
  });
}
function showResponseTable(data) {
    buildtable().then(res=>{
      buildHeaders(data.campos).then(res1 =>{
        buildRows(data.filas).then(res2 =>{
          
        });
      });
    });
}
function buildtable() {
  return new Promise((resolve, reject) => {
    $('#resultScript').html('');
    $('#resultScript').append(`
      <table class="table table-hover table-responsive-md table-borderedless" id="resultTableScript" data-order="[[ 1, &quot;asc&quot; ]]">
        <thead>
          <tr id="headerTableScript">
            
          </tr>
        </thead>
        <tbody id="filasTableScript">

        </tbody>
      </table>
    `);
    resolve('table_created');
  })
}
function buildHeaders(data) {
  return new Promise((resolve, reject) => {
    data.forEach(e => {
      $('#headerTableScript').append(`
        <th class="bg-dark text-white sticky-top" scope="col">${e.name}</th>
      `);
    })
    resolve('headers_created');
  })
}
function buildRows(data) {
  return new Promise((resolve, reject) => {
    data.forEach(e => {
      $('#filasTableScript').append(`
        <tr>
      `);
      printTableRow(e).then(res=>{
        $('#filasTableScript').append(` 
          </tr>
        `);
      })
    });
    resolve('rows_created');
  })
}
function printTableRow(data) {
  return new Promise((resolve, reject) => {
    for (var [key, value] of Object.entries(data)) {
      $('#filasTableScript').append(`
        <td>${value}</td>
      `);
    }
    resolve('row_created');
  })
}
editor.addEventListener('input', updateEditor);

document.addEventListener("DOMContentLoaded", loaded);
