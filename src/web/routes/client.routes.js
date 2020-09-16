const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

router.get('/client/home',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'home'}
        res.render('client/perfil/inicio',v);
    }else{
        res.render('indexClient');
    }
});

router.get('/client/clases',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'clases'}
        res.render('client/perfil/clases',v);
    }else{
        res.render('indexClient');
    }
});
router.get('/client/matricula',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'matricula'}
        res.render('client/perfil/matricula',v);
    }else{
        res.render('indexClient');
    }
});
router.get('/client/informacionMedica',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'informacionMedica'}
        res.render('client/perfil/informacionMedica',v);
    }else{
        res.render('indexClient');
    }
});

router.get('/client/perfil',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'perfil'}
        res.render('client/perfil/perfil',v);
    }else{
        res.render('indexClient');
    }
});

router.get('/client/logout',(req,res)=>{
    if(req.session.value){
        let u = req.session.value.usuario;
        req.session.destroy((err) => {
            console.log('[',chalk.green('OK'),']',chalk.yellow(u),'Session Cerrada');
            res.render('indexClient');
        })
    }
});
router.get('/client/padecimientos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'padecimientos'}
        res.render('client/perfil/padecimientos',v);
    }else{
        res.render('indexClient');
    }
});
router.get('/client/cargarPadecimientos',(req,res)=>{
        let script = "select * from vta_padecimientos where cedula = ?";
        var query = con.query(script,
            [req.query.cedula],
            (err,rows,fields)=>{
            if(!err){
                if(rows != undefined){
                    console.log(rows);
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
            if(rows != undefined){
                req.session.value = rows[0];
                console.log('[',chalk.green('OK'),']',chalk.yellow(req.session.value.usuario),'Session Iniciada');
                res.redirect('/client/home');
            }
        }else{
            res.render('indexClient',{err:'2',id: req.body.cedula});
        }
    });
});

router.post('/client/subirImagen',(req,res)=>{
    console.log(req.body);
    let script = "update t_usuario set foto = ? "+
    "where cedula = 116890118";
    var query = con.query(script,
        [req.body.foto],
        (err,result,fields)=>{
        if(!err){
            if(result.affectedRows){
                res.send('ok');
            }
        }
    });
});
module.exports = router;


