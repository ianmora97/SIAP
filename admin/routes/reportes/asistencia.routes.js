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
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();

const con = require('../../database');

router.get('/admin/reportes/asistencia/getGrupos',(req,res)=>{
    let script = "SELECT * FROM vta_grupos";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            if(rows.length != 0){
                res.send(rows)
            }
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/admin/reportes/asistencia/getGrupo',(req,res)=>{
    con.query("SELECT * FROM vta_grupos where id_grupo = ?", [req.query.id_grupo]
    ,(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send({status:'300',err:err});
        }
    });
});

router.get('/admin/reportes/asistencia/getByGrupo',ensureToken,(req,res)=>{
    con.query("SELECT * FROM vta_asistencia_admin WHERE id_grupo = ?", [req.query.grupo] ,
    (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send({status:'300',err:err});
        }
    });
});

router.get('/admin/reportes/asistencia/getAsistencia',(req,res)=>{
    con.query("SELECT * FROM vta_asistencia_admin", 
    (err,rows,fields)=>{
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


