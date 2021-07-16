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
    * Main routes are the manager for the main path /
*/

const express = require('express');
const router = express.Router();

const con = require('../../database');

router.get('/', (req, res) => {
    res.render('index');
});

// router.get('*', (req, res) => {
//     res.render('notAllowedAdmin');
// });

router.get('/cambiarClave', (req, res) => {
    res.render('solicitudCambioClave');
});

router.get('/admin', (req, res) => {
    res.render('index');
});

router.get('/profesores', (req, res) => {
    res.render('indexProfesores');
});

router.get('/registrarse', (req, res) => {
    res.render('client/registrarse');
});

router.get('/perfil', (req, res) => {
    res.render('client/perfil');
});

router.get('/contactarAdministrador',(req,res)=>{
    res.render('client/perfil');
});

module.exports = router;


