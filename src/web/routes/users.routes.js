const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/users/check/report',(req,res)=>{
    res.render('index');
});

router.get('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
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

router.delete('',(req,res)=>{
    var script = con.query('',(err,rows,fields)=>{

    });
});


module.exports = router;