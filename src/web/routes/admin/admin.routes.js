/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro
    * 
    * Admin routes - path /admin/*
*/

const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../../database');
// ? ----------------------------------- LOGIN LOGOUT ------------------------------------
// TODO: rutas para login y logout
router.post('/admin/log',(req,res)=>{ //login
    let script = "select * from vta_administradores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                if(rows[0].rol == 2){
                    req.session.value = rows[0];
                    let today = new Date();
                    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    let dateTime = date+' '+time;
                    console.log('[',chalk.green('OK'),']',chalk.magenta(dateTime) ,chalk.yellow(req.session.value.usuario),'Session Iniciada');
                    res.redirect('/admin/dashboard');
                }else{
                    res.render('indexAdmin',{err:'No tiene permisos',id: 1});
                }
            }else{
                res.render('indexAdmin', {err:'No se encuentra Registrado',id: 2});
            }
        }else{
            res.render('indexAdmin', {err:'Server Error',id: 3});
        }
    });
});

router.get('/admin/logout',(req,res)=>{ //logout
    if(req.session.value){
        let u = req.session.value.usuario;
        req.session.destroy((err) => {
            console.log('[',chalk.green('OK'),']',chalk.yellow(u),'Session Cerrada');
            res.render('indexAdmin');
        })
    }else{
        res.render('indexAdmin');
    }
});

// ! ----------------------------------- LOGIN LOGOUT ------------------------------------
// ? ----------------------------------- inside routes ------------------------------------
// TODO: rutas que manejan el menu


router.get('/admin/dashboard',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'dash';
            res.render('admin/dashboard', {usuario,s});
        }else{
            res.render('indexAdmin');
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
            res.render('admin/estudiantes', {usuario,s});
        }else{
            res.render('indexAdmin');
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
            res.render('admin/administradores', {usuario,s});
        }else{
            res.render('indexAdmin');
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
            res.render('indexAdmin');
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
            res.render('indexAdmin');
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
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/reposiciones',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'reposiciones';
            res.render('admin/reposiciones', {usuario,s});
        }else{
            res.render('indexAdmin');
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
            res.render('indexAdmin');
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
            res.render('indexAdmin');
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
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});
// ! ----------------------------------- inside routes ------------------------------------
// ? ----------------------------------- nav routes ------------------------------------
// TODO: rutas del navbar del panel administrativo
router.get('/admin/perfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'dash';
            res.render('admin/editarDatos', {usuario,s});
        }else{
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});

// ! ----------------------------------- nav routes ------------------------------------

module.exports = router;

