const express = require('express');
const { readSync } = require('fs');
const router = express.Router();

const con = require('../database');

//Selecciona todos los reposicion
router.get('/reposicion',(req,res)=>{
    var script = 'select * from vta_reposiciones';
    con.query(script,(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Selecciona reposicion especifico
router.get('/reposicion/seleccionarespecificos',(req,res)=>{
    const script = 'call prc_seleccionar_reposicion_por_cedula(?)'; 
    con.query(script,[req.body.id],(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta una reposicion
router.post('/reposicion/insertar',(req,res)=>{
    var script = 'call prc_insertar_reposicion( ? , ? , ? , ? , ? )';
    con.query(script,[req.body.idEstudiante , req.body.grupo_origen , req.body.grupo_reposicion 
        , req.body.fecha_reposicion , req.body.comprobante ],
        (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }else{
            console.log(err.message);
        }
    });
});

//actualizar una reposicion
router.put('/reposicion/actualizar',(req,res)=>{
    var script = '';
    con.query(script,[req.body.id , req.body.grupo_origen , req.body.grupo_reposicion , 
        req.body.fecha_reposicion , req.body.comprobante],(err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }else {
            console.log(err.message);
        }
    });
});

//Elimina una reposicion 
router.delete('/reposicion/delete',(req,res)=>{
    var script = 'call prc_eliminar_reposicion( ? )';
    con.query(script,[req.body.id],(err,result,fields)=>{
        if(!err){
            res.send(result);
        }
    });
});


module.exports = router;


