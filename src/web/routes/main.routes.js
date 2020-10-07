const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/prueba',(req,res)=>{
    res.render('prueba');
});


router.get('/pruebaImage',(req,res)=>{
    res.render('pruebaImage');
});

router.get('/admin',(req,res)=>{
    res.render('indexAdmin');
});

router.get('/profesores',(req,res)=>{
    res.render('indexProfesores');
});

router.get('/registrarse',(req,res)=>{
    res.render('client/registrarse');
});

router.get('/perfil',(req,res)=>{
    res.render('client/perfil');
});

module.exports = router;


