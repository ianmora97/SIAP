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
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../../systemLogs')

const con = require('../../../database');

router.get('/admin/profesores/getProfesores',ensureToken,(req,res)=>{
    let script = "select * from vta_profesores";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }else{
            res.send(err);
        }
    });
});

router.get('/admin/administrador/eliminarProfesor',ensureToken,(req,res)=>{
    let script = "call prc_eliminar_administrativo(?)";
    con.query(script,[req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });
});

function ensureToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader === undefined) {
        res.redirect('/api/not_allowed');
    }else{
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
}
router.get('/api/not_allowed',(req,res)=>{ //logout
    res.render('notAllowedAdmin');
});

module.exports = router;


