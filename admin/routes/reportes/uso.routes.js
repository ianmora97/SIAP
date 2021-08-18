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

const {logSistema, DDL, TABLE} = require('../../systemLogs');

const con = require('../../database');


router.get('/admin/reportes/uso/getMatriculadosPorGrupo',ensureToken,(req,res)=>{
    let script = "SELECT * FROM vta_matriculados_por_grupo";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows)
        }else{
            res.send({err:'NotFound'});
        }
    });
});

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


module.exports = router;


