const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

router.get('/client/home',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let v = {usuario, selected:'home'}
            res.render('client/perfil/inicio',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/client/clases',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let usuario = req.session.value;
            let v = {usuario, selected:'clases'}
            res.render('client/perfil/clases',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});
router.get('/client/matricula',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let usuario = req.session.value;
            let v = {usuario, selected:'matricula'}
            res.render('client/perfil/matricula',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});
router.get('/client/informacionMedica',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let usuario = req.session.value;
            let v = {usuario, selected:'informacionMedica'}
            res.render('client/perfil/informacionMedica',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/client/perfil',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let usuario = req.session.value;
            let v = {usuario, selected:'perfil'}
            res.render('client/perfil/perfil',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/client/logout',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let u = req.session.value.usuario;
            req.session.destroy((err) => {
                res.render('index');
            })
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});
router.get('/client/padecimientos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol != 'number'){
            let usuario = req.session.value;
            let v = {usuario, selected:'padecimientos'}
            res.render('client/perfil/padecimientos',v);
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/client/cargarCursos',(req,res)=>{
    let script = "select distinct * from vta_grupos where nivel = ? order by hora";
    var query = con.query(script,
        [req.query.nivel],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                
                res.send(rows);
            }
        }
    });
});
router.post('/client/login',(req,res)=>{
    let script = "select * from vta_cliente_estudiante "+
    "where cedula = ? " +
    "and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                req.session.value = rows[0];
                res.redirect('/client/perfil');
            }else{
                res.render('index',{err:'No se encuentra registrado',id: 1});
            }
        }else{
            res.render('index',{err:'Error en servidor',id: 2});
        }
    });
});

router.post('/client/matricularCursos',(req,res)=>{
    if(req.session.value){
        let script = "call prc_insertar_matricula(?,?,1)";
        let c = req.body;
        var query = con.query(script,
            [c.id, c.estudiante],
            (err,result,fields)=>{
            if(err){
                res.status(501).send('error'); 
            }else{
                res.send('ok');
            }
        });
    }else{
        res.status(500).send('render');
    }
    
});
module.exports = router;


