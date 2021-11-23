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
// TODO: CRUD
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const nodemailer = require('nodemailer');

var email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siapduna2020@gmail.com',
    pass: 'Perroloco123!'
  }
});

const {logSistema, DDL, TABLE} = require('../../systemLogs');

const con = require('../../database');
// ? ---------------------------------------------------------- Matricula CRUD ----------------------------------------------------------

router.post('/admin/matricula/matricularCursos', ensureToken, (req,res)=>{
    con.query("call prc_insertar_matricula(?,?)",
        [req.body.grupo, req.body.estudiante],
        (err,result,fields)=>{
        if(!err){
            // var mailOptions = {
            //     name:'SIAP - Matricula',
            //     from: 'siapduna2020@gmail.com',
            //     to: req.body.correo,
            //     subject: 'Confirmacion de Matricula',
            //     html: '<body style="background="white"><div style="background:white;color:black;"><div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
            //         '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
            //         '</div>' +
            //         '<h1>' + req.body.estudiante+'</h1>' +
            //         `<p>Usted ha sido Matriculado en el curso de ${req.body.curso} el dia ${req.body.fecha} a las ${req.body.hora} horas
            //         </p><br>
            //         </div>
            //         </body>
            //         `
            // };
            // email.sendMail(mailOptions, function(error, info){
            //     if (error) {
                  
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //     }
            // });
            logSistema(req.session.value.cedula, `${req.body.estudiante + " | MATRICULAR " + req.body.grupo}`, DDL.INSERT, TABLE.MATRICULA);
            res.send(result);
        }else{
            res.send(err);
        }
    });
});


router.post('/admin/matricula/cambiarEstado/matricula',ensureToken,(req,res)=>{
    con.query("call prc_actualizar_matricula_estudiante(?,?)",
        [req.body.curso_id,req.body.estado], (err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(501).send('error'); 
        }else{
            logSistema(req.session.value.cedula, `${req.body.estudiante + " | MOVER ESTADO ->" + req.body.estado}`, DDL.UPDATE, TABLE.MATRICULA);
            res.send('ok');
        }
    });
});

router.post('/admin/matricula/desmatricular',ensureToken,(req,res)=>{
    con.query("SELECT cupo_actual FROM t_grupo where id = ?",
        [req.body.idGrupo], (err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(501).send('error'); 
        }else{
            let cupo = result[0].cupo_actual - 1;
            con.query("call prc_eliminar_matricula(?,?)",
            [req.body.matriculaid,cupo], (err,result,fields)=>{
                if(err){
                    console.log(err);
                    res.status(501).send('error'); 
                }else{
                    logSistema(req.session.value.cedula, `${"DESMATRICULAR | "+req.body.estudiante}`, DDL.UPDATE, TABLE.MATRICULA);
                    res.send('ok');
                }
            });
        }
    });
});

router.get('/api/admin/matricula/reportes',ensureToken,(req,res)=>{
    con.query("select * from t_matricula_reporte",
    (err,rows,fields)=>{
        if(err){
            res.status(501).send(err); 
        }else{
            res.send(rows);
        }
    });
});
router.get('/admin/matricula/listaMatriculados',(req,res)=>{
    var script = 'select * from vta_matriculados_por_grupo';
    con.query(script,(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }
        else{
            res.status(501).send(err);
        }
    });
});
// ! ----------------------------------- SECURITY ------------------------------------
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


