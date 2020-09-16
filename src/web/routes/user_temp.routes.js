const express = require('express');
const router = express.Router();

const con = require('../database');

//Selecciona todos los usuarios temporales
router.get('/usuariostemp',(req,res)=>{
    var script = con.query('select * from vta_usuario_temp;',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//actualiza usuario temporal
router.put('/',(req,res)=>{
    var script = con.query('',[],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//inserta un usuario temporal
router.post('/usariotempo/insertar',(req,res)=>{
    var script = con.query('call prc_insertar_usuario_temp(?, ?, ?, ?, ?, ?, ?, ?)',
    [req.body.cedula,req.body.nombre, req.body.apellido,req.body.nacimiento,req.body.usuario,req.body.clave,
        req.body.sexo,req.body.tipo_usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

//eliminar un usuario temporal con su cedula
router.delete('/usuariotempo/delete',(req,res)=>{
    var script = 'call prc_eliminar_usuario_temp( ? )'; 
    con.query(script, [req.body.cedula],
        (error, results, fields) => {
        if (error)
          return console.error(error.message);
      
        console.log('Deleted Row(s):', results.affectedRows);
      });
});


module.exports = router;