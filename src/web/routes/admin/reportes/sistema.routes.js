
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

router.get('/admin/registro/sistema',(req,res)=>{
    let script = "call prc_seleccionar_actividad()";
    var query = con.query(script, (err,rows,fields)=>{
        if(!err){
            if(rows[0] != undefined){
                if(rows[0].length != 0){
                    res.send(rows[0])
                }else{
                    res.send(rows[0])
                }
            }else{
                res.send({err:'NotFound'});
            }
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/registro/sistemaCanAdmin',(req,res)=>{
    let script = "select * from vta_administradores";
    var query = con.query(script, (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                if(rows.length != 0){
                    res.send(rows)
                }
            }else{
                res.send({err:'NotFound'});
            }
        }else{
            res.send({err:'NotFound'});
        }
    });
});
module.exports = router;

