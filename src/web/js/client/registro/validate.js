var validate = (u) => {
    if (u.clave.length < 8 || u.clave.length > 20) return false;
    if (u.cedula.length < 9 || u.length > 13) return false;
    if (!u.nombre || !u.apellido || !u.nombreUsuario || !u.clave) return false;
    if (!u.sexo || !u.nacimiento) return false;
    if(!emailCheck(emailCheck(u.email))) return false;
    return true;
};
var verificarCampos = (u) =>{
    
};
var check = (u) => {
    let error = [];
    if (u.clave.length < 8 || u.clave.length > 20) error.push("clave");
    if (u.cedula.length < 9 || u.length > 13) error.push("cedula");
    if (!u.nombre) error.push("nombre");
    if (!u.apellido) error.push("apellido");
    if (!u.clave) error.push("clave");
    if (!u.nombreUsuario) error.push("usuario");
    if (!u.nacimiento) error.push("nacimiento");
    if (!u.sexo) error.push("sexo");
    if (!u.tipoUsuario) error.push("tipo de usuario");
    return error;
};

var emailCheck = ($email)=> {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
}
export { validate, check };
