const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/dashboard',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'dash';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
// -------- #menu items-------------
router.get('/admin/estudiantes',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'estudiantes';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/administradores',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'administradores';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/profesores',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'profesores';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/talleres',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'talleres';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/grupos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'grupos';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/solicitudes',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'solicitudes';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/comprobacion',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'comprobacion';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/reportes',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let s = 'reportes';
        res.render('admin/dashboard', {usuario,s});
    }else{
        res.render('indexAdmin');
    }
});
// -------- #menu items-------------
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


