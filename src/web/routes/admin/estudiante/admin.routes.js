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

const con = require('../../../database');

router.get('/admin/estudiante/getTalleres',(req,res)=>{
    let script = "select * from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

router.get('/admin/estudiante/actualizarNivel',(req,res)=>{
    let script = "CALL prc_actualizar_nivel_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.nivel],
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }
    });
});

router.get('/admin/estudiante/actualizarMorosidad',(req,res)=>{
    let script = "CALL prc_actualizar_moroso_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.morosidad],
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});



module.exports = router;


