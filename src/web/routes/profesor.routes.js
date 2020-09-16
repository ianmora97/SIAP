const express = require('express');
const router = express.Router();

const con = require('../database');

//Selecciona todos los profesores
router.get('/profesores',(req,res)=>{
    var script = 'call prc_seleccionar_profesores();';
    con.query(script,(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Selecciona profesores especifico
router.get('/profesores/:id',(req,res)=>{
    console.log(req.params.id);
    const script = 'call prc_seleccionar_profesor_id(?)'; 
    con.query(script,[req.params.id],(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta un profesor
router.post('/profesores/insertar',(req,res)=>{
    var script = 'call prc_insertar_profesor( ? )';
    con.query(script,[req.body.idUsuario],(err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }else{
            console.log(err.message);
        }
    });
});

//Elimina un profesor 
router.delete('/profesores/delete',(req,res)=>{
    var script = 'call prc_eliminar_profesor( ? )';
    con.query(script,[req.body.id],(err,result,fields)=>{
        if(!err){
            res.send(result);
        }
    });
});

module.exports = router;