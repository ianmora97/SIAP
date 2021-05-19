var mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: process.env.DB_DATESTRINGS
};

var con = mysql.createPool(config);
con.getConnection(function(err) {
    if (err){
        console.log(err);
        return;
    }
});

const DDL = {
    DELETE: 'ELIMINAR', //Referencia al "DELETE" de MySQL
    INSERT: 'AGREGAR', //Referencia al "INSERT" de MySQL
    UPDATE: 'ACTUALIZAR', //Referencia al "UPDATE" de MySQL
    SELECT: 'VISUALIZAR' //Referencia al "SELECT" de MySQL
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
    USUARIO : 'T_USUARIO'
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