const express = require('express');
const router = express.Router();

const con = require('../database');

//selecciona todos los estudiantes
router.get('/estudiantes',(req,res)=>{
    var script = con.query('select * from t_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de estudiantes para administradores
router.get('/estudiantesAdmin',(req,res)=>{
    var script = con.query('select * from vta_admin_estudiante',
    (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

//vista de estudiantes para los clientes
router.get('/estudiantesClient',(req,res)=>{
    var script = con.query('select * from vta_cliente_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de documentos subidos por el estudiante
router.get('/estudiante/documentos',(req,res)=>{
    var script = con.query('select * from vta_documento_estudiante',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula
router.get('/estudianteCedula',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula para el administrador
router.get('/estudianteCedulaAdmin',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula_admin( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta Estudiante
router.post('/estudiante/insertar',(req,res)=>{
    console.log(req.query);
    var script = con.query('call prc_insertar_estudiante(?, ?)', 
    [req.query.departamento,req.query.usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

//Mueve un usuario temporal a un usuario fijo y lo agregar a la lista de estudiantes
router.post('/estudiante/insertarUsuarioPermanente',(req,res)=>{
    console.log(req.body);
    var script = con.query('call prc_cambiar_usuario_temp_a_permanente(?)', 
    [req.body.cedula],
    (err,result,fields)=>{
        
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            console.log(err);
            res.status(501).send('error');
        }
    });
});



module.exports = router;