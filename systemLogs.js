var mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true
};

var con = mysql.createPool(config);
con.getConnection(function(err) {
    if (err){
        console.log(err);
        return;
    }
});

const DDL = {
    //TODO: Referencia al "DELETE" de MySQL
    DELETE: 'ELIMINAR', 
    //TODO: Referencia al "INSERT" de MySQL
    INSERT: 'AGREGAR', 
    //TODO: Referencia al "UPDATE" de MySQL
    UPDATE: 'ACTUALIZAR', 
    //TODO: Referencia al "SELECT" de MySQL
    SELECT: 'VISUALIZAR' 
}
const TABLE = {
    TALLER : 'T_TALLER',
    HORARIO : 'T_HORARIO',
    GRUPO : 'T_GRUPO',
    ESTUDIANTE : 'T_ESTUDIANTE',
    ADMINISTRADOR : 'T_ADMINISTRADOR',
    PROFESOR : 'T_PROFESOR',
    MATRICULA : 'T_MATRICULA',
    COMPROBACION : 'T_COMPROBACION',
    USUARIO : 'T_USUARIO',
    CASILLERO_ESTUDIANTE : 'T_CASILLERO_ESTUDIANTE',
    CASILLERO : 'T_CASILLERO',
    REPORTES : 'T_REPORTE',
    CONDUCTA : 'T_CONDUCTA'
}

function logSistema(usuario, descripcion, ddl, tabla) {
    con.query("CALL prc_insertar_actividad(?,?,?,?)", [usuario, descripcion, ddl, tabla], (err,result,fields)=>{
        if(!err){
            console.log(`[ ${chalk.yellow('ACTIVITY')} ] ${chalk.magenta('REPORT')} (@${usuario}) > ${ddl} | ${descripcion} ON ${tabla}`);
        }else{
            console.log(err);
        }
    });
}

module.exports = {
    DDL: DDL,
    TABLE: TABLE,
    logSistema
};