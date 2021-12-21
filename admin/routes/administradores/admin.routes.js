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
const chalk = require('chalk');
const router = express.Router();
const nodemailer = require('nodemailer');

var email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siapduna2020@gmail.com',
    pass: 'Perroloco123!'
  }
});

const con = require('../../database');

router.get('/admin/administrador/agregarEstudiante',ensureToken,(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let d = req.query;
            
            res.send({type:"good"})
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

router.get('/admin/administrador/getAdministradores',ensureToken,(req,res)=>{
    let script = "select * from vta_administradores";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }
    });
});

router.get('/admin/administrador/eliminarAdministrador',ensureToken,(req,res)=>{
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

router.get('/admin/administrador/agregarAdministrador',ensureToken,(req,res)=>{
    let script = "call prc_insertar_administrador(?,?,?,?,?,?,?,?)";
    
    var query = con.query(script,
        [req.query.cedula, req.query.nombre,
        req.query.apellidos, req.query.usuario,
        req.query.clave, req.query.sexo, req.query.correo, req.query.rol],
        (err,rows,fields)=>{
        if(!err){
            var mailOptions = {
                name:'SIAP - Registro',
                from: 'siapduna2020@gmail.com',
                to: req.query.correo,
                subject: 'Sistema de Administracion de la Piscina',
                html: '<div style="background:white;color:black;"><div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
                    '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
                    '</div>' +
                    '<h1>' + req.query.nombre + ' ' + req.query.apellidos +'</h1>' +
                    `<p>Usted ha sido agregado como administrador en el SIAP.<br>
                    Ingrese con las siguientes credenciales:<br>
                    Cedula: ${req.query.cedula}<br>
                    Clave: ${req.query.clave}<br>        
                    </p><br>
                    <h4 style="color:red;">Estos accesos solo los debe mantener su persona.</h4>
                    </div>
                    `
            };
            email.sendMail(mailOptions, function(error, info){
                if (error) {
                  
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            logSistema(req.session.value.cedula, 'AGREGAR ADMINISTRATIVo -> '+req.query.cedula, 'AGREGAR', 'T_ADMINISTRATIVO');
            res.send(rows)
        }else{
            
            let error = {
                err:err,
                status:501
            }
            res.send(error);
        }
    });
});

router.get('/admin/administrador/getTables', ensureToken,(req,res)=>{
    con.query("SELECT * FROM information_schema.tables WHERE table_schema = 'siap'",
        (err,rows,fields)=>{
        if(!err){
            getColumnsTables(rows).then(resTables=>{
                let tables = resTables;
                getColumnsViews(rows).then(resViews=>{
                    let views = resViews;
                    res.send({tables,views});
                })
            })
        }
    });
});

router.get('/admin/administrador/runScript', ensureToken,(req,res)=>{
    con.query(req.query.text,
        (err,rows,fields)=>{
        if(!err){
            let [filas,campos,type] = [rows,fields,'good'];
            res.send({filas,campos,type});
        }else{
            let error={
                text: err,
                type: 'error'
            }
            res.send(error);
        }
    });
});

function getColumnsTables(data) {
    return new Promise((resolve,reject) => {
        let tablesVec = data.filter(e => e.TABLE_TYPE == 'BASE TABLE'); //vector de tablas
        let resTables = [];
        let cont1 = 0;
        tablesVec.forEach(e => {
            con.query(`SHOW FULL COLUMNS FROM ${e.TABLE_NAME}`,
                (err1,tableColumn,fields1)=>{
                if(!err1){
                    resTables.push({'name':e.TABLE_NAME, 'rows':tableColumn});
                    cont1++;
                    if(cont1 == tablesVec.length){
                        resolve(resTables);
                    }
                }
            });
        })
    })
}
function getColumnsViews(data) {
    return new Promise((resolve,reject) => {
        let tablesVec = data.filter(e => e.TABLE_TYPE == 'VIEW'); //vector de vistas
        let resTables = [];
        let cont1 = 0;
        tablesVec.forEach(e => {
            con.query(`SHOW FULL COLUMNS FROM ${e.TABLE_NAME}`,
                (err1,tableColumn,fields1)=>{
                if(!err1){
                    resTables.push({'name':e.TABLE_NAME, 'rows':tableColumn});
                    cont1++;
                    if(cont1 == tablesVec.length){
                        resolve(resTables);
                    }
                }else{
                    console.log(err1)
                }
            });
        })
    })
}

function logSistema(usuario, descripcion, ddl, tabla) {
    con.query("CALL prc_insertar_actividad(?,?,?,?)", [usuario, descripcion, ddl, tabla], (err,result,fields)=>{
        if(!err){
            console.log(`[ ${chalk.green('OK')} ] ${chalk.yellow('ACTIVITY')} (${usuario}) @ ${descripcion} | ${ddl} ON ${tabla}`);
        }else{
            console.log(err);
        }
    });
}

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


