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

const con = require('../../../database');
// ? ---------------------------------------------------------- TALLERES CRUD ----------------------------------------------------------

router.get('/admin/talleres/getTalleres',ensureToken,(req,res)=>{
    let script = "call prc_seleccionar_talleres";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0])
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/admin/talleres/eliminarTaller',ensureToken,(req,res)=>{
    let script = "call prc_eliminar_taller(?)";
    var query = con.query(script, 
        [req.query.id],
         (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/talleres/actualizarTaller',ensureToken,(req,res)=>{
    let script = "call prc_actualizar_taller(?,?,?,?,?)";
    var query = con.query(script, 
        [req.query.id, req.query.descripcion, req.query.nivel, req.query.costo, req.query.costo_funcionario],
         (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/talleres/ingresarTaller',ensureToken,(req,res)=>{
    con.query("call prc_insertar_taller(?,?,?,?,?)", 
        [req.query.codigo, req.query.descripcion, req.query.nivel, 
            req.query.costoEst, req.query.costoFun],
        (err,rows,fields)=>{
        if(!err){
            let r = rows;
            res.send({fb:'good',rows:r});
        }else{
            let error = err;
            res.send({err:'NotFound',fb:error});
        }
    });
});

// ? ---------------------------------------------------------- HORARIOS CRUD ----------------------------------------------------------
router.get('/admin/talleres/getHorarios',ensureToken,(req,res)=>{
    let script = "call prc_seleccionar_horarios";
    var query = con.query(script, (err,rows,fields)=>{
        if(!err){
            res.send(rows[0])
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/talleres/ingresarHorario',ensureToken,(req,res)=>{
    con.query("call prc_insertar_horario(?,?)", 
        [req.query.dia, req.query.hora],
         (err,rows,fields)=>{
        if(!err){
            let r = rows;
            res.send({fb:'good',rows:r});
        }else{
            let error = err;
            res.send({err:'NotFound',fb:error});
        }
    });
});

// ? ---------------------------------------------------------- GRUPOS CRUD ----------------------------------------------------------


router.get('/admin/talleres/getGrupos',ensureToken,(req,res)=>{
    let script = "SELECT * from  vta_grupos";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows)
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/talleres/actualizarGrupo',ensureToken,(req,res)=>{
    let script = "call prc_actualizar_taller(?,?,?,?,?)";
    var query = con.query(script, 
        [req.query.id, req.query.descripcion, req.query.nivel, req.query.costo, req.query.costo_funcionario],
         (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows)
        }else{
            res.send({err:'NotFound'});
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

function actividadSistema(user,ddl,table,desc) {
    con.query("call prc_insertar_actividad(?,?,?,?)",[user,ddl,table,desc], (err,result)=>{});
}

module.exports = router;


