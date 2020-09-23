const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

//Seleccionar todos los padecimientos en general
router.get('/client/cargarPadecimientos',(req,res)=>{
    let script = "select * from vta_padecimientos where cedula = ?";
    var query = con.query(script,
        [req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                console.log('[',chalk.green('OK'),'] cargando padecimientos de',chalk.yellow(req.session.value.usuario));
                res.send(rows);
            }else{
                res.status(504).send('');
            }
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
router.post('/client/insertarPadecimientos',(req,res)=>{
    var script = con.query('call prc_insertar_padecimiento_estudiante(?, ?, ?)',
    [req.body.descripcion,req.body.id,req.body.observacion],
    (err,result,fields)=>{
        if(!err){
            res.send(result);
        }
    });
});

//Actualizar un padecimiento por id
router.put('/client/padecimiento/actualizarObservacion',(req,res)=>{
    var script = 'call prc_actualizar_observacion_padecimiento(? , ?)';
    con.query(script, [req.body.id , req.body.observacion] ,
    (error, results, fields) => {
        console.log();
        if (!error){
            res.send(results);
        }else{
            res.status(501).send('error');
        }
    });
});

//eliminar un padecimiento con el id del padecimiento
router.delete('/padecimiento/elimina',(req,res)=>{
    var script = 'call prc_eliminar_padecimiento( ? )';
    con.query(script, [req.body.id], (error, results, fields) => {
        if (error)
          return console.error(error.message);
      });
});

module.exports = router;