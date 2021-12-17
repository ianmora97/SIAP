/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro
    * 
*/
// ? ----------------------------------- Selects ------------------------------------
// TODO: selects de la petic
const express = require('express');
const router = express.Router();

const con = require('../../database');

router.get('/admin/reportes/morosos/estudiantesMorosos',ensureToken,(req,res)=>{
    let script = "SELECT * FROM vta_estudiante_moroso";
    var query = con.query(script, (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err);
        }
    });
});
// ! ----------------------------------- security ------------------------------------
function ensureToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader === undefined) {
        res.redirect('/api/not_allowed');
    }else{
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
}
router.get('/api/not_allowed',(req,res)=>{ //logout
    res.render('notAllowedAdmin');
});

function logSistema(usuario, descripcion, ddl, tabla) {
    con.query("CALL prc_insertar_actividad(?,?,?,?)", [usuario, descripcion, ddl, tabla], (err,result,fields)=>{
        if(!err){
            console.log(`[ ${chalk.green('OK')} ] ${chalk.yellow('ACTIVITY')} (${usuario}) @ ${descripcion} | ${ddl} ON ${tabla}`);
        }else{
            console.log(err);
        }
    });
}
module.exports = router;


