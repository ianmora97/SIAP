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
// ! Estas rutas tienen que ser eliminadas, los stats se hacen en la capa logica no fetch

const express = require('express');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../../systemLogs')
const con = require('../../../database');

router.get('/admin/estudiante/listaEstudiantes',ensureToken,(req,res)=>{
    var script = 'select * from vta_admin_estudiante;';
    con.query(script,(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

router.get('/admin/estudiante/getTalleres',ensureToken,(req,res)=>{
    let script = "select * from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

router.post('/admin/listEstudiantes/cambiarfotoperfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            con.query('call prc_actualizar_foto_usuario(?, ?)',
            [req.body.cedula, req.file.filename],(err,rows,fields)=>{
                let usuario = req.session.value;
                let token = req.session.token;
                let s = 'estudiantes';
                if(!err){
                    res.render('admin/estudiantes', {usuario,s,token});
                }else{
                    res.render('admin/estudiantes', {usuario,s,token});
                }
            });
        }else{
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});

router.post('/admin/estudiantes/cambiarClave',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            con.query('call prc_actualizar_clave_sha1_usuario(?, ?)',
            [req.body.cedula, req.body.clave],(err,rows,fields)=>{
                let usuario = req.session.value;
                let token = req.session.token;
                let s = 'estudiantes';
                if(!err){
                    res.render('admin/estudiantes', {usuario,s,token});
                }else{
                    res.render('admin/estudiantes', {usuario,s,token});
                }
            });
        }else{
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});

router.get('/admin/estudiante/actualizarNivel',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_nivel_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.nivel],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} NIVEL -> ${req.query.nivel}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }
    });
});

router.get('/admin/estudiante/actualizarMorosidad',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_moroso_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.morosidad],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} MOROSIDAD -> ${req.query.morosidad ? 'MOROSO' : 'LIMPIO'}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/actualizarEstado',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_estado_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.estado],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} ESTADO -> ${req.query.estado ? 'ACTIVO' : 'INACTIVO'}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

// !------------------------------------------------------------------------------------------------------------------------

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


