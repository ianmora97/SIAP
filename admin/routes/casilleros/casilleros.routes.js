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
const chalk = require('chalk');
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../systemLogs')
const con = require('../../database');

router.get('/admin/casilleros/bringCasilleros',ensureToken,(req,res)=>{
    let script = "select * from t_casillero";
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
router.get('/admin/casilleros/bringEstudiantes',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('select * from vta_admin_estudiante',
        (err,rows,fields)=>{
            if(!err){
                if(rows.length != 0){
                    res.send(rows);
                }else{
                    res.render('indexAdmin', {err:'No se encuentra Registrado',id: 2});
                }
            }else{
                res.render('indexAdmin', {err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});
router.get('/admin/casilleros/bringCasillerosEstudiantes',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('select * from vta_casilleros',
        (err,rows,fields)=>{
            if(!err){
                res.send(rows);
            }else{
                res.render('indexAdmin', {err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});
router.get('/admin/casilleros/asignarCasillero',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_insertar_casillero_estudiante(?, ?, ?,?)',
        [req.query.cedula,req.query.codigo,req.query.horaEntrada,req.query.horaSalida],
        (err,result,fields)=>{
            if(!err){
                logSistema(req.session.value.cedula, `${req.query.cedula} ASIGNAR CASILLERO -> ${req.query.codigo}`, DDL.INSERT, TABLE.CASILLERO_ESTUDIANTE);
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});
router.get('/admin/casilleros/revocarCasillero',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_eliminar_casillero_estudiante(?,?)',
        [req.query.id, req.query.codigo],
        (err,result,fields)=>{
            if(!err){
                logSistema(req.session.value.cedula, `${req.query.id} REVOCAR CASILLERO -> ${req.query.codigo}`, DDL.DELETE, TABLE.CASILLERO_ESTUDIANTE);
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});

router.get('/admin/casilleros/agregarCasillero',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_insertar_casillero(?)',
        [req.query.codigo],
        (err,result,fields)=>{
            if(!err){
                logSistema(req.session.value.cedula, `AGREGAR CASILLERO -> ${req.query.codigo}`, DDL.INSERT, TABLE.CASILLERO);
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
});

router.get('/admin/casilleros/eliminarCasillero',ensureToken,(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_eliminar_casillero(?)',
        [req.query.codigo],
        (err,result,fields)=>{
            if(!err){
                logSistema(req.session.value.cedula, `ELIMINAR CASILLERO -> ${req.query.codigo}`, DDL.INSERT, TABLE.CASILLERO);
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
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


