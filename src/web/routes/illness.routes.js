const express = require('express');
const router = express.Router();

const con = require('../database');

//Seleccionar todos los padecimientos en general
router.get('/padecimientos',(req,res)=>{
    var script = con.query('select * from vta_padecimientos',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Seleccionar los padecimientos de un estudiante en especifico
router.get('/padecimientosEstudiante',(req,res)=>{
    var script = con.query('call prc_seleccionar_padecimientos_por_estudiante( ? )', [req.body.estudiante] ,(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//insertar un padecimiento en especifico
router.post('/InsertarUnPadecimiento',(req,res)=>{
    var script = con.query('call prc_insertar_padecimiento_estudiante(?, ?)',
    [req.body.descripcion,req.body.estudiante,req.body.observaciones],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

//Actualizar un padecimiento con su ID
router.put('/padecimiento/actualizarDescripcion',(req,res)=>{
    var script = 'call prc_actualizar_descripcion_padecimiento(? , ?)';
    con.query(script, [req.body.id , req.body.descripcion] , (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
      });
});

//eliminar un padecimiento con el id del padecimiento
router.delete('/padecimiento/elimina',(req,res)=>{
    var script = 'call prc_eliminar_padecimiento( ? )';
    con.query(script, [req.body.id], (error, results, fields) => {
        if (error)
          return console.error(error.message);
      
        console.log('Deleted Row(s):', results.affectedRows);
      });
});

module.exports = router;