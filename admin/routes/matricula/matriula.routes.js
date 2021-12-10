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
const qr = require("qrcode");
const path = require('path');
const fs = require('fs');

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
    let textCursos = "";
    let text = "";
    for(let i = 0; i < req.body.grupos.length; i++){
        let grupo = req.body.grupos[i];
        let allG = req.body.gruposAll[i];
        text += `${req.body.estudiante}-${allG.nivel}-${allG.allp}-${grupo}.`;
        textCursos += `<p style="background-color:#edf0ff;padding:5px 8px; color:black; border-radius:5px;">Nivel: ${allG.nivel} - Dias: ${allG.allp}</p>`;
    }
    for(let i = 0; i < req.body.grupos.length; i++){
        let grupo = req.body.grupos[i];
        let allG = req.body.gruposAll[i];
        con.query("call prc_insertar_matricula(?,?)", // grupo, estudiante
            [grupo, req.body.estudianteId],
            (err,result,fields)=>{
            if(!err){
                logSistema(req.session.value.cedula, `${req.body.estudiante + " | MATRICULAR " + grupo}`, DDL.INSERT, TABLE.MATRICULA);
                console.log('matricula insertada');
            }else{
                console.log(err);
                // res.send(err);
            }
        });
        if(i == req.body.grupos.length - 1){
            let imagePathname = `temp${grupo}-${req.body.estudiante}.png`
            qr.toFile(path.join(__dirname,"../../public/QRcodes/"+imagePathname),text)
            .then(url => {
                var mailOptions = {
                    name:'SIAP - Matricula',
                    from: 'siapduna2020@gmail.com',
                    to:  req.body.correo, // ianmorar03@gmail.com',
                    subject: 'Confirmacion de Matricula',
                    html: `
                        <body style="background-color:rgb(255,255,255);color:rgb(0,0,0);">
                            <div style="background-color:rgb(255,255,255);color:rgb(0,0,0);">
                                <div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">
                                    <h1 style="#ffffff">SIAP</h1>
                                </div>
                                <img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">
                                <h1>${req.body.estudiante}</h1>
                                <p>Usted ha sido Matriculado en los siguientes cursos:</p><br>
                                ${textCursos}
                                <p>Debe presentar el codigo QR para poder ingresar a la piscina:</p>
                            </div>
                        </body>
                    `,
                    attachments: [{
                        filename: 'Codigo QR.png',
                        content: fs.createReadStream('public/QRcodes/'+imagePathname)
                    }]
                };
                email.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('send')
                        fs.unlinkSync(path.join(__dirname,`../../public/QRcodes/${imagePathname}`));
                        res.send({result: "success"});
                        console.log('Email sent: ' + info.response);
                    }
                });
            })
            .catch(err => {
                console.error(err)
            })
        }
        
    }
});
router.get('/admin/matricula/qr/check',(req,res)=>{
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
router.get('/admin/matricula/add/:cedula',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let token = req.session.token;
            let s = 'matricula';
            let est = req.params.cedula;
            res.render('admin/matricula', {usuario,s,token,'add':'true','est':est});
        }else{
            res.redirect('/admin/login');
        }
    }else{
        res.redirect('/admin/login');
    }
});
router.post('/admin/matricula/cambiarEstado/matricula',ensureToken,(req,res)=>{
    console.log(req.body);
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
            con.query("call prc_eliminar_matricula(?,?,?)",
            [req.body.matriculaid,cupo,req.body.idGrupo], (err,result,fields)=>{
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


