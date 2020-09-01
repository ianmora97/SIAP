const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/pene',(req,res)=>{
    res.redirect('/penecillo');
});

router.get('/penecillo',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            var filas = rows;
            res.json(filas);
        }
    });
    res.render('pene');
});

router.post('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

router.post('/profesores',(req,res)=>{
    var script = con.query('select * from t_profesor',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});
module.exports = router;