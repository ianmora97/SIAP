var validate = (u) => {
    if (u.clave.length < 8 || u.clave.length > 20) return false;
    if (u.cedula.length < 9 || u.cedula.length > 13) return false;
    if (!u.nombre || !u.apellido || !u.nombreUsuario || !u.clave) return false;
    if (!u.sexo || !u.nacimiento) return false;
    return true;
};
var verificarCedula = (u) =>{
    if(u.length == 0) return false;
    for(let i=0;i<u.length;i++){
        let element = parseInt(u[i]);
        if(isNaN(element)) return false;
    }
    return true;
};
function verificarNombreCompleto(u){
    if(!checkString(u.nombre)) return false;
    if(!checkString(u.apellido)) return false;
    return true;
};
function checkString(string) {
    for(let i=0;i<string.length;i++){
        if(!isNaN(parseInt(string[i]))){
            return false;
        }
    }
    return true;
}
var checkPass = (c)=>{
    if(c.pass == c.pass_v) return true;
    return false;
}
var check = (u) => {
    let error = [];
    if (u.clave.length < 8 || u.clave.length > 20) error.push("clave");
    if (u.cedula.length < 9 || u.length > 13) error.push("cedula");
    if (!verificarCedula(u.cedula)) error.push('cedula');
    if (!u.nombre) error.push("nombre");
    if (!u.apellido) error.push("apellido");
    if (!checkString(u.nombre)) error.push("nombre");
    if (!checkString(u.apellido)) error.push("apellido");
    if (!u.clave) error.push("clave");
    if (!u.nombreUsuario) error.push("usuario");
    if (!u.nacimiento) error.push("nacimiento");
    if (!u.sexo) error.push("sexo");
    if (!u.tipoUser) error.push("tipo de usuario");
    return error;
};

var emailCheck = ($email)=> {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
}
export { validate, check, emailCheck, verificarCedula,verificarNombreCompleto,checkPass };
