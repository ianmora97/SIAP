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

const con = require('../../../database');

router.get('/admin/casilleros/bringCasilleros',(req,res)=>{
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
router.get('/admin/casilleros/bringEstudiantes',(req,res)=>{
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
router.get('/admin/casilleros/bringCasillerosEstudiantes',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('select * from vta_casilleros',
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
router.get('/admin/casilleros/asignarCasillero',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_insertar_casillero_estudiante(?, ?, ?,?)',
        [req.query.cedula,req.query.codigo,req.query.horaEntrada,req.query.horaSalida],
        (err,result,fields)=>{
            if(!err){
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});
router.get('/admin/casilleros/revocarCasillero',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_eliminar_casillero_estudiante(?)',
        [req.query.id],
        (err,result,fields)=>{
            if(!err){
                res.send(result);
            }else{
                res.send({err:'Server Error',id: 3});
            }
        });
    }else{
        res.render('index');
    }
    
});

module.exports = router;


