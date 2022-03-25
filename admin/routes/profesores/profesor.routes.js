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

const {logSistema, DDL, TABLE} = require('../../systemLogs')

const con = require('../../database');

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

router.get('/admin/profesor/eliminar',ensureToken,(req,res)=>{
    let script = "call prc_eliminar_profesor(?)";
    con.query(script,[req.query.id],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `ELIMINAR ${req.query.id}`, DDL.DELETE, TABLE.PROFESOR);
            res.send(rows);
        }else{
            res.send(err);
        }
    });
});
router.get('/admin/profesor/eliminarAso',ensureToken,(req,res)=>{
    let script = "DELETE FROM t_profesor WHERE id = ?";
    con.query(script,[req.query.id],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `DESASOCIAR ${req.query.id}`, DDL.DELETE, TABLE.PROFESOR);
            res.send(rows);
        }else{
            res.send(err);
        }
    });
});

router.get('/admin/profesor/agregar',ensureToken,(req,res)=>{
    let script = "call prc_insertar_profesor_admin(?,?,?,?,?,?,?)";
    con.query(script,[req.query.cedula, req.query.nombre, req.query.apellidos, 
        req.query.correo, req.query.clave, req.query.sexo, req.query.usuario],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `AGREGAR ${req.query.cedula}`, DDL.INSERT, TABLE.PROFESOR);
            res.send(rows);
        }else{
            res.send(err);
        }
    });
});
router.get('/admin/profesor/agregarAso',ensureToken,(req,res)=>{
    con.query('INSERT INTO t_profesor(usuario,rol,aso) values(?,2,1)',[req.query.data],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `AGREGAR ASOCIADO ${req.query.data}`, DDL.INSERT, TABLE.PROFESOR);
            res.send(rows);
        }else{
            res.send(err);
        }
    });
});

router.get('/admin/profesor/actualizar',ensureToken,(req,res)=>{
    con.query("update t_usuario set usuario = ?, correo = ? where cedula = ?",
    [req.query.username, req.query.correo, req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `ACTUALIZA DATOS -> ${req.query.cedula}`, DDL.UPDATE, TABLE.PROFESOR);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.post('/admin/profesor/cambiarClave',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            con.query('call prc_actualizar_clave_sha1_usuario(?, ?)',
            [req.body.cedula, req.body.clave],(err,rows,fields)=>{
                let usuario = req.session.value;
                let token = req.session.token;
                let s = 'estudiantes';
                if(!err){
                    res.render('admin/profesores', {usuario,s,token});
                }else{
                    res.render('admin/profesores', {usuario,s,token});
                }
            });
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
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


