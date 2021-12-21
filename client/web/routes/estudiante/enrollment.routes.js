const express = require('express');
const router = express.Router();
const con = require('../../database');

//Selecciona matriculas de un estudiante en especifico
router.get('/client/matricula/seleccionaMatriculaEstudiante',(req,res)=>{
    
    const script = 'call prc_seleccionar_matricula_por_estudiante(?)'; 
    con.query(script,[req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            res.send(rows[0]);
        }else{
            res.send(err);
        }   
    });
});


//desmatricula - cambia el estado de matricula
router.put('/desmatricula',(req,res)=>{
    var script = 'prc_actualizar_activa_matricula( ? , ? )';
    con.query(script, [req.body.id,req.body.activa] , (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }else{
            console.log(err.message);
        }
    });
});

module.exports = router;


