const express = require('express');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var filePath = path.join(__dirname, '../../logs/log.txt');
const con = require('../../database');
const lite = require('../../databaseLite');


router.get('/admin/pagos/getPagos',ensureToken,(req,res)=>{
    con.query("select * from vta_pagos",
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

router.get('/admin/pagos/agregar',ensureToken,(req,res)=>{
    console.log(req.query);
    con.query("call prc_insertar_pago(?,?,?,?)",[parseInt(req.query.est),req.query.cuenta,parseInt(req.query.monto),parseInt(req.query.grupo)],
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
            res.send(err);
        }
    });
});

router.put('/admin/pagos/actualizar',ensureToken,(req,res)=>{
    con.query("call prc_actualizar_pago(?,?,?,?)",[req.query.id, req.query.est,req.query.cuenta,req.query.monto],
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

router.delete('/admin/pagos/eliminar/:id',ensureToken,(req,res)=>{
    con.query("call prc_eliminar_pago(?)",[req.params.id],
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


