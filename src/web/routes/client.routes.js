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
router.get('/client/padecimientos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'padecimientos'}
        res.render('client/perfil/padecimientos',v);
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
router.post('/client/login',(req,res)=>{
    let script = "select u.cedula, u.nombre, u.apellido, u.usuario "+
    "from t_usuario u "+
    "inner join t_estudiante e "+
    "on e.usuario = u.id "+
    "where u.cedula = ?" +
    "and u.clave = sha1(?)";

    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            req.session.value = rows[0];
            console.log('[',chalk.green('OK'),']',chalk.yellow(req.session.value),'Session Iniciada');
            res.redirect('/client/home');
        }else{
            res.render('indexClient',{err:'2',id: req.body.cedula});
        }
    });
});
module.exports = router;


