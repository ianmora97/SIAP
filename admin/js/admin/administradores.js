var g_mapAdmins = new Map();
var estudiantesXLS = [];

function loaded(event) {
  events(event);
}

function events(event) {
  traerTablas();
  bringDB();
  modals();
  llenarDatos();
  verificar_correo();
  verificar_clave();
}

$(function () {
  $('[data-toggle="popover"]').popover();
});
function modals() {
  $("#modalAdd").on("hide.bs.modal", function (event) {
    limpiarCampos();
  });
  $("#modalEdit").on("show.bs.modal", function (event) {
    let id = $("#idAdministradorEdit").html();
    let admintemp = g_mapAdmins.get(id);
    $("#editLabelTitle").html(`${admintemp.nombre} (${admintemp.cedula})`);
  });
}
function runSelect(table) {
  $("#scripts").val(`SELECT * FROM ${table}`);
  runQueryIntoBase();
}
function openModal(modal) {
  $(modal).modal("show");
}
function openModalEdit(id) {
  $("#idAdministradorEdit").html(id);
  $("#modalEdit").modal("show");
}

function llenarDatos() {
  $("#cedulaAdd").on("keyup", (cantidad) => {
    let id = $("#cedulaAdd").val();

    if (id.length == 9) {
      // $('#id_registro').addClass('is-valid');
      $.ajax({
        type: "GET",
        url: "/buscarUsuarioRegistro",
        contentType: "application/json",
        data: { id: id },
      }).then(
        (response) => {
          let p = JSON.parse(response);
          $("#NombreAdd").val(p.results[0].firstname1);
          $("#apellidosAdd").val(p.results[0].lastname);

          // $('#NombreAdd').addClass('is-valid');
          // $('#apellidosAdd').addClass('is-valid');

          $("#NombreAdd").attr("disabled", true);
          $("#apellidosAdd").attr("disabled", true);
        },
        (error) => {}
      );
    } else if (id.length == 12) {
      //revisar si es residente
      // $('#id_registro').addClass('is-valid');
    } else {
      // si no se encontro
      // $('#id_registro').removeClass('is-valid');

      // $('#NombreAdd').removeClass('is-valid');
      // $('#apellidosAdd').removeClass('is-valid');

      $("#NombreAdd").attr("disabled", false);
      $("#apellidosAdd").attr("disabled", false);
    }
  });
}
function verificar_correo() {
  $("#correoAdd").on("keyup", () => {
    let email = $("#correoAdd").val();
    if (email != "") {
      let c = email.substring(0, email.indexOf("@"));
      $("#UsuarioAdd").val(c);
    }
  });
}
function verificar_clave() {
  $("#claveAdd").on("keyup", function (event) {
    var p = $("#claveAdd").val();
    var l = (p.length / 20) * 100 + "%";
    $("#cantidad_caracteres").text("");
    $("#cantidad_caracteres").text(p.length);
    $("#progreso_clave").css("width", l);
    if (p.length >= 8) {
      $("#progreso_clave").removeClass("bg-rojo");
      $("#progreso_clave").addClass("bg-green");
    } else if (p.length < 8) {
      $("#progreso_clave").removeClass("bg-green");
      $("#progreso_clave").addClass("bg-rojo");
    }
  });
}
function limpiarCampos() {
  $("#cedulaAdd").val("");
  $("#NombreAdd").val("");
  $("#apellidosAdd").val("");
  $("#correoAdd").val("");
  $("#claveAdd").val("");
  $("#UsuarioAdd").val("");
  $("#NombreAdd").attr("disabled", false);
  $("#apellidosAdd").attr("disabled", false);
}
function eliminarAdmin(cedula) {
  return new Promise((resolve, reject) => {
    let bearer = "Bearer " + g_token;
    $.ajax({
      type: "GET",
      url: "/admin/administrador/eliminarAdministrador",
      data: { cedula },
      contentType: "appication/json",
      headers: {
        Authorization: bearer,
      },
    }).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
function agregarUsuario() {
  let bearer = "Bearer " + g_token;
  let cedula = $("#cedulaAdd").val();
  let nombre = $("#NombreAdd").val();
  let apellidos = $("#apellidosAdd").val();
  let correo = $("#correoAdd").val();
  let clave = $("#claveAdd").val();
  let sexo = $("#sexoAdd option:selected").val();
  let usuario = $("#UsuarioAdd").val();
  let rol = parseInt($("#rolAdd option:selected").val());
  $("#agregarBotonAdmin").show();
  // if(){

  // }
  $.ajax({
    type: "GET",
    url: "/admin/administrador/agregarAdministrador",
    data: { cedula, nombre, apellidos, correo, clave, sexo, usuario, rol },
    contentType: "appication/json",
    headers: {
      Authorization: bearer,
    },
  }).then(
    (response) => {
      $("#agregarBotonAdmin").show();
      limpiarCampos();
      setTimeout(() => {
        location.href = "/admin/administradores";
      }, 2500);
    },
    (error) => {}
  );
}

function bringDB() {
  let ajaxTime = new Date().getTime();
  let bearer = "Bearer " + g_token;
  $.ajax({
    type: "GET",
    url: "/admin/administrador/getAdministradores",
    contentType: "appication/json",
    headers: {
      Authorization: bearer,
    },
  }).then(
    (response) => {
      let totalTime = new Date().getTime() - ajaxTime;
      let a = Math.ceil(totalTime / 1000);
      let t = a == 1 ? a + " segundo" : a + " segundos";
      $("#infoTiming").text(t);
      let su = response.filter((e) => e.rol == 5).length;
      let ad = response.filter((e) => e.rol < 5).length;
      $("#administradores_total_stats").html(response.length);
      $("#superusuarios_stats").html(su);
      showAdminList(response);
    },
    (error) => {}
  );
}
function searchonfind() {
  var table = $("#table").DataTable();
  let val = $("#barraBuscar").val();
  let result = table.search(val).draw();
}

function showAdminList(data) {
  $("#lista_administradores").html();
  data.forEach((e) => {
    g_mapAdmins.set(e.cedula, e);
    showRowAdminList(e);
  });
  $("#table").DataTable({
    language: {
      decimal: "",
      emptyTable: "No hay datos en la tabla",
      info: "Mostrando _END_ de _TOTAL_ registros",
      infoEmpty: "Mostrando 0 hasta 0 de 0 registros",
      infoFiltered: "(Filtrado de _MAX_ registros totales)",
      infoPostFix: "",
      thousands: ",",
      lengthMenu: "_MENU_",
      loadingRecords: "Cargando...",
      processing: "Procesando...",
      search: "Buscar:",
      zeroRecords: "No se encontraron registros similares",
      paginate: {
        first: '<i class="fas fa-angle-double-left"></i>',
        previous: '<i class="fas fa-angle-left"></i>',
        next: '<i class="fas fa-angle-right"></i>',
        last: '<i class="fas fa-angle-double-right"></i>',
      },
      aria: {
        paginate: {
          first: '<i class="fas fa-angle-double-left"></i>',
          previous: '<i class="fas fa-angle-left"></i>',
          next: '<i class="fas fa-angle-right"></i>',
          last: '<i class="fas fa-angle-double-right"></i>',
        },
      },
    },
  });
  $("#info").html("");
  $("#pagination").html("");
  $("#length").html("");

  $("#table_wrapper").addClass("px-0");
  let a = $("#table_wrapper").find(".row")[1];
  $(a).addClass("mx-0");
  $(a).find(".col-sm-12").addClass("px-0");

  $("#table_filter").css("display", "none");
  $("#table_info").appendTo("#info");

  $("#table_paginate").appendTo("#pagination");

  $("#table_length")
    .find("label")
    .find("select")
    .removeClass("form-control form-control-sm");
  $("#table_length").find("label").find("select").appendTo("#length");
  $("#table_length").html("");
}
function showRowAdminList(data) {
  let foto =
    '<img src="/public/uploads/' +
    data.foto +
    '" class="rounded-circle" width="40px" height="40px">';
  $("#lista_administradores").append(`
    <tr style="height:calc(55vh / 10);">
      <td class="text-center">${foto}</td>
      <td>${data.nombre.toUpperCase() + " " + data.apellido.toUpperCase()}</td>
      <td>${data.cedula}</td>
      <td><a href="mailto:${data.correo}">${data.correo}</a></td>
      <td>${data.usuario}</td>
      <td>
      <button class="btn btn-danger" onclick="delete_administrador(${
        data.cedula
      })"><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  `);
}
async function delete_administrador(cedula) {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
		confirmButton: "btn btn-success",
		cancelButton: "btn btn-danger",
		},
		buttonsStyling: false,
	});
	let admin = g_mapAdmins.get("" + cedula);
	swalWithBootstrapButtons
		.fire({
		title: `Desea eliminar a ${admin.nombre} ${admin.apellido} de la lista de administradores del sistema?`,
		html: `Esta acción no se puede revertir!
		<br> El administrador no podrá acceder al sistema.
		`,
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, eliminar",
		cancelButtonText: "No, cancelar",
		reverseButtons: true,
		})
		.then((result) => {
		if (result.isConfirmed) {
			eliminarAdmin(cedula).then((data) => {
				if (data.status == 200) {
					swalWithBootstrapButtons
					.fire(
						"Eliminado!",
						`${admin.nombre} ${admin.apellido} ha sido eliminado`,
						"success"
					)
					.then(() => {
						location.reload();
					});
					// $('#table_estudiantes').DataTable().ajax.reload();
				} else {
					swalWithBootstrapButtons.fire("Error!", `${data.error}`, "error");
				}
			});
		} else if (result.dismiss === Swal.DismissReason.cancel) {
		}
    });
}
function traerTablas() {
  let bearer = "Bearer " + g_token;
  $.ajax({
    type: "GET",
    url: "/admin/administrador/getTables",
    contentType: "appication/json",
    headers: {
      Authorization: bearer,
    },
  }).then(
    (response) => {
      showTableTree(response.tables).then((e) => {
        showviewTree(response.views).then((e) => {
          let toggler = document.getElementsByClassName("caret");
          for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
              this.parentElement
                .querySelector(".nested")
                .classList.toggle("active-open");
              $(this).find(".fa-chevron-right").toggleClass("fa-rotate-90");
            });
          }
        });
      });
    },
    (error) => {}
  );
}

function showTableTree(data) {
  return new Promise((resolve, reject) => {
    let cont = 0;
    data.forEach((e) => {
      $("#ulTables").append(`
        <li><span class="caret"><i class="fas fa-chevron-right"></i> ${e.name} &nbsp; <i role="button" data-toggle="tooltip" data-placement="bottom" 
        title="Ver Tabla" onclick="runSelect('${e.name}')" class="far fa-object-group text-info"></i></span>
            <ul class="nested" id="table_name_${e.name}">

            </ul>
        </li>
      `);
      e.rows.forEach((c) => {
        $(`#table_name_${e.name}`).append(`
          <li class="pl-1">${
            c.Key == "PRI"
              ? '<i class="ri-key-line text-warning"></i>'
              : c.Key == "MUL"
              ? '<i class="ri-key-2-line text-info"></i>'
              : '<i class="ri-archive-line text-info"></i>'
          } 
          <strong role="button" ondblclick="addTableToQuery('${c.Field}')">${
          c.Field
        }</strong> <span class="text-muted">${c.Type}</span><li>
        `);
      });
      cont++;
      if (cont == data.length) {
        resolve("FINISH");
      }
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  });
}

function showviewTree(data) {
  return new Promise((resolve, reject) => {
    let cont = 0;
    data.forEach((e) => {
      $("#ulViews").append(`
        <li><span class="caret"><i class="fas fa-chevron-right"></i> ${e.name} &nbsp; <i role="button" data-toggle="tooltip" data-placement="bottom" 
        title="Ver Tabla" onclick="runSelect('${e.name}')" class="far fa-object-group text-info"></i></span>
            <ul class="nested" id="table_name_${e.name}">

            </ul>
        </li>
      `);
      e.rows.forEach((c) => {
        $(`#table_name_${e.name}`).append(`
          <li class="pl-1">${
            c.Key == "PRI"
              ? '<i class="ri-key-line text-warning"></i>'
              : c.Key == "MUL"
              ? '<i class="ri-key-2-line text-info"></i>'
              : '<i class="ri-archive-line text-info"></i>'
          } 
          <strong role="button" ondblclick="addTableToQuery('${c.Field}')">${
          c.Field
        }</strong> <span class="text-muted">${c.Type}</span><li>
        `);
      });
      cont++;
      if (cont == data.length) {
        resolve("FINISH");
      }
    });
  });
}
function addTableToQuery(table) {
  let valMoment = $("#scripts").html();
  $("#scripts").html(valMoment + table);
}

function checkWordColor(palabra, color) {
  let s_azul = [
    "select",
    "from",
    "as",
    "join",
    "distinct",
    "view",
    "call",
    "where",
    "and",
    "update",
    "create",
    "in",
    "begin",
    "end",
    "insert",
    "into",
    "procedure",
    "delete",
    "set",
    "returns",
    "declare",
    "return",
    "deterministic",
    "default",
    "grant",
    "add",
    "alter",
    "char",
    "all",
    "before",
    "after",
    "column",
    "databse",
    "desc",
    "exit",
    "if",
    "like",
  ];
  let s_rojo = ["float", "varchar", "int", "blob", "timestamp", "tinyint"];
  if (color == "azul") {
    s_azul.forEach((e) => {
      if (e === palabra) {
        return true;
      }
    });
  } else if (color == "rojo") {
    s_rojo.forEach((e) => {
      if (e === palabra) {
        return true;
      }
    });
  }
}
var g_vecResponseQuery = [];
var g_MapResponseQuery = new Map();
function runQueryIntoBase() {
  let bearer = "Bearer " + g_token;
  let text = $("#scripts").val();
  $.ajax({
    type: "GET",
    url: "/admin/administrador/runScript",
    data: { text },
    contentType: "appication/json",
    headers: {
      Authorization: bearer,
    },
  }).then(
    (response) => {
      if (response.type == "good") {
        g_vecResponseQuery = response;
        showResponseTable(response);
      } else if (response.type == "error") {
        $("#resultScript").html("");
        $("#resultScript").append(`
        <span class="text-danger">${response.text.code}</span><br>
        <span class="text-danger">${response.text.sqlMessage}</span>
        `);
      }
    },
    (error) => {}
  );
}
function showResponseTable(data) {
  buildtable().then((res) => {
    buildHeaders(data.campos).then((res1) => {
      buildRows(data.filas).then((res2) => {});
    });
  });
}
function buildtable() {
  return new Promise((resolve, reject) => {
    $("#resultScript").html("");
    $("#resultScript").append(`
      <table class="table custom-table table-responsive-md table-borderedless" id="resultTableScript" data-order="[[ 1, &quot;asc&quot; ]]">
        <thead>
          <tr id="headerTableScript">
            
          </tr>
        </thead>
        <tbody id="filasTableScript">

        </tbody>
      </table>
    `);
    resolve("table_created");
  });
}
function buildHeaders(data) {
  return new Promise((resolve, reject) => {
    data.forEach((e) => {
      $("#headerTableScript").append(`
        <th class="bg-dark text-white sticky-top" scope="col">${e.name}</th>
      `);
    });
    resolve("headers_created");
  });
}
function buildRows(data) {
  return new Promise((resolve, reject) => {
    data.forEach((e) => {
      $("#filasTableScript").append(`
        <tr>
      `);
      printTableRow(e).then((res) => {
        $("#filasTableScript").append(` 
          </tr>
        `);
      });
    });
    resolve("rows_created");
  });
}
function printTableRow(data) {
  return new Promise((resolve, reject) => {
    for (var [key, value] of Object.entries(data)) {
      $("#filasTableScript").append(`
        <td>${value}</td>
      `);
    }
    resolve("row_created");
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function cargarDatos() {
  $("#barraProgreso").show();
  $("#textTodelete").hide();
  $("#headertochange").html(`
		<img src="/img/emoji/hourglass.png" width="30px">
		Cargando Datos
	`);
  let cantidad = estudiantesXLS.length; // 20
  let cont = 0;
  let cont2 = 0;
  let sum = 100 / cantidad;
  let bearer = "Bearer " + g_token;
  for (let i = 0; i < cantidad; i++) {
    cont += sum;
    $("#barraProgreso").css("width", `${cont}%`);
    const e = estudiantesXLS[i];
    let data = {
      cedula: e.cedula,
      nombre: e.nombre,
      apellido: e.apellidos,
      fechaNacimiento: "",
      sexo: e.sexo,
      perfil: e.perfil,
      correo: e.correo,
    };
    console.log(data);
    $.ajax({
      type: "GET",
      url: "/admin/administrador/agregarEstudiante",
      data: data,
      contentType: "appication/json",
      headers: {
        Authorization: bearer,
      },
    }).then(
      (response) => {
        cont2++;
        if (cont2 == cantidad) {
          setTimeout(() => {
            $("#barraProgreso").removeClass("progress-bar-animated");
            $("#headertochange").html(`
						<h4 class="text-white font-weight-bold" >
						<img src="/img/emoji/happy-face.png" width="30px">
						Datos Cargados
						</h4>
					`);
            $("#uploadingWhile").html(`
						<a href="/admin/estudiantes" class="btn btn-light"><i class="fas fa-external-link-alt text-primary"></i> Ver Estudiantes</a>
					`);
            $("#btnparacargardatos").remove();
            $("#resultTableScript1").html("");
          }, 3000);
        }
      },
      (error) => {}
    );
    $("#uploadingWhile").html(`
			<div class="bg-primary rounded-3 shadow p-3 w-75 animate__animated animate__slideInRight" style="height:130px;">
				<div class="d-flex justify-content-between">
					<div>
						<h4 class="text-white font-weight-bold animate__animated animate__slideInRight animate_delay_t1">${
              e.nombre + " " + e.apellidos
            }</h4>
						<h5 class="text-white animate__animated animate__slideInRight animate_delay_t2">${
              e.cedula
            }</h5>
						<h5 class="animate__animated animate__slideInRight animate_delay_t3"><span class="badge bg-white text-primary">${
              e.correo
            }</span></h5>
					</div>
					<div class="mr-2">
						<i class="fas fa-user-circle fa-6x text-white animate__animated animate__bounce animate_delay_t4"></i>
					</div>
				</div>
			</div>
		`);
    await sleep(3000);
    $(`#ced-${e.cedula}`).remove();
  }
}

//delete row
function deleteEntry(cedula) {
  $("#cantidadEstudiantesbadge").html(`${estudiantesXLS.length - 1}`);
  $(`#ced-${cedula}`).remove();
  estudiantesXLS = estudiantesXLS.filter(function (value, index, arr) {
    return value.cedula != parseInt(cedula);
  });
}
function showFeedback() {
  $("#feedbackAfterUpload").html(`
		<div class="d-flex justify-content-between border-bottom border-light mb-3">
			<div id="headertochange">
				<h4 class="text-white font-weight-bold" >
				<img src="/img/emoji/check-mark.png" width="30px">
				Excel leido correctamente</h4>
				<p class="text-white">Se encontraron <span class="badge badge-primary" id="cantidadEstudiantesbadge">${estudiantesXLS.length}</span> estudiantes</p>
			</div>
			<div>
				<button class="btn btn-primary" onclick="cargarDatos()" id="btnparacargardatos">
					<i class="fas fa-cloud-upload-alt "></i> Cargar Datos
				</button>
			</div>
		</div>
		<div id="textTodelete">
			<p><i class="fas fa-circle text-primary" style="font-size: 10px;"></i> Debe revisar que los datos se encuentren bien escritos y que no se repitan</p>
			<p><i class="fas fa-circle text-primary" style="font-size: 10px;"></i> Cada Dato debe corresponder a su columna</p>
		</div>
		<div class="progress my-4" >
			<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
			aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%" id="barraProgreso" style="display:none;"></div>
		</div>
		<div id="uploadingWhile">
		</div>

	`);
}
const removeDuplicades = (arr) => [...new Set(arr)];

var ExcelToJSON = function () {
  this.parseExcel = function (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      });
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        if (sheetName == "MACRO") {
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName],
            { range: 3 }
          );
          var json_object = JSON.stringify(XL_row_object);
          estudiantesXLS = JSON.parse(json_object);
          console.log(estudiantesXLS);
          //filtrarybuscarEstudiantes(estudiantesXLS);
        }
      });
    };
    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };
};
function buscarRegistroNacional(cedula) {
  $.ajax({
    type: "GET",
    url: "/buscarUsuarioRegistro",
    contentType: "application/json",
    data: { id: cedula },
  }).then(
    (response) => {
      let p = JSON.parse(response);
      return {
        nombre: p.results[0].firstname1,
        apellidos: p.results[0].lastname,
      };
    },
    (error) => {
      return error;
    }
  );
}
function filtrarybuscarEstudiantes(estudiantes) {
  var vecEstudiantesTemp = [];
  estudiantes.forEach((e) => {
    if (e.CEDULA != "") {
      let c = e.CORREO.substring(0, e.CORREO.indexOf("@"));
      vecEstudiantesTemp.push({
        cedula: e.CEDULA,
        nombre: dataR.nombre,
        apellido: dataR.apellidos,
        correo: e.CORREO,
        perfil: c,
      });
    }
  });
  console.log(vecEstudiantesTemp);
}
function tableafterreadXLSX() {
  let table = `
	<table class="table table-sm">
		<thead class="bg-light text-dark">
			<tr>
				<th scope="col">Cedula</th>
				<th scope="col">Nombre</th>
				<th scope="col">Apellido</th>
				<th scope="col">Sexo</th>
				<th scope="col">Perfil</th>
				<th scope="col">Correo</th>
				<th scope="col">Eliminar</th>
			</tr>
		</thead>
		<tbody>`;
  estudiantesXLS.forEach((e) => {
    table += `
			<tr id="ced-${e.cedula}">
				<td>${e.cedula}</td>
				<td>${e.nombre}</td>
				<td>${e.apellidos}</td>
				<td>${e.sexo}</td>
				<td>${e.perfil}</td>
				<td>${e.correo}</td>
				<td class="text-center" role="button" onclick="deleteEntry('${e.cedula}')"><i class="fas fa-trash-alt text-danger"></i></td>
			</tr>
		`;
  });
  table += `
		</tbody>
	</table>`;
  $("#resultTableScript1").html(table);
  showFeedback();
}
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
}
document
  .getElementById("upload")
  .addEventListener("change", handleFileSelect, false);
document.addEventListener("DOMContentLoaded", loaded);
