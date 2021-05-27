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

var g_mapProfesores = new Map();

function loaded(event){
  events(event);
}

function events(event){
  bringDB();
  toogleMenu();
  modals();
  changeProfilePhoto();
  fotoonChange();
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
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
function openModalCameras() {
  setTimeout(() => {
      $('#modalTakePic').modal('show');
  }, 1000);
}
function modals() {
  $('#modalTakePic').on('hidden.bs.modal', function (event) {
      if(f_videoRecording){
          var videoEl = document.getElementById('theVideo');
          stream = videoEl.srcObject;
          tracks = stream.getTracks();
          tracks.forEach(function(track) {
              track.stop();
          });
          videoEl.srcObject = null;
      }
    })
    $('#modalVerProfesor').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = ""+button.data('id')
      let profesor = g_mapProfesores.get(parseInt(recipient))

      var modal = $(this)
      modal.find('.modal-title').text(profesor.nombre + " " + profesor.apellido)

      $('#idProfesor').html(profesor.id_profesor)
      $('#cedulaprofesor').html(profesor.cedula)

      $('#correo_edit').val(profesor.correo)
      $('#Usuario_edit').val(profesor.usuario)
  })
}
function eliminarProfesor() {
  let bearer = 'Bearer '+g_token;
  let id = parseInt($('#idProfesor').html());
  $.ajax({
      type: "GET",
      url: "/admin/profesor/eliminar", 
      data: {id},
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
  }).then((response) => {
      location.href = '/admin/profesores';
  }, (error) => {
  });
}
function agregarProfesor(){
  let bearer = 'Bearer '+g_token;
  let cedula = $('#cedulaAdd').val();
  let nombre = $('#NombreAdd').val();
  let apellidos = $('#apellidosAdd').val();
  let correo = $('#correoAdd').val();
  let clave = $('#claveAdd').val();
  let sexo = $('#sexoAdd option:selected').val();
  let usuario = $('#UsuarioAdd').val();
  $.ajax({
      type: "GET",
      url: "/admin/profesor/agregar",
      data: {cedula,nombre,apellidos,correo,clave,sexo,usuario},
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      location.href = "/admin/profesores"
    }, (error) => {
  });
}
function openModal(modal){
  $(modal).modal('show')
}
function cambiarClaveModal() {
  $('#modalcambiarclave').modal('show');
  
  let id = $('#cedulaprofesor').html();
  $('#claveCedulaID').html(id);
  $('#cambiarclaveID').val(id);
}
function bringDB() {
  let ajaxTime = new Date().getTime();
  let bearer = 'Bearer '+g_token;
  $.ajax({
      type: "GET",
      url: "/admin/profesores/getProfesores",
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
      let totalTime = new Date().getTime() - ajaxTime;
      let a = Math.ceil(totalTime / 1000);
      let t = a == 1 ? a + ' segundo' : a + ' segundos';
      $('#infoTiming').text(t);
      $('#profesores_stats').html(response.length);
      showProfesorList(response);
    }, (error) => {
  });
}
function actualizarProfesor() {
  let cedula = $('#cedulaprofesor').html();
  let username = $('#Usuario_edit').val();
  let correo = $('#correo_edit').val();
  let data ={
      username,correo,cedula
  }
  let bearer = 'Bearer '+g_token;
  $.ajax({
      type: "GET",
      url: "/admin/profesor/actualizar", 
      data: data,
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
  }).then((response) => {
      if(response.affectedRows){
          location.href = '/admin/profesores';
      }else if(response.code){
          if(response.code == "ER_DUP_ENTRY"){
              $('#feedbackVer').append(`
                  <div class="alert alert-danger alert-dismissible fade show" role="alert">
                      El correo <strong>${correo}</strong> ya se encuentra registrado. <i class="far fa-question-circle" 
                      data-toggle="tooltip" data-placement="bottom" data-html="true" 
                      title="Para cambiar a este correo si el profesor ya cuenta con un registro anterior: <br> 
                      1. Elimine el profesor con este correo. <br>
                      2. Haga el cambio de correo a este profesor."></i>
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
              `);
          }
          $('[data-toggle="tooltip"]').tooltip()
      }
      
  }, (error) => {
  });
}
function searchonfind() {
  var table = $('#profesores_TableOrder').DataTable();
  let val = $('#barraBuscar').val();
  let result = table.search(val).draw();
}

function showProfesorList(data){
  $('#lista_profesores').html();
  data.forEach(e=>{
    g_mapProfesores.set(e.id_profesor,e);
    showRowProfesorList(e);
  })
  $('#profesores_TableOrder').DataTable({
    "language": {
        "zeroRecords": "No se encontraron profesores",
        "infoEmpty": "No hay registros disponibles!",
        "infoFiltered": "(filtrado de _MAX_ registros)",
        "lengthMenu": "_MENU_ ",
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

  $('#profesores_TableOrder_filter').css('display', 'none');
  $('#profesores_TableOrder_info').appendTo('#informacionTable');

  $('#profesores_TableOrder_paginate').appendTo('#botonesCambiarTable');
  
  $('#profesores_TableOrder_length').appendTo('#showlenghtentries');
  $('#profesores_TableOrder_length').find('label').addClass('d-flex align-items-center m-0')
  $('#profesores_TableOrder_length').find('label').find('select').addClass('custom-select custom-select-sm mx-2')

}
function showRowProfesorList(data){
  let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px" height="30px"
   role="button" onclick="openImageModal('/public/uploads/${data.foto}','${data.cedula}')">`; 
  $('#lista_profesores').append(`
    <tr>
      <td class="text-center">${data.id_profesor}</td>
      <td class="align-center">${foto}</td>
      <td>${data.nombre.toUpperCase() + ' '+ data.apellido.toUpperCase()}</td>
      <td>${data.cedula}</td>
      <td>${data.correo}</td>
      <td>${data.sexo}</td>
      <td class="text-center">
          <span class="button-circle" role="button" data-id="${data.id_profesor}" data-toggle="modal" data-target="#modalVerProfesor">
              <i class="fas fa-ellipsis-v"></i>
          </span>
      </td>
    </tr>
  `)
}
function openImageModal(foto,cedula) {
  $('#modalImage').modal('show');
  $('#cedulaHiddenCambiarFotoModal').val(cedula);

  $('.avatar-bg').css({
      'background':'url('+foto+')',
      'background-size':'cover',
      'background-position': '50% 50%'
  });
  $('#contentImageModal').attr('src',foto);
}

function readURL(input) { 
  if (input.files && input.files[0]) {
      var reader = new FileReader(); 
      reader.onload = function (e) {
          $('.avatar-bg').css({
              'background':'url('+e.target.result+')',
              'background-size':'cover',
              'background-position': '50% 50%'
          });
      }; 
      reader.readAsDataURL(input.files[0]);
  }
}
function changeProfilePhoto() {
  $("#profileImageChange").click(function(e) {
      $("#fileFoto").click();
  });
}
function fotoonChange() {
  $("#fileFoto").change(function(event){
      let fileInput = event.currentTarget;
      let archivos = fileInput.files;
      let nombre = archivos[0].name;
      let tipo = nombre.split('.')[archivos.length];
      if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' 
      || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
          readURL(this);
          $('#fileFoto').after(
              '<button class="btn btn-primary btn-sm d-block mx-auto mb-3" '+
              'id="btn_cambiar_foto" type="submit" '+
              'style="display: none;">Cambiar foto</button>'
          );
          $('#formatoImagenInvalido').hide();
      }else{
          $('#formatoImagenInvalido').show();
      }
                  
  });
}
var f_videoRecording = false;
function openModalToTakePhoto(){
    $('#theVideo').show();
    f_videoRecording = true;
    var videoWidth = 500;
    var videoHeight = 500;
    var videoTag = document.getElementById('theVideo');
    var canvasTag = document.getElementById('theCanvas');
    var btnCapture = document.getElementById("btnCapture");
    var btnDownloadImage = document.getElementById("btnDownloadImage");
    videoTag.setAttribute('width', videoWidth);
    videoTag.setAttribute('height', videoHeight);
    canvasTag.setAttribute('width', videoWidth);
    canvasTag.setAttribute('height', videoHeight);
    navigator.mediaDevices.getUserMedia({
        video: {
            width: videoWidth,
            height: videoHeight
        }
    }).then(stream => {
        videoTag.srcObject = stream;
        
    }).catch(e => {
        document.getElementById('errorTxt').innerHTML = 'ERROR: ' + e.toString();
    });
    var canvasContext = canvasTag.getContext('2d');
    btnCapture.addEventListener("click", () => {
        canvasContext.drawImage(videoTag, 0, 0, videoWidth, videoHeight);
        var videoEl = document.getElementById('theVideo');
        stream = videoEl.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        videoEl.srcObject = null;
        f_videoRecording = false;
        setTimeout(() => {
            $('#theVideo').hide();
        }, 1500);
    });
    btnDownloadImage.addEventListener("click", () => {
        var link = document.createElement('a');
        link.download = 'capturedImage.png';
        link.href = canvasTag.toDataURL();
        link.click();
    });
}

document.addEventListener("DOMContentLoaded", loaded);
