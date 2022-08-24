
var g_mapProfesores = new Map();


moment.lang('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);

function loaded(event){
  events(event);
}

function events(event){
  bringDB();
  modals();
  changeProfilePhoto();
  fotoonChange();
  llenarDatos();
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

		if(profesor.aso){
			$('#eliminarProfesorBtn').text('Eliminar Asociado');
			$('#cambiarClaveBTN').attr('disabled',true);
			$('#actualizarProfesorBTN').attr('disabled',true);

            $("#feedbackVer").html(`
                <div class="alert alert-warning" role="alert">
                    <strong>El profesor es administrador, no se pueden actualizar datos.</strong>
                </div>
            `);
		}else{
            $("#feedbackVer").html(``);
			$('#eliminarProfesorBtn').text('Eliminar');
			$('#cambiarClaveBTN').attr('disabled',false);
			$('#actualizarProfesorBTN').attr('disabled',false);
		}
		$('#idProfesor').html(profesor.id_profesor)
		$('#cedulaprofesor').html(profesor.cedula)

		$('#correo_edit').val(profesor.correo)
		$('#Usuario_edit').val(profesor.usuario)
	})
}
function eliminarProfesor() {
	let bearer = 'Bearer '+g_token;
	let id = parseInt($('#idProfesor').html());
	let profesor = g_mapProfesores.get(+id);
	if(profesor.aso){
		$.ajax({
			type: "GET",
			url: "/admin/profesor/eliminarAso", 
			data: {id},
			contentType: "appication/json",
			headers:{
				'Authorization':bearer
			}
		}).then((response) => {
			location.href = '/admin/profesores';
		}, (error) => {
		});
	}else{
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
			$.ajax({
				type: "GET",
				url: "/admin/administrador/getAdministradores",
				contentType: "appication/json",
				headers:{
					'Authorization':bearer
				}
				}).then((data) => {
					llenarSelectAdmin(data);
					console.log(data);
                    closeProgressBarLoader();
				}, (error) => {
				}
			);
		}, (error) => {
		}
	);
}

function llenarSelectAdmin(data){
	// g_mapProfesores
	// delete on data the items that are already in the map
	let map = new Map();
	for(let i = 0; i < data.length; i++){
		map.set(data[i].id,data[i]);
	}
	let array = new Array(...g_mapProfesores.values());
	for(let i = 0; i < array.length; i++){
		let id = array[i].id_usuario;
		if(map.has(id)){
			map.delete(id);
		}
	}
	map.forEach(function(a){
		$('#listaSelectAdministradores').append(
			`<option value="${a.id}">${a.nombre} ${a.apellido}</option>`);
	});
}
function asociarAdmin(){
    let id = $('#listaSelectAdministradores').val();
    if(id != 'null'){
        console.log(id)
        let data = parseInt(id);
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "GET",
            url: "/admin/profesor/agregarAso", 
            data: {data:data},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.affectedRows){
                location.href = '/admin/profesores';
            }else if(response.code){
                
            }
        }, (error) => {
        });
    }else{

    }
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
function llenarDatos() {
  $('#cedulaAdd').on('keyup',(cantidad)=>{
      let id = $('#cedulaAdd').val();
      
      if(id.length == 9){
          // $('#id_registro').addClass('is-valid');
          $.ajax({
              type: "GET",
              url: '/buscarUsuarioRegistro',
              contentType: "application/json",
              data: {id:id}
          }).then((response) => {
              let p = JSON.parse(response)
              $('#NombreAdd').val(p.results[0].firstname1);
              $('#apellidosAdd').val(p.results[0].lastname);
              
              // $('#NombreAdd').addClass('is-valid');
              // $('#apellidosAdd').addClass('is-valid');

              $('#NombreAdd').attr('readonly', true);
              $('#apellidosAdd').attr('readonly', true);
          }, (error) => {
          
          });
      }
      else if(id.length == 12){ //revisar si es residente
          // $('#id_registro').addClass('is-valid');
      }else{ // si no se encontro
          // $('#id_registro').removeClass('is-valid');

          // $('#NombreAdd').removeClass('is-valid');
          // $('#apellidosAdd').removeClass('is-valid');

          $('#NombreAdd').attr('readonly', false);
          $('#apellidosAdd').attr('readonly', false);
      }
  });
}
function searchonfind() {
  var table = $('#table').DataTable();
  let val = $('#barraBuscar').val();
  let result = table.search(val).draw();
}


function showProfesorList(data){
  $('#lista_profesores').html();
  data.forEach(e=>{
    g_mapProfesores.set(e.id_profesor,e);
    showRowProfesorList(e);
  })
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
      columnDefs: [
          { targets: [0, 6], orderable: false,},
          { targets: '_all', orderable: true }
      ]
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
function showRowProfesorList(data){
	let foto = `<img src="/public/uploads/${data.foto}" class="rounded-circle" width="30px" height="30px"
	role="button" onclick="openImageModal('/public/uploads/${data.foto}','${data.cedula}')">`; 
	let aso = `
	<span class="fa-stack ">
		<i class="fas fa-circle fa-stack-2x text-danger"></i>
		<i class="fas fa-flag fa-stack-1x fa-inverse text-white"></i>
	</span>
	`;
	$('#lista_profesores').append(`
		<tr>
		<td class="text-center">${data.id_profesor}</td>
		<td class="align-center">${foto}</td>
		<td>
		${data.nombre.toUpperCase() + ' '+ data.apellido.toUpperCase()} 
		${data.aso == 1 ? aso : ''}
		</td>
		<td>${data.cedula}</td>
		<td><a href="mailto:${data.correo}">${data.correo}</a></td>
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
function excelDownload(){
    let data = Array.from(g_mapProfesores.values());
    const xls = new XlsExport(data, "Profesores");
    xls.exportToXLS('Reporte_Profesores.xls')
}

document.addEventListener("DOMContentLoaded", loaded);
