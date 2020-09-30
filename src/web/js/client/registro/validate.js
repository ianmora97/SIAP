var validate = (u) => {
    if(!verificarNombreCompleto(u)) return false;
    if (u.clave.length < 8 || u.clave.length > 20) return false;
    if (u.cedula.length < 9 || u.length > 13) return false;
    if (!u.nombre || !u.apellido || !u.nombreUsuario || !u.clave) return false;
    if (!u.sexo || !u.nacimiento) return false;
    if(!emailCheck(emailCheck(u.email))) return false;
    if(!verificarCedula(u.cedula)) return false;
    return true;
};
var verificarCedula = (u) =>{
    for(let i=0;i<u.length;i++){
        switch(u[i]){
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            default:
                return false;
        }
    }
    return true;
};
function verificarNombreCompleto(u){
    console.log('yes');
    if(checkString(u.nombre)) return false;
    if(checkString(u.apellido)) return false;
    return true;
};
function checkString(string) {
    for(let i=0;i<string.length;i++){
        if(parseInt(string[i]) == 'NaN'){
            console.log();
            return false;
        }
    }
    return true;
}
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
export { validate, check, emailCheck };
