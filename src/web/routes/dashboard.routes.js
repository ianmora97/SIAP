const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/dashboard',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        res.render('admin/dashboard', usuario);
    }else{
        res.render('index');
    }
});

router.get('/admin/stats/usuarios',(req,res)=>{
    let script = "select count(id) as cant from t_usuario";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/stats/talleres',(req,res)=>{
    let script = "select count(id) as cant from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/stats/matricula',(req,res)=>{
    let script = "select count(id) as cant from t_matricula";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
module.exports = router;


