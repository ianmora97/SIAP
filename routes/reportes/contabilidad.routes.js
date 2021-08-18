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

router.get('/admin/reportes/contabilidad/getUsuarios',(req,res)=>{
    let script = "SELECT * FROM siapd.t_estudiante";
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

router.get('/admin/reportes/sistema/getAlgo',(req,res)=>{
    let script = "SELECT * FROM vta_asistencia_admin";
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

module.exports = router;