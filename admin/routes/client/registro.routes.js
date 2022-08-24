const express = require('express');
const router = express.Router();
const request = require('request-promise');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const qr = require("qrcode");
const path = require('path');
const fs = require('fs');
require('dotenv').config();

var email = require('../../email');

const con = require('../../database');


router.get('/matricula/cliente', (req, res) => {
    let cedula = req.params.cedula || "";
    res.render('matriculaCliente',{cedula});
});

router.get('/matricula/confirmacion', (req, res) => {
    res.render('matriculaconfirmacion');
});

router.get('/matricula/cursos/checkcantidad', (req, res) => {
    con.query("select * from vta_matriculados_por_grupo where cedula = ?", [req.query.cedula],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.status(401).send(err);
        }
    });
});
router.get('/estudiante/info', (req, res) => {
    con.query("select nombre, apellido, foto from vta_cliente_estudiante where cedula = ?", [req.query.cedula],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows[0]);
        }else{
            res.status(401).send(err);
        }
    });
});
router.get('/registro/do', (req, res) => {
    var data = req.session.registroTemp;
    con.query("CALL prc_insertar_usuario_matricula(?,?,?,?,?,?,?,?,?)",
    [data.cedula, data.nombre, data.apellido, data.nacimiento, data.nombreUsuario, 
        data.sexo, data.tipoUser, data.email,data.clave],
    (err,rows,fields)=>{
        if(!err){
            console.log("Usuario Registrado")
            res.redirect('/matricula/cliente');
        }else{
            console.log(err);
            res.redirect('/registrarse');
        }
    });
});

router.post('/usuario/registrarse',(req,res)=>{
    if(Object.keys(req.body).length === 0){
        res.status(501).send({status: 'datos_invalidos'});
    }else{
        console.log("Verified")
        req.session.registroTemp = req.body;
        res.send({status: 'ok', data: req.body.cedula});
    }
});
router.post('/matricula/cursos/client',(req,res)=>{
    let textCursos = "";
    let text = `${req.body.cedula}`;
    let estudiante;
    for(let i = 0; i < req.body.grupos.length; i++){
        let grupo = req.body.grupos[i];
        let allG = req.body.gruposAll[i];
        textCursos += `<p style="background-color:#edf0ff;padding:5px 8px; color:black; border-radius:5px;">${allG.descripcion} | Dia: ${allG.dia} de ${allG.hora} - ${allG.hora_final}</p>`;
    }
    con.query("select * from vta_cliente_estudiante where cedula = ?",
    [text],(err,rows,fields)=>{
        if(!err){
            estudiante = rows[0];
            for(let i = 0; i < req.body.grupos.length; i++){
                let grupo = req.body.grupos[i];
                con.query("call prc_insertar_matricula(?,?)", // grupo, estudiante
                    [grupo, estudiante.id_estudiante],
                    (err,result,fields)=>{
                    if(!err){
                        console.log('Matriculado')
                    }else{
                        console.log(err);
                    }
                });
                con.query("update t_estudiante set nivel = ? where id = ?",
                    [parseInt(req.body.gruposAll[i].nivel), parseInt(estudiante.id_estudiante)],
                    (err,result,fields)=>{
                    if(!err){
                        console.log('Cambio de Nivel')
                    }else{
                        console.log(err);
                    }
                });
                if(i == req.body.grupos.length - 1){
                    let imagePathname = `temp${grupo}-${estudiante.id_estudiante}.png`
                    qr.toFile(path.join(__dirname,"../../public/QRcodes/"+imagePathname),text)
                    .then(url => {
                        var mailOptions = {
                            name:'SIAP - Matricula',
                            from: 'SIAP UNA <siapduna2020@gmail.com>',
                            to: process.env.ENV != "dev" ? estudiante.correo: "ianmorar03@gmail.com" ,
                            subject: 'Confirmacion de Matricula',
                            html: `
                                <body style="background-color:rgb(255,255,255);color:rgb(0,0,0);">
                                    <div style="background-color:rgb(255,255,255);color:rgb(0,0,0);">
                                        <div style="padding: 5px 10px; width: 100%; background-color: rgb(184, 22, 22);">
                                            <img src="https://siapdpe.com/img/logo-vive-promocion-transparency.png" width="75px" style="background-color: white; margin:0; padding:0;">
                                            <h1 style="color:#ffffff">Sistema de Administración de la Piscina | Departamento de Promocion Estudiantil</h1>
                                        </div>

                                        <h1>${estudiante.nombre +" "+ estudiante.apellido}</h1>
                                        <p>Usted ha matriculado los siguientes cursos:</p><br>
                                        ${textCursos}
                                        <p>Debe presentar el codigo QR para poder ingresar a la piscina.</p>
                                        <p style="color:red;"><b>Por favor no contestar este correo.</b> Las solicitudes no se atienden por este correo. De tener una consulta hacerlo al correo <a href="mailto:piscinadpe@una.cr">piscinadpe@una.cr</a></p>
                                    </div>
                                </body>
                            `,
                            attachments: [{
                                filename: 'codigo_qr.png',
                                content: fs.createReadStream('public/QRcodes/'+imagePathname)
                            }]
                        };
                        email.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                fs.unlinkSync(path.join(__dirname,`../../public/QRcodes/${imagePathname}`));
                                console.log('Email sent: ' + info.response);
                                res.send({result: "success"});
                            }
                        });
                    })
                    .catch(err => {
                        console.error(err)
                    })
                }
            }
        }else{
            res.status(501).send({err:'NotFound'});
        }
    });
    
});

router.get('/verify/estudiante/is', (req, res) => {
    con.query("SELECT * FROM vta_cliente_estudiante WHERE cedula = ? AND clave = sha1(?)",
    [req.query.cedula, req.query.clave],
    (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                res.send(true);
            }else{
                res.send(false);
            }
        }else{
            res.send(false);
        }
    });
});

module.exports = router;