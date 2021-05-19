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
// TODO: CRUD
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../../systemLogs');

const con = require('../../../database');
// ? ---------------------------------------------------------- TALLERES CRUD ----------------------------------------------------------

router.post('/admin/matricula/matricularCursos', ensureToken, (req,res)=>{
    con.query("call prc_insertar_matricula(?,?)",
        [req.body.grupo, req.body.estudiante],
        (err,result,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.body.estudiante + " | MATRICULAR " + req.body.grupo}`, DDL.INSERT, TABLE.MATRICULA);
            res.send(result);
        }else{
            res.send(err);
        }
    });
});


router.post('/admin/matricula/cambiarEstado/matricula',ensureToken,(req,res)=>{
    con.query("call prc_actualizar_matricula_estudiante(?,?)",
        [req.body.curso_id,req.body.estado], (err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(501).send('error'); 
        }else{
            logSistema(req.session.value.cedula, `${req.body.estudiante + " | MOVER ESTADO ->" + req.body.estado}`, DDL.UPDATE, TABLE.MATRICULA);
            res.send('ok');
        }
    });
});

router.post('/admin/matricula/desmatricular',ensureToken,(req,res)=>{
    con.query("call prc_eliminar_matricula(?)",
        [req.body.curso_id], (err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(501).send('error'); 
        }else{
            logSistema(req.session.value.cedula, `${"DESMATRICULAR | "+req.body.estudiante}`, DDL.UPDATE, TABLE.MATRICULA);
            res.send('ok');
        }
    });
});

// ! ----------------------------------- SECURITY ------------------------------------
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


