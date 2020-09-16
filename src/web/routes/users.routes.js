const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});
 
router.post('/usuario/registrarse',(req,res)=>{
    console.log(req.body);
    var script = con.query('call prc_insertar_usuario_temp(?, ?, ?, ?, ?, ?, ?, ?)', 
    [req.body.cedula, req.body.nombre, req.body.apellido, req.body.nacimiento, req.body.nombreUsuario, req.body.clave, req.body.sexo, req.body.tipoUser],
    (err,result,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Ingresado correctamente');
            res.send(result[0]);
        }
    });
});

router.get('/usuariosPRC',(req,res)=>{
    var script = con.query('call prc_seleccionar_usuarios()',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

router.post('/usuario/registrarse',(req,res)=>{
    var script = con.query('call prc_insertar_usuario(?, ?, ?, ?, ?, ?, ?)', 
    [req.body.cedula, req.body.nombre, req.body.apellido, req.body.nacimiento, req.body.usuario, req.body.clave, req.body.sexo],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

router.put('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

module.exports = router;