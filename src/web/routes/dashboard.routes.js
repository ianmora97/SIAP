const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/dashboard',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'dash';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});

// -------- #menu items-------------
router.get('/admin/estudiantes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'estudiantes';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/administradores',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'administradores';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/profesores',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'profesores';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/talleres',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){        
            let usuario = req.session.value;
            let s = 'talleres';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/grupos',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'grupos';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/solicitudes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'solicitudes';
            res.render('admin/solicitudes', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});

router.get('/admin/comprobacion',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'comprobacion';
            res.render('admin/comprobacionDatos', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/reportes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'reportes';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('index');
        }
    }else{
        res.render('indexAdmin');
    }
});
// -------- #menu items-------------

module.exports = router;


