const express = require('express');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const qr = require("qrcode");
const path = require('path');
const fs = require('fs');
const router = express.Router();
var email = require('../../email');
const {logSistema, DDL, TABLE} = require('../../systemLogs');
const con = require('../../database');

// todo: login
// ? --------- login ---------
router.post('/teach/log',(req,res)=>{ //login
    let script = "select * from vta_profesores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                if(rows[0].rol == 2){
                    const userLogged = rows[0];
                    jwt.sign({userLogged},'secretKeyToken',(err,token)=>{
                        req.session.value = rows[0];
                        req.session.token = token;
                        let today = new Date();
                        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        let dateTime = date+' '+time;
                        res.redirect('/teach/inicio');
                    }); //json web token
                    
                }else{
                    res.render('loginTeach',{err:'No tiene permisos',id: 1});
                }
            }else{
                res.render('loginTeach', {err:'No se encuentra Registrado',id: 2});
            }
        }else{
            res.render('loginTeach', {err:'Server Error',id: 3});
        }
    });
});

router.get('/teach/logout',(req,res)=>{
    if(req.session.value){
        req.session.destroy((err) => {
            res.redirect('/teach/login');
        })
    }else{
        res.redirect('/teach/login');
    }
});
// ? ---------------------- Inicio - clases ----------------------

router.get('/teach/inicio',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol == 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let selected = 'inicio';
            res.render('teach/inicio',{usuario,selected,token});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/teach/login');
    }
});
router.get('/api/teach/inicio',ensureToken,(req,res)=>{
    let usuario = req.session.value;
    con.query("SELECT * from vta_grupos where cedula = ?",[usuario.cedula],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

// ? ---------------------- grupos ----------------------
router.get('/teach/grupo/:grupo',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol == 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let grupo = req.params.grupo;
            let selected = 'inicio';
            res.render('teach/grupo',{usuario,selected,token,grupo});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});
router.get('/teach/asistencia/:grupo',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol == 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let grupo = req.params.grupo;
            let selected = 'inicio';
            res.render('teach/asistencia',{usuario,selected,token,grupo});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});

router.get('/api/teach/grupos',ensureToken,(req,res)=>{
    let usuario = req.session.value;
    let grupo = req.query.grupo;
    con.query("SELECT * FROM vta_grupos",
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/api/teach/grupo',ensureToken,(req,res)=>{
    let usuario = req.session.value;
    let grupo = req.query.grupo;
    con.query("SELECT * FROM vta_grupos WHERE id_grupo = ?",
    [grupo],(err,rows,fields)=>{
        if(!err){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/api/teach/grupoMatriculados',ensureToken,(req,res)=>{
    let usuario = req.session.value;
    let grupo = req.query.grupo;
    con.query(`SELECT * FROM vta_matriculados_por_grupo WHERE cedula_profeosr = '${usuario.cedula}' AND id_grupo = ${grupo}`,
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
// ? -------------------- verificar Matricula -------------
router.get('/teach/matricula/qr/check',(req,res)=>{
    con.query("SELECT * FROM vta_matriculados_por_grupo WHERE id_grupo = ? AND cedula = ?",
    [req.query.grupo, req.query.cedula],
        (err,result,fields)=>{
        if(!err){
            res.send(result);
        }else{
            res.send(err);
        }
    });
});
// ? ---------------------- asistencia ----------------------
router.get('/teach/asistencias',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol == 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let selected = 'asistencia';
            res.render('teach/listaAsistencia',{usuario,selected,token});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});
router.get('/api/teach/getAsistencia',ensureToken,(req,res)=>{
    con.query("SELECT * FROM vta_asistencia",
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.status(501).send('error');
        }
    });
});
router.get('/api/teach/getAsistenciaByGroup',ensureToken,(req,res)=>{ 
    con.query("SELECT * FROM vta_asistencia_admin WHERE id_grupo = ?",
    [req.query.grupo],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.status(501).send('error');
        }
    });
});
router.get('/teach/enviarAsistencia',ensureToken,(req,res)=>{ 
    con.query("call prc_insertar_asistencia(?,?,?,?)",
    [req.query.estado,req.query.est,req.query.grupo,req.query.fecha],
    (err,rows,fields)=>{
        if(!err){
            console.log(rows)
            res.send(rows);
        }else{
            console.log(err)
            res.status(501).send('error');
        }
    });
});

// ! ---------------------- Security ----------------------
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
router.get('/api/not_allowed',(req,res)=>{
    res.render('notAllowedAdmin');
});

module.exports = router;