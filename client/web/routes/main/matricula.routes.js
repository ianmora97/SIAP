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
    * Matricula del estudiante /
*/

const express = require('express');
const router = express.Router();

const con = require('../../database');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siapduna2020@gmail.com',
    pass: 'Perroloco123!'
  }
});

router.post('/solicitud/cambioClave', (req, res) => {
    con.query("SELECT * FROM siap.vta_cliente_estudiante where cedula = ? and correo = ?",
    [req.body.cedula, req.body.correo],
    (err,rows,fields)=>{
        if(!err){
            if(rows[0] != undefined){
                let user = {
                    cedula : req.body.cedula,
                    correo : req.body.correo
                }
                jwt.sign({user},'secretKeyToken',(err,token)=>{
                    if(err){
                        console.log(err)
                    }else{
                        req.session.solicitudClave = user;
                        var mailOptions = {
                            name:'SIAP - Registro',
                            from: 'siapduna2020@gmail.com',
                            to: req.body.correo,
                            subject: 'Sistema de Administracion de la Piscina',
                            html: '<body style="background:white;color:black;"><div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
                                '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
                                '</div>' +
                                '<h1>Solicitud de cambio de clave</h1>' +
                                `<p>Usted ha hecho una solicitud de cambio de clave, si no lo ha hecho omita este mensaje y consulte a un administrador, de lo contrario
                                siga a este link a continuacion para proceder con el cambio de la contraseña.</p><br>
                                <a href="localhost/solicitud/cambiar/clave?token=${token}">localhost/solicitud/cambiar/clave?token=${token}</a>
                                <h4 style="color:red;">Este link es de unico acceso, expira en el momento que se ingresa.</h4>
                                </body>
                                `
                        };
                        email.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error)
                            } else {
                                console.log('[Cambio Clave] Email sent: ' + info.response);
                                let fb = {
                                    text:'GOOD'
                                }
                                res.render('solicitudCambioClave',{fb});
                            }
                        });
                    }
                }); //json web token
            }else{
                let fb= {
                    text:'ERROR',
                    error:'No se encuentra Registrado'
                }
                res.render('solicitudCambioClave',{fb});
            }
                
        }else{
            let fb= {
                text:'ERROR',
                error:'Error en el sistema consulte a un administrador'
            }
            res.render('solicitudCambioClave',{fb});
        }
    });
    
});

router.get('/solicitud/cambiar/clave', (req, res) => {
    let tokenQ = req.query.token;
    jwt.verify(tokenQ, 'secretKeyToken', function(err, decoded) {
        if(err){
            let fb= {
                text:'ERROR',
                error:'Usted no ha solicitado ningun cambio o existe algun error en la solicitud consulte a un administrador'
            }
            res.render('solicitudCambioClave',{fb});
        }else{
            if(decoded != undefined){
                if(req.session.solicitudClave != undefined){
                    if(req.session.solicitudClave.cedula == decoded.user.cedula){
                        req.session.destroy((err) => {
                            let user = decoded.user;
                            res.render('cambiarClave',{user});
                        })
                    }else{
                        let fb= {
                            text:'ERROR',
                            error:'Usted no ha solicitado ningun cambio o existe algun error en la solicitud consulte a un administrador'
                        }
                        res.render('solicitudCambioClave',{fb});
                    }
                }else{
                    let fb= {
                        text:'ERROR',
                        error:'Usted no ha solicitado ningun cambio o existe algun error en la solicitud consulte a un administrador'
                    }
                    res.render('solicitudCambioClave',{fb});
                }   
            }else{
                let fb= {
                    text:'ERROR',
                    error:'Usted no ha solicitado ningun cambio o existe algun error en la solicitud consulte a un administrador'
                }
                res.render('solicitudCambioClave',{fb});
            }
        }
    });
})

router.post('/solicitud/cambiarClave', (req, res) => {
    con.query("call prc_actualizar_clave_sha1_usuario(?, ?)",[req.body.cedula, req.body.clave],(err,rows,fields)=>{
        if(!err){
            let fb= {
                text:'GOOD',
                feed:'Ingrese con su nueva clave.'
            }
            res.render('index',{fb});
        }else{
            res.render('index');
        }
    });
})

module.exports = router;


