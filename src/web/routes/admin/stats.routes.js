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
// ! Estas rutas tienen que ser eliminadas, los stats se hacen en la capa logica no fetch

const express = require('express');
const router = express.Router();

const con = require('../../database');

router.get('/admin/stats/cantidadRegistros',(req,res)=>{
    let script = "select * from vta_cantidad_usuarios_registrados";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows[0]);
            }
        }
    });
});


router.get('/admin/stats/usuariosVerificados',(req,res)=>{
    let script = "select count(id) as cant from t_usuario_temp";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/admin/stats/usuariosNuevos',(req,res)=>{
    let script = "select count(id) as cant from vta_usuario_temp where estado = 0";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});


module.exports = router;


