const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

//eliminar asistencia
//insertar asistencia
//seleccionar asistencia
//seleccionar asistencia por día
//seleccionar asistencia por estudiante
//seleccionar asistencia por grupo
//seleccionar asistencia por grupo y dia
//seleccionar asistencia por grupo y estudiante
//seleccionar asistencia por grupo, estudiante y dia

//seleccionar ausencia
//seleccionar ausencia por día
//seleccionar ausencia por estudiante
//seleccionar ausencia por grupo
//seleccionar ausencia por grupo y dia
//seleccionar ausencia por grupo y estudiante
//seleccionar ausencia por grupo, estudiante y dia

//seleccionar ausencia por estudiante
router.get('/ausencias/porEstudiante',(req,res)=>{
    var script = 'call prc_seleccionar_ausencias_por_estudiante( ? )';
    con.query(script, [req.body.id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err.message);
        }
    });
});

router.get('/attendance',(req,res)=>{
    var script = 'select * from vta_asistencia;';
    con.query(script,(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err.message);
        }
    });
});

router.post();

router.put();

router.delete();


module.exports = router;