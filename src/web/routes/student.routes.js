    const express = require('express');
const router = express.Router();

const con = require('../database');

//selecciona todos los estudiantes
router.get('/',(req,res)=>{
    var script = con.query('select * from t_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de estudiantes para administradores
router.get('/',(req,res)=>{
    var script = con.query('select * from vta_admin_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de estudiantes para los clientes
router.get('/',(req,res)=>{
    var script = con.query('select * from vta_cliente_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de documentos subidos por el estudiante
router.get('/',(req,res)=>{
    var script = con.query('select * from vta_documento_estudiante',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula
router.get('/',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula()',req.cedula,(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula para el administrador
router.get('/',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula_admin()',req.cedula,(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta Estudiante
router.post('/',(req,res)=>{
    var script = con.query('call prc_insertar_estudiante(?, ?)', 
    [req.departamento,req.usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});



module.exports = router;