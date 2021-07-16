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

const {logSistema, DDL, TABLE} = require('../../systemLogs')
const con = require('../../database');

router.get('/admin/estudiante/listaEstudiantes',ensureToken,(req,res)=>{
    var script = 'select * from vta_admin_estudiante;';
    con.query(script,(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    });
});

router.get('/admin/estudiante/getTalleres',ensureToken,(req,res)=>{
    let script = "select * from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err)
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
                    logSistema(req.session.value.cedula, `CAMBIO FOTO ${req.query.cedula}`, DDL.UPDATE, TABLE.ESTUDIANTE);
                    res.render('admin/estudiantes', {usuario,s,token});
                }else{
                    res.render('admin/estudiantes', {usuario,s,token});
                }
            });
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
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
                    logSistema(req.session.value.cedula, `CAMBIO CLAVE ${req.query.cedula}`, DDL.UPDATE, TABLE.ESTUDIANTE);
                    res.render('admin/estudiantes', {usuario,s,token});
                }else{
                    res.render('admin/estudiantes', {usuario,s,token});
                }
            });
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/admin/estudiante/actualizarNivel',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_nivel_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.nivel],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} NIVEL -> ${req.query.nivel}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
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
            console.log(err)
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/actualizarDatos',ensureToken,(req,res)=>{
    let d = req.query;
    con.query("CALL prc_actualizar_datos_estudiante_admin(?,?,?,?,?,?,?,?,?,?)",
    [d.cedula, d.correo, d.username, d.celular, d.telefono, 
        d.carrera, d.direccion, d.sexo, d.tipo, d.nacimiento],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} ACTUALIZA DATOS`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/eliminar',ensureToken,(req,res)=>{
    con.query("CALL prc_eliminar_usuario(?)",
    [req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `ELIMINAR USUARIO -> ${req.query.cedula}`, DDL.DELETE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.post('/admin/estudiantes/agregarEstudiantes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let d = req.body;
            console.log(d)
            con.query("CALL prc_insertar_usuario_admin(?,?,?,?,?,?,?,?)",
            [d.cedula_add, d.nombre_add, d.apellido_add, d.fechaNacimiento_add, d.username_add, d.sexo, d.perfil, d.correo_add],
            (err,rows,fields)=>{
                if(!err){
                    logSistema(req.session.value.cedula, `AGREGAR USUARIO -> ${req.body.cedula_add} `, DDL.INSERT, TABLE.ESTUDIANTE);
                    res.redirect('/admin/estudiantes');
                }else{
                    console.log(err)
                    res.redirect('/admin/estudiantes');
                }
            });       
        }
    }
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


