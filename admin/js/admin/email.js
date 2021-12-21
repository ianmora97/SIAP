
var g_email_estudents = new Array();
var g_email_map_estudents = new Map();
var g_email_senders = new Map();
var g_email_cont = 0;
var g_email_grupos = new Array();
var g_email_map_grupos = new Map();
var g_email_estudiantes_matri = new Array();


function emailEvents(event){
    inboxPanel(event);
    bringAllEstudentsEmail();
    checkEmailExists();
    sendEmail();
    onSelectChangeEmail();
    preventDefaultAllMail();
}


function onSelectChangeEmail(){
    $('#formSelectEmailSenders').change(function(){
        var sender = $(this).val();
        if(sender != "null"){
            if(g_email_senders.get(sender) == undefined){
                if(g_email_senders.get('todos') != undefined) return;
                if(g_email_senders.get('todosMatri') != undefined) return;
                if(sender == 'todos' || sender == 'todosMatri'){
                    g_email_senders.set(sender,{email:sender});
                    g_email_cont++;
                    $('#emailsList').append(`
                        <div class="d-flex align-items-center border rounded-pill mb-1 mr-1 px-1" id="pillEmailSender_${sender}">
                            <div class="mx-0">
                                    <button class="btn btn-sm py-0" onclick="deleteEmailSender('${sender}','${sender}')"><i class="fas fa-times"></i></button>
                                </div>
                            <div class="mr-2">
                                <img src="/public/uploads/default-avatar.png" class="rounded-circle" width="20" height="20">
                            </div>
                            <div class="w-100">
                                <small class="mb-0">Todos los estudiantes ${sender == 'todosMatri' ? 'Matriculados':''}</small>
                            </div>
                        </div>
                    `);
                    
                }else{
                    let grupo = g_email_map_grupos.get(+sender);
                    console.log(grupo, sender);
                    g_email_senders.set(sender,{email:sender,isGrupo:true});
                    g_email_cont++;
                    $('#emailsList').append(`
                        <div class="d-flex align-items-center border rounded-pill mb-1 mr-1 px-1" id="pillEmailSender_${sender}">
                            <div class="mx-0">
                                    <button class="btn btn-sm py-0" onclick="deleteEmailSender('${sender}','${sender}')"><i class="fas fa-times"></i></button>
                                </div>
                            <div class="mr-2">
                                <img src="/public/uploads/default-avatar.png" class="rounded-circle" width="20" height="20">
                            </div>
                            <div class="w-100">
                                <small class="mb-0">${grupo.dia} ${grupo.hora}-${grupo.hora_final}</small>
                            </div>
                        </div>
                    `);
                }
            }
        }
    });
}
function cleanInputs(){
    $('#email_Subject').val('');
    $('#email_Message').html('');
    $('#formSelectEmailSenders').val('null');
    g_email_senders.clear();
    g_email_cont = 0;
    $('#emailsList').html('');
}
async function sendEmail(){
    $('#sendEmail_btn').click(function(){
        var email_Subject = $('#email_Subject').val();
        var email_Message = $('#email_Message').html();
        if(g_email_senders.size == 0){
            Swal.fire(
                'Correo Vacio',
                'Por favor digite al menos un correo',
                'warning'
            )
            return;
        }
        if(!email_Subject){
            Swal.fire(
                'No ha ingresado el asunto',
                'Por favor ingrese el asunto del correo',
                'warning'
            )
            return;
        } 
        if(!email_Message){
            Swal.fire(
                'No ha ingresado el mensaje',
                'Por favor ingrese el mensaje del correo',
                'warning'
            )
            return;
        }
        $('#sendEmail_btn').html(`<i class="fas fa-spinner fa-spin"></i> Enviando...`);
        var email_To = new Array();
        g_email_senders.forEach((value) => {
            email_To.push(value);
        });
        $('#nameContentEditableFooterEmail').attr('contenteditable',false);
        let footer = $('#footerEmailMessage').html()
        $('#email_Message').append(footer)
        buscarPorCorreoEmail(email_To).then((array) => {
            var email_MessageAfter = $('#email_Message').html();
            let data = {
                correos: new Array(...array),
                asunto: email_Subject,
                mensaje: email_MessageAfter
            }
            enviarCorreoAjax(data).then(() => {
                Swal.fire({
                    title: 'Correo Enviado',
                    html: `El correo se ha enviado correctamente a los correos seleccionados
                        <br>
                        <span class="text-primary">${new Array(...array).join(', ')}</span>
                    `,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                })
                cleanInputs();
                $('#sendEmail_btn').removeClass('btn-primary').addClass('btn-success').html('<i class="fas fa-check"></i> Enviado!');
                setTimeout(() => {
                    $('#sendEmail_btn').removeClass('btn-success').addClass('btn-primary').html('<i class="fas fa-paper-plane"></i> Enviar');
                }, 1500);
            });
        });
        
    });
}
function buscarPorCorreoEmail(correos){
    return new Promise((resolve, reject) => {
        let array = new Array();
        for (let i = 0; i < correos.length; i++) {
            const e = correos[i];
            if(e.isGrupo){
                let grupo = g_email_map_grupos.get(+e.email);
                let estudiantes = new Array();
                g_email_estudiantes_matri.forEach((value,key) => {
                    if(value.id_grupo == grupo.id_grupo){
                        estudiantes.push(value.correo);
                    }
                });
                array.push(...estudiantes);
            }else if(e.email == "todos"){
                array.push(...g_email_map_estudents.keys());
            }else if(e.email == "todosMatri"){
                for(let i = 0; i < g_email_estudiantes_matri.length; i++){
                    array.push(g_email_estudiantes_matri[i].correo);
                }
            }
            else{
                array.push(e.email);
            }
        }
        resolve(new Set(array));
    });
}
function enviarCorreoAjax(data){
    return new Promise((resolve,reject) => {
        console.log(data)
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "GET",
            url: "/admin/inbox/enviarCorreo",
            data: data,
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            resolve('enviado')
            console.log('%c Correo Enviado! ', 'background: #222; color: #bada55');
        }, (error) => {
            reject('fail')
            console.log(error)
        });
    });
}



function bringAllEstudentsEmail(){
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/matricula/listaMatriculados",
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_email_estudents.push(...response);
        response.forEach(function(estudiante){
            g_email_estudiantes_matri.push(estudiante);
        });
        console.log('%c Estudiantes Matriculados Cargados! ', 'background: #222; color: #bada55');
    }, (error) => {
        console.log(error)
    });
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes",
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_email_estudents.push(...response);
        response.forEach(function(estudiante){
            g_email_map_estudents.set(estudiante.correo,estudiante);
        });
        console.log('%c Lista de Estudiantes Cargados! ', 'background: #222; color: #bada55');
    }, (error) => {
        console.log(error)
    });
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getGrupos",
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_email_grupos = response;
        g_email_grupos.forEach(function(grupo){
            g_email_map_grupos.set(grupo.id_grupo,grupo);
            if(grupo.cupo_actual > 0){
                $('#formSelectEmailSenders').append(`
                    <option value="${grupo.id_grupo}">${grupo.dia} ${grupo.hora}-${grupo.hora_final}</option>
                `)
            }
        });
        console.log('%c Grupos Cargados! ', 'background: #222; color: #bada55');
    }, (error) => {
        console.log(error)
    });
}
function checkEmailExists(){
    $('#email_To').keyup(function(event){
        if(event.keyCode == 13 ){
            let email = $('#email_To').val();
            if(email.length > 0){
                let email = $('#email_To').val();
                if(g_email_senders.get(email) == undefined){
                    if(g_email_senders.get('todos') != undefined) return;
                    if(g_email_map_estudents.has(email)){
                        let estudiante = g_email_map_estudents.get(email);
                        g_email_senders.set(email,{email:email});
                        g_email_cont++;
                        $('#emailsList').append(`
                            <div class="d-flex align-items-center border rounded-pill mb-1 mr-1 px-1" id="pillEmailSender_${estudiante.cedula}">
                                <div class="mx-0">
                                    <button class="btn btn-sm py-0" onclick="deleteEmailSender('${estudiante.cedula}','${email}')"><i class="fas fa-times"></i></button>
                                </div>
                                <div class="mr-2">
                                    <img src="/public/uploads/${estudiante.foto}" class="rounded-circle" width="20" height="20">
                                </div>
                                <div class="w-100">
                                    <small class="mb-0">${estudiante.nombre}</small>
                                    <small class="mb-0 text-muted">${estudiante.correo}</small>
                                </div>
                            </div>
                        `);
                    }else if(email == 'todos'){
                        g_email_senders.set(email,{email:'todos'});
                        g_email_cont++;
                        $('#emailsList').append(`
                            <div class="d-flex align-items-center border rounded-pill mb-1 mr-1 px-1" id="pillEmailSender_${email}">
                                <div class="mx-0">
                                        <button class="btn btn-sm py-0" onclick="deleteEmailSender('${email}','${email}')"><i class="fas fa-times"></i></button>
                                    </div>
                                <div class="mr-2">
                                    <img src="/public/uploads/default-avatar.png" class="rounded-circle" width="20" height="20">
                                </div>
                                <div class="w-100">
                                    <small class="mb-0">Todos los estudiantes</small>
                                </div>
                            </div>
                        `);
                    }else{
                        g_email_senders.set(email,{email:email});
                        g_email_cont++;
                        $('#emailsList').append(`
                            <div class="d-flex align-items-center border rounded-pill mb-1 mr-1 px-1" id="pillEmailSender_${g_email_cont}">
                                <div class="mx-0">
                                        <button class="btn btn-sm py-0" onclick="deleteEmailSender('${g_email_cont}','${email}')"><i class="fas fa-times"></i></button>
                                    </div>
                                <div class="mr-2">
                                    <img src="/public/uploads/default-avatar.png" class="rounded-circle" width="20" height="20">
                                </div>
                                <div class="w-100">
                                    <small class="mb-0">${email}</small>
                                </div>
                            </div>
                        `);
                        const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger'
                            },
                            buttonsStyling: false
                        })
                        swalWithBootstrapButtons.fire({
                            title: `Correo no encontrado`,
                            html: `Desea agregar el correo en la lista de destinatarios?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Si, agregar',
                            cancelButtonText: 'No, eliminar',
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }else if (result.dismiss === Swal.DismissReason.cancel) {
                                deleteEmailSender(`${g_email_cont}`,email);
                            }
                        })
                    }
                }
            }
            $('#email_To').val('')
        }
    });
    
}
var oDoc = document.getElementById("email_Message")
var sDefTxt = oDoc.innerHTML;
function validateMode() {
    if (!document.compForm.switchMode.checked) { return true ; }
    alert("Uncheck \"Show HTML\".");
    oDoc.focus();
    return false;
  }
function formatDocEmail(sCmd, sValue) {
    document.execCommand(sCmd, false, sValue); oDoc.focus();
}
function fixBootstrapModal() {
    var modalNode = document.querySelector('.modal[tabindex="-1"]');
    if (!modalNode) return;
  
    modalNode.removeAttribute('tabindex');
    modalNode.classList.add('js-swal-fixed');
}
  
// call this before hiding SweetAlert (inside done callback):
function restoreBootstrapModal() {
    var modalNode = document.querySelector('.modal.js-swal-fixed');
    if (!modalNode) return;
  
    modalNode.setAttribute('tabindex', '-1');
    modalNode.classList.remove('js-swal-fixed');
}
function createLinkFormatEmail(){
    fixBootstrapModal()
    Swal.fire({
        title: 'Crear enlace',
        text: 'Ingrese un enlace URL, Correo o Teléfono',
        input: 'text',
        inputPlaceholder: 'Digite una dirección URL',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',

    }).then((result) => {
        restoreBootstrapModal()
        formatDocEmail('createlink',result.value)
    })
}

function deleteEmailSender(id,email){
    g_email_senders.delete(email);
    $(`#pillEmailSender_${id}`).remove();
}
function preventDefaultAllMail(){
    $(document).on('click', 'a[href^="mailto:"]', function(e) {
        e.preventDefault();
        $('#inboxButton').click();
        let correo = $(this).attr('href').replace('mailto:','');
        if(correo != undefined){
            $('#email_To').val(correo);
            var ev = jQuery.Event("keyup");
            ev.which = 13; // # Some key code value
            ev.keyCode = 13;
            $('#email_To').trigger(ev);
        }
    });
}
function inboxPanel(event){
    $('#inboxButton').on('click',function (e) {
        $('#inboxPanel').modal();
        oDoc.contentEditable = true;
        $('#wrapper').addClass('wrapperA rounded-3');
    });
    $('#inboxPanel').on('hide.bs.modal', function (e) {
        cleanInputs()
        oDoc.contentEditable = false;
        $('#wrapper').removeClass('wrapperA rounded-3');
    })
}

document.addEventListener("DOMContentLoaded", emailEvents);